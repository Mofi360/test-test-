/* OV19 – Was steckt im Kollagen-Tape?  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, list, clamp, lerp } = DT;
const S = C.schwarz;

// ---------- eigene Illustrationen ----------
const sparkle = (x, y, s, c = S) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20Z" fill="${c}"/>`;

/** Tape-Schicht in Schrägansicht. kind: 'cotton' | 'glue'. viewBox 0 0 400 200 */
function layer(kind) {
  const shape = `M60 40 L340 40 C380 40 380 160 340 160 L60 160 C20 160 20 40 60 40Z`;
  const inner = kind === 'cotton'
    ? `<g opacity=".22" stroke="${S}" stroke-width="2">${Array.from({ length: 15 }, (_, i) => `<line x1="${40 + i * 22}" y1="46" x2="${30 + i * 22}" y2="154"/>`).join('')}</g>`
    : `<g fill="${C.rosaTief}">${Array.from({ length: 48 }, (_, i) => { const c = i % 12, r = Math.floor(i / 12); return `<circle cx="${62 + c * 25 + (r % 2) * 12}" cy="${62 + r * 26}" r="5" opacity=".7"/>`; }).join('')}</g>`;
  return `<g transform="translate(200 100) scale(1 .5) skewX(-28) translate(-200 -100)">
      <path d="${shape}" transform="translate(0 14)" fill="${S}" opacity=".12"/>
      <path d="${shape}" fill="${kind === 'cotton' ? '#FFF7F4' : C.rosaHell}" stroke="${S}" stroke-width="5"/>
      <clipPath id="cl-${kind}"><path d="${shape}"/></clipPath><g clip-path="url(#cl-${kind})">${inner}</g>
      <ellipse cx="200" cy="100" rx="12" ry="12" fill="${kind === 'cotton' ? C.rosaHell : '#fff'}" stroke="${S}" stroke-width="4"/>
    </g>`;
}

/** Lesezeichen. fill 0..1. viewBox 0 0 300 380 */
function bookmark(fill) {
  const d = 'M60 40 L240 40 C250 40 256 46 256 56 L256 340 L150 266 L44 340 L44 56 C44 46 50 40 60 40Z';
  return `<path d="${d}" fill="${S}" opacity="${fill}"/><path d="${d}" fill="none" stroke="${S}" stroke-width="22" stroke-linejoin="round"/>`;
}
/** Papierflieger (Teilen). viewBox 0 0 300 260 */
function plane() {
  return `<path d="M20 120 L280 20 L200 240 L140 160Z" fill="#fff" stroke="${S}" stroke-width="14" stroke-linejoin="round"/>
    <path d="M140 160 L280 20 M140 160 L130 230 L172 190" fill="none" stroke="${S}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>`;
}
/** Mini-Tape für das Kalender-Raster. viewBox 0 0 200 100 */
const miniTape = () => `<rect x="10" y="22" width="180" height="56" rx="28" fill="#FFF7F4"/><rect x="58" y="36" width="84" height="28" rx="14" fill="${C.rosaTief}"/><circle cx="100" cy="50" r="5" fill="${S}"/>`;

function chip(root, text, o = {}) {
  return el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '14px 32px 18px', background: o.bg ?? S, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 52) + 'px', borderRadius: '44px', whiteSpace: 'nowrap' }, root, text);
}
const popIn = (node, t, t0, rot = 0, dy = 50) => { const k = pr(t, t0, t0 + .45, ease.outBack); node.style.opacity = clamp((t - t0) / .12); node.style.transform = `translateY(${(1 - k) * dy}px) rotate(${rot}deg) scale(${.7 + .3 * k})`; };

// ---------- Szenen ----------
// s1: Hook statisch, großes Tape, Lupe fährt darüber (zeigt vergrößert)
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Was steckt eigentlich in einem *Kollagen-Tape?*', { x: 90, y: 200, w: 900, size: 116 });
  hook.update(99);
  const TW = 900, TX = 540, TY = 960;
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', TW, TW);
  const sp = svg(sparkle(40, 60, 1.3, C.beere) + sparkle(360, 30, .9) + sparkle(380, 170, 1.1) + sparkle(20, 190, .7), {}, root, '0 0 400 220', 900, 495);
  const L = 330, Z = 1.9;
  const lens = el('div', { left: 0, top: 0, width: L + 'px', height: L + 'px', borderRadius: '50%', overflow: 'hidden', background: C.rosaHell, border: `14px solid ${S}`, boxSizing: 'border-box', boxShadow: '0 24px 40px -18px rgba(21,16,18,.45)' }, root);
  const big = svg(ART.tape(true), { left: 0, top: 0 }, lens, '0 0 400 400', TW * Z, TW * Z);
  const handle = el('div', { left: 0, top: 0, width: '46px', height: '190px', background: S, borderRadius: '23px' }, root);
  const nt = note(root, 'klingt nach Hype …', { x: 140, y: 1170, size: 86, r: -4, t0: D * .22 });
  return (t) => {
    place(tape, TX, TY, 1, -3);
    // Lupe: Startposition links (Frame 0 schon fertig), gleitet dann über das Tape
    const k = pr(t, D * .45, D * .95, ease.inOutSine);
    const lx = lerp(330, 720, k) + noise(t, 2) * 3, ly = TY - 20 + Math.sin(k * Math.PI) * -30;
    place(lens, lx, ly, 1);
    place(handle, lx + 150, ly + 190, 1, -40);
    const dx = lx - TX, dy = ly - TY;
    big.style.transform = `translate(${L / 2 - 14 - TW * Z / 2 - dx * Z}px, ${L / 2 - 14 - TW * Z / 2 - dy * Z}px) rotate(-3deg)`;
    // Glitzer funkelt (Hype), verblasst wenn genauer hingeschaut wird
    const tw1 = .75 + .25 * Math.sin(t * 5);
    place(sp, TX, TY - 30, tw1, 0, 1 - pr(t, D * .5, D * .8) * .85);
    nt.update(t);
  };
}};

// s2: Explosionsansicht – Baumwolle oben, Kleber darunter
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Außen: *Baumwolle* und Kleber.', { x: 90, y: 200, w: 900, size: 112, t0: 0, step: .06 });
  const glue = svg(layer('glue'), {}, root, '0 0 400 200', 860, 430);
  const cotton = svg(layer('cotton'), {}, root, '0 0 400 200', 860, 430);
  const lines = svg(`<g stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14" fill="none"><path d="M180 0 L180 300"/><path d="M900 0 L900 300"/></g>`, {}, root, '0 0 1080 300', 1080, 300);
  const c1 = chip(root, 'medizinische Baumwolle', { x: 130, y: 800, size: 58 });
  const c2 = chip(root, 'hypoallergener Kleber', { x: 330, y: 1215, size: 58, bg: C.rosa, color: S });
  return (t) => {
    head.update(t);
    const sep = pr(t, D * .12, D * .45, ease.inOutCubic);
    place(cotton, 540, lerp(880, 650, sep) + noise(t, 1) * 2, 1);
    place(glue, 540, lerp(910, 1080, sep) + noise(t, 4) * 2, 1);
    place(lines, 540, lerp(880, 850, sep), 1, 0, sep * .35);
    popIn(c1, t, D * .35, -2);
    popIn(c2, t, D * .62, 2);
  };
}};

// s3: Inhaltsstoff-Liste tippt sich ein, Tocopherol = Vitamin E
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'In der Mitte: die *Pflege.*', { x: 90, y: 200, w: 900, size: 112, t0: 0, step: .06 });
  const card = el('div', { left: '110px', top: '470px', width: '860px', height: '790px', background: C.weiss, borderRadius: '8px', boxShadow: '0 30px 60px -24px rgba(21,16,18,.35)', transform: 'rotate(-1.2deg)' }, root);
  el('div', { left: '330px', top: '-30px', width: '200px', height: '60px', background: 'rgba(231,146,168,.85)', transform: 'rotate(3deg)' }, card);
  el('div', { left: '70px', top: '56px', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', color: '#6b5a60' }, card, 'unter anderem:');
  const names = ['Wasser', 'Glycerin', 'Hyaluronsäure', 'Tocopherol', 'Kollagen'];
  const T = [.2, .3, .4, .52, .86].map(k => k * D);
  const rows = names.map((n, i) => {
    const r = el('div', { left: '70px', top: (180 + i * 122) + 'px', display: 'flex', alignItems: 'center', gap: '30px', fontFamily: F.sans, fontWeight: 600, fontSize: '70px', color: S, whiteSpace: 'nowrap' }, card);
    el('div', { position: 'relative', width: '40px', height: '24px', borderRadius: '12px', background: C.rosaTief }, r);
    const tx = el('div', { position: 'relative' }, r, '');
    return { r, tx };
  });
  const mark = el('div', { left: '128px', top: (180 + 4 * 122 + 50) + 'px', height: '34px', width: '330px', background: C.rosa, transformOrigin: '0 50%', borderRadius: '6px' }, card);
  card.insertBefore(mark, card.children[2]);
  const vit = el('div', { left: '575px', top: (180 + 3 * 122 + 2) + 'px', fontFamily: F.hand, fontWeight: 700, fontSize: '66px', color: C.beere, whiteSpace: 'nowrap', transform: 'rotate(-5deg)' }, card, '= Vitamin E');
  const caret = el('div', { width: '6px', height: '70px', background: S }, card);
  return (t) => {
    head.update(t);
    let active = -1;
    rows.forEach(({ r, tx }, i) => {
      const n = names[i], k = clamp((t - T[i]) / (n.length * .055));
      tx.textContent = n.slice(0, Math.round(k * n.length));
      r.style.opacity = t >= T[i] ? 1 : 0;
      if (t >= T[i]) active = i;
    });
    if (active >= 0) {
      const tx = rows[active].tx; caret.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1;
      caret.style.left = (140 + tx.offsetWidth + 6) + 'px'; caret.style.top = (180 + active * 122 + 12) + 'px';
    } else caret.style.opacity = 0;
    const v = pr(t, T[3] + .7, T[3] + 1.2);
    vit.style.opacity = v; vit.style.clipPath = `inset(0 ${100 - v * 100}% 0 0)`;
    mark.style.transform = `scaleX(${pr(t, T[4] + .5, T[4] + .9)})`;
  };
}};

// s4: Nacht – Kollagen verliert den Glitzer, setzt sich in die Pflege, Stempel
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const h1 = bigText(root, 'Teil der Pflege.', { x: 90, y: 200, w: 900, size: 120, color: C.weiss, t0: D * .34, step: .07 });
  const h2 = bigText(root, '*Punkt.*', { x: 90, y: 330, w: 900, size: 120, color: C.weiss, accent: C.rosa, t0: D * .78, step: .07 });
  const stars = svg([[60, 40, 1], [940, 90, .7], [990, 1180, .9], [80, 1250, .6], [880, 520, .5]].map(([x, y, s]) => ART.star(x, y, s * 1.6)).join(''), { left: 0, top: 0 }, root, '0 0 1080 1300', 1080, 1300);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 150, 150);
  const pad = el('div', { left: 0, top: 0, width: '840px', height: '400px', borderRadius: '200px', background: C.rosaTief, boxShadow: `inset 0 0 0 12px ${C.weiss}` }, root);
  const others = [['Wasser', 120, 70], ['Glycerin', 470, 60], ['Hyaluron', 90, 270], ['Vitamin E', 470, 275]].map(([n, x, y]) =>
    el('div', { left: x + 'px', top: y + 'px', fontFamily: F.sans, fontWeight: 600, fontSize: '50px', color: C.weiss, opacity: .85, whiteSpace: 'nowrap' }, pad, n));
  const slot = el('div', { left: '280px', top: '160px', width: '280px', height: '84px', borderRadius: '42px', border: `4px dashed ${C.weiss}`, opacity: .6 }, pad);
  const kol = el('div', { left: 0, top: 0, padding: '18px 44px 24px', background: C.weiss, color: S, fontFamily: F.display, fontSize: '96px', borderRadius: '70px', whiteSpace: 'nowrap', transformOrigin: '50% 50%' }, root, 'Kollagen');
  const glit = svg(sparkle(30, 40, 1.4, C.rosa) + sparkle(380, 30, 1, '#F7E7C6') + sparkle(400, 170, 1.3, C.rosa) + sparkle(10, 180, .9, '#F7E7C6') + sparkle(200, -10, .8, C.weiss), {}, root, '0 0 400 200', 640, 320);
  const stamp = el('div', { left: 0, top: 0, padding: '8px 40px 14px', border: `10px solid ${C.weiss}`, color: C.weiss, fontFamily: F.sans, fontWeight: 800, fontSize: '96px', letterSpacing: '6px', borderRadius: '16px', whiteSpace: 'nowrap' }, root, 'PFLEGE');
  return (t) => {
    h1.update(t); h2.update(t);
    place(moon, 900, 1170, 1, 0, .9);
    const PY = 910;
    place(pad, 540, PY, 1, -2);
    // Kollagen: erst groß mit Glitzer, dann klein in den Schlitz
    const d = pr(t, D * .3, D * .58, ease.inOutCubic);
    const ky = lerp(560, PY - 4, d), ks = lerp(1.15, .62, d);
    place(kol, 540, ky + Math.sin(t * 2.4) * 8 * (1 - d), ks, lerp(-4, -2, d) + Math.sin(t * 3) * 2 * (1 - d));
    const g = 1 - pr(t, D * .22, D * .36);
    place(glit, 540, 560, .9 + .1 * Math.sin(t * 6), 0, g);
    slot.style.opacity = .6 * (1 - pr(t, D * .5, D * .58));
    others.forEach((o, i) => { o.style.transform = `translateY(${Math.sin(t * 1.5 + i) * 4}px)`; });
    // Stempel landet
    const sk = pr(t, D * .76, D * .76 + .3, ease.outCubic);
    const bump = Math.sin(clamp((t - D * .76 - .3) / .25) * Math.PI);
    place(stamp, 560, PY + 270, lerp(1.8, 1, sk) * (1 + bump * .04), -8, sk);
    pad.style.transform += ` translateY(${bump * 8}px)`;
  };
}};

// s5: Pfeil auf das kleine Loch
SCENES.s5 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Plus ein *kleines* *Loch.*', { x: 90, y: 200, w: 900, size: 120, t0: 0, step: .07 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 1000, 1000);
  const ring = svg(`<circle cx="100" cy="100" r="80" fill="none" stroke="${C.beere}" stroke-width="8"/>`, {}, root, '0 0 200 200', 200, 200);
  const nt = note(root, 'Sicherheitsloch', { x: 130, y: 520, size: 88, r: -5, t0: D * .2, arrow: [300, 240], ax: 200, ay: 110 });
  return (t) => {
    head.update(t);
    const z = tw(t, 0, D, 1, 1.08, ease.inOutSine);
    place(tape, 540, 950, z, -3);
    const r = ((t - D * .35) % 1.2) / 1.2;
    place(ring, 540, 950, .5 + r * .9, 0, t > D * .35 ? (1 - r) : 0);
    nt.update(t);
  };
}};

// s6: 30 Nächte als Kalender-Raster
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '30 Stück = 30 *Nächte.*', { x: 90, y: 200, w: 900, size: 112, t0: D * .45, step: .06 });
  const cnt = el('div', { left: '90px', top: '200px', fontFamily: F.display, fontSize: '112px', color: S, whiteSpace: 'nowrap' }, root, '');
  const cells = [];
  for (let i = 0; i < 30; i++) {
    const c = i % 6, r = Math.floor(i / 6);
    const cell = el('div', { left: (105 + c * 148) + 'px', top: (450 + r * 170) + 'px', width: '130px', height: '150px', borderRadius: '18px', background: C.nacht }, root);
    el('div', { left: '14px', top: '8px', fontFamily: F.sans, fontWeight: 700, fontSize: '28px', color: C.rosa }, cell, String(i + 1));
    svg(ART.moon(), { left: '84px', top: '12px' }, cell, '0 0 400 400', 32, 32);
    svg(miniTape(), { left: '9px', top: '64px' }, cell, '0 0 200 100', 112, 56);
    cells.push(cell);
  }
  return (t) => {
    head.update(t);
    const fillT = (i) => D * .08 + i * (D * .4 / 30);
    let n = 0;
    cells.forEach((cell, i) => {
      const t0 = fillT(i); if (t >= t0) n = i + 1;
      const k = pr(t, t0, t0 + .35, ease.outBack);
      cell.style.opacity = clamp((t - t0) / .1);
      cell.style.transform = `scale(${.4 + .6 * k}) rotate(${(1 - k) * (i % 2 ? 8 : -8)}deg)`;
    });
    cnt.textContent = n ? n + (n === 1 ? ' Nacht' : ' Nächte') : '';
    cnt.style.opacity = 1 - pr(t, D * .42, D * .47);
    if (t < D * .45) head.node.style.opacity = 0; else head.node.style.opacity = 1;
  };
}};

// s7: Merkzettel + Speichern/Teilen
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Speicher dir *das.*', { x: 90, y: 200, w: 900, size: 120, t0: 0, step: .07 });
  const card = el('div', { left: '100px', top: '480px', width: '700px', height: '760px', background: C.weiss, borderRadius: '8px', boxShadow: '0 30px 60px -24px rgba(21,16,18,.35)', transform: 'rotate(-2deg)' }, root);
  el('div', { left: '60px', top: '44px', fontFamily: F.hand, fontWeight: 700, fontSize: '72px', color: C.beere }, card, 'Kollagen-Tape:');
  const items = list(card, [{ text: 'Baumwolle + Kleber' }, { text: 'Pflege in der Mitte' }, { text: 'kleines Loch' }, { text: '30 Stück' }], { x: 50, y: 200, w: 640, size: 54, t0: .3, step: .3 });
  [...items.node.children].forEach(r => { r.style.marginBottom = '48px'; r.style.position = 'relative'; });
  const bm = svg('', {}, root, '0 0 300 380', 170, 215);
  const pl = svg(plane(), {}, root, '0 0 300 260', 170, 147);
  return (t) => {
    head.update(t); items.update(t);
    const f = pr(t, D * .35, D * .5);
    bm.querySelector('svg').innerHTML = bookmark(f);
    const beat = Math.sin(clamp((t - D * .35) / .5) * Math.PI);
    place(bm, 870, 560, 1 + beat * .15, 6, pr(t, .1, .35));
    const b2 = Math.sin(clamp((t - D * .6) / .5) * Math.PI);
    place(pl, 880 + b2 * 14, 840 - b2 * 14, 1 + b2 * .12, -8, pr(t, D * .5, D * .6));
  };
}};
