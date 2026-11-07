/* OV12 – Sonntagabend gehört mir  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;

// ---------- Farben & kleine Helfer ----------
const HAIR = '#3A282D', SILBER = '#D9CDD1', MOND = '#F7E7C6', HOLZ = '#E9CBB8', HOLZD = '#C99C86', S = C.schwarz;
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;
const popIn = (n, t, t0, rot = 0, dy = 40) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * dy}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };
const fadeOut = (node, t, t0, t1) => { node.style.opacity = Math.min(+node.style.opacity, 1 - pr(t, t0, t1)); };

/** Die Erzählerin (53): Bob mit Silbersträhne, Bademantel. viewBox 0 0 300 380, Mund-Mitte bei (150 204).
 *  o.eyes 'open'|'closed'|'happy', o.mouth 'smile'|'soft'|'closed', o.look -1..1 */
function woman(o = {}) {
  const lx = (o.look ?? 0) * 6, robe = o.robe ?? C.weiss;
  const eye = x => o.eyes === 'closed'
    ? `<path d="M${x - 15} 152 Q${x} 163 ${x + 15} 152" fill="none" stroke="${S}" stroke-width="5.5" stroke-linecap="round"/><path d="M${x + 13} 154 l6 5 M${x - 13} 154 l-6 5" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>`
    : o.eyes === 'happy'
      ? `<path d="M${x - 15} 156 Q${x} 140 ${x + 15} 156" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`
      : `<ellipse cx="${x + lx}" cy="151" rx="9" ry="11.5" fill="${S}"/><circle cx="${x + lx + 3}" cy="146" r="3.2" fill="#fff"/><path d="M${x - 14} 140 Q${x} 132 ${x + 15} 139" fill="none" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>`;
  const m = o.mouth ?? 'smile';
  const mouth = m === 'closed'
    ? `<path d="M122 203 C132 194 142 193 150 197 C158 193 168 194 178 203 C166 205 158 204 150 205 C142 204 134 205 122 203Z" fill="${C.lippe}"/>
       <path d="M122 203 C134 205 142 204 150 205 C158 204 166 205 178 203 C170 216 160 220 150 220 C140 220 130 216 122 203Z" fill="${C.lippeHell}"/>
       <path d="M122 203 C134 205 142 204 150 205 C158 204 166 205 178 203" fill="none" stroke="${S}" stroke-opacity=".45" stroke-width="2.6" stroke-linecap="round"/>`
    : m === 'soft'
      ? `<path d="M130 202 Q150 212 170 202" fill="none" stroke="${C.lippe}" stroke-width="8" stroke-linecap="round"/>`
      : `<path d="M124 197 Q150 222 176 197 Q150 206 124 197Z" fill="${C.lippe}"/>`;
  return `<g>
    <path d="M58 168 C40 92 82 40 150 40 C218 40 262 92 242 168 L250 236 C222 252 78 252 50 236Z" fill="${HAIR}"/>
    <path d="M30 380 C30 316 84 284 150 284 C216 284 270 316 270 380Z" fill="${robe}"/>
    <rect x="130" y="226" width="40" height="66" rx="14" fill="${C.hautDunkel}"/>
    <path d="M118 286 L150 352 L182 286 C172 280 128 280 118 286Z" fill="${C.haut}"/>
    <path d="M96 292 C112 320 132 350 150 380 L118 380 C104 352 92 322 88 296Z" fill="${C.rosaTief}"/>
    <path d="M204 292 C188 320 168 350 150 380 L182 380 C196 352 208 322 212 296Z" fill="${C.rosaTief}"/>
    <ellipse cx="66" cy="160" rx="14" ry="20" fill="${C.hautDunkel}"/><ellipse cx="234" cy="160" rx="14" ry="20" fill="${C.haut}"/>
    <circle cx="64" cy="186" r="6" fill="${C.weiss}" stroke="${S}" stroke-width="2"/><circle cx="236" cy="186" r="6" fill="${C.weiss}" stroke="${S}" stroke-width="2"/>
    <ellipse cx="150" cy="150" rx="86" ry="96" fill="${C.haut}"/>
    <path d="M64 150 C60 84 104 54 160 58 C150 92 116 118 70 136Z" fill="${HAIR}"/>
    <path d="M100 76 C116 64 136 58 156 58 C140 80 122 98 96 112Z" fill="${SILBER}"/>
    <path d="M236 150 C236 96 208 66 168 60 C190 88 214 112 236 150Z" fill="${HAIR}"/>
    ${eye(116)}${eye(184)}
    <path d="M148 160 C145 175 144 181 153 183" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <path d="M110 196 Q106 206 112 214 M190 196 Q194 206 188 214" fill="none" stroke="${C.hautDunkel}" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="100" cy="186" rx="17" ry="9" fill="${C.rosaTief}" opacity=".45"/><ellipse cx="200" cy="186" rx="17" ry="9" fill="${C.rosaTief}" opacity=".45"/>
    ${mouth}
  </g>`;
}

/** Wanduhr, viewBox 0 0 300 300. Winkel in Grad (0 = 12 Uhr) */
const wallClock = (hA, mA) => `<circle cx="150" cy="150" r="128" fill="${C.weiss}" stroke="${S}" stroke-width="14"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2, r1 = i % 3 ? 102 : 94; return `<line x1="${150 + Math.sin(a) * r1}" y1="${150 - Math.cos(a) * r1}" x2="${150 + Math.sin(a) * 112}" y2="${150 - Math.cos(a) * 112}" stroke="${S}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>`; }).join('')}
  <line x1="150" y1="150" x2="${150 + Math.sin(hA * Math.PI / 180) * 58}" y2="${150 - Math.cos(hA * Math.PI / 180) * 58}" stroke="${S}" stroke-width="14" stroke-linecap="round"/>
  <line x1="150" y1="150" x2="${150 + Math.sin(mA * Math.PI / 180) * 88}" y2="${150 - Math.cos(mA * Math.PI / 180) * 88}" stroke="${C.beere}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="150" cy="150" r="11" fill="${S}"/>`;

/** Teetasse mit Untertasse, viewBox 0 0 240 200 */
const teacup = () => `<ellipse cx="116" cy="178" rx="104" ry="18" fill="${C.weiss}" stroke="${S}" stroke-width="6"/>
  <path d="M40 76 L190 76 C190 136 162 170 115 170 C68 170 40 136 40 76Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M188 96 C228 92 230 146 176 142" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="115" cy="78" rx="75" ry="12" fill="#C98E72" stroke="${S}" stroke-width="5"/>
  <path d="M150 78 L168 30" stroke="${S}" stroke-width="3"/><rect x="156" y="104" width="28" height="34" rx="3" fill="${C.rosaTief}" stroke="${S}" stroke-width="4" transform="rotate(8 170 121)"/>
  <path d="M62 120 C80 112 96 112 112 120" stroke="${C.rosaTief}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
/** Dampf, viewBox 0 0 120 160 */
const steam = (t, col = C.schwarz, op = .35) => [34, 78].map((x, i) => { let d = ''; for (let y = 150; y >= 14; y -= 8) d += (y === 150 ? 'M' : 'L') + (x + Math.sin(y / 20 - t * 3 + i * 2) * 9 * (1 - y / 300)).toFixed(1) + ' ' + y; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" opacity="${op}"/>`; }).join('');

/** Waschbecken mit Hahn, viewBox 0 0 260 220; w = Wasser 0..1, t für Tropfen */
const sink = (w, t) => {
  const drops = w > 0 ? [0, 1, 2].map(i => { const c = ((t * 1.6 + i / 3) % 1); return `<path d="M${150 + (i - 1) * 4} ${70 + c * 70} c4 6 6 9 6 12 a6 6 0 0 1 -12 0 c0 -3 2 -6 6 -12Z" fill="#9FD3E8" opacity="${w * (1 - c * .3)}"/>`; }).join('') : '';
  return `<rect x="122" y="14" width="22" height="58" rx="8" fill="${S}"/><path d="M122 30 L168 30 C178 30 182 38 182 48 L182 58 L164 58 L164 48 L130 48Z" fill="${S}"/>
  <rect x="100" y="6" width="48" height="14" rx="7" fill="${S}"/>
  ${drops}
  <path d="M14 112 L246 112 C240 176 196 206 130 206 C64 206 20 176 14 112Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="6" y="100" width="248" height="22" rx="11" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
  <ellipse cx="130" cy="150" rx="${70 * w + 1}" ry="${12 * w + 1}" fill="#BFE3F2" opacity="${w}"/>
  <path d="M50 140 C60 164 80 178 104 184" stroke="${C.rosa}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
};

/** Cremetiegel, viewBox 0 0 240 220; lid 0..1 (Deckel hebt sich) */
const creamJar = (lid) => `<g transform="translate(${lid * 54} ${-lid * 58}) rotate(${lid * 18} 120 70)">
    <rect x="40" y="52" width="160" height="40" rx="12" fill="${S}"/><rect x="56" y="60" width="60" height="9" rx="4.5" fill="#fff" opacity=".25"/></g>
  <path d="M36 96 L204 96 L198 192 C198 204 42 204 42 192Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
  <ellipse cx="120" cy="98" rx="80" ry="12" fill="${C.weiss}" stroke="${S}" stroke-width="5" opacity="${clamp(lid * 3)}"/>
  <path d="M100 96 C110 84 128 84 136 96" fill="${C.weiss}" stroke="${S}" stroke-width="4" opacity="${clamp(lid * 3)}"/>
  <rect x="66" y="128" width="108" height="34" rx="8" fill="${C.weiss}" opacity=".75"/>`;

/** Fingerspitze, viewBox 0 0 90 260 (Spitze oben) */
const finger = () => `<path d="M14 260 L14 50 C14 18 30 4 45 4 C60 4 76 18 76 50 L76 260Z" fill="${C.haut}" stroke="${C.hautDunkel}" stroke-width="5"/>
  <path d="M28 52 C28 30 36 20 45 20 C54 20 62 30 62 52 C62 66 28 66 28 52Z" fill="${C.rosaHell}" stroke="${C.hautDunkel}" stroke-width="3"/>
  <path d="M26 130 Q45 138 64 130 M30 150 Q45 156 60 150" stroke="${C.hautDunkel}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

/** Kerze, viewBox 0 0 200 360; f = Flacker-Phase */
const candle = (t) => {
  const fx = Math.sin(t * 9) * 4 + Math.sin(t * 23) * 2, fs = 1 + Math.sin(t * 13) * .06 + Math.sin(t * 31) * .03;
  return `<circle cx="100" cy="92" r="${92 + Math.sin(t * 7) * 4}" fill="${MOND}" opacity=".10"/><circle cx="100" cy="92" r="${58 + Math.sin(t * 9) * 3}" fill="${MOND}" opacity=".14"/>
  <g transform="translate(100 120) scale(1 ${fs}) translate(-100 -120)"><path d="M100 ${40} C${118 + fx} 76 122 104 100 122 C78 104 ${82 + fx} 76 100 40Z" fill="${MOND}"/>
  <path d="M100 76 C108 92 108 106 100 116 C92 106 92 92 100 76Z" fill="#F2B36B"/></g>
  <line x1="100" y1="116" x2="100" y2="136" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
  <path d="M56 136 L144 136 L144 330 L56 330Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M56 136 C70 150 80 140 90 156 C96 166 104 150 114 148 C124 146 132 160 144 136" fill="none" stroke="${S}" stroke-width="4" stroke-opacity=".25"/>
  <path d="M72 170 L72 300" stroke="${C.rosa}" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="100" cy="334" rx="70" ry="14" fill="${C.rosaTief}" stroke="${S}" stroke-width="5"/>`;
};

/** Nachttisch, viewBox 0 0 640 300 */
const nightstand = () => `<rect x="20" y="0" width="600" height="40" rx="12" fill="${HOLZ}" stroke="${S}" stroke-width="7"/>
  <rect x="50" y="40" width="540" height="230" fill="${HOLZ}" stroke="${S}" stroke-width="7"/>
  <rect x="80" y="70" width="480" height="80" rx="8" fill="none" stroke="${S}" stroke-width="5"/><rect x="290" y="102" width="60" height="14" rx="7" fill="${S}"/>
  <rect x="80" y="170" width="480" height="80" rx="8" fill="none" stroke="${S}" stroke-width="5"/><rect x="290" y="202" width="60" height="14" rx="7" fill="${S}"/>
  <rect x="70" y="270" width="26" height="30" fill="${S}"/><rect x="544" y="270" width="26" height="30" fill="${S}"/>`;

// ---------- Szenen ----------
// s1: Wohnung am Sonntagabend – Uhr springt auf 21 Uhr, Küchentür fällt zu, sie atmet auf (lächelt). Hook statisch ab Frame 0.
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const hook = bigText(root, 'Sonntagabend, 21 Uhr. Das gehört nur *mir.*', { x: 84, y: 196, w: 930, size: 112 });
  hook.update(99);
  // Wand-Deko: Bilderrahmen
  const frame = svg(`<rect x="6" y="6" width="168" height="208" fill="${C.weiss}" stroke="${S}" stroke-width="10"/><path d="M30 170 C60 110 90 150 110 120 C126 98 140 120 150 110" fill="none" stroke="${C.rosaTief}" stroke-width="10" stroke-linecap="round"/><circle cx="120" cy="66" r="20" fill="${C.rosa}"/>`, {}, root, '0 0 180 220', 150, 183);
  const clock = svg(wallClock(270, 330), {}, root, '0 0 300 300', 250, 250);
  // Küchentür rechts
  const DX = 640, DY = 600, DW = 330, DH = 720;
  const kitchen = el('div', { left: DX + 'px', top: DY + 'px', width: DW + 'px', height: DH + 'px', background: C.weiss, overflow: 'hidden', border: `12px solid ${S}`, boxSizing: 'border-box' }, root);
  svg(`<rect x="0" y="380" width="306" height="16" fill="${S}"/><rect x="0" y="396" width="306" height="310" fill="${C.rosa}"/>
    <rect x="30" y="430" width="110" height="120" rx="8" fill="none" stroke="${S}" stroke-width="5"/><rect x="166" y="430" width="110" height="120" rx="8" fill="none" stroke="${S}" stroke-width="5"/>
    <path d="M190 330 L270 330 L262 380 L198 380Z" fill="${S}"/><rect x="214" y="318" width="32" height="14" rx="7" fill="${S}"/>
    <path d="M40 120 L140 120 L140 230 L40 230Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="5"/><path d="M90 120 L90 230 M40 175 L140 175" stroke="${S}" stroke-width="4"/>
    ${sparkle(230, 220, 1.1, C.rosaTief)}${sparkle(260, 170, .6, C.rosaTief)}`, { left: 0, top: 0 }, kitchen, '0 0 306 696', 306, 696);
  const door = el('div', { left: DX + 'px', top: DY + 'px', width: DW + 'px', height: DH + 'px', background: C.rosaTief, border: `12px solid ${S}`, boxSizing: 'border-box', transformOrigin: '0% 50%' }, root);
  el('div', { left: '36px', top: '50px', width: '234px', height: '250px', border: `6px solid ${S}`, borderRadius: '6px', opacity: .35 }, door);
  el('div', { left: '36px', top: '360px', width: '234px', height: '280px', border: `6px solid ${S}`, borderRadius: '6px', opacity: .35 }, door);
  el('div', { left: '250px', top: '330px', width: '22px', height: '62px', borderRadius: '11px', background: S }, door);
  const me = svg(woman({ eyes: 'open', mouth: 'soft', look: .8 }), {}, root, '0 0 300 380', 430, 545);
  const meHappy = svg(woman({ eyes: 'happy', mouth: 'smile' }), {}, root, '0 0 300 380', 430, 545);
  const floor = el('div', { left: 0, top: '1316px', width: '1080px', height: '604px', background: C.rosa }, root);
  el('div', { left: 0, top: 0, width: '1080px', height: '14px', background: S }, floor);
  const sp = svg(sparkle(30, 40, 1) + sparkle(110, 16, .6) + sparkle(90, 90, .5, C.beere), {}, root, '0 0 140 120', 140, 120);
  const tClose = D * .52;
  const me2 = note(root, 'jetzt: ich.', { x: 372, y: 600, r: -6, t0: D * .74, size: 76, arrow: [-40, 110], ax: 30, ay: 80 });
  return (t) => {
    me2.update(t);
    place(frame, 170, 1000, 1, -3);
    // Uhr: 20:58 -> 21:00 mit kleinem Ruck
    const j = pr(t, .7, 1.1, ease.outElastic);
    clock.querySelector('svg').innerHTML = wallClock(lerp(269, 270, j), lerp(348, 360, j));
    place(clock, 210, 700, 1, 0);
    // Tür: offen -> fällt zu
    const k = pr(t, tClose, tClose + .5, ease.outBack);
    door.style.transform = `perspective(1400px) rotateY(${lerp(-62, 0, k)}deg)`;
    door.style.left = DX + 'px'; door.style.top = DY + 'px';
    const thump = Math.sin(clamp((t - tClose - .35) / .25) * Math.PI) * 5;
    // Sie: erst Blick zur Tür, nach dem Zufallen glücklich
    const h = pr(t, tClose + .45, tClose + .7);
    place(me, 410, 1050 + thump * .3 + noise(t, 1) * 2, 1, 1, 1 - h);
    place(meHappy, 410, 1050 + noise(t, 1) * 2 - Math.sin(clamp((t - tClose - .5) / .5) * Math.PI) * 10, 1, -1, h);
    place(sp, 600, 760, pr(t, tClose + .55, tClose + .95, ease.outBack) * (1 + Math.sin(t * 3) * .06), Math.sin(t * 1.4) * 8, clamp((t - tClose - .55) / .15));
  };
}};

// s2: Drei Schritte, im Takt der Worte
SCENES.s2 = { bg: C.weiss, build(root, ctx) {
  const D = ctx.dur;
  const head = note(root, 'erst mal:', { x: 100, y: 214, r: -4, t0: 0, size: 82 });
  const times = [.05, D * .44, D * .76];
  const rows = [
    { word: 'Tee.', sub: 'auf den Nachttisch', y: 520 },
    { word: 'Gesicht.', sub: 'waschen', y: 820 },
    { word: 'Creme.', sub: 'sanft einmassieren', y: 1120 },
  ].map((r, i) => {
    const box = el('div', { left: 0, top: (r.y - 150) + 'px', width: '1080px', height: '300px' }, root);
    el('div', { left: '90px', top: '20px', width: '260px', height: '260px', borderRadius: '50%', background: i === 1 ? C.rosaHell : C.rosa }, box);
    el('div', { left: '410px', top: '62px', fontFamily: F.display, fontSize: '128px', lineHeight: 1, color: S, letterSpacing: '-1px' }, box, r.word);
    el('div', { left: '418px', top: '196px', fontFamily: F.hand, fontWeight: 700, fontSize: '58px', color: C.beere, transform: 'rotate(-2deg)', whiteSpace: 'nowrap' }, box, r.sub);
    return box;
  });
  const cup = svg(teacup(), {}, root, '0 0 240 200', 220, 183);
  const st = svg('', {}, root, '0 0 120 160', 90, 120);
  const sk = svg('', {}, root, '0 0 260 220', 230, 195);
  const jar = svg('', {}, root, '0 0 240 220', 210, 193);
  // feine Trennlinien
  const l1 = el('div', { left: '110px', top: '668px', width: '860px', height: '4px', background: S, opacity: .1 }, root);
  const l2 = el('div', { left: '110px', top: '968px', width: '860px', height: '4px', background: S, opacity: .1 }, root);
  return (t) => {
    head.update(t);
    rows.forEach((r, i) => popIn(r, t, times[i], 0, 60));
    const a = clamp((t - times[0]) / .12), b = clamp((t - times[1]) / .12), c = clamp((t - times[2]) / .12);
    const ka = pr(t, times[0], times[0] + .45, ease.outBack), kb = pr(t, times[1], times[1] + .45, ease.outBack), kc = pr(t, times[2], times[2] + .45, ease.outBack);
    place(cup, 220, 548, .7 + .3 * ka, 0, a);
    st.querySelector('svg').innerHTML = steam(t);
    place(st, 214, 440, 1, 0, a * pr(t, times[0] + .3, times[0] + .8));
    sk.querySelector('svg').innerHTML = sink(pr(t, times[1] + .3, times[1] + .9), t);
    place(sk, 220, 820, .7 + .3 * kb, 0, b);
    jar.querySelector('svg').innerHTML = creamJar(pr(t, times[2] + .25, times[2] + .7, ease.outBack));
    place(jar, 220, 1128, .7 + .3 * kc, 0, c);
    l1.style.opacity = .1 * b; l2.style.opacity = .1 * c;
  };
}};

// s3: Zum Schluss das Tape – legt sich auf die geschlossenen Lippen, zwei Fingerspitzen drücken kurz an
SCENES.s3 = { bg: C.rosa, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Zum Schluss: das *Tape.*', { x: 84, y: 196, w: 930, size: 116, t0: 0, step: .06 });
  const FW = 600, FH = FW * 380 / 300, sc = FW / 300, FX = 540, FY = 930;
  const face = svg(woman({ eyes: 'closed', mouth: 'closed' }), {}, root, '0 0 300 380', FW, FH);
  const mx = FX - FW / 2 + 150 * sc, my = FY - FH / 2 + 204 * sc;
  const TW = 100 * sc * 400 / 340;
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', TW, TW);
  const f1 = svg(finger(), {}, root, '0 0 90 260', 58, 168);
  const f2 = svg(finger(), {}, root, '0 0 90 260', 58, 168);
  // Schritte als Handschrift links/rechts
  const steps = [
    { txt: 'trocken', x: 40, y: 560, r: -5, at: .3 }, { txt: 'Lippen zu', x: 40, y: 700, r: -3, at: .48 },
    { txt: 'drüber', x: 790, y: 560, r: 4, at: .66 }, { txt: 'andrücken', x: 730, y: 700, r: 3, at: .82 },
  ].map((s, i) => note(root, (i + 1) + ' ' + s.txt, { x: s.x, y: s.y, r: s.r, t0: D * s.at, size: 64 }));
  const tL = D * .64, tP = D * .84;
  return (t) => {
    head.update(t);
    steps.forEach(s => s.update(t));
    place(face, FX, FY + noise(t, 2) * 2, 1, 0);
    // Tape fliegt ein (Bogen von oben rechts) und landet exakt auf den Lippen
    const k = pr(t, tL - .9, tL, ease.inOutCubic);
    const press = Math.sin(clamp((t - tP - .2) / .35) * Math.PI);
    const tx = lerp(1020, mx, k), ty = lerp(my + 60, my, k) - Math.sin(k * Math.PI) * 120;
    place(tape, tx, ty + noise(t, 2) * 2 * k, lerp(1.3, 1, k) * (1 - press * .04), lerp(26, 0, k), clamp((t - tL + 1.0) / .2));
    // Finger: kommen von unten, drücken, gehen
    const fin = pr(t, tP, tP + .35, ease.outCubic) * (1 - pr(t, tP + .75, tP + 1.1, ease.inCubic));
    const tip = TW * .3, half = 80, a = 62 * Math.PI / 180;
    const dist = lerp(260, 0, fin) - press * 6;
    const fx = (sgn) => mx + sgn * (tip + (half + dist) * Math.sin(a)), fy = my + 8 + (half + dist) * Math.cos(a);
    place(f1, fx(-1), fy, 1, 62, fin > .01 ? 1 : 0);
    place(f2, fx(1), fy, 1, -62, fin > .01 ? 1 : 0);
  };
}};

// s4: Nacht – der Mond geht auf, die Pflege-Mitte schimmert rosa
SCENES.s4 = { bg: C.nacht, build(root, ctx) {
  const D = ctx.dur;
  const pre = bigText(root, 'In der Mitte: eine *Lippenmaske.*', { x: 84, y: 196, w: 930, size: 108, color: C.weiss, accent: C.rosa, t0: 0, step: .05 });
  const head = bigText(root, 'Pflege, während ich *schlafe.*', { x: 84, y: 196, w: 930, size: 108, color: C.weiss, accent: C.rosa, t0: D * .52, step: .06 });
  const stars = svg([[40, 60, .9], [180, 20, .6], [300, 90, 1.1], [420, 30, .7], [560, 80, .8]].map(([x, y, s]) => ART.star(x, y, s)).join(''), {}, root, '0 0 600 120', 600, 120);
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 230, 230);
  const rings = svg('', {}, root, '0 0 600 400', 900, 600);
  const TS = 960;
  const tape = svg(ART.tape(true) + `<defs><clipPath id="pad12"><rect x="108" y="166" width="184" height="68" rx="34"/></clipPath></defs><g clip-path="url(#pad12)"><rect id="sh12" x="0" y="150" width="40" height="100" fill="#fff" opacity=".45" transform="skewX(-20)"/></g>`, {}, root, '0 0 400 400', TS, TS);
  const sh = tape.querySelector('#sh12');
  const glints = svg(sparkle(40, 40, 1.1) + sparkle(250, 20, .7, C.rosa) + sparkle(470, 50, .9), {}, root, '0 0 520 100', 520, 100);
  const lab = (txt, x, y, bg) => el('div', { left: x + 'px', top: y + 'px', padding: '12px 34px 16px', background: bg, color: S, fontFamily: F.sans, fontWeight: 700, fontSize: '56px', borderRadius: '46px', whiteSpace: 'nowrap' }, root, txt);
  const L = [lab('Kollagen', 130, 1110, C.weiss), lab('Hyaluronsäure', 430, 1210, C.rosa)];
  return (t) => {
    pre.update(t); pre.node.style.opacity = 1 - pr(t, D * .46, D * .52);
    head.update(t);
    // Mond steigt auf
    const m = pr(t, 0, D * .8, ease.outCubic);
    place(moon, 830, lerp(980, 600, m), 1, lerp(-20, -6, m), .3 + .7 * pr(t, 0, .6));
    place(stars, 540, 560, 1, 0, .5 + Math.sin(t * 2.2) * .2);
    // Tape ruhig in der Mitte
    const kt = pr(t, .1, .8);
    place(tape, 540, 880, lerp(.92, 1, kt), -3 + Math.sin(t * .9) * 1, kt);
    // Schimmer über die Pflege-Mitte (wiederholt)
    const sw = ((t - .6) % 1.8 + 1.8) % 1.8 / 1.8;
    sh.setAttribute('x', (lerp(60, 380, ease.inOutSine(clamp(sw * 1.6)))).toFixed(1));
    // weiche Ringe aus der Mitte
    const g = pr(t, D * .2, D * .2 + .5);
    rings.querySelector('svg').innerHTML = [0, 1, 2].map(i => { const ph = ((t * .55 + i / 3) % 1); return `<ellipse cx="300" cy="200" rx="${130 + ph * 170}" ry="${52 + ph * 100}" fill="none" stroke="${C.rosa}" stroke-width="5" opacity="${(1 - ph) * .6 * g}"/>`; }).join('');
    place(rings, 540, 880, 1, -3);
    place(glints, 540, 760, 1, 0, g * (.6 + Math.sin(t * 3) * .4));
    popIn(L[0], t, D * .3, -3); popIn(L[1], t, D * .4, 2);
  };
}};

// s5: Kerzenlicht am Nachttisch, ein Herz steigt auf
SCENES.s5 = { bg: C.nachtHell, build(root, ctx) {
  const D = ctx.dur;
  const n = note(root, 'mit 53:', { x: 96, y: 206, r: -4, t0: 0, size: 86, color: C.rosa });
  const head = bigText(root, 'Ohne schlechtes *Gewissen.*', { x: 84, y: 300, w: 930, size: 116, color: C.weiss, accent: C.rosa, t0: .25, step: .07 });
  const stand = svg(nightstand(), {}, root, '0 0 640 300', 640, 300);
  const cnd = svg('', {}, root, '0 0 200 360', 200, 360);
  const cup = svg(teacup(), {}, root, '0 0 240 200', 190, 158);
  const st = svg('', {}, root, '0 0 120 160', 80, 107);
  const book = svg(`<rect x="0" y="0" width="230" height="34" rx="4" fill="${C.rosaTief}" stroke="${S}" stroke-width="5"/><rect x="12" y="34" width="210" height="28" rx="4" fill="${C.weiss}" stroke="${S}" stroke-width="5"/><path d="M30 12 L120 12" stroke="${S}" stroke-width="4" stroke-opacity=".4"/>`, {}, root, '0 0 230 62', 230, 62);
  const heart = svg(ART.heart(C.beere), {}, root, '0 0 400 400', 150, 150);
  return (t) => {
    n.update(t); head.update(t);
    place(stand, 540, 1180, 1, 0);
    cnd.querySelector('svg').innerHTML = candle(t);
    place(cnd, 400, 850, 1, 0);
    place(book, 680, 1000, 1, -2);
    place(cup, 690, 896, 1, 0);
    st.querySelector('svg').innerHTML = steam(t, C.weiss, .35);
    place(st, 684, 790, 1, 0);
    const h = pr(t, D * .45, D * .45 + .5, ease.outBack);
    place(heart, 560 + Math.sin(t * 1.6) * 8, lerp(820, 690, h) - Math.sin(t * 2) * 6, h * (1 + Math.sin(t * 5) * .05), 10, clamp((t - D * .45) / .12));
  };
}};

// s6: Kalenderblatt blättert von Sonntag auf Montag, die Lampe geht aus
SCENES.s6 = { bg: C.rosaHell, build(root, ctx) {
  const D = ctx.dur;
  const head = bigText(root, 'Montag kann *kommen.*', { x: 84, y: 196, w: 930, size: 124, t0: 0, step: .06 });
  const lampOn = (on) => `<circle cx="150" cy="150" r="140" fill="${MOND}" opacity="${.35 * on}"/><circle cx="150" cy="150" r="96" fill="${MOND}" opacity="${.35 * on}"/>
    <path d="M86 70 L214 70 L240 170 L60 170Z" fill="${on > .5 ? '#FFF1D6' : '#E8D9CC'}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="142" y="170" width="16" height="150" fill="${S}"/><rect x="90" y="316" width="120" height="20" rx="10" fill="${S}"/>`;
  const lamp = svg(lampOn(1), {}, root, '0 0 300 340', 260, 295);
  const CW = 540, CH = 600, CX = 470, CY = 900;
  const cal = el('div', { left: (CX - CW / 2) + 'px', top: (CY - CH / 2) + 'px', width: CW + 'px', height: CH + 'px' }, root);
  const page = (day, sub, z) => {
    const p = el('div', { left: 0, top: 0, width: CW + 'px', height: CH + 'px', background: C.weiss, border: `8px solid ${S}`, boxSizing: 'border-box', borderRadius: '18px', overflow: 'hidden', backfaceVisibility: 'hidden', transformOrigin: '50% 0%', zIndex: z }, cal);
    el('div', { left: 0, top: 0, width: '100%', height: '120px', background: S }, p);
    el('div', { left: 0, top: '200px', width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: '128px', color: S, letterSpacing: '-2px' }, p, day);
    el('div', { left: 0, top: '380px', width: '100%', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '68px', color: C.beere, transform: 'rotate(-3deg)' }, p, sub);
    return p;
  };
  page('Montag', 'neue Woche', 1);
  const sun = page('Sonntag', 'für mich', 2);
  const rings = el('div', { left: (CX - CW / 2) + 'px', top: (CY - CH / 2 - 40) + 'px', width: CW + 'px', height: '90px', zIndex: 5 }, root);
  [130, 410].forEach(x => el('div', { left: (x - 16) + 'px', top: 0, width: '32px', height: '90px', borderRadius: '16px', background: C.rosaTief, border: `6px solid ${S}`, boxSizing: 'border-box' }, rings));
  return (t) => {
    head.update(t);
    place(cal, CX, CY, 1, 0);
    const f = pr(t, .25, .85, ease.inOutCubic);
    sun.style.transform = `perspective(1600px) rotateX(${f * 170}deg)`;
    sun.style.opacity = f > .55 ? 0 : 1;
    const off = t > D * .7 ? 1 : 0;
    lamp.querySelector('svg').innerHTML = lampOn(1 - off);
    place(lamp, 880, 1060, 1, 0);
  };
}};
