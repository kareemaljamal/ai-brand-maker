import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { validateNames } from '../src/utils/liveAi.ts';

async function startServer(key, port, entry = 'server.ts') {
  const child = spawn(process.execPath, ['--import', './tests/mock-gemini.mjs', entry], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, NODE_ENV: 'production', GEMINI_API_KEY: key, GEMINI_TEXT_MODEL: 'test-model', PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk; });
  child.stderr.on('data', chunk => { logs += chunk; });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(base + '/api/status')).ok) return { child, base }; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  child.kill();
  throw new Error('Server did not start: ' + logs);
}
async function stop(child) {
  const closed = once(child, 'exit'); child.kill(); await closed;
}
const post = (base, idea, route = 'generate-names') => fetch(base + '/api/brand/' + route, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea }),
});

test('published server bundle includes the names endpoint used by the frontend', async () => {
  const { child, base } = await startServer('test-only-key', 31373, 'server.js');
  try {
    const response = await post(base, 'مطعم شوربة عدس');
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.source, 'gemini');
    assert.equal(data.names.length, 6);
  } finally { await stop(child); }
});

test('missing key returns an actionable error, never local suggestions', async () => {
  const { child, base } = await startServer('', 31371);
  try {
    for (const route of ['generate-names', 'generate-identity-details', 'generate-pricing', 'generate-marketing', 'generate-visuals', 'scoped-op']) {
      const response = await post(base, 'مطعم جديد', route);
      assert.equal(response.status, 503);
      const data = await response.json();
      assert.equal(data.code, 'AI_NOT_CONFIGURED');
      assert.equal(data.names, undefined);
    }
  } finally { await stop(child); }
});

test('each request reaches Gemini; provider failures and incomplete names never return success', async () => {
  const { child, base } = await startServer('test-only-key', 31372);
  try {
    const response = await post(base, 'مطعم جديد');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const first = await response.json();
    const second = await (await post(base, 'مطعم جديد')).json();
    assert.equal(first.source, 'gemini');
    assert.equal(first.names.length, 6);
    assert.notEqual(first.names[0].nameAr, second.names[0].nameAr);
    assert.throws(() => validateNames(first, [first.names[0].nameAr]));
    for (const [idea, status, code] of [
      ['AUTH_ERROR', 503, 'AI_AUTH_ERROR'], ['QUOTA_ERROR', 429, 'AI_QUOTA_EXCEEDED'],
      ['OUTAGE_ERROR', 502, 'AI_GENERATION_FAILED'], ['SHORT_RESPONSE', 502, 'AI_GENERATION_FAILED'],
      ['DUPLICATE_RESPONSE', 502, 'AI_GENERATION_FAILED'], ['MALFORMED_RESPONSE', 502, 'AI_GENERATION_FAILED'],
    ]) {
      const response = await post(base, idea);
      assert.equal(response.status, status, idea);
      const data = await response.json();
      assert.equal(data.code, code, idea);
      assert.equal(data.names, undefined, idea);
    }
  } finally { await stop(child); }
});
