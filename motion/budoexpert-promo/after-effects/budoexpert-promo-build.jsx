// ============================================================================
//  budoexpert - PROMO 26 s - builder projektu After Effects
//
//  Jak uzyc:  After Effects > Plik > Skrypty > Uruchom plik skryptu...
//             (File > Scripts > Run Script File...) i wskaz ten plik.
//  Skrypt buduje caly projekt z natywnych warstw (ksztalty, teksty, klatki
//  kluczowe, prekompozycje scen, muzyka) i zapisuje go obok siebie jako
//  budoexpert-promo.aep.
//
//  Wymaga: After Effects 2022+ oraz zainstalowanego fontu Poppins
//  (Regular, Medium, SemiBold, Bold, ExtraBold, Black).
//
//  Plik jest czystym ASCII (polskie znaki zapisane jako \u-escape),
//  wiec AE wczyta go poprawnie niezaleznie od kodowania systemu.
// ============================================================================
(function () {
  var W = 1920, H = 1080, FPS = 60, DUR = 26;
  var MAIN = "00_MAIN_budoexpert";
  var HERE = new File($.fileName).parent;

  // Kolory marki (z logo). Po zbudowaniu zmieniasz je w jednym miejscu:
  // warstwa KONTROLA_MARKI w kompozycji 00_MAIN_budoexpert (efekty Color Control).
  var PAL = {
    paper:   [255, 255, 255],
    grid:    [239, 231, 242],
    grid2:   [226, 211, 232],
    sketch:  [183, 159, 194],
    ink:     [42, 15, 48],
    purple:  [108, 12, 121],
    purple2: [82, 10, 92],
    teal:    [32, 207, 163],
    teal2:   [23, 168, 132],
    white:   [255, 255, 255],
    lilac:   [197, 139, 208]
  };
  var CTRL = {
    paper: "Papier", grid: "Siatka", grid2: "Siatka mocna", sketch: "Olowek", ink: "Atrament",
    purple: "Fiolet", purple2: "Fiolet ciemny", teal: "Turkus", teal2: "Turkus ciemny", white: "Bialy", lilac: "Liliowy"
  };
  var CTRL_ORDER = ["purple", "purple2", "teal", "teal2", "ink", "paper", "white", "sketch", "grid", "grid2", "lilac"];
  var F = { r: "Poppins-Regular", m: "Poppins-Medium", sb: "Poppins-SemiBold", b: "Poppins-Bold", eb: "Poppins-ExtraBold", bl: "Poppins-Black" };

  var ERR = [];
  function safe(label, fn) {
    try { fn(); } catch (e) { ERR.push(label + ": " + e.toString() + (e.line ? " (linia " + e.line + ")" : "")); }
  }

  // ------------------------------------------------------------------ utils
  function c01(k) { var c = PAL[k]; return [c[0] / 255, c[1] / 255, c[2] / 255, 1]; }
  function rgb(k) { var c = c01(k); return [c[0], c[1], c[2]]; }
  function colExpr(k) { return 'comp("' + MAIN + '").layer("KONTROLA_MARKI").effect("' + CTRL[k] + '")(1)'; }
  function link(prop, k) { prop.setValue(c01(k)); try { prop.expression = colExpr(k); } catch (e) {} }
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }

  // Easing: tag on a key describes the move INTO that key.
  var EASE = { out: [10, 88], "in": [88, 10], inout: [72, 72], expo: [92, 92], soft: [33, 33], snap: [4, 96] };
  function nEase(p) {
    var t = p.propertyValueType;
    if (t == PropertyValueType.TwoD) return 2;
    if (t == PropertyValueType.ThreeD) return 3;
    return 1;
  }
  function eases(n, inf) { var a = []; for (var i = 0; i < n; i++) a.push(new KeyframeEase(0, inf)); return a; }
  function anim(p, keys) {
    var i, idx = [];
    for (i = 0; i < keys.length; i++) {
      var v = keys[i][1];
      if (nEase(p) == 3 && v instanceof Array && v.length == 2) v = [v[0], v[1], 100];
      p.setValueAtTime(keys[i][0], v);
    }
    for (i = 0; i < keys.length; i++) idx.push(p.nearestKeyIndex(keys[i][0]));
    var n = nEase(p);
    for (i = 0; i < keys.length; i++) {
      var tIn = keys[i][2] || "soft", tOut = (i + 1 < keys.length) ? (keys[i + 1][2] || "soft") : "soft";
      try {
        if (tIn != "lin" || tOut != "lin") {
          var inf = tIn == "lin" ? 16.7 : EASE[tIn][1], outf = tOut == "lin" ? 16.7 : EASE[tOut][0];
          p.setTemporalEaseAtKey(idx[i], eases(n, inf), eases(n, outf));
        }
        if (tIn == "lin" || tOut == "lin") {
          p.setInterpolationTypeAtKey(idx[i],
            tIn == "lin" ? KeyframeInterpolationType.LINEAR : KeyframeInterpolationType.BEZIER,
            tOut == "lin" ? KeyframeInterpolationType.LINEAR : KeyframeInterpolationType.BEZIER);
        }
      } catch (e) {}
    }
  }
  // spring-like overshoot helper: returns keys for 0 -> over -> under -> 1 (values interpolated)
  function springKeys(t0, dur, a, b, over) {
    over = over || 0.12;
    function mix(f) {
      if (a instanceof Array) { var r = []; for (var i = 0; i < a.length; i++) r.push(b[i] + (b[i] - a[i]) * f); return r; }
      return b + (b - a) * f;
    }
    return [[t0, a], [t0 + dur * 0.45, mix(over), "out"], [t0 + dur * 0.72, mix(-over * 0.35), "inout"], [t0 + dur, b, "inout"]];
  }
  // parent without compensation: children are authored in the parent's rest space
  function parentTo(child, par) { try { child.setParentWithJump(par); } catch (e) { parentTo(child, par); } }

  // ------------------------------------------------------------------ shapes
  function shapeLayer(comp, name, pos) {
    var l = comp.layers.addShape();
    l.name = name;
    l.transform.anchorPoint.setValue([0, 0]);
    l.transform.position.setValue(pos || [0, 0]);
    return l;
  }
  function root(l) { return l.property("ADBE Root Vectors Group"); }
  function newGroup(l, name) { var g = root(l).addProperty("ADBE Vector Group"); g.name = name; }
  function inner(l, name) { return root(l).property(name).property("ADBE Vectors Group"); }
  function gx(l, name) { return root(l).property(name).property("ADBE Vector Transform Group"); }
  function shp(v, closed, it, ot) {
    var s = new Shape(); s.vertices = v; s.closed = !!closed;
    if (it) s.inTangents = it;
    if (ot) s.outTangents = ot;
    return s;
  }
  function addPath(vg, s) { vg.addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(s); }
  function addEllipse(vg, size, pos) {
    var e = vg.addProperty("ADBE Vector Shape - Ellipse");
    e.property("ADBE Vector Ellipse Size").setValue(size);
    if (pos) e.property("ADBE Vector Ellipse Position").setValue(pos);
  }
  function addRect(vg, size, pos, round) {
    var r = vg.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue(size);
    if (pos) r.property("ADBE Vector Rect Position").setValue(pos);
    if (round) r.property("ADBE Vector Rect Roundness").setValue(round);
  }
  function addFill(vg, k, opacity) {
    vg.addProperty("ADBE Vector Graphic - Fill");
    var f = vg.property(vg.numProperties);
    link(f.property("ADBE Vector Fill Color"), k);
    if (opacity != null) f.property("ADBE Vector Fill Opacity").setValue(opacity);
  }
  function addStroke(vg, k, w, o) {
    o = o || {};
    vg.addProperty("ADBE Vector Graphic - Stroke");
    if (o.dash) {
      vg.property(vg.numProperties).property("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
      vg.property(vg.numProperties).property("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
      vg.property(vg.numProperties).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Dash 1").setValue(o.dash[0]);
      vg.property(vg.numProperties).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Gap 1").setValue(o.dash[1]);
    }
    var s = vg.property(vg.numProperties);
    link(s.property("ADBE Vector Stroke Color"), k);
    s.property("ADBE Vector Stroke Width").setValue(w);
    s.property("ADBE Vector Stroke Line Cap").setValue(2);
    s.property("ADBE Vector Stroke Line Join").setValue(2);
    if (o.opacity != null) s.property("ADBE Vector Stroke Opacity").setValue(o.opacity);
  }
  function addTrim(vg, sequential) {
    vg.addProperty("ADBE Vector Filter - Trim");
    if (sequential) vg.property(vg.numProperties).property("ADBE Vector Trim Type").setValue(2);
  }
  function trimEnd(vg) { return vg.property("ADBE Vector Filter - Trim").property("ADBE Vector Trim End"); }
  function addRepeater(vg, copies, pos, rot) {
    vg.addProperty("ADBE Vector Filter - Repeater");
    var r = vg.property(vg.numProperties);
    r.property("ADBE Vector Repeater Copies").setValue(copies);
    var tr = r.property("ADBE Vector Repeater Transform");
    tr.property("ADBE Vector Repeater Position").setValue(pos || [0, 0]);
    if (rot != null) tr.property("ADBE Vector Repeater Rotation").setValue(rot);
  }
  function line(x1, y1, x2, y2) { return shp([[x1, y1], [x2, y2]], false); }
  function polyline(pts, closed) { return shp(pts, closed); }
  function rectPath(x, y, w, h) { return shp([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true); }
  function arcShape(cx, cy, r, a0, a1) {
    var n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2) - 1e-6)), st = (a1 - a0) / n, k = 4 / 3 * Math.tan(st / 4) * r;
    var v = [], it = [], ot = [];
    for (var i = 0; i <= n; i++) {
      var a = a0 + st * i, c = Math.cos(a), s = Math.sin(a);
      v.push([cx + c * r, cy + s * r]); it.push([k * s, -k * c]); ot.push([-k * s, k * c]);
    }
    return shp(v, false, it, ot);
  }
  // one sketch stroke = its own group with path + trim + stroke, so it can be drawn on independently
  function sketchGroup(l, name, s, k, w, t0, t1, o) {
    o = o || {};
    newGroup(l, name);
    addPath(inner(l, name), s);
    addTrim(inner(l, name), false);
    addStroke(inner(l, name), k, w, o);
    if (t0 != null) anim(trimEnd(inner(l, name)), [[t0, 0], [t1, 100, o.ease || "inout"]]);
  }

  // ------------------------------------------------------------------ text
  function tdoc(l) { return l.property("ADBE Text Properties").property("ADBE Text Document"); }
  function textLayer(comp, str, font, size, k, x, y, just, o) {
    o = o || {};
    var l = comp.layers.addText(str);
    var tp = tdoc(l), d = tp.value;
    try { d.resetCharStyle(); } catch (e) {}
    d.font = font; d.fontSize = size;
    if (o.outline) { d.applyFill = false; d.applyStroke = true; d.strokeColor = rgb(k); d.strokeWidth = o.outline; d.strokeOverFill = true; }
    else { d.applyStroke = false; d.applyFill = true; d.fillColor = rgb(k); }
    d.tracking = o.tracking || 0;
    d.justification = just == "c" ? ParagraphJustification.CENTER_JUSTIFY : (just == "r" ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY);
    tp.setValue(d);
    l.transform.position.setValue([x, y]);
    l.name = o.name || str;
    if (!o.outline && !o.noLink) linkTextColor(l, k);
    return l;
  }
  function setFontSize(l, size) { var tp = tdoc(l), d = tp.value; d.fontSize = size; tp.setValue(d); }
  function rect(l) { return l.sourceRectAtTime(l.inPoint, false); }
  function textWidth(comp, str, font, size, tracking) {
    var l = textLayer(comp, str, font, size, "ink", 0, 0, "l", { noLink: true, tracking: tracking });
    var w = rect(l).width; l.remove(); return w;
  }
  function animators(l) { return l.property("ADBE Text Properties").property("ADBE Text Animators"); }
  // text animator driven by an Expression Selector: amount 100 = fully "off", 0 = at rest
  function textAnimator(l, name, props, amountExpr) {
    animators(l).addProperty("ADBE Text Animator").name = name;
    function ap() { return animators(l).property(name).property("ADBE Text Animator Properties"); }
    if (props.pos) { ap().addProperty("ADBE Text Position 3D"); ap().property("ADBE Text Position 3D").setValue([props.pos[0], props.pos[1], 0]); }
    if (props.scale) { ap().addProperty("ADBE Text Scale 3D"); ap().property("ADBE Text Scale 3D").setValue([props.scale[0], props.scale[1], 100]); }
    if (props.rot != null) { ap().addProperty("ADBE Text Rotation"); ap().property("ADBE Text Rotation").setValue(props.rot); }
    if (props.opacity != null) { ap().addProperty("ADBE Text Opacity"); ap().property("ADBE Text Opacity").setValue(props.opacity); }
    if (props.fill) { ap().addProperty("ADBE Text Fill Color"); ap().property("ADBE Text Fill Color").expression = colExpr(props.fill); }
    if (amountExpr) {
      animators(l).property(name).property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
      animators(l).property(name).property("ADBE Text Selectors").property(1).property("ADBE Text Expressible Amount").expression = amountExpr;
    }
  }
  function linkTextColor(l, k) { try { textAnimator(l, "Kolor marki", { fill: k }, null); } catch (e) {} }
  // per-character cascade: chars move from offset -> rest, starting at t0, delay per char st, each lasting d
  function inExpr(t0, st, d) {
    return "// wejscie: start, opoznienie na znak, czas trwania\nvar t0 = " + t0.toFixed(3) + ", st = " + st + ", d = " + d + ";\n" +
      "var p = Math.min(Math.max((time - t0 - (textIndex - 1) * st) / d, 0), 1);\nvar a = 100 * Math.pow(1 - p, 4);\n[a, a, a]";
  }
  function outExpr(t0, st, d) {
    return "// wyjscie\nvar t0 = " + t0.toFixed(3) + ", st = " + st + ", d = " + d + ";\n" +
      "var p = Math.min(Math.max((time - t0 - (textIndex - 1) * st) / d, 0), 1);\nvar a = 100 * p * p * p;\n[a, a, a]";
  }
  function riseIn(l, t0, st, d, dy) { textAnimator(l, "Wejscie", { pos: [0, dy == null ? 60 : dy], opacity: 0 }, inExpr(t0, st == null ? 0.018 : st, d || 0.45)); }
  function riseOut(l, t0, st, d, dy) { textAnimator(l, "Wyjscie", { pos: [0, -(dy == null ? 60 : dy)], opacity: 0 }, outExpr(t0, st == null ? 0.012 : st, d || 0.22)); }
  function clipMask(l, pad) {
    var r = rect(l); pad = pad || 30;
    var m = l.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    m.name = "Maska odsloniecia";
    m.property("ADBE Mask Shape").setValue(rectPath(r.left - pad * 3, r.top - pad, r.width + pad * 6, r.height + pad * 2));
  }

  // ------------------------------------------------------------------ misc layers
  function pivotNull(comp, name, x, y) {
    var n = comp.layers.addNull(); n.name = name;
    n.transform.anchorPoint.setValue([x, y]); n.transform.position.setValue([x, y]);
    return n;
  }
  function bgRect(comp, k, name) {
    var l = shapeLayer(comp, name || "tlo");
    newGroup(l, "tlo"); addRect(inner(l, "tlo"), [W + 400, H + 400], [W / 2, H / 2]); addFill(inner(l, "tlo"), k);
    return l;
  }
  function setOpacityKeys(l, keys) { anim(l.transform.opacity, keys); }
  function newComp(name, dur, folder) {
    var c = app.project.items.addComp(name, W, H, 1, dur, FPS);
    if (folder) c.parentFolder = folder;
    c.motionBlur = true;
    try { c.shutterAngle = 180; } catch (e) {}
    c.bgColor = [1, 1, 1];
    return c;
  }
  function placeComp(parent, item, start, name) {
    var l = parent.layers.add(item); l.startTime = start; if (name) l.name = name; return l;
  }

  // ------------------------------------------------------------------ icon data (100x100 box, centred)
  var TAU = Math.PI * 2;
  var ICONS = {
    house: [["p", [[-40, 45], [-40, -5], [0, -42], [40, -5], [40, 45]], 1], ["l", -52, 45, 52, 45], ["r", -12, 15, 22, 30], ["r", 14, 2, 16, 16], ["p", [[22, -22], [22, -38], [31, -38], [31, -14]]], ["l", -40, 58, 40, 58], ["l", -40, 53, -40, 63], ["l", 40, 53, 40, 63]],
    crane: [["l", -30, 50, -30, -44], ["l", -20, 50, -20, -44], ["p", [[-30, 40], [-20, 28], [-30, 16], [-20, 4], [-30, -8], [-20, -20], [-30, -32]]], ["l", -46, -44, 48, -44], ["p", [[-25, -56], [-46, -44]]], ["p", [[-25, -56], [44, -44]]], ["r", -46, -42, 12, 9], ["l", 34, -44, 34, -8], ["a", 34, -3, 5, -Math.PI / 2, Math.PI], ["r", 2, 12, 40, 38], ["l", 2, 31, 42, 31], ["l", 22, 12, 22, 50], ["l", -50, 50, 50, 50]],
    helmet: [["a", 0, 12, 36, Math.PI, TAU], ["r", -48, 12, 96, 9], ["l", 0, -24, 0, 12], ["l", -12, -22, -12, 12], ["l", 12, -22, 12, 12], ["a", 0, 12, 22, Math.PI * 1.15, Math.PI * 1.85]],
    shop: [["r", -46, -32, 92, 14], ["a", -38.3, -18, 7.66, 0, Math.PI], ["a", -23, -18, 7.66, 0, Math.PI], ["a", -7.7, -18, 7.66, 0, Math.PI], ["a", 7.7, -18, 7.66, 0, Math.PI], ["a", 23, -18, 7.66, 0, Math.PI], ["a", 38.3, -18, 7.66, 0, Math.PI], ["r", -40, -10, 80, 55], ["r", -30, 12, 20, 33], ["r", 2, 4, 28, 20], ["r", -20, -50, 40, 14]],
    invest: [["l", -42, 46, -42, -42], ["l", -42, 46, 46, 46], ["p", [[-34, 30], [-12, 6], [4, 16], [38, -24]]], ["p", [[24, -25], [39, -25], [39, -10]]], ["a", 20, 30, 9, 0, TAU], ["l", -42, 20, -38, 20], ["l", -42, -6, -38, -6]],
    developer: [["r", -38, -44, 36, 90], ["r", 4, -14, 36, 60], ["r", -30, -34, 8, 8], ["r", -18, -34, 8, 8], ["r", -30, -18, 8, 8], ["r", -18, -18, 8, 8], ["r", -30, -2, 8, 8], ["r", -18, -2, 8, 8], ["r", 12, -4, 8, 8], ["r", 24, -4, 8, 8], ["r", 12, 12, 8, 8], ["r", 24, 12, 8, 8], ["l", -50, 46, 50, 46]],
    architect: [["a", 0, -38, 6, 0, TAU], ["l", -3, -32, -24, 42], ["l", 3, -32, 24, 42], ["l", -14, 6, 14, 6], ["a", 0, -32, 70, Math.PI * 0.36, Math.PI * 0.64], ["l", 0, -52, 0, -44]],
    pm: [["r", -32, -36, 64, 82], ["r", -12, -44, 24, 12], ["p", [[-22, -14], [-15, -7], [-4, -20]]], ["l", 4, -13, 22, -13], ["p", [[-22, 10], [-15, 17], [-4, 4]]], ["l", 4, 11, 22, 11], ["r", -22, 28, 12, 10], ["l", 4, 33, 22, 33]]
  };
  function iconPath(pr, s) {
    var i, pts;
    if (pr[0] == "l") return line(pr[1] * s, pr[2] * s, pr[3] * s, pr[4] * s);
    if (pr[0] == "r") return rectPath(pr[1] * s, pr[2] * s, pr[3] * s, pr[4] * s);
    if (pr[0] == "a") return arcShape(pr[1] * s, pr[2] * s, pr[3] * s, pr[4], pr[5]);
    pts = []; for (i = 0; i < pr[1].length; i++) pts.push([pr[1][i][0] * s, pr[1][i][1] * s]);
    return polyline(pts, !!pr[2]);
  }
  // builds a line-drawing icon; returns the layer. Draw-on = Trim Paths (sequential) at the root.
  function icon(comp, name, key, x, y, s, k, w) {
    var l = shapeLayer(comp, name, [x, y]), list = ICONS[key];
    for (var i = 0; i < list.length; i++) { newGroup(l, "el " + (i + 1)); addPath(inner(l, "el " + (i + 1)), iconPath(list[i], s)); }
    addTrim(root(l), true);
    addStroke(root(l), k, w);
    return l;
  }
  function iconTrim(l) { return trimEnd(root(l)); }

  // ------------------------------------------------------------------ logo geometry (measured from the brand file)
  var LOGO = { tri: [[399, 455], [478, 590], [320, 590]], tx: 530, base: 590, tw: 1048, cx: 961, cy: 522, reg: [1590, 452] };
  var WM_SIZE = 190;
  function wordmark(comp, k, o) {
    var l = textLayer(comp, "budoexpert", F.m, WM_SIZE, k, LOGO.tx, LOGO.base, "l", o);
    var r = rect(l);
    if (r.width > 0 && Math.abs(r.width - LOGO.tw) > 1) { WM_SIZE = WM_SIZE * LOGO.tw / r.width; setFontSize(l, WM_SIZE); r = rect(l); }
    l.transform.position.setValue([LOGO.tx - r.left, LOGO.base]);
    return l;
  }
  function triangleLayer(comp, name, k) {
    var l = shapeLayer(comp, name);
    newGroup(l, "trojkat");
    addPath(inner(l, "trojkat"), polyline(LOGO.tri, true));
    addFill(inner(l, "trojkat"), k);
    addStroke(inner(l, "trojkat"), k, 8);
    return l;
  }
  function regMark(comp, k) {
    var l = shapeLayer(comp, "(R) kolko", LOGO.reg);
    newGroup(l, "kolko"); addEllipse(inner(l, "kolko"), [20, 20]); addStroke(inner(l, "kolko"), k, 2.6);
    var t = textLayer(comp, "R", F.b, 13, k, LOGO.reg[0], LOGO.reg[1] + 4.6, "c", { name: "(R) litera" });
    return [l, t];
  }

  // ========================================================================
  //  BUILD
  // ========================================================================
  app.beginUndoGroup("budoexpert promo");
  var proj = app.newProject();
  if (!proj) { app.endUndoGroup(); return; }
  try { proj.expressionEngine = "javascript-1.0"; } catch (e) {}
  var ROOT = proj.items.addFolder("budoexpert promo");
  var FS = proj.items.addFolder("sceny"); FS.parentFolder = ROOT;
  var FP = proj.items.addFolder("elementy"); FP.parentFolder = ROOT;
  var FA = proj.items.addFolder("audio i referencja"); FA.parentFolder = ROOT;

  var main = newComp(MAIN, DUR, ROOT);

  // brand controls first, so every colour expression can resolve
  var ctrl = main.layers.addNull(); ctrl.name = "KONTROLA_MARKI"; ctrl.guideLayer = true;
  safe("kontrola", function () {
    for (var i = CTRL_ORDER.length - 1; i >= 0; i--) {
      var k = CTRL_ORDER[i];
      var ef = ctrl.property("ADBE Effect Parade").addProperty("ADBE Color Control");
      ef.name = CTRL[k];
      ctrl.property("ADBE Effect Parade").property(CTRL[k]).property(1).setValue(c01(k));
    }
  });

  // ---------- _SIATKA (graph paper)
  var gridComp = newComp("_SIATKA", DUR, FP);
  safe("siatka", function () {
    var l = shapeLayer(gridComp, "siatka");
    var sets = [["v30", line(0, -20, 0, H + 20), 65, [30, 0], "grid"], ["h30", line(-20, 0, W + 20, 0), 37, [0, 30], "grid"],
                ["v150", line(0, -20, 0, H + 20), 13, [150, 0], "grid2"], ["h150", line(-20, 0, W + 20, 0), 8, [0, 150], "grid2"]];
    for (var i = 0; i < sets.length; i++) {
      newGroup(l, sets[i][0]); addPath(inner(l, sets[i][0]), sets[i][1]); addStroke(inner(l, sets[i][0]), sets[i][4], 1); addRepeater(inner(l, sets[i][0]), sets[i][2], sets[i][3]);
    }
  });

  // ---------- _LOGO (colour and white)
  function buildLogo(name, triK, txtK) {
    var c = newComp(name, DUR, FP);
    c.bgColor = txtK == "white" ? rgb("purple") : [1, 1, 1];
    safe(name, function () { triangleLayer(c, "trojkat", triK); wordmark(c, txtK, { name: "napis budoexpert" }); regMark(c, txtK); });
    return c;
  }
  var logoColor = buildLogo("_LOGO_KOLOR", "teal", "purple");
  var logoWhite = buildLogo("_LOGO_BIALE", "teal", "white");
  function placeLogo(comp, item, x, y, s) {
    var l = comp.layers.add(item); l.transform.anchorPoint.setValue([LOGO.cx, LOGO.cy]); l.transform.position.setValue([x, y]); l.transform.scale.setValue([s, s]); return l;
  }

  // ---------- _TABLICZKA (architectural title block)
  var tbComp = newComp("_TABLICZKA", DUR, FP);
  safe("tabliczka", function () {
    var x = W - 60 - 360, y = H - 60 - 84;
    var l = shapeLayer(tbComp, "ramka");
    newGroup(l, "ramka");
    addPath(inner(l, "ramka"), rectPath(x, y, 360, 84));
    addPath(inner(l, "ramka"), line(x + 230, y, x + 230, y + 84));
    addPath(inner(l, "ramka"), line(x, y + 42, x + 360, y + 42));
    addStroke(inner(l, "ramka"), "purple", 1.5, { opacity: 55 });
    var a = textLayer(tbComp, "PROJEKT: BUDOEXPERT", F.sb, 13, "purple", x + 12, y + 26, "l", { tracking: 154 }); a.transform.opacity.setValue(80);
    var s = textLayer(tbComp, "ARKUSZ 01", F.sb, 13, "purple", x + 244, y + 26, "l", { tracking: 154, name: "arkusz (numer z wyrazenia)" }); s.transform.opacity.setValue(80);
    tdoc(s).expression = 'time < 7.75 ? "ARKUSZ 01" : (time < 12 ? "ARKUSZ 02" : "ARKUSZ 03")';
    var b = textLayer(tbComp, "RYNEK BUDOWLANY 2.0", F.m, 13, "purple", x + 12, y + 68, "l", { tracking: 154 }); b.transform.opacity.setValue(60);
    var d = textLayer(tbComp, "SKALA 1:1", F.m, 13, "purple", x + 244, y + 68, "l", { tracking: 154 }); d.transform.opacity.setValue(60);
  });

  // ======================================================================
  //  SCENE 1 - 0.0-4.5 - kulka toczy sie -> trojkat -> dobija do napisu
  // ======================================================================
  var s1 = newComp("01_LOGO_kulka", 4.5, FS);
  safe("scena 1", function () {
    bgRect(s1, "paper");
    s1.layers.add(gridComp);

    // construction guides
    var g = shapeLayer(s1, "prowadnice");
    sketchGroup(g, "baseline", line(0, LOGO.base, W, LOGO.base), "sketch", 1.6, 0.05, 0.9, { dash: [10, 8], ease: "out" });
    sketchGroup(g, "x-height", line(W, 485, 0, 485), "grid2", 1.4, 0.2, 1.0, { ease: "out" });
    sketchGroup(g, "ascender", line(0, 452, W, 452), "grid2", 1.4, 0.3, 1.1, { ease: "out" });
    sketchGroup(g, "trojkat szkic", polyline(LOGO.tri, true), "sketch", 2, 0.9, 1.5);
    sketchGroup(g, "os trojkata", line(399, 420, 399, 630), "grid2", 1.4, 1.0, 1.4, { ease: "out" });
    sketchGroup(g, "okrag cyrkla", arcShape(399, 545, 104, -Math.PI * 0.9, Math.PI * 0.6), "grid2", 1.4, 1.1, 1.7);
    setOpacityKeys(g, [[3.4, 100], [4.1, 0, "inout"]]);
    var labs = [["BASELINE", LOGO.base - 10], ["X-HEIGHT", 478], ["ASCENDER", 445]];
    for (var i = 0; i < labs.length; i++) {
      var tl = textLayer(s1, labs[i][0], F.sb, 14, "sketch", 1640, labs[i][1], "l", { tracking: 214 });
      setOpacityKeys(tl, [[0.6, 0], [0.9, 100], [3.4, 100], [4.1, 0, "inout"]]);
    }
    // dimension line under the wordmark
    var dm = shapeLayer(s1, "wymiar", [LOGO.tx + LOGO.tw / 2, 680]);
    newGroup(dm, "wymiar");
    addPath(inner(dm, "wymiar"), line(-LOGO.tw / 2, 0, LOGO.tw / 2, 0));
    addPath(inner(dm, "wymiar"), line(-LOGO.tw / 2, -10, -LOGO.tw / 2, 10));
    addPath(inner(dm, "wymiar"), line(LOGO.tw / 2, -10, LOGO.tw / 2, 10));
    addStroke(inner(dm, "wymiar"), "teal2", 1.6, { opacity: 80 });
    anim(gx(dm, "wymiar").property("ADBE Vector Scale"), [[1.2, [0, 100]], [1.8, [100, 100], "out"]]);
    setOpacityKeys(dm, [[3.4, 100], [4.1, 0, "inout"]]);
    var dl = textLayer(s1, "1048 PX \u00b7 POPPINS", F.sb, 16, "teal2", LOGO.tx + LOGO.tw / 2, 716, "c", { tracking: 188 });
    setOpacityKeys(dl, [[1.5, 0], [1.8, 100], [3.4, 100], [4.1, 0, "inout"]]);

    // logo group: identity pivot at the logo centre, flies up for scene 2
    var grp = pivotNull(s1, "LOGO_GRUPA (ruch w gore)", LOGO.cx, LOGO.cy);
    anim(grp.transform.position, [[4.0, [LOGO.cx, LOGO.cy]], [4.5, [LOGO.cx, 300], "expo"]]);
    anim(grp.transform.scale, [[4.0, [100, 100]], [4.5, [62, 62], "expo"]]);

    // wordmark: pencil outline written on with a mask, then filled by the hit
    var wo = wordmark(s1, "sketch", { outline: 2, name: "napis - szkic olowkiem" });
    var r = rect(wo);
    var m = wo.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); m.name = "pisanie";
    anim(wo.property("ADBE Mask Parade").property("pisanie").property("ADBE Mask Shape"), [
      [0.3, rectPath(r.left - 20, r.top - 60, 1, r.height + 120)],
      [1.5, rectPath(r.left - 20, r.top - 60, r.width + 60, r.height + 120), "inout"]]);
    setOpacityKeys(wo, [[2.5, 100], [2.85, 0, "out"]]);
    parentTo(wo, grp);

    var wf = wordmark(s1, "purple", { name: "napis - wypelnienie (uderzenie)" });
    // hidden until the impact wave passes each letter, then a squash & settle
    textAnimator(wf, "Ukrycie", { opacity: 0 }, "var dt = time - (2.5 + (textIndex - 1) * 0.028);\nvar a = dt < 0 ? 100 : 0;\n[a, a, a]");
    textAnimator(wf, "Sprezyna", { scale: [135, 55] },
      "// sprezyste zgniecenie liter po uderzeniu\nvar dt = time - (2.5 + (textIndex - 1) * 0.028);\nvar a = dt < 0 ? 0 : 100 * Math.exp(-dt * 9) * Math.cos(dt * 34);\n[a, a, a]");
    parentTo(wf, grp);

    var rg = regMark(s1, "purple");
    for (i = 0; i < 2; i++) { anim(rg[i].transform.scale, springKeys(3.0, 0.35, [0, 0], [100, 100], 0.2)); parentTo(rg[i], grp); }

    // the ball: a 4-point bezier circle that morphs into the triangle (same vertex count)
    var R = 58, K = R * 0.5523, X0 = 399 - 2 * TAU * R; // two full turns -> the triangle lands upright
    var circle = shp([[0, -R], [R, 0], [0, R], [-R, 0]], true, [[-K, 0], [0, -K], [K, 0], [0, K]], [[K, 0], [0, K], [-K, 0], [0, -K]]);
    var tri = shp([[0, -77], [79, 58], [0, 58], [-79, 58]], true, [[0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0]]);
    var triOver = shp([[0, -84], [86, 62], [0, 62], [-86, 62]], true, [[0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0]]);

    var sh = shapeLayer(s1, "cien kulki", [0, LOGO.base + 4]);
    newGroup(sh, "cien"); addEllipse(inner(sh, "cien"), [116, 14]); addFill(inner(sh, "cien"), "purple", 12);
    sh.transform.position.dimensionsSeparated = true;
    sh.transform.xPosition.expression = 'thisComp.layer("kulka / trojkat").transform.xPosition';
    setOpacityKeys(sh, [[1.85, 100], [2.0, 0]]);

    var sp = shapeLayer(s1, "linie predkosci", [0, 0]);
    for (i = 0; i < 3; i++) {
      newGroup(sp, "linia " + (i + 1));
      addPath(inner(sp, "linia " + (i + 1)), line(-R - 20 - 10 * i, -24 + i * 24, -R - 240 - 10 * i, -24 + i * 24));
      addStroke(inner(sp, "linia " + (i + 1)), "teal", 5 - i, { opacity: 60 - i * 15 });
    }
    sp.transform.anchorPoint.setValue([-R - 20, 0]);
    sp.transform.position.expression = 'var b = thisComp.layer("kulka / trojkat"); [b.transform.xPosition - ' + (R + 20) + ', b.transform.yPosition]';
    sp.transform.scale.expression = 'var v = Math.abs(thisComp.layer("kulka / trojkat").transform.xPosition.velocity);\nvar s = Math.min(v / 1400, 1) * 100;\n[s, 100]';
    setOpacityKeys(sp, [[1.7, 100], [1.9, 0]]);

    var ball = shapeLayer(s1, "kulka / trojkat", [399, LOGO.base - R]);
    newGroup(ball, "odblask");
    addPath(inner(ball, "odblask"), arcShape(0, 0, R * 0.62, -0.5, 0.5));
    addStroke(inner(ball, "odblask"), "white", 6, { opacity: 85 });
    addEllipse(inner(ball, "odblask"), [12, 12], [-R * 0.5, -R * 0.2]);
    addFill(inner(ball, "odblask"), "white", 85);
    newGroup(ball, "ksztalt");
    addPath(inner(ball, "ksztalt"), circle);
    addFill(inner(ball, "ksztalt"), "teal");
    addStroke(inner(ball, "ksztalt"), "teal", 8);
    // order: shape below the highlight
    root(ball).property("ksztalt").moveTo(2);
    anim(inner(ball, "ksztalt").property("ADBE Vector Shape - Group").property("ADBE Vector Shape"), [
      [1.95, circle], [2.18, triOver, "out"], [2.32, tri, "inout"]]);
    anim(gx(ball, "odblask").property("ADBE Vector Group Opacity"), [[1.9, 100], [2.0, 0]]);
    ball.transform.position.dimensionsSeparated = true;
    anim(ball.transform.xPosition, [[0.35, X0], [1.85, 399, "out"], [2.2, 399], [2.4, 365, "out"], [2.5, 439, "in"], [2.62, 392, "out"], [2.78, 404, "inout"], [2.95, 399, "inout"]]);
    ball.transform.yPosition.expression = "// podskoki na wejsciu\nvar p = Math.min(Math.max((time - 0.35) / 1.5, 0), 1);\n" + (LOGO.base - R) + " - 70 * Math.exp(-p * 5) * Math.abs(Math.sin(p * 9));";
    ball.transform.rotation.expression = "// toczenie: obrot = droga / promien (2 pelne obroty)\nvar x = transform.xPosition.valueAtTime(Math.min(time, 1.85));\n(x - (" + X0.toFixed(3) + ")) / " + R + " * 180 / Math.PI";
    ball.motionBlur = true;
    parentTo(ball, grp);

    // impact rings
    var ir = shapeLayer(s1, "uderzenie - fale", [520, 530]);
    newGroup(ir, "fala 1"); addEllipse(inner(ir, "fala 1"), [10, 10]); addStroke(inner(ir, "fala 1"), "teal", 6);
    newGroup(ir, "fala 2"); addEllipse(inner(ir, "fala 2"), [10, 10]); addStroke(inner(ir, "fala 2"), "purple", 3);
    anim(inner(ir, "fala 1").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[2.5, [0, 0]], [3.0, [520, 520], "out"]]);
    anim(inner(ir, "fala 1").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width"), [[2.5, 6], [3.0, 0]]);
    anim(inner(ir, "fala 2").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[2.5, [0, 0]], [3.0, [300, 300], "out"]]);
    anim(inner(ir, "fala 2").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width"), [[2.5, 3], [3.0, 0]]);
    ir.inPoint = 2.45; ir.outPoint = 3.05;

    // gentle camera push-in on the whole scene
    var cam = pivotNull(s1, "KAMERA", W / 2, H / 2);
    for (i = 2; i <= s1.numLayers; i++) { var L = s1.layer(i); if (L.name != "KAMERA" && !L.parent && L.name != "tlo") parentTo(L, cam); }
    anim(cam.transform.scale, [[0, [110, 110]], [2.6, [100, 100], "inout"]]);
  });

  // ======================================================================
  //  SCENE 2 - 4.5-8.0 - platforma zmieniajaca rynek budowlany
  // ======================================================================
  var s2 = newComp("02_PLATFORMA", 3.5, FS);
  safe("scena 2", function () {
    var O = 4.5;
    bgRect(s2, "paper");
    s2.layers.add(gridComp);
    placeLogo(s2, logoColor, LOGO.cx, 300, 62);

    var l1 = textLayer(s2, "Platforma, kt\u00f3ra zmienia", F.sb, 78, "ink", W / 2, 560, "c");
    var r1 = rect(l1), right1 = W / 2 + r1.left + r1.width;
    var zw = textWidth(s2, "zmienia", F.sb, 78, 0);
    clipMask(l1, 20); riseIn(l1, 4.55 - O, 0.022, 0.5, 95);

    var l2 = textLayer(s2, "rynek budowlany.", F.eb, 132, "purple", W / 2, 730, "c");
    var r2 = rect(l2), l2w = r2.width, x2 = W / 2 + r2.left;
    // marker highlight (drawn under line 2)
    var mk = shapeLayer(s2, "zakreslacz", [x2 - 15, 690]);
    newGroup(mk, "pasek");
    addPath(inner(mk, "pasek"), polyline([[0, 4], [l2w + 30, 0], [l2w + 24, 48], [3, 52]], true));
    addFill(inner(mk, "pasek"), "teal", 45);
    anim(gx(mk, "pasek").property("ADBE Vector Scale"), [[5.3 - O, [0, 100]], [5.8 - O, [100, 100], "inout"]]);
    mk.moveAfter(l2);
    clipMask(l2, 30); riseIn(l2, 4.85 - O, 0.02, 0.55, 160);

    // pencil ellipse around "zmienia" + doodle arrow + note
    var zc = right1 - zw / 2;
    var an = shapeLayer(s2, "adnotacje olowkiem");
    newGroup(an, "elipsa");
    addEllipse(inner(an, "elipsa"), [zw + 68, 116], [zc, 535]);
    addTrim(inner(an, "elipsa"), false);
    addStroke(inner(an, "elipsa"), "teal2", 3.5);
    anim(trimEnd(inner(an, "elipsa")), [[5.7 - O, 0], [6.2 - O, 100, "inout"]]);
    sketchGroup(an, "strzalka", polyline([[right1 + 60, 470], [right1 + 120, 420], [right1 + 170, 405]]), "teal2", 3, 6.1 - O, 6.4 - O);
    sketchGroup(an, "grot", polyline([[right1 + 152, 392], [right1 + 172, 405], [right1 + 152, 420]]), "teal2", 3, 6.35 - O, 6.5 - O);
    var note = textLayer(s2, "REWOLUCJA", F.b, 30, "teal2", right1 + 185, 415, "l", { tracking: 67 });
    setOpacityKeys(note, [[6.4 - O, 0], [6.7 - O, 100, "out"]]);

    var dm = shapeLayer(s2, "wymiar", [W / 2, 790]);
    newGroup(dm, "wymiar");
    addPath(inner(dm, "wymiar"), line(-l2w / 2, 0, l2w / 2, 0));
    addPath(inner(dm, "wymiar"), line(-l2w / 2, -10, -l2w / 2, 10));
    addPath(inner(dm, "wymiar"), line(l2w / 2, -10, l2w / 2, 10));
    addStroke(inner(dm, "wymiar"), "sketch", 1.6);
    anim(gx(dm, "wymiar").property("ADBE Vector Scale"), [[5.6 - O, [0, 100]], [6.2 - O, [100, 100], "out"]]);
    var dl = textLayer(s2, "WSZYSTKO W JEDNYM MIEJSCU", F.sb, 16, "sketch", W / 2, 826, "c", { tracking: 188 });
    setOpacityKeys(dl, [[5.9 - O, 0], [6.2 - O, 100]]);
  });

  // ======================================================================
  //  SCENE 3 - 7.5-12.4 - pytania (comp time 0 = 7.5 s)
  // ======================================================================
  var s3 = newComp("03_PYTANIA", 4.9, FS);
  safe("scena 3", function () {
    var O = 7.5;
    bgRect(s3, "paper");
    s3.layers.add(gridComp);
    var qm = textLayer(s3, "?", F.eb, 760, "teal", 1600, 560, "c", { outline: 3, name: "duzy znak zapytania" });
    qm.transform.anchorPoint.setValue([0, -260]);
    qm.transform.opacity.setValue(18);
    qm.transform.rotation.expression = "(0.12 + Math.sin((time + " + O + ") * 1.5) * 0.05) * 180 / Math.PI";

    var fr = shapeLayer(s3, "tablica rysunkowa");
    newGroup(fr, "okrag");
    addEllipse(inner(fr, "okrag"), [500, 500], [540, 540]);
    addTrim(inner(fr, "okrag"), false);
    addStroke(inner(fr, "okrag"), "grid2", 2, { dash: [6, 10] });
    anim(trimEnd(inner(fr, "okrag")), [[7.75 - O, 0], [8.3 - O, 100, "inout"]]);
    sketchGroup(fr, "pion", line(540, 250, 540, 830), "grid", 1.5, 7.8 - O, 8.2 - O, { ease: "out" });
    sketchGroup(fr, "poziom", line(250, 540, 830, 540), "grid", 1.5, 7.85 - O, 8.25 - O, { ease: "out" });

    var QS = [
      [8.0, "Planujesz", "budow\u0119 domu", "house"],
      [9.0, "Jeste\u015b w trakcie", "budowy", "crane"],
      [10.0, "Jeste\u015b", "wykonawc\u0105", "helmet"],
      [11.0, "\u2026albo", "sprzedawc\u0105", "shop"]
    ];
    for (var i = 0; i < QS.length; i++) {
      var q = QS[i], t = q[0] - O, end = (i + 1 < QS.length ? QS[i + 1][0] : 12.0) - O, tag = "P" + (i + 1) + " ";
      var ic = icon(s3, tag + "ikona " + q[3], q[3], 540, 535, 3.6, "purple", 5);
      anim(iconTrim(ic), [[t - 0.2, 0], [t + 0.5, 100, "inout"], [end - 0.12, 100], [end + 0.1, 0, "in"]]);
      ic.inPoint = Math.max(0, t - 0.25); ic.outPoint = end + 0.3;

      var cn = textLayer(s3, "0" + (i + 1) + " / 04", F.b, 26, "teal2", 900, 380, "l", { tracking: 154, name: tag + "licznik" });
      var la = textLayer(s3, q[1], F.sb, 74, "ink", 900, 505, "l", { name: tag + "linia 1" });
      var lb = textLayer(s3, q[2], F.eb, 124, "purple", 900, 650, "l", { name: tag + "linia 2" });
      var bw = rect(lb).width + rect(lb).left;
      var qq = textLayer(s3, "?", F.eb, 124, "teal", 900 + bw + 30, 650, "l", { name: tag + "?" });
      qq.transform.anchorPoint.setValue([30, 0]);
      anim(qq.transform.scale, springKeys(t + 0.25, 0.35, [0, 0], [100, 100], 0.25));
      anim(qq.transform.rotation, [[t + 0.25, 45], [t + 0.6, 0, "out"]]);
      setOpacityKeys(qq, [[end - 0.12, 100], [end + 0.05, 0]]);
      var tl = [cn, la, lb];
      var dys = [36, 90, 150];
      for (var j = 0; j < tl.length; j++) {
        clipMask(tl[j], 20);
        riseIn(tl[j], t + (j == 2 ? 0.08 : 0), 0.015, 0.45, dys[j]);
        riseOut(tl[j], end - 0.12, 0.008, 0.2, dys[j] * 1.1);
      }
      var ul = shapeLayer(s3, tag + "podkreslenie");
      sketchGroup(ul, "linia", line(900, 690, 900 + bw + 70, 690), "teal", 4, null, null);
      anim(trimEnd(inner(ul, "linia")), [[t + 0.3, 0], [t + 0.6, 100, "inout"], [end - 0.12, 100], [end + 0.08, 0, "in"]]);
      var ls = [ic, cn, la, lb, qq, ul];
      for (j = 0; j < ls.length; j++) { ls[j].inPoint = Math.max(0, t - 0.25); ls[j].outPoint = end + 0.3; }

      // progress dot
      var dot = shapeLayer(s3, tag + "kropka postepu", [912 + i * 30, 790]);
      newGroup(dot, "szara"); addEllipse(inner(dot, "szara"), [10, 10]); addFill(inner(dot, "szara"), "grid2");
      newGroup(dot, "aktywna"); addEllipse(inner(dot, "aktywna"), [16, 16]); addFill(inner(dot, "aktywna"), "teal");
      anim(gx(dot, "aktywna").property("ADBE Vector Scale"), springKeys(t, 0.3, [0, 0], [100, 100], 0.3));
    }
  });

  // ======================================================================
  //  SCENE 4 - 12.0-15.5 - nowy swiat + REWOLUCJA (comp time 0 = 12.0 s)
  // ======================================================================
  var s4 = newComp("04_REWOLUCJA", 3.5, FS);
  safe("scena 4", function () {
    var O = 12.0, i;
    s4.bgColor = rgb("purple");
    bgRect(s4, "purple");
    for (i = 0; i < 6; i++) {
      var row = textLayer(s4, "REWOLUCJA \u00b7 REWOLUCJA \u00b7 REWOLUCJA \u00b7 REWOLUCJA \u00b7 ", F.bl, 190, "white", 0, 60 + i * 200, "l", { outline: 2, tracking: 42, name: "tlo - rzad " + (i + 1) });
      row.transform.opacity.setValue(9);
      row.transform.position.expression = "// przesuwajacy sie napis w tle\nvar cw = thisLayer.sourceRectAtTime(0, false).width / 4;\nvar dir = " + (i % 2 ? 1 : -1) + ";\nvar off = (((time) * 240 * dir + " + (i * 300) + ") % cw + cw) % cw;\n[-off - cw * 0.5, value[1]]";
    }

    // wireframe globe
    var gl = shapeLayer(s4, "globus", [W / 2, H / 2]);
    newGroup(gl, "obrys"); addEllipse(inner(gl, "obrys"), [660, 660]);
    for (i = 0; i < 8; i++) {
      newGroup(gl, "poludnik " + (i + 1));
      addEllipse(inner(gl, "poludnik " + (i + 1)), [660, 660]);
      inner(gl, "poludnik " + (i + 1)).property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").expression =
        "var ph = time * 0.8 + " + i + " * Math.PI / 8; [Math.abs(Math.cos(ph)) * 660, 660]";
      gx(gl, "poludnik " + (i + 1)).property("ADBE Vector Group Opacity").expression = "Math.sin(time * 0.8 + " + i + " * Math.PI / 8) > 0 ? 90 : 35";
    }
    for (i = -3; i <= 3; i++) {
      var la = i * Math.PI / 8, rx = 330 * Math.cos(la);
      newGroup(gl, "rownoleznik " + (i + 4));
      addEllipse(inner(gl, "rownoleznik " + (i + 4)), [2 * rx, 2 * rx * 0.18], [0, 330 * Math.sin(la)]);
    }
    addStroke(root(gl), "teal", 2);
    gl.transform.opacity.setValue(55);
    anim(gl.transform.scale, [[0.15, [0, 0]], [0.5, [108, 108], "out"], [0.72, [97, 97], "inout"], [0.9, [100, 100], "inout"], [1.85, [100, 100]], [2.05, [260, 260], "in"]]);
    anim(gl.transform.opacity, [[1.85, 55], [2.05, 0, "in"]]);

    // "Tworzymy nowy swiat dla rynku budowlanego."
    var fullW = textWidth(s4, "nowy \u015bwiat", F.eb, 196, 0), x0 = W / 2 - fullW / 2;
    var tw = [
      textLayer(s4, "Tworzymy", F.m, 62, "white", W / 2, 400, "c"),
      textLayer(s4, "nowy", F.eb, 196, "white", x0, 610, "l"),
      textLayer(s4, "\u015bwiat", F.eb, 196, "teal", x0 + fullW, 610, "r"),
      textLayer(s4, "dla rynku budowlanego.", F.m, 62, "white", W / 2, 720, "c")
    ];
    var starts = [0.3, 0.45, 0.55, 0.8], dys = [75, 235, 235, 75];
    var tg = pivotNull(s4, "TEKST_SWIAT (wybuch)", W / 2, H / 2);
    anim(tg.transform.scale, [[1.85, [100, 100]], [2.05, [150, 150], "in"]]);
    for (i = 0; i < tw.length; i++) {
      clipMask(tw[i], 20); riseIn(tw[i], starts[i], 0.02, 0.45, dys[i]);
      setOpacityKeys(tw[i], [[1.85, 100], [2.05, 0, "in"]]);
      parentTo(tw[i], tg);
    }

    // REWOLUCJA slam (+ three teal echoes underneath)
    var echoes = [];
    for (i = 3; i >= 1; i--) {
      var e = textLayer(s4, "REWOLUCJA", F.bl, 210, "teal", W / 2, 560, "c", { tracking: 29, name: "REWOLUCJA - echo " + i });
      e.transform.opacity.setValue(Math.round((0.9 - i * 0.22) * 100));
      echoes.push([e, i]);
    }
    var rv = textLayer(s4, "REWOLUCJA", F.bl, 210, "white", W / 2, 560, "c", { tracking: 29 });
    rv.transform.rotation.setValue(-2.3);
    anim(rv.transform.scale, [[2.0, [240, 240]], [2.22, [100, 100], "snap"]]);
    for (i = 0; i < echoes.length; i++) {
      parentTo(echoes[i][0], rv);
      anim(echoes[i][0].transform.position, [[2.05, [0, 0]], [2.5, [-9 * echoes[i][1], -9 * echoes[i][1]], "out"]]);
      echoes[i][0].inPoint = 2.0;
    }
    rv.inPoint = 2.0;
    var sub = textLayer(s4, "w budownictwie zaczyna si\u0119 tutaj", F.sb, 58, "teal", W / 2, 700, "c", { tracking: 34 });
    clipMask(sub, 20); riseIn(sub, 2.25, 0.012, 0.45, 70);
    var st = shapeLayer(s4, "ramka stempla", [W / 2, 480]);
    st.transform.rotation.setValue(-2.3);
    sketchGroup(st, "ramka", rectPath(-720, -150, 1440, 280), "white", 4, 2.1, 2.45);
  });

  // ======================================================================
  //  SCENE 5 - 15.0-20.5 - hub z rolami (comp time 0 = 15.0 s)
  // ======================================================================
  var s5 = newComp("05_HUB_role", 5.5, FS);
  safe("scena 5", function () {
    var O = 15.0, i, HX = 960, HY = 540, HR = 150, NR = 64;
    bgRect(s5, "paper");
    var cam = pivotNull(s5, "KAMERA", W / 2, H / 2);
    anim(cam.transform.scale, [[15.5 - O, [100, 100]], [20.0 - O, [105, 105], "inout"]]);
    var gridL = s5.layers.add(gridComp); parentTo(gridL, cam);

    var cons = shapeLayer(s5, "konstrukcja", [HX, HY]);
    newGroup(cons, "elipsa rol"); addEllipse(inner(cons, "elipsa rol"), [1280, 720]); addTrim(inner(cons, "elipsa rol"), false);
    addStroke(inner(cons, "elipsa rol"), "grid2", 2, { dash: [10, 10] });
    anim(trimEnd(inner(cons, "elipsa rol")), [[15.55 - O, 0], [16.3 - O, 100, "inout"]]);
    newGroup(cons, "okrag cyrkla"); addEllipse(inner(cons, "okrag cyrkla"), [500, 500]); addTrim(inner(cons, "okrag cyrkla"), false);
    addStroke(inner(cons, "okrag cyrkla"), "sketch", 1.6);
    anim(trimEnd(inner(cons, "okrag cyrkla")), [[15.6 - O, 0], [16.2 - O, 100, "inout"]]);
    sketchGroup(cons, "os pozioma", line(-760, 0, 760, 0), "grid2", 1.2, 15.55 - O, 16.0 - O, { ease: "out" });
    sketchGroup(cons, "os pionowa", line(0, -470, 0, 470), "grid2", 1.2, 15.6 - O, 16.05 - O, { ease: "out" });
    newGroup(cons, "katomierz 10");
    addPath(inner(cons, "katomierz 10"), line(188, 0, 198, 0)); addStroke(inner(cons, "katomierz 10"), "sketch", 1.5); addRepeater(inner(cons, "katomierz 10"), 36, [0, 0], 10);
    newGroup(cons, "katomierz 30");
    addPath(inner(cons, "katomierz 30"), line(188, 0, 210, 0)); addStroke(inner(cons, "katomierz 30"), "sketch", 1.5); addRepeater(inner(cons, "katomierz 30"), 12, [0, 0], 30);
    anim(inner(cons, "katomierz 10").property("ADBE Vector Filter - Repeater").property("ADBE Vector Repeater Copies"), [[15.8 - O, 0], [16.4 - O, 36, "out"]]);
    anim(inner(cons, "katomierz 30").property("ADBE Vector Filter - Repeater").property("ADBE Vector Repeater Copies"), [[15.8 - O, 0], [16.4 - O, 12, "out"]]);
    parentTo(cons, cam);

    var ROLES = [["Inwestor", "invest", -90], ["Deweloper", "developer", -30], ["Architekt", "architect", 30], ["Wykonawca", "helmet", 90], ["Sprzedawca", "shop", 150], ["Project Manager", "pm", 210]];
    for (i = 0; i < ROLES.length; i++) {
      var ro = ROLES[i], a = ro[2] * Math.PI / 180, nx = HX + Math.cos(a) * 640, ny = HY + Math.sin(a) * 360;
      var d = Math.sqrt((nx - HX) * (nx - HX) + (ny - HY) * (ny - HY)), vx = (nx - HX) / d, vy = (ny - HY) / d;
      var ax = HX + vx * (HR + 14), ay = HY + vy * (HR + 14), bx = nx - vx * (NR + 8), by = ny - vy * (NR + 8);
      var st = 16.0 + i * 0.17 - O, tag = "0" + (i + 1) + " " + ro[0] + " - ";

      var beam = shapeLayer(s5, tag + "wiazka energii");
      newGroup(beam, "wiazka"); addPath(inner(beam, "wiazka"), line(ax, ay, bx, by)); addStroke(inner(beam, "wiazka"), "teal", 22, { opacity: 50 });
      anim(inner(beam, "wiazka").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width"), [[19.0 - O, 0], [19.05 - O, 22], [19.3 - O, 8, "out"], [19.9 - O, 0, "out"]]);
      parentTo(beam, cam);

      var br = shapeLayer(s5, tag + "odnoga");
      sketchGroup(br, "linia", line(ax, ay, bx, by), "purple", 3, st, st + 0.4);
      parentTo(br, cam);

      var node = shapeLayer(s5, tag + "wezel", [nx, ny]);
      newGroup(node, "kolo"); addEllipse(inner(node, "kolo"), [NR * 2, NR * 2]); addFill(inner(node, "kolo"), "white"); addStroke(inner(node, "kolo"), "teal", 4);
      anim(node.transform.scale, springKeys(st + 0.3, 0.65, [0, 0], [100, 100], 0.14));
      parentTo(node, cam);
      var ic = icon(s5, tag + "ikona", ro[1], 0, 0, 0.82, "purple", 2.6);
      parentTo(ic, node); ic.transform.position.setValue([0, 0]);
      anim(iconTrim(ic), [[st + 0.4, 0], [st + 1.0, 100, "inout"]]);

      var top = i == 0, ly = ny + (top ? -NR - 22 : NR + 46);
      var lab = textLayer(s5, ro[0], F.b, 30, "ink", nx, ly, "c", { name: tag + "etykieta" });
      clipMask(lab, 16); riseIn(lab, st + 0.45, 0.015, 0.4, 38);
      var num = textLayer(s5, "0" + (i + 1), F.b, 15, "teal2", nx, ly + (top ? -38 : 28), "c", { tracking: 200, name: tag + "numer" });
      setOpacityKeys(num, [[st + 0.5, 0], [st + 0.9, 100]]);
      parentTo(lab, cam); parentTo(num, cam);

      // energy pulses travelling into the hub
      var pulses = [[18.0 + i * 0.12 - O, 18], [18.55 - O, 28]];
      for (var p = 0; p < pulses.length; p++) {
        var pl = shapeLayer(s5, tag + "impuls " + (p + 1), [bx, by]);
        newGroup(pl, "kropka"); addEllipse(inner(pl, "kropka"), [pulses[p][1], pulses[p][1]]); addFill(inner(pl, "kropka"), "teal");
        anim(pl.transform.position, [[pulses[p][0], [bx, by]], [pulses[p][0] + 0.45, [ax, ay], "in"]]);
        pl.inPoint = pulses[p][0]; pl.outPoint = pulses[p][0] + 0.46;
        pl.motionBlur = true;
        parentTo(pl, cam);
      }
    }

    // hub
    var hub = pivotNull(s5, "HUB (puls)", HX, HY);
    anim(hub.transform.scale, [[19.0 - O, [100, 100]], [19.08 - O, [110, 110], "out"], [19.6 - O, [100, 100], "inout"]]);
    parentTo(hub, cam);
    var hc = shapeLayer(s5, "hub - kolo", [HX, HY]);
    newGroup(hc, "ring"); addEllipse(inner(hc, "ring"), [HR * 2 + 20, HR * 2 + 20]); addStroke(inner(hc, "ring"), "teal", 3);
    newGroup(hc, "kolo"); addEllipse(inner(hc, "kolo"), [HR * 2, HR * 2]); addFill(inner(hc, "kolo"), "purple");
    parentTo(hc, hub);
    var hl = placeLogo(s5, logoWhite, HX, HY + 4, 19); parentTo(hl, hub);
    var hr = shapeLayer(s5, "hub - fale", [HX, HY]);
    newGroup(hr, "fala 1"); addEllipse(inner(hr, "fala 1"), [300, 300]); addStroke(inner(hr, "fala 1"), "teal", 8);
    newGroup(hr, "fala 2"); addEllipse(inner(hr, "fala 2"), [300, 300]); addStroke(inner(hr, "fala 2"), "purple", 4);
    anim(inner(hr, "fala 1").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[19.0 - O, [300, 300]], [19.8 - O, [1300, 1300], "out"]]);
    anim(inner(hr, "fala 1").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width"), [[19.0 - O, 8], [19.8 - O, 0]]);
    anim(inner(hr, "fala 2").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[19.0 - O, [300, 300]], [19.8 - O, [860, 860], "out"]]);
    anim(inner(hr, "fala 2").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width"), [[19.0 - O, 4], [19.8 - O, 0]]);
    hr.inPoint = 19.0 - O; hr.outPoint = 19.85 - O; parentTo(hr, cam);

    // caption (outside the camera)
    var c1 = textLayer(s5, "Wszyscy.", F.eb, 60, "purple", 90, 935, "l");
    var c2 = textLayer(s5, "W jednym miejscu.", F.m, 40, "ink", 90, 990, "l");
    var c3 = textLayer(s5, "Jedna platforma.", F.m, 40, "teal2", 90, 1040, "l");
    var cs = [[c1, 17.4, 72], [c2, 17.55, 50], [c3, 19.05, 50]];
    for (i = 0; i < cs.length; i++) { clipMask(cs[i][0], 16); riseIn(cs[i][0], cs[i][1] - O, 0.015, 0.45, cs[i][2]); }
  });

  // ======================================================================
  //  SCENE 6 - 20.5-26.0 - CTA (comp time 0 = 20.5 s)
  // ======================================================================
  var s6 = newComp("06_CTA_zapisz_sie", 5.5, FS);
  safe("scena 6", function () {
    var O = 20.5, i;
    s6.bgColor = rgb("purple");
    bgRect(s6, "purple");
    var gl = shapeLayer(s6, "siatka biala");
    newGroup(gl, "v"); addPath(inner(gl, "v"), line(0, 0, 0, H)); addStroke(inner(gl, "v"), "white", 1); addRepeater(inner(gl, "v"), 33, [60, 0]);
    newGroup(gl, "h"); addPath(inner(gl, "h"), line(0, 0, W, 0)); addStroke(inner(gl, "h"), "white", 1); addRepeater(inner(gl, "h"), 19, [0, 60]);
    gl.transform.opacity.setValue(5);

    var TR = [[180, 200, 160, 0.3], [1760, 860, 220, -0.25], [1700, 170, 90, 0.5], [240, 900, 110, -0.4]];
    for (i = 0; i < TR.length; i++) {
      var s = TR[i][2], tl = shapeLayer(s6, "trojkat w tle " + (i + 1), [TR[i][0], TR[i][1]]);
      newGroup(tl, "t"); addPath(inner(tl, "t"), polyline([[0, -s], [s * 0.87, s * 0.5], [-s * 0.87, s * 0.5]], true)); addStroke(inner(tl, "t"), "teal", 3);
      tl.transform.opacity.setValue(35);
      tl.transform.rotation.expression = "(time * " + TR[i][3] + " + " + i + ") * 180 / Math.PI";
      anim(tl.transform.scale, springKeys(0.1 + i * 0.1, 0.6, [0, 0], [100, 100], 0.15));
    }

    // headline
    var full = textWidth(s6, "Nie czekaj!", F.eb, 176, 0), hx = W / 2 - full / 2;
    var hd = textLayer(s6, "Nie czekaj", F.eb, 176, "white", hx, 320, "l");
    var hr = rect(hd);
    textAnimator(hd, "Wejscie (sprezyna)", { scale: [0, 0], opacity: 0 },
      "// kazda litera wskakuje ze sprezyna\nvar t = time - (" + (0) + " + (textIndex - 1) * 0.035);\nvar p = Math.min(Math.max(t / 0.65, 0), 1);\nvar s = p <= 0 ? 0 : 1 - Math.exp(-5.5 * p) * Math.cos(4.5 * Math.PI * p);\nvar a = 100 * (1 - s);\n[a, a, a]");
    var ex = textLayer(s6, "!", F.eb, 176, "teal", hx + hr.left + hr.width + 4, 320, "l");
    anim(ex.transform.scale, springKeys(0.35, 0.4, [0, 0], [100, 100], 0.25));
    ex.transform.rotation.expression = "var t = time - 0.35; t > 0 ? Math.sin(t * 9) * 14 * Math.exp(-t * 2.5) : 0";

    // sub line with marker
    var subFull = textWidth(s6, "Zapisz si\u0119 ju\u017c dzi\u015b.", F.sb, 76, 0), jw = textWidth(s6, "ju\u017c dzi\u015b.", F.sb, 76, 0), sx = W / 2 - subFull / 2;
    var mk = shapeLayer(s6, "zakreslacz", [W / 2 + subFull / 2 - jw - 12, 444]);
    newGroup(mk, "pasek"); addPath(inner(mk, "pasek"), polyline([[0, 4], [jw + 26, 0], [jw + 22, 26], [2, 30]], true)); addFill(inner(mk, "pasek"), "teal");
    anim(gx(mk, "pasek").property("ADBE Vector Scale"), [[0.85, [0, 100]], [1.25, [100, 100], "inout"]]);
    var sa = textLayer(s6, "Zapisz si\u0119", F.sb, 76, "white", sx, 460, "l");
    var sb = textLayer(s6, "ju\u017c dzi\u015b.", F.sb, 76, "white", W / 2 + subFull / 2, 460, "r");
    clipMask(sa, 20); riseIn(sa, 0.5, 0.02, 0.45, 90);
    clipMask(sb, 20); riseIn(sb, 0.6, 0.02, 0.45, 90);

    // button
    var BX = 960, BY = 620, BW = 560, BH = 124;
    var btn = pivotNull(s6, "PRZYCISK", BX, BY);
    anim(btn.transform.scale, [[1.0, [0, 0]], [1.32, [112, 112], "out"], [1.52, [96, 96], "inout"], [1.7, [100, 100], "inout"],
      [2.2, [100, 100]], [2.35, [104, 104], "out"], [2.43, [104, 104]], [2.5, [96, 96], "out"], [2.75, [104, 104], "out"], [3.6, [104, 104]], [3.8, [100, 100], "inout"]]);
    var bs = shapeLayer(s6, "przycisk - cien", [BX, BY + 12]);
    newGroup(bs, "cien"); addRect(inner(bs, "cien"), [BW, BH], [0, 0], 62); addFill(inner(bs, "cien"), "ink", 30);
    parentTo(bs, btn);
    var bb = shapeLayer(s6, "przycisk - tlo", [BX, BY]);
    newGroup(bb, "tlo"); addRect(inner(bb, "tlo"), [BW, BH], [0, 0], 62); addFill(inner(bb, "tlo"), "teal");
    newGroup(bb, "hover"); addRect(inner(bb, "hover"), [BW, BH], [0, 0], 62); addFill(inner(bb, "hover"), "white");
    anim(gx(bb, "hover").property("ADBE Vector Group Opacity"), [[2.2, 0], [2.35, 14], [3.6, 14], [3.8, 0]]);
    parentTo(bb, btn);
    // click ripple, clipped to the button with an alpha matte
    var rp = shapeLayer(s6, "przycisk - fala klikniecia", [BX + 150, BY + 20]);
    newGroup(rp, "fala"); addEllipse(inner(rp, "fala"), [10, 10]); addFill(inner(rp, "fala"), "white", 45);
    anim(inner(rp, "fala").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[2.5, [0, 0]], [3.1, [1200, 1200], "out"]]);
    anim(rp.transform.opacity, [[2.5, 100], [3.1, 0]]);
    parentTo(rp, btn);
    var mt = shapeLayer(s6, "przycisk - matte", [BX, BY]);
    newGroup(mt, "m"); addRect(inner(mt, "m"), [BW, BH], [0, 0], 62); addFill(inner(mt, "m"), "white");
    parentTo(mt, btn);
    try { if (typeof rp.setTrackMatte == "function") rp.setTrackMatte(mt, TrackMatteType.ALPHA); else { mt.moveBefore(rp); rp.trackMatteType = TrackMatteType.ALPHA; } } catch (e) {}
    var bt = textLayer(s6, "Zapisz si\u0119", F.b, 48, "purple", BX - 30, BY + 17, "c", { name: "przycisk - tekst" });
    parentTo(bt, btn);
    var ar = shapeLayer(s6, "przycisk - strzalka", [BX + 135, BY]);
    newGroup(ar, "s"); addPath(inner(ar, "s"), polyline([[-34, 0], [6, 0]])); addPath(inner(ar, "s"), polyline([[-12, -18], [6, 0], [-12, 18]])); addStroke(inner(ar, "s"), "purple", 7);
    ar.transform.position.expression = "value + [Math.sin(time * 7) * 5, 0]";
    parentTo(ar, btn);

    // confetti: little brand triangles (one layer, one group per piece, physics in expressions)
    var cf = shapeLayer(s6, "konfetti", [0, 0]);
    var seed = 5;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var cols = ["teal", "white", "lilac"];
    for (i = 0; i < 60; i++) {
      var A = -Math.PI * (0.1 + rnd() * 0.8), V = 500 + rnd() * 1100, S = 10 + rnd() * 16, SP = (rnd() - 0.5) * 14, ck = rnd();
      var gn = "k" + (i + 1);
      newGroup(cf, gn);
      addPath(inner(cf, gn), polyline([[0, -S * 0.6], [S * 0.52, S * 0.3], [-S * 0.52, S * 0.3]], true));
      addFill(inner(cf, gn), ck > 0.6 ? cols[0] : (ck > 0.25 ? cols[1] : cols[2]));
      gx(cf, gn).property("ADBE Vector Position").expression = "var t = Math.max(0, time - 2.5), d = " + V.toFixed(1) + " * (1 - Math.exp(-t * 3)) / 3;\n[" + BX + " + Math.cos(" + A.toFixed(4) + ") * d, " + (BY - 20) + " + Math.sin(" + A.toFixed(4) + ") * d + 420 * t * t]";
      gx(cf, gn).property("ADBE Vector Rotation").expression = SP.toFixed(3) + " * Math.max(0, time - 2.5) * 180 / Math.PI";
      gx(cf, gn).property("ADBE Vector Group Opacity").expression = "time < 2.5 ? 0 : Math.max(0, Math.min(1, 1.6 - (time - 2.5))) * 100";
    }
    cf.inPoint = 2.45; cf.outPoint = 4.8;

    // cursor
    var cu = shapeLayer(s6, "kursor", [1560, 1040]);
    newGroup(cu, "strzalka");
    addPath(inner(cu, "strzalka"), polyline([[0, 0], [0, 30], [8, 23], [13, 35], [19, 32], [14, 21], [24, 21]], true));
    addFill(inner(cu, "strzalka"), "white"); addStroke(inner(cu, "strzalka"), "ink", 1.6);
    cu.transform.scale.setValue([170, 170]);
    anim(cu.transform.position, [[1.5, [1560, 1040]], [1.925, [1255, 780], "inout"], [2.35, [1110, 640], "out"], [3.5, [1110, 640]], [4.1, [1700, 1150], "in"]]);
    anim(cu.transform.scale, [[2.43, [170, 170]], [2.5, [145, 145], "out"], [2.7, [170, 170], "out"]]);
    cu.inPoint = 1.45; cu.outPoint = 4.1; cu.motionBlur = true;

    // tagline + logo
    var tg = textLayer(s6, "Do\u0142\u0105cz do rewolucji na rynku budowlanym.", F.m, 40, "white", W / 2, 800, "c");
    tg.transform.opacity.setValue(85);
    clipMask(tg, 16); riseIn(tg, 3.0, 0.01, 0.5, 50);
    var lg = placeLogo(s6, logoWhite, W / 2, 980, 34);
    anim(lg.transform.position, [[3.5, [W / 2, 980]], [4.1, [W / 2, 940], "out"]]);
    anim(lg.transform.opacity, [[3.5, 0], [4.1, 100, "out"]]);
  });

  // ======================================================================
  //  MAIN - scenes, transitions, sound
  // ======================================================================
  safe("montaz", function () {
    var ref = new File(HERE.parent.fsName + "/budoexpert-promo.mp4"), snd = new File(HERE.parent.fsName + "/soundtrack.wav");
    if (ref.exists) {
      var ri = proj.importFile(new ImportOptions(ref)); ri.parentFolder = FA;
      var rl = main.layers.add(ri); rl.name = "REFERENCJA (wlacz oko, zeby porownac)"; rl.enabled = false; rl.guideLayer = true;
      try { rl.audioEnabled = false; } catch (e) {}
    }
    if (snd.exists) {
      var si = proj.importFile(new ImportOptions(snd)); si.parentFolder = FA;
      var sl = main.layers.add(si); sl.name = "MUZYKA";
    }

    var L6 = placeComp(main, s6, 20.5, "06 CTA");
    var L5 = placeComp(main, s5, 15.0, "05 HUB");
    L5.outPoint = 20.5;
    // hub -> CTA: purple circle grows out of the hub
    var ex = shapeLayer(main, "przejscie: hub -> CTA", [960, 540]);
    newGroup(ex, "kolo"); addEllipse(inner(ex, "kolo"), [300, 300]); addFill(inner(ex, "kolo"), "purple");
    anim(inner(ex, "kolo").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"), [[20.0, [300, 300]], [20.5, [2400, 2400], "in"]]);
    ex.inPoint = 20.0; ex.outPoint = 20.5;
    var exl = placeLogo(main, logoWhite, 960, 544, 19);
    anim(exl.transform.scale, [[20.0, [19, 19]], [20.2, [40, 40], "in"]]);
    anim(exl.transform.opacity, [[20.0, 100], [20.2, 0]]);
    exl.inPoint = 20.0; exl.outPoint = 20.5; exl.name = "przejscie: logo z hubu";

    var L3 = placeComp(main, s3, 7.5, "03 PYTANIA");
    L3.outPoint = 12.4;
    anim(L3.transform.position, [[7.5, [960, 1620]], [8.0, [960, 540], "expo"]]);
    var L2 = placeComp(main, s2, 4.5, "02 PLATFORMA");
    anim(L2.transform.position, [[7.5, [960, 540]], [8.0, [960, -540], "expo"]]);
    placeComp(main, s1, 0, "01 LOGO");

    var L4 = placeComp(main, s4, 12.0, "04 REWOLUCJA");
    anim(L4.transform.scale, [[15.0, [100, 100]], [15.5, [13, 13], "expo"]]);
    var iris = shapeLayer(main, "przejscie: iris (matte dla 04)", [960, 540]);
    newGroup(iris, "kolo"); addEllipse(inner(iris, "kolo"), [10, 10]); addFill(inner(iris, "kolo"), "white");
    anim(inner(iris, "kolo").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size"),
      [[12.0, [0, 0]], [12.35, [2300, 2300], "inout"], [15.0, [2300, 2300]], [15.5, [300, 300], "expo"]]);
    iris.inPoint = 12.0; iris.outPoint = 15.5;
    try { if (typeof L4.setTrackMatte == "function") L4.setTrackMatte(iris, TrackMatteType.ALPHA); else { iris.moveBefore(L4); L4.trackMatteType = TrackMatteType.ALPHA; } } catch (e) {}
    var ring = shapeLayer(main, "przejscie: turkusowy pierscien", [960, 540]);
    newGroup(ring, "p"); addEllipse(inner(ring, "p"), [10, 10]); addStroke(inner(ring, "p"), "teal", 18);
    inner(ring, "p").property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").expression =
      'var s = thisComp.layer("przejscie: iris (matte dla 04)").content("kolo").content(1).size; s + [60, 60]';
    ring.inPoint = 12.0; ring.outPoint = 12.4;
    var inl = placeLogo(main, logoWhite, 960, 544, 19);
    anim(inl.transform.opacity, [[15.25, 0], [15.5, 100]]);
    inl.inPoint = 15.2; inl.outPoint = 15.5; inl.name = "przejscie: logo do hubu";

    var tb = main.layers.add(tbComp); tb.name = "tabliczka (arkusz)";
    tb.transform.opacity.expression = "(time < 12 || (time >= 15.5 && time < 20)) ? 100 * Math.min(1, Math.max(0, (time - 0.2) / 0.4)) : 0";
    ctrl.moveToBeginning();
  });

  // motion blur on every layer that can take it
  safe("motion blur", function () {
    for (var i = 1; i <= proj.numItems; i++) {
      var it = proj.item(i);
      if (!(it instanceof CompItem)) continue;
      for (var j = 1; j <= it.numLayers; j++) { try { if (!it.layer(j).nullLayer) it.layer(j).motionBlur = true; } catch (e) {} }
    }
  });

  main.openInViewer();
  app.endUndoGroup();

  var saved = "";
  try { var out = new File(HERE.fsName + "/budoexpert-promo.aep"); proj.save(out); saved = out.fsName; } catch (e) { ERR.push("zapis: " + e.toString()); }

  var msg = "Projekt budoexpert gotowy.\n" + (saved ? "Zapisano: " + saved + "\n" : "") +
    "\nKolory marki: warstwa KONTROLA_MARKI w " + MAIN + ".\nTeksty: kliknij dwukrotnie warstwe tekstowa w danej scenie.\n";
  if (ERR.length) msg += "\nOstrzezenia (" + ERR.length + "):\n" + ERR.join("\n");
  alert(msg);
})();
