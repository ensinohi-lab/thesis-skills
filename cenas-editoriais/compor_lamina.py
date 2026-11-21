#!/usr/bin/env python3
"""compor_lamina.py · composição determinística de lâmina (fallback do ChatGPT).

Uso:  python3 compor_lamina.py especificacao.json saida.png
Quando usar: lâmina com muito texto, citação que não pode sair errada, obra real
(pintura, gravura, fac-símile) que o ChatGPT redesenharia, tiras/palavras-cartaz
em camadas com a figura.
Uso típico: lâmina onde a correção automática alterou a gravura ou o texto e exige composição exata por código.

Marcação no texto dos blocos:
  texto normal      -> voz de condução (serifa leve)
  **texto**         -> voz forte (grotesca pesada), pode começar no meio da frase
  ==texto==         -> marca-texto (barra de destaque); a barra NÃO pega pontuação
Camadas, na ordem da lista "camadas":
  {"tipo":"fundo","cor":"#0B0B0B"} | {"tipo":"fundo","imagem":"x.jpg","escurecer":0.3}
  {"tipo":"imagem","arquivo":"x.png","caixa":[x,y,w,h],"ajuste":"cobrir|conter",
     "dissolver":"topo|base|null","filtro":"pb|raiox|null","girar":0}
  {"tipo":"silhueta","arquivo":"x.png","cor":"#FFFFFF","caixa":[...]}   (PNG com alfa)
  {"tipo":"tira","texto":"DE MAIS","x":..,"y":..,"altura":160,"angulo":-3,
     "fundo":"#FFFFFF","cor":"#0B0B0B","reticula":false}
  {"tipo":"palavra","texto":"NÓS","x":..,"y":..,"altura":220,"cor":"#C9C6F5","angulo":-4}
  {"tipo":"bloco","texto":"...","x":90,"y":120,"largura":900,"corpo":50,"cor":"#F4EBDD",
     "destaque":"#FF8A1F","alinhar":"esq|centro"}
  {"tipo":"grade","cor":"#FFFFFF","opacidade":0.12,"passo":36}
  {"tipo":"picote","y":560,"cor":"#0B0B0B"}
  {"tipo":"credito","texto":"...","canto":"ie|id|se|sd"}
  {"tipo":"assinatura","texto":"Assinatura da Marca"}
  {"tipo":"reticula","opacidade":0.10}  {"tipo":"grao","forca":8}
Uma figura que «morde» a palavra: ponha "palavra"/"tira" ANTES da "imagem" recortada
(fica atrás) e outra DEPOIS (fica na frente).
"""
import json, re, sys, glob, random
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter, ImageChops
import numpy as np

G = '/usr/share/fonts/truetype/sand-box/google/'
def _f(pat):
    fs = sorted(glob.glob(G + pat)); return fs[0] if fs else None
FONTES = {
    'serifa': (_f('Newsreader/Newsreader-VariableFont*.ttf'), 'Light'),
    'forte': (_f('Inter Tight/InterTight-VariableFont*.ttf'), 'Black'),
    'leve': (_f('Inter Tight/InterTight-VariableFont*.ttf'), 'Regular'),
    'cartaz': (_f('Anton/Anton-Regular.ttf'), None),
    'mono': (_f('IBM Plex Mono/IBMPlexMono-Regular.ttf'), None),
    'italico': (_f('Newsreader/Newsreader-Italic*.ttf'), 'Italic'),
}
def fonte(voz, tam):
    p, var = FONTES[voz]; f = ImageFont.truetype(p, int(tam))
    if var:
        try: f.set_variation_by_name(var)
        except Exception:
            try: f.set_variation_by_axes([{'Light': 300, 'Black': 850, 'Regular': 400, 'Italic': 400}[var]])
            except Exception: pass
    return f
def cor(h, a=255):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (a,)

PONT = '.,;:!?»«"“”’\'()…'
def tokens(texto):
    """Divide em palavras com estilo: (palavra, forte, destaque)."""
    out = []; forte = dest = False
    for parte in re.split(r'(\*\*|==)', texto):
        if parte == '**': forte = not forte; continue
        if parte == '==': dest = not dest; continue
        for i, w in enumerate(re.split(r'(\s+)', parte)):
            if w == '' : continue
            if w.isspace():
                if '\n' in w: out.extend([('\n', False, False)] * w.count('\n'))
                else: out.append((' ', forte, dest))
            else: out.append((w, forte, dest))
    return out

def bloco(img, c):
    d = ImageDraw.Draw(img); x0, y = c['x'], c['y']; W = c['largura']
    corpo = c.get('corpo', 50); razao = c.get('razao', 1.65)
    fs = fonte('serifa', corpo); ff = fonte('forte', corpo * razao * 0.82)
    cor_t = cor(c.get('cor', '#F4EBDD')); cor_d = cor(c.get('destaque', '#FF8A1F'))
    cor_sobre = cor(c.get('cor_sobre_destaque', '#0B0B0B'))
    linhas = []; atual = []; larg = 0
    for w, forte, dest in tokens(c['texto']):
        if w == '\n':
            linhas.append(atual); atual = []; larg = 0; continue
        f = ff if forte else fs; lw = d.textlength(w, font=f)
        if w != ' ' and larg + lw > W and atual:
            while atual and atual[-1][0] == ' ': atual.pop()
            linhas.append(atual); atual = []; larg = 0
        if w == ' ' and not atual: continue
        atual.append((w, forte, dest, f, lw)); larg += lw
    linhas.append(atual)
    for ln in linhas:
        if not ln: y += corpo * 0.9; continue
        forte_linha = any(t[1] for t in ln if t[0] != ' ')
        alt = (ff.size if forte_linha else fs.size)
        lw_total = sum(t[4] for t in ln)
        x = x0 + (W - lw_total) / 2 if c.get('alinhar') == 'centro' else x0
        topo = max(t[3].getmetrics()[0] for t in ln)  # alinha as duas vozes pela linha de base
        dy = lambda f: topo - f.getmetrics()[0]
        # barras de destaque primeiro (só sobre letras, sem pontuação nas pontas)
        xx = x
        for i, (w, forte, dest, f, lw) in enumerate(ln):
            if dest and w != ' ':
                core = w.strip(PONT); a = w.find(core[:1]) if core else 0
                pre = d.textlength(w[:a], font=f); cw = d.textlength(core, font=f)
                asc, desc = f.getmetrics()
                # se a próxima palavra também é destaque, a barra cobre o espaço entre elas
                prox = ln[i+1] if i + 1 < len(ln) else None
                ext = prox[4] if (prox and prox[0] == ' ' and i + 2 < len(ln) and ln[i+2][2]) else 0
                pad = f.size * 0.08
                d.rectangle([xx + pre - pad, y + dy(f) + asc * 0.12, xx + pre + cw + pad + ext, y + dy(f) + asc + desc * 0.35], fill=cor_d)
            xx += lw
        xx = x
        for w, forte, dest, f, lw in ln:
            if w != ' ':
                if dest:
                    core = w.strip(PONT); a = w.find(core[:1]) if core else 0
                    yy = y + dy(f)
                    d.text((xx, yy), w[:a], font=f, fill=cor_t)
                    d.text((xx + d.textlength(w[:a], font=f), yy), core, font=f, fill=cor_sobre)
                    d.text((xx + d.textlength(w[:a] + core, font=f), yy), w[a+len(core):], font=f, fill=cor_t)
                else: d.text((xx, y + dy(f)), w, font=f, fill=cor_t)
            xx += lw
        y += alt * (1.12 if forte_linha else 1.28)
    return y

def carregar(arq, caixa, ajuste='cobrir'):
    im = Image.open(arq).convert('RGBA'); w, h = caixa[2], caixa[3]
    return ImageOps.fit(im, (w, h), Image.LANCZOS) if ajuste == 'cobrir' else ImageOps.contain(im, (w, h), Image.LANCZOS)

def raiox(im):
    a = np.asarray(ImageOps.autocontrast(im.convert('L'), cutoff=1), dtype=np.float32) / 255
    t = np.clip((1 - a - 0.15) / 0.75, 0, 1)[..., None] ** 0.8
    azul, lar = np.array([40, 120, 255]), np.array([255, 140, 30])
    col = np.where(t < .5, azul * (t / .5), azul + (lar - azul) * ((t - .5) / .5)) * (0.25 + 0.95 * t)
    out = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).convert('RGBA'); out.putalpha(im.getchannel('A')); return out

def dissolver(im, lado, frac=0.32):
    w, h = im.size; g = Image.linear_gradient('L').resize((w, int(h * frac)))
    ruido = Image.effect_noise((w, int(h * frac)), 40).convert('L')
    g = ImageChops.add(g, ruido, scale=1.6, offset=-40)
    m = Image.new('L', (w, h), 255)
    if lado == 'topo': m.paste(g, (0, 0))
    else: m.paste(ImageOps.flip(g), (0, h - int(h * frac)))
    im.putalpha(ImageChops.multiply(im.getchannel('A'), m)); return im

def texto_girado(txt, f, cor_t, fundo=None, pad=(0.25, 0.08), angulo=0, reticula=False):
    l, t, r, b = f.getbbox(txt); tw, th = r - l, b - t
    px, py = int(th * pad[0]), int(th * pad[1] + th * 0.12)
    im = Image.new('RGBA', (tw + 2 * px, th + 2 * py), cor(fundo) if fundo else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if fundo and reticula:
        for yy in range(0, im.height, 6):
            for xx in range(0, im.width, 6): d.ellipse([xx, yy, xx + 2, yy + 2], fill=(0, 0, 0, 40))
    d.text((px - l, py - t), txt, font=f, fill=cor_t)
    if fundo:  # borda levemente irregular de papel cortado
        a = np.asarray(im.getchannel('A')).copy(); rng = np.random.default_rng(3)
        for x in range(a.shape[1]):
            a[:rng.integers(0, 4), x] = 0; a[a.shape[0] - rng.integers(0, 4):, x] = 0
        im.putalpha(Image.fromarray(a))
    return im.rotate(angulo, expand=True, resample=Image.BICUBIC)

def compor(spec):
    W, H = spec.get('tamanho', [1080, 1440]); img = Image.new('RGBA', (W, H), (11, 11, 11, 255))
    for c in spec['camadas']:
        t = c['tipo']
        if t == 'fundo':
            if 'imagem' in c:
                im = carregar(c['imagem'], [0, 0, W, H])
                if c.get('escurecer'): im = Image.blend(im, Image.new('RGBA', im.size, (0, 0, 0, 255)), c['escurecer'])
                img.alpha_composite(im)
            else: img.alpha_composite(Image.new('RGBA', (W, H), cor(c['cor'])))
        elif t in ('imagem', 'silhueta'):
            cx = c['caixa']; im = carregar(c['arquivo'], cx, c.get('ajuste', 'cobrir'))
            if c.get('filtro') == 'pb': im = ImageOps.grayscale(im).convert('RGBA'); im.putalpha(carregar(c['arquivo'], cx, c.get('ajuste','cobrir')).getchannel('A'))
            if c.get('filtro') == 'raiox': im = raiox(im)
            if t == 'silhueta':
                sol = Image.new('RGBA', im.size, cor(c.get('cor', '#FFFFFF'))); sol.putalpha(im.getchannel('A')); im = sol
            if c.get('dissolver'): im = dissolver(im, c['dissolver'])
            if c.get('girar'): im = im.rotate(c['girar'], expand=True, resample=Image.BICUBIC)
            img.alpha_composite(im, (cx[0], cx[1]))
        elif t == 'tira':
            f = fonte(c.get('voz', 'cartaz'), c.get('altura', 160))
            im = texto_girado(c['texto'], f, cor(c.get('cor', '#0B0B0B')), c.get('fundo', '#FFFFFF'), angulo=c.get('angulo', -3), reticula=c.get('reticula', False))
            img.alpha_composite(im, (int(c['x']), int(c['y'])))
        elif t == 'palavra':
            f = fonte(c.get('voz', 'cartaz'), c.get('altura', 220))
            im = texto_girado(c['texto'], f, cor(c.get('cor', '#F4EBDD')), None, angulo=c.get('angulo', 0))
            img.alpha_composite(im, (int(c['x']), int(c['y'])))
        elif t == 'bloco':
            bloco(img, c)
        elif t == 'grade':
            g = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(g); a = int(255 * c.get('opacidade', 0.12)); p = c.get('passo', 36)
            for x in range(0, W, p): d.line([(x, 0), (x, H)], fill=cor(c.get('cor', '#FFFFFF'), a))
            for y in range(0, H, p): d.line([(0, y), (W, y)], fill=cor(c.get('cor', '#FFFFFF'), a))
            img.alpha_composite(g)
        elif t == 'picote':
            d = ImageDraw.Draw(img); y = c['y']
            for x in range(0, W, 22): d.line([(x, y), (x + 12, y)], fill=cor(c.get('cor', '#0B0B0B')), width=3)
        elif t in ('credito', 'assinatura'):
            d = ImageDraw.Draw(img)
            f = fonte('leve', c.get('corpo', 17)) if t == 'credito' else fonte('italico', c.get('corpo', 24))
            tw = d.textlength(c['texto'], font=f); m = spec.get('margem', 90)
            canto = c.get('canto', 'ie')
            x = m if canto[1] == 'e' else W - m - tw; y = H - 60 if canto[0] == 'i' else 40
            d.text((x, y), c['texto'], font=f, fill=cor(c.get('cor', '#F4EBDD'), int(255 * c.get('opacidade', 0.7))))
        elif t == 'reticula':
            g = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g)
            for y in range(0, H, 5):
                for x in range((y // 5) % 2 * 2, W, 5): d.point((x, y), fill=int(255 * c.get('opacidade', 0.1)))
            img.alpha_composite(Image.merge('RGBA', (Image.new('L', (W, H), 0),) * 3 + (g,)))
        elif t == 'grao':
            n = Image.effect_noise((W, H), c.get('forca', 8) * 4).convert('L')
            img = Image.blend(img, Image.merge('RGBA', (n, n, n, Image.new('L', (W, H), 255))), 0.06)
    return img.convert('RGB')

if __name__ == '__main__':
    spec = json.load(open(sys.argv[1])); compor(spec).save(sys.argv[2]); print('ok', sys.argv[2])
