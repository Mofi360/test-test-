const S = require('./sim.js');
const seed = +process.argv[2] || S.CFG.seed, o = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const R = S.simulate(seed, Object.assign({ lite: true }, o)); const hp = new Array(12).fill(100);
console.log('t      ' + S.CFG.months.join('  '));
let line = t => console.log(t.toFixed(1).padStart(5) + '  ' + hp.map(h => String(h <= 0 ? '--' : h).padStart(3)).join('  '));
let nh = 0, sum = 0;
for (const e of R.events) {
  if (e.type === 'hit') { hp[e.m] -= e.dmg; nh++; sum += e.dmg; if (process.argv[4]) console.log(`   ${e.t.toFixed(2)} ${S.CFG.enemies[e.e]} -> ${S.CFG.months[e.m]} -${e.dmg} (s=${e.s.toFixed(0)})`); }
  else if (e.type === 'mm') { hp[e.a] = Math.max(1, hp[e.a] - e.dmg); hp[e.b] = Math.max(1, hp[e.b] - e.dmg); }
  else if (e.type === 'out') line(e.t);
}
console.log('Treffer', nh, 'Ø Schaden', (sum / nh).toFixed(1), 'tWin', R.tWin.toFixed(2), 'Sieger', S.CFG.months[R.winner]);
