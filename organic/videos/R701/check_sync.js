#!/usr/bin/env node
/* R701 – prüft, dass die Simulation im Browser (Bild) bitgleich zur Simulation in Node (Ton) läuft. [KI]
 * Nutzung (aus dem Repo-Stamm): node organic/videos/R701/check_sync.js */
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), __dirname] }));
const S = require('./sim.js');
const hash = r => { let h = 0; for (const f of r.frames) for (const v of f) h = (h * 31 + Math.round(v * 1e6)) % 2147483647; let e = 0; for (const x of r.events) e = (e * 31 + Math.round(x.t * 1e6) + Math.round(x.s * 1e3)) % 2147483647; return h + '|' + e + '|' + r.events.length + '|' + r.tWin + '|' + r.tLast + '|' + r.finish.map(f => f.i).join(','); };
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto('about:blank');
  await p.addScriptTag({ path: path.join(__dirname, 'sim.js') });
  const web = await p.evaluate('(' + hash.toString() + ')(R701SIM.simulate(R701SIM.CFG.seed))');
  await b.close();
  const node = hash(S.simulate(S.CFG.seed));
  console.log('Node   :', node); console.log('Browser:', web);
  console.log(node === web ? 'OK – Bild und Ton nutzen exakt denselben Verlauf.' : 'FEHLER – Verlauf weicht ab!');
  process.exit(node === web ? 0 : 1);
})();
