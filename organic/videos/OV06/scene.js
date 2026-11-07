/* OV06 – Mit 56 zum ersten Mal  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const HAIR = '#D3C8CC', HAIR2 = '#B2A5AB', FINGER = '#EDBFA9', SUN = '#F7E7C6';

// ---------- eigene Illustrationen ----------
/** Sie, 56: silberner Bob, Lesebrille im Haar. viewBox 0 0 400 480 */
function lady(o = {}) {
  const by = o.brows === 'up' ? 156 : 164;
  return `<g>
    <path d="M50 480 C50 400 110 368 200 368 C290 368 350 400 350 480Z" fill="${C.schwarz}"/>
    <rect x="172" y="318" width="56" height="62" fill="${C.hautDunkel}"/>
    <path d="M172 368 L200 404 L228 368Z" fill="${C.hautDunkel}"/>
    <path d="M84 250 C70 140 120 78 200 78 C280 78 330 140 316 250 C318 292 306 318 290 328 L110 328 C94 318 82 292 84 250Z" fill="${HAIR}"/>
    <path d="M104 300 C98 270 98 240 102 210 M298 300 C304 270 304 240 298 210" stroke="${HAIR2}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="200" cy="226" rx="106" ry="120" fill="${C.haut}"/>
    <path d="M92 204 C94 122 150 92 214 96 C262 98 302 124 312 196 C288 152 246 134 196 142 C156 148 120 172 92 204Z" fill="${HAIR}"/>
    <path d="M150 120 C176 108 214 106 246 116 M128 150 C150 134 176 126 206 124" stroke="${HAIR2}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g fill="none" stroke="${C.schwarz}" stroke-width="7"><circle cx="164" cy="104" r="25"/><circle cx="236" cy="104" r="25"/><path d="M189 102 Q200 94 211 102"/></g>
    <path d="M138 ${by + 4} Q156 ${by - 10} 176 ${by - 2}" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/>
    <path d="M224 ${by - 2} Q244 ${by - 10} 262 ${by + 4}" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="158" cy="208" rx="10" ry="12" fill="${C.schwarz}"/><circle cx="161" cy="203" r="3.5" fill="#fff"/>
    <ellipse cx="242" cy="208" rx="10" ry="12" fill="${C.schwarz}"/><circle cx="245" cy="203" r="3.5" fill="#fff"/>
    <path d="M118 206 L106 200 M118 216 L106 218 M282 206 L294 200 M282 216 L294 218" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round"/>
    <path d="M196 222 C192 244 190 252 202 256" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="130" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/><ellipse cx="270" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/>
    <path d="M166 288 Q183 280 200 285 Q217 280 234 288 Q218 312 200 312 Q182 312 166 288Z" fill="${C.lippe}"/>
    <path d="M168 289 Q200 298 232 289" fill="none" stroke="${C.schwarz}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
    <circle cx="96" cy="318" r="8" fill="#fff" stroke="${C.schwarz}" stroke-opacity=".2" stroke-width="2"/><circle cx="304" cy="318" r="8" fill="#fff" stroke="${C.schwarz}" stroke-opacity=".2" stroke-width="2"/>
  </g>`;
}
/** Hand, die ein Tape hochhält. viewBox 0 0 300 360 */
function handTape() {
  return `<g>
    <rect x="96" y="250" width="108" height="120" rx="22" fill="${C.schwarz}"/>
    <rect x="100" y="136" width="100" height="128" rx="40" fill="${C.haut}"/>
    <g transform="translate(150 90) rotate(-6) scale(.66) translate(-200 -200)">${ART.tape(true)}</g>
    ${[0, 1, 2, 3].map(i => `<rect x="${102 + i * 24.5}" y="104" width="24" height="74" rx="12" fill="${C.haut}" stroke="${C.hautDunkel}" stroke-opacity=".6" stroke-width="3"/>`).join('')}
    <ellipse cx="204" cy="164" rx="19" ry="36" transform="rotate(-28 204 164)" fill="${C.haut}" stroke="${C.hautDunkel}" stroke-opacity=".6" stroke-width="3"/>
  </g>`;
}

/** Fingerspitze, Spitze bei (x,y), Finger zeigt in Richtung rot. */
function finger(x, y, rot, off = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) translate(0 ${off})">
    <rect x="-40" y="-6" width="80" height="420" rx="40" fill="${FINGER}" stroke="${C.schwarz}" stroke-opacity=".15" stroke-width="4"/>
    <rect x="-25" y="8" width="50" height="62" rx="22" fill="#F8DED6"/>
    <path d="M-22 120 Q0 128 22 120 M-20 136 Q0 142 20 136" stroke="${C.hautDunkel}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g>`;
}

/** Nahaufnahme Mund (für die Lupe). viewBox 0 0 800 800, Lippen-Mitte bei (400,405).
 *  o.tape: {x,y,r,s,o} | o.peel: Grad (Abziehen um rechtes Ende) | o.spark 0..1 | o.glow 0..1 | o.fingers: Offset (0 = drückt) */
function closeup(o = {}) {
  const T = o.tape;
  let tapeSvg = '';
  if (T) {
    const lift = T.lift ?? 0;
    const shadow = lift > 0 ? `<ellipse cx="${400 + (T.x ?? 0) * .6}" cy="${430 + (T.y ?? 0) * .3}" rx="${250 * (1 - lift * .3)}" ry="${40}" fill="${C.schwarz}" opacity="${.12 * (1 - lift)}"/>` : '';
    const peel = o.peel ? `translate(646 405) rotate(${o.peel}) translate(-646 -405)` : '';
    tapeSvg = shadow + `<g opacity="${T.o ?? 1}" transform="${peel} translate(${400 + (T.x ?? 0)} ${405 + (T.y ?? 0)}) rotate(${T.r ?? 0}) scale(${1.45 * (T.s ?? 1)}) translate(-200 -200)">${ART.tape(true)}</g>`;
  }
  const g = o.glow ?? 0;
  const glow = g > 0 ? `<rect x="${400 - 140 - g * 30}" y="${405 - 52 - g * 30}" width="${280 + g * 60}" height="${104 + g * 60}" rx="${52 + g * 30}" fill="none" stroke="#fff" stroke-width="10" opacity="${(1 - g) * .9}"/>` : '';
  const sp = o.spark ?? 0;
  const sparks = sp > 0 ? [[230, 300, 1.6], [590, 290, 2], [640, 470, 1.3], [180, 480, 1.8], [400, 250, 1.1]].map(([x, y, s], i) =>
    ART.star(x, y, s * clamp(sp * 2.2 - i * .25) * (1 + .15 * Math.sin(sp * 20 + i)), '#fff')).join('') : '';
  return `<g>
    <path d="M0 640 C120 700 250 770 400 770 C550 770 680 700 800 640 L800 800 L0 800Z" fill="${C.hautDunkel}" opacity=".55"/>
    <ellipse cx="400" cy="150" rx="86" ry="56" fill="#F5D4C3"/>
    <path d="M318 168 C346 204 378 212 400 206 C422 212 454 204 482 168" fill="none" stroke="${C.hautDunkel}" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="364" cy="186" rx="14" ry="8" fill="${C.hautDunkel}" opacity=".7"/><ellipse cx="436" cy="186" rx="14" ry="8" fill="${C.hautDunkel}" opacity=".7"/>
    <path d="M384 222 C382 260 380 300 382 342 M416 222 C418 260 420 300 418 342" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>
    <path d="M276 238 C246 300 246 380 262 450 M524 238 C554 300 554 380 538 450" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
    <path d="M320 600 C360 626 440 626 480 600" stroke="${C.hautDunkel}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>
    <g transform="translate(400 405) scale(.85) translate(-200 -200)">${ART.lips(.5)}</g>
    ${tapeSvg}${glow}${sparks}
    ${o.fingers != null ? finger(160, 410, 28, o.fingers) + finger(640, 410, -28, o.fingers) : ''}
  </g>`;
}

/** Lupe: runder Ausschnitt mit Nahaufnahme. */
function lens(root, cx = 540, cy = 870, d = 820, bg = C.haut) {
  const ring = el('div', { left: cx - d / 2 + 'px', top: cy - d / 2 + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: bg, overflow: 'hidden', border: `10px solid ${C.schwarz}`, boxSizing: 'border-box' }, root);
  const pic = svg('', { left: '0px', top: '0px' }, ring, '0 0 800 800', d - 20, d - 20);
  return { ring, set(m) { pic.querySelector('svg').innerHTML = m; } };
}

/** Schritt-Überschrift: Nummer im Kreis + Satz */
function stepHead(root, n, text, o = {}) {
  const y = o.y ?? 230, col = o.color ?? C.schwarz;
  const dot = el('div', { left: '90px', top: y + 'px', width: '150px', height: '150px', borderRadius: '50%', background: col, color: o.numColor ?? C.weiss, fontFamily: F.display, fontSize: '104px', lineHeight: '150px', textAlign: 'center' }, root, String(n));
  const bt = bigText(root, text, { x: 280, y: y + (o.dy ?? 10), w: o.w ?? 720, size: o.size ?? 88, color: col, accent: o.accent ?? C.beere, t0: .15, step: .06 });
  return { update(t) { const k = pr(t, 0, .45, ease.outBack); dot.style.transform = `scale(${.3 + .7 * k}) rotate(${(1 - k) * -40}deg)`; dot.style.opacity = clamp(t / .1); bt.update(t); } };
}

const drawPath = (node, k) => { const p = node.querySelector('[pathLength]'); p.setAttribute('stroke-dashoffset', 1 - k); };

// ---------- Szenen ----------
// s1: Hook statisch, sie hält zum ersten Mal ein Tape hoch
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Mit 56 zum ersten Mal *Mouth* *Tape.*', { x: 90, y: 210, w: 900, size: 128 });
  hook.update(99);
  const she = svg(lady({ brows: 'up' }), {}, root, '0 0 400 480', 600, 720);
  const hand = svg(handTape(), {}, root, '0 0 300 360', 390, 468);
  const qm = svg(`<path d="M30 40 C30 10 80 6 82 36 C84 60 54 62 54 86" fill="none" stroke="${C.schwarz}" stroke-width="10" stroke-linecap="round"/><circle cx="54" cy="112" r="7" fill="${C.schwarz}"/>`, {}, root, '0 0 110 130', 110, 130);
  const n = note(root, 'so geht’s\nrichtig:', { x: 640, y: 880, r: -5, size: 96, t0: D * .58 });
  return (t) => {
    place(she, 380, 960 + noise(t, 2) * 3, .9, noise(t, 1) * .8);
    // Hand kommt hoch, Tape wird neugierig gedreht
    const up = pr(t, .3, 1.2, ease.outBack);
    const down = pr(t, D * .48, D * .6, ease.inCubic);
    place(hand, lerp(1300, 800, up) + down * 520, 940, 1, lerp(20, 0, up) + Math.sin(t * 2.2) * 5 * pr(t, 1.2, 1.6));
    place(qm, 690, 640, tw(t, 1.3, 1.7, .3, 1, ease.outBack), Math.sin(t * 3) * 6, pr(t, 1.3, 1.45) * (1 - pr(t, D * .5, D * .55)));
    n.update(t);
  };
}};

// s2: Schritt 1 – Waschlappen wischt, Haken
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = stepHead(root, 1, 'Sauber und *trocken.*');
  const L = lens(root, 540, 880, 820);
  const cloth = svg(`<g transform="rotate(-12 150 110)"><rect x="20" y="20" width="260" height="180" rx="34" fill="${C.rosaTief}"/>
      <rect x="40" y="40" width="220" height="140" rx="22" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 12" opacity=".8"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M${70 + i * 40} 60 L${60 + i * 40} 160" stroke="${C.schwarz}" stroke-opacity=".1" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>`, {}, root, '0 0 300 220', 300, 220);
  const chk = svg(`<circle cx="100" cy="100" r="84" fill="${C.schwarz}"/><path d="M58 104 L88 134 L144 70" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 200 200', 190, 190);
  return (t) => {
    head.update(t);
    const w = pr(t, D * .22, D * .62, ease.inOutSine);
    const sp = pr(t, D * .4, D * .9, ease.lin);
    L.set(closeup({ spark: sp }));
    // Wisch-Bogen von links nach rechts über die Lippenlinie
    const vis = w > 0 && w < 1 ? 1 : 0;
    place(cloth, lerp(200, 880, w), 880 + Math.sin(w * Math.PI * 2) * 40 - Math.sin(w * Math.PI) * 30, 1, lerp(-10, 14, w), vis * clamp(Math.min(w, 1 - w) * 12));
    const c = pr(t, D * .65, D * .65 + .5, ease.outBack);
    place(chk, 860, 1220, .3 + .7 * c, 0, clamp((t - D * .65) / .1));
    drawPath(chk, pr(t, D * .7, D * .7 + .4));
  };
}};

// s3: Schritt 2 – Tape schwebt langsam heran und legt sich auf die Lippen
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = stepHead(root, 2, 'Lippen zu, *sanft* auflegen.');
  const L = lens(root, 540, 900, 800);
  const n = note(root, 'ganz sanft', { x: 640, y: 1250, r: -6, size: 74, t0: D * .62 });
  return (t) => {
    head.update(t);
    const k = pr(t, D * .15, D * .78, ease.inOutCubic);
    const fl = 1 - k;
    L.set(closeup({ tape: { x: 260 * fl, y: -330 * fl + Math.sin(t * 2.4) * 14 * fl, r: lerp(-22, 0, k), s: lerp(1.12, 1, k), lift: fl } }));
    n.update(t);
  };
}};

// s4: Schritt 3 – zwei Fingerspitzen drücken, Pflege-Mitte leuchtet
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = stepHead(root, 3, 'Einmal leicht *andrücken.*');
  const L = lens(root, 540, 850, 760);
  const n = note(root, 'Pflege-Mitte\nauf den Lippen', { x: 60, y: 1200, r: -5, size: 60, t0: D * .6 });
  return (t) => {
    head.update(t);
    const inK = pr(t, D * .1, D * .3, ease.outCubic), outK = pr(t, D * .5, D * .62, ease.inCubic);
    const press = Math.sin(clamp((t - D * .3) / (D * .14)) * Math.PI) * 14;
    const off = lerp(420, 0, inK) + press + outK * 460;
    const glow = t > D * .5 ? ((t - D * .5) * .9) % 1 : 0;
    L.set(closeup({ tape: {}, fingers: off, glow }));
    n.update(t);
  };
}};

// s5: Zoom aufs kleine Loch, Kringel + Pfeil
SCENES.s5 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Das *kleine* *Loch* in der Mitte', { x: 90, y: 220, w: 900, size: 112, t0: 0, step: .06 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 900, 900);
  const ring = svg(`<ellipse cx="100" cy="100" rx="66" ry="54" transform="rotate(-8 100 100)" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 200 200', 200, 200);
  const n = note(root, 'genau hier', { x: 130, y: 1170, r: -5, size: 88, t0: D * .5 });
  const arr = svg(`<path d="M10 150 C40 90 70 50 120 20" fill="none" stroke="${C.schwarz}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M84 18 L122 18 L108 54" fill="none" stroke="${C.schwarz}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`, {}, root, '0 0 140 170', 140, 170);
  return (t) => {
    head.update(t);
    const z = tw(t, D * .1, D * .45, 1, 1.75, ease.inOutCubic);
    place(tape, 540, 880, z, tw(t, 0, D * .45, -6, 0, ease.inOutCubic));
    const a = pr(t, D * .42, D * .42 + .6, ease.inOutCubic);
    drawPath(ring, a); place(ring, 540, 880, 1.6 + .05 * Math.sin(t * 3) * a);
    n.update(t);
    const b = pr(t, D * .6, D * .6 + .5); drawPath(arr, b); place(arr, 440, 1050, 1, 0, b > 0 ? 1 : 0); arr.querySelectorAll('path')[1].setAttribute('opacity', b > .95 ? 1 : 0);
  };
}};

// s6: Schritt 4 – Morgensonne, Tape löst sich in Zeitlupe, Schnecke
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const sun = svg(`<circle cx="200" cy="200" r="96" fill="${SUN}"/>${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<path d="M${200 + Math.cos(a) * 124} ${200 + Math.sin(a) * 124} L${200 + Math.cos(a) * 164} ${200 + Math.sin(a) * 164}" stroke="${SUN}" stroke-width="16" stroke-linecap="round"/>`; }).join('')}`, {}, root, '0 0 400 400', 360, 360);
  const head = stepHead(root, 4, 'Morgens *langsam* abziehen.');
  const L = lens(root, 520, 870, 740);
  const snail = svg(`<path d="M20 150 C20 120 60 112 110 112 L230 112 C262 112 280 130 280 150 Z" fill="#fff" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M230 116 L246 60 M258 120 L284 70" stroke="${C.schwarz}" stroke-width="6" stroke-linecap="round"/><circle cx="246" cy="58" r="9" fill="${C.schwarz}"/><circle cx="285" cy="68" r="9" fill="${C.schwarz}"/>
      <circle cx="130" cy="78" r="70" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="6"/>
      <path d="M130 78 C130 66 148 66 148 80 C148 98 118 100 114 80 C108 54 148 42 162 66 C178 94 156 126 124 124 C88 122 72 88 84 62" fill="none" stroke="${C.schwarz}" stroke-width="6" stroke-linecap="round"/>`, {}, root, '0 0 300 160', 240, 128);
  const n = note(root, 'ganz in Ruhe', { x: 90, y: 1255, r: -4, size: 72, t0: D * .6 });
  return (t) => {
    place(sun, 900, tw(t, 0, D * .5, 720, 560, ease.outCubic), 1, t * 6);
    head.update(t);
    const peel = tw(t, D * .25, D * .9, 0, 38, ease.inOutSine);
    L.set(closeup({ tape: { o: 1 - pr(t, D * .86, D * .95) }, peel }));
    place(snail, tw(t, 0, D, 700, 840, ease.lin), 1250, 1, 0, pr(t, D * .45, D * .55));
    n.update(t);
  };
}};

// s7: Vier Kärtchen stapeln sich, Speichern-Symbol
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const stars = svg([[385, 170], [12, 420], [330, 440]].map(([x, y], i) => ART.star(x, y, .9 + (i % 2) * .4)).join(''), {}, root, '0 0 400 400', 1000, 1000);
  const head = bigText(root, 'Speichern für *heute* *Abend.*', { x: 90, y: 220, w: 700, size: 110, color: C.weiss, accent: C.rosa, t0: 0, step: .06 });
  const steps = ['Sauber und trocken', 'Lippen zu, auflegen', 'Leicht andrücken', 'Morgens langsam ab'];
  const cards = steps.map((s, i) => {
    const c = el('div', { left: '110px', top: 560 + i * 170 + 'px', width: '800px', height: '140px', background: C.weiss, borderRadius: '20px', boxShadow: '0 20px 40px -18px rgba(0,0,0,.6)' }, root);
    el('div', { left: '26px', top: '22px', width: '96px', height: '96px', borderRadius: '50%', background: i === 3 ? C.beere : C.schwarz, color: C.weiss, fontFamily: F.display, fontSize: '66px', lineHeight: '96px', textAlign: 'center' }, c, String(i + 1));
    el('div', { left: '152px', top: '36px', fontFamily: F.sans, fontWeight: 600, fontSize: '56px', color: C.schwarz, whiteSpace: 'nowrap' }, c, s);
    return c;
  });
  const bm = svg('', {}, root, '0 0 140 180', 140, 180);
  return (t) => {
    place(stars, 540, 760, 1, 0, .7);
    head.update(t);
    cards.forEach((c, i) => {
      const t0 = D * (.08 + i * .1), k = pr(t, t0, t0 + .45, ease.outBack);
      c.style.opacity = clamp((t - t0) / .1);
      c.style.transform = `translateY(${(1 - k) * -260}px) rotate(${(1 - k) * 8 + [-2, 1.5, -1, 2][i]}deg)`;
    });
    const saved = t > D * .68;
    const pulse = 1 + .08 * Math.sin(t * 6) * pr(t, D * .55, D * .6);
    bm.querySelector('svg').innerHTML = `<path d="M20 14 H120 V166 L70 128 L20 166Z" fill="${saved ? C.rosa : 'none'}" stroke="${saved ? C.rosa : C.weiss}" stroke-width="12" stroke-linejoin="round"/>`;
    place(bm, 880, 360, tw(t, D * .5, D * .5 + .4, .2, 1, ease.outBack) * pulse * (saved ? 1 + .25 * (1 - pr(t, D * .68, D * .68 + .3)) : 1), 6, clamp((t - D * .5) / .1));
  };
}};
