---
name: "cenas-editoriais"
description: "Catálogo de 31 técnicas de CENA para capas, posts e carrosséis editoriais (estilo revista e Efeito Prisma, capas e frames de cinema): manequins 3D encenando, silhueta chapada, figura em cor única na multidão, foto real em janela, recorte P&B sobre cor chapada, tiras de papel e palavras com fundo, palavra que colide com a figura ou sai do quadro, salto de escala, ilhas de texto fora da grade, explosão gráfica, pintura de domínio público creditada, letterbox e outras. Inclui a gramática de layout (lógica × caos, 9 tipos), o bloco de prompt LAYOUT E CAOS e o compositor determinístico compor_lamina.py. Cada técnica tem quando usar, prompt-modelo para ChatGPT e armadilhas, mais o vocabulário de câmera (plano, ângulo, lente, luz, cor) que o rea-post mede. Use depois de definir o conceito do post (skill rea-post-estatico) e antes de escrever o prompt de cada lâmina, para qualquer cliente."
---

# cenas-editoriais · técnicas de cena com prompt

**Arquivos desta skill:** `BLOCO-PROMPT-LAYOUT-CAOS.txt` (colar em todo prompt de lâmina) · `compor_lamina.py` + `compor_lamina-exemplo.json` (composição por código).
**Detector:** o `rea-post` marca a técnica provável de cada lâmina (`tecnicas`) e a linguagem de câmera (`cena`, via CinemaCLIP).

## Como escolher
1. Comece pelo **conceito do post** (tema → mundo do leitor → dispositivo visual, skill `rea-post-estatico`).
2. Para cada lâmina, escolha **uma** técnica que diga o que o texto da lâmina diz. Uma técnica não se repete em lâminas seguidas e o carrossel usa 4–6 técnicas/meios diferentes.
3. Prefira, nesta ordem: **obra real de domínio público com crédito** → **foto documental** (licenciada ou gerada sem rosto de pessoa real) → **figurante neutro** (manequim, silhueta, ilustração de linha) → objeto. Nunca «modelo bonito de IA» como protagonista.
4. O texto fica fora da imagem gerada: a tipografia entra depois, no sistema da marca, com `compor_lamina.py`. Exceção: capa ou lâmina com ≤ 12 palavras em que a palavra precisa interagir com a cena.
5. Junto com a técnica, escolha o **layout** (L1–L9) e o **elemento de caos** da lâmina (seção «Layout: lógica × caos» abaixo).

## Tabela rápida (quando usar)
| Técnica | Diz | Bom para |
|---|---|---|
| Manequins 3D brancos foscos encenando | «qualquer um de nós nesta situação» | debate, reunião, plateia, fila, comportamento de grupo |
| Figura em cor única na multidão | «uma vida visível no meio de muitas» | testemunho, exceção, fidelidade, fecho |
| Foto real dentro de janela/moldura | «o mundo lá fora, observado» | cotidiano, cidade, transporte, internet |
| Recorte P&B (retícula) sobre cor chapada | «esta pessoa importa, peso de revista» | personagem histórico (gravura/retrato de domínio público), mãos |
| Tiras de papel com palavras | «manchete, ironia, termo citado» | capa provocativa, conceito de um autor |
| Explosão gráfica entre dois rostos | «conflito, nós × eles» | polarização, discussão (1 vez por carrossel) |
| Janelas de navegador sobre papel quadriculado | «muitas vozes, abas abertas» | cultura, opiniões, notícias, citações em série |
| Pintura de domínio público creditada (escurecida, letterbox, borda rasgada, detalhe ampliado) | «a cena bíblica/histórica real» | narrativa bíblica, tradição |
| Objeto-metáfora recortado | «o objeto carrega o argumento» | 1 por carrossel no máximo, nunca como receita de capa |
| Textura material em tela cheia | «a matéria é o tema» | pausa de 5–15 palavras (pó, pele, pão, pedra, água) |
| Diagrama/cartografia em papel milimetrado | «documento, origem, território» | criação, corpo, história |
| Card chapado com grade fina | «virada, pausa» | argumento central, fecho |
| Papel datilografado / caixa cinza | «documento, definição, pergunta-tese» | etimologia, catecismo, confissão |
| Faixas pretas de cinema (letterbox) | «cena de filme com legenda» | momento dramático com texto antes e depois |
| Gente comum em ilustração de linha | «todo mundo, a cultura» | lâmina-tese |
| Palco/concerto em degradê | «espetáculo, plateia» | culto-show, fama |
| Picote tracejado | «antes/depois, dito × vivido» | contraste em uma lâmina |
| Retícula halftone geral | «unidade entre fontes diferentes» | acabamento do carrossel inteiro |
| **Silhueta chapada** (pessoa só como forma branca/preta/cor) | «qualquer um, sem rosto» | personagem ilustrativo (pastor, aluno), ausência, testemunho visto de fora |
| **Silhueta preenchida com documento** | «o que está na cabeça dele» | mentalidade, cosmovisão, ansiedade, sobrecarga |
| **Palavra-cartaz em camadas com a figura** | «a palavra bate na cena» | capa e clímax, 1–3 palavras |
| **Palavra que sai do quadro ou se parte** | «maior que a lâmina» | capa, conceito, fecho (máx. 2 por carrossel) |
| **Salto de escala gigante × miúdo** | «isto é imagem, aquilo é documento» | capa (obrigatório), citação-âncora, clímax |
| **Ilhas de texto fora da grade** | «várias vozes ao mesmo tempo» | montagem paralela, timeline, comentários |
| **Palavras com fundo** (etiqueta, caixa, barra, faixa) | «a palavra tem papel próprio» | texto sobre foto cheia, frase citada, título |
| **Objeto/figura que invade pela borda** | «o mundo continua fora do quadro» | objeto-metáfora, mãos, plateia; tirar o ar de template |
| **Foto que se dissolve no papel** | «memória que apaga» | passado, lembrança, transição calma |
| **Colagem com borda de papel e rasgo** | «dois mundos se encontram» | criação, matéria, clássico × atual (borda só em objeto/obra) |
| **Suporte físico fotografado** (caderno, agenda, ficha) | «anotação, aplicação» | conclusão pessoal, oração, rotina |
| **Sinal gráfico de mão** (seta, colchete, sublinhado) | «ligue isto àquilo» | virada, ligação entre duas frases (1 por lâmina) |
| Termografia, raio-x, placar, verbete, cartão de ponto, bateria… (técnicas novas) | o que o tema pedir | inventar a partir do mundo do leitor e registrar aqui |

## Layout: lógica × caos (resumo da gramática de layout)
**A regra:** o caos mora na **imagem** (objetos cortados pela borda, colagem, multidão) e nas **palavras-cartaz de 1 a 3 palavras** (tiras inclinadas 2–6°, palavra atrás e na frente da figura, palavra que sai do quadro, escala de 6 a 14×). A lógica mora no **texto de leitura**: reto, alinhado à esquerda, margem fixa, nada por cima. Nas 40 lâminas do Prisma, 55% têm caos e nenhuma frase de leitura é inclinada ou coberta.
**Os 9 tipos:** L1 manchete-colisão · L2 topo calmo + cena que responde · L3 sanduíche (letterbox) · L4 card/pausa · L5 texto na área calma da imagem · L6 imagem domina, texto na base · L7 ilhas fora da grade · L8 coluna + objeto invasor · L9 vão central.
**Sequência:** nunca a mesma posição nem o mesmo layout em lâminas seguidas · topo ≤ 30% · ≥ 3 lâminas de caos, com caos máximo na capa e no clímax · leitura calma · ≥ 1 card · fundo troca ≥ 3 vezes · 1 salto de escala fora da capa · palavras: capa ≤ 8, imagem ≤ 45, card ≤ 50, lâmina com palavra gigante ≤ 25.
**Prompt:** colar `BLOCO-PROMPT-LAYOUT-CAOS.txt` preenchido em todo pedido de lâmina.

## Vocabulário de câmera (use no prompt; o rea-post mede o mesmo)
- **Plano:** detalhe/macro · close · plano médio · plano americano · plano geral · plano aberto/estabelecimento.
- **Altura/ângulo:** câmera alta (de cima), altura do olho, câmera baixa (contra-plongée), zenital, holandês (inclinado).
- **Lente:** grande-angular (espaço, distorção), normal 50 mm, teleobjetiva (compressão, fundo desfocado).
- **Luz:** dura × suave · lateral, de cima, contraluz, de baixo · chiaroscuro · luz de janela · neon/palco.
- **Cor:** monocromática, análoga, complementar (azul × amarelo), quente/fria, dessaturada, um único acento.
- **Composição:** terços, centro simétrico, diagonal, moldura dentro da moldura, espaço negativo grande, figura minúscula em cenário enorme.

## Prompt-modelo geral (ChatGPT, uma lâmina por vez)
```
Formato 1080×1440. [Meio]. [Técnica do catálogo] mostrando [cena concreta do mundo do post].
Câmera: [plano], [altura], [lente]. Luz: [tipo e direção]. Paleta: [2–3 cores] + destaque [hex].
Deixar [terço de cima/baixo] livre, fundo [liso/escuro/papel], para tipografia aplicada depois.
Sem texto, sem logotipos, sem rosto de pessoa real, sem contorno branco em recortes.
```
Os prompts específicos de cada técnica estão em catálogo estendido de técnicas.

## Armadilhas que já cometemos
- Repetir o mesmo cenário ou a mesma receita de capa em todas as lâminas.
- Pedir texto dentro da imagem (sai com erro).
- Pedir várias versões: uma versão só, corrigida no mesmo chat (manter continuidade do contexto).
- Colocar texto sempre no topo e fundo uniforme em todas as lâminas, ou deixar marca-texto cobrir pontuação.
