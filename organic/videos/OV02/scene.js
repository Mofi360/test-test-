/* OV02 – Der Lippenstift blieb drauf  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, clamp, lerp } = DT;

// ---------- eigene Illustrationen ----------
const ROT = C.beere;

/** Lippenstift mit drehbarer Mine. rise 0..1, ohne Kappe */
function lipstickArt(rise = 1, tilt = 0) {
  const h = lerp(14, 118, rise);
  return `<g transform="translate(200 250)">
    <rect x="-46" y="0" width="92" height="140" rx="12" fill="${C.schwarz}"/>
    <rect x="-46" y="112" width="92" height="10" fill="#3a2e33"/>
    <rect x="-36" y="-44" width="72" height="48" rx="4" fill="#D9C2A0"/>
    <rect x="-36" y="-44" width="72" height="8" fill="#C4A984"/>
    <path d="M-28 -44 L-28 ${-44 - h + 10} Q-28 ${-44 - h - 6} -12 ${-44 - h - 14} L28 ${-44 - h - 34} L28 -44Z" fill="${ROT}"/>
    <path d="M14 -48 L14 ${-44 - h - 18}" stroke="#fff" stroke-opacity=".3" stroke-width="7" stroke-linecap="round"/>
  </g>`;
}
/** Kappe einzeln (gleiches Koordinatensystem wie lipstickArt) */
function capArt() {
  return `<g transform="translate(200 250)"><rect x="-50" y="-170" width="100" height="168" rx="14" fill="${C.schwarz}"/>
    <rect x="-36" y="-158" width="14" height="140" rx="7" fill="#fff" opacity=".14"/></g>`;
}
/** Flurspiegel mit Holzrahmen + Konsole */
function hallMirror() {
  return `<g>
    <rect x="60" y="40" width="280" height="360" rx="140" fill="${C.schwarz}"/>
    <rect x="80" y="60" width="240" height="320" rx="120" fill="#F7EEF0"/>
    <path d="M120 150 L180 90 M118 205 L215 108" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M250 380 L250 230 L320 230" fill="none" stroke="${C.rosaTief}" stroke-width="6" opacity=".7"/>
  </g>`;
}
/** Garderobe mit Mantel + Tasche */
function coatRack() {
  return `<g>
    <rect x="20" y="40" width="360" height="22" rx="11" fill="${C.schwarz}"/>
    ${[80, 200, 320].map(x => `<circle cx="${x}" cy="74" r="12" fill="${C.schwarz}"/>`).join('')}
    <path d="M200 80 C150 90 120 120 112 170 L96 390 L304 390 L288 170 C280 120 250 90 200 80Z" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="6"/>
    <path d="M200 84 L176 190 L200 230 L224 190Z" fill="${C.rosaTief}"/>
    <path d="M200 230 L200 388" stroke="${C.schwarz}" stroke-width="4"/>
    <circle cx="214" cy="270" r="6" fill="${C.schwarz}"/><circle cx="214" cy="320" r="6" fill="${C.schwarz}"/>
    <path d="M318 74 C340 120 350 160 350 200" fill="none" stroke="${C.schwarz}" stroke-width="5"/>
    <rect x="300" y="196" width="80" height="90" rx="14" fill="${C.schwarz}"/>
  </g>`;
}
/** Taschentuch mit rotem Abdruck */
function tissueArt(print = 1) {
  return `<g>
    <path d="M60 70 C120 52 170 80 220 62 C270 48 320 66 345 72 C334 140 352 200 338 262 C328 300 344 330 336 344 C270 330 220 352 160 336 C110 326 80 344 56 338 C66 270 46 210 62 150 C68 120 54 96 60 70Z" fill="#fff" stroke="${C.schwarz}" stroke-opacity=".14" stroke-width="4"/>
    <path d="M90 100 C160 120 250 96 316 112 M80 300 C150 290 250 316 318 300" stroke="${C.schwarz}" stroke-opacity=".07" stroke-width="4" fill="none"/>
    <g opacity="${.85 * print}" transform="translate(200 208) scale(.52) rotate(-6) translate(-200 -200)">${ART.lips(.45, ROT)}</g>
    <path d="M250 228 C268 232 280 240 292 252" stroke="${ROT}" stroke-width="7" stroke-linecap="round" opacity="${.5 * print}" fill="none"/>
  </g>`;
}
/** Fenster mit Nachthimmel und Mond */
function nightWindow(moonY = 0) {
  return `<g>
    <rect x="20" y="20" width="360" height="420" rx="10" fill="${C.nachtHell}" stroke="#4a3a50" stroke-width="16"/>
    <clipPath id="wclip"><rect x="28" y="28" width="344" height="404"/></clipPath>
    <g clip-path="url(#wclip)">
      <g transform="translate(120 ${10 + moonY}) scale(.55)">${ART.moon()}</g>
      ${ART.star(90, 110, .9)}${ART.star(300, 330, .7)}${ART.star(70, 360, .6)}${ART.star(320, 80, .5)}
    </g>
    <path d="M200 28 L200 432 M28 230 L372 230" stroke="#4a3a50" stroke-width="12"/>
    <rect x="0" y="430" width="400" height="20" rx="6" fill="#4a3a50"/>
  </g>`;
}
/** Sonne mit Strahlen */
function sunArt(rot = 0) {
  return `<g transform="translate(200 200)"><g transform="rotate(${rot})">
    ${Array.from({ length: 12 }, (_, i) => `<rect x="-9" y="-190" width="18" height="56" rx="9" fill="#F6C76B" transform="rotate(${i * 30})"/>`).join('')}</g>
    <circle r="112" fill="#F6C76B"/><circle cx="-38" cy="-40" r="22" fill="#fff" opacity=".35"/></g>`;
}
/** Torte mit Kerzen (flame 0..1 Flackern) */
function cakeArt(fl = 0) {
  const fx = (x, s) => `<path d="M${x} ${118 - s * 4} C${x - 14} ${100} ${x - 6} ${84} ${x} ${70 - s * 6} C${x + 6} ${84} ${x + 14} ${100} ${x} ${118 - s * 4}Z" fill="#F6C76B"/>`;
  return `<g>
    <rect x="70" y="300" width="260" height="20" rx="10" fill="${C.schwarz}"/>
        <rect x="80" y="210" width="240" height="92" rx="10" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="6"/>
    <rect x="120" y="140" width="160" height="72" rx="10" fill="#fff" stroke="${C.schwarz}" stroke-width="6"/>
    <path d="M80 226 C100 250 110 226 130 246 C150 266 160 228 180 248 C200 268 210 228 232 250 C254 270 262 228 284 248 C300 262 310 236 320 230 L320 216 L80 216Z" fill="${C.rosaTief}"/>
    <path d="M120 156 C136 176 150 152 168 172 C186 190 200 154 220 172 C240 190 252 152 280 166 L280 146 L120 146Z" fill="${C.rosaTief}"/>
    ${[160, 200, 240].map((x, i) => `<rect x="${x - 7}" y="104" width="14" height="40" rx="4" fill="${i === 1 ? C.beere : C.schwarz}"/>${fx(x, Math.sin(fl * 7 + i * 2) )}`).join('')}
    ${[110, 150, 250, 290].map(x => `<circle cx="${x}" cy="280" r="7" fill="#fff"/>`).join('')}
  </g>`;
}
/** Nachttisch */
function nightstand() {
  return `<g>
    <rect x="0" y="0" width="880" height="30" rx="8" fill="#4a3a50"/>
    <rect x="30" y="30" width="820" height="200" fill="#3a2d40"/>
    <rect x="70" y="60" width="740" height="140" rx="8" fill="none" stroke="#5a4862" stroke-width="6"/>
    <rect x="400" y="118" width="80" height="18" rx="9" fill="#F7E7C6"/>
  </g>`;
}

/** Ganzflächige Overlay-SVG für gezeichnete Pfeile/Linien */
function overlay(root, markup) { return svg(markup, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920); }
function drawPath(p, k) { p.setAttribute('stroke-dashoffset', 1 - k); }

// ---------- s1: Flur, Lippenstift wird herausgedreht ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const hook = bigText(root, 'Ich hab ihn wieder *abgewischt.*', { y: 220, size: 116, w: 940, t0: -3 });
  const floor = el('div', { left: 0, top: '1250px', width: '1080px', height: '670px', background: C.rosaTief, opacity: .45 }, root);
  const mir = svg(hallMirror(), {}, root, '0 0 400 400', 600, 600);
  const rack = svg(coatRack(), {}, root, '0 0 400 400', 420, 420);
  const ls = svg(lipstickArt(0), {}, root, '0 0 400 400', 520, 520);
  const lab = note(root, 'Hochzeit meiner Nichte', { x: 70, y: 1200, r: -3, size: 58, t0: .2 });
  return (t) => {
    place(mir, 340, 900, 1, -1.5);
    place(rack, 960, 800, .85, 0);
    const k = pr(t, .5, 2.4, ease.inOutCubic);
    ls.querySelector('svg').innerHTML = lipstickArt(k);
    place(ls, 660 + noise(t, 2) * 4, 1020 + noise(t, 5) * 4, 1.05, tw(t, 0, 2.4, -4, 10, ease.inOutSine));
    lab.update(t);
  };
}};

// ---------- s2: Taschentuch flattert herein, Kappe klickt zu ----------
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const d = ctx.dur;
  const head = bigText(root, 'Wieder *runter* damit.', { y: 230, size: 130, step: .07 });
  const tis = svg(tissueArt(1), {}, root, '0 0 400 400', 640, 640);
  const ls = svg(lipstickArt(.25), {}, root, '0 0 400 400', 440, 440);
  const cap = svg(capArt(), {}, root, '0 0 400 400', 440, 440);
  const clickT = d * .72;
  const burst = overlay(root, [0, 1, 2, 3, 4].map(i => { const a = (-150 + i * 30) * Math.PI / 180; return `<line x1="${250 + Math.cos(a) * 120}" y1="${980 + Math.sin(a) * 120}" x2="${250 + Math.cos(a) * 170}" y2="${980 + Math.sin(a) * 170}" stroke="${C.schwarz}" stroke-width="9" stroke-linecap="round"/>`; }).join(''));
  const click = note(root, 'klick.', { x: 110, y: 905, r: -8, size: 84, t0: clickT });
  return (t) => {
    head.update(t);
    // Taschentuch flattert von rechts oben herein
    const f = pr(t, .4, 2.2, ease.outCubic);
    const sway = Math.sin(t * 3.2) * (1 - f) * 40;
    place(tis, lerp(1250, 650, f) + sway, lerp(560, 900, f) + Math.sin(t * 4) * (1 - f) * 30, 1, lerp(40, -7, f) + Math.sin(t * 5) * (1 - f) * 12, clamp((t - .4) / .2));
    // Lippenstift + Kappe
    place(ls, 250, 1180, 1, 0);
    const c = pr(t, clickT - .7, clickT, ease.inCubic);
    place(cap, 250, lerp(820, 1180, c), 1, lerp(-12, 0, c), pr(t, clickT - 1, clickT - .8));
    const b = pr(t, clickT, clickT + .35);
    burst.style.opacity = t > clickT ? (1 - b) : 0;
    burst.style.transform = `scale(${1 + b * .15})`; burst.style.transformOrigin = '250px 980px';
    click.update(t);
  };
}};

// ---------- s3: Forum auf dem Handy, echtes Zitat ----------
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const ph = svg(`<g transform="translate(200 200)"><rect x="-150" y="-260" width="300" height="520" rx="44" fill="${C.schwarz}"/>
    <rect x="-136" y="-246" width="272" height="492" rx="32" fill="${C.rosaHell}"/>
    <rect x="-34" y="-236" width="68" height="14" rx="7" fill="${C.schwarz}"/>
    <rect x="-116" y="-206" width="150" height="20" rx="10" fill="${C.schwarz}" opacity=".7"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="-100" cy="${-140 + i * 64}" r="16" fill="${C.rosaTief}"/><rect x="-72" y="${-150 + i * 64}" width="${170 - (i % 3) * 30}" height="10" rx="5" fill="${C.schwarz}" opacity=".25"/><rect x="-72" y="${-132 + i * 64}" width="${120 + (i % 2) * 40}" height="10" rx="5" fill="${C.schwarz}" opacity=".14"/>`).join('')}
  </g>`, {}, root, '0 0 400 400', 620, 620);
  const card = quoteCard(root, 'I would absolutely love to rock a red lip but I just can’t pull it off.', 'Frau in einem Forum', { x: 120, y: 440, w: 840, size: 62, t0: .5, r: -2 });
  const n = note(root, 'Das war ich.', { x: 560, y: 1170, r: -5, size: 80, t0: ctx.dur * .55, color: C.beere });
  return (t) => {
    place(ph, 540, tw(t, 0, .6, 820, 760), 1.0, tw(t, 0, .8, 6, 3), clamp(t / .2));
    card.update(t); n.update(t);
  };
}};

// ---------- s4: Nacht, Lampe geht an, Tape auf dem Nachttisch ----------
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const d = ctx.dur;
  const head = bigText(root, 'Pflege über *Nacht.*', { y: 220, size: 124, color: '#fff', accent: C.rosa, step: .07 });
  const win = svg(nightWindow(0), {}, root, '0 0 400 460', 400, 460);
  const stand = svg(nightstand(), {}, root, '0 0 880 230', 880, 230);
  const lamp = svg(ART.lamp(0), {}, root, '0 0 400 400', 520, 520);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 440, 440);
  const ls = svg(lipstickArt(0) + capArt(), {}, root, '0 0 400 400', 240, 240);
  const onT = d * .45;
  return (t) => {
    head.update(t);
    win.querySelector('svg').innerHTML = nightWindow(tw(t, 0, d, 30, 0, ease.inOutSine));
    place(win, 730, 720, 1, 0);
    place(stand, 540, 1215, 1, 0);
    const on = pr(t, onT, onT + .35);
    lamp.querySelector('svg').innerHTML = ART.lamp(on);
    place(lamp, 290, 840, 1, 0);
    place(ls, 900, 1032, 1, 0, .9);
    const k = pr(t, onT + .2, onT + 1.1, ease.outBack);
    place(tape, 640, lerp(960, 1050, k), 1, lerp(-20, -4, k), clamp((t - onT - .2) / .2));
  };
}};

// ---------- s5: Tape legt sich über die Lippen, Mitte leuchtet ----------
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const d = ctx.dur;
  const head = bigText(root, 'Pflege-Mitte mit *Kollagen.*', { y: 220, size: 118, step: .06 });
  const lips = svg(ART.lips(.55), {}, root, '0 0 400 400', 880, 880);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 640, 640);
  const land = d * .3;
  const glowT = d * .45;
  const rings = overlay(root, [0, 1].map(i => `<rect class="r" x="${540 - 160 - i * 30}" y="${890 - 65 - i * 30}" width="${320 + i * 60}" height="${130 + i * 60}" rx="${65 + i * 30}" fill="none" stroke="#fff" stroke-width="${8 - i * 3}"/>`).join(''));
  const arrows = overlay(root, `
    <path d="M300 1150 C300 1060 340 1000 450 950" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M750 1150 C750 1060 720 1000 630 950" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`);
  const ap = arrows.querySelectorAll('path');
  const l1 = note(root, 'Kollagen', { x: 150, y: 1160, r: -4, size: 76, t0: d * .56 });
  const l2 = note(root, 'Hyaluronsäure', { x: 510, y: 1160, r: 3, size: 76, t0: d * .68 });
  return (t) => {
    head.update(t);
    place(lips, 540, 890, 1, 0);
    const k = pr(t, .3, land, ease.outCubic);
    place(tape, 540, lerp(560, 890, k), lerp(1.12, 1, k), lerp(-10, 0, k), clamp((t - .3) / .25));
    const g = pr(t, glowT, glowT + 1.4, ease.outCubic);
    rings.style.opacity = t > glowT ? (1 - g) * .9 : 0;
    rings.style.transformOrigin = '540px 890px'; rings.style.transform = `scale(${1 + g * .35})`;
    drawPath(ap[0], pr(t, d * .56, d * .56 + .5)); drawPath(ap[1], pr(t, d * .68, d * .68 + .5));
    l1.update(t); l2.update(t);
  };
}};

// ---------- s6: Morgen, Tape wird abgezogen ----------
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const d = ctx.dur;
  const head = bigText(root, 'Weich.', { y: 240, size: 170, step: .06 });
  const sun = svg(sunArt(0), {}, root, '0 0 400 400', 380, 380);
  const lips = svg(ART.lips(.55), {}, root, '0 0 400 400', 880, 880);
  const tape = svg(ART.tape(true), { transformOrigin: '110px 440px' }, root, '0 0 400 400', 880, 880);
  const gloss = overlay(root, `
    <path d="M340 868 C380 846 420 840 460 846" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M600 966 C650 976 700 968 740 950" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path d="M490 990 C520 998 560 998 588 992" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`);
  const gp = gloss.querySelectorAll('path');
  const n = note(root, 'Irgendwie voller.', { x: 300, y: 1150, r: -4, size: 84, t0: d * .55 });
  return (t) => {
    head.update(t);
    place(sun, 830, 400 + tw(t, 0, d, 30, 0, ease.inOutSine), 1, 0);
    sun.querySelector('svg').innerHTML = sunArt(t * 8);
    place(lips, 540, 900, 1, 0);
    const k = pr(t, .4, d * .4, ease.inOutCubic);
    // Abziehen: dreht um das linke Ende, fliegt dann raus
    tape.style.left = '0px'; tape.style.top = '0px';
    tape.style.transform = `translate(${100 + k * 520}px, ${460 - k * 420}px) rotate(${-k * 28}deg)`;
    tape.style.opacity = 1 - pr(t, d * .3, d * .4);
    gp.forEach((p, i) => drawPath(p, pr(t, d * .4 + i * .15, d * .4 + i * .15 + .6)));
    n.update(t);
  };
}};

// ---------- s7: Geburtstag, Lippenstift bleibt drauf ----------
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const d = ctx.dur;

  const cake = svg(cakeArt(0), {}, root, '0 0 400 400', 640, 640);
  const ls = svg(lipstickArt(1), {}, root, '0 0 400 400', 460, 460);
  const cap = svg(capArt(), {}, root, '0 0 400 400', 300, 300);
  const table = el('div', { left: 0, top: '1250px', width: '1080px', height: '670px', background: C.rosaTief, opacity: .45 }, root);
  const cols = [C.weiss, C.rosaTief, C.weiss, C.beere, C.rosaHell, C.rosaTief];
  const conf = overlay(root, Array.from({ length: 34 }, (_, i) => `<rect class="c" x="-8" y="-14" width="${i % 3 ? 16 : 22}" height="${i % 3 ? 28 : 12}" rx="3" fill="${cols[i % cols.length]}"/>`).join(''));
  const cs = [...conf.querySelectorAll('rect')];
  const head = bigText(root, 'Diesmal blieb er *drauf.*', { y: 220, size: 124, step: .06 });
  return (t) => {
    head.update(t);
    cake.querySelector('svg').innerHTML = cakeArt(t);
    place(cake, 400, 990, tw(t, 0, .6, .92, 1, ease.outBack), 0, clamp(t / .2));
    place(ls, 800, 1010, 1, tw(t, .2, .9, 18, 4, ease.outBack));
    place(cap, 930, 1180, 1, 78);
    cs.forEach((r, i) => {
      const sx = (i * 137) % 1000 + 40, sp = 220 + (i * 53) % 160, ph = (i * 0.37) % 1;
      const y = 520 + ((t * sp + ph * 800) % 800);
      const x = sx + Math.sin(t * 2 + i) * 30;
      r.setAttribute('transform', `translate(${x} ${y}) rotate(${(t * 180 + i * 40) % 360})`);
      r.setAttribute('opacity', clamp((t - .3) * 2) * (y > 1290 ? 0 : 1) * clamp((y - 520) / 60));
    });
  };
}};
