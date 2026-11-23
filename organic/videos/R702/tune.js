const { evalSeed } = require('./seed_search.js');
const sets = JSON.parse(process.argv[2]); const n = +process.argv[3] || 150;
for (const o of sets) {
  let ok = 0; const acc = { tWin: [], first: [], finale: [], maxgap: [], mingap: [], hits: [] }; const fail = {};
  for (let s = 1; s <= n; s++) { const r = evalSeed(s, o); if (!r) { fail.noend = (fail.noend || 0) + 1; continue; } acc.tWin.push(r.R.tWin); acc.first.push(r.ts[0]); acc.finale.push(r.finale); acc.maxgap.push(Math.max(...r.gaps.slice(1, 10))); acc.mingap.push(Math.min(...r.gaps.slice(1, 10))); acc.hits.push(r.nHits); if (!r.hard.length) ok++; new Set(r.hard).forEach(h => fail[h] = (fail[h] || 0) + 1); }
  const q = a => { a.sort((x, y) => x - y); return a.length ? [0.1, 0.5, 0.9].map(p => a[Math.floor(p * (a.length - 1))].toFixed(1)).join('/') : '-'; };
  console.log(JSON.stringify(o), `\n  ok=${ok} tWin ${q(acc.tWin)} erste ${q(acc.first)} finale ${q(acc.finale)} maxgap ${q(acc.maxgap)} mingap ${q(acc.mingap)} hits ${q(acc.hits)}`, JSON.stringify(fail));
}
