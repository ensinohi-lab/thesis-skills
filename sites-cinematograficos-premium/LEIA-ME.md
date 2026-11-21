# Método: sites cinematográficos premium (Estudo de Referência → qualquer nicho)

Criado em 16/11/2026 (America/Sao_Paulo) como método reutilizável. Este pacote transforma em método reutilizável tudo o que foi feito no site do Estudo de Referência v2 (studiothesis.com.br): as etapas, os erros, as ferramentas e as referências. É para o Jarvis, a Antigravity, o Claude Code, o Cursor e qualquer agente ou pessoa. São arquivos Markdown simples e comandos de shell comuns. Nada depende do Grok Bot.

## O que é
Um site em que um filme gerado por IA fica atrás da página e anda junto com a rolagem, nos dois sentidos, com componentes vivos por cima e um celular que não fica parado. A receita vai do briefing ao pós-lançamento, com os portões de aprovação do dono.

## Mapa de arquivos
| Arquivo | Leia quando |
|---|---|
| `SKILL.md` | **primeiro**: fases F0–F10, "não faça no início", "faça assim", checklist pré-publicação |
| `ERROS-E-LICOES.md` | antes de planejar: 20 erros com causa, correção, regra e números |
| `FILME-NA-ROLAGEM.md` | ao gerar e integrar o filme (Flow → upscale → 36 fps → escada → WebCodecs → testes) |
| `FERRAMENTAS-E-BIBLIOTECAS.md` | ao montar o ambiente (versões, caminhos, instalação, quando não usar) |
| `ADAPTAR-POR-NICHO.md` | no briefing de um cliente novo (salão de beleza completo + restaurante, imobiliária, clínica, advocacia, loja) |
| `REFERENCIAS.md` | ao escolher referências (Profitize, GitHub, Palácio, materiais aprovados) |
| `scripts/` | ferramentas prontas, descritas abaixo |

### scripts/
| Script | Faz |
|---|---|
| `fontes.exemplo.txt` | modelo da lista de clipes (arquivo, trecho limpo, recorte 9:16) |
| `checa-clipe.sh A.mp4 [B.mp4]` | QA de clipe: reverso, folha de contato, SSIM da emenda |
| `upscale-clipes.sh` | masters 4K por IA em lote (Real-ESRGAN CPU), idempotente, para rodar à noite |
| `interpola.sh` | 12 → 36 fps (minterpolate), 2560 + 1080×1920 |
| `encode-degraus.sh [--site]` | escada H.264 GOP 6 + pôsteres + manifesto, com conferência I/P |
| `filme-rolagem.ts` + `rolagem.ts` | o filme no navegador (Mediabunny/WebCodecs → ImageBitmap → canvas, vigia, `<video>`, pôster, `?diag=1`) |
| `vivo.ts` | movimento contínuo nas áreas "paradas" (`data-vivo`, `data-inclina`) |
| `medir-fluidez.mjs` | Pixel 7, 4G, CPU 4×, toque real: trocas/s, maior parada, pôster%, vídeo |
| `deploy-release.sh` | release nova + symlink, exige `APROVACAO=`, ensaio por padrão |

Os scripts de shell e o `encode-degraus.sh` foram testados com clipes sintéticos em 16/11/2026, e os `.ts` passaram no `tsc --strict`. O `deploy-release.sh` **não** foi executado: ele publica e só roda com ordem do dono.

## Como usar
### Cursor / Antigravity / Claude Code (IDE com agente)
1. Abra a pasta do projeto novo e peça ao agente para ler `SKILL.md` e `AGENTS.md`. As regras do dono valem para todos.
2. Opcional: copie `SKILL.md` para a pasta de skills do agente.
   - Claude Code: `~/.claude/skills/sites-cinematograficos/SKILL.md`. Não altere `~/.claude/settings.json`.
   - Cursor: `.cursor/rules/` ou um `AGENTS.md` que aponte para cá.
   - Antigravity: pasta de regras ou workflows do workspace.
3. Copie `scripts/` para `PROJETO/scripts/`, crie `PROJETO/fontes.txt` a partir do exemplo e rode com `PROJETO=PROJETO`.
4. No site: `npm i mediabunny lenis` e importe `filme-rolagem.ts`, `rolagem.ts` e `vivo.ts`. Marque as seções com `data-clipe`.

### VPS ou outro computador
- **Precisa de:** bash, ffmpeg (libx264, libaom-av1), Python 3.11+, Node 20+, Chrome/Chromium (para as medidas).
- **Upscale:** instale o venv como em `FILME-NA-ROLAGEM.md` §3 e aponte `UPSCALE_BIN=/caminho/upscale-4k`.
- **Sem GPU:** o upscale leva horas (rode com `nohup`). Com GPU, troque por SeedVR2 ou FlashVSR.
- O pacote portátil das ferramentas do box está em `/workspace/agency-tools/pacotes-portateis/`.

### Grok Bot (opcional)
A skill pode ser registrada no Grok Bot a partir do `SKILL.md`. Ferramentas como Arena, cartões de aprovação e subagentes ajudam, mas não são obrigatórias.

## Regras que não mudam
- Nada vai ao ar, se compra ou se gasta crédito sem a ordem do dono, nas palavras dele.
- Arte final só no Flow, Gemini/Nano Banana ou ChatGPT.
- Nenhuma senha ou chave em arquivo ou mensagem.
- Preserve conteúdo, preços, formulários, SEO e rotas.
- Entregue vídeos e prévias por link do Google Drive do dono.

## Origem
- **Projeto:** `<projeto-referencia>/`, repo `site/`, branch `v2`, commits `8617f4d` → `4346cbf` → `194ebf0` → `52bac5d` → `311a4b0`.
- **No ar:** release `202611160909` (16/11/2026 09:10 BRT).
- **Autor:** bot Sites E Web, com a aprovação e as correções do dono em cada etapa.
