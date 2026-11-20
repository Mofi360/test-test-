/* R603 – Dunkel, hell oder Glanz  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const { sourceCard, sendTo, qMark, coverLayout } = KIT;
const S = C.schwarz, MOND = '#F7E7C6';
// echte Lippenstift-Töne (Ausnahme laut Briefing)
const BRAUN = '#4E2B25', WEIN = '#7B1E38', VIOLETT = '#4A2452', PFLAUME = '#3A1830';
const ROSA = '#EF9DB4', NUDE = '#D3977F', PFIRSICH = '#F7A988';
const GLOSS = '#D96C86', NATUR = '#DDA197';

// ---------- eigene Illustrationen ----------
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

// EINE Lippenkontur für alle Varianten – nur Farbe und Glanz ändern sich.
const LP_OUT = 'M-150 0 C-110 -21 -60 -47 -22 -34 C-10 -24 10 -24 22 -34 C60 -47 110 -21 150 0 C110 41 50 57 0 55 C-50 57 -110 41 -150 0Z';
const LP_LINE = 'M-150 0 C-90 7 -40 4 0 9 C40 4 90 7 150 0';
/** o: {id, base, layers:[{c,a,b}] (Farbauftrag von a bis b, 0..1), gloss 0..1, ga (Glanz-Auftrag 0..1), gx -1..1} */
function lipsArt(o = {}) {
  const id = o.id || 'l', g = o.gloss ?? 0, gx = o.gx ?? -.35, ga = o.ga ?? 1;
  const layers = (o.layers || []).map((l, i) => `<clipPath id="${id}c${i}"><rect x="${-160 + 320 * Math.min(l.a, l.b)}" y="-70" width="${Math.max(0, 320 * Math.abs(l.b - l.a))}" height="150"/></clipPath><g clip-path="url(#${id}c${i})"><path d="${LP_OUT}" fill="${l.c}"/></g>`).join('');
  const gl = g > 0 ? `<clipPath id="${id}o"><path d="${LP_OUT}"/></clipPath><clipPath id="${id}g"><rect x="-160" y="-70" width="${320 * ga}" height="150"/></clipPath>
    <g clip-path="url(#${id}g)"><g clip-path="url(#${id}o)" opacity="${g}">
      <path d="M-128 14 C-70 40 70 40 128 14 C80 50 -80 50 -128 14Z" fill="#fff" opacity=".2"/>
      <ellipse cx="${gx * 88}" cy="28" rx="40" ry="9" fill="#fff" opacity=".9" transform="rotate(${-gx * 6} ${gx * 88} 28)"/>
      <ellipse cx="${gx * 88 + 56}" cy="${30 - Math.abs(gx) * 2}" rx="9" ry="5" fill="#fff" opacity=".85"/>
      <ellipse cx="${gx * 62 - (gx > 0 ? -30 : 30)}" cy="-23" rx="17" ry="5" fill="#fff" opacity=".6"/>
    </g></g>` : '';
  return `<path d="${LP_OUT}" fill="${o.base ?? NATUR}"/>${layers}
    <path d="${LP_LINE}" fill="none" stroke="#2a0d16" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>${gl}`;
}
/** Karte mit Hautton + Lippen (wie ein Ausschnitt-Foto). viewBox 0 0 480 300, Lippenmitte (240,168), Lippen-Skala 1.2 */
function faceCard(o = {}) {
  return `<rect x="3" y="3" width="474" height="294" rx="30" fill="${C.haut}" stroke="${S}" stroke-width="6"/>
    <path d="M222 22 C226 44 222 58 210 66 C228 75 252 75 270 66 C258 58 254 44 258 22" fill="none" stroke="${C.hautDunkel}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M196 268 C222 279 258 279 284 268" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
    <g transform="translate(240 168) scale(1.2)">${lipsArt(o)}</g>`;
}
/** Lippenstift, viewBox 0 0 200 400. ext 0..1 = herausgedreht. Spitze bei ca. (100, 77) wenn ext=1 */
function stick(color, ext = 1) {
  const bt = 150 - 90 * ext;
  return `<path d="M72 190 L72 ${bt + 34} L128 ${bt} L128 190Z" fill="${color}"/>
    <path d="M72 ${bt + 34} L128 ${bt}" stroke="#fff" stroke-opacity=".3" stroke-width="6"/>
    <path d="M86 ${bt + 52} L86 172" stroke="#fff" stroke-opacity=".22" stroke-width="8" stroke-linecap="round"/>
    <rect x="62" y="172" width="76" height="58" fill="#E8D2B0" stroke="${S}" stroke-width="5"/>
    <path d="M62 190 L138 190" stroke="${S}" stroke-opacity=".25" stroke-width="3"/>
    <rect x="50" y="226" width="100" height="160" rx="10" fill="${S}"/>
    <rect x="50" y="226" width="100" height="22" fill="#3a2e33"/>
    <path d="M68 262 L68 366" stroke="#fff" stroke-opacity=".16" stroke-width="7" stroke-linecap="round"/>`;
}
/** Gloss-Applikator (Stab mit Schwämmchen), viewBox 0 0 200 400, Spitze bei ca. (100, 60) */
function wand(color = GLOSS) {
  return `<rect x="93" y="112" width="14" height="150" fill="#CFC5C8" stroke="${S}" stroke-width="4"/>
    <path d="M100 48 C120 62 122 104 108 126 L92 126 C78 104 80 62 100 48Z" fill="${color}" stroke="${S}" stroke-width="4"/>
    <ellipse cx="94" cy="80" rx="5" ry="12" fill="#fff" opacity=".7"/>
    <rect x="66" y="250" width="68" height="138" rx="10" fill="${S}"/>
    <rect x="66" y="250" width="68" height="18" fill="#3a2e33"/>
    <path d="M80 284 L80 370" stroke="#fff" stroke-opacity=".16" stroke-width="6" stroke-linecap="round"/>`;
}
/** Gloss-Fläschchen, viewBox 0 0 200 400 */
function glossTube(color = GLOSS) {
  return `<rect x="58" y="176" width="84" height="210" rx="16" fill="${color}" stroke="${S}" stroke-width="5"/>
    <path d="M76 206 L76 350" stroke="#fff" stroke-opacity=".55" stroke-width="9" stroke-linecap="round"/>
    <rect x="66" y="46" width="68" height="134" rx="10" fill="${S}"/><rect x="66" y="158" width="68" height="22" fill="#3a2e33"/>
    <path d="M80 66 L80 140" stroke="#fff" stroke-opacity=".16" stroke-width="6" stroke-linecap="round"/>`;
}
/** Farb-Abstrich (wie mit dem Stift gezogen), viewBox 0 0 200 110 */
const smear = c => `<path d="M22 60 C20 34 46 22 78 26 C112 18 150 20 174 34 C190 46 184 74 166 82 C132 94 92 88 60 92 C38 92 24 80 22 60Z" fill="${c}"/>
  <path d="M52 44 C84 36 122 36 150 44" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round"/>`;

// Node so setzen, dass die Stiftspitze auf (tx,ty) liegt. L = Abstand Mitte→Spitze in px
function tipAt(node, tx, ty, rot, L, s = 1, o = 1) {
  const r = rot * Math.PI / 180;
  place(node, tx - L * s * Math.sin(r), ty + L * s * Math.cos(r), s, rot, o);
}
function setArt(node, markup) { node.querySelector('svg').innerHTML = markup; }
function tag(root, text, o = {}) {
  return el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: o.pad ?? '6px 20px 10px', background: o.bg ?? S, color: o.color ?? C.weiss, fontFamily: o.font ?? F.sans, fontWeight: o.weight ?? 700, fontSize: (o.size ?? 38) + 'px', whiteSpace: 'nowrap', borderRadius: '4px', border: o.border ?? 'none', transform: `rotate(${o.r ?? -3}deg)`, transformOrigin: '50% 50%' }, root, text);
}
const pop = (node, t, t0, r = 0, d = .4) => { const k = pr(t, t0, t0 + d, ease.outBack); node.style.opacity = clamp((t - t0) / .1); node.style.transform = `scale(${k}) rotate(${r}deg)`; };

// ---------- s1: Hook – drei Varianten, drei Fragezeichen ----------
SCENES.s1 = { bg: C.rosa, build(root, ctx) {
  el('div', { left: '80px', top: '205px', width: '900px', fontFamily: F.display, fontSize: '96px', lineHeight: 1.03, letterSpacing: '-1.5px', color: S }, root,
    `Dunkel, hell oder glänzend: Was lässt Lippen <span style="color:${C.beere}">voller wirken?</span>`);
  const V = [
    { x: 330, y: 665, r: -3, o: { id: 'h1', base: WEIN }, col: WEIN, lab: 'dunkel', q: [575, 590] },
    { x: 715, y: 905, r: 2.5, o: { id: 'h2', base: ROSA }, col: ROSA, lab: 'hell', q: [470, 850] },
    { x: 330, y: 1150, r: -2, o: { id: 'h3', base: GLOSS, gloss: 1 }, col: GLOSS, lab: 'glänzend', q: [575, 1075] },
  ];
  const cards = V.map(v => svg(faceCard(v.o), {}, root, '0 0 480 300', 432, 270));
  const tags = V.map((v, i) => tag(root, v.lab, { x: v.x - 200, y: v.y - 160, r: i % 2 ? 3 : -4, size: 36 }));
  const qs = V.map((v, i) => qMark(root, { x: v.q[0], y: v.q[1], size: 124, t0: -2 - i * .4 }));
  const ls = svg(stick(WEIN), {}, root, '0 0 200 400', 150, 300);
  const sp = svg(sparkle(30, 30, .9) + sparkle(74, 70, .45), {}, root, '0 0 100 100', 100, 100);
  const T = [[.15, 1.0], [1.3, 2.05], [2.35, 3.1]];
  return (t) => {
    qs.forEach(q => q.update(t));
    let cur = 0; if (t > 1.15) cur = 1; if (t > 2.2) cur = 2;
    V.forEach((v, i) => {
      const [a, b] = T[i], hit = clamp(1 - Math.abs(t - (a + b) / 2) / .5);
      if (i === 2) setArt(cards[i], faceCard({ ...v.o, gx: tw(t, a, b + .5, -.6, .6, ease.inOutSine) }));
      place(cards[i], v.x, v.y + Math.sin(t * 1.6 + i * 2) * 3, 1 + hit * .035, v.r + hit * (i % 2 ? -1 : 1));
    });
    // Stift: fährt nacheinander über jede Variante
    const pos = i => { const v = V[i], [a, b] = T[i], k = pr(t, a, b, ease.inOutSine); return [v.x - 130 + 260 * k, v.y + 22 + Math.sin(k * Math.PI) * 12]; };
    let p = pos(cur);
    if (cur > 0) { const k = pr(t, T[cur - 1][1] + .02, T[cur][0], ease.inOutCubic), q = pos(cur - 1); p = [lerp(q[0], p[0], k), lerp(q[1], p[1], k) - Math.sin(k * Math.PI) * 40]; }
    const out = pr(t, 3.15, 3.6, ease.inOutCubic);
    setArt(ls, cur === 2 ? wand(GLOSS) : stick(V[cur].col));
    tipAt(ls, p[0] + out * 120, p[1] + out * 30, -48 + noise(t * 2, 3) * 3 + out * 20, cur === 2 ? 105 : 92, 1);
    const k3 = pr(t, 2.5, 2.9, ease.outBack);
    place(sp, 150, 1040, k3 * (.9 + Math.abs(Math.sin(t * 3)) * .25), t * 20, clamp((t - 2.5) / .1));
  };
}};

// ---------- Baustein für Option 1/2/3: Karte, Stift, Farbtupfer ----------
function head(root, n, title, dark) {
  const m = qMark(root, { x: 162, y: 292, size: 150, char: String(n), t0: 0, fill: dark ? C.rosa : S, color: dark ? S : C.weiss });
  const tt = bigText(root, title, { x: 262, y: 212, w: 700, size: 150, color: dark ? C.weiss : S, t0: 0, step: .05 });
  return { m, tt };
}
function guides(root, cx, y0, y1, half, color = S) {
  const g = svg('', { left: '0px', top: '0px' }, root, '0 0 1080 1920', 1080, 1920);
  return (k) => {
    const y = lerp(y0, y1, k);
    setArt(g, k <= 0 ? '' : [-1, 1].map(s => `<line x1="${cx + s * half}" y1="${y0}" x2="${cx + s * half}" y2="${y}" stroke="${color}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>`).join(''));
  };
}
const CARD_W = 760, CARD_H = 475, LSC = 1.2 * CARD_W / 480; // Lippen-Skala auf dem Bild

function optionScene(o) {
  return { bg: o.bg, build(root, ctx) {
    const D = ctx.dur, cx = 540, cy = 800, ly = cy + (168 - 150) * CARD_W / 480; // Lippen-Mitte y
    const intro = o.intro ? bigText(root, o.intro, { x: 90, y: 215, w: 900, size: 124, t0: 0, step: .04 }) : null;
    const hd = el('div', { left: '0px', top: '0px', width: '1080px', height: '560px' }, root);
    const h = head(hd, o.n, o.title, false);
    const line2 = o.line2 ? bigText(root, o.line2, { x: 90, y: 400, w: 900, size: 92, t0: o.line2At * D, step: .07 }) : null;
    const card = svg(faceCard({ id: 'o' + o.n }), {}, root, '0 0 480 300', CARD_W, CARD_H);
    const gd = o.guidesAt ? guides(root, cx, cy - CARD_H / 2 - 46, cy + CARD_H / 2 + 46, 150 * LSC) : null;
    const sw = o.cols.map((c, i) => {
      const x = 250 + i * 290;
      const s = svg(smear(c.c), {}, root, '0 0 200 110', 220, 121);
      const lb = el('div', { left: (x - 160) + 'px', top: '1244px', width: '320px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '40px', color: S }, root, c.name);
      return { s, lb, x };
    });
    const ls = svg(stick(o.cols[0].c), {}, root, '0 0 200 400', 210, 420);
    const hs = o.intro ? o.headAt * D : 0;
    return (t) => {
      if (intro) { intro.update(t); const out = pr(t, hs - .25, hs); intro.node.style.opacity = 1 - out; intro.node.style.transform = `translateY(${-out * 40}px)`; }
      hd.style.opacity = t >= hs ? 1 : 0; h.m.update(t - hs); h.tt.update(t - hs);
      if (line2) line2.update(t);
      // Farbauftrag: drei Züge, abwechselnd von links und rechts
      const layers = []; let tip = null, colNow = o.cols[0].c;
      o.cols.forEach((c, i) => {
        const a = o.strokes[i][0] * D, b = o.strokes[i][1] * D, k = pr(t, a, b, ease.inOutSine), ltr = i % 2 === 0;
        if (k > 0) { layers.push(ltr ? { c: c.c, a: 0, b: k } : { c: c.c, a: 1 - k, b: 1 }); colNow = c.c; }
        if (t >= a - .35) { const f = ltr ? k : 1 - k; tip = [cx + (f - .5) * 300 * LSC, ly + 30 + Math.sin(f * Math.PI) * 26]; colNow = c.c; }
        const st = o.swAt[i] * D, kk = pr(t, st, st + .4, ease.outBack);
        place(sw[i].s, sw[i].x, 1180, kk, (i - 1) * 4 - 2, clamp((t - st) / .1));
        sw[i].lb.style.opacity = pr(t, st + .1, st + .35);
      });
      setArt(card, faceCard({ id: 'o' + o.n, layers }));
      place(card, cx, cy, 1, -1.2 + Math.sin(t * 1.1) * .5);
      const a0 = o.strokes[0][0] * D, inn = pr(t, a0 - .9, a0 - .2, ease.outCubic), outT = (o.stickOut ?? 2) * D, out = pr(t, outT, outT + .5, ease.inCubic);
      if (!tip) tip = [cx - 150 * LSC, ly + 30];
      setArt(ls, stick(colNow));
      tipAt(ls, tip[0] + (1 - inn) * 420 + out * 700, tip[1] + (1 - inn) * 500 + out * 500, -34 + noise(t * 2, 2) * 2.5 + (1 - inn) * 30, 129, 1);
      if (gd) gd(pr(t, o.guidesAt * D, o.guidesAt * D + .7, ease.inOutCubic));
    };
  }};
}

// ---------- s2: Option 1 – dunkle Töne ----------
SCENES.s2 = optionScene({ bg: C.rosaHell, n: 1, title: 'Dunkel', intro: 'Rate kurz *mit.*', headAt: .2,
  cols: [{ c: BRAUN, name: 'Dunkles Braun' }, { c: WEIN, name: 'Weinrot' }, { c: VIOLETT, name: 'Violett' }],
  strokes: [[.34, .5], [.66, .76], [.82, .92]], swAt: [.52, .74, .88] });

// ---------- s3: gleiche Form, wirkt optisch schmaler (+ Quelle) ----------
SCENES.s3 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur, W3 = 600, H3 = 375, sc = 1.2 * W3 / 480, cx = 500;
  const hl = bigText(root, 'Wirkt *optisch* schmaler', { x: 90, y: 205, w: 900, size: 116, t0: 0, step: .04 });
  const c1 = svg(faceCard({ id: 'a1' }), {}, root, '0 0 480 300', W3, H3);
  const c2 = svg(faceCard({ id: 'a2', base: WEIN }), {}, root, '0 0 480 300', W3, H3);
  const gd = guides(root, cx, 470, 1210, 150 * sc, C.beere);
  const nt = note(root, 'gleiche Form,\nnur die Farbe ist anders', { x: 640, y: 770, size: 58, r: 5, t0: .9, color: C.beere });
  nt.node.style.lineHeight = '.95'; nt.node.style.width = '330px'; nt.node.style.whiteSpace = 'pre-line';
  const src = sourceCard(root, { name: 'Schmink-Faustregel, u. a. dm-Ratgeber', x: 70, y: 1262, t0: .5, size: 34 });
  return (t) => {
    hl.update(t); nt.update(t); src.update(t);
    place(c1, cx - 60, 660, 1, -1.5); place(c2, cx - 60, 1030, tw(t, 0, .45, .9, 1, ease.outBack), 1.2);
    gd(pr(t, .25, 1.3, ease.inOutCubic));
  };
}};

// ---------- s4: Option 2 – helle Töne ----------
SCENES.s4 = optionScene({ bg: C.rosa, n: 2, title: 'Hell',
  cols: [{ c: ROSA, name: 'Rosa' }, { c: NUDE, name: 'Nude' }, { c: PFIRSICH, name: 'Pfirsich' }],
  strokes: [[.17, .29], [.36, .44], [.48, .56]], swAt: [.3, .42, .52], stickOut: .6,
  line2: 'wirkt optisch *größer*', line2At: .62, guidesAt: .66 });

// ---------- s5: Option 3 – Glanz reflektiert Licht ----------
SCENES.s5 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur, cx = 540, cy = 930, ly = cy + 18 * CARD_W / 480;
  const m = qMark(root, { x: 162, y: 292, size: 150, char: '3', t0: 0, fill: C.rosa, color: S });
  const tt = bigText(root, 'Glanz', { x: 262, y: 212, w: 700, size: 150, color: C.weiss, t0: 0, step: .05 });
  const l2 = bigText(root, 'reflektiert *Licht*', { x: 90, y: 400, w: 900, size: 92, color: C.weiss, accent: C.rosa, t0: .36 * D, step: .08 });
  const card = svg('', {}, root, '0 0 480 300', CARD_W, CARD_H);
  const rays = svg('', { left: '0px', top: '0px' }, root, '0 0 1080 1920', 1080, 1920);
  const wd = svg(wand(GLOSS), {}, root, '0 0 200 400', 210, 420);
  const sp = svg(sparkle(40, 40, 1.2, MOND) + sparkle(110, 96, .6, C.weiss), {}, root, '0 0 150 140', 150, 140);
  const a = .07 * D, b = .25 * D, lt = .3 * D;
  return (t) => {
    m.update(t); tt.update(t); l2.update(t);
    const k = pr(t, a, b, ease.inOutSine);
    // Licht wandert in einem Bogen über die Karte, der Reflex wandert mit
    const lk = pr(t, lt, lt + .45, ease.outBack), ph = Math.max(0, t - lt - .3), gx = .72 * Math.cos(ph * 1.25);
    const lx = cx + gx * 400, lyy = 618 - (1 - gx * gx) * 30;
    setArt(card, faceCard({ id: 'g5', base: GLOSS, gloss: 1, ga: k, gx: gx * .8 }));
    place(card, cx, cy, 1, -1);
    const hx = cx + gx * .8 * 88 * LSC, hy = ly + 28 * LSC, on = clamp((t - lt - .25) / .3);
    const rx = hx - (lx - hx) * .8, ry = hy - (hy - lyy) * .8, grow = pr(t, lt + .3, lt + .8);
    setArt(rays, `<g opacity="${lk}"><circle cx="${lx}" cy="${lyy}" r="${38 * lk}" fill="${MOND}"/>
      ${Array.from({ length: 8 }, (_, i) => { const an = i * Math.PI / 4 + t * .5; return `<line x1="${lx + Math.cos(an) * 54}" y1="${lyy + Math.sin(an) * 54}" x2="${lx + Math.cos(an) * 76}" y2="${lyy + Math.sin(an) * 76}" stroke="${MOND}" stroke-width="7" stroke-linecap="round"/>`; }).join('')}</g>
      <g opacity="${on}" fill="none" stroke-linecap="round">
        <line x1="${lx + (hx - lx) * .22}" y1="${lyy + (hy - lyy) * .22}" x2="${lerp(lx, hx, .22 + .74 * grow)}" y2="${lerp(lyy, hy, .22 + .74 * grow)}" stroke="${MOND}" stroke-width="6" stroke-dasharray="4 16"/>
        <line x1="${hx}" y1="${hy}" x2="${lerp(hx, rx, grow)}" y2="${lerp(hy, ry, grow)}" stroke="${C.weiss}" stroke-width="7"/>
        ${sparkle(rx, ry, grow * (1 + Math.sin(t * 5) * .15), C.weiss)}
      </g>`);
    const inn = pr(t, a - .9, a - .15), out = pr(t, b + .1, b + .7, ease.inCubic);
    tipAt(wd, cx + (k - .5) * 300 * LSC + (1 - inn) * 400 + out * 800, ly + 30 + Math.sin(k * Math.PI) * 26 + (1 - inn) * 500 + out * 500, -34 + noise(t * 2, 2) * 2.5, 147, 1);
    const s2 = pr(t, .66 * D, .66 * D + .4, ease.outBack);
    place(sp, 190, 1245, s2 * (.9 + Math.abs(Math.sin(t * 2.6)) * .3), t * 22, clamp((t - .66 * D) / .1));
  };
}};

// ---------- s6: Hell und Glanz vorn – aber nur Faustregeln ----------
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur, base = 1300;
  const hl = bigText(root, 'Hell und Glanz liegen *vorn.*', { x: 90, y: 205, w: 900, size: 116, t0: 0, step: .05 });
  const P = [{ x: 235, h: 150, lab: 'Dunkel', art: stick(WEIN) }, { x: 520, h: 330, lab: 'Hell', art: stick(ROSA) }, { x: 805, h: 270, lab: 'Glanz', art: glossTube(GLOSS) }];
  const blocks = P.map(p => {
    const b = el('div', { left: (p.x - 132) + 'px', width: '264px', background: C.weiss, border: `6px solid ${S}`, borderBottom: 'none' }, root);
    el('div', { left: '0px', top: '26px', width: '252px', textAlign: 'center', fontFamily: F.display, fontSize: '54px', color: S }, b, p.lab);
    const a = svg(p.art, {}, root, '0 0 200 400', 170, 340);
    return { b, a };
  });
  el('div', { left: '60px', top: base + 'px', width: '900px', height: '8px', background: S, borderRadius: '4px' }, root);
  const stamp = el('div', { left: '0px', top: '0px', padding: '10px 36px 20px', background: C.weiss, border: `7px solid ${C.beere}`, borderRadius: '8px', fontFamily: F.display, fontSize: '92px', color: C.beere, whiteSpace: 'nowrap' }, root, 'Nur Faustregeln');
  const st = .5 * D;
  return (t) => {
    hl.update(t);
    P.forEach((p, i) => {
      const h = tw(t, .15 + i * .12, 1.15 + i * .12, 110, p.h, ease.outBack);
      blocks[i].b.style.top = (base - h) + 'px'; blocks[i].b.style.height = h + 'px';
      place(blocks[i].a, p.x, base - h - 160 + Math.abs(Math.sin(Math.max(0, t - 1.4) * 2.4 + i)) * (i ? -7 : 0), 1, (i - 1) * 2.5 + Math.sin(t * 1.5 + i) * 1.2);
    });
    const k = pr(t, st, st + .32, ease.outCubic);
    place(stamp, 470, 640, lerp(1.9, 1, k), lerp(-16, -7, k) + Math.sin(Math.max(0, t - st - .3) * 2) * .8, clamp((t - st) / .12));
  };
}};

// ---------- s7: Dunkel ist nicht verboten – Weinrot bleibt. ----------
SCENES.s7 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const h1 = bigText(root, 'Dunkel? *Nicht verboten.*', { x: 90, y: 205, w: 900, size: 116, t0: 0, step: .04 });
  const h2 = el('div', { left: '90px', top: '215px', width: '900px', fontFamily: F.display, fontSize: '150px', lineHeight: 1, letterSpacing: '-2px', color: S }, root, `<span style="color:${WEIN}">Weinrot</span><br>bleibt`);
  const dot = el('div', { left: '512px', top: '452px', width: '44px', height: '44px', borderRadius: '50%', background: C.beere }, root);
  const blob = svg(`<path d="M60 250 C30 150 110 50 250 40 C390 30 500 110 500 240 C500 380 400 470 260 470 C130 470 80 360 60 250Z" fill="${C.rosaHell}"/>`, {}, root, '0 0 560 500', 720, 643);
  const ls = svg(stick(WEIN, .2), {}, root, '0 0 200 400', 330, 660);
  const half = (side) => svg(`<clipPath id="hf${side}"><rect x="${side ? 200 : 0}" y="0" width="200" height="400"/></clipPath>
    <g clip-path="url(#hf${side})"><circle cx="200" cy="200" r="158" fill="none" stroke="${C.beere}" stroke-width="34"/><path d="M88 88 L312 312" stroke="${C.beere}" stroke-width="34"/></g>`, {}, root, '0 0 400 400', 520, 520);
  const hL = half(0), hR = half(1);
  const crack = svg(`<path d="M100 0 L84 60 L116 120 L88 190 L112 260" fill="none" stroke="${S}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, {}, root, '0 0 200 260', 200, 260);
  const heart = svg(ART.heart(C.beere), {}, root, '0 0 400 400', 190, 190);
  const br = .2 * D, sw = .42 * D, pt = .86 * D;
  return (t) => {
    h1.update(t);
    const o = pr(t, sw - .25, sw), i2 = pr(t, sw, sw + .4);
    h1.node.style.opacity = 1 - o; h1.node.style.transform = `translateY(${-o * 40}px)`;
    h2.style.opacity = i2; h2.style.transform = `translateY(${(1 - i2) * 40}px)`;
    const dk = pr(t, pt, pt + .3, ease.outBack); dot.style.opacity = t >= pt ? 1 : 0; dot.style.transform = `scale(${lerp(3.2, 1, dk)})`;
    place(blob, 540, 960, 1, Math.sin(t * .8) * 2);
    const ext = tw(t, sw - .1, sw + .9, .2, 1, ease.inOutCubic);
    setArt(ls, stick(WEIN, ext));
    const hopY = -Math.sin(pr(t, sw - .1, sw + .5, ease.lin) * Math.PI) * 36;
    place(ls, 540, 960 + hopY, 1, tw(t, sw - .1, sw + .7, 0, -7, ease.outBack) + Math.sin(t * 1.7) * 1.2);
    // Schild bekommt einen Riss und fällt in zwei Hälften weg
    const f = Math.max(0, t - br), shake = t < br ? Math.sin(t * 34) * pr(t, br - .5, br) * 5 : 0;
    const fall = f * f * 900, vis = clamp(1 - (f - .9) / .2);
    place(hL, 540 - f * 190 + shake, 900 + fall - f * 120, 1, -f * 70, vis);
    place(hR, 540 + f * 190 + shake, 900 + fall - f * 160, 1, f * 80, vis);
    crack.querySelector('path').setAttribute('stroke-dashoffset', 1 - pr(t, br - .45, br - .05));
    place(crack, 540, 900, 1, 8, t < br ? 1 : 0);
    const hk = pr(t, sw + .5, sw + .95, ease.outBack);
    place(heart, 800, 760 + Math.sin(t * 2.2) * 8, hk * (1 + Math.sin(t * 5) * .04), 12, clamp((t - sw - .5) / .1));
  };
}};

// ---------- s8: Senden an … dann die Kommentar-Frage ----------
SCENES.s8 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur, q = .69 * D;
  const h1 = bigText(root, 'Schick das deiner *Freundin,* die nur Dunkel trägt.', { x: 80, y: 205, w: 900, size: 92, t0: 0, step: .03 });
  const h2 = bigText(root, 'Team dunkel, hell oder *Glanz?*', { x: 80, y: 205, w: 900, size: 124, t0: q, step: .07 });
  const cols = [BRAUN, WEIN, VIOLETT, PFLAUME, WEIN];
  const row = cols.map((c, i) => svg(stick(c, .75 + (i % 2) * .25), {}, root, '0 0 200 400', 150, 300));
  const V = [{ x: 205, o: { id: 't1', base: WEIN }, lab: 'dunkel' }, { x: 515, o: { id: 't2', base: ROSA }, lab: 'hell' }, { x: 825, o: { id: 't3', base: GLOSS, gloss: 1 }, lab: 'Glanz' }];
  const cards = V.map(v => svg(faceCard(v.o), {}, root, '0 0 480 300', 280, 175));
  const labs = V.map(v => el('div', { left: (v.x - 140) + 'px', top: '776px', width: '280px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '46px', color: S }, root, v.lab));
  const sheet = sendTo(root, { contacts: ['Lena', 'Jule', 'Schwester', 'Sophie'], pick: 1, t0: .55, top: 1040 });
  return (t) => {
    h1.update(t); h2.update(t); sheet.update(t);
    const o = pr(t, q - .3, q - .05);
    h1.node.style.opacity = 1 - o;
    row.forEach((r, i) => {
      const k = pr(t, .1 + i * .1, .5 + i * .1, ease.outBack), out = pr(t, q - .35 + i * .04, q - .05 + i * .04, ease.inCubic);
      place(r, 190 + i * 165, 690 + (1 - k) * 60 + out * 80 - Math.abs(Math.sin(Math.max(0, t - 1) * 2.2 - i * .7)) * 9, 1, (i - 2) * 3 + Math.sin(t * 1.4 + i) * 1.5, clamp((t - i * .1) / .12 + (i < 3 ? 1 : 0)) * (1 - out));
    });
    V.forEach((v, i) => {
      const a = q + .1 + i * .28, k = pr(t, a, a + .4, ease.outBack);
      if (i === 2) setArt(cards[i], faceCard({ ...v.o, gx: Math.sin((t - q) * 1.6) * .6 }));
      place(cards[i], v.x, 665, k, (i - 1) * 2.5 + Math.sin(t * 1.5 + i * 2) * 1.2, clamp((t - a) / .1));
      labs[i].style.opacity = pr(t, a + .15, a + .4);
    });
  };
}};

// ---------- Cover ----------
SCENES.cover = { bg: C.rosa, build(root) {
  const art = `<rect x="74" y="14" width="252" height="372" rx="26" fill="${C.haut}" stroke="${S}" stroke-width="6"/>
    <g transform="translate(200 84) scale(.68)">${lipsArt({ id: 'cv1', base: WEIN })}</g>
    <g transform="translate(200 200) scale(.68)">${lipsArt({ id: 'cv2', base: ROSA })}</g>
    <g transform="translate(200 316) scale(.68)">${lipsArt({ id: 'cv3', base: GLOSS, gloss: 1 })}</g>
    <path d="M100 141 L300 141 M100 258 L300 258" stroke="${S}" stroke-opacity=".18" stroke-width="3" stroke-dasharray="6 9"/>`;
  coverLayout(root, { lines: ['Dunkel, hell oder Glanz:', 'Was wirkt *voller*?'], teaser: '…Weinrot-Fans müssen jetzt stark sein', art, artSize: 540, artY: 1040, size: 112, textY: 320,
    marks: [{ x: 800, y: 890, r: 8 }, { x: 280, y: 1045, r: -8 }, { x: 800, y: 1200, r: 5 }] });
}};
