// Shared validation: incomplete provider results must never become local suggestions.
export function validateNames(data: any, avoidNames: string[] = []) {
  const normalize = (name: string) => name.trim().normalize('NFKC').replace(/\s+/g, ' ').toLocaleLowerCase();
  const seen = new Set(avoidNames.map(normalize));
  if (!Array.isArray(data?.names) || data.names.length !== 6) {
    throw new Error('لم يرجع الذكاء الاصطناعي 6 أسماء كاملة. حاول مرة أخرى.');
  }
  for (const name of data.names) {
    if (!['nameAr', 'nameEn', 'style', 'rationale'].every(key => typeof name?.[key] === 'string' && name[key].trim())) {
      throw new Error('اقتراحات الأسماء غير مكتملة. حاول مرة أخرى.');
    }
    const normalized = normalize(name.nameAr);
    if (seen.has(normalized)) throw new Error('رجعت أسماء مكررة من الذكاء الاصطناعي. حاول مرة أخرى.');
    seen.add(normalized);
  }
  data.names = data.names.map((name: any, index: number) => ({ ...name, id: `name-${index + 1}` }));
  return data;
}

export function aiErrorResponse(error: any) {
  const status = Number(error?.status || error?.statusCode || error?.code);
  const message = String(error?.message || '');
  if (status === 401 || status === 403 || /API_KEY_INVALID|PERMISSION_DENIED|API key not valid/i.test(message)) {
    return { status: 503, code: 'AI_AUTH_ERROR', error: 'تعذر الوصول إلى Gemini. راجع مفتاح GEMINI_API_KEY وصلاحيات مشروع Google المرتبط به في إعدادات التطبيق.' };
  }
  if (status === 429 || /RESOURCE_EXHAUSTED|quota|rate.limit/i.test(message)) {
    return { status: 429, code: 'AI_QUOTA_EXCEEDED', error: 'حصة استخدام Gemini للمشروع المرتبط بالمفتاح انتهت أو تجاوزت الحد المؤقت. راجع الحصة والفوترة أو حاول لاحقاً.' };
  }
  if (status === 404) return { status: 502, code: 'AI_MODEL_UNAVAILABLE', error: 'نموذج Gemini المحدد غير متاح لهذا المشروع. راجع إعداد GEMINI_TEXT_MODEL.' };
  return { status: 502, code: 'AI_GENERATION_FAILED', error: 'تعذر الحصول على نتيجة كاملة من Gemini. حاول مرة أخرى. لم يتم استبدالها ببيانات جاهزة.' };
}
