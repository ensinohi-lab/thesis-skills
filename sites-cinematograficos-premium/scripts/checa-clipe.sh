#!/usr/bin/env bash
# checa-clipe.sh — QA de um clipe gerado ANTES de pedir o próximo (Flow/Veo ou outro gerador de vídeo):
#   1) gera o clipe ao contrário (o filme na rolagem toca nos dois sentidos: ao contrário tem de parecer natural);
#   2) folha de contato (12 quadros) para achar texto inventado, gente, objeto que cai/escorre/pisca;
#   3) SSIM da emenda: último quadro deste clipe × primeiro do seguinte (meta ≥ 0,92).
#   ./checa-clipe.sh flow/F2.mp4 [flow/F3.mp4]      → saída em qa/
set -euo pipefail
A=$1; B=${2:-}; mkdir -p qa; n=$(basename "${A%.*}")
ffmpeg -hide_banner -loglevel error -y -i "$A" -vf reverse -an "qa/$n-reverso.mp4"
tot=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$A"); passo=$(( tot / 12 > 0 ? tot / 12 : 1 ))
ffmpeg -hide_banner -loglevel error -y -i "$A" -vf "select='not(mod(n\,$passo))',scale=480:-2,tile=4x3" -fps_mode vfr -frames:v 1 "qa/$n-contato.jpg"
echo "reverso: qa/$n-reverso.mp4 · contato: qa/$n-contato.jpg"
if [[ -n "$B" ]]; then
  ffmpeg -hide_banner -loglevel error -y -sseof -0.1 -i "$A" -frames:v 1 -update 1 qa/_fim.png
  ffmpeg -hide_banner -loglevel error -y -i "$B" -frames:v 1 qa/_ini.png
  ffmpeg -hide_banner -i qa/_fim.png -i qa/_ini.png -lavfi "[0]scale=640:-2[a];[1]scale=640:-2[b];[a][b]ssim" -f null - 2>&1 | grep -o 'All:[0-9.]*' | sed 's/All:/SSIM da emenda (meta ≥ 0.92): /'
  rm -f qa/_fim.png qa/_ini.png
fi
