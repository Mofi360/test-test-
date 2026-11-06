/* OV05 – Drei Winter-Fehler  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const MOND = '#F7E7C6';

// ---------- eigene Illustrationen ----------
/** Schneeflocke, viewBox 0 0 200 200 */
function flake(c = C.weiss, sw = 9) {
  const arm = `<line x1="100" y1="100" x2="100" y2="14"/><path d="M100 44 L78 26 M100 44 L122 26 M100 70 L84 56 M100 70 L116 56"/>`;
  return `<g stroke="${c}" stroke-width="${sw}" stroke-linecap="round" fill="none">${[0, 60, 120, 180, 240, 300].map(a => `<g transform="rotate(${a} 100 100)">${arm}</g>`).join('')}</g><circle cx="100" cy="100" r="${sw * 1.1}" fill="${c}"/>`;
}
/** Zahlen-Karte (HTML) */
function numCard(root, n, bg) {
  const c = el('div', { left: 0, top: 0, width: '250px', height: '330px', background: bg, borderRadius: '22px', border: `6px solid ${C.schwarz}`, boxSizing: 'border-box', boxShadow: '0 24px 40px -18px rgba(21,16,18,.45)' }, root);
  el('div', { left: 0, top: '30px', width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: '230px', lineHeight: 1, color: C.schwarz }, c, n);
  return c;
}
/** Heizkörper mit Thermostat, viewBox 0 0 640 380. knob = Drehwinkel */
function heater(knob = 0) {
  const S = C.schwarz;
  const fins = Array.from({ length: 9 }, (_, i) => `<rect x="${62 + i * 50}" y="70" width="38" height="250" rx="16" fill="${C.weiss}" stroke="${S}" stroke-width="6"/>`).join('');
  return `<rect x="40" y="58" width="480" height="20" rx="10" fill="${S}"/><rect x="40" y="312" width="480" height="20" rx="10" fill="${S}"/>
    ${fins}
    <rect x="70" y="330" width="22" height="46" fill="${S}"/><rect x="468" y="330" width="22" height="46" fill="${S}"/>
    <rect x="512" y="180" width="40" height="22" fill="${S}"/>
    <circle cx="582" cy="191" r="46" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    ${[0, 1, 2, 3, 4].map(i => { const a = (-130 + i * 65) * Math.PI / 180; return `<circle cx="${582 + Math.sin(a) * 60}" cy="${191 - Math.cos(a) * 60}" r="${i === 4 ? 7 : 4.5}" fill="${i === 4 ? C.beere : S}"/>`; }).join('')}
    <g transform="rotate(${knob} 582 191)"><rect x="576" y="152" width="12" height="40" rx="6" fill="${S}"/></g>`;
}
/** Wärmewellen, viewBox 0 0 600 420 */
function waves(t, k) {
  return [120, 240, 360, 480].map((x0, i) => {
    let d = '';
    for (let y = 410; y >= 40; y -= 10) { const amp = 10 + (410 - y) * .05; const x = x0 + Math.sin(y / 34 - t * 5 + i * 1.3) * amp; d += (y === 410 ? 'M' : 'L') + x.toFixed(1) + ' ' + y; }
    return `<path d="${d}" fill="none" stroke="${C.rosaTief}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - k}" opacity=".9"/>`;
  }).join('');
}
/** Tropfen, viewBox 0 0 200 200 */
const drop = (c = C.weiss) => `<path d="M100 18 C128 62 160 92 160 128 A60 60 0 0 1 40 128 C40 92 72 62 100 18Z" fill="${c}" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M72 124 A30 30 0 0 0 92 160" stroke="${C.weiss}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`;
/** Stopp-Schild, viewBox 0 0 300 520 (Mast unten bei y 520) */
function stopSign() {
  const pts = Array.from({ length: 8 }, (_, i) => { const a = (22.5 + i * 45) * Math.PI / 180; return `${150 + Math.cos(a) * 130},${150 + Math.sin(a) * 130}`; }).join(' ');
  const pts2 = Array.from({ length: 8 }, (_, i) => { const a = (22.5 + i * 45) * Math.PI / 180; return `${150 + Math.cos(a) * 112},${150 + Math.sin(a) * 112}`; }).join(' ');
  return `<rect x="138" y="250" width="24" height="270" rx="8" fill="${C.schwarz}"/>
    <polygon points="${pts}" fill="${C.beere}" stroke="${C.schwarz}" stroke-width="8" stroke-linejoin="round"/>
    <polygon points="${pts2}" fill="none" stroke="${C.weiss}" stroke-width="6" stroke-linejoin="round"/>
    <text x="150" y="172" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="56" fill="${C.weiss}" letter-spacing="1">STOPP</text>`;
}
/** Lippenpflegestift, viewBox 0 0 80 170 */
const balm = `<rect x="18" y="62" width="44" height="100" rx="10" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="5"/>
  <rect x="18" y="98" width="44" height="14" fill="${C.weiss}" opacity=".7"/>
  <rect x="14" y="8" width="52" height="60" rx="14" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="5"/>`;
const sun = (c = C.rosaTief) => `<circle cx="100" cy="100" r="42" fill="${c}"/>${Array.from({ length: 8 }, (_, i) => `<line x1="100" y1="34" x2="100" y2="14" transform="rotate(${i * 45} 100 100)" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`).join('')}`;
const moonSmall = (c = MOND, bg = C.nacht) => `<circle cx="100" cy="100" r="54" fill="${c}"/><circle cx="128" cy="80" r="48" fill="${bg}"/>`;
/** Hautschnitt in der Lupe, viewBox 0 0 400 400 */
function skinCut(glands, k = 1) {
  const S = C.schwarz;
  const g = [[110, 250], [290, 270], [200, 330]];
  return `<rect width="400" height="400" fill="${C.haut}"/>
    <path d="M0 120 C60 104 120 136 200 120 C280 104 340 136 400 120 L400 0 L0 0Z" fill="${C.rosaHell}"/>
    <path d="M0 120 C60 104 120 136 200 120 C280 104 340 136 400 120" fill="none" stroke="${C.hautDunkel}" stroke-width="8"/>
    <path d="M0 200 C80 190 140 214 220 200 C300 188 360 210 400 202" fill="none" stroke="${C.hautDunkel}" stroke-width="4" opacity=".5"/>
    ${glands ? g.map(([x, y], i) => { const s = clamp(k * 3 - i); return `<line x1="${x}" y1="${y - 20}" x2="${x - 10}" y2="40" stroke="${S}" stroke-width="6" stroke-linecap="round" opacity="${s}"/>
      <g transform="translate(${x} ${y}) scale(${ease.outBack(s)})"><circle r="30" fill="${C.weiss}" stroke="${S}" stroke-width="6"/><circle r="12" fill="${C.rosaTief}"/></g>`; }).join('') : ''}`;
}
function lipCut() {
  return `<rect width="400" height="400" fill="${C.lippeHell}"/>
    <path d="M0 120 C60 104 120 136 200 120 C280 104 340 136 400 120 L400 0 L0 0Z" fill="${C.rosaHell}"/>
    <path d="M0 120 C60 104 120 136 200 120 C280 104 340 136 400 120" fill="none" stroke="${C.lippe}" stroke-width="8"/>
    <path d="M0 200 C80 190 140 214 220 200 C300 188 360 210 400 202" fill="none" stroke="${C.lippe}" stroke-width="4" opacity=".5"/>
    <path d="M0 290 C80 280 140 304 220 290 C300 278 360 300 400 292" fill="none" stroke="${C.lippe}" stroke-width="4" opacity=".35"/>`;
}
function lens(root, cx, cy, d, inner) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', overflow: 'hidden', border: `8px solid ${C.schwarz}`, boxSizing: 'border-box', background: C.weiss }, root);
  const s = svg(inner, { left: '-8px', top: '-8px' }, c, '0 0 400 400', d, d);
  return { c, s };
}
/** Hautfarbenes Rund mit Lippen */
function cameo(root, cx, cy, d) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden' }, root);
  svg(`<path d="M150 40 C180 60 220 60 250 40" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`, { left: 0, top: 0 }, c, '0 0 400 400', d, d);
  svg(ART.lips(.55), { left: (d * .07) + 'px', top: (d * .03) + 'px' }, c, '0 0 400 400', d * .86, d * .86);
  return c;
}
/** Lesezeichen/Speichern, viewBox 0 0 200 260 */
const bookmark = (fill) => `<path d="M30 20 Q30 10 40 10 L160 10 Q170 10 170 20 L170 245 L100 190 L30 245Z" fill="${fill}" stroke="${C.schwarz}" stroke-width="12" stroke-linejoin="round"/>`;
const label = (root, text, x, y, o = {}) => el('div', { left: (x - 250) + 'px', top: y + 'px', width: '500px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 50) + 'px', color: o.color ?? C.schwarz, letterSpacing: '-.5px' }, root, text);

// ---------- s1: Hook + drei Karten ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const fl = svg(flake(C.weiss, 8), {}, root, '0 0 200 200', 300, 300);
  const fl2 = svg(flake(C.weiss, 10), {}, root, '0 0 200 200', 130, 130);
  const hook = bigText(root, 'Drei *Winter-Fehler,* die ich jahrelang gemacht hab.', { y: 210, size: 112 });
  hook.update(99);
  const cards = [['1', C.weiss], ['2', C.weiss], ['3', C.rosaHell]].map(([n, bg]) => numCard(root, n, bg));
  const n3 = note(root, 'Nr. 3 hat mich überrascht!', { x: 100, y: 1200, r: -3, t0: D * .5, size: 76 });
  return (t) => {
    place(fl, 950, 610, .75, t * 22, .9);
    place(fl2, 90, 720, 1, -t * 30, .8);
    const f = pr(t, .25, 1.1, ease.outBack);
    const xs = [300, 540, 780], rs = [-12, 0, 12], ys = [1000, 965, 1000];
    cards.forEach((c, i) => {
      const lift = i === 2 ? pr(t, D * .45, D * .45 + .5, ease.outBack) : 0;
      const wob = i === 2 ? Math.sin(t * 6) * 2 * lift : 0;
      place(c, lerp(540, xs[i], f), lerp(1000, ys[i], f) - lift * 70, 1 + lift * .08, lerp(0, rs[i], f) + wob);
    });
    n3.update(t);
  };
}};

// ---------- s2: Heizung voll ----------
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '*1.* Heizungsluft', { y: 220, size: 130, t0: 0, step: .07 });
  const wv = svg('', {}, root, '0 0 600 420', 600, 420);
  const ht = svg(heater(-130), {}, root, '0 0 640 380', 640, 380);
  const dr = svg(drop(C.weiss), {}, root, '0 0 200 200', 210, 210);
  const dry = note(root, 'staubtrocken.', { x: 120, y: 420, r: -5, t0: D * .62, size: 92, color: C.beere });
  return (t) => {
    head.update(t);
    const knob = tw(t, .4, 1.3, -130, 130, ease.inOutCubic);
    ht.querySelector('svg').innerHTML = heater(knob);
    place(ht, 520, 1120);
    wv.querySelector('svg').innerHTML = waves(t, pr(t, 1.1, 2.2, ease.lin));
    place(wv, 500, 760);
    const s = 1 - pr(t, D * .45, D * .85, ease.inCubic);
    place(dr, 850, 640 - (1 - s) * 60, Math.max(.001, s), noise(t, 2) * 4, clamp(s * 3));
    dry.update(t);
  };
}};

// ---------- s3: Lippen ablecken – Stopp ----------
SCENES.s3 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '*2.* Lippen ablecken', { y: 220, size: 124, t0: 0, step: .07 });
  const lips = svg('', {}, root, '0 0 400 400', 640, 640);
  const stop = svg(stopSign(), { transformOrigin: '50% 100%' }, root, '0 0 300 520', 300, 520);
  const n = note(root, 'kurz gut …\nnicht besser.', { x: 120, y: 1120, r: -4, t0: D * .58, size: 80 });
  return (t) => {
    head.update(t);
    // Zungenspitze kurz sichtbar, verschwindet beim Stopp
    const tg = pr(t, .3, .7) * (1 - pr(t, D * .3, D * .3 + .25));
    const tongue = `<ellipse cx="200" cy="${208 + tg * 14}" rx="${34 * tg + .01}" ry="${18 * tg + .01}" fill="${C.lippeHell}" stroke="${C.schwarz}" stroke-opacity=".3" stroke-width="3"/>`;
    lips.querySelector('svg').innerHTML = tongue + ART.lips(.6);
    place(lips, 400, 840 + noise(t, 1) * 4, 1, -3);
    const k = pr(t, D * .3, D * .3 + .55, ease.outBack);
    stop.style.left = '0px'; stop.style.top = '0px';
    stop.style.transform = `translate(${800 - 150}px, ${1080 - 520}px) rotate(${(1 - k) * 80 + 6}deg)`;
    stop.style.opacity = clamp((t - D * .3) / .1);
    n.update(t);
  };
}};

// ---------- s4: tagsüber nachcremen, nachts nichts ----------
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, '*3.* Nachts nichts drauf', { y: 220, size: 118, t0: 0, step: .07 });
  const X0 = 90, X1 = 990, MID = 540, Y0 = 640, Y1 = 1220;
  el('div', { left: X0 + 'px', top: Y0 + 'px', width: (MID - X0) + 'px', height: (Y1 - Y0) + 'px', background: C.weiss, borderRadius: '28px 0 0 28px', border: `6px solid ${C.schwarz}`, borderRight: 'none', boxSizing: 'border-box' }, root);
  el('div', { left: MID + 'px', top: Y0 + 'px', width: (X1 - MID) + 'px', height: (Y1 - Y0) + 'px', background: C.nacht, borderRadius: '0 28px 28px 0', border: `6px solid ${C.schwarz}`, borderLeft: 'none', boxSizing: 'border-box' }, root);
  const sn = svg(sun(), {}, root, '0 0 200 200', 130, 130);
  const mn = svg(moonSmall(), {}, root, '0 0 200 200', 130, 130);
  label(root, 'tagsüber', 315, 800);
  label(root, 'nachts', 765, 800, { color: C.weiss });
  const bx = [160, 255, 350, 445];
  const balms = bx.map(() => svg(balm, {}, root, '0 0 80 170', 70, 150));
  const dash = svg(`<line x1="10" y1="10" x2="370" y2="10" stroke="${C.weiss}" stroke-opacity=".35" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 26"/>`, {}, root, '0 0 380 20', 380, 20);
  const nix = el('div', { left: '590px', top: '960px', width: '350px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '74px', color: C.rosa, transform: 'rotate(-4deg)' }, root, 'stundenlang<br>nichts.');
  const bar = el('div', { left: 0, top: 0, width: '10px', height: (Y1 - Y0 - 40) + 'px', background: C.beere, borderRadius: '5px' }, root);
  return (t) => {
    head.update(t);
    place(sn, 315, 715, 1, t * 20); place(mn, 765, 715, 1, -8);
    const t0 = .35, t1 = D * .78;
    const bxPos = lerp(X0 + 20, X1 - 20, pr(t, t0, t1, ease.lin));
    place(bar, bxPos, (Y0 + Y1) / 2, 1, 0, pr(t, t0 - .1, t0 + .1) * (1 - pr(t, t1, t1 + .3)));
    balms.forEach((b, i) => { const ti = lerp(t0, t1, (bx[i] - X0 - 20) / (X1 - X0 - 40)); const k = pr(t, ti, ti + .35, ease.outBack); place(b, bx[i], 1040, k + .001, (i % 2 ? 6 : -6), clamp((t - ti) / .1)); });
    place(dash, 765, 1150, 1, 0, pr(t, D * .5, D * .6));
    const nk = pr(t, D * .62, D * .62 + .4);
    nix.style.opacity = nk; nix.style.clipPath = `inset(0 ${100 - nk * 100}% 0 0)`;
  };
}};

// ---------- s5: keine Talgdrüsen ----------
SCENES.s5 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const who = note(root, 'meine Kosmetikerin:', { x: 96, y: 196, r: -3, t0: 0, size: 70, color: C.beere });
  const head = bigText(root, 'Lippen haben keine *Talgdrüsen.*', { y: 290, size: 106, t0: D * .1, step: .07 });
  const L = lens(root, 300, 960, 400, skinCut(true, 0));
  const R = lens(root, 780, 960, 400, lipCut());
  label(root, 'Haut', 300, 1180);
  label(root, 'Lippe', 780, 1180);
  const ev = svg('', {}, root, '0 0 200 300', 160, 240);
  return (t) => {
    who.update(t); head.update(t);
    L.s.querySelector('svg').innerHTML = skinCut(true, pr(t, D * .3, D * .3 + 1, ease.lin));
    const dk = pr(t, D * .62, D * .95, ease.inOutSine);
    // Tropfen auf der Lippe verdunstet: wird kleiner, steigt als Welle auf
    ev.querySelector('svg').innerHTML = `<g transform="translate(100 ${230 - dk * 40}) scale(${(1 - dk) * .7 + .001}) translate(-100 -100)">${drop(C.weiss)}</g>
      <path d="M100 150 C80 120 120 100 100 70 C80 40 120 20 100 0" fill="none" stroke="${C.schwarz}" stroke-width="7" stroke-linecap="round" opacity="${dk * (1 - pr(t, D * .92, D))}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - dk}"/>`;
    place(ev, 780, 870, 1, 0, pr(t, D * .55, D * .62));
  };
}};

// ---------- s6: Tape über Nacht ----------
SCENES.s6 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const stars = svg('', {}, root, '0 0 1080 700', 1080, 700);
  const mn = svg(moonSmall(MOND, C.nacht), {}, root, '0 0 200 200', 150, 150);
  const head = bigText(root, 'Über Nacht *Feuchtigkeit.*', { y: 220, size: 112, color: C.weiss, accent: C.rosa, t0: D * .45, step: .07 });
  const first = bigText(root, 'Abends: ein *Tape* drauf.', { y: 220, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .07 });
  const cam = cameo(root, 540, 1010, 560);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 520, 520);
  const drops = [0, 1, 2].map(() => svg(drop(C.weiss), {}, root, '0 0 200 200', 70, 70));
  const n = note(root, 'Pflege-Mitte', { x: 640, y: 660, r: 5, t0: D * .3, size: 72, color: C.rosa });
  return (t) => {
    stars.querySelector('svg').innerHTML = [[110, 560, 1.2], [230, 640, .8], [880, 470, 1], [990, 610, .7], [60, 420, .7], [700, 560, .6]]
      .map(([x, y, s], i) => ART.star(x, y, s * 1.4 * (.8 + .2 * Math.sin(t * 3 + i)), MOND)).join('');
    place(stars, 540, 350);
    const ft = 1 - pr(t, D * .4, D * .45, ease.lin);
    first.update(t); first.node.style.opacity = ft;
    head.update(t);
    const mk = pr(t, 0, D, ease.lin);
    place(mn, lerp(780, 980, mk), 640 - Math.sin(Math.PI * mk) * 50, 1, -10);
    const down = pr(t, D * .08, D * .3, ease.outCubic);
    place(tape, 540, lerp(640, 990, down), lerp(1.08, 1, down), lerp(-12, 0, down), pr(t, 0, .25));
    drops.forEach((d, i) => {
      const t0 = D * .5 + i * .45, k = ((t - t0) % 1.35) / 1.35;
      const on = t > t0 ? 1 : 0;
      place(d, 480 + i * 60, 880 + k * 90, 1 - .45 * k, 0, on * Math.min(1, Math.sin(Math.PI * clamp(k)) * 2) * (1 - k * .6));
    });
    n.update(t);
    cam.style.transform = `translateY(${noise(t, 3) * 3}px)`;
  };
}};

// ---------- s7: Speichern ----------
SCENES.s7 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Speicher dir das für die *Heizungssaison.*', { y: 220, size: 108, t0: 0, step: .05 });
  const fl = [[140, 0, .5, 1], [330, 300, .35, .7], [620, 120, .45, .9], [900, 420, .4, .8], [800, 0, .3, .6], [240, 520, .3, .55], [980, 200, .5, 1]]
    .map(() => svg(flake(C.weiss, 9), {}, root, '0 0 200 200', 170, 170));
  const FL = [[140, 0, .5, 1], [330, 300, .35, .7], [620, 120, .45, .9], [900, 420, .4, .8], [800, 0, .3, .6], [240, 520, .3, .55], [980, 200, .5, 1]];
  const bm = svg('', {}, root, '0 0 200 260', 300, 390);
  return (t) => {
    head.update(t);
    FL.forEach(([x, y0, s, sp], i) => { const y = 640 + ((y0 + t * 200 * sp) % 700); place(fl[i], x + Math.sin(t * 1.5 + i) * 20, y, s, t * 40 * (i % 2 ? 1 : -1), .85 * (1 - clamp((y - 1200) / 140))); });
    const tap = pr(t, D * .25, D * .25 + .15, ease.lin);
    bm.querySelector('svg').innerHTML = bookmark(tap > .5 ? C.schwarz : C.weiss);
    const pop = tap > .5 ? 1 + .14 * Math.sin(Math.PI * pr(t, D * .25 + .15, D * .25 + .55)) : 1;
    place(bm, 540, 990, pop, noise(t, 2) * 2);
  };
}};
