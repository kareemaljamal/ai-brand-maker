// Test-only provider transport. Never imported by the application.
const realFetch = globalThis.fetch;
let sequence = 0;
globalThis.fetch = async (input, options) => {
  const url = String(input?.url || input);
  if (!url.startsWith('https://generativelanguage.googleapis.com/')) return realFetch(input, options);
  const body = options?.body || (input instanceof Request ? await input.text() : '');
  const prompt = String(body);
  if (prompt.includes('AUTH_ERROR')) return new Response(JSON.stringify({ error: { code: 403, message: 'PERMISSION_DENIED', status: 'PERMISSION_DENIED' } }), { status: 403 });
  if (prompt.includes('QUOTA_ERROR')) return new Response(JSON.stringify({ error: { code: 429, message: 'RESOURCE_EXHAUSTED', status: 'RESOURCE_EXHAUSTED' } }), { status: 429 });
  if (prompt.includes('OUTAGE_ERROR')) return new Response(JSON.stringify({ error: { code: 503, message: 'UNAVAILABLE', status: 'UNAVAILABLE' } }), { status: 503 });
  sequence++;
  const count = prompt.includes('SHORT_RESPONSE') ? 2 : 6;
  const names = Array.from({ length: count }, (_, i) => ({ nameAr: `اسم ${sequence}-${i}`, nameEn: `Name ${sequence}-${i}`, style: 'عصري', rationale: 'اقتراح من خدمة الاختبار' }));
  if (prompt.includes('DUPLICATE_RESPONSE')) names[1] = names[0];
  const result = prompt.includes('MALFORMED_RESPONSE') ? 'not json' : JSON.stringify({ names, slogans: Array.from({ length: 3 }, (_, i) => ({ text: `شعار ${i}` })) });
  return new Response(JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: result }] }, finishReason: 'STOP' }] }), { headers: { 'Content-Type': 'application/json' } });
};
