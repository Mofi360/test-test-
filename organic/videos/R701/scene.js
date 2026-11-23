/* R701 – Murmelrennen „Welches Sternzeichen küsst am besten?“ [KI]
 * Die Physik steht in sim.js (dieselbe Datei nutzt make_sfx.js für den Ton). Hier wird sie nur abgespielt:
 * Welt (Bahn, Murmeln, Schweife, Funken) auf einem Canvas, Schrift und Ranglisten als DOM darüber.
 * Alles hängt nur von t ab – nichts wird zwischen den Frames gemerkt. */
(function () { const s = document.currentScript.src.replace(/scene\.js.*$/, 'sim.js'); document.write('<script src="' + s + '"><\/script>'); })();
{
const { el, C, F, tw, pr, ease, clamp, lerp } = DT;

// ---------- Farben ----------
const BG = '#110A13', LANE = '#1D1221', LANE2 = '#251729', LINE = '#3A2140';
const PINK = '#FF3D7F', ROSA = '#FF8FB3', HELL = '#FFD9E4', ROT = '#E3173B', WEISS = '#FFFFFF', TINTE = '#2A0F1E';

// 12 Sternzeichen = 12 Lippenstift-Töne. Glyphen selbst gezeichnet (Kasten ±50).
const SIGNS = [
  { name: 'Widder', col: '#E8212F', ton: 'Rot', g: 'M-30 -4 C-44 -30 -12 -44 0 -10 C12 -44 44 -30 30 -4 M0 -10 L0 40' },
  { name: 'Stier', col: '#9A3B26', ton: 'Braunrot', g: 'M-30 -40 C-24 -12 24 -12 30 -40 M21 14 A21 21 0 1 1 -21 14 A21 21 0 1 1 21 14' },
  { name: 'Zwillinge', col: '#FF8B5E', ton: 'Pfirsich', g: 'M-30 -36 C-12 -27 12 -27 30 -36 M-30 36 C-12 27 12 27 30 36 M-13 -29 L-13 29 M13 -29 L13 29' },
  { name: 'Krebs', col: '#F27FA2', ton: 'Rosé', g: 'M-34 -10 C-28 -36 14 -38 36 -20 M-8 -12 A12 12 0 1 1 -32 -12 A12 12 0 1 1 -8 -12 M34 10 C28 36 -14 38 -36 20 M32 12 A12 12 0 1 1 8 12 A12 12 0 1 1 32 12' },
  { name: 'Löwe', col: '#FF5347', ton: 'Koralle', g: 'M-6 6 A13 13 0 1 1 -32 6 A13 13 0 1 1 -6 6 M-7 0 C-24 -46 28 -48 20 -12 C16 6 4 22 14 33 C21 40 32 36 34 26' },
  { name: 'Jungfrau', col: '#C98A70', ton: 'Nude', g: 'M-36 -30 L-36 28 M-36 -16 C-30 -34 -14 -34 -14 -16 L-14 28 M-14 -16 C-8 -34 8 -34 8 -16 L8 18 C8 34 22 40 34 30 M8 0 C30 -18 42 6 22 22 L2 40' },
  { name: 'Waage', col: '#FF4FA0', ton: 'Pink', g: 'M-36 32 L36 32 M-36 10 L-15 10 C-34 -32 34 -32 15 10 L36 10' },
  { name: 'Skorpion', col: '#7E1436', ton: 'Weinrot', g: 'M-38 -28 L-38 28 M-38 -16 C-32 -34 -16 -34 -16 -16 L-16 28 M-16 -16 C-10 -34 6 -34 6 -16 L6 16 C6 30 18 34 34 28 M22 14 L36 27 L20 38' },
  { name: 'Schütze', col: '#D926B0', ton: 'Fuchsia', g: 'M-32 32 L32 -32 M4 -32 L32 -32 L32 -4 M-22 -4 L4 22' },
  { name: 'Steinbock', col: '#9F6C9B', ton: 'Mauve', g: 'M-38 -30 C-28 -30 -24 -8 -20 18 C-18 -10 -8 -32 4 -30 C14 -28 12 0 12 14 C12 32 0 40 -8 32 M12 16 C12 0 36 -2 36 16 C36 32 14 32 12 16' },
  { name: 'Wassermann', col: '#B02466', ton: 'Beere', g: 'M-38 -8 L-23 -24 L-8 -8 L8 -24 L23 -8 L38 -24 M-38 22 L-23 6 L-8 22 L8 6 L23 22 L38 6' },
  { name: 'Fische', col: '#BE0F2C', ton: 'Kirschrot', g: 'M-30 -36 C-10 -15 -10 15 -30 36 M30 -36 C10 -15 10 15 30 36 M-22 0 L22 0' },
];
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
const rgba = (h, a) => { const A = hex(h); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; };
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** Glänzende Murmel als Canvas (Radius r, doppelt aufgelöst). */
function marbleSprite(i, r, res = 2) {
  const s = SIGNS[i], pad = 6, D = (r + pad) * 2, cv = document.createElement('canvas');
  cv.width = cv.height = D * res; const x = cv.getContext('2d'); x.scale(res, res); x.translate(D / 2, D / 2);
  const g = x.createRadialGradient(-r * .36, -r * .42, r * .08, -r * .1, -r * .1, r * 1.22);
  g.addColorStop(0, mix(s.col, '#ffffff', .5)); g.addColorStop(.4, s.col); g.addColorStop(1, mix(s.col, '#14030a', .58));
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill();
  // Randlicht (trennt auch dunkle Töne vom Hintergrund)
  x.lineWidth = r * .075; x.strokeStyle = rgba('#FFFFFF', .34); x.beginPath(); x.arc(0, 0, r - r * .04, 0, 7); x.stroke();
  x.lineWidth = r * .09; x.strokeStyle = rgba('#FFFFFF', .2); x.lineCap = 'round'; x.beginPath(); x.arc(0, 0, r * .8, .5, 1.25); x.stroke();
  // Glyphe
  const p = new Path2D(s.g), k = r / 78; x.save(); x.translate(0, r * .04); x.scale(k, k); x.lineCap = 'round'; x.lineJoin = 'round';
  x.lineWidth = 17; x.strokeStyle = rgba('#3A0718', .5); x.stroke(p);
  x.lineWidth = 9.5; x.strokeStyle = '#fff'; x.stroke(p); x.restore();
  // Glanzlicht
  x.save(); x.translate(-r * .4, -r * .5); x.rotate(-.7); x.fillStyle = rgba('#FFFFFF', .82); x.beginPath(); x.ellipse(0, 0, r * .25, r * .12, 0, 0, 7); x.fill(); x.restore();
  x.fillStyle = rgba('#FFFFFF', .7); x.beginPath(); x.arc(-r * .66, -r * .2, r * .055, 0, 7); x.fill();
  return cv;
}

const LIPS_UP = 'M-50 0 C-36 -9 -21 -19 -8 -13 C-3 -10 3 -10 8 -13 C21 -19 36 -9 50 0 C30 3 14 2 0 4 C-14 2 -30 3 -50 0Z';
const LIPS_LO = 'M-50 0 C-30 3 -14 2 0 4 C14 2 30 3 50 0 C37 16 18 23 0 22 C-18 23 -37 16 -50 0Z';
const HEART = 'M0 .92 C-1.12 .2 -1.02 -.62 -.5 -.82 C-.2 -.92 0 -.7 0 -.44 C0 -.7 .2 -.92 .5 -.82 C1.02 -.62 1.12 .2 0 .92Z';

let SIMC = null;
const sim = () => SIMC || (SIMC = R701SIM.simulate(R701SIM.CFG.seed));

SCENES.s1 = { bg: BG, paper: false, build(root) {
  const R = sim(), T = R.track, n = SIGNS.length, FPS = R.cfg.fps, NF = R.frames.length, RAD = R.cfg.r;
  const TW = R.tWin, TL = R.tLast, TE = TL + 0.75, DUR = R.total;
  const { XL, XR, CX } = T;
  const finT = new Array(n).fill(1e9), place = new Array(n).fill(0);
  R.finish.forEach((f, k) => { finT[f.i] = f.t; place[f.i] = k + 1; });
  const sprites = SIGNS.map((_, i) => marbleSprite(i, RAD));

  // ---------- Positionen ----------
  const v0 = R.frames[0].map((v, k) => (R.frames[1][k] - v) * FPS);
  const pos = (i, t, out) => {
    if (t < 0) { out[0] = R.frames[0][i * 2] + v0[i * 2] * t; out[1] = R.frames[0][i * 2 + 1] + v0[i * 2 + 1] * t; return out; }
    const ff = Math.min(t * FPS, NF - 1), f0 = Math.floor(ff), f1 = Math.min(NF - 1, f0 + 1), k = ff - f0;
    out[0] = lerp(R.frames[f0][i * 2], R.frames[f1][i * 2], k); out[1] = lerp(R.frames[f0][i * 2 + 1], R.frames[f1][i * 2 + 1], k); return out;
  };

  // ---------- Reihenfolge je Frame (ruhig: offizielle Führung aus sim.js, dahinter mit Hysterese) ----------
  const order = [];
  { let cur = SIGNS.map((_, i) => i).sort((a, b) => R.frames[0][b * 2 + 1] - R.frames[0][a * 2 + 1]); let lc = 0, leader = -1;
    for (let f = 0; f < NF; f++) {
      const t = f / FPS, fr = R.frames[f];
      while (lc < R.leadChanges.length && R.leadChanges[lc].t <= t + 1e-6) leader = R.leadChanges[lc++].a;
      const key = i => finT[i] <= t ? 1e7 - place[i] * 1e4 : fr[i * 2 + 1] + (i === leader && t < TW ? 60 : 0);
      for (let pass = 0; pass < n; pass++) for (let k = 0; k < n - 1; k++) { if (key(cur[k + 1]) > key(cur[k]) + (finT[cur[k + 1]] <= t ? 0 : 42)) { const h = cur[k]; cur[k] = cur[k + 1]; cur[k + 1] = h; } }
      order.push(cur.slice());
    } }
  const nFin = t => { let k = 0; for (let i = 0; i < n; i++) if (finT[i] <= t) k++; return k; };

  // ---------- Kamera (geglättet, kennt die Zukunft → weich und ohne Nachziehen) ----------
  const CAM_END = T.fin - 1085;
  let camArr = new Float64Array(NF);
  for (let f = 0; f < NF; f++) {
    const t = f / FPS, fr = R.frames[f], o = order[f];
    let target;
    if (t >= TW) target = CAM_END;
    else { const y1 = fr[o[0] * 2 + 1], y3 = fr[o[2] * 2 + 1]; target = Math.max(y1 * .62 + y3 * .38 - 1060, y1 - 1330); }
    camArr[f] = clamp(target, 0, CAM_END);
  }
  for (let pass = 0; pass < 3; pass++) { const src = camArr, dst = new Float64Array(NF), w = 9; for (let f = 0; f < NF; f++) { let s = 0, c = 0; for (let k = -w; k <= w; k++) { const q = clamp(f + k, 0, NF - 1); s += src[q]; c++; } dst[f] = s / c; } camArr = dst; }
  const camAt = t => { const ff = clamp(t * FPS, 0, NF - 1), f0 = Math.floor(ff), f1 = Math.min(NF - 1, f0 + 1); return lerp(camArr[f0], camArr[f1], ff - f0); };

  // ---------- Treffer-Index (für Puls-Effekte) + Ereignislisten ----------
  const hitIdx = {};
  const CK = { peg: 1, knob: 1, heart: 1, puder: 1, bumper: 1 };
  R.events.forEach(e => { const key = CK[e.type] ? 'c' + e.b : e.type === 'rotor' ? 'r' + e.b : null; if (key) (hitIdx[key] || (hitIdx[key] = [])).push(e.t); });
  const since = (key, t) => { const a = hitIdx[key]; if (!a) return 9; let lo = 0, hi = a.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m] <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r < 0 ? 9 : t - a[r]; };
  const sparks = R.events.filter(e => (e.type === 'bumper' && e.s > 120) || (e.type !== 'lead' && e.type !== 'finish' && e.type !== 'nudge' && e.s > 430));
  const shakes = R.events.filter(e => (e.type === 'bumper' && e.s > 260) || e.type === 'finish');
  const evFrom = (arr, t) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m].t < t) lo = m + 1; else hi = m; } return lo; };
  // Stau im Trichter
  let jam0 = -1, jam1 = -1;
  for (let f = 0; f < NF; f++) { let k = 0; for (let i = 0; i < n; i++) { const y = R.frames[f][i * 2 + 1]; if (y > T.funnel.y0 - 140 && y < T.funnel.yNeck + 10) k++; } if (k >= 5 && jam0 < 0) jam0 = f / FPS; if (k >= 4 && jam0 >= 0) jam1 = f / FPS; }

  // ---------- Welt-Canvas ----------
  const cv = el('canvas', { left: 0, top: 0 }, root); cv.width = 1080; cv.height = 1920;
  const x = cv.getContext('2d');
  const P_UP = new Path2D(LIPS_UP), P_LO = new Path2D(LIPS_LO), P_HEART = new Path2D(HEART);
  const ramps = T.segs.filter(s => s.kind === 'ramp');
  const tmp = [0, 0], tmp2 = [0, 0];
  const pulse = (d, len = .22) => d < len ? 1 - d / len : 0;

  function heart(cx, cy, s, fill, rot = 0) { x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s); x.fillStyle = fill; x.fill(P_HEART); x.restore(); }
  function lips(cx, cy, s, col, hi = 0) {
    x.save(); x.translate(cx, cy); x.scale(s, s);
    x.fillStyle = hi > 0 ? mix(col, '#ffffff', hi * .7) : col; x.fill(P_UP); x.fillStyle = hi > 0 ? mix(col, '#ffffff', hi * .6) : mix(col, '#ffffff', .12); x.fill(P_LO);
    x.strokeStyle = rgba('#3A0718', .55); x.lineWidth = 2.2; x.lineCap = 'round'; x.beginPath(); x.moveTo(-46, 0); x.bezierCurveTo(-28, 3, -14, 2, 0, 4); x.bezierCurveTo(14, 2, 28, 3, 46, 0); x.stroke();
    x.fillStyle = rgba('#FFFFFF', .38); x.beginPath(); x.ellipse(-14, 11, 11, 3.2, -.08, 0, 7); x.fill(); x.restore();
  }
  /** Lippenstift entlang einer Strecke: Hülse von A, Mine an der Spitze B */
  function stickLine(ax, ay, bx, by, r, col, tube = .55) {
    const dx = bx - ax, dy = by - ay, L = Math.sqrt(dx * dx + dy * dy) || 1, a = Math.atan2(dy, dx);
    x.save(); x.translate(ax, ay); x.rotate(a);
    x.fillStyle = col; rr(-r, -r, L + 2 * r, 2 * r, r); x.fill();                                   // Mine (rund)
    x.fillStyle = mix(col, '#ffffff', .35); rr(L * tube + 6, -r * .55, L * (1 - tube) - 2, r * .32, r * .16); x.fill();
    x.fillStyle = HELL; x.fillRect(L * tube - 22, -r, 22, 2 * r);                                  // Zwinge
    x.fillStyle = TINTE; rr(-r, -r - 2, L * tube - 20 + r, 2 * r + 4, 9); x.fill();                 // Hülse
    x.fillStyle = rgba('#FFFFFF', .16); x.fillRect(-r + 10, -r + 4, L * tube - 36 + r, 5);
    x.strokeStyle = ROSA; x.lineWidth = 2.5; rr(-r, -r - 2, L * tube - 20 + r, 2 * r + 4, 9); x.stroke();
    x.restore();
  }
  function rr(X, Y, W, H, r) { r = Math.min(r, Math.abs(W) / 2, Math.abs(H) / 2); x.beginPath(); x.moveTo(X + r, Y); x.lineTo(X + W - r, Y); x.arcTo(X + W, Y, X + W, Y + r, r); x.lineTo(X + W, Y + H - r); x.arcTo(X + W, Y + H, X + W - r, Y + H, r); x.lineTo(X + r, Y + H); x.arcTo(X, Y + H, X, Y + H - r, r); x.lineTo(X, Y + r); x.arcTo(X, Y, X + r, Y, r); x.closePath(); }
  function note(text, X, Y, rot, size = 66, col = ROSA, al = 'left') { x.save(); x.translate(X, Y); x.rotate(rot); x.font = `700 ${size}px Caveat`; x.textAlign = al; x.fillStyle = col; x.fillText(text, 0, 0); x.restore(); }
  function arrow(pts, col = ROSA, w = 5) { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0], pts[1]); x.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); x.stroke(); const a = Math.atan2(pts[5] - pts[3], pts[4] - pts[2]); x.beginPath(); x.moveTo(pts[4] - Math.cos(a - .5) * 22, pts[5] - Math.sin(a - .5) * 22); x.lineTo(pts[4], pts[5]); x.lineTo(pts[4] - Math.cos(a + .5) * 22, pts[5] - Math.sin(a + .5) * 22); x.stroke(); }

  function drawWorld(t) {
    const cam = camAt(t), y0 = cam - 160, y1 = cam + 2080;
    // Wackeln (Bumper, Zieleinlauf)
    let shx = 0, shy = 0;
    for (let k = evFrom(shakes, t - .45); k < shakes.length && shakes[k].t <= t; k++) {
      const e = shakes[k], d = t - e.t, amp = (e.type === 'finish' ? (e.s === 1 ? 26 : 7) : 4 + clamp(e.s / 700) * 6) * Math.exp(-d / .1);
      shx += amp * Math.cos(d * 62 + k * 2.4); shy += amp * Math.sin(d * 55 + k * 1.7);
    }
    shx = clamp(shx, -28, 28); shy = clamp(shy, -28, 28);
    x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = BG; x.fillRect(0, 0, 1080, 1920);
    x.setTransform(1, 0, 0, 1, shx, shy - cam);
    // Bahn
    x.fillStyle = LANE; x.fillRect(XL, y0, XR - XL, y1 - y0);
    // leise Deko in der Bahn (halbe Kamerageschwindigkeit): große Lippen- und Herz-Umrisse
    for (let k = Math.floor((cam * .5 - 200) / 760); k <= Math.floor((cam * .5 + 2100) / 760); k++) {
      const yy = k * 760 + cam * .5 + 200, xx = 250 + rnd(k + 5) * 540, sc = 2.6 + rnd(k) * 1.6;
      x.save(); x.translate(xx, yy); x.rotate((rnd(k + 9) - .5) * .7); x.scale(sc, sc); x.strokeStyle = LANE2; x.lineWidth = 5 / sc * 2.2;
      if (k % 2) { x.stroke(P_UP); x.stroke(P_LO); } else { x.scale(46, 46); x.lineWidth = .1; x.stroke(P_HEART); } x.restore();
    }
    // Abschnittslinien
    T.sections.forEach((s, k) => { if (k === 0 || s.id === 'ziel' || s.y0 < y0 || s.y0 > y1) return; x.strokeStyle = LINE; x.lineWidth = 3; x.setLineDash([4, 18]); x.beginPath(); x.moveTo(XL + 20, s.y0); x.lineTo(XR - 20, s.y0); x.stroke(); x.setLineDash([]); });
    // rechter Deko-Streifen: kleine Herzen
    for (let k = Math.floor(y0 / 260); k <= Math.floor(y1 / 260); k++) heart(1020, k * 260 + 90, 13 + (k % 3) * 3, k % 4 === 0 ? rgba(PINK, .55) : '#2C1932', (k % 2 ? .25 : -.2));
    // Wände
    x.fillStyle = PINK; x.fillRect(XL - 7, y0, 7, y1 - y0); x.fillRect(XR, y0, 7, y1 - y0);
    x.fillStyle = rgba('#FFFFFF', .35); x.fillRect(XL - 7, y0, 2, y1 - y0); x.fillRect(XR, y0, 2, y1 - y0);

    // ----- Ziel -----
    if (T.fin > y0 - 400 && T.fin < y1 + 300) {
      x.save(); x.font = `400 250px Gloock`; x.textAlign = 'center'; x.fillStyle = '#34203A'; x.fillText('ZIEL', CX, T.fin + 300); x.restore();
      const br = clamp((t - TW) / .5), sq = 37.0833, rows = 2;
      for (let side = 0; side < 2; side++) {
        x.save(); x.globalAlpha = 1 - pr(t, TW + .35, TW + .9); x.translate(side ? XR : XL, T.fin + ease.inCubic(br) * 60); x.rotate((side ? -1 : 1) * ease.outCubic(br) * 1.25 + (br > 0 ? Math.sin((t - TW) * 9) * .06 * (1 - clamp((t - TW) / 2)) : 0)); if (side) x.scale(-1, 1);
        for (let c2 = 0; c2 < 12; c2++) for (let r2 = 0; r2 < rows; r2++) { x.fillStyle = (c2 + r2) % 2 ? WEISS : PINK; x.fillRect(c2 * sq, -18 + r2 * 18, sq + .5, 18); }
        x.restore();
      }
      // Auffangbecken
      const fl = T.segs.filter(s => s.kind === 'floor');
      x.strokeStyle = ROSA; x.lineWidth = 28; x.lineCap = 'round'; x.beginPath(); x.moveTo(fl[0].x1, fl[0].y1); x.lineTo(fl[0].x2, fl[0].y2); x.lineTo(fl[1].x1, fl[1].y1); x.stroke();
      x.fillStyle = BG; x.fillRect(XL, T.floorY + 26, XR - XL, 700);
    }

    // ----- feste Hindernisse -----
    for (let k = 0; k < T.segs.length; k++) {
      const s = T.segs[k]; if (Math.max(s.y1, s.y2) < y0 || Math.min(s.y1, s.y2) > y1 || s.kind === 'floor') continue;
      if (s.kind === 'ramp') {
        // Lipliner-Stift: Schaft von der Wand, gespitzte Mine am freien Ende
        const dx = s.x2 - s.x1, dy = s.y2 - s.y1, L = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx), col = [ROT, '#FF4FA0', '#B02466', '#FF5347'][ramps.indexOf(s) % 4];
        x.save(); x.translate(s.x1, s.y1); x.rotate(a);
        x.fillStyle = col; rr(-30, -s.r, L - 40, 2 * s.r, 6); x.fill();
        x.fillStyle = rgba('#FFFFFF', .22); x.fillRect(-30, -s.r + 4, L - 44, 5);
        x.fillStyle = HELL; x.fillRect(L - 150, -s.r, 16, 2 * s.r); x.fillRect(L - 122, -s.r, 6, 2 * s.r);
        x.fillStyle = '#F1C9B5'; x.beginPath(); x.moveTo(L - 72, -s.r); x.lineTo(L - 6, -7); x.lineTo(L - 6, 7); x.lineTo(L - 72, s.r); x.closePath(); x.fill();
        x.fillStyle = col; x.beginPath(); x.moveTo(L - 26, -10.5); x.quadraticCurveTo(L + 22, 0, L - 26, 10.5); x.closePath(); x.fill();
        x.restore();
      } else if (s.kind === 'funnel') {
        const left = s.x1 < CX, wx = left ? XL : XR;
        x.fillStyle = '#2E1934'; x.beginPath(); x.moveTo(wx, s.y1); x.lineTo(s.x2, s.y2); x.lineTo(s.x2 + (left ? -8 : 8), s.y2 + 92); x.lineTo(wx, s.y2 + 150); x.closePath(); x.fill();
        for (let q = 0; q < 3; q++) heart(left ? XL + 62 + q * 58 : XR - 62 - q * 58, s.y1 + 150 + q * 34, 13, '#4A2A52', left ? -.3 : .3);
        x.strokeStyle = PINK; x.lineWidth = 2 * s.r; x.lineCap = 'round'; x.beginPath(); x.moveTo(s.x1, s.y1); x.lineTo(s.x2, s.y2); x.stroke();
        x.strokeStyle = rgba('#FFFFFF', .4); x.lineWidth = 3; x.beginPath(); x.moveTo(s.x1, s.y1 - 6); x.lineTo(s.x2, s.y2 - 6); x.stroke();
      } else {
        x.strokeStyle = s.kind === 'shelf' ? ROSA : PINK; x.lineWidth = 2 * s.r; x.lineCap = 'round'; x.beginPath(); x.moveTo(s.x1, s.y1); x.lineTo(s.x2, s.y2); x.stroke();
        x.strokeStyle = rgba('#FFFFFF', .4); x.lineWidth = 3; x.beginPath(); x.moveTo(s.x1, s.y1 - s.r * .45); x.lineTo(s.x2, s.y2 - s.r * .45); x.stroke();
      }
    }
    x.save(); x.beginPath(); x.rect(XL, y0, XR - XL, y1 - y0); x.clip();
    for (let k = 0; k < T.circles.length; k++) {
      const c = T.circles[k]; if (c.y + c.r + 30 < y0 || c.y - c.r - 30 > y1) continue;
      const d = since('c' + k, t), pu = pulse(d);
      if (c.kind === 'peg') {
        if (pu > 0) { x.strokeStyle = rgba('#FFFFFF', pu * .8); x.lineWidth = 3; x.beginPath(); x.arc(c.x, c.y, c.r + 6 + (1 - pu) * 22, 0, 7); x.stroke(); }
        x.fillStyle = pu > 0 ? WEISS : HELL; x.beginPath(); x.arc(c.x, c.y, c.r + pu * 4, 0, 7); x.fill();
        x.fillStyle = rgba(PINK, .55); x.beginPath(); x.arc(c.x + 3, c.y + 4, c.r * .55, 0, 7); x.fill();
        x.fillStyle = WEISS; x.beginPath(); x.arc(c.x - 4, c.y - 5, 4, 0, 7); x.fill();
      } else if (c.kind === 'knob') {
        x.fillStyle = mix('#C22C63', '#ffffff', pu * .5); x.beginPath(); x.arc(c.x, c.y, c.r, 0, 7); x.fill();
        x.fillStyle = mix(PINK, '#ffffff', pu * .5); x.beginPath(); x.arc(c.x, c.y, c.r - 12, 0, 7); x.fill();
      } else if (c.kind === 'heart') {
        if (pu > 0) heart(c.x, c.y + 2, (c.r + 10 + (1 - pu) * 26) * 1.12, rgba(PINK, pu * .35));
        heart(c.x, c.y + 2, c.r * 1.14 * (1 + pu * .2), pu > 0 ? mix(PINK, '#ffffff', pu * .7) : PINK);
        x.fillStyle = rgba('#FFFFFF', .55); x.beginPath(); x.ellipse(c.x - 10, c.y - 9, 6, 3.5, -.6, 0, 7); x.fill();
      } else if (c.kind === 'puder') {
        // Puderdose von oben: Deckelrand, Spiegelfläche, geprägtes Herz
        x.fillStyle = mix(PINK, '#ffffff', pu * .3); x.beginPath(); x.arc(c.x, c.y, c.r, 0, 7); x.fill();
        x.fillStyle = TINTE; x.beginPath(); x.arc(c.x, c.y, c.r - 9, 0, 7); x.fill();
        x.fillStyle = '#F6C7D4'; x.beginPath(); x.arc(c.x, c.y, c.r - 16, 0, 7); x.fill();
        x.fillStyle = '#FBE3E9'; x.beginPath(); x.arc(c.x - 5, c.y - 6, c.r - 30, 0, 7); x.fill();
        heart(c.x, c.y + 3, 30, '#F2A9BE');
        x.strokeStyle = rgba('#FFFFFF', .85); x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.arc(c.x, c.y, c.r - 26, 3.5, 4.4); x.stroke();
      } else if (c.kind === 'bumper') {
        const sc = 1 + pulse(d, .26) * .16, pb = pulse(d, .3);
        if (pb > 0) { x.strokeStyle = rgba(PINK, pb * .9); x.lineWidth = 7 * pb + 1; x.beginPath(); x.arc(c.x, c.y, c.r + 8 + (1 - pb) * 46, 0, 7); x.stroke(); }
        x.fillStyle = pb > 0 ? mix('#3A1740', PINK, pb * .6) : '#33163A'; x.beginPath(); x.arc(c.x, c.y, c.r * sc, 0, 7); x.fill();
        x.strokeStyle = pb > 0 ? WEISS : PINK; x.lineWidth = 7; x.beginPath(); x.arc(c.x, c.y, c.r * sc - 3.5, 0, 7); x.stroke();
        x.strokeStyle = rgba(PINK, .4); x.lineWidth = 2.5; x.setLineDash([3, 9]); x.beginPath(); x.arc(c.x, c.y, c.r * sc - 15, 0, 7); x.stroke(); x.setLineDash([]);
        lips(c.x, c.y - 3, .86 * sc * (1 + pb * .12), ROT, pb);
      }
    }
    x.restore();
    // ----- drehende Lippenstifte -----
    for (let k = 0; k < T.rotors.length; k++) {
      const ro = T.rotors[k]; if (ro.y + ro.L + 40 < y0 || ro.y - ro.L - 40 > y1) continue;
      const a = R.rotAngle(k, t), col = [ROT, '#FF4FA0', '#D926B0', '#FF5347'][k % 4], pu = pulse(since('r' + k, t), .18);
      x.save(); x.translate(ro.x, ro.y); x.rotate(a);
      x.fillStyle = mix(col, '#ffffff', pu * .5); rr(-ro.L - ro.r, -ro.r, 2 * (ro.L + ro.r), 2 * ro.r, ro.r); x.fill();           // zwei Minen
      x.fillStyle = rgba('#FFFFFF', .3); rr(ro.L * .6, -ro.r * .55, ro.L * .36, ro.r * .3, 4); x.fill(); rr(-ro.L * .96, -ro.r * .55, ro.L * .36, ro.r * .3, 4); x.fill();
      x.fillStyle = HELL; x.fillRect(-ro.L * .56, -ro.r, ro.L * 1.12, 2 * ro.r);                                                     // Zwingen
      x.fillStyle = TINTE; rr(-ro.L * .44, -ro.r - 3, ro.L * .88, 2 * ro.r + 6, 8); x.fill();                                          // Hülse
      x.strokeStyle = ROSA; x.lineWidth = 2.5; rr(-ro.L * .44, -ro.r - 3, ro.L * .88, 2 * ro.r + 6, 8); x.stroke();
      x.fillStyle = rgba('#FFFFFF', .16); x.fillRect(-ro.L * .38, -ro.r + 3, ro.L * .76, 5);
      x.fillStyle = HELL; x.beginPath(); x.arc(0, 0, 9, 0, 7); x.fill(); x.fillStyle = TINTE; x.beginPath(); x.arc(0, 0, 3.5, 0, 7); x.fill();
      x.restore();
    }
    // ----- Kuss-Tor -----
    const G = T.gate;
    if (G.y > y0 - 100 && G.y < y1 + 100) {
      const gk = R.gateOpen(t), half = (G.xr - G.xl) / 2, tl = G.xl + half * (1 - gk), tr = G.xr - half * (1 - gk);
      stickLine(G.xl - 150, G.y, tl, G.y, G.r, ROT, clamp(150 / (tl - G.xl + 150) * .98, .3, .96));
      stickLine(G.xr + 150, G.y, tr, G.y, G.r, ROT, clamp(150 / (G.xr - tr + 150) * .98, .3, .96));
      x.fillStyle = TINTE; rr(G.xl - 176, G.y - 34, 150, 68, 12); x.fill(); rr(G.xr + 26, G.y - 34, 150, 68, 12); x.fill();
      x.strokeStyle = ROSA; x.lineWidth = 3; rr(G.xl - 176, G.y - 34, 150, 68, 12); x.stroke(); rr(G.xr + 26, G.y - 34, 150, 68, 12); x.stroke();
      if (gk < .08) heart(CX, G.y - 64 - Math.abs(Math.sin(t * 6)) * 10, 20, PINK);
      note(gk < .5 ? 'Kuss-Tor: zu!' : 'Kuss-Tor: offen', XL + 26, G.y + 128, -.05, 64, gk < .5 ? ROSA : WEISS);
    }
    // ----- Notizen in der Bahn -----
    const sec = id => T.sections.find(s => s.id === id);
    const nn = [['rotor', 'Lippenstift-Mühle', XR - 30, -18, .03, 'right'], ['funnel', 'Achtung, Engstelle!', XL + 30, 40, -.04], ['zigzag', 'Zickzack', XR - 30, 118, .04, 'right'], ['bumper', 'Kussmünder schubsen!', XL + 30, 64, -.04], ['final', 'Endspurt!', XR - 40, 50, .04, 'right']];
    nn.forEach(q => { const s = sec(q[0]); if (s.y0 > y0 - 200 && s.y0 < y1) note(q[1], q[2], s.y0 + q[3], q[4], 68, ROSA, q[5] || 'left'); });
    if (jam0 >= 0 && t > jam0 && t < jam1 + .5) {
      const k = pr(t, jam0, jam0 + .3, ease.outBack) * (1 - pr(t, jam1 + .2, jam1 + .5));
      x.save(); x.translate(XR - 200, T.funnel.y0 - 26); x.rotate(.06 + Math.sin(t * 9) * .025); x.scale(k, k);
      x.font = `400 128px Gloock`; x.textAlign = 'center'; x.lineWidth = 16; x.strokeStyle = BG; x.lineJoin = 'round'; x.strokeText('STAU!', 0, 0); x.fillStyle = PINK; x.fillText('STAU!', 0, 0); x.restore();
    }

    // ----- Schweife -----
    for (let i = 0; i < n; i++) {
      pos(i, t, tmp); if (tmp[1] < y0 || tmp[1] > y1) continue;
      const col = mix(SIGNS[i].col, '#ffffff', .25);
      for (let k = 9; k >= 1; k--) { pos(i, t - k / 75, tmp2); const dd = Math.abs(tmp2[0] - tmp[0]) + Math.abs(tmp2[1] - tmp[1]); if (dd < 3) continue; x.globalAlpha = .34 * (1 - k / 10); x.fillStyle = col; x.beginPath(); x.arc(tmp2[0], tmp2[1], RAD * (1 - k / 13), 0, 7); x.fill(); }
      x.globalAlpha = 1;
    }
    // ----- Funken -----
    for (let k = evFrom(sparks, t - .42); k < sparks.length && sparks[k].t <= t; k++) {
      const e = sparks[k], d = t - e.t, a = d / .42, col = e.type === 'bumper' ? PINK : ROSA, cnt = e.type === 'bumper' ? 10 : 6;
      for (let q = 0; q < cnt; q++) {
        const ang = rnd(k * 13 + q) * 6.283, sp = (140 + rnd(k * 7 + q * 3) * 260) * clamp(e.s / 600, .6, 1.4);
        const px = e.x + Math.cos(ang) * sp * d, py = e.y + Math.sin(ang) * sp * d + 500 * d * d;
        x.globalAlpha = clamp(1.5 - a * 1.5); x.fillStyle = q % 2 ? col : WEISS; const sz = (q % 2 ? 13 : 9) * (1 - a * .4);
        if (q % 3 === 0) heart(px, py, sz, x.fillStyle, ang); else { x.beginPath(); x.arc(px, py, sz * .5, 0, 7); x.fill(); }
      }
      x.globalAlpha = 1;
    }
    // ----- Murmeln -----
    const o = order[Math.min(NF - 1, Math.round(t * FPS))], D = (RAD + 6) * 2;
    for (let q = n - 1; q >= 0; q--) {
      const i = o[q]; pos(i, t, tmp); if (tmp[1] < y0 || tmp[1] > y1) continue;
      x.drawImage(sprites[i], tmp[0] - D / 2, tmp[1] - D / 2, D, D);
      if (t >= finT[i]) { // Platz-Plakette
        const k = pr(t, finT[i], finT[i] + .35, ease.outBack);
        x.fillStyle = place[i] === 1 ? PINK : WEISS; x.beginPath(); x.arc(tmp[0] + 25, tmp[1] - 25, 17 * k, 0, 7); x.fill();
        x.fillStyle = place[i] === 1 ? WEISS : TINTE; x.font = `800 ${Math.round(22 * k)}px 'Bricolage Grotesque'`; x.textAlign = 'center'; x.fillText(String(place[i]), tmp[0] + 25, tmp[1] - 25 + 8 * k);
      }
    }
    // Führungswechsel: Ring um die neue Spitze
    for (let k = 1; k < R.leadChanges.length; k++) { const c = R.leadChanges[k], d = t - c.t; if (d < 0 || d > .5) continue; pos(c.a, t, tmp); x.strokeStyle = rgba('#FFFFFF', 1 - d / .5); x.lineWidth = 8 * (1 - d / .5) + 1; x.beginPath(); x.arc(tmp[0], tmp[1], RAD + 6 + ease.outCubic(d / .5) * 90, 0, 7); x.stroke(); }
    // Start-Impuls: Ring aus dem Pulk (bei t = 0 noch unsichtbar → sauberes Loop-Bild)
    if (t > 0 && t < .45) { const d = t / .45; x.strokeStyle = rgba(PINK, (1 - d) * .9); x.lineWidth = 26 * (1 - d) + 2; x.beginPath(); x.arc(CX, 760, 60 + ease.outCubic(d) * 640, 0, 7); x.stroke(); }
    // Namen am Start (blenden aus, sobald das Feld durcheinander ist)
    if (t < 2.3) {
      const a = 1 - pr(t, 1.5, 2.3);
      x.font = `800 27px 'Bricolage Grotesque'`; x.textAlign = 'center'; x.lineJoin = 'round';
      for (let i = 0; i < n; i++) { pos(i, t, tmp); x.globalAlpha = a; x.lineWidth = 7; x.strokeStyle = BG; x.strokeText(SIGNS[i].name, tmp[0], tmp[1] + RAD + 30); x.fillStyle = WEISS; x.fillText(SIGNS[i].name, tmp[0], tmp[1] + RAD + 30); }
      x.globalAlpha = 1;
    }
    // Fähnchen über der Spitze
    if (t > 2.1 && t < TW) {
      const i = o[0]; pos(i, t, tmp); const a = pr(t, 2.1, 2.5), nm = SIGNS[i].name;
      x.font = `800 30px 'Bricolage Grotesque'`; const w = x.measureText(nm).width + 34, yy = tmp[1] - RAD - 44;
      x.globalAlpha = a; x.fillStyle = WEISS; rr(tmp[0] - w / 2, yy - 24, w, 46, 23); x.fill();
      x.beginPath(); x.moveTo(tmp[0] - 10, yy + 20); x.lineTo(tmp[0], yy + 34); x.lineTo(tmp[0] + 10, yy + 20); x.closePath(); x.fill();
      x.fillStyle = TINTE; x.textAlign = 'center'; x.fillText(nm, tmp[0], yy + 10); x.globalAlpha = 1;
    }
    // ----- Zieleinlauf: große Platz-Zahl ploppt an der Linie -----
    R.finish.forEach((f, k) => {
      const d = t - f.t; if (d < 0 || d > .8) return;
      const s = pr(d, 0, .28, ease.outBack) * (k === 0 ? 1.7 : 1), a = 1 - pr(d, .5, .8);
      x.save(); x.translate(clamp(f.x, XL + 90, XR - 90), T.fin - 70 - d * 90); x.scale(s, s); x.globalAlpha = a;
      x.font = `400 120px Gloock`; x.textAlign = 'center'; x.lineJoin = 'round'; x.lineWidth = 14; x.strokeStyle = BG; x.strokeText(k + 1 + '.', 0, 0); x.fillStyle = k === 0 ? PINK : WEISS; x.fillText(k + 1 + '.', 0, 0); x.restore();
    });
    // Herz-Konfetti für Platz 1
    if (t >= TW && t < TW + 2.2) {
      const d = t - TW;
      for (let q = 0; q < 46; q++) {
        const ang = -1.571 + (rnd(q * 3.1) - .5) * 2.6, sp = 500 + rnd(q * 5.7) * 900, px = R.finish[0].x + Math.cos(ang) * sp * d * (1 - d * .18), py = T.fin + Math.sin(ang) * sp * d + 620 * d * d;
        x.globalAlpha = clamp(1.6 - d * .8); heart(px, py, 9 + rnd(q) * 12, [PINK, WEISS, ROT, ROSA][q % 4], rnd(q * 2) * 6 + d * (rnd(q) - .5) * 9);
      }
      x.globalAlpha = 1;
    }
    x.setTransform(1, 0, 0, 1, 0, 0);
    if (t >= TW && t < TW + .3) { x.fillStyle = rgba('#FF3D7F', .3 * (1 - (t - TW) / .3)); x.fillRect(0, 0, 1080, 1920); }
  }

  // ---------- UI (DOM) ----------
  const ui = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
  const head = el('div', { left: 0, top: 0, width: '1080px', height: '640px', background: `linear-gradient(${BG} 0, ${BG} 80%, ${rgba(BG, 0)} 100%)` }, ui);
  // Hook groß (2 Zeilen) – ab Frame 0
  const mctx = document.createElement('canvas').getContext('2d');
  const fit = (txt, font, size, max) => { mctx.font = font.replace('SZ', size); const w = mctx.measureText(txt).width; return w > max ? size * max / w : size; };
  const hs = Math.floor(Math.min(fit('Welches Sternzeichen', '400 SZpx Gloock', 112, 880), fit('küsst am besten?', '400 SZpx Gloock', 132, 880)));
  const hookBig = el('div', { left: '66px', top: '196px', width: '960px', fontFamily: F.display, fontSize: hs + 'px', lineHeight: 1.08, letterSpacing: '-1.5px', color: WEISS, whiteSpace: 'nowrap', transformOrigin: '0 0' }, ui,
    `Welches Sternzeichen<br><span style="display:inline-block;color:${PINK};font-size:${Math.round(hs * 1.16)}px;line-height:1.02">küsst am besten?</span>`);
  const sub = el('div', { left: '70px', top: '480px', fontFamily: F.sans, fontWeight: 600, fontSize: '40px', color: HELL, whiteSpace: 'nowrap' }, ui,
    `12 starten. <span style="display:inline-block;background:${PINK};color:${WEISS};padding:0 14px 4px;border-radius:6px;transform:rotate(-1.5deg);font-weight:800">Die Rangliste entscheidet.</span>`);
  // Hook klein (1 Zeile) – bleibt während des Rennens stehen
  const hsS = Math.floor(fit('Welches Sternzeichen küsst am besten?', '400 SZpx Gloock', 56, 884));
  const hookSmall = el('div', { left: '64px', top: '192px', fontFamily: F.display, fontSize: hsS + 'px', lineHeight: 1.1, letterSpacing: '-.5px', color: WEISS, whiteSpace: 'nowrap' }, ui,
    `Welches Sternzeichen <span style="color:${PINK}">küsst am besten?</span>`);

  // Live-Rangliste: 3 Plätze nebeneinander, beim Zieleinlauf wächst sie zum 3×4-Ergebnisfeld
  const SW = 290, SH = 60, SG = 7, SX = 64, SY = 276, RH = 68;
  const slotXY = k => [SX + (k % 3) * (SW + SG), SY + Math.floor(k / 3) * RH];
  const board = el('div', { left: 0, top: 0, width: '1080px', height: '700px' }, ui);
  const slots = Array.from({ length: n }, (_, k) => {
    const [sx, sy] = slotXY(k);
    const d = el('div', { left: sx + 'px', top: sy + 'px', width: SW + 'px', height: SH + 'px', borderRadius: SH / 2 + 'px', background: '#26152B', border: `2px solid ${LINE}` }, board);
    const num = el('div', { left: '6px', top: '6px', width: '44px', height: '44px', borderRadius: '50%', background: k === 0 ? PINK : '#3B2142', color: WEISS, fontFamily: F.sans, fontWeight: 800, fontSize: k > 8 ? '25px' : '29px', lineHeight: '41px', textAlign: 'center' }, d, String(k + 1));
    return { d, num };
  });
  const chips = SIGNS.map((s, i) => {
    const d = el('div', { left: 0, top: 0, width: (SW - 56) + 'px', height: SH + 'px', whiteSpace: 'nowrap' }, board);
    const ball = marbleSprite(i, 21, 3); Object.assign(ball.style, { position: 'absolute', left: '0px', top: '3px', width: '54px', height: '54px' }); d.appendChild(ball);
    const fs = Math.min(34, fit(s.name, "800 SZpx 'Bricolage Grotesque'", 34, 172));
    el('div', { left: '58px', top: '0px', height: SH + 'px', lineHeight: (SH - 4) + 'px', fontFamily: F.sans, fontWeight: 800, fontSize: fs + 'px', color: WEISS, letterSpacing: '-.3px' }, d, s.name);
    return d;
  });
  // Chip-Bewegung vorab berechnen (weiches Umsortieren)
  const chipX = [], chipY = [], chipA = [];
  { const cx = new Array(n).fill(0), cy = new Array(n).fill(0), ca = new Array(n).fill(0);
    for (let f = 0; f < NF; f++) {
      const t = f / FPS, o = order[f], shown = Math.max(3, nFin(t));
      for (let k = 0; k < n; k++) {
        const i = o[k], vis = k < shown, [tx, ty] = slotXY(Math.min(k, n - 1));
        if (vis) { if (ca[i] < .04) { cx[i] = tx + 52; cy[i] = ty + 30; } cx[i] += (tx + 52 - cx[i]) * .45; cy[i] += (ty - cy[i]) * .45; const far = clamp((Math.abs(tx + 52 - cx[i]) + Math.abs(ty - cy[i])) / 120); ca[i] += ((1 - far * .85) - ca[i]) * .6; }
        else { cy[i] += 5; ca[i] += (0 - ca[i]) * .62; }
      }
      chipX.push(cx.slice()); chipY.push(cy.slice()); chipA.push(ca.slice());
    } }

  // Führungswechsel-Banner
  const WORT = ['übernimmt!', 'zieht vorbei!', 'ist vorn!', 'übernimmt!', 'holt sich Platz 1!', 'ist vorn!'];
  const flashes = R.leadChanges.slice(1).map((c, k) => {
    const txt = SIGNS[c.a].name + ' ' + WORT[k % WORT.length], ffs = Math.floor(fit(txt, '400 SZpx Gloock', 66, 730));
    const d = el('div', { left: 0, top: (c.t < 2.9 ? 566 : 372) + 'px', width: '1030px', textAlign: 'center', display: 'none' }, ui);
    const b = el('div', { position: 'relative', display: 'inline-block', background: WEISS, color: TINTE, borderRadius: '10px', padding: '6px 30px 14px 22px', fontFamily: F.display, fontSize: ffs + 'px', lineHeight: 1.1, whiteSpace: 'nowrap', boxShadow: `10px 10px 0 ${PINK}` }, d);
    const ball = marbleSprite(c.a, 30, 3); Object.assign(ball.style, { width: '76px', height: '76px', verticalAlign: '-18px', marginRight: '10px' }); b.appendChild(ball);
    b.appendChild(document.createTextNode(txt));
    return { d, b, t: c.t, end: Math.min(c.t + 1.25, k + 2 < R.leadChanges.length ? R.leadChanges[k + 2].t : 1e9, TW) };
  });

  // Fortschritt (links, schmal): Strecke mit allen 12 als Punkte
  const PB0 = 640, PB1 = 1500;
  const prog = el('div', { left: 0, top: 0 }, ui);
  el('div', { left: '30px', top: PB0 + 'px', width: '6px', height: (PB1 - PB0) + 'px', borderRadius: '3px', background: LINE }, prog);
  const progFill = el('div', { left: '30px', top: PB0 + 'px', width: '6px', height: '10px', borderRadius: '3px', background: PINK }, prog);
  T.sections.slice(1, -1).forEach(s => el('div', { left: '24px', top: (PB0 + (s.y0 - T.startY) / (T.fin - T.startY) * (PB1 - PB0)) + 'px', width: '18px', height: '3px', background: '#5B3563' }, prog));
  el('div', { left: '15px', top: (PB1 + 2) + 'px', width: '36px', height: '24px', background: `conic-gradient(${WEISS} 25%, ${PINK} 0 50%, ${WEISS} 0 75%, ${PINK} 0) 0 0/18px 12px` }, prog);
  const dots = SIGNS.map(s => el('div', { left: '25px', top: 0, width: '16px', height: '16px', borderRadius: '50%', background: s.col, border: `2px solid ${rgba('#FFFFFF', .85)}` }, prog));

  // ---------- Schlussbild: komplette Rangliste ----------
  const end = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: BG, display: 'none' }, root);
  const endHook = el('div', { left: '64px', top: '192px', fontFamily: F.display, fontSize: hsS + 'px', lineHeight: 1.1, letterSpacing: '-.5px', color: WEISS, whiteSpace: 'nowrap' }, end, `Welches Sternzeichen <span style="color:${PINK}">küsst am besten?</span>`);
  const W1 = R.finish[0].i, W12 = R.finish[n - 1].i;
  // Platz 1
  const hero = el('div', { left: '56px', top: '292px', width: '900px', height: '250px', transformOrigin: '30% 50%' }, end);
  el('div', { left: '6px', top: '22px', width: '888px', height: '212px', background: PINK, borderRadius: '14px', transform: 'rotate(-1.2deg)', boxShadow: `12px 12px 0 ${rgba('#FFFFFF', .14)}` }, hero);
  const hb = marbleSprite(W1, 88, 3); Object.assign(hb.style, { position: 'absolute', left: '22px', top: '30px', width: '188px', height: '188px' }); hero.appendChild(hb);
  const hfs = Math.min(128, fit(SIGNS[W1].name, '400 SZpx Gloock', 128, 600));
  el('div', { left: '232px', top: '34px', fontFamily: F.sans, fontWeight: 800, fontSize: '36px', letterSpacing: '3px', color: TINTE, whiteSpace: 'nowrap', transform: 'rotate(-1.2deg)' }, hero, 'PLATZ 1');
  el('div', { left: '228px', top: (150 - hfs * .62) + 'px', fontFamily: F.display, fontSize: hfs + 'px', lineHeight: 1, letterSpacing: '-2px', color: WEISS, whiteSpace: 'nowrap', transform: 'rotate(-1.2deg)' }, hero, SIGNS[W1].name);
  mctx.font = `400 ${hfs}px Gloock`; const hw = mctx.measureText(SIGNS[W1].name).width;
  if (hw >= 400) el('div', { left: '420px', top: '22px', width: '450px', textAlign: 'right', fontFamily: F.hand, fontWeight: 700, fontSize: '54px', lineHeight: 1, color: TINTE, transform: 'rotate(-2.5deg)', whiteSpace: 'nowrap' }, hero, 'küsst am besten!');
  if (hw < 400) el('div', { left: (250 + hw) + 'px', top: '92px', width: (630 - hw) + 'px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', lineHeight: .95, color: TINTE, transform: 'rotate(-5deg)' }, hero, 'küsst am<br>besten!');
  // Plätze 2–12 in zwei Spalten
  const ROW0 = 578, ROWH = 112;
  const rows = R.finish.slice(1).map((f, k) => {
    const pl = k + 2, col = k < 6 ? 0 : 1, r = col ? k - 6 : k, X0 = col ? 520 : 56;
    const d = el('div', { left: X0 + 'px', top: (ROW0 + r * ROWH) + 'px', width: '440px', height: ROWH + 'px', transformOrigin: '10% 50%' }, end);
    el('div', { left: '0px', top: '14px', width: '74px', textAlign: 'right', fontFamily: F.display, fontSize: '62px', lineHeight: '80px', color: pl <= 3 ? PINK : ROSA }, d, pl + '.');
    const b = marbleSprite(f.i, 38, 3); Object.assign(b.style, { position: 'absolute', left: '86px', top: '10px', width: '88px', height: '88px' }); d.appendChild(b);
    const fs = Math.min(52, fit(SIGNS[f.i].name, "800 SZpx 'Bricolage Grotesque'", 52, 258));
    el('div', { left: '184px', top: '14px', lineHeight: '80px', fontFamily: F.sans, fontWeight: 800, fontSize: fs + 'px', color: pl === 12 ? '#B9A3B4' : WEISS, letterSpacing: '-.5px', whiteSpace: 'nowrap' }, d, SIGNS[f.i].name);
    return d;
  });
  const uebt = el('div', { left: '700px', top: (ROW0 + 5 * ROWH + 6) + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: '70px', color: ROSA, transform: 'rotate(-5deg)', whiteSpace: 'nowrap' }, end, 'übt noch ;)');
  const uebtArr = el('div', { left: '610px', top: (ROW0 + 5 * ROWH - 8) + 'px' }, end, `<svg width="100" height="80" viewBox="0 0 100 80" style="overflow:visible"><path d="M92 62 C60 66 34 52 22 20" fill="none" stroke="${ROSA}" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/><path d="M8 42 L21 16 L44 32" fill="none" stroke="${ROSA}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  const frage = el('div', { left: '0px', top: '1296px', width: '1030px', textAlign: 'center', fontFamily: F.display, fontSize: '98px', lineHeight: 1, letterSpacing: '-2px', color: WEISS, whiteSpace: 'nowrap' }, end, `Stimmt das <span style="color:${PINK}">bei dir?</span>`);
  const pfeil = el('div', { left: '468px', top: '1412px' }, end, `<svg width="100" height="140" viewBox="0 0 100 140" style="overflow:visible"><path d="M54 6 C38 44 66 70 48 118" fill="none" stroke="${PINK}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M18 92 L47 126 L84 98" fill="none" stroke="${PINK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  const pfP = pfeil.querySelectorAll('path');

  const at = (arr, t, i) => { const ff = clamp(t * FPS, 0, NF - 1), f0 = Math.floor(ff), f1 = Math.min(NF - 1, f0 + 1); return lerp(arr[f0][i], arr[f1][i], ff - f0); };

  return (t) => {
    drawWorld(t);
    const u = t - TE;                                   // Zeit im Schlussbild
    // Kopf
    const kS = pr(t, 2.25, 2.8, ease.inOutCubic);       // Hook groß → klein
    const punch = t < .32 ? 1 + .045 * Math.sin(t / .32 * Math.PI) : 1;
    hookBig.style.opacity = 1 - pr(t, 2.25, 2.6); hookBig.style.transform = `translateY(${-30 * kS}px) scale(${punch * (1 - .25 * kS)})`;
    sub.style.opacity = 1 - pr(t, 2.1, 2.4);
    hookSmall.style.opacity = pr(t, 2.4, 2.75);
    head.style.height = lerp(640, 470, kS) + (t > TW ? pr(t, TW + .3, TW + 1.2) * 150 : 0) + 'px';
    // Rangliste
    const bA = pr(t, 2.45, 2.85), fin = nFin(t), shown = Math.max(3, fin);
    board.style.opacity = bA; board.style.transform = `translateY(${(1 - bA) * -20}px)`;
    slots.forEach((s, k) => {
      const on = k < shown; s.d.style.display = on ? 'block' : 'none'; if (!on) return;
      const done = k < fin, tf = done ? R.finish[k].t : 0, pop = done ? 1 + .12 * Math.sin(clamp((t - tf) / .3) * Math.PI) : 1;
      s.d.style.transform = `scale(${pop})`; s.d.style.borderColor = done ? (k === 0 ? PINK : ROSA) : LINE; s.d.style.background = done && k === 0 ? '#4A1230' : '#26152B';
      s.num.style.background = done ? (k === 0 ? PINK : WEISS) : (k === 0 ? PINK : '#3B2142'); s.num.style.color = done && k > 0 ? TINTE : WEISS;
    });
    chips.forEach((c, i) => { const a = at(chipA, t, i); c.style.opacity = a; c.style.display = a < .02 ? 'none' : 'block'; c.style.transform = `translate(${at(chipX, t, i)}px, ${at(chipY, t, i)}px)`; });
    // Banner
    flashes.forEach((fl, k) => {
      const d = t - fl.t, on = d >= 0 && t < fl.end + .15; fl.d.style.display = on ? 'block' : 'none'; if (!on) return;
      const kIn = pr(d, 0, .26, ease.outBack), out = pr(t, fl.end - .05, fl.end + .15);
      fl.d.style.opacity = clamp(d / .08) * (1 - out); fl.b.style.transform = `rotate(${(k % 2 ? 1.6 : -1.8)}deg) scale(${.6 + .4 * kIn}) translateY(${out * -20}px)`;
    });
    // Fortschritt
    let lead = 0;
    dots.forEach((d, i) => { pos(i, t, tmp); const p = clamp((tmp[1] - T.startY) / (T.fin - T.startY)); if (p > lead) lead = p; d.style.transform = `translateY(${PB0 + p * (PB1 - PB0) - 8}px)`; d.style.zIndex = Math.round(p * 1000); });
    progFill.style.height = (lead * (PB1 - PB0)) + 'px';
    // Schlussbild
    const eA = pr(u, 0, .45);
    end.style.display = u > 0 ? 'block' : 'none'; end.style.opacity = eA;
    ui.style.opacity = 1 - pr(u, 0, .3);
    if (u > 0) {
      const hk = pr(u, .15, .6, ease.outBack);
      hero.style.opacity = clamp((u - .15) / .15); hero.style.transform = `scale(${.7 + .3 * hk}) rotate(${(1 - hk) * -4}deg)`;
      rows.forEach((d, k) => { const t0 = .5 + k * .075, a = pr(u, t0, t0 + .3, ease.outBack); d.style.opacity = clamp((u - t0) / .12); d.style.transform = `translateX(${(1 - a) * -50}px)`; });
      const ua = pr(u, 1.7, 2.05, ease.outBack); uebt.style.opacity = clamp((u - 1.7) / .15); uebt.style.transform = `rotate(${-5 + (1 - ua) * 8}deg) scale(${.7 + .3 * ua})`; uebtArr.style.opacity = clamp((u - 1.85) / .15);
      const fa = pr(u, 2.3, 2.75, ease.outBack); frage.style.opacity = clamp((u - 2.3) / .15); frage.style.transform = `translateY(${(1 - fa) * 40}px) scale(${.9 + .1 * fa})`;
      const pa = pr(u, 2.75, 3.2); pfeil.style.opacity = u > 2.75 ? 1 : 0; pfP[0].setAttribute('stroke-dashoffset', 1 - pa); pfP[1].setAttribute('opacity', pa > .9 ? 1 : 0);
      pfeil.style.transform = `translateY(${u > 3.2 ? Math.abs(Math.sin((u - 3.2) * 4.2)) * 16 : 0}px)`;
    }
  };
}};

// ---------- Cover ----------
SCENES.cover = { bg: BG, build(root) {
  el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: BG }, root);
  el('div', { left: '70px', top: 0, width: '890px', height: '1920px', background: LANE, borderLeft: `7px solid ${PINK}`, borderRight: `7px solid ${PINK}`, boxSizing: 'content-box', marginLeft: '-7px' }, root);
  el('div', { left: '70px', top: '312px', width: '890px', fontFamily: F.display, fontSize: '126px', lineHeight: 1.03, letterSpacing: '-2.5px', color: WEISS, textAlign: 'center', whiteSpace: 'nowrap' }, root,
    `Welches<br>Sternzeichen<br><span style="display:inline-block;background:${PINK};color:${WEISS};font-size:104px;padding:2px 30px 18px;border-radius:10px;transform:rotate(-2deg);margin-top:20px">küsst am besten?</span>`);
  // 12 Murmeln als Pulk
  const P = [[150, 0], [330, -26], [515, 8], [700, -22], [880, 4], [240, 150], [425, 132], [610, 156], [795, 136], [335, 290], [520, 276], [705, 296]];
  const ord = [4, 6, 0, 10, 8, 3, 11, 1, 7, 2, 9, 5];
  P.forEach((p, k) => {
    const i = ord[k], r = 80, cvs = marbleSprite(i, r, 2); Object.assign(cvs.style, { position: 'absolute', left: (p[0] - r - 6) + 'px', top: (930 + p[1] - r - 6) + 'px', width: (r + 6) * 2 + 'px', height: (r + 6) * 2 + 'px', transform: `rotate(${(k % 3 - 1) * 7}deg)` });
    // Schweif
    for (let q = 5; q >= 1; q--) el('div', { left: (p[0] - r * (1 - q / 9)) + 'px', top: (930 + p[1] - q * 34 - r * (1 - q / 9)) + 'px', width: 2 * r * (1 - q / 9) + 'px', height: 2 * r * (1 - q / 9) + 'px', borderRadius: '50%', background: SIGNS[i].col, opacity: .2 * (1 - q / 6) }, root);
    root.appendChild(cvs);
  });
  const t = el('div', { left: 0, top: '1336px', width: '1030px', textAlign: 'center' }, root);
  el('div', { position: 'relative', display: 'inline-block', background: WEISS, color: TINTE, borderRadius: '10px', padding: '10px 40px 22px', fontFamily: F.display, fontSize: '86px', lineHeight: 1.1, transform: 'rotate(2deg)', boxShadow: `12px 12px 0 ${PINK}`, whiteSpace: 'nowrap' }, t, 'Platz 12 tut weh');
  el('div', { left: '0px', top: '1482px', width: '1030px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '62px', color: ROSA, transform: 'rotate(-2deg)' }, root, '12 starten, eine Rangliste');
}};
}
