/* R605 – Wettkampf-Simulation „Wer killt roten Lippenstift zuerst?“ [KI]
 * Die Physik steht in sim.js (dieselbe Datei nutzt make_sfx.js für den Ton). Hier wird sie nur abgespielt. */
(function () { const s = document.currentScript.src.replace(/scene\.js.*$/, 'sim.js'); document.write('<script src="' + s + '"><\/script>'); })();
{
const { el, svg, place, ART, C, F, tw, pr, ease, clamp, lerp } = DT;
const S = C.schwarz, ROT = '#C2264B', WEIN = '#7E2944';

// ---------- Kugeln: Farbe + kleines flaches Icon (viewBox um 0/0, ca. ±30) ----------
const BALLS = [
  { name: 'Kaffee', fill: S, ink: C.weiss, icon: `
    <path d="M-12 -17 c-6 -6 6 -9 0 -16 M5 -17 c-6 -6 6 -9 0 -16" fill="none" stroke="${C.rosa}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M-25 -9 H17 V5 a17 17 0 0 1 -17 17 h-8 a17 17 0 0 1 -17 -17Z" fill="${C.weiss}"/>
    <path d="M17 -4 h5 a8.500 8.500 0 0 1 0 17 h-7" fill="none" stroke="${C.weiss}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-30 29 H22" stroke="${C.weiss}" stroke-width="5" stroke-linecap="round"/>` },
  { name: 'Kuss', fill: C.beere, ink: C.weiss, icon: `<g transform="translate(0 -2) scale(.235) translate(-200 -200)">${ART.lips(.95, C.weiss)}</g>` },
  { name: 'Burger', fill: C.rosaTief, ink: S, icon: `
    <path d="M-29 -5 a29 24 0 0 1 58 0Z" fill="${C.weiss}" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="-10" cy="-17" r="2.200" fill="${S}"/><circle cx="3" cy="-21" r="2.200" fill="${S}"/><circle cx="13" cy="-14" r="2.200" fill="${S}"/>
    <path d="M-31 3 q7.700 9 15.500 0 t15.500 0 t15.500 0 t15.500 0" fill="none" stroke="${C.beere}" stroke-width="5.500" stroke-linecap="round"/>
    <rect x="-29" y="10" width="58" height="10" rx="5" fill="${S}"/>
    <rect x="-27" y="23" width="54" height="10" rx="5" fill="${C.weiss}" stroke="${S}" stroke-width="4"/>` },
  { name: 'Regen', fill: C.weiss, ink: S, icon: `
    <path d="M-20 6 a13 13 0 0 1 2 -26 a17 17 0 0 1 32 2 a12 12 0 0 1 4 24Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-13 15 l-5 13 M1 15 l-5 13 M15 15 l-5 13" stroke="${C.beere}" stroke-width="5" stroke-linecap="round"/>` },
  { name: 'Weinglas', fill: WEIN, ink: C.weiss, icon: `
    <path d="M-15.500 -16 h31 c-2 12 -7 17 -15.500 17 c-8.500 0 -13.500 -5 -15.500 -17Z" fill="${C.rosa}"/>
    <path d="M-17 -32 h34 c0 24 -6 35 -17 35 c-11 0 -17 -11 -17 -35Z M0 3 V27 M-13 29 H13" fill="none" stroke="${C.weiss}" stroke-width="4.500" stroke-linecap="round" stroke-linejoin="round"/>` },
  { name: 'Pasta', fill: C.rosa, ink: S, icon: `
    <path d="M-23 4 c-5 -17 7 -28 23 -28 c16 0 28 11 23 28Z" fill="${C.weiss}" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-12 -4 c2 -9 12 -12 18 -6 M-2 2 c4 -8 12 -8 16 -3 M-15 2 c0 -4 3 -6 6 -5" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-31 5 h62 a31 25 0 0 1 -62 0Z" fill="${S}"/>
    <path d="M14 -19 L31 -37" stroke="${S}" stroke-width="5" stroke-linecap="round"/>` },
];
/** Kugel als SVG-Gruppe um 0/0 (Radius r) */
function ballMarkup(i, r = 78) {
  const b = BALLS[i];
  return `<circle cx="5" cy="7" r="${r}" fill="${S}" opacity=".13"/>
    <circle r="${r - 2.5}" fill="${b.fill}" stroke="${S}" stroke-width="5"/>
    <path d="M${-r * .62} ${-r * .44} A${r * .76} ${r * .76} 0 0 1 ${-r * .2} ${-r * .73}" fill="none" stroke="${b.fill === C.weiss ? C.rosa : C.weiss}" stroke-opacity="${b.fill === S || b.fill === WEIN ? .28 : .7}" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(0 ${-r * .27}) scale(${r / 78 * 1.02})">${b.icon}</g>
    <text x="0" y="${r * .52}" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="${r * .385}" letter-spacing="-.4" fill="${b.ink}">${b.name}</text>`;
}

let SIM = null;
const sim = () => SIM || (SIM = R605SIM.simulate(R605SIM.CFG.seed));

SCENES.s1 = { bg: C.rosa, build(root) {
  root.style.isolation = 'isolate';
  const R = sim(), c = R.cfg, n = BALLS.length, TW = R.tWin, FPS = c.fps;
  const outT = new Array(n).fill(1e9); R.outs.forEach(o => outT[o.i] = o.t);
  const rank = new Array(n).fill(1); R.outs.forEach((o, k) => rank[o.i] = n - k);
  const hits = BALLS.map(() => []);
  R.events.forEach(e => { if (e.type === 'bb') { hits[e.a].push(e); hits[e.b].push(e); } else if (e.type === 'wall') hits[e.a].push(e); });
  const walls = R.events.filter(e => e.type === 'wall' && e.s > 150);

  // ----- Spielfeld -----
  const field = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
  // Hook (statisch ab Frame 0)
  const hook = el('div', { left: '84px', top: '204px', width: '900px', fontFamily: F.display, fontSize: '101px', lineHeight: 1.04, letterSpacing: '-2px', color: S }, field,
    `Wer killt roten<br>Lippenstift <span style="display:inline-block;color:${C.beere}">zuerst?</span>`);
  const zu = hook.querySelector('span');
  const rule = el('div', { left: '88px', top: '452px', fontFamily: F.sans, fontWeight: 600, fontSize: '35px', lineHeight: 1.2, color: S, whiteSpace: 'nowrap' }, field,
    `Wer zuletzt im Ring bleibt, ist der <span style="background:${S};color:${C.rosa};padding:1px 12px 5px;border-radius:5px;display:inline-block;transform:rotate(-1.5deg)">schlimmste Feind.</span>`);

  // Ring: Fläche + Lippenstift-Strich mit Lücke
  const ring = svg(`
    <circle cx="${c.cx + 10}" cy="${c.cy + 14}" r="${c.R + 12}" fill="${S}" opacity=".10"/>
    <circle cx="${c.cx}" cy="${c.cy}" r="${c.R}" fill="${C.rosaHell}"/>
    <circle cx="${c.cx}" cy="${c.cy}" r="${c.R - 62}" fill="none" stroke="${C.rosa}" stroke-width="3" stroke-dasharray="2 16" stroke-linecap="round"/>
    <path id="ro" fill="none" stroke="${S}" stroke-width="28" stroke-linecap="round"/>
    <path id="ri" fill="none" stroke="${ROT}" stroke-width="17" stroke-linecap="round"/>
    <path id="rh" fill="none" stroke="${C.weiss}" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>`,
    { left: 0, top: 0 }, field, '0 0 1080 1920', 1080, 1920);
  const pO = ring.querySelector('#ro'), pI = ring.querySelector('#ri'), pH = ring.querySelector('#rh');
  ring.style.transformOrigin = `${c.cx}px ${c.cy}px`;
  const arc = (rad, a1, a2) => {
    const x1 = c.cx + Math.cos(a1) * rad, y1 = c.cy + Math.sin(a1) * rad, x2 = c.cx + Math.cos(a2) * rad, y2 = c.cy + Math.sin(a2) * rad;
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${rad} ${rad} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const stick = svg(`<g transform="translate(200 210)">
      <rect x="-38" y="20" width="76" height="140" rx="10" fill="${S}"/><rect x="-38" y="20" width="76" height="22" fill="#3a2e33"/>
      <rect x="-30" y="-40" width="60" height="64" fill="${C.weiss}" stroke="${S}" stroke-width="5"/>
      <path d="M-24 -40 L-24 -120 L24 -150 L24 -40Z" fill="${ROT}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-13 -112 L-13 -50" stroke="${C.weiss}" stroke-opacity=".4" stroke-width="6" stroke-linecap="round"/></g>`, {}, field, '0 0 400 400', 250, 250);
  place(stick, 944, 1262, 1, 24);
  // Zähler in der Ringmitte
  const cnt = el('div', { left: (c.cx - 200) + 'px', top: (c.cy - 150) + 'px', width: '400px', textAlign: 'center', color: C.rosaTief }, field);
  el('div', { position: 'relative', fontFamily: F.sans, fontWeight: 700, fontSize: '44px', letterSpacing: '6px', textTransform: 'uppercase' }, cnt, 'Noch');
  const num = el('div', { position: 'relative', fontFamily: F.display, fontSize: '230px', lineHeight: .95 }, cnt, '6');

  // Rangliste (unter dem Ring)
  const chips = BALLS.map((b, i) => {
    const col = i % 3, row = (i / 3) | 0;
    const ch = el('div', { left: (88 + col * 293) + 'px', top: (1404 + row * 76) + 'px', width: '278px', height: '62px', borderRadius: '31px', border: `4px solid ${S}`, background: C.weiss, boxSizing: 'border-box' }, field);
    const dot = el('div', { left: '7px', top: '6px', width: '42px', height: '42px', borderRadius: '50%', background: b.fill, border: `3px solid ${S}`, boxSizing: 'border-box' }, ch);
    const tx = el('div', { left: '62px', top: '3px', fontFamily: F.sans, fontWeight: 700, fontSize: '36px', color: S, whiteSpace: 'nowrap' }, ch, b.name);
    const line = el('div', { left: '-5px', top: '25px', width: 'calc(100% + 10px)', height: '5px', background: C.beere, borderRadius: '3px', transformOrigin: '0 50%' }, tx);
    const pl = el('div', { left: '7px', top: '6px', width: '42px', height: '42px', borderRadius: '50%', background: rank[i] === 1 ? C.beere : S, color: C.weiss, fontFamily: F.sans, fontWeight: 800, fontSize: '28px', lineHeight: '39px', textAlign: 'center' }, ch, String(rank[i]));
    return { ch, dot, tx, line, pl };
  });

  // Funken an der Ringwand
  const sparks = Array.from({ length: 5 }, () => svg(`<circle cx="40" cy="40" r="30" fill="none" stroke="${C.weiss}" stroke-width="6"/>`, { display: 'none' }, field, '0 0 80 80', 80, 80));
  // ----- Schlussbild -----
  const fin = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.rosaHell, display: 'none' }, root);
  DT.paper(fin, C.rosaHell);
  const W = R.winner;
  const halo = svg(`<circle cx="330" cy="330" r="286" fill="${C.rosa}"/>
    ${Array.from({ length: 18 }, (_, k) => { const a = k / 18 * Math.PI * 2, r1 = 304, r2 = k % 2 ? 326 : 340; return `<path d="M${330 + Math.cos(a) * r1} ${330 + Math.sin(a) * r1} L${330 + Math.cos(a) * r2} ${330 + Math.sin(a) * r2}" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`; }).join('')}`,
    {}, fin, '0 0 660 660', 660, 660);
  const kl = el('div', { left: '84px', top: '212px', fontFamily: F.display, fontSize: '112px', lineHeight: 1, letterSpacing: '-2px', color: S, whiteSpace: 'nowrap' }, fin, 'Killer Nr. 1:');
  const kn = el('div', { left: '84px', top: '330px', fontFamily: F.display, fontSize: '168px', lineHeight: 1, letterSpacing: '-4px', color: C.beere, whiteSpace: 'nowrap', transformOrigin: '0 80%' }, fin, BALLS[W].name);
  const q = el('div', { left: '0px', top: '1262px', width: '1080px', textAlign: 'center', fontFamily: F.display, fontSize: '80px', lineHeight: 1.05, letterSpacing: '-1.5px', color: S }, fin,
    `Was killt <span style="color:${C.beere}">deinen</span> immer?`);
  const arrow = svg(`<path d="M52 8 C36 50 66 78 48 132" fill="none" stroke="${S}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M18 104 L47 138 L84 110" fill="none" stroke="${S}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`, {}, fin, '0 0 100 150', 100, 150);
  const aP = arrow.querySelectorAll('path');

  // ----- Kugeln (über allem) -----
  const D = 2 * c.r + 24;
  const balls = BALLS.map((b, i) => svg(ballMarkup(i, c.r), { left: 0, top: 0 }, root, `${-D / 2} ${-D / 2} ${D} ${D}`, D, D));
  const BIG = 3.25; // Sieger-Kugel in voller Größe gezeichnet (bleibt beim Vergrößern scharf)
  const big = svg(ballMarkup(W, c.r), { left: 0, top: 0, display: 'none' }, root, `${-D / 2} ${-D / 2} ${D} ${D}`, D * BIG, D * BIG);

  // „raus!“-Notizen (über den Kugeln, etwas nach innen versetzt)
  const notes = R.outs.map((o, k) => {
    const f = R.frames[Math.min(R.frames.length - 1, Math.round(o.t * FPS))];
    const ex = f[o.i * 2] - c.cx, ey = f[o.i * 2 + 1] - c.cy, ed = Math.hypot(ex, ey) || 1, rr = c.R - 190;
    const x = c.cx + ex / ed * rr, y = c.cy + ey / ed * rr;
    return el('div', { left: (x - 85) + 'px', top: (y - 55) + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: '84px', color: S, whiteSpace: 'nowrap', display: 'none', zIndex: 3, textShadow: '-4px 0px 0 #fff, 4px 0px 0 #fff, 0px -4px 0 #fff, 0px 4px 0 #fff, -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff' }, root, 'raus!');
  });


  const pos = (i, t) => {
    const ff = clamp(t * FPS, 0, R.frames.length - 1), f0 = Math.floor(ff), f1 = Math.min(R.frames.length - 1, f0 + 1), k = ff - f0;
    return [lerp(R.frames[f0][i * 2], R.frames[f1][i * 2], k), lerp(R.frames[f0][i * 2 + 1], R.frames[f1][i * 2 + 1], k)];
  };

  return (t) => {
    const u = t - TW;                       // Zeit seit dem Sieg
    const kf = pr(u, .9, 1.45, ease.inOutCubic); // Übergang ins Schlussbild
    // Ring
    const rot = R.rotAt(t), gap = Math.max(.0012, R.gapAt(t));
    const a1 = rot + gap, a2 = rot + Math.PI * 2 - gap;
    pO.setAttribute('d', arc(c.R, a1, a2)); pI.setAttribute('d', arc(c.R, a1, a2));
    pH.setAttribute('d', arc(c.R + 3, a1 + .5, a1 + 1.25));
    const snap = u > 0 ? Math.sin(clamp(u / .7) * Math.PI) * .035 * (1 - clamp((u - .2) / .5) * .3) : 0;
    ring.style.transform = `scale(${1 + snap})`;
    field.style.opacity = 1 - kf; field.style.display = kf >= 1 ? 'none' : 'block';
    zu.style.transform = `rotate(${Math.sin(t * 2.1) * 1.6 - 2}deg)`;
    // Zähler
    let alive = n, last = -9;
    for (let i = 0; i < n; i++) if (t >= outT[i]) { alive--; if (outT[i] > last) last = outT[i]; }
    num.textContent = alive;
    const pk = pr(t, last, last + .4, ease.outBack);
    num.style.transform = `scale(${last < 0 ? 1 : .6 + .4 * pk})`;
    cnt.style.color = alive === 1 ? C.beere : C.rosaTief;
    // Rangliste
    chips.forEach((ch, i) => {
      const o = t - outT[i], k = pr(o, 0, .3), win = i === W && u >= 0;
      ch.line.style.transform = `scaleX(${k})`; ch.line.style.opacity = o >= 0 ? 1 : 0;
      ch.tx.style.color = win ? C.weiss : (o >= 0 ? '#8a767d' : S);
      const kp = win ? pr(u, .1, .5, ease.outBack) : pr(o, .1, .5, ease.outBack);
      ch.pl.style.opacity = (win ? u : o) >= .1 ? 1 : 0; ch.pl.style.transform = `scale(${kp})`;
      ch.ch.style.background = win ? S : (o >= 0 ? C.rosaHell : C.weiss);
      ch.ch.style.transform = o >= 0 && o < .3 ? `translateY(${Math.sin(o / .3 * Math.PI) * 7}px)` : (win ? `scale(${1 + .06 * Math.sin(clamp(u / .5) * Math.PI)})` : 'none');
    });
    // Funken
    let si = 0;
    for (let k = walls.length - 1; k >= 0 && si < sparks.length; k--) {
      const e = walls[k]; if (e.t > t) continue; if (t - e.t > .26) break;
      const a = (t - e.t) / .26, sp = sparks[si++];
      sp.style.display = 'block';
      const dx = c.cx - e.x, dy = c.cy - e.y, dl = Math.hypot(dx, dy) || 1;
      place(sp, e.x + dx / dl * 16, e.y + dy / dl * 16, .25 + a * .9 * clamp(e.s / 500, .5, 1.2), 0, (1 - a) * .9);
    }
    for (; si < sparks.length; si++) sparks[si].style.display = 'none';
    // „raus!“
    notes.forEach((nn, k) => {
      const o = t - R.outs[k].t, on = o >= 0 && o < 1.1;
      nn.style.display = on ? 'block' : 'none';
      if (on) { nn.style.opacity = clamp(o / .08) * (1 - pr(o, .8, 1.1)) * (1 - kf); nn.style.transform = `rotate(${-7 + (k % 2) * 12}deg) scale(${.5 + .5 * pr(o, 0, .3, ease.outBack)}) translateY(${-o * 26}px)`; }
    });
    // Kugeln
    for (let i = 0; i < n; i++) {
      const b = balls[i], o = t - outT[i];
      let [x, y] = pos(i, t), s = 1, op = 1, r = Math.sin(t * 1.7 + i * 2.1) * 5;
      // Treffer-Puls
      const hs = hits[i]; let pulse = 0;
      for (let k = hs.length - 1; k >= 0; k--) { const d = t - hs[k].t; if (d < 0) continue; if (d > .25) break; pulse = Math.max(pulse, (1 - d / .25) * clamp(hs[k].s / 900, .25, 1)); }
      s += pulse * .09;
      if (o >= 0) { op = 1 - pr(o, .45, .95); s *= 1 - .25 * pr(o, 0, .9); r += o * 160 * (i % 2 ? 1 : -1); if (y > 2100) op = 0; }
      if (i === W && u > 0) {
        x = lerp(x, 540, kf); y = lerp(y, 880, kf);
        s = lerp(s, 3.25, kf) * (1 + .03 * Math.sin(Math.max(0, u - 1.45) * 3.2) * kf);
        r = lerp(r, -5 + Math.sin(u * 1.6) * 2.5, kf);
      }
      if (i === W) { const useBig = u > .9; big.style.display = useBig ? 'block' : 'none'; if (useBig) { place(big, x, y, s / BIG, r, 1); op = 0; } }
      b.style.display = op <= 0 ? 'none' : 'block';
      if (op > 0) place(b, x, y, s, r, op);
    }
    // Schlussbild
    fin.style.display = u > .9 ? 'block' : 'none';
    if (u > .9) {
      fin.style.opacity = kf;
      place(halo, 540, 880, .7 + .3 * pr(u, 1.0, 1.6, ease.outBack), u * 9, pr(u, 1.0, 1.3));
      kl.style.opacity = pr(u, 1.25, 1.55); kl.style.transform = `translateY(${(1 - pr(u, 1.25, 1.7, ease.outBack)) * 40}px)`;
      const kk = pr(u, 1.55, 2.0, ease.outBack);
      kn.style.opacity = clamp((u - 1.55) / .12); kn.style.transform = `scale(${.7 + .3 * kk}) rotate(${-3 + (1 - kk) * -4}deg)`;
      const kq = pr(u, 2.35, 2.8, ease.outBack);
      q.style.opacity = clamp((u - 2.35) / .15); q.style.transform = `translateY(${(1 - kq) * 46}px)`;
      const ka = pr(u, 2.8, 3.2);
      aP[0].setAttribute('stroke-dashoffset', 1 - ka); aP[1].setAttribute('opacity', ka > .92 ? 1 : 0);
      place(arrow, 540, 1452 + Math.sin(Math.max(0, u - 3.2) * 5) * 9, 1, 0, clamp((u - 2.8) / .1));
    }
  };
}};

// ---------- Cover ----------
SCENES.cover = { build(root) {
  const g = (i, x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${ballMarkup(i, 78)}</g>`;
  KIT.coverLayout(root, {
    lines: ['Wer *killt*', 'roten Lippenstift', 'zuerst?'], size: 112, textY: 330,
    teaser: '6 Feinde, 1 Ring. Wer bleibt?', teaserY: 1370,
    artBox: '0 0 400 400', artSize: 600, artY: 1030,
    art: `<path d="M 352 262 A 168 168 0 1 1 366 180" fill="none" stroke="${S}" stroke-width="17" stroke-linecap="round"/>
      <path d="M 352 262 A 168 168 0 1 1 366 180" fill="none" stroke="${ROT}" stroke-width="10" stroke-linecap="round"/>
      ${g(4, 128, 132, .78, -8)}${g(1, 262, 150, .78, 7)}${g(5, 118, 268, .74, 6)}${g(0, 228, 262, .92, -5)}${g(3, 392, 232, .62, 14)}`,
  });
}};
}
