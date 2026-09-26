import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../server/index.js';

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

test('LRCLIB proxy falls back from exact lookup to search', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (input) => {
    const url = String(input); calls.push(url);
    if (url.includes('/get?')) return jsonResponse({ message: 'not found' }, 404);
    return jsonResponse([{ id: 1, trackName: 'FANCY', artistName: 'TWICE', syncedLyrics: '[00:01.00]Fancy' }]);
  };
  try {
    const response = await worker.fetch(new Request('https://local/api/lyrics/search?track_name=FANCY&artist_name=TWICE&duration=219'), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.source, 'LRCLIB');
    assert.equal(payload.items.length, 1);
    assert.match(calls[0], /\/get\?/);
    assert.match(calls[1], /\/search\?/);
    assert.match(calls[1], /track_name=FANCY/);
    assert.match(calls[1], /artist_name=TWICE/);
  } finally { globalThis.fetch = originalFetch; }
});

test('LRCLIB proxy returns an exact synchronized lyric immediately', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return jsonResponse({ id: 2, syncedLyrics: '[00:01.00]Hello' }); };
  try {
    const response = await worker.fetch(new Request('https://local/api/lyrics/search?track_name=Hello&artist_name=Singer'), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.items[0].id, 2);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test('LRCLIB proxy validates required metadata', async () => {
  const response = await worker.fetch(new Request('https://local/api/lyrics/search?track_name=FANCY'), {});
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /歌名與歌手/);
});

test('LRCLIB proxy retries a temporary upstream failure once', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return calls === 1 ? jsonResponse({ error: 'busy' }, 503) : jsonResponse({ id: 3, syncedLyrics: '[00:01.00]Recovered' });
  };
  try {
    const response = await worker.fetch(new Request('https://local/api/lyrics/search?track_name=Recovered&artist_name=Singer'), {});
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.items[0].id, 3);
    assert.equal(calls, 2);
  } finally { globalThis.fetch = originalFetch; }
});
