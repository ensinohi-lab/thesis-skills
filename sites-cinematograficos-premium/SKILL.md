---
name: "Sites cinematográficos premium"
description: "Use ao criar ou refazer um site premium com filme que anda com a rolagem (scroll-scrubbed), componentes vivos e entrega aprovada por portões, para qualquer nicho; método tirado do Estudo de Referência v2 (studiothesis.com.br, nov/2026)."
---

# Sites cinematográficos premium

Esta receita monta um site em que um filme gerado por IA fica preso atrás da página e anda para a frente e para trás junto com a rolagem. Por cima dele entram componentes modernos e vivos (vidro, botões com ímã, títulos por linha, esteiras, contadores, carrossel de toque) e um celular que não fica parado. Ela saiu do Estudo de Referência v2, feito de 11 a 16/11/2026 em 4 versões publicadas e 7 correções. Cada regra abaixo custou uma rodada, e a prova de cada uma está em `ERROS-E-LICOES.md`.

Funciona fora do Grok Bot. Só usa Markdown, bash, Node, ffmpeg e Python. Ferramentas exclusivas de um agente (Arena, cartões de aprovação) aparecem como opcionais.

**Pasta do método:** `sites-cinematograficos-premium/`
**Caso real:** `<projeto-referencia>/` (repo em `site/`, filme em `v2/`, provas em `screens/v2/`)

---

## Regras fixas (valem em todas as fases)
1. **Só o dono aprova.** Aprovação é sempre do dono do projeto. Aprovação vale com as palavras dele: data, hora e frase, registradas em `ESTADO.md`. Aprovação de revisor, de outro bot ou de IA não conta.
2. **Sem deploy sem ordem explícita.** Quem executa o deploy carrega a frase e o id da mensagem de aprovação, porque um subagente sem essa citação é bloqueado, e com razão.
3. **Créditos pagos (Flow/Veo, fal.ai, ElevenLabs) só com aprovação antes**, com o orçamento dito em números.
4. **Arte final só em geradores aprovados:** Flow/Veo (vídeo), Gemini/Nano Banana Pro ou ChatGPT (imagem). Código só compõe. Nada de gerador de imagem do próprio agente.
5. **Nenhuma senha ou chave em arquivo ou mensagem.** Cite só onde ela fica (ex.: "chave SSH em `~/.ssh/`").
6. **Preserve o que existe:** conteúdo, preços, WhatsApp, formulário, blog, `/admin`, SEO, rotas. Explique o que encontrou antes de alterar.
7. **Uma rodada = UMA camada e UMA mudança**, com uma linha em `REVISOES.md`. Camadas: texto | composição | cor | tipografia | movimento | formato.
8. **Diga sempre o que está local e o que está no ar**, com o commit e o id da release.
9. **Entregue vídeos e prévias por link do Google Drive do dono**, não por link público no servidor.

---

## Fases (cada ★ é um portão de aprovação do dono)

### F0. Arrumação (30 min)
- **Tarefas:**
  - Criar a pasta do projeto com `BRIEF.md`, `ESTADO.md` e `REVISOES.md`. Os modelos estão em `/workspace/agency-tools/modelos/`.
  - Opcional: `<agency-tools>/bin/pipeline novo PASTA --formato estatico`.
  - Ler `AGENTS.md`, o `SISTEMA-MARCA.md` da marca e o `palacio-mental/indice.json`, para não pesquisar de novo.
- **Ferramentas:** git (branch nova por versão, `v2`, sem mexer na `main` publicada).
- **Checagem:** `pipeline status PASTA`; os três arquivos existem.

### F1. Inventário e briefing ★
- **Tarefas:**
  - Inventariar o site atual: rotas, formulários, APIs, SEO, JSON-LD, preços e textos. Modelo em `<projeto-referencia>/inventario-site-atual.md`.
  - Escrever o BRIEF com:
    - container: stack, domínio, alvos 1440/390 px;
    - história: objetivo, público, CTA;
    - estilo: âncoras, paleta, tipos, movimentos permitidos e proibidos;
    - geração: quem gera o quê e com que conta;
    - os portões.
  - Pôr na lista do que **não muda** tudo o que o dono já aprovou.
- **Checagem:** o BRIEF foi aprovado pelo dono, com a frase registrada.

### F2. Referências e direção de arte ★
- **Tarefas:**
  - Partir das referências **do dono**, não de bibliotecas garimpadas:
    - prompts do Profitize (profitize.com.br/build, conta do dono; cada cópia gasta cota semanal);
    - skills do GitHub que ele liberar;
    - fichas do Palácio Mental e de `<referencias-ferramentas>/`.
  - Para cada prompt escolhido, montar a tabela "spec do prompt × o que há no repo × lacuna". O caso Thesis está em `<projeto-referencia>/plano-v2.md` §1.
  - Montar um **painel de referências** com 12 itens, cada um com "o que se pega / o que não se pega", mais a paleta em hex. Exemplo: `<projeto-referencia>/painel/painel-v1.jpg` + `painel-v1.md`.
  - Escrever a `FICHA-DIRECAO.md`: a ideia em uma frase, o sistema aplicado e os quadros-chave.
- **Checagem:** o dono aprovou o painel ★. Sem painel aprovado não se gasta crédito de vídeo.

### F3. Conceito do filme, mapa e wireframes ★
- **Tarefas:**
  - O filme é **um plano-sequência** pelo "set" da marca, partido em 6 a 10 clipes (F1…Fn) entre quadros-chave (K0…Kn).
  - Cada seção do site marca onde o seu clipe começa (`data-clipe="F3"`). Os trechos são **contíguos**, então o filme anda na página inteira.
  - Usar só **movimento reversível**: dolly, órbita, grua, foco que respira, tecido ou fumaça quase parados. É proibido o que cai, escorre, sobe, pisca, gente andando ou texto se escrevendo, porque ao contrário fica falso.
  - Fazer wireframes 1440 e 390 (skill `draw-wireframe` em `<referencias>/rtskills/`), marcando onde aparece o filme (furos, tela cheia).
  - Listar **todo elemento visível novo** (botão, diálogo, seção) para o dono aprovar. Recurso que só vem do prompt de referência não é pedido do cliente (lição do botão "reel").
- **Checagem:** o dono aprovou os wireframes e a lista de elementos ★.

### F4. Spike técnico SEM crédito (meio dia)
- **Tarefas:**
  - Fazer um clipe de teste local com ffmpeg `zoompan` sobre uma imagem da marca.
  - Montar uma página isolada com as duas vias (WebCodecs e `<video>` com fila de seek) e medir antes de gastar crédito.
  - O canvas fica na **resolução da fonte**, nunca na da tela.
- **Checagem:** desktop e celular com CPU 4× têm quadro p95 ≤ 16,7 / 33 ms, 0 long task e 0 quadro atrasado na via principal. Modelo: `<projeto-referencia>/v2/spike/RELATORIO.md`.

### F5. Quadros-chave e clipes ★ (créditos)
- **Tarefas:**
  - Gerar os quadros-chave K0…Kn no Nano Banana Pro ou ChatGPT, image-to-image a partir das imagens da marca e do painel, em 4 a 6 versões. O dono escolhe ★.
  - Gerar os clipes no Flow:
    - em "Frames to Video" com 1º e último quadro (K_i → K_{i+1});
    - **um por vez**;
    - com o mesmo bloco de estilo colado no fim de todo prompt;
    - rascunho barato primeiro, final só do aprovado ★.
  - Fazer o QA de cada clipe antes do próximo: `scripts/checa-clipe.sh Fi.mp4 Fi+1.mp4`. Ele gera o reverso, a folha de contato e o SSIM da emenda (≥ 0,92).
  - Usar só o trecho limpo.
  - Registrar tudo em `proveniencia.json`, com a ferramenta e a conta.
- **Checagem:** o dono aprovou a sequência ("Aprovado gostei", 15/11 18:18, no caso Thesis).

### F6. Pipeline do filme (máquina local, sem créditos)
Detalhe completo em `FILME-NA-ROLAGEM.md`.
1. **Upscale IA para 4K à noite:** `scripts/upscale-clipes.sh`, com Real-ESRGAN general-x4v3 na CPU. Leva horas. Rode em `nohup` e não acompanhe com o agente.
2. **Interpolação para 36 fps:** `scripts/interpola.sh`, com ffmpeg minterpolate. Teto de 2560 px no desktop, por causa da memória.
3. **Escada de qualidade:** `scripts/encode-degraus.sh --site`, que gera desktop 960/1280/1920/2560 e celular 540/m720/m1080, com GOP 6, sem quadros B, pôsteres AVIF/JPG e `manifesto.json`.
- **Checagem:** o script confere o padrão I/P de cada arquivo, e os pesos ficam dentro do orçamento (tabela em `FILME-NA-ROLAGEM.md`).

### F7. Montagem do site por camadas
- **Camadas, nesta ordem, cada uma com print 1440/390 e no máximo 3 rodadas:**
  1. Fundo/filme (`scripts/filme-rolagem.ts` + `rolagem.ts`).
  2. Estrutura e tipografia.
  3. Componentes das referências (Profitize), fiéis ao prompt. Componente escondido atrás de flag não conta como usado.
  4. Movimento em **todas** as seções, inclusive no celular e com "reduzir movimento" (`scripts/vivo.ts`). Nada fica parado:
     - esteira com deriva;
     - parede que inclina;
     - contadores;
     - cartões com brilho;
     - estado vazio animado.
  5. A passada do celular, com o espaçamento acertado em 390 e 360 px. Faça um arquivo único de ajustes do celular (ex.: `celular.css`):
     - ritmo vertical único;
     - nav compacta;
     - alvos de toque de 44 px;
     - nada cortado;
     - carrossel de toque no lugar de rodas e arrastes de mouse.
- **Movimento:**
  - Lenis lerp 0,05.
  - Entradas de 0,9 a 1,1 s com `cubic-bezier(.16,1,.3,1)`.
  - Títulos por máscara com stagger de 0,07 s.
  - Animar só `transform`/`opacity`.
  - Vidro só em controles e navegação, com fallback opaco.
- **Checagem:** `npm run build` limpo e console sem erro.

### F8. Provas antes de mostrar ★
- **Tarefas:**
  - Medir a fluidez: `node scripts/medir-fluidez.mjs ROTULO URL DIR celular|desktop`. Ele simula Pixel 7, 4G a 9 Mb/s, CPU 4×, reduzir movimento ligado e gesto de toque real por CDP.
  - Gravar a rolagem (ida e volta) e as capturas de antes e depois de cada área corrigida.
  - Rodar o Lighthouse (alvo: celular ≥ 90, desktop ≥ 98, CLS 0).
  - Conferir as rotas que não podem mudar (200/404, API, sitemap, admin) e os MP4 com Range 206.
  - Mandar ao dono **o vídeo da rolagem + antes/depois + números + trocas (peso, nitidez)** e perguntar se publica ★.
- **Checagem:** metas mínimas no celular emulado:
  - trocas de imagem ≥ 10/s;
  - maior parada ≤ 300 ms;
  - pôster ≤ 1%;
  - 0 erro;
  - 0 queda de via.

### F9. Publicação ★ (só com ordem)
- **Tarefas:**
  - Build de produção (no caso Thesis, `BUILD_API_ORIGIN=https://www.DOMINIO`).
  - Rodar `scripts/deploy-release.sh`. Ele exige `APROVACAO="frase"`, faz ensaio por padrão e só publica com `--valer`. Ele manda o tar pelo ssh para `releases/AAAAMMDDHHMM`, confere a contagem e o sha256 e troca o symlink `current`. O servidor web não é tocado.
  - Verificar no ar: rotas, MP4, desktop e celular emulado contra a URL pública, e capturas em `screens/.../producao-*`.
  - Registrar em `REVISOES.md` e `ESTADO.md` a release, a frase do dono e o comando de rollback (`ln -sfn releases/ANTERIOR current`).

### F10. Pós-lançamento
- **Tarefas:**
  - Pedir ao dono para testar no **aparelho dele** (Android e iPhone), com `?diag=1` se algo parecer errado.
  - Medir o problema relatado com o mesmo script, antes e depois. Corrigir em UMA camada e voltar a F8.
  - Preencher os APRENDIZADOS do `PIPELINE.md` e propor ao Palácio Mental só o que é método. O que é estilo de uma marca não vira regra para outra.

---

## Não faça no início (aprendemos que dá errado)
- ❌ Começar pelo código com imagem parada e recortes PNG em paralaxe (2.5D). Parece barato assim que algo se mexe. Foi a v1 ("falta melhorar umas cem vezes").
- ❌ Trocar as referências do dono por bibliotecas "next-gen" achadas na web.
- ❌ Usar um componente pela metade ou atrás de uma flag (`?hero=tinta`). O Sopro ficou 10% usado.
- ❌ Copiar do prompt de referência um recurso que o cliente não pediu (o botão "▶ reel" do Lusco foi publicado e reprovado).
- ❌ Desligar o filme e as animações com `prefers-reduced-motion`. No Android, a economia de bateria liga esse sinal e o site do cliente fica estático.
- ❌ Segurar `VideoFrame` aberto no WebCodecs. O Android esgota o pool do MediaCodec e congela sem dar erro.
- ❌ Usar um trecho de rolagem por seção com o filme parado entre elas. Os trechos têm de ser contíguos.
- ❌ Encodar o filme a 960 px para "ser leve" e esticar numa tela 1080p/Retina, porque a qualidade "cai muito".
- ❌ Usar 12 fps espalhados por milhares de px de rolagem. Cada quadro cobria uns 54 px, a imagem trocava ~3×/s e "parece que é por frame".
- ❌ Interpolar em 3840 com 8 processos (estourou 15 GB) ou mandar 4K para celular (decodifica 2,25× mais pixels e atrasa).
- ❌ Usar canvas na resolução da tela (DPR 3). Reprovou no spike, com p95 de 50 ms e 743 ms para decodificar.
- ❌ Acompanhar um upscale de horas com o agente consultando o log. Isso gasta uso; deixe rodando e leia o log no fim.
- ❌ Inventar depoimentos ou números. Peça ao dono ou reduza o componente.
- ❌ Publicar sem dizer o que vai ao ar, ou chamar de "publicado" o que só está local.

## Faça assim (aprendemos que dá certo)
- ✅ Spike técnico local antes de gastar crédito, com escolha da via pelo número.
- ✅ Um clipe do Flow por vez, entre quadros-chave aprovados. QA com o reverso e a emenda antes do próximo.
- ✅ Masters 4K por IA local (Real-ESRGAN na CPU), rodados à noite. É idempotente e retoma onde parou.
- ✅ 36 fps por interpolação, quadro-chave a cada 6 e sem B, decodificando a cadeia a partir do chave. Ficou mais leve que 12 fps all-intra, e 3× mais fluido.
- ✅ Escada de qualidade escolhida por largura × DPR. Celular com teto m720, desktop até 2560, economia de dados no menor degrau, 3G um degrau abaixo.
- ✅ Vigia de 1,5 s que cai para `<video>` e depois para o pôster, mais `?diag=1` para diagnosticar no aparelho do cliente.
- ✅ "Reduzir movimento" = mais calmo, não parado: o filme só anda quando a pessoa rola, as entradas viram esmaecimento e os loops ficam 0,6× mais lentos.
- ✅ Medir como um celular médio (Pixel 7, 4G, CPU 4×, toque real) e mostrar o vídeo lado a lado do antes e depois.
- ✅ Release em pasta nova + symlink, com rollback em 1 comando, sem tocar no servidor web.
- ✅ Ao relatar o peso, mostrar a troca e a alternativa (ex.: "67 MB por rolagem completa; versão leve de 28 MB no celular?").

## Checklist pré-publicação
- [ ] Ordem de publicar do dono registrada (frase, data, hora, id).
- [ ] O que vai ao ar = o que foi mostrado (commit, build e filme do mesmo manifesto).
- [ ] `npm run build` limpo; console sem erro; `?diag=1` funciona.
- [ ] Filme anda e volta em toda a página: desktop via WebCodecs e celular emulado com reduzir movimento.
- [ ] Fluidez no celular emulado: trocas ≥ 10/s, parada máx ≤ 300 ms, pôster ≤ 1%, 0 queda.
- [ ] Reserva `?via=video` troca de quadro; `?filme=poster` mostra pôster.
- [ ] Nenhuma área parada no celular, nem com reduzir movimento (gravação de cada seção).
- [ ] Espaçamento em 390 e 360 px: nada cortado, nada sob a nav, alvos ≥ 44 px.
- [ ] Nenhum elemento visível que o dono não aprovou.
- [ ] Conteúdo, preços, WhatsApp, formulário (OPTIONS, sem criar lead), blog, admin, sitemap, JSON-LD e 404 iguais.
- [ ] Pesos: início da página no celular ≤ ~10 MB; rolagem completa informada ao dono.
- [ ] MP4 com `video/mp4`, Range 206 e `faststart`; HTML com `Cache-Control: max-age=0, must-revalidate`.
- [ ] Lighthouse celular ≥ 90 / desktop ≥ 98 / CLS 0, ou o desvio informado.
- [ ] Release anterior anotada; comando de rollback pronto.
- [ ] `REVISOES.md` e `ESTADO.md` atualizados.

## Arquivos deste método
| Arquivo | Para quê |
|---|---|
| `LEIA-ME.md` | o que é, como usar no Cursor/Antigravity/Claude Code/VPS, mapa |
| `ERROS-E-LICOES.md` | cada erro em ordem: causa, como foi visto, correção, regra, números |
| `FERRAMENTAS-E-BIBLIOTECAS.md` | ferramenta por ferramenta, lib por lib, skill por skill, MCP por MCP |
| `FILME-NA-ROLAGEM.md` | pipeline técnico do filme: geração, upscale, interpolação, escada, decodificador, reservas, testes |
| `ADAPTAR-POR-NICHO.md` | como adaptar (salão de beleza completo + 5 nichos) |
| `REFERENCIAS.md` | referências usadas, com caminhos |
| `scripts/` | `checa-clipe.sh`, `upscale-clipes.sh`, `interpola.sh`, `encode-degraus.sh`, `filme-rolagem.ts`, `rolagem.ts`, `vivo.ts`, `medir-fluidez.mjs`, `deploy-release.sh`, `fontes.exemplo.txt` |
