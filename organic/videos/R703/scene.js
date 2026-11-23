/* R703 – Suchspiel „Finde den anderen“ (3 Level). [KI]
 * Oberer Teil (GAME) ist reine Logik ohne DOM: Zeiten, Raster, Abweichler, Zeichnung.
 * Er wird auch von make_sfx.js und check.js per require() benutzt – Bild, Ton und Prüfung haben dieselbe Quelle.
 * Alles deterministisch aus t; Zufall nur über mulberry32 mit festem Seed. */
const GAME = (() => {
  const TOTAL = 29.0;                                   // Gesamtdauer in s (= voice_duration + 0.9)
  const AREA = { x0: 60, x1: 950, y0: 566, y1: 1520 };  // Rasterfläche (Sicherheitszonen eingehalten)
  const AFTER = 22.4;                                   // „Level 3: Gesehen?“
  const END = 24.0;                                     // Schlussfrage
  // S = Levelstart (Whip), T0 = Timer startet, R = Auflösung, X = Level verlässt die Bühne
  // odd = [Zeile, Spalte] nullbasiert
  const LV = [
    { n: 1, tag: 'leicht', cols: 7, rows: 5, S: 0, T0: 0, dur: 5, R: 5, X: 6.3, odd: [3, 4], kind: 'pink', bpm: 110, wob: 3.0, label: 'Pink statt Rot' },
    { n: 2, tag: 'mittel', cols: 10, rows: 7, S: 6.3, T0: 6.85, dur: 6, R: 12.85, X: 14.2, odd: [4, 2], kind: 'flip', bpm: 124, wob: 2.2, label: 'Spitze andersrum' },
    { n: 3, tag: 'brutal', cols: 14, rows: 10, S: 14.2, T0: 14.75, dur: 7, R: 21.75, X: END, odd: [6, 10], kind: 'kiss', bpm: 138, wob: 1.4, label: 'kein Kussmund' },
  ];
  const UH = 180, UW = 64;                              // Lippenstift in Einheiten (Höhe, Breite)

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /** Raster eines Levels: Positionen, Maßstab, Abweichler-Flag, Wackel-Phasen */
  function layout(L) {
    const cw = (AREA.x1 - AREA.x0) / L.cols, ch = (AREA.y1 - AREA.y0) / L.rows;
    const sc = Math.min(ch * .84 / UH, cw * .62 / UW);
    const rnd = mulberry32(7030 + L.n * 97);
    const items = [];
    for (let r = 0; r < L.rows; r++) for (let c = 0; c < L.cols; c++) {
      const cx = AREA.x0 + (c + .5) * cw, by = AREA.y0 + (r + 1) * ch - ch * .075;
      items.push({ r, c, cx, by, sc, odd: r === L.odd[0] && c === L.odd[1], ph: rnd() * Math.PI * 2, sp: .8 + rnd() * .7, ph2: rnd() * Math.PI * 2 });
    }
    return { cw, ch, sc, items };
  }
  const variant = (L, odd) => !odd ? { grad: 'r', flip: false, kiss: true }
    : L.kind === 'pink' ? { grad: 'p', flip: false, kiss: true }
      : L.kind === 'flip' ? { grad: 'r', flip: true, kiss: true }
        : { grad: 'o', flip: false, kiss: false };

  /** Tick-Zeitpunkte eines Levels (gleich für Bild-Puls und Ton). u = 0 normal, 1 vorletzte Sekunde, 2 letzte Sekunde */
  function ticks(L) {
    const out = [];
    for (let s = 0; s <= L.dur - 3; s++) out.push({ t: L.T0 + s, u: 0, i: s });
    const a = L.T0 + L.dur - 2;
    [0, .5].forEach((d, i) => out.push({ t: a + d, u: 1, i }));
    [1, 1.25, 1.5, 1.75].forEach((d, i) => out.push({ t: a + d, u: 2, i }));
    return out;
  }

  const GRAD = {
    gold: [[0, '#5E4519'], [.16, '#B8924A'], [.32, '#F8E7B8'], [.5, '#D6B168'], [.8, '#96712F'], [1, '#4E3912']],
    rim: [[0, '#7E5F25'], [.28, '#FFF4D2'], [.55, '#E3C27C'], [1, '#62481A']],
    inner: [[0, '#857760'], [.3, '#FCF5E6'], [.6, '#D5C7AD'], [1, '#6F624C']],
    r: [[0, '#62061A'], [.2, '#CC0E2C'], [.38, '#FF3D57'], [.58, '#D10F2E'], [1, '#56040F']],
    p: [[0, '#8A1552'], [.2, '#FF4FA3'], [.38, '#FFA6D2'], [.58, '#FF57A8'], [1, '#761046']],
    o: [[0, '#62061A'], [.2, '#CE1525'], [.38, '#FF4450'], [.58, '#D31627'], [1, '#56040F']],  // Level 3: Rot minimal wärmer
  };
  const FACE = { r: '#FF7A8C', p: '#FFC4E1', o: '#FF7F86' };
  function defs(p) {
    return '<defs>' + Object.keys(GRAD).map(k => `<linearGradient id="${p}${k}" x1="0" x2="1" y1="0" y2="0">${GRAD[k].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`).join('') + '</defs>';
  }
  /** Ein Lippenstift, Ursprung = Mitte der Standfläche, nach oben negativ. v = {grad, flip, kiss} */
  function lip(p, v) {
    const s = v.flip ? -1 : 1, g = v.grad;
    const body = `M${-17 * s} -112 L${-17 * s} -146 C${-17 * s} -152 ${-14 * s} -156 ${-9 * s} -159 L${7 * s} -172 C${13 * s} -176 ${17 * s} -173 ${17 * s} -166 L${17 * s} -112 Z`;
    const face = `M${-17 * s} -146 C${-17 * s} -152 ${-14 * s} -156 ${-9 * s} -159 L${7 * s} -172 C${13 * s} -176 ${17 * s} -173 ${17 * s} -166 L${17 * s} -159 C${6 * s} -152 ${-6 * s} -145 ${-17 * s} -138 Z`;
    return `<ellipse cx="0" cy="1" rx="37" ry="5.5" fill="#000" opacity=".55"/>
      <path d="${body}" fill="url(#${p}${g})"/>
      <path d="${face}" fill="${FACE[g]}" opacity=".62"/>
      <rect x="-22" y="-114" width="44" height="28" fill="url(#${p}inner)"/>
      <rect x="-22" y="-114" width="44" height="3" fill="#fff" opacity=".45"/>
      <rect x="-22" y="-92" width="44" height="6" fill="#2a1d0c" opacity=".35"/>
      <rect x="-28" y="-80" width="56" height="80" rx="5" fill="url(#${p}gold)"/>
      <rect x="-28" y="-9" width="56" height="9" rx="4" fill="#3a2a10" opacity=".4"/>
      <rect x="-31" y="-89" width="62" height="13" rx="4" fill="url(#${p}rim)"/>
      <rect x="-28" y="-76" width="56" height="2.5" fill="#2a1d0c" opacity=".45"/>
      ${v.kiss ? `<g transform="translate(0 -40)"><path d="M-15 0 C-10 -6 -5 -9 -2 -5.5 C-1 -4.5 1 -4.5 2 -5.5 C5 -9 10 -6 15 0 C8 1.6 -8 1.6 -15 0Z" fill="#B00E2A"/><path d="M-15 0 C-8 2.4 8 2.4 15 0 C10 8.5 -10 8.5 -15 0Z" fill="#C4122F"/></g>` : ''}
      <g class="gl"><rect x="-11" y="-150" width="5" height="34" rx="2.5" fill="#fff" opacity=".5"/><rect x="-19" y="-72" width="5.5" height="58" rx="2.7" fill="#fff" opacity=".42"/></g>`;
  }
  return { TOTAL, AREA, AFTER, END, LV, UH, UW, mulberry32, layout, variant, ticks, defs, lip };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = GAME;

if (typeof DT !== 'undefined') {
  const { el, svg, C, F, tw, pr, ease, clamp, lerp } = DT;
  const { AREA, AFTER, END, LV } = GAME;
  const PINK = '#FF6FA8', ROT = '#FF2B3D', GOLD = '#E3C27C', BG = '#120C15';
  const MX = (AREA.x0 + AREA.x1) / 2;   // optische Mitte 505
  let UID = 0;

  function stage(root) {
    el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: `radial-gradient(ellipse 85% 60% at 47% 46%, #2B1B2F 0%, #1C1420 48%, #0B070D 100%)` }, root);
  }

  /** Raster eines Levels als ein SVG */
  function buildGrid(root, L, opt = {}) {
    const p = 'g' + (++UID) + '_', lay = opt.lay || GAME.layout(L);
    const wrap = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
    let m = GAME.defs(p);
    if (!opt.noShelf) for (let r = 0; r < L.rows; r++) {
      const y = AREA.y0 + (r + 1) * lay.ch - lay.ch * .075 + 3 * lay.sc;
      m += `<rect x="${AREA.x0 + 6}" y="${y}" width="${AREA.x1 - AREA.x0 - 12}" height="2" fill="${GOLD}" opacity=".2"/>`;
    }
    lay.items.forEach(it => { m += `<g class="it">${GAME.lip(p, GAME.variant(L, it.odd))}</g>`; });
    wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible">${m}</svg>`;
    const gs = [...wrap.querySelectorAll('g.it')], gl = gs.map(g => g.querySelector('.gl'));
    const odd = lay.items.find(i => i.odd);
    return {
      wrap, lay, odd,
      /** t = Zeit, dim = Deckkraft der normalen, oddO = Deckkraft Abweichler, oddS = Zusatz-Skalierung Abweichler */
      update(t, dim = 1, oddO = 1, oddS = 1) {
        const pos = ((t % 3.4) / 1.5) * 2300 - 300;
        lay.items.forEach((it, i) => {
          const rot = Math.sin(t * 1.9 * it.sp + it.ph) * L.wob, bob = Math.sin(t * 2.6 * it.sp + it.ph2) * 1.6 * lay.sc * 2;
          const s = lay.sc * (it.odd ? oddS : 1);
          gs[i].setAttribute('transform', `translate(${it.cx.toFixed(2)} ${(it.by + bob).toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)})`);
          gs[i].setAttribute('opacity', it.odd ? oddO : dim);
          const d = (it.cx + it.by * .55 - pos) / 130;
          gl[i].setAttribute('opacity', (.62 + .38 * Math.exp(-d * d)).toFixed(3));
        });
      }
    };
  }

  /** Dreizeiliger Kopf-Text, links, *wort* = Pink */
  function headBlock(root, lines, size = 86) {
    const b = el('div', { left: '60px', top: '196px', width: '680px', fontFamily: F.display, fontSize: size + 'px', lineHeight: .92, letterSpacing: '-1.5px', color: C.weiss, whiteSpace: 'nowrap', transformOrigin: '0 50%' }, root);
    lines.forEach(l => el('div', { position: 'relative' }, b, l.replace(/\*([^*]+)\*/g, `<span style="color:${PINK}">$1</span>`)));
    return b;
  }

  SCENES.s1 = {
    bg: BG, paper: false, build(root) {
      stage(root);
      const grids = LV.map(L => buildGrid(root, L));

      // ---- Markierung (Kreis + Handnotiz) je Level ----
      const marks = LV.map((L, i) => {
        const o = grids[i].odd, sc = grids[i].lay.sc, cy = o.by - 90 * sc, rx = 62 * sc + 14, ry = 104 * sc + 16;
        const d = `M ${o.cx - rx * .2} ${cy - ry} C ${o.cx + rx * 1.25} ${cy - ry * 1.08} ${o.cx + rx * 1.3} ${cy + ry * 1.02} ${o.cx} ${cy + ry} C ${o.cx - rx * 1.3} ${cy + ry * 1.0} ${o.cx - rx * 1.32} ${cy - ry * .95} ${o.cx + rx * .12} ${cy - ry * 1.04}`;
        const s = svg(`<path d="${d}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="${L.n === 3 ? 13 : 15}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          <path d="${d}" fill="none" stroke="${L.n === 3 ? '#fff' : PINK}" stroke-width="${L.n === 3 ? 7 : 9}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
        const left = o.cx > MX;
        const lab = el('div', { left: (left ? o.cx - rx - 26 - 520 : o.cx + rx + 26) + 'px', top: (cy - (L.n === 3 ? 34 : 52)) + 'px', width: '520px', textAlign: left ? 'right' : 'left', fontFamily: F.hand, fontWeight: 700, fontSize: (L.n === 3 ? 58 : 84) + 'px', lineHeight: 1, color: C.weiss, whiteSpace: 'nowrap', textShadow: '0 3px 0 #000, 0 0 18px #000, 0 0 18px #000', transformOrigin: left ? '100% 50%' : '0 50%' }, root, L.label);
        return { s, ps: s.querySelectorAll('path'), lab, cx: o.cx, cy };
      });

      // ---- Kopf: Hook je Level ----
      const heads = [
        headBlock(root, ['Ein Lippenstift', 'ist *anders.*', 'Findest du ihn?']),
        headBlock(root, ['Gleiche Farbe.', 'Trotzdem ist', 'einer *anders.*']),
        headBlock(root, ['Level 3', 'ist *gemein.*', 'Schau genau hin.']),
      ];

      // ---- Timer-Ring rechts neben der Hook ----
      const RC = 2 * Math.PI * 74;
      const ring = svg(`<circle cx="100" cy="100" r="92" fill="#0B070D"/><circle cx="100" cy="100" r="74" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="15"/>
        <circle class="pg" cx="100" cy="100" r="74" fill="none" stroke="${PINK}" stroke-width="15" stroke-linecap="butt" stroke-dasharray="${RC}" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>`, { left: '742px', top: '212px' }, root, '0 0 200 200', 200, 200);
      const pg = ring.querySelector('.pg');
      const num = el('div', { left: 0, top: '38px', width: '200px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '112px', lineHeight: 1, color: C.weiss, letterSpacing: '-3px' }, ring, '5');
      const okBadge = svg(`<circle cx="100" cy="100" r="92" fill="${PINK}"/><path d="M56 104 L88 134 L146 68" fill="none" stroke="${BG}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`, { left: '742px', top: '212px' }, root, '0 0 200 200', 200, 200);
      const okPath = okBadge.querySelector('path');

      // ---- Level-Zeile + Balken ----
      const hud = el('div', { left: '60px', top: '456px', height: '84px', display: 'flex', alignItems: 'center', gap: '20px', whiteSpace: 'nowrap' }, root);
      const hudL = el('div', { position: 'relative', fontFamily: F.sans, fontWeight: 800, fontSize: '70px', lineHeight: 1, letterSpacing: '-1px', color: C.weiss }, hud, 'LEVEL 1');
      const hudT = el('div', { position: 'relative', fontFamily: F.sans, fontWeight: 800, fontSize: '36px', lineHeight: 1, padding: '9px 18px 12px', background: PINK, color: BG, borderRadius: '4px', transform: 'rotate(-2deg)' }, hud, 'leicht');
      const barBg = el('div', { left: '492px', top: '488px', width: '458px', height: '18px', background: 'rgba(255,255,255,.13)', borderRadius: '9px', overflow: 'hidden' }, root);
      const bar = el('div', { left: 0, top: 0, width: '458px', height: '18px', background: PINK, transformOrigin: '0 50%' }, barBg);

      // ---- Dringlichkeit, Blitz, Level-Titel ----
      const vig = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', boxShadow: `inset 0 0 190px 40px ${ROT}`, opacity: 0 }, root);
      const title = el('div', { left: 0, top: '820px', width: '1010px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '270px', lineHeight: .9, letterSpacing: '-8px', color: C.weiss, whiteSpace: 'nowrap', textShadow: `10px 10px 0 ${PINK}` }, root, 'LEVEL 2');
      const titleSub = el('div', { left: 0, top: '1090px', width: '1010px', textAlign: 'center' }, root);
      const titleTag = el('div', { position: 'relative', display: 'inline-block', fontFamily: F.sans, fontWeight: 800, fontSize: '76px', lineHeight: 1, padding: '14px 34px 20px', background: PINK, color: BG, borderRadius: '6px' }, titleSub, 'mittel');

      // ---- Nach Level 3 ----
      const aft = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
      const aft1 = el('div', { left: 0, top: '640px', width: '1010px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '104px', letterSpacing: '-2px', color: PINK, lineHeight: 1 }, aft, 'LEVEL 3:');
      const aft2 = el('div', { left: 0, top: '744px', width: '1010px', textAlign: 'center', fontFamily: F.display, fontSize: '216px', letterSpacing: '-5px', color: C.weiss, lineHeight: 1 }, aft, 'Gesehen?');
      const aft3 = el('div', { left: 0, top: '1040px', width: '1010px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '92px', color: C.weiss, lineHeight: 1 }, aft, 'Zurückspulen erlaubt.');
      const rew = svg(`<path d="M150 62 A64 64 0 1 1 86 46" fill="none" stroke="${PINK}" stroke-width="11" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M112 22 L84 47 L114 72" fill="none" stroke="${PINK}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`, { left: '430px', top: '1170px' }, aft, '0 0 200 200', 150, 150);
      const rewP = rew.querySelectorAll('path');

      // ---- Schlussfrage ----
      const end = el('div', { left: 0, top: 0, width: '1080px', height: '1920px' }, root);
      const endT = el('div', { left: 0, top: '226px', width: '1010px', textAlign: 'center', fontFamily: F.display, fontSize: '128px', lineHeight: .96, letterSpacing: '-3px', color: C.weiss }, end, `Wie weit bist<br>du <span style="color:${PINK}">gekommen?</span>`);
      const SG = [{ n: '1', tag: 'leicht', bg: '#F4C3CF', fg: BG, x: 215 }, { n: '2', tag: 'mittel', bg: '#FFFFFF', fg: BG, x: 505 }, { n: '3', tag: 'brutal', bg: '#D10F2E', fg: '#fff', x: 795 }];
      const signs = SG.map((g, i) => {
        const w = el('div', { left: (g.x - 128) + 'px', top: '600px', width: '256px', height: '640px', transformOrigin: '50% 100%' }, end);
        el('div', { left: '113px', top: '300px', width: '30px', height: '340px', borderRadius: '0 0 15px 15px', background: 'linear-gradient(90deg,#5E4519,#F8E7B8 34%,#D6B168 55%,#4E3912)' }, w);
        const card = el('div', { left: 0, top: 0, width: '256px', height: '340px', borderRadius: '28px', background: g.bg, boxShadow: `inset 0 0 0 7px ${g.bg}, inset 0 0 0 11px ${i === 2 ? 'rgba(255,255,255,.55)' : 'rgba(18,12,21,.8)'}, 0 22px 0 -8px rgba(0,0,0,.45)` }, w);
        el('div', { left: 0, top: '8px', width: '256px', textAlign: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: '236px', lineHeight: 1, letterSpacing: '-6px', color: g.fg }, card, g.n);
        el('div', { left: 0, top: '258px', width: '256px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '40px', lineHeight: 1, color: g.fg, opacity: .8 }, card, g.tag);
        return w;
      });
      const endH = el('div', { left: 0, top: '1262px', width: '1010px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '90px', lineHeight: 1, color: C.weiss, transform: 'rotate(-2.5deg)' }, end, 'Schreib dein Level – ehrlich.');
      const arrow = svg(`<path d="M100 8 C82 44 122 70 98 132" fill="none" stroke="${PINK}" stroke-width="13" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M58 98 L97 140 L140 104" fill="none" stroke="${PINK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`, { left: '405px', top: '1376px' }, end, '0 0 200 150', 200, 150);
      const arP = arrow.querySelectorAll('path');

      const deco = el('div', { left: '560px', top: '1500px', width: '520px', textAlign: 'right', fontFamily: F.sans, fontWeight: 800, fontSize: '560px', lineHeight: 1, letterSpacing: '-20px', color: 'transparent', webkitTextStroke: '3px rgba(255,111,168,.2)', whiteSpace: 'nowrap', transformOrigin: '70% 40%' }, root, '1');
      const decoL = el('div', { left: '60px', top: '1592px', fontFamily: F.sans, fontWeight: 800, fontSize: '40px', letterSpacing: '10px', color: 'rgba(255,255,255,.16)', whiteSpace: 'nowrap' }, root, 'FINDE DEN ANDEREN');
      const flash = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: '#fff', opacity: 0 }, root);
      const TK = LV.map(L => GAME.ticks(L));
      const WH = [LV[1].S, LV[2].S, END];
      const show = (n, on) => { n.style.display = on ? 'block' : 'none'; };

      return (t) => {
        const cur = t < LV[1].S ? 0 : t < LV[2].S ? 1 : 2, L = LV[cur];
        // ---------- Raster ----------
        LV.forEach((Lv, i) => {
          const g = grids[i], on = t >= Lv.S - .12 && t < Lv.X + .17;
          show(g.wrap, on); show(marks[i].s, on); show(marks[i].lab, on);
          if (!on) return;
          const inK = i === 0 ? 1 : pr(t, Lv.S - .1, Lv.S + .16, ease.outCubic), outK = pr(t, Lv.X - .1, Lv.X + .16, ease.inCubic);
          const dx = (1 - inK) * 1150 - outK * 1150;
          const sk = (i === 0 ? 0 : (1 - inK) * -14) + outK * -14;
          const tf = `translateX(${dx.toFixed(1)}px) skewX(${sk.toFixed(2)}deg)`;
          g.wrap.style.transform = tf; marks[i].s.style.transform = tf; marks[i].lab.style.transform = tf;
          let dim = 1, oddO = 1, oddS = 1, ck = 0, lk = 0;
          if (i > 0) dim = oddO = tw(t, Lv.S + .34, Lv.S + .55, .3, 1);     // unter dem Level-Titel abgedunkelt
          if (i < 2) {
            dim *= tw(t, Lv.R, Lv.R + .22, 1, .17);
            ck = pr(t, Lv.R + .04, Lv.R + .42, ease.inOutCubic); lk = pr(t, Lv.R + .38, Lv.R + .62, ease.outBack);
            oddS = 1 + .2 * pr(t, Lv.R + .05, Lv.R + .45, ease.outBack) + (t > Lv.R + .45 ? .03 * Math.sin((t - Lv.R) * 9) : 0);
          } else {
            // Level 3: nur ein kurzes Aufblitzen (R … AFTER), danach alles dunkel
            const fl = t >= Lv.R && t < AFTER;
            if (t >= Lv.R) dim *= fl ? .14 : tw(t, AFTER, AFTER + .12, .14, .07);
            if (t >= AFTER) oddO = tw(t, AFTER, AFTER + .1, 1, .07);
            ck = fl ? 1 : 0; lk = fl ? pr(t, Lv.R, Lv.R + .12, ease.outBack) : 0;
            oddS = fl ? tw(t, Lv.R, Lv.R + .14, 1.45, 1.2) : 1;
          }
          g.update(t, dim, oddO, oddS);
          marks[i].ps.forEach(pth => pth.setAttribute('stroke-dashoffset', (1 - ck).toFixed(3)));
          marks[i].lab.style.opacity = clamp(lk * 2);
          marks[i].lab.style.transform = tf + ` rotate(${i === 2 ? -2 : -3}deg) scale(${(.7 + .3 * lk).toFixed(3)})`;
        });

        // ---------- Kopf ----------
        const topOn = t < AFTER;
        heads.forEach((h, i) => {
          const on = i === cur && topOn; show(h, on);
          if (!on) return;
          const k = i === 0 ? 1 : pr(t, LV[i].S + .02, LV[i].S + .3, ease.outBack);
          h.style.opacity = i === 0 ? 1 : clamp((t - LV[i].S) / .1);
          h.style.transform = `translateX(${((1 - k) * 90).toFixed(1)}px)`;
          // „anders.“ / „gemein.“ zuckt leicht – nie Stillstand
          const sp = h.querySelector('span'); sp.style.display = 'inline-block';
          sp.style.transform = `rotate(${(Math.sin(t * 5.2) * 2.2).toFixed(2)}deg) scale(${(1 + .04 * Math.sin(t * 7.1)).toFixed(3)})`;
        });

        // ---------- Timer ----------
        const el_ = t - L.T0, run = el_ >= 0 && t < L.R, rem = clamp(L.dur - el_, 0, L.dur);
        const frac = t < L.T0 ? 1 : rem / L.dur;
        let pulse = 0, urg = 0;
        for (const k of TK[cur]) if (t >= k.t && t < L.R + .02) { pulse = Math.exp(-(t - k.t) / .085); urg = k.u; }
        const hot = run && rem <= 2;
        const col = hot ? ROT : PINK;
        const done = cur < 2 && t >= L.R;
        show(ring, topOn && !done); show(okBadge, topOn && done); hud.style.display = topOn ? 'flex' : 'none'; show(barBg, topOn);
        pg.setAttribute('stroke', col); pg.setAttribute('stroke-dashoffset', (RC * (1 - frac)).toFixed(2));
        num.textContent = String(Math.max(0, Math.ceil(rem - 1e-6)));
        num.style.color = hot || (cur === 2 && t >= L.R) ? ROT : C.weiss;
        const rs = 1 + (hot ? .13 : .05) * pulse, hin = cur === 0 ? 1 : pr(t, L.S + .05, L.S + .35, ease.outBack);
        ring.style.transform = `scale(${(rs * hin).toFixed(3)}) rotate(${(hot ? Math.sin(t * 40) * 1.6 * pulse : 0).toFixed(2)}deg)`;
        bar.style.transform = `scaleX(${frac.toFixed(4)})`; bar.style.background = col;
        barBg.style.transform = `scaleY(${(1 + (hot ? .5 : .15) * pulse).toFixed(3)})`;
        vig.style.opacity = hot ? (.1 + .3 * pulse * (urg === 2 ? 1 : .7)).toFixed(3) : 0;
        if (done) {
          const k = pr(t, L.R + .1, L.R + .42, ease.outBack);
          okBadge.style.transform = `scale(${k.toFixed(3)}) rotate(${((1 - k) * -40).toFixed(1)}deg)`;
          okPath.setAttribute('stroke-dashoffset', (1 - pr(t, L.R + .3, L.R + .58)).toFixed(3));
        }
        hudL.textContent = 'LEVEL ' + L.n; hudT.textContent = L.tag;
        hudT.style.background = cur === 2 ? ROT : PINK; hudT.style.color = cur === 2 ? '#fff' : BG;
        hud.style.opacity = cur === 0 ? 1 : clamp((t - L.S - .42) / .1);

        // ---------- Level-Titel beim Wechsel ----------
        const tl = cur > 0 ? t - L.S : -1, tOn = tl >= 0 && tl < .56;
        show(title, tOn); show(titleSub, tOn);
        if (tOn) {
          const a = pr(tl, 0, .2, ease.outBack), z = pr(tl, .4, .56, ease.inCubic);
          title.textContent = 'LEVEL ' + L.n; titleTag.textContent = L.tag;
          titleTag.style.background = cur === 2 ? ROT : PINK; titleTag.style.color = cur === 2 ? '#fff' : BG;
          title.style.textShadow = `10px 10px 0 ${cur === 2 ? ROT : PINK}`;
          title.style.transform = `translateY(${(-z * 420).toFixed(1)}px) scale(${(lerp(1.7, 1, a) * (1 - .72 * z)).toFixed(3)}) rotate(${(lerp(-7, -3, a)).toFixed(2)}deg)`;
          title.style.opacity = 1 - z;
          const b = pr(tl, .1, .3, ease.outBack);
          titleSub.style.transform = `translateY(${(-z * 420).toFixed(1)}px) scale(${(b * (1 - .7 * z)).toFixed(3)}) rotate(3deg)`;
          titleSub.style.opacity = 1 - z;
        }

        // ---------- Nach Level 3 ----------
        const aOn = t >= AFTER && t < END + .17; show(aft, aOn);
        if (aOn) {
          const u = t - AFTER, outK = pr(t, END - .1, END + .16, ease.inCubic);
          aft.style.transform = `translateX(${(-outK * 1150).toFixed(1)}px) skewX(${(-outK * 14).toFixed(2)}deg)`;
          aft1.style.opacity = clamp(u / .08); aft1.style.transform = `translateY(${tw(u, 0, .22, -40, 0, ease.outBack).toFixed(1)}px)`;
          const k2 = pr(u, .06, .34, ease.outBack);
          aft2.style.opacity = clamp((u - .06) / .08); aft2.style.transform = `scale(${lerp(1.5, 1, k2).toFixed(3)}) rotate(${(-2 + Math.sin(u * 6) * .6).toFixed(2)}deg)`;
          const k3 = pr(u, .55, .85);
          aft3.style.opacity = k3; aft3.style.clipPath = `inset(-20px ${(100 - k3 * 100).toFixed(1)}% -20px 0)`; aft3.style.transform = 'rotate(-3deg)';
          const k4 = pr(u, .75, 1.15, ease.inOutCubic);
          rewP[0].setAttribute('stroke-dashoffset', (1 - k4).toFixed(3)); rewP[1].setAttribute('opacity', k4 > .9 ? 1 : 0);
          rew.style.transform = `rotate(${(-(u > 1.15 ? (u - 1.15) * 200 : 0)).toFixed(1)}deg)`;
        }

        // ---------- Schlussfrage ----------
        const eOn = t >= END - .12; show(end, eOn);
        if (eOn) {
          const u = t - END, inK = pr(t, END - .1, END + .16, ease.outCubic);
          end.style.transform = `translateX(${((1 - inK) * 1150).toFixed(1)}px) skewX(${((1 - inK) * -14).toFixed(2)}deg)`;
          endT.style.transform = `scale(${tw(u, .05, .4, 1.25, 1, ease.outBack).toFixed(3)})`;
          signs.forEach((w, i) => {
            const a = .5 + i * .32, k = pr(u, a, a + .42, ease.outBack);
            const wig = Math.sin(u * (2.4 + i * .5) + i * 1.7) * (i === 2 ? 4.2 : 2.4);
            w.style.opacity = clamp((u - a) / .06);
            w.style.transform = `translateY(${((1 - k) * 560).toFixed(1)}px) rotate(${((i - 1) * 3.5 + wig).toFixed(2)}deg)`;
          });
          const kh = pr(u, 1.75, 2.1);
          endH.style.opacity = kh; endH.style.clipPath = `inset(-30px ${(100 - kh * 100).toFixed(1)}% -30px 0)`;
          const ka = pr(u, 2.1, 2.45, ease.inOutCubic);
          arP[0].setAttribute('stroke-dashoffset', (1 - ka).toFixed(3)); arP[1].setAttribute('opacity', ka > .92 ? 1 : 0);
          arrow.style.transform = `translateY(${(u > 2.45 ? Math.abs(Math.sin((u - 2.45) * 4.4)) * 20 : 0).toFixed(1)}px)`;
        }

        // ---------- Deko unten ----------
        show(deco, t < AFTER); show(decoL, t < AFTER);
        deco.textContent = String(L.n);
        deco.style.webkitTextStroke = `3px ${hot ? 'rgba(255,43,61,.42)' : 'rgba(255,111,168,.2)'}`;
        deco.style.transform = `rotate(${(-6 + Math.sin(t * .9) * 1.5).toFixed(2)}deg) scale(${(1 + .05 * pulse).toFixed(3)})`;

        // ---------- Blitz ----------
        let f = 0;
        WH.forEach(w => { f = Math.max(f, .85 * clamp(1 - Math.abs(t - w - .02) / .075)); });
        f = Math.max(f, .6 * clamp(1 - Math.abs(t - LV[2].R - .02) / .06), .5 * clamp(1 - Math.abs(t - AFTER - .01) / .05));
        flash.style.opacity = f.toFixed(3);
      };
    }
  };

  // ---------- Cover ----------
  SCENES.cover = {
    bg: BG, build(root) {
      stage(root);
      el('div', { left: 0, top: '326px', width: '1080px', textAlign: 'center', fontFamily: F.display, fontSize: '150px', lineHeight: .95, letterSpacing: '-3px', color: C.weiss }, root, `Ein Lippenstift<br>ist <span style="display:inline-block;color:${PINK};transform:rotate(-3deg)">anders.</span>`);
      const L = { n: 9, cols: 5, rows: 2, odd: [1, 3], kind: 'pink', wob: 0 };
      const cw = 168, ch = 268, x0 = 540 - cw * 2.5, y0 = 690, sc = 1.28, items = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) items.push({ r, c, cx: x0 + (c + .5) * cw, by: y0 + (r + 1) * ch - 14, sc, odd: r === 1 && c === 3, ph: r * 2 + c * 1.3, sp: 1, ph2: c });
      const g = buildGrid(root, L, { lay: { cw, ch, sc, items }, noShelf: true });
      [0, 1].forEach(r => el('div', { left: '110px', top: (y0 + (r + 1) * ch - 10) + 'px', width: '860px', height: '3px', background: GOLD, opacity: .28 }, root));
      L.wob = 2.5; g.update(.6, 1, 1, 1);
      const t = el('div', { left: 0, top: '1316px', width: '1080px', textAlign: 'center' }, root);
      el('div', { position: 'relative', display: 'inline-block', background: PINK, color: BG, borderRadius: '6px', padding: '18px 40px 26px', fontFamily: F.sans, fontWeight: 800, fontSize: '74px', lineHeight: 1, letterSpacing: '-1px', transform: 'rotate(-2deg)' }, t, 'Level 3 ist gemein');
    }
  };
}
