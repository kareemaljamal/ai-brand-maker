import React, { useState } from 'react';
import {
  Calendar,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Image as ImageIcon,
  Target,
  Megaphone,
  Lock,
  Unlock,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { BrandMarketing, MarketingDay, MarketingPost } from '../types/brand';
import { copyToClipboard } from '../utils/export';

interface MarketingTabProps {
  marketing: BrandMarketing;
  onUpdateMarketing: (newMarketing: BrandMarketing, desc: string) => void;
  onRewritePost: (post: MarketingPost) => void;
  onRefineWeek: (weekNum: number) => void;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
  marketing,
  onUpdateMarketing,
  onRewritePost,
  onRefineWeek,
  onNotify,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'days' | 'posts'>('days');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const selectedDay =
    marketing.days.find((d) => d.dayNumber === selectedDayNumber) || marketing.days[0];

  // Group days by period
  const week1Days = marketing.days.filter((d) => d.dayNumber >= 1 && d.dayNumber <= 7);
  const week2Days = marketing.days.filter((d) => d.dayNumber >= 8 && d.dayNumber <= 14);
  const week3Days = marketing.days.filter((d) => d.dayNumber >= 15 && d.dayNumber <= 21);
  const week4Days = marketing.days.filter((d) => d.dayNumber >= 22 && d.dayNumber <= 28);
  const week5Days = marketing.days.filter((d) => d.dayNumber >= 29 && d.dayNumber <= 30);

  const weekGroups = [
    { num: 1, label: 'الأسبوع 1: الإطلاق وبناء الوعي الخاطف (الأيام 1 - 7)', days: week1Days },
    { num: 2, label: 'الأسبوع 2: تفعيل الطلبات الأولى والتجربة (الأيام 8 - 14)', days: week2Days },
    { num: 3, label: 'الأسبوع 3: بناء الثقة والتفاعل المجتمعي (الأيام 15 - 21)', days: week3Days },
    { num: 4, label: 'الأسبوع 4: تعزيز الولاء وإعادة الشراء (الأيام 22 - 28)', days: week4Days },
    { num: 5, label: 'الأيام 29 - 30: تقييم النتائج والتوسع', days: week5Days },
  ];

  const handleCopyText = async (text: string, label: string) => {
    await copyToClipboard(text);
    onNotify(`تم نسخ ${label} بنجاح.`, 'success');
  };

  const handleCopyPost = async (post: MarketingPost) => {
    const text = `--- ${post.platform} (${post.format}) ---\nالخطاف: ${post.hook}\n\n${post.caption}\n\nالدعوة للإجراء: ${post.cta}\n\n${post.hashtags.join(' ')}`;
    await copyToClipboard(text);
    onNotify('تم نسخ المنشور بالكامل بنجاح.', 'success');
  };

  const handleToggleLockPost = (postId: string) => {
    const updated = marketing.posts.map((p) =>
      p.id === postId ? { ...p, locked: !p.locked } : p
    );
    onUpdateMarketing({ ...marketing, posts: updated }, 'تحديث تثبيت المنشور');
    onNotify('تم تحديث حالة تثبيت المنشور.', 'info');
  };

  return (
    <div className="space-y-8 text-[#172033] dark:text-slate-100" dir="rtl">
      {/* Top Banner: Core Launch Message */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#EDE9FE] dark:bg-indigo-950/40 border border-[#DDD6FE] dark:border-indigo-800/60 space-y-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#7C3AED] dark:text-indigo-400" />
          <h3 className="font-bold text-base text-[#5B21B6] dark:text-indigo-300">
            رسالة الإطلاق المركزية
          </h3>
        </div>
        <p className="text-base sm:text-lg text-[#172033] dark:text-slate-100 font-bold leading-relaxed">
          "{marketing.coreLaunchMessage}"
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('days')}
          className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-bold transition-all ${
            activeSubTab === 'days'
              ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
              : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white bg-white hover:bg-purple-50/50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/60 dark:border-slate-800'
          }`}
        >
          خطة الـ 30 يوماً الكاملة ({marketing.days.length} يوماً)
        </button>

        <button
          onClick={() => setActiveSubTab('posts')}
          className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-bold transition-all ${
            activeSubTab === 'posts'
              ? 'bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] shadow-sm dark:bg-purple-600 dark:text-white dark:border-transparent'
              : 'text-[#526077] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white bg-white hover:bg-purple-50/50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/60 dark:border-slate-800'
          }`}
        >
          منشورات جاهزة للنشر ({marketing.posts.length})
        </button>
      </div>

      {/* ================= SUBTAB 1: 30 DAYS PLAN WITH DETAIL TABS ================= */}
      {activeSubTab === 'days' && (
        <div className="space-y-8 animate-in fade-in">
          {/* ACTIVE DAY DETAIL PREVIEW DRAWER (When any item is clicked) */}
          {selectedDay && (
            <div className="rounded-3xl bg-white dark:bg-[#131B2E] border-2 border-[#7C3AED] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              {/* Header of the Active Selected Day */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-600/25">
                    {selectedDay.dayNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 font-bold border border-[#DDD6FE] dark:border-indigo-800/60">
                        {selectedDay.period}
                      </span>
                      <span className="text-xs text-[#526077] dark:text-slate-400">
                        القناة: <strong className="text-[#172033] dark:text-slate-200">{selectedDay.channel}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#172033] dark:text-white mt-1">
                      {selectedDay.objective}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    مؤشر النجاح: {selectedDay.metric}
                  </span>
                </div>
              </div>

              {/* Action Description */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800">
                <span className="text-xs font-bold text-[#526077] dark:text-slate-400 block mb-1">
                  الإجراء العملي المحدد لهذا اليوم:
                </span>
                <p className="text-base text-[#172033] dark:text-slate-200 font-bold leading-relaxed">
                  {selectedDay.action}
                </p>
              </div>

              {/* UNIFIED EXECUTION EXPLANATION */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7C3AED] dark:text-indigo-400" />
                    <h4 className="text-base sm:text-lg font-black text-[#172033] dark:text-white">
                      الشرح التنفيذي للبند (متوافق تماماً مع مخرج اليوم: {selectedDay.deliverable})
                    </h4>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyText(
                        selectedDay.explanation ||
                          `الشرح التنفيذي:\n• المخرج: ${selectedDay.deliverable}\n• الإجراء: ${selectedDay.action}\n• الهدف: ${selectedDay.objective}\n• القناة: ${selectedDay.channel}\n• مؤشر النجاح: ${selectedDay.metric}`,
                        'الشرح التنفيذي'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs sm:text-sm font-bold text-white flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>نسخ الشرح التنفيذي</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1526] border border-[#E2E8F0] dark:border-slate-800/80">
                  <p className="whitespace-pre-line text-base sm:text-lg text-[#172033] dark:text-slate-100 font-medium leading-relaxed">
                    {selectedDay.explanation ||
                      `شرح تنفيذي متكامل لهذا اليوم:
1. المخرج المطلوب: ${selectedDay.deliverable}
2. الإجراء المحدد: ${selectedDay.action}
3. القناة المستهدفة: ${selectedDay.channel}
4. توجيهات التنفيذ: يتم تجهيز المحتوى بما يخدم الهدف الأساسي (${selectedDay.objective}) والتركيز على تقديم قيمة فورية للجمهور مع كول تو أكشن واضح لتحقيق مؤشر النجاح (${selectedDay.metric}).`}
                  </p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs sm:text-sm text-[#526077] dark:text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                    <strong>المخرج النهائي المعتمد:</strong> {selectedDay.deliverable}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <strong>مؤشر قياس الأداء:</strong> {selectedDay.metric}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 30-DAY TIMELINE ACCORDION ================= */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#172033] dark:text-white">
                  جدول أنشطة الـ 30 يوماً الكاملة
                </h3>
                <p className="text-xs sm:text-sm text-[#526077] dark:text-slate-400">
                  كل بند في سطر مستقل بخط واضح ومقروء، اضغط على أي بند لعرض شرحه التنفيذي المفصل المتوافق مع مخرجه
                </p>
              </div>
            </div>

            {weekGroups.map((group) => {
              const isExpanded = !!expandedWeeks[group.num];

              return (
                <div
                  key={group.num}
                  className="rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                >
                  {/* Week Header */}
                  <div
                    onClick={() => toggleWeek(group.num)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-[#7C3AED] text-white font-black text-sm shadow-sm">
                        {group.num <= 4 ? `الأسبوع ${group.num}` : 'الأيام 29-30'}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white">
                          {group.label}
                        </h4>
                        <span className="text-xs text-[#526077] dark:text-slate-400 font-medium">
                          {group.days.length} أنشطة يومية متسلسلة بخطوات تنفيذية
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWeek(group.num)}
                        className="p-2 text-[#64748B] hover:text-[#172033] dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Days List */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#E2E8F0] dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-3">
                      {group.days.map((day) => {
                        const isSelected = day.dayNumber === selectedDayNumber;

                        return (
                          <div
                            key={day.dayNumber}
                            onClick={() => {
                              setSelectedDayNumber(day.dayNumber);
                              window.scrollTo({ top: 380, behavior: 'smooth' });
                            }}
                            className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              isSelected
                                ? 'bg-[#EDE9FE]/70 dark:bg-indigo-950/50 border-[#7C3AED] shadow-md ring-1 ring-purple-500/20'
                                : 'bg-white dark:bg-slate-900/80 border-[#E2E8F0] dark:border-slate-800 hover:border-[#7C3AED]/60'
                            }`}
                          >
                            {/* Day Number + Objective + Action in Large Font */}
                            <div className="flex items-start gap-4 flex-1">
                              <span
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                                  isSelected
                                    ? 'bg-[#7C3AED] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-[#526077] dark:text-slate-300'
                                }`}
                              >
                                {day.dayNumber}
                              </span>

                              <div className="space-y-1 text-right">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-base sm:text-lg font-black text-[#172033] dark:text-white">
                                    {day.objective}
                                  </span>
                                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-slate-800 text-[#5B21B6] dark:text-indigo-400 font-bold border border-[#DDD6FE] dark:border-transparent">
                                    {day.channel}
                                  </span>
                                </div>
                                <p className="text-sm sm:text-base text-[#526077] dark:text-slate-300 font-semibold leading-relaxed">
                                  {day.action}
                                </p>
                              </div>
                            </div>

                            {/* Deliverable & Metric + Click to View details button */}
                            <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 md:border-r border-[#E2E8F0] dark:border-slate-800 pt-3 md:pt-0 md:pr-4 justify-between md:justify-end">
                              <div className="text-right">
                                <span className="text-xs text-[#64748B] block font-medium">المخرج:</span>
                                <span className="text-xs font-bold text-[#172033] dark:text-slate-300 max-w-[160px] truncate block">
                                  {day.deliverable}
                                </span>
                              </div>

                              <button
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                                  isSelected
                                    ? 'bg-[#7C3AED] text-white shadow-sm'
                                    : 'bg-white hover:bg-[#EDE9FE]/50 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-indigo-500/60 text-[#7C3AED] dark:text-indigo-400 dark:hover:text-white'
                                }`}
                              >
                                {isSelected ? 'معروض بالأعلى' : 'عرض التفاصيل'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: READY-TO-PUBLISH POSTS ================= */}
      {activeSubTab === 'posts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {marketing.posts.map((post) => (
            <div
              key={post.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-800/60 font-bold">
                      {post.platform}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">({post.format})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleLockPost(post.id)}
                      className={`p-1.5 rounded-lg ${
                        post.locked ? 'text-amber-500' : 'text-[#64748B] hover:text-[#172033] dark:hover:text-slate-300'
                      }`}
                      title={post.locked ? 'منشور مثبت ضد الاستبدال' : 'تثبيت المنشور'}
                    >
                      {post.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopyPost(post)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] dark:hover:text-white"
                      title="نسخ المنشور"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hook Box */}
                <div className="p-3.5 rounded-2xl bg-[#EDE9FE]/60 dark:bg-indigo-950/30 border border-[#DDD6FE] dark:border-indigo-900/40 text-sm text-[#5B21B6] dark:text-indigo-200 mb-3 font-semibold">
                  <strong className="block text-xs text-[#7C3AED] dark:text-indigo-400 mb-1">
                    الخطاف الجذاب (Hook في أول 3 ثوانٍ):
                  </strong>
                  "{post.hook}"
                </div>

                {/* Caption in Large Font */}
                <div className="space-y-1 mb-3">
                  <span className="text-xs font-bold text-[#172033] dark:text-slate-300 block">الكابشن الكامل:</span>
                  <p className="text-sm text-[#172033] dark:text-slate-200 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 font-medium">
                    {post.caption}
                  </p>
                </div>

                {/* Video Script if present */}
                {post.videoScript && (
                  <div className="space-y-1 mb-3">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> سيناريو الفيديو (Script):
                    </span>
                    <p className="text-xs text-[#526077] dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800 leading-relaxed">
                      {post.videoScript}
                    </p>
                  </div>
                )}

                {/* Visual Direction */}
                <div className="text-xs text-[#526077] dark:text-slate-400 mb-3">
                  <strong className="text-[#172033] dark:text-slate-200">التوجيه البصري: </strong>
                  {post.visualDirection}
                </div>

                {/* CTA */}
                <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                  <strong>الدعوة للإجراء (CTA): </strong>
                  {post.cta}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.hashtags.map((h, i) => (
                    <span key={i} className="text-xs text-[#7C3AED] dark:text-indigo-400 font-mono" dir="ltr">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scoped Rewrite Button */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  onClick={() => onRewritePost(post)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-xs font-bold text-[#7C3AED] dark:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>إعادة كتابة هذا المنشور فقط</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
