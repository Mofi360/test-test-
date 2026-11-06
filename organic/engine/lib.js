/* Diva Tape Reel Engine – lib.js  [KI]
 * Deterministische Animation: alles hängt nur von der Zeit t ab (Sekunden).
 * Canvas 1080x1920. Jede Szene: build(root, ctx) -> update(t, p)  (t = Sekunden seit Szenenstart, p = 0..1)
 */
(function () {
  const W = 1080, H = 1920;
  const C = {
    rosa: '#F4C3CF',      // Grundfläche
    rosaTief: '#E792A8',  // Tape-Pad, Flächen
    rosaHell: '#FBE3E9',
    beere: '#C2466A',     // sparsamer Akzent
    schwarz: '#151012',
    weiss: '#FFFFFF',
    haut: '#F1C9B5', hautDunkel: '#D9A68E',
    lippe: '#C9627A', lippeHell: '#DE8C9E',
    nacht: '#1C1420', nachtHell: '#2C2131',
  };
  const F = { display: "'Gloock', serif", sans: "'Bricolage Grotesque', sans-serif", hand: "'Caveat', cursive" };

  // ---------- Mathe ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = {
    lin: k => k,
    outCubic: k => 1 - Math.pow(1 - k, 3),
    inCubic: k => k * k * k,
    inOutSine: k => -(Math.cos(Math.PI * k) - 1) / 2,
    inOutCubic: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outBack: k => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    outElastic: k => (k === 0 || k === 1) ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI) / 3) + 1,
  };
  /** Wert zwischen t0 und t1 von a nach b */
  const tw = (t, t0, t1, a, b, e = ease.outCubic) => lerp(a, b, e(clamp((t - t0) / Math.max(1e-6, t1 - t0))));
  /** 0..1 Fortschritt */
  const pr = (t, t0, t1, e = ease.outCubic) => e(clamp((t - t0) / Math.max(1e-6, t1 - t0)));
  // deterministisches "Zittern" (Handkamera-Gefühl)
  const noise = (t, seed = 1) => Math.sin(t * 1.3 + seed) * .5 + Math.sin(t * 2.7 + seed * 2.1) * .3 + Math.sin(t * 5.1 + seed * 3.7) * .2;

  // ---------- DOM ----------
  function el(tag, style = {}, parent, html) {
    const e = document.createElement(tag);
    Object.assign(e.style, { position: 'absolute' }, style);
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function svg(markup, style = {}, parent, viewBox = '0 0 400 400', w = 400, h = 400) {
    const d = el('div', Object.assign({ width: w + 'px', height: h + 'px' }, style), parent);
    d.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" style="overflow:visible">${markup}</svg>`;
    return d;
  }
  /** transform helper: x,y = Mittelpunkt-Position in px, s = scale, r = rotation deg */
  function place(e, x, y, s = 1, r = 0, o = 1) {
    const w = e.offsetWidth || parseFloat(e.style.width) || 0, h = e.offsetHeight || parseFloat(e.style.height) || 0;
    e.style.left = '0px'; e.style.top = '0px';
    e.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${r}deg) scale(${s})`;
    e.style.opacity = o;
  }

  // ---------- Illustrationen (SVG-Markup, viewBox 0 0 400 400 wenn nicht anders) ----------
  const ART = {
    /** Lippen. fullness 0..1 (0 = schmal, 1 = voll, ohne Übertreibung) */
    lips(fullness = .6, color = C.lippe) {
      const up = lerp(18, 40, fullness), lo = lerp(26, 52, fullness);
      return `<g transform="translate(200 200)">
        <path d="M-150 0 C-110 ${-up * .6} -60 ${-up * 1.35} -22 ${-up} C-10 ${-up * .7} 10 ${-up * .7} 22 ${-up} C60 ${-up * 1.35} 110 ${-up * .6} 150 0 C90 6 40 4 0 8 C-40 4 -90 6 -150 0Z" fill="${color}"/>
        <path d="M-150 0 C-90 6 -40 4 0 8 C40 4 90 6 150 0 C110 ${lo * .9} 50 ${lo * 1.25} 0 ${lo * 1.2} C-50 ${lo * 1.25} -110 ${lo * .9} -150 0Z" fill="${color}" opacity=".92"/>
        <path d="M-150 0 C-90 6 -40 4 0 8 C40 4 90 6 150 0" fill="none" stroke="${C.schwarz}" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="-38" cy="${lo * .55}" rx="26" ry="${lo * .14 + 2}" fill="#fff" opacity=".28"/>
      </g>`;
    },
    /** Diva Tape: Baumwoll-Tape mit Pflege-Mitte und Sicherheitsloch */
    tape(withPad = true) {
      return `<g transform="translate(200 200)">
        <rect x="-170" y="-62" width="340" height="124" rx="58" fill="#FFF7F4" stroke="${C.schwarz}" stroke-opacity=".12" stroke-width="3"/>
        <g opacity=".18" stroke="${C.schwarz}" stroke-width="1.5">${Array.from({ length: 14 }, (_, i) => `<line x1="${-150 + i * 22}" y1="-52" x2="${-160 + i * 22}" y2="52"/>`).join('')}</g>
        ${withPad ? `<rect x="-92" y="-34" width="184" height="68" rx="34" fill="${C.rosaTief}"/>
        <rect x="-80" y="-24" width="70" height="14" rx="7" fill="#fff" opacity=".35"/>` : ''}
        <ellipse cx="0" cy="0" rx="12" ry="9" fill="${C.schwarz}" opacity=".85"/>
      </g>`;
    },
    moon(color = '#F7E7C6') {
      return `<path d="M250 70 A140 140 0 1 0 330 300 A115 115 0 1 1 250 70Z" fill="${color}"/>`;
    },
    star(x, y, s = 1, color = '#F7E7C6') {
      return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z" fill="${color}"/>`;
    },
    lipstick(color = C.beere) {
      return `<g transform="translate(200 210)">
        <rect x="-38" y="20" width="76" height="140" rx="10" fill="${C.schwarz}"/>
        <rect x="-38" y="20" width="76" height="22" fill="#3a2e33"/>
        <rect x="-30" y="-40" width="60" height="64" fill="#d8c3a5"/>
        <path d="M-24 -40 L-24 -120 L24 -150 L24 -40Z" fill="${color}"/>
        <path d="M-24 -120 L24 -150" stroke="#fff" stroke-opacity=".35" stroke-width="5"/>
      </g>`;
    },
    mirror() {
      return `<g transform="translate(200 200)">
        <ellipse cx="0" cy="0" rx="150" ry="190" fill="#E9EEF0" stroke="${C.schwarz}" stroke-width="14"/>
        <path d="M-90 -120 L-40 -170 M-110 -70 L-30 -150" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>
      </g>`;
    },
    phone(screen = '#fff') {
      return `<g transform="translate(200 200)"><rect x="-110" y="-200" width="220" height="400" rx="34" fill="${C.schwarz}"/>
        <rect x="-98" y="-186" width="196" height="372" rx="24" fill="${screen}"/><rect x="-26" y="-178" width="52" height="12" rx="6" fill="${C.schwarz}"/></g>`;
    },
    lamp(on = 1) {
      return `<g transform="translate(200 200)">
        <defs><radialGradient id="lg"><stop offset="0" stop-color="#FFE7B0" stop-opacity="${.55 * on}"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient></defs><circle cx="0" cy="0" r="230" fill="url(#lg)"/>
        <path d="M-80 -60 L80 -60 L110 40 L-110 40Z" fill="#F6E3D3" stroke="${C.schwarz}" stroke-width="6"/>
        <rect x="-8" y="40" width="16" height="110" fill="${C.schwarz}"/><rect x="-70" y="146" width="140" height="18" rx="9" fill="${C.schwarz}"/>
      </g>`;
    },
    pillow(color = C.rosaHell) {
      return `<path d="M40 150 C60 100 340 100 360 150 C380 200 380 250 360 290 C340 330 60 330 40 290 C20 250 20 200 40 150Z" fill="${color}" stroke="${C.schwarz}" stroke-opacity=".15" stroke-width="4"/>
        <path d="M110 170 C150 190 250 190 290 170" stroke="${C.schwarz}" stroke-opacity=".12" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    },
    drop(color = '#BFE3F2') {
      return `<path d="M200 70 C240 140 290 190 290 250 A90 90 0 0 1 110 250 C110 190 160 140 200 70Z" fill="${color}"/><path d="M160 240 A40 40 0 0 0 190 290" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>`;
    },
    heater() {
      return `<g transform="translate(200 200)"><rect x="-160" y="-100" width="320" height="200" rx="16" fill="#EDEDED" stroke="${C.schwarz}" stroke-width="8"/>
        ${Array.from({ length: 7 }, (_, i) => `<rect x="${-140 + i * 41}" y="-86" width="24" height="172" rx="10" fill="#fff" stroke="${C.schwarz}" stroke-opacity=".3" stroke-width="3"/>`).join('')}</g>`;
    },
    /** Schublade/Haufen alter Lippenprodukte */
    jar(color = C.rosaTief) {
      return `<g transform="translate(200 220)"><rect x="-90" y="-70" width="180" height="40" rx="12" fill="${C.schwarz}"/><rect x="-80" y="-34" width="160" height="110" rx="20" fill="${color}"/><rect x="-60" y="0" width="120" height="30" rx="8" fill="#fff" opacity=".7"/></g>`;
    },
    heart(color = C.beere) { return `<path d="M200 330 C80 250 60 190 90 140 C120 95 180 105 200 150 C220 105 280 95 310 140 C340 190 320 250 200 330Z" fill="${color}"/>`; },
    check(color = C.schwarz) { return `<path d="M90 210 L170 290 L320 120" fill="none" stroke="${color}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>`; },
    cross(color = C.schwarz) { return `<path d="M110 110 L290 290 M290 110 L110 290" fill="none" stroke="${color}" stroke-width="34" stroke-linecap="round"/>`; },
    syringe() {
      return `<g transform="translate(200 200) rotate(-35)"><rect x="-120" y="-26" width="200" height="52" rx="8" fill="#E9F1F5" stroke="${C.schwarz}" stroke-width="7"/>
        <rect x="80" y="-8" width="90" height="16" fill="${C.schwarz}"/><rect x="-160" y="-40" width="40" height="80" rx="6" fill="${C.schwarz}"/><line x1="170" y1="0" x2="215" y2="0" stroke="${C.schwarz}" stroke-width="5"/></g>`;
    },
    clock() {
      return `<circle cx="200" cy="200" r="150" fill="#fff" stroke="${C.schwarz}" stroke-width="14"/><path d="M200 200 L200 110 M200 200 L262 236" stroke="${C.schwarz}" stroke-width="14" stroke-linecap="round"/>`;
    },
  };

  /** Gezeichnetes Gesicht (nur untere Gesichtshälfte, stilisiert) mit Lippen, für Spiegel-/Selfie-Szenen. tape: 0..1 sichtbar */
  ART.face = function (fullness = .5, tape = 0, smile = 0) {
    return `<g>
      <path d="M40 0 L360 0 L360 230 C360 330 280 400 200 400 C120 400 40 330 40 230Z" fill="${C.haut}"/>
      <path d="M186 30 C190 70 186 92 172 104 C190 112 210 112 228 104 C214 92 210 70 214 30" fill="none" stroke="${C.hautDunkel}" stroke-width="5" stroke-linecap="round"/>
      <path d="M150 352 C180 368 220 368 250 352" fill="none" stroke="${C.hautDunkel}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      <g transform="translate(0 ${36 - smile * 6}) scale(1 ${1 - smile * .15})" transform-origin="200 200">${ART.lips(fullness)}</g>
      <g opacity="${tape}" transform="translate(200 238) scale(.62) translate(-200 -200)">${ART.tape(true)}</g>
    </g>`;
  };

  // ---------- Text-Bausteine ----------
  /** Großer Satz, Wort für Wort. Gibt {node, update(t)} zurück. */
  function bigText(parent, text, o = {}) {
    const box = el('div', Object.assign({
      left: (o.x ?? 90) + 'px', top: (o.y ?? 600) + 'px', width: (o.w ?? 900) + 'px',
      fontFamily: o.font ?? F.display, fontSize: (o.size ?? 110) + 'px', lineHeight: o.lh ?? 1.02,
      color: o.color ?? C.schwarz, textAlign: o.align ?? 'left', letterSpacing: (o.ls ?? -1) + 'px', fontWeight: o.weight ?? 400,
    }, o.style || {}), parent);
    const words = text.split(' ');
    const spans = words.map(w => {
      const s = document.createElement('span');
      s.style.display = 'inline-block'; s.style.whiteSpace = 'pre';
      // *wort* = Akzentfarbe
      if (/^\*.*\*[.,!?:]?$/.test(w)) { s.textContent = w.replace(/\*/g, ''); s.style.color = o.accent ?? C.beere; }
      else s.textContent = w;
      box.appendChild(s); box.appendChild(document.createTextNode(' '));
      return s;
    });
    const t0 = o.t0 ?? 0, step = o.step ?? .09;
    return {
      node: box, update(t) {
        spans.forEach((s, i) => {
          const k = pr(t, t0 + i * step, t0 + i * step + .45, ease.outBack);
          s.style.opacity = clamp((t - t0 - i * step) / .15);
          s.style.transform = `translateY(${(1 - k) * 60}px) rotate(${(1 - k) * (i % 2 ? 4 : -4)}deg)`;
        });
      }
    };
  }

  /** Handschrift-Notiz mit Pfeil */
  function note(parent, text, o = {}) {
    const n = el('div', { left: (o.x ?? 120) + 'px', top: (o.y ?? 400) + 'px', fontFamily: F.hand, fontSize: (o.size ?? 74) + 'px', color: o.color ?? C.schwarz, fontWeight: 700, transform: `rotate(${o.r ?? -4}deg)`, whiteSpace: 'pre' }, parent, text);
    let arrow = null;
    if (o.arrow) {
      const [dx, dy] = o.arrow; // Pfeilende relativ zur Notiz
      arrow = svg(`<path d="M10 10 C ${dx * .3} ${dy * .1}, ${dx * .7} ${dy * .4}, ${dx} ${dy}" fill="none" stroke="${o.color ?? C.schwarz}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
        <path d="M${dx - 30} ${dy - 10} L${dx} ${dy} L${dx - 8} ${dy - 34}" fill="none" stroke="${o.color ?? C.schwarz}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`,
        { left: ((o.x ?? 120) + (o.ax ?? 40)) + 'px', top: ((o.y ?? 400) + (o.ay ?? 90)) + 'px' }, parent, `0 0 ${Math.abs(dx) + 60} ${Math.abs(dy) + 60}`, Math.abs(dx) + 60, Math.abs(dy) + 60);
    }
    const t0 = o.t0 ?? 0;
    return {
      node: n, update(t) {
        const k = pr(t, t0, t0 + .5);
        n.style.opacity = k; n.style.clipPath = `inset(0 ${100 - k * 100}% 0 0)`;
        if (arrow) {
          const a = pr(t, t0 + .3, t0 + .9);
          const ps = arrow.querySelectorAll('path'); ps[0].setAttribute('stroke-dashoffset', 1 - a); ps[1].setAttribute('opacity', a > .95 ? 1 : 0);
        }
      }
    };
  }

  /** Zitat-Karte für echte Kundinnen-Zitate (Wortlaut!) */
  function quoteCard(parent, quote, source, o = {}) {
    const card = el('div', { left: (o.x ?? 90) + 'px', top: (o.y ?? 560) + 'px', width: (o.w ?? 900) + 'px', padding: '56px 60px 48px', background: C.weiss, boxSizing: 'border-box', borderRadius: '6px', boxShadow: '0 30px 60px -20px rgba(21,16,18,.35)' }, parent);
    el('div', { position: 'relative', fontFamily: F.display, fontSize: (o.size ?? 64) + 'px', lineHeight: 1.12, color: C.schwarz }, card, '„' + quote + '“');
    el('div', { position: 'relative', marginTop: '30px', fontFamily: F.sans, fontSize: '34px', fontWeight: 500, color: '#6b5a60' }, card, source);
    // Tape-Streifen oben
    const strip = el('div', { left: '50%', top: '-34px', width: '260px', height: '64px', marginLeft: '-130px', background: 'rgba(231,146,168,.85)', transform: 'rotate(-3deg)' }, card);
    const t0 = o.t0 ?? 0;
    return { node: card, update(t) { const k = pr(t, t0, t0 + .6, ease.outBack); card.style.opacity = clamp((t - t0) / .2); card.style.transform = `translateY(${(1 - k) * 120}px) rotate(${(1 - k) * -5 + (o.r ?? -1.5)}deg)`; } };
  }

  /** Aufzählungs-Liste mit Haken/Kreuz */
  function list(parent, items, o = {}) {
    const box = el('div', { left: (o.x ?? 110) + 'px', top: (o.y ?? 640) + 'px', width: (o.w ?? 860) + 'px' }, parent);
    const rows = items.map((it, i) => {
      const r = el('div', { position: 'relative', display: 'flex', alignItems: 'center', gap: '34px', marginBottom: '44px', fontFamily: F.sans, fontWeight: 600, fontSize: (o.size ?? 62) + 'px', lineHeight: 1.1, color: C.schwarz }, box);
      const ic = el('div', { position: 'relative', width: '86px', height: '86px', flex: '0 0 86px' }, r);
      ic.innerHTML = `<svg viewBox="0 0 400 400" width="86" height="86">${(it.no ? ART.cross : ART.check)(it.no ? C.beere : C.schwarz)}</svg>`;
      el('div', { position: 'relative', textDecoration: it.strike ? 'line-through' : 'none' }, r, it.text);
      return r;
    });
    const t0 = o.t0 ?? 0, step = o.step ?? .55;
    return { node: box, update(t) { rows.forEach((r, i) => { const k = pr(t, t0 + i * step, t0 + i * step + .4, ease.outBack); r.style.opacity = clamp((t - t0 - i * step) / .15); r.style.transform = `translateX(${(1 - k) * -80}px)`; }); } };
  }

  // ---------- Hintergrund ----------
  function paper(parent, color = C.rosa) {
    const bg = el('div', { left: 0, top: 0, width: W + 'px', height: H + 'px', background: color }, parent);
    // feines Papierkorn
    svg(`<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/></filter><rect width="1080" height="1920" filter="url(#n)"/>`, { left: 0, top: 0 }, bg, `0 0 ${W} ${H}`, W, H);
    return bg;
  }

  window.DT = { W, H, C, F, clamp, lerp, ease, tw, pr, noise, el, svg, place, ART, bigText, note, quoteCard, list, paper };
})();
