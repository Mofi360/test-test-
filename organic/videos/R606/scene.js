/* R606 – Erst pflegen, dann Ja sagen (Braut)  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const S = C.schwarz;
const HAIR = '#3B2529', ROT = '#C41E3A', ROT_D = '#9E1830', GOLD = '#C9A86A', SEKT = '#F3DDA8', GLAS = '#DFE8EA', MOND = '#F7E7C6';
let UID = 0;
const rnd = i => { const v = Math.sin(i * 127.1 + 3.7) * 43758.5453; return v - Math.floor(v); };
const full = (root, markup) => svg(markup, { left: '0px', top: '0px' }, root, '0 0 1080 1920', 1080, 1920);
const setT = (n, ox, oy, tr, op) => { n.style.transformOrigin = `${ox}px ${oy}px`; n.style.transform = tr; if (op != null) n.style.opacity = op; };
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;
const heart = (x, y, s = 1, c = C.beere) => `<path transform="translate(${x} ${y}) scale(${s}) translate(-200 -215)" d="M200 330 C80 250 60 190 90 140 C120 95 180 105 200 150 C220 105 280 95 310 140 C340 190 320 250 200 330Z" fill="${c}"/>`;

/** Braut: Kopf + Schultern, viewBox 0 0 400 460, Mund bei (200, 292).
 *  o: eyes open|closed|happy, red 0..1 (Rot von links nach rechts), smile 0..1, veil, top dress|pj, extra (Markup vor dem Gesicht) */
function bride(o = {}) {
  const id = 'b' + (UID++), ey = o.eyes || 'open', sm = o.smile ?? 0, red = o.red ?? 0;
  const eye = (x) => ey === 'closed'
    ? `<path d="M${x - 19} 210 Q${x} 224 ${x + 19} 210" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M${x - 20} 212 L${x - 27} 219 M${x + 20} 212 L${x + 27} 219 M${x} 218 L${x} 226" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`
    : ey === 'happy'
      ? `<path d="M${x - 19} 216 Q${x} 194 ${x + 19} 216" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`
      : `<ellipse cx="${x}" cy="212" rx="10" ry="12" fill="${S}"/><circle cx="${x + 3}" cy="207" r="3.5" fill="#fff"/>
         <path d="M${x - 19} 201 Q${x} 189 ${x + 19} 201" fill="none" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
         <path d="M${x + (x < 200 ? -19 : 19)} 201 l${x < 200 ? -8 : 8} -6" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`;
  const w = sm * 7, u = sm * 5;
  const lipsP = (cu, cl) => `<path d="M${166 - w} ${288 - u} Q184 277 200 283 Q216 277 ${234 + w} ${288 - u} Q226 296 200 297 Q174 296 ${166 - w} ${288 - u}Z" fill="${cu}"/>
    <path d="M${166 - w} ${288 - u} Q200 ${316 + sm * 5} ${234 + w} ${288 - u} Q226 296 200 297 Q174 296 ${166 - w} ${288 - u}Z" fill="${cl}"/>`;
  const dress = o.top === 'pj'
    ? `<path d="M66 460 C66 398 122 368 200 368 C278 368 334 398 334 460Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="5"/>
       <path d="M168 370 L200 412 L232 370" fill="none" stroke="${C.weiss}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`
    : `<path d="M62 460 C62 402 120 372 200 372 C280 372 338 402 338 460Z" fill="${C.haut}"/>
       <path d="M150 384 Q200 418 250 384" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".7"/>
       <path d="M88 462 L88 434 Q146 398 200 438 Q254 398 312 434 L312 462Z" fill="${C.weiss}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`;
  return `<g>
    ${o.veil ? `<path d="M200 44 C104 64 40 210 14 460 L386 460 C360 210 296 64 200 44Z" fill="${C.weiss}" opacity=".86"/>
      <path d="M200 44 C104 64 40 210 14 460 M200 44 C296 64 360 210 386 460" fill="none" stroke="${S}" stroke-opacity=".22" stroke-width="4"/>
      <path d="M120 150 C90 240 70 330 60 460 M280 150 C310 240 330 330 340 460" fill="none" stroke="${C.rosa}" stroke-width="4" opacity=".8"/>` : ''}
    <circle cx="200" cy="64" r="46" fill="${HAIR}"/>
    <path d="M176 44 C190 34 214 36 226 50" fill="none" stroke="#5A3B41" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="200" cy="204" rx="118" ry="124" fill="${HAIR}"/>
    ${dress}
    <rect x="176" y="322" width="48" height="58" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="230" rx="106" ry="120" fill="${C.haut}"/>
    <path d="M90 220 C80 128 144 94 208 98 C270 102 322 136 312 220 C300 172 270 150 226 154 C200 176 140 180 90 220Z" fill="${HAIR}"/>
    ${o.veil ? [162, 181, 200, 219, 238].map((x, i) => `<circle cx="${x}" cy="${104 - Math.abs(i - 2) * -3}" r="8" fill="${C.weiss}" stroke="${S}" stroke-opacity=".3" stroke-width="2"/>`).join('') : ''}
    <circle cx="95" cy="282" r="10" fill="${C.weiss}" stroke="${S}" stroke-opacity=".35" stroke-width="3"/><circle cx="305" cy="282" r="10" fill="${C.weiss}" stroke="${S}" stroke-opacity=".35" stroke-width="3"/>
    <path d="M136 178 Q156 166 176 174" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M224 174 Q244 166 264 178" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156)}${eye(244)}
    <path d="M197 228 C193 248 191 256 202 260" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="128" cy="264" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/><ellipse cx="272" cy="264" rx="24" ry="13" fill="${C.rosaTief}" opacity=".5"/>
    ${lipsP(C.lippe, C.lippeHell)}
    <clipPath id="${id}"><rect x="${156 - w}" y="260" width="${(88 + 2 * w) * red}" height="70"/></clipPath>
    <g clip-path="url(#${id})">${lipsP(ROT_D, ROT)}</g>
    <path d="M${166 - w} ${288 - u} Q200 ${299 + sm * 3} ${234 + w} ${288 - u}" fill="none" stroke="${red > .5 ? '#7A1024' : '#9E4058'}" stroke-width="3" stroke-linecap="round"/>
    ${o.extra || ''}
  </g>`;
}
/** Hand mit Lippenstift, Spitze bei (x, y) in Braut-Koordinaten */
const handStick = (x, y, rot = 32) => `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M6 96 C30 150 60 200 110 300" fill="none" stroke="${C.haut}" stroke-width="46" stroke-linecap="round"/>
    <path d="M-9 6 L-9 30 L9 30 L9 -6Z" fill="${ROT}"/><rect x="-11" y="30" width="22" height="13" fill="#d8c3a5"/><rect x="-13" y="43" width="26" height="62" rx="4" fill="${S}"/>
    <path d="M-22 62 C-30 80 -24 112 2 118 C30 122 40 96 34 72 C30 60 22 60 18 70 L18 84 L-14 84 Z" fill="${C.haut}" stroke="${C.hautDunkel}" stroke-width="3"/>
    <path d="M-14 72 L18 72 M-12 96 L16 96" stroke="${C.hautDunkel}" stroke-width="3" stroke-linecap="round"/>
  </g>`;

// ================= s1: Braut vor dem Spiegel, Probe-Rot =================
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  // Wandkalender mit Herz
  const cells = Array.from({ length: 12 }, (_, i) => { const cx = 34 + (i % 4) * 40, cy = 96 + Math.floor(i / 4) * 40; return i === 10 ? heart(cx, cy, .16) : `<circle cx="${cx}" cy="${cy}" r="6" fill="${S}" opacity=".28"/>`; }).join('');
  const cal = svg(`<rect x="4" y="14" width="180" height="210" rx="8" fill="${C.weiss}" stroke="${S}" stroke-width="5"/>
    <path d="M4 22 Q4 14 12 14 L176 14 Q184 14 184 22 L184 62 L4 62Z" fill="${S}"/>
    <rect x="50" y="0" width="12" height="34" rx="6" fill="${C.weiss}" stroke="${S}" stroke-width="4"/><rect x="126" y="0" width="12" height="34" rx="6" fill="${C.weiss}" stroke="${S}" stroke-width="4"/>
    ${cells}<ellipse cx="114" cy="175" rx="27" ry="24" fill="none" stroke="${C.beere}" stroke-width="4" transform="rotate(-12 114 175)"/>`, {}, root, '0 0 190 230', 190, 230);
  // Schminktisch-Kante + Spiegel
  full(root, `<rect x="0" y="1262" width="1080" height="10" fill="${S}"/><rect x="0" y="1272" width="1080" height="648" fill="${C.rosaHell}"/>
    <rect x="500" y="1196" width="100" height="70" fill="${S}"/><rect x="400" y="1244" width="300" height="24" rx="12" fill="${S}"/>`);
  const mir = svg('', {}, root, '0 0 700 760', 700, 760);
  const drawMir = (o) => `<clipPath id="mc"><ellipse cx="350" cy="380" rx="276" ry="346"/></clipPath>
    <ellipse cx="350" cy="380" rx="290" ry="360" fill="${GLAS}" stroke="${S}" stroke-width="18"/>
    <g clip-path="url(#mc)"><g transform="translate(46 96) scale(1.52)">${bride(o)}</g>
    <path d="M140 250 L230 130 M118 330 L160 276" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".55"/></g>`;
  // Pinselbecher als Deko rechts
  svg(`<path d="M50 70 L44 6 M76 70 L84 -4 M100 70 L122 12" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="43" cy="-6" rx="13" ry="22" fill="${C.rosaTief}"/><ellipse cx="85" cy="-18" rx="17" ry="26" fill="${HAIR}"/><ellipse cx="126" cy="2" rx="11" ry="18" fill="${C.beere}"/>
    <path d="M26 66 L134 66 L122 170 L38 170Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M32 100 L128 100" stroke="${C.rosaTief}" stroke-width="10"/>`, { left: '850px', top: '1094px' }, root, '0 -50 160 230', 160, 230);
  // Polaroid-Rahmen + Blitz
  const pol = el('div', { left: '222px', top: '522px', width: '676px', height: '836px', border: `28px solid ${C.weiss}`, borderBottomWidth: '96px', boxShadow: `10px 12px 0 rgba(21,16,18,.16)` }, root);
  const flash = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.weiss }, root);
  const sp = svg(sparkle(50, 50, 1.6) + sparkle(120, 96, .8) + sparkle(24, 120, .6, C.beere), {}, root, '0 0 160 160', 160, 160);
  const hook = bigText(root, 'Du heiratest bald und willst *rote* *Lippen* auf jedem Foto?', { x: 80, y: 204, w: 920, size: 86, t0: -2, step: 0 });
  const tF = Math.min(2.5, D * .62);
  return (t) => {
    hook.update(t);
    const k = clamp(.18 + .82 * pr(t, .25, 1.55, ease.inOutSine));
    const away = pr(t, 1.6, 2.1, ease.inOutCubic);
    const hx = lerp(170, 236, k) + away * 120, hy = 293 + Math.sin(k * Math.PI) * 5 + away * 150;
    const shot = t > tF;
    mir.querySelector('svg').innerHTML = drawMir({ veil: true, red: k, smile: pr(t, 1.7, 2.3), eyes: (shot && t < tF + 2) ? 'happy' : (t > 1.05 && t < 1.2 ? 'closed' : 'open'), extra: away < 1 ? handStick(hx, hy, 32 + away * 20) : '' });
    place(mir, 560, 905 + Math.sin(t * 1.6) * 3, 1, 0);
    place(cal, 118, 1010, 1, -5 + Math.sin(t * 1.3) * 1.5);
    flash.style.opacity = clamp(1 - Math.abs(t - tF) / .13) * .92;
    const pk = pr(t, tF, tF + .35, ease.outBack);
    pol.style.opacity = t >= tF ? 1 : 0;
    pol.style.transform = `rotate(${lerp(-9, -2.5, pk) + Math.sin(t * 1.7) * .5}deg) scale(${lerp(1.25, 1, pk)})`;
    const s = pr(t, tF + .15, tF + .5, ease.outBack);
    place(sp, 868, 600, s * (.85 + Math.abs(Math.sin(t * 3)) * .3), t * 30, t > tF + .15 ? 1 : 0);
  };
}};

// ================= s2: alles geplant – drei Haken =================
const flute = () => `<path d="M30 20 L90 20 C92 110 80 170 60 182 C40 170 28 110 30 20Z" fill="${C.weiss}"/>
  <path d="M31 74 L89 74 C88 122 78 168 60 178 C42 168 32 122 31 74Z" fill="${SEKT}"/>
  <circle cx="50" cy="110" r="5" fill="#fff"/><circle cx="68" cy="134" r="4" fill="#fff"/><circle cx="62" cy="96" r="3" fill="#fff"/>
  <path d="M30 20 L90 20 C92 110 80 170 60 182 C40 170 28 110 30 20Z" fill="none" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M60 182 L60 296 M28 300 L92 300" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`;
function tick(root, x, y, label, o = {}) {
  const n = el('div', { left: x + 'px', top: y + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: '78px', color: S, whiteSpace: 'pre', transform: `rotate(${o.r ?? -4}deg)`, transformOrigin: '0 50%' }, root, label);
  const c = svg(`<path d="M10 52 L40 84 L104 10" fill="none" stroke="${C.beere}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: (x + (o.cx ?? 0)) + 'px', top: (y + (o.cy ?? -84)) + 'px' }, root, '0 0 114 96', 114, 96);
  return (t, t0) => { const k = pr(t, t0, t0 + .35); n.style.opacity = k; n.style.clipPath = `inset(-20px ${100 - k * 100}% -20px 0)`; c.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, t0 + .3, t0 + .6)); };
}
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur, T = [0.15, D * .36, D * .68];
  const head = bigText(root, 'Alles *geplant?*', { x: 80, y: 210, w: 900, size: 176, t0: 0, step: .12, lh: .98 });
  full(root, `<rect x="0" y="1262" width="1080" height="10" fill="${S}"/><rect x="0" y="1272" width="1080" height="648" fill="${C.rosaHell}"/>`);
  // Pinsel im Becher
  const brush = svg(`<path d="M70 150 L58 40 M110 150 L112 20 M150 150 L176 50" stroke="${S}" stroke-width="11" stroke-linecap="round"/>
    <path d="M40 34 C40 0 76 0 76 34 L70 62 L46 62Z" fill="${C.rosaTief}"/><rect x="44" y="58" width="28" height="16" fill="#d8c3a5"/>
    <path d="M82 22 C78 -34 146 -34 142 22 L130 46 L94 46Z" fill="${HAIR}"/><rect x="94" y="42" width="36" height="16" fill="#d8c3a5"/>
    <path d="M166 50 L190 6 L200 14 L186 58Z" fill="${C.beere}"/>
    <path d="M30 140 L190 140 L172 330 L48 330Z" fill="${C.rosa}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M36 196 L184 196" stroke="${C.weiss}" stroke-width="14"/>`, {}, root, '0 -40 220 380', 220, 380);
  // Kamera
  const cam = svg(`<rect x="70" y="0" width="100" height="44" rx="10" fill="${S}"/><rect x="212" y="14" width="46" height="20" rx="6" fill="${C.beere}"/>
    <rect x="0" y="34" width="300" height="190" rx="22" fill="${S}"/><rect x="0" y="70" width="300" height="26" fill="#3a2e33"/>
    <circle cx="150" cy="134" r="72" fill="#3a2e33" stroke="${C.weiss}" stroke-width="9"/><circle cx="150" cy="134" r="42" fill="${C.nachtHell}"/><circle cx="132" cy="116" r="12" fill="#fff" opacity=".7"/>
    <rect x="232" y="50" width="46" height="14" rx="4" fill="${C.weiss}"/>`, {}, root, '0 0 300 224', 300, 224);
  const fl = svg(sparkle(80, 80, 3.2, '#FFE9A8'), {}, root, '0 0 160 160', 160, 160);
  const g1 = svg(flute(), {}, root, '0 0 120 310', 120, 310), g2 = svg(flute(), {}, root, '0 0 120 310', 120, 310);
  const cl = svg(sparkle(40, 40, 1.2, C.beere) + sparkle(84, 20, .6, S) + sparkle(14, 80, .5, S), {}, root, '0 0 110 110', 110, 110);
  const t1 = tick(root, 70, 800, 'Probe-Make-up', { r: -5, cx: 250, cy: -80 });
  const t2 = tick(root, 420, 898, 'Fotografin', { r: 3, cx: 180, cy: -86 });
  const t3 = tick(root, 770, 770, 'Sekt', { r: -4, cx: 70, cy: -90 });
  const pop = (n, cx, baseY, h, t, t0, r = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); place(n, cx, baseY - h / 2, 1, r, clamp((t - t0) / .1)); n.style.transformOrigin = '50% 100%'; n.style.transform += ` scale(${lerp(.6, 1, k)})`; };
  return (t) => {
    head.update(t);
    pop(brush, 210, 1262, 380, t, T[0] - .1, Math.sin(t * 1.5) * .8);
    pop(cam, 545, 1262, 224, t, T[1] - .15);
    const f = clamp(1 - Math.abs(t - (T[1] + .45)) / .16);
    place(fl, 648, 1094, f * 1.3, t * 60, f);
    const c = pr(t, T[2] + .35, T[2] + .65, ease.inOutCubic) - pr(t, T[2] + .65, T[2] + 1.0, ease.inOutCubic) * .45;
    pop(g1, 772, 1262, 310, t, T[2] - .15, c * 13); pop(g2, 906, 1262, 310, t, T[2] - .08, -c * 13);
    const ck = clamp(1 - Math.abs(t - (T[2] + .68)) / .22);
    place(cl, 838, 960, ck * 1.3, t * 40, ck);
    t1(t, T[0] + .2); t2(t, T[1] + .15); t3(t, T[2] + .1);
  };
}};

// ================= s3: Checkliste – „Lippen“ fehlt =================
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur, tL = D * .52;
  const head = bigText(root, 'Und die *Lippen?*', { x: 70, y: 214, w: 940, size: 128, t0: tL + .1, step: .08, align: 'center' });
  const pad = el('div', { left: '160px', top: '0px', width: '760px', height: '900px', background: C.weiss, boxShadow: '14px 16px 0 rgba(21,16,18,.13)', borderRadius: '6px' }, root);
  el('div', { left: 0, top: 0, width: '760px', height: '96px', background: S, borderRadius: '6px 6px 0 0' }, pad);
  svg(Array.from({ length: 9 }, (_, i) => `<rect x="${44 + i * 80}" y="0" width="16" height="70" rx="8" fill="${C.rosaHell}" stroke="${S}" stroke-width="5"/>`).join(''), { left: '8px', top: '-30px' }, pad, '0 0 744 70', 744, 70);
  const rows = [['Kleid', 0], ['Frisur', 1], ['Blumen', 2]];
  const doodles = [
    `<path d="M40 8 L52 34 L68 34 L80 8 M52 34 C48 52 46 56 22 122 L98 122 C74 56 72 52 68 34Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 56 L72 56" stroke="${C.rosaTief}" stroke-width="7"/>`,
    `<path d="M14 30 C40 6 80 6 106 30" fill="none" stroke="${S}" stroke-width="9" stroke-linecap="round"/><path d="M26 28 L22 116 M44 20 L44 120 M60 16 L60 122 M76 20 L76 120 M94 28 L98 116" stroke="${S}" stroke-width="6" stroke-linecap="round"/><circle cx="44" cy="16" r="8" fill="${C.rosaTief}"/><circle cx="60" cy="11" r="8" fill="${C.weiss}" stroke="${S}" stroke-width="3"/><circle cx="76" cy="16" r="8" fill="${C.rosaTief}"/>`,
    `<path d="M60 70 L46 126 M60 70 L60 128 M60 70 L76 126" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M40 92 L82 92" stroke="${C.beere}" stroke-width="9" stroke-linecap="round"/>
     <circle cx="38" cy="44" r="22" fill="${C.rosaTief}"/><circle cx="82" cy="42" r="22" fill="${C.rosa}"/><circle cx="60" cy="24" r="22" fill="${C.weiss}" stroke="${S}" stroke-width="4"/><circle cx="60" cy="56" r="18" fill="${C.beere}"/><circle cx="60" cy="24" r="6" fill="${C.rosaTief}"/>`];
  const rowEls = rows.map(([txt, i]) => {
    const y = 150 + i * 168;
    el('div', { left: '56px', top: (y + 148) + 'px', width: '648px', height: '4px', background: C.rosa }, pad);
    el('div', { left: '64px', top: (y + 30) + 'px', width: '78px', height: '78px', border: `7px solid ${S}`, borderRadius: '8px' }, pad);
    const tx = el('div', { left: '180px', top: (y + 14) + 'px', fontFamily: F.sans, fontWeight: 700, fontSize: '84px', color: S, lineHeight: 1.2 }, pad, txt);
    const ck = svg(`<path d="M10 56 L42 90 L112 8" fill="none" stroke="${C.beere}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: '60px', top: (y + 2) + 'px' }, pad, '0 0 122 100', 122, 100);
    const dd = svg(doodles[i], { left: '580px', top: (y + 8) + 'px' }, pad, '0 0 120 130', 120, 130);
    return { tx, ck, dd };
  });
  // vierte Zeile: handschriftlich
  const y4 = 150 + 3 * 168;
  const box4 = svg(`<path d="M8 10 C30 6 60 8 84 6 C88 30 84 60 88 84 C60 88 30 84 8 88 C4 60 10 34 8 10Z" fill="none" stroke="${C.beere}" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: '58px', top: (y4 + 24) + 'px' }, pad, '0 0 96 96', 96, 96);
  const hand = el('div', { left: '180px', top: (y4 - 14) + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: '150px', lineHeight: 1.1, color: C.beere, transform: 'rotate(-3deg)', whiteSpace: 'pre' }, pad, 'Lippen');
  const ring = svg(`<path d="M300 20 C120 0 10 50 14 110 C20 190 200 210 380 196 C560 180 640 120 600 62 C570 20 440 8 250 30" fill="none" stroke="${C.beere}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: '40px', top: (y4 - 30) + 'px' }, pad, '0 0 640 220', 640, 220);
  const lipD = svg(`<path d="M6 30 C24 16 40 10 52 20 C64 10 80 16 98 30 C80 54 24 54 6 30Z M6 30 C40 36 64 36 98 30" fill="none" stroke="${C.beere}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: '566px', top: (y4 + 36) + 'px' }, pad, '0 0 104 60', 104, 60);
  return (t) => {
    head.update(t);
    const dn = pr(t, tL - .15, tL + .45, ease.inOutCubic);
    pad.style.transform = `translate(0px, ${lerp(300, 440, dn)}px) rotate(${-2 + Math.sin(t * 1.1) * .4}deg)`;
    rowEls.forEach((r, i) => {
      const t0 = .25 + i * (tL - .6) / 3;
      r.ck.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, t0, t0 + .3));
      const k = pr(t, t0 + .05, t0 + .45, ease.outBack);
      r.dd.style.transform = `scale(${lerp(.9, 1, k)}) rotate(${lerp(-8, 0, k) + Math.sin(t * 2 + i) * 2}deg)`;
    });
    box4.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, tL + .1, tL + .5));
    const h = pr(t, tL + .4, tL + 1.0, ease.inOutSine);
    hand.style.clipPath = `inset(-20px ${100 - h * 100}% -30px 0)`;
    lipD.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, tL + 1.0, tL + 1.4));
    ring.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, tL + 1.3, tL + 1.9, ease.inOutSine));
  };
}};

// ================= s4: die Basis für dein Rot =================
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Die *Basis* für dein Rot', { x: 80, y: 210, w: 900, size: 132, t0: 0, step: .09 });
  const mir = svg(`<path d="M300 560 L300 700" stroke="${S}" stroke-width="56" stroke-linecap="round"/>
    <circle cx="300" cy="300" r="290" fill="${C.weiss}" stroke="${S}" stroke-width="18"/>
    <path d="M96 210 C116 150 160 106 214 84" fill="none" stroke="${C.rosaHell}" stroke-width="16" stroke-linecap="round"/>`, {}, root, '0 0 600 720', 600, 720);
  const lipsN = svg('', {}, root, '0 0 400 400', 520, 520);
  const stick = svg(ART.lipstick(ROT), {}, root, '0 0 400 400', 330, 330);
  const sp = svg(sparkle(50, 50, 1.5, C.weiss) + sparkle(116, 90, .7, C.beere), {}, root, '0 0 150 150', 150, 150);
  const A = Math.min(D - 1.6, 1.3), B = A + 1.5; // Auftrag passend zu „… die Basis für dein Rot“
  return (t) => {
    head.update(t);
    const k = pr(t, A, B, ease.inOutSine), bob = Math.sin(t * 1.5) * 4;
    lipsN.querySelector('svg').innerHTML = ART.lips(.72, C.lippeHell) + `<clipPath id="lr"><rect x="30" y="120" width="${340 * k}" height="180"/></clipPath><g clip-path="url(#lr)">${ART.lips(.72, ROT)}</g>`;
    place(mir, 540, 900 + bob, 1, -3);
    place(lipsN, 540, 836 + bob, 1, -3);
    const inn = pr(t, A - .7, A, ease.outCubic), out = pr(t, B + .1, B + .7, ease.inOutCubic);
    const tipX = lerp(345, 735, k), tipY = 850 + Math.sin(k * Math.PI) * 22 + bob;
    const rot = lerp(-24, 24, k);
    // Spitze liegt lokal bei (+12, -112) px vom Mittelpunkt (bei 330 px Größe)
    const a = rot * Math.PI / 180, ox = 12 * Math.cos(a) + 112 * Math.sin(a), oy = 12 * Math.sin(a) - 112 * Math.cos(a);
    place(stick, tipX - ox + out * 160, tipY - oy + (1 - inn) * 700 + out * 300, 1, rot + out * 20);
    const s = pr(t, B, B + .35, ease.outBack);
    place(sp, 772, 700, s * (.85 + Math.abs(Math.sin(t * 3.2)) * .35), t * 30, t > B ? 1 : 0);
  };
}};

// ================= s5: Wochen davor, abends – Diva Tape =================
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur, tB = D - 3.8;
  const stars = full(root, [[120, 560, 1.2], [960, 520, 1], [70, 1180, .8], [1000, 1120, 1.3], [900, 250, .7], [180, 1330, 1]].map(s => ART.star(s[0], s[1], s[2] * 1.5, MOND)).join(''));
  // --- Teil A: Kalender ---
  const A = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
  const hA = bigText(A, 'In den *Wochen* *davor*', { x: 80, y: 210, w: 900, size: 124, color: C.weiss, accent: C.rosa, t0: 0, step: .08 });
  const nA = note(A, 'abends, als letzter Schritt', { x: 96, y: 474, size: 84, color: C.rosa, r: -3, t0: Math.min(2.2, tB * .5) });
  const GX = 212, GY = 800, P = 96, PR = 122, N = 27;
  const calS = svg('', { left: '0px', top: '0px' }, A, '0 0 1080 1920', 1080, 1920);
  const crescent = (x, y) => `<path transform="translate(${x} ${y})" d="M6 -20 A22 22 0 1 0 20 12 A18 18 0 1 1 6 -20Z" fill="${C.nacht}"/>`;
  const drawCal = (t) => {
    let g = `<rect x="174" y="612" width="752" height="700" rx="10" fill="${C.nachtHell}" transform="translate(14 16)"/>
      <rect x="174" y="612" width="752" height="700" rx="10" fill="${C.weiss}"/><path d="M174 622 Q174 612 184 612 L916 612 Q926 612 926 622 L926 716 L174 716Z" fill="${C.rosaTief}"/>
      <rect x="330" y="580" width="20" height="76" rx="10" fill="${C.weiss}" stroke="${S}" stroke-width="5"/><rect x="730" y="580" width="20" height="76" rx="10" fill="${C.weiss}" stroke="${S}" stroke-width="5"/>`;
    'MDMDFSS'.split('').forEach((c, i) => { g += `<text x="${GX + i * P + 42}" y="776" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="700" font-size="30" fill="${S}" opacity=".45">${c}</text>`; });
    for (let i = 0; i <= N; i++) {
      const x = GX + (i % 7) * P, y = GY + Math.floor(i / 7) * PR;
      if (i === N) {
        const k = pr(t, .25, .7, ease.outBack), b = 1 + Math.sin(t * 5) * .06;
        g += `<rect x="${x}" y="${y}" width="84" height="100" rx="14" fill="${C.rosaHell}"/>${heart(x + 42, y + 50, .27 * k * b)}`;
      } else {
        const t0 = .7 + i * (tB - 1.5) / N, k = pr(t, t0, t0 + .3, ease.outBack);
        g += `<rect x="${x}" y="${y}" width="84" height="100" rx="14" fill="#F4ECEE"/>`;
        if (k > 0) g += `<g transform="translate(${x + 42} ${y + 50}) scale(${k}) translate(${-x - 42} ${-y - 50})"><rect x="${x}" y="${y}" width="84" height="100" rx="14" fill="${C.rosa}"/>${crescent(x + 40, y + 52)}</g>`;
      }
    }
    return g;
  };
  // --- Teil B: Abend, Tape auf den Lippen ---
  const B = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
  const moon = svg(ART.moon(MOND), {}, B, '0 0 400 400', 230, 230);
  const hB = bigText(B, 'Diva Tape', { x: 80, y: 214, w: 800, size: 168, color: C.weiss, t0: tB + .25, step: .12 });
  const sub = el('div', { left: '86px', top: '418px', fontFamily: F.sans, fontWeight: 600, fontSize: '56px', color: C.rosa, whiteSpace: 'pre' }, B, 'Kollagen-Tape, über Nacht');
  const pil = svg(ART.pillow(C.rosaHell), {}, B, '0 0 400 400', 900, 900);
  const br = svg(bride({ eyes: 'closed', top: 'pj', smile: .5 }), {}, B, '0 0 400 460', 640, 736);
  const tape = svg(ART.tape(true), {}, B, '0 0 400 400', 236, 236);
  return (t) => {
    stars.style.opacity = .55 + Math.sin(t * 2.2) * .25;
    hA.update(t); nA.update(t);
    const sw = pr(t, tB, tB + .5, ease.inOutCubic);
    A.style.transform = `translateX(${-sw * 1100}px)`; A.style.display = sw < 1 ? 'block' : 'none';
    if (sw < 1) calS.querySelector('svg').innerHTML = drawCal(t);
    calS.style.transformOrigin = '550px 600px'; calS.style.transform = `rotate(${-1.5 + Math.sin(t * 1.2) * .5}deg)`;
    B.style.transform = `translateX(${(1 - sw) * 1100}px)`; B.style.display = sw > 0 ? 'block' : 'none';
    hB.update(t); sub.style.opacity = pr(t, tB + .7, tB + 1.1);
    place(moon, 900, 330, 1, -12 + Math.sin(t) * 3);
    const br2 = 1 + Math.sin((t - tB) * 1.6) * .006;
    place(pil, 540, 1060, 1, 0);
    place(br, 540, 962, br2, 0);
    const k = pr(t, tB + .55, tB + 1.15, ease.outCubic), set = pr(t, tB + 1.15, tB + 1.4, ease.outBack);
    place(tape, 540, lerp(640, 1059, k), lerp(1.5, 1, k) * (1 + (1 - set) * .06 * (k >= 1 ? 1 : 0)), lerp(-22, 0, k), clamp((t - tB - .5) / .15));
  };
}};

// ================= s6: Motto =================
SCENES.s6 = { bg: C.rosa, build(root, ctx) {
  const cols = [C.weiss, C.weiss, C.rosaHell, C.beere, C.weiss, C.rosaTief];
  const conf = Array.from({ length: 46 }, (_, i) => {
    const w = 16 + rnd(i) * 22, d = el('div', { left: 0, top: 0, width: w + 'px', height: (rnd(i + 50) > .5 ? w : w * .45) + 'px', background: cols[i % cols.length], borderRadius: rnd(i + 9) > .6 ? '50%' : '3px' }, root);
    return { d, x: 40 + rnd(i + 100) * 1000, v: 520 + rnd(i + 200) * 520, ph: rnd(i + 300) * 6, y0: -80 - rnd(i + 400) * 900 };
  });
  const head = bigText(root, 'Erst pflegen, dann *Ja* sagen.', { x: 60, y: 400, w: 960, size: 156, t0: 0, step: .07, align: 'center', lh: 1.04 });
  const ring = (c) => `<circle cx="130" cy="150" r="96" fill="none" stroke="${S}" stroke-width="34"/><circle cx="130" cy="150" r="96" fill="none" stroke="${c}" stroke-width="22"/>
    <path d="M62 96 A96 96 0 0 1 120 56" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
  const r1 = svg(ring(GOLD), {}, root, '0 0 260 300', 260, 300);
  const r2 = svg(ring(GOLD) + `<path d="M130 6 L108 38 L130 62 L152 38Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`, {}, root, '0 0 260 300', 260, 300);
  const sp = svg(sparkle(60, 60, 1.8, C.weiss) + sparkle(140, 30, .8, C.weiss) + sparkle(20, 140, .7, C.beere), {}, root, '0 0 180 180', 180, 180);
  return (t) => {
    head.update(t);
    conf.forEach((c, i) => { const y = c.y0 + t * c.v; c.d.style.transform = `translate(${c.x + Math.sin(t * 2.4 + c.ph) * 40}px, ${y}px) rotate(${t * 200 * (i % 2 ? 1 : -1) + c.ph * 60}deg) scaleX(${Math.cos(t * 5 + c.ph)})`; });
    const k = pr(t, .25, .75, ease.outBack), hit = clamp(1 - Math.abs(t - .75) / .2);
    place(r1, lerp(160, 478, k), 1010, 1 + hit * .05, lerp(-30, -8, k), clamp(t / .15));
    place(r2, lerp(920, 602, k), 1000, 1 + hit * .05, lerp(30, 8, k), clamp(t / .15));
    const s = pr(t, .72, 1.0, ease.outBack);
    place(sp, 730, 850, s * (.9 + Math.abs(Math.sin(t * 4)) * .3), t * 40, t > .72 ? 1 : 0);
  };
}};

// ================= s7: Senden an + Frage =================
SCENES.s7 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur, tQ = D * .52;
  const P1 = el('div', { left: 0, top: 0, width: '1080px', height: '900px' }, root);
  const h1 = bigText(P1, 'Schick das deiner *Freundin,* die bald heiratet.', { x: 80, y: 214, w: 900, size: 108, t0: 0, step: .06 });
  const plane = svg(`<path d="M8 86 L232 8 L150 196 L112 122Z" fill="${C.weiss}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/><path d="M232 8 L112 122 L104 180 L134 150" fill="${C.rosa}" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>`, {}, P1, '0 0 240 204', 200, 170);
  const trail = svg(`<path d="M10 150 C120 190 240 40 380 90 C470 120 520 70 560 30" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 22" opacity=".6"/>`, { left: '90px', top: '610px' }, P1, '0 0 580 200', 580, 200);
  const P2 = el('div', { left: 0, top: 0, width: '1080px', height: '900px' }, root);
  const h2 = bigText(P2, 'Rot, Rosé oder Nude *zum* *Ja?*', { x: 80, y: 208, w: 900, size: 124, t0: tQ + .1, step: .09 });
  const sw = [[ROT, 230, -6], ['#E58FA3', 540, 3], ['#C4917C', 850, -3]].map(([c, x, r]) => {
    const d = svg(`<rect x="10" y="10" width="250" height="240" rx="6" fill="rgba(21,16,18,.14)" transform="translate(10 12)"/><rect x="10" y="10" width="250" height="240" rx="6" fill="${C.weiss}"/>
      <rect x="95" y="-8" width="80" height="36" fill="${C.rosaTief}" opacity=".85" transform="rotate(-4 135 10)"/>
      <g transform="translate(135 138) scale(.66) translate(-200 -204)">${ART.lips(.7, c)}</g>`, {}, P2, '0 -10 280 280', 280, 280);
    return { d, x, r };
  });
  const sheet = KIT.sendTo(root, { contacts: ['Lena', 'Jule', 'Caro', 'Schwester'], pick: 1, t0: .35, top: 1040 });
  return (t) => {
    h1.update(t); h2.update(t);
    const o = pr(t, tQ - .25, tQ, ease.inCubic);
    P1.style.opacity = 1 - o; P1.style.transform = `translateY(${-o * 40}px)`;
    P2.style.opacity = t >= tQ ? 1 : 0;
    const f = pr(t, sheet.tapTime, sheet.tapTime + .9, ease.inOutCubic);
    place(plane, lerp(170, 720, f), 760 - Math.sin(f * Math.PI) * 60 - f * 110 + Math.sin(t * 3) * 6, 1, lerp(8, -14, f));
    trail.style.clipPath = `inset(0 ${100 - f * 96}% 0 0)`;
    sw.forEach((s, i) => { const t0 = tQ + .35 + i * .32, k = pr(t, t0, t0 + .4, ease.outBack); place(s.d, s.x, 668 + (i === 1 ? 14 : 0) + Math.sin(t * 2 + i * 2) * 5, lerp(.5, 1, k), s.r + (1 - k) * 14 + Math.sin(t * 1.7 + i) * 1.2, clamp((t - t0) / .1)); });
    sheet.update(t);
  };
}};

// ================= Cover =================
SCENES.cover = { build(root) {
  const art = `<rect x="24" y="22" width="480" height="560" rx="6" fill="rgba(21,16,18,.16)"/>
    <g transform="rotate(-3 260 300)"><rect x="10" y="6" width="480" height="560" rx="6" fill="${C.weiss}"/>
    <clipPath id="cv"><rect x="40" y="36" width="420" height="420"/></clipPath><rect x="40" y="36" width="420" height="420" fill="${C.rosaHell}"/>
    <g clip-path="url(#cv)"><g transform="translate(40 30) scale(1.05)">${bride({ veil: true, red: 1, smile: 1, eyes: 'happy' })}</g></g>
    ${heart(250, 512, .2)}</g>
    ${sparkle(486, 60, 1.4, C.weiss)}${sparkle(30, 440, .9, C.weiss)}`;
  KIT.coverLayout(root, { lines: ['Rote Lippen', 'auf *jedem* Hochzeitsfoto?'], teaser: '…daran denkt vorher keiner', art, artBox: '0 0 520 600', artSize: 560, artY: 1010, size: 112, textY: 320, teaserY: 1350 });
}};
