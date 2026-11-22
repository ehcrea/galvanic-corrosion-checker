# Galvanic Corrosion Checker

**Live:** https://ehcrea.github.io/galvanic-corrosion-checker/

A browser-based tool to check the **galvanic (bimetallic) corrosion risk** of two materials in contact. Pick the two materials and the environment, and it shows:

- **Potential difference ΔE** between the two materials in the seawater galvanic series, from the mid-range values, plus the ΔE band from the extremes of the two ranges
- **Which material corrodes** (anode) and which is protected (cathode), with a warning when the potential ranges overlap and the polarity is uncertain
- A **colour-coded risk indicator** (Low / Moderate / High / Severe) against the allowable ΔE for the environment: **harsh** (marine, immersion, salt spray) 0.15 V, **normal** (outdoor, unconditioned indoor) 0.25 V, **controlled** (dry, conditioned indoor) 0.50 V
- The **area-ratio effect**: a small anode next to a large cathode raises the risk one level, a large anode with a small cathode lowers it one level
- Notes for **passive stainless steels** turning active in crevices, **CFRP / graphite** contact, **sacrificial anodes**, and very stable passive anodes (titanium, alloy C-276) that are not attacked themselves
- **Recommendations**: isolation, sealing, which part to coat, material changes and cathodic protection

It also draws the **galvanic series chart** with the selected couple highlighted, a **compatibility matrix** of every pair for the chosen environment, a **material library**, a **Theory & explanations** section (electrochemistry, galvanic vs EMF series, mixed-potential theory, area effect, prevention) and a **reference list** of the standards and textbooks used.

**9 application examples** (stainless bolts in an aluminium hull, aluminium rivets in CFRP, titanium fasteners in CFRP, copper to galvanized pipe, bronze propeller on a steel hull, zinc anode on steel, …). Available in **English, German, Dutch, Turkish and Spanish**, with light and dark themes. It can be installed to a phone's home screen, and every couple can be shared as a link.

> The galvanic series ranks risk; it does not predict corrosion rates. Confirm critical joints by testing in the real electrolyte (ASTM G71) or with a corrosion specialist.

## Data and method

| Item | Source |
|---|---|
| Corrosion potentials | Galvanic series in flowing seawater (2.4–4.0 m/s, 10–27 °C), V vs SCE, read from **ASTM G82** Fig. 1 (after LaQue, *Marine Corrosion*, 1975). 28 materials and coatings, with passive and active entries for stainless steels |
| Allowable ΔE | Anodic-index guidance used with **MIL-STD-889** (0.15 / 0.25 / 0.50 V for harsh / normal / controlled environments) |
| Environments | Mapped to **ISO 9223** atmospheric corrosivity categories |
| Area effect | Fontana (1986), Francis (2001): anodic current density ∝ A<sub>c</sub> / A<sub>a</sub> |

The grading above the allowable ΔE uses the next steps of the same 0.15 / 0.25 / 0.50 / 0.75 / 1.00 V ladder; this grading and the one-level area-ratio shift are this tool's convention, not part of a standard.

## References

1. ASTM G82-98(2021), *Standard Guide for Development and Use of a Galvanic Series for Predicting Galvanic Corrosion Performance*.
2. ASTM G71-81(2019), *Standard Guide for Conducting and Evaluating Galvanic Corrosion Tests in Electrolytes*.
3. LaQue, F. L. (1975). *Marine Corrosion: Causes and Prevention*. Wiley.
4. MIL-STD-889, *Dissimilar Metals*. U.S. Department of Defense.
5. Wagner, C., & Traud, W. (1938). *Zeitschrift für Elektrochemie*, 44, 391–402.
6. Fontana, M. G. (1986). *Corrosion Engineering* (3rd ed.). McGraw-Hill.
7. Jones, D. A. (1996). *Principles and Prevention of Corrosion* (2nd ed.). Prentice Hall.
8. Revie, R. W., & Uhlig, H. H. (2008). *Corrosion and Corrosion Control* (4th ed.). Wiley.
9. Zhang, X. G. (2011). Galvanic corrosion. In *Uhlig's Corrosion Handbook* (3rd ed.). Wiley.
10. Francis, R. (2001). *Galvanic Corrosion: A Practical Guide for Engineers*. NACE International.
11. Hack, H. P. (Ed.) (1988). *Galvanic Corrosion*, ASTM STP 978.
12. ISO 9223:2012, *Corrosivity of atmospheres — Classification, determination and estimation*.

## Run it

It's a static site with no build step and no dependencies. Serve the folder and open it in a browser:

```bash
python3 -m http.server 8771
```

Then go to http://localhost:8771. It can also be hosted on GitHub Pages as is.

## Tests

```bash
node tests/calc.test.js
```

The tests check the material data, ΔE and anode selection, that the result does not depend on the order of A and B, the environment limits, that a milder environment never raises the risk, the area-ratio shift, known couples, the examples, the symmetry of the compatibility matrix, and that every text in the interface (including every note and recommendation the calculator can produce) has all five translations with matching placeholders.

## Project layout

| File | Purpose |
|---|---|
| `js/data.js` | Galvanic series, environments, area ratios, risk levels and examples |
| `js/calc.js` | Couple assessment, notes, recommendations and compatibility matrix |
| `js/i18n.js` | Translations (EN, DE, NL, TR, ES), Help, About, Theory and References texts |
| `js/app.js` | User interface, charts, sharing and dialogs |
| `css/style.css` | Styles (shared design with the other ehcrea calculators) |

### Language pages and SEO

Each language has its own page (`/`, `/de/`, `/nl/`, `/tr/`, `/es/`) so search engines can index the translations. `index.html` is the template. After changing it or the translations, regenerate the language pages, the SEO tags (title, description, canonical, hreflang, Open Graph, JSON-LD) and `sitemap.xml`:

```bash
node tools/build-pages.js
```

The page titles, descriptions and other settings are in `tools/seo.config.js`.

## Install as an app and use it offline

The calculator is a Progressive Web App: after the first visit it works without an internet connection, in every language and in light and dark mode.

- **Chrome or Edge (macOS, Windows, Linux):** click the install icon at the right of the address bar, or menu › *Cast, save and share* › *Install page as app*.
- **Safari on macOS (Sonoma or later):** *File* › *Add to Dock*.
- **iPhone / iPad:** Share › *Add to Home Screen*. **Android:** menu › *Install app*.

Updates install themselves: when you are online the newest version is always loaded, and the offline copy is refreshed in the background.

**Maintainers:** `sw.js` is generated. After changing, adding or removing any file of the site, run `node tools/build-sw.js` and commit `sw.js` (the cache version is a hash of all files, so this is what makes the update reach installed copies). The tests fail if it is out of date (`node tools/build-sw.js --check`).

## License

[MIT](LICENSE) © 2026 Eren Tozlu · [ehcrea.com](https://ehcrea.com)
