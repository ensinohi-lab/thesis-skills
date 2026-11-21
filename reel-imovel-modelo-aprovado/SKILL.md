---
name: reel-imovel-modelo-aprovado
description: >-
  Use quando for montar, refazer ou adaptar um reel vertical de imóvel (ou de
  outro serviço, como salão) a partir do modelo aprovado: abertura postais,
  sistema tipográfico por área, palavras embaralhadas só nas qualidades,
  voz-polir local, QA e preflight, sem copiar o look de outro vídeo e sem gastar
  crédito.
---
# Reel de imóvel a partir do modelo aprovado

Roda em qualquer bot ou IA (ChatGPT, Gemini, Cursor, Grok), sem depender do Claude Code. Modelo completo: `modelos/MODELO-REEL-IMOVEL-POSTAIS.md`. Rascunhos de apoio: `modelos/rascunhos-skill/voz-polir/SKILL.md` e `.../sistema-tipografico/SKILL.md`.

## Entradas exigidas
- Pedido do dono da marca e a marca do vídeo.
- BRIEF da peça, ou autorização explícita para testar.
- SISTEMA-MARCA da marca (paleta, CTA, o que pode ir à tela).
- Dados do imóvel ou serviço conferidos em 2 fontes. Sem dado pessoal de proprietário, cliente ou lead.
- Cópias das fotos, takes e B-roll (nunca os originais).
- Transcrição ou JSON de palavras da fala (`bin/alinha-fala`).

## Passos
1. Ler ESTADO.md, BRIEF.md, REVISOES.md, SISTEMA-MARCA e o modelo padrão. Consultar `palacio-mental/indice.json` antes de pesquisar de novo.
2. Criar pasta de trabalho nova; copiar `compoe.py`, `mixa.py` e `qa.py` da peça de referência. Não editar peças aprovadas.
3. Preencher o checklist de dados. Fora da tela: preço, vagas e banheiros quando divergirem; nada que contradiga a fala; CRECI e telefone só com autorização.
4. Abertura: preservar a aprovada (conferir hash) ou montar nova com `bin/postais-reel` (hero e bairro próprios).
5. Planejar blocos por função (gancho, condição, diferencial, localização, conforto, programa, ambientes, área externa, CTA, end card). Um título por bloco; palavras embaralhadas só para qualidades conferidas, uma por bloco.
6. Aplicar o sistema tipográfico por área (`compoe.py --tipografia sistema`).
7. Polir a voz com a variante A do `bin/voz-polir` (tempo intacto, sem cortar pausas, sem créditos).
8. Compor em partes, mixar, rodar QA e preflight. Registrar a rodada no REVISOES.md (uma mudança por rodada).
9. Entregar prévia, folha de contato e relatório, e parar. Só o dono aprova (registrar a frase dele no BRIEF e no REVISOES) e só ele autoriza publicar. Depois da aprovação, registrar APRENDIZADOS.

## Comandos (na pasta da peça, com `<agency-tools>/bin` no PATH)
```
python3 scripts/compoe.py --ate 25 -o work/corpo1.mp4 & python3 scripts/compoe.py --de 25 --ate 42 -o work/corpo2.mp4 & python3 scripts/compoe.py --de 42 -o work/corpo3.mp4; wait
voz-polir work/voz-origem.wav voz/voz-A-polida.wav --palavras voz/palavras-reel.json --relatorio voz/voz-A-relatorio.json
python3 scripts/mixa.py --voz voz/voz-A-polida.wav && python3 scripts/qa.py
preflight SAIDA.mp4 --projeto preflight --saida preflight/preflight-relatorio.json
```
Os tempos de corte (25, 42) são os da peça de referência; ajuste aos blocos da nova fala. O item 15 do preflight passa só com a linha `Estado: aprovado pelo <dono> em <data e hora>` no BRIEF. Não mude limites do preflight para forçar aprovação.

## Não fazer
- Não publicar, agendar nem comprar crédito, plano, conta ou trilha sem aprovação.
- Não gerar arte com o gerador de imagem do bot; arte vem de Gemini, Flow ou ChatGPT, com proveniência.
- Não inventar preço, vagas, metragem, endereço, condomínio ou IPTU.
- Não cortar pausas da voz sem escolha explícita.
- Não alterar originais, peças aprovadas, o gateway do Claude nem `~/.claude/settings.json`.
- Não aninhar pastas sincronizadas.
- Cada vídeo tem estilo próprio: o modelo é ponto de partida, não cópia.
