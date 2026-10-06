// Szkice kadrów storyboardu „Dwa światy budowania” — flat 2D, inline SVG (viewBox 320×180).
// Każda funkcja z FRAMES zwraca kompletny <svg>. Prymitywy są celowo proste: to kompozycja
// i kadrowanie dla animatora, nie finalna ilustracja.

export const OLD = {
  bg: '#E3E6EA', grid: '#D3D8DE', grid2: '#C2C9D1', ink: '#38404B', mid: '#6E7884', light: '#9AA4AF',
  pale: '#C5CBD2', skin: '#C9C1B9', hair: '#4A4F57', pants: '#4A5260', rain: '#7D91A6', night: '#2B323C',
  night2: '#343C47', lamp: '#D8CFA2', paper: '#F0F1F2', accent: '#5D7A99', warn: '#9C5D5D',
  her: '#7D8C8A', him: '#5F6875', pro: '#857F72', seller: '#6E786F', kid: '#8A93A0', wood: '#8F8A80',
};
export const NEW = {
  bg: '#FFF8F0', grid: '#F3E6D8', grid2: '#EAD5C0', ink: '#3B1442', mid: '#7B5A80', light: '#BBA6BE',
  pale: '#EFE2EF', skin: '#F0C4A0', hair: '#5A3424', pants: '#3B2A48', lamp: '#FFC978', paper: '#FFFFFF',
  accent: '#20CFA3', purple: '#6C0C79', purple2: '#520A5C', teal: '#20CFA3', teal2: '#17A884', sun: '#FFD38A',
  her: '#20CFA3', him: '#6C0C79', pro: '#E3A13B', seller: '#520A5C', kid: '#F08A6B', wood: '#D9A86C', sky: '#FFE7C7',
};

const W = 320, H = 180;
let uid = 0;
const id = p => `${p}${++uid}`;

/* ---------- prymitywy ---------- */
export const svg = (inner, bg = '#fff') =>
  `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Poppins, sans-serif"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</svg>`;

export function grid(p, opacity = 1) {
  let s = `<g opacity="${opacity}">`;
  for (let x = 0; x <= W; x += 10) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${x % 50 ? p.grid : p.grid2}" stroke-width="${x % 50 ? .35 : .6}"/>`;
  for (let y = 0; y <= H; y += 10) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${y % 50 ? p.grid : p.grid2}" stroke-width="${y % 50 ? .35 : .6}"/>`;
  return s + '</g>';
}

const T = (x, y, str, o = {}) =>
  `<text x="${x}" y="${y}" font-size="${o.size || 8}" font-weight="${o.w || 500}" fill="${o.fill || '#333'}" text-anchor="${o.a || 'start'}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${str}</text>`;
export { T as text };

function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

export function rain(p, n = 70, seed = 1, o = {}) {
  const r = rng(seed), x0 = o.x || 0, y0 = o.y || 0, w = o.w || W, h = o.h || H;
  let s = `<g stroke="${o.c || p.rain}" stroke-width="${o.sw || .8}" stroke-linecap="round" opacity="${o.op || .75}">`;
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h, l = o.frozen ? .01 : 6 + r() * 6;
    s += o.frozen ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1" fill="${o.c || p.rain}" stroke="none"/>`
      : `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - l * .25).toFixed(1)}" y2="${(y + l).toFixed(1)}"/>`;
  }
  return s + '</g>';
}

/** Postać: (x, y) = stopy. o: {s, shirt, skin, hair, hs:'short'|'long'|'cap'|'helmet'|'none', mood, pose, back, apron} */
export function person(x, y, o = {}) {
  const s = o.s || 1, sh = o.shirt || '#777', sk = o.skin || '#ddd', hr = o.hair || '#444', pa = o.pants || '#444';
  const arm = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sh}" stroke-width="5" stroke-linecap="round"/>`;
  const hand = (hx, hy) => `<circle cx="${hx}" cy="${hy}" r="2.2" fill="${sk}"/>`;
  let g = `<g transform="translate(${x},${y}) scale(${s})">`;
  if (o.hs === 'long') g += `<path d="M-9.5,-64 A9.5,9.5 0 0 1 9.5,-64 L10.5,-49 Q0,-46 -10.5,-49 Z" fill="${hr}"/>`;
  if (!o.noLegs) g += `<rect x="-7" y="-29" width="6" height="29" rx="2" fill="${pa}"/><rect x="1" y="-29" width="6" height="29" rx="2" fill="${pa}"/>`;
  // ręce za ciałem (pozy)
  const pose = o.pose || 'down';
  let front = '';
  if (pose === 'down') front = arm(-11, -51, -14, -32) + arm(11, -51, 14, -32) + hand(-14, -31) + hand(14, -31);
  if (pose === 'phone') front = arm(-11, -51, -14, -32) + hand(-14, -31) + arm(11, -51, 5, -44) + `<rect x="0" y="-52" width="6.5" height="10" rx="1.2" fill="${o.dev || '#222'}"/>` + hand(4, -43);
  if (pose === 'phoneEar') front = arm(-11, -51, -14, -32) + hand(-14, -31) + arm(11, -51, 9, -62) + `<rect x="6" y="-70" width="5" height="9" rx="1.2" fill="${o.dev || '#222'}"/>`;
  if (pose === 'cup') front = arm(-11, -51, -14, -32) + hand(-14, -31) + arm(11, -51, 6, -41) + `<rect x="2" y="-46" width="7" height="7" rx="1.5" fill="${o.cupc || '#eee'}"/>`;
  if (pose === 'umbrella') front = arm(-11, -51, -14, -32) + hand(-14, -31) + arm(11, -51, 5, -66) + hand(5, -66);
  if (pose === 'highfive') front = arm(-11, -51, -14, -32) + hand(-14, -31) + arm(11, -51, 17, -76) + hand(17, -77);
  if (pose === 'highfiveL') front = arm(11, -51, 14, -32) + hand(14, -31) + arm(-11, -51, -17, -76) + hand(-17, -77);
  if (pose === 'explain') front = arm(-11, -51, -22, -50) + hand(-23, -50) + arm(11, -51, 20, -42) + hand(21, -42);
  if (pose === 'work') front = arm(-11, -51, 10, -42) + arm(11, -51, 18, -44) + hand(10, -42) + hand(19, -44);
  if (pose === 'carry') front = arm(-11, -51, -6, -40) + arm(11, -51, 6, -40) + `<rect x="-9" y="-46" width="18" height="9" rx="1" fill="${o.box || '#c66'}"/>`;
  if (pose === 'none') front = '';
  g += `<rect x="-12" y="-57" width="24" height="31" rx="8" fill="${sh}"/>`;
  if (o.apron) g += `<path d="M-8,-50 L8,-50 L9,-27 L-9,-27 Z" fill="${o.apron}"/>`;
  if (o.logo) g += `<path d="M5,-50 L8.5,-44 L1.5,-44 Z" fill="${o.logo}" stroke="${o.logo}" stroke-width="1" stroke-linejoin="round"/>`;
  g += `<circle cx="0" cy="-65" r="8.5" fill="${sk}"/>`;
  if (o.back) g += `<circle cx="0" cy="-65.5" r="8.9" fill="${hr}"/>` + (o.hs === 'long' ? `<path d="M-9.5,-65 L-10.5,-49 Q0,-46 10.5,-49 L9.5,-65 Z" fill="${hr}"/>` : '');
  else {
    if (o.hs === 'short' || o.hs === 'long' || !o.hs) g += `<path d="M-8.9,-65 A8.9,8.9 0 0 1 8.9,-65 Q5,-70 -1,-68.5 Q-6,-67.5 -8.9,-65 Z" fill="${hr}"/>`;
    if (o.hs === 'cap') g += `<path d="M-9,-66 A9,9 0 0 1 9,-66 Z" fill="${o.capc || hr}"/><rect x="-1" y="-67" width="13" height="2.2" rx="1" fill="${o.capc || hr}"/>`;
    if (o.hs === 'helmet') g += `<path d="M-9.5,-66 A9.5,9.5 0 0 1 9.5,-66 Z" fill="${o.capc || '#e8c33a'}"/><rect x="-11" y="-67" width="22" height="2.2" rx="1" fill="${o.capc || '#e8c33a'}"/>`;
    const m = o.mood || 'neutral', fc = '#2b2b2b';
    if (m === 'tired') g += `<path d="M-5,-65 h3.2 M2,-65 h3.2" stroke="${fc}" stroke-width=".9"/><path d="M-5,-63.3 q1.6,1 3.2,0 M2,-63.3 q1.6,1 3.2,0" stroke="${fc}" stroke-width=".4" fill="none" opacity=".6"/>`;
    else if (m === 'closed') g += `<path d="M-5,-65 q1.6,1.4 3.2,0 M2,-65 q1.6,1.4 3.2,0" stroke="${fc}" stroke-width=".8" fill="none"/>`;
    else g += `<circle cx="-3.2" cy="-65.5" r="1" fill="${fc}"/><circle cx="3.2" cy="-65.5" r="1" fill="${fc}"/>`;
    const mouth = { smile: 'M-3,-61 Q0,-58 3,-61', laugh: 'M-3.2,-61.2 Q0,-56.5 3.2,-61.2 Z', sad: 'M-2.8,-59.4 Q0,-62 2.8,-59.4', tired: 'M-2.5,-60 h5', neutral: 'M-2.5,-60.3 h5', closed: 'M-2,-60.5 Q0,-59.5 2,-60.5' }[m] || 'M-2.5,-60.3 h5';
    g += `<path d="${mouth}" stroke="${fc}" stroke-width=".9" fill="${m === 'laugh' ? '#7a2f2f' : 'none'}" stroke-linecap="round"/>`;
  }
  g += front;
  return g + '</g>';
}

export function umbrella(x, y, r, c, handle = '#333') {
  return `<path d="M${x - r},${y} Q${x},${y - r * 1.15} ${x + r},${y} Q${x + r * .66},${y - 4} ${x + r * .33},${y} Q${x},${y - 4} ${x - r * .33},${y} Q${x - r * .66},${y - 4} ${x - r},${y} Z" fill="${c}"/>` +
    `<line x1="${x}" y1="${y - 2}" x2="${x}" y2="${y + r * .85}" stroke="${handle}" stroke-width="1.2"/>`;
}

export function clock(x, y, r, h, m, p, o = {}) {
  const ah = ((h % 12) + m / 60) / 12 * 2 * Math.PI - Math.PI / 2, am = m / 60 * 2 * Math.PI - Math.PI / 2;
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.face || p.paper}" stroke="${o.rim || p.ink}" stroke-width="${r * .12}"/>`;
  for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * Math.PI; s += `<line x1="${x + Math.cos(a) * r * .78}" y1="${y + Math.sin(a) * r * .78}" x2="${x + Math.cos(a) * r * .88}" y2="${y + Math.sin(a) * r * .88}" stroke="${p.ink}" stroke-width="${r * .05}"/>`; }
  s += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(ah) * r * .5}" y2="${y + Math.sin(ah) * r * .5}" stroke="${p.ink}" stroke-width="${r * .1}" stroke-linecap="round"/>`;
  s += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(am) * r * .75}" y2="${y + Math.sin(am) * r * .75}" stroke="${o.hand || p.ink}" stroke-width="${r * .07}" stroke-linecap="round"/>`;
  return s + `<circle cx="${x}" cy="${y}" r="${r * .08}" fill="${p.ink}"/>`;
}

/** dom: state 'unfinished' | 'progress' | 'done' | 'sketch' */
export function house(x, y, s, p, state = 'unfinished', o = {}) {
  // (x, y) = środek podstawy
  const w = 120 * s, h = 62 * s, l = x - w / 2, t = y - h;
  const wall = o.wall || (state === 'done' ? p.paper : p.pale), line = o.line || p.mid;
  let g = '';
  if (state === 'sketch') {
    const c = p.purple || p.ink;
    g += `<g fill="none" stroke="${c}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">`;
    g += `<rect x="${l}" y="${t}" width="${w}" height="${h}" fill="${o.fillWall || 'none'}"/>`;
    g += `<path d="M${l - 8 * s},${t} L${x},${t - 42 * s} L${l + w + 8 * s},${t} Z" fill="${o.fillRoof || 'none'}"/>`;
    g += `<rect x="${x - 9 * s}" y="${y - 30 * s}" width="${18 * s}" height="${30 * s}" fill="${o.fillDoor || 'none'}"/>`;
    g += `<rect x="${l + 12 * s}" y="${t + 14 * s}" width="${22 * s}" height="${18 * s}" fill="${o.fillWin || 'none'}"/><rect x="${l + w - 34 * s}" y="${t + 14 * s}" width="${22 * s}" height="${18 * s}" fill="${o.fillWin || 'none'}"/>`;
    g += `<line x1="${l - 30 * s}" y1="${y}" x2="${l + w + 30 * s}" y2="${y}"/>`;
    g += `<path d="M${l + w + 30 * s},${t + 20 * s} L${l + w + 30 * s},${y}" /><path d="M${l + w + 24 * s},${t + 20 * s} L${l + w + 36 * s},${t + 20 * s}"/>`;
    g += `</g>`;
    return g;
  }
  if (state === 'unfinished') {
    // mury bez dachu, puste otwory, rusztowanie
    g += `<path d="M${l},${y} L${l},${t + 8 * s} L${l + 30 * s},${t + 8 * s} L${l + 30 * s},${t} L${l + 70 * s},${t} L${l + 70 * s},${t + 14 * s} L${l + w},${t + 14 * s} L${l + w},${y} Z" fill="${wall}" stroke="${line}" stroke-width=".8"/>`;
    for (let yy = t + 6 * s; yy < y; yy += 6 * s) g += `<line x1="${l}" y1="${yy}" x2="${l + w}" y2="${yy}" stroke="${line}" stroke-width=".3" opacity=".5"/>`;
    g += `<rect x="${l + 12 * s}" y="${t + 20 * s}" width="${20 * s}" height="${18 * s}" fill="${o.hole || p.mid}"/><rect x="${l + w - 32 * s}" y="${t + 24 * s}" width="${20 * s}" height="${16 * s}" fill="${o.hole || p.mid}"/><rect x="${x - 8 * s}" y="${y - 30 * s}" width="${16 * s}" height="${30 * s}" fill="${o.hole || p.mid}"/>`;
    // rusztowanie
    g += `<g stroke="${p.ink}" stroke-width=".9" opacity=".8">`;
    for (let i = 0; i < 4; i++) g += `<line x1="${l + w + 4 * s + i * 7 * s}" y1="${y}" x2="${l + w + 4 * s + i * 7 * s}" y2="${t - 6 * s}"/>`;
    for (let yy = y - 14 * s; yy > t - 8 * s; yy -= 16 * s) g += `<line x1="${l + w + 2 * s}" y1="${yy}" x2="${l + w + 27 * s}" y2="${yy}"/>`;
    g += `<line x1="${l + w + 4 * s}" y1="${y}" x2="${l + w + 25 * s}" y2="${t}" opacity=".6"/></g>`;
    return g;
  }
  // progress / done
  g += `<rect x="${l}" y="${t}" width="${w}" height="${h}" fill="${wall}" stroke="${line}" stroke-width=".8"/>`;
  g += `<path d="M${l - 8 * s},${t} L${x},${t - 40 * s} L${l + w + 8 * s},${t} Z" fill="${o.roof || p.purple || p.mid}"/>`;
  g += `<rect x="${l + 12 * s}" y="${t + 14 * s}" width="${22 * s}" height="${18 * s}" fill="${o.win || '#BFE9F0'}" stroke="${line}" stroke-width=".6"/><rect x="${l + w - 34 * s}" y="${t + 14 * s}" width="${22 * s}" height="${18 * s}" fill="${o.win || '#BFE9F0'}" stroke="${line}" stroke-width=".6"/>`;
  g += `<rect x="${x - 9 * s}" y="${y - 30 * s}" width="${18 * s}" height="${30 * s}" fill="${o.door || p.teal || p.mid}"/>`;
  return g;
}

export function pallet(x, y, s, p, full = false, o = {}) {
  let g = `<rect x="${x}" y="${y - 4 * s}" width="${40 * s}" height="${4 * s}" fill="${o.wood || p.wood}"/>`;
  g += `<rect x="${x + 2 * s}" y="${y - 6 * s}" width="${4 * s}" height="${2 * s}" fill="${o.wood || p.wood}"/><rect x="${x + 18 * s}" y="${y - 6 * s}" width="${4 * s}" height="${2 * s}" fill="${o.wood || p.wood}"/><rect x="${x + 34 * s}" y="${y - 6 * s}" width="${4 * s}" height="${2 * s}" fill="${o.wood || p.wood}"/>`;
  if (full) for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g += `<rect x="${x + c * 10 * s}" y="${y - (13 + r * 7) * s}" width="${9.4 * s}" height="${6.4 * s}" fill="${o.brick || '#D9805F'}" stroke="${o.brickLine || '#B4603F'}" stroke-width=".4"/>`;
  return g;
}

export function truck(x, y, s, p, o = {}) {
  const c = o.c || p.purple, c2 = o.c2 || p.paper;
  let g = `<rect x="${x}" y="${y - 30 * s}" width="${62 * s}" height="${24 * s}" rx="${2 * s}" fill="${c2}" stroke="${c}" stroke-width="${1.2 * s}"/>`;
  if (o.label) g += `<path d="M${x + 8 * s},${y - 12 * s} L${x + 14 * s},${y - 22 * s} L${x + 20 * s},${y - 12 * s} Z" fill="${p.teal}" stroke="${p.teal}" stroke-linejoin="round" stroke-width="${1.5 * s}"/>` + T(x + 23 * s, y - 13.5 * s, 'budoexpert', { size: 6.4 * s, fill: c, w: 500 });
  g += `<path d="M${x + 62 * s},${y - 22 * s} L${x + 76 * s},${y - 22 * s} L${x + 84 * s},${y - 13 * s} L${x + 84 * s},${y - 6 * s} L${x + 62 * s},${y - 6 * s} Z" fill="${c}"/>`;
  g += `<rect x="${x + 66 * s}" y="${y - 19.5 * s}" width="${9 * s}" height="${6 * s}" fill="#CFEFF5"/>`;
  g += `<circle cx="${x + 14 * s}" cy="${y - 5 * s}" r="${5 * s}" fill="#2b2b2b"/><circle cx="${x + 72 * s}" cy="${y - 5 * s}" r="${5 * s}" fill="#2b2b2b"/>`;
  g += `<circle cx="${x + 14 * s}" cy="${y - 5 * s}" r="${2 * s}" fill="#bbb"/><circle cx="${x + 72 * s}" cy="${y - 5 * s}" r="${2 * s}" fill="#bbb"/>`;
  return g;
}

/** logo Budoexpert: trójkąt + wordmark. (x, y) = lewy dół trójkąta; h = wysokość trójkąta */
export function logo(x, y, h, tri = '#20CFA3', txt = '#6C0C79', o = {}) {
  const w = h * 1.17, r = h * .09;
  let g = `<path d="M${x + r},${y - r * .6} L${x + w / 2},${y - h + r * 1.1} L${x + w - r},${y - r * .6} Z" fill="${tri}" stroke="${tri}" stroke-width="${r * 2.2}" stroke-linejoin="round"/>`;
  if (!o.noText) g += T(x + w + h * .32, y + h * .02, 'budoexpert', { size: h * 1.38, fill: txt, w: 500, ls: -h * .02 });
  return g;
}

/** urządzenie z ekranem aplikacji. content = SVG w układzie lokalnym (0..w, 0..h ekranu) */
export function device(x, y, w, h, p, content = '', o = {}) {
  const b = o.bezel || 3.2, fr = o.frame || '#1F1A24';
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 6}" fill="${fr}"/>`;
  g += `<rect x="${x + b}" y="${y + b}" width="${w - 2 * b}" height="${h - 2 * b}" rx="${(o.r || 6) - 2}" fill="${o.screen || '#fff'}"/>`;
  g += `<g transform="translate(${x + b},${y + b})">${content}</g>`;
  return g;
}

/** nagłówek aplikacji z marką (na każdym ekranie nowego świata) */
export function appBar(w, hgt = 14, title = '') {
  let g = `<rect x="0" y="0" width="${w}" height="${hgt}" fill="#6C0C79"/>`;
  g += logo(4, hgt * .7, hgt * .36, '#20CFA3', '#FFFFFF');
  if (title) g += T(w - 4, hgt * .66, title, { size: hgt * .36, fill: '#E9D7EC', a: 'end', w: 400 });
  return g;
}

export function bubble(x, y, w, h, str, o = {}) {
  const fill = o.fill || '#fff', tail = o.tail || 'left';
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2.6}" fill="${fill}" stroke="${o.stroke || '#555'}" stroke-width=".7"/>`;
  const tx = tail === 'left' ? x + 10 : x + w - 10;
  g += `<path d="M${tx - 4},${y + h - .4} L${tx + (tail === 'left' ? -6 : 6)},${y + h + 7} L${tx + 4},${y + h - .4} Z" fill="${fill}" stroke="${o.stroke || '#555'}" stroke-width=".7"/><rect x="${tx - 4.5}" y="${y + h - 1.6}" width="9" height="2" fill="${fill}"/>`;
  g += T(x + w / 2, y + h / 2 + (o.size || 7) * .36, str, { size: o.size || 7, a: 'middle', fill: o.color || '#333', w: o.w || 600 });
  return g;
}

export const check = (x, y, r, c = '#20CFA3') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><path d="M${x - r * .45},${y} l${r * .32},${r * .34} l${r * .6},${-r * .62}" stroke="#fff" stroke-width="${r * .28}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

export const arrowNote = (x1, y1, x2, y2, str, c = '#C2410C', o = {}) =>
  `<g><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width=".7" stroke-dasharray="2 1.5"/><circle cx="${x2}" cy="${y2}" r="1.3" fill="${c}"/>` + T(x1 + (o.dx || 0), y1 + (o.dy ?? -2), str, { size: 5.6, fill: c, w: 600, a: o.a || 'start' }) + '</g>';

export const motion = (x, y, n = 3, c = '#555', len = 6, ang = 0) => {
  let s = `<g stroke="${c}" stroke-width=".8" stroke-linecap="round" transform="rotate(${ang} ${x} ${y})">`;
  for (let i = 0; i < n; i++) s += `<line x1="${x}" y1="${y + i * 3}" x2="${x + len}" y2="${y + i * 3}"/>`;
  return s + '</g>';
};
export const vibe = (x, y, h, c = '#20CFA3') =>
  `<path d="M${x - 4},${y} q-2,${h / 2} 0,${h} M${x - 7},${y - 2} q-3,${h / 2 + 2} 0,${h + 4}" stroke="${c}" stroke-width=".9" fill="none" stroke-linecap="round"/>`;

export { W, H, id };
