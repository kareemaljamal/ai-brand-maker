import React from 'react';
import {
  Tag,
  Sparkles,
  Calculator,
  FileSpreadsheet,
  Megaphone,
  Palette,
  Copy,
  Check,
} from 'lucide-react';

export type TabKey = 'names' | 'identity' | 'pricing' | 'marketing' | 'visuals';

interface TabNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onCopyAll: () => void;
  isCopiedAll?: boolean;
  sectionStatuses?: Record<TabKey, 'loading' | 'ready' | 'error'>;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onSelectTab,
  onCopyAll,
  isCopiedAll,
  sectionStatuses,
}) => {
  const tabs: TabItem[] = [
    {
      key: 'names',
      label: 'الأسماء',
      icon: Tag,
    },
    {
      key: 'identity',
      label: 'الهوية',
      icon: Sparkles,
    },
    {
      key: 'pricing',
      label: 'دراسة الجدوى',
      icon: FileSpreadsheet,
    },
    {
      key: 'marketing',
      label: 'التسويق',
      icon: Megaphone,
    },
    {
      key: 'visuals',
      label: 'الشعار',
      icon: Palette,
    },
  ];

  return (
    <div className="space-y-2 mb-6 no-print max-w-full" dir="rtl">
      {/* Top Utility Header: Navigation Title & Copy Plan Action */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
          <span className="text-xs font-bold text-[#526077] dark:text-slate-400">
            أقسام المشروع
          </span>
        </div>

        <button
          onClick={onCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-[#172033] hover:bg-[#F5F3FF] hover:border-[#7C3AED] hover:text-[#5B21B6] dark:bg-[#131B2E] dark:border-slate-800 dark:text-slate-200 dark:hover:bg-indigo-950/70 dark:hover:border-indigo-500/60 dark:hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          title="نسخ الخطة بالكامل للحافظة"
        >
          {isCopiedAll ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#7C3AED] dark:text-indigo-400" />
          )}
          <span>نسخ الخطة</span>
        </button>
      </div>

      {/* Mobile App Style 5-Column Segmented Tab Bar: Perfectly balanced, zero overlap, no numbers */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 p-1.5 rounded-2xl bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md border border-[#E2E8F0] dark:border-slate-800 shadow-sm max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const status = sectionStatuses?.[tab.key] || 'ready';
          const isLoading = status === 'loading';
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`group relative py-2 sm:py-2.5 px-0.5 sm:px-2 rounded-xl sm:rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-95 text-center select-none ${
                isActive
                  ? 'bg-[#F5F3FF] dark:bg-indigo-950/70 text-[#7C3AED] dark:text-indigo-300 ring-1 ring-[#7C3AED]/30 shadow-xs'
                  : 'bg-transparent text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Icon Container with Mobile-native aesthetic */}
              <div className="relative flex items-center justify-center shrink-0">
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </span>

                {/* Status Indicator Dot (Loading Pulse or Ready Dot) */}
                {isLoading && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-[#131B2E] animate-ping"
                    title="جارٍ التجهيز..."
                  />
                )}
              </div>

              {/* Exact Uniform Label: Never overlaps, perfectly centered */}
              <span
                className={`text-[11px] sm:text-xs tracking-tight block truncate max-w-full text-center leading-none pt-0.5 ${
                  isActive ? 'font-black text-[#5B21B6] dark:text-indigo-200' : 'font-bold'
                }`}
              >
                {tab.label}
              </span>

              {/* Mobile Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] dark:bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
