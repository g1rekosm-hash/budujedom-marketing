// Kadry storyboardu. Klucz = numer ujęcia. Stary świat: OLD (szarości, deszcz), nowy: NEW (kolory marki).
import {
  OLD as O, NEW as N, svg, grid, text as T, rain, person, umbrella, clock, house, pallet, truck, logo,
  device, appBar, bubble, check, arrowNote, motion, vibe,
} from './draw.mjs';

// stałe postacie — ta sama osoba w obu światach, zmienia się tylko paleta i nastrój
const her = (p, x, y, o = {}) => person(x, y, { shirt: p.her, skin: p.skin, hair: p === O ? '#5A5550' : '#7A3E22', hs: 'long', pants: p.pants, ...o });
const him = (p, x, y, o = {}) => person(x, y, { shirt: p.him, skin: p.skin, hair: p.hair, hs: 'short', pants: p.pants, ...o });
const pro = (p, x, y, o = {}) => person(x, y, { shirt: p.pro, skin: p.skin, hair: p === O ? '#555' : '#4A3426', hs: 'cap', capc: p === O ? '#6A6E74' : '#3B1442', pants: p.pants, ...o });
const crew = (p, x, y, o = {}) => person(x, y, { shirt: p === O ? '#7A818A' : '#8E6FA0', skin: p.skin, hs: 'helmet', capc: p === O ? '#A9A48E' : '#F2C230', pants: p.pants, ...o });
const seller = (p, x, y, o = {}) => person(x, y, { shirt: p === O ? '#9AA19A' : '#F4EDE4', apron: p.seller, skin: p.skin, hair: p.hair, hs: 'short', pants: p.pants, ...o });
const client = (p, x, y, o = {}) => person(x, y, { shirt: '#8B93A0', skin: p.skin, hair: '#6B6359', hs: 'short', pants: p.pants, ...o });
const kid = (p, x, y, o = {}) => person(x, y, { s: .62, shirt: p.kid, skin: p.skin, hair: p.hair, hs: 'short', pants: p.pants, ...o });

const ground = (p, y, c) => `<rect x="0" y="${y}" width="320" height="${180 - y}" fill="${c || p.pale}"/>`;
const tag = (p, str, dark) => T(8, 173, str, { size: 6.2, w: 700, fill: dark ? '#E9EDF1' : p.ink, ls: .6, op: .8 });
const timeStamp = (x, y, str, fill, bg) => `<rect x="${x}" y="${y - 9}" width="${str.length * 5.2 + 8}" height="12" rx="3" fill="${bg}"/>` + T(x + 4, y, str, { size: 8, w: 700, fill });

function kitchenWindow(p, x, y, w, h, night, rainy) {
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${night ? '#1D232B' : p.sky || '#DDE9F2'}" stroke="${night ? '#4A535F' : p.light}" stroke-width="2"/>`;
  if (rainy) g += rain(p, 16, 9, { x, y, w, h, c: '#6E8296', op: .9 });
  if (!night && p === N) g += `<circle cx="${x + w * .7}" cy="${y + h * .35}" r="${h * .18}" fill="${p.sun}"/>`;
  return g + `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${night ? '#4A535F' : p.light}" stroke-width="1.5"/>`;
}
const table = (p, x, y, w, c) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="1" fill="${c || p.wood}"/><rect x="${x + 6}" y="${y + 5}" width="4" height="${180 - y}" fill="${c || p.wood}" opacity=".8"/><rect x="${x + w - 10}" y="${y + 5}" width="4" height="${180 - y}" fill="${c || p.wood}" opacity=".8"/>`;
const lampCone = (x, y, w, h, c, op = .35) => `<path d="M${x - 6},${y} L${x - w / 2},${y + h} L${x + w / 2},${y + h} L${x + 6},${y} Z" fill="${c}" opacity="${op}"/><line x1="${x}" y1="0" x2="${x}" y2="${y - 6}" stroke="#222" stroke-width=".8"/><path d="M${x - 9},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} L${x + 9},${y} Z" fill="#3A3A3A"/>`;
const sheet = (x, y, rot, amount, p, hi) => `<g transform="rotate(${rot} ${x + 30} ${y + 38})"><rect x="${x}" y="${y}" width="60" height="76" fill="${p.paper}" stroke="${p.light}" stroke-width=".6"/>` +
  T(x + 6, y + 12, 'WYCENA', { size: 6.5, w: 700, fill: p.ink }) +
  [20, 26, 32, 38, 44].map(yy => `<line x1="${x + 6}" y1="${y + yy}" x2="${x + 54 - (yy % 3) * 6}" y2="${y + yy}" stroke="${p.light}" stroke-width="1"/>`).join('') +
  `<line x1="${x + 6}" y1="${y + 50}" x2="${x + 54}" y2="${y + 50}" stroke="${p.mid}" stroke-width=".5"/>` +
  T(x + 6, y + 58, 'RAZEM:', { size: 4.6, w: 600, fill: p.mid }) + T(x + 54, y + 70, amount, { size: 8.5, w: 800, fill: hi || p.ink, a: 'end' }) + '</g>';

function tile(x, y, w, h, inner, p, frameC) {
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><rect width="320" height="180" fill="${p.bg}"/>${inner}</svg><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${frameC}" stroke-width="2"/>`;
}
// miniatury czterech światów do sceny 06 i 12
const miniOld = {
  couple: () => ground(O, 140) + house(225, 140, 1, O, 'unfinished') + her(O, 120, 160, { back: true, pose: 'none' }) + him(O, 145, 160, { back: true, pose: 'umbrella' }) + umbrella(140, 82, 32, '#4C5562') + rain(O, 60, 3),
  pro: () => `<rect width="320" height="180" fill="${O.night}"/>` + lampCone(160, 40, 160, 120, O.lamp, .3) + pro(O, 160, 185, { mood: 'tired', pose: 'work', s: 1.4 }) + table(O, 70, 128, 180) + `<rect x="120" y="120" width="44" height="9" fill="${O.paper}"/>` + clock(268, 40, 20, 1, 12, O) + rain(O, 30, 4),
  site: () => ground(O, 140) + house(90, 140, .9, O, 'unfinished') + pallet(175, 150, 1.6, O) + crew(O, 250, 165, { pose: 'cup', mood: 'sad' }) + crew(O, 285, 165, { pose: 'down', mood: 'tired' }) + rain(O, 60, 5),
  shop: () => `<rect width="320" height="180" fill="${O.bg}"/>` + shelves(O) + seller(O, 160, 175, { mood: 'tired', pose: 'none', s: 1.3 }) + `<rect x="40" y="128" width="240" height="60" fill="${O.mid}"/>` + `<rect x="130" y="118" width="50" height="12" fill="${O.paper}"/>` + rain(O, 40, 6),
};
const miniNew = {
  couple: () => `<rect width="320" height="180" fill="${N.bg}"/>` + sofa(N, 160, 160) + her(N, 140, 160, { mood: 'smile', pose: 'none', noLegs: true }) + him(N, 180, 160, { mood: 'smile', pose: 'phone', noLegs: true, dev: N.purple }),
  pro: () => `<rect width="320" height="180" fill="${N.bg}"/>` + bench(N) + pro(N, 150, 175, { mood: 'smile', pose: 'phone', dev: N.purple, s: 1.3 }),
  site: () => `<rect width="320" height="180" fill="${N.sky}"/>` + ground(N, 140, '#EADFCB') + house(90, 140, .9, N, 'progress') + pallet(170, 150, 1.5, N, true) + crew(N, 250, 165, { pose: 'carry', mood: 'smile' }) + pro(N, 290, 165, { pose: 'phone', mood: 'smile', dev: N.purple }),
  shop: () => `<rect width="320" height="180" fill="${N.bg}"/>` + shelves(N) + seller(N, 120, 175, { mood: 'smile', pose: 'none', s: 1.3 }) + `<rect x="40" y="128" width="240" height="60" fill="${N.purple2}"/>` + device(190, 70, 80, 56, N, appBar(73.6, 10) + `<rect x="6" y="16" width="60" height="7" rx="2" fill="${N.teal}"/>`, { r: 3, bezel: 3 }),
};
function shelves(p) {
  let g = '';
  for (let r = 0; r < 3; r++) {
    g += `<rect x="20" y="${30 + r * 32}" width="280" height="3" fill="${p.mid}"/>`;
    for (let i = 0; i < 12; i++) g += `<rect x="${26 + i * 23}" y="${14 + r * 32}" width="17" height="16" rx="1" fill="${[p.light, p.pale, p.mid][(i + r) % 3]}" opacity="${p === O ? .8 : 1}"/>`;
  }
  if (p === N) for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i += 3) g += `<rect x="${26 + i * 23}" y="${14 + r * 32}" width="17" height="16" rx="1" fill="${[N.teal, N.purple, '#E3A13B'][r]}" opacity=".75"/>`;
  return g;
}
function sofa(p, x, y) {
  return `<rect x="${x - 80}" y="${y - 52}" width="160" height="36" rx="10" fill="${p.purple2}" opacity=".9"/><rect x="${x - 88}" y="${y - 30}" width="176" height="26" rx="8" fill="${p.purple}"/><rect x="${x - 92}" y="${y - 42}" width="16" height="40" rx="7" fill="${p.purple2}"/><rect x="${x + 76}" y="${y - 42}" width="16" height="40" rx="7" fill="${p.purple2}"/>`;
}
function bench(p) {
  let g = `<rect x="0" y="0" width="320" height="180" fill="${p.bg}"/>` + grid(p, .5);
  g += `<rect x="20" y="40" width="280" height="4" fill="${p.wood}"/>`;
  for (let i = 0; i < 9; i++) g += `<rect x="${30 + i * 30}" y="16" width="5" height="24" fill="${['#8E6FA0', p.teal, '#E3A13B'][i % 3]}"/>`;
  g += `<rect x="40" y="128" width="250" height="8" fill="${p.wood}"/><rect x="50" y="136" width="8" height="44" fill="#B88850"/><rect x="272" y="136" width="8" height="44" fill="#B88850"/>`;
  g += `<rect x="190" y="118" width="80" height="10" fill="#E8C08A" stroke="#B88850" stroke-width=".6"/>`;
  return g;
}

export const FRAMES = {
  /* =========================== STARY ŚWIAT =========================== */
  '00A': () => svg(grid(N) + house(160, 128, 1.05, N, 'sketch', { fillWall: '#FFFFFF', fillRoof: '#F3D9F6', fillDoor: '#20CFA3', fillWin: '#CFF5EC' }) +
    `<g stroke="#6C0C79" stroke-width="1.2" fill="none" stroke-linecap="round"><circle cx="52" cy="78" r="18" fill="#BDEFE2"/><line x1="52" y1="96" x2="52" y2="128"/><path d="M265,92 L265,128 M283,92 L283,128 M262,92 L286,92"/><path d="M270,92 L270,116 M278,92 L278,116 M268,116 h12"/></g>` +
    `<circle cx="270" cy="40" r="11" fill="#FFD38A"/>` +
    arrowNote(170, 26, 160, 44, 'kreska rysuje się na żywo, linia po linii', '#6C0C79', { a: 'middle', dx: -10 }) +
    T(312, 172, 'SZKIC · MARZENIE', { size: 6, w: 700, fill: '#6C0C79', a: 'end', ls: .8 }), N.bg),

  '00B': () => svg(`<defs><linearGradient id="fade00" x1="0" x2="1"><stop offset="0" stop-color="${N.bg}"/><stop offset=".55" stop-color="${O.bg}"/></linearGradient></defs><rect width="320" height="180" fill="url(#fade00)"/>` + grid(O, .7) +
    house(160, 128, 1.05, O, 'sketch', { fillWall: O.pale, fillRoof: O.light, fillDoor: O.mid, fillWin: O.bg }).replaceAll('#6C0C79', O.ink) +
    `<g stroke="#20CFA3" stroke-width="1.6" opacity=".55">${[118, 126, 150, 172, 196].map((x, i) => `<line x1="${x}" y1="${70 + i * 5}" x2="${x}" y2="${104 + i * 9}"/>`).join('')}</g>` +
    `<g stroke="#C9A9CF" stroke-width="1.3" opacity=".6">${[136, 160, 184].map((x, i) => `<line x1="${x}" y1="${48 + i * 3}" x2="${x}" y2="${70 + i * 7}"/>`).join('')}</g>` +
    rain(O, 90, 11) + arrowNote(18, 30, 120, 90, 'krople zmywają kolor, farba spływa', '#C2410C') +
    arrowNote(212, 160, 186, 130, 'szkic morfuje w prawdziwy dom z 01A', '#C2410C', { a: 'middle', dy: 8 }), O.bg),

  '01A': () => svg(`<rect width="320" height="120" fill="#C9D0D8"/>` + ground(O, 120, '#9EA6AE') +
    `<ellipse cx="80" cy="150" rx="40" ry="5" fill="#8C959F"/><ellipse cx="250" cy="165" rx="30" ry="4" fill="#8C959F"/>` +
    house(210, 124, 1.05, O, 'unfinished') + `<path d="M40,126 l14,-10 l14,10 Z" fill="#8A8476"/>` +
    her(O, 112, 178, { back: true, pose: 'none', s: 1.05 }) + him(O, 138, 178, { back: true, pose: 'umbrella', s: 1.05 }) + umbrella(132, 98, 34, '#454D58') +
    rain(O, 110, 21) + tag(O, 'STARY ŚWIAT') + arrowNote(250, 40, 236, 70, 'pusty plac, nikt nie pracuje', '#C2410C', { a: 'middle' }), '#C9D0D8'),

  '01B': () => svg(`<rect width="320" height="180" fill="#BCC4CD"/>` + `<g opacity=".35">${house(250, 150, 1.4, O, 'unfinished')}</g>` +
    `<g transform="rotate(9 132 110)">${her(O, 134, 240, { s: 2.4, mood: 'closed', pose: 'none' })}</g>` + him(O, 186, 240, { s: 2.4, mood: 'sad', pose: 'none' }) +
    umbrella(162, 30, 100, '#454D58') + rain(O, 70, 31, { y: 35, h: 145 }) +
    arrowNote(60, 160, 140, 120, 'ona opiera głowę o jego ramię', '#C2410C') + arrowNote(262, 150, 205, 108, 'wzrok w pustkę', '#C2410C', { a: 'middle', dy: -3 }), '#BCC4CD'),

  '02A': () => svg(`<rect width="320" height="180" fill="${O.night}"/>` + kitchenWindow(O, 228, 24, 70, 62, true, true) +
    lampCone(140, 40, 170, 110, O.lamp, .28) +
    her(O, 92, 190, { s: 1.4, mood: 'sad', pose: 'none' }) + him(O, 190, 190, { s: 1.4, mood: 'tired', pose: 'none' }) +
    table(O, 40, 130, 210, '#6A6560') + `<rect x="100" y="124" width="22" height="8" fill="${O.paper}" transform="rotate(-6 110 128)"/><rect x="132" y="125" width="22" height="8" fill="${O.paper}"/><rect x="164" y="124" width="22" height="8" fill="${O.paper}" transform="rotate(8 175 128)"/>` +
    tag(O, 'STARY ŚWIAT', true) + T(234, 100, '23:40', { size: 7, w: 700, fill: '#8C96A2' }), O.night),

  '02B': () => svg(`<rect width="320" height="180" fill="#5E5852"/>` + `<rect width="320" height="180" fill="${O.lamp}" opacity=".12"/>` +
    sheet(26, 46, -7, '390 000 zł', O) + sheet(130, 40, 2, '540 000 zł', O) + sheet(234, 48, 8, '710 000 zł', O) +
    arrowNote(160, 22, 160, 36, 'kwoty wybijają się po kolei, każda z „tąpnięciem” w dźwięku', '#F3B27A', { a: 'middle' }), '#5E5852'),

  '03A': () => svg(`<rect width="320" height="180" fill="${O.night}"/>` + lampCone(150, 34, 190, 130, O.lamp, .3) + clock(272, 44, 22, 1, 12, O, { face: '#C9CDD2' }) +
    pro(O, 150, 205, { s: 1.6, mood: 'tired', pose: 'work' }) + table(O, 50, 132, 210, '#6A6560') +
    `<rect x="110" y="124" width="46" height="10" fill="${O.paper}"/><line x1="133" y1="124" x2="133" y2="134" stroke="${O.light}"/><rect x="170" y="123" width="16" height="11" rx="1.5" fill="#4C535C"/><rect x="62" y="120" width="40" height="7" rx="3.5" fill="#B9C1CA" transform="rotate(-8 82 124)"/>` +
    tag(O, 'STARY ŚWIAT', true) + arrowNote(250, 90, 268, 62, 'zegar 1:12, sekundnik tyka', '#F3B27A', { a: 'middle', dy: 10 }) +
    arrowNote(40, 112, 82, 122, 'zwinięty projekt', '#F3B27A', { a: 'middle' }), O.night),

  '03B': () => svg(`<rect width="320" height="180" fill="#1F252D"/>` + `<rect x="40" y="10" width="110" height="170" fill="#2A313B"/>` +
    `<path d="M150,10 L196,22 L196,180 L150,180 Z" fill="#3A424D"/>` + `<path d="M150,10 L196,22 L196,180 L150,180 Z" fill="${O.lamp}" opacity=".15"/>` +
    `<rect x="60" y="120" width="80" height="24" rx="4" fill="#4A5260"/><rect x="60" y="110" width="22" height="14" rx="5" fill="#C5CBD2"/>` +
    `<circle cx="78" cy="112" r="7" fill="${O.skin}"/><path d="M71,110 a7,7 0 0 1 14,0 Z" fill="${O.hair}"/><path d="M74,113 q1.5,1 3,0" stroke="#333" stroke-width=".7" fill="none"/><rect x="82" y="114" width="56" height="14" rx="5" fill="#7C8694"/>` +
    T(270, 92, 'z…', { size: 12, fill: '#6E7884', a: 'middle', w: 600 }) +
    arrowNote(220, 140, 120, 118, 'przez uchylone drzwi: śpiące dziecko', '#F3B27A', { a: 'middle', dy: 14 }), '#1F252D'),

  '03C': () => svg(`<rect width="320" height="180" fill="#262C35"/>` +
    device(110, 8, 100, 176, O, `<rect width="93.6" height="169.6" fill="#E6E9EC"/>` + T(8, 12, '01:14', { size: 6.5, w: 700, fill: '#444' }) +
      `<rect x="0" y="16" width="93.6" height="16" fill="#C9CFD6"/>` + T(8, 27, 'Klient – dom 140 m²', { size: 6, w: 600, fill: '#333' }) +
      `<rect x="30" y="54" width="58" height="26" rx="6" fill="#B9C3CD"/><rect x="35" y="59" width="10" height="13" rx="1" fill="#fff"/>` + T(49, 66, 'Wycena.pdf', { size: 5.6, w: 600, fill: '#333' }) + T(49, 74, '2,4 MB', { size: 4.4, fill: '#555' }) +
      T(86, 88, 'Wyświetlono 01:14', { size: 4.8, fill: '#666', a: 'end' }), { frame: '#111' }) +
    arrowNote(262, 140, 200, 99, '„wyświetlono” – i cisza', '#F3B27A', { a: 'middle', dy: 12 }), '#262C35'),

  '04A': () => svg(`<rect width="320" height="120" fill="#D3D8DE"/>` + ground(O, 118, '#A3AAB1') + house(80, 122, .95, O, 'unfinished') +
    pallet(150, 150, 1.5, O) + crew(O, 238, 168, { pose: 'cup', mood: 'neutral' }) + crew(O, 266, 170, { pose: 'down', mood: 'tired' }) + crew(O, 294, 168, { pose: 'cup', mood: 'sad' }) +
    pro(O, 205, 172, { pose: 'down', mood: 'sad' }) + rain(O, 35, 41, { op: .4 }) + timeStamp(270, 22, '07:00', '#fff', O.ink) + tag(O, 'STARY ŚWIAT') +
    arrowNote(150, 172, 176, 148, 'pusta paleta – tu miał być materiał', '#C2410C', { a: 'middle', dy: 4 }), '#D3D8DE'),

  '04B': () => svg(`<rect width="320" height="180" fill="#C9CFD6"/>` + ground(O, 140, '#A3AAB1') +
    pro(O, 90, 220, { s: 1.9, mood: 'sad', pose: 'phoneEar' }) + bubble(122, 36, 92, 22, '„Dziś nie dojedzie…”', { size: 7 }) +
    crew(O, 236, 170, { pose: 'cup', mood: 'tired', s: .9 }) + crew(O, 266, 172, { pose: 'down', mood: 'neutral', s: .9 }) + crew(O, 294, 170, { pose: 'down', mood: 'sad', s: .9 }) +
    `<rect x="226" y="72" width="82" height="20" rx="4" fill="${O.ink}"/>` + T(267, 86, '– 1 240 zł', { size: 10, w: 800, fill: '#F2B5A5', a: 'middle' }) +
    arrowNote(267, 60, 267, 72, 'licznik kosztu przestoju rośnie', '#C2410C', { a: 'middle', dy: -2 }), '#C9CFD6'),

  '05A': () => svg(`<rect width="320" height="180" fill="${O.bg}"/>` + shelves(O) + clock(286, 116, 13, 10, 30, O) +
    `<path d="M300,104 a17,17 0 0 1 0,24" stroke="#C2410C" stroke-width=".9" fill="none" marker-end=""/>` + T(304, 140, '+30 min', { size: 5.6, w: 700, fill: '#C2410C', a: 'end' }) +
    seller(O, 120, 186, { s: 1.4, mood: 'neutral', pose: 'explain' }) + client(O, 230, 186, { s: 1.4, mood: 'sad', pose: 'down' }) +
    `<rect x="20" y="140" width="290" height="40" fill="${O.mid}"/>` + `<rect x="150" y="132" width="40" height="10" fill="${O.paper}"/><path d="M155,136 l10,3 l8,-4 l10,5" stroke="${O.ink}" stroke-width=".7" fill="none"/>` +
    `<rect x="60" y="128" width="14" height="12" fill="#A47A6A"/><rect x="76" y="132" width="20" height="8" fill="#9AA0A6"/>` +
    `<circle cx="262" cy="80" r="10" fill="#fff"/>` + T(262, 86.5, '?', { size: 17, w: 800, fill: O.ink, a: 'middle' }) + tag(O, 'STARY ŚWIAT') +
    arrowNote(30, 120, 66, 128, 'próbki materiałów', '#C2410C', { a: 'middle' }), O.bg),

  '05B': () => svg(`<rect width="320" height="180" fill="${O.bg}"/>` + shelves(O) +
    `<rect x="214" y="40" width="70" height="110" fill="#B9C3CC" stroke="${O.mid}" stroke-width="2"/><rect x="220" y="46" width="58" height="98" fill="#DCE3E9" opacity=".7"/>` +
    client(O, 252, 150, { back: true, pose: 'none', s: 1.2 }) + `<rect x="220" y="46" width="58" height="98" fill="#DCE3E9" opacity=".45"/>` +
    seller(O, 110, 186, { s: 1.4, mood: 'sad', pose: 'none' }) + `<rect x="20" y="140" width="190" height="40" fill="${O.mid}"/>` +
    `<rect x="122" y="124" width="56" height="18" fill="${O.paper}" stroke="${O.light}" stroke-width=".5"/>` + T(126, 131, 'ZAMÓWIENIE', { size: 4.8, w: 700, fill: O.ink }) + `<line x1="126" y1="135" x2="174" y2="135" stroke="${O.pale}"/><line x1="126" y1="139" x2="174" y2="139" stroke="${O.pale}"/>` +
    arrowNote(300, 30, 270, 60, 'drzwi powoli się zamykają', '#C2410C', { a: 'end' }) + arrowNote(150, 110, 150, 124, 'pusty blankiet zamówienia', '#C2410C', { a: 'middle' }), O.bg),

  '06A': () => svg(`<rect width="320" height="180" fill="#20262E"/>` +
    tile(6, 6, 151, 81, miniOld.couple(), O, '#20262E') + tile(163, 6, 151, 81, miniOld.pro(), O, '#20262E') +
    tile(6, 93, 151, 81, miniOld.site(), O, '#20262E') + tile(163, 93, 151, 81, miniOld.shop(), O, '#20262E') +
    T(160, 91.5, '„Tylko każdy osobno.”', { size: 6.5, w: 700, fill: '#E9EDF1', a: 'middle' }), '#20262E'),

  '06B': () => svg(`<rect width="320" height="180" fill="#20262E"/>` +
    `<g opacity=".45">${tile(6, 6, 151, 81, miniOld.couple(), O, '#20262E') + tile(163, 6, 151, 81, miniOld.pro(), O, '#20262E') + tile(6, 93, 151, 81, miniOld.site(), O, '#20262E') + tile(163, 93, 151, 81, miniOld.shop(), O, '#20262E')}</g>` +
    rain(O, 120, 61, { frozen: true, c: '#AFC0D2', op: .9 }) + `<circle cx="160" cy="92" r="26" fill="#20CFA3" opacity=".18"/>` + logo(148, 102, 20, '#20CFA3', '#fff', { noText: true }) +
    arrowNote(200, 160, 168, 100, 'krople zatrzymują się w powietrzu · cisza', '#F3B27A', { a: 'middle', dy: 10 }), '#20262E'),

  '06C': () => svg(`<rect width="320" height="180" fill="#20262E"/>` +
    `<path d="M160,-40 L300,210 L20,210 Z" fill="#6C0C79" stroke="#6C0C79" stroke-width="16" stroke-linejoin="round"/>` +
    `<path d="M160,10 L250,170 L70,170 Z" fill="#20CFA3" stroke="#20CFA3" stroke-width="10" stroke-linejoin="round"/>` +
    `<g opacity=".8">${grid(N, .25)}</g>` +
    `<g stroke="#fff" stroke-width="1" opacity=".7" stroke-linecap="round">${[[160, 92, 40, 30], [160, 92, 280, 30], [160, 92, 30, 160], [160, 92, 292, 160]].map(([a, b, c, d]) => `<line x1="${a + (c - a) * .55}" y1="${b + (d - b) * .55}" x2="${a + (c - a) * .8}" y2="${b + (d - b) * .8}"/>`).join('')}</g>` +
    arrowNote(14, 20, 90, 60, 'trójkąt rośnie i rozlewa kolor marki na cały kadr', '#FFD38A'), '#20262E'),

  /* =========================== NOWY ŚWIAT =========================== */
  '07A': () => svg(`<rect width="320" height="180" fill="#FBE8D4"/>` + kitchenWindow(N, 22, 20, 64, 58, false) + `<rect x="22" y="20" width="64" height="58" fill="#FFB774" opacity=".35"/>` +
    `<line x1="270" y1="40" x2="270" y2="140" stroke="#3B1442" stroke-width="1.5"/><path d="M256,40 L284,40 L278,24 L262,24 Z" fill="#FFC978"/><circle cx="270" cy="44" r="40" fill="#FFC978" opacity=".18"/>` +
    `<g transform="translate(160 172) scale(1.45) translate(-160 -172)">${sofa(N, 160, 172)}<g transform="rotate(10 146 110)">${her(N, 146, 172, { mood: 'closed', pose: 'none', noLegs: true, s: 1.15 })}</g>${him(N, 172, 172, { mood: 'smile', pose: 'phone', noLegs: true, dev: N.purple, s: 1.15 })}</g>` +
    `<rect x="0" y="168" width="320" height="12" fill="#E9CDB0"/>` + tag(N, 'NOWY ŚWIAT') +
    arrowNote(210, 22, 182, 58, 'ten sam układ co 01B – teraz ciepło i spokój', N.purple, { a: 'middle' }), '#FBE8D4'),

  '07B': () => svg(`<rect width="320" height="180" fill="#F6E3CF"/>` +
    device(108, 4, 104, 184, N, appBar(97.6, 15, 'Moja budowa') +
      `<rect x="6" y="20" width="85" height="38" rx="3" fill="#E7DCCB"/>` + house(48, 52, .38, N, 'unfinished', { wall: '#D9C8B0', hole: '#B9A58C' }) + `<rect x="6" y="20" width="85" height="38" rx="3" fill="none" stroke="#D9C8B0"/>` +
      T(6, 67, 'Postęp budowy', { size: 5.2, w: 600, fill: N.ink }) + T(91, 67, '35%', { size: 5.6, w: 800, fill: N.purple, a: 'end' }) +
      `<rect x="6" y="70" width="85" height="4" rx="2" fill="#EEE"/><rect x="6" y="70" width="30" height="4" rx="2" fill="${N.teal}"/>` +
      check(11, 84, 4) + T(18, 86, 'Fundamenty – gotowe', { size: 5.4, w: 600, fill: N.ink }) +
      `<circle cx="11" cy="96" r="4" fill="none" stroke="${N.light}"/>` + T(18, 98, 'Ściany parteru', { size: 5.4, fill: N.mid }) +
      `<rect x="6" y="108" width="85" height="30" rx="5" fill="#F3ECF5"/><circle cx="16" cy="118" r="6" fill="${N.teal}"/><path d="M12,124 a4,3 0 0 1 8,0" fill="#fff"/><circle cx="16" cy="116" r="2.4" fill="#fff"/>` +
      T(26, 117, 'Ekspert Budoexpert', { size: 4.6, w: 700, fill: N.purple }) + T(26, 125, 'Wszystko zgodnie z planem.', { size: 4.8, fill: N.ink }) + T(26, 132, 'Zdjęcia z dziś w dzienniku.', { size: 4.6, fill: N.mid }),
      { frame: '#2A1430' }) +
    arrowNote(232, 150, 210, 128, 'marka Budoexpert zawsze widoczna u góry', N.purple, { a: 'middle', dy: 10 }) +
    arrowNote(60, 70, 116, 84, '✓ wskakuje z „pop”', N.purple, { a: 'middle' }), '#F6E3CF'),

  '08A': () => svg(`<rect width="320" height="180" fill="#FFF3E3"/>` +
    device(36, 12, 248, 156, N, appBar(240, 16, 'Oferty dla Twojego projektu') +
      [0, 1, 2].map(i => { const x = 8 + i * 77; return `<rect x="${x}" y="24" width="70" height="104" rx="5" fill="#fff" stroke="${i === 1 ? N.teal : '#E6DDE8'}" stroke-width="${i === 1 ? 1.6 : .8}"/>` +
        `<rect x="${x + 6}" y="31" width="22" height="22" rx="11" fill="${['#E9DDF0', '#D6F6EE', '#FCE6D1'][i]}"/>` + T(x + 32, 40, `Firma ${'ABC'[i]}`, { size: 6.2, w: 700, fill: N.ink }) +
        `<rect x="${x + 32}" y="44" width="34" height="8" rx="4" fill="${N.teal}"/>` + T(x + 49, 49.8, 'Zweryfikowana', { size: 3.9, w: 700, fill: '#fff', a: 'middle' }) +
        T(x + 6, 66, '★★★★★', { size: 7, fill: '#E3A13B' }) + T(x + 6, 78, 'Termin: 7 mies.', { size: 4.8, fill: N.mid }) + T(x + 6, 86, 'Ten sam projekt · etapy', { size: 4.8, fill: N.mid }) +
        T(x + 6, 102, ['512 000 zł', '528 000 zł', '535 000 zł'][i], { size: 8.5, w: 800, fill: N.purple }) +
        `<rect x="${x + 6}" y="110" width="58" height="12" rx="6" fill="${i === 1 ? N.purple : '#F1E8F2'}"/>` + T(x + 35, 118, 'Wybierz', { size: 5.4, w: 700, fill: i === 1 ? '#fff' : N.purple, a: 'middle' }); }).join(''),
      { frame: '#2A1430', r: 8 }) +
    arrowNote(160, 176, 160, 150, 'te same 3 kartki ze sceny 02 – ale porównywalne, obok siebie', N.purple, { a: 'middle', dy: 0 }), '#FFF3E3'),

  '08B': () => svg(`<rect width="320" height="180" fill="#FFF1DE"/>` + kitchenWindow(N, 228, 22, 72, 62, false) +
    her(N, 110, 190, { s: 1.4, mood: 'laugh', pose: 'highfive' }) + him(N, 200, 190, { s: 1.4, mood: 'laugh', pose: 'highfiveL' }) +
    `<path d="M150,66 l4,-6 M160,62 v-7 M170,66 l-4,-6" stroke="${N.teal}" stroke-width="1.3" stroke-linecap="round"/>` +
    table(N, 40, 132, 230) + `<rect x="128" y="124" width="44" height="9" rx="2" fill="#2A1430"/><rect x="131" y="125.5" width="38" height="6" fill="${N.purple}"/>` +
    `<rect x="80" y="122" width="10" height="11" rx="2" fill="#fff" stroke="${N.light}"/><rect x="212" y="122" width="10" height="11" rx="2" fill="#fff" stroke="${N.light}"/>` +
    tag(N, 'NOWY ŚWIAT') + arrowNote(40, 36, 76, 70, 'ta sama kuchnia co 02A – dzień, porządek', N.purple), '#FFF1DE'),

  '09A': () => svg(bench(N) + pro(N, 140, 182, { s: 1.5, mood: 'smile', pose: 'work' }) +
    `<rect x="214" y="110" width="12" height="20" rx="2" fill="#2A1430" transform="rotate(-8 220 120)"/>` + vibe(214, 108, 16) + vibe(240, 108, 16).replace(/q-/g, 'q') +
    tag(N, 'NOWY ŚWIAT') + arrowNote(270, 80, 226, 108, 'telefon wibruje na stole', N.purple, { a: 'middle' }), N.bg),

  '09B': () => svg(`<rect width="320" height="180" fill="#E8C08A"/>` + `<g opacity=".25">${grid(N)}</g>` +
    device(100, 6, 120, 186, N, `<rect width="113.6" height="179.6" fill="#F4EEF6"/>` + appBar(113.6, 16) +
      `<rect x="6" y="24" width="101.6" height="74" rx="7" fill="#fff" stroke="${N.teal}" stroke-width="1.2"/>` +
      T(12, 36, 'NOWE ZLECENIE', { size: 5, w: 800, fill: N.teal2, ls: .4 }) + T(12, 47, 'Zabudowa kuchni', { size: 7.5, w: 700, fill: N.ink }) +
      T(12, 57, 'Kosztorys gotowy – wg projektu', { size: 5.2, fill: N.mid }) + T(12, 65, 'Start: 14 października', { size: 5.2, fill: N.mid }) +
      `<rect x="12" y="74" width="44" height="16" rx="8" fill="${N.purple}"/>` + T(34, 84.5, 'Akceptuj', { size: 6, w: 700, fill: '#fff', a: 'middle' }) +
      `<rect x="60" y="74" width="40" height="16" rx="8" fill="#F1E8F2"/>` + T(80, 84.5, 'Szczegóły', { size: 5.6, w: 600, fill: N.purple, a: 'middle' }) +
      `<rect x="6" y="104" width="101.6" height="20" rx="6" fill="#fff" opacity=".8"/>` + T(12, 116, 'Kolejne zlecenie w okolicy', { size: 5, fill: N.mid }),
      { frame: '#2A1430' }) +
    arrowNote(36, 150, 140, 158, 'kciuk stuka „Akceptuj”', N.purple, { a: 'middle', dy: -4 }) + `<circle cx="134" cy="88" r="9" fill="none" stroke="${N.teal}" stroke-width="1.2"/>`, '#E8C08A'),

  '09C': () => svg(`<rect width="320" height="180" fill="#FBE3C6"/>` + kitchenWindow(N, 24, 18, 60, 54, false) + `<rect x="24" y="18" width="60" height="54" fill="#F59A5B" opacity=".35"/>` +
    clock(270, 34, 16, 7, 0, N) + lampCone(160, 26, 200, 110, N.lamp, .3) +
    pro(N, 90, 190, { s: 1.3, mood: 'smile', pose: 'none', hs: 'short' }) + kid(N, 160, 168, { mood: 'laugh', pose: 'highfive', s: .9 }) + her(N, 232, 190, { s: 1.3, mood: 'smile', pose: 'none', shirt: '#E7A5B5' }) +
    table(N, 40, 140, 240) + `<ellipse cx="110" cy="138" rx="14" ry="3" fill="#fff"/><ellipse cx="160" cy="138" rx="14" ry="3" fill="#fff"/><ellipse cx="210" cy="138" rx="14" ry="3" fill="#fff"/>` +
    tag(N, 'NOWY ŚWIAT') + arrowNote(270, 66, 270, 52, '19:00', N.purple, { a: 'middle', dy: 10 }) + arrowNote(160, 92, 160, 108, 'to samo dziecko co w 03B', N.purple, { a: 'middle', dy: -3 }), '#FBE3C6'),

  '10A': () => svg(`<rect width="320" height="120" fill="${N.sky}"/>` + `<circle cx="60" cy="40" r="16" fill="${N.sun}"/>` + ground(N, 118, '#EADFCB') +
    house(250, 122, .95, N, 'unfinished', { wall: '#F1E4D2', hole: '#CDB79A' }) + truck(36, 162, 1.3, N, { label: true }) +
    pallet(160, 160, 1.4, N, true) + `<path d="M150,128 L150,96 L176,96" stroke="${N.ink}" stroke-width="1.2" fill="none"/>` +
    timeStamp(262, 22, '06:55', '#fff', N.purple) + tag(N, 'NOWY ŚWIAT') +
    arrowNote(222, 152, 196, 146, 'materiał na placu przed ekipą', N.purple, { a: 'middle', dy: 14 }), N.sky),

  '10B': () => svg(`<rect width="320" height="120" fill="${N.sky}"/>` + ground(N, 118, '#EADFCB') + house(90, 122, .95, N, 'unfinished', { wall: '#F1E4D2', hole: '#CDB79A' }) +
    pallet(150, 158, 1.3, N, true) + crew(N, 200, 168, { pose: 'carry', mood: 'smile' }) + crew(N, 230, 168, { pose: 'carry', mood: 'smile', box: '#D9805F' }) +
    pro(N, 140, 176, { pose: 'phone', mood: 'smile', dev: N.purple, s: 1.05 }) +
    device(244, 52, 66, 112, N, appBar(59.6, 11) + check(10, 26, 4.5) + T(18, 28, 'Dostawa', { size: 5.6, w: 700, fill: N.ink }) + T(18, 35, 'dostarczona 06:58', { size: 4.4, fill: N.mid }) +
      `<rect x="5" y="44" width="50" height="5" rx="2.5" fill="#EEE"/><rect x="5" y="44" width="50" height="5" rx="2.5" fill="${N.teal}"/>` + T(5, 60, 'Dziś: ściany parteru', { size: 4.4, fill: N.mid }), { frame: '#2A1430', r: 5 }) +
    timeStamp(14, 22, '07:00', '#fff', N.purple) + arrowNote(236, 36, 248, 56, 'inset: ekran telefonu', N.purple, { a: 'end', dy: -2 }), N.sky),

  '11A': () => svg(`<rect width="320" height="180" fill="#F4ECF6"/>` +
    device(40, 10, 240, 150, N, appBar(232, 16, 'Panel hurtowni') +
      `<rect x="8" y="24" width="216" height="110" rx="6" fill="#fff" stroke="${N.teal}" stroke-width="1.2"/>` +
      T(16, 38, 'NOWE ZAMÓWIENIE – KOMPLETNE', { size: 6, w: 800, fill: N.teal2, ls: .3 }) +
      [['Pustak ceramiczny 25', '1 240 szt.'], ['Cement 32,5R', '40 worków'], ['Stal żebrowana ø12', '0,8 t'], ['Wełna mineralna 15 cm', '96 m²']].map(([a, b], i) =>
        T(16, 54 + i * 12, a, { size: 6, fill: N.ink }) + T(160, 54 + i * 12, b, { size: 6, w: 700, fill: N.ink, a: 'end' }) + `<line x1="16" y1="${57 + i * 12}" x2="160" y2="${57 + i * 12}" stroke="#F0E6F1"/>`).join('') +
      T(16, 112, 'Dostawa: pon., 06:55 · plac budowy', { size: 5.4, fill: N.mid }) +
      `<rect x="168" y="100" width="50" height="18" rx="9" fill="${N.purple}"/>` + T(193, 112, 'Potwierdź', { size: 6.2, w: 700, fill: '#fff', a: 'middle' }),
      { frame: '#2A1430', r: 6 }) +
    `<path d="M40,160 h240 l14,20 h-268 Z" fill="#2A1430"/>` +
    arrowNote(314, 176, 280, 120, 'zamówienie wjeżdża z prawej', N.purple, { a: 'end', dy: 0 }), '#F4ECF6'),

  '11B': () => svg(`<rect width="320" height="180" fill="${N.bg}"/>` + shelves(N) + clock(290, 112, 12, 9, 0, N) +
    `<g transform="translate(206,150)"><rect x="0" y="-26" width="34" height="18" rx="3" fill="#E3A13B"/><rect x="34" y="-50" width="4" height="50" fill="#3B1442"/><rect x="38" y="-14" width="22" height="3" fill="#3B1442"/><circle cx="8" cy="-4" r="5" fill="#2b2b2b"/><circle cx="28" cy="-4" r="5" fill="#2b2b2b"/></g>` +
    pallet(246, 140, 1, N, true) + seller(N, 110, 186, { s: 1.4, mood: 'smile', pose: 'none' }) +
    `<rect x="20" y="140" width="180" height="40" fill="${N.purple2}"/>` + device(130, 108, 52, 34, N, appBar(46, 7) + check(9, 18, 4), { r: 2, bezel: 3 }) +
    tag(N, 'NOWY ŚWIAT') + arrowNote(250, 70, 230, 110, 'wózek ładuje paletę na dostawę', N.purple, { a: 'middle' }), N.bg),

  '12A': () => svg(`<rect width="320" height="180" fill="#F7EEF8"/>` +
    tile(6, 6, 151, 81, miniNew.couple(), N, '#F7EEF8') + tile(163, 6, 151, 81, miniNew.pro(), N, '#F7EEF8') +
    tile(6, 93, 151, 81, miniNew.site(), N, '#F7EEF8') + tile(163, 93, 151, 81, miniNew.shop(), N, '#F7EEF8') +
    `<g stroke="${N.teal}" stroke-width="2" stroke-linecap="round" fill="none"><path d="M100,60 Q160,90 220,58"/><path d="M100,60 Q140,120 120,145"/><path d="M220,58 Q200,120 225,140"/><path d="M120,145 Q170,130 225,140"/></g>` +
    [[100, 60], [220, 58], [120, 145], [225, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="${N.teal}" stroke-width="2"/>`).join('') +
    arrowNote(160, 92, 160, 82, 'turkusowe linie łączą telefony', N.purple, { a: 'middle', dy: 9 }), '#F7EEF8'),

  '12B': () => svg(`<rect width="320" height="180" fill="${N.purple}"/>` + `<g opacity=".25">${grid({ grid: '#8A3A96', grid2: '#9A4AA6' })}</g>` +
    `<g stroke="${N.teal}" stroke-width="1.4" opacity=".9">${[[60, 40], [260, 36], [50, 140], [270, 146], [160, 20], [160, 164], [30, 90], [292, 92]].map(([x, y]) => `<line x1="160" y1="92" x2="${x}" y2="${y}"/>`).join('')}</g>` +
    [[60, 40], [260, 36], [50, 140], [270, 146], [160, 20], [160, 164], [30, 90], [292, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 4 ? 9 : 5}" fill="${i < 4 ? '#fff' : N.teal}"/>` + (i < 4 ? `<rect x="${x - 3}" y="${y - 5}" width="6" height="10" rx="1.2" fill="${N.purple}"/>` : '')).join('') +
    `<circle cx="160" cy="92" r="26" fill="${N.purple2}" stroke="${N.teal}" stroke-width="2"/>` + logo(148, 101, 18, N.teal, '#fff', { noText: true }) +
    arrowNote(232, 170, 186, 110, 'sieć zwija się do środka → logo', '#FFD38A', { a: 'middle', dy: 0 }), N.purple),

  '12C': () => svg(`<rect width="320" height="180" fill="${N.purple}"/>` + `<g opacity=".3">${grid({ grid: '#8A3A96', grid2: '#9A4AA6' })}</g>` +
    logo(69, 72, 20, N.teal, '#fff') +
    T(160, 104, 'Nie czekaj. Zapisz się już dziś.', { size: 13, w: 700, fill: '#fff', a: 'middle' }) +
    `<rect x="104" y="118" width="112" height="24" rx="12" fill="${N.teal}"/>` + T(160, 134.5, 'budoexpert.pl', { size: 10, w: 700, fill: N.purple2, a: 'middle' }), N.purple),
};

/** karta postaci: stary świat | nowy świat obok siebie */
export function castFig(key) {
  const f = { her, him, pro, seller, crew, kid }[key];
  if (key === 'expert') return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="80" fill="${N.bg}"/>` +
    `<circle cx="60" cy="38" r="24" fill="${N.teal}"/><path d="M46,58 a14,11 0 0 1 28,0" fill="#fff"/><circle cx="60" cy="33" r="8" fill="#fff"/>` +
    `<path d="M66,50 L70,57 L62,57 Z" fill="${N.purple}" stroke="${N.purple}" stroke-linejoin="round"/></svg>`;
  const y = key === 'kid' ? 70 : 78;
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="80" fill="${O.bg}"/><rect x="60" width="60" height="80" fill="${N.bg}"/>` +
    f(O, 30, y, { mood: 'sad' }) + f(N, 90, y, { mood: 'smile', ...(key === 'pro' ? {} : {}) }) + `</svg>`;
}
