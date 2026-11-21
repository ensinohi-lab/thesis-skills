---
name: Termo de vistoria e entrega de chaves (locação)
description: >-
  Use ao preparar Termo de Vistoria e Entrega de Chaves e Termo de Entrega de
  Chaves no início de uma locação residencial ou comercial, a partir do contrato
  (PDF) e das fotos do imóvel; gera os dois documentos automaticamente no layout
  aprovado gastando o mínimo de IA.
---
# Termo de vistoria e entrega de chaves

Gerador local em `<tools>/termos-locacao/` (detalhes em `LEIA-ME.md`). Só a descrição dos cômodos precisa de IA; o resto é script.

## Entradas
- Contrato de locação (PDF ou texto).
- Fotos do imóvel. Fotos enviadas soltas pelo celular podem aparecer na conversa sem virar arquivo no computador: se não estiverem na pasta de anexos, peça para reenviar num ZIP.
- Data e hora da vistoria/entrega, testemunha (nome|CPF|qualificação) e gênero de locador e locatário, se o contrato não deixar claro. Use o que o usuário já disse antes de perguntar.

## Passos
1. Crie uma pasta de trabalho `W` localmente.
2. `python3 <tools>/termos-locacao/extrair_contrato.py contrato.pdf -o $W/dados.json`. Confira a lista FALTANDO; nunca invente dado ausente, peça ao usuário.
3. `python3 <tools>/termos-locacao/fotos.py fotos.zip [mais...] --saida $W`.
4. Passo de IA: olhe só as folhas de contato `$W/contato-*.jpg` e preencha `$W/comodos.json` (linhas por cômodo e legenda de cada foto) reaproveitando as frases de `biblioteca_comodos.json`. Descreva apenas o que aparece; sem contagens, marcas ou medidas inventadas. Qualquer coisa que pareça dano ou remendo: descreva de forma neutra e pergunte ao usuário se entra como ressalva.
5. `python3 <tools>/termos-locacao/gerar_termos.py $W/dados.json $W/fotos.json $W/comodos.json --saida $W --testemunha "Nome|CPF|qualificação" --data DD/MM/AAAA --hora HHhMM --genero-locador F|M --genero-locatario F|M`.
6. Confira a contagem de páginas e veja uma página renderizada de cada termo. Entregue PDF e DOCX dos dois termos. Chaves e leituras de água/luz saem em branco para preencher na hora.

## Cuidados
- Contratos de outro modelo podem exigir ajuste nas regex de `extrair_contrato.py`; rode `bash teste_regressao/rodar.sh` depois de qualquer alteração.
- Não envie nada ao cliente; o usuário envia.
