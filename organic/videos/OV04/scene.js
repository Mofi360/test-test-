/* OV04 – Termin zweimal abgesagt  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;
const WARM = '#FFF1D6', MOND = '#F7E7C6', S = C.schwarz;
const HAIR = '#6E5D63', HAIR_LIGHT = '#B9AAAF';

// ---------- eigene Illustrationen ----------
/** Wandkalender, viewBox 0 0 700 640. a, b = Durchstreich-Fortschritt der zwei Einträge (0..1) */
const CAL = { x0: 56, y0: 250, cw: 84, ch: 92, e1: [1, 0], e2: [4, 2] };
function calendar(a = 0, b = 0) {
  const { x0, y0, cw, ch } = CAL;
  const rings = [150, 270, 430, 550].map(x => `<rect x="${x - 9}" y="50" width="18" height="70" rx="9" fill="${S}"/>`).join('');
  const days = ['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((d, i) => `<text x="${x0 + cw * i + cw / 2}" y="${y0 - 22}" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="700" font-size="24" fill="${S}" opacity=".55">${d}</text>`).join('');
  let grid = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const n = r * 7 + c + 3;
    grid += `<rect x="${x0 + cw * c}" y="${y0 + ch * r}" width="${cw}" height="${ch}" fill="none" stroke="${S}" stroke-opacity=".14" stroke-width="2"/>
      <text x="${x0 + cw * c + 10}" y="${y0 + ch * r + 30}" font-family="Bricolage Grotesque" font-weight="600" font-size="22" fill="${S}" opacity=".6">${n}</text>`;
  }
  const entry = ([c, r], k, label) => {
    const x = x0 + cw * c, y = y0 + ch * r;
    return `<rect x="${x + 4}" y="${y + 36}" width="${cw * 2 - 8}" height="52" rx="10" fill="${C.rosaHell}" stroke="${C.rosaTief}" stroke-width="3"/>
      <text x="${x + cw}" y="${y + 76}" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="44" fill="${S}">${label}</text>
      <path d="M${x - 4} ${y + 70} C${x + cw * .6} ${y + 52} ${x + cw * 1.4} ${y + 80} ${x + cw * 2 + 6} ${y + 58}" fill="none" stroke="${C.beere}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - k}" opacity="${k > 0.001 ? 1 : 0}"/>`;
  };
  return `<rect x="16" y="88" width="668" height="540" rx="18" fill="${S}" opacity=".12" transform="translate(10 14)"/>
    <rect x="16" y="88" width="668" height="540" rx="18" fill="${C.weiss}" stroke="${S}" stroke-width="6"/>
    <rect x="16" y="88" width="668" height="96" rx="18" fill="${S}"/><rect x="16" y="150" width="668" height="34" fill="${S}"/>
    <text x="350" y="160" text-anchor="middle" font-family="Gloock" font-size="56" fill="${C.weiss}">März</text>
    ${rings}${days}${grid}${entry(CAL.e1, a, 'Termin')}${entry(CAL.e2, b, 'Termin')}`;
}
/** Position (Calendar-Koordinaten) des Strich-Endes für Eintrag e bei Fortschritt k */
function strokePt(e, k) {
  const [c, r] = e, x = CAL.x0 + CAL.cw * c, y = CAL.y0 + CAL.ch * r;
  return [lerp(x - 4, x + CAL.cw * 2 + 6, k), y + 64 + Math.sin(k * Math.PI * 2) * -6];
}
/** Filzstift, viewBox 0 0 120 400, Spitze bei (60, 392) */
const marker = `<path d="M44 300 L76 300 L66 380 Q60 396 54 380Z" fill="${C.beere}"/>
  <rect x="30" y="40" width="60" height="266" rx="14" fill="${C.weiss}" stroke="${S}" stroke-width="6"/>
  <rect x="30" y="200" width="60" height="40" fill="${C.beere}"/>
  <rect x="26" y="0" width="68" height="70" rx="16" fill="${S}"/>`;

/** Sie (57), Kopf mit Schultern, viewBox 0 0 400 460. worry 0..1 */
function her(worry = 1, look = 0) {
  const by = 176 - worry * 4;
  return `<g>
    <path d="M50 460 C50 386 116 356 200 356 C284 356 350 386 350 460Z" fill="${C.rosaTief}"/>
    <path d="M160 356 L200 400 L240 356Z" fill="${C.haut}"/>
    <rect x="174" y="316" width="52" height="54" fill="${C.hautDunkel}"/>
    <path d="M70 250 C56 130 120 76 200 76 C280 76 344 130 330 250 C334 300 320 330 300 336 L100 336 C80 330 66 300 70 250Z" fill="${HAIR}"/>
    <ellipse cx="200" cy="228" rx="112" ry="124" fill="${C.haut}"/>
    <path d="M88 210 C92 120 150 92 214 96 C252 98 300 120 314 200 C290 150 252 130 210 128 C176 150 130 160 88 210Z" fill="${HAIR}"/>
    <path d="M150 112 C190 104 240 112 270 140" fill="none" stroke="${HAIR_LIGHT}" stroke-width="7" stroke-linecap="round"/>
    <path d="M110 160 C130 130 160 118 196 114" fill="none" stroke="${HAIR_LIGHT}" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path d="M132 ${by + 6} Q152 ${by - 6 - worry * 4} 174 ${by - 8 * worry}" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M226 ${by - 8 * worry} Q248 ${by - 6 - worry * 4} 268 ${by + 6}" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="${154 + look * 8}" cy="212" rx="10" ry="12" fill="${S}"/><ellipse cx="${246 + look * 8}" cy="212" rx="10" ry="12" fill="${S}"/>
    <path d="M134 236 Q154 244 172 238 M228 238 Q246 244 266 236" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    <path d="M196 226 C192 250 190 258 202 262" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M172 300 Q186 292 200 296 Q214 292 228 300 Q214 312 200 312 Q186 312 172 300Z" fill="${C.lippe}"/>
    <path d="M150 318 C160 326 170 330 176 330 M250 318 C240 326 230 330 224 330" fill="none" stroke="${C.hautDunkel}" stroke-width="3" stroke-linecap="round" opacity=".5"/>
  </g>`;
}
/** Sorgen-Wolke, viewBox 0 0 300 200. kind: '?' | 'eye' */
function cloud(kind = '?') {
  const inner = kind === 'eye'
    ? `<path d="M100 104 Q150 62 200 104 Q150 146 100 104Z" fill="${C.weiss}" stroke="${S}" stroke-width="6"/><circle cx="150" cy="104" r="18" fill="${S}"/><circle cx="156" cy="98" r="5" fill="#fff"/>`
    : `<text x="150" y="132" text-anchor="middle" font-family="Gloock" font-size="96" fill="${C.beere}">?</text>`;
  return `<path d="M70 160 C30 160 20 116 52 100 C44 60 92 40 116 62 C130 26 196 26 206 66 C240 50 280 80 262 112 C290 128 276 166 240 160Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>${inner}`;
}
/** Pilz-Nachttischlampe, viewBox 0 0 400 460. on 0..1 */
function lamp(on = 0, gid = 'a') {
  return `<defs><radialGradient id="ov04g${gid}"><stop offset="0" stop-color="${WARM}" stop-opacity=".8"/><stop offset=".45" stop-color="${WARM}" stop-opacity=".28"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="200" cy="170" r="330" fill="url(#ov04g${gid})" opacity="${on}"/>
    <path d="M178 230 L222 230 L232 410 L168 410Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="120" y="404" width="160" height="34" rx="17" fill="${S}"/>
    <path d="M70 236 C70 120 130 70 200 70 C270 70 330 120 330 236Z" fill="${on > .5 ? '#FCE7C4' : C.rosaHell}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M118 190 C120 150 140 120 170 104" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".75"/>
    <rect x="62" y="228" width="276" height="16" rx="8" fill="${S}"/>`;
}
/** Nachttisch-Platte, viewBox 0 0 900 300 */
const table = `<rect x="40" y="40" width="820" height="40" rx="10" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
  <rect x="90" y="80" width="720" height="220" fill="${C.rosaTief}" stroke="${S}" stroke-width="7"/>
  <rect x="140" y="120" width="620" height="120" rx="8" fill="none" stroke="${S}" stroke-width="5" opacity=".35"/>
  <rect x="410" y="168" width="80" height="20" rx="10" fill="${S}"/>`;
/** Pflege-Mitte (separat), viewBox 0 0 400 400 */
const pad = `<g transform="translate(200 200)"><rect x="-120" y="-44" width="240" height="88" rx="44" fill="${C.rosaTief}" stroke="${S}" stroke-opacity=".15" stroke-width="3"/>
  <rect x="-100" y="-30" width="90" height="16" rx="8" fill="#fff" opacity=".4"/>
  ${[[-60, 14], [-20, -6], [30, 18], [70, -10], [0, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" opacity=".45"/>`).join('')}</g>`;
/** Untere Gesichtshälfte im Rund */
function cameo(root, cx, cy, d) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden', boxShadow: `0 0 0 8px ${C.weiss}` }, root);
  svg(`<path d="M184 0 C188 40 184 66 168 80 C186 90 214 90 232 80 C216 66 212 40 216 0" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M150 340 C180 356 220 356 250 340" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`, { left: 0, top: 0 }, c, '0 0 400 400', d, d);
  svg(ART.lips(.55), { left: (d * .1) + 'px', top: (d * .1) + 'px' }, c, '0 0 400 400', d * .8, d * .8);
  return c;
}
/** Fenster, viewBox 0 0 500 420 */
function windowSvg(sky, inner) {
  return `<defs><clipPath id="ov04w"><rect x="22" y="22" width="456" height="356" rx="8"/></clipPath></defs>
    <rect x="22" y="22" width="456" height="356" rx="8" fill="${sky}"/>
    <g clip-path="url(#ov04w)">${inner}</g>
    <rect x="16" y="16" width="468" height="368" rx="12" fill="none" stroke="${S}" stroke-width="12"/>
    <line x1="250" y1="20" x2="250" y2="380" stroke="${S}" stroke-width="10"/>
    <rect x="-10" y="380" width="520" height="28" rx="8" fill="${S}"/>`;
}
/** Schloss, viewBox 0 0 200 240 */
const lock = (k = 0) => `<path d="M58 ${110 - k * 26} L58 70 A42 42 0 0 1 142 70 L142 110" fill="none" stroke="${S}" stroke-width="18" stroke-linecap="round"/>
  <rect x="30" y="104" width="140" height="120" rx="22" fill="${C.beere}" stroke="${S}" stroke-width="6"/>
  <circle cx="100" cy="152" r="14" fill="${S}"/><rect x="93" y="152" width="14" height="38" rx="6" fill="${S}"/>`;
const spark = (c = '#fff') => `<path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4Z" fill="${c}"/>`;

// ---------- s1: Kalender, zweimal durchgestrichen ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Ich hab den Termin abgesagt. *Zweimal.*', { y: 220, size: 112 });
  hook.update(10); // statisch: ab Frame 0 lesbar
  const cal = svg(calendar(), {}, root, '0 0 700 640', 700, 640);
  const pen = svg(marker, {}, root, '0 0 120 400', 84, 280);
  const CX = 540, CY = 975, SC = 1.2; // Kalender-Mitte & Skalierung
  return (t) => {
    const a = pr(t, D * .3, D * .45, ease.inOutSine), b = pr(t, D * .62, D * .77, ease.inOutSine);
    cal.querySelector('svg').innerHTML = calendar(a, b);
    place(cal, CX, CY + noise(t, 1) * 3, SC, -2 + noise(t, 2) * .4);
    // Stift folgt dem aktuellen Strich
    const cur = t < D * .55 ? strokePt(CAL.e1, a) : strokePt(CAL.e2, b);
    const toCanvas = ([x, y]) => {
      const r = -2 * Math.PI / 180, dx = (x - 350) * SC, dy = (y - 320) * SC;
      return [CX + dx * Math.cos(r) - dy * Math.sin(r), CY + dx * Math.sin(r) + dy * Math.cos(r)];
    };
    const [px, py] = toCanvas(cur);
    const vis = pr(t, D * .18, D * .28) * (1 - pr(t, D * .82, D * .9));
    const lift = (t > D * .45 && t < D * .62) ? Math.sin(pr(t, D * .45, D * .62, ease.lin) * Math.PI) * 60 : 0;
    place(pen, px + 52 * Math.sin(.45), py - 135 * Math.cos(.45) - lift - (1 - vis) * 120, 1, 26, vis);
  };
}};

// ---------- s2: Angst-Wolken ----------
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '57. Und zu viel *Angst,* dass es schiefgeht.', { y: 220, size: 100, t0: .05, step: .06 });
  const p = svg(her(0), {}, root, '0 0 400 460', 560, 644);
  const kinds = ['?', 'eye', '?', 'eye'];
  const clouds = kinds.map(k => svg(cloud(k), {}, root, '0 0 300 200', 270, 180));
  const pos = [[220, 690, 1.1], [820, 620, 1.2], [520, 590, .95], [870, 880, .9]];
  const at = [.12, .5, .3, .66];
  return (t) => {
    head.update(t);
    p.querySelector('svg').innerHTML = her(pr(t, .2, 1.2), Math.sin(t * 1.4) * .8);
    place(p, 480, 1000, 1.05);
    clouds.forEach((c, i) => {
      const [x, y, s] = pos[i], k = pr(t, D * at[i], D * at[i] + .6, ease.outBack);
      place(c, x + Math.sin(t * .8 + i * 2) * 26, y + noise(t, i + 3) * 10, s * clamp(k, 0, 1.2), noise(t, i) * 3, clamp(k * 2));
    });
  };
}};

// ---------- s3: Forum-Zitat ----------
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = note(root, 'In einem Forum stand:', { x: 110, y: 300, r: -3, t0: 0, size: 86 });
  const q = quoteCard(root, 'the idea of injects on lips kinda scares me', 'Kundin in einem Forum', { y: 600, size: 80, t0: .25 });
  const n = note(root, 'genau mein Gedanke.', { x: 380, y: 1080, r: -4, t0: D * .55, size: 84, color: C.beere });
  return (t) => { head.update(t + .5); q.update(t); n.update(t); };
}};

// ---------- s4: Lampe an, Tape auf dem Nachttisch ----------
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Also tu ich jetzt *abends* selbst was.', { y: 220, size: 104, color: C.weiss, accent: C.rosa, t0: .05, step: .06 });
  const lp = svg(lamp(0), {}, root, '0 0 400 460', 420, 483);
  const tb = svg(table, {}, root, '0 0 900 300', 860, 287);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 330, 330);
  const klick = note(root, 'klick.', { x: 110, y: 640, r: -6, t0: D * .32, size: 80, color: C.rosa });
  return (t) => {
    head.update(t);
    const on = pr(t, D * .3, D * .36, ease.lin);
    lp.querySelector('svg').innerHTML = lamp(on, 's4');
    place(lp, 330, 900);
    place(tb, 540, 1240);
    const k = pr(t, D * .5, D * .78, ease.outBack);
    place(tp, lerp(1180, 720, k), 1090, .95, lerp(40, -7, k), on);
    klick.update(t);
  };
}};

// ---------- s5: Explosionszeichnung ----------
SCENES.s5 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Außen Baumwolle, in der Mitte *Pflege.*', { y: 220, size: 100, t0: .05, step: .06 });
  const pd = svg(pad, {}, root, '0 0 400 400', 520, 520);
  const top = svg(ART.tape(false), {}, root, '0 0 400 400', 620, 620);
  const nTop = note(root, 'medizinische Baumwolle', { x: 250, y: 480, r: -3, t0: D * .2, size: 64, arrow: [40, 70], ax: 320, ay: 80 });
  const names = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'], xs = [240, 540, 840], at = [.42, .58, .74];
  const lines = svg(names.map((_, i) => `<line x1="${540 + (i - 1) * 90}" y1="0" x2="${xs[i]}" y2="150" stroke="${S}" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join(''), { left: 0, top: '1060px' }, root, '0 0 1080 160', 1080, 160);
  const labels = names.map((n, i) => el('div', { left: (xs[i] - 170) + 'px', width: '340px', top: '1210px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '44px', color: C.schwarz }, root,
    `<span style="display:inline-block;background:${C.weiss};border:4px solid ${S};border-radius:40px;padding:10px 26px">${n}</span>`));
  return (t) => {
    head.update(t); nTop.update(t);
    const sp = pr(t, D * .12, D * .35, ease.inOutCubic);
    place(pd, 540, lerp(860, 1010, sp), 1, 0);
    place(top, 540, lerp(860, 720, sp) + noise(t, 4) * 4, 1, lerp(0, -3, sp));
    const ls = lines.querySelectorAll('line');
    names.forEach((_, i) => {
      const k = pr(t, D * at[i], D * at[i] + .35);
      ls[i].setAttribute('stroke-dashoffset', 1 - k);
      const lk = pr(t, D * at[i] + .2, D * at[i] + .55, ease.outBack);
      labels[i].style.opacity = clamp(lk * 2); labels[i].style.transform = `translateY(${(1 - lk) * 30}px) rotate(${(i - 1) * 2}deg)`;
    });
  };
}};

// ---------- s6: Nacht, Morgen, keiner merkt was ----------
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const h1 = bigText(root, 'Abends *drauf.*', { y: 220, size: 104, t0: .05, step: .07 });
  const h2 = bigText(root, 'Morgens *langsam* ab.', { y: 220, size: 104, t0: D * .3, step: .07 });
  const h3 = bigText(root, 'Keiner merkt *was.*', { y: 220, size: 104, t0: D * .56, step: .07 });
  const win = svg('', {}, root, '0 0 500 420', 340, 286);
  const cam = cameo(root, 540, 1050, 500);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 440, 440);
  const lk = svg(lock(0), {}, root, '0 0 200 240', 210, 252);
  const soft = note(root, 'Nur ich: weich.', { x: 560, y: 380, r: -5, t0: D * .8, size: 80, color: C.beere });
  const sp = [0, 1, 2, 3].map(() => svg(spark(), {}, root, '0 0 100 100', 100, 100));
  const SP = [[400, 1010, 1], [690, 990, .75], [600, 1110, .6], [330, 1080, .5]];
  return (t) => {
    [h1, h2, h3].forEach(h => h.update(t));
    h1.node.style.opacity = 1 - pr(t, D * .26, D * .3, ease.lin);
    h2.node.style.opacity = 1 - pr(t, D * .52, D * .56, ease.lin);
    // Fenster: Nacht -> Tag
    const day = pr(t, D * .26, D * .4, ease.inOutSine);
    const sky = day < .5 ? C.nacht : C.rosaHell;
    const mx = lerp(150, 120, day), my = lerp(120, 460, day), sy = lerp(460, 150, day);
    win.querySelector('svg').innerHTML = windowSvg(sky, `<rect x="0" y="0" width="500" height="420" fill="${C.nachtHell}" opacity="${1 - day}"/>
      <circle cx="${mx}" cy="${my}" r="44" fill="${MOND}"/><circle cx="${mx + 20}" cy="${my - 12}" r="38" fill="${C.nachtHell}" opacity="${1 - day}"/>
      ${ART.star(330, 90, .9, MOND).replace('fill=', `opacity="${1 - day}" fill=`)}${ART.star(400, 200, .6, MOND).replace('fill=', `opacity="${1 - day}" fill=`)}
      <circle cx="350" cy="${sy}" r="62" fill="${C.rosaTief}" opacity="${day}"/>`);
    place(win, 540, 590);
    // Tape: abends drauf, morgens langsam ab (Drehpunkt linkes Ende)
    const on = pr(t, D * .04, D * .2, ease.outCubic);
    const k = pr(t, D * .34, D * .5, ease.inOutSine), off = pr(t, D * .5, D * .58, ease.inCubic);
    const r = -30 * k * Math.PI / 180, half = 187, px = 540 - half, py = lerp(780, 1040, on);
    place(tape, px + Math.cos(r) * half - off * 140, py + Math.sin(r) * half - off * 360, 1, -30 * k - off * 20, on * (1 - off));
    // Schloss
    const lp = pr(t, D * .58, D * .7, ease.outBack);
    lk.querySelector('svg').innerHTML = lock(0);
    place(lk, 860, lerp(700, 850, lp), clamp(lp, 0, 1.1), lerp(-20, 8, lp) + noise(t, 7) * 2, clamp(lp * 2));
    soft.update(t);
    sp.forEach((s, i) => {
      const [x, y, sc] = SP[i];
      const a = pr(t, D * .8 + i * .15, D * .8 + i * .15 + .4, ease.outBack);
      place(s, x, y, sc * a * (.85 + .15 * Math.sin(t * 5 + i)), t * 30 + i * 20, clamp(a));
    });
  };
}};

// ---------- s7: Kalender zu, Ritual, Licht aus ----------
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const wrap = el('div', { left: '220px', top: '420px', width: '640px', height: '585px', perspective: '1200px' }, root);
  const cal = svg(calendar(1, 1), { left: 0, top: 0, transformOrigin: '50% 14%' }, wrap, '0 0 700 640', 640, 585);
  const q = note(root, 'Weiß ich nicht.', { x: 300, y: 1090, r: -4, t0: D * .15, size: 90, color: C.rosa });
  const head = bigText(root, 'Aber abends: *mein* *Ritual.*', { y: 220, size: 108, color: C.weiss, accent: C.rosa, t0: D * .45, step: .07 });
  const lp = svg(lamp(1), {}, root, '0 0 400 460', 360, 414);
  const tb = svg(table, {}, root, '0 0 900 300', 860, 287);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const dark = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.nacht }, root);
  return (t) => {
    q.update(t); head.update(t);
    const shut = pr(t, D * .36, D * .5, ease.inCubic);
    cal.style.transform = `rotateX(${shut * 90}deg)`;
    cal.style.opacity = 1 - pr(t, D * .48, D * .52, ease.lin);
    q.node.style.opacity = Math.min(+q.node.style.opacity, 1 - pr(t, D * .44, D * .5, ease.lin));
    const offT = D * .86, off = t > offT ? 1 : 0;
    lp.querySelector('svg').innerHTML = lamp(1 - off, 's7');
    const ap = pr(t, D * .48, D * .62, ease.outCubic);
    place(lp, 330, 960 + (1 - ap) * 60, 1, 0, ap); place(tb, 540, 1265 + (1 - ap) * 40, 1, 0, ap); place(tp, 720, 1110 + (1 - ap) * 80, .95, -7, pr(t, D * .58, D * .7));
    dark.style.opacity = .55 * pr(t, offT, offT + .08, ease.lin);
  };
}};
