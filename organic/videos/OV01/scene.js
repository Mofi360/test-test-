/* OV01 – Letzter Schritt vor Licht aus  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const WARM = '#FFF1D6', MOND = '#F7E7C6';

// ---------- eigene Illustrationen ----------
/** Nachttisch, viewBox 0 0 800 640. k = Schublade offen 0..1. part: 'back' | 'front' | 'all' */
function stand(k = 0, part = 'all') {
  const S = C.schwarz, ox = 30 * k, oy = 80 * k;
  const back = `
    <rect x="110" y="600" width="40" height="40" rx="6" fill="${S}"/><rect x="650" y="600" width="40" height="40" rx="6" fill="${S}"/>
    <rect x="80" y="126" width="640" height="478" rx="10" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    <rect x="130" y="380" width="540" height="190" rx="8" fill="none" stroke="${S}" stroke-width="5" opacity=".25"/>
    <path d="M115 40 L685 40 L740 98 L60 98Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="60" y="98" width="680" height="32" rx="6" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    ${k > 0.01 ? `<path d="M110 160 L690 160 L${690 + ox} ${160 + oy} L${110 - ox} ${160 + oy}Z" fill="${S}"/>` : ''}`;
  const front = `
    ${k > 0.01 ? `<path d="M110 160 L${110 - ox} ${160 + oy} L${110 - ox} ${330 + oy + 10 * k} L110 330Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M690 160 L${690 + ox} ${160 + oy} L${690 + ox} ${330 + oy + 10 * k} L690 330Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>` : ''}
    <rect x="${110 - ox}" y="${160 + oy}" width="${580 + 2 * ox}" height="${170 + 10 * k}" rx="8" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    <rect x="${360 - ox * .2}" y="${232 + oy}" width="${80 + ox * .4}" height="22" rx="11" fill="${S}"/>`;
  return part === 'back' ? back : part === 'front' ? front : back + front;
}
/** Nachttischlampe, viewBox 0 0 400 500. on 0..1, cord = Zugschnur-Auslenkung in Grad */
function lamp(on = 0, cord = 0, gid = 'g') {
  const S = C.schwarz;
  return `
    <defs><radialGradient id="ov01glow${gid}"><stop offset="0" stop-color="${WARM}" stop-opacity=".75"/><stop offset=".45" stop-color="${WARM}" stop-opacity=".3"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="200" cy="175" r="320" fill="url(#ov01glow${gid})" opacity="${on}"/>
    <rect x="191" y="225" width="18" height="200" fill="${S}"/>
    <rect x="128" y="418" width="144" height="28" rx="14" fill="${S}"/>
    <g transform="rotate(${cord} 262 228)"><line x1="262" y1="228" x2="262" y2="318" stroke="${S}" stroke-width="4"/><circle cx="262" cy="324" r="9" fill="${C.beere}"/></g>
    <path d="M122 92 L278 92 L322 230 L78 230Z" fill="${on > .5 ? '#FCEBCB' : '#F6EEEA'}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M140 120 L150 200" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`;
}
// kleine Lippenprodukte (viewBox 0 0 200 300); b = Unterkante
const PROD = [
  { b: 280, m: `<path d="M58 228 L142 228 L152 64 L48 64Z" fill="${C.rosaTief}" stroke="${C.schwarz}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="42" y="40" width="116" height="26" rx="5" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>
    <rect x="78" y="105" width="44" height="78" rx="8" fill="#fff" opacity=".8"/>
    <rect x="70" y="226" width="60" height="54" rx="9" fill="${C.schwarz}"/>` },
  { b: 266, m: `<rect x="45" y="186" width="110" height="80" rx="16" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>
    <rect x="48" y="206" width="104" height="22" fill="${C.rosaTief}"/>
    <rect x="38" y="150" width="124" height="42" rx="11" fill="${C.schwarz}"/>` },
  { b: 276, m: `<rect x="75" y="146" width="50" height="130" rx="10" fill="${C.rosaHell}" stroke="${C.schwarz}" stroke-width="6"/>
    <rect x="78" y="196" width="44" height="18" fill="${C.schwarz}"/>
    <rect x="75" y="62" width="50" height="90" rx="16" fill="${C.weiss}" stroke="${C.schwarz}" stroke-width="6"/>` },
];
/** Fingerspitze von oben, viewBox 0 0 200 300, Spitze bei y 262 */
const finger = `<rect x="58" y="-40" width="84" height="302" rx="42" fill="${C.haut}" stroke="${C.hautDunkel}" stroke-width="6"/>
  <rect x="74" y="168" width="52" height="78" rx="24" fill="#fff" opacity=".55"/>
  <path d="M70 120 C88 128 112 128 130 120" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
/** Tropfen, viewBox 0 0 200 200 */
const drop = (c = C.weiss) => `<path d="M100 18 C128 62 160 92 160 128 A60 60 0 0 1 40 128 C40 92 72 62 100 18Z" fill="${c}" stroke="${C.schwarz}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M72 124 A30 30 0 0 0 92 160" stroke="${C.rosaTief}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
const spark = (c = '#fff') => `<path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4Z" fill="${c}"/>`;
/** Hautfarbenes Rund mit Lippen */
function cameo(root, cx, cy, d) {
  const c = el('div', { left: (cx - d / 2) + 'px', top: (cy - d / 2) + 'px', width: d + 'px', height: d + 'px', borderRadius: '50%', background: C.haut, overflow: 'hidden' }, root);
  svg(`<path d="M150 40 C180 60 220 60 250 40" stroke="${C.hautDunkel}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`, { left: 0, top: 0 }, c, '0 0 400 400', d, d);
  const lips = svg(ART.lips(.55), { left: (d * .07) + 'px', top: (d * .03) + 'px' }, c, '0 0 400 400', d * .86, d * .86);
  return c;
}
/** Fenster, viewBox 0 0 500 420; inner = Himmel-Inhalt */
function windowSvg(sky, inner) {
  return `<defs><clipPath id="wclip"><rect x="22" y="22" width="456" height="356" rx="8"/></clipPath></defs>
    <rect x="22" y="22" width="456" height="356" rx="8" fill="${sky}"/>
    <g clip-path="url(#wclip)">${inner}</g>
    <rect x="16" y="16" width="468" height="368" rx="12" fill="none" stroke="${C.weiss}" stroke-width="16"/>
    <line x1="250" y1="20" x2="250" y2="380" stroke="${C.weiss}" stroke-width="12"/><line x1="20" y1="200" x2="480" y2="200" stroke="${C.weiss}" stroke-width="12"/>
    <rect x="-10" y="380" width="520" height="30" rx="8" fill="${C.weiss}"/>`;
}

// ---------- s1: Lampe an ----------
SCENES.s1 = { bg: C.rosa, build(root) {
  const hook = bigText(root, 'Mein letzter Schritt, bevor das *Licht* ausgeht.', { y: 230, size: 114 });
  hook.update(10); // statisch: Hook ab Frame 0 lesbar
  const st = svg(stand(0), {}, root, '0 0 800 640', 600, 480);
  const lp = svg(lamp(0), {}, root, '0 0 400 500', 360, 450);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const klick = note(root, 'klick.', { x: 640, y: 700, r: -6, t0: .75, size: 80 });
  return (t) => {
    place(st, 540, 1248);
    const on = pr(t, .7, .85);
    const cord = t < .55 ? 0 : 14 * Math.exp(-(t - .55) * 3) * Math.sin((t - .55) * 11);
    lp.querySelector('svg').innerHTML = lamp(on, cord + tw(t, .35, .6, 0, 10) * (t < .7 ? 1 : 0), 's1');
    place(lp, 360, 838);
    place(tp, 640, 1050, .9, -6);
    klick.update(t);
  };
}};

// ---------- s2: drei Sachen in die Schublade ----------
SCENES.s2 = { bg: C.rosaHell, build(root, ctx) {
  const head = bigText(root, 'Drei Sachen? Nicht *mehr.*', { y: 230, size: 124, t0: .1, step: .08 });
  const back = svg(stand(0, 'back'), {}, root, '0 0 800 640', 720, 576);
  const items = PROD.map(p => svg(p.m, {}, root, '0 0 200 300', 160, 240));
  const front = svg(stand(0, 'front'), {}, root, '0 0 800 640', 720, 576);
  const klack = note(root, 'klack!', { x: 780, y: 740, r: 6, t0: 3.05, size: 84 });
  const x0 = [330, 540, 750], x1 = [450, 545, 640], rot = [-170, 150, -200];
  return (t) => {
    head.update(t);
    const k = t < 2.85 ? pr(t, .25, .65, ease.outBack) : 1 - pr(t, 2.85, 3.05, ease.inCubic);
    back.querySelector('svg').innerHTML = stand(k, 'back');
    front.querySelector('svg').innerHTML = stand(k, 'front');
    place(back, 540, 1125); place(front, 540, 1125);
    items.forEach((it, i) => {
      const b = PROD[i].b, ys = 900 - (b - 150) * .8;
      const ts = .75 + i * .55, kk = pr(t, ts, ts + .75, ease.inOutSine);
      const x = lerp(x0[i], x1[i], kk), y = lerp(ys, 1060, kk) - 260 * Math.sin(Math.PI * kk);
      const wob = kk === 0 ? Math.sin(t * 9 + i) * 2 * pr(t, 0, .4) : 0;
      place(it, x, y, lerp(1, .85, kk), lerp(0, rot[i], kk) + wob, 1 - pr(t, 2.85, 2.98, ease.lin));
    });
    klack.update(t);
  };
}};

// ---------- s3: Lippen zu, drauf, andrücken ----------
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const l0 = bigText(root, 'Jetzt: ein *Tape.*', { y: 220, size: 112, t0: .05, step: .07 });
  const l1 = bigText(root, 'Lippen zu.', { y: 220, size: 112, t0: D * .36, step: .07 });
  const l2 = bigText(root, 'Drauf.', { y: 345, x: 330, size: 112, t0: D * .56, step: .07 });
  const l3 = bigText(root, '*Andrücken.*', { y: 470, x: 400, w: 640, size: 112, t0: D * .78, step: .07 });
  const cam = cameo(root, 540, 1010, 580);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 540, 540);
  const fl = svg(finger, {}, root, '0 0 200 300', 140, 210);
  const fr = svg(finger, {}, root, '0 0 200 300', 140, 210);
  return (t) => {
    l0.update(t); l0.node.style.opacity = 1 - pr(t, D * .3, D * .35, ease.lin);
    l1.update(t); l2.update(t); l3.update(t);
    const down = pr(t, D * .55, D * .72, ease.outCubic);
    const pc = pr(t, D * .8, D * .88, ease.inOutSine) - pr(t, D * .9, D * .99, ease.inOutSine);
    const ty = lerp(620 + noise(t, 2) * 10, 1000, down);
    place(tape, 540, ty, lerp(1.06, 1, down) * (1 - pc * .02), lerp(-10 + noise(t, 5) * 3, 0, down), pr(t, 0, .3));
    const fo = pr(t, D * .74, D * .8) * (1 - pr(t, D * .95, D * 1, ease.lin));
    const d = lerp(-70, 0, pc), sn = Math.sin(35 * Math.PI / 180), cs = Math.cos(35 * Math.PI / 180);
    // Fingerspitzen schräg von oben an die Tape-Enden
    const L = [350 + sn * d, 965 + cs * d], R = [730 - sn * d, 965 + cs * d];
    place(fl, L[0] - sn * 78, L[1] - cs * 78, 1, -35, fo); place(fr, R[0] + sn * 78, R[1] - cs * 78, 1, 35, fo);
    cam.style.transform = `scale(${1 - pc * .01})`;
  };
}};

// ---------- s4: Pflege in der Mitte ----------
SCENES.s4 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'In der Mitte sitzt die *Pflege.*', { y: 220, size: 104, t0: .05, step: .06 });
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 560, 560);
  const names = ['Kollagen', 'Hyaluronsäure', 'Vitamin E'], xs = [230, 540, 850], at = [.38, .58, .78];
  const drops = names.map(() => svg(drop(), {}, root, '0 0 200 200', 180, 180));
  const labels = names.map((n, i) => el('div', { left: (xs[i] - 200) + 'px', width: '400px', top: '1180px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '46px', color: C.schwarz, letterSpacing: '-.5px' }, root, n));
  return (t) => {
    head.update(t);
    place(tape, 540, 690, tw(t, .1, 1.4, 1, 1.65, ease.inOutCubic), tw(t, 0, 1.4, -4, 0));
    drops.forEach((d, i) => {
      const k = pr(t, D * at[i], D * at[i] + .55, ease.outBack);
      const x = lerp(540, xs[i], k), y = lerp(690, 1070, k) - 140 * Math.sin(Math.PI * clamp(k));
      place(d, x, y, lerp(.2, 1, clamp(k)), (1 - k) * 30 + noise(t, i) * 2, clamp(k * 3));
      const lk = pr(t, D * at[i] + .3, D * at[i] + .6);
      labels[i].style.opacity = lk; labels[i].style.transform = `translateY(${(1 - lk) * 24}px)`;
    });
  };
}};

// ---------- s5: die ganze Nacht ----------
function nightSky(t, k) {
  const mx = lerp(70, 430, k), my = 230 - 150 * Math.sin(Math.PI * k);
  const stars = [[80, 70, .9], [190, 140, .6], [330, 60, .8], [420, 150, .55], [120, 300, .5], [370, 290, .65], [290, 250, .45]]
    .map(([x, y, s], i) => ART.star(x, y, s * (.75 + .25 * Math.sin(t * 3 + i * 1.7)), MOND).replace('fill=', `opacity="${.45 + .55 * (.5 + .5 * Math.sin(t * 2.3 + i * 2.1))}" fill=`)).join('');
  return `${stars}<circle cx="${mx}" cy="${my}" r="46" fill="${MOND}"/><circle cx="${mx + 22}" cy="${my - 14}" r="40" fill="${C.nachtHell}"/>`;
}
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const head = bigText(root, 'Die ganze Nacht *da.*', { y: 220, size: 96, color: C.weiss, accent: C.rosa, t0: .05, step: .07 });
  const win = svg('', {}, root, '0 0 500 420', 380, 319);
  const cam = cameo(root, 540, 1060, 520);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 480, 480);
  return (t, p) => {
    head.update(t);
    win.querySelector('svg').innerHTML = windowSvg(C.nachtHell, nightSky(t, p));
    place(win, 540, 615);
    place(tape, 540, 1040, 1, 0);
  };
}};

// ---------- s6: morgens langsam abziehen ----------
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Morgens *langsam* abziehen.', { y: 220, size: 92, t0: .05, step: .07 });
  const win = svg('', {}, root, '0 0 500 420', 380, 319);
  const cam = cameo(root, 540, 1060, 520);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 480, 480);
  const sp = [[420, 1030, 1], [650, 1010, .7], [560, 1120, .55], [470, 1110, .45]].map(() => svg(spark(), {}, root, '0 0 100 100', 110, 110));
  const SP = [[420, 1010, 1], [660, 990, .75], [575, 1095, .6], [370, 1070, .5]];
  return (t, p) => {
    head.update(t);
    const sun = tw(t, 0, D * .45, 360, 150, ease.outCubic);
    win.querySelector('svg').innerHTML = windowSvg('#FFFFFF', `<circle cx="250" cy="${sun}" r="70" fill="${C.rosaTief}"/>
      <path d="M40 330 C120 300 180 340 250 320 C330 300 400 335 470 315 L470 400 L40 400Z" fill="${C.rosa}"/>`);
    place(win, 540, 615);
    // Abziehen: Drehpunkt am linken Ende
    const k = pr(t, D * .12, D * .5, ease.inOutSine), off = pr(t, D * .5, D * .62, ease.inCubic);
    const r = -32 * k * Math.PI / 180, half = 204;
    const px = 540 - half, py = 1040;
    place(tape, px + Math.cos(r) * half - off * 160, py + Math.sin(r) * half - off * 380, 1, -32 * k - off * 20, 1 - off);
    sp.forEach((s, i) => {
      const [x, y, sc] = SP[i];
      const a = pr(t, D * .58 + i * .18, D * .58 + i * .18 + .4, ease.outBack);
      place(s, x, y, sc * a * (.85 + .15 * Math.sin(t * 5 + i)), t * 30 + i * 20, clamp(a));
    });
  };
}};

// ---------- s7: Licht aus ----------
SCENES.s7 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const st = svg(stand(0), {}, root, '0 0 800 640', 600, 480);
  const lp = svg(lamp(1), {}, root, '0 0 400 500', 360, 450);
  const tp = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const dark = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: C.nacht }, root);
  const head = bigText(root, 'Das ist *Diva* *Tape.*', { y: 240, size: 128, color: C.weiss, accent: C.rosa, t0: .1, step: .08 });
  const more = note(root, 'Mehr ist es nicht.', { x: 150, y: 520, r: -4, t0: D * .62, size: 92, color: C.rosa });
  return (t) => {
    head.update(t); more.update(t);
    const off = t > D * .55 ? 1 : 0;
    const cord = t > D * .5 ? 14 * Math.exp(-(t - D * .5) * 3) * Math.sin((t - D * .5) * 11) : 0;
    lp.querySelector('svg').innerHTML = lamp(1 - off, cord, 's7');
    place(st, 540, 1248); place(lp, 360, 838); place(tp, 640, 1050, .9, -6);
    dark.style.opacity = .1 + .7 * pr(t, D * .55, D * .62, ease.lin);
  };
}};
