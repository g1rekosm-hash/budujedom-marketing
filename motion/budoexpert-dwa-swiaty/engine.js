/* =====================================================================
   Silnik 2.5D dla „Dwa światy budowania”
   warstwy z paralaksą i głębią ostrości · światło i atmosfera · postacie z cieniowaniem ·
   urządzenia w perspektywie · typografia kinetyczna
   ===================================================================== */
const W = 1920, H = 1080, TAU = Math.PI * 2;

/* ---------- matematyka ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const P = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  inCubic: x => x * x * x, outCubic: x => 1 - Math.pow(1 - x, 3),
  inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
  outQuad: x => 1 - (1 - x) * (1 - x), inQuad: x => x * x,
  inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10), outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: (x, s = 1.70158) => x <= 0 ? 0 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
  spring: (x, f = 4.5, d = 5.5) => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.exp(-d * x) * Math.cos(f * Math.PI * x),
};
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hex2 = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const rgba = (h, a = 1) => { const [r, g, b] = hex2(h); return `rgba(${r},${g},${b},${a})`; };
const mix = (h1, h2, t) => { const a = hex2(h1), b = hex2(h2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(t))).toString(16).padStart(2, '0')).join(''); };
const shade = (h, k) => k < 0 ? mix(h, '#000000', -k) : mix(h, '#ffffff', k);
const noise1 = (x, seed = 0) => { const i = Math.floor(x), f = x - i, h = n => { const s = Math.sin((n + seed * 57.1) * 127.1) * 43758.5453; return s - Math.floor(s); }; const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; };

/* ---------- paleta ---------- */
const O = { paper: '#E3E6EA', wall: '#C5CBD2', shadow: '#6E7884', night: '#232A33', line: '#3B404B', rain: '#9AAABB', lamp: '#E6D9A8', alarm: '#C2766B', skin: '#C9C2BA', ink: '#353A44', sky: '#B9C2CC' };
const N = { paper: '#FFF8F0', grid: '#F5E6D8', grid2: '#EED6C4', purple: '#6C0C79', purple2: '#520A5C', teal: '#20CFA3', teal2: '#17A884',
  sun: '#FFD38A', lamp: '#FFC978', ink: '#3B1442', skin: '#F4C7A1', cream: '#FCEBDB', lav: '#F3E6F5', wood: '#D9A46A', glow: '#FFE2B0' };

/* ---------- podstawy rysowania ---------- */
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(ctx, x, y, w, h, r, col) { ctx.fillStyle = col; rr(ctx, x, y, w, h, r); ctx.fill(); }
function circ(ctx, x, y, r, col) { if (r <= 0) return; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function ell(ctx, x, y, rx, ry, col, rot = 0) { if (rx <= 0 || ry <= 0) return; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fill(); }
function ring(ctx, x, y, r, lw, col) { if (r <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
function line(ctx, x1, y1, x2, y2, lw, col) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function poly(ctx, pts, col) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); if (col) { ctx.fillStyle = col; ctx.fill(); } }
function lin(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rad(ctx, x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function txt(ctx, s, x, y, size, weight, col, align = 'left', ls = 0) {
  ctx.font = `${weight} ${size}px Poppins`; ctx.letterSpacing = ls + 'px'; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y); ctx.letterSpacing = '0px';
}
function tw(ctx, s, size, weight, ls = 0) { ctx.font = `${weight} ${size}px Poppins`; ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.letterSpacing = '0px'; return w; }
function popScale(ctx, k, x, y) { ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); }
function softShadow(ctx, blur, dy, a = .3, col = '20,8,30') { ctx.shadowColor = `rgba(${col},${a})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = dy; ctx.shadowOffsetX = 0; }
function noShadow(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.shadowOffsetX = 0; }
/* bryła oświetlona z boku: gradient od jasnej do ciemnej strony */
function litFill(ctx, x0, x1, col, light = -1, k1 = .14, k2 = -.22) {
  const a = light < 0 ? x0 : x1, b = light < 0 ? x1 : x0;
  return lin(ctx, a, 0, b, 0, [[0, shade(col, k1)], [.55, col], [1, shade(col, k2)]]);
}
/* cień kontaktowy */
function contact(ctx, x, y, rx, ry, a = .35, col = '0,0,0') { ctx.fillStyle = rad(ctx, 0, 0, 0, 1, [[0, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]); ctx.save(); ctx.translate(x, y); ctx.scale(rx, ry); ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore(); }

/* ---------- warstwy z paralaksą i głębią ostrości ----------
   cam = { x, y, zoom, focus, dof }   z: 1 = płaszczyzna ostrości kadru, >1 dalej, <1 bliżej kamery */
const BUFS = [];
let bufTop = 0;
function getBuf(scale = .5) {
  let b = BUFS[bufTop];
  if (!b) { const c = document.createElement('canvas'); c.width = W; c.height = H; b = BUFS[bufTop] = { c, g: c.getContext('2d') }; }
  bufTop++;
  b.g.setTransform(1, 0, 0, 1, 0, 0); b.g.clearRect(0, 0, W, H); b.g.filter = 'none'; b.g.globalAlpha = 1; b.g.globalCompositeOperation = 'source-over';
  b.g.scale(scale, scale);
  return b;
}
function relBuf() { bufTop--; }
function camT(ctx, cam, z) {
  const k = 1 / z, s = 1 + ((cam.zoom || 1) - 1) * k;
  ctx.translate(W / 2, H / 2); ctx.rotate((cam.rot || 0) * k); ctx.scale(s, s); ctx.translate(-W / 2 - (cam.x || 0) * k, -H / 2 - (cam.y || 0) * k);
}
function layer(ctx, cam, z, draw, o = {}) {
  const focus = cam.focus || 1, dof = cam.dof ?? 14;
  const blur = o.blur ?? Math.min(26, Math.abs(1 / z - 1 / focus) * dof);
  if (blur < .7) {
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; if (o.op) ctx.globalCompositeOperation = o.op; camT(ctx, cam, z); draw(ctx); ctx.restore();
    return;
  }
  const b = getBuf(.5);
  b.g.save(); camT(b.g, cam, z); draw(b.g); b.g.restore();
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; if (o.op) ctx.globalCompositeOperation = o.op;
  ctx.filter = `blur(${(blur * .5).toFixed(1)}px)`; ctx.drawImage(b.c, 0, 0, W / 2, H / 2, 0, 0, W, H); ctx.filter = 'none';
  ctx.restore();
  relBuf();
}
/* ruch kamery: płynny dryf + lekki „oddech” (handheld) */
function drift(u, d, a, b, ease = E.inOutSine) { const k = ease(clamp(u / d)); const o = {}; for (const key of Object.keys(a)) o[key] = lerp(a[key], b[key] ?? a[key], k); return o; }
function handheld(cam, u, amp = 1, seed = 1) { cam.x = (cam.x || 0) + noise1(u * .7, seed) * 6 * amp; cam.y = (cam.y || 0) + noise1(u * .6, seed + 3) * 4 * amp; cam.rot = (cam.rot || 0) + noise1(u * .5, seed + 7) * .002 * amp; return cam; }

/* ---------- światło i atmosfera ---------- */
function glow(ctx, x, y, r, col, a, op = 'lighter') { ctx.save(); ctx.globalCompositeOperation = op; ctx.fillStyle = rad(ctx, x, y, 0, r, [[0, rgba(col, a)], [.4, rgba(col, a * .35)], [1, rgba(col, 0)]]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }
/* stożek światła lampy z gradientem wzdłuż osi */
function cone(ctx, x, y, w0, w1, len, col, a, op = 'screen') {
  ctx.save(); ctx.globalCompositeOperation = op;
  const g = lin(ctx, 0, y, 0, y + len, [[0, rgba(col, a)], [.6, rgba(col, a * .45)], [1, rgba(col, 0)]]);
  poly(ctx, [[x - w0, y], [x + w0, y], [x + w1, y + len], [x - w1, y + len]]); ctx.fillStyle = g; ctx.fill();
  // miękkie krawędzie: drugi, szerszy, słabszy stożek
  poly(ctx, [[x - w0 * 1.3, y], [x + w0 * 1.3, y], [x + w1 * 1.25, y + len], [x - w1 * 1.25, y + len]]);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + len, [[0, rgba(col, a * .3)], [1, rgba(col, 0)]]); ctx.fill();
  ctx.restore();
}
/* promienie słońca przez okno: równoległe smugi pod kątem */
function rays(ctx, t, x, y, w, len, ang, col, a, n = 6, seed = 3) {
  const r = rng(seed);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(x, y); ctx.rotate(ang);
  for (let i = 0; i < n; i++) {
    const ox = (i / n) * w + r() * 30, bw = 40 + r() * 90, flick = .7 + .3 * Math.sin(t * (.4 + r() * .6) + r() * 6);
    ctx.fillStyle = lin(ctx, 0, 0, 0, len, [[0, rgba(col, a * flick)], [.7, rgba(col, a * .4 * flick)], [1, rgba(col, 0)]]);
    poly(ctx, [[ox, 0], [ox + bw, 0], [ox + bw * 1.4, len], [ox + bw * .2, len]]); ctx.fill();
  }
  ctx.restore();
}
/* unoszący się kurz / pyłki w świetle */
function dust(ctx, t, x, y, w, h, n, seed, col = '#ffffff', a = .6, size = 3) {
  const r = rng(seed);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const px = x + ((r() * w + t * (6 + r() * 14) + noise1(t * .3 + i, seed) * 30) % w + w) % w;
    const py = y + ((r() * h - t * (4 + r() * 10) + noise1(t * .25 + i * 3, seed + 1) * 20) % h + h) % h;
    const tw_ = .5 + .5 * Math.sin(t * (1 + r() * 2) + i);
    circ(ctx, px, py, size * (.4 + r()), rgba(col, a * tw_));
  }
  ctx.restore();
}
/* bokeh: duże miękkie kółka światła */
function bokeh(ctx, t, n, seed, cols, x, y, w, h, rMin, rMax, a) {
  const r = rng(seed);
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    const R = lerp(rMin, rMax, r()), px = x + r() * w + Math.sin(t * .3 + i) * 12, py = y + r() * h + Math.cos(t * .25 + i) * 8, c = cols[i % cols.length];
    ctx.fillStyle = rad(ctx, px, py, R * .6, R, [[0, rgba(c, a * (.5 + .5 * r()))], [1, rgba(c, 0)]]);
    ctx.beginPath(); ctx.arc(px, py, R, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
function fog(ctx, y0, y1, col, a0, a1 = 0) { ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, rgba(col, a0)], [1, rgba(col, a1)]]); ctx.fillRect(-W, y0, W * 3, y1 - y0); }
/* deszcz: deterministyczne smugi; z steruje grubością i długością */
function rain(ctx, t, o = {}) {
  const { n = 200, col = O.rain, a = .5, len = 46, lw = 2, slant = .16, speed = 1700, seed = 7, x0 = -300, w = W + 600, h = H } = o;
  const r = rng(seed);
  ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha *= a; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const bx = x0 + r() * w, y0 = r() * (h + 300), sp = speed * (.8 + .4 * r()), L = len * (.6 + .7 * r()), span = h + L + 200;
    const y = ((y0 + sp * t) % span + span) % span - L - 100;
    const x = bx - slant * y;
    ctx.moveTo(x, y); ctx.lineTo(x - slant * L, y + L);
  }
  ctx.stroke(); ctx.restore();
}
/* rozbryzgi kropli na ziemi */
function splashes(ctx, t, x, y, w, h, n, seed, col = '#D4DCE4', a = .5) {
  const r = rng(seed);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.6;
  for (let i = 0; i < n; i++) {
    const px = x + r() * w, py = y + r() * h, ph = (t * (1.4 + r()) + r()) % 1, s = .5 + (py - y) / h;
    ctx.globalAlpha = a * (1 - ph); ctx.beginPath(); ctx.ellipse(px, py, (3 + ph * 18) * s, (1 + ph * 5) * s, 0, Math.PI, TAU); ctx.stroke();
  }
  ctx.restore();
}
/* krople na obiektywie (w przestrzeni ekranu) */
function lensDrops(ctx, t, n, seed, a = 1) {
  const r = rng(seed);
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const R = 8 + r() * 26, x = r() * W, y0 = r() * H, slide = r() < .3 ? ((t * (20 + r() * 60)) % 400) : 0, y = y0 + slide;
    ctx.fillStyle = rad(ctx, x - R * .3, y - R * .35, R * .1, R, [[0, 'rgba(255,255,255,.10)'], [.7, 'rgba(255,255,255,.03)'], [.92, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]);
    ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(20,26,34,.10)'; ctx.beginPath(); ctx.arc(x + R * .15, y + R * .2, R * .75, 0, Math.PI); ctx.fill();
    circ(ctx, x - R * .35, y - R * .4, R * .14, 'rgba(255,255,255,.35)');
  }
  ctx.restore();
}
function clouds(ctx, t, y, n, seed, col, a, scale = 1, speed = 8) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const cx = ((r() * (W + 800) + t * speed * (.5 + r())) % (W + 800)) - 400, cy = y + r() * 160 * scale, s = (160 + r() * 260) * scale;
    for (let k = 0; k < 5; k++) ell(ctx, cx + (k - 2) * s * .38, cy - Math.sin(k / 4 * Math.PI) * s * .22, s * (.35 + r() * .2), s * (.22 + r() * .1), rgba(col, a));
  }
}

/* ---------- perspektywa: płaski obraz obrócony w 3D ---------- */
function proj(px, py, o) {
  const cyr = Math.cos(o.ry || 0), syr = Math.sin(o.ry || 0), cxr = Math.cos(o.rx || 0), sxr = Math.sin(o.rx || 0);
  let x = px * cyr, z = -px * syr;
  const y = py * cxr - z * sxr; z = py * sxr + z * cxr;
  const f = (o.fov || 1800) / ((o.fov || 1800) + z);
  const cr = Math.cos(o.rz || 0), sr = Math.sin(o.rz || 0), X = x * f, Y = y * f;
  return [o.cx + (X * cr - Y * sr) * (o.s || 1), o.cy + (X * sr + Y * cr) * (o.s || 1)];
}
function warp(ctx, img, w, h, o, n = 14) {
  const cw = w / n, ch = h / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const sx = i * cw, sy = j * ch;
    const p0 = proj(sx - w / 2, sy - h / 2, o), p1 = proj(sx + cw - w / 2, sy - h / 2, o), p2 = proj(sx - w / 2, sy + ch - h / 2, o);
    ctx.save(); ctx.transform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p2[0] - p0[0]) / ch, (p2[1] - p0[1]) / ch, p0[0], p0[1]);
    ctx.drawImage(img, sx, sy, Math.min(cw + 1.5, w - sx), Math.min(ch + 1.5, h - sy), 0, 0, Math.min(cw + 1.5, w - sx), Math.min(ch + 1.5, h - sy));
    ctx.restore();
  }
}
const quadOf = (w, h, o) => [proj(-w / 2, -h / 2, o), proj(w / 2, -h / 2, o), proj(w / 2, h / 2, o), proj(-w / 2, h / 2, o)];
const CANV = {};
function surface(key, w, h) { let c = CANV[key]; if (!c || c.width !== w || c.height !== h) { c = CANV[key] = document.createElement('canvas'); c.width = w; c.height = h; } const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); return [c, g]; }
/* urządzenie (telefon/tablet/monitor) z ekranem rysowanym przez fn(g, x, y, w, h) i obrotem 3D */
function device3D(ctx, key, w, h, o, fn) {
  const [c, g] = surface(key, w, h);
  const b = o.bezel ?? 18, r = o.r ?? 56;
  g.fillStyle = lin(g, 0, 0, w, h, [[0, shade(o.frame || '#2A0F30', .18)], [.5, o.frame || '#2A0F30'], [1, shade(o.frame || '#2A0F30', -.3)]]); rr(g, 0, 0, w, h, r); g.fill();
  g.save(); rr(g, b, b, w - 2 * b, h - 2 * b, Math.max(4, r - b)); g.clip();
  g.fillStyle = o.screen || '#fff'; g.fillRect(b, b, w - 2 * b, h - 2 * b);
  fn(g, b, b, w - 2 * b, h - 2 * b);
  g.restore();
  const q = quadOf(w, h, o);
  // cień pod urządzeniem
  ctx.save(); ctx.filter = `blur(${o.shadowBlur ?? 40}px)`; ctx.globalAlpha = o.shadowA ?? .35;
  poly(ctx, q.map(([x, y]) => [x + (o.shadowDx ?? 30), y + (o.shadowDy ?? 50)]), '#1A0820'); ctx.restore();
  warp(ctx, c, w, h, o, o.n || 14);
  // odblask szkła
  if (o.glare !== false) {
    ctx.save(); poly(ctx, q); ctx.clip(); ctx.globalCompositeOperation = 'screen';
    const gx = lerp(q[0][0] - 600, q[2][0] + 300, o.glarePos ?? .3);
    ctx.fillStyle = lin(ctx, gx - 300, 0, gx + 300, 0, [[0, 'rgba(255,255,255,0)'], [.5, `rgba(255,255,255,${o.glareA ?? .14})`], [1, 'rgba(255,255,255,0)']]);
    ctx.fillRect(Math.min(...q.map(p => p[0])) - 50, Math.min(...q.map(p => p[1])) - 50, 3000, 3000); ctx.restore();
  }
  return q;
}
/* pasek aplikacji Budoexpert (w nowym świecie na każdym ekranie) */
function appBar(g, x, y, w, h, title, size) {
  g.fillStyle = lin(g, x, 0, x + w, 0, [[0, N.purple], [1, shade(N.purple, -.12)]]); g.fillRect(x, y, w, h);
  const ls = size || h * .36, lw_ = logo(g, x + h * .32, y + h / 2, ls, N.teal, '#fff', 'left');
  if (title) txt(g, title, x + w - h * .32, y + h / 2 + ls * .3, ls * .74, 400, 'rgba(255,255,255,.82)', 'right');
}
/* pływająca karta UI z miękkim cieniem */
function card(ctx, x, y, w, h, r = 26, bg = '#fff', sh = 1) {
  ctx.save(); softShadow(ctx, 50 * sh, 26 * sh, .22 * sh); fillRR(ctx, x, y, w, h, r, bg); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, 'rgba(255,255,255,.5)'], [.1, 'rgba(255,255,255,0)']]); ctx.fillRect(x, y, w, h); ctx.restore();
}

/* ---------- logo i ikony ---------- */
function triPath(ctx, cx, cy, R, round = .2) {
  const p = [-90, 30, 150].map(a => [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)]);
  const rad_ = R * round, m = [(p[0][0] + p[2][0]) / 2, (p[0][1] + p[2][1]) / 2];
  ctx.beginPath(); ctx.moveTo(m[0], m[1]);
  ctx.arcTo(p[0][0], p[0][1], p[1][0], p[1][1], rad_); ctx.arcTo(p[1][0], p[1][1], p[2][0], p[2][1], rad_); ctx.arcTo(p[2][0], p[2][1], p[0][0], p[0][1], rad_);
  ctx.closePath();
}
function tri(ctx, cx, cy, R, col, round) { triPath(ctx, cx, cy, R, round); ctx.fillStyle = col; ctx.fill(); }
function logo(ctx, x, y, size, triCol = N.teal, txtCol = '#fff', align = 'center', a = 1) {
  const R = size * .6, triW = R * Math.sqrt(3), gap = size * .26, w = tw(ctx, 'budoexpert', size, 600), total = triW + gap + w;
  const x0 = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const base = y + size * .36;
  ctx.save(); ctx.globalAlpha *= a;
  tri(ctx, x0 + triW / 2, base - R / 2 - size * .02, R, triCol, .16);
  txt(ctx, 'budoexpert', x0 + triW + gap, base, size, 600, txtCol);
  ctx.restore();
  return total;
}
function check(ctx, x, y, r, k = 1, bg = N.teal, fg = '#fff') {
  if (k <= 0) return;
  ctx.save(); popScale(ctx, k, x, y); circ(ctx, x, y, r, bg);
  ctx.strokeStyle = fg; ctx.lineWidth = r * .24; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .33); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke();
  ctx.restore();
}
function star(ctx, x, y, r, col) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; ctx.lineTo(x + q * Math.cos(a), y + q * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
function pill(ctx, x, y, w, h, bg, label, size, fg, weight = 600) { fillRR(ctx, x, y, w, h, h / 2, bg); if (label) txt(ctx, label, x + w / 2, y + h / 2 + size * .36, size, weight, fg, 'center'); }
function clock(ctx, x, y, r, h, m, sec, o = {}) {
  const face = o.face || '#D5D9DE', rim = o.rim || O.shadow, hand = o.hand || O.line;
  contact(ctx, x + r * .12, y + r * .16, r * 1.05, r * 1.05, .3);
  circ(ctx, x, y, r, rim); circ(ctx, x, y, r * .86, face);
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .4, 0, r, [[0, 'rgba(255,255,255,.35)'], [1, 'rgba(0,0,0,.08)']]); ctx.beginPath(); ctx.arc(x, y, r * .86, 0, TAU); ctx.fill();
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; line(ctx, x + Math.sin(a) * r * .66, y - Math.cos(a) * r * .66, x + Math.sin(a) * r * .76, y - Math.cos(a) * r * .76, r * .045, rgba(hand, .7)); }
  const ha = ((h % 12) + m / 60) * TAU / 12, ma = (m / 60) * TAU;
  line(ctx, x, y, x + Math.sin(ha) * r * .42, y - Math.cos(ha) * r * .42, r * .085, hand);
  line(ctx, x, y, x + Math.sin(ma) * r * .64, y - Math.cos(ma) * r * .64, r * .055, hand);
  if (sec != null) { const sa = sec / 60 * TAU; line(ctx, x - Math.sin(sa) * r * .15, y + Math.cos(sa) * r * .15, x + Math.sin(sa) * r * .7, y - Math.cos(sa) * r * .7, r * .025, o.sec || O.alarm); }
  circ(ctx, x, y, r * .06, hand);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = lin(ctx, x - r, y - r, x + r * .2, y, [[0, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']]); ctx.beginPath(); ctx.arc(x, y, r * .86, Math.PI * .9, Math.PI * 1.9); ctx.fill(); ctx.restore();
}

/* ---------- postacie z cieniowaniem ----------
   o: x, y (stopy), s, wygląd (hair, hairCol, top, legs, skin, ink, hatCol, apron),
      light: -1 (światło z lewej) / 1, rim: kolor kontry, rimSide, face, tilt, hdx, hdy, dy, seated, back, armL/armR, shadow */
function torsoPath(ctx, x, top, bot, bw) {
  ctx.beginPath(); ctx.moveTo(x - bw * .2, top);
  ctx.quadraticCurveTo(x - bw * .5, top + 2, x - bw * .5, top + bw * .3);
  ctx.lineTo(x - bw * .45, bot); ctx.quadraticCurveTo(x, bot + bw * .06, x + bw * .45, bot);
  ctx.lineTo(x + bw * .5, top + bw * .3); ctx.quadraticCurveTo(x + bw * .5, top + 2, x + bw * .2, top); ctx.closePath();
}
function rimStroke(ctx, pathFn, x0, x1, col, side, w, a = .9) {
  ctx.save(); pathFn(); ctx.clip();
  const g = side < 0 ? lin(ctx, x0, 0, x0 + (x1 - x0) * .22, 0, [[0, rgba(col, a)], [1, rgba(col, 0)]]) : lin(ctx, x1, 0, x1 - (x1 - x0) * .22, 0, [[0, rgba(col, a)], [1, rgba(col, 0)]]);
  pathFn(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
}
function hairBack(ctx, r, o) { if (o.hair === 'long') { ctx.fillStyle = lin(ctx, 0, -r, 0, r * 1.4, [[0, shade(o.hairCol, .08)], [1, shade(o.hairCol, -.25)]]); rr(ctx, -r * 1.1, -r * 1.06, r * 2.2, r * (o.back ? 2.55 : 2.2), [r, r, r * .4, r * .4]); ctx.fill(); } }
function hairFront(ctx, r, o) {
  const L = o.light || -1;
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 1.06, 0, TAU); ctx.clip();
  ctx.fillStyle = lin(ctx, L * r, -r, -L * r, r * .2, [[0, shade(o.hairCol, .18)], [1, shade(o.hairCol, -.2)]]);
  if (o.back) ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * (o.hair === 'long' ? 2.4 : 1.95));
  else {
    if (o.hair === 'long') poly(ctx, [[-r * 1.2, -r * 1.2], [r * 1.2, -r * 1.2], [r * 1.2, -r * .05], [r * .82, -r * .32], [r * .15, -r * .52], [-r * .5, -r * .38], [-r * 1.2, r * .1]]);
    else poly(ctx, [[-r * 1.2, -r * 1.2], [r * 1.2, -r * 1.2], [r * 1.2, -r * .3], [r * .7, -r * .5], [0, -r * .6], [-r * .75, -r * .45], [-r * 1.2, -r * .2]]);
    ctx.fill();
  }
  // połysk włosów
  ctx.strokeStyle = rgba('#ffffff', .1); ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, r * .78, Math.PI * (L < 0 ? 1.15 : 1.55), Math.PI * (L < 0 ? 1.45 : 1.85)); ctx.stroke();
  ctx.restore();
  if (o.hair === 'cap' && !o.noHat) {
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 1.07, 0, TAU); ctx.clip();
    ctx.fillStyle = lin(ctx, L * r, -r, -L * r, 0, [[0, shade(o.hatCol, .2)], [1, shade(o.hatCol, -.2)]]); ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * .82); ctx.restore();
    fillRR(ctx, -r * .98, -r * .44, r * 1.96, r * .2, r * .1, shade(o.hatCol, -.22));
    if (!o.back) { fillRR(ctx, -r * .1, -r * .46, r * 1.28, r * .2, r * .1, shade(o.hatCol, -.32)); }
  }
  if (o.hair === 'hard') {
    ctx.fillStyle = lin(ctx, L * r, -r * 1.2, -L * r, 0, [[0, shade(o.hatCol, .3)], [.5, o.hatCol], [1, shade(o.hatCol, -.25)]]);
    ctx.beginPath(); ctx.ellipse(0, -r * .32, r * 1.04, r * .92, 0, Math.PI, TAU); ctx.fill();
    fillRR(ctx, -r * 1.32, -r * .42, r * 2.64, r * .22, r * .11, shade(o.hatCol, -.15));
    fillRR(ctx, -r * .1, -r * 1.2, r * .2, r * .8, r * .1, shade(o.hatCol, .22));
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ell(ctx, L * r * .45, -r * .85, r * .22, r * .1, 'rgba(255,255,255,.45)', L * .5); ctx.restore();
  }
}
function face(ctx, r, o) {
  const f = o.face || {}, ink = o.ink, lx = (f.lx || 0) * r, ly = (f.ly || 0) * r, L = o.light || -1;
  const ex = r * .34, ey = -r * .02 + ly, eyes = f.eyes || 'open';
  ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineCap = 'round'; ctx.lineWidth = r * .07;
  if (f.bags) for (const sx of [-1, 1]) { ctx.strokeStyle = rgba(ink, .22); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(sx * ex + lx, ey + r * .07, r * .12, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
  ctx.strokeStyle = ink; ctx.lineWidth = r * .07;
  for (const sx of [-1, 1]) {
    const x = sx * ex + lx;
    if (eyes === 'open' || eyes === 'half') {
      ell(ctx, x, ey, r * .085, r * .105, ink); circ(ctx, x + L * r * .03, ey - r * .04, r * .03, 'rgba(255,255,255,.9)');
      if (eyes === 'half') { ctx.fillStyle = o.skin; ctx.beginPath(); ctx.rect(x - r * .12, ey - r * .14, r * .24, r * .13); ctx.fill(); line(ctx, x - r * .11, ey - r * .01, x + r * .11, ey - r * .01, r * .045, ink); }
    }
    else if (eyes === 'closed') { ctx.beginPath(); ctx.arc(x, ey - r * .03, r * .12, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
    else if (eyes === 'happy') { ctx.beginPath(); ctx.arc(x, ey + r * .06, r * .12, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
  }
  if (f.brows === 'sad') for (const sx of [-1, 1]) line(ctx, sx * ex + lx - sx * r * .13, ey - r * .3, sx * ex + lx + sx * r * .12, ey - r * .2, r * .05, ink);
  if (f.brows === 'up') for (const sx of [-1, 1]) line(ctx, sx * ex + lx - sx * r * .1, ey - r * .27, sx * ex + lx + sx * r * .12, ey - r * .28, r * .05, ink);
  if (o.cheeks) for (const sx of [-1, 1]) circ(ctx, sx * r * .52 + lx, r * .22 + ly, r * .13, 'rgba(240,110,100,.25)');
  // nos: delikatny cień
  ctx.strokeStyle = rgba(ink, .25); ctx.lineWidth = r * .045; ctx.beginPath(); ctx.arc(lx - L * r * .03, ly + r * .14, r * .07, -L > 0 ? -.4 : Math.PI * .4, -L > 0 ? Math.PI * .6 : Math.PI * 1.4); ctx.stroke();
  const my = r * .42 + ly, mw = r * (f.mw || .28);
  ctx.strokeStyle = ink; ctx.lineWidth = r * .065;
  switch (f.mouth || 'flat') {
    case 'sad': ctx.beginPath(); ctx.arc(lx, my + mw * .9, mw, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); break;
    case 'smile': ctx.beginPath(); ctx.arc(lx, my - mw * .7, mw, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); break;
    case 'laugh': ctx.beginPath(); ctx.arc(lx, my - r * .08, mw * 1.05, 0, Math.PI); ctx.closePath(); ctx.fillStyle = shade(ink, .05); ctx.fill(); ctx.save(); ctx.clip(); ell(ctx, lx, my + r * .1, mw * .6, mw * .35, '#E8707A'); ctx.restore(); break;
    case 'o': ring(ctx, lx, my, r * .08, r * .05, ink); break;
    case 'none': break;
    default: line(ctx, lx - mw * .6, my, lx + mw * .6, my, r * .06, ink);
  }
}
function figure(ctx, o) {
  const s = o.s || 1, x = o.x, G = o.y, L = o.light || -1;
  const legH = 110 * s, bw = 128 * s * (o.wide || 1), r = 52 * s * (o.headK || 1);
  const bodyBot = G - legH, bodyTop = bodyBot - 170 * s * (o.tall || 1) + (o.dy || 0) * s;
  if (o.shadow !== false && !o.seated) contact(ctx, x + L * -18 * s, G + 4 * s, 100 * s, 16 * s, .38);
  if (!o.seated) {
    for (const sx of [-1, 1]) {
      const lxp = x + sx * 27 * s + (o.step ? sx * o.step * s : 0);
      ctx.fillStyle = litFill(ctx, lxp - 15 * s, lxp + 15 * s, o.legs, L); rr(ctx, lxp - 15 * s, bodyBot - 14 * s, 30 * s, legH, 10 * s); ctx.fill();
      ctx.fillStyle = litFill(ctx, lxp - 20 * s, lxp + 24 * s, o.shoes || '#2A2730', L, .2); rr(ctx, lxp - 18 * s + sx * 4 * s, G - 18 * s, 40 * s, 20 * s, [10 * s, 10 * s, 5 * s, 5 * s]); ctx.fill();
    }
  }
  ctx.save(); ctx.translate((o.lean || 0) * s, 0);
  const bb = bodyBot + (o.seated ? 34 * s : 0);
  // szyja
  ctx.fillStyle = shade(o.skin, -.18); rr(ctx, x - 15 * s + (o.hdx || 0) * s * .4, bodyTop - 26 * s, 30 * s, 34 * s, 8 * s); ctx.fill();
  const tp = () => torsoPath(ctx, x, bodyTop, bb, bw);
  tp(); ctx.fillStyle = litFill(ctx, x - bw / 2, x + bw / 2, o.top, L); ctx.fill();
  // AO pod brodą i dekolt
  ctx.save(); tp(); ctx.clip();
  ctx.fillStyle = rad(ctx, x, bodyTop - 4 * s, 0, 70 * s, [[0, 'rgba(0,0,0,.28)'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - 80 * s, bodyTop - 80 * s, 160 * s, 160 * s);
  if (!o.back) { ctx.strokeStyle = shade(o.top, -.25); ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.arc(x, bodyTop - 6 * s, 30 * s, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
  ctx.fillStyle = lin(ctx, 0, bb - 60 * s, 0, bb, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.18)']]); ctx.fillRect(x - bw, bb - 60 * s, bw * 2, 60 * s);
  ctx.restore();
  if (o.apron) { ctx.fillStyle = litFill(ctx, x - bw * .3, x + bw * .3, o.apron, L); rr(ctx, x - bw * .3, bodyTop + 44 * s, bw * .6, bb - bodyTop - 44 * s, [8 * s, 8 * s, 6 * s, 6 * s]); ctx.fill(); line(ctx, x - bw * .26, bodyTop + 46 * s, x - bw * .14, bodyTop + 4 * s, 5 * s, shade(o.apron, -.1)); line(ctx, x + bw * .26, bodyTop + 46 * s, x + bw * .14, bodyTop + 4 * s, 5 * s, shade(o.apron, -.1)); }
  if (o.rim) rimStroke(ctx, tp, x - bw / 2, x + bw / 2, o.rim, o.rimSide || -L, 8 * s, o.rimA ?? .5);
  // głowa
  const hx = x + (o.hdx || 0) * s, hy = bodyTop - 40 * s + (o.hdy || 0) * s;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.tilt || 0);
  hairBack(ctx, r, o);
  if (!o.back) for (const sx of [-1, 1]) circ(ctx, sx * r * .98, r * .08, r * .2, shade(o.skin, sx === L ? -.02 : -.16));
  ctx.fillStyle = rad(ctx, L * r * .35, -r * .35, r * .1, r * 1.15, [[0, shade(o.skin, .12)], [.7, o.skin], [1, shade(o.skin, -.16)]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  if (!o.back) face(ctx, r, o);
  hairFront(ctx, r, o);
  if (o.rim) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 1.07, 0, TAU); ctx.clip(); const sd = o.rimSide || -L; ctx.strokeStyle = lin(ctx, sd * r, 0, sd * r * .6, 0, [[0, rgba(o.rim, o.rimA ?? .5)], [1, rgba(o.rim, 0)]]); ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  // ręce
  for (const side of [-1, 1]) {
    const arm = side < 0 ? o.armL : o.armR; if (!arm) continue;
    const sx = x + side * (bw / 2 - 16 * s), sy = bodyTop + 36 * s;
    let hxp, hyp, ex, ey;
    if (arm.abs) { [hxp, hyp] = arm.abs; ex = (sx + hxp) / 2 + side * 14 * s; ey = (sy + hyp) / 2 + 12 * s; }
    else { hxp = sx + side * arm.h[0] * s; hyp = sy + arm.h[1] * s; ex = arm.e ? sx + side * arm.e[0] * s : (sx + hxp) / 2; ey = arm.e ? sy + arm.e[1] * s : (sy + hyp) / 2; }
    if (arm.behind) arm.behind(ctx, hxp, hyp, s);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = shade(o.top, -.12); ctx.lineWidth = 30 * s; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hxp, hyp); ctx.stroke();
    ctx.strokeStyle = rgba('#ffffff', .12); ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(sx + L * 8 * s, sy); ctx.lineTo(ex + L * 8 * s, ey); ctx.lineTo(hxp + L * 6 * s, hyp - 4 * s); ctx.stroke();
    if (arm.hold) arm.hold(ctx, hxp, hyp, s);
    ctx.fillStyle = rad(ctx, hxp + L * 4 * s, hyp - 4 * s, 2 * s, 16 * s, [[0, shade(o.skin, .1)], [1, shade(o.skin, -.12)]]); ctx.beginPath(); ctx.arc(hxp, hyp, 15 * s, 0, TAU); ctx.fill();
    if (arm.front) arm.front(ctx, hxp, hyp, s);
  }
  ctx.restore();
  return { hx, hy, r, bodyTop, bodyBot };
}
const holdCup = col => (ctx, x, y, s) => { ctx.fillStyle = litFill(ctx, x - 14 * s, x + 14 * s, col, -1); rr(ctx, x - 14 * s, y - 36 * s, 28 * s, 34 * s, 5 * s); ctx.fill(); };
const holdPhone = (col, scr, glowA = 0) => (ctx, x, y, s) => {
  ctx.save(); ctx.translate(x, y - 22 * s); ctx.rotate(-.12); fillRR(ctx, -16 * s, -30 * s, 32 * s, 58 * s, 7 * s, col);
  if (scr) fillRR(ctx, -12 * s, -25 * s, 24 * s, 46 * s, 4 * s, scr); ctx.restore();
  if (glowA) glow(ctx, x, y - 30 * s, 120 * s, scr || '#ffffff', glowA);
};
const holdBrick = (ctx, x, y, s) => { ctx.fillStyle = litFill(ctx, x - 42 * s, x + 42 * s, '#D9784E', -1); rr(ctx, x - 42 * s, y - 32 * s, 84 * s, 36 * s, 4 * s); ctx.fill(); ctx.strokeStyle = 'rgba(90,30,10,.25)'; ctx.lineWidth = 2; ctx.strokeRect(x - 42 * s, y - 32 * s, 84 * s, 36 * s); };

/* ---------- typografia kinetyczna ----------
   tekst z *wyróżnieniem*; styl 'old' (chłodny, lekki, z cieniem) lub 'new' (ciepły, mocny, z markerem) */
let NOCAP = false;   // w kafelkach (06, 12) bez napisów
function caption(ctx, u, d, spec) {
  if (NOCAP) return;
  const { text, x, y, size = 64, align = 'left', style = 'old', t0 = .35, out = true, maxW = 1100, lh = 1.18, col } = spec;
  const words = []; let bold = false;
  text.split(' ').forEach(w => { const b0 = w.startsWith('*'), b1 = w.endsWith('*'); if (b0) bold = true; words.push({ w: w.replace(/\*/g, ''), b: bold }); if (b1) bold = false; });
  const wN = style === 'old' ? 500 : 700, wB = style === 'old' ? 700 : 800;
  // podział na linie
  const lines = [[]]; let cw = 0;
  for (const wd of words) { const ww = tw(ctx, wd.w + ' ', size, wd.b ? wB : wN); if (cw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); cw = 0; } lines[lines.length - 1].push(Object.assign(wd, { ww })); cw += ww; }
  const end = spec.t1 ?? d, outK = out ? E.inCubic(P(u, end - .45, end - .05)) : 0;
  // miękka poświata pod napisem (czytelność na jasnym tle)
  const sa = (spec.scrim ?? (style === 'old' ? .5 : style === 'new' ? .55 : 0)) * E.outCubic(P(u, t0 - .2, t0 + .5)) * (1 - outK);
  if (sa > 0) {
    const wMax = Math.max(...lines.map(l => l.reduce((a, b) => a + b.ww, 0))), hT = lines.length * size * lh;
    const bx = align === 'center' ? x - wMax / 2 : align === 'right' ? x - wMax : x;
    ctx.save(); ctx.globalAlpha *= sa; ctx.filter = `blur(${size * .9}px)`;
    fillRR(ctx, bx - size * .5, y - size * 1.05, wMax + size, hT + size * .6, size * .6, style === 'old' ? 'rgba(10,14,20,.7)' : 'rgba(255,248,240,.85)');
    ctx.restore();
  }
  let i = 0;
  lines.forEach((ln, li) => {
    const total = ln.reduce((a, b) => a + b.ww, 0);
    let px = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    const py = y + li * size * lh;
    for (const wd of ln) {
      const k = E.outCubic(P(u, t0 + i * .07, t0 + i * .07 + .55)); i++;
      if (k > 0 && outK < 1) {
        ctx.save(); ctx.globalAlpha *= k * (1 - outK);
        const blur = (1 - k) * 14 + outK * 10;
        if (blur > .5) ctx.filter = `blur(${blur.toFixed(1)}px)`;
        const yy = py + (1 - k) * size * .45 - outK * size * .2;
        if (style === 'old') {
          softShadow(ctx, 28, 4, .55, '8,12,18');
          txt(ctx, wd.w, px, yy, size, wd.b ? wB : wN, col || (wd.b ? '#FFFFFF' : '#DDE3EA'));
        } else if (style === 'new') {
          if (wd.b) { const mk = E.inOutCubic(P(u, t0 + i * .07 + .25, t0 + i * .07 + .7)); ctx.save(); ctx.globalAlpha *= .9; fillRR(ctx, px - 6, yy - size * .32, (wd.ww - size * .22) * mk + 12, size * .36, 6, rgba(N.teal, .55)); ctx.restore(); }
          softShadow(ctx, 30, 6, .16, '60,20,70');
          txt(ctx, wd.w, px, yy, size, wd.b ? wB : wN, col || (wd.b ? N.purple : N.ink));
        } else {   // 'light' – biały na fiolecie
          softShadow(ctx, 30, 6, .35, '20,0,30');
          txt(ctx, wd.w, px, yy, size, wd.b ? wB : wN, wd.b ? N.teal : '#fff');
        }
        ctx.restore();
      }
      px += wd.ww;
    }
  });
}

/* ---------- materiały budowlane ---------- */
function pallet(ctx, x, y, w, col) {
  ctx.fillStyle = shade(col, -.3); for (const k of [0, .45, .9]) ctx.fillRect(x + w * k, y - 14, w * .1, 14);
  ctx.fillStyle = lin(ctx, 0, y - 32, 0, y - 14, [[0, shade(col, .12)], [1, shade(col, -.1)]]); ctx.fillRect(x, y - 32, w, 18);
  ctx.strokeStyle = shade(col, -.25); ctx.lineWidth = 2; for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 6, y - 32); ctx.lineTo(x + w * k / 6, y - 14); ctx.stroke(); }
}
function bricksStack(ctx, x, y, w, rows, col = '#D9784E', L = -1) {
  const bw = w / 3, bh = 36;
  for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) {
    const bx = x + c * bw + 2, by = y - (r + 1) * bh + 2;
    ctx.fillStyle = litFill(ctx, bx, bx + bw - 4, r % 2 ? col : shade(col, -.06), L, .1, -.14); rr(ctx, bx, by, bw - 4, bh - 4, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(bx + 2, by + 2, bw - 8, 4);
  }
  ctx.fillStyle = 'rgba(255,255,255,.08)'; poly(ctx, [[x, y - rows * bh], [x + w, y - rows * bh], [x + w + 30, y - rows * bh - 16], [x + 30, y - rows * bh - 16]]); ctx.fill();
}
