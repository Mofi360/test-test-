/* R604 – Warum er bei ihr hält  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const { sourceCard, sendTo, qMark, coverLayout } = KIT;
const S = C.schwarz;
const ROT = '#C8202F', ROT_DUNKEL = '#8E1622', HAIR_A = '#3B2529', HAIR_B = '#8A4A38', GOLD = '#D8C3A5', MOND = '#F7E7C6', WARM = '#FFE7B0', KAFFEE = '#6B4A3F';

// ---------- eigene Illustrationen ----------
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

/** Freundin: Kopf + Schultern, viewBox 0 0 400 460, Mund bei (200, 292).
 *  hair: 'bob' | 'bun', eyes: open|closed|happy|wink, mouth: 'o' (trägt auf), grin 0..1, lip = Farbe, tape 0..1 */
function gal(o = {}) {
  const bun = o.hair === 'bun', hc = bun ? HAIR_B : HAIR_A, lip = o.lip ?? ROT, ey = o.eyes || 'open', look = (o.look ?? 0) * 7;
  const eye = (x, kind) => kind === 'closed'
    ? `<path d="M${x - 19} 208 Q${x} 222 ${x + 19} 208" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M${x - 20} 210 L${x - 27} 217 M${x + 20} 210 L${x + 27} 217" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`
    : kind === 'happy'
      ? `<path d="M${x - 19} 216 Q${x} 194 ${x + 19} 216" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`
      : `<ellipse cx="${x + look}" cy="210" rx="10" ry="12" fill="${S}"/><circle cx="${x + look + 3}" cy="205" r="3.5" fill="#fff"/>
         <path d="M${x - 18} 199 Q${x} 188 ${x + 18} 199" fill="none" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>`;
  const eL = ey === 'wink' ? 'open' : ey, eR = ey === 'wink' ? 'happy' : ey;
  const g = o.grin ?? 0;
  const mouth = o.mouth === 'o'
    ? `<ellipse cx="200" cy="292" rx="29" ry="19" fill="${lip}"/><ellipse cx="200" cy="293" rx="15" ry="7" fill="#6E2A3B"/>`
    : g > 0
      ? `<path d="M${164 - g * 6} ${284 - g * 2} Q200 290 ${236 + g * 6} ${284 - g * 2} Q${226 + g * 4} ${300 + g * 18} 200 ${302 + g * 20} Q${174 - g * 4} ${300 + g * 18} ${164 - g * 6} ${284 - g * 2}Z" fill="${lip}"/>
         <path d="M${170 - g * 4} 287 Q200 292 ${230 + g * 4} 287 L${226 + g * 3} ${287 + g * 9} Q200 ${293 + g * 8} ${174 - g * 3} ${287 + g * 9}Z" fill="#fff" opacity="${clamp(g * 2)}"/>`
      : `<path d="M164 289 Q184 277 200 284 Q216 277 236 289 Q226 297 200 298 Q174 297 164 289Z" fill="${lip}"/>
         <path d="M164 289 Q200 316 236 289 Q226 297 200 298 Q174 297 164 289Z" fill="${lip}"/>
         <path d="M166 289 Q200 301 234 289" fill="none" stroke="${S}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
         <ellipse cx="186" cy="302" rx="9" ry="3" fill="#fff" opacity=".4"/>`;
  const hairBack = bun
    ? `<circle cx="200" cy="64" r="50" fill="${hc}"/><path d="M176 40 Q200 26 226 44" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/><ellipse cx="200" cy="208" rx="119" ry="120" fill="${hc}"/>`
    : `<path d="M66 262 C48 120 120 62 200 62 C280 62 352 120 334 262 C346 310 330 346 300 356 L100 356 C70 346 54 310 66 262Z" fill="${hc}"/>`;
  const hairFront = bun
    ? `<path d="M88 216 C82 132 150 100 200 100 C250 100 318 132 312 216 C292 162 250 140 200 140 C150 140 108 162 88 216Z" fill="${hc}"/><path d="M200 102 L200 138" stroke="${S}" stroke-opacity=".25" stroke-width="4"/>`
    : `<path d="M88 214 C80 126 144 92 208 96 C270 100 322 134 312 214 C300 168 270 146 226 150 C200 172 140 176 88 214Z" fill="${hc}"/>`;
  const ear = bun
    ? `<circle cx="92" cy="284" r="13" fill="none" stroke="${S}" stroke-width="5"/><circle cx="308" cy="284" r="13" fill="none" stroke="${S}" stroke-width="5"/>`
    : `<circle cx="94" cy="286" r="9" fill="${C.beere}"/><circle cx="306" cy="286" r="9" fill="${C.beere}"/>`;
  return `<g>
    ${hairBack}
    <path d="M70 460 C70 396 124 366 200 366 C276 366 330 396 330 460Z" fill="${o.top || C.rosaTief}" stroke="${S}" stroke-width="5"/>
    <path d="M170 368 Q200 392 230 368" fill="none" stroke="${o.collar || C.weiss}" stroke-width="6" stroke-linecap="round"/>
    <rect x="176" y="318" width="48" height="56" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="228" rx="110" ry="122" fill="${C.haut}"/>
    ${hairFront}${ear}
    <path d="M136 176 Q156 164 176 172" fill="none" stroke="${hc}" stroke-width="7" stroke-linecap="round"/>
    <path d="M224 172 Q244 164 264 176" fill="none" stroke="${hc}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156, eL)}${eye(244, eR)}
    <path d="M197 226 C193 246 191 254 202 258" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="128" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/>
    <ellipse cx="272" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/>
    ${mouth}
    ${o.tape ? `<g opacity="${o.tape}" transform="translate(200 292) scale(.36) translate(-200 -200)">${ART.tape(true)}</g>` : ''}
  </g>`;
}

/** Hand mit Lippenstift, viewBox 0 0 160 320, Spitze bei (80, 14) */
function stickHand(sleeve = C.rosaTief) {
  return `<rect x="52" y="210" width="56" height="120" rx="20" fill="${C.haut}" stroke="${S}" stroke-width="5"/>
    <rect x="42" y="266" width="76" height="64" rx="10" fill="${sleeve}" stroke="${S}" stroke-width="5"/>
    <path d="M62 80 L62 34 L98 14 L98 80Z" fill="${ROT}"/><path d="M62 34 L98 14" stroke="#fff" stroke-opacity=".4" stroke-width="4"/>
    <rect x="58" y="78" width="44" height="30" fill="${GOLD}"/>
    <rect x="52" y="106" width="56" height="100" rx="8" fill="${S}"/>
    <ellipse cx="80" cy="186" rx="52" ry="40" fill="${C.haut}" stroke="${S}" stroke-width="5"/>
    <path d="M52 172 Q80 160 108 172 M48 190 Q80 178 112 190 M54 208 Q80 198 106 208" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round"/>`;
}
/** Lippenstift pur, viewBox 0 0 120 260, up 0..1 = herausgedreht */
function stick(up = 1) {
  const y = lerp(96, 20, up);
  return `<path d="M40 110 L40 ${y + 28} L80 ${y} L80 110Z" fill="${ROT}"/><path d="M40 ${y + 28} L80 ${y}" stroke="#fff" stroke-opacity=".4" stroke-width="5"/>
    <rect x="34" y="100" width="52" height="34" fill="${GOLD}" stroke="${S}" stroke-width="4"/>
    <rect x="26" y="132" width="68" height="118" rx="9" fill="${S}"/><rect x="26" y="132" width="68" height="18" fill="#3a2e33"/>`;
}
const MUG = c => `<path d="M30 40 L150 40 L140 170 C138 186 42 186 40 170Z" fill="${c}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M148 70 C196 70 196 140 142 140" fill="none" stroke="${S}" stroke-width="12"/>
    <ellipse cx="90" cy="40" rx="60" ry="12" fill="${KAFFEE}" stroke="${S}" stroke-width="5"/>`;
const STEAM = `<path class="s" d="M60 20 C40 -10 80 -30 60 -60 C40 -90 80 -110 60 -140" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray=".35 .65"/>
    <path class="s" d="M116 20 C96 -10 136 -30 116 -60 C96 -90 136 -110 116 -140" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray=".35 .65"/>`;
const KISS = `<g transform="translate(74 98) rotate(-12)"><path d="M-22 0 Q-10 -12 0 -5 Q10 -12 22 0 Q10 4 0 3 Q-10 4 -22 0Z" fill="${ROT}"/><path d="M-22 0 Q0 18 22 0 Q10 5 0 5 Q-10 5 -22 0Z" fill="${ROT}"/></g>`;
/** Kleeblatt, viewBox 0 0 200 240 */
const CLOVER = `<path d="M100 120 C104 170 96 200 78 228" fill="none" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
    ${[0, 90, 180, 270].map(a => `<path transform="rotate(${a + 45} 100 110)" d="M100 110 C70 96 62 60 82 48 C92 42 100 50 100 58 C100 50 108 42 118 48 C138 60 130 96 100 110Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`).join('')}`;
/** Lippenpinsel, viewBox 0 0 360 80 (liegt waagerecht, Spitze rechts) */
const BRUSH = `<rect x="6" y="30" width="210" height="20" rx="10" fill="${S}"/>
    <rect x="212" y="26" width="70" height="28" rx="4" fill="${GOLD}" stroke="${S}" stroke-width="4"/>
    <path d="M282 28 C310 26 340 34 354 40 C340 46 310 54 282 52Z" fill="${ROT}" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>`;
/** Weiches Tuch, viewBox 0 0 220 200 */
const CLOTH = `<path d="M24 50 C70 30 150 26 198 44 C206 90 204 130 192 170 C140 186 76 184 30 168 C18 126 16 90 24 50Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M40 62 C80 48 144 46 182 58 C188 94 186 126 178 156 C136 168 84 166 46 154 C36 122 34 94 40 62Z" fill="none" stroke="${C.rosaTief}" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round"/>
    <path d="M198 44 C176 60 160 62 142 50" fill="${C.rosaHell}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`;
/** Pflege-Tiegel, viewBox 0 0 220 200 */
const POT = `<rect x="36" y="92" width="148" height="92" rx="18" fill="${C.rosaTief}" stroke="${S}" stroke-width="6"/>
    <ellipse cx="110" cy="94" rx="74" ry="18" fill="${C.weiss}" stroke="${S}" stroke-width="6"/>
    <path d="M70 92 C86 80 100 100 116 88 C128 80 140 86 150 92" fill="none" stroke="${C.rosaTief}" stroke-width="6" stroke-linecap="round"/>
    <rect x="62" y="126" width="96" height="26" rx="8" fill="${C.weiss}" opacity=".75"/>`;
const DROP = (c = C.weiss) => `<path d="M50 6 C66 36 90 58 90 86 A40 40 0 0 1 10 86 C10 58 34 36 50 6Z" fill="${c}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M30 84 A20 20 0 0 0 46 106" stroke="${C.rosaTief}" stroke-width="6" fill="none" stroke-linecap="round"/>`;

const popIn = (n, t, t0, rot = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };
const front = n => { n.node.style.zIndex = 6; return n; };
const setSvg = (n, m) => { n.querySelector('svg').innerHTML = m; };
const blinkAt = (t, period = 2.6, off = 0) => ((t + off) % period) > period - .14;
/** statische/animierte Zeile(n) in Display-Schrift */
const head = (root, html, o = {}) => el('div', { left: (o.x ?? 70) + 'px', top: (o.y ?? 205) + 'px', width: (o.w ?? 940) + 'px', fontFamily: o.font ?? F.display, fontSize: (o.size ?? 96) + 'px', lineHeight: o.lh ?? 1.04, letterSpacing: '-1px', color: o.color ?? S, textAlign: o.align ?? 'left', zIndex: 6, fontWeight: o.weight ?? 400 }, root, html);
const acc = (s, c = C.beere) => `<span style="color:${c}">${s}</span>`;
const hand = (root, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: (o.size ?? 62) + 'px', color: o.color ?? S, whiteSpace: 'pre', transform: `rotate(${o.r ?? -4}deg)`, zIndex: 6, lineHeight: 1 }, root, text);

/** Sprechblase */
function bubble(parent, html, o = {}) {
  const st = { top: o.y + 'px', padding: o.pad ?? '26px 44px 32px', background: C.weiss, border: `6px solid ${S}`, borderRadius: '56px', fontFamily: o.font || F.display, fontSize: (o.size ?? 64) + 'px', lineHeight: 1.06, color: S, zIndex: 4, whiteSpace: o.w ? 'normal' : 'nowrap', letterSpacing: '-1px' };
  if (o.w) st.width = o.w + 'px';
  st.left = (o.x ?? 90) + 'px';
  const b = el('div', st, parent, html);
  const tx = o.tailX ?? 70;
  const tail = svg(`<path d="M0 0 L56 0 L-14 64Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="4" y="-9" width="48" height="11" fill="${C.weiss}"/>`,
    { top: '100%', marginTop: '-3px', left: tx + 'px' }, b, '0 0 56 64', 56, 64);
  b.style.transformOrigin = `${tx}px 110%`;
  return { node: b, update(t, t0) { const k = pr(t, t0, t0 + .4, ease.outBack); b.style.opacity = clamp((t - t0) / .1); b.style.transform = `scale(${.4 + .6 * k}) rotate(${(1 - k) * -6 - 1.5}deg)`; } };
}

/** Café-Tisch mit zwei Tassen; Tisch läuft bis unten durch */
function cafe(root, tableColor) {
  const A = svg(gal({ hair: 'bob', top: S, collar: C.rosa }), {}, root, '0 0 400 460', 400, 460);
  const B = svg(gal({ hair: 'bun', top: C.rosaTief }), {}, root, '0 0 400 460', 400, 460);
  const hnd = svg(stickHand(C.rosaTief), {}, root, '0 0 160 320', 160, 320);
  const table = el('div', { left: '0px', top: '1112px', width: '1080px', height: '820px', background: tableColor, borderTop: `9px solid ${S}` }, root);
  const mA = svg(MUG(C.weiss) + STEAM, {}, root, '0 -150 200 350', 170, 298);
  const mB = svg(MUG(C.weiss) + KISS + STEAM, {}, root, '0 -150 200 350', 170, 298);
  place(mA, 452, 1090); place(mB, 640, 1100);
  const steam = [...mA.querySelectorAll('.s'), ...mB.querySelectorAll('.s')];
  return { A, B, hnd, table, steam(t) { steam.forEach((s, i) => s.setAttribute('stroke-dashoffset', 1 - ((t * .45 + i * .3) % 1))); } };
}

// ---------- Szenen ----------
// s1: Hook. Zwei Freundinnen beim Kaffee: bei ihr sitzt das Rot, die andere zieht schon wieder nach.
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) { root.style.isolation = 'isolate';
  const c = cafe(root, C.rosa);
  head(root, `Warum hält<br>Lippenstift bei ${acc('ihr,')}<br>und bei dir nicht?`, { y: 205, size: 98 });
  const arrow = svg(`<path d="M150 10 C110 20 60 40 30 96" fill="none" stroke="${C.beere}" stroke-width="7" stroke-linecap="round"/><path d="M22 62 L28 98 L62 84" fill="none" stroke="${C.beere}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`, { left: '330px', top: '520px', zIndex: 6 }, root, '0 0 170 110', 170, 110);
  hand(root, 'zieht nach …', { x: 690, y: 566, size: 62, r: 5 });
  return (t) => {
    setSvg(c.A, gal({ hair: 'bob', top: S, collar: C.rosa, eyes: blinkAt(t, 2.4, .9) ? 'closed' : 'open', look: .7 }));
    setSvg(c.B, gal({ hair: 'bun', top: C.rosaTief, lip: C.lippeHell, mouth: 'o', eyes: blinkAt(t, 3.1) ? 'closed' : 'open', look: -.2 }));
    place(c.A, 285, 880 + Math.sin(t * 1.6) * 3, 1, -2 + Math.sin(t * 1.6) * 1.2);
    place(c.B, 790, 880, 1, 2);
    const sw = Math.sin(t * 5.2) * 22;
    place(c.hnd, 790 + 84 + sw, 942 + 120 + Math.cos(t * 5.2) * 4, 1, -35 + sw * .12);
    c.steam(t);
  };
}};

// s2: Drei Vermutungen im Zickzack – teurer Stift, Pinsel, Glück
SCENES.s2 = { bg: C.rosa, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, ts = [.05, D * .36, D * .7];
  const lux = svg(`<g transform="translate(40 30)">${stick(1)}</g>
    <path d="M100 172 C150 150 170 170 196 200" fill="none" stroke="${S}" stroke-width="4"/>
    <g transform="translate(196 196) rotate(18)"><path d="M0 0 L20 -18 L84 -18 L84 44 L20 44Z" fill="${C.weiss}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><circle cx="20" cy="13" r="5" fill="${S}"/>${sparkle(54, 13, .8, C.beere)}</g>
    ${sparkle(20, 60, .9, C.weiss)}${sparkle(170, 40, .6, C.weiss)}`, {}, root, '0 0 300 300', 330, 330);
  const brush = svg(BRUSH, {}, root, '0 0 360 80', 400, 89);
  const clover = svg(CLOVER, {}, root, '0 0 200 240', 250, 300);
  const w1 = head(root, 'Teuer', { x: 440, y: 330, w: 500, size: 150 });
  const w2 = head(root, 'Pinsel', { x: 90, y: 700, w: 520, size: 150 });
  const w3 = head(root, 'Glück', { x: 440, y: 1060, w: 500, size: 150 });
  const qs = [qMark(root, { x: 915, y: 310, size: 120, t0: ts[0] + .3 }), qMark(root, { x: 590, y: 690, size: 120, t0: ts[1] + .3, fill: C.beere }), qMark(root, { x: 905, y: 1045, size: 120, t0: ts[2] + .3 })];
  qs.forEach(q => q.node.style.zIndex = 7);
  return (t) => {
    const k = i => pr(t, ts[i], ts[i] + .45, ease.outBack), o = i => clamp((t - ts[i]) / .1);
    place(lux, 260, 430 + (1 - k(0)) * 50, .6 + .4 * k(0), -8 + Math.sin(t * 2.1) * 3, o(0));
    place(brush, 790, 800 + (1 - k(1)) * 50, .6 + .4 * k(1), -24 + Math.sin(t * 2.4 + 1) * 4, o(1));
    place(clover, 260, 1150 + (1 - k(2)) * 50, .6 + .4 * k(2), 6 + Math.sin(t * 2.2 + 2) * 5, o(2));
    popIn(w1, t, ts[0] + .1, -2); popIn(w2, t, ts[1] + .1, 2); popIn(w3, t, ts[2] + .1, -2);
    qs.forEach(q => q.update(t));
  };
}};

// s3: Lippenstift rutscht zur Seite, die Lupe zeigt, was unter der Farbe liegt
SCENES.s3 = { bg: C.weiss, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, tX = D * .44;
  const h1 = front(bigText(root, 'Oft liegt es *nicht* am Lippenstift.', { x: 70, y: 205, w: 940, size: 100, step: .05 }));
  const h2 = front(bigText(root, 'Es ist der *Untergrund.*', { x: 70, y: 205, w: 940, size: 124, t0: tX + .15, step: .09 }));
  const ls = svg(`<g transform="translate(90 20)">${stick(1)}</g>`, {}, root, '0 0 300 300', 640, 640);
  const qs = [[250, 640, 0], [840, 720, 1], [300, 1090, 2]].map(([x, y, i]) => ({ q: qMark(root, { x, y, size: 110, t0: -1, fill: i === 1 ? C.beere : S }), i }));
  const lips = svg(ART.lips(.75, ROT), {}, root, '0 0 400 400', 820, 820);
  const R = 190;
  const lens = el('div', { left: '0px', top: '0px', width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', overflow: 'hidden', background: C.lippeHell, border: `12px solid ${S}`, zIndex: 3 }, root);
  svg(`<rect width="380" height="380" fill="${C.lippeHell}"/>
    ${[40, 100, 160, 220, 280, 340].map((x, i) => `<path d="M${x} -10 C${x + 14} 100 ${x - 14} 240 ${x + (i % 2 ? 10 : -6)} 390" fill="none" stroke="${C.lippe}" stroke-width="7" stroke-linecap="round"/>`).join('')}
    <path d="M-10 250 C120 270 260 270 390 250" fill="none" stroke="${S}" stroke-opacity=".3" stroke-width="6"/>`, { left: '-12px', top: '-12px' }, lens, '0 0 380 380', 380, 380);
  const handle = svg(`<rect x="0" y="0" width="46" height="200" rx="20" fill="${S}"/>`, { zIndex: 2 }, root, '0 0 46 200', 46, 200);
  return (t) => {
    h1.update(t); h1.node.style.opacity = 1 - pr(t, tX - .1, tX + .1);
    h2.update(t);
    const m = pr(t, tX - .2, tX + .45, ease.inOutCubic);
    place(ls, lerp(540, 170, m), lerp(860, 1180, m) + Math.sin(t * 2) * 4 * (1 - m), lerp(1, .42, m), lerp(-4, -16, m));
    qs.forEach(({ q, i }) => {
      const t0 = .5 + i * .32, f = clamp((t - t0) / .7);
      q.update(t + 1);
      q.node.style.transform = `translateY(${f * f * 900}px) rotate(${f * (i % 2 ? 70 : -70) + Math.sin(t * 2.2 + i) * 5}deg)`;
      q.node.style.opacity = t > t0 + .7 ? 0 : 1;
    });
    const k = pr(t, tX + .05, tX + .55, ease.outBack);
    place(lips, 540, 850, (.5 + .5 * k), 0, clamp((t - tX - .05) / .12));
    const lk = pr(t, tX + .6, tX + 1.2, ease.outCubic);
    const lx = lerp(1300, 600, lk) + Math.sin((t - tX) * 1.5) * 150 * lk, ly = lerp(1500, 870, lk) + Math.cos((t - tX) * 1.5) * 16;
    lens.style.transform = `translate(${lx - R}px, ${ly - R}px)`; lens.style.opacity = t > tX + .55 ? 1 : 0;
    place(handle, lx + 190, ly + 190, 1, -45, t > tX + .55 ? 1 : 0);
  };
}};

// s4: Blick durch die Lupe – im Gesicht arbeiten kleine Drüsen, an der Lippe bleiben die Plätze leer. Pflege kommt von außen.
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, R = 330, CX = 540, CY = 810, tDrop = D * .7;
  const h = front(bigText(root, 'Keine *Schweißdrüsen,* kaum *Talgdrüsen.*', { x: 70, y: 205, w: 960, size: 90, step: .08 }));
  const handle = svg(`<rect x="0" y="0" width="60" height="250" rx="26" fill="${S}"/>`, {}, root, '0 0 60 250', 60, 250);
  const lens = el('div', { left: (CX - R) + 'px', top: (CY - R) + 'px', width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', overflow: 'hidden', background: C.weiss, border: `12px solid ${S}`, zIndex: 2 }, root);
  const coil = (x, dash) => `<path d="M${x} 302 L${x} 440 C${x - 40} 440 ${x - 40} 500 ${x} 500 C${x + 44} 500 ${x + 44} 440 ${x} 452 C${x - 26} 462 ${x - 20} 486 ${x} 482" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round" ${dash ? 'stroke-dasharray="3 14" opacity=".4"' : ''}/>`;
  const pouch = (x, dash, s = 1) => `<g transform="translate(${x} 302) scale(${s})"><path d="M0 0 L0 50 C-46 54 -52 120 -12 132 C-2 150 26 148 30 128 C62 110 44 52 8 50Z" fill="${dash ? 'none' : C.weiss}" stroke="${S}" stroke-width="${7 / s}" stroke-linejoin="round" ${dash ? 'stroke-dasharray="3 14" opacity=".4"' : ''}/></g>`;
  const sc = (x, k, m) => `<g transform="translate(${x} 300) scale(${k}) translate(${-x} -300)">${m}</g>`;
  const inner = svg(`
    <rect x="0" y="300" width="330" height="360" fill="${C.haut}"/><rect x="330" y="300" width="330" height="360" fill="${C.lippeHell}"/>
    ${sc(125, 1.3, coil(125))}${pouch(248, false, 1.15)}
    ${pouch(400, true, 1.15)}${sc(520, 1.3, coil(520, true))}
    <path class="shL" d="M30 292 L318 292" stroke="${C.weiss}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path class="shR" d="M650 292 L346 292" stroke="${C.weiss}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M0 300 L660 300" stroke="${S}" stroke-width="7"/>
    <path d="M330 150 L330 660" stroke="${S}" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round"/>
    <g class="dr"></g>`, { left: '-12px', top: '-12px' }, lens, '0 0 660 660', 660, 660);
  const shL = inner.querySelector('.shL'), shR = inner.querySelector('.shR'), dr = inner.querySelector('.dr');
  const lA = hand(lens, 'Gesicht', { x: 105, y: 150, size: 70, r: -4 });
  const lB = hand(lens, 'Lippe', { x: 380, y: 150, size: 70, r: 3, color: C.beere });
  const drop = svg(DROP(C.weiss), { zIndex: 5 }, root, '0 0 100 130', 130, 169);
  const src = sourceCard(root, { name: 'dm-Ratgeber „Trockene Lippen“', x: 70, y: 1200, t0: 1.0, t1: D * .6 });
  src.node.style.zIndex = 6;
  const out = front(bigText(root, 'Pflege kommt *von* *außen.*', { x: 70, y: 1215, w: 940, size: 78, align: 'center', t0: tDrop + .1, step: .08 }));
  return (t) => {
    h.update(t); src.update(t); out.update(t);
    const k = pr(t, 0, .5, ease.outBack);
    lens.style.transform = `scale(${.6 + .4 * k})`;
    place(handle, CX + 285 * (.6 + .4 * k), CY + 285 * (.6 + .4 * k), 1, -45);
    // kleine Tröpfchen steigen im Gesicht aus den Poren, die Lippe bleibt leer
    const act = clamp((t - .9) / .4);
    dr.innerHTML = [125, 248].map((x, i) => [0, .5].map(ph => { const f = (t * .55 + i * .27 + ph) % 1; return `<circle cx="${x + Math.sin(f * 6 + i) * 6}" cy="${292 - f * 70}" r="${12 * (1 - f * .5)}" fill="${C.weiss}" stroke="${S}" stroke-width="4" opacity="${act * (1 - f)}"/>`; }).join('')).join('');
    shL.setAttribute('stroke-dashoffset', 1 - pr(t, 1.6, 3.2, ease.inOutSine));
    // Tropfen von außen
    const dk = pr(t, tDrop - .6, tDrop - .2, ease.outBack), fall = pr(t, tDrop, tDrop + .4, ease.inCubic);
    const dy = lerp(500, CY - R + 300 - 80, fall);
    place(drop, 800, dy + Math.sin(t * 3) * 6 * (1 - fall), dk * (1 - pr(t, tDrop + .38, tDrop + .5)), Math.sin(t * 2.5) * 5 * (1 - fall), t > tDrop - .6 ? 1 : 0);
    shR.setAttribute('stroke-dashoffset', 1 - pr(t, tDrop + .4, tDrop + 1.2, ease.outCubic));
    lB.style.transform = `rotate(3deg) scale(${1 + .06 * Math.sin(t * 3) * clamp((t - 3) / .5)})`;
  };
}};

// s5: Reihenfolge – Tuch, Pflege, dann erst Farbe. Ein Finger tippt die Schritte an.
SCENES.s5 = { bg: C.rosa, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, ts = [D * .22, D * .58, D * .78];
  const h = front(bigText(root, 'Erst Basis, dann *Farbe.*', { x: 70, y: 205, w: 940, size: 124, step: .07 }));
  const path = svg(`<path d="M250 670 C80 780 160 850 300 930 C440 1010 110 1070 250 1180" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 16"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const P = [[250, 670], [300, 930], [250, 1180]];
  const cloth = svg(CLOTH, { zIndex: 2 }, root, '0 0 220 200', 240, 218);
  const pot = svg(POT, { zIndex: 2 }, root, '0 0 220 200', 240, 218);
  const drop = svg(DROP(C.weiss), { zIndex: 3 }, root, '0 0 100 130', 70, 91);
  const ls = svg(stick(0), { zIndex: 2 }, root, '0 0 120 260', 120, 260);
  const nums = P.map(([x, y], i) => { const n = el('div', { left: (x - 175) + 'px', top: (y - 140) + 'px', width: '84px', height: '84px', borderRadius: '50%', background: S, color: C.weiss, fontFamily: F.hand, fontWeight: 700, fontSize: '66px', lineHeight: '76px', textAlign: 'center', zIndex: 4 }, root, String(i + 1)); return n; });
  const labs = [
    el('div', { left: '470px', top: '606px', fontFamily: F.sans, fontWeight: 700, fontSize: '58px', lineHeight: 1.08, color: S, zIndex: 4 }, root, 'Schüppchen<br>sanft entfernen'),
    el('div', { left: '500px', top: '890px', fontFamily: F.sans, fontWeight: 700, fontSize: '64px', color: S, zIndex: 4 }, root, 'pflegen'),
    el('div', { left: '440px', top: '1140px', fontFamily: F.sans, fontWeight: 700, fontSize: '64px', color: S, zIndex: 4 }, root, 'dann erst ' + acc('Farbe')),
  ];
  const tap = el('div', { left: '0px', top: '0px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(21,16,18,.14)', border: '5px solid rgba(21,16,18,.5)', zIndex: 7 }, root);
  return (t) => {
    h.update(t);
    // gestrichelter Weg wächst mit
    const grow = pr(t, ts[0], ts[2], ease.lin);
    path.style.clipPath = `inset(0 0 ${1920 - 670 - grow * 520}px 0)`;
    const bump = i => 1 + .12 * clamp(1 - Math.abs(t - ts[i] - .08) / .16);
    const k = i => pr(t, ts[i] - .45, ts[i] - .05, ease.outBack), o = i => clamp((t - ts[i] + .45) / .1);
    place(cloth, P[0][0] + (t > ts[0] ? Math.sin((t - ts[0]) * 7) * 14 * clamp(1 - (t - ts[0]) / 1.4) : 0), P[0][1], k(0) * bump(0), -8, o(0));
    place(pot, P[1][0], P[1][1], k(1) * bump(1), 4, o(1));
    const df = pr(t, ts[1] + .15, ts[1] + .55, ease.inCubic);
    place(drop, P[1][0], lerp(P[1][1] - 150, P[1][1] - 40, df), 1 - pr(t, ts[1] + .5, ts[1] + .6), 0, t > ts[1] - .1 ? clamp((t - ts[1] + .1) / .1) : 0);
    setSvg(ls, stick(pr(t, ts[2] + .1, ts[2] + .7, ease.outCubic)));
    place(ls, P[2][0], P[2][1], k(2) * bump(2), 8 + Math.sin(t * 2) * 2, o(2));
    nums.forEach((n, i) => { popIn(n, t, ts[i] - .4, -6); n.style.background = t > ts[i] ? C.beere : S; });
    labs.forEach((l, i) => popIn(l, t, ts[i] - .25, i === 1 ? 2 : -2));
    // Finger-Punkt wandert von Schritt zu Schritt
    let fx = 900, fy = 1300;
    P.forEach(([x, y], i) => { const m = pr(t, ts[i] - .4, ts[i], ease.inOutCubic); fx = lerp(fx, x + 90, m); fy = lerp(fy, y + 80, m); });
    const press = Math.max(...ts.map(x => clamp(1 - Math.abs(t - x) / .14)));
    tap.style.transform = `translate(${fx - 60}px, ${fy - 60}px) scale(${1 - .25 * press})`;
    tap.style.opacity = clamp((t - ts[0] + .45) / .15) * (1 - pr(t, ts[2] + .3, ts[2] + .6));
  };
}};

// s6: Abend. Das Tape legt sich auf die Lippen (kurz), dann Schwenk zum Kissen.
SCENES.s6 = { bg: C.nacht, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, tOn = .75, tPan = Math.min(4.0, D * .52);
  const pan = el('div', { left: '0px', top: '0px', width: '2160px', height: '1920px' }, root);
  // Seite 1: sie am Nachttisch
  svg(`<circle cx="170" cy="770" r="330" fill="${WARM}" opacity=".06"/><circle cx="170" cy="770" r="220" fill="${WARM}" opacity=".09"/><circle cx="170" cy="770" r="130" fill="${WARM}" opacity=".14"/>
    <rect x="164" y="800" width="12" height="270" fill="${S}"/>
    <path d="M100 700 L240 700 L276 810 L64 810Z" fill="#FFF1D6" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="40" y="1066" width="300" height="290" rx="10" fill="${C.nachtHell}" stroke="${C.rosaTief}" stroke-width="7"/>
    <line x1="40" y1="1200" x2="340" y2="1200" stroke="${C.rosaTief}" stroke-width="6"/>
    <rect x="140" y="1124" width="100" height="14" rx="7" fill="${C.rosaTief}"/><rect x="140" y="1262" width="100" height="14" rx="7" fill="${C.rosaTief}"/>
    <g transform="translate(232 980) scale(.48)">${POT}</g>
    <rect x="1620" y="470" width="300" height="250" rx="8" fill="#0B080D" stroke="${C.rosaTief}" stroke-width="10"/>
    <line x1="1770" y1="470" x2="1770" y2="720" stroke="${C.rosaTief}" stroke-width="8"/>
    <g transform="translate(1650 500) scale(.3)">${ART.moon(MOND)}</g>
    <path d="M1200 1340 L1200 880 C1200 780 1340 760 1620 760 C1900 760 2040 780 2040 880 L2040 1340Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M1150 1160 C1400 1120 1840 1120 2090 1160 L2110 1940 L1130 1940Z" fill="${C.rosa}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M1150 1160 C1400 1120 1840 1120 2090 1160 L2096 1240 C1840 1200 1400 1200 1144 1240Z" fill="${C.weiss}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`,
    { left: 0, top: 0 }, pan, '0 0 2160 1920', 2160, 1920);
  const stars = svg([[1000, 560, 1], [900, 700, .7], [1100, 820, .8], [1420, 560, 1], [2000, 520, .8], [1500, 620, .6], [2060, 700, 1]].map(([x, y, s], i) => `<g class="st">${ART.star(x, y, s * 1.3, MOND)}</g>`).join(''), { left: 0, top: 0 }, pan, '0 0 2160 1920', 2160, 1920);
  const st = [...stars.querySelectorAll('.st')];
  const she = svg(gal({ hair: 'bun', top: C.weiss, collar: C.rosaTief, lip: C.lippe }), {}, pan, '0 0 400 460', 540, 621);
  const tape = svg(ART.tape(true), {}, pan, '0 0 400 400', 194, 194);
  const pillow = svg(ART.pillow(C.weiss), {}, pan, '0 0 400 400', 640, 640);
  const sp = svg(sparkle(60, 60, 1.3, C.weiss) + sparkle(150, 26, .7, C.rosa) + sparkle(20, 130, .6, C.weiss), {}, pan, '0 0 200 170', 220, 187);
  // feste Texte
  const name = front(bigText(root, 'Diva Tape', { x: 80, y: 205, w: 900, size: 150, color: C.weiss, t0: .1, step: .1 }));
  const sub = el('div', { left: '84px', top: '388px', fontFamily: F.sans, fontWeight: 600, fontSize: '54px', color: C.rosa, zIndex: 6 }, root, 'Kollagen-Tape, über Nacht');
  const MX = 600, MY = 900 - 310.5 + 292 * 1.35;
  return (t) => {
    name.update(t); sub.style.opacity = pr(t, .7, 1.1); sub.style.transform = `translateY(${tw(t, .7, 1.2, 20, 0)}px)`;
    const p = pr(t, tPan, tPan + .9, ease.inOutCubic);
    pan.style.transform = `translateX(${-1080 * p}px)`;
    const on = pr(t, tOn, tOn + .55, ease.outCubic);
    setSvg(she, gal({ hair: 'bun', top: C.weiss, collar: C.rosaTief, lip: C.lippe, eyes: on > .95 ? 'happy' : (blinkAt(t, 2.2) ? 'closed' : 'open'), look: on < .9 ? .6 : 0 }));
    place(she, 600, 900 + Math.sin(t * 1.5) * 3, 1, Math.sin(t * 1.5) * .8);
    const arc = Math.sin(on * Math.PI) * -120;
    place(tape, lerp(960, MX, on), lerp(1180, MY, on) + arc + Math.sin(t * 1.5) * 3 * on, lerp(1.25, 1, on) * (1 + .06 * clamp(1 - Math.abs(t - tOn - .6) / .15)), lerp(-30, 0, on), clamp((t - tOn + .15) / .15));
    place(pillow, 1620, 1010 + Math.sin(t * 1.2) * 3, 1, -3);
    st.forEach((s, i) => s.setAttribute('opacity', .55 + .45 * Math.sin(t * 2.4 + i * 1.7)));
    const sk = pr(t, tPan + 1, tPan + 1.4, ease.outBack);
    place(sp, 1830, 880, sk * (.85 + Math.abs(Math.sin(t * 2.6)) * .3), t * 20, sk > 0 ? 1 : 0);
  };
}};

// s7: Zurück am Tisch – sie hält ihren Lippenstift hoch, die andere zwinkert nur.
SCENES.s7 = { bg: C.weiss, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, tL = D * .68;
  const c = cafe(root, C.rosaHell);
  c.hnd.style.zIndex = 3;
  const sp = svg(sparkle(60, 60, 1.2, C.beere) + sparkle(150, 30, .7, C.rosaTief) + sparkle(24, 130, .6, C.rosaTief), { zIndex: 3 }, root, '0 0 200 170', 200, 170);
  const bub = bubble(root, `Liegt am ${acc('teuren')}<br>Lippenstift!`, { x: 190, y: 215, size: 66, tailX: 150 });
  const lass = head(root, 'Lass sie.', { x: 500, y: 470, w: 460, size: 124, color: C.beere });
  return (t) => {
    const up = pr(t, .1, .6, ease.outBack);
    setSvg(c.hnd, stickHand(S));
    place(c.hnd, 96 + Math.sin(t * 6) * 6 * up, lerp(1250, 800, up), 1, -8 + Math.sin(t * 6) * 5 * up);
    setSvg(c.A, gal({ hair: 'bob', top: S, collar: C.rosa, eyes: 'happy', grin: .5 + .5 * up }));
    const wink = t > tL - .1 && t < tL + .7;
    setSvg(c.B, gal({ hair: 'bun', top: C.rosaTief, eyes: wink ? 'wink' : (blinkAt(t, 2.7) ? 'closed' : 'open'), look: wink ? 0 : -.8, grin: t > tL - .1 ? .35 : 0 }));
    place(c.A, 300, 880 + Math.sin(t * 6) * 2 * up, 1, -3);
    place(c.B, 790, 880, 1, 2 + (wink ? 2 : 0));
    place(sp, 190, 640, up * (.8 + Math.abs(Math.sin(t * 2.6)) * .3), t * 25, clamp((t - .3) / .1));
    bub.update(t, .45);
    popIn(lass, t, tL, -4);
    c.steam(t);
  };
}};

// s8: erst weiterschicken, dann die Frage
SCENES.s8 = { bg: C.rosa, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur, tQ = D * .5;
  const sh = sendTo(root, { contacts: ['Lena', 'Jule', 'Schwester', 'Anna'], pick: 1, t0: .35, top: 1040 });
  const h1 = front(bigText(root, 'Schick das deiner Freundin, die *ständig* *nachzieht.*', { x: 70, y: 210, w: 940, size: 96, step: .04 }));
  const plane = svg(`<path d="M10 70 L230 10 L150 170 L112 110Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/><path d="M230 10 L112 110 L104 164 L132 128" fill="${C.rosaHell}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>`, { zIndex: 5 }, root, '0 0 240 180', 240, 180);
  const trail = svg(`<path d="M40 150 C140 60 260 190 420 100" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 16"/>`, { left: '60px', top: '640px' }, root, '0 0 460 220', 460, 220);
  const und = hand(root, 'Und du?', { x: 84, y: 205, size: 92, r: -4, color: C.beere });
  const q = head(root, `Pflege, Peeling<br>oder ${acc('hoffen?')}`, { x: 70, y: 310, w: 940, size: 128 });
  const its = [svg(POT, { zIndex: 5 }, root, '0 0 220 200', 200, 182), svg(CLOTH, { zIndex: 5 }, root, '0 0 220 200', 200, 182), svg(CLOVER, { zIndex: 5 }, root, '0 0 200 240', 170, 204)];
  return (t) => {
    sh.update(t);
    h1.update(t + 1); const o1 = 1 - pr(t, tQ - .25, tQ);
    h1.node.style.opacity = o1; h1.node.style.transform = `translateY(${-(1 - o1) * 40}px)`;
    const go = pr(t, sh.tapTime, sh.tapTime + .6, ease.inCubic);
    place(plane, 640 + go * 700 + Math.sin(t * 2) * 10, 720 - go * 260 + Math.cos(t * 2.4) * 12, 1, -6 - go * 14 + Math.sin(t * 2) * 3, o1);
    trail.style.opacity = o1 * (1 - go);
    und.style.opacity = pr(t, tQ, tQ + .25); und.style.clipPath = `inset(-20px ${100 - pr(t, tQ, tQ + .4) * 100}% -20px -20px)`;
    popIn(q, t, tQ + .2, 0);
    its.forEach((n, i) => { const t0 = tQ + .55 + i * .28, k = pr(t, t0, t0 + .4, ease.outBack); place(n, 250 + i * 290, 745 - Math.abs(Math.sin((t - t0) * 2.6)) * 16 * (t > t0 ? 1 : 0), k, [-6, 5, 8][i] + Math.sin(t * 2 + i) * 3, clamp((t - t0) / .1)); });
  };
}};

// Cover
SCENES.cover = { build(root) {
  coverLayout(root, {
    lines: ['Warum hält er', 'bei *ihr*?'], teaser: '…am Lippenstift liegt es oft nicht',
    art: `<g>${gal({ hair: 'bob', top: S, collar: C.rosa, eyes: 'wink', grin: .8 })}</g>
      <g transform="translate(372 150) rotate(14) scale(.9)">${stick(1)}</g>${sparkle(360, 120, .9, C.weiss)}${sparkle(470, 250, .6, C.weiss)}`,
    artBox: '-40 0 520 460', artSize: 640, artY: 1010,
    marks: [{ x: 170, y: 800, size: 120, r: -10 }],
  });
}};
