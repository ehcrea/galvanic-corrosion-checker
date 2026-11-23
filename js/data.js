/*
 * Galvanic series, environments and example couples.
 *
 * Potentials are corrosion (free) potentials in flowing seawater
 * (2.4–4.0 m/s, 10–27 °C) in volts versus the saturated calomel electrode
 * (SCE), read from the galvanic series chart in ASTM G82 (Fig. 1), which
 * reproduces LaQue, "Marine Corrosion: Causes and Prevention" (1975).
 * Each material is given as the range shown on the chart; values are
 * approximate (± 0.01 V reading accuracy).
 *
 * passive: the potential depends on a passive film (stainless steels);
 *          in crevices or low-oxygen water the film can break down and the
 *          alloy moves to its "active" entry.
 * inert:   the material barely corrodes even when it is the anode of a
 *          couple (very stable passive film or a noble/non-metallic
 *          conductor), so being the more negative member is not a risk for
 *          itself; it still drives corrosion of more active partners.
 */
(function (root) {
  'use strict';

  const GROUPS = [
    ['noble', 'Noble & passive alloys'],
    ['stainless', 'Stainless steels'],
    ['nickel', 'Nickel alloys'],
    ['copper', 'Copper alloys'],
    ['other', 'Lead, tin, silver'],
    ['steel', 'Iron & steel'],
    ['light', 'Light metals & coatings'],
  ];

  // [id, name, group, eMin, eMax, flags, note]
  const ROWS = [
    ['graphite', 'Graphite / carbon fibre (CFRP)', 'noble', 0.20, 0.30, { inert: true },
      'Carbon fibre composites are electrically conductive and behave like graphite: a very noble cathode. A major risk for aluminium and steel in contact with CFRP.'],
    ['platinum', 'Platinum', 'noble', 0.19, 0.25, { inert: true }, 'Noble metal; used for electrodes and plating.'],
    ['alloyC', 'Ni-Cr-Mo alloy C-276 (Hastelloy C)', 'nickel', -0.03, 0.08, { inert: true },
      'Highly corrosion-resistant nickel alloy with a very stable passive film.'],
    ['titanium', 'Titanium (CP grades, Ti-6Al-4V)', 'noble', -0.05, 0.06, { inert: true },
      'Stable passive film in seawater; titanium itself is practically immune, but it is an efficient cathode for less noble metals.'],
    ['ss316p', 'Stainless steel 316 / 317 (passive)', 'stainless', -0.10, 0.00, { passive: true },
      'Passive condition, free-flowing aerated water. In crevices or stagnant water use the active entry.'],
    ['alloy400', 'Ni-Cu alloy 400 (Monel)', 'nickel', -0.11, -0.04, {}, 'Nickel-copper alloy, common in seawater pumps, valves and fasteners.'],
    ['ss304p', 'Stainless steel 302 / 304 / 321 / 347 (passive)', 'stainless', -0.10, -0.05, { passive: true },
      'Passive condition. Prone to crevice corrosion in seawater, where it becomes active.'],
    ['silver', 'Silver', 'other', -0.14, -0.09, {}, 'Also representative of silver plating and silver brazing alloys.'],
    ['nickel200', 'Nickel 200 / nickel plating', 'nickel', -0.20, -0.10, {}, 'Commercially pure nickel; also used as an approximation for electrolytic nickel plating.'],
    ['nab', 'Nickel-aluminium bronze', 'copper', -0.25, -0.15, {}, 'Propellers, pump impellers and seawater valves.'],
    ['cuni7030', '70/30 copper-nickel', 'copper', -0.25, -0.18, {}, 'Seawater piping and heat exchanger tubes.'],
    ['lead', 'Lead', 'other', -0.27, -0.19, {}, 'Also representative of lead-rich solders.'],
    ['cuni9010', '90/10 copper-nickel', 'copper', -0.28, -0.21, {}, 'Seawater piping, hull sheathing.'],
    ['sibronze', 'Silicon bronze', 'copper', -0.29, -0.24, {}, 'Marine fasteners and fittings.'],
    ['tinbronze', 'Tin bronze (gunmetal)', 'copper', -0.31, -0.24, {}, 'Cast valve bodies and fittings.'],
    ['admiralty', 'Admiralty / aluminium brass', 'copper', -0.32, -0.27, {}, 'Condenser and heat exchanger tubes.'],
    ['tin', 'Tin / tin plating', 'other', -0.34, -0.31, {}, 'Also representative of tin plating.'],
    ['copper', 'Copper (C110, C122)', 'copper', -0.36, -0.30, {}, 'Pipes, busbars, electrical conductors.'],
    ['brass', 'Yellow / naval brass, manganese bronze', 'copper', -0.40, -0.27, {}, 'High-zinc brasses; can dezincify in seawater.'],
    ['ss316a', 'Stainless steel 316 / 317 (active)', 'stainless', -0.45, -0.35, { passive: true },
      'Active condition: inside crevices, under deposits or in stagnant, low-oxygen water.'],
    ['ss410a', 'Stainless steel 410 / 416 (active)', 'stainless', -0.57, -0.46, { passive: true },
      '13 % Cr martensitic stainless steels in the active condition.'],
    ['ss304a', 'Stainless steel 302 / 304 (active)', 'stainless', -0.58, -0.46, { passive: true },
      'Active condition: inside crevices, under deposits or in stagnant, low-oxygen water.'],
    ['lowalloy', 'Low-alloy steel (e.g. 4140)', 'steel', -0.64, -0.58, {}, 'Low-alloy structural and machinery steels.'],
    ['steel', 'Carbon steel / cast iron', 'steel', -0.72, -0.60, {}, 'Mild steel, structural steel, grey and ductile cast iron.'],
    ['cadmium', 'Cadmium plating', 'light', -0.73, -0.70, {}, 'Legacy aerospace plating; restricted under RoHS / REACH.'],
    ['aluminium', 'Aluminium alloys', 'light', -0.99, -0.76, {},
      'Wide range: copper-bearing 2xxx and 7xxx alloys sit toward the noble end, 1xxx, 5xxx, 6xxx and Alclad toward the active end.'],
    ['zinc', 'Zinc / galvanized coating', 'light', -1.03, -0.98, {},
      'Hot-dip galvanizing and zinc plating; also zinc sacrificial anodes.'],
    ['magnesium', 'Magnesium alloys', 'light', -1.63, -1.60, {}, 'Most active structural metal; also used for sacrificial anodes in fresh water.'],
  ];

  const MATERIALS = ROWS.map(([id, name, group, eMin, eMax, flags, note]) => ({
    id, name, group, eMin, eMax, mid: Math.round(((eMin + eMax) / 2) * 1000) / 1000,
    passive: !!flags.passive, inert: !!flags.inert, note,
  }));
  const BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));

  /*
   * Allowable potential difference by environment. The 0.15 / 0.25 / 0.50 V
   * limits are the long-standing anodic-index guidance (MIL-F-14072 /
   * MIL-STD-889 practice, reproduced in many design handbooks). The tool's
   * grading above the limit uses the next steps of the same ladder; that
   * grading is this tool's convention, not part of the standard.
   */
  const ENVIRONMENTS = [
    { id: 'harsh', short: 'Harsh', name: 'Harsh: marine, immersion, salt spray', iso: 'ISO 9223 C4–CX, immersion',
      limit: 0.15, steps: [0.15, 0.25, 0.50],
      desc: 'Seawater immersion or splash zone, coastal or offshore atmosphere, road de-icing salts, condensing humid industrial air.' },
    { id: 'normal', short: 'Normal', name: 'Normal: outdoor or unconditioned indoor', iso: 'ISO 9223 C2–C3',
      limit: 0.25, steps: [0.25, 0.50, 0.75],
      desc: 'Sheltered outdoor, warehouses and plant rooms without temperature or humidity control, occasional condensation, fresh water.' },
    { id: 'controlled', short: 'Controlled', name: 'Controlled: dry, conditioned indoor', iso: 'ISO 9223 C1',
      limit: 0.50, steps: [0.50, 0.75, 1.00],
      desc: 'Heated or air-conditioned rooms, electronics enclosures, low humidity without condensation.' },
  ];

  const AREAS = [
    { id: 'favourable', name: 'Large anode, small cathode (Ac / Aa < 0.1)', shift: -1, factor: '< 0.1',
      desc: 'E.g. noble fasteners in a less noble plate. The galvanic current spreads over a large anode area: slow, uniform attack.' },
    { id: 'similar', name: 'Similar areas (Ac / Aa ≈ 0.1–10)', shift: 0, factor: '≈ 1',
      desc: 'Comparable wetted areas of both metals.' },
    { id: 'unfavourable', name: 'Small anode, large cathode (Ac / Aa > 10)', shift: 1, factor: '> 10',
      desc: 'E.g. less noble fasteners or rivets in a noble plate. The current concentrates on the small anode: fast, deep attack.' },
  ];

  const LEVELS = [
    { id: 'low', name: 'Low', cls: 'low', text: 'Compatible for this environment.' },
    { id: 'moderate', name: 'Moderate', cls: 'moderate', text: 'Usable with precautions: seal or isolate the joint.' },
    { id: 'high', name: 'High', cls: 'high', text: 'Avoid, or isolate electrically and keep the electrolyte out.' },
    { id: 'severe', name: 'Severe', cls: 'severe', text: 'Incompatible: change a material or fully isolate the joint.' },
  ];

  const PRESETS = [
    { name: 'Stainless bolts in an aluminium boat hull', a: 'ss316p', b: 'aluminium', env: 'harsh', area: 'favourable' },
    { name: 'Aluminium rivets in a CFRP panel', a: 'aluminium', b: 'graphite', env: 'harsh', area: 'unfavourable' },
    { name: 'Titanium fasteners in a CFRP structure', a: 'titanium', b: 'graphite', env: 'harsh', area: 'favourable' },
    { name: 'Copper pipe joined to galvanized steel pipe', a: 'copper', b: 'zinc', env: 'normal', area: 'similar' },
    { name: 'Bronze propeller on a steel hull', a: 'nab', b: 'steel', env: 'harsh', area: 'favourable' },
    { name: 'Zinc sacrificial anode on a steel structure', a: 'zinc', b: 'steel', env: 'harsh', area: 'unfavourable' },
    { name: 'Stainless 304 sheet with 316 screws', a: 'ss304p', b: 'ss316p', env: 'normal', area: 'favourable' },
    { name: 'Aluminium heat sink on a copper busbar (indoor)', a: 'aluminium', b: 'copper', env: 'controlled', area: 'similar' },
    { name: 'Steel bolts in a copper-nickel flange', a: 'steel', b: 'cuni9010', env: 'harsh', area: 'unfavourable' },
  ];

  const api = { GROUPS, MATERIALS, BY_ID, ENVIRONMENTS, AREAS, LEVELS, PRESETS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GALV_DATA = api;
})(typeof window !== 'undefined' ? window : globalThis);
