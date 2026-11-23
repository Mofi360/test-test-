#!/usr/bin/env node
/* R701 – Seed-Suche mit Bewertung der Dramaturgie. [KI]
 * Nutzung: node organic/videos/R701/seed_search.js [von] [bis]   → Bestenliste + seed_search.json
 * Harte Bedingungen: alle 12 im Ziel, ≥ 5 Führungswechsel, Stau im Trichter, später Führungswechsel (letzte 6 s),
 * knapper Zieleinlauf der ersten zwei, höchstens 2 Anti-Stuck-Stöße, das Feld kommt geschlossen an. */
const fs = require('fs'), path = require('path');
const S = require('./sim.js');
const T = S.TRACK, n = S.CFG.n;

function analyse(seed) {
  const R = S.simulate(seed);
  if (!R.ok) return { seed, ok: false };
  const fps = S.CFG.fps, fW = Math.floor(R.tWin * fps);
  const lc = R.leadChanges.slice(1);                       // der erste Eintrag ist nur „wer führt zuerst“
  const winner = R.finish[0].i;
  const gap12 = R.finish[1].t - R.finish[0].t, gap23 = R.finish[2].t - R.finish[1].t;
  const lastLc = lc.length ? lc[lc.length - 1] : null;
  const late = lc.filter(c => c.t > R.tWin - 6).length;
  // Stau: wie lange stecken ≥ 5 Murmeln gleichzeitig im Trichter?
  let jam = 0, jamMax = 0;
  for (let f = 0; f < fW; f++) { let k = 0; for (let i = 0; i < n; i++) { const y = R.frames[f][i * 2 + 1]; if (y > T.funnel.y0 - 120 && y < T.funnel.yNeck + 20) k++; } if (k >= 5) jam++; if (k > jamMax) jamMax = k; }
  jam /= fps;
  // Platz des späteren Siegers 6 s und 3 s vor dem Ziel
  const rankAt = (t, who) => { const f = R.frames[Math.max(0, Math.floor(t * fps))]; let r = 1; for (let i = 0; i < n; i++) if (f[i * 2 + 1] > f[who * 2 + 1]) r++; return r; };
  const wRank6 = rankAt(R.tWin - 6, winner), wRank3 = rankAt(R.tWin - 3, winner);
  // Dichte des Spitzenfelds: mittlerer Abstand Platz 1 → Platz 6
  let tight = 0, cnt = 0, lone = 0;
  for (let f = 60; f < fW; f += 6) { const ys = []; for (let i = 0; i < n; i++) ys.push(R.frames[f][i * 2 + 1]); ys.sort((a, b) => b - a); tight += ys[0] - ys[5]; if (ys[0] - ys[1] > 450) lone++; cnt++; }
  tight /= cnt; lone = lone * 6 / fps;                      // Sekunden, in denen die Spitze allein enteilt ist
  let maxFinGap = 0; for (let k = 1; k < n; k++) maxFinGap = Math.max(maxFinGap, R.finish[k].t - R.finish[k - 1].t);
  const leaders = new Set(R.leadChanges.map(c => c.a)).size;
  // längste Phase ohne Führungswechsel (Langeweile-Maß)
  let maxLcGap = 0; { let prev = R.leadChanges[0].t; for (const c of lc) { maxLcGap = Math.max(maxLcGap, c.t - prev); prev = c.t; } maxLcGap = Math.max(maxLcGap, R.tWin - prev); }
  const tail = R.tLast - R.tWin;
  const hard = lc.length >= 5 && lc.length <= 13 && late >= 1 && gap12 <= 0.22 && jam >= 1.2 && R.nudges.length <= 2 && tail <= 5.2 && maxFinGap <= 1.7
    && R.tWin >= 27.5 && R.tWin <= 32.5 && lastLc && lastLc.a === winner && R.tWin - lastLc.t >= 0.5;
  let score = 0;
  score += Math.min(lc.length, 9) * 3;
  score += leaders * 2;
  score += Math.max(0, 6 - (R.tWin - (lastLc ? lastLc.t : 0))) * 4;      // je später der letzte Wechsel, desto besser
  score += (0.22 - gap12) * 60;
  score += Math.max(0, 0.6 - gap23) * 8;
  score += Math.min(wRank6, 6) * 2.5 + Math.min(wRank3, 4) * 1.5;        // Sieger kommt von hinten
  score += Math.min(jam, 4) * 2;
  score -= R.nudges.length * 5;
  score -= tight / 60; score -= lone * 1.5; score -= tail * 2 + maxFinGap * 3;
  score -= Math.max(0, maxLcGap - 5) * 3;
  return { seed, ok: true, hard, score: +score.toFixed(1), tWin: +R.tWin.toFixed(2), tLast: +R.tLast.toFixed(2), total: R.total, lc: lc.length, leaders, late, lastLc: lastLc ? +(R.tWin - lastLc.t).toFixed(2) : null,
    gap12: +gap12.toFixed(3), gap23: +gap23.toFixed(3), maxLcGap: +maxLcGap.toFixed(1), jam: +jam.toFixed(1), jamMax, nud: R.nudges.length, wRank6, wRank3, tight: Math.round(tight), lone: +lone.toFixed(1), maxFinGap: +maxFinGap.toFixed(2),
    order: R.finish.map(f => S.NAMES[f.i]).join(' > ') };
}
module.exports = { analyse };
if (require.main === module) {
  const a = +(process.argv[2] || 1), b = +(process.argv[3] || 2000);
  const res = []; let okN = 0;
  for (let s = a; s <= b; s++) { const r = analyse(s); if (r.ok) okN++; if (r.ok && r.hard) res.push(r); }
  res.sort((x, y) => y.score - x.score);
  fs.writeFileSync(path.join(__dirname, `seed_search_${a}_${b}.json`), JSON.stringify({ von: a, bis: b, alleImZiel: okN, bestanden: res.length, beste: res.slice(0, 25) }, null, 1));
  console.log(`Seeds ${a}–${b}: ${okN} mit allen 12 im Ziel, ${res.length} bestehen alle Bedingungen`);
  for (const r of res.slice(0, 8)) console.log(JSON.stringify(r));
}
