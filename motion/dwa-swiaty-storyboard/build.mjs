// Buduje storyboard.html i PDF:  node build.mjs   (wymaga Playwright + Chromium)
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { FRAMES, castFig } from './frames.mjs';
import { META, SCENES, CAST, RULES } from './content.mjs';
import { OLD, NEW } from './draw.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const worldName = { old: 'STARY ŚWIAT', turn: 'ZWROT', new: 'NOWY ŚWIAT' };
const secs = tc => { const [m, s] = tc.split(':').map(Number); return m * 60 + s; };
const TOTAL = 119;

const timeline = () => SCENES.map(s => {
  const [a, b] = s.tc.split('–').map(secs);
  return `<div class="seg ${s.world}" style="flex:${b - a}"><b>${s.n}</b><span>${s.tc.split('–')[0]}</span></div>`;
}).join('');

const shotCard = sh => `<div class="shot">
  <div class="frame">${FRAMES[sh.id]()}<div class="fid">${sh.id}</div><div class="ftype">${sh.type}</div></div>
  <div class="meta"><span class="tc">${sh.tc}</span><span class="tr">${esc(sh.trans)}</span></div>
  <p class="anim">${esc(sh.anim)}</p>
  <p class="vo"><i>Lektor</i> ${esc(sh.vo)}</p>
  <p class="sfx"><i>Dźwięk</i> ${esc(sh.sfx)}</p>
</div>`;

const sceneBlock = s => `<section class="scene ${s.world}">
  <header><div class="num">${s.n}</div><div class="ttl"><small>${worldName[s.world]} · ${s.tc}</small><h2>${esc(s.title)}</h2></div></header>
  <div class="voline"><b>LEKTOR (całość sceny):</b> „${esc(s.vo)}”</div>
  <div class="music"><b>Muzyka:</b> ${esc(s.music)}</div>
  <div class="shots" style="grid-template-columns:repeat(${s.shots.length},1fr)">${s.shots.map(shotCard).join('')}</div>
</section>`;

const swatches = (p, keys) => keys.map(([k, label]) => `<div class="sw"><i style="background:${p[k]}"></i>${label}<code>${p[k]}</code></div>`).join('');

const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${META.title} — storyboard</title>
<link rel="stylesheet" href="../budoexpert-promo/fonts.css">
<style>
@page { size: A4 landscape; margin: 9mm 10mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Poppins, sans-serif; color: #2B1730; font-size: 8.4pt; line-height: 1.38; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1,h2,h3 { margin: 0; }
.page { break-after: page; }
.cover { height: 190mm; display: grid; grid-template-rows: auto 1fr auto; gap: 6mm; align-items: center; }
.cover .strip { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
.cover .strip figure > svg { width: 100%; display: block; border-radius: 3mm; }
.cover .strip figcaption { font-size: 7pt; font-weight: 700; letter-spacing: .12em; margin-top: 1.5mm; color: #7B5A80; }
.cover h1 { font-size: 34pt; line-height: 1.05; color: #6C0C79; font-weight: 700; letter-spacing: -.01em; }
.cover .sub { font-size: 12pt; color: #7B5A80; margin-top: 2mm; }
.facts { display: flex; gap: 8mm; font-size: 8.5pt; color: #3B1442; flex-wrap: wrap; }
.facts div b { display: block; font-size: 6.5pt; letter-spacing: .12em; color: #17A884; }
.kicker { font-size: 7pt; font-weight: 700; letter-spacing: .16em; color: #17A884; margin-bottom: 2mm; }
.two { display: grid; grid-template-columns: 1.15fr 1fr; gap: 9mm; }
.box { background: #FAF4FB; border-radius: 3mm; padding: 4mm 5mm; }
.box h3 { font-size: 10pt; color: #6C0C79; margin-bottom: 2mm; }
.box ul { margin: 0; padding-left: 4.5mm; } .box li { margin-bottom: 1.3mm; }
.tl { display: flex; height: 13mm; border-radius: 2mm; overflow: hidden; margin: 3mm 0 1.5mm; }
.seg { display: flex; flex-direction: column; justify-content: center; padding-left: 1.6mm; font-size: 6.5pt; border-right: 1px solid #fff; min-width: 0; }
.seg b { font-size: 8.5pt; } .seg span { opacity: .8; }
.seg.old { background: #C5CBD2; color: #38404B; } .seg.turn { background: #20CFA3; color: #20262E; } .seg.new { background: #6C0C79; color: #fff; }
.tlleg { display: flex; justify-content: space-between; font-size: 6.5pt; color: #7B5A80; }
.palettes { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.pal { border-radius: 3mm; padding: 3.5mm 4mm; }
.pal.o { background: ${OLD.bg}; } .pal.n { background: ${NEW.bg}; border: 1px solid #F0E2D3; }
.pal h3 { font-size: 9.5pt; margin-bottom: 1mm; }
.pal p { margin: 0 0 2mm; font-size: 7.4pt; }
.sw { display: inline-flex; align-items: center; gap: 1.5mm; width: 48%; font-size: 7pt; margin-bottom: 1mm; }
.sw i { width: 5mm; height: 5mm; border-radius: 1mm; display: inline-block; border: .3mm solid rgba(0,0,0,.12); }
.sw code { font-size: 6.2pt; color: #777; margin-left: auto; }
.cast { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3mm; margin-top: 3mm; }
.cast > div > svg { width: 100%; border-radius: 2mm; display: block; }
.cast b { display: block; font-size: 7.4pt; margin-top: 1mm; } .cast span { font-size: 6.4pt; color: #6E5A72; display: block; line-height: 1.3; }
.scene { break-before: page; break-inside: avoid; }
.shots.two .shot p { font-size: 8.4pt; }
.scene header { display: flex; align-items: center; gap: 3mm; border-radius: 2.5mm; padding: 2mm 3.5mm; break-after: avoid; }
.scene.old header { background: #38404B; color: #E9EDF1; } .scene.turn header { background: linear-gradient(90deg,#38404B,#20CFA3 70%,#6C0C79); color: #fff; } .scene.new header { background: #6C0C79; color: #fff; }
.scene .num { font-size: 17pt; font-weight: 800; line-height: 1; }
.scene small { font-size: 6.5pt; letter-spacing: .14em; opacity: .8; font-weight: 600; }
.scene h2 { font-size: 11pt; font-weight: 700; }
.voline { margin: 2mm 0 .6mm; font-size: 8.6pt; } .voline b, .music b { font-size: 6.6pt; letter-spacing: .1em; color: #17A884; }
.music { font-size: 7.4pt; color: #5E4A62; margin-bottom: 2mm; break-after: avoid; }
.shots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.shot { break-inside: avoid; }
.frame { position: relative; border-radius: 2mm; overflow: hidden; border: .3mm solid #D9CCDC; }
.frame > svg { display: block; width: 100%; }
.fid { position: absolute; left: 0; top: 0; background: #2B1730; color: #fff; font-weight: 800; font-size: 8pt; padding: .6mm 2.2mm; border-bottom-right-radius: 2mm; }
.scene.new .fid { background: #6C0C79; }
.ftype { position: absolute; right: 0; bottom: 0; background: rgba(255,255,255,.88); color: #2B1730; font-weight: 700; font-size: 6pt; letter-spacing: .1em; padding: .5mm 2mm; border-top-left-radius: 2mm; }
.meta { display: flex; justify-content: space-between; margin: 1.4mm 0 .6mm; font-size: 7pt; }
.tc { font-weight: 800; color: #6C0C79; } .tr { color: #7B5A80; font-size: 6.6pt; }
.shot p { margin: 0 0 1mm; font-size: 8pt; }
.shot p i { font-style: normal; font-weight: 700; font-size: 6.2pt; letter-spacing: .08em; text-transform: uppercase; color: #17A884; margin-right: 1mm; }
.shot .vo { color: #3B1442; font-weight: 500; }
.shot .sfx { color: #6E5A72; }
table.script { width: 100%; border-collapse: collapse; font-size: 9pt; }
.script td { padding: 2mm 2.5mm; border-bottom: .3mm solid #EADFEC; vertical-align: top; }
.script td:first-child { white-space: nowrap; font-weight: 700; color: #6C0C79; width: 22mm; }
.script td:nth-child(2) { width: 9mm; font-weight: 800; }
.script tr.old td:nth-child(2) { color: #6E7884; } .script tr.turn td:nth-child(2) { color: #17A884; } .script tr.new td:nth-child(2) { color: #6C0C79; }
.script .hint { color: #7B5A80; font-size: 7.4pt; }
.ui { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
.ui .box { font-size: 7.6pt; } .ui .box h3 { font-size: 9pt; }
</style></head><body>

<div class="page cover">
  <div><div class="kicker">BUDOEXPERT · ${META.version.toUpperCase()}</div><h1>${META.title}</h1><div class="sub">${META.sub}</div></div>
  <div class="strip">
    <figure style="margin:0">${FRAMES['01B']()}<figcaption>STARY ŚWIAT · 01B</figcaption></figure>
    <figure style="margin:0">${FRAMES['07A']()}<figcaption>NOWY ŚWIAT · 07A (LUSTRO)</figcaption></figure>
  </div>
  <div class="facts">
    <div><b>DŁUGOŚĆ</b>${META.length}</div><div><b>FORMAT</b>${META.format}</div><div><b>STYL</b>flat 2D + szkic na papierze milimetrowym</div>
    <div><b>LEKTOR</b>męski, ciepły, z offu, zwraca się do widza na „Ty”</div><div><b>EMISJA</b>pętla na targach + strona</div>
  </div>
</div>

<div class="page">
  <div class="kicker">KONCEPCJA</div>
  <div class="two">
    <div>
      <p style="font-size:10pt;margin-top:0">Jeden film, dwa światy. <b>Najpierw cały stary świat</b>: szary, deszczowy, cichy i samotny. Inwestor, wykonawca i hurtownia mają swoje problemy i każdy zmaga się z nimi <b>osobno</b>. W punkcie zwrotnym wszystko staje, a turkusowy trójkąt z logo rozlewa kolor na cały kadr. <b>Potem cały nowy świat</b>: te same postacie, <b>te same kadry</b>, ale ciepło, spokojnie i razem, w jednej aplikacji Budoexpert.</p>
      <p style="font-size:9pt">Kontrast budujemy trzema środkami naraz: <b>paletą</b> (szarości → fiolet i turkus), <b>pogodą i światłem</b> (deszcz i noc → słońce i wieczorna lampa) oraz <b>lustrzanym tekstem lektora</b> (zdania nowego świata odpowiadają zdaniom starego: „Materiał – nie.” → „Materiał też.”).</p>
      <div class="kicker" style="margin-top:4mm">OŚ CZASU</div>
      <div class="tl">${timeline()}</div>
      <div class="tlleg"><span>0:00 · stary świat</span><span>0:58–1:07 zwrot</span><span>nowy świat · 1:59</span></div>
      <p style="font-size:7.4pt;color:#7B5A80;margin-top:2mm">Długość to ok. 1:59, czyli trochę ponad założone ~110 s. Jeśli trzeba skrócić, najłatwiej wyciąć 03C (−3 s), skrócić 01A do 4 s (−2 s) i zrobić 06A–06C w 7 s zamiast 9 (−2 s). Tak wychodzi ~1:52.</p>
    </div>
    <div class="box"><h3>Zasady dla animatora i montażysty</h3><ul>${RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
  </div>
</div>

<div class="page">
  <div class="kicker">STYL · PALETY · POSTACIE</div>
  <div class="palettes">
    <div class="pal o"><h3>Stary świat</h3><p>Chłodne szarości i błękity, niskie nasycenie, deszcz w każdej scenie (w 04 jako mżawka). Noc i sztuczne, żółtawe światło lampy. Siatka papieru ledwo widoczna. Ruchy postaci wolne, ciężkie.</p>
      ${swatches(OLD, [['bg', 'tło / papier'], ['pale', 'mury, podłoga'], ['mid', 'cienie, meble'], ['ink', 'kontury, tekst'], ['night', 'noc'], ['rain', 'deszcz'], ['lamp', 'światło lampy'], ['warn', 'akcent alarmu']])}</div>
    <div class="pal n"><h3>Nowy świat</h3><p>Kolory marki: fiolet <b>#6C0C79</b> i turkus <b>#20CFA3</b> na ciepłym, kremowym papierze z siatką. Słońce i ciepłe lampy. Ekrany aplikacji zawsze mają fioletowy pasek z logo. Ruchy lekkie, sprężyste („pop”).</p>
      ${swatches(NEW, [['bg', 'tło / papier'], ['purple', 'fiolet marki'], ['purple2', 'fiolet ciemny'], ['teal', 'turkus marki'], ['teal2', 'turkus ciemny'], ['sun', 'słońce'], ['lamp', 'ciepła lampa'], ['ink', 'kontury, tekst']])}</div>
  </div>
  <div class="kicker" style="margin-top:5mm">POSTACIE (te same osoby w obu światach, z lewej stary świat, z prawej nowy)</div>
  <div class="cast">${CAST.map(c => `<div>${castFig(c.fig)}<b>${c.who}</b><span>${esc(c.note)}</span></div>`).join('')}</div>
  <div class="two" style="margin-top:5mm">
    <div class="box"><h3>Muzyka i dźwięk</h3><ul>
      <li><b>Stary świat:</b> deszcz jako stały podkład, niski dron, pojedyncze nuty pianina, tykanie zegara przyspieszające w 03–05. Bez melodii.</li>
      <li><b>Zwrot (ok. 1:02):</b> pełna cisza na ok. 1 s, potem jasny „ding” w momencie pojawienia się trójkąta i swell.</li>
      <li><b>Nowy świat:</b> ciepły motyw (pianino + plucki/smyczki), który rośnie scena po scenie. Kulminacja na słowie „Budoexpert” w 12B.</li>
      <li>Lektor nad muzyką; w starym świecie pauzy w tekście zostawiają miejsce na ciszę.</li></ul></div>
    <div class="box"><h3>Animacja i typografia</h3><ul>
      <li>Font: Poppins (500 tekst UI, 700 nagłówki). Pliki: <code>motion/budoexpert-promo/fonts</code>.</li>
      <li>Logo: turkusowy trójkąt z zaokrąglonymi rogami + „budoexpert” (biały na fiolecie / fioletowy na jasnym).</li>
      <li>Kamera: wolne najazdy (zoom 3–8%), cięcia na zdaniach lektora. Lustrzane ujęcia montuj w identycznym kadrze.</li>
      <li>Strzałki i pomarańczowe notatki na szkicach to wskazówki, nie elementy filmu.</li></ul></div>
  </div>
</div>

${SCENES.map(sceneBlock).join('\n')}

<div class="page" style="break-before:page">
  <div class="kicker">SKRYPT LEKTORA (do nagrania)</div>
  <table class="script">${SCENES.map(s => `<tr class="${s.world}"><td>${s.tc}</td><td>${s.n}</td><td>${esc(s.vo)}${{ old: '<div class="hint">ciszej, wolno, z ciężarem; pauzy przy „…”</div>', turn: '<div class="hint">po „osobno” 1 s ciszy, pytanie miękko i z nadzieją</div>', new: '<div class="hint">cieplej, z uśmiechem w głosie, lekko szybciej</div>' }[s.world]}</td></tr>`).join('')}</table>
</div>

<div class="page">
  <div class="kicker">EKRANY APLIKACJI DO ZAPROJEKTOWANIA (zawsze z paskiem marki Budoexpert)</div>
  <div class="ui">
    <div class="box"><h3>07B · Moja budowa (telefon)</h3>Zdjęcie z budowy, pasek postępu 35%, lista etapów: „Fundamenty – gotowe ✓”, „Ściany parteru”. Wiadomość od eksperta z awatarem: „Wszystko zgodnie z planem. Zdjęcia z dziś w dzienniku.”</div>
    <div class="box"><h3>08A · Oferty dla Twojego projektu (tablet)</h3>Trzy karty: Firma A / B / C, odznaka „Zweryfikowana”, gwiazdki, termin, cena za ten sam projekt (512 000 / 528 000 / 535 000 zł, ceny bliskie sobie). Przycisk „Wybierz”, środkowa karta wybrana.</div>
    <div class="box"><h3>09B · Nowe zlecenie (telefon)</h3>„NOWE ZLECENIE · Zabudowa kuchni · Kosztorys gotowy – wg projektu · Start: 14 października”. Przyciski „Akceptuj” (fiolet) i „Szczegóły”.</div>
    <div class="box"><h3>10B · Dostawa (telefon, inset)</h3>✓ „Dostawa – dostarczona 06:58”, pełny pasek, „Dziś: ściany parteru”.</div>
    <div class="box"><h3>11A · Panel hurtowni (monitor)</h3>„NOWE ZAMÓWIENIE – KOMPLETNE”: Pustak ceramiczny 25 – 1 240 szt., Cement 32,5R – 40 worków, Stal żebrowana ø12 – 0,8 t, Wełna mineralna 15 cm – 96 m². „Dostawa: pon., 06:55 · plac budowy”. Przycisk „Potwierdź”.</div>
    <div class="box"><h3>12C · Plansza końcowa</h3>Fiolet #6C0C79 z siatką, logo (turkusowy trójkąt + biały napis), „Nie czekaj. Zapisz się już dziś.”, pastylka „budoexpert.pl” w turkusie.</div>
  </div>
</div>
</body></html>`;

writeFileSync(path.join(here, 'storyboard.html'), html);
console.log('storyboard.html');

let pw;
try { pw = await import('playwright'); } catch { pw = await import('/opt/node-tools/node_modules/playwright/index.mjs'); }
const browser = await pw.chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(here, 'storyboard.html')).href);
await page.evaluate(() => document.fonts.ready);
const out = path.join(here, 'budoexpert-dwa-swiaty-storyboard.pdf');
await page.pdf({ path: out, format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
if (process.argv.includes('--png')) {
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.screenshot({ path: path.join(here, 'preview.png'), fullPage: true });
}
await browser.close();
console.log(out);
