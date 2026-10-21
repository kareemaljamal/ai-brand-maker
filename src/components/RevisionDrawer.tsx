import React from 'react';
import { Check, X, ArrowLeftRight, Clock, AlertCircle } from 'lucide-react';

interface RevisionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  beforeSummary: string;
  afterSummary: string;
  onAccept: () => void;
}

export const RevisionDrawer: React.FC<RevisionDrawerProps> = ({
  isOpen,
  onClose,
  title,
  beforeSummary,
  afterSummary,
  onAccept,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-[#172033] dark:text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#7C3AED] dark:text-indigo-400 border border-[#DDD6FE] dark:border-indigo-800/80">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033] dark:text-white">معاينة التعديل المقترح ({title})</h3>
              <p className="text-xs text-[#526077] dark:text-slate-400">
                قارن بين النسخة الحالية والنسخة المقترحة قبل الاعتماد النهائي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#526077] dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>النسخة الحالية (قبل التعديل)</span>
            </div>
            <div className="flex-1 text-xs text-[#172033] dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-950/40 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-y-auto max-h-60">
              {beforeSummary}
            </div>
          </div>

          {/* After */}
          <div className="p-4 rounded-2xl bg-[#EDE9FE]/50 dark:bg-indigo-950/20 border border-[#DDD6FE] dark:border-indigo-900/40 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#7C3AED] dark:text-indigo-400">
              <Check className="w-3.5 h-3.5" />
              <span>النسخة المقترحة بعد التطبيق</span>
            </div>
            <div className="flex-1 text-xs text-[#5B21B6] dark:text-indigo-200 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-950/40 p-3 rounded-xl border border-[#DDD6FE] dark:border-indigo-900/40 overflow-y-auto max-h-60">
              {afterSummary}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-[#526077] dark:text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>يمكنك دائماً الرجوع للتعديلات السابقة من سجل الإصدارات</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white text-[#172033] dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>اعتماد التعديل المقترح</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
