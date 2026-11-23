#!/usr/bin/env node
/* R702 – Seed-Suche mit Bewertung. [KI]
 * node seed_search.js [von] [bis]   → beste Seeds + Verlauf.   node seed_search.js stats 300 → Verteilung (Tuning) */
const S = require('./sim.js');
function evalSeed(seed, o) {
  const R = S.simulate(seed, Object.assign({ lite: true }, o || {}));
  if (R.tWin < 0) return null;
  const ts = R.outs.map(x => x.t), gaps = ts.map((t, i) => i ? t - ts[i - 1] : t);
  const finale = ts[10] - ts[9], wHp = R.hpEnd[R.winner];
  // „knapp überlebt“: unter 10 % gefallen und danach noch > 4 s im Spiel
  let close = 0, closeBest = 0;
  for (let i = 0; i < 12; i++) if (R.lowT[i] >= 0) { const end = R.outT[i] >= 0 ? R.outT[i] : R.tWin; const d = end - R.lowT[i]; if (d > 4) close++; if (d > closeBest) closeBest = d; }
  const hits = R.events.filter(e => e.type === 'hit');
  const firstHit = hits.length ? hits[0].t : 99;
  // Führungswechsel im Finale: wer hat mehr HP
  const fin = R.outs[10].i; let hpW = null, hpL = null, lead = 0, last = 0, minW = 100;
  const hpAt = {}; 
  // HP-Verlauf der beiden Finalisten aus den Ereignissen rekonstruieren
  const hp = new Array(12).fill(100); let wMaxFinal = 0, lMaxFinal = 0, started = false;
  for (const e of R.events) {
    if (e.type === 'hit') hp[e.m] -= e.dmg; else if (e.type === 'mm') { hp[e.a] -= e.dmg; hp[e.b] -= e.dmg; }
    if (!started && e.t >= ts[9]) { started = true; hpW = hp[R.winner]; hpL = hp[fin]; }
    if (started) { const l = hp[R.winner] > hp[fin] ? 1 : hp[R.winner] < hp[fin] ? -1 : last; if (last && l !== last) lead++; last = l; }
  }
  let score = 0; const why = [];
  const hard = [];
  if (ts[0] > 5) hard.push('erste>5');
  if (finale < 5) hard.push('finale<5');
  if (wHp >= 35) hard.push('siegerHP');
  if (!close) hard.push('keinKnapp');
  if (R.tWin < 30 || R.tWin > 38.5) hard.push('dauer');
  for (let i = 1; i < 10; i++) { const gp = gaps[i]; if (gp < 1.0) hard.push('gap<1'); if (gp > 4.6) hard.push('gap>4.6'); score -= gp < 2 ? (2 - gp) * 3 : gp > 4 ? (gp - 4) * 4 : 0; }
  score -= Math.max(0, finale - 8) * 3;
  score += Math.min(3, lead) * 2;                 // Führungswechsel im Finale
  score += (35 - wHp) / 6;                        // knapper Sieg
  score += hpL != null && hpW != null ? -Math.abs(hpW - hpL) / 8 : 0; // Finale startet ausgeglichen
  score += Math.min(2, close) * 1.5 + Math.min(3, closeBest - 4);
  score -= Math.max(0, firstHit - 0.6) * 4;       // früh der erste Treffer
  score -= Math.max(0, ts[0] - 4) * 2;
  // letzter Treffer vor Sieg: Sieger war selbst kurz vor dem Aus
  return { seed, R, ts, gaps, finale, wHp, hpW, hpL, lead, close, closeBest, firstHit, hard, score, nHits: hits.length };
}
const fmt = r => `Seed ${r.seed}  Score ${r.score.toFixed(1)}  tWin ${r.R.tWin.toFixed(2)}  Finale ${r.finale.toFixed(1)} s (Start ${r.hpW}/${r.hpL} HP, ${r.lead} Führungswechsel)  Sieger ${S.CFG.months[r.R.winner]} mit ${r.wHp} HP  knapp×${r.close} (max ${r.closeBest.toFixed(1)} s)  1.Treffer ${r.firstHit.toFixed(2)}  Treffer ${r.nHits}\n   raus: ${r.R.outs.map(o => `${S.CFG.months[o.i]}@${o.t.toFixed(1)}`).join(' ')}\n   Abstände: ${r.gaps.map(x => x.toFixed(1)).join(' ')}`;
if (process.argv[2] === 'stats') {
  const n = +process.argv[3] || 200; let ok = 0; const acc = { tWin: [], first: [], finale: [], maxgap: [], hits: [] }; const fail = {};
  for (let s = 1; s <= n; s++) { const r = evalSeed(s); if (!r) { fail.noend = (fail.noend || 0) + 1; continue; } acc.tWin.push(r.R.tWin); acc.first.push(r.ts[0]); acc.finale.push(r.finale); acc.maxgap.push(Math.max(...r.gaps.slice(1, 10))); acc.hits.push(r.nHits); if (!r.hard.length) ok++; new Set(r.hard).forEach(h => fail[h] = (fail[h] || 0) + 1); }
  const q = a => { a.sort((x, y) => x - y); return [0.1, 0.5, 0.9].map(p => a[Math.floor(p * (a.length - 1))].toFixed(1)).join('/'); };
  console.log(`n=${n} ok=${ok}  tWin ${q(acc.tWin)}  erste ${q(acc.first)}  finale ${q(acc.finale)}  maxgap ${q(acc.maxgap)} hits ${q(acc.hits)}`, fail);
} else if (require.main === module) {
  const a = +process.argv[2] || 1, b = +process.argv[3] || 3000, good = [];
  for (let s = a; s <= b; s++) { const r = evalSeed(s); if (r && !r.hard.length) good.push(r); }
  good.sort((x, y) => y.score - x.score);
  console.log(`${good.length} von ${b - a + 1} Seeds erfüllen alle harten Kriterien.`);
  good.slice(0, 8).forEach(r => console.log(fmt(r)));
}
module.exports = { evalSeed, fmt };
