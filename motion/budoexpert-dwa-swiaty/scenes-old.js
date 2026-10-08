/* =====================================================================
   STARY ŚWIAT (00–06): szaro, deszcz, każdy osobno
   ===================================================================== */
const CH = {
  inwestorka: { old: { hair: 'long', hairCol: '#6E6863', top: '#7D8985', legs: '#474D57', skin: O.skin, ink: O.ink },
                new: { hair: 'long', hairCol: '#8A4B2C', top: N.teal, legs: '#3B2440', skin: N.skin, ink: N.ink } },
  inwestor:   { old: { hair: 'short', hairCol: '#474C56', top: '#5C6471', legs: '#40464F', skin: O.skin, ink: O.ink },
                new: { hair: 'short', hairCol: '#6B3A22', top: N.purple, legs: '#3B2440', skin: N.skin, ink: N.ink } },
  wykonawca:  { old: { hair: 'cap', hairCol: '#55595F', hatCol: '#5C6066', top: '#86806F', legs: '#40464F', skin: O.skin, ink: O.ink },
                new: { hair: 'cap', hairCol: '#5B3420', hatCol: '#3B1442', top: '#E6A63C', legs: '#3B2440', skin: N.skin, ink: N.ink } },
  sprzedawca: { old: { hair: 'short', hairCol: '#55595F', top: '#A0A5A0', apron: '#6B766E', legs: '#40464F', skin: O.skin, ink: O.ink },
                new: { hair: 'short', hairCol: '#7A4426', top: '#F4EEE8', apron: N.purple2, legs: '#3B2440', skin: N.skin, ink: N.ink } },
  ekipa:      { old: { hair: 'hard', hairCol: '#55595F', hatCol: '#B6AF98', top: '#7A8390', legs: '#40464F', skin: O.skin, ink: O.ink },
                new: { hair: 'hard', hairCol: '#5B3420', hatCol: '#F4C431', top: '#9C7BB4', legs: '#3B2440', skin: N.skin, ink: N.ink } },
  dziecko:    { old: { hair: 'short', hairCol: '#5A5F66', top: '#8A939C', legs: '#40464F', skin: O.skin, ink: O.ink },
                new: { hair: 'short', hairCol: '#5B3420', top: '#F2896B', legs: '#3B2440', skin: N.skin, ink: N.ink } },
  partnerka:  { new: { hair: 'long', hairCol: '#8A4B2C', top: '#E9A0BC', legs: '#3B2440', skin: N.skin, ink: N.ink } },
};
const who = (k, world, extra = {}) => Object.assign({}, CH[k][world], extra);

/* ---------- scenografia ---------- */
/* niedokończony dom: mury bez dachu z bocznym licem (głębia), x,y = lewy dolny róg frontu */
function houseShell(ctx, x, y, s, pal = {}, L = -1) {
  const c = Object.assign({ wall: '#C2C8CF', line: '#A7AFB8', hole: '#5E6772', door: '#58616C', scaf: '#4F5763', edge: '#D4D9DE' }, pal);
  const ex = 80 * s, ey = -42 * s;
  const F = [[0, 0], [0, -170], [70, -170], [70, -205], [250, -205], [250, -245], [420, -245], [420, 0]].map(([a, b]) => [x + a * s, y + b * s]);
  // boczne lico
  poly(ctx, [[x + 420 * s, y], [x + 420 * s + ex, y + ey], [x + 420 * s + ex, y - 245 * s + ey], [x + 420 * s, y - 245 * s]], shade(c.wall, -.2));
  // tylna ściana widoczna nad niższą częścią
  poly(ctx, [[x + ex, y - 170 * s + ey], [x + 250 * s + ex, y - 245 * s + ey], [x + 250 * s, y - 245 * s], [x, y - 170 * s]], shade(c.wall, -.1));
  poly(ctx, F); ctx.fillStyle = lin(ctx, x, y - 245 * s, x + 420 * s, y, [[0, shade(c.wall, .08)], [1, shade(c.wall, -.06)]]); ctx.fill();
  ctx.save(); poly(ctx, F); ctx.clip();
  ctx.strokeStyle = c.line; ctx.lineWidth = 1.4 * s; ctx.beginPath();
  for (let r = 0, yy = y - 14 * s; yy > y - 250 * s; yy -= 14 * s, r++) { ctx.moveTo(x, yy); ctx.lineTo(x + 420 * s, yy); for (let xx = x + (r % 2) * 18 * s; xx < x + 420 * s; xx += 36 * s) { ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 14 * s); } }
  ctx.stroke();
  ctx.fillStyle = lin(ctx, 0, y - 60 * s, 0, y, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.18)']]); ctx.fillRect(x, y - 60 * s, 420 * s, 60 * s);
  ctx.restore();
  // korona murów
  ctx.strokeStyle = c.edge; ctx.lineWidth = 5 * s; ctx.beginPath(); F.slice(0, 7).forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.stroke();
  // otwory z głębią (ościeża)
  const hole = (hx, hy, hw, hh) => {
    fillRR(ctx, hx, hy, hw, hh, 2, c.hole);
    poly(ctx, [[hx, hy], [hx + hw, hy], [hx + hw - 10 * s, hy + 12 * s], [hx + 10 * s, hy + 12 * s]], shade(c.hole, -.25));
    poly(ctx, [[hx + hw, hy], [hx + hw, hy + hh], [hx + hw - 10 * s, hy + hh], [hx + hw - 10 * s, hy + 12 * s]], shade(c.wall, -.28));
  };
  hole(x + 45 * s, y - 135 * s, 70 * s, 55 * s); hole(x + 285 * s, y - 175 * s, 75 * s, 55 * s); hole(x + 165 * s, y - 120 * s, 60 * s, 120 * s);
  // rusztowanie: tylne i przednie słupy
  const sx = x + 450 * s;
  for (const [dx, dy, col, lw] of [[ex * .7, ey * .7, shade(c.scaf, .25), 3], [0, 0, c.scaf, 5]]) {
    ctx.strokeStyle = col; ctx.lineWidth = lw * s; ctx.beginPath();
    for (const k of [0, 45, 90]) { ctx.moveTo(sx + k * s + dx, y + dy); ctx.lineTo(sx + k * s + dx, y - 280 * s + dy); }
    for (const k of [70, 140, 210, 270]) { ctx.moveTo(sx - 6 * s + dx, y - k * s + dy); ctx.lineTo(sx + 96 * s + dx, y - k * s + dy); }
    ctx.moveTo(sx + dx, y - 70 * s + dy); ctx.lineTo(sx + 90 * s + dx, y - 140 * s + dy); ctx.moveTo(sx + dx, y - 140 * s + dy); ctx.lineTo(sx + 90 * s + dx, y - 210 * s + dy);
    ctx.stroke();
  }
  for (const k of [70, 140, 210]) poly(ctx, [[sx - 8 * s, y - k * s], [sx + 98 * s, y - k * s], [sx + 98 * s + ex * .7, y - k * s + ey * .7], [sx - 8 * s + ex * .7, y - k * s + ey * .7]], rgba(shade(c.scaf, .35), .7));
}
function umbrella(ctx, cx, rim, rx, ry, col, handleY, t = 0) {
  line(ctx, cx, rim - ry, cx, handleY, 7, '#2A2E35');
  ctx.strokeStyle = '#2A2E35'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx - 15, handleY, 15, 0, Math.PI); ctx.stroke();
  const n = 8, pts = [];
  for (let i = 0; i <= n; i++) pts.push([cx - rx + 2 * rx * i / n, rim]);
  ctx.beginPath(); ctx.moveTo(cx - rx, rim); ctx.ellipse(cx, rim, rx, ry, 0, Math.PI, TAU);
  for (let i = n; i > 0; i--) ctx.quadraticCurveTo((pts[i][0] + pts[i - 1][0]) / 2, rim - ry * .12, pts[i - 1][0], rim);
  ctx.fillStyle = lin(ctx, cx - rx, rim - ry, cx + rx, rim, [[0, shade(col, .18)], [.5, col], [1, shade(col, -.25)]]); ctx.fill();
  ctx.save(); ctx.clip();
  ctx.strokeStyle = rgba('#000000', .25); ctx.lineWidth = 3;
  for (let i = 1; i < n; i++) { ctx.beginPath(); ctx.moveTo(cx, rim - ry); ctx.quadraticCurveTo(cx + (pts[i][0] - cx) * .8, rim - ry * .55, pts[i][0], rim); ctx.stroke(); }
  ctx.globalCompositeOperation = 'screen'; ctx.strokeStyle = 'rgba(200,215,230,.22)'; ctx.lineWidth = ry * .12; ctx.beginPath(); ctx.ellipse(cx - rx * .1, rim, rx * .82, ry * .82, 0, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  ctx.restore();
  circ(ctx, cx, rim - ry - 8, 9, '#2A2E35');
  // krople na krawędzi
  for (let i = 0; i <= n; i++) { const ph = (t * .8 + i * .37) % 1; circ(ctx, pts[i][0], rim + 4 + ph * 6, 4 + ph * 2, rgba('#C9D6E2', .7)); }
}
function puddle(ctx, x, y, w, t, seed, sky = '#C3CBD4', base = '#8E98A3') {
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, w, w * .13, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y - w * .13, 0, y + w * .13, [[0, sky], [1, base]]); ctx.fillRect(x - w, y - w * .13, 2 * w, w * .26);
  const r = rng(seed);
  for (let i = 0; i < 7; i++) { const ph = (t * .9 + r()) % 1, px = x + (r() - .5) * w * 1.5, py = y + (r() - .5) * w * .14; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = '#E2E8EE'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(px, py, 6 + ph * 46, (6 + ph * 46) * .22, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
function fencePanel(ctx, x0, x1, y, h, col) {
  ctx.strokeStyle = rgba(col, .8); ctx.lineWidth = 3; ctx.beginPath();
  for (let x = x0; x <= x1; x += 26) { ctx.moveTo(x, y - h); ctx.lineTo(x + 26, y); ctx.moveTo(x + 26, y - h); ctx.lineTo(x, y); }
  ctx.stroke();
  for (const x of [x0, x1]) { ctx.fillStyle = litFill(ctx, x - 9, x + 9, shade(col, -.2), -1); ctx.fillRect(x - 9, y - h - 10, 18, h + 30); }
  line(ctx, x0, y - h, x1, y - h, 6, shade(col, -.1)); line(ctx, x0, y, x1, y, 6, shade(col, -.1));
}
function grass(ctx, x, y, n, h, col, seed, t = 0) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const bx = x + r() * 220, bh = h * (.5 + r() * .7), sw = Math.sin(t * 1.2 + i) * 10 + (r() - .5) * 60;
    ctx.fillStyle = shade(col, (r() - .5) * .3); ctx.beginPath(); ctx.moveTo(bx - 7, y); ctx.quadraticCurveTo(bx + sw * .4, y - bh * .6, bx + sw, y - bh); ctx.quadraticCurveTo(bx + sw * .4 + 4, y - bh * .5, bx + 7, y); ctx.fill(); }
}

/* ---------- 00: marzenie narysowane ołówkiem na biurku, potem zmyte deszczem ---------- */
const DREAM = (() => {
  const C = (cx, cy, R, n = 60) => Array.from({ length: n + 1 }, (_, i) => [cx + R * Math.cos(-Math.PI / 2 + i * TAU / n), cy + R * Math.sin(-Math.PI / 2 + i * TAU / n)]);
  const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  return [
    { k: 'ground', pts: [[330, 820], [1590, 820]], t: [0.15, 0.5] },
    { k: 'walls', pts: [[700, 820], [700, 520], [1200, 520], [1200, 820]], t: [0.55, 1.05], fill: '#FFFFFF' },
    { k: 'roof', pts: [[650, 520], [950, 320], [1250, 520], [650, 520]], t: [1.1, 1.5], fill: '#F2D6F2' },
    { k: 'win1', pts: R(770, 590, 120, 95), t: [1.55, 1.75], fill: '#CFF5EA' },
    { k: 'win2', pts: R(1010, 590, 120, 95), t: [1.8, 2.0], fill: '#CFF5EA' },
    { k: 'door', pts: R(905, 690, 90, 130), t: [2.05, 2.25], fill: N.teal },
    { k: 'trunk', pts: [[440, 820], [440, 640]], t: [2.3, 2.42] },
    { k: 'tree', pts: C(440, 560, 90), t: [2.45, 2.8], fill: '#BDEFE0' },
    { k: 'swing', pts: [[1340, 820], [1365, 580], [1505, 580], [1530, 820]], t: [2.85, 3.1] },
    { k: 'rope', pts: [[1410, 580], [1410, 705], [1465, 705], [1465, 580]], t: [3.12, 3.3] },
    { k: 'sun', pts: C(1600, 300, 60), t: [3.3, 3.5], fill: N.sun, noStroke: true },
  ];
})();
function partialPath(ctx, pts, p) {
  let total = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let rem = total * p; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let tip = pts[0];
  for (let i = 1; i < pts.length && rem > 0; i++) { const k = Math.min(1, rem / seg[i - 1]); tip = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; ctx.lineTo(tip[0], tip[1]); rem -= seg[i - 1]; }
  return tip;
}
function pencilTip(u) {   // gdzie jest ołówek w chwili u (płynnie także między kreskami)
  const els = DREAM.filter(e => !e.noStroke);
  for (let i = 0; i < els.length; i++) {
    const e = els[i];
    if (u >= e.t[0] && u <= e.t[1]) { const c = document.createElement('canvas').getContext('2d'); return partialPath(c, e.pts, E.inOutSine(P(u, e.t[0], e.t[1]))); }
    const nx = els[i + 1];
    if (nx && u > e.t[1] && u < nx.t[0]) { const a = e.pts[e.pts.length - 1], b = nx.pts[0], k = E.inOutSine(P(u, e.t[1], nx.t[0])); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(Math.PI * k) * 40]; }
  }
  if (u < els[0].t[0]) return [els[0].pts[0][0] - 200 * (1 - u / els[0].t[0]), els[0].pts[0][1] - 120 * (1 - u / els[0].t[0])];
  const l = els[els.length - 1].pts.slice(-1)[0], k = E.inOutCubic(P(u, els[els.length - 1].t[1], els[els.length - 1].t[1] + 1));
  return [l[0] + 260 * k, l[1] + 160 * k];
}
const PAPER = { x: 210, y: 70, w: 1500, h: 940, rot: -.022 };
function paperSheet(ctx, wash) {
  ctx.save(); ctx.translate(960, 540); ctx.rotate(PAPER.rot); ctx.translate(-960, -540);
  softShadow(ctx, 60, 30, .45, '20,10,5');
  fillRR(ctx, PAPER.x, PAPER.y, PAPER.w, PAPER.h, 4, mix('#FFF9F1', '#DFE3E8', wash)); noShadow(ctx);
  ctx.save(); rr(ctx, PAPER.x, PAPER.y, PAPER.w, PAPER.h, 4); ctx.clip();
  const g1 = mix('#F1DFD0', '#CDD3DA', wash), g2 = mix('#E9CDB8', '#BCC4CD', wash);
  for (const [col, every, lw] of [[g1, 1, 1], [g2, 5, 1.6]]) {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0, x = PAPER.x; x <= PAPER.x + PAPER.w; x += 30, i++) if (i % every === 0) { ctx.moveTo(x, PAPER.y); ctx.lineTo(x, PAPER.y + PAPER.h); }
    for (let i = 0, y = PAPER.y; y <= PAPER.y + PAPER.h; y += 30, i++) if (i % every === 0) { ctx.moveTo(PAPER.x, y); ctx.lineTo(PAPER.x + PAPER.w, y); }
    ctx.stroke();
  }
  // ramka rysunku technicznego
  ctx.strokeStyle = mix('#C9A4C9', '#9AA3AD', wash); ctx.lineWidth = 3; ctx.strokeRect(PAPER.x + 40, PAPER.y + 40, PAPER.w - 80, PAPER.h - 80);
  ctx.strokeRect(PAPER.x + PAPER.w - 420, PAPER.y + 40, 380, 90);
  txt(ctx, 'NASZ DOM · ARK. 01', PAPER.x + PAPER.w - 400, PAPER.y + 96, 26, 600, mix('#9C6FA3', '#8E98A3', wash), 'left', 3);
  // światło lampy na papierze
  ctx.fillStyle = rad(ctx, 420, 120, 0, 1300, [[0, rgba(mix('#FFE9C7', '#DCE5EE', wash), .55)], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  return () => ctx.restore();
}
function dreamDrawing(ctx, u, wash) {
  const ink = mix(N.purple, O.line, wash);
  for (const el of DREAM) {
    const p = E.inOutSine(P(u, el.t[0], el.t[1])); if (p <= 0) continue;
    const fade = el.k === 'sun' ? 1 - P(wash, .1, .5) : (['tree', 'trunk', 'swing', 'rope'].includes(el.k) ? 1 - P(wash, .35, .85) : el.k === 'roof' ? 1 - P(wash, .55, .95) : 1);
    if (fade <= 0) continue;
    ctx.save(); ctx.globalAlpha = fade;
    if (el.fill) {
      const fa = P(u, el.t[1] - .05, el.t[1] + .3);
      let col = el.fill;
      if (el.k === 'walls') col = mix('#FFFFFF', O.wall, P(wash, .45, 1)); else if (el.k.startsWith('win')) col = mix(el.fill, '#7F8994', P(wash, .5, 1));
      else if (el.k === 'door') col = mix(el.fill, O.shadow, P(wash, .4, 1)); else col = mix(el.fill, '#B9BFC6', wash);
      if (fa > 0) { ctx.globalAlpha = fade * fa * .9; poly(ctx, el.pts, col); }
      ctx.globalAlpha = fade;
    }
    if (!el.noStroke) { ctx.strokeStyle = ink; ctx.lineWidth = 5.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; partialPath(ctx, el.pts, p); ctx.stroke(); }
    ctx.restore();
  }
}
function pencil(ctx, tip, lift) {   // ołówek z cieniem; lift unosi go nad papier
  const ang = -2.3, len = 560, w = 36;
  const draw = (g, col) => {
    g.save(); g.translate(tip[0], tip[1]); g.rotate(ang);
    if (col) { g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.lineTo(70, -w / 2); g.lineTo(len, -w / 2); g.lineTo(len + 40, 0); g.lineTo(len, w / 2); g.lineTo(70, w / 2); g.closePath(); g.fill(); g.restore(); return; }
    g.fillStyle = lin(g, 0, -w / 2, 0, w / 2, [[0, '#F0D3B0'], [1, '#C79A6E']]); poly(g, [[0, 0], [70, -w / 2], [70, w / 2]]); g.fill();
    poly(g, [[0, 0], [20, -5], [20, 5]], '#3B2B3F');
    const f = [[-w / 2, -w / 6, '#8E3A9A'], [-w / 6, w / 6, N.purple], [w / 6, w / 2, N.purple2]];
    for (const [a, b, c] of f) { g.fillStyle = c; g.fillRect(70, a, len - 70, b - a); }
    g.fillStyle = lin(g, 0, -w / 2, 0, w / 2, [[0, '#E6E8EC'], [.5, '#A9AEB6'], [1, '#6E747C']]); g.fillRect(len - 40, -w / 2, 46, w);
    fillRR(g, len + 4, -w / 2, 40, w, [0, 10, 10, 0], N.teal);
    g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(70, -w / 2 + 3, len - 70, 5);
    g.restore();
  };
  ctx.save(); ctx.filter = `blur(${8 + lift * 14}px)`; ctx.globalAlpha = .35 - lift * .12; ctx.translate(26 + lift * 60, 34 + lift * 70); draw(ctx, '#2A1A10'); ctx.restore();
  ctx.save(); ctx.translate(-lift * 20, -lift * 30); draw(ctx); ctx.restore();
}
function desk(ctx, cold = 0) {
  ctx.fillStyle = lin(ctx, 0, 0, W, H, [[0, mix('#7A563C', '#4E555E', cold)], [1, mix('#4A3122', '#2E343C', cold)]]); ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.strokeStyle = rgba('#000000', .12); ctx.lineWidth = 3;
  for (let y = -150; y < H + 200; y += 46) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.bezierCurveTo(500, y + 30, 1300, y - 30, W + 200, y + 12); ctx.stroke(); }
}
SH['00A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: -30, y: 10, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.06 }), u, .6, 2);
  cam.focus = 1; cam.dof = 30;
  layer(ctx, cam, 1.25, g => desk(g));
  layer(ctx, cam, 1, g => {
    const end = paperSheet(g, 0);
    dreamDrawing(g, u, 0);
    end();
    const tip = pencilTip(u);
    const lift = u < DREAM[0].t[0] ? 1 - u / DREAM[0].t[0] : P(u, 3.3, 3.9);
    g.save(); g.translate(960, 540); g.rotate(PAPER.rot); g.translate(-960, -540); pencil(g, tip, lift); g.restore();
  });
  // pierwszy plan: kubek z kawą i gumka (rozmyte)
  layer(ctx, cam, .55, g => {
    ell(g, 330, 1020, 46, 70, '#E8E2DA', .3); circ(g, 150, 1010, 190, '#F1ECE6'); circ(g, 150, 1010, 162, '#DCD4CB'); circ(g, 150, 1010, 150, '#4A2A18');
    ell(g, 110, 960, 60, 26, 'rgba(255,240,220,.35)', -.4);
    fillRR(g, 1700, 900, 160, 80, 14, '#E58FA8');
  });
  glow(ctx, 380, 80, 900, '#FFD9A0', .22);
  caption(ctx, u, d, { text: 'Budowa domu miała być *spełnieniem marzeń.*', x: 260, y: 990, size: 56, style: 'new', t0: .7, out: false, maxW: 1400 });
};
SH['00B'] = (ctx, u, d) => {
  const wash = E.inOutSine(P(u, .3, d - .1));
  const cam = handheld(drift(u, d, { x: 20, y: 0, zoom: 1.06 }, { x: 40, y: -20, zoom: 1.16 }), u + 4, .6, 2);
  cam.focus = 1; cam.dof = 30;
  layer(ctx, cam, 1.25, g => desk(g, wash));
  layer(ctx, cam, 1, g => {
    const end = paperSheet(g, wash);
    g.save(); g.translate(960, 540); g.rotate(PAPER.rot); g.translate(-960, -540);
    dreamDrawing(g, 99, wash);
    // farba spływa smugami
    const r = rng(11);
    const src = [[830, 640, '#9FE6D2'], [1070, 640, '#9FE6D2'], [950, 760, N.teal], [950, 470, '#E0B2E0'], [820, 500, '#E0B2E0'], [440, 560, '#9FE6D2'], [1600, 300, '#F8C67A'], [400, 600, '#9FE6D2'], [1080, 500, '#E0B2E0']];
    g.save(); g.filter = 'blur(3px)';
    for (let i = 0; i < 30; i++) { const s_ = src[i % src.length], t0 = .2 + r() * 1.8, x = s_[0] + (r() - .5) * 110, y = s_[1] + (r() - .5) * 50, k = E.outCubic(P(u, t0, t0 + 1.5)); if (k <= 0) continue;
      g.globalAlpha = .5 * (1 - .5 * P(u, 2.4, 3.4)); fillRR(g, x - 4, y, 9 + r() * 6, 30 + k * (120 + r() * 200), 6, s_[2]); }
    g.restore();
    // mokre plamy po kroplach
    for (let i = 0; i < 90; i++) {
      const t0 = Math.pow(r(), .6) * 3, x = 200 + r() * 1520, y = 60 + r() * 960, k = E.outCubic(P(u, t0, t0 + .35)), R = 10 + r() * 22;
      if (k <= 0) continue;
      g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .45; g.fillStyle = rad(g, x, y, 0, R * k * 1.3, [[0, '#B8C0C9'], [.8, '#C9D0D7'], [1, 'rgba(255,255,255,0)']]); g.beginPath(); g.arc(x, y, R * k * 1.3, 0, TAU); g.fill(); g.restore();
      g.save(); g.globalAlpha = .6 * (1 - P(u, t0 + .2, t0 + 1.2)); g.globalCompositeOperation = 'screen'; ring(g, x - R * .2, y - R * .3, R * .5 * k, 2, '#ffffff'); g.restore();
    }
    g.restore();
    end();
    const tip = pencilTip(3.9 + u);
    g.save(); g.translate(960, 540); g.rotate(PAPER.rot); g.translate(-960, -540); pencil(g, tip, 1); g.restore();
  });
  layer(ctx, cam, .6, g => { rain(g, u, { n: 70, a: .35, len: 90, lw: 5, speed: 2200, seed: 4, col: '#C9D3DD' }); }, { alpha: E.inQuad(P(u, .3, 2)) });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#8494A8', .35 * wash); ctx.fillRect(0, 0, W, H); ctx.restore();
  lensDrops(ctx, u, 14, 3, P(u, 1.5, 3));
  caption(ctx, u + 10, d + 10, { text: 'Budowa domu miała być *spełnieniem marzeń.*', x: 260, y: 990, size: 56, style: 'new', t0: 0, out: true, maxW: 1400, col: mix(N.ink, '#E4E8EC', wash), t1: d + 9.6 });
};

/* ---------- 01: inwestor — oszczędności całego życia, a na budowie nikogo ---------- */
function rainyWorld(g, u) {
  g.fillStyle = lin(g, 0, -200, 0, 640, [[0, '#7F8A97'], [1, '#C1C8D0']]); g.fillRect(-300, -300, W + 600, 960);
  clouds(g, u, -60, 9, 5, '#6C7785', .5, 1.2, 10);
  clouds(g, u, 80, 7, 8, '#98A2AE', .45, 1, 16);
}
function farTown(g) {
  const r = rng(3);
  for (let i = 0; i < 18; i++) { const x = -200 + i * 140 + r() * 60, w = 90 + r() * 80, h = 50 + r() * 70; poly(g, [[x, 640], [x, 640 - h], [x + w / 2, 640 - h - 40], [x + w, 640 - h], [x + w, 640]], '#A3ADB8'); }
  for (let i = 0; i < 14; i++) { const x = -200 + r() * 2300; ell(g, x, 610, 50 + r() * 50, 60 + r() * 40, '#9AA5B0'); }
  // dźwig wieżowy w oddali
  g.strokeStyle = '#9AA4AF'; g.lineWidth = 6; g.beginPath(); g.moveTo(1650, 640); g.lineTo(1650, 300); g.lineTo(1300, 300); g.moveTo(1650, 300); g.lineTo(1760, 300); g.stroke();
  g.lineWidth = 2; g.beginPath(); for (let y = 320; y < 640; y += 30) { g.moveTo(1640, y); g.lineTo(1660, y + 30); } g.stroke();
  fog(g, 480, 660, '#C6CDD5', 0, .8);
}
function groundOld(g, y = 700) {
  g.fillStyle = lin(g, 0, y, 0, H + 200, [[0, '#A5ADB6'], [1, '#7C8590']]); g.fillRect(-300, y, W + 600, H + 400);
  const r = rng(21); g.fillStyle = 'rgba(70,78,88,.15)'; for (let i = 0; i < 60; i++) ell(g, r() * W * 1.3 - 200, y + 20 + r() * 420, 30 + r() * 90, 4 + r() * 8, 'rgba(70,78,88,.14)');
}
SH['01A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: -60, y: 0, zoom: 1.0 }, { x: 50, y: -10, zoom: 1.08 }), u, .8, 5);
  cam.focus = 1; cam.dof = 16;
  layer(ctx, cam, 8, g => rainyWorld(g, u));
  layer(ctx, cam, 3.5, g => { farTown(g); rain(g, u, { n: 160, a: .25, len: 26, lw: 1.2, speed: 1100, seed: 2 }); });
  layer(ctx, cam, 1.7, g => {
    groundOld(g, 700);
    houseShell(g, 960, 720, 1.3, {}, -1);
    contact(g, 1240, 730, 420, 22, .25);
    fencePanel(g, 80, 700, 720, 150, '#8A939D');
    // paleta z workami pod plandeką
    fillRR(g, 760, 690, 150, 34, 4, '#7E7466'); poly(g, [[750, 692], [790, 650], [890, 645], [920, 692]], '#5E6C7A');
    rain(g, u + 2, { n: 140, a: .3, len: 36, lw: 1.6, speed: 1400, seed: 12 });
  });
  layer(ctx, cam, 1, g => {
    puddle(g, 640, 935, 260, u, 1); puddle(g, 1380, 980, 220, u + .4, 2);
    // odbicie pary w kałuży
    g.save(); g.beginPath(); g.ellipse(640, 935, 260, 34, 0, 0, TAU); g.clip(); g.globalAlpha = .22; g.translate(0, 1870); g.scale(1, -1);
    figure(g, Object.assign(who('inwestorka', 'old'), { x: 590, y: 935, s: 1.25, back: true, shadow: false }));
    figure(g, Object.assign(who('inwestor', 'old'), { x: 715, y: 935, s: 1.25, back: true, shadow: false }));
    g.restore();
    const s = 1.25, G = 935;
    figure(g, Object.assign(who('inwestorka', 'old'), { x: 590, y: G, s, back: true, rim: '#E3EAF2', rimSide: 1, light: -1 }));
    figure(g, Object.assign(who('inwestor', 'old'), { x: 715, y: G, s, back: true, rim: '#E3EAF2', rimSide: 1, armL: { e: [-10, 55], h: [40, 10] } }));
    umbrella(g, 650, 482, 215, 118, '#363B43', 640, u);
    splashes(g, u, 0, 760, W, 320, 70, 4);
  });
  layer(ctx, cam, .7, g => rain(g, u, { n: 120, a: .45, len: 70, lw: 3, speed: 2000, seed: 9, col: '#C3CDD8' }));
  layer(ctx, cam, .45, g => { fencePanel(g, -120, 160, 1150, 760, '#5A626C'); grass(g, 1650, 1100, 26, 260, '#5D6A62', 3, u); });
  lensDrops(ctx, u, 12, 8);
  caption(ctx, u, d, { text: 'Oszczędności *całego życia.* Kredyt na *30 lat.*', x: 1080, y: 230, size: 60, style: 'old', t0: .5, maxW: 760 });
};
SH['01B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 30, y: -10, zoom: 1.05 }), u, .7, 6);
  cam.focus = 1; cam.dof = 18;
  const lean = E.inOutCubic(P(u, .4, 2.3)), sigh = Math.sin(Math.PI * P(u, 2.4, 3.9));
  layer(ctx, cam, 5, g => { rainyWorld(g, u); groundOld(g, 760); houseShell(g, 1100, 1000, 2.1, {}, -1); rain(g, u, { n: 140, a: .3, len: 30, lw: 1.6, speed: 1200, seed: 15 }); });
  layer(ctx, cam, 1, g => {
    const s = 2.25, G = 1340;
    line(g, 935, 140, 935, 1080, 10, '#2A2E35');
    figure(g, Object.assign(who('inwestorka', 'old'), { x: 790, y: G, s, rim: '#E3EAF2', rimSide: -1, light: 1, face: { eyes: 'closed', mouth: 'flat', mw: .2 }, tilt: lean * .24, hdx: lean * 26, hdy: lean * 10 }));
    figure(g, Object.assign(who('inwestor', 'old'), { x: 1085, y: G, s, rim: '#E3EAF2', rimSide: 1, light: -1, dy: -9 * sigh, face: { eyes: 'open', mouth: 'sad', brows: 'sad', bags: true, ly: sigh * .03 } }));
    // cień parasola na głowach
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = lin(g, 0, 300, 0, 700, [[0, 'rgba(40,50,60,.5)'], [1, 'rgba(40,50,60,0)']]); g.fillRect(300, 300, 1300, 400); g.restore();
    umbrella(g, 935, 330, 600, 240, '#363B43', 1200, u);
    const r = rng(4);
    for (let i = 0; i < 14; i++) { const x = 935 + (r() * 2 - 1) * 570, ph = (u * (.6 + r() * .5) + r()) % 1, y = 340 + E.inQuad(ph) * 800; g.globalAlpha = .75 * (1 - ph * .5); fillRR(g, x - 3, y, 7, 16 + 30 * ph, 4, '#B9C8D8'); }
    g.globalAlpha = 1;
  });
  layer(ctx, cam, .55, g => rain(g, u, { n: 70, a: .5, len: 110, lw: 5, speed: 2300, seed: 31, col: '#CCD6E0' }));
  lensDrops(ctx, u, 10, 13);
  caption(ctx, u, d, { text: 'A Ty stoisz przed własnym domem… *i nie wiesz, co się na nim dzieje.*', x: 1360, y: 560, size: 50, style: 'old', t0: .4, maxW: 500 });
};

/* ---------- wspólne: noc we wnętrzu ---------- */
function pendant(g, x, top, len, shadeCol, lightCol, a, t, reach = 880, spread = 470) {
  const flick = 1 - .05 * Math.max(0, Math.sin(t * 37) * Math.sin(t * 13.3));
  cone(g, x, top + len + 46, 80, spread, reach - top - len - 46, lightCol, a * flick);
  dust(g, t, x - spread * .6, top + len + 60, spread * 1.2, reach - top - len - 100, 40, 17, lightCol, .35, 2.2);
  line(g, x, top - 40, x, top + len, 4, '#15191F');
  g.fillStyle = lin(g, x - 100, 0, x + 100, 0, [[0, shade(shadeCol, .25)], [.5, shadeCol], [1, shade(shadeCol, -.35)]]);
  g.beginPath(); g.moveTo(x - 30, top + len); g.lineTo(x + 30, top + len); g.quadraticCurveTo(x + 100, top + len + 8, x + 105, top + len + 52); g.lineTo(x - 105, top + len + 52); g.quadraticCurveTo(x - 100, top + len + 8, x - 30, top + len); g.fill();
  ell(g, x, top + len + 52, 98, 13, rgba(lightCol, .95 * flick));
  glow(g, x, top + len + 60, 260, lightCol, .5 * flick);
}
function tableTop(g, x0, x1, y, depth, inset, col, legH = 400) {
  g.fillStyle = shade(col, -.3); g.fillRect(x0 + 40, y + 24, 26, legH); g.fillRect(x1 - 66, y + 24, 26, legH);
  poly(g, [[x0, y], [x1, y], [x1 - inset, y - depth], [x0 + inset, y - depth]]); g.fillStyle = lin(g, 0, y - depth, 0, y, [[0, shade(col, -.12)], [1, shade(col, .1)]]); g.fill();
  g.fillStyle = lin(g, 0, y, 0, y + 26, [[0, shade(col, -.15)], [1, shade(col, -.35)]]); g.fillRect(x0, y, x1 - x0, 26);
}
function cabinets(g, x0, x1, y, h, col) {
  for (let x = x0; x < x1 - 10; x += 170) { fillRR(g, x + 4, y, 162, h, 6, col); fillRR(g, x + 140, y + h * .45, 8, 50, 4, shade(col, .25)); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(x + 8, y + 4, 4, h - 8); }
}
function nightWindow(g, u, x, y, w, h, frame = '#3A434F') {
  fillRR(g, x - 16, y - 16, w + 32, h + 32, 6, frame);
  g.save(); rr(g, x, y, w, h, 2); g.clip();
  g.fillStyle = lin(g, 0, y, 0, y + h, [[0, '#0F151E'], [1, '#1E2733']]); g.fillRect(x, y, w, h);
  bokeh(g, u, 10, 5, ['#8EA2B8', '#B6A57E'], x, y + h * .5, w, h * .4, 4, 12, .35);
  rain(g, u, { n: 50, col: '#5D6E82', a: .8, len: 30, lw: 1.6, speed: 900, seed: 3, x0: x - 100, w: w + 200, h: y + h });
  // krople na szybie
  const r = rng(8); for (let i = 0; i < 26; i++) { const dx = x + r() * w, dy = y + ((r() * h + u * 30 * r()) % h); circ(g, dx, dy, 2 + r() * 4, 'rgba(160,180,200,.35)'); }
  g.restore();
  line(g, x + w / 2, y, x + w / 2, y + h, 12, frame); line(g, x, y + h * .45, x + w, y + h * .45, 10, frame);
}

/* ---------- 02: trzy wyceny ---------- */
SH['02A'] = (ctx, u, d) => {
  const push = E.inCubic(P(u, d - .9, d));
  const cam = handheld(drift(u, d, { x: -30, y: 0, zoom: 1.0 }, { x: 10, y: 20, zoom: 1.06 }), u, .5, 8);
  cam.zoom += push * .3; cam.y += push * 120; cam.focus = 1; cam.dof = 16;
  layer(ctx, cam, 2.2, g => {
    g.fillStyle = lin(g, 0, 0, 0, H, [[0, '#1B2028'], [1, '#262D37']]); g.fillRect(-300, -300, W + 600, H + 600);
    g.fillStyle = rad(g, 960, 300, 0, 900, [[0, rgba(O.lamp, .16)], [1, 'rgba(0,0,0,0)']]); g.fillRect(-300, -300, W + 600, H + 600);
    cabinets(g, -100, 640, 120, 230, '#2B323C'); cabinets(g, -100, 640, 560, 330, '#262C35');
    fillRR(g, 300, 600, 180, 46, 6, '#1A1F26'); txt(g, '23:40', 390, 636, 32, 600, '#8FCFC4', 'center', 2); glow(g, 390, 624, 90, '#8FCFC4', .25);
    nightWindow(g, u, 1250, 170, 300, 250);
    g.save(); g.globalCompositeOperation = 'screen'; poly(g, [[1250, 420], [1550, 420], [1180, 1080], [700, 1080]]); g.fillStyle = lin(g, 0, 420, 0, 1080, [[0, 'rgba(110,140,180,.16)'], [1, 'rgba(110,140,180,0)']]); g.fill(); g.restore();
    g.fillStyle = '#1C2129'; g.fillRect(-300, 900, W + 600, 400);
  });
  layer(ctx, cam, 1, g => {
    const s = 1.4, G = 965;
    contact(g, 960, 905, 600, 40, .5);
    figure(g, Object.assign(who('inwestorka', 'old'), { x: 760, y: G, s, seated: true, light: 1, rim: O.lamp, rimSide: 1, face: { eyes: 'open', mouth: 'sad', brows: 'sad', ly: .05, lx: .1 } }));
    figure(g, Object.assign(who('inwestor', 'old'), { x: 1160, y: G, s, seated: true, light: -1, rim: O.lamp, rimSide: -1, face: { eyes: 'half', mouth: 'flat', bags: true, lx: -.1 } }));
    tableTop(g, 420, 1500, 800, 70, 60, '#4E5560');
    for (const [x, a] of [[850, -.12], [960, .03], [1075, .1]]) { g.save(); g.translate(x, 770); g.rotate(a); softShadow(g, 12, 6, .5, '0,0,0'); fillRR(g, -52, -20, 104, 42, 2, '#D9DDE2'); noShadow(g); for (let l = 0; l < 3; l++) line(g, -40, -10 + l * 9, 30, -10 + l * 9, 2, '#A0A8B1'); g.restore(); }
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rad(g, 960, 770, 0, 420, [[0, rgba(O.lamp, .22)], [1, 'rgba(0,0,0,0)']]); g.fillRect(500, 600, 920, 300); g.restore();
    pendant(g, 960, -40, 250, '#3C434E', O.lamp, .2, u, 900);
  });
  layer(ctx, cam, .55, g => {
    fillRR(g, -60, 640, 330, 60, 18, '#14181E'); fillRR(g, 30, 690, 40, 500, 10, '#14181E'); fillRR(g, 200, 690, 40, 500, 10, '#14181E');
    g.fillStyle = 'rgba(150,170,190,.25)'; rr(g, 1660, 820, 120, 200, 16); g.fill(); ell(g, 1720, 830, 60, 14, 'rgba(200,215,230,.35)');
  });
  caption(ctx, u, d, { text: '*Trzy wyceny.*', x: 150, y: 230, size: 78, style: 'old', t0: .4 });
};
SH['02B'] = (ctx, u, d) => {
  let shake = 0; for (let i = 0; i < 3; i++) { const k = u - cue('02B', i); if (k > 0) shake += Math.exp(-k * 14) * Math.sin(k * 70) * 6; }
  const cam = drift(u, d, { x: 0, y: 0, zoom: 1.08, rot: -.01 }, { x: 10, y: 0, zoom: 1.0, rot: .01 }, E.outCubic);
  cam.y += shake; cam.focus = 1; cam.dof = 0;
  const scene = g => {
    g.fillStyle = '#4F483E'; g.fillRect(-300, -300, W + 600, H + 600);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 3; for (let y = -100; y < H + 100; y += 70) { g.beginPath(); g.moveTo(-300, y); g.bezierCurveTo(500, y + 25, 1300, y - 25, W + 300, y + 10); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,.04)'; for (let y = -70; y < H + 100; y += 70) { g.beginPath(); g.moveTo(-300, y); g.bezierCurveTo(600, y + 20, 1200, y - 20, W + 300, y + 6); g.stroke(); }
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rad(g, 960, 520, 0, 900, [[0, rgba(O.lamp, .42)], [.5, rgba(O.lamp, .12)], [1, 'rgba(0,0,0,0)']]); g.fillRect(-300, -300, W + 600, H + 600); g.restore();
    ring(g, 1560, 250, 70, 6, 'rgba(60,40,25,.35)'); ring(g, 1590, 280, 66, 4, 'rgba(60,40,25,.2)');
    g.save(); g.translate(300, 860); g.rotate(-.5); fillRR(g, -150, -9, 300, 18, 9, '#2E3138'); fillRR(g, 150, -9, 30, 18, [0, 9, 9, 0], '#B9BEC6'); g.restore();
    const cards = [[560, 540, -.08, '390 000 zł'], [960, 520, .02, '540 000 zł'], [1360, 550, .09, '710 000 zł']];
    cards.forEach(([x, y, a, amt], i) => {
      const t0 = cue('02B', i), k = P(u, t0 - .05, t0 + .3), hop = k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0;
      g.save(); g.translate(x, y - 22 * hop); g.rotate(a + .03 * hop);
      softShadow(g, 30 + hop * 30, 14 + hop * 26, .55, '10,6,2'); fillRR(g, -160, -210, 320, 420, 6, '#EDEFF1'); noShadow(g);
      g.fillStyle = lin(g, -160, -210, 160, 210, [[0, 'rgba(255,255,255,.25)'], [1, 'rgba(0,0,0,.08)']]); rr(g, -160, -210, 320, 420, 6); g.fill();
      txt(g, 'WYCENA', -118, -146, 30, 700, '#2E333B', 'left', 2);
      for (let l = 0; l < 6; l++) line(g, -118, -104 + l * 28, 118 - (l % 3) * 34, -104 + l * 28, 3, '#A4ACB5');
      line(g, -118, 92, 118, 92, 2, '#7E8792');
      txt(g, 'RAZEM:', -118, 128, 20, 600, '#6E7884');
      if (u >= t0) { const sc = lerp(1.6, 1, E.outCubic(P(u, t0, t0 + .18))); g.save(); popScale(g, sc, -118, 172); g.globalAlpha = P(u, t0, t0 + .08); txt(g, amt, -118, 178, 46, 800, '#1F242B'); g.restore(); }
      g.restore();
    });
  };
  // głębia ostrości: ostry środek, rozmyte brzegi stołu
  layer(ctx, cam, 1, scene, { blur: 9 });
  const b = getBuf(1); b.g.save(); camT(b.g, cam, 1); scene(b.g); b.g.restore();
  b.g.setTransform(1, 0, 0, 1, 0, 0); b.g.globalCompositeOperation = 'destination-in';
  b.g.save(); b.g.translate(960, 540); b.g.scale(1, .62); b.g.fillStyle = rad(b.g, 0, 0, 500, 1000, [[0, '#000'], [1, 'rgba(0,0,0,0)']]); b.g.fillRect(-1100, -1100, 2200, 2200); b.g.restore();
  ctx.drawImage(b.c, 0, 0); relBuf();
  layer(ctx, cam, .5, g => { circ(g, 110, 90, 200, '#2B2622'); circ(g, 110, 90, 170, '#1A1512'); }, { blur: 20 });
  caption(ctx, u, d, { text: 'Trzy różne ceny. *Żadnej pewności.*', x: 960, y: 1000, size: 60, style: 'old', align: 'center', t0: 2.0, maxW: 1600 });
};

/* ---------- 03: wykonawca — wyceny po nocach ---------- */
SH['03A'] = (ctx, u, d) => {
  const push = E.inCubic(P(u, d - 1, d));
  const cam = handheld(drift(u, d, { x: -40, y: 0, zoom: 1.0 }, { x: 120, y: 0, zoom: 1.04 }), u, .5, 11);
  cam.x += push * 380; cam.zoom += push * .25; cam.focus = 1; cam.dof = 16;
  const rub = P(u, 1.5, 1.8) - P(u, 2.4, 2.7), write = P(u, 2.6, 2.7) - P(u, 3.9, 4.0), wx = Math.sin(u * 14) * 18 * write;
  layer(ctx, cam, 2.0, g => {
    g.fillStyle = lin(g, 0, 0, 0, H, [[0, '#1A1F27'], [1, '#232A33']]); g.fillRect(-400, -300, W + 900, H + 600);
    g.fillStyle = rad(g, 780, 300, 0, 900, [[0, rgba(O.lamp, .15)], [1, 'rgba(0,0,0,0)']]); g.fillRect(-400, -300, W + 900, H + 600);
    clock(g, 420, 300, 82, 1, 12, Math.floor(u) + 14, { face: '#B9C0C8', rim: '#4B535E', hand: '#20252C' });
    // korytarz z uchylonymi drzwiami do pokoju dziecka
    g.fillStyle = '#12161B'; g.fillRect(1450, 120, 520, 880);
    poly(g, [[1560, 160], [1600, 160], [1600, 1000], [1560, 1000]], rgba(O.lamp, .55)); glow(g, 1580, 580, 260, O.lamp, .25);
    poly(g, [[1600, 160], [1860, 110], [1860, 1050], [1600, 1000]], '#262C35');
    g.fillStyle = '#1C2129'; g.fillRect(-400, 900, W + 900, 400);
  });
  layer(ctx, cam, 1, g => {
    contact(g, 820, 915, 560, 40, .5);
    figure(g, Object.assign(who('wykonawca', 'old'), {
      x: 820, y: 975, s: 1.45, seated: true, light: -1, rim: O.lamp, rimSide: -1,
      face: { eyes: rub > .5 ? 'closed' : 'half', mouth: 'flat', brows: 'sad', bags: true, ly: .06 * write }, hdy: 6 * write,
      armL: { e: [lerp(30, 40, rub), lerp(70, 30, rub)], h: [lerp(10, -40, rub), lerp(118, -66, rub)] },
      armR: { e: [32, 70], h: [lerp(5, -10, write) + wx / 1.45, lerp(118, 112, write)] },
    }));
    tableTop(g, 320, 1360, 810, 70, 60, '#4E5560');
    g.save(); g.translate(500, 785); g.rotate(-.12); softShadow(g, 12, 8, .5, '0,0,0'); fillRR(g, -105, -15, 210, 30, 15, '#C3C9D0'); noShadow(g); circ(g, 105, 0, 15, '#A7AFB8'); g.restore();
    softShadow(g, 10, 6, .5, '0,0,0'); fillRR(g, 700, 778, 240, 22, 2, '#DADEE3'); fillRR(g, 1010, 762, 90, 40, 6, '#353B45'); noShadow(g);
    fillRR(g, 1020, 768, 70, 12, 2, '#A9C2B5'); glow(g, 1055, 774, 60, '#A9C2B5', .3);
    fillRR(g, 1170, 742, 60, 62, 8, '#8E969F'); for (let k = 0; k < 2; k++) { const ph = (u * .5 + k * .5) % 1; g.globalAlpha = .35 * Math.sin(Math.PI * ph); line(g, 1200 + Math.sin(ph * 8) * 8, 730 - ph * 90, 1200 + Math.sin(ph * 8 + 1) * 8, 715 - ph * 90, 4, '#C9D0D7'); } g.globalAlpha = 1;
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rad(g, 780, 790, 0, 400, [[0, rgba(O.lamp, .25)], [1, 'rgba(0,0,0,0)']]); g.fillRect(380, 600, 800, 300); g.restore();
    pendant(g, 780, -40, 250, '#3C434E', O.lamp, .22, u, 920);
  });
  layer(ctx, cam, .55, g => { for (let k = 0; k < 4; k++) fillRR(g, -40 + k * 70, 720 + (k % 2) * 20, 64, 420, 6, ['#2B313B', '#353C47', '#262C35', '#303741'][k]); });
  caption(ctx, u, d, { text: 'Po 12 godzinach na budowie — *wyceny.*', x: 150, y: 200, size: 58, style: 'old', t0: .4, maxW: 900 });
};
SH['03B'] = (ctx, u, d) => {
  const cam = drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: -30, y: 10, zoom: 1.12 });
  cam.focus = 1.6; cam.dof = 18;
  layer(ctx, cam, 1.6, g => {
    g.fillStyle = '#26303B'; g.fillRect(-300, -300, W + 600, H + 600);
    // gwiazdki z lampki nocnej na ścianie
    const r = rng(5); for (let i = 0; i < 40; i++) { const x = 200 + r() * 1300, y = 100 + r() * 500; g.globalAlpha = .25 + .15 * Math.sin(u * 1.5 + i); star(g, x, y, 5 + r() * 6, '#9FB0C2'); } g.globalAlpha = 1;
    nightWindow(g, u, 1150, 180, 220, 260, '#33404D');
    g.fillStyle = '#202831'; g.fillRect(-300, 820, W + 600, 400);
    // łóżko i śpiące dziecko
    const br = 1 + .035 * Math.sin(u * 2.4);
    contact(g, 720, 840, 330, 26, .55);
    fillRR(g, 420, 700, 600, 120, 16, '#3C4653'); fillRR(g, 400, 600, 40, 220, 12, '#46515E');
    ell(g, 520, 690, 80, 34, '#9AA6B3');
    g.save(); g.translate(540, 672); g.rotate(-.25); circ(g, 0, 0, 40, '#AEB4BB'); g.save(); g.beginPath(); g.arc(0, 0, 41, 0, TAU); g.clip(); g.fillStyle = '#4F555D'; g.fillRect(-45, -45, 90, 28); g.restore();
    g.strokeStyle = '#353A44'; g.lineWidth = 3; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 13, 3, 7, .15 * Math.PI, .85 * Math.PI); g.stroke(); } g.restore();
    g.save(); g.translate(760, 712); g.scale(1, br); g.fillStyle = lin(g, 0, -60, 0, 20, [[0, '#7A8796'], [1, '#596574']]); rr(g, -190, -56, 400, 70, 30); g.fill(); g.restore();
    circ(g, 960, 650, 30, '#6E6458'); circ(g, 945, 625, 12, '#6E6458'); circ(g, 975, 625, 12, '#6E6458');
    // smuga światła z korytarza przez szparę w drzwiach
    g.save(); g.globalCompositeOperation = 'screen'; poly(g, [[1230, 60], [1290, 60], [1100, 1100], [560, 1100]]); g.fillStyle = lin(g, 0, 60, 0, 1100, [[0, rgba(O.lamp, .32)], [1, rgba(O.lamp, .08)]]); g.fill(); g.restore();
    dust(g, u, 700, 300, 500, 700, 30, 9, O.lamp, .4, 2);
    for (let i = 0; i < 3; i++) { const ph = ((u * .5 + i / 3) % 1); g.globalAlpha = Math.sin(Math.PI * ph) * .8; txt(g, 'z', 600 + ph * 90 + i * 8, 610 - ph * 170, 38 + i * 6, 600, '#AAB6C3'); } g.globalAlpha = 1;
  });
  layer(ctx, cam, .75, g => {
    g.fillStyle = '#0E1115'; g.fillRect(-300, -300, 560, H + 600); g.fillRect(1700, -300, 600, H + 600);
    poly(g, [[1290, -200], [1700, -300], [1700, 1300], [1290, 1250]], '#161B21');
    line(g, 1290, -200, 1290, 1250, 6, rgba(O.lamp, .6)); circ(g, 1350, 620, 14, '#2E353F');
  });
  caption(ctx, u, d, { text: 'Po nocach liczy *od zera…*', x: 300, y: 980, size: 58, style: 'old', t0: .3 });
};
SH['03C'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.05 }), u, .7, 14);
  cam.focus = 1; cam.dof = 22;
  const dim = E.inOutSine(P(u, 2.6, 3.4));
  layer(ctx, cam, 3, g => {
    g.fillStyle = '#161A20'; g.fillRect(-300, -300, W + 600, H + 600);
    bokeh(g, u, 7, 21, [O.lamp, '#8C98A6'], 0, 80, 900, 500, 40, 110, .22 * (1 - dim * .6));
    glow(g, 360, 200, 400, O.lamp, .18 * (1 - dim));
  });
  layer(ctx, cam, 1, g => {
    const q = device3D(g, 'ph03', 440, 900, { cx: 1180, cy: 600, s: 1, ry: -.25, rx: .12, rz: .06, frame: '#14181D', screen: '#DCE1E6', r: 62, bezel: 16, glarePos: .3 + u * .05, shadowA: .6 }, (s, x, y, w, h) => {
      s.fillStyle = lin(s, 0, y, 0, y + h, [[0, '#E6EAEE'], [1, '#D3D9DF']]); s.fillRect(x, y, w, h);
      txt(s, '01:14', x + 30, y + 46, 22, 600, '#2E333B');
      s.fillStyle = '#C3CAD2'; s.fillRect(x, y + 66, w, 84); circ(s, x + 52, y + 108, 24, '#9AA3AD');
      txt(s, 'Klient – dom 140 m²', x + 92, y + 116, 23, 600, '#2E333B');
      const k = E.outBack(P(u, cue('03C', 0), cue('03C', 0) + .45));
      if (k > 0) { s.save(); s.globalAlpha = clamp(k); s.translate(0, (1 - k) * 80); softShadow(s, 16, 6, .2, '0,0,0'); fillRR(s, x + 120, y + 420, 260, 100, 22, '#AEB8C3'); noShadow(s);
        fillRR(s, x + 140, y + 438, 48, 64, 4, '#F3F4F6'); txt(s, 'Wycena.pdf', x + 202, y + 468, 24, 600, '#22272E'); txt(s, '2,4 MB', x + 202, y + 498, 19, 400, '#4E5661'); s.restore(); }
      s.globalAlpha = P(u, 1.1, 1.5); txt(s, 'Wyświetlono 01:14', x + 380, y + 552, 19, 400, '#5E6772', 'right'); s.globalAlpha = 1;
      fillRR(s, x + 22, y + h - 90, w - 44, 60, 30, '#F3F4F6');
      if (dim > 0) { s.fillStyle = `rgba(8,10,12,${dim * .92})`; s.fillRect(x, y, w, h); }
    });
    // światło ekranu na dłoni
    glow(g, 1150, 650, 520, '#C9D6E2', .28 * (1 - dim), 'screen');
    g.fillStyle = lin(g, 900, 0, 1250, 0, [[0, '#8C867F'], [1, '#B3ADA6']]);
    rr(g, 920, 830, 260, 360, 90); g.fill();
    g.save(); g.translate(990, 820); g.rotate(-.7); g.fillStyle = lin(g, -30, 0, 30, 0, [[0, '#A39D96'], [1, '#C2BCB5']]); rr(g, -30, -110, 60, 160, 30); g.fill(); g.restore();
    for (let k = 0; k < 3; k++) { g.fillStyle = shade('#B3ADA6', -.05 * k); rr(g, 1320 + k * 8, 560 + k * 70, 90, 56, 28); g.fill(); }
  });
  caption(ctx, u, d, { text: '…to, co powinno *wynikać wprost z projektu.*', x: 150, y: 460, size: 58, style: 'old', t0: .2, maxW: 650 });
};

/* ---------- 04: rano na placu, materiału nie ma ---------- */
function siteOldBack(g, u) {
  g.fillStyle = lin(g, 0, -200, 0, 680, [[0, '#A9B2BC'], [1, '#D2D7DD']]); g.fillRect(-400, -300, W + 800, 980);
  clouds(g, u, 0, 8, 41, '#BCC4CC', .6, 1.1, 6);
}
function treeLine(g, y, col, seed, n = 30) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = -300 + i * 90 + r() * 60, h = 90 + r() * 120; ell(g, x, y - h * .5, 40 + r() * 30, h * .55, col); g.fillStyle = col; g.fillRect(x - 4, y - 20, 8, 20); } }
function mixer(g, x, y, s, col) {
  contact(g, x, y + 6, 120 * s, 14 * s, .35);
  g.fillStyle = shade(col, -.25); g.fillRect(x - 70 * s, y - 40 * s, 150 * s, 18 * s);
  for (const wx of [-50, 60]) { circ(g, x + wx * s, y - 14 * s, 18 * s, '#2E333B'); circ(g, x + wx * s, y - 14 * s, 7 * s, '#7E8792'); }
  g.save(); g.translate(x, y - 110 * s); g.rotate(-.5); g.fillStyle = litFill(g, -60 * s, 60 * s, col, -1); g.beginPath(); g.moveTo(-50 * s, -70 * s); g.lineTo(50 * s, -70 * s); g.lineTo(70 * s, 50 * s); g.lineTo(-70 * s, 50 * s); g.closePath(); g.fill();
  g.strokeStyle = shade(col, -.2); g.lineWidth = 5 * s; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(-55 * s, k * 30 * s); g.lineTo(55 * s, k * 30 * s + 10 * s); g.stroke(); } g.restore();
  line(g, x - 20 * s, y - 40 * s, x - 10 * s, y - 80 * s, 10 * s, shade(col, -.3));
}
function timeBadge(ctx, x, y, label, bg, fg = '#fff', a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; const w = tw(ctx, label, 40, 600, 2) + 90;
  softShadow(ctx, 30, 12, .3); fillRR(ctx, x, y, w, 72, 20, bg); noShadow(ctx);
  ring(ctx, x + 38, y + 36, 15, 4, fg); line(ctx, x + 38, y + 36, x + 38, y + 27, 3, fg); line(ctx, x + 38, y + 36, x + 45, y + 36, 3, fg);
  txt(ctx, label, x + 66, y + 50, 40, 600, fg, 'left', 2); ctx.restore();
}
SH['04A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: -90, y: 0, zoom: 1.0 }, { x: 70, y: -10, zoom: 1.05 }), u, .6, 17);
  cam.focus = 1; cam.dof = 15;
  const G = 965, s = 1.15, look = Math.sin(u * 1.3) * .45;
  layer(ctx, cam, 7, g => siteOldBack(g, u));
  layer(ctx, cam, 3.2, g => { treeLine(g, 660, '#AEB7C0', 2); fog(g, 520, 680, '#D2D7DD', 0, .7); rain(g, u, { n: 100, a: .2, len: 22, lw: 1.2, speed: 800, seed: 41 }); });
  layer(ctx, cam, 1.6, g => {
    g.fillStyle = lin(g, 0, 680, 0, H + 300, [[0, '#ACB4BD'], [1, '#86909B']]); g.fillRect(-400, 680, W + 800, H + 400);
    houseShell(g, 60, 720, 1.2, {}, -1);
    mixer(g, 900, 735, 1.1, '#8E959E');
  });
  layer(ctx, cam, 1, g => {
    puddle(g, 980, 990, 230, u, 5);
    contact(g, 900, 905, 210, 20, .45); pallet(g, 740, 905, 330, '#8C8578');
    figure(g, Object.assign(who('wykonawca', 'old'), { x: 1180, y: G, s, rim: '#E6ECF2', rimSide: 1, face: { eyes: 'open', mouth: 'sad', brows: 'sad', lx: look * .6 }, hdx: look * 6 }));
    const cup = { e: [28, 75], h: [-8, 52], hold: holdCup('#E8EBEE') };
    [[1360, 0], [1515, 1], [1670, 2]].forEach(([x, i]) => {
      figure(g, Object.assign(who('ekipa', 'old'), { x, y: G, s, rim: '#E6ECF2', rimSide: 1, dy: Math.sin(u * 1.6 + i * 2) * 1.5, face: { eyes: i === 1 ? 'half' : 'open', mouth: i === 2 ? 'sad' : 'flat' }, armR: cup }));
      for (let k = 0; k < 2; k++) { const ph = (u * .4 + k * .5 + i * .2) % 1; g.globalAlpha = .45 * Math.sin(Math.PI * ph); line(g, x + 50 * s + Math.sin(ph * 9) * 6, G - 345 * s - ph * 60, x + 50 * s + Math.sin(ph * 9 + 1) * 6, G - 360 * s - ph * 60, 3, '#F0F3F6'); }
      g.globalAlpha = 1;
    });
    splashes(g, u, -200, 900, W + 400, 180, 40, 6);
    rain(g, u, { n: 60, a: .35, len: 34, lw: 1.8, speed: 1100, seed: 43, col: '#C9D3DD' });
  });
  layer(ctx, cam, .5, g => {
    for (const x of [-60, 1990]) { g.fillStyle = '#5A626C'; g.fillRect(x - 14, 600, 28, 700); }
    for (let i = 0; i < 2; i++) { g.save(); g.translate(0, 1000 + i * 20); g.rotate(-.04 + i * .02); for (let k = -2; k < 26; k++) { g.fillStyle = k % 2 ? '#C9CDD2' : '#A0726B'; g.fillRect(k * 90, -18, 90, 36); } g.restore(); }
  });
  timeBadge(ctx, 1600, 70, '07:00', 'rgba(40,46,56,.75)');
  caption(ctx, u, d, { text: 'Rano ekipa jest na placu. *Materiał — nie.*', x: 150, y: 200, size: 60, style: 'old', t0: .5, maxW: 1100 });
};
function glassCard(ctx, x, y, w, h, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; softShadow(ctx, 50, 24, .35, '10,15,22');
  fillRR(ctx, x, y, w, h, 26, 'rgba(235,240,245,.82)'); noShadow(ctx);
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; rr(ctx, x + 1, y + 1, w - 2, h - 2, 25); ctx.stroke();
  ctx.restore();
}
SH['04B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 30, y: 0, zoom: 1.05 }), u, .8, 19);
  cam.focus = 1; cam.dof = 18;
  layer(ctx, cam, 3.5, g => {
    siteOldBack(g, u); g.fillStyle = lin(g, 0, 700, 0, H, [[0, '#ACB4BD'], [1, '#8C96A1']]); g.fillRect(-400, 700, W + 800, 600);
    [[1250, 0], [1420, 1], [1590, 2]].forEach(([x, i]) => figure(g, Object.assign(who('ekipa', 'old'), { x, y: 1000, s: 1.2, face: { eyes: 'half', mouth: 'flat' } })));
    pallet(g, 1100, 1010, 300, '#8C8578');
  });
  layer(ctx, cam, 1, g => {
    figure(g, Object.assign(who('wykonawca', 'old'), { x: 560, y: 1500, s: 2.7, light: -1, rim: '#E6ECF2', rimSide: 1, face: { eyes: 'open', mouth: 'sad', brows: 'sad', bags: true },
      armR: { e: [52, -8], h: [-2, -70], behind: holdPhone('#1E2228') } }));
  });
  layer(ctx, cam, .85, g => {
    const k = E.outBack(P(u, .25, .7)), steps = Math.floor(E.inQuad(P(u, cue('04B', 1), cue('04B', 1) + 2.6)) * 50), val = 240 + steps * 20;
    if (k > 0) { g.save(); popScale(g, k, 900, 380); glassCard(g, 880, 220, 470, 120); txt(g, '„Dziś nie dojedzie…”', 1115, 296, 38, 600, '#262B33', 'center'); g.restore(); }
    const k2 = E.outBack(P(u, .9, 1.3));
    if (k2 > 0) { g.save(); popScale(g, k2, 1500, 560); glassCard(g, 1330, 470, 440, 170);
      txt(g, 'PRZESTÓJ', 1370, 528, 24, 700, '#6E7884', 'left', 3);
      txt(g, '– ' + val.toLocaleString('pl-PL').replace(/ /g, ' ') + ' zł', 1370, 606, 62, 800, O.alarm);
      g.restore(); }
  });
  layer(ctx, cam, .55, g => rain(g, u, { n: 60, a: .45, len: 100, lw: 5, speed: 2200, seed: 33, col: '#CCD6E0' }));
  lensDrops(ctx, u, 8, 23);
  caption(ctx, u, d, { text: 'Nikt nie powiedział, *kiedy będzie potrzebny.*', x: 1820, y: 980, size: 54, style: 'old', align: 'right', t0: 1.4, maxW: 900 });
};

/* ---------- 05: hurtownia ---------- */
const VP = [980, 430];
function aisle(g, u, cols, lightCol, board, bright = 0) {
  // perspektywa jednopunktowa: regały po bokach uciekają do punktu zbiegu
  const toVP = (x, y, k) => [lerp(x, VP[0], k), lerp(y, VP[1], k)];
  g.fillStyle = lin(g, 0, 0, 0, VP[1], [[0, shade(cols.ceil, -.1)], [1, cols.ceil]]); g.fillRect(-300, -300, W + 600, VP[1] + 300);
  g.fillStyle = lin(g, 0, VP[1], 0, H, [[0, cols.floor], [1, shade(cols.floor, -.15)]]); g.fillRect(-300, VP[1], W + 600, H);
  poly(g, [toVP(-300, -300, .82), toVP(W + 300, -300, .82), toVP(W + 300, H + 300, .82), toVP(-300, H + 300, .82)], cols.back);
  // lampy sufitowe
  for (let i = 0; i < 6; i++) { const k = 1 - Math.pow(.72, i + 1), [x, y] = toVP(960, -80, k), w = 300 * (1 - k); fillRR(g, x - w / 2, y - 6 * (1 - k), w, 14 * (1 - k) + 2, 6, rgba(lightCol, .95)); glow(g, x, y, 220 * (1 - k) + 40, lightCol, .3 * (1 - k * .5)); }
  const r = rng(5);
  for (const side of [-1, 1]) {
    const xo = side < 0 ? -300 : W + 300, xi = side < 0 ? 330 : 1630;
    poly(g, [[xo, -300], [xi, 0], [xi, 820], [xo, H + 300]].map(([x, y]) => [x, y]), shade(cols.shelf, -.2));
    for (let lev = 0; lev < 4; lev++) {
      const y0 = 140 + lev * 190;
      for (let i = 0; i < 9; i++) {
        const k0 = i / 9, k1 = (i + .8) / 9;
        const a0 = toVP(xi, y0, k0 * .82), a1 = toVP(xi, y0, k1 * .82), b0 = toVP(xi, y0 + 140, k0 * .82), b1 = toVP(xi, y0 + 140, k1 * .82);
        poly(g, [a0, a1, b1, b0], cols.box[Math.floor(r() * cols.box.length)]);
      }
      const p0 = toVP(xi, y0 + 150, 0), p1 = toVP(xi, y0 + 150, .82);
      g.strokeStyle = board; g.lineWidth = 10; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
    }
  }
  // odbicia lamp w podłodze
  g.save(); g.globalCompositeOperation = 'screen'; for (let i = 0; i < 4; i++) { const k = 1 - Math.pow(.72, i + 1), [x, y] = toVP(960, H + 200, k); ell(g, x, y, 160 * (1 - k) + 20, 18 * (1 - k) + 4, rgba(lightCol, .18 + bright * .1)); } g.restore();
}
const OLD_SHOP = { ceil: '#C5CBD2', floor: '#9EA6AF', back: '#B5BCC4', shelf: '#8E97A1', box: ['#B3BAC2', '#99A1AB', '#C6CCD2', '#868F9A', '#A7AFB8'] };
SH['05A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.05 }), u, .5, 23);
  cam.focus = 1; cam.dof = 14;
  layer(ctx, cam, 2.4, g => aisle(g, u, OLD_SHOP, '#E9F1F7', '#6E7884'));
  layer(ctx, cam, 1, g => {
    const G = 975, s = 1.55, g1 = Math.sin(u * 3.1), g2 = Math.sin(u * 2.3 + 1);
    figure(g, Object.assign(who('sprzedawca', 'old'), { x: 700, y: G, s, light: 1, rim: '#E9F1F7', rimSide: -1, face: { eyes: 'open', mouth: g1 > .3 ? 'o' : 'flat' },
      armL: { e: [55, 40], h: [110 + 12 * g1, 55 + 10 * g2] }, armR: { e: [50, 50], h: [80 + 25 * g2, -5 + 25 * g1] } }));
    figure(g, Object.assign(who('inwestor', 'old'), { x: 1280, y: G, s, light: -1, rim: '#E9F1F7', rimSide: 1, face: { eyes: 'open', mouth: 'sad', brows: P(u, .8, 1.2) > .5 ? 'sad' : null, lx: -.15 } }));
    g.fillStyle = lin(g, 0, 760, 0, H, [[0, '#7E8792'], [1, '#5E6670']]); g.fillRect(200, 776, 1520, 400);
    g.fillStyle = lin(g, 0, 740, 0, 776, [[0, '#A9B1BA'], [1, '#8D96A0']]); g.fillRect(180, 740, 1560, 36);
    softShadow(g, 14, 6, .4, '0,0,0');
    fillRR(g, 400, 680, 80, 66, 4, '#9C8076'); fillRR(g, 500, 702, 130, 44, 4, '#AAB0B7'); fillRR(g, 880, 728, 220, 22, 3, '#EEF0F2'); noShadow(g);
    g.strokeStyle = '#59616B'; g.lineWidth = 3; partialPath(g, [[905, 742], [940, 734], [970, 744], [1010, 732], [1060, 741]], P(u, 1.5, 4)); g.stroke();
    const qk = E.outBack(P(u, .9, 1.3)); if (qk > 0) { g.save(); popScale(g, qk, 1360, 360); glassCard(g, 1310, 310, 100, 100); txt(g, '?', 1360, 382, 64, 700, '#3B404B', 'center'); g.restore(); }
    // zegar na słupie przeskakuje o pół godziny
    g.fillStyle = litFill(g, 1540, 1640, '#9AA2AC', -1); g.fillRect(1540, -100, 100, 880);
    const w0 = cue('05A', 0), jump = E.inOutCubic(P(u, w0, w0 + .8));
    clock(g, 1590, 420, 70, 10, 5 + 30 * jump, null, { face: '#E8EBEE' });
    if (jump > 0) { g.strokeStyle = O.alarm; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(1590, 420, 92, -1.2, -1.2 + 2.6 * jump); g.stroke(); }
    const lk = E.outBack(P(u, w0 + .6, w0 + 1)); if (lk > 0) { g.save(); popScale(g, lk, 1590, 560); glassCard(g, 1490, 520, 200, 70); txt(g, '+30 min', 1590, 568, 34, 800, O.alarm, 'center'); g.restore(); }
  });
  layer(ctx, cam, .5, g => { fillRR(g, -80, 860, 360, 320, 10, '#7C858F'); fillRR(g, 1700, 900, 320, 300, 10, '#8E97A1'); });
  caption(ctx, u, d, { text: 'Pół godziny tłumaczenia, *czego trzeba do budowy.*', x: 150, y: 190, size: 54, style: 'old', t0: .5, maxW: 900 });
};
SH['05B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 30, y: 0, zoom: 1.06 }, { x: 0, y: 0, zoom: 1.0 }), u, .4, 29);
  cam.focus = 1; cam.dof = 14;
  layer(ctx, cam, 2.4, g => aisle(g, u, OLD_SHOP, '#E9F1F7', '#6E7884'));
  layer(ctx, cam, 1.15, g => {
    // przeszklone drzwi z widokiem na deszczową ulicę
    g.fillStyle = '#B9C0C8'; g.fillRect(1180, -200, 900, 1300);
    g.save(); rr(g, 1270, 140, 420, 880, 4); g.clip();
    g.fillStyle = lin(g, 0, 140, 0, 1020, [[0, '#DCE3EA'], [1, '#A9B2BC']]); g.fillRect(1270, 140, 420, 880);
    treeLine(g, 720, '#B5BEC8', 7, 8); rain(g, u, { n: 60, a: .4, len: 30, lw: 1.5, speed: 1000, seed: 44, x0: 1100, w: 800 });
    const walk = P(u, 0, 2.6);
    g.globalAlpha = 1 - .75 * walk;
    figure(g, Object.assign(who('inwestor', 'old'), { x: 1450 + 140 * walk, y: 1010 - 60 * walk, s: 1.45 - .5 * walk, back: true, top: '#7E8792', legs: '#6E7884', hairCol: '#6E7884', skin: '#8E98A3', shadow: false, step: Math.sin(u * 8) * 6 * (1 - walk) }));
    g.globalAlpha = 1; g.restore();
    const close = E.inOutSine(P(u, .6, cue('05B', 1))), pw = lerp(70, 420, close);
    g.fillStyle = 'rgba(190,205,218,.35)'; g.fillRect(1270, 140, pw, 880);
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = lin(g, 1270, 140, 1270 + pw, 1020, [[0, 'rgba(255,255,255,0)'], [.45, 'rgba(255,255,255,.25)'], [.55, 'rgba(255,255,255,0)']]); g.fillRect(1270, 140, pw, 880); g.restore();
    g.strokeStyle = '#59616B'; g.lineWidth = 14; g.strokeRect(1270, 140, pw, 880);
    g.strokeStyle = '#47505A'; g.lineWidth = 22; g.strokeRect(1259, 129, 442, 902);
    const sw = Math.sin(u * 14) * Math.exp(-u * 2.2) * .5;
    g.save(); g.translate(1480, 110); g.rotate(sw); line(g, 0, 0, 0, 24, 3, '#59616B'); g.fillStyle = litFill(g, -22, 22, '#B4A988', -1); g.beginPath(); g.arc(0, 44, 22, Math.PI, TAU); g.lineTo(24, 48); g.lineTo(-24, 48); g.fill(); g.restore();
  });
  layer(ctx, cam, 1, g => {
    figure(g, Object.assign(who('sprzedawca', 'old'), { x: 600, y: 975, s: 1.55, light: 1, rim: '#E9F1F7', rimSide: -1, face: { eyes: 'open', mouth: 'sad', brows: 'sad', lx: P(u, 0, 1) * .18 } }));
    g.fillStyle = lin(g, 0, 760, 0, H, [[0, '#7E8792'], [1, '#5E6670']]); g.fillRect(100, 776, 1000, 400);
    g.fillStyle = lin(g, 0, 740, 0, 776, [[0, '#A9B1BA'], [1, '#8D96A0']]); g.fillRect(80, 740, 1040, 36);
    g.save(); g.translate(860, 736); g.rotate(-.04); softShadow(g, 14, 6, .4, '0,0,0'); fillRR(g, -150, -40, 300, 70, 4, '#EEF0F2'); noShadow(g);
    txt(g, 'ZAMÓWIENIE', -126, -6, 24, 700, '#3B404B', 'left', 2); line(g, -126, 14, 126, 14, 2, '#B3BAC2'); g.restore();
  });
  caption(ctx, u, d, { text: 'Klient dziękuje… *i wychodzi z niczym.*', x: 150, y: 210, size: 58, style: 'old', t0: .6, maxW: 900 });
};

/* ---------- 06: zwrot — każdy osobno → trójkąt ---------- */
const PANELS = [{ cx: 500, cy: 300, ry: .16, rx: -.06 }, { cx: 1420, cy: 300, ry: -.16, rx: -.06 }, { cx: 500, cy: 790, ry: .16, rx: .06 }, { cx: 1420, cy: 790, ry: -.16, rx: .06 }];
function panelShot(ctx, key, id, uu, o, a = 1) {
  const [c, g] = surface(key, 960, 540);
  NOCAP = true; g.save(); g.scale(.5, .5); SH[id](g, uu, SHOT[id].dur); g.restore(); NOCAP = false;
  ctx.save(); ctx.globalAlpha *= a;
  const q = quadOf(960, 540, o);
  ctx.save(); ctx.filter = 'blur(30px)'; ctx.globalAlpha *= .5; poly(ctx, q.map(([x, y]) => [x + 20, y + 40]), '#000'); ctx.restore();
  warp(ctx, c, 960, 540, o, 10);
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; poly(ctx, q); ctx.stroke();
  ctx.restore();
  return q;
}
const OLD_PANELS = t => [['01A', 2.5 + t], ['03A', 1.0 + t * .3], ['04A', 1.5 + t], ['05B', 3.6 + Math.min(t, .5) * .1]];
function panels(ctx, list, t, cam, appear, k = .82) {
  list.forEach(([id, uu], i) => {
    const pk = appear ? E.outCubic(P(t, appear[i], appear[i] + .6)) : 1; if (pk <= 0) return;
    const p = PANELS[i], z = 1 + i * .05;
    const o = { cx: (p.cx - cam.x / z - W / 2) * cam.zoom + W / 2, cy: (p.cy - cam.y / z - H / 2) * cam.zoom + H / 2 + (1 - pk) * 80, ry: p.ry * (1 + (1 - pk)), rx: p.rx, s: k * cam.zoom * lerp(.9, 1, pk), fov: 1600 };
    panelShot(ctx, 'pan' + i, id, uu, o, pk);
  });
}
function darkSpace(g, u, frozen = false) {
  g.fillStyle = rad(g, 960, 540, 100, 1200, [[0, '#262D37'], [1, '#0D1014']]); g.fillRect(-300, -300, W + 600, H + 600);
}
SH['06A'] = (ctx, u, d) => {
  const cam = drift(u, d, { x: 0, y: 0, zoom: 1.12 }, { x: 0, y: 0, zoom: 1.0 }, E.outCubic);
  darkSpace(ctx, u);
  layer(ctx, { x: 0, y: 0, zoom: cam.zoom, focus: 1, dof: 0 }, 2, g => rain(g, u, { n: 140, a: .25, len: 40, lw: 1.5, speed: 1200, seed: 61 }), { blur: 3 });
  panels(ctx, OLD_PANELS(u), u, cam, [0, .3, .6, .9]);
  layer(ctx, { x: 0, y: 0, zoom: cam.zoom }, .6, g => rain(g, u, { n: 50, a: .35, len: 90, lw: 4, speed: 2000, seed: 62, col: '#C3CDD8' }), { blur: 8 });
  caption(ctx, u, d, { text: 'Każdy robi, co może. *Tylko każdy osobno.*', x: 960, y: 1048, size: 46, style: 'old', align: 'center', t0: 1.3, maxW: 1700 });
};
let FROZEN = null;
SH['06B'] = (ctx, u, d) => {
  const fz = SHOT['06A'].dur;
  darkSpace(ctx, fz);
  layer(ctx, { x: 0, y: 0, zoom: 1 }, 2, g => rain(g, fz, { n: 140, a: .25, len: 40, lw: 1.5, speed: 1200, seed: 61 }), { blur: 3 });
  panels(ctx, OLD_PANELS(fz), fz, { x: 0, y: 0, zoom: 1 }, null);
  layer(ctx, { x: 0, y: 0, zoom: 1 }, .6, g => rain(g, fz, { n: 50, a: .35, len: 90, lw: 4, speed: 2000, seed: 62, col: '#C3CDD8' }), { blur: 8 });
  ctx.fillStyle = `rgba(8,10,14,${lerp(.1, .55, E.outCubic(P(u, 0, .7)))})`; ctx.fillRect(0, 0, W, H);
  const t0 = cue('06B', 0), k = E.spring(P(u, t0, t0 + .9));
  if (u >= t0) {
    glow(ctx, 960, 545, 420 * k, N.teal, .55);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 * (1 - P(u, t0, t0 + .5)); line(ctx, 960 - 700 * k, 545, 960 + 700 * k, 545, 3, N.teal); ctx.restore();
    tri(ctx, 960, 550, 62 * k, N.teal, .18);
  }
};
SH['06C'] = (ctx, u, d) => {
  const fz = SHOT['06A'].dur, g_ = E.inCubic(P(u, 0, 1.1));
  const Rp = lerp(85, 2700, g_), Rt = lerp(62, 2400, E.inCubic(P(u, .1, 1.25)));
  darkSpace(ctx, fz);
  panels(ctx, OLD_PANELS(fz), fz, { x: 0, y: 0, zoom: 1 + g_ * .3 }, null);
  ctx.fillStyle = 'rgba(8,10,14,.55)'; ctx.fillRect(0, 0, W, H);
  // promienie światła od środka
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(960, 545);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + u * .3, w = .05 + .03 * Math.sin(i * 7); ctx.fillStyle = rad(ctx, 0, 0, 0, 1400, [[0, rgba(N.teal, .35 * (1 - g_ * .7))], [1, rgba(N.teal, 0)]]); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 1400, a - w, a + w); ctx.fill(); }
  ctx.restore();
  tri(ctx, 960, 545 - (Rp - 85) * .1, Rp, N.purple, .16);
  // zamrożone krople lecą do kamery jako świetliste punkty
  const r = rng(77);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 220; i++) {
    const a = r() * TAU, d0 = 40 + r() * 600, z = Math.pow(P(u, .1 + r() * .3, 1.9 + r() * .4), 1.6), dd = d0 * (1 + z * 6), sz = (2 + r() * 3) * (1 + z * 5);
    if (z <= 0 || z >= 1) continue;
    circ(ctx, 960 + Math.cos(a) * dd, 545 + Math.sin(a) * dd, sz, rgba(r() > .5 ? '#ffffff' : N.teal, .8 * Math.sin(Math.PI * z)));
  }
  ctx.restore();
  tri(ctx, 960, 545 - (Rt - 62) * .1, Rt, N.teal, .16);
  if (u > 1.0) { ctx.save(); ctx.globalAlpha = P(u, 1.0, 1.3); ctx.fillStyle = rad(ctx, 960, 545, 0, 1200, [[0, '#8A1E99'], [1, N.purple2]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  caption(ctx, u, d, { text: 'A gdyby *wszyscy byli w jednym miejscu?*', x: 960, y: 570, size: 72, style: 'light', align: 'center', t0: 1.1, t1: 2.75, maxW: 1700 });
  const c = E.inOutCubic(P(u, 2.45, d - .05));
  if (c > 0) { ctx.save(); triPath(ctx, 960, 560, lerp(10, 2500, c), .16); ctx.clip(); ctx.fillStyle = N.paper; ctx.fillRect(0, 0, W, H); glow(ctx, 960, 560, 900, N.glow, .6, 'source-over'); ctx.restore(); }
};
