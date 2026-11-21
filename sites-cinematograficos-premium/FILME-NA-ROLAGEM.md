# Filme na rolagem: pipeline técnico completo

Este pipeline gera e mostra um filme preso atrás da página (`position: fixed`), cujo quadro é decidido pela rolagem, para a frente e para trás, na página inteira. É a versão que está no ar em studiothesis.com.br (v2.3, 16/11/2026). Os scripts ficam em `scripts/`, genéricos e com parâmetros por variável de ambiente.

```
 K0…Kn (imagens)  →  F1…Fn (Flow, 720p/1080p, 24 fps)  →  QA (reverso, emenda)  →  masters 4K IA (12 fps)
   →  36 fps interpolado (2560 + 1080×1920)  →  escada H.264 GOP 6 (960…2560 / 540…m1080) + pôsteres
   →  site: Mediabunny + WebCodecs → ImageBitmap → canvas  |  reserva <video>  |  pôster
```

## 1. Conceito e mapa
- **Um plano-sequência** pelo "set" da marca, em 6 a 10 clipes de 6 a 8 s (F1…Fn). Cada clipe vai do quadro-chave K_i ao K_{i+1}.
- **O mapa vem do HTML:** `<section data-clipe="F3">` marca onde o F3 começa (no meio da tela). Os trechos são contíguos: o F3 vai até o começo do F4, e o último clipe até o fim da rolagem.
- **Movimento reversível:** dolly, órbita, grua, foco que respira, tecido "debaixo d'água", névoa quase parada.
- **Proibido:** o que cai, escorre, sobe como fumaça, pisca, gente andando, texto se escrevendo, texto inventado em telas.
- **Parado não fica morto:** com a página parada, o quadro não avança, mas o CSS mantém grão (salto a cada ~0,08 s), trepidação de projetor (0,3 a 0,6 px, `steps(1)` 0,9 s) e uma luz que respira.
- **Px de rolagem por quadro:** altura rolável ÷ quadros totais. Acima de ~20 px por quadro, a imagem "anda por frame". No caso Thesis, a 12 fps, eram ~54 px por quadro no celular.

## 2. Quadros-chave e clipes (geração)
- **Quadros-chave:** Nano Banana Pro (Gemini) ou ChatGPT, image-to-image a partir das imagens reais da marca e do painel aprovado. Em 16:9 1920×1080 e, se precisar, 9:16 1080×1920. Faça 4 a 6 versões, e o dono escolhe. Nenhum texto na imagem, porque o texto é HTML por cima.
- **Clipes:** Google Flow em **Frames to Video com 1º e último quadro**. O último quadro de F_i é **o mesmo arquivo** do primeiro de F_{i+1}.
  - Modelos em 15/11/2026: Veo 3.1 Lite, Fast e Quality, de 4/6/8 s, em 16:9 e 9:16, a 24 fps, com 1080p só em 8 s.
  - Veo 3.1 Fast e Quality saem em 05/12/2026. Depois, use Omni Flash 1.2 (3 a 15 s, quadros inicial e final, upscale até 1080p).
  - Faça rascunhos baratos (Omni Flash a 360p, metade dos créditos) e o final só do aprovado.
  - Gere **um por vez**, com orçamento de créditos aprovado antes.
- **Bloco de estilo:** um parágrafo em inglês, igual no fim de **todo** prompt, para a luz casar nas emendas. O do caso Thesis está em `<projeto-referencia>/plano-v2.md` §3.3. Ele termina com "All motion slow, smooth and continuous; nothing falls, pours, rises or flickers… No people, no hands, no text, no logos".
- **QA por clipe**, antes de pedir o próximo: `scripts/checa-clipe.sh flow/F2.mp4 flow/F3.mp4`.
  - Assista ao reverso: tem de parecer natural.
  - Olhe a folha de contato: nada de texto, gente ou objeto que cai.
  - Confira o SSIM da emenda: ≥ 0,92.
  - Use só o trecho limpo (o gerador costuma desandar na 2ª metade). Anote INÍCIO e FIM em `fontes.txt`.
  - Registre em `proveniencia.json`: ferramenta, conta, prompt e saída.
- **Recorte do celular:** se não gerar em 9:16, recorte do 16:9 em `RECORTE_X` (0 a 1), onde está o assunto. Isso fica em `fontes.txt`.

## 3. Masters 4K por IA (local, sem créditos)
- **Ferramenta:** `<agency-tools>/bin/upscale-4k`. É um wrapper de `upscale-4k/upscale.py` com venv Python 3.13, `torch 2.15.0+cpu`, `spandrel 0.4.2`, `opencv-python-headless` e `numpy`.
  - O ffmpeg decodifica em pipe, o modelo trabalha quadro a quadro em ladrilhos de 384 px (padding 16), o lanczos leva até 3840×2160 e o ffmpeg codifica.
  - `--temporal 0.5` mistura com o quadro anterior onde quase nada mudou (anti-tremido).
- **Modelos** em `upscale-4k/modelos/`, com `SHA256SUMS`: `realesr-general-x4v3.pth` (o escolhido), `realesr-general-wdn-x4v3`, `RealESRGAN_x4plus`, `x2plus` e `2xNomosUni_span_multijpg_ldl`.
- **Lote:** `PROJETO=. FONTES=fontes.txt OUT=flow/4k scripts/upscale-clipes.sh`
  - Começa pelos menores (os 720p, que mais ganham).
  - É idempotente: grava `.parcial.mp4` e pula o que já existe.
  - O log fica em `flow/4k/upscale.log`, e o tempo por quadro em `.quadros`.
  - Rode com `nohup … &` e leia o log no fim. Não acompanhe com um agente.
- **Tempo medido** (8 vCPU Xeon AVX-512, sem GPU, box dividido):
  - 720p para 4K: 5 a 14 s por quadro;
  - 1080p para 4K: 14 a 30 s por quadro, e até 197 s com o box carregado;
  - 8 clipes de ~95 quadros: ~7 h 40 de uma noite.
- **Com GPU:** troque por SeedVR2 ou FlashVSR (difusão, temporal, muito melhores). Video2X só com Vulkan; o lavapipe por software é mais lento que o PyTorch na CPU. A tabela completa está em `FERRAMENTAS-E-BIBLIOTECAS.md`.
- **Instalar em outra máquina:**
  ```bash
  python3 -m venv venv && . venv/bin/activate
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
  pip install spandrel opencv-python-headless numpy pillow
  # modelos: releases do github.com/xinntao/Real-ESRGAN (realesr-general-x4v3.pth) — confira o sha256
  cp <agency-tools>/upscale-4k/upscale.py .   # ou copie pelo pacote portátil
  ```

## 4. Interpolação para 36 fps (fluidez)
- **Comando:** `scripts/interpola.sh`, que roda `minterpolate=fps=36:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`.
- **Fator:** 3×. Os quadros originais ficam, e entram 2 novos entre cada par.
- **Saídas:**
  - `ID-36.mp4` em 2560×1440;
  - `ID-m36.mp4` em 1080×1920 (recorte 9:16 do 4K);
  - ambos quase sem perda: CRF 12, todo quadro chave.
- **Memória:** em 3840, 8 processos passaram de 15 GB. Use `LARG=2560` e `JOBS=4` em 16 GB. Isso levou ~17 min para 16 arquivos.
- **Artefatos:** confira movimentos rápidos, onde as bordas podem "derreter". Se acontecer, use `mi_mode=blend` nesse clipe ou o RIFE (precisa de GPU ou Vulkan).

## 5. Escada de qualidade (encode do site)
`scripts/encode-degraus.sh --site` gera, para cada clipe, os arquivos `ID-960/1280/1920/2560.mp4` (16:9) e `ID-540/m720/m1080.mp4` (9:16), os pôsteres `ID-DEGRAU-ini|fim.avif|jpg` e o `manifesto.json` (fps, gop, bytes por degrau).

| Parâmetro | Valor | Por quê |
|---|---|---|
| codec | H.264 `yuv420p`, `-preset slow -tune film`, `faststart`, sem áudio | decodificador de hardware em todo aparelho |
| fps | 36 (interpolado) | ~11 trocas de imagem/s no celular lendo |
| GOP | `-g 6 -keyint_min 6 -sc_threshold 0` | voltar custa no máximo 5 decodificações extras |
| quadros B | `-bf 0` | a ordem de decodificação é a de exibição (o `filme.ts` conta com isso) |
| CRF | 22 desktop, 23 celular; 26 no 960 e 28 no 540 (degraus de economia) | |
| 12 fps all-intra | `FPS=12 GOP=1` | só se não houver interpolação (versão antiga) |

O script **confere** o padrão `IPPPPPIPPPPP…` de cada arquivo com ffprobe e para se ele não bater.

**Pesos medidos (8 clipes):**

| Degrau | 12 fps all-intra (v2.2) | 36 fps GOP 6 (v2.3) |
|---|---|---|
| 960 | 15 MB | 12,5 MB |
| 1280 | 36 | 29,8 |
| 1920 | 67 | 55,2 |
| 2560 | 101 | 87,5 |
| 3840 | 153 | — (removido) |
| 540 | 11 | 9,1 |
| m720 | 28 | 23,4 |
| m1080 | 49 | 43,3 |

## 6. No navegador: `scripts/filme-rolagem.ts`
- **HTML:**
  ```html
  <div class="filme" data-filme data-base="/filme/" data-clipes="F1 F2 F3 F4" data-fps="36"><canvas></canvas></div>
  ```
  O canvas fica `position: fixed; inset: 0`, atrás da "folha". Cada seção leva `data-clipe="Fi"`.
- **Dependências:** `npm i mediabunny lenis`, mais `scripts/rolagem.ts`, que faz um laço rAF único que dorme quando nada muda e usa Lenis com lerp 0,05.
- **Escolha do degrau:**
  - pixels físicos = `max(largura × DPR, altura × DPR × proporção)`;
  - escolhe o menor degrau ≥ 85% disso;
  - o celular tem teto m720;
  - `navigator.connection.saveData` leva ao menor degrau;
  - em 2G/3G, um degrau abaixo;
  - `?q=NOME` força um degrau.
- **Canvas na resolução da fonte**, com o CSS esticando: `k = min(DPR, 3, 1/escala)`. A barra do celular mexendo menos de 160 px na altura não refaz o canvas.
- **Download:**
  - cada MP4 baixa uma vez (`fetch` → `Blob`) e fica em memória;
  - o clipe seguinte começa a baixar com 15% do atual, e o anterior abaixo de 35%;
  - só o clipe ativo e os vizinhos mantêm decodificador; os outros soltam a memória;
  - nada de vídeo antes do `load` (`requestIdleCallback`, e no máximo 2,5 s).
- **Via WebCodecs (principal):**
  1. O Mediabunny (`Input`, `MP4`, `BlobSource`, `EncodedPacketSink`) extrai os pacotes, e `chave[i]` guarda o quadro-chave de que o quadro i depende.
  2. `VideoDecoder` com `optimizeForLatency: true` e sem flush a cada quadro.
     - Rolando para a frente, **continua a cadeia**: uma decodificação por quadro.
     - Rolando para trás ou num salto, recomeça no chave.
     - Pede o quadro atual, os vizinhos e até 6 (celular) ou 9 (desktop) à frente no sentido da rolagem. Não empilha mais de 14 pendentes.
  3. A saída vira `createImageBitmap(frame)`, e o **`frame.close()` é imediato**.
  4. O cache de bitmaps é limitado por memória: 100 MB no celular, 170 MB no desktop, e no mínimo 12 quadros (2 GOPs). Sai primeiro o que está mais longe.
  5. Mistura os dois quadros vizinhos pela fração do índice (`globalAlpha`) quando a rolagem é lenta.
  6. Faz flush só se o decodificador segurar quadros por mais de 250 ms sem saída.
  7. **Vigia:** se um pedido fica 1,5 s sem resposta, ou há erro, `travou = true`, e a página cai para `<video>` em todos os clipes.
- **Reserva `<video>`:**
  - `muted playsinline`, no DOM fora da tela (o iOS só pinta no canvas um vídeo que está no documento);
  - `play()` + `pause()` logo de início (o iOS só decodifica depois de um play);
  - `currentTime` pela rolagem, com **fila de seek**: nunca dois seeks em voo, e no `seeked` só busca de novo se o alvo mudou.
- **Último recurso:** o pôster (`ini` ou `fim` conforme a metade do clipe), em AVIF com JPG de reserva.
- **Reduzir movimento:** **não** desliga o filme, porque ele só anda com o gesto da pessoa. Ver `vivo.ts` para o resto da página.
- **Diagnóstico no aparelho:** `?diag=1` mostra via, clipe, quadro, falhas, degrau, canvas, reduzir movimento, economia de dados, MB baixados e quedas. Também há `?via=video` e `?filme=poster`.
- **Telemetria para testes:** `window.__filme` (via, degrau, mostra, quadro, bytes, quedas) e `window.__filmeClipes()`.

## 7. Testes (antes de mostrar e depois de publicar)
- **Fluidez:** `node scripts/medir-fluidez.mjs ROTULO URL DIR celular|desktop`.
  - Usa Playwright com o Chrome do sistema.
  - Celular = Pixel 7, `reducedMotion: reduce`, rede de 9 Mb/s com 60 ms, CPU 4× (CDP `Emulation.setCPUThrottlingRate`) e gestos de toque reais (`Input.dispatchTouchEvent`), em ritmo de leitura, com uma volta no meio.
  - Grava vídeo (`.webm`) e as métricas: `trocasPorSeg`, `paradoMaxMs`, `posterPct`, `atrasoPct`, `telaFps` e MB.
- **Metas no celular emulado:**
  - trocas ≥ 10/s;
  - parada máx ≤ 300 ms;
  - pôster ≤ 1%;
  - atraso ≤ 15%;
  - 0 erro e 0 queda.
  - Resultado da v2.3: 10,7/s, 300 ms, 0,1%, 10,7%, 0 erro, 0 queda.
- **Contagem de quadros distintos** na URL pública, nos primeiros 1700 px. No ar deu 211 no desktop e 213 no celular.
- **Rede:** MP4 com `200 video/mp4`, `Range` → 206, e o `ftyp` no início (faststart).
- **Spike de desempenho** (quadro p95, long tasks): `<projeto-referencia>/v2/spike/medir.mjs`. Metas: p95 ≤ 16,7 ms no desktop e ≤ 33 ms no celular com CPU 4×, nenhuma long task acima de 50 ms.
- **Vídeo para o dono:** lado a lado do antes e depois (ex.: `screens/v2/fluidez/lado-a-lado-celular.mp4`), entregue por link do Google Drive.
- **Limites:** Chrome headless sem GPU é pior que um aparelho real no desenho. Safari/iPhone precisa de teste no aparelho.

## 8. Orçamento de referência
| | Desktop | Celular |
|---|---|---|
| antes do LCP | ≤ 150 KB (pôster) | ≤ 150 KB |
| começo da página | ~10 MB | ~9 MB (medido) |
| rolagem completa | informar ao dono (55 MB no 1920) | informar (23 MB no m720) |
| quadro p95 na rolagem | ≤ 16,7 ms | ≤ 33 ms |
| memória de bitmaps | ≤ 170 MB | ≤ 100 MB |
| CLS | 0 | 0 |
