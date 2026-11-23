#!/usr/bin/env node
/* R702 – Ton aus derselben Simulation wie das Bild (sim.js, gleicher Seed). [KI]
 * Nutzung: node organic/videos/R702/make_sfx.js  → sfx.wav (44,1 kHz, stereo, 16 bit) + audio_report.txt (Messwerte)
 * Szene s1 startet bei Video-Zeit 0, also Simulationszeit = Video-Zeit. */
const fs = require('fs'), path = require('path');
const SIM = require('./sim.js');
const R = SIM.simulate(SIM.CFG.seed), cf = R.cfg;
const SR = 44100, total = R.total, N = Math.ceil(total * SR), TW = R.tWin;
const mk = () => [new Float64Array(N), new Float64Array(N)];
const HIT = mk(), BEAT = mk(), FX = mk();          // Busse: Kollisionstöne, Beat, Effekte
const TAU = Math.PI * 2;
const noiseRnd = SIM.mulberry32(4711), NOISE = new Float64Array(SR * 2).map(() => noiseRnd() * 2 - 1);
const panOf = x => Math.max(-1, Math.min(1, (x - 540) / 540)) * 0.55;
/** fn(t) → Wert; wird ab t0 für len Sekunden auf den Bus gelegt */
function put(bus, t0, len, vol, pan, fn) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR), a = (pan + 1) * Math.PI / 4, gl = Math.cos(a) * 1.414 * vol, gr = Math.sin(a) * 1.414 * vol;
  for (let i = 0; i < n; i++) { const k = i0 + i; if (k < 0) continue; if (k >= N) break; const v = fn(i / SR, i); bus[0][k] += v * gl; bus[1][k] += v * gr; }
}
const att = (t, a = 0.002) => t < a ? t / a : 1;

// ---------- Instrumente ----------
/** Marimba/Holz: Grundton + 4. + 10. Teilton, schneller Abfall */
const mallet = (bus, t0, f, vol, pan, len = 0.5) => put(bus, t0, len, vol, pan, t =>
  (Math.sin(TAU * f * t) * Math.exp(-t / 0.15) + 0.3 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / 0.045) + 0.1 * Math.sin(TAU * f * 10 * t) * Math.exp(-t / 0.016)) * att(t));
/** Glas: heller, leicht verstimmte Teiltöne, länger */
const glass = (bus, t0, f, vol, pan, len = 0.7) => put(bus, t0, len, vol, pan, t =>
  (Math.sin(TAU * f * t) * Math.exp(-t / 0.22) + 0.45 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.12) + 0.2 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t / 0.06)) * att(t, 0.0015));
/** kurzer Rausch-Klack (Aufprall) */
const clack = (bus, t0, vol, pan, len = 0.05, lp = 0.35) => { let y = 0; const off = Math.floor(t0 * 9973) % SR; put(bus, t0, len, vol, pan, (t, i) => { y += lp * (NOISE[(off + i) % NOISE.length] - y); return y * Math.exp(-t / (len / 4)) * att(t, 0.001); }); };
const thud = (bus, t0, f, vol, pan) => put(bus, t0, 0.14, vol, pan, t => Math.sin(TAU * (f * t + f * 0.5 * 0.03 * (1 - Math.exp(-t / 0.03)))) * Math.exp(-t / 0.04) * att(t));
function kick(t0, vol) { let ph = 0; put(BEAT, t0, 0.3, vol, 0, t => { const f = 47 + 120 * Math.exp(-t / 0.035); ph += TAU * f / SR; return (Math.sin(ph) + 0.25 * Math.sin(2 * ph)) * Math.exp(-t / 0.11) * att(t, 0.0015) + 0.25 * Math.exp(-t / 0.004) * (t < 0.01 ? 1 : 0); }); }
function hat(t0, vol, pan = 0.2, dec = 0.022) { const off = Math.floor(t0 * 7919) % SR; let p = 0; put(BEAT, t0, 0.09, vol, pan, (t, i) => { const x = NOISE[(off + i) % NOISE.length], y = x - p; p = x; return y * Math.exp(-t / dec) * 0.7; }); }
function clap(t0, vol) { const off = Math.floor(t0 * 3331) % SR; let y = 0, p = 0; put(BEAT, t0, 0.22, vol, -0.1, (t, i) => { const x = NOISE[(off + i) % NOISE.length]; y += 0.5 * (x - y); const hp = y - p; p = y; const env = Math.exp(-(t % 0.011) / 0.004) * (t < 0.033 ? 1 : 0) + Math.exp(-Math.max(0, t - 0.033) / 0.05) * (t >= 0.033 ? 1 : 0); return hp * env * 1.6; }); }
function bass(t0, f, vol, len = 0.2) { put(BEAT, t0, len, vol, 0, t => (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * 2 * f * t) + 0.28 * Math.sin(TAU * 3 * f * t) + 0.12 * Math.sin(TAU * 4 * f * t)) * att(t, 0.006) * Math.exp(-t / (len * 0.6)) * (t > len - 0.02 ? (len - t) / 0.02 : 1)); }
function boom(t0, vol, len = 0.9) { let ph = 0; put(FX, t0, len, vol, 0, t => { const f = 36 + 95 * Math.exp(-t / 0.07); ph += TAU * f / SR; return Math.tanh((Math.sin(ph) + 0.4 * Math.sin(2 * ph) + 0.2 * Math.sin(3 * ph)) * 1.6) * Math.exp(-t / 0.24) * att(t, 0.002); }); clack(FX, t0, vol * 0.8, 0, 0.16, 0.12); }
function shatter(t0, vol, pan, seed) { const rnd = SIM.mulberry32(seed); for (let k = 0; k < 11; k++) { const f = 1700 + rnd() * 5200, d = rnd() * 0.11, dec = 0.05 + rnd() * 0.16, pn = Math.max(-1, Math.min(1, pan + (rnd() - 0.5) * 0.9)); put(FX, t0 + d, 0.6, vol * (0.25 + rnd() * 0.3), pn, t => Math.sin(TAU * f * t) * Math.exp(-t / dec) * att(t, 0.001)); } clack(FX, t0, vol * 0.9, pan, 0.12, 0.9); }
function riser(t0, len, vol) { let ph = 0, y = 0, p = 0; put(FX, t0, len, vol, 0, (t, i) => { const k = t / len, f = 180 * Math.pow(9, k); ph += TAU * f / SR; const x = NOISE[i % NOISE.length], lp = 0.02 + 0.6 * k * k; y += lp * (x - y); const hp = y - p * 0.9; p = y; return (0.35 * Math.sin(ph) * (0.6 + 0.4 * Math.sin(TAU * (6 + 14 * k) * t)) + 0.8 * hp) * k * k * (t > len - 0.01 ? (len - t) / 0.01 : 1); }); }
function brass(t0, f, vol, pan, len) { put(FX, t0, len, vol, pan, t => { let v = 0; for (let h = 1; h <= 7; h++) v += Math.sin(TAU * f * h * t * (1 + 0.0012 * Math.sin(TAU * 5.2 * t))) / h * (h % 2 ? 1 : 0.7); return v * 0.5 * Math.min(1, t / 0.025) * Math.exp(-Math.max(0, t - 0.25) / (len * 0.42)) * (t > len - 0.05 ? (len - t) / 0.05 : 1); }); }
function pad(t0, fs, vol, len) { fs.forEach((f, j) => put(BEAT, t0, len, vol, j % 2 ? 0.3 : -0.3, t => (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2.001 * f * t)) * Math.min(1, t / 0.3) * Math.min(1, (len - t) / 0.3) * (0.8 + 0.2 * Math.sin(TAU * 0.7 * t + j)))); }
const blip = (t0, f, vol, pan = 0, dec = 0.03) => put(FX, t0, 0.15, vol, pan, t => (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * Math.exp(-t / dec) * att(t, 0.001));

// ---------- Töne der 12 Monate: a-Moll-Pentatonik A3 … C6 ----------
const NOTE = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

// ---------- Kollisionen ----------
const lastM = new Array(12).fill(-1), lastE = new Array(6).fill(-1); let lastAny = -1;
const evLog = [];    // alle hörbaren Ereignisse (für Dichte-Messung)
const perSec = t => { let n = 0; for (let k = evLog.length - 1; k >= 0 && evLog[k] > t - 1; k--) n++; return n; };
const free = (arr, i, t, gap = 0.05) => { if (t - arr[i] < gap || t - lastAny < 0.018 || perSec(t) >= 15) return false; arr[i] = t; lastAny = t; evLog.push(t); return true; };
const fightEnd = TW + 0.5;
for (const e of R.events) {
  const t = e.t; if (t > fightEnd && e.type !== 'win') continue;
  if (e.type === 'hit') {          // Gegner trifft Monat: Marimba + Glas + Klack, laut
    lastM[e.m] = t; lastAny = t; evLog.push(t);
    const v = Math.min(1, 0.45 + e.dmg / 30), p = panOf(e.x);
    mallet(HIT, t, NOTE[e.m], 0.5 * v, p); glass(HIT, t, NOTE[e.m] * 2, 0.2 * v, p); clack(HIT, t, 0.42 * v, p, 0.06, 0.5); thud(HIT, t, 150, 0.5 * v, p);
  } else if (e.type === 'mm') {    // Monat gegen Monat: beide Töne
    if (e.s < 170) continue; const v = Math.min(1, 0.16 + e.s / 1300), p = panOf(e.x);
    if (free(lastM, e.a, t)) mallet(HIT, t, NOTE[e.a], 0.3 * v, p);
    if (t + 0.014 - lastM[e.b] >= 0.05) { lastM[e.b] = t + 0.014; mallet(HIT, t + 0.014, NOTE[e.b], 0.26 * v, p); }
  } else if (e.type === 'wall') {
    const v = Math.min(1, 0.12 + e.s / 1200), p = panOf(e.x);
    if (e.k === 'm') { if (e.s > 330 && free(lastM, e.i, t)) mallet(HIT, t, NOTE[e.i], 0.17 * v, p, 0.3); }
    else if (e.s > 420 && free(lastE, e.i, t, 0.08)) thud(HIT, t, 190, 0.2 * v, p);
  } else if (e.type === 'tap' || e.type === 'ee') {
    const idx = e.type === 'tap' ? e.e : e.a;
    if (e.s > 380 && free(lastE, idx, t, 0.08)) { thud(HIT, t, 120, 0.2 * Math.min(1, e.s / 900), panOf(e.x)); clack(HIT, t, 0.1, panOf(e.x), 0.03, 0.25); }
  }
}

// ---------- Beat (126 bpm), wird mit jeder Eliminierung dichter ----------
const bt = 60 / cf.bpm, outsT = R.outs.map(o => o.t);
const nOut = t => { let n = 0; for (const x of outsT) if (x <= t) n++; return n; };
const ROOTS = [110.0, 110.0, 87.31, 98.0], ARP = [440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 587.33, 523.25];             // A A F G (je ein Takt)
const steps = Math.floor(total / (bt / 4));
for (let s = 0; s < steps; s++) {
  const t = s * bt / 4, n = nOut(t), q = s % 16, beatNo = Math.floor(s / 4), bar = Math.floor(s / 16);
  const post = t >= TW, calmWin = post && t < TW + 0.9;
  if (calmWin) continue;                                // kurze Luft nach dem Sieg, dann Fanfare
  const lvl = post ? 3 : n;                             // Dichte-Stufe
  const root = ROOTS[bar % 4] * (post ? 1 : 1);
  if (s % 4 === 0) { if (lvl >= 2 || beatNo % 2 === 0 || post) kick(t, post ? 0.62 : 0.8); }
  if (lvl >= 10 && (q === 7 || q === 15)) kick(t, 0.5);                 // Finale: Vorschläge
  if (s % 4 === 2) hat(t, lvl >= 4 ? 0.3 : 0.22, 0.25);                 // Off-Beat
  if (lvl >= 4 && s % 4 === 0) hat(t, 0.13, -0.25);
  if (lvl >= 8 && s % 2 === 1) hat(t, 0.11, s % 4 === 1 ? -0.4 : 0.4, 0.012); // 16tel
  if (lvl >= 6 && s % 8 === 4) clap(t, post ? 0.3 : 0.4);
  if (lvl >= 3 && s % 4 === 2) bass(t, root, post ? 0.26 : 0.3, bt * 0.42);
  if (lvl >= 9 && s % 4 === 3) bass(t, root * 2, 0.16, bt * 0.2);
  if (lvl >= 1 && lvl < 3 && s % 8 === 2) bass(t, root, 0.22, bt * 0.42);
  // ab 5 Übrigen: leises Pentatonik-Ostinato treibt die Spannung (im Finale in 16teln)
  if (!post && lvl >= 7 && (lvl >= 10 || s % 2 === 0)) { const f = ARP[(lvl >= 10 ? s : s / 2) % ARP.length] * (bar % 4 === 2 ? 0.7937 : 1); mallet(BEAT, t, f, lvl >= 10 ? 0.2 : 0.14, (s % 4 - 1.5) * 0.25, 0.22); }
}

// ---------- Ereignisse ----------
// Auftakt in den ersten 0,3 s
boom(0.0, 0.85); [220, 329.63, 440, 659.25].forEach((f, j) => glass(FX, 0.005 + j * 0.012, f, 0.2, (j - 1.5) * 0.3, 1.0)); clack(FX, 0, 0.5, 0, 0.3, 0.7);
R.events.filter(e => e.type === 'spawn' && e.t > 0).forEach(e => { let ph = 0; put(FX, e.t, 0.4, 0.4, 0, t => { ph += TAU * (90 + 500 * t * t * 6) / SR; return Math.sin(ph) * Math.min(1, t / 0.05) * Math.min(1, (0.4 - t) / 0.08); }); glass(FX, e.t + 0.36, 880, 0.18, 0, 0.5); });
// Arena schrumpft: zwei tiefe Warntöne
[0, 0.24].forEach((d, j) => put(FX, cf.shrinkT0 + d, 0.22, 0.3, 0, t => (Math.sin(TAU * (j ? 196 : 261.63) * t) + 0.5 * Math.sin(TAU * 2 * (j ? 196 : 261.63) * t) + 0.3 * Math.sin(TAU * 3 * (j ? 196 : 261.63) * t)) * Math.min(1, t / 0.01) * Math.min(1, (0.22 - t) / 0.05)));
// Eliminierungen
R.outs.forEach((o, k) => {
  const last = o.left === 1, p = panOf(o.x);
  boom(o.t, last ? 1.0 : 0.8, last ? 1.3 : 0.9); shatter(o.t + 0.005, last ? 0.5 : 0.42, p, 50 + k);
  // der Ton des Monats kippt nach unten weg
  let ph = 0; put(FX, o.t, 0.42, 0.3, p, t => { const f = NOTE[o.i] * Math.pow(0.35, t / 0.42); ph += TAU * f / SR; return (Math.sin(ph) + 0.3 * Math.sin(3 * ph)) * Math.exp(-t / 0.16) * att(t); });
  blip(o.t + 0.11, 1568, 0.2, -0.3, 0.025); blip(o.t + 0.17, 1174.66, 0.16, -0.3, 0.03);   // Zähler-Tick
});
// Riser ins Finale + FINALE-Akzent
const tFin = outsT[9];
riser(tFin - 2.2, 2.2, 0.34);
boom(tFin + 0.8, 0.7, 0.8); [110, 220, 329.63].forEach(f => brass(tFin + 0.8, f, 0.11, 0, 0.7));
// Sieg: Fanfare (C-Dur über a-Moll-Material), Ranglisten-Ticks, Frage
const tf = TW + 0.95;
[[392.0, -0.16, 0.12, 0.14], [523.25, -0.08, 0.1, 0.16]].forEach(([f, d, l, v]) => brass(tf + d, f, v, 0, l));
[[261.63, -0.4], [329.63, 0.4], [392.0, -0.2], [523.25, 0.2], [659.25, 0]].forEach(([f, p]) => brass(tf, f, 0.15, p, 1.7));
[523.25, 659.25, 783.99, 1046.5].forEach((f, j) => glass(FX, tf + j * 0.05, f, 0.16, (j - 1.5) * 0.3, 1.4));
boom(tf, 0.7, 1.0);
pad(TW + 0.95, [130.81, 196.0, 261.63, 329.63, 523.25], 0.11, total - TW - 0.95);
for (let p = 0; p < 12; p++) mallet(FX, TW + 1.7 + p * 0.075, NOTE[11 - p], p === 0 ? 0.24 : 0.15, p < 6 ? -0.35 : 0.35, 0.3);
glass(FX, TW + 2.9, 659.25, 0.26, 0, 0.9); glass(FX, TW + 3.05, 783.99, 0.26, 0, 0.9);
[0, 0.16, 0.32].forEach((d, j) => blip(TW + 3.25 + d, 880 - j * 110, 0.2, 0, 0.04));

// ---------- Mischung ----------
// Beat duckt sich unter Booms weg (Sidechain), bleibt insgesamt im Hintergrund
const duck = new Float64Array(N).fill(1);
const dk = (t0, depth, len) => { const i0 = Math.round(t0 * SR), n = Math.floor(len * SR); for (let i = 0; i < n && i0 + i < N; i++) { const v = 1 - depth * (1 - i / n) * (1 - i / n); if (v < duck[i0 + i]) duck[i0 + i] = v; } };
R.outs.forEach(o => dk(o.t, 0.75, 0.6)); dk(0, 0.6, 0.4); dk(tf, 0.7, 0.8);
const G = { hit: 0.95, beat: 0.5, fx: 0.8 };
// Beat wächst mit dem Kampf: je weniger Monate (= weniger Kollisionstöne), desto mehr trägt der Puls
const beatGain = new Float64Array(N); { let g = 0.45; for (let i = 0; i < N; i++) { const t = i / SR, tgt = t >= TW ? 0.62 : 0.45 + 0.04 * nOut(t); g += (tgt - g) * 0.00005; beatGain[i] = g; } }
const out = mk(); let peak = 0;
for (let ch = 0; ch < 2; ch++) for (let i = 0; i < N; i++) {
  const v = Math.tanh((HIT[ch][i] * G.hit + BEAT[ch][i] * beatGain[i] * duck[i] + FX[ch][i] * G.fx) * 1.15);
  out[ch][i] = v; const a = v < 0 ? -v : v; if (a > peak) peak = a;
}
const TARGET = Math.pow(10, -1.6 / 20);                 // Spitze −1,6 dBFS
const gain = TARGET / peak, fade = Math.floor(0.1 * SR);
for (let ch = 0; ch < 2; ch++) for (let i = 0; i < N; i++) { let v = out[ch][i] * gain; if (i > N - fade) v *= (N - i) / fade; out[ch][i] = v; }

const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { wav.writeInt16LE(Math.round(out[0][i] * 32767), 44 + i * 4); wav.writeInt16LE(Math.round(out[1][i] * 32767), 46 + i * 4); }
fs.writeFileSync(path.join(__dirname, 'sfx.wav'), wav);

// ---------- Messwerte (wir können den Ton nicht hören, also messen) ----------
const db = v => v > 0 ? (20 * Math.log10(v)).toFixed(1) : '-inf';
const rms = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += (out[0][i] * out[0][i] + out[1][i] * out[1][i]) / 2; return Math.sqrt(s / Math.max(1, b - a)); };
const busRms = bus => { let s = 0; for (let i = 0; i < N; i++) s += (bus[0][i] * bus[0][i] + bus[1][i] * bus[1][i]) / 2; return Math.sqrt(s / N); };
let pk = 0, clip = 0; for (let ch = 0; ch < 2; ch++) for (let i = 0; i < N; i++) { const a = Math.abs(out[ch][i]); if (a > pk) pk = a; if (Math.round(a * 32767) >= 32767) clip++; }
const secs = Math.ceil(total), rmsSec = [], evSec = new Array(secs).fill(0);
for (let s = 0; s < secs; s++) rmsSec.push(rms(s * SR, Math.min(N, (s + 1) * SR)));
// hörbare Ereignisse pro Sekunde: Kollisionstöne + Treffer + Eliminierungen (ohne Beat)
const allEv = evLog.concat(outsT).sort((a, b) => a - b); allEv.forEach(t => { if (t < secs) evSec[Math.floor(t)]++; });
let maxWin = 0; for (let i = 0, j = 0; i < allEv.length; i++) { while (allEv[i] - allEv[j] > 1) j++; if (i - j + 1 > maxWin) maxWin = i - j + 1; }
// längste Stille: 50-ms-Fenster unter −45 dBFS
let quiet = 0, maxQuiet = 0, qAt = 0; const w = Math.floor(0.05 * SR);
for (let a = 0; a + w <= N - fade; a += w) { if (rms(a, a + w) < Math.pow(10, -45 / 20)) { quiet += 0.05; if (quiet > maxQuiet) { maxQuiet = quiet; qAt = a / SR; } } else quiet = 0; }
const rep = [
  `R702 sfx.wav – Seed ${R.seed}, Sieger ${cf.months[R.winner]}, Sieg bei ${TW.toFixed(2)} s`,
  `Länge ${(N / SR).toFixed(3)} s (Video ${total.toFixed(3)} s), 44,1 kHz, 16 bit, stereo`,
  `Spitze ${db(pk)} dBFS, geclippte Samples ${clip}, RMS gesamt ${db(rms(0, N))} dBFS`,
  `Busse vor dem Master (RMS): Kollisionen ${db(busRms(HIT) * G.hit)}, Beat ${db(Math.sqrt((() => { let q = 0; for (let i = 0; i < N; i++) { const g = beatGain[i] * duck[i]; q += (BEAT[0][i] * BEAT[0][i] + BEAT[1][i] * BEAT[1][i]) / 2 * g * g; } return q / N; })()))}, Effekte ${db(busRms(FX) * G.fx)}`,
  `Hörbare Ereignisse (ohne Beat): ${allEv.length}, davon Treffer ${R.events.filter(e => e.type === 'hit').length}; max. in 1 s (gleitend): ${maxWin}`,
  `Längste Stille (< −45 dBFS): ${maxQuiet.toFixed(2)} s bei ${qAt.toFixed(1)} s`,
  `Sekunde | RMS dBFS | Ereignisse`,
  ...rmsSec.map((v, s) => `${String(s).padStart(4)}    | ${db(v).padStart(6)}   | ${String(evSec[s]).padStart(2)} ${'#'.repeat(evSec[s])}`),
].join('\n');
fs.writeFileSync(path.join(__dirname, 'audio_report.txt'), rep + '\n');
console.log(rep);
