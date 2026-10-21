import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  FileSpreadsheet,
  Megaphone,
  Palette,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Clock,
  Flame,
  Tag,
} from 'lucide-react';
import { TabKey } from './TabNav';

interface SectionLoadingViewProps {
  sectionKey: TabKey;
  idea: string;
  readySections: TabKey[];
  onNavigateToSection: (tab: TabKey) => void;
}

const SECTION_META: Record<
  TabKey,
  {
    titleAr: string;
    icon: React.ElementType;
    color: string;
    description: string;
    steps: string[];
    tips: string[];
  }
> = {
  names: {
    titleAr: 'الأسماء',
    icon: Tag,
    color: 'from-purple-600 to-indigo-600',
    description: 'نقوم بابتكار 6 أسماء عربية متقنة ومتباينة مخصصة تحديداً لطبيعة نشاطك مع الشعارات اللفظية وسر التسمية.',
    steps: [
      'تحليل الفكرة واستكشاف الجذور اللغوية العربية المناسبة في السوق المصري...',
      'ابتكار 6 أسماء عربية متقنة مع دلالاتها ومبررات اختيارها ونطقها...',
      'صياغة الشعارات اللفظية الرنانة التي تعلق في ذهن الزبائن...',
    ],
    tips: [
      'الاسم القصير الخفيف على اللسان يعلق في ذهن المستهلك أسرع بـ 3 أضعاف.',
      'وجود اسم عربي أصيل يسهل نطقة يعزز التناقل الشفهي في مصر.',
    ],
  },
  identity: {
    titleAr: 'الهوية',
    icon: Sparkles,
    color: 'from-violet-600 to-purple-600',
    description: 'نقوم بصياغة قصة البراند المخصصة لاسمك، الرسالة والرؤية والقيم، نبرة الخطاب، ولوحة الألوان.',
    steps: [
      'تكييف قصة البراند المركزية مع الاسم المعتمد وتحديد التموضع...',
      'صياغة الرؤية، الرسالة، والقيم الجوهرية الأربع...',
      'تحديد نبرة الصوت المصرية، ما يُقال وما يُتجنب قوله للعملاء...',
      'تنسيق لوحة الألوان الرسمية بأكواد HEX متناسقة...',
    ],
    tips: [
      'قصة البراند الصادقة تحول المشتري العادي إلى عميل وفيّ ينصح أصدقاءه.',
      'تناسق ألوان الهوية يعطي انطباعاً بالفخامة والاحترافية من النظرة الأولى.',
      'النبرة الودية البشوشة تصنع ألفة مباشرة مع الزبون المصري.',
    ],
  },
  pricing: {
    titleAr: 'دراسة الجدوى',
    icon: FileSpreadsheet,
    color: 'from-emerald-600 to-teal-600',
    description: 'نقوم بحساب دراسة الجدوى المالية الشاملة بالجنيه المصري (EGP)، تكاليف التأسيس والمعدات، وتوقعات الأرباح.',
    steps: [
      'حساب بنود المعدات والتأسيس المطلوبة وتكلفة كل بند بالجنيه...',
      'مقارنة رأس المال المرصود مع الحد الأدنى الواقعي بالسوق المصري...',
      'تحديد الفارق المالي وحساب نقطة التعادل واسترداد رأس المال...',
      'صياغة توقعات الأرباح التقديرية للسنوات الخمس القادمة...',
    ],
    tips: [
      'فترة استرداد رأس المال الواقعية لمعظم المشاريع في مصر تتراوح بين 12 إلى 24 شهراً.',
      'تخصيص سيولة تشغيل للشهرين الأولين يمنع التعثر المبكر ويضمن الاستقرار.',
      'دراسة الجدوى التقديرية تمنحك بوصلة واضحة لإدارة التدفقات النقدية والأرباح.',
    ],
  },
  marketing: {
    titleAr: 'التسويق',
    icon: Megaphone,
    color: 'from-blue-600 to-cyan-600',
    description: 'نقوم بجدولة 30 يوماً من الأنشطة التسويقية بشروحات تنفيذية كاملة متوافقة مع مخرج كل بند.',
    steps: [
      'تحديد رسالة الإطلاق المركزية والقنوات الأكثر فاعلية...',
      'تخطيط الأسبوع الأول: الإطلاق وبناء الوعي الخاطف...',
      'تخطيط الأسبوع الثاني والثالث: تفعيل الطلبات وبناء الثقة الاجتماعية...',
      'صياغة الشروحات التنفيذية التفصيلية لكل مخرج تسويقي...',
    ],
    tips: [
      'في السوق المصري، الذروة الكبرى لتفاعل المنشورات تكون بين 7:30 و 10:00 مساءً.',
      'فيديوهات الكواليس والتغليف تزيد الثقة وتصنع ارتباطاً عاطفياً مباشراً.',
      'التوصيات الشفهية ومراجعات العملاء الحقيقيين هي أقوى محرك لمبيعات البداية.',
    ],
  },
  visuals: {
    titleAr: 'الشعار',
    icon: Palette,
    color: 'from-pink-600 to-rose-600',
    description: 'نقوم بهندسة شعار متجهي (SVG) عالي الدقة يتضمن اسم البراند بالخط العربي مع الأفاتار المتناسق.',
    steps: [
      'إعداد التكوين الهندسي المتجهي بدقة 600×600...',
      'تضمين اسم البراند بالخط العربي الأنيق مع تباين لوني مدروس...',
      'تجهيز أيقونة الأفاتار المتناسقة لملفات السوشيال ميديا...',
      'إنشاء أكواد التصدير عالية الدقة للتنزيل المباشر...',
    ],
    tips: [
      'الشعار البسيط يسهل تمييزه على شاشات الهواتف ومطبوعات التغليف الصغيرة.',
      'وجود اسم البراند بوضوح مع الرمز البصري يرسخ الاسم في الذاكرة أسرع.',
      'الألوان الداكنة مع لمسات إضاءة ذهبية أو سماوية تعطي لمسة عصرية فاخرة.',
    ],
  },
};

const TAB_TITLES: Record<TabKey, string> = {
  names: 'الأسماء',
  identity: 'الهوية',
  pricing: 'دراسة الجدوى',
  marketing: 'التسويق',
  visuals: 'الشعار',
};

export const SectionLoadingView: React.FC<SectionLoadingViewProps> = ({
  sectionKey,
  idea,
  readySections,
  onNavigateToSection,
}) => {
  const meta = SECTION_META[sectionKey];
  const IconComponent = meta.icon;

  const [stepIndex, setStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);
  const [sparks, setSparks] = useState(0);
  const [sparkReaction, setSparkReaction] = useState<string | null>(null);

  // Rotate through steps calmly (5.5s per step so user can read comfortably)
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % meta.steps.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [meta.steps.length]);

  // Smooth, calm progressive advance for progress bar (steadily climbs toward 92% without rushing)
  useEffect(() => {
    const progTimer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 4) + 2;
      });
    }, 900);
    return () => clearInterval(progTimer);
  }, []);

  // Rotate through tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % meta.tips.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [meta.tips.length]);

  const handleSparkClick = () => {
    const next = sparks + 1;
    setSparks(next);
    const reactions = [
      'أفكار ملهمة! ✨',
      'خطوة ذكية لمشروعك 🚀',
      'الذكاء الاصطناعي يقترب من الانتهاء 💡',
      'جاهزون للإطلاق قريباً 🏆',
    ];
    setSparkReaction(reactions[next % reactions.length]);
    setTimeout(() => setSparkReaction(null), 1800);
  };

  return (
    <div
      className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-xl max-w-4xl mx-auto space-y-7 animate-in fade-in"
      dir="rtl"
    >
      {/* Prominent Clear Wait Banner */}
      <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 text-amber-950 dark:text-amber-200 font-bold text-sm sm:text-base mb-1">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
          <span>يرجى الانتظار قليلاً.. الذكاء الاصطناعي يقوم الآن بتوليد وتدقيق تفاصيل هذا القسم بعناية فائقة ⏳</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-300/80 font-medium max-w-xl mx-auto">
          نظراً لأننا نقوم ببناء استراتيجية احترافية مخصصة بالكامل لمشروعك، يرجى الانتظار لحظات بسيطة لاكتمال المعالجة بدقة.
        </p>
      </div>

      {/* Central Visual Pulsing Indicator */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-violet-500/20 dark:bg-indigo-500/30 animate-ping" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C3AED] to-purple-400 opacity-20 blur-md" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
            <IconComponent className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800/60">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>جارٍ التوليد والتجهيز بعناية...</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white">
            جاري إعداد قسم: {meta.titleAr}
          </h3>

          <p className="text-sm sm:text-base text-[#526077] dark:text-slate-300 max-w-xl mx-auto font-medium">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Live Animated Step Tracker */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F7FC] dark:bg-slate-900/80 border border-[#E2E8F0] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400 font-bold">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>نشاط الذكاء الاصطناعي اللحظي:</span>
          </span>
          <span className="text-xs font-bold text-[#7C3AED] dark:text-indigo-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-ping" />
            <span>معالجة حية ⚡</span>
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-slate-800/80 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse shrink-0" />
          <p className="text-sm font-bold text-[#172033] dark:text-slate-100 transition-all duration-300">
            {meta.steps[stepIndex]}
          </p>
        </div>

        {/* Calm Progressive Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#7C3AED] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Feature: Inspiration Clicker & Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Marketing Tip */}
        <div className="p-5 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/40 border border-[#DDD6FE] dark:border-indigo-800/60 space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
            <span className="text-xs font-bold text-[#5B21B6] dark:text-indigo-300">
              معلومة سريعة لسوق مشروعك:
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5B21B6] dark:text-slate-200 font-semibold leading-relaxed">
            "{meta.tips[tipIndex]}"
          </p>
        </div>

        {/* Interactive Inspiration Clicker */}
        <div className="p-5 rounded-2xl bg-[#F8F7FC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#526077] dark:text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>تفاعل أثناء الانتظار:</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#7C3AED] dark:text-indigo-400">
              {sparks} شرارة
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSparkClick}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 hover:border-[#7C3AED] text-[#172033] dark:text-slate-200 text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 shrink-0"
            >
              <span>اضغط لتوليد طاقة إبداعية ✨</span>
            </button>
            {sparkReaction && (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 animate-in fade-in">
                {sparkReaction}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QUICK JUMP TO ALREADY-READY SECTIONS */}
      {readySections.length > 0 && (
        <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-[#64748B] dark:text-slate-400 block">
            يمكنك تصفح واستكشاف الأقسام الجاهزة فوراً دون انتظار هذا القسم:
          </span>

          <div className="flex flex-wrap gap-2">
            {readySections.map((rKey) => (
              <button
                key={rKey}
                onClick={() => onNavigateToSection(rKey)}
                className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>الانتقال إلى: {TAB_TITLES[rKey]} (جاهز الآن ✓)</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
