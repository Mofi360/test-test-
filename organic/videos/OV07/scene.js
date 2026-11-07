/* OV07 – Mein Nachttisch mit 52  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, clamp, lerp } = DT;
// Notiz mit etwas Luft rechts, damit die Handschrift beim Aufdecken nicht abgeschnitten wird
const note = (root, text, o) => { const n = DT.note(root, text, o); n.node.style.paddingRight = '28px'; return n; };
const S = C.schwarz, WARM = '#FFF1D6', MOND = '#F7E7C6';

// ---------- eigene Illustrationen ----------
/** Nachttisch von vorn, viewBox 0 0 800 480, Ablagefläche bei y 40 */
const stand = () => `
  <rect x="120" y="436" width="36" height="44" rx="6" fill="${S}"/><rect x="644" y="436" width="36" height="44" rx="6" fill="${S}"/>
  <rect x="90" y="80" width="620" height="362" rx="10" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
  <rect x="130" y="118" width="540" height="140" rx="8" fill="none" stroke="${S}" stroke-width="5"/>
  <rect x="368" y="178" width="64" height="20" rx="10" fill="${S}"/>
  <rect x="130" y="290" width="540" height="116" rx="8" fill="none" stroke="${S}" stroke-width="5" opacity=".22"/>
  <rect x="60" y="40" width="680" height="46" rx="8" fill="${C.rosaHell}" stroke="${S}" stroke-width="7"/>`;
const TOP = 857; // Bildschirm-y der Ablagefläche (stand bei 540,1070 mit 860x516)
const Z = 1.15; // Objekt-Maßstab

/** Krimi, flach liegend, viewBox 0 0 300 120, Unterkante y 100 */
const book = `
  <rect x="10" y="84" width="280" height="16" rx="4" fill="${S}"/>
  <rect x="20" y="44" width="262" height="42" fill="${C.weiss}" stroke="${S}" stroke-width="5"/>
  <path d="M30 56 H272 M30 66 H272 M30 76 H272" stroke="${S}" stroke-width="2" opacity=".25"/>
  <rect x="10" y="20" width="280" height="28" rx="4" fill="${S}"/>
  <rect x="40" y="27" width="70" height="14" rx="3" fill="${C.beere}"/>
  <path d="M232 46 L232 116 L242 106 L252 116 L252 46Z" fill="${C.beere}"/>`;
/** Lesebrille, zusammengeklappt, viewBox 0 0 260 120 */
const glasses = `
  <path d="M36 60 L6 46 M224 60 L254 46" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="76" cy="70" r="42" fill="${C.weiss}" fill-opacity=".55" stroke="${S}" stroke-width="9"/>
  <circle cx="184" cy="70" r="42" fill="${C.weiss}" fill-opacity=".55" stroke="${S}" stroke-width="9"/>
  <path d="M117 64 Q130 50 143 64" fill="none" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
  <path d="M56 52 L72 40 M164 52 L180 40" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`;
/** Handcreme-Tube auf dem Deckel stehend, viewBox 0 0 140 300, Unterkante 296 */
const cream = `
  <rect x="38" y="248" width="64" height="48" rx="9" fill="${S}"/>
  <path d="M22 26 L118 26 L104 250 L36 250Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
  <rect x="16" y="8" width="108" height="22" rx="4" fill="${C.rosaHell}" stroke="${S}" stroke-width="6"/>
  <path d="M30 12 V26 M44 12 V26 M58 12 V26 M72 12 V26 M86 12 V26 M100 12 V26 M114 12 V26" stroke="${S}" stroke-width="2" opacity=".3"/>
  <g transform="translate(70 128) rotate(-24)"><path d="M0 -44 C26 -30 30 14 0 44 C-30 14 -26 -30 0 -44Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="5"/>
  <path d="M0 -30 C6 -6 6 14 0 30" fill="none" stroke="${S}" stroke-width="3" opacity=".4"/></g>
  <rect x="38" y="194" width="64" height="9" rx="4" fill="${S}" opacity=".18"/><rect x="46" y="212" width="48" height="9" rx="4" fill="${S}" opacity=".18"/>`;
/** Schlichte rosa Schachtel ohne Aufdruck, viewBox 0 0 240 180, Unterkante 176. part: base | lid | all */
function box(part = 'all') {
  const base = `<rect x="22" y="62" width="196" height="114" rx="10" fill="${C.rosaTief}" stroke="${S}" stroke-width="6"/>
    <rect x="40" y="92" width="16" height="64" rx="8" fill="#fff" opacity=".3"/>`;
  const lid = `<rect x="10" y="38" width="220" height="42" rx="10" fill="${C.rosa}" stroke="${S}" stroke-width="6"/>
    <rect x="26" y="48" width="70" height="10" rx="5" fill="#fff" opacity=".55"/>`;
  return part === 'base' ? base : part === 'lid' ? lid : base + lid;
}
/** offene Schachtel von vorn mit Innenrand, viewBox 0 0 240 180 */
const boxOpen = `<path d="M22 62 L46 40 L194 40 L218 62Z" fill="${S}" opacity=".85"/>
  <rect x="22" y="62" width="196" height="114" rx="10" fill="${C.rosaTief}" stroke="${S}" stroke-width="6"/>
  <rect x="40" y="92" width="16" height="64" rx="8" fill="#fff" opacity=".3"/>`;
/** Lippenbalsam liegend, viewBox 0 0 260 80 */
const balm = `<rect x="12" y="20" width="160" height="40" rx="8" fill="${C.rosaHell}" stroke="${S}" stroke-width="6"/>
  <rect x="32" y="30" width="80" height="8" rx="4" fill="#fff" opacity=".8"/>
  <rect x="168" y="16" width="80" height="48" rx="10" fill="${S}"/><rect x="180" y="24" width="36" height="7" rx="3" fill="#fff" opacity=".3"/>`;
/** Kissen, viewBox 0 0 600 380. spot 0..1 glänzender Pflegefleck */
function pillow(spot = 0) {
  const P = 'M70 80 C170 54 430 54 530 80 C556 150 556 240 530 300 C430 326 170 326 70 300 C44 240 44 150 70 80Z';
  return `<path d="${P}" fill="${S}" opacity=".08" transform="translate(12 20)"/>
    <path d="${P}" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M70 80 L44 60 M530 80 L558 58 M70 300 L42 324 M530 300 L560 322" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
    <path d="M150 130 C220 146 300 146 360 136" fill="none" stroke="${S}" stroke-opacity=".12" stroke-width="5" stroke-linecap="round"/>
    <g opacity="${spot}" transform="translate(360 210) scale(${.5 + .5 * spot}) rotate(-8)">
      <path d="M-96 -6 C-84 -44 -20 -52 12 -38 C44 -58 100 -40 104 -4 C110 34 60 52 10 44 C-30 56 -86 46 -100 22 C-108 10 -104 0 -96 -6Z" fill="${C.lippeHell}"/>
      <path d="M-70 -18 C-50 -34 -16 -38 8 -30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/>
      <circle cx="78" cy="30" r="7" fill="#fff" opacity=".7"/>
    </g>`;
}
/** Krönchen, viewBox 0 0 200 150 */
const crown = `<path d="M22 118 L30 38 L70 78 L100 18 L130 78 L170 38 L178 118Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="18" y="110" width="164" height="24" rx="7" fill="${S}"/>
  <circle cx="30" cy="34" r="9" fill="${C.beere}"/><circle cx="100" cy="14" r="10" fill="${C.beere}"/><circle cx="170" cy="34" r="9" fill="${C.beere}"/>
  <circle cx="100" cy="86" r="8" fill="${C.rosaTief}"/>`;
const spark = (c = S) => `<path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4Z" fill="${c}"/>`;
/** offenes Buch, viewBox 0 0 360 200; k = 0 offen .. 1 zu */
function openBook(k) {
  const a = lerp(0, 1, k), lx = lerp(20, 180, a), rx = lerp(340, 180, a);
  return `<path d="M180 40 Q${lerp(100, 180, a)} 20 ${lx} 34 L${lx} 170 Q${lerp(100, 180, a)} 156 180 176Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M180 40 Q${lerp(260, 180, a)} 20 ${rx} 34 L${rx} 170 Q${lerp(260, 180, a)} 156 180 176Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    ${k < .6 ? `<path d="M${lerp(50, 180, a)} 70 H${lerp(150, 180, a)} M${lerp(50, 180, a)} 92 H${lerp(150, 180, a)} M${lerp(50, 180, a)} 114 H${lerp(130, 180, a)} M${lerp(210, 180, a)} 70 H${lerp(310, 180, a)} M${lerp(210, 180, a)} 92 H${lerp(310, 180, a)} M${lerp(210, 180, a)} 114 H${lerp(290, 180, a)}" stroke="${S}" stroke-width="4" opacity=".25"/>` : ''}
    ${k > .97 ? `<rect x="40" y="40" width="280" height="136" rx="6" fill="${S}"/><rect x="70" y="60" width="90" height="18" rx="4" fill="${C.beere}"/>` : ''}`;
}
/** Hautfarbenes Rund mit Lippen */
function cameo(root, cx, cy, d) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden' }, root);
  svg(`<path d="M186 0 C190 50 186 78 170 92 C190 100 210 100 230 92 C214 78 210 50 214 0" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M150 344 C180 360 220 360 250 344" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`, { left: 0, top: 0 }, c, '0 0 400 400', d, d);
  svg(ART.lips(.55), { left: (d * .07) + 'px', top: (d * .07) + 'px' }, c, '0 0 400 400', d * .86, d * .86);
  return c;
}
/** Etikett-Pille */
function pill(root, text, x, y, bg = S, fg = C.weiss) {
  return el('div', { left: x + 'px', top: y + 'px', padding: '14px 30px 16px', borderRadius: '40px', background: bg, color: fg, fontFamily: F.sans, fontWeight: 700, fontSize: '54px', letterSpacing: '-.5px', whiteSpace: 'nowrap' }, root, text);
}
/** Nachttisch + Ablage aufbauen */
function table(root) {
  const st = svg(stand(), {}, root, '0 0 800 480', 860, 516);
  place(st, 540, 1070);
  return st;
}
const pop = (t, t0) => pr(t, t0, t0 + .45, ease.outBack);

// ---------- s1: Nachttisch, Brille + Krimi ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Mein Nachttisch mit *52.*', { y: 220, size: 110, w: 900 });
  hook.update(10); // statisch ab Frame 0
  const sub = note(root, 'Ein Teil überrascht.', { x: 110, y: 470, r: -3, size: 76 });
  sub.update(10);
  table(root);
  const bk = svg(book, {}, root, '0 0 300 120', 300*Z, 120*Z);
  const gl = svg(glasses, {}, root, '0 0 260 120', 220*Z, 102*Z);
  const n1 = note(root, 'Lesebrille', { x: 560, y: 600, r: 4, size: 70, t0: D * .32, arrow: [-150, 80], ax: -20, ay: 70 });
  const n3 = note(root, 'immer noch Seite 112', { x: 560, y: 760, r: -3, size: 60, t0: D * .62 });
  return (t) => {
    const kb = pop(t, D * .5);
    place(bk, 350, TOP - 40*Z - (1 - kb) * 60, lerp(.6, 1, kb), (1 - kb) * -8, clamp(kb * 3));
    const kg = pop(t, D * .22);
    const lift = pr(t, D * .5, D * .6, ease.inOutSine);
    place(gl, 340, TOP - 51*Z - 80*Z * lift - 40 * Math.sin(Math.PI * lift) - (1 - kg) * 80, lerp(.5, 1, kg), (1 - kg) * 12 - 4, clamp(kg * 3));
    n1.update(t); n3.update(t);
  };
}};

// ---------- s2: Handcreme, dann die rosa Schachtel ----------
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Und die rosa *Schachtel?*', { y: 220, size: 118, t0: D * .5, step: .07 });
  table(root);
  const bk = svg(book, {}, root, '0 0 300 120', 300*Z, 120*Z);
  const gl = svg(glasses, {}, root, '0 0 260 120', 220*Z, 102*Z);
  const cr = svg(cream, {}, root, '0 0 140 300', 140*Z, 300*Z);
  const bx = svg(box(), {}, root, '0 0 240 180', 240*Z, 180*Z);
  const mand = note(root, 'nach Mandel', { x: 100, y: 470, r: -4, size: 80, t0: .35, arrow: [190, 110], ax: 230, ay: 80 });
  return (t) => {
    head.update(t);
    place(bk, 350, TOP - 40*Z); place(gl, 340, TOP - 131*Z, 1, -4);
    const kc = pop(t, .15);
    place(cr, 610, TOP - 146*Z - (1 - kc) * 90, lerp(.5, 1, kc), (1 - kc) * -14, clamp(kc * 3));
    mand.update(t);
    mand.node.style.opacity = Math.min(+mand.node.style.opacity, 1 - pr(t, D * .48, D * .56, ease.lin));
    const ms = mand.node.nextSibling; if (ms && ms.tagName === 'DIV') ms.style.opacity = 1 - pr(t, D * .48, D * .56, ease.lin);
    // Schachtel gleitet von rechts herein und wackelt
    const ks = pr(t, D * .52, D * .68, ease.outCubic), st = D * .68;
    const wob = t > st ? 7 * Math.exp(-(t - st) * 4) * Math.sin((t - st) * 16) : 0;
    place(bx, lerp(1250, 815, ks), TOP - 86*Z, 1, wob - (1 - ks) * 10);
  };
}};

// ---------- s3: 30 Tapes fächern auf ----------
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const l1 = bigText(root, '30 Stück.', { y: 210, size: 130, t0: .05, step: .07 });
  const l2 = bigText(root, '30 *Nächte.*', { y: 345, size: 130, t0: D * .55, step: .08 });
  const N = 30, R = 480, cx = 540, cy = 1200;
  const tapes = Array.from({ length: N }, () => svg(ART.tape(true), {}, root, '0 0 400 400', 215, 215));
  const lid = svg(box('lid'), {}, root, '0 0 240 180', 440, 330);
  const base = svg(boxOpen, {}, root, '0 0 240 180', 440, 330);
  const num = el('div', { left: '0px', top: '0px', width: '240px', textAlign: 'center', fontFamily: F.display, fontSize: '120px', color: C.weiss }, root, '0');
  return (t) => {
    l1.update(t); l2.update(t);
    place(base, cx, cy + 30);
    const lk = pr(t, .1, .55, ease.outCubic);
    place(lid, cx + lk * 260, cy - 27 - lk * 160, 1, lk * 24, 1 - pr(t, .45, .7, ease.lin));
    let shown = 0;
    tapes.forEach((tp, i) => {
      const k = pr(t, .45 + i * .045, .45 + i * .045 + .5, ease.outBack);
      if (k > .5) shown++;
      const a = lerp(-55, 55, i / (N - 1)) * Math.PI / 180;
      const r = R * k + noise(t, i) * 3 * k;
      place(tp, cx + Math.sin(a) * r, cy - 20 - Math.cos(a) * r, lerp(.3, 1, clamp(k)), a * 180 / Math.PI + 90, clamp(k * 4));
    });
    num.textContent = shown;
    place(num, cx, cy + 65, 1, 0, pr(t, .5, .8));
  };
}};

// ---------- s4: Buch zu, Tape über die Lippen ----------
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Buch weg. *Tape* drauf.', { y: 220, size: 112, color: C.weiss, accent: C.rosa, t0: .05, step: .07 });
  const bk = svg('', {}, root, '0 0 360 200', 340, 189);
  const klapp = note(root, 'klapp.', { x: 700, y: 520, r: 6, size: 76, color: C.rosa, t0: .7 });
  const cam = cameo(root, 540, 1040, 560);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 470, 470);
  const lines = svg('', { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const p1 = pill(root, 'Kollagen', 0, 0), p2 = pill(root, 'Vitamin E', 0, 0, C.rosa, S);
  const T1 = D * .6, T2 = D * .74;
  return (t) => {
    head.update(t); klapp.update(t);
    const kc = pr(t, .3, .75, ease.inOutCubic);
    bk.querySelector('svg').innerHTML = openBook(kc);
    const out = pr(t, 1.1, 1.5, ease.inCubic);
    place(bk, 540, 600 + out * 60, 1 - out * .2, 0, 1 - out);
    klapp.node.style.opacity = Math.min(+klapp.node.style.opacity, 1 - out);
    // Tape legt sich über die Lippen
    const d = pr(t, D * .22, D * .45, ease.outCubic);
    place(tape, 540, lerp(640, 1032, d) + noise(t, 3) * 6 * (1 - d), lerp(1.1, 1, d), lerp(-14, 0, d) + noise(t, 1) * 2 * (1 - d), pr(t, D * .22, D * .28));
    // Labels zur Pflege-Mitte
    const a1 = pop(t, T1), a2 = pop(t, T2);
    place(p1, 300, 690, lerp(.4, 1, a1), -3, clamp(a1 * 3));
    place(p2, 790, 690, lerp(.4, 1, a2), 3, clamp(a2 * 3));
    const l1 = pr(t, T1 + .1, T1 + .5), l2 = pr(t, T2 + .1, T2 + .5);
    lines.querySelector('svg').innerHTML = `
      <path d="M320 730 C330 860 420 960 500 1020" fill="none" stroke="${C.weiss}" stroke-width="5" stroke-dasharray="14 12" pathLength="1000" stroke-dashoffset="0" opacity="${l1}" style="clip-path:inset(0 ${100 - l1 * 100}% 0 0)"/>
      <path d="M770 730 C760 860 660 960 580 1020" fill="none" stroke="${C.rosa}" stroke-width="5" stroke-dasharray="14 12" opacity="${l2}"/>
      <circle cx="500" cy="1022" r="${9 * l1}" fill="${C.weiss}"/><circle cx="580" cy="1022" r="${9 * l2}" fill="${C.rosa}"/>`;
  };
}};

// ---------- s5: früher Balsam im Kissen, jetzt bleibt sie ----------
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur, SW = D * .62;
  const h1 = bigText(root, 'Früher: Balsam. Morgens im *Kissen.*', { y: 210, size: 104, t0: .05, step: .06 });
  const h2 = bigText(root, 'Jetzt bleibt sie, wo sie hin *soll.*', { y: 210, size: 104, t0: SW + .1, step: .06 });
  const shelf = svg(`<rect x="0" y="0" width="560" height="34" rx="8" fill="${C.rosaHell}" stroke="${S}" stroke-width="7"/><rect x="40" y="34" width="24" height="60" fill="${S}"/>`, {}, root, '0 0 560 100', 560, 100);
  const pl = svg(pillow(0), {}, root, '0 0 600 380', 640, 405);
  const bm = svg(balm, {}, root, '0 0 260 80', 200, 62);
  // Nacht-Kreis mit Mond und Tape
  const disc = el('div', { left: '0px', top: '0px', width: '700px', height: '700px', borderRadius: '50%', background: C.nacht, overflow: 'hidden' }, root);
  const sky = svg('', { left: 0, top: 0 }, disc, '0 0 700 700', 700, 700);
  const tape = svg(ART.tape(true), { left: '115px', top: '200px' }, disc, '0 0 400 400', 470, 470);
  return (t) => {
    h1.update(t); h2.update(t);
    const hOut = pr(t, SW - .3, SW, ease.lin);
    h1.node.style.opacity = 1 - hOut;
    // Phase A
    const fade = 1 - pr(t, SW - .3, SW + .1, ease.lin);
    place(shelf, 330, 640, 1, 0, fade);
    // Stift rollt nach rechts und fällt aufs Kissen
    const r = pr(t, .5, 1.6, ease.inCubic), f = pr(t, 1.6, 2.15, ease.inCubic);
    const bx = lerp(200, 640, r) + f * 120, by = 592 + f * 420;
    const bounce = t > 2.15 ? 30 * Math.exp(-(t - 2.15) * 6) * Math.abs(Math.sin((t - 2.15) * 10)) : 0;
    place(bm, bx, by - bounce, 1, r * 30 + f * 140 + (t > 2.15 ? 0 : 0), fade);
    const spot = pr(t, 2.2, 2.9, ease.outCubic);
    pl.querySelector('svg').innerHTML = pillow(spot);
    place(pl, 540, 1110, 1, 0, pr(t, .0, .4) * fade);
    // Phase B
    const k = pr(t, SW, SW + .6, ease.outBack);
    place(disc, 540, 1000, lerp(.3, 1, k), 0, clamp(k * 3));
    const stars = [[120, 160, .9], [200, 90, .6], [560, 120, .7], [610, 260, .55], [90, 330, .5], [600, 470, .6], [130, 520, .45]]
      .map(([x, y, s], i) => ART.star(x, y, s * (.8 + .2 * Math.sin(t * 3 + i)), MOND)).join('');
    const mk = pr(t, SW + .3, SW + 1.2);
    sky.querySelector('svg').innerHTML = stars + `<g transform="translate(0 ${(1 - mk) * 80})" opacity="${mk}"><circle cx="350" cy="170" r="62" fill="${MOND}"/><circle cx="378" cy="150" r="54" fill="${C.nacht}"/></g>`;
    tape.style.transform = `translateY(${noise(t, 4) * 3}px)`;
  };
}};

// ---------- s6: Morgen, Krönchen für die Schachtel ----------
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur, TC = D * .55;
  const light = svg(`<path d="M640 0 L1080 0 L1080 520 L260 1340 L40 1340Z" fill="${WARM}"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const n1 = note(root, 'Lippen: weich.', { x: 110, y: 480, r: -4, size: 84, t0: .3 });
  const head = bigText(root, 'Mein *Lieblingsteil.*', { y: 220, size: 124, t0: TC - .5, step: .08 });
  table(root);
  const bk = svg(book, {}, root, '0 0 300 120', 300*Z, 120*Z);
  const gl = svg(glasses, {}, root, '0 0 260 120', 220*Z, 102*Z);
  const cr = svg(cream, {}, root, '0 0 140 300', 140*Z, 300*Z);
  const bx = svg(box(), {}, root, '0 0 240 180', 240*Z, 180*Z);
  const cw = svg(crown, {}, root, '0 0 200 150', 190, 142);
  const SP = [[690, 610, .8], [950, 660, .6], [740, 500, .5], [910, 500, .45]];
  const sp = SP.map(() => svg(spark(C.beere), {}, root, '0 0 100 100', 80, 80));
  return (t) => {
    light.style.opacity = .55 + .45 * pr(t, 0, 1.5);
    n1.update(t); head.update(t);
    place(bk, 350, TOP - 40*Z); place(gl, 340, TOP - 131*Z, 1, -4);
    place(cr, 610, TOP - 146*Z);
    const kc = pr(t, TC, TC + .5, ease.outBack);
    const land = TC + .5, wob = t > land ? 5 * Math.exp(-(t - land) * 4) * Math.sin((t - land) * 14) : 0;
    place(bx, 815, TOP - 86*Z, 1, wob);
    place(cw, 815, lerp(380, TOP - 138*Z - 62, kc), 1, lerp(-30, -6, kc) + wob, pr(t, TC, TC + .15, ease.lin));
    sp.forEach((s, i) => {
      const [x, y, sc] = SP[i];
      const a = pr(t, land + i * .12, land + i * .12 + .4, ease.outBack);
      place(s, x, y, sc * a * (.85 + .15 * Math.sin(t * 5 + i)), t * 25 + i * 30, clamp(a));
    });
  };
}};
