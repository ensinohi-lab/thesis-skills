// Rolagem suave com Lenis (Lusco: lerp 0,05) e um laço de rAF só para o que segue a rolagem.
// O laço dorme quando nada pede quadro novo e acorda no scroll. Com movimento reduzido, rolagem nativa.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const mq = matchMedia('(prefers-reduced-motion: reduce)');
export const reduzido = (): boolean => mq.matches;
export const lenis: Lenis | null = reduzido() ? null : new Lenis({ autoRaf: true, lerp: 0.05, wheelMultiplier: 0.8, touchMultiplier: 1.1 });
if (lenis) (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

type Passo = () => boolean;
const quem = new Set<Passo>();
let vivo = false;
function laco() {
  let mais = false;
  for (const f of quem) mais = f() || mais;
  if (mais) requestAnimationFrame(laco); else vivo = false;
}
export function acorda(): void { if (vivo) return; vivo = true; requestAnimationFrame(laco); }
/** fn roda a cada quadro enquanto a página rola; devolve true se ainda está suavizando */
export function rolagem(fn: Passo): void { quem.add(fn); acorda(); }

// .is-scrolling: rolando com o cursor parado, nenhum hover acende.
const html = document.documentElement;
let px = -1, py = -1;
addEventListener('scroll', () => { html.classList.add('is-scrolling'); acorda(); }, { passive: true });
addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  if (Math.abs(e.clientX - px) + Math.abs(e.clientY - py) > 2 && px >= 0) html.classList.remove('is-scrolling');
  px = e.clientX; py = e.clientY;
}, { passive: true });
addEventListener('touchstart', () => {}, { passive: true });
