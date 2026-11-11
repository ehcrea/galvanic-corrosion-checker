/*
 * Translations (English, German, Dutch, Turkish, Spanish).
 *
 * Keys are the English texts, so untranslated strings fall back to English.
 * t(text, params) fills {name} placeholders; string parameters that are
 * themselves dictionary keys (material names, …) are translated too.
 * Static page text is translated by walking the DOM once and remembering the
 * English originals; dynamic text is produced through t().
 * Same engine as the other ehcrea calculators.
 */
(function (root) {
  'use strict';

  const LANGS = {
    en: { name: 'English', locale: 'en-US' },
    de: { name: 'Deutsch', locale: 'de-DE' },
    nl: { name: 'Nederlands', locale: 'nl-NL' },
    tr: { name: 'Türkçe', locale: 'tr-TR' },
    es: { name: 'Español', locale: 'es-ES' },
  };
  const STORE_KEY = 'galv.lang';

  // [English, German, Dutch, Turkish, Spanish]
  const ROWS = [
    // ----- Page, toolbar -----
    ['Galvanic Corrosion Checker', 'Kontaktkorrosions-Prüfer', 'Galvanische-corrosiecheck', 'Galvanik Korozyon Kontrolü', 'Comprobador de corrosión galvánica'],
    ['Dissimilar metal couples · ASTM G82 seawater series · v1.0', 'Paarungen unterschiedlicher Metalle · ASTM-G82-Meerwasserreihe · v1.0', 'Combinaties van ongelijke metalen · ASTM G82-zeewaterreeks · v1.0', 'Farklı metal çiftleri · ASTM G82 deniz suyu serisi · v1.0', 'Pares de metales distintos · serie en agua de mar ASTM G82 · v1.0'],
    ['Application example', 'Anwendungsbeispiel', 'Toepassingsvoorbeeld', 'Uygulama örneği', 'Ejemplo de aplicación'],
    ['Load application example…', 'Anwendungsbeispiel laden…', 'Toepassingsvoorbeeld laden…', 'Uygulama örneği yükle…', 'Cargar ejemplo de aplicación…'],
    ['Copy a link containing this couple', 'Link zu dieser Paarung kopieren', 'Link naar deze combinatie kopiëren', 'Bu çiftin bağlantısını kopyala', 'Copiar un enlace con este par'],
    ['Copy link', 'Link kopieren', 'Link kopiëren', 'Bağlantıyı kopyala', 'Copiar enlace'],
    ['Print this page', 'Diese Seite drucken', 'Deze pagina afdrukken', 'Bu sayfayı yazdır', 'Imprimir esta página'],
    ['Print', 'Drucken', 'Afdrukken', 'Yazdır', 'Imprimir'],
    ['How to use this checker', 'So verwenden Sie diesen Prüfer', 'Zo gebruikt u deze check', 'Bu araç nasıl kullanılır', 'Cómo usar este comprobador'],
    ['Help', 'Hilfe', 'Help', 'Yardım', 'Ayuda'],
    ['About this checker', 'Über diesen Prüfer', 'Over deze check', 'Bu araç hakkında', 'Acerca de este comprobador'],
    ['About', 'Über', 'Over', 'Hakkında', 'Acerca de'],
    ['Toggle light/dark theme', 'Hell/Dunkel umschalten', 'Licht/donker wisselen', 'Açık/koyu temayı değiştir', 'Cambiar tema claro/oscuro'],
    ['Toggle theme', 'Design umschalten', 'Thema wisselen', 'Temayı değiştir', 'Cambiar tema'],
    ['Language', 'Sprache', 'Taal', 'Dil', 'Idioma'],
    ['Close', 'Schließen', 'Sluiten', 'Kapat', 'Cerrar'],
    ['MIT License', 'MIT-Lizenz', 'MIT-licentie', 'MIT Lisansı', 'Licencia MIT'],

    // ----- Inputs -----
    ['Material couple', 'Werkstoffpaarung', 'Materiaalcombinatie', 'Malzeme çifti', 'Par de materiales'],
    ['Material A', 'Werkstoff A', 'Materiaal A', 'Malzeme A', 'Material A'],
    ['Material B', 'Werkstoff B', 'Materiaal B', 'Malzeme B', 'Material B'],
    ['Swap material A and B', 'Werkstoff A und B tauschen', 'Materiaal A en B omwisselen', 'Malzeme A ile B\'yi değiştir', 'Intercambiar material A y B'],
    ['⇅ Swap', '⇅ Tauschen', '⇅ Omwisselen', '⇅ Değiştir', '⇅ Intercambiar'],
    ['For plated or coated parts select the coating metal (zinc, cadmium, nickel, tin, silver), as long as the coating is intact.',
      'Bei beschichteten oder galvanisierten Teilen das Überzugsmetall wählen (Zink, Cadmium, Nickel, Zinn, Silber), solange der Überzug intakt ist.',
      'Kies bij gecoate of gegalvaniseerde delen het metaal van de deklaag (zink, cadmium, nikkel, tin, zilver), zolang de laag intact is.',
      'Kaplamalı parçalarda, kaplama sağlam olduğu sürece kaplama metalini seçin (çinko, kadmiyum, nikel, kalay, gümüş).',
      'Para piezas recubiertas o chapadas elija el metal del recubrimiento (zinc, cadmio, níquel, estaño, plata), siempre que el recubrimiento esté intacto.'],
    ['Environment', 'Umgebung', 'Omgeving', 'Ortam', 'Entorno'],
    ['Harsh / marine', 'Rau / maritim', 'Zwaar / maritiem', 'Ağır / denizel', 'Severo / marino'],
    ['Normal / outdoor', 'Normal / im Freien', 'Normaal / buiten', 'Normal / dış ortam', 'Normal / exterior'],
    ['Controlled indoor', 'Klimatisiert innen', 'Geconditioneerd binnen', 'Kontrollü iç ortam', 'Interior controlado'],
    ['Area ratio cathode : anode', 'Flächenverhältnis Kathode : Anode', 'Oppervlakteverhouding kathode : anode', 'Alan oranı katot : anot', 'Relación de áreas cátodo : ánodo'],
    ['Ratio of the wetted area of the more noble metal (cathode) to that of the less noble metal (anode). A small anode next to a large cathode corrodes much faster.',
      'Verhältnis der benetzten Fläche des edleren Metalls (Kathode) zu der des unedleren Metalls (Anode). Eine kleine Anode neben einer großen Kathode korrodiert viel schneller.',
      'Verhouding van het bevochtigde oppervlak van het edelere metaal (kathode) tot dat van het minder edele metaal (anode). Een kleine anode naast een grote kathode corrodeert veel sneller.',
      'Daha soy metalin (katot) ıslak alanının daha az soy metalin (anot) ıslak alanına oranı. Büyük bir katodun yanındaki küçük bir anot çok daha hızlı korozyona uğrar.',
      'Relación entre el área mojada del metal más noble (cátodo) y la del metal menos noble (ánodo). Un ánodo pequeño junto a un cátodo grande se corroe mucho más rápido.'],
    ['Risk scale', 'Risikoskala', 'Risicoschaal', 'Risk ölçeği', 'Escala de riesgo'],
    ['Limit for the environment from the anodic-index guidance (0.15 / 0.25 / 0.50 V); the grading above the limit is this tool\'s convention.',
      'Grenzwert der Umgebung nach der Anodic-Index-Richtlinie (0,15 / 0,25 / 0,50 V); die Abstufung oberhalb des Grenzwerts ist eine Konvention dieses Werkzeugs.',
      'Grenswaarde voor de omgeving volgens de anodische-indexrichtlijn (0,15 / 0,25 / 0,50 V); de indeling boven de grens is een conventie van deze tool.',
      'Ortam sınırı anodik indeks kılavuzundan alınmıştır (0,15 / 0,25 / 0,50 V); sınırın üzerindeki derecelendirme bu aracın kendi yaklaşımıdır.',
      'Límite del entorno según la guía del índice anódico (0,15 / 0,25 / 0,50 V); la graduación por encima del límite es una convención de esta herramienta.'],

    // ----- Results -----
    ['Potential difference ΔE', 'Potentialdifferenz ΔE', 'Potentiaalverschil ΔE', 'Potansiyel farkı ΔE', 'Diferencia de potencial ΔE'],
    ['Risk indicator', 'Risikoanzeige', 'Risico-indicator', 'Risk göstergesi', 'Indicador de riesgo'],
    ['Galvanic series in flowing seawater', 'Galvanische Spannungsreihe in strömendem Meerwasser', 'Galvanische reeks in stromend zeewater', 'Akan deniz suyunda galvanik seri', 'Serie galvánica en agua de mar en movimiento'],
    ['anode', 'Anode', 'anode', 'anot', 'ánodo'],
    ['cathode', 'Kathode', 'kathode', 'katot', 'cátodo'],
    ['Corrosion potential ranges versus the saturated calomel electrode (SCE), after ASTM G82 / LaQue. Click a bar to use that material as B (Shift-click for A).',
      'Bereiche des Korrosionspotentials gegen die gesättigte Kalomelelektrode (SCE), nach ASTM G82 / LaQue. Balken anklicken, um den Werkstoff als B zu verwenden (Umschalt-Klick für A).',
      'Bereiken van de corrosiepotentiaal ten opzichte van de verzadigde kalomelelektrode (SCE), naar ASTM G82 / LaQue. Klik op een balk om dat materiaal als B te gebruiken (Shift-klik voor A).',
      'Doymuş kalomel elektroduna (SCE) karşı korozyon potansiyeli aralıkları, ASTM G82 / LaQue\'ye göre. Bir çubuğa tıklayınca o malzeme B olarak seçilir (A için Shift-tıklama).',
      'Intervalos del potencial de corrosión frente al electrodo de calomelanos saturado (SCE), según ASTM G82 / LaQue. Haga clic en una barra para usar ese material como B (Mayús-clic para A).'],
    ['Results', 'Ergebnisse', 'Resultaten', 'Sonuçlar', 'Resultados'],
    ['Recommendations', 'Empfehlungen', 'Aanbevelingen', 'Öneriler', 'Recomendaciones'],
    ['Compatibility matrix', 'Verträglichkeitsmatrix', 'Compatibiliteitsmatrix', 'Uyumluluk matrisi', 'Matriz de compatibilidad'],
    ['Material library', 'Werkstoffbibliothek', 'Materiaalbibliotheek', 'Malzeme kütüphanesi', 'Biblioteca de materiales'],
    ['Ranges read from the ASTM G82 galvanic series chart (flowing seawater, 2.4–4.0 m/s, 10–27 °C). Click a row to use it as material B.',
      'Bereiche aus dem Diagramm der galvanischen Spannungsreihe in ASTM G82 abgelesen (strömendes Meerwasser, 2,4–4,0 m/s, 10–27 °C). Zeile anklicken, um sie als Werkstoff B zu verwenden.',
      'Bereiken afgelezen uit de grafiek van de galvanische reeks in ASTM G82 (stromend zeewater, 2,4–4,0 m/s, 10–27 °C). Klik op een rij om die als materiaal B te gebruiken.',
      'Aralıklar ASTM G82 galvanik seri grafiğinden okunmuştur (akan deniz suyu, 2,4–4,0 m/s, 10–27 °C). Malzeme B olarak kullanmak için bir satıra tıklayın.',
      'Intervalos leídos del gráfico de la serie galvánica de ASTM G82 (agua de mar en movimiento, 2,4–4,0 m/s, 10–27 °C). Haga clic en una fila para usarla como material B.'],
    ['Theory & explanations', 'Theorie & Erläuterungen', 'Theorie & uitleg', 'Teori ve açıklamalar', 'Teoría y explicaciones'],
    ['References', 'Literatur', 'Literatuur', 'Kaynaklar', 'Referencias'],

    // ----- Dynamic result text -----
    ['Same material', 'Gleicher Werkstoff', 'Hetzelfde materiaal', 'Aynı malzeme', 'Mismo material'],
    ['Band {lo} – {hi} from the potential ranges · flowing seawater, vs SCE', 'Bereich {lo} – {hi} aus den Potentialbereichen · strömendes Meerwasser, gegen SCE', 'Band {lo} – {hi} uit de potentiaalbereiken · stromend zeewater, t.o.v. SCE', 'Potansiyel aralıklarından bant {lo} – {hi} · akan deniz suyu, SCE\'ye karşı', 'Banda {lo} – {hi} según los intervalos de potencial · agua de mar en movimiento, frente a SCE'],
    ['Couple', 'Paarung', 'Combinatie', 'Çift', 'Par'],
    ['Limit', 'Grenzwert', 'Grens', 'Sınır', 'Límite'],
    ['Anode (corrodes)', 'Anode (korrodiert)', 'Anode (corrodeert)', 'Anot (korozyona uğrar)', 'Ánodo (se corroe)'],
    ['Anode (more negative)', 'Anode (negativer)', 'Anode (negatiever)', 'Anot (daha negatif)', 'Ánodo (más negativo)'],
    ['(passive, not attacked)', '(passiv, wird nicht angegriffen)', '(passief, wordt niet aangetast)', '(pasif, etkilenmez)', '(pasivo, no se ataca)'],
    ['Cathode (protected)', 'Kathode (geschützt)', 'Kathode (beschermd)', 'Katot (korunur)', 'Cátodo (protegido)'],
    ['Limit for environment', 'Grenzwert der Umgebung', 'Grens voor de omgeving', 'Ortam sınırı', 'Límite del entorno'],
    ['Margin', 'Abstand', 'Marge', 'Pay', 'Margen'],
    ['{v} below', '{v} darunter', '{v} eronder', '{v} altında', '{v} por debajo'],
    ['{v} over', '{v} darüber', '{v} erboven', '{v} üzerinde', '{v} por encima'],
    ['Low risk', 'Geringes Risiko', 'Laag risico', 'Düşük risk', 'Riesgo bajo'],
    ['Moderate risk', 'Mäßiges Risiko', 'Matig risico', 'Orta risk', 'Riesgo moderado'],
    ['High risk', 'Hohes Risiko', 'Hoog risico', 'Yüksek risk', 'Riesgo alto'],
    ['Severe risk', 'Sehr hohes Risiko', 'Ernstig risico', 'Ciddi risk', 'Riesgo grave'],
    ['Risk meter', 'Risikoanzeige', 'Risicometer', 'Risk göstergesi', 'Medidor de riesgo'],
    ['{env} · limit {v}', '{env} · Grenze {v}', '{env} · grens {v}', '{env} · sınır {v}', '{env} · límite {v}'],
    ['(ΔE alone: {level}; the anode is passive)', '(nur nach ΔE: {level}; die Anode ist passiv)', '(alleen op ΔE: {level}; de anode is passief)', '(yalnız ΔE\'ye göre: {level}; anot pasif)', '(solo por ΔE: {level}; el ánodo es pasivo)'],
    ['(ΔE alone: {level}; adjusted for the area ratio)', '(nur nach ΔE: {level}; für das Flächenverhältnis angepasst)', '(alleen op ΔE: {level}; aangepast voor de oppervlakteverhouding)', '(yalnız ΔE\'ye göre: {level}; alan oranına göre düzeltildi)', '(solo por ΔE: {level}; ajustado por la relación de áreas)'],
    ['{desc} ({iso}). Limit ΔE ≤ {v}.', '{desc} ({iso}). Grenzwert ΔE ≤ {v}.', '{desc} ({iso}). Grens ΔE ≤ {v}.', '{desc} ({iso}). Sınır ΔE ≤ {v}.', '{desc} ({iso}). Límite ΔE ≤ {v}.'],
    ['{lo} to {hi} vs SCE.', '{lo} bis {hi} gegen SCE.', '{lo} tot {hi} t.o.v. SCE.', 'SCE\'ye karşı {lo} ile {hi} arası.', '{lo} a {hi} frente a SCE.'],
    ['Note', 'Hinweis', 'Let op', 'Not', 'Nota'],
    ['Info', 'Info', 'Info', 'Bilgi', 'Info'],
    ['E vs SCE (V)', 'E gegen SCE (V)', 'E t.o.v. SCE (V)', 'E (SCE\'ye karşı, V)', 'E frente a SCE (V)'],
    ['NOBLE / CATHODIC →', 'EDEL / KATHODISCH →', 'EDEL / KATHODISCH →', 'SOY / KATODİK →', 'NOBLE / CATÓDICO →'],
    ['← ACTIVE / ANODIC', '← UNEDEL / ANODISCH', '← ONEDEL / ANODISCH', '← AKTİF / ANODİK', '← ACTIVO / ANÓDICO'],
    ['Galvanic series chart', 'Diagramm der galvanischen Spannungsreihe', 'Grafiek van de galvanische reeks', 'Galvanik seri grafiği', 'Gráfico de la serie galvánica'],
    ['E<sub>corr</sub> material A', 'E<sub>corr</sub> Werkstoff A', 'E<sub>corr</sub> materiaal A', 'E<sub>corr</sub> malzeme A', 'E<sub>corr</sub> material A'],
    ['E<sub>corr</sub> material B', 'E<sub>corr</sub> Werkstoff B', 'E<sub>corr</sub> materiaal B', 'E<sub>corr</sub> malzeme B', 'E<sub>corr</sub> material B'],
    ['range {lo} … {hi}', 'Bereich {lo} … {hi}', 'bereik {lo} … {hi}', 'aralık {lo} … {hi}', 'intervalo {lo} … {hi}'],
    ['ΔE (mid values)', 'ΔE (Mittelwerte)', 'ΔE (middenwaarden)', 'ΔE (orta değerler)', 'ΔE (valores medios)'],
    ['cathode − anode', 'Kathode − Anode', 'kathode − anode', 'katot − anot', 'cátodo − ánodo'],
    ['ΔE band', 'ΔE-Bereich', 'ΔE-band', 'ΔE bandı', 'Banda de ΔE'],
    ['ranges overlap', 'Bereiche überlappen', 'bereiken overlappen', 'aralıklar örtüşüyor', 'los intervalos se solapan'],
    ['from range extremes', 'aus den Bereichsgrenzen', 'uit de uitersten van de bereiken', 'aralık uçlarından', 'de los extremos de los intervalos'],
    ['Allowable ΔE', 'Zulässiges ΔE', 'Toelaatbaar ΔE', 'İzin verilen ΔE', 'ΔE admisible'],
    ['{env} environment', 'Umgebung {env}', 'omgeving {env}', '{env} ortam', 'entorno {env}'],
    ['ΔE / limit', 'ΔE / Grenzwert', 'ΔE / grens', 'ΔE / sınır', 'ΔE / límite'],
    ['within limit', 'innerhalb der Grenze', 'binnen de grens', 'sınır içinde', 'dentro del límite'],
    ['over limit', 'über der Grenze', 'boven de grens', 'sınırın üzerinde', 'por encima del límite'],
    ['Area ratio A<sub>c</sub> / A<sub>a</sub>', 'Flächenverhältnis A<sub>c</sub> / A<sub>a</sub>', 'Oppervlakteverhouding A<sub>c</sub> / A<sub>a</sub>', 'Alan oranı A<sub>c</sub> / A<sub>a</sub>', 'Relación de áreas A<sub>c</sub> / A<sub>a</sub>'],
    ['raises risk one level', 'erhöht das Risiko um eine Stufe', 'verhoogt het risico één niveau', 'riski bir seviye artırır', 'sube el riesgo un nivel'],
    ['lowers risk one level', 'senkt das Risiko um eine Stufe', 'verlaagt het risico één niveau', 'riski bir seviye azaltır', 'baja el riesgo un nivel'],
    ['no adjustment', 'keine Anpassung', 'geen aanpassing', 'düzeltme yok', 'sin ajuste'],
    ['Risk level', 'Risikostufe', 'Risiconiveau', 'Risk seviyesi', 'Nivel de riesgo'],
    ['Risk level of every couple for the <b>{env}</b> environment and the selected area ratio. Rows are material A, columns material B. Click a cell to load the couple.',
      'Risikostufe jeder Paarung für die Umgebung <b>{env}</b> und das gewählte Flächenverhältnis. Zeilen sind Werkstoff A, Spalten Werkstoff B. Zelle anklicken, um die Paarung zu laden.',
      'Risiconiveau van elke combinatie voor de omgeving <b>{env}</b> en de gekozen oppervlakteverhouding. Rijen zijn materiaal A, kolommen materiaal B. Klik op een cel om de combinatie te laden.',
      '<b>{env}</b> ortam ve seçilen alan oranı için her çiftin risk seviyesi. Satırlar malzeme A, sütunlar malzeme B. Çifti yüklemek için bir hücreye tıklayın.',
      'Nivel de riesgo de cada par para el entorno <b>{env}</b> y la relación de áreas elegida. Las filas son el material A y las columnas el material B. Haga clic en una celda para cargar el par.'],
    ['{a} + {b}: ΔE {v}, {level}', '{a} + {b}: ΔE {v}, {level}', '{a} + {b}: ΔE {v}, {level}', '{a} + {b}: ΔE {v}, {level}', '{a} + {b}: ΔE {v}, {level}'],
    ['Material', 'Werkstoff', 'Materiaal', 'Malzeme', 'Material'],
    ['E min', 'E min', 'E min', 'E min', 'E mín'],
    ['E max', 'E max', 'E max', 'E maks', 'E máx'],
    ['Mid', 'Mitte', 'Midden', 'Orta', 'Medio'],
    ['ΔE to A', 'ΔE zu A', 'ΔE t.o.v. A', 'A\'ya göre ΔE', 'ΔE respecto a A'],
    ['Notes', 'Hinweise', 'Opmerkingen', 'Notlar', 'Notas'],
    ['Material B: {name}', 'Werkstoff B: {name}', 'Materiaal B: {name}', 'Malzeme B: {name}', 'Material B: {name}'],
    ['Loaded example: {name}', 'Beispiel geladen: {name}', 'Voorbeeld geladen: {name}', 'Örnek yüklendi: {name}', 'Ejemplo cargado: {name}'],
    ['Link copied to clipboard', 'Link in die Zwischenablage kopiert', 'Link naar het klembord gekopieerd', 'Bağlantı panoya kopyalandı', 'Enlace copiado al portapapeles'],
    ['Link updated in the address bar', 'Link in der Adresszeile aktualisiert', 'Link in de adresbalk bijgewerkt', 'Bağlantı adres çubuğunda güncellendi', 'Enlace actualizado en la barra de direcciones'],

    // ----- Material groups -----
    ['Noble & passive alloys', 'Edle & passive Werkstoffe', 'Edele & passieve materialen', 'Soy ve pasif malzemeler', 'Materiales nobles y pasivos'],
    ['Stainless steels', 'Edelstähle', 'Roestvast staal', 'Paslanmaz çelikler', 'Aceros inoxidables'],
    ['Nickel alloys', 'Nickellegierungen', 'Nikkellegeringen', 'Nikel alaşımları', 'Aleaciones de níquel'],
    ['Copper alloys', 'Kupferlegierungen', 'Koperlegeringen', 'Bakır alaşımları', 'Aleaciones de cobre'],
    ['Lead, tin, silver', 'Blei, Zinn, Silber', 'Lood, tin, zilver', 'Kurşun, kalay, gümüş', 'Plomo, estaño, plata'],
    ['Iron & steel', 'Eisen & Stahl', 'IJzer & staal', 'Demir ve çelik', 'Hierro y acero'],
    ['Light metals & coatings', 'Leichtmetalle & Überzüge', 'Lichte metalen & deklagen', 'Hafif metaller ve kaplamalar', 'Metales ligeros y recubrimientos'],

    // ----- Materials -----
    ['Graphite / carbon fibre (CFRP)', 'Graphit / Kohlenstofffaser (CFK)', 'Grafiet / koolstofvezel (CFRP)', 'Grafit / karbon fiber (CFRP)', 'Grafito / fibra de carbono (CFRP)'],
    ['Carbon fibre composites are electrically conductive and behave like graphite: a very noble cathode. A major risk for aluminium and steel in contact with CFRP.',
      'Kohlenstofffaser-Verbundwerkstoffe sind elektrisch leitend und verhalten sich wie Graphit: eine sehr edle Kathode. Großes Risiko für Aluminium und Stahl in Kontakt mit CFK.',
      'Koolstofvezelcomposieten zijn elektrisch geleidend en gedragen zich als grafiet: een zeer edele kathode. Een groot risico voor aluminium en staal in contact met CFRP.',
      'Karbon fiber kompozitler elektriği iletir ve grafit gibi davranır: çok soy bir katot. CFRP ile temas eden alüminyum ve çelik için büyük risk.',
      'Los compuestos de fibra de carbono son conductores y se comportan como el grafito: un cátodo muy noble. Gran riesgo para el aluminio y el acero en contacto con CFRP.'],
    ['Platinum', 'Platin', 'Platina', 'Platin', 'Platino'],
    ['Noble metal; used for electrodes and plating.', 'Edelmetall; für Elektroden und Beschichtungen verwendet.', 'Edelmetaal; gebruikt voor elektroden en deklagen.', 'Soy metal; elektrot ve kaplamalarda kullanılır.', 'Metal noble; se usa en electrodos y recubrimientos.'],
    ['Ni-Cr-Mo alloy C-276 (Hastelloy C)', 'Ni-Cr-Mo-Legierung C-276 (Hastelloy C)', 'Ni-Cr-Mo-legering C-276 (Hastelloy C)', 'Ni-Cr-Mo alaşımı C-276 (Hastelloy C)', 'Aleación Ni-Cr-Mo C-276 (Hastelloy C)'],
    ['Highly corrosion-resistant nickel alloy with a very stable passive film.', 'Hoch korrosionsbeständige Nickellegierung mit sehr stabiler Passivschicht.', 'Zeer corrosiebestendige nikkellegering met een zeer stabiele passieve laag.', 'Çok kararlı pasif filme sahip, korozyona çok dayanıklı nikel alaşımı.', 'Aleación de níquel muy resistente a la corrosión con una película pasiva muy estable.'],
    ['Titanium (CP grades, Ti-6Al-4V)', 'Titan (Reintitan, Ti-6Al-4V)', 'Titaan (CP-kwaliteiten, Ti-6Al-4V)', 'Titanyum (CP kaliteler, Ti-6Al-4V)', 'Titanio (grados CP, Ti-6Al-4V)'],
    ['Stable passive film in seawater; titanium itself is practically immune, but it is an efficient cathode for less noble metals.',
      'Stabile Passivschicht in Meerwasser; Titan selbst ist praktisch immun, aber eine wirksame Kathode für unedlere Metalle.',
      'Stabiele passieve laag in zeewater; titaan zelf is vrijwel immuun, maar het is een effectieve kathode voor minder edele metalen.',
      'Deniz suyunda kararlı pasif film; titanyumun kendisi pratikte etkilenmez, ancak daha az soy metaller için etkili bir katottur.',
      'Película pasiva estable en agua de mar; el titanio es prácticamente inmune, pero es un cátodo eficaz para metales menos nobles.'],
    ['Stainless steel 316 / 317 (passive)', 'Edelstahl 316 / 317 (passiv)', 'Roestvast staal 316 / 317 (passief)', 'Paslanmaz çelik 316 / 317 (pasif)', 'Acero inoxidable 316 / 317 (pasivo)'],
    ['Passive condition, free-flowing aerated water. In crevices or stagnant water use the active entry.',
      'Passiver Zustand, frei strömendes, belüftetes Wasser. In Spalten oder stehendem Wasser den aktiven Eintrag verwenden.',
      'Passieve toestand, vrij stromend, belucht water. Gebruik in spleten of stilstaand water de actieve regel.',
      'Pasif durum, serbest akan havalandırılmış su. Aralıklarda veya durgun suda aktif girişi kullanın.',
      'Estado pasivo, agua aireada en movimiento. En resquicios o agua estancada use la entrada activa.'],
    ['Ni-Cu alloy 400 (Monel)', 'Ni-Cu-Legierung 400 (Monel)', 'Ni-Cu-legering 400 (Monel)', 'Ni-Cu alaşımı 400 (Monel)', 'Aleación Ni-Cu 400 (Monel)'],
    ['Nickel-copper alloy, common in seawater pumps, valves and fasteners.', 'Nickel-Kupfer-Legierung, verbreitet in Meerwasserpumpen, Armaturen und Verbindungselementen.', 'Nikkel-koperlegering, veel gebruikt in zeewaterpompen, afsluiters en bevestigingsmiddelen.', 'Deniz suyu pompaları, vanaları ve bağlantı elemanlarında yaygın nikel-bakır alaşımı.', 'Aleación de níquel-cobre, común en bombas, válvulas y tornillería para agua de mar.'],
    ['Stainless steel 302 / 304 / 321 / 347 (passive)', 'Edelstahl 302 / 304 / 321 / 347 (passiv)', 'Roestvast staal 302 / 304 / 321 / 347 (passief)', 'Paslanmaz çelik 302 / 304 / 321 / 347 (pasif)', 'Acero inoxidable 302 / 304 / 321 / 347 (pasivo)'],
    ['Passive condition. Prone to crevice corrosion in seawater, where it becomes active.', 'Passiver Zustand. In Meerwasser anfällig für Spaltkorrosion, wo er aktiv wird.', 'Passieve toestand. Gevoelig voor spleetcorrosie in zeewater, waar het actief wordt.', 'Pasif durum. Deniz suyunda aralık korozyonuna yatkındır; orada aktif hale gelir.', 'Estado pasivo. Propenso a la corrosión por resquicios en agua de mar, donde se vuelve activo.'],
    ['Silver', 'Silber', 'Zilver', 'Gümüş', 'Plata'],
    ['Also representative of silver plating and silver brazing alloys.', 'Steht auch für Versilberung und Silberhartlote.', 'Ook representatief voor verzilvering en zilverhardsoldeer.', 'Gümüş kaplama ve gümüş sert lehim alaşımlarını da temsil eder.', 'También representa el plateado y las aleaciones de soldadura fuerte de plata.'],
    ['Nickel 200 / nickel plating', 'Nickel 200 / Vernickelung', 'Nikkel 200 / vernikkeling', 'Nikel 200 / nikel kaplama', 'Níquel 200 / niquelado'],
    ['Commercially pure nickel; also used as an approximation for electrolytic nickel plating.', 'Technisch reines Nickel; auch als Näherung für galvanische Vernickelung verwendet.', 'Technisch zuiver nikkel; ook gebruikt als benadering voor galvanische vernikkeling.', 'Ticari saf nikel; elektrolitik nikel kaplama için yaklaşık değer olarak da kullanılır.', 'Níquel comercialmente puro; también se usa como aproximación del niquelado electrolítico.'],
    ['Nickel-aluminium bronze', 'Nickel-Aluminium-Bronze', 'Nikkel-aluminiumbrons', 'Nikel-alüminyum bronzu', 'Bronce de níquel-aluminio'],
    ['Propellers, pump impellers and seawater valves.', 'Propeller, Pumpenlaufräder und Meerwasserarmaturen.', 'Scheepsschroeven, pompwaaiers en zeewaterafsluiters.', 'Pervaneler, pompa çarkları ve deniz suyu vanaları.', 'Hélices, rodetes de bombas y válvulas de agua de mar.'],
    ['70/30 copper-nickel', '70/30 Kupfer-Nickel', '70/30 koper-nikkel', '70/30 bakır-nikel', 'Cuproníquel 70/30'],
    ['Seawater piping and heat exchanger tubes.', 'Meerwasserleitungen und Wärmetauscherrohre.', 'Zeewaterleidingen en warmtewisselaarbuizen.', 'Deniz suyu boruları ve ısı eşanjörü tüpleri.', 'Tuberías de agua de mar y tubos de intercambiadores de calor.'],
    ['Lead', 'Blei', 'Lood', 'Kurşun', 'Plomo'],
    ['Also representative of lead-rich solders.', 'Steht auch für bleireiche Lote.', 'Ook representatief voor loodrijk soldeer.', 'Kurşunca zengin lehimleri de temsil eder.', 'También representa las soldaduras ricas en plomo.'],
    ['90/10 copper-nickel', '90/10 Kupfer-Nickel', '90/10 koper-nikkel', '90/10 bakır-nikel', 'Cuproníquel 90/10'],
    ['Seawater piping, hull sheathing.', 'Meerwasserleitungen, Rumpfbeplankung.', 'Zeewaterleidingen, rompbekleding.', 'Deniz suyu boruları, gövde kaplaması.', 'Tuberías de agua de mar, forro del casco.'],
    ['Silicon bronze', 'Siliziumbronze', 'Siliciumbrons', 'Silisyum bronzu', 'Bronce al silicio'],
    ['Marine fasteners and fittings.', 'Maritime Verbindungselemente und Beschläge.', 'Maritieme bevestigingsmiddelen en beslag.', 'Denizcilik bağlantı elemanları ve donanımları.', 'Tornillería y herrajes marinos.'],
    ['Tin bronze (gunmetal)', 'Zinnbronze (Rotguss)', 'Tinbrons (geschutsbrons)', 'Kalay bronzu (top metali)', 'Bronce al estaño (bronce de cañón)'],
    ['Cast valve bodies and fittings.', 'Gegossene Armaturengehäuse und Fittings.', 'Gegoten afsluiterhuizen en fittingen.', 'Döküm vana gövdeleri ve bağlantı parçaları.', 'Cuerpos de válvula y accesorios fundidos.'],
    ['Admiralty / aluminium brass', 'Admiralitätsmessing / Aluminiummessing', 'Admiraliteitsmessing / aluminiummessing', 'Amirallik pirinci / alüminyum pirinci', 'Latón almirantazgo / latón al aluminio'],
    ['Condenser and heat exchanger tubes.', 'Kondensator- und Wärmetauscherrohre.', 'Condensor- en warmtewisselaarbuizen.', 'Kondenser ve ısı eşanjörü tüpleri.', 'Tubos de condensadores e intercambiadores de calor.'],
    ['Tin / tin plating', 'Zinn / Verzinnung', 'Tin / vertinning', 'Kalay / kalay kaplama', 'Estaño / estañado'],
    ['Also representative of tin plating.', 'Steht auch für Verzinnung.', 'Ook representatief voor vertinning.', 'Kalay kaplamayı da temsil eder.', 'También representa el estañado.'],
    ['Copper (C110, C122)', 'Kupfer (C110, C122)', 'Koper (C110, C122)', 'Bakır (C110, C122)', 'Cobre (C110, C122)'],
    ['Pipes, busbars, electrical conductors.', 'Rohre, Stromschienen, elektrische Leiter.', 'Leidingen, stroomrails, elektrische geleiders.', 'Borular, baralar, elektrik iletkenleri.', 'Tuberías, pletinas, conductores eléctricos.'],
    ['Yellow / naval brass, manganese bronze', 'Gelb- / Marinemessing, Manganbronze', 'Geel / marinemessing, mangaanbrons', 'Sarı / denizci pirinci, mangan bronzu', 'Latón amarillo / naval, bronce al manganeso'],
    ['High-zinc brasses; can dezincify in seawater.', 'Zinkreiche Messinge; können in Meerwasser entzinken.', 'Zinkrijke messingsoorten; kunnen in zeewater ontzinken.', 'Yüksek çinkolu pirinçler; deniz suyunda çinkosuzlaşabilir.', 'Latones con alto contenido de zinc; pueden descincificarse en agua de mar.'],
    ['Stainless steel 316 / 317 (active)', 'Edelstahl 316 / 317 (aktiv)', 'Roestvast staal 316 / 317 (actief)', 'Paslanmaz çelik 316 / 317 (aktif)', 'Acero inoxidable 316 / 317 (activo)'],
    ['Active condition: inside crevices, under deposits or in stagnant, low-oxygen water.', 'Aktiver Zustand: in Spalten, unter Ablagerungen oder in stehendem, sauerstoffarmem Wasser.', 'Actieve toestand: in spleten, onder afzettingen of in stilstaand, zuurstofarm water.', 'Aktif durum: aralıkların içinde, birikintilerin altında veya durgun, oksijeni az suda.', 'Estado activo: dentro de resquicios, bajo depósitos o en agua estancada con poco oxígeno.'],
    ['Stainless steel 410 / 416 (active)', 'Edelstahl 410 / 416 (aktiv)', 'Roestvast staal 410 / 416 (actief)', 'Paslanmaz çelik 410 / 416 (aktif)', 'Acero inoxidable 410 / 416 (activo)'],
    ['13 % Cr martensitic stainless steels in the active condition.', 'Martensitische Edelstähle mit 13 % Cr im aktiven Zustand.', 'Martensitisch roestvast staal met 13 % Cr in actieve toestand.', 'Aktif durumdaki %13 Cr martenzitik paslanmaz çelikler.', 'Aceros inoxidables martensíticos con 13 % Cr en estado activo.'],
    ['Stainless steel 302 / 304 (active)', 'Edelstahl 302 / 304 (aktiv)', 'Roestvast staal 302 / 304 (actief)', 'Paslanmaz çelik 302 / 304 (aktif)', 'Acero inoxidable 302 / 304 (activo)'],
    ['Low-alloy steel (e.g. 4140)', 'Niedriglegierter Stahl (z. B. 42CrMo4)', 'Laaggelegeerd staal (bijv. 42CrMo4)', 'Düşük alaşımlı çelik (ör. 4140)', 'Acero de baja aleación (p. ej. 4140)'],
    ['Low-alloy structural and machinery steels.', 'Niedriglegierte Bau- und Maschinenbaustähle.', 'Laaggelegeerde constructie- en machinestalen.', 'Düşük alaşımlı yapı ve makine çelikleri.', 'Aceros de baja aleación estructurales y de maquinaria.'],
    ['Carbon steel / cast iron', 'Kohlenstoffstahl / Gusseisen', 'Koolstofstaal / gietijzer', 'Karbon çeliği / dökme demir', 'Acero al carbono / fundición'],
    ['Mild steel, structural steel, grey and ductile cast iron.', 'Baustahl, unlegierter Stahl, Grauguss und Sphäroguss.', 'Zacht staal, constructiestaal, grijs en nodulair gietijzer.', 'Yumuşak çelik, yapı çeliği, gri ve küresel grafitli dökme demir.', 'Acero dulce, acero estructural, fundición gris y dúctil.'],
    ['Cadmium plating', 'Verkadmung', 'Cadmiumlaag', 'Kadmiyum kaplama', 'Cadmiado'],
    ['Legacy aerospace plating; restricted under RoHS / REACH.', 'Ältere Luftfahrtbeschichtung; durch RoHS / REACH eingeschränkt.', 'Oudere luchtvaartcoating; beperkt onder RoHS / REACH.', 'Eski havacılık kaplaması; RoHS / REACH ile kısıtlanmıştır.', 'Recubrimiento aeroespacial antiguo; restringido por RoHS / REACH.'],
    ['Aluminium alloys', 'Aluminiumlegierungen', 'Aluminiumlegeringen', 'Alüminyum alaşımları', 'Aleaciones de aluminio'],
    ['Wide range: copper-bearing 2xxx and 7xxx alloys sit toward the noble end, 1xxx, 5xxx, 6xxx and Alclad toward the active end.',
      'Großer Bereich: kupferhaltige 2xxx- und 7xxx-Legierungen liegen zum edlen Ende hin, 1xxx, 5xxx, 6xxx und Alclad zum unedlen Ende.',
      'Groot bereik: koperhoudende 2xxx- en 7xxx-legeringen liggen naar de edele kant, 1xxx, 5xxx, 6xxx en Alclad naar de actieve kant.',
      'Geniş aralık: bakır içeren 2xxx ve 7xxx alaşımları soy uca, 1xxx, 5xxx, 6xxx ve Alclad aktif uca yakındır.',
      'Intervalo amplio: las aleaciones 2xxx y 7xxx con cobre están hacia el extremo noble; las 1xxx, 5xxx, 6xxx y Alclad hacia el extremo activo.'],
    ['Zinc / galvanized coating', 'Zink / Verzinkung', 'Zink / verzinkte laag', 'Çinko / galvaniz kaplama', 'Zinc / galvanizado'],
    ['Hot-dip galvanizing and zinc plating; also zinc sacrificial anodes.', 'Feuerverzinkung und galvanische Verzinkung; auch Zink-Opferanoden.', 'Thermisch verzinken en elektrolytisch verzinken; ook zinken opofferingsanodes.', 'Sıcak daldırma galvaniz ve çinko kaplama; ayrıca çinko kurban anotlar.', 'Galvanizado en caliente y cincado; también ánodos de sacrificio de zinc.'],
    ['Magnesium alloys', 'Magnesiumlegierungen', 'Magnesiumlegeringen', 'Magnezyum alaşımları', 'Aleaciones de magnesio'],
    ['Most active structural metal; also used for sacrificial anodes in fresh water.', 'Unedelstes Konstruktionsmetall; auch für Opferanoden in Süßwasser verwendet.', 'Meest actieve constructiemetaal; ook gebruikt voor opofferingsanodes in zoet water.', 'En aktif yapısal metal; tatlı suda kurban anot olarak da kullanılır.', 'El metal estructural más activo; también se usa para ánodos de sacrificio en agua dulce.'],

    // ----- Environments, area ratio, risk levels -----
    ['Harsh', 'Rau', 'Zwaar', 'Ağır', 'Severo'],
    ['Normal', 'Normal', 'Normaal', 'Normal', 'Normal'],
    ['Controlled', 'Klimatisiert', 'Geconditioneerd', 'Kontrollü', 'Controlado'],
    ['Harsh: marine, immersion, salt spray', 'Rau: maritim, Eintauchen, Salznebel', 'Zwaar: maritiem, ondergedompeld, zoutnevel', 'Ağır: deniz, daldırma, tuz sisi', 'Severo: marino, inmersión, niebla salina'],
    ['Normal: outdoor or unconditioned indoor', 'Normal: im Freien oder unklimatisiert innen', 'Normaal: buiten of ongeconditioneerd binnen', 'Normal: dış ortam veya iklimlendirilmemiş iç ortam', 'Normal: exterior o interior sin climatizar'],
    ['Controlled: dry, conditioned indoor', 'Klimatisiert: trocken, klimatisiert innen', 'Geconditioneerd: droog, geconditioneerd binnen', 'Kontrollü: kuru, iklimlendirilmiş iç ortam', 'Controlado: interior seco y climatizado'],
    ['ISO 9223 C2–C3', 'ISO 9223 C2–C3', 'ISO 9223 C2–C3', 'ISO 9223 C2–C3', 'ISO 9223 C2–C3'],
    ['ISO 9223 C1', 'ISO 9223 C1', 'ISO 9223 C1', 'ISO 9223 C1', 'ISO 9223 C1'],
    ['ISO 9223 C4–CX, immersion', 'ISO 9223 C4–CX, Eintauchen', 'ISO 9223 C4–CX, ondergedompeld', 'ISO 9223 C4–CX, daldırma', 'ISO 9223 C4–CX, inmersión'],
    ['Seawater immersion or splash zone, coastal or offshore atmosphere, road de-icing salts, condensing humid industrial air.',
      'Eintauchen in Meerwasser oder Spritzwasserzone, Küsten- oder Offshore-Atmosphäre, Streusalz, kondensierende feuchte Industrieluft.',
      'Ondergedompeld in zeewater of spatzone, kust- of offshore-atmosfeer, strooizout, condenserende vochtige industriële lucht.',
      'Deniz suyuna daldırma veya sıçrama bölgesi, kıyı veya açık deniz atmosferi, yol tuzu, yoğuşan nemli endüstriyel hava.',
      'Inmersión en agua de mar o zona de salpicadura, atmósfera costera o marina, sales de deshielo, aire industrial húmedo con condensación.'],
    ['Sheltered outdoor, warehouses and plant rooms without temperature or humidity control, occasional condensation, fresh water.',
      'Geschützt im Freien, Lager und Technikräume ohne Temperatur- oder Feuchteregelung, gelegentliche Kondensation, Süßwasser.',
      'Beschut buiten, magazijnen en technische ruimten zonder temperatuur- of vochtregeling, af en toe condensatie, zoet water.',
      'Korunaklı dış ortam, sıcaklık veya nem kontrolü olmayan depolar ve makine daireleri, ara sıra yoğuşma, tatlı su.',
      'Exterior protegido, almacenes y salas técnicas sin control de temperatura ni humedad, condensación ocasional, agua dulce.'],
    ['Heated or air-conditioned rooms, electronics enclosures, low humidity without condensation.',
      'Beheizte oder klimatisierte Räume, Elektronikgehäuse, geringe Feuchte ohne Kondensation.',
      'Verwarmde of geklimatiseerde ruimten, elektronicabehuizingen, lage vochtigheid zonder condensatie.',
      'Isıtılan veya klimalı odalar, elektronik muhafazalar, yoğuşmasız düşük nem.',
      'Locales calefactados o climatizados, envolventes de electrónica, baja humedad sin condensación.'],
    ['Large anode, small cathode (Ac / Aa < 0.1)', 'Große Anode, kleine Kathode (Ac / Aa < 0,1)', 'Grote anode, kleine kathode (Ac / Aa < 0,1)', 'Büyük anot, küçük katot (Ac / Aa < 0,1)', 'Ánodo grande, cátodo pequeño (Ac / Aa < 0,1)'],
    ['Similar areas (Ac / Aa ≈ 0.1–10)', 'Ähnliche Flächen (Ac / Aa ≈ 0,1–10)', 'Vergelijkbare oppervlakken (Ac / Aa ≈ 0,1–10)', 'Benzer alanlar (Ac / Aa ≈ 0,1–10)', 'Áreas similares (Ac / Aa ≈ 0,1–10)'],
    ['Small anode, large cathode (Ac / Aa > 10)', 'Kleine Anode, große Kathode (Ac / Aa > 10)', 'Kleine anode, grote kathode (Ac / Aa > 10)', 'Küçük anot, büyük katot (Ac / Aa > 10)', 'Ánodo pequeño, cátodo grande (Ac / Aa > 10)'],
    ['E.g. noble fasteners in a less noble plate. The galvanic current spreads over a large anode area: slow, uniform attack.',
      'Z. B. edle Schrauben in einem unedleren Blech. Der galvanische Strom verteilt sich auf eine große Anodenfläche: langsamer, gleichmäßiger Angriff.',
      'Bijv. edele bevestigingsmiddelen in een minder edele plaat. De galvanische stroom verdeelt zich over een groot anodeoppervlak: langzame, gelijkmatige aantasting.',
      'Ör. daha az soy bir sacda soy bağlantı elemanları. Galvanik akım büyük bir anot alanına yayılır: yavaş, düzgün etki.',
      'P. ej. tornillería noble en una chapa menos noble. La corriente galvánica se reparte en una gran área anódica: ataque lento y uniforme.'],
    ['Comparable wetted areas of both metals.', 'Vergleichbare benetzte Flächen beider Metalle.', 'Vergelijkbare bevochtigde oppervlakken van beide metalen.', 'Her iki metalin ıslak alanları benzer.', 'Áreas mojadas comparables de ambos metales.'],
    ['E.g. less noble fasteners or rivets in a noble plate. The current concentrates on the small anode: fast, deep attack.',
      'Z. B. unedlere Schrauben oder Niete in einem edlen Blech. Der Strom konzentriert sich auf die kleine Anode: schneller, tiefer Angriff.',
      'Bijv. minder edele bevestigingsmiddelen of klinknagels in een edele plaat. De stroom concentreert zich op de kleine anode: snelle, diepe aantasting.',
      'Ör. soy bir sacda daha az soy bağlantı elemanları veya perçinler. Akım küçük anotta yoğunlaşır: hızlı, derin etki.',
      'P. ej. tornillos o remaches menos nobles en una chapa noble. La corriente se concentra en el ánodo pequeño: ataque rápido y profundo.'],
    ['Low', 'Gering', 'Laag', 'Düşük', 'Bajo'],
    ['Moderate', 'Mäßig', 'Matig', 'Orta', 'Moderado'],
    ['High', 'Hoch', 'Hoog', 'Yüksek', 'Alto'],
    ['Severe', 'Sehr hoch', 'Ernstig', 'Ciddi', 'Grave'],
    ['Compatible for this environment.', 'Für diese Umgebung verträglich.', 'Compatibel voor deze omgeving.', 'Bu ortam için uyumlu.', 'Compatible para este entorno.'],
    ['Usable with precautions: seal or isolate the joint.', 'Mit Vorkehrungen verwendbar: Verbindung abdichten oder isolieren.', 'Bruikbaar met voorzorgen: verbinding afdichten of isoleren.', 'Önlemlerle kullanılabilir: bağlantıyı sızdırmaz yapın veya yalıtın.', 'Utilizable con precauciones: selle o aísle la unión.'],
    ['Avoid, or isolate electrically and keep the electrolyte out.', 'Vermeiden oder elektrisch isolieren und den Elektrolyten fernhalten.', 'Vermijden, of elektrisch isoleren en de elektrolyt buiten houden.', 'Kaçının veya elektriksel olarak yalıtıp elektroliti uzak tutun.', 'Evítelo, o aísle eléctricamente y mantenga fuera el electrolito.'],
    ['Incompatible: change a material or fully isolate the joint.', 'Unverträglich: einen Werkstoff ändern oder die Verbindung vollständig isolieren.', 'Niet compatibel: wijzig een materiaal of isoleer de verbinding volledig.', 'Uyumsuz: bir malzemeyi değiştirin veya bağlantıyı tamamen yalıtın.', 'Incompatible: cambie un material o aísle completamente la unión.'],

    // ----- Examples -----
    ['Stainless bolts in an aluminium boat hull', 'Edelstahlschrauben in einem Aluminium-Bootsrumpf', 'RVS-bouten in een aluminium bootromp', 'Alüminyum tekne gövdesinde paslanmaz cıvatalar', 'Tornillos inoxidables en un casco de aluminio'],
    ['Aluminium rivets in a CFRP panel', 'Aluminiumniete in einem CFK-Paneel', 'Aluminium klinknagels in een CFRP-paneel', 'CFRP panelde alüminyum perçinler', 'Remaches de aluminio en un panel de CFRP'],
    ['Titanium fasteners in a CFRP structure', 'Titanschrauben in einer CFK-Struktur', 'Titanium bevestigingsmiddelen in een CFRP-constructie', 'CFRP yapıda titanyum bağlantı elemanları', 'Tornillería de titanio en una estructura de CFRP'],
    ['Copper pipe joined to galvanized steel pipe', 'Kupferrohr an verzinktem Stahlrohr', 'Koperen leiding verbonden met verzinkte stalen leiding', 'Galvanizli çelik boruya bağlı bakır boru', 'Tubo de cobre unido a tubo de acero galvanizado'],
    ['Bronze propeller on a steel hull', 'Bronzepropeller an einem Stahlrumpf', 'Bronzen schroef aan een stalen romp', 'Çelik gövdede bronz pervane', 'Hélice de bronce en un casco de acero'],
    ['Zinc sacrificial anode on a steel structure', 'Zink-Opferanode an einer Stahlkonstruktion', 'Zinken opofferingsanode op een stalen constructie', 'Çelik yapıda çinko kurban anot', 'Ánodo de sacrificio de zinc en una estructura de acero'],
    ['Stainless 304 sheet with 316 screws', 'Edelstahlblech 304 mit Schrauben aus 316', 'RVS 304-plaat met 316-schroeven', '316 vidalı 304 paslanmaz sac', 'Chapa inoxidable 304 con tornillos 316'],
    ['Aluminium heat sink on a copper busbar (indoor)', 'Aluminium-Kühlkörper auf Kupferschiene (innen)', 'Aluminium koellichaam op een koperen stroomrail (binnen)', 'Bakır bara üzerinde alüminyum soğutucu (iç ortam)', 'Disipador de aluminio sobre pletina de cobre (interior)'],
    ['Steel bolts in a copper-nickel flange', 'Stahlschrauben in einem Kupfer-Nickel-Flansch', 'Stalen bouten in een koper-nikkelflens', 'Bakır-nikel flanşta çelik cıvatalar', 'Tornillos de acero en una brida de cuproníquel'],

    // ----- Notes (calc.js) -----
    ['Both parts are the same material: there is no galvanic couple. Other forms of corrosion (crevice, pitting, uniform) can still occur.',
      'Beide Teile bestehen aus demselben Werkstoff: es gibt kein galvanisches Element. Andere Korrosionsarten (Spalt-, Loch-, Flächenkorrosion) sind weiterhin möglich.',
      'Beide delen zijn van hetzelfde materiaal: er is geen galvanisch koppel. Andere corrosievormen (spleet-, put-, uniforme corrosie) kunnen nog steeds optreden.',
      'Her iki parça aynı malzemeden: galvanik çift yok. Diğer korozyon türleri (aralık, oyuklanma, genel) yine de oluşabilir.',
      'Ambas piezas son del mismo material: no hay par galvánico. Pueden producirse otras formas de corrosión (por resquicios, picaduras, uniforme).'],
    ['ΔE ≤ {neg}: the two materials belong to the same group of the galvanic series and are generally compatible.',
      'ΔE ≤ {neg}: beide Werkstoffe gehören zur gleichen Gruppe der Spannungsreihe und sind im Allgemeinen verträglich.',
      'ΔE ≤ {neg}: beide materialen horen bij dezelfde groep van de galvanische reeks en zijn in het algemeen compatibel.',
      'ΔE ≤ {neg}: iki malzeme galvanik serinin aynı grubundadır ve genellikle uyumludur.',
      'ΔE ≤ {neg}: los dos materiales pertenecen al mismo grupo de la serie galvánica y en general son compatibles.'],
    ['{A} is the more negative member but forms a very stable passive film (or does not corrode), so it is not attacked in this couple. The couple is usually acceptable; this is why it is chosen for, e.g., fasteners in CFRP.',
      '{A} ist der negativere Partner, bildet aber eine sehr stabile Passivschicht (oder korrodiert nicht) und wird in dieser Paarung nicht angegriffen. Die Paarung ist meist zulässig; deshalb wird er z. B. für Verbindungselemente in CFK gewählt.',
      '{A} is het negatievere lid maar vormt een zeer stabiele passieve laag (of corrodeert niet) en wordt in deze combinatie niet aangetast. De combinatie is meestal aanvaardbaar; daarom wordt het bijv. gekozen voor bevestigingsmiddelen in CFRP.',
      '{A} daha negatif olan taraftır ancak çok kararlı bir pasif film oluşturur (veya korozyona uğramaz), bu nedenle bu çiftte etkilenmez. Çift genellikle kabul edilebilir; bu yüzden ör. CFRP\'deki bağlantı elemanları için seçilir.',
      '{A} es el miembro más negativo, pero forma una película pasiva muy estable (o no se corroe), por lo que no se ataca en este par. El par suele ser aceptable; por eso se elige, p. ej., para tornillería en CFRP.'],
    ['The potential ranges overlap. Which material becomes the anode can change with temperature, flow, aeration and surface condition; treat the polarity as uncertain.',
      'Die Potentialbereiche überlappen. Welcher Werkstoff zur Anode wird, kann sich mit Temperatur, Strömung, Belüftung und Oberflächenzustand ändern; die Polarität ist unsicher.',
      'De potentiaalbereiken overlappen. Welk materiaal de anode wordt, kan veranderen met temperatuur, stroming, beluchting en oppervlaktetoestand; beschouw de polariteit als onzeker.',
      'Potansiyel aralıkları örtüşüyor. Hangi malzemenin anot olacağı sıcaklık, akış, havalanma ve yüzey durumuna göre değişebilir; kutuplanmayı belirsiz kabul edin.',
      'Los intervalos de potencial se solapan. Qué material actúa como ánodo puede cambiar con la temperatura, el flujo, la aireación y el estado superficial; considere la polaridad incierta.'],
    ['Small anode, large cathode: the galvanic current of the large {C} surface concentrates on the small {A} surface. The anodic current density scales with Ac / Aa, so the attack is fast and local. Raised one level.',
      'Kleine Anode, große Kathode: der galvanische Strom der großen Fläche aus {C} konzentriert sich auf die kleine Fläche aus {A}. Die anodische Stromdichte wächst mit Ac / Aa, der Angriff ist schnell und örtlich. Eine Stufe höher.',
      'Kleine anode, grote kathode: de galvanische stroom van het grote oppervlak {C} concentreert zich op het kleine oppervlak {A}. De anodische stroomdichtheid schaalt met Ac / Aa, dus de aantasting is snel en plaatselijk. Eén niveau hoger.',
      'Küçük anot, büyük katot: büyük {C} yüzeyinin galvanik akımı küçük {A} yüzeyinde yoğunlaşır. Anodik akım yoğunluğu Ac / Aa ile orantılıdır; etki hızlı ve yereldir. Bir seviye yükseltildi.',
      'Ánodo pequeño, cátodo grande: la corriente galvánica de la gran superficie de {C} se concentra en la pequeña superficie de {A}. La densidad de corriente anódica escala con Ac / Aa, por lo que el ataque es rápido y localizado. Sube un nivel.'],
    ['Large anode, small cathode: the galvanic current spreads over the large {A} surface, so the attack is slower and more uniform. Lowered one level.',
      'Große Anode, kleine Kathode: der galvanische Strom verteilt sich auf die große Fläche aus {A}, der Angriff ist langsamer und gleichmäßiger. Eine Stufe niedriger.',
      'Grote anode, kleine kathode: de galvanische stroom verdeelt zich over het grote oppervlak {A}, dus de aantasting is langzamer en gelijkmatiger. Eén niveau lager.',
      'Büyük anot, küçük katot: galvanik akım büyük {A} yüzeyine yayılır; etki daha yavaş ve düzgündür. Bir seviye düşürüldü.',
      'Ánodo grande, cátodo pequeño: la corriente galvánica se reparte en la gran superficie de {A}, por lo que el ataque es más lento y uniforme. Baja un nivel.'],
    ['{P} relies on its passive film. Inside crevices, under gaskets or deposits, or in stagnant water it can become active ({eAct}), giving ΔE = {dAct} against {O}, with {X} as the anode.',
      '{P} beruht auf seiner Passivschicht. In Spalten, unter Dichtungen oder Ablagerungen oder in stehendem Wasser kann er aktiv werden ({eAct}); dann ist ΔE = {dAct} gegenüber {O}, mit {X} als Anode.',
      '{P} steunt op zijn passieve laag. In spleten, onder pakkingen of afzettingen of in stilstaand water kan het actief worden ({eAct}); dan is ΔE = {dAct} ten opzichte van {O}, met {X} als anode.',
      '{P} pasif filmine dayanır. Aralıklarda, conta veya birikinti altında ya da durgun suda aktif hale gelebilir ({eAct}); bu durumda {O} ile ΔE = {dAct} olur ve anot {X} olur.',
      '{P} depende de su película pasiva. Dentro de resquicios, bajo juntas o depósitos, o en agua estancada puede volverse activo ({eAct}), con ΔE = {dAct} frente a {O} y {X} como ánodo.'],
    ['{A} is in the active (film-free) condition: this applies to crevices and low-oxygen water, not to freely exposed, aerated surfaces.',
      '{A} ist im aktiven (schichtfreien) Zustand: das gilt für Spalten und sauerstoffarmes Wasser, nicht für frei zugängliche, belüftete Flächen.',
      '{A} is in de actieve (laagvrije) toestand: dit geldt voor spleten en zuurstofarm water, niet voor vrij blootgestelde, beluchte oppervlakken.',
      '{A} aktif (filmsiz) durumdadır: bu, aralıklar ve oksijeni az su için geçerlidir, serbestçe açıkta kalan havalandırılmış yüzeyler için değil.',
      '{A} está en estado activo (sin película): esto se aplica a resquicios y agua con poco oxígeno, no a superficies libremente expuestas y aireadas.'],
    ['Carbon fibre (CFRP) is a strong cathode. Isolate metal parts from the fibres with a glass-fibre or film ply, sealant and wet-installed or titanium fasteners.',
      'Kohlenstofffaser (CFK) ist eine starke Kathode. Metallteile mit einer Glasfaser- oder Folienlage, Dichtmasse und nass montierten oder Titan-Verbindungselementen von den Fasern trennen.',
      'Koolstofvezel (CFRP) is een sterke kathode. Isoleer metalen delen van de vezels met een glasvezel- of folielaag, kit en nat gemonteerde of titanium bevestigingsmiddelen.',
      'Karbon fiber (CFRP) güçlü bir katottur. Metal parçaları liflerden cam elyaf veya film katmanı, sızdırmazlık macunu ve ıslak montajlı veya titanyum bağlantı elemanlarıyla yalıtın.',
      'La fibra de carbono (CFRP) es un cátodo fuerte. Aísle las piezas metálicas de las fibras con una capa de fibra de vidrio o película, sellante y tornillería instalada en húmedo o de titanio.'],
    ['This is the principle of sacrificial (galvanic) cathodic protection: {A} corrodes preferentially and protects the steel. Desirable for anodes and galvanizing, but not if {A} is a structural part.',
      'Das ist das Prinzip des kathodischen Schutzes mit Opferanoden: {A} korrodiert bevorzugt und schützt den Stahl. Erwünscht bei Anoden und Verzinkung, nicht aber, wenn {A} ein tragendes Bauteil ist.',
      'Dit is het principe van kathodische bescherming met opofferingsanodes: {A} corrodeert bij voorkeur en beschermt het staal. Gewenst bij anodes en verzinking, maar niet als {A} een constructief onderdeel is.',
      'Bu, kurban anotlu (galvanik) katodik korumanın ilkesidir: {A} öncelikli olarak korozyona uğrar ve çeliği korur. Anotlar ve galvaniz için istenir, ancak {A} taşıyıcı bir parçaysa istenmez.',
      'Es el principio de la protección catódica por ánodos de sacrificio: {A} se corroe preferentemente y protege el acero. Deseable en ánodos y galvanizado, pero no si {A} es una pieza estructural.'],
    ['Aluminium alloys cover a wide range (−0.99 to −0.76 V). Copper-bearing 2xxx / 7xxx alloys are nearer the noble end; 5xxx, 6xxx and clad alloys nearer the active end.',
      'Aluminiumlegierungen decken einen großen Bereich ab (−0,99 bis −0,76 V). Kupferhaltige 2xxx- / 7xxx-Legierungen liegen näher am edlen Ende, 5xxx, 6xxx und plattierte Legierungen näher am unedlen Ende.',
      'Aluminiumlegeringen beslaan een groot bereik (−0,99 tot −0,76 V). Koperhoudende 2xxx- / 7xxx-legeringen liggen dichter bij de edele kant, 5xxx, 6xxx en geplateerde legeringen dichter bij de actieve kant.',
      'Alüminyum alaşımları geniş bir aralığı kapsar (−0,99 ile −0,76 V). Bakır içeren 2xxx / 7xxx alaşımları soy uca, 5xxx, 6xxx ve kaplı alaşımlar aktif uca daha yakındır.',
      'Las aleaciones de aluminio cubren un intervalo amplio (−0,99 a −0,76 V). Las 2xxx / 7xxx con cobre están más cerca del extremo noble; las 5xxx, 6xxx y chapadas, del extremo activo.'],
    ['Galvanic corrosion needs an electrolyte. In a really dry, condensation-free space the risk is low, but condensation, cleaning fluids or handling contamination can activate the couple.',
      'Kontaktkorrosion braucht einen Elektrolyten. In einem wirklich trockenen, kondensationsfreien Raum ist das Risiko gering, aber Kondenswasser, Reinigungsmittel oder Verschmutzung beim Handling können das Element aktivieren.',
      'Galvanische corrosie heeft een elektrolyt nodig. In een echt droge, condensvrije ruimte is het risico laag, maar condensatie, reinigingsmiddelen of vervuiling bij hantering kunnen het koppel activeren.',
      'Galvanik korozyon bir elektrolit gerektirir. Gerçekten kuru, yoğuşmasız bir ortamda risk düşüktür; ancak yoğuşma, temizlik sıvıları veya elle temas kirliliği çifti aktive edebilir.',
      'La corrosión galvánica necesita un electrolito. En un espacio realmente seco y sin condensación el riesgo es bajo, pero la condensación, los productos de limpieza o la contaminación por manipulación pueden activar el par.'],

    // ----- Recommendations (calc.js) -----
    ['Break the electrical path: non-conductive washers, sleeves and gaskets (e.g. G10/FR4, PTFE, nylon), with the sleeve covering the full bolt shank.',
      'Elektrischen Pfad unterbrechen: nichtleitende Scheiben, Hülsen und Dichtungen (z. B. G10/FR4, PTFE, Nylon), wobei die Hülse den ganzen Schraubenschaft abdeckt.',
      'Onderbreek het elektrische pad: niet-geleidende ringen, hulzen en pakkingen (bijv. G10/FR4, PTFE, nylon), met de huls over de volledige boutschacht.',
      'Elektrik yolunu kesin: iletken olmayan pullar, burçlar ve contalar (ör. G10/FR4, PTFE, naylon); burç cıvata gövdesinin tamamını kaplamalıdır.',
      'Interrumpa el camino eléctrico: arandelas, casquillos y juntas no conductores (p. ej. G10/FR4, PTFE, nailon), con el casquillo cubriendo toda la caña del tornillo.'],
    ['Keep the electrolyte out: seal the faying surfaces of the joint and wet-install fasteners with a jointing or barrier compound; avoid water traps and provide drainage.',
      'Elektrolyt fernhalten: Kontaktflächen der Verbindung abdichten und Verbindungselemente mit Dicht- oder Sperrmasse nass montieren; Wassersäcke vermeiden und Entwässerung vorsehen.',
      'Houd de elektrolyt buiten: dicht de contactvlakken van de verbinding af en monteer bevestigingsmiddelen nat met een afdicht- of barrièremiddel; vermijd waterzakken en zorg voor afwatering.',
      'Elektroliti uzak tutun: bağlantının temas yüzeylerini sızdırmaz yapın ve bağlantı elemanlarını sızdırmazlık veya bariyer macunuyla ıslak monte edin; su ceplerinden kaçının ve drenaj sağlayın.',
      'Mantenga fuera el electrolito: selle las superficies de contacto de la unión e instale la tornillería en húmedo con un compuesto sellante o de barrera; evite trampas de agua y prevea drenaje.'],
    ['If you paint, coat the cathode ({C}) or both parts. Never coat only the anode: a defect in its coating leaves a tiny anode against a large cathode.',
      'Wenn lackiert wird, die Kathode ({C}) oder beide Teile beschichten. Nie nur die Anode beschichten: ein Fehler in ihrer Beschichtung ergibt eine winzige Anode gegenüber einer großen Kathode.',
      'Als u schildert, coat dan de kathode ({C}) of beide delen. Coat nooit alleen de anode: een beschadiging in die laag geeft een piepkleine anode tegenover een grote kathode.',
      'Boya yapacaksanız katodu ({C}) veya her iki parçayı kaplayın. Asla yalnızca anodu kaplamayın: kaplamadaki bir kusur büyük bir katoda karşı çok küçük bir anot bırakır.',
      'Si pinta, recubra el cátodo ({C}) o ambas piezas. Nunca recubra solo el ánodo: un defecto en su recubrimiento deja un ánodo diminuto frente a un cátodo grande.'],
    ['Prefer a closer pair in the galvanic series, or a fastener material that is slightly more noble than the structure.',
      'Ein in der Spannungsreihe näher beieinanderliegendes Paar wählen oder einen Werkstoff für Verbindungselemente, der etwas edler als die Struktur ist.',
      'Kies liever een combinatie die dichter bij elkaar ligt in de galvanische reeks, of een materiaal voor bevestigingsmiddelen dat iets edeler is dan de constructie.',
      'Galvanik seride birbirine daha yakın bir çift veya yapıdan biraz daha soy bir bağlantı elemanı malzemesi tercih edin.',
      'Prefiera un par más próximo en la serie galvánica, o un material de tornillería algo más noble que la estructura.'],
    ['In immersion service consider cathodic protection (zinc, aluminium or magnesium anodes, or impressed current).',
      'Bei Eintauchbetrieb kathodischen Schutz vorsehen (Zink-, Aluminium- oder Magnesiumanoden oder Fremdstrom).',
      'Overweeg bij ondergedompeld gebruik kathodische bescherming (zink-, aluminium- of magnesiumanodes, of opgedrukte stroom).',
      'Daldırma koşullarında katodik koruma düşünün (çinko, alüminyum veya magnezyum anotlar ya da dış akım).',
      'En servicio sumergido considere la protección catódica (ánodos de zinc, aluminio o magnesio, o corriente impresa).'],
    ['Do not use this couple without full electrical isolation; even then, inspect the joint periodically.',
      'Diese Paarung nicht ohne vollständige elektrische Isolierung verwenden; auch dann die Verbindung regelmäßig prüfen.',
      'Gebruik deze combinatie niet zonder volledige elektrische isolatie; inspecteer de verbinding ook dan regelmatig.',
      'Bu çifti tam elektriksel yalıtım olmadan kullanmayın; o durumda bile bağlantıyı düzenli olarak kontrol edin.',
      'No use este par sin aislamiento eléctrico completo; incluso así, inspeccione la unión periódicamente.'],
    ['No special measures for galvanic corrosion. Normal good practice still applies: avoid crevices and standing water.',
      'Keine besonderen Maßnahmen gegen Kontaktkorrosion nötig. Die übliche gute Praxis gilt weiterhin: Spalten und stehendes Wasser vermeiden.',
      'Geen speciale maatregelen tegen galvanische corrosie. De normale goede praktijk blijft gelden: vermijd spleten en stilstaand water.',
      'Galvanik korozyon için özel önlem gerekmez. Normal iyi uygulama yine geçerlidir: aralıklardan ve durgun sudan kaçının.',
      'No se necesitan medidas especiales contra la corrosión galvánica. Siguen valiendo las buenas prácticas: evite resquicios y agua estancada.'],
  ];

  // Blocks with inline markup, translated as a whole (static, trusted content).
  const REPO = 'https://github.com/ehcrea/galvanic-corrosion-checker';
  const PATREON = '<a class="btn-support" href="https://www.patreon.com/ehcrea" target="_blank" rel="noopener"><span aria-hidden="true">♥</span> ';
  const ehcrea = '<a href="https://ehcrea.com" target="_blank" rel="noopener">ehcrea.com</a>';
  const lic = (t) => `<a href="${REPO}/blob/main/LICENSE" target="_blank" rel="noopener">${t}</a>`;
  const gh = '<a href="' + REPO + '" target="_blank" rel="noopener">GitHub</a>';
  const head = (title, byline) => `<div class="about-head"><img src="icons/favicon.svg" alt=""><div><h2 id="about-title">${title}</h2><p>${byline}</p></div></div>\n`;

  const HTML = {
    about: {
      en: head('Galvanic Corrosion Checker', 'Version 1.0 · by Eren Tozlu') + `<p>A free, browser-based tool to check the galvanic corrosion risk of two materials in contact. Pick the materials and the environment: it shows the potential difference in the seawater galvanic series, which material corrodes, and a colour-coded risk with the effect of the area ratio, plus recommendations. All calculations run in your browser.</p>
<p>Potentials follow the galvanic series of ASTM G82 (after LaQue); the environment limits follow the anodic-index guidance used with MIL-STD-889. The Theory section and the reference list explain the method.</p>
<p>Made by Eren Tozlu. More engineering tools and projects at ${ehcrea}.</p>
<p>Open source under the ${lic('MIT License')}; the source code is on ${gh}.</p>
<div class="about-support"><p><strong>Found it useful?</strong> This checker is free for everyone and I keep building new engineering tools in my spare time. If it saved you from a corroded joint or helped you learn, you can support its development on Patreon. Thank you!</p>${PATREON}Support me on Patreon</a></div>
<p class="about-meta">Results are screening guidance. Confirm critical joints by testing in the real electrolyte or with a corrosion specialist.</p>`,
      de: head('Kontaktkorrosions-Prüfer', 'Version 1.0 · von Eren Tozlu') + `<p>Ein kostenloses Werkzeug im Browser, das das Risiko der Kontaktkorrosion (galvanischen Korrosion) zweier sich berührender Werkstoffe prüft. Werkstoffe und Umgebung wählen: es zeigt die Potentialdifferenz in der galvanischen Spannungsreihe in Meerwasser, welcher Werkstoff korrodiert, ein farbcodiertes Risiko mit dem Einfluss des Flächenverhältnisses und Empfehlungen. Alle Berechnungen laufen in Ihrem Browser.</p>
<p>Die Potentiale folgen der galvanischen Spannungsreihe aus ASTM G82 (nach LaQue); die Grenzwerte der Umgebungen folgen der Anodic-Index-Richtlinie, wie sie mit MIL-STD-889 verwendet wird. Der Theorieteil und das Literaturverzeichnis erklären die Methode.</p>
<p>Erstellt von Eren Tozlu. Weitere Ingenieurwerkzeuge und Projekte auf ${ehcrea}.</p>
<p>Open Source unter der ${lic('MIT-Lizenz')}; der Quellcode liegt auf ${gh}.</p>
<div class="about-support"><p><strong>Hilfreich?</strong> Dieser Prüfer ist für alle kostenlos, und ich entwickle in meiner Freizeit neue Ingenieurwerkzeuge. Wenn er Ihnen eine korrodierte Verbindung erspart oder beim Lernen geholfen hat, können Sie die Entwicklung auf Patreon unterstützen. Danke!</p>${PATREON}Unterstütze mich auf Patreon</a></div>
<p class="about-meta">Die Ergebnisse sind eine Ersteinschätzung. Kritische Verbindungen durch Versuche im realen Elektrolyten oder mit einem Korrosionsfachmann bestätigen.</p>`,
      nl: head('Galvanische-corrosiecheck', 'Versie 1.0 · door Eren Tozlu') + `<p>Een gratis tool in de browser die het risico op galvanische corrosie van twee materialen die elkaar raken controleert. Kies de materialen en de omgeving: de tool toont het potentiaalverschil in de galvanische reeks in zeewater, welk materiaal corrodeert, een risico met kleurcode inclusief het effect van de oppervlakteverhouding, en aanbevelingen. Alle berekeningen draaien in uw browser.</p>
<p>De potentialen volgen de galvanische reeks van ASTM G82 (naar LaQue); de grenzen per omgeving volgen de anodische-indexrichtlijn die met MIL-STD-889 wordt gebruikt. Het theoriedeel en de literatuurlijst lichten de methode toe.</p>
<p>Gemaakt door Eren Tozlu. Meer engineeringtools en projecten op ${ehcrea}.</p>
<p>Open source onder de ${lic('MIT-licentie')}; de broncode staat op ${gh}.</p>
<div class="about-support"><p><strong>Nuttig gevonden?</strong> Deze check is gratis voor iedereen en ik bouw in mijn vrije tijd nieuwe engineeringtools. Heeft hij u een gecorrodeerde verbinding bespaard of geholpen bij het leren, dan kunt u de ontwikkeling steunen via Patreon. Dank u!</p>${PATREON}Steun mij op Patreon</a></div>
<p class="about-meta">De resultaten zijn een eerste beoordeling. Bevestig kritische verbindingen met proeven in de echte elektrolyt of met een corrosiespecialist.</p>`,
      tr: head('Galvanik Korozyon Kontrolü', 'Sürüm 1.0 · Eren Tozlu') + `<p>Birbirine temas eden iki malzemenin galvanik korozyon riskini kontrol eden, tarayıcıda çalışan ücretsiz bir araç. Malzemeleri ve ortamı seçin: deniz suyu galvanik serisindeki potansiyel farkını, hangi malzemenin korozyona uğrayacağını, alan oranının etkisiyle renk kodlu riski ve önerileri gösterir. Tüm hesaplamalar tarayıcınızda yapılır.</p>
<p>Potansiyeller ASTM G82 galvanik serisine (LaQue'ye göre) dayanır; ortam sınırları MIL-STD-889 ile kullanılan anodik indeks kılavuzunu izler. Yöntem, Teori bölümünde ve kaynak listesinde açıklanmıştır.</p>
<p>Eren Tozlu tarafından hazırlanmıştır. Diğer mühendislik araçları ve projeler: ${ehcrea}.</p>
<p>${lic('MIT Lisansı')} ile açık kaynaklıdır; kaynak kodu ${gh} üzerindedir.</p>
<div class="about-support"><p><strong>İşinize yaradı mı?</strong> Bu araç herkes için ücretsizdir ve boş zamanlarımda yeni mühendislik araçları geliştiriyorum. Sizi korozyona uğramış bir bağlantıdan kurtardıysa veya öğrenmenize yardımcı olduysa, gelişimini Patreon üzerinden destekleyebilirsiniz. Teşekkürler!</p>${PATREON}Patreon'da destek ol</a></div>
<p class="about-meta">Sonuçlar ön değerlendirme niteliğindedir. Kritik bağlantıları gerçek elektrolitte test ederek veya bir korozyon uzmanıyla doğrulayın.</p>`,
      es: head('Comprobador de corrosión galvánica', 'Versión 1.0 · por Eren Tozlu') + `<p>Una herramienta gratuita en el navegador para comprobar el riesgo de corrosión galvánica de dos materiales en contacto. Elija los materiales y el entorno: muestra la diferencia de potencial en la serie galvánica en agua de mar, qué material se corroe, un riesgo con código de colores que incluye el efecto de la relación de áreas, y recomendaciones. Todos los cálculos se hacen en su navegador.</p>
<p>Los potenciales siguen la serie galvánica de ASTM G82 (según LaQue); los límites por entorno siguen la guía del índice anódico usada con MIL-STD-889. La sección de teoría y la lista de referencias explican el método.</p>
<p>Hecho por Eren Tozlu. Más herramientas y proyectos de ingeniería en ${ehcrea}.</p>
<p>Código abierto bajo la ${lic('Licencia MIT')}; el código fuente está en ${gh}.</p>
<div class="about-support"><p><strong>¿Le ha sido útil?</strong> Este comprobador es gratuito para todos y sigo creando herramientas de ingeniería en mi tiempo libre. Si le ha evitado una unión corroída o le ha ayudado a aprender, puede apoyar su desarrollo en Patreon. ¡Gracias!</p>${PATREON}Apóyame en Patreon</a></div>
<p class="about-meta">Los resultados son una evaluación preliminar. Confirme las uniones críticas con ensayos en el electrolito real o con un especialista en corrosión.</p>`,
    },

    help: {
      en: `<h2 id="help-title">How to use the Galvanic Corrosion Checker</h2>
<p>New here? Pick an example from <b>Load application example…</b> in the toolbar, then change one input at a time.</p>
<h3>Three steps</h3>
<ol>
<li><b>Material couple</b>: choose the two materials that touch. For plated parts choose the plating metal. ⇅ swaps them.</li>
<li><b>Environment</b>: <i>Harsh</i> for marine, immersion, salt spray or de-icing salts; <i>Normal</i> for outdoor and unconditioned indoor spaces; <i>Controlled</i> for dry, air-conditioned spaces. Then the <b>area ratio</b> of the cathode (more noble metal) to the anode.</li>
<li><b>Read the result</b>: ΔE, which material corrodes, and the colour of the risk indicator.</li>
</ol>
<h3>Risk levels</h3>
<dl>
<dt class="lvl low">Low</dt><dd>ΔE within the limit for the environment. Compatible.</dd>
<dt class="lvl moderate">Moderate</dt><dd>Up to the next step of the 0.15 / 0.25 / 0.50 / 0.75 / 1.00 V ladder. Seal or isolate the joint.</dd>
<dt class="lvl high">High</dt><dd>Two steps above the limit. Avoid, or isolate and keep water out.</dd>
<dt class="lvl severe">Severe</dt><dd>More than that. Change a material or fully isolate.</dd>
</dl>
<p>The area ratio moves the level one step up (small anode, large cathode) or down (large anode, small cathode). If the more negative member is a very stable passive material (titanium, alloy C-276, platinum, graphite) it does not corrode itself, so the level is Low; it can still attack other metals.</p>
<h3>Tips</h3>
<ul>
<li>Click a bar in the galvanic series chart to pick material B, Shift-click to pick A.</li>
<li>The compatibility matrix shows every pair for the current environment and area ratio; click a cell to load it.</li>
<li><b>Copy link</b> stores the couple and environment in a link.</li>
</ul>
<p class="about-meta">The galvanic series ranks risk but does not give corrosion rates. Confirm critical joints by testing.</p>`,
      de: `<h2 id="help-title">So verwenden Sie den Kontaktkorrosions-Prüfer</h2>
<p>Neu hier? Wählen Sie ein Beispiel unter <b>Anwendungsbeispiel laden…</b> in der Werkzeugleiste und ändern Sie dann jeweils eine Eingabe.</p>
<h3>Drei Schritte</h3>
<ol>
<li><b>Werkstoffpaarung</b>: die beiden sich berührenden Werkstoffe wählen. Bei beschichteten Teilen das Überzugsmetall wählen. ⇅ tauscht sie.</li>
<li><b>Umgebung</b>: <i>Rau</i> für maritim, Eintauchen, Salznebel oder Streusalz; <i>Normal</i> für im Freien und unklimatisierte Innenräume; <i>Klimatisiert</i> für trockene, klimatisierte Räume. Dann das <b>Flächenverhältnis</b> der Kathode (edleres Metall) zur Anode.</li>
<li><b>Ergebnis lesen</b>: ΔE, welcher Werkstoff korrodiert, und die Farbe der Risikoanzeige.</li>
</ol>
<h3>Risikostufen</h3>
<dl>
<dt class="lvl low">Gering</dt><dd>ΔE innerhalb des Grenzwerts der Umgebung. Verträglich.</dd>
<dt class="lvl moderate">Mäßig</dt><dd>Bis zur nächsten Stufe der Leiter 0,15 / 0,25 / 0,50 / 0,75 / 1,00 V. Verbindung abdichten oder isolieren.</dd>
<dt class="lvl high">Hoch</dt><dd>Zwei Stufen über dem Grenzwert. Vermeiden oder isolieren und Wasser fernhalten.</dd>
<dt class="lvl severe">Sehr hoch</dt><dd>Darüber. Einen Werkstoff ändern oder vollständig isolieren.</dd>
</dl>
<p>Das Flächenverhältnis verschiebt die Stufe um eins nach oben (kleine Anode, große Kathode) oder nach unten (große Anode, kleine Kathode). Ist der negativere Partner ein sehr stabil passiver Werkstoff (Titan, Legierung C-276, Platin, Graphit), korrodiert er selbst nicht und die Stufe ist Gering; andere Metalle kann er trotzdem angreifen.</p>
<h3>Tipps</h3>
<ul>
<li>Balken im Diagramm der Spannungsreihe anklicken, um Werkstoff B zu wählen, Umschalt-Klick für A.</li>
<li>Die Verträglichkeitsmatrix zeigt jede Paarung für die aktuelle Umgebung und das Flächenverhältnis; Zelle anklicken, um sie zu laden.</li>
<li><b>Link kopieren</b> speichert Paarung und Umgebung in einem Link.</li>
</ul>
<p class="about-meta">Die Spannungsreihe ordnet das Risiko ein, liefert aber keine Korrosionsraten. Kritische Verbindungen durch Versuche bestätigen.</p>`,
      nl: `<h2 id="help-title">Zo gebruikt u de galvanische-corrosiecheck</h2>
<p>Nieuw hier? Kies een voorbeeld via <b>Toepassingsvoorbeeld laden…</b> in de werkbalk en wijzig daarna één invoer tegelijk.</p>
<h3>Drie stappen</h3>
<ol>
<li><b>Materiaalcombinatie</b>: kies de twee materialen die elkaar raken. Kies bij gecoate delen het metaal van de deklaag. ⇅ wisselt ze om.</li>
<li><b>Omgeving</b>: <i>Zwaar</i> voor maritiem, ondergedompeld, zoutnevel of strooizout; <i>Normaal</i> voor buiten en ongeconditioneerde binnenruimten; <i>Geconditioneerd</i> voor droge, geklimatiseerde ruimten. Daarna de <b>oppervlakteverhouding</b> van de kathode (edeler metaal) tot de anode.</li>
<li><b>Lees het resultaat</b>: ΔE, welk materiaal corrodeert, en de kleur van de risico-indicator.</li>
</ol>
<h3>Risiconiveaus</h3>
<dl>
<dt class="lvl low">Laag</dt><dd>ΔE binnen de grens voor de omgeving. Compatibel.</dd>
<dt class="lvl moderate">Matig</dt><dd>Tot de volgende stap van de ladder 0,15 / 0,25 / 0,50 / 0,75 / 1,00 V. Dicht de verbinding af of isoleer haar.</dd>
<dt class="lvl high">Hoog</dt><dd>Twee stappen boven de grens. Vermijden, of isoleren en water buiten houden.</dd>
<dt class="lvl severe">Ernstig</dt><dd>Meer dan dat. Wijzig een materiaal of isoleer volledig.</dd>
</dl>
<p>De oppervlakteverhouding verschuift het niveau één stap omhoog (kleine anode, grote kathode) of omlaag (grote anode, kleine kathode). Is het negatievere lid een zeer stabiel passief materiaal (titaan, legering C-276, platina, grafiet), dan corrodeert het zelf niet en is het niveau Laag; andere metalen kan het nog steeds aantasten.</p>
<h3>Tips</h3>
<ul>
<li>Klik op een balk in de grafiek van de galvanische reeks om materiaal B te kiezen, Shift-klik voor A.</li>
<li>De compatibiliteitsmatrix toont elke combinatie voor de huidige omgeving en oppervlakteverhouding; klik op een cel om die te laden.</li>
<li><b>Link kopiëren</b> slaat de combinatie en omgeving op in een link.</li>
</ul>
<p class="about-meta">De galvanische reeks rangschikt het risico maar geeft geen corrosiesnelheden. Bevestig kritische verbindingen met proeven.</p>`,
      tr: `<h2 id="help-title">Galvanik Korozyon Kontrolü nasıl kullanılır</h2>
<p>Yeni misiniz? Araç çubuğundaki <b>Uygulama örneği yükle…</b> menüsünden bir örnek seçin, ardından girdileri tek tek değiştirin.</p>
<h3>Üç adım</h3>
<ol>
<li><b>Malzeme çifti</b>: birbirine temas eden iki malzemeyi seçin. Kaplamalı parçalarda kaplama metalini seçin. ⇅ ikisinin yerini değiştirir.</li>
<li><b>Ortam</b>: deniz, daldırma, tuz sisi veya yol tuzu için <i>Ağır</i>; dış ortam ve iklimlendirilmemiş iç mekânlar için <i>Normal</i>; kuru, klimalı mekânlar için <i>Kontrollü</i>. Ardından katodun (daha soy metal) anoda <b>alan oranı</b>.</li>
<li><b>Sonucu okuyun</b>: ΔE, hangi malzemenin korozyona uğradığı ve risk göstergesinin rengi.</li>
</ol>
<h3>Risk seviyeleri</h3>
<dl>
<dt class="lvl low">Düşük</dt><dd>ΔE ortam sınırının içinde. Uyumlu.</dd>
<dt class="lvl moderate">Orta</dt><dd>0,15 / 0,25 / 0,50 / 0,75 / 1,00 V merdiveninin bir sonraki basamağına kadar. Bağlantıyı sızdırmaz yapın veya yalıtın.</dd>
<dt class="lvl high">Yüksek</dt><dd>Sınırın iki basamak üzerinde. Kaçının veya yalıtıp suyu uzak tutun.</dd>
<dt class="lvl severe">Ciddi</dt><dd>Daha da fazlası. Bir malzemeyi değiştirin veya tamamen yalıtın.</dd>
</dl>
<p>Alan oranı seviyeyi bir basamak yukarı (küçük anot, büyük katot) veya aşağı (büyük anot, küçük katot) kaydırır. Daha negatif olan taraf çok kararlı pasif bir malzemeyse (titanyum, C-276 alaşımı, platin, grafit) kendisi korozyona uğramaz ve seviye Düşük olur; yine de diğer metallere zarar verebilir.</p>
<h3>İpuçları</h3>
<ul>
<li>Malzeme B'yi seçmek için galvanik seri grafiğindeki bir çubuğa tıklayın, A için Shift-tıklayın.</li>
<li>Uyumluluk matrisi, mevcut ortam ve alan oranı için tüm çiftleri gösterir; yüklemek için bir hücreye tıklayın.</li>
<li><b>Bağlantıyı kopyala</b>, çifti ve ortamı bir bağlantıda saklar.</li>
</ul>
<p class="about-meta">Galvanik seri riski sıralar ancak korozyon hızı vermez. Kritik bağlantıları testle doğrulayın.</p>`,
      es: `<h2 id="help-title">Cómo usar el comprobador de corrosión galvánica</h2>
<p>¿Es nuevo? Elija un ejemplo en <b>Cargar ejemplo de aplicación…</b> en la barra de herramientas y luego cambie una entrada cada vez.</p>
<h3>Tres pasos</h3>
<ol>
<li><b>Par de materiales</b>: elija los dos materiales que se tocan. Para piezas recubiertas elija el metal del recubrimiento. ⇅ los intercambia.</li>
<li><b>Entorno</b>: <i>Severo</i> para marino, inmersión, niebla salina o sales de deshielo; <i>Normal</i> para exterior e interiores sin climatizar; <i>Controlado</i> para locales secos y climatizados. Después la <b>relación de áreas</b> del cátodo (metal más noble) respecto al ánodo.</li>
<li><b>Lea el resultado</b>: ΔE, qué material se corroe y el color del indicador de riesgo.</li>
</ol>
<h3>Niveles de riesgo</h3>
<dl>
<dt class="lvl low">Bajo</dt><dd>ΔE dentro del límite del entorno. Compatible.</dd>
<dt class="lvl moderate">Moderado</dt><dd>Hasta el siguiente escalón de la escala 0,15 / 0,25 / 0,50 / 0,75 / 1,00 V. Selle o aísle la unión.</dd>
<dt class="lvl high">Alto</dt><dd>Dos escalones por encima del límite. Evítelo, o aísle y mantenga fuera el agua.</dd>
<dt class="lvl severe">Grave</dt><dd>Más que eso. Cambie un material o aísle por completo.</dd>
</dl>
<p>La relación de áreas sube el nivel un escalón (ánodo pequeño, cátodo grande) o lo baja (ánodo grande, cátodo pequeño). Si el miembro más negativo es un material pasivo muy estable (titanio, aleación C-276, platino, grafito), no se corroe y el nivel es Bajo; aun así puede atacar a otros metales.</p>
<h3>Consejos</h3>
<ul>
<li>Haga clic en una barra del gráfico de la serie galvánica para elegir el material B; Mayús-clic para el A.</li>
<li>La matriz de compatibilidad muestra cada par para el entorno y la relación de áreas actuales; haga clic en una celda para cargarlo.</li>
<li><b>Copiar enlace</b> guarda el par y el entorno en un enlace.</li>
</ul>
<p class="about-meta">La serie galvánica ordena el riesgo pero no da velocidades de corrosión. Confirme las uniones críticas con ensayos.</p>`,
    },

    theory: {
      en: `<h3>What is galvanic corrosion?</h3>
<p>Galvanic (bimetallic, dissimilar-metal) corrosion is the accelerated corrosion of one metal caused by electrical contact with a more noble metal or conductor in a common electrolyte. The couple forms an electrochemical cell: the less noble metal becomes the <b>anode</b> and its oxidation (M → M<sup>n+</sup> + ne<sup>−</sup>) speeds up, while the more noble metal becomes the <b>cathode</b>, where oxygen reduction (O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup> → 4OH<sup>−</sup>) or hydrogen evolution takes place and its own corrosion slows down (Fontana, 1986; Jones, 1996).</p>
<p>Three conditions must all be met, and removing any one of them stops the cell:</p>
<ol>
<li>two materials with different corrosion potentials,</li>
<li>an electrical (metallic) path between them,</li>
<li>a continuous electrolyte (seawater, condensation, wet deposits) wetting both.</li>
</ol>
<h3>Galvanic series, not the EMF series</h3>
<p>The standard electrode potentials (EMF series) apply to pure metals in solutions of their own ions at unit activity, and rank aluminium and titanium as very active. In practice their passive oxide films shift them far in the noble direction. A <b>galvanic series</b> instead lists measured corrosion potentials of real alloys in a specific environment. ASTM G82 explains how such a series is built and stresses that it is only valid for the environment in which it was measured. This tool uses the classic series in flowing seawater (LaQue, 1975), which is the most widely published and is a conservative reference for other aqueous environments.</p>
<p>Stainless steels appear twice: <b>passive</b> (aerated, free surfaces) and <b>active</b> (inside crevices, under deposits or in stagnant, oxygen-depleted water). The same alloy can change sides in a couple depending on where it is.</p>
<h3>Potential difference and the risk limit</h3>
<p>The driving force of the cell is the potential difference between the two members:</p>
<p class="formula">ΔE = E<sub>corr, cathode</sub> − E<sub>corr, anode</sub></p>
<p>Design guidance derived from the anodic index (MIL-STD-889 practice and earlier MIL-F-14072) limits ΔE to about <b>0.15 V</b> in harsh environments (marine, salt spray, high humidity), <b>0.25 V</b> in normal environments and <b>0.50 V</b> in controlled, dry environments. This tool shows ΔE from the mid-range values and the band from the range extremes, and grades the risk against these limits.</p>
<h3>Why ΔE alone is not the whole story: mixed-potential theory</h3>
<p>According to mixed-potential theory (Wagner &amp; Traud, 1938), the coupled metals polarise to a common <i>galvanic potential</i> E<sub>g</sub> at which the total anodic current equals the total cathodic current. The galvanic current, and so the corrosion rate, depends on the polarisation behaviour (kinetics) of both electrodes and on the electrolyte resistance, not only on ΔE (Zhang, 2011; Revie &amp; Uhlig, 2008). Consequences:</p>
<ul>
<li>A noble metal on which oxygen reduction is slow (e.g. titanium, passive stainless) can be a weaker cathode than its potential suggests; copper alloys and graphite are efficient cathodes.</li>
<li>A highly polarisable, passive anode such as titanium barely corrodes even when it is the more negative member.</li>
<li>In low-conductivity water (fresh water, thin condensate films) the attack is limited to a narrow zone near the junction; in seawater it spreads further.</li>
</ul>
<h3>Area ratio effect</h3>
<p>Charge conservation requires I<sub>a</sub> = I<sub>c</sub>. If the cathodic reaction is limited by oxygen supply to the cathode surface, the galvanic current is roughly proportional to the cathode area, so the anodic current density is</p>
<p class="formula">i<sub>a</sub> ≈ i<sub>c</sub> · A<sub>c</sub> / A<sub>a</sub></p>
<p>A small anode next to a large cathode (steel rivets in copper plate) corrodes very quickly; a large anode with a small cathode (stainless bolts in an aluminium plate) suffers only mild, spread-out attack (Fontana, 1986; Francis, 2001). For the same reason, painting only the anode is dangerous: every coating defect becomes a tiny anode facing the whole cathode.</p>
<h3>Other factors</h3>
<ul>
<li><b>Electrolyte</b>: chlorides, conductivity, temperature and flow velocity all raise the galvanic current. Seawater and de-icing salts are the most severe.</li>
<li><b>Time of wetness</b>: atmospheric galvanic corrosion only runs while a moisture film is present (ISO 9223 corrosivity categories C1–CX).</li>
<li><b>Distance</b>: the attack is concentrated next to the contact line.</li>
<li><b>Corrosion products</b> can stifle or reverse the couple over time (e.g. zinc and steel in hot water above about 60 °C).</li>
</ul>
<h3>Prevention</h3>
<ul>
<li>Select materials close together in the galvanic series; make fasteners and other small parts slightly more noble than the structure.</li>
<li>Insulate: non-conductive washers, sleeves and gaskets, with no bypass through bolts or brackets.</li>
<li>Exclude the electrolyte: sealants, jointing compounds, wet installation of fasteners, drainage.</li>
<li>Coat the cathode (or both members), not only the anode.</li>
<li>Apply cathodic protection with sacrificial anodes or impressed current in immersion service.</li>
</ul>
<p class="about-meta">The galvanic series ranks risk; it does not predict corrosion rates. For critical designs measure the couple in the real electrolyte (ASTM G71) or consult a corrosion engineer.</p>`,
      de: `<h3>Was ist Kontaktkorrosion?</h3>
<p>Kontaktkorrosion (galvanische oder bimetallische Korrosion) ist die beschleunigte Korrosion eines Metalls durch elektrischen Kontakt mit einem edleren Metall oder Leiter in einem gemeinsamen Elektrolyten. Die Paarung bildet ein galvanisches Element: das unedlere Metall wird zur <b>Anode</b>, seine Oxidation (M → M<sup>n+</sup> + ne<sup>−</sup>) beschleunigt sich, während das edlere Metall zur <b>Kathode</b> wird, an der Sauerstoffreduktion (O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup> → 4OH<sup>−</sup>) oder Wasserstoffentwicklung abläuft und dessen eigene Korrosion sich verlangsamt (Fontana, 1986; Jones, 1996).</p>
<p>Drei Bedingungen müssen gleichzeitig erfüllt sein; fehlt eine davon, kommt das Element zum Erliegen:</p>
<ol>
<li>zwei Werkstoffe mit unterschiedlichen Korrosionspotentialen,</li>
<li>eine elektrisch leitende (metallische) Verbindung zwischen ihnen,</li>
<li>ein durchgehender Elektrolyt (Meerwasser, Kondensat, feuchte Ablagerungen), der beide benetzt.</li>
</ol>
<h3>Praktische Spannungsreihe statt elektrochemischer Spannungsreihe</h3>
<p>Die Standardelektrodenpotentiale (elektrochemische Spannungsreihe) gelten für reine Metalle in Lösungen ihrer eigenen Ionen bei Aktivität eins und stufen Aluminium und Titan als sehr unedel ein. In der Praxis verschieben ihre passiven Oxidschichten sie weit in Richtung edel. Eine <b>galvanische (praktische) Spannungsreihe</b> listet stattdessen gemessene Korrosionspotentiale realer Legierungen in einer bestimmten Umgebung. ASTM G82 beschreibt den Aufbau einer solchen Reihe und betont, dass sie nur für die Umgebung gilt, in der sie gemessen wurde. Dieses Werkzeug verwendet die klassische Reihe in strömendem Meerwasser (LaQue, 1975), die am weitesten verbreitet ist und für andere wässrige Umgebungen eine konservative Referenz darstellt.</p>
<p>Edelstähle erscheinen zweimal: <b>passiv</b> (belüftete, freie Oberflächen) und <b>aktiv</b> (in Spalten, unter Ablagerungen oder in stehendem, sauerstoffarmem Wasser). Dieselbe Legierung kann je nach Ort die Seite in einer Paarung wechseln.</p>
<h3>Potentialdifferenz und Risikogrenze</h3>
<p>Die treibende Kraft des Elements ist die Potentialdifferenz zwischen den beiden Partnern:</p>
<p class="formula">ΔE = E<sub>corr, Kathode</sub> − E<sub>corr, Anode</sub></p>
<p>Aus dem Anodic Index abgeleitete Auslegungsregeln (Praxis nach MIL-STD-889 und der früheren MIL-F-14072) begrenzen ΔE auf etwa <b>0,15 V</b> in rauen Umgebungen (maritim, Salznebel, hohe Feuchte), <b>0,25 V</b> in normalen Umgebungen und <b>0,50 V</b> in klimatisierten, trockenen Umgebungen. Dieses Werkzeug zeigt ΔE aus den Bereichsmitten und den Bereich aus den Bereichsgrenzen und stuft das Risiko gegen diese Grenzwerte ein.</p>
<h3>Warum ΔE allein nicht reicht: Mischpotentialtheorie</h3>
<p>Nach der Mischpotentialtheorie (Wagner &amp; Traud, 1938) polarisieren die gekoppelten Metalle auf ein gemeinsames <i>galvanisches Potential</i> E<sub>g</sub>, bei dem der gesamte anodische Strom gleich dem gesamten kathodischen Strom ist. Der galvanische Strom und damit die Korrosionsrate hängen vom Polarisationsverhalten (der Kinetik) beider Elektroden und vom Elektrolytwiderstand ab, nicht nur von ΔE (Zhang, 2011; Revie &amp; Uhlig, 2008). Folgen:</p>
<ul>
<li>Ein edles Metall, an dem die Sauerstoffreduktion langsam abläuft (z. B. Titan, passiver Edelstahl), kann eine schwächere Kathode sein, als sein Potential vermuten lässt; Kupferlegierungen und Graphit sind wirksame Kathoden.</li>
<li>Eine stark polarisierbare, passive Anode wie Titan korrodiert kaum, selbst wenn sie der negativere Partner ist.</li>
<li>In schwach leitendem Wasser (Süßwasser, dünne Kondensatfilme) beschränkt sich der Angriff auf eine schmale Zone an der Kontaktstelle; in Meerwasser reicht er weiter.</li>
</ul>
<h3>Einfluss des Flächenverhältnisses</h3>
<p>Ladungserhaltung verlangt I<sub>a</sub> = I<sub>c</sub>. Ist die kathodische Reaktion durch den Sauerstofftransport zur Kathodenoberfläche begrenzt, ist der galvanische Strom etwa proportional zur Kathodenfläche, und die anodische Stromdichte beträgt</p>
<p class="formula">i<sub>a</sub> ≈ i<sub>c</sub> · A<sub>c</sub> / A<sub>a</sub></p>
<p>Eine kleine Anode neben einer großen Kathode (Stahlniete in Kupferblech) korrodiert sehr schnell; eine große Anode mit kleiner Kathode (Edelstahlschrauben in Aluminiumblech) erleidet nur einen milden, verteilten Angriff (Fontana, 1986; Francis, 2001). Aus demselben Grund ist es gefährlich, nur die Anode zu beschichten: jeder Beschichtungsfehler wird zu einer winzigen Anode gegenüber der ganzen Kathode.</p>
<h3>Weitere Einflüsse</h3>
<ul>
<li><b>Elektrolyt</b>: Chloride, Leitfähigkeit, Temperatur und Strömungsgeschwindigkeit erhöhen den galvanischen Strom. Meerwasser und Streusalz sind am kritischsten.</li>
<li><b>Befeuchtungsdauer</b>: atmosphärische Kontaktkorrosion läuft nur, solange ein Feuchtefilm vorhanden ist (Korrosivitätskategorien C1–CX nach ISO 9223).</li>
<li><b>Abstand</b>: der Angriff konzentriert sich nahe der Kontaktlinie.</li>
<li><b>Korrosionsprodukte</b> können das Element mit der Zeit hemmen oder umpolen (z. B. Zink und Stahl in heißem Wasser über etwa 60 °C).</li>
</ul>
<h3>Vermeidung</h3>
<ul>
<li>Werkstoffe wählen, die in der Spannungsreihe nahe beieinanderliegen; Verbindungselemente und andere kleine Teile etwas edler als die Struktur wählen.</li>
<li>Isolieren: nichtleitende Scheiben, Hülsen und Dichtungen, ohne Nebenschluss über Schrauben oder Halter.</li>
<li>Elektrolyten fernhalten: Dichtmassen, Fugenmassen, Nassmontage der Verbindungselemente, Entwässerung.</li>
<li>Die Kathode (oder beide Partner) beschichten, nicht nur die Anode.</li>
<li>Bei Eintauchbetrieb kathodischen Schutz mit Opferanoden oder Fremdstrom vorsehen.</li>
</ul>
<p class="about-meta">Die Spannungsreihe ordnet das Risiko ein; sie sagt keine Korrosionsraten voraus. Bei kritischen Konstruktionen die Paarung im realen Elektrolyten messen (ASTM G71) oder einen Korrosionsfachmann hinzuziehen.</p>`,
      nl: `<h3>Wat is galvanische corrosie?</h3>
<p>Galvanische (bimetaal-, contact)corrosie is de versnelde corrosie van een metaal door elektrisch contact met een edeler metaal of geleider in een gemeenschappelijke elektrolyt. De combinatie vormt een elektrochemische cel: het minder edele metaal wordt de <b>anode</b> en de oxidatie ervan (M → M<sup>n+</sup> + ne<sup>−</sup>) versnelt, terwijl het edelere metaal de <b>kathode</b> wordt, waar zuurstofreductie (O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup> → 4OH<sup>−</sup>) of waterstofontwikkeling plaatsvindt en de eigen corrosie vertraagt (Fontana, 1986; Jones, 1996).</p>
<p>Er moet aan drie voorwaarden tegelijk worden voldaan; valt er één weg, dan stopt de cel:</p>
<ol>
<li>twee materialen met verschillende corrosiepotentialen,</li>
<li>een elektrische (metallische) verbinding ertussen,</li>
<li>een doorlopende elektrolyt (zeewater, condens, natte afzettingen) die beide bevochtigt.</li>
</ol>
<h3>Galvanische reeks, niet de spanningsreeks</h3>
<p>De standaardelektrodepotentialen (elektrochemische spanningsreeks) gelden voor zuivere metalen in oplossingen van hun eigen ionen bij activiteit één en rangschikken aluminium en titaan als zeer actief. In de praktijk verschuiven hun passieve oxidelagen ze ver in de edele richting. Een <b>galvanische reeks</b> geeft in plaats daarvan gemeten corrosiepotentialen van echte legeringen in een bepaalde omgeving. ASTM G82 beschrijft hoe zo'n reeks wordt opgesteld en benadrukt dat ze alleen geldt voor de omgeving waarin ze is gemeten. Deze tool gebruikt de klassieke reeks in stromend zeewater (LaQue, 1975), die het meest gepubliceerd is en een conservatieve referentie vormt voor andere waterige omgevingen.</p>
<p>Roestvast staal staat er twee keer in: <b>passief</b> (beluchte, vrije oppervlakken) en <b>actief</b> (in spleten, onder afzettingen of in stilstaand, zuurstofarm water). Dezelfde legering kan dus van kant wisselen in een combinatie, afhankelijk van waar ze zit.</p>
<h3>Potentiaalverschil en de risicogrens</h3>
<p>De drijvende kracht van de cel is het potentiaalverschil tussen de twee leden:</p>
<p class="formula">ΔE = E<sub>corr, kathode</sub> − E<sub>corr, anode</sub></p>
<p>Ontwerprichtlijnen afgeleid van de anodische index (praktijk volgens MIL-STD-889 en de eerdere MIL-F-14072) beperken ΔE tot ongeveer <b>0,15 V</b> in zware omgevingen (maritiem, zoutnevel, hoge vochtigheid), <b>0,25 V</b> in normale omgevingen en <b>0,50 V</b> in geconditioneerde, droge omgevingen. Deze tool toont ΔE op basis van de middenwaarden en de band op basis van de uitersten van de bereiken, en beoordeelt het risico ten opzichte van deze grenzen.</p>
<h3>Waarom ΔE alleen niet volstaat: mengpotentiaaltheorie</h3>
<p>Volgens de mengpotentiaaltheorie (Wagner &amp; Traud, 1938) polariseren de gekoppelde metalen naar een gemeenschappelijke <i>galvanische potentiaal</i> E<sub>g</sub>, waarbij de totale anodische stroom gelijk is aan de totale kathodische stroom. De galvanische stroom, en dus de corrosiesnelheid, hangt af van het polarisatiegedrag (de kinetiek) van beide elektroden en van de weerstand van de elektrolyt, niet alleen van ΔE (Zhang, 2011; Revie &amp; Uhlig, 2008). Gevolgen:</p>
<ul>
<li>Een edel metaal waarop zuurstofreductie langzaam verloopt (bijv. titaan, passief roestvast staal) kan een zwakkere kathode zijn dan de potentiaal doet vermoeden; koperlegeringen en grafiet zijn effectieve kathodes.</li>
<li>Een sterk polariseerbare, passieve anode zoals titaan corrodeert nauwelijks, ook als het het negatievere lid is.</li>
<li>In slecht geleidend water (zoet water, dunne condensfilms) blijft de aantasting beperkt tot een smalle zone bij de verbinding; in zeewater reikt ze verder.</li>
</ul>
<h3>Effect van de oppervlakteverhouding</h3>
<p>Ladingsbehoud vereist I<sub>a</sub> = I<sub>c</sub>. Als de kathodische reactie beperkt wordt door de zuurstoftoevoer naar het kathodeoppervlak, is de galvanische stroom ongeveer evenredig met het kathodeoppervlak, en is de anodische stroomdichtheid</p>
<p class="formula">i<sub>a</sub> ≈ i<sub>c</sub> · A<sub>c</sub> / A<sub>a</sub></p>
<p>Een kleine anode naast een grote kathode (stalen klinknagels in koperplaat) corrodeert zeer snel; een grote anode met een kleine kathode (RVS-bouten in een aluminium plaat) ondervindt slechts milde, gespreide aantasting (Fontana, 1986; Francis, 2001). Om dezelfde reden is het gevaarlijk om alleen de anode te schilderen: elke beschadiging in de coating wordt een piepkleine anode tegenover de hele kathode.</p>
<h3>Andere factoren</h3>
<ul>
<li><b>Elektrolyt</b>: chloriden, geleidbaarheid, temperatuur en stroomsnelheid verhogen allemaal de galvanische stroom. Zeewater en strooizout zijn het zwaarst.</li>
<li><b>Bevochtigingsduur</b>: atmosferische galvanische corrosie loopt alleen zolang er een vochtfilm is (corrosiviteitscategorieën C1–CX volgens ISO 9223).</li>
<li><b>Afstand</b>: de aantasting concentreert zich vlak bij de contactlijn.</li>
<li><b>Corrosieproducten</b> kunnen het koppel na verloop van tijd remmen of omkeren (bijv. zink en staal in heet water boven ongeveer 60 °C).</li>
</ul>
<h3>Voorkomen</h3>
<ul>
<li>Kies materialen die dicht bij elkaar liggen in de galvanische reeks; maak bevestigingsmiddelen en andere kleine delen iets edeler dan de constructie.</li>
<li>Isoleer: niet-geleidende ringen, hulzen en pakkingen, zonder kortsluiting via bouten of beugels.</li>
<li>Houd de elektrolyt buiten: kitten, afdichtmiddelen, natte montage van bevestigingsmiddelen, afwatering.</li>
<li>Coat de kathode (of beide leden), niet alleen de anode.</li>
<li>Pas bij ondergedompeld gebruik kathodische bescherming toe met opofferingsanodes of opgedrukte stroom.</li>
</ul>
<p class="about-meta">De galvanische reeks rangschikt het risico; ze voorspelt geen corrosiesnelheden. Meet bij kritische ontwerpen het koppel in de echte elektrolyt (ASTM G71) of raadpleeg een corrosie-ingenieur.</p>`,
      tr: `<h3>Galvanik korozyon nedir?</h3>
<p>Galvanik (bimetalik, farklı metal) korozyon, bir metalin ortak bir elektrolit içinde daha soy bir metal veya iletkenle elektriksel temas etmesi sonucu hızlanan korozyonudur. Çift elektrokimyasal bir hücre oluşturur: daha az soy metal <b>anot</b> olur ve oksidasyonu (M → M<sup>n+</sup> + ne<sup>−</sup>) hızlanır; daha soy metal ise <b>katot</b> olur, üzerinde oksijen indirgenmesi (O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup> → 4OH<sup>−</sup>) veya hidrojen çıkışı gerçekleşir ve kendi korozyonu yavaşlar (Fontana, 1986; Jones, 1996).</p>
<p>Üç koşulun tamamı sağlanmalıdır; herhangi biri ortadan kalkarsa hücre durur:</p>
<ol>
<li>korozyon potansiyelleri farklı iki malzeme,</li>
<li>aralarında elektriksel (metalik) bir yol,</li>
<li>her ikisini de ıslatan sürekli bir elektrolit (deniz suyu, yoğuşma, ıslak birikintiler).</li>
</ol>
<h3>EMF serisi değil, galvanik seri</h3>
<p>Standart elektrot potansiyelleri (EMF serisi), birim aktivitede kendi iyonlarının çözeltisindeki saf metaller için geçerlidir ve alüminyum ile titanyumu çok aktif gösterir. Uygulamada pasif oksit filmleri onları soy yönde epeyce kaydırır. <b>Galvanik seri</b> ise gerçek alaşımların belirli bir ortamda ölçülen korozyon potansiyellerini listeler. ASTM G82 böyle bir serinin nasıl oluşturulduğunu açıklar ve yalnızca ölçüldüğü ortam için geçerli olduğunu vurgular. Bu araç, en yaygın yayımlanan ve diğer sulu ortamlar için ihtiyatlı bir referans olan akan deniz suyundaki klasik seriyi (LaQue, 1975) kullanır.</p>
<p>Paslanmaz çelikler iki kez yer alır: <b>pasif</b> (havalandırılmış, açık yüzeyler) ve <b>aktif</b> (aralıkların içinde, birikintilerin altında veya durgun, oksijeni az suda). Aynı alaşım, bulunduğu yere göre bir çiftte taraf değiştirebilir.</p>
<h3>Potansiyel farkı ve risk sınırı</h3>
<p>Hücrenin itici gücü iki taraf arasındaki potansiyel farkıdır:</p>
<p class="formula">ΔE = E<sub>corr, katot</sub> − E<sub>corr, anot</sub></p>
<p>Anodik indeksten türetilen tasarım kılavuzları (MIL-STD-889 uygulaması ve daha önceki MIL-F-14072) ΔE'yi ağır ortamlarda (deniz, tuz sisi, yüksek nem) yaklaşık <b>0,15 V</b>, normal ortamlarda <b>0,25 V</b> ve kontrollü, kuru ortamlarda <b>0,50 V</b> ile sınırlar. Bu araç ΔE'yi aralık ortalarından, bandı ise aralık uçlarından hesaplar ve riski bu sınırlara göre derecelendirir.</p>
<h3>ΔE neden tek başına yeterli değildir: karma potansiyel teorisi</h3>
<p>Karma potansiyel teorisine göre (Wagner &amp; Traud, 1938), birleştirilen metaller toplam anodik akımın toplam katodik akıma eşit olduğu ortak bir <i>galvanik potansiyele</i> E<sub>g</sub> polarize olur. Galvanik akım ve dolayısıyla korozyon hızı, yalnızca ΔE'ye değil, her iki elektrodun polarizasyon davranışına (kinetiğine) ve elektrolit direncine de bağlıdır (Zhang, 2011; Revie &amp; Uhlig, 2008). Sonuçları:</p>
<ul>
<li>Üzerinde oksijen indirgenmesi yavaş olan soy bir metal (ör. titanyum, pasif paslanmaz çelik), potansiyelinin düşündürdüğünden daha zayıf bir katot olabilir; bakır alaşımları ve grafit etkili katotlardır.</li>
<li>Titanyum gibi kolay polarize olan pasif bir anot, daha negatif taraf olsa bile neredeyse hiç korozyona uğramaz.</li>
<li>İletkenliği düşük suda (tatlı su, ince yoğuşma filmleri) etki, birleşme yerinin yakınındaki dar bir bölgeyle sınırlı kalır; deniz suyunda daha geniş bir alana yayılır.</li>
</ul>
<h3>Alan oranı etkisi</h3>
<p>Yük korunumu I<sub>a</sub> = I<sub>c</sub> olmasını gerektirir. Katodik reaksiyon katot yüzeyine oksijen taşınımıyla sınırlıysa, galvanik akım yaklaşık olarak katot alanıyla orantılıdır; bu durumda anodik akım yoğunluğu</p>
<p class="formula">i<sub>a</sub> ≈ i<sub>c</sub> · A<sub>c</sub> / A<sub>a</sub></p>
<p>olur. Büyük bir katodun yanındaki küçük bir anot (bakır sacda çelik perçinler) çok hızlı korozyona uğrar; küçük bir katotla birlikte büyük bir anot (alüminyum sacda paslanmaz cıvatalar) yalnızca hafif ve yayılmış bir etkiye maruz kalır (Fontana, 1986; Francis, 2001). Aynı nedenle yalnızca anodu boyamak tehlikelidir: her kaplama kusuru, tüm katoda karşı çok küçük bir anot haline gelir.</p>
<h3>Diğer etkenler</h3>
<ul>
<li><b>Elektrolit</b>: klorürler, iletkenlik, sıcaklık ve akış hızı galvanik akımı artırır. Deniz suyu ve yol tuzu en ağır koşullardır.</li>
<li><b>Islaklık süresi</b>: atmosferik galvanik korozyon yalnızca nem filmi varken ilerler (ISO 9223 korozivite kategorileri C1–CX).</li>
<li><b>Mesafe</b>: etki temas çizgisinin yakınında yoğunlaşır.</li>
<li><b>Korozyon ürünleri</b> zamanla çifti zayıflatabilir veya tersine çevirebilir (ör. yaklaşık 60 °C üzerindeki sıcak suda çinko ve çelik).</li>
</ul>
<h3>Önleme</h3>
<ul>
<li>Galvanik seride birbirine yakın malzemeler seçin; bağlantı elemanlarını ve diğer küçük parçaları yapıdan biraz daha soy yapın.</li>
<li>Yalıtın: iletken olmayan pullar, burçlar ve contalar; cıvata veya braketler üzerinden köprü oluşmasın.</li>
<li>Elektroliti uzak tutun: sızdırmazlık macunları, derz dolguları, bağlantı elemanlarının ıslak montajı, drenaj.</li>
<li>Yalnızca anodu değil, katodu (veya her ikisini) kaplayın.</li>
<li>Daldırma koşullarında kurban anotlarla veya dış akımla katodik koruma uygulayın.</li>
</ul>
<p class="about-meta">Galvanik seri riski sıralar; korozyon hızını öngörmez. Kritik tasarımlarda çifti gerçek elektrolitte ölçün (ASTM G71) veya bir korozyon mühendisine danışın.</p>`,
      es: `<h3>¿Qué es la corrosión galvánica?</h3>
<p>La corrosión galvánica (bimetálica, entre metales distintos) es la corrosión acelerada de un metal causada por el contacto eléctrico con un metal o conductor más noble en un electrolito común. El par forma una celda electroquímica: el metal menos noble se convierte en el <b>ánodo</b> y su oxidación (M → M<sup>n+</sup> + ne<sup>−</sup>) se acelera, mientras que el metal más noble se convierte en el <b>cátodo</b>, donde tiene lugar la reducción de oxígeno (O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup> → 4OH<sup>−</sup>) o la evolución de hidrógeno y su propia corrosión se ralentiza (Fontana, 1986; Jones, 1996).</p>
<p>Deben cumplirse las tres condiciones; si se elimina cualquiera de ellas, la celda se detiene:</p>
<ol>
<li>dos materiales con potenciales de corrosión distintos,</li>
<li>un camino eléctrico (metálico) entre ellos,</li>
<li>un electrolito continuo (agua de mar, condensación, depósitos húmedos) que moje a ambos.</li>
</ol>
<h3>Serie galvánica, no la serie electroquímica</h3>
<p>Los potenciales estándar de electrodo (serie electroquímica o FEM) se aplican a metales puros en disoluciones de sus propios iones con actividad unitaria, y clasifican el aluminio y el titanio como muy activos. En la práctica, sus películas pasivas de óxido los desplazan mucho hacia el lado noble. Una <b>serie galvánica</b>, en cambio, recoge potenciales de corrosión medidos de aleaciones reales en un entorno concreto. ASTM G82 explica cómo se construye esa serie y subraya que solo es válida para el entorno en que se midió. Esta herramienta usa la serie clásica en agua de mar en movimiento (LaQue, 1975), la más publicada y una referencia conservadora para otros entornos acuosos.</p>
<p>Los aceros inoxidables aparecen dos veces: <b>pasivos</b> (superficies libres y aireadas) y <b>activos</b> (dentro de resquicios, bajo depósitos o en agua estancada con poco oxígeno). La misma aleación puede cambiar de papel en un par según dónde se encuentre.</p>
<h3>Diferencia de potencial y límite de riesgo</h3>
<p>La fuerza impulsora de la celda es la diferencia de potencial entre los dos miembros:</p>
<p class="formula">ΔE = E<sub>corr, cátodo</sub> − E<sub>corr, ánodo</sub></p>
<p>Las guías de diseño derivadas del índice anódico (práctica de MIL-STD-889 y la anterior MIL-F-14072) limitan ΔE a unos <b>0,15 V</b> en entornos severos (marino, niebla salina, alta humedad), <b>0,25 V</b> en entornos normales y <b>0,50 V</b> en entornos controlados y secos. Esta herramienta muestra ΔE a partir de los valores medios y la banda a partir de los extremos de los intervalos, y gradúa el riesgo frente a estos límites.</p>
<h3>Por qué ΔE no lo explica todo: teoría del potencial mixto</h3>
<p>Según la teoría del potencial mixto (Wagner &amp; Traud, 1938), los metales acoplados se polarizan hasta un <i>potencial galvánico</i> común E<sub>g</sub> en el que la corriente anódica total es igual a la corriente catódica total. La corriente galvánica, y por tanto la velocidad de corrosión, depende del comportamiento de polarización (la cinética) de ambos electrodos y de la resistencia del electrolito, no solo de ΔE (Zhang, 2011; Revie &amp; Uhlig, 2008). Consecuencias:</p>
<ul>
<li>Un metal noble sobre el que la reducción de oxígeno es lenta (p. ej. titanio, inoxidable pasivo) puede ser un cátodo más débil de lo que sugiere su potencial; las aleaciones de cobre y el grafito son cátodos eficaces.</li>
<li>Un ánodo pasivo muy polarizable, como el titanio, apenas se corroe aunque sea el miembro más negativo.</li>
<li>En agua de baja conductividad (agua dulce, películas finas de condensación) el ataque se limita a una zona estrecha junto a la unión; en agua de mar se extiende más.</li>
</ul>
<h3>Efecto de la relación de áreas</h3>
<p>La conservación de la carga exige I<sub>a</sub> = I<sub>c</sub>. Si la reacción catódica está limitada por el aporte de oxígeno a la superficie del cátodo, la corriente galvánica es aproximadamente proporcional al área del cátodo, y la densidad de corriente anódica es</p>
<p class="formula">i<sub>a</sub> ≈ i<sub>c</sub> · A<sub>c</sub> / A<sub>a</sub></p>
<p>Un ánodo pequeño junto a un cátodo grande (remaches de acero en chapa de cobre) se corroe muy rápido; un ánodo grande con un cátodo pequeño (tornillos inoxidables en chapa de aluminio) sufre solo un ataque leve y repartido (Fontana, 1986; Francis, 2001). Por la misma razón es peligroso pintar solo el ánodo: cada defecto del recubrimiento se convierte en un ánodo diminuto frente a todo el cátodo.</p>
<h3>Otros factores</h3>
<ul>
<li><b>Electrolito</b>: los cloruros, la conductividad, la temperatura y la velocidad del flujo aumentan la corriente galvánica. El agua de mar y las sales de deshielo son los casos más severos.</li>
<li><b>Tiempo de humectación</b>: la corrosión galvánica atmosférica solo avanza mientras hay una película de humedad (categorías de corrosividad C1–CX de ISO 9223).</li>
<li><b>Distancia</b>: el ataque se concentra junto a la línea de contacto.</li>
<li><b>Los productos de corrosión</b> pueden frenar o invertir el par con el tiempo (p. ej. zinc y acero en agua caliente por encima de unos 60 °C).</li>
</ul>
<h3>Prevención</h3>
<ul>
<li>Elija materiales próximos en la serie galvánica; haga la tornillería y otras piezas pequeñas algo más nobles que la estructura.</li>
<li>Aísle: arandelas, casquillos y juntas no conductores, sin puentes a través de tornillos o soportes.</li>
<li>Excluya el electrolito: sellantes, compuestos de juntas, instalación en húmedo de la tornillería, drenaje.</li>
<li>Recubra el cátodo (o ambos miembros), no solo el ánodo.</li>
<li>En servicio sumergido aplique protección catódica con ánodos de sacrificio o corriente impresa.</li>
</ul>
<p class="about-meta">La serie galvánica ordena el riesgo; no predice velocidades de corrosión. En diseños críticos mida el par en el electrolito real (ASTM G71) o consulte a un ingeniero de corrosión.</p>`,
    },
  };

  // References: the citations stay in their original language; only the
  // "used for" line is translated.
  const REFS = [
    ['ASTM G82-98 (reapproved 2021). <i>Standard Guide for Development and Use of a Galvanic Series for Predicting Galvanic Corrosion Performance.</i> ASTM International, West Conshohocken, PA.',
      ['Source of the seawater galvanic series (Fig. 1).', 'Quelle der galvanischen Spannungsreihe in Meerwasser (Abb. 1).', 'Bron van de galvanische reeks in zeewater (fig. 1).', 'Deniz suyu galvanik serisinin kaynağı (Şekil 1).', 'Fuente de la serie galvánica en agua de mar (fig. 1).']],
    ['ASTM G71-81 (reapproved 2019). <i>Standard Guide for Conducting and Evaluating Galvanic Corrosion Tests in Electrolytes.</i> ASTM International.',
      ['Test method for real couples.', 'Prüfverfahren für reale Paarungen.', 'Beproevingsmethode voor echte combinaties.', 'Gerçek çiftler için test yöntemi.', 'Método de ensayo para pares reales.']],
    ['LaQue, F. L. (1975). <i>Marine Corrosion: Causes and Prevention.</i> Wiley-Interscience, New York.',
      ['Original galvanic series in flowing seawater.', 'Ursprüngliche Spannungsreihe in strömendem Meerwasser.', 'Oorspronkelijke galvanische reeks in stromend zeewater.', 'Akan deniz suyundaki özgün galvanik seri.', 'Serie galvánica original en agua de mar en movimiento.']],
    ['MIL-STD-889. <i>Dissimilar Metals</i> (galvanic compatibility of electrically conductive materials). U.S. Department of Defense.',
      ['Compatibility practice and anodic-index limits.', 'Verträglichkeitspraxis und Anodic-Index-Grenzwerte.', 'Compatibiliteitspraktijk en grenzen van de anodische index.', 'Uyumluluk uygulaması ve anodik indeks sınırları.', 'Práctica de compatibilidad y límites del índice anódico.']],
    ['Wagner, C., &amp; Traud, W. (1938). Über die Deutung von Korrosionsvorgängen durch Überlagerung von elektrochemischen Teilvorgängen und über die Potentialbildung an Mischelektroden. <i>Zeitschrift für Elektrochemie</i>, 44, 391–402.',
      ['Mixed-potential theory.', 'Mischpotentialtheorie.', 'Mengpotentiaaltheorie.', 'Karma potansiyel teorisi.', 'Teoría del potencial mixto.']],
    ['Fontana, M. G. (1986). <i>Corrosion Engineering</i> (3rd ed.). McGraw-Hill, New York. Ch. 3, Galvanic or two-metal corrosion.',
      ['Area effect, distance effect, prevention.', 'Flächeneffekt, Abstandseffekt, Vermeidung.', 'Oppervlakte-effect, afstandseffect, preventie.', 'Alan etkisi, mesafe etkisi, önleme.', 'Efecto del área, efecto de la distancia, prevención.']],
    ['Jones, D. A. (1996). <i>Principles and Prevention of Corrosion</i> (2nd ed.). Prentice Hall, Upper Saddle River, NJ. Ch. 6, Galvanic and concentration cell corrosion.',
      ['Electrochemistry and polarisation of couples.', 'Elektrochemie und Polarisation von Paarungen.', 'Elektrochemie en polarisatie van koppels.', 'Çiftlerin elektrokimyası ve polarizasyonu.', 'Electroquímica y polarización de pares.']],
    ['Revie, R. W., &amp; Uhlig, H. H. (2008). <i>Corrosion and Corrosion Control: An Introduction to Corrosion Science and Engineering</i> (4th ed.). Wiley, Hoboken, NJ.',
      ['EMF series versus galvanic series, passivity.', 'Elektrochemische gegenüber praktischer Spannungsreihe, Passivität.', 'Spanningsreeks tegenover galvanische reeks, passiviteit.', 'EMF serisi ile galvanik seri karşılaştırması, pasiflik.', 'Serie electroquímica frente a serie galvánica, pasividad.']],
    ['Zhang, X. G. (2011). Galvanic corrosion. In R. W. Revie (Ed.), <i>Uhlig\'s Corrosion Handbook</i> (3rd ed., pp. 123–143). Wiley, Hoboken, NJ.',
      ['Galvanic current, potential distribution, modelling.', 'Galvanischer Strom, Potentialverteilung, Modellierung.', 'Galvanische stroom, potentiaalverdeling, modellering.', 'Galvanik akım, potansiyel dağılımı, modelleme.', 'Corriente galvánica, distribución de potencial, modelización.']],
    ['Francis, R. (2001). <i>Galvanic Corrosion: A Practical Guide for Engineers.</i> NACE International, Houston, TX.',
      ['Practical couples, area ratios, mitigation.', 'Praktische Paarungen, Flächenverhältnisse, Abhilfe.', 'Praktische combinaties, oppervlakteverhoudingen, maatregelen.', 'Pratik çiftler, alan oranları, önlemler.', 'Pares prácticos, relaciones de áreas, mitigación.']],
    ['Hack, H. P. (Ed.) (1988). <i>Galvanic Corrosion.</i> ASTM STP 978. ASTM, Philadelphia.',
      ['Collected research papers on galvanic corrosion.', 'Sammlung von Forschungsarbeiten zur Kontaktkorrosion.', 'Verzameling onderzoeksartikelen over galvanische corrosie.', 'Galvanik korozyon üzerine derlenmiş araştırma makaleleri.', 'Recopilación de artículos de investigación sobre corrosión galvánica.']],
    ['ISO 9223:2012. <i>Corrosion of metals and alloys — Corrosivity of atmospheres — Classification, determination and estimation.</i> ISO, Geneva.',
      ['Atmospheric corrosivity categories C1–CX.', 'Korrosivitätskategorien der Atmosphäre C1–CX.', 'Corrosiviteitscategorieën van de atmosfeer C1–CX.', 'Atmosferik korozivite kategorileri C1–CX.', 'Categorías de corrosividad atmosférica C1–CX.']],
  ];
  HTML.refs = {};
  Object.keys(LANGS).forEach((l, i) => {
    HTML.refs[l] = '<ol class="refs">\n' + REFS.map(([c, use]) => `<li>${c} <span class="ref-use">${use[i]}</span></li>`).join('\n') + '\n</ol>';
  });

  // Page title and description per language (search results, link previews).
  const META = {
    title: {
      en: 'Galvanic Corrosion Checker: dissimilar metal compatibility and potential difference',
      de: 'Kontaktkorrosions-Prüfer: Verträglichkeit unterschiedlicher Metalle und Potentialdifferenz',
      nl: 'Galvanische-corrosiecheck: compatibiliteit van ongelijke metalen en potentiaalverschil',
      tr: 'Galvanik Korozyon Kontrolü: farklı metallerin uyumluluğu ve potansiyel farkı',
      es: 'Comprobador de corrosión galvánica: compatibilidad de metales distintos y diferencia de potencial',
    },
    description: {
      en: 'Free online galvanic corrosion risk checker: pick two materials, see the potential difference in the seawater galvanic series (ASTM G82), which metal corrodes, and a colour-coded risk for marine, outdoor or indoor environments, with the area-ratio effect, mitigation advice and academic references.',
      de: 'Kostenloser Online-Prüfer für Kontaktkorrosion: zwei Werkstoffe wählen und die Potentialdifferenz in der galvanischen Spannungsreihe in Meerwasser (ASTM G82), das korrodierende Metall und ein farbcodiertes Risiko für maritime, Außen- oder Innenumgebungen sehen, mit Flächenverhältnis, Abhilfemaßnahmen und Fachliteratur.',
      nl: 'Gratis online check op galvanische corrosie: kies twee materialen en zie het potentiaalverschil in de galvanische reeks in zeewater (ASTM G82), welk metaal corrodeert en een risico met kleurcode voor maritieme, buiten- of binnenomgevingen, met oppervlakteverhouding, maatregelen en wetenschappelijke bronnen.',
      tr: 'Ücretsiz çevrim içi galvanik korozyon risk kontrolü: iki malzeme seçin; deniz suyu galvanik serisindeki (ASTM G82) potansiyel farkını, hangi metalin korozyona uğradığını ve deniz, dış veya iç ortamlar için renk kodlu riski görün; alan oranı etkisi, önleme önerileri ve akademik kaynaklarla.',
      es: 'Comprobador gratuito en línea del riesgo de corrosión galvánica: elija dos materiales y vea la diferencia de potencial en la serie galvánica en agua de mar (ASTM G82), qué metal se corroe y un riesgo con código de colores para entornos marinos, exteriores o interiores, con el efecto de la relación de áreas, medidas de mitigación y referencias académicas.',
    },
  };

  const DICT = { de: {}, nl: {}, tr: {}, es: {} };
  for (const [en, de, nl, tr, es] of ROWS) { DICT.de[en] = de; DICT.nl[en] = nl; DICT.tr[en] = tr; DICT.es[en] = es; }

  let lang = 'en';
  const fill = (tpl, p) => (p ? tpl.replace(/\{(\w+)\}/g, (m, k) => (k in p ? String(p[k]) : m)) : tpl);

  /** Translate a text (English key) and fill {placeholders}; string parameters are translated too. */
  function t(text, params) {
    if (text === undefined || text === null) return '';
    const tr = lang === 'en' ? text : (DICT[lang][text] !== undefined ? DICT[lang][text] : text);
    if (!params) return tr;
    const p = {};
    for (const k in params) p[k] = typeof params[k] === 'string' && lang !== 'en' && DICT[lang][params[k]] !== undefined ? DICT[lang][params[k]] : params[k];
    return fill(tr, p);
  }

  // ----- Static page translation -----
  let staticNodes = null; // [{ node, en, lead, trail }] and [{ el, attr, en }]
  function collectStatic() {
    const texts = [], attrs = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest('script,style,[data-i18n-html],[data-i18n-skip]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const raw = n.nodeValue, en = raw.trim();
      if (en && DICT.de[en] !== undefined) texts.push({ node: n, en, lead: raw.match(/^\s*/)[0], trail: raw.match(/\s*$/)[0] });
    }
    for (const el of document.querySelectorAll('[title],[aria-label],[placeholder]')) {
      for (const attr of ['title', 'aria-label', 'placeholder']) {
        const en = el.getAttribute(attr);
        if (en && DICT.de[en] !== undefined) attrs.push({ el, attr, en });
      }
    }
    staticNodes = { texts, attrs };
  }

  function applyStatic() {
    if (!staticNodes) collectStatic();
    for (const s of staticNodes.texts) s.node.nodeValue = s.lead + t(s.en) + s.trail;
    for (const a of staticNodes.attrs) a.el.setAttribute(a.attr, t(a.en));
    for (const el of document.querySelectorAll('[data-i18n-html]')) {
      const block = HTML[el.dataset.i18nHtml];
      if (!block) continue;
      let html = block[lang] || block.en; // trusted static content defined above
      // Language pages live one folder down: point relative image paths up a level.
      const page = document.documentElement.dataset.page;
      if (page && page !== 'en') html = html.replace(/(src|href)="icons\//g, '$1="../icons/');
      el.innerHTML = html;
    }
    document.documentElement.lang = lang;
    document.title = META.title[lang];
  }

  const I18N = {
    LANGS, t, fill,
        get lang() { return lang; },
    get locale() { return LANGS[lang].locale; },
    /** Initial language: saved choice, else the browser language if supported, else English. */
    init() {
      let saved = null;
      try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* storage unavailable */ }
      const nav = (typeof navigator !== 'undefined' && navigator.language || 'en').slice(0, 2).toLowerCase();
      // A language page (/de/, /nl/, …) always shows its own language.
      const page = typeof document !== 'undefined' && document.documentElement.dataset.page;
      lang = LANGS[page] ? page : LANGS[saved] ? saved : LANGS[nav] ? nav : 'en';
      applyStatic();
    },
    /** On a language page, go to the page of language l (keeping the #hash); false elsewhere. */
    goToLang(l) {
      const page = typeof document !== 'undefined' && document.documentElement.dataset.page;
      if (!page || !LANGS[l]) return false;
      try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* storage unavailable */ }
      location.href = (page === 'en' ? '' : '../') + (l === 'en' ? '' : l + '/') + location.search + location.hash;
      return true;
    },
    setLang(l) {
      if (!LANGS[l]) return;
      lang = l;
      try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* storage unavailable */ }
      applyStatic();
    },
    /** All English keys (used by the test that checks every t('…') call has translations). */
    keys: () => ROWS.map((r) => r[0]),
    rows: () => ROWS,
    html: () => HTML,
    meta: () => META,
    dict: () => DICT,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = I18N;
  else root.I18N = I18N;
})(typeof window !== 'undefined' ? window : globalThis);
