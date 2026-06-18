/*
 * DESIGN: Romantismo Celestial — v2 (parallax dinâmico)
 * Hero: tilt 3D + camadas de texto em profundidade Z diferente
 * Carta: texto com scroll-reveal progressivo, nebulosa em parallax X+Y
 * Timeline: cards 3D com tilt no hover
 * Razões: entrada em cascata com reveal staggered
 * Final: parallax dramático + constelação flutuante
 */
import StarField from "@/components/StarField";
import { useParallax, useParallaxXY, useReveal, useTilt3D } from "@/hooks/useParallax";
import { ChevronDown, Heart, Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const IMG = {
  hero:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663736077567/nGbZUZF8qeCgnMREFxZXLB/hero-cosmos-nomoon-KLgioGE75PQKp7LTBRUBsR.webp",
  nebula: "https://d2xsxph8kpxj0f.cloudfront.net/310519663736077567/nGbZUZF8qeCgnMREFxZXLB/nebula-section-Rrzm8ZWeMj6hqmVkqqAbJZ.webp",
  moon:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663736077567/nGbZUZF8qeCgnMREFxZXLB/moon-clean-fgCPLVtAe5kebU2JCeMBhr.webp",
  couple: "https://d2xsxph8kpxj0f.cloudfront.net/310519663736077567/nGbZUZF8qeCgnMREFxZXLB/couple-silhouette-RRUdSSpV9R2vYM2WVjVxZQ.webp",
  heart:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663736077567/nGbZUZF8qeCgnMREFxZXLB/constellation-heart-D5kyXsTBLBvXdYSH5zY5YS.webp",
};

const MEMORIES = [
  {
    img:   "/manus-storage/primeiro-encontro_793afade.png",
    title: "O primeiro encontro",
    text:  "O dia em que duas estrelas perdidas passaram a seguir a mesma órbita, e o universo deixou de parecer tão grande, porque eu encontrei você.",
    date:  "Onde tudo começou",
  },
  {
    img:   "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&q=80",
    title: "Nossas celebrações",
    text:  "Cada risada sua ilumina mais que qualquer estrela.",
    date:  "Momentos de alegria",
  },
  {
    img:   "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&q=80",
    title: "De mãos dadas",
    text:  "Ao seu lado, qualquer caminho vira destino.",
    date:  "Sempre juntos",
  },
  {
    img:   "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=900&q=80",
    title: "Nossos pores do sol",
    text:  "Colecionamos horizontes e sonhos a dois.",
    date:  "Aventuras",
  },
];

const REASONS = [
  "Seu sorriso, que desarma qualquer dia difícil",
  "O jeito que você cuida de tudo e de todos",
  "Nossas conversas que atravessam a madrugada",
  "A coragem com que você persegue seus sonhos",
  "O abraço que é o meu lugar favorito no mundo",
  "Por me fazer querer ser alguém melhor todos os dias",
];

/* ─── Reveal simples ─── */
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useReveal(delay);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ─── Card 3D com tilt no hover ─── */
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tRX = 0, tRY = 0, cRX = 0, cRY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cRX = lerp(cRX, tRX, 0.1);
      cRY = lerp(cRY, tRY, 0.1);
      el.style.transform = `perspective(700px) rotateX(${cRX}deg) rotateY(${cRY}deg) scale(1.02)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tRY = ((e.clientX - r.left) / r.width  - 0.5) * 14;
      tRX = -((e.clientY - r.top)  / r.height - 0.5) * 10;
    };
    const onLeave = () => {
      tRX = 0; tRY = 0;
      el.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
      cancelAnimationFrame(raf);
    };
    const onEnter = () => { raf = requestAnimationFrame(tick); };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform 0.15s ease-out" }}>
      {children}
    </div>
  );
}

/* ─── Texto com depth parallax (camadas Z no mouse) ─── */
function DepthText() {
  const layer1 = useRef<HTMLDivElement>(null); // fundo
  const layer2 = useRef<HTMLDivElement>(null); // meio
  const layer3 = useRef<HTMLDivElement>(null); // frente

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0;
    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth  - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      if (layer1.current) layer1.current.style.transform = `translate3d(${tx * -8}px, ${ty * -5}px, 0)`;
      if (layer2.current) layer2.current.style.transform = `translate3d(${tx * -18}px, ${ty * -12}px, 0)`;
      if (layer3.current) layer3.current.style.transform = `translate3d(${tx * -32}px, ${ty * -20}px, 0)`;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => { window.removeEventListener("mousemove", onMouse); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="relative flex flex-col items-center text-center" style={{ isolation: "isolate" }}>
      {/* Camada 1 — subtítulo atrás */}
      <div ref={layer1} className="will-change-transform">
        <p className="font-script text-glow-gold text-3xl text-gold-soft sm:text-4xl md:text-5xl">
          Para o amor da minha vida
        </p>
      </div>

      {/* Camada 2 — "Feliz Aniversário" no meio */}
      <div ref={layer2} className="mt-3 will-change-transform">
        <h1 className="font-display text-glow-gold text-5xl font-semibold leading-none text-foreground sm:text-6xl md:text-8xl">
          Feliz Aniversário
        </h1>
      </div>

      {/* Camada 3 — "Taissa" na frente, maior */}
      <div ref={layer3} className="will-change-transform">
        <h1 className="font-display text-glow-gold -mt-2 text-7xl font-semibold italic leading-none text-gold sm:text-8xl md:text-[10rem]">
          Taissa
        </h1>
      </div>

      <div className="mt-2 font-display text-3xl font-light italic text-gold-soft/80 sm:text-4xl">
        ✦ Com todo o meu amor ✦
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  const bgRef    = useParallax(-0.18);
  const moonRef  = useParallaxXY(0.22, 0.06);
  const tiltRef  = useTilt3D(6);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* fundo cósmico em parallax */}
      <div ref={bgRef} className="absolute -inset-y-32 inset-x-0 will-change-transform">
        <img src={IMG.hero} alt="" className="h-[130%] w-full object-cover" loading="eager" />
      </div>

      {/* lua em parallax X+Y */}
      <div ref={moonRef} className="absolute right-[4%] top-[8%] w-32 will-change-transform sm:w-44 md:w-56">
        <img src={IMG.moon} alt="" className="animate-pulse-glow w-full" style={{ filter: "drop-shadow(0 0 30px rgba(232,200,122,0.5)) drop-shadow(0 0 70px rgba(232,200,122,0.25))" }} />
      </div>

      {/* gradiente de saída */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-b from-transparent to-background" />

      {/* conteúdo com tilt 3D */}
      <div
        ref={tiltRef}
        className="relative z-10 px-6"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="text-center transition-all duration-1000"
          style={{ opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(50px)" }}
        >
          <DepthText />
          <div
            className="mt-10 transition-all duration-1000 delay-700"
            style={{ opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(30px)" }}
          >
            <p className="mx-auto max-w-md font-sans text-sm font-light tracking-[0.3em] text-foreground/60 uppercase">
              Uma viagem pelo cosmos das nossas memórias
            </p>
          </div>
          <div
            className="mt-12 flex flex-col items-center gap-2 text-gold/70 transition-all duration-1000 delay-1000"
            style={{ opacity: entered ? 1 : 0 }}
          >
            <span className="text-xs tracking-[0.25em] uppercase">Role para começar</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CARTA ─── */
function Letter() {
  const nebulaRef = useParallaxXY(-0.1, 0.04);
  const moonRef2  = useParallaxXY(0.15, -0.03);

  return (
    <section className="relative overflow-hidden py-36 md:py-52">
      {/* nebulosa em parallax X+Y */}
      <div ref={nebulaRef} className="absolute -inset-y-40 inset-x-0 opacity-55 will-change-transform">
        <img src={IMG.nebula} alt="" className="h-[140%] w-full object-cover" loading="lazy" />
      </div>
      {/* lua pequena decorativa */}
      <div ref={moonRef2} className="absolute -right-8 top-[15%] w-24 opacity-40 will-change-transform sm:w-32">
        <img src={IMG.moon} alt="" className="w-full"  />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center md:ml-[8%] md:text-left">
          <Reveal>
            <Sparkles className="mx-auto h-8 w-8 text-gold md:mx-0" />
            <h2 className="font-display mt-5 text-4xl font-medium italic text-gold-soft sm:text-5xl md:text-6xl">
              Hoje o céu celebra você,{" "}
              <span className="text-glow-gold text-gold">Taissa</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="gold-divider mx-auto mt-8 w-40 md:mx-0" />
            <p className="font-display mt-8 text-xl leading-relaxed text-foreground/85 sm:text-2xl">
              Dizem que cada estrela guarda uma história. Se for verdade, este céu
              inteiro não bastaria para guardar tudo o que vivemos, e tudo o que
              ainda vamos viver.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="font-display mt-6 text-xl leading-relaxed text-foreground/85 sm:text-2xl">
              Em um universo com cerca de 2 trilhões de galáxias, 200 sextilhões
              de sistemas solares e incontáveis planetas, entre 8 bilhões de
              pessoas espalhadas por 195 países e 6 continentes, a maior sorte da
              minha vida foi encontrar você.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <p className="font-display mt-6 text-xl leading-relaxed text-foreground/85 sm:text-2xl">
              Neste dia especial, quero que você saiba: entre bilhões de estrelas,
              galáxias e mundos possíveis, é ao seu lado que eu escolho estar.
              Sempre.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <p className="font-script mt-10 text-3xl text-rose-nebula sm:text-4xl">
              Com todo o amor do universo ✦
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── LINHA DO TEMPO ─── */
function Timeline() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="container relative z-10">
        <Reveal className="text-center">
          <p className="font-script text-3xl text-rose-nebula sm:text-4xl">Constelação de momentos</p>
          <h2 className="font-display text-glow-gold mt-3 text-4xl font-semibold text-foreground sm:text-5xl">
            Nossa História nas Estrelas
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* linha vertical dourada */}
          <div
            className="absolute left-4 top-0 hidden h-full w-px md:left-1/2 md:block"
            style={{
              background: "linear-gradient(180deg, transparent, oklch(0.84 0.1 85 / 55%) 10%, oklch(0.84 0.1 85 / 55%) 90%, transparent)",
            }}
          />

          <div className="space-y-24 md:space-y-32">
            {MEMORIES.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={m.title} delay={i * 80}>
                  <div className={`flex flex-col items-center gap-8 md:flex-row ${left ? "" : "md:flex-row-reverse"}`}>
                    {/* foto com card 3D */}
                    <div className="w-full md:w-1/2">
                      <Card3D className={`group relative mx-auto max-w-md overflow-hidden rounded-2xl border border-gold/25 shadow-[0_12px_60px_oklch(0.13_0.04_275/0.9)] ${left ? "md:mr-12 md:ml-auto" : "md:ml-12"}`}>
                        <img
                          src={m.img}
                          alt={m.title}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/85 via-transparent to-transparent" />
                        {/* brilho dourado no hover */}
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ background: "radial-gradient(ellipse at 50% 100%, oklch(0.84 0.1 85 / 15%), transparent 70%)" }} />
                        <span className="absolute bottom-3 left-4 font-sans text-xs tracking-[0.2em] text-gold-soft uppercase">
                          {m.date}
                        </span>
                      </Card3D>
                    </div>

                    {/* estrela central */}
                    <div className="relative hidden md:block">
                      <div className="absolute -inset-3 animate-pulse-glow rounded-full" />
                      <Star className="relative h-5 w-5 fill-gold text-gold drop-shadow-[0_0_12px_oklch(0.84_0.1_85)]" />
                    </div>

                    {/* texto */}
                    <div className={`w-full text-center md:w-1/2 ${left ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                      <h3 className="font-display text-3xl font-medium italic text-gold-soft sm:text-4xl">
                        {m.title}
                      </h3>
                      <p className="mt-3 font-sans text-base font-light leading-relaxed text-foreground/75">
                        {m.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-16 text-center">
          <p className="font-sans text-xs tracking-wide text-foreground/40">
            ✦ As fotos acima são ilustrativas — me envie as fotos de vocês para personalizar ✦
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── RAZÕES ─── */
function Reasons() {
  const nebulaRef = useParallaxXY(-0.07, -0.03);

  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div ref={nebulaRef} className="absolute -inset-y-40 inset-x-0 opacity-45 will-change-transform">
        <img src={IMG.nebula} alt="" className="h-[140%] w-full scale-x-[-1] object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl md:mr-[6%] md:ml-auto">
          <Reveal className="text-center md:text-right">
            <p className="font-script text-3xl text-rose-nebula sm:text-4xl">Algumas entre infinitas</p>
            <h2 className="font-display text-glow-gold mt-3 text-4xl font-semibold text-foreground sm:text-5xl">
              Razões para amar{" "}
              <span className="italic text-gold">você</span>
            </h2>
          </Reveal>

          <div className="mt-14 space-y-4">
            {REASONS.map((reason, i) => (
              <Reveal key={i} delay={i * 80}>
                <Card3D className="group flex items-center gap-5 rounded-xl border border-gold/15 bg-card/40 px-6 py-5 backdrop-blur-sm transition-colors duration-300 hover:border-gold/45 hover:bg-card/70">
                  <Heart className="h-5 w-5 shrink-0 fill-rose-nebula/60 text-rose-nebula transition-transform duration-300 group-hover:scale-125" />
                  <p className="font-display text-lg leading-snug text-foreground/90 sm:text-xl">
                    {reason}
                  </p>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL ─── */
function Finale() {
  const bgRef    = useParallax(-0.14);
  const heartRef = useParallaxXY(0.16, 0.05);
  const moonRef  = useParallaxXY(0.1, -0.04);

  return (
    <section className="relative flex min-h-screen items-end justify-center overflow-hidden">
      <div ref={bgRef} className="absolute -inset-y-32 inset-x-0 will-change-transform">
        <img src={IMG.couple} alt="" className="h-[130%] w-full object-cover" loading="lazy" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-midnight-deep/90 to-transparent" />

      {/* lua decorativa */}
      <div ref={moonRef} className="absolute left-[5%] top-[8%] w-20 opacity-50 will-change-transform sm:w-28">
        <img src={IMG.moon} alt="" className="w-full"  />
      </div>

      {/* coração de constelação em parallax */}
      <div ref={heartRef} className="absolute left-1/2 top-[10%] w-44 -translate-x-1/2 will-change-transform sm:w-60">
        <img
          src={IMG.heart}
          alt=""
          className="animate-float-slow w-full opacity-90"
          style={{ filter: "sepia(1) saturate(2.6) hue-rotate(-12deg) brightness(1.15)" }}
        />
      </div>

      <div className="relative z-10 px-6 pb-28 text-center md:pb-40">
        <Reveal>
          <h2 className="font-display text-glow-gold text-5xl font-semibold italic text-gold-soft sm:text-7xl md:text-8xl">
            Eu te amo,{" "}
            <span className="text-gold">Taissa</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-lg font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
            Que este novo ano da sua vida brilhe tanto quanto você faz a minha
            brilhar. Feliz aniversário, meu amor.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <p className="font-script mt-10 text-3xl text-gold sm:text-4xl">
            Com todo o meu coração ✦
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── ROOT ─── */
export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <StarField />
      <main className="relative z-10">
        <Hero />
        <Letter />
        <Timeline />
        <Reasons />
        <Finale />
      </main>
    </div>
  );
}
