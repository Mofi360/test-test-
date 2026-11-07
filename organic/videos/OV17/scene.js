/* OV17 – Freundin kam aus dem Studio  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;

// ---------- eigene Illustrationen ----------
const QUOTE = 'don\'t want to end up looking fake and scared of pain haha';
const HAIR = '#2A1D22', HAIR2 = '#7A4B3A', MOND = '#F7E7C6';
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

/** Brustbild einer Figur, viewBox 0 0 300 380.
 *  o.hair 'long'|'bun'|'bob', o.hairColor, o.top, o.mouth 'smile'|'grin'|'worry'|'flat', o.brows 'normal'|'worry', o.eyes 'open'|'happy', o.look (-1..1) */
function person(o = {}) {
  const H = o.hairColor ?? HAIR, top = o.top ?? C.schwarz, lx = (o.look ?? 0) * 7, S = C.schwarz;
  const hair = o.hair ?? 'long';
  const back = hair === 'long' ? `<path d="M56 150 C38 66 98 34 150 34 C202 34 262 66 244 150 C250 210 262 260 256 316 L44 316 C38 260 50 210 56 150Z" fill="${H}"/>`
    : hair === 'bun' ? `<circle cx="150" cy="36" r="40" fill="${H}"/>`
    : `<path d="M58 150 C42 70 100 40 150 40 C200 40 258 70 242 150 L250 236 C220 250 80 250 50 236Z" fill="${H}"/>`;
  const front = hair === 'bun'
    ? `<path d="M62 150 C56 80 100 50 150 50 C200 50 244 80 238 150 C224 104 196 84 150 84 C104 84 76 104 62 150Z" fill="${H}"/>`
    : `<path d="M62 146 C62 80 108 52 162 56 C142 82 112 104 66 126Z" fill="${H}"/><path d="M238 146 C234 92 206 64 170 58 C196 84 220 106 238 146Z" fill="${H}"/>`;
  const eye = x => (o.eyes === 'happy')
    ? `<path d="M${x - 15} 156 Q${x} 140 ${x + 15} 156" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`
    : `<ellipse cx="${x + lx}" cy="152" rx="9" ry="12" fill="${S}"/><circle cx="${x + lx + 3}" cy="147" r="3.2" fill="#fff"/>`;
  const brows = o.brows === 'worry'
    ? `<path d="M100 124 Q116 116 132 110" fill="none" stroke="${H}" stroke-width="7" stroke-linecap="round"/><path d="M168 110 Q184 116 200 124" fill="none" stroke="${H}" stroke-width="7" stroke-linecap="round"/>`
    : `<path d="M100 120 Q116 108 134 114" fill="none" stroke="${H}" stroke-width="7" stroke-linecap="round"/><path d="M166 114 Q184 108 200 120" fill="none" stroke="${H}" stroke-width="7" stroke-linecap="round"/>`;
  const m = o.mouth ?? 'smile';
  const mouth = m === 'grin' ? `<path d="M124 196 Q150 228 176 196 Q150 204 124 196Z" fill="${C.lippe}"/><path d="M132 200 Q150 206 168 200" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : m === 'worry' ? `<path d="M130 210 Q150 196 170 210" fill="none" stroke="${C.lippe}" stroke-width="8" stroke-linecap="round"/>`
    : m === 'flat' ? `<path d="M134 204 L166 204" fill="none" stroke="${C.lippe}" stroke-width="8" stroke-linecap="round"/>`
    : `<path d="M128 198 Q150 216 172 198" fill="none" stroke="${C.lippe}" stroke-width="8" stroke-linecap="round"/>`;
  return `<g>
    ${back}
    <path d="M36 380 C36 314 88 282 150 282 C212 282 264 314 264 380Z" fill="${top}"/>
    <rect x="130" y="224" width="40" height="66" rx="12" fill="${C.hautDunkel}"/>
    <ellipse cx="66" cy="160" rx="14" ry="20" fill="${C.hautDunkel}"/><ellipse cx="234" cy="160" rx="14" ry="20" fill="${C.haut}"/>
    <ellipse cx="150" cy="150" rx="86" ry="96" fill="${C.haut}"/>
    ${front}${brows}${eye(118)}${eye(182)}
    <path d="M148 162 C145 176 144 182 152 184" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="102" cy="188" rx="18" ry="10" fill="${C.rosaTief}" opacity=".5"/><ellipse cx="198" cy="188" rx="18" ry="10" fill="${C.rosaTief}" opacity=".5"/>
    ${mouth}
  </g>`;
}

/** Tasse, viewBox 0 0 200 170 */
const mug = (c = C.weiss) => `<path d="M30 40 L150 40 L140 150 C138 162 42 162 40 150Z" fill="${c}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M148 64 C190 60 190 120 142 118" fill="none" stroke="${C.schwarz}" stroke-width="6"/>
  <ellipse cx="90" cy="42" rx="60" ry="10" fill="#B9846A" stroke="${C.schwarz}" stroke-width="5"/>
  <path d="M70 92 C80 84 100 84 110 92 C100 104 80 104 70 92Z" fill="${C.rosaTief}" opacity=".6"/>`;
/** Dampf, viewBox 0 0 120 160 */
const steam = (t) => [30, 70].map((x, i) => { let d = ''; for (let y = 150; y >= 10; y -= 10) d += (y === 150 ? 'M' : 'L') + (x + Math.sin(y / 22 - t * 3 + i * 2) * 9).toFixed(1) + ' ' + y; return `<path d="${d}" fill="none" stroke="${C.weiss}" stroke-width="8" stroke-linecap="round" opacity=".9"/>`; }).join('');

/** Wolke, viewBox 0 0 360 240. icon 'bolt' | 'q' */
function cloud(icon) {
  const ic = icon === 'bolt'
    ? `<path d="M196 58 L140 136 L180 136 L160 196 L226 108 L186 108 L208 58Z" fill="${C.beere}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>`
    : `<text x="180" y="186" text-anchor="middle" font-family="Gloock, serif" font-size="150" fill="${C.schwarz}">?</text>`;
  return `<path d="M70 200 C24 200 14 140 56 124 C48 74 108 52 138 82 C152 34 236 30 250 88 C300 70 344 116 314 156 C350 176 330 214 292 210 Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="96" cy="232" r="9" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="5"/>${ic}`;
}

/** Handspiegel, viewBox 0 0 500 820, Glas mittig bei (250 270) r 200; inner = Markup im Glas */
function handMirror(inner) {
  return `<defs><clipPath id="mg"><circle cx="250" cy="270" r="196"/></clipPath></defs>
    <rect x="218" y="470" width="64" height="320" rx="30" fill="${C.schwarz}"/>
    <rect x="232" y="500" width="14" height="240" rx="7" fill="#fff" opacity=".2"/>
    <circle cx="250" cy="270" r="232" fill="${C.schwarz}"/>
    <circle cx="250" cy="270" r="196" fill="${C.rosaHell}"/>
    <g clip-path="url(#mg)">${inner}
      <path d="M110 170 L190 90 M100 230 L220 110" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".55"/></g>`;
}

const label = (parent, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '12px 32px 16px', background: o.bg ?? C.schwarz, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 54) + 'px', borderRadius: '44px', whiteSpace: 'nowrap' }, parent, text);
const popIn = (n, t, t0, rot = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };
const fadeOut = (node, t, t0, t1) => { node.style.opacity = Math.min(+node.style.opacity, 1 - pr(t, t0, t1)); };

// ---------- Szenen ----------
// s1: Café – die Freundin kommt dazu, Glitzer über ihr. Hook statisch.
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Meine beste Freundin kam aus dem *Lippen-Studio.*', { x: 80, y: 200, w: 940, size: 96 });
  hook.update(99);
  // Café-Fenster im Hintergrund
  const win = svg(`<path d="M0 360 L0 120 A170 120 0 0 1 340 120 L340 360Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="7"/>
    <path d="M170 10 L170 360 M0 200 L340 200" stroke="${C.schwarz}" stroke-width="6"/>
    <path d="M40 150 L100 90 M60 300 L130 230" stroke="${C.rosa}" stroke-width="12" stroke-linecap="round"/>`, {}, root, '-10 0 360 370', 300, 330);
  const me = svg(person({ hair: 'long', top: C.schwarz, look: .8, mouth: 'smile' }), {}, root, '0 0 300 380', 330, 418);
  const fr = svg(person({ hair: 'bun', hairColor: HAIR2, top: C.rosaTief, look: -.6, mouth: 'grin', eyes: 'happy' }), {}, root, '0 0 300 380', 330, 418);
  const sp = svg(sparkle(60, 70, 1.3) + sparkle(170, 30, .8) + sparkle(250, 100, 1) + sparkle(130, 140, .5, C.beere), {}, root, '0 0 300 180', 300, 180);
  const table = el('div', { left: '60px', top: '1170px', width: '960px', height: '34px', background: C.schwarz, borderRadius: '17px' }, root);
  el('div', { left: '520px', top: '1200px', width: '40px', height: '130px', background: C.schwarz }, root);
  el('div', { left: '400px', top: '1310px', width: '280px', height: '24px', borderRadius: '12px', background: C.schwarz }, root);
  const m1 = svg(mug(C.weiss), {}, root, '0 0 200 170', 170, 145);
  const m2 = svg(mug(C.rosa), {}, root, '0 0 200 170', 170, 145);
  const st = svg(steam(0), {}, root, '0 0 120 160', 100, 130);
  const n = note(root, 'Samstag.', { x: 120, y: 1225, r: -5, t0: D * .15, size: 76 });
  return (t) => {
    n.update(t);
    place(win, 540, 800, 1, 0);
    place(me, 300, 980 + noise(t, 1) * 3, 1, 2);
    // Freundin kommt herein und setzt sich
    // Freundin hüpft kurz vor Freude (Glitzer-Moment)
    const hop = Math.sin(pr(t, .3, 1.1, ease.lin) * Math.PI * 2);
    place(fr, 790, 966 - Math.max(0, hop) * 34, 1, -2 + hop * 3);
    const g = pr(t, .45, .9, ease.outBack), tw1 = Math.abs(Math.sin(t * 2.6));
    place(sp, 800, 700, g * (.85 + tw1 * .2), Math.sin(t * 1.5) * 8, clamp((t - .45) / .15));
    place(m1, 440, 1112, 1, 0);
    place(m2, 760, 1112, 1, 0);
    st.querySelector('svg').innerHTML = steam(t);
    place(st, 440, 1035, .6, 0, .8);
  };
}};

// s2: Gruppenchat – Wow-Nachrichten stapeln sich, sie klein daneben
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const pre = note(root, 'alle in der Gruppe:', { x: 110, y: 230, r: -3, t0: 0, size: 84 });
  const head = bigText(root, 'Ich trau mich das *nie.*', { x: 90, y: 210, w: 920, size: 112, t0: D * .45, step: .07 });
  const phone = el('div', { left: '330px', top: '440px', width: '560px', height: '880px', background: C.schwarz, borderRadius: '64px', boxShadow: '0 40px 70px -30px rgba(21,16,18,.5)' }, root);
  const screen = el('div', { left: '18px', top: '18px', width: '524px', height: '844px', background: C.rosaHell, borderRadius: '48px', overflow: 'hidden' }, phone);
  const bar = el('div', { left: 0, top: 0, width: '524px', height: '130px', background: C.weiss }, screen);
  el('div', { left: '210px', top: '14px', width: '104px', height: '26px', borderRadius: '13px', background: C.schwarz }, bar);
  const cols = [C.rosaTief, HAIR2, C.lippeHell, C.beere];
  cols.forEach((c, i) => el('div', { left: (40 + i * 34) + 'px', top: '66px', width: '46px', height: '46px', borderRadius: '50%', background: c, border: '4px solid #fff' }, bar));
  el('div', { left: '206px', top: '66px', fontFamily: F.sans, fontWeight: 700, fontSize: '36px', color: C.schwarz }, bar, 'Mädels');
  const msgs = [
    { txt: 'frisch aus dem Studio', c: C.rosaTief, me: false },
    { txt: 'Wow!!', c: HAIR2 },
    { txt: 'WOW', c: C.lippeHell },
    { txt: 'wow, so schön', c: C.beere },
    { txt: 'Waaas. Wow.', c: HAIR2 },
    { txt: 'Wow wow wow', c: C.lippeHell },
  ];
  const bubbles = msgs.map((m, i) => {
    const row = el('div', { left: '24px', top: '0px', width: '480px', height: '96px' }, screen);
    el('div', { left: 0, top: '30px', width: '58px', height: '58px', borderRadius: '50%', background: m.c }, row);
    const b = el('div', { left: '76px', top: 0, padding: '18px 30px 22px', background: i === 0 ? C.weiss : C.weiss, borderRadius: '34px 34px 34px 8px', fontFamily: F.sans, fontWeight: i === 0 ? 500 : 700, fontSize: i === 0 ? '34px' : '48px', color: C.schwarz, whiteSpace: 'nowrap', boxShadow: '0 6px 0 rgba(21,16,18,.08)' }, row, m.txt);
    return row;
  });
  const me = svg(person({ hair: 'long', top: C.schwarz, look: .9, mouth: 'worry', brows: 'worry' }), {}, root, '0 0 300 380', 260, 330);
  const times = [.05, .45, .75, 1.0, 1.25, 1.5];
  const H = 118, bottom = 844 - 40;
  return (t) => {
    pre.update(t); fadeOut(pre.node, t, D * .4, D * .46); head.update(t);
    // Stapel: jede neue Nachricht schiebt die älteren nach oben
    bubbles.forEach((b, i) => {
      const newer = times.reduce((a, ti, j) => a + (j > i ? pr(t, ti, ti + .3, ease.outCubic) : 0), 0);
      const k = pr(t, times[i], times[i] + .35, ease.outBack);
      const y = bottom - 96 - newer * H;
      b.style.opacity = clamp((t - times[i]) / .1);
      b.style.transform = `translateY(${y + (1 - k) * 50}px) scale(${.8 + .2 * k})`;
      b.style.transformOrigin = '0 100%';
    });
    place(phone, 610, 880, 1, 3 + noise(t, 3) * .6);
    // sie, ganz klein, wird beim "trau mich nie" noch kleiner
    const s = tw(t, D * .5, D * .5 + .6, 1, .82, ease.inOutCubic);
    place(me, 180, 1170, s, -3, clamp((t - .3) / .2));
  };
}};

// s3: Zwei Sorgen-Wolken ziehen über ihren Kopf
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const l1 = bigText(root, 'Angst vor *Schmerz.*', { x: 80, y: 200, w: 960, size: 100, t0: 0, step: .07 });
  const l2 = bigText(root, 'Und vor *unecht.*', { x: 80, y: 310, w: 960, size: 100, t0: D * .48, step: .07 });
  const me = svg(person({ hair: 'long', top: C.schwarz, mouth: 'worry', brows: 'worry', look: 0 }), {}, root, '0 0 300 380', 480, 608);
  const c1 = svg(cloud('bolt'), {}, root, '0 0 360 240', 340, 227);
  const c2 = svg(cloud('q'), {}, root, '0 0 360 240', 340, 227);
  return (t) => {
    l1.update(t); l2.update(t);
    place(me, 540, 1030, 1, noise(t, 4) * 1.2);
    const k1 = pr(t, .2, 1.1, ease.outCubic), k2 = pr(t, D * .48, D * .48 + .9, ease.outCubic);
    place(c1, lerp(-200, 300, k1), 640 + Math.sin(t * 1.8) * 10, 1, -4 + Math.sin(t * 1.3) * 2, k1);
    place(c2, lerp(1300, 790, k2), 600 + Math.sin(t * 1.6 + 1) * 10, 1, 4 + Math.sin(t * 1.2) * 2, k2);
  };
}};

// s4: Forum-Zitat im exakten Wortlaut
SCENES.s4 = { bg: C.rosaHell, build(root, ctx) {
  const n = note(root, 'Damit bin ich nicht allein.', { x: 100, y: 240, r: -4, t0: 0, size: 80 });
  const q = quoteCard(root, QUOTE, 'Kundin in einem Forum', { y: 470, size: 72, t0: .05 });
  const ppl = [
    person({ hair: 'bob', hairColor: HAIR2, top: C.rosaTief, mouth: 'flat' }),
    person({ hair: 'long', top: C.schwarz, mouth: 'smile', eyes: 'happy' }),
    person({ hair: 'bun', hairColor: '#B88A5A', top: C.weiss, mouth: 'flat' }),
  ].map(p => svg(p, {}, root, '0 0 300 380', 240, 304));
  return (t) => {
    n.update(t + .5); q.update(t + .3);
    ppl.forEach((p, i) => {
      const t0 = .9 + [1, 0, 2][i] * .18, k = pr(t, t0, t0 + .5, ease.outBack);
      place(p, 300 + i * 240, lerp(1500, 1180, k) + Math.sin(t * 2 + i) * 4, i === 1 ? 1.08 : .95, [-5, 0, 5][i], clamp((t - t0) / .1));
    });
  };
}};

// s5: Nacht – Was ganz anderes: Pflege. Das Tape legt sich auf die geschlossenen Lippen.
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Was ganz anderes: *Pflege.*', { x: 90, y: 200, w: 920, size: 112, color: C.weiss, accent: C.rosa, t0: .9, step: .07 });
  const stars = svg([[40, 40], [210, 90], [330, 20]].map(([x, y], i) => ART.star(x, y, .8 + i * .2)).join(''), {}, root, '0 0 380 130', 380, 130);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 170, 170);
  const face = svg(ART.face(.5, 0, .15), {}, root, '0 0 400 400', 600, 600);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 470, 470);
  const n = note(root, 'abends', { x: 790, y: 1120, r: -6, t0: D * .25, size: 74, color: C.rosa });
  // Zitat-Karte aus s4 bleibt kurz stehen und rutscht dann weg (mehr Lesezeit)
  const qc = quoteCard(root, QUOTE, 'Kundin in einem Forum', { y: 470, size: 72, t0: -5 });
  return (t) => {
    head.update(t); n.update(t);
    qc.update(9); const qk = pr(t, .55, 1.15, ease.inCubic);
    qc.node.style.transform = `translateY(${qk * 1500}px) rotate(${-1.5 + qk * 8}deg)`; qc.node.style.opacity = qk >= 1 ? 0 : 1;
    place(stars, 800, 560, 1, 0, .6 + Math.sin(t * 2) * .25);
    place(moon, 900, 640, 1, -8 + Math.sin(t) * 3);
    place(face, 520, 960 + tw(t, .9, 1.6, 60, 0), 1, 0, pr(t, .9, 1.5));
    // Tape schwebt von oben rechts herein und legt sich exakt auf die Lippen
    const t0 = D * .42, k = pr(t, t0, t0 + 1.0, ease.inOutCubic);
    const land = pr(t, t0 + .95, t0 + 1.3, ease.outBack);
    const tx = lerp(860, 520, k), ty = lerp(560, 1017, k) - Math.sin(k * Math.PI) * 80;
    place(tape, tx, ty, lerp(1.25, 1, k) * (1 + (1 - land) * .04 * (land > 0 ? 1 : 0)), lerp(28, 0, k), clamp((t - t0 + .2) / .2));
  };
}};

// s6: Pflege-Mitte – Tropfen pulsieren, der Mond zieht vorbei
SCENES.s6 = { bg: C.nachtHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Über Nacht *Feuchtigkeit.*', { x: 90, y: 200, w: 920, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .07 });
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 150, 150);
  const rip = svg('', {}, root, '0 0 600 400', 900, 600);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 940, 940);
  const drops = [0, 1, 2].map(() => svg(`<path d="M100 18 C128 62 160 92 160 128 A60 60 0 0 1 40 128 C40 92 72 62 100 18Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="8"/><path d="M72 124 A30 30 0 0 0 92 160" stroke="${C.rosaTief}" stroke-width="10" fill="none" stroke-linecap="round"/>`, {}, root, '0 0 200 200', 92, 92));
  const L = [label(root, 'Kollagen', { x: 110, y: 1010, bg: C.weiss, color: C.schwarz }),
    label(root, 'Hyaluronsäure', { x: 470, y: 1100, bg: C.weiss, color: C.schwarz }),
    label(root, 'Vitamin E', { x: 200, y: 1190, bg: C.rosa, color: C.schwarz })];
  return (t) => {
    head.update(t);
    const m = pr(t, 0, D, ease.lin);
    place(moon, lerp(130, 950, m), 560 - Math.sin(m * Math.PI) * 60, 1, lerp(-15, 15, m), .95);
    const kt = pr(t, .1, .9, ease.outCubic);
    place(tape, 540, 800, lerp(.85, 1, kt), lerp(-6, -2, kt), kt);
    // Wellen aus der Mitte
    const g = pr(t, D * .25, D * .25 + .4);
    rip.querySelector('svg').innerHTML = [0, 1, 2].map(i => { const ph = ((t * .7 + i / 3) % 1); return `<ellipse cx="300" cy="200" rx="${100 + ph * 190}" ry="${50 + ph * 110}" fill="none" stroke="${C.rosa}" stroke-width="6" opacity="${(1 - ph) * .7 * g}"/>`; }).join('');
    place(rip, 540, 800, 1, -2);
    drops.forEach((d, i) => {
      const t0 = D * .25 + i * .2, k = pr(t, t0, t0 + .4, ease.outBack);
      const pulse = 1 + Math.sin(t * 4 + i * 2) * .08;
      place(d, 540 + (i - 1) * 120, 800 - 4 - (i === 1 ? 70 : 20) + Math.sin(t * 2 + i) * 6, k * pulse * (i === 1 ? 1.1 : .85), (i - 1) * 10, clamp((t - t0) / .1));
    });
    L.forEach((l, i) => popIn(l, t, D * (.12 + i * .1) + .2, [-3, 2, -2][i]));
  };
}};

// s7: Morgen – Handspiegel, sie lächelt, Herz
SCENES.s7 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const n = note(root, 'morgens: weich.', { x: 110, y: 240, r: -4, t0: 0, size: 92 });
  const head = bigText(root, 'Sieht nach *mir* aus.', { x: 90, y: 210, w: 920, size: 122, t0: D * .38, step: .08 });
  const sun = svg(`<circle cx="200" cy="200" r="90" fill="${MOND}"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${200 + Math.cos(a) * 120}" y1="${200 + Math.sin(a) * 120}" x2="${200 + Math.cos(a) * 160}" y2="${200 + Math.sin(a) * 160}" stroke="${MOND}" stroke-width="16" stroke-linecap="round"/>`; }).join('')}`, {}, root, '0 0 400 400', 300, 300);
  const inner = `<g transform="translate(250 300) scale(1.25) translate(-150 -170)">${person({ hair: 'long', top: C.schwarz, mouth: 'smile', eyes: 'happy' })}</g>`;
  const mir = svg(handMirror(inner), { transformOrigin: '50% 90%' }, root, '0 0 500 820', 500, 820);
  const heart = svg(ART.heart(C.beere), {}, root, '0 0 400 400', 170, 170);
  const done = note(root, 'genau so.', { x: 110, y: 1170, r: -6, t0: D * .78, size: 80 });
  return (t) => {
    n.update(t); fadeOut(n.node, t, D * .32, D * .38);
    head.update(t); done.update(t);
    place(sun, 880, tw(t, 0, 1.6, 760, 600, ease.outCubic), 1, t * 8, .95);
    const k = pr(t, 0, .9, ease.outBack);
    place(mir, 560, 880, lerp(.9, 1, k), lerp(-18, -6, k) + Math.sin(t * 1.4) * 1.5, clamp(t / .2));
    const h = pr(t, D * .55, D * .55 + .45, ease.outBack);
    place(heart, 840, 930, h * (1 + Math.sin(t * 5) * .05), 12, clamp((t - D * .55) / .1));
  };
}};
