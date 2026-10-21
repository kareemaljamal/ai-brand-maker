import React, { useState } from 'react';
import { Send, History, Copy, Check, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { SectionRevision } from '../types/brand';

export interface QuickActionOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  highlight?: boolean;
}

interface ControlStripProps<T> {
  sectionTitle: string;
  quickActions: QuickActionOption[];
  onInstructionSubmit: (instruction: string) => void;
  isLoading?: boolean;
  revisions: SectionRevision<T>[];
  onRestoreRevision: (rev: SectionRevision<T>) => void;
  onCopySection: () => void;
  copiedSection?: boolean;
  inputPlaceholder?: string;
}

export function ControlStrip<T>({
  sectionTitle,
  quickActions,
  onInstructionSubmit,
  isLoading,
  revisions = [],
  onRestoreRevision,
  onCopySection,
  copiedSection,
  inputPlaceholder = 'كيف تحب نعدّل هذا الجزء؟',
}: ControlStripProps<T>) {
  const [instruction, setInstruction] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isLoading) return;
    onInstructionSubmit(instruction.trim());
    setInstruction('');
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#151D32] border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-3.5 no-print" dir="rtl">
      {/* Top row: Quick actions chips */}
      {quickActions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#526077] dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] dark:text-cyan-400" />
            إجراءات وتعديلات سريعة:
          </span>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                disabled={action.disabled || isLoading}
                onClick={action.onClick}
                className={`text-xs px-3 py-1 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none ${
                  action.highlight
                    ? 'bg-[#EDE9FE] hover:bg-purple-100 text-[#5B21B6] border border-[#DDD6FE] font-bold dark:bg-purple-600/30 dark:hover:bg-purple-600/50 dark:text-purple-200 dark:border-purple-500/40'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#526077] hover:text-[#172033] border border-[#E2E8F0] dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/60'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Middle row: Scoped instruction input + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isLoading}
              placeholder={inputPlaceholder}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-[#CBD5E1] dark:border-slate-700/80 focus:border-[#7C3AED] text-xs sm:text-sm text-[#172033] dark:text-slate-100 placeholder:text-[#64748B] outline-none transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!instruction.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">تعديل بالذكاء</span>
          </button>
        </form>

        <div className="flex items-center gap-2 justify-end shrink-0">
          {/* Revisions Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] dark:border-slate-700/80 text-xs font-semibold text-[#172033] dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title="سجل الإصدارات السابقة لهذا القسم"
            >
              <History className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />
              <span>الإصدارات ({revisions.length})</span>
            </button>

            {/* Dropdown Menu */}
            {showHistory && (
              <div className="absolute left-0 mt-2 w-64 p-2 rounded-xl bg-white dark:bg-[#151D32] border border-[#E2E8F0] dark:border-slate-700 shadow-2xl z-30 animate-in fade-in space-y-1">
                <div className="p-2 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#172033] dark:text-slate-300">
                  <span>سجل تعديلات {sectionTitle}</span>
                  <span className="text-[10px] text-[#64748B]">(حتى 10 نسخ)</span>
                </div>
                {revisions.length === 0 ? (
                  <p className="p-3 text-[11px] text-[#64748B] text-center">لا توجد إصدارات سابقة بعد</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {revisions.map((rev) => (
                      <button
                        key={rev.id}
                        type="button"
                        onClick={() => {
                          onRestoreRevision(rev);
                          setShowHistory(false);
                        }}
                        className="w-full text-right p-2 rounded-lg hover:bg-[#EDE9FE]/50 dark:hover:bg-purple-950/40 border border-transparent hover:border-[#DDD6FE] dark:hover:border-purple-800/40 text-xs text-[#172033] dark:text-slate-300 hover:text-[#5B21B6] dark:hover:text-purple-200 transition-colors flex items-center justify-between"
                      >
                        <div className="truncate flex-1">
                          <span className="font-semibold block truncate">{rev.title}</span>
                          <span className="text-[10px] text-[#64748B]">
                            {new Date(rev.timestamp).toLocaleTimeString('ar-EG-u-nu-latn', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED] dark:text-cyan-400 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Copy Section Button */}
          <button
            type="button"
            onClick={onCopySection}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] dark:border-slate-700/80 text-xs font-semibold text-[#172033] dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="نسخ محتوى هذا القسم كاملاً"
          >
            {copiedSection ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-[#7C3AED] dark:text-slate-400" />
            )}
            <span>نسخ القسم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
