/* OV13 – POV: Mein Freund sieht mich so im Bett  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

// ---------- eigene Illustrationen ----------
const HAIR = '#2A1D22', HIM_SKIN = '#E7B49B', HIM_HAIR = '#3A2A2E';

/** Sie: Kopf frontal mit Dutt. eyes: 'open' | 'wink' | 'wide'. tape 0..1. viewBox 0 0 400 460 */
function her(o = {}) {
  const eyes = o.eyes || 'open', tape = o.tape ?? 1, shoulders = o.shoulders ?? true;
  const eye = (x, wink) => wink
    ? `<path d="M${x - 18} 212 Q${x} 196 ${x + 18} 212" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round"/>`
    : `<ellipse cx="${x}" cy="208" rx="${eyes === 'wide' ? 12 : 10}" ry="${eyes === 'wide' ? 15 : 13}" fill="${C.schwarz}"/>
       <circle cx="${x + 3}" cy="203" r="3.5" fill="#fff"/>
       <path d="M${x - 17} 200 Q${x} 186 ${x + 17} 200" fill="none" stroke="${C.schwarz}" stroke-width="5" stroke-linecap="round"/>`;
  const browY = eyes === 'wide' ? 154 : 160;
  return `<g>
    ${shoulders ? `<path d="M60 460 C60 390 120 362 200 362 C280 362 340 390 340 460Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-opacity=".12" stroke-width="3"/>
      ${[[130, 420], [200, 400], [270, 425], [165, 448], [240, 450]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${C.rosaTief}"/>`).join('')}
      <rect x="176" y="320" width="48" height="52" fill="${C.hautDunkel}"/>` : ''}
    <circle cx="200" cy="58" r="52" fill="${HAIR}"/>
    <rect x="166" y="94" width="68" height="18" rx="9" fill="${C.rosaTief}"/>
    <path d="M78 230 C70 120 120 92 200 92 C280 92 330 120 322 230 C326 270 318 300 300 312 L100 312 C82 300 74 270 78 230Z" fill="${HAIR}"/>
    <ellipse cx="86" cy="232" rx="16" ry="24" fill="${C.hautDunkel}"/><ellipse cx="314" cy="232" rx="16" ry="24" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="230" rx="116" ry="128" fill="${C.haut}"/>
    <path d="M86 196 C96 128 150 104 210 108 C178 128 150 150 100 168 C94 178 90 186 86 196Z" fill="${HAIR}"/>
    <path d="M314 196 C306 140 270 112 226 108 C262 130 290 150 314 196Z" fill="${HAIR}"/>
    <path d="M136 ${browY + 4} Q154 ${browY - 10} 174 ${browY - 2}" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M226 ${browY - 2} Q246 ${browY - 10} 264 ${browY + 4}" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156, false)}${eye(244, eyes === 'wink')}
    <path d="M196 226 C192 246 190 254 200 258" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="128" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <ellipse cx="272" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <path d="M168 296 Q184 286 200 291 Q216 286 232 296 Q216 314 200 314 Q184 314 168 296Z" fill="${C.lippe}"/>
    <g opacity="${tape}" transform="translate(200 298) scale(.36) translate(-200 -200)">${ART.tape(true)}</g>
  </g>`;
}

/** Er: Oberkörper. o.brows 'up'|'flat', o.mouth 'o'|'line'|'smile', o.finger bool. viewBox 0 0 400 560 */
function him(o = {}) {
  const brows = o.brows || 'flat', mouth = o.mouth || 'line';
  const by = brows === 'up' ? 150 : 162;
  const m = mouth === 'o' ? `<ellipse cx="200" cy="262" rx="13" ry="16" fill="${C.schwarz}"/>`
    : mouth === 'smile' ? `<path d="M168 252 Q200 282 232 252" fill="none" stroke="${C.schwarz}" stroke-width="8" stroke-linecap="round"/>`
      : `<path d="M174 262 L226 258" stroke="${C.schwarz}" stroke-width="8" stroke-linecap="round"/>`;
  const arm = o.finger ? `<path d="M318 500 C336 440 348 390 352 340" fill="none" stroke="${C.schwarz}" stroke-width="58" stroke-linecap="round"/>
      <rect x="328" y="196" width="24" height="96" rx="12" fill="${HIM_SKIN}"/>
      <rect x="324" y="276" width="62" height="66" rx="24" fill="${HIM_SKIN}"/>
      <path d="M358 290 L358 306 M372 292 L372 306" stroke="#C99278" stroke-width="4" stroke-linecap="round"/>
      <rect x="318" y="310" width="46" height="20" rx="10" fill="#D9A088"/>` : '';
  return `<g>
    <path d="M30 ${o.long ? 900 : 560} L30 560 C30 420 90 372 200 372 C310 372 370 420 370 560 L370 ${o.long ? 900 : 560}Z" fill="${C.schwarz}"/>
    <path d="M168 372 L200 410 L232 372Z" fill="${HIM_SKIN}"/>
    <rect x="172" y="320" width="56" height="60" fill="${HIM_SKIN}"/>
    <ellipse cx="96" cy="210" rx="16" ry="26" fill="${HIM_SKIN}"/><ellipse cx="304" cy="210" rx="16" ry="26" fill="${HIM_SKIN}"/>
    <path d="M96 200 C96 120 140 88 200 88 C260 88 304 120 304 200 C304 290 260 340 200 340 C140 340 96 290 96 200Z" fill="${HIM_SKIN}"/>
    <path d="M90 186 C84 96 150 58 214 62 C270 64 316 96 310 186 C300 150 286 130 262 122 C220 136 150 134 110 128 C98 144 94 162 90 186Z" fill="${HIM_HAIR}"/>
    <path d="M140 ${by + (brows === 'up' ? 6 : 0)} L176 ${by}" stroke="${HIM_HAIR}" stroke-width="9" stroke-linecap="round"/>
    <path d="M224 ${by} L260 ${by + (brows === 'up' ? 6 : 0)}" stroke="${HIM_HAIR}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="158" cy="196" r="${brows === 'up' ? 12 : 10}" fill="${C.schwarz}"/><circle cx="242" cy="196" r="${brows === 'up' ? 12 : 10}" fill="${C.schwarz}"/>
    <path d="M200 206 C196 222 194 230 204 234" fill="none" stroke="#C99278" stroke-width="5" stroke-linecap="round"/>
    ${m}${arm}
  </g>`;
}

/** Sprechblase (HTML), Spitze nach unten bei tailX (0..1) */
function bubble(parent, html, o = {}) {
  const b = el('div', { left: (o.x ?? 100) + 'px', top: (o.y ?? 300) + 'px', width: (o.w ?? 760) + 'px', padding: '46px 56px 50px', background: o.bg ?? C.weiss, color: o.color ?? C.schwarz,
    border: `6px solid ${C.schwarz}`, borderRadius: '70px', fontFamily: F.display, fontSize: (o.size ?? 84) + 'px', lineHeight: 1.04, letterSpacing: '-1px', textAlign: 'center', transformOrigin: `${(o.tailX ?? .3) * 100}% 120%` }, parent);
  el('div', { position: 'relative' }, b, html);
  const tail = svg(`<path d="M6 0 L70 0 L${o.tailDir === 'r' ? 96 : -16} 86Z" fill="${o.bg ?? C.weiss}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/><rect x="2" y="-8" width="72" height="12" fill="${o.bg ?? C.weiss}"/>`,
    { left: `calc(${(o.tailX ?? .3) * 100}% - 40px)`, bottom: '-88px' }, b, '0 0 80 90', 80, 90);
  return b;
}
const pop = (node, t, t0, rot = -2) => { const k = pr(t, t0, t0 + .45, ease.outBack); node.style.opacity = clamp((t - t0) / .12); node.style.transform = `scale(${.6 + .4 * k}) rotate(${rot}deg)`; };

const NOTE = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="22" ry="17" transform="rotate(-20)" fill="${C.schwarz}"/><rect x="16" y="-92" width="9" height="92" fill="${C.schwarz}"/><path d="M25 -92 C50 -80 60 -62 48 -40 C52 -60 42 -70 25 -70Z" fill="${C.schwarz}"/></g>`;

/** Bett frontal. viewBox 0 0 640 520 */
function bedBack() {
  return `<rect x="20" y="40" width="600" height="250" rx="46" fill="${C.schwarz}"/>
    <rect x="50" y="70" width="540" height="190" rx="30" fill="#2C2131"/>
    <path d="M90 230 C100 180 540 180 550 230 C560 270 550 300 540 320 L100 320 C90 300 80 270 90 230Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-opacity=".15" stroke-width="4"/>`;
}
function bedFront() {
  return `<path d="M0 330 C120 300 520 300 640 330 L640 520 L0 520Z" fill="${C.rosaTief}"/>
    <path d="M0 330 C120 300 520 300 640 330 L640 372 C520 344 120 344 0 372Z" fill="${C.weiss}"/>
    <path d="M90 430 C180 410 260 440 330 420 M360 470 C440 450 520 470 590 450" fill="none" stroke="${C.beere}" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>`;
}

// ---------- Szenen ----------
// s1: Hook statisch ab Frame 0, Tür geht auf, er erstarrt
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'POV: Mein Freund sieht mich *so* im Bett', { x: 90, y: 210, w: 900, size: 116 });
  hook.update(99);
  // Tür
  const doorW = 300, doorH = 620, dx = 700, dy = 700;
  const frame = el('div', { left: dx - 22 + 'px', top: dy - 22 + 'px', width: doorW + 44 + 'px', height: doorH + 22 + 'px', background: C.schwarz, borderRadius: '10px 10px 0 0' }, root);
  const inside = el('div', { left: dx + 'px', top: dy + 'px', width: doorW + 'px', height: doorH + 'px', background: '#FFE3B8', overflow: 'hidden' }, root);
  const guy = svg(him({ brows: 'up', mouth: 'o' }), { left: '10px', top: '200px' }, inside, '0 0 400 560', 280, 392);
  const door = el('div', { left: dx + 'px', top: dy + 'px', width: doorW + 'px', height: doorH + 'px', background: C.weiss, transformOrigin: '100% 50%', border: `5px solid ${C.schwarz}` }, root);
  el('div', { left: '24px', top: '310px', width: '22px', height: '22px', borderRadius: '50%', background: C.schwarz }, door);
  el('div', { left: '40px', top: '60px', width: '210px', height: '200px', border: `4px solid ${C.schwarz}`, opacity: .25 }, door);
  el('div', { left: '40px', top: '330px', width: '210px', height: '220px', border: `4px solid ${C.schwarz}`, opacity: .25 }, door);
  const shock = svg(`<path d="M20 70 L0 40 M60 50 L60 10 M100 70 L120 40" stroke="${C.schwarz}" stroke-width="9" stroke-linecap="round"/>`, {}, root, '0 0 120 80', 120, 80);
  // Bett
  const back = svg(bedBack(), {}, root, '0 0 640 520', 640, 520);
  const she = svg(her({ eyes: 'open', shoulders: false }), {}, root, '0 0 400 460', 300, 345);
  const front = svg(bedFront(), {}, root, '0 0 640 520', 640, 520);
  return (t) => {
    const open = pr(t, .5, 1.4, ease.inOutCubic);
    door.style.transform = `scaleX(${1 - open * .86})`;
    place(guy, 140, 396, 1, noise(t, 2) * .4);
    guy.style.transform += ` translateX(${tw(t, .9, 1.6, 120, 0)}px)`;
    place(shock, 850, 860, 1, 0, pr(t, 1.8, 2.0) * (1 - pr(t, D - .3, D)));
    shock.style.transform += ` scale(${tw(t, 1.8, 2.1, .4, 1, ease.outBack)})`;
    place(back, 360, 1020, 1);
    place(she, 360, 1040 + noise(t, 5) * 3, 1, -4);
    place(front, 360, 1080, 1);
  };
}};

// s2: Er fragt
SCENES.s2 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const guy = svg(him({ brows: 'up', mouth: 'line', long: true }), {}, root, '0 0 400 560', 640, 896);
  const drop = svg(ART.drop('#BFE3F2'), {}, root, '0 0 400 400', 130, 130);
  const ok = el('div', { left: '130px', top: '250px', fontFamily: F.hand, fontWeight: 700, fontSize: '96px', color: C.schwarz }, root, 'Er: „Okay.“');
  const b = bubble(root, 'Muss ich mir <span style="color:' + C.beere + '">Sorgen</span> machen?', { x: 130, y: 400, w: 820, size: 96, tailX: .42 });
  return (t) => {
    place(guy, 470, 1240 + noise(t, 1) * 4, 1, noise(t, 3) * 1.2);
    ok.style.opacity = pr(t, 0, .3); ok.style.transform = `rotate(-4deg) translateY(${tw(t, 0, .4, 30, 0)}px)`;
    pop(b, t, D * .28, -1.5);
    const dk = pr(t, D * .5, D * .5 + .4, ease.outBack);
    place(drop, 760, tw(t, D * .5, D, 860, 900, ease.lin), dk, 18, clamp((t - D * .5) / .15));
  };
}};

// s3: Sie summt, nickt
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const she = svg(her({ eyes: 'open' }), {}, root, '0 0 400 460', 640, 736);
  const notes = [0, 1].map(i => svg(NOTE(60, 120), {}, root, '0 0 120 140', 110, 128));
  const b = bubble(root, 'Mhm mhm.', { x: 160, y: 270, w: 560, size: 110, tailX: .62, tailDir: 'r', bg: C.rosaHell });
  const lab = el('div', { left: '150px', top: '190px', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', color: C.schwarz, transform: 'rotate(-3deg)' }, root, 'ich, durchs Tape:');
  return (t) => {
    lab.style.opacity = pr(t, 0, .3);
    const nod = Math.max(0, Math.sin(clamp((t - D * .35) / (D * .55)) * Math.PI * 4)) * 22;
    place(she, 520, 1000 + nod, 1, nod * .15);
    pop(b, t, D * .3, 2);
    notes.forEach((n, i) => { const t0 = D * .4 + i * .35, k = pr(t, t0, t0 + 1.4, ease.lin);
      place(n, [870, 210][i], 900 - k * 200, .8 + i * .1, (i ? -12 : 12) + Math.sin(t * 5 + i) * 8, clamp((t - t0) / .2) * (1 - pr(t, t0 + 1, t0 + 1.4))); });
  };
}};

// s4: Das ist Lippenpflege – Zoom aufs Tape, drei Labels
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const pre = el('div', { left: '90px', top: '230px', fontFamily: F.hand, fontWeight: 700, fontSize: '92px', color: C.schwarz, transform: 'rotate(-2deg)' }, root, 'für alle, die<br>genauso gucken:');
  const head = bigText(root, 'Das ist *Lippenpflege.*', { x: 90, y: 330, w: 920, size: 120, t0: D * .27, step: .08 });
  const rings = svg(`<circle cx="200" cy="200" r="120" fill="none" stroke="${C.weiss}" stroke-width="6"/><circle cx="200" cy="200" r="160" fill="none" stroke="${C.weiss}" stroke-width="4" opacity=".6"/>`, {}, root, '0 0 400 400', 600, 600);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 900, 900);
  const labels = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'].map((s, i) => {
    const pos = [[110, 1100], [330, 1210], [640, 1100]][i];
    const n = el('div', { left: pos[0] + 'px', top: pos[1] + 'px', padding: '14px 30px 18px', background: C.schwarz, color: C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: '56px', borderRadius: '44px', whiteSpace: 'nowrap' }, root, s);
    return n;
  });
  return (t) => {
    pre.style.opacity = pr(t, 0, .3) * (1 - pr(t, D * .25, D * .3)) ;
    head.update(t);
    const z = tw(t, 0, D * .3, .86, 1, ease.inOutCubic);
    place(tape, 540, 860, z, tw(t, 0, D * .3, -10, -3, ease.inOutCubic));
    const g = pr(t, D * .48, D * .58);
    const pulse = (t * .9) % 1;
    place(rings, 540, 860, .6 + pulse * .5 * g, 0, g * (1 - pulse) * .9);
    labels.forEach((n, i) => { const t0 = D * (.52 + i * .13); const k = pr(t, t0, t0 + .4, ease.outBack);
      n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) rotate(${[-4, 2, 3][i]}deg)`; });
  };
}};

// s5: Nacht – Pflege bleibt, Kissen bleibt sauber
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const stars = svg([[40, 190], [380, 150], [370, 250], [20, 300]].map(([x, y], i) => ART.star(x, y, 1 + (i % 2) * .5)).join(''), {}, root, '0 0 400 400', 900, 900);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 300, 300);
  const top = bigText(root, 'Bleibt da, wo sie *hin* *soll.*', { x: 90, y: 220, w: 760, size: 100, color: C.weiss, accent: C.rosa, t0: .1, step: .07 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 560, 560);
  const pil = svg(`<path d="M50 120 Q200 150 350 120 Q330 200 350 280 Q200 250 50 280 Q70 200 50 120Z" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-opacity=".2" stroke-width="4" stroke-linejoin="round"/>
      <path d="M70 135 Q200 160 330 135 Q314 200 330 266 Q200 240 70 266 Q86 200 70 135Z" fill="none" stroke="${C.rosaTief}" stroke-width="3" stroke-dasharray="8 8"/>`, {}, root, '0 0 400 400', 720, 720);
  const smear = svg(`<g opacity=".6" transform="translate(200 205) scale(.42) rotate(-8) translate(-200 -200)">${ART.lips(.7, C.lippe)}</g>`, {}, root, '0 0 400 400', 720, 720);
  const wipe = svg(`<path d="M80 250 C160 160 260 250 340 150" fill="none" stroke="${C.weiss}" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 400 400', 720, 720);
  const bot = bigText(root, 'Nicht mehr im *Kissen.*', { x: 90, y: 220, w: 900, size: 100, color: C.weiss, accent: C.rosa, t0: D * .58, step: .07 });
  return (t) => {
    place(stars, 540, 700, 1, 0, .8);
    place(moon, 880, 640, 1, tw(t, 0, D, -6, 6, ease.lin));
    top.update(t); top.node.style.opacity = 1 - pr(t, D * .5, D * .56);
    place(tape, 470, 650 + Math.sin(t * 1.4) * 10, 1, -6 + Math.sin(t) * 2);
    place(pil, 540, 1060, 1);
    const w = pr(t, D * .5, D * .5 + .7, ease.inOutCubic);
    smear.style.clipPath = `inset(0 0 0 ${w * 100}%)`;
    place(smear, 540, 1060, 1);
    wipe.querySelector('path').setAttribute('stroke-dashoffset', 1 - w);
    place(wipe, 540, 1060, 1, 0, (w > .01 ? 1 : 0) * (1 - pr(t, D * .5 + .7, D * .5 + 1.1)));
    bot.update(t);
  };
}};

// s6: kleines Loch, er hebt den Finger
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Ja, da ist ein *kleines* *Loch.*', { x: 90, y: 220, w: 900, size: 112, t0: 0, step: .07 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 860, 860);
  const ring = svg(`<ellipse cx="100" cy="100" rx="70" ry="58" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-8 100 100)"/>`, {}, root, '0 0 200 200', 200, 200);
  const guy = svg(him({ brows: 'up', mouth: 'line', finger: true }), {}, root, '0 0 400 560', 380, 532);
  return (t) => {
    head.update(t);
    place(tape, 540, 700, .95, -4);
    const a = pr(t, D * .25, D * .25 + .6, ease.inOutCubic);
    ring.querySelector('ellipse').setAttribute('stroke-dashoffset', 1 - a);
    place(ring, 540, 700, .95);
    const k = pr(t, D * .58, D * .58 + .5, ease.outBack);
    place(guy, 760, tw(t, D * .58, D * .58 + .5, 1500, 1060, ease.outBack), 1, noise(t, 4) * 1.5, clamp((t - D * .58) / .1));
  };
}};

// s7: Nacht, Tür mit Licht, er im Türrahmen
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Inzwischen, *jeden* *Abend:*', { x: 90, y: 220, w: 900, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .06 });
  const frame = el('div', { left: '318px', top: '578px', width: '444px', height: '760px', background: '#120c15', borderRadius: '8px 8px 0 0' }, root);
  const light = el('div', { left: '340px', top: '600px', width: '400px', height: '738px', background: '#FFE3B8', overflow: 'hidden', transformOrigin: '0 50%' }, root);
  const guy = svg(him({ brows: 'flat', mouth: 'smile' }), { left: '20px', top: '210px' }, light, '0 0 400 560', 370, 518);
  const beam = svg(`<path d="M0 0 L400 0 L520 240 L-120 240Z" fill="#FFE3B8" opacity=".14"/>`, {}, root, '0 0 400 240', 400, 240);
  return (t) => {
    head.update(t);
    const k = lerp(.35, 1, pr(t, 0, .5, ease.outCubic));
    light.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`;
    place(beam, 540, 1462, 1, 0, k);
    guy.style.transform = `translateY(${Math.sin(t * 2) * 3}px)`;
  };
}};

// s8: Er fragt, sie zwinkert, Tape gleitet ins Bild
SCENES.s8 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const b = bubble(root, 'Hast du dein <span style="color:' + C.beere + '">Tape</span> schon drauf?', { x: 110, y: 220, w: 860, size: 100, tailX: .86, tailDir: 'r' });
  const face = svg(her({ eyes: 'open', tape: 0 }), {}, root, '0 0 400 460', 640, 736);
  const fly = svg(ART.tape(true), {}, root, '0 0 400 400', 230, 230);
  return (t) => {
    pop(b, t, 0, -1);
    b.style.opacity = 1;
    const wink = t > D * .45 && t < D * .45 + .5;
    const k = pr(t, D * .25, D * .7, ease.inOutCubic);
    face.querySelector('svg').innerHTML = her({ eyes: wink ? 'wink' : 'open', tape: 0 });
    place(face, 540, 1010, 1, noise(t, 2));
    // Tape gleitet von rechts auf den Mund (Mund im face: 200,298 von 400x460 -> Skala 1.6)
    const mx = 540 + (200 - 200) * 1.6, my = 1010 + (298 - 230) * 1.6;
    place(fly, lerp(1200, mx, k), lerp(820, my, k), lerp(1.3, 1, k), lerp(40, 0, k));
  };
}};
