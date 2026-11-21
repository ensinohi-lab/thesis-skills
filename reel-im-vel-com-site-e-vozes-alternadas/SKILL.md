---
name: Reel imóvel com site e vozes alternadas
description: >-
  Use ao montar um Reel premium de imóvel ou loteamento a partir de narrações
  gravadas (uma ou duas vozes), quando o empreendimento tem site, masterplan ou
  artes-chave e a peça precisa de motion de verdade por script, não zoom em
  foto.
---
# Reel de imóvel com site e vozes alternadas

Método validado num Reel de loteamento aprovado pelo dono ("ficou muito bom"). Não é um molde visual: a técnica se repete e a aparência muda a cada peça.

## 0. Antes de tudo
1. Rode a skill `preflight-criativo-obrigat-rio`, seção 7 inclusive. Ela pede de 6 a 8 efeitos ou mais, de pelo menos 4 referências diferentes do acervo, e a tabela referência → plano → efeito escrita ANTES do render.
2. Liste os fatos liberados para a tela e o que fica de fora (preço, permuta, registro profissional, chamadas não confirmadas). Nada que contradiga a fala.
3. Use como base o modelo de Reel de imóvel aprovado (skill `reel-imovel-modelo-aprovado`). Dele vêm a edição por script quadro a quadro (Python/PIL/OpenCV → FFmpeg), a área segura, o sistema tipográfico por área e o mix.

## 1. Vozes
1. Transcreva cada gravação com WhisperX (alinhamento por palavra). Para saber qual voz é masculina e qual é feminina, use a F0 mediana (pYIN).
2. Com duas vozes lendo o roteiro inteiro, alterne frase a frase, de preferência como diálogo pergunta → resposta. Abra e feche com a voz que soar melhor no gancho e no CTA.
3. Corte nas pausas, sempre em frases inteiras. NUNCA acelere a voz. Só iguale a loudness entre as vozes.
4. A voz define o tempo. Encaixe a primeira palavra forte perto do drop da trilha e corte as imagens nas batidas.

## 2. Material
- **Site do empreendimento:** grave a tela rolando com Chrome headless (390×844 a 2x, rolagem programada). Antes de gravar, esconda os preços (nós de texto com "R$") e os botões flutuantes. Apresente num celular 3D com sombra e com um toque guiando o olhar.
- **Masterplan:** se houver geometria real dos lotes, faça os lotes acenderem na cor da campanha, ligados por linhas e com um contador. Deixe o mapa sair da moldura do celular.
- **Fotos e artes:** use artes-chave compostas e fotos boas. Filmagem crua do terreno entra só como corte rápido ou referência, nunca como plano principal.
- **Paleta e tipografia:** as mesmas do carrossel ou da peça estática aprovada da campanha, para a campanha ser uma só.

## 3. Vocabulário de efeitos que funcionou
- fotos em formato de postal entrando em pop;
- título que embaralha e trava;
- fenda que fecha em degraus;
- faixas que entram com atraso, com flash no drop;
- giz ou traço se desenhando sobre a foto, com o selo "ilustração";
- texto atrás de um objeto recortado, com camadas em velocidades diferentes;
- site no celular 3D;
- mapa saindo da moldura;
- lotes acendendo, com contador;
- lista que avança com a fala;
- CTA digitado num campo de comentário;
- tipografia cinética em TODAS as falas, saindo do desfocado para o nítido.

Zoom lento em foto parada não conta como motion.

## 4. Mix e exportação
- Ducking da trilha sob a voz, SFX gratuitos nas transições, −14 LUFS e pico até cerca de −1,5 dBFS.
- 1080×1920 a 60 fps, H.264, e uma prévia 720p com menos de 25 MB.
- Um `render.sh` que refaz tudo e a fonte editável na pasta `fonte/`.

## 5. QA antes de entregar
- Folha de contato com 12 quadros e a folha `qa/referencias-vs-peca.jpg`.
- Transcrição do arquivo final conferida contra o roteiro.
- Nenhum texto fora da área segura, conferido por caixas de tinta.
- Logos inteiros, conferidos contra o arquivo mestre.
- **Ouça** a mix e a pronúncia de nomes próprios. A transcrição pode ouvir errado um nome de marca. Se o erro estiver na gravação, avise o dono.
- Confira se algum texto do site fica legível quando alguém pausa o vídeo e se esse texto está nos fatos liberados.
- Seja crítico: refaça o que estiver fraco antes de entregar. Entregue a prévia com a lista do que foi usado e com a autocrítica, e pare. Só o dono aprova e publica.

## 6. Depois da aprovação
Registre a frase de aprovação no REVISOES.md, crie um registro no Palácio Mental (Métodos aprovados) e atualize esta skill se algo novo funcionou.
