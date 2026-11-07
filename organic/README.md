# Diva Tape – 20 Organic Reels [KI]

Von Claude erstellt am 06./07.11.2026, **nicht von King geprüft**. Animation komplett in Code (HTML/SVG → MP4), 1080×1920, 30 fps, mit Untertiteln und Endkarte „Diva Tape – Lippenpflege für die Nacht – Link in Bio“.

**Ton fehlt noch:** ElevenLabs hat das Konto während der Produktion gesperrt („Unusual activity … Free Tier access has been disabled“), danach war auch das Tageslimit erreicht. Nur OV13 hat eine echte Stimme (in ElevenLabs, Flow-Link in `videos/OV13/video.json`). Alle Videos sind auf die geschätzte Sprechzeit getimt (2,5 Wörter/s, OV20 ASMR 1,7 Wörter/s) und funktionieren auch stumm mit Untertiteln.

**Stimme nachträglich einsetzen:** Voiceover-Text aus `skripte.md` (oder `videos/OVxx/video.json`) in ElevenLabs/Higgscheap vertonen (ALT: Stimme „Irene UGC“, JUNG: „Lena 23, Sanft“), als `videos/OVxx/vo.mp3` ablegen und `bash organic/engine/finalize_all.sh` laufen lassen. Der Renderer legt die Szenen dann auf die echten Sprechpausen und schreibt `OVxx_final.mp4` mit Ton.

Pro Video im Ordner `videos/OVxx/`: `OVxx_silent.mp4` (das Video), `caption.txt` (Instagram-Caption + Hashtags), `motion.jpg` (8 Standbilder), `scene.js`/`video.json` (Quelle).

| ID | Titel | Avatar | Säule | Länge | Hook | Stimme |
|---|---|---|---|---|---|---|
| OV01 | Letzter Schritt vor Licht aus | ALT | Ritual & Ästhetik | 34.3 s | Mein letzter Schritt, bevor das Licht ausgeht | fehlt (ElevenLabs gesperrt) |
| OV02 | Der Lippenstift blieb drauf | ALT | Storytime/Ich-Erzählung | 39.8 s | Ich hab ihn wieder abgewischt. | fehlt (ElevenLabs gesperrt) |
| OV03 | Das Foto im Schuhkarton | ALT | Storytime/Ich-Erzählung | 36.9 s | Dieses Foto hätte ich nicht finden sollen. | fehlt (ElevenLabs gesperrt) |
| OV04 | Termin zweimal abgesagt | ALT | Storytime/Ich-Erzählung | 38.9 s | Ich hab den Termin abgesagt. Zweimal. | fehlt (ElevenLabs gesperrt) |
| OV05 | Drei Winter-Fehler | ALT | Aufklärung | 38.5 s | Drei Winter-Fehler, die ich jahrelang gemacht hab | fehlt (ElevenLabs gesperrt) |
| OV06 | Mit 56 zum ersten Mal | ALT | Aufklärung | 38.1 s | Mit 56 zum ersten Mal Mouth Tape | fehlt (ElevenLabs gesperrt) |
| OV07 | Mein Nachttisch mit 52 | ALT | Ritual & Ästhetik | 39.3 s | Mein Nachttisch mit 52. Ein Teil überrascht. | fehlt (ElevenLabs gesperrt) |
| OV08 | Das Erste am Morgen | ALT | Ritual & Ästhetik | 32.9 s | Das Erste, was ich morgens mache | fehlt (ElevenLabs gesperrt) |
| OV09 | Drei Abende bis zur Frage | ALT | Humor/Community | 37.7 s | Er hat drei Abende gebraucht, um zu fragen. | fehlt (ElevenLabs gesperrt) |
| OV10 | Sechs Lippenbalsame | ALT | Storytime/Ich-Erzählung | 39.7 s | Ich hatte sechs Lippenbalsame in der Handtasche. | fehlt (ElevenLabs gesperrt) |
| OV11 | Bringt Pflege noch was? | ALT | Aufklärung | 36.5 s | „Bei mir bringt Pflege eh nichts mehr.“ | fehlt (ElevenLabs gesperrt) |
| OV12 | Sonntagabend gehört mir | ALT | Ritual & Ästhetik | 31.3 s | Sonntagabend, 21 Uhr. Das gehört nur mir. | fehlt (ElevenLabs gesperrt) |
| OV13 | POV: Freund sieht mich so | JUNG | Humor/Community | 31.4 s | POV: Mein Freund sieht mich so im Bett | echte Take in ElevenLabs vorhanden |
| OV14 | Der unerwartete letzte Schritt | JUNG | Ritual & Ästhetik | 33.3 s | Night Routine. Der letzte Schritt ist unerwartet. | fehlt (ElevenLabs gesperrt) |
| OV15 | Wofür ist das Loch? | JUNG | Aufklärung | 34.8 s | Wofür ist das Loch in der Mitte? | fehlt (ElevenLabs gesperrt) |
| OV16 | Lippenmaske im Kissen | JUNG | Storytime/Ich-Erzählung | 38.5 s | Meine Lippenmaske klebte jeden Morgen im Kissen. | fehlt (ElevenLabs gesperrt) |
| OV17 | Freundin kam aus dem Studio | JUNG | Storytime/Ich-Erzählung | 38.9 s | Meine beste Freundin kam aus dem Lippen-Studio. | fehlt (ElevenLabs gesperrt) |
| OV18 | Übernachtung mit Tape | JUNG | Humor/Community | 38.9 s | POV: Deine beste Freundin übernachtet bei dir | fehlt (ElevenLabs gesperrt) |
| OV19 | Was steckt im Kollagen-Tape? | JUNG | Aufklärung | 39.3 s | Was steckt eigentlich in einem Kollagen-Tape? | fehlt (ElevenLabs gesperrt) |
| OV20 | ASMR: Tape drauf | JUNG | Ritual & Ästhetik | 29.8 s | ASMR: Tape drauf. Licht aus. | fehlt (ElevenLabs gesperrt) |

## Bitte prüfen [KI]
- Forum-Zitate (OV02, OV04, OV10, OV11, OV16, OV17) stehen im englischen Originalwortlaut, Quelle „Kundin in einem Forum“. Wortlaut vor dem Posten am Original-Thread gegenprüfen.
- „Sicherheitsloch, da kann Luft durch“ (OV06, OV09, OV15, OV19) und „atmungsaktiver Kleber“ (OV19) stehen im Voiceover bzw. Untertitel. Belegte Produktfakten, aber nah am Atem-Thema. Im Bild steht nur „kleines Loch“ (Ausnahme OV15: „Luft kann durch“).
- „Medizinische Baumwolle“ (OV04, OV14, OV15, OV19): belegt, klingt aber medizinisch.
- OV12: Bildtext „Pflege, während ich schlafe.“ (laut Doc 01 erlaubt).
- OV07: zeigt eine schlichte rosa Box ohne Aufdruck (keine echte Verpackung).
- Captions enthalten je 1–2 Emojis aus den Skripten.
