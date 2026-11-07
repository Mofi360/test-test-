#!/usr/bin/env node
/* Diva Tape Reel Engine – render.js  [KI]
 * Nutzung:  node organic/engine/render.js organic/videos/OV01 [--preview] [--fps 30]
 * Erwartet im Video-Ordner: video.json + scene.js (optional vo.mp3 = echte Stimme)
 * Ergebnis: <id>_silent.mp4 (ohne Ton), mit vo.mp3 zusätzlich <id>_final.mp4; --preview schreibt nur Standbilder (preview_*.jpg)
 */
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const { chromium } = require('playwright');

const dir = path.resolve(process.argv[2]);
const args = process.argv.slice(3);
const PREVIEW = args.includes('--preview');
const FPS = args.includes('--fps') ? +args[args.indexOf('--fps') + 1] : 30;
const engine = __dirname;
const V = JSON.parse(fs.readFileSync(path.join(dir, 'video.json'), 'utf8'));

// ---------- Timing ----------
const vo = path.join(dir, 'vo.mp3');
let voiceDur = V.voice_duration;
if (fs.existsSync(vo)) voiceDur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo]).toString().trim();
if (!voiceDur) throw new Error('voice_duration fehlt (Sekunden) und kein vo.mp3 vorhanden');
const lead = V.lead_in ?? 0.3, tail = V.tail ?? 2.2;

// Sprechgewicht: Zeichen + Pausen an Satzzeichen
const weight = s => s.replace(/\s+/g, ' ').length + (s.match(/[.!?]/g) || []).length * 9 + (s.match(/[,:;…]/g) || []).length * 4;

// Pausen aus der echten Tonspur, um Szenengrenzen an echte Atempausen zu legen
function silences(file) {
  try {
    const out = execFileSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-38dB:d=0.16', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] });
    return parse(out.toString());
  } catch (e) { return parse((e.stderr || '').toString()); }
  function parse(s) { const r = []; let st = null; for (const l of s.split('\n')) { let m; if ((m = l.match(/silence_start: ([\d.]+)/))) st = +m[1]; if ((m = l.match(/silence_end: ([\d.]+)/)) && st != null) { r.push((st + +m[1]) / 2); st = null; } } return r; }
}

const ws = V.scenes.map(s => weight(s.text || ''));
const total = ws.reduce((a, b) => a + b, 0) || 1;
let bounds = [0]; let acc = 0;
ws.forEach(w => { acc += w; bounds.push(acc / total * voiceDur); });
if (fs.existsSync(vo)) { // an nächstgelegene Pause schnappen (max 0.6 s)
  const sil = silences(vo);
  bounds = bounds.map((b, i) => { if (i === 0 || i === bounds.length - 1) return b; let best = b, bd = .6; for (const p of sil) { const d = Math.abs(p - b); if (d < bd) { bd = d; best = p; } } return best; });
}
const scenes = V.scenes.map((s, i) => {
  const start = (i === 0 ? 0 : lead + bounds[i]);
  const end = lead + bounds[i + 1] + (i === V.scenes.length - 1 ? 0.25 : 0);
  return { id: s.id, text: s.text || '', start, dur: Math.max(0.5, (s.hold ?? 0) + end - start), speakStart: lead + bounds[i] };
});
// Szenen mit "hold" verschieben folgende nicht – hold verlängert nur optisch bis zur nächsten Szene (Überlappung wird abgeschnitten)
for (let i = 0; i < scenes.length - 1; i++) scenes[i].dur = Math.min(scenes[i].dur, scenes[i + 1].start - scenes[i].start);
const endStart = V.endcard === false ? 1e9 : lead + voiceDur + 0.25;
const duration = (V.endcard === false ? lead + voiceDur + 0.6 : endStart + tail);

// Untertitel: Phrasen à max. ~3–4 Wörter / 22 Zeichen
const captions = [];
scenes.forEach((s, i) => {
  if (V.scenes[i].captions === false) return;
  const words = s.text.split(/\s+/).filter(Boolean);
  const chunks = []; let cur = [];
  for (const w of words) {
    const cand = [...cur, w].join(' ');
    if (cur.length && (cand.length > 22 || cur.length >= 4)) { chunks.push(cur.join(' ')); cur = [w]; } else cur.push(w);
    if (/[.!?…]$/.test(w)) { chunks.push(cur.join(' ')); cur = []; }
  }
  if (cur.length) chunks.push(cur.join(' '));
  const speakDur = (lead + bounds[i + 1]) - s.speakStart;
  const cw = chunks.map(weight), ct = cw.reduce((a, b) => a + b, 0) || 1;
  let a = 0;
  chunks.forEach((c, j) => {
    const st = s.speakStart + a / ct * speakDur; a += cw[j];
    const en = s.speakStart + a / ct * speakDur;
    captions.push({ text: c.replace(/[„“"]/g, ''), start: st, end: en + .05, rot: ((captions.length * 37) % 5 - 2) * .8, y: V.scenes[i].capY });
  });
});

for (let i = 0; i < captions.length - 1; i++) captions[i].end = Math.min(captions[i].end, captions[i + 1].start);
const timeline = { scenes, captions, endStart, duration, capY: V.capY, noCaptions: !!V.noCaptions, endcard: V.endcard };
fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify(timeline, null, 1));

(async () => {
  const html = fs.readFileSync(path.join(engine, 'player.html'), 'utf8').replace('SCENE_JS', 'file://' + path.join(dir, 'scene.js'));
  const tmp = path.join(engine, `_player_${V.id}.html`);
  fs.writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + tmp);
  try { await page.evaluate(tl => window.setup(tl), timeline); }
  catch (e) { console.error('SETUP-FEHLER:', e.message, errs.join('\n')); await browser.close(); process.exit(1); }
  const stage = await page.$('#stage');

  if (PREVIEW) {
    const pts = (V.preview_times || [...scenes.map(s => s.start + s.dur * .6), endStart + 1.4]).filter(t => t < duration);
    for (let i = 0; i < pts.length; i++) {
      await page.evaluate(t => window.frame(t), pts[i]);
      await stage.screenshot({ path: path.join(dir, `preview_${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 80 });
    }
    // Kontaktbogen
    try { execFileSync('ffmpeg', ['-y', '-v', 'error', '-pattern_type', 'glob', '-i', path.join(dir, 'preview_*.jpg'), '-vf', `scale=270:480,tile=${Math.min(6, pts.length)}x${Math.ceil(pts.length / 6)}`, '-frames:v', '1', path.join(dir, 'contact.jpg')]); } catch (e) { }
    if (errs.length) console.error('JS-FEHLER:\n' + errs.join('\n'));
    console.log(`Preview: ${pts.length} Bilder, Dauer ${duration.toFixed(2)} s`);
    await browser.close(); fs.unlinkSync(tmp); return;
  }

  const silent = path.join(dir, `${V.id}_silent.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.ceil(duration * FPS);
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    await page.evaluate(t => window.frame(t), f / FPS);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) process.stdout.write(`frame ${f}/${N} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close(); fs.unlinkSync(tmp);
  if (errs.length) console.error('JS-FEHLER:\n' + errs.join('\n'));
  console.log('fertig:', silent, duration.toFixed(2) + ' s');

  if (fs.existsSync(vo)) {
    const fin = path.join(dir, `${V.id}_final.mp4`);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', silent, '-itsoffset', String(lead), '-i', vo,
      '-filter_complex', `[1:a]apad,atrim=0:${duration.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[a]`, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', fin]);
    console.log('mit Stimme:', fin);
  }
})();
