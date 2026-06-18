/*
 * DESIGN: Romantismo Celestial — hooks de parallax, tilt 3D e revelação
 * v3: lerp suave em todos os hooks, suporte touch mobile, sem travamentos
 */
import { useEffect, useRef } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Parallax vertical simples com lerp suave para evitar travamentos. */
export function useParallax(speed: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    let raf = 0;
    let current = 0;
    let target = 0;

    const calcTarget = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      target = -center * speed;
    };

    const animate = () => {
      current = lerp(current, target, 0.1);
      el.style.transform = `translate3d(0, ${current}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => { calcTarget(); };
    const onResize = () => { calcTarget(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    calcTarget();
    current = target; // inicializa sem animação
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

/**
 * Parallax X+Y com lerp suave.
 * Vertical: baseado no scroll. Horizontal: mouse (desktop) ou touch (mobile).
 * Lerp garante movimento fluido sem saltos.
 */
export function useParallaxXY(speedY: number, speedX: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    let raf = 0;
    let targetDx = 0, targetDy = 0;
    let currentDx = 0, currentDy = 0;

    const calcDy = () => {
      const rect = el.getBoundingClientRect();
      targetDy = -(rect.top + rect.height / 2 - window.innerHeight / 2) * speedY;
    };

    const animate = () => {
      currentDx = lerp(currentDx, targetDx, 0.06);
      currentDy = lerp(currentDy, targetDy, 0.1);
      el.style.transform = `translate3d(${currentDx}px, ${currentDy}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => { calcDy(); };
    const onMouse = (e: MouseEvent) => {
      targetDx = (e.clientX / window.innerWidth - 0.5) * 60 * speedX;
    };
    // Touch: movimento suave baseado na posição do toque
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      targetDx = (t.clientX / window.innerWidth - 0.5) * 40 * speedX;
    };
    const onTouchEnd = () => {
      // retorna ao centro suavemente
      targetDx = 0;
    };
    const onResize = () => { calcDy(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);

    calcDy();
    currentDy = targetDy; // inicializa sem salto
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [speedY, speedX]);

  return ref;
}

/**
 * Tilt 3D com lerp suave. Suporte a touch mobile (inclinação baseada no toque).
 */
export function useTilt3D(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    let raf = 0;
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;

    const animate = () => {
      currentRX = lerp(currentRX, targetRX, 0.07);
      currentRY = lerp(currentRY, targetRY, 0.07);
      el.style.transform = `perspective(900px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
      raf = requestAnimationFrame(animate);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRY = ((e.clientX - cx) / (rect.width / 2)) * intensity;
      targetRX = -((e.clientY - cy) / (rect.height / 2)) * intensity;
    };
    const onLeave = () => { targetRX = 0; targetRY = 0; };

    // Touch: leve inclinação baseada na posição do toque
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRY = ((t.clientX - cx) / (rect.width / 2)) * (intensity * 0.4);
      targetRX = -((t.clientY - cy) / (rect.height / 2)) * (intensity * 0.3);
    };
    const onTouchEnd = () => { targetRX = 0; targetRY = 0; };

    raf = requestAnimationFrame(animate);
    el.addEventListener("mousemove", onMouse);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMouse);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [intensity]);

  return ref;
}

/**
 * Scroll progress: retorna um ref e chama callback com valor 0→1
 * conforme o elemento atravessa a viewport.
 */
export function useScrollProgress(callback: (progress: number) => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1,
        1 - (rect.top / window.innerHeight)
      ));
      callback(progress);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [callback]);

  return ref;
}

/** Revela o elemento com fade + translateY quando entra na viewport. */
export function useReveal(delayMs = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { el.style.opacity = "1"; el.style.transform = "none"; return; }

    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = `opacity 0.9s cubic-bezier(0.23,1,0.32,1) ${delayMs}ms, transform 0.9s cubic-bezier(0.23,1,0.32,1) ${delayMs}ms`;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delayMs]);

  return ref;
}
