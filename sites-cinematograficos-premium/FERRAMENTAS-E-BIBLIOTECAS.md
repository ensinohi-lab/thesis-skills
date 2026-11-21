# Ferramentas, bibliotecas, skills e MCPs

Para cada item: onde está ou como instalar, para que serve e quando **não** usar. Os caminhos `/workspace/...` são do box compartilhado do dono. Em outra máquina, use o comando de instalação ou o pacote portátil (`/workspace/agency-tools/pacotes-portateis/`). As versões são as do caso Estudo de Referência (`<projeto-referencia>/site/package.json`, 16/11/2026).

## 1. Base do site
| Item | Versão / instalação | Para quê | Quando NÃO usar |
|---|---|---|---|
| **Astro** + TypeScript | `astro 7.4.10`, `typescript 5.9.3`, `@astrojs/check`; `npm create astro@latest` | site estático rápido, HTML pré-renderizado (SEO), ilhas só onde há interação | app com muito estado no cliente (painel, checkout complexo): use um framework de app |
| **React** (ilhas) | `react 19`, `@astrojs/react 7` | componentes Profitize que vêm em TSX (roda, parede, carrossel, halftone, menu íris) | para o filme e as animações de rolagem: TS puro, sem re-render |
| **Lenis** | `lenis 1.3.27` (`lerp 0.05`, `wheelMultiplier 0.8`, `touchMultiplier 1.1`) | rolagem suave e laço único com o filme | com reduzir movimento ligado: rolagem nativa (o `rolagem.ts` já faz isso) |
| **Mediabunny** | `mediabunny 1.66.0` | ler MP4 no navegador e entregar pacotes ao WebCodecs | navegadores sem `VideoDecoder`: a reserva `<video>` assume sozinha |
| **WebCodecs** (`VideoDecoder`) | nativo (Chrome/Edge/Android; Safari 16.4+) | decodificar quadro a quadro sob demanda | sem vigia e sem fechar `VideoFrame`: congela no Android |
| **@paper-design/shaders** | `0.0.82` | Nebulosa (GrainGradient) do Profitize | em fundo atrás do filme: competem |
| **Fontes** | `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`, `@fontsource/eb-garamond` | tipos self-hosted (sem Google Fonts em tempo de execução) | troque por nicho (ver `ADAPTAR-POR-NICHO.md`) |
| **Playwright** | `playwright 1.65.0` + Chrome do sistema `/usr/bin/google-chrome` | capturas, gravações, toque real por CDP, medir fluidez | não substitui o aparelho real (headless sem GPU é pior no desenho) |
| **Lighthouse** | `lighthouse 13.6.0` (`npm run lighthouse`) | desempenho e SEO por página | uma nota isolada não mede o scrub: use `medir-fluidez.mjs` |
| **sharp** | `0.35.5` | imagens otimizadas no build | — |

Os scripts do repo de origem ficam em `<projeto-referencia>/site/scripts/`:
- `screens.mjs` e `v2-capturas.mjs`: capturas;
- `video.mjs`: gravação de rolagem;
- `v2-video-toque.mjs` e `toque-roda.mjs`: toque real;
- `v2-celular-auditoria.mjs` e `v2-celular-secoes.mjs`: celular por seção;
- `v2-desempenho.mjs`: CPU e quadro;
- `v2-4k.mjs`: degrau e nitidez;
- `v2-movimento.mjs`: áreas paradas;
- `v2-fluidez.mjs`: a cópia genérica é `scripts/medir-fluidez.mjs`;
- `lighthouse.mjs`;
- `audit-resp.mjs`: 13 larguras.

## 2. Vídeo e imagem (local)
| Item | Onde | Para quê | Quando NÃO usar |
|---|---|---|---|
| **ffmpeg / ffprobe** | `<agency-tools>/bin/ffmpeg`, `ffprobe` (ou `apt install ffmpeg`, com libx264 e libaom-av1) | trims, reverso, SSIM, minterpolate, escada H.264, pôsteres AVIF | — |
| **upscale-4k** (Real-ESRGAN na CPU) | `<agency-tools>/bin/upscale-4k` → `upscale-4k/upscale.py` + `venv/` (torch 2.15 CPU, spandrel 0.4.2) + `modelos/` (SHA256SUMS). Leia o `LEIA-ME.md` | masters 4K de clipes 720p/1080p sem créditos | com GPU (use SeedVR2/FlashVSR); para imagem parada única, prefira regerar no gerador em alta |
| **minterpolate** (ffmpeg) | `scripts/interpola.sh` | 12 → 36 fps para o scrub ficar fluido | movimentos muito rápidos ou oclusões (artefatos); em 3840 (memória) |
| **ImageMagick** | `<agency-tools>/bin/magick` | painel de referências, folhas de contato, recortes | — |
| **rembg / recorta-pessoa** | `bin/rembg`, `bin/recorta-pessoa` | recortar o objeto do fundo (vistas para 3D, cartões) | para fazer 2.5D em paralaxe (proibido) |
| **Blender 4.5.16 LTS** | `/home/box/apps/blender` (oficial, sem sudo) + `<projeto-referencia>/v2/3d/letras/infla-thesis.py` | letras infladas (Sopro) e objetos 3D renderizados para imagem | 3D ao vivo pesado no celular: renderize para webp |
| **darktable-cli / rawtherapee-cli / gimp-console** | `bin/` | tratar fotos reais do cliente (salão, imóvel, comida) | — |
| **HyperFrames, motion-canvas, manim** | skill `hyperframes`, `bin/motion-canvas`, `bin/manim` | vídeos de motion para redes a partir do site | o filme do site (lá é Flow + scrub) |
| **preflight** | `<agency-tools>/bin/preflight VIDEO --projeto PASTA` | checagem obrigatória antes de entregar **vídeo** | em site (marque n/a no REVISOES) |
| **pipeline** | `<agency-tools>/bin/pipeline novo|status PASTA` | portões P1–P10 de qualquer peça | — |

### Upscalers avaliados (16/11/2026, `upscale-4k/LEIA-ME.md`)
| Ferramenta | Roda em CPU? | Veredito |
|---|---|---|
| Real-ESRGAN **realesr-general-x4v3** | sim, 5–30 s por quadro até 4K | **escolhido**: traço limpo, metal definido, sem halo |
| RealESRGAN x2plus / x4plus | sim (4× mais lento) | entre o general e o lanczos |
| SPAN 2xNomosUni | sim (5 s por quadro) | quase igual ao lanczos |
| Video2X 6.4 | só com Vulkan (lavapipe mais lento) | dispensável: mesmo modelo, caminho mais lento |
| SeedVR2 3B/7B | não (horas no VAE) | o melhor, mas **só com GPU** (8 GB+ com GGUF) |
| FlashVSR | não (~17 fps em A100) | só com GPU |
| DOVE, UltraVSR, STCDiT, InfVSR | não | só com GPU |
| Stream-DiffVSR | fallback de CPU, de 360p para 720p | não chega a 4K em tempo útil |
| npuscale (ONNX) | sim | alternativa temporal, RRDB pesado |
| vs_temporalfix | modo CPU muito lento | não precisou (tremido baixo) |

## 3. Geração (contas do dono, com aprovação)
| Item | Para quê | Regra |
|---|---|---|
| **Google Flow (Veo 3.1 / Omni Flash 1.2)** | clipes do filme, Frames to Video com 1º e último quadro | créditos só com aprovação; um clipe por vez; Veo 3.1 Fast e Quality saem em 05/12/2026 |
| **Gemini / Nano Banana Pro** | quadros-chave, mocks de tela, vistas para 3D (image-to-image) | arte final só aqui, no Flow ou no ChatGPT |
| **ChatGPT (imagem)** | alternativa para quadros-chave e mocks | idem |
| **fal.ai** (Rodin 2.5, Tripo H3.1, Hunyuan3D, TRELLIS 2) | objeto 3D (GLB) a partir de imagens. Pesquisa em `<projeto-referencia>/v2/3d/PESQUISA-3D.md` | pago (US$ 0,25–1,20 por modelo); chave pelo cofre; sem chave, use uma reserva |
| ❌ gerador de imagem do próprio agente | — | proibido para arte final |

## 4. Skills (SKILL.md)
| Skill | Onde | Para quê | Quando NÃO usar |
|---|---|---|---|
| **draw-wireframe**, to-wireframe, plan-screen | `<referencias>/rtskills/` (github.com/rtadewald/skills) | wireframes 1440/390 sem custo de API | — |
| **img-to-html / img2html** | idem | recriar a tela aprovada camada por camada (fundo → estrutura → componentes → assets) | sem mock aprovado |
| **video2html** | idem | vídeo + imagem → página viva; regra "sem 2.5D"; `isolate_subject.py`, `image_to_3d.py` | — |
| **mediabunny** | idem | decodificar vídeo no navegador | — |
| **nano-banana-pro, fal-ai, openrouter-img** | idem | chamadas de geração | nunca sem aprovação de créditos |
| **animate** | idem | INT-01 glass shimmer CTA, ímã, `--glass-blur`, regras de pausar fora da tela | — |
| **extract-ds** | idem | extrair o design system de uma referência | — |
| **MotionSites Web Builder** | `/workspace/agency-tools/motionsites-web-builder` (README, `plugins/`) + `bin/motionsites-web-builder URL DIR --wait 4 --full` (capturas) | 40 prompts de landing, 55+ receitas (liquid glass, scrub com fila de seek em `techniques/video-and-media.md` §6–7), auto-captura e correção | como fonte de estética no lugar das referências do dono |
| **Vibe Coding Toolkit** | `/workspace/agency-tools/vibe-coding-toolkit` (README.pt-BR.md, AGENTS.md) + `bin/vibe-coding`, `bin/vibe-toolkit` | método de trabalho com agente de código, templates | — |
| **claude-seo** / `seo-auditoria-claude-seo` | `/workspace/agency-tools/claude-seo` (USO.md); skill em `/home/box/agent-data/workflows/seo-auditoria-claude-seo` | auditoria de SEO antes e depois | — |
| **motion-design-principles** | `/home/box/agent-data/workflows/` | entrada ease-out, saída 0,75× mais rápida, duração pela distância | — |
| **kinetic-typography** | idem + `/workspace/agency-tools/skills-externas/` | máscara só no título que importa, uma propriedade por linha, sem refluxo | em todo texto (vira ruído) |
| **motion-color-and-light, motion-design-howseen** | idem | paleta, contraste, luz | — |
| **hyperframes, hyperframes-media-use, video-storyboard** | idem | vídeos de divulgação do site | — |
| **anthropics/skills `frontend-design`** | `<referencias>/github/anthropics_skills` | contenção: um momento orquestrado por seção, a ousadia num lugar só | — |
| **ui-ux-pro-max-skill** | `referencias/github/nextlevelbuilder_ui-ux-pro-max-skill` | regras de glassmorphism (blur 10–20 px, 15–30% opacidade, contraste 4,5:1, vidro só em controles) | — |
| **web-interface-guidelines** (Vercel) | `referencias/github/vercel-labs_web-interface-guidelines` | checklist: animar só transform/opacity, nunca `transition: all`, `:focus-visible`, `touch-action` | — |
| **superdesign, react-best-practices, figma-*** (Cursor/Grok Bot, opcionais) | skills do agente | explorar layouts, revisar TSX, ler design do Figma | — |
| **Arena** (Grok Bot, opcional) | skill `arena` | N candidatos em paralelo (worktrees) + juiz cruzado. Usada na v1 responsiva (3 candidatos, 1 caiu, síntese c3 + enxertos c1) | mudanças pequenas |

## 5. Bibliotecas de efeitos (avaliar antes)
`/workspace/agency-tools/web-effects/` está **vazia** (instalação não concluída). Estudo em `<referencias-ferramentas>/LEIA-ME.md` §4–9: React Bits, Radiant Shaders, Vanta.js, OpenBackgrounds, Magic UI, tsParticles. São npm públicas; instale no projeto quando precisar.
**Quando NÃO usar:** como base estética. Foram vetadas "bibliotecas next-gen garimpadas fora das referências dele". Entram só se a referência aprovada pedir, ou para um detalhe pontual com o ok dele.
Avaliados e não usados: `uiverse-io/galaxy` (botões soltos, fora da estética) e `emilkowalski/vaul` (drawer React).

## 6. MCPs (opcionais; dependem do agente)
| MCP | Para quê |
|---|---|
| **Google Drive** | entregar vídeos e prévias por link (regra padrão, 16/11/2026); materiais aprovados vão para o Drive |
| **Figma** | ler ou gerar telas e componentes; Code Connect |
| **Motion** (`insert-motion-component`, `search-motion-docs`) | componentes e documentação do Motion (Framer Motion) para ilhas React |
| **ffmpeg-skill, kinocut** | operações de vídeo dirigidas por agente |
| Gmail / Slack / Postiz | **não** usar para publicar ou enviar sem pedido explícito |

## 7. Servidor e publicação
| Item | Como | Regra |
|---|---|---|
| **Releases + symlink** | `RAIZ/releases/AAAAMMDDHHMM/` + `current -> releases/…`, servido pelo Caddy em container (`root * …/current`, `file_server`) | rollback = `ln -sfn releases/ANTERIOR current`, sem reload |
| **tar pelo ssh** | `tar -C dist -cf - . \| ssh HOST "tar -C RAIZ/releases/R -xf -"` (sem rsync no box). Script: `scripts/deploy-release.sh` | conferir contagem e sha256 antes de trocar o symlink; não tocar no Caddyfile |
| **Caddy** | bloco do site em `<projeto-referencia>/site/DEPLOY.md` (try_files, fallback de slug do blog, 404, cache imutável em `/_astro/*`) | mudança no Caddy é outra aprovação: copie o `.bak`, `caddy validate` e depois `reload` |
| **Chave SSH** | a do operador, em `~/.ssh/` | nunca imprimir nem copiar para arquivos do projeto |
