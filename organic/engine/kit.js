/* Diva Tape Reel Engine – kit.js  [KI]
 * Serien-Bausteine für Runde 6 (Format G/E/F/C): Quellen-Karte, „Senden an“-Fenster, Fragezeichen-Marker, Cover.
 * Alles deterministisch aus t. Nutzung in scene.js:  const { sourceCard, sendTo, qMark, coverLayout } = KIT;
 */
(function () {
  const { el, svg, C, F, pr, tw, ease, clamp } = DT;

  /** Kleine Quellen-Karte (Name der Quelle im Bild). o: {name, label='Quelle', x=70, y=1250, t0=0, t1=Infinity, dark=false} */
  function sourceCard(parent, o = {}) {
    const dark = !!o.dark;
    const card = el('div', {
      left: (o.x ?? 70) + 'px', top: (o.y ?? 1250) + 'px', display: 'flex', alignItems: 'stretch',
      background: dark ? C.nachtHell : C.weiss, border: `3px solid ${dark ? C.rosa : C.schwarz}`, borderRadius: '4px',
      fontFamily: F.sans, whiteSpace: 'nowrap', transformOrigin: '0 50%',
    }, parent);
    el('div', { position: 'relative', padding: '12px 16px 14px', background: dark ? C.rosa : C.schwarz, color: dark ? C.schwarz : C.weiss, fontSize: '26px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }, card, o.label ?? 'Quelle');
    el('div', { position: 'relative', padding: '10px 22px 14px', color: dark ? C.weiss : C.schwarz, fontSize: (o.size ?? 34) + 'px', fontWeight: 600 }, card, o.name ?? '');
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
    return {
      node: card, update(t) {
        const k = pr(t, t0, t0 + .45, ease.outBack), out = pr(t, t1, t1 + .25);
        card.style.opacity = clamp((t - t0) / .15) * (1 - out);
        card.style.transform = `translateX(${(1 - k) * -80}px) rotate(${-1.5 + (1 - k) * -3}deg)`;
      }
    };
  }

  /** Fragezeichen-Marker (runder Punkt mit „?“). o: {x, y, size=110, t0=0, char='?', fill=C.schwarz, color=C.weiss} */
  function qMark(parent, o = {}) {
    const s = o.size ?? 110;
    const d = el('div', {
      left: ((o.x ?? 540) - s / 2) + 'px', top: ((o.y ?? 600) - s / 2) + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%',
      background: o.fill ?? C.schwarz, color: o.color ?? C.weiss, fontFamily: F.display, fontSize: (s * .68) + 'px', lineHeight: (s * .96) + 'px', textAlign: 'center',
    }, parent, o.char ?? '?');
    const t0 = o.t0 ?? 0;
    return {
      node: d, update(t) {
        const k = pr(t, t0, t0 + .4, ease.outBack);
        d.style.opacity = clamp((t - t0) / .1);
        d.style.transform = `scale(${k}) rotate(${Math.sin((t - t0) * 2.2 + (o.x ?? 0)) * 5}deg)`;
      }
    };
  }

  /** „Senden an“-Fenster: Blatt fährt von unten hoch, ein Kontakt wird angetippt.
   * o: {contacts:['Mama','Lena','Schwester','Mitbewohnerin'], pick=1, t0=0, top=1010, title='Senden an'} */
  function sendTo(parent, o = {}) {
    const contacts = o.contacts ?? ['Mama', 'Lena', 'Schwester', 'Mitbewohnerin'];
    const pick = o.pick ?? 1, top = o.top ?? 1010, t0 = o.t0 ?? 0;
    const sheet = el('div', { left: '0px', top: top + 'px', width: '1080px', height: (1920 - top + 60) + 'px', background: C.weiss, borderRadius: '44px 44px 0 0', boxShadow: '0 -18px 50px -18px rgba(21,16,18,.35)' }, parent);
    el('div', { left: '470px', top: '20px', width: '140px', height: '10px', borderRadius: '5px', background: '#d9cdd1' }, sheet);
    el('div', { left: '0px', top: '54px', width: '1080px', textAlign: 'center', fontFamily: F.sans, fontWeight: 700, fontSize: '44px', color: C.schwarz }, sheet, o.title ?? 'Senden an');
    const fills = [C.rosaTief, C.schwarz, C.rosa, C.beere, C.rosaHell];
    const n = contacts.length, gap = 900 / n;
    const items = contacts.map((name, i) => {
      const cx = 90 + gap * (i + .5);
      const wrap = el('div', { left: (cx - 110) + 'px', top: '150px', width: '220px', height: '300px' }, sheet);
      const f = fills[i % fills.length], light = (f === C.rosa || f === C.rosaHell || f === C.rosaTief);
      const av = el('div', { left: '30px', top: '0px', width: '160px', height: '160px', borderRadius: '50%', background: f, color: light ? C.schwarz : C.weiss, fontFamily: F.display, fontSize: '84px', lineHeight: '152px', textAlign: 'center' }, wrap, name[0]);
      el('div', { left: '-20px', top: '178px', width: '260px', textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: (name.length > 9 ? 29 : 36) + 'px', color: C.schwarz }, wrap, name);
      const badge = el('div', { left: '138px', top: '104px', width: '64px', height: '64px', borderRadius: '50%', background: C.beere, border: `5px solid ${C.weiss}` }, wrap,
        `<svg viewBox="0 0 400 400" width="54" height="54">${DT.ART.check(C.weiss)}</svg>`);
      return { wrap, av, badge };
    });
    const sent = el('div', { left: '0px', top: '432px', width: '1080px', textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: '64px', color: C.beere }, sheet, 'Gesendet.');
    // Finger-Punkt
    const tap = el('div', { left: '0px', top: '0px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(21,16,18,.18)', border: '5px solid rgba(21,16,18,.5)' }, sheet);
    const px = 90 + gap * (pick + .5), tTap = t0 + 1.15;
    return {
      node: sheet, tapTime: tTap, update(t) {
        const k = pr(t, t0, t0 + .5, ease.outCubic);
        sheet.style.transform = `translateY(${(1 - k) * (1920 - top + 80)}px)`;
        sheet.style.opacity = t >= t0 ? 1 : 0;
        items.forEach((it, i) => {
          const a = pr(t, t0 + .25 + i * .08, t0 + .6 + i * .08, ease.outBack);
          it.wrap.style.opacity = clamp((t - t0 - .25 - i * .08) / .12);
          const press = i === pick ? 1 - .1 * clamp(1 - Math.abs(t - tTap) / .14) : 1;
          it.wrap.style.transform = `translateY(${(1 - a) * 50}px) scale(${press})`;
          const b = i === pick ? pr(t, tTap + .05, tTap + .35, ease.outBack) : 0;
          it.badge.style.transform = `scale(${b})`; it.badge.style.opacity = b > 0 ? 1 : 0;
        });
        const m = pr(t, t0 + .65, tTap, ease.inOutCubic), gone = pr(t, tTap + .15, tTap + .4);
        tap.style.opacity = clamp((t - t0 - .65) / .1) * (1 - gone);
        tap.style.transform = `translate(${tw(m, 0, 1, 820, px - 60, ease.lin)}px, ${tw(m, 0, 1, 520, 170, ease.lin)}px) scale(${1 - .25 * clamp(1 - Math.abs(t - tTap) / .14)})`;
        const s = pr(t, tTap + .3, tTap + .6);
        sent.style.opacity = s; sent.style.transform = `rotate(-2deg) translateY(${(1 - s) * 16}px)`;
      }
    };
  }

  /** Einheitliches Cover (Serien-Look). Text bleibt im mittleren 3:4-Ausschnitt (y 300–1560).
   * o: {lines:['Dieses *Symbol*','ignorierst du'], teaser:'…und es steht auf jedem Lippenstift', art:'<svg-markup>', artBox:'0 0 400 400', artSize:560, artY:1020, bg=C.rosa, size=128, marks:[{x,y}]} */
  function coverLayout(parent, o = {}) {
    const bg = o.bg ?? C.rosa, dark = bg === C.nacht || bg === C.schwarz;
    DT.paper(parent, bg);
    const box = el('div', { left: '70px', top: (o.textY ?? 330) + 'px', width: '940px', textAlign: 'center', fontFamily: F.display, fontSize: (o.size ?? 128) + 'px', lineHeight: 1.08, letterSpacing: '-2px', color: dark ? C.weiss : C.schwarz }, parent);
    (o.lines ?? []).forEach(line => {
      const row = el('div', { position: 'relative' }, box);
      row.innerHTML = line.replace(/\*([^*]+)\*/g, (_, w) => `<span style="display:inline-block;background:${dark ? C.rosa : C.schwarz};color:${dark ? C.schwarz : C.rosa};padding:0 26px 10px;transform:rotate(-2deg);border-radius:6px">${w}</span>`);
    });
    if (o.art) {
      const s = o.artSize ?? 560;
      const a = svg(o.art, {}, parent, o.artBox ?? '0 0 400 400', s, s);
      DT.place(a, o.artX ?? 540, o.artY ?? 1020, 1, o.artRot ?? 0);
    }
    (o.marks ?? []).forEach(m => { const q = qMark(parent, { x: m.x, y: m.y, size: m.size ?? 120, char: m.char ?? '?', fill: dark ? C.rosa : C.schwarz, color: dark ? C.schwarz : C.weiss }); q.update(9); q.node.style.transform = `rotate(${m.r ?? -6}deg)`; });
    if (o.teaser) {
      const t = el('div', { left: '0px', top: (o.teaserY ?? 1340) + 'px', width: '1080px', textAlign: 'center' }, parent);
      el('div', { position: 'relative', display: 'inline-block', background: C.weiss, border: `4px solid ${C.schwarz}`, borderRadius: '6px', padding: '18px 34px 24px', fontFamily: F.sans, fontWeight: 700, fontSize: '50px', color: C.schwarz, transform: 'rotate(-1.5deg)', maxWidth: '900px', lineHeight: 1.1 }, t, o.teaser);
    }
  }

  window.KIT = { sourceCard, qMark, sendTo, coverLayout };
})();
