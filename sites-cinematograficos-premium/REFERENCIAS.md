# Referências, uma a uma, com caminhos

O que entrou no Estudo de Referência v2, onde está e para que serve. Isto é **método**: em outro cliente, escolha as referências dele (ver `ADAPTAR-POR-NICHO.md`).

## 1. Prompts e componentes do Profitize (profitize.com.br/build)
- **Cópias de trabalho:** `<projeto-referencia>/prompts/`. São 14 itens; Lusco e Sopro vêm com ZIP, CLAUDE.md e checklist.
- **Levantamento:** `<projeto-referencia>/profitize-prompts.md` (10/11/2026). Copiar gasta 1 cópia da cota semanal da conta do dono.
- **Estudo público:** `<referencias>/browser-findings.md`. Ele **não** contém prompts.
- **Comparação spec × repo:** `<projeto-referencia>/plano-v2.md` §1.

| Item Profitize | Tipo | Onde entrou no Thesis | O que se aprendeu |
|---|---|---|---|
| **Lusco** (`prompts/lusco.md`, `lusco/`) | landing de produtora (base) | filme fixo atrás da página, furos por seção, intro com 11 miniaturas, trepidação de projetor | o filme é a peça principal; o **reel** da spec não foi pedido pelo cliente (E7) |
| **Sopro** (`prompts/sopro.md`, `sopro/`: `ink.js`, `hero.js`, `infla.py`) | landing de estúdio | hero: tinta com massa revelando o nome inflado em 3D (Blender) | usar inteiro, não atrás de flag (E2) |
| **Estilo Cursor** (`prompts/estilo-cursor.md`) | design system editorial | tokens, cantos de 4 px, títulos 400 com tracking negativo, acento bordô | — |
| **Works Wheel** (`prompts/works-wheel`) | roda 3D de capas | Cases (9 capas) no desktop | no dedo virou carrossel de toque (E11) |
| **Polaroid Line Carousel** | varal de fotos | Bastidores, com stills reais do set | não repetir as imagens do hero |
| **Interactive Selector** | galeria por serviço | Serviços | uma imagem própria por serviço |
| **3D Testimonials** | parede 3D | "Quem confia, volta." | precisa de depoimentos reais suficientes |
| **Halftone Wordmark Footer** | rodapé | rodapé que amostra o quadro de F8 | fundido com o filme |
| **Circular Navigation** | menu íris | menu | — |
| **Esteira** | faixa contínua (spec sem código) | esteira de cases entre as faixas de filme (`esteira.ts`) | deriva sempre, mesmo com reduzir movimento (E14) |
| **Âncora** | preços com dígitos que rolam | Preços | colisão de classe `.reel` (E6) |
| **Progressive Blur Card** | cartão com desfoque | Blog e fichas de case | só aparece com posts (API vazia) |
| **Moldura** | shader de luz nas bordas | Chamada / Contato | 30 fps e pausa fora da tela |
| **Nebulosa** | GrainGradient (`@paper-design/shaders`) | Contato / 404 | — |
| Lampo | anel 3D / portal | **não usado** (menos aderente) | — |

## 2. Skills e repositórios do GitHub
Cópias de leitura ficam em `<referencias>/github/` e `<referencias>/rtskills/`. O crédito está em `<projeto-referencia>/v2/FONTES-GITHUB.md`. Nenhum código de terceiros foi colado inteiro; tudo foi reescrito, com crédito no cabeçalho.

| Repo (commit) | Licença | O que se aproveitou | Onde |
|---|---|---|---|
| shuding/liquid-glass (`a2d2e84`) | MIT | lente: SDF → `feDisplacementMap` como `backdrop-filter: url(#…)`, só na borda, só no Chromium desktop | `site/src/scripts/vidro.ts` |
| rdev/liquid-glass-react (`ac48eab`) | MIT | saturação 130–140%, brilho especular que segue o cursor, elasticidade | `vidro.css`, `vidro.ts` (`ima()`) |
| nextlevelbuilder/ui-ux-pro-max-skill (`efd9822`) | MIT | regras de vidro (blur 10–20 px, 15–30%, contraste 4,5:1, só em controles), press 0,97, `cubic-bezier(.16,1,.3,1)` | `vidro.css` |
| vercel-labs/web-interface-guidelines (`434b7f9`) | MIT | animar só transform/opacity, foco visível, `touch-action`, animação interrompível | `vidro.css`, `hero.css`, `linhas.ts`, `entradas.ts` |
| anthropics/skills `frontend-design` (`1780c5e`) | Apache-2.0 | um momento orquestrado por seção; a ousadia num lugar só | escolhas de motion |
| rtadewald/skills (draw-wireframe, img-to-html, video2html, mediabunny, nano-banana-pro, fal-ai, animate, extract-ds, plan-screen) | ver o repo | método do reel: rascunho → wireframe → referência → image-to-image → 3D → recriação por camadas; "sem 2.5D" | `plano-v2.md` §2; `v2/wireframes/` |
| github.com/xinntao/Real-ESRGAN (modelo realesr-general-x4v3) | BSD-3 | upscale 4K local | `<agency-tools>/upscale-4k/` |
| Avaliados e não usados: uiverse-io/galaxy, emilkowalski/vaul | MIT | — | — |

## 3. Vídeo de referência do método
- O reel do @rodrigotadewald, em `<referencias>/video-metodo.mp4` (75,6 s, com info.json). Dele vem o método de 6 passos (`plano-v2.md` §2). **Não** se pega o visual "dashboard sci-fi".

## 4. Palácio Mental e referências de ferramentas
- `palacio-mental/LEIA-ME.md` + `indice.json` (47 registros). Os que importam para sites:
  - `reel-Dfh7M5xlQWC-motionsites`: skill de landing, o que reutilizar;
  - `site-designerlab-skill-lab`: organização da criação, sem comprar o kit;
  - `pipeline-pecas-evolutivo`: portões P1–P10 e evolução da marca;
  - `agents-md-preflight`: regras de todos os agentes;
  - `filme-publicado-v10`: lições de filme (um plano do Flow por vez, só o trecho limpo, nada de crédito sem aprovação);
  - `guia-cidade-3d-vibehub-3m9tc`: tour 3D sem trocar a foto real do imóvel;
  - `referencias-ferramentas`.
- `<referencias-ferramentas>/LEIA-ME.md`. Os itens para web:
  - §3 MotionSites (Dfh7M5xlQWC);
  - §4–9 efeitos (React Bits, Radiant, Vanta, OpenBackgrounds, Magic UI, tsParticles);
  - §14 claude-seo;
  - §18–19 designerlab e Skill Lab;
  - §23 tipografia-identidade-2026-11-15;
  - §29 editorpro-essential;
  - os estudos `estudos-2026-11-16-vibe-coding-toolkit/`.
  - Modelo de ficha: `MODELO-FICHA-ESTILO.md`.
- Metodologia do Jarvis: `<guia-sites>.md` e `<estudos-multiagente>/` (DOSSIE.md, METODO-PENSAR-E-PLANEJAR.md, BIBLIOTECA-E-DRIVE.md).
