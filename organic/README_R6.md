# Diva Tape – Runde 6: 6 Organic-Videos [KI]

Von Claude erstellt am 20.11.2026, **nicht von King geprüft**. Engine wie Runde 1 (`engine/`), erweitert um Cover, Schleife, „Senden an“-Fenster und Quellen-Karte (`engine/kit.js`).

| ID | Format | Hook | Länge | Produkt | Stand |
|---|---|---|---|---|---|
| R601 | G Blick ins Innere | Dieses Symbol auf deinem Lippenstift ignorierst du seit Jahren. | 53 s | nein | stumm, Stimme fehlt |
| R602 | G Selbsttest | Du trägst vielleicht das falsche Rot. Schau auf dein Handgelenk. | 46 s | nein | stumm, Stimme fehlt |
| R603 | G 3 Optionen | Dunkel, hell oder glänzend: Was lässt Lippen voller wirken? | 40 s | nein | stumm, Stimme fehlt |
| R604 | E Rätsel → Auflösung | Warum hält Lippenstift bei ihr, und bei dir nicht? | 41 s | ja | stumm, Stimme fehlt |
| R605 | C Wettkampf | Wer killt roten Lippenstift zuerst? | 34 s | nein | fertig mit Ton (`R605_final.mp4`) |
| R606 | F Persona Braut | Du heiratest bald und willst rote Lippen auf jedem Foto? | 31 s | ja | stumm, Stimme fehlt |

Pro Ordner `videos/R60x/`: Video, `cover.png` (Titelbild), `caption.txt`, `motion.jpg` (8 Standbilder), Quelle (`scene.js`, `video.json`). Sprechtexte in `skripte_r6.json`.

**Stimme einsetzen:** Sprechtext aus `skripte_r6.json` (Feld `voiceover`) mit der Stimme Josephine vertonen, als `videos/R60x/vo.mp3` ablegen, dann `node organic/engine/render.js organic/videos/R60x`. Der Renderer legt die Szenen auf die echten Sprechpausen und schreibt `R60x_final.mp4`.

## Bitte prüfen
- Die Quellen konnten aus der Cloud-Sitzung nicht geöffnet werden (Netzwerk gesperrt). Die Fakten stammen aus Suchauszügen und sind vorsichtig formuliert. Vor dem Posten gegenlesen: EU-Kosmetikverordnung 1223/2009 Art. 19 (R601), dm-Ratgeber „Trockene Lippen“ (R604), Rossmann-/dm-Ratgeber zum Unterton (R602), dm-Ratgeber zu vollen Lippen (R603).
- R602 und R603 nennen „Rossmann“ bzw. „dm“ auf der Quellen-Karte im Bild.
- R604 und R606 zeigen das Tape nachts mit geschlossenen Augen auf dem Kissen (kein Text zu Schlaf).
- R605: Ton wurde nur gemessen, nicht angehört.
- Ich bin kein Anwalt – bitte bei Unsicherheit prüfen lassen.
