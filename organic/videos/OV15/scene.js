/* OV15 – Wofür ist das Loch?  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

// ---------- eigene Helfer ----------
/** großes, gezeichnetes Fragezeichen (viewBox 0 0 400 400) */
const qMark = (color) => `<path d="M120 140 C120 70 170 40 210 40 C270 40 300 80 300 125 C300 180 245 195 222 230 C212 246 210 262 210 285"
  fill="none" stroke="${color}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="210" cy="355" r="30" fill="${color}"/>`;

/** Kreis per Hand gezogen (Strich-Animation über pathLength) */
const handCircle = (rx, ry, color, w = 9) => `<path d="M${200 + rx * .1} ${200 - ry} C${200 + rx * 1.15} ${200 - ry * 1.05} ${200 + rx * 1.1} ${200 + ry * 1.05} ${200} ${200 + ry}
  C${200 - rx * 1.1} ${200 + ry} ${200 - rx * 1.12} ${200 - ry * 1.02} ${200 - rx * .05} ${200 - ry * 1.08} C${200 + rx * .2} ${200 - ry * 1.12} ${200 + rx * .4} ${200 - ry * 1.0} ${200 + rx * .45} ${200 - ry * .9}"
  fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`;

/** Lippen + Tape darüber; tapeY = Versatz des Tapes, tapeRot, tapeO */
const lipsWithTape = (tapeY, tapeRot, tapeO, tapeS = 1) => `${ART.lips(.55)}
  <g opacity="${tapeO}" transform="translate(200 ${206 + tapeY}) rotate(${tapeRot}) scale(${tapeS}) translate(-200 -200)">${ART.tape(true)}</g>`;

/** Gewebe-Muster (Baumwolle) */
function weave(w, h, step = 18) {
  let s = '';
  for (let y = 0; y < h; y += step) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${C.schwarz}" stroke-opacity=".11" stroke-width="3" stroke-dasharray="12 6" stroke-dashoffset="${(y / step) % 2 ? 9 : 0}"/>`;
  for (let x = 0; x < w; x += step) s += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${C.schwarz}" stroke-opacity=".07" stroke-width="3" stroke-dasharray="12 6" stroke-dashoffset="${(x / step) % 2 ? 0 : 9}"/>`;
  return s;
}

// ---------- s1: Hook ----------
SCENES.s1 = { bg: C.rosa, build(root) {
  const qm = svg(qMark(C.weiss), {}, root, '0 0 400 400', 520, 520);
  const hook = bigText(root, 'Wofür ist das *Loch* in der Mitte?', { y: 230, size: 128, step: .03, t0: -1 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 820, 820);
  const ring = svg(handCircle(26, 24, C.beere, 7), {}, root, '0 0 400 400', 820, 820);
  const n = note(root, 'das hier?', { x: 640, y: 1205, r: -6, size: 84, t0: 1.1 });
  const arr = svg('', {}, root, '0 0 1080 1920', 1080, 1920);
  place(arr, 540, 960);
  return (t) => {
    hook.update(t);
    place(qm, 800, 720, 1, tw(t, 0, 3, -4, 6, ease.inOutSine), 1);
    const y = 1090 + noise(t, 2) * 5, r = tw(t, 0, 3, -6, -3, ease.inOutSine);
    place(tape, 500, y, 1, r);
    place(ring, 500, y, 1, r);
    ring.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, .5, 1.2));
    n.update(t);
    const a = pr(t, 1.4, 2.0);
    arr.querySelector('svg').innerHTML = `<path d="M690 1215 C640 1200 590 1170 560 1135" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - a}"/>
      <path d="M548 1172 L558 1132 L596 1146" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="${a > .95 ? 1 : 0}"/>`;
  };
}};

// ---------- s2: abends über die Lippen ----------
SCENES.s2 = { bg: C.nacht, build(root) {
  const moon = svg(ART.moon() + ART.star(60, 90, 1.4) + ART.star(110, 300, .9), {}, root, '0 0 400 400', 250, 250);
  const t2 = bigText(root, 'Abends über die *Lippen*', { y: 230, size: 124, color: C.weiss, accent: C.rosa });
  const lips = svg('', {}, root, '0 0 400 400', 700, 700);
  return (t, p) => {
    t2.update(t);
    place(moon, 930, 610, 1, tw(t, 0, 5, -6, 4, ease.lin));
    const k = pr(t, .9, 2.2, ease.outCubic);
    lips.querySelector('svg').innerHTML = ART.face(.55, 0, 0) + `<g opacity="${clamp(k * 3)}" transform="translate(${200 + lerp(160, 0, k)} ${238 + lerp(-300, 0, k)}) rotate(${lerp(-18, 0, k)}) scale(${lerp(.75, .62, k)}) translate(-200 -200)">${ART.tape(true)}</g>`;
    place(lips, 520, 985, 1);
  };
}};

// ---------- s3: Pflege in der Mitte, vier Inhaltsstoffe ----------
SCENES.s3 = { bg: C.weiss, build(root) {
  const t3 = bigText(root, 'Die Pflege sitzt *mittig*', { y: 230, size: 124 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 980, 980);
  const lines = svg('', {}, root, '0 0 1080 1920', 1080, 1920);
  place(lines, 540, 960);
  const cx = 540, cy = 880;
  const items = [
    { text: 'Kollagen', x: 250, y: 600, ax: 430, ay: 840 },
    { text: 'Hyaluronsäure', x: 760, y: 640, ax: 620, ay: 845 },
    { text: 'Vitamin E', x: 260, y: 1170, ax: 450, ay: 925 },
    { text: 'Glycerin', x: 790, y: 1130, ax: 640, ay: 920 },
  ];
  const labels = items.map(it => el('div', { left: 0, top: 0, fontFamily: F.sans, fontWeight: 700, fontSize: '58px', color: C.schwarz, background: C.rosaHell, padding: '14px 30px 18px', borderRadius: '40px', whiteSpace: 'nowrap' }, root, it.text));
  return (t) => {
    t3.update(t);
    place(tape, cx, cy, tw(t, 0, .6, .92, 1, ease.outBack), -3);
    let l = '';
    items.forEach((it, i) => {
      const t0 = .7 + i * .45;
      const k = pr(t, t0, t0 + .6, ease.outBack);
      const x = lerp(cx, it.x, k), y = lerp(cy, it.y, k);
      const d = labels[i];
      d.style.left = (x - d.offsetWidth / 2) + 'px'; d.style.top = (y - d.offsetHeight / 2) + 'px';
      d.style.opacity = clamp((t - t0) / .15);
      d.style.transform = `scale(${lerp(.3, 1, clamp(k))}) rotate(${(i % 2 ? 2 : -2)}deg)`;
      const lk = pr(t, t0 + .35, t0 + .8);
      if (lk > 0) {
        const sx = it.x, sy = it.y + (it.y < cy ? 40 : -40);
        l += `<path d="M${sx} ${sy} L${lerp(sx, it.ax, lk)} ${lerp(sy, it.ay, lk)}" stroke="${C.schwarz}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/>`;
        if (lk > .98) l += `<circle cx="${it.ax}" cy="${it.ay}" r="9" fill="${C.schwarz}"/>`;
      }
    });
    lines.querySelector('svg').innerHTML = l;
  };
}};

// ---------- s4: kleines Sicherheitsloch, Luft kann durch ----------
SCENES.s4 = { bg: C.rosaHell, build(root) {
  const t4 = bigText(root, 'Kleines *Sicherheitsloch:* Luft kann durch', { y: 230, size: 108 });
  // Nahansicht: Ausschnitt der Pflege-Mitte mit Loch
  const pad = svg('', {}, root, '0 0 1080 900', 1080, 900);
  const n = note(root, 'kleines Loch', { x: 150, y: 1180, r: -5, size: 80, t0: 2.0 });
  return (t) => {
    t4.update(t);
    const z = tw(t, 0, 1.2, .7, 1, ease.outCubic);
    const flow = (t * .9) % 1;
    const ak = pr(t, .9, 1.8);
    pad.querySelector('svg').innerHTML = `
      <g transform="translate(540 450) scale(${z}) translate(-540 -450)">
        <rect x="90" y="190" width="900" height="520" rx="260" fill="#FFF7F4"/>
        <rect x="210" y="280" width="660" height="340" rx="170" fill="${C.rosaTief}"/>
        <rect x="260" y="315" width="230" height="40" rx="20" fill="#fff" opacity=".35"/>
        <ellipse cx="540" cy="450" rx="86" ry="66" fill="${C.schwarz}"/>
        <ellipse cx="540" cy="450" rx="86" ry="66" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>
      </g>
      <g opacity="${ak}">
        <path d="M80 300 C260 300 380 450 540 450 C700 450 820 600 1000 600" fill="none" stroke="${C.schwarz}" stroke-width="10" stroke-linecap="round"
          stroke-dasharray="26 26" stroke-dashoffset="${-flow * 52}" pathLength="${1040 * ak}"/>
        <path d="M968 566 L1004 602 L958 616" fill="none" stroke="${C.schwarz}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="${ak > .95 ? 1 : 0}"/>
      </g>`;
    place(pad, 540, 860, 1);
    n.update(t);
  };
}};

// ---------- s5: mit Absicht (Stempel) ----------
SCENES.s5 = { bg: C.rosa, build(root) {
  const t5 = bigText(root, 'Mit *Absicht.*', { y: 260, size: 170 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 860, 860);
  const stamp = svg(`<circle cx="200" cy="200" r="160" fill="none" stroke="${C.beere}" stroke-width="16"/>
    <circle cx="200" cy="200" r="132" fill="none" stroke="${C.beere}" stroke-width="5"/>
    <g transform="translate(200 200) scale(.62) translate(-200 -205)">${ART.check(C.beere)}</g>`, {}, root, '0 0 400 400', 320, 320);
  return (t) => {
    t5.update(t);
    const hit = pr(t, .35, .6, ease.inCubic);
    const shake = t > .6 && t < .9 ? Math.sin((t - .6) * 60) * (1 - (t - .6) / .3) * 6 : 0;
    place(tape, 470, 980 + shake, 1, -4);
    place(stamp, 820, 1150, lerp(2.2, 1, hit), lerp(-30, -12, hit), clamp(hit * 2) * .95);
  };
}};

// ---------- s6: medizinische Baumwolle + Kleber ----------
SCENES.s6 = { bg: C.weiss, build(root) {
  const t6 = bigText(root, 'Medizinische *Baumwolle*', { y: 230, size: 118 });
  const sw = svg('', {}, root, '0 0 700 700', 700, 700);
  const n1 = note(root, 'Baumwolle', { x: 110, y: 560, r: -6, size: 78, t0: .8, arrow: [90, 110], ax: 60, ay: 80 });
  const n2 = note(root, 'Kleber: hypoallergen,\natmungsaktiv', { x: 300, y: 1135, r: -3, size: 72, t0: 2.6 });
  const W = 600, weaveSvg = weave(W, W);
  return (t) => {
    t6.update(t);
    const f = tw(t, 1.6, 2.8, 0, 230, ease.inOutCubic) + noise(t, 4) * 3 * pr(t, 2.8, 3);
    const o = 50;
    const dots = [];
    for (let y = 0; y < 260; y += 22) for (let x = 0; x < 260; x += 22) dots.push(`<circle cx="${o + W - x - ((y / 22) % 2) * 11}" cy="${o + W - y}" r="3.2" fill="${C.schwarz}" opacity=".18"/>`);
    sw.querySelector('svg').innerHTML = `
      <defs><clipPath id="sw6"><path d="M${o} ${o} L${o + W} ${o} L${o + W} ${o + W - f} L${o + W - f} ${o + W} L${o} ${o + W}Z"/></clipPath>
      <clipPath id="fl6"><path d="M${o + W} ${o + W - f} L${o + W - f} ${o + W - f} L${o + W - f} ${o + W}Z"/></clipPath></defs>
      <path d="M${o + 14} ${o + 18} L${o + W + 14} ${o + 18} L${o + W + 14} ${o + W - f + 18} L${o + W - f + 14} ${o + W + 18} L${o + 14} ${o + W + 18}Z" fill="${C.schwarz}" opacity=".08"/>
      <path d="M${o} ${o} L${o + W} ${o} L${o + W} ${o + W - f} L${o + W - f} ${o + W} L${o} ${o + W}Z" fill="#FFF7F4" stroke="${C.schwarz}" stroke-opacity=".15" stroke-width="3"/>
      <g clip-path="url(#sw6)" transform="translate(${o} ${o})">${weaveSvg}</g>
      ${f > 2 ? `<path d="M${o + W} ${o + W - f} L${o + W - f} ${o + W - f} L${o + W - f} ${o + W}Z" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-opacity=".2" stroke-width="3"/>
      <g clip-path="url(#fl6)" transform="translate(${-f} ${-f})">${dots.join('')}</g>` : ''}`;
    place(sw, 500, 780, tw(t, 0, .6, .9, 1, ease.outBack), -4);
    n1.update(t); n2.update(t);
  };
}};

// ---------- s7: morgens abziehen + Kommentare ----------
SCENES.s7 = { bg: C.rosaHell, build(root) {
  const sun = svg(`<circle cx="200" cy="200" r="90" fill="#F7E7C6"/>${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return `<line x1="${200 + Math.cos(a) * 120}" y1="${200 + Math.sin(a) * 120}" x2="${200 + Math.cos(a) * 160}" y2="${200 + Math.sin(a) * 160}" stroke="#F7E7C6" stroke-width="16" stroke-linecap="round"/>`; }).join('')}`, {}, root, '0 0 400 400', 300, 300);
  const t7a = bigText(root, 'Morgens *langsam* abziehen', { y: 230, size: 116 });
  const t7b = bigText(root, 'Fragen? Ab in die *Kommentare*', { y: 230, size: 116, t0: 3.0 });
  const lips = svg('', {}, root, '0 0 400 400', 700, 700);
  const bubble = svg('', {}, root, '0 0 700 420', 700, 420);
  return (t) => {
    const sw = 2.8; // Wechsel zu „Fragen?“
    const a = 1 - pr(t, sw - .3, sw);
    t7a.update(t); t7a.node.style.opacity = a;
    t7b.update(t); t7b.node.style.opacity = t > sw ? 1 : 0;
    place(sun, 900, 640, 1, t * 8, .9);
    const k = pr(t, .5, 2.4, ease.inOutSine);
    lips.querySelector('svg').innerHTML = `${ART.lips(.55)}
      <g opacity="${1 - pr(t, 2.0, 2.6)}" transform="translate(${200 + k * 150} ${206 - k * 190}) rotate(${k * 28}) translate(-200 -200)">${ART.tape(true)}</g>`;
    const lk = pr(t, sw - .2, sw + .4);
    place(lips, 540, lerp(900, 640, lk), lerp(1, .7, lk), 0, lerp(1, .9, lk));
    const bk = pr(t, sw + .2, sw + .8, ease.outBack);
    const dot = i => { const ph = (t * 2.2 - i * .25) % 1; return 1 + .35 * Math.max(0, Math.sin(ph * Math.PI)); };
    bubble.querySelector('svg').innerHTML = `
      <path d="M60 40 H640 A40 40 0 0 1 680 80 V300 A40 40 0 0 1 640 340 H220 L130 410 L150 340 H60 A40 40 0 0 1 20 300 V80 A40 40 0 0 1 60 40Z" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="8" stroke-linejoin="round"/>
      ${[0, 1, 2].map(i => `<circle cx="${230 + i * 120}" cy="190" r="${26 * dot(i)}" fill="${i === 1 ? C.beere : C.schwarz}"/>`).join('')}`;
    place(bubble, 540, 1110, lerp(.4, 1, bk), lerp(-8, -2, bk), clamp(bk * 3));
  };
}};
