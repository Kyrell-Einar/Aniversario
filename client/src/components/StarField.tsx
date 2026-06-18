/*
 * DESIGN: Romantismo Celestial — campo de estrelas 5 camadas + poeira cósmica
 * v3: lerp suave em todas as camadas, suporte touch mobile
 * Camadas mais distantes: lentas, azuladas. Próximas: rápidas, douradas.
 */
import { useEffect, useMemo, useRef } from "react";

type Star = { x: number; y: number; size: number; delay: number; dur: number; minOp: number };
type Dust = { x: number; y: number; size: number; delay: number; dur: number; drift: number };

function rand(seed: { v: number }) {
  seed.v = (seed.v * 9301 + 49297) % 233280;
  return seed.v / 233280;
}

function makeStars(count: number, seed: number): Star[] {
  const s = { v: seed };
  return Array.from({ length: count }, () => ({
    x: rand(s) * 100,
    y: rand(s) * 200,
    size: 0.8 + rand(s) * 2.8,
    delay: rand(s) * 7,
    dur: 2 + rand(s) * 5,
    minOp: 0.1 + rand(s) * 0.4,
  }));
}

function makeDust(count: number, seed: number): Dust[] {
  const s = { v: seed };
  return Array.from({ length: count }, () => ({
    x: rand(s) * 100,
    y: rand(s) * 200,
    size: 1.5 + rand(s) * 3,
    delay: rand(s) * 10,
    dur: 8 + rand(s) * 12,
    drift: (rand(s) - 0.5) * 40,
  }));
}

const lerpFn = (a: number, b: number, t: number) => a + (b - a) * t;

interface StarLayerProps {
  count: number;
  seed: number;
  speedY: number;
  mouseX: number;
  mouseY: number;
  color?: string;
  glow?: number;
}

function StarLayer({ count, seed, speedY, mouseX, mouseY, color = "#fff", glow = 3 }: StarLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stars = useMemo(() => makeStars(count, seed), [count, seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollY = window.scrollY;
    let targetMx = 0, targetMy = 0;
    let currentMx = 0, currentMy = 0;
    let raf = 0;

    const animate = () => {
      // lerp suave — elimina travamentos e movimentos secos
      currentMx = lerpFn(currentMx, targetMx, 0.05);
      currentMy = lerpFn(currentMy, targetMy, 0.05);
      const dy = -scrollY * speedY + currentMy * mouseY;
      const dx = currentMx * mouseX;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => { scrollY = window.scrollY; };

    // Desktop: mouse
    const onMouse = (e: MouseEvent) => {
      targetMx = (e.clientX / window.innerWidth - 0.5) * 50;
      targetMy = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    // Mobile: touch com lerp — movimento suave em qualquer ponto da tela
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      targetMx = (t.clientX / window.innerWidth - 0.5) * 50;
      targetMy = (t.clientY / window.innerHeight - 0.5) * 30;
    };
    const onTouchEnd = () => {
      // retorna ao centro suavemente (não seca)
      targetMx = 0;
      targetMy = 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(raf);
    };
  }, [speedY, mouseX, mouseY]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform" style={{ height: "200%" }}>
      {stars.map((st, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full"
          style={{
            left: `${st.x}%`,
            top: `${st.y / 2}%`,
            width: st.size,
            height: st.size,
            background: color,
            boxShadow: `0 0 ${st.size * glow}px ${color}`,
            ["--tw-delay" as string]: `${st.delay}s`,
            ["--tw-dur" as string]: `${st.dur}s`,
            ["--tw-min-op" as string]: st.minOp,
          }}
        />
      ))}
    </div>
  );
}

function DustLayer({ count, seed, speedY, mouseX }: { count: number; seed: number; speedY: number; mouseX: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const dust = useMemo(() => makeDust(count, seed), [count, seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollY = window.scrollY;
    let targetMx = 0, currentMx = 0;
    let raf = 0;

    const animate = () => {
      currentMx = lerpFn(currentMx, targetMx, 0.05);
      el.style.transform = `translate3d(${currentMx * mouseX}px, ${-scrollY * speedY}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => { scrollY = window.scrollY; };
    const onMouse = (e: MouseEvent) => { targetMx = (e.clientX / window.innerWidth - 0.5) * 50; };
    const onTouchMove = (e: TouchEvent) => {
      targetMx = (e.touches[0].clientX / window.innerWidth - 0.5) * 50;
    };
    const onTouchEnd = () => { targetMx = 0; };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(raf);
    };
  }, [speedY, mouseX]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform" style={{ height: "200%" }}>
      {dust.map((d, i) => (
        <span
          key={i}
          className="animate-dust absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y / 2}%`,
            width: d.size,
            height: d.size,
            background: "oklch(0.84 0.1 85 / 30%)",
            ["--tw-delay" as string]: `${d.delay}s`,
            ["--tw-dur" as string]: `${d.dur}s`,
            ["--dust-drift" as string]: `${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Estrela cadente com posição e ângulo variados */
function ShootingStar({ top, right, delay, angle = -25 }: { top: string; right: string; delay: number; angle?: number }) {
  return (
    <div
      className="animate-shooting absolute will-change-transform"
      style={{ top, right, animationDelay: `${delay}s` }}
    >
      <div
        style={{
          width: "140px",
          height: "1.5px",
          transform: `rotate(${angle}deg)`,
          background: "linear-gradient(90deg, rgba(255,255,255,0.95), transparent)",
          boxShadow: "0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.3)",
        }}
      />
    </div>
  );
}

export default function StarField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Camada 1 — distante, azul-frio, muito lenta */}
      <StarLayer count={120} seed={11}  speedY={0.03} mouseX={0.08} mouseY={0.05} color="#b8c8ff" glow={2} />
      {/* Camada 2 — distante, branca, lenta */}
      <StarLayer count={80}  seed={42}  speedY={0.07} mouseX={0.18} mouseY={0.12} color="#e8eeff" glow={2.5} />
      {/* Camada 3 — média, branca brilhante */}
      <StarLayer count={50}  seed={73}  speedY={0.14} mouseX={0.35} mouseY={0.22} color="#ffffff" glow={4} />
      {/* Camada 4 — próxima, dourada */}
      <StarLayer count={30}  seed={99}  speedY={0.24} mouseX={0.6}  mouseY={0.4}  color="#e8c87a" glow={6} />
      {/* Camada 5 — muito próxima, rosa-dourada, rápida */}
      <StarLayer count={14}  seed={137} speedY={0.38} mouseX={1.0}  mouseY={0.65} color="#f0b8c8" glow={8} />
      {/* Poeira cósmica dourada flutuante */}
      <DustLayer count={22} seed={55} speedY={0.09} mouseX={0.25} />
      {/* Estrelas cadentes em posições e tempos diferentes */}
      <ShootingStar top="8%"  right="12%" delay={2}  angle={-22} />
      <ShootingStar top="18%" right="55%" delay={7}  angle={-30} />
      <ShootingStar top="5%"  right="30%" delay={13} angle={-18} />
      <ShootingStar top="25%" right="75%" delay={19} angle={-28} />
    </div>
  );
}
