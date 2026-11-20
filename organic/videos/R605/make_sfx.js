#!/usr/bin/env node
/* R605 – Ton aus derselben Simulation wie das Bild (sim.js, gleicher Seed). [KI]
 * Nutzung: node organic/videos/R605/make_sfx.js  → schreibt sfx.wav (44,1 kHz, mono, 16 bit)
 * Szene s1 startet bei Video-Zeit 0, also Simulationszeit = Video-Zeit. */
const fs = require('fs'), path = require('path');
const SIM = require('./sim.js');
const R = SIM.simulate(SIM.CFG.seed);
const SR = 44100, total = R.total;
const buf = new Float64Array(Math.ceil(total * SR));

// Pentatonik (C-Dur): jede Kugel hat ihren Ton
const NOTE = [261.63, 392.00, 329.63, 523.25, 440.00, 293.66]; // Kaffee C4, Kuss G4, Burger E4, Regen C5, Weinglas A4, Pasta D4

/** Marimba-artiger Schlag: Grundton + 4. und 10. Teilton, schneller Abfall */
function mallet(t0, f, vol, len = 0.55) {
  const i0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n && i0 + i < buf.length; i++) {
    const t = i / SR, att = Math.min(1, t / 0.003);
    const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.16)
      + 0.32 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t / 0.05)
      + 0.10 * Math.sin(2 * Math.PI * f * 10 * t) * Math.exp(-t / 0.018);
    buf[i0 + i] += v * vol * att;
  }
}
/** tiefer „Plopp“ beim Ausscheiden: fallender Sinus */
function plop(t0, vol = 0.75) {
  const i0 = Math.floor(t0 * SR), n = Math.floor(0.32 * SR); let ph = 0;
  for (let i = 0; i < n && i0 + i < buf.length; i++) {
    const t = i / SR, f = 70 + 190 * Math.exp(-t / 0.045);
    ph += 2 * Math.PI * f / SR;
    buf[i0 + i] += Math.sin(ph) * vol * Math.min(1, t / 0.004) * Math.exp(-t / 0.09);
  }
}

const last = new Array(SIM.CFG.names.length).fill(-1);
let lastAny = -1, played = 0;
const hit = (i, t, s, k) => {
  if (t - last[i] < 0.06 || t - lastAny < 0.022) return;   // nicht zu dicht
  if (s < 60) return;                                       // Streifer bleiben stumm
  last[i] = t; lastAny = t; played++;
  const vol = Math.min(1, 0.12 + s / 1100) * k;
  mallet(t, NOTE[i], vol * 0.5);
};
for (const e of R.events) {
  if (e.t >= R.tWin + 0.4 && e.type !== 'win') continue;   // im Schlussbild ist Ruhe
  if (e.type === 'bb') { hit(e.a, e.t, e.s, 1); hit(e.b, e.t + 0.012, e.s, 0.85); }
  else if (e.type === 'wall') hit(e.a, e.t, e.s, 0.7);
  else if (e.type === 'out') plop(e.t);
  else if (e.type === 'win') {
    // kleiner Akkord: C-Dur aufwärts, wenn der Sieger groß wird
    const t0 = e.t + 0.95;
    [[261.63, 0], [329.63, 0.07], [392.0, 0.14], [523.25, 0.21], [659.25, 0.30]].forEach(([f, d]) => mallet(t0 + d, f, 0.42, 1.4));
    mallet(e.t + 2.35, 392.0, 0.22, 0.8); mallet(e.t + 2.8, 523.25, 0.22, 0.8); // Frage + Pfeil
  }
}
// sanfte Begrenzung, kein Übersteuern
let peak = 0;
for (let i = 0; i < buf.length; i++) { buf[i] = Math.tanh(buf[i] * 1.1); if (Math.abs(buf[i]) > peak) peak = Math.abs(buf[i]); }
const gain = peak > 0 ? Math.min(1.6, 0.8 / peak) : 1;
// kurzer Ausklang am Ende (Loop ohne Knacken)
const fade = Math.floor(0.25 * SR);
for (let i = 0; i < fade; i++) buf[buf.length - 1 - i] *= i / fade;

const out = Buffer.alloc(44 + buf.length * 2);
out.write('RIFF', 0); out.writeUInt32LE(36 + buf.length * 2, 4); out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(buf.length * 2, 40);
for (let i = 0; i < buf.length; i++) out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i] * gain)) * 32767), 44 + i * 2);
fs.writeFileSync(path.join(__dirname, 'sfx.wav'), out);
console.log(`sfx.wav: ${total.toFixed(2)} s, ${played} Töne aus ${R.events.length} Ereignissen, Spitze ${(peak * gain).toFixed(2)}, Sieger ${SIM.CFG.names[R.winner]}, Seed ${R.seed}`);
