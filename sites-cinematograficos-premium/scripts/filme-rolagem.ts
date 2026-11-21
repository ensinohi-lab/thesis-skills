// ============================================================================================================
// filme-rolagem.ts — implementação de referência do "filme arrastado pela rolagem" (origem: Estudo de Referência v2.3,
// studiothesis.com.br, 16/11/2026). Genérico: os clipes e o fps vêm do HTML, não do código.
//   <div data-filme data-base="/filme/" data-clipes="F1 F2 F3" data-fps="36"><canvas></canvas></div>
//   cada seção marca onde o seu clipe começa: <section data-clipe="F2">…</section>
// Arquivos esperados em data-base (gerados por encode-degraus.sh): {ID}-{DEGRAU}.mp4 e {ID}-{DEGRAU}-ini|fim.avif|jpg
//   desktop 960 / 1280 / 1920 / 2560   ·   celular 540 / m720 / m1080
// Dependências: npm i mediabunny lenis  (+ rolagem.ts desta pasta). Diagnóstico no aparelho: ?diag=1
// Forçar: ?via=video (reserva <video>), ?q=m1080 (degrau), ?filme=poster (só pôster).
// Leia FILME-NA-ROLAGEM.md antes de mexer: cada regra abaixo custou uma rodada de correção.
// ============================================================================================================
// O FILME atrás da folha (plano-v2 §3): F1–F8 em sequência, arrastados pela rolagem, num canvas fixo.
// Cada seção marca o seu clipe com data-clipe="F3". v2.1: os trechos são CONTÍGUOS (o fim de um clipe é o começo do
// seguinte), então o filme anda em toda a página, para frente e para trás, sem trechos parados.
// Via principal: Mediabunny lê o MP4 all-intra e o VideoDecoder decodifica qualquer índice sozinho.
// v2.1 (Android): cada VideoFrame vira ImageBitmap e é FECHADO na hora. Segurar VideoFrames abertos esgota o pool
// do decodificador de hardware do Android (MediaCodec): ele para de soltar quadros sem dar erro e o filme congela.
// Vigia: decodificador que não devolve quadro em 1,5 s (ou dá erro) cai para o <video> (currentTime pela rolagem).
// Pôster só como último recurso (sem MP4) ou com ?filme=poster. "Reduzir movimento" NÃO desliga o filme: ele só
// anda quando a pessoa rola (não há movimento sozinho); no Android a economia de bateria liga esse sinal.
// Regra do spike: o canvas tem a resolução da FONTE (o CSS estica), nunca a da tela.
import { Input, MP4, BlobSource, EncodedPacketSink } from 'mediabunny';
import { rolagem, acorda, reduzido } from './rolagem';

const _raiz = typeof document !== 'undefined' ? document.querySelector<HTMLElement>('[data-filme]') : null;
const IDS: string[] = (_raiz?.dataset.clipes || 'F1 F2 F3 F4 F5 F6 F7 F8').trim().split(/\s+/);
const FPS = Number(_raiz?.dataset.fps || 36); // tem de bater com o FPS do encode-degraus.sh (36 = 12 interpolado 3×)
type Id = string;
type Player = { N: number; draw(f: number, vel: number): boolean; close(): void; travou?: boolean };
type Clipe = {
  id: Id; ini: number; fim: number; player: Player | null; carregando: boolean; blob?: Promise<Blob>;
  poster: { ini?: HTMLImageElement; fim?: HTMLImageElement };
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function filme(): void {
  const achado = document.querySelector<HTMLElement>('[data-filme]');
  if (!achado) return;
  const raiz: HTMLElement = achado;
  const canvas = raiz.querySelector('canvas')!;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const mobile = matchMedia('(max-width: 768px)').matches;
  const base = raiz.dataset.base || '/filme/';
  const params = new URLSearchParams(location.search);
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const economia = !!conn?.saveData; // economia de dados: só o clipe ativo baixa, sem adiantar o seguinte
  // v2.2 — degraus de qualidade (masters 4K por IA em v2/flow/4k, ver PIPELINE.md). v2.3: sem o 3840 (a interpolação a 36 fps em 4K não cabe na memória do box; o 2560 cobre até telas 1440p e Retina). Escolhe o menor degrau que cobre a
  // tela em pixels FÍSICOS (largura × DPR, e a altura convertida pela proporção, porque o filme cobre a tela toda).
  // Economia de dados: o menor. Rede lenta (3G/2G): um degrau abaixo. ?q=NOME força um degrau (testes).
  const DEGRAUS: [string, number, number][] = mobile
    ? [['540', 540, 960], ['m720', 720, 1280], ['m1080', 1080, 1920]]
    : [['960', 960, 540], ['1280', 1280, 720], ['1920', 1920, 1080], ['2560', 2560, 1440]];
  const dpr = Math.min(devicePixelRatio || 1, 3);
  const precisa = mobile ? Math.max(innerWidth * dpr, innerHeight * dpr * 9 / 16) : Math.max(innerWidth * dpr, innerHeight * dpr * 16 / 9);
  let qi = DEGRAUS.findIndex(d => d[1] >= precisa * 0.85);
  if (qi < 0) qi = DEGRAUS.length - 1;
  // v2.3: no celular o teto é o m720. Medido no Pixel 7 emulado (4G, CPU 4×): m1080 a 36 fps trocava 9 quadros/s com
  // 20% do tempo atrasado; m720 troca 11/s com 10% (decodifica 2,25× menos pixels) e na tela do celular quase não
  // perde nitidez (screens/v2/fluidez/nitidez/). ?q=m1080 ainda força o maior.
  if (mobile) qi = Math.min(qi, 1);
  if (economia) qi = 0;
  else if (/(^|-)?[23]g$/.test(conn?.effectiveType || '')) qi = Math.max(0, qi - 1);
  const forcado = DEGRAUS.findIndex(d => d[0] === params.get('q'));
  if (forcado >= 0) qi = forcado;
  let R = '', SRC = [0, 0], CACHE = 6;
  // bitmaps decodificados guardados: por orçamento de memória (o Android derruba a aba se passar), mínimo 6 quadros
  const usa = (k: number): void => {
    qi = k; R = DEGRAUS[k][0]; SRC = [DEGRAUS[k][1], DEGRAUS[k][2]];
    CACHE = Math.max(12, Math.floor((mobile ? 100e6 : 170e6) / (SRC[0] * SRC[1] * 4))); // v2.3: ≥ 2 GOPs (para trás)
  };
  usa(qi);
  const soPoster = params.get('filme') === 'poster';
  let via: 'webcodecs' | 'video' = params.get('via') === 'video' || !('VideoDecoder' in window) || !('createImageBitmap' in window) ? 'video' : 'webcodecs';
  const stats = {
    via: soPoster ? 'poster' : via, misses: 0, draws: [] as number[], bytes: 0, clipes: [] as string[], quedas: [] as string[],
    reduzido: reduzido(), economia, clipe: '', quadro: 0, mostra: -1, degrau: R, precisa: Math.round(precisa),
  };
  (window as unknown as { __filme?: unknown }).__filme = stats;

  const clipes: Clipe[] = IDS.map(id => ({ id, ini: 0, fim: 1, player: null, carregando: false, poster: {} }));

  // ---------- trechos de rolagem ----------
  let vh = innerHeight;
  const mede = (): void => {
    vh = innerHeight;
    for (const c of clipes) {
      const els = [...document.querySelectorAll<HTMLElement>(`[data-clipe~="${c.id}"]`)];
      if (!els.length) continue;
      const a = els[0].getBoundingClientRect();
      c.ini = Math.max(0, a.top + scrollY - vh / 2);
    }
    clipes[0].ini = 0;
    const max = document.documentElement.scrollHeight - vh;
    // contíguos: cada clipe vai até o começo do seguinte; o último termina no fim da rolagem (chega ao último quadro-chave)
    for (let k = 0; k < clipes.length; k++) {
      const c = clipes[k], prox = clipes[k + 1];
      c.fim = Math.max(c.ini + 1, prox ? prox.ini : max);
    }
    ultimo = -1;
  };
  const ativo = (y: number): { c: Clipe; p: number; i: number } => {
    let i = 0;
    for (let k = 0; k < clipes.length; k++) if (clipes[k].ini <= y) i = k;
    const c = clipes[i];
    return { c, p: clamp((y - c.ini) / (c.fim - c.ini)), i };
  };

  // ---------- canvas na resolução da fonte ----------
  const ajusta = (): void => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    const s = Math.max(w / SRC[0], h / SRC[1]);
    const k = Math.min(devicePixelRatio || 1, 3, 1 / s);
    const W = Math.round(w * k), H = Math.round(h * k);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    ultimo = -1;
  };
  const cobre = (src: CanvasImageSource, w: number, h: number): void => {
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / w, ch / h);
    ctx.drawImage(src, (cw - w * s) / 2, (ch - h * s) / 2, w * s, h * s);
  };

  // ---------- pôsteres ----------
  const poster = (c: Clipe, qual: 'ini' | 'fim'): HTMLImageElement => {
    let img = c.poster[qual];
    if (img) return img;
    img = new Image(); img.decoding = 'async';
    img.onload = () => { sujo = true; acorda(); };
    img.onerror = () => { if (!img!.src.endsWith('.jpg')) img!.src = `${base}${c.id}-${R}-${qual}.jpg`; };
    img.src = `${base}${c.id}-${R}-${qual}.avif`;
    c.poster[qual] = img;
    return img;
  };
  const desenhaPoster = (c: Clipe, p: number): boolean => {
    const img = poster(c, p < 0.5 ? 'ini' : 'fim');
    if (img.complete && img.naturalWidth) { cobre(img, img.naturalWidth, img.naturalHeight); return true; }
    return false;
  };

  // o MP4 baixa uma vez só por clipe e fica na memória (soltar o decodificador não pede o download de novo)
  const baixa = (c: Clipe): Promise<Blob> => (c.blob ??= fetch(`${base}${c.id}-${R}.mp4`).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.blob(); })
    .then(b => { stats.bytes += b.size; stats.clipes.push(c.id); return b; })
    .catch(e => { c.blob = undefined; throw e; }));

  // ---------- via WebCodecs (quadro → ImageBitmap, VideoFrame fechado na hora) ----------
  async function viaWebCodecs(c: Clipe): Promise<Player> {
    const blob = await baixa(c);
    const input = new Input({ formats: [MP4], source: new BlobSource(blob) });
    const track = (await input.getPrimaryVideoTrack())!;
    const config = (await track.getDecoderConfig())!;
    if (!(await VideoDecoder.isConfigSupported(config)).supported) throw new Error('codec');
    const chunks: EncodedVideoChunk[] = [];
    for await (const p of new EncodedPacketSink(track).packets()) chunks.push(p.toEncodedVideoChunk());
    const N = chunks.length, t0 = chunks[0].timestamp, dt = (chunks[1]?.timestamp ?? t0 + 1) - t0 || 1;
    // v2.3: MP4 com quadro-chave a cada GOP quadros (36 fps). chave[i] = o chave de que o quadro i depende.
    // (Um MP4 all-intra antigo continua funcionando: todo quadro é o próprio chave.)
    const chave = new Int32Array(N);
    for (let i = 0, k = 0; i < N; i++) { if (chunks[i].type === 'key') k = i; chave[i] = k; }
    const cache = new Map<number, ImageBitmap>(), pend = new Map<number, number>();
    let quer = 0, dir = 1, saida = 0, fechado = false;
    let prox = -1; // próximo quadro que continua a cadeia já alimentada sem voltar ao chave (−1 = precisa de chave)
    const player: Player = { N, draw, close, travou: false };
    const guarda = (i: number, bmp: ImageBitmap): void => {
      if (fechado) { bmp.close(); return; }
      cache.get(i)?.close(); cache.set(i, bmp);
      if (cache.size > CACHE) {
        const ks = [...cache.keys()].sort((x, y) => Math.abs(y - quer) - Math.abs(x - quer));
        for (const k of ks) { if (cache.size <= CACHE) break; cache.get(k)!.close(); cache.delete(k); }
      }
      sujo = true; acorda();
    };
    const dec = new VideoDecoder({
      output: f => {
        const i = Math.round((f.timestamp - t0) / dt);
        pend.delete(i); saida = performance.now();
        createImageBitmap(f).then(b => guarda(i, b), () => {}).finally(() => f.close());
      },
      error: e => { console.warn('[filme] decoder', e); player.travou = true; acorda(); },
    });
    // optimizeForLatency: o decodificador solta cada quadro assim que pode (sem flush, que obrigaria a voltar ao chave)
    dec.configure({ ...config, optimizeForLatency: true });
    const alimenta = (j: number): boolean => {
      try { dec.decode(chunks[j]); } catch { prox = -1; return false; } // pediu chave (depois de flush): recomeça a cadeia
      pend.set(j, performance.now()); prox = j + 1; return true;
    };
    const pede = (i: number): void => {
      if (i < 0 || i >= N || cache.has(i) || pend.has(i) || dec.state !== 'configured') return;
      if (pend.size > 14) return; // não empilha: o que importa é o quadro de agora
      const k = chave[i];
      // continua a cadeia (rolagem para a frente: 1 decodificação por quadro) ou recomeça no chave (para trás / salto)
      for (let j = prox > k && prox <= i ? prox : k; j <= i; j++) {
        if (alimenta(j)) continue;
        if (j === k) return; // nem o chave entrou: desiste neste quadro de tela
        j = k - 1; // a cadeia quebrou (flush): recomeça no chave
      }
    };
    let ultimaFlush = 0;
    function draw(f: number, vel: number): boolean {
      const i0 = Math.floor(f), a = f - i0;
      dir = i0 > quer ? 1 : i0 < quer ? -1 : dir; quer = i0;
      pede(i0); pede(i0 + dir); pede(i0 - dir);
      for (let k = 2; k <= (mobile ? 6 : 9); k++) pede(i0 + dir * k);
      // flush só se o decodificador segurar quadros parado (> 250 ms sem saída): depois dele a cadeia recomeça no chave
      const agora0 = performance.now();
      if (dec.state === 'configured' && dec.decodeQueueSize === 0 && pend.size && agora0 - saida > 250 && agora0 - ultimaFlush > 250) {
        ultimaFlush = agora0; prox = -1; dec.flush().catch(() => {});
      }
      // vigia: pedidos sem resposta há 1,5 s = decodificador parado (pool esgotado, GPU, codec) → reserva <video>
      const agora = performance.now();
      let maisVelho = agora;
      for (const t of pend.values()) maisVelho = Math.min(maisVelho, t);
      if (pend.size && agora - maisVelho > 1500 && agora - saida > 1500) { player.travou = true; }
      const A = cache.get(i0), B = cache.get(Math.min(N - 1, i0 + 1));
      if (A) {
        ctx.globalAlpha = 1; cobre(A, A.width, A.height); stats.mostra = i0;
        if (B && a > 0.02 && Math.abs(vel) < 0.8) { ctx.globalAlpha = a; cobre(B, B.width, B.height); ctx.globalAlpha = 1; }
        return true;
      }
      let best = -1, bd = 1e9;
      for (const k of cache.keys()) { const d = Math.abs(k - i0); if (d < bd) { bd = d; best = k; } }
      if (best >= 0) { const F = cache.get(best)!; cobre(F, F.width, F.height); stats.mostra = best; }
      stats.misses++;
      if (pend.size) esperando = true; // segue acordado até o quadro chegar (ou o vigia disparar)
      return best >= 0;
    }
    function close(): void { fechado = true; cache.forEach(b => b.close()); cache.clear(); try { dec.close(); } catch { /* já fechado */ } }
    return player;
  }

  // ---------- reserva: <video> com currentTime pela rolagem (Android e iOS) ----------
  async function viaVideo(c: Clipe): Promise<Player> {
    const blob = await baixa(c);
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    // no DOM (fora da tela): o iOS só pinta no canvas um vídeo que está no documento
    v.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
    raiz.append(v);
    const url = URL.createObjectURL(blob); v.src = url;
    await new Promise<void>((ok, erro) => {
      const t = setTimeout(() => (v.readyState >= 1 ? ok() : erro(new Error('timeout'))), 5000);
      v.addEventListener('loadeddata', () => { clearTimeout(t); ok(); }, { once: true });
      v.addEventListener('error', () => { clearTimeout(t); erro(v.error); }, { once: true });
      v.load();
    });
    // o iOS só decodifica depois de um play(): toca e pausa já (mudo, sem gesto)
    try { await v.play(); } catch { /* sem autoplay: o seek ainda decodifica no Android */ }
    v.pause();
    const fps = FPS, N = Math.max(2, Math.round(v.duration * fps));
    let ocupado = false, alvo = 0;
    const busca = (): void => { if (ocupado) return; ocupado = true; v.currentTime = alvo; };
    v.addEventListener('seeked', () => { ocupado = false; sujo = true; acorda(); if (Math.abs(v.currentTime - alvo) > 0.5 / fps) busca(); });
    return {
      N,
      draw(f) {
        alvo = Math.min(v.duration - 0.01, f / fps);
        if (Math.abs(v.currentTime - alvo) > 0.5 / fps) { busca(); stats.misses++; }
        if (v.readyState >= 2) { cobre(v, v.videoWidth, v.videoHeight); stats.mostra = Math.round(v.currentTime * fps); return true; }
        return false;
      },
      close() { v.removeAttribute('src'); v.load(); v.remove(); URL.revokeObjectURL(url); },
    };
  }

  const cai = (c: Clipe, motivo: string): void => {
    stats.quedas.push(`${c.id}:${motivo}`);
    console.warn('[filme] webcodecs falhou, indo para <video>', motivo);
    via = 'video'; stats.via = 'video';
    c.player?.close(); c.player = null;
    clipes.forEach(o => { if (o.player) { o.player.close(); o.player = null; } });
    carrega(c);
  };
  const carrega = (c: Clipe): void => {
    if (soPoster || c.player || c.carregando) return;
    c.carregando = true;
    const viaAgora = via;
    (viaAgora === 'webcodecs' ? viaWebCodecs(c) : viaVideo(c))
      .catch(e => {
        if (viaAgora !== 'webcodecs') throw e;
        stats.quedas.push(`${c.id}:${String(e?.message || e)}`); via = 'video'; stats.via = 'video'; return viaVideo(c);
      })
      .then(p => { c.player = p; sujo = true; acorda(); raiz.classList.add('is-pronto'); })
      .catch(e => { stats.quedas.push(`${c.id}:poster:${String(e?.message || e)}`); console.warn('[filme] sem vídeo, só pôster', e); })
      .finally(() => { c.carregando = false; });
  };
  // só o clipe ativo e os vizinhos ficam com decodificador; os outros soltam memória (o download fica no cache HTTP)
  const gerencia = (i: number, p: number): void => {
    clipes.forEach((c, k) => {
      const perto = k === i || (!economia && ((k === i + 1 && p > 0.15) || (k === i - 1 && p < 0.35)));
      if (perto) carrega(c);
      else if (c.player && Math.abs(k - i) > 1) { c.player.close(); c.player = null; }
    });
  };

  // ---------- laço ----------
  let suave = -1, ultimo = -1, sujo = true, ativoAntes = '', esperando = false;
  const passo = (): boolean => {
    const y = scrollY;
    suave = suave < 0 ? y : suave + (y - suave) * 0.35;
    if (Math.abs(y - suave) < 0.5) suave = y;
    const { c, p, i } = ativo(suave);
    const chave = `${i}:${p < 0.15 ? 0 : p < 0.35 ? 1 : 2}`;
    if (chave !== ativoAntes) { gerencia(i, p); ativoAntes = chave; }
    if (c.player?.travou && via === 'webcodecs') { cai(c, 'travou'); ativoAntes = ''; }
    const N = c.player?.N ?? 95;
    const f = i * 1000 + p * (N - 1);
    let seguir = false;
    if (sujo || Math.abs(f - ultimo) > 0.01) {
      const t = performance.now();
      const vel = ultimo < 0 ? 0 : f - ultimo;
      sujo = false; esperando = false;
      let ok = false;
      if (c.player) ok = c.player.draw(p * (N - 1), Math.abs(vel) > 900 ? 0 : vel);
      if (!ok) { stats.mostra = -1; ok = desenhaPoster(c, p); seguir = !!c.player || c.carregando; }
      if (ok) raiz.classList.add('is-desenhado');
      stats.draws.push(performance.now() - t);
      if (stats.draws.length > 600) stats.draws.splice(0, 300);
      stats.clipe = c.id; stats.quadro = Math.round(p * (N - 1));
      ultimo = f;
      if (esperando) { sujo = true; seguir = true; }
    }
    diag?.();
    return suave !== y || seguir;
  };

  // diagnóstico no aparelho: ?diag=1 mostra a via, os sinais do sistema e o quadro atual
  let diag: (() => void) | null = null;
  if (params.has('diag')) {
    const el = document.createElement('pre');
    el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;margin:0;padding:8px 10px;max-width:calc(100vw - 16px);white-space:pre-wrap;font:11px/1.35 ui-monospace,monospace;color:#0f0;background:rgba(0,0,0,.78);border-radius:8px;pointer-events:none';
    document.body.append(el);
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    diag = () => {
      el.textContent = `via ${stats.via} · ${stats.clipe} q${stats.quadro} · falhas ${stats.misses} · degrau ${R} (precisa ${stats.precisa} px) canvas ${canvas.width}×${canvas.height}\n` +
        `reduzir-movimento ${rm ? 'SIM' : 'não'} · economia-dados ${economia ? 'SIM' : 'não'} · VideoDecoder ${'VideoDecoder' in window ? 'sim' : 'NÃO'}\n` +
        `baixado ${(stats.bytes / 1e6).toFixed(1)} MB [${stats.clipes.join(' ')}] ${stats.quedas.length ? '· quedas ' + stats.quedas.join(', ') : ''}\n` +
        `vw ${innerWidth}×${innerHeight} dpr ${devicePixelRatio}`;
    };
  }

  ajusta(); mede();
  let rt = 0, larg = innerWidth, alt = innerHeight;
  const refaz = (): void => {
    // a barra de endereço do celular aparecendo/sumindo muda só a altura (< 160 px): não refaz o canvas por isso
    const so = innerWidth === larg && Math.abs(innerHeight - alt) < 160;
    cancelAnimationFrame(rt);
    rt = requestAnimationFrame(() => { if (!so) { ajusta(); larg = innerWidth; alt = innerHeight; } mede(); sujo = true; acorda(); });
  };
  addEventListener('resize', refaz, { passive: true });
  new ResizeObserver(refaz).observe(document.body);
  poster(clipes[0], 'ini');
  let comecou = false;
  const comeca = (): void => { if (comecou) return; comecou = true; mede(); rolagem(passo); };
  if (document.readyState === 'complete') comeca();
  else {
    addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(comeca, { timeout: 600 }) : setTimeout(comeca, 150)), { once: true });
    setTimeout(comeca, 2500); // celular com imagem pesada atrasando o load: o filme não espera
    addEventListener('scroll', comeca, { once: true, passive: true });
  }
  (window as unknown as { __filmeClipes?: unknown }).__filmeClipes = () => clipes.map(c => ({ id: c.id, ini: Math.round(c.ini), fim: Math.round(c.fim), pronto: !!c.player }));
}
