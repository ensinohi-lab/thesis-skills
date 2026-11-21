// medir-fluidez.mjs (origem: Estudo de Referência v2.3). Requer: npm i -D playwright; Chrome em /usr/bin/google-chrome
// (ou troque executablePath). O site precisa expor window.__filme (o filme-rolagem.ts já expõe).
// Mede a FLUIDEZ do filme como um celular médio vê: Pixel 7, 4G (9 Mb/s, 60 ms), CPU 4× mais lenta,
// "reduzir movimento" ligado, rolagem de dedo em ritmo de leitura (e um trecho para trás). Grava vídeo.
//   node scripts/v2-fluidez.mjs ROTULO [url] [dir] [celular|desktop]
// Métricas (amostra a cada quadro de tela, só enquanto a página se move):
//   poster%  = tempo mostrando pôster (o MP4 do clipe ainda não chegou / não decodificou)
//   atraso%  = tempo com o quadro mostrado ≥ 2 quadros longe do quadro pedido pela rolagem
//   trocas/s = quantas vezes por segundo a imagem do filme muda (vídeo fluido ≈ 24+)
//   parado   = maior tempo com a página andando e o filme sem mudar de quadro (ms)
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
const [,, rot = 'antes', url = 'http://127.0.0.1:4411/?intro=0&diag=1', dir = './medidas-fluidez', modo = 'celular'] = process.argv;
const cel = modo === 'celular';
mkdirSync(`${dir}/_tmp`, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', ...(cel ? ['--touch-events=enabled'] : [])] });
const px = devices['Pixel 7'];
const ctx = await b.newContext(cel ? { ...px, reducedMotion: 'reduce', recordVideo: { dir: `${dir}/_tmp`, size: px.viewport } }
  : { viewport: { width: 1920, height: 1080 }, recordVideo: { dir: `${dir}/_tmp`, size: { width: 1280, height: 720 } } });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
if (cel) {
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}
await p.addInitScript(() => {
  const A = []; window.__amostras = A; let antY = -1, ultMov = 0;
  const tick = t => {
    const f = window.__filme; const y = scrollY;
    if (y !== antY) ultMov = t; antY = y;
    if (f) A.push([Math.round(t), y, f.clipe, f.mostra, f.quadro, t - ultMov < 120 ? 1 : 0]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
const erros = []; p.on('pageerror', e => erros.push(e.message));
await p.goto(url, { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(4000);
const vp = cel ? px.viewport : { width: 1920, height: 1080 };
const espera = ms => new Promise(r => setTimeout(r, ms));
async function gesto(dy, ms) {
  if (!cel) { const n = Math.max(4, Math.round(ms / 16)); for (let i = 0; i < n; i++) { await p.mouse.wheel(0, -dy / n); await espera(16); } return; }
  const x = Math.round(vp.width * 0.62), y0 = Math.round(dy < 0 ? vp.height * 0.8 : vp.height * 0.2), n = Math.max(6, Math.round(ms / 16));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0, id: 1 }] });
  for (let i = 1; i <= n; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: Math.round(y0 + dy * i / n), id: 1 }] }); await espera(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const t0 = Date.now();
// ritmo de leitura: arrasta 320 px em ~0,6 s, solta, pausa curta. Desce até 60% da página, volta 6 gestos, desce mais um pouco.
let voltou = false;
while ((await p.evaluate(() => scrollY)) < H * 0.62 && Date.now() - t0 < 150000) {
  const y = await p.evaluate(() => scrollY);
  if (!voltou && y > H * 0.4) { voltou = true; for (let k = 0; k < 6; k++) { await gesto(320, 600); await p.waitForTimeout(250); } continue; }
  await gesto(-320, 600); await p.waitForTimeout(250);
}
await p.waitForTimeout(1500);
const A = await p.evaluate(() => window.__amostras);
const f = await p.evaluate(() => { const f = window.__filme; return { via: f.via, degrau: f.degrau, misses: f.misses, quedas: f.quedas, mb: +(f.bytes / 1e6).toFixed(1), clipes: f.clipes }; });
const trechos = await p.evaluate(() => window.__filmeClipes?.());
await ctx.close(); await b.close();
// métricas
const mov = A.filter(a => a[5]);
let poster = 0, atraso = 0, trocas = 0, parado = 0, desde = mov[0]?.[0] ?? 0, tMov = 0;
for (let i = 1; i < A.length; i++) {
  const a = A[i], ant = A[i - 1]; const dt = a[0] - ant[0];
  if (!a[5]) { desde = a[0]; continue; }
  tMov += dt;
  if (a[3] < 0) poster += dt; else if (Math.abs(a[3] - a[4]) >= 2) atraso += dt;
  if (a[2] !== ant[2] || a[3] !== ant[3]) { trocas++; desde = a[0]; } else parado = Math.max(parado, a[0] - desde);
}
const r = { rot, modo, url, erros, filme: f, trechos, segundosMovendo: +(tMov / 1000).toFixed(1),
  posterPct: +(100 * poster / tMov).toFixed(1), atrasoPct: +(100 * atraso / tMov).toFixed(1), trocasPorSeg: +(trocas / (tMov / 1000)).toFixed(1), paradoMaxMs: Math.round(parado),
  telaFps: +(mov.length / (tMov / 1000)).toFixed(1) };
const vid = readdirSync(`${dir}/_tmp`).filter(x => x.endsWith('.webm')).map(x => `${dir}/_tmp/${x}`).pop();
renameSync(vid, `${dir}/${rot}-${modo}.webm`); rmSync(`${dir}/_tmp`, { recursive: true, force: true });
writeFileSync(`${dir}/${rot}-${modo}.json`, JSON.stringify({ ...r, amostras: A }, null));
console.log(JSON.stringify(r));
