import React from 'react';
import { Sparkles, Moon, Sun, FolderKanban, HelpCircle, Layers } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenHowItWorks: () => void;
  onOpenSavedBrands: () => void;
  onStartNow: () => void;
  onScrollToFeatures: () => void;
  savedBrandsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenHowItWorks,
  onOpenSavedBrands,
  onStartNow,
  onScrollToFeatures,
  savedBrandsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md transition-colors no-print" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Right side: Brand Title & Logo */}
        <div className="flex items-center gap-3">
          <button onClick={onStartNow} className="flex items-center gap-2.5 group text-right">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-[#172033] dark:text-white">
              BrandMaker AI
            </span>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#172033] dark:text-slate-200">
          <button
            onClick={onScrollToFeatures}
            className="hover:text-[#7C3AED] dark:hover:text-indigo-400 transition-colors"
          >
            المميزات
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-[#7C3AED] dark:hover:text-indigo-400 transition-colors"
          >
            كيف يعمل
          </button>
          <button
            onClick={onOpenSavedBrands}
            className="hover:text-[#7C3AED] dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span>مشاريعك</span>
            {savedBrandsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] dark:bg-indigo-900/60 dark:text-indigo-300 text-[11px] font-bold">
                {savedBrandsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Left side: Theme toggle & "ابدأ الآن" CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-2xl text-[#7C3AED] dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-800 transition-colors shadow-sm"
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#7C3AED]" />
            )}
          </button>

          <button
            onClick={onStartNow}
            className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </header>
  );
};
