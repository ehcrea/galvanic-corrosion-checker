// Settings for tools/build-pages.js (language pages, SEO tags, sitemap).
'use strict';
const I18N = require('../js/i18n.js');

module.exports = {
  base: 'https://ehcrea.github.io/galvanic-corrosion-checker/',
  repo: 'https://github.com/ehcrea/galvanic-corrosion-checker',
  name: 'Galvanic Corrosion Checker',
  ogImage: 'icons/og-image.png',
  langs: Object.keys(I18N.LANGS), // English first
  meta: I18N.meta(),
  featureList: ["Potential difference of any two materials in the ASTM G82 seawater galvanic series", "Anode / cathode identification and colour-coded galvanic corrosion risk", "Harsh, normal and controlled environments with MIL-STD-889 anodic-index limits", "Cathode-to-anode area ratio effect", "Compatibility matrix and mitigation advice", "Theory and academic references", "English, German, Dutch, Turkish and Spanish"],
  dict: (l) => I18N.dict()[l],
  blocks: () => I18N.html(),
  assets: /\b(href|src)="(icons\/|css\/|js\/|manifest\.webmanifest)/g,
};
