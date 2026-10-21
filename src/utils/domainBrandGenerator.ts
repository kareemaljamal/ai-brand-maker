import type {
  BrandBrief,
  BrandIdentity,
  BrandPricing,
  BrandMarketing,
  BrandVisuals,
  BrandProject,
  BrandColor,
  PricingTier,
  PricingItem,
  PricingFormat,
  MarketingDay,
  MarketingPost,
  BrandNameCandidate,
  BrandSloganCandidate,
  StartupEquipmentItem,
  CapitalFeasibility,
  FinancialProjections,
  UnitEconomicsBenchmark,
} from '../types/brand';

export interface BrandInputData {
  idea: string;
  category?: string;
  personality?: string;
  city?: string;
  district?: string;
  targetAudience?: string;
  budget?: string | number;
  knownVariableCosts?: string | number;
  knownMonthlyFixedCosts?: string | number;
}

export type IndustryType =
  | 'dental'
  | 'medical'
  | 'koshary-food'
  | 'foul-falafel'
  | 'street-food'
  | 'pizza'
  | 'burger'
  | 'shawarma'
  | 'grills'
  | 'restaurant'
  | 'cafe'
  | 'legal'
  | 'real-estate'
  | 'beauty'
  | 'fitness'
  | 'auto'
  | 'education'
  | 'fashion'
  | 'tech'
  | 'general';

export interface IdeaAnalysis {
  industryId: IndustryType;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  archetype: string;
  domainWords: string[];
  pricingFormat: PricingFormat;
}

// 1. Intelligent Domain Detection across Egypt Commercial Landscape
export function analyzeIdea(idea: string): IdeaAnalysis {
  const text = (idea || '').toLowerCase();

  // Egyptian Koshary & Traditional Heritage Eateries
  if (text.includes('كشري') || text.includes('كشرى')) {
    return {
      industryId: 'koshary-food',
      category: 'مطاعم كشري ومأكولات مصرية أصيلة (كشري، طواجن، دقة وصلصة)',
      primaryColor: '#B45309', // Deep Roasted Onion Amber
      secondaryColor: '#DC2626', // Spicy Tomato Chili Red
      accentColor: '#15803D', // Fresh Garlic Vinegar Green
      archetype: 'ابن البلد الأصيل صانع البهجة (Everyman / Heritage Master)',
      domainWords: ['دقة وشطة', 'تقلية مقرمشة', 'سر الصلصة المتسبكة', 'طبق يسند القلب', 'أرز وعدس مخدوم'],
      pricingFormat: 'menu',
    };
  }

  // Egyptian Foul, Falafel & Traditional Breakfast Eateries
  if (
    text.includes('فلافل') ||
    text.includes('طعمية') ||
    text.includes('طعميه') ||
    text.includes('فول') ||
    text.includes('تحابيش') ||
    text.includes('فطار بلدي') ||
    text.includes('falafel') ||
    text.includes('taameya') ||
    text.includes('foul')
  ) {
    return {
      industryId: 'foul-falafel',
      category: 'مطاعم فول وفلافل وأكلات شعبية مصرية (فلافل مقرمشة، فول مدمس، تحابيش)',
      primaryColor: '#047857', // Crispy Parsley Green
      secondaryColor: '#B45309', // Golden Sesame Crust Amber
      accentColor: '#DC2626', // Baladi Chili Red
      archetype: 'ابن البلد الأصيل صانع البهجة (Everyman / Heritage Master)',
      domainWords: ['فلافل مقرمشة بالسمسم', 'فول مدمس بالسمنة البلدي', 'طشة التوم والليمون', 'سندوتش يسندك', 'عيش سخن وطحينة'],
      pricingFormat: 'menu',
    };
  }

  // Egyptian Street Food & Popular Eateries (Kebda, Sugok, Hawawshi)
  if (
    text.includes('كبدة') ||
    text.includes('كبده') ||
    text.includes('سجق') ||
    text.includes('حواوشي') ||
    text.includes('مسمط') ||
    text.includes('عربة') ||
    text.includes('ساندوتشات شعبية') ||
    text.includes('صاج')
  ) {
    return {
      industryId: 'street-food',
      category: 'مطاعم ومأكولات شعبية مصرية (كبدة، سجق، أكلات شارع)',
      primaryColor: '#B91C1C', // Deep Chili Red
      secondaryColor: '#D97706', // Sizzling Amber
      accentColor: '#15803D', // Baladi Herb Green
      archetype: 'ابن البلد الأصيل (Everyman / Hero)',
      domainWords: ['نار الصاج', 'طشة التوم والخلطة', 'لقمة تسند القلب', 'ريحة ترد الروح'],
      pricingFormat: 'menu',
    };
  }

  // Dental & Oral Clinics
  if (
    text.includes('أسنان') ||
    text.includes('اسنان') ||
    text.includes('ضرس') ||
    text.includes('dental') ||
    text.includes('dentist') ||
    text.includes('teeth') ||
    text.includes('smile')
  ) {
    return {
      industryId: 'dental',
      category: 'عيادات ومراكز طب وجراحة وتجميل الأسنان',
      primaryColor: '#0284C7', // Medical Sky Cyan
      secondaryColor: '#0D9488', // Serene Teal
      accentColor: '#F59E0B', // Radiant Gold
      archetype: 'الخبير الحامي (Caregiver / Sage)',
      domainWords: ['ابتسامة ناصعة', 'رعاية طبية', 'أمان بلا ألم', 'دقة علاجية'],
      pricingFormat: 'services',
    };
  }

  // Hospitals, Clinics & Healthcare
  if (
    text.includes('مستشفى') ||
    text.includes('مستشفي') ||
    text.includes('مستشفيات') ||
    text.includes('عياد') ||
    text.includes('طبيب') ||
    text.includes('دكتور') ||
    text.includes('مستوصف') ||
    text.includes('مركز طبي') ||
    text.includes('مجمع طبي') ||
    text.includes('صيدل') ||
    text.includes('تحاليل') ||
    text.includes('علاج') ||
    text.includes('صحة') ||
    text.includes('رعاية صحية') ||
    text.includes('hospital') ||
    text.includes('clinic') ||
    text.includes('medical')
  ) {
    return {
      industryId: 'medical',
      category: 'خدمات طبية ومستشفيات ورعاية صحية متكاملة',
      primaryColor: '#0369A1', // Clinical Blue
      secondaryColor: '#10B981', // Healing Emerald
      accentColor: '#F59E0B', // Warm Amber
      archetype: 'المعالج الإنساني (Caregiver / Healer)',
      domainWords: ['صحة وشفاء', 'رعاية فائقة', 'كشف دقيق', 'طمأنينة المريض'],
      pricingFormat: 'services',
    };
  }

  // Pizza & Italian Cuisine
  if (
    text.includes('بيتزا') ||
    text.includes('pizza') ||
    text.includes('فطير') ||
    text.includes('ايطالي') ||
    text.includes('إيطالي') ||
    text.includes('باستا')
  ) {
    return {
      industryId: 'pizza',
      category: 'مطاعم بيتزا ومأكولات إيطالية فاخرة',
      primaryColor: '#DC2626', // Tomato Crimson
      secondaryColor: '#16A34A', // Basil Herb Green
      accentColor: '#F59E0B', // Melted Cheese Gold
      archetype: 'الحرفي الخبير (Creator / Artisan)',
      domainWords: ['أفران الحطب', 'جبنة ذائبة ومطاطية', 'عجينة مخمرة بعناية', 'أصالة المذاق الإيطالي'],
      pricingFormat: 'menu',
    };
  }

  // Burgers & Fast Food Sandwiches
  if (
    text.includes('برجر') ||
    text.includes('burger') ||
    text.includes('سماش')
  ) {
    return {
      industryId: 'burger',
      category: 'مطاعم برجر وساندوتشات سريعة فاخرة',
      primaryColor: '#B45309', // Toasted Bun Amber
      secondaryColor: '#DC2626', // Flame Grill Red
      accentColor: '#FBBF24', // Melted Cheddar Gold
      archetype: 'المستكشف المرح (Explorer / Jester)',
      domainWords: ['لحم بلدي صافي', 'سماش كرافت', 'صوصات شيف سرية', 'روقان الشبع'],
      pricingFormat: 'menu',
    };
  }

  // Shawarma & Middle Eastern Griddles
  if (
    text.includes('شاورما') ||
    text.includes('shawarma') ||
    text.includes('سيخ')
  ) {
    return {
      industryId: 'shawarma',
      category: 'مطاعم شاورما وساندوتشات على الصاج',
      primaryColor: '#C2410C', // Shawarma Roast
      secondaryColor: '#EA580C', // Paprika Flame
      accentColor: '#FBBF24', // Toumeya Cream
      archetype: 'الحرفي الماهر (Creator / Artisan)',
      domainWords: ['سيخ بلدي متبل', 'خبز صاج مقرمش', 'تومية سورية فاخرة', 'خلطة سرية'],
      pricingFormat: 'menu',
    };
  }

  // Grills & Egyptian Kebabji
  if (
    text.includes('مشويات') ||
    text.includes('كباب') ||
    text.includes('كفتة') ||
    text.includes('شواء') ||
    text.includes('ريش')
  ) {
    return {
      industryId: 'grills',
      category: 'مطاعم مشويات وكبابجي بلدي فاخر',
      primaryColor: '#7F1D1D', // Charcoal Smoke
      secondaryColor: '#B45309', // Roasted Amber
      accentColor: '#F59E0B', // Flame Gold
      archetype: 'الكريم المضياف (Caregiver / Ruler)',
      domainWords: ['فحم بلدي', 'كباب وكفتة على الأصول', 'سفرة ولمة', 'ريحة تشهي'],
      pricingFormat: 'menu',
    };
  }

  // General Restaurants & Fast Food
  if (
    text.includes('مطعم') ||
    text.includes('أكل') ||
    text.includes('اكل') ||
    text.includes('طعام') ||
    text.includes('وجبات') ||
    text.includes('food') ||
    text.includes('restaurant')
  ) {
    return {
      industryId: 'restaurant',
      category: 'مطاعم ومأكولات راقية وسريعة',
      primaryColor: '#BE123C', // Appetite Crimson
      secondaryColor: '#EA580C', // Flame Orange
      accentColor: '#FBBF24', // Mustard Gold
      archetype: 'المستكشف المرح (Explorer / Jester)',
      domainWords: ['طعم لا يُنسى', 'مكونات طازجة', 'وصفة سرية', 'سعادة المذاق'],
      pricingFormat: 'menu',
    };
  }

  // Coffee & Cafes
  if (
    text.includes('مقهى') ||
    text.includes('مقهي') ||
    text.includes('مقاهي') ||
    text.includes('قهوة') ||
    text.includes('كافيه') ||
    text.includes('كافيهات') ||
    text.includes('بن') ||
    text.includes('اسبريسو') ||
    text.includes('شاي') ||
    text.includes('محمصة') ||
    text.includes('روستري') ||
    text.includes('حلويات') ||
    text.includes('مخبز') ||
    text.includes('coffee') ||
    text.includes('cafe') ||
    text.includes('roastery')
  ) {
    return {
      industryId: 'cafe',
      category: 'أغذية ومشروبات (مقهى وكافيه وضيافة)',
      primaryColor: '#78350F', // Rich Roasted Espresso
      secondaryColor: '#B45309', // Caramel Amber
      accentColor: '#10B981', // Fresh Mint Green
      archetype: 'المحب المضياف (Lover / Caregiver)',
      domainWords: ['نكهة أصيلة', 'تحميص فاخر', 'دفء الجلسة', 'رائحة البن'],
      pricingFormat: 'menu',
    };
  }

  // Legal & Consulting
  if (
    text.includes('محام') ||
    text.includes('قانون') ||
    text.includes('استشار') ||
    text.includes('محاسب') ||
    text.includes('ضرائب') ||
    text.includes('تحكيم') ||
    text.includes('legal') ||
    text.includes('law')
  ) {
    return {
      industryId: 'legal',
      category: 'استشارات قانونية ومحاماة وضرائب',
      primaryColor: '#0F172A', // Sovereign Navy/Black
      secondaryColor: '#B45309', // Prestige Bronze Gold
      accentColor: '#2563EB', // Justice Blue
      archetype: 'الحاكم الحكيم (Ruler / Sage)',
      domainWords: ['عدالة ناجزة', 'حماية قانونية', 'عقود موثوقة', 'خبرة عريقة'],
      pricingFormat: 'services',
    };
  }

  // Real Estate & Decor
  if (
    text.includes('عقار') ||
    text.includes('تشطيب') ||
    text.includes('مقاول') ||
    text.includes('ديكور') ||
    text.includes('هندس') ||
    text.includes('شقق') ||
    text.includes('فلل') ||
    text.includes('real estate') ||
    text.includes('decor')
  ) {
    return {
      industryId: 'real-estate',
      category: 'تطوير عقاري وتشطيبات وديكور',
      primaryColor: '#1E293B', // Architectural Slate
      secondaryColor: '#D97706', // Luxury Gold
      accentColor: '#059669', // Emerald Growth
      archetype: 'الباني المبدع (Creator / Ruler)',
      domainWords: ['صرح معماري', 'تشطيب فاخر', 'استثمار آمن', 'دقة هندسية'],
      pricingFormat: 'services',
    };
  }

  // Beauty & Spa
  if (
    text.includes('تجميل') ||
    text.includes('صالون') ||
    text.includes('كوافير') ||
    text.includes('سبا') ||
    text.includes('بشرة') ||
    text.includes('مكياج') ||
    text.includes('عطور') ||
    text.includes('عناية') ||
    text.includes('beauty') ||
    text.includes('spa')
  ) {
    return {
      industryId: 'beauty',
      category: 'صالونات تجميل وعناية وسبا راقي',
      primaryColor: '#831843', // Royal Rose
      secondaryColor: '#F472B6', // Gentle Blush
      accentColor: '#FBBF24', // Champagne Gold
      archetype: 'الساحر الجذاب (Lover / Magician)',
      domainWords: ['إشراقة ساحرة', 'عناية ملكية', 'جمال طبيعي', 'دلال واسترخاء'],
      pricingFormat: 'services',
    };
  }

  // Fitness & Gym
  if (
    text.includes('جيم') ||
    text.includes('رياض') ||
    text.includes('فتنس') ||
    text.includes('لياق') ||
    text.includes('gym') ||
    text.includes('fitness')
  ) {
    return {
      industryId: 'fitness',
      category: 'صحة ولياقة بدنية ورياضة',
      primaryColor: '#090D16', // Obsidian Iron
      secondaryColor: '#DC2626', // High-Impact Crimson
      accentColor: '#84CC16', // Bio-Energy Lime
      archetype: 'البطل القوي (Hero / Warrior)',
      domainWords: ['قوة وتحمل', 'بناء العضلات', 'لياقة متجددة', 'تحدي الذات'],
      pricingFormat: 'packages',
    };
  }

  // Automotive
  if (
    text.includes('سيار') ||
    text.includes('ميكانيك') ||
    text.includes('صيانة سيارات') ||
    text.includes('قطع غيار') ||
    text.includes('auto') ||
    text.includes('car')
  ) {
    return {
      industryId: 'auto',
      category: 'صيانة سيارات وخدمات ميكانيكية وقطع غيار',
      primaryColor: '#18181B', // Engine Carbon
      secondaryColor: '#EA580C', // Industrial Orange
      accentColor: '#38BDF8', // Precision Blue
      archetype: 'المحترف الموثوق (Everyman / Sage)',
      domainWords: ['أمان الطريق', 'فحص بالكمبيوتر', 'قطع أصلية', 'سرعة إنجاز'],
      pricingFormat: 'services',
    };
  }

  // Education & Academies
  if (
    text.includes('تعليم') ||
    text.includes('حضان') ||
    text.includes('أكاديم') ||
    text.includes('كورس') ||
    text.includes('تدريب') ||
    text.includes('مدرس') ||
    text.includes('edu') ||
    text.includes('school')
  ) {
    return {
      industryId: 'education',
      category: 'تعليم وتدريب وتطوير مهارات',
      primaryColor: '#1E3A8A', // Deep Academic Navy
      secondaryColor: '#0284C7', // Horizon Blue
      accentColor: '#F59E0B', // Bright Amber
      archetype: 'الحكيم المرشد (Sage / Mentor)',
      domainWords: ['ارتقاء علمي', 'تأسيس متين', 'مستقبل واعد', 'شغف التعلم'],
      pricingFormat: 'packages',
    };
  }

  // Fashion & Apparel
  if (
    text.includes('ملابس') ||
    text.includes('أزياء') ||
    text.includes('ازياء') ||
    text.includes('عباي') ||
    text.includes('فاشن') ||
    text.includes('بوتيك') ||
    text.includes('fashion') ||
    text.includes('wear')
  ) {
    return {
      industryId: 'fashion',
      category: 'أزياء وموضة وملابس عصرية',
      primaryColor: '#312E81', // Royal Midnight Indigo
      secondaryColor: '#DB2777', // Modern Fuchsia
      accentColor: '#EAB308', // Gold Foil
      archetype: 'المتفرد الساحر (Creator / Ruler)',
      domainWords: ['أناقة متفردة', 'خامات فاخرة', 'قصّات مريحة', 'إطلالة تخطف الأنظار'],
      pricingFormat: 'products',
    };
  }

  // Tech & Apps
  if (
    text.includes('تطبيق') ||
    text.includes('برمج') ||
    text.includes('تقني') ||
    text.includes('منصة') ||
    text.includes('ذكاء') ||
    text.includes('ai') ||
    text.includes('tech') ||
    text.includes('app')
  ) {
    return {
      industryId: 'tech',
      category: 'تكنولوجيا ومنصات برمجية وحلول رقمية',
      primaryColor: '#4F46E5', // Electric Indigo
      secondaryColor: '#06B6D4', // Cyber Cyan
      accentColor: '#10B981', // Growth Emerald
      archetype: 'المبتكر الساحر (Magician / Visionary)',
      domainWords: ['ذكاء رقمي', 'سهولة تامة', 'أتمتة ذكية', 'تجربة مستخدم خارقة'],
      pricingFormat: 'packages',
    };
  }

  // General Commercial Default
  return {
    industryId: 'general',
    category: 'مشروع تجاري مبتكر في مصر',
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    accentColor: '#F59E0B',
    archetype: 'المبتكر الخبير (Creator / Sage)',
    domainWords: ['ابتكار وجودة', 'قيمة استثنائية', 'ثقة العميل', 'ريادة ونجاح'],
    pricingFormat: 'services',
  };
}

// 2. Generate 6 Authentic, Highly Tailored Brand Names for the Exact Industry
function buildNames(idea: string, analysis: IdeaAnalysis): BrandNameCandidate[] {
  const cleanIdea = idea.replace(/[^\u0621-\u064A\w\s]/gi, '').trim();
  const words = cleanIdea.split(/\s+/).filter(Boolean);
  const locationSuffix = words[words.length - 1] || 'التخصصي';

  // 0.1 RADIOLOGY & MEDICAL IMAGING CENTERS (مراكز أشعة وسونار وتشخيص)
  if (
    cleanIdea.includes('أشعة') ||
    cleanIdea.includes('اشعة') ||
    cleanIdea.includes('رنين') ||
    cleanIdea.includes('سونار') ||
    cleanIdea.includes('سكان') ||
    cleanIdea.includes('imaging') ||
    cleanIdea.includes('radiology')
  ) {
    return [
      {
        id: 'name-1',
        nameAr: `مركز أشعة ${locationSuffix}`,
        nameEn: 'Elite Scan Center',
        pronunciation: 'سكان سنتر',
        meaning: 'الدقة المتناهية في التصوير الطبي والتشخيص الرقمي المتطور.',
        rationale: 'اسم صريح ومباشر يرسخ التخصص في فحوصات الأشعة والسونار.',
        emotionalAssociations: ['دقة تشخيصية', 'أمان إشعاعي', 'طمأنينة'],
        style: 'طبي تشخيصي',
        tradeoff: 'مباشر وتخصصي.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'تأسس المركز لتقديم أدق صور الأشعة والرنين المغناطيسي لخدمة الأطباء والمرضى بأحدث الأجهزة الرقمية.',
        positioning: 'مركز الأشعة والتشخيص الرقمي الأكثر دقة وموثوقية.',
        toneTraits: ['مطمئنة', 'علمية', 'دقيقة'],
        greetingExample: 'أهلاً بكم في المركز، نتمنى لكم دوام الصحة والعافية.',
        promoExample: 'احجز فحص الأشعة والسونار مع استلام التقرير الرقمي خلال ساعة.',
        matchingSlogan: 'دقة الصورة.. أساس العلاج السليم',
      },
      {
        id: 'name-2',
        nameAr: 'شعاع للتشخيص الرقمي والأشعة',
        nameEn: 'Shoaa Scan',
        pronunciation: 'شُـ-عاع',
        meaning: 'الضوء الكاشف الذي يوضح التفاصيل الداخلية بدقة تامة.',
        rationale: 'اسم عربي رنان وسهل النطق يرمز لوضوح الرؤية الإشعاعية.',
        emotionalAssociations: ['وضوح', 'دقة', 'سرعة'],
        style: 'عصري',
        tradeoff: 'يحتاج تأكيد الطابع الطبي في الشعار.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'يقدم شعاع فحوصات السونار والأشعة السينية والبانوراما بأقل جرعة إشعاعية وأعلى دقة وضوح.',
        positioning: 'رؤية إشعاعية تشخيصية واضحة بلا تعقيد.',
        toneTraits: ['سريعة', 'واضحة', 'مهنية'],
        greetingExample: 'مرحباً بك في شعاع للأشعة والتشخيص.',
        promoExample: 'فحوصات الأشعة العادية والديجيتال بتسليم فوري وتقارير استشارية.',
        matchingSlogan: 'شايفين صح.. عشان تطمن بجد',
      },
      {
        id: 'name-3',
        nameAr: 'ألترا سكان للأشعة التخصصية',
        nameEn: 'UltraScan Imaging',
        pronunciation: 'ألترا سكان',
        meaning: 'الفحص المتقدم بالموجات فوق الصوتية والأشعة التشخيصية عالية الدقة.',
        rationale: 'اسم عالمي معاصر يحظى بثقة واسعة بين المرضى والأطباء.',
        emotionalAssociations: ['تكنولوجيا', 'دقة', 'ثقة'],
        style: 'عالمي حديث',
        tradeoff: 'يحتاج لافتة واضحة باللغة العربية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'نجمع بين كفاءة استشاريي الأشعة وأحدث أجهزة التصوير الطبي الملون والرقمي.',
        positioning: 'مركز التصوير الطبي المتقدم.',
        toneTraits: ['تقنية', 'موثوقة', 'سريعة'],
        greetingExample: 'أهلاً بك في ألترا سكان، فحصك في أيدٍ أمينة.',
        promoExample: 'احجز موعد السونار الملون مع تقرير معتمد فوري.',
        matchingSlogan: 'دقة تشخيص تمنحك راحة البال',
      },
      {
        id: 'name-4',
        nameAr: 'دقة سكان للأشعة والتشخيص',
        nameEn: 'Deqqa Scan',
        pronunciation: 'دِقّة سكان',
        meaning: 'الإتقان والوضوح البالغ في نتائج التصوير والتشخيص.',
        rationale: 'اسم عربي معبر يركز على الميزة التنافسية الأهم للمريض وهي صحة النتائج.',
        emotionalAssociations: ['ثقة', 'إتقان', 'أمان'],
        style: 'مباشر',
        tradeoff: 'محلي ومحبوب.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في دقة سكان نضع معايير صارمة لجودة الصور الإشعاعية لضمان التشخيص الصحيح.',
        positioning: 'الدقة التشخيصية التي يعتمد عليها كبار الأطباء.',
        toneTraits: ['حاسمة', 'صادقة', 'علمية'],
        greetingExample: 'أهلاً بك في دقة سكان، نسعد بخدمتك.',
        promoExample: 'استلم تقرير الأشعة ديجيتال فوراً على الواتساب.',
        matchingSlogan: 'التشخيص الصح.. يبدأ من هنا',
      },
      {
        id: 'name-5',
        nameAr: 'رواد الأشعة التخصصية',
        nameEn: 'Rawaad Radiology',
        pronunciation: 'رُوّاد',
        meaning: 'السبق والريادة في جلب أحدث نظم التصوير والتشخيص الطبي.',
        rationale: 'اسم وقور وموثوق يعزز مكانة المركز بين المراكز المنافسة.',
        emotionalAssociations: ['ريادة', 'مكانة', 'أمان طبي'],
        style: 'وقور',
        tradeoff: 'طبي تقليدي رصين.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'رواد الأشعة صرح تشخيصي يضم أحدث أجهزة الرنين المغناطيسي والأشعة المقطعية.',
        positioning: 'الريادة والخبرة في التشخيص الإشعاعي.',
        toneTraits: ['وقورة', 'استشارية', 'مطمئنة'],
        greetingExample: 'مرحباً بكم في رواد الأشعة التخصصية.',
        promoExample: 'باقة الفحص الإشعاعي الشامل بأسعار ميسرة.',
        matchingSlogan: 'خبرة ورواد.. لرعاية تدوم',
      },
      {
        id: 'name-6',
        nameAr: 'فيجن للأشعة الرقمية',
        nameEn: 'Vision Digital Imaging',
        pronunciation: 'فيـ-جن',
        meaning: 'الرؤية التشخيصية الثاقبة والواضحة لسلامة المريض.',
        rationale: 'اسم عصري سهل الحفظ يعبر عن التقنية المتقدمة.',
        emotionalAssociations: ['حداثة', 'وضوح', 'رؤية'],
        style: 'عصري',
        tradeoff: 'يتطلب ترسيخ الاسم في السوق المحلي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'فيجن سكان يقدم خدمات الأشعة الرقمية بتجربة مريحة وسريعة بدون طوابير انتظار.',
        positioning: 'التشخيص الرقمي السريع والآمن.',
        toneTraits: ['حديثة', 'مريحة', 'إنسانية'],
        greetingExample: 'أهلاً بكم في فيجن، سلامتك هي غايتنا.',
        promoExample: 'احجز فحصك أونلاين واستلم النتيجة على هاتفك.',
        matchingSlogan: 'رؤية واضحة.. لحياة صحية',
      },
    ];
  }

  // 0.2 TRADITIONAL EGYPTIAN MASMAT (مسمط وأكلات شعبية)
  if (cleanIdea.includes('مسمط') || cleanIdea.includes('كوارع') || cleanIdea.includes('فواكه اللحوم')) {
    return [
      {
        id: 'name-1',
        nameAr: 'مسمط ابن البلد الأصيل',
        nameEn: 'Ibn El Balad Masmat',
        pronunciation: 'ابن البلد',
        meaning: 'الكرم والجدعنة والأكلات الشعبية المصرية على أصولها القديمة.',
        rationale: 'اسم يعكس الأصالة الشعبية وشهامة ابن البلد وطعم الأكل البيتي.',
        emotionalAssociations: ['أصالة', 'شبع وجدعنة', 'كرم مصري'],
        style: 'شعبي أصيل',
        tradeoff: 'شعبي جداً ومحبوب لجمهور الأكيلة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'تأسس مسمط ابن البلد ليقدم صواني المسمط والطواجن الفلاحي بالطشة البلدي المظبوطة.',
        positioning: 'المسمط الشعبي الأقرب لقلوب الأكيلة في مصر.',
        toneTraits: ['بلدية', 'كريمة', 'مرحبة'],
        greetingExample: 'يا هلا بالأكيلة! منورين مسمط ابن البلد وسفرتكم عامرة.',
        promoExample: 'صينية الباشا المشكلة تكفي 4 أكيلة بسعر زمان في ابن البلد!',
        matchingSlogan: 'الأصل مصري.. والأكل على أصوله',
      },
      {
        id: 'name-2',
        nameAr: 'مسمط الحبايب للأكلات الشعبية',
        nameEn: 'El Habayeb Masmat',
        pronunciation: 'الحبايب',
        meaning: 'اللمة الطيبة حول صينية المسمط والمأكولات الشعبية الدافئة.',
        rationale: 'اسم دافئ واجتماعي يدعو للمشاركة واللمة.',
        emotionalAssociations: ['دفء عائلي', 'لمة صحاب', 'طعم زمان'],
        style: 'دافئ',
        tradeoff: 'محلي وحميم.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في مسمط الحبايب نجمع العيلة والصحاب على أحلى طواجن وشوربة كوارع مخدومة بالحب.',
        positioning: 'لمة الأكيلة وأحلى صواني شعبية.',
        toneTraits: ['حميمية', 'ودودة', 'كريمة'],
        greetingExample: 'نورتونا يا حبايب، أحلى لقمة جاهزة عشانكم.',
        promoExample: 'طاجن كوارع بالعكاوي مع رز معمر بالفرن البلدي بخصم اللمة.',
        matchingSlogan: 'لقمة هنية.. تجمع كل الحبايب',
      },
      {
        id: 'name-3',
        nameAr: 'مسمط البركة الشعبي',
        nameEn: 'El Baraka Masmat',
        pronunciation: 'البركة',
        meaning: 'الخير الوفير والشبع التام واللقمة المباركة.',
        rationale: 'اسم مبارك محفور في وجدان الشارع المصري.',
        emotionalAssociations: ['بركة', 'شبع', 'خير'],
        style: 'شعبي تراثي',
        tradeoff: 'تقليدي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'البركة هو عنوان الجودة والنظافة في تقديم الأكلات الشعبية من القلب.',
        positioning: 'أكلات شعبية مصرية بنظافة وطعم لا يُعلى عليه.',
        toneTraits: ['مباركة', 'صادقة', 'شعبية'],
        greetingExample: 'مرحباً بكم في مسمط البركة، بالهنا والشفا.',
        promoExample: 'اطلب صينية الخير الشعبية واستمتع بأصالة الطعم.',
        matchingSlogan: 'بركة زمان.. وطعم الأكل المظبوط',
      },
      {
        id: 'name-4',
        nameAr: 'طشة وطاجن للمأكولات الشعبية',
        nameEn: 'Tasha & Tagen',
        pronunciation: 'طشّـ-ة وطاجن',
        meaning: 'صوت ورائحة التقلية البلدية تفحفح في الطاجن الفخاري الساخن.',
        rationale: 'اسم حسي شهي ومثير للشهية يعبر عن التخصص والحرص على النكهة.',
        emotionalAssociations: ['طشة توم', 'سخونة', 'شهية مفتوحة'],
        style: 'عصري شعبي',
        tradeoff: 'مميز ومبتكر.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'كل طاجن بيطلع من فرمنا بنعمله طشة توم بلدي مخصوص ترن في المكان وتفتح النفس.',
        positioning: 'ملوك الطواجن والأكلات الشعبية المتقنة.',
        toneTraits: ['شهية', 'حماسية', 'بلدية'],
        greetingExample: 'يا مرحب! الطشة البلدي جاهزة وريحتها تفحفح.',
        promoExample: 'طاجن المسمط الساخن مع عيش طازة وشوربة مخدومة هدية.',
        matchingSlogan: 'طشة ترن في الودن.. وطعم يدخل القلب',
      },
      {
        id: 'name-5',
        nameAr: 'سفرة المسمط البلدي',
        nameEn: 'Sufret El Masmat',
        pronunciation: 'سُـ-فرة المسمط',
        meaning: 'السفرة العامرة بجميع أصناف الأكلات الشعبية الأصيلة.',
        rationale: 'اسم فسيح يوحي بالتنوع وغنى الأصناف المقدمة.',
        emotionalAssociations: ['تنوع', 'كرم ضيافة', 'شبع'],
        style: 'أصيل',
        tradeoff: 'مناسب للجلسات والمطاعم الواسعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'سفرتنا تجمع أشهى مأكولات المسمط المصرية بتتبيلات سرية موروثة أباً عن جد.',
        positioning: 'سفرة الأكلات الشعبية الأكثر تنوعاً وجودة.',
        toneTraits: ['مضيافة', 'أصيلة', 'غنية'],
        greetingExample: 'أهلاً بكم على سفرة المسمط البلدي.',
        promoExample: 'وليمة المسمط المتكاملة تكفي العائلة بأفضل سعر.',
        matchingSlogan: 'سفرة عامرة.. بأحلى طعم مصري',
      },
      {
        id: 'name-6',
        nameAr: 'مسمط الباشا الشعبي',
        nameEn: 'El Basha Masmat',
        pronunciation: 'الباشا',
        meaning: 'الخدمة الملكية الراقية والاهتمام بأدق تفاصيل النظافة للأكل الشعبي.',
        rationale: 'يجمع بين هيبة لقب الباشا والأكلات الشعبية المحبوبة.',
        emotionalAssociations: ['خدمة راقية', 'نظافة تامة', 'طعم أصيل'],
        style: 'شعبي راقٍ',
        tradeoff: 'يجذب العائلات والباحثين عن النظافة الفائقة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'أعدنا تعريف تجربة المسمط المصري بأعلى معايير النظافة والخدمة الفندقية مع الحفاظ على النكهة الشعبية الأصيلة.',
        positioning: 'المسمط الشعبي الراقي بنظافة وجودة الباشوات.',
        toneTraits: ['راقية', 'نظيفة', 'واثقة'],
        greetingExample: 'نورتنا يا باشا! طلبك بيتحضر بأعلى نظافة وعناية.',
        promoExample: 'جرب صينية الباشا الممتازة واستمتع بالأكل الشعبي بنكهة خاصة.',
        matchingSlogan: 'أكل شعبي.. بنظافة تليق بالباشا',
      },
    ];
  }

  // 0.3 MATERNITY & OB-GYN HOSPITALS (مستشفيات نساء وتوليد وأمومة)
  if (
    cleanIdea.includes('نسا') ||
    cleanIdea.includes('ولادة') ||
    cleanIdea.includes('نساء') ||
    cleanIdea.includes('أمومة') ||
    cleanIdea.includes('حوامل') ||
    cleanIdea.includes('أطفال أنابيب') ||
    cleanIdea.includes('maternity')
  ) {
    return [
      {
        id: 'name-1',
        nameAr: 'مستشفى الأمومة التخصصي للولادة',
        nameEn: 'Al Omouma Maternity Hospital',
        pronunciation: 'الأمومة',
        meaning: 'أسمى عاطفة إنسانية، ورعاية الأم والجنين بأعلى معايير الأمان الطبي.',
        rationale: 'اسم مباشر وعاطفي يحظى بثقة فورية لدى الأسر والأمهات في مصر.',
        emotionalAssociations: ['حنان وأمان', 'رعاية فائقة', 'فرحة استقبال المولود'],
        style: 'طبي إنساني رفيع',
        tradeoff: 'مباشر وتخصصي في مجال الولادة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'تأسست مستشفى الأمومة لتكون بيت الأمان لكل أم ومولود، بأجنحة ولادة فندقية وحضانات أطفال متطورة.',
        positioning: 'الصرح الطبي الرائد في رعاية الأم والطفل والولادة الآمنة.',
        toneTraits: ['حنونة', 'مطمئنة', 'فندقية راقية'],
        greetingExample: 'أهلاً بكِ في مستشفى الأمومة، نتمنى لكِ ولمولودكِ دوام السلامة والعافية.',
        promoExample: 'باقة الولادة الآمنة المتكاملة تشمل إقامة فندقية وفحص كامل للمولود.',
        matchingSlogan: 'معكِ خطوة بخطوة.. نحو أمومة آمنة وسعيدة',
      },
      {
        id: 'name-2',
        nameAr: 'مستشفى حياة جديدة للولادة ورعاية الأمومة',
        nameEn: 'New Life Maternity Hospital',
        pronunciation: 'حياة جديدة',
        meaning: 'لحظة انبثاق حياة بريئة جديدة تملأ البيت سعادة وأملاً.',
        rationale: 'اسم مفعم بالأمل والبهجة والبدايات السعيدة.',
        emotionalAssociations: ['بداية جديدة', 'أمل وفرحة', 'أمان طبي'],
        style: 'عصري ملهم',
        tradeoff: 'يحتاج تأكيد الصفة الطبية الاستشارية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "حياة جديدة" نوفر لكِ بيئة هادئة بدون توتر ومجهزة بأحدث غرف العمليات والولادة الطبيعية بدون ألم.',
        positioning: 'مستشفى الولادة الأكثر راحة وأماناً للأم والطفل.',
        toneTraits: ['ملهمة', 'مطمئنة', 'عصرية'],
        greetingExample: 'مرحباً بكِ في حياة جديدة، سلامتكِ وفرحتكِ هي مهمتنا الأولى.',
        promoExample: 'تابعي حملكِ مع كبار استشاريي النساء والتوليد مع باقة متابعة شاملة.',
        matchingSlogan: 'لحظة وصول طفلك.. بداية حياة جديدة',
      },
      {
        id: 'name-3',
        nameAr: 'مستشفى دار المهد للولادة التخصصية',
        nameEn: 'Dar Al Mahd Hospital',
        pronunciation: 'دار المَـ-هد',
        meaning: 'سرير الطفل الأول ومهد الرعاية والحنان والأمان.',
        rationale: 'اسم عربي فصيح ودافئ يعبر عن حماية ورعاية الطفل منذ اللحظة الأولى.',
        emotionalAssociations: ['سكينة', 'مهد آمن', 'رعاية طبية'],
        style: 'أصيل وقور',
        tradeoff: 'وقور ويتطلب هوية بصرية ناعمة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'دار المهد صرح طبي متخصص في صحة المرأة والجنين، يوفر أحدث أجهزة السونار رباعي الأبعاد ووحدة رعاية مبتسرين فائقة.',
        positioning: 'المهد الآمن لمستقبل طفلك وصحة الأم.',
        toneTraits: ['وقورة', 'حنونة', 'استشارية'],
        greetingExample: 'أهلاً بكم في دار المهد، نسعد برعايتكم.',
        promoExample: 'كشف وسونار 4D تفصيلي مع استشاري النساء والتوليد.',
        matchingSlogan: 'مهد طفلك الآمن.. ورعاية أمومة لا تنتهي',
      },
      {
        id: 'name-4',
        nameAr: 'مستشفى حواء التخصصي لصحة المرأة والولادة',
        nameEn: 'Eve Specialized Women Hospital',
        pronunciation: 'حَـ-واء',
        meaning: 'أم البشر ورمز المرأة والأنوثة والصحة الشاملة.',
        rationale: 'اسم عالمي وعربي جامع يعبر عن التخصص الحصري في صحة المرأة بمختلف مراحلها.',
        emotionalAssociations: ['خصوصية تامة', 'أنوثة واهتمام', 'رعاية نسائية متكاملة'],
        style: 'عصري نسائي',
        tradeoff: 'خاص بالمرأة حصراً.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'صممنا مستشفى حواء لتوفر خصوصية تامة وراحة مطلقة للمرأة، مع طاقم طبي نسائي متميز.',
        positioning: 'مستشفى المرأة التخصصي الأول للخصوصية والرعاية الفائقة.',
        toneTraits: ['خاصة', 'مريحة', 'مهنية عالية'],
        greetingExample: 'مرحباً بكِ في مستشفى حواء، راحتكِ وخصوصيتكِ أولويتنا.',
        promoExample: 'باقات الفحص الدوري لصحة المرأة والولادة الميسرة بدون ألم.',
        matchingSlogan: 'خصوصية تليق بكِ.. ورعاية تستحقينها',
      },
      {
        id: 'name-5',
        nameAr: 'مستشفى رويال وومن للولادة الفندقية',
        nameEn: 'Royal Women Maternity Hospital',
        pronunciation: 'رويال وومن',
        meaning: 'الخدمة الملكية والفندقية الفاخرة أثناء تجربة الولادة.',
        rationale: 'يجذب الفئات الباحثة عن تجربة ولادة فندقية استثنائية وأجنحة مجهزة.',
        emotionalAssociations: ['فخامة', 'راحة ملكية', 'أمان طبي'],
        style: 'فاخر',
        tradeoff: 'يوحي بارتفاع التكلفة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'تجمع رويال وومن بين كفاءة كبار جراحي الولادة وأجنحة الإقامة الملكية الفندقية لاستقبال مولودك بأناقة.',
        positioning: 'تجربة الولادة الفندقية الفاخرة والأكثر أماناً في مصر.',
        toneTraits: ['فاخرة', 'أنيقة', 'دقيقة'],
        greetingExample: 'أهلاً بكِ في رويال وومن، تجربة ملكية تنتظركِ.',
        promoExample: 'احجزي جناح الولادة الملكي مع باقة استقبال المولود المتكاملة.',
        matchingSlogan: 'ولادة ملكية.. تبدأ بها قصة جديدة',
      },
      {
        id: 'name-6',
        nameAr: 'مستشفى براءة لرعاية الأم والطفل',
        nameEn: 'Baraa Mother & Child Hospital',
        pronunciation: 'بَـ-راءة',
        meaning: 'براءة ونقاء الطفولة وسلامة الأم بعد رحلة الحمل والولادة.',
        rationale: 'اسم نقي ورقيق يلامس مشاعر الأبوين بلطف ويمنح شعوراً بالسلام.',
        emotionalAssociations: ['براءة', 'نقاء', 'فرح وطمأنينة'],
        style: 'رقيق إنساني',
        tradeoff: 'يحتاج ترسيخ الجانب الطبي في الشعار.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في مستشفى براءة نوفر حضانات أطفال حديثة الولادة مزودة بأحدث أجهزة التنفس الصناعي تحت إشراف نخبة من أساتذة طب الأطفال.',
        positioning: 'الملاذ الآمن لصحة ونقاء طفلك وسلامة الأم.',
        toneTraits: ['رقيقة', 'علمية', 'أمينة'],
        greetingExample: 'أهلاً بكم في مستشفى براءة، أطفالكم في أيدٍ أمينة.',
        promoExample: 'فحص ما بعد الولادة ومتابعة نمو الطفل مجاناً مع باقة الولادة.',
        matchingSlogan: 'لأن براءة طفلك.. تستحق أفضل رعاية',
      },
    ];
  }

  // DENTAL CLINICS
  if (analysis.industryId === 'dental') {
    return [
      {
        id: 'name-1',
        nameAr: 'دنتاليا لطب الأسنان',
        nameEn: 'Dentalia Clinic',
        pronunciation: 'دِنـ-تاليا',
        meaning: 'مشتق من الكلمة اللاتينية لطب الأسنان بلمسة عصرية توحي بالفخامة والأناقة العالمية.',
        rationale: 'اسم رنان وسهل الحفظ للمرضى في مصر، يجمع بين العلم والتجربة الفندقية المريحة.',
        emotionalAssociations: ['ثقة طبية', 'فخامة هادئة', 'أمان واطمئنان'],
        style: 'طبي معاصر',
        tradeoff: 'يتطلب إبراز الخدمة المتخصصة في الشعار لترسيخ الهوية الطبية.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة "دنتاليا" لتغيير الصورة النمطية لزيارة طبيب الأسنان في مصر. صنعنا بيئة علاجية راقية تحول الكشف والعلاج إلى تجربة مريحة تماماً بلا ألم وبأعلى معايير التعقيم العالمية.',
        positioning: 'المركز الرائد في مصر لطب وتجميل الأسنان بدون خوف أو ألم.',
        toneTraits: ['مطمئنة', 'عالمية', 'إنسانية', 'دقيقة واحترافية'],
        greetingExample: 'أهلاً بك في دنتاليا! سلامتك وابتسامتك الجميلة هي أولويتنا ونسعد بخدمتك.',
        promoExample: 'احجز فحصك الرقمي الشامل مع جلسة تنظيف وتلميع أسنان بخصم 20% هذا الأسبوع في دنتاليا!',
        matchingSlogan: 'ابتسامتك.. سر ثقتك كل يوم',
      },
      {
        id: 'name-2',
        nameAr: 'صفاء سمايل لطب الأسنان',
        nameEn: 'Safaa Smile Dental',
        pronunciation: 'صَـ-فاء سمايل',
        meaning: 'يعبر عن النقاء، راحة البال، وبياض الأسنان الناصع كالصفاء الخالص.',
        rationale: 'يمزج بين كلمة عربية تبث الطمأنينة وكلمة إنجليزية شائعة تعبر فوراً عن النتيجة المرجوة.',
        emotionalAssociations: ['نقاء', 'راحة بال', 'بياض طبيعي'],
        style: 'عربي إنجليزي متوازن',
        tradeoff: 'يناسب الشرائح العائلية والباحثين عن راحة البال والأسعار العادلة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "صفاء سمايل"، نؤمن بأن كل مريض يستحق أن يبتسم بصفاء وثقة. نعتمد أحدث تقنيات تجميل الأسنان وحشوات الليزر لتعود لبيتك بابتسامة مشرقة من أول جلسة.',
        positioning: 'العيادة العائلية الأكثر دفئاً ونقاءً لرعاية أسنان الكبار والأطفال.',
        toneTraits: ['ودودة', 'مريحة', 'صادقة', 'عائلية'],
        greetingExample: 'مرحباً بك في صفاء سمايل! نتمنى لك يوماً جميلاً وخالياً من أي ألم.',
        promoExample: 'عرض الابتسامة المشرقة من صفاء سمايل: جلسة تبييض أسنان ليزر متطورة مع فحص أسرتك مجاناً!',
        matchingSlogan: 'رعاية أسنان بمعايير عالمية ولمسة إنسانية بلا ألم',
      },
      {
        id: 'name-3',
        nameAr: 'درّة لطب وجراحة الأسنان',
        nameEn: 'Dorra Dental Center',
        pronunciation: 'دُرّة',
        meaning: 'اللؤلؤة الثمينة النفيسة، كناية عن الأسنان البيضاء اللامعة كحبات اللؤلؤ الطبيعي.',
        rationale: 'اسم عربي فصيح عريق يحمل معنى جمالياً نبيلاً يسهل تذكره وترديده.',
        emotionalAssociations: ['أصالة', 'بريق ولؤلؤ', 'قيمة ثمينة'],
        style: 'تراثي فاخر',
        tradeoff: 'يتطلب تركيزاً على خدمات تجميل وزراعة الأسنان عالية المستوى.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'انطلقت "درّة" لتجعل من كل ابتسامة تحفة ثمينة كاللؤلؤ. فريقنا من أمهر استشاريي الزراعة والتركيبات التجميلية يعمل بأحدث الميكروسكوبات الرقمية.',
        positioning: 'وجهة النخبة لتجميل وزراعة الأسنان في مصر.',
        toneTraits: ['راقية', 'رصينة', 'خريطة خبرة متينة', 'دقيقة'],
        greetingExample: 'أهلاً بكم في مركز درّة لطب الأسنان، شرفنا حضوركم ونعدكم برعاية تليق بكم.',
        promoExample: 'خطة تقويم وزراعة الأسنان الفورية بأحدث التقنيات الألمانية مع استشارة مجانية في درّة!',
        matchingSlogan: 'لأن كل ابتسامة تستحق أن تلمع كاللؤلؤ',
      },
      {
        id: 'name-4',
        nameAr: 'أورا كير لطب الأسنان',
        nameEn: 'OraCare Dental Hub',
        pronunciation: 'أورا-كير',
        meaning: 'توليفة من (Oral Care) تعني العناية الفموية الشاملة والمتخصصة.',
        rationale: 'موجز وعصري ويوحي بالحداثة الطبية والتقنيات الرقمية المتقدمة.',
        emotionalAssociations: ['عصرية', 'تقنية طبية', 'اهتمام شامل'],
        style: 'طبي رقمي',
        tradeoff: 'يحتاج توضيح التخصص بالعربية بجوار اللوجو.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'تجمع "أورا كير" بين طب الأسنان الرقمي ثلاثي الأبعاد والاهتمام الشخصي الفائق، لنمنحك تشخيصاً دقيقاً في ثوانٍ وخطة علاجية ميسرة وشفافة.',
        positioning: 'المركز الرقمي الأحدث لعلاج وتجميل الأسنان بدون جراحة تقليدية.',
        toneTraits: ['تقنية متقدمة', 'سريعة', 'واضحة', 'مهنية'],
        greetingExample: 'أهلاً بك في أورا كير! خطواتك الأولى نحو ابتسامة مثالية تبدأ هنا.',
        promoExample: 'افحص أسنانك بالكاميرا الرقمية 3D مع تقرير شامل مجاني لزيارتك الأولى في أورا كير!',
        matchingSlogan: 'صحة أسنانك في أيدٍ أمينة وخبرة تطمئنك',
      },
      {
        id: 'name-5',
        nameAr: 'ابتسامتي كلينك',
        nameEn: 'Ebtisamti Dental Clinic',
        pronunciation: 'ابـ-تِسامتي',
        meaning: 'اسم مباشر يعبر عن ملكية المريض لابتسامته وفرحته وفخره بمظهره الصحي.',
        rationale: 'محبوب وشعبي في الثقافة المصرية، يزيل أي توتر ويشعر المريض بالقرب.',
        emotionalAssociations: ['فرحة', 'ألفة', 'بساطة وأمان'],
        style: 'عفوي مبهج',
        tradeoff: 'طابعه عاطفي وقريب للقلب.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "ابتسامتي كلينك"، هدفنا أن يخرج كل طفل وشاب ومسن وهو فخور بابتسامته. أسعارنا واضحة وعادلة وعلاجنا رفيق بالمرضى من كل الأعمار.',
        positioning: 'عيادة الابتسامة المشرقة والأسعار العادلة لجميع أفراد الأسرة.',
        toneTraits: ['مبهجة', 'ودودة جداً', 'صادقة ومباشرة', 'شعبية راقية'],
        greetingExample: 'يا هلا بنورك في ابتسامتي! نورت عيادتك وإحنا هنا عشان ترجع تبتسم من قلبك.',
        promoExample: 'باقة تنظيف الأسنان العائلية من ابتسامتي: كشف لجميع أفراد الأسرة وتنظيف كامل بنصف السعر!',
        matchingSlogan: 'ابتسامتك.. سر ثقتك كل يوم',
      },
      {
        id: 'name-6',
        nameAr: 'إيليت لطب وجراحة الأسنان',
        nameEn: 'Elite Dental Care',
        pronunciation: 'إيـ-ليت',
        meaning: 'النخبة والصفوة في الخبرة الطبية والدقة المتناهية.',
        rationale: 'يعكس أعلى درجات الاحترافية والتجهيزات الطبية من أجهزة الليزر والأشعة المقطعية.',
        emotionalAssociations: ['صفوة', 'خبرة استشارية', 'أحدث تكنولوجيا'],
        style: 'استشاري راقٍ',
        tradeoff: 'يستهدف الفئات الباحثة عن خبرة كبار الأساتذة والتقنيات الفائقة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'تضم "إيليت" نخبة من أساتذة واستشاريي جراحة وزراعة وتقويم الأسنان في مصر، مع غرف عمليات مجهزة بأعلى مواصفات مكافحة العدوى الدولية.',
        positioning: 'صرح استشاري متكامل لحالات الأسنان المعقدة والتجميل الشامل.',
        toneTraits: ['استشارية رفيعة', 'دقيقة', 'واثقة', 'موثوقة للغاية'],
        greetingExample: 'مرحباً بكم في إيليت لطب وجراحة الأسنان. نخبة أطبائنا في خدمتكم دائماً.',
        promoExample: 'استشارة متخصصة مع أساتذة طب وجراحة الفم والأسنان مع خطة علاجية مخصصة في إيليت!',
        matchingSlogan: 'صحة أسنانك في أيدٍ أمينة وخبرة تطمئنك',
      },
    ];
  }

  // GENERAL MEDICAL CLINICS & HEALTHCARE CENTERS
  if (analysis.industryId === 'medical') {
    return [
      {
        id: 'name-1',
        nameAr: 'شفاء التخصصي للرعاية الطبية',
        nameEn: 'Shefaa Medical Center',
        pronunciation: 'شِـ-فاء',
        meaning: 'تمام العافية واسترداد الصحة، وهو الغاية الأسمى لكل مريض وطبيب.',
        rationale: 'اسم قرآني مبارك يبث السكينة واليقين والأمل في نفوس المرضى وذويهم.',
        emotionalAssociations: ['طمأنينة', 'عافية', 'أمان طبي'],
        style: 'طبي وقور',
        tradeoff: 'يحتاج إبراز التخصصات الطبية بوضوح أسفل الاسم.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'تأسس مركز "شفاء" ليكون واحة الرعاية الصحية الأكثر أماناً وإنسانية. نجمع نخبة من كبار الاستشاريين مع أحدث تقنيات التشخيص لخدمة المريض بكل إخلاص.',
        positioning: 'المركز الطبي التخصصي الأكثر أماناً ورعاية لجميع أفراد الأسرة.',
        toneTraits: ['مطمئنة', 'إنسانية', 'حكيمة', 'صادقة'],
        greetingExample: 'أهلاً بكم في مركز شفاء الطبي، نتمنى لكم ولأسركم دوام الصحة والعافية ونسعد بخدمتكم.',
        promoExample: 'احجز فحصك الطبي الشامل الآن مع نخبة من الاستشاريين واستفد من باقة الفحوصات الدورية بخصم خاص!',
        matchingSlogan: 'صحتك ورعايتك.. أمانة في أيدٍ أمينة',
      },
      {
        id: 'name-2',
        nameAr: 'عافية كلينك التخصصية',
        nameEn: 'Aafiya Clinics',
        pronunciation: 'عـا-فية',
        meaning: 'السلامة التامة في الجسد والروح وخلو البدن من الأسقام والعلل.',
        rationale: 'محبوب وسلس النطق في الثقافة المصرية، يحمل دعاءً جميلاً بالصحة.',
        emotionalAssociations: ['حيوية', 'نشاط', 'راحة بال'],
        style: 'عصري إنساني',
        tradeoff: 'مناسب للعيادات والمراكز الشاملة وطب الأسرة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "عافية كلينك"، نؤمن بأن الوقاية والعلاج المبكر هما سر الحياة الهانئة. نوفر لك متابعة طبية دقيقة وبيئة مريحة خالية من عناء الانتظار.',
        positioning: 'عيادتك الأقرب لصحة مستدامة وحياة مفعمة بالعافية.',
        toneTraits: ['ودودة', 'مريحة', 'مهنية', 'عائلية'],
        greetingExample: 'مرحباً بك في عافية كلينك! سلامتك وصحتك هي أثمن ما نعتني به اليوم.',
        promoExample: 'باقة الفحص الدوري لعائلتك: استشارة استشارية مع تحاليل وظائف حيوية بأسعار ميسرة في عافية.',
        matchingSlogan: 'معاً نحو صحة أفضل وحياة تنبض بالعافية',
      },
      {
        id: 'name-3',
        nameAr: 'بلسم للرعاية الطبية المتكاملة',
        nameEn: 'Balsam Healthcare',
        pronunciation: 'بَلـ-سم',
        meaning: 'المرهم المداوي الشافي الذي يسكّن الألم ويعيد الراحة للجسد.',
        rationale: 'يحمل طابعاً شاعرياً إنسانياً عميقاً يعكس الرفق والتخفيف عن المتألمين.',
        emotionalAssociations: ['تسكين ألم', 'رأفة', 'أمل وشفاء'],
        style: 'إنساني راقٍ',
        tradeoff: 'يتطلب ترسيخ الصورة الطبية الحازمة بجانب الطابع الإنساني الرقيق.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'انطلقت "بلسم" لتقديم رعاية طبية تداوي الجسد برفق وتحترم إنسانية المريض، من خلال طواقم تمريضية وأطباء يعملون بروح الفريق الواحد.',
        positioning: 'صرح الرعاية الصحية الإنسانية الأقرب لقلوب المرضى في مصر.',
        toneTraits: ['رقيقة', 'متفانية', 'علمية', 'محترفة'],
        greetingExample: 'أهلاً بك في بلسم، نسعى دائماً لتخفيف آلامكم ورسم الابتسامة على وجوهكم.',
        promoExample: 'احجز جلستك الاستشارية الطبية مع تقرير صحي شامل في بلسم اليوم.',
        matchingSlogan: 'رعاية تداوي آلامك وتمنحك الأمان',
      },
      {
        id: 'name-4',
        nameAr: 'نور كلينيكس الطبية',
        nameEn: 'Noor Specialized Clinics',
        pronunciation: 'نـ-ور',
        meaning: 'الضياء والوضوح والتشخيص السليم الذي ينير طريق العلاج الصحيح.',
        rationale: 'موجز وقوي وباعث على التفاؤل والراحة النفسية.',
        emotionalAssociations: ['أمل', 'وضوح تشخيص', 'سكينة'],
        style: 'حديث مباشر',
        tradeoff: 'شائع ويتطلب شعاراً بصرياً فريداً للتمييز.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'يقدم مجمع "نور" الطبي أحدث أجهزة السونار والتشخيص الرقمي والتحاليل الفورية، لنقدم لك تشخيصاً قاطعاً يبدأ معه مسار التعافي بثقة.',
        positioning: 'مركز التشخيص الطبي الدقيق والعيادات التخصصية المتطورة.',
        toneTraits: ['مضيئة', 'واضحة', 'دقيقة', 'محترفة'],
        greetingExample: 'مرحباً بكم في نور كلينيكس، نتشرف بخدمتكم ونتمنى لكم تمام الشفاء.',
        promoExample: 'افحص صحة قلبك وجهازك الهضمي مع استشاريين متميزين بخصم افتتاحي خاص في نور.',
        matchingSlogan: 'وضوح في التشخيص.. وشفاء بإذن الله',
      },
      {
        id: 'name-5',
        nameAr: 'ترياق التخصصي',
        nameEn: 'Teryaq Medical Hub',
        pronunciation: 'تِـ-رياق',
        meaning: 'الدواء الشافي والحل الناجع لكل داء وعارض صحي.',
        rationale: 'اسم عريق ذو جذور طبية عربية تاريخية يرتبط بالأدوية والحلول الشافية.',
        emotionalAssociations: ['عراقة طبية', 'حلول جذرية', 'ثقة تامة'],
        style: 'عربي رصين',
        tradeoff: 'يحتاج توعية بمعنى الاسم لدى الشرائح الشابة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "ترياق"، لا نكتفي بعلاج الأعراض، بل نبحث عن جذور المشكلة الصحية لنمنحك علاجاً جذرياً يضمن لك استقرار صحتك ونشاطك الدائم.',
        positioning: 'مركز الحلول الطبية التخصصية المتكاملة في مصر.',
        toneTraits: ['علمية رصينة', 'موثوقة', 'دقيقة'],
        greetingExample: 'أهلاً بكم في ترياق، صحتكم وسلامتكم في طليعة أولوياتنا دائماً.',
        promoExample: 'استشر كبار أساتذة الطب التخصصي واحصل على خطة علاجية مخصصة في ترياق.',
        matchingSlogan: 'الحل الطبي الأمثل لصحتك وسلامتك',
      },
      {
        id: 'name-6',
        nameAr: 'بريميوم هيلث كير',
        nameEn: 'Premium Health Hub',
        pronunciation: 'بريميوم هيلث',
        meaning: 'العناية الطبية الفائقة بمستوى فندقي ومعايير جودة دولية.',
        rationale: 'يناسب المراكز الطبية الكبرى والمستشفيات اليومية والخدمات التخصصية الراقية.',
        emotionalAssociations: ['فخامة طبية', 'نظافة فائقة', 'أحدث تكنولوجيا'],
        style: 'دولي حديث',
        tradeoff: 'يستهدف الشريحة الباحثة عن الخصوصية والخدمة الفندقية السريعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'صممنا "بريميوم هيلث" لتقديم تجربة علاجية خالية من أي توتر، بمواعيد دقيقة وغرف كشف مجهزة بأعلى مواصفات مكافحة العدوى والراحة.',
        positioning: 'صرح الرعاية الطبية الفاخرة والخدمة الفندقية المتكاملة.',
        toneTraits: ['راقية', 'دقيقة', 'استشارية رفيعة'],
        greetingExample: 'Welcome to Premium Health Hub. نسعد باستقبالكم وتوفير أرقى رعاية طبية لكم.',
        promoExample: 'برنامج الكشف الشامل التنفيذي لكبار الشخصيات ورجال الأعمال في بريميوم هيلث كير.',
        matchingSlogan: 'رعاية صحية بمعايير عالمية تليق بك',
      },
    ];
  }

  // EGYPTIAN FOUL, FALAFEL & TRADITIONAL BREAKFAST
  if (analysis.industryId === 'foul-falafel') {
    return [
      {
        id: 'name-1',
        nameAr: 'فلافيلو',
        nameEn: 'Falafelo',
        pronunciation: 'فَـلافِـيلو',
        meaning: 'بهجة الفلافل المصرية المقرمشة بالسمسم والطعم الذهبي الذي يسعد القلوب في الصباح.',
        rationale: 'اسم شبابي رنان وسريع الحفظ، يعبر عن خفة الدم والبهجة المصرية مع الفلافل السخنة المقرمشة.',
        emotionalAssociations: ['قرمشة دهبية', 'فطار يسند', 'بهجة الصباح', 'ساندوتش معتبر'],
        style: 'عصري شبابي',
        tradeoff: 'يحتاج تقديم ساندوتشات مبتكرة ومقرمشة باستمرار مع تغليف نظيف وجذاب.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'في "فلافيلو"، الفلافل مش مجرد فطار.. دي طقس صباحي مقدس! قرص دهبي سخن مقرمش بريحة السمسم المحمص وطشة الكزبرة، في عيش بلدي مقمر مع سلطة وطحينة تسندك طول اليوم.',
        positioning: 'البراند العصري الأكثر نظافة وقرمشة وإتقاناً للفلافل والفول في مصر.',
        toneTraits: ['مبهج', 'سريع', 'كريم', 'ابن بلد'],
        greetingExample: 'يا صباح الفل والقرمشة! نورت فلافيلو، أحلى طعمية سخنة محشية وفول زبدة في انتظارك.',
        promoExample: 'كومبو فطار الأبطال: 2 ساندوتش فلافل محشية + ساندوتش فول بالزيت الحار + كانز بسعر خاص!',
        matchingSlogan: 'قرمشة تفرح القلب وفطار يعدل المزاج',
      },
      {
        id: 'name-2',
        nameAr: 'قدرة وزيت',
        nameEn: 'Qidra & Zeit',
        pronunciation: 'قِـدرة وزَيت',
        meaning: 'رمز الأصالة الشعبية: قدرة الفول المدمس النحاسية والزيت الحار أو الحلو بالليمون والكمون.',
        rationale: 'اسم مباشر وأصيل يزرع الثقة الفورية في دسامة وجودة الفول المدمس والفلافل على أصولها.',
        emotionalAssociations: ['فول مدمس زبدة', 'أصالة مصرية', 'زيت حار معتبر', 'طعم زمان'],
        style: 'تراثي أصيل',
        tradeoff: 'يتطلب الاهتمام بنقاء الزيوت وجودة خامات الفول البلدي الممتاز.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'من قلب الحارة المصرية لقلب مشروعنا، في "قدرة وزيت" الفول بيستوي على نار هادية بالساعات لحد ما يبقى زي الزبدة، مع رشة زيت حار أصلي وعصرة ليمون وكمون توزن العقل.',
        positioning: 'مطعم الفول والفلافل التراثي ذو الجودة والخلطة الأصيلة.',
        toneTraits: ['أصيل', 'شهم', 'مضياف', 'محب للخير'],
        greetingExample: 'يا ألف نهار أبيض! اتفضل يا غالي، الفول من القدرة طالع زبدة سخن يدفيك.',
        promoExample: 'صندوق لَمّة الشغل: علبة فول مشكل + 12 قرص فلافل سمسم + باذنجان وطحينة وعيش بلدي سخن!',
        matchingSlogan: 'فول زبدة من قلب القدرة.. وطعمية ترد الروح',
      },
      {
        id: 'name-3',
        nameAr: 'فلافل الحارة',
        nameEn: 'Falafel El Hara',
        pronunciation: 'فَـلافِـل الحارة',
        meaning: 'طعم الحارة المصرية الدافئة واللمة الحلوة حول قرص الطعمية المقرمش الساخن.',
        rationale: 'اسم دافئ ومألوف لكل مصري يعشق أكلات الشارع النظيفة ذات النكهة المميزة.',
        emotionalAssociations: ['دفء الحارة', 'جدعنة المصريين', 'طعمية محشية سخنة', 'بركة الصباح'],
        style: 'شعبي راقٍ',
        tradeoff: 'يجب أن تكون نكهة الحشوة والبهارات غنية ومطابقة لوصفات الحارة المصرية القديمة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'ريحة الفلافل اللي بتملى الشارع أول ما الزيت يقدح.. في "فلافل الحارة" بنحافظ على سر الخلطة البلدي بالخضرة الطازجة والكزبرة الجافة، عشان تاكل أحلى لقمة في يومك.',
        positioning: 'ساندوتشات الفلافل والتحابيش الشعبية الأكثر سخاءً وطعماً أصيلاً.',
        toneTraits: ['ودود', 'شعبي أصيل', 'كريم', 'مرحب'],
        greetingExample: 'يا أهلاً بيك في فلافل الحارة! لقمتك عندنا سخنة ومخدومة بحب.',
        promoExample: 'عرض الحارة للأكيلة: ساندوتش فلافل محشية + ساندوتش طعمية بالباذنجان + باكت بطاطس بخصم 20%!',
        matchingSlogan: 'سر قرمشة الحارة في كل حتة في مصر',
      },
      {
        id: 'name-4',
        nameAr: 'الفوال البلدي',
        nameEn: 'El Fawal El Baladi',
        pronunciation: 'الفَـوّال البلدي',
        meaning: 'شيخ الصنعة وأستاذ قدرة الفول الذي يعرف أسرار التدميس والتتبيلة والتحبيشة.',
        rationale: 'اسم يوحي بالاحتراف والخبرة الطويلة والتخصص الدقيق في وجبة الفول والفلافل.',
        emotionalAssociations: ['خبرة الصنعة', 'فول بلدي 100%', 'ثقة واطمئنان', 'لقمة شبعانة'],
        style: 'وصفي متوارث',
        tradeoff: 'يجب الالتزام بتقديم خامات فول بلدي عريضة ونظيفة خالية من الشوائب تماماً.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'التدميس مش صنعة أي حد.. الفوال البلدي ورث أسرار الصنعة كابراً عن كابر، الفول بيستوي بحساب مع حبات العدس والأرز والليمون ليعطيك قواماً كريمياً لا يُضاهى.',
        positioning: 'المطعم التخصصي الأول في إتقان وتطوير أطباق وساندوتشات الفول المدمس البلدي.',
        toneTraits: ['خبير', 'واثق', 'أمين', 'متقن'],
        greetingExample: 'مرحباً بك عند الفوال البلدي! طبق الفول المخصوص بالسمنة الفلاحي في انتظارك.',
        promoExample: 'صينية الفوال: فول بالسمنة + بيض مدحرج + فلافل مقرمشة وسلطة وطحينة مع 5 أرغفة!',
        matchingSlogan: 'شيخ الصنعة وأصل الفول البلدي',
      },
      {
        id: 'name-5',
        nameAr: 'طشة وسمسم',
        nameEn: 'Tasha & Semsem',
        pronunciation: 'طَـشّة وسِـمسم',
        meaning: 'صوت القلي المبهج في الزيت الساخن وبريق السمسم المحمص على وش قرص الفلافل.',
        rationale: 'اسم حسي وبصري جذاب جداً، ينشط حاسة السمع والتذوق فور سماعه.',
        emotionalAssociations: ['صوت الطشة', 'ريحة السمسم', 'طازة وسخن', 'شهية مفتوحة'],
        style: 'حسي إبداعي',
        tradeoff: 'يتطلب تقديم الفلافل دائماً طازجة ومقلية أمام الزبون فور الطلب مباشرة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'أول ما تنزل العجينة في الزيت وتسمع صوت "الطشة" وتشوف حبات السمسم الدهبية بتتحمص.. بتعرف إنك في المكان الصح. طشة وسمسم بيقدملك متعة الأكل الحقيقية.',
        positioning: 'أسرع فلافل مقرمشة طازجة تُقلى مباشرة فور طلب الزبون بنظافة فائقة.',
        toneTraits: ['متحمس', 'عصري', 'سريع', 'شغوف'],
        greetingExample: 'يا مرحب! صوت الطشة شغال والسمسم طالع سخن، نعملك ساندوتش إيه؟',
        promoExample: 'طبق طشة وسمسم: 8 أقراص فلافل مقرمشة محشية بالجبنة والشطة مع سلطة طحينة!',
        matchingSlogan: 'أول ما تسمع الطشة.. تعرف إن اليوم بدأ صح',
      },
      {
        id: 'name-6',
        nameAr: 'طعمية زمان',
        nameEn: 'Taameya Zaman',
        pronunciation: 'طَـعمية زَمان',
        meaning: 'نوستالجيا فطار الصباح وسندوتش المدرسة وطعم زمان النقي الأصيل.',
        rationale: 'اسم عاطفي يلمس ذكريات الطفولة وبراءة البدايات لدى كل الفئات العمرية.',
        emotionalAssociations: ['ذكريات الطفولة', 'سندوتش المدرسة', 'بركة زمان', 'لقمة هنية'],
        style: 'كلاسيكي عاطفي',
        tradeoff: 'يحتاج الحفاظ على الطعم الكلاسيكي البسيط دون إفراط في الصلصات الدخيلة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'فاكر ساندوتش الفول والطعمية اللي كان بيدهولك والدك وإنت رايح المدرسة الصبح مع رشة الملح والكمون؟ طعمية زمان بترجعلك نفس الإحساس والنقاء في كل قضمة.',
        positioning: 'مطعم الفول والفلافل الأكثر دفئاً وأصالة واستعادة لذكريات الفطار المصري الجميل.',
        toneTraits: ['حنون', 'صادق', 'نوستالجي', 'كريم'],
        greetingExample: 'يا أهلاً بريحة زمان وبركة زمان! نورتنا، اتفضل أحلى ساندوتش على كيفك.',
        promoExample: 'صندوق ذكريات الفطار: 4 ساندوتشات مشكلة + بطاطس وباذنجان مخلل وشاي بلدي بالنعناع!',
        matchingSlogan: 'فطار زمان بنفس الطعم والبركة اللي تسعدك',
      },
    ];
  }

  // POPULAR EGYPTIAN KOSHARY & HERITAGE
  if (analysis.industryId === 'koshary-food') {
    return [
      {
        id: 'name-1',
        nameAr: 'كشري الخديوي',
        nameEn: 'El Khedive Koshary',
        pronunciation: 'كُـشري الخديوي',
        meaning: 'الفخامة والأصالة الملكية المصرية في إعداد طبق الكشري الأصيل بأعلى معايير الإتقان.',
        rationale: 'اسم مصري فخم وله رنة مألوفة تزرع الثقة الفورية في نظافة وجودة طبق الكشري والصلصة المتسبكة.',
        emotionalAssociations: ['عزوة ولمة', 'أصالة مصرية', 'تقلية ذهبية مقرمشة', 'شبع ملوكي'],
        style: 'تراثي فخم',
        tradeoff: 'يتطلب اهتماماً دائماً بتقديم الكشري في علب وأطباق فاخرة ومكان شديد النظافة والترتيب.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة "كشري الخديوي" من شغف حقيقي بإعادة طبق الكشري المصري لمكانته الملكية.. رز مخدوم، عدس بجودة عالية، بصل دهبي مقرمش من غير نقطة زيت زيادة، ودقة وصلصة متسبكة على نار هادية توزن المزاج.',
        positioning: 'سلسلة مطاعم الكشري العصري الأكثر نظافة وجودة ونكهة أصيلة.',
        toneTraits: ['ابن بلد شهم', 'مضياف', 'كريم', 'واثق في طعمه'],
        greetingExample: 'يا ألف نهار أبيض! نورت الخديوي، طبق الكشري الملوكي والتقلية المقرمشة طالعين سخنين على كيفك، نجهز لحضرتك إيه؟',
        promoExample: 'صينية لمة الصحاب من الخديوي: 4 علب كشري ميكس سوبر + 4 أطباق أرز باللبن + دقة وصلصة زيادة بسعر ملوكي!',
        matchingSlogan: 'الكشري ع أصوله بريحة زمان المتوارثة',
      },
      {
        id: 'name-2',
        nameAr: 'دقة وشطة',
        nameEn: 'Deqqa & Shatta',
        pronunciation: 'دَقّـة وشَـطّة',
        meaning: 'سر الطعم المظبوط والمزاج العالي الذي لا يكتمل طبق الكشري إلا بهما.',
        rationale: 'اسم عصري وجذاب ومباشر جداً، يعكس الشغف بأهم تفصيلتين في عالم الكشري المصري.',
        emotionalAssociations: ['طعم حامي ولذيذ', 'مزاج عالي', 'شبابي سريع', 'نكهة أصيلة'],
        style: 'عصري شبابي',
        tradeoff: 'يجب أن تكون خلطة الشطة الزيت والدقة بالثوم والخل مميزة ومبتكرة ولا تُنسى.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "دقة وشطة"، نؤمن أن سر الكشري مش بس في المكرونة والعدس، السر في النفس.. في طشة التوم والخل اللي تقلب ريحة الشارع، وفي الشطة الزيت اللي تعدل الدماغ مع كل معلقة.',
        positioning: 'براند كشري شبابي سريع يقدم تجربة طعام عصرية بنكهة الشارع المصري الحقيقية.',
        toneTraits: ['شبابي', 'مرح', 'جريء', 'حماسي'],
        greetingExample: 'يا مرحب بالسميعة! دقة وشطة جاهزين يولعوا المزاج، بتحب الكشري شطة خفيفة ولا نار على علم؟',
        promoExample: 'كومبو الأكيل: علبة دقة وشطة سوبر مع طاجن لحمة مفرومة وكانز مثلج يطفي النار!',
        matchingSlogan: 'دقة وشطة تعدل المزاج وتملأ العين',
      },
      {
        id: 'name-3',
        nameAr: 'كشري الباشا',
        nameEn: 'Al Basha Koshary',
        pronunciation: 'كُـشري الباشا',
        meaning: 'الخدمة التمام والمعاملة الكريمة وطبق يشبع ويكرم الزبون.',
        rationale: 'اسم مصري تقليدي محبوب يعبر عن الكرم وامتلاء الطبق بالمكونات الطازجة.',
        emotionalAssociations: ['كرم', 'باشوية', 'شبع حقيقي', 'طبق مظبوط'],
        style: 'شعبي راقي',
        tradeoff: 'الجمهور يتوقع كميات وافرة وحمص وعدس بزيادة تليق بلقب الباشا.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "كشري الباشا" كل زبون يدخل عندنا بيتعامل معاملة الباشوات.. طبق مليان عينه، تقلية فريش صابحة، وطواجن فرن تطلع تسويتها تدوب في البق.',
        positioning: 'مطعم الكشري العائلي الموثوق الذي يجمع بين الوفرة والسعر العادل.',
        toneTraits: ['مرحب', 'كريم', 'ودود', 'اصيل'],
        greetingExample: 'أهلاً يا باشا! خطوة عزيزة، الكشري مخدوم والصلصة بتغلي، نورت مطعمك!',
        promoExample: 'عرض الباشا الأسبوعي: علبة كشري ميكس مخصوص + طاجن مكرونة بصلصة الحاتي بخصم 20%!',
        matchingSlogan: 'طبق كشري ملوكي ينسيك أي تعب',
      },
      {
        id: 'name-4',
        nameAr: 'أوتار الكشري',
        nameEn: 'Awtar Koshary',
        pronunciation: 'أوتار الكُـشري',
        meaning: 'تناغم المكونات وتناسق النكهات كأوتار العود الموسيقي.',
        rationale: 'اسم فني مبتكر يمنح المشروع تميزاً كبيراً عن المطاعم التقليدية.',
        emotionalAssociations: ['تناغم', 'فن في الطبخ', 'موسيقى الطعم', 'ابتكار'],
        style: 'رمزي ومبتكر',
        tradeoff: 'يحتاج تسويقاً بصرياً يربط بين الموسيقى والطهي الشرقي المتقن.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'توليفة الكشري تشبه المقطوعة الموسيقية: الرز نغمة، العدس إيقاع، والتقلية المقرمشة صولو يختم اللحن.. في "أوتار" بنعزفلك طبق كشري ولا في الخيال.',
        positioning: 'مطعم كشري بتجربة مطورة ترتقي بالطبق الشعبي إلى مستوى الفن الراقي.',
        toneTraits: ['فنان', 'راقي', 'شغوف', 'ملهم'],
        greetingExample: 'مرحباً بك في أوتار! مستعد تسمع أحلى سيمفونية طعم في طبق كشري مخدوم؟',
        promoExample: 'لحن التوفير: 3 علب أوتار مخصوص بصلصة الحاتي وطاجن مكرونة بشاميل مجاناً!',
        matchingSlogan: 'تناغم طعم مصري أصيل يعزف على أوتار قلبك',
      },
      {
        id: 'name-5',
        nameAr: 'كشري ست الحبايب',
        nameEn: 'Set El Habayeb Koshary',
        pronunciation: 'كُـشري سِـت الحبايب',
        meaning: 'نَفَس الأم والطبخة البيتية النظيفة الآمنة اللي بتفكرنا بلمة البيت.',
        rationale: 'اسم عاطفي ذو مصداقية عالية في النظافة والجودة المنزلية.',
        emotionalAssociations: ['أكل بيتي نظيف', 'دفء العيلة', 'نَفَس أمي', 'راحة بال'],
        style: 'عاطفي دافئ',
        tradeoff: 'يجب الحفاظ على طعم ونكهة البيت بعيداً عن الطهي التجاري المتسرع.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'مين ينسى طبق كشري كانت بتعمله أمنا يوم الإجازة؟ ريحة الصلصة اللي بتملى البيت والتقلية اللي بناكلها سخنة قبل ما تتحط ع الوش.. "ست الحبايب" بيقدملك نفس الطعم بالظبط.',
        positioning: 'مطعم الكشري الأكثر نظافة وموثوقية بنكهة وروح البيت المصري.',
        toneTraits: ['حنون', 'صادق', 'محب', 'أصيل'],
        greetingExample: 'نورت يا غالي! أكلنا بيتي ونضيف من إيدين أمينة، ألف هنا وشفا مقدماً.',
        promoExample: 'عزومة ست الحبايب: اشتري علبتين كشري حجم عائلي وعليهم علبة أرز باللبن وقشطة هدية!',
        matchingSlogan: 'نَفَس بيتي أصيل وطعم يرد الروح',
      },
      {
        id: 'name-6',
        nameAr: 'كشري زمان',
        nameEn: 'Koshary Zaman',
        pronunciation: 'كُـشري زمان',
        meaning: 'نوستالجيا القاهرة الخمسينيات والستينيات حين كان لكل حاجة طعم وبركة.',
        rationale: 'اسم راسخ ذو حضور تراثي يفضله الكبار والشباب الباحثون عن الذكريات الجميلة.',
        emotionalAssociations: ['نوستالجيا', 'بركة زمان', 'خير زمان', 'أصالة مستمرة'],
        style: 'كلاسيكي مصري',
        tradeoff: 'الديكور والعبوات تحتاج لمسات كلاسيكية قديمة مثل ورق الكرافت والخط العربي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "كشري زمان"، بنرجعك لأيام الضحكة الصافية والصحبة الحلوة، بطبق كشري معمول بنفس الوصفة المصرية القديمة من غير أي إضافات تضيع الطعم الأصلي.',
        positioning: 'مطعم الكشري الكلاسيكي الذي يحافظ على النكهة التراثية الأصلية.',
        toneTraits: ['حكيم', 'نوستالجي', 'مضياف', 'كلاسيكي'],
        greetingExample: 'يا أهلاً بريحة زمان وأهل زمان! نورتنا في كشري زمان، اتفضل احلى طبق مظبوط.',
        promoExample: 'صندوق ذكريات زمان: كشري وطاجن وبطاطس ومهلبية بأسعار وبركة زمان!',
        matchingSlogan: 'طعم أصيل من أيام الخير والبركة',
      },
    ];
  }

  // POPULAR STREET FOOD (Kebda, Sugok, Hawawshi, Street Eats)
  if (analysis.industryId === 'street-food') {
    return [
      {
        id: 'name-1',
        nameAr: 'كبدة الحارة',
        nameEn: 'Kebda El Harra',
        pronunciation: 'كِـ-بدة الحارة',
        meaning: 'أصالة الحارة المصرية القديمة، حيث نار الصاج شغالة واللقمة البركة تجمع الأكيلة.',
        rationale: 'اسم شعبي قريب جداً من القلب، يعلق سريعاً في ذهن الزبائن ويدل على العراقة والأصل.',
        emotionalAssociations: ['حارة مصرية', 'ريحة طشة تفحفح', 'شبع وجدعنة'],
        style: 'شعبي أصيل',
        tradeoff: 'يحتاج الحفاظ الدائم على سخونة الصاج وجودة الكبدة الطازجة يومياً.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'في قلب أزقة القاهرة القديمة، بدأت "كبدة الحارة" من صاج حديد ونار حامية وسر خلطة بلدي بالثوم والكمون والفلفل الحامي والليمون، بتنزل في عيش بلدي سخن يرد الروح.',
        positioning: 'مطعم الكبدة والسجق الشعبي الأكثر أصالة وشهرة في المنطقة.',
        toneTraits: ['ابن بلد', 'بشوش', 'كريم', 'شعبي أصيل'],
        greetingExample: 'يا مسا الفل والورد على الأكيلة! نورت كبدة الحارة، الصاج بيولع والسلطات جاهزة، نجهزلك إيه يا غالي؟',
        promoExample: 'صينية الحارة: 5 ساندوتشات كبدة وسجق مشكل + بطاطس وطحينة ومخلل بسعر خاص للصحاب!',
        matchingSlogan: 'طشة على الصاج.. وطعم يرد الروح',
      },
      {
        id: 'name-2',
        nameAr: 'الصاج البلدي',
        nameEn: 'El Sag El Baladi',
        pronunciation: 'الصّـ-اج البلدي',
        meaning: 'الصاج الحديد التقليدي الذي تصنع عليه أحلى ساندوتشات كبدة وسجق وحواوشي أمام عينيك.',
        rationale: 'اسم مباشر يدل على الطهي الفوري الطازج أمام الزبون والنظافة والأمانة.',
        emotionalAssociations: ['سخونة وطزاجة', 'ساندوتش مليان', 'سر الخلطة'],
        style: 'وصفي شعبي',
        tradeoff: 'يركز على مأكولات الصاج والساندوتشات السريعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'سر "الصاج البلدي" إن كل حاجة بتستوي قدام عينك طازة، تتبيلة مخصوصة ولحوم بلدي مضمونة وعيش سخن طالع من الفرن.',
        positioning: 'الوجهة الأولى لساندوتشات الصاج الساخنة بأعلى معايير النظافة والطعم البلدي.',
        toneTraits: ['مباشر', 'متقن', 'حيوي', 'مضياف'],
        greetingExample: 'ألف مرحب بيك في الصاج البلدي! الصاج بيغلي ومستعدين نحضر طلبك فوراً.',
        promoExample: 'اطلب 3 ساندوتشات كبدة إسكندراني واحصل على بيبسي مثلج وبطاطس بالدقة هدية!',
        matchingSlogan: 'على الصاج قدام عينك.. طعم ميتنسيش',
      },
      {
        id: 'name-3',
        nameAr: 'كبدة البريمو',
        nameEn: 'Kebda El Primo',
        pronunciation: 'كِـ-بدة البريمو',
        meaning: 'البريمو أي الرقم واحد وصاحب الصنعة واليد العليا في الكبدة الإسكندراني.',
        rationale: 'كلمة دارجة ومحبوبة جداً في الشارع المصري تعبر عن الثقة المطلقة في الجودة.',
        emotionalAssociations: ['ثقة', 'نمرة واحد', 'شغل معلمين'],
        style: 'شعبي دارج',
        tradeoff: 'يتطلب خدمة سريعة جداً لمواكبة لقب البريمو.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'لأن الكبدة صنعة مش أي حد يتقنها، اتأسس "كبدة البريمو" عشان يكون المعلم الأول في التتبيلة والتسوية المظبوطة بدون زفارة.',
        positioning: 'الخيار الأضمن للأكيلة اللي بيفهموا في الكبدة البلدي على أصولها.',
        toneTraits: ['واثق', 'حرفي', 'مرح', 'شعبي'],
        greetingExample: 'يا هلا بالبريمو اللي نورنا! نجهزلك الكبدة حامية ولا مظبوطة؟',
        promoExample: 'عرض المعلم البريمو: رغيف حواوشي ع الفحم مع 2 ساندوتش كبدة وسلطة بلدي بخصم 15%!',
        matchingSlogan: 'سر الصنعة عند البريمو',
      },
      {
        id: 'name-4',
        nameAr: 'طشة ولمّة',
        nameEn: 'Tasha & Lamma',
        pronunciation: 'طَـ-شة ولَمّة',
        meaning: 'صوت ورائحة الطشة البلدي التي تجذب المارة ولمة الصحاب بعد الشغل والجامعة.',
        rationale: 'اسم عاطفي جداً يجمع بين الشهية وروح الصحبة والتجمع المصري.',
        emotionalAssociations: ['طشة تفحفح', 'لمة حبايب', 'كرم مصري'],
        style: 'تراثي معاصر',
        tradeoff: 'طابعه دافئ ومناسب للمطاعم ذات الصالات والطلبات الخارجية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'ريحة الطشة اللي ترد الروح ولَمّة الصحاب والعيلة هي سر كل ساندوتش بنحضره في مطبخنا بكل حب وأمانة.',
        positioning: 'مطعم الأكل الشعبي اللي بيجمع الصحاب على أحلى ساندوتشات كبدة وسجق.',
        toneTraits: ['دافئة', 'كرم مصري', 'أصيلة', 'مرحبة'],
        greetingExample: 'يا هلا بلَمّتنا الغالية في طشة ولمّة! طشتنا سخنة ومستنياك.',
        promoExample: 'صينية اللَمّة تكفي 4 أفراد بسعر خاص مع مشروبات وسلطات مجانية!',
        matchingSlogan: 'لَمّة الصحاب وسر الطشة الأصيلة',
      },
      {
        id: 'name-5',
        nameAr: 'كبدة الخواجة',
        nameEn: 'Kebda El Khawaga',
        pronunciation: 'كِـ-بدة الخواجة',
        meaning: 'نكهة مصرية أصيلة مقدمة بنظافة وشياكة فندقية تليق بالخواجات.',
        rationale: 'يمزج بين الطعم الشعبي الجبار ومعايير النظافة والتغليف العصري.',
        emotionalAssociations: ['نظافة تامة', 'طعم جبار', 'تميز وشياكة'],
        style: 'شعبي مطور',
        tradeoff: 'التسعير أعلى قليلاً من العربات العادية لضمان معايير النظافة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'حبنا للأكل الشعبي خلانا نقدمه بطريقة جديدة تماماً: نفس التتبيلة القوية والسر البلدي، بس بنظافة وتعقيم وتغليف شيك يشرفك.',
        positioning: 'ساندوتشات الكبدة والسجق الشعبية بأعلى معايير النظافة والتغليف الراقي.',
        toneTraits: ['شيك', 'نظيف', 'واثق', 'محترم'],
        greetingExample: 'نورت كبدة الخواجة! الطعم البلدي اللي بتحبه بس بنظافة وشياكة مفيش زيها.',
        promoExample: 'وجبة الخواجة المميزة: 3 ساندوتشات مشكل + بطاطس مبهرة + صوص خاص بخصم الافتتاح!',
        matchingSlogan: 'طعم بلدي أصيل.. بنظافة وشياكة تليق بيك',
      },
      {
        id: 'name-6',
        nameAr: 'رغيف وسلطة',
        nameEn: 'Rgheef & Salata',
        pronunciation: 'رغيف وسَـ-لطة',
        meaning: 'أساس الأكلة المصرية الشعبية التمام: الرغيف البلدي الطازج مع دقة السلطة والطحينة.',
        rationale: 'اسم بسيط وسهل الحفظ يصف وجبة الشارع المصري المحبوبة.',
        emotionalAssociations: ['بساطة', 'شبع مضمون', 'طحينة ودقة بلدية'],
        style: 'وصفي بسيط',
        tradeoff: 'مناسب للوجبات السريعة والسفري والتيك أواي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'كل أكلة وليها أصول، وعندنا الأصول بتبدأ من رغيف بلدي طالع من الفرن وسلطة معمولة بدقة توم ولمون تفتح النفس.',
        positioning: 'مطعم الساندوتشات الشعبية الأسرع والأوفر والألذ في الحي.',
        toneTraits: ['شعبي', 'بسيط', 'صريح', 'خدوم'],
        greetingExample: 'يا مرحب بيك في رغيف وسلطة! الرغيف سخن ومستني يكمل مزاجك.',
        promoExample: 'اطلب أي 4 ساندوتشات وخد علبة سلطة خضراء وطحينة مجاناً!',
        matchingSlogan: 'اللقمة الهنية تكفي مية',
      },
    ];
  }

  // PIZZA & ITALIAN CUISINE
  if (analysis.industryId === 'pizza') {
    return [
      {
        id: 'name-1',
        nameAr: 'بيتزانو إيطاليانو',
        nameEn: 'Pizzano Italiano',
        pronunciation: 'بيتـ-زانو',
        meaning: 'أفران الحطب الإيطالية والبيتزا النابولية الأصيلة بجبنة موزاريلا مطاطية غنية.',
        rationale: 'اسم رنان ومحبوب يربط بين إتقان البيتزا العالمي والروح الشبابية المصرية.',
        emotionalAssociations: ['جبنة ذائبة', 'أفران حطب', 'نكهة إيطالية فاخرة'],
        style: 'إيطالي معاصر',
        tradeoff: 'يحتاج التركيز على البيتزا والباستا المتخصصة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة "بيتزانو" من ولع بأفران الحطب وعجينة مخمرة 48 ساعة وصلصة طماطم إيطالية طازجة مع رشة ريحان وأجود أنواع الموزاريلا.',
        positioning: 'بيتزا الحطب الإيطالية الأكثر قرمشة وسخاءً في مصر.',
        toneTraits: ['مبهجة', 'شهية', 'شغوفة', 'إيطالية دافئة'],
        greetingExample: 'Benvenuto في بيتزانو! بيتزتك السخنة بتجهز في الفرن بريحة تاخد العقل.',
        promoExample: 'اطلب بيتزا لارج واحصل على بيتزا ميديوم وبطاطس ودجز مجاناً النهاردة!',
        matchingSlogan: 'قرمشة على الحطب.. وجبنة تشد القلب',
      },
      {
        id: 'name-2',
        nameAr: 'فورنو بيتزا',
        nameEn: 'Forno Woodfire Pizza',
        pronunciation: 'فورنو بيتزا',
        meaning: 'مشتق من الكلمة الإيطالية للفرن الحجري العتيق صانع أشهى صواني البيتزا.',
        rationale: 'اسم راقٍ يوحي بالاحترافية والأصالة العالية في أفران الحجارة.',
        emotionalAssociations: ['حرفية حجرية', 'صلصة سرية', 'جودة استثنائية'],
        style: 'حرفي راقٍ',
        tradeoff: 'يناسب المطاعم الراقية ومحبي البيتزا النابولية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "فورنو"، النار والحطب هما أبطال الحكاية، نصنع كل بيتزا بحرفية فنية تجمع الطعم الإيطالي العريق.',
        positioning: 'أصل البيتزا النابولية بأفران الحطب في قلب مصر.',
        toneTraits: ['واثقة', 'راقية', 'شغوفة بالأصالة', 'دافئة'],
        greetingExample: 'يا أهلاً بك في فورنو! استعد لتجربة ألذ شريحة بيتزا حقيقية.',
        promoExample: 'عرض فورنو المميز: 2 بيتزا نابولي مع صودا إيطالية وسلطة خضراء بسعر خاص!',
        matchingSlogan: 'سر البيتزا الحقيقية.. من الفرن الحجري لقلبك',
      },
      {
        id: 'name-3',
        nameAr: 'بيلا فيستا بيتزا',
        nameEn: 'Bella Vista Pizza',
        pronunciation: 'بيلا فيستا',
        meaning: 'الإطلالة الجميلة والبهجة الإيطالية المصاحبة لأحلى تجمع على صواني البيتزا الساخنة.',
        rationale: 'اسم موسيقي مألوف ومرتبط بالفخامة والتجمعات العائلية المبهجة.',
        emotionalAssociations: ['بهجة عائلية', 'طعم غني', 'كرم ولذة'],
        style: 'عصري مبهج',
        tradeoff: 'يتطلب قائمة أطباق تشمل الباستا والمقبلات الإيطالية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'تجمع العيلة والأصحاب على صينية بيتزا غرقانة جبنة ومكونات طازجة هي اللحظة اللي بنعيش عشانها في بيلا فيستا.',
        positioning: 'وجهة العائلات والأصدقاء الأولى لأشهى بيتزا وباستا.',
        toneTraits: ['ودودة', 'مبهجة', 'مرحبة', 'عائلية'],
        greetingExample: 'نورت بيلا فيستا! جهزنا لك سفرة إيطالية تفتح النفس.',
        promoExample: 'كومبو الأصحاب: 3 بيتزا لارج مع لتر مشروب وبطاطس متبلة بسعر توفير خيالي!',
        matchingSlogan: 'لَمّة الأصحاب وطعم البيتزا اللي ما يتنسيش',
      },
      {
        id: 'name-4',
        nameAr: 'كروست & تشيز',
        nameEn: 'Crust & Cheese',
        pronunciation: 'كروست آند تشيز',
        meaning: 'التركيز على سرين أساسيين: الأطراف المحشوة المقرمشة والجبنة المطاطية الوفيرة.',
        rationale: 'شبابي وسريع ويعالج النقطة الأكثر جاذبية للشباب في البيتزا.',
        emotionalAssociations: ['مطاطية الجبنة', 'أطراف مقرمشة', 'شبع وانبساط'],
        style: 'شبابي سريع',
        tradeoff: 'يناسب التوصيل السريع والمناطق الشبابية والمولات.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'كل سنتيمتر في بيتزا كروست & تشيز محسوب، من طرف العجينة المحشو حتى قلب الشريحة الغارق في الجبنة.',
        positioning: 'البيتزا الأجرأ والأغنى بالجبنة والمحشوة الأطراف في مصر.',
        toneTraits: ['حماسية', 'شبابية', 'مباشرة', 'شهية'],
        greetingExample: 'يا مساء الجبنة السايحة! جاهز تشد أول قطمة؟',
        promoExample: 'عرض السهرة: اطلب بيتزا تشيزي كروست دوبل وخد كوكيز وشوكولاتة هدية!',
        matchingSlogan: 'كل قطمة غرقانة جبنة من أول الطرف لآخره',
      },
      {
        id: 'name-5',
        nameAr: 'سلايس هاوس',
        nameEn: 'Slice House Pizza',
        pronunciation: 'سلايس هاوس',
        meaning: 'بيت شرائح البيتزا العملاقة الطازجة على الطريقة النيويوركية والإيطالية.',
        rationale: 'اسم أمريكي-إيطالي معاصر يلائم نظام السلايس السريع والوجبات الفردية.',
        emotionalAssociations: ['سلايس ضخم', 'سرعة وإنجاز', 'طازج وسخن'],
        style: 'عصري سريع',
        tradeoff: 'يركز على نظام السلايس والوجبات السريعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'مش لازم تستنى صينية كاملة! في سلايس هاوس بنقدملك أضخم شريحة بيتزا سخنة مقرمشة تسند يومك وتعدل مزاجك في ثواني.',
        positioning: 'سلايس البيتزا الأضخم والأسرع لمحبي الأكل السريع المتقن.',
        toneTraits: ['سريعة', 'عصرية', 'عملية', 'مرحة'],
        greetingExample: 'Welcome to Slice House! سلايسك السخن طالع من الفرن حالاً.',
        promoExample: 'وجبة الغداء السريع: 2 سلايس جامبو + بطاطس ومشروب بسعر ولا في الأحلام!',
        matchingSlogan: 'سلايس يسندك وطعم يعمر دماغك',
      },
      {
        id: 'name-6',
        nameAr: 'أوريغانو بيسترو',
        nameEn: 'Origano Bistro',
        pronunciation: 'أوريـ-غانو',
        meaning: 'عشبة الأوريغانو الإيطالية العطرية، رمز النكهة المتوسطية الفاخرة للبيتزا والباستا.',
        rationale: 'مثالي لمطاعم البيتزا والباستا الإيطالية والمأكولات الراقية.',
        emotionalAssociations: ['أصالة إيطالية', 'جبنة ذائبة', 'فخامة خفيفة'],
        style: 'متوسطي أنيق',
        tradeoff: 'مناسب تحديداً للأطباق الإيطالية والغربية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'فرن حجري حقيقي، عجينة مخمرة 48 ساعة، وموزاريلا طازجة مع رشة أوريغانو أصيلة.',
        positioning: 'المطعم الإيطالي الأصيل بأفران الحطب في مصر.',
        toneTraits: ['أنيقة', 'أصيلة', 'عاطفية', 'راقية'],
        greetingExample: 'Benvenuto في أوريغانو! رائحة البيتزا والباستا الطازجة في انتظارك.',
        promoExample: 'اطلب بيتزا الحطب المفضلة لديك واحصل على مقبلات إيطالية وسلطة هدية!',
        matchingSlogan: 'تفاصيل تصنع الفارق الذي يستحقه يومك',
      },
    ];
  }

  // BURGERS & FAST FOOD
  if (analysis.industryId === 'burger') {
    return [
      {
        id: 'name-1',
        nameAr: 'سماش كرافت برجر',
        nameEn: 'Smash Craft Burger',
        pronunciation: 'سماش كرافت',
        meaning: 'حرفية وفن السماش برجر المكرمل بالأطراف المقرمشة واللحم البلدي الصافي 100%.',
        rationale: 'اسم يواكب ثورة السماش برجر في مصر ويعبر عن قمة الإتقان والجودة.',
        emotionalAssociations: ['لحم بلدي', 'سماش مقرمش', 'صوص سري'],
        style: 'عصري تخصصي',
        tradeoff: 'يركز على ثقافة السماش برجر والبطاطس المبهرة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'البرجر عندنا مش مجرد ساندوتش، لحم بلدي فريش بنضغط عليه على الجريل السخن بحرفية عشان نطلع أحلى كراميل وقرمشة.',
        positioning: 'أقوى ساندوتش سماش برجر بلدي بطعم صوصات سرية لا تقاوم.',
        toneTraits: ['جريئة', 'شبابية', 'شهية', 'واثقة'],
        greetingExample: 'يا هلا في سماش كرافت! الجريل شغال وساندوتشك جاهز يروق عليك.',
        promoExample: 'اطلب دوبل سماش كومبو وخد ساندوتش سينجل هدية لأعز أصحابك!',
        matchingSlogan: 'أول قطمة كفيلة تقولك يعني إيه سماش برجر حقيقي',
      },
      {
        id: 'name-2',
        nameAr: 'سموكي برجر',
        nameEn: 'Smoky Burger House',
        pronunciation: 'سموكي برجر',
        meaning: 'نكهة التدخين الخشبي ورائحة الشواء الفاخرة للبرجر المطهو على نار هادئة.',
        rationale: 'اسم مباشر وجذاب لعشاق المذاق المدخن الغني والجبنة السائلة.',
        emotionalAssociations: ['تدخين خشبي', 'صوص باربيكيو مدخن', 'شبع وفخامة'],
        style: 'عصري مدخن',
        tradeoff: 'مناسب لبرجر اللحم المدخن والمشوي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في سموكي، بنسيب اللحم يتشرب ريحة الخشب الطبيعي وصوص الباربيكيو المدخن لتقديم نكهة عميقة تسكن الذاكرة.',
        positioning: 'بيت البرجر المدخن الفاخر بأجود قطعيات اللحم في مصر.',
        toneTraits: ['واثقة', 'شهية', 'قوية', 'دافئة'],
        greetingExample: 'يا مرحب بيك في سموكي! جهز نفسك لتذوق برجر مشوي على الأصول.',
        promoExample: 'ساندوتش سموكي بيكون مع بطاطس وافل وصوص جبنة سايحة بسعر خاص!',
        matchingSlogan: 'نكهة التدخين الأصيلة.. وبرجر ملوكي يسعدك',
      },
      {
        id: 'name-3',
        nameAr: 'روقان برجر',
        nameEn: 'Rawaqan Burger',
        pronunciation: 'رَوَ-قان برجر',
        meaning: 'أكل مزاج عالي يعدل المزاج ويفصلك عن زحمة اليوم بساندوتش مشبع ولذيذ.',
        rationale: 'كلمة شبابية مصرية محبوبة تدعو للاسترخاء والأكل اللذيذ مع الأصحاب.',
        emotionalAssociations: ['روقان بال', 'طاقة إيجابية', 'شبع وسعادة'],
        style: 'شبابي سريع',
        tradeoff: 'يناسب المطاعم السريعة والدليفري.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'كل ساندوتش في "روقان" معمول عشان يروق على مزاجك، خامات ممتازة ولقمة تشبع وتسعد القلب.',
        positioning: 'المطعم الشبابي الأسرع والألذ لتعديل المزاج بأشهى برجر.',
        toneTraits: ['عفوية', 'شبابية', 'قريبة من القلب', 'مرحة'],
        greetingExample: 'يا مساء الروقان كله! نورتنا ومستعدين نروق عليك بأحلى وجبة.',
        promoExample: 'روقها مع عرض الصحاب: 2 ساندوتش دبل والتالت بنصف السعر النهاردة!',
        matchingSlogan: 'طعم يعيش في البال من أول قطمة',
      },
      {
        id: 'name-4',
        nameAr: 'شيفز برجر لاونج',
        nameEn: 'Chef Burger Lounge',
        pronunciation: 'شيفز برجر',
        meaning: 'مساحة الشيف المحترف لتقديم أرقى وصفات البرجر المبتكرة باللحوم الممتازة.',
        rationale: 'اسم راقٍ يناسب المولات والمناطق الحيوية والباحثين عن جودة فندقية.',
        emotionalAssociations: ['حرفية شيف', 'لحم فاخر', 'تقديم فندقي'],
        style: 'عالمي فاخر',
        tradeoff: 'يتطلب الحفاظ على معايير الجودة العالية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في شيفز برجر، الخبز مخبوز طازة يومياً، والصوصات ابتكار خاص للشيف، واللحم مفروم يومياً بلا إضافات مصنعة.',
        positioning: 'وجهة عشاق الجورميه برجر المطهو بإتقان فندقي عالمي.',
        toneTraits: ['راقية', 'شغوفة', 'أنيقة', 'واثقة'],
        greetingExample: 'Welcome to Chef Burger Lounge! رحلة تذوق لا مثيل لها بانتظارك.',
        promoExample: 'اطلب ترافل برجر الشيف الفاخر اليوم واستمتع بحلقات البصل ومشروبك مجاناً!',
        matchingSlogan: 'أصل الجودة.. ومكانك المفضل دائماً',
      },
      {
        id: 'name-5',
        nameAr: 'بان & باتي',
        nameEn: 'Bun & Patty',
        pronunciation: 'بان آند باتي',
        meaning: 'التكامل المثالي بين خبز البريوش الطازج وقطعة اللحم المشوية بإتقان على اللهب.',
        rationale: 'اسم إنجليزي-عربي حديث ومختصر يعلق فوراً في أذهان جيل الشباب.',
        emotionalAssociations: ['بريوش هش', 'لحم عصاري', 'بساطة وأناقة'],
        style: 'مودرن سريع',
        tradeoff: 'يركز على البريوش والبرجر الكلاسيكي المعاصر.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'من حبة القمح المخبوزة بريوش ذهبي لقطعة اللحم المعصورة عصارة ولذة، بان & باتي يعيد تعريف كلاسيكيات البرجر.',
        positioning: 'برجر البريوش الطازج الأكثر طراوة ولذة في المدينة.',
        toneTraits: ['حيوية', 'بسيطة', 'عصرية', 'شهية'],
        greetingExample: 'أهلاً بك في بان & باتي! أحلى ساندوتش طازة جاهز ليك.',
        promoExample: 'وجبة العودة للدراسة والعمل: برجر بريوش + بطاطس ومشروب بسعر ولا أروع!',
        matchingSlogan: 'بساطة المكونات.. وعظمة الطعم الأصيل',
      },
      {
        id: 'name-6',
        nameAr: 'سماشر هاوس',
        nameEn: 'Smasher House',
        pronunciation: 'سماشر هاوس',
        meaning: 'بيت السماش برجر الضخم والوجبات المشبعة المليئة بالجبنة والبهجة.',
        rationale: 'قوي ونغمي وسهل التداول بين الشباب عبر منصات التواصل.',
        emotionalAssociations: ['طاقة شبابية', 'شبع كبير', 'أجواء حماسية'],
        style: 'شبابي جريء',
        tradeoff: 'مناسب لطلبات التيك أواي والدليفري المكثفة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في سماشر هاوس، بنلعب على المضمون: لحم بيكرمش على الصاج السخن، جبنة سايحة، وشبع حقيقي يملأ العين.',
        positioning: 'بيت السماش برجر الأوفر والألذ للشبع الحقيقي.',
        toneTraits: ['جريئة', 'شبابية', 'مرحة', 'صريحة'],
        greetingExample: 'يا مرحب في سماشر هاوس! اطلب وحلي يومك بأحلى ساندوتش.',
        promoExample: 'تحدي سماشر: 3 قطع برجر مع بطاطس تشيزي بسعر توفير خاص للصحاب!',
        matchingSlogan: 'ساندوتش بجد.. يشبع ويسعد أي حد',
      },
    ];
  }

  // SHAWARMA & MIDDLE EASTERN
  if (analysis.industryId === 'shawarma') {
    return [
      {
        id: 'name-1',
        nameAr: 'شاورما الريف',
        nameEn: 'Shawarma Al Reef',
        pronunciation: 'شاورما الريف',
        meaning: 'الأصالة والنكهة التراثية الشامية والمصرية على سيخ الشاورما الدوار.',
        rationale: 'اسم مألوف ومحبوب وموثوق لجميع فئات المستهلكين في مصر.',
        emotionalAssociations: ['سيخ شاورما ذهبي', 'تومية شامية', 'خبز صاج مقرمش'],
        style: 'أصيل معاصر',
        tradeoff: 'يركز على شاورما اللحم والفراخ والفتات.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة شاورما الريف من سيخ يدور على نار هادية مع تتبيلة متوارثة تسيل اللعاب، وخبز صاج يلف اللقمة بالحب.',
        positioning: 'شاورما السيخ البلدي الأكثر غنى بالنكهة والكرم في مصر.',
        toneTraits: ['ودودة', 'كريمة', 'شهية', 'أصيلة'],
        greetingExample: 'يا أهلاً بالغالين في شاورما الريف! السيخ سخن وجاهز يلف لك أحلى ساندوتش.',
        promoExample: 'صاروخ الشاورما العائلي مع تومية ومخلل وبطاطس هدية على كل طلب!',
        matchingSlogan: 'سر الشاورما في لفتها.. ونار السيخ ولمتها',
      },
      {
        id: 'name-2',
        nameAr: 'سيخ وصاج',
        nameEn: 'Seekh & Saaj',
        pronunciation: 'سيخ وصاج',
        meaning: 'الجمع بين دورة السيخ الساخنة وقرمشة خبز الصاج الطازج المحمص.',
        rationale: 'اسم سريع ومميز يعبر عن الطريقة المفضلة للمستهلك المصري في أكل الشاورما.',
        emotionalAssociations: ['قرمشة صاج', 'تومية سبايسي', 'ريحة تشهي'],
        style: 'عصري تخصصي',
        tradeoff: 'يركز على ساندوتشات الصاج والوجبات العربي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في سيخ وصاج، الساندوتش بياخد تحميصة على الجريل عشان يقرمش في بؤك وتدوق طعم التتبيلة مع التومية المظبوطة.',
        positioning: 'ساندوتش الشاورما على الصاج الأكثر قرمشة وسخاءً.',
        toneTraits: ['حيوية', 'صريحة', 'شهية', 'سريعة'],
        greetingExample: 'منور سيخ وصاج! ساندوتشك على النار بيتحمص حالاً.',
        promoExample: 'وجبة عربي دبل مع بطاطس وتومية ومخلل بسعر خاص جداً!',
        matchingSlogan: 'قرمشة صاج من برة.. ولذاذة سيخ من جوة',
      },
      {
        id: 'name-3',
        nameAr: 'معلم شاورما',
        nameEn: 'Moallem Shawarma',
        pronunciation: 'معلم شاورما',
        meaning: 'أستاذ الصنعة وحرفي التتبيل الذي يقطع شرائح اللحم والفراخ كالذهب.',
        rationale: 'اسم ابن بلد واثق يدل على التمكن والخبرة الطويلة في المهنة.',
        emotionalAssociations: ['أستاذية الصنعة', 'تتبيلة خاصة', 'ثقة وسخاء'],
        style: 'شعبي فخم',
        tradeoff: 'يركز على الطابع المصري الشعبي الأصيل.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'المعلم في مطبخنا عارف سر كل بهار وكل شريحة لحم عشان تطلع دايبة في البق مشدودة التتبيلة.',
        positioning: 'شاورما المعلمين على أصولها بلا منازع.',
        toneTraits: ['واثقة', 'ابن بلد', 'شهية', 'كريمة'],
        greetingExample: 'يا ألف مرحب بيك عند المعلم! شاورمتك معمولة بمزاج عالي.',
        promoExample: 'اطلب 3 ساندوتشات شاورما وخد الرابع هدية من المعلم!',
        matchingSlogan: 'الصنعة ليها معلم.. وشاورمتنا طعم يتكلم',
      },
      {
        id: 'name-4',
        nameAr: 'شاورما كرافت',
        nameEn: 'Shawarma Craft',
        pronunciation: 'شاورما كرافت',
        meaning: 'تطوير الشاورما التقليدية بأسلوب عصري وصوصات ونكهات مدخنة ومبتكرة.',
        rationale: 'عصري وشبابي يلائم الجامعات والمولات والشباب.',
        emotionalAssociations: ['ابتكار', 'نظافة فائقة', 'طعم متطور'],
        style: 'عصري مودرن',
        tradeoff: 'يتطلب تقديم ابتكارات ونكهات جديدة كالشاورما المدخنة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'أخدنا شاورما الشارع وطورناها بوصفات خاصة وصوصات مبتكرة ونظافة فندقية ترضي أصعب الأذواق.',
        positioning: 'الشاورما العصرية الأكثر ابتكاراً وجودة للشباب.',
        toneTraits: ['مبتكرة', 'أنيقة', 'شبابية', 'منعشة'],
        greetingExample: 'Welcome to Shawarma Craft! مستعد تدوق الشاورما بشكل جديد تماماً؟',
        promoExample: 'جرب شاورما كرافت المدخنة بالصوص الخاص بخصم 20% اليوم!',
        matchingSlogan: 'الشاورما اللي بتحبها.. بتجربة عصرية تفاجئك',
      },
      {
        id: 'name-5',
        nameAr: 'أصل الشاورما',
        nameEn: 'Asl Al Shawarma',
        pronunciation: 'أصل الشاورما',
        meaning: 'العودة للوصفة النقية الأصيلة بلا إضافات مصنعة أو حيل تسويقية.',
        rationale: 'اسم واضح ومباشر يعزز الثقة في نظافة وطزاجة اللحوم والفراخ.',
        emotionalAssociations: ['طعم أصلي', 'أمان غذائي', 'لحم بلدي'],
        style: 'كلاسيكي أصيل',
        tradeoff: 'يركز على الوصفة الكلاسيكية النقية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في أصل الشاورما، بنحترم طعم اللحمة الأصلي، تتبيل متوازن ومكونات طبيعية 100% تسعد قلبك مع كل لقمة.',
        positioning: 'مطعم الشاورما الكلاسيكية الأكثر أماناً ولذة في السوق.',
        toneTraits: ['صادقة', 'مطمئنة', 'أصيلة', 'هادئة'],
        greetingExample: 'أهلاً بك في أصل الشاورما! هنا الطعم على أصوله بلا مبالغة.',
        promoExample: 'فتة شاورما كلاسيك مع أرز بسمتي وسلطات بسعر مميز جداً!',
        matchingSlogan: 'الطعم الأصيل بلا مبالغة.. شاورما على الأصول',
      },
      {
        id: 'name-6',
        nameAr: 'تومية وصاج',
        nameEn: 'Toumeya & Saaj',
        pronunciation: 'تومية وصاج',
        meaning: 'عشاق التومية والخبز المحمص الذين لا يكتمل ساندوتش الشاورما عندهم إلا بهما.',
        rationale: 'شهي ومحدد جداً لنقطة القوة الأكثر طلباً في الشاورما.',
        emotionalAssociations: ['تومية كريمي', 'خبز مقرمش', 'بهجة الأكل'],
        style: 'شهي متخصص',
        tradeoff: 'يتطلب تقديم تومية كريمية خرافية بمستويات مختلفة (عادية وسبايسي).',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'السر في التومية الكريمية البيضا اللي بتلف الشاورما السخنة جوة العيش الصاج المحمص لقمة ما تشبعش منها.',
        positioning: 'أشهى ساندوتش شاورما غرقان تومية وصاج مقرمش.',
        toneTraits: ['مرحة', 'شهية', 'ودودة', 'قريبة'],
        greetingExample: 'يا مساء التومية الحلوة! جاهزين نسعدك بساندوتش شاورما يحبه قلبك.',
        promoExample: 'اطلب أي وجبة شاورما واحصل على طبق تومية سبايسي وبطاطس هدية!',
        matchingSlogan: 'ساندوتش غرقان تومية ومقرمش على الصاج',
      },
    ];
  }

  // GRILLS & KEBABJI
  if (analysis.industryId === 'grills') {
    return [
      {
        id: 'name-1',
        nameAr: 'كبابجي الحارة',
        nameEn: 'Kababji El Hara',
        pronunciation: 'كبابجي الحارة',
        meaning: 'أصالة الكبابجي المصري القديم، واللحم البلدي المشوي على الفحم الطبيعي.',
        rationale: 'اسم عريق يزرع الثقة الفورية في طزاجة اللحم البلدي وكرم الضيافة.',
        emotionalAssociations: ['فحم مشتعل', 'كباب بلدي', 'ريحة ترد الروح'],
        style: 'تراثي أصيل',
        tradeoff: 'يركز على الكباب والكفتة والريش والطرب البلدي.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة كبابجي الحارة من فحم مولع وتتبيلة بصل وبهارات بلدي متوارثة أباً عن جد، لتقديم كباب وكفتة بطعم زمان.',
        positioning: 'كبابجي اللحم البلدي الأصيل الأكثر أمانة ولذة في مصر.',
        toneTraits: ['ابن بلد', 'كريم', 'واثق', 'مرحب'],
        greetingExample: 'يا هلا بضيفنا العزيز! الشواية سخنة والريحة ترد الروح في كبابجي الحارة.',
        promoExample: 'صينية الحارة المشكلة: كباب وكفتة وطرب مع أرز وسلطات وعيش بلدي سخن بسعر عائلي!',
        matchingSlogan: 'على الفحم البلدي.. كباب وكفتة على الأصول',
      },
      {
        id: 'name-2',
        nameAr: 'شواية الباشا للمشويات',
        nameEn: 'El Basha Grill',
        pronunciation: 'شواية الباشا',
        meaning: 'الفخامة الملكية في تقديم المشويات الفاخرة المتبلة بأيدي أمهر الشيفات.',
        rationale: 'اسم فخم ومحبوب يوحي بسخاء الوجبة والضيافة الملوكية.',
        emotionalAssociations: ['عزومة ملوكية', 'ريش ضاني فاخرة', 'كرم وسخاء'],
        style: 'تراثي فخم',
        tradeoff: 'يناسب العزومات والتجمعات العائلية الكبيرة والمناسبات.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في شواية الباشا، ضيفنا يتعامل معاملة الباشاوات، سفرة تملأ العين من أجود قطعيات اللحم الطازجة وسلطات تفتح النفس.',
        positioning: 'سفرة المشويات الملوكية الأرقى للعزومات والمناسبات في مصر.',
        toneTraits: ['مضيافة', 'فخمة', 'كريمة', 'مطمئنة'],
        greetingExample: 'ألف مرحب بباشا المكان! شرفتنا ومستعدين لخدمتك بأرقى ما عندنا.',
        promoExample: 'صينية الباشا الملكية تكفي 5 أفراد مع مقبلات وسلطات وحلو مجاناً!',
        matchingSlogan: 'سفرة تليق بمقامك.. وطعم كباب يبهج حواسك',
      },
      {
        id: 'name-3',
        nameAr: 'فحم ونار المشويات',
        nameEn: 'Fahm & Naar Grills',
        pronunciation: 'فحم ونار',
        meaning: 'السر الحقيقي للشواء الناجح: فحم مشتعل ونار هادية تطهو اللحم بحرفية.',
        rationale: 'اسم قوي وشعبي معبر جداً عن حقيقة الصنعة وسر المذاق.',
        emotionalAssociations: ['دخان شواء شهي', 'لحم عصاري', 'طاقة وحيوية'],
        style: 'شعبي قوي',
        tradeoff: 'يركز على المشويات السريعة والساندوتشات والوجبات.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'فحم ونار مش مجرد اسم، دي طريقتنا اليومية في إشعال الشغف وتقديم كفتة وكباب وموزات مشوية تشرف سفرتك.',
        positioning: 'مطعم المشويات الأسرع والألذ على الفحم الطبيعي.',
        toneTraits: ['قوية', 'صريحة', 'شهية', 'خدومة'],
        greetingExample: 'يا مرحب بيك في فحم ونار! طلبك على الشواية ريحته تشهي.',
        promoExample: 'كيلو كفتة مشوية على الفحم مع كيلو أرز وسلطات وعيش بسعر توفير خاص!',
        matchingSlogan: 'نار الشواء والفحم.. طعم ما يتنسيش',
      },
      {
        id: 'name-4',
        nameAr: 'سفرة المشويات',
        nameEn: 'Sofret El Mashweyat',
        pronunciation: 'سفرة المشويات',
        meaning: 'السفرة العامرة التي تجمع الأسرة والأصدقاء على تشكيلة مشاوي تسعد الجميع.',
        rationale: 'عائلي ودافئ ويناسب التجمعات الكبيرة والعزومات المنزلية والتوصيل.',
        emotionalAssociations: ['دفء عائلي', 'سفرة عامرة', 'سعادة جماعية'],
        style: 'عائلي مريح',
        tradeoff: 'يناسب المطاعم ذات الصالات الواسعة أو التوصيل العائلي.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'سفرة المشويات اتأسست عشان تكون رمز اللمة الحلوة اللي بتجمع العيلة على أكل نظيف مضمون معمول بكل حب وأمانة.',
        positioning: 'مطعم العائلة المفضل للمشويات والوجبات المتكاملة.',
        toneTraits: ['عائلية', 'دافئة', 'كريمة', 'مطمئنة'],
        greetingExample: 'نورت سفرة المشويات! بيتك ومطرحك وسفرتك جاهزة.',
        promoExample: 'وجبة العيلة السعيدة: تشكيلة مشاوي مشكلة مع مقبلات وشوربة مجانية!',
        matchingSlogan: 'سفرة مشويات تجمع الحبايب على الخير واللذة',
      },
      {
        id: 'name-5',
        nameAr: 'أصل الكباب',
        nameEn: 'Asl El Kabab',
        pronunciation: 'أصل الكباب',
        meaning: 'الحفاظ على المعايير القديمة للشواء البلدي بلا غش أو خلطات مصنعة.',
        rationale: 'يبعث على الثقة والأمان في اللحوم المقدمة وهي النقطة الأهم للزبون المصري.',
        emotionalAssociations: ['ثقة وأمانة', 'لحم بلدي معتمد', 'طعم لا يقاوم'],
        style: 'كلاسيكي موثوق',
        tradeoff: 'يتطلب التأكيد الدائم على جودة ومصدر اللحوم البلدية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في أصل الكباب، بنراهن على الأمانة: لحوم بلدية مختارة بعناية، تقطيع طازة، وتتبيل بلدي يبرز طعم اللحمة من غير إخفاء.',
        positioning: 'الكبابجي الأكثر أمانة وموثوقية في اللحم البلدي.',
        toneTraits: ['صادقة', 'مطمئنة', 'أصيلة', 'واثقة'],
        greetingExample: 'أهلاً بك في أصل الكباب! هنا بتاكل لحمة بلدية صافية تطمن قلبك.',
        promoExample: 'عرض الأكيلة: ربع كباب وكفتة مع أرز بسمتي وسلطات بسعر مميز!',
        matchingSlogan: 'الأمانة في اللحم.. والسر في الفحم',
      },
      {
        id: 'name-6',
        nameAr: 'طشة وشواء',
        nameEn: 'Tasha & Shawaa',
        pronunciation: 'طشة وشواء',
        meaning: 'المزج بين سحر الطشة المصرية ونكهة الشواء على الفحم في أطباق وساندوتشات متفردة.',
        rationale: 'اسم جذاب وشهي يجمع بين أكل الشارع المحبوب والمشويات الفاخرة.',
        emotionalAssociations: ['طشة توم', 'شواء مدخن', 'شهية مفتوحة'],
        style: 'مصري شهي',
        tradeoff: 'يحتاج قائمة تضم المشويات وطواجن الفرن.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'صوت الطشة مع دخان الفحم بيعملوا سيمفونية في مطبخنا، عشان كل طبق يوصلك سخن بيغلي وريحته تفرح القلب.',
        positioning: 'المطعم الذي يجمع بين روعة المشويات وسحر الطواجن المصرية.',
        toneTraits: ['شهية', 'مبهجة', 'مرحبة', 'حيوية'],
        greetingExample: 'يا مساء الطشة الحلوة والشواء اللذيذ! نورتنا.',
        promoExample: 'طاجن مشويات بالطشة مع أرز وسلطات بسعر ولا في الخيال!',
        matchingSlogan: 'طشة تفرح القلب.. وشواء يظبط المزاج',
      },
    ];
  }

  // GENERAL RESTAURANTS & FOOD (No Burger/Pizza - Pure Egyptian and Universal Dining)
  if (analysis.industryId === 'restaurant') {
    return [
      {
        id: 'name-1',
        nameAr: 'لقمة وفكرة',
        nameEn: 'Loqma & Fekra',
        pronunciation: 'لُـ-قمة وفِكرة',
        meaning: 'الجمع بين الطعم المصري الأصيل والابتكار العصري في تقديم الوجبات الشهية.',
        rationale: 'اسم جذاب يعلق بالأذهان ويدل على التميز والإبداع في المذاق والخدمة.',
        emotionalAssociations: ['طعام شهي', 'إبداع', 'دفء مصري'],
        style: 'عصري مبتكر',
        tradeoff: 'يحتاج تنويع مستمر في قائمة الأطباق.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأ "لقمة وفكرة" من حب الطبخ المصري مع لمسات جريئة تحول كل وجبة إلى تجربة استثنائية تسعد الحواس.',
        positioning: 'المطعم العصري الذي يعيد ابتكار النكهة المصرية برقي وجودة عالية.',
        toneTraits: ['مبهجة', 'شهية', 'مبتكرة', 'ودودة'],
        greetingExample: 'نورت لقمة وفكرة! جاهزين نسعدك بألذ الأطباق المعمولة مخصوص عشانك.',
        promoExample: 'جرب صنف الشيف الجديد اليوم بخصم 20% مع بطاطس مقرمشة وصوص خاص هدية!',
        matchingSlogan: 'طعم يعيش في البال من أول قطمة',
      },
      {
        id: 'name-2',
        nameAr: 'طشة ولَمّة',
        nameEn: 'Tasha & Lamma',
        pronunciation: 'طَـ-شة ولَمّة',
        meaning: 'صوت ورائحة الطشة المصرية الساحرة واجتماع الأهل والأحباب على سفرة واحدة.',
        rationale: 'عاطفي جداً ومرتبط بوجدان الشارع وسعادة التجمع العائلي.',
        emotionalAssociations: ['أصالة', 'رائحة طعام نفاذة', 'لَمّة أحباب'],
        style: 'تراثي معاصر',
        tradeoff: 'طابعه دافئ ومرتبط بالطعام الشرقي والمأكولات المنزلية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'ريحة الطشة اللي ترد الروح ولَمّة الصحاب والعيلة هي سر كل طبق بنحضره في مطبخنا بكل حب وأمانة.',
        positioning: 'سفرة الطعام البلدي والمأكولات الأكثر أصالة ولذة في مصر.',
        toneTraits: ['دافئة', 'كرم مصري', 'أصيلة', 'مرحبة'],
        greetingExample: 'يا هلا بلَمّتنا الغالية! سفرتك جاهزة والطشة سخنة مستنياك.',
        promoExample: 'صينية اللَمّة تكفي 4 أفراد بسعر خاص مع مشروبات وسلطات مجانية!',
        matchingSlogan: 'لَمّة العيلة وسر النكهة الأصيلة',
      },
      {
        id: 'name-3',
        nameAr: 'بيت المذاق',
        nameEn: 'Beit Al Mazaq',
        pronunciation: 'بيت المذاق',
        meaning: 'الملاذ الأول لكل من يبحث عن الأكل الطيب المتقن والخدمة الفندقية الراقية.',
        rationale: 'اسم كلاسيكي فخم يبعث على الثقة الفورية في نظافة وجودة الطعام.',
        emotionalAssociations: ['فخامة هادئة', 'أطباق متنوعة', 'ثقة ومذاق عالي'],
        style: 'كلاسيكي راقٍ',
        tradeoff: 'يتطلب تقديم قائمة طعام غنية تناسب مختلف الأذواق.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في بيت المذاق، كل طبق حكاية فن وإتقان، ننتقي الخامات الطازجة يومياً لنصنع لك تجربة طعام تليق بذوقك الرفيع.',
        positioning: 'مطعم الأطباق الراقية والمذاق المتكامل في مصر.',
        toneTraits: ['راقية', 'مرحبة', 'واثقة', 'كريمة'],
        greetingExample: 'أهلاً بك في بيت المذاق! شرفتنا ومستعدين لأخذك في رحلة طهي استثنائية.',
        promoExample: 'اطلب وجبة الغداء المفضلة واحصل على طبق مقبلات وحلو اليوم مجاناً!',
        matchingSlogan: 'أصل الجودة.. ومكانك المفضل دائماً',
      },
      {
        id: 'name-4',
        nameAr: 'زاد الكرم',
        nameEn: 'Zad Al Karam',
        pronunciation: 'زاد الكرم',
        meaning: 'الوفرة والبركة والضيافة المصرية التي تكرم الضيف وتملأ السفرة بالخير.',
        rationale: 'اسم دافئ يرسخ لقيمة الكرم المصري وسخاء الوجبة والكميات.',
        emotionalAssociations: ['كرم أصيل', 'سخاء وكميات وفيرة', 'لقمة هنية'],
        style: 'تراثي دافئ',
        tradeoff: 'يناسب المطاعم العائلية والوجبات المشبعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'زاد الكرم اتأسس على مبدأ واحد: ضيفنا لازم يخرج شبعان ومبسوط وراضي عن كل تفصيلة في سفرته.',
        positioning: 'سفرة الكرم والسخاء والجودة العالية في مصر.',
        toneTraits: ['كريمة', 'ودودة', 'صادقة', 'مرحبة'],
        greetingExample: 'يا مرحب بالكرام في زاد الكرم! سفرتكم عامرة بالخير واللذة.',
        promoExample: 'صينية زاد الكرم العائلية تكفي 5 أفراد مع أرز وسلطات بسعر ولا أروع!',
        matchingSlogan: 'اللقمة الهنية تكفي مية.. وزاد الكرم دايم',
      },
      {
        id: 'name-5',
        nameAr: 'طبلية زمان',
        nameEn: 'Tabliyet Zaman',
        pronunciation: 'طبلية زمان',
        meaning: 'الحنين لجلسة الطبلية الدافئة والأكل البيتي النظيف المطبوخ بالسمن البلدي.',
        rationale: 'نوستالجي قوي ومحبوب يلامس وجدان العائلات والشباب على حد سواء.',
        emotionalAssociations: ['نوستالجيا ودفء', 'أكل بيتي مضمون', 'بركة بيت العيلة'],
        style: 'نوستالجي أصيل',
        tradeoff: 'يناسب الأكل المصري الشرقي والطواجن والأطباق المنزلية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'رجعنا لك بهجة لَمّة الطبلية بتاعة زمان، أكل على أصوله بمقادير مضبوطة ومحبة حقيقية تملأ قلبك.',
        positioning: 'مطعم الأكل البيتي الأصيل المضمون 100%.',
        toneTraits: ['أمومية دافئة', 'كريمة', 'مطمئنة', 'أصيلة'],
        greetingExample: 'ألف مرحب بيك في طبلية زمان.. نورت بيتك ومطرحك.',
        promoExample: 'طاجن اليوم مع رز بالشعرية وسلطات بلدية بسعر زمان مخصوص عشانك!',
        matchingSlogan: 'معاك في كل خطوة على الأصول',
      },
      {
        id: 'name-6',
        nameAr: 'سفرة وهنية',
        nameEn: 'Sofra & Haniya',
        pronunciation: 'سفرة وهنية',
        meaning: 'اللقمة الهنية التي تشبع وتريح البال وتجعل اليوم أجمل وألذ.',
        rationale: 'سهل الترديد وقريب للأذن ومناسب للمطاعم السريعة والعائلية.',
        emotionalAssociations: ['راحة بال', 'شبع وسعادة', 'طعام نظيف'],
        style: 'عصري دافئ',
        tradeoff: 'يناسب الوجبات اليومية ووجبات الغداء وسفرة العمل.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في سفرة وهنية، بنجهز لك كل يوم أكل يريح بالك ومعدتك، نظافة تامة وطعم بيتي متقن.',
        positioning: 'اللقمة الهنية اليومية الأكثر نظافة ومذاقاً.',
        toneTraits: ['بسيطة', 'مريحة', 'شهية', 'صادقة'],
        greetingExample: 'يا هلا بيك في سفرة وهنية! جاهزون لتقديم أحلى وجبة لغدائك.',
        promoExample: 'عرض الغداء اليومي: وجبة متكاملة مع شوربة وسلطة بسعر توفير خاص!',
        matchingSlogan: 'لقمة هنية تسعد يومك وتريح بالك',
      },
    ];
  }

  // COFFEE SHOPS & SPECIALTY CAFES (قهوة، كافيه، مقهى، بن، روستري)
  if (
    analysis.industryId === 'cafe' ||
    cleanIdea.includes('مقهى') ||
    cleanIdea.includes('مقهي') ||
    cleanIdea.includes('كافيه') ||
    cleanIdea.includes('قهوة') ||
    cleanIdea.includes('بن')
  ) {
    return [
      {
        id: 'name-1',
        nameAr: 'رَشفة وبُن',
        nameEn: 'Rashfa & Bunn',
        pronunciation: 'رَ-شفة وبُن',
        meaning: 'الرشفة الأولى الغنية التي تعدل المزاج وأصل حبة البن الطازجة المحمصة بعناية.',
        rationale: 'اسم جذاب ودافئ يعلق بالأذهان ويرتبط فورياً بروقان القهوة والجلسة الهادئة.',
        emotionalAssociations: ['روقان', 'رائحة بن طازجة', 'مزاج عالٍ'],
        style: 'عصري دافئ',
        tradeoff: 'مناسب للكافيهات المتخصصة وعشاق القهوة المختصة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأ "رشفة وبن" من حب حقيقي لتفاصيل فنجان القهوة؛ ننتقي أجود محاصيل البن الأثيوبي والبرازيلي ونحمصها طازجة يومياً لنصنع لك رشفة لا تُنسى.',
        positioning: 'المقهى العصري الأكثر تميزاً في جودة التحميص ودفء الأجواء.',
        toneTraits: ['هادئة', 'دافئة', 'مرحبة', 'شغوفة'],
        greetingExample: 'يا صباح الفل في رشفة وبن! قهوتك المفضلة بتتحمص وبتتحضر مخصوص عشانك.',
        promoExample: 'اطلب قهوتك الصباحية واحصل على قطعة كوكيز طازجة أو مخبوزات بخصم 50%!',
        matchingSlogan: 'طعم يعيش في البال من أول رشفة',
      },
      {
        id: 'name-2',
        nameAr: 'ديوان القهوة',
        nameEn: 'Diwan Al Qahwa',
        pronunciation: 'ديوان القهوة',
        meaning: 'المجلس الأنيق الذي يجمع الأحباب والأصدقاء على فنجان قهوة ومحادثات ممتعة.',
        rationale: 'اسم تراثي معاصر يعبر عن كرم الضيافة والوقار والأصالة.',
        emotionalAssociations: ['أصالة', 'لَمّة صحاب', 'ضيافة كريمة'],
        style: 'تراثي راقٍ',
        tradeoff: 'طابعه دافئ ويناسب الجلسات الهادئة ومجالس العمل.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في ديوان القهوة، أعدنا إحياء طقوس القهوة العربية والشرقية والمختصة في بيئة راقية تمنحك راحة البال ولحظات هادئة تستحقها.',
        positioning: 'ديوان الضيافة والقهوة الأصيلة في مصر.',
        toneTraits: ['مضيافة', 'كريمة', 'راقية', 'مريحة'],
        greetingExample: 'أهلاً بكم في ديوان القهوة، شرفتم مجلسنا وقهوتكم جاهزة على الأصول.',
        promoExample: 'جلسة المساء في الديوان: دلة قهوة عربية مع تمر ومكسرات بسعر خاص لـ 3 أفراد!',
        matchingSlogan: 'لَمّة الصحاب وسر القهوة الأصيلة',
      },
      {
        id: 'name-3',
        nameAr: 'أروما روستري',
        nameEn: 'Aroma Roastery',
        pronunciation: 'أروما روستري',
        meaning: 'عبق ورائحة البن الذكية التي تملأ الأرجاء فور طحنه وتحميصه.',
        rationale: 'اسم عالمي يعكس التخصص والاحترافية العالية في القهوة المختصة.',
        emotionalAssociations: ['فخامة', 'نقاء النكهة', 'قهوة مختصة'],
        style: 'عالمي عصري',
        tradeoff: 'يركز على محاصيل البن الفاخر والتحميص المتقدم.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في أروما روستري، التحميص علم وفن؛ نتحكم في درجات الحرارة بدقة لنبرز النوتات العطرية والفاكهية في كل محصول بن.',
        positioning: 'محمصة وكافيه القهوة المختصة الرائد في مصر.',
        toneTraits: ['خبيرة', 'عصرية', 'شغوفة'],
        greetingExample: 'Welcome to Aroma! ريحة البن الطازة جاهزة تعدل يومك.',
        promoExample: 'احصل على ربع كيلو بن مطحون مخصوص لأول مرة بخصم 20% مع أي مشروب!',
        matchingSlogan: 'عبير البن الأصيل.. في كل فنجان',
      },
      {
        id: 'name-4',
        nameAr: 'ركن البن الأصيل',
        nameEn: 'Rukn Al Bunn',
        pronunciation: 'ركن البن',
        meaning: 'الملاذ الحميمي والزاوية الدافئة لكل من يقدر البن المطحون المظبوط على الأصول.',
        rationale: 'قريب لقلب المستهلك المصري وسهل الحفظ والتداول.',
        emotionalAssociations: ['دفء', 'بن محوج على الأصول', 'ثقة يومية'],
        style: 'أصيل معاصر',
        tradeoff: 'مناسب لبيع البن المطحون والمشروبات السريعة.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'توارثنا سر تحويجة البن المصري بالحبهان والمستكة، لنقدم لك في ركن البن فنجاناً يعدل الرأس ويعيد إليك نشاطك.',
        positioning: 'أصل البن المحوج والقهوة المصرية المظبوطة.',
        toneTraits: ['ودودة', 'صادقة', 'مصرية أصيلة'],
        greetingExample: 'يا مرحب في ركن البن! فنجانك على الريحة ولا مظبوط؟',
        promoExample: 'عرض التحويجة الخاصة: اشتري 2 باكت بن محوج بخصم 15%!',
        matchingSlogan: 'فنجان قهوة يعدل الرأس على الأصول',
      },
      {
        id: 'name-5',
        nameAr: 'فِنجان ومَزاج',
        nameEn: 'Finjan & Mazag',
        pronunciation: 'فِنجان ومَزاج',
        meaning: 'الارتباط الوثيق بين القهوة النقية والروقان وراحة البال.',
        rationale: 'اسم مصري معبر جداً عن الغاية الأولى من شرب القهوة في مصر.',
        emotionalAssociations: ['راحة بال', 'مزاج رايق', 'سعادة فورية'],
        style: 'شعبي عصري راقٍ',
        tradeoff: 'مناسب للمقاهي السريعة وتجمعات الأصدقاء.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'اتأسس "فنجان ومزاج" عشان يكون مكانك المفضل لما تحتاج تفصل عن زحمة اليوم وتشرب قهوة معمولة على مهل تروق دمك.',
        positioning: 'مقهى الروقان وتعديل المزاج اليومي.',
        toneTraits: ['عفوية', 'مبهجة', 'مريحة'],
        greetingExample: 'يا هلا بيك في فنجان ومزاج! جاهزين نظبط مزاجك اليوم.',
        promoExample: 'كومبو المزاج: مشروب القهوة المفضل مع تشيز كيك بسعر خاص طوال الأسبوع!',
        matchingSlogan: 'روقان ومزاج عالي.. من أول فنجان',
      },
      {
        id: 'name-6',
        nameAr: 'قهوتنا لاونج',
        nameEn: 'Qahwatna Lounge',
        pronunciation: 'قهوتنا لاونج',
        meaning: 'الشعور بالألفة والملكية، وكأن المقهى بيتك الثاني الذي ترتاح فيه.',
        rationale: 'بسيط، حميمي، ويعزز شعور الانتماء للمكان.',
        emotionalAssociations: ['ألفة', 'بيت ثانٍ', 'راحة واسترخاء'],
        style: 'مودرن دافئ',
        tradeoff: 'يستهدف التجمعات والشباب والعائلات.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في قهوتنا، كل زبون هو صاحب مكان؛ أجواء مريحة وإنترنت سريع ومشروبات قهوة باردة وساخنة تليق بجمعتكم الحلوة.',
        positioning: 'المقهى الحميمي الأكثر راحة وجودة.',
        toneTraits: ['حميمية', 'مرحبة', 'نشطة'],
        greetingExample: 'نورت قهوتنا! مكانك المفضل ومشروبك مستنيك.',
        promoExample: 'خصم 20% لطلبة الجامعات وأصحاب العمل الحر على جميع المشروبات بعد الظهر!',
        matchingSlogan: 'قهوتنا لمتنا.. ومكانك المفضل دائماً',
      },
    ];
  }

  // OTHER INDUSTRIES (Tech, Legal, Beauty, Fitness, Fashion, Auto, Education, General)
  // Dynamic Industry-Tailored Generation without generic Italian pizza names
  const industryNamesMap: Record<string, BrandNameCandidate[]> = {
    legal: [
      { id: 'name-1', nameAr: 'ميزان للاستشارات القانونية', nameEn: 'Mizan Legal Advisory', pronunciation: 'ميـ-زان', meaning: 'رمز العدالة والاتزان التام في حماية حقوق الموكلين.', rationale: 'يعكس النزاهة والهيبة القانونية الصارمة.', emotionalAssociations: ['عدالة', 'هيبة', 'ثقة مطلقة'], style: 'رصين وقور', tradeoff: 'طابع قانوني رسمي.', recommended: true, story: 'مكتب استشارات قانونية يحمي استثماراتك وشركاتك في مصر بأعلى معايير الحرفية.', positioning: 'المستشار القانوني الأول للشركات ورواد الأعمال.', toneTraits: ['وقورة', 'حاسمة', 'موثوقة'], greetingExample: 'مرحباً بكم في ميزان للاستشارات القانونية. فريقنا في خدمتكم.', promoExample: 'احجز جلسة استشارة مبدئية لتدقيق عقود شركتك واستثمارك مجاناً هذا الأسبوع.', matchingSlogan: 'عدالة ناجزة وحماية قانونية لا تتهاون' },
      { id: 'name-2', nameAr: 'عدالة وشركاه للمحاماة', nameEn: 'Adalah Law Firm', pronunciation: 'عَـ-دالة', meaning: 'إحقاق الحق ودعم الحقوق باحترافية وتفانٍ.', rationale: 'واضح ومباشر وذو مصداقية فورية في ساحات القضاء.', emotionalAssociations: ['حق', 'أمان', 'انتصار'], style: 'كلاسيكي قوي', tradeoff: 'مناسب للقضايا والتحكيم.', recommended: false, story: 'فريق محامين متخصص في كافة فروع القانون المدني والتجاري والشركات.', positioning: 'الحصن القانوني المتين في الدفاع عن حقوقك.', toneTraits: ['قوية', 'صادقة', 'مهنية'], greetingExample: 'أهلاً بكم في مكتب عدالة للمحاماة. حقوقكم أولويتنا.', promoExample: 'استشارة قانونية وتأسيس شركات بمسار إجرائي سريع ومضمون.', matchingSlogan: 'صوت الحق وسندك في كل قضية' },
    ],
    beauty: [
      { id: 'name-1', nameAr: 'ميرال لاونج للتجميل', nameEn: 'Miral Beauty Lounge', pronunciation: 'ميـ-رال', meaning: 'الغزال الجميل الرقيق، رمز الرقة والجمال الطبيعي الأخاذ.', rationale: 'اسم ناعم وسهل التداول بين السيدات في مصر.', emotionalAssociations: ['رقة', 'أنوثة', 'دلال'], style: 'فاخر ناعم', tradeoff: 'يستهدف قطاع السيدات والعناية.', recommended: true, story: 'مساحة خاصة تمنحك أحدث جلسات العناية بالبشرة والشعر بأيدي خبيرات معتمدات.', positioning: 'الملاذ الهادئ لجمالك وإشراقتك اليومية.', toneTraits: ['رقيقة', 'مرحبة', 'ملهمة'], greetingExample: 'نورتي ميرال لاونج! دللي نفسك معنا في أجواء من الراحة والجمال.', promoExample: 'باقة العناية المتكاملة للبشرة والشعر بخصم 25% مع جلسة مساج استرخائي هدية!', matchingSlogan: 'إشراقتك وسحر جمالك كل يوم' },
      { id: 'name-2', nameAr: 'روزالي كلينك آند سبا', nameEn: 'Rosalie Clinic & Spa', pronunciation: 'رو-زالي', meaning: 'الوردة المتفتحة، إشارة إلى نضارة البشرة وشبابها الدائم.', rationale: 'طابع فرنسي راقٍ مرغوب في مراكز التجميل.', emotionalAssociations: ['نضارة', 'شباب', 'عبير ورد'], style: 'فرنسي راقٍ', tradeoff: 'يناسب خدمات السبا والعناية المتقدمة.', recommended: false, story: 'أحدث أجهزة تنظيف البشرة والهيدرافيشل والعناية الفائقة في مصر.', positioning: 'مركز التجميل والسبا الأكثر فخامة ونضارة.', toneTraits: ['أنيقة', 'هادئة', 'خبيرة'], greetingExample: 'أهلاً بك في روزالي، دعينا نعتني بإشراقتك ونضارة بشرتك اليوم.', promoExample: 'جلسة هيدرافيشل عميقة مع تفتيح ونضارة بالليزر بسعر حصري اليوم!', matchingSlogan: 'جمالك يتنفس نضارة وشباباً' },
    ],
    fitness: [
      { id: 'name-1', nameAr: 'باور زون كلوب', nameEn: 'PowerZone Club', pronunciation: 'باور-زون', meaning: 'منطقة القوة وتفجير الطاقات البدنية الإيجابية.', rationale: 'حماسي وشبابي يجذب المتدربين والرياضيين.', emotionalAssociations: ['طاقة', 'قوة', 'إصرار'], style: 'رياضي ناري', tradeoff: 'حماسي جداً للصالات الرياضية.', recommended: true, story: 'أحدث أجهزة اللياقة وبناء الأجسام مع مدربين معتمدين دولياً لمساعدتك في الوصول لهدفك.', positioning: 'الجيم المتكامل لصناعة الأبطال وتغيير نمط الحياة.', toneTraits: ['حماسية', 'محفزة', 'قوية'], greetingExample: 'وحش! جاهز لتحدي جديد في باور زون؟ كل تمرين بيقربك لهدفك!', promoExample: 'اشترك الآن في باقة الـ 3 شهور واحصل على شهر إضافي وبرنامج تغذية مجاناً!', matchingSlogan: 'طاقتك الحقيقية تبدأ من هنا' },
    ],
    'real-estate': [
      { id: 'name-1', nameAr: 'صرح للتطوير العقاري', nameEn: 'Sarh Developments', pronunciation: 'صَـ-رح', meaning: 'البناء الشامخ العالي ذو الأساس المتين والجمال المعماري.', rationale: 'يوحي بالضخامة والأمان الاستثماري والاستقرار.', emotionalAssociations: ['شيموخ', 'استقرار', 'استثمار رابح'], style: 'معماري مهيب', tradeoff: 'يناسب المشاريع الإنشائية والعقارية الكبرى.', recommended: true, story: 'نبني مجتمعات سكنية وتجارية متكاملة تضمن أعلى عائد استثماري وراحة دائمة.', positioning: 'المطور العقاري الأكثر التزاماً بمواعيد التسليم والجودة.', toneTraits: ['واثقة', 'رصينة', 'موثوقة'], greetingExample: 'مرحباً بكم في صرح العقارية. نساعدكم في اختيار الاستثمار والمنزل الأمثل.', promoExample: 'امتلك وحدتك الآن بمقدم 10% وأطول فترة سداد بدون فوائد في مشروعات صرح!', matchingSlogan: 'أساس متين ومستقبل يستحقه استثمارك' },
    ],
    tech: [
      { id: 'name-1', nameAr: 'نكسوس تيك للحلول الذكية', nameEn: 'NexusTech Solutions', pronunciation: 'نِكـ-سس', meaning: 'نقطة الاتصال والترابط بين التقنيات المتقدمة واحتياجات الإنسان.', rationale: 'دولي انسيابي ممتاز للشركات البرمجية والمنصات.', emotionalAssociations: ['ابتكار', 'سرعة', 'ذكاء اصطناعي'], style: 'تقني متقدم', tradeoff: 'يتطلب تعريب المعنى في الخطاب التسويقي.', recommended: true, story: 'نطور برمجيات وتطبيقات ذكية تؤتمت أعمالك وترفع أرباحك وتختصر وقتك.', positioning: 'شريكك التقني الموثوق في التحول الرقمي.', toneTraits: ['ذكية', 'مباشرة', 'رائدة'], greetingExample: 'أهلاً بك في نكسوس تيك! جاهزون لتحويل أفكارك إلى برمجيات واقعية.', promoExample: 'احصل على استشارة تقنية مجانية ونموذج أولي لتطبيقك أو منصتك خلال 48 ساعة!', matchingSlogan: 'مستقبل أعمالك يبدأ بضغطة زر' },
    ],
  };

  // If specific industry has pre-curated sets, use them and complement
  const matchedList = industryNamesMap[analysis.industryId];
  if (matchedList && matchedList.length > 0) {
    const defaultFallbacks = [
      {
        id: 'name-3',
        nameAr: `إتقان ${cleanIdea.split(' ')[0] || ''}`.trim(),
        nameEn: `Itqan Hub`,
        pronunciation: 'إتـ-قان',
        meaning: 'أداء العمل على الوجه الأكمل بدقة وإخلاص وضمير مهني حي.',
        rationale: 'اسم ذو وقع صادق يبني جسور الثقة مع العميل.',
        emotionalAssociations: ['ثقة', 'أمانة', 'جودة'],
        style: 'أصيل معاصر',
        tradeoff: 'يحتاج تركيز تسويقي.',
        recommended: false,
        story: `فلسفتنا في إتقان تقوم على العناية بكل تفصيلة لتجربة لا تشوبها شائبة.`,
        positioning: 'العلامة التي تضع الجودة والأمانة قبل كل شيء.',
        toneTraits: ['صادقة', 'محترفة', 'واضحة'],
        greetingExample: 'أهلاً بكم في إتقان، نسعد بخدمتكم دائماً.',
        promoExample: 'احصل على خصم تمهيدي خاص لتجربتك الأولى معنا!',
        matchingSlogan: 'تفاصيل تصنع الفارق الذي يستحقه يومك',
      },
      {
        id: 'name-4',
        nameAr: `مدار ${cleanIdea.split(' ')[0] || ''}`.trim(),
        nameEn: `Madar Center`,
        pronunciation: 'مَـ-دار',
        meaning: 'الفلك والمسار الواضح الذي تدور حوله النجاحات والتكامل.',
        rationale: 'مختصر، عصري، وسهل الحفظ والتداول.',
        emotionalAssociations: ['شمول', 'حداثة', 'طموح'],
        style: 'عصري مبتكر',
        tradeoff: 'مرن يناسب مختلف الخدمات.',
        recommended: false,
        story: `في مدار، نجمع لك كل ما تحتاجه في مكان واحد باحترافية وسلاسة.`,
        positioning: 'الوجهة المتكاملة لحلولك اليومية.',
        toneTraits: ['طموحة', 'عصرية', 'مرنة'],
        greetingExample: 'مرحباً بك في مدار، يسعدنا وجودك معنا.',
        promoExample: 'عروض حصرية وخصومات لأول 50 عميل هذا الشهر!',
        matchingSlogan: 'معاك في كل خطوة على الأصول',
      },
      {
        id: 'name-5',
        nameAr: `أفق ${cleanIdea.split(' ')[0] || ''}`.trim(),
        nameEn: `Ofok Pro`,
        pronunciation: 'أُ-فُق',
        meaning: 'الامتداد الواسع والنظرة المستقبلية الثاقبة.',
        rationale: 'يعطي انطباعاً بالتطور والتوسع المستمر.',
        emotionalAssociations: ['تطور', 'رؤية', 'اتساع'],
        style: 'مستقبلي راقٍ',
        tradeoff: 'طابعه هادئ ورصين.',
        recommended: false,
        story: `نفتح لك آفاقاً جديدة من الراحة والتميز بتجربة تلبي طموحك.`,
        positioning: 'علامتك للتطلع نحو الأفضل دائماً.',
        toneTraits: ['ملهمة', 'رصينة', 'راقية'],
        greetingExample: 'أهلاً بك في أفق! يومك سعيد وموفق معنا.',
        promoExample: 'انضم لبرنامج ولائنا واستفد من ترقية مجانية لباقة خدمتك!',
        matchingSlogan: 'ببساطة.. أفضل مما توقعت',
      },
      {
        id: 'name-6',
        nameAr: `رواق ${cleanIdea.split(' ')[0] || ''}`.trim(),
        nameEn: `Rewaq Group`,
        pronunciation: 'رِ-واق',
        meaning: 'المساحة الرحبة الأنيقة ذات الطابع المريح والأصيل.',
        rationale: 'يعكس الرقي المعماري والخدمي والراحة النفسية.',
        emotionalAssociations: ['راحة', 'أناقة', 'أصالة'],
        style: 'تراثي عصري',
        tradeoff: 'يناسب الخدمات والاستشارات والضيافة.',
        recommended: false,
        story: `مساحتك المريحة لخدمات راقية تحترم وقتك وذوقك الرفيع.`,
        positioning: 'العلامة التي تجمع بين الهدوء والإتقان.',
        toneTraits: ['هادئة', 'وقورة', 'مرحبة'],
        greetingExample: 'مرحباً بكم في رواق. نسعد بخدمتكم.',
        promoExample: 'احصل على مميزات العضوية الذهبية مع أول طلب لك.',
        matchingSlogan: 'أصل الجودة.. ومكانك المفضل دائماً',
      },
    ];

    const combined = [...matchedList, ...defaultFallbacks];
    return combined.slice(0, 6);
  }

  // 12. Fashion & Clothing Brands (ملابس، أزياء، فاشون، عبايات)
  if (
    analysis.industryId === 'fashion' ||
    cleanIdea.includes('ملابس') ||
    cleanIdea.includes('أزياء') ||
    cleanIdea.includes('فاشون') ||
    cleanIdea.includes('عبايات') ||
    cleanIdea.includes('براند ملابس')
  ) {
    return [
      {
        id: 'name-1',
        nameAr: 'رِداء للأزياء',
        nameEn: 'Ridaa Fashion',
        pronunciation: 'رِ-داء',
        meaning: 'اللباس الأنيق الساتر الذي يجمع بين الحشمة والوقار والأناقة العصرية الفاخرة.',
        rationale: 'اسم عربي فصيح ذو وقع موسيقي فخم، يرسخ جودة الخامات والتصميم الراقي.',
        emotionalAssociations: ['أناقة راقية', 'فخامة هادئة', 'ثقة بالنفس'],
        style: 'عربي معاصر فاخر',
        tradeoff: 'يناسب التموضع الراقي وقطع الملابس المميزة.',
        recommended: true,
        favorite: false,
        locked: false,
        story: 'بدأت قصة "رِداء" من الإيمان بأن الملبس هو عنوان الشخصية. اخترنا أجود خامات القطن والأقمشة الطبيعية مع قصّات عصرية مريحة تمنحك إطلالة متألقة في كل مناسبة.',
        positioning: 'براند الأزياء المصري الذي يجمع بين الفخامة والراحة اليومية.',
        toneTraits: ['أنيقة', 'ملهمة', 'راقية ومرحبة'],
        greetingExample: 'يا أهلاً بك في رِداء! نسعد بوجودك معنا ومتحمسون لاكتشافك أحدث كولكشن هذا الموسم.',
        promoExample: 'احصل على خصم 20% على أول قطعة تطلبها من كولكشن رداء الجديد مع شحن مجاني!',
        matchingSlogan: 'أناقتك.. سر حضورك في كل خطوة',
      },
      {
        id: 'name-2',
        nameAr: 'خيوط ومِقَص',
        nameEn: 'Khoyoot & Meqas',
        pronunciation: 'خُـ-يوط ومِـ-قَص',
        meaning: 'أصل حرفة الأزياء والاهتمام الدقيق بتفاصيل التفصيل والمقاس المظبوط.',
        rationale: 'اسم بصري مبتكر يعلق فوراً في الذاكرة ويوحي بالصنعة اليدوية والإتقان.',
        emotionalAssociations: ['صنعة متقنة', 'حرفية', 'إبداع مصري'],
        style: 'مبتكر ذو طابع فني',
        tradeoff: 'ممتاز للملابس الكاجوال والمصممة خصيصاً.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'في "خيوط ومقص"، كل قطعة نسيج لها حكاية تبدأ من اختيار نوع الخيط وحتى آخر لمسة بالمقص، لنقدم ملابس مريحة تشعرك بأنها فُصلت خصيصاً لأجلك.',
        positioning: 'براند الملابس الذي يعيد الاعتبار لحرفية التفصيل والجودة الصادقة.',
        toneTraits: ['مبتكرة', 'عفوية', 'واثقة وحيوية'],
        greetingExample: 'نورت خيوط ومقص! جاهزون لنساعدك تختار المقاس والستايل الأنسب لشخصيتك.',
        promoExample: 'عرض السيزون: اشتري قطعتين من خيوط ومقص واحصل على الثالثة بنصف السعر!',
        matchingSlogan: 'تنسيق على الأصول.. ومقاس مظبوط',
      },
      {
        id: 'name-3',
        nameAr: 'ستيلو للملابس',
        nameEn: 'Stylo Wear',
        pronunciation: 'سْـ-تيلو',
        meaning: 'الأسلوب الخاص والتنسيق العصري للشباب والبنات والباحثين عن مظهر متجدد.',
        rationale: 'اسم شبابي رنان سريع الانتشار على منصات السوشيال ميديا والتيك توك.',
        emotionalAssociations: ['حيوية شبابية', 'تريند', 'بساطة وعصرية'],
        style: 'مودرن شبابي',
        tradeoff: 'يتطلب نشاطاً بصرياً مكثفاً ومواكبة سريعة للتريندات.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'انطلق "ستيلو" ليكون صوت الجيل الجديد في الموضة؛ قطع مريحة، ألوان متناسقة، وتصاميم تواكب التريند العالمي بأسعار عادلة تناسب الجميع.',
        positioning: 'الوجهة المفضلة للإطلالات اليومية والملابس الشبابية السريعة.',
        toneTraits: ['شبابية', 'مباشرة', 'حماسية'],
        greetingExample: 'هاي من ستيلو! الستايل الحلو مبيستناش.. جاهزين نجدد دولابك؟',
        promoExample: 'كوبون الخصم الخاص بستيلو متاح لأول 100 طلب عبر رسائل الصفحة اليوم!',
        matchingSlogan: 'ستايلك اليومي.. بلمسة مختلفة',
      },
      {
        id: 'name-4',
        nameAr: 'قماش بلدي',
        nameEn: 'Qomash Baladi',
        pronunciation: 'قُـ-ماش بلدي',
        meaning: 'الاعتزاز بنعومة القطن المصري الأصيل والخامات الطبيعية الصافية 100%.',
        rationale: 'يبث فخراً فورياً بالصناعة المصرية وثقة مطلقة في متانة القطعة بعد الغسيل.',
        emotionalAssociations: ['أصالة مصرية', 'نعومة طبيعية', 'راحة تدوم'],
        style: 'أصيل معاصر',
        tradeoff: 'يركز بشدة على قيمة الخامة والقطن.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'رجعنا لأصل النعومة في "قماش بلدي". بنعتمد القطن المصري طويل التيلة المعالج بحرفية ليعيش معك سنوات بنفس زهوة لونه ونعومة ملمسه على بشرتك.',
        positioning: 'الخيار الأول لمن يبحث عن راحة القطن المصري الأصيل بدون أي بوليستر رخيص.',
        toneTraits: ['دافئة', 'صادقة', 'فخورة بالأصل'],
        greetingExample: 'يا أهلاً وسهلاً بك في قماش بلدي! نورتنا ومستعدين لخدمتك بأحلى خامة قطنية.',
        promoExample: 'جرب نعومة قماش بلدي بنفسك مع ضمان استرجاع كامل لو ملمس القطعة معجبكش!',
        matchingSlogan: 'نعومة القطن المصري.. على أصولها',
      },
      {
        id: 'name-5',
        nameAr: 'غُرزة ديزاين',
        nameEn: 'Ghorza Design',
        pronunciation: 'غُـ-رزة ديزاين',
        meaning: 'الدقة المتناهية في التقفيل والدرزات النظيفة التي تدل على جودة التصنيع.',
        rationale: 'اسم معبر ومميز لبراند الملابس المتقنة التي تهتم باللمسات الأخيرة.',
        emotionalAssociations: ['إتقان', 'عناية فائقة', 'جودة ملموسة'],
        style: 'عصري فني',
        tradeoff: 'مناسب للأزياء الكاجوال وشبه الرسمية.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'نحن في "غُرزة" ندرك أن الفرق بين القطعة العادية والقطعة الاستثنائية يكمن في دقة كل غرزة وتشطيب البطانة؛ لذلك نهتم بأدق التفاصيل قبل أن تصلك القطعة.',
        positioning: 'العلامة التي تشتهر بجودة التقفيل والقصّة المريحة المتقنة.',
        toneTraits: ['دقيقة', 'مهنية', 'أنيقة'],
        greetingExample: 'أهلاً بك في غُرزة! كل قطعة عندنا معمولة بحب وإتقان عشان تليق بيك.',
        promoExample: 'احجز قطعتك المفضلة من غُرزة واستمتع بمعاينة الأوردر قبل الاستلام والدفع!',
        matchingSlogan: 'كل غرزة معمولة بحساب.. عشان راحتك',
      },
      {
        id: 'name-6',
        nameAr: 'أناقة الحارة',
        nameEn: 'Anaqa Streetwear',
        pronunciation: 'أناقة الحارة',
        meaning: 'مزج بين ثقافة الشارع المصري الحيوية وأرقى معايير الاستريت وير العالمية.',
        rationale: 'اسم جريء ومحبوب يربط بين الفخر بالهوية المحلية والمظهر العصري الجذاب.',
        emotionalAssociations: ['جرأة', 'انتماء محلي', 'تميز وانفراد'],
        style: 'استريت وير مصري',
        tradeoff: 'قوي جداً لفئة الشباب وعشاق الهوديز والتيشرتات الأوفر سايز.',
        recommended: false,
        favorite: false,
        locked: false,
        story: 'وُلد "أناقة الحارة" ليعبر عن روح الشارع المصري النابضة؛ تصاميم أوفر سايز وخامات مريحة تعبر عنك وعن انتمائك بثقة مطلقة وأناقة لا تخطئها عين.',
        positioning: 'براند الاستريت وير المصري الرائد للشباب المتميزين.',
        toneTraits: ['جريئة', 'شبابية صريحة', 'حية'],
        greetingExample: 'منور الحارة! كولكشن الاستريت وير جاهز يغير طريقتك في اللبس تماماً.',
        promoExample: 'اطلب تيشيرت أوفر سايز وهودي من أناقة الحارة واحصل على كاب مطرز هدية!',
        matchingSlogan: 'روح الشارع المصري.. بأعلى أناقة',
      },
    ];
  }

  // General clean names - Dynamically synthesized from the user's exact idea keywords and domain
  const candidateWords = cleanIdea
    .split(/\s+/)
    .filter((w) => !['براند', 'مشروع', 'محل', 'شركة', 'فكرة', 'متجر', 'موقع', 'تطبيق', 'في', 'من', 'إلى', 'مع', 'أو', 'عن', 'على'].includes(w));
  const keyword1 = candidateWords[0] || 'الرواد';
  const keyword2 = candidateWords[1] || candidateWords[0] || 'التميز';

  return [
    {
      id: 'name-1',
      nameAr: `رواد ${keyword1}`,
      nameEn: `Rowad ${keyword1}`,
      pronunciation: `روّاد ${keyword1}`,
      meaning: `الريادة والسبق في تقديم خدمات ومنتجات ${cleanIdea || keyword1} بأعلى معايير الإتقان.`,
      rationale: `اسم عربي رائد يعكس القيادة والمصداقية العالية في السوق المصري.`,
      emotionalAssociations: ['ريادة', 'ثقة', 'احترافية'],
      style: 'عصري رائد',
      tradeoff: 'يعبر بوضوح عن الطموح والتميز.',
      recommended: true,
      favorite: false,
      locked: false,
      story: `تأسست العلامة لتكون النموذج الرائد في تقديم أرقى تجربة في مجال ${cleanIdea}.`,
      positioning: `الخيار الأول للباحثين عن الريادة والجودة الموثوقة.`,
      toneTraits: ['واثقة', 'طموحة', 'محترفة'],
      greetingExample: `مرحباً بك! يسعدنا تقديم أفضل ما لدينا لخدمتك.`,
      promoExample: `احصل على خصم ترحيبي خاص 20% بمناسبة إطلاق خدماتنا!`,
      matchingSlogan: 'الريادة في الخدمة.. والجودة التي تستحقها',
    },
    {
      id: 'name-2',
      nameAr: `أُفق ${keyword1}`,
      nameEn: `Ofok ${keyword1}`,
      pronunciation: `أُ-فُق`,
      meaning: `الامتداد الواسع والنظرة المستقبلية المتطورة في مجال ${keyword1}.`,
      rationale: `اسم ملهم وعصري يعكس التجدد والارتقاء المستمر.`,
      emotionalAssociations: ['تطور', 'اتساع', 'مستقبل'],
      style: 'مستقبلي راقٍ',
      tradeoff: 'مرن ويلائم مختلف الأنشطة الحديثة.',
      recommended: false,
      favorite: false,
      locked: false,
      story: `نفتح لك آفاقاً جديدة من الراحة والتميز بتجربة متكاملة تلبي طموحك.`,
      positioning: `شريكك نحو تجربة أفضل وخدمة لا تضاهى.`,
      toneTraits: ['ملهمة', 'ذكية', 'راقية'],
      greetingExample: `أهلاً بك! جاهزون لنأخذ تجربتك إلى آفاق جديدة.`,
      promoExample: `باقة خاصة وعروض حصرية لأول 50 عميل هذا الشهر!`,
      matchingSlogan: 'آفاق جديدة من التميز والابتكار',
    },
    {
      id: 'name-3',
      nameAr: `مَركز ${keyword1} المتكامل`,
      nameEn: `${keyword1} Hub`,
      pronunciation: `مركز ${keyword1}`,
      meaning: `الوجهة المجمعة الشاملة لكل ما يخص ${cleanIdea}.`,
      rationale: `صريح ومباشر ويبني طمأنينة فورية باكتمال الخدمة.`,
      emotionalAssociations: ['شمولية', 'تكامل', 'أمان'],
      style: 'مباشر موثوق',
      tradeoff: 'واضح جداً للجمهور المستهدف.',
      recommended: false,
      favorite: false,
      locked: false,
      story: `جمعنا كل ما تحتاجه في مكان واحد بأعلى معايير الحرفية والسرعة.`,
      positioning: `وجهتك المتكاملة لحلول موثوقة ومضمونة.`,
      toneTraits: ['مباشرة', 'صادقة', 'عملية'],
      greetingExample: `يا أهلاً بك! تجد عندنا كل ما تحتاجه بسهولة.`,
      promoExample: `استشارة وتقييم مجاني لاحتياجاتك عند تواصلك الأول معنا!`,
      matchingSlogan: 'كل ما تحتاجه في مكان واحد باحترافية',
    },
    {
      id: 'name-4',
      nameAr: `نَبض ${keyword2}`,
      nameEn: `Nabd ${keyword2}`,
      pronunciation: `نَـ-بض`,
      meaning: `الحيوية والطاقة المستمرة والقرب من احتياج العميل الحقيقي.`,
      rationale: `اسم ديناميكي جذاب وسهل الترديد في السوشيال ميديا.`,
      emotionalAssociations: ['حيوية', 'قرب', 'تفاعل'],
      style: 'شبابي حيوي',
      tradeoff: 'طابعه مفعم بالنشاط والتجدد.',
      recommended: false,
      favorite: false,
      locked: false,
      story: `نعيش تفاصيل احتياجك ونقدم لك حلولاً تنبض بالجودة والاهتمام الحقيقي.`,
      positioning: `العلامة الأكثر قرباً وحيوية وتفاعلاً مع عملائها.`,
      toneTraits: ['حيوية', 'ودودة', 'سريعة'],
      greetingExample: `أهلاً بك معنا! يومك مفعم بالنشاط والإنجاز.`,
      promoExample: `عروض حصرية وخصومات سريعة بانتظارك اليوم!`,
      matchingSlogan: 'نبض الجودة.. وقريب منك دائماً',
    },
    {
      id: 'name-5',
      nameAr: `إتقان ${keyword1}`,
      nameEn: `Itqan ${keyword1}`,
      pronunciation: `إتـ-قان`,
      meaning: `الكمال والبراعة والضمير الحي في خدمة وتلبية طلبات العميل.`,
      rationale: `اسم ذو وقع أصيل يعكس الأمانة والحرفية العالية.`,
      emotionalAssociations: ['إتقان', 'أمانة', 'جودة فائقة'],
      style: 'أصيل معاصر',
      tradeoff: 'يركز على ثقة الزبون والمصداقية.',
      recommended: false,
      favorite: false,
      locked: false,
      story: `الإتقان ليس مجرد شعار بل منهج عمل نلتزم به في كل تفصيلة نقدمها.`,
      positioning: `العلامة التي تضع الجودة والأمانة قبل كل شيء.`,
      toneTraits: ['صادقة', 'واثقة', 'محترفة'],
      greetingExample: `أهلاً بكم في إتقان! نسعد بخدمتكم بأعلى مستوى.`,
      promoExample: `جرب مستوى إتقاننا مع ضمان الرضا التام على طلبك!`,
      matchingSlogan: 'أصل الجودة.. ومكانك المفضل دائماً',
    },
    {
      id: 'name-6',
      nameAr: `${keyword1} برو`,
      nameEn: `${keyword1} Pro`,
      pronunciation: `${keyword1} برو`,
      meaning: `النسخة الاحترافية المتطورة من خدمات ${keyword1}.`,
      rationale: `مختصر، عصري، وسهل الحفظ ومثالي للشعار والهوية الرقمية.`,
      emotionalAssociations: ['احتراف', 'عصرية', 'سرعة'],
      style: 'مودرن رقمي',
      tradeoff: 'مثالي للمشاريع الحديثة والمنصات.',
      recommended: false,
      favorite: false,
      locked: false,
      story: `انطلقنا لنقدم تجربة احترافية متطورة تلبي متطلبات العصر بدون أي تعقيد.`,
      positioning: `شريكك الأسرع والأكثر كفاءة واحترافية.`,
      toneTraits: ['عصرية', 'مباشرة', 'رقمية'],
      greetingExample: `هاي! جاهزون لنقدم لك خدمة احترافية تليق بك.`,
      promoExample: `اشترك واستفد من باقة برو بخصومات مميزة لفترة محدودة!`,
      matchingSlogan: 'احترافية وسرعة.. بدون أي تعقيد',
    },
  ];
}

// 3. Generate Slogans matched to industry
function buildSlogans(idea: string, analysis: IdeaAnalysis): BrandSloganCandidate[] {
  if (analysis.industryId === 'dental') {
    return [
      { id: 'slogan-1', text: 'ابتسامتك.. سر ثقتك كل يوم', meaning: 'ربط صحة وجمال الأسنان بثقة المريض في نفسه ونجاحه اليومي.', rationale: 'موجز ومؤثر ويلمس رغبة العميل الأساسية في مظهر جميل.', useCase: 'الشعار الرئيسي في العيادة وعبر السوشيال ميديا.', favorite: true, locked: false },
      { id: 'slogan-2', text: 'رعاية أسنان بمعايير عالمية ولمسة إنسانية بلا ألم', meaning: 'طمأنة المريض بشأن التعقيم والتقنيات مع إزالة رهبة ألم الأسنان.', rationale: 'يعالج أكبر مخاوف المريض في مصر (الألم والتعقيم).', useCase: 'في حملات التوعية وعروض الكشف الشامل.', favorite: false, locked: false },
      { id: 'slogan-3', text: 'لأن كل ابتسامة تستحق أن تلمع كاللؤلؤ', meaning: 'التركيز على الجانب التجميلي والنتيجة البراقة لخدمات الأسنان.', rationale: 'شاعري وجذاب لخدمات التبييض والتقويم والفينير.', useCase: 'في إعلانات تجميل الابتسامة وحالات قبل وبعد.', favorite: false, locked: false },
      { id: 'slogan-4', text: 'صحة أسنانك في أيدٍ أمينة وخبرة تطمئنك', meaning: 'التأكيد على الكفاءة الطبية العالية والأمانة في التشخيص.', rationale: 'يبني الثقة العميقة مع العائلات والمرضى الجدد.', useCase: 'في الموقع الإلكتروني وكروت المتابعة الطبية.', favorite: false, locked: false },
    ];
  }

  if (analysis.industryId === 'restaurant' || analysis.industryId === 'cafe') {
    return [
      { id: 'slogan-1', text: 'طعم يعيش في البال من أول قطمة', meaning: 'تأكيد المذاق الاستثنائي الذي لا يُنسى.', rationale: 'شهي ومحفز للتجربة الفورية والطلب.', useCase: 'على علب الساندوتشات وفي الإعلانات.', favorite: true, locked: false },
      { id: 'slogan-2', text: 'لَمّة العيلة وسر النكهة الأصيلة', meaning: 'إبراز الدفء العائلي والمكونات البلدية الطازجة.', rationale: 'يخاطب التجمعات والعزومات.', useCase: 'في عروض الكومبو والوجبات العائلية.', favorite: false, locked: false },
      { id: 'slogan-3', text: 'أصل الجودة.. ومكانك المفضل دائماً', meaning: 'ترسيخ المكانة كمقصد أول للغداء والخروجات.', rationale: 'موزون وسهل الترديد.', useCase: 'في واجهة المحل والتطبيقات.', favorite: false, locked: false },
      { id: 'slogan-4', text: 'معاك في كل خطوة على الأصول', meaning: 'الجدعنة المصرية والكرم في الكميات والخدمة.', rationale: 'يبث مشاعر الراحة والمحبة.', useCase: 'في خدمة التوصيل ورسائل الواتساب.', favorite: false, locked: false },
    ];
  }

  return [
    { id: 'slogan-1', text: 'أصل الجودة.. ومكانك المفضل دائماً', meaning: 'يرسخ للعلامة التجارية كملاذ أول وخيار بديهي.', rationale: 'موزون نغمياً وسهل الترديد.', useCase: 'الشعار الرئيسي على الواجهات والتطبيقات.', favorite: true, locked: false },
    { id: 'slogan-2', text: 'تفاصيل تصنع الفارق الذي يستحقه يومك', meaning: 'التركيز على الدقة والعناية الفائقة بمتطلبات العميل.', rationale: 'يمنح العميل إحساساً بالتقدير الشخصي.', useCase: 'في المنشورات الترويجية والحملات الرقمية.', favorite: false, locked: false },
    { id: 'slogan-3', text: 'ببساطة.. أفضل مما توقعت', meaning: 'تجاوز سقف التوقعات كمعيار قياسي للخدمة.', rationale: 'وعد تنافسي جريء يدعو للتجربة الفورية.', useCase: 'في عروض إطلاق المنتجات والخدمات الجديدة.', favorite: false, locked: false },
    { id: 'slogan-4', text: 'معاك في كل خطوة على الأصول', meaning: 'يعكس روح الجدعنة والالتزام الأخلاقي والمهني المصري.', rationale: 'يخلق صلة وثيقة ودفئاً مجتمعياً.', useCase: 'في خدمة العملاء والمجتمعات التفاعلية.', favorite: false, locked: false },
  ];
}

// 4. Generate Harmonized 3-Color Palette
function buildPalette(analysis: IdeaAnalysis): BrandColor[] {
  return [
    {
      role: 'primary',
      nameAr: 'اللون الأساسي (Primary)',
      hex: analysis.primaryColor,
      usageNote: 'لون الهوية الرئيسي للشعار، الأزرار الأساسية، والعناوين البارزة.',
      locked: false,
    },
    {
      role: 'secondary',
      nameAr: 'اللون الثانوي (Secondary)',
      hex: analysis.secondaryColor,
      usageNote: 'لون التوازن البصري للبطاقات التكميلية، البادجات، وخلفيات التباين.',
      locked: false,
    },
    {
      role: 'accent',
      nameAr: 'لون التمييز (Accent)',
      hex: analysis.accentColor,
      usageNote: 'لون لفت الانتباه لنقاط التحويل (CTA)، عروض الخصم، والأيقونات النشطة.',
      locked: false,
    },
  ];
}

// 4.9 Capital Feasibility & Startup Equipment Breakdown Generator
export function buildCapitalFeasibility(
  budget: number,
  idea: string = '',
  city: string = 'القاهرة',
  district: string = '',
  analysis?: IdeaAnalysis
): CapitalFeasibility {
  const cleanIdea = idea.trim().toLowerCase();
  const locationName = district ? `${city} (حي ${district})` : city;
  const userBudget = budget > 0 ? budget : 50000;
  const ind = analysis?.industryId || 'general';

  let minBudget = 100000;
  let recommendedBudget = 250000;
  let recommendedModel = 'نموذج هجين يجمع بين العمل الميداني والطلبات الرقمية';
  let verdictTitle = '';
  let verdictDescription = '';
  let items: StartupEquipmentItem[] = [];
  let advice: string[] = [];

  let alternativeBreakdown: StartupEquipmentItem[] | undefined;
  let alternativeCapexTotalEgp: number | undefined;
  let alternativeModelTitle: string | undefined;

  // 1. Hospitals & Medical Centers (مستشفيات كبرى، مراكز جراحية، نساء وتوليد)
  if (
    cleanIdea.includes('مستشفى') ||
    cleanIdea.includes('مستشفي') ||
    cleanIdea.includes('مستشفيات') ||
    cleanIdea.includes('جراحة')
  ) {
    const isObsGyn =
      cleanIdea.includes('نسا') ||
      cleanIdea.includes('ولادة') ||
      cleanIdea.includes('نساء') ||
      cleanIdea.includes('أمومة') ||
      cleanIdea.includes('حوامل');

    const hospitalTitle = isObsGyn
      ? 'مستشفى نساء وتوليد ورعاية أمومة'
      : cleanIdea.includes('جراحة')
      ? 'مستشفى جراحة تخصصي'
      : `مستشفى (${cleanIdea})`;

    minBudget = 8000000;
    recommendedBudget = 15000000;
    alternativeModelTitle = isObsGyn
      ? 'مركز نساء وتوليد وعيادات رعاية أمومة متقدمة (Maternity & OB-GYN Center)'
      : 'مركز جراحي نهاري تخصصي (Day-Care Surgery Center)';

    recommendedModel = userBudget < 2500000 
      ? (isObsGyn ? 'مركز نساء وتوليد وعيادات أمومة متقدمة' : 'مركز جراحي نهاري تخصصي أو عيادات تخصصية')
      : userBudget < minBudget
      ? (isObsGyn ? 'مجمع عيادات نساء وتوليد مع غرف ولادة طبيعية ورعاية اليوم الواحد' : 'مجمع عيادات جراحية واستشارات خارجية مع غرف عمليات اليوم الواحد')
      : (isObsGyn ? 'مستشفى نساء وتوليد متكامل' : 'مستشفى تخصصي متكامل');

    if (userBudget < 3000000) {
      verdictTitle = `رأس المال غير كافٍ لتأسيس ${hospitalTitle} متكامل (عجز تمويلي حرج)`;
      verdictDescription = `مبلغ ${userBudget.toLocaleString('en-US')} ج.م لا يكفي لتأسيس وتجهيز ${hospitalTitle} في ${locationName} وفقاً للمعايير الطبية لوزارة الصحة وتكلفة التجهيزات الإلزامية (الحد الأدنى 8 مليون ج.م). ولكنه كافٍ لتأسيس ${alternativeModelTitle}.`;
      advice = isObsGyn ? [
        'ابدأ بمركز نساء وتوليد وعيادات أمومة متخصصة (عيادات، سونار متطور، ومتابعة حمل) لتقليل المخاطر الرأسمالية.',
        'تعاقد مع مستشفيات كبرى مجهزة في المنطقة لإجراء العمليات القيصرية والحالات المعقدة لحساب المركز.',
        'استأجر جهاز السونار رباعي الأبعاد (4D Ultrasound) بنظام الإيجار التمويلي لتوفير السيولة النقدية.',
        'وفر باقات متكاملة تشمل متابعة الحمل، تحاليل دورية، واستشارات رضاعة وتغذية علاجية.',
      ] : [
        'ابدأ بمركز جراحي نهاري تخصصي (عمليات صغرى ومتوسطة) بدلاً من مستشفى كبير لتفادي مخاطر السيولة.',
        'اعتمد نظام الشراكة بالنسبة المئوية مع كبار الجراحين والاستشاريين لجلب الحالات دون رواتب ثابتة مرهقة.',
        'استأجر الأجهزة الطبية الجراحية بنظام الإيجار التمويلي بدلاً من الشراء النقدي الكامل.',
        'تعاقد مع معامل تحاليل ومراكز أشعة خارجية لتقديم الخدمة بنظام العمولة لتقليل تكلفة شراء الأجهزة.',
      ];
    } else if (userBudget < minBudget) {
      verdictTitle = `رأس المال مناسب لـ ${alternativeModelTitle}، ويحتاج تمويلاً للتوسع كمستشفى كامل`;
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) كافية لتجهيز ${alternativeModelTitle} في ${locationName}، بينما التوسع إلى مستشفى متكامل بكافة الأقسام يتطلب مرحلة تمويلية ثانية.`;
      advice = [
        'ركز على الخدمات التخصصية الأكثر طلباً وربحية وسرعة دوران لبناء قاعدة عملاء قوية.',
        'ابنِ سمعة قوية للمركز أولاً ثم اطرح فرص شراكة مع مستثمرين للتوسع إلى مستشفى متكامل.',
      ];
    } else {
      verdictTitle = `رأس المال قوي ومناسب لتأسيس ${hospitalTitle} والانطلاق بثقة`;
      verdictDescription = `الميزانية المرصودة (${userBudget.toLocaleString('en-US')} ج.م) تمنحك قوة ممتازة لتجهيز المستشفى بأحدث التقنيات الطبية المطابقة لاشتراطات وزارة الصحة في ${locationName}.`;
      advice = [
        'احرص على تخصيص 20% من رأس المال كسيولة تشغيل احتياطية للشهرين الأولين.',
        'استثمر في نظام إدارة المستشفيات الرقمي (Hospital ERP) لإدارة الملف الطبي والفوترة.',
      ];
    }

    // Full Hospital Items (8,000,000 EGP total)
    items = isObsGyn ? [
      { id: 'eq-1', name: 'تجهيز غرفتي ولادة وعمليات مجهزة (ترابيزة ولادة هيدروليك، جهاز تخدير، كشاف ثلاثي)', category: 'معدات وآلات', estimatedCostEgp: 3100000, priority: 'ضروري للبدء', notes: 'مطابقة لمعايير مكافحة العدوى والاعتماد الصحي' },
      { id: 'eq-2', name: 'وحدة رعاية مبتسرين وحضانات حديثي الولادة (3 حضانات متقدمة، جهاز تنفس صناعي للأطفال)', category: 'معدات وآلات', estimatedCostEgp: 1700000, priority: 'ضروري للبدء', notes: 'إلزامية لمنح ترخيص مستشفيات الولادة وحماية حياة المواليد' },
      { id: 'eq-3', name: 'أجهزة سونار متطورة 4D/5D مع دوبلر ملون وأجهزة مراقبة نبض الجنين CTG', category: 'معدات وآلات', estimatedCostEgp: 950000, priority: 'ضروري للبدء', notes: 'تشخيص دقيق لمتابعة الحمل والولادة' },
      { id: 'eq-4', name: 'شبكة غازات طبية مركزية ومولد أكسجين ومولد كهربائي ديزل للطوارئ', category: 'معدات وآلات', estimatedCostEgp: 1100000, priority: 'ضروري للبدء', notes: 'بنية تحتية حيوية إلزامية قانوناً' },
      { id: 'eq-5', name: 'تجهيزات غرف إقامة الأمهات والمواليد وما بعد الولادة (6 غرف مجهزة)', category: 'تجهيزات وتشطيب', estimatedCostEgp: 500000, priority: 'ضروري للبدء', notes: 'أسرة طبية كهربائية وديكور فندقي مريح للأمهات' },
      { id: 'eq-6', name: 'تراخيص منشأة طبية كبرى ونقابة الأطباء والحماية المدنية', category: 'تراخيص وتأسيس', estimatedCostEgp: 250000, priority: 'ضروري للبدء', notes: 'رسوم المعاينات والتراخيص الرسمية الإلزامية' },
      { id: 'eq-7', name: 'سيولة تشغيل نقدية ومخزون أدوية ومستلزمات ولادة وطوارئ للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 400000, priority: 'ضروري للبدء', notes: 'أدوية ومستهلكات معقمة للشهر الأول' },
    ] : [
      { id: 'eq-1', name: 'تجهيز غرفة عمليات كبرى معقمة (ترابيزة هيدروليك، جهاز تخدير، كشاف ثلاثي، أجهزة مراقبة)', category: 'معدات وآلات', estimatedCostEgp: 3200000, priority: 'ضروري للبدء', notes: 'مطابقة لمعايير مكافحة العدوى والاعتماد الصحي' },
      { id: 'eq-2', name: 'وحدة رعاية مركزة ICU (سرير رعاية حثيثة، جهاز تنفس صناعي، مونيتور متعدد، مضخات)', category: 'معدات وآلات', estimatedCostEgp: 1600000, priority: 'ضروري للبدء', notes: 'إلزامية لمنح ترخيص العمليات الجراحية الكبرى' },
      { id: 'eq-3', name: 'وحدة تعقيم مركزي CSSD متطورة (أوتوكلاف بخاري سعة كبرى ومغاسل جراحية)', category: 'معدات وآلات', estimatedCostEgp: 850000, priority: 'ضروري للبدء', notes: 'صمام أمان مكافحة العدوى في العمليات' },
      { id: 'eq-4', name: 'شبكة غازات طبية مركزية ومولد أكسجين ومولد كهربائي ديزل للطوارئ', category: 'معدات وآلات', estimatedCostEgp: 1100000, priority: 'ضروري للبدء', notes: 'بنية تحتية حيوية إلزامية قانوناً لحماية حياة المرضى' },
      { id: 'eq-5', name: 'تجهيزات غرف إقامة المرضى وما بعد العمليات ومحطة التمريض (5 غرف مجهزة)', category: 'تجهيزات وتشطيب', estimatedCostEgp: 550000, priority: 'ضروري للبدء', notes: 'أسرة طبية كهربائية وشاشات مراقبة وتكييف معقم' },
      { id: 'eq-6', name: 'تراخيص منشأة طبية كبرى (العلاج الحر، نقابة الأطباء، الحماية المدنية، البيئة)', category: 'تراخيص وتأسيس', estimatedCostEgp: 250000, priority: 'ضروري للبدء', notes: 'رسوم المعاينات والتراخيص الرسمية الإلزامية' },
      { id: 'eq-7', name: 'سيولة تشغيل نقدية ومخزون أدوية ومستلزمات جراحية للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 450000, priority: 'ضروري للبدء', notes: 'شاش ومشارط وخيوط ومحاليل وأدوية طوارئ للشهر الأول' },
    ];

    // Downscaled Alternative: Day-Care Center (1,900,000 EGP total)
    alternativeCapexTotalEgp = 1900000;
    alternativeBreakdown = isObsGyn ? [
      { id: 'alt-1', name: 'تجهيز غرفتي كشف وسونار رباعي الأبعاد 4D متطور مع شاشة عرض للأم', category: 'معدات وآلات', estimatedCostEgp: 850000, priority: 'ضروري للبدء', notes: 'الركيزة الأساسية لجذب مراجعات الحمل والأمومة' },
      { id: 'alt-2', name: 'غرفة ولادة طبيعية وإفاقة سريعة مع سرير ولادة وحضانة متنقلة للطوارئ', category: 'معدات وآلات', estimatedCostEgp: 450000, priority: 'ضروري للبدء', notes: 'جاهزية تامة لحالات الولادة الطبيعية الآمنة' },
      { id: 'alt-3', name: 'جهاز تعقيم أوتوكلاف Class B مدمج ومحطة تعقيم أدوات فحص', category: 'معدات وآلات', estimatedCostEgp: 180000, priority: 'ضروري للبدء', notes: 'معتمد لتعقيم أدوات كشف النساء اليومية' },
      { id: 'alt-4', name: 'تجهيز صالة استقبال راقية واستراحة خاصة بالأمهات والأطفال', category: 'تجهيزات وتشطيب', estimatedCostEgp: 220000, priority: 'ضروري للبدء', notes: 'أجواء مريحة وهادئة تبعث على الطمأنينة' },
      { id: 'alt-5', name: 'تراخيص مركز نساء وتوليد وسيولة تشغيل وأدوية للشهر الأول', category: 'تراخيص وتأسيس', estimatedCostEgp: 200000, priority: 'ضروري للبدء', notes: 'تأمين قانوني ومستلزمات طبية لبدء النشاط' },
    ] : [
      { id: 'alt-1', name: 'تجهيز غرفة عمليات يوم واحد للعمليات الصغرى والمتوسطة والمناظير', category: 'معدات وآلات', estimatedCostEgp: 950000, priority: 'ضروري للبدء', notes: 'كافية لجراحات اليوم الواحد واليوم التالي دون إقامة طويلة' },
      { id: 'alt-2', name: 'أجهزة مراقبة ومونيتور وتخدير نصفي وأجهزة إفاقة سريعة', category: 'معدات وآلات', estimatedCostEgp: 350000, priority: 'ضروري للبدء', notes: 'أجهزة استيراد كسر زيرو بحالة الوكالة توفر 35%' },
      { id: 'alt-3', name: 'جهاز تعقيم أوتوكلاف Class B مدمج ومحطة تعقيم أدوات', category: 'معدات وآلات', estimatedCostEgp: 180000, priority: 'ضروري للبدء', notes: 'معتمد لتعقيم أدوات الجراحة اليومية' },
      { id: 'alt-4', name: 'تجهيز غرفتي إفاقة سريعة واستراحة واستقبال مرضى', category: 'تجهيزات وتشطيب', estimatedCostEgp: 220000, priority: 'ضروري للبدء', notes: 'ديكور طبي هادئ وتشطيب مطابق للاشتراطات' },
      { id: 'alt-5', name: 'تراخيص مركز جراحة يوم واحد وسيولة تشغيل وأدوية للشهر الأول', category: 'تراخيص وتأسيس', estimatedCostEgp: 200000, priority: 'ضروري للبدء', notes: 'تأمين قانوني ومستلزمات بدء النشاط' },
    ];
  }
  // 1.1 Radiology & Diagnostic Imaging Centers (مراكز الأشعة والسونار والتصوير الطبي)
  else if (
    cleanIdea.includes('أشعة') ||
    cleanIdea.includes('اشعة') ||
    cleanIdea.includes('رنين') ||
    cleanIdea.includes('سونار') ||
    cleanIdea.includes('سكان') ||
    cleanIdea.includes('radiology') ||
    cleanIdea.includes('imaging')
  ) {
    minBudget = 500000;
    recommendedBudget = 1500000;
    recommendedModel = 'مركز أشعة وسونار وتشخيص رقمي متكامل';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود نسبياً، ويُنصح بالبدء بوحدة سونار وأشعة ديجيتال بنظام الإيجار التمويلي';
      verdictDescription = `افتتاح مركز أشعة متكامل في ${locationName} يتطلب ما لا يقل عن 500,000 ج.م كسيولة تأسيسية وتدريع غرف الأشعة. للبدء بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م)، الحل الأمثل هو استئجار الأجهزة أو تمويلها بنظام التأجير التمويلي (Leasing).`;
      advice = [
        'ابدأ بجهاز سونار رباعي الأبعاد (4D Ultrasound) وفحوصات الدوبلر كخدمة أولى سريعة العائد.',
        'استأجر جهاز الأشعة السينية بنظام الإيجار التمويلي بدلاً من الدفع النقدي الكامل لتوفير السيولة.',
        'تعاقد مع كبار أطباء العيادات المحيطة لتقديم خصومات وإحالة الحالات مباشرة إلى مركزك.',
      ];
    } else {
      verdictTitle = 'رأس المال مناسب وممتاز لتأسيس مركز أشعة وتشخيص رقمي والانطلاق';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) كافية لتجهيز وحدة سونار متطورة، وجهاز أشعة ديجيتال، وتدريع الغرف وفق اشتراطات هيئة الطاقة الذرية في ${locationName}.`;
      advice = [
        'احرص على أحدث شاشات محطات الفحص (PACS Workstations) لكتابة التقارير الطبية بدقة.',
        'وفّر خدمة إرسال صور وفحوصات الأشعة عبر الواتساب وبوابة رقمية لتقليل التكاليف وزيادة رضا المرضى.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'جهاز سونار ودوبلر ملون متطور (Color Doppler Ultrasound)', category: 'معدات وآلات', estimatedCostEgp: 220000, priority: 'ضروري للبدء', notes: 'فحص البطن والحوض والغدة الدرقية والشرايين بدقة فائقة' },
      { id: 'eq-2', name: 'جهاز أشعة سينية ديجيتال رقمي X-Ray مع حساس DR Flat Panel', category: 'معدات وآلات', estimatedCostEgp: 210000, priority: 'ضروري للبدء', notes: 'تصوير عظام وصدر فوري بدون أحماض تحميض قديمة' },
      { id: 'eq-3', name: 'محطة قراءة وتشخيص صور الأشعة (PACS & DICOM Workstation)', category: 'معدات وآلات', estimatedCostEgp: 35000, priority: 'ضروري للبدء', notes: 'شاشات طبية مخصصة لكتابة تقارير الاستشاريين' },
      { id: 'eq-4', name: 'تشطيب وتدريع رصاصي معتمد لجدران وأبواب غرفة الأشعة', category: 'تجهيزات وتشطيب', estimatedCostEgp: 45000, priority: 'ضروري للبدء', notes: 'مطابق لاشتراطات السلامة والوقاية الإشعاعية' },
      { id: 'eq-5', name: 'تراخيص هيئة الطاقة الذرية ووزارة الصحة ونقابة الأطباء', category: 'تراخيص وتأسيس', estimatedCostEgp: 40000, priority: 'ضروري للبدء', notes: 'موافقات رسمية ملزمة قبل فتح المركز' },
      { id: 'eq-6', name: 'سيولة تشغيل نقدية ومخزون أحبار وأفلام للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 50000, priority: 'ضروري للبدء', notes: 'صمام أمان أساسي لبدء العمل واستقبال الحالات' },
    ];
  }
  // 1.2 Clinics & Polyclinics (مراكز وعيادات طبية تخصصية بدون جراحة كبرى)
  else if (
    cleanIdea.includes('عيادة') ||
    cleanIdea.includes('مركز طبي') ||
    cleanIdea.includes('مجمع طبي') ||
    cleanIdea.includes('طبي')
  ) {
    minBudget = 450000;
    recommendedBudget = 1200000;
    recommendedModel = 'مجمع عيادات تخصصية واستشارات خارجية';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود لمركز طبي متعدد العيادات، ويصلح لعيادة استشارية مفردة';
      verdictDescription = `افتتاح مجمع عيادات متكامل في ${locationName} يتطلب ما لا يقل عن 450,000 ج.م. البديل الأمثل بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م) هو البدء بعيادة تخصصية مفردة أو استئجار عيادة بنظام الشيفتات.`;
      advice = [
        'ابدأ بتجهيز عيادة تخصصية واحدة عالية الطلب (أطفال أو باطنة أو نساء).',
        'استأجر مقراً مفروشاً جزئياً لخفض تكلفة التشطيب المبدئي بنسبة 40%.',
      ];
    } else {
      verdictTitle = 'رأس المال مناسب وممتاز لتأسيس العيادات الطبية والانطلاق';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) كافية لتجهيز غرف الكشف والاستقبال والتعقيم بأحدث المعايير في ${locationName}.`;
      advice = [
        'احرص على أجهزة فحص وتشخيص ذات كفاءة ودقة عالية.',
        'وفّر شاشات تنظيم دور وحجز إلكتروني لتحسين تجربة المرضى.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'جهاز فحص وسونار تشخيصي رقمي محمول', category: 'معدات وآلات', estimatedCostEgp: 180000, priority: 'ضروري للبدء', notes: 'استيراد كسر زيرو لخفض التكلفة 35%' },
      { id: 'eq-2', name: 'أجهزة فحص العلامات الحيوية وضغط وسكر وتعقيم', category: 'معدات وآلات', estimatedCostEgp: 45000, priority: 'ضروري للبدء', notes: 'معتمدة طبياً مع شهادات معايرة' },
      { id: 'eq-3', name: 'تجهيز غرفتي كشف متكاملتين (أسِرّة فحص ومكاتب وإضاءة)', category: 'تجهيزات وتشطيب', estimatedCostEgp: 75000, priority: 'ضروري للبدء', notes: 'تشطيب هادئ مقاوم للبكتيريا' },
      { id: 'eq-4', name: 'تجهيز منطقة استقبال واستراحة مرضى وشاشة عرض وشبكة إنترنت', category: 'تجهيزات وتشطيب', estimatedCostEgp: 50000, priority: 'ضروري للبدء', notes: 'كراسي مريحة ونظام تنظيم دور رقمي' },
      { id: 'eq-5', name: 'تراخيص نقابة الأطباء والعلاج الحر والموافقات الرسمية', category: 'تراخيص وتأسيس', estimatedCostEgp: 40000, priority: 'ضروري للبدء', notes: 'إلزامية للعمل القانوني والتعاقدات' },
      { id: 'eq-6', name: 'سيولة تشغيل نقدية ومخزون مستلزمات طبية للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 60000, priority: 'ضروري للبدء', notes: 'صمام أمان أساسي لبدء التشغيل' },
    ];
  }
  // 2. Dental Clinics (عيادات الأسنان)
  else if (ind === 'dental') {
    minBudget = 180000;
    recommendedBudget = 380000;
    recommendedModel = 'عيادة أسنان تخصصية رقمية متطورة';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود نسبياً، يُفضل البدء بوحدة أسنان واحدة استيراد كسر زيرو';
      verdictDescription = `تجهيز عيادة أسنان متكاملة في ${locationName} يتطلب ما لا يقل عن 180,000 ج.م للشاسيه وجهاز التعقيم. للبدء بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م)، الحل الأمثل هو اقتناء يونيت استيراد حالة ممتازة بنظام التقسيط.`;
      advice = [
        'اشترِ يونيت أسنان أوروبي كسر زيرو بدلاً من الصيني الجديد لضمان عمر أطول وتكلفة أقل 40%.',
        'تعاقد مع معمل تركيبات أسنان بنظام الدفع المؤجل (Credit) بعد تحصيل الرسوم من المريض.',
      ];
    } else {
      verdictTitle = 'رأس المال مناسب وممتاز لبدء عيادة أسنان احترافية متكاملة';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) تغطي شراء يونيت أسنان ممتاز وجهاز أوتوكلاف رقمي وتشطيب العيادة في ${locationName}.`;
      advice = [
        'احرص على أوتوكلاف فئة Class B لضمان أعلى معايير مكافحة العدوى وجذب المرضى الباحثين عن الأمان.',
        'وفّر حساس أشعة ديجيتال (RVG) لتقليل وقت الكشف وعرض الصور فوراً أمام المريض.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'وحدة كرسي أسنان متكاملة (Dental Chair Unit)', category: 'معدات وآلات', estimatedCostEgp: 95000, priority: 'ضروري للبدء', notes: 'هيدروليك مريح مع إضاءة LED ووحدة تحكم إلكترونية' },
      { id: 'eq-2', name: 'جهاز تعقيم رقمي فئة Class B مع مجفف هوائي', category: 'معدات وآلات', estimatedCostEgp: 38000, priority: 'ضروري للبدء', notes: 'مطابق للمواصفات القياسية الطبية' },
      { id: 'eq-3', name: 'جهاز أشعة أسنان ديجيتال وسينسور حساس RVG', category: 'معدات وآلات', estimatedCostEgp: 42000, priority: 'ضروري للبدء', notes: 'يغني عن أحماض وأفلام التحميض اليدوي القديمة' },
      { id: 'eq-4', name: 'توربينات وهاندبيسات ضوئية وجهاز حشو ليزر Light Cure', category: 'معدات وآلات', estimatedCostEgp: 20000, priority: 'ضروري للبدء', notes: 'أدوات دقيقة عالية الجودة' },
      { id: 'eq-5', name: 'ديكور وتشطيب غرفة الكشف والريسبشن واللافتة', category: 'تجهيزات وتشطيب', estimatedCostEgp: 40000, priority: 'ضروري للبدء', notes: 'أجواء مهدئة ومريحة للمريض' },
      { id: 'eq-6', name: 'تراخيص نقابة أطباء الأسنان وتأمين الإيجار', category: 'تراخيص وتأسيس', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'إجراءات قانونية ملزمة' },
      { id: 'eq-7', name: 'خامات ومواد حشو وتخدير وتبييض للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 22000, priority: 'ضروري للبدء', notes: 'خامات معتمدة عالمياً' },
    ];
  }
  // 3. Specialty Cafes & Coffee Shops (مقاهي وكافيهات)
  else if (ind === 'cafe') {
    minBudget = 90000;
    recommendedBudget = 320000;
    recommendedModel = userBudget < 200000 ? 'كشك قهوة مختصة Kiosk أو Drive-thru سريع' : 'كافيه عصري بجلسات داخلية وخارجية';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود لكافيه، لكنه مثالي لعربة قهوة ذكية أو ركن قهوة في مساحة مشتركة';
      verdictDescription = `افتتاح كافيه متكامل في ${locationName} يتطلب إيجار وتجهيزات تفوق ميزانيتك (${userBudget.toLocaleString('en-US')} ج.م). البديل العملي الرائع هو "عربة قهوة مختصة" أو "ركن قهوة داخل Co-working Space".`;
      advice = [
        'ابدأ بماكينة اسبريسو احترافية 1 جروب أو 2 جروب مستعملة بحالة ممتازة لتوفير 45%.',
        'ركز على جودة البن وسرعة التقديم؛ القهوة الممتازة هي التي تصنع الزبون الدائم.',
      ];
    } else if (userBudget < 220000) {
      verdictTitle = 'رأس المال كافٍ ومثالي للبدء كـ كشك قهوة مختصة (Kiosk) أنيق أو بار تيك أواي';
      verdictDescription = `الميزانية كافية تماماً لاقتناء ماكينة اسبريسو إيطالية ومطحنة وبناء بار خشب ستانلس أنيق في ${locationName}، بينما لجلسات جلوس واسعة يُفضل رفع الميزانية لاحقاً من الأرباح.`;
      advice = [
        'اختر موقعاً حيوياً أمام شركات أو جامعات لضمان تدفق عملاء التيك أواي اليومي.',
        'اتفق مع مخبز حلويات معتمد لتوريد الكوكيز والكرواسون بنظام التصريف اليومي دون هدر.',
      ];
    } else {
      verdictTitle = 'رأس المال ممتاز ومناسب لافتتاح كافيه عصري متكامل الأركان';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) تمكنك من تجهيز المقر بجلسات مريحة وتجهيزات باريستا كاملة في ${locationName}.`;
      advice = [
        'احرص على تنوع أنواع البن (محصول إثيوبي، كولومبي، برازيلي) لإبهار عشاق القهوة.',
        'خصص ركناً هادئاً بمنافذ كهرباء لشريحة رواد الأعمال والعمل عن بعد.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'ماكينة قهوة اسبريسو تجارية احترافية 2 جروب (إيطالي)', category: 'معدات وآلات', estimatedCostEgp: 65000, priority: 'ضروري للبدء', notes: 'عمود الفقر للكافيه؛ ماركة إيطالية معتمدة مع مضخة ضغط 9 بار ثابتة' },
      { id: 'eq-2', name: 'مطحنة بن تجارية On-Demand بشفرات تيتانيوم مسطحة', category: 'معدات وآلات', estimatedCostEgp: 18000, priority: 'ضروري للبدء', notes: 'طحن فوري بميكرومتر دقيق يحافظ على زيوت النكهة' },
      { id: 'eq-3', name: 'ثلاجة عرض حلويات ومخبوزات + ثلاجة بار سفلية للحليب', category: 'معدات وآلات', estimatedCostEgp: 26000, priority: 'ضروري للبدء', notes: 'تبريد فعال وزجاج شفاف بإضاءة LED دافئة' },
      { id: 'eq-4', name: 'خلاط عصائر صناعي + ماكينة ثلج Ice Maker', category: 'معدات وآلات', estimatedCostEgp: 16000, priority: 'ضروري للبدء', notes: 'للمشروبات الباردة والسموذي والآيس كوفي' },
      { id: 'eq-5', name: 'تجهيز بار ستانلس صحي مع كسوة خشبية ولافتة مضيئة', category: 'تجهيزات وتشطيب', estimatedCostEgp: 32000, priority: 'ضروري للبدء', notes: 'تصميم مريح للباريستا وواجهة راقية للزبون' },
      { id: 'eq-6', name: 'مخزون حبوب بن مختصة وأكواب ورقية مطبوعة وصوصات للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 18000, priority: 'ضروري للبدء', notes: 'تكفي لصنع أول 1500 كوب قهوة' },
      { id: 'eq-7', name: 'تأمين المقر وتراخيص الحي وسيولة طوارئ', category: 'تراخيص وتأسيس', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'تأمين الاستقرار القانوني في البداية' },
    ];
  }
  // 4. Restaurants & Food (مطاعم بيتزا، كشري، برجر، أكلات شعبية، مشويات)
  else if (
    ind === 'restaurant' ||
    ind === 'pizza' ||
    ind === 'burger' ||
    ind === 'shawarma' ||
    ind === 'koshary-food' ||
    ind === 'street-food' ||
    ind === 'grills'
  ) {
    minBudget = 110000;
    recommendedBudget = 360000;
    recommendedModel = userBudget < 200000 ? 'مطبخ سحابي Cloud Kitchen أو تيك أواي وتوصيل' : 'مطعم متكامل بصالة طعام وتيك أواي';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود لمطعم بمقاعد، ونوصي بشدة بنموذج المطبخ السحابي Cloud Kitchen';
      verdictDescription = `تأسيس صالة طعام بمقاعد في ${locationName} مكلف جداً. البديل الذهبي بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م) هو استئجار مطبخ مشترك أو تشغيل مطبخ سحابي يركز 100% على الدليفري وتطبيقات التوصيل.`;
      advice = [
        'وفر تكلفة الديكور والكراسي وركز الميزانية في جودة التغليف وخامات الأكل.',
        'اعتمد على إعلانات التيك توك وريلز انستجرام في محيط 5 كم لاقتناص طلبات الدليفري.',
      ];
    } else if (userBudget < 250000) {
      verdictTitle = 'رأس المال كافٍ لمطعم تيك أواي وتوصيل سريع وعالي الربحية';
      verdictDescription = `الميزانية كافية لتأمين معدات المطبخ الأساسية وواجهة استلام صغيرة في ${locationName} مع تشغيل نظام توصيل سريع.`;
      advice = [
        'اشترِ معدات ستانلس استيل تفصيل محلي بدلاً من المستورد الجاهز لتوفير 40%.',
        'حافظ على منيو مركز من 6 إلى 8 أصناف قوية لمنع هدر الخامات وتسهيل السرعة.',
      ];
    } else {
      verdictTitle = 'رأس المال ممتاز وجاهز لتجهيز مطعم قوي بصالة طعام في السوق';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) تغطي خط الإنتاج بالكامل وتجهيز صالة استقبال عملاء مريحة في ${locationName}.`;
      advice = [
        'احرص على نظام شفط وتهوية قوي معتمد لتفادي أي روائح أو أدخنة داخل الصالة.',
        'وفّر شاشات POS ونظام طلبات مطبخ متكامل لضبط الحسابات ومنع الفاقد.',
      ];
    }

    const isPizza = ind === 'pizza';
    const isGrills = ind === 'grills';

    items = [
      { id: 'eq-1', name: isPizza ? 'فرن بيتزا حجري سير / أفران إيطالية 2 دور' : isGrills ? 'شواية فحم ومقلب كبابجي ستانلس مع نظام سحب' : 'خط طهي صناعي (قلايات، جريلات، عيون غاز)', category: 'معدات وآلات', estimatedCostEgp: 55000, priority: 'ضروري للبدء', notes: 'معدات طبخ صناعية تتحمل ضغط العمل المستمر' },
      { id: 'eq-2', name: 'ثلاجة تبريد استيل رأسية + فريزر تجميد أفقي', category: 'معدات وآلات', estimatedCostEgp: 32000, priority: 'ضروري للبدء', notes: 'حفظ اللحوم والدواجن والخامات بدرجات حرارة معتمدة' },
      { id: 'eq-3', name: 'طاولات تحضير ستانلس استيل 304 صحي مع أحواض غسيل', category: 'معدات وآلات', estimatedCostEgp: 22000, priority: 'ضروري للبدء', notes: 'مطابقة لاشتراطات سلامة الغذاء والصحة' },
      { id: 'eq-4', name: 'نظام مدخنة وشفط وتهوية بهود استيل وموتور توربيني', category: 'تجهيزات وتشطيب', estimatedCostEgp: 28000, priority: 'ضروري للبدء', notes: 'عنصر أساسي لسلامة المطبخ وموافقات الحماية المدنية' },
      { id: 'eq-5', name: 'تشطيب واجهة الاستلام وديكور الصالة واللافتة المضيئة', category: 'تجهيزات وتشطيب', estimatedCostEgp: 35000, priority: 'ضروري للبدء', notes: 'هوية بصرية واضحة وجذابة تلفت المارة' },
      { id: 'eq-6', name: 'خامات ومكونات غذائية وعلب وأكياس مطبوعة للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'تكفي لتشغيل أول 1000 طلب' },
      { id: 'eq-7', name: 'تراخيص بلدية وتأمين وسداد شهر إيجار مقدم', category: 'تراخيص وتأسيس', estimatedCostEgp: 23000, priority: 'ضروري للبدء', notes: 'ضمان استمرارية التشغيل بلا مخالفات' },
    ];
  }
  // 5. Fashion & Retail (أزياء وملابس ومتاجر)
  else if (ind === 'fashion') {
    minBudget = 60000;
    recommendedBudget = 220000;
    recommendedModel = userBudget < 150000 ? 'براند ملابس أونلاين عبر السوشيال ميديا ومتجر إلكتروني' : 'متجر بوتيك فيزيائي + منصة بيع رقمية';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال مناسب جداً للبدء بنظام الكولكشن المصغر (Drops / Limited Edition)';
      verdictDescription = `في مجال الأزياء في ${locationName}، ميزانيتك (${userBudget.toLocaleString('en-US')} ج.م) كافية لتصنيع أول دفعة ملابس بعدد محدود (مثلاً 50-80 قطعة) وتصويرها باحترافية للبيع أونلاين.`;
      advice = [
        'لا تستأجر محلاً في البداية؛ اجعل 60% من الميزانية للتصنيع و 40% للتصوير والتسويق الرقمي.',
        'اختر خامات قطن مصري عالية الجودة؛ المنتج الممتاز يعوض أي غياب للمقر الفعلي.',
      ];
    } else {
      verdictTitle = 'رأس المال متوازن ومناسب لتصنيع كولكشن أول قوي وبناء حضور تجاري';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) تغطي تكاليف الخياطة والتطريز وتصوير الموديلز والحملات الإعلانية في ${locationName}.`;
      advice = [
        'تعاقد مع ورش خياطة متخصصة بدلاً من شراء ماكينات ودفع رواتب خياطين ثابتة.',
        'اهتم بالتغليف الفاخر (Packaging) وكرت الشكر؛ فالزبون يقيم البراند من لحظة فتح الصندوق.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'شراء أقمشة خام قطنية عالية الجودة وتجهيز صباغة', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 35000, priority: 'ضروري للبدء', notes: 'خامات مريحة تعيش طويلاً' },
      { id: 'eq-2', name: 'أجور قص وتفصيل وتطريز وتقفيل أول 150 قطعة', category: 'معدات وآلات', estimatedCostEgp: 30000, priority: 'ضروري للبدء', notes: 'في ورش ومصانع متخصصة' },
      { id: 'eq-3', name: 'جلسة تصوير احترافية (Photo Session) مع موديلز وخلفيات', category: 'تجهيزات وتشطيب', estimatedCostEgp: 14000, priority: 'ضروري للبدء', notes: 'أساس البيع على انستجرام وتيك توك' },
      { id: 'eq-4', name: 'أكياس شحن مطبوعة وبوكسات كرتون وهدايا ترحيبية وتكت براند', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 12000, priority: 'ضروري للبدء', notes: 'تجربة فتح منتج فاخرة' },
      { id: 'eq-5', name: 'إطلاق متجر إلكتروني وبوابة دفع إلكتروني وربط شحن', category: 'تراخيص وتأسيس', estimatedCostEgp: 10000, priority: 'ضروري للبدء', notes: 'تحصيل بالفيزا وميزة الدفع عند الاستلام' },
      { id: 'eq-6', name: 'ميزانية إعلانات ممولة مستهدفة لأول شهر', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 20000, priority: 'ضروري للبدء', notes: 'استقطاب المبيعات والطلبات الأولى' },
    ];
  }
  // 6. Gym & Fitness Centers (صالات رياضية وجيم)
  else if (cleanIdea.includes('جيم') || cleanIdea.includes('رياضي') || cleanIdea.includes('لياقة') || cleanIdea.includes('فتنس')) {
    minBudget = 220000;
    recommendedBudget = 550000;
    recommendedModel = userBudget < 300000 ? 'استوديو تدريب خاص وتأهيل بدني Personal Training Studio' : 'جيم متكامل بأجهزة كارديو وأوزان حرة';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال محدود لجيم متكامل، والأنسب هو استوديو تدريب فردي PT Studio أو جيم وظيفي Crossfit';
      verdictDescription = `تجهيز جيم تجاري كبير في ${locationName} يتطلب مساحات واسعة وأجهزة مستوردة. بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م)، النموذج الأمثل هو استوديو تدريب فردي (PT Studio) أو مساحة لياقة وظيفية (Crossfit) بأجهزة حرة وكابلات متعددة.`;
      advice = [
        'اشترِ أجهزة كابلات وزن حر وأوزان روسية (Kettlebells) ودامبلز لتغطية معظم التمارين بأقل كلفة.',
        'ركز على الاشتراكات الشهرية الخاصة بالتدريب الفردي عالي القيمة والاشتراكات السنوية المدفوعة مقدماً.',
      ];
    } else {
      verdictTitle = 'رأس المال متوازن ومناسب لتجهيز صالة ألعاب رياضية احترافية';
      verdictDescription = `الميزانية (${userBudget.toLocaleString('en-US')} ج.م) تغطي أجهزة الكارديو والأوزان الثقيلة وأرضيات الرابر في ${locationName}.`;
      advice = [
        'اختر أجهزة كارديو تجارية ذات موتور AC قوي يتحمل التشغيل 16 ساعة يومياً.',
        'اهتم بنظام التكييف والموسيقى وأجواء الإضاءة التحفيزية.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'أجهزة كارديو تجارية (2 سير مشي + 1 عجلة احترافية)', category: 'معدات وآلات', estimatedCostEgp: 85000, priority: 'ضروري للبدء', notes: 'أجهزة تجارية تتحمل الأوزان الثقيلة' },
      { id: 'eq-2', name: 'مجموعة أجهزة مقاومة محطات وكابلات Cable Crossover', category: 'معدات وآلات', estimatedCostEgp: 65000, priority: 'ضروري للبدء', notes: 'شاملة البكرات ومقابض التمارين المختلفة' },
      { id: 'eq-3', name: 'طقم دامبلز وأوزان حرة وبارات أولمبية وحوامل حديد', category: 'معدات وآلات', estimatedCostEgp: 35000, priority: 'ضروري للبدء', notes: 'أوزان رابر كاوتشوك ممتصة للصدمات' },
      { id: 'eq-4', name: 'أرضيات رابر كاوتشوك سميكة 20 ملم ومرايا جدارية كاملة', category: 'تجهيزات وتشطيب', estimatedCostEgp: 30000, priority: 'ضروري للبدء', notes: 'عزل الصوت وحماية البلاط وإعطاء شعور بالاتساع' },
      { id: 'eq-5', name: 'تكييفات هواء قوية ونظام صوتيات وتوزيع موسيقى', category: 'تجهيزات وتشطيب', estimatedCostEgp: 32000, priority: 'ضروري للبدء', notes: 'ضروري جداً لراحة المتدربين ومنع الاختناق' },
      { id: 'eq-6', name: 'تراخيص نقابة المهن الرياضية والحماية المدنية', category: 'تراخيص وتأسيس', estimatedCostEgp: 20000, priority: 'ضروري للبدء', notes: 'اشتراطات سلامة وإشراف فني معتمد' },
      { id: 'eq-7', name: 'نظام اشتراكات رقمي وبوابات باركود وسيولة أول شهر', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'إدارة العضويات ومتابعة التجديد' },
    ];
  }
  // 7. General Businesses / Services / Tech
  else {
    minBudget = 75000;
    recommendedBudget = 200000;
    recommendedModel = 'نموذج عمل رشيق يبدأ بالخدمة الأساسية ويتوسع تدريجياً';

    if (userBudget < minBudget) {
      verdictTitle = 'رأس المال رشيق؛ ركز على نموذج العمل الخفيف (Lean MVP)';
      verdictDescription = `بميزانيتك (${userBudget.toLocaleString('en-US')} ج.م) في ${locationName}، يُفضل البدء بالخدمة الأساسية المباشرة دون تكاليف تأسيس ثقيلة حتى تثبت جدوى الفكرة وتجلب التدفق النقدي.`;
      advice = [
        'تجنب الأصول الثابتة في الشهور الأولى، واستأجر مساحات مشتركة أو معدات بالقطعة.',
        'اعتمد على التسويق الشفهي وتوصيات أول 10 عملاء.',
      ];
    } else {
      verdictTitle = 'رأس المال متوازن ومناسب لانطلاقة احترافية مدروسة';
      verdictDescription = `الميزانية المرصودة (${userBudget.toLocaleString('en-US')} ج.م) تكفي لتأمين كافة التجهيزات الأساسية وسيولة التشغيل في ${locationName}.`;
      advice = [
        'لا تنفق كامل الميزانية في التأسيس؛ احتفظ بـ 30% كسيولة تشغيل نقدية للشهرين الأولين.',
        'قِس تكلفة اكتساب العميل (CAC) واضبط أسعارك بانتظام بناءً على التغذية الراجعة.',
      ];
    }

    items = [
      { id: 'eq-1', name: 'أجهزة حاسوب ومعدات عمل مكتبية وتقنية', category: 'معدات وآلات', estimatedCostEgp: 28000, priority: 'ضروري للبدء', notes: 'أجهزة سريعة لإنجاز العمل اليومي' },
      { id: 'eq-2', name: 'تجهيز مقر العمل وتأثيث مساحة الاستقبال والاجتماعات', category: 'تجهيزات وتشطيب', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'بيئة مريحة ومهنية تمنح العميل ثقة' },
      { id: 'eq-3', name: 'تراخيص قانونية وسجل تجاري وبطاقة ضريبية وتأسيس', category: 'تراخيص وتأسيس', estimatedCostEgp: 15000, priority: 'ضروري للبدء', notes: 'حماية قانونية وفتح حساب بنكي للشركات' },
      { id: 'eq-4', name: 'منظومة تقنية، موقع إلكتروني، واشتراكات برمجية', category: 'معدات وآلات', estimatedCostEgp: 12000, priority: 'ضروري للبدء', notes: 'أتمتة العمليات والتواصل مع العملاء' },
      { id: 'eq-5', name: 'خامات ومستلزمات ومطبوعات الهوية للشهر الأول', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 15000, priority: 'ضروري للبدء', notes: 'أدوات التشغيل المباشر' },
      { id: 'eq-6', name: 'سيولة نقدية احتياطية لتغطية مصاريف أول شهرين', category: 'سيولة تشغيل ومخزون', estimatedCostEgp: 25000, priority: 'ضروري للبدء', notes: 'صمام أمان أساسي' },
    ];
  }

  const capexTotal = items.reduce((sum, it) => sum + it.estimatedCostEgp, 0);
  let status: 'sufficient' | 'lean_viable' | 'insufficient' = 'sufficient';
  if (userBudget >= minBudget && userBudget >= capexTotal * 0.9) {
    status = 'sufficient';
  } else if (userBudget >= minBudget * 0.4 || userBudget >= capexTotal * 0.55) {
    status = 'lean_viable';
  } else {
    status = 'insufficient';
  }

  // Accurate gap calculation
  let gapOrSurplus = userBudget - capexTotal;
  if (status === 'insufficient') {
    const requiredMin = Math.max(minBudget, capexTotal);
    gapOrSurplus = userBudget - requiredMin;
    if (gapOrSurplus >= 0) {
      gapOrSurplus = -Math.abs(minBudget - userBudget || 50000);
    }
  }

  // 4. Financial Projections & Unit Economics Benchmark
  const baseInvestment = Math.max(capexTotal, minBudget);
  const isComplex =
    cleanIdea.includes('مستشفى') ||
    cleanIdea.includes('مستشفي') ||
    cleanIdea.includes('جراحة') ||
    cleanIdea.includes('عيادة') ||
    cleanIdea.includes('مركز طبي') ||
    cleanIdea.includes('برمجيات') ||
    cleanIdea.includes('سوفت وير') ||
    cleanIdea.includes('استشارات');

  let unitEconomics: UnitEconomicsBenchmark;
  if (isComplex) {
    unitEconomics = {
      pricingNature: 'complex_services',
      noticeTitle: 'تنويه طبيعة تسعير وإيرادات الخدمات الطبية والجراحية والمتخصصة',
      noticeDescription:
        'نظراً لتنوع وتفاوت أسعار الخدمات (كشوفات استشارية، تحاليل، فحوصات، جراحات اليوم الواحد، عمليات متقدمة في القلب أو المخ أو العظام، وأيام الإقامة)، لا يُمكن وضع سعر موحد لكل خدمة؛ حيث تختلف الأسعار بناءً على درجة الاستشاري الجراح، مدة الإقامة، وتكاليف المستلزمات الطبية. تم بناء دراسة الجدوى المالية التقديرية بناءً على معدل إشغال غرف العمليات والأسِرّة وتدفق المترددين اليومي.',
      keyDrivers: [
        'معدل إشغال غرف العمليات والأسِرّة (Bed Occupancy Rate)',
        'نسبة تقاسم الأتعاب مع كبار الاستشاريين والجراحين المتعاقدين',
        'تكلفة الأدوية والمستلزمات الطبية والغازات والتعقيم',
        'التعاقدات مع شركات التأمين الصحي والنقابات والمؤسسات',
      ],
    };
  } else {
    const indStr = String(ind);
    const isFood =
      indStr === 'restaurant' ||
      indStr === 'pizza' ||
      indStr === 'burger' ||
      indStr === 'cafe' ||
      indStr === 'koshary-food' ||
      indStr === 'shawarma' ||
      indStr === 'street-food' ||
      indStr === 'bakery';

    const avgTicket = indStr === 'cafe' ? 85 : indStr === 'pizza' ? 165 : indStr === 'koshary-food' ? 60 : isFood ? 140 : 250;
    const avgItem = indStr === 'cafe' ? 50 : indStr === 'pizza' ? 115 : indStr === 'koshary-food' ? 35 : isFood ? 90 : 180;
    const dailyOrders = Math.max(35, Math.min(180, Math.round(baseInvestment / (avgTicket * 35))));

    unitEconomics = {
      pricingNature: 'standard_products',
      noticeTitle: 'مؤشرات التسعير ومتوسط سلة المبيعات (Unit Economics)',
      noticeDescription:
        'في هذا النشاط، تعتمد الربحية التشغيلية على ضبط متوسط قيمة الفاتورة للزبون، والتحكم الصارم في نسبة تكلفة المواد الخام المباشرة وتفادي الهدر وسرعة دوران الطلبات.',
      averageTicketEgp: avgTicket,
      averageItemPriceEgp: avgItem,
      targetDailyOrders: dailyOrders,
      grossMarginPct: ind === 'cafe' ? 68 : isFood ? 55 : 45,
      keyDrivers: [
        'متوسط قيمة الفاتورة للطلب الواحد (Average Order Value)',
        'نسبة تكلفة الخامات المباشرة (Food / Product Cost %)',
        'معدل الطلبات اليومية وتدوير الطاولات وسرعة التوصيل',
        'التحكم في مصاريف التشغيل الثابتة (الإيجار والرواتب)',
      ],
    };
  }

  // Financial Projections: 3-6 months, 1 Year, 5 Years
  const monthlyRevenueEst = Math.round(baseInvestment * (isComplex ? 0.14 : 0.22));
  const monthlyCostEst = Math.round(monthlyRevenueEst * 0.76);
  const monthlyProfitEst = monthlyRevenueEst - monthlyCostEst;
  const yearOneRev = monthlyRevenueEst * 12;
  const yearOneNet = Math.round(yearOneRev * (isComplex ? 0.24 : 0.22));
  const yearOneMargin = Math.round((yearOneNet / yearOneRev) * 100);
  const yearOneRecovery = Math.min(95, Math.round((yearOneNet / baseInvestment) * 100));
  const paybackMonths = Math.max(10, Math.min(36, Math.round((baseInvestment / (monthlyProfitEst || 1)) * 1.15)));
  const fiveYearProfit = Math.round(yearOneNet * 5.2);
  const roiPct = Math.round((yearOneNet / baseInvestment) * 100);

  const projections: FinancialProjections = {
    initialPhaseMonths: 'أول 3 - 6 أشهر',
    initialMonthlyRevenueEgp: monthlyRevenueEst,
    initialMonthlyCostsEgp: monthlyCostEst,
    initialMonthlyProfitEgp: monthlyProfitEst,
    breakEvenMonth: isComplex ? 5 : 3,
    yearOneRevenueEgp: yearOneRev,
    yearOneNetProfitEgp: yearOneNet,
    yearOneMarginPct: yearOneMargin,
    yearOneRecoveryPct: yearOneRecovery,
    fiveYearCumulativeProfitEgp: fiveYearProfit,
    paybackPeriodMonths: paybackMonths,
    estimatedRoiPct: roiPct,
    fiveYearAnnualizedReturn: `${Math.round(roiPct * 0.85)}% سنوياً`,
  };

  return {
    userBudgetEgp: userBudget,
    minEstimatedBudgetEgp: minBudget,
    recommendedBudgetEgp: recommendedBudget,
    status,
    verdictTitle,
    verdictDescription,
    recommendedModel,
    startupBreakdown: items,
    capexTotalEgp: capexTotal,
    gapOrSurplusEgp: gapOrSurplus,
    advice,
    alternativeBreakdown,
    alternativeCapexTotalEgp,
    alternativeModelTitle,
    projections,
    unitEconomics,
  };
}

// 5. Adaptive Pricing Generator (Services / Menu / Products / Packages)
export function buildPricing(
  budget: number,
  knownVarCost?: number,
  knownFixedCost?: number,
  analysis?: IdeaAnalysis,
  idea: string = '',
  city: string = 'القاهرة',
  district: string = ''
): BrandPricing {
  const baseVar = knownVarCost || Math.round(budget > 0 ? budget * 0.002 : 75);
  const fixed = knownFixedCost || 15000;
  const industry = analysis?.industryId || 'general';
  const format: PricingFormat = analysis?.pricingFormat || 'services';
  const capitalFeasibility = buildCapitalFeasibility(budget, idea, city, district, analysis);

  let items: PricingItem[] = [];

  // DENTAL CLINIC PRICING: Real Dental Services & Procedures
  if (industry === 'dental') {
    items = [
      {
        id: 'srv-1',
        name: 'كشف واستشارة تخصصية + فحص رقمي بالأشعة',
        category: 'كشف واستشارات',
        priceEgp: 300,
        costEgp: 50,
        unit: 'للكشف',
        description: 'فحص إكلينيكي كامل للأسنان واللثة مع تصوير رقمي وخطة علاجية مفصلة.',
        inclusions: ['أشعة ديجيتال موضعية', 'خطة علاجية مكتوبة', 'متابعة مجانية خلال أسبوع'],
        popular: false,
      },
      {
        id: 'srv-2',
        name: 'جلسة تنظيف أسنان وإزالة الجير وتلميع بالموجات الصوتية',
        category: 'عناية ووقاية',
        priceEgp: 600,
        costEgp: 90,
        unit: 'للجلسة',
        description: 'إزالة كاملة للترسبات الجيرية وتلميع المينا وإزالة التصبغات وإعادة الانتعاش.',
        inclusions: ['تنظيف التراسونيك', 'تلميع بمعجون تخصصي', 'فلورايد مقوي للمينا'],
        popular: true,
      },
      {
        id: 'srv-3',
        name: 'حشو تجميلي كومبوزيت ليزر عالي الصلابة',
        category: 'حشوات وعلاجات',
        priceEgp: 850,
        costEgp: 180,
        unit: 'لكل ضرس/سن',
        description: 'حشو ليزر بلون السن الطبيعي تماماً وبأعلى معايير المتانة والجمال.',
        inclusions: ['عزل تام (Rubber Dam)', 'تدرج لوني مطابق للسن', 'ضمان لمدة عامين'],
        popular: true,
      },
      {
        id: 'srv-4',
        name: 'علاج جذور وعصب بالميكروسكوب الرقمي في جلسة واحدة',
        category: 'حشوات وعلاجات',
        priceEgp: 1400,
        costEgp: 320,
        unit: 'للقناة/السن',
        description: 'تنظيف وتعقيم قنوات العصب بأجهزة الروتاري والميكروسكوب بلا ألم نهائياً.',
        inclusions: ['تخدير موضعي متطور', 'حشو عصب ثلاثي الأبعاد', 'أشعة توثيق بعد الإجراء'],
        popular: false,
      },
      {
        id: 'srv-5',
        name: 'جلسة تبييض أسنان احترافي زووم ليزر (Philips Zoom 4)',
        category: 'تجميل الابتسامة',
        priceEgp: 3200,
        costEgp: 950,
        unit: 'للجلسة الكاملة',
        description: 'تفتيح لون الأسنان من 6 إلى 8 درجات في جلسة واحدة مدتها 45 دقيقة بأمان تام.',
        inclusions: ['حماية كاملة للثة والشفاه', 'جلسة علاج حساسية الأسنان', 'قالب تبييض منزلي هدية'],
        popular: true,
      },
      {
        id: 'srv-6',
        name: 'طربوش / تاج زيركون تجميلي عالي النقاء (Zirconia Crown)',
        category: 'تركيبات وتيجان',
        priceEgp: 2800,
        costEgp: 800,
        unit: 'للسن الواحد',
        description: 'تاج زيركون صلب وخالي من المعادن يحاكي لمعان وشفافية الأسنان الطبيعية.',
        inclusions: ['تصميم رقمي ثلاثي الأبعاد CAD/CAM', 'بروفات دقيقة', 'ضمان 5 سنوات معتمد'],
        popular: false,
      },
      {
        id: 'srv-7',
        name: 'زراعة سن فوري تيتانيوم ألماني مع التاج النهائي',
        category: 'جراحة وزراعة',
        priceEgp: 9500,
        costEgp: 3200,
        unit: 'لكل غرسة متكاملة',
        description: 'غرسة تيتانيوم حيوية مع تاج دائم تعيد وظيفة السن المفقود ومظهره الأصلي مدى الحياة.',
        inclusions: ['غرسة ألمانية معتمدة', 'جراحة دقيقة بدون فتح واسع', 'تاج زيركون نهائي'],
        popular: false,
      },
      {
        id: 'srv-8',
        name: 'تقويم أسنان شفاف أو معدني شامل المتابعات الدورية',
        category: 'تقويم الأسنان',
        priceEgp: 18000,
        costEgp: 5500,
        unit: 'للخطة التقويمية',
        description: 'تعديل اصطفاف وتطابق الأسنان بأحدث أجهزة التقويم الشفاف أو المعدني مع أقساط ميسرة.',
        inclusions: ['تصوير ومسح ثلاثي الأبعاد', 'جلسات متابعة شهرية', 'مثبت شفاف بعد الانتهاء'],
        popular: false,
      },
    ];
  } else if (
    idea.includes('أشعة') ||
    idea.includes('اشعة') ||
    idea.includes('رنين') ||
    idea.includes('سونار') ||
    idea.includes('سكان') ||
    idea.includes('radiology') ||
    idea.includes('imaging')
  ) {
    // RADIOLOGY & IMAGING CENTER SERVICES
    items = [
      {
        id: 'rad-1',
        name: 'فحص سونار وتصوير بالموجات فوق الصوتية للبطن والحوض (Ultrasound)',
        category: 'أشعة وسونار',
        priceEgp: 450,
        costEgp: 80,
        unit: 'للفحص',
        description: 'تصوير دقيق لأعضاء البطن والحوض والكبد والكلى بأحدث أجهزة السونار الملون.',
        inclusions: ['تقرير استشاري فوري', 'صور الأشعة ملونة عالية الدقة', 'مراجعة مع طبيب الأشعة'],
        popular: true,
      },
      {
        id: 'rad-2',
        name: 'فحص سونار رباعي الأبعاد 4D/5D للجنين والحمل التفصيلي',
        category: 'سونار حوامل وأمومة',
        priceEgp: 750,
        costEgp: 130,
        unit: 'للفحص الشامل',
        description: 'تصوير مجسم وملون لحركات الجنين وملامحه وفحص تشوهات تفصيلي.',
        inclusions: ['فيديو وصور رقمية على فلاشة أو واتساب', 'تقرير استشاري مفصل', 'قياسات نمو الجنين'],
        popular: true,
      },
      {
        id: 'rad-3',
        name: 'أشعة سينية ديجيتال عادية للصدر أو العظام (Digital X-Ray)',
        category: 'أشعة ديجيتال X-Ray',
        priceEgp: 300,
        costEgp: 50,
        unit: 'للوضع الواحد',
        description: 'تصوير رقمي سريع بأقل جرعة إشعاعية ممكنة وأعلى نقاء للصورة.',
        inclusions: ['فيلم ديجيتال ليزر', 'تقرير رسمي معتمد', 'تسليم فوري خلال 30 دقيقة'],
        popular: true,
      },
      {
        id: 'rad-4',
        name: 'دوبلر ملون على شرايين وأوردة الساقين أو الرقبة (Color Doppler)',
        category: 'فحوصات دوبلر وأوعية دموية',
        priceEgp: 700,
        costEgp: 140,
        unit: 'للطرف الواحد',
        description: 'فحص كفاءة سريان الدم وتشخيص الجلطات وتصلب الشرايين والدوالي.',
        inclusions: ['رسم مسار الدم ملون', 'تقرير استشاري أوعية دموية', 'تسليم في نفس اليوم'],
        popular: false,
      },
      {
        id: 'rad-5',
        name: 'فحص سونار للغدة الدرقية أو الثدي مع تقرير استشاري',
        category: 'أشعة وسونار تخصصي',
        priceEgp: 500,
        costEgp: 90,
        unit: 'للفحص',
        description: 'كشف مبكر عالي الدقة للأورام والتكيسات والتهابات الأنسجة الرخوة.',
        inclusions: ['تصنيف BI-RADS أو TI-RADS الطبي', 'صور دقيقة للأنسجة', 'استشارة توجيهية'],
        popular: true,
      },
      {
        id: 'rad-6',
        name: 'أشعة بانوراما رقمية للأسنان والفكين (Digital Panoramic X-Ray)',
        category: 'أشعة أسنان',
        priceEgp: 350,
        costEgp: 60,
        unit: 'للفحص',
        description: 'مسح كامل للفكين والأسنان ومفصل الفك قبل عمليات التقويم والزراعة.',
        inclusions: ['صورة بانورامية فائقة الوضوح', 'CD أو إرسال رقمي للعيادة المعالجة'],
        popular: false,
      },
    ];
  } else if (
    idea.includes('مسمط') ||
    idea.includes('كوارع') ||
    idea.includes('فواكه اللحوم')
  ) {
    // EGYPTIAN MASMAT & POPULAR HERITAGE MENU
    items = [
      {
        id: 'masmat-1',
        name: 'صينية مسمط ابن البلد المشكلة (كفتة، لحمة راس، كرشة، فشة، ممبار)',
        category: 'صواني المسمط المخصوصة',
        priceEgp: 260,
        costEgp: 90,
        unit: 'للصينية المشكلة',
        description: 'تشكيلة المسمط الفاخرة على أصولها بالطشة البلدي والسمنة الفلاحي مع العيش والشوربة.',
        inclusions: ['طبق شوربة مخدومة هدية', 'طحينة ومخلل بلدي', 'عيش بلدي سخن وفير'],
        popular: true,
      },
      {
        id: 'masmat-2',
        name: 'طاجن كوارع مخلية بالفرن بالخل والتوم والصلصة المسبكة',
        category: 'طواجن المسمط الساخنة',
        priceEgp: 190,
        costEgp: 65,
        unit: 'للطاجن',
        description: 'كوارع طازجة مسلوقة ومخلية ومحمرة في طاجن فخار مع طشة توم وصلصة حمراء حامية.',
        inclusions: ['طبق أرز أبيض بلدي', 'شوربة كوارع ليمون', 'عيش محمص'],
        popular: true,
      },
      {
        id: 'masmat-3',
        name: 'طاجن عكاوي بالبصل القاورما في الفرن البلدي',
        category: 'طواجن المسمط الساخنة',
        priceEgp: 240,
        costEgp: 95,
        unit: 'للطاجن الفخاري',
        description: 'عكاوي بلدي دسمة ومكرملة مع بصل وتوابل الحارة المصرية على نار هادية.',
        inclusions: ['شوربة مغلية', 'مخلل مشكل', 'عيش بلدي سخن'],
        popular: true,
      },
      {
        id: 'masmat-4',
        name: 'فتة كوارع ولحمة راس بالطشة والصلصة البلدي',
        category: 'فتات وأطباق رئيسية',
        priceEgp: 180,
        costEgp: 60,
        unit: 'للطبق الكبير',
        description: 'طبقات العيش المحمص والشوربة الدسمة والأرز المصري مع طشة الخل والتوم.',
        inclusions: ['دقة توم إضافية', 'شوربة ليمون', 'سلطة خضراء بلدية'],
        popular: false,
      },
      {
        id: 'masmat-5',
        name: 'سرفيس ممبار بلدي محمر مقرمش بالأرز والخلطة السرية',
        category: 'مقبلات ومحمرات مسمط',
        priceEgp: 120,
        costEgp: 38,
        unit: 'للسرفيس (نصف كيلو)',
        description: 'ممبار بقري طازج محشو بخلطة الأرز بالخضرة والنعناع ومحمر لدرجة القرمشة الذهبية.',
        inclusions: ['طحينة بيضاء متبلة', 'ليمون مخلل معصفر'],
        popular: true,
      },
      {
        id: 'masmat-6',
        name: 'مج شوربة كوارع مخدومة بالليمون والمستكة والحبهان',
        category: 'شوربات دسمة',
        priceEgp: 50,
        costEgp: 12,
        unit: 'للمج الساخن',
        description: 'خلاصة الكوارع البلدي المطهوة ببطء مع المستكة اليوناني وليمون طازج.',
        inclusions: ['ليمون طازج', 'عيش محمص بالفرن'],
        popular: true,
      },
    ];
  } else if (industry === 'medical') {
    // MEDICAL CLINIC SERVICES & PROCEDURES
    items = [
      {
        id: 'med-1',
        name: 'كشف واستشارة استشارية متخصصة + تقرير طبي شامل',
        category: 'كشف وتشخيص',
        priceEgp: 350,
        costEgp: 60,
        unit: 'للكشف',
        description: 'فحص إكلينيكي كامل بواسطة استشاري متخصص مع قياس العلامات الحيوية وخطة علاجية مكتوبة.',
        inclusions: ['قياس ضغط وسكر', 'تخطيط مبدئي', 'إعادة كشف مجانية خلال 14 يوماً'],
        popular: true,
      },
      {
        id: 'med-2',
        name: 'فحص دوري شامل (تحاليل وظائف كبد وكلى وسكر وصورة دم كاملة)',
        category: 'فحوصات ومختبر',
        priceEgp: 750,
        costEgp: 190,
        unit: 'للباقة المعملية',
        description: 'باقة تحاليل وقائية متكاملة لتقييم كفاءة الأعضاء الحيوية مع تقرير ومراجعة طبيب.',
        inclusions: ['سحب عينات منزلي متاح', 'تقرير رقمي سريع خلال 24 ساعة', 'استشارة مراجعة مجانية'],
        popular: true,
      },
      {
        id: 'med-3',
        name: 'فحص سونار وتصوير بالموجات فوق الصوتية (Ultrasound)',
        category: 'أشعة وتشخيص',
        priceEgp: 500,
        costEgp: 110,
        unit: 'للفحص',
        description: 'تصوير دقيق للبطن والحوض أو الغدة الدرقية بأحدث أجهزة السونار الملون.',
        inclusions: ['تقرير مفصل فوري', 'صور الأشعة ملونة وعالية الدقة'],
        popular: false,
      },
      {
        id: 'med-4',
        name: 'رسم قلب رقمي متطور (ECG) مع قراءة استشارية فورية',
        category: 'كشف وتشخيص',
        priceEgp: 400,
        costEgp: 80,
        unit: 'للرسم',
        description: 'تسجيل دقيق لكهرباء القلب ونبضاته للوقاية من أي اعتلالات واطمئنان المريض.',
        inclusions: ['شريط رسمي معتمد', 'تقرير فوري معتمد من استشاري القلب'],
        popular: false,
      },
      {
        id: 'med-5',
        name: 'جلسة علاج طبيعي وتأهيل حركي متكاملة (Physical Therapy)',
        category: 'علاج طبيعي وتأهيل',
        priceEgp: 450,
        costEgp: 100,
        unit: 'للجلسة',
        description: 'جلسة تأهيل لآلام الظهر والرقبة والمفاصل بأجهزة الموجات والليزر وتمارين مخصصة.',
        inclusions: ['علاج يدوي', 'موجات علاجية', 'برنامج تمارين منزلية مرافقة'],
        popular: true,
      },
      {
        id: 'med-6',
        name: 'باقة الرعاية الطبية الشهرية للمرضى وكبار السن (Home/Clinic Care)',
        category: 'باقات ورعاية مستمرة',
        priceEgp: 2200,
        costEgp: 650,
        unit: 'شهرياً',
        description: 'متابعة أسبوعية منتظمة لقياس المؤشرات الحيوية وضبط جرعات الأدوية مع دعم هاتفي 24/7.',
        inclusions: ['4 زيارات متابعة', 'تحاليل متابعة شهرية', 'أولوية قصوى بدون انتظار'],
        popular: false,
      },
    ];
  } else if (industry === 'koshary-food') {
    // EGYPTIAN KOSHARY & CASSEROLES MENU
    items = [
      {
        id: 'koshary-1',
        name: 'علبة كشري ميكس مخصوص (تقلية مقرمشة ودقة توم)',
        category: 'أطباق وعلب كشري',
        priceEgp: 45,
        costEgp: 14,
        unit: 'للعلبة',
        description: 'توليفة الكشري المظبوطة: أرز بالشعرية، مكرونة إسباجيتي ومقصوصة، عدس وحمص وصلصة مسبكة.',
        inclusions: ['كيس دقة توم وخل', 'كيس شطة زيت حامية', 'كيس تقلية بصل مقرمش'],
        popular: true,
      },
      {
        id: 'koshary-2',
        name: 'علبة كشري سوبر دبل عائلي مشبع',
        category: 'أطباق وعلب كشري',
        priceEgp: 65,
        costEgp: 20,
        unit: 'للعلبة',
        description: 'حجم كبير جداً للأكيلة مع كمية مضاعفة من العدس والحمص والبصل المقرمش.',
        inclusions: ['2 كيس دقة', '2 كيس شطة زيت', 'عبوة صلصة إضافية'],
        popular: true,
      },
      {
        id: 'koshary-3',
        name: 'طاجن مكرونة فرن باللحمة المفرومة البلدي والصلصة',
        category: 'طواجن فرن ساخنة',
        priceEgp: 70,
        costEgp: 24,
        unit: 'للطاجن',
        description: 'طاجن فخار مكرونة قلم بلحمة مفرومة متبلة بتوابل الحاتي وصلصة طماطم مسبكة على نار الفرن.',
        inclusions: ['طاجن فخار سخن', 'دقة حامية', 'ليمون مخلل'],
        popular: true,
      },
      {
        id: 'koshary-4',
        name: 'طاجن مكرونة فرن بالفراخ والموتزاريلا السايحة',
        category: 'طواجن فرن ساخنة',
        priceEgp: 80,
        costEgp: 28,
        unit: 'للطاجن',
        description: 'قطع صدور دجاج متبلة مع مكرونة قلم وصلصة بيضاء وحمراء وجبنة موتزاريلا محمرة.',
        inclusions: ['جبنة موتزاريلا وفيرة', 'طحينة', 'مخلل مشكل'],
        popular: false,
      },
      {
        id: 'koshary-5',
        name: 'حلو: طبق أرز باللبن فرن بالقشطة والمكسرات',
        category: 'حلويات شرقية وتحلية',
        priceEgp: 30,
        costEgp: 9,
        unit: 'للطبق',
        description: 'أرز بلبن بلدي كريمي مطبوخ على نار هادية مع وش قشطة محمر في الفرن ومكسرات.',
        inclusions: ['قشطة بلدي', 'فول سوداني وزبيب وجوز هند'],
        popular: true,
      },
      {
        id: 'koshary-6',
        name: 'حلو: قنبلة الكشري (أرز باللبن وكنافة وبسبوسة وآيس كريم)',
        category: 'حلويات شرقية وتحلية',
        priceEgp: 50,
        costEgp: 17,
        unit: 'للطبق',
        description: 'الحلو الأكثر طلباً بعد الكشري: طبقات كنافة وبسبوسة مع بولة آيس كريم فانيليا وصوص كراميل.',
        inclusions: ['كنافة', 'بسبوسة', 'آيس كريم', 'صوص كراميل'],
        popular: false,
      },
    ];
  } else if (industry === 'foul-falafel') {
    // EGYPTIAN FOUL, FALAFEL & TRADITIONAL BREAKFAST MENU
    items = [
      {
        id: 'falafel-1',
        name: 'ساندوتش فلافل محشية بالبصل والشطة والسمسم',
        category: 'ساندوتشات فلافل سخنة',
        priceEgp: 12,
        costEgp: 4,
        unit: 'للساندوتش',
        description: 'أقراص فلافل مقرمشة محشية بخلطة البصل والفلفل الحار والسمسم في عيش بلدي طازج مع سلطة وطحينة.',
        inclusions: ['عيش بلدي سخن', 'طحينة بيضاء', 'سلطة خضراء'],
        popular: true,
      },
      {
        id: 'falafel-2',
        name: 'ساندوتش فول مدمس بالزيت الحار والليمون والكمون',
        category: 'ساندوتشات فول بلدي',
        priceEgp: 10,
        costEgp: 3.5,
        unit: 'للساندوتش',
        description: 'فول مدمس زبدة من القدرة مباشرة مع رشة زيت حار أصلي وعصرة ليمون وكمون في عيش بلدي مقمر.',
        inclusions: ['عيش بلدي', 'زيت حار أصلي', 'دقة ليمون وكمون'],
        popular: true,
      },
      {
        id: 'falafel-3',
        name: 'طبق فول بالسمنة البلدي وطشة الثوم',
        category: 'أطباق وعلب عائلية',
        priceEgp: 25,
        costEgp: 8,
        unit: 'للطبق',
        description: 'طبق فول زبدة مطبوخ على نار هادية مع ملعقة سمنة بلدي بقري فلاحي وطشة ثوم وكزبرة.',
        inclusions: ['2 رغيف بلدي', 'سلطة طحينة', 'مخلل مشكل'],
        popular: true,
      },
      {
        id: 'falafel-4',
        name: 'طبق فلافل مقرمشة بالسمسم (6 أقراص سخنة)',
        category: 'أطباق وعلب عائلية',
        priceEgp: 15,
        costEgp: 5,
        unit: 'للطبق',
        description: 'ستة أقراص فلافل ذهبية مقرمشة معمولة من عجينة طازجة ومغطاة ببذور السمسم المحمص.',
        inclusions: ['طحينة خام', 'طماطم مخللة'],
        popular: true,
      },
      {
        id: 'falafel-5',
        name: 'ساندوتش طعمية بالباذنجان المخلل والبطاطس',
        category: 'ساندوتشات مكس وتحابيش',
        priceEgp: 14,
        costEgp: 4.5,
        unit: 'للساندوتش',
        description: 'المكس الشعبي المحبوب: طعمية سخنة مع شرائح باذنجان مقلي مخلل بالثوم والخل وبطاطس صوابع.',
        inclusions: ['باذنجان متبل', 'طحينة', 'دقة شطة'],
        popular: true,
      },
      {
        id: 'falafel-6',
        name: 'طبق بطاطس محمرة بدقة الكمون والملح',
        category: 'مقبلات وتحابيش',
        priceEgp: 20,
        costEgp: 6,
        unit: 'للطلب',
        description: 'بطاطس فريش مقلية مقرمشة في زيت نقي مع رشة دقة كمون وشطة خفيفة.',
        inclusions: ['دقة كمون بلدي', 'كاتشب اختياري'],
        popular: false,
      },
      {
        id: 'falafel-7',
        name: 'علبة باذنجان مخلل بالخل والثوم والفلفل الحار',
        category: 'مقبلات وتحابيش',
        priceEgp: 12,
        costEgp: 3.5,
        unit: 'للعلبة',
        description: 'باذنجان عروس مسلوق ومخلل بخلطة الثوم والليمون والفلفل الأحمر الحار يفتح النفس.',
        inclusions: ['دقة ثوم وليمون وفيرة'],
        popular: false,
      },
      {
        id: 'falafel-8',
        name: 'كانز مشروب غازي مثلج / شاي كشري بالنعناع',
        category: 'مشروبات',
        priceEgp: 15,
        costEgp: 10,
        unit: 'للطلب',
        description: 'كوب شاي صعيدي مغلي ع الفحم بنعناع بلدي فريش أو مشروب غازي مثلج بعد الأكلة.',
        inclusions: [],
        popular: false,
      },
    ];
  } else if (industry === 'pizza') {
    // PIZZA & ITALIAN RESTAURANT MENU
    items = [
      {
        id: 'pizza-1',
        name: 'بيتزا مارجريتا نابولي أفران حطب (حجم لارج)',
        category: 'بيتزا إيطالية كلاسيكية',
        priceEgp: 135,
        costEgp: 42,
        unit: 'للبيتزا',
        description: 'صلصة طماطم سان مارزانو، جبنة موتزاريلا إيطالية طازجة، أوراق ريحان فريش، وزيت زيتون بكر.',
        inclusions: ['عجينة مخمرة 48 ساعة', 'جبنة إيطالية أصلية'],
        popular: true,
      },
      {
        id: 'pizza-2',
        name: 'بيتزا بيبروني وسجق إيطالي دبل تشيز (حجم لارج)',
        category: 'بيتزا لحوم وأجبان',
        priceEgp: 175,
        costEgp: 58,
        unit: 'للبيتزا',
        description: 'شرائح بيبروني مقرمشة على أطراف الفرن الحجري مع جبنة موتزاريلا وشيدر حمراء وصوص باربيكيو.',
        inclusions: ['دبل تشيز', 'صوص رانش جانبي'],
        popular: true,
      },
      {
        id: 'pizza-3',
        name: 'بيتزا كواترو فورماجي (4 أجبان إيطالية فاخرة)',
        category: 'بيتزا أجبان خاصة',
        priceEgp: 165,
        costEgp: 54,
        unit: 'للبيتزا',
        description: 'مزيج فاخر من الموتزاريلا، الجورجونزولا، البارميزان، والريكوتا الذائبة مع لمسة عسل خفيفة.',
        inclusions: ['4 أجبان فاخرة'],
        popular: true,
      },
      {
        id: 'pizza-4',
        name: 'باستا ألفريدو دجاج ومشروم بالكريمة والبارميزان',
        category: 'باستا ومكرونات إيطالية',
        priceEgp: 140,
        costEgp: 45,
        unit: 'للطبق',
        description: 'فيتوتشيني طازجة مع قطع صدور دجاج مشوية ومشروم فريش في صوص الكريمة الإيطالية الغنية.',
        inclusions: ['خبز بالثوم والجبنة مجاناً'],
        popular: true,
      },
      {
        id: 'pizza-5',
        name: 'أصابع موتزاريلا مقرمشة مع صوص مارينارا (5 قطع)',
        category: 'مقبلات وسلطات إيطالية',
        priceEgp: 70,
        costEgp: 22,
        unit: 'للطبق',
        description: 'أصابع جبنة موتزاريلا ذهبية مقرمشة من الخارج وذائبة ومطاطية من الداخل.',
        inclusions: ['صوص مارينارا طازج'],
        popular: false,
      },
      {
        id: 'pizza-6',
        name: 'سلطة سيزر بالدجاج المشوي والخبز المحمص والبارميزان',
        category: 'مقبلات وسلطات إيطالية',
        priceEgp: 85,
        costEgp: 26,
        unit: 'للطبق',
        description: 'خس كابوتشا فريش مع صوص السيزر الأصلي وشرائح دجاج مشوية ومبشور جبنة بارميزان.',
        inclusions: ['صوص سيزر أصلي'],
        popular: false,
      },
      {
        id: 'pizza-7',
        name: 'حلو: تيراميسو إيطالي أصيل بجبنة الماسكاربوني',
        category: 'حلويات إيطالية',
        priceEgp: 75,
        costEgp: 24,
        unit: 'للقطعة',
        description: 'بسكويت ليدي فينجر مغمس في قهوة الإسبريسو مع طبقات ماسكاربوني غنية ورشة كاكاو خام.',
        inclusions: ['قهوة إسبريسو'],
        popular: false,
      },
      {
        id: 'pizza-8',
        name: 'مشروب غازي لتر عائلي أو صودا إيطالية فريش',
        category: 'مشروبات',
        priceEgp: 30,
        costEgp: 15,
        unit: 'للعبوة',
        description: 'مشروبات غازية مثلجة ومنعشة تناسب وجبات ولمات البيتزا.',
        inclusions: [],
        popular: false,
      },
    ];
  } else if (industry === 'street-food') {
    // EGYPTIAN STREET FOOD & POPULAR EATERIES MENU (Kebda, Sugok, Hawawshi, etc.)
    items = [
      {
        id: 'food-1',
        name: 'ساندوتش كبدة إسكندراني بالردة والفلفل الحار والليمون',
        category: 'ساندوتشات كبدة بلدي',
        priceEgp: 38,
        costEgp: 14,
        unit: 'للساندوتش',
        description: 'كبدة بلدي طازجة مقطعة شرائح رفيعة ومتبلة بالثوم والكمون والفلفل الحار في عيش بلدي مقرمش.',
        popular: true,
      },
      {
        id: 'food-2',
        name: 'ساندوتش سجق بلدي شرقي بالخلطة والبصل والطماطم',
        category: 'ساندوتشات سجق بلدي',
        priceEgp: 42,
        costEgp: 16,
        unit: 'للساندوتش',
        description: 'سجق بلدي محشو باللحمة المفرومة والبهارات الشرقية الأصيلة على نار الصاج مع صوص طماطم فريش.',
        popular: true,
      },
      {
        id: 'food-3',
        name: 'رغيف حواوشي بلدي مخصوص مشوي ع الفحم',
        category: 'حواوشي بلدي',
        priceEgp: 48,
        costEgp: 18,
        unit: 'للرغيف الكامل',
        description: 'رغيف عيش بلدي محشو باللحمة البلدي المتبلة واللية الضاني والفلفل الأخضر ومشوي مقرمش ع الفحم.',
        popular: true,
      },
      {
        id: 'food-4',
        name: 'ساندوتش مكس الحارة (كبدة وسجق معاً بالدقة)',
        category: 'ساندوتشات مميزة',
        priceEgp: 45,
        costEgp: 17,
        unit: 'للساندوتش',
        description: 'المكس الأكثر طلباً للأكيلة: كبدة إسكندراني مع سجق بلدي على الصاج مع رشة طحينة ودقة ثوم.',
        popular: true,
      },
      {
        id: 'food-5',
        name: 'طاجن كبدة إسكندراني بالصلصة والصلصة الحارة',
        category: 'طواجن وأطباق',
        priceEgp: 85,
        costEgp: 32,
        unit: 'للطاجن',
        description: 'طاجن فخار ساخن من الفرن مليان كبدة بلدي بصلصة طماطم مسبكة وفلفل حار مع 3 أرغفة بلدي.',
        popular: false,
      },
      {
        id: 'food-6',
        name: 'باكت بطاطس مقلية ذهبية بدقة الكمون والشطة',
        category: 'مقبلات وسلطات',
        priceEgp: 20,
        costEgp: 6,
        unit: 'للباكت',
        description: 'بطاطس فريش مقرمشة مقلية في زيت نقي مع رشة دقة بلدي حامية وخل ولمون.',
        popular: false,
      },
      {
        id: 'food-7',
        name: 'طبق سلطة بلدي طازجة + طحينة بالخل والثوم',
        category: 'مقبلات وسلطات',
        priceEgp: 12,
        costEgp: 4,
        unit: 'للطلب',
        description: 'سلطة خضراء بلدية بمية السلطة المشطشطة مع طحينة بيضاء خام بالليمون والكمون.',
        popular: false,
      },
      {
        id: 'food-8',
        name: 'كانز مشروب غازي مثلج متنوع',
        category: 'مشروبات',
        priceEgp: 15,
        costEgp: 10,
        unit: 'للعلبة',
        description: 'مشروبات غازية مثلجة تكمل أكلة الشارع وتعدل المزاج.',
        popular: false,
      },
    ];
  } else if (industry === 'restaurant' || industry === 'cafe') {
    // RESTAURANT / CAFE MENU ITEMS
    items = [
      {
        id: 'item-1',
        name: 'برجر بلدي فاخر دوبل جبنة وصوص خاص (150 جم)',
        category: 'أطباق وسندوتشات رئيسية',
        priceEgp: 145,
        costEgp: 55,
        unit: 'للساندوتش',
        description: 'لحم بقري بلدي طازج 100% مع شيدر مذابة وصوص الشيف السري وبطاطس.',
        popular: true,
      },
      {
        id: 'item-2',
        name: 'طبق ميكس جريل مشويات مشكلة مع أرز بسمتي',
        category: 'أطباق وسندوتشات رئيسية',
        priceEgp: 220,
        costEgp: 85,
        unit: 'للوجبة',
        description: 'كباب وكفتة وشيش طاووق متبل على الفحم مع خضار مشوي وطحينة وخبز طازج.',
        popular: true,
      },
      {
        id: 'item-3',
        name: 'وجبة عائلية كومبو (4 وجبات + بطاطس حجم كبير + لتر كولا)',
        category: 'عروض كومبو عائلية',
        priceEgp: 450,
        costEgp: 165,
        unit: 'للوجبة العائلية',
        description: 'العرض الأوفر والأكثر طلباً للتجمعات العائلية والأصدقاء مع صوصات منوعة.',
        popular: true,
      },
      {
        id: 'item-4',
        name: 'طبق مقبلات كريسبي مع 3 صوصات فاخرة',
        category: 'مقبلات وإضافات',
        priceEgp: 75,
        costEgp: 24,
        unit: 'للطبق',
        description: 'أصابع موتزاريلا، حلقات بصل، وأجنحة دجاج مقرمشة مع رانش وباربيكيو.',
        popular: false,
      },
      {
        id: 'item-5',
        name: 'قهوة مختصة فلات وايت / سبانيش لاتيه بوبا',
        category: 'مشروبات ساخنة وباردة',
        priceEgp: 55,
        costEgp: 16,
        unit: 'للكوب',
        description: 'حبوب بن كولومبي فاخر محمصة بعناية مع حليب طازج مكثف ومتبل.',
        popular: false,
      },
      {
        id: 'item-6',
        name: 'كيك لافا شوكولاتة بلجيكية مع بولة آيس كريم فانيليا',
        category: 'حلويات وتحلية',
        priceEgp: 65,
        costEgp: 20,
        unit: 'للقطعة',
        description: 'كيك دافئ ينبض بالشوكولاتة السائلة مع آيس كريم فانيليا غني وكراميل.',
        popular: false,
      },
    ];
  } else if (industry === 'fashion' || industry === 'beauty') {
    // PRODUCTS / RETAIL ITEMS
    items = [
      {
        id: 'prod-1',
        name: 'القطعة الأساسية الأكثر طلباً من المجموعة الجديدة',
        category: 'المجموعة الأساسية',
        priceEgp: 480,
        costEgp: 160,
        unit: 'للقطعة',
        description: 'مصنوعة من خامات فاخرة عالية التحمل بتصميم عصري وألوان الهوية المعتمدة.',
        popular: true,
      },
      {
        id: 'prod-2',
        name: 'باقة الإطلالة أو العناية المتكاملة (Total Care Bundle)',
        category: 'باقات مجمعة',
        priceEgp: 890,
        costEgp: 310,
        unit: 'للمجموعة',
        description: 'تجميعة متناسقة توفر للعميل وفرة حقيقية 25% مع حقيبة قماشية مجانية.',
        popular: true,
      },
      {
        id: 'prod-3',
        name: 'إكسسوار تكميلي عالي الهامش الربحي',
        category: 'إكسسوارات تكميلية',
        priceEgp: 180,
        costEgp: 45,
        unit: 'للقطعة',
        description: 'عنصر إضافي جذاب يُعرض عند نقطة الدفع لرفع متوسط قيمة السلة الشرائية.',
        popular: false,
      },
      {
        id: 'prod-4',
        name: 'صندوق الهدايا الملكي VIP المغلف بالألوان الرسمية',
        category: 'هدايا ومناسبات',
        priceEgp: 1450,
        costEgp: 520,
        unit: 'للصندوق',
        description: 'تغليف فاخر بشريط ساتان وبطاقة إهداء مخصصة يصلح للإهداء والمناسبات الخاصة.',
        popular: false,
      },
    ];
  } else {
    // GENERAL SERVICES
    items = [
      {
        id: 'item-1',
        name: 'الخدمة / الاستشارة الفردية الأساسية',
        category: 'خدمات فردية',
        priceEgp: 350,
        costEgp: 100,
        unit: 'للخدمة',
        description: 'تنفيذ احترافي مباشر للمتطلب الأساسي للعميل مع تقرير موجز.',
        popular: true,
      },
      {
        id: 'item-2',
        name: 'تنفيذ متكامل وشامل للمشروع أو الطلب',
        category: 'حلول متكاملة',
        priceEgp: 950,
        costEgp: 280,
        unit: 'للطلب الكامل',
        description: 'الخيار الأكثر توازناً وطلباً الذي يغطي كافة الاحتياجات مع ضمان ذهبي.',
        popular: true,
      },
      {
        id: 'item-3',
        name: 'تعاقد أو متابعة استشارية شهرية مستمرة',
        category: 'تعاقدات دورية',
        priceEgp: 2800,
        costEgp: 750,
        unit: 'شهرياً',
        description: 'دعم دوري وأولوية تنفيذ مع تخصيص مدير متابعة مخصص.',
        popular: false,
      },
    ];
  }

  // Tiered Packages for Subscription / Package View
  const tier1Price = Math.max(150, Math.round(baseVar * 2));
  const tier2Price = Math.round(tier1Price * 2.3);
  const tier3Price = Math.round(tier1Price * 4.8);

  let tiers: PricingTier[] = [];

  if (industry === 'koshary-food') {
    tiers = [
      {
        id: 'tier-1',
        title: 'وجبة الكشري الفردية السريعة (علبة مخصوص + دقة وشطة + حلو)',
        targetAudience: 'الطلبة والموظفون وعشاق الكشري للغداء السريع المشبع.',
        inclusions: [
          'علبة كشري ميكس مخصوص ساخنة مع تقلية وفيرة',
          'كيس دقة توم وخل وكيس شطة زيت حامية',
          'عبوة صلصة مسبكة إضافية مجاناً',
          'طبق أرز باللبن بلدي للتحلية',
        ],
        priceEgp: 65,
        billingUnit: 'للوجبة',
        rationale: 'وجبة غداء اقتصادية متكاملة تشبع الفرد وتلبي رغبته في التحلية فوراً.',
        variableCostEgp: 22,
      },
      {
        id: 'tier-2',
        title: 'كومبو الأكيل (علبة سوبر + طاجن فرن + كانز + حلو قنبلة)',
        targetAudience: 'الأكيلة ومحبو التنوع بين الكشري وطواجن الفرن الساخنة.',
        inclusions: [
          'علبة كشري سوبر دبل بالتقلية المقرمشة',
          'طاجن مكرونة فرن باللحمة المفرومة البلدي والصلصة',
          'كانز مشروب غازي مثلج يبل الريق',
          'طبق قنبلة الكشري (أرز باللبن وكنافة وبسبوسة)',
          'دقة وشطة زيادة ومخلل مشكل',
        ],
        priceEgp: 145,
        billingUnit: 'للكومبو (فردين)',
        rationale: 'الأكثر مبيعاً، يجمع بين متعة الكشري ودسامة طاجن الفرن بهامش ربح مجزٍ.',
        variableCostEgp: 50,
      },
      {
        id: 'tier-3',
        title: 'صينية لمة العيلة (4 علب كشري + 2 طاجن فرن + 4 حلو + لتر كولا)',
        targetAudience: 'العائلات والتجمعات ولمة الأصحاب في العمل والويك إند.',
        inclusions: [
          '4 علب كشري ميكس حجم كبير مخدومة بالعدس والحمص',
          '2 طاجن فرن مشكل (لحمة مفرومة وفراخ بالموتزاريلا)',
          '4 أطباق أرز باللبن فرن بالقشطة والمكسرات',
          'زجاجة لتر كولا عائلية مثلجة',
          'باكت عيش مقلي بالدقة وبصل مقرمش إضافي',
        ],
        priceEgp: 320,
        billingUnit: 'للصينية العائلية (4-5 أفراد)',
        rationale: 'تعظيم متوسط قيمة الفاتورة وتقديم عرض عائلي مغرٍ وأوفر بنسبة 25% من الشراء الفردي.',
        variableCostEgp: 110,
      },
    ];
  } else if (industry === 'foul-falafel') {
    tiers = [
      {
        id: 'tier-1',
        title: 'باقة الفطار السريع الفردية (2 ساندوتش فلافل محشية + ساندوتش فول + كانز)',
        targetAudience: 'الموظفون والطلبة والباحثون عن فطار بلدي سخن مشبع ومقرمش في بداية اليوم.',
        inclusions: [
          '2 ساندوتش فلافل محشية بصل وشطة وسمسم سخنة',
          'ساندوتش فول مدمس زبدة بالزيت الحار والليمون',
          'باكت بطاطس محمرة مع دقة كمون وملح',
          'كانز مشروب غازي مثلج أو شاي بلدي بالنعناع',
          'مخلل مشكل وطحينة بيضاء داخل الساندوتش',
        ],
        priceEgp: 38,
        billingUnit: 'للوجبة الفردية',
        rationale: 'سعر اقتصادي مغرٍ يشجع على الشراء اليومي المتكرر بأعلى معدل دوران.',
        variableCostEgp: 13,
      },
      {
        id: 'tier-2',
        title: 'باقة لَمّة الشغل والأكيلة (علبة فول مشكل + 12 قرص فلافل + تحابيش + 6 عيش)',
        targetAudience: 'زملاء العمل، الأصدقاء، والجمهور الباحث عن فطار جماعي سخن مخدوم.',
        inclusions: [
          'علبة فول مدمس عائلي بالسمنة البلدي وطشة الثوم',
          '12 قرص فلافل مقرمشة بالسمسم مقلية طازجة',
          'طبق باذنجان مخلل بالخل والثوم وفلفل حار',
          'علبة سلطة طحينة خام خضراء ومخلل مشكل',
          '6 أرغفة عيش بلدي مقمر سخن',
        ],
        priceEgp: 85,
        billingUnit: 'للباقة (3-4 أفراد)',
        rationale: 'الباقة الأكثر طلباً في أوقات الصباح، تحقق أعلى هامش مساهمة وتوفر 20% للزبائن.',
        variableCostEgp: 28,
      },
      {
        id: 'tier-3',
        title: 'صينية العيلة الكبيرة وعزومة الصحاب (قدرة فول + 25 فلافل + بطاطس وتحابيش)',
        targetAudience: 'العائلات في إجازة الجمعة ولمة الأهل والأفراح والمناسبات الشعبية.',
        inclusions: [
          'قدرة فول مدمس سوبر بالسمنة والتحابيش تكفي العائلة',
          '25 قرص فلافل مقرمشة محشية وسادة بالسمسم',
          'طبقين بطاطس مقلية ذهبية بدقة الكمون',
          'أطباق باذنجان مخلل وسلطة خضراء وطحينة خام',
          '15 رغيف بلدي ساخن من الفرن',
        ],
        priceEgp: 165,
        billingUnit: 'للصينية العائلية (6-8 أفراد)',
        rationale: 'تعظيم قيمة الفاتورة وترسيخ البراند كوجهة أولى للمناسبات والفطور العائلي المصري الأصيل.',
        variableCostEgp: 55,
      },
    ];
  } else if (industry === 'pizza') {
    tiers = [
      {
        id: 'tier-1',
        title: 'كومبو البيتزا الفردي (بيتزا ميديوم نابولي + بطاطس ودجز + كانز)',
        targetAudience: 'وجبة سريعة ومميزة للطلبة والموظفين ومحبي البيتزا الحقيقية.',
        inclusions: [
          'بيتزا ميديوم نابولي من اختيارك (مارجريتا أو رانش دجاج)',
          'باكت بطاطس ودجز متبلة بالأعشاب الإيطالية',
          'كانز مشروب غازي مثلج',
          'صوص رانش أو باربيكيو إضافي مجاناً',
        ],
        priceEgp: 125,
        billingUnit: 'للوجبة الفردية',
        rationale: 'سعر دخول تنافسي جداً يشجع على تجربة الفرن الحجري وتكرار الطلب.',
        variableCostEgp: 42,
      },
      {
        id: 'tier-2',
        title: 'عرض الدبل الإيطالي (2 بيتزا لارج + مقبلات أصابع موتزاريلا + لتر كولا)',
        targetAudience: 'الأصدقاء والثنائيات ومحبو البيتزا الغنية بالجبنة المطاطية.',
        inclusions: [
          '2 بيتزا لارج إيطالية (بيبروني دبل تشيز وكواترو فورماجي)',
          'طبق أصابع موتزاريلا مقرمشة (5 قطع) مع صوص مارينارا',
          'زجاجة لتر كولا مثلجة',
          'خبز بالثوم والأعشاب مجاناً',
        ],
        priceEgp: 295,
        billingUnit: 'للعرض (فردين - 3 أفراد)',
        rationale: 'الأكثر مبيعاً، يحقق رضا العملاء بأوفر سعر مقارنة بالسوق.',
        variableCostEgp: 98,
      },
      {
        id: 'tier-3',
        title: 'وليمة البيتزا والباستا العائلية (3 بيتزا لارج + باستا ألفريدو + حلو تيراميسو)',
        targetAudience: 'العائلات والتجمعات الكبرى ولمة الويك إند وأعياد الميلاد.',
        inclusions: [
          '3 بيتزا لارج فاخرة بعجينة نابولية مخمرة',
          'طبق عائلي كبير باستا ألفريدو دجاج ومشروم بالكريمة',
          'طبق مقبلات إيطالية مشكل (موتزاريلا، حلقات بصل، جوانح)',
          'طبقين حلو تيراميسو إيطالي أصلي بالماسكاربوني',
          '2 زجاجة لتر مشروب غازي',
        ],
        priceEgp: 550,
        billingUnit: 'للوليمة العائلية (5-6 أفراد)',
        rationale: 'باقة متكاملة ترفع متوسط الفاتورة وتقدم تجربة مطعم إيطالي راقٍ في المنزل.',
        variableCostEgp: 185,
      },
    ];
  } else if (industry === 'street-food' || industry === 'restaurant') {
    tiers = [
      {
        id: 'tier-1',
        title: 'وجبة الأكيل الفردية (ساندوتشين + بطاطس + كانز)',
        targetAudience: 'الزبون الفردي، الطلبة، والموظفون الباحثون عن وجبة سريعة ومشبعة بسعر اقتصادي عادل.',
        inclusions: [
          '2 ساندوتش كبدة إسكندراني أو سجق بلدي سخن من ع الصاج',
          'باكت بطاطس مقلية مقرمشة بالدقة والبهارات',
          'عبوة سلطة طحينة بلدي ومخلل مشكل',
          'كانز مشروب غازي مثلج حسب الاختيار',
          'تغليف حراري فويل يحافظ على سخونة الساندوتش',
        ],
        priceEgp: tier1Price,
        billingUnit: 'للوجبة الفردية',
        rationale: 'وجبة افتتاحية مغرية وسعر في متناول اليد لتجربة جودة الخلطة وتشجيع تكرار الزيارة.',
        variableCostEgp: baseVar,
      },
      {
        id: 'tier-2',
        title: 'كومبو لمة الصحاب (5 سندوتشات + لتر كانز + بطاطس وطحينة)',
        targetAudience: 'الأصدقاء في الخروجات، موظفو المكاتب والشركات، وتجمعات الغداء السريعة.',
        inclusions: [
          '5 سندوتشات مشكلة (كبدة، سجق، حواوشي) حسب رغبة الزبون',
          '2 باكت بطاطس مقلية بالدقة البلدي',
          'طبق طحينة كبير وباذنجان مخلل بالثوم والليمون',
          'زجاجة لتر مشروب غازي عائلي مثلج',
          'توصيل سريع في بوكس حراري مغلق بعناية',
        ],
        priceEgp: tier2Price,
        billingUnit: 'لكومبو اللمة (تكفي 2-3 أفراد)',
        rationale: 'الباقة الأكثر طلباً ومبيعاً، توفر وجبة مشبعة وموفرة لمجموعات الأصدقاء بهامش ربح ممتاز.',
        variableCostEgp: Math.round(baseVar * 1.6),
      },
      {
        id: 'tier-3',
        title: 'صينية الحارة العائلية (10 سندوتشات + صينية مشكل كاملة)',
        targetAudience: 'عزومات البيوت، التجمعات العائلية، وسهرات العمل وسهرات نهاية الأسبوع.',
        inclusions: [
          '10 سندوتشات فاخرة أو صينية مشكل كبدة وسجق وحواوشي ولحمة بلدي',
          'سرفيس بطاطس عائلي كبير بالدقة وسلطة خضراء وطحينة بالليمون',
          '2 زجاجة لتر مشروب غازي عائلي',
          'باكت مخللات مشكلة وطماطم متبلة بالخل والثوم',
          'خدمة توصيل مجاني سريع مع علب تغليف فاخرة للتقديم المباشر',
        ],
        priceEgp: tier3Price,
        billingUnit: 'للصينية العائلية الكبرى (تكفي 5-6 أفراد)',
        rationale: 'باقة العزومات الكبرى التي ترفع متوسط قيمة الفاتورة وتثبت البراند كخيار أول في المناسبات.',
        variableCostEgp: Math.round(baseVar * 2.8),
      },
    ];
  } else if (industry === 'cafe') {
    tiers = [
      {
        id: 'tier-1',
        title: 'كومبو المزاج الصباحي (قهوة سبيشالتي + مخبوزات طازجة)',
        targetAudience: 'الموظفون وعشاق القوة الصباحية الباحثون عن بداية يوم راقية وسريعة.',
        inclusions: [
          'كوب قهوة أمريكانو أو لاتيه أو فلات وايت من بن مختص',
          'قطعة كرواسون زبدة فرنسي أو كوكيز طازة مخبوزة يومياً',
          'تغليف تيك أواي حراري فاخر مع حامل أكواب',
        ],
        priceEgp: tier1Price,
        billingUnit: 'للكومبو الصباحي',
        rationale: 'سعر ترويجي يضمن تدفق الزبائن اليومي في ساعات الصباح الباكر.',
        variableCostEgp: baseVar,
      },
      {
        id: 'tier-2',
        title: 'عرض جلسة العمل والمذاكرة (مشروبين + سناك + مقعد هادئ)',
        targetAudience: 'الطلاب ورواد الأعمال والعمل الحر (Freelancers) الباحثون عن مساحة مريحة وتركيز.',
        inclusions: [
          'مشروبان من القائمة (ساخن أو مثلج) خلال فترة الجلسة',
          'سناك خفيف ومياه معدنية مجانية',
          'واي فاي فائق السرعة مع مقابس كهرباء قريبة وموسيقى مريحة',
        ],
        priceEgp: tier2Price,
        billingUnit: 'للجلسة المتكاملة',
        rationale: 'استثمار أمثل لمساحة المقهى في الأوقات الهادئة وزيادة متوسط إنفاق الزائر.',
        variableCostEgp: Math.round(baseVar * 1.6),
      },
      {
        id: 'tier-3',
        title: 'اشتراك المزاج الشهري (كارت قهوة يومية بخصم 30%)',
        targetAudience: 'الزبائن الأوفياء واليوميون الذين يعتبرون المقهى محطتهم الصباحية الدائمة.',
        inclusions: [
          '30 كوب قهوة شهرياً من اختيار المشترك',
          'خصم 20% دائم على جميع المخبوزات والحلويات',
          'كوب حراري مخصص يحمل شعار البراند هدية مع أول اشتراك',
          'أولوية استلام سريعة بدون انتظار في الطابور',
        ],
        priceEgp: tier3Price,
        billingUnit: 'شهرياً / للعضوية المميزة',
        rationale: 'باقة توفر تدفقاً نقدياً ثابتاً مقدماً وتضمن ولاءً مطلقاً للعميل طوال العام.',
        variableCostEgp: Math.round(baseVar * 2.8),
      },
    ];
  } else if (
    idea.includes('أشعة') ||
    idea.includes('اشعة') ||
    idea.includes('رنين') ||
    idea.includes('سونار') ||
    idea.includes('سكان') ||
    idea.includes('radiology') ||
    idea.includes('imaging')
  ) {
    tiers = [
      {
        id: 'tier-1',
        title: 'باقة الفحص السريع والاطمئنان (أشعة رقمية + تقرير فوري)',
        targetAudience: 'المراجعون الباحثون عن فحص عاجل ودقيق لحالات الطوارئ والكسور وآلام الصدر.',
        inclusions: [
          'تصوير أشعة سينية رقمية X-Ray للصدر أو العظام',
          'تقرير طبي معتمد من استشاري الأشعة خلال 30 دقيقة',
          'فيلم ديجيتال ليزر عالي الدقة ونسخة على الواتساب',
          'استشارة فنية لتوضيح نتائج الفحص',
        ],
        priceEgp: 350,
        billingUnit: 'للفحص السريع',
        rationale: 'سعر اقتصادي منافس يجذب الحالات اليومية الطارئة ورواد العيادات المجاورة.',
        variableCostEgp: 65,
      },
      {
        id: 'tier-2',
        title: 'باقة الفحص التخصصي الشامل (سونار تفصيلي + دوبلر)',
        targetAudience: 'المرضى والمراجعات الراغبون في تشخيص دقيق للبطن والحوض أو متابعة الحمل بالأبعاد الثلاثية والرباعية.',
        inclusions: [
          'فحص سونار بالموجات فوق الصوتية لأعضاء البطن والحوض',
          'فحص دوبلر ملون لتدفق الدم والأوعية الدموية',
          'تقرير استشاري شامل مع صور توثيقية ملونة عالية النقاء',
          'خصم 15% على أي فحص إضافي للمتابعة خلال شهر',
        ],
        priceEgp: 850,
        billingUnit: 'للباقة التخصصية',
        rationale: 'الباقة الأكثر طلباً وتوازناً؛ تحقق أعلى رضا للمريض وهامش ربح مجزٍ للمركز.',
        variableCostEgp: 140,
      },
      {
        id: 'tier-3',
        title: 'باقة التشخيص المتكامل والاطمئنان العام VIP',
        targetAudience: 'الراغبون في مسح تشخيصي وقائي شامل وسيدات الحمل مع أولوية قصوى وبدون أي انتظار.',
        inclusions: [
          'فحص سونار رباعي الأبعاد 4D/5D للجنين أو فحص بطن وحوض شامل',
          'أشعة سينية رقمية للصدر والعظام مع فحص الغدة الدرقية بالسونار',
          'تقرير استشاري مفصل ومقابلة خاصة لمناقشة النتائج',
          'تسجيل فيديو رقمي وفلاشة كاملة بالفحوصات مع إرسال فوري للطبيب المعالج',
          'أولوية حجز مسبق واستقبال VIP في غرفة فحص خاصة',
        ],
        priceEgp: 1600,
        billingUnit: 'لبرنامج الفحص الشامل',
        rationale: 'برنامج متميز يعظم متوسط الفاتورة ويرسخ سمعة المركز كوجهة تشخيصية مرموقة في المنطقة.',
        variableCostEgp: 280,
      },
    ];
  } else if (industry === 'dental') {
    tiers = [
      {
        id: 'tier-1',
        title: 'باقة الفحص والوقاية السنوية لصحة الفم والأسنان',
        targetAudience: 'المرضى والمراجعون الجدد الراغبون في فحص وقائي دقيق بدون ألم.',
        inclusions: [
          'كشف إكلينيكي كامل وفحص دقيق لصحة الفم واللثة',
          'أشعة تشخيصية أولية مع تقرير رقمي مفصل للحالة',
          'خطة علاجية مخصصة مع شرح الخطوات والتكلفة بشفافية',
          'استشارة متابعة ميسرة بدون رسوم كشف إضافية لمدة شهر',
        ],
        priceEgp: tier1Price,
        billingUnit: 'للفحص الشامل',
        rationale: 'تسعير كشف تمهيدي يكسر تردد المريض ويبني علاقة ثقة طبية متينة من أول زيارة.',
        variableCostEgp: baseVar,
      },
      {
        id: 'tier-2',
        title: 'باقة الرعاية والابتسامة المشرقة',
        targetAudience: 'المرضى الباحثون عن تنظيف احترافي وإزالة التصبغات والوقاية الدورية.',
        inclusions: [
          'جلسة تنظيف جير بالموجات فوق الصوتية وتلميع الأسنان',
          'إزالة التصبغات السطحية وتطبيق جلسة فلورايد واقية',
          'حقيبة عناية منزلية مجانية مع معجون متخصص وفرشاة طبية',
          'خصم 15% على أي إجراء علاجي تالٍ خلال 3 أشهر',
        ],
        priceEgp: tier2Price,
        billingUnit: 'لجلسة العناية والتلميع',
        rationale: 'الباقة الأكثر طلباً للمحافظة على ابتسامة صحية وناصعة بدون أي إجراءات جراحية.',
        variableCostEgp: Math.round(baseVar * 1.6),
      },
      {
        id: 'tier-3',
        title: 'باقة النخبة والابتسامة المتكاملة VIP',
        targetAudience: 'الراغبون في تحول جذري للابتسامة مع متابعة شخصية ورعاية استثنائية.',
        inclusions: [
          'جلسة تبييض ليزر متطورة مع نتائج فورية ملحوظة',
          'قوالب تبييض منزلية مخصصة للحفاظ على النتيجة',
          'متابعة دورية مجانية لمدة عام كامل مع الطبيب المختص',
          'أولوية حجز VIP ومواعيد مرنة خالية من أي انتظار',
        ],
        priceEgp: tier3Price,
        billingUnit: 'لبرنامج الابتسامة الشامل',
        rationale: 'البرنامج التجميلي المتكامل للراغبين في نتيجة استثنائية مع ميزة متابعة مجانية تمنح العيادة سمعة طيبة.',
        variableCostEgp: Math.round(baseVar * 2.8),
      },
    ];
  } else if (industry === 'medical' || idea.includes('عيادة') || idea.includes('مستشفى') || idea.includes('طبي')) {
    tiers = [
      {
        id: 'tier-1',
        title: 'باقة الكشف الطبي والاستشارة الأساسية',
        targetAudience: 'المراجعون الجدد وحالات الكشف والمتابعة الدورية.',
        inclusions: [
          'كشف إكلينيكي شامل وتشخيص دقيق مع الاستشاري',
          'قياس العلامات الحيوية والسكر وضغط الدم',
          'خطة علاجية مخصصة مع وصفة إلكترونية مفصلة',
          'استشارة متابعة مجانية خلال 14 يوماً من الكشف',
        ],
        priceEgp: 300,
        billingUnit: 'للكشف والاستشارة',
        rationale: 'سعر مناسب يكسر حاجز التردد ويجذب المرضى في المنطقة.',
        variableCostEgp: 50,
      },
      {
        id: 'tier-2',
        title: 'باقة المتابعة والفحص الطبي الدوري الشامل',
        targetAudience: 'أصحاب الأمراض المزمنة والعائلات الباحثة عن متابعة صحية منتظمة.',
        inclusions: [
          'كشفان تخصصيان مع استشاريين مختلفين',
          'فحوصات معملية روتينية شاملة (صورة دم، سكر تراكمي، وظائف كلى وكبد)',
          'تقرير طبي متكامل يشرح الحالة وتطورها',
          'أولوية حجز المواعيد واستشارة هاتفية ميسرة',
        ],
        priceEgp: 750,
        billingUnit: 'للباقة الشهرية/الدورية',
        rationale: 'باقة متوازنة تضمن ولاء المرضى وتوفر متابعة مستمرة.',
        variableCostEgp: 180,
      },
      {
        id: 'tier-3',
        title: 'باقة الرعاية الصحية العائلية المتكاملة VIP',
        targetAudience: 'العائلات وكبار السن الراغبون في رعاية طبية مستمرة وأولوية قصوى.',
        inclusions: [
          'ملف طبي عائلي متكامل يغطي حتى 4 أفراد من الأسرة',
          'فحوصات دورية شاملة ومتابعة منزلية للحالات الخاصة',
          'خط اتصال مباشر مع الأطباء للاستشارات العاجلة 24/7',
          'خصم 20% دائم على كافة الإجراءات والخدمات التخصصية',
        ],
        priceEgp: 2000,
        billingUnit: 'للعضوية العائلية الشهرية',
        rationale: 'تعظيم القيمة المضافة وتوفير تدفق دخل دوري مستقر ومستمر للمركز.',
        variableCostEgp: 450,
      },
    ];
  } else {
    tiers = [
      {
        id: 'tier-1',
        title: 'باقة البداية والتجربة الأولى الأساسية',
        targetAudience: 'العملاء الجدد الراغبون في اختبار جودة الخدمة أو المنتج بسهولة وأمان.',
        inclusions: [
          'الخدمة الأساسية المتكاملة المنفذة بأعلى معايير الإتقان',
          'متابعة مباشرة وسريعة للرد على الاستفسارات',
          'كود خصم 15% على الطلب التالي',
          'توصيل سريع وتغليف آمن ومحكم',
        ],
        priceEgp: tier1Price,
        billingUnit: 'للباقة الأساسية',
        rationale: 'تسعير ميسر يكسر حاجز التردد ويجعل تجربة البراند في متناول الشريحة المستهدفة.',
        variableCostEgp: baseVar,
      },
      {
        id: 'tier-2',
        title: 'باقة التميز الأكثر طلباً وتوفيراً',
        targetAudience: 'العملاء الباحثون عن أفضل عائد وقيمة شاملة تغطي كافة احتياجاتهم.',
        inclusions: [
          'كافة مميزات باقة البداية مع إضافات ومزايا نوعية',
          'هدية مرفقة أو ترقية فورية للخدمة مجاناً',
          'أولوية تنفيذ وتسليم فورية',
          'دعم ومتابعة مخصصة لضمان الرضا الكامل',
        ],
        priceEgp: tier2Price,
        billingUnit: 'للباقة المتكاملة',
        rationale: 'الباقة المتوازنة الأكثر مبيعاً التي توفر أفضل توازن بين التكلفة والقيمة الملموسة.',
        variableCostEgp: Math.round(baseVar * 1.6),
      },
      {
        id: 'tier-3',
        title: 'باقة النخبة الشاملة VIP',
        targetAudience: 'العملاء الدائمون والباحثون عن تجربة متكاملة وخاصة بأعلى مستويات الجودة.',
        inclusions: [
          'تنفيذ كامل وشامل بمواصفات خاصة ومواد استثنائية',
          'متابعة واهتمام مباشر من الإدارة وفريق العمل',
          'تسهيلات حجز وتوصيل مجاني فوري طوال فترة التعامل',
          'مزايا حصرية وعروض خاصة غير معلنة للجمهور العام',
        ],
        priceEgp: tier3Price,
        billingUnit: 'للباقة الشاملة VIP',
        rationale: 'باقة تثبيت العلامة التجارية لدى شريحة كبار العملاء وتحقيق تدفق مالي مستقر.',
        variableCostEgp: Math.round(baseVar * 2.8),
      },
    ];
  }

  return {
    tiers,
    items,
    format,
    capitalFeasibility,
    assumptions: [
      `جميع الأسعار مقدرة بالجنيه المصري EGP ومصممة لتلائم القوة الشرائية في السوق المصري.`,
      `تم حساب التكلفة المتغيرة وهوامش المساهمة لضمان تغطية التكاليف التشغيلية الثابتة (${fixed.toLocaleString('en-US')} ج.م شهرياً).`,
      `يمكنك تخصيص وتعديل أي سعر أو إضافة بنود وحذفها بحرية تامة بنقرة واحدة.`,
    ],
    statusNote: `تم ضبط نموذج التسعير تلقائياً ليلائم "${analysis?.category || 'نشاطك التجاري'}" بهامش ربح تنافسي وصحي.`,
    fixedCostsEgp: fixed,
  };
}

// Generate 30 marketing days tailored specifically to the project domain
export function buildMarketingDays(idea: string, analysis: IdeaAnalysis): MarketingDay[] {
  const days: MarketingDay[] = [];
  const phases = [
    { name: 'الأسبوع 1: الإطلاق وبناء الوعي الخاطف', days: [1, 7] },
    { name: 'الأسبوع 2: تفعيل الطلبات الأولى والتجربة المباشرة', days: [8, 14] },
    { name: 'الأسبوع 3: بناء الثقة والتفاعل المجتمعي وآراء الزبائن', days: [15, 21] },
    { name: 'الأسبوع 4: تعزيز الولاء وتكرار الشراء والعزومات', days: [22, 28] },
    { name: 'الأيام 29-30: تقييم النتائج، احتفال الشهر الأول، والمفاجأة القادمة', days: [29, 30] },
  ];

  const ind = analysis.industryId;

  // 1. Street Food & Popular Restaurants (Kebda, Sugok, Hawawshi, etc.)
  if (ind === 'street-food' || ind === 'restaurant') {
    const foodPlans = [
      {
        obj: 'فيديو تشويقي: نار الصاج وطشة الثوم والخلطة البلدي',
        act: 'نشر فيديو ريلز مقرب لصوت طشة الكبدة البلدي ع الصاج مع تصاعد الدخان وعصرة الليمون ورشة الكمون',
        ch: 'انستجرام وتيك توك (Reels)',
        del: 'فيديو ريلز 20 ثانية بصوت الطشة الحقيقي (ASMR)',
        met: 'المشاهدات، الحفظ، ومعدل المشاركة مع الصحاب',
        explanation: 'شرح تنفيذي لريلز الطشة: البدء فوراً بأول 3 ثوانٍ على لقطة مقربة لصوت ونار الصاج بدون أي مقدمات طويلة. إظهار تقليب الكبدة الطازة مع الفلفل الأخضر الحامي ونزول عصرة الليمون. إنهاء الفيديو بظهور اسم المحل مع كابشن: "مين شَمّ الريحة من ورا الشاشة؟ مستنينكم في الافتتاح!". النشر بين 8 و 10 مساءً وقت الجوع وسهرة الأكيلة.',
      },
      {
        obj: 'عزومة الافتتاح: أول 50 ساندوتش هدية لتجربة الخلطة',
        act: 'طرح بوست عزومة حبايبنا وأهل المنطقة لأول 50 زائر يجربوا لقمة كبدة وسجق بلدي مجاناً',
        ch: 'فيسبوك ومجموعات المنطقة السكنية',
        del: 'تصميم بوست عزومة الافتتاح وتحديد موعد استقبال الزبائن',
        met: 'عدد التعليقات، الحضور الفعلي، وسرعة نفاد السندوتشات الـ 50',
        explanation: 'شرح تنفيذي لعزومة الافتتاح: تجهيز أول 50 ساندوتش بحجم مشبع وتوزيعها على أول زوار بعد العصر مباشرة. توزيع كارت بسيط مع كل ساندوتش فيه كود خصم 20% للطلب القادم ورقم الواتساب للطلبات. تصوير فرحة الزبائن باللقمة الأولى لتوثيق اليوم ونشره في الستوري.',
      },
      {
        obj: 'سر الصنعة: الكبدة البلدي الطازة اللي بنستلمها فجر ربنا',
        act: 'كاروسيل يوضح للزبون الفرق بين الكبدة البلدي الطازة والمجمدة وسر التتبيلة النضيفة والعيش السخن',
        ch: 'فيسبوك وانستجرام',
        del: 'كاروسيل من 4 صور يبرز جودة الخامات والنظافة',
        met: 'معدل الحفظ والمشاركات والتعليقات',
        explanation: 'شرح تنفيذي لكاروسيل الجودة: الشريحة الأولى صورة مقربة لرغيف كبدة بلدي طازج. الشرائح التالية توضح استلام الكبدة فريش يومياً، التقطيع اليدوي بحجم مظبوط، وعدم استخدام أي توابل تخفي الطعم، مع عيش بلدي مقرمش. ختام المنشور بدعوة لمقارنة الطعم بنفسك.',
      },
      {
        obj: 'عرض لمة الصحاب: 5 سندوتشات مع لتر بيبسي وبطاطس وطحينة',
        act: 'إطلاق كومبو اللمة الاقتصادي المخصص للصحاب ولمات الشغل وسهرات البيت',
        ch: 'واتساب وفيسبوك',
        del: 'بوست وصورة مشهية لكومبو الـ 5 سندوتشات مع زجاجة اللتر والبطاطس',
        met: 'عدد أوردرات الكومبو وقيمة المبيعات الإجمالية',
        explanation: 'شرح تنفيذي لعرض لمة الصحاب: تقديم كومبو يجمع 5 سندوتشات مشكلة مع 2 باكت بطاطس وطحينة وزجاجة لتر بيبسي بسعر موفر عن شراء كل صنف منفرداً. التركيز في البوست على سهولة الطلب والتوصيل السريع للمكاتب والبيوت في أقل من 30 دقيقة.',
      },
      {
        obj: 'استفتاء الأكيل: كبدة بالردة مقرمشة ولا إسكندراني مشوحة ع الصاج؟',
        act: 'طرح تصويت ستوري تفاعلي بين عشاق الردة وعشاق الصاج مع سحب على وجبتين مجاناً',
        ch: 'ستوري انستجرام وفيسبوك',
        del: 'ستوري استطلاع رأي (Poll) مع صورة كل صنف',
        met: 'نسبة التصويت والتفاعل والرسائل المباشرة',
        explanation: 'شرح تنفيذي للاستفتاء: نشر صورتين مشهيتين لصنفي الكبدة وطلب تصويت المتابعين، مع الإعلان عن اختيار اسمين عشوائياً من المشاركين للحصول على وجبة مجانية في زيارتهم القادمة. إعلان الفائزين في اليوم التالي يرفع التفاعل ويخلق ولاءً حقيقياً للمحل.',
      },
      {
        obj: 'كواليس المطبخ والنظافة: الصاج اللي بيلمع والتغليف الحراري',
        act: 'فيديو يوثق نظافة أدوات التحضير والتزام الشيف بالقفازات والزي الموحد ولف الساندوتش بالفويل',
        ch: 'تيك توك وانستجرام ريلز',
        del: 'فيديو كواليس 30 ثانية للنظافة والترتيب',
        met: 'معدل المشاهدة وزيادة الاطمئنان والثقة في التعليقات',
        explanation: 'شرح تنفيذي لفيديو النظافة: الأكل الشعبي يحتاج بناء ثقة مضاعفة في النظافة. إظهار مسح وتعقيم الصاج، ارتداء الشيف لليونيفورم والجوانتي، واستخدام أكياس ورقية نظيفة وورق فويل حراري محكم يثبت للزبون أن النظافة عندنا رقم 1 وليست مجرد كلام ترويجي.',
      },
      {
        obj: 'تحدي اللقمة الأولى: تصوير ردود أفعال الزبائن العفوية',
        act: 'تصوير لقطات سريعة لزبائن حقيقيين أثناء تذوق الساندوتش في المحل وانطباعهم الحقيقي',
        ch: 'ريلز وتيك توك وستوري',
        del: 'مقطع فيديو تجميعي لردود أفعال الزبائن مع موسيقى خفيفة',
        met: 'المشاركات والتفاعل والتعليقات الإيجابية',
        explanation: 'شرح تنفيذي لردود أفعال الزبائن: الاستئذان بلطف من بعض الزبائن المترددين لتصوير قطمتهم الأولى. الابتسامة التلقائية بعد أول قطمة هي أقوى إعلان يمكن نشره. نشر الفيديو مع تعليق: "اللقمة اللي بتنزل في القلب قبل المعدة.. منورين المحل يا أكيلة!".',
      },
      {
        obj: 'عزومة الجمعة ولمة الغداء: صينية المشكل العائلية للمة البيت',
        act: 'منشور غداء يوم الجمعة بعد الصلاة: صينية كبدة وسجق وحواوشي تسند لمة العيلة',
        ch: 'فيسبوك وواتساب',
        del: 'صورة صينية المشكل مع مخللات وطحينة وبطاطس',
        met: 'طلبات الغداء العائلية المسبقة قبل صلاة الجمعة',
        explanation: 'شرح تنفيذي لعزومة الجمعة: نشر العرض مساء الخميس وصباح الجمعة قبل الصلاة. فتح الحجز المسبق للتيك أواي والدليفري لتفادي ضغط ما بعد الصلاة مباشرة. توفير عيش بلدي وطحينة زيادة مجاناً مع كل صينية.',
      },
      {
        obj: 'سر التحبيشة: سلطة الطحينة الخام والباذنجان المخلل بالدقة والتوم',
        act: 'استعراض أصناف المخللات والطحينة والبتنجان المتبل بالخل والتوم اللي بيكملوا الطعم',
        ch: 'انستجرام وفيسبوك',
        del: 'صورة فوتوغرافية احترافية مقربة لأطباق المقبلات والتحبيشة',
        met: 'الإعجابات ومعدل الحفظ',
        explanation: 'شرح تنفيذي لبوست التحبيشة: الزبون الأكيل يهمه تفاصيل السلطة والمخلل زي الساندوتش بالظبط. إبراز لون الباذنجان المخلل الأحمر، ليمون مخلل معصفر، وطحينة سميكة مخدومة. الكابشن: "ساندوتش الكبدة ميكملش من غير دقة تفتح النفس!".',
      },
      {
        obj: 'دليفري سريع سخن بيولع: توصيل السندوتشات في ورق فويل يحفظ الحرارة',
        act: 'إعلان أرقام ومناطق الدليفري السريع مع كود توصيل مجاني لأول طلب في الحي',
        ch: 'فيسبوك ومجموعات المنطقة وجروبات الواتساب',
        del: 'إنفوجرافيك خريطة التوصيل وأرقام الهاتف والواتساب',
        met: 'المكالمات الهاتفية ورسائل الواتساب الواردة للطلب',
        explanation: 'شرح تنفيذي للدليفري السريع: إبراز رقم الواتساب المباشر للطلب برابط بنقرة واحدة (wa.me). توضيح أن الأوردر بيتغلف في أكياس فويل حرارية مخصصة عشان الساندوتش يوصل للزبون كأنه لسه نازل من ع الصاج حالا.',
      },
      {
        obj: 'شراكة وتجربة صانع محتوى محلي (فود بلوجر من أهل المنطقة)',
        act: 'دعوة فود بلوجر محلي موثوق يزور المحل، يقف قدام الصاج، ويدوق السندوتشات وينقل رأيه بأمانة',
        ch: 'تيك توك وانستجرام ريلز',
        del: 'فيديو تجربة كاملة ومراجعة صادقة للمنيو',
        met: 'حجم الزيارات الجديدة للملف الشخصي وزيادة المتابعين',
        explanation: 'شرح تنفيذي لزيارة الفود بلوجر: اختيار بلوجر محلي معروف بين أهالي الحي بمصداقيته وليس الحسابات الدعائية الزائفة. تركه يطلب بنفسه ما يشاء ويصور بحرية تامة دون تلقين. توفير كود خصم بسيط باسمه لمتابعيه لتتبع أثر الزيارة.',
      },
      {
        obj: 'منيو الحواوشي البلدي المقرمش وسندوتشات السجق الشرقي المتبل',
        act: 'تسليط الضوء على أصناف الحواوشي ع الصاج والفحم والسجق البلدي الغارق في التتبيلة',
        ch: 'انستجرام وفيسبوك',
        del: 'فيديو قصير لفتح رغيف الحواوشي وخروج البخار والجبنة السايحة',
        met: 'المشاهدات والتعليقات والطلبات على صنف الحواوشي',
        explanation: 'شرح تنفيذي لبوست الحواوشي: لقطة فتح الرغيف بنصفين مع صوت القرمشة الخارجية وسخونة اللحمة المتبلة من الداخل. التذكير بأن اللحمة بلدي 100% بدون أي دهون مصنعة، وتقديم طحينة ومخلل مع كل رغيف.',
      },
      {
        obj: 'رأي الزبون الصادق: مشاركة رسالة واتساب لزبون عجبته النظافة والطعم',
        act: 'نشر لقطة شاشة لرسالة شكر عفوية أرسلها زبون بعد استلام الأوردر',
        ch: 'ستوري انستجرام وفيسبوك',
        del: 'ستوري تقييم زبون حقيقي مع شكر شخصي له',
        met: 'التفاعل مع الستوري والمراسلات المباشرة',
        explanation: 'شرح تنفيذي لشهادات الزبائن: لقطات شاشة الواتساب العفوية ذات الكلام الحقيقي ("الكبدة كانت تحفة وسخنة جدا وتسلم إيدكم ع النظافة") تصنع ثقة أسرع بعشر مرات من أي تصميم إعلاني مبهرج. شكر الزبون علناً وإخفاء رقمه الشخصي للحفاظ على الخصوصية.',
      },
      {
        obj: 'مسابقة الأكيل: صور ساندوتشك مع الكانز واكسب وجبة مجانية',
        act: 'إطلاق مسابقة تصوير لأحلى صورة زبون مع ساندوتشه المفضل ومنشن لحساب المحل',
        ch: 'انستجرام وتيك توك',
        del: 'بوست إعلان شروط المسابقة البسيطة وجائزة 3 فائزين',
        met: 'محتوى الزبائن (UGC) والإشارات (Mentions)',
        explanation: 'شرح تنفيذي لمسابقة التصوير: شروط ميسرة جداً (صور ساندوتشك واعمل منشن للمحل في الستوري). كل نهاية أسبوع يتم اختيار 3 فائزين بوجبة مشكلة مجانية. هذا النشاط ينشر اسم المحل في حسابات مئات الأصدقاء بدون تكلفة إعلانية.',
      },
      {
        obj: 'عرض نص الأسبوع للطلبة والموظفين: وجبة سريعة ومشبعة بخصم خاص',
        act: 'طرح عرض يوم الثلاثاء والأربعاء: ساندوتشين + بطاطس + كانز بسعر ترويجي مخفض',
        ch: 'فيسبوك ومجموعات الكليات والشركات المجاورة',
        del: 'بوست العرض اليومي ورابط الطلب المباشر',
        met: 'أوردرات الغداء في منتصف الأسبوع',
        explanation: 'شرح تنفيذي لعرض منتصف الأسبوع: أيام منتصف الأسبوع تكون عادة أهدأ من العطلات. تقديم وجبة اقتصادية جاهزة خلال 5 دقائق للطلبة والموظفين يرفع المبيعات ويملأ ساعات الهدوء التشغيلي.',
      },
      {
        obj: 'كواليس التتبيلة: الكمون البلدي، الثوم الفريش، والخلطة المتوارثة',
        act: 'فيديو ريلز يبرز الشيف وهو يجهز الخلطة الطازجة والبهارات المطحونة يومياً',
        ch: 'ريلز وتيك توك',
        del: 'فيديو إعداد التتبيلة 25 ثانية مع موسيقى مصرية أصيلة',
        met: 'المشاهدات والحفظ والإعجاب بالصنعة',
        explanation: 'شرح تنفيذي لريلز التتبيلة: التركيز على حبات الكمون البلدي، الفلفل الأسود، دقة الثوم في الهون النحاسي، وعصير الليمون الأخضر. إيصال رسالة واضحة: الطعم الحلو وراه مقادير مظبوطة ونَفَس طيب في المطبخ.',
      },
      {
        obj: 'ساندوتش اليوم المبتكر: رغيف ميكس كبدة مع سجق وطشة دقة مخصوصة',
        act: 'تقديم فكرة ساندوتش الميكس المشكل لكسر الروتين وفتح شهية الزبون لتجربة صنف جديد',
        ch: 'ستوري وبوست انستجرام وفيسبوك',
        del: 'صورة شهية لساندوتش الميكس مع دقة الحارة ورشة بقدونس',
        met: 'عدد طلبات ساندوتش الميكس الجديد',
        explanation: 'شرح تنفيذي لساندوتش الميكس: الجمع بين نصف كبدة ونصف سجق في رغيف واحد يلبي رغبة الزبون المتردد الذي يريد تذوق الصنفين معاً. إطلاق اسم مميز عليه من وحي المكان (مثل: رغيف البريمو المشكل).',
      },
      {
        obj: 'كوبون هدية بقيمة 20 ج.م على الطلب القادم لكل أوردر فوق 150 ج.م',
        act: 'توزيع كروت خصم فعلية داخل أكياس الدليفري والتيك أواي للتحفيز على تكرار الزيارة',
        ch: 'الكروت المطبوعة ورسائل الواتساب',
        del: 'تصميم كارت هدية أنيق يوضع مع الأوردر',
        met: 'معدل إعادة الشراء واستخدام الكوبونات',
        explanation: 'شرح تنفيذي لكوبون الهدية: وضع كارت صغير مطبوع بلون الهوية داخل كيس الأوردر كُتب عليه: "نورتنا يا غالي! المرة الجاية خصم 20 ج.م على أوردرك عشان وحشتنا". هذا يحفز الزبون على الطلب مجدداً خلال أيام قليلة.',
      },
      {
        obj: 'تحدي الشطة الحامية: ريلز مرح لعشاق الفلفل الحامي وسلطة اللهاليب',
        act: 'منشور تفاعلي طريف يتحدى عشاق الأكل الحراق لتجربة ساندوتش الكبدة بالشطة الإسكندراني الحامية',
        ch: 'تيك توك وانستجرام ريلز',
        del: 'فيديو ريلز مرح لتحدي الفلفل الأخضر الحامي',
        met: 'المشاركات والمنشن بين الأصدقاء',
        explanation: 'شرح تنفيذي لتحدي الشطة: تصوير الشيف وهو يضع الفلفل الأخضر الحامي على الصاج ويسأل الكاميرا: "مين يقدر على لقمة بالشطة الحامية دي؟". المنشن والتعليقات بين الصحاب ("فلان مش هيقدر عليها") يرفع الوصول العضوي للحساب بمعدلات قياسية.',
      },
      {
        obj: 'مراجعات وتطوير: تقييمات جوجل وملاحظات الزبائن لتطوير الخدمة',
        act: 'دعوة زبائن الأسبوعين الماضيين لتقييم المكان على خرائط جوجل مع شكر خاص لكل مراجع',
        ch: 'واتساب وخرائط جوجل (Google Maps)',
        del: 'رابط مباشر لتقييم جوجل مع كود شكر',
        met: 'عدد التقييمات الإيجابية (5 نجوم) على جوجل مابس',
        explanation: 'شرح تنفيذي لتقييمات خرائط جوجل: إرسال رسالة واتساب لطيفة بعد استلام الأوردر بساعة: "ألف هنا وشفا! لو عجبك الأكل يهمنا تقييمك ع جوجل في ثواني، ورأيك بيساعدنا نكبر". تقييمات جوجل تضمن تصدر المحل في نتائج بحث المنطقة للأكل القريب.',
      },
      {
        obj: 'عروض السهرة وجوع آخر الليل: سندوتشات سخنة شغالة معاك للفجر',
        act: 'منشور وجبة سهرة منتصف الليل: استهداف عشاق السهر وجوع بعد الساعة 12 بخصم توصيل',
        ch: 'انستجرام وفيسبوك (إعلانات ونشر بعد 11 مساءً)',
        del: 'تصميم إعلاني جذاب لساندوتش مدخن مع خلفية ليلية',
        met: 'أوردرات السهرة بين 11 مساءً و 3 صباحاً',
        explanation: 'شرح تنفيذي لعرض جوع آخر الليل: نشر البوست في تمام الساعة 11:30 مساءً بعنوان: "الجوع قرص؟ صاجنا لسه شغال وسندوتشك طالع سخن بيولع في ربع ساعة!". تشغيل خط الواتساب والدليفري السريع للساهرين.',
      },
      {
        obj: 'برنامج حبايب المحل: كارت ولاء بسيط (اطلب 5 وجبات والسادسة هدية)',
        act: 'تطبيق كارت ختم ورقي بسيط: كل أوردر يحصل على ختم، والختم السادس وجبة مجانية',
        ch: 'المحل المباشر والتيك أواي',
        del: 'كارت أختام بحجم كارت العمل يُسلم للزبائن',
        met: 'معدل عودة الزبائن لإكمال الأختام الستة',
        explanation: 'شرح تنفيذي لكارت الأختام: كارت ورقي خفيف يحمله الزبون في محفظته فيه 6 خانات. مع كل زيارة يختم الشيف خانة. عند الختم السادس يحصل الزبون على ساندوتشين مجاناً. نظام بسيط ومحبب يفهمه أي زبون مصري بدون تطبيقات معقدة.',
      },
      {
        obj: 'بوست شكر ومحبة لأهل الحي والجيران على الدعم والاستقبال الطيب',
        act: 'رسالة ود وتقدير من صاحب المحل وفريق العمل لأهالي المنطقة وسكان الشارع',
        ch: 'فيسبوك وجروبات المنطقة',
        del: 'منشور مكتوب بلغة صادقة وبسيطة مع صورة الفريق مبتسماً',
        met: 'التعليقات الودية والمشاركة في جروبات الحي',
        explanation: 'شرح تنفيذي لبوست الجيران: الأكل الشعبي ابن منطقته ونجاحه يعتمد على احتضان أهالي الحي له. نشر صورة عفوية للشيفات ومسؤولي التوصيل مع رسالة: "شكراً لأهل حتتنا وجيرانا اللي شرفونا من أول يوم.. المحل محلكم ودايماً عند حسن ظنكم!".',
      },
      {
        obj: 'فيديو قرمشة العيش وصوت الساندوتش وهو بيتقفل مع سخونة البخار',
        act: 'فيديو تركيز على الصوت والتفاصيل الحسية (قرمشة العيش البلدي وصوت السكينة وهي بتقطعه)',
        ch: 'تيك توك وانستجرام ريلز',
        del: 'فيديو مقرب 15 ثانية بجودة صوت نقية جداً',
        met: 'معدل الحفظ والمشاهدات الكاملة للفيديو',
        explanation: 'شرح تنفيذي لفيديو القرمشة: تصوير بدون كلام أو فويس أوفر، فقط صوت السكينة وهي تفتح الرغيف المقرمش، نزول ملعقة الطحينة، ثم غرف الكبدة السخنة وصوت حشو الرغيف. مقاطع الطعام الحسية تحقق انتشاراً فيروسياً سريعاً على تيك توك.',
      },
      {
        obj: 'بكج مكاتب وشركات: غداء عمل سريع لـ 5 أو 10 أفراد في علب مغلفة',
        act: 'عرض موجه للشركات والمصالح والعيادات المجاورة: بوكس غداء مشبع ومغلف بنظافة',
        ch: 'واتساب بيزنس وفيسبوك تارجت للمنطقة',
        del: 'عرض أسعار مبسط للوجبات الجماعية مع فاتورة ضريبية وتوصيل مجاني',
        met: 'عدد تعاقدات وطلبات غداء الشركات الأسبوعية',
        explanation: 'شرح تنفيذي لبكج الشركات: توفير بوكس مجمع يحتوي على 10 سندوتشات + 4 باكت بطاطس + مخللات وطحينة + كانزات، مغلفة في كرتونة حرارية مخصصة للتقديم النظيف داخل غرف الاجتماعات دون فوضى.',
      },
      {
        obj: 'سؤال تفاعلي للمتابعين: مين أكتر صاحب بيعزمك ومستني منه عزومة السبت؟',
        act: 'منشور تفاعلي ترفيهي لتحفيز المنشن والتعليقات بين الأصدقاء',
        ch: 'فيسبوك وانستجرام',
        del: 'تصميم جرافيك مرح بخط عريض وفكاهة مصرية لطيفة',
        met: 'عدد المنشنات والتعليقات والوصول العضوي',
        explanation: 'شرح تنفيذي للسؤال التفاعلي: الكابشن: "منشن لصاحبك اللي بقاله سنة بيقولك هعزمك ع كبدة ومشفناش منه حاجة.. لو مردش في 10 دقايق العزومة عليه السبت ده!". المنشورات الفكاهية تعيد تنشيط الحساب وخوارزميات الوصول.',
      },
      {
        obj: 'جولة النظافة والتعقيم: تعقيم الصاج والمعدات والتزام الشيف بالاشتراطات الصحية',
        act: 'توثيق إجراءات الإغلاق اليومي وغسيل الصاج والأرضيات لراحة بال كل زبون',
        ch: 'ستوري انستجرام وفيسبوك',
        del: 'ستوري مصورة من 4 مقاطع لعمليات التنظيف اليومية',
        met: 'ردود الأفعال ورسائل الإشادة في الخاص',
        explanation: 'شرح تنفيذي لستوري النظافة: تصوير عمال المطبخ وهم يغسلون الصاج بالماء الساخن ومواد التعقيم، تنظيف وتلميع الواجهة الزجاجية، وتغيير زي الشيفات. إظهار هذا الجانب بانتظام يبني سمعة لا تُقهر للمحل في الحي.',
      },
      {
        obj: 'مكافأة الأوفياء: خصم 20% لكل اللي طلبوا معانا من أول أسبوع',
        act: 'إرسال رسائل شكر عبر الواتساب للزبائن الأوائل مع كود خصم حصري لتجديد التجربة',
        ch: 'واتساب وقائمة الزبائن المباشرة',
        del: 'رسالة واتساب مخصصة باسم الزبون مع كود الخصم',
        met: 'نسبة الردود وأوردرات تكرار الشراء في عطلة نهاية الأسبوع',
        explanation: 'شرح تنفيذي لرسائل الأوفياء: إرسال رسالة رقيقة للزبائن المسجلين: "مساء الخير يا [اسم الزبون]، شرفتنا في أول أيام افتتاحنا ورأيك كان فارق معانا جداً.. دي هدية بسيطة خصم 20% ع أوردرك الجاي في أي وقت".',
      },
      {
        obj: 'احتفال الشهر الأول: كام رغيف كبدة طلع من الصاج بحب وإتقان ورأي الناس فينا',
        act: 'مشاركة أرقام وإنجازات الشهر الأول بشفافية وبساطة واحتفال مع الزبائن',
        ch: 'جميع المنصات وفيسبوك',
        del: 'إنفوجرافيك احتفالي بأرقام الشهر الأول (سندوتشات، زبائن سعداء، بطاطس مقلية)',
        met: 'معدل التفاعل الإجمالي والمباركات والتعليقات',
        explanation: 'شرح تنفيذي لاحتفال الشهر الأول: نشر أرقام طريفة وواقعية: "خلال أول 30 يوم.. طلع من صاجنا أكتر من 2,500 ساندوتش كبدة وسجق، وقلينا نص طن بطاطس! شكراً لثقتكم ومستمرين معاكم بأعلى جودة".',
      },
      {
        obj: 'مفاجأة الشهر الجديد: إضافة صنف جديد للمنيو بناءً على طلب الزبائن',
        act: 'الإعلان التشويقي عن إضافة صنف جديد للمنيو (طاجن كبدة بالصلصة / رغيف كبدة بالجبنة / حواوشي ميكس)',
        ch: 'ريلز وبوست عبر جميع المنصات',
        del: 'فيديو تشويقي للصنف الجديد وعرض أول 20 أوردر مجاني للتجربة',
        met: 'التعليقات والطلبات المسبقة على الصنف الجديد',
        explanation: 'شرح تنفيذي لمفاجأة الشهر الجديد: الكشف عن صنف مميز طلبه الزبائن في الاستفتاءات السابقة، مع كابشن: "انتوا طلبتوا وإحنا نفذنا! صنفنا الجديد وصل المنيو رسمي.. مين أول واحد هيدوق؟". هذا يضمن استمرار الزخم وبدء الشهر الثاني بقوة.',
      },
    ];

    for (let i = 1; i <= 30; i++) {
      const p = foodPlans[(i - 1) % foodPlans.length];
      let periodName = phases[0].name;
      for (const ph of phases) {
        if (i >= ph.days[0] && i <= ph.days[1]) {
          periodName = ph.name;
          break;
        }
      }

      days.push({
        dayNumber: i,
        period: periodName,
        objective: `اليوم ${i}: ${p.obj}`,
        action: p.act,
        channel: p.ch,
        deliverable: p.del,
        metric: p.met,
        explanation: p.explanation,
      });
    }

    return days;
  }

  // 2. Cafes & Coffee Shops
  if (ind === 'cafe') {
    const cafePlans = [
      {
        obj: 'فيديو ريلز: ريحة البن المحمص وطبقات اللاتيه آرت',
        act: 'تصوير فيديو مقرب جداً لطحن البن ونزول الإسبريسو مع رسمة اللاتيه آرت الحريرية',
        ch: 'انستجرام وتيك توك (Reels)',
        del: 'فيديو ريلز هادئ 20 ثانية مع صوت الاستخلاص والموسيقى المريحة',
        met: 'المشاهدات، الحفظ، ومعدل المشاركة',
        explanation: 'شرح تنفيذي لريلز القهوة: البدء فوراً بلقطة نزول الإسبريسو الكثيف وتصاعد البخار، يليه صب الحليب المبخر ورسمة اللاتيه آرت. ختام الفيديو بعبارة: "الصباح الصح بيبدأ من هنا.. فنجانك مستنيك!". النشر بين 7:30 و 9:30 صباحاً.',
      },
      {
        obj: 'عرض افتتاح المزاج الصباحي: اطلب قهوتك والكرواسون هدية',
        act: 'عرض ترويجي لأول 50 زائر صباحي لتجربة بن المكان المتخصص مع قطعة مخبوزات طازجة',
        ch: 'فيسبوك وانستجرام ستوري',
        del: 'تصميم ستوري جذاب للكومبو الصباحي مع كود الخصم',
        met: 'عدد الزيارات الصباحية وتجربة الكومبو',
        explanation: 'شرح تنفيذي لعرض الصباح: استهداف الموظفين وسكان المنطقة في ساعات الصباح الأولى بتقديم قطعة مخبوزات طازجة مجانية مع أي كوب قهوة سبيشالتي، لكسر روتينهم وتشجيعهم على اعتماد المقهى كمحطتهم الصباحية الدائمة.',
      },
      {
        obj: 'سر المذاق: مصدر حبوب البن ودرجات التحميص الخاصة بنا',
        act: 'كاروسيل يوضح سلالات البن المستخدمة (إثيوبي، كولومبي) والفرق في الإيحاءات والنكهات',
        ch: 'انستجرام وفيسبوك',
        del: 'كاروسيل تعليمي مبسط من 4 شرائح لعشاق القهوة',
        met: 'معدل الحفظ والتعليقات من محبي القهوة المختصة',
        explanation: 'شرح تنفيذي لكاروسيل البن: تثقيف الزبون بطريقة غير متكلفة عن إيحاءات القهوة (شوكولاتة، كراميل، فواكه مجففة) وكيف نختار حبوب البن الطازجة التي حُمصت في توقيت مثالي لضمان فنجان قهوة خالي من المرارة المزعجة.',
      },
      {
        obj: 'عرض جلسة المذاكرة والعمل الهادئ: مشروبين + واي فاي ومقعد مريح',
        act: 'استهداف الطلاب والعمل الحر بجلسة عمل هادئة ومقابس شحن وإنترنت سريع',
        ch: 'تيك توك ومجموعات الطلاب والشباب',
        del: 'فيديو لأجواء المقهى الهادئة والمقاعد المريحة والإضاءة الدافئة',
        met: 'نسبة إشغال فترات الظهيرة وما بعد العصر',
        explanation: 'شرح تنفيذي لجلسة العمل: توفير بيئة عمل مريحة مع واي فاي سريع ومقابس قريبة، وتقديم خصم 20% على المشروب الثاني لمن يقضي أكثر من ساعتين في العمل أو المذاكرة بالمكان.',
      },
      {
        obj: 'استفتاء المزاج: قهوتك المفضلة الصبح إيه؟ فلات وايت ولا أمريكانو؟',
        act: 'ستوري تفاعلي لاستطلاع ذوق المتابعين مع تقديم فنجان مجاني لـ 3 مشاركين',
        ch: 'ستوري انستجرام',
        del: 'ملصق تصويت تفاعلي بصور أنيقة للمشروبين',
        met: 'التفاعل ونسبة التصويت والرسائل',
        explanation: 'شرح تنفيذي لاستفتاء القهوة: إشراك المجتمع في الحوار اليومي ومكافأة 3 فائزين عشوائياً بفنجان قهوة مجاني في اليوم التالي لتشجيعهم على زيارة المقهى والتعرف على فريق الباريستا.',
      },
      {
        obj: 'انتعاش الصيف وسهرات المساء: مشروبات الآيسد كوفي والسبانش لاتيه',
        act: 'ريلز منعش لمكعبات الثلج وحليب الكراميل ونزول الإسبريسو البارد المزدوج',
        ch: 'تيك توك وانستجرام ريلز',
        del: 'فيديو استعراض مشروبات القهوة المثلجة 15 ثانية',
        met: 'طلبات المشروبات الباردة في فترات المساء',
        explanation: 'شرح تنفيذي لمشروبات الصيف: التركيز على صوت قرقعة مكعبات الثلج وجمال طبقات الحليب والإسبريسو البارد، ونشر الفيديو في وقت اشتداد الحر بين 2 و 5 عصراً.',
      },
      {
        obj: 'كارت ولاء القهوة: فنجانك السادس مجاناً من إيد الباريستا',
        act: 'تطبيق كارت أختام بسيط: كل 5 أكواب قهوة تمنح الزبون الكوب السادس هدية',
        ch: 'المقهى المباشر وحسابات التواصل',
        del: 'كارت ختم ورقي أنيق يحمله الزبون في محفظته',
        met: 'معدل تكرار الزيارات الصباحية',
        explanation: 'شرح تنفيذي لكارت القهوة: خطوة بسيطة جداً تبني علاقة وطيدة مع الزبون اليومي وتجعله يفضل القدوم إليك بدلاً من أي مكان آخر لتجميع أختامه والحصول على هديته.',
      },
      {
        obj: 'حلوى اليوم المميزة: قطعة تشيز كيك أو كوكيز مخبوزة فريش مع القهوة',
        act: 'تسليط الضوء على الحلويات الطازجة التي تتناغم تماماً مع فنجان الإسبريسو واللاتيه',
        ch: 'انستجرام وفيسبوك',
        del: 'صورة احترافية مقربة لقطعة الحلوى مع فنجان القهوة الساخن',
        met: 'معدل إضافة الحلويات مع طلبات القهوة',
        explanation: 'شرح تنفيذي لحلوى اليوم: عرض كومبو موفر (قهوة + كوكيز طازة) يرفع متوسط الفاتورة ويمنح الزبون تجربة متكاملة تسعده.',
      },
    ];

    for (let i = 1; i <= 30; i++) {
      const p = cafePlans[(i - 1) % cafePlans.length];
      let periodName = phases[0].name;
      for (const ph of phases) {
        if (i >= ph.days[0] && i <= ph.days[1]) {
          periodName = ph.name;
          break;
        }
      }

      days.push({
        dayNumber: i,
        period: periodName,
        objective: `اليوم ${i}: ${p.obj}`,
        action: p.act,
        channel: p.ch,
        deliverable: p.del,
        metric: p.met,
        explanation: p.explanation,
      });
    }

    return days;
  }

  // 3. Dental & Medical Clinics
  if (ind === 'dental' || ind === 'medical') {
    const medPlans = [
      {
        obj: 'فيديو تعريفي: جولة داخل العيادة وأحدث أجهزة الكشف بدون ألم',
        act: 'فيديو ريلز يبرز بيئة العيادة الهادئة، التعقيم الفائق، والترحيب المريح بالمريض',
        ch: 'انستجرام وفيسبوك',
        del: 'فيديو جولة عيادة 30 ثانية بجودة عالية ونبرة مطمئنة',
        met: 'المشاهدات والاستفسارات المباشرة عن المواعيد',
        explanation: 'شرح تنفيذي لجولة العيادة: الهدف الأساسي كسر حاجز الخوف من زيارة طبيب الأسنان. إظهار الإضاءة المريحة، غرفة الانتظار الأنيقة، أجهزة التعقيم المعتمدة، وشاشة العرض أمام كرسي الكشف. إنهاء الفيديو بابتسامة الطبيب وترحيبه بالمرضى.',
      },
      {
        obj: 'عرض الافتتاح: كشف واستشارة وقائية مجانية لأول 30 مريضاً',
        act: 'طرح حجز كشف مجاني مع تصوير الأشعة التشخيصية لتشجيع الزيارة الأولى',
        ch: 'فيسبوك ومجموعات الحي والمجتمع السكني',
        del: 'تصميم بوست حجز الكشف مع رابط واتساب مباشر للحجز',
        met: 'عدد الحجوزات المؤكدة لليوم الأول والثاني',
        explanation: 'شرح تنفيذي لعرض الكشف: تسهيل الخطوة الأولى للمريض بحجز ميسر عبر الواتساب بدون أي تكلفة للكشف الأول، مع شرح خطة العلاج بشفافية كاملة دون أي إلزام فوري للمريض.',
      },
      {
        obj: 'المحتوى التوعوي: 3 أخطاء شائعة تدمر الأسنان وتسبب حساسية الفم',
        act: 'كاروسيل طبي مبسط يقدم نصائح عملية للحفاظ على صحة الأسنان واللثة',
        ch: 'انستجرام وفيسبوك',
        del: 'كاروسيل من 4 شرائح بنصائح طبية مبسطة وأيقونات واضحة',
        met: 'معدل الحفظ والمشاركة بين الأهل والأصدقاء',
        explanation: 'شرح تنفيذي للكاروسيل الطبي: تقديم محتوى ذي قيمة حقيقية يلمس الحياة اليومية للمريض (مثل: الطريقة الصحيحة لاستخدام الخيط الطبي، اختيار معجون الأسنان، وتجنب غسيل الأسنان بعنف). هذا المحتوى يثبت المركز كمرجع موثوق.',
      },
      {
        obj: 'توثيق حالة حقيقية (قبل وبعد): استعادة الابتسامة المشرقة بأمان',
        act: 'نشر صورة مقارنة احترافية لحالة تجميل أو تبييض أو حشو تجميلي بعد موافقة المريض',
        ch: 'انستجرام وفيسبوك',
        del: 'صورة قبل وبعد (Before & After) عالية الدقة مع تعليق طبي',
        met: 'الرسائل المباشرة للاستفسار عن تكلفة الإجراء',
        explanation: 'شرح تنفيذي لصور قبل وبعد: الدليل البصري هو المحرك الأكبر لقرارات العلاج والتجميل. إبراز النتيجة الطبيعية المشرقة بدون مبالغة، وشرح كم استغرقت الجلسة مع التأكيد على أنها تمت بدون أي ألم.',
      },
      {
        obj: 'سؤال وجواب مع الطبيب: الإجابة على استفسارات المتابعين عبر الستوري',
        act: 'فتح صندوق أسئلة (Q&A Box) في الستوري والإجابة بفيديوهات قصيرة من الطبيب المختص',
        ch: 'ستوري انستجرام وفيسبوك',
        del: 'سلسلة ستوريز طبية تفاعلية تجيب على 5 أسئلة شائعة',
        met: 'عدد الأسئلة الواردة والتفاعل العاطفي مع الطبيب',
        explanation: 'شرح تنفيذي لفقرة الأسئلة: الإجابة العفوية للطبيب بأسلوب ودي مبسط وبدون مصطلحات لاتينية معقدة تقرب الطبيب من جمهوره وتزيل أي رهبة متبقية لديهم.',
      },
      {
        obj: 'جلسة تنظيف وتلميع الأسنان وإزالة الجير في 20 دقيقة بدون ألم',
        act: 'عرض خاص على جلسة إزالة الجير والتلميع بجهاز الموجات الصوتية اللطيف',
        ch: 'فيسبوك وواتساب',
        del: 'إنفوجرافيك يوضح خطوات الجلسة البسيطة والشعور بالانتعاش بعدها',
        met: 'حجوزات جلسات النظافة الوقائية',
        explanation: 'شرح تنفيذي لجلسة النظافة: معظم الناس يؤجلون تنظيف الجير خوفاً من الألم أو حساسية الأسنان. الشرح المبسط بأن الجهاز حديث ولا يسبب أي ألم يشجعهم على أخذ الموعد فوراً.',
      },
    ];

    for (let i = 1; i <= 30; i++) {
      const p = medPlans[(i - 1) % medPlans.length];
      let periodName = phases[0].name;
      for (const ph of phases) {
        if (i >= ph.days[0] && i <= ph.days[1]) {
          periodName = ph.name;
          break;
        }
      }

      days.push({
        dayNumber: i,
        period: periodName,
        objective: `اليوم ${i}: ${p.obj}`,
        action: p.act,
        channel: p.ch,
        deliverable: p.del,
        metric: p.met,
        explanation: p.explanation,
      });
    }

    return days;
  }

  // 4. Fitness & Gyms
  if (ind === 'fitness') {
    const fitPlans = [
      {
        obj: 'فيديو تشويقي: جولة الأجهزة والأجواء الحماسية في الصالة',
        act: 'ريلز سريع يبرز نظافة وتنوع أجهزة الجيم والموسيقى الحماسية وتكييف الصالة',
        ch: 'انستجرام وتيك توك (Reels)',
        del: 'فيديو ريلز حماسي 25 ثانية',
        met: 'المشاهدات والاستفسارات عن الاشتراكات',
        explanation: 'شرح تنفيذي لريلز الجيم: التركيز على إضاءة الصالة، الأجهزة الحديثة، نظافة غرف تبديل الملابس، مع كابشن: "أول خطوة لجسمك المثالي بتبدأ من النهاردة!".',
      },
      {
        obj: 'عرض الافتتاح: قياس InBody مجاني + تمرينة تجريبية مع كابتن',
        act: 'دعوة شباب المنطقة ليوم تجريبي مفتوح لقياس نسبة الدهون والعضلات وتحديد خطة التمرين',
        ch: 'فيسبوك ومجموعات الحي والواتساب',
        del: 'بوست حجز اليوم التجريبي المجاني',
        met: 'عدد الحاضرين الفعليين لليوم المفتوح',
        explanation: 'شرح تنفيذي لليوم المفتوح: كسر التردد بجلسة قياس وزن حقيقية وشرح مبسط من المدرب، مما يحول أكثر من 50% من الزوار إلى مشتركين سنويين وشهريين.',
      },
      {
        obj: 'تمرين اليوم: 3 خطوات لتكنيك تمرين السكوات بدون إصابات بالركبة',
        act: 'فيديو قصير للمدرب يصحح خطأ شائعاً في التمرين بطريقة عملية وسهلة',
        ch: 'تيك توك وانستجرام',
        del: 'فيديو تعليمي سريع 30 ثانية',
        met: 'معدل الحفظ والمشاركة بين الأصدقاء',
        explanation: 'شرح تنفيذي لفيديو التكنيك: إبراز كفاءة مدربي الصالة وحرصهم على سلامة المتدرب، مما يبني ثقة قوية لدى المبتدئين.',
      },
      {
        obj: 'عرض اشتراك الصحاب: اشترك أنت وصاحبك واحصلوا على شهر إضافي هدية',
        act: 'طرح باقة التمرين الثنائية لتشجيع الأصدقاء على القدوم معاً والالتزام بالتمرين',
        ch: 'فيسبوك وانستجرام ستوري',
        del: 'تصميم بوست عرض الصحاب الترويجي',
        met: 'عدد الاشتراكات الثنائية الجديدة',
        explanation: 'شرح تنفيذي لعرض الصحاب: الالتزام بالرياضة أسهل بوجود رفيق تمرين. تقديم حافز للشخصين يجلب زبائن جدد بجهد تسويقي مضاعف الفائدة.',
      },
    ];

    for (let i = 1; i <= 30; i++) {
      const p = fitPlans[(i - 1) % fitPlans.length];
      let periodName = phases[0].name;
      for (const ph of phases) {
        if (i >= ph.days[0] && i <= ph.days[1]) {
          periodName = ph.name;
          break;
        }
      }

      days.push({
        dayNumber: i,
        period: periodName,
        objective: `اليوم ${i}: ${p.obj}`,
        action: p.act,
        channel: p.ch,
        deliverable: p.del,
        metric: p.met,
        explanation: p.explanation,
      });
    }

    return days;
  }

  // 5. General / Other Commercial Ventures (Retail, Crafts, Services, etc.)
  const generalPlans = [
    {
      obj: 'إعلان تشويقي للهوية وقصة المشروع والبداية',
      act: `نشر فيديو ريلز يكشف الشغف وسر تأسيس البراند وفلسفة الخدمة المقدمة للعملاء في مصر`,
      ch: 'انستجرام وتيك توك (Reels)',
      del: 'فيديو ريلز ديناميكي 25 ثانية',
      met: 'مرات المشاهدة ومعدل الحفظ والمشاركة',
      explanation: 'شرح تنفيذي للفيديو الافتتاحي: البدء بلقطة مقربة خاطفة تبرز المشكلة التي يحلها المشروع للزبون، تليها لقطات سريعة ومبهجة لجودة المنتج أو الخدمة، مع دعوة لطيفة للمتابعة والاستفادة من عرض الافتتاح.',
    },
    {
      obj: 'عرض الافتتاح الحصري وكود الخصم المباشر',
      act: 'طرح كود خصم ترويجي بنسبة 20% لأول 50 طلباً لتشجيع التجربة الفورية',
      ch: 'انستجرام وفيسبوك',
      del: 'تصميم بوست وستوري ترويجي مع كود الخصم ورابط الطلب',
      met: 'معدل استخدام كود الخصم وعدد الطلبات المؤكدة',
      explanation: 'شرح تنفيذي لعرض الافتتاح: تخصيص كود خصم بسيط وسهل التذكر (مثل: LAUNCH20) مع توفير رابط طلب مباشر بنقرة واحدة لتقليل الخطوات وتسهيل الشراء للعميل الجديد.',
    },
    {
      obj: 'سر الجودة والإتقان: 3 معايير نلتزم بها في كل تفصيلة',
      act: 'كاروسيل يوضح للعميل الفرق بين الحلول العادية وما نقدمه من إتقان ومتابعة مستمرة',
      ch: 'فيسبوك وانستجرام',
      del: 'كاروسيل من 4 شرائح أنيقة بألوان الهوية المعتمدة',
      met: 'معدل الحفظ والمشاركات والتعليقات الإيجابية',
      explanation: 'شرح تنفيذي لكاروسيل الجودة: التركيز على التفاصيل العملية التي تهم العميل الحقيقي (سرعة الرد، جودة الخامات، التغليف المحكم، والدعم الودود المستمر).',
    },
    {
      obj: 'كواليس العمل والتجهيز: كيف يخرج طلبك من البداية للنهاية',
      act: 'تصوير فيديو عفوي لفريق العمل أثناء التجهيز والتغليف الآمن قبل التسليم',
      ch: 'تيك توك وإنستجرام ريلز',
      del: 'فيديو كواليس عالي الجودة 30 ثانية',
      met: 'معدل إكمال المشاهدة والتفاعل العاطفي',
      explanation: 'شرح تنفيذي لفيديو الكواليس: إظهار الاهتمام الحقيقي بكل تفصيلة، ووضع كارت شكر صغير باسم العميل داخل كل أوردر لإضفاء لمسة إنسانية دافئة ومحببة.',
    },
    {
      obj: 'استفتاء تفاعلي وإشراك الجمهور في اختيار الإضافة القادمة',
      act: 'طرح تصويت لاختيار الميزة أو التصميم أو العرض القادم بمشاركة الزبائن',
      ch: 'ستوري انستجرام وفيسبوك',
      del: 'ملصق تصويت تفاعلي عبر الستوري',
      met: 'نسبة التصويت والتفاعل والرسائل',
      explanation: 'شرح تنفيذي للاستفتاء: إشعار المتابع بأن رأيه هو الأساس في تطوير البراند، مع سحب على هدية أو خصم إضافي لـ 3 مشاركين عشوائيين.',
    },
    {
      obj: 'توثيق تجربة عميل حقيقي وانطباعه بعد استلام الطلب',
      act: 'نشر لقطات ورسائل تقييم صادقة لعميل حقيقي بعد تجربة المنتج أو الخدمة',
      ch: 'إنستجرام وفيسبوك',
      del: 'منشور شهادة عميل وبوست مراجعة موثقة',
      met: 'معدل الحفظ والمراسلات المباشرة للاستفسار',
      explanation: 'شرح تنفيذي لشهادات العملاء: استعراض انطباع واقعي مسجل لعميل يشرح سروره بجودة المنتج وسرعة التوصيل مع إخفاء بياناته الشخصية احتراماً للخصوصية.',
    },
    {
      obj: 'برنامج الولاء ومكافأة العملاء الأوفياء للطلب الثاني',
      act: 'إرسال رسالة شكر خاصة مع كود خصم حصري لكل عميل أتم طلبه في الشهر الأول',
      ch: 'واتساب وقنوات التواصل المباشرة',
      del: 'رسالة واتساب تفاعلية مخصصة مع كوبون ولاء',
      met: 'معدل تكرار الشراء ورضا العملاء',
      explanation: 'شرح تنفيذي لبرنامج الولاء: شكر العميل باسمه والتأكد من رضاه التام عن التجربة، ومنحه ميزة حصرية في طلبه التالي لتشجيعه على البقاء عميلاً دائماً للبراند.',
    },
  ];

  for (let i = 1; i <= 30; i++) {
    const p = generalPlans[(i - 1) % generalPlans.length];
    let periodName = phases[0].name;
    for (const ph of phases) {
      if (i >= ph.days[0] && i <= ph.days[1]) {
        periodName = ph.name;
        break;
      }
    }

    days.push({
      dayNumber: i,
      period: periodName,
      objective: `اليوم ${i}: ${p.obj}`,
      action: p.act,
      channel: p.ch,
      deliverable: p.del,
      metric: p.met,
      explanation: p.explanation,
    });
  }

  return days;
}

// Generate 3 domain-customized marketing posts
export function buildMarketingPosts(idea: string, analysis: IdeaAnalysis): MarketingPost[] {
  const ind = analysis.industryId;

  // 1. Street Food & Popular Restaurants
  if (ind === 'street-food' || ind === 'restaurant') {
    return [
      {
        id: 'post-1',
        platform: 'انستجرام وتيك توك',
        format: 'ريلز تشويقي وافتتاحي',
        hook: 'ريحة الصاج اللي تقلب الشارع.. سر طشة الكبدة البلدي عندنا غير! 🔥',
        caption: `من قلب الشارع المصري، رجعنا لأصل الصنعة! 🥖
كبدة وسجق بلدي طازة يوم بيومه بتتبيلة زمان المتوارثة، على نار صاج حامية ولقمة عيش سخنة ترد الروح.

✨ ليه تجربتنا مختلفة؟
- كبدة بلدي طازة بنستلمها كل يوم فجر ربنا
- خلطة توم وكمون وليمون وفلفل تفتح النفس
- نظافة وترتيب وتغليف فويل يحافظ على السخونة كأنك واقف قدام الصاج

👇 منشن صاحبك اللي مابيشبعش كبدة واطلبوا عزومة الافتتاح دلوقتي!`,
        visualDirection: 'لقطة سينمائية مقربة جداً للطشة ع الصاج مع تصاعد البخار وصوت القلي الساخن، ثم مشهد ملء الرغيف البلدي ورشة الليمون ووضع طبق الطحينة البلدي بجانبه.',
        videoScript: 'المشهد 1 (0-3 ثوان): صوت طشة الكبدة ع الصاج وصوت النار مع زووم سريع.\nالمشهد 2 (3-10 ثوان): الشيف بيقلب الكبدة مع الفلفل الأخضر ورشة التوابل والليمون.\nالمشهد 3 (10-15 ثانية): فتح رغيف بلدي طازة وملؤه بالكبدة وظهور اسم المحل مع رقم الدليفري ورابط الطلب.',
        cta: 'اطلب دلوقتي عبر رسائل الصفحة أو الواتساب واستمتع بخصم الافتتاح وسندوتشك يوصلك سخن بيولع!',
        hashtags: ['#كبدة_إسكندراني', '#أكل_شعبي', '#مصر', '#ساندوتش_سخن', '#طشة_الصاج', '#كبدة_بلدي'],
        locked: false,
      },
      {
        id: 'post-2',
        platform: 'انستجرام وفيسبوك',
        format: 'كاروسيل سر الصنعة والمكونات',
        hook: '3 حاجات بتفرق بين أي ساندوتش وساندوتش الكبدة المظبوط اللي يدخل قلبك! 💡',
        caption: `الأكل الشعبي مش مجرد ساندوتش.. ده مزاج وأصول!
في الكاروسيل ده بنكشف لكم سر الطعم اللي بيخلي كل زبون يرجع تاني:

1️⃣ الكبدة البلدي الفريش: تقطيع يومي صابح مش مجمد
2️⃣ رغيف العيش: بيتخبز مخصوص ومقرمش يشيل التتبيلة
3️⃣ التحبيشة: طشة ثوم وخل وليمون بالجرام مش عشوائي

📌 مرر لليسار وشوف كواليس التحضير، ومستنينك تجرب وتحكم بنفسك!`,
        visualDirection: 'تصميم كاروسيل من 4 شرائح موحدة الخلفية، خطوط عربية حديثة وواضحة، مع صور مقربة للكبدة الطازجة والخبز البلدي والمقبلات.',
        videoScript: '',
        cta: 'احفظ البوست عشان ترجعله وقت ما الجوع يقرص، وكلمنا نجهزلك طلبك فوراً!',
        hashtags: ['#سر_الصنعة', '#أكلات_مصرية', '#طعم_أصيل', '#عزومة', '#كبدة_الحارة'],
        locked: false,
      },
      {
        id: 'post-3',
        platform: 'فيسبوك ومجموعات المجتمع والواتساب',
        format: 'عرض لمة الصحاب وعزومة الافتتاح',
        hook: 'عزومة الافتتاح وصلت! اطلب 4 سندوتشات والخامس هدية مع كانز ساقع وبطاطس! 🥤🍟',
        caption: `اللمة متحلاش غير بالأكل السخن اللي يرد الروح!
بمناسبة انطلاقنا رسمياً في المنطقة، عملنا لكم عرض لمة الصحاب:

كل ما تطلب 4 سندوتشات (كبدة أو سجق مشكل)، الساندوتش الخامس علينا هدية + باكت بطاطس مقلية بالدقة البلدي + كانز ساقع يبل الريق.

🏷️ العرض ساري طوال أسبوع الافتتاح للتيك أواي والدليفري السريع داخل الحي.`,
        visualDirection: 'صورة شهية ومبهجة لـ 5 سندوتشات ملفوفة جزئياً في ورق فويل ذهبي وبجانبها باكت بطاطس ذهبي وكانز مع قطرات الندى وطبق طحينة بلدي.',
        videoScript: '',
        cta: 'ابعت لنا رسالة دلوقتي على الواتساب بكلمة "عزومة" واستلم أوردرك سخن بيولع!',
        hashtags: ['#عرض_الافتتاح', '#لمة_الصحاب', '#دليفري_سريع', '#سندوتشات_مصر', '#عزومة_الصحاب'],
        locked: false,
      },
    ];
  }

  // 2. Cafes & Coffee
  if (ind === 'cafe') {
    return [
      {
        id: 'post-1',
        platform: 'انستجرام وتيك توك',
        format: 'ريلز صباحي واستخلاص القهوة',
        hook: 'فنجان القهوة المظبوط مش مجرد كافيين.. ده اللي بيظبط يومك كله! ☕✨',
        caption: `صباح الخير على الناس اللي بتفهم في المزاج!
في مكاننا الجديد، بنختار حبوب البن بحب وإتقان، وبنحمّصها بدرجة تبرز كل نكهة مخفية في الفنجان.

🏷️ اطلب قهوتك الصباحية النهاردة واستمتع بكرواسون زبدة طازة هدية مع أول فنجان!`,
        visualDirection: 'لقطات استخلاص الإسبريسو البطيء، نزول الكريمة الذهبية، وصب الحليب المبخر برسمة لاتيه آرت أنيقة.',
        videoScript: 'المشهد 1: صوت طحن البن.\nالمشهد 2: استخلاص الإسبريسو بالماكينة.\nالمشهد 3: تقديم الفنجان مع كعكة ساخنة وابتسامة الباريستا.',
        cta: 'منشن صاحبك اللي مابيفوقش إلا بالقهوة وتعالوا ابدأوا يومكم صح!',
        hashtags: ['#قهوة_مختصة', '#صباح_الخير', '#مزاج_القهوة', '#كافيه_مصر'],
        locked: false,
      },
      {
        id: 'post-2',
        platform: 'انستجرام وفيسبوك',
        format: 'كاروسيل إيحاءات البن والنكهات',
        hook: 'بتحب قهوتك بنكهة الشوكولاتة والكراميل ولا الفواكه؟ اكتشف نوعك المفضل! 💡',
        caption: `عالم القهوة المختصة واسع ومليان مفاجآت.
في هذا الدليل السريع، بنوضح لك إزاي تختار كوبك المثالي بحسب ذوقك ووقتك في اليوم. مرر الشاشة واكتشف إيحاءات حبوب بن المكان!`,
        visualDirection: 'شرائح أنيقة بألوان القهوة الدافئة مع صور لحبوب البن وطريقة التحضير.',
        videoScript: '',
        cta: 'احفظ المنشور وتعال جرّب النكهة اللي تناسبك في زيارتك الجاية!',
        hashtags: ['#عشاق_القهوة', '#كافيهات_القاهرة', '#تذوق_القهوة'],
        locked: false,
      },
      {
        id: 'post-3',
        platform: 'فيسبوك وانستجرام',
        format: 'عرض جلسة العمل والمذاكرة',
        hook: 'بتدور على مكان هادي تخلص فيه شغلك أو تذاكر بمزاج؟ مساحتك جاهزة! 💻',
        caption: `وفرنالك الهدوء اللي بتتمناه:
واي فاي فائق السرعة، فيش كهربا عند كل ترابيزة، قهوة سبيشالتي معمولة بحرفنة، ومقاعد مريحة تخليك تنجز وتشتغل بروقان.

🏷️ خصم 20% على أي مشروب ثانٍ لكل أبطال العمل والمذاكرة!`,
        visualDirection: 'صورة واسعة ودافئة لأحد أركان المقهى الهادئة مع لابتوب وكوب قهوة وأوراق عمل.',
        videoScript: '',
        cta: 'احجز ترابيزتك المفضلة أو نورنا مباشرة في أي وقت!',
        hashtags: ['#مساحة_عمل', '#مذاكرة_بروقان', '#كافيه_هادئ', '#قهوة_وعمل'],
        locked: false,
      },
    ];
  }

  // 3. General Default
  return [
    {
      id: 'post-1',
      platform: 'انستجرام وتيك توك',
      format: 'ريلز تشويقي وافتتاحي',
      hook: `كنت بتدور على جودة حقيقية وإتقان يليق بيك في ${idea}؟ رحلتك تبدأ هنا! 🔥`,
      caption: `كل تفصيلة في هذا المشروع صُممت بحب وإتقان عشان نقدملك تجربة مختلفة وواضحة ترضيك من أول تعامل.

✨ ليه إحنا خيارك الأفضل؟
- اهتمام استثنائي بأدق التفاصيل وخامات معتمدة
- التزام بالمواعيد وسرعة استجابة لا مثيل لها
- فريق عمل شغوف يسمعك ويخدمك بأمانة

👇 احفظ الفيديو واكتب لنا في التعليقات عشان يوصلك كود خصم الافتتاح الخاص!`,
      visualDirection: 'لقطات سينمائية مقربة مع إضاءة دافئة، تدرج لوني يعكس ألوان الهوية البصرية، وظهور سلس لشعار البراند في النهاية.',
      videoScript: 'المشهد 1 (0-3 ثوان): لقطة مقربة وسريعة للمنتج أو الخدمة.\nالمشهد 2 (3-12 ثانية): استعراض خطوات العمل والإتقان بحركة ديناميكية.\nالمشهد 3 (12-15 ثانية): دعوة للتواصل وظهور الشعار ورابط الحجز.',
      cta: 'تواصل معنا الآن عبر الرسائل أو الواتساب واستمتع بخصم الافتتاح الخاص!',
      hashtags: ['#مصر', '#مشروع_جديد', '#جودة_عالية', '#ريادة_أعمال', '#خدمة_متميزة'],
      locked: false,
    },
    {
      id: 'post-2',
      platform: 'انستجرام وفيسبوك',
      format: 'كاروسيل تعليمي وتوضيحي',
      hook: '3 أخطاء شائعة يقع فيها الكثيرون.. وكيف تجنبناها لنقدم الأفضل؟ 💡',
      caption: `السوق مليان اختيارات، بس مين بيكمل معاك للأخر ويهتم براحتك؟
في هذا الكاروسيل، بنشارك معاكم الفلسفة اللي بنينا عليها البراند، وكيف قدرنا نتجاوز التحديات التقليدية لنضمن لكم أعلى قيمة ورضا حقيقي.

📌 مرر الشاشة لليسار واكتشف الفرق بنفسك!`,
      visualDirection: 'تصميم كاروسيل من 4 شرائح موحدة الخلفية، خطوط عربية حديثة وواضحة، مع أيقونات مسطحة أنيقة.',
      videoScript: '',
      cta: 'احفظ الكاروسيل وشاركه مع من يهمه الأمر، وتابعنا للمزيد من الأفكار المفيدة!',
      hashtags: ['#نصائح_ذكية', '#القاهرة', '#تطوير', '#كاروسيل_تفاعلي', '#مصر'],
      locked: false,
    },
    {
      id: 'post-3',
      platform: 'فيسبوك ومجموعات المجتمع',
      format: 'عرض الافتتاح الترحيبي',
      hook: 'أول 50 عميل لهم ميزة خاصة وخصم 20% بمناسبة انطلاقنا رسمياً! 🎁',
      caption: `يسعدنا أن نعلن عن استقبال أولى طلباتكم رسمياً!
تقديراً لثقتكم الأولى، خصصنا لأول 50 عميل خصماً حصرياً بنسبة 20% على كافة الطلبات والخدمات، مع أولوية تسليم فورية.

🏷️ العرض ساري حتى نفاد المقاعد أو انتهاء الأسبوع الافتتاحي.`,
      visualDirection: 'صورة احترافية واضحة للمنتج / الخدمة مع ألوان الهوية المعتمدة وأرقام التواصل المباشرة بدون أي تكلف.',
      videoScript: '',
      cta: 'ابعت لنا رسالة الآن بكلمة "افتتاح" للطلب الفوري ومحادثة الفريق مباشرة!',
      hashtags: ['#عرض_الافتتاح', '#خصم_خاص', '#خدمة_متميزة', '#عروض_مصر'],
      locked: false,
    },
  ];
}

// Full Project Generator
export function generateIntelligentFallbackBrand(inputs: BrandInputData): BrandProject {
  const analysis = analyzeIdea(inputs.idea);
  const budgetNum = Number(inputs.budget) || 45000;
  const varCostNum = inputs.knownVariableCosts ? Number(inputs.knownVariableCosts) : undefined;
  const fixCostNum = inputs.knownMonthlyFixedCosts ? Number(inputs.knownMonthlyFixedCosts) : undefined;

  const names = buildNames(inputs.idea, analysis);
  const slogans = buildSlogans(inputs.idea, analysis);
  const palette = buildPalette(analysis);
  const pricing = buildPricing(budgetNum, varCostNum, fixCostNum, analysis, inputs.idea, inputs.city, inputs.district);
  const days = buildMarketingDays(inputs.idea, analysis);
  const posts = buildMarketingPosts(inputs.idea, analysis);

  const brief: BrandBrief = {
    id: `brief-${Date.now()}`,
    idea: inputs.idea,
    category: inputs.category || analysis.category,
    businessModel: 'hybrid',
    city: inputs.city || 'القاهرة',
    targetAudience: inputs.targetAudience || 'المستهلكون في مصر الباحثون عن الجودة والموثوقية والحلول العصرية',
    pricingPosition: 'mid',
    personality: inputs.personality || 'عصري فاخر',
    budgetEgp: budgetNum,
    knownVariableCostsEgp: varCostNum,
    knownMonthlyFixedCostsEgp: fixCostNum,
    assumptions: [
      'نموذج العمل يجمع بين المبيعات المباشرة والقنوات الرقمية الميسرة.',
      'السوق المصري يفضل الشفافية العالية، وسرعة التوصيل، والتواصل باللغة العربية الواضحة.',
    ],
    provenance: { idea: 'user', category: 'proposal' },
    briefRevision: 1,
  };

  const identity: BrandIdentity = {
    names,
    selectedNameId: names[0].id,
    slogans,
    selectedSloganId: slogans[0].id,
    strategy: {
      story:
        names[0]?.story ||
        (analysis.industryId === 'street-food'
          ? `بدأت قصة "${names[0]?.nameAr}" من نار الصاج ورائحة الطشة البلدي التي تملأ أزقة الحارة، لنقدم لمحبي الأكل الشعبي تجربة كبدة وسجق بلدي طازجة 100% بتتبيلة متوارثة وعيش بلدي سخن يرد الروح.`
          : `بدأت قصة "${names[0]?.nameAr}" من شغف حقيقي بتقديم أفضل ما في ${inputs.idea} بأعلى معايير الجودة والأمانة التي تليق بالزبائن في ${inputs.city || 'مصر'}.`),
      purpose: `تقديم تجربة استثنائية متكاملة تجمع بين الجودة، القيمة التنافسية العادلة، والخدمة الراقية.`,
      mission: `تمكين كل عميل من الاستمتاع بأفضل المنتجات والخدمات بسهولة مطلقة وأعلى جودة.`,
      vision: `أن نصبح العلامة التجارية الأولى والأكثر ثقة وإلهاماً في هذا المجال داخل مصر خلال السنوات الثلاث القادمة.`,
      values: ['الشفافية المطلقة', 'الإتقان في التفاصيل', 'احترام وقت العميل', 'التحسين المستمر'],
      positioning: names[0]?.positioning || `العلامة التي تجمع بين الجودة الأصيلة والسعر العادل في متناول اليد.`,
      valueProposition: `أعلى معايير الجودة الملموسة وسرعة الخدمة ورضا الزبون في كل تجربة.`,
      differentiators: [
        'خدمة عملاء فائقة الاستجابة تتابع ما بعد البيع',
        'تصاميم ومواصفات مخصصة لتلائم الذوق والاحتياج المحلي',
        'أسعار واضحة وعادلة بدون مصاريف خفية بالجنيه المصري',
      ],
      audienceNeeds: ['الموثوقية والأمان في الشراء', 'سهولة التواصل الفوري', 'القيمة الحقيقية مقابل السعر'],
      coreMessages: ['جودة تثق بها في كل خطوة', 'مصنوع ومصمم خصيصاً لأجلك', 'راحة بالك مضمونة معنا'],
    },
    voice: {
      traits: names[0]?.toneTraits || ['ودود', 'واثق', 'ملهم', 'مباشر'],
      doSay: [
        'يسعدنا دائماً خدمتك',
        'على الأصول ومن القلب',
        'حقك علينا ومسؤوليتنا راحتك',
        'جاهزون لمساعدتك فوراً',
      ],
      doNotSay: [
        'المشكلة ليست من طرفنا',
        'هذا هو النظام ولا يمكن تعديله',
        'أسعار غير معلنة بالخاص فقط',
      ],
      greetingExample:
        names[0]?.greetingExample ||
        `يا أهلاً وسهلاً بك في ${names[0]?.nameAr}! نورتنا ويسعدنا تقديم أحلى وأجود تجربة تليق بذوقك.`,
      promoExample:
        names[0]?.promoExample ||
        `بمناسبة إطلاق هويتنا في ${names[0]?.nameAr}، جهزنا لك ميزة خاصة تفرح قلبك.. اطلب الآن واستفد من الخصم!`,
      replyExample: 'ألف شكر لذوقك ورأيك الغالي! رأيك هو بوصلتنا الدائمة لتقديم الأفضل.',
    },
    palette,
    isLocked: false,
  };

  const marketing: BrandMarketing = {
    audienceOverview: `الشباب والعائلات وأصحاب الذوق الرفيع في مصر (${inputs.city || 'القاهرة والإسكندرية والمحافظات'}) الذين يستخدمون منصات التواصل للتسوق والتفاعل ويفضلون العلامات التي توفر تجربة سريعة وتواصلاً إنسانياً دافئاً.`,
    acquisitionChannels: [
      { channel: 'انستجرام وتيك توك (Reels / Shorts)', rationale: 'القناة الأسرع لبناء الوعي والانتشار البصري بين الفئات النشطة.' },
      { channel: 'فيسبوك والمجتمعات المحلية الموجهة', rationale: 'لبناء الثقة العميقة، جمع التقييمات، والتفاعل المباشر مع العملاء.' },
      { channel: 'تطبيق الواتساب للأعمال (WhatsApp Business)', rationale: 'لإغلاق المبيعات، إرسال الكتالوج، وخدمة العملاء الفورية.' },
    ],
    coreLaunchMessage: `معانا.. الجودة والراحة بقت تجربة حقيقية تعيشها كل يوم!`,
    days,
    posts,
  };

  const visuals: BrandVisuals = {
    visualDirection: `هوية بصرية معاصرة تعتمد على الخطوط النظيفة، التباين العالي، والرمزية الهندسية المسطحة مع استخدام متناغم لأكواد الألوان الستية (${analysis.primaryColor} و ${analysis.secondaryColor}).`,
    logoPrompt: `Minimalist vector logo glyph for modern brand "${names[0].nameEn}", flat geometric emblem, clean lines, centered, elegant composition on plain background, using hex colors ${analysis.primaryColor} and ${analysis.secondaryColor}, high contrast, vector art style, iconic, no realistic photographic noise.`,
    avatarPrompt: `Square 1:1 circular profile avatar badge for brand "${names[0].nameEn}", centered iconic symbol, circle safe zone, high aesthetic contrast, bold silhouette, professional mobile app icon design, flat vector art, hex colors ${analysis.primaryColor} and ${analysis.secondaryColor}.`,
    logoGallery: [],
    avatarGallery: [],
  };

  return {
    id: `brand-${Date.now()}`,
    title: names[0].nameAr,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brief,
    identity,
    pricing,
    marketing,
    visuals,
    suggestions: {
      identity: ['اقتراح أسماء إضافية بروح مصرية أصيلة', 'تجربة لوحة ألوان دافئة مهدئة', 'تخصيص نبرة الصوت للإعلانات الصيفية'],
      pricing: ['إضافة باقة عائلية مجمعة بخصم 15%', 'تجربة خطة اشتراك شهري مع توصيل مجاني', 'إعادة احتساب التكاليف الثابتة مع التوسع'],
      marketing: ['إطلاق مسابقة تصوير تفاعلية مع العملاء', 'التعاون مع مؤثرين صغار موثوقين (Micro-influencers)', 'نشر مقاطع وراء الكواليس لتصنيع وتغليف الطلبات'],
    },
    staleSections: {},
    revisions: {
      identity: [],
      pricing: [],
      marketing: [],
      visuals: [],
    },
  };
}

// Fallback for Scoped Operations
export function handleFallbackScopedOp(operation: string, payload: any) {
  const { brandBrief } = payload;
  const idea = brandBrief?.idea || 'مشروع مصري متميز';
  const analysis = analyzeIdea(idea);

  if (operation === 'appendNames') {
    let domainNames: BrandNameCandidate[] = [];

    if (analysis.industryId === 'dental') {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: 'بيرل لطب وجراحة الأسنان',
          nameEn: 'Pearl Dental Care',
          pronunciation: 'بيـ-رل',
          meaning: 'اللؤلؤة البيضاء النقية التي ترمز لبياض وتألق الأسنان الطبيعية.',
          rationale: 'اسم راقٍ وسهل التداول يعزز الثقة في النتيجة الجمالية.',
          emotionalAssociations: ['بياض ناصع', 'أناقة', 'ثقة تامة'],
          style: 'تجميلي راقٍ',
          tradeoff: 'يركز على الجانب التجميلي والوقائي.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: 'كراون لطب الأسنان الرقمي',
          nameEn: 'Crown Dental Studio',
          pronunciation: 'كـ-راون',
          meaning: 'التاج الملكي، إشارة إلى تيجان وزراعة الأسنان بأعلى المعايير.',
          rationale: 'قصير، عصري، ويرسخ الهيبة الطبية المتطورة.',
          emotionalAssociations: ['فخامة', 'دقة تقنية', 'راحة'],
          style: 'طبي معاصر',
          tradeoff: 'يناسب التركيبات والزراعة المتقدمة.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'فيروز سمايل',
          nameEn: 'Fayrouz Smile',
          pronunciation: 'فـ-يروز سمايل',
          meaning: 'حجر الفيروز الكريم المبهج، مع ابتسامة صحية وجميلة.',
          rationale: 'محبوب عاطفياً في مصر ويبث البهجة والطمأنينة.',
          emotionalAssociations: ['بهجة', 'طمأنينة', 'إشراقة'],
          style: 'عصري مبهج',
          tradeoff: 'طابعه عائلي وودود.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-4`,
          nameAr: 'وايت كير التخصصي للأسنان',
          nameEn: 'WhiteCare Dental',
          pronunciation: 'وايت-كير',
          meaning: 'العناية الفائقة ببياض وصحة الفم والأسنان بأحدث أجهزة الليزر.',
          rationale: 'مباشر وسهل النطق ويحدد الخدمة بوضوح.',
          emotionalAssociations: ['نقاء', 'عناية فائقة', 'أمان طبي'],
          style: 'حديث مباشر',
          tradeoff: 'يحتاج تركيز تسويقي.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-5`,
          nameAr: 'سمايل آرت للأسنان',
          nameEn: 'SmileArt Clinic',
          pronunciation: 'سمايل-آرت',
          meaning: 'فن رسم وتجميل الابتسامة بمعايير هندسية وطبية دقيقة.',
          rationale: 'يخاطب الباحثين عن هوليوود سمايل وتجميل الأسنان.',
          emotionalAssociations: ['فن وإتقان', 'تألق', 'جمال طبيعي'],
          style: 'فني تجميلي',
          tradeoff: 'يركز على تجميل وتقويم الأسنان.',
          recommended: false,
        },
      ];
    } else if (analysis.industryId === 'medical') {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: 'دار الشفاء للعيادات التخصصية',
          nameEn: 'Dar Al-Shefaa Clinics',
          pronunciation: 'دار الشِـ-فاء',
          meaning: 'الصرح الذي يجد فيه المريض تمام العافية والأمان الطبي.',
          rationale: 'اسم عريق يحظى باحترام وتقدير بالغ في المجتمع المصري.',
          emotionalAssociations: ['أمان', 'عافية', 'خبرة طبية'],
          style: 'وقور موثوق',
          tradeoff: 'يحتاج توضيح التخصصات الفرعية.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: 'حياة كير للخدمات الطبية',
          nameEn: 'Hayat Care Clinic',
          pronunciation: 'حـ-ياة كير',
          meaning: 'نبض الحياة والصحة المستدامة لكل مريض وأسرته.',
          rationale: 'دافئ، إنساني، ويوحي بالرعاية المستمرة.',
          emotionalAssociations: ['نبض', 'اهتمام إنساني', 'أمل'],
          style: 'إنساني معاصر',
          tradeoff: 'مناسب لطب الأسرة والعيادات المتعددة.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'كيور ميديكال هاب',
          nameEn: 'Cure Medical Hub',
          pronunciation: 'كيـ-ور',
          meaning: 'العلاج الشافي الحاسم والتشخيص الرقمي الدقيق.',
          rationale: 'عصري وسهل التداول بين الأطباء والمرضى.',
          emotionalAssociations: ['علاج حاسم', 'دقة', 'سرعة'],
          style: 'طبي حديث',
          tradeoff: 'يتطلب تعريب الاسم في اللافتات.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-4`,
          nameAr: 'رعاية التخصصي',
          nameEn: 'Reaya Specialized',
          pronunciation: 'رِعـ-اية',
          meaning: 'الاهتمام المتواصل والمتابعة الدقيقة لكل حالة.',
          rationale: 'واضح وبسيط ويعبر عن جوهر العمل الطبي.',
          emotionalAssociations: ['اهتمام', 'أمانة', 'تواصل دائم'],
          style: 'أصيل معاصر',
          tradeoff: 'شائع ويتطلب هوية بصرية قوية.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-5`,
          nameAr: 'ابن سينا للطب التخصصي',
          nameEn: 'Avicenna Clinics',
          pronunciation: 'ابن سـ-ينا',
          meaning: 'أمير الأطباء ورمز العراقة والتفوق العلمي في تاريخ الطب.',
          rationale: 'هيبة أكاديمية وتاريخية تبني ثقة فورية مع كبار السن والعائلات.',
          emotionalAssociations: ['عراقة', 'علم راسخ', 'مصداقية'],
          style: 'تاريخي رصين',
          tradeoff: 'طابعه رسمي وأكاديمي.',
          recommended: false,
        },
      ];
    } else if (analysis.industryId === 'pizza') {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: 'بيتزا كرافت',
          nameEn: 'Pizza Craft',
          pronunciation: 'بيتزا كرافت',
          meaning: 'حرفية العجينة المخمرة وصلصة الطماطم الإيطالية الطازجة والأجبان الطبيعية.',
          rationale: 'عصري ويدل على الجودة الحرفية العالية.',
          emotionalAssociations: ['عجينة ذهبية', 'أفران حجرية', 'جبنة مطاطية'],
          style: 'إيطالي حرفي',
          tradeoff: 'يركز على أفران البيتزا المتخصصة.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: 'دولتشي بيتزا',
          nameEn: 'Dolce Pizza',
          pronunciation: 'دولتشي بيتزا',
          meaning: 'الحياة الإيطالية الحلوة والبهجة المصاحبة لأحلى تجمع على صواني البيتزا الساخنة.',
          rationale: 'موسيقي ومبهج ومحبوب لدى الشباب والعائلات.',
          emotionalAssociations: ['بهجة', 'لذة إيطالية', 'طعم غني'],
          style: 'عصري مبهج',
          tradeoff: 'يناسب التجمعات والوجبات العائلية.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'أوربان سلايس',
          nameEn: 'Urban Slice',
          pronunciation: 'أوربان سلايس',
          meaning: 'شرائح البيتزا النيويوركية السريعة لشباب الجامعات ومحبي الأكل السريع المتقن.',
          rationale: 'سريع وشبابي وعملي جداً.',
          emotionalAssociations: ['سلايس جامبو', 'سرعة وإنجاز', 'طازج وسخن'],
          style: 'شبابي سريع',
          tradeoff: 'يركز على نظام السلايس والدليفري السريع.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-4`,
          nameAr: 'شريحة بركة',
          nameEn: 'Baraka Slice',
          pronunciation: 'شريحة بركة',
          meaning: 'البيتزا الشرقية والإيطالية السخية المليئة بالخير والمكونات الطازجة.',
          rationale: 'اسم دافئ يجمع بين الطابع المصري المحبوب والبيتزا اللذيذة.',
          emotionalAssociations: ['بركة وسخاء', 'طعم بيتي أصيل', 'شبع'],
          style: 'مصري شهي',
          tradeoff: 'يناسب البيتزا والفطير الشرقي.',
          recommended: false,
        },
      ];
    } else if (analysis.industryId === 'burger') {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: 'سماش بيف',
          nameEn: 'Smash Beef',
          pronunciation: 'سماش بيف',
          meaning: 'لحم بقري بلدي 100% مضغوط على الصاج الساخن مع صوص خاص وبطاطس مقرمشة.',
          rationale: 'مباشر وشبابي وعصري لعشاق السماش برجر.',
          emotionalAssociations: ['لحم بلدي', 'سماش مقرمش', 'صوص سري'],
          style: 'عصري تخصصي',
          tradeoff: 'يركز على ثقافة السماش برجر.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: 'شيدر بان برجر',
          nameEn: 'Cheddar Bun',
          pronunciation: 'شيدر بان',
          meaning: 'الخبز الطازج الغارق في صوص الشيدر الساخن مع اللحم المتبل على الأصول.',
          rationale: 'شهي ومحفز للطلب الفوري.',
          emotionalAssociations: ['جبنة شيدر سايحة', 'خبز بريوش', 'شبع ولذة'],
          style: 'شهي سريع',
          tradeoff: 'يناسب الدليفري السريع والمطاعم الشبابية.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'جريل ماستر برجر',
          nameEn: 'Grill Master Burger',
          pronunciation: 'جريل ماستر',
          meaning: 'أستاذ الشواء الذي يضبط تسوية قطعة البرجر لتظل عصارية من الداخل ومقرمشة من الخارج.',
          rationale: 'واثق ويدل على الحرفية العالية.',
          emotionalAssociations: ['لحم عصاري', 'شواء متقن', 'فخامة'],
          style: 'عالمي واثق',
          tradeoff: 'يتطلب جودة لحم ممتازة.',
          recommended: false,
        },
      ];
    } else if (analysis.industryId === 'restaurant' || analysis.industryId === 'cafe') {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: 'قعدة بلدي',
          nameEn: 'Qaada Baladi',
          pronunciation: 'قَـ-عدة بلدي',
          meaning: 'الدفء والكرم واللقمة الهنية والضيافة المصرية الأصيلة.',
          rationale: 'شعبي راقٍ قريب لقلوب الشباب والعائلات.',
          emotionalAssociations: ['أصالة', 'كرم', 'أكل بيتي شهي'],
          style: 'بلدي أصيل',
          tradeoff: 'يناسب الأكل المصري والشرقي.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: 'ميزو بيسترو',
          nameEn: 'Mezo Bistro',
          pronunciation: 'ميـ-زو',
          meaning: 'المقبلات الشهية والأطباق الخفيفة الممتعة والمشروبات المنعشة.',
          rationale: 'عصري وسريع للمقاهي والمطاعم السريعة.',
          emotionalAssociations: ['حيوية', 'طعم خفيف', 'روقان'],
          style: 'عصري غربي',
          tradeoff: 'يناسب الوجبات السريعة والمقاهي.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'سفرة الخير',
          nameEn: 'Sofret El-Kheir',
          pronunciation: 'سُـ-فرة الخير',
          meaning: 'البركة والوفرة واللقمة الطيبة التي تجمع الأحباب.',
          rationale: 'عاطفي جداً ومحبوب في العزومات والتجمعات.',
          emotionalAssociations: ['بركة', 'كرم', 'سعادة العيلة'],
          style: 'دافئ عائلي',
          tradeoff: 'يناسب المطاعم العائلية والوجبات الكبيرة.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-4`,
          nameAr: 'طشة وتتبيلة',
          nameEn: 'Tasha & Tatbeela',
          pronunciation: 'طَـ-شة وتتبيلة',
          meaning: 'أسرار الطهي المصري والخلطات الفريدة التي تفتح الشهية.',
          rationale: 'شهي ومحفز للطلب الفوري.',
          emotionalAssociations: ['رائحة شهية', 'وصفة سرية', 'سعادة'],
          style: 'مصري شهي',
          tradeoff: 'يحتاج قائمة أطباق متنوعة.',
          recommended: false,
        },
      ];
    } else {
      domainNames = [
        {
          id: `new-name-${Date.now()}-1`,
          nameAr: `إتقان ${analysis.domainWords[0] || 'الريادة'}`,
          nameEn: `Itqan Hub`,
          pronunciation: `إتـ-قان`,
          meaning: `الكمال والبراعة في تقديم الخدمة والالتزام الصارم بالجودة.`,
          rationale: `اسم عربي أصيل يبث طمأنينة فورية في نفس العميل.`,
          emotionalAssociations: ['ثقة', 'إتقان', 'عراقة'],
          style: 'احترافي رصين',
          tradeoff: 'يحتاج صياغة تسويقية توضح الحداثة.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-2`,
          nameAr: `مدار ${analysis.domainWords[1] || 'التميز'}`,
          nameEn: `Madar Center`,
          pronunciation: `مَـ-دار`,
          meaning: `الفلك المتكامل الذي تدور حوله الحلول الشاملة.`,
          rationale: `موجز وقوي وسهل الحفظ.`,
          emotionalAssociations: ['شمول', 'سرعة', 'تجدد'],
          style: 'عصري مبتكر',
          tradeoff: 'مرن جداً ويصلح لمختلف المجالات.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-3`,
          nameAr: 'سند للأعمال',
          nameEn: 'Sanad Hub',
          pronunciation: 'سَـ-نَد',
          meaning: 'الجهة الموثوقة التي تقدم الدعم الكامل والأمان للعميل.',
          rationale: 'كلمة عربية ذات معنى عميق ومريح للنفس.',
          emotionalAssociations: ['أمان', 'استقرار', 'وفاء'],
          style: 'أصيل معاصر',
          tradeoff: 'شائع في قطاعات الخدمات.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-4`,
          nameAr: 'رواق المتكامل',
          nameEn: 'Rewaq Group',
          pronunciation: 'رِ-واق',
          meaning: 'المساحة الرحبة الأنيقة ذات الطابع المريح والأصيل.',
          rationale: 'يعكس الرقي والراحة النفسية.',
          emotionalAssociations: ['راحة', 'أناقة', 'أصالة'],
          style: 'تراثي عصري',
          tradeoff: 'يحتاج تصميم شعار مميز.',
          recommended: false,
        },
        {
          id: `new-name-${Date.now()}-5`,
          nameAr: `أفق ${analysis.domainWords[2] || 'المستقبل'}`,
          nameEn: 'Ofok Pro',
          pronunciation: 'أُ-فُق',
          meaning: 'الامتداد الواسع والنظرة المستقبلية الثاقبة.',
          rationale: 'يعطي انطباعاً بالتطور والتوسع المستمر.',
          emotionalAssociations: ['تطور', 'رؤية', 'اتساع'],
          style: 'حيوي ملهم',
          tradeoff: 'طابعه هادئ ورصين.',
          recommended: false,
        },
      ];
    }

    return { names: domainNames };
  }

  if (operation === 'appendSlogans') {
    return {
      slogans: [
        {
          id: `new-slogan-${Date.now()}-1`,
          text: `معنى جديد للراحة والجودة في كل تفصيلة`,
          meaning: `التأكيد على أن العلامة تعيد صياغة المعايير لراحة المستهلك.`,
          rationale: `مباشر، مقنع، ويعالج رغبة العميل في تجنب الخيبات السابقة.`,
          useCase: 'في إعلانات السوشيال ميديا وحملات التوعية.',
        },
        {
          id: `new-slogan-${Date.now()}-2`,
          text: `اختيارك الأذكى.. من أول يوم`,
          meaning: `منح العميل الثقة في أنه اتخذ القرار الصحيح بالتعامل معنا.`,
          rationale: `قصير جداً وقوي يصلح للتذييل أسفل الشعار في كافة المطبوعات.`,
          useCase: 'الشعار الثانوي على العبوات وأكياس التوصيل.',
        },
        {
          id: `new-slogan-${Date.now()}-3`,
          text: `قريب منك.. ويفهم طلبك على الأصول`,
          meaning: `التناغم مع الثقافة المحلية وإبراز القرب والجدعنة.`,
          rationale: `يرسخ الانطباع الودود والمريح في خدمة العملاء.`,
          useCase: 'في الردود على الرسائل وقنوات التواصل المباشرة.',
        },
        {
          id: `new-slogan-${Date.now()}-4`,
          text: `لأنك تستاهل تجربة استثنائية كل يوم`,
          meaning: `مخاطبة تقدير الذات لدى العميل وإشعاره بالتميز.`,
          rationale: `يخلق ارتباطاً عاطفياً إيجابياً وممتداً مع البراند.`,
          useCase: 'في حملات الولاء ورسائل شكر العملاء بعد الشراء.',
        },
      ],
    };
  }

  if (operation === 'proposePalette') {
    const palettes = [
      [
        { role: 'primary', nameAr: 'نيلي ملكي فاخر', hex: '#4338CA', usageNote: 'الشعار الرسمي والعناصر الأبرز' },
        { role: 'secondary', nameAr: 'فيروزي مشرق', hex: '#06B6D4', usageNote: 'البادجات والبطاقات التفاعلية' },
        { role: 'accent', nameAr: 'عنبري دافئ', hex: '#F59E0B', usageNote: 'أزرار الشراء ونقاط التركيز' },
        { role: 'background', nameAr: 'كحلي ليلي عميق', hex: '#0B0F19', usageNote: 'خلفية الشاشات المريحة' },
        { role: 'text', nameAr: 'أبيض لؤلؤي نقي', hex: '#F8FAFC', usageNote: 'نصوص القراءة الواضحة' },
      ],
      [
        { role: 'primary', nameAr: 'زمردي عميق', hex: '#047857', usageNote: 'العنصر الرئيسي والهوية' },
        { role: 'secondary', nameAr: 'أخضر نعناعي مشرق', hex: '#10B981', usageNote: 'مؤشرات النجاح والتأكيد' },
        { role: 'accent', nameAr: 'ذهبي شمسي', hex: '#EAB308', usageNote: 'لفت الانتباه والعروض الخاصة' },
        { role: 'background', nameAr: 'رمادي ليلي أنيق', hex: '#0F172A', usageNote: 'المساحة العامة' },
        { role: 'text', nameAr: 'رمادي فاتح بلوري', hex: '#F1F5F9', usageNote: 'القراءة والفقرات' },
      ],
    ];
    return { palette: palettes[Math.floor(Math.random() * palettes.length)] };
  }

  if (operation === 'refineVisualPrompt') {
    return {
      prompt: `Minimalist modern vector icon, flat geometry, clean symmetric lines, pristine aesthetic, professional vector graphic design, centered on neutral background, rich primary and secondary colors, vector SVG quality, no text or typography, no photo-realistic noise.`,
    };
  }

  if (operation === 'updateDependencies') {
    return {
      strategy: {
        story: `استراتيجية محدثة لتعزيز مكانة العلامة التجارية في السوق المصري، تركز على الأصالة والتفاعل السريع مع متطلبات العملاء المتجددة.`,
        mission: `تقديم أفضل تجربة مريحة وموثوقة تجمع بين الجودة الفائقة والقيمة الاستثنائية.`,
        positioning: `العلامة الرائدة التي تضع راحة ورضا العميل في قلب كل قرار.`,
      },
      coreLaunchMessage: `معنا.. تجربتك أسهل، أرقى، ومضمونة على الأصول!`,
      logoPrompt: `Clean flat vector logo mark for "${brandBrief?.idea || 'Brand'}", minimalist geometry, centered, high aesthetic harmony, vector graphic.`,
    };
  }

  return { success: true };
}

// Generate tailored dynamic SVG vector mark with embedded brand name typography
export function generateDynamicBrandSvg(
  type: 'logo' | 'avatar',
  brandName = 'البراند',
  primaryColor = '#4F46E5',
  secondaryColor = '#06B6D4'
): string {
  const safeId = `grad-${Math.random().toString(36).slice(2, 7)}`;
  const filterId = `filter-${Math.random().toString(36).slice(2, 7)}`;
  const cleanName = (brandName || 'براندك').trim();

  if (type === 'avatar') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <linearGradient id="${safeId}-glow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="${primaryColor}" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Background Base Circle -->
  <circle cx="300" cy="300" r="290" fill="#0B0F19" />
  
  <!-- Outer Accent Rings -->
  <circle cx="300" cy="300" r="275" fill="none" stroke="url(#${safeId})" stroke-width="4" stroke-dasharray="8 6" opacity="0.6" />
  <circle cx="300" cy="300" r="255" fill="none" stroke="#1E293B" stroke-width="2" />
  
  <!-- Central Glowing Shield Badge -->
  <circle cx="300" cy="300" r="220" fill="url(#${safeId})" filter="url(#${filterId})" />
  <circle cx="300" cy="300" r="220" fill="url(#${safeId}-glow)" />
  <circle cx="300" cy="300" r="195" fill="#0B0F19" opacity="0.88" />
  
  <!-- Geometric Emblem / Monogram -->
  <g transform="translate(300, 250)">
    <polygon points="0,-75 65,-37 65,37 0,75 -65,37 -65,-37" fill="none" stroke="url(#${safeId})" stroke-width="6" stroke-linejoin="round" />
    <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="url(#${safeId})" opacity="0.25" />
    <circle cx="0" cy="0" r="24" fill="#FFFFFF" />
    <circle cx="0" cy="0" r="14" fill="${primaryColor}" />
    <polygon points="0,-20 12,0 0,20 -12,0" fill="#FFFFFF" />
  </g>

  <!-- Brand Name Typography -->
  <text x="300" y="415" text-anchor="middle" font-family="'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="1">
    ${cleanName}
  </text>
  <text x="300" y="445" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${secondaryColor}" letter-spacing="4">
    OFFICIAL BRAND
  </text>
</svg>`;
  }

  // Logo: Standalone flat vector mark on neutral luxury surface with brand name
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <linearGradient id="${safeId}-subtle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.04" />
    </linearGradient>
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="${primaryColor}" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Canvas Surface -->
  <rect width="600" height="600" rx="44" fill="#0B0F19" />
  <rect x="18" y="18" width="564" height="564" rx="36" fill="url(#${safeId}-subtle)" stroke="#1E293B" stroke-width="2" />

  <!-- Modern Luxury Geometric Emblem -->
  <g transform="translate(300, 230)" filter="url(#${filterId})">
    <!-- Outer Golden Octagon / Rhombus -->
    <polygon points="0,-120 120,0 0,120 -120,0" fill="none" stroke="url(#${safeId})" stroke-width="8" stroke-linejoin="round" />
    <polygon points="0,-95 95,0 0,95 -95,0" fill="url(#${safeId})" opacity="0.15" />
    
    <!-- Concentric Symmetrical Geometric Layers -->
    <circle cx="0" cy="0" r="58" fill="#0B0F19" stroke="url(#${safeId})" stroke-width="4" />
    <circle cx="0" cy="0" r="42" fill="url(#${safeId})" />
    
    <!-- Crisp Central Accent Crown / Diamond -->
    <polygon points="0,-24 22,12 -22,12" fill="#FFFFFF" />
    <circle cx="0" cy="0" r="6" fill="${primaryColor}" />

    <!-- Corner Constellation Dots -->
    <circle cx="0" cy="-120" r="7" fill="${secondaryColor}" />
    <circle cx="120" cy="0" r="7" fill="${secondaryColor}" />
    <circle cx="0" cy="120" r="7" fill="${primaryColor}" />
    <circle cx="-120" cy="0" r="7" fill="${primaryColor}" />
  </g>

  <!-- Brand Name Typography (Prominent, High-Contrast & Elegant) -->
  <g transform="translate(300, 440)">
    <!-- Arabic Brand Name -->
    <text x="0" y="0" text-anchor="middle" font-family="'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" letter-spacing="1">
      ${cleanName}
    </text>
    
    <!-- Divider Line with Diamond Center -->
    <line x1="-120" y1="24" x2="-20" y2="24" stroke="#334155" stroke-width="1.5" />
    <polygon points="0,20 4,24 0,28 -4,24" fill="${secondaryColor}" />
    <line x1="20" y1="24" x2="120" y2="24" stroke="#334155" stroke-width="1.5" />

    <!-- Category / Modern Sub-label -->
    <text x="0" y="48" text-anchor="middle" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="${secondaryColor}" letter-spacing="6">
      IDENTITY &amp; BRAND
    </text>
  </g>
</svg>`;
}
