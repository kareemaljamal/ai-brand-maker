import React, { useState } from 'react';
import { ChevronRight, Check, AlertTriangle, MonitorPlay } from 'lucide-react';
import { BrandProject } from '../types/brand';

interface ResultsHeaderProps {
  brand: BrandProject;
  onNewProject: () => void;
  onOpenPresentation: () => void;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
  onRestartAi?: () => void;
  isRestarting?: boolean;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  brand,
  onNewProject,
  onOpenPresentation,
  onRestartAi,
  isRestarting,
}) => {
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0] dark:border-slate-800/80 no-print flex-wrap gap-2" dir="rtl">
      {/* Right side (in RTL): < مشروع جديد + Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowConfirmNew(true)}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#526077] dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-indigo-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>مشروع جديد</span>
        </button>

        <span className="text-[#CBD5E1] dark:text-slate-700">|</span>

        <h1 className="text-base sm:text-lg font-black text-[#172033] dark:text-white truncate max-w-md">
          {(brand?.brief?.idea || brand?.title || 'مشروعي').slice(0, 45)}
        </h1>
      </div>

      {/* Left side: إعادة تشغيل الـ AI + تم الحفظ تلقائياً */}
      <div className="flex items-center gap-2">
        {onRestartAi && (
          <button
            onClick={onRestartAi}
            disabled={isRestarting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-[#7C3AED] dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="إعادة تشغيل محرك الذكاء الاصطناعي وتحديث البيانات"
          >
            <span className="inline-block animate-spin text-[11px] leading-none">⚡</span>
            <span>{isRestarting ? 'جاري الاستئناف...' : 'استئناف الذكاء الاصطناعي 🔄'}</span>
          </button>
        )}

        <button
          onClick={onOpenPresentation}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#172033] border border-[#CBD5E1] dark:bg-slate-800 dark:border-transparent dark:text-slate-300 text-xs font-semibold dark:hover:bg-slate-700 transition-colors shadow-sm"
          title="عرض واستعراض وثيقة البراند الكاملة"
        >
          <MonitorPlay className="w-3.5 h-3.5 text-[#7C3AED] dark:text-indigo-400" />
          <span>اعرض الوثيقة</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 text-xs font-bold shadow-sm">
          <Check className="w-3.5 h-3.5" />
          <span>تم الحفظ تلقائياً</span>
        </div>
      </div>

      {/* Confirm New Project Dialog */}
      {showConfirmNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-[#172033] dark:text-slate-100">
            <div className="flex items-center gap-2.5 text-rose-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">بدء مشروع جديد؟</h3>
            </div>
            <p className="text-xs text-[#526077] dark:text-slate-300 leading-relaxed">
              مشروعك الحالي محفوظ بالفعل في قائمة مشاريعك. هل ترغب في العودة إلى الصفحة الرئيسية للبدء بفكرة جديدة؟
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                onClick={() => setShowConfirmNew(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#172033] border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                تراجع
              </button>
              <button
                onClick={() => {
                  setShowConfirmNew(false);
                  onNewProject();
                }}
                className="px-4 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all"
              >
                نعم، ابدأ جديداً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
