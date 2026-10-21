import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Volume2,
  BookOpen,
  CreditCard,
  Smartphone,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building,
  ShoppingBag,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Tag,
  MessageSquare,
} from 'lucide-react';
import { BrandIdentity, BrandColor } from '../types/brand';
import { copyToClipboard } from '../utils/export';

interface IdentityTabProps {
  identity: BrandIdentity;
  brief?: any;
  pricing?: any;
  onSelectName: (nameId: string) => void;
  onSelectSlogan: (sloganId: string) => void;
  onUpdateIdentity?: (newIdentity: BrandIdentity) => void;
  onAppendNames?: () => Promise<void>;
  onRegenerateSlogans?: () => Promise<void>;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
  isScopedLoading?: boolean;
  onNavigateToVisuals?: () => void;
  onNavigateToNames?: () => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({
  identity,
  brief,
  pricing,
  onSelectName,
  onSelectSlogan,
  onUpdateIdentity,
  onNotify,
  onNavigateToVisuals,
  onNavigateToNames,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeMockup, setActiveMockup] = useState<'billboard' | 'card' | 'packaging' | 'post' | 'app'>('billboard');
  const [showFullStrategy, setShowFullStrategy] = useState(false);
  const [isCustomizingColors, setIsCustomizingColors] = useState(false);

  const selectedName =
    identity.names.find((n) => n.id === identity.selectedNameId) || identity.names[0];
  const selectedSlogan =
    identity.slogans.find((s) => s.id === identity.selectedSloganId) || identity.slogans[0];

  const handleCopyText = async (text: string, key: string, label: string) => {
    await copyToClipboard(text);
    setCopiedKey(key);
    onNotify(`تم نسخ ${label} بنجاح`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyColor = async (hex: string) => {
    await copyToClipboard(hex);
    onNotify(`تم نسخ كود اللون ${hex}`, 'success');
  };

  // Only take the first 3 colors (primary, secondary, accent)
  const threeColors = (identity?.palette || []).slice(0, 3);
  const primaryCol = threeColors.find((c) => c.role === 'primary')?.hex || '#4F46E5';
  const secondaryCol = threeColors.find((c) => c.role === 'secondary')?.hex || '#06B6D4';
  const accentCol = threeColors.find((c) => c.role === 'accent')?.hex || '#F59E0B';

  return (
    <div className="space-y-8" dir="rtl">
      {/* ================= TOP BANNER: ACTIVE BRAND NAME & SLOGAN ================= */}
      <div className="bg-gradient-to-l from-purple-50 via-white to-indigo-50/50 dark:from-indigo-950/40 dark:via-[#131B2E] dark:to-[#131B2E] rounded-3xl border border-[#DDD6FE] dark:border-indigo-900 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-purple-500/20">
            {(selectedName?.nameAr || 'ب').slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                الاسم المعتمد للمشروع
              </span>
              {selectedName?.style && (
                <span className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
                  • طابع {selectedName.style}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white flex items-center gap-2">
              <span>{selectedName?.nameAr}</span>
              {selectedName?.nameEn && (
                <span className="text-sm font-normal font-mono text-[#64748B] dark:text-slate-400" dir="ltr">
                  ({selectedName.nameEn})
                </span>
              )}
            </h2>
            {selectedSlogan?.text && (
              <p className="text-xs sm:text-sm text-[#7C3AED] dark:text-indigo-300 font-bold mt-0.5">
                "{selectedSlogan.text}"
              </p>
            )}
          </div>
        </div>

        {onNavigateToNames && (
          <button
            onClick={onNavigateToNames}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#7C3AED] dark:text-indigo-300 font-bold text-xs sm:text-sm border border-[#DDD6FE] dark:border-indigo-800 shadow-sm flex items-center gap-2 self-start md:self-auto transition-all active:scale-95"
          >
            <Tag className="w-4 h-4" />
            <span>تغيير أو استعراض الأسماء الـ 6</span>
          </button>
        )}
      </div>

      {/* ================= 2-COLUMN BRAND STRATEGY & VOICE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: قصة البراند والتموضع والاستراتيجية */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card 1: قصة البراند المتكيفة مع الاسم المختار */}
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
                <h3 className="text-base font-bold text-[#172033] dark:text-white">قصة البراند</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold">
                مخصصة لاسم: {selectedName?.nameAr}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80">
              {identity.strategy?.story}
            </p>

            <div className="flex items-center justify-between text-xs text-[#526077] dark:text-slate-400 pt-1">
              <span>التموضع: {identity.strategy?.positioning}</span>
              <button
                onClick={() => handleCopyText(identity.strategy?.story || '', 'story', 'قصة البراند')}
                className="text-xs text-[#7C3AED] dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedKey === 'story' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ القصة</span>
              </button>
            </div>
          </div>

          {/* Card 2: عرض القيمة والرسالة والرؤية */}
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172033] dark:text-white">عرض القيمة والغاية</h3>
              <button
                onClick={() => setShowFullStrategy(!showFullStrategy)}
                className="text-xs text-[#7C3AED] dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>{showFullStrategy ? 'إخفاء التفاصيل' : 'عرض الرؤية والقيم'}</span>
                {showFullStrategy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F7FC] dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/80 text-xs sm:text-sm text-[#172033] dark:text-slate-200">
              <span className="font-bold text-[#7C3AED] dark:text-indigo-400 block text-xs mb-1">عرض القيمة الفريد (Value Proposition):</span>
              {identity.strategy?.valueProposition || 'تجربة متكاملة تجمع بين الجودة الفائقة وسرعة الخدمة والأسعار العادلة.'}
            </div>

            {showFullStrategy && (
              <div className="space-y-3 pt-2 text-xs text-[#526077] dark:text-slate-300 border-t border-[#E2E8F0] dark:border-slate-800 animate-in fade-in">
                {identity.strategy?.purpose && (
                  <div>
                    <span className="font-bold text-[#172033] dark:text-white block mb-0.5">الغاية (Purpose):</span>
                    <p className="bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">{identity.strategy.purpose}</p>
                  </div>
                )}
                {identity.strategy?.mission && (
                  <div>
                    <span className="font-bold text-[#172033] dark:text-white block mb-0.5">الرسالة (Mission):</span>
                    <p className="bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">{identity.strategy.mission}</p>
                  </div>
                )}
                {identity.strategy?.vision && (
                  <div>
                    <span className="font-bold text-[#172033] dark:text-white block mb-0.5">الرؤية (Vision):</span>
                    <p className="bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">{identity.strategy.vision}</p>
                  </div>
                )}
                {identity.strategy?.values && identity.strategy.values.length > 0 && (
                  <div>
                    <span className="font-bold text-[#172033] dark:text-white block mb-1">القيم الجوهرية (Core Values):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {identity.strategy.values.map((v, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-indigo-950/40 text-[#7C3AED] dark:text-indigo-300 font-semibold border border-purple-200/60 dark:border-indigo-800/50">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Left Column: نبرة الصوت والخطاب والشعار اللفظي */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card 3: نبرة الصوت والأمثلة */}
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
                <h3 className="text-base font-bold text-[#172033] dark:text-white">نبرة الصوت والخطاب</h3>
              </div>
              <button
                onClick={() => {
                  const voiceStr = `سمات النبرة: ${identity.voice.traits.join(', ')}\nتحية الاستقبال: ${identity.voice.greetingExample}\nرسالة العرض: ${identity.voice.promoExample}`;
                  handleCopyText(voiceStr, 'voice', 'نبرة الصوت');
                }}
                className="p-1 rounded-lg text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white"
                title="نسخ"
              >
                {copiedKey === 'voice' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Tag Chips */}
            <div className="flex flex-wrap gap-2">
              {identity.voice.traits?.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60 text-xs font-bold"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Practical Greeting Example */}
            <div className="space-y-1.5 pt-1 text-xs">
              <span className="font-bold text-[#526077] dark:text-slate-400 block text-[11px]">
                مثال التحية والترحيب بالعميل:
              </span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 text-[#172033] dark:text-slate-200">
                "{identity.voice.greetingExample}"
              </div>
            </div>

            {identity.voice.promoExample && (
              <div className="space-y-1.5 pt-1 text-xs">
                <span className="font-bold text-[#526077] dark:text-slate-400 block text-[11px]">
                  صيغة المنشور الترويجي:
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 text-[#172033] dark:text-slate-200">
                  "{identity.voice.promoExample}"
                </div>
              </div>
            )}
          </div>

          {/* Card 4: الشعارات اللفظية المقترحة (السلوجان) */}
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
                <h3 className="text-base font-bold text-[#172033] dark:text-white">
                  الشعارات اللفظية المقترحة (السلوجان)
                </h3>
              </div>
              <span className="text-xs text-[#64748B] dark:text-slate-400">
                اضغط لاختيار الشعار
              </span>
            </div>

            <div className="space-y-2.5">
              {(!identity?.slogans || identity.slogans.length === 0) ? (
                <div className="p-5 rounded-2xl bg-[#EDE9FE]/50 dark:bg-indigo-950/40 border border-[#DDD6FE] dark:border-indigo-850 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#7C3AED] dark:text-indigo-400">
                    <Sparkles className="w-4 h-4 animate-spin text-[#7C3AED]" />
                    <span>جاري صياغة الشعارات اللفظية (السلوجان) بالذكاء الاصطناعي... ⚡</span>
                  </div>
                  <div className="h-3 w-48 bg-slate-200/80 dark:bg-slate-800 rounded-full mx-auto" />
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400">
                    ستظهر الشعارات اللفظية المقترحة تلقائياً هنا فور اكتمال معالجتها
                  </p>
                </div>
              ) : (
                identity.slogans.map((slogan) => {
                  const isSelected = slogan.id === (identity.selectedSloganId || selectedSlogan?.id);

                  return (
                    <div
                      key={slogan.id}
                      onClick={() => onSelectSlogan(slogan.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#EDE9FE] border-2 border-[#7C3AED] dark:bg-indigo-950/70 dark:border-indigo-500 shadow-sm'
                          : 'bg-[#F8F7FC] dark:bg-slate-900/50 border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#526077] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 font-semibold">
                            {slogan.tone || 'شعار لفظي'}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                              المعتمد ✓
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#172033] dark:text-slate-100">
                          "{slogan.text}"
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyText(slogan.text, `slogan-${slogan.id}`, 'السلوجان');
                        }}
                        className="p-1.5 rounded-xl text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white transition-colors"
                        title="نسخ"
                      >
                        {copiedKey === `slogan-${slogan.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3-COLOR HARMONIZED PALETTE & CUSTOMIZATION ================= */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#7C3AED] dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">
                  لوحة الألوان المتناسقة (3 ألوان فقط)
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 font-bold border border-[#DDD6FE] dark:border-indigo-800/60">
                  قابلة للتخصيص
                </span>
              </div>
              <p className="text-xs text-[#526077] dark:text-slate-400">
                يمكنك تغيير أي لون مباشرة أو اختيار لوحة متناسقة جاهزة بنقرة واحدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle Color Customizer Button */}
            <button
              onClick={() => setIsCustomizingColors(!isCustomizingColors)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isCustomizingColors
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/25 dark:bg-indigo-600 dark:text-white'
                  : 'bg-white hover:bg-purple-50/60 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-indigo-500/60 text-[#172033] dark:text-slate-100 dark:hover:text-white shadow-sm'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCustomizingColors ? 'إغلاق المحرر' : 'لوحات جاهزة وتخصيص الألوان'}</span>
            </button>

            {/* Copy 3 Hex Codes */}
            <button
              onClick={() => {
                const palStr = threeColors.map((c) => `${c.nameAr}: ${c.hex}`).join(', ');
                handleCopyText(palStr, 'palette', 'لوحة الألوان');
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50/60 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-indigo-500/60 text-[#172033] dark:text-slate-100 dark:hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copiedKey === 'palette' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>نسخ الأكواد الثلاثة</span>
            </button>
          </div>
        </div>

        {/* 1-CLICK CURATED PRESET PALETTES PANEL */}
        {isCustomizingColors && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#EDE9FE]/50 dark:bg-slate-900/90 border border-[#DDD6FE] dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-[#5B21B6] dark:text-indigo-200">
                  لوحات ألوان جاهزة ومدروسة هندسياً (تطبيق فوري بنقرة واحدة):
                </h4>
              </div>
              <span className="text-[11px] text-[#526077] dark:text-slate-400 font-medium">
                اختر النمط الأنسب لشخصية براندك
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  id: 'royal',
                  title: 'فخامة ملكية',
                  subtitle: 'كحلي وذهبي',
                  colors: [
                    { role: 'primary', nameAr: 'كحلي ليلي', hex: '#0F172A', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'ذهبي عنبري', hex: '#D97706', usageNote: 'الإطارات والزخارف' },
                    { role: 'accent', nameAr: 'زمردي مشرق', hex: '#10B981', usageNote: 'أزرار الشراء' },
                  ],
                },
                {
                  id: 'tech',
                  title: 'تقني عصري',
                  subtitle: 'نيلي وسماوي',
                  colors: [
                    { role: 'primary', nameAr: 'نيلي رقمي', hex: '#4F46E5', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'سماوي كهربائي', hex: '#06B6D4', usageNote: 'الظلال والإطارات' },
                    { role: 'accent', nameAr: 'وردي نيون', hex: '#F43F5E', usageNote: 'أزرار الشراء' },
                  ],
                },
                {
                  id: 'organic',
                  title: 'طبيعي وصحي',
                  subtitle: 'أخضر وعسلي',
                  colors: [
                    { role: 'primary', nameAr: 'أخضر غابات', hex: '#065F46', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'زمردي ناعم', hex: '#10B981', usageNote: 'الإطارات والبادجات' },
                    { role: 'accent', nameAr: 'برتقالي شمسي', hex: '#F59E0B', usageNote: 'أزرار الشراء' },
                  ],
                },
                {
                  id: 'energy',
                  title: 'طاقة ومطاعم',
                  subtitle: 'قرمزي وناري',
                  colors: [
                    { role: 'primary', nameAr: 'قرمزي جريء', hex: '#BE123C', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'برتقالي مشهي', hex: '#EA580C', usageNote: 'اللافتات الترويجية' },
                    { role: 'accent', nameAr: 'أصفر كهرماني', hex: '#FBBF24', usageNote: 'أزرار الشراء' },
                  ],
                },
                {
                  id: 'coffee',
                  title: 'ضيافة وقهوة',
                  subtitle: 'إسبريسو وكريمي',
                  colors: [
                    { role: 'primary', nameAr: 'بني إسبريسو', hex: '#78350F', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'كراميل عسلي', hex: '#B45309', usageNote: 'التغليف والأكواب' },
                    { role: 'accent', nameAr: 'كريمي دافئ', hex: '#FDE047', usageNote: 'أزرار الشراء' },
                  ],
                },
                {
                  id: 'minimal',
                  title: 'أناقة وبساطة',
                  subtitle: 'فحمي وبنفسجي',
                  colors: [
                    { role: 'primary', nameAr: 'فحمي ناصع', hex: '#18181B', usageNote: 'الشعار والعناوين' },
                    { role: 'secondary', nameAr: 'رمادي بلاتيني', hex: '#64748B', usageNote: 'الخلفيات الهادئة' },
                    { role: 'accent', nameAr: 'أرجواني استثنائي', hex: '#6366F1', usageNote: 'أزرار الشراء' },
                  ],
                },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    if (onUpdateIdentity) {
                      onUpdateIdentity({
                        ...identity,
                        palette: preset.colors as BrandColor[],
                      });
                      onNotify(`تم تطبيق لوحة "${preset.title}" بنجاح!`, 'success');
                    }
                  }}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-[#E2E8F0] dark:border-slate-700/80 hover:border-[#7C3AED] hover:bg-purple-50/40 dark:hover:bg-slate-700 dark:hover:border-indigo-500/70 hover:shadow-md transition-all text-right space-y-2 group"
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    {preset.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full shadow-inner border border-black/10 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172033] dark:text-slate-100 group-hover:text-[#7C3AED] dark:group-hover:text-indigo-300 block truncate transition-colors">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-[#526077] dark:text-slate-400 block truncate">
                      {preset.subtitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3 INTERACTIVE COLOR SWATCH CARDS WITH DIRECT PICKERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {threeColors.map((color) => {
            const role = color.role as 'primary' | 'secondary' | 'accent';
            const roleLabel =
              role === 'primary'
                ? 'اللون الأساسي (Primary)'
                : role === 'secondary'
                ? 'اللون الثانوي (Secondary)'
                : 'لون التمييز (Accent)';

            const usageDesc =
              role === 'primary'
                ? 'الشعار، العناوين الكبرى، والهوية المركزية'
                : role === 'secondary'
                ? 'الإطارات، البادجات، والأسطح التكميلية'
                : 'أزرار الشراء والطلب، العروض، ونقاط الجذب';

            const quickShades =
              role === 'primary'
                ? ['#4F46E5', '#0F172A', '#065F46', '#BE123C', '#78350F']
                : role === 'secondary'
                ? ['#06B6D4', '#D97706', '#10B981', '#EA580C', '#64748B']
                : ['#F59E0B', '#10B981', '#F43F5E', '#FBBF24', '#6366F1'];

            return (
              <div
                key={color.role}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED]/80 dark:hover:border-indigo-500/70 transition-all space-y-4 shadow-sm"
              >
                {/* Interactive Color Swatch with Native Color Picker Trigger */}
                <div className="relative group">
                  <div
                    className="w-full h-24 rounded-xl shadow-md border border-black/10 transition-transform group-hover:scale-[1.01] flex items-end justify-between p-3 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-sm shadow-sm"
                      dir="ltr"
                    >
                      {color.hex}
                    </span>

                    <label className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[#172033] dark:text-slate-100 shadow-sm flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Sliders className="w-3 h-3 text-[#7C3AED] dark:text-indigo-400" />
                      <span>تغيير</span>
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const newHex = e.target.value.toUpperCase();
                          if (onUpdateIdentity) {
                            const updated = identity.palette.map((c) =>
                              c.role === role ? { ...c, hex: newHex } : c
                            );
                            onUpdateIdentity({ ...identity, palette: updated });
                          }
                        }}
                        className="opacity-0 w-0 h-0 absolute pointer-events-none"
                      />
                    </label>
                  </div>
                </div>

                {/* Role & Usage Notes */}
                <div className="space-y-1 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#172033] dark:text-slate-100">
                      {roleLabel}
                    </span>
                    <button
                      onClick={() => handleCopyColor(color.hex)}
                      className="text-[11px] text-[#7C3AED] dark:text-indigo-400 font-semibold hover:underline"
                    >
                      نسخ HEX
                    </button>
                  </div>
                  <p className="text-xs text-[#526077] dark:text-slate-300 leading-relaxed">
                    {usageDesc}
                  </p>
                </div>

                {/* Quick Shade Toggles */}
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">تدرجات سريعة:</span>
                  <div className="flex items-center gap-1.5">
                    {quickShades.map((shade) => (
                      <button
                        key={shade}
                        onClick={() => {
                          if (onUpdateIdentity) {
                            const updated = identity.palette.map((c) =>
                              c.role === role ? { ...c, hex: shade } : c
                            );
                            onUpdateIdentity({ ...identity, palette: updated });
                            onNotify(`تم تغيير ${roleLabel} إلى ${shade}`, 'info');
                          }
                        }}
                        className={`w-5 h-5 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-125 ${
                          color.hex.toUpperCase() === shade.toUpperCase()
                            ? 'ring-2 ring-purple-500 scale-110'
                            : ''
                        }`}
                        style={{ backgroundColor: shade }}
                        title={shade}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= REAL-WORLD LIVE MOCKUP PREVIEW ================= */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#172033] dark:text-white flex items-center gap-2">
                <span>معاينة تطبيق الألوان الثلاثة على نماذج جاهزة</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                  تطبيق فوري حي
                </span>
              </h4>
              <p className="text-xs text-[#526077] dark:text-slate-400">
                شاهد كيف تظهر ألوانك على لوحة إعلانية خارجية، كارت العمل، كيس التغليف، ومنشورات السوشيال
              </p>
            </div>

            {/* 5 Mockup Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveMockup('billboard')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeMockup === 'billboard'
                    ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
                    : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>لوحة إعلانية (Billboard)</span>
              </button>

              <button
                onClick={() => setActiveMockup('card')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeMockup === 'card'
                    ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
                    : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>كارت العمل (Business Card)</span>
              </button>

              <button
                onClick={() => setActiveMockup('packaging')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeMockup === 'packaging'
                    ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
                    : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>حقيبة وتغليف (Packaging)</span>
              </button>

              <button
                onClick={() => setActiveMockup('post')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeMockup === 'post'
                    ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
                    : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>إعلان سوشيال (Social Ad)</span>
              </button>

              <button
                onClick={() => setActiveMockup('app')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeMockup === 'app'
                    ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] font-bold shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
                    : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>واجهة هاتف (App UI)</span>
              </button>
            </div>
          </div>

          {/* MOCKUP SHOWCASE DISPLAY CONTAINER */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[320px] overflow-hidden">
            {/* 1. BILLBOARD MOCKUP (Requested by user) */}
            {activeMockup === 'billboard' && (
              <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative border-4 border-slate-700 bg-slate-950 p-6 sm:p-8 space-y-4 animate-in fade-in">
                {/* 3 Overhead Spotlight Lamps */}
                <div className="flex justify-around items-center -mt-6 sm:-mt-8 mb-2">
                  {[1, 2, 3].map((lamp) => (
                    <div key={lamp} className="flex flex-col items-center">
                      <div className="w-3 h-2 bg-slate-400 rounded-t-sm shadow-sm" />
                      <div className="w-6 h-2 bg-slate-200 rounded-b-md shadow-lg shadow-white/50" />
                      <div className="w-24 h-16 bg-gradient-to-b from-white/25 to-transparent pointer-events-none -mb-16 blur-sm" />
                    </div>
                  ))}
                </div>

                {/* Main Billboard Canvas */}
                <div
                  className="w-full rounded-xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-inner border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${primaryCol} 0%, #090E17 55%, ${secondaryCol} 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-white/80 font-bold border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentCol }} />
                      <span>الافتتاح الرسمي قريباً</span>
                    </span>
                    <span className="tracking-widest uppercase text-[11px] text-slate-300 font-mono" dir="ltr">
                      {selectedName?.nameEn || 'OFFICIAL LAUNCH'}
                    </span>
                  </div>

                  <div className="space-y-2 py-2">
                    <h3 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
                      {selectedName?.nameAr || 'اسم البراند'}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-slate-100 max-w-md mx-auto drop-shadow-sm leading-relaxed">
                      "{selectedSlogan?.text || 'أصل الجودة والتميز الدائم'}"
                    </p>
                  </div>

                  {/* Accent CTA Badge */}
                  <div className="pt-2">
                    <span
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs sm:text-sm text-slate-950 shadow-xl transition-transform hover:scale-105"
                      style={{ backgroundColor: accentCol }}
                    >
                      <span>احجز تجربتك الأولى واستمتع بخصم الافتتاح</span>
                      <span>←</span>
                    </span>
                  </div>
                </div>

                {/* Billboard Metal Truss at Bottom */}
                <div className="flex justify-between items-center px-8 text-slate-600 text-xs font-mono pt-1">
                  <div className="w-3 h-5 bg-slate-700 rounded-b-sm" />
                  <span className="text-[11px] text-slate-500 font-bold">لوحة إعلانية خارجية 14×4م · على طريق رئيسي في القاهرة</span>
                  <div className="w-3 h-5 bg-slate-700 rounded-b-sm" />
                </div>
              </div>
            )}

            {/* 2. BUSINESS CARD MOCKUP */}
            {activeMockup === 'card' && (
              <div
                className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-7 space-y-6 relative transition-all animate-in fade-in"
                style={{
                  background: `linear-gradient(135deg, #0B0F19 0%, ${primaryCol}44 100%)`,
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-white block">
                      {selectedName?.nameAr || 'اسم البراند'}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-slate-300" dir="ltr">
                      {selectedName?.nameEn || 'BRAND IDENTITY'}
                    </span>
                  </div>

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: primaryCol }}
                  >
                    <span className="font-bold text-white text-base">
                      {selectedName?.nameAr?.[0] || 'ب'}
                    </span>
                  </div>
                </div>

                {/* Slogan */}
                <p
                  className="text-xs text-slate-200 leading-relaxed font-medium border-r-2 pr-3"
                  style={{ borderColor: accentCol }}
                >
                  "{selectedSlogan?.text || 'أصل الجودة والتميز الدائم'}"
                </p>

                {/* Bottom Card Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: secondaryCol }}
                    />
                    <span>القاهرة، مصر · info@brand.eg</span>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold text-slate-950 shadow-sm"
                    style={{ backgroundColor: accentCol }}
                  >
                    معتمد رسمياً
                  </span>
                </div>
              </div>
            )}

            {/* 3. PACKAGING BAG MOCKUP */}
            {activeMockup === 'packaging' && (
              <div className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center justify-center relative animate-in fade-in">
                <div className="relative w-64 flex flex-col items-center">
                  {/* Thick Rope handles in secondary color */}
                  <div
                    className="w-24 h-14 border-4 rounded-t-full -mb-2 z-10 shadow-sm"
                    style={{ borderColor: secondaryCol }}
                  />

                  {/* Luxury Bag Body */}
                  <div
                    className="w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden border border-white/10 text-center space-y-5"
                    style={{
                      background: `linear-gradient(160deg, #111827 0%, ${primaryCol}44 100%)`,
                    }}
                  >
                    {/* Top fold crease */}
                    <div className="w-full h-1 bg-white/10 rounded-full" />

                    {/* Center Brand Name & Monogram */}
                    <div className="space-y-1.5 py-3">
                      <div
                        className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white text-lg font-black shadow-lg mb-2"
                        style={{ backgroundColor: primaryCol }}
                      >
                        {selectedName?.nameAr?.[0] || 'ب'}
                      </div>
                      <h4 className="text-2xl font-black text-white tracking-wide">
                        {selectedName?.nameAr}
                      </h4>
                      <span className="text-[10px] font-mono tracking-widest text-slate-300 block" dir="ltr">
                        {selectedName?.nameEn || 'PREMIUM BRAND PACK'}
                      </span>
                    </div>

                    {/* Accent Tag / Seal */}
                    <div className="pt-2 flex items-center justify-center">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-950 shadow-md flex items-center gap-1.5"
                        style={{ backgroundColor: accentCol }}
                      >
                        <span>★</span>
                        <span>تغليف فاخر 100% أصلي</span>
                      </span>
                    </div>
                  </div>

                  {/* Floor drop shadow */}
                  <div className="w-56 h-3 bg-black/60 rounded-full blur-md mt-2" />
                </div>
              </div>
            )}

            {/* 4. SOCIAL MEDIA POST MOCKUP */}
            {activeMockup === 'post' && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-[#0F172A] border border-slate-700 p-5 space-y-4 animate-in fade-in">
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ backgroundColor: primaryCol }}
                    >
                      {selectedName?.nameAr?.[0] || 'ب'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{selectedName?.nameAr}</span>
                      <span className="text-[10px] text-slate-400">منذ ساعتين · إعلان ممول</span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${secondaryCol}33`, color: secondaryCol }}
                  >
                    جديد وحصري
                  </span>
                </div>

                {/* Creative Visual Box */}
                <div
                  className="w-full h-44 rounded-xl flex flex-col items-center justify-center text-center p-5 space-y-2 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${primaryCol} 0%, ${secondaryCol} 100%)`,
                  }}
                >
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full text-slate-900 bg-white/90 shadow-sm">
                    عرض الافتتاح الخاص
                  </span>
                  <h5 className="text-lg font-black text-white">
                    {selectedName?.nameAr}
                  </h5>
                  <p className="text-xs text-white/90 max-w-xs leading-relaxed">
                    {selectedSlogan?.text}
                  </p>
                </div>

                {/* CTA Button in Accent Color */}
                <button
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 shadow-md transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: accentCol }}
                >
                  احصل على خصم 20% الآن 👈
                </button>
              </div>
            )}

            {/* 5. MOBILE APP UI MOCKUP */}
            {activeMockup === 'app' && (
              <div className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl bg-[#0B0F19] border-2 border-slate-700 p-4 space-y-4 animate-in fade-in">
                {/* Mobile Top Bar */}
                <div className="flex items-center justify-between text-xs text-white pb-2 border-b border-slate-800">
                  <span className="font-bold">{selectedName?.nameAr}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-sm"
                    style={{ backgroundColor: primaryCol }}
                  >
                    سلة الطلبات (1)
                  </span>
                </div>

                {/* Product Card */}
                {(() => {
                  const firstItem = pricing?.items?.[0];
                  const itemName = firstItem?.name || (brief?.idea?.includes('كبدة') ? 'ساندوتش كبدة إسكندراني مخصوص' : 'عرض التجربة المميز');
                  const itemPrice = firstItem?.priceEgp || (brief?.idea?.includes('كبدة') ? 45 : 120);
                  const itemDesc = firstItem?.description || (brief?.idea?.includes('كبدة') ? 'طشة ثوم وكمون وليمون في عيش بلدي مقرمش وطحينة' : 'مجهز طازجاً بأعلى معايير الإتقان والجودة');

                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[170px]">{itemName}</span>
                        <span className="text-xs font-extrabold shrink-0" style={{ color: accentCol }}>
                          {itemPrice} ج.م
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {itemDesc}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span
                          className="px-2 py-0.5 rounded-md font-semibold"
                          style={{ backgroundColor: `${secondaryCol}22`, color: secondaryCol }}
                        >
                          طلب فوري
                        </span>
                        <span className="text-slate-400">· متاح للتسليم والطلب الآن</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Main Action Button */}
                <button
                  className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryCol }}
                >
                  <span>إتمام الطلب الآن</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentCol }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Strategy Details */}
      <div className="pt-1">
        <button
          onClick={() => setShowFullStrategy(!showFullStrategy)}
          className="text-xs font-bold text-[#7C3AED] dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>{showFullStrategy ? 'إخفاء الاستراتيجية والتموضع' : 'عرض تفاصيل التموضع السوقي وعرض القيمة'}</span>
          {showFullStrategy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFullStrategy && (
          <div className="mt-4 p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-[#172033] dark:text-white block mb-0.5">التموضع السوقي:</strong>
                <p className="text-[#526077] dark:text-slate-300 leading-relaxed">{identity.strategy?.positioning}</p>
              </div>
              <div>
                <strong className="text-[#172033] dark:text-white block mb-0.5">عرض القيمة الفريدة:</strong>
                <p className="text-[#526077] dark:text-slate-300 leading-relaxed">{identity.strategy?.valueProposition}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
