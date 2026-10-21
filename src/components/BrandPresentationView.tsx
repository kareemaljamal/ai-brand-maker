import React from 'react';
import {
  ArrowRight,
  Download,
  AlertCircle,
  Calendar,
  Sparkles,
  Check,
  MapPin,
  Target,
  Coins,
  Shield,
  Layers,
} from 'lucide-react';
import { BrandProject } from '../types/brand';
import { formatEgp, exportBrandAsTxt } from '../utils/export';

interface BrandPresentationViewProps {
  brand: BrandProject;
  onBackToEdit: () => void;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const BrandPresentationView: React.FC<BrandPresentationViewProps> = ({
  brand,
  onBackToEdit,
  onNotify,
}) => {
  const selectedName =
    brand.identity.names.find((n) => n.id === brand.identity.selectedNameId) || brand.identity.names[0];
  const selectedSlogan =
    brand.identity.slogans.find((s) => s.id === brand.identity.selectedSloganId) || brand.identity.slogans[0];

  const primaryColor =
    brand.identity.palette.find((c) => c.role === 'primary')?.hex || '#7C3AED';
  const bgColor =
    brand.identity.palette.find((c) => c.role === 'background')?.hex || '#0B1020';
  const textColor =
    brand.identity.palette.find((c) => c.role === 'text')?.hex || '#F8FAFC';

  const hasStale =
    brand.staleSections.identity ||
    brand.staleSections.pricing ||
    brand.staleSections.marketing ||
    brand.staleSections.visuals;

  const handleExportTxt = () => {
    exportBrandAsTxt(brand);
    onNotify('تم تنزيل النسخة النصية للوثيقة بنجاح.', 'success');
  };

  const generationDate = new Date(brand.updatedAt || brand.createdAt).toLocaleDateString('ar-EG-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F7FC] dark:bg-[#0B1020] text-[#172033] dark:text-slate-100 py-8 px-4 sm:px-8 selection:bg-purple-500/30" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151D32] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#172033] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700/80 text-xs font-bold transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للتعديل واللوحة</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTxt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition-all active:scale-95"
              title="تنزيل الخطة والوثيقة كاملة كملف نصي"
            >
              <Download className="w-4 h-4" />
              <span>تصدير ملف الوثيقة (TXT)</span>
            </button>
          </div>
        </div>

        {/* Stale Warning Banner (Hidden during print) */}
        {hasStale && (
          <div className="no-print p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              ملاحظة: تم تعديل ملخص المشروع مؤخراً وهناك أقسام قد تحتاج لمزامنة إضافية في لوحة التعديل. المعروض حالياً هو النسخة المعتمدة النشطة.
            </span>
          </div>
        )}

        {/* Printable Brand Presentation Document */}
        <div className="bg-white dark:bg-[#151D32] print:bg-white print:text-slate-900 print:shadow-none print:border-none rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-6 sm:p-12 space-y-10">
          {/* Header of Presentation */}
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 print-avoid-break">
            <div className="flex items-center gap-4">
              {brand.visuals.logoImage?.url ? (
                <img
                  src={brand.visuals.logoImage.url}
                  alt="Brand Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white/5 p-1 border border-white/10"
                />
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-lg shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(selectedName?.nameAr || brand.title || 'ب').slice(0, 1)}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#172033] dark:text-slate-100 print:text-slate-900">
                    {selectedName?.nameAr}
                  </h1>
                  {selectedName?.nameEn && (
                    <span className="text-base font-mono text-[#64748B] dark:text-slate-400 print:text-slate-600" dir="ltr">
                      ({selectedName.nameEn})
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-[#7C3AED] dark:text-purple-300 print:text-purple-700 italic mt-1 font-medium">
                  "{selectedSlogan?.text}"
                </p>
                <div className="flex items-center gap-3 text-xs text-[#526077] dark:text-slate-400 print:text-slate-600 mt-2">
                  <span>{brand.brief.category}</span>
                  <span>•</span>
                  <span>{brand.brief.city}</span>
                  <span>•</span>
                  <span>وثيقة استراتيجية متكاملة</span>
                </div>
              </div>
            </div>

            <div className="text-left text-xs text-[#64748B] dark:text-slate-500 print:text-slate-600 shrink-0">
              <span className="block font-semibold">تاريخ التوثيق:</span>
              <span>{generationDate}</span>
            </div>
          </div>

          {/* Section 1: Executive Summary & Strategy */}
          <div className="space-y-4 print-avoid-break">
            <h2 className="text-lg font-bold text-[#172033] dark:text-cyan-400 print:text-purple-900 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 pb-2">
              <Sparkles className="w-5 h-5 text-[#7C3AED] dark:text-purple-400" />
              1. استراتيجية وتموضع العلامة التجارية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 md:col-span-2 space-y-1">
                <span className="font-bold text-[#5B21B6] dark:text-purple-300 print:text-purple-900 block">
                  قصة البراند (Brand Story):
                </span>
                <p className="text-[#526077] dark:text-slate-300 print:text-slate-700 leading-relaxed font-medium">
                  {brand.identity.strategy.story}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 space-y-1">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block">
                  التموضع السوقي (Positioning):
                </span>
                <p className="text-[#526077] dark:text-slate-300 print:text-slate-700 leading-relaxed">
                  {brand.identity.strategy.positioning}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 space-y-1">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block">
                  عرض القيمة الفريدة (Value Proposition):
                </span>
                <p className="text-[#526077] dark:text-slate-300 print:text-slate-700 leading-relaxed">
                  {brand.identity.strategy.valueProposition}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 space-y-1">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block">
                  الجمهور المستهدف:
                </span>
                <p className="text-[#526077] dark:text-slate-300 print:text-slate-700 leading-relaxed">
                  {brand.brief.targetAudience}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 space-y-1">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block">
                  نبرة الصوت المعتمدة:
                </span>
                <p className="text-[#526077] dark:text-slate-300 print:text-slate-700 leading-relaxed">
                  {brand.identity.voice.traits?.join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Color Palette */}
          <div className="space-y-4 print-avoid-break">
            <h2 className="text-lg font-bold text-[#172033] dark:text-cyan-400 print:text-purple-900 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 pb-2">
              <Layers className="w-5 h-5 text-[#7C3AED] dark:text-purple-400" />
              2. لوحة الألوان المعتمدة (Color Palette)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {brand.identity.palette.map((col) => (
                <div
                  key={col.role}
                  className="p-3 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-white border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 space-y-2"
                >
                  <div
                    className="w-full h-12 rounded-lg shadow-inner border border-black/10"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <span className="text-xs font-bold block text-[#172033] dark:text-slate-200 print:text-slate-900">
                      {col.nameAr}
                    </span>
                    <span className="text-[11px] font-mono text-[#7C3AED] dark:text-purple-300 print:text-purple-700" dir="ltr">
                      {col.hex}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-500 block truncate">{col.usageNote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pricing Strategy in EGP */}
          <div className="space-y-4 print-avoid-break">
            <h2 className="text-lg font-bold text-[#172033] dark:text-cyan-400 print:text-purple-900 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 pb-2">
              <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              3. هيكل التسعير بالجنيه المصري (EGP)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brand.pricing.tiers.map((tier, idx) => {
                const varCost = tier.variableCostEgp;
                const contribution = varCost !== undefined ? tier.priceEgp - varCost : null;

                return (
                  <div
                    key={tier.id}
                    className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/70 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#172033] dark:text-slate-200 print:text-slate-900">
                        {tier.title}
                      </span>
                      <span className="text-[11px] text-[#7C3AED] dark:text-purple-400 font-bold font-mono">
                        {formatEgp(tier.priceEgp)}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-600 block">
                      الوحدة: {tier.billingUnit}
                    </span>

                    <ul className="space-y-0.5 text-[11px] text-[#526077] dark:text-slate-300 print:text-slate-700">
                      {tier.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    {contribution !== null && (
                      <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 text-[10px] text-[#64748B] dark:text-slate-400 print:text-slate-600">
                        هامش المساهمة للوحدة: {formatEgp(contribution)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: 30-Day Marketing Roadmap Summary */}
          <div className="space-y-4 print-page-break">
            <h2 className="text-lg font-bold text-[#172033] dark:text-cyan-400 print:text-purple-900 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 pb-2">
              <Calendar className="w-5 h-5 text-[#7C3AED] dark:text-purple-400" />
              4. ملخص خارطة إطلاق الـ 30 يوماً
            </h2>

            <div className="p-3.5 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/20 print:bg-slate-100 border border-[#DDD6FE] dark:border-purple-900/30 print:border-slate-300 text-xs text-[#5B21B6] dark:text-purple-200 print:text-slate-800 mb-3">
              <strong>رسالة الإطلاق: </strong>"{brand.marketing.coreLaunchMessage}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-white border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block mb-1">
                  الأسبوع 1 (الإطلاق والتوعية - أيام 1 إلى 7)
                </span>
                <p className="text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-600 leading-relaxed">
                  التركيز على بناء الفضول، كواليس التأسيس، إطلاق القنوات، وإعلان افتتاح النشاط في {brand.brief.city}.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-white border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block mb-1">
                  الأسبوع 2 (تفعيل الطلبات والتجربة - أيام 8 إلى 14)
                </span>
                <p className="text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-600 leading-relaxed">
                  تفعيل عروض الافتتاح الخاصة، حث العملاء الأوائل على التجربة والتقييم، والترويج المباشر للباقة الأكثر طلباً.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-white border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block mb-1">
                  الأسبوع 3 (بناء الثقة والتفاعل - أيام 15 إلى 21)
                </span>
                <p className="text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-600 leading-relaxed">
                  مشاركة تقييمات العملاء الحقيقيين، فيديوهات تفاعلية ريلز وتيك توك، والإجابة عن الأسئلة الشائعة.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/60 print:bg-white border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300">
                <span className="font-bold text-[#172033] dark:text-slate-200 print:text-slate-900 block mb-1">
                  الأسبوع 4 والأيام 29-30 (الولاء والتوسع)
                </span>
                <p className="text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-600 leading-relaxed">
                  حملات إعادة الشراء للعملاء، باقات الولاء، تقييم مؤشرات الأداء للشهر الأول، وإطلاق ميزات الشهر القادم.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: AI Image Prompts (English LTR) */}
          <div className="space-y-4 print-avoid-break">
            <h2 className="text-lg font-bold text-[#172033] dark:text-cyan-400 print:text-purple-900 flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 print:border-slate-200 pb-2">
              <Sparkles className="w-5 h-5 text-[#7C3AED] dark:text-purple-400" />
              5. برومبتات الهوية البصرية (English Prompts)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/80 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 space-y-1.5 text-left" dir="ltr">
                <span className="font-bold text-[#5B21B6] dark:text-purple-300 print:text-purple-900 block">
                  Logo Prompt (Vector Glyph):
                </span>
                <p className="font-mono text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-700 leading-relaxed">
                  {brand.visuals.logoPrompt}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7FC] dark:bg-slate-900/80 print:bg-slate-50 border border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 space-y-1.5 text-left" dir="ltr">
                <span className="font-bold text-[#5B21B6] dark:text-purple-300 print:text-purple-900 block">
                  Avatar Prompt (Circle-Safe 1:1):
                </span>
                <p className="font-mono text-[11px] text-[#526077] dark:text-slate-400 print:text-slate-700 leading-relaxed">
                  {brand.visuals.avatarPrompt}
                </p>
              </div>
            </div>
          </div>

          {/* Footer of Presentation Document */}
          <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800 print:border-slate-300 text-center text-xs text-[#64748B] dark:text-slate-500 print:text-slate-600 print-avoid-break space-y-1">
            <p>
              وثيقة استراتيجية مُولدة ومُدارة بواسطة <strong>BrandMaker AI — صانع البراند الذكي</strong>.
            </p>
            <p className="text-[10px]">
              كافة الأسعار مقدرة بالجنيه المصري (EGP). الاستراتيجيات والتسعير مقترحات استرشادية تخضع لمواءمة صاحب المشروع.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
