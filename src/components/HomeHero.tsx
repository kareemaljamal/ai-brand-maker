import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Trash2,
  Calendar,
  Layers,
  Smile,
  DollarSign,
  Megaphone,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  MapPin,
  Wallet,
} from 'lucide-react';
import { PersonalityType, BrandProject } from '../types/brand';

export interface BrandInputData {
  idea: string;
  category?: string;
  personality: PersonalityType | string;
  city?: string;
  district?: string;
  targetAudience?: string;
  budget?: number;
  knownVariableCosts?: number;
  knownMonthlyFixedCosts?: number;
}

interface HomeHeroProps {
  onGenerate: (data: BrandInputData) => void;
  isLoading: boolean;
  savedBrands: BrandProject[];
  onSelectSavedBrand: (brand: BrandProject) => void;
  onClearAllSavedBrands: () => void;
  featuresRef: React.RefObject<HTMLDivElement | null>;
  inputCardRef: React.RefObject<HTMLDivElement | null>;
}

const PRESETS = [
  {
    label: 'مطعم بيتزا (المعادي)',
    data: {
      idea: 'مطعم بيتزا إيطالي صحي بأسعار تنافسية ومكونات طازجة مع خدمة توصيل سريعة',
      category: 'مطاعم',
      personality: 'عصري',
      city: 'القاهرة',
      district: 'المعادي',
      budget: 150000,
    },
  },
  {
    label: 'براند قهوة (الشيخ زايد)',
    data: {
      idea: 'براند قهوة مختصة مصرية وبن مطحون أونلاين لمحبي المذاق الغني وجودة التحميص العالية',
      category: 'أغذية ومشروبات',
      personality: 'فاخر',
      city: 'الجيزة',
      district: 'الشيخ زايد',
      budget: 220000,
    },
  },
  {
    label: 'عيادة تجميل (التجمع الخامس)',
    data: {
      idea: 'عيادة تجميل وعناية بالبشرة غير جراحية مع باقات وجلسات نضارة متقدمة',
      category: 'خدمات طبية وتجميلية',
      personality: 'فاخر',
      city: 'القاهرة',
      district: 'التجمع الخامس',
      budget: 350000,
    },
  },
];

const CATEGORIES = [
  'مطاعم',
  'أغذية ومشروبات',
  'تجارة إلكترونية',
  'خدمات طبية وتجميلية',
  'أزياء وموضة',
  'خدمات واستشارات',
  'تقنية وتطبيقات',
];

const PERSONALITY_CHIPS: PersonalityType[] = ['عصري', 'فاخر', 'شبابي', 'عائلي', 'تراثي'];

export const HomeHero: React.FC<HomeHeroProps> = ({
  onGenerate,
  isLoading,
  savedBrands,
  onSelectSavedBrand,
  onClearAllSavedBrands,
  featuresRef,
  inputCardRef,
}) => {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('مطاعم');
  const [personality, setPersonality] = useState<PersonalityType>('عصري');
  const [city, setCity] = useState('القاهرة');
  const [district, setDistrict] = useState('');
  const [budget, setBudget] = useState<number | ''>(500000);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim() || isLoading) return;

    const safeBudget = budget !== '' && Number(budget) > 0 ? Number(budget) : 500000;

    onGenerate({
      idea: idea.trim(),
      category,
      personality,
      city: city.trim() || 'القاهرة',
      district: district.trim() || undefined,
      budget: safeBudget,
    });
  };

  const handleSelectPreset = (preset: (typeof PRESETS)[0]) => {
    setIdea(preset.data.idea);
    setCategory(preset.data.category);
    setPersonality(preset.data.personality as PersonalityType);
    setCity(preset.data.city || 'القاهرة');
    setDistrict(preset.data.district || '');
    setBudget(500000);
    onGenerate({
      ...preset.data,
      budget: 500000,
    });
  };

  const scrollToInput = () => {
    inputCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-12 relative" dir="rtl">
      {/* Restrained lavender hero glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.07),transparent_70%)] pointer-events-none -z-10" />

      {/* ================= PAGE 1: HERO SECTION ================= */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        {/* Badge: Pale lavender background, dark purple text and subtle lavender border */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] dark:bg-indigo-950/50 dark:border-indigo-800/80 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-sm">
          <span>منشئ استراتيجية وهويات البراند للشركات الناشئة</span>
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] dark:text-indigo-400" />
        </div>

        {/* Heading: Dark navy main line, violet emphasized second line */}
        <h1 className="text-4xl sm:text-6xl font-black text-[#172033] dark:text-white tracking-tight leading-[1.25]">
          ابنِ هوية مشروعك <br />
          <span className="text-[#7C3AED] dark:text-indigo-400">في ثوانٍ معدودة</span>
        </h1>

        {/* Subtitle: Readable slate description */}
        <p className="text-[#334155] dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          اكتب فكرتك في سطر واحد، واحصل فوراً على الاسم والهوية والتسعير بالجنيه المصري وخطة التسويق، مع استوديو متخصص لتوليد الشعار.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={scrollToInput}
            className="px-8 py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            ابدأ الآن مجاناً
          </button>
          <button
            onClick={() => handleSelectPreset(PRESETS[0])}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#CBD5E1] dark:border-slate-800 dark:bg-[#131B2E] text-[#172033] dark:text-slate-200 font-bold text-sm sm:text-base dark:hover:bg-slate-800/60 transition-all shadow-sm"
          >
            شاهد تجربة جاهزة
          </button>
        </div>

        {/* Trust points: readable muted/helper text */}
        <p className="text-xs text-[#475569] dark:text-slate-400 font-semibold">
          مجاني بالكامل <span className="mx-1">•</span> بدون تسجيل <span className="mx-1">•</span> تسعير بالجنيه المصري EGP
        </p>
      </section>

      {/* ================= 4 CARDS GRID ================= */}
      <section ref={featuresRef} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: الهوية والأسماء -> lavender with purple icon */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow min-h-[195px] flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-11 h-11 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#7C3AED] dark:text-indigo-400 flex items-center justify-center">
                <Smile className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">الهوية والأسماء</h3>
              <p className="text-xs text-[#526077] dark:text-slate-400 leading-relaxed">
                أسماء مدروسة وشعارات لفظية ونبرة صوت ولوحة ألوان متناسقة.
              </p>
            </div>
          </div>

          {/* Card 2: التسعير والبيزنس -> mint with dark green icon */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow min-h-[195px] flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-11 h-11 rounded-full bg-[#DCFCE7] dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">التسعير والبيزنس</h3>
              <p className="text-xs text-[#526077] dark:text-slate-400 leading-relaxed">
                باقات تسعير ذكية بالجنيه المصري (EGP) مع هامش الربح.
              </p>
            </div>
          </div>

          {/* Card 3: الخطة التسويقية -> pale amber with dark amber icon */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow min-h-[195px] flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-11 h-11 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">الخطة التسويقية</h3>
              <p className="text-xs text-[#526077] dark:text-slate-400 leading-relaxed">
                جدول إطلاق لـ 30 يوماً وصياغة كاملة للمنشورات والريلز.
              </p>
            </div>
          </div>

          {/* Card 4: الهوية البصرية -> pale cyan with dark cyan icon */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow min-h-[195px] flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-11 h-11 rounded-full bg-[#E0F2FE] dark:bg-cyan-950/60 text-[#0284C7] dark:text-cyan-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">الهوية البصرية</h3>
              <p className="text-xs text-[#526077] dark:text-slate-400 leading-relaxed">
                توليد الشعار وصورة الحساب فيكتور SVG داخل صفحة التوليد مباشرة.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Ribbon */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 pt-4 text-xs sm:text-sm font-bold text-[#526077] dark:text-slate-300 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs">
              1
            </span>
            <span>اكتب فكرتك</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>اضغط ولّد</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs">
              3
            </span>
            <span>اعرض وخصص مشروعك</span>
          </div>
        </div>
      </section>

      {/* ================= PAGE 2: INTERACTIVE INPUT CARD & PREVIOUS PROJECTS ================= */}
      <section ref={inputCardRef} className="max-w-3xl mx-auto pt-4">
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white">
              ما هي فكرة مشروعك؟
            </h2>
            <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-400">
              اكتب فكرتك في سطر واحد وسيتولى الذكاء الاصطناعي بناء الخطة وعرضها فوراً.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Idea Input */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-[#172033] dark:text-slate-300">
                فكرة المشروع
              </label>
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="مثال: مركز أشعة وتشخيص طبي، مستشفى نساء وتوليد، مطعم مأكولات شعبية، عيادة أسنان..."
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#CBD5E1] dark:border-slate-700 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 text-[#172033] dark:text-white placeholder:text-[#64748B] text-sm outline-none transition-all font-medium shadow-sm"
              />
            </div>

            {/* Row: Field & Brand Personality */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Category Dropdown (Right in RTL) */}
              <div className="sm:col-span-5 space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#172033] dark:text-slate-300">المجال</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs sm:text-sm text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED] transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personality Chips (Left in RTL) */}
              <div className="sm:col-span-7 space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#172033] dark:text-slate-300">
                  طابع البراند
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONALITY_CHIPS.map((chip) => {
                    const isSelected = personality === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setPersonality(chip)}
                        className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-indigo-600 dark:text-white dark:border-transparent'
                            : 'bg-slate-100 hover:bg-slate-200 text-[#526077] hover:text-[#172033] border border-[#E2E8F0] dark:bg-slate-800 dark:text-slate-300 dark:border-transparent dark:hover:bg-slate-700 dark:hover:text-white'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row: Capital & Location (City & District) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              {/* Capital (Budget EGP) */}
              <div className="sm:col-span-4 space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#172033] dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-[#7C3AED]" />
                    <span>رأس المال المتوقع</span>
                  </span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">ج.م EGP</span>
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                  onBlur={() => {
                    if (budget === '' || Number(budget) <= 0) {
                      setBudget(500000);
                    }
                  }}
                  placeholder="500000"
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs sm:text-sm text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED] transition-colors font-mono"
                  dir="ltr"
                />
              </div>

              {/* City (المدينة) */}
              <div className="sm:col-span-4 space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#172033] dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7C3AED]" />
                  <span>المدينة / المحافظة</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: القاهرة، الجيزة، الإسكندرية..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs sm:text-sm text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>

              {/* District (الحي / المنطقة - اختياري) */}
              <div className="sm:col-span-4 space-y-1.5 text-right">
                <label className="text-xs font-bold text-[#172033] dark:text-slate-300 flex items-center justify-between">
                  <span>الحي / المنطقة</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">اختياري</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: التجمع الخامس، المعادي..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs sm:text-sm text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>
            </div>

            {/* Big Submit Button: ولّد البراند ✦ */}
            <button
              type="submit"
              disabled={!idea.trim() || isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>ولّد البراند الآن</span>
            </button>
          </form>

          {/* One-Click Presets */}
          <div className="flex items-center gap-2 pt-2 text-xs flex-wrap">
            <span className="font-bold text-[#526077] dark:text-slate-400">أمثلة سريعة:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1 rounded-xl bg-[#EDE9FE] hover:bg-purple-100 text-[#5B21B6] border border-[#DDD6FE] font-semibold dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-200 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Previous Projects Section - ONLY shown when user actually has saved brands */}
          {savedBrands.length > 0 && (
            <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#172033] dark:text-white">مشاريعك السابقة</h3>
                <button
                  onClick={onClearAllSavedBrands}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                >
                  مسح الكل
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {savedBrands.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectSavedBrand(b)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED] dark:hover:border-indigo-500/60 dark:hover:bg-slate-800/80 cursor-pointer transition-all space-y-1 shadow-sm"
                  >
                    <span className="text-xs font-bold text-[#172033] dark:text-slate-200 block truncate">
                      {b.identity?.names?.find((n) => n.id === b.identity.selectedNameId)?.nameAr ||
                        b.title}
                    </span>
                    <span className="text-[11px] text-[#64748B] block">
                      {new Date(b.updatedAt || b.createdAt).toLocaleDateString('ar-EG-u-nu-latn', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
