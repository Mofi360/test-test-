#!/usr/bin/env bash
# [KI] Legt die echten ElevenLabs-Stimmen unter alle Videos.
# Voraussetzung: in jedem organic/videos/OVxx/ liegt vo.mp3 (die Take aus video.json > voice.generation_id).
# Holen geht so: in ElevenLabs den Flow öffnen (video.json > voice.flow_url), Take herunterladen, als vo.mp3 speichern.
# Oder (wenn der Container elevenlabsusercontent.com erreichen darf): Claude ruft creative_get_flow_run_status auf
# und lädt die content_url mit curl als vo.mp3.
set -euo pipefail
cd "$(dirname "$0")/../.."
for d in organic/videos/OV*/; do
  id=$(basename "$d")
  [ "$id" = "OV00" ] && continue
  if [ -f "$d/vo.mp3" ]; then
    echo "== $id: rendere mit Stimme"
    node organic/engine/render.js "$d"
  else
    echo "== $id: vo.mp3 fehlt, übersprungen"
  fi
done
