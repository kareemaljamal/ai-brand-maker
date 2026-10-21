import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print"
      dir="rtl"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    if (toast.type === 'error') return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles =
    toast.type === 'success'
      ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
      : toast.type === 'error'
      ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-500/40 text-rose-900 dark:text-rose-100'
      : 'bg-white dark:bg-[#151D32]/95 border-[#E2E8F0] dark:border-purple-500/40 text-[#172033] dark:text-slate-100 shadow-xl';

  const iconColor =
    toast.type === 'success'
      ? 'text-emerald-600 dark:text-emerald-400'
      : toast.type === 'error'
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-[#7C3AED] dark:text-purple-400';

  const Icon =
    toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${bgStyles}`}
      role="alert"
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
        <p className="text-sm font-medium leading-relaxed break-words">{toast.text}</p>
      </div>

      {toast.actionLabel && toast.onAction && (
        <button
          onClick={() => {
            toast.onAction?.();
            onDismiss(toast.id);
          }}
          className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-white/20 dark:hover:bg-white/30 text-white transition-colors shrink-0"
        >
          {toast.actionLabel}
        </button>
      )}

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#64748B] hover:text-[#172033] dark:text-white/60 dark:hover:text-white transition-colors p-1"
        aria-label="إغلاق التنبيه"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
