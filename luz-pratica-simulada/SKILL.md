---
name: "luz-pratica-simulada"
description: "Simular em pós (vídeo e foto) a luz de estúdio caseiro dos tutoriais de iluminação: principal na diagonal com reluz do rosto, preenchimento quente, contorno, halo sunset na parede, abajur/prática motivada, teto apagado, fundo desfocado, temperatura igualada, short lighting, gobo, light leak, bloom. Use quando o criador (ou cliente) gravar Reels em casa sem equipamento de luz e quiser o visual de 'luz bonita', ou numa foto/capa que precise de luz quente localizada. Inclui o checklist de gravação para o software funcionar. CPU, offline, sem crédito."
---

# luz-pratica-simulada · gravar chapado, iluminar na edição

**Objetivo:** gravar com iluminação simples de ambiente e aplicar simulação de luz de estúdio na pós-produção.
**Estudo:** estudo local de referência de iluminação.
**Ferramenta de referência:** `luz-simulada` (CLI local `luz-simulada`, opcional). A skill vale sem ela: abaixo está o método para qualquer editor.

## 1. Antes de gravar (checklist para o software funcionar)
1. **Luz uniforme e suave**: janela de lado com cortina ou teto + abajur; nada de sol duro no rosto. Sombra dura gravada não se apaga depois.
2. **Uma só temperatura**: desligue as lâmpadas de outra cor. Mistura (janela fria + lâmpada amarela) atrapalha a correção.
3. **Afaste-se da parede 1–2 m**: separa o sujeito para máscara e profundidade e deixa a parede livre para o halo.
4. **Fundo simples e um pouco claro**: a parede clara recebe o halo e a prática; parede preta não «acende». Tire bagunça e tomadas do quadro (ou cubra com planta).
5. **Câmera travada** (tripé), sem zoom digital. Movimento de câmera faz a luz falsa «escorregar».
6. **4K ou 1080p com bitrate alto**, sem filtro de beleza, HDR desligado, exposição e foco travados (AE/AF lock). Não deixe estourar a testa.
7. **Rosto visível**: evite tapar a boca/face o tempo todo (caneca, mão). A reluz do rosto depende de achar o rosto.
8. **Não use roupa da cor do fundo** e evite cabelo solto sobre fundo da mesma cor (a borda vai sofrer).
9. Se houver abajur no cenário, **acenda-o fraco**: o software reforça uma luz que existe muito melhor do que inventa uma.
10. Grave 2 s parado no início: serve para estabilizar máscara e profundidade.

## 2. Escolher o visual (presets)
| Preset | Quando | Visual |
|---|---|---|
| `estudio-caseiro` | Talking head de tutorial, fundo com estante/quina | Principal na diagonal + preenchimento quente + contorno laranja + halo sunset + quina amarela, teto apagado |
| `fundo-motivado` | Plano fechado, parede lisa ou texturizada | Fundo escuro com degradê laranja do lado do abajur, desfoque de profundidade, rosto com volume |
| `abajur-cinema` | Clima noturno, cinema, depoimento íntimo | Uma prática quente, escuro, short lighting (lado do rosto voltado para a câmera na sombra) |

## 3. Rodar
```
luz-simulada apply gravacao.mp4 --preset estudio-caseiro -o saida.mp4
luz-simulada apply foto.jpg --preset abajur-cinema --lado direita -o foto-luz.jpg
luz-simulada lado-a-lado gravacao.mp4 saida.mp4 -o compara.mp4
luz-simulada lut --preset abajur-cinema -o abajur.cube     # só a cor, para CapCut/DaVinci/Premiere
```
Ajustes comuns: `--lado` (de onde vem a principal: lado da janela/abajur), `--halo-xy 0.2,0.3` e `--pratica-xy` (onde fica o halo/abajur, em fração do quadro), `--ambiente` (menor = mais escuro), `--desfoque`, `--gobo`, `--vazamento`, `--sem-halo`, `--sem-pratica`, `--set chave=valor`. Teste primeiro numa foto do vídeo (`--inicio 2 --fim 3` para um trecho), depois rode o vídeo todo. ~1,6 s por quadro em CPU de 8 núcleos a 720×1280.

## 4. Sem a ferramenta (qualquer editor)
Em DaVinci (grátis), CapCut, Premiere ou After Effects o método é o mesmo, em camadas:
1. **Máscara do sujeito** (CapCut «Remover fundo», Premiere «Object mask», Resolve Studio «Magic Mask», ou um MP4 de máscara gerado com `mascara-sujeito`). Suavize a borda 1–2 px.
2. **Teto apagado**: no fundo (máscara invertida), exposição −0,7 a −1,5 EV, contraste +10, saturação +15 a +25.
3. **Principal**: no sujeito, janela/power window com gradiente do lado da luz (+0,3 a +0,6 EV) e do outro lado −0,3 a −0,8 EV. No rosto, uma janela oval menor, mais forte, presa ao rastreio.
4. **Preenchimento**: lado da sombra levemente quente (+temperatura), não clareie demais (razão 3:1 a 4:1).
5. **Halo / prática**: na camada de fundo, círculo com degradê (miolo #ffa050 → #ff5a2a → borda #a8201e) em modo *Overlay/Soft light/Multiply sobre a parede* (não *Add*, que vira mancha). Ponha-o onde a luz «faria sentido» (atrás de um objeto, na quina).
6. **Contorno**: borda da máscara (stroke interno 3–8 px, desfoque) laranja em *Screen* do lado da luz traseira.
7. **Profundidade**: desfoque só no fundo (0,5–1 % da largura).
8. **Cor única**: aplique o `.cube` do preset ou equilibre tudo para o mesmo tom quente.
9. **Acabamento**: bloom leve nos pontos quentes, vinheta 20–40 %, grão fino.

## 5. Conferir (não entregar sem)
- Lado a lado com o original, rodando: a borda do cabelo treme? O halo «anda» com a pessoa? O rosto ficou sujo ou listrado?
- Na luma, o «depois» dos tutoriais fica 20–35 % mais escuro que o «antes», com os altos mais baixos; se ficou mais claro, não é o mesmo visual.
- Rosto de perfil ou tapado: a reluz do rosto cai sozinha para a de profundidade. Se ficar artificial, reduza `--principal`.
- Pele não pode ficar laranja: confira a cor da pele no rosto, não no fundo.

## 5b. O que denuncia luz falsa (lições de QA visual)
- **Halo de sunset não é bola.** A lâmpada projeta um disco ENORME rosa/magenta com um ANEL laranja-amarelo na borda e franja vermelha. Só cai na parede: prateleira, planta e pessoa ficam por cima (oclusão), e ele cai com a parede.
- **Luz é ganho, não cor por cima:** multiplique a parede/pele (Multiply/Soft light sobre o albedo, em linear), nunca Screen/Add sobre tudo.
- **Calor não é uniforme:** sombras neutras-frias, altos quentes; a cor quente só onde a luz quente cai.
- **Fundo escuro ≠ vinheta:** escureça por distância (o que está longe da luz principal recebe menos), mantenha o preto levemente levantado.
- **Auréola no cabelo** = máscara/profundidade vazando: refine a borda (filtro guiado) e refaça a profundidade da parede sem a pessoa.
- **Legenda queimada** não pode borrar nem brilhar: proteja-a.
- **Rosto:** sem sombra real do nariz, a reluz em 2,5D fica discreta. Para close de capa, IC-Light (GPU).

## 6. Limites e quando escalar
Reluz 2,5D: não cria a sombra certa do nariz nem a luz dura que contorna fios de cabelo. Para foto/capa de nível alto, IC-Light (Apache-2.0, precisa de GPU). Notebook pronto: `agency-tools/luz-simulada/colab/IC-Light-luz-simulada.ipynb` (Colab grátis, T4; usa a nossa máscara, devolve a textura original) — sempre com aprovação antes de usar serviço externo. Resolve Studio (Relight FX) e Beeble SwitchLight são pagos: não contratar sem aprovação. Nunca subir rosto de cliente em serviço de terceiros sem autorização.
