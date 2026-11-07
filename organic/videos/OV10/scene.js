/* OV10 – Sechs Lippenbalsame  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;
const MOND = '#F7E7C6', S = C.schwarz;

// ---------- eigene Illustrationen ----------
/** Lippenpflegestift stehend, viewBox 0 0 80 170. body = Farbe der Hülse */
function balm(body = C.rosaTief, cap = C.weiss) {
  return `<rect x="16" y="64" width="48" height="98" rx="12" fill="${body}" stroke="${S}" stroke-width="5"/>
    <rect x="16" y="100" width="48" height="16" fill="${C.weiss}" opacity=".55"/>
    <rect x="12" y="8" width="56" height="62" rx="16" fill="${cap}" stroke="${S}" stroke-width="5"/>
    <rect x="22" y="18" width="10" height="38" rx="5" fill="${C.weiss}" opacity=".5"/>`;
}
const BALMS = [[C.rosaTief, C.weiss], [C.weiss, C.rosaTief], [C.beere, C.weiss], [C.lippeHell, S], [C.rosaHell, C.beere], [S, C.rosaTief]];

/** Handtasche, viewBox 0 0 500 460 (Boden bei y 440). open 0..1 = Klappe auf. part: 'all' | 'back' | 'front' */
function bag(open = 0, part = 'all') {
  const fy = lerp(0, -70, open);
  const handle = `<path d="M150 170 C150 40 350 40 350 170" fill="none" stroke="${S}" stroke-width="22" stroke-linecap="round"/>
    <path d="M150 170 C150 40 350 40 350 170" fill="none" stroke="${C.rosaHell}" stroke-width="8" stroke-linecap="round"/>`;
  const body = `<path d="M70 170 L430 170 L470 410 Q472 440 440 440 L60 440 Q28 440 30 410Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M90 380 L410 380" stroke="${S}" stroke-opacity=".2" stroke-width="5" stroke-dasharray="14 12"/>`;
  const flap = `<g transform="translate(0 ${fy}) rotate(${-open * 8} 70 170)">
      <path d="M62 166 L438 166 L420 270 Q250 312 80 270Z" fill="${C.rosa}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="226" y="262" width="48" height="34" rx="9" fill="${C.beere}" stroke="${S}" stroke-width="6"/>
    </g>`;
  const flapBack = open > .5;
  if (part === 'back') return handle + (flapBack ? flap : '');
  if (part === 'front') return body + (flapBack ? '' : flap);
  return handle + body + flap;
}
/** Kaffeetasse, viewBox 0 0 200 200 */
const cup = () => `<path d="M40 80 L150 80 L140 170 Q138 182 126 182 L64 182 Q52 182 50 170Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M148 100 C182 100 182 150 142 150" fill="none" stroke="${S}" stroke-width="7"/>
  <path d="M75 60 C65 45 85 35 75 18 M108 60 C98 45 118 35 108 18" fill="none" stroke="${C.rosaTief}" stroke-width="7" stroke-linecap="round"/>`;
/** Sonnenaufgang, viewBox 0 0 200 200 */
const sunrise = () => `<path d="M30 150 A70 70 0 0 1 170 150Z" fill="${C.rosaTief}"/>
  ${[-60, -30, 0, 30, 60].map(a => `<line x1="100" y1="62" x2="100" y2="38" transform="rotate(${a} 100 150)" stroke="${C.rosaTief}" stroke-width="9" stroke-linecap="round"/>`).join('')}
  <line x1="14" y1="152" x2="186" y2="152" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`;
/** Teller mit Besteck, viewBox 0 0 200 200 */
const plate = () => `<line x1="28" y1="50" x2="28" y2="160" stroke="${S}" stroke-width="7" stroke-linecap="round"/>
  <path d="M18 50 L18 84 Q28 96 38 84 L38 50" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="108" cy="110" r="62" fill="${C.weiss}" stroke="${S}" stroke-width="7"/><circle cx="108" cy="110" r="40" fill="none" stroke="${C.rosaTief}" stroke-width="6"/>
  <path d="M184 50 C198 80 196 110 184 116 L184 160" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`;
const sun = (c = C.rosaTief) => `<circle cx="100" cy="100" r="40" fill="${c}"/>${Array.from({ length: 8 }, (_, i) => `<line x1="100" y1="36" x2="100" y2="16" transform="rotate(${i * 45} 100 100)" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`).join('')}`;
const moonSmall = (c = MOND, bg = C.nacht) => `<circle cx="100" cy="100" r="54" fill="${c}"/><circle cx="128" cy="80" r="48" fill="${bg}"/>`;

/** runde Hautfläche mit geschlossenen Lippen */
function cameo(root, cx, cy, d) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden' }, root);
  svg(`<path d="M186 0 C190 40 186 62 172 74 C190 82 210 82 228 74 C214 62 210 40 214 0" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
       <path d="M150 352 C180 368 220 368 250 352" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`, { left: 0, top: 0 }, c, '0 0 400 400', d, d);
  svg(ART.lips(.55), { left: (d * .07) + 'px', top: (d * .07) + 'px' }, c, '0 0 400 400', d * .86, d * .86);
  return c;
}
const pill = (root, text, o = {}) => el('div', { left: 0, top: 0, padding: '16px 30px 20px', background: o.bg ?? C.weiss, color: o.color ?? S, borderRadius: '50px', fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 46) + 'px', whiteSpace: 'nowrap', border: `5px solid ${S}`, letterSpacing: '-.5px' }, root, text);

// ---------- s1: Hook – Handtasche kippt, sechs Stifte ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Ich hatte *sechs* Lippenbalsame in der Handtasche.', { y: 200, size: 108 });
  hook.update(99);
  const age = note(root, '(ich, 51)', { x: 640, y: 545, r: -5, t0: .1, size: 72, color: C.beere });
  const bg = svg(bag(0), { transformOrigin: '94% 96%' }, root, '0 0 500 460', 430, 396);
  // Endlagen der Stifte: x, y, Drehung
  const END = [[560, 1180, 84], [660, 1225, -96], [760, 1170, 100], [850, 1235, 76], [610, 1090, -60], [800, 1075, 120]];
  const bs = BALMS.map(([b, c]) => svg(balm(b, c), {}, root, '0 0 80 170', 74, 158));
  const cnt = el('div', { left: 0, top: 0, width: '220px', height: '220px', borderRadius: '50%', background: C.weiss, border: `7px solid ${S}`, boxSizing: 'border-box', textAlign: 'center', fontFamily: F.display, fontSize: '150px', lineHeight: '205px', color: C.beere }, root, '0');
  const tip = .35, tEnd = D * .72;
  return (t) => {
    age.update(t);
    const k = pr(t, tip, tip + .55, ease.outBack);
    place(bg, 330, 1060, 1, k * 24);
    let landed = 0;
    bs.forEach((b, i) => {
      const t0 = tip + .35 + i * (tEnd - tip - .8) / 6, t1 = t0 + .55;
      const q = pr(t, t0, t1, ease.lin);
      const x = lerp(470, END[i][0], ease.outCubic(q));
      const y = lerp(1000, END[i][1], q) - Math.sin(Math.PI * q) * 120;
      place(b, x, y, .6 + .4 * q, lerp(40, END[i][2], q), clamp((t - t0) / .08));
      if (t >= t1) landed++;
    });
    cnt.textContent = String(landed);
    const pop = landed === 6 ? 1 + .22 * Math.sin(Math.PI * pr(t, tEnd, tEnd + .5, ease.lin)) : 1 + (landed ? .06 : 0);
    place(cnt, 830, 800, pop, -6 + noise(t, 3) * 2, pr(t, tip, tip + .3));
  };
}};

// ---------- s2: Drauf. Drauf. Drauf. ----------
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const words = ['Drauf.', 'Drauf.', 'Drauf.'].map((w, i) => el('div', { left: (210 + i * 330 - 160) + 'px', width: '320px', textAlign: 'center', top: '230px', fontFamily: F.display, fontSize: '104px', color: i === 2 ? C.beere : S, letterSpacing: '-1px' }, root, w));
  const ic = [sunrise(), cup(), plate()].map(m => svg(m, {}, root, '0 0 200 200', 190, 190));
  const lbl = ['morgens', 'nach dem\nKaffee', 'nach dem\nMittag'].map((s, i) => el('div', { left: (210 + i * 330 - 150) + 'px', top: '625px', width: '300px', textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: '40px', lineHeight: 1.05, color: S, whiteSpace: 'pre' }, root, s));
  const lips = svg(ART.lips(.55), {}, root, '0 0 400 400', 560, 560);
  const st = svg(balm(C.rosaTief, C.weiss), {}, root, '0 0 80 170', 96, 204);
  const shine = svg('', {}, root, '0 0 200 100', 260, 130);
  const ev = note(root, 'abends: trotzdem trocken.', { x: 110, y: 1205, r: -3, t0: D * .62, size: 84, color: C.beere });
  const TAPS = [D * .1, D * .29, D * .47];
  return (t) => {
    words.forEach((w, i) => { const k = pr(t, TAPS[i], TAPS[i] + .4, ease.outBack); w.style.opacity = clamp((t - TAPS[i] + .05) / .12); w.style.transform = `translateY(${(1 - k) * 50}px) rotate(${(i - 1) * 3}deg)`; });
    ic.forEach((n, i) => { const on = t >= TAPS[i] - .1 ? 1 : .25; place(n, 210 + i * 330, 500, i === TAPS.findIndex((a, j) => t >= a - .1 && (j === 2 || t < TAPS[j + 1] - .1)) ? 1.08 : .92, 0, on); lbl[i].style.opacity = on; });
    place(lips, 520, 1060);
    // Stift tippt bei jedem "drauf" auf die Lippe
    let dip = 0;
    TAPS.forEach(a => { dip = Math.max(dip, Math.sin(Math.PI * pr(t, a - .15, a + .35, ease.lin))); });
    const leave = pr(t, D * .55, D * .7);
    place(st, 640 + (1 - dip) * 30 + leave * 200, 934 - (1 - dip) * 70 - leave * 80, 1, 35 - dip * 5, 1 - leave);
    // Glanz verblasst gegen Abend
    const g = (1 - pr(t, D * .58, D * .8, ease.lin)) * (t > TAPS[0] ? 1 : 0);
    shine.querySelector('svg').innerHTML = `<path d="M40 40 L60 20 M90 30 L96 6 M140 40 L162 22" stroke="${C.rosaTief}" stroke-width="9" stroke-linecap="round" opacity="${g}"/>`;
    place(shine, 520, 920);
    ev.update(t);
  };
}};

// ---------- s3: Forum-Zitat ----------
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Einer Frau ging es *genauso.*', { y: 210, size: 104, t0: 0, step: .06 });
  const q = quoteCard(root, 'But they’re expensive and don’t last long', 'eine Frau in einem Forum (Original)', { y: 600, size: 74, t0: .25 });
  const bs = [0, 2, 3].map(i => svg(balm(...BALMS[i]), {}, root, '0 0 80 170', 96, 204));
  return (t) => {
    head.update(t); q.update(t);
    [[260, 1190, -72], [500, 1225, 96], [740, 1180, -104]].forEach(([x, y, r], i) => place(bs[i], x + noise(t, i) * 3, y, 1, r + noise(t, i + 4) * 3, pr(t, .6 + i * .15, .9 + i * .15)));
  };
}};

// ---------- s4: 24-Stunden-Scheibe ----------
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const first = bigText(root, 'Tagsüber: *ständig* nach.', { y: 210, size: 108, t0: 0, step: .06 });
  const head = bigText(root, 'Nachts: *gar* *nichts* drauf.', { y: 210, size: 108, t0: D * .55, step: .06 });
  const CX = 540, CY = 905, R = 330;
  const dial = svg(`<path d="M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}Z" fill="${C.weiss}"/>
     <path d="M${CX - R} ${CY} A${R} ${R} 0 0 0 ${CX + R} ${CY}Z" fill="${C.nacht}"/>
     <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${S}" stroke-width="10"/>
     <line x1="${CX - R}" y1="${CY}" x2="${CX + R}" y2="${CY}" stroke="${S}" stroke-width="6"/>
     <path d="M${CX - R + 70} ${CY} A${R - 70} ${R - 70} 0 0 0 ${CX + R - 70} ${CY}" fill="none" stroke="${C.weiss}" stroke-opacity=".3" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 24"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const sn = svg(sun(), {}, root, '0 0 200 200', 110, 110);
  const mn = svg(moonSmall(), {}, root, '0 0 200 200', 110, 110);
  const dayL = el('div', { left: (CX - 200) + 'px', top: (CY - 120) + 'px', width: '400px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '44px', color: S }, root, 'tagsüber');
  const nightL = el('div', { left: (CX - 200) + 'px', top: (CY + 40) + 'px', width: '400px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '44px', color: C.weiss }, root, 'nachts');
  const nix = el('div', { left: (CX - 200) + 'px', top: (CY + 120) + 'px', width: '400px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '96px', color: C.rosa, transform: 'rotate(-4deg)' }, root, 'nichts.');
  const ANG = [-160, -128, -96, -64, -32]; // Grad, 0 = rechts, negativ = oben
  const bs = ANG.map((a, i) => svg(balm(...BALMS[i]), {}, root, '0 0 80 170', 52, 112));
  const hand = svg(`<line x1="0" y1="20" x2="270" y2="20" stroke="${C.beere}" stroke-width="12" stroke-linecap="round"/><circle cx="0" cy="20" r="22" fill="${C.beere}" stroke="${S}" stroke-width="6"/>`, { transformOrigin: '0px 20px' }, root, '0 0 300 40', 300, 40);
  const a0 = .3, a1 = D * .85;
  return (t) => {
    const ft = 1 - pr(t, D * .5, D * .55, ease.lin);
    first.update(t); first.node.style.opacity = ft; head.update(t);
    place(sn, CX - 250, CY - 250 + 30, 1, t * 20); place(mn, CX + 250, CY + 220, 1, -8);
    // Zeiger: startet links (morgens), läuft oben herum über den Tag, unten durch die Nacht
    const ang = lerp(-180, 180, pr(t, a0, a1, ease.inOutSine));
    hand.style.left = CX + 'px'; hand.style.top = (CY - 20) + 'px'; hand.style.transform = `rotate(${ang}deg)`;
    bs.forEach((b, i) => {
      const a = ANG[i] + 12, on = ang >= a ? 1 : 0;
      const tHit = a0 + (a1 - a0) * Math.acos(1 - 2 * ((a + 180) / 360)) / Math.PI; // grob für ease
      const k = on ? pr(t, tHit, tHit + .35, ease.outBack) : 0;
      const rr = R - 70, rad = ANG[i] * Math.PI / 180;
      place(b, CX + Math.cos(rad) * rr, CY + Math.sin(rad) * rr, Math.max(.001, k), ANG[i] + 90, on);
    });
    dayL.style.opacity = pr(t, .2, .5);
    nightL.style.opacity = pr(t, D * .45, D * .55);
    const nk = pr(t, D * .62, D * .62 + .45);
    nix.style.opacity = nk; nix.style.clipPath = `inset(0 ${100 - nk * 100}% 0 0)`;
  };
}};

// ---------- s5: Tape mit Pflege-Mitte ----------
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const first = bigText(root, 'Abends: ein *Tape* drauf.', { y: 210, size: 108, color: C.weiss, accent: C.rosa, t0: 0, step: .06 });
  const head = bigText(root, '*Pflege-Mitte* für die Nacht.', { y: 210, size: 108, color: C.weiss, accent: C.rosa, t0: D * .42, step: .06 });
  const CX = 540, CY = 930;
  const cam = cameo(root, CX, CY, 500);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 470, 470);
  const lines = svg('', {}, root, '0 0 1080 1920', 1080, 1920);
  const LB = [['Kollagen', 280, 640], ['Hyaluronsäure', 760, 640], ['Glycerin', 280, 1235], ['Vitamin E', 780, 1235]];
  const pills = LB.map(([s]) => pill(root, s));
  const hole = note(root, 'kleines Loch', { x: 690, y: 1090, r: 4, t0: D * .3, size: 56, color: MOND });
  const tl = D * .5;
  return (t) => {
    first.update(t); first.node.style.opacity = 1 - pr(t, D * .38, D * .42, ease.lin); head.update(t);
    const down = pr(t, .25, D * .3, ease.outCubic);
    place(tape, CX, lerp(560, CY + 38, down), lerp(1.12, 1, down), lerp(-14, 0, down), pr(t, 0, .25));
    cam.style.transform = `translateY(${noise(t, 3) * 3}px)`;
    let ls = '';
    pills.forEach((p, i) => {
      const t0 = tl + i * .5, k = pr(t, t0, t0 + .45, ease.outBack);
      const [, x, y] = LB[i];
      place(p, x + Math.sin(t * 1.4 + i) * 6, y + Math.cos(t * 1.2 + i) * 5, Math.max(.001, k), (i % 2 ? 3 : -3), clamp((t - t0) / .1));
      const lk = pr(t, t0 + .1, t0 + .5);
      const ex = lerp(x, CX + (x < CX ? -60 : 60), lk), ey = lerp(y + (y < CY ? 40 : -40), CY + 38 + (y < CY ? -20 : 20), lk);
      if (t > t0) ls += `<line x1="${x}" y1="${y + (y < CY ? 40 : -40)}" x2="${ex}" y2="${ey}" stroke="${C.rosa}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/>`;
    });
    lines.querySelector('svg').innerHTML = ls;
    hole.update(t);
    hole.node.style.opacity = Math.min(+hole.node.style.opacity, 1 - pr(t, tl - .2, tl));
  };
}};

// ---------- s6: Mond zieht, Tape bleibt ----------
SCENES.s6 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Die ganze Nacht *da,* wo sie hin soll.', { y: 210, size: 104, color: C.weiss, accent: C.rosa, t0: 0, step: .05 });
  const stars = svg('', {}, root, '0 0 1080 1920', 1080, 1920);
  const path = svg(`<path d="M120 900 Q540 380 960 900" fill="none" stroke="${MOND}" stroke-opacity=".35" stroke-width="5" stroke-dasharray="4 20" stroke-linecap="round"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const mn = svg(moonSmall(MOND, C.nacht), {}, root, '0 0 200 200', 170, 170);
  const cam = cameo(root, 540, 1060, 440);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 414, 414);
  const glow = svg('', {}, root, '0 0 600 200', 600, 200);
  return (t) => {
    head.update(t);
    stars.querySelector('svg').innerHTML = [[110, 640, 1.2], [260, 760, .8], [860, 610, 1], [980, 760, .7], [70, 980, .7], [700, 700, .6], [420, 640, .7], [1000, 1040, .8]]
      .map(([x, y, s], i) => ART.star(x, y, s * 1.5 * (.75 + .25 * Math.sin(t * 2.6 + i * 1.7)), MOND)).join('');
    const k = pr(t, 0, D, ease.inOutSine);
    // quadratische Bezier wie der gestrichelte Pfad
    const x = lerp(lerp(120, 540, k), lerp(540, 960, k), k), y = lerp(lerp(900, 380, k), lerp(380, 900, k), k);
    place(mn, x, y, 1, lerp(-30, 20, k), pr(t, 0, .3));
    place(tape, 540, 1060 + 33, 1, 0);
    const pulse = .5 + .5 * Math.sin(t * 2.4);
    glow.querySelector('svg').innerHTML = [[30, 60], [10, 130], [570, 50], [590, 140]].map(([gx, gy], i) => ART.star(gx, gy, 1.3 + .6 * Math.sin(t * 2.4 + i * 2), C.rosa)).join('');
    place(glow, 540, 1093, 1, 0, .5 + .5 * pulse);
    cam.style.transform = 'none';
  };
}};

// ---------- s7: Einer reicht ----------
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const n1 = note(root, 'meine Handtasche heute:', { x: 96, y: 200, r: -3, t0: 0, size: 76, color: S });
  const head0 = bigText(root, 'Jetzt: noch *einer.*', { y: 300, size: 140, t0: .3, step: .08 });
  const head = bigText(root, 'Einer *reicht* mir.', { y: 300, size: 140, t0: D * .56, step: .08 });
  const bgB = svg(bag(0, 'back'), {}, root, '0 0 500 460', 470, 432);
  const bg = svg(bag(0, 'front'), {}, root, '0 0 500 460', 470, 432);
  const ONE = 2; // der Beeren-Stift bleibt
  const bs = BALMS.map(([b, c]) => svg(balm(b, c), {}, root, '0 0 80 170', 74, 158));
  const XS = [240, 360, 480, 600, 720, 840];
  return (t) => {
    n1.update(t); head.update(t); head0.update(t); head0.node.style.opacity = 1 - pr(t, D * .5, D * .55, ease.lin);
    const open = pr(t, D * .55, D * .7, ease.outBack);
    bg.querySelector('svg').innerHTML = bag(open, 'front');
    bgB.querySelector('svg').innerHTML = bag(open, 'back');
    place(bg, 540, 960, 1, noise(t, 1) * 1.2); place(bgB, 540, 960, 1, noise(t, 1) * 1.2);
    bs.forEach((b, i) => {
      if (i === ONE) {
        // hüpft in die Tasche und schaut oben heraus
        const j = pr(t, D * .62, D * 1, ease.inOutCubic);
        const x = lerp(XS[i], 560, j), y = lerp(1240, 880, j) - Math.sin(Math.PI * j) * 240;
        place(b, x, y, 1, lerp(0, 12, j), 1);
        b.style.zIndex = j > .75 ? '1' : '3';
        return;
      }
      const order = [5, 4, 3, 1, 0].indexOf(i);
      const t0 = .3 + order * .32;
      const tip = pr(t, t0, t0 + .3, ease.inCubic);
      const roll = pr(t, t0 + .25, t0 + 1.4, ease.inCubic);
      place(b, XS[i] + roll * (1200 - XS[i] + 200), 1240 + tip * 40, 1, tip * 90 + roll * 540, 1);
      b.style.zIndex = '3';
    });
    bgB.style.zIndex = '0'; bg.style.zIndex = '2';
  };
}};
