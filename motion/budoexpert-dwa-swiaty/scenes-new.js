/* =====================================================================
   NOWY ŚWIAT (07–12): ciepło, światło, wszyscy w aplikacji Budoexpert
   ===================================================================== */
const WARM_RIM = '#FFE3B5';
function warmWall(g, col, floorY, floorCol) {
  g.fillStyle = col; g.fillRect(-400, -300, W + 800, floorY + 300);
  g.strokeStyle = rgba('#E3C3A6', .28); g.lineWidth = 1.2; g.beginPath();
  for (let x = -400; x < W + 400; x += 36) { g.moveTo(x, -300); g.lineTo(x, floorY); }
  for (let y = -300; y < floorY; y += 36) { g.moveTo(-400, y); g.lineTo(W + 400, y); } g.stroke();
  g.fillStyle = lin(g, 0, floorY, 0, H + 300, [[0, floorCol], [1, shade(floorCol, -.12)]]); g.fillRect(-400, floorY, W + 800, H + 600);
  g.fillStyle = shade(col, -.08); g.fillRect(-400, floorY - 16, W + 800, 16);
}
function sunWindow(g, u, x, y, w, h, frame = '#C9A3C9', sun = [.62, .4]) {
  fillRR(g, x - 18, y - 18, w + 36, h + 36, 8, frame);
  g.save(); rr(g, x, y, w, h, 3); g.clip();
  g.fillStyle = lin(g, 0, y, 0, y + h, [[0, '#FFD9A8'], [1, '#FFF1DA']]); g.fillRect(x, y, w, h);
  circ(g, x + w * sun[0], y + h * sun[1], 50, '#FFF6E0'); glow(g, x + w * sun[0], y + h * sun[1], 200, '#FFD38A', .8);
  clouds(g, u, y + h * .55, 3, 9, '#FFFFFF', .5, .35, 6);
  treeLine(g, y + h + 10, '#E9C79D', 4, 10);
  g.restore();
  line(g, x + w / 2, y, x + w / 2, y + h, 12, frame); line(g, x, y + h * .5, x + w, y + h * .5, 10, frame);
  fillRR(g, x - 30, y + h + 14, w + 60, 18, 6, shade(frame, -.1));
}
function plant(g, x, y, s, t = 0, col = '#3E8E6B') {
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .38 + Math.sin(t * .8 + i) * .03, L = (200 + (i % 3) * 60) * s;
    const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
    g.strokeStyle = shade(col, -.2); g.lineWidth = 6 * s; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .4, y + Math.sin(a) * L * .6, ex, ey); g.stroke();
    g.save(); g.translate(ex, ey); g.rotate(a + Math.PI / 2); g.fillStyle = lin(g, -70 * s, 0, 70 * s, 0, [[0, shade(col, .15)], [1, shade(col, -.15)]]);
    g.beginPath(); g.ellipse(0, 0, 70 * s, 95 * s, 0, 0, TAU); g.fill();
    g.strokeStyle = shade(col, -.3); g.lineWidth = 3 * s; g.beginPath(); g.moveTo(0, 90 * s); g.lineTo(0, -90 * s); g.stroke(); g.restore();
  }
  g.fillStyle = litFill(g, x - 90 * s, x + 90 * s, '#E8D6C6', -1); g.beginPath(); g.moveTo(x - 90 * s, y - 20 * s); g.lineTo(x + 90 * s, y - 20 * s); g.lineTo(x + 70 * s, y + 140 * s); g.lineTo(x - 70 * s, y + 140 * s); g.closePath(); g.fill();
}
function floorLamp(g, x, top, bottom) {
  glow(g, x, top + 40, 420, '#FFD9A0', .55);
  line(g, x, top + 60, x, bottom, 7, '#4A2A4F'); fillRR(g, x - 60, bottom - 8, 120, 12, 6, '#4A2A4F');
  g.fillStyle = lin(g, x - 70, 0, x + 70, 0, [[0, '#FFE2A8'], [1, '#F5B860']]); poly(g, [[x - 42, top], [x + 42, top], [x + 72, top + 74], [x - 72, top + 74]]); g.fill();
  ell(g, x, top + 74, 72, 10, '#FFF3D6');
}
function sofa(g, x0, x1, y) {
  contact(g, (x0 + x1) / 2, y + 160, (x1 - x0) * .55, 30, .35, '60,10,60');
  g.fillStyle = lin(g, 0, y - 200, 0, y, [[0, '#7A2388'], [1, '#55105F']]); rr(g, x0 + 70, y - 200, x1 - x0 - 140, 220, 60); g.fill();
  for (let k = 0; k < 3; k++) { const cx = x0 + 160 + k * ((x1 - x0 - 320) / 2); g.fillStyle = lin(g, 0, y - 180, 0, y - 20, [[0, '#86319A'], [1, '#62176E']]); rr(g, cx - 170, y - 180, 340, 170, 40); g.fill(); }
  g.fillStyle = lin(g, 0, y, 0, y + 150, [[0, '#7F2590'], [1, N.purple2]]); rr(g, x0 + 40, y, x1 - x0 - 80, 150, 26); g.fill();
  for (const ax of [x0, x1 - 130]) { g.fillStyle = litFill(g, ax, ax + 130, '#62176E', -1, .15); rr(g, ax, y - 110, 130, 300, 50); g.fill(); }
}
const phoneGlow = (ctx, x, y, s, a) => glow(ctx, x, y - 30 * s, 240 * s, N.teal, a, 'screen');

/* ---------- 07: teraz wiesz wszystko ---------- */
SH['07A'] = (ctx, u, d) => {
  const push = E.inCubic(P(u, d - 1.1, d));
  const cam = handheld(drift(u, d, { x: -30, y: 0, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.04 }), u, .5, 31);
  cam.zoom += push * .5; cam.x += push * 220; cam.y += push * 130; cam.focus = 1; cam.dof = 16;
  layer(ctx, cam, 2.2, g => {
    warmWall(g, '#FBE6D2', 960, '#EBCFB2');
    sunWindow(g, u, 200, 150, 340, 320);
    fillRR(g, 760, 200, 170, 130, 6, '#E9C9A9'); fillRR(g, 772, 212, 146, 106, 3, '#C9A3C9'); circ(g, 845, 265, 26, N.sun);
    fillRR(g, 960, 230, 120, 150, 6, '#E9C9A9'); fillRR(g, 972, 242, 96, 126, 3, '#9FE0CC');
    floorLamp(g, 1640, 300, 960);
    rays(g, u, 230, 160, 330, 1100, -.55, '#FFE6B8', .22, 5, 2);
    dust(g, u, 150, 300, 800, 600, 50, 3, '#FFF3D6', .55, 2.4);
  });
  layer(ctx, cam, 1, g => {
    sofa(g, 300, 1520, 800);
    const s = 1.65, G = 980, pk = E.outBack(P(u, cue('07A', 0), cue('07A', 0) + .45));
    phoneGlow(g, 1170, 690, 1.6, .35);
    figure(g, Object.assign(who('inwestorka', 'new'), { x: 840, y: G, s, seated: true, cheeks: true, light: -1, rim: WARM_RIM, rimSide: -1, face: { eyes: 'closed', mouth: 'smile' }, tilt: .24, hdx: 26, hdy: 10 }));
    figure(g, Object.assign(who('inwestor', 'new'), { x: 1085, y: G, s, seated: true, cheeks: true, light: -1, rim: WARM_RIM, rimSide: -1, face: { eyes: 'open', mouth: 'smile', ly: .07, lx: .1 },
      armR: { e: [40, 85], h: [30, 70], behind: holdPhone(N.ink, N.teal, .25) } }));
    if (pk > 0) { g.save(); popScale(g, pk, 1180, 600); card(g, 1100, 520, 330, 92, 46); check(g, 1146, 566, 26); txt(g, 'Fundamenty', 1186, 562, 26, 700, N.ink); txt(g, 'gotowe', 1186, 590, 20, 500, '#7A6680'); g.restore(); }
  });
  layer(ctx, cam, .5, g => { plant(g, 80, 900, 1.3, u); fillRR(g, 1250, 1010, 700, 120, 20, '#C99A6A'); fillRR(g, 1400, 940, 70, 80, 10, '#fff'); });
  caption(ctx, u, d, { text: '*Teraz* wiesz wszystko.', tag: 'INWESTOR', x: 1820, y: 220, size: 72, style: 'new', align: 'right', t0: .4, t1: d - .6 });
};
function appHome(s, x, y, w, h, u, pr) {
  appBar(s, x, y, w, 100, 'Moja budowa');
  const X = x + 32, Wd = w - 64;
  s.fillStyle = lin(s, 0, y + 130, 0, y + 400, [[0, '#F2DFC6'], [1, '#E3C9A8']]); rr(s, X, y + 130, Wd, 260, 18); s.fill();
  s.save(); rr(s, X, y + 130, Wd, 260, 18); s.clip(); houseShell(s, X + 70, y + 370, .75, { wall: '#F5E5CF', line: '#E2C9AA', edge: '#CFB394', hole: '#CDB49A', door: '#BFA386', scaf: '#7A5A62' }); s.restore();
  txt(s, 'Postęp budowy', X, y + 450, 28, 600, N.ink); txt(s, Math.round(pr * 100) + '%', X + Wd, y + 450, 28, 700, N.purple, 'right');
  fillRR(s, X, y + 470, Wd, 16, 8, '#EFE6F1'); fillRR(s, X, y + 470, Math.max(16, Wd * pr), 16, 8, N.teal);
  for (let i = 0; i < 3; i++) { fillRR(s, X, y + 520 + i * 74, Wd, 60, 14, '#F7F1F8'); ring(s, X + 32, y + 550 + i * 74, 14, 3, '#C9B7CE'); fillRR(s, X + 60, y + 543 + i * 74, 160 + i * 30, 14, 7, '#E6DCE8'); }
}
SH['07B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 30, y: 0, zoom: 1.04 }), u, .4, 37);
  cam.focus = 1; cam.dof = 20;
  layer(ctx, cam, 4, g => {
    warmWall(g, '#F6DFC8', 900, '#E8C9A9');
    fillRR(g, 1000, 520, 1100, 400, 80, '#6C1A78'); circ(g, 300, 250, 160, '#FFE7B8');
    bokeh(g, u, 14, 41, ['#FFE2B0', '#FFC978', '#F3C6E8'], 0, 0, W, H, 40, 120, .4);
  });
  layer(ctx, cam, 1, g => {
    const pr = E.inOutCubic(P(u, .3, 1.5)) * .35;
    device3D(g, 'ph07', 560, 1100, { cx: 640, cy: 600, s: .92, ry: lerp(-.32, -.2, u / d), rx: .06, rz: -.03, glarePos: .2 + u * .08 }, (s, x, y, w, h) => appHome(s, x, y, w, h, u, pr));
  });
  // karty wylatują z ekranu do kamery
  layer(ctx, cam, .85, g => {
    const pr = E.inOutCubic(P(u, .3, 1.5)) * .35;
    const c1 = E.outBack(P(u, .2, .7)), c2 = E.outBack(P(u, cue('07B', 0) - .3, cue('07B', 0) + .2)), c3 = E.outBack(P(u, cue('07B', 1), cue('07B', 1) + .5));
    const fly = (k, x, y) => [lerp(700, x, clamp(k)), lerp(560, y, clamp(k)), lerp(.4, 1, clamp(k))];
    if (c1 > 0) { const [x, y, sc] = fly(c1, 1020, 170); g.save(); g.globalAlpha = clamp(c1 * 2); popScale(g, sc, x + 330, y + 80); card(g, x, y, 660, 170);
      txt(g, 'Postęp budowy', x + 40, y + 62, 32, 700, N.ink); txt(g, Math.round(pr * 100) + '%', x + 620, y + 62, 40, 800, N.purple, 'right');
      fillRR(g, x + 40, y + 100, 580, 22, 11, '#EFE6F1'); fillRR(g, x + 40, y + 100, Math.max(22, 580 * pr / .35 * .35), 22, 11, N.teal); g.restore(); }
    if (c2 > 0) { const [x, y, sc] = fly(c2, 1100, 400); g.save(); g.globalAlpha = clamp(c2 * 2); popScale(g, sc, x + 290, y + 70); card(g, x, y, 580, 140);
      check(g, x + 70, y + 70, 34, E.outBack(P(u, cue('07B', 0), cue('07B', 0) + .35))); txt(g, 'Fundamenty – gotowe', x + 124, y + 82, 32, 700, N.ink); g.restore(); }
    if (c3 > 0) { const [x, y, sc] = fly(c3, 1020, 600); g.save(); g.globalAlpha = clamp(c3 * 2); popScale(g, sc, x + 340, y + 110); card(g, x, y, 700, 220, 26, N.lav);
      circ(g, x + 80, y + 90, 44, N.teal); circ(g, x + 80, y + 78, 15, '#fff'); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 80, y + 116, 26, Math.PI, TAU); g.fill(); tri(g, x + 80, y + 108, 9, N.purple, .2);
      txt(g, 'Ekspert Budoexpert', x + 150, y + 74, 30, 700, N.purple); txt(g, 'Wszystko zgodnie z planem.', x + 150, y + 122, 29, 500, N.ink); txt(g, 'Zdjęcia z dziś w dzienniku.', x + 150, y + 166, 26, 400, '#7A6680'); g.restore(); }
  });
  caption(ctx, u, d, { text: 'Każdy etap w aplikacji. *Ekspert czuwa razem z Tobą.*', x: 1010, y: 1010, size: 40, style: 'new', t0: 2.6, maxW: 900 });
};

/* ---------- 08: przejrzyste oferty, wreszcie pewność ---------- */
function kitchenDayBack(g, u) {
  warmWall(g, '#FCEBDB', 900, '#EFD6BC');
  cabinets(g, -100, 640, 120, 230, '#F4E4F3'); cabinets(g, -100, 640, 560, 340, '#EAD6EA');
  sunWindow(g, u, 1250, 160, 320, 270);
  for (const [x, c] of [[1290, '#3E8E6B'], [1520, '#4BA37A']]) { fillRR(g, x - 26, 405, 52, 40, 8, '#E8A87C'); for (let k = 0; k < 5; k++) ell(g, x + (k - 2) * 12, 390 - (k % 2) * 18, 14, 30, c, (k - 2) * .4); }
  rays(g, u, 1260, 170, 300, 1100, .45, '#FFE6B8', .2, 5, 6);
  dust(g, u, 700, 300, 900, 700, 50, 7, '#FFF3D6', .5, 2.4);
}
SH['08A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.02 }, { x: 0, y: -20, zoom: 1.0 }), u, .4, 43);
  const pull = E.inOutCubic(P(u, d - .8, d)); cam.zoom -= pull * .1; cam.focus = 1; cam.dof = 18;
  layer(ctx, cam, 3.5, g => { kitchenDayBack(g, u); g.fillStyle = shade(N.wood, .05); g.fillRect(-400, 860, W + 800, 500); });
  layer(ctx, cam, 1.15, g => {
    g.fillStyle = lin(g, 0, 760, 0, H + 200, [[0, shade(N.wood, .1)], [1, shade(N.wood, -.1)]]); g.fillRect(-400, 760, W + 800, 600);
    device3D(g, 'tab08', 1300, 860, { cx: 960, cy: 990, s: .75, rx: .85, ry: 0, fov: 1800, bezel: 22, r: 44, shadowDy: 20, shadowA: .3, glare: false }, (s, x, y, w, h) => { appBar(s, x, y, w, 90, 'Oferty dla Twojego projektu'); s.fillStyle = '#F8F3F9'; s.fillRect(x, y + 90, w, h - 90); });
    glow(g, 960, 900, 600, N.teal, .25 * P(u, cue('08A', 3), cue('08A', 3) + .4), 'screen');
  });
  layer(ctx, cam, .9, g => {
    const cards = [['Firma A', '512 000 zł', '#EAD9F0'], ['Firma B', '528 000 zł', '#CFF2E8'], ['Firma C', '535 000 zł', '#FDE3CF']];
    const sel = E.outCubic(P(u, cue('08A', 3), cue('08A', 3) + .4));
    cards.forEach(([name, price, av], i) => {
      const k = E.outBack(P(u, cue('08A', i) - .2, cue('08A', i) + .35), 1.1); if (k <= 0) return;
      const mid = i === 1, cx = 520 + i * 440, y0 = lerp(760, mid ? 150 - 30 * sel : 190, clamp(k)) + Math.sin(u * 1.4 + i) * 6;
      g.save(); g.globalAlpha = clamp(k * 1.6); popScale(g, lerp(.6, 1, clamp(k)) * (mid ? 1 + .05 * sel : 1), cx, y0 + 300);
      if (mid && sel > 0) glow(g, cx, y0 + 300, 420, N.teal, .35 * sel, 'screen');
      card(g, cx - 190, y0, 380, 600, 28, '#fff', 1.2);
      g.strokeStyle = mid ? mix('#ECE3EE', N.teal, sel) : '#ECE3EE'; g.lineWidth = mid ? lerp(3, 7, sel) : 3; rr(g, cx - 190, y0, 380, 600, 28); g.stroke();
      circ(g, cx - 120, y0 + 82, 44, av); txt(g, name, cx - 60, y0 + 74, 32, 700, N.ink);
      pill(g, cx - 60, y0 + 92, 170, 36, N.teal, 'Zweryfikowana', 19, '#fff');
      for (let s_ = 0; s_ < 5; s_++) star(g, cx - 150 + s_ * 40, y0 + 186, 17, '#E3A43A');
      txt(g, 'Termin: 7 mies.', cx - 160, y0 + 250, 25, 400, '#6A5470'); txt(g, 'Ten sam projekt · etapy', cx - 160, y0 + 288, 25, 400, '#6A5470');
      txt(g, price, cx - 160, y0 + 384, 52, 800, N.purple);
      pill(g, cx - 160, y0 + 450, 320, 70, mid ? mix(N.lav, N.purple, sel) : N.lav, mid && sel > .5 ? '✓ Wybrano' : 'Wybierz', 27, mid ? mix(N.purple, '#ffffff', sel) : N.purple);
      g.restore();
    });
  });
  caption(ctx, u, d, { text: 'Sprawdzone firmy. *Oferty, które da się porównać.*', x: 960, y: 1040, size: 50, style: 'new', align: 'center', t0: 1.5, maxW: 1600 });
};
SH['08B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 20, y: 0, zoom: 1.0 }, { x: -10, y: 0, zoom: 1.05 }), u, .5, 47);
  cam.focus = 1; cam.dof = 16;
  const t5 = cue('08B', 0), up = E.outBack(P(u, .25, t5), 1.4), meet = [1000, lerp(820, 560, up)];
  layer(ctx, cam, 2.2, g => kitchenDayBack(g, u));
  layer(ctx, cam, 1, g => {
    const s = 1.55, G = 1140, f_ = { eyes: u > t5 ? 'happy' : 'open', mouth: u > t5 - .2 ? 'laugh' : 'smile' };
    contact(g, 960, 1010, 640, 40, .25, '90,40,20');
    figure(g, Object.assign(who('inwestorka', 'new'), { x: 790, y: G, s, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, face: f_, armR: { abs: [meet[0] - 16, meet[1]] } }));
    figure(g, Object.assign(who('inwestor', 'new'), { x: 1210, y: G, s, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, face: f_, armL: { abs: [meet[0] + 16, meet[1]] } }));
    const sp = P(u, t5, t5 + .55);
    if (sp > 0 && sp < 1) { glow(g, meet[0], meet[1], 200 * sp + 60, N.teal, .5 * (1 - sp)); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .4, r0 = 50 + 60 * sp, r1 = r0 + 46; g.globalAlpha = 1 - sp; line(g, meet[0] + Math.cos(a) * r0, meet[1] + Math.sin(a) * r0, meet[0] + Math.cos(a) * r1, meet[1] + Math.sin(a) * r1, 8, i % 2 ? N.teal : N.sun); } g.globalAlpha = 1; }
    tableTop(g, 420, 1500, 840, 70, 60, N.wood);
    softShadow(g, 14, 8, .25);
    fillRR(g, 620, 780, 50, 56, 10, '#fff'); fillRR(g, 1260, 780, 50, 56, 10, '#fff');
    g.save(); g.translate(960, 815); g.scale(1, .45); fillRR(g, -150, -95, 300, 190, 18, N.ink); fillRR(g, -136, -82, 272, 164, 10, '#F3E6F5'); fillRR(g, -136, -82, 272, 30, [10, 10, 0, 0], N.purple); g.restore();
    noShadow(g);
    for (let k = 0; k < 2; k++) { const ph = (u * .5 + k * .5) % 1; g.globalAlpha = .5 * Math.sin(Math.PI * ph); line(g, 645 + Math.sin(ph * 8) * 6, 770 - ph * 70, 645 + Math.sin(ph * 8 + 1) * 6, 755 - ph * 70, 4, '#fff'); } g.globalAlpha = 1;
    ell(g, 1150, 800, 70, 22, '#F4E4D0'); circ(g, 1125, 785, 22, '#F2896B'); circ(g, 1165, 782, 22, '#F4C431'); circ(g, 1148, 770, 20, '#9FD36B');
  });
  layer(ctx, cam, .55, g => { fillRR(g, -60, 640, 330, 60, 18, '#C98F5C'); fillRR(g, 30, 690, 40, 500, 10, '#B97F4E'); fillRR(g, 200, 690, 40, 500, 10, '#B97F4E'); });
  caption(ctx, u, d, { text: 'I *wreszcie pewność.*', x: 150, y: 230, size: 80, style: 'new', t0: .3 });
};

/* ---------- 09: wykonawca — kosztorys gotowy, wieczór wolny ---------- */
function workshopBack(g, u) {
  warmWall(g, '#FBEBDA', 980, '#E6CDAF');
  sunWindow(g, u, 1250, 110, 420, 200, '#C9A3C9', [.3, .5]);
  fillRR(g, 160, 160, 900, 520, 10, '#E9CFAE');
  g.fillStyle = 'rgba(120,80,40,.25)'; for (let x = 190; x < 1040; x += 34) for (let y = 190; y < 660; y += 34) circ(g, x, y, 3.5, 'rgba(120,80,40,.25)');
  const tools = [[260, 220, 30, 200, '#8E6AA8'], [360, 230, 60, 150, '#C99A66'], [480, 210, 24, 240, N.teal], [580, 240, 90, 90, '#E3A43A'], [720, 220, 30, 190, '#6C0C79'], [820, 240, 120, 60, '#9AA3AD'], [860, 360, 26, 220, '#E3A43A'], [300, 470, 140, 40, '#8E6AA8'], [520, 470, 120, 120, '#C99A66']];
  for (const [x, y, w, h, c] of tools) { softShadow(g, 10, 8, .2); fillRR(g, x, y, w, h, 8, c); noShadow(g); }
  rays(g, u, 1250, 120, 420, 1200, .35, '#FFE6B8', .26, 6, 9);
  dust(g, u, 600, 200, 1200, 800, 90, 11, '#FFF3D6', .6, 2.6);
}
SH['09A'] = (ctx, u, d) => {
  const push = E.inCubic(P(u, d - 1, d));
  const cam = handheld(drift(u, d, { x: -20, y: 0, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.03 }), u, .5, 53);
  cam.zoom += push * .5; cam.x += push * 240; cam.y += push * 170; cam.focus = 1; cam.dof = 16;
  layer(ctx, cam, 2.2, g => workshopBack(g, u));
  layer(ctx, cam, 1, g => {
    const plane = Math.sin(u * 4.2) * (1 - P(u, 2.4, 2.7)), s = 1.5, G = 1100;
    contact(g, 900, 1100, 700, 30, .25, '90,40,20');
    figure(g, Object.assign(who('wykonawca', 'new'), { x: 700, y: G, s, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, face: { eyes: 'open', mouth: 'smile', lx: .12 },
      armR: { e: [40, 80], h: [95 + 40 * plane, 72] }, armL: { e: [30, 85], h: [-20 + 40 * plane, 86] } }));
    tableTop(g, 360, 1500, 780, 60, 40, N.wood, 360);
    softShadow(g, 10, 6, .25); fillRR(g, 740, 732, 360, 30, 4, '#EBC48F'); fillRR(g, 820 + 40 * plane, 704, 100, 34, 10, '#8E6AA8'); noShadow(g);
    const r = rng(3); for (let i = 0; i < 8; i++) { const ph = (u * 1.2 + r()) % 1; g.strokeStyle = '#F5D7A8'; g.lineWidth = 4; g.beginPath(); g.arc(940 + r() * 120 + ph * 80, 700 - ph * 120 + E.inQuad(ph) * 200, 10 + r() * 8, 0, Math.PI * 1.5); g.globalAlpha = 1 - ph; g.stroke(); } g.globalAlpha = 1;
    const v0 = cue('09A', 1), vib = P(u, v0, v0 + .1) * (1 - P(u, v0 + 1.5, v0 + 1.6)), jx = vib * Math.sin(u * 90) * 4;
    g.save(); g.translate(1230 + jx, 752); g.rotate(-.08); softShadow(g, 10, 6, .3); fillRR(g, -80, -14, 160, 28, 9, N.ink); noShadow(g); fillRR(g, -70, -10, 140, 18, 5, N.purple); g.restore();
    if (vib > 0) { glow(g, 1230, 752, 200, N.teal, .3 * vib, 'screen'); for (const sx of [-1, 1]) for (let k = 0; k < 2; k++) { g.strokeStyle = rgba(N.teal, .9 - k * .3); g.lineWidth = 6; g.beginPath(); g.arc(1230, 752, 100 + k * 32 + 6 * Math.sin(u * 20), sx > 0 ? -.5 : Math.PI - .5, sx > 0 ? .5 : Math.PI + .5); g.stroke(); } }
  });
  layer(ctx, cam, .5, g => { fillRR(g, -50, 860, 420, 60, 10, '#C98F5C'); fillRR(g, -50, 940, 380, 60, 10, '#B97F4E'); g.strokeStyle = '#7A4F8A'; g.lineWidth = 26; g.beginPath(); g.arc(1780, 980, 110, Math.PI, TAU); g.stroke(); });
  caption(ctx, u, d, { text: 'Kosztorys? *Gotowy, prosto z projektu.*', tag: 'WYKONAWCA', x: 150, y: 170, size: 56, style: 'new', t0: .3, t1: d - .7, maxW: 1000 });
};
function orderCard(g, x, y, w, u, tp) {
  card(g, x, y, w, 430, 30, '#fff', 1.3); g.strokeStyle = N.teal; g.lineWidth = 5; rr(g, x, y, w, 430, 30); g.stroke();
  txt(g, 'NOWE ZLECENIE', x + 40, y + 66, 24, 700, N.teal2, 'left', 3);
  txt(g, 'Zabudowa kuchni', x + 40, y + 132, 50, 800, N.ink);
  txt(g, 'Kosztorys gotowy – wg projektu', x + 40, y + 186, 28, 500, '#6A5470');
  txt(g, 'Start: 14 października', x + 40, y + 228, 28, 400, '#6A5470');
  const hit = P(u, tp, tp + .15), pulse = u > tp ? Math.max(0, Math.sin((u - tp) * 9)) * Math.exp(-(u - tp) * 2) : 0;
  g.save(); popScale(g, 1 + .07 * pulse, x + 170, y + 340);
  if (hit > 0) glow(g, x + 170, y + 340, 200, N.teal, .5 * hit, 'screen');
  pill(g, x + 40, y + 300, 260, 80, mix(N.purple, N.teal, hit), hit > .5 ? '✓ Akceptuj' : 'Akceptuj', 30, '#fff'); g.restore();
  pill(g, x + 320, y + 300, 230, 80, N.lav, 'Szczegóły', 30, N.purple);
}
SH['09B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 20, y: 0, zoom: 1.04 }), u, .4, 59);
  cam.focus = 1; cam.dof = 22;
  layer(ctx, cam, 1.6, g => {
    g.fillStyle = lin(g, 0, 0, 0, H, [[0, '#E9C08A'], [1, '#D19E62']]); g.fillRect(-400, -300, W + 800, H + 600);
    g.strokeStyle = 'rgba(140,90,40,.18)'; g.lineWidth = 4; for (let y = -200; y < H + 200; y += 64) { g.beginPath(); g.moveTo(-400, y); g.bezierCurveTo(500, y + 25, 1300, y - 25, W + 400, y + 10); g.stroke(); }
    rays(g, u, 1300, -200, 600, 1500, .5, '#FFF0D0', .2, 5, 13);
    device3D(g, 'ph09', 560, 1100, { cx: 760, cy: 640, s: .8, rx: .95, ry: 0, rz: -.35, fov: 1500, glare: false, shadowDy: 18, shadowDx: 14, shadowA: .35 }, (s, x, y, w, h) => { appBar(s, x, y, w, 100); s.fillStyle = '#F8F3F9'; s.fillRect(x, y + 100, w, h); fillRR(s, x + 30, y + 140, w - 60, 300, 24, '#fff'); });
    const r = rng(3); for (let i = 0; i < 12; i++) { g.strokeStyle = '#F5D7A8'; g.lineWidth = 5; g.beginPath(); g.arc(200 + r() * 1500, 700 + r() * 380, 14 + r() * 12, r() * 3, r() * 3 + 4); g.stroke(); }
  });
  layer(ctx, cam, .95, g => {
    const k = E.outBack(P(u, .1, .55)), tp = cue('09B', 0);
    g.save(); g.globalAlpha = clamp(k * 1.5); popScale(g, lerp(.5, 1, clamp(k)), 760, 640); g.translate(0, (1 - clamp(k)) * 200 + Math.sin(u * 1.5) * 6);
    orderCard(g, 1000, 230, 640, u, tp);
    g.restore();
    const fa = P(u, tp - .5, tp - .1) * (1 - P(u, tp + .5, tp + .8));
    if (fa > 0) { const fx = 1170, fy = 575; if (u > tp) { const rp = P(u, tp, tp + .6); g.globalAlpha = 1 - rp; ring(g, fx, fy, 30 + 120 * rp, 6, N.teal); g.globalAlpha = 1; }
      g.save(); g.globalAlpha = fa; g.translate(fx + 30, fy + 30 + (1 - fa) * 200); g.rotate(-.35); g.fillStyle = litFill(g, -48, 48, N.skin, -1); rr(g, -48, -10, 96, 300, 48); g.fill(); ell(g, 0, 18, 30, 22, 'rgba(255,255,255,.35)'); g.restore(); }
  });
  caption(ctx, u, d, { text: 'Zlecenia *przychodzą same.*', x: 150, y: 1000, size: 62, style: 'new', t0: .5 });
};
SH['09C'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 30, y: 0, zoom: 1.0 }, { x: -20, y: 0, zoom: 1.05 }), u, .5, 61);
  cam.focus = 1; cam.dof = 16;
  layer(ctx, cam, 2.2, g => {
    warmWall(g, '#F7DCC6', 900, '#E2BFA0');
    g.fillStyle = rad(g, 960, 300, 0, 1000, [[0, 'rgba(255,200,130,.35)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(-400, -300, W + 800, H + 600);
    fillRR(g, 182, 152, 296, 266, 8, '#C9A3C9');
    g.save(); rr(g, 200, 170, 260, 230, 3); g.clip(); g.fillStyle = lin(g, 0, 170, 0, 400, [[0, '#E98FA0'], [.6, '#FFB874'], [1, '#FFD9A0']]); g.fillRect(200, 170, 260, 230); circ(g, 330, 360, 46, '#FFE7B0'); glow(g, 330, 360, 160, '#FFC070', .7); treeLine(g, 410, '#B9667A', 2, 6); g.restore();
    line(g, 330, 170, 330, 400, 12, '#C9A3C9');
    clock(g, 1560, 290, 86, 7, 0, null, { face: '#fff', rim: N.purple, hand: N.ink });
    bokeh(g, u, 10, 71, ['#FFD38A', '#FFC978'], 600, 60, 1200, 160, 14, 30, .55);
  });
  layer(ctx, cam, 1, g => {
    const s = 1.45, G = 965, wave = Math.sin(u * 7);
    contact(g, 960, 905, 620, 40, .3, '90,40,20');
    figure(g, Object.assign(who('wykonawca', 'new', { noHat: true, hair: 'short' }), { x: 640, y: G, s, seated: true, cheeks: true, light: 1, rim: N.lamp, rimSide: 1, face: { eyes: 'happy', mouth: 'smile' } }));
    figure(g, Object.assign(who('partnerka', 'new'), { x: 1280, y: G, s, seated: true, cheeks: true, light: -1, rim: N.lamp, rimSide: -1, face: { eyes: 'open', mouth: 'smile', lx: -.12 } }));
    figure(g, Object.assign(who('dziecko', 'new'), { x: 960, y: G - 10, s: 1.0, seated: true, cheeks: true, rim: N.lamp, face: { eyes: 'happy', mouth: 'laugh' }, armR: { abs: [1040 + 14 * wave, 600 + 8 * Math.cos(u * 7)] } }));
    tableTop(g, 360, 1560, 820, 80, 70, N.wood);
    for (const x of [640, 960, 1280]) { ell(g, x, 790, 96, 22, '#fff'); ell(g, x, 786, 62, 13, ['#E3A43A', '#F2896B', '#9FD36B'][(x / 320 | 0) % 3]); for (let k = 0; k < 2; k++) { const ph = (u * .45 + k * .5 + x * .001) % 1; g.globalAlpha = .45 * Math.sin(Math.PI * ph); line(g, x + Math.sin(ph * 8) * 8, 770 - ph * 90, x + Math.sin(ph * 8 + 1) * 8, 752 - ph * 90, 4, '#fff'); } g.globalAlpha = 1; }
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rad(g, 960, 800, 0, 500, [[0, rgba(N.lamp, .3)], [1, 'rgba(0,0,0,0)']]); g.fillRect(400, 600, 1100, 400); g.restore();
    pendant(g, 960, -40, 230, N.ink, N.lamp, .2, u, 900);
  });
  layer(ctx, cam, .5, g => { g.fillStyle = 'rgba(255,255,255,.35)'; rr(g, 1660, 760, 110, 220, 20); g.fill(); fillRR(g, 1708, 980, 14, 140, 6, 'rgba(255,255,255,.35)'); fillRR(g, -80, 980, 420, 160, 30, '#B97F4E'); });
  caption(ctx, u, d, { text: 'A wieczór *znowu jest jego.*', x: 1060, y: 130, size: 56, style: 'new', align: 'center', t0: .4, maxW: 1000 });
};

/* ---------- 10: materiał na czas ---------- */
function sunriseBack(g, u) {
  g.fillStyle = lin(g, 0, -300, 0, 700, [[0, '#F4B7A0'], [.55, '#FFD6A5'], [1, '#FFF0D6']]); g.fillRect(-400, -300, W + 800, 1000);
  circ(g, 1500, 400, 90, '#FFF5DC'); glow(g, 1500, 400, 500, '#FFD38A', .9); glow(g, 1500, 400, 1200, '#FFB874', .35);
  clouds(g, u, 60, 6, 5, '#FFE3CF', .7, 1.1, 8);
  clouds(g, u, 200, 5, 9, '#F7C6B5', .6, .8, 12);
}
function siteNewMid(g) {
  g.fillStyle = lin(g, 0, 680, 0, H + 300, [[0, '#F0DCC0'], [1, '#D9BC98']]); g.fillRect(-400, 680, W + 800, H + 400);
  houseShell(g, 60, 720, 1.2, { wall: '#F6E4CC', line: '#E4CBAA', edge: '#FFF1DE', hole: '#B49274', door: '#A9876A', scaf: '#7A5A62' }, 1);
  contact(g, 360, 730, 420, 22, .25, '120,60,20');
}
function birds(g, u) { for (let i = 0; i < 4; i++) { const x = 300 + u * 110 + i * 80, y = 180 + i * 24 + Math.sin(u * 3 + i) * 8, f = Math.sin(u * 10 + i) * 10; g.strokeStyle = shade(N.ink, .2); g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 20, y - f); g.quadraticCurveTo(x - 9, y - 4, x, y); g.quadraticCurveTo(x + 9, y - 4, x + 20, y - f); g.stroke(); } }
/* ---------- 10A: dostawa — ciężarówka z HDS-em odkłada paletę (prawdziwa perspektywa 3D) ---------- */
const PJ = (X, Y, Z) => { const f = 1000 / Z; return [960 + X * f, 560 + (340 - Y) * f]; };
function box3(g, X0, X1, Y0, Y1, Z0, Z1, near, top, side) {
  if (top) poly(g, [PJ(X0, Y1, Z0), PJ(X1, Y1, Z0), PJ(X1, Y1, Z1), PJ(X0, Y1, Z1)], top);
  if (side && X1 < 0) poly(g, [PJ(X1, Y0, Z0), PJ(X1, Y0, Z1), PJ(X1, Y1, Z1), PJ(X1, Y1, Z0)], side);
  if (side && X0 > 0) poly(g, [PJ(X0, Y0, Z0), PJ(X0, Y0, Z1), PJ(X0, Y1, Z1), PJ(X0, Y1, Z0)], side);
  const a = PJ(X0, Y1, Z0), b = PJ(X1, Y0, Z0);
  if (near) { g.fillStyle = typeof near === 'function' ? near(a, b) : near; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
  return [a, b];
}
function brickPallet(g, X, Y, Z, sw = 0) {   // X, Z = środek palety, Y = spód
  const w = 115, dz = 80, Xc = X + sw;
  box3(g, Xc - w, Xc + w, Y, Y + 24, Z - dz, Z + dz, '#B98C55', '#D9AE74', '#9E7444');
  const [a, b] = box3(g, Xc - w + 6, Xc + w - 6, Y + 24, Y + 128, Z - dz + 6, Z + dz - 6, (a, b) => lin(g, a[0], 0, b[0], 0, [[0, '#E0855A'], [1, '#B95F3A']]), '#E99A70', '#A65233');
  g.strokeStyle = 'rgba(90,30,10,.35)'; g.lineWidth = 2;
  for (let r = 1; r < 4; r++) { const y = lerp(a[1], b[1], r / 4); g.beginPath(); g.moveTo(a[0], y); g.lineTo(b[0], y); g.stroke(); }
  for (let r = 0; r < 4; r++) for (let c = 1; c < 5; c++) { const x = lerp(a[0], b[0], (c - (r % 2) * .5) / 5), y0 = lerp(a[1], b[1], r / 4), y1 = lerp(a[1], b[1], (r + 1) / 4); if (x > a[0] && x < b[0]) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); } }
  // folia stretch: połysk
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = lin(g, a[0], a[1], b[0], b[1], [[0, 'rgba(255,255,255,0)'], [.4, 'rgba(255,255,255,.22)'], [.5, 'rgba(255,255,255,0)']]); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.restore();
  return { top: [Xc, Y + 128, Z], corners: [[Xc - w + 10, Y + 128, Z - dz + 10], [Xc + w - 10, Y + 128, Z - dz + 10], [Xc + w - 10, Y + 128, Z + dz - 10], [Xc - w + 10, Y + 128, Z + dz - 10]] };
}
function wheel(g, X, Z, r, rot) {
  const [cx, cy] = PJ(X, r, Z), R = r * 1000 / Z;
  circ(g, cx, cy, R, '#2A1530'); circ(g, cx, cy, R * .62, '#3E2A44');
  g.fillStyle = lin(g, cx - R, cy - R, cx + R, cy + R, [[0, '#E3DAE6'], [1, '#9F94A4']]); g.beginPath(); g.arc(cx, cy, R * .5, 0, TAU); g.fill();
  for (let k = 0; k < 5; k++) { const a = rot + k * TAU / 5; circ(g, cx + Math.cos(a) * R * .32, cy + Math.sin(a) * R * .32, R * .06, '#6E6274'); }
  circ(g, cx, cy, R * .14, '#5A4E60');
}
const TRUCK = { stop: 1.55, outrig: [1.9, 2.3], lift: [2.2, 2.75], slew: [2.75, 3.65], lower: [3.65, 4.3], land: 4.3 };
function hdsState(u, tx) {
  const Xb = tx - 470, Xt = 340, Zt = 780, Xc = tx - 215, Zc = 1000;
  const lift = E.inOutCubic(P(u, ...TRUCK.lift)), slew = E.inOutCubic(P(u, ...TRUCK.slew)), lower = E.inOutCubic(P(u, ...TRUCK.lower));
  // ścieżka palety: łuk wokół kolumny żurawia (obrót w stronę kamery)
  const a0 = Math.atan2(1000 - Zc, Xb - Xc), a1 = Math.atan2(Zt - Zc, Xt - Xc) + TAU, d0 = Math.hypot(Xb - Xc, 0), d1 = Math.hypot(Xt - Xc, Zt - Zc);
  const ang = lerp(a0 < 0 ? a0 + TAU : a0, a1, slew), dist = lerp(d0, d1, slew) + Math.sin(Math.PI * slew) * 40;
  let X = Xc + Math.cos(ang) * dist, Z = Zc + Math.sin(ang) * dist;
  let Y = 130 + 210 * lift - (130 + 210) * lower;
  if (u < TRUCK.lift[0]) { X = Xb; Z = 1000; Y = 130; }
  // wahadło: paleta zostaje w tyle przy obrocie i buja się po zatrzymaniu
  const ts = u - TRUCK.slew[0];
  let sw = 0; if (ts > 0) sw = -38 * Math.sin(Math.min(ts, .9) / .9 * Math.PI) * (u < TRUCK.slew[1] ? 1 : 0) + (u > TRUCK.slew[1] ? 26 * Math.sin((u - TRUCK.slew[1]) * 7) * Math.exp(-(u - TRUCK.slew[1]) * 3) : 0);
  if (u > TRUCK.land) sw = 0;
  const land = P(u, TRUCK.land, TRUCK.land + .12) * (1 - P(u, TRUCK.land + .12, TRUCK.land + .35));
  Y += -land * 6;
  const rise = E.inOutCubic(P(u, TRUCK.land + .2, 5));
  return { X, Y: Math.max(0, Y), Z, sw, Xc, Zc, rise, hook: [X + sw * .3, Y + 128 + 80 + rise * 140, Z] };
}
function hds(g, st, deploy) {
  const top = [st.Xc, 330, st.Zc], base = [st.Xc, 140, st.Zc];
  const T = [st.hook[0], st.hook[1] + 46, st.hook[2]];   // koniec wysięgnika nad hakiem
  const dx = T[0] - top[0], dz = T[2] - top[2], d = Math.hypot(dx, dz), dy = T[1] - top[1], D = Math.hypot(d, dy);
  const L1 = 270, L2 = Math.max(230, D - L1 + 20);
  const b = Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)), e1 = Math.atan2(dy, d) + b * deploy + (1 - deploy) * 1.2;
  const ux = dx / (d || 1), uz = dz / (d || 1);
  const K = [top[0] + ux * Math.cos(e1) * L1, top[1] + Math.sin(e1) * L1, top[2] + uz * Math.cos(e1) * L1];
  const tip = deploy < 1 ? [lerp(K[0], T[0], deploy), lerp(K[1] - 230, T[1], deploy), lerp(K[2], T[2], deploy)] : T;
  const seg = (A, B, w, col, hi) => { const a = PJ(...A), c = PJ(...B), f = 1000 / ((A[2] + B[2]) / 2); g.lineCap = 'round'; g.strokeStyle = col; g.lineWidth = w * f; g.beginPath(); g.moveTo(...a); g.lineTo(...c); g.stroke();
    if (hi) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = w * f * .25; g.beginPath(); g.moveTo(a[0], a[1] - w * f * .25); g.lineTo(c[0], c[1] - w * f * .25); g.stroke(); } };
  // kolumna z siłownikiem
  seg(base, top, 46, '#D88E26', true);
  seg(top, K, 34, '#F2A93B', true);
  const mid = [lerp(base[0], top[0], .4), lerp(base[1], top[1], .4), base[2]], kmid = [lerp(top[0], K[0], .55), lerp(top[1], K[1], .55), lerp(top[2], K[2], .55)];
  seg(mid, kmid, 12, '#8E959E', false);
  seg(K, tip, 26, '#F2A93B', true);
  const tele = [lerp(K[0], tip[0], .55), lerp(K[1], tip[1], .55), lerp(K[2], tip[2], .55)]; seg(tele, tip, 18, '#FFC45C', true);
  for (const P_ of [top, K]) { const [x, y] = PJ(...P_); circ(g, x, y, 14 * 1000 / P_[2], '#3B1442'); circ(g, x, y, 6 * 1000 / P_[2], '#BDB2C2'); }
  // lina i hak
  const hk = deploy < 1 ? [tip[0], tip[1] - 50, tip[2]] : st.hook, [hx, hy] = PJ(...hk), [tx_, ty_] = PJ(...tip);
  line(g, tx_, ty_, hx, hy, 3, '#2A1530'); g.strokeStyle = '#D6453A'; g.lineWidth = 7; g.beginPath(); g.arc(hx, hy + 10, 11, -.3, Math.PI * 1.2); g.stroke();
  return [hx, hy + 20];
}
SH['10A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: -70, y: 0, zoom: 1.0 }, { x: 50, y: -10, zoom: 1.06 }), u, .45, 67);
  cam.focus = 1; cam.dof = 14;
  const tx = lerp(-1750, 140, E.outCubic(P(u, 0, TRUCK.stop))), moving = 1 - P(u, TRUCK.stop - .3, TRUCK.stop);
  const pitch = -.018 * Math.sin(Math.PI * P(u, TRUCK.stop - .1, TRUCK.stop + .5)) * Math.exp(-P(u, TRUCK.stop, TRUCK.stop + .6) * 2);
  const st = hdsState(u, tx), deploy = E.inOutCubic(P(u, TRUCK.outrig[0], TRUCK.lift[0] + .1)), legs = E.inOutCubic(P(u, ...TRUCK.outrig));
  layer(ctx, cam, 7, g => sunriseBack(g, u));
  layer(ctx, cam, 3.2, g => { treeLine(g, 680, '#E8B89A', 2); fog(g, 520, 700, '#FFE9D2', 0, .8); birds(g, u); });
  layer(ctx, cam, 1.6, g => siteNewMid(g));
  layer(ctx, cam, 1, g => {
    // ślady opon i miejsce na paletę
    g.strokeStyle = 'rgba(150,110,70,.25)'; g.lineWidth = 10; for (const z of [905, 1095]) { const a = PJ(-1400, 0, z), b = PJ(400, 0, z); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    contact(g, ...PJ(340, 0, 780), 170, 26, .25 * (1 - P(u, TRUCK.land, TRUCK.land + .2)) + .2, '120,60,20');
    // pył spod kół podczas jazdy
    const r = rng(5); for (let i = 0; i < 18; i++) { const ph = (u * 1.4 + r()) % 1, [x, y] = PJ(tx - 650 - ph * 260 + r() * 60, 20 + ph * 60, 900 + r() * 40); g.globalAlpha = (1 - ph) * .4 * moving; circ(g, x, y, 18 + ph * 60, '#EBD5B6'); } g.globalAlpha = 1;
    contact(g, ...PJ(tx - 380, 0, 1000), 470, 30, .45, '80,40,20');
    // podpory (stabilizatory)
    const [ox, oy] = PJ(st.Xc, 70, 905), [ox2] = PJ(st.Xc, 70, lerp(905, 820, legs)), [, gy] = PJ(st.Xc, 0, lerp(905, 820, legs));
    g.save(); g.translate(...PJ(tx, 0, 1000)); g.rotate(pitch); g.translate(-PJ(tx, 0, 1000)[0], -PJ(tx, 0, 1000)[1]);
    // skrzynia z burtami
    box3(g, tx - 770, tx - 230, 95, 125, 900, 1100, (a, b) => lin(g, 0, a[1], 0, b[1], [[0, '#5B4A62'], [1, '#3B2B42']]), '#6E5C75', '#4A3A50');
    const pal = u < TRUCK.lift[0] ? null : 1;
    if (!pal) brickPallet(g, tx - 470, 125, 1000);
    box3(g, tx - 770, tx - 230, 125, 150, 900, 905, (a, b) => lin(g, 0, a[1], 0, b[1], [[0, '#E9E4EC'], [1, '#B9B0BE']]), null);
    for (let k = 0; k < 5; k++) { const [x0, y0] = PJ(tx - 770 + k * 135, 150, 900), [, y1] = PJ(0, 125, 900); line(g, x0, y0, x0, y1, 3, '#A49AA9'); }
    // rama i błotniki
    box3(g, tx - 790, tx - 10, 55, 95, 905, 1095, '#2A1530', null);
    for (const wx of [tx - 650, tx - 560]) { const [a, b] = [PJ(wx - 60, 110, 899), PJ(wx + 60, 80, 899)]; fillRR(g, a[0], a[1], b[0] - a[0], b[1] - a[1] + 6, [14, 14, 0, 0], '#3B2B42'); }
    // kabina
    box3(g, tx - 225, tx, 70, 300, 900, 1100, (a, b) => lin(g, a[0], 0, b[0], 0, [[0, '#86269A'], [1, N.purple2]]), '#9A3AAE');
    const [w0, w1] = [PJ(tx - 130, 280, 899), PJ(tx - 20, 200, 899)];
    g.fillStyle = lin(g, w0[0], w0[1], w1[0], w1[1], [[0, '#EAF8FB'], [.5, '#9DD8E4'], [1, '#6BB8CA']]); rr(g, w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1], 10); g.fill();
    g.save(); rr(g, w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1], 10); g.clip();   // kierowca w szybie
    circ(g, w0[0] + 52, w0[1] + 50, 26, '#F4C7A1'); g.fillStyle = '#3B1442'; g.beginPath(); g.arc(w0[0] + 52, w0[1] + 46, 27, Math.PI, TAU); g.fill(); fillRR(g, w0[0] + 20, w0[1] + 76, 64, 40, 14, '#E6A63C');
    g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(255,255,255,.35)'; poly(g, [[w0[0] + 10, w1[1]], [w0[0] + 40, w0[1]], [w0[0] + 60, w0[1]], [w0[0] + 30, w1[1]]]); g.fill(); g.restore();
    const dr = [PJ(tx - 215, 290, 899), PJ(tx - 25, 80, 899)]; g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; rr(g, dr[0][0], dr[0][1], dr[1][0] - dr[0][0], dr[1][1] - dr[0][1], 10); g.stroke();
    fillRR(g, PJ(tx - 200, 170, 899)[0], PJ(0, 170, 899)[1], 34, 9, 4, '#D9C9DE');
    logo(g, PJ(tx - 155, 120, 899)[0], PJ(0, 120, 899)[1], 24, N.teal, '#fff');
    fillRR(g, ...PJ(tx - 2, 270, 899), 14, 50, 4, '#2A1530');
    box3(g, tx - 20, tx + 25, 60, 100, 905, 1095, '#2A1530', '#3B2B42');
    const hl = PJ(tx + 10, 112, 899); fillRR(g, hl[0] - 14, hl[1] - 10, 22, 20, 5, '#FFF2C0'); glow(g, hl[0], hl[1], 90, '#FFE8A0', .5);
    for (let k = 0; k < 3; k++) circ(g, PJ(tx - 200 + k * 80, 302, 905)[0], PJ(0, 302, 905)[1], 5, '#FFB13B');
    // spaliny z komina
    const [ex, ey] = PJ(tx - 238, 330, 1000); fillRR(g, ex - 7, ey, 14, 90, 4, '#2A1530');
    for (let k = 0; k < 4; k++) { const ph = (u * .9 + k * .25) % 1; g.globalAlpha = .35 * (1 - ph) * (.4 + moving * .6); circ(g, ex - ph * 120 * (.3 + moving), ey - ph * 110, 12 + ph * 40, '#EEE4F0'); } g.globalAlpha = 1;
    g.restore();
    // koła (bez przechyłu)
    const rot = (tx / 46) % TAU; for (const wx of [tx - 650, tx - 560, tx - 110]) wheel(g, wx, 902, 46, rot);
    // podpory
    if (legs > 0) { line(g, ox, oy, ox2, PJ(st.Xc, 70, lerp(905, 820, legs))[1], 18 * 1.15, '#D88E26'); const [lx, ly] = PJ(st.Xc, 70, lerp(905, 820, legs)); line(g, lx, ly, lx, lerp(ly, gy, legs), 14, '#8E959E'); fillRR(g, lx - 26, gy - 6, 52, 12, 4, '#2A1530'); }
    // żuraw HDS z paletą
    const [hx, hy] = hds(g, st, deploy);
    if (pal) {
      const pl = brickPallet(g, st.X, st.Y, st.Z, st.sw), slack = st.rise > 0 ? 1 : 0;
      for (const c of pl.corners) { const [cx, cy] = PJ(...c); g.strokeStyle = slack ? `rgba(32,207,163,${1 - st.rise})` : N.teal; g.lineWidth = 4; g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx, cy); g.stroke(); }
    }
    // pył przy odłożeniu palety
    const dk = P(u, TRUCK.land, TRUCK.land + .7); if (dk > 0 && dk < 1) { const [px, py] = PJ(340, 0, 780); for (let i = 0; i < 10; i++) { const a = Math.PI + (i / 9) * Math.PI; g.globalAlpha = .45 * (1 - dk); circ(g, px + Math.cos(a) * 200 * (1 + dk), py + Math.sin(a) * 30 * dk, 20 + dk * 40, '#EBD5B6'); } g.globalAlpha = 1; }
    // pracownik naprowadza ładunek
    const wave = Math.sin(u * 6) * (P(u, 2.6, 2.8) - P(u, 4.3, 4.5));
    figure(g, Object.assign(who('ekipa', 'new'), { x: 1790, y: 1030, s: 1.05, cheeks: true, light: -1, rim: WARM_RIM, rimSide: -1, face: { eyes: 'open', mouth: 'smile', lx: -.15 },
      armR: { e: [40, 20], h: [30 + 20 * wave, -60 - 20 * wave] }, armL: { e: [20, 70], h: [0, 100] } }));
  });
  layer(ctx, cam, .5, g => { grass(g, -80, 1120, 30, 300, '#C9A86A', 4, u); grass(g, 1640, 1120, 22, 220, '#B99856', 7, u); });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const [k, r_, c] of [[.3, 60, '#FFD38A'], [.55, 30, '#F3A6C8'], [.8, 90, '#9FE6D2']]) { const fx = lerp(1500 - cam.x / 7, 960, k * 2), fy = lerp(400, 540, k * 2); ctx.globalAlpha = .16; circ(ctx, fx, fy, r_, c); } ctx.restore();
  timeBadge(ctx, 1600, 70, '06:55', rgba(N.purple, .92));
  caption(ctx, u, d, { text: 'Ekipa na placu. *Materiał też.*', x: 150, y: 200, size: 62, style: 'new', t0: .5, maxW: 1100 });
};
SH['10B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 40, y: 0, zoom: 1.0 }, { x: -20, y: 0, zoom: 1.04 }), u, .5, 71);
  cam.focus = 1; cam.dof = 15;
  layer(ctx, cam, 7, g => sunriseBack(g, u));
  layer(ctx, cam, 3.2, g => { treeLine(g, 680, '#E8B89A', 2); fog(g, 520, 700, '#FFE9D2', 0, .8); });
  layer(ctx, cam, 1.6, g => siteNewMid(g));
  layer(ctx, cam, 1, g => {
    contact(g, 885, 900, 200, 18, .3, '90,40,20'); pallet(g, 720, 900, 330, '#C9A36E'); bricksStack(g, 730, 868, 310, 3, '#D9784E', 1);
    const s = 1.15, G = 990;
    figure(g, Object.assign(who('wykonawca', 'new'), { x: 1140, y: G, s, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, face: { eyes: 'open', mouth: 'smile', ly: .05 }, armR: { e: [30, 80], h: [-6, 64], behind: holdPhone(N.ink, N.teal, .3) } }));
    [[1310, 0], [1460, 1]].forEach(([x, i]) => { const bob = Math.abs(Math.sin(u * 4 + i * 1.6)) * 6;
      figure(g, Object.assign(who('ekipa', 'new'), { x: x + Math.sin(u * 2 + i) * 6, y: G - bob, s, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, step: Math.sin(u * 8 + i) * 4, face: { eyes: 'open', mouth: 'smile' },
        armL: { e: [10, 70], h: [-40, 70] }, armR: { e: [10, 70], h: [-40, 70], hold: holdBrick } })); });
  });
  layer(ctx, cam, .85, g => {
    const ik = E.outBack(P(u, .1, .55));
    if (ik <= 0) return;
    g.save(); g.globalAlpha = clamp(ik); popScale(g, lerp(.6, 1, clamp(ik)), 1640, 520);
    card(g, 1450, 220, 400, 300, 30, '#fff', 1.3);
    g.save(); rr(g, 1450, 220, 400, 300, 30); g.clip(); appBar(g, 1450, 220, 400, 70); g.restore();
    check(g, 1505, 350, 30, E.outBack(P(u, cue('10B', 0), cue('10B', 0) + .35)));
    txt(g, 'Dostawa', 1552, 344, 34, 800, N.ink); txt(g, 'dostarczona 06:58', 1552, 378, 22, 500, '#6A5470');
    fillRR(g, 1490, 412, 320, 18, 9, N.teal); txt(g, 'Dziś: ściany parteru', 1490, 476, 24, 600, '#6A5470');
    g.restore();
  });
  layer(ctx, cam, .5, g => grass(g, -80, 1120, 30, 300, '#C9A86A', 4, u));
  timeBadge(ctx, 120, 70, '07:00', rgba(N.purple, .92));
  caption(ctx, u, d, { text: 'Bo każdy wie, *kiedy będzie potrzebny.*', x: 150, y: 1000, size: 54, style: 'new', t0: .6, maxW: 1100 });
};

/* ---------- 11: hurtownia — gotowe zamówienie ---------- */
const NEW_SHOP = { ceil: '#FFF4EA', floor: '#F0DCC8', back: '#FBE9DA', shelf: '#C9A3C9', box: ['#4CC8A8', '#8E4C9C', '#E9DDF0', '#D69A4A', '#BFA2C6', '#F1E3F4', '#F2896B'] };
SH['11A'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.02 }, { x: 20, y: 0, zoom: 1.0 }), u, .4, 73);
  cam.zoom -= E.inOutCubic(P(u, d - .7, d)) * .08; cam.focus = 1; cam.dof = 22;
  layer(ctx, cam, 3, g => aisle(g, u, NEW_SHOP, '#FFF3D6', N.purple, 1));
  layer(ctx, cam, 1.05, g => {
    g.fillStyle = lin(g, 0, 860, 0, H, [[0, '#7E1C8C'], [1, N.purple2]]); g.fillRect(-300, 880, W + 600, 400); g.fillStyle = '#8E2C9C'; g.fillRect(-300, 860, W + 600, 24);
    poly(g, [[540, 860], [660, 860], [680, 760], [520, 760]], N.ink);
    device3D(g, 'mon11', 1000, 640, { cx: 600, cy: 470, s: .85, ry: .38, rx: 0, r: 22, bezel: 18, glarePos: .25 + u * .05, shadowA: .3 }, (s, x, y, w, h) => {
      appBar(s, x, y, w, 80, 'Panel hurtowni'); s.fillStyle = '#F8F3F9'; s.fillRect(x, y + 80, w, h - 80);
      for (let i = 0; i < 4; i++) fillRR(s, x + 40, y + 120 + i * 100, w - 80, 76, 14, '#fff');
    });
  });
  layer(ctx, cam, .85, g => {
    const k = E.outBack(P(u, cue('11A', 0) - .1, cue('11A', 0) + .4)); if (k <= 0) return;
    const X = 900, Y = 150, Wd = 860;
    g.save(); g.globalAlpha = clamp(k * 1.5); popScale(g, lerp(.4, 1, clamp(k)), 620, 470);
    card(g, X, Y, Wd, 700, 30, '#fff', 1.4); g.strokeStyle = N.teal; g.lineWidth = 5; rr(g, X, Y, Wd, 700, 30); g.stroke();
    txt(g, 'NOWE ZAMÓWIENIE – KOMPLETNE', X + 50, Y + 80, 34, 800, N.teal2, 'left', 1);
    [['Pustak ceramiczny 25', '1 240 szt.'], ['Cement 32,5R', '40 worków'], ['Stal żebrowana ø12', '0,8 t'], ['Wełna mineralna 15 cm', '96 m²']].forEach(([a, b], i) => {
      const rk = E.outCubic(P(u, .7 + i * .16, 1.0 + i * .16)); g.save(); g.globalAlpha *= rk; g.translate((1 - rk) * 40, 0);
      const yy = Y + 170 + i * 82; txt(g, a, X + 50, yy, 32, 500, N.ink); txt(g, b, X + Wd - 50, yy, 32, 800, N.ink, 'right'); line(g, X + 50, yy + 28, X + Wd - 50, yy + 28, 2, '#EFE6F1'); g.restore();
    });
    g.globalAlpha *= P(u, 1.5, 1.8); txt(g, 'Dostawa: pon., 06:55 · plac budowy', X + 50, Y + 560, 27, 500, '#7A6680');
    const ck = P(u, cue('11A', 1), cue('11A', 1) + .2);
    if (ck > 0) glow(g, X + Wd - 190, Y + 620, 220, N.teal, .45 * ck, 'screen');
    pill(g, X + Wd - 350, Y + 580, 300, 84, mix(N.purple, N.teal, ck), ck > .5 ? '✓ Potwierdzone' : 'Potwierdź', 30, '#fff');
    g.restore();
    const cp = E.inOutCubic(P(u, 1.7, cue('11A', 1) - .05)), cx = lerp(1700, X + Wd - 200, cp), cy = lerp(1000, Y + 630, cp);
    if (u > 1.5 && u < d - .1) { const press = u > cue('11A', 1) && u < cue('11A', 1) + .15 ? .85 : 1; g.save(); g.translate(cx, cy); g.scale(press * 1.3, press * 1.3); softShadow(g, 10, 6, .3); poly(g, [[0, 0], [0, 46], [12, 35], [21, 54], [29, 50], [20, 32], [36, 32]], '#2A0F30'); noShadow(g); g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.restore(); }
  });
  caption(ctx, u, d, { text: 'Zamówienie przychodzi *gotowe.*', tag: 'HURTOWNIA', x: 150, y: 1020, size: 56, style: 'light', t0: .6, maxW: 1100 });
};
SH['11B'] = (ctx, u, d) => {
  const cam = handheld(drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: -20, y: 0, zoom: 1.05 }), u, .4, 79);
  cam.focus = 1; cam.dof = 14;
  layer(ctx, cam, 2.4, g => { aisle(g, u, NEW_SHOP, '#FFF3D6', N.purple, 1); rays(g, u, 700, -300, 600, 1300, .15, '#FFF0D0', .2, 4, 17); dust(g, u, 500, 0, 900, 800, 50, 19, '#FFF3D6', .5, 2.2); });
  layer(ctx, cam, 1.4, g => {
    const fx = lerp(1700, 1380, E.inOutCubic(P(u, 0, 1.6))), lift = E.inOutCubic(P(u, 1.4, 2.4)) * 40;
    g.save(); g.translate(fx, 0); contact(g, 100, 945, 260, 18, .35, '90,40,20');
    g.fillStyle = litFill(g, 40, 250, '#E3A43A', -1); rr(g, 40, 820, 210, 110, 14); g.fill();
    g.strokeStyle = '#E3A43A'; g.lineWidth = 10; rr(g, 110, 700, 110, 120, 10); g.stroke(); g.fillStyle = 'rgba(220,240,250,.35)'; g.fillRect(115, 705, 100, 110);
    line(g, 20, 660, 20, 940, 10, N.ink); g.fillStyle = N.ink; g.fillRect(-140, 905 - lift, 160, 12);
    pallet(g, -150, 905 - lift, 160, '#C9A36E'); bricksStack(g, -150, 873 - lift, 160, 3);
    for (const wx of [90, 210]) { circ(g, wx, 940, 32, '#2A1530'); circ(g, wx, 940, 12, '#C9BCCC'); }
    g.restore();
  });
  layer(ctx, cam, 1, g => {
    figure(g, Object.assign(who('sprzedawca', 'new'), { x: 760, y: 975, s: 1.55, cheeks: true, light: 1, rim: WARM_RIM, rimSide: 1, face: { eyes: 'open', mouth: 'smile' } }));
    g.fillStyle = lin(g, 0, 760, 0, H, [[0, '#7E1C8C'], [1, N.purple2]]); g.fillRect(140, 776, 1040, 400);
    g.fillStyle = '#8E2C9C'; g.fillRect(120, 740, 1080, 36);
    device3D(g, 'mon11b', 300, 210, { cx: 1000, cy: 660, s: 1, ry: -.35, r: 12, bezel: 9, shadowA: .25, shadowBlur: 20, glare: false }, (s, x, y, w, h) => { appBar(s, x, y, w, 34, null, 14); s.fillStyle = '#F8F3F9'; s.fillRect(x, y + 34, w, h); check(s, x + w / 2, y + 100, 34); });
    glow(g, 1000, 660, 200, N.teal, .25, 'screen');
  });
  layer(ctx, cam, .5, g => { fillRR(g, -80, 880, 330, 300, 12, '#4CC8A8'); fillRR(g, 1720, 900, 300, 300, 12, '#E9DDF0'); });
  caption(ctx, u, d, { text: 'Bo wszystko *policzono wcześniej.*', x: 150, y: 190, size: 56, style: 'new', t0: .4, maxW: 1000 });
};

/* ---------- 12: wszyscy w jednym miejscu ---------- */
const NEW_PANELS = t => [['07A', 2.0 + t * .3], ['09A', .6 + t * .4], ['10B', 2.2 + t * .5], ['11B', 1.6 + t * .5]];
const PHONES = [[1170, 680], [1230, 752], [1150, 880], [1000, 660]];
function warmSpace(g, u) { g.fillStyle = rad(g, 960, 540, 100, 1300, [[0, '#FFF6EC'], [1, '#F2D9C4']]); g.fillRect(-300, -300, W + 600, H + 600); bokeh(g, u, 16, 81, ['#FFD38A', '#F3C6E8', '#BFF0E2'], 0, 0, W, H, 30, 90, .5); }
function netPoints(cam, k = .82) {
  return PANELS.map((p, i) => { const z = 1 + i * .05, o = { cx: (p.cx - cam.x / z - W / 2) * cam.zoom + W / 2, cy: (p.cy - cam.y / z - H / 2) * cam.zoom + H / 2, ry: p.ry, rx: p.rx, s: k * cam.zoom, fov: 1600 };
    return proj(PHONES[i][0] / 2 - 480, PHONES[i][1] / 2 - 270, o); });
}
SH['12A'] = (ctx, u, d) => {
  const cam = drift(u, d, { x: 0, y: 0, zoom: 1.0 }, { x: 0, y: 0, zoom: 1.04 });
  warmSpace(ctx, u);
  panels(ctx, NEW_PANELS(u), u, cam, [0, .08, .16, .24]);
  const pts = netPoints(cam), hub = [960, 545];
  ctx.save();
  pts.forEach((p, i) => {
    const t0 = cue('12A', i), k = E.inOutCubic(P(u, t0 - .25, t0 + .35)); if (k <= 0) return;
    const cp = [lerp(p[0], hub[0], .5) + (i % 2 ? -140 : 140), lerp(p[1], hub[1], .5)];
    const at = t => [(1 - t) * (1 - t) * p[0] + 2 * (1 - t) * t * cp[0] + t * t * hub[0], (1 - t) * (1 - t) * p[1] + 2 * (1 - t) * t * cp[1] + t * t * hub[1]];
    for (const [lw, col, op] of [[22, rgba(N.teal, .25), 'lighter'], [8, N.teal, 'source-over']]) { ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (let j = 1; j <= 40 * k; j++) { const q = at(j / 40); ctx.lineTo(q[0], q[1]); } ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    if (k >= 1) { const ph = (u * .9 + i * .25) % 1, q = at(ph); glow(ctx, q[0], q[1], 40, '#ffffff', .8); }
    const nk = E.outBack(P(u, t0 - .25, t0 + .05)); circ(ctx, p[0], p[1], 24 * nk, '#fff'); ring(ctx, p[0], p[1], 24 * nk, 8, N.teal); glow(ctx, p[0], p[1], 80 * nk, N.teal, .4);
  });
  ctx.restore();
  const hk = E.outBack(P(u, .9, 1.5));
  if (hk > 0) { glow(ctx, hub[0], hub[1], 220 * hk, N.teal, .5); circ(ctx, hub[0], hub[1], 70 * hk, N.purple); ring(ctx, hub[0], hub[1], 70 * hk, 9, N.teal); tri(ctx, hub[0], hub[1] + 5, 32 * hk, N.teal, .18); }
  caption(ctx, u, d, { text: 'Inwestor. Wykonawca. Hurtownia. *W jednym miejscu.*', x: 960, y: 1050, size: 46, style: 'new', align: 'center', t0: 1.3, maxW: 1600, scrim: .8 });
};
function purpleSpace(g, u) {
  g.fillStyle = rad(g, 960, 480, 100, 1300, [[0, '#8A1E99'], [1, '#3E0747']]); g.fillRect(-300, -300, W + 600, H + 600);
  // podłoga z siatką w perspektywie
  g.save(); g.strokeStyle = 'rgba(255,255,255,.09)'; g.lineWidth = 2; const hy = 700;
  for (let i = -20; i <= 20; i++) { g.beginPath(); g.moveTo(960 + i * 40, hy); g.lineTo(960 + i * 260, H + 100); g.stroke(); }
  for (let k = 0; k < 14; k++) { const y = hy + Math.pow((k + (u * .6) % 1) / 14, 2) * 500; g.beginPath(); g.moveTo(-300, y); g.lineTo(W + 300, y); g.stroke(); }
  g.fillStyle = lin(g, 0, hy - 60, 0, hy + 120, [[0, 'rgba(62,7,71,0)'], [.5, 'rgba(62,7,71,.6)'], [1, 'rgba(62,7,71,0)']]); g.fillRect(-300, hy - 60, W + 600, 180);
  g.restore();
}
SH['12B'] = (ctx, u, d) => {
  const sh = E.inOutCubic(P(u, 0, .75)), col = E.inOutCubic(P(u, .75, 1.45));
  purpleSpace(ctx, u);
  const hub = [960, 540];
  const nodes = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * TAU / 10 + .3, z = .7 + (i % 3) * .35; return { x: hub[0] + Math.cos(a) * 470 * z, y: hub[1] + Math.sin(a) * 340 * z, z }; });
  if (sh < 1) {   // kafelki z 12A odlatują i maleją do węzłów
    const cam = { x: 0, y: 0, zoom: 1.04 };
    ctx.save(); ctx.globalAlpha = 1 - sh;
    NEW_PANELS(SHOT['12A'].design + u).forEach(([id, uu], i) => { const p = PANELS[i], n = nodes[[9, 2, 6, 4][i]];
      const o = { cx: lerp(p.cx, n.x, sh), cy: lerp(p.cy, n.y, sh), ry: p.ry, rx: p.rx, s: lerp(.85, .05, sh), fov: 1600 }; panelShot(ctx, 'pan' + i, id, uu, o); });
    ctx.restore();
  }
  const R = 1 - col;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  nodes.forEach(n => { const nx = lerp(hub[0], n.x, R), ny = lerp(hub[1], n.y, R); ctx.strokeStyle = rgba(N.teal, .5 * sh * (1 - col)); ctx.lineWidth = 4 * n.z; ctx.beginPath(); ctx.moveTo(hub[0], hub[1]); ctx.lineTo(nx, ny); ctx.stroke(); });
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j += 3) { const a = nodes[i], b = nodes[j]; ctx.strokeStyle = rgba('#ffffff', .12 * sh * (1 - col)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lerp(hub[0], a.x, R), lerp(hub[1], a.y, R)); ctx.lineTo(lerp(hub[0], b.x, R), lerp(hub[1], b.y, R)); ctx.stroke(); }
  ctx.restore();
  nodes.forEach((n, i) => { const nx = lerp(hub[0], n.x, R), ny = lerp(hub[1], n.y, R), k = sh * (1 - E.inQuad(col));
    if (i % 2) { glow(ctx, nx, ny, 60 * n.z * k, N.teal, .6); circ(ctx, nx, ny, 14 * n.z * k, N.teal); }
    else { circ(ctx, nx, ny, 34 * n.z * k, '#fff'); fillRR(ctx, nx - 10 * n.z * k, ny - 17 * n.z * k, 20 * n.z * k, 34 * n.z * k, 5 * n.z * k, N.ink); } });
  dust(ctx, u, 0, 0, W, H, 60, 91, '#ffffff', .4, 2.2);
  const hr = lerp(110, 0, col); glow(ctx, hub[0], hub[1], 300 * (1 - col) + 100, N.teal, .5);
  circ(ctx, hub[0], hub[1], hr, N.purple); ring(ctx, hub[0], hub[1], hr, 9 * (1 - col), N.teal);
  const flash = P(u, 1.3, 1.45) * (1 - P(u, 1.45, 2.0));
  const wk = E.outCubic(P(u, 1.35, d));
  if (wk <= 0) tri(ctx, hub[0], hub[1] + 6, 52, N.teal, .18);
  else { glow(ctx, 960, 540, 700, N.teal, .25 * wk); logo(ctx, 960, 540, lerp(80, 120, wk), N.teal, rgba('#ffffff', wk)); }
  if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * .5})`; ctx.fillRect(0, 0, W, H); }
};
SH['12C'] = (ctx, u, d) => {
  purpleSpace(ctx, u + SHOT['12B'].design);
  dust(ctx, u, 0, 0, W, H, 60, 91, '#ffffff', .4, 2.2);
  const up = E.inOutCubic(P(u, 0, .7));
  glow(ctx, 960, lerp(540, 380, up), 800, N.teal, .25);
  logo(ctx, 960, lerp(540, 380, up), 120, N.teal, '#fff');
  caption(ctx, u, d, { text: 'Nie czekaj. *Zapisz się już dziś.*', x: 960, y: 590, size: 64, style: 'light', align: 'center', t0: .35, out: false, maxW: 1700 });
  const b = E.outBack(P(u, .8, 1.3));
  if (b > 0) { const pulse = 1 + .03 * Math.sin(Math.max(0, u - 1.3) * 3.2);
    ctx.save(); popScale(ctx, b * pulse, 960, 720); glow(ctx, 960, 720, 360, N.teal, .35 * (.6 + .4 * Math.sin(u * 3.2)));
    softShadow(ctx, 40, 16, .35, '20,0,30'); pill(ctx, 740, 672, 440, 96, N.teal, 'budoexpert.pl', 46, N.purple, 700); noShadow(ctx); ctx.restore(); }
};
