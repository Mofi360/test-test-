/* OV11 – Bringt Pflege noch was?  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;
const HAIR = '#CBC1C6', HAIR2 = '#A89DA3', MOND = '#F7E7C6', SONNE = '#FFE2A8', GRAU = '#E7DEE1';

// ---------- eigene Illustrationen ----------
/** Frau, 58, silberner Bob, Brille. viewBox 0 0 400 460. mood 'doubt' | 'happy'. sh = Schulterzucken 0..1 */
function woman(o = {}) {
  const S = C.schwarz, mood = o.mood || 'doubt', sh = o.sh || 0, look = o.look || 0;
  const eyes = mood === 'happy'
    ? [156, 244].map(x => `<path d="M${x - 15} 218 Q${x} 202 ${x + 15} 218" fill="none" stroke="${S}" stroke-width="6.5" stroke-linecap="round"/>`).join('')
    : [156, 244].map(x => `<ellipse cx="${x + look}" cy="214" rx="9" ry="11" fill="${S}"/><circle cx="${x + look + 3}" cy="210" r="3" fill="#fff"/>`).join('');
  const brows = mood === 'happy'
    ? `<path d="M128 166 Q154 154 182 164" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/><path d="M218 164 Q246 154 272 166" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/>`
    : `<path d="M128 170 Q154 166 182 172" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/><path d="M218 ${158 - sh * 6} Q246 ${140 - sh * 8} 274 ${154 - sh * 6}" fill="none" stroke="${HAIR2}" stroke-width="7" stroke-linecap="round"/>`;
  const mouth = mood === 'happy'
    ? `<path d="M162 284 Q181 274 200 281 Q219 274 238 284 Q227 293 200 294 Q173 293 162 284Z" fill="${C.lippe}"/>
       <path d="M162 284 Q200 318 238 284 Q227 293 200 294 Q173 293 162 284Z" fill="${C.lippeHell}"/>
       <path d="M162 284 Q200 298 238 284" fill="none" stroke="#9E4058" stroke-width="3" stroke-linecap="round"/>
       <path d="M154 278 Q158 286 164 288 M246 278 Q242 286 236 288" fill="none" stroke="${C.hautDunkel}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<g transform="rotate(-6 200 290)"><path d="M170 288 Q186 281 200 286 Q214 281 230 288 Q222 294 200 295 Q178 294 170 288Z" fill="${C.lippe}"/>
       <path d="M170 288 Q200 306 230 288 Q222 294 200 295 Q178 294 170 288Z" fill="${C.lippeHell}"/>
       <path d="M170 288 Q200 296 230 288" fill="none" stroke="#9E4058" stroke-width="3" stroke-linecap="round"/></g>`;
  return `<g>
    <path d="M66 252 C52 128 118 66 200 66 C282 66 348 128 334 252 C338 304 322 334 300 340 L100 340 C78 334 62 304 66 252Z" fill="${HAIR}"/>
    <path d="${o.long ? 'M-10 1000 L58 470' : 'M60 460'} C60 ${404 - sh * 34} 112 ${370 - sh * 26} 200 370 C288 ${370 - sh * 26} 340 ${404 - sh * 34} 340 460 ${o.long ? 'L342 470 L410 1000' : ''}Z" fill="${o.top || C.schwarz}"/>
    <path d="M168 370 L200 410 L232 370" fill="none" stroke="${o.top === C.weiss ? C.rosaTief : C.weiss}" stroke-width="6" stroke-linejoin="round" opacity=".9"/>
    <rect x="178" y="318" width="44" height="54" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="224" rx="108" ry="122" fill="${C.haut}"/>
    <circle cx="94" cy="272" r="9" fill="${C.weiss}" stroke="${S}" stroke-opacity=".25" stroke-width="2"/>
    <circle cx="306" cy="272" r="9" fill="${C.weiss}" stroke="${S}" stroke-opacity=".25" stroke-width="2"/>
    <path d="M88 214 C84 126 148 90 214 94 C276 98 320 138 314 220 C302 178 276 152 236 144 C204 166 138 156 88 214Z" fill="${HAIR}"/>
    <path d="M150 120 C190 104 240 108 270 130" fill="none" stroke="${HAIR2}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M300 170 C318 210 320 260 312 300" fill="none" stroke="${HAIR2}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    ${brows}${eyes}
    <circle cx="156" cy="214" r="34" fill="#fff" fill-opacity=".14" stroke="${S}" stroke-width="5"/>
    <circle cx="244" cy="214" r="34" fill="#fff" fill-opacity=".14" stroke="${S}" stroke-width="5"/>
    <path d="M190 210 Q200 202 210 210" fill="none" stroke="${S}" stroke-width="5"/>
    <path d="M122 206 L96 196 M278 206 L304 196" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
    <path d="M197 232 C193 250 191 258 203 261" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="126" cy="266" rx="22" ry="12" fill="${C.rosaTief}" opacity=".5"/>
    <ellipse cx="274" cy="266" rx="22" ry="12" fill="${C.rosaTief}" opacity=".5"/>
    ${mouth}
  </g>`;
}

/** Zauberstab mit Funkeln, viewBox 0 0 300 300 */
const wand = `<g transform="rotate(-40 150 150)"><rect x="140" y="70" width="20" height="210" rx="8" fill="${C.schwarz}"/><rect x="140" y="70" width="20" height="40" rx="6" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="5"/></g>
  <path transform="translate(88 70)" d="M0 -46 L11 -12 L46 0 L11 12 L0 46 L-11 12 L-46 0 L-11 -12Z" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="5" stroke-linejoin="round"/>
  ${ART.star(170, 40, 1.1, C.schwarz)}${ART.star(40, 160, .8, C.schwarz)}${ART.star(200, 110, .6, C.rosaTief)}`;
/** Tropfen, viewBox 0 0 100 100 */
const dropS = (f = C.weiss) => `<path d="M50 6 C66 30 82 46 82 64 A32 32 0 0 1 18 64 C18 46 34 30 50 6Z" fill="${f}" stroke="${C.schwarz}" stroke-width="5" stroke-linejoin="round"/><path d="M34 64 A16 16 0 0 0 46 82" stroke="${C.rosaTief}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
/** Lippenpflegestift offen, viewBox 0 0 160 340 */
const balm = `<path d="M50 40 Q50 14 80 10 Q110 14 110 40 L110 120 L50 120Z" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M62 44 Q64 26 78 22" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>
  <rect x="38" y="116" width="84" height="40" rx="6" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>
  <rect x="30" y="152" width="100" height="180" rx="16" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="6"/>
  <rect x="30" y="210" width="100" height="34" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>`;
const sunS = (c = SONNE) => `<circle cx="200" cy="200" r="96" fill="${c}"/>${Array.from({ length: 12 }, (_, i) => `<line x1="200" y1="66" x2="200" y2="30" transform="rotate(${i * 30} 200 200)" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`).join('')}`;
const moonS = (c = MOND) => `<path d="M120 20 A90 90 0 1 0 190 150 A72 72 0 1 1 120 20Z" fill="${c}"/>`;
const drawPath = (node, k) => node.querySelectorAll('[pathLength]').forEach(p => p.setAttribute('stroke-dashoffset', 1 - k));

/** Notizblock mit zwei Spalten „kann“ / „kann nicht“ (HTML). Gibt Teile zurück. */
function notepad(root) {
  const L = 90, T = 470, Wd = 900, Hd = 850;
  const page = el('div', { left: L + 'px', top: T + 'px', width: Wd + 'px', height: Hd + 'px', background: C.weiss, borderRadius: '10px', boxShadow: '0 30px 60px -24px rgba(21,16,18,.35)' }, root);
  // Ringbindung
  svg(Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 98}" y="0" width="18" height="56" rx="9" fill="${C.schwarz}"/>`).join(''), { left: '0px', top: '-30px' }, page, '0 0 900 60', 900, 60);
  // Linien
  svg(Array.from({ length: 9 }, (_, i) => `<line x1="30" y1="${230 + i * 70}" x2="870" y2="${230 + i * 70}" stroke="${C.rosa}" stroke-width="3"/>`).join(''), { left: 0, top: 0 }, page, `0 0 ${Wd} ${Hd}`, Wd, Hd);
  const lines = svg(`<path d="M450 60 C452 300 446 560 450 810" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: 0, top: 0 }, page, `0 0 ${Wd} ${Hd}`, Wd, Hd);
  const ul1 = svg(`<path d="M70 170 C160 162 260 172 380 164" fill="none" stroke="${C.schwarz}" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: 0, top: 0 }, page, `0 0 ${Wd} ${Hd}`, Wd, Hd);
  const ul2 = svg(`<path d="M520 170 C610 162 710 172 830 164" fill="none" stroke="${C.beere}" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: 0, top: 0 }, page, `0 0 ${Wd} ${Hd}`, Wd, Hd);
  const h1 = el('div', { left: '0px', top: '70px', width: '450px', textAlign: 'center', fontFamily: F.display, fontSize: '86px', lineHeight: 1, color: C.schwarz }, page, 'kann');
  const h2 = el('div', { left: '450px', top: '70px', width: '450px', textAlign: 'center', fontFamily: F.display, fontSize: '86px', lineHeight: 1, color: C.beere }, page, 'kann nicht');
  return { page, lines, ul1, ul2, h1, h2, L, T, colL: L + 225, colR: L + 675 };
}

// ---------- s1: Hook, Schulterzucken ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, '„Bei mir bringt *Pflege* eh nichts mehr.“', { x: 90, y: 200, w: 900, size: 112 });
  hook.update(99);
  const words = [...hook.node.querySelectorAll('span')];
  const fr = svg('', {}, root, '0 0 400 460', 600, 690);
  const n = note(root, 'hab ich\njahrelang\ngedacht.', { x: 60, y: 760, r: -6, t0: D * .5, size: 80 });
  return (t) => {
    words.forEach((s, i) => { s.style.transform = `translateY(${noise(t * 1.4, i * 1.7) * 3}px) rotate(${noise(t * 1.2, i * 2.3 + 1) * 1.8}deg)`; });
    // Schulterzucken zweimal
    const sh = Math.max(0, Math.sin(clamp((t - .5) / .9) * Math.PI)) * .9 + Math.max(0, Math.sin(clamp((t - D * .55) / .8) * Math.PI)) * .5;
    fr.querySelector('svg').innerHTML = woman({ mood: 'doubt', sh, look: tw(t, 0, .6, 0, 4) });
    place(fr, 660, 990 - sh * 8 + noise(t, 3) * 2, 1, noise(t, 7) * 1.2 - sh * 2);
    n.update(t);
  };
}};

// ---------- s2: Forum-Zitat ----------
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'In einem Forum stand sogar:', { x: 90, y: 200, w: 900, size: 96, t0: 0, step: .05 });
  const posts = [0, 1, 2, 3].map(i => {
    const p = el('div', { left: '110px', top: '0px', width: '860px', height: '210px', background: i % 2 ? C.rosaHell : '#F6F1F2', borderRadius: '22px' }, root);
    svg(`<circle cx="70" cy="70" r="40" fill="${i % 2 ? C.rosaTief : GRAU}"/><rect x="134" y="44" width="220" height="22" rx="11" fill="${C.schwarz}" opacity=".25"/>
      <rect x="134" y="96" width="640" height="18" rx="9" fill="${C.schwarz}" opacity=".12"/><rect x="134" y="134" width="${520 - i * 60}" height="18" rx="9" fill="${C.schwarz}" opacity=".12"/>`, { left: 0, top: 0 }, p, '0 0 860 210', 860, 210);
    return p;
  });
  const q = quoteCard(root, 'No cosmetics will work.', 'Kundin in einem Forum', { y: 720, size: 92, t0: .45, r: -2 });
  return (t) => {
    head.update(t);
    const sc = tw(t, 0, D, 0, -120, ease.inOutSine);
    posts.forEach((p, i) => { p.style.transform = `translateY(${480 + i * 240 + sc}px)`; p.style.opacity = .9 - pr(t, .4, .9) * .35; });
    q.update(t);
  };
}};

// ---------- s3: Zwei Spalten zeichnen sich ----------
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Ganz *ehrlich.*', { x: 90, y: 210, w: 900, size: 130, t0: 0, step: .07 });
  const np = notepad(root);
  const ic1 = svg(ART.check(C.schwarz), {}, root, '0 0 400 400', 150, 150);
  const ic2 = svg(ART.cross(C.beere), {}, root, '0 0 400 400', 150, 150);
  return (t) => {
    head.update(t);
    const k = pr(t, .1, .7, ease.outBack);
    np.page.style.transform = `translateY(${(1 - k) * 140}px) rotate(${lerp(-4, -1, k)}deg)`;
    np.page.style.opacity = pr(t, .1, .3);
    drawPath(np.lines, pr(t, .6, 1.3, ease.inOutCubic));
    const a = pr(t, 1.1, 1.6), b = pr(t, 1.7, 2.2);
    np.h1.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; np.h2.style.clipPath = `inset(0 ${100 - b * 100}% 0 0)`;
    drawPath(np.ul1, pr(t, 1.4, 1.8)); drawPath(np.ul2, pr(t, 2.0, 2.4));
    const c1 = pr(t, D * .62, D * .62 + .4, ease.outBack), c2 = pr(t, D * .75, D * .75 + .4, ease.outBack);
    place(ic1, np.colL, np.T + 380, c1, -4, clamp(c1 * 3));
    place(ic2, np.colR, np.T + 380, c2, 4, clamp(c2 * 3));
  };
}};

// ---------- s4: Kein Wundermittel ----------
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Kein *Wundermittel.*', { x: 90, y: 230, w: 960, size: 100, t0: 0, step: .06 });
  const np = notepad(root);
  np.page.style.transform = 'rotate(-1deg)';
  drawPath(np.lines, 1); drawPath(np.ul1, 1); drawPath(np.ul2, 1);
  const wd = svg(wand, {}, root, '0 0 300 300', 300, 300);
  const tag = el('div', { left: 0, top: 0, width: '420px', padding: '24px 10px', textAlign: 'center', background: C.rosa, borderRadius: '16px', border: `5px solid ${C.schwarz}`, boxSizing: 'border-box', fontFamily: F.sans, fontWeight: 700, fontSize: '38px', color: C.schwarz, whiteSpace: 'nowrap' }, root, 'Wunder über Nacht');
  const st1 = svg(`<path d="M20 200 C90 150 190 90 280 40" fill="none" stroke="${C.beere}" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 300 240', 300, 240);
  const st2 = svg(`<path d="M10 40 C120 30 260 46 400 28" fill="none" stroke="${C.beere}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 410 70', 410, 70);
  return (t) => {
    head.update(t);
    const a = pr(t, 0, .35, ease.outBack), b = pr(t, .25, .6, ease.outBack);
    place(wd, np.colR, np.T + 400 + noise(t, 2) * 3, a * .95, noise(t, 4) * 3, clamp(a * 3));
    place(tag, np.colR, np.T + 670, b, -3, clamp(b * 3));
    drawPath(st1, pr(t, D * .35, D * .35 + .3, ease.inOutCubic)); place(st1, np.colR, np.T + 400, 1);
    drawPath(st2, pr(t, D * .55, D * .55 + .3, ease.inOutCubic)); place(st2, np.colR, np.T + 684, 1, -3);
  };
}};

// ---------- s5: Es pflegt – über Nacht ----------
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const l1 = bigText(root, 'Es *pflegt.*', { x: 90, y: 200, w: 900, size: 150, color: C.weiss, accent: C.rosa, t0: D * .08, step: .08 });
  const l2 = bigText(root, 'Über Nacht.', { x: 90, y: 360, w: 700, size: 100, color: C.weiss, t0: D * .78, step: .08 });
  const stars = svg([[80, 120, 1], [300, 60, .7], [520, 150, .9], [700, 40, .6], [180, 260, .6]].map(([x, y, s]) => ART.star(x, y, s, MOND)).join(''), {}, root, '0 0 800 300', 800, 300);
  const moon = svg(moonS(), {}, root, '0 0 200 200', 190, 190);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 820, 820);
  const drops = [0, 1, 2].map(() => svg(dropS(C.weiss), {}, root, '0 0 100 100', 110, 110));
  const ings = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'].map(s => el('div', { left: 0, top: 0, fontFamily: F.hand, fontWeight: 700, fontSize: '76px', color: C.weiss, whiteSpace: 'nowrap' }, root, s));
  const lbl = note(root, 'Pflege-Mitte', { x: 100, y: 560, r: -6, t0: D * .2, size: 70, color: C.rosa, arrow: [110, 170], ax: 140, ay: 80 });
  const TX = 540, TY = 930;
  return (t) => {
    l1.update(t); l2.update(t);
    place(stars, 540, 560, 1, 0, .5 + .4 * Math.abs(Math.sin(t * 1.3)));
    place(moon, 880, 600 + noise(t, 1) * 4, 1, -8, pr(t, 0, .6));
    const k = pr(t, .1, .9, ease.outBack);
    place(tape, TX, TY + (1 - k) * 200, lerp(.8, 1, k), lerp(8, -3, k) + noise(t, 5) * .8, clamp(k * 3));
    // Tropfen sinken langsam in die Pflege-Mitte
    drops.forEach((d, i) => {
      const t0 = D * .3 + i * .8, cyc = (((t - t0) % 2.4) + 2.4) % 2.4 / 2.4;
      const x = TX + (i - 1) * 110;
      place(d, x, TY - 290 + ease.inCubic(cyc) * 270, 1 - ease.inCubic(cyc) * .6, 0, t > t0 ? clamp(Math.sin(cyc * Math.PI) * 1.6) : 0);
    });
    ings.forEach((n, i) => {
      const a = pr(t, D * .38 + i * .55, D * .38 + i * .55 + .45, ease.outBack);
      const pos = [[300, 1150], [540, 1235], [790, 1150]][i];
      place(n, pos[0], pos[1], a, [-5, 2, 4][i], clamp(a * 3));
    });
    lbl.update(t);
  };
}};

// ---------- s6: Balsam vs. Tape über die Nacht ----------
SCENES.s6 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Bleibt, wo sie *hin* soll.', { x: 90, y: 200, w: 900, size: 116, t0: D * .1, step: .06 });
  const arc = svg(`<path d="M60 220 Q480 -40 900 220" fill="none" stroke="${C.schwarz}" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round" opacity=".45"/>`, {}, root, '0 0 960 240', 960, 240);
  const mn = svg(moonS(C.schwarz), {}, root, '0 0 200 200', 90, 90);
  const sun = svg(sunS(C.weiss), {}, root, '0 0 400 400', 120, 120);
  const bm = svg(balm, {}, root, '0 0 160 340', 240, 510);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 460, 460);
  const bD = [0, 1, 2].map(() => svg(dropS(C.weiss), {}, root, '0 0 100 100', 74, 74));
  const tD = [0, 1, 2].map(() => svg(dropS(C.weiss), {}, root, '0 0 100 100', 74, 74));
  const lab1 = el('div', { left: '90px', top: '1250px', width: '400px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '54px', color: C.schwarz }, root, 'mein Balsam');
  const lab2 = el('div', { left: '560px', top: '1250px', width: '400px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '54px', color: C.schwarz }, root, 'Tape');
  const gone = note(root, 'weg.', { x: 110, y: 640, r: -8, t0: D * .62, size: 84, color: C.beere });
  const ck = svg(ART.check(C.beere), {}, root, '0 0 400 400', 170, 170);
  const AX = 60, AY = 520; // arc origin auf der Bühne
  return (t) => {
    head.update(t);
    place(arc, 540, 600, 1, 0, pr(t, 0, .5));
    // Mond wandert von Abend zu Morgen
    const m = pr(t, .4, D * .72, ease.inOutSine);
    const qx = (1 - m) * (1 - m) * 60 + 2 * m * (1 - m) * 480 + m * m * 900, qy = (1 - m) * (1 - m) * 220 + 2 * m * (1 - m) * -40 + m * m * 220;
    const morn = pr(t, D * .72, D * .72 + .4);
    place(mn, AX + qx, AY + qy, 1, 0, 1 - morn);
    place(sun, AX + 900, AY + 220 - morn * 20, morn, t * 20, morn);
    place(bm, 290, 990, 1, -6 + noise(t, 2) * 1);
    place(tp, 760, 960, 1, -4 + noise(t, 4) * 1);
    // Balsam-Tropfen rutschen im Lauf der Nacht weg
    bD.forEach((d, i) => {
      const s = pr(t, D * .25 + i * .5, D * .25 + i * .5 + 1.4, ease.inCubic);
      const bx = 290 + (i - 1) * 100, by = 760 + (i % 2) * 40;
      place(d, bx + s * (i - 1) * 60, by + s * 380, 1 - s * .5, s * 40 * (i - 1), (1 - s) * pr(t, 0, .4));
    });
    tD.forEach((d, i) => {
      const bx = 760 + (i - 1) * 110, by = 810 + (i % 2) * 30;
      place(d, bx, by + Math.sin(t * 2 + i) * 6, 1, 0, pr(t, 0, .4));
    });
    gone.update(t);
    const c = pr(t, D * .78, D * .78 + .4, ease.outBack);
    place(ck, 760, 1140, c, 0, clamp(c * 3));
  };
}};

// ---------- s7: Morgens, 58, ein Herz ----------
SCENES.s7 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const pre = bigText(root, 'Ich bin *58.*', { x: 90, y: 210, w: 900, size: 140, t0: 0, step: .07 });
  const head = bigText(root, 'Für mich bringt es *was.*', { x: 90, y: 210, w: 900, size: 120, t0: D * .62, step: .06 });
  const sun = svg(sunS(SONNE), {}, root, '0 0 400 400', 520, 520);
  const hill = svg(`<path d="M0 120 C260 40 820 40 1080 120 L1080 900 L0 900Z" fill="${C.rosa}"/>`, {}, root, '0 0 1080 900', 1080, 900);
  const fr = svg(woman({ mood: 'happy', top: C.weiss, long: true }), {}, root, '0 0 400 460', 560, 644);
  const soft = note(root, 'morgens: weich.', { x: 90, y: 620, r: -6, t0: D * .25, size: 76 });
  const hearts = [0, 1].map(i => svg(ART.heart(i ? C.rosaTief : C.beere), {}, root, '0 0 400 400', i ? 90 : 140, i ? 90 : 140));
  return (t) => {
    pre.update(t); pre.node.style.opacity = 1 - pr(t, D * .55, D * .62);
    head.update(t);
    const s = pr(t, 0, D * .6, ease.outCubic);
    place(sun, 790, lerp(1150, 800, s), 1, t * 8);
    place(hill, 540, 1570);
    place(fr, 540, 1030 + noise(t, 2) * 3, 1, noise(t, 6) * 1.2);
    soft.update(t);
    hearts.forEach((h, i) => {
      const k = pr(t, D * .72 + i * .25, D * .72 + i * .25 + .5, ease.outBack);
      const fl = Math.sin(t * 2 + i) * 6;
      place(h, i ? 230 : 860, (i ? 1000 : 860) + fl, k, i ? -14 : 12, clamp(k * 3));
    });
  };
}};
