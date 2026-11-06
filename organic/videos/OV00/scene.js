const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note } = DT;
SCENES.s1 = { bg: C.rosa, build(root) {
  const hook = bigText(root, 'Ich wollte nur *Lippenstift* auftragen.', { y: 260, size: 118 });
  const mir = svg(ART.mirror(), {}, root, '0 0 400 400', 720, 720);
  const ls = svg(ART.lipstick(), {}, root, '0 0 400 400', 420, 420);
  return (t) => { hook.update(t); place(mir, 540, 1150 + noise(t)*6, tw(t,0,.6,.9,1), 0, pr(t,0,.4));
    place(ls, tw(t,.2,1.2,1100,820,ease.outBack), 1220, 1, tw(t,.2,1.4,30,-18)); };
}};
SCENES.s2 = { bg: C.rosaHell, build(root) {
  const face = svg(ART.face(.55), {}, root, '0 0 400 400', 860, 860);
  const t2 = bigText(root, 'Oberlippe: *weg.*', { y: 240, size: 140 });
  return (t, p) => { t2.update(t); face.querySelector('svg').innerHTML = ART.face(tw(t,.2,1.4,.55,.05,ease.inOutSine));
    place(face, 540, 1040, 1 + p*.06, noise(t,3)); };
}};
SCENES.s3 = { bg: C.rosa, build(root) {
  const card = el('div', { left:'150px', top:'520px', width:'780px', height:'900px', background:'#fff', padding:'40px', boxShadow:'0 30px 60px -20px rgba(0,0,0,.35)' }, root);
  const inner = svg(ART.face(.95,0,1), { left:'40px', top:'40px' }, card, '0 0 400 400', 700, 700);
  const n = note(root, 'ich, mit 32', { x: 300, y: 1440, r: -3, t0: .5 });
  return (t) => { card.style.transform = `rotate(${tw(t,0,.6,-12,-4,ease.outBack)}deg) translateY(${tw(t,0,.6,200,0)}px)`; n.update(t); };
}};
SCENES.s4 = { bg: C.nacht, build(root) {
  const moon = svg(ART.moon(), {}, root, '0 0 400 400', 420, 420);
  const lamp = svg(ART.lamp(1), {}, root, '0 0 400 400', 520, 520);
  const q = bigText(root, 'Was jeden Abend auf meinem *Nachttisch* liegt …', { y: 230, size: 100, color: '#fff', accent: C.rosa });
  const tape = svg(ART.tape(), {}, root, '0 0 400 400', 560, 560);
  return (t) => { q.update(t); place(moon, 820, 760, 1, tw(t,0,4,-6,4,ease.lin)); place(lamp, 300, 1150, 1);
    place(tape, 640, 1260, tw(t,1.2,2,0.01,1,ease.outBack), tw(t,1.2,2.2,30,-8)); };
}};
