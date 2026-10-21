import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  ArrowLeft,
  Tag,
  CheckCircle2,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { BrandIdentity, BrandBrief } from '../types/brand';
import { copyToClipboard } from '../utils/export';

interface NamesTabProps {
  identity: BrandIdentity;
  brief: BrandBrief;
  onSelectName: (nameId: string) => void;
  onSelectSlogan?: (sloganId: string) => void;
  onUpdateIdentity?: (updated: BrandIdentity) => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToIdentity?: () => void;
  onRegenerateNames?: () => void;
  onRestartAi?: () => void;
  isScopedLoading?: boolean;
  isReady?: boolean;
}

export const NamesTab: React.FC<NamesTabProps> = ({
  identity,
  brief,
  onSelectName,
  onNotify,
  onNavigateToIdentity,
  onRegenerateNames,
  onRestartAi,
  isScopedLoading,
  isReady = true,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const namesList = identity?.names || [];
  const selectedName =
    namesList.find((n) => n.id === identity.selectedNameId) ||
    namesList[0];

  const handleCopyText = async (text: string, key: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      onNotify(`تم نسخ ${label} بنجاح!`, 'success');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleCopyAllNames = () => {
    if (namesList.length === 0) return;
    const text = namesList
      .map((n, i) => `${i + 1}. ${n.nameAr} (${n.nameEn || ''}) - ${n.rationale || n.meaning || ''}`)
      .join('\n');
    handleCopyText(text, 'all-names', 'جميع الأسماء المقترحة');
  };

  // Live generation state: shown when actively refining with AI
  const isNamesLoading = isScopedLoading;

  return (
    <div className="space-y-8" dir="rtl">
      {/* ================= HERO HEADER ================= */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <h2 className="text-lg sm:text-xl font-black text-[#172033] dark:text-white">
              الأسماء المقترحة لمشروعك
            </h2>

            {isNamesLoading ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>جاري تحديث وتوليد أسماء بالذكاء الاصطناعي... ⚡</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>6 أسماء جاهزة ومحفوظة بنسبة 100%</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-400 max-w-2xl leading-relaxed">
            يتم ابتكار الأسماء العربية خصيصاً لفكرة مشروعك. اختر اسمك المفضل لاعتماده رسمياً، ويتم ربطه تلقائياً بقصة البراند، نبرة الصوت، وهوية المشروع!
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleCopyAllNames}
            disabled={namesList.length === 0}
            className="px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-[#172033] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm disabled:opacity-40"
          >
            {copiedKey === 'all-names' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#7C3AED] dark:text-indigo-400" />
            )}
            <span>نسخ الأسماء</span>
          </button>

          {onRegenerateNames && (
            <button
              onClick={onRegenerateNames}
              disabled={isScopedLoading}
              className="px-3.5 py-2 rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScopedLoading ? 'animate-spin' : ''}`} />
              <span>اقتراح بدائل أخرى</span>
            </button>
          )}

          {onRestartAi && (
            <button
              onClick={onRestartAi}
              disabled={isScopedLoading}
              title="إعادة تهيئة وتشغيل محرك الذكاء الاصطناعي فوراً في حال حدوث أي بطء"
              className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm shadow-purple-500/20 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isScopedLoading ? 'animate-spin' : ''}`} />
              <span>إعادة تشغيل الذكاء الاصطناعي ⚡</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= LIVE AI GENERATION ALERT ================= */}
      {isNamesLoading && (
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Clock className="w-4 h-4" />
              </span>
              <div className="text-right">
                <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  الذكاء الاصطناعي متصل ويقوم بالابتكار والتطوير الآن ⚡
                </h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  جميع الأسماء الستة محفوظة وجاهزة، ويتم تحديثها بالخيارات الجديدة فور جهوزيتها تلقائياً.
                </p>
              </div>
            </div>
            {onRestartAi && (
              <button
                onClick={onRestartAi}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة تشغيل الآن 🔄</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 6 PROPOSED NAMES GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => {
          const item = namesList[idx];

          // 1. If candidate exists, render real active card
          if (item) {
            const isSelected = item.id === (identity.selectedNameId || selectedName?.id);

            return (
              <div
                key={item.id}
                onClick={() => onSelectName(item.id)}
                className={`group relative rounded-3xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between border animate-in fade-in zoom-in-95 duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-50/90 to-white dark:from-indigo-950/50 dark:to-[#131B2E] border-2 border-[#7C3AED] dark:border-indigo-500 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20'
                    : 'bg-white dark:bg-[#131B2E] border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED]/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Row: Rank Badge & Style */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-[#526077] dark:text-slate-400 group-hover:bg-[#EDE9FE] group-hover:text-[#5B21B6]'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {item.style && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[#526077] dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-semibold">
                          {item.style}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>الاسم المعتمد</span>
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyText(item.nameAr, `name-${item.id}`, 'اسم البراند');
                        }}
                        className="p-1.5 rounded-xl text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="نسخ الاسم"
                      >
                        {copiedKey === `name-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Name Headline */}
                  <h3 className={`text-xl sm:text-2xl font-black mb-1 transition-colors ${
                    isSelected ? 'text-[#5B21B6] dark:text-white' : 'text-[#172033] dark:text-slate-100 group-hover:text-[#7C3AED] dark:group-hover:text-indigo-300'
                  }`}>
                    {item.nameAr}
                  </h3>

                  {item.nameEn && (
                    <p className="text-xs font-mono text-[#64748B] dark:text-slate-400 mb-3" dir="ltr">
                      {item.nameEn}
                    </p>
                  )}

                  {/* Rationale / Meaning */}
                  <p className="text-xs text-[#526077] dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 mb-4">
                    {item.rationale || item.meaning}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectName(item.id);
                    onNotify(`تم اعتماد اسم "${item.nameAr}" رسمياً لمشروعك!`, 'success');
                  }}
                  className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-indigo-950/70 text-[#526077] dark:text-slate-300 hover:text-[#5B21B6] dark:hover:text-white border border-[#CBD5E1] dark:border-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم اعتماده كاسم للمشروع</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-3.5 h-3.5 text-[#7C3AED] dark:text-indigo-400" />
                      <span>اعتمد هذا الاسم</span>
                    </>
                  )}
                </button>
              </div>
            );
          }

          // 2. If slot is not ready yet: render animated loading skeleton card
          const isCurrentSlot = idx === namesList.length;

          return (
            <div
              key={`skeleton-${idx}`}
              className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between min-h-[240px] ${
                isCurrentSlot
                  ? 'bg-purple-50/60 dark:bg-indigo-950/30 border-[#DDD6FE] dark:border-indigo-800 shadow-sm animate-pulse'
                  : 'bg-[#F8F7FC]/70 dark:bg-slate-900/30 border-[#E2E8F0] dark:border-slate-800/80 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isCurrentSlot
                          ? 'bg-[#7C3AED] text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                      الخيار {idx + 1}
                    </span>
                  </div>

                  {isCurrentSlot ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] dark:bg-indigo-900/60 dark:text-indigo-300 font-bold flex items-center gap-1 border border-[#DDD6FE] dark:border-indigo-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-ping" />
                      <span>قيد الابتكار الآن...</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>في الانتظار ⏳</span>
                    </span>
                  )}
                </div>

                <div className="h-7 w-36 bg-slate-200/80 dark:bg-slate-800 rounded-xl mb-2 animate-pulse" />
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-850 rounded-lg mb-4" />

                <div className="space-y-2 bg-white/60 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-4/5 bg-slate-200/70 dark:bg-slate-800 rounded" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center text-xs text-[#64748B] dark:text-slate-400 font-medium gap-1.5">
                {isCurrentSlot ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-spin" />
                    <span className="font-bold text-[#7C3AED] dark:text-indigo-400">
                      الذكاء الاصطناعي يقوم بالصياغة... ⚡
                    </span>
                  </>
                ) : (
                  <span>سيظهر الاسم تلقائياً فور ابتكاره</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= NEXT STEP CALL-TO-ACTION ================= */}
      {onNavigateToIdentity && (
        <div className="bg-gradient-to-l from-purple-50 via-white to-indigo-50/50 dark:from-indigo-950/40 dark:via-[#131B2E] dark:to-[#131B2E] rounded-3xl border border-[#DDD6FE] dark:border-indigo-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#172033] dark:text-white">
                الخطوة التالية: هوية البراند ونبرة الصوت والشعارات اللفظية
              </h4>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
                استعرض قصة البراند المخصصة لاسم "{selectedName?.nameAr || 'مشروعك'}"، نبرة الخطاب، الشعارات اللفظية (السلوجان)، وأكواد الألوان الرسمية.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToIdentity}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <span>الانتقال لهوية البراند</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
