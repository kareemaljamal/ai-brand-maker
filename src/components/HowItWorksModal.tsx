import React from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, Cpu, Palette, Coins, CalendarDays, Eye } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: Cpu,
      title: '1. إدخال الفكرة والبيانات الواقعية',
      description: 'أدخل فكرة مشروعك مع خيارات تخصيص المدينة والجمهور والميزانية المقدرة بالجنيه المصري.',
    },
    {
      icon: Palette,
      title: '2. بناء الهوية والأسماء والشعارات',
      description: 'يولد النظام 6 أسماء متباينة بالمعنى والنطق، 4 شعارات لفظية، قصة البراند ونبرة الصوت، و5 ألوان متناسقة.',
    },
    {
      icon: Coins,
      title: '3. استراتيجية تسعير بالجنيه المصري (EGP)',
      description: '3 باقات تسعيرية مدروسة، مع حساب هوامش المساهمة (Contribution Margin) والتحكم الحسابي بنسب الزيادة/الخفض.',
    },
    {
      icon: CalendarDays,
      title: '4. خطة تسويقية لـ 30 يوماً ومنشورات جاهزة',
      description: '30 إجراء يومي موزع على 5 فترات تفصيلية، بالإضافة إلى 3 منشورات متكاملة قابلة للتعديل والنسخ مباشرة.',
    },
    {
      icon: Eye,
      title: '5. استوديو الهوية البصرية وتوليد الفيكتور',
      description: 'توليد الشعار وصورة الحساب فيكتور SVG عالي النقاء عند الطلب داخل استوديو الهوية البصرية مع خيارات التحميل.',
    },
    {
      icon: ShieldCheck,
      title: '6. حفظ محلي وعرض فوري',
      description: 'حفظ تلقائي للمشاريع على جهازك مع إمكانية استعراض وتصدير وثيقة المشروع الشاملة في أي وقت.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#172033] dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-[#64748B] hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] dark:bg-indigo-950/60 border border-[#DDD6FE] dark:border-indigo-800/80 flex items-center justify-center text-[#7C3AED] dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#172033] dark:text-white">كيف يعمل صانع البراند الذكي؟</h2>
            <p className="text-xs text-[#526077] dark:text-slate-400">دليلك الكامل لفهم دورة بناء وتخصيص علامتك التجارية</p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 flex items-start gap-3.5 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#7C3AED] dark:text-indigo-400 shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#172033] dark:text-white">{st.title}</h3>
                  <p className="text-xs text-[#526077] dark:text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>عرض فوري للنتائج بدون إبطاء</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-colors"
          >
            فهمت، لنبدأ الآن
          </button>
        </div>
      </div>
    </div>
  );
};
