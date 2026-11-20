/* R602 – Der Handgelenk-Test für dein Rot  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const { sourceCard, sendTo, qMark, coverLayout } = KIT;
const S = C.schwarz;
// Ausnahme-Farben dieses Videos: vier Rottöne + dezente Adernfarben
const ROT = { himbeer: '#C21E56', karmin: '#A3122B', tomate: '#E2371C', koralle: '#F4654F' };
const ADER = { neutral: '#A796A6', blau: '#5767BE', violett: '#8B62B5', gruen: '#4C9A76' };
const GOLD = '#D8C3A5';

// ---------- Helfer ----------
function put(n, x, y, sx = 1, sy = sx, r = 0, o = 1) {
  const w = parseFloat(n.style.width), h = parseFloat(n.style.height);
  n.style.left = '0px'; n.style.top = '0px';
  n.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${r}deg) scale(${sx}, ${sy})`;
  n.style.opacity = o;
}
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(',') + ')'; };
const vein = (d, color, p = 1, w = 9, op = .78) => p <= 0 ? '' :
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="${op}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(p)}"/>`;

// ---------- eigene Illustrationen ----------
/** Unterarm mit Hand, viewBox 0 0 600 1000. side: 'palm' (Innenseite, Adern) | 'back' (Handrücken, Nägel). */
function arm(o = {}) {
  const side = o.side || 'palm', vp = o.vp ?? 0, cols = o.cols || [ADER.neutral, ADER.neutral, ADER.neutral];
  const fingers = [[226, 420, 198, 258, 50], [279, 404, 268, 196, 54], [333, 404, 342, 206, 54], [384, 420, 412, 266, 48]];
  const thumb = [228, 560, 122, 448, 60];
  const parts = (col, extra) => `
    <path d="M222 600 L206 1000 L404 1000 L384 600Z" fill="${col}" stroke="${col}" stroke-width="${extra}" stroke-linejoin="round"/>
    <rect x="190" y="372" width="228" height="254" rx="80" fill="${col}" stroke="${col}" stroke-width="${extra}"/>
    ${[...fingers, thumb].map(([a, b, c, d, w]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w + extra}" stroke-linecap="round"/>`).join('')}`;
  const palm = `
    <path d="M232 468 C270 500 330 498 382 458" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M238 522 C282 542 330 530 374 498" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M268 606 C252 556 262 506 302 474" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M236 634 Q302 648 374 634 M232 658 Q302 670 378 658" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    ${vein('M286 884 C280 830 302 790 292 734 C288 706 272 690 264 676', cols[0], vp * 1.3)}
    ${vein('M294 776 C312 746 334 716 338 678', cols[1], vp * 1.6 - .5)}
    ${vein('M342 884 C348 850 330 820 340 784', cols[2], vp * 1.6 - .3)}`;
  const back = `
    ${[...fingers, thumb].map(([a, b, c, d, w]) => { const ang = Math.atan2(c - a, -(d - b)) * 180 / Math.PI; return `<rect x="${c - w * .3}" y="${d - w * .34}" width="${w * .6}" height="${w * .78}" rx="${w * .28}" transform="rotate(${ang} ${c} ${d})" fill="${ROT.karmin}"/>`; }).join('')}
    ${fingers.map(([a, b]) => `<path d="M${a - 12} ${b - 4} Q${a} ${b - 14} ${a + 12} ${b - 4}" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M250 640 Q302 652 356 640" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  return `<g>
    ${parts(S, 13)}${parts(C.haut, 0)}
    ${side === 'palm' ? palm : back}
    <path d="M180 900 L428 900 L470 1900 L138 1900Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="170" y="880" width="268" height="46" rx="16" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
  </g>`;
}

/** Nahaufnahme Handgelenk quer, viewBox 0 0 1080 700. cols: 4 Adernfarben, vp Zeichen-Fortschritt, pulse 0..1 */
function wrist(o = {}) {
  const cols = o.cols || Array(4).fill(ADER.neutral), vp = o.vp ?? 1, w = 14 + (o.pulse ?? 0) * 3;
  const shape = `<path d="M-40 226 L700 250 C760 250 800 214 880 196 L1130 150 L1130 590 L880 546 C800 532 760 502 700 502 L-40 546Z"/>`;
  return `<g>
    <g fill="${C.haut}" stroke="${S}" stroke-width="8" stroke-linejoin="round">${shape}</g>
    <path d="M712 264 Q732 376 714 490 M742 258 Q762 376 744 496" fill="none" stroke="${C.hautDunkel}" stroke-width="6" stroke-linecap="round"/>
    <path d="M930 196 C872 300 886 430 990 540" fill="none" stroke="${C.hautDunkel}" stroke-width="6" stroke-linecap="round"/>
    ${vein('M186 398 C262 378 332 420 420 394 C502 370 584 350 688 340', cols[0], vp * 1.25, w)}
    ${vein('M420 394 C500 420 592 442 690 430', cols[1], vp * 1.6 - .5, w - 2)}
    ${vein('M204 314 C282 298 342 330 404 310', cols[2], vp * 1.6 - .25, w - 4)}
    ${vein('M250 474 C330 486 384 456 446 472', cols[3], vp * 1.6 - .4, w - 4)}
    <path d="M-40 190 L124 200 L124 572 L-40 582Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="104" y="192" width="50" height="388" rx="18" fill="${C.weiss}" stroke="${S}" stroke-width="8"/>
  </g>`;
}

/** Lippenstift, viewBox 0 0 200 520. up 0..1 = herausgedreht */
function stick(color, up = 1) {
  const Y = 330 - up * 130;
  return `<g>
    <path d="M70 ${Y} L70 ${Y - 96} L130 ${Y - 132} L130 ${Y}Z" fill="${color}"/>
    <path d="M70 ${Y - 96} L130 ${Y - 132}" stroke="#fff" stroke-opacity=".4" stroke-width="6" stroke-linecap="round"/>
    <rect x="62" y="194" width="76" height="70" fill="${GOLD}" stroke="${S}" stroke-width="6"/>
    <rect x="46" y="254" width="108" height="250" rx="12" fill="${S}"/>
    <rect x="46" y="282" width="108" height="14" fill="#3a2e33"/>
    <rect x="62" y="318" width="10" height="150" rx="5" fill="#fff" opacity=".16"/>
  </g>`;
}
const SMEAR = 'M10 52 C40 12 120 34 200 20 C262 8 322 18 332 46 C342 74 282 80 222 86 C150 94 60 104 24 86 C4 78 0 64 10 52Z';

/** Handspiegel, viewBox 0 0 500 800. Lippen in Farbe a, darüber Farbe b mit Deckkraft k */
function mirror(a, b, k) {
  return `<g>
    <rect x="222" y="520" width="56" height="250" rx="28" fill="${C.rosaTief}" stroke="${S}" stroke-width="8"/>
    <circle cx="250" cy="730" r="9" fill="${S}"/>
    <ellipse cx="250" cy="280" rx="206" ry="256" fill="${C.rosaTief}" stroke="${S}" stroke-width="8"/>
    <clipPath id="glas"><ellipse cx="250" cy="280" rx="172" ry="222"/></clipPath>
    <ellipse cx="250" cy="280" rx="172" ry="222" fill="${C.rosaHell}"/>
    <g clip-path="url(#glas)">
      <path d="M70 30 L430 30 L430 300 C430 420 330 492 250 492 C170 492 70 420 70 300Z" fill="${C.haut}"/>
      <path d="M238 110 C242 170 236 196 222 210 C240 220 262 220 280 210 C266 196 260 170 264 110" fill="none" stroke="${C.hautDunkel}" stroke-width="6" stroke-linecap="round"/>
      <path d="M200 436 C230 452 270 452 300 436" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
      <g transform="translate(250 322) scale(.74) translate(-200 -200)">${ART.lips(.6, a)}<g opacity="${k}">${ART.lips(.6, b)}</g></g>
    </g>
    <ellipse cx="250" cy="280" rx="172" ry="222" fill="none" stroke="${S}" stroke-width="6"/>
    <path d="M128 150 L168 104 M118 208 L196 118" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".85"/>
  </g>`;
}

function windowArt() {
  return `<g>
    <rect x="150" y="240" width="780" height="470" fill="${C.weiss}" stroke="${S}" stroke-width="12"/>
    <circle cx="760" cy="370" r="62" fill="#FFE7B0"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="760" y1="278" x2="760" y2="254" stroke="#F3D48E" stroke-width="8" stroke-linecap="round" transform="rotate(${a} 760 370)"/>`).join('')}
    <path d="M150 640 C260 590 330 620 420 600 C520 578 600 628 700 606 C800 586 860 612 930 596 L930 710 L150 710Z" fill="${C.rosa}"/>
    <line x1="540" y1="240" x2="540" y2="710" stroke="${S}" stroke-width="10"/>
    <line x1="150" y1="470" x2="930" y2="470" stroke="${S}" stroke-width="8"/>
    <path d="M110 222 L270 222 C262 400 232 560 150 716 L110 716Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M970 222 L810 222 C818 400 848 560 930 716 L970 716Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M176 240 C172 400 160 520 132 640 M222 240 C220 360 208 460 186 540 M904 240 C908 400 920 520 948 640 M858 240 C860 360 872 460 894 540" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>
    <rect x="86" y="200" width="908" height="26" rx="13" fill="${S}"/>
    <rect x="110" y="710" width="860" height="34" rx="8" fill="${C.weiss}" stroke="${S}" stroke-width="8"/>
  </g>`;
}
const hourglass = (k) => `<g>
  <path d="M50 30 L150 30 M50 210 L150 210" stroke="${S}" stroke-width="12" stroke-linecap="round"/>
  <path d="M62 34 L138 34 C138 84 108 100 108 120 C108 140 138 156 138 206 L62 206 C62 156 92 140 92 120 C92 100 62 84 62 34Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M${72 + k * 22} ${lerp(56, 100, k)} L${128 - k * 22} ${lerp(56, 100, k)} C122 92 104 100 100 112 C96 100 78 92 ${72 + k * 22} ${lerp(56, 100, k)}Z" fill="${C.beere}"/>
  <path d="M70 202 C80 ${202 - k * 44} 120 ${202 - k * 44} 130 202Z" fill="${C.beere}"/>
  <line x1="100" y1="118" x2="100" y2="200" stroke="${C.beere}" stroke-width="4" stroke-dasharray="6 8" stroke-dashoffset="${-k * 60}"/>
</g>`;

/** Kärtchen, das von „?“ auf die Antwort umklappt */
function flipCard(root, html, o = {}) {
  const w = o.w ?? 840, h = o.h ?? 180, x = o.x ?? 540, y = o.y ?? 1160, r = o.r ?? -2;
  const card = el('div', { width: w + 'px', height: h + 'px', background: C.weiss, border: `6px solid ${S}`, borderRadius: '10px', boxShadow: `12px 12px 0 ${S}` }, root);
  const front = el('div', { left: 0, top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: (o.size ?? 80) + 'px', color: S, letterSpacing: '-1px', whiteSpace: 'nowrap' }, card, html);
  const q = el('div', { left: 0, top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: '120px', color: S }, card, '?');
  return (t, tf) => {
    const k = pr(t, tf, tf + .5, ease.inOutCubic), sy = Math.abs(Math.cos(k * Math.PI));
    q.style.opacity = k < .5 ? 1 : 0; front.style.opacity = k < .5 ? 0 : 1;
    const inn = pr(t, .15, .6, ease.outBack);
    put(card, x, y + (1 - inn) * 60, 1, Math.max(.03, sy), r + Math.sin(t * 1.7) * .8 + (k > .5 ? tw(t, tf + .25, tf + .7, 3, 0, ease.outBack) : 0), clamp((t - .15) / .15));
  };
}

// ============ s1 – Hook ============
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const T = ctx.dur * .52; // „Schau auf dein Handgelenk.“
  const hook = bigText(root, 'Du trägst vielleicht das *falsche* Rot.', { x: 80, y: 206, w: 860, size: 106 });
  hook.update(99);
  const lipsBase = svg(ART.lips(.6, C.lippeHell), {}, root, '0 0 400 400', 400, 400);
  const lipsRed = svg(ART.lips(.6, ROT.karmin), {}, root, '0 0 400 400', 400, 400);
  const ls = svg(stick(ROT.karmin, 1), {}, root, '0 0 200 520', 200, 520);
  const a = svg(arm({ side: 'back' }), {}, root, '0 0 600 1000', 600, 1000);
  const ring = svg(`<ellipse cx="150" cy="120" rx="132" ry="100" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-6 150 120)"/>`, {}, root, '0 0 300 240', 300, 240);
  const n = el('div', { left: '700px', top: '900px', fontFamily: F.hand, fontWeight: 700, fontSize: '84px', color: S, transform: 'rotate(-5deg)', whiteSpace: 'pre', lineHeight: .95 }, root, 'schau\nmal hier');
  return (t) => {
    // Lippenstift trägt auf (läuft schon in Frame 0)
    const k = tw(t, 0, 1.7, .5, 1, ease.inOutSine), gone = pr(t, T - .25, T + .2);
    const lx = 480, ly = 690, sc = 1.4;
    put(lipsBase, lx, ly, sc, sc, 0, 1 - gone); put(lipsRed, lx, ly, sc, sc, 0, 1 - gone);
    lipsRed.style.clipPath = `inset(0 ${(1 - (50 + k * 300) / 400) * 100}% 0 0)`;
    const tipX = lx + (50 + k * 300 - 200) * sc, tipY = ly + 14 - Math.sin(k * Math.PI) * 26 + Math.sin(t * 9) * 3;
    const away = pr(t, 1.75, 2.3, ease.inCubic), s = .78;
    put(ls, tipX + 169 * s + away * 500, tipY - 61 * s - away * 160, s, s, 250 + away * 20);
    // Hand dreht sich und zeigt das Handgelenk
    const f = pr(t, T, T + .75, ease.inOutCubic), sx = -Math.cos(f * Math.PI);
    const vp = pr(t, T + .7, T + 1.5);
    a.querySelector('svg').innerHTML = arm({ side: f < .5 ? 'back' : 'palm', vp });
    const sc2 = lerp(.75, .95, f);
    put(a, lerp(520, 500, f) + noise(t, 3) * 4, lerp(1150, 900, f) + noise(t, 5) * 5, sc2 * (Math.abs(sx) < .04 ? .04 : sx), sc2, lerp(-5, 3, f) + noise(t, 1) * 1.2);
    const rp = pr(t, T + .9, T + 1.5);
    put(ring, 500, 1150, 1, 1, 0, rp > 0 ? 1 : 0); ring.querySelector('ellipse').setAttribute('stroke-dashoffset', 1 - rp);
    const np = pr(t, T + 1.0, T + 1.4);
    n.style.opacity = np; n.style.clipPath = `inset(0 ${100 - np * 100}% 0 0)`;
  };
}};

// ============ s2 – Fenster, Tageslicht, „ich warte“ ============
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const d = ctx.dur, T2 = d * .36, T3 = d * .6;
  svg(windowArt(), { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const beam = svg(`<path d="M548 748 L900 748 L930 1930 L380 1930Z" fill="#fff"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const a = svg(arm({}), {}, root, '0 0 600 1000', 600, 1000);
  const txt = bigText(root, 'Mach den Test.', { x: 70, y: 850, w: 420, size: 96, t0: T3, step: .12 });
  const wait = el('div', { left: '76px', top: '1076px', fontFamily: F.hand, fontWeight: 700, fontSize: '92px', color: C.beere, transform: 'rotate(-4deg)', whiteSpace: 'pre' }, root, 'Ich warte');
  const dots = [0, 1, 2].map(i => el('div', { left: (400 + i * 34) + 'px', top: '1136px', width: '18px', height: '18px', borderRadius: '50%', background: C.beere }, root));
  const hg = svg(hourglass(0), {}, root, '0 0 200 240', 130, 156);
  return (t) => {
    const inn = pr(t, 0, .8);
    beam.style.opacity = tw(t, .5, 1.4, 0, .6) + Math.sin(t * 1.4) * .04;
    const vp = pr(t, T2, T2 + 1.1, ease.inOutSine);
    a.querySelector('svg').innerHTML = arm({ vp });
    put(a, 690 + noise(t, 2) * 5, 1010 + (1 - inn) * 700 + noise(t, 4) * 5, .82, .82, 5 + noise(t, 1) * 1.2);
    txt.update(t);
    const w = pr(t, T3 + .6, T3 + .95);
    wait.style.opacity = w; wait.style.clipPath = `inset(0 ${100 - w * 100}% 0 0)`;
    dots.forEach((dd, i) => { const ph = ((t - T3 - 1) * 1.6 - i * .22) % 1.4; dd.style.opacity = t > T3 + 1 + i * .25 ? 1 : 0; dd.style.transform = `translateY(${ph > 0 && ph < .5 ? -Math.sin(ph / .5 * Math.PI) * 16 : 0}px)`; });
    const hk = pr(t, T3 + .7, T3 + 1.1, ease.outBack), tt = Math.max(0, t - T3 - .7), cyc = tt % 1.5;
    hg.querySelector('svg').innerHTML = hourglass(clamp(cyc / 1.1));
    put(hg, 170, 1310, hk, hk, (Math.floor(tt / 1.5) + pr(cyc, 1.1, 1.5, ease.inOutCubic)) * 180 - 6, hk > 0 ? 1 : 0);
  };
}};

// ============ s3 / s5 – Aha: Adernfarbe ============
function veinScene(o) {
  return { bg: o.bg, build(root, ctx) {
    const d = ctx.dur, TF = d * .47;
    const head = bigText(root, o.head, { x: 80, y: 214, w: 880, size: 100, accent: o.accent, t0: .05, step: .07 });
    const w = svg(wrist({}), {}, root, '0 0 1080 700', 1080, 700);
    const chips = o.cols.slice(0, o.nchips).map((c, i) => el('div', { left: (o.flip ? 96 + i * 78 : 912 - i * 78) + 'px', top: '470px', width: '64px', height: '64px', borderRadius: '50%', background: c, border: `5px solid ${S}` }, root));
    const card = flipCard(root, o.card, { y: 1150, r: o.flip ? 2 : -2 });
    return (t) => {
      head.update(t);
      const k = pr(t, .5, 1.5, ease.inOutSine), pulse = (Math.sin(t * 3.2) + 1) / 2;
      w.querySelector('svg').innerHTML = wrist({ cols: o.cols.map(c => mix(ADER.neutral, c, k)), pulse: pulse * k });
      const z = tw(t, 0, d, 1, 1.05, ease.lin);
      put(w, 540 + noise(t, 2) * 4, 770 + noise(t, 6) * 4, o.flip ? -z : z, z, (o.flip ? 3 : -3) + noise(t, 1) * .6);
      chips.forEach((c, i) => { const a = pr(t, .7 + i * .2, 1.05 + i * .2, ease.outBack); c.style.transform = `scale(${a})`; c.style.opacity = a > 0 ? 1 : 0; });
      card(t, TF);
    };
  }};
}
SCENES.s3 = veinScene({ bg: C.weiss, head: 'Wirken sie *bläulich* oder *violett?*', accent: ADER.blau, cols: [ADER.blau, ADER.violett, ADER.blau, ADER.violett], nchips: 2,
  card: `Bläulich: eher&nbsp;<span style="color:${ADER.blau}">kühl</span>` });
SCENES.s5 = veinScene({ bg: C.weiss, flip: true, head: 'Wirken sie eher *grünlich?*', accent: ADER.gruen, cols: [ADER.gruen, '#6BA85A', ADER.gruen, '#6BA85A'], nchips: 1,
  card: `Grünlich: eher&nbsp;<span style="color:${ADER.gruen}">warm</span>` });

// ============ s4 / s6 – die passenden Rottöne ============
function redScene(o) {
  return { bg: o.bg, build(root, ctx) {
    const d = ctx.dur, T = [d * o.t1, d * o.t2];
    const head = bigText(root, o.head, { x: 80, y: 214, w: 900, size: 106, accent: o.reds[0][1], t0: .05, step: .09 });
    const cols = o.reds.map(([name, color], i) => {
      const x = 300 + i * 440;
      const sm = svg(`<path d="${SMEAR}" fill="${color}"/>`, {}, root, '0 0 340 110', 400, 130);
      const st = svg(stick(color, 0), {}, root, '0 0 200 520', 200, 520);
      const nm = el('div', { left: (x - 220) + 'px', top: '1096px', width: '440px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '62px', color: S, letterSpacing: '-.5px' }, root, '');
      return { x, sm, st, nm, name, color };
    });
    const src = o.source ? sourceCard(root, { name: o.source, x: 64, y: 1236, size: 31, t0: 1.1 }) : null;
    return (t) => {
      head.update(t);
      cols.forEach((c, i) => {
        const inn = pr(t, .15 + i * .3, .75 + i * .3, ease.outBack), up = pr(t, .6 + i * .35, 1.3 + i * .35, ease.inOutSine);
        c.st.querySelector('svg').innerHTML = stick(c.color, up);
        const hop = Math.sin(clamp((t - T[i]) / .45) * Math.PI) * 26;
        const rot = (i ? 7 : -7) * o.tilt + Math.sin(t * 1.5 + i * 2) * 1.6 + (1 - up) * (i ? -14 : 14);
        put(c.st, c.x, 712 + (1 - inn) * 900 - hop, 1.2, 1.2, rot);
        const sp = pr(t, T[i], T[i] + .45, ease.outCubic);
        put(c.sm, c.x, 1036, 1, 1, i ? 3 : -4, sp > 0 ? 1 : 0); c.sm.style.clipPath = `inset(0 ${100 - sp * 100}% 0 0)`;
        const n = Math.round(pr(t, T[i] + .15, T[i] + .7, ease.lin) * c.name.length);
        c.nm.textContent = c.name.slice(0, n);
      });
      if (src) src.update(t);
    };
  }};
}
SCENES.s4 = redScene({ bg: C.rosaHell, head: 'Rot mit *Blaustich*', reds: [['Himbeerrot', ROT.himbeer], ['Karminrot', ROT.karmin]], t1: .42, t2: .72, tilt: 1,
  source: 'Faustregel aus Ratgebern von Rossmann und dm' });
SCENES.s6 = redScene({ bg: C.rosaHell, head: 'Rot mit *Orangestich*', reds: [['Tomatenrot', ROT.tomate], ['Korallenrot', ROT.koralle]], t1: .5, t2: .74, tilt: -1 });

// ============ s7 – beides testen ============
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const d = ctx.dur, T = d * .36;
  const h1 = bigText(root, 'Beides?', { x: 80, y: 214, w: 880, size: 112, t0: 0, step: .05 }); h1.update(99);
  const h2 = bigText(root, '*Beides* testen.', { x: 80, y: 330, w: 880, size: 112, t0: T, step: .12 });
  const w = svg(wrist({}), {}, root, '0 0 1080 700', 1080, 700);
  const q = qMark(root, { x: 860, y: 520, size: 130, t0: .25 });
  const reds = [ROT.himbeer, ROT.karmin, ROT.tomate, ROT.koralle];
  const sticks = reds.map(c => svg(stick(c, 1), {}, root, '0 0 200 520', 200, 520));
  return (t) => {
    h2.update(t);
    const sh = (Math.sin(t * 2.4) + 1) / 2;
    w.querySelector('svg').innerHTML = wrist({ cols: [mix(ADER.blau, ADER.gruen, sh), mix(ADER.gruen, ADER.blau, sh), ADER.gruen, ADER.violett], pulse: sh });
    put(w, 540 + noise(t, 2) * 4, 742 + noise(t, 5) * 4, .9, .9, -2);
    q.update(t);
    sticks.forEach((s, i) => {
      const left = i < 2, k = pr(t, T + .1 + (left ? 1 - i : i - 2) * .14, T + .75 + (left ? 1 - i : i - 2) * .14, ease.outBack);
      const x = 225 + i * 210 + (1 - k) * (left ? -700 : 700);
      put(s, x, 1140 + Math.sin(t * 2 + i) * 5, .72, .72, (i - 1.5) * 3 + Math.sin(t * 1.6 + i * 1.3) * 2);
    });
  };
}};

// ============ s8 – am Ende entscheidet dein Spiegel ============
SCENES.s8 = { bg: C.nacht, build(root, ctx) {
  const d = ctx.dur, T = d * .62;
  const n1 = el('div', { left: '90px', top: '236px', width: '900px', fontFamily: F.hand, fontWeight: 700, fontSize: '112px', lineHeight: .95, color: C.rosa, transform: 'rotate(-3deg)', whiteSpace: 'pre' }, root, 'Ehrlich gesagt:\nnur eine Faustregel.');
  const head = bigText(root, 'Am Ende entscheidet dein *Spiegel.*', { x: 80, y: 214, w: 900, size: 104, color: C.weiss, accent: C.rosa, t0: T, step: .09 });
  const m = svg(mirror(ROT.himbeer, ROT.himbeer, 0), {}, root, '0 0 500 800', 500, 800);
  const reds = [ROT.himbeer, ROT.karmin, ROT.tomate, ROT.koralle];
  const dots = reds.map((c, i) => el('div', { left: (770 + (i % 2) * 96) + 'px', top: (760 + Math.floor(i / 2) * 96) + 'px', width: '70px', height: '70px', borderRadius: '50%', background: c, border: `5px solid ${C.weiss}` }, root));
  const stars = svg([[120, 620, 1], [960, 600, .8], [150, 1180, .7], [930, 1240, 1]].map(([x, y, s]) => ART.star(x, y, s * 1.6, C.rosa)).join(''), { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  return (t) => {
    const a = pr(t, .1, .6), out = pr(t, T - .35, T - .05);
    n1.style.opacity = a * (1 - out); n1.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`;
    head.update(t);
    const step = .95, idx = Math.floor(t / step) % 4, nxt = (idx + 1) % 4, k = pr(t % step, step - .3, step, ease.inOutSine);
    m.querySelector('svg').innerHTML = mirror(reds[idx], reds[nxt], k);
    const sw = pr(t, 0, .9, ease.outBack);
    put(m, 480, 960 + (1 - sw) * 80, .98, .98, tw(t, 0, 1.0, -30, -7, ease.outBack) + Math.sin(t * 1.3) * 2.5);
    dots.forEach((dd, i) => { const on = i === idx ? 1 - k : i === nxt ? k : 0, p = pr(t, .5 + i * .12, .85 + i * .12, ease.outBack); dd.style.transform = `scale(${p * (.8 + on * .45)})`; dd.style.opacity = p > 0 ? 1 : 0; });
    stars.style.opacity = .5 + Math.sin(t * 2.2) * .3;
  };
}};

// ============ s9 – Schick das … / Frage ============
const squiggle = (c1, c2) => `<svg viewBox="0 0 80 60" width="80" height="60" style="overflow:visible;flex:0 0 80px"><path d="M6 44 C22 30 34 46 48 28 C56 18 66 16 74 12" fill="none" stroke="${c1}" stroke-width="9" stroke-linecap="round"/>${c2 ? `<path d="M40 38 C52 44 62 42 74 36" fill="none" stroke="${c2}" stroke-width="8" stroke-linecap="round"/>` : ''}</svg>`;
SCENES.s9 = { bg: C.rosa, build(root, ctx) {
  const d = ctx.dur, T = d * .63;
  const bub = el('div', { left: '80px', top: '236px', width: '820px', padding: '40px 54px 56px', background: C.weiss, border: `6px solid ${S}`, borderRadius: '56px', fontFamily: F.display, fontSize: '112px', lineHeight: 1.02, letterSpacing: '-1px', color: S, transformOrigin: '20% 100%' }, root, '„Rot steht<br>mir nicht.“');
  svg(`<path d="M10 0 L24 92 L112 0" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="6" y="-8" width="112" height="12" fill="${C.weiss}"/>`, { left: '120px', bottom: '-92px' }, bub, '0 0 120 100', 120, 100);
  const n = el('div', { left: '330px', top: '650px', fontFamily: F.hand, fontWeight: 700, fontSize: '88px', color: S, transform: 'rotate(-4deg)', whiteSpace: 'pre' }, root, 'sagt sie. Seit Jahren.');
  const ls = svg(stick(ROT.karmin, 1), {}, root, '0 0 200 520', 200, 520);
  const sheet = sendTo(root, { contacts: ['Lena', 'Jule', 'Schwester', 'Mama'], pick: 0, t0: .5, top: 1040 });
  const ask = bigText(root, 'Blau, grün oder *beides?*', { x: 80, y: 214, w: 880, size: 132, t0: T + .1, step: .13 });
  const tags = [['blau', ADER.blau, null, 70, 590, -4], ['grün', ADER.gruen, null, 372, 640, 3], ['beides', ADER.blau, ADER.gruen, 640, 596, -2]].map(([txt, c1, c2, x, y, r]) => {
    const e = el('div', { left: x + 'px', top: y + 'px', display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 34px 22px 26px', background: C.weiss, border: `5px solid ${S}`, borderRadius: '70px', boxShadow: `8px 8px 0 ${S}`, fontFamily: F.sans, fontWeight: 800, fontSize: '58px', color: S, whiteSpace: 'nowrap' }, root, squiggle(c1, c2) + `<span>${txt}</span>`);
    return { e, r };
  });
  return (t) => {
    const k = pr(t, 0, .45, ease.outBack), out = pr(t, T - .3, T);
    bub.style.opacity = clamp(.4 + t / .1) * (1 - out);
    bub.style.transform = `scale(${(.85 + .15 * k) * (1 - out * .2)}) rotate(${-2 + Math.sin(t * 1.4) * .8}deg) translateY(${-out * 60}px)`;
    const np = pr(t, 1.9, 2.4);
    n.style.opacity = np * (1 - out); n.style.clipPath = `inset(0 ${100 - np * 100}% 0 0)`;
    put(ls, 190 - out * 500, 760 + Math.sin(t * 1.6) * 6, .5, .5, 78 + Math.sin(t * 1.2) * 4, clamp((t - .3) / .2) * (1 - out));
    sheet.update(t);
    ask.update(t);
    tags.forEach((g, i) => { const a = pr(t, T + .7 + i * .28, T + 1.05 + i * .28, ease.outBack); g.e.style.opacity = a > 0 ? 1 : 0; g.e.style.transform = `scale(${a}) rotate(${g.r + Math.sin(t * 2 + i * 2) * 2}deg) translateY(${Math.sin(t * 2.4 + i) * 5}px)`; });
  };
}};

// ============ Cover ============
SCENES.cover = { build(root) {
  coverLayout(root, {
    lines: ['Trägst du das', '*falsche* Rot?'], teaser: '…dein Handgelenk verrät es',
    art: `<g transform="translate(0 200) rotate(-3 540 350)">${wrist({ cols: [ADER.blau, ADER.gruen, ADER.violett, ADER.gruen] })}</g>
      <g transform="translate(730 250) rotate(9 100 260) scale(1.05)">${stick(ROT.karmin, 1)}</g>`,
    artBox: '0 0 1080 1080', artSize: 1080, artY: 1000, marks: [{ x: 250, y: 790, size: 130, r: -8 }],
  });
}};
