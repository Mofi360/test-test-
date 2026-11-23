#!/usr/bin/env node
/* R703 – Ton komplett aus Code, Zeiten aus scene.js (GAME). [KI]
 * Nutzung: node organic/videos/R703/make_sfx.js  → sfx.wav (44,1 kHz, mono, 16 bit) + Messwerte
 * Inhalt: Impact bei 0, Puls (Kick + Hi-Hat + Bass, pro Level schneller), Uhr-Tick pro Sekunde (letzte 2 s schneller/höher),
 * „Ding“ bei Auflösung, Whoosh + Impact beim Levelwechsel, Riser in Level 3, offener Akkord am Ende. */
const fs = require('fs'), path = require('path');
const G = require('./scene.js');
const SR = 44100, total = G.TOTAL, N = Math.round(total * SR);
const buf = new Float64Array(N);
const rnd = G.mulberry32(703703);
const TAU = 2 * Math.PI;
const add = (i, v) => { if (i >= 0 && i < N) buf[i] += v; };

function kick(t0, vol = .5, f1 = 150, f0 = 48, len = .26) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, f = f0 + (f1 - f0) * Math.exp(-t / .03); ph += TAU * f / SR;
    add(i0 + i, (Math.sin(ph) + .25 * Math.sin(2 * ph)) * vol * Math.min(1, t / .002) * Math.exp(-t / .085)); }
}
/** Rauschen durch Bandpass (Zustandsvariablen-Filter); fc(t) und amp(t) als Funktionen von 0..1 */
function noise(t0, len, fc, amp, q = 1.2) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR); let lp = 0, bp = 0;
  for (let i = 0; i < n; i++) { const k = i / n, f = 2 * Math.sin(Math.PI * Math.min(.24, fc(k) / SR));
    const x = rnd() * 2 - 1, hp = x - lp - bp / q; bp += f * hp; lp += f * bp; add(i0 + i, bp * amp(k)); }
}
const hat = (t0, vol = .1, len = .045) => noise(t0, len, () => 8500, k => vol * Math.exp(-k * 6), .9);
function tick(t0, f, vol) {   // Uhr: kurzer Holz-Klick + sehr kurzes Rauschen
  const i0 = Math.round(t0 * SR), n = Math.floor(.07 * SR);
  for (let i = 0; i < n; i++) { const t = i / SR;
    add(i0 + i, (Math.sin(TAU * f * t) * Math.exp(-t / .012) + .5 * Math.sin(TAU * f * 2.41 * t) * Math.exp(-t / .006)) * vol * Math.min(1, t / .0006)); }
  noise(t0, .012, () => 5200, k => vol * .5 * (1 - k), .8);
}
function bell(t0, f, vol, len = 1.5) {  // „Ding“
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) { const t = i / SR;
    add(i0 + i, (Math.sin(TAU * f * t) * Math.exp(-t / .42) + .45 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / .16) + .2 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t / .06)) * vol * Math.min(1, t / .002)); }
}
function bass(t0, f, vol, len = .2) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) { const t = i / SR, e = Math.min(1, t / .004) * Math.exp(-t / (len * .45));
    add(i0 + i, (Math.sin(TAU * f * t) + .5 * Math.sin(TAU * 2 * f * t) + .28 * Math.sin(TAU * 3 * f * t) + .12 * Math.sin(TAU * 4 * f * t)) * vol * e); }
}
function pad(t0, f, vol, len, att = .25, rel = .5) {  // weicher Flächen-/E-Piano-Ton
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) { const t = i / SR, e = Math.min(1, t / att) * Math.min(1, (len - t) / rel);
    const trem = 1 + .12 * Math.sin(TAU * 4.3 * t);
    add(i0 + i, (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * 2.003 * f * t) + .12 * Math.sin(TAU * 3.01 * f * t)) * vol * e * trem); }
}
function pluck(t0, f, vol, len = 1.6) {
  const i0 = Math.round(t0 * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) { const t = i / SR;
    add(i0 + i, (Math.sin(TAU * f * t) * Math.exp(-t / .5) + .4 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / .2) + .15 * Math.sin(TAU * 4 * f * t) * Math.exp(-t / .05)) * vol * Math.min(1, t / .003)); }
}
function whoosh(tHit, vol = .5) {  // 0,28 s Anlauf, endet hart auf tHit
  noise(tHit - .28, .3, k => 500 + 6500 * k * k, k => vol * Math.pow(k, 1.6) * (k > .93 ? (1 - k) / .07 : 1), 1.6);
}
function impact(t0, vol = .8) {
  kick(t0, vol, 190, 42, .45);
  noise(t0, .22, k => 3200 - 2400 * k, k => vol * .55 * Math.exp(-k * 5), .8);
}

// ---------- Ablauf ----------
impact(0.02, .85); bell(0.04, 1318.5, .16, .9);                                   // Akzent in den ersten 0,3 s
const ROOT = [110.0, 123.47, 138.59];                                              // A2, H2, Cis3 – pro Level höher
G.LV.forEach((L, li) => {
  const beat = 60 / L.bpm, a = L.T0 + (li === 0 ? beat : 0), b = L.R;
  // Puls: Kick auf den Schlag, Hi-Hat auf den Achteln, Bass synkopiert
  for (let k = 0, t = a; t < b - .05; k++, t = a + k * beat / 2) {
    const grow = li === 2 ? .8 + .5 * (t - a) / (b - a) : 1;
    if (k % 2 === 0) kick(t, .30 * grow); else { hat(t, .085 * grow); bass(t, ROOT[li] * (k % 8 === 7 ? 1.5 : 1), .15 * grow, beat * .45); }
    if (k % 2 === 0) hat(t, .04 * grow, .03);
    if (li === 2 && k % 4 === 3) hat(t + beat / 4, .06 * grow, .03);              // Level 3: Sechzehntel-Zwischenschlag
  }
  // Uhr
  G.ticks(L).forEach(k => tick(k.t, k.u === 0 ? (k.i % 2 ? 1500 : 1850) : k.u === 1 ? 2200 + k.i * 150 : 2600 + k.i * 230, k.u === 0 ? .34 : k.u === 1 ? .4 : .46));
  // Auflösung
  if (li < 2) { bell(L.R + .03, li === 0 ? 1318.5 : 1396.9, .42); bell(L.R + .19, li === 0 ? 1760 : 1864.7, .36); kick(L.R + .03, .3);
    pad(L.R + .1, ROOT[li] * 2, .07, L.X - L.R - .1, .1, .25); pad(L.R + .1, ROOT[li] * 3, .05, L.X - L.R - .1, .1, .25);
    hat(L.R + .55, .06); hat(L.R + .85, .06); kick(L.R + .7, .2); }
  // Levelwechsel
  if (li < 2) { whoosh(L.X + .02, .5); impact(L.X + .03, .8); bass(L.X + .04, ROOT[li + 1] / 2 * 2, .25, .45); }
});
// Level 3: Riser (Ton + Rauschen steigen bis zum Aufblitzen), dann harter Stopp
{
  const L = G.LV[2], i0 = Math.round(L.T0 * SR), n = Math.floor((L.R - L.T0) * SR); let ph = 0, ph2 = 0;
  for (let i = 0; i < n; i++) { const k = i / n, f = 180 * Math.pow(9, k * k); ph += TAU * f / SR; ph2 += TAU * f * 1.498 / SR;
    add(i0 + i, (Math.sin(ph) + .5 * Math.sin(ph2)) * (.012 + .13 * Math.pow(k, 2.2)) * (1 + .25 * Math.sin(TAU * (3 + 9 * k) * i / SR)) * Math.min(1, (1 - k) / .004)); }
  noise(L.T0, L.R - L.T0, k => 900 + 7000 * k * k, k => .012 + .16 * Math.pow(k, 2.6), 1.4);
  // Aufblitzen: kurzes, helles „Zing“ + Schlag
  impact(L.R + .01, .9); bell(L.R + .02, 2093, .4, .6); bell(L.R + .02, 3136, .2, .4);
  noise(L.R + .12, G.AFTER - L.R - .12, () => 6000, k => .03 * (1 - k), 1);
  // „Gesehen?“: tiefer Schlag + fragende, hängende Fläche
  impact(G.AFTER + .01, .75);
  pad(G.AFTER + .05, 138.59, .11, G.END - G.AFTER, .05, .3); pad(G.AFTER + .05, 207.65, .08, G.END - G.AFTER, .05, .3); pad(G.AFTER + .05, 277.18 * 1.335, .06, G.END - G.AFTER, .08, .3);
  pluck(G.AFTER + .6, 554.37, .16, .9); pluck(G.AFTER + .85, 739.99, .16, .9);   // „Zurückspulen erlaubt“
  hat(G.AFTER + 1.15, .07); hat(G.AFTER + 1.3, .07); hat(G.AFTER + 1.45, .07);
  whoosh(G.END + .02, .45); impact(G.END + .03, .7);
}
// Schluss: drei Schilder (aufsteigend), dann offener Akkord (Asus2 mit None – löst sich nicht auf) + leiser Puls
{
  const E = G.END;
  [[.52, 440], [.84, 493.88], [1.16, 659.25]].forEach(([d, f]) => { pluck(E + d, f, .3, 1.2); kick(E + d, .22); });
  const c0 = E + 1.75, len = total - c0 - .05;
  [[110, .12, 0], [164.81, .1, .0], [220, .09, .05], [246.94, .09, .1], [329.63, .08, .15], [493.88, .06, .2]].forEach(([f, v, d]) => pad(c0 + d, f, v, len - d, .12, .9));
  [[0, 440], [.12, 493.88], [.24, 659.25], [.36, 739.99], [.6, 987.77]].forEach(([d, f]) => pluck(c0 + d, f, .22, 2.6));
  pluck(E + 2.45, 880, .16, 1.5); pluck(E + 2.75, 987.77, .18, 2.2);              // Pfeil: Frage bleibt oben hängen
  for (let k = 0, t = c0 + .9; t < total - .7; k++, t = c0 + .9 + k * .2727) { if (k % 2 === 0) kick(t, .14); else hat(t, .05); }
}

// ---------- Mischung: weicher Begrenzer, Spitze −3,0 dBFS im WAV (AAC-Überschwinger bleiben so unter −1,5 dBFS), kurzer Ausklang ----------
let pk = 0;
for (let i = 0; i < N; i++) { buf[i] = Math.tanh(buf[i] * 1.25); if (Math.abs(buf[i]) > pk) pk = Math.abs(buf[i]); }
const TARGET = Math.pow(10, -3.0 / 20), gain = TARGET / pk;
const fade = Math.floor(.2 * SR);
for (let i = 0; i < fade; i++) buf[N - 1 - i] *= i / fade;
const out = Buffer.alloc(44 + N * 2);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 2, 4); out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 2, 40);
let clip = 0, peak = 0;
for (let i = 0; i < N; i++) { const v = buf[i] * gain; if (Math.abs(v) >= .999) clip++; if (Math.abs(v) > peak) peak = Math.abs(v); out.writeInt16LE(Math.round(v * 32767), 44 + i * 2); }
fs.writeFileSync(path.join(__dirname, 'sfx.wav'), out);

// ---------- Messwerte ----------
const db = x => (20 * Math.log10(Math.max(1e-9, x))).toFixed(1);
const rms = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += (buf[i] * gain) ** 2; return Math.sqrt(s / Math.max(1, b - a)); };
console.log(`sfx.wav: ${(N / SR).toFixed(3)} s, Spitze ${db(peak)} dBFS, geclippte Samples ${clip}, RMS gesamt ${db(rms(0, N))} dBFS`);
const per = []; for (let s = 0; s < Math.ceil(total); s++) per.push(db(rms(s * SR, Math.min(N, (s + 1) * SR))));
console.log('RMS pro Sekunde (dBFS): ' + per.join(' '));
// längste Stille: 50-ms-Fenster unter −50 dBFS
let run = 0, worst = 0, at = 0; const w = Math.floor(.05 * SR);
for (let i = 0; i + w <= N; i += w) { if (rms(i, i + w) < Math.pow(10, -50 / 20)) { run += .05; if (run > worst) { worst = run; at = i / SR; } } else run = 0; }
console.log(`längste Stille (< −50 dBFS): ${worst.toFixed(2)} s${worst ? ' bei ' + at.toFixed(2) + ' s' : ''}`);
if (clip || peak > Math.pow(10, -1.5 / 20) || worst > .5) { console.log('NICHT OK'); process.exit(1); }
console.log('OK');
