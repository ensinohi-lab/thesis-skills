#!/usr/bin/env bash
# upscale-clipes.sh — masters 4K por IA (Real-ESRGAN realesr-general-x4v3 na CPU, sem créditos) de cada clipe da lista.
# Origem: Estudo de Referência v2.2 (16/11/2026). Ferramenta: UPSCALE_BIN (padrão: <agency-tools>/bin/upscale-4k,
# instalação em <agency-tools>/upscale-4k/LEIA-ME.md; em outra máquina veja FERRAMENTAS-E-BIBLIOTECAS.md §Upscale).
#   ./upscale-clipes.sh                 todos os clipes de FONTES (720p primeiro: são os que mais ganham)
#   ./upscale-clipes.sh F3 F7           só esses
#   FONTES=fontes.txt OUT=flow/4k FPS_MASTER=12 TEMPORAL=0.5 MODELO=general4x ./upscale-clipes.sh
# Idempotente: pula o que existe; grava .parcial.mp4 e só renomeia no fim (pode matar e retomar).
# Tempo medido (8 vCPU, sem GPU): 720p→4K 5–14 s/quadro; 1080p→4K 14–30 s/quadro; com o box carregado chegou a 197 s/quadro.
# Rode à noite, com nohup, e NÃO acompanhe com o agente (cada consulta gasta uso): o log diz tudo.
#   nohup ./upscale-clipes.sh > /dev/null 2>&1 &   ;   tail -f flow/4k/upscale.log
set -euo pipefail
cd "${PROJETO:-.}"   # PROJETO=pasta do projeto (onde ficam fontes.txt e flow/); padrão: pasta atual
FONTES=${FONTES:-fontes.txt}; OUT=${OUT:-flow/4k}; LOG="$OUT/upscale.log"
UPSCALE_BIN=${UPSCALE_BIN:-<agency-tools>/bin/upscale-4k}
TEMPORAL=${TEMPORAL:-0.5}; MODELO=${MODELO:-general4x}; FPS_MASTER=${FPS_MASTER:-12}; CRF=${CRF:-14}
mkdir -p "$OUT"
declare -A SRC INI FIM
while read -r id arq ini fim _; do [[ -z "${id:-}" || "$id" == \#* ]] && continue; SRC[$id]=$arq; INI[$id]=${ini:-0}; FIM[$id]=${fim:--}; done < "$FONTES"
if [[ $# -gt 0 ]]; then IDS=("$@"); else
  # ordem: menores primeiro (rascunhos 720p), para ter resultado cedo
  mapfile -t IDS < <(for id in "${!SRC[@]}"; do h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "${SRC[$id]}"); echo "$h $id"; done | sort -n | awk '{print $2}')
fi
for id in "${IDS[@]}"; do
  dest="$OUT/$id-4k.mp4"
  [[ -f "$dest" ]] && { echo "$(date '+%F %T') $id já existe, pulando" >> "$LOG"; continue; }
  echo "$(date '+%F %T') $id ← ${SRC[$id]} ($MODELO, temporal $TEMPORAL, $FPS_MASTER fps)" >> "$LOG"
  corte=(); [[ "${INI[$id]}" != 0 ]] && corte+=(--ss "${INI[$id]}")
  [[ "${FIM[$id]}" != "-" ]] && corte+=(-t "$(python3 -c "print(${FIM[$id]}-${INI[$id]})")")
  t0=$(date +%s)
  "$UPSCALE_BIN" "${SRC[$id]}" "${corte[@]}" -o "$OUT/$id-4k.parcial.mp4" -m "$MODELO" --fps "$FPS_MASTER" --temporal "$TEMPORAL" --crf "$CRF" 2>> "$LOG.quadros" | tee -a "$LOG"
  mv "$OUT/$id-4k.parcial.mp4" "$dest"
  echo "$(date '+%F %T') $id pronto em $(( $(date +%s) - t0 )) s" >> "$LOG"
done
echo "$(date '+%F %T') fim" >> "$LOG"
