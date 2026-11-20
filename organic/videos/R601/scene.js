/* R601 – Das Tiegel-Symbol auf deinem Lippenstift  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, clamp, lerp } = DT;
const { sourceCard, sendTo, qMark, coverLayout } = KIT;
const S = C.schwarz, GOLD = '#D9C4A3', GOLD2 = '#BFA57E', PAPIER = '#FFF9F4', GRAU = '#B9ADB1';
const rad = d => d * Math.PI / 180;

// ---------- kleine Helfer ----------
const g = (x, y, s, r, inner, op = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${op}">${inner}</g>`;
const layer = root => { const d = svg('', { left: '0px', top: '0px' }, root, '0 0 1080 1920', 1080, 1920); return d.firstChild; };
const handTxt = (root, txt, x, y, o = {}) => {
  const n = el('div', { left: x + 'px', top: y + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: (o.size ?? 72) + 'px', color: o.color ?? S, transform: `rotate(${o.r ?? -4}deg)`, whiteSpace: 'pre', lineHeight: 1 }, root, txt);
  return { node: n, show(k) { n.style.opacity = clamp(k * 3); n.style.clipPath = k >= 1 ? 'none' : `inset(-30% ${100 - clamp(k) * 100}% -30% -10%)`; } };
};
/** geschwungener Pfeil, k = 0..1 gezeichnet */
function arrow(x1, y1, cx, cy, x2, y2, k, col = S, w = 7) {
  const a = Math.atan2(y2 - cy, x2 - cx), h = 30;
  const p = (da) => `${x2 - Math.cos(a + da) * h} ${y2 - Math.sin(a + da) * h}`;
  return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(k)}"/>
    ${k > .95 ? `<path d="M${p(.5)} L${x2} ${y2} L${p(-.5)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` : ''}`;
}
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

// ---------- eigene Illustrationen ----------
/** Das Symbol: offener Tiegel. Box 400x400, Mitte (200,200). o: {c, fill, lid 0..1, num, m, numRot, mCol, numCol, sw} */
function jar(o = {}) {
  const c = o.c ?? S, f = o.fill ?? 'none', lid = o.lid ?? 1, sw = o.sw ?? 15;
  const txt = (o.num == null && o.m == null) ? '' : `
    <text x="146" y="312" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="92" fill="${o.numCol ?? c}" transform="rotate(${o.numRot ?? 0} 146 284)">${o.num ?? ''}</text>
    <text x="262" y="312" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="92" fill="${o.mCol ?? c}" transform="translate(262 284) scale(${o.mS ?? 1}) translate(-262 -284)">${o.m ?? ''}</text>`;
  return `<path d="M66 200 L334 200 L334 326 Q334 356 304 356 L96 356 Q66 356 66 326Z" fill="${f}" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>
    <rect x="50" y="176" width="300" height="36" rx="12" fill="${f === 'none' ? (o.bg ?? 'none') : f}" stroke="${c}" stroke-width="${sw}"/>
    <g transform="translate(${200 + lid * 22} ${148 - lid * 64}) rotate(${-lid * 14})">
      <rect x="-140" y="-30" width="280" height="54" rx="14" fill="${f === 'none' ? (o.bg ?? 'none') : f}" stroke="${c}" stroke-width="${sw}"/>
      <path d="M-96 -3 L96 -3" stroke="${c}" stroke-width="${sw * .5}" stroke-linecap="round" opacity=".35"/>
    </g>${txt}`;
}

/** Lippenstift, Mitte (0,0), Kappe oben. o: {capDy, capX, capR, noCap, bullet 0..1 (offen), col, sym, old} */
function stick(o = {}) {
  const open = o.bullet != null, b = o.bullet ?? 0, col = o.col ?? C.beere;
  const inner = open ? `
    <rect x="-40" y="-96" width="80" height="92" fill="${GOLD}"/><rect x="-40" y="-96" width="80" height="12" fill="${GOLD2}"/>
    <path d="M-31 -90 L-31 ${-128 - b * 70} L31 ${-166 - b * 70} L31 -90Z" fill="${col}"/>
    <path d="M-31 ${-128 - b * 70} L31 ${-166 - b * 70}" stroke="#fff" stroke-opacity=".3" stroke-width="6"/>
    ${o.old ? `<path d="M-31 ${-120 - b * 60} l10 8 l-6 12 l12 6 M31 ${-140 - b * 60} l-12 10 l8 12 M-4 ${-110 - b * 40} l8 14 l-10 10" fill="none" stroke="#7E2B45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : ''}` : '';
  const cap = o.noCap ? '' : `<g transform="translate(${o.capX ?? 0} ${o.capDy ?? 0}) rotate(${o.capR ?? 0} 0 -110)">
      <rect x="-52" y="-222" width="104" height="214" rx="14" fill="${S}"/>
      <rect x="-34" y="-200" width="11" height="168" rx="5.5" fill="#fff" opacity=".17"/>
      <rect x="-52" y="-30" width="104" height="22" fill="#3a2e33"/>
    </g>`;
  return `${inner}
    <rect x="-52" y="12" width="104" height="208" rx="12" fill="${S}"/>
    <rect x="-34" y="34" width="11" height="160" rx="5.5" fill="#fff" opacity=".17"/>
    <rect x="-54" y="-10" width="108" height="28" rx="5" fill="${GOLD}"/><rect x="-54" y="8" width="108" height="6" fill="${GOLD2}"/>
    ${cap}
    ${o.sym ? `<ellipse cx="0" cy="220" rx="52" ry="19" fill="${PAPIER}" stroke="${S}" stroke-width="5"/>
      <g transform="translate(0 221) scale(.13 .075) translate(-200 -230)">${jar({ sw: 34 })}</g>` : ''}`;
}

/** Hand, Drehpunkt (0,0) = dort, wo die Finger den Stift halten. Arm kommt von unten rechts. */
function handBack() {
  const fin = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.hautDunkel}" stroke-width="${w + 7}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.haut}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<path d="M400 500 L760 1010" stroke="${C.weiss}" stroke-width="250" stroke-linecap="butt"/>
    <path d="M400 500 L760 1010" stroke="${C.rosaTief}" stroke-width="250" stroke-dasharray="14 34" opacity=".55"/>
    <path d="M298 572 L502 428" stroke="${S}" stroke-width="9" stroke-linecap="round"/>
    <path d="M190 200 L420 530" stroke="${C.haut}" stroke-width="170" stroke-linecap="round"/>
    <ellipse cx="150" cy="130" rx="138" ry="118" transform="rotate(38 150 130)" fill="${C.haut}"/>
    ${fin(120, 10, -92, -58, 62)}${fin(104, 66, -100, 8, 62)}`;
}
function handFront() {
  const fin = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.hautDunkel}" stroke-width="${w + 7}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.haut}" stroke-width="${w}" stroke-linecap="round"/>`;
  const nail = (x, y, r, w = 34, h = 40) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w / 2.2}" transform="translate(${x} ${y}) rotate(${r})" fill="${C.beere}"/>`;
  return `${fin(196, 250, 96, 168, 58)}${fin(150, 196, 40, 118, 60)}
    ${fin(190, 96, -26, 40, 72)}${nail(-34, 37, -72, 40, 46)}
    <path d="M150 150 Q190 190 240 200" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
}
/** Hand hält Stift. th = Drehung des Stifts in Grad (0 = Kappe oben, 180 = Boden oben) */
const holding = (x, y, s, th, stickO = {}, extra = '') => g(x, y, s, 0, handBack() + `<g transform="rotate(${th})">${stick(stickO)}${extra}</g>` + handFront());

/** Lupe: Glas-Mitte (0,0), Radius R, Griff in Richtung deg */
function lupe(R, deg = 40, inner = '', glass = C.rosaHell) {
  const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
  return `<path d="M${c * (R + 6)} ${s * (R + 6)} L${c * (R + 190)} ${s * (R + 190)}" stroke="${S}" stroke-width="44" stroke-linecap="round"/>
    <path d="M${c * (R + 70)} ${s * (R + 70)} L${c * (R + 176)} ${s * (R + 176)}" stroke="${C.beere}" stroke-width="20" stroke-linecap="round"/>
    <circle r="${R}" fill="${glass}" stroke="${S}" stroke-width="22"/>
    ${inner}
    <path d="M${-R * .62} ${-R * .3} A${R * .7} ${R * .7} 0 0 1 ${-R * .22} ${-R * .66}" fill="none" stroke="#fff" stroke-width="${R * .07}" stroke-linecap="round" opacity=".9"/>`;
}

function clock(r, deg, o = {}) {
  const c = o.c ?? S, a = rad(deg - 90), b = rad(deg / 12 - 40);
  return `<circle r="${r}" fill="${o.fill ?? C.weiss}" stroke="${c}" stroke-width="${r * .11}"/>
    ${[0, 90, 180, 270].map(d => `<path d="M0 ${-r * .82} L0 ${-r * .68}" transform="rotate(${d})" stroke="${c}" stroke-width="${r * .07}" stroke-linecap="round"/>`).join('')}
    <path d="M0 0 L${Math.cos(b) * r * .42} ${Math.sin(b) * r * .42}" stroke="${c}" stroke-width="${r * .1}" stroke-linecap="round"/>
    <path d="M0 0 L${Math.cos(a) * r * .66} ${Math.sin(a) * r * .66}" stroke="${o.hand ?? c}" stroke-width="${r * .08}" stroke-linecap="round"/>
    <circle r="${r * .08}" fill="${c}"/>`;
}

/** Abreißkalender, Mitte (0,0), 200 breit. flip = fortlaufend (Blätter) */
function calendar(flip = 0) {
  const k = flip % 1, n = Math.floor(flip);
  const page = (sy, fill) => `<g transform="translate(0 -52) scale(1 ${sy})"><rect x="-92" y="0" width="184" height="150" rx="6" fill="${fill}" stroke="${S}" stroke-width="6"/></g>`;
  const dots = Array.from({ length: 15 }, (_, i) => `<circle cx="${-60 + (i % 5) * 30}" cy="${-8 + Math.floor(i / 5) * 34}" r="7" fill="${(i + n) % 7 === 3 ? C.beere : '#E3D6DA'}"/>`).join('');
  return `<rect x="-100" y="-100" width="200" height="206" rx="12" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    ${dots}
    ${k > 0 && k < 1 ? page(Math.cos(k * Math.PI / 2 * 1.9), k < .53 ? C.weiss : '#EADFE2') : ''}
    <path d="M-100 -52 L-100 -88 Q-100 -100 -88 -100 L88 -100 Q100 -100 100 -88 L100 -52Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-50 -118 L-50 -84 M50 -118 L50 -84" stroke="${S}" stroke-width="10" stroke-linecap="round"/>`;
}

// =====================================================================
// s1 – Hook: Hand dreht den Lippenstift um, Lupe fährt aufs Symbol
SCENES.s1 = { bg: C.rosa, build(root) {
  const L = layer(root);
  const hook = bigText(root, 'Dieses *Symbol* auf deinem Lippenstift ignorierst du seit Jahren.', { x: 80, y: 208, w: 900, size: 94, lh: 1.04 });
  hook.update(9);
  const PX = 440, PY = 1090, SC = 1.15;
  return (t) => {
    const th = tw(t, 0, 1.35, 62, 197, ease.inOutCubic) + noise(t, 3) * 1.6;
    const px = PX + noise(t, 1) * 5, py = PY + noise(t, 2) * 6 - tw(t, 0, 1.3, -14, 0);
    const bx = px + SC * (-220 * Math.sin(rad(th))), by = py + SC * (220 * Math.cos(rad(th)));
    // Blinken am Boden
    let blink = '';
    for (let i = 0; i < 2; i++) { const k = ((t * 1.25 + i * .5) % 1); blink += `<circle cx="${bx}" cy="${by}" r="${34 + k * 70}" fill="none" stroke="${C.weiss}" stroke-width="${9 * (1 - k)}" opacity="${(1 - k) * (1 - pr(t, 1.9, 2.3))}"/>`; }
    // Lupe
    const m = pr(t, 1.45, 2.3, ease.inOutCubic);
    const lx = lerp(838 + noise(t, 7) * 8, bx + 6, m), ly = lerp(760 + noise(t, 8) * 8 + tw(t, 0, 1.4, 0, -20), by - 4, m);
    const R = tw(t, 2.2, 2.8, 118, 176, ease.outBack);
    const zoom = tw(t, 3.85, 4.3, 1, 5.5, ease.inCubic);
    const sIn = pr(t, 2.25, 2.75, ease.outBack);
    const sym = sIn > 0 ? g(0, 6, .56 * sIn * (R / 176), noise(t, 5) * 2, `<g transform="translate(-200 -215)">${jar({ lid: 1, num: '?', m: 'M', numRot: Math.sin(t * 6) * 10, mCol: GRAU })}</g>`) : '';
    L.innerHTML = g(px, py, SC, 0, handBack() + `<g transform="rotate(${th})">${stick({ sym: 1 })}</g>` + handFront()) + blink
      + g(lx, ly, zoom, 0, lupe(R, lerp(-38, 32, m), sym));
  };
}};

// =====================================================================
// s2 – Blick durch die Lupe: offener Tiegel mit einer Zahl
SCENES.s2 = { bg: C.weiss, build(root) {
  const L = layer(root);
  const head = bigText(root, 'Kennst du *das?*', { x: 80, y: 214, size: 128, t0: .15, step: .08 });
  const n1 = handTxt(root, 'offener Tiegel', 600, 396, { size: 78, r: -5 });
  const n2 = handTxt(root, 'und eine Zahl', 90, 1196, { size: 78, r: -3 });
  return (t) => {
    head.update(t); n1.show(pr(t, 1.5, 2.0)); n2.show(pr(t, 2.55, 3.0));
    const sc = tw(t, 0, .55, 1.9, 1, ease.outCubic);
    const lid = pr(t, 1.25, 1.9, ease.outBack) + Math.sin(t * 2.4) * .04;
    const numS = 1 + .1 * Math.sin(t * 5) * pr(t, 2.3, 2.7);
    const sym = `<g transform="translate(-235 -290) scale(1.18)">${jar({ lid, bg: C.rosaHell, num: '?', m: 'M', numRot: Math.sin(t * 5.2) * 13, numCol: C.beere, mCol: GRAU })}</g>`;
    L.innerHTML = g(500 + noise(t, 2) * 5, 850 + noise(t, 4) * 5, sc, 0, lupe(338, 43, g(0, 0, numS > 1 ? 1 : 1, 0, sym)))
      + arrow(640, 480, 560, 520, 566, 596, pr(t, 1.7, 2.1))
      + arrow(250, 1190, 260, 1060, 390, 968, pr(t, 2.75, 3.15));
  };
}};

// =====================================================================
// s3 – drei Vermutungen, alle falsch
SCENES.s3 = { bg: C.rosaHell, build(root) {
  const mk = (txt, x, y, t0) => { const b = bigText(root, txt, { x, y, w: 900, size: 112, t0, step: 0 }); return b; };
  const w1 = mk('Recycling?', 80, 210, .05), w2 = mk('Vegan?', 80, 326, 1.08), w3 = mk('Größe?', 470, 326, 1.93);
  const strikes = layer(root);
  const recycle = `<g transform="translate(200 200)" fill="none" stroke="${S}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
    ${[0, 120, 240].map(d => `<g transform="rotate(${d})"><path d="M-78 -66 A102 102 0 0 1 78 -66"/><path d="M40 -98 L80 -64 L92 -114" /></g>`).join('')}</g>`;
  const leaf = `<path d="M92 300 C70 170 150 80 310 78 C320 230 240 318 92 300Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="14" stroke-linejoin="round"/>
    <path d="M70 336 C120 260 190 190 262 132 M150 246 L156 190 M150 246 L212 250" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round"/>`;
  const tape = `<path d="M196 262 L356 262 L356 312 L196 312" fill="${C.weiss}" stroke="${S}" stroke-width="13" stroke-linejoin="round"/>
    ${[236, 268, 300, 332].map((x, i) => `<path d="M${x} 262 L${x} ${i % 2 ? 292 : 282}" stroke="${S}" stroke-width="8"/>`).join('')}
    <rect x="52" y="96" width="216" height="216" rx="44" fill="${C.beere}" stroke="${S}" stroke-width="14"/>
    <circle cx="160" cy="204" r="56" fill="${C.weiss}" stroke="${S}" stroke-width="12"/><circle cx="160" cy="204" r="12" fill="${S}"/>`;
  const cards = [
    { art: recycle, x: 276, y: 770, r: -5, t0: .1, out: 3.75, stay: true },
    { art: leaf, x: 792, y: 716, r: 4, t0: 1.1, out: 3.0 },
    { art: tape, x: 560, y: 1120, r: -2, t0: 1.95, out: 3.3 },
  ].map((c, i) => {
    const card = el('div', { left: '0px', top: '0px', width: '360px', height: '380px', background: PAPIER, border: `5px solid ${S}`, borderRadius: '8px', boxShadow: `14px 16px 0 ${C.rosa}` }, root);
    el('div', { left: '110px', top: '-30px', width: '140px', height: '52px', background: C.rosaTief, opacity: .9, transform: `rotate(${i % 2 ? 4 : -4}deg)` }, card);
    svg(c.art, { left: '50px', top: '62px' }, card, '0 0 400 400', 260, 260);
    const x = svg('', { left: '0px', top: '0px' }, card, '0 0 360 380', 360, 380);
    const q = qMark(card, { x: 322, y: 344, size: 104, t0: c.t0 + .2 });
    return { ...c, card, x: c.x, cross: x.firstChild, q };
  });
  const nein = handTxt(root, 'Nein.', 590, 1030, { size: 180, color: C.beere, r: -8 });
  return (t) => {
    w1.update(t); w2.update(t); w3.update(t);
    cards.forEach((c, i) => {
      const k = pr(t, c.t0, c.t0 + .45, ease.outBack), o = pr(t, c.out + .25, c.out + .85, ease.inCubic);
      const xk = pr(t, c.out, c.out + .28);
      c.cross.innerHTML = `<path d="M54 60 L306 322" stroke="${C.beere}" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(xk * 2)}"/>
        <path d="M306 60 L54 322" stroke="${C.beere}" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(xk * 2 - 1)}"/>`;
      c.q.update(t);
      const fall = c.stay ? 0 : o;
      const big = c.stay ? pr(t, 4.0, 4.6, ease.inOutCubic) : 0;
      place(c.card, c.x + big * 110, c.y + big * 90 + (1 - k) * 90 + fall * 1800, lerp(.6, 1, k) * (1 + big * .3), c.r + (1 - k) * 10 + fall * (i % 2 ? 38 : -30) + Math.sin(t * 1.7 + i * 2) * 1.2 + (c.stay ? pr(t, 4.0, 4.4, ease.outBack) * -4 : 0), clamp((t - c.t0) / .12));
    });
    const sk = (x1, x2, y, t0) => `<path d="M${x1} ${y} L${x2} ${y - 8}" stroke="${C.beere}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - pr(t, t0, t0 + .3)}"/>`;
    strikes.innerHTML = sk(70, 640, 276, 3.75) + sk(70, 430, 392, 3.0) + sk(460, 830, 392, 3.3);
    nein.show(pr(t, 4.35, 4.7));
  };
}};

// =====================================================================
// s4 – Aha: M wie Monate, ab dem ersten Öffnen
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const L = layer(root);
  const word = el('div', { left: '80px', top: '196px', fontFamily: F.display, fontSize: '208px', lineHeight: 1, letterSpacing: '-3px', whiteSpace: 'nowrap', color: C.weiss }, root);
  const M = el('span', { position: 'relative', display: 'inline-block', color: C.rosa, transformOrigin: '50% 60%' }, word, 'M');
  const rest = el('span', { position: 'relative', display: 'inline-block', verticalAlign: 'top' }, word, 'onate');
  const sub = el('div', { left: '90px', top: '418px', fontFamily: F.sans, fontWeight: 600, fontSize: '62px', color: C.weiss, whiteSpace: 'nowrap' }, root, 'nach dem ersten Öffnen');
  const src = sourceCard(root, { name: 'EU-Kosmetikverordnung 1223/2009, Art. 19', x: 70, y: 1236, t0: 6.3, dark: true, size: 34 });
  const light = m => m.split(`fill="${S}"`).join(`fill="${C.rosa}"`);
  return (t) => {
    // M leuchtet im Tiegel auf, springt nach oben, klappt zu „Monate“ aus
    const glow = pr(t, 1.0, 1.35, ease.outBack), fly = pr(t, 1.75, 2.35, ease.inOutCubic);
    const mk = pr(t, 1.75, 2.3, ease.outBack);
    M.style.opacity = clamp((t - 1.75) / .2); M.style.transform = `translate(${(1 - fly) * 458}px, ${(1 - fly) * 540}px) scale(${lerp(.6, 1, mk)}) rotate(${(1 - fly) * -14}deg)`;
    const un = pr(t, 2.35, 3.0, ease.outCubic);
    rest.style.clipPath = `inset(-10% ${100 - un * 104}% -20% 0)`; rest.style.opacity = un > 0 ? 1 : 0;
    sub.style.opacity = pr(t, 3.3, 3.7); sub.style.transform = `translateY(${tw(t, 3.3, 3.8, 24, 0)}px)`;
    src.update(t);
    const mv = pr(t, 3.0, 3.7, ease.inOutCubic);
    const jx = lerp(540, 262, mv) + noise(t, 3) * 4, jy = lerp(740, 800, mv) + noise(t, 5) * 4;
    const pulse = 1 + .32 * Math.sin(clamp((t - 1.0) / .8) * Math.PI) + .05 * Math.sin(t * 3) * (t > 2 ? 1 : 0);
    const nk = pr(t, .5, 1.0);
    const noteS = `<g opacity="${nk}"><text x="196" y="462" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="62" fill="${C.rosa}" transform="rotate(-4 196 462)">nur ein Beispiel</text>
      <path d="M96 420 Q84 392 112 372" fill="none" stroke="${C.rosa}" stroke-width="6" stroke-linecap="round"/><path d="M94 378 L113 371 L114 392" fill="none" stroke="${C.rosa}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    const J = g(jx, jy, lerp(1.5, .98, mv) * tw(t, 0, .5, .8, 1, ease.outBack), -3, `<g transform="translate(-200 -215)">${jar({ c: C.weiss, lid: 1 + Math.sin(t * 2) * .05, num: '12', m: 'M', mCol: glow > 0 ? C.rosa : C.weiss, mS: pulse })}${noteS}</g>`);
    // Lippenstift: Kappe springt ab
    const pop = pr(t, 4.25, 4.75, ease.outBack), hang = Math.sin(t * 2.2) * 6;
    const lines = [-58, -24, 14, 50].map(d => `<path d="M${Math.sin(rad(d)) * 86} ${-120 - Math.cos(rad(d)) * 40} L${Math.sin(rad(d)) * 146} ${-120 - Math.cos(rad(d)) * 100}" stroke="${C.weiss}" stroke-width="9" stroke-linecap="round" opacity="${clamp(1 - Math.abs(t - 4.5) / .35)}"/>`).join('');
    const st = g(600, 900, tw(t, 3.5, 3.95, 0, 1, ease.outBack), -3, light(stick({ bullet: pop * .9, capDy: -pop * 110 + hang * pop, capX: pop * 120, capR: pop * 30 })) + lines);
    const cal = g(840, 1010, tw(t, 4.9, 5.3, 0, 1, ease.outBack) * 1.0, 5, calendar(t > 5.3 ? (t - 5.3) * 1.6 : 0));
    L.innerHTML = J + st + cal;
  };
}};

// =====================================================================
// s5 – ungeöffnet über 30 Monate: deshalb kein Datum
SCENES.s5 = { bg: C.rosa, build(root) {
  const L = layer(root);
  const l0 = handTxt(root, 'ungeöffnet', 86, 222, { size: 84, r: -3 });
  const flag = el('div', { left: '0px', top: '0px', padding: '10px 26px 16px', background: S, color: C.rosa, fontFamily: F.display, fontSize: '70px', lineHeight: 1, whiteSpace: 'nowrap', borderRadius: '6px', transformOrigin: '20% 100%' }, root, '30 Monate');
  const head = bigText(root, 'Kein Datum? *Deshalb.*', { x: 80, y: 1196, w: 940, size: 86, t0: 4.5, step: .16 });
  const tag = el('div', { left: '0px', top: '0px', width: '440px', height: '230px', background: PAPIER, border: `5px solid ${S}`, borderRadius: '8px', boxShadow: `12px 14px 0 ${C.rosaTief}` }, root);
  el('div', { left: '34px', top: '22px', fontFamily: F.sans, fontWeight: 700, fontSize: '46px', color: S }, tag, 'Datum:');
  el('div', { left: '34px', top: '104px', width: '370px', height: '90px', border: `5px dashed ${GRAU}`, borderRadius: '6px' }, tag);
  const tagX = svg('', { left: '0px', top: '0px' }, tag, '0 0 440 230', 440, 230).firstChild;
  const X0 = 110, X1 = 950, Y = 420, XF = 690;
  return (t) => {
    l0.show(pr(t, .1, .6)); head.update(t);
    const k = pr(t, .4, 3.6, ease.inOutSine), x = lerp(X0, X1, k);
    const ticks = Array.from({ length: 13 }, (_, i) => { const tx = X0 + i * 58; return tx < x && tx < XF + 10 ? `<path d="M${tx} ${Y - 16} L${tx} ${Y + 16}" stroke="${S}" stroke-width="7" stroke-linecap="round"/>` : ''; }).join('');
    const line = `<path d="M${X0} ${Y} L${Math.min(x, XF)} ${Y}" stroke="${S}" stroke-width="12" stroke-linecap="round"/>`
      + (x > XF ? `<path d="M${XF} ${Y} L${x} ${Y}" stroke="${S}" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 28"/>` : '')
      + `<path d="M${x - 26} ${Y - 26} L${x + 6} ${Y} L${x - 26} ${Y + 26}" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    const fk = pr(t, 2.55, 3.0, ease.outBack);
    const pole = fk > 0 ? `<path d="M${XF} ${Y + 24} L${XF} ${Y - 60 * fk}" stroke="${S}" stroke-width="10" stroke-linecap="round"/><circle cx="${XF}" cy="${Y}" r="15" fill="${C.beere}" stroke="${S}" stroke-width="6"/>` : '';
    flag.style.opacity = clamp((t - 2.55) / .12);
    flag.style.left = (XF - 60) + 'px'; flag.style.top = (Y - 60 - 96) + 'px'; flag.style.transform = `scale(${fk}) rotate(${-3 + Math.sin(t * 2.4) * 1.6}deg)`;
    // Regal
    const sway = Math.sin(t * 1.6) * 1.2;
    const shelf = `<path d="M70 1076 L1010 1076" stroke="${S}" stroke-width="16" stroke-linecap="round"/>
      <path d="M150 1084 L150 1128 M930 1084 L930 1128" stroke="${S}" stroke-width="12" stroke-linecap="round"/>`
      + g(238, 850, 1, sway, stick({}))
      + `<g transform="translate(396 1068)"><rect x="-60" y="-78" width="120" height="78" rx="14" fill="${C.rosaTief}" stroke="${S}" stroke-width="7"/><rect x="-68" y="-112" width="136" height="40" rx="10" fill="${S}"/></g>`
      + (pr(t, 3.3, 3.6) > 0 ? '' : '');
    // Datumsfeld: durchgestrichen, vom Symbol ersetzt
    const sk = pr(t, 4.55, 4.9), jk = pr(t, 5.25, 5.7, ease.outBack);
    place(tag, 722, 860 + tw(t, 0, .5, 30, 0), 1, 3 + Math.sin(t * 1.3) * .8, clamp(t / .25));
    tagX.innerHTML = `<path d="M22 196 L418 100" stroke="${C.beere}" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - sk}"/>`
      + (jk > 0 ? g(338, 66, .5 * jk, 8, `<circle r="170" fill="${C.weiss}" stroke="${S}" stroke-width="12"/><g transform="scale(.68) translate(-200 -222)">${jar({ num: '?', m: 'M', numCol: C.beere, numRot: Math.sin(t * 5) * 10 })}</g>`) : '');
    L.innerHTML = line + ticks + pole + shelf;
  };
}};

// =====================================================================
// s6 – Die Uhr läuft ab dem Öffnen, nicht ab dem Kauf
SCENES.s6 = { bg: C.weiss, build(root) {
  const L = layer(root);
  const head = bigText(root, 'Die Uhr läuft ab dem *Öffnen.*', { x: 80, y: 212, w: 900, size: 116, t0: .1, step: .07 });
  const kauf = handTxt(root, 'Kauf', 178, 1150, { size: 110, r: -5 });
  const offen = handTxt(root, 'Öffnen', 640, 1150, { size: 110, r: -3, color: C.beere });
  return (t) => {
    head.update(t); kauf.show(pr(t, .3, .7)); offen.show(pr(t, 1.3, 1.7));
    const rows = [0, 1, 2, 3, 4].map(i => `<path d="M-84 ${-70 + i * 44} L${[10, 34, -6, 22, 0][i]} ${-70 + i * 44}" stroke="${GRAU}" stroke-width="12" stroke-linecap="round"/><path d="M52 ${-70 + i * 44} L84 ${-70 + i * 44}" stroke="${GRAU}" stroke-width="12" stroke-linecap="round"/>`).join('');
    const bon = `<path d="M-124 -210 L124 -210 L124 196 L93 172 L62 196 L31 172 L0 196 L-31 172 L-62 196 L-93 172 L-124 196Z" fill="${PAPIER}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="-84" y="-172" width="168" height="44" rx="6" fill="${S}"/>${rows}`;
    const no = pr(t, 2.65, 3.0);
    const left = g(290, 870, tw(t, 0, .45, .85, 1, ease.outBack), -6 + Math.sin(t * 1.4) * 1, bon, lerp(1, .55, pr(t, 2.9, 3.3)))
      + g(140, 676, .9, 0, clock(96, 120, { c: '#8A7C81', fill: '#F1EAEC' }), 1)
      + `<path d="M110 640 L440 1110" stroke="${C.beere}" stroke-width="20" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - no}"/>`;
    const pop = pr(t, 1.2, 1.7, ease.outBack);
    const run = t > 1.45 ? (t - 1.45) * 150 : 0;
    const lines = [-52, -18, 18].map(d => `<path d="M${Math.sin(rad(d)) * 86} ${-120 - Math.cos(rad(d)) * 40} L${Math.sin(rad(d)) * 146} ${-120 - Math.cos(rad(d)) * 100}" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" opacity="${clamp(1 - Math.abs(t - 1.45) / .35)}"/>`).join('');
    const right = g(700, 880, tw(t, .2, .65, .8, 1, ease.outBack), 3, stick({ bullet: pop * .9, capDy: -pop * 215, capX: -pop * 165, capR: -pop * 42 }) + lines, clamp((t - .2) / .15))
      + g(878, 720, .9 * (1 + .06 * Math.sin(clamp((t - 1.45) / .4) * Math.PI)), 0, clock(104, run, { hand: C.beere }), clamp((t - .35) / .15));
    L.innerHTML = left + right;
  };
}};

// =====================================================================
// s7 – nachschauen, Datum draufschreiben
SCENES.s7 = { bg: C.rosaHell, build(root) {
  const L = layer(root);
  const h1 = bigText(root, 'Welche Zahl steht bei *dir?*', { x: 80, y: 212, w: 900, size: 108, t0: .1, step: .07 });
  const h2 = bigText(root, 'Datum *draufschreiben.*', { x: 80, y: 212, w: 900, size: 108, t0: 2.85, step: .1 });
  const PX = 560, PY = 960, SC = 1.5;
  return (t) => {
    h1.update(t); h2.update(t); h1.node.style.opacity = 1 - pr(t, 2.6, 2.85);
    const th = tw(t, 0, .7, 60, 90, ease.outBack) + noise(t, 2) * .8;
    const px = PX + noise(t, 1) * 4, py = PY + noise(t, 3) * 4;
    // Etikett auf dem Stift (lokal: Boden zeigt nach links)
    const wr = pr(t, 3.1, 4.9, ease.lin);
    const scribble = `<path d="M-30 174 q10 -18 14 0 t14 0 M-30 150 l0 0 M-30 136 q12 -16 14 2 t12 -2 M-30 104 l0 0 M-30 90 q10 -16 14 0 t14 0 t10 0" transform="rotate(0)" fill="none" stroke="${C.beere}" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - wr}"/>`;
    const label = `<rect x="-38" y="44" width="76" height="160" rx="6" fill="${PAPIER}" stroke="${S}" stroke-width="3"/>
      <g transform="translate(0 124) rotate(-90) translate(0 -124)"><path d="M-62 142 q7 -34 15 -6 t15 0 M-24 150 l1 0 M-12 142 q9 -34 16 -4 t14 -2 M26 150 l1 0 M36 142 q8 -32 14 -4 t12 0" fill="none" stroke="${C.beere}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - wr}"/></g>`;
    // Sprechblase mit Symbol am Boden
    const bx = px - SC * 220, by = py;
    const bk = pr(t, .7, 1.15, ease.outBack), R = 150;
    const bub = bk > 0 ? `<path d="M${bx - 4} ${by - 34} L${250} ${760}" stroke="${S}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 20" opacity="${bk}"/>`
      + g(250, 640, bk, -4, `<circle r="${R}" fill="${C.weiss}" stroke="${S}" stroke-width="12"/><g transform="translate(0 4) scale(.6) translate(-200 -222)">${jar({ num: '?', m: 'M', numCol: C.beere, numRot: Math.sin(t * 5.5) * 13 })}</g>`) : '';
    // Stift (Fineliner) schreibt
    const pk = pr(t, 2.7, 3.15, ease.outCubic), pout = pr(t, 5.0, 5.4);
    const tipx = px - SC * lerp(190, 60, wr) , tipy = py + 18 + Math.sin(t * 22) * 9 * (wr > 0 && wr < 1 ? 1 : 0);
    const pen = g(tipx + (1 - pk) * 300 + pout * 80, tipy - (1 - pk) * 420 - pout * 120, 1, 32, `<path d="M0 0 L-12 -40 L12 -40Z" fill="${S}"/><rect x="-17" y="-330" width="34" height="292" rx="8" fill="${C.beere}" stroke="${S}" stroke-width="5"/><rect x="-17" y="-330" width="34" height="50" rx="8" fill="${S}"/>`, clamp((t - 2.7) / .15));
    L.innerHTML = g(px, py, SC, 0, handBack() + `<g transform="rotate(${th})">${stick({ sym: 1 })}${label}</g>` + handFront()) + bub + pen;
  };
}};

// =====================================================================
// s8 – ranzig oder krümelig
SCENES.s8 = { bg: C.rosa, build(root) {
  const L = layer(root);
  const h1 = bigText(root, '*Ranzig?*', { x: 80, y: 210, size: 132, t0: .25, step: 0 });
  const h2 = bigText(root, 'Krümelig?', { x: 80, y: 348, size: 132, t0: 1.25, step: 0 });
  const out = handTxt(root, 'Dann ist er\nnicht mehr gut.', 450, 1060, { size: 96, r: -4 });
  const HAIR = '#3B2529';
  const face = (sq) => `<path d="M66 262 C48 120 120 62 200 62 C280 62 352 120 334 262 C346 310 330 346 300 356 L100 356 C70 346 54 310 66 262Z" fill="${HAIR}"/>
    <ellipse cx="200" cy="228" rx="110" ry="122" fill="${C.haut}"/>
    <path d="M88 214 C80 126 144 92 208 96 C270 100 322 134 312 214 C300 168 270 146 226 150 C200 172 140 176 88 214Z" fill="${HAIR}"/>
    <path d="M132 ${178 + sq * 10} L176 ${190 + sq * 6}" stroke="${HAIR}" stroke-width="8" stroke-linecap="round"/><path d="M268 ${178 + sq * 10} L224 ${190 + sq * 6}" stroke="${HAIR}" stroke-width="8" stroke-linecap="round"/>
    <path d="M136 ${206} L170 ${218 - (1 - sq) * 6} L136 ${230}" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M264 ${206} L230 ${218 - (1 - sq) * 6} L264 ${230}" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M190 ${262 - sq * 8} Q200 ${272 - sq * 8} 212 ${262 - sq * 8}" fill="none" stroke="${C.hautDunkel}" stroke-width="6" stroke-linecap="round"/>
    <path d="M186 ${238 - sq * 4} L196 ${244 - sq * 4} M216 ${238 - sq * 4} L206 ${244 - sq * 4} M196 ${226} L206 ${226}" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round" opacity="${sq}"/>
    <ellipse cx="128" cy="266" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/><ellipse cx="272" cy="266" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <path d="M168 302 q10 -12 20 0 t20 0 t20 0" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`;
  return (t) => {
    h1.update(t); h2.update(t); out.show(pr(t, 2.7, 3.3));
    const up = pr(t, .1, 1.0, ease.outCubic);
    const lx = 300, ly = 1030, sc = 1.3;
    // Duft-Schwaden
    let waves = '';
    for (let i = 0; i < 3; i++) {
      const x0 = lx - 70 + i * 70, ph = t * 2.2 + i * 1.7, o = pr(t, .5 + i * .2, 1.0 + i * .2) * (1 - pr(t, 2.2, 2.9) * .6);
      let d = `M${x0} ${ly - 330 - up * 90}`;
      for (let j = 1; j <= 4; j++) d += ` Q${x0 + (j % 2 ? 26 : -26) + Math.sin(ph + j) * 8} ${ly - 330 - up * 90 - j * 30 + 15} ${x0 + Math.sin(ph + j * .7) * 6} ${ly - 330 - up * 90 - j * 30}`;
      waves += `<path d="${d}" fill="none" stroke="${S}" stroke-width="8" stroke-linecap="round" opacity="${o * .75}"/>`;
    }
    // Krümel
    let crumbs = '';
    for (let i = 0; i < 12; i++) {
      const per = 1.1 + (i % 4) * .17, st = 1.15 + i * .21, k = t < st ? -1 : ((t - st) / per) % 1;
      if (k < 0) continue;
      const cx = lx - 46 + ((i * 53) % 92) + Math.sin(i) * 14 * k + (i % 2 ? 40 : -40) * k, cy = ly - 230 - up * 80 + k * k * 500;
      crumbs += `<rect x="-9" y="-7" width="${12 + (i % 3) * 5}" height="${10 + (i % 2) * 5}" rx="3" transform="translate(${cx} ${cy}) rotate(${i * 40 + k * 260})" fill="${i % 3 ? C.beere : '#8E2F4C'}" opacity="${1 - clamp((k - .8) / .2)}"/>`;
    }
    const pile = [0, 1, 2, 3, 4, 5].map(i => `<rect x="${lx - 150 + i * 54 + (i % 2) * 14}" y="${ly + 290 - (i % 3) * 4}" width="${16 + (i % 3) * 5}" height="12" rx="3" transform="rotate(${i * 31} ${lx - 150 + i * 54} ${ly + 292})" fill="${i % 2 ? C.beere : '#8E2F4C'}" opacity="${pr(t, 1.9 + i * .3, 2.1 + i * .3)}"/>`).join('');
    const sq = pr(t, .7, 1.1, ease.outBack);
    const fx = 740 + pr(t, .7, 1.2) * 36, fy = 800;
    L.innerHTML = `<path d="M110 ${ly + 306} L600 ${ly + 306}" stroke="${S}" stroke-width="10" stroke-linecap="round" opacity=".25"/>`
      + waves + g(lx, ly, sc, -4 + Math.sin(t * 1.5) * .8, stick({ noCap: 1, bullet: up, old: 1 })) + crumbs + pile
      + g(fx, fy, 1.06 * tw(t, .3, .7, .7, 1, ease.outBack), 7 + sq * 6 + Math.sin(t * 9) * 1.2 * (t > 1 && t < 2.4 ? 1 : 0), `<g transform="translate(-200 -220)">${face(sq)}</g>`, clamp((t - .3) / .15));
  };
}};

// =====================================================================
// s9 – Senden an + Kommentar-Frage
SCENES.s9 = { bg: C.nacht, build(root, ctx) {
  const T2 = 4.3;
  const h1 = bigText(root, 'Für die Freundin mit *dieser* Schublade.', { x: 80, y: 210, w: 900, size: 86, color: C.weiss, accent: C.rosa, t0: .1, step: .05 });
  const h2 = bigText(root, 'Wie alt ist dein *ältester?*', { x: 80, y: 206, w: 900, size: 112, color: C.weiss, accent: C.rosa, t0: T2 + .05, step: .09 });
  const L = layer(root);
  const sheet = sendTo(root, { contacts: ['Mama', 'Lena', 'Schwester', 'Jule'], pick: 3, t0: 1.15, top: 1050 });
  const chips = [
    { txt: 'Unter einem Jahr', ch: 'A', x: 410, y: 1120, r: -3, t0: 6.3, w: 600 },
    { txt: 'Über drei', ch: 'B', x: 640, y: 1284, r: 2.5, t0: 7.75, w: 430 },
    { txt: 'Lieber geheim', ch: 'C', x: 420, y: 1446, r: -1.5, t0: 8.65, w: 530 },
  ].map(c => {
    const d = el('div', { left: '0px', top: '0px', width: c.w + 'px', height: '124px', background: C.rosaHell, border: `5px solid ${S}`, borderRadius: '8px', boxShadow: `10px 12px 0 ${C.beere}`, fontFamily: F.sans, fontWeight: 700, fontSize: '58px', lineHeight: '108px', color: S, paddingLeft: '116px', whiteSpace: 'nowrap' }, root, c.txt);
    const q = qMark(d, { x: 58, y: 57, size: 80, char: c.ch, t0: 0 }); q.update(9); q.node.style.transform = 'rotate(-6deg)';
    return { ...c, d };
  });
  // Schublade voller Lippenstifte
  const cols = [S, C.rosaTief, C.beere, C.weiss, S, GOLD, C.rosa, S, C.beere, C.rosaTief, C.weiss];
  const mini = (x, y, r, i, lift) => {
    const c = cols[i % cols.length];
    return `<g transform="translate(${x} ${y - lift}) rotate(${r})"><rect x="-27" y="-150" width="54" height="150" rx="8" fill="${c}" stroke="${c === S ? '#5A4A52' : S}" stroke-width="5"/><rect x="-27" y="-62" width="54" height="14" fill="${c === GOLD ? S : GOLD}"/><rect x="-16" y="-138" width="7" height="66" rx="3.5" fill="#fff" opacity="${c === C.weiss ? 0 : .25}"/></g>`;
  };
  return (t) => {
    h1.update(t); h2.update(t); h1.node.style.opacity = 1 - pr(t, T2 - .3, T2);
    sheet.update(t);
    const down = pr(t, T2 - .25, T2 + .2, ease.inCubic);
    if (down > 0) sheet.node.style.transform = `translateY(${down * 960}px)`;
    chips.forEach((c, i) => { const k = pr(t, c.t0, c.t0 + .45, ease.outBack); place(c.d, c.x, c.y + (1 - k) * 70, lerp(.7, 1, k), c.r + (1 - k) * 8 + Math.sin(t * 1.6 + i * 2) * .9, clamp((t - c.t0) / .12)); });
    const op = pr(t, .05, .75, ease.outBack);
    const DX = 540, DY = 676;
    let sticks = '';
    for (let i = 0; i < 11; i++) {
      const jump = Math.max(0, Math.sin((t - .5 - i * .09) * 5)) * 14 * clamp(1 - (t - .5) / 1.6) + Math.max(0, Math.sin(t * 1.9 + i * 1.3)) * 6;
      sticks += mini(DX - 330 + i * 66, DY + 70, [-14, 6, -4, 12, -9, 3, 15, -6, 8, -12, 5][i], i, (20 + [20, 58, 30, 70, 40, 78, 26, 62, 44, 74, 24][i] * op + jump));
    }
    const tk = pr(t, 2.2, 2.6, ease.outBack);
    const tag = g(DX + 318, DY - 92, tk, 9 + Math.sin(t * 2.3) * 3, `<path d="M-40 -8 L-76 14" stroke="${C.weiss}" stroke-width="4"/><path d="M-40 -32 L62 -32 L62 28 L-40 28 L-62 -2Z" fill="${C.weiss}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><circle cx="-38" cy="-2" r="6" fill="${S}"/><text x="14" y="12" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="36" fill="${S}">2019</text>`);
    L.innerHTML = `<rect x="${DX - 408}" y="${DY - 46}" width="816" height="130" rx="10" fill="#0E0A10" stroke="${C.rosa}" stroke-width="7"/>`
      + sticks + tag
      + `<rect x="${DX - 430}" y="${DY + 4 + op * 30}" width="860" height="150" rx="14" fill="${C.rosaTief}" stroke="${S}" stroke-width="8"/>
         <rect x="${DX - 396}" y="${DY + 34 + op * 30}" width="792" height="90" rx="8" fill="none" stroke="${S}" stroke-width="5" opacity=".35"/>
         <rect x="${DX - 70}" y="${DY + 62 + op * 30}" width="140" height="32" rx="16" fill="${S}"/>`;
  };
}};

// =====================================================================
// Cover
SCENES.cover = { bg: C.rosa, build(root) {
  const art = g(150, 236, .72, 196, stick({ sym: 1 }))
    + g(196, 96, 1, 0, lupe(88, 28, `<g transform="translate(0 4) scale(.36) translate(-200 -215)">${jar({ lid: 1, num: '?', m: 'M', numCol: C.beere, sw: 20 })}</g>`));
  coverLayout(root, { lines: ['Dieses *Symbol*', 'ignorierst du seit Jahren'], teaser: '…und es ist kein Recycling-Zeichen', art, artSize: 640, artX: 600, artY: 1060, size: 124, textY: 320, teaserY: 1400 });
}};
