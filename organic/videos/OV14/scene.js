/* OV14 – Night Routine: der unerwartete letzte Schritt  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

// ---------- eigene Illustrationen ----------
const WARM = '#FFE7B0', OFF = '#5B4A52', GLASS = '#FFF6F8';
const S = C.schwarz;

/** Lichterkette: Draht mit Glühbirnen. on(i) -> 0..1. viewBox 0 0 1000 200 */
function lights(on) {
  const pts = Array.from({ length: 9 }, (_, i) => [40 + i * 115, 70 + Math.sin(i / 8 * Math.PI) * 70 + (i % 2) * 8]);
  const wire = 'M' + pts.map(p => p.join(' ')).join(' L');
  return `<path d="M0 40 C200 150 800 150 1000 40" fill="none" stroke="${S}" stroke-width="4" opacity=".7"/>
    ${pts.map(([x], i) => { const y = 40 + Math.sin((x / 1000) * Math.PI) * 82; const k = on(i);
      return `<g transform="translate(${x} ${y})">
        <circle cx="0" cy="24" r="34" fill="${WARM}" opacity="${.28 * k}"/>
        <rect x="-7" y="-4" width="14" height="12" rx="3" fill="${S}"/>
        <path d="M0 6 C14 12 16 28 0 40 C-16 28 -14 12 0 6Z" fill="${k > .5 ? WARM : OFF}" opacity="${lerp(.85, 1, k)}"/>
      </g>`; }).join('')}`;
}

/** Badspiegel (Bogen) mit Ablage. viewBox 0 0 600 760 */
function mirrorShelf() {
  return `<path d="M90 560 L90 250 C90 120 190 40 300 40 C410 40 510 120 510 250 L510 560Z" fill="${S}"/>
    <path d="M114 548 L114 252 C114 136 200 64 300 64 C400 64 486 136 486 252 L486 548Z" fill="${GLASS}"/>
    <path d="M170 220 L250 130 M168 300 L300 150" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
    <path d="M150 470 L250 380" stroke="${C.rosa}" stroke-width="10" stroke-linecap="round" opacity=".6"/>
    <rect x="20" y="610" width="560" height="26" rx="13" fill="${S}"/>
    <!-- Toner -->
    <rect x="70" y="480" width="70" height="130" rx="14" fill="${C.rosaTief}"/><rect x="88" y="452" width="34" height="30" rx="6" fill="${S}"/><rect x="80" y="530" width="50" height="34" rx="4" fill="#fff" opacity=".8"/>
    <!-- Serum -->
    <rect x="172" y="520" width="60" height="90" rx="12" fill="#fff" stroke="${S}" stroke-width="5"/><rect x="190" y="470" width="24" height="52" rx="10" fill="${S}"/>
    <!-- Creme -->
    <rect x="262" y="560" width="110" height="50" rx="12" fill="${C.rosaHell}" stroke="${S}" stroke-width="5"/><rect x="256" y="540" width="122" height="24" rx="8" fill="${S}"/>
    <!-- freier Platz -->
    <rect x="410" y="490" width="140" height="118" rx="16" fill="none" stroke="${S}" stroke-width="5" stroke-dasharray="14 12"/>`;
}

// Routine-Produkte (viewBox 0 0 400 400)
const ITEM = {
  pad: () => `<circle cx="200" cy="200" r="150" fill="#fff" stroke="${S}" stroke-width="8"/>
    ${[[140, 140], [200, 120], [260, 140], [120, 200], [180, 190], [240, 200], [290, 210], [150, 260], [210, 270], [260, 260]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${S}" opacity=".18"/>`).join('')}
    <path d="M150 230 C180 200 240 210 262 240 C240 262 180 266 150 230Z" fill="${C.beere}" opacity=".35"/>
    <path d="M120 170 C150 150 200 160 230 150" stroke="${S}" stroke-opacity=".25" stroke-width="10" stroke-linecap="round" fill="none"/>`,
  toner: () => `<rect x="130" y="120" width="140" height="240" rx="28" fill="${C.rosaTief}" stroke="${S}" stroke-width="8"/>
    <rect x="166" y="60" width="68" height="64" rx="10" fill="${S}"/>
    <rect x="152" y="200" width="96" height="80" rx="8" fill="#fff"/><rect x="168" y="224" width="64" height="10" rx="5" fill="${S}" opacity=".5"/><rect x="168" y="246" width="44" height="10" rx="5" fill="${S}" opacity=".3"/>
    <path d="M150 140 L150 340" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".4"/>`,
  serum: () => `<rect x="140" y="190" width="120" height="170" rx="22" fill="#fff" stroke="${S}" stroke-width="8"/>
    <rect x="150" y="250" width="100" height="100" rx="14" fill="${C.rosa}"/>
    <rect x="170" y="150" width="60" height="44" rx="8" fill="${S}"/>
    <path d="M184 150 L184 70 C184 40 216 40 216 70 L216 150Z" fill="${S}"/>
    <path d="M160 210 L160 330" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`,
  creme: () => `<g transform="rotate(-14 260 150)"><rect x="170" y="100" width="190" height="46" rx="14" fill="${S}"/></g>
    <rect x="90" y="210" width="220" height="130" rx="26" fill="${C.rosaHell}" stroke="${S}" stroke-width="8"/>
    <ellipse cx="200" cy="212" rx="110" ry="22" fill="#fff" stroke="${S}" stroke-width="8"/>
    <path d="M160 210 C170 180 220 176 236 196 C226 190 200 192 196 208" fill="#fff" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="120" y="262" width="160" height="34" rx="8" fill="#fff" opacity=".8"/>`,
};

/** Lip-Oil-Fläschchen mit Applikator. viewBox 0 0 200 400 */
function lipOil() {
  return `<rect x="60" y="150" width="80" height="210" rx="22" fill="#fff" stroke="${S}" stroke-width="7"/>
    <path d="M68 230 L132 230 L132 336 C132 346 124 352 114 352 L86 352 C76 352 68 346 68 336Z" fill="${C.lippeHell}"/>
    <rect x="72" y="60" width="56" height="94" rx="10" fill="${S}"/>
    <path d="M80 170 L80 330" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".8"/>`;
}

/** Fingerspitze (waagrecht, Spitze links). viewBox 0 0 400 160 */
function finger() {
  return `<path d="M60 40 C20 40 10 80 20 104 C30 126 50 130 70 130 L400 130 L400 40Z" fill="${C.haut}"/>
    <path d="M36 62 C34 52 42 46 56 46 L92 46 C102 46 106 56 104 70 C102 84 96 90 86 90 L52 90 C40 90 36 76 36 62Z" fill="#FBE3DA" stroke="${C.hautDunkel}" stroke-width="3"/>
    <path d="M150 60 C160 80 160 100 150 120 M190 70 C196 84 196 100 190 112" stroke="${C.hautDunkel}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}

/** Gewebe-Stück (Baumwolle). k = 0..1 eingewebt. viewBox 0 0 460 340 */
function weave(k) {
  const n = 11, rows = [];
  for (let i = 0; i < n; i++) {
    const a = clamp(k * n - i);
    const y = 40 + i * 26;
    rows.push(`<rect x="30" y="${y}" width="${400 * a}" height="16" rx="8" fill="${i % 2 ? C.rosaHell : '#fff'}" stroke="${S}" stroke-opacity=".14" stroke-width="2"/>`);
  }
  const cols = Array.from({ length: 14 }, (_, j) => `<rect x="${42 + j * 28}" y="32" width="12" height="276" rx="6" fill="${C.rosa}" opacity=".9"/>`).join('');
  return `<rect x="14" y="14" width="432" height="312" rx="20" fill="#fff" stroke="${S}" stroke-width="6"/>
    ${cols}${rows.join('')}
    <rect x="30" y="30" width="400" height="280" rx="12" fill="none" stroke="${S}" stroke-width="3" stroke-dasharray="10 9" opacity=".35"/>
    <path d="M446 250 C470 270 450 300 476 320" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
}

/** klassisches Pflaster-Icon. viewBox 0 0 520 200 */
function plaster() {
  return `<g transform="rotate(-8 260 100)"><rect x="30" y="50" width="460" height="110" rx="55" fill="#E9C6A8" stroke="${S}" stroke-width="6"/>
    <rect x="190" y="50" width="140" height="110" fill="#F6E3D3" stroke="${S}" stroke-width="5"/>
    ${[[80, 85], [110, 120], [140, 90], [380, 90], [410, 125], [440, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${S}" opacity=".3"/>`).join('')}</g>`;
}

/** Lesezeichen / Speichern-Icon. fill 0..1. viewBox 0 0 300 380 */
function bookmark(fill) {
  return `<path d="M60 40 L240 40 C250 40 256 46 256 56 L256 340 L150 266 L44 340 L44 56 C44 46 50 40 60 40Z" fill="${S}" opacity="${fill}"/>
    <path d="M60 40 L240 40 C250 40 256 46 256 56 L256 340 L150 266 L44 340 L44 56 C44 46 50 40 60 40Z" fill="none" stroke="${S}" stroke-width="22" stroke-linejoin="round"/>`;
}

const sparkle = (x, y, s, c = S) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20Z" fill="${c}"/>`;
const pop = (node, t, t0, rot = 0, s0 = .5) => { const k = pr(t, t0, t0 + .45, ease.outBack); node.style.opacity = clamp((t - t0) / .12); node.style.transform += ` scale(${s0 + (1 - s0) * k}) rotate(${rot}deg)`; };
function chip(root, text, o = {}) {
  return el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '14px 30px 18px', background: o.bg ?? S, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 52) + 'px', borderRadius: '44px', whiteSpace: 'nowrap', transformOrigin: '0 50%' }, root, text);
}

// ---------- Szenen ----------
// s1: Hook statisch, Badspiegel mit Lichterkette, freier Platz auf der Ablage
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Night Routine. Der letzte Schritt ist *unerwartet.*', { x: 90, y: 210, w: 900, size: 112 });
  hook.update(99);
  const mir = svg(mirrorShelf(), {}, root, '0 0 600 760', 690, 874);
  const chain = svg('', {}, root, '0 0 1000 200', 860, 172);
  const q = el('div', { fontFamily: F.hand, fontWeight: 700, fontSize: '120px', color: C.beere, width: '120px', height: '130px', textAlign: 'center', lineHeight: '130px' }, root, '?');
  return (t) => {
    place(mir, 540, 980, 1);
    chain.querySelector('svg').innerHTML = lights(i => i < 2 ? 1 : pr(t, .2 + i * .14, .3 + i * .14));
    place(chain, 540, 660 + noise(t, 3) * 2, 1);
    // ? im freien Platz (Ablage: x 410..550 von 600 -> Skala 1.15)
    const k = pr(t, D * .45, D * .45 + .5, ease.outBack);
    place(q, 540 + (480 - 300) * 1.15, 980 + (548 - 380) * 1.15 + Math.sin(t * 3) * 4, .6 + .4 * k, -8, clamp((t - D * .45) / .15));
  };
}};

// s2: vier Schritte im Takt, große Labels (keine Untertitel)
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const steps = [['pad', 'Make-up *runter.*'], ['toner', '*Toner.*'], ['serum', '*Serum.*'], ['creme', '*Creme.*']];
  const items = steps.map(([k]) => svg(ITEM[k](), {}, root, '0 0 400 400', 620, 620));
  const labels = steps.map(([, l]) => bigText(root, l, { x: 40, y: 1080, w: 1000, size: 112, align: 'center', step: .05 }));
  const dots = steps.map((_, i) => el('div', { left: (450 + i * 50) + 'px', top: '1250px', width: '24px', height: '24px', borderRadius: '12px', background: S }, root));
  const cnt = el('div', { left: '90px', top: '230px', fontFamily: F.hand, fontWeight: 700, fontSize: '84px', color: S, transform: 'rotate(-3deg)' }, root, '');
  return (t) => {
    const seg = D / 4, idx = Math.min(3, Math.floor(t / seg));
    cnt.textContent = 'Schritt ' + (idx + 1);
    items.forEach((n, i) => {
      const t0 = i * seg, on = i === idx;
      place(n, 540, 740 + (on ? noise(t, i) * 4 : 0), 1, [-6, 4, -3, 5][i] + tw(t, t0, t0 + .4, 14, 0), on ? 1 : 0);
      if (on) pop(n, t, t0, 0, .6);
      labels[i].node.style.opacity = on ? 1 : 0; labels[i].update(t - t0);
      dots[i].style.opacity = i <= idx ? 1 : .18;
    });
  };
}};

// s3: Lip Oil – Glanz verblasst, Mond wandert zur Sonne
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Lip Oil?', { x: 90, y: 210, w: 900, size: 130, t0: 0, step: .06 });
  const head2 = bigText(root, '*War* *weg.*', { x: 90, y: 345, w: 900, size: 130, t0: D * .55, step: .08 });
  const sky = svg(`<path d="M60 260 C200 40 600 40 740 260" fill="none" stroke="${S}" stroke-width="4" stroke-dasharray="4 16" stroke-linecap="round" opacity=".5"/>`, {}, root, '0 0 800 300', 800, 300);
  const moon = svg(ART.moon(C.weiss), {}, root, '0 0 400 400', 120, 120);
  const sun = svg(`<circle cx="200" cy="200" r="90" fill="${C.weiss}"/>${Array.from({ length: 8 }, (_, i) => `<rect x="190" y="40" width="20" height="50" rx="10" fill="${C.weiss}" transform="rotate(${i * 45} 200 200)"/>`).join('')}`, {}, root, '0 0 400 400', 130, 130);
  const lips = svg(ART.lips(.6), {}, root, '0 0 400 400', 720, 720);
  const shine = svg(`<g fill="none" stroke="#fff" stroke-linecap="round">
      <path d="M100 172 C120 160 150 154 172 156" stroke-width="9" opacity=".8"/><path d="M232 156 C256 154 282 160 300 172" stroke-width="7" opacity=".7"/>
      <path d="M128 236 C160 250 200 252 232 244" stroke-width="12" opacity=".75"/><path d="M252 240 C266 236 278 230 288 222" stroke-width="7" opacity=".6"/></g>`, {}, root, '0 0 400 400', 720, 720);
  const oil = svg(lipOil(), {}, root, '0 0 200 400', 200, 400);
  return (t) => {
    head.update(t); head2.update(t);
    const k = pr(t, D * .3, D * .85, ease.inOutSine);
    place(sky, 540, 720, 1);
    const ang = lerp(Math.PI * .92, Math.PI * .08, k);
    const sx = 540 + Math.cos(ang) * 330, sy = 770 - Math.sin(ang) * 170;
    place(moon, sx, sy, 1, 0, 1 - pr(t, D * .55, D * .7));
    place(sun, sx, sy, 1, t * 20, pr(t, D * .55, D * .7));
    place(lips, 600, 1010, 1);
    // Glanz verblasst Stück für Stück
    const fade = pr(t, D * .35, D * .8, ease.lin);
    shine.style.clipPath = `inset(0 0 0 ${fade * 100}%)`;
    place(shine, 600, 1010, 1, 0, .85 * (1 - fade * .6));
    place(oil, 200, 1130 + noise(t, 2) * 3, 1, -12 + Math.sin(t * 2) * 2, pr(t, 0, .3));
  };
}};

// s4: Jetzt: Tape – legt sich über die Lippen, Finger drückt an
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Jetzt: *Tape.*', { x: 90, y: 210, w: 900, size: 150, t0: 0, step: .1 });
  const lips = svg(ART.lips(.55), {}, root, '0 0 400 400', 820, 820);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 500, 500);
  const sp = svg(sparkle(60, 60, 1.2) + sparkle(330, 40, .8) + sparkle(370, 150, 1), {}, root, '0 0 400 200', 640, 320);
  const fing = svg(finger(), {}, root, '0 0 400 160', 420, 168);
  const words = ['zu.', 'drauf.', 'andrücken.'].map((w, i) => el('div', { left: [100, 340, 620][i] + 'px', top: '1140px', fontFamily: F.hand, fontWeight: 700, fontSize: '78px', color: S, whiteSpace: 'nowrap' }, root, `<span style="color:${C.beere}">${i + 1}</span> ${w}`));
  const T = [D * .25, D * .45, D * .7];
  return (t) => {
    head.update(t);
    place(lips, 540, 820, 1);
    const land = pr(t, T[1] - .2, T[1] + .5, ease.outCubic);
    const press = Math.sin(clamp((t - T[2] - .2) / .5) * Math.PI);
    place(tape, lerp(700, 540, land), lerp(560, 830, land), lerp(1.2, 1, land) * (1 - press * .03), lerp(-24, -2, land), clamp((t - T[1] + .3) / .2));
    const sk = pr(t, T[1] + .35, T[1] + .9);
    place(sp, 560, 720, .7 + sk * .3, 0, sk * (1 - pr(t, T[1] + 1.2, T[1] + 1.6)));
    const fk = pr(t, T[2], T[2] + .4, ease.outCubic) * (1 - pr(t, T[2] + .9, T[2] + 1.3, ease.inCubic));
    place(fing, lerp(1300, 900, fk) - press * 10, 830, 1, 0, fk > .01 ? 1 : 0);
    words.forEach((w, i) => { const k = pr(t, T[i], T[i] + .4, ease.outBack); w.style.opacity = clamp((t - T[i]) / .15); w.style.transform = `translateY(${(1 - k) * 40}px) rotate(${[-4, 2, -2][i]}deg)`; });
  };
}};

// s5: Lupe auf die Mitte, drei Inhaltsstoffe
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Eine Lippenmaske in der *Mitte.*', { x: 90, y: 210, w: 900, size: 104, t0: 0, step: .06 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 560, 560);
  const link = svg(`<path d="M540 630 L410 790" stroke="${S}" stroke-width="7" stroke-dasharray="2 16" stroke-linecap="round" fill="none"/><circle cx="540" cy="612" r="34" fill="none" stroke="${S}" stroke-width="6"/>`, { left: '0px', top: '0px' }, root, '0 0 1080 1920', 1080, 1920);
  const lens = el('div', { left: '0px', top: '0px', width: '420px', height: '420px', borderRadius: '50%', overflow: 'hidden', background: C.rosaTief, border: `12px solid ${S}`, boxSizing: 'border-box' }, root);
  svg(`<rect width="420" height="420" fill="${C.rosaTief}"/>
    ${Array.from({ length: 42 }, (_, i) => { const x = (i * 73) % 420, y = (i * 131) % 420, r = 6 + (i % 4) * 4; return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${.18 + (i % 3) * .1}"/>`; }).join('')}
    <path d="M70 120 C120 80 200 70 260 80" stroke="#fff" stroke-width="22" stroke-linecap="round" fill="none" opacity=".45"/>
    <ellipse cx="300" cy="300" rx="30" ry="22" fill="${S}" opacity=".85"/>`, { left: '-12px', top: '-12px' }, lens, '0 0 420 420', 420, 420);
  const handle = el('div', { width: '40px', height: '170px', background: S, borderRadius: '20px' }, root);
  const labels = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'].map((s, i) => chip(root, s, { x: 580, y: 800 + i * 130, size: 54, bg: i === 1 ? C.weiss : S, color: i === 1 ? S : C.weiss }));
  return (t) => {
    head.update(t);
    place(tape, 540, 610, 1, -3);
    const g = pr(t, D * .18, D * .18 + .6, ease.outBack);
    place(lens, 330, 980, Math.max(.01, g), 0, clamp((t - D * .18) / .1));
    place(handle, 330 + 150 * g, 980 + 200 * g, g, -38, g > .2 ? 1 : 0);
    link.style.opacity = pr(t, D * .1, D * .2) * .8;
    labels.forEach((n, i) => { const t0 = D * (.48 + i * .14); const k = pr(t, t0, t0 + .4, ease.outBack);
      n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateX(${(1 - k) * -60}px) rotate(${[-3, 2, -1][i]}deg)`; });
  };
}};

// s6: Baumwolle wird gewebt, Pflaster durchgestrichen
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Medizinische *Baumwolle.*', { x: 90, y: 210, w: 900, size: 108, t0: 0, step: .07 });
  const fab = svg('', {}, root, '0 0 460 340', 600, 444);
  const c1 = chip(root, '+ hypoallergener Kleber', { x: 0, y: 0, size: 54, bg: C.rosa, color: S }); c1.style.transformOrigin = '50% 50%';
  const pl = svg(plaster(), {}, root, '0 0 520 200', 470, 181);
  const strike = svg(`<path d="M20 160 L500 30" stroke="${C.beere}" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 520 200', 470, 181);
  const nt = note(root, 'fühlt sich nicht so an.', { x: 250, y: 1215, size: 72, r: -3, t0: D * .76 });
  return (t) => {
    head.update(t);
    fab.querySelector('svg').innerHTML = weave(pr(t, .1, D * .3, ease.inOutSine));
    place(fab, 540, 680, 1, -2 + noise(t, 1) * .6);
    place(c1, 540, 950, 1, 0, 1); pop(c1, t, D * .3, -2, .6);
    place(pl, 540, 1120, 1, 0, pr(t, D * .55, D * .6)); pl.style.transform += ` translateY(${tw(t, D * .55, D * .7, 40, 0)}px)`;
    strike.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, D * .66, D * .78, ease.inOutCubic));
    place(strike, 540, 1120, 1);
    nt.update(t);
  };
}};

// s7: Licht aus -> Morgen, Tape löst sich langsam
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const TM = D * .3; // Morgen beginnt
  const night = bigText(root, 'Licht *aus.*', { x: 90, y: 210, w: 900, size: 140, color: C.weiss, accent: C.rosa, t0: 0, step: .08 });
  const chain = svg('', {}, root, '0 0 1000 200', 900, 180);
  const moon = svg(ART.moon() + ART.star(60, 120, 1.2) + ART.star(360, 330, .9), {}, root, '0 0 400 400', 420, 420);
  const day = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.rosaHell }, root);
  const sun = svg(`<circle cx="200" cy="200" r="120" fill="${WARM}"/>`, {}, day, '0 0 400 400', 360, 360);
  const morning = bigText(day, 'Morgens: so *weich.*', { x: 90, y: 210, w: 900, size: 130, t0: TM + .3, step: .08 });
  const lips = svg(ART.lips(.55), {}, day, '0 0 400 400', 700, 700);
  const tape = svg(ART.tape(true), { transformOrigin: '12% 50%' }, day, '0 0 400 400', 430, 430);
  const sp = svg(sparkle(40, 80, 1) + sparkle(360, 60, 1.3) + sparkle(390, 170, .7), {}, day, '0 0 400 220', 700, 385);
  return (t) => {
    night.update(t);
    const off = pr(t, .5, 1.1);
    chain.querySelector('svg').innerHTML = lights(i => 1 - clamp(off * 9 - i));
    place(chain, 540, 560, 1);
    place(moon, 540, 950, 1, tw(t, 0, TM, -6, 0), .25 + .75 * off);
    const w = pr(t, TM, TM + .6, ease.inOutCubic);
    day.style.clipPath = `circle(${w * 160}% at 85% 30%)`;
    place(sun, 860, 640, tw(t, TM, TM + 1.2, .6, 1), 0, 1);
    morning.update(t);
    place(lips, 540, 900, 1);
    const peel = pr(t, TM + .9, D - .4, ease.inOutSine);
    place(tape, 540 + peel * 120, 910 - peel * 160, 1, -2 - peel * 26, 1 - pr(t, D - .6, D - .2) * .0);
    tape.style.transform += ` scaleY(${1 - peel * .12})`;
    const sk = pr(t, TM + 1.6, TM + 2.2);
    place(sp, 540, 900, .8 + sk * .2, 0, sk);
  };
}};

// s8: Speichern-Icon füllt sich, Tape darunter
SCENES.s8 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Speicher dir das für *heute* *Abend.*', { x: 90, y: 210, w: 900, size: 112, t0: 0, step: .05 });
  const ring = svg(`<circle cx="200" cy="200" r="150" fill="none" stroke="${C.weiss}" stroke-width="10"/>`, {}, root, '0 0 400 400', 520, 520);
  const bm = svg('', {}, root, '0 0 300 380', 260, 330);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 420, 420);
  return (t) => {
    head.update(t);
    const f = pr(t, D * .3, D * .45);
    bm.querySelector('svg').innerHTML = bookmark(f);
    const beat = Math.sin(clamp((t - D * .3) / .5) * Math.PI);
    place(bm, 540, 820, 1 + beat * .12, 0, pr(t, 0, .25));
    const r = ((t - D * .3) % 1.1) / 1.1;
    place(ring, 540, 820, .6 + r * .6, 0, t > D * .3 ? (1 - r) * .8 : 0);
    place(tape, 540, 1170 + Math.sin(t * 2) * 8, 1, -4 + Math.sin(t * 1.3) * 2);
  };
}};
