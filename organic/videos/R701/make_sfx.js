#!/usr/bin/env node
/* R701 – Ton aus derselben Simulation wie das Bild (sim.js, gleicher Seed). [KI]
 * Nutzung: node organic/videos/R701/make_sfx.js  → schreibt sfx.wav (44,1 kHz, stereo, 16 bit) und audio_check.json
 * Szene s1 startet bei Video-Zeit 0, also Simulationszeit = Video-Zeit.
 * Drei Spuren: KOLL (jede Kollision ein Ton, Tonhöhe je Murmel aus einer Pentatonik), BEAT (Kick/Hat/Clap/Bass, 120 bpm, leise),
 * FX (Impact bei 0, Whoosh+Ding bei Führungswechsel, Riser, Fanfare für Platz 1, Ding je Zieleinlauf, Schlussbild). */
const fs = require('fs'), path = require('path');
const SIM = require('./sim.js');
const R = SIM.simulate(SIM.CFG.seed), T = R.track, N = SIM.CFG.n, FPS = SIM.CFG.fps;
const SR = 44100, D = R.total, LEN = Math.round(D * SR);
const TW = R.tWin, TL = R.tLast, TE = TL + 0.75;
const bus = () => [new Float64Array(LEN), new Float64Array(LEN)];
const KOLL = bus(), BEAT = bus(), FX = bus();
const rnd = SIM.mulberry32(701);
const TAU = Math.PI * 2;

/** fügt fn(t) (t ab 0) in eine Spur ein; pan −1 (links) … 1 (rechts) */
function add(b, t0, len, fn, pan = 0, vol = 1) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR);
  const gl = vol * Math.min(1, 1 - pan), gr = vol * Math.min(1, 1 + pan);
  for (let i = 0; i < n; i++) { const k = i0 + i; if (k < 0) continue; if (k >= LEN) break; const v = fn(i / SR); b[0][k] += v * gl; b[1][k] += v * gr; }
}
const att = (t, a = 0.003) => Math.min(1, t / a);

// ---------- Stimmen ----------
// C-Dur-Pentatonik über gut zwei Oktaven: jede Murmel hat ihren Ton
const NOTE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];
const TON = [5, 0, 9, 7, 4, 2, 8, 1, 10, 3, 6, 11].map(k => NOTE[k]); // Widder … Fische (tiefe/hohe Töne gemischt)
/** Marimba: Grundton + 4. Teilton + kurzer heller Anschlag */
const marimba = f => { const d = 0.19 * Math.pow(440 / f, 0.35); return t => att(t) * (Math.sin(TAU * f * t) * Math.exp(-t / d) + 0.3 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / (d * 0.3)) + 0.1 * Math.sin(TAU * f * 9.2 * t) * Math.exp(-t / 0.014)); };
/** Glas: leicht unharmonische Obertöne, klingt länger */
const glass = f => { const d = 0.24 * Math.pow(440 / f, 0.3); return t => att(t, 0.002) * (Math.sin(TAU * f * t) * Math.exp(-t / d) + 0.42 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / (d * 0.45)) + 0.16 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t / (d * 0.2))); };
/** Holz: kurz, trocken, eine Oktave tiefer */
const wood = f => t => att(t, 0.002) * (Math.sin(TAU * f * t) * Math.exp(-t / 0.06) + 0.5 * Math.sin(TAU * f * 3.9 * t) * Math.exp(-t / 0.022) + 0.25 * Math.sin(TAU * f * 6.7 * t) * Math.exp(-t / 0.01));
/** Kussmund-Bumper: „Boing“ (aufsteigender Sinus) */
const boing = () => { let ph = 0; return t => { const f = 190 + 420 * (1 - Math.exp(-t / 0.05)); ph += TAU * f / SR; return att(t, 0.002) * Math.sin(ph) * Math.exp(-t / 0.11); }; };
const bell = f => t => att(t, 0.004) * (Math.sin(TAU * f * t) * Math.exp(-t / 0.45) + 0.5 * Math.sin(TAU * f * 2.41 * t) * Math.exp(-t / 0.22) + 0.25 * Math.sin(TAU * f * 3.9 * t) * Math.exp(-t / 0.1));
const kick = (deep = 1) => { let ph = 0; return t => { const f = 46 + 110 * Math.exp(-t / 0.035); ph += TAU * f / SR; return (Math.sin(ph) * Math.exp(-t / (0.17 * deep)) + 0.35 * Math.exp(-t / 0.004) * (rnd() * 2 - 1)) * att(t, 0.001); }; };
const hat = (dec = 0.028) => { let prev = 0; return t => { const w = rnd() * 2 - 1, v = w - prev; prev = w; return v * 0.6 * Math.exp(-t / dec); }; };
const clap = () => { let lp = 0, hp = 0, prev = 0; return t => { const w = rnd() * 2 - 1; lp += 0.35 * (w - lp); hp = 0.9 * (hp + lp - prev); prev = lp; const env = Math.exp(-t / 0.07) * (t < 0.03 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 330)) : 1); return hp * env * 1.6; }; };
const bass = f => t => att(t, 0.006) * (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2 * t)) * Math.exp(-t / 0.13);
/** Rauschen durch ein mitlaufendes Bandfilter (State-Variable) – für Whoosh und Riser */
const sweep = (f0, f1, len, q = 0.35) => { let lo = 0, bd = 0; return t => { const k = t / len, f = f0 * Math.pow(f1 / f0, k), g = 2 * Math.sin(Math.PI * Math.min(f, 9000) / SR); const w = rnd() * 2 - 1; lo += g * bd; const hi = w - lo - q * bd; bd += g * hi; return bd; }; };
const brass = f => t => { let v = 0; for (let h = 1; h <= 7; h++) v += Math.sin(TAU * f * h * t) / h * (h % 2 ? 1 : 0.6); const env = Math.min(1, t / 0.018) * (t < 0.5 ? 1 : Math.exp(-(t - 0.5) / 0.4)); return v * env * 0.5; };

// ---------- 1) Kollisionen ----------
// Wo ist die Kamera ungefähr? (Führende Murmel; nach dem Sieg das Ziel.) Was weit außerhalb des Bildes passiert, klingt nur leise.
const leadY = new Float64Array(R.frames.length);
for (let f = 0; f < R.frames.length; f++) { const t = f / FPS; let m = -1e9; if (t >= TW) m = T.fin + 160; else for (let i = 0; i < N; i++) if (R.frames[f][i * 2 + 1] > m) m = R.frames[f][i * 2 + 1]; leadY[f] = m; }
const visible = (t, y) => { const ly = leadY[Math.min(R.frames.length - 1, Math.round(t * FPS))], d = ly - y; return d < 950 ? 1 : d > 1400 ? 0.22 : 1 - 0.78 * (d - 950) / 450; };
const finT = new Array(N).fill(1e9); R.finish.forEach(f => finT[f.i] = f.t);
const last = new Array(N).fill(-1), recent = [];
let lastAny = -1, played = 0;
const perSec = new Array(Math.ceil(D)).fill(0);
function strike(i, t, s, x, y, kind, k = 1) {
  if (s < 130 || t - last[i] < 0.06 || t - lastAny < 0.014 || t > TE + 0.2) return;
  while (recent.length && recent[0] < t - 1) recent.shift();
  if (recent.length >= 12 && s < 300) return;                       // wird es dicht, zählen nur noch die harten Treffer
  if (recent.length >= 17 && s < 520) return;
  if (recent.length >= 22) return;                                  // nie mehr als ~22 Töne pro Sekunde
  let vol = Math.min(1, 0.16 + s / 950) * k * visible(t, y);
  if (t > finT[i]) vol *= 0.5;                                      // im Auffangbecken leiser
  if (vol < 0.03) return;
  last[i] = t; lastAny = t; recent.push(t); played++; perSec[Math.floor(t)]++;
  const pan = Math.max(-0.6, Math.min(0.6, (x - T.CX) / 445 * 0.6)), f = TON[i];
  if (kind === 'bumper') { add(KOLL, t, 0.5, boing(), pan, 0.5 * Math.max(vol, 0.55)); add(KOLL, t, 0.6, marimba(f), pan, 0.5 * Math.max(vol, 0.55)); }
  else if (kind === 'peg' || kind === 'heart' || kind === 'knob') add(KOLL, t, 0.9, glass(f), pan, vol * 0.42);
  else if (kind === 'bb') add(KOLL, t, 0.7, marimba(f), pan, vol * 0.5);
  else add(KOLL, t, 0.3, wood(f / 2), pan, vol * 0.6);              // Rampen, Wände, Lippenstifte, Tor, Boden
}
for (const e of R.events) {
  if (e.type === 'lead' || e.type === 'finish' || e.type === 'nudge') continue;
  if (e.type === 'bb') { strike(e.a, e.t, e.s, e.x, e.y, 'bb'); strike(e.b, e.t + 0.014, e.s, e.x, e.y, 'bb', 0.8); }
  else strike(e.a, e.t, e.s, e.x, e.y, e.type);
}

// ---------- 2) Beat (120 bpm) ----------
const BPM = 120, B = 60 / BPM;
const secT = id => { const y0 = T.sections.find(s => s.id === id).y0; for (let f = 0; f < R.frames.length; f++) if (leadY[f] >= y0) return f / FPS; return TW; };
const tFinal = Math.min(secT('final'), TW - 4);                      // ab hier wird der Beat dichter
const tEndBeat = D - 0.32;
for (let k = 0; k * B / 4 < tEndBeat; k++) {
  const t = k * B / 4, s16 = k % 4, beat = Math.floor(k / 4) % 4;     // 16tel-Raster
  const dense = t >= tFinal && t < TW, endScreen = t >= TE, after = t >= TW && t < TE;
  if (s16 === 0 && (!endScreen || beat % 2 === 0)) add(BEAT, t, 0.5, kick(), 0, k === 0 ? 0 : 0.62);
  if (dense && s16 === 3 && beat % 2 === 1) add(BEAT, t, 0.4, kick(0.8), 0, 0.42);
  if (s16 === 2) add(BEAT, t, 0.12, hat(), 0.25, endScreen ? 0.1 : 0.17);
  if (dense && s16 % 2 === 1) add(BEAT, t, 0.08, hat(0.016), -0.25, 0.11);
  if (!dense && !endScreen && s16 === 0 && t > 4) add(BEAT, t, 0.06, hat(0.012), -0.2, 0.06);
  if (s16 === 0 && beat % 2 === 1 && t > 1.9 && !endScreen) add(BEAT, t, 0.35, clap(), 0, dense ? 0.3 : after ? 0.24 : 0.2);
  if (s16 === 2 || (dense && s16 === 0 && beat % 2 === 0)) add(BEAT, t, 0.4, bass([65.41, 65.41, 49.0, 55.0][Math.floor(k / 16) % 4]), 0, endScreen ? 0.3 : 0.4);
}
// Wirbel in der letzten Sekunde vor dem Zieleinlauf
for (let k = 0, t = TW - 1.0; t < TW - 0.02; k++) { const p = (t - (TW - 1.0)); add(BEAT, t, 0.1, clap(), 0, 0.1 + 0.22 * p); t += p < 0.5 ? B / 4 : B / 8; }

// ---------- 3) Effekte ----------
// Impact in den ersten 0,3 s: tiefer Schlag + Rausch-Stoß + heller Akkord
add(FX, 0, 0.7, kick(1.5), 0, 0.95);
add(FX, 0, 0.5, t => { return (rnd() * 2 - 1) * Math.exp(-t / 0.06) * 0.5; }, 0, 0.5);
[[523.25, -0.3], [783.99, 0.3], [1046.5, 0]].forEach(([f, p]) => add(FX, 0.005, 1.0, bell(f), p, 0.26));
// Führungswechsel: Whoosh + Ding (Ton der neuen Spitze, in die Glockenlage gelegt)
const leads = R.leadChanges.slice(1);
leads.forEach(c => {
  let f = TON[c.a]; while (f < 1000) f *= 2;
  add(FX, c.t - 0.04, 0.3, (() => { const s = sweep(500, 5200, 0.3); return t => s(t) * Math.sin(Math.PI * t / 0.3); })(), 0, 0.55);
  add(FX, c.t + 0.1, 1.1, bell(f), 0, 0.3); add(FX, c.t + 0.1, 0.2, marimba(f / 2), 0, 0.2);
});
// Riser vor dem Zieleinlauf (2,4 s)
{ const len = 2.4, s = sweep(280, 4200, len, 0.25); let ph = 0;
  add(FX, TW - len, len, t => { const k = t / len; ph += TAU * (220 * Math.pow(6, k)) / SR; return (s(t) * 0.8 + Math.sin(ph) * 0.35) * k * k; }, 0, 0.4); }
// Platz 1: Fanfaren-Akkord (C-Dur) + Becken + Lauf nach oben
[[130.81, 0, 0.55], [261.63, -0.25, 0.5], [329.63, 0.25, 0.42], [392.0, -0.15, 0.42], [523.25, 0.15, 0.4], [659.25, 0, 0.3]].forEach(([f, p, v]) => add(FX, TW, 1.6, brass(f), p, v * 0.5));
add(FX, TW, 1.4, (() => { const h = hat(0.45); return t => h(t) * 1.2; })(), 0, 0.5);
add(FX, TW, 0.7, kick(1.6), 0, 0.9);
[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, k) => add(FX, TW + 0.16 + k * 0.085, 1.2, bell(f), (k - 2) * 0.2, 0.3));
// jeder weitere Zieleinlauf: kleines Ding (Tonleiter abwärts) + Plopp
const DOWN = [1567.98, 1318.5, 1174.66, 1046.5, 880.0, 783.99, 659.25, 587.33, 523.25, 440.0, 392.0];
R.finish.slice(1).forEach((f, k) => {
  const p = Math.max(-0.5, Math.min(0.5, (f.x - T.CX) / 445 * 0.5));
  add(FX, f.t, 0.9, bell(DOWN[k]), p, 0.3);
  add(FX, f.t, 0.25, (() => { let ph = 0; return t => { ph += TAU * (90 + 260 * Math.exp(-t / 0.04)) / SR; return Math.sin(ph) * Math.exp(-t / 0.07); }; })(), p, 0.4);
});
// Schlussbild: Wisch, Platz 1 ploppt, 11 Zeilen ticken, „übt noch“ (zwei fallende Töne), Frage (Ton nach oben), Pfeil
add(FX, TE - 0.05, 0.45, (() => { const s = sweep(3800, 420, 0.45); return t => s(t) * Math.sin(Math.PI * t / 0.45); })(), 0, 0.5);
[261.63, 392.0, 523.25, 659.25].forEach((f, k) => add(FX, TE + 0.15, 1.3, marimba(f), (k - 1.5) * 0.2, 0.3));
for (let k = 0; k < 11; k++) add(FX, TE + 0.5 + k * 0.075, 0.25, glass(NOTE[11 - k] * (k < 6 ? 2 : 1)), k < 6 ? -0.4 : 0.4, 0.16);
add(FX, TE + 1.7, 0.5, wood(196.0), 0.3, 0.5); add(FX, TE + 1.88, 0.6, wood(146.83), 0.3, 0.5);
add(FX, TE + 2.3, 1.2, bell(783.99), -0.1, 0.3); add(FX, TE + 2.46, 1.4, bell(1046.5), 0.1, 0.34);
add(FX, TE + 2.75, 0.4, marimba(1318.5), 0, 0.2); add(FX, TE + 3.2, 0.4, marimba(659.25), 0, 0.16);
// im Schlussbild trägt eine ruhige Tonfolge (damit nie Stille entsteht)
for (let k = 0, t = TE + 3.6; t < D - 0.5; k++, t += B / 2) add(FX, t, 0.8, glass([523.25, 659.25, 783.99, 1046.5, 783.99, 659.25][k % 6]), k % 2 ? 0.3 : -0.3, 0.2);

// ---------- Mischung ----------
const GK = 0.85, GB = 0.5, GF = 1.0;
const out = [new Float64Array(LEN), new Float64Array(LEN)];
for (let c = 0; c < 2; c++) for (let i = 0; i < LEN; i++) out[c][i] = KOLL[c][i] * GK + BEAT[c][i] * GB + FX[c][i] * GF;
// Spitzen-Begrenzer mit Vorausschau (statt hartem Abschneiden): Pegel über der Schwelle wird für wenige ms sanft heruntergeregelt
{ const THR = 1.4, BL = 64, nb = Math.ceil(LEN / BL), need = new Float64Array(nb).fill(1);
  for (let b = 0; b < nb; b++) { let m = 0; for (let i = b * BL; i < Math.min(LEN, (b + 1) * BL); i++) { const a = Math.max(Math.abs(out[0][i]), Math.abs(out[1][i])); if (a > m) m = a; } if (m > THR) need[b] = THR / m; }
  const g = new Float64Array(nb); let cur = 1;
  for (let b = 0; b < nb; b++) { let m = 1; for (let q = b - 1; q <= b + 4; q++) if (q >= 0 && q < nb && need[q] < m) m = need[q]; cur = m < cur ? m : cur + (1 - cur) * 0.06; if (cur > m) cur = m; g[b] = cur; }
  let limited = 0;
  for (let i = 0; i < LEN; i++) { const fb = i / BL - 0.5, b0 = Math.max(0, Math.floor(fb)), b1 = Math.min(nb - 1, b0 + 1), k = Math.min(1, Math.max(0, fb - b0)); const gg = Math.min(g[b0] + (g[b1] - g[b0]) * k, g[Math.min(nb - 1, Math.floor(i / BL))]); if (gg < 0.999) limited++; out[0][i] *= gg; out[1][i] *= gg; }
  var limitedShare = limited / LEN; }
const fade = Math.floor(0.25 * SR), fin = Math.floor(0.004 * SR);
for (let c = 0; c < 2; c++) { for (let i = 0; i < fade; i++) out[c][LEN - 1 - i] *= i / fade; }
let peak = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < LEN; i++) { const a = Math.abs(out[c][i]); if (a > peak) peak = a; }
const TARGET = Math.pow(10, -2.7 / 20);                              // Spitze −1,6 dBFS
const gain = TARGET / peak;
const wav = Buffer.alloc(44 + LEN * 4);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + LEN * 4, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22); wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(LEN * 4, 40);
let clipped = 0;
for (let i = 0; i < LEN; i++) for (let c = 0; c < 2; c++) { let v = out[c][i] * gain; if (Math.abs(v) >= 1) { clipped++; v = Math.sign(v); } wav.writeInt16LE(Math.round(v * 32767), 44 + i * 4 + c * 2); }
fs.writeFileSync(path.join(__dirname, 'sfx.wav'), wav);

// ---------- Messung (ersetzt das Anhören) ----------
const db = v => v > 0 ? 20 * Math.log10(v) : -120;
const rms = (b, i0, i1, g = 1) => { let s = 0; for (let c = 0; c < 2; c++) for (let i = i0; i < i1; i++) s += b[c][i] * b[c][i]; return Math.sqrt(s / (2 * Math.max(1, i1 - i0))) * g; };
const pk = b => { let m = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < LEN; i++) { const a = Math.abs(b[c][i]); if (a > m) m = a; } return m; };
const perSecond = [];
for (let s = 0; s * SR < LEN; s++) { const i0 = s * SR, i1 = Math.min(LEN, i0 + SR); perSecond.push({ s, gesamt: +db(rms(out, i0, i1, gain)).toFixed(1), koll: +db(rms(KOLL, i0, i1, GK * gain)).toFixed(1), beat: +db(rms(BEAT, i0, i1, GB * gain)).toFixed(1), fx: +db(rms(FX, i0, i1, GF * gain)).toFixed(1), toene: perSec[s] || 0 }); }
// längste Stille: 50-ms-Fenster unter −45 dBFS
let quiet = 0, maxQuiet = 0, win = Math.floor(0.05 * SR);
for (let i = 0; i + win <= LEN - fade; i += win) { if (db(rms(out, i, i + win, gain)) < -45) { quiet += 0.05; if (quiet > maxQuiet) maxQuiet = quiet; } else quiet = 0; }
const iRace = [Math.floor(1 * SR), Math.floor(TW * SR)];
const report = {
  seed: R.seed, dauer_s: +(LEN / SR).toFixed(3), samplerate: SR, kanaele: 2, bit: 16,
  spitze_dBFS: +db(peak * gain).toFixed(2), uebersteuerte_samples: clipped,
  spitze_je_spur_dBFS: { kollisionen: +db(pk(KOLL) * GK * gain).toFixed(1), beat: +db(pk(BEAT) * GB * gain).toFixed(1), effekte: +db(pk(FX) * GF * gain).toFixed(1) },
  begrenzer_aktiv_anteil: +limitedShare.toFixed(3),
  kollisions_toene: played, toene_pro_sekunde_max: Math.max(...perSec), laengste_stille_s: +maxQuiet.toFixed(2),
  rennen_rms_dBFS: { gesamt: +db(rms(out, iRace[0], iRace[1], gain)).toFixed(1), kollisionen: +db(rms(KOLL, iRace[0], iRace[1], GK * gain)).toFixed(1), beat: +db(rms(BEAT, iRace[0], iRace[1], GB * gain)).toFixed(1), effekte: +db(rms(FX, iRace[0], iRace[1], GF * gain)).toFixed(1) },
  erste_300ms_rms_dBFS: +db(rms(out, 0, Math.floor(0.3 * SR), gain)).toFixed(1),
  fuehrungswechsel: leads.length, bpm: BPM, beat_dichter_ab_s: +tFinal.toFixed(2), sieg_s: +TW.toFixed(2), letzter_im_ziel_s: +TL.toFixed(2),
  pro_sekunde: perSecond,
};
fs.writeFileSync(path.join(__dirname, 'audio_check.json'), JSON.stringify(report, null, 1));
console.log(`sfx.wav: ${(LEN / SR).toFixed(3)} s, Seed ${R.seed}, ${played} Kollisionstöne (max ${report.toene_pro_sekunde_max}/s), Spitze ${report.spitze_dBFS} dBFS, übersteuert ${clipped}, längste Stille ${report.laengste_stille_s} s`);
console.log('RMS Rennen (dBFS):', JSON.stringify(report.rennen_rms_dBFS), '| erste 0,3 s:', report.erste_300ms_rms_dBFS);
console.log('Spitze je Spur:', JSON.stringify(report.spitze_je_spur_dBFS), '| Begrenzer aktiv:', (limitedShare * 100).toFixed(1) + ' %');
console.log('RMS/s gesamt:', perSecond.map(p => p.gesamt.toFixed(0)).join(' '));
console.log('Töne/s      :', perSecond.map(p => p.toene).join(' '));
