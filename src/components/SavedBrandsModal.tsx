import React, { useState } from 'react';
import { X, FolderKanban, Trash2, ExternalLink, Calendar, AlertTriangle } from 'lucide-react';
import { BrandProject } from '../types/brand';

interface SavedBrandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBrands: BrandProject[];
  onSelectBrand: (brand: BrandProject) => void;
  onDeleteBrand: (id: string) => void;
}

export const SavedBrandsModal: React.FC<SavedBrandsModalProps> = ({
  isOpen,
  onClose,
  savedBrands,
  onSelectBrand,
  onDeleteBrand,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl shadow-2xl text-[#172033] dark:text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#7C3AED] dark:text-indigo-400 border border-[#DDD6FE] dark:border-indigo-800/80">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-white">برانداتي المحفوظة</h2>
              <p className="text-xs text-[#526077] dark:text-slate-400">
                المشاريع المحفوظة محلياً على هذا المتصفح ({savedBrands.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Brand List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedBrands.length === 0 ? (
            <div className="py-12 text-center text-[#64748B]">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#7C3AED]" />
              <p className="text-sm font-semibold text-[#172033] dark:text-slate-300 mb-1">لا توجد مشاريع براند محفوظة حتى الآن</p>
              <p className="text-xs text-[#526077] max-w-xs mx-auto">
                ابدأ بكتابة فكرة مشروعك وتوليده في الصفحة الرئيسية ليتم حفظه تلقائياً هنا.
              </p>
            </div>
          ) : (
            savedBrands.map((brand) => {
              const selectedName =
                brand.identity?.names?.find((n) => n.id === brand.identity.selectedNameId) ||
                brand.identity?.names?.[0];
              const nameDisplay = selectedName ? selectedName.nameAr : brand.title;

              return (
                <div
                  key={brand.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED] transition-all flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => {
                      onSelectBrand(brand);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm sm:text-base text-[#172033] dark:text-white truncate group-hover:text-[#7C3AED] transition-colors">
                        {nameDisplay}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 border border-[#DDD6FE] font-semibold shrink-0">
                        {brand.brief.category || 'مشروع'}
                      </span>
                    </div>

                    <p className="text-xs text-[#526077] dark:text-slate-400 truncate mb-2">
                      {brand.brief.idea}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(brand.updatedAt || brand.createdAt).toLocaleDateString('ar-EG-u-nu-latn', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>{brand.identity?.palette?.length || 5} ألوان</span>
                      <span>•</span>
                      <span>3 باقات تسعير</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectBrand(brand);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>فتح</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === brand.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteBrand(brand.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800 text-[#172033] dark:text-slate-300 dark:hover:text-white text-[11px] font-semibold transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(brand.id)}
                        className="p-1.5 rounded-xl text-[#64748B] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
