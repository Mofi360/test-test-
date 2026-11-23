/* R702 – Battle-Royale „Dein Geburtsmonat kämpft“ [KI]
 * Physik: sim.js (dieselbe Datei nutzt make_sfx.js für den Ton). Hier wird der Verlauf nur gezeichnet –
 * alles auf EINER Canvas, jede Größe hängt nur von t ab (kein Zustand zwischen Frames). */
(function () { const s = document.currentScript.src.replace(/scene\.js.*$/, 'sim.js'); document.write('<script src="' + s + '"><\/script>'); })();
{
const { el, C, F, clamp, lerp, ease, pr } = DT;
const W = 1080, H = 1920, TAU = Math.PI * 2;
const PINK = '#FF2E7E', PINK2 = '#FF6FA3', INK = '#0D070E', CREAM = '#F7EADF';
const SANS = "'Bricolage Grotesque', sans-serif", DISP = "'Gloock', serif";

// ---------- Farben ----------
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => { const c = hex(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const MON = [
  ['JAN', 'Januar', '#E3122B'],    // Rot
  ['FEB', 'Februar', '#B00A3A'],   // Kirschrot
  ['MÄR', 'März', '#8C2166'],      // Beere
  ['APR', 'April', '#FF3F8F'],     // Pink
  ['MAI', 'Mai', '#F08BA8'],       // Rosé
  ['JUN', 'Juni', '#FF6348'],      // Koralle
  ['JUL', 'Juli', '#C48A72'],      // Nude
  ['AUG', 'August', '#741233'],    // Weinrot
  ['SEP', 'September', '#A46C92'], // Mauve
  ['OKT', 'Oktober', '#FF9C73'],   // Pfirsich
  ['NOV', 'November', '#D81FB0'],  // Fuchsia
  ['DEZ', 'Dezember', '#8E3322'],  // Braunrot
].map(([k, name, col]) => ({ k, name, col, hi: mix(col, '#FFFFFF', .42), lo: mix(col, '#12060C', .5), spark: mix(col, '#FFFFFF', .22) }));

// ---------- Gegner-Icons (Canvas, Kasten ±30) ----------
const P = d => new Path2D(d);
const ICON = [
  /* Kaffee */ (c) => {
    c.strokeStyle = PINK2; c.lineWidth = 4.5; c.stroke(P('M-12 -17 c-6 -6 6 -9 0 -16 M5 -17 c-6 -6 6 -9 0 -16'));
    c.fillStyle = CREAM; c.fill(P('M-25 -9 H17 V5 a17 17 0 0 1 -17 17 h-8 a17 17 0 0 1 -17 -17Z'));
    c.strokeStyle = CREAM; c.lineWidth = 5; c.stroke(P('M17 -4 h5 a8.5 8.5 0 0 1 0 17 h-7')); c.stroke(P('M-30 29 H22'));
  },
  /* Kuss */ (c) => {
    c.fillStyle = PINK2; c.fill(P('M-30 -1 C-20 -13 -9 -19 0 -11 C9 -19 20 -13 30 -1 C18 2 8 1 0 4 C-8 1 -18 2 -30 -1Z'));
    c.fillStyle = CREAM; c.fill(P('M-30 -1 C-18 2 -8 1 0 4 C8 1 18 2 30 -1 C20 15 9 20 0 20 C-9 20 -20 15 -30 -1Z'));
    c.strokeStyle = '#1A121C'; c.lineWidth = 2.5; c.stroke(P('M-30 -1 C-18 2 -8 1 0 4 C8 1 18 2 30 -1'));
  },
  /* Burger */ (c) => {
    c.fillStyle = CREAM; c.fill(P('M-29 -5 a29 24 0 0 1 58 0Z'));
    c.fillStyle = '#1A121C'; [[-10, -17], [3, -21], [13, -13]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 2.4, 0, TAU); c.fill(); });
    c.strokeStyle = PINK2; c.lineWidth = 5.5; c.stroke(P('M-30 4 q7.5 9 15 0 t15 0 t15 0 t15 0'));
    c.fillStyle = '#B58A6E'; c.beginPath(); c.roundRect(-29, 11, 58, 9, 4.5); c.fill();
    c.fillStyle = CREAM; c.beginPath(); c.roundRect(-27, 23, 54, 10, 5); c.fill();
  },
  /* Regen */ (c) => {
    c.fillStyle = CREAM; c.fill(P('M-20 6 a13 13 0 0 1 2 -26 a17 17 0 0 1 32 2 a12 12 0 0 1 4 24Z'));
    c.strokeStyle = PINK2; c.lineWidth = 5; c.stroke(P('M-13 15 l-5 13 M1 15 l-5 13 M15 15 l-5 13'));
  },
  /* Weinglas */ (c) => {
    c.fillStyle = PINK2; c.fill(P('M-15.5 -16 h31 c-2 12 -7 17 -15.5 17 c-8.5 0 -13.5 -5 -15.5 -17Z'));
    c.strokeStyle = CREAM; c.lineWidth = 4.5; c.stroke(P('M-17 -32 h34 c0 24 -6 35 -17 35 c-11 0 -17 -11 -17 -35Z M0 3 V27 M-13 29 H13'));
  },
  /* Pasta */ (c) => {
    c.strokeStyle = PINK2; c.lineWidth = 4; c.stroke(P('M-21 2 c-4 -15 6 -25 21 -25 c15 0 25 10 21 25 M-12 -3 c2 -9 12 -12 18 -6 M-3 1 c4 -8 12 -8 16 -3'));
    c.fillStyle = CREAM; c.fill(P('M-31 5 h62 a31 25 0 0 1 -62 0Z'));
    c.strokeStyle = CREAM; c.lineWidth = 5; c.stroke(P('M14 -19 L31 -37'));
  },
];
function icon(c, k, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round'; ICON[k](c); c.restore(); }

// ---------- Kugel ----------
/** Monat als glänzende Kugel. hp 0..1 oder <0 = ohne Ring. flash 0..1 */
function ball(c, i, x, y, r, hp, flash, o = {}) {
  const m = MON[i];
  c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(0,0,0,.38)'; c.beginPath(); c.ellipse(r * .1, r * .2, r * 1.08, r * 1.04, 0, 0, TAU); c.fill();
  if (hp >= 0) { // Lippenstift-Anzeige
    const rr = r + r * .19, lw = r * .17;
    c.lineWidth = lw + 5; c.strokeStyle = 'rgba(8,3,9,.85)'; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.stroke();
    c.lineWidth = lw; c.strokeStyle = 'rgba(255,255,255,.13)'; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.stroke();
    if (o.ghost > hp) { c.strokeStyle = PINK; c.globalAlpha = o.ghostA ?? 1; c.beginPath(); c.arc(0, 0, rr, -TAU / 4 + TAU * hp, -TAU / 4 + TAU * o.ghost); c.stroke(); c.globalAlpha = 1; }
    if (hp > 0) {
      const low = hp < .25;
      c.strokeStyle = low ? (o.blink ? '#FFFFFF' : PINK) : '#FFFFFF'; c.lineCap = 'round';
      c.beginPath(); c.arc(0, 0, rr, -TAU / 4, -TAU / 4 + TAU * Math.max(.012, hp)); c.stroke(); c.lineCap = 'butt';
    }
  }
  const g = c.createRadialGradient(-r * .36, -r * .42, r * .06, 0, 0, r);
  g.addColorStop(0, m.hi); g.addColorStop(.42, m.col); g.addColorStop(1, m.lo);
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
  c.lineWidth = Math.max(2, r * .05); c.strokeStyle = 'rgba(10,3,8,.55)'; c.stroke();
  // Glanz
  c.save(); c.rotate(-.6); c.fillStyle = 'rgba(255,255,255,.62)'; c.beginPath(); c.ellipse(-r * .1, -r * .66, r * .34, r * .13, 0, 0, TAU); c.fill(); c.restore();
  c.strokeStyle = 'rgba(255,255,255,.2)'; c.lineWidth = r * .06; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, r * .84, .45, 1.5); c.stroke(); c.lineCap = 'butt';
  if (flash > 0) { c.fillStyle = `rgba(255,255,255,${.85 * flash})`; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); }
  if (o.label !== false) {
    c.font = `800 ${r * .74}px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = r * .16; c.strokeStyle = 'rgba(30,4,16,.6)'; c.strokeText(m.k, 0, r * .06);
    c.fillStyle = '#FFFFFF'; c.fillText(m.k, 0, r * .06);
  }
  c.restore();
}
/** Gegner: dunkle Zackenscheibe mit Icon. state 1 Geist, 2 satt, 3 scharf */
function enemy(c, k, x, y, r, rot, state, rage, pop = 1) {
  c.save(); c.translate(x, y); c.scale(pop, pop);
  c.globalAlpha = state === 1 ? .5 : 1;
  c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(5, 9, r * 1.05, r * 1.02, 0, 0, TAU); c.fill();
  const armed = state === 3;
  c.save(); c.rotate(rot);
  c.beginPath(); const n = 14;
  for (let j = 0; j < n * 2; j++) { const a = j / (n * 2) * TAU, rr = j % 2 ? r * 1.0 : r * 1.16; c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath();
  c.fillStyle = armed ? mix(CREAM, PINK, rage * .85) : '#5A4D5E'; c.fill();
  c.restore();
  const g = c.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r);
  g.addColorStop(0, '#4A3F50'); g.addColorStop(1, '#1B141E');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .9, 0, TAU); c.fill();
  c.globalAlpha *= armed ? 1 : .55;
  icon(c, k, 0, 0, r / 47 * 1.08);
  c.restore();
}
function rrect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function fitFont(c, text, tpl, maxW, size) { c.font = tpl.replace('SZ', size); const w = c.measureText(text).width; return w > maxW ? size * maxW / w : size; }
const rndOf = seed => R702SIM.mulberry32(seed * 7919 + 13);

let SIM = null;
const sim = () => SIM || (SIM = R702SIM.simulate(R702SIM.CFG.seed));

// Hintergrund einmal vorzeichnen
let BG = null;
function background() {
  if (BG) return BG;
  BG = document.createElement('canvas'); BG.width = W; BG.height = H; const c = BG.getContext('2d');
  c.fillStyle = INK; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(505, 960, 80, 505, 960, 1050);
  g.addColorStop(0, 'rgba(255,46,126,.20)'); g.addColorStop(.55, 'rgba(160,20,80,.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // schräge Lichtbahnen (Bühne)
  c.save(); c.globalAlpha = .05; c.fillStyle = '#FF8FB8';
  [[-80, 300], [420, 180], [860, 260]].forEach(([x, w]) => { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + w, 0); c.lineTo(x + w - 520, H); c.lineTo(x - 520, H); c.fill(); });
  c.restore();
  // Korn
  const rnd = rndOf(5);
  for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(255,220,235,${rnd() * .05})`; c.fillRect(rnd() * W, rnd() * H, 2, 2); }
  g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.14, 'rgba(0,0,0,0)'); g.addColorStop(.8, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return BG;
}

SCENES.s1 = { bg: INK, paper: false, build(root) {
  const R = sim(), cf = R.cfg, NM = 12, NE = 6, TW = R.tWin, FPS = cf.fps, PRE = cf.pre, WIN = R.winner;
  const cv = el('canvas', { left: 0, top: 0 }, root); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const outT = new Array(NM).fill(1e9), rank = new Array(NM).fill(1); R.outs.forEach(o => { outT[o.i] = o.t; rank[o.i] = o.rank; });
  const order = [WIN, ...R.outs.slice().reverse().map(o => o.i)]; // Platz 1..12
  const hits = R.events.filter(e => e.type === 'hit'), mms = R.events.filter(e => e.type === 'mm' && e.s > 260), walls = R.events.filter(e => e.type === 'wall' && e.s > 330);
  const taps = R.events.filter(e => e.type === 'tap' && e.s > 300);
  const hitsOf = MON.map((_, i) => hits.filter(e => e.m === i));
  const spawns = R.events.filter(e => e.type === 'spawn');
  const tFinale = R.outs[9].t;
  const beat = 60 / cf.bpm;
  const BG_ = background();

  const fr = t => { const ff = clamp((t + PRE) * FPS, 0, R.frames.length - 1), f0 = Math.floor(ff); return [R.frames[f0], R.frames[Math.min(R.frames.length - 1, f0 + 1)], ff - f0]; };
  const mpos = (i, t) => { const [a, b, k] = fr(t); return [lerp(a[i * 3], b[i * 3], k), lerp(a[i * 3 + 1], b[i * 3 + 1], k), a[i * 3 + 2]]; };
  const epos = (j, t) => { const [a, b, k] = fr(t), o = NM * 3 + j * 3; return [lerp(a[o], b[o], k), lerp(a[o + 1], b[o + 1], k), a[o + 2]]; };

  function arenaPath(ins) { rrect(c, cf.cx - cf.hw + ins, cf.cy - cf.hh + ins, 2 * (cf.hw - ins), 2 * (cf.hh - ins), cf.rc); }

  // Farbkleckse der Ausgeschiedenen (bleiben auf dem Boden)
  const splats = R.outs.map((o, k) => { const rnd = rndOf(100 + k); return Array.from({ length: 9 }, (_, j) => { const a = rnd() * TAU, d = j ? 20 + rnd() * 78 : 0; return [o.x + Math.cos(a) * d, o.y + Math.sin(a) * d, j ? 9 + rnd() * 24 : 46]; }); });

  // ---------- Schlussbild ----------
  function finale(u) {
    const wm = MON[WIN];
    const kin = pr(u, .75, 1.3, ease.inOutCubic);
    // Strahlen hinter dem Sieger
    const bx = 216, by = 352, br = 128;
    c.save(); c.translate(bx, by); c.rotate(u * .25); c.globalAlpha = .5 * pr(u, 1.1, 1.6);
    for (let j = 0; j < 16; j++) { c.rotate(TAU / 16); c.fillStyle = j % 2 ? rgba(wm.col, .55) : 'rgba(255,46,126,.35)'; c.beginPath(); c.moveTo(0, 0); c.lineTo(250 + (j % 2) * 40, -26); c.lineTo(250 + (j % 2) * 40, 26); c.fill(); }
    c.restore();
    // Text
    const tx = 392, maxW = 560;
    let a = pr(u, 1.15, 1.5);
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.globalAlpha = a; c.fillStyle = '#FFFFFF'; c.font = `700 50px ${SANS}`; c.fillText('Der Lippenstift vom', tx, 262 + (1 - a) * 24);
    a = pr(u, 1.3, 1.7, ease.outBack);
    c.globalAlpha = clamp((u - 1.3) / .15); const sz = fitFont(c, wm.name, `400 SZpx ${DISP}`, maxW, 138);
    c.save(); c.translate(tx - 4, 388); c.scale(.8 + .2 * a, .8 + .2 * a); c.font = `400 ${sz}px ${DISP}`; c.fillStyle = PINK; c.fillText(wm.name, 0, 0); c.restore();
    a = pr(u, 1.5, 1.9);
    c.globalAlpha = a; c.fillStyle = '#FFFFFF'; c.font = `400 78px ${DISP}`; c.fillText('überlebt alles.', tx, 476 + (1 - a) * 24);
    c.globalAlpha = 1;
    // Rangliste 1–12 (zwei Spalten)
    const y0 = 556, rh = 119, cw = 432;
    order.forEach((mi, p) => {
      const col = p < 6 ? 0 : 1, row = p % 6, t0 = 1.7 + p * .075, k = pr(u, t0, t0 + .32, ease.outBack), al = clamp((u - t0) / .12);
      if (al <= 0) return;
      const x = 62 + col * (cw + 20), y = y0 + row * rh;
      c.save(); c.globalAlpha = al; c.translate(x + (1 - k) * (col ? 90 : -90), y);
      rrect(c, 0, 0, cw, rh - 14, 22); c.fillStyle = p === 0 ? PINK : 'rgba(255,255,255,.075)'; c.fill();
      if (p > 0) { c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke(); }
      c.textBaseline = 'middle'; c.textAlign = 'center';
      c.font = `400 66px ${DISP}`; c.fillStyle = p === 0 ? '#FFFFFF' : (p < 3 ? PINK2 : 'rgba(255,255,255,.72)'); c.fillText(String(p + 1), 56, 56);
      ball(c, mi, 146, 52, 35, -1, 0, { label: false });
      c.textAlign = 'left'; c.fillStyle = '#FFFFFF'; const fs = fitFont(c, MON[mi].name, `700 SZpx ${SANS}`, 222, 52); c.font = `${p === 0 ? 800 : 700} ${fs}px ${SANS}`; c.fillText(MON[mi].name, 196, 54);
      c.restore();
    });
    // Frage + Pfeil
    const kq = pr(u, 2.9, 3.3, ease.outBack), aq = clamp((u - 2.9) / .15);
    if (aq > 0) {
      c.save(); c.globalAlpha = aq; c.translate(505, 1392 + (1 - kq) * 40); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = `400 104px ${DISP}`;
      const t1 = 'Dein Monat? ', t2 = 'Platz?', w1 = c.measureText(t1).width, w2 = c.measureText(t2).width, xx = -(w1 + w2) / 2;
      c.textAlign = 'left'; c.fillStyle = '#FFFFFF'; c.fillText(t1, xx, 0); c.fillStyle = PINK; c.fillText(t2, xx + w1, 0);
      c.restore();
    }
    const ka = pr(u, 3.2, 3.6), bob = Math.sin(Math.max(0, u - 3.6) * 6.2) * 9;
    if (ka > 0) {
      c.save(); c.translate(505, 1430 + bob); c.strokeStyle = PINK; c.lineWidth = 11; c.lineCap = 'round'; c.lineJoin = 'round';
      c.setLineDash([140 * ka, 400]); c.stroke(P('M4 0 C-14 30 16 52 0 100')); c.setLineDash([]);
      if (ka > .9) c.stroke(P('M-32 70 L0 104 L36 74'));
      c.restore();
    }
    return [bx, by, br, kin];
  }

  // ---------- Frame ----------
  return (t) => {
    const u = t - TW, bp = (t / beat) % 1, pulse = Math.exp(-bp * 5.5);
    const [fa] = fr(t); const rage = fa[NM * 3 + NE * 3];
    let alive = NM, lastOut = -9, lastOutI = -1;
    for (let i = 0; i < NM; i++) if (t >= outT[i]) { alive--; if (outT[i] > lastOut) { lastOut = outT[i]; lastOutI = i; } }
    const kFin = pr(u, .75, 1.3, ease.inOutCubic), fieldA = 1 - kFin;

    // Screen-Shake
    let sx = 0, sy = 0;
    for (const o of R.outs) { const a = t - o.t; if (a >= 0 && a < .42) { const amp = (o.left === 1 ? 34 : 20) * (1 - a / .42) * (1 - a / .42); sx += Math.sin(a * 95 + o.i) * amp; sy += Math.cos(a * 78 + o.i * 2) * amp; } }
    for (let k = hits.length - 1; k >= 0; k--) { const a = t - hits[k].t; if (a < 0) continue; if (a > .12) break; const amp = hits[k].dmg * .32 * (1 - a / .12); sx += Math.sin(a * 140 + k) * amp; sy += Math.cos(a * 120 + k) * amp; }
    if (t < .35) { const amp = 16 * (1 - t / .35) * (1 - t / .35); sx += Math.sin(t * 90) * amp; sy += Math.cos(t * 70) * amp; }

    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
    c.drawImage(BG_, 0, 0);
    c.translate(sx, sy);

    if (fieldA > 0) {
      c.globalAlpha = fieldA;
      // ----- Hook -----
      const hk = 1 + .05 * (1 - pr(t, 0, .4)); 
      c.save(); c.translate(64, 330); c.scale(hk, hk); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      let s1 = fitFont(c, 'Dein Geburtsmonat kämpft.', `400 SZpx ${DISP}`, 900, 96);
      c.font = `400 ${s1}px ${DISP}`; c.fillStyle = '#FFFFFF'; c.fillText('Dein Geburtsmonat kämpft.', 0, -58);
      let s2 = fitFont(c, 'Wessen Lippenstift überlebt?', `400 SZpx ${DISP}`, 900, 96);
      c.font = `400 ${s2}px ${DISP}`; c.fillStyle = PINK; c.fillText('Wessen Lippenstift überlebt?', 0, 32);
      c.restore();

      // ----- Zähler „Noch 12“ + Feinde-Legende -----
      {
        const bump = lastOut > -1 ? 1 - pr(t, lastOut + .1, lastOut + .5) : 0;
        c.save(); c.translate(64, 396);
        rrect(c, 0, 0, 330, 104, 20); c.fillStyle = bump > 0 ? mix('#FFFFFF', PINK, 1 - bump) : PINK; c.fill();
        c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillStyle = bump > .5 ? INK : '#FFFFFF';
        c.font = `800 54px ${SANS}`; c.fillText('NOCH', 22, 72);
        c.textAlign = 'center'; c.save(); c.translate(256, 54); c.scale(1 + bump * .45, 1 + bump * .45); c.font = `800 92px ${SANS}`; c.textBaseline = 'middle'; c.fillText(String(lastOut > -1 && t < lastOut + .1 ? alive + 1 : alive), 0, 4); c.restore();
        c.restore();
        // Legende rechts
        c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.font = `700 30px ${SANS}`; c.fillStyle = 'rgba(255,255,255,.82)'; c.fillText('Jeder Treffer kostet Lippenstift:', 424, 428);
        for (let k = 0; k < NE; k++) {
          const on = fa[NM * 3 + k * 3 + 2] > 0 || t < 0;
          c.globalAlpha = fieldA * (on || u > 0 ? 1 : .32);
          const x = 452 + k * 82, y = 470;
          c.fillStyle = '#2A2030'; c.beginPath(); c.arc(x, y, 30, 0, TAU); c.fill(); c.lineWidth = 2.5; c.strokeStyle = 'rgba(247,234,223,.5)'; c.stroke();
          icon(c, k, x, y, .62);
        }
        c.globalAlpha = fieldA;
      }

      // ----- Arena -----
      const ins = R.insetAt(t);
      c.save();
      arenaPath(0); c.fillStyle = 'rgba(255,46,126,.10)'; c.fill();
      if (ins > 0) { // Sperrzone: Schraffur
        c.save(); arenaPath(0); c.clip(); c.strokeStyle = 'rgba(255,46,126,.28)'; c.lineWidth = 5;
        const off = (t * 26) % 34; c.beginPath(); for (let x = -1000 + off; x < 1100; x += 34) { c.moveTo(x, 500); c.lineTo(x + 950, 1450); } c.stroke(); c.restore();
      }
      arenaPath(ins);
      const fg = c.createLinearGradient(0, cf.cy - cf.hh, 0, cf.cy + cf.hh); fg.addColorStop(0, '#22132A'); fg.addColorStop(1, '#170C1B');
      c.fillStyle = fg; c.fill();
      // Boden: Punktraster + Kleckse
      c.save(); arenaPath(ins); c.clip();
      c.fillStyle = 'rgba(255,255,255,.055)';
      for (let gx = cf.cx - 420; gx <= cf.cx + 420; gx += 60) for (let gy = cf.cy - 420; gy <= cf.cy + 420; gy += 60) { c.beginPath(); c.arc(gx, gy, 3, 0, TAU); c.fill(); }
      c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 3; c.beginPath(); c.arc(cf.cx, cf.cy, 150, 0, TAU); c.stroke();
      R.outs.forEach((o, k) => {
        const a = t - o.t; if (a < 0) return; const grow = pr(a, 0, .35, ease.outCubic);
        c.fillStyle = rgba(MON[o.i].col, .34); splats[k].forEach(([x, y, r]) => { c.beginPath(); c.arc(lerp(o.x, x, grow), lerp(o.y, y, grow), r * grow, 0, TAU); c.fill(); });
        c.fillStyle = 'rgba(255,255,255,.34)'; c.font = `800 34px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(o.rank) + '.', o.x, o.y + 2);
      });
      c.restore();
      // Rand (pulsiert im Beat, glüht mit der Wut)
      const lw = 9 + pulse * 5 + rage * 3;
      c.shadowColor = PINK; c.shadowBlur = 26 + pulse * 30 + rage * 26;
      arenaPath(ins); c.lineWidth = lw; c.strokeStyle = mix(PINK, '#FFFFFF', pulse * .25 + rage * .2); c.stroke();
      c.shadowBlur = 0;
      arenaPath(ins + lw / 2 + 5); c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.16)'; c.stroke();
      c.restore();

      // ----- Schweife -----
      for (let i = 0; i < NM; i++) {
        if (t >= outT[i]) continue;
        for (let k = 9; k >= 1; k--) { const [x, y] = mpos(i, t - k / 60); c.globalAlpha = fieldA * .15 * (1 - k / 10); c.fillStyle = MON[i].spark; c.beginPath(); c.arc(x, y, cf.rm * (1 - k / 13), 0, TAU); c.fill(); }
      }
      for (let j = 0; j < NE; j++) {
        const st = epos(j, t)[2]; if (st < 2) continue;
        for (let k = 8; k >= 1; k--) { const [x, y] = epos(j, t - k / 60); c.globalAlpha = fieldA * .14 * (1 - k / 9); c.fillStyle = '#C8B6D0'; c.beginPath(); c.arc(x, y, cf.re * (1 - k / 11), 0, TAU); c.fill(); }
      }
      c.globalAlpha = fieldA;

      // ----- Gegner -----
      for (let j = 0; j < NE; j++) {
        let [x, y, st] = epos(j, t);
        if (st === 0) {
          if (u >= 0 && u < .3 && cf.spawn[j] < TW) { enemy(c, j, x, y, cf.re, t * 2, 2, 0, 1 - u / .3); }
          continue;
        }
        const born = cf.spawn[j], a = t - born; let pop = 1;
        if (born > 0 && a < .5) pop = ease.outBack(clamp(a / .4));
        enemy(c, j, x, y, cf.re, t * (1.6 + j * .23) * (j % 2 ? -1 : 1), st, rage, pop);
        if (born > 0 && a >= 0 && a < .9) { // Auftritt: Ring + Name
          c.save(); c.globalAlpha = fieldA * (1 - a / .9); c.strokeStyle = CREAM; c.lineWidth = 6; c.beginPath(); c.arc(cf.cx, cf.cy, 50 + a * 260, 0, TAU); c.stroke(); c.restore();
        }
      }

      // ----- Monate -----
      for (let i = 0; i < NM; i++) {
        if (t >= outT[i] || (i === WIN && u >= .75)) continue;
        const [x, y, hp] = mpos(i, t);
        let flash = 0, ghost = 0, ghostA = 0;
        const hs = hitsOf[i];
        for (let k = hs.length - 1; k >= 0; k--) { const a = t - hs[k].t; if (a < 0) continue; if (a > .6) break; flash = Math.max(flash, 1 - a / .2); if (!ghost) { ghost = (hs[k].hp + hs[k].dmg) / cf.hp; ghostA = 1 - a / .6; } }
        const r = cf.rm * (1 + .1 * Math.max(0, flash));
        ball(c, i, x, y, r, hp / cf.hp, Math.max(0, flash), { ghost, ghostA, blink: Math.floor(t * 8) % 2 === 0 });
      }

      // ----- Funken / Partikel -----
      const spark = (e, n, sp, life, sizeA, sizeB, cols, seed, dirx, diry, spread) => {
        const a = t - e.t; if (a < 0 || a > life) return; const rnd = rndOf(seed);
        for (let j = 0; j < n; j++) {
          const base = dirx === undefined ? rnd() * TAU : Math.atan2(diry, dirx) + (rnd() - .5) * spread, v = sp * (.25 + rnd() * .75), l = life * (.55 + rnd() * .45), sz = lerp(sizeA, sizeB, rnd()), col = cols[Math.floor(rnd() * cols.length)];
          if (a > l) continue; const k = a / l, drag = 1 - Math.exp(-a * 4);
          const x = e.x + Math.cos(base) * v * drag / 4, y = e.y + Math.sin(base) * v * drag / 4 + 260 * a * a;
          c.globalAlpha = fieldA * (1 - k * k); c.fillStyle = col; c.beginPath(); c.arc(x, y, sz * (1 - k * .6), 0, TAU); c.fill();
        }
        c.globalAlpha = fieldA;
      };
      for (let k = walls.length - 1; k >= 0; k--) { const e = walls[k], a = t - e.t; if (a < 0) continue; if (a > .22) break; c.globalAlpha = fieldA * (1 - a / .22) * .8; c.strokeStyle = '#FFFFFF'; c.lineWidth = 5; c.beginPath(); c.arc(e.x, e.y, 10 + a * 150, 0, TAU); c.stroke(); }
      for (let k = mms.length - 1; k >= 0; k--) { const e = mms[k], a = t - e.t; if (a < 0) continue; if (a > .3) break; spark(e, 5, 420, .3, 3, 6, ['#FFFFFF', MON[e.a].spark, MON[e.b].spark], 5000 + k); }
      for (let k = taps.length - 1; k >= 0; k--) { const e = taps[k], a = t - e.t; if (a < 0) continue; if (a > .25) break; spark(e, 4, 380, .25, 3, 5, ['#C8B6D0'], 9000 + k); }
      for (let k = hits.length - 1; k >= 0; k--) {
        const e = hits[k], a = t - e.t; if (a < 0) continue; if (a > .75) break; const m = MON[e.m];
        spark(e, 8 + Math.floor(e.dmg * .7), 520 + e.dmg * 22, .6, 4, 11, [m.col, m.spark, m.hi, '#FFFFFF'], 1000 + k, e.nx, e.ny, 2.4);
        if (a < .16) { c.globalAlpha = fieldA * (1 - a / .16); c.strokeStyle = '#FFFFFF'; c.lineWidth = 7; c.beginPath(); c.arc(e.x, e.y, 14 + a * 420, 0, TAU); c.stroke(); c.globalAlpha = fieldA; }
      }
      R.outs.forEach((o, k) => {
        const a = t - o.t; if (a < 0 || a > 1.1) return; const m = MON[o.i];
        spark({ t: o.t, x: o.x, y: o.y }, 54, 2300, 1.05, 6, 19, [m.col, m.col, m.spark, m.hi, '#FFFFFF'], 300 + k);
        if (a < .5) { c.globalAlpha = fieldA * (1 - a / .5); c.strokeStyle = m.hi; c.lineWidth = 16 * (1 - a / .5) + 2; c.beginPath(); c.arc(o.x, o.y, 40 + ease.outCubic(a / .5) * 300, 0, TAU); c.stroke(); c.globalAlpha = fieldA; }
        if (a < .14) { c.save(); arenaPath(0); c.clip(); c.fillStyle = `rgba(255,255,255,${.3 * (1 - a / .14)})`; c.fillRect(0, 400, W, 1200); c.restore(); }
      });
      // Gegner zerfallen beim Sieg
      if (u >= 0 && u < .7) for (let j = 0; j < NE; j++) { if (cf.spawn[j] >= TW) continue; const [x, y] = epos(j, TW - .01); spark({ t: TW + .12, x, y }, 12, 1200, .55, 4, 9, ['#5A4D5E', '#C8B6D0', CREAM], 700 + j); }

      // ----- Schadenszahlen -----
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      for (let k = hits.length - 1; k >= 0; k--) {
        const e = hits[k], a = t - e.t; if (a < 0) continue; if (a > .7) break;
        const kk = pr(a, 0, .18, ease.outBack), sz = 44 + e.dmg * 1.5;
        const [mx, my] = mpos(e.m, e.t);
        c.save(); c.globalAlpha = fieldA * (1 - pr(a, .45, .7)); c.translate(mx + (k % 2 ? 26 : -26), my - 78 - a * 90); c.rotate((k % 2 ? 1 : -1) * .1); c.scale(.4 + .6 * kk, .4 + .6 * kk);
        c.font = `800 ${sz}px ${SANS}`; c.lineWidth = 12; c.strokeStyle = INK; c.strokeText('−' + e.dmg, 0, 0); c.fillStyle = e.hp <= 0 ? PINK2 : '#FFFFFF'; c.fillText('−' + e.dmg, 0, 0);
        c.restore();
      }
      c.globalAlpha = fieldA;

      // ----- Leiste aller 12 Monate -----
      for (let i = 0; i < NM; i++) {
        const col = i % 6, row = Math.floor(i / 6), cw = 145, ch = 50, x = 50 + col * (cw + 8), y = 1436 + row * (ch + 8);
        const o = t - outT[i], out = o >= 0, hp = mpos(i, t)[2] / cf.hp, win = i === WIN && u >= 0;
        let hf = 0; const hs = hitsOf[i]; for (let k = hs.length - 1; k >= 0; k--) { const a = t - hs[k].t; if (a < 0) continue; if (a > .25) break; hf = 1 - a / .25; }
        c.save(); c.translate(x, y + (out && o < .3 ? Math.sin(o / .3 * Math.PI) * 8 : 0));
        rrect(c, 0, 0, cw, ch, 14); c.fillStyle = win ? PINK : out ? 'rgba(255,255,255,.05)' : mix('#2A1B30', '#FFFFFF', hf * .5); c.fill();
        if (!out) { // Mini-Lebensbalken
          c.save(); rrect(c, 0, 0, cw, ch, 14); c.clip(); c.fillStyle = hp < .25 ? PINK : MON[i].col; c.fillRect(0, ch - 8, cw * hp, 8); c.restore();
          c.fillStyle = MON[i].col; c.beginPath(); c.arc(27, 22, 14, 0, TAU); c.fill(); c.lineWidth = 2.5; c.strokeStyle = 'rgba(255,255,255,.75)'; c.stroke();
        } else {
          const kp = pr(o, .05, .4, ease.outBack);
          c.save(); c.translate(27, 25); c.scale(kp, kp); c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.arc(0, 0, 19, 0, TAU); c.fill();
          c.font = `800 25px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#FFFFFF'; c.fillText(String(rank[i]), 0, 2); c.restore();
        }
        c.font = `800 34px ${SANS}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = out ? 'rgba(255,255,255,.42)' : '#FFFFFF'; c.fillText(MON[i].k, 54, out ? 27 : 23);
        if (out) { const w = c.measureText(MON[i].k).width; c.strokeStyle = PINK; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(50, 27); c.lineTo(50 + (w + 8) * pr(o, 0, .25), 25); c.stroke(); }
        c.restore();
      }

      // ----- Einblendungen -----
      const slab = (txt, sub, col, a, dur, y, size, rot) => {
        if (a < 0 || a > dur) return;
        const k = pr(a, 0, .14, ease.outBack), outk = pr(a, dur - .12, dur);
        c.save(); c.globalAlpha = fieldA * (1 - outk); c.translate(cf.cx, y); c.rotate(rot); c.scale(.55 + .45 * k + outk * .1, .55 + .45 * k + outk * .1);
        c.font = `800 ${size}px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        const w = c.measureText(txt).width + 76, h = size * 1.22;
        c.fillStyle = 'rgba(0,0,0,.5)'; rrect(c, -w / 2 + 10, -h / 2 + 14, w, h, 20); c.fill();
        c.fillStyle = col; rrect(c, -w / 2, -h / 2, w, h, 20); c.fill(); c.lineWidth = 6; c.strokeStyle = '#FFFFFF'; c.stroke();
        c.fillStyle = '#FFFFFF'; c.lineWidth = 8; c.strokeStyle = 'rgba(20,4,12,.45)'; c.strokeText(txt, 0, 4); c.fillText(txt, 0, 4);
        if (sub) { c.font = `800 46px ${SANS}`; const w2 = c.measureText(sub).width + 44; c.fillStyle = INK; rrect(c, -w2 / 2, h / 2 - 8, w2, 66, 14); c.fill(); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.7)'; c.stroke(); c.fillStyle = '#FFFFFF'; c.fillText(sub, 0, h / 2 + 27); }
        c.restore();
      };
      spawns.forEach(e => { if (e.t > 0) slab('+ ' + cf.enemies[e.e], null, '#2A2030', t - e.t, .9, cf.cy - cf.hh + 120, 62, -.03); });
      slab('Die Arena schrumpft', null, '#2A2030', t - cf.shrinkT0, 1.1, cf.cy - cf.hh + 120, 62, .025);
      slab('FINALE', MON[R.outs[10].i].k + ' gegen ' + MON[WIN].k, PINK, t - (tFinale + .8), 1.0, cf.cy - 20, 150, -.05);
      R.outs.forEach((o, k) => slab(MON[o.i].k + ' ist raus', 'Platz ' + o.rank, mix(MON[o.i].col, '#12060C', .12), t - o.t - .04, .72, cf.cy - 20, 124, (k % 2 ? 1 : -1) * .045));
      c.globalAlpha = 1;
    }

    // ----- Schlussbild -----
    if (u >= .75) {
      const [bx, by, br, kin] = finale(u);
      const [x0, y0] = mpos(WIN, TW + .75);
      const beatp = 1 + .035 * pulse * kin;
      ball(c, WIN, lerp(x0, bx, kin), lerp(y0, by, kin), lerp(cf.rm, br, kin) * beatp, kin < .04 ? fa[WIN * 3 + 2] / cf.hp : -1, 0);
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  };
}};

// ---------- Cover ----------
SCENES.cover = { bg: INK, build(root) {
  const cv = el('canvas', { left: 0, top: 0 }, root); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.drawImage(background(), 0, 0);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = '#FFFFFF';
  c.font = `400 150px ${DISP}`; c.fillText('Dein', 540, 420); 
  let s = fitFont(c, 'Geburtsmonat', `400 SZpx ${DISP}`, 940, 170); c.font = `400 ${s}px ${DISP}`; c.fillText('Geburtsmonat', 540, 570);
  c.save(); c.translate(540, 690); c.rotate(-.035); c.font = `400 150px ${DISP}`; const w = c.measureText('kämpft').width + 90; rrect(c, -w / 2, -128, w, 176, 18); c.fillStyle = PINK; c.fill(); c.fillStyle = '#FFFFFF'; c.fillText('kämpft', 0, 0); c.restore();
  // Arena-Ausschnitt mit 12 Kugeln
  const cx = 540, cy = 1110;
  c.shadowColor = PINK; c.shadowBlur = 50; rrect(c, cx - 440, cy - 290, 880, 580, 130); c.fillStyle = '#1C1022'; c.fill(); c.lineWidth = 12; c.strokeStyle = PINK; c.stroke(); c.shadowBlur = 0;
  const pos = [[-330, -170], [-165, -195], [0, -160], [170, -195], [330, -165], [-250, -20], [-80, 5], [95, -25], [265, -5], [-335, 150], [-150, 175], [330, 160]];
  const hp = [1, .7, .45, .9, .2, .85, .6, 1, .35, .75, .5, .95];
  pos.forEach(([x, y], i) => ball(c, i, cx + x, cy + y, 66, hp[i], 0, {}));
  enemy(c, 0, cx + 35, cy + 165, 58, .3, 3, 0); enemy(c, 4, cx + 180, cy + 150, 54, .9, 3, .6);
  // Teaser
  c.save(); c.translate(540, 1492); c.rotate(.02); c.font = `800 62px ${SANS}`; c.textAlign = 'center'; const t = 'Nur ein Lippenstift überlebt', w2 = c.measureText(t).width + 70; rrect(c, -w2 / 2, -68, w2, 104, 16); c.fillStyle = '#FFFFFF'; c.fill(); c.fillStyle = INK; c.fillText(t, 0, 4); c.restore();
}};
}
