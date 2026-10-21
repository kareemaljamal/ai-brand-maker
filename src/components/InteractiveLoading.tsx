import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Clock,
  HelpCircle,
  RefreshCw,
  XCircle,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface InteractiveLoadingProps {
  idea: string;
  onCancel?: () => void;
  statusMessage?: string;
  onRestartAi?: () => void;
  isRestarting?: boolean;
}

const STEPS = [
  { id: 1, label: 'تحليل الفكرة ودراسة طبيعة النشاط والجمهور', detail: 'تحليل سلوكيات الشراء والجمهور المستهدف في مصر' },
  { id: 2, label: 'ابتكار 6 أسماء مقترحة وشعارات لفظية مخصصة للفكرة', detail: 'توليد 6 أسماء عربية ملهمة ومتقنة للفكرة تحديداً بالذكاء الاصطناعي' },
  { id: 3, label: 'صياغة هوية البراند ونبرة الصوت ولوحة الألوان', detail: 'القصة، الرؤية، القيم، ما يُقال، وأكواد الألوان الرسمية' },
  { id: 4, label: 'دراسة وهندسة استراتيجية التسعير وهيكل الأرباح', detail: 'تحديد 3 باقات تسعيرية بالجنيه المصري وحساب التكاليف' },
  { id: 5, label: 'صياغة خطة التسويق لـ 30 يوماً والمنشورات', detail: '30 يوماً من خطط الانتشار ومنشورات جاهزة للنشر' },
  { id: 6, label: 'هندسة الهوية البصرية وتوجيهات الشعار', detail: 'توجيهات تصميم الشعار واستوديو التوليد الفوري' },
];

const LIVE_ACTIVITIES = [
  'جاري الآن ابتكار الأسماء وتجهيز الهوية للمشروع...',
  'يقوم النظام الآن بدراسة خطة تسويقية وفهم متطلبات السوق المصري...',
  'جاري الآن تجهيز خطة التسويق ودراسة استراتيجية الانتشار...',
  'تحليل سلوكيات الشراء وتحديد الشريحة المستهدفة للنشاط...',
  'صياغة السلوجان والنبرة الترويجية الملائمة للجمهور...',
  'تجهيز لوحة ألوان احترافية وتنسيق الأكواد البصرية...',
];

const QUIZ_QUESTIONS = [
  {
    question: 'ما هو الوقت الأكثر تفاعلاً لنشر منشورات وريلز في مصر؟',
    options: ['8:00 - 11:00 مساءً', '7:00 - 9:00 صباحاً', '2:00 - 4:00 عصراً'],
    correctIndex: 0,
    explanation: 'تظهر الدراسات أن الذروة الكبرى للمستخدمين في مصر هي في المساء بعد انتهاء ساعات العمل والتجمع العائلي.',
  },
  {
    question: 'ما الذي يفضله المستهلك المصري عند شراء منتج جديد لأول مرة؟',
    options: ['توصية من صديق أو تجربة حقيقية', 'إعلان مدفوع ضخم', 'تصميم الموقع فقط'],
    correctIndex: 0,
    explanation: 'التوصيات الشفهية (Word of Mouth) والمراجعات الحقيقية هي العامل رقم 1 في بناء الثقة بالسوق المصري.',
  },
  {
    question: 'كم يبلغ متوسط الوقت الذي يقرر فيه الزائر البقاء في صفحة براندك أو مغادرتها؟',
    options: ['أقل من 3 ثوانٍ', '30 ثانية', 'دقيقتان'],
    correctIndex: 0,
    explanation: 'الانطباع الأول يتشكل في أول 3 ثوانٍ فقط، لذا فإن الشعار الواضح والرسالة المباشرة في غاية الأهمية.',
  },
  {
    question: 'في استراتيجية التسعير، ما هي الباقة التي يختارها أكثر من 60% من العملاء؟',
    options: ['الباقة المتوسطة الأكثر شيوعاً', 'أرخص باقة دائماً', 'الباقة الأغلى فقط'],
    correctIndex: 0,
    explanation: 'نفسياً يميل معظم العملاء للخيار الأوسط المتوازن (Center-stage effect) لتجنب الحرمان أو التكلفة العالية.',
  },
];

const BUSINESS_TIPS = [
  'الاسم القصير (من كلمة أو كلمتين) أسهل بنسبة 70% في التذكر وتناقل الأحاديث الشفهية بين الناس.',
  'الوضوح دائماً يكسب الذكاء: اشرح ما يقدمه مشروعك في 5 ثوانٍ قبل محاولة التكلف في التعبير.',
  'في السوق المصري، سياسة الاسترجاع السهلة والشفافية في أسعار التوصيل تزيد معدل التحويل بمقدار الضعف.',
  'لا تبدأ بكل منصات التواصل معاً، ركز على منصة واحدة حتى تتقن جمهورها ثم توسع تدريجياً.',
  'الألوان الدافئة (البرتقالي، الأحمر، العسلي) تحفز الشهية والإقبال في مشاريع الأغذية والمطاعم.',
  'التسعير بالنهايات النفسية (مثلاً 199 بدلاً من 200) ما زال يحقق زيادة ملحوظة في قرار الشراء.',
];

const SPARK_MILESTONES = [
  { count: 3, msg: 'بداية رائعة! الأفكار تولد من الشغف ✨' },
  { count: 7, msg: 'طاقة إبداعية عالية! مشروعك سيكون استثنائياً 🚀' },
  { count: 12, msg: 'خبير إلهام! البراند القوي يبدأ من فكرة جريئة 💡' },
  { count: 20, msg: 'أسطورة رواد الأعمال! الذكاء الاصطناعي يضع اللمسات الأخيرة 🏆' },
];

export const InteractiveLoading: React.FC<InteractiveLoadingProps> = ({
  idea,
  onCancel,
  statusMessage,
  onRestartAi,
  isRestarting,
}) => {
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Active step in sequence (Step 1 is fast-analyzed in 500ms, Step 2 is active AI Identity generation)
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic live activity log
  const [activityIndex, setActivityIndex] = useState(0);

  // Interactive Feature 1: Inspiration Clicker
  const [sparksCount, setSparksCount] = useState(0);
  const [sparkMessage, setSparkMessage] = useState<string | null>(null);
  const [isSparkAnimating, setIsSparkAnimating] = useState(false);

  // Interactive Feature 2: Mini Marketing Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Interactive Feature 3: Business Tip
  const [tipIndex, setTipIndex] = useState(0);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Step progression: Step 1 completes swiftly in 500ms, then Step 2 is actively working
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 500);
    return () => clearTimeout(t1);
  }, []);

  // Rotate live activity text
  useEffect(() => {
    const actInterval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 2800);
    return () => clearInterval(actInterval);
  }, []);

  // Clicker Handler
  const handleTapSpark = () => {
    const newCount = sparksCount + 1;
    setSparksCount(newCount);
    setIsSparkAnimating(true);
    setTimeout(() => setIsSparkAnimating(false), 300);

    const milestone = SPARK_MILESTONES.find((m) => m.count === newCount);
    if (milestone) {
      setSparkMessage(milestone.msg);
    }
  };

  // Quiz Answer Handler
  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === QUIZ_QUESTIONS[quizIndex].correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % BUSINESS_TIPS.length);
  };

  // Formatted timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl my-auto text-[#172033] dark:text-slate-100" dir="rtl">
        {/* ================= MAIN POPUP CARD ================= */}
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-7 shadow-2xl space-y-5">
          {/* Top Header Row with Live Indicator & Cancel Button */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/60 border border-[#DDD6FE] dark:border-indigo-800 flex items-center justify-center text-[#7C3AED] dark:text-indigo-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7C3AED]"></span>
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black text-[#172033] dark:text-white flex items-center gap-2">
                  <span>جاري ابتكار هوية مشروعك بالذكاء الاصطناعي</span>
                  <span className="text-[#7C3AED]">⚡</span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>الوقت المنقضي: </span>
                  <span className="font-mono font-bold text-[#7C3AED] dark:text-indigo-400" dir="ltr">
                    {formatTime(secondsElapsed)}
                  </span>
                  <span>• انتقال تلقائي لصفحة الهوية فور اكتمال الأسماء</span>
                </div>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#526077] dark:text-slate-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="إلغاء والعودة للرئيسية"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">إلغاء</span>
              </button>
            )}
          </div>

          {/* Selected Idea Bubble */}
          <div className="p-3 rounded-2xl bg-[#F8F7FC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#64748B] dark:text-slate-400 shrink-0 font-medium">فكرة مشروعك:</span>
            <span className="font-bold text-[#172033] dark:text-slate-100 truncate">{idea}</span>
          </div>

          {/* Dynamic Activity Indicator Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#7C3AED] dark:text-indigo-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>النشاط الجاري:</span>
              </span>
              <span className="text-[#64748B] font-mono text-[11px]">
                {Math.min(92, Math.max(20, secondsElapsed * 8))}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-[#7C3AED] to-violet-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(92, Math.max(20, secondsElapsed * 8))}%` }}
              />
            </div>

            <p className="text-xs text-[#526077] dark:text-slate-300 font-medium transition-all duration-300 pt-0.5">
              {LIVE_ACTIVITIES[activityIndex]}
            </p>
          </div>

          {/* Real-time AI Status & Self-Healing Restart Control */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-indigo-950 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400 shrink-0 animate-pulse" />
              <span className="font-semibold leading-relaxed">
                {statusMessage || 'الذكاء الاصطناعي متصل ومستمر في التوليد المخصص لمشروعك ⚡'}
              </span>
            </div>

            {onRestartAi && (
              <button
                onClick={onRestartAi}
                disabled={isRestarting}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#7C3AED] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-60"
                title="إعادة تشغيل الذكاء الاصطناعي فوراً في حال حدوث أي بطء"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                <span>{isRestarting ? 'جاري الاستئناف...' : 'إعادة تشغيل الـ AI 🔄'}</span>
              </button>
            )}
          </div>

          {/* 5 Ordered Steps Sequence */}
          <div className="space-y-1.5 pt-1 border-t border-[#E2E8F0] dark:border-slate-800">
            <span className="text-xs font-bold text-[#64748B] dark:text-slate-400 block mb-1.5">
              مراحل التجهيز الذكي:
            </span>

            <div className="space-y-1.5">
              {STEPS.map((s) => {
                const isDone = s.id < currentStep;
                const isCurrent = s.id === currentStep;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-[#EDE9FE] dark:bg-indigo-950/50 border border-[#DDD6FE] dark:border-indigo-800 shadow-sm'
                        : isDone
                        ? 'bg-[#F8F7FC] dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/80 opacity-90'
                        : 'bg-transparent border border-transparent opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-[#7C3AED] text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                      </div>

                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#172033] dark:text-white block">
                          {s.label}
                        </span>
                        <span className="text-[10px] text-[#64748B] dark:text-slate-400 hidden sm:block">
                          {s.detail}
                        </span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-indigo-900/60 text-[#5B21B6] dark:text-indigo-300 font-bold shrink-0 border border-[#DDD6FE] dark:border-indigo-700 animate-pulse">
                        جاري بالذكاء الاصطناعي ⚡
                      </span>
                    ) : isDone ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                        مكتمل ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8] dark:text-slate-500 font-medium shrink-0">
                        في الخلفية ⏳
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= COMPACT INTERACTIVE WIDGET ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E2E8F0] dark:border-slate-800">
            {/* WIDGET 1: Interactive Inspiration Spark Clicker */}
            <div className="bg-[#FAF9FD] dark:bg-slate-900/40 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#7C3AED] dark:text-indigo-400">
                    <Flame className="w-3.5 h-3.5" />
                    <h4 className="text-xs font-bold text-[#172033] dark:text-white">
                      محفّز الإلهام التفاعلي
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-800">
                    {sparksCount} طاقة
                  </span>
                </div>

                <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-snug mb-2">
                  اضغط لشحن طاقتك الإبداعية واكتشاف نصائح سريعة أثناء التجهيز!
                </p>

                {sparkMessage && (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 font-bold mb-2">
                    {sparkMessage}
                  </div>
                )}
              </div>

              <button
                onClick={handleTapSpark}
                className={`w-full py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  isSparkAnimating ? 'scale-105' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>إضافة شرارة إلهام ✨</span>
              </button>
            </div>

            {/* WIDGET 2: Fast Business Tip */}
            <div className="bg-[#FAF9FD] dark:bg-slate-900/40 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <h4 className="text-xs font-bold text-[#172033] dark:text-white">
                      نصيحة ذهبية للسوق المصري
                    </h4>
                  </div>
                  <button
                    onClick={handleNextTip}
                    className="text-[10px] text-[#7C3AED] dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>نصيحة أخرى</span>
                    <ArrowRight className="w-2.5 h-2.5 rotate-180" />
                  </button>
                </div>

                <p className="text-[11px] text-[#526077] dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/60 p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
                  {BUSINESS_TIPS[tipIndex]}
                </p>
              </div>

              <div className="text-[10px] text-[#94A3B8] dark:text-slate-400 text-center pt-2">
                يتم بناء مشروعك بالذكاء الاصطناعي وفق أحدث معايير السوق 🚀
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
