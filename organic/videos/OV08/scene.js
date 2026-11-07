/* OV08 – Das Erste am Morgen  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const S = C.schwarz, MOND = '#F7E7C6', SONNE = '#FFD98A', GLAS = '#EEF3F4', NEBEL = '#FAF7F8';

// ---------- eigene Illustrationen ----------
/** Fenster mit aufgehender Sonne. viewBox 0 0 600 700. k = 0..1 Sonnenstand */
function windowSun(k) {
  const sy = lerp(640, 330, k);
  const rays = Array.from({ length: 12 }, (_, i) => `<line x1="300" y1="${sy - 118}" x2="300" y2="${sy - 150}" transform="rotate(${i * 30 + k * 20} 300 ${sy})" stroke="${SONNE}" stroke-width="12" stroke-linecap="round"/>`).join('');
  return `<defs><clipPath id="ov8win"><rect x="70" y="70" width="460" height="530" rx="8"/></clipPath></defs>
    <rect x="40" y="40" width="520" height="590" rx="18" fill="${S}"/>
    <g clip-path="url(#ov8win)">
      <rect x="70" y="70" width="460" height="530" fill="${C.rosaHell}"/>
      <path d="M70 520 C160 480 230 500 300 486 C380 470 450 490 530 470 L530 600 L70 600Z" fill="${C.rosa}"/>
      <g opacity="${k}">${rays}</g>
      <circle cx="300" cy="${sy}" r="96" fill="${SONNE}"/>
      <path d="M70 560 C170 530 250 556 330 540 C420 524 470 546 530 532 L530 600 L70 600Z" fill="${C.rosaTief}"/>
      <path d="M110 170 C140 150 180 150 200 168 C220 150 260 154 270 176" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".9"/>
    </g>
    <rect x="290" y="70" width="20" height="530" fill="${S}"/>
    <rect x="70" y="326" width="460" height="20" fill="${S}"/>
    <path d="M30 30 C60 200 40 420 90 640 L30 640Z" fill="#fff" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M570 30 C540 200 560 420 510 640 L570 640Z" fill="#fff" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="10" y="12" width="580" height="26" rx="13" fill="${S}"/>
    <rect x="0" y="628" width="600" height="34" rx="12" fill="${S}"/>`;
}
/** Wecker. viewBox 0 0 400 400. ring = 0..1 Klingel-Stärke */
function alarm(ring, t) {
  const hb = Math.sin(t * 60) * 14 * ring;
  const lines = ring > .05 ? [[-1], [1]].map(([s]) => `<g stroke="${S}" stroke-width="10" stroke-linecap="round" opacity="${ring}">
      <path d="M${200 + s * 150} 70 L${200 + s * 185} 40"/><path d="M${200 + s * 172} 120 L${200 + s * 215} 110"/><path d="M${200 + s * 165} 175 L${200 + s * 205} 190"/></g>`).join('') : '';
  return `${lines}
    <g transform="rotate(${hb * .4} 200 60)"><rect x="185" y="40" width="30" height="30" rx="6" fill="${S}"/></g>
    <path d="M80 140 A62 62 0 0 1 170 70 Z" fill="${S}"/><path d="M320 140 A62 62 0 0 0 230 70 Z" fill="${S}"/>
    <path d="M120 320 L90 370 M280 320 L310 370" stroke="${S}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="200" cy="225" r="135" fill="${S}"/>
    <circle cx="200" cy="225" r="112" fill="#fff"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="200" y1="${i % 3 ? 126 : 122}" x2="200" y2="${i % 3 ? 138 : 146}" transform="rotate(${i * 30} 200 225)" stroke="${S}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>`).join('')}
    <path d="M200 225 L200 160" stroke="${S}" stroke-width="12" stroke-linecap="round" transform="rotate(${-60} 200 225)"/>
    <path d="M200 225 L200 140" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="200" cy="225" r="12" fill="${C.beere}"/>`;
}
/** Fingerspitze, waagrecht, Spitze links. viewBox 0 0 400 160 */
const finger = `<path d="M60 40 C20 40 10 80 20 104 C30 126 50 130 70 130 L400 130 L400 40Z" fill="${C.haut}"/>
  <path d="M36 62 C34 52 42 46 56 46 L92 46 C102 46 106 56 104 70 C102 84 96 90 86 90 L52 90 C40 90 36 76 36 62Z" fill="#FBE3DA" stroke="${C.hautDunkel}" stroke-width="3"/>
  <path d="M150 60 C160 80 160 100 150 120 M190 70 C196 84 196 100 190 112" stroke="${C.hautDunkel}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
/** Badspiegel (Bogen) mit Rahmen. viewBox 0 0 600 760 */
const mirrorFrame = `<path d="M70 640 L70 260 C70 120 175 30 300 30 C425 30 530 120 530 260 L530 640Z" fill="${S}"/>
  <rect x="30" y="660" width="540" height="26" rx="13" fill="${S}"/>
  <rect x="90" y="686" width="20" height="40" fill="${S}"/><rect x="490" y="686" width="20" height="40" fill="${S}"/>`;
const mirrorGlass = `<path d="M96 620 L96 262 C96 140 186 56 300 56 C414 56 504 140 504 262 L504 620Z" fill="${GLAS}"/>
  <path d="M150 250 L240 150 M150 330 L290 170" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`;
/** Kaffeemaschine + Tasse. viewBox 0 0 460 600. on = Taste an, flow = 0..1 Strahl, fill = 0..1 Tasse */
function coffee(on, flow, fillK) {
  const cupTop = 452, level = lerp(540, 470, fillK);
  return `<rect x="40" y="30" width="380" height="120" rx="30" fill="${S}"/>
    <rect x="60" y="130" width="90" height="420" fill="${S}"/>
    <rect x="40" y="530" width="380" height="44" rx="14" fill="${S}"/>
    <rect x="150" y="555" width="250" height="12" rx="6" fill="#3a2e33"/>
    <rect x="300" y="64" width="90" height="52" rx="12" fill="#fff"/>
    <circle cx="96" cy="90" r="22" fill="${on ? C.beere : '#5B4A52'}"/>
    <circle cx="96" cy="90" r="${on ? 34 : 0}" fill="none" stroke="${C.beere}" stroke-width="4" opacity="${on ? .5 : 0}"/>
    <rect x="200" y="150" width="70" height="40" rx="8" fill="${S}"/>
    <rect x="${235 - 5}" y="190" width="10" height="${(cupTop - 190) * flow}" rx="5" fill="#6B4433" opacity="${flow > 0 && fillK < 1 ? 1 : 0}"/>
    <defs><clipPath id="ov8cup"><path d="M160 452 L310 452 L298 540 C296 552 288 556 276 556 L194 556 C182 556 174 552 172 540Z"/></clipPath></defs>
    <path d="M308 476 C350 476 350 528 300 528" fill="none" stroke="${S}" stroke-width="12"/>
    <path d="M160 452 L310 452 L298 540 C296 552 288 556 276 556 L194 556 C182 556 174 552 172 540Z" fill="#fff" stroke="${S}" stroke-width="8" stroke-linejoin="round"/>
    <g clip-path="url(#ov8cup)"><rect x="150" y="${level}" width="180" height="120" fill="#6B4433"/></g>
    <rect x="186" y="490" width="96" height="10" rx="5" fill="${C.rosaTief}"/>`;
}
/** Dampf in Herzform. viewBox 0 0 300 360, k = 0..1 */
function steamHeart(k, t) {
  const w1 = Math.sin(t * 3) * 6;
  return `<path d="M150 330 C130 300 170 280 150 250" fill="none" stroke="${C.rosaTief}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(k * 2)}"/>
    <path transform="translate(${w1} 0)" d="M150 230 C60 170 40 120 70 80 C100 44 140 60 150 96 C160 60 200 44 230 80 C260 120 240 170 150 230Z" fill="none" stroke="${C.rosaTief}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - clamp(k * 2 - .8)}"/>`;
}
/** Kleines Tablett, viewBox 0 0 400 200 */
const tray = `<ellipse cx="200" cy="120" rx="190" ry="64" fill="${S}"/><ellipse cx="200" cy="110" rx="176" ry="54" fill="${C.rosaHell}"/>`;
/** Pill-Label */
function pill(root, text, dark) {
  return el('div', { left: 0, top: 0, padding: '14px 30px', borderRadius: '40px', background: dark ? C.rosa : C.weiss, color: S, fontFamily: F.sans, fontWeight: 700, fontSize: '46px', whiteSpace: 'nowrap', letterSpacing: '-.5px' }, root, text);
}

// ---------- s1: Hook – Morgen ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Das Erste, was ich *morgens* mache', { y: 200, size: 118 });
  hook.update(99);
  const win = svg('', {}, root, '0 0 600 700', 560, 653);
  const clk = svg('', {}, root, '0 0 400 400', 330, 330);
  const n = note(root, 'noch vor dem Kaffee.', { x: 90, y: 1268, r: -3, t0: D * .55, size: 72 });
  return (t) => {
    win.querySelector('svg').innerHTML = windowSun(pr(t, 0, D * .9, ease.inOutSine) * .9 + .1);
    place(win, 470, 930);
    const ring = 1 - pr(t, .8, 1.8, ease.lin);
    clk.querySelector('svg').innerHTML = alarm(ring, t);
    place(clk, 830, 1150 - Math.abs(Math.sin(t * 30)) * 10 * ring, 1, Math.sin(t * 45) * 7 * ring);
    n.update(t);
  };
}};

// ---------- s2: Tape langsam abziehen ----------
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '*Langsam* abziehen.', { y: 220, size: 132, t0: 0, step: .08 });
  const lips = svg(ART.lips(.6), {}, root, '0 0 400 400', 920, 920);
  const tape = svg(ART.tape(true), { transformOrigin: '12% 50%' }, root, '0 0 400 400', 580, 580);
  const fing = svg(finger, {}, root, '0 0 400 160', 380, 152);
  const n = note(root, 'ganz in Ruhe.', { x: 560, y: 1170, r: -5, t0: D * .55, size: 82, color: C.beere });
  return (t) => {
    head.update(t);
    place(lips, 540, 860, 1, 0);
    const k = pr(t, .5, D * .82, ease.inOutSine);
    // Tape dreht sich um sein linkes Ende nach oben und hebt sich
    const ang = -k * 24, lift = k * 70;
    tape.style.left = '0px'; tape.style.top = '0px';
    tape.style.transform = `translate(${540 - 290 + k * 30}px, ${880 - 290 - lift}px) rotate(${ang}deg)`;
    tape.style.opacity = 1;
    // Finger hält das rechte Ende: Ende liegt bei 12%-Pivot + Länge
    const px = 540 - 290 + .12 * 580 + k * 30, py = 880 - lift;
    const L = (340 - 24) * 580 / 400 * .88; // Abstand Pivot -> rechtes Ende
    const a = ang * Math.PI / 180;
    const ex = px + Math.cos(a) * L, ey = py + Math.sin(a) * L;
    place(fing, ex + 150, ey + 20, 1, ang * .6, pr(t, .1, .4));
    n.update(t);
  };
}};

// ---------- s3: Badspiegel, "weich" auf beschlagener Fläche ----------
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Und dieses Gefühl:', { y: 210, size: 116, t0: 0, step: .07 });
  const mir = svg('', {}, root, '0 0 600 760', 620, 785);
  const fing = svg(finger, {}, root, '0 0 400 160', 300, 120);
  return (t) => {
    head.update(t);
    const w0 = D * .42, w1 = D * .82;
    const wk = pr(t, w0, w1, ease.inOutSine);
    const fogK = pr(t, 0, .8);
    // Tropfen laufen nach dem Schreiben
    const dk = pr(t, w1, w1 + 1.4, ease.inCubic);
    const drips = [[230, 452], [372, 470]].map(([x, y], i) => { const d = clamp(dk * 1.3 - i * .3); return `<path d="M${x} ${y} L${x} ${y + d * 90}" stroke="${GLAS}" stroke-width="10" stroke-linecap="round" opacity="${d > 0 ? 1 : 0}"/><circle cx="${x}" cy="${y + d * 90}" r="${d > 0 ? 8 : 0}" fill="${GLAS}"/>`; }).join('');
    mir.querySelector('svg').innerHTML = mirrorFrame + mirrorGlass + `
      <defs><clipPath id="ov8gl"><path d="M96 620 L96 262 C96 140 186 56 300 56 C414 56 504 140 504 262 L504 620Z"/></clipPath>
      <clipPath id="ov8wr"><rect x="100" y="250" width="${400 * wk}" height="300"/></clipPath></defs>
      <g clip-path="url(#ov8gl)" opacity="${fogK}">
        <rect x="90" y="50" width="420" height="580" fill="${NEBEL}" opacity=".9"/>
        ${[[160, 180, 60], [330, 130, 80], [430, 300, 70], [200, 520, 90], [420, 560, 60], [300, 400, 110]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".55"/>`).join('')}
        ${drips}
      </g>
      <g clip-path="url(#ov8wr)"><text x="300" y="450" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="178" fill="${C.beere}">weich.</text></g>`;
    place(mir, 540, 900);
    // Finger folgt der Schreibkante
    const fx = 540 - 310 + (100 + 400 * wk) * 620 / 600, fy = 900 - 392 + (400 + Math.sin(wk * 30) * 30) * 785 / 760;
    const fo = pr(t, w0 - .3, w0) * (1 - pr(t, w1, w1 + .4));
    place(fing, fx + 140, fy, 1, -18, fo);
  };
}};

// ---------- s4: Rückblick Nacht – Pflege ----------
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const n0 = note(root, 'gestern Abend …', { x: 96, y: 190, r: -3, t0: 0, size: 70, color: C.rosa });
  const head = bigText(root, 'Die ganze Nacht *Pflege.*', { y: 290, size: 116, color: C.weiss, accent: C.rosa, t0: .15, step: .07 });
  const stars = svg('', {}, root, '0 0 1080 900', 1080, 900);
  const mn = svg(ART.moon(MOND), {}, root, '0 0 400 400', 230, 230);
  const cam = el('div', { left: '310px', top: '590px', width: '460px', height: '460px', borderRadius: '50%', background: C.rosaHell, overflow: 'hidden', border: `8px solid ${C.rosa}`, boxSizing: 'border-box' }, root);
  const face = svg(ART.face(.55, 1, .1), { left: '-20px', top: '-10px' }, cam, '0 0 400 400', 484, 484);
  const lines = svg('', {}, root, '0 0 1080 400', 1080, 400);
  const names = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'];
  const pills = names.map((n, i) => pill(root, n, i === 1));
  const pos = [[290, 1150], [540, 1260], [800, 1150]];
  return (t) => {
    n0.update(t); head.update(t);
    stars.querySelector('svg').innerHTML = [[120, 620, 1.3], [210, 820, .8], [930, 600, 1.1], [990, 860, .8], [70, 760, .7], [860, 760, .6]]
      .map(([x, y, s], i) => ART.star(x, y, s * 1.6 * (.75 + .25 * Math.sin(t * 3 + i * 1.7)), MOND)).join('');
    place(stars, 540, 450);
    place(mn, 860, 640, 1, -8 + Math.sin(t) * 2);
    cam.style.transform = `translateY(${noise(t, 4) * 3}px)`;
    const ts = [D * .38, D * .56, D * .76];
    let ln = '';
    pills.forEach((p, i) => {
      const k = pr(t, ts[i], ts[i] + .45, ease.outBack);
      place(p, pos[i][0], pos[i][1], k + .001, (i - 1) * -3, clamp((t - ts[i]) / .12));
      const lk = pr(t, ts[i] - .2, ts[i] + .1);
      ln += `<path d="M540 ${910 - 820} L${pos[i][0]} ${pos[i][1] - 850}" stroke="${C.rosa}" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" opacity="${lk}"/>`;
    });
    lines.querySelector('svg').innerHTML = ln;
    place(lines, 540, 1020);
  };
}};

// ---------- s5: Ich bin 49 – das Fragezeichen verblasst ----------
SCENES.s5 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Ich bin *49.*', { y: 210, size: 150, t0: 0, step: .1 });
  const q = el('div', { left: '0px', top: '0px', width: '600px', height: '760px', textAlign: 'center', fontFamily: F.display, fontSize: '720px', lineHeight: '760px', color: S }, root, '?');
  const thought = bigText(root, 'Lohnt sich nichts mehr?', { y: 1160, size: 84, align: 'center', t0: D * .38, step: .07 });
  return (t) => {
    head.update(t); thought.update(t);
    const fade = pr(t, D * .35, D * .98, ease.inOutSine);
    const pop = pr(t, .2, .8, ease.outBack);
    place(q, 540, 780, .6 + .4 * pop - fade * .08, -6 + noise(t, 2) * 3, clamp((t - .2) / .2) * lerp(1, .14, fade));
  };
}};

// ---------- s6: Ritual – dann erst Kaffee ----------
SCENES.s6 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const l1 = bigText(root, 'Erst *das.*', { y: 210, size: 128, t0: 0, step: .08 });
  const l2 = bigText(root, 'Dann Kaffee.', { y: 345, size: 128, t0: D * .66, step: .08 });
  const tr = svg(tray, {}, root, '0 0 400 200', 360, 180);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const cm = svg('', {}, root, '0 0 460 600', 500, 652);
  const st = svg('', {}, root, '0 0 300 360', 220, 264);
  const n = note(root, 'jeden Morgen.', { x: 90, y: 760, r: -6, t0: D * .38, size: 80, color: C.beere, arrow: [70, 150], ax: 120, ay: 90 });
  return (t) => {
    l1.update(t); l2.update(t);
    place(tr, 250, 1200);
    place(tp, 250, 1150 - Math.sin(t * 2) * 6, 1, -8 + Math.sin(t * 1.4) * 2);
    const on = t > D * .64 ? 1 : 0;
    const flow = pr(t, D * .66, D * .72, ease.lin);
    const fk = pr(t, D * .7, D * .9, ease.inOutSine);
    cm.querySelector('svg').innerHTML = coffee(on, flow, fk);
    place(cm, 720, 1000);
    const sk = pr(t, D * .84, D + .4, ease.lin);
    st.querySelector('svg').innerHTML = steamHeart(sk, t);
    place(st, 720 - 230 * 500 / 460 + 235 * 500 / 460, 1000 - 326 + 452 * 652 / 600 - 150 - sk * 30, 1, 0, sk > 0 ? 1 - pr(t, D + .2, D + .6) : 0);
    n.update(t);
  };
}};
