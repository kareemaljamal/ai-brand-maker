import { BrandProject } from '../types/brand';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

export function formatEgp(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'غير محدد';
  return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
}

export function generateBrandFullText(brand: BrandProject): string {
  const selectedName =
    brand.identity.names.find((n) => n.id === brand.identity.selectedNameId) || brand.identity.names[0];
  const selectedSlogan =
    brand.identity.slogans.find((s) => s.id === brand.identity.selectedSloganId) || brand.identity.slogans[0];

  const lines: string[] = [];

  lines.push(`================================================================`);
  lines.push(` BrandMaker AI — صانع البراند الذكي `);
  lines.push(` وثيقة الهوية وخطة التسعير والتسويق المتكاملة `);
  lines.push(` تاريخ التوليد: ${new Date(brand.updatedAt || brand.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}`);
  lines.push(`================================================================\n`);

  lines.push(`[1] ملخص المشروع والبيزنس (Business Brief)`);
  lines.push(`- فكرة المشروع: ${brand.brief.idea}`);
  lines.push(`- التصنيف: ${brand.brief.category}`);
  lines.push(`- النطاق الجغرافي: ${brand.brief.city} (جمهورية مصر العربية)`);
  lines.push(`- نموذج العمل: ${brand.brief.businessModel === 'online' ? 'رقمي أونلاين' : brand.brief.businessModel === 'physical' ? 'مقر فعلي' : 'هجين (مقر وأونلاين)'}`);
  lines.push(`- الجمهور المستهدف: ${brand.brief.targetAudience}`);
  lines.push(`- الطابع والشخصية: ${brand.brief.personality}`);
  lines.push(`- الميزانية المبدئية: ${formatEgp(brand.brief.budgetEgp)}`);
  lines.push(`- التكاليف المتغيرة التقديرية: ${formatEgp(brand.brief.knownVariableCostsEgp)}`);
  lines.push(`- التكاليف الثابتة الشهرية: ${formatEgp(brand.brief.knownMonthlyFixedCostsEgp)}`);
  lines.push(`\n----------------------------------------------------------------`);

  lines.push(`[2] هوية العلامة التجارية (Brand Identity)`);
  lines.push(`- الاسم المعتمد: ${selectedName?.nameAr || ''} (${selectedName?.nameEn || ''})`);
  lines.push(`- الشعار اللفظي المعتمد: "${selectedSlogan?.text || ''}"`);
  lines.push(`\n* قصة البراند (Brand Story):`);
  lines.push(brand.identity.strategy.story);
  lines.push(`\n* التموضع السوقي (Positioning):`);
  lines.push(brand.identity.strategy.positioning);
  lines.push(`\n* عرض القيمة الفريدة (Value Proposition):`);
  lines.push(brand.identity.strategy.valueProposition);
  lines.push(`\n* الرسالة والرؤية (Mission & Vision):`);
  lines.push(`- الرسالة: ${brand.identity.strategy.mission}`);
  lines.push(`- الرؤية: ${brand.identity.strategy.vision}`);
  lines.push(`\n* القيم الجوهرية: ${brand.identity.strategy.values.join(' • ')}`);

  lines.push(`\n* نبرة الصوت (Brand Voice):`);
  lines.push(`- السمات الأساسية: ${brand.identity.voice.traits.join(' • ')}`);
  lines.push(`- كلمات وعبارات نفضلها: ${brand.identity.voice.doSay.join(' | ')}`);
  lines.push(`- عبارات نتجنبها: ${brand.identity.voice.doNotSay.join(' | ')}`);

  lines.push(`\n* لوحة الألوان المعتمدة (Color Palette):`);
  brand.identity.palette.forEach((c) => {
    lines.push(`- ${c.nameAr} (${c.role}): ${c.hex} — ${c.usageNote}`);
  });

  lines.push(`\n* مقترحات الأسماء الأخرى (${brand.identity.names.length} مرشحاً):`);
  brand.identity.names.forEach((n, idx) => {
    lines.push(`  ${idx + 1}. ${n.nameAr} (${n.nameEn}) [${n.style}] — ${n.meaning} (ملاحظة: ${n.tradeoff})`);
  });

  lines.push(`\n----------------------------------------------------------------`);
  lines.push(`[3] استراتيجية التسعير بالجنيه المصري (Pricing Strategy)`);
  lines.push(`* ملاحظة التسعير: ${brand.pricing.statusNote}`);
  brand.pricing.tiers.forEach((tier, idx) => {
    const contribution = tier.variableCostEgp !== undefined ? tier.priceEgp - tier.variableCostEgp : null;
    const margin = contribution !== null && tier.priceEgp > 0 ? ((contribution / tier.priceEgp) * 100).toFixed(1) : null;
    lines.push(`\n* الباقة ${idx + 1}: ${tier.title}`);
    lines.push(`  - السعر: ${formatEgp(tier.priceEgp)} (${tier.billingUnit})`);
    lines.push(`  - المستهدف: ${tier.targetAudience}`);
    lines.push(`  - المشتملات: ${tier.inclusions.join(' • ')}`);
    lines.push(`  - المبرر التنافسي: ${tier.rationale}`);
    if (tier.variableCostEgp !== undefined) {
      lines.push(`  - التكلفة المتغيرة التقديرية: ${formatEgp(tier.variableCostEgp)}`);
      lines.push(`  - هامش المساهمة للوحدة: ${formatEgp(contribution || 0)} (${margin}% نسبة هامش المساهمة)`);
    }
  });

  lines.push(`\n----------------------------------------------------------------`);
  lines.push(`[4] الخطة التسويقية لخمس فترات (30 يوماً متتالياً)`);
  lines.push(`* رسالة الإطلاق المركزية: ${brand.marketing.coreLaunchMessage}`);
  lines.push(`* قنوات الاستحواذ المقترحة:`);
  brand.marketing.acquisitionChannels.forEach((ch) => {
    lines.push(`  - ${ch.channel}: ${ch.rationale}`);
  });

  lines.push(`\n* جدول الـ 30 يوماً بالتفصيل:`);
  brand.marketing.days.forEach((day) => {
    lines.push(`  [اليوم ${day.dayNumber}] ${day.period} | ${day.objective}`);
    lines.push(`    - الإجراء: ${day.action}`);
    lines.push(`    - القناة: ${day.channel} | المخرجات: ${day.deliverable}`);
    lines.push(`    - المقياس المستهدف: ${day.metric}`);
  });

  lines.push(`\n* نماذج منشورات جاهزة للنشر:`);
  brand.marketing.posts.forEach((post, idx) => {
    lines.push(`\n--- منشور رقم ${idx + 1} (${post.platform} - ${post.format}) ---`);
    lines.push(`الخطاف (Hook): ${post.hook}`);
    lines.push(`الكابشن:\n${post.caption}`);
    if (post.videoScript) lines.push(`السيناريو: ${post.videoScript}`);
    lines.push(`التوجيه البصري: ${post.visualDirection}`);
    lines.push(`الدعوة للإجراء (CTA): ${post.cta}`);
    lines.push(`الهاشتاجات: ${post.hashtags.join(' ')}`);
  });

  lines.push(`\n----------------------------------------------------------------`);
  lines.push(`[5] برومبتات الهوية البصرية (English Prompts for AI Image Generation)`);
  lines.push(`Visual Direction: ${brand.visuals.visualDirection}`);
  lines.push(`\n[Logo Prompt - LTR]:`);
  lines.push(brand.visuals.logoPrompt);
  lines.push(`\n[Avatar Prompt - LTR]:`);
  lines.push(brand.visuals.avatarPrompt);

  lines.push(`\n================================================================`);
  lines.push(`تنبيه: كافة الاستراتيجيات والأسعار المعروضة مقترحات قابلة للتعديل والملائمة وفق متطلبات السوق المصري.`);
  lines.push(`تم إنشاؤه بواسطة BrandMaker AI — صانع البراند الذكي.`);
  lines.push(`================================================================`);

  return lines.join('\n');
}

export function exportBrandAsTxt(brand: BrandProject): void {
  const text = generateBrandFullText(brand);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const selectedName =
    brand.identity.names.find((n) => n.id === brand.identity.selectedNameId)?.nameAr || 'brand';
  a.href = url;
  a.download = `brandmaker-${selectedName.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
