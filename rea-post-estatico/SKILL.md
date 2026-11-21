---
name: "rea-post-estatico"
description: "Engenharia reversa de post estático e carrossel de referência (Instagram, revista, cartaz) para aprender o MÉTODO e transformá-lo em conceito visual próprio por post e em prompt de ChatGPT. Use antes de criar capa, post ou carrossel a partir de referências, para qualquer cliente, e sempre que uma arte nossa parecer repetida ('fórmula'). Mede texto, tipografia (com a fonte livre mais próxima), hierarquia, margens, paleta, molduras, marca-texto, meio da imagem, técnica de cena e linguagem de câmera com a ferramenta rea-post (CPU, offline), e traduz a disposição do texto numa gramática de layout (9 tipos, regras de lógica × caos, mapa de layout por lâmina)."
---

# rea-post-estatico · da referência ao conceito próprio

**Skill irmã:** `cenas-editoriais/` (catálogo de 31 técnicas de cena com prompts, bloco de prompt «LAYOUT E CAOS» e `compor_lamina.py`).

## Regra que não muda
Referência é para **aprender método**, nunca para copiar: não reaproveitar foto, texto, paleta exata, composição ou identidade da referência. Arte final vem do ChatGPT (conta autorizada), do Gemini ou do Flow, ou de obra de domínio público com crédito. Não logar em Instagram nem usar cookies para baixar referência.

## 1. Rodar a ferramenta
A ferramenta está no box (Jarvis/Grok): `rea-post`.
```bash
rea-post decompose PASTA_DE_REFERENCIAS -o PASTA_DE_SAIDA            # ≈10 s por lâmina
rea-post decompose PASTA -o SAIDA --sem-legenda                       # mais rápido, sem descrição automática
rea-post prompt PASTA_DE_SAIDA                                         # refaz só os prompts
```
**Ambiente local:** pode ser acionado pela ponte (`bridge/inbox_grok/`) ou instalado localmente com Python + CPU. Saída vai para uma pasta `_rea-post/` ao lado das referências.

## 2. Ler a saída (o que importa)
Por lâmina: `<nome>_anotada.jpg` (caixas) e `<nome>.json`. Na pasta: `resumo.md`.
- `texto.linhas[].medidas.cap_height_px`: altura da versal. Agrupe por voz: **condução**, **frase-chave**, **crédito**. Calcule a razão frase-chave ÷ condução (no Prisma, 1,6–1,8×).
- `fontes_livres_proximas`: a alternativa **OFL/Google Fonts** mais próxima. É o que podemos usar. Fonte comercial da referência nunca aparece e não deve ser comprada.
- `classe_tipo` (serifa, grotesca, geométrica, mono, condensada): conte quantas vozes o carrossel usa (bom sinal: 2, mais uma de cartaz no máximo).
- `marca_texto`: cor e geometria do recurso de destaque. Se aparece em várias lâminas com a mesma cor, é constante.
- `paleta` (hex + área) e `fundo`: quantas cores por lâmina e qual se repete.
- `grade`: margem esquerda (px e %), alinhamento, eixos.
- `texto.palavras` e `area_texto_pct`: densidade (Prisma: 27–45 palavras por lâmina, ≤ 60).
- `meio` e `tecnicas`: que tipo de imagem é (foto, pintura, render 3D, ilustração, card, textura, colagem) e que técnica de cena (ver `cenas-editoriais/`).
- `cena` (CinemaCLIP): plano, altura de câmera, luz, cor. `descricao_florence`: descrição automática **que pode errar** (nomes, gênero, texto).
- `prompt_reconstruido`: rascunho de prompt da lâmina. Serve para entender a lâmina, **não** para copiar.
Limites: linha com duas fontes recebe uma classe só; altura ±15%; tiras inclinadas inflam a caixa. Olhe sempre a imagem anotada.

## 2b. Ler o LAYOUT (olhando as imagens, não só o JSON)
O `rea-post` dá a caixa de cada linha (`texto.linhas[].bbox`). Com ela e com a imagem, classifique cada lâmina:
- **Posição do texto de leitura:** topo, meio, base, topo+base, ilhas, coluna.
- **Tipo de layout** (L1–L9, ver catálogo de referência g.4): manchete-colisão, topo calmo + cena, sanduíche, card, texto na área calma da imagem, imagem domina, ilhas, coluna + objeto invasor, vão central.
- **Relação texto-imagem:** sobre a imagem, separado, card, em tira/etiqueta.
- **Caos:** tira inclinada, palavra coberta pela figura, palavra ou objeto saindo do quadro, colagem com rasgo, salto de escala ≥ 6×. Anote **onde** ele mora (imagem, palavra-cartaz, arranjo).
- **Lógica:** o texto de leitura está reto, sem nada por cima, com margem fixa? (No Prisma, sempre.)
Salve numa tabela/JSON por lâmina (modelo: `layout-por-lamina.json`) e conte: % de cada posição, repetições em seguida e o que muda quando repete, lâminas de caos por carrossel.

## 3. Separar CONSTANTE de VARIÁVEL
Monte uma tabela com uma linha por carrossel (ou peça):
1. **Constantes** = o que se repete em todas: regra tipográfica, recurso de destaque, crédito, margem, densidade, ritmo imagem ↔ pausa, rima visual. Isso vira o **sistema da marca do cliente**.
2. **Variáveis** = o que muda de post a post: mundo, dispositivo visual, meios, paleta, até a família tipográfica. Para cada carrossel, escreva: tema → mundo concreto do leitor → dispositivo visual → meios por lâmina.
Se não conseguir dizer de onde veio a imagem de uma lâmina (do tema), é decoração.

## 4. Criar o conceito visual do NOSSO post
Para cada post novo:
1. **Tema** em uma frase (a tensão que o texto resolve).
2. **Mundo concreto do leitor**: onde isso acontece na semana dele (lugar, objeto, tela, ritual). Diferente do mundo dos 3 posts anteriores.
3. **Dispositivo visual** (um só, que se repete e rima no fecho): ex. raio-x, mapa, termografia, janela, manequim, carimbo, placar.
4. **Meios por lâmina** (4 a 6 diferentes): foto documental, pintura de domínio público creditada, render 3D, ilustração, card chapado, textura, documento/fac-símile. Pelo menos 1 lâmina só tipografia.
5. **Constantes da marca do cliente** (do passo 3 e do manual da marca): tipografia, cor de destaque, crédito, assinatura, margem.
6. **Checklist anti-fórmula** (REA-PRISMA.md, seção e, itens 1–22). Se falhar em qualquer item, refazer o conceito antes de gerar arte.

## 4b. Mapa de layout (antes de qualquer prompt)
Uma linha por lâmina: função no arco · layout (L1–L9) · posição do texto · fundo · elemento de caos (ou «calma») · técnica (nº do catálogo) · palavras · quem faz (ChatGPT só cena / ChatGPT cena + texto curto / código / obra real). Modelo em catálogo de referência g.6.
**Gramática em palavras simples:** o caos fica na imagem e nas palavras-cartaz de 1 a 3 palavras; a lógica fica no texto de leitura (reto, margem fixa, nada por cima).
**Regras de sequência:** posição e layout nunca iguais em duas lâminas seguidas (se repetir, mudam fundo, meio e caos, e nunca 3 seguidas) · topo em no máximo 30% das lâminas · pelo menos 3 lâminas de caos, com caos máximo na capa e no clímax · lâminas de leitura calmas · pelo menos 1 card, no máximo 2 seguidos · fundo troca ≥ 3 vezes · 1 salto de escala fora da capa · palavras: capa ≤ 8, imagem ≤ 45, card ≤ 50, lâmina com palavra gigante ≤ 25.

## 5. Escrever o prompt do ChatGPT (uma lâmina por vez)
Estrutura:
```
[Formato] 1080×1440 (3:4) | [Meio] fotografia documental / render 3D / pintura (usar obra real, não imitar) / ilustração
[Cena] o que se vê, com objetos e lugar concretos do mundo do post
[Técnica] da skill cenas-editoriais (ex.: manequins 3D brancos foscos; figura em cor única na multidão)
[Câmera e luz] plano (close, médio, aberto), altura (alta, olho, baixa), luz (dura lateral, suave de cima), grão
[Paleta] 2–3 cores + 1 de destaque (hex)
[Layout] tipo L1–L9 do mapa, posição do texto, elemento de caos (bloco «LAYOUT E CAOS» de cenas-editoriais)
[Espaço do texto] qual área fica livre e com que fundo (não é sempre o topo)
[Proibido] texto na imagem (a tipografia entra depois), logos, pessoa real viva gerada por IA, contorno branco em recorte, clichês do cliente
```
Lâmina com mais de 25 palavras, citação longa ou obra real: pedir ao ChatGPT **só a cena** e compor texto, tiras e destaque com `cenas-editoriais/compor_lamina.py` (a correção de texto no ChatGPT piorou a lâmina 8 do Post 02).
Depois de gerar: rodar `rea-post` na nossa arte e comparar com o sistema (versal do corpo, razão, margem, palavras, número de vozes, uma cor de destaque) **e com o mapa de layout** (posição, caos, fundo). Corrigir só o que diverge, **no mesmo chat**, uma correção por lâmina.

## 6. Entrega
- Conceitos e prompts como rascunho, com a frase do pedido do dono, onde e quando ele a disse.
- Nada publicado, agendado ou enviado a terceiros sem aprovação explícita do dono.
- Referências baixadas ficam na pasta de estudo do cliente, marcadas «só estudo».
