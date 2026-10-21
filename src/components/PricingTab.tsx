import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  Boxes,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  Plus,
  Edit2,
  Check,
  Trash2,
  Search,
  X,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Printer,
  Copy,
  Clock,
  Target,
  Percent,
  Stethoscope,
  Utensils,
  Package,
  Activity,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  BrandPricing,
  BrandBrief,
  StartupEquipmentItem,
  CapitalFeasibility,
  FinancialProjections,
  UnitEconomicsBenchmark,
} from '../types/brand';
import { buildCapitalFeasibility, analyzeIdea } from '../utils/domainBrandGenerator';

interface PricingTabProps {
  pricing: BrandPricing;
  brief: BrandBrief;
  onUpdatePricing: (newPricing: BrandPricing, description: string) => void;
  onUpdateBrief?: (newBrief: BrandBrief) => void;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
  onOpenArithmeticPreview: (data: {
    title: string;
    beforeSummary: string;
    afterSummary: string;
    onApply: () => void;
  }) => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({
  pricing,
  brief,
  onUpdatePricing,
  onUpdateBrief,
  onNotify,
  onOpenArithmeticPreview,
}) => {
  // Format currency helper (using English digits 0-9)
  const formatEgp = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return '0 ج.م';
    return `${Math.round(val).toLocaleString('en-US')} ج.م`;
  };

  // Toggle for alternative model (e.g. Day-Care Surgery Center vs Full Hospital)
  const [viewAlternativeModel, setViewAlternativeModel] = useState(false);

  // Growth scenario for profit projections
  const [profitScenario, setProfitScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');

  // Active Capital Feasibility and Startup Equipment Breakdown
  const userBudgetProp = brief.budgetEgp || brief.budget || 50000;
  const activeFeasibility = useMemo<CapitalFeasibility>(() => {
    let base = pricing.capitalFeasibility;
    if (!base || !base.startupBreakdown || base.startupBreakdown.length === 0) {
      base = buildCapitalFeasibility(
        userBudgetProp,
        brief.idea || '',
        brief.city || 'القاهرة',
        brief.district || '',
        analyzeIdea(brief.idea || '')
      );
    }

    const items = base.startupBreakdown || [];
    const itemsSum = items.reduce((sum, it) => sum + (it.estimatedCostEgp || 0), 0);
    const userBudgetNum = Number(userBudgetProp) || base.userBudgetEgp || 50000;
    const minBudgetNum = base.minEstimatedBudgetEgp || 100000;
    const recBudgetNum = base.recommendedBudgetEgp || Math.round(minBudgetNum * 1.6);

    let altBreakdown = base.alternativeBreakdown;
    let altCapex = base.alternativeCapexTotalEgp;
    let altTitle = base.alternativeModelTitle;

    // Detect if items were artificially downscaled compared to a high minimum
    let correctedItems = [...items];
    let correctedCapex = itemsSum;

    if (minBudgetNum >= 1000000 && itemsSum > 0 && itemsSum < minBudgetNum * 0.65) {
      if (!altBreakdown || altBreakdown.length === 0) {
        altBreakdown = [...items];
        altCapex = itemsSum;
        altTitle = base.recommendedModel || 'النموذج البديل المصغر المناسب لميزانيتك';
      }
      const scaleFactor = minBudgetNum / itemsSum;
      correctedItems = items.map((it) => ({
        ...it,
        estimatedCostEgp: Math.round((it.estimatedCostEgp * scaleFactor) / 10000) * 10000,
      }));
      correctedCapex = correctedItems.reduce((sum, it) => sum + it.estimatedCostEgp, 0);
    }

    const requiredBaseline = Math.max(correctedCapex, minBudgetNum);
    let status = base.status;
    let gap = base.gapOrSurplusEgp;

    if (userBudgetNum < requiredBaseline * 0.85) {
      status = userBudgetNum < requiredBaseline * 0.45 ? 'insufficient' : 'lean_viable';
      gap = userBudgetNum - requiredBaseline; // strictly negative
    } else {
      status = 'sufficient';
      gap = userBudgetNum - correctedCapex;
    }

    if (status === 'insufficient' && gap >= 0) {
      gap = userBudgetNum - requiredBaseline;
      if (gap >= 0) {
        gap = -Math.abs(minBudgetNum - userBudgetNum || 500000);
      }
    }

    // Ensure projections & unit economics are present
    let projections = base.projections;
    let unitEconomics = base.unitEconomics;


    return {
      ...base,
      userBudgetEgp: userBudgetNum,
      minEstimatedBudgetEgp: minBudgetNum,
      recommendedBudgetEgp: recBudgetNum,
      startupBreakdown: correctedItems,
      capexTotalEgp: correctedCapex,
      gapOrSurplusEgp: gap,
      status,
      alternativeBreakdown: altBreakdown,
      alternativeCapexTotalEgp: altCapex,
      alternativeModelTitle: altTitle,
      projections,
      unitEconomics,
    };
  }, [pricing.capitalFeasibility, userBudgetProp, brief.idea, brief.city, brief.district]);

  // Active startup list based on alternative model toggle
  const currentStartupList = useMemo(() => {
    if (viewAlternativeModel && activeFeasibility.alternativeBreakdown && activeFeasibility.alternativeBreakdown.length > 0) {
      return activeFeasibility.alternativeBreakdown;
    }
    return activeFeasibility.startupBreakdown;
  }, [viewAlternativeModel, activeFeasibility]);

  // Current capex total reflecting current list
  const currentCapexTotal = useMemo(() => {
    return currentStartupList.reduce((sum, it) => sum + (it.estimatedCostEgp || 0), 0);
  }, [currentStartupList]);

  // CapEx Breakdown by Category
  const capexBreakdownByCategory = useMemo(() => {
    const list = currentStartupList;
    const total = currentCapexTotal || 1;

    let machinery = 0;
    let fitout = 0;
    let legal = 0;
    let working = 0;

    list.forEach((item) => {
      const cost = item.estimatedCostEgp || 0;
      if (item.category === 'معدات وآلات') machinery += cost;
      else if (item.category === 'تجهيزات وتشطيب') fitout += cost;
      else if (item.category === 'تراخيص وتأسيس') legal += cost;
      else working += cost;
    });

    return {
      machinery,
      fitout,
      legal,
      working,
      machineryPct: Math.round((machinery / total) * 100),
      fitoutPct: Math.round((fitout / total) * 100),
      legalPct: Math.round((legal / total) * 100),
      workingPct: Math.max(0, 100 - (Math.round((machinery / total) * 100) + Math.round((fitout / total) * 100) + Math.round((legal / total) * 100))),
    };
  }, [currentStartupList, currentCapexTotal]);

  // Equipment Table UI State
  const [selectedEqCategory, setSelectedEqCategory] = useState<string>('all');
  const [eqSearchQuery, setEqSearchQuery] = useState('');
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [eqCostInput, setEqCostInput] = useState<number | string>('');

  // Add Equipment Modal
  const [isAddEqModalOpen, setIsAddEqModalOpen] = useState(false);
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState<string>('معدات وآلات');
  const [newEqPriority, setNewEqPriority] = useState<'ضروري للبدء' | 'مرحلة ثانية' | 'اختياري للتوسع'>('ضروري للبدء');
  const [newEqCost, setNewEqCost] = useState<number | string>('');
  const [newEqNotes, setNewEqNotes] = useState('');

  // Interactive Capital Re-Evaluator Slider State
  const [simulatedBudget, setSimulatedBudget] = useState<number>(activeFeasibility.userBudgetEgp);

  useEffect(() => {
    setSimulatedBudget(activeFeasibility.userBudgetEgp);
  }, [activeFeasibility.userBudgetEgp]);

  const simulatedFeasibility = useMemo(() => {
    return buildCapitalFeasibility(
      simulatedBudget,
      brief.idea || '',
      brief.city || 'القاهرة',
      brief.district || '',
      analyzeIdea(brief.idea || '')
    );
  }, [simulatedBudget, brief.idea, brief.city, brief.district]);

  // Project Nature Detection: Medical, Complex Services vs Tangible Items
  const cleanIdea = (brief.idea || '').toLowerCase();
  const isMedicalOrClinic =
    cleanIdea.includes('مستشفى') ||
    cleanIdea.includes('مستشفي') ||
    cleanIdea.includes('عيادة') ||
    cleanIdea.includes('أشعة') ||
    cleanIdea.includes('اشعة') ||
    cleanIdea.includes('تحاليل') ||
    cleanIdea.includes('معمل') ||
    cleanIdea.includes('طبي') ||
    cleanIdea.includes('أسنان') ||
    cleanIdea.includes('اسنان') ||
    cleanIdea.includes('جراحة') ||
    cleanIdea.includes('عمليات') ||
    cleanIdea.includes('مركز طبي') ||
    cleanIdea.includes('مجمع عيادات') ||
    cleanIdea.includes('طوارئ') ||
    cleanIdea.includes('صيدلية') ||
    cleanIdea.includes('علاج طبيعي');

  const isComplexServices =
    isMedicalOrClinic ||
    cleanIdea.includes('برمجيات معقدة') ||
    cleanIdea.includes('استشارات هندسية') ||
    cleanIdea.includes('محاماة') ||
    cleanIdea.includes('استشارات');

  const isFoodOrTangible =
    !isMedicalOrClinic &&
    (cleanIdea.includes('مطعم') ||
      cleanIdea.includes('بيتزا') ||
      cleanIdea.includes('كشري') ||
      cleanIdea.includes('كافيه') ||
      cleanIdea.includes('مقهى') ||
      cleanIdea.includes('برجر') ||
      cleanIdea.includes('شاورما') ||
      cleanIdea.includes('مسمط') ||
      cleanIdea.includes('حلويات') ||
      cleanIdea.includes('مخبز') ||
      cleanIdea.includes('متجر') ||
      cleanIdea.includes('تجارة'));

  const unitLabel = isMedicalOrClinic
    ? 'سعر الكشف / الفحص / الخدمة'
    : isFoodOrTangible
    ? 'سعر الطلب / الفاتورة'
    : 'سعر الوحدة / الخدمة للمشروع';

  const orderVolumeLabel = isMedicalOrClinic
    ? 'عدد المرضى / الفحوصات اليومية'
    : isFoodOrTangible
    ? 'عدد الطلبات اليومية'
    : 'عدد الوحدات / الخدمات اليومية';

  // Dynamic Unit Economics benchmarks
  const defaultAvgTicket = activeFeasibility.unitEconomics?.averageTicketEgp || (isFoodOrTangible ? 150 : 250);
  const defaultDailyOrders = activeFeasibility.unitEconomics?.targetDailyOrders || 80;
  const [customAvgTicket, setCustomAvgTicket] = useState<number>(defaultAvgTicket);
  const [customDailyOrders, setCustomDailyOrders] = useState<number>(defaultDailyOrders);

  // Sync if brief changes
  useEffect(() => {
    if (activeFeasibility.unitEconomics?.averageTicketEgp) {
      setCustomAvgTicket(activeFeasibility.unitEconomics.averageTicketEgp);
    }
    if (activeFeasibility.unitEconomics?.targetDailyOrders) {
      setCustomDailyOrders(activeFeasibility.unitEconomics.targetDailyOrders);
    }
  }, [activeFeasibility.unitEconomics]);

  // Scenario Multiplier
  const scenarioMultiplier = profitScenario === 'conservative' ? 0.8 : profitScenario === 'optimistic' ? 1.25 : 1.0;

  // Scaled Financial Projections
  const proj = activeFeasibility.projections || {
    initialPhaseMonths: 'أول 3 - 6 أشهر',
    initialMonthlyRevenueEgp: Math.round(activeFeasibility.capexTotalEgp * 0.16),
    initialMonthlyCostsEgp: Math.round(activeFeasibility.capexTotalEgp * 0.12),
    initialMonthlyProfitEgp: Math.round(activeFeasibility.capexTotalEgp * 0.04),
    breakEvenMonth: 4,
    yearOneRevenueEgp: Math.round(activeFeasibility.capexTotalEgp * 2.1),
    yearOneNetProfitEgp: Math.round(activeFeasibility.capexTotalEgp * 0.48),
    yearOneMarginPct: 23,
    yearOneRecoveryPct: 48,
    fiveYearCumulativeProfitEgp: Math.round(activeFeasibility.capexTotalEgp * 2.6),
    paybackPeriodMonths: 24,
    estimatedRoiPct: 160,
    fiveYearAnnualizedReturn: '32% سنوياً',
  };

  const scaledMonthlyRev = Math.round(proj.initialMonthlyRevenueEgp * scenarioMultiplier);
  const scaledMonthlyCost = Math.round(proj.initialMonthlyCostsEgp * (profitScenario === 'conservative' ? 0.9 : profitScenario === 'optimistic' ? 1.1 : 1.0));
  const scaledMonthlyProfit = scaledMonthlyRev - scaledMonthlyCost;

  const scaledYearOneRev = Math.round(proj.yearOneRevenueEgp * scenarioMultiplier);
  const scaledYearOneNet = Math.round(proj.yearOneNetProfitEgp * scenarioMultiplier);
  const scaledYearOneMargin = Math.round((scaledYearOneNet / (scaledYearOneRev || 1)) * 100);

  const scaledFiveYearNet = Math.round(proj.fiveYearCumulativeProfitEgp * scenarioMultiplier);
  const baseInvestment = Math.max(activeFeasibility.capexTotalEgp, activeFeasibility.minEstimatedBudgetEgp);
  const scaledRoiPct = Math.round((scaledFiveYearNet / (baseInvestment || 1)) * 100);

  // Tangible Dynamic calculation
  const calculatedDailyTangibleRev = customAvgTicket * customDailyOrders;
  const calculatedMonthlyTangibleRev = calculatedDailyTangibleRev * 28;
  const calculatedMonthlyTangibleCogs = Math.round(calculatedMonthlyTangibleRev * 0.35);
  const calculatedMonthlyTangibleGross = calculatedMonthlyTangibleRev - calculatedMonthlyTangibleCogs;

  // Filtered Equipment List
  const filteredEquipment = useMemo(() => {
    return currentStartupList.filter((item) => {
      const matchesCategory =
        selectedEqCategory === 'all' || item.category === selectedEqCategory;
      const matchesQuery =
        !eqSearchQuery.trim() ||
        item.name.toLowerCase().includes(eqSearchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(eqSearchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(eqSearchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [currentStartupList, selectedEqCategory, eqSearchQuery]);

  // Handlers for Equipment List Modification
  const handleSaveEquipmentCost = (id: string) => {
    const cost = Number(eqCostInput);
    if (isNaN(cost) || cost < 0) {
      onNotify('يرجى إدخال تكلفة تقديرية صحيحة بالجنيه المصري', 'error');
      return;
    }

    const updatedBreakdown = activeFeasibility.startupBreakdown.map((it) =>
      it.id === id ? { ...it, estimatedCostEgp: cost } : it
    );
    const newTotal = updatedBreakdown.reduce((sum, it) => sum + it.estimatedCostEgp, 0);

    let newStatus = activeFeasibility.status;
    let newGap = activeFeasibility.userBudgetEgp - newTotal;
    const reqMin = Math.max(newTotal, activeFeasibility.minEstimatedBudgetEgp);

    if (activeFeasibility.userBudgetEgp < reqMin * 0.85) {
      newStatus = activeFeasibility.userBudgetEgp < reqMin * 0.45 ? 'insufficient' : 'lean_viable';
      newGap = activeFeasibility.userBudgetEgp - reqMin;
    } else {
      newStatus = 'sufficient';
    }

    const updatedFeasibility: CapitalFeasibility = {
      ...activeFeasibility,
      startupBreakdown: updatedBreakdown,
      capexTotalEgp: newTotal,
      gapOrSurplusEgp: newGap,
      status: newStatus,
    };

    const newPricing: BrandPricing = {
      ...pricing,
      capitalFeasibility: updatedFeasibility,
    };

    onUpdatePricing(newPricing, `تحديث تكلفة بند في دراسة الجدوى إلى ${formatEgp(cost)}`);
    setEditingEquipmentId(null);
    onNotify('✓ تم تحديث تكلفة البند وإعادة احتساب الجدوى والميزانية فوراً', 'success');
  };

  const handleDeleteEquipmentItem = (id: string) => {
    const updatedBreakdown = activeFeasibility.startupBreakdown.filter((it) => it.id !== id);
    const newTotal = updatedBreakdown.reduce((sum, it) => sum + it.estimatedCostEgp, 0);

    const updatedFeasibility: CapitalFeasibility = {
      ...activeFeasibility,
      startupBreakdown: updatedBreakdown,
      capexTotalEgp: newTotal,
      gapOrSurplusEgp: activeFeasibility.userBudgetEgp - newTotal,
    };

    const newPricing: BrandPricing = {
      ...pricing,
      capitalFeasibility: updatedFeasibility,
    };

    onUpdatePricing(newPricing, 'حذف بند من قائمة مصروفات التأسيس');
    onNotify('تم حذف البند وتحديث إجمالي التأسيس', 'info');
  };

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim()) {
      onNotify('يرجى كتابة اسم البند أو المعدة', 'error');
      return;
    }
    const cost = Number(newEqCost);
    if (isNaN(cost) || cost <= 0) {
      onNotify('يرجى تحديد تكلفة صالحة بالجنيه المصري', 'error');
      return;
    }

    const newItem: StartupEquipmentItem = {
      id: `eq-${Date.now()}`,
      name: newEqName.trim(),
      category: newEqCategory,
      priority: newEqPriority,
      estimatedCostEgp: cost,
      notes: newEqNotes.trim() || undefined,
    };

    const updatedBreakdown = [newItem, ...activeFeasibility.startupBreakdown];
    const newTotal = updatedBreakdown.reduce((sum, it) => sum + it.estimatedCostEgp, 0);

    const updatedFeasibility: CapitalFeasibility = {
      ...activeFeasibility,
      startupBreakdown: updatedBreakdown,
      capexTotalEgp: newTotal,
      gapOrSurplusEgp: activeFeasibility.userBudgetEgp - newTotal,
    };

    const newPricing: BrandPricing = {
      ...pricing,
      capitalFeasibility: updatedFeasibility,
    };

    onUpdatePricing(newPricing, `إضافة معدة/بند جديد: ${newItem.name}`);
    setIsAddEqModalOpen(false);
    setNewEqName('');
    setNewEqCost('');
    setNewEqNotes('');
    onNotify('✓ تمت إضافة بند التأسيس بنجاح إلى دراسة الجدوى', 'success');
  };

  const handleApplySimulatedBudget = () => {
    onOpenArithmeticPreview({
      title: 'تثبيت رأس المال الجديد وإعادة احتساب دراسة الجدوى',
      beforeSummary: `رأس المال الحالي: ${formatEgp(activeFeasibility.userBudgetEgp)} (${
        activeFeasibility.status === 'sufficient'
          ? 'كافٍ'
          : activeFeasibility.status === 'lean_viable'
          ? 'على الحافة'
          : 'عجز مالي'
      })`,
      afterSummary: `رأس المال الجديد: ${formatEgp(simulatedBudget)} (${
        simulatedFeasibility.status === 'sufficient'
          ? 'كافٍ ومناسب للبدء الكامل'
          : simulatedFeasibility.status === 'lean_viable'
          ? 'كافٍ لنموذج مصغر Lean MVP'
          : 'غير كافٍ لتنفيذ المشروع بالحجم المطلوب'
      })`,
      onApply: () => {
        const updatedFeasibility = { ...simulatedFeasibility };
        const newPricing: BrandPricing = {
          ...pricing,
          capitalFeasibility: updatedFeasibility,
        };
        onUpdatePricing(newPricing, `تحديث رأس المال في دراسة الجدوى إلى ${formatEgp(simulatedBudget)}`);
        if (onUpdateBrief) {
          onUpdateBrief({
            ...brief,
            budgetEgp: simulatedBudget,
            budget: simulatedBudget,
          });
        }
        onNotify(`✓ تم تثبيت الميزانية ${formatEgp(simulatedBudget)} وتحديث دراسة الجدوى بالكامل`, 'success');
      },
    });
  };

  const handleCopyFeasibilityReport = () => {
    const reportText = `📊 دراسة جدوى استثمارية تقديرية - ${brief.idea}
📍 النطاق والموقع: ${brief.city || 'القاهرة'}${brief.district ? ` (حي ${brief.district})` : ''}
═════════════════════════════════════════
💰 رأس المال المرصود: ${formatEgp(activeFeasibility.userBudgetEgp)}
🏗️ تكلفة شراء المعدات والتأسيس (CapEx): ${formatEgp(activeFeasibility.capexTotalEgp)}
🏢 الحد الأدنى الواقعي بالسوق المصري: ${formatEgp(activeFeasibility.minEstimatedBudgetEgp)}
⭐ رأس المال الموصى به للانطلاق: ${formatEgp(activeFeasibility.recommendedBudgetEgp)}
⚖️ الفارق المالي: ${activeFeasibility.gapOrSurplusEgp >= 0 ? `فائض سيولة أمان (+${formatEgp(activeFeasibility.gapOrSurplusEgp)})` : `عجز مالي مطلوب تغطيته (-${formatEgp(Math.abs(activeFeasibility.gapOrSurplusEgp))})`}
📌 قرار الجدوى: ${activeFeasibility.verdictTitle}

📈 التوقعات المالية وإجمالي الأرباح المتوقعة:
1. أول 3 - 6 أشهر:
   - الإيراد الشهري المبدئي: ${formatEgp(scaledMonthlyRev)}
   - التكاليف التشغيلية الشهرية: ${formatEgp(scaledMonthlyCost)}
   - صافي الربح الشهري: ${formatEgp(scaledMonthlyProfit)}
   - الوصول لنقطة التعادل المتوقع: الشهر ${proj.breakEvenMonth}

2. خلال السنة الأولى (العام الأول):
   - إجمالي إيرادات السنة الأولى: ${formatEgp(scaledYearOneRev)}
   - صافي الربح السنوي المتوقع: ${formatEgp(scaledYearOneNet)}
   - هامش صافي الربح: ${scaledYearOneMargin}%
   - نسبة استرداد رأس المال: ${proj.yearOneRecoveryPct}%

3. خلال 5 سنوات:
   - إجمالي الأرباح التراكمية الصافية: ${formatEgp(scaledFiveYearNet)}
   - فترة استرداد رأس المال بالكامل: ${proj.paybackPeriodMonths} شهراً
   - العائد على الاستثمار التراكمي (ROI): ${scaledRoiPct}%

🛠️ أهم بنود التأسيس والمعدات:
${activeFeasibility.startupBreakdown
  .slice(0, 8)
  .map((it, i) => `${i + 1}. ${it.name} (${it.category}) - ${formatEgp(it.estimatedCostEgp)}`)
  .join('\n')}

💡 نصائح وتوصيات السوق المصري:
${activeFeasibility.advice.map((adv, i) => `${i + 1}. ${adv}`).join('\n')}
`;

    navigator.clipboard.writeText(reportText);
    onNotify('✓ تم نسخ تقرير دراسة الجدوى بالكامل للحافظة بنجاح', 'success');
  };

  const handlePrintFeasibility = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#172033] dark:text-slate-100" dir="rtl">
      {/* 1. Header: Unified Feasibility Study Dashboard */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-full overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-[#7C3AED] dark:text-purple-300">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-[#172033] dark:text-slate-100">
                  دراسة جدوى المشروع الاستثمارية (EGP)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-[#7C3AED] dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  دراسة متكاملة
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-400 mt-1 leading-relaxed">
            تحليل مالي استثماري شامل لرأس المال المطلوب، تكاليف شراء وتجهيز المعدات، مؤشرات العجز والفائض المالي، وتوقعات الأرباح المجمعة على مدار الأشهر الأولى والسنة الأولى و5 سنوات في السوق المصري.
          </p>
        </div>

        {/* Global Feasibility Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0 no-print">
          <button
            onClick={handleCopyFeasibilityReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#172033] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="نسخ تقرير دراسة الجدوى للحافظة"
          >
            <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>نسخ ملخص الجدوى</span>
          </button>

          <button
            onClick={handlePrintFeasibility}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#172033] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="طباعة أو تصدير دراسة الجدوى كملف PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span>طباعة / PDF</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('capital-reevaluator');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm shadow-purple-600/20 active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>فحص وتعديل الميزانية</span>
          </button>
        </div>
      </div>

      {/* 2. Reality Check Verdict Banner */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden shadow-sm ${
          activeFeasibility.status === 'sufficient'
            ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border-emerald-300 dark:from-emerald-950/30 dark:via-[#131B2E] dark:to-emerald-950/20 dark:border-emerald-800'
            : activeFeasibility.status === 'lean_viable'
            ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-300 dark:from-amber-950/30 dark:via-[#131B2E] dark:to-amber-950/20 dark:border-amber-800'
            : 'bg-gradient-to-br from-rose-50 via-white to-rose-50/30 border-rose-300 dark:from-rose-950/40 dark:via-[#131B2E] dark:to-rose-950/20 dark:border-rose-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                  activeFeasibility.status === 'sufficient'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : activeFeasibility.status === 'lean_viable'
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                    : 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                }`}
              >
                {activeFeasibility.status === 'sufficient' ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : activeFeasibility.status === 'lean_viable' ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>
                  {activeFeasibility.status === 'sufficient'
                    ? 'رأس المال مناسب وكافٍ للبدء الكامل'
                    : activeFeasibility.status === 'lean_viable'
                    ? 'رأس المال على الحافة (كافٍ لنموذج مصغر Lean MVP)'
                    : 'عجز مالي حرج - غير كافٍ لتنفيذ هذا الحجم بالكامل'}
                </span>
              </span>

              <span className="text-xs text-[#526077] dark:text-slate-400 font-semibold">
                الموقع المستهدف: <strong>{brief.city || 'القاهرة'}{brief.district ? ` (حي ${brief.district})` : ''}</strong>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-[#172033] dark:text-white leading-snug">
              {activeFeasibility.verdictTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-300 leading-relaxed">
              {activeFeasibility.verdictDescription}
            </p>

            {/* Alternative Model Switcher if there is deficit */}
            {activeFeasibility.recommendedModel && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#7C3AED] dark:text-purple-300 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    النموذج المقترح لتفادي المخاطر والبدء بالميزانية:
                  </span>
                  <span className="font-semibold text-[#172033] dark:text-slate-200">
                    {activeFeasibility.recommendedModel}
                  </span>
                </div>

                {activeFeasibility.alternativeBreakdown && activeFeasibility.alternativeBreakdown.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setViewAlternativeModel(!viewAlternativeModel)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm border shrink-0 ${
                      viewAlternativeModel
                        ? 'bg-[#7C3AED] text-white border-purple-500 shadow-purple-600/30'
                        : 'bg-white dark:bg-slate-800 text-[#7C3AED] dark:text-purple-300 border-purple-300 dark:border-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      {viewAlternativeModel
                        ? `العودة لدراسة المشروع الكامل (${formatEgp(activeFeasibility.minEstimatedBudgetEgp)})`
                        : `عرض دراسة وتكلفة النموذج البديل المقترح (${formatEgp(activeFeasibility.alternativeCapexTotalEgp || 1900000)})`}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. The 4 Key Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. User Budget */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#526077] dark:text-slate-400 font-semibold">
                رأس المال المرصود
              </span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white font-mono">
              {formatEgp(activeFeasibility.userBudgetEgp)}
            </div>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-2 block">
            المبلغ المحدد في ملخص الفكرة
          </span>
        </div>

        {/* 2. Startup CapEx Total */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#526077] dark:text-slate-400 font-semibold">
                {viewAlternativeModel ? 'تكلفة معدات النموذج البديل' : 'إجمالي تكلفة المعدات والتأسيس'}
              </span>
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {formatEgp(
                viewAlternativeModel
                  ? (activeFeasibility.alternativeCapexTotalEgp || 1900000)
                  : activeFeasibility.capexTotalEgp
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-2 block">
            {viewAlternativeModel
              ? `مجموع ${currentStartupList.length} بنود للنموذج المصغر المقترح`
              : `مجموع ${activeFeasibility.startupBreakdown.length} بنود لتجهيز المشروع الكامل`}
          </span>
        </div>

        {/* 3. Market Minimum Budget */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#526077] dark:text-slate-400 font-semibold">
                {viewAlternativeModel ? 'الحد الأدنى للنموذج البديل' : 'الحد الأدنى الواقعي بالسوق المصري'}
              </span>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#526077] dark:text-slate-300">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white font-mono">
              {formatEgp(
                viewAlternativeModel
                  ? (activeFeasibility.alternativeCapexTotalEgp || 1900000)
                  : activeFeasibility.minEstimatedBudgetEgp
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-slate-400 mt-2 block">
            {viewAlternativeModel
              ? 'نموذج مصغر لتفادي مخاطر السيولة'
              : `الموصى به للانطلاق: ${formatEgp(activeFeasibility.recommendedBudgetEgp)}`}
          </span>
        </div>

        {/* 4. Financial Surplus or Deficit */}
        {(() => {
          const isDeficit =
            !viewAlternativeModel &&
            (activeFeasibility.status === 'insufficient' ||
              activeFeasibility.gapOrSurplusEgp < 0 ||
              activeFeasibility.userBudgetEgp < activeFeasibility.minEstimatedBudgetEgp * 0.85);

          const gapAmount = viewAlternativeModel
            ? activeFeasibility.userBudgetEgp - (activeFeasibility.alternativeCapexTotalEgp || 1900000)
            : (isDeficit
                ? (activeFeasibility.gapOrSurplusEgp < 0
                    ? activeFeasibility.gapOrSurplusEgp
                    : activeFeasibility.userBudgetEgp - Math.max(activeFeasibility.capexTotalEgp, activeFeasibility.minEstimatedBudgetEgp))
                : activeFeasibility.gapOrSurplusEgp);

          const isPositive = gapAmount >= 0 && !isDeficit;

          return (
            <div
              className={`p-4 sm:p-5 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${
                isPositive
                  ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                  : 'bg-rose-50/60 border-rose-300 dark:bg-rose-950/20 dark:border-rose-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#172033] dark:text-slate-200">
                    الفارق المالي ({isPositive ? 'فائض سيولة' : 'عجز مالي'})
                  </span>
                  <div
                    className={`p-2 rounded-xl ${
                      isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono ${
                    isPositive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isPositive
                    ? `+${formatEgp(gapAmount)}`
                    : `-${formatEgp(Math.abs(gapAmount))}`}
                </div>
              </div>
              <span className="text-[11px] font-bold mt-2 block opacity-90">
                {isPositive
                  ? 'فائض سيولة أمان يدعم الاستقرار الأولي'
                  : 'عجز مالي يتطلب زيادة التمويل أو البدء بالنموذج المصغر'}
              </span>
            </div>
          );
        })()}
      </div>

      {/* 4. NEW & EXPANDED: COMPREHENSIVE PROFIT PROJECTIONS TIMELINE (الأرباح المتوقعة في أول شهور، أول سنة، 5 سنوات) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-purple-200/80 dark:border-purple-900/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-[#7C3AED] dark:text-purple-300">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-base sm:text-lg text-[#172033] dark:text-white">
                  التوقعات المالية وإجمالي الأرباح المتوقعة للمشروع
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  دراسة تقديرية متدرجة
                </span>
              </div>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
                توزيع الأرباح الصافية المتوقعة ومؤشرات العائد على الاستثمار عبر 3 محطات زمنية رئيسية
              </p>
            </div>
          </div>

          {/* Scenario Selector: Conservative, Realistic, Optimistic */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-800 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setProfitScenario('conservative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profitScenario === 'conservative'
                  ? 'bg-white dark:bg-slate-800 text-[#172033] dark:text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              تحفظي (80%)
            </button>
            <button
              onClick={() => setProfitScenario('realistic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profitScenario === 'realistic'
                  ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-600/30'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              واقعي (100%)
            </button>
            <button
              onClick={() => setProfitScenario('optimistic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profitScenario === 'optimistic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              متفائل (125%)
            </button>
          </div>
        </div>

        {/* 3 Milestone Timeframe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Milestone 1: أول 3 - 6 أشهر */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-[#7C3AED] dark:bg-purple-950 dark:text-purple-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>المرحلة 1: أول 3 إلى 6 أشهر</span>
                </span>
                <span className="text-[11px] font-bold text-[#64748B]">
                  مرحلة الانطلاق
                </span>
              </div>

              <h5 className="font-bold text-sm text-[#172033] dark:text-white">
                بداية التشغيل والوصول لنقطة التعادل
              </h5>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-1">
                تثبيت التدفقات النقدية الأولى وتغطية التكاليف التشغيلية الثابتة.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">الإيراد الشهري المبدئي:</span>
                  <span className="font-mono font-bold text-[#172033] dark:text-white">{formatEgp(scaledMonthlyRev)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">المصاريف التشغيلية الشهرية:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{formatEgp(scaledMonthlyCost)}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-[#172033] dark:text-slate-200">صافي الربح الشهري المتوقع:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    +{formatEgp(scaledMonthlyProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700/80 text-[11px] flex items-center justify-between">
              <span className="text-[#526077] dark:text-slate-400 font-semibold">شهر نقطة التعادل المتوقع:</span>
              <span className="font-black text-[#7C3AED] dark:text-purple-300">
                الشهر {proj.breakEvenMonth} من التشغيل
              </span>
            </div>
          </div>

          {/* Milestone 2: خلال السنة الأولى */}
          <div className="p-5 sm:p-6 rounded-3xl bg-purple-50/40 dark:bg-indigo-950/20 border-2 border-[#7C3AED]/30 dark:border-indigo-800/60 flex flex-col justify-between space-y-4 relative shadow-sm">
            <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#7C3AED] text-white">
              محور التقييم
            </span>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>المرحلة 2: خلال السنة الأولى</span>
                </span>
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                  12 شهراً
                </span>
              </div>

              <h5 className="font-bold text-sm text-[#172033] dark:text-white">
                إجمالي إيرادات وأرباح العام الأول
              </h5>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-1">
                استقرار العملاء، اكتمال الطاقة التشغيلية، وبداية استرداد رأس المال.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-purple-200/60 dark:border-indigo-900/60 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">إجمالي الإيرادات السنوية:</span>
                  <span className="font-mono font-bold text-[#172033] dark:text-white">{formatEgp(scaledYearOneRev)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">هامش صافي الربح السنوي:</span>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">{scaledYearOneMargin}%</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-purple-200 dark:border-purple-900">
                  <span className="font-bold text-[#172033] dark:text-slate-200">صافي أرباح السنة الأولى:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    +{formatEgp(scaledYearOneNet)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-purple-200 dark:border-indigo-900 text-[11px] flex items-center justify-between">
              <span className="text-[#526077] dark:text-slate-400 font-semibold">نسبة استرداد رأس المال:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {proj.yearOneRecoveryPct}% في العام الأول
              </span>
            </div>
          </div>

          {/* Milestone 3: خلال 5 سنوات */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Target className="w-3.5 h-3.5" />
                  <span>المرحلة 3: خلال 5 سنوات</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  المدى التوسعي
                </span>
              </div>

              <h5 className="font-bold text-sm text-[#172033] dark:text-white">
                الأرباح التراكمية والعائد الاستثماري
              </h5>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-1">
                توسعة المشروع، زيادة الحصة السوقية، وتحقيق أعلى عوائد تراكمية.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">إجمالي الأرباح الصافية (5 سنوات):</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    +{formatEgp(scaledFiveYearNet)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">فترة استرداد رأس المال بالكامل:</span>
                  <span className="font-mono text-[#172033] dark:text-white font-bold">{proj.paybackPeriodMonths} شهراً ({Math.round(proj.paybackPeriodMonths / 12 * 10) / 10} سنة)</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-[#172033] dark:text-slate-200">العائد الاستثماري التراكمي (ROI):</span>
                  <span className="font-mono font-black text-purple-700 dark:text-purple-300">
                    +{scaledRoiPct}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700/80 text-[11px] flex items-center justify-between">
              <span className="text-[#526077] dark:text-slate-400 font-semibold">متوسط العائد السنوي:</span>
              <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {proj.fiveYearAnnualizedReturn}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NEW DYNAMIC SECTION: طبيعة تسعير الإيرادات المتغيرة بحسب نوع المشروع (Hospital vs Tangible/Restaurant) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            {isComplexServices ? (
              <Stethoscope className="w-6 h-6" />
            ) : (
              <Utensils className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-base sm:text-lg text-[#172033] dark:text-white">
                طبيعة تسعير الإيرادات ونموذج التدفق النقدي لهذا المشروع
              </h4>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {isComplexServices ? 'خدمات طبية وجراحية متقدمة' : 'منتجات وسلة طلبات محددة'}
              </span>
            </div>
            <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
              {isComplexServices
                ? 'توضيح منهجي لسبب عدم إمكانية تقييم الخدمات بسعر موحد وكيفية احتساب الإيرادات والأرباح'
                : 'مؤشرات متوسط سلة المبيعات (Average Ticket) وحجم الطلبات اليومية اللازمة لتحقيق الأرباح'}
            </p>
          </div>
        </div>

        {/* CASE A: COMPLEX SERVICES (مستشفى / عمليات جراحية / مراكز متخصصة) */}
        {isComplexServices ? (
          <div className="space-y-4">
            {/* Methodology Note Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-100 text-sm">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>تنويه منهجي خاص بقطاع المستشفيات والخدمات الجراحية:</span>
              </div>
              <p>
                في المشاريع الطبية الكبرى والمستشفيات، <strong>لا يمكن تحديد سعر موحد أو سعر متوسط بسيط للخدمة</strong>؛ نظراً للتفاوت الجذري الواسع في التكاليف والأسعار بين الخدمات المتعددة:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs pr-2 text-amber-900/90 dark:text-amber-200/90">
                <li><strong>كشف العيادات الاستشارية:</strong> له تكلفة رمزية وسريعة الدوران.</li>
                <li><strong>جراحات المناظير واليوم الواحد:</strong> لها تكلفة تشمل تعقيم وغازات وتخدير ومستهلكات جراحية.</li>
                <li><strong>الجراحات الكبرى (قلب مفتوح، مخ وأعصاب، جراحة عظام واستبدال مفاصل):</strong> تتطلب فرق جراحية متخصصة ومستلزمات متغيرة بالعملة الأجنبية وتخضع لأسعار السوق المتقلبة.</li>
                <li><strong>الرعاية المركزة وأيام الإقامة الفندقية:</strong> تسعر باليوم السريري وتعتمد على الرعاية التمريضية المستمرة.</li>
              </ul>
              <p className="text-xs font-semibold pt-1 text-amber-800 dark:text-amber-300">
                💡 لذلك، تم بناء أرباح دراسة الجدوى في هذا النموذج اعتماداً على <strong>معدل إشغال الأسرّة وغرف العمليات (Bed & Operating Room Occupancy Rate)</strong> ونسب التعاقدات الطبية (تأمين ونقابات وخاص).
              </p>
            </div>

            {/* Operating Capacity Drivers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[11px] text-[#526077] dark:text-slate-400 font-semibold block mb-1">
                  معدل إشغال الأسرة المستهدف
                </span>
                <div className="text-xl font-black text-[#172033] dark:text-white font-mono">
                  65% - 75%
                </div>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  المعدل الصحي لتغطية المصاريف
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[11px] text-[#526077] dark:text-slate-400 font-semibold block mb-1">
                  إشغال غرف العمليات اليومي
                </span>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  4 - 8 عمليات / غرفة
                </div>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  متوسط تشغيل 12 إلى 16 ساعة
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[11px] text-[#526077] dark:text-slate-400 font-semibold block mb-1">
                  هيكل الدخل المقدر
                </span>
                <div className="text-base font-black text-[#172033] dark:text-white">
                  تعريفة مركبة (Tiered Tariff)
                </div>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  بين الكشوفات، العمليات، والإقامة
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
                <span className="text-[11px] text-[#526077] dark:text-slate-400 font-semibold block mb-1">
                  المحرك الاستراتيجي للربحية
                </span>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  التعاقدات المؤسسية والتأمين
                </div>
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  تضمن 60% من التدفق النقدي المستمر
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: DYNAMIC UNIT ECONOMICS & PROFIT MARGIN */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs sm:text-sm text-[#172033] dark:text-slate-200 leading-relaxed">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                📊 متوسط الربح وسعر الوحدة للمشروع (Unit Economics & Profit Margin):
              </span>
              في هذا النشاط، ترتبط الربحية المباشرة بضبط <strong>{unitLabel}</strong>، مع التحكم في التكلفة المباشرة للوحدة وتحقيق هامش ربح تشغيلي مستدام يغطي تكاليف التأسيس والتوسع.
            </div>

            {/* Interactive Unit Economics Sandbox */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>{unitLabel}:</span>
                    <span className="font-mono text-[#7C3AED] dark:text-purple-300 font-black text-sm">
                      {formatEgp(customAvgTicket)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={customAvgTicket}
                    onChange={(e) => setCustomAvgTicket(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-medium">
                    <span>50 ج.م (خدمة/وحدة أساسية)</span>
                    <span>250 ج.م (متوسط سعر الوحدة)</span>
                    <span>800+ ج.م (باقة متكاملة)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>{orderVolumeLabel}:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black text-sm">
                      {customDailyOrders} {isMedicalOrClinic ? 'كشف/فحص' : 'وحدة/طلب'} / يوم
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={customDailyOrders}
                    onChange={(e) => setCustomDailyOrders(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-medium">
                    <span>10 (بداية هادئة)</span>
                    <span>60 (معدل تشغيل نشط)</span>
                    <span>200+ (ذروة إقبال)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Output Box */}
              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                  <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">
                    متوسط الربح المباشر لكل وحدة
                  </span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatEgp(Math.round(customAvgTicket * 0.65))}
                  </div>
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    هامش مساهمة تقديري 65% للوحدة
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                  <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">
                    الإيراد الشهري المقدر
                  </span>
                  <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {formatEgp(calculatedMonthlyTangibleRev)}
                  </div>
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    بناءً على 28 يوم عمل شهرياً
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                  <span className="text-[11px] text-[#526077] dark:text-slate-400 block mb-1">
                    التكلفة المباشرة المقدرة للوحدة
                  </span>
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                    {formatEgp(Math.round(customAvgTicket * 0.35))}
                  </div>
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    تكاليف التشغيل والخامات المباشرة
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                    إجمالي الربح الشهري الناتج
                  </span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatEgp(calculatedMonthlyTangibleGross)}
                  </div>
                  <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 block">
                    صافي هامش الربح قبل المصاريف الثابتة
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Interactive Capital Reality Check & Simulator (أداة إعادة تقييم واختبار الميزانية) */}
      <div
        id="capital-reevaluator"
        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-purple-200 dark:border-purple-900/50 shadow-sm space-y-5 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-[#7C3AED] dark:text-purple-300">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#172033] dark:text-white">
                أداة اختبار وإعادة تقييم رأس المال التفاعلية (Capital Reality Check)
              </h4>
              <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
                غيّر رأس المال أو ارفع الميزانية وشاهد فوراً كيف ينعكس ذلك على واقعية المشروع وإمكانية تنفيذه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatedBudget(activeFeasibility.userBudgetEgp)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#526077] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="استعادة الميزانية الحالية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>

        {/* Slider and Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Manual Input & Presets */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs font-bold text-[#172033] dark:text-slate-200">
              اختبر رأس مال آخر (بالجنيه المصري EGP):
            </label>
            <div className="relative">
              <input
                type="number"
                min="10000"
                step="5000"
                value={simulatedBudget}
                onChange={(e) => setSimulatedBudget(Math.max(0, Number(e.target.value)))}
                className="w-full pl-16 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-[#CBD5E1] dark:border-slate-700 text-base font-black font-mono text-[#172033] dark:text-white focus:border-[#7C3AED] outline-none"
                dir="ltr"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7C3AED] dark:text-purple-300 pointer-events-none">
                ج.م EGP
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSimulatedBudget(activeFeasibility.minEstimatedBudgetEgp)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-[#7C3AED] dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 transition-colors"
              >
                الحد الأدنى للتنفيذ ({formatEgp(activeFeasibility.minEstimatedBudgetEgp)})
              </button>
              <button
                type="button"
                onClick={() => setSimulatedBudget(activeFeasibility.recommendedBudgetEgp)}
                className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                الموصى به ({formatEgp(activeFeasibility.recommendedBudgetEgp)})
              </button>
              <button
                type="button"
                onClick={() => setSimulatedBudget((prev) => prev + 50000)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#172033] dark:text-slate-200 text-[11px] font-semibold transition-colors"
              >
                +50,000 ج.م
              </button>
              <button
                type="button"
                onClick={() => setSimulatedBudget((prev) => prev + 200000)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#172033] dark:text-slate-200 text-[11px] font-semibold transition-colors"
              >
                +200,000 ج.م
              </button>
              <button
                type="button"
                onClick={() => setSimulatedBudget((prev) => prev * 2)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#172033] dark:text-slate-200 text-[11px] font-semibold transition-colors"
              >
                مضاعفة (×2)
              </button>
            </div>
          </div>

          {/* Range Slider & Live Impact Preview */}
          <div className="lg:col-span-7 space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#526077] dark:text-slate-400">
                <span>حرك المؤشر لزيادة الميزانية:</span>
                <span className="font-mono font-bold text-[#172033] dark:text-white">
                  {formatEgp(simulatedBudget)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max={Math.max(5000000, activeFeasibility.minEstimatedBudgetEgp * 1.6)}
                step="10000"
                value={simulatedBudget}
                onChange={(e) => setSimulatedBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
              />
              <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                <span>20 ألف ج.م (بداية متواضعة)</span>
                <span>{formatEgp(activeFeasibility.minEstimatedBudgetEgp)} (حد أدنى)</span>
                <span>{formatEgp(activeFeasibility.recommendedBudgetEgp)} (موصى به)</span>
              </div>
            </div>

            {/* Live Outcome Box */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#526077] dark:text-slate-400 font-semibold">
                    النتيجة عند رأس مال {formatEgp(simulatedBudget)}:
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      simulatedFeasibility.status === 'sufficient'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : simulatedFeasibility.status === 'lean_viable'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {simulatedFeasibility.status === 'sufficient'
                      ? 'كافٍ ومناسب للبدء الكامل ✓'
                      : simulatedFeasibility.status === 'lean_viable'
                      ? 'كافٍ لنموذج مصغر (MVP) ⚠️'
                      : 'غير كافٍ لهذا الحجم ✕'}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#172033] dark:text-slate-200">
                  {simulatedFeasibility.verdictTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplySimulatedBudget}
                className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>تثبيت الميزانية في المشروع</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Visual Capital Allocation Breakdown Bar (أين يذهب رأس المال؟) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#172033] dark:text-white">
              أين يذهب رأس المال؟ (توزيع التكاليف التأسيسية حسب الفئات)
            </h4>
            <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
              نسبة كل تصنيف من إجمالي مصروفات التأسيس المقدرة ({formatEgp(currentCapexTotal)})
            </p>
          </div>
        </div>

        {/* Stacked Percentage Progress Bar */}
        <div className="w-full h-4 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          {capexBreakdownByCategory.machineryPct > 0 && (
            <div
              style={{ width: `${capexBreakdownByCategory.machineryPct}%` }}
              className="bg-indigo-600 h-full transition-all duration-300"
              title={`معدات وآلات: ${capexBreakdownByCategory.machineryPct}%`}
            />
          )}
          {capexBreakdownByCategory.fitoutPct > 0 && (
            <div
              style={{ width: `${capexBreakdownByCategory.fitoutPct}%` }}
              className="bg-sky-500 h-full transition-all duration-300"
              title={`تجهيزات وتشطيب: ${capexBreakdownByCategory.fitoutPct}%`}
            />
          )}
          {capexBreakdownByCategory.legalPct > 0 && (
            <div
              style={{ width: `${capexBreakdownByCategory.legalPct}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
              title={`تراخيص وتأسيس: ${capexBreakdownByCategory.legalPct}%`}
            />
          )}
          {capexBreakdownByCategory.workingPct > 0 && (
            <div
              style={{ width: `${capexBreakdownByCategory.workingPct}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`سيولة تشغيل ومخزون: ${capexBreakdownByCategory.workingPct}%`}
            />
          )}
        </div>

        {/* 4 Category Detailed Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">معدات وآلات</span>
            </div>
            <div className="text-sm font-black font-mono text-[#172033] dark:text-white">
              {formatEgp(capexBreakdownByCategory.machinery)}
            </div>
            <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-semibold">
              {capexBreakdownByCategory.machineryPct}% من التأسيس
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
              <span className="text-xs font-bold text-sky-900 dark:text-sky-300">تجهيزات وتشطيب</span>
            </div>
            <div className="text-sm font-black font-mono text-[#172033] dark:text-white">
              {formatEgp(capexBreakdownByCategory.fitout)}
            </div>
            <span className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold">
              {capexBreakdownByCategory.fitoutPct}% من التأسيس
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">تراخيص وتأسيس</span>
            </div>
            <div className="text-sm font-black font-mono text-[#172033] dark:text-white">
              {formatEgp(capexBreakdownByCategory.legal)}
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
              {capexBreakdownByCategory.legalPct}% من التأسيس
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">سيولة تشغيل ومخزون</span>
            </div>
            <div className="text-sm font-black font-mono text-[#172033] dark:text-white">
              {formatEgp(capexBreakdownByCategory.working)}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
              {capexBreakdownByCategory.workingPct}% من التأسيس
            </span>
          </div>
        </div>
      </div>

      {/* 8. Detailed Equipment & CapEx Table (بنود وتكاليف التأسيس والشراء) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-base text-[#172033] dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#7C3AED]" />
              <span>
                {viewAlternativeModel
                  ? `تفاصيل معدات وتأسيس النموذج البديل: ${activeFeasibility.alternativeModelTitle || 'النموذج المصغر'}`
                  : 'تفاصيل المعدات ومصروفات التأسيس (ماذا ستشتري؟ وتكلفة كل بند؟)'}
              </span>
            </h4>
            <p className="text-xs text-[#526077] dark:text-slate-400 mt-0.5">
              {viewAlternativeModel
                ? 'بنود التأسيس والمعدات للنموذج البديل المخفف لتفادي مخاطر السيولة والبدء بميزانيتك'
                : 'قائمة المعدات الموصى بها بالسوق المصري مع نصائح الشراء وإمكانية تعديل تكلفة أي بند فورياً'}
            </p>
          </div>

          <button
            onClick={() => setIsAddEqModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm shadow-purple-600/20 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة بند تأسيس / معدة جديدة</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `الكل (${currentStartupList.length})` },
              { id: 'معدات وآلات', label: 'معدات وآلات' },
              { id: 'تجهيزات وتشطيب', label: 'تجهيزات وتشطيب' },
              { id: 'تراخيص وتأسيس', label: 'تراخيص وتأسيس' },
              { id: 'سيولة تشغيل ومخزون', label: 'سيولة ومخزون' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedEqCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  selectedEqCategory === tab.id
                    ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#526077] dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={eqSearchQuery}
              onChange={(e) => setEqSearchQuery(e.target.value)}
              placeholder="ابحث في المعدات والتجهيزات..."
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white dark:bg-[#131B2E] border border-[#CBD5E1] dark:border-slate-800 text-xs text-[#172033] dark:text-slate-100 placeholder:text-[#64748B] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>

        {/* Equipment Items Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredEquipment.map((item) => {
            const isEditing = editingEquipmentId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 relative"
              >
                <div>
                  {/* Top Row: Category & Priority */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.priority === 'ضروري للبدء'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : item.priority === 'مرحلة ثانية'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400'
                            : 'bg-slate-100 text-[#526077] dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveEquipmentCost(item.id);
                          } else {
                            setEditingEquipmentId(item.id);
                            setEqCostInput(item.estimatedCostEgp);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C3AED] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={isEditing ? 'حفظ التكلفة' : 'تعديل التكلفة'}
                      >
                        {isEditing ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Edit2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {activeFeasibility.startupBreakdown.length > 2 && (
                        <button
                          onClick={() => handleDeleteEquipmentItem(item.id)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="حذف هذا البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Equipment Name */}
                  <h5 className="font-bold text-sm text-[#172033] dark:text-white leading-snug">
                    {item.name}
                  </h5>

                  {/* Notes / Market purchase tips */}
                  {item.notes && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-[#526077] dark:text-slate-400 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>

                {/* Cost Footer / Edit Input */}
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
                    التكلفة التقديرية:
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={eqCostInput}
                        onChange={(e) =>
                          setEqCostInput(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="w-28 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#7C3AED] text-xs font-mono font-bold text-[#172033] dark:text-white outline-none"
                        dir="ltr"
                        autoFocus
                      />
                      <span className="text-[11px] font-bold text-[#7C3AED]">ج.م</span>
                      <button
                        onClick={() => setEditingEquipmentId(null)}
                        className="p-1 text-[#64748B] hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-base font-black text-[#172033] dark:text-white font-mono">
                      {formatEgp(item.estimatedCostEgp)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-dashed border-[#CBD5E1] dark:border-slate-800">
            <Search className="w-8 h-8 text-[#64748B] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[#172033] dark:text-slate-300">
              لا توجد بنود تأسيس مطابقة للبحث أو التصنيف
            </p>
            <p className="text-xs text-[#526077] dark:text-slate-400 mt-1">
              يمكنك إضافة معدة جديدة أو تغيير التصنيف المختار
            </p>
          </div>
        )}
      </div>

      {/* 9. Strategic Action Advice Cards for Egyptian Market */}
      {activeFeasibility.advice && activeFeasibility.advice.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
            <h4 className="font-bold text-sm sm:text-base text-[#172033] dark:text-white">
              نصائح استراتيجية وتوصيات ترشيد التكاليف في السوق المصري
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeFeasibility.advice.map((adv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 text-xs text-[#172033] dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-[#7C3AED] dark:text-purple-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{adv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Assumptions & Market Notes */}
      {pricing.assumptions && pricing.assumptions.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800 text-xs text-[#526077] dark:text-slate-400 space-y-1">
          <span className="font-bold text-[#172033] dark:text-slate-300 block">
            افتراضات وملاحظات دراسة الجدوى في السوق المصري:
          </span>
          <ul className="space-y-0.5 list-disc list-inside">
            {pricing.assumptions.map((ass, i) => (
              <li key={i}>{ass}</li>
            ))}
          </ul>
        </div>
      )}

      {/* MODAL: ADD NEW STARTUP EQUIPMENT / CAPEX ITEM */}
      {isAddEqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2E] rounded-3xl p-6 border border-[#E2E8F0] dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#7C3AED]" />
                <h4 className="font-bold text-base text-[#172033] dark:text-white">
                  إضافة معدة أو بند تأسيس جديد
                </h4>
              </div>
              <button
                onClick={() => setIsAddEqModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1">
                  اسم المعدة أو البند:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: جهاز فحص تخصصي أو ماكينة تحضير أو تعقيم"
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-white focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1">
                    التصنيف:
                  </label>
                  <select
                    value={newEqCategory}
                    onChange={(e) => setNewEqCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-white focus:border-[#7C3AED]"
                  >
                    <option value="معدات وآلات">معدات وآلات</option>
                    <option value="تجهيزات وتشطيب">تجهيزات وتشطيب</option>
                    <option value="تراخيص وتأسيس">تراخيص وتأسيس</option>
                    <option value="سيولة تشغيل ومخزون">سيولة تشغيل ومخزون</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1">
                    درجة الأولوية:
                  </label>
                  <select
                    value={newEqPriority}
                    onChange={(e) =>
                      setNewEqPriority(
                        e.target.value as 'ضروري للبدء' | 'مرحلة ثانية' | 'اختياري للتوسع'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-white focus:border-[#7C3AED]"
                  >
                    <option value="ضروري للبدء">ضروري للبدء (مرحلة 1)</option>
                    <option value="مرحلة ثانية">مرحلة ثانية</option>
                    <option value="اختياري للتوسع">اختياري للتوسع</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1">
                  التكلفة التقديرية (ج.م):
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="مثال: 45000"
                  value={newEqCost}
                  onChange={(e) =>
                    setNewEqCost(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs font-mono font-bold text-[#172033] dark:text-white focus:border-[#7C3AED]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] dark:text-slate-300 mb-1">
                  ملاحظات أو نصيحة شراء بالسوق المصري:
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: يمكن شراؤها استيراد كسر زيرو لتوفير 35% أو تصنيع محلي..."
                  value={newEqNotes}
                  onChange={(e) => setNewEqNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 text-xs text-[#172033] dark:text-white resize-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#526077] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  إضافة بند التأسيس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
