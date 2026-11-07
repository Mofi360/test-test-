/* OV18 – Übernachtung mit Tape  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

// ---------- Farben ----------
const S = C.schwarz;
const HAIR_ME = '#2A1D22', HAIR_FR = '#A5583A', HAIR_FR2 = '#8A452C', MOND = '#F7E7C6';

const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

/** Kopf + Schultern einer Figur. viewBox 0 0 400 480, Gesicht mittig (200 232).
 *  o.who 'me' (lange dunkle Haare, schwarzer Pyjama) | 'fr' (rote Locken, rosa Pyjama)
 *  o.eyes 'open'|'wide'|'happy'|'closed'   o.look -1..1   o.brows 'normal'|'up'|'skeptic'
 *  o.mouth 'smile'|'grin'|'laugh'|'o'|'hmm'|'lips'   o.tape 0..1 (Tape über geschlossenen Lippen) */
function girl(o = {}) {
  const me = (o.who ?? 'me') === 'me';
  const hc = me ? HAIR_ME : HAIR_FR, top = me ? S : C.rosaTief, dots = me ? C.rosa : C.weiss;
  const lx = (o.look ?? 0) * 8, eyes = o.eyes ?? 'open', brows = o.brows ?? 'normal', m = o.mouth ?? 'smile';
  // Haare hinten
  let back;
  if (me) back = `<path d="M84 232 C70 112 128 70 200 70 C272 70 330 112 316 232 C322 300 336 360 332 430 L68 430 C64 360 78 300 84 232Z" fill="${hc}"/>`;
  else {
    const pts = Array.from({ length: 15 }, (_, i) => { const a = Math.PI * (0.92 + i / 14 * 1.16); return [200 + Math.cos(a) * 128, 222 + Math.sin(a) * 132]; });
    back = pts.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 2 ? 42 : 48}" fill="${hc}"/>`).join('')
      + `<path d="M78 230 C80 300 96 336 110 352 L290 352 C304 336 320 300 322 230Z" fill="${hc}"/>`
      + [[72, 300], [328, 300], [82, 346], [318, 346]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="34" fill="${hc}"/>`).join('')
      + `<circle cx="200" cy="62" r="40" fill="${HAIR_FR2}"/><circle cx="172" cy="72" r="26" fill="${hc}"/><circle cx="230" cy="70" r="28" fill="${hc}"/>`
      + `<rect x="164" y="92" width="72" height="20" rx="10" fill="${C.weiss}"/>`;
  }
  // Haare vorne
  const front = me
    ? `<path d="M88 212 C84 128 140 94 216 100 C192 132 152 162 92 194Z" fill="${hc}"/><path d="M312 212 C310 140 272 104 228 102 C258 132 290 162 312 212Z" fill="${hc}"/>`
    : [[118, 132, 30], [158, 112, 32], [202, 106, 32], [244, 114, 30], [282, 136, 28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hc}"/>`).join('');
  // Augenbrauen
  const bc = me ? hc : HAIR_FR2;
  const bL = brows === 'up' ? 'M134 164 Q154 146 176 154' : 'M134 176 Q154 162 176 168';
  const bR = brows === 'up' || brows === 'skeptic' ? 'M224 154 Q246 146 266 164' : 'M224 168 Q246 162 266 176';
  const browsSvg = `<path d="${bL}" fill="none" stroke="${bc}" stroke-width="8" stroke-linecap="round"/><path d="${bR}" fill="none" stroke="${bc}" stroke-width="8" stroke-linecap="round"/>`;
  // Augen
  const eye = (x, right) => {
    if (eyes === 'happy') return `<path d="M${x - 18} 228 Q${x} 206 ${x + 18} 228" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`;
    if (eyes === 'closed') return `<path d="M${x - 18} 220 Q${x} 236 ${x + 18} 220" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
      <path d="M${x + (right ? 16 : -16)} 224 l${right ? 8 : -8} 7" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`;
    if (eyes === 'wide') return `<circle cx="${x}" cy="220" r="23" fill="${C.weiss}" stroke="${S}" stroke-width="5"/>
      <circle cx="${x + lx}" cy="222" r="11" fill="${S}"/><circle cx="${x + lx + 4}" cy="217" r="3.5" fill="#fff"/>`;
    return `<ellipse cx="${x + lx}" cy="222" rx="11" ry="14" fill="${S}"/><circle cx="${x + lx + 4}" cy="216" r="3.8" fill="#fff"/>
      <path d="M${x + (right ? 12 : -12)} 210 l${right ? 9 : -9} -7" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`;
  };
  // Mund
  const L = C.lippe;
  const lips = `<path d="M170 300 Q186 290 200 296 Q214 290 230 300 Q214 318 200 318 Q186 318 170 300Z" fill="${L}"/><path d="M172 300 Q200 306 228 300" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`;
  const mouth = m === 'grin' ? `<path d="M164 292 Q200 300 236 292 Q228 334 200 336 Q172 334 164 292Z" fill="#7A2C40"/><path d="M168 294 Q200 302 232 294 L230 304 Q200 310 170 304Z" fill="#fff"/>`
    : m === 'laugh' ? `<path d="M158 286 Q200 296 242 286 Q238 350 200 352 Q162 350 158 286Z" fill="#7A2C40"/><path d="M162 288 Q200 298 238 288 L236 300 Q200 308 164 300Z" fill="#fff"/><ellipse cx="200" cy="334" rx="24" ry="12" fill="${C.lippeHell}"/>`
    : m === 'o' ? `<ellipse cx="200" cy="306" rx="15" ry="19" fill="#7A2C40"/>`
    : m === 'hmm' ? `<path d="M178 306 Q192 300 204 306 T228 302" fill="none" stroke="${L}" stroke-width="8" stroke-linecap="round"/>`
    : m === 'lips' ? lips
    : `<path d="M172 296 Q200 322 228 296" fill="none" stroke="${L}" stroke-width="9" stroke-linecap="round"/>`;
  const tape = o.tape ?? 0;
  return `<g>
    ${back}
    <path d="M40 600 L40 480 C40 404 110 370 200 370 C290 370 360 404 360 480 L360 600Z" fill="${top}"/>
    ${[[110, 440], [160, 416], [250, 418], [298, 446], [204, 458], [76, 470], [330, 474]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${dots}" opacity=".8"/>`).join('')}
    <path d="M168 372 Q200 404 232 372" fill="none" stroke="${me ? '#3a2e33' : C.lippeHell}" stroke-width="8" stroke-linecap="round"/>
    <rect x="174" y="318" width="52" height="58" rx="14" fill="${C.hautDunkel}"/>
    <ellipse cx="88" cy="238" rx="16" ry="24" fill="${C.hautDunkel}"/><ellipse cx="312" cy="238" rx="16" ry="24" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="232" rx="112" ry="124" fill="${C.haut}"/>
    ${front}${browsSvg}${eye(156, false)}${eye(244, true)}
    <path d="M197 238 C193 256 192 264 203 266" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="130" cy="272" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/><ellipse cx="270" cy="272" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    ${tape > 0 ? lips : mouth}
    ${tape > 0 ? `<g opacity="${tape}" transform="translate(200 306) scale(.4) translate(-200 -200)">${ART.tape(true)}</g>` : ''}
  </g>`;
}
const fig = (parent, opts, w) => { const n = svg(girl(opts), {}, parent, '0 0 400 480', w, w * 1.2); n._k = JSON.stringify(opts); return n; };
/** Ausdruck nur neu zeichnen, wenn er sich ändert */
const setFig = (n, opts) => { const k = JSON.stringify(opts); if (n._k !== k) { n.querySelector('svg').innerHTML = girl(opts); n._k = k; } };

/** Sprechblase. Gibt {node, update(t)} zurück. tail: x-Position (px in der Blase) der Spitze unten */
function bubble(parent, html, o = {}) {
  const b = el('div', { left: (o.x ?? 90) + 'px', top: (o.y ?? 220) + 'px', width: (o.w ?? 900) + 'px', boxSizing: 'border-box', padding: o.pad ?? '44px 56px 50px',
    background: o.bg ?? C.weiss, border: `7px solid ${S}`, borderRadius: '70px', fontFamily: F.display, fontSize: (o.size ?? 96) + 'px', lineHeight: 1.04,
    color: S, textAlign: 'center', letterSpacing: '-1px', transformOrigin: `${o.tail ?? 600}px 110%` }, parent, html);
  const tl = o.tail ?? 600, flip = o.flip ? -1 : 1;
  svg(`<path d="M0 0 L${60 * flip} 0 L${70 * flip} 80 Z" fill="${o.bg ?? C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/><rect x="${flip > 0 ? 4 : -56}" y="-12" width="52" height="16" fill="${o.bg ?? C.weiss}"/>`,
    { left: (tl - 30) + 'px', bottom: '-86px' }, b, `${flip > 0 ? -10 : -80} -14 90 100`, 90, 100);
  const t0 = o.t0 ?? 0;
  return { node: b, update(t) { const k = pr(t, t0, t0 + .45, ease.outBack); b.style.opacity = clamp((t - t0) / .12); b.style.transform = `scale(${.6 + .4 * k}) rotate(${(o.r ?? -1.5) * k}deg)`; } };
}
const label = (parent, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '12px 34px 16px', background: o.bg ?? C.weiss, color: o.color ?? S, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 54) + 'px', borderRadius: '44px', whiteSpace: 'nowrap' }, parent, text);
const popIn = (n, t, t0, rot = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };
const fadeOut = (node, t, t0, t1) => { node.style.opacity = Math.min(+node.style.opacity, 1 - pr(t, t0, t1)); };

// ---------- Szenen ----------
// s1: Hook statisch. Bett mit beiden unter der Decke, Licht wird gedimmt, das Tape taucht auf.
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  // Fenster mit Nachthimmel
  const win = svg(`<rect x="0" y="0" width="300" height="250" rx="18" fill="${C.nacht}" stroke="${S}" stroke-width="10"/>
    <path d="M150 0 L150 250 M0 125 L300 125" stroke="${S}" stroke-width="8"/>
    <g transform="translate(176 14) scale(.3)">${ART.moon()}</g>${ART.star(60, 50, .9)}${ART.star(100, 190, .6)}${ART.star(250, 200, .8)}`, {}, root, '-6 -6 312 262', 300, 252);
  // Nachttisch + Lampe
  const stand = svg(`<rect x="0" y="0" width="190" height="230" rx="12" fill="${C.weiss}" stroke="${S}" stroke-width="8"/><path d="M0 100 L190 100" stroke="${S}" stroke-width="6"/><circle cx="95" cy="56" r="9" fill="${S}"/><circle cx="95" cy="160" r="9" fill="${S}"/>`, {}, root, '-6 -6 202 242', 190, 230);
  const lamp = svg(ART.lamp(1), {}, root, '0 0 400 400', 300, 300);
  // Bett
  const head = svg(`<path d="M20 330 L20 90 C20 40 60 10 110 10 L710 10 C760 10 800 40 800 90 L800 330Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="10"/>
    <path d="M80 330 L80 110 C80 84 100 70 124 70 L696 70 C720 70 740 84 740 110 L740 330" fill="none" stroke="${S}" stroke-opacity=".2" stroke-width="8"/>`, {}, root, '0 0 820 340', 820, 340);
  const pil = svg(ART.pillow(C.weiss) + `<g transform="translate(330 0)">${ART.pillow(C.weiss)}</g>`, {}, root, '20 90 710 260', 710, 260);
  const me = fig(root, { who: 'me', mouth: 'smile', look: .6 }, 300);
  const fr = fig(root, { who: 'fr', mouth: 'smile', look: -.6 }, 300);
  const blanket = svg(`<path d="M0 60 C120 20 220 70 330 40 C440 10 560 66 680 34 C740 20 790 40 820 52 L820 330 L0 330Z" fill="${C.weiss}" stroke="${S}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M0 120 C140 90 260 130 400 104 C540 80 680 120 820 100" fill="none" stroke="${C.rosaTief}" stroke-width="14"/>
    ${Array.from({ length: 18 }, (_, i) => `<circle cx="${40 + (i % 6) * 140 + (Math.floor(i / 6) % 2) * 70}" cy="${170 + Math.floor(i / 6) * 50}" r="9" fill="${C.rosa}"/>`).join('')}`, {}, root, '-6 0 832 334', 832, 334);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const sp = svg(sparkle(40, 60, 1.1, S) + sparkle(250, 40, .8, C.beere) + sparkle(270, 150, .6, S), {}, root, '0 0 300 200', 300, 200);
  const dim = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.nacht, opacity: 0 }, root);
  const hook = bigText(root, 'POV: Deine beste Freundin *übernachtet* bei dir.', { x: 80, y: 200, w: 920, size: 104 });
  hook.update(99); hook.node.style.zIndex = 5;
  const n1 = note(root, 'abgeschminkt, Licht gedimmt …', { x: 90, y: 1178, r: -3, t0: D * .25, size: 66 });
  n1.node.style.zIndex = 5;
  const tT = D * .66;
  return (t) => {
    const dk = pr(t, D * .38, D * .52, ease.inOutSine);
    dim.style.opacity = dk * .12;
    lamp.querySelector('svg').innerHTML = ART.lamp(1 - dk * .7);
    place(win, 150, 640, .72, -2);
    place(stand, 140, 1100, 1, 0); place(lamp, 140, 900, 1, 0);
    place(head, 625, 870, 1, 0);
    place(pil, 625, 880, 1, 0);
    // Köpfe atmen leicht, Freundin dreht sich zum Tape
    setFig(me, { who: 'me', mouth: t > tT ? 'grin' : 'smile', look: .6, eyes: t > tT + .3 ? 'happy' : 'open' });
    setFig(fr, { who: 'fr', mouth: t > tT + .2 ? 'o' : 'smile', look: t > tT ? -.2 : -.6, eyes: t > tT + .2 ? 'wide' : 'open', brows: t > tT + .2 ? 'up' : 'normal' });
    place(me, 465, 880 + noise(t, 1) * 3, 1, -4);
    place(fr, 775, 884 + noise(t, 2) * 3, 1, 5);
    place(blanket, 630, 1158, 1, 0);
    n1.update(t); fadeOut(n1.node, t, tT - .2, tT + .1);
    // Tape kommt unter der Decke hervor
    const k = pr(t, tT, tT + .6, ease.outBack);
    place(tape, 630, lerp(1150, 1090, k), .3 + .7 * k, lerp(30, -8, k) + Math.sin(t * 2) * 2, clamp((t - tT) / .15));
    place(sp, 640, 1010, pr(t, tT + .3, tT + .7, ease.outBack), 0, clamp((t - tT - .3) / .1) * (.8 + Math.sin(t * 6) * .2));
  };
}};

// s2: Sie, große Augen, Sprechblase
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const who = note(root, 'Sie:', { x: 110, y: 200, r: -5, t0: 0, size: 80 });
  const b = bubble(root, 'Was wird das denn <span style="color:' + C.beere + '">jetzt?</span>', { x: 90, y: 300, w: 900, size: 104, tail: 560, t0: .05 });
  const fr = fig(root, { who: 'fr' }, 640);
  const lines = svg(`<g stroke="${S}" stroke-width="10" stroke-linecap="round"><path d="M40 120 L90 150"/><path d="M60 50 L110 100"/><path d="M360 120 L310 150"/><path d="M340 50 L290 100"/></g>`, {}, root, '0 0 400 200', 760, 380);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 280, 280);
  return (t) => {
    who.update(t + .5); b.update(t);
    const wow = t > .35;
    setFig(fr, { who: 'fr', eyes: wow ? 'wide' : 'open', brows: wow ? 'up' : 'normal', mouth: wow ? 'o' : 'smile', look: .7 });
    const k = pr(t, .3, .7, ease.outBack);
    place(fr, 520, 1060 + (1 - k) * 20, 1, -2 + noise(t, 5) * 1.2);
    place(lines, 520, 720, .8 + .2 * k, 0, clamp((t - .35) / .1));
    // Tape in der Ecke, sie schaut drauf
    place(tape, 880, 1250 + Math.sin(t * 2.2) * 8, 1, -14 + Math.sin(t * 1.6) * 3);
  };
}};

// s3: Ich – Lippen zu, Tape drüber, fertig
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Ich: *Lippenpflege.*', { x: 80, y: 210, w: 960, size: 108, t0: 0, step: .07 });
  const steps = ['Lippen zu', 'Tape drüber', 'fertig.'].map((s, i) => label(root, s, { x: [80, 400, 790][i], y: 370, size: 54, bg: i === 2 ? S : C.weiss, color: i === 2 ? C.weiss : S }));
  const me = fig(root, { who: 'me' }, 680);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const sp = svg(sparkle(40, 50, 1.2, C.weiss) + sparkle(330, 40, .9, C.weiss) + sparkle(300, 150, .6, C.beere), {}, root, '0 0 360 200', 360, 200);
  const T = [D * .3, D * .52, D * .78];
  return (t) => {
    head.update(t);
    steps.forEach((s, i) => popIn(s, t, T[i], [-3, 2, -2][i]));
    const closed = t > T[0] + .15, on = pr(t, T[1], T[1] + .7, ease.inOutCubic);
    setFig(me, { who: 'me', eyes: t > T[2] ? 'happy' : 'open', mouth: closed ? 'lips' : 'smile', tape: on >= 1 ? 1 : 0, look: 0 });
    // Kopf: Fokus 1080x1920; Mund liegt bei (200 306)/400 der Figur
    const cx = 540, cy = 1000, FS = 680 / 400;
    place(me, cx, cy + noise(t, 3) * 3, 1, 0);
    const mx = cx, my = cy - 240 * FS + 306 * FS;
    // Tape fliegt von rechts oben auf den Mund (Figur 560 px breit → Faktor 1.4; Tape auf Mund = 0.4*1.4*400 px)
    const tx = lerp(900, mx, on), ty = lerp(560, my, on) - Math.sin(on * Math.PI) * 90;
    place(tape, tx, ty, lerp(1, .4 * FS * 400 / 300, on), lerp(30, 0, on), on > 0 && on < 1 ? 1 : (on >= 1 ? 0 : clamp((t - T[1] + .3) / .2)));
    place(sp, mx, my - 40, pr(t, T[2], T[2] + .4, ease.outBack), Math.sin(t * 2) * 6, clamp((t - T[2]) / .1));
  };
}};

// s4: "Du siehst aus wie ein Emoji." – beide lachen
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const b = bubble(root, 'Du siehst aus wie ein <span style="color:' + C.beere + '">Emoji.</span>', { x: 90, y: 210, w: 900, size: 100, tail: 690, t0: 0 });
  const emoji = svg(`<circle cx="100" cy="100" r="88" fill="${MOND}" stroke="${S}" stroke-width="9"/>
    <ellipse cx="70" cy="88" rx="10" ry="15" fill="${S}"/><ellipse cx="130" cy="88" rx="10" ry="15" fill="${S}"/>
    <ellipse cx="46" cy="126" rx="16" ry="9" fill="${C.rosaTief}" opacity=".6"/><ellipse cx="154" cy="126" rx="16" ry="9" fill="${C.rosaTief}" opacity=".6"/>`, {}, root, '0 0 200 200', 230, 230);
  const arrow = svg(`<path d="M20 10 C70 30 90 70 80 120" fill="none" stroke="${S}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M58 100 L80 124 L100 98" fill="none" stroke="${S}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`, {}, root, '0 0 120 140', 120, 140);
  const me = fig(root, { who: 'me', tape: 1 }, 420);
  const fr = fig(root, { who: 'fr' }, 420);
  const ha = note(root, 'haha', { x: 820, y: 640, r: 8, t0: 1.2, size: 76, color: C.beere });
  return (t) => {
    b.update(t + .4); ha.update(t);
    const laugh = t > 1.0;
    setFig(me, { who: 'me', tape: 1, eyes: laugh ? 'happy' : 'open', look: .5 });
    setFig(fr, { who: 'fr', eyes: laugh ? 'happy' : 'open', mouth: laugh ? 'laugh' : 'grin', look: -.5 });
    const w = laugh ? Math.sin(t * 16) * pr(t, 1.0, 1.3) : 0;
    place(me, 300, 1080 + Math.abs(w) * -8, 1, -3 + w * 3);
    place(fr, 780, 1080 + Math.abs(Math.sin(t * 16 + 1)) * (laugh ? -10 : 0), 1, 3 - w * 4);
    place(emoji, 230, 690, pr(t, .4, .8, ease.outBack), -8 + Math.sin(t * 2.5) * 4, clamp((t - .4) / .1));
    const a = pr(t, .7, 1.1), ps = arrow.querySelectorAll('path');
    ps[0].setAttribute('stroke-dashoffset', 1 - a); ps[1].setAttribute('opacity', a > .95 ? 1 : 0);
    place(arrow, 400, 760, 1, 0);
  };
}};

// s5: Nacht – ein Tape für sie, die Pflege-Mitte überzeugt
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Okay, eins *für* *sie.*', { x: 80, y: 200, w: 940, size: 116, color: C.weiss, accent: C.rosa, t0: 0, step: .07 });
  const stars = svg([[30, 40], [200, 100], [330, 26]].map(([x, y], i) => ART.star(x, y, .7 + i * .2)).join(''), {}, root, '0 0 380 130', 380, 130);
  const rip = svg('', {}, root, '0 0 600 400', 820, 547);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 260, 260);
  const me = fig(root, { who: 'me', tape: 1 }, 340);
  const fr = fig(root, { who: 'fr' }, 340);
  const mid = note(root, 'in der Mitte:', { x: 100, y: 470, r: -4, t0: D * .3, size: 72, color: C.rosa });
  const L = [label(root, 'Kollagen', { x: 110, y: 770, size: 54 }), label(root, 'Hyaluronsäure', { x: 450, y: 836, size: 54, bg: C.rosa })];
  const tFly = .5, tUp = D * .3;
  return (t) => {
    head.update(t); mid.update(t);
    place(stars, 830, 520, 1, 0, .55 + Math.sin(t * 2) * .25);
    // Tape: von mir zu ihr (Bogen), dann groß in die Bildmitte
    const f = pr(t, tFly, tFly + 1.0, ease.inOutCubic), u = pr(t, tUp, tUp + .9, ease.inOutCubic);
    let x = lerp(300, 790, f), y = lerp(1000, 960, f) - Math.sin(f * Math.PI) * 260, s = .7, r = lerp(-20, 380, f);
    x = lerp(x, 540, u); y = lerp(y, 650, u); s = lerp(s, 2.6, u); r = lerp(r % 360, -4, u) + Math.sin(t * 1.4) * 1.5 * u;
    place(tape, x, y, s, r, clamp((t - tFly + .1) / .15));
    const g = pr(t, tUp + .6, tUp + 1.1);
    rip.querySelector('svg').innerHTML = [0, 1, 2].map(i => { const ph = ((t * .6 + i / 3) % 1); return `<ellipse cx="300" cy="200" rx="${90 + ph * 200}" ry="${40 + ph * 110}" fill="none" stroke="${C.rosa}" stroke-width="6" opacity="${(1 - ph) * .7 * g}"/>`; }).join('');
    place(rip, 540, 650, 1, -3);
    L.forEach((l, i) => popIn(l, t, D * (.45 + i * .12), [-3, 2][i]));
    // Figuren unten
    const conv = t > D * .72;
    setFig(me, { who: 'me', tape: 1, eyes: 'happy' });
    setFig(fr, { who: 'fr', eyes: conv ? 'open' : 'open', brows: conv ? 'up' : 'skeptic', mouth: conv ? 'grin' : 'hmm', look: conv ? -.3 : -.8 });
    const nod = conv ? Math.sin((t - D * .72) * 9) * (1 - pr(t, D * .72, D * .72 + 1.2)) * 6 : 0;
    place(me, 260, 1150, 1, -4);
    place(fr, 820, 1150 + nod * 2, 1, 4 + nod * .5);
  };
}};

// s6: Morgen im Bad – sie zieht das Tape ab, Spiegel, „echt weich“
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  // Fliesen
  svg(Array.from({ length: 9 }, (_, i) => `<line x1="${i * 135}" y1="0" x2="${i * 135}" y2="900" stroke="${C.rosa}" stroke-width="6"/>`).join('')
    + Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 135}" x2="1080" y2="${i * 135}" stroke="${C.rosa}" stroke-width="6"/>`).join(''), { left: 0, top: '560px' }, root, '0 0 1080 900', 1080, 900);
  const n = note(root, 'morgens im Bad:', { x: 100, y: 220, r: -4, t0: 0, size: 82 });
  const b = bubble(root, 'Okay. Die sind <span style="color:' + C.beere + '">echt weich.</span>', { x: 90, y: 200, w: 900, size: 96, tail: 470, t0: D * .62 });
  const mir = el('div', { left: '230px', top: '540px', width: '620px', height: '720px', background: S, borderRadius: '310px 310px 40px 40px' }, root);
  const glass = el('div', { left: '22px', top: '22px', width: '576px', height: '676px', background: C.rosaHell, borderRadius: '288px 288px 24px 24px', overflow: 'hidden' }, mir);
  const fr = fig(glass, { who: 'fr', tape: 1, eyes: 'closed' }, 520);
  const tape = svg(ART.tape(true), {}, glass, '0 0 400 400', 208, 208);
  svg(`<path d="M80 200 L200 80 M70 290 L250 110" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".6"/>`, { left: 0, top: 0 }, glass, '0 0 576 676', 576, 676);
  const sink = svg(`<path d="M0 20 L460 20 L430 80 C420 110 40 110 30 80Z" fill="${C.weiss}" stroke="${S}" stroke-width="9" stroke-linejoin="round"/><rect x="210" y="-30" width="40" height="50" rx="10" fill="${S}"/>`, {}, root, '-10 -40 480 160', 480, 160);
  const hearts = [0, 1, 2].map(() => svg(ART.heart(C.beere), {}, root, '0 0 400 400', 110, 110));
  const tA = D * .12, tB = D * .5;
  return (t) => {
    n.update(t); fadeOut(n.node, t, D * .55, D * .6); b.update(t);
    // Tape langsam abziehen: hebt sich an einer Ecke, gleitet nach rechts weg
    const k = pr(t, tA, tB, ease.inOutSine);
    const off = k > .25;
    setFig(fr, { who: 'fr', tape: off ? 0 : 1, eyes: t > tB ? 'open' : 'closed', mouth: t > tB + .4 ? 'grin' : 'lips', brows: t > tB && t < tB + .4 ? 'up' : 'normal', look: 0 });
    place(fr, 288, 400, 1, 0);
    // Mund in Glas-Koordinaten: Figur 520x624, links 28, oben 88 → Mund bei (288, 88 + 306*1.3)
    const mx = 288, my = 400 - 312 + 306 * 1.3;
    place(tape, mx + k * 300, my - Math.sin(k * Math.PI) * 60, 1 + k * .15, k * 40 - Math.sin(k * Math.PI) * 18, off ? 1 - pr(t, tB - .3, tB) : 0);
    place(mir, 540, 900, 1, 0);
    place(sink, 540, 1290, 1, 0);
    hearts.forEach((h, i) => { const t0 = D * .7 + i * .2, hk = pr(t, t0, t0 + .4, ease.outBack);
      place(h, [150, 930, 890][i], [760, 700, 960][i] - (t - t0) * 12, hk * (i ? .8 : 1), [-14, 12, 6][i], clamp((t - t0) / .1)); });
  };
}};

// s7: Jede ihr eigenes Tape – anstoßen. Markier-CTA.
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const n = note(root, 'jetzt hat sie ihre eigenen.', { x: 100, y: 230, r: -3, t0: 0, size: 80 });
  const head = bigText(root, 'Und ich muss nicht mehr *teilen.*', { x: 80, y: 200, w: 940, size: 110, t0: D * .45, step: .07 });
  const scene = svg('', {}, root, '0 0 1080 900', 1080, 900);
  const cta = el('div', { left: '90px', top: '1210px', width: '900px', boxSizing: 'border-box', padding: '22px 30px 26px', background: S, color: C.weiss, borderRadius: '60px', fontFamily: F.sans, fontWeight: 700, fontSize: '50px', textAlign: 'center' }, root, 'Markier deine Übernachtungs-Freundin');
  const tags = [note(root, 'meins', { x: 170, y: 560, r: -8, t0: .4, size: 66 }), note(root, 'ihrs', { x: 800, y: 560, r: 6, t0: .6, size: 66 })];
  const arm = (sx, sy, hx, hy, col) => `<path d="M${sx} ${sy} Q${sx + (sx < 540 ? 40 : -40)} ${(sy + hy) / 2} ${hx} ${hy + 30}" fill="none" stroke="${col}" stroke-width="58" stroke-linecap="round"/>
    <rect x="${hx - 26}" y="${hy - 34}" width="52" height="62" rx="24" fill="${C.haut}"/>`;
  const tp = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-200 -200)">${ART.tape(true)}</g>`;
  return (t) => {
    n.update(t); fadeOut(n.node, t, D * .38, D * .44); head.update(t);
    tags.forEach(tg => { tg.update(t); fadeOut(tg.node, t, D * .38, D * .44); });
    // Anstoßen: Hände gehen zusammen, kleiner Stoß, Funken
    const c = pr(t, D * .42, D * .42 + .5, ease.inCubic);
    const gap = lerp(200, 70, c), hy = lerp(380, 340, c) + Math.sin(t * 2) * 5;
    const lx = 540 - gap, rx = 540 + gap;
    const burst = c >= 1 ? pr(t, D * .42 + .5, D * .42 + .8, ease.outBack) : 0;
    const happy = c >= 1;
    const meM = `<g transform="translate(70 380) scale(.9)">${girl({ who: 'me', eyes: happy ? 'happy' : 'open', mouth: 'grin', look: .6 })}</g>`;
    const frM = `<g transform="translate(650 380) scale(.9)">${girl({ who: 'fr', eyes: happy ? 'happy' : 'open', mouth: happy ? 'laugh' : 'grin', look: -.6 })}</g>`;
    const sparks = burst > 0 ? `<g transform="translate(540 ${hy - 90}) scale(${burst})" opacity="${1 - pr(t, D * .42 + 1.8, D * .42 + 2.4)}">${[0, 1, 2, 3, 4].map(i => { const a = -Math.PI * (0.15 + i / 4 * .7); return `<line x1="${Math.cos(a) * 50}" y1="${Math.sin(a) * 50}" x2="${Math.cos(a) * 95}" y2="${Math.sin(a) * 95}" stroke="${S}" stroke-width="11" stroke-linecap="round"/>`; }).join('')}${sparkle(-120, -60, .9, C.weiss)}${sparkle(130, -50, .7, C.beere)}</g>` : '';
    scene.querySelector('svg').innerHTML = meM + frM
      + arm(352, 760, lx - 30, hy + 30, S) + arm(728, 760, rx + 30, hy + 30, C.rosaTief)
      + tp(lx - 40, hy - 20, -18 + c * 12, .5) + tp(rx + 40, hy - 20, 18 - c * 12, .5) + sparks;
    place(scene, 540, 790, 1, 0);
    popIn(cta, t, D * .72, -1.5);
  };
}};
