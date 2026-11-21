# Erros e lições: Estudo de Referência v1 → v2.3 (11 a 16/11/2026, America/Sao_Paulo)

Os erros estão em ordem cronológica. Cada um traz o que aconteceu, a causa, como foi visto, a correção, a regra que fica e os números medidos. As fontes são `<projeto-referencia>/REVISOES.md`, `ESTADO.md`, `plano-v2.md`, `v2/spike/RELATORIO.md`, o `git log` da branch `v2` em `<projeto-referencia>/site/` e `screens/v2/fluidez/*.json`. As frases entre aspas são do dono.

## Linha do tempo
| Versão | Data/hora (BRT) | Commit / release | O que foi |
|---|---|---|---|
| v1 | 11/11 11:33 | `8192e1e` / `202611111133` | site Astro responsivo (arena de 3 candidatos); Lighthouse celular 95–96, desktop 100 |
| v2-plano | 15/11 14:30 | `plano-v2.md` | diagnóstico: referências não seguidas |
| v2-spike | 15/11 15:05 | `v2/spike/` | prova do filme arrastado sem crédito |
| v2-painel | 15/11 17:26 | `painel/painel-v1.jpg` | direção de arte aprovada |
| v2 build 1–3 | 15/11 18:40–19:48 | `8617f4d`, `4346cbf` | filme F1–F8, vidro, Sopro 3D, halftone; "Perfeito amei" |
| v2 no ar | 15/11 20:36 | `202611152035` | "Pode publicar" (20:31) |
| v2.1 no ar | 15/11 21:55 | `194ebf0` / `202611152155` | correção do Android: sem reel, filme contínuo, reduzir movimento, celular |
| v2.2 no ar | 16/11 08:08 | `52bac5d` / `202611160806` | filme a partir de masters 4K por IA; áreas marcadas em movimento |
| v2.3 no ar | 16/11 09:10 | `311a4b0` / `202611160909` | filme a 36 fps, GOP 6, celular m720 |

---

### E1. A v1 usou foto parada e recortes PNG em paralaxe (2.5D) no lugar do filme
- **O que aconteceu:** o prompt-base escolhido (Lusco, do Profitize) pede um filme preso atrás da página inteira, visto por furos. A v1 pôs uma imagem parada da mesa com paralaxe e PNGs recortados por cima.
- **Como foi visto:** o dono, em 15/11: "a tecnologia e a ideia são boas, acertou no timing, mas falta melhorar umas cem vezes". Também disse que as referências dele não foram seguidas.
- **Causa:** a implementação saiu de memória e não do texto do prompt. Ninguém comparou a spec com o repo.
- **Correção:** `plano-v2.md` §1, uma tabela "spec do prompt × repo × lacuna" para cada um dos 14 prompts. A conclusão foi que a lacuna crítica era um filme que tinha virado foto.
- **Regra:** antes de mostrar, compare cada prompt ou referência com o código, item por item. O 2.5D fica proibido ("No 2.5D, ever", skill video2html).

### E2. Componente da referência usado pela metade (Sopro em 10%)
- **O que aconteceu:** a tinta do Sopro só aparecia com `?hero=tinta`, e sem as letras infladas em 3D, que são o ponto do componente.
- **Correção:** Blender 4.5 local + `infla-thesis.py` gerou o "Thesis°" inflado em bordô (89 KB, carregado só no 1º gesto). Commit `4346cbf`.
- **Regra:** componente escondido atrás de flag ou sem a peça principal conta como não usado.

### E3. Canvas na resolução da tela (spike)
- **O que aconteceu:** no celular com DPR 3, o canvas tinha 780×1688 px.
- **Medida antes:** a via WebCodecs reprovou, com p50 33 ms, p95 50 ms, 76% dos quadros acima de 25 ms, decodificação p95 743 ms e 112 quadros atrasados.
- **Correção:** canvas na **resolução da fonte**, com o CSS esticando: 444×960 px.
- **Medida depois:** p95 16,7 ms, 0 de 858 quadros atrasados, 0 long task. Também passou no desktop (p95 16,8 ms).
- **Regra:** a resolução do canvas é a regra de desempenho mais importante.

### E4. Furo de Preços coberto e diálogo no fluxo da página (build 1)
- **Como foi visto:** pelas capturas automáticas (`screens/v2/build/`).
- **Causa:** o fundo `.pricing` tapava o furo, e um `<dialog>` aparecia no fluxo da página.
- **Correção:** furo transparente e `dialog:not([open]) { display: none }`.
- **Regra:** capture a página inteira em 1440 e 390 depois de cada rodada, antes de olhar o código.

### E5. Dois clipes baixando juntos no topo (build 1)
- **Causa:** o F2 baixava junto com o F1.
- **Correção:** cada MP4 baixa uma vez por clipe, e o seguinte só depois de rolar 15% do atual.
- **Medida:** o 1º carregamento ficou em 2,2 MB no desktop e 1,8 MB no celular.

### E6. "R$" sem número em Preços (build 3)
- **Como foi visto:** pelo dono, às 18:56 de 15/11.
- **Causa:** a classe `.reel` do diálogo do reel colidia com a coluna de dígitos do componente Âncora.
- **Correção:** a classe foi renomeada para `.rolo`. O preço foi testado com JS, sem JS e com movimento reduzido.
- **Regra:** dê prefixo às classes de cada componente e teste valores com JS, sem JS e com movimento reduzido.

### E7. Botão "▶ reel" que ninguém combinou (publicado em 15/11 20:36)
- **Como foi visto:** pelo dono, no Android, por volta de 20:58: o botão de reel "nunca foi combinado".
- **Causa:** o reel vinha da spec do Lusco, e o plano o tratou como lacuna a preencher. Ele foi aprovado junto com o resto ("Perfeito amei") sem estar listado.
- **Correção:** v2.1 tirou o reel da nav, o diálogo, o script e o CSS.
- **Regra:** o que um prompt de referência tem não é pedido do cliente. Liste todo elemento visível novo e peça aprovação item por item.

### E8. Filme parado entre seções
- **Causa:** cada seção tinha o seu trecho de rolagem, e entre elas o filme não andava.
- **Como foi visto:** o dono esperava o filme indo e voltando "na página toda", como na gravação aprovada, e ele parava.
- **Correção:** `filme.ts` com trechos **contíguos**. Cada clipe vai do começo da sua seção até o começo da seguinte, e o último vai até o fim da rolagem.
- **Medida:** no Pixel 7, com gesto de toque real, F1 chegou a F8 andando e voltando (F5 q51 → q33 → q83).

### E9. "Reduzir movimento" desligava tudo e deixava o celular estático
- **Como foi visto:** o dono, no Android: "site estático no celular", "falta animações".
- **Causa:** o plano dizia "movimento reduzido = pôsteres parados, sem arraste de filme". No Android, **a economia de bateria liga `prefers-reduced-motion`**, então o filme e as entradas sumiam para ele.
- **Correção (v2.1/v2.2):**
  - o filme continua, porque só anda quando a pessoa rola e não há movimento sozinho;
  - as entradas viram esmaecimento;
  - os loops ficam mais lentos (`--calmo`, deriva da esteira de 26 para 14 px/s, carrossel de 3,2 para 4,8 s);
  - os deslocamentos encolhem (`--vivo-desloc`).
- **Medida:** com `reducedMotion: reduce`, o filme passou de só pôster para quadros mudando via WebCodecs (no ar: F1 q0 → F2 q35 → F6 q78).
- **Regra:** "reduzir movimento" significa mais calmo, nunca parado. Teste sempre com ele ligado.

### E10. WebCodecs congelava sem erro no Android
- **Causa:** a página segurava `VideoFrame`s abertos no cache, e o pool do decodificador de hardware (MediaCodec) esgotava. Ele parava de devolver quadros e não avisava.
- **Correção:**
  - cada `VideoFrame` vira `ImageBitmap` e é **fechado na hora**;
  - um vigia de 1,5 s sem saída (ou um erro) cai para `<video>` com `currentTime` pela rolagem;
  - o `<video>` fica no DOM e recebe play/pause, que é o que o iOS exige;
  - pôster só como último recurso;
  - `?diag=1` mostra a via, o degrau, as falhas e as quedas no próprio aparelho.
- **Regra:** WebCodecs sempre tem vigia e reserva, e o diagnóstico precisa poder ser visto no aparelho do cliente.

### E11. Roda dos cases embaralhada no dedo
- **Como foi visto:** o dono, no Android: a roda dos cases ficava "bagunçada" no dedo.
- **Causa:** a Works Wheel, pensada para o mouse, sobrepunha os títulos à lista no toque.
- **Correção:** abaixo de 760 px entra um **carrossel de toque**, com rolagem nativa e snap. As capas se inclinam pela distância do centro e o carrossel avança sozinho a cada 3,2 s até a pessoa mexer.
- **Regra:** todo componente de mouse ganha uma versão própria para o dedo, testada com toque real por CDP.

### E12. Erros de espaçamento no celular
- **Como foi visto:** o dono: "Tem muito erro de espaçamento, falta animações e muito mais".
- **Correção:** `src/styles/sections/celular.css` (60 linhas):
  - ritmo vertical único (`--ritmo: 64px`, cabeça 28 px);
  - nav compacta, com botões de 40 px e vidro ao rolar;
  - manchete começando abaixo da nav (`padding-top: 92px`);
  - cabeças acima da "sombra de papel" do furo seguinte (z-index);
  - esteira menor, com borda dissolvida por máscara;
  - parede de depoimentos menor e selos 2×2.
- **Regra:** faça um arquivo único de ajustes do celular, revisado em 390 e 360 px com capturas por seção (`v2-celular-secoes.mjs`).

### E13. "Acho que ainda não propagou, tá mostrando o abridor ainda"
- **Causa:** o que estava no ar ainda era a release das 20:36. A correção existia só local até a ordem "Pode publicar a corrigida" (21:51), e foi publicada às 21:55.
- **Regra:** diga sempre o que está local e o que está no ar, com o commit e a release. Depois de publicar, confirme `Cache-Control: public, max-age=0, must-revalidate` no HTML e mostre a captura da URL pública.

### E14. Áreas que o dono marcou como paradas
- **Áreas:** a esteira de cases entre as faixas de filme; a parede "Quem confia, volta."; o cartão do blog vazio ("O primeiro artigo está sendo preparado"); e os cartões de preço (Landing Page R$ 625, Manutenção R$ 188).
- **Como foi visto:** prints do Android marcados pelo dono: "gostaria que houvesse modificação, ficasse em movimento… melhorou muito, tá quase do jeito que eu queria".
- **Causa:** essas áreas paravam com reduzir movimento ou não tinham movimento nenhum.
- **Correção:** `vivo.ts` + `vivo.css`:
  - `[data-vivo]` recebe `--pp` de −1 a 1 pela rolagem (paralaxe suavizado) e `.is-vivo` ao entrar;
  - `[data-inclina]` inclina a parede 3D para o cursor (só com mouse);
  - a esteira deriva sempre;
  - os preços contam até o valor e os cartões ganham brilho;
  - o blog vazio ganha um esboço de cartão animado com cursor piscando.
- **Prova:** capturas de antes e depois em `screens/v2/movimento/` e `screens/v2/4k-movimento/`.
- **Regra:** antes de mostrar, grave cada seção no celular com reduzir movimento. Se nada se mexe nela, ainda não está pronta.

### E15. "O vídeo rolando caiu muito a qualidade. Ele devia tá em 4K"
- **Causa:** o filme era um encode all-intra de 960×540 (CRF 26), esticado em telas 1080p e Retina.
- **Pedido do dono:** um processo **local e reutilizável** que levasse o 720p ao 4K, "assim não dependemos de créditos e nada", e que não "consumisse" o bot.
- **Correção (v2.2):**
  - pesquisa de upscalers (`<agency-tools>/upscale-4k/LEIA-ME.md`);
  - escolha do Real-ESRGAN `realesr-general-x4v3` via spandrel/PyTorch na CPU, com ladrilhos de 384 px, padding de 16 e `--temporal 0.5`, gerando masters CRF 14;
  - escada desktop 960/1280/1920/2560/3840 e celular 540/m720/m1080, escolhida por largura × DPR;
  - 4K só com decodificador de hardware.
- **Medida (12 fps all-intra, os 8 clipes por degrau):** 960 = 15 MB, 1280 = 36, 1920 = 67, 2560 = 101, 3840 = 153; celular 540 = 11, m720 = 28, m1080 = 49. Uma rolagem completa passou de 15 para 67 MB no desktop e de 11 para 49 MB no celular. O Dono aprovou mesmo assim ("Pode publicar assim").
- **Tremido medido:** a IA acrescenta cerca de 3% de tremido relativo para cerca de 8% a mais de nitidez em 640 px. Não se nota no scrub.
- **Limite dito ao dono:** a IA reconstrói o 720p e deixa áreas lisas "lisinhas". Não é 4K nativo.
- **Regra:** nunca encode o filme abaixo da tela que vai mostrá-lo. Faça a escada por DPR e diga ao dono o peso e a alternativa.

### E16. Upscale de uma noite inteira, com um clipe de 5 h
- **Medida:**
  - 720p para 4K: de 5,2 a 14,1 s por quadro;
  - 1080p para 4K: de 13,8 a 30,1 s por quadro;
  - o F8 levou 197 s por quadro, ou 18.518 s (5 h 08), porque o box estava dividido com outros agentes.
  - Tempo total: de 22:36 de 15/11 a 06:18 de 16/11 (BRT), cerca de 7 h 40, com 0 crédito.
- **Incidente:** a 1ª tentativa rodou com `nice` sob carga 35 e foi reiniciada sem `nice`.
- **Regra:**
  - script idempotente (`.parcial.mp4`, pula o que já existe);
  - os menores primeiro;
  - log por clipe;
  - `nohup`;
  - o agente não acompanha (o dono: "Nao ha problema durar horas, a problema se consumir você").
  - Se houver GPU, troque por SeedVR2 ou FlashVSR.

### E17. "Não consigo ver o vídeo rodando… parece que é por frame"
- **Como foi visto:** o dono, às 08:13 de 16/11, no celular real, nos modos celular e desktop.
- **Causa:** 12 fps espalhados por milhares de px de rolagem. No celular, cada quadro cobria uns 54 px de página, então a imagem só trocava ~3 vezes por segundo lendo em ritmo normal.
- **Medida antes:** `screens/v2/fluidez/antes-celular.json`, em Pixel 7, 4G a 9 Mb/s, CPU 4×, reduzir movimento e degrau m1080.
- **Correção (v2.3):**
  - `interpola.sh` (ffmpeg minterpolate, MCI + AOBMC bidirecional) leva 12 a 36 fps, em ~17 min para 16 arquivos;
  - H.264 com chave a cada 6 quadros e sem B;
  - `filme.ts` decodifica a cadeia a partir do chave (`optimizeForLatency`, sem flush a cada quadro, cache de pelo menos 2 GOPs);
  - celular com teto m720, porque o m1080 a 36 fps trocava 9 quadros/s com 20% do tempo atrasado;
  - desktop até 2560, porque o 3840 interpolado estourou a memória (8 processos, mais de 15 GB).
- **Medida depois** (`depois-celular.json`, mesmas condições):

  | Métrica | Antes (12 fps all-intra m1080) | Depois (36 fps GOP 6 m720) |
  |---|---|---|
  | trocas de imagem por segundo | 3,3 | 10,7 (11,2 no teste forçado m720) |
  | maior parada com a página andando | 2516 ms | 300 ms |
  | tempo em pôster | 2,3% | 0,1% |
  | tempo atrasado ≥ 2 quadros | 0% | 10,7% (troca aceita) |
  | atraso médio | 40 ms | 32 ms |
  | download no teste | 38,2 MB | 18,1 MB |
  | fps de tela | 20,2 | 26,5 |

  No desktop 1920, depois: 7,7 trocas/s, 0% atrasado, 41,9 MB.
- **Pesos finais, 8 clipes a 36 fps GOP 6:** 960 = 12,5 MB, 1280 = 29,8, 1920 = 55,2, 2560 = 87,5; celular 540 = 9,1, m720 = 23,4, m1080 = 43,3. É mais leve que o all-intra a 12 fps, com 3× mais quadros.
- **No ar (09:10):** 211 e 213 quadros distintos nos primeiros 1700 px (desktop e celular), 0 erro e 0 queda. O começo da página no celular baixa 9 MB.
- **Regra:** calcule os px de rolagem por quadro (altura da página ÷ quadros totais). Com mais de ~20 px por quadro, interpole. Meça "trocas por segundo" e "maior parada", não só o fps da tela.

### E18. Aprovação que não chega ao executor
- **O que aconteceu:** o subagente que publica precisou da citação da mensagem do dono (id e frase) para executar o deploy. Aprovações repassadas pelo bot principal valem só com as palavras do dono.
- **Regra:**
  - guarde a frase, a hora e o id da aprovação em `ESTADO.md`;
  - passe-os junto com a tarefa de deploy;
  - `deploy-release.sh` exige `APROVACAO=`;
  - aprovação de revisor ou de outro bot não é aprovação do dono.

### E19. Referências pagas ou bloqueadas
- **Profitize:** copiar um prompt gasta cota semanal da conta do dono (na época, 26 de 30). O kit do Jarvis tem só o estudo público, não os prompts. Para usar um componente novo, peça a cópia ao dono ou ao agente com a conta.
- **Câmera 3D (fal.ai):** ficou pendente de conta, crédito e chave no cofre. O site seguiu com o pôster K2 (`data-camera-3d="pendente"`).
- **Depoimentos:** a parede repetia 4 cartões. Não se inventa depoimento: pergunte ao dono ou diminua a parede.
- **Flow:** o Veo 3.1 Fast e o Quality saem do ar em 05/12/2026 (help do Google, 15/11). Depois disso, use Omni Flash 1.2 ou Veo 3.1 Lite. Restavam 325 créditos depois do projeto.
- **Regra:** não pare esperando um asset pago. Use uma reserva com marcação no HTML e liste a pendência em `ESTADO.md`.

### E20. Limites que continuam abertos (não verificados)
- iPhone/Safari real não foi medido. O WebCodecs de vídeo existe no Safari 16.4+, e a reserva `<video>` está pronta para o iOS.
- Lighthouse da v2 no ar não foi rodado. O da v1 era 95–96 no celular e 100 no desktop.
- O orçamento de p95 abaixo de 16,7 ms só foi cumprido no spike de um clipe. A home inteira, em headless sem GPU, deu p95 de 33 a 50 ms.
- O blog no ar devolve `[]`, e os cartões Progressive Blur só aparecem com posts.
