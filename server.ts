import { validateNames, aiErrorResponse } from './src/utils/liveAi.ts';
import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  generateIntelligentFallbackBrand,
  handleFallbackScopedOp,
  generateDynamicBrandSvg,
  buildPricing,
  buildCapitalFeasibility,
  analyzeIdea,
  buildMarketingDays,
  buildMarketingPosts,
} from './src/utils/domainBrandGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Helper to get GoogleGenAI client with required User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 60000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const TEXT_MODELS = process.env.GEMINI_TEXT_MODEL?.trim() ? [process.env.GEMINI_TEXT_MODEL.trim()] : [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];
const TEXT_MODEL = TEXT_MODELS[0];
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image';

// Circuit-breaker for models on temporary spike cooldown
const modelCooldowns = new Map<string, number>();

function isTransientOrQuotaError(err: any): { isError: boolean; isSpike: boolean } {
  if (!err) return { isError: false, isSpike: false };
  const status = err.status || err.statusCode || err.code;
  const msg = typeof err.message === 'string' ? err.message : JSON.stringify(err);
  
  const isSpike = status === 503 || msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('overloaded');
  const isQuota = status === 429 || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('rate-limit');
  
  return { isError: isSpike || isQuota, isSpike };
}

function getActiveTextModels(): string[] {
  const now = Date.now();
  const active = TEXT_MODELS.filter((model) => {
    const cooldownUntil = modelCooldowns.get(model);
    return !cooldownUntil || now >= cooldownUntil;
  });
  if (active.length === 0) {
    modelCooldowns.clear();
    return [...TEXT_MODELS];
  }
  return active;
}

// Strict timeout helper to prevent hanging requests on Cloud Run
function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// Call Gemini text models with automatic loop and fallback across models until one succeeds
async function callGeminiTextWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  config: any = {}
): Promise<string> {
  const maxRounds = 1;
  let lastError: any = null;

  for (let round = 0; round < maxRounds; round++) {
    const availableModels = round === 0 ? getActiveTextModels() : TEXT_MODELS;

    for (const model of availableModels) {
      try {
        const reqConfig: any = { ...config };
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
            config: reqConfig,
          }),
          60000,
          `Model ${model} timed out after 60s`
        );
        const text = response.text;
        if (text && text.trim().length > 0) return text;
      } catch (err: any) {
        lastError = err;
        if ([400, 401, 403, 429].includes(Number(err?.status || err?.code))) throw err;
        const { isError, isSpike } = isTransientOrQuotaError(err);
        if (isSpike || isError) {
          modelCooldowns.set(model, Date.now() + 10 * 1000);
          console.info(`[AI Shift] Model ${model} returned notice (${err?.message?.slice(0, 50)}), failing over to next model.`);
        } else {
          console.info(`[AI Shift] Model ${model} notice (${err?.message?.slice(0, 50)}), failing over to next model.`);
        }
      }
    }

    modelCooldowns.clear();
  }

  throw lastError || new Error('All Gemini text models in loop exhausted');
}

// In-memory rate limiting to prevent abuse
interface RateRecord {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateRecord>();

function checkRateLimit(req: Request, res: Response, maxPerWindow = 60, windowMs = 60000): boolean {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'local';
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxPerWindow) {
    res.status(429).json({
      error: 'تجاوزت الحد المسموح به من الطلبات مؤقتاً. يرجى الانتظار دقيقة واحدة ثم المحاولة مجدداً.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
    return false;
  }

  record.count += 1;
  return true;
}

// Bounded retry helper for transient network errors
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, delayMs = 1000): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // Do not retry authentication or billing errors
      const msg = String(err?.message || '');
      if (msg.includes('API_KEY_INVALID') || msg.includes('BILLING_DISABLED') || msg.includes('401') || msg.includes('PERMISSION_DENIED')) {
        throw err;
      }
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// Clean and parse JSON response safely with resilient recovery
function cleanAndParseJSON(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return {};
  let cleaned = rawText.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // Attempt to extract the outermost JSON object or array
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sliced = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(sliced);
      } catch (e2) {
        // Remove trailing commas before } or ]
        const sanitized = sliced.replace(/,\s*([}\]])/g, '$1');
        try {
          return JSON.parse(sanitized);
        } catch (e3) {
          // Attempt array extraction if object failed
        }
      }
    }
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const slicedArr = cleaned.slice(firstBracket, lastBracket + 1).replace(/,\s*([}\]])/g, '$1');
      try {
        return JSON.parse(slicedArr);
      } catch (e4) {
        // Fall through
      }
    }
    return {};
  }
}

function sendAiError(res: Response, error: unknown) {
  const failure = aiErrorResponse(error);
  return res.status(failure.status).json({ error: failure.error, code: failure.code });
}

app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// ==================== ENDPOINTS ==================== //

// 1. Status Check
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = !!getGeminiClient();
  res.json({
    status: 'ok',
    hasGeminiKey: hasKey,
    textModel: TEXT_MODEL,
    imageModel: IMAGE_MODEL,
    activeModels: getActiveTextModels(),
    message: hasKey
      ? 'مفتاح Gemini مهيأ. يتم التحقق من الاتصال عند طلب التوليد.'
      : 'مفتاح GEMINI_API_KEY غير مهيأ بعد.',
  });
});

// 1.1 AI Engine Health & Instant Restart
app.post('/api/brand/restart-ai', (req: Request, res: Response) => {
  modelCooldowns.clear();
  const hasKey = !!getGeminiClient();
  const activeModels = getActiveTextModels();
  res.json({
    ok: true,
    message: 'تمت إعادة تشغيل محرك الذكاء الاصطناعي وتصفير مؤقتات الانتظار.',
    activeModel: activeModels[0] || 'gemini-3.6-flash',
    hasKey,
  });
});

// 2. Full Brand Generation
app.post('/api/brand/generate', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    category,
    personality = 'عصري',
    city = 'القاهرة',
    targetAudience,
    budget,
    knownVariableCosts,
    knownMonthlyFixedCosts,
  } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 5) {
    return res.status(400).json({ error: 'يرجى كتابة فكرة مشروع من 5 أحرف على الأقل.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.warn('Gemini API key not found in server environment, using intelligent domain generator fallback.');
    const fallbackProject = generateIntelligentFallbackBrand({
      idea,
      category,
      personality,
      city,
      targetAudience,
      budget,
      knownVariableCosts,
      knownMonthlyFixedCosts,
    });
    return res.json(fallbackProject);
  }

  const prompt = `
أنت خبير استراتيجي في بناء العلامات التجارية والهويات التسويقية والتسعير في السوق المصري.
المشروع المطلوب:
- فكرة المشروع: ${idea}
- التصنيف: ${category || 'استنتج الأنسب بناء على الفكرة'}
- الطابع والشخصية: ${personality}
- المدينة / النطاق الجغرافي داخل مصر: ${city}
- الجمهور المستهدف: ${targetAudience || 'استنتج شريحة الجمهور المصري الأنسب'}
- الميزانية المبدئية التقديرية بالجنيه المصري: ${budget ? budget + ' ج.م' : 'غير محددة بدقة، ضع تقديراً منطقياً'}
- التكلفة المتغيرة التقديرية للوحدة: ${knownVariableCosts ? knownVariableCosts + ' ج.م' : 'اقترح رقماً تقريبياً'}
- التكاليف الثابتة الشهرية التقديرية: ${knownMonthlyFixedCosts ? knownMonthlyFixedCosts + ' ج.م' : 'اقترح تقديراً مناسباً'}

الشروط الإلزامية:
1. جميع المبالغ النقدية والميزانيات والتكاليف بالجنيه المصري فقط (EGP) وتُذكر بصيغة "ج.م" أو "جنيه مصري". يُحظر تماماً استخدام الدولار أو الريال أو أي عملة أخرى.
2. كافة الشروحات والنصوص والاستراتيجيات باللغة العربية الفصحى الواضحة والملهمة، مع لمسات مصرية راقية.
3. التوافق الدقيق للتسمية والمحتوى مع المجال (STRICT DOMAIN RELEVANCE):
   - يجب أن تكون جميع الأسماء الـ 6 والقصص والمنيو والتسعير متوافقة 100% مع التخصص الفعلي للمشروع "${idea}".
   - يُحظر تماماً استخدام القوالب الجاهزة أو خلط الأسماء بين القطاعات:
     * إذا كان المشروع أكلاً شعبياً مصرياً (مثل كبدة، سجق، حواوشي، مسمط، فول وطعمية، كشري):
       - يجب أن تكون جميع الأسماء الـ 6 مصرية أصيلة مستوحاة من الشارع والحارة والطشة واللقمة (مثل: كبدة الحارة، الصاج البلدي، كبدة البريمو، كبدة الفلاح، طشة ولمة، كبدة الخواجة، رغيف وسلطة).
       - يُمنع منعاً باتاً ومطلقاً اقتراح أسماء برجر أو مشويات غربية (مثل رواء برجر، شيفز لاونج) أو أسماء إيطالية (مثل أوريغانو بيسترو) لمطعم كبدة أو أكل شعبي مصري!
       - قصة البراند (story) يجب أن تكون قصة حسية حية عن نار الصاج، وطشة الثوم والخلطة، والفلفل الحار والليمون، والعيش البلدي الطازج، ولمة الشارع في مصر.
       - نبرة الصوت والترحيب: لهجة ترحيبية مصرية أصيلة وبشوشة تذكر اسم المكان تحديداً. يُحظر تماماً عبارة "عائلة براندنا".
       - قائمة الأصناف (pricing.items): منيو كبدة ومأكولات شعبية حقيقية (ساندوتش كبدة إسكندراني بالردة، ساندوتش سجق بلدي شرقي، رغيف حواوشي ع الفحم، طاجن كبدة، بطاطس مقلية بالدقة، سلطة خضراء وطحينة بلدي، كانز ساقع) بأسعار واقعية بالجنيه المصري (35 - 90 ج.م).
     * إذا كان المشروع عيادة أسنان أو مركزاً طبياً: أسماء طبية راقية تعبر عن الابتسامة والشفاء والرعاية (دنتاليا، صفاء سمايل، درّة، أورا كير). المنيو: قائمة إجراءات طبية حقيقية.
     * إذا كان مقهى: أسماء بن وتحميص ومزاج وارتواء.
     * إذا كان قانونياً: أسماء ميزان وعدالة وحماية.
     * إذا كان عقارياً: أسماء صرح وبنيان وأركان.
4. هيكل التسعير التفاعلي المخصص لطبيعة المشروع (Customized Pricing Structure):
   - وفر قائمة خدمات أو أصناف (items) حقيقية واقعية تمثل صميم عمل هذا المشروع بأسعار وتكاليف طعام/خدمة واقعية بالجنيه المصري EGP.
   - بجانب قائمة الأصناف، وفر 3 باقات/عروض مجمعة (tiers) مناسبة للسوق المصري.
5. الخطة التسويقية والـ 30 يوماً والمنشورات (STRICT HYPER-LOCAL & PRACTICAL MARKETING):
   - يُمنع منعاً باتاً ومطلقاً استخدام لغة المكاتب الاستشارية الجافة أو المصطلحات المؤسسية المتكلفة (مثل: "إبراز باقة القيمة"، "الضمان الذهبي"، "قمع المبيعات"، "تحقيق ميزة تنافسية مستدامة" في مطعم أو كشك أو مشروع محلي!).
   - يجب أن تكون لغة الخطة التسويقية سهلة، بسيطة، واقعية، ومفهومة جداً لصاحب المشروع وللمستهلك العادي، وقريبة جداً جداً جداً من قلب النشاط والتخصص الفعلي للمشروع "${idea}":
     * إذا كان المشروع مطعم كبدة أو مأكولات شعبية مصرية: الأنشطة تدور حول طشة الكبدة والسجق البلدي ع الصاج، ريحة الفحم والتوم والليمون، العيش السخن المقرمش، عزومة لمة الصحاب، مسابقة أحلى صورة ساندوتش مع الكانز، صينية المشكل العائلية، جوع آخر الليل وسهرة الفجر، أسرع دليفري سخن في ورق فويل حراري، كروت خصم حبايب المحل.
     * إذا كان كافيه: ريحة البن المحمص، لاتيه آرت، فنجان قهوة الصباح مع كرواسون هدية، مساحة المذاكرة والعمل الهادي، إيحاءات البن وتذوق النكهات، قهوة مثلجة في الصيف.
     * إذا كانت عيادة أسنان: كشف واستشارة وقائية مجانية، إزالة جير الأسنان بدون ألم، نصائح يومية بالخيط الطبي، صور ابتسامة قبل وبعد، إجابة أسئلة الخوف من طبيب الأسنان، الحجز السريع عبر الواتساب.
     * إذا كان أي مجال آخر: خاطب العميل بلغة بسيطة ومباشرة تمس احتياجه الفعلي دون مصطلحات تسويقية معقدة.
   - لكل يوم من الـ 30 يوماً، يجب توفير شرح تنفيذي مفصل ("explanation") من 3-4 أسطر يشرح لصاحب المشروع كيف يطبق النشاط خطوة بخطوة بالعامية المصرية الراقية والسهلة.
6. برومبتات اللوجو والأفاتار (logoPrompt و avatarPrompt) باللغة الإنجليزية حصراً وبتفاصيل هندسية احترافية تتناسب مع طبيعة النشاط.
7. الالتزام الصارم بإرجاع JSON صالح ومطابق تماماً للهيكل التالي بدون أي مقدمات أو نصوص خارج كائن الـ JSON.

الهيكل المطلوب بدقة:
{
  "brief": {
    "category": "تصنيف النشاط الدقيق باللغة العربية",
    "businessModel": "physical أو online أو hybrid",
    "city": "${city}",
    "targetAudience": "وصف واضح ومحدد للجمهور المستهدف واحتياجاته في مصر",
    "pricingPosition": "budget أو mid أو premium أو luxury",
    "personality": "${personality}",
    "budgetEgp": ${budget ? Number(budget) : 50000},
    "knownVariableCostsEgp": ${knownVariableCosts ? Number(knownVariableCosts) : 50},
    "knownMonthlyFixedCostsEgp": ${knownMonthlyFixedCosts ? Number(knownMonthlyFixedCosts) : 15000},
    "assumptions": [
      "افتراض استراتيجي 1 يتعلق بحجم الإقبال والتكاليف في السوق المصري",
      "افتراض 2 يتعلق بالقنوات الأساسية للبيع والتوصيل"
    ]
  },
  "identity": {
    "names": [
      {
        "id": "name-1",
        "nameAr": "اسم عربي ملهم 1 متطابق 100% مع المجال",
        "nameEn": "English Name 1",
        "pronunciation": "طريقة النطق بالتشكيل أو الحروف اللاتينية",
        "meaning": "معنى الاسم وجذوره التراثية أو العصرية",
        "rationale": "سبب ملاءمة الاسم لفكرة المشروع بدقة",
        "story": "قصة براند مخصصة وثرية لهذا الاسم تحديداً (3-4 أسطر غنية برائحة ونكهة وتفاصيل المشروع الواقعية)",
        "positioning": "التموضع السوقي المميز لهذا الاسم في الحي والمدينة",
        "greetingExample": "ترحيب ترويجي دافئ باللهجة المصرية يذكر اسم المحل صراحة (مثل: نورت [اسم المحل]! الصاج سخن وريحة الأكل هترد الروح...)",
        "promoExample": "عرض إعلاني مغرٍ مخصص لهذا الاسم",
        "matchingSlogan": "أفضل شعار لفظي متناسق مع هذا الاسم",
        "emotionalAssociations": ["إحساس 1", "إحساس 2", "إحساس 3"],
        "style": "شعبي أصيل / عصري / مبتكر / تراثي",
        "tradeoff": "ميزة أو تحدي عملي مختصر",
        "recommended": true
      }
      // وفر إجمالي 6 أسماء متخصصة تماماً (name-1 حتى name-6) مع القصة والترحيب الخاص بكل اسم
    ],
    "selectedNameId": "name-1",
    "slogans": [
      {
        "id": "slogan-1",
        "text": "الشعار اللفظي المقترح 1",
        "meaning": "الرسالة الجوهرية التي ينقلها الشعار",
        "rationale": "لماذا يعلق في ذهن الزبون المصري",
        "useCase": "في اللافتات والإعلانات والسوشيال ميديا"
      }
      // وفر إجمالي 4 شعارات لفظية متباينة (slogan-1 حتى slogan-4)
    ],
    "selectedSloganId": "slogan-1",
    "strategy": {
      "story": "قصة البراند المركزية للاسم الأول (فقرة حية من 3-4 أسطر مشبعة بتفاصيل الفكرة الواقعية وروائحها ومشاعرها وتجربة الزبون)",
      "purpose": "الغاية والهدف الأسمى وراء إطلاق هذا المشروع",
      "mission": "الرسالة اليومية للبراند تجاه زبائنه",
      "vision": "الرؤية المستقبلية خلال 3-5 سنوات",
      "values": ["القيمة 1", "القيمة 2", "القيمة 3", "القيمة 4"],
      "positioning": "المكانة السوقية والتموضع التنافسي للبراند في مصر",
      "valueProposition": "عرض القيمة الفريدة وما يميزه عن أي منافس تقليدي",
      "differentiators": ["عنصر التميز 1", "عنصر التميز 2", "عنصر التميز 3"],
      "audienceNeeds": ["احتياج رئيسي 1", "احتياج 2", "احتياج 3"],
      "coreMessages": ["رسالة إعلانية 1", "رسالة 2", "رسالة 3"]
    },
    "voice": {
      "traits": ["صفة نبرة 1", "صفة 2", "صفة 3", "صفة 4"],
      "doSay": ["عبارة يُفضل قولها 1", "عبارة 2", "عبارة 3"],
      "doNotSay": ["عبارة يُتجنب قولها 1", "عبارة 2"],
      "greetingExample": "ترحيب مصري دافئ وبشوش يذكر الاسم المختار صراحة (يُحظر تماماً قول 'عائلة براندنا')",
      "promoExample": "مثال لكابشن إعلاني لعرض موسمي مغرٍ",
      "replyExample": "مثال للرد على استفسار أو إشادة زبون بذوق مصري أصيل"
    },
    "palette": [
      { "role": "primary", "nameAr": "اسم اللون الأساسي", "hex": "#7C3AED", "usageNote": "الهوية الأساسية، الأزرار والعناوين" },
      { "role": "secondary", "nameAr": "اللون الثانوي", "hex": "#22D3EE", "usageNote": "العناصر التفاعلية والبطاقات المساعدة" },
      { "role": "accent", "nameAr": "لون التمييز", "hex": "#F59E0B", "usageNote": "العروض الترويجية وعلامات لفت الانتباه" },
      { "role": "background", "nameAr": "لون الخلفية", "hex": "#0B1020", "usageNote": "الخلفيات العامة ومساحات التنفس" },
      { "role": "text", "nameAr": "لون النصوص", "hex": "#F8FAFC", "usageNote": "القراءة والنصوص الرئيسية مع تباين عالي" }
    ]
  },
  "pricing": {
    "format": "services أو menu أو products أو packages",
    "items": [
      {
        "id": "item-1",
        "name": "اسم الخدمة أو الإجراء أو الطبق التفصيلي",
        "category": "تصنيف الخدمة داخل النشاط",
        "priceEgp": 300,
        "costEgp": 60,
        "unit": "للكشف / للجلسة / للوجبة / للقطعة",
        "description": "شرح موجز ودقيق لما يشمله الإجراء أو الطبق",
        "popular": true
      }
      // وفر 6 إلى 8 خدمات/أصناف تفصيلية واقعية بالجنيه المصري EGP
    ],
    "tiers": [
      {
        "id": "tier-1",
        "title": "الباقة الأولى أو العرض الفردي الاقتصادي",
        "targetAudience": "الفئة المستهدفة لهذه الباقة",
        "inclusions": ["ميزة أو عنصر 1", "عنصر 2", "عنصر 3"],
        "priceEgp": 120,
        "billingUnit": "للطلب / للوجبة / للخدمة",
        "rationale": "مبرر التسعير ومناسبته للسوق المصري",
        "variableCostEgp": 55
      },
      {
        "id": "tier-2",
        "title": "الباقة الثانية (الأكثر طلباً وتوازناً)",
        "targetAudience": "الجمهور المستهدف",
        "inclusions": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4"],
        "priceEgp": 240,
        "billingUnit": "للطلب / للباقة",
        "rationale": "أعلى قيمة مقابل السعر ومحرك المبيعات الأساسي",
        "variableCostEgp": 105
      },
      {
        "id": "tier-3",
        "title": "الباقة الثالثة (العائلية أو الشاملة المميزة)",
        "targetAudience": "العملاء الأكثر ولاءً أو المجموعات",
        "inclusions": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4", "قيمة مضافة إضافية"],
        "priceEgp": 480,
        "billingUnit": "للباقة المتكاملة",
        "rationale": "لتعظيم الربحية وجذب فئة الباحثين عن التجربة الشاملة",
        "variableCostEgp": 190
      }
    ],
    "assumptions": [
      "الأسعار مبنية على استهلاك متوقع في السوق المصري ولا تشمل الضرائب أو مصاريف الشحن الإضافية إلا إذا تم ذكرها.",
      "تم حساب التكلفة المتغيرة بناء على أسعار الخامات المتوسطة الحالية."
    ],
    "statusNote": "أسعار تقديرية استرشادية ملائمة لطبيعة النشاط والمنطقة المختارة."
  },
  "marketing": {
    "audienceOverview": "تحليل سلوكيات واهتمامات الجمهور المستهدف في مصر وأوقات تواجدهم",
    "acquisitionChannels": [
      { "channel": "انستجرام وتيك توك", "rationale": "الأقوى لبناء الوعي البصري والمحتوى السريع والتفاعل" },
      { "channel": "فيسبوك ومجموعات المنطقة المحلية", "rationale": "للانتشار المجتمعي المباشر في الحي والمدينة المستهدفة" },
      { "channel": "التسويق الشفهي وإعلانات المشاهير الصغار (Nano-influencers)", "rationale": "لبناء الثقة السريعة وتجربة المنتج وتصوير ردود الأفعال" }
    ],
    "coreLaunchMessage": "الرسالة المركزية لحملة الإطلاق والتسويق",
    "days": [
      // 30 يوماً متتالياً مرقمة بدقة من 1 إلى 30، موزعة على 5 فترات:
      // الأيام 1-7: فترة الإطلاق والتوعية وبناء الفضول
      // الأيام 8-14: فترة تجربة العروض وتفعيل الحجوزات/الطلبات
      // الأيام 15-21: تعزيز الثقة ومراجعات العملاء والمحتوى التفاعلي
      // الأيام 22-28: عروض إعادة الشراء وتوسيع قاعدة العملاء
      // الأيام 29-30: تقييم الشهر الأول وإطلاق مفاجأة الشهر القادم
      {
        "dayNumber": 1,
        "period": "الأسبوع 1: الإطلاق والتوعية",
        "objective": "بناء الفضول وإعلان قدوم البراند بلغة مستوحاة من صميم النشاط",
        "action": "نشر فيديو تشويقي حقيقي عن تفاصيل العمل والمكونات واللقمة/الخدمة",
        "channel": "انستجرام وتيك توك",
        "deliverable": "فيديو قصير ريلز 15 ثانية بجودة عالية",
        "metric": "عدد المشاهدات ومعدل الحفظ والمشاركة",
        "explanation": "شرح تنفيذي مفصل من 3 إلى 4 أسطر يشرح لصاحب المشروع كيف يصور أو ينفذ هذا النشاط بأبسط طريقة وبالعامية المصرية المحببة دون أي تعقيد."
      }
      // اكمل بدقة حتى اليوم 30 مع توفير explanation لكل يوم بدون استثناء
    ],
    "posts": [
      {
        "id": "post-1",
        "platform": "انستجرام وتيك توك",
        "format": "ريلز تشويقي",
        "hook": "الجملة الافتتاحية الخاطفة في أول 3 ثوانٍ",
        "caption": "الكابشن الكامل والجاهز للنشر مباشرة بأسلوب جذاب وواضح",
        "visualDirection": "توجيهات بصرية دقيقة للإضاءة واللقطة وحركة الكاميرا",
        "videoScript": "السيناريو الكامل والمشاهد الصوتية والمرئية إن وُجدت",
        "cta": "دعوة العميل للتفاعل والطلب أو المتابعة",
        "hashtags": ["#هاشتاج_1", "#هاشتاج_2", "#هاشتاج_3", "#مصر"]
      },
      {
        "id": "post-2",
        "platform": "انستجرام وفيسبوك",
        "format": "كاروسيل تعليمي وتفاعلي",
        "hook": "سر النكهة / الجودة التي لا تجدها في مكان آخر",
        "caption": "الكابشن الجاهز للنشر مع نقاط توضيحية للشرائح",
        "visualDirection": "تصميم كاروسيل من 4 شرائح متناسقة بألوان الهوية",
        "videoScript": "",
        "cta": "احفظ المنشور وشاركه مع صديقك المقرب",
        "hashtags": ["#براند_مصري", "#جودة_عالية", "#القاهرة"]
      },
      {
        "id": "post-3",
        "platform": "فيسبوك ومجموعات المجتمع",
        "format": "عرض افتتاحي وحصري",
        "hook": "بمناسبة الافتتاح، أول 50 عميل لهم ميزة خاصة!",
        "caption": "الكابشن الكامل والشروط ورابط الطلب المباشر",
        "visualDirection": "صورة عالية الجودة لعرض الافتتاح مع شعار البراند المعتمد",
        "videoScript": "",
        "cta": "اطلب الآن عبر رسائل الصفحة أو الواتساب",
        "hashtags": ["#افتتاح", "#عروض_مصر", "#تجربة_جديدة"]
      }
    ]
  },
  "visuals": {
    "visualDirection": "توجيهات بصرية للهوية: الأسلوب، البساطة، التكوين، والتطبيق",
    "logoPrompt": "Detailed English image generation prompt for a minimalist modern logo icon. Flat vector glyph, centered composition, plain dark or neutral background, using exact hex colors (#7C3AED and #22D3EE), geometric harmony, no embedded text or letters, pristine lines, vector graphic design, highly legible at small sizes.",
    "avatarPrompt": "Detailed English image generation prompt for a 1:1 square profile avatar. Clean circular silhouette safe area, centered bold iconic symbol corresponding to the logo identity, high contrast on solid background, minimalist, striking, modern mobile app icon style, no text."
  },
  "suggestions": {
    "identity": ["اقتراح سريع 1 مخصص للفكرة", "اقتراح سريع 2", "اقتراح سريع 3"],
    "pricing": ["اقتراح تسعير 1", "اقتراح تسعير 2", "اقتراح تسعير 3"],
    "marketing": ["اقتراح تسويقي 1", "اقتراح تسويقي 2", "اقتراح تسويقي 3"]
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    if (!text) {
      throw new Error('لم يقم النموذج بإرجاع نص مكتمل.');
    }

    let parsed: any;
    try {
      parsed = cleanAndParseJSON(text);
    } catch (parseErr) {
      try {
        const repairText = await callGeminiTextWithFallback(
          ai,
          `قم بإصلاح وتصحيح كائن الـ JSON التالي ليكون صالحاً تماماً بدون أي علامات خطأ:\n\n${text}`,
          { responseMimeType: 'application/json' }
        );
        parsed = cleanAndParseJSON(repairText || '{}');
      } catch (repairErr) {
        throw new Error('فشل تحليل كائن الـ JSON المولّد من النموذج.');
      }
    }

    // Validation & defaults enforcement
    if (!parsed.identity?.names || parsed.identity.names.length < 6) {
      parsed.identity = parsed.identity || {};
      parsed.identity.names = parsed.identity.names || [];
      while (parsed.identity.names.length < 6) {
        const i = parsed.identity.names.length + 1;
        parsed.identity.names.push({
          id: `name-${i}`,
          nameAr: `اسم مقترح ${i}`,
          nameEn: `Proposed Name ${i}`,
          meaning: 'اسم عصري يجسد هوية النشاط',
          rationale: 'سهل النطق وخفيف على الأذن',
          emotionalAssociations: ['ثقة', 'ابتكار', 'حيوية'],
          style: 'عصري',
          tradeoff: 'يحتاج انتشاراً تسويقياً في البداية',
          recommended: i === 1,
        });
      }
    }

    // Ensure 4 slogans
    if (!parsed.identity.slogans || parsed.identity.slogans.length < 4) {
      parsed.identity.slogans = parsed.identity.slogans || [];
      while (parsed.identity.slogans.length < 4) {
        const i = parsed.identity.slogans.length + 1;
        parsed.identity.slogans.push({
          id: `slogan-${i}`,
          text: `شعارك التنافسي الذكي ${i}`,
          meaning: 'رسالة إيجابية موجهة للمستهلك',
          rationale: 'واضح ومختصر',
          useCase: 'في منصات التواصل والإعلانات',
        });
      }
    }

    // Ensure 30 marketing days with rich domain-specific content & explanations
    const analysis = analyzeIdea(idea);
    const domainFallbackDays = buildMarketingDays(idea, analysis);
    const domainDaysMap = new Map(domainFallbackDays.map((d: any) => [d.dayNumber, d]));

    parsed.marketing = parsed.marketing || {};
    const existing = parsed.marketing.days || [];
    const daysMap = new Map(existing.map((d: any) => [d.dayNumber, d]));
    const fullDays = [];

    for (let day = 1; day <= 30; day++) {
      const fallbackDay = domainDaysMap.get(day);
      if (daysMap.has(day)) {
        const d: any = daysMap.get(day);
        fullDays.push({
          ...(typeof d === 'object' && d !== null ? d : {}),
          explanation: d?.explanation || fallbackDay?.explanation || `شرح تنفيذي لهذا اليوم:\n• الإجراء المطلوب: ${d?.action || ''}\n• القناة: ${d?.channel || ''}\n• المخرج: ${d?.deliverable || ''}\n• التوجيه: تجهيز المحتوى بلغة بسيطة وسهلة ومشاركته مع المتابعين لتحقيق التفاعل المطلوب.`,
        });
      } else if (fallbackDay) {
        fullDays.push(fallbackDay);
      }
    }
    parsed.marketing.days = fullDays;

    // Ensure 3 posts
    if (!parsed.marketing.posts || parsed.marketing.posts.length < 3) {
      parsed.marketing.posts = parsed.marketing.posts || [];
      while (parsed.marketing.posts.length < 3) {
        const i = parsed.marketing.posts.length + 1;
        parsed.marketing.posts.push({
          id: `post-${i}`,
          platform: 'انستجرام وفيسبوك',
          format: 'منشور تفاعلي',
          hook: `عرض مميز وفريد من نوعه ${i}`,
          caption: `نقدم لكم أفضل تجربة براند متكاملة بمواصفات وجودة استثنائية. تواصلوا معنا الآن!`,
          visualDirection: 'صورة نقية بألوان الهوية المعتمدة',
          cta: 'احجز أو اطلب الآن عبر الرسائل',
          hashtags: ['#براند', '#مصر', '#تسويق'],
        });
      }
    }

    // Ensure selectedNameId & selectedSloganId
    if (!parsed.identity.selectedNameId && parsed.identity.names[0]) {
      parsed.identity.selectedNameId = parsed.identity.names[0].id;
    }
    if (!parsed.identity.selectedSloganId && parsed.identity.slogans[0]) {
      parsed.identity.selectedSloganId = parsed.identity.slogans[0].id;
    }

    // Ensure pricing has items, categories, and proper format
    if (!parsed.pricing) {
      parsed.pricing = { tiers: [], items: [], assumptions: [], statusNote: '' };
    }
    if (!parsed.pricing.items || !Array.isArray(parsed.pricing.items) || parsed.pricing.items.length === 0) {
      const fallbackPricing = buildPricing(
        budget ? Number(budget) : 50000,
        knownVariableCosts ? Number(knownVariableCosts) : undefined,
        knownMonthlyFixedCosts ? Number(knownMonthlyFixedCosts) : undefined,
        analyzeIdea(idea)
      );
      parsed.pricing.items = fallbackPricing.items || [];
      if (!parsed.pricing.format) {
        parsed.pricing.format = fallbackPricing.format || 'services';
      }
    }

    // Ensure brief data matches inputs
    parsed.brief = {
      id: 'brief-1',
      idea,
      category: parsed.brief?.category || category || 'مشروع تجاري',
      businessModel: parsed.brief?.businessModel || 'hybrid',
      city: city || 'القاهرة',
      targetAudience: parsed.brief?.targetAudience || targetAudience || 'العملاء المهتمون في مصر',
      pricingPosition: parsed.brief?.pricingPosition || 'mid',
      personality: personality || 'عصري',
      budgetEgp: budget ? Number(budget) : parsed.brief?.budgetEgp || 50000,
      knownVariableCostsEgp: knownVariableCosts ? Number(knownVariableCosts) : parsed.brief?.knownVariableCostsEgp,
      knownMonthlyFixedCostsEgp: knownMonthlyFixedCosts ? Number(knownMonthlyFixedCosts) : parsed.brief?.knownMonthlyFixedCostsEgp,
      assumptions: parsed.brief?.assumptions || [
        'السوق المصري يفضل العروض المجمعة والواضحة في الأسعار.',
        'خدمة العملاء السريعة بالعامية المصرية الودية تصنع فارقاً تنافسياً.',
      ],
      provenance: {
        idea: 'user',
        category: category ? 'user' : 'proposal',
        personality: 'user',
        city: 'user',
        targetAudience: targetAudience ? 'user' : 'proposal',
        budgetEgp: budget ? 'user' : 'proposal',
        knownVariableCostsEgp: knownVariableCosts ? 'user' : 'proposal',
        knownMonthlyFixedCostsEgp: knownMonthlyFixedCosts ? 'user' : 'proposal',
      },
      briefRevision: 1,
    };

    res.json(parsed);
  } catch (error: any) {
    console.info('[AI Notice] Using intelligent domain fallback generator.');
    const fallbackProject = generateIntelligentFallbackBrand({
      idea,
      category,
      personality,
      city,
      targetAudience,
      budget,
      knownVariableCosts,
      knownMonthlyFixedCosts,
    });
    return res.json(fallbackProject);
  }
});

// 2.0A Sub-Second First Name Generation (~300ms ultra-lean for 1 premier name)
app.post('/api/brand/generate-first-name', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    category,
    personality = 'عصري',
    city = 'القاهرة',
  } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
    return res.status(400).json({ error: 'يرجى كتابة فكرة مشروع واضحة من 3 أحرف على الأقل.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallbackProject = generateIntelligentFallbackBrand({ idea, category, personality, city });
    return res.json({ name: fallbackProject.identity.names[0] });
  }

  const prompt = `
أنت خبير محترف في ابتكار أسماء العلامات التجارية في السوق المصري.
المشروع: "${idea}" (المدينة: ${city}، الطابع: ${personality}).
المطلوب فوراً وبسرعة فائقة: ابتكر اسماً واحداً فقط ممتازاً ومبتكراً ومخصصاً تماماً بنسبة 100% لطبيعة هذا النشاط بالتحديد مع كتابته بالإنجليزية، وتصنيف أسلوبه، وسبب التسمية في جملة واحدة.
قاعدة صارمة: الالتزام الحرفي بنشاط المشروع "${idea}". إذا كان مطعم بيتزا فالاسم عن البيتزا والمأكولات الإيطالية وأفران الحطب حصراً (ممنوع برجر أو كبدة أو كشري). إذا كان برجر فبرجر فقط. إذا كان كشري فكشري فقط.
أخرج فقط JSON صالح بدون ماركداون:
{
  "name": {
    "id": "name-1",
    "nameAr": "الاسم بالعربي",
    "nameEn": "English Name",
    "style": "عصري / تراثي / وصفي / رمزي",
    "rationale": "سبب التسمية وملاءمته التامة للفكرة"
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 250,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    if (parsed.name && parsed.name.nameAr) {
      if (!parsed.name.id) parsed.name.id = 'name-1';
      return res.json({ name: parsed.name });
    }
    const fallback = generateIntelligentFallbackBrand({ idea, category, personality, city });
    res.json({ name: fallback.identity.names[0] });
  } catch (err: any) {
    console.info('[AI Notice] Fast first-name fallback used.');
    const fallback = generateIntelligentFallbackBrand({ idea, category, personality, city });
    res.json({ name: fallback.identity.names[0] });
  }
});

// 2.0B Remaining 5 Names Generation (Names 2 to 6)
app.post('/api/brand/generate-remaining-names', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    category,
    personality = 'عصري',
    city = 'القاهرة',
    firstName,
  } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
    return res.status(400).json({ error: 'يرجى كتابة فكرة مشروع واضحة من 3 أحرف على الأقل.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallbackProject = generateIntelligentFallbackBrand({ idea, category, personality, city });
    return res.json({ names: fallbackProject.identity.names.slice(1, 6) });
  }

  const prompt = `
أنت خبير محترف في ابتكار أسماء العلامات التجارية في السوق المصري.
المشروع: "${idea}" (المدينة: ${city}، الطابع: ${personality}).
تم اختيار الاسم الأول سابقاً: "${firstName || ''}".
المطلوب: ابتكر 5 أسماء عربية إضافية متباينة (الأسماء من 2 إلى 6) ومخصصة تماماً لطبيعة هذا النشاط بالتحديد مع كتابة نطق الاسم بالإنجليزية، وتصنيف الأسلوب، وسبب التسمية في جملة واحدة.
قاعدة صارمة: الالتزام الحرفي بنشاط المشروع "${idea}". إذا كان مطعم بيتزا فالأسماء الخمسة كلها عن البيتزا والأفران الإيطالية فقط، وممنوع إطلاقاً اقتراح أسماء برجر أو مشويات أو كشري. إذا كان برجر فبرجر فقط. إذا كان كشري فكشري فقط.
أخرج فقط JSON صالح بدون ماركداون:
{
  "names": [
    { "id": "name-2", "nameAr": "اسم ثانٍ", "nameEn": "English", "style": "عصري", "rationale": "..." },
    { "id": "name-3", "nameAr": "اسم ثالث", "nameEn": "English", "style": "تراثي", "rationale": "..." },
    { "id": "name-4", "nameAr": "اسم رابع", "nameEn": "English", "style": "وصفي", "rationale": "..." },
    { "id": "name-5", "nameAr": "اسم خامس", "nameEn": "English", "style": "رمزي", "rationale": "..." },
    { "id": "name-6", "nameAr": "اسم سادس", "nameEn": "English", "style": "عصري", "rationale": "..." }
  ]
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 600,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    if (parsed.names && Array.isArray(parsed.names) && parsed.names.length >= 2) {
      const formatted = parsed.names.slice(0, 5).map((n: any, idx: number) => ({
        ...n,
        id: n.id || `name-${idx + 2}`,
      }));
      return res.json({ names: formatted });
    }
    const fallback = generateIntelligentFallbackBrand({ idea, category, personality, city });
    res.json({ names: fallback.identity.names.slice(1, 6) });
  } catch (err: any) {
    console.info('[AI Notice] Fast remaining-names fallback used.');
    const fallback = generateIntelligentFallbackBrand({ idea, category, personality, city });
    res.json({ names: fallback.identity.names.slice(1, 6) });
  }
});

// 2.0 Ultra-Fast Names & Slogans Generation (Blazing ~1s: 6 Tailored Names + Slogans)
app.post('/api/brand/generate-names', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    category,
    personality = 'عصري',
    city = 'القاهرة',
    district = '',
    targetAudience,
    budget,
    knownVariableCosts,
    knownMonthlyFixedCosts,
    avoidNames = [],
  } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
    return res.status(400).json({ error: 'يرجى كتابة فكرة مشروع واضحة من 3 أحرف على الأقل.' });
  }

  const locationText = district ? `${city} (حي ${district})` : city;
  const safeBudget = Number(budget) > 0 ? Number(budget) : 500000;
  const budgetText = `، رأس المال المرصود: ${safeBudget.toLocaleString('en-US')} ج.م`;

  const avoidList = Array.isArray(avoidNames) ? avoidNames.filter((n) => typeof n === 'string' && n.trim().length > 0) : [];
  const avoidClause = avoidList.length > 0
    ? `\nشرط إضافي ملزم وحاسم: المطلوب 6 أسماء جديدة كلياً ومبتكرة ومختلفة تماماً بنسبة 100% عن الأسماء التالية المقترحة سابقاً: [${avoidList.join('، ')}]. لا تكرر أي اسم منها أو اشتقاق مباشر منها، بل ابتكر زوايا جديدة تماماً!`
    : '';

  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق. أضفه من إعدادات الأسرار في Google AI Studio ثم أعد المحاولة.' });

  const prompt = `
أنت خبير محترف في ابتكار أسماء المشاريع والعلامات التجارية في السوق المصري.
المطلوب لفكرة المشروع التالية: "${idea}" (الموقع: ${locationText}${budgetText}، الطابع: ${personality}):
${avoidClause}

ابتكر 6 أسماء عربية مبدعة ومتباينة ومخصصة تماماً لطبيعة هذا النشاط بالتحديد بنسبة 100%.
قاعدة صارمة: الالتزام الحرفي بنشاط المشروع "${idea}". إذا كان مطعم بيتزا فالأسماء عن البيتزا فقط، إذا كان مسمط فالأسماء للمسمط والأكلات الشعبية فقط، إذا كان مركز أشعة فالأسماء للأشعة والتشخيص فقط، إذا كان مستشفى ولادة فالأسماء عن الأمومة والولادة فقط.
اكتب نطق كل اسم بالإنجليزية، وشرح سبب التسمية وملاءمته للفكرة في جملة واحدة.
واقترح 3 شعارات لفظية (سلوجان) جذابة وبالعامية المصرية الذكية أو الفصحى الرنانة.

أخرج فقط JSON صالح بدون ماركداون:
{
  "names": [
    {
      "id": "name-1",
      "nameAr": "الاسم بالعربي",
      "nameEn": "English Name",
      "style": "عصري / تراثي / وصفي / رمزي",
      "rationale": "سبب التسمية وملاءمته التامة للفكرة"
    },
    {
      "id": "name-2",
      "nameAr": "اسم ثانٍ",
      "nameEn": "English Name",
      "style": "عصري",
      "rationale": "سبب التسمية"
    },
    { "id": "name-3", "nameAr": "اسم ثالث", "nameEn": "...", "style": "...", "rationale": "..." },
    { "id": "name-4", "nameAr": "اسم رابع", "nameEn": "...", "style": "...", "rationale": "..." },
    { "id": "name-5", "nameAr": "اسم خامس", "nameEn": "...", "style": "...", "rationale": "..." },
    { "id": "name-6", "nameAr": "اسم سادس", "nameEn": "...", "style": "...", "rationale": "..." }
  ],
  "slogans": [
    { "id": "slogan-1", "text": "السلوجان الأول", "tone": "مباشر وجذاب" },
    { "id": "slogan-2", "text": "السلوجان الثاني", "tone": "عاطفي" },
    { "id": "slogan-3", "text": "السلوجان الثالث", "tone": "حماسي" }
  ]
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: avoidList.length > 0 ? 0.95 : 0.75,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    validateNames(parsed, avoidList);
    if (!Array.isArray(parsed.slogans) || parsed.slogans.length < 3 || parsed.slogans.some((item: any) => !item?.text?.trim())) throw new Error('Incomplete slogans');
    parsed.slogans = parsed.slogans.map((item: any, i: number) => ({ ...item, id: 'slogan-' + (i + 1) }));
    parsed.selectedNameId = parsed.names[0].id;
    parsed.selectedSloganId = parsed.slogans[0].id;
    parsed.brief = { idea, category: category || '', personality, city, district, targetAudience: targetAudience || '', budgetEgp: Number(budget) || undefined };
    parsed.source = 'gemini';
    parsed.generatedAt = new Date().toISOString();
    return res.json(parsed);
  } catch (err: any) {
    return sendAiError(res, err);
  }
});

// 2.1 Identity Details Generation (Strategy, Voice, Palette)
app.post('/api/brand/generate-identity-details', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    brandName,
    category,
    personality = 'عصري',
    city = 'القاهرة',
    district = '',
    targetAudience,
  } = req.body;

  const locationText = district ? `${city} (حي ${district})` : city;

  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق. أضفه من إعدادات الأسرار في Google AI Studio ثم أعد المحاولة.' });

  const prompt = `
أنت خبير استراتيجي في بناء هوية العلامات التجارية ونبرة الصوت في السوق المصري.
المشروع: "${idea}"، باسم: "${brandName || idea}" (الموقع: ${locationText}، الطابع: ${personality}).

المطلوب:
1. صياغة استراتيجية البراند ("strategy"):
   - قصة البراند ("story"): 3-4 أسطر غنية بنكهة النشاط وخصوصية المشروع وتذكر الاسم المختار صراحة.
   - الغاية ("purpose")، الرسالة ("mission")، الرؤية ("vision")، والقيم ("values": 4 قيم).
   - التموضع السوقي ("positioning")، وعرض القيمة ("valueProposition").
2. نبرة الصوت ("voice"):
   - السمات ("traits": 4 صفات).
   - ما يُفضل قوله ("doSay": 3 عبارات).
   - ما يُتجنب قوله ("doNotSay": 2 عبارة).
   - أمثلة مصرية حية ("greetingExample", "promoExample", "replyExample").
3. لوحة الألوان ("palette"): 5 ألوان احترافية (primary, secondary, accent, background, text) مع أكواد HEX وملاحظات الاستخدام.
4. الشعارات اللفظية ("slogans"): 3 شعارات لفظية ذكية ومحفزة وجذابة ملائمة لنبرة البراند.

أخرج فقط JSON مطابق لـ:
{
  "strategy": {
    "story": "...",
    "purpose": "...",
    "mission": "...",
    "vision": "...",
    "values": ["...", "...", "...", "..."],
    "positioning": "...",
    "valueProposition": "...",
    "differentiators": ["...", "...", "..."],
    "audienceNeeds": ["...", "...", "..."],
    "coreMessages": ["...", "...", "..."]
  },
  "voice": {
    "traits": ["...", "...", "...", "..."],
    "doSay": ["...", "...", "..."],
    "doNotSay": ["...", "..."],
    "greetingExample": "...",
    "promoExample": "...",
    "replyExample": "..."
  },
  "slogans": [
    { "id": "slogan-1", "text": "...", "tone": "مباشر وجذاب" },
    { "id": "slogan-2", "text": "...", "tone": "عاطفي" },
    { "id": "slogan-3", "text": "...", "tone": "حماسي" }
  ],
  "palette": [
    { "role": "primary", "nameAr": "اللون الأساسي", "hex": "#7C3AED", "usageNote": "..." },
    { "role": "secondary", "nameAr": "اللون الثانوي", "hex": "#22D3EE", "usageNote": "..." },
    { "role": "accent", "nameAr": "لون التمييز", "hex": "#F59E0B", "usageNote": "..." },
    { "role": "background", "nameAr": "لون الخلفية", "hex": "#0B1020", "usageNote": "..." },
    { "role": "text", "nameAr": "لون النصوص", "hex": "#F8FAFC", "usageNote": "..." }
  ],
  "suggestions": {
    "identity": ["اقتراح 1", "اقتراح 2", "اقتراح 3"]
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    if (!parsed.strategy?.story || !Array.isArray(parsed.strategy.values) || !Array.isArray(parsed.voice?.traits) || !Array.isArray(parsed.voice?.doSay) || !Array.isArray(parsed.voice?.doNotSay) || !Array.isArray(parsed.palette) || parsed.palette.length < 5 || !Array.isArray(parsed.slogans) || !parsed.slogans.length) throw new Error('Incomplete identity');
    return res.json(parsed);
  } catch (err: any) {
    return sendAiError(res, err);
  }
});

// 2.2 Modular Identity Generation (Combined)
app.post('/api/brand/generate-identity', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    idea,
    category,
    personality = 'عصري',
    city = 'القاهرة',
    targetAudience,
    budget,
    knownVariableCosts,
    knownMonthlyFixedCosts,
  } = req.body;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 3) {
    return res.status(400).json({ error: 'يرجى كتابة فكرة مشروع واضحة من 3 أحرف على الأقل.' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallbackProject = generateIntelligentFallbackBrand({
      idea,
      category,
      personality,
      city,
      targetAudience,
      budget,
      knownVariableCosts,
      knownMonthlyFixedCosts,
    });
    return res.json({
      brief: fallbackProject.brief,
      identity: fallbackProject.identity,
      suggestions: fallbackProject.suggestions,
    });
  }

  const prompt = `
أنت خبير استراتيجي في ابتكار أسماء وهويات العلامات التجارية في السوق المصري.
المشروع المطلوب:
- فكرة المشروع: ${idea}
- التصنيف: ${category || 'استنتج الأنسب بناء على الفكرة'}
- الطابع والشخصية: ${personality}
- المدينة / النطاق الجغرافي: ${city}
- الجمهور المستهدف: ${targetAudience || 'استنتج شريحة الجمهور المصري الأنسب'}

الشروط الإلزامية:
1. التوافق الدقيق للتسمية مع تخصص المشروع الحقيقي "${idea}":
   - ابتكر 6 أسماء عربية ملهمة ومتباينة مخصصة 100% لصميم هذا النشاط بدقة بالغة.
   - إذا كان براند ملابس أو أزياء أو كولكشن: أسماء أزياء وأناقة وقماش وخياطة وتفصيل ومظهر راقٍ (مثل: رداء، قماش، خيوط ومقص، ستيلو، غرزة ديزاين، كشخة).
   - إذا كان مطعماً أو أكلاً شعبياً مصرياً (كبدة، سجق، حواوشي، مسمط): أسماء أصيلة من الشارع ونار الصاج والطشة واللقمة (مثل: كبدة الحارة، الصاج البلدي، طشة ولمة، كبدة البريمو، كبدة الفلاح).
   - يُمنع منعاً باتاً ومطلقاً وضع كلمة "براند" أو "مشروع" داخل الاسم، أو اقتراح أسماء عامة جافة.
2. لكل اسم من الـ 6 أسماء: وفر الاسم بالعربي والإنجليزي، طريقة النطق، المعنى، سبب الاختيار، قصة مخصصة من 3 أسطر، نبرة الترحيب، والشعار اللفظي المتناسق.
3. وفر 4 شعارات لفظية، قصة البراند المركزية للاسم الأول، نبرة الصوت والترحيب باللهجة المصرية، ولوحة ألوان متناسقة من 5 ألوان بأكواد HEX دقيقة.
4. أرجع فقط JSON صالح مطابق للهيكل:

{
  "brief": {
    "category": "تصنيف النشاط الدقيق",
    "businessModel": "hybrid",
    "city": "${city}",
    "targetAudience": "وصف محدد للجمهور المستهدف واحتياجاته في مصر",
    "pricingPosition": "mid",
    "personality": "${personality}",
    "budgetEgp": ${budget ? Number(budget) : 50000},
    "knownVariableCostsEgp": ${knownVariableCosts ? Number(knownVariableCosts) : 50},
    "knownMonthlyFixedCostsEgp": ${knownMonthlyFixedCosts ? Number(knownMonthlyFixedCosts) : 15000},
    "assumptions": ["افتراض استراتيجي 1", "افتراض 2"]
  },
  "identity": {
    "names": [
      {
        "id": "name-1",
        "nameAr": "اسم عربي ملهم 1",
        "nameEn": "English Name 1",
        "pronunciation": "طريقة النطق بالتشكيل",
        "meaning": "معنى الاسم وجذوره",
        "rationale": "سبب ملاءمته لفكرة المشروع بدقة",
        "story": "قصة براند مشبعة بتفاصيل الفكرة الواقعية",
        "positioning": "التموضع السوقي في الحي والمدينة",
        "greetingExample": "ترحيب ترويجي دافئ باللهجة المصرية يذكر اسم المحل",
        "promoExample": "عرض إعلاني مغرٍ مخصص لهذا الاسم",
        "matchingSlogan": "أفضل شعار لفظي متناسق مع هذا الاسم",
        "emotionalAssociations": ["إحساس 1", "إحساس 2", "إحساس 3"],
        "style": "عصري / شعبي أصيل / فاخر",
        "tradeoff": "ميزة أو تحدي عملي",
        "recommended": true
      }
    ],
    "selectedNameId": "name-1",
    "slogans": [
      {
        "id": "slogan-1",
        "text": "الشعار اللفظي المقترح 1",
        "meaning": "الرسالة الجوهرية التي ينقلها الشعار",
        "rationale": "لماذا يعلق في ذهن الزبون المصري",
        "useCase": "في اللافتات والإعلانات والسوشيال ميديا"
      }
    ],
    "selectedSloganId": "slogan-1",
    "strategy": {
      "story": "قصة البراند المركزية للاسم الأول (فقرة حية من 3-4 أسطر غنية بنكهة وتفاصيل النشاط)",
      "purpose": "الغاية والهدف الأسمى",
      "mission": "الرسالة اليومية للبراند",
      "vision": "الرؤية المستقبلية خلال 3 سنوات",
      "values": ["القيمة 1", "القيمة 2", "القيمة 3", "القيمة 4"],
      "positioning": "المكانة السوقية والتموضع في مصر",
      "valueProposition": "عرض القيمة الفريدة للزبون",
      "differentiators": ["عنصر تميز 1", "عنصر 2", "عنصر 3"],
      "audienceNeeds": ["احتياج 1", "احتياج 2", "احتياج 3"],
      "coreMessages": ["رسالة إعلانية 1", "رسالة 2", "رسالة 3"]
    },
    "voice": {
      "traits": ["ودود", "واثق", "ملهم", "مباشر"],
      "doSay": ["يسعدنا خدمتك", "على الأصول", "جاهزون لمساعدتك"],
      "doNotSay": ["المشكلة مش عندنا", "ده النظام ومفيش تعديل", "الأسعار بالخاص فقط"],
      "greetingExample": "ترحيب مصري دافئ يذكر اسم المكان",
      "promoExample": "عرض إعلاني جذاب",
      "replyExample": "رد على استفسار"
    },
    "palette": [
      { "role": "primary", "nameAr": "اللون الأساسي", "hex": "#7C3AED", "usageNote": "الشعار والعناصر الرئيسية" },
      { "role": "secondary", "nameAr": "اللون الثانوي", "hex": "#22D3EE", "usageNote": "العناصر المساعدة" },
      { "role": "accent", "nameAr": "لون التمييز", "hex": "#F59E0B", "usageNote": "عروض لفت الانتباه" },
      { "role": "background", "nameAr": "لون الخلفية", "hex": "#0B1020", "usageNote": "المساحات العامة" },
      { "role": "text", "nameAr": "لون النص", "hex": "#F8FAFC", "usageNote": "تباين القراءة" }
    ]
  },
  "suggestions": {
    "identity": ["اقتراح إبداعي 1 مخصص للفكرة", "اقتراح 2", "اقتراح 3"]
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });
    const parsed = cleanAndParseJSON(text || '{}');

    // Ensure 6 names dynamically
    parsed.identity = parsed.identity || {};
    if (!parsed.identity.names || !Array.isArray(parsed.identity.names)) {
      parsed.identity.names = [];
    }
    const cleanWord = idea.trim().split(/\s+/).slice(0, 3).join(' ');
    while (parsed.identity.names.length < 6) {
      const idx = parsed.identity.names.length + 1;
      parsed.identity.names.push({
        id: `name-${idx}`,
        nameAr: `${cleanWord} ${idx === 2 ? 'بلس' : idx === 3 ? 'الأصلي' : idx === 4 ? 'إكسبريس' : idx === 5 ? 'العالمي' : 'الحديث'}`,
        nameEn: `${cleanWord} ${idx}`,
        style: 'عصري',
        rationale: `اسم مبتكر مشتق ومخصص لنشاط ${idea}`,
      });
    }

    parsed.brief = {
      idea,
      category: category || 'عام',
      personality: personality || 'عصري',
      city: city || 'القاهرة',
      targetAudience: targetAudience || '',
      budget: budget || '',
      knownVariableCosts,
      knownMonthlyFixedCosts,
    };

    res.json(parsed);
  } catch (err: any) {
    console.info('[AI Notice] Using intelligent identity fallback generator.');
    const fallbackProject = generateIntelligentFallbackBrand({
      idea,
      category,
      personality,
      city,
      targetAudience,
      budget,
      knownVariableCosts,
      knownMonthlyFixedCosts,
    });
    res.json({
      brief: fallbackProject.brief,
      identity: fallbackProject.identity,
      suggestions: fallbackProject.suggestions,
    });
  }
});

// 2.2 Modular Pricing Generation (Fast ~2s: Items, 3 Tiers in EGP, Margins, Breakeven)
app.post('/api/brand/generate-pricing', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const { idea, category, city = 'القاهرة', district = '', budget, knownVariableCosts, knownMonthlyFixedCosts, brandName } = req.body;
  const userBudgetNum = Number(budget) > 0 ? Number(budget) : 500000;
  const locationText = district ? `${city} (حي ${district})` : city;

  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق. أضفه من إعدادات الأسرار في Google AI Studio ثم أعد المحاولة.' });

  const prompt = `
أنت مستشار مالي وتسعير محترف في السوق المصري.
صمم هيكل تسعير متكامل ودراسة لرأس المال والمعدات بالجنيه المصري (EGP) لمشروع "${idea}" باسم "${brandName || idea}".
الموقع الجغرافي: ${locationText}
رأس المال المرصود: ${userBudgetNum.toLocaleString('en-US')} ج.م
التكلفة المتغيرة للوحدة: ${knownVariableCosts ? knownVariableCosts + ' ج.م' : 'اقترح رقماً تقريبياً بالجنيه'}
التكاليف الثابتة الشهرية: ${knownMonthlyFixedCosts ? knownMonthlyFixedCosts + ' ج.م' : 'اقترح تقديراً مناسباً'}

الشروط الإلزامية الصارمة 100%:
1. الالتزام الحرفي بنشاط وتخصص المشروع "${idea}":
   - إذا كان المشروع مستشفى أو مركز طبي أو عيادة: يجب أن تكون الأصناف (items) كلها 100% استشارات طبية، كشوفات استشارية، باقات تحاليل وفحوصات دورية، رعاية طبية وطوارئ، بدون أي خروج عن المجال الطبي!
   - إذا كان مقهى أو كافيه أو بن: مشروبات قهوة ساخنة وباردة (اسبريسو، لاتيه، قهوة تركي، كولد برو)، وبن مطحون، ومشروبات وحلويات خفيفة فقط!
   - إذا كان مطعم فلافل أو فول أو طعمية أو أكلات شعبية: ساندوتشات فول وفلافل وتحابيش مصرية فقط (ممنوع برجر أو مشويات أو بيتزا).
   - إذا كان مطعم بيتزا: بيتزا وباستا ومقبلات إيطالية فقط.
   - إذا كان مطعم كشري: كشري وطواجن وأرز باللبن فقط.
2. وفر 6 إلى 8 أصناف حقيقية تنافسية تمثل صميم هذا النشاط بأسعار واقعية بالجنيه المصري EGP تلائم القوة الشرائية في ${locationText}.
3. وفر 3 باقات تسعيرية متدرجة (tiers) تلائم طبيعة نشاط "${idea}" بالتحديد.
4. دراسة رأس المال والمعدات - قواعد الاتساق المالي والحسابي الصارمة:
   - التكلفة الحقيقية لتأسيس المشروع المطلوب ("${idea}"):
     قائمة المعدات وبنود التأسيس (startupBreakdown) ومجموعها (capexTotalEgp) يجب أن تمثل التكلفة الواقعية لتأسيس هذا النشاط ("${idea}") بالكامل في السوق المصري!
     فإذا كان رأس مال العميل (${userBudgetNum.toLocaleString('en-US')} ج.م) أقل من الحد الأدنى الواقعي للمشروع، اعرض بنود التأسيس الحقيقية لمشروع "${idea}" بالتفصيل (مثل المعدات المعتمدة، التراخيص، التجهيزات، رأس المال العامل).
   - الفارق المالي (gapOrSurplusEgp):
     الفارق المالي = رأس المال المرصود (${userBudgetNum.toLocaleString('en-US')} ج.م) ناقص تكلفة التأسيس الحقيقية (capexTotalEgp).
     إذا كان رأس المال أقل من تكلفة التأسيس، فيجب حتماً أن يكون الفارق سالباً (عجز مالي صريح بالسالب).
   - النموذج البديل المصغر (alternativeBreakdown):
     إذا كانت ميزانية العميل لا تكفي للمشروع بشكله الكامل، اذكر في recommendedModel و alternativeModelTitle نموذجاً بديلاً أو مرحلة انطلاق مصغرة مشتقة حصراً من نفس مجال وتخصص "${idea}"، وضع في alternativeBreakdown قائمة بنود النموذج البديل المتوافقة مع ميزانيته.
5. المبالغ بالجنيه المصري EGP فقط.

أخرج فقط JSON مطابق لـ:
{
  "pricing": {
    "format": "products أو services",
    "capitalFeasibility": {
      "userBudgetEgp": ${userBudgetNum},
      "minEstimatedBudgetEgp": 500000,
      "recommendedBudgetEgp": 800000,
      "status": "sufficient أو lean_viable أو insufficient",
      "verdictTitle": "عنوان تقييم الميزانية والجدوى لمشروع ${idea}",
      "verdictDescription": "شرح تفصيلي هل رأس المال كافٍ لمشروع ${idea} أم يحتاج زيادة أو البدء بنموذج مرحلي...",
      "recommendedModel": "النموذج الأمثل للبدء بهذه الميزانية في نشاط ${idea}",
      "startupBreakdown": [
        {
          "id": "eq-1",
          "name": "اسم المعدة أو بند التأسيس لنشاط ${idea}",
          "category": "معدات وآلات أو تجهيزات وتشطيب أو تراخيص وتأسيس أو سيولة تشغيل ومخزون",
          "estimatedCostEgp": 200000,
          "priority": "ضروري للبدء أو مرحلة ثانية أو اختياري للتوسع",
          "notes": "ملاحظة أو نصيحة شراء بالسوق المصري"
        }
      ],
      "capexTotalEgp": 500000,
      "gapOrSurplusEgp": 0,
      "alternativeModelTitle": "نموذج بديل أو مرحلة أولى لنشاط ${idea}",
      "alternativeCapexTotalEgp": 350000,
      "alternativeBreakdown": [
        {
          "id": "alt-1",
          "name": "بند بديل مصغر متوافق مع الميزانية",
          "category": "معدات وآلات",
          "estimatedCostEgp": 950000,
          "priority": "ضروري للبدء",
          "notes": "نصيحة شراء"
        }
      ],
      "advice": [
        "نصيحة عملية أولى للتعامل مع الميزانية",
        "نصيحة ثانية للتوفير وسرعة التشغيل"
      ]
    },
    "items": [
      {
        "id": "item-1",
        "name": "اسم الصنف أو الخدمة الحقيقية",
        "description": "وصف جذاب ومختصر",
        "priceEgp": 65,
        "costEgp": 30,
        "category": "تصنيف فرعي",
        "isPopular": true
      }
    ],
    "tiers": [
      {
        "id": "tier-1",
        "title": "الباقة الاقتصادية / التجربة",
        "targetAudience": "العملاء الجدد والباحثون عن تجربة سريعة",
        "inclusions": ["ميزة أو صنف 1", "ميزة 2"],
        "priceEgp": 95,
        "billingUnit": "للطلب",
        "rationale": "سعر دخول منخفض يشجع على التجربة الأولى",
        "variableCostEgp": 45
      },
      {
        "id": "tier-2",
        "title": "الباقة الأكثر طلباً / المتوازنة",
        "targetAudience": "أغلب العملاء واللمة",
        "inclusions": ["ميزة 1", "ميزة 2", "ميزة 3"],
        "priceEgp": 180,
        "billingUnit": "للطلب",
        "rationale": "تحقق أعلى قيمة مقابل السعر وأفضل هامش مساهمة",
        "variableCostEgp": 80
      },
      {
        "id": "tier-3",
        "title": "باقة العزومة الفاخرة / الشاملة",
        "targetAudience": "العائلات والتجمعات الكبرى",
        "inclusions": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4"],
        "priceEgp": 320,
        "billingUnit": "للطلب",
        "rationale": "باقة شاملة توفر أقصى تنوع للعميل",
        "variableCostEgp": 140
      }
    ],
    "assumptions": [
      "هامش الربح الإجمالي المتوقع يتراوح بين 45% و 60%",
      "نقطة التعادل الشهرية تعتمد على استمرار حجم الطلبات اليومي"
    ],
    "statusNote": "هيكل تسعير ودراسة رأس مال مدروسة بالجنيه المصري EGP"
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    const pricing = parsed.pricing;
    if (!Array.isArray(pricing?.tiers) || !Array.isArray(pricing?.assumptions) || !pricing?.capitalFeasibility?.startupBreakdown?.length) throw new Error('Incomplete pricing');
    return res.json(parsed);
  } catch (err: any) {
    return sendAiError(res, err);
  }
});

// 2.3 Modular Marketing Generation (Fast ~3s: Hyper-local 30 Days Plan + 3 Ready Posts)
app.post('/api/brand/generate-marketing', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const { idea, brandName, city = 'القاهرة', district = '', targetAudience } = req.body;
  const locationText = district ? `${city} (حي ${district})` : city;

  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق. أضفه من إعدادات الأسرار في Google AI Studio ثم أعد المحاولة.' });

  const prompt = `
أنت مدير تسويق ميداني في مصر متخصص في التسويق العملي للأنشطة المحلية.
المشروع: "${idea}" باسم "${brandName || idea}".
الموقع الجغرافي المستهدف: ${locationText}.
الجمهور المستهدف: ${targetAudience || 'المستهلكون في مصر'}.

الشروط الإلزامية الصارمة:
1. يُحظر تماماً استخدام لغة الشركات الاستشارية الجافة والمصطلحات المتكلفة (مثل: "إبراز باقة القيمة"، "الضمان الذهبي"، "قمع المبيعات").
2. يجب أن تكون لغة الخطة سهلة وبسيطة ومفهومة جداً لصاحب المشروع وللمستهلك العادي، وقريبة جداً جداً جداً من قلب النشاط والتخصص الفعلي للمشروع "${idea}".
3. أرجع خطة 30 يوماً متتالية مقسمة على أسابيع، مع توفير شرح تطبيقي بسيط ومباشر بالعامية المصرية الراقية ("explanation") لكل يوم يشرح كيف يطبق النشاط خطوة بخطوة.
4. وفر 3 منشورات جاهزة للنشر تشمل هوك جذاب، كابشن كامل، توجيهات بصرية، وسيناريو ريلز.

أخرج فقط JSON مطابق لـ:
{
  "marketing": {
    "audienceOverview": "وصف حقيقي لطبيعة الزبائن وسلوكهم في مصر",
    "acquisitionChannels": [
      { "channel": "انستجرام وتيك توك", "rationale": "للفيديوهات القصيرة ونار الكواليس" },
      { "channel": "فيسبوك والمجتمعات المحلية", "rationale": "للعروض وتفاعل الجيران" },
      { "channel": "واتساب للأعمال", "rationale": "لاستقبال الطلبات وخدمة الزبائن السريعة" }
    ],
    "coreLaunchMessage": "رسالة إطلاق تشويقية جذابة للمشروع",
    "days": [
      {
        "dayNumber": 1,
        "period": "الأسبوع 1: الإطلاق وبناء الوعي",
        "objective": "بناء الفضول وإعلان قدوم البراند",
        "action": "نشر فيديو تشويقي عن تفاصيل العمل والمكونات",
        "channel": "انستجرام وتيك توك",
        "deliverable": "فيديو ريلز 15 ثانية بجودة عالية",
        "metric": "عدد المشاهدات ومعدل الحفظ والمشاركة",
        "explanation": "شرح تطبيقي من أسطر بسيطة يشرح لصاحب المشروع كيف يصور أو ينفذ النشاط."
      }
      // أكمل 30 يوماً من 1 إلى 30
    ],
    "posts": [
      {
        "id": "post-1",
        "platform": "انستجرام وتيك توك",
        "format": "ريلز تشويقي وافتتاحي",
        "hook": "الخطاف الجذاب في أول 3 ثوان",
        "caption": "الكابشن الكامل والجاهز للنشر مباشرة",
        "visualDirection": "التوجيه البصري للتصوير",
        "videoScript": "السيناريو المقترح",
        "cta": "دعوة العميل للتفاعل أو الطلب",
        "hashtags": ["#هاشتاج1", "#مصر"]
      },
      {
        "id": "post-2",
        "platform": "فيسبوك وانستجرام",
        "format": "كاروسيل سر الجودة والمكونات",
        "hook": "سر النكهة / الخامة عندنا",
        "caption": "الكابشن الكامل",
        "visualDirection": "تصميم كاروسيل من 4 شرائح",
        "videoScript": "",
        "cta": "احفظ البوست وشاركه مع صاحبك",
        "hashtags": ["#جودة_عالية", "#مصر"]
      },
      {
        "id": "post-3",
        "platform": "فيسبوك وواتساب",
        "format": "عرض افتتاحي وحصري",
        "hook": "عرض الافتتاح المميز لأول الزوار",
        "caption": "الكابشن الكامل والشروط",
        "visualDirection": "صورة عالية الجودة للعرض",
        "videoScript": "",
        "cta": "اطلب الآن عبر رسائل الصفحة أو الواتساب",
        "hashtags": ["#افتتاح", "#عروض_مصر"]
      }
    ]
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    const days = parsed.marketing?.days;
    if (!Array.isArray(days) || days.length !== 30 || new Set(days.map((day: any) => day.dayNumber)).size !== 30 || days.some((day: any) => !Number.isInteger(day.dayNumber) || day.dayNumber < 1 || day.dayNumber > 30) || !Array.isArray(parsed.marketing?.posts) || !Array.isArray(parsed.marketing?.acquisitionChannels)) throw new Error('Incomplete marketing');
    return res.json(parsed);
  } catch (err: any) {
    return sendAiError(res, err);
  }
});

// 2.4 Modular Visuals Generation (Fast ~1.5s: Direction, Logo Prompt, Avatar Prompt)
app.post('/api/brand/generate-visuals', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const { idea, brandName, palette } = req.body;

  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق. أضفه من إعدادات الأسرار في Google AI Studio ثم أعد المحاولة.' });

  const prompt = `
أنت مصمم هويات بصرية عالمي.
صمم التوجيه البصري وبرومبتات توليد الشعار والأفاتار بالذكاء الاصطناعي لمشروع "${idea}" باسم "${brandName || idea}".
ألوان الهوية: الأساسي ${palette?.[0]?.hex || '#7C3AED'}، الثانوي ${palette?.[1]?.hex || '#22D3EE'}.

الشروط:
1. "visualDirection" باللغة العربية يشرح فلسفة البساطة والتباين والرمزية.
2. "logoPrompt" و "avatarPrompt" باللغة الإنجليزية حصراً وبتفاصيل هندسية احترافية تتناسب مع طبيعة النشاط.

أخرج فقط JSON مطابق لـ:
{
  "visuals": {
    "visualDirection": "توجيهات بصرية باللغة العربية",
    "logoPrompt": "Detailed English image generation prompt for a minimalist modern logo icon...",
    "avatarPrompt": "Detailed English image generation prompt for a 1:1 square profile avatar..."
  }
}
`;

  try {
    const text = await callGeminiTextWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
    });
    const parsed = cleanAndParseJSON(text || '{}');
    if (!parsed.visuals?.visualDirection || !parsed.visuals?.logoPrompt || !parsed.visuals?.avatarPrompt) throw new Error('Incomplete visuals');
    return res.json(parsed);
  } catch (err: any) {
    return sendAiError(res, err);
  }
});

// 3. Scoped AI Operations
app.post('/api/brand/scoped-op', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const { operation, brandBrief, currentData, instruction, targetId, weekNumber } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ code: 'AI_NOT_CONFIGURED', error: 'مفتاح GEMINI_API_KEY غير مهيأ في هذه النسخة من التطبيق.' });
  }

  try {
    let systemPrompt = '';
    let userPrompt = '';

    if (operation === 'appendNames') {
      const existingNames = Array.isArray(currentData?.existingNames) ? currentData.existingNames : [];
      systemPrompt = `أنت خبير تسمية علامات تجارية في مصر. مهمتك توليد 5 أسماء جديدة ومميزة لمشروع "${brandBrief?.idea || ''}".
يجب ألا تتكرر أي من الأسماء الموجودة بالفعل: [${existingNames.join(', ')}].
التعليمات الإضافية من المستخدم: "${instruction || 'اقترح أسماء جذابة وملهمة'}".
أرجع مصفوفة JSON تحتوي على 5 عناصر فقط بنفس هيكل كائنات الأسماء.`;

      userPrompt = `أخرج فقط JSON مطابق لـ:
{
  "names": [
    {
      "id": "new-name-${Date.now()}-1",
      "nameAr": "اسم عربي جديد مستوحى تماماً من المجال",
      "nameEn": "English New Name",
      "pronunciation": "النطق",
      "meaning": "المعنى",
      "rationale": "سبب الاقتراح",
      "story": "قصة براند مخصصة وثرية لهذا الاسم تحديداً",
      "greetingExample": "ترحيب دافئ باللهجة المصرية يذكر هذا الاسم تحديداً",
      "promoExample": "عرض إعلاني خاص بالاسم",
      "matchingSlogan": "شعار لفظي متناسق مع الاسم",
      "emotionalAssociations": ["إحساس 1", "إحساس 2"],
      "style": "شعبي / عصري / مبتكر",
      "tradeoff": "الملاحظة العملية",
      "recommended": false
    }
  ]
}`;
    } else if (operation === 'appendSlogans') {
      const existingSlogans = Array.isArray(currentData?.existingSlogans) ? currentData.existingSlogans : [];
      systemPrompt = `أنت كاتب إعلانات محترف في مصر. ولّد 4 شعارات لفظية (Slogans) جديدة وغير مكررة للبراند، الفكرة: "${brandBrief?.idea}".
الشعارات الحالية: [${existingSlogans.join(', ')}].
التعليمات: "${instruction || 'شعارات رنانة وسهلة الحفظ'}".
أخرج مصفوفة JSON تحتوي على 4 عناصر.`;

      userPrompt = `أخرج فقط JSON:
{
  "slogans": [
    {
      "id": "new-slogan-${Date.now()}-1",
      "text": "الشعار اللفظي الجديد",
      "meaning": "المعنى المقصود",
      "rationale": "سبب التأثير في المستهلك المصري",
      "useCase": "في الحملات الرقمية"
    }
  ]
}`;
    } else if (operation === 'proposePalette') {
      systemPrompt = `أنت مصمم هويات بصرية وخبير سيكولوجية الألوان. اقترح لوحة ألوان متكاملة من 5 ألوان لهوية مشروع "${brandBrief?.idea}".
الطابع المطلوب: "${instruction || 'ألوان عصرية متناسقة مع تباين قراءة ممتاز'}".
الألوان الخمسة يجب أن تغطي: primary, secondary, accent, background, text.
جميع الألوان بصيغة HEX صالحة من 6 أحرف مثل #7C3AED.`;

      userPrompt = `أخرج فقط JSON:
{
  "palette": [
    { "role": "primary", "nameAr": "اسم اللون الأساسي", "hex": "#7C3AED", "usageNote": "الشعار والعناصر الرئيسية" },
    { "role": "secondary", "nameAr": "اللون الثانوي", "hex": "#22D3EE", "usageNote": "العناصر المساعدة" },
    { "role": "accent", "nameAr": "لون التمييز", "hex": "#F59E0B", "usageNote": "عروض لفت الانتباه" },
    { "role": "background", "nameAr": "لون الخلفية", "hex": "#0B1020", "usageNote": "المساحات العامة" },
    { "role": "text", "nameAr": "لون النص", "hex": "#F8FAFC", "usageNote": "قراءة مريحة مع تباين عالٍ" }
  ]
}`;
    } else if (operation === 'refineIdentityPart') {
      systemPrompt = `أنت خبير استراتيجيات هويات الأعمال. قم بتحديث استراتيجية ونبرة البراند وفق التعليمات التالية: "${instruction}".
فكرة المشروع: "${brandBrief?.idea}".
أرجع كائني strategy و voice باللغة العربية.`;

      userPrompt = `أخرج فقط JSON يحتوي على "strategy" و "voice" معدلين بالكامل.`;
    } else if (operation === 'refinePricing') {
      systemPrompt = `أنت مستشار تسعير في السوق المصري. عدّل باقات التسعير الحالية بالجنيه المصري بناء على التعليمات: "${instruction}".
التزم بأسعار منطقية بالجنيه المصري EGP فقط، مع توضيح الاشتمالات والمبررات.
البيانات الحالية: ${JSON.stringify(currentData || {})}`;

      userPrompt = `أخرج فقط JSON مطابق لـ:
{
  "tiers": [
    {
      "id": "tier-1",
      "title": "عنوان الباقة",
      "targetAudience": "الفئة المستهدفة",
      "inclusions": ["ميزة 1", "ميزة 2"],
      "priceEgp": 150,
      "billingUnit": "للوحدة",
      "rationale": "المبرر",
      "variableCostEgp": 60
    }
  ],
  "assumptions": ["افتراض التسعير"],
  "statusNote": "ملاحظة التسعير"
}`;
    } else if (operation === 'addPricingTier') {
      systemPrompt = `أنت مستشار تسعير في مصر. اقترح باقة تسعير جديدة إضافية مناسبة للمشروع "${brandBrief?.idea}".
التعليمات: "${instruction || 'باقة ذات قيمة مضافة عالية'}".
الأسعار بالجنيه المصري EGP فقط.`;

      userPrompt = `أخرج فقط JSON مطابق لـ:
{
  "tier": {
    "id": "tier-new-${Date.now()}",
    "title": "اسم الباقة الجديدة",
    "targetAudience": "الجمهور المستهدف",
    "inclusions": ["ميزة 1", "ميزة 2", "ميزة 3"],
    "priceEgp": 350,
    "billingUnit": "للباقة",
    "rationale": "سبب الإضافة وفائدتها للنشاط",
    "variableCostEgp": 140
  }
}`;
    } else if (operation === 'regenerateMarketing') {
      systemPrompt = `أنت مدير تسويق رقمي ميداني في مصر. اقترح خطة تسويق بديلة لـ 30 يوماً مع 3 منشورات جاهزة للنشر للمشروع "${brandBrief?.idea}".
التعليمات: "${instruction || 'خطة ذات تركيز عالي على الانتشار'}"
شرط إلزامي: يُحظر تماماً استخدام المصطلحات المؤسسية أو الاستشارية الجافة (مثل: "إبراز باقة القيمة" أو "الضمان الذهبي"). استخدم لغة عامية مصرية راقية، سهلة، ومباشرة تمس قلب النشاط اليومي وتجربة الزبون.
أرجع 30 يوماً مرقمة من 1 إلى 30 مع شرح تطبيقي لكل يوم، و3 منشورات متكاملة.`;

      userPrompt = `أخرج فقط JSON يحتوي على "audienceOverview", "acquisitionChannels", "coreLaunchMessage", "days" (30 عنصر), و "posts" (3 عناصر).`;
    } else if (operation === 'refineMarketingWeek') {
      systemPrompt = `أنت مخطط حملات تسويقية في مصر. عدّل أيام الأسبوع رقم ${weekNumber || 1} فقط بناء على التعليمات: "${instruction}".
فكرة المشروع: "${brandBrief?.idea}".
شرط إلزامي: لغة بسيطة وسهلة لصاحب المشروع والمستهلك العادي قريبة جداً من واقع وتخصص النشاط، بعيداً تماماً عن التعقيد أو مصطلحات الشركات الكبرى.
أرجع مصفوفة "days" المعدلة لأيام هذا الأسبوع فقط.`;

      userPrompt = `أخرج فقط JSON يحتوي على "days": [ { "dayNumber": ..., "period": "...", "objective": "...", "action": "...", "channel": "...", "deliverable": "...", "metric": "..." } ]`;
    } else if (operation === 'appendPosts') {
      systemPrompt = `أنت صانع محتوى إعلاني رقمي في مصر. اقترح 3 أفكار منشورات جديدة متكاملة وجاهزة للنشر للمشروع "${brandBrief?.idea}".
التعليمات: "${instruction || 'منشورات ريلز وكاروسيل مبتكرة'}".
شرط إلزامي: لغة حية وجذابة باللهجة المصرية المحببة وقريبة جداً من كواليس النشاط وشهية/رغبة الزبون، بدون أي مصطلحات تسويقية متكلفة.`;

      userPrompt = `أخرج فقط JSON مطابق لـ:
{
  "posts": [
    {
      "id": "post-new-${Date.now()}-1",
      "platform": "انستجرام وتيك توك",
      "format": "ريلز تفاعلي",
      "hook": "الخطاف الجذاب في أول 3 ثوان",
      "caption": "الكابشن الكامل الجاهز للنشر",
      "visualDirection": "التوجيه البصري للتصوير",
      "videoScript": "السيناريو المقترح",
      "cta": "دعوة العميل للتفاعل",
      "hashtags": ["#براند", "#مصر"]
    }
  ]
}`;
    } else if (operation === 'rewritePost') {
      systemPrompt = `أنت كاتب إعلانات في مصر. أعد صياغة هذا المنشور رقم "${targetId}" وفق التعليمات: "${instruction}".
فكرة المشروع: "${brandBrief?.idea}".
البيانات السابقة للمنشور: ${JSON.stringify(currentData || {})}`;

      userPrompt = `أخرج فقط JSON مطابق لـ:
{
  "post": {
    "id": "${targetId}",
    "platform": "المنصة المناسبة",
    "format": "النوع",
    "hook": "الخطاف الجديد",
    "caption": "الكابشن الجديد بالكامل",
    "visualDirection": "التوجيه البصري الجديد",
    "videoScript": "السيناريو إن وُجد",
    "cta": "دعوة الإجراء",
    "hashtags": ["#هاشتاج"]
  }
}`;
    } else if (operation === 'refineVisualPrompt') {
      systemPrompt = `You are an expert AI prompt engineer for image generation.
Refine the English prompt for the brand logo or avatar based on instructions: "${instruction}".
Brand Idea: "${brandBrief?.idea}".
Ensure it is in clear, highly detailed English, specifying flat vector composition, clean geometry, centered alignment, exact hex colors, and excluding watermarks, mockups, or embedded letters.`;

      userPrompt = `Return only JSON:
{
  "prompt": "The refined English image generation prompt..."
}`;
    } else if (operation === 'updateDependencies') {
      systemPrompt = `أنت خبير استراتيجي في الهويات المؤسسية. قام المستخدم بتحديث ملخص فكرة المشروع أو الاسم المختار:
الملخص المحدث: ${JSON.stringify(brandBrief || {})}.
الاسم المختار حالياً: "${currentData?.selectedName || ''}".
الشعار المختار: "${currentData?.selectedSlogan || ''}".
التعليمات: حدّث فقط العناصر المرتبطة بالاسم الجديد وملخص المشروع مع الحفاظ على الأرقام المالية.
أرجع كائن يحتوي على: "strategy" المحدثة، و "coreLaunchMessage" المحدثة، وبرومبت اللوجو المحدث بالإنجليزية "logoPrompt".`;

      userPrompt = `أخرج فقط JSON: { "strategy": {...}, "coreLaunchMessage": "...", "logoPrompt": "..." }`;
    } else {
      return res.status(400).json({ error: `عملية غير معتمدة: ${operation}` });
    }

    let parsed: any;
    try {
      const text = await callGeminiTextWithFallback(
        ai,
        `${systemPrompt}\n\n${userPrompt}`,
        {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      );
      parsed = cleanAndParseJSON(text || '{}');
    } catch (err: any) {
      throw err;
    }

    if (!parsed || !Object.keys(parsed).length) throw new Error('Empty AI result');
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    return sendAiError(res, error);
  }
});

// 4. Multi-Tier Image Generation (Nano Banana 2.1 + DALL-E 3 / ChatGPT Prompt Engine + Ultra-Luxury Vector SVG)
app.post('/api/brand/generate-image', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, res)) return;

  const {
    type = 'logo',
    prompt,
    referenceImageBase64,
    brandName,
    primaryColor,
    secondaryColor,
    style = '3d-luxury',
  } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'البرومبت الإنجليزي مطلوب لتوليد الصورة.' });
  }

  const hexMatches = prompt.match(/#[0-9a-fA-F]{6}/g) || [];
  const pColor = primaryColor || hexMatches[0] || '#4F46E5';
  const sColor = secondaryColor || hexMatches[1] || '#06B6D4';
  const bName = brandName || 'Brand';

  // Build specialized master prompts for ChatGPT (DALL-E 3) / Midjourney v6.1 / Nano Banana
  const styleKeywordsMap: Record<string, { en: string; lighting: string; material: string }> = {
    '3d-luxury': {
      en: 'Ultra-luxurious 3D embossed metallic monogram emblem, Cinema4D, Octane Render 8K',
      lighting: 'Dramatic studio rim lighting, moody soft shadows, specular reflections',
      material: 'Brushed chrome and satin gold with subtle micro-textures',
    },
    'gold-embossed': {
      en: 'Royal stamped gold foil luxury emblem, high-end artisanal craftsmanship',
      lighting: 'Warm golden shimmer, directional studio spotlight, luxury depth',
      material: 'Deep debossed gold leaf on heavy matte charcoal cardstock',
    },
    'photorealistic': {
      en: 'Photorealistic commercial brand signage and emblem mockup in high-end flagship boutique',
      lighting: 'Natural ambient architectural lighting, shallow depth of field, f/1.8 macro lens',
      material: 'Frosted glass, anodized aluminum, architectural stone texture',
    },
    'minimalist': {
      en: 'High-end Swiss minimalist geometric logo icon, negative space visual illusion',
      lighting: 'Clean flat high-key studio light, crisp edges, razor-sharp vector silhouette',
      material: 'Ultra-clean matte surface, pure geometry, golden ratio proportions',
    },
    'geometric-vector': {
      en: 'Intricate sacred geometry luxury brand emblem, interlocking lines and arcs',
      lighting: 'Vibrant neon gradient glow with crisp vector precision',
      material: 'Polished iridescent glass prism reflections',
    },
  };

  const chosenStyle = styleKeywordsMap[style] || styleKeywordsMap['3d-luxury'];

  const masterChatGptPrompt = type === 'logo'
    ? `Create a master-grade luxury brand logo for "${bName}".
Style: ${chosenStyle.en}.
Visual Direction: ${prompt}.
Colors: Dominant ${pColor} paired with accent ${sColor} on deep carbon matte background (#0B0F19).
Composition: Perfectly centered geometric emblem, golden ratio balance, luxury typography rendering "${bName}".
Lighting & Material: ${chosenStyle.lighting}, ${chosenStyle.material}.
Render Quality: 8K resolution, ultra-photorealistic, masterpiece, no watermarks, no distorted artifacts, clean isolated backdrop.`
    : `Create a high-end luxury circular social profile avatar for "${bName}".
Style: ${chosenStyle.en}.
Visual Direction: ${prompt}.
Colors: Dominant ${pColor} and accent ${sColor} with circular rim accent.
Composition: Centered iconic luxury monogram or emblem inside a circular medallion badge.
Lighting & Material: ${chosenStyle.lighting}, ${chosenStyle.material}.
Render Quality: 8K resolution, ultra-photorealistic, masterpiece, perfectly centered.`;

  const ai = getGeminiClient();
  if (!ai) {
    const dynamicSvg = generateDynamicBrandSvg(type, bName, pColor, sColor);
    const base64Fallback = Buffer.from(dynamicSvg, 'utf-8').toString('base64');
    return res.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${base64Fallback}`,
      engineUsed: 'vector-svg-master',
      generatedAt: new Date().toISOString(),
      promptUsed: prompt,
      chatGptPrompt: masterChatGptPrompt,
      styleUsed: style,
    });
  }

  try {
    let generatedImageUrl = '';
    let engineUsed: 'nano-banana' | 'vector-svg-master' = 'vector-svg-master';

    // 1. Try Real Nano Banana Image Models directly (gemini-nano-banana-2.1 -> gemini-3.1-flash-lite-image)
    const imageModels = ['gemini-nano-banana-2.1', 'gemini-3.1-flash-lite-image'];
    for (const imgModel of imageModels) {
      if (generatedImageUrl) break;
      try {
        const contentsParts: any[] = [];
        if (referenceImageBase64 && type === 'avatar') {
          const cleanBase64 = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
          contentsParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png',
            },
          });
        }
        contentsParts.push({ text: masterChatGptPrompt });

        const imageRes = await ai.models.generateContent({
          model: imgModel,
          contents: { parts: contentsParts },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        const parts = imageRes.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || 'image/png';
            const base64Data = part.inlineData.data;
            generatedImageUrl = `data:${mime};base64,${base64Data}`;
            engineUsed = 'nano-banana';
            break;
          }
        }
      } catch (imgErr: any) {
        // Continue to fallback model or vector studio
        console.info(`[Image Studio] Image model quota or tier reached, attempting vector studio.`);
      }
    }

    // 2. High-Precision Studio Vector SVG using Gemini Flash with advanced multi-layer filters
    if (!generatedImageUrl) {
      const activeModels = getActiveTextModels();
      if (activeModels.length > 0) {
        try {
          const svgPrompt = `You are a world-renowned master identity designer and SVG visual artist.
Create an ultra-luxurious, visually breathtaking standalone SVG graphic for the brand "${bName}".
ViewBox: "0 0 600 600", width="600", height="600", xmlns="http://www.w3.org/2000/svg"

Visual Brief: "${prompt}"
Primary Color: ${pColor}
Secondary Color: ${sColor}
Desired Style: ${chosenStyle.en}

CRITICAL ART DIRECTION (Must look like an elite design agency created it, NOT a primitive icon):
1. Dark Luxury Background:
   - Deep rich backdrop (#090D16 to #0F172A) with subtle radial glow or mesh in the center using <radialGradient>.
2. Sophisticated <defs> Section:
   - Rich multi-stop linear and radial gradients using ${pColor}, ${sColor}, gold/silver highlights (#FDE047, #E2E8F0, #38BDF8).
   - <filter id="glow"> with <feGaussianBlur stdDeviation="6" result="blur"/> and <feMerge>.
   - <filter id="shadow"> with <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>.
3. Central Iconic Emblem:
   - An intricate, multi-layered geometric symbol or monogram representing "${bName}".
   - Use concentric arcs, overlapping golden-ratio polygons, faceted diamond planes, or interlocking ribbons with gradients and drop-shadows.
   - Distinct 3D volumetric feel with highlights and edge shadows.
4. Typography (if type === 'logo'):
   - Below the emblem, render a magnificent typography block:
   - Brand Name: <text x="300" y="460" font-family="'Cairo', 'Segoe UI', Tahoma, sans-serif" font-size="36" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${bName}</text>
   - Subtle category or slogan accent line: <text x="300" y="495" font-family="'Cairo', 'Segoe UI', Tahoma, sans-serif" font-size="13" font-weight="600" fill="${sColor}" text-anchor="middle" letter-spacing="3" opacity="0.85">PREMIUM BRAND IDENTITY</text>
5. If type === 'avatar':
   - Render a circular medallion (center 300,300, radius 260) with outer glowing ring stroke="${pColor}" stroke-width="4", inner concentric ring with stroke="${sColor}" stroke-dasharray="8 6", and iconic emblem inside.

STRICT OUTPUT RULES:
- Output ONLY valid, clean SVG code starting with <svg and ending with </svg>.
- Do NOT wrap in markdown fences (no \`\`\`xml or \`\`\`svg).
- No commentary, no explanation text.`;

          const rawSvgText = await callGeminiTextWithFallback(ai, svgPrompt);

          let rawSvg = rawSvgText?.trim() || '';
          if (rawSvg.startsWith('```xml')) rawSvg = rawSvg.replace(/^```xml\s*/i, '').replace(/\s*```$/, '');
          if (rawSvg.startsWith('```svg')) rawSvg = rawSvg.replace(/^```svg\s*/i, '').replace(/\s*```$/, '');
          if (rawSvg.startsWith('```')) rawSvg = rawSvg.replace(/^```\s*/, '').replace(/\s*```$/, '');

          const svgMatch = rawSvg.match(/<svg[\s\S]*<\/svg>/i);
          if (svgMatch) {
            rawSvg = svgMatch[0];
            const base64Svg = Buffer.from(rawSvg, 'utf-8').toString('base64');
            generatedImageUrl = `data:image/svg+xml;base64,${base64Svg}`;
            engineUsed = 'vector-svg-master';
          }
        } catch {
          console.info('[Vector Studio] Text models cooling down, switching to procedural brand vector studio.');
        }
      }
    }

    // 3. Fallback to Dynamic Procedural SVG if all AI generation failed
    if (!generatedImageUrl) {
      const dynamicSvg = generateDynamicBrandSvg(type, bName, pColor, sColor);
      const base64Fallback = Buffer.from(dynamicSvg, 'utf-8').toString('base64');
      generatedImageUrl = `data:image/svg+xml;base64,${base64Fallback}`;
      engineUsed = 'vector-svg-master';
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      engineUsed,
      generatedAt: new Date().toISOString(),
      promptUsed: prompt,
      chatGptPrompt: masterChatGptPrompt,
      styleUsed: style,
    });
  } catch (error: any) {
    console.info('[Image Studio] Using procedural brand SVG vector engine.');
    const dynamicSvg = generateDynamicBrandSvg(type, bName, pColor, sColor);
    const base64Fallback = Buffer.from(dynamicSvg, 'utf-8').toString('base64');
    res.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${base64Fallback}`,
      engineUsed: 'vector-svg-master',
      generatedAt: new Date().toISOString(),
      promptUsed: prompt,
      chatGptPrompt: masterChatGptPrompt,
      styleUsed: style,
    });
  }
});

// ==================== VITE & FRONTEND MOUNTING ==================== //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BrandMaker AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
