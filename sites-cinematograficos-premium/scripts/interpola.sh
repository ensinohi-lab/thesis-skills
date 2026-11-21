#!/usr/bin/env bash
# interpola.sh — FLUIDEZ: masters a 12 fps ganham quadros intermediários por interpolação de movimento
# (ffmpeg minterpolate, MCI + OBMC bidirecional; local, sem IA na nuvem, sem créditos) → 36 fps.
# Origem: Estudo de Referência v2.3 (16/11/2026). Sem isso, cada quadro cobria 50–60 px de rolagem no celular e a imagem
# trocava ~3×/s ("parece que é por frame"). Com 36 fps: ~11 trocas/s no celular emulado.
#   ./interpola.sh            todos (paralelo; minterpolate usa ~1 núcleo por processo)
#   ./interpola.sh F5         só esse
#   FONTES=fontes.txt IN=flow/4k OUT=flow/4k-36 FPS=36 JOBS=4 LARG=2560 ./interpola.sh
# Saídas: OUT/ID-36.mp4 (16:9, LARG×LARG*9/16) e OUT/ID-m36.mp4 (1080×1920, recorte 9:16 em RECORTE_X).
# MEMÓRIA: em 3840×2160 com 8 processos estourou 15 GB. Teto prático: 2560 no desktop. JOBS=4 em 16 GB.
# Intermediário quase sem perda (CRF 12, todo quadro chave). Idempotente (.parcial.mp4).
# Tempo medido: 8 clipes × 2 formatos em ~17 min (JOBS=4, 8 vCPU).
# Confira artefatos (bordas "derretendo" em movimentos rápidos): se houver, use mi_mode=blend no clipe ou RIFE (GPU).
set -euo pipefail
cd "${PROJETO:-.}"   # PROJETO=pasta do projeto (onde ficam fontes.txt e flow/); padrão: pasta atual
FONTES=${FONTES:-fontes.txt}; IN=${IN:-flow/4k}; OUT=${OUT:-flow/4k-36}; FPS=${FPS:-36}; JOBS=${JOBS:-4}; LARG=${LARG:-2560}
mkdir -p "$OUT"; ALT=$(( LARG * 9 / 16 ))
MI="minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
X="-c:v libx264 -preset fast -crf 12 -g 1 -pix_fmt yuv420p -an"
declare -A CX; ORDEM=()
while read -r id _ _ _ cx; do [[ -z "${id:-}" || "$id" == \#* ]] && continue; CX[$id]=${cx:-0.5}; ORDEM+=("$id"); done < "$FONTES"
IDS=("$@"); [[ ${#IDS[@]} -gt 0 ]] || IDS=("${ORDEM[@]}")
tarefas=()
for id in "${IDS[@]}"; do
  src=$IN/$id-4k.mp4; [[ -f $src ]] || { echo "falta $src (rode upscale-clipes.sh ou aponte IN para os originais)" >&2; exit 1; }
  [[ -f $OUT/$id-36.mp4 ]]  || tarefas+=("$id|$src|$OUT/$id-36|scale=$LARG:$ALT:flags=lanczos,setsar=1")
  [[ -f $OUT/$id-m36.mp4 ]] || tarefas+=("$id|$src|$OUT/$id-m36|crop=ih*9/16:ih:(iw-ih*9/16)*${CX[$id]}:0,scale=1080:1920:flags=lanczos,setsar=1")
done
[[ ${#tarefas[@]} -gt 0 ]] || { echo "nada a fazer"; exit 0; }
faz() { IFS='|' read -r id src dest vf <<< "$1"; t0=$(date +%s)
  if ffmpeg -hide_banner -loglevel error -y -i "$src" -vf "$vf,$MI" $X "$dest.parcial.mp4"; then
    mv "$dest.parcial.mp4" "$dest.mp4"; echo "$(date '+%F %T') $(basename "$dest") pronto em $(( $(date +%s) - t0 )) s"
  else rm -f "$dest.parcial.mp4"; echo "$(date '+%F %T') $(basename "$dest") FALHOU" >&2; return 1; fi; }
export -f faz; export MI X
printf '%s\n' "${tarefas[@]}" | xargs -P "$JOBS" -I{} bash -c 'faz "$@"' _ {}
