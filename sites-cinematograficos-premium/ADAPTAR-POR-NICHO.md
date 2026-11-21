# Adaptar por nicho e mercado

O método se repete: portões, spike, filme reversível, upscale e interpolação, escada, vigia, provas, release. **O resto muda inteiro a cada cliente:** conceito, set, paleta, tipos, componentes, movimentos, seções e CTA. O Estudo de Referência é a prova de que o método funciona, não um molde. Cópia de mesa verde, papel bege, fita bordô ou "Thesis°" em outro site é erro.

## 1. Como escolher, sem copiar
1. **Comece pelo que o cliente já tem:** fotos reais, logo, kit de marca e peças aprovadas (`SISTEMA-MARCA.md` da marca). Isso responde "qual é o set do filme?".
2. **Escolha 1 base + 1 ou 2 complementos nas referências do dono:**
   - prompts do Profitize: profitize.com.br/build, em landing pages, design systems, componentes e motion (pela conta do dono, porque cada cópia gasta cota);
   - fichas do `palacio-mental/indice.json` e de `<referencias-ferramentas>/`;
   - imagens que o cliente manda.
   - Para cada um, faça a tabela "o que se pega / o que NÃO se pega", como no `FICHA-DIRECAO.md` do caso Thesis: "Lusco: pega a estrutura; não pega o P&B nem as pílulas".
3. **Monte o painel de 12 referências** com a paleta em hex. O dono aprova ★.
4. **Pergunte o que é verdade no negócio:** preços, depoimentos reais, horários, endereço, fotos da equipe. Nada se inventa.
5. **Defina a ação principal do site** (WhatsApp, agenda, cardápio, visita, consulta, compra). Todo o filme e todos os componentes servem a ela.
6. **A ousadia fica num lugar só** (o "momento herói"), e o resto é contido e vivo.

### Perguntas que trocam tudo (responda no BRIEF)
| Pergunta | Muda |
|---|---|
| O que o cliente vende de verdade? (serviço, produto, confiança, desejo) | o que o filme mostra |
| Qual é o "set" físico ou simbólico da marca? | os quadros-chave K0…Kn |
| Qual é a emoção do público ao chegar? (pressa, cuidado, luxo, medo, fome) | ritmo, luz e paleta |
| Onde o público decide? (celular, WhatsApp, Instagram) | celular primeiro, CTA fixo, peso do filme |
| O que é prova? (antes e depois, avaliações, CRM/OAB/CRECI, portfólio) | seções de prova e o que é proibido mostrar |
| O que a lei ou o conselho de classe proíbe? | texto, imagens, promessas |

---

## 2. Exemplo completo: salão de beleza
Esta é uma sugestão para levar ao dono. Tudo passa pelos portões. Se a marca já possuir `SISTEMA-MARCA.md`, comece por ele para extrair paleta, tipografia, serviços comprovados e frases oficiais.

### Conceito em uma frase
"Um ritual de cuidado em plano-sequência": a câmera atravessa o salão de manhã, com a luz entrando, e para em cada serviço como num close de beleza. Quem rola sente que está sendo atendida.

### Diferente do Thesis em tudo
| | Estudo de Referência | Salão |
|---|---|---|
| luz | tungstênio, noite, low-key | **manhã suave**, janela, high-key quente, reflexos de espelho |
| set | mesa de pedra, câmera, película | **bancada de mármore claro ou terrazzo, espelho redondo, pincéis, frascos de vidro, toalhas dobradas, flores, água** |
| paleta (sugestão; partir do kit do cliente) | breu, pedra, papel, bordô | **creme `#F4EDE6`, rosé `#D9A5A0`, vinho `#5E1F2B`, dourado `#C49A55` (só acento), grafite `#2A2426`** |
| tipografia | Inter 400 + Garamond + mono | **serifa display de alto contraste nos títulos** (ex.: Fraunces, Cormorant ou Playfair, conferindo a licença) + **sans humanista** no texto (ex.: DM Sans, Manrope); sem mono |
| forma | cantos 4 px, editorial | **cantos generosos e arcos** (janela em arco, pílula nos botões), linhas finas douradas |
| textura | grão de película, trepidação | **brilho suave (bloom), poeira de luz, vidro fosco**; sem grão de cinema |
| ritmo | lento, cinematográfico | **lento e macio**; pausas maiores; nada brusco |

### O filme (6 clipes, todos reversíveis)
Os quadros-chave saem no Nano Banana Pro a partir das fotos reais do salão, para manter a cor e os móveis verdadeiros.

| Clipe | De → para | Movimento | Seção |
|---|---|---|---|
| F1 Abrir | salão vazio na penumbra → luz da manhã entrando pela janela | a luz cresce, câmera parada e depois um push in leve | abertura + hero (só o nome) |
| F2 Bancada | plano geral → bancada com pincéis e frascos | dolly lateral, reflexo no espelho | manchete + "quem somos" |
| F3 Olhar | bancada → macro de pincel de sobrancelha e henna sobre um papel | órbita macro, foco que respira | serviços: sobrancelha, henna, micro |
| F4 Brilho | macro → mecha de cabelo com luz atravessando (luzes) | travelling lento, fio "flutuando" | serviços: cabelo e luzes |
| F5 Cuidado | cabelo → bacia de spa com pétalas e vapor quase parado | grua descendo | spa dos pés, bem-estar, preços |
| F6 Espelho | spa → espelho redondo com o salão refletido, a luz baixando | pull back | depoimentos, agenda, contato, rodapé |

**Proibido no filme:**
- rostos e pessoas em movimento (gente andando fica falsa ao contrário, e a imagem de clientes reais exige autorização);
- água caindo, fumaça subindo rápido, cabelo caindo;
- texto em frascos e embalagens (o gerador inventa letras);
- antes e depois gerado por IA: **nunca** (é enganoso; antes e depois só com foto real autorizada).

Bloco de estilo, a escrever em inglês e aprovar no painel: "soft morning window light, high-key warm, marble and glass, rose and wine accents, gentle bloom, slow continuous motion, nothing falls or pours, no people, no text, no logos".

### Seções e componentes (escolher nas referências aprovadas)
| Seção | Componente sugerido (tipo) | Movimento vivo, inclusive com reduzir movimento |
|---|---|---|
| Hero | nome grande sobre o filme; objeto-herói 3D opcional (ex.: frasco ou pincel inflado no Blender, ou o monograma em dourado) | letras por máscara; brilho dourado que segue o dedo e o cursor |
| Serviços | seletor interativo ou cartões em arco com foto real por serviço (tipo Interactive Selector do Profitize) | cartão abre ao toque; foto com zoom lento pela rolagem (`data-vivo`) |
| Preços / pacotes | tabela-âncora com "a partir de" (tipo Âncora) | números que contam; brilho que passa no cartão em destaque |
| Antes e depois (só fotos reais) | slider de comparação arrastável | arraste no dedo; dica animada até a 1ª interação |
| Equipe | cartões polaroide ou varal (fotos reais da equipe) | balanço leve pela rolagem |
| Depoimentos | parede 3D ou esteira de avaliações do Google (reais, com nome autorizado) | deriva contínua; inclina ao cursor |
| Instagram | esteira de posts reais | deriva + paralaxe |
| Agenda / CTA | botão fixo "Agendar no WhatsApp" + horários + mapa | botão com ímã e pulso discreto a cada 6 s; vidro só aqui |
| Rodapé | monograma em halftone ou linha dourada que se desenha | amostra o último quadro do filme |

### CTAs
- **Principal:** WhatsApp com mensagem pronta por serviço. Ex.: `https://wa.me/55DDDNUMERO?text=Oi! Quero agendar design de sobrancelhas`.
- **Secundário:** agenda online, se o salão usar (Trinks, Booksy, Avec, Google Reserve). Abre o link do sistema, sem formulário próprio.
- **Barra fixa no celular** com "Agendar", "Como chegar" e "Instagram".
- O preço aparece "a partir de", confirmado pelo dono.

### O que filmar ou gerar, e o que pedir ao cliente
- **Pedir ao cliente:** 10 a 20 fotos reais do salão com luz do dia (bancada, espelho, cadeiras, fachada), fotos de trabalhos (antes e depois autorizado), logo em SVG, lista de serviços com preços, 6 a 12 depoimentos reais, horários e endereço.
- **Gerar:** K0–K6 (Nano Banana) a partir das fotos e os clipes F1–F6 (Flow), com créditos aprovados.
- **Local:** upscale 4K, 36 fps e escada. Recortar 9:16 em `RECORTE_X` na bancada e no espelho.

### O que evitar
- Rosa-chiclete chapado, gradiente neon, cara de template de "beauty".
- Banco de imagem com modelo estrangeira; foto que não é do salão.
- Promessa de resultado ("rejuvenesça 10 anos"). Em procedimento estético, siga as regras de publicidade do conselho, se houver profissional de saúde.
- Filme pesado no 4G: celular no m720, começo da página ≤ 9 MB.
- Música automática.
- Pop-up de cupom na entrada.

---

## 3. Outros nichos (esboços)

### Restaurante / confeitaria
- **Conceito:** "da bancada à mesa". O filme acompanha o preparo, com farinha no ar quase parada, uma faca deslizando e o vapor lento, até o prato servido.
- **Reversível:** câmera em órbita no bolo e no prato, luz da cozinha. Evite calda escorrendo e líquido sendo servido, porque ao contrário fica estranho.
- **Paleta e tipos:** a da casa. Confeitaria: tons de massa e manteiga, com um acento de fruta. Bistrô: madeira e brasa. Uma serifa com personalidade, ou um script só no logo.
- **Componentes:**
  - cardápio por abas com foto real e preço;
  - esteira de pratos;
  - contador "pedidos hoje" (só se for real);
  - mapa e horário de funcionamento, com o "aberto agora" ao vivo.
- **CTAs:** pedir pelo WhatsApp ou iFood, reservar mesa (link do sistema da casa), encomenda de bolo com formulário curto.
- **Evitar:** foto de comida gerada por IA no cardápio (o prato servido tem de ser o real) e filme mais pesado que o cardápio.

### Imobiliária / corretor
- **Conceito:** "a visita em plano-sequência". Fachada → sala → varanda → vista, como um drone e um steadicam.
- **Reversível:** dolly e grua por ambientes, a luz do dia mudando. Use o vídeo e as fotos reais do imóvel. Na casa toda, use IA só para transições e céu. Os reels "postais" aprovados ficam em `modelos/MODELO-REEL-IMOVEL-POSTAIS.md` (método, não look).
- **Componentes:**
  - busca e filtros (bairro, quartos, preço);
  - cartão de imóvel com galeria de toque;
  - ficha com planta;
  - calculadora de financiamento;
  - mapa do bairro.
- **CTAs:** "agendar visita" no WhatsApp com o código do imóvel e captação de lead qualificada (skill `real-estate-lead-qualification`).
- **Evitar:** imóvel "melhorado" por IA (é enganoso), CRECI ausente e filme por imóvel (use 1 filme da marca + galerias).

### Clínica / estética
- **Conceito:** "precisão e acolhimento". Luz clínica suave, superfícies claras, instrumentos em macro sem sangue e sem agulha em close, a recepção acolhedora.
- **Reversível:** travelling pela recepção e órbita em objetos (frasco, aparelho).
- **Componentes:**
  - tratamentos por área (seletor);
  - equipe com CRM, CRO ou registro;
  - FAQ de segurança;
  - "como funciona" em passos;
  - convênios.
- **CTAs:** agendar avaliação (WhatsApp ou sistema), com localização e estacionamento.
- **Evitar:** antes e depois fora das regras do conselho, promessa de resultado, preço de procedimento médico onde for proibido e "reduzir movimento" travando a leitura (mantenha calmo).

### Advocacia / consultoria
- **Conceito:** "clareza que avança". Uma biblioteca ou um escritório em penumbra, papel, caneta-tinteiro, luz que se abre a cada área de atuação. Ou abstrato: linhas e camadas de vidro que se alinham.
- **Movimento:** contido, lento, com muito respiro. O filme pode ocupar só o hero e as transições, com o resto em folha clara. Tipografia serifada sóbria e números grandes.
- **Componentes:**
  - áreas de atuação (acordeão);
  - artigos e insights (blog com Progressive Blur);
  - equipe com OAB;
  - "como trabalhamos";
  - prova social institucional (sem promessas).
- **CTAs:** "agendar conversa" com formulário curto e WhatsApp.
- **Evitar:** o que a OAB veda na publicidade (captação, promessa de resultado, valores), stock de martelo e balança, e animação chamativa.

### Loja / e-commerce
- **Conceito:** "o produto como herói". Filme de produto em mesa giratória ou macro de material, e a coleção aparecendo pela rolagem.
- **Movimento:** órbita 360° do produto pela rolagem, que é o caso perfeito do scrub e combina com o 3D (GLB de fal.ai ou Blender). Paleta da marca.
- **Componentes:**
  - grade de produtos com hover e toque;
  - variações de cor que trocam o quadro do filme;
  - avaliações reais;
  - frete e prazo;
  - carrinho persistente.
- **CTAs:** comprar (plataforma: Shopify, Nuvemshop, Mercado Pago Checkout), com WhatsApp para dúvidas.
- **Evitar:** filme no lugar de foto de produto (a foto e o preço vêm primeiro), peso alto na listagem (filme só na home e na página da coleção) e checkout próprio sem necessidade.

---

## 4. Limites do método por nicho
- **Quando NÃO usar filme na rolagem:** sites de serviço urgente (pronto-socorro, guincho, delivery com pressa), públicos com rede muito ruim, e páginas de conteúdo longo (blog e documentação). Use um hero com loop curto e o resto leve.
- **Sem material real e sem créditos:** use o pôster parado com movimento CSS e componentes vivos (`vivo.ts`). O filme entra depois.
- **Sempre:** o celular primeiro, "reduzir movimento" = calmo, e as provas do `SKILL.md` F8.
