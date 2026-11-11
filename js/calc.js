/*
 * Galvanic couple assessment.
 *
 * ΔE is the difference of the mid-range corrosion potentials of the two
 * materials in the galvanic series. The ΔE band (min–max) uses the extremes of
 * the two ranges. The more negative material is the anode (it corrodes faster),
 * the more positive one the cathode (it is protected).
 *
 * The risk level compares ΔE with the allowable potential difference for the
 * environment and is shifted one step by the cathode / anode area ratio.
 */
(function (root) {
  'use strict';
  const D = (typeof module !== 'undefined' && module.exports) ? require('./data.js') : root.GALV_DATA;

  const NEGLIGIBLE = 0.05; // V; below this a couple is treated as the same group
  const r3 = (x) => Math.round(x * 1000) / 1000;

  function levelFor(dE, steps) {
    if (dE <= steps[0]) return 0;
    if (dE <= steps[1]) return 1;
    if (dE <= steps[2]) return 2;
    return 3;
  }

  function couple(aId, bId) {
    const a = D.BY_ID[aId], b = D.BY_ID[bId];
    if (!a || !b) throw new Error('Unknown material: ' + (!a ? aId : bId));
    // Anode = lower mid potential. Ties: keep A as the anode.
    const anode = a.mid <= b.mid ? a : b;
    const cathode = anode === a ? b : a;
    const dE = r3(cathode.mid - anode.mid);
    const dEmin = r3(Math.max(0, cathode.eMin - anode.eMax));
    const dEmax = r3(cathode.eMax - anode.eMin);
    const overlap = a.id !== b.id && cathode.eMin <= anode.eMax;
    return { a, b, anode, cathode, same: a.id === b.id, dE, dEmin, dEmax, overlap };
  }

  function assess(aId, bId, envId, areaId) {
    const c = couple(aId, bId);
    const env = D.ENVIRONMENTS.find((e) => e.id === envId) || D.ENVIRONMENTS[0];
    const area = D.AREAS.find((x) => x.id === areaId) || D.AREAS[1];
    const base = levelFor(c.dE, env.steps);
    let level = base;
    if (c.dE > NEGLIGIBLE) level = Math.max(0, Math.min(3, base + area.shift));
    else level = 0;
    const inertAnode = c.anode.inert && !c.same;
    if (inertAnode) level = 0;
    const margin = r3(env.limit - c.dE);

    // Notes and advice are English templates with {placeholders}; the UI
    // translates them. Parameters: material names (A, C, P, O, X), numbers
    // (e* = signed potential, others = potential difference).
    const notes = [];
    const add = (type, text, params) => notes.push({ type, text, params: params || {} });
    const A = c.anode.name, C = c.cathode.name;

    if (c.same) {
      add('info', 'Both parts are the same material: there is no galvanic couple. Other forms of corrosion (crevice, pitting, uniform) can still occur.');
    } else if (c.dE <= NEGLIGIBLE) {
      add('info', 'ΔE ≤ {neg}: the two materials belong to the same group of the galvanic series and are generally compatible.', { neg: NEGLIGIBLE });
    }

    if (inertAnode) {
      add('info', '{A} is the more negative member but forms a very stable passive film (or does not corrode), so it is not attacked in this couple. The couple is usually acceptable; this is why it is chosen for, e.g., fasteners in CFRP.', { A });
    }

    if (c.overlap) {
      add('warn', 'The potential ranges overlap. Which material becomes the anode can change with temperature, flow, aeration and surface condition; treat the polarity as uncertain.');
    }

    if (base > 0 && area.shift !== 0 && c.dE > NEGLIGIBLE && !inertAnode) {
      if (area.shift > 0) add('warn', 'Small anode, large cathode: the galvanic current of the large {C} surface concentrates on the small {A} surface. The anodic current density scales with Ac / Aa, so the attack is fast and local. Raised one level.', { A, C });
      else add('info', 'Large anode, small cathode: the galvanic current spreads over the large {A} surface, so the attack is slower and more uniform. Lowered one level.', { A });
    }

    // Passive stainless steels can turn active in crevices.
    const passiveMember = [c.a, c.b].find((m) => m.passive && /p$/.test(m.id));
    if (passiveMember && !c.same && env.id !== 'controlled') {
      const activeId = passiveMember.id.replace(/p$/, 'a');
      if (D.BY_ID[activeId]) {
        const other = passiveMember === c.a ? c.b : c.a;
        const alt = couple(activeId, other.id);
        add('warn', '{P} relies on its passive film. Inside crevices, under gaskets or deposits, or in stagnant water it can become active ({eAct}), giving ΔE = {dAct} against {O}, with {X} as the anode.',
          { P: passiveMember.name, eAct: D.BY_ID[activeId].mid, dAct: alt.dE, O: other.name, X: alt.anode.name });
      }
    }
    if (c.anode.passive && /a$/.test(c.anode.id) && !c.same) {
      add('info', '{A} is in the active (film-free) condition: this applies to crevices and low-oxygen water, not to freely exposed, aerated surfaces.', { A });
    }

    if (c.cathode.id === 'graphite' && !c.same) {
      add('warn', 'Carbon fibre (CFRP) is a strong cathode. Isolate metal parts from the fibres with a glass-fibre or film ply, sealant and wet-installed or titanium fasteners.');
    }
    if (['zinc', 'magnesium', 'aluminium'].includes(c.anode.id) && ['steel', 'lowalloy'].includes(c.cathode.id)) {
      add('info', 'This is the principle of sacrificial (galvanic) cathodic protection: {A} corrodes preferentially and protects the steel. Desirable for anodes and galvanizing, but not if {A} is a structural part.', { A });
    }
    if (c.anode.id === 'aluminium' || c.cathode.id === 'aluminium') {
      add('info', 'Aluminium alloys cover a wide range (−0.99 to −0.76 V). Copper-bearing 2xxx / 7xxx alloys are nearer the noble end; 5xxx, 6xxx and clad alloys nearer the active end.');
    }
    if (env.id === 'controlled' && level > 0) {
      add('info', 'Galvanic corrosion needs an electrolyte. In a really dry, condensation-free space the risk is low, but condensation, cleaning fluids or handling contamination can activate the couple.');
    }

    // Recommendations (templates as above)
    const advice = [];
    const tip = (text, params) => advice.push({ text, params: params || {} });
    if (level >= 1) {
      tip('Break the electrical path: non-conductive washers, sleeves and gaskets (e.g. G10/FR4, PTFE, nylon), with the sleeve covering the full bolt shank.');
      tip('Keep the electrolyte out: seal the faying surfaces of the joint and wet-install fasteners with a jointing or barrier compound; avoid water traps and provide drainage.');
      tip('If you paint, coat the cathode ({C}) or both parts. Never coat only the anode: a defect in its coating leaves a tiny anode against a large cathode.', { C });
    }
    if (level >= 2) {
      tip('Prefer a closer pair in the galvanic series, or a fastener material that is slightly more noble than the structure.');
      tip('In immersion service consider cathodic protection (zinc, aluminium or magnesium anodes, or impressed current).');
    }
    if (level === 3) tip('Do not use this couple without full electrical isolation; even then, inspect the joint periodically.');
    if (level === 0 && !c.same) tip('No special measures for galvanic corrosion. Normal good practice still applies: avoid crevices and standing water.');

    return {
      ...c, env, area, base, level, levelObj: D.LEVELS[level], margin, inertAnode,
      notes, advice, negligible: NEGLIGIBLE,
    };
  }

  /** Level for every pair of materials, for the compatibility matrix. */
  function matrix(envId, areaId) {
    return D.MATERIALS.map((a) => D.MATERIALS.map((b) => assess(a.id, b.id, envId, areaId).level));
  }

  const api = { assess, couple, matrix, levelFor, NEGLIGIBLE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GALV = api;
})(typeof window !== 'undefined' ? window : globalThis);
