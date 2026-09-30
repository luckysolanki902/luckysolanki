const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Load the actual TS modules with an isolated module cache and fake external services.
function loadModules({ events = [], upstreamError = false, limited = false } = {}) {
  const cache = new Map();
  const calls = [];
  class FakeOpenAI {
    responses = { create: async (body) => { calls.push(body); if (upstreamError) throw new Error('upstream'); return (async function* () { for (const event of events) yield event; })(); } };
  }
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} }; cache.set(file, loadedModule);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    const localRequire = (id) => {
      if (id === 'openai') return FakeOpenAI;
      if (id === '@/lib/pip-memory') return { loadVisitorMemory: async () => null, rememberQuestion: async () => {} };
      if (id === '@/lib/buddy-limit') return { limitBuddyRequests: async () => { if (limited) { const { BuddyRequestError } = load(path.resolve('src/lib/buddy-request.ts')); throw new BuddyRequestError('Chat limit reached.', 429); } } };
      if (id.startsWith('@/') || id.startsWith('.')) {
        const target = id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(file), id);
        return load(target + '.ts');
      }
      return require(id);
    };
    new Function('require', 'module', 'exports', source)(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return { load: (file) => load(path.resolve(file)), calls };
}
function request(body, headers = {}) { return new Request('https://portfolio.test/api/buddy', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }); }
const question = { question: 'Tell me about MCP', path: '/', history: [] };

test('validates bounded JSON, same-origin and questions', async () => {
  const { readBuddyRequest } = loadModules().load('src/lib/buddy-request.ts');
  await assert.rejects(readBuddyRequest(request(question, { origin: 'https://elsewhere.test' })), { status: 403 });
  await assert.rejects(readBuddyRequest(request({ question: '' })), { status: 400 });
  await assert.rejects(readBuddyRequest(request({ question: 'x'.repeat(601) })), { status: 400 });
  await assert.rejects(readBuddyRequest(request({ question: 'x', extra: 'x'.repeat(17000) })), { status: 413 });
  const parsed = await readBuddyRequest(request({ ...question, path: '//evil.test', history: [{ question: 'a', text: 'b' }, null] }));
  assert.equal(parsed.path, '/'); assert.equal(parsed.history.length, 1);
});
test('context is conditional and only includes trusted public sources', () => {
  const { buildBuddyContext } = loadModules().load('src/lib/buddy-context.ts');
  const blog = JSON.parse(buildBuddyContext('/blog/one-tool-layer-two-agents', 'What sharing actually means', '', 'Explain this'));
  assert.equal(blog.currentPage.article.slug, 'one-tool-layer-two-agents');
  assert.ok(blog.currentPage.article.sections.length > 3);
  const home = JSON.parse(buildBuddyContext('/', 'Work', 'blitzit', 'hello'));
  assert.equal(home.currentPage.project, 'Blitzit'); assert.equal(home.currentPage.article, undefined);
  assert.equal(home.projects.length, 6);
});
test('placeholder key returns an honest local fallback without API calls', async () => {
  process.env.OPENAI_API_KEY = 'sk-proj....';
  const { load, calls } = loadModules();
  const response = await load('src/app/api/buddy/route.ts').POST(request(question));
  const result = await response.json(); assert.equal(result.mode, 'local'); assert.match(result.notice, /isn’t connected/); assert.equal(calls.length, 0);
});
test('streams GPT output without em dashes and sends bounded history', async () => {
  process.env.OPENAI_API_KEY = 'test-key-not-real-'.repeat(4);
  const { load, calls } = loadModules({ events: [{ type: 'response.output_text.delta', delta: 'Hi\u2014there' }, { type: 'response.completed' }] });
  const response = await load('src/app/api/buddy/route.ts').POST(request({ ...question, history: [{ question: 'Previous question', text: 'Previous answer' }] }));
  const events = (await response.text()).trim().split('\n').map(JSON.parse);
  assert.equal(events[1].text, 'Hi, there'); assert.equal(events.at(-1).type, 'done');
  assert.equal(calls[0].store, false); assert.equal(calls[0].model, 'gpt-5-nano'); assert.equal(calls[0].input.length, 4);
});
test('provider failure falls back and does not disclose provider errors', async () => {
  const { load } = loadModules({ upstreamError: true });
  const result = await (await load('src/app/api/buddy/route.ts').POST(request(question))).json();
  assert.equal(result.mode, 'local'); assert.ok(result.text); assert.doesNotMatch(JSON.stringify(result), /test-key|upstream/);
});
test('interrupted stream delivers replacement local answer', async () => {
  const { load } = loadModules({ events: [{ type: 'response.output_text.delta', delta: 'Partial' }, { type: 'response.incomplete' }] });
  const events = (await (await load('src/app/api/buddy/route.ts').POST(request(question))).text()).trim().split('\n').map(JSON.parse);
  assert.equal(events.at(-1).type, 'fallback'); assert.ok(events.at(-1).text);
});
test('rate limited requests never reach OpenAI', async () => {
  const { load, calls } = loadModules({ limited: true });
  const response = await load('src/app/api/buddy/route.ts').POST(request(question));
  assert.equal(response.status, 429); assert.equal(calls.length, 0); assert.equal((await response.json()).mode, 'local');
});

test('activity validation rejects unsafe keys, bounds times and filters event kinds', () => {
  const { sanitizeSnapshot } = loadModules().load('src/lib/pip-behavior.ts');
  const id = '12345678-1234-1234-1234-123456789012';
  assert.equal(sanitizeSnapshot({ session: 'bad', pageId: id, path: '/' }), null);
  const result = sanitizeSnapshot({ session: id, pageId: id, path: '/', activeSeconds: 1e10, progress: 1000, sections: { 'bad.key': 10, work: 15, constructor: 55 }, events: [{ at: Date.now(), kind: 'password', target: 'secret' }, { at: Date.now(), kind: 'project', target: 'blitzit' }] });
  assert.equal(result.activeSeconds, 14400); assert.equal(result.progress, 100);
  assert.deepEqual(result.sections, { work: 15 }); assert.equal(result.events.length, 1);
});
test('funnel represents actual actions and redacts obvious secrets', () => {
  const { funnelStage, redactQuestion } = loadModules().load('src/lib/pip-behavior.ts');
  assert.equal(funnelStage([{ path: '/', activeSeconds: 15, events: [{ kind: 'project', target: 'blitzit' }] }]), 'viewing_work');
  assert.equal(funnelStage([{ path: '/', activeSeconds: 15, events: [{ kind: 'contact', target: 'contact' }] }]), 'contact_clicked');
  assert.equal(funnelStage([{ path: '/blog/example', activeSeconds: 25, events: [] }]), 'exploring_details');
  assert.doesNotMatch(redactQuestion('My key sk-test123 and email person@example.com'), /sk-test|person@example/);
});
test('signed visitor cookies cannot be forged or borrowed from an arbitrary id', () => {
  const { visitorIdentity } = loadModules().load('src/lib/pip-memory.ts');
  const fresh = visitorIdentity(new Request('https://portfolio.test/'), true);
  const valid = visitorIdentity(new Request('https://portfolio.test/', { headers: { cookie: fresh.cookie.split(';')[0] } }));
  assert.equal(valid.id, fresh.id);
  assert.match(fresh.cookie, /HttpOnly/); assert.match(fresh.cookie, /Secure/);
  const forged = fresh.cookie.split(';')[0].replace(/.$/, (c) => c === 'a' ? 'b' : 'a');
  assert.equal(visitorIdentity(new Request('https://portfolio.test/', { headers: { cookie: forged } })), null);
});

test('local reactions are immediate, bounded, and independent of AI quotas', () => {
  const { createReactionGate, reactionFor } = loadModules().load('src/lib/pip-reactions.ts');
  const gate = createReactionGate();
  assert.equal(gate.allow('spyll', 0), true);
  assert.equal(gate.allow('work', 1000), false);
  assert.equal(gate.allow('details', 1500, true), true);
  assert.equal(gate.allow('spyll', 8000), false);
  for (let i = 0; i < 12; i++) assert.equal(gate.allow(`section-${i}`, 15000 + i * 13000), true);
  gate.dismiss(180000);
  assert.equal(gate.allow('resume', 181000, true), false);
  assert.equal(gate.allow('resume', 201000, true), true);
  assert.match(reactionFor('spyll').text, /campus/);
  assert.equal(reactionFor('details').mode, 'reaction');
  assert.equal(reactionFor('unknown'), null);
});


test('illustrative tool flow cannot commit without permission or undo an unchanged task', () => {
 const { advanceTrace } = loadModules().load('src/lib/system-walkthrough.ts');
 assert.equal(advanceTrace('ready','commit'), 'ready');
 assert.equal(advanceTrace('ready','undo'), 'ready');
 const blocked = ['run','deny','commit'].reduce(advanceTrace,'ready');
 assert.equal(blocked,'blocked');
 const committed = ['run','allow','commit'].reduce(advanceTrace,'ready');
 assert.equal(committed,'committed');
 assert.equal(advanceTrace(committed,'undo'),'undone');
 assert.equal(['run','allow','commit'].reduce(advanceTrace,'undone'),'committed');
});


test('responsive decks expose tall card footers before pinning and animate within the viewport', () => {
  const { deckPinTop, deckProgress } = loadModules().load('src/lib/project-deck.ts');
  assert.equal(deckPinTop(900, 610, 0), 88);
  assert.equal(deckPinTop(900, 610, 2), 116);
  for (const [viewport, card] of [[844, 1100], [600, 950], [1024, 1100]]) {
    const top = deckPinTop(viewport, card, 0);
    assert.equal(top + card, viewport - 24);
    assert.ok(top < 0);
    assert.equal(deckProgress(viewport, viewport, top), 0);
    assert.ok(deckProgress(viewport, viewport * .4, top) > 0);
    assert.equal(deckProgress(viewport, 88, top), 1);
    assert.equal(deckProgress(viewport, -1000, top), 1);
  }
});
