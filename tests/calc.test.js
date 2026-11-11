// Run: node tests/calc.test.js
'use strict';
const assert = require('assert');
const D = require('../js/data.js');
const G = require('../js/calc.js');
const I18N = require('../js/i18n.js');
const fs = require('fs');
const path = require('path');

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('ok', name); };
const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);

test('every material has a valid range and a group', () => {
  const groups = new Set(D.GROUPS.map((g) => g[0]));
  const ids = new Set();
  D.MATERIALS.forEach((m) => {
    assert.ok(m.eMin < m.eMax, m.id);
    assert.ok(m.eMin >= -1.7 && m.eMax <= 0.35, m.id);
    assert.ok(groups.has(m.group), m.id);
    assert.ok(!ids.has(m.id), 'duplicate ' + m.id);
    ids.add(m.id);
  });
});

test('active stainless entries are more negative than passive ones', () => {
  ['ss316', 'ss304'].forEach((s) => assert.ok(D.BY_ID[s + 'a'].mid < D.BY_ID[s + 'p'].mid));
});

test('ΔE, anode and band for stainless 316 / aluminium', () => {
  const r = G.couple('ss316p', 'aluminium');
  assert.strictEqual(r.anode.id, 'aluminium');
  assert.strictEqual(r.cathode.id, 'ss316p');
  near(r.dE, -0.05 - -0.875, 0.001);
  near(r.dEmin, -0.10 - -0.76, 1e-9);
  near(r.dEmax, 0.00 - -0.99, 1e-9);
  assert.strictEqual(r.overlap, false);
});

test('order of A and B does not change the result', () => {
  D.MATERIALS.forEach((a) => D.MATERIALS.forEach((b) => {
    const x = G.assess(a.id, b.id, 'normal', 'similar'), y = G.assess(b.id, a.id, 'normal', 'similar');
    near(x.dE, y.dE);
    assert.strictEqual(x.level, y.level);
  }));
});

test('same material: zero ΔE and low risk', () => {
  const r = G.assess('copper', 'copper', 'harsh', 'unfavourable');
  assert.strictEqual(r.dE, 0);
  assert.strictEqual(r.level, 0);
});

test('environment limits 0.15 / 0.25 / 0.50 V', () => {
  assert.deepStrictEqual(D.ENVIRONMENTS.map((e) => e.limit), [0.15, 0.25, 0.50]);
  assert.strictEqual(G.levelFor(0.15, [0.15, 0.25, 0.5]), 0);
  assert.strictEqual(G.levelFor(0.16, [0.15, 0.25, 0.5]), 1);
  assert.strictEqual(G.levelFor(0.40, [0.15, 0.25, 0.5]), 2);
  assert.strictEqual(G.levelFor(0.80, [0.15, 0.25, 0.5]), 3);
});

test('milder environment never raises the risk', () => {
  D.MATERIALS.forEach((a) => D.MATERIALS.forEach((b) => {
    const h = G.assess(a.id, b.id, 'harsh', 'similar').level;
    const nn = G.assess(a.id, b.id, 'normal', 'similar').level;
    const c = G.assess(a.id, b.id, 'controlled', 'similar').level;
    assert.ok(h >= nn && nn >= c, `${a.id}/${b.id}`);
  }));
});

test('area ratio shifts the level by one, within 0…3', () => {
  const s = G.assess('steel', 'cuni9010', 'harsh', 'similar');
  const u = G.assess('steel', 'cuni9010', 'harsh', 'unfavourable');
  const f = G.assess('steel', 'cuni9010', 'harsh', 'favourable');
  assert.strictEqual(u.level, Math.min(3, s.level + 1));
  assert.strictEqual(f.level, Math.max(0, s.level - 1));
  assert.strictEqual(G.assess('magnesium', 'graphite', 'harsh', 'unfavourable').level, 3);
});

test('known couples', () => {
  assert.strictEqual(G.assess('aluminium', 'graphite', 'harsh', 'unfavourable').levelObj.id, 'severe');
  assert.strictEqual(G.assess('ss304p', 'ss316p', 'normal', 'similar').levelObj.id, 'low');
  assert.strictEqual(G.assess('titanium', 'graphite', 'harsh', 'similar').levelObj.id, 'low'); // inert anode
  assert.strictEqual(G.assess('copper', 'zinc', 'normal', 'similar').levelObj.id, 'high');
  assert.strictEqual(G.assess('copper', 'tin', 'controlled', 'similar').levelObj.id, 'low');
});

test('passive stainless warns about the active state', () => {
  const r = G.assess('ss316p', 'aluminium', 'harsh', 'similar');
  assert.ok(r.notes.some((x) => /active/.test(x.text)));
});

test('every preset references valid data', () => {
  D.PRESETS.forEach((p) => {
    assert.ok(D.BY_ID[p.a] && D.BY_ID[p.b], p.name);
    const r = G.assess(p.a, p.b, p.env, p.area);
    assert.strictEqual(r.env.id, p.env);
    assert.strictEqual(r.area.id, p.area);
  });
});

test('matrix is square and symmetric', () => {
  const m = G.matrix('harsh', 'similar');
  assert.strictEqual(m.length, D.MATERIALS.length);
  m.forEach((row, i) => row.forEach((v, j) => assert.strictEqual(v, m[j][i])));
});

test('English keys are unique', () => {
  const seen = new Set();
  I18N.keys().forEach((k) => { assert.ok(!seen.has(k), 'duplicate key: ' + k); seen.add(k); });
});

test('every row has all five languages, with the same placeholders', () => {
  I18N.rows().forEach((r) => {
    assert.strictEqual(r.length, 5, r[0]);
    const ph = (x) => (x.match(/\{\w+\}/g) || []).sort().join();
    r.forEach((x) => { assert.ok(x && x.trim(), r[0]); assert.strictEqual(ph(x), ph(r[0]), r[0]); });
  });
});

test('all data, note and advice texts are translated', () => {
  const d = I18N.dict();
  const need = new Set();
  D.GROUPS.forEach((g) => need.add(g[1]));
  D.MATERIALS.forEach((m) => { need.add(m.name); need.add(m.note); });
  D.ENVIRONMENTS.forEach((e) => [e.short, e.name, e.desc, e.iso].forEach((x) => need.add(x)));
  D.AREAS.forEach((a) => { need.add(a.name); need.add(a.desc); });
  D.LEVELS.forEach((l) => { need.add(l.name); need.add(l.text); need.add(l.name + ' risk'); });
  D.PRESETS.forEach((p) => need.add(p.name));
  // every note / advice the calculator can produce
  D.MATERIALS.forEach((a) => D.MATERIALS.forEach((b) => D.ENVIRONMENTS.forEach((e) => D.AREAS.forEach((ar) => {
    const r = G.assess(a.id, b.id, e.id, ar.id);
    r.notes.forEach((x) => need.add(x.text));
    r.advice.forEach((x) => need.add(x.text));
  }))));
  ['de', 'nl', 'tr', 'es'].forEach((l) => need.forEach((k) => assert.ok(d[l][k] !== undefined, `${l}: ${k}`)));
});

test('every t(\'…\') literal in app.js has a translation', () => {
  const src = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  const d = I18N.dict().de;
  const re = /\bt\('((?:[^'\\]|\\.)*)'/g;
  let m, count = 0;
  while ((m = re.exec(src))) { count++; assert.ok(d[m[1].replace(/\\'/g, "'")] !== undefined, 'missing: ' + m[1]); }
  assert.ok(count > 20);
});

test('long text blocks exist in every language', () => {
  const h = I18N.html();
  ['about', 'help', 'theory', 'refs'].forEach((k) => Object.keys(I18N.LANGS).forEach((l) => assert.ok(h[k][l] && h[k][l].length > 200, k + ' ' + l)));
});

console.log(`\n${n} tests passed`);
