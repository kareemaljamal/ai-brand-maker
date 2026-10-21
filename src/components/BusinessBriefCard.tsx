import React, { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp, Edit3, Check, X, AlertCircle, RefreshCw, MapPin, Target, Wallet, Layers } from 'lucide-react';
import { BrandBrief, BusinessModel, PricingPosition, PersonalityType } from '../types/brand';
import { formatEgp } from '../utils/export';

interface BusinessBriefCardProps {
  brief: BrandBrief;
  onUpdateBrief: (newBrief: BrandBrief, sectionsToUpdate: string[]) => void;
  isUpdatingDependencies?: boolean;
}

export const BusinessBriefCard: React.FC<BusinessBriefCardProps> = ({
  brief,
  onUpdateBrief,
  isUpdatingDependencies,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form edit state
  const [idea, setIdea] = useState(brief.idea);
  const [category, setCategory] = useState(brief.category);
  const [businessModel, setBusinessModel] = useState<BusinessModel>(brief.businessModel);
  const [city, setCity] = useState(brief.city);
  const [district, setDistrict] = useState(brief.district || '');
  const [targetAudience, setTargetAudience] = useState(brief.targetAudience);
  const [pricingPosition, setPricingPosition] = useState<PricingPosition>(brief.pricingPosition);
  const [personality, setPersonality] = useState(brief.personality);
  const [budgetEgp, setBudgetEgp] = useState<number | ''>(brief.budgetEgp ?? '');
  const [knownVariableCostsEgp, setKnownVariableCostsEgp] = useState<number | ''>(
    brief.knownVariableCostsEgp ?? ''
  );
  const [knownMonthlyFixedCostsEgp, setKnownMonthlyFixedCostsEgp] = useState<number | ''>(
    brief.knownMonthlyFixedCostsEgp ?? ''
  );

  // Proposed updates modal/drawer
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [selectedAffectedSections, setSelectedAffectedSections] = useState<Record<string, boolean>>({
    identity: true,
    pricing: true,
    marketing: true,
    visuals: true,
  });

  const handleOpenEdit = () => {
    setIdea(brief.idea);
    setCategory(brief.category);
    setBusinessModel(brief.businessModel);
    setCity(brief.city);
    setDistrict(brief.district || '');
    setTargetAudience(brief.targetAudience);
    setPricingPosition(brief.pricingPosition);
    setPersonality(brief.personality);
    setBudgetEgp(brief.budgetEgp ?? '');
    setKnownVariableCostsEgp(brief.knownVariableCostsEgp ?? '');
    setKnownMonthlyFixedCostsEgp(brief.knownMonthlyFixedCostsEgp ?? '');
    setIsEditing(true);
    setIsExpanded(true);
  };

  // Determine affected sections deterministically based on what changed
  const getAffectedSections = () => {
    const affected: { id: string; name: string; reason: string }[] = [];

    if (idea !== brief.idea || personality !== brief.personality) {
      affected.push({
        id: 'identity',
        name: 'الهوية والاستراتيجية',
        reason: 'تغيير جوهر الفكرة أو الطابع يؤثر على القصة والتموضع والنبرة واللوحة اللونية.',
      });
      affected.push({
        id: 'visuals',
        name: 'الهوية البصرية (اللوجو والأفاتار)',
        reason: 'التوجه البصري والبرومبتات مبنية على فكرة المشروع وطابعه وشخصيته.',
      });
    }

    if (
      pricingPosition !== brief.pricingPosition ||
      knownVariableCostsEgp !== brief.knownVariableCostsEgp ||
      knownMonthlyFixedCostsEgp !== brief.knownMonthlyFixedCostsEgp
    ) {
      affected.push({
        id: 'pricing',
        name: 'التسعير والباقات',
        reason: 'تغيير التموضع السعري أو التكاليف يؤثر على أسعار وهوامش الباقات ومستهدفاتها.',
      });
    }

    if (
      city !== brief.city ||
      targetAudience !== brief.targetAudience ||
      businessModel !== brief.businessModel ||
      budgetEgp !== brief.budgetEgp
    ) {
      affected.push({
        id: 'marketing',
        name: 'الخطة التسويقية وقنوات الإطلاق',
        reason: 'تغيير المدينة أو طبيعة النموذج (أونلاين/مقر) أو الجمهور يستلزم ملائمة القنوات والأنشطة.',
      });
    }

    return affected;
  };

  const handleReviewChanges = () => {
    const affected = getAffectedSections();
    if (affected.length === 0) {
      // Just save brief metadata without regenerating any section
      saveBriefChanges([]);
      return;
    }

    // Default select all affected
    const initialSelected: Record<string, boolean> = {};
    affected.forEach((a) => {
      initialSelected[a.id] = true;
    });
    setSelectedAffectedSections(initialSelected);
    setShowDependencyModal(true);
  };

  const saveBriefChanges = (sectionsToUpdate: string[]) => {
    const updatedBrief: BrandBrief = {
      ...brief,
      idea: idea.trim(),
      category: category.trim(),
      businessModel,
      city: city.trim(),
      district: district.trim() || undefined,
      targetAudience: targetAudience.trim(),
      pricingPosition,
      personality,
      budgetEgp: budgetEgp !== '' ? Number(budgetEgp) : undefined,
      knownVariableCostsEgp:
        knownVariableCostsEgp !== '' ? Number(knownVariableCostsEgp) : undefined,
      knownMonthlyFixedCostsEgp:
        knownMonthlyFixedCostsEgp !== '' ? Number(knownMonthlyFixedCostsEgp) : undefined,
      briefRevision: brief.briefRevision + 1,
      provenance: {
        ...brief.provenance,
        idea: 'user',
        category: 'user',
        city: 'user',
        targetAudience: 'user',
        budgetEgp: 'user',
      },
    };

    onUpdateBrief(updatedBrief, sectionsToUpdate);
    setIsEditing(false);
    setShowDependencyModal(false);
  };

  const affectedList = getAffectedSections();

  return (
    <div className="mb-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm overflow-hidden transition-all text-[#172033] dark:text-slate-100 no-print" dir="rtl">
      {/* Brief Header Bar */}
      <div className="p-4 sm:px-6 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/80">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#172033] dark:text-slate-100">ملخص المشروع (مصدر الحقيقة المعتمد)</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 font-semibold">
                إصدار #{brief.briefRevision}
              </span>
            </div>
            <p className="text-xs text-[#526077] dark:text-slate-400 hidden sm:block">
              الأساس التوجيهي المشترك لكافة مخرجات الهوية والتسعير والتسويق والصور
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-purple-100 text-[#5B21B6] border border-[#DDD6FE] dark:bg-purple-600/20 dark:hover:bg-purple-600/30 dark:text-purple-200 dark:border-purple-500/30 text-xs font-bold transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل الملخص</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-[#526077] hover:text-[#172033] hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? 'طي الملخص' : 'توسيع الملخص'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Brief Body: View or Edit Mode */}
      {isEditing ? (
        <div className="p-5 sm:p-6 space-y-4 animate-in fade-in bg-slate-50/60 dark:bg-slate-900/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#172033] dark:text-slate-300 mb-1">فكرة المشروع</label>
              <textarea
                rows={2}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-100 outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">التصنيف</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">المدينة / المحافظة</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">الحي / المنطقة (اختياري)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="مثال: التجمع الخامس، المعادي..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">نموذج العمل</label>
              <select
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED]"
              >
                <option value="physical">مقر فعلي / متجر</option>
                <option value="online">رقمي أونلاين بالكامل</option>
                <option value="hybrid">هجين (مقر + توصيل أونلاين)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">التموضع السعري</label>
              <select
                value={pricingPosition}
                onChange={(e) => setPricingPosition(e.target.value as PricingPosition)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none focus:border-[#7C3AED]"
              >
                <option value="budget">اقتصادي / أسعار تنافسية (Budget)</option>
                <option value="mid">متوسط متوازن (Mid-market)</option>
                <option value="premium">متميز وقيمة مضافة (Premium)</option>
                <option value="luxury">فاخر وحصري (Luxury)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">الميزانية (ج.م)</label>
              <input
                type="number"
                value={budgetEgp}
                onChange={(e) => setBudgetEgp(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526077] dark:text-slate-400 mb-1">
                التكلفة المتغيرة للوحدة (ج.م)
              </label>
              <input
                type="number"
                value={knownVariableCostsEgp}
                onChange={(e) =>
                  setKnownVariableCostsEgp(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-slate-200 outline-none font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleReviewChanges}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/30"
            >
              <Check className="w-4 h-4" />
              <span>مراجعة وحفظ التعديلات</span>
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="p-4 sm:p-6 space-y-4">
          {/* Main Idea and Provenance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800/80">
            <div className="flex-1">
              <span className="text-[11px] font-bold text-[#526077] dark:text-slate-400 block mb-0.5">فكرة المشروع الأساسية</span>
              <p className="text-xs sm:text-sm text-[#172033] dark:text-slate-200 font-medium leading-relaxed">{brief.idea}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50 self-start sm:self-center shrink-0">
              أدخلتها أنت
            </span>
          </div>

          {/* Key Attributes Grid (Visible or Collapsible) */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${isExpanded ? 'block' : 'hidden sm:grid'}`}>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/60">
              <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">المدينة / السوق</span>
              <p className="text-xs font-bold text-[#172033] dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7C3AED] dark:text-cyan-400 shrink-0" />
                <span className="truncate">{brief.city}{brief.district ? ` (${brief.district})` : ''}</span>
              </p>
              <span className="text-[10px] text-[#64748B]">
                {brief.provenance.city === 'user' ? 'مدخلة من قبلك' : 'افتراض مقترح'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/60">
              <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">نموذج العمل</span>
              <p className="text-xs font-bold text-[#172033] dark:text-slate-200">
                {brief.businessModel === 'online'
                  ? 'أونلاين رقمي'
                  : brief.businessModel === 'physical'
                  ? 'مقر فعلي'
                  : 'هجين (مقر وأونلاين)'}
              </p>
              <span className="text-[10px] text-[#64748B]">
                {brief.provenance.category === 'user' ? 'مدخلة من قبلك' : 'افتراض مقترح'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/60">
              <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">التموضع والشخصية</span>
              <p className="text-xs font-bold text-[#172033] dark:text-slate-200 truncate">
                {brief.personality} • {brief.pricingPosition}
              </p>
              <span className="text-[10px] text-[#64748B]">سياق تنافسي</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800/60">
              <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">الميزانية التقديرية</span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatEgp(brief.budgetEgp)}
              </p>
              <span className="text-[10px] text-[#64748B]">
                {brief.provenance.budgetEgp === 'user' ? 'ميزانيتك المحددة' : 'تقدير استرشادي'}
              </span>
            </div>
          </div>

          {/* Assumptions Preview */}
          {isExpanded && brief.assumptions && brief.assumptions.length > 0 && (
            <div className="p-3 rounded-xl bg-[#EDE9FE]/50 border border-[#DDD6FE] text-xs text-[#5B21B6] dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-200">
              <span className="font-bold block mb-1 text-[#5B21B6] dark:text-purple-300">افتراضات العمل بالسوق المصري:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#5B21B6]/80 dark:text-purple-300/80">
                {brief.assumptions.map((ass, idx) => (
                  <li key={idx}>{ass}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Dependency Modal / Affected Sections Confirmation */}
      {showDependencyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#151D32] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-[#172033] dark:text-slate-100">
            <div className="flex items-center gap-2.5 text-[#7C3AED]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#172033] dark:text-white">الأقسام المرتبطة بالتعديل</h3>
            </div>

            <p className="text-xs text-[#526077] dark:text-slate-300 leading-relaxed">
              وفقاً للتغييرات الجديدة في ملخص المشروع، تم تحديد الأقسام التي قد تحتاج إلى تحديث متزامن. اختر الأقسام التي ترغب في تحديثها الآن (مع الحفاظ على العناصر المثبتة والأسماء المفضلة):
            </p>

            <div className="space-y-2.5">
              {affectedList.map((aff) => (
                <label
                  key={aff.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-[#E2E8F0] dark:border-slate-800 cursor-pointer hover:border-[#7C3AED] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedAffectedSections[aff.id]}
                    onChange={(e) =>
                      setSelectedAffectedSections({
                        ...selectedAffectedSections,
                        [aff.id]: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 rounded text-[#7C3AED] focus:ring-purple-500 bg-white border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#172033] dark:text-slate-200 block">{aff.name}</span>
                    <span className="text-[11px] text-[#526077] dark:text-slate-400 leading-relaxed">{aff.reason}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                onClick={() => setShowDependencyModal(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] text-[#172033] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white text-xs font-semibold transition-colors"
              >
                إلغاء التعديل
              </button>
              <button
                disabled={isUpdatingDependencies}
                onClick={() => {
                  const toUpdate = Object.keys(selectedAffectedSections).filter(
                    (k) => selectedAffectedSections[k]
                  );
                  saveBriefChanges(toUpdate);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                {isUpdatingDependencies ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ التحديث...</span>
                  </>
                ) : (
                  <span>تحديث الأقسام المحددة وحفظ</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
