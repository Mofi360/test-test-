/* OV16 – Lippenmaske im Kissen  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;

// ---------- eigene Illustrationen ----------
const HAIR = '#2A1D22';
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

/** Kopfkissen, viewBox 0 0 600 420. o.smear 0..1 (glänzender Maskenfleck), o.shine 0..1 (Glanzstreifen-Position) */
function pillow(o = {}) {
  const sm = o.smear ?? 0, fill = o.fill ?? C.weiss;
  return `<g>
    <path d="M58 92 C150 62 450 62 542 92 C572 160 572 270 542 330 C450 362 150 362 58 330 C28 270 28 160 58 92Z" fill="${C.schwarz}" opacity=".08" transform="translate(10 18)"/>
    <path d="M58 92 C150 62 450 62 542 92 C572 160 572 270 542 330 C450 362 150 362 58 330 C28 270 28 160 58 92Z" fill="${fill}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M58 92 L30 70 M542 92 L572 68 M58 330 L28 356 M542 330 L574 354" stroke="${C.schwarz}" stroke-width="6" stroke-linecap="round"/>
    <path d="M110 120 C200 140 400 140 490 120 M110 300 C200 284 400 284 490 300" fill="none" stroke="${C.rosaTief}" stroke-width="4" stroke-dasharray="10 12" opacity=".7"/>
    <path d="M160 200 C200 214 240 214 280 204" fill="none" stroke="${C.schwarz}" stroke-opacity=".12" stroke-width="5" stroke-linecap="round"/>
    ${sm > 0 ? `<g opacity="${sm}" transform="translate(330 214) rotate(-9) scale(${.6 + .4 * sm})">
      <path d="M-120 -14 C-100 -62 -30 -70 10 -52 C40 -78 110 -64 128 -18 C146 26 100 62 40 58 C10 74 -50 76 -90 52 C-130 36 -136 10 -120 -14Z" fill="${C.lippeHell}"/>
      <path d="M-70 -6 C-40 -28 30 -30 70 -10 C40 10 -30 14 -70 -6Z" fill="${C.lippe}" opacity=".55"/>
      <path d="M-86 -24 C-60 -46 -20 -50 6 -42" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".85"/>
      <path d="M40 30 C62 30 84 22 96 8" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>
      <circle cx="-104" cy="40" r="9" fill="${C.lippeHell}"/><circle cx="120" cy="40" r="6" fill="${C.lippeHell}"/>
    </g>` : ''}
    ${o.shine != null ? `<clipPath id="pc${o.id || 0}"><path d="M58 92 C150 62 450 62 542 92 C572 160 572 270 542 330 C450 362 150 362 58 330 C28 270 28 160 58 92Z"/></clipPath>
      <g clip-path="url(#pc${o.id || 0})"><rect x="${lerp(-200, 700, o.shine)}" y="20" width="70" height="420" fill="#fff" opacity=".75" transform="skewX(-20)"/><rect x="${lerp(-110, 790, o.shine)}" y="20" width="22" height="420" fill="#fff" opacity=".75" transform="skewX(-20)"/></g>` : ''}
  </g>`;
}

/** offenes Döschen (Lippenmaske), viewBox 0 0 300 260 */
function openJar() {
  return `<g>
    <ellipse cx="120" cy="226" rx="104" ry="18" fill="${C.schwarz}" opacity=".1"/>
    <path d="M30 120 L30 200 C30 222 210 222 210 200 L210 120Z" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="120" cy="120" rx="90" ry="26" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>
    <ellipse cx="120" cy="122" rx="74" ry="18" fill="${C.lippeHell}"/>
    <path d="M78 116 C96 108 124 108 140 112" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>
    <rect x="52" y="152" width="70" height="12" rx="6" fill="#fff" opacity=".45"/>
    <g transform="translate(236 104) rotate(28)">
      <rect x="-56" y="-22" width="112" height="44" rx="14" fill="${C.schwarz}"/>
      <rect x="-40" y="-14" width="40" height="8" rx="4" fill="#fff" opacity=".3"/>
    </g>
  </g>`;
}

/** Plumper-Röhrchen (Lipgloss mit Kappe), viewBox 0 0 140 460 */
function tube(body = C.rosaTief) {
  return `<g>
    <rect x="34" y="20" width="72" height="150" rx="14" fill="${C.schwarz}"/>
    <rect x="44" y="34" width="12" height="110" rx="6" fill="#fff" opacity=".25"/>
    <rect x="28" y="160" width="84" height="22" rx="6" fill="#3a2e33"/>
    <path d="M30 182 L110 182 L110 420 C110 440 30 440 30 420Z" fill="${body}" stroke="${C.schwarz}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="44" y="200" width="14" height="200" rx="7" fill="#fff" opacity=".4"/>
    <rect x="62" y="250" width="34" height="90" rx="6" fill="#fff" opacity=".85"/>
    <path d="M70 272 L88 272 M70 290 L88 290 M70 308 L82 308" stroke="${C.schwarz}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
  </g>`;
}

/** Sie liegt im Bett (Kopf frontal auf Kissen), Augen zu, Tape auf den Lippen. viewBox 0 0 400 460 */
function sleeper(tape = 1, eyesOpen = false, smile = 0) {
  const eye = x => eyesOpen
    ? `<ellipse cx="${x}" cy="210" rx="10" ry="13" fill="${C.schwarz}"/><circle cx="${x + 3}" cy="205" r="3.5" fill="#fff"/>`
    : `<path d="M${x - 20} 206 Q${x} 222 ${x + 20} 206" fill="none" stroke="${C.schwarz}" stroke-width="6" stroke-linecap="round"/>
       <path d="M${x - 18} 214 L${x - 24} 222 M${x} 218 L${x} 228 M${x + 18} 214 L${x + 24} 222" stroke="${C.schwarz}" stroke-width="3.5" stroke-linecap="round"/>`;
  return `<g>
    <path d="M70 240 C40 120 110 70 200 70 C290 70 360 120 330 240 C350 300 340 340 320 380 L80 380 C60 340 50 300 70 240Z" fill="${HAIR}"/>
    <ellipse cx="86" cy="236" rx="16" ry="24" fill="${C.hautDunkel}"/><ellipse cx="314" cy="236" rx="16" ry="24" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="232" rx="116" ry="128" fill="${C.haut}"/>
    <path d="M86 200 C96 130 150 104 214 108 C180 130 150 152 100 172 C94 182 90 190 86 200Z" fill="${HAIR}"/>
    <path d="M314 200 C306 142 270 112 228 108 C262 130 290 152 314 200Z" fill="${HAIR}"/>
    <path d="M136 164 Q154 152 174 160" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    <path d="M226 160 Q246 152 264 164" fill="none" stroke="${HAIR}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156)}${eye(244)}
    <path d="M196 230 C192 250 190 258 200 262" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="126" cy="266" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <ellipse cx="274" cy="266" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <path d="M168 ${300 - smile * 4} Q184 290 200 295 Q216 290 232 ${300 - smile * 4} Q216 318 200 318 Q184 318 168 ${300 - smile * 4}Z" fill="${C.lippe}"/>
    <g opacity="${tape}" transform="translate(200 302) scale(.36) translate(-200 -200)">${ART.tape(true)}</g>
  </g>`;
}

/** Lippen-Kärtchen (Polaroid-artig) */
function card(parent, x, y, w, h, bg = C.weiss) {
  return el('div', { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', background: bg, boxShadow: '0 26px 50px -22px rgba(21,16,18,.45)', borderRadius: '6px' }, parent);
}
const label = (parent, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '12px 30px 16px', background: o.bg ?? C.schwarz, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 54) + 'px', borderRadius: '44px', whiteSpace: 'nowrap' }, parent, text);
const popIn = (n, t, t0, rot = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };

// ---------- Szenen ----------
// s1: Hook statisch, Kissen mit glänzendem Maskenfleck, Döschen daneben
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Meine Lippenmaske klebte jeden Morgen im *Kissen.*', { x: 90, y: 210, w: 920, size: 100 });
  hook.update(99);
  const pil = svg(pillow({ smear: 1 }), {}, root, '0 0 600 420', 900, 630);
  const sp = svg(sparkle(60, 60, 1) + sparkle(150, 30, .6) + sparkle(20, 140, .5), {}, root, '0 0 200 180', 200, 180);
  const jar = svg(openJar(), {}, root, '0 0 300 260', 330, 286);
  const n = note(root, 'nicht auf meinen Lippen', { x: 90, y: 1236, r: -3, t0: D * .6, size: 62 });
  return (t) => {
    place(pil, 520, 960 + noise(t, 2) * 3, tw(t, 0, D, 1, 1.04, ease.lin), -3);
    const tw1 = Math.abs(Math.sin(t * 2.4));
    place(sp, 720, 820, .6 + tw1 * .5, t * 30, .5 + tw1 * .5);
    place(jar, 850, 1215, 1, tw(t, .2, 1, 14, 4, ease.outBack));
    n.update(t);
  };
}};

// s2: Zwei Kärtchen: Kissen glänzt (Glanz zieht drüber) – Lippen matt
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Kissen glänzt. *Lippen* *nicht.*', { x: 90, y: 220, w: 900, size: 112, t0: 0, step: .06 });
  const c1 = card(root, 80, 560, 460, 600, C.rosaHell);
  const pl = svg(pillow({ smear: 1, shine: 0, id: 2 }), { left: '-20px', top: '110px' }, c1, '0 0 600 420', 500, 350);
  el('div', { left: '0', top: '470px', width: '460px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', color: C.schwarz }, c1, 'Kissenbezug');
  const c2 = card(root, 560, 600, 440, 580, C.rosa);
  const lp = svg(ART.lips(.5, '#C99AA4'), { left: '0px', top: '60px' }, c2, '0 0 400 400', 440, 440);
  el('div', { left: '0', top: '450px', width: '440px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', color: C.schwarz }, c2, 'meine Lippen');
  const sp = svg(sparkle(40, 40, 1) + sparkle(130, 90, .6), {}, root, '0 0 180 140', 180, 140);
  return (t) => {
    head.update(t);
    const k1 = pr(t, .1, .7, ease.outBack), k2 = pr(t, .35, .95, ease.outBack);
    c1.style.opacity = clamp(t / .15); c1.style.transform = `translateY(${(1 - k1) * 120}px) rotate(${lerp(-12, -4, k1)}deg)`;
    c2.style.opacity = clamp((t - .35) / .15); c2.style.transform = `translateY(${(1 - k2) * 120}px) rotate(${lerp(12, 3, k2)}deg)`;
    pl.querySelector('svg').innerHTML = pillow({ smear: 1, shine: pr(t, D * .35, D * .35 + 1.1, ease.inOutCubic), id: 2 });
    const s = pr(t, D * .45, D * .45 + .4, ease.outBack);
    place(sp, 420, 640, s * (1 + Math.sin(t * 4) * .12), t * 20, clamp((t - D * .45) / .1));
  };
}};

// s3: Drei Plumper kippen wie Dominosteine
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Plumper? *Auch* *nicht.*', { x: 90, y: 220, w: 900, size: 124, t0: 0, step: .07 });
  const shelf = el('div', { left: '90px', top: '1196px', width: '900px', height: '18px', background: C.schwarz, borderRadius: '9px' }, root);
  const cols = [C.rosaTief, C.weiss, C.lippeHell];
  const tubes = cols.map(c => svg(tube(c), { transformOrigin: '100% 100%' }, root, '0 0 140 460', 128, 420));
  return (t) => {
    head.update(t);
    tubes.forEach((n, i) => {
      const t0 = D * .32 + i * .28;
      const k = pr(t, t0, t0 + .42, ease.inCubic);
      // jedes Röhrchen fällt nach rechts an das nächste, das letzte bis auf das Brett
      const maxA = i < 2 ? 30 : 90;
      const bounce = i === 2 ? Math.sin(pr(t, t0 + .42, t0 + .8, ease.lin) * Math.PI) * -6 : 0;
      const a = k * maxA + bounce;
      n.style.left = (120 + i * 200) + 'px'; n.style.top = (1196 - 420 + 12) + 'px';
      n.style.transform = `rotate(${a}deg)`;
    });
  };
}};

// s4: Forum-Zitat im exakten Wortlaut
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) {
  const n = note(root, 'eine im Forum:', { x: 110, y: 250, r: -4, t0: 0, size: 86 });
  const q = quoteCard(root, 'I feel like they’re gimmicks. I love the stinging but the plumping effect doesn’t last very long at all.', 'Kundin in einem Forum', { y: 440, size: 62, t0: .05 });
  return (t) => { n.update(t + .5); q.update(t + .3); };
}};

// s5: Das Tape gleitet herein, die Maske in der Mitte leuchtet auf, zwei Labels
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const pre = note(root, 'dann kam das Tape.', { x: 110, y: 240, r: -3, t0: 0, size: 92 });
  const head = bigText(root, 'Die Maske sitzt *im* *Tape.*', { x: 90, y: 230, w: 900, size: 116, t0: D * .3, step: .07 });
  const glow = svg(`<ellipse cx="200" cy="200" rx="150" ry="80" fill="${C.weiss}" opacity=".55"/><ellipse cx="200" cy="200" rx="190" ry="110" fill="${C.weiss}" opacity=".25"/>`, {}, root, '0 0 400 400', 600, 600);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 940, 940);
  const l1 = label(root, 'Kollagen', { x: 130, y: 980 });
  const l2 = label(root, 'Hyaluronsäure', { x: 520, y: 1060 });
  const ring = svg(`<rect x="10" y="10" width="380" height="150" rx="75" fill="none" stroke="${C.beere}" stroke-width="8" stroke-dasharray="18 14"/>`, {}, root, '0 0 400 170', 470, 200);
  return (t) => {
    pre.update(t); pre.node.style.opacity = Math.min(+pre.node.style.opacity, 1 - pr(t, D * .26, D * .32));
    head.update(t);
    const k = pr(t, .1, 1.1, ease.outCubic);
    place(tape, lerp(1400, 540, k), 760, 1, lerp(24, -3, k));
    const g = pr(t, D * .4, D * .4 + .5);
    place(glow, 540, 760, 1 + Math.sin(t * 3) * .04 * g, 0, g);
    place(ring, 540, 760, 1 + Math.sin(t * 3) * .03, -3, g);
    popIn(l1, t, D * .6, -3); popIn(l2, t, D * .76, 2);
  };
}};

// s6: Nacht – sie schläft mit Tape, der Mond zieht über den Himmel, Kissen bleibt sauber
SCENES.s6 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Bleibt, wo sie *hin* *soll.*', { x: 90, y: 220, w: 900, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .07 });
  const stars = svg([[60, 60], [300, 40], [520, 90], [700, 30], [180, 150], [620, 170]].map(([x, y], i) => ART.star(x, y, .9 + (i % 3) * .3)).join(''), {}, root, '0 0 760 200', 860, 226);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 200, 200);
  const pil = svg(pillow({ fill: C.rosaHell }), {}, root, '0 0 600 420', 900, 630);
  const her = svg(sleeper(1), {}, root, '0 0 400 460', 420, 483);
  const blanket = svg(`<path d="M0 90 C200 40 700 40 900 90 L900 400 L0 400Z" fill="${C.rosaTief}"/><path d="M0 90 C200 40 700 40 900 90 L900 140 C700 96 200 96 0 140Z" fill="${C.weiss}"/>
      <path d="M120 240 C220 220 300 250 380 230 M500 300 C600 280 700 300 800 280" fill="none" stroke="${C.beere}" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"/>`, {}, root, '0 0 900 400', 900, 400);
  const zz = svg(sparkle(30, 30, .8, '#F7E7C6') + sparkle(90, 70, .5, '#F7E7C6'), {}, root, '0 0 120 100', 120, 100);
  const clean = note(root, 'Kissen:\nsauber', { x: 720, y: 880, r: -6, t0: D * .55, size: 58, color: C.schwarz });
  return (t) => {
    head.update(t); clean.update(t);
    place(stars, 540, 560, 1, 0, .55 + Math.sin(t * 2) * .2);
    const m = pr(t, 0, D, ease.lin);
    place(moon, lerp(170, 900, m), 620 - Math.sin(m * Math.PI) * 120, 1, lerp(-20, 20, m));
    place(pil, 540, 1010, 1);
    place(her, 540, 980 + Math.sin(t * 1.6) * 4, 1, 0);
    place(blanket, 540, 1260, 1);
    const tw2 = Math.abs(Math.sin(t * 1.8));
    place(zz, 230, 700, .7 + tw2 * .4, t * 25, tw2);
  };
}};

// s7: Morgen – Sonne, sauberes Kissen bekommt ein Häkchen
SCENES.s7 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const n = note(root, 'Lippen: weich.', { x: 120, y: 250, r: -4, t0: 0, size: 96 });
  const head = bigText(root, 'Kissen ist wieder *Kissen.*', { x: 90, y: 230, w: 900, size: 120, t0: D * .5, step: .07 });
  const sun = svg(`<circle cx="200" cy="200" r="90" fill="#F7E7C6"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${200 + Math.cos(a) * 120}" y1="${200 + Math.sin(a) * 120}" x2="${200 + Math.cos(a) * 160}" y2="${200 + Math.sin(a) * 160}" stroke="#F7E7C6" stroke-width="16" stroke-linecap="round"/>`; }).join('')}`, {}, root, '0 0 400 400', 300, 300);
  const pil = svg(pillow({ shine: 0, id: 7 }), {}, root, '0 0 600 420', 900, 630);
  const chk = svg(`<circle cx="200" cy="200" r="150" fill="${C.schwarz}"/><path d="M118 206 L178 266 L290 142" fill="none" stroke="${C.weiss}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 400 400', 220, 220);
  return (t) => {
    n.update(t); n.node.style.opacity = Math.min(+n.node.style.opacity, 1 - pr(t, D * .42, D * .48));
    head.update(t);
    place(sun, 860, tw(t, 0, 1.4, 760, 640, ease.outCubic), 1, t * 8, .95);
    place(pil, 520, 960 + noise(t, 1) * 3, 1, -2);
    pil.querySelector('svg').innerHTML = pillow({ shine: pr(t, D * .2, D * .2 + 1.2, ease.inOutCubic), id: 7 });
    const c = pr(t, D * .62, D * .62 + .4, ease.outBack);
    chk.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, D * .66, D * .66 + .5));
    place(chk, 840, 1180, c, -6, clamp((t - D * .62) / .1));
  };
}};
