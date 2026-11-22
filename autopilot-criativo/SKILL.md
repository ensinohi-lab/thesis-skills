---
name: autopilot-criativo
description: "Use quando o pedido for produzir, refazer ou seguir uma peça (carrossel, motion de texto, reel de imóvel, vídeo com foto, vídeo no Flow ou lote mensal) com um comando só — /autopilot-criativo ou /produzir — a partir de uma ORDEM.md e da linha /workspace/producao. Não use para publicar, agendar, apagar originais ou tarefas que não sejam peça."
---

# Autopilot criativo

Um comando só roda o processo padronizado de qualquer peça. A lógica vive em `/workspace/producao/bin/produzir`; esta skill não a duplica. Nunca publica, nunca apaga `entrada/`, `aprovados/` nem originais.

Inspirado no estudo t666u (`/workspace/palacio-mental/referencias-video/2026-11-22-t666/ESTUDO.md`): Skill Creator nativo + um `/autopilot` de 10 etapas, adaptado à produção criativa (não é git/PR/TDD).

## Quando o Theo (ou a equipe) chama

- `/autopilot-criativo` ou `/produzir`, com o caminho de uma `ORDEM.md` (modelo em `/workspace/producao/ORDEM.md`).
- Se a ordem ainda não existe, preencha o modelo (marca, kit, lote de `entrada/`, texto, áudio, observações) e só então dispare o comando.

## As 10 etapas (sempre nesta ordem)

1. **Leitura.** `ORDEM.md`, kit em `/workspace/producao/kits/<kit>.md`, identidade da marca e `AGENTS.md` da marca se houver.
2. **Conceito.** Tese em metáfora, 2 ou 3 caminhos, escolha de um (`CONCEITO.md`).
3. **Preflight.** Molde aprovado, referências, erros já registrados (`PREFLIGHT.md`). Skill `preflight-criativo-obrigat-rio`.
4. **Mapa.** Lâminas ou cenas com Layout Humano (REA-PRISMA seção g, terços, grid de 6 colunas).
5. **Prompts.** Codex escreve os prompts (sem texto queimado na placa).
6. **Artes-base.** `image_gen` (ChatGPT/Codex), reaproveitando `acervo/` e `entrada/` antes de gerar.
7. **Montagem.** Claude (Sonnet, `--max-turns` baixo) preenche o script molde e renderiza.
8. **Revisão em ciclos.** Padrão **3**, máximo **5** (`--revisoes N`). Cada ciclo: Codex review + `qa_layout.py` + QA do kit; corrige só o que falhou.
9. **Entrega.** Render final, prévia, `RESUMO.md`, `CONSUMO.csv`, `ESTADO.md`. Para e espera o Theo.
10. **Limpeza.** Apaga só cache temporário da própria `saida/` (`cache/`, `*.parcial.*`, `__pycache__`). Não toca originais, `aprovados/` nem `entrada/`.

## Como disparar

```bash
# teste de caminhos e plano das 10 etapas, sem chamar IA
/workspace/producao/bin/produzir caminho/ORDEM.md --seco

# produção (segundo plano, com retomada se houver 429)
/workspace/producao/bin/produzir caminho/ORDEM.md --revisoes 3

# lote mensal
/workspace/producao/bin/produzir caminho/ORDEM.md --lote --revisoes 3

# estimar consumo
/workspace/producao/bin/produzir --orcamento motion-texto
```

No notebook Windows: `.\produzir.ps1 -Ordem <ORDEM.md> -Revisoes 3` (ver `/workspace/agency-tools/pacotes-portateis/producao/README-WINDOWS.md`).

## Regras que não negociam

- Responder em português do Brasil.
- Layout Humano: proibido jogar texto só à esquerda ou só no centro.
- Fontes proibidas: Garamond, Courier, Playfair, Montserrat, Anton, Inter, Newsreader, Archivo (e as já vetadas da marca).
- Sem zoom em foto parada, sem ilustração literal, sem serviço pago, sem alterar `~/.claude/settings.json`.
- Publicação só com ok explícito do Theo — esta skill **não publica**.
