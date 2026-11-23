#!/usr/bin/env node
/* R702 – schreibt video.json passend zum Seed in sim.js (Dauer = Sieg + Schlussbild). [KI] */
const fs = require('fs'), path = require('path'), S = require('./sim.js');
const R = S.simulate(S.CFG.seed), T = R.total, o = R.outs.map(x => x.t), TW = R.tWin;
const r2 = v => Math.round(v * 100) / 100;
const pts = [0, 0.5, 1, 2, r2(o[0] + 0.2), r2(o[1] - 0.6), 9.2, r2(S.CFG.shrinkT0 + 0.4), r2(o[4] + 0.1), r2(o[6] + 0.35), r2(o[8] - 0.4), r2(o[9] + 1.2), r2(TW - 2.5), r2(TW - 0.3), r2(TW + 0.3), r2(TW + 1.1), r2(TW + 2.2), r2(TW + 3.4), r2(TW + 5.0), r2(T - 0.15)];
const V = { id: 'R702', titel: 'Dein Geburtsmonat kämpft. Wessen Lippenstift überlebt? (Battle-Royale-Simulation)', format: 'Battle-Royale-Simulation, ohne Stimme, Ton aus make_sfx.js (gleiche Simulation wie das Bild)',
  seed: S.CFG.seed, voice_duration: Math.round((T - 0.9 - 0.0005) * 10000) / 10000, endcard: false, loop: true, noCaptions: true, scenes: [{ id: 's1', text: 'x', hold: 0.35 }], preview_times: pts };
fs.writeFileSync(path.join(__dirname, 'video.json'), JSON.stringify(V, null, 1));
console.log('video.json: Seed', S.CFG.seed, 'Dauer', T.toFixed(2), 'voice_duration', V.voice_duration);
