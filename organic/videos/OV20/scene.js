/* OV20 – ASMR: Tape drauf  [KI]
 * Ruhiges ASMR-Reel: wenige, langsame Bewegungen (inOutSine), viel Luft, durchgehende Bildwelt
 * (Nachttisch -> Gesicht -> Tape -> Lampe -> Morgen -> Nacht).
 */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

const S = C.schwarz, CREAM = '#F7E7C6', WARM = '#FFE7B0';
const soft = ease.inOutSine;
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

// ---------- Gesicht (Face-Koordinaten viewBox 0 0 400 400, Lippen-Mitte ca. 200/238) ----------
const tapeAt = (rot = 0, dy = 0, op = 1, pivotX = 200) =>
  `<g opacity="${op}" transform="rotate(${rot} ${pivotX} 238) translate(0 ${dy})"><g transform="translate(200 238) scale(.62) translate(-200 -200)">${ART.tape(true)}</g></g>`;

/** Zeigefinger senkrecht über den Lippen (Psst-Geste), Hand unten am Kinn */
function shhFinger(lift = 0) {
  return `<g transform="translate(0 ${lift})">
    <path d="M150 400 C140 360 150 330 176 322 L176 196 C176 170 224 170 224 196 L224 318 C256 318 272 346 268 400Z" fill="#EDB9A3" stroke="${C.hautDunkel}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M186 204 C186 186 214 186 214 204 L214 226 C214 234 186 234 186 226Z" fill="#FBE3DA" stroke="${C.hautDunkel}" stroke-width="3"/>
    <path d="M184 270 C194 276 206 276 216 270 M184 300 C194 305 206 305 216 300" stroke="${C.hautDunkel}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>`;
}

/** waagrechte Fingerspitze; side -1 = von links, 1 = von rechts; tipX = x der Spitze */
function fingertip(side, tipX) {
  return `<g transform="rotate(${side < 0 ? -38 : 38} ${tipX} 238)">${fingerFlat(side, tipX)}</g>`;
}
function fingerFlat(side, tipX) {
  const d = side < 0
    ? `M${tipX - 520} 212 L${tipX - 26} 212 C${tipX - 4} 212 ${tipX + 4} 226 ${tipX + 4} 238 C${tipX + 4} 252 ${tipX - 4} 264 ${tipX - 26} 264 L${tipX - 520} 264Z`
    : `M${tipX + 520} 212 L${tipX + 26} 212 C${tipX + 4} 212 ${tipX - 4} 226 ${tipX - 4} 238 C${tipX - 4} 252 ${tipX + 4} 264 ${tipX + 26} 264 L${tipX + 520} 264Z`;
  const nx = side < 0 ? tipX - 40 : tipX + 8;
  return `<path d="${d}" fill="#EDB9A3" stroke="${C.hautDunkel}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="${nx}" y="220" width="32" height="24" rx="11" fill="#FBE3DA" stroke="${C.hautDunkel}" stroke-width="2.5"/>
    <path d="M${tipX - side * 90} 222 C${tipX - side * 84} 232 ${tipX - side * 84} 246 ${tipX - side * 90} 256" stroke="${C.hautDunkel}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
const ring = (x, y, k) => k <= 0 || k >= 1 ? '' :
  `<circle cx="${x}" cy="${y}" r="${lerp(14, 70, k)}" fill="none" stroke="${C.beere}" stroke-width="${lerp(5, 1.5, k)}" opacity="${(1 - k) * .7}"/>`;

// ---------- Nachttisch (viewBox 0 0 800 760). open 0..1, mid = mittleres Tape im Fach sichtbar ----------
function nightstand(open = 0, mid = true, id = 'a') {
  const k = open, fy = 210 + k * 170;              // Oberkante Schubladenfront
  const floor = `M120 210 L680 210 L${700} ${fy} L${100} ${fy}Z`;
  const tapes = [230, 400, 570].map((x, i) => (i === 1 && !mid) ? '' :
    `<g transform="translate(${x} ${210 + (fy - 210) * .52}) scale(.44 ${.44 * (0.3 + .7 * k)}) translate(-200 -200)">${ART.tape(true)}</g>`).join('');
  return `
    <rect x="96" y="716" width="34" height="44" rx="6" fill="${S}"/><rect x="670" y="716" width="34" height="44" rx="6" fill="${S}"/>
    <rect x="70" y="160" width="660" height="566" rx="10" fill="#FFF7F4" stroke="${S}" stroke-width="7"/>
    <rect x="40" y="122" width="720" height="44" rx="12" fill="${S}"/>
    <rect x="120" y="420" width="560" height="270" rx="10" fill="none" stroke="${S}" stroke-width="6"/>
    <circle cx="400" cy="470" r="11" fill="${S}"/>
    <path d="M160 600 C260 580 360 610 460 590" stroke="${C.rosaTief}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>
    <rect x="120" y="210" width="560" height="172" rx="6" fill="#3A2C32"/>
    ${k > 0 ? `<clipPath id="fl${id}"><path d="${floor}"/></clipPath>
      <path d="${floor}" fill="${C.rosaHell}"/><g clip-path="url(#fl${id})">${tapes}</g>` : ''}
    <rect x="${120 - k * 20}" y="${fy}" width="${560 + k * 40}" height="${172 + k * 10}" rx="10" fill="${C.rosa}" stroke="${S}" stroke-width="7"/>
    <rect x="${340 - k * 4}" y="${fy + 70 + k * 4}" width="${120 + k * 8}" height="26" rx="13" fill="${S}"/>
  `;
}

/** Nachttischlampe (viewBox 0 0 400 520), on 0..1 */
function lamp(on) {
  return `
    ${[230, 170, 120].map((r, i) => `<circle cx="200" cy="150" r="${r}" fill="${WARM}" opacity="${on * [.10, .16, .24][i]}"/>`).join('')}
    <path d="M100 60 L300 60 L350 230 L50 230Z" fill="${on > .5 ? '#FFF1D6' : '#E9CBD3'}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M120 90 L290 90" stroke="${S}" stroke-opacity=".15" stroke-width="5"/>
    <path d="M150 230 Q200 ${250 + 20 * on} 250 230" fill="${WARM}" opacity="${on}"/>
    <rect x="190" y="230" width="20" height="230" fill="${S}"/>
    <path d="M110 520 C110 480 150 456 200 456 C250 456 290 480 290 520Z" fill="${S}"/>
    <line x1="262" y1="230" x2="262" y2="${300}" stroke="${S}" stroke-width="3"/><circle cx="262" cy="306" r="8" fill="${C.beere}"/>`;
}

const pill = (parent, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '14px 34px 18px', background: o.bg ?? S, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 56) + 'px', borderRadius: '50px', whiteSpace: 'nowrap' }, parent, text);
const fadeUp = (n, t, t0, dur = .7, rot = 0) => { const k = pr(t, t0, t0 + dur, soft); n.style.opacity = k; n.style.transform = `translateY(${(1 - k) * 26}px) rotate(${rot}deg)`; };
const fadeOut = (n, t, t0, dur = .4) => { n.style.opacity = Math.min(+n.style.opacity, 1 - pr(t, t0, t0 + dur, soft)); };

/** Gesicht im runden Porträt-Rahmen (kein harter oberer Bildrand) */
const portrait = (ring, id) => `<clipPath id="pc${id}"><circle cx="200" cy="215" r="205"/></clipPath>
  <circle cx="200" cy="215" r="205" fill="${ring}"/><g clip-path="url(#pc${id})">${ART.face(.55, 0, 0)}</g>`;
const FACE = { x: 540, y: 900, s: 1.6 };   // gleiche Kameraposition in s4, s5, s8
const faceNode = root => svg(ART.face(.55, 0, 0), {}, root, '0 0 400 400', 400, 400);

// ---------- Szenen ----------
// s1: Hook statisch (Thumbnail), Gesicht mit Psst-Finger, Klangbögen atmen langsam nach außen
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'ASMR: Tape drauf. *Licht* *aus.*', { x: 90, y: 210, w: 920, size: 128 });
  hook.update(99);
  const face = svg(portrait(C.rosaHell, 1) + `<g clip-path="url(#pc1)">${shhFinger(0)}</g>`, {}, root, '0 0 400 400', 400, 400);
  const waves = [-1, 1].map(side => svg('', {}, root, '0 0 200 300', 200, 300));
  const ps = note(root, 'pssst …', { x: 640, y: 560, r: -6, t0: -1, size: 92 });
  ps.update(99);
  return (t) => {
    place(face, 540, 1000 + Math.sin(t * 1.1) * 3, 1.65 * tw(t, 0, D, 1, 1.025, ease.lin));
    waves.forEach((w, i) => {
      const side = i ? 1 : -1;
      const arcs = [0, 1, 2].map(j => {
        const ph = ((t * .45 + j / 3) % 1);         // langsam wandernde Bögen
        const r = 40 + ph * 110, op = Math.sin(ph * Math.PI) * .9;
        return `<path d="M${100 - side * 60 + side * r * .2} ${150 - r} A${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${100 - side * 60 + side * r * .2} ${150 + r}" fill="none" stroke="${S}" stroke-width="9" stroke-linecap="round" opacity="${op}" transform="translate(${side * (r * .55)} 0)"/>`;
      }).join('');
      w.querySelector('svg').innerHTML = arcs;
      place(w, side > 0 ? 905 : 175, 1060, 1);
    });
    ps.node.style.transform = `rotate(${-6 + Math.sin(t * 1.2) * 1.2}deg)`;
  };
}};

// s2: Schublade gleitet ganz langsam auf – Tapes liegen darin
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Packung *auf.*', { x: 90, y: 250, w: 900, size: 140, t0: 0, step: .12 });
  const ns = svg(nightstand(0), { left: '140px', top: '540px' }, root, '0 0 800 760', 800, 760);
  return (t) => {
    head.update(t);
    ns.querySelector('svg').innerHTML = nightstand(pr(t, .15, D + .2, soft), true, 's2');
  };
}};

// s3: Ein Tape schwebt langsam aus dem Fach nach oben
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const ns = svg(nightstand(1, false, 's3'), { left: '140px', top: '540px' }, root, '0 0 800 760', 800, 760);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 400, 400);
  const sp = svg(sparkle(40, 40, 1) + sparkle(130, 80, .55) + sparkle(30, 130, .45), {}, root, '0 0 180 170', 180, 170);
  const n = note(root, 'eins.', { x: 120, y: 300, r: -5, t0: D * .45, size: 96 });
  return (t) => {
    const k = pr(t, 0, D + .3, soft);
    place(tape, 540, lerp(839, 440, k) + Math.sin(t * 1.4) * 4 * k, lerp(.44, 1.75, k), lerp(0, -4, k) + Math.sin(t * .9) * 1.5 * k);
    const s = pr(t, D * .5, D * .9, soft);
    place(sp, 880, 360, .7 + .2 * Math.sin(t * 2), t * 12, s);
    n.update(t);
  };
}};

// s4: Lippen zu – das Tape senkt sich in Zeitlupe auf die Lippen
SCENES.s4 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const pre = note(root, 'Lippen zu.', { x: 110, y: 260, r: -4, t0: 0, size: 100 });
  const head = bigText(root, 'Ganz *sanft.*', { x: 90, y: 250, w: 900, size: 150, t0: D * .4, step: .14 });
  const face = faceNode(root);
  return (t) => {
    pre.update(t + .5); fadeOut(pre.node, t, D * .3);
    head.update(t);
    const k = pr(t, .1, D * .92, soft);
    face.querySelector('svg').innerHTML = portrait(C.rosa, 4) + tapeAt(lerp(-8, 0, k), lerp(-230, 0, k), clamp(k * 3));
    place(face, FACE.x, FACE.y, FACE.s);
  };
}};

// s5: Zwei Fingerspitzen drücken sanft an, kleine Wellen
SCENES.s5 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const n = note(root, 'kurz andrücken.', { x: 110, y: 270, r: -4, t0: 0, size: 104 });
  const face = faceNode(root);
  return (t) => {
    n.update(t + .5);
    const inK = pr(t, 0, D * .45, soft);
    const press = Math.sin(pr(t, D * .45, D * .8, ease.lin) * Math.PI) * 6;
    const rk = pr(t, D * .5, D + .3, ease.lin);
    face.querySelector('svg').innerHTML = portrait(C.rosa, 5) + tapeAt() +
      fingertip(-1, lerp(30, 104, inK) + press) + fingertip(1, lerp(370, 296, inK) - press) +
      ring(104, 238, rk) + ring(296, 238, rk) + ring(104, 238, rk - .35) + ring(296, 238, rk - .35);
    place(face, FACE.x, FACE.y, FACE.s);
  };
}};

// s6: Die Mitte glimmt, drei Pflege-Labels blenden weich ein, dann "Die ganze Nacht da."
SCENES.s6 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const pre = note(root, 'in der Mitte:', { x: 110, y: 260, r: -3, t0: 0, size: 100 });
  const head = bigText(root, 'Die ganze Nacht *da.*', { x: 90, y: 240, w: 900, size: 128, t0: D * .5, step: .12 });
  const halo = svg(`<ellipse cx="200" cy="200" rx="130" ry="64" fill="${C.weiss}" opacity=".55"/><ellipse cx="200" cy="200" rx="175" ry="96" fill="${C.weiss}" opacity=".28"/>`, {}, root, '0 0 400 400', 640, 640);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 900, 900);
  const glow = svg('', {}, root, '0 0 400 400', 900, 900);
  const l1 = pill(root, 'Kollagen', { x: 130, y: 990 });
  const l2 = pill(root, 'Hyaluronsäure', { x: 300, y: 1090, bg: C.weiss, color: S });
  const l3 = pill(root, 'Vitamin E', { x: 600, y: 1190 });
  return (t) => {
    pre.update(t + .5); fadeOut(pre.node, t, D * .42);
    head.update(t);
    const y = 720 + Math.sin(t * .9) * 6;
    const g = .5 + .5 * Math.sin(t * 1.6 - 1.5);
    place(halo, 540, y, 1 + g * .06, 0, .6 + .4 * g);
    place(tape, 540, y, 1, -2 + Math.sin(t * .7) * 1);
    glow.querySelector('svg').innerHTML = `<g transform="translate(200 200)"><rect x="-92" y="-34" width="184" height="68" rx="34" fill="${C.weiss}" opacity="${g * .35}"/>
      <rect x="-104" y="-46" width="208" height="92" rx="46" fill="none" stroke="${C.beere}" stroke-width="3" stroke-dasharray="8 10" opacity="${.3 + g * .5}"/></g>`;
    place(glow, 540, y, 1, -2 + Math.sin(t * .7) * 1);
    fadeUp(l1, t, D * .1, .8, -3); fadeUp(l2, t, D * .22, .8, 2); fadeUp(l3, t, D * .34, .8, -2);
  };
}};

// s7: Klick – die Lampe geht aus, Sterne bleiben
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur, tc = D * .38;
  const warm = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.nachtHell }, root);
  const stars = svg([[80, 80, 1], [260, 40, .7], [430, 110, 1.1], [610, 50, .8], [760, 130, 1], [180, 200, .6], [520, 230, .7], [860, 30, .6]]
    .map(([x, y, s]) => ART.star(x, y, s)).join(''), {}, root, '0 0 900 260', 900, 260);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 190, 190);
  const lp = svg(lamp(1), {}, root, '0 0 400 520', 400, 520);
  const ns = svg(nightstand(0, true, 's7'), { left: '140px', top: '540px' }, root, '0 0 800 760', 800, 760);
  const klick = note(root, 'klick.', { x: 690, y: 430, r: -6, t0: tc, size: 92, color: C.weiss });
  return (t) => {
    const off = pr(t, tc, tc + .5, soft);
    warm.style.opacity = 1 - off;
    lp.querySelector('svg').innerHTML = lamp(1 - off);
    place(lp, 400, 420, 1);
    ns.style.filter = `brightness(${lerp(1, .72, off)})`;
    place(stars, 540, 330, 1, 0, off * (.8 + .2 * Math.sin(t * 1.5)));
    place(moon, 860, 300, 1, -10, off);
    klick.update(t);
  };
}};

// s8: Morgenlicht blendet auf, das Tape löst sich ganz langsam
SCENES.s8 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const night = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.nacht }, root);
  const sun = svg(`<circle cx="200" cy="200" r="86" fill="${CREAM}"/><circle cx="200" cy="200" r="130" fill="${CREAM}" opacity=".35"/>`, {}, root, '0 0 400 400', 300, 300);
  const pre = note(root, 'morgens, ganz langsam …', { x: 100, y: 260, r: -3, t0: .2, size: 88 });
  const head = bigText(root, 'Dieses *weiche* Gefühl.', { x: 90, y: 230, w: 900, size: 124, t0: D * .56, step: .12 });
  const face = faceNode(root);
  const sp = svg(sparkle(40, 50, 1) + sparkle(140, 20, .55) + sparkle(110, 120, .45), {}, root, '0 0 180 160', 180, 160);
  return (t) => {
    night.style.opacity = 1 - pr(t, 0, D * .3, soft);
    place(sun, 905, tw(t, 0, D * .6, 700, 560, soft), 1, 0, pr(t, 0, D * .35, soft));
    pre.update(t); pre.node.style.color = `rgb(${Math.round(lerp(255, 21, pr(t, 0, D * .3, soft)))},${Math.round(lerp(255, 16, pr(t, 0, D * .3, soft)))},${Math.round(lerp(255, 18, pr(t, 0, D * .3, soft)))})`;
    fadeOut(pre.node, t, D * .4, .3);
    head.update(t);
    const k = pr(t, D * .12, D * .55, soft);             // langsam abziehen, Drehpunkt am linken Ende
    const away = pr(t, D * .45, D * .62, soft);
    face.querySelector('svg').innerHTML = portrait(C.weiss, 8) + tapeAt(lerp(0, -32, k) - away * 10, -away * 80, 1 - away, 97);
    place(face, FACE.x, FACE.y, FACE.s);
    const s = pr(t, D * .62, D * .85, soft);
    place(sp, 820, 900, .8 + .15 * Math.sin(t * 2), t * 10, s);
  };
}};

// s9: Gute Nacht, Diva – Mond, Sterne, ein Tape schwebt
SCENES.s9 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const stars = svg([[60, 60, 1], [280, 30, .7], [520, 80, 1.1], [720, 40, .8], [160, 170, .6], [640, 180, .7]].map(([x, y, s]) => ART.star(x, y, s)).join(''), {}, root, '0 0 800 240', 860, 258);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 240, 240);
  const head = bigText(root, 'Gute Nacht, *Diva.*', { x: 90, y: 640, w: 900, size: 150, color: C.weiss, accent: C.rosa, align: 'center', t0: 0, step: .14 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 520, 520);
  return (t) => {
    head.update(t + .2);
    place(stars, 540, 340, 1, 0, .6 + .25 * Math.sin(t * 1.4));
    place(moon, 540, 470, 1, tw(t, 0, D, -16, -10, soft));
    place(tape, 540, 1120 + Math.sin(t * 1.2) * 8, 1, -4 + Math.sin(t * .8) * 2, pr(t, .2, 1, soft));
  };
}};
