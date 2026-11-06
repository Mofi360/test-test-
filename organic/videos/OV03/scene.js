/* OV03 – Das Foto im Schuhkarton  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const HAIR = '#3B2529', WARM = '#FFF1D6', MOND = '#F7E7C6', KARTON = '#E9D6C8';

// ---------- eigene Illustrationen ----------
/** Frau, Kopf + Schultern. viewBox 0 0 400 460. mood 'laugh' | 'smile'. Mund bei (200, 296) */
function woman(o = {}) {
  const mood = o.mood || 'laugh', S = C.schwarz;
  const eye = x => mood === 'laugh'
    ? `<path d="M${x - 19} 216 Q${x} 194 ${x + 19} 216" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`
    : `<ellipse cx="${x}" cy="210" rx="10" ry="12" fill="${S}"/><circle cx="${x + 3}" cy="205" r="3.5" fill="#fff"/>
       <path d="M${x - 18} 199 Q${x} 188 ${x + 18} 199" fill="none" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>`;
  const mouth = mood === 'laugh'
    ? `<path d="M162 280 Q200 274 238 280 Q234 322 200 324 Q166 322 162 280Z" fill="#6E2A3B" stroke="${C.lippe}" stroke-width="7" stroke-linejoin="round"/>
       <path d="M168 283 Q200 278 232 283 L229 294 Q200 291 171 294Z" fill="#fff"/>
       <ellipse cx="200" cy="312" rx="16" ry="6" fill="${C.lippeHell}"/>`
    : `<path d="M166 288 Q184 278 200 284 Q216 278 234 288 Q226 296 200 297 Q174 296 166 288Z" fill="${C.lippe}"/>
       <path d="M166 288 Q200 312 234 288 Q226 296 200 297 Q174 296 166 288Z" fill="${C.lippeHell}"/>
       <path d="M166 288 Q200 300 234 288" fill="none" stroke="#9E4058" stroke-width="3" stroke-linecap="round"/>`;
  return `<g>
    <path d="M62 262 C44 120 118 62 200 62 C282 62 356 120 338 262 C352 316 336 352 304 362 L96 362 C64 352 48 316 62 262Z" fill="${o.hair || HAIR}"/>
    ${o.streak ? `<path d="M250 78 C300 96 336 150 334 240" fill="none" stroke="#D9CCD0" stroke-width="10" stroke-linecap="round" opacity=".8"/>` : ''}
    <path d="M70 460 C70 396 124 366 200 366 C276 366 330 396 330 460Z" fill="${o.top || C.weiss}" stroke="${S}" stroke-opacity=".12" stroke-width="3"/>
    ${o.dots ? [[128, 420], [200, 402], [272, 422], [160, 450], [240, 452]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${C.rosaTief}"/>`).join('') : ''}
    <rect x="176" y="318" width="48" height="56" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="228" rx="112" ry="124" fill="${C.haut}"/>
    <path d="M86 210 C84 124 146 92 210 96 C272 100 318 134 314 210 C298 170 262 150 214 158 C176 148 120 160 86 210Z" fill="${o.hair || HAIR}"/>
    ${o.hoops ? `<circle cx="92" cy="282" r="15" fill="none" stroke="${C.beere}" stroke-width="5"/><circle cx="308" cy="282" r="15" fill="none" stroke="${C.beere}" stroke-width="5"/>` : ''}
    <path d="M136 176 Q156 164 176 172" fill="none" stroke="${o.hair || HAIR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M224 172 Q244 164 264 176" fill="none" stroke="${o.hair || HAIR}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156)}${eye(244)}
    <path d="M197 226 C193 246 191 254 202 258" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="128" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <ellipse cx="272" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    ${mouth}
  </g>`;
}

/** Foto-Inhalt 1998, viewBox 0 0 460 460. Mund bei (230, 303) */
function photo() {
  const flags = Array.from({ length: 9 }, (_, i) => {
    const x = 10 + i * 56, y = 40 + Math.sin(i * .7) * 4 + (i - 4) * (i - 4) * 1.6;
    return `<path d="M${x} ${y} L${x + 40} ${y + 2} L${x + 20} ${y + 44}Z" fill="${[C.beere, C.weiss, C.schwarz][i % 3]}"/>`;
  }).join('');
  return `<rect width="460" height="460" fill="${C.rosaHell}"/>
    <circle cx="392" cy="96" r="44" fill="${WARM}"/>
    <path d="M0 28 Q230 96 460 28" fill="none" stroke="${C.schwarz}" stroke-width="3"/>${flags}
    <path d="M0 340 C120 300 340 310 460 350 L460 460 L0 460Z" fill="${C.rosaTief}"/>
    <g transform="translate(70 66) scale(.8)">${woman({ mood: 'laugh', hoops: true, dots: true })}</g>
    <rect width="460" height="460" fill="#E8C9A0" opacity=".12"/>`;
}

/** Polaroid als HTML: w = Breite. Gibt {node, photo, p, ps} */
function polaroid(parent, w, label) {
  const p = w * .065, ps = w - 2 * p, h = p + ps + w * .23;
  const n = el('div', { left: 0, top: 0, width: w + 'px', height: h + 'px', background: '#FFFDF9', boxShadow: '0 26px 50px -18px rgba(21,16,18,.45)', borderRadius: '4px' }, parent);
  const ph = svg(photo(), { left: p + 'px', top: p + 'px', overflow: 'hidden' }, n, '0 0 460 460', ps, ps);
  if (label) el('div', { left: 0, width: w + 'px', top: (p + ps + w * .035) + 'px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: (w * .105) + 'px', color: C.schwarz, transform: 'rotate(-2deg)' }, n, label);
  return { node: n, photo: ph, p, ps, h };
}

const puff = `<circle cx="20" cy="20" r="16" fill="${C.schwarz}"/>`;

// ---------- Szenen ----------
// s1: Hook statisch, Schuhkarton öffnet sich, Polaroid steigt heraus
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Dieses Foto hätte ich *nicht* finden sollen.', { x: 90, y: 200, w: 900, size: 112 });
  hook.update(99);
  // Karton: Rückwand/Innenraum, Polaroid, Front
  const back = svg(`<path d="M60 70 L540 70 L580 150 L20 150Z" fill="#5A3F44"/><path d="M60 70 L540 70 L580 150 L20 150Z" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/>`, {}, root, '0 0 600 400', 600, 400);
  const lid = svg(`<path d="M10 40 L590 40 L600 110 L0 110Z" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/><path d="M14 40 L586 40 L590 60 L10 60Z" fill="#fff" opacity=".25"/>`, {}, root, '0 0 600 150', 600, 150);
  const items = svg(`<rect x="80" y="10" width="120" height="80" rx="4" fill="#fff" stroke="${C.schwarz}" stroke-width="4" transform="rotate(-10 140 50)"/>
      <rect x="380" y="0" width="110" height="90" rx="4" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="4" transform="rotate(8 435 45)"/>`, {}, root, '0 0 600 100', 600, 100);
  const pol = polaroid(root, 380, '1998. Gartenparty.');
  const front = svg(`<path d="M20 150 L580 150 L560 380 L40 380Z" fill="${KARTON}" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="230" y="220" width="140" height="70" rx="6" fill="#fff" stroke="${C.schwarz}" stroke-width="4"/>
      <path d="M250 245 L350 245 M250 266 L320 266" stroke="${C.schwarz}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`, {}, root, '0 0 600 400', 600, 400);
  return (t) => {
    const bx = 540, by = 1150;
    place(back, bx, by, 1);
    const o = pr(t, .15, .9, ease.inOutCubic);
    // Polaroid steigt aus dem Karton
    const k = pr(t, .9, 2.0, ease.outBack);
    const py = lerp(1290, 850, k), rot = lerp(4, -6, k) + noise(t, 2) * .6;
    place(items, bx, by - 70, 1, 0, pr(t, .6, 1));
    place(pol.node, 560, py, lerp(.9, 1, k), rot);
    // Clip: solange im Karton, unten abschneiden
    const cut = Math.max(0, (py + pol.h / 2) - (by - 50));
    pol.node.style.clipPath = `inset(0 0 ${Math.max(0, cut)}px 0)`;
    place(front, bx, by, 1);
    // Deckel klappt hinten links auf
    lid.style.transformOrigin = '0px 110px';
    lid.style.left = '0px'; lid.style.top = '0px';
    lid.style.transform = `translate(${bx - 300}px, ${by - 200 - 110 + 70 * (1 - o)}px) rotate(${lerp(0, -30, o) + Math.sin(clamp((t - 1.1) / .4) * Math.PI) * 3}deg)`;
  };
}};

// s2: Lupe gleitet übers Foto und bleibt am Mund stehen
SCENES.s2 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Nur auf *eins* geschaut.', { x: 90, y: 200, w: 900, size: 118, t0: 0, step: .06 });
  const W0 = 640;
  const pol = polaroid(root, W0, '1998. Gartenparty.');
  const PX = 540 - W0 / 2 + pol.p, PY0 = 900 - pol.h / 2;
  const PY = PY0 + pol.p;
  const R = 150, M = 1.7;
  const lens = el('div', { left: 0, top: 0, width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', overflow: 'hidden', background: C.rosaHell }, root);
  const inner = svg(photo(), {}, lens, '0 0 460 460', pol.ps * M, pol.ps * M);
  const frame = svg(`<line x1="318" y1="318" x2="392" y2="392" stroke="${C.schwarz}" stroke-width="44" stroke-linecap="round"/>
      <circle cx="200" cy="200" r="${R}" fill="none" stroke="${C.schwarz}" stroke-width="22"/>
      <path d="M110 140 A110 110 0 0 1 160 96" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>`, {}, root, '0 0 400 400', 400, 400);
  const mx = PX + 230 / 460 * pol.ps, my = PY + 303 / 460 * pol.ps;
  return (t) => {
    head.update(t);
    place(pol.node, 540, 900, 1, 0);
    // Weg der Lupe: oben links -> rechts -> Mund
    const a = pr(t, .2, D * .62, ease.inOutSine);
    const pts = [[PX + 120, PY + 140], [PX + pol.ps - 110, PY + 170], [PX + 130, PY + 330], [mx, my]];
    const seg = Math.min(2, Math.floor(a * 3)), f = a * 3 - seg;
    const e = ease.inOutSine(clamp(f));
    let lx = lerp(pts[seg][0], pts[seg + 1][0], e), ly = lerp(pts[seg][1], pts[seg + 1][1], e);
    if (a >= 1) { lx = mx; ly = my; }
    const stop = pr(t, D * .62, D * .62 + .35, ease.outBack);
    const s = lerp(1, 1.12, stop);
    lens.style.left = '0px'; lens.style.top = '0px';
    lens.style.transform = `translate(${lx - R}px, ${ly - R}px) scale(${s})`;
    lens.style.opacity = pr(t, 0, .25);
    inner.style.left = (R - (lx - PX) * M) + 'px'; inner.style.top = (R - (ly - PY) * M) + 'px';
    frame.style.transform = `translate(${lx - 200}px, ${ly - 200}px) scale(${s})`;
    frame.style.left = '0px'; frame.style.top = '0px';
    frame.style.opacity = pr(t, 0, .25);
  };
}};

// s3: Kalender „Termin?“ – Fragezeichen wackelt und löst sich auf
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const l1 = bigText(root, 'Gemacht aussehen?', { x: 90, y: 200, w: 940, size: 100, t0: 0, step: .06 });
  const l2 = bigText(root, '*Nein.*', { x: 90, y: 320, w: 900, size: 150, t0: D * .62, step: .06 });
  const cal = el('div', { left: '170px', top: '560px', width: '740px', height: '740px', background: C.rosaHell, border: `7px solid ${C.schwarz}`, borderRadius: '18px', boxSizing: 'border-box' }, root);
  el('div', { left: '-7px', top: '-7px', width: '740px', height: '130px', background: C.schwarz, borderRadius: '18px 18px 0 0', color: C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: '58px', textAlign: 'center', lineHeight: '130px', letterSpacing: '6px' }, cal, 'MÄRZ');
  [150, 560].forEach(x => el('div', { left: x + 'px', top: '-40px', width: '22px', height: '80px', borderRadius: '11px', background: C.rosaTief, border: `5px solid ${C.schwarz}` }, cal));
  const grid = svg(Array.from({ length: 20 }, (_, i) => {
    const c = i % 5, r = Math.floor(i / 5);
    return `<rect x="${12 + c * 130}" y="${12 + r * 130}" width="110" height="110" rx="10" fill="#fff" opacity="${i === 12 ? 0 : .9}"/>
      <text x="${26 + c * 130}" y="${52 + r * 130}" font-family="Bricolage Grotesque" font-weight="600" font-size="30" fill="${C.schwarz}" opacity="${i === 12 ? 0 : .5}">${i + 3}</text>`;
  }).join(''), { left: '34px', top: '140px' }, cal, '0 0 660 540', 660, 540);
  const ring = svg(`<ellipse cx="130" cy="80" rx="120" ry="66" fill="none" stroke="${C.beere}" stroke-width="7" transform="rotate(-4 130 80)"/>`, {}, root, '0 0 260 160', 260, 160);
  const word = el('div', { left: 0, top: 0, fontFamily: F.hand, fontWeight: 700, fontSize: '84px', color: C.schwarz, whiteSpace: 'nowrap' }, root, 'Termin');
  const q = el('div', { left: 0, top: 0, fontFamily: F.hand, fontWeight: 700, fontSize: '120px', color: C.beere, width: '60px', height: '130px', lineHeight: '130px', textAlign: 'center' }, root, '?');
  const strike = svg(`<path d="M10 40 C80 30 160 46 250 26" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 260 70', 260, 70);
  const puffs = Array.from({ length: 7 }, () => svg(puff, {}, root, '0 0 40 40', 40, 40));
  const cx = 170 + 34 + (12 + 2 * 130 + 55) * 1, cy = 560 + 140 + 12 + 2 * 130 + 55;
  return (t) => {
    l1.update(t); l2.update(t);
    cal.style.transform = `translateY(${tw(t, 0, .5, 80, 0)}px) rotate(${tw(t, 0, .6, -5, -1.5, ease.outBack)}deg)`;
    cal.style.opacity = pr(t, 0, .2);
    place(ring, cx + 10, cy, 1, 0, pr(t, .3, .6));
    place(word, cx - 30, cy + 2, 1, -5, pr(t, .4, .8));
    // Fragezeichen wackelt, dann Auflösung
    const wob = Math.sin(t * 14) * 14 * pr(t, .9, 1.2) * (1 - pr(t, D * .5, D * .52));
    const gone = pr(t, D * .5, D * .5 + .25);
    place(q, cx + 150, cy - 6, 1 + gone * .3, wob - 4, pr(t, .6, .9) * (1 - gone));
    strike.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, D * .64, D * .64 + .4, ease.inOutCubic));
    place(strike, cx - 30, cy + 8, 1, -3);
    puffs.forEach((p, i) => {
      const k = pr(t, D * .5, D * .5 + .9, ease.outCubic), ang = i / 7 * Math.PI * 2 + .4;
      place(p, cx + 150 + Math.cos(ang) * 120 * k, cy - 6 + Math.sin(ang) * 110 * k - 40 * k, (1 - k) * (.5 + (i % 3) * .3), 0, k > 0 && k < 1 ? 1 - k * .6 : 0);
    });
  };
}};

// s4: Abend – Fenster mit Mond, Nachttisch, Lampe geht an
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Abends. *In* *Ruhe.*', { x: 90, y: 200, w: 900, size: 124, color: C.weiss, accent: C.rosa, t0: 0, step: .08 });
  const glow = svg(`<defs><radialGradient id="ov03g"><stop offset="0" stop-color="${WARM}" stop-opacity=".55"/><stop offset=".5" stop-color="${WARM}" stop-opacity=".18"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient></defs><circle cx="300" cy="300" r="300" fill="url(#ov03g)"/>`, {}, root, '0 0 600 600', 1100, 1100);
  const win = svg(`<rect x="0" y="0" width="420" height="460" rx="10" fill="#120c15"/>
      <rect x="22" y="22" width="376" height="416" rx="6" fill="#241a2a"/>
      <g transform="translate(150 50) scale(.62)">${ART.moon(MOND)}</g>
      ${ART.star(90, 110, 1.1, MOND)}${ART.star(120, 330, .8, MOND)}${ART.star(320, 380, 1, MOND)}
      <line x1="210" y1="20" x2="210" y2="440" stroke="#120c15" stroke-width="14"/><line x1="20" y1="230" x2="400" y2="230" stroke="#120c15" stroke-width="14"/>
      <path d="M-20 -10 C40 120 30 300 -10 480 L-40 480 L-40 -10Z" fill="${C.rosaTief}"/><path d="M440 -10 C380 120 390 300 430 480 L460 480 L460 -10Z" fill="${C.rosaTief}"/>`, {}, root, '0 0 420 480', 420, 480);
  const tw2 = svg([[60, 60], [350, 40], [40, 300]].map(([x, y]) => ART.star(x, y, 1, MOND)).join(''), {}, root, '0 0 400 400', 400, 400);
  const table = svg(`<rect x="40" y="0" width="520" height="34" rx="8" fill="${C.weiss}"/>
      <rect x="70" y="34" width="460" height="230" rx="6" fill="#EADBD3"/>
      <rect x="100" y="70" width="400" height="80" rx="8" fill="none" stroke="${C.schwarz}" stroke-width="5" opacity=".35"/>
      <rect x="270" y="102" width="60" height="16" rx="8" fill="${C.schwarz}"/>
      <rect x="90" y="264" width="30" height="50" fill="#EADBD3"/><rect x="480" y="264" width="30" height="50" fill="#EADBD3"/>`, {}, root, '0 0 600 320', 600, 320);
  const lampN = svg(ART.lamp(0), {}, root, '0 0 400 400', 420, 420);
  const dish = svg(`<ellipse cx="200" cy="250" rx="150" ry="34" fill="${C.weiss}"/><ellipse cx="200" cy="244" rx="120" ry="22" fill="${C.rosaHell}"/>
      <g transform="translate(200 214) rotate(-8) scale(.62) translate(-200 -200)">${ART.tape(true)}</g>`, {}, root, '0 0 400 300', 300, 225);
  return (t) => {
    head.update(t);
    const on = pr(t, D * .35, D * .35 + .25);
    place(win, 300, 720, 1, 0);
    place(tw2, 300, 700, 1, 0, .45 + .45 * Math.abs(Math.sin(t * 1.6)));
    place(glow, 360, 1000, .9 + on * .1, 0, on);
    place(table, 560, 1220, 1);
    lampN.querySelector('svg').innerHTML = ART.lamp(on);
    place(lampN, 400, 950, 1, 0);
    place(dish, 690, 1036 + noise(t, 3) * 2, 1, 0);
  };
}};

// s5: Tape legt sich auf die Lippen, Pflege in der Mitte
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Spendet über Nacht *Feuchtigkeit.*', { x: 90, y: 200, w: 900, size: 108, t0: D * .42, step: .06 });
  const pre = bigText(root, 'Abends: *Tape* drauf.', { x: 90, y: 200, w: 900, size: 118, t0: 0, step: .06 });
  const d = 720, cx = 540, cy = 930;
  const cam = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden' }, root);
  svg(`<path d="M160 70 C186 92 214 92 240 70" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`, { left: 0, top: 0 }, cam, '0 0 400 400', d, d);
  svg(ART.lips(.5), { left: d * .07 + 'px', top: d * .07 + 'px' }, cam, '0 0 400 400', d * .86, d * .86);
  const mouthY = cy + d * .07 + d * .43 - d / 2 + 6;
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 640, 640);
  const drops = [0, 1, 2].map(() => svg(`<path d="M50 6 C66 30 82 46 82 64 A32 32 0 0 1 18 64 C18 46 34 30 50 6Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="5" stroke-linejoin="round"/><path d="M34 64 A16 16 0 0 0 46 82" stroke="${C.rosaTief}" stroke-width="6" fill="none" stroke-linecap="round"/>`, {}, root, '0 0 100 100', 100, 100));
  const n = note(root, 'Pflege in der Mitte', { x: 330, y: 1200, r: -3, t0: D * .3, size: 70 });
  return (t) => {
    pre.update(t); pre.node.style.opacity = 1 - pr(t, D * .36, D * .42);
    head.update(t);
    const k = pr(t, .3, 1.3, ease.outCubic);
    const land = pr(t, 1.2, 1.5, ease.outBack);
    place(cam, cx, cy, 1, 0);
    cam.style.transform = `translate(0,0) scale(${1 + Math.sin(clamp((t - 1.25) / .3) * Math.PI) * .015})`;
    cam.style.left = (cx - d / 2) + 'px'; cam.style.top = (cy - d / 2) + 'px';
    place(tape, lerp(cx + 260, cx, k), lerp(mouthY - 520, mouthY, k), lerp(1.15, 1, land), lerp(-24, -2, k));
    drops.forEach((dr, i) => {
      const t0 = D * .45 + i * .45, cyc = ((t - t0) % 1.6 + 1.6) % 1.6 / 1.6, on = t > t0 ? 1 : 0;
      const x = cx + (i - 1) * 110;
      place(dr, x, mouthY - 60 - cyc * 150, .7 + Math.sin(cyc * Math.PI) * .25, 0, on * Math.sin(cyc * Math.PI));
    });
    n.update(t);
  };
}};

// s6: Morgens am Badspiegel, ein Herz malt sich auf das Glas
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Wieder gern in den *Spiegel.*', { x: 90, y: 200, w: 900, size: 116, t0: D * .38, step: .06 });
  const pre = bigText(root, 'Morgens: *weich.*', { x: 90, y: 200, w: 900, size: 124, t0: 0, step: .06 });
  const tiles = svg(Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1080" y2="${i * 120}" stroke="${C.weiss}" stroke-width="6"/>`).join('') +
    Array.from({ length: 10 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="1440" stroke="${C.weiss}" stroke-width="6"/>`).join(''), {}, root, '0 0 1080 1440', 1080, 1440);
  const rays = svg(`<path d="M0 0 L300 0 L900 1440 L420 1440Z" fill="${WARM}" opacity=".45"/><path d="M380 0 L470 0 L1080 1300 L1080 1440 L1000 1440Z" fill="${WARM}" opacity=".4"/>`, {}, root, '0 0 1080 1440', 1080, 1440);
  const mirror = el('div', { left: '230px', top: '540px', width: '620px', height: '760px', borderRadius: '310px 310px 40px 40px', background: '#E4EEF0', border: `14px solid ${C.schwarz}`, overflow: 'hidden', boxSizing: 'border-box' }, root);
  const face = svg(woman({ mood: 'smile', streak: true, top: C.rosaTief }), { left: '50px', top: '170px' }, mirror, '0 0 400 460', 500, 575);
  svg(`<path d="M60 160 L170 40 M70 260 L230 80" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".7"/>`, { left: 0, top: 0 }, mirror, '0 0 620 760', 620, 760);
  const heart = svg(`<path d="M100 160 C40 120 20 80 40 52 C60 26 92 34 100 62 C108 34 140 26 160 52 C180 80 160 120 100 160Z" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 200 200', 200, 200);
  const shelf = svg(`<rect x="0" y="0" width="760" height="30" rx="10" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>`, {}, root, '0 0 760 40', 760, 40);
  return (t) => {
    pre.update(t); pre.node.style.opacity = 1 - pr(t, D * .32, D * .38);
    head.update(t);
    place(tiles, 540, 1280, 1);
    place(rays, 540 + tw(t, 0, D, -40, 40, ease.lin), 1280, 1, 0, pr(t, 0, .8));
    face.style.transform = `translateY(${noise(t, 2) * 4}px) rotate(${noise(t, 5) * 1.2}deg)`;
    const a = pr(t, D * .48, D * .48 + 1.0, ease.inOutCubic);
    heart.querySelector('path').setAttribute('stroke-dashoffset', 1 - a);
    place(heart, 680, 740, .85, 8);
    place(shelf, 540, 1316, 1);
  };
}};

// s7: Das Foto kommt an den Kühlschrank, Herz-Magnet drauf
SCENES.s7 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const fridge = svg(`<rect x="10" y="10" width="580" height="1080" rx="40" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="10"/>
      <line x1="10" y1="400" x2="590" y2="400" stroke="${C.schwarz}" stroke-width="10"/>
      <rect x="520" y="120" width="26" height="200" rx="13" fill="${C.schwarz}"/><rect x="520" y="460" width="26" height="260" rx="13" fill="${C.schwarz}"/>
      <rect x="70" y="520" width="170" height="210" fill="#fff" stroke="${C.schwarz}" stroke-width="4" transform="rotate(-4 155 625)"/>
      <path d="M95 570 L210 562 M97 610 L190 604 M99 650 L200 644" stroke="${C.schwarz}" stroke-width="5" stroke-linecap="round" opacity=".45" transform="rotate(-4 155 625)"/>
      <circle cx="150" cy="526" r="18" fill="${C.schwarz}"/>
      <circle cx="420" cy="560" r="30" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="5"/>
      <rect x="380" y="660" width="90" height="56" rx="10" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="5" transform="rotate(6 425 688)"/>
      <rect x="60" y="1080" width="60" height="30" rx="6" fill="${C.schwarz}"/><rect x="480" y="1080" width="60" height="30" rx="6" fill="${C.schwarz}"/>`, {}, root, '0 0 600 1120', 580, 1083);
  const pol = polaroid(root, 340, '1998');
  const mag = svg(ART.heart(C.beere), {}, root, '0 0 400 400', 120, 120);
  const n = note(root, 'da gehört es hin.', { x: 310, y: 1170, r: -5, t0: D * .62, size: 62 });
  return (t) => {
    place(fridge, 540, 820, 1);
    const k = pr(t, .1, 1.0, ease.outCubic);
    const fx = 470, fy = 490;
    place(pol.node, lerp(1250, fx, k), lerp(160, fy, k), lerp(1.2, 1, k), lerp(40, -4, k) + Math.sin(clamp((t - 1) / .6) * Math.PI * 2) * 2 * (1 - pr(t, 1, 1.6)));
    const m = pr(t, D * .38, D * .38 + .45, ease.outBack);
    const sq = 1 + Math.sin(clamp((t - D * .38 - .3) / .3) * Math.PI) * .12;
    place(mag, fx, lerp(fy - 400, fy - 210, m), sq, 10, clamp((t - D * .38) / .1));
    n.update(t);
  };
}};
