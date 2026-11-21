#!/usr/bin/env bash
# encode-degraus.sh — gera a escada de qualidade do filme para o site (desktop 16:9 e celular 9:16) + pôsteres + manifesto.
# Origem: Estudo de Referência v2.3 (encode.sh), sem as partes específicas da marca. Lê FONTES; usa, nesta ordem:
#   1) IN36/ID-36.mp4 e IN36/ID-m36.mp4  (masters interpolados de interpola.sh)            → fonte "ia-4k-36fps"
#   2) IN4K/ID-4k.mp4                      (master IA de upscale-clipes.sh; exige FPS=12 GOP=1) → "ia-4k"
#   3) o clipe original do Flow com lanczos + unsharp leve (exige FPS=12 GOP=1)               → "flow-original"
#   PROJETO=. FONTES=fontes.txt OUT=filme SITE=site/public/filme ./encode-degraus.sh [--site]
# Formato (o filme-rolagem.ts conta com isto):
#   H.264 yuv420p, sem B (-bf 0), quadro-chave EXATAMENTE a cada GOP quadros (-g/-keyint_min, -sc_threshold 0), faststart, sem áudio.
#   36 fps GOP 6 ficou MAIS LEVE que 12 fps all-intra e 3× mais fluido. (GOP=1 = all-intra; só para 12 fps.)
# Pesos medidos (8 clipes de 6–8 s, 36 fps GOP 6): 960 12,5 MB · 1280 29,8 · 1920 55,2 · 2560 87,5 · 540 9,1 · m720 23,4 · m1080 43,3.
set -euo pipefail
cd "${PROJETO:-.}"
FONTES=${FONTES:-fontes.txt}; OUT=${OUT:-filme}; SITE=${SITE:-site/public/filme}
IN36=${IN36:-flow/4k-36}; IN4K=${IN4K:-flow/4k}
CRF_D=${CRF_D:-22}; CRF_M=${CRF_M:-23}; FPS=${FPS:-36}; GOP=${GOP:-6}
DESK=${DESK:-"960:540 1280:720 1920:1080 2560:1440"}
CEL=${CEL:-"540:960:540 720:1280:m720 1080:1920:m1080"}
FF="ffmpeg -hide_banner -loglevel error -y"
X264="-c:v libx264 -preset slow -tune film -g $GOP -keyint_min $GOP -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an"
command -v ffmpeg >/dev/null || { echo "precisa de ffmpeg (com libx264 e libaom-av1)" >&2; exit 1; }
mkdir -p "$OUT"; TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
avif() { $FF -i "$1" -frames:v 1 -c:v libaom-av1 -still-picture 1 -crf 34 -cpu-used 6 "$2"; }
jpg()  { $FF -i "$1" -frames:v 1 -q:v 4 "$2"; }

declare -A SRC INI FIM CX; ORDEM=()
while read -r id arq ini fim cx; do
  [[ -z "${id:-}" || "$id" == \#* ]] && continue
  SRC[$id]=$arq; INI[$id]=${ini:-0}; FIM[$id]=${fim:--}; CX[$id]=${cx:-0.5}; ORDEM+=("$id")
done < "$FONTES"

nomes=(); for d in $DESK; do nomes+=("${d%%:*}"); done; for d in $CEL; do nomes+=("${d##*:}"); done
echo '{ "fps": '"$FPS"', "gop": '"$GOP"', "clipes": {' > "$OUT/manifesto.json"; first=1
for id in "${ORDEM[@]}"; do
  src="${SRC[$id]}"; srcm="$src"; cortado=0; nitida=",unsharp=5:5:0.45"; fonte=flow-original
  trecho=(-ss "${INI[$id]}"); [[ "${FIM[$id]}" != "-" ]] && trecho+=(-to "${FIM[$id]}")
  if [[ -f "$IN36/$id-36.mp4" && -f "$IN36/$id-m36.mp4" ]]; then
    src="$IN36/$id-36.mp4"; srcm="$IN36/$id-m36.mp4"; cortado=1; nitida=""; fonte=ia-4k-36fps
    trecho=()   # o trecho já foi aplicado antes do upscale/interpolação (se não foi, aplique INI/FIM no upscale)
  elif [[ -f "$IN4K/$id-4k.mp4" ]]; then src="$IN4K/$id-4k.mp4"; srcm="$src"; nitida=""; fonte=ia-4k; fi
  if [[ $fonte != ia-4k-36fps && ( $FPS != 12 || $GOP != 1 ) ]]; then
    echo "$id: sem master a 36 fps; rode interpola.sh ou use FPS=12 GOP=1 (all-intra)" >&2; exit 1; fi
  echo "• $id ← $src ($fonte)"
  for d in $DESK; do w=${d%%:*}; h=${d##*:}
    sh=""; crf=$CRF_D; [[ $w -gt 960 ]] && sh=$nitida; [[ $w -le 960 ]] && crf=26   # 960 = degrau de economia de dados
    $FF "${trecho[@]}" -i "$src" -vf "fps=$FPS,scale=$w:$h:flags=lanczos$sh,setsar=1" $X264 -crf "$crf" "$OUT/$id-$w.mp4"
  done
  for d in $CEL; do IFS=: read -r w h nome <<< "$d"
    sh=""; crf=$CRF_M; [[ $w -gt 540 ]] && sh=$nitida; [[ $w -le 540 ]] && crf=28
    corte="crop=ih*9/16:ih:(iw-ih*9/16)*${CX[$id]}:0,"; [[ $cortado == 1 ]] && corte=""
    $FF "${trecho[@]}" -i "$srcm" -vf "fps=$FPS,${corte}scale=$w:$h:flags=lanczos$sh,setsar=1" $X264 -crf "$crf" "$OUT/$id-$nome.mp4"
  done
  for nome in "${nomes[@]}"; do v="$OUT/$id-$nome.mp4"
    n=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$v")
    $FF -i "$v" -vf "select=eq(n\,0)" -frames:v 1 "$TMP/ini.png"
    $FF -i "$v" -vf "select=eq(n\,$((n-1)))" -frames:v 1 "$TMP/fim.png"
    for p in ini fim; do avif "$TMP/$p.png" "$OUT/$id-$nome-$p.avif"; jpg "$TMP/$p.png" "$OUT/$id-$nome-$p.jpg"; done
    # prova: chave exatamente a cada GOP e nenhum B (o decodificador do site depende disso)
    tipos=$(ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 "$v" | tr -d '\n,')
    esperado=$(python3 -c "print(''.join('I' if i%$GOP==0 else 'P' for i in range($n)))")
    [[ "$tipos" == "$esperado" ]] || { echo "$id-$nome: padrão de quadros inesperado" >&2; exit 1; }
    N=$n
  done
  [[ $first == 1 ]] || echo ',' >> "$OUT/manifesto.json"; first=0
  printf '"%s": { "fonte": "%s", "n": %s, "bytes": {' "$id" "$fonte" "$N" >> "$OUT/manifesto.json"; sep=""
  for nome in "${nomes[@]}"; do printf '%s "%s": %s' "$sep" "$nome" "$(stat -c %s "$OUT/$id-$nome.mp4")" >> "$OUT/manifesto.json"; sep=","; done
  printf ' } }' >> "$OUT/manifesto.json"
done
echo '} }' >> "$OUT/manifesto.json"
for nome in "${nomes[@]}"; do du -ch "$OUT"/*-"$nome".mp4 | tail -1 | sed "s/total/total no degrau $nome/"; done
if [[ "${1:-}" == "--site" ]]; then rm -rf "$SITE"; mkdir -p "$SITE"; cp -a "$OUT/." "$SITE/"; echo "copiado para $SITE"; fi
