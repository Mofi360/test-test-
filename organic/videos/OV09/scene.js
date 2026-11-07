/* OV09 – Drei Abende bis zur Frage  [KI] */
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, clamp, lerp } = DT;
const S = C.schwarz;
const HAIR_SIE = '#3B2529', HAIR_ER = '#4B3B40', GRAU = '#C9BEC2', WARM = '#FFE7B0', MOND = '#F7E7C6', HOLZ = '#E9D6C8';
const DARK = '#0B080D';

// ---------- eigene Illustrationen ----------
const sparkle = (x, y, s = 1, c = C.weiss) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22Z" fill="${c}"/>`;

/** Augen des Mannes (nur Augen, für Dunkel-Ebene und Kopf). look -1..1, blink 0..1 */
function himEyes(look = 0, blink = 0, dark = false) {
  const lx = look * 8;
  const one = x => blink > .5
    ? `<path d="M${x - 15} 212 Q${x} 220 ${x + 15} 212" fill="none" stroke="${dark ? C.weiss : S}" stroke-width="5" stroke-linecap="round"/>`
    : `<ellipse cx="${x}" cy="212" rx="16" ry="${13 * (1 - blink)}" fill="#fff" ${dark ? '' : `stroke="${S}" stroke-opacity=".25" stroke-width="2"`}/>
       <circle cx="${x + lx}" cy="213" r="${8 * (1 - blink * .6)}" fill="${S}"/>`;
  return one(156) + one(244);
}

/** Er: Kopf + Schultern, viewBox 0 0 400 460, Mund bei (200, 300). */
function him(o = {}) {
  const look = o.look ?? 0, brow = o.brow ?? 0, blink = o.blink ?? 0, m = o.mouth || 'flat';
  const mouth = {
    flat: `<path d="M178 302 L222 302" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    hmm: `<path d="M178 304 Q200 298 222 300" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    talk: `<path d="M174 294 Q200 290 226 294 Q222 324 200 326 Q178 324 174 294Z" fill="#6E2A3B"/><path d="M182 312 Q200 306 218 312 Q210 322 200 322 Q190 322 182 312Z" fill="${C.lippeHell}"/>`,
    o: `<ellipse cx="200" cy="306" rx="12" ry="15" fill="#6E2A3B"/>`,
    smile: `<path d="M172 296 Q200 322 228 296" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
  }[m];
  const stripes = Array.from({ length: 9 }, (_, i) => `<line x1="${86 + i * 28}" y1="372" x2="${80 + i * 30}" y2="460" stroke="${C.rosaTief}" stroke-width="7"/>`).join('');
  return `<g>
    <clipPath id="shirt${o.id || 0}"><path d="M60 460 C60 396 120 362 200 362 C280 362 340 396 340 460Z"/></clipPath>
    <path d="M60 460 C60 396 120 362 200 362 C280 362 340 396 340 460Z" fill="${C.weiss}"/>
    <g clip-path="url(#shirt${o.id || 0})">${stripes}</g>
    <path d="M60 460 C60 396 120 362 200 362 C280 362 340 396 340 460Z" fill="none" stroke="${S}" stroke-width="5"/>
    <path d="M168 366 L200 404 L232 366" fill="none" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="174" y="320" width="52" height="56" fill="${C.hautDunkel}"/>
    <ellipse cx="90" cy="226" rx="18" ry="28" fill="${C.hautDunkel}"/><ellipse cx="310" cy="226" rx="18" ry="28" fill="${C.hautDunkel}"/>
    <path d="M92 200 C90 120 140 92 200 92 C260 92 310 120 308 200 L306 262 C300 320 256 352 200 352 C144 352 100 320 94 262Z" fill="${C.haut}"/>
    <path d="M92 214 C82 130 128 72 204 72 C276 72 324 120 310 214 C304 176 296 150 282 136 C240 150 160 150 116 134 C104 150 96 176 92 214Z" fill="${HAIR_ER}"/>
    <path d="M94 212 C92 190 96 170 104 156 M306 212 C308 190 304 170 296 156" stroke="${GRAU}" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M128 ${176 - brow * 14} Q156 ${164 - brow * 16} 182 ${174 - brow * 10}" fill="none" stroke="${HAIR_ER}" stroke-width="10" stroke-linecap="round"/>
    <path d="M218 ${174 - brow * 4} Q244 ${166 - brow * 6} 272 ${176 - brow * 4}" fill="none" stroke="${HAIR_ER}" stroke-width="10" stroke-linecap="round"/>
    ${himEyes(look, blink)}
    <circle cx="156" cy="212" r="32" fill="none" stroke="${S}" stroke-width="6"/><circle cx="244" cy="212" r="32" fill="none" stroke="${S}" stroke-width="6"/>
    <path d="M188 210 Q200 202 212 210 M124 206 L96 198 M276 206 L304 198" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/>
    <path d="M200 232 C196 252 194 262 206 266" fill="none" stroke="${C.hautDunkel}" stroke-width="6" stroke-linecap="round"/>
    ${mouth}
  </g>`;
}

/** Sie: Kopf + Schultern, viewBox 0 0 400 460, Mund bei (200, 296). eyes: open|closed|happy|wink, tape 0..1, mouth: smile|grin */
function her(o = {}) {
  const ey = o.eyes || 'open', look = (o.look ?? 0) * 7;
  const eye = (x, kind) => kind === 'closed'
    ? `<path d="M${x - 19} 208 Q${x} 222 ${x + 19} 208" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M${x - 20} 210 L${x - 27} 217 M${x + 20} 210 L${x + 27} 217" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`
    : kind === 'happy'
      ? `<path d="M${x - 19} 216 Q${x} 194 ${x + 19} 216" fill="none" stroke="${S}" stroke-width="7" stroke-linecap="round"/>`
      : `<ellipse cx="${x + look}" cy="210" rx="10" ry="12" fill="${S}"/><circle cx="${x + look + 3}" cy="205" r="3.5" fill="#fff"/>
         <path d="M${x - 18} 199 Q${x} 188 ${x + 18} 199" fill="none" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>`;
  const eL = ey === 'wink' ? 'open' : ey, eR = ey === 'wink' ? 'happy' : ey;
  const g = o.grin ?? 0;
  const mouth = g > 0
    ? `<path d="M${164 - g * 6} ${284 - g * 2} Q200 ${290} ${236 + g * 6} ${284 - g * 2} Q${226 + g * 4} ${300 + g * 18} 200 ${302 + g * 20} Q${174 - g * 4} ${300 + g * 18} ${164 - g * 6} ${284 - g * 2}Z" fill="${C.lippe}"/>
       <path d="M${170 - g * 4} ${287} Q200 ${292} ${230 + g * 4} ${287} L${226 + g * 3} ${287 + g * 9} Q200 ${293 + g * 8} ${174 - g * 3} ${287 + g * 9}Z" fill="#fff" opacity="${clamp(g * 2)}"/>
       <path d="M${158 - g * 8} ${278 - g * 4} Q${154 - g * 8} ${286} ${160 - g * 8} ${292}" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity="${g}"/>
       <path d="M${242 + g * 8} ${278 - g * 4} Q${246 + g * 8} ${286} ${240 + g * 8} ${292}" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity="${g}"/>`
    : `<path d="M166 288 Q184 278 200 284 Q216 278 234 288 Q226 296 200 297 Q174 296 166 288Z" fill="${C.lippe}"/>
       <path d="M166 288 Q200 312 234 288 Q226 296 200 297 Q174 296 166 288Z" fill="${C.lippeHell}"/>
       <path d="M166 288 Q200 300 234 288" fill="none" stroke="#9E4058" stroke-width="3" stroke-linecap="round"/>`;
  return `<g>
    <path d="M66 262 C48 120 120 62 200 62 C280 62 352 120 334 262 C346 310 330 346 300 356 L100 356 C70 346 54 310 66 262Z" fill="${HAIR_SIE}"/>
    <path d="M70 460 C70 396 124 366 200 366 C276 366 330 396 330 460Z" fill="${o.top || C.rosaTief}" stroke="${S}" stroke-width="5"/>
    <path d="M170 368 Q200 392 230 368" fill="none" stroke="${C.weiss}" stroke-width="6" stroke-linecap="round"/>
    <rect x="176" y="318" width="48" height="56" fill="${C.hautDunkel}"/>
    <ellipse cx="200" cy="228" rx="110" ry="122" fill="${C.haut}"/>
    <path d="M88 214 C80 126 144 92 208 96 C270 100 322 134 312 214 C300 168 270 146 226 150 C200 172 140 176 88 214Z" fill="${HAIR_SIE}"/>
    <path d="M232 104 C276 116 304 150 310 196" fill="none" stroke="${GRAU}" stroke-width="9" stroke-linecap="round" opacity=".85"/>
    <circle cx="94" cy="286" r="9" fill="${C.beere}"/><circle cx="306" cy="286" r="9" fill="${C.beere}"/>
    <path d="M136 176 Q156 164 176 172" fill="none" stroke="${HAIR_SIE}" stroke-width="7" stroke-linecap="round"/>
    <path d="M224 172 Q244 164 264 176" fill="none" stroke="${HAIR_SIE}" stroke-width="7" stroke-linecap="round"/>
    ${eye(156, eL)}${eye(244, eR)}
    <path d="M197 226 C193 246 191 254 202 258" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="128" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    <ellipse cx="272" cy="262" rx="24" ry="13" fill="${C.rosaTief}" opacity=".55"/>
    ${mouth}
    ${o.tape ? `<g opacity="${o.tape}" transform="translate(200 293) scale(.4) translate(-200 -200)">${ART.tape(true)}</g>` : ''}
  </g>`;
}

/** Nachttischlampe, viewBox 0 0 200 300, on 0..1 */
function lamp(on = 1) {
  return `<g>
    <circle cx="100" cy="80" r="190" fill="${WARM}" opacity="${.08 * on}"/>
    <circle cx="100" cy="80" r="130" fill="${WARM}" opacity="${.12 * on}"/>
    <circle cx="100" cy="80" r="80" fill="${WARM}" opacity="${.18 * on}"/>
    <rect x="94" y="110" width="12" height="150" fill="${S}"/>
    <rect x="48" y="252" width="104" height="18" rx="9" fill="${S}"/>
    <path d="M50 40 L150 40 L176 120 L24 120Z" fill="${on > .5 ? '#FFF1D6' : '#8E7F85'}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M102 120 L102 160" stroke="${S}" stroke-width="3"/><circle cx="102" cy="166" r="6" fill="${S}"/>
  </g>`;
}

/** Schlafzimmer frontal. Gibt Steuerobjekt zurück. */
function bedroom(root, o = {}) {
  const dy = o.dy ?? 0;
  const back = svg(`
    <rect x="690" y="${470 + dy}" width="220" height="170" rx="6" fill="${DARK}" stroke="${C.rosaTief}" stroke-width="10"/>
    <line x1="800" y1="${470 + dy}" x2="800" y2="${640 + dy}" stroke="${C.rosaTief}" stroke-width="8"/>
    <g transform="translate(722 ${492 + dy}) scale(.22)">${ART.moon(MOND)}</g>
    ${ART.star(860, 510 + dy, .7, MOND)}${ART.star(840, 600 + dy, .5, MOND)}
    <path d="M210 ${1100 + dy} L210 ${760 + dy} C210 ${660 + dy} 340 ${640 + dy} 540 ${640 + dy} C740 ${640 + dy} 870 ${660 + dy} 870 ${760 + dy} L870 ${1100 + dy}Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    ${[[330, 740], [440, 714], [540, 706], [640, 714], [750, 740]].map(([x, y]) => `<circle cx="${x}" cy="${y + dy}" r="7" fill="${S}" opacity=".35"/>`).join('')}
    <rect x="30" y="${1010 + dy}" width="180" height="250" rx="10" fill="${HOLZ}" stroke="${S}" stroke-width="7"/>
    <rect x="58" y="${1080 + dy}" width="124" height="16" rx="8" fill="${S}" opacity=".7"/>
    <rect x="890" y="${1010 + dy}" width="180" height="250" rx="10" fill="${HOLZ}" stroke="${S}" stroke-width="7"/>`,
    { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const lmp = svg(lamp(1), {}, root, '0 0 200 300', 200, 300);
  place(lmp, 120, 870 + dy);
  const he = svg(him({ id: 1 }), {}, root, '0 0 400 460', 330, 380);
  place(he, 400, 905 + dy);
  const she = svg(her({ eyes: 'closed', tape: 1 }), {}, root, '0 0 400 460', 322, 370);
  place(she, 690, 910 + dy);
  const blanket = svg(`
    <path d="M150 ${1060 + dy} C330 ${1030 + dy} 760 ${1030 + dy} 930 ${1060 + dy} L950 1336 L130 1336Z" fill="${C.weiss}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M150 ${1060 + dy} C330 ${1030 + dy} 760 ${1030 + dy} 930 ${1060 + dy} L936 ${1130 + dy} C760 ${1100 + dy} 330 ${1100 + dy} 144 ${1130 + dy}Z" fill="${C.rosaHell}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    ${Array.from({ length: 18 }, (_, i) => (1180 + Math.floor(i / 6) * 55 + dy > 1316) ? '' : `<circle cx="${190 + (i % 6) * 130 + (Math.floor(i / 6) % 2) * 65}" cy="${1180 + Math.floor(i / 6) * 55 + dy}" r="8" fill="${C.rosaTief}"/>`).join('')}`,
    { left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const book = svg(`
    <path d="M10 30 L150 10 L150 150 L10 170Z" fill="${S}"/><path d="M290 30 L150 10 L150 150 L290 170Z" fill="${S}"/>
    <path d="M22 34 L150 18 L150 144 L22 160Z" fill="#FFFDF9"/><path d="M278 34 L150 18 L150 144 L278 160Z" fill="#F4EDE8"/>
    ${[50, 70, 90, 110].map(y => `<path d="M40 ${y} L132 ${y - 12} M168 ${y - 12} L260 ${y}" stroke="${S}" stroke-opacity=".25" stroke-width="4"/>`).join('')}
    <ellipse cx="14" cy="120" rx="26" ry="20" fill="${C.haut}" stroke="${S}" stroke-width="4"/><ellipse cx="286" cy="120" rx="26" ry="20" fill="${C.haut}" stroke="${S}" stroke-width="4"/>`,
    {}, root, '0 0 300 180', 260, 156);
  return {
    dy, lmp, he, she, blanket, book,
    setLamp(on) { lmp.querySelector('svg').innerHTML = lamp(on); },
    setHim(oo) { he.querySelector('svg').innerHTML = him(Object.assign({ id: 1 }, oo)); },
    setHer(oo) { she.querySelector('svg').innerHTML = her(Object.assign({ tape: 1 }, oo)); },
    placeBook(y, r = -3) { place(book, 395, y + dy, 1, r); },
  };
}

/** Sprechblase (HTML). o: x | right, y, size, font, tail ('left'|'right'), tailX */
function bubble(parent, html, o = {}) {
  const st = { top: o.y + 'px', padding: o.pad ?? '30px 48px 36px', background: C.weiss, border: `6px solid ${S}`, borderRadius: '60px', fontFamily: o.font || F.display, fontSize: (o.size ?? 70) + 'px', lineHeight: 1.06, color: S, boxSizing: 'border-box', zIndex: 4, whiteSpace: o.w ? 'normal' : 'nowrap', letterSpacing: '-1px' };
  if (o.w) st.width = o.w + 'px';
  if (o.right != null) st.right = o.right + 'px'; else st.left = (o.x ?? 90) + 'px';
  const b = el('div', st, parent, html);
  const tr = o.tail === 'right';
  const tx = o.tailX ?? 70;
  const tail = svg(`<path d="M0 0 L56 0 L${tr ? 70 : -14} 64Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="4" y="-9" width="48" height="11" fill="${C.weiss}"/>`,
    { top: '100%', marginTop: '-3px' }, b, '0 0 56 64', 56, 64);
  if (tr) tail.style.right = tx + 'px'; else tail.style.left = tx + 'px';
  b.style.transformOrigin = tr ? `calc(100% - ${tx}px) 110%` : `${tx}px 110%`;
  return {
    node: b, update(t, t0, out = 1) {
      const k = pr(t, t0, t0 + .4, ease.outBack);
      b.style.opacity = clamp((t - t0) / .1) * out;
      b.style.transform = `scale(${.4 + .6 * k}) rotate(${(1 - k) * (tr ? 6 : -6)}deg)`;
    }
  };
}
const accent = (s, c = C.beere) => `<span style="color:${c}">${s}</span>`;
const pill = (parent, text, o = {}) => el('div', { left: (o.x ?? 0) + 'px', top: (o.y ?? 0) + 'px', padding: '12px 30px 16px', background: o.bg ?? S, color: o.color ?? C.weiss, fontFamily: F.sans, fontWeight: 700, fontSize: (o.size ?? 52) + 'px', borderRadius: '44px', whiteSpace: 'nowrap', zIndex: 5 }, parent, text);
const popIn = (n, t, t0, rot = 0) => { const k = pr(t, t0, t0 + .45, ease.outBack); n.style.opacity = clamp((t - t0) / .12); n.style.transform = `translateY(${(1 - k) * 40}px) scale(${.7 + .3 * k}) rotate(${rot}deg)`; };
const front = n => { n.node.style.zIndex = 6; return n; };

// ---------- Szenen ----------
// s1: Hook statisch. Ehebett von oben, über ihm eine leere Sprechblase mit tippenden Punkten.
SCENES.s1 = { bg: C.rosaHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const bed = svg(`
    <rect x="12" y="14" width="760" height="720" rx="40" fill="${S}" opacity=".08"/>
    <rect x="0" y="0" width="760" height="720" rx="40" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    <rect x="0" y="0" width="760" height="70" rx="30" fill="${C.rosaTief}" stroke="${S}" stroke-width="7"/>
    <rect x="50" y="96" width="300" height="170" rx="60" fill="${C.rosaHell}" stroke="${S}" stroke-width="6"/>
    <rect x="410" y="96" width="300" height="170" rx="60" fill="${C.rosaHell}" stroke="${S}" stroke-width="6"/>`,
    {}, root, '0 0 760 720', 760, 720);
  const he = svg(him({ id: 11, look: .9 }), {}, root, '0 0 400 460', 260, 299);
  const she = svg(her({ eyes: 'closed', tape: 1 }), {}, root, '0 0 400 460', 254, 292);
  const duvet = svg(`
    <path d="M0 40 C200 10 560 10 760 40 L760 400 C760 430 740 440 720 440 L40 440 C20 440 0 430 0 400Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M0 40 C200 10 560 10 760 40 L760 110 C560 80 200 80 0 110Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M140 220 C240 200 300 240 400 214 M420 320 C520 296 600 330 680 306" fill="none" stroke="${C.weiss}" stroke-opacity=".5" stroke-width="8" stroke-linecap="round"/>`,
    {}, root, '0 0 760 440', 760, 440);
  const bub = bubble(root, '<span class="d">•</span> <span class="d">•</span> <span class="d">•</span>', { x: 150, y: 1010, size: 120, font: F.sans, pad: '0px 50px 26px', tail: 'left', tailX: 40 });
  // Schwanz nach oben zu ihm drehen
  const tl = bub.node.querySelector('div'); tl.style.top = '-61px';
  tl.querySelector('svg').innerHTML = `<path d="M0 64 L56 64 L18 0Z" fill="${C.weiss}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="4" y="62" width="48" height="11" fill="${C.weiss}"/>`;
  bub.node.style.transformOrigin = '70px -20px';
  const dots = bub.node.querySelectorAll('.d');
  const hook = bigText(root, 'Er hat *drei* *Abende* gebraucht, um zu fragen.', { x: 90, y: 200, w: 920, size: 104 });
  front(hook).update(99);
  return (t) => {
    place(bed, 540, 975, 1, -1.5);
    place(he, 362, 820 + noise(t, 1) * 2, 1, -4);
    place(she, 712, 822, 1, 3);
    place(duvet, 540, 1120, 1, -1.5);
    he.querySelector('svg').innerHTML = him({ id: 11, look: Math.sin(t * 1.1) > .2 ? 1 : .2, brow: .3 });
    bub.update(t, -1);
    dots.forEach((d, i) => { const ph = (t * 2.2 - i * .33) % 1; d.style.opacity = (ph < .5 ? 1 : .25); d.style.display = 'inline-block'; d.style.transform = `translateY(${ph < .5 ? -8 : 0}px)`; });
  };
}};

// s2: Abend 1 – er liest, Blick wandert kurz zu ihr und zurück
SCENES.s2 = { bg: C.nachtHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const room = bedroom(root);
  const head = front(bigText(root, 'Abend 1: *ein* *Blick.*', { x: 90, y: 220, w: 900, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .06 }));
  return (t) => {
    head.update(t);
    const go = pr(t, D * .25, D * .25 + .25, ease.inOutCubic) * (1 - pr(t, D * .58, D * .58 + .25, ease.inOutCubic));
    room.setHim({ look: lerp(-.6, 1, go), brow: go * .2, mouth: 'flat' });
    room.placeBook(1075 - go * 12, -3);
  };
}};

// s3: Abend 2 – Blick hält länger, dann klickt das Licht aus. Nur seine Augen bleiben.
SCENES.s3 = { bg: C.nachtHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const room = bedroom(root);
  const shade = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: DARK, opacity: 0, zIndex: 3 }, root);
  const eyes = svg(himEyes(1, 0, true), { zIndex: 4 }, root, '0 0 400 460', 330, 380);
  const klick = el('div', { left: '70px', top: '700px', fontFamily: F.hand, fontWeight: 700, fontSize: '70px', color: C.weiss, zIndex: 5, transform: 'rotate(-8deg)' }, root, 'klick.');
  const head = front(bigText(root, 'Abend 2: *längerer* *Blick.*', { x: 90, y: 220, w: 900, size: 112, color: C.weiss, accent: C.rosa, t0: 0, step: .06 }));
  const tOff = D * .62;
  return (t) => {
    head.update(t);
    const go = pr(t, .35, .65, ease.inOutCubic);
    room.setHim({ look: lerp(-.6, 1, go), brow: go * .9, mouth: t > D * .4 ? 'hmm' : 'flat' });
    room.placeBook(1075 + go * 40, -3 + go * 3);
    const off = t >= tOff ? 1 : 0;
    room.setLamp(1 - off);
    shade.style.opacity = off * .9;
    const blink = (t > tOff + .8 && t < tOff + .95) ? 1 : 0;
    eyes.querySelector('svg').innerHTML = himEyes(1, blink, true);
    place(eyes, 400, 905, 1, 0, off);
    klick.style.opacity = clamp((t - tOff) / .05) * (1 - pr(t, tOff + .7, tOff + 1));
  };
}};

// s4: Abend 3 – Licht geht wieder an, die Frage in großer Sprechblase, Fragezeichen hüpfen
SCENES.s4 = { bg: C.nachtHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const room = bedroom(root, { dy: 70 });
  const shade = el('div', { left: 0, top: 0, width: '1080px', height: '1920px', background: DARK, opacity: .86, zIndex: 3 }, root);
  const qs = [[205, 760, -14, 120], [528, 770, 12, 96], [300, 640, 8, 72]].map(([x, y, r, s], i) => {
    const q = el('div', { left: '0px', top: '0px', fontFamily: F.display, fontSize: s + 'px', color: C.weiss, zIndex: 4, lineHeight: 1 }, root, '?');
    return { q, x, y, r };
  });
  const bub = bubble(root, `Schatz, warum klebst du dir den ${accent('Mund')} zu?`, { x: 90, y: 370, w: 860, size: 72, tail: 'left', tailX: 250 });
  const head = front(bigText(root, 'Abend 3: *die* *Frage.*', { x: 90, y: 210, w: 940, size: 96, color: C.weiss, accent: C.rosa, t0: 0, step: .05 }));
  return (t) => {
    head.update(t + .2);
    const on = t >= .2 ? 1 : 0;
    room.setLamp(on);
    shade.style.opacity = (1 - on) * .86;
    const talk = t > .6 && t < D * .8 ? (Math.sin(t * 16) > 0 ? 'talk' : 'o') : 'flat';
    room.setHim({ look: 1, brow: .6, mouth: talk });
    room.setHer({ eyes: t > D * .5 ? 'open' : 'closed', look: -1 });
    room.placeBook(1110, 6);
    bub.update(t, .5);
    qs.forEach(({ q, x, y, r }, i) => {
      const t0 = D * .45 + i * .2, k = pr(t, t0, t0 + .35, ease.outBack);
      q.style.opacity = clamp((t - t0) / .1);
      q.style.transform = `translate(${x}px, ${y + 70 - Math.abs(Math.sin(t * 4 + i)) * 26}px) rotate(${r}deg) scale(${k})`;
    });
  };
}};

// s5: Zoom durch eine Lupe auf ihr Tape, Pflege-Mitte leuchtet, zwei Labels
SCENES.s5 = { bg: C.rosa, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const R = 360, CX = 540, CY = 900;
  const lens = el('div', { left: (CX - R) + 'px', top: (CY - R) + 'px', width: 2 * R + 'px', height: 2 * R + 'px', borderRadius: '50%', overflow: 'hidden', background: C.haut, border: `10px solid ${S}`, boxSizing: 'border-box', boxShadow: '0 30px 60px -24px rgba(21,16,18,.45)' }, root);
  const face = svg(her({ eyes: 'happy', tape: 1 }), {}, lens, '0 0 400 460', 400, 460);
  face.style.transformOrigin = '0 0';
  const glow = svg(`<rect x="8" y="8" width="384" height="144" rx="72" fill="none" stroke="${C.beere}" stroke-width="8" stroke-dasharray="20 14"/>`, { zIndex: 2 }, root, '0 0 400 160', 400, 160);
  const shine = svg(`<ellipse cx="200" cy="80" rx="150" ry="58" fill="#fff" opacity=".35"/>`, { zIndex: 2 }, root, '0 0 400 160', 400, 160);
  const lines = svg(`<path d="M200 560 C110 700 170 900 420 945" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 14" class="a"/>
                     <path d="M820 1150 C870 1060 790 985 662 955" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 14" class="b"/>`, { zIndex: 4, left: 0, top: 0 }, root, '0 0 1080 1920', 1080, 1920);
  const la = lines.querySelector('.a'), lb = lines.querySelector('.b');
  const l1 = pill(root, 'Kollagen', { x: 80, y: 470 });
  const l2 = pill(root, 'Hyaluronsäure', { x: 560, y: 1140 });
  const n = front(note(root, 'bleibt die ganze Nacht drauf. ', { x: 150, y: 1268, r: -3, t0: D * .78, size: 64 }));
  const head = front(bigText(root, 'Das ist *Lippenpflege,* Schatz.', { x: 80, y: 200, w: 960, size: 92, t0: 0, step: .06 }));
  return (t) => {
    head.update(t); n.update(t);
    const k = pr(t, 0, .5, ease.outBack);
    lens.style.transform = `scale(${.5 + .5 * k})`; lens.style.opacity = clamp(t / .12);
    const z = pr(t, .5, 1.8, ease.inOutCubic);
    const sc = lerp(1.5, 3.2, z);             // px pro viewBox-Einheit
    const mx = 200, my = lerp(250, 280, z);    // Fokuspunkt im Gesicht
    face.style.transform = `translate(${R - 10 - mx * sc}px, ${R - 10 - my * sc}px) scale(${sc})`;
    const g = pr(t, D * .3, D * .3 + .4);
    const tapeW = 184 * .4 * 3.2;             // Pad-Breite bei Endzoom
    place(glow, CX, CY + 13 * 3.2, (tapeW + 60) / 400 * (1 + Math.sin(t * 3.4) * .03), 0, g);
    place(shine, CX, CY + 13 * 3.2, tapeW / 400, 0, g * (.5 + .5 * Math.sin(t * 3.4)));
    popIn(l1, t, D * .4, -3); popIn(l2, t, D * .55, 2);
    la.style.opacity = clamp((t - D * .4) / .2); lb.style.opacity = clamp((t - D * .55) / .2);
  };
}};

// s6: Pingpong – sein „Aha“ wird jedes Mal kleiner
SCENES.s6 = { bg: C.weiss, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const he = svg(him({ id: 6, look: 1, mouth: 'flat' }), {}, root, '0 0 400 460', 300, 345);
  const she = svg(her({ eyes: 'happy', tape: 1 }), {}, root, '0 0 400 460', 300, 345);
  const desk = el('div', { left: '40px', top: '1328px', width: '1000px', height: '14px', borderRadius: '7px', background: S }, root);
  const b1 = bubble(root, 'Aha.', { x: 80, y: 250, size: 130, tail: 'left', tailX: 90 });
  const b2 = bubble(root, 'Und das Loch?', { x: 80, y: 510, size: 76, tail: 'left', tailX: 90 });
  const b3 = bubble(root, 'Sicherheitsloch.', { right: 80, y: 700, size: 76, tail: 'right', tailX: 90 });
  const b4 = bubble(root, 'Aha.', { x: 110, y: 890, size: 54, pad: '18px 34px 24px', tail: 'left', tailX: 60 });
  const ts = [0, .21, .45, .79].map(f => .1 + f * D);
  return (t) => {
    const speaking = i => t > ts[i] && t < ts[i] + .5;
    he.querySelector('svg').innerHTML = him({ id: 6, look: 1, brow: t > ts[3] ? .7 : 0, mouth: (speaking(0) || speaking(1) || speaking(3)) && Math.sin(t * 18) > 0 ? 'talk' : 'flat' });
    she.querySelector('svg').innerHTML = her({ eyes: t > ts[2] - .1 && t < ts[3] ? 'open' : 'happy', look: -1, tape: 1 });
    place(he, 240, 1160 + (speaking(0) ? Math.sin(t * 20) * 3 : 0), 1, 3);
    place(she, 830, 1160 + (speaking(2) ? Math.sin(t * 20) * 3 : 0), 1, -3);
    b1.update(t, ts[0]); b2.update(t, ts[1]); b3.update(t, ts[2]); b4.update(t, ts[3]);
  };
}};

// s7: Neulich beim Frühstück – Glühbirne geht über ihm an
SCENES.s7 = { bg: C.rosaHell, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const he = svg(him({ id: 7, look: 1, mouth: 'flat' }), {}, root, '0 0 400 460', 330, 380);
  const she = svg(her({ eyes: 'open', look: -.3, top: C.weiss }), {}, root, '0 0 400 460', 320, 368);
  const table = svg(`
    <rect x="0" y="0" width="1080" height="260" fill="${C.weiss}"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 90}" y="0" width="45" height="260" fill="${C.rosa}" opacity=".55"/>`).join('')}
    ${Array.from({ length: 3 }, (_, i) => `<rect x="0" y="${i * 90}" width="1080" height="45" fill="${C.rosa}" opacity=".45"/>`).join('')}
    <rect x="0" y="0" width="1080" height="12" fill="${S}"/>`, { left: 0, top: '1090px' }, root, '0 0 1080 260', 1080, 260);
  const mug = (c) => `<path d="M30 40 L150 40 L140 170 C138 186 42 186 40 170Z" fill="${c}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M148 70 C196 70 196 140 142 140" fill="none" stroke="${S}" stroke-width="12"/>
    <ellipse cx="90" cy="40" rx="60" ry="12" fill="#6B4A3F" stroke="${S}" stroke-width="5"/>`;
  const steam = `<path class="s" d="M50 140 C30 110 70 90 50 60 C30 30 70 10 50 -20" fill="none" stroke="${S}" stroke-opacity=".35" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray=".35 .65"/>
    <path class="s" d="M110 140 C90 110 130 90 110 60 C90 30 130 10 110 -20" fill="none" stroke="${S}" stroke-opacity=".35" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray=".35 .65"/>`;
  const m1 = svg(mug(C.schwarz) + steam, {}, root, '0 -30 200 230', 200, 230);
  const m2 = svg(mug(C.rosaTief) + steam, {}, root, '0 -30 200 230', 200, 230);
  const plate = svg(`<ellipse cx="150" cy="40" rx="140" ry="30" fill="${C.weiss}" stroke="${S}" stroke-width="6"/><ellipse cx="150" cy="36" rx="90" ry="16" fill="none" stroke="${C.rosaTief}" stroke-width="5"/>
    <path d="M100 30 C110 4 190 4 200 30Z" fill="#E7B98C" stroke="${S}" stroke-width="5"/>`, {}, root, '0 0 300 80', 300, 80);
  const bulb = svg(`<g class="r" stroke="${C.beere}" stroke-width="10" stroke-linecap="round">${Array.from({ length: 7 }, (_, i) => { const a = Math.PI + i / 6 * Math.PI; return `<line x1="${100 + Math.cos(a) * 78}" y1="${92 + Math.sin(a) * 78}" x2="${100 + Math.cos(a) * 104}" y2="${92 + Math.sin(a) * 104}"/>`; }).join('')}</g>
    <path class="g" d="M100 30 C60 30 40 60 40 90 C40 118 62 130 70 152 L130 152 C138 130 160 118 160 90 C160 60 140 30 100 30Z" fill="${C.weiss}" stroke="${S}" stroke-width="7"/>
    <rect x="72" y="156" width="56" height="16" rx="4" fill="${S}"/><rect x="78" y="176" width="44" height="12" rx="4" fill="${S}"/>
    <path d="M86 140 L86 112 Q100 96 114 112 L114 140" fill="none" stroke="${S}" stroke-width="5"/>`, {}, root, '0 0 200 200', 180, 180);
  const bulbG = bulb.querySelector('.g'), rays = bulb.querySelector('.r');
  const bub = bubble(root, `Hast du was an den ${accent('Lippen')} gemacht?`, { x: 470, y: 460, w: 520, size: 54, font: F.sans, pad: '24px 36px 30px', tail: 'left', tailX: 60 });
  bub.node.style.fontWeight = 600; bub.node.style.letterSpacing = '0';
  const head = front(bigText(root, 'Neulich beim *Frühstück.*', { x: 90, y: 200, w: 900, size: 108, t0: 0, step: .06 }));
  const tB = D * .35;
  return (t) => {
    head.update(t);
    place(he, 320, 910, 1, 2);
    place(she, 780, 916, 1, -2);
    place(m1, 330, 1150, 1); place(m2, 790, 1150, 1); place(plate, 560, 1250, 1);
    [...m1.querySelectorAll('.s'), ...m2.querySelectorAll('.s')].forEach((s, i) => s.setAttribute('stroke-dashoffset', ((t * .5 + i * .3) % 1)));
    const on = t >= tB ? 1 : 0;
    bulbG.setAttribute('fill', on ? '#FFF1D6' : C.weiss);
    rays.style.opacity = on * (.75 + Math.sin(t * 6) * .25);
    const k = pr(t, .2, .6, ease.outBack);
    place(bulb, 300, 640 + (1 - k) * 30, .6 + .4 * k, -6 + Math.sin(t * 2) * 3, clamp((t - .2) / .1));
    he.querySelector('svg').innerHTML = him({ id: 7, look: t > tB - .4 ? 1 : 0, brow: on * .8, mouth: t > tB && t < D * .85 ? (Math.sin(t * 16) > 0 ? 'talk' : 'o') : 'flat' });
    bub.update(t, tB + .2);
  };
}};

// s8: Ich hab nur gegrinst – Grinsen wächst, Zwinkern, Funkeln; Tape neben der Tasse
SCENES.s8 = { bg: C.rosa, build(root, ctx) { root.style.isolation = 'isolate';
  const D = ctx.dur;
  const face = svg(her({ eyes: 'open', top: C.weiss }), {}, root, '0 0 400 460', 560, 644);
  const table = el('div', { left: '0px', top: '1200px', width: '1080px', height: '160px', background: C.weiss, borderTop: `10px solid ${S}` }, root);
  const mug = svg(`<path d="M30 40 L150 40 L140 170 C138 186 42 186 40 170Z" fill="${C.rosaTief}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M148 70 C196 70 196 140 142 140" fill="none" stroke="${S}" stroke-width="12"/><ellipse cx="90" cy="40" rx="60" ry="12" fill="#6B4A3F" stroke="${S}" stroke-width="5"/>`, {}, root, '0 0 200 200', 190, 190);
  const tape = svg(ART.tape(true), {}, root, '0 0 400 400', 300, 300);
  const sp = svg(sparkle(60, 60, 1.3, C.weiss) + sparkle(150, 26, .7, C.weiss) + sparkle(20, 130, .6, C.beere), {}, root, '0 0 200 170', 200, 170);
  const head = front(bigText(root, 'Ich hab nur *gegrinst.*', { x: 90, y: 200, w: 900, size: 120, t0: 0, step: .07 }));
  return (t) => {
    head.update(t);
    const g = pr(t, .3, 1.1, ease.outCubic);
    const wink = t > D * .55 && t < D * .55 + .45;
    face.querySelector('svg').innerHTML = her({ eyes: wink ? 'wink' : (g > .5 ? 'happy' : 'open'), top: C.weiss, grin: g });
    place(face, 540, 880 + Math.sin(t * 2) * 4, 1 + g * .02, lerp(0, -3, g));
    place(mug, 840, 1190, 1, 0);
    place(tape, 250, 1262, 1, -8);
    const s = pr(t, .7, 1.1, ease.outBack), tw1 = Math.abs(Math.sin(t * 2.6));
    place(sp, 800, 820, s * (.8 + tw1 * .3), t * 25, clamp((t - .7) / .1));
  };
}};
