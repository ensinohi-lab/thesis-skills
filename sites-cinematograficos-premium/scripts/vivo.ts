// vivo.ts — movimento contínuo em áreas que o cliente vê como "paradas" (origem: Estudo de Referência v2.2; Dono marcou 4 áreas estáticas no Android).
// [data-vivo]: recebe --pp (−1 → 1) enquanto passa pela tela (paralaxe pela rolagem, suavizado) e .is-vivo ao entrar.
// [data-inclina]: no mouse, a parede 3D inclina para o cursor (--tx/--ty); no toque não há hover para grudar.
// (os preços contam até o valor pelo contador que já existe em global.ts: data-conta + data-prefixo)
// "Reduzir movimento" (economia de bateria) NÃO desliga nada daqui: o CSS só encolhe os deslocamentos (--vivo-desloc).
import { rolagem } from './rolagem';

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

export function vivo(): void {
  const alvos = [...document.querySelectorAll<HTMLElement>('[data-vivo]')];
  if (!alvos.length) return;
  const atual = new Map<HTMLElement, number>(alvos.map(a => [a, NaN]));
  const passo = (): boolean => {
    let mais = false;
    const vh = innerHeight;
    for (const a of alvos) {
      const r = a.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
      const alvo = clamp(((vh - r.top) / (vh + r.height)) * 2 - 1);
      const v0 = atual.get(a)!;
      const v = Number.isNaN(v0) ? alvo : v0 + (alvo - v0) * 0.14;
      if (Math.abs(alvo - v) > 0.0015) mais = true;
      atual.set(a, v);
      a.style.setProperty('--pp', v.toFixed(4));
    }
    return mais;
  };
  rolagem(passo);

  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) {
      const el = e.target as HTMLElement;
      el.classList.add('is-vivo');
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  alvos.forEach(a => io.observe(a));

  // mouse sobre a parede: inclina (só com mouse de verdade; o toque não deixa estado preso)
  document.querySelectorAll<HTMLElement>('[data-inclina]').forEach(p => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, tx = 0, ty = 0;
    const aplica = () => { raf = 0; p.style.setProperty('--tx', tx.toFixed(3)); p.style.setProperty('--ty', ty.toFixed(3)); };
    p.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = p.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1); ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
      if (!raf) raf = requestAnimationFrame(aplica);
    });
    p.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(aplica); });
  });
}
