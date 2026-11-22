/*
 * User interface: material pickers, environment, results, galvanic series
 * chart, risk meter, compatibility matrix, sharing, theme and dialogs.
 */
(function () {
  'use strict';
  const D = window.GALV_DATA, G = window.GALV;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const t = (text, params) => I18N.t(text, params);
  const num = (x, d = 2) => Number(x).toLocaleString(I18N.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const V = (x, d = 2) => (x >= 0 ? '+' : '−') + num(Math.abs(x), d) + ' V'; // signed potential
  const dV = (x, d = 2) => num(x, d) + ' V'; // potential difference
  const tf = (text, params) => { // template from calc.js: format numbers, translate names
    const p = {};
    for (const k in params) p[k] = typeof params[k] === 'number' ? (k[0] === 'e' ? V(params[k]) : dV(params[k])) : params[k];
    return t(text, p);
  };
  const lvlName = (i) => t(D.LEVELS[i].name);
  const riskName = (i) => t(D.LEVELS[i].name + ' risk');
  const envShort = (e) => t(e.short);
  const SORTED = [...D.MATERIALS].sort((p, q) => q.mid - p.mid); // noble first
  const LEVEL_CLS = D.LEVELS.map((l) => l.cls);

  const DEFAULT = { a: 'ss316p', b: 'aluminium', env: 'harsh', area: 'similar' };
  const state = { ...DEFAULT };

  // ---------- state <-> URL ----------
  function readUrl() {
    const q = new URLSearchParams(location.search);
    if (D.BY_ID[q.get('a')]) state.a = q.get('a');
    if (D.BY_ID[q.get('b')]) state.b = q.get('b');
    if (D.ENVIRONMENTS.some((e) => e.id === q.get('env'))) state.env = q.get('env');
    if (D.AREAS.some((e) => e.id === q.get('area'))) state.area = q.get('area');
  }
  function shareUrl() {
    const q = new URLSearchParams(state);
    return location.origin + location.pathname + '?' + q.toString() + location.hash.replace(/#(about|help)$/, '');
  }

  // ---------- inputs ----------
  function fillMaterials(sel) {
    sel.innerHTML = D.GROUPS.map(([g, label]) => {
      const opts = SORTED.filter((m) => m.group === g)
        .map((m) => `<option value="${m.id}">${esc(t(m.name))}  (${V(m.mid)})</option>`).join('');
      return opts ? `<optgroup label="${esc(t(label))}">${opts}</optgroup>` : '';
    }).join('');
  }

  function syncInputs() {
    $('#mat-a').value = state.a;
    $('#mat-b').value = state.b;
    $('#area').value = state.area;
    $$('#env-picker button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.env === state.env)));
  }

  function matHint(m) {
    return esc(t('{lo} to {hi} vs SCE.', { lo: V(m.eMin), hi: V(m.eMax) }) + ' ' + t(m.note));
  }

  // ---------- render ----------
  function render() {
    const r = G.assess(state.a, state.b, state.env, state.area);
    const cls = r.levelObj.cls;

    $('#hint-a').innerHTML = matHint(r.a);
    $('#hint-b').innerHTML = matHint(r.b);
    $('#env-hint').textContent = t('{desc} ({iso}). Limit ΔE ≤ {v}.', { desc: t(r.env.desc), iso: t(r.env.iso), v: dV(r.env.limit) });
    $('#area-hint').textContent = t(r.area.desc);

    // Hero
    const hero = $('#hero');
    LEVEL_CLS.forEach((c) => hero.classList.remove(c));
    hero.classList.add(cls);
    $('#hero-value').textContent = dV(r.dE);
    $('#hero-sub').textContent = r.same ? t('Same material') : t('Band {lo} – {hi} from the potential ranges · flowing seawater, vs SCE', { lo: dV(r.dEmin), hi: dV(r.dEmax) });
    $('#hero-side').innerHTML = r.same
      ? `<div><dt>${esc(t('Couple'))}</dt><dd>${esc(t(r.a.name))}</dd></div><div><dt>${esc(t('Limit'))}</dt><dd>${dV(r.env.limit)}</dd></div>`
      : `<div class="role-a"><dt>${esc(t(r.inertAnode ? 'Anode (more negative)' : 'Anode (corrodes)'))}</dt><dd>${esc(t(r.anode.name))}${r.inertAnode ? ` <small>${esc(t('(passive, not attacked)'))}</small>` : ''}</dd></div>
         <div class="role-c"><dt>${esc(t('Cathode (protected)'))}</dt><dd>${esc(t(r.cathode.name))}</dd></div>
         <div><dt>${esc(t('Limit for environment'))}</dt><dd>${dV(r.env.limit)}</dd></div>
         <div><dt>${esc(t('Margin'))}</dt><dd>${esc(r.margin >= 0 ? t('{v} below', { v: dV(r.margin) }) : t('{v} over', { v: dV(-r.margin) }))}</dd></div>`;
    $('#status-chip').textContent = riskName(r.level);

    renderMeter(r);
    renderIssues(r);
    renderSeries(r);
    renderMetrics(r);
    $('#advice').innerHTML = r.advice.map((a) => `<li>${esc(tf(a.text, a.params))}</li>`).join('');
    $('#advice-card').hidden = !r.advice.length;
    renderMatrix(r);
    renderMatTable(r);
    renderLegend(r);
  }

  function renderMeter(r) {
    const s = r.env.steps;
    const max = Math.max(1.0, Math.ceil((r.dEmax + 0.05) * 4) / 4);
    const W = 480, x0 = 16, x1 = W - 16, y = 34, h = 22;
    const X = (v) => x0 + (Math.min(v, max) / max) * (x1 - x0);
    const segs = [[0, s[0], 'low'], [s[0], s[1], 'moderate'], [s[1], s[2], 'high'], [s[2], max, 'severe']];
    let svg = `<svg viewBox="0 0 ${W} 84" role="img" aria-label="${esc(t('Risk meter'))}: ΔE ${dV(r.dE)}, ${esc(riskName(r.level))}">`;
    segs.forEach(([a, b, c], i) => {
      const xa = X(a), xb = X(b);
      const rx = i === 0 || i === 3 ? 6 : 0;
      svg += `<rect class="seg-${c}" x="${xa}" y="${y}" width="${Math.max(0, xb - xa)}" height="${h}" ${rx ? `rx="${rx}"` : ''}/>`;
      if (xb - xa > 50) svg += `<text class="seg-label" x="${(xa + xb) / 2}" y="${y + 15}" text-anchor="middle">${esc(lvlName(i))}</text>`;
    });
    // square inner corners of the end segments
    svg += `<rect class="seg-low" x="${X(s[0]) - 6}" y="${y}" width="6" height="${h}"/><rect class="seg-severe" x="${X(s[2])}" y="${y}" width="6" height="${h}"/>`;
    [0, ...s, max].forEach((v) => { svg += `<text class="tick" x="${X(v)}" y="${y + h + 16}" text-anchor="middle">${num(v)}</text>`; });
    if (!r.same) svg += `<rect class="band" x="${X(r.dEmin)}" y="${y - 4}" width="${Math.max(2, X(r.dEmax) - X(r.dEmin))}" height="${h + 8}" rx="3"/>`;
    const mx = X(r.dE);
    svg += `<path class="marker" d="M${mx - 7} ${y - 14}h14l-7 11z"/><rect class="marker" x="${mx - 1}" y="${y - 4}" width="2" height="${h + 8}"/>`;
    const anchor = mx < 60 ? 'start' : mx > W - 60 ? 'end' : 'middle';
    svg += `<text class="marker-text" x="${mx}" y="${y - 18}" text-anchor="${anchor}">ΔE ${dV(r.dE)}</text>`;
    svg += `</svg>`;
    const m = $('#meter');
    m.className = 'meter';
    m.innerHTML = svg;
    $('#env-badge').textContent = t('{env} · limit {v}', { env: envShort(r.env), v: dV(r.env.limit) });
    const el = $('#risk-text');
    LEVEL_CLS.forEach((c) => el.classList.remove(c));
    el.classList.add(r.levelObj.cls);
    let shift = '';
    if (r.level !== r.base) {
      shift = ' ' + t(r.inertAnode ? '(ΔE alone: {level}; the anode is passive)' : '(ΔE alone: {level}; adjusted for the area ratio)', { level: lvlName(r.base) });
    }
    el.innerHTML = `<b>${esc(riskName(r.level))}</b>${esc(shift)}. ${esc(t(r.levelObj.text))}`;
  }

  function renderIssues(r) {
    const box = $('#issues');
    box.hidden = !r.notes.length;
    const tag = { warn: 'Note', info: 'Info' };
    box.innerHTML = r.notes.map((n) => `<div class="issue ${n.type}"><span class="tag">${esc(t(tag[n.type]))}</span><span>${esc(tf(n.text, n.params))}</span></div>`).join('');
  }

  function renderSeries(r) {
    const W = 620, L = 252, R = 14, top = 30, rowH = 18;
    const lo = -1.7, hi = 0.35;
    const X = (v) => L + ((v - lo) / (hi - lo)) * (W - L - R);
    const H = top + SORTED.length * rowH + 50;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('Galvanic series chart'))}">`;
    for (let v = -1.6; v <= 0.31; v += 0.2) {
      const x = X(v);
      svg += `<line class="grid" x1="${x}" y1="${top - 6}" x2="${x}" y2="${top + SORTED.length * rowH}"/>`;
      svg += `<text class="tick" x="${x}" y="${top - 10}" text-anchor="middle">${(v < -0.001 ? '−' : '') + num(Math.abs(v), 1)}</text>`;
    }
    svg += `<line class="zero" x1="${X(0)}" y1="${top - 6}" x2="${X(0)}" y2="${top + SORTED.length * rowH}"/>`;
    svg += `<text class="end-label" x="${X(hi)}" y="${top + SORTED.length * rowH + 16}" text-anchor="end">${esc(t('NOBLE / CATHODIC →'))}</text>`;
    svg += `<text class="end-label" x="${X(lo)}" y="${top + SORTED.length * rowH + 16}">${esc(t('← ACTIVE / ANODIC'))}</text>`;
    SORTED.forEach((m, i) => {
      const y = top + i * rowH;
      const role = r.same ? (m.id === r.a.id ? 'anode' : '') : m.id === r.anode.id ? 'anode' : m.id === r.cathode.id ? 'cathode' : '';
      svg += `<g class="row ${role}" data-id="${m.id}"><title>${esc(t(m.name))}: ${esc(t('{lo} to {hi} vs SCE.', { lo: V(m.eMin), hi: V(m.eMax) }))}</title>`;
      svg += `<rect class="bg" x="0" y="${y}" width="${W}" height="${rowH}"/>`;
      svg += `<text class="name" x="${L - 8}" y="${y + 12}" text-anchor="end">${esc(t(m.name))}</text>`;
      const xa = X(m.eMin), xb = X(m.eMax);
      svg += `<rect class="bar" x="${xa}" y="${y + 4}" width="${Math.max(3, xb - xa)}" height="${rowH - 8}" rx="2"/></g>`;
    });
    if (!r.same) {
      const ya = top + SORTED.indexOf(r.anode) * rowH + rowH / 2;
      const yc = top + SORTED.indexOf(r.cathode) * rowH + rowH / 2;
      const yb = top + SORTED.length * rowH + 34;
      const xa = X(r.anode.mid), xc = X(r.cathode.mid);
      svg += `<g class="${r.levelObj.cls}">`;
      svg += `<path class="de" stroke-dasharray="4 3" d="M${xa} ${ya}V${yb}M${xc} ${yc}V${yb}"/>`;
      svg += `<path class="de" d="M${xa} ${yb}H${xc}M${xa + 6} ${yb - 4}L${xa} ${yb}L${xa + 6} ${yb + 4}M${xc - 6} ${yb - 4}L${xc} ${yb}L${xc - 6} ${yb + 4}"/>`;
      const tx = (xa + xc) / 2;
      svg += `<text class="de-text" x="${tx}" y="${yb + 14}" text-anchor="middle">ΔE = ${dV(r.dE)}</text></g>`;
    }
    svg += `<text class="axis-title" x="${L - 8}" y="${top - 10}" text-anchor="end">${esc(t('E vs SCE (V)'))}</text>`;
    svg += `</svg>`;
    const el = $('#series');
    el.innerHTML = svg;
    $$('.row', el).forEach((g) => g.addEventListener('click', (e) => {
      if (e.shiftKey) state.a = g.dataset.id; else state.b = g.dataset.id;
      update();
    }));
  }

  function renderMetrics(r) {
    // k is trusted markup (dictionary keys with <sub>); v and s are escaped
    const m = (k, v, s = '', c = '') => `<div class="metric ${c}"><div class="k">${t(k)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`;
    const lvlCls = r.level >= 2 ? 'error' : r.level === 1 ? 'warn' : '';
    $('#metrics').innerHTML = [
      m('E<sub>corr</sub> material A', V(r.a.mid), t('range {lo} … {hi}', { lo: V(r.a.eMin), hi: V(r.a.eMax) })),
      m('E<sub>corr</sub> material B', V(r.b.mid), t('range {lo} … {hi}', { lo: V(r.b.eMin), hi: V(r.b.eMax) })),
      m('ΔE (mid values)', dV(r.dE, 3), t('cathode − anode'), lvlCls),
      m('ΔE band', `${dV(r.dEmin)} – ${dV(r.dEmax)}`, t(r.overlap ? 'ranges overlap' : 'from range extremes')),
      m('Allowable ΔE', dV(r.env.limit), t('{env} environment', { env: envShort(r.env) })),
      m('ΔE / limit', num(r.dE / r.env.limit), t(r.dE <= r.env.limit ? 'within limit' : 'over limit'), r.dE > r.env.limit ? lvlCls || 'warn' : ''),
      m('Area ratio A<sub>c</sub> / A<sub>a</sub>', r.area.factor.replace('0.1', num(0.1, 1)), t(r.area.shift > 0 ? 'raises risk one level' : r.area.shift < 0 ? 'lowers risk one level' : 'no adjustment')),
      m('Risk level', lvlName(r.level), t(r.levelObj.text), lvlCls),
    ].join('');
  }

  function renderMatrix(r) {
    const mat = G.matrix(state.env, state.area);
    const idx = Object.fromEntries(D.MATERIALS.map((m, i) => [m.id, i]));
    const ia = r.a.id, ib = r.b.id;
    let html = '<table class="matrix"><thead><tr><th></th>';
    SORTED.forEach((m) => { html += `<th scope="col" class="${m.id === ib ? 'sel' : ''}">${esc(t(m.name))}</th>`; });
    html += '</tr></thead><tbody>';
    SORTED.forEach((row) => {
      html += `<tr class="${row.id === ia ? 'sel' : ''}"><th scope="row">${esc(t(row.name))}</th>`;
      SORTED.forEach((col) => {
        const lv = mat[idx[row.id]][idx[col.id]];
        const c = G.couple(row.id, col.id);
        const sel = row.id === ia && col.id === ib ? ' sel' : '';
        html += `<td class="${LEVEL_CLS[lv]}${sel}" data-a="${row.id}" data-b="${col.id}" title="${esc(t('{a} + {b}: ΔE {v}, {level}', { a: row.name, b: col.name, v: dV(c.dE), level: lvlName(lv) }))}"></td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    const el = $('#matrix');
    el.innerHTML = html;
    $('#matrix-note').innerHTML = t('Risk level of every couple for the <b>{env}</b> environment and the selected area ratio. Rows are material A, columns material B. Click a cell to load the couple.', { env: esc(envShort(r.env)) });
    $$('td', el).forEach((td) => td.addEventListener('click', () => { state.a = td.dataset.a; state.b = td.dataset.b; update(); }));
  }

  function renderMatTable(r) {
    const th = (k, c = '') => `<th${c ? ` class="${c}"` : ''}>${esc(t(k))}</th>`;
    let html = `<table class="data"><thead><tr>${th('Material')}${th('E min')}${th('E max')}${th('Mid')}${th('ΔE to A')}${th('Notes', 'left')}</tr></thead><tbody>`;
    SORTED.forEach((m) => {
      const hl = m.id === r.a.id || m.id === r.b.id ? ' hl' : '';
      const d = Math.abs(m.mid - r.a.mid);
      html += `<tr class="click${hl}" data-id="${m.id}"><td class="strong">${esc(t(m.name))}</td><td>${V(m.eMin)}</td><td>${V(m.eMax)}</td><td>${V(m.mid)}</td><td>${dV(d)}</td><td class="wrap">${esc(t(m.note))}</td></tr>`;
    });
    html += '</tbody></table>';
    const el = $('#mat-table');
    el.innerHTML = html;
    $$('tr.click', el).forEach((tr) => tr.addEventListener('click', () => { state.b = tr.dataset.id; update(); toast(t('Material B: {name}', { name: D.BY_ID[tr.dataset.id].name })); }));
  }

  function renderLegend(r) {
    const s = r.env.steps;
    const ranges = [`ΔE ≤ ${dV(s[0])}`, `${num(s[0])} – ${dV(s[1])}`, `${num(s[1])} – ${dV(s[2])}`, `> ${dV(s[2])}`];
    $('#risk-legend').innerHTML = D.LEVELS.map((l, i) =>
      `<li class="${l.cls}"><i></i><b>${esc(lvlName(i))}</b><span>${ranges[i]}</span></li>`).join('');
  }

  // ---------- events ----------
  function update() {
    syncInputs();
    render();
    history.replaceState(null, '', shareUrl());
  }

  function fillOptions() {
    fillMaterials($('#mat-a'));
    fillMaterials($('#mat-b'));
    $('#area').innerHTML = D.AREAS.map((a) => `<option value="${a.id}">${esc(t(a.name))}</option>`).join('');
    $('#preset').innerHTML = `<option value="">${esc(t('Load application example…'))}</option>` +
      D.PRESETS.map((p, i) => `<option value="${i}">${esc(t(p.name))}</option>`).join('');
  }

  function init() {
    I18N.init();
    fillOptions();
    readUrl();

    const langSel = $('#lang');
    for (const [k, v] of Object.entries(I18N.LANGS)) langSel.appendChild(new Option(v.name, k));
    langSel.value = I18N.lang;
    langSel.addEventListener('change', () => {
      if (I18N.goToLang(langSel.value)) return;
      I18N.setLang(langSel.value); fillOptions(); syncInputs(); render();
    });

    $('#mat-a').addEventListener('change', (e) => { state.a = e.target.value; update(); });
    $('#mat-b').addEventListener('change', (e) => { state.b = e.target.value; update(); });
    $('#area').addEventListener('change', (e) => { state.area = e.target.value; update(); });
    $('#swap').addEventListener('click', () => { [state.a, state.b] = [state.b, state.a]; update(); });
    $$('#env-picker button').forEach((b) => b.addEventListener('click', () => { state.env = b.dataset.env; update(); }));
    $('#preset').addEventListener('change', (e) => {
      const p = D.PRESETS[e.target.value];
      if (!p) return;
      Object.assign(state, { a: p.a, b: p.b, env: p.env, area: p.area });
      update();
      toast(t('Loaded example: {name}', { name: p.name }));
      e.target.value = '';
    });

    // tooltips: click / tap shows the title as a toast (touch screens)
    document.addEventListener('click', (e) => {
      const tip = e.target.closest('.tip');
      if (tip) { e.preventDefault(); toast(tip.getAttribute('title')); }
    });

    const dialog = (id, openBtns) => {
      const d = $('#' + id);
      const open = (e) => { if (e) e.preventDefault(); if (!d.open) d.showModal(); };
      openBtns.forEach((b) => $(b).addEventListener('click', open));
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
      d.addEventListener('close', () => { if (location.hash === '#' + id) history.replaceState(null, '', location.pathname + location.search); });
      window.addEventListener('hashchange', () => { if (location.hash === '#' + id) open(); });
      if (location.hash === '#' + id) open();
    };
    dialog('about', ['#about-open', '#about-link']);
    dialog('help', ['#help-open']);

    $('#share').addEventListener('click', async () => {
      const url = shareUrl();
      history.replaceState(null, '', url);
      try { await navigator.clipboard.writeText(url); toast(t('Link copied to clipboard')); }
      catch (err) { toast(t('Link updated in the address bar')); }
    });
    $('#print').addEventListener('click', () => window.print());
    $('#theme').addEventListener('click', () => {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ehcrea.theme', next); } catch (e) { /* storage unavailable */ }
    });

    syncInputs();
    render();
  }

  let toastTimer;
  function toast(msg) {
    const box = $('#toast');
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, Math.max(2200, msg.length * 45));
  }

  init();
})();

// Offline support: register the service worker (sw.js, next to the web manifest) so the
// calculator keeps working without a connection and can be installed as an app.
(function () {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  var local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (location.protocol !== 'https:' && !local) return;
  var link = document.querySelector('link[rel="manifest"]');
  var sw = new URL('sw.js', link ? link.href : location.href).href;
  function register() { navigator.serviceWorker.register(sw).catch(function () {}); }
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register);
})();

// "Install app": a toolbar button (where the browser can install directly, e.g. Chrome/Edge)
// and an "Install as an app" section on the About page with an install button or, where the
// browser has no install prompt (Safari, Firefox), short instructions. Texts in EN/DE/NL/TR/ES.
(function () {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  var TEXT = {
    en: { title: 'Install as an app', body: 'This calculator also works offline. Install it as an app to open it in its own window from the Dock, Start menu or home screen, with or without an internet connection. Updates arrive automatically when you are online.', button: 'Install app', installed: 'You are using the installed app.', done: 'Installed. You can now open it from your apps.', mac: 'In Safari on a Mac: choose File › Add to Dock.', ios: 'On iPhone or iPad: tap Share, then Add to Home Screen.', other: 'In Chrome or Edge: click the install icon in the address bar, or open the browser menu and choose Install. In Safari on a Mac: File › Add to Dock. On iPhone or iPad: Share › Add to Home Screen.' },
    de: { title: 'Als App installieren', body: 'Dieser Rechner funktioniert auch offline. Installieren Sie ihn als App, um ihn in einem eigenen Fenster aus dem Dock, dem Startmenü oder vom Startbildschirm zu öffnen, mit oder ohne Internetverbindung. Updates kommen automatisch, sobald Sie online sind.', button: 'App installieren', installed: 'Sie verwenden die installierte App.', done: 'Installiert. Sie können sie jetzt aus Ihren Apps öffnen.', mac: 'In Safari auf dem Mac: Ablage › Zum Dock hinzufügen.', ios: 'Auf iPhone oder iPad: Teilen tippen, dann Zum Home-Bildschirm.', other: 'In Chrome oder Edge: auf das Installationssymbol in der Adressleiste klicken oder im Browsermenü Installieren wählen. In Safari auf dem Mac: Ablage › Zum Dock hinzufügen. Auf iPhone oder iPad: Teilen › Zum Home-Bildschirm.' },
    nl: { title: 'Installeren als app', body: 'Deze calculator werkt ook offline. Installeer hem als app om hem in een eigen venster te openen vanuit het Dock, het Startmenu of het beginscherm, met of zonder internetverbinding. Updates komen automatisch binnen zodra je online bent.', button: 'App installeren', installed: 'Je gebruikt de geïnstalleerde app.', done: 'Geïnstalleerd. Je kunt hem nu openen vanuit je apps.', mac: 'In Safari op een Mac: kies Archief › Voeg toe aan Dock.', ios: 'Op iPhone of iPad: tik op Deel en daarna op Zet op beginscherm.', other: 'In Chrome of Edge: klik op het installatiepictogram in de adresbalk of kies Installeren in het browsermenu. In Safari op een Mac: Archief › Voeg toe aan Dock. Op iPhone of iPad: Deel › Zet op beginscherm.' },
    tr: { title: 'Uygulama olarak yükle', body: 'Bu hesaplayıcı çevrimdışı da çalışır. Dock, Başlat menüsü veya ana ekrandan kendi penceresinde, internet bağlantısı olsun ya da olmasın açmak için uygulama olarak yükleyin. Çevrimiçi olduğunuzda güncellemeler otomatik olarak gelir.', button: 'Uygulamayı yükle', installed: 'Yüklü uygulamayı kullanıyorsunuz.', done: 'Yüklendi. Artık uygulamalarınızdan açabilirsiniz.', mac: 'Mac’te Safari’de: Dosya › Dock’a Ekle.', ios: 'iPhone veya iPad’de: Paylaş’a, ardından Ana Ekrana Ekle’ye dokunun.', other: 'Chrome veya Edge’de: adres çubuğundaki yükleme simgesine tıklayın ya da tarayıcı menüsünden Yükle’yi seçin. Mac’te Safari’de: Dosya › Dock’a Ekle. iPhone veya iPad’de: Paylaş › Ana Ekrana Ekle.' },
    es: { title: 'Instalar como aplicación', body: 'Esta calculadora también funciona sin conexión. Instálala como aplicación para abrirla en su propia ventana desde el Dock, el menú Inicio o la pantalla de inicio, con o sin conexión a internet. Las actualizaciones llegan solas cuando estás en línea.', button: 'Instalar aplicación', installed: 'Estás usando la aplicación instalada.', done: 'Instalada. Ya puedes abrirla desde tus aplicaciones.', mac: 'En Safari en un Mac: Archivo › Añadir al Dock.', ios: 'En iPhone o iPad: toca Compartir y luego Añadir a pantalla de inicio.', other: 'En Chrome o Edge: haz clic en el icono de instalación de la barra de direcciones o elige Instalar en el menú del navegador. En Safari en un Mac: Archivo › Añadir al Dock. En iPhone o iPad: Compartir › Añadir a pantalla de inicio.' }
  };
  var ABOUT_BUTTONS = '#btnAbout, #about-open, #aboutOpen, [data-dialog="about"]';
  var ICON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2v8M4.5 6.8 8 10.3l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var prompt = null, justInstalled = false;

  function lang() { var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase(); return TEXT[l] ? l : 'en'; }
  function tx(k) { return TEXT[lang()][k]; }
  function installed() {
    return justInstalled || window.navigator.standalone === true ||
      (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: window-controls-overlay)').matches));
  }
  function platform() {
    var ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Firefox|OPR/.test(ua)) return 'mac';
    return 'other';
  }
  function install() {
    if (!prompt) return;
    var p = prompt; prompt = null;
    p.prompt();
    (p.userChoice || Promise.resolve({})).then(function (c) { if (c && c.outcome !== 'accepted') prompt = p; render(); });
    render();
  }

  function addStyle() {
    if (document.getElementById('pwa-install-style')) return;
    var s = document.createElement('style');
    s.id = 'pwa-install-style';
    s.textContent =
      '.pwa-install{margin:1rem 0;padding:.85rem 1rem;border:1px solid var(--border, var(--line, #c9ced6));border-radius:var(--radius, 10px)}' +
      '.pwa-install h3{margin:0 0 .4rem;font-size:1rem}.pwa-install p{margin:.35rem 0}' +
      '.pwa-install .pwa-install-cta{display:inline-flex;align-items:center;gap:.45rem;margin-top:.35rem;padding:.5rem .95rem;border:0;border-radius:999px;font:inherit;font-weight:600;cursor:pointer;background:var(--accent);color:var(--accent-ink, var(--bg, #fff))}' +
      '.pwa-install .pwa-install-cta:hover{filter:brightness(1.08)}.pwa-install .pwa-install-cta:focus-visible{outline:2px solid var(--accent);outline-offset:2px}' +
      '.pwa-install-btn{display:inline-flex;align-items:center;gap:.35rem}.pwa-install-btn svg{flex:none}' +
      '@media (max-width:760px){.pwa-install-btn .pwa-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}';
    document.head.appendChild(s);
  }

  function renderToolbar() {
    var btn = document.querySelector('.pwa-install-btn');
    if (!prompt || installed()) { if (btn) btn.remove(); return; }
    var about = document.querySelector(ABOUT_BUTTONS);
    if (!about) return;
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = (about.className + ' pwa-install-btn').trim();
      btn.addEventListener('click', install);
      about.parentNode.insertBefore(btn, about);
    }
    if (btn.dataset.lang !== lang()) {
      btn.dataset.lang = lang();
      btn.innerHTML = ICON + '<span class="pwa-label">' + tx('button') + '</span>';
      btn.title = tx('button');
      btn.setAttribute('aria-label', tx('button'));
    }
  }

  function renderAbout() {
    var anchor = document.querySelector('.about-support');
    if (!anchor) return;
    var state = lang() + '|' + (installed() ? 'installed' : prompt ? 'prompt' : platform());
    var box = anchor.parentNode.querySelector(':scope > .pwa-install');
    if (box && box.dataset.state === state) return;
    if (!box) { box = document.createElement('section'); box.className = 'pwa-install'; anchor.parentNode.insertBefore(box, anchor); }
    box.dataset.state = state;
    var html = '<h3>' + tx('title') + '</h3><p>' + tx('body') + '</p>';
    if (installed()) html += '<p><strong>' + tx(justInstalled ? 'done' : 'installed') + '</strong></p>';
    else if (prompt) html += '<button type="button" class="pwa-install-cta">' + ICON + '<span>' + tx('button') + '</span></button>';
    else html += '<p>' + tx(platform()) + '</p>';
    box.innerHTML = html;
    var cta = box.querySelector('.pwa-install-cta');
    if (cta) cta.addEventListener('click', install);
  }

  var busy = false;
  function render() {
    if (busy) return;
    busy = true;
    try { addStyle(); renderToolbar(); renderAbout(); } finally { busy = false; }
  }

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompt = e; render(); });
  window.addEventListener('appinstalled', function () { prompt = null; justInstalled = true; render(); });
  function start() {
    render();
    // The About content and the page language are re-rendered by the app: keep up with it.
    new MutationObserver(function () { if (!busy) render(); })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['lang'] });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
