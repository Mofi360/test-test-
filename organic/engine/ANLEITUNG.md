# Diva Tape Reel Engine – Anleitung für die Produktion eines Videos [KI]

Ein Video = ein Ordner `organic/videos/OVxx/` mit `video.json` + `scene.js`. Gerendert wird mit
`node organic/engine/render.js organic/videos/OVxx --preview` (Standbilder + `contact.jpg`) und ohne `--preview` (MP4).
Liegt `vo.mp3` im Ordner, legt der Renderer die Szenengrenzen auf echte Atempausen und schreibt zusätzlich `OVxx_final.mp4` mit Ton.

## video.json
```json
{
 "id": "OV01", "avatar": "ALT", "titel": "...",
 "voice_duration": 31.4,            // Sekunden der gewählten ElevenLabs-Take (duration_secs)
 "voice": {"voice_id": "...", "name": "...", "flow_url": "...", "flow_id": "...", "generation_id": "...", "session_id": "..."},
 "scenes": [ {"id": "s1", "text": "exakt der Voiceover-Teil dieser Szene"}, ... ],
 "endcard": {"line": "Lippenpflege für die Nacht", "cta": "Link in Bio"},
 "capY": 1400                        // optional: y-Position der Untertitel (Standard 1400)
}
```
- Die Szenen-Texte zusammen = exakt der Voiceover. Die Dauer jeder Szene wird automatisch aus der Textlänge berechnet.
- Pro Szene optional `"captions": false` (wenn großer Text dasselbe sagt) oder `"capY": 1500`.
- `"endcard": false` schaltet die Standard-Endkarte ab (dann eigene Schlussszene bauen).

## scene.js
```js
const { el, svg, place, ART, C, F, tw, pr, ease, noise, bigText, note, quoteCard, list, clamp, lerp } = DT;
SCENES.s1 = { bg: C.rosa, build(root, ctx) {      // ctx.dur = Szenendauer in s
  const hook = bigText(root, 'Ich wollte nur *Lippenstift* auftragen.', { y: 240, size: 118, step: .04 });
  const ls = svg(ART.lipstick(), {}, root, '0 0 400 400', 420, 420);
  return (t, p) => { hook.update(t); place(ls, 820, 1150, 1, tw(t, .2, 1.2, 30, -18)); };
}};
```
- `build` baut DOM einmal, gibt `update(t, p)` zurück. t = Sekunden seit Szenenstart, p = 0..1. **Alles nur aus t berechnen** (kein Math.random, kein Date, keine CSS-Transitions).
- Canvas 1080×1920. **Sicherheitszonen:** oben 0–180 frei lassen (IG-Kopf), unten ab 1560 nichts Wichtiges (IG-Caption/Buttons), rechts 960–1080 nur Deko. Untertitel sitzen bei y≈1400–1500: Hauptmotive zwischen y 200 und 1330 halten.
- Farben `C`: rosa (Grundfläche), rosaTief, rosaHell, beere (sparsamer Akzent, max. 10 %), schwarz, weiss, nacht/nachtHell (Nachtszenen), haut, lippe. Brand = Rosa + Schwarz + Weiß.
- Schriften `F`: display (Gloock – große Aussagen), sans (Bricolage Grotesque – Listen, Labels), hand (Caveat – handschriftliche Notizen). Keine anderen Schriften.
- Bausteine: `bigText(root, text, {x,y,w,size,color,accent,t0,step,align,font})` (Wörter mit `*…*` in Akzentfarbe), `note(root, text, {x,y,r,t0,arrow:[dx,dy]})`, `quoteCard(root, zitat, quelle, {y,size,t0})`, `list(root, [{text, no, strike}], {y,size,t0,step})`, `svg(markup, style, root, viewBox, w, h)`, `place(node, cx, cy, scale, rotDeg, opacity)`, `tw(t,t0,t1,a,b,ease)`, `pr(t,t0,t1,ease)`, `noise(t,seed)` (leichtes Wackeln).
- Illustrationen `ART` (SVG-Markup, viewBox 0 0 400 400): `lips(fullness 0..1)`, `tape(withPad)`, `face(fullness, tapeOpacity, smile)`, `moon()`, `star(x,y,s)`, `lipstick()`, `mirror()`, `phone(screenColor)`, `lamp(on)`, `pillow()`, `drop()`, `heater()`, `jar()`, `heart()`, `check()`, `cross()`, `syringe()`, `clock()`. Eigene SVGs sind ausdrücklich erwünscht (gleicher flacher Stil, keine Verläufe als Deko, keine Emojis als Icons).
- Für Animation von SVG-Inhalten: `node.querySelector('svg').innerHTML = ART.face(tw(...))` pro Frame ist erlaubt.

## Gestaltungsregeln (menschliches Design, Kings Brand)
- Erste Frame (t=0) muss schon die Hook zeigen (für Thumbnail): bei der Hook `step: .03` und `t0: 0`, oder Hook statisch.
- Ein Hauptgedanke pro Szene. Bewegung sparsam: ein gestalteter Moment pro Szene, nicht alles gleichzeitig einblenden.
- Keine Kicker/Überzeilen, keine Icon-Karten-Raster, keine Verlaufstexte, kein Glas/Blur, keine Emojis als Icons, kein Neon.
- Hintergründe wechseln zwischen rosa, rosaHell, weiss und nacht (Abend/Nacht-Szenen) – nicht jede Szene gleich.
- Kein Vorher-Nachher. Keine abwertende Lippen-Nahaufnahme. Kein negatives Selbstbild als Bild.
- Die Verpackung nicht nachzeichnen (echte Packung hat englischen Aufdruck) – das Tape selbst (`ART.tape`) zeigen.
- Echte Kundinnen-Zitate nur im exakten Wortlaut mit `quoteCard` und Quelle „Kundin in einem Forum“ o. ä.

## Ablauf pro Video
1. Skript aus `organic/skripte.json` nehmen (id).
2. ElevenLabs: Flow anlegen (`creative_create_flow`, Name „Diva Tape OVxx – Voiceover“), dann `creative_generate_speech` mit `model_id: eleven_v4`, voice ALT = `MOOG1hZESAxDt4UaletY` (Irene, UGC, mittleres Alter), JUNG = `it8IUwkHD8mtjbyJyCuC` (Lena, 23, sanft). Prompt = exakt der Voiceover-Text. Mit `creative_get_flow_run_status` pollen. Erste Take nehmen; `duration_secs` → `voice_duration`; flow_id, flow_url, generation_id, session_id in `video.json > voice` schreiben. **Nicht erneut generieren**, außer die Take ist fehlerhaft.
   (Der Download der MP3 ist aus diesem Container gesperrt; der Ton wird später mit `vo.mp3` + erneutem Render angelegt.)
3. `video.json` + `scene.js` schreiben, `--preview` rendern, `contact.jpg` und einzelne `preview_*.jpg` ansehen, verbessern, bis es sauber aussieht (Text überlappt nichts, nichts in den Sicherheitszonen, Hook ab Frame 0 sichtbar).
4. Voll rendern → `OVxx_silent.mp4`. Mit ffmpeg 6 Frames als Kontaktbogen ziehen und prüfen.
5. `organic/videos/OVxx/caption.txt` schreiben (Instagram-Caption + Hashtags aus dem Skript).
6. Preview-JPGs löschen (nur `contact.jpg` behalten).
