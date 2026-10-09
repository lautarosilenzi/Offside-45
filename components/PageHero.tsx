// Portada de cada página, con la estética del logo: azul marino profundo, brillo azul eléctrico y el fondo animado
// del 126 (HeroBackdrop). El brillo sigue al mouse (Effects.tsx).
import HeroBackdrop from "./HeroBackdrop";

export default function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="hero spotlight relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] text-white">
        <HeroBackdrop />
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-volt-500/25 blur-3xl" />
        <div className="relative px-5 py-6 sm:px-10 sm:py-9">
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 ring-1 ring-volt-400/30 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400 shadow-[0_0_10px_2px_rgba(77,141,255,0.8)]" />
              {eyebrow}
            </div>
          )}
          <h1 className="hero-title text-shine font-display text-[2.2rem] font-black uppercase italic leading-[0.95] tracking-wide sm:text-5xl">{title}</h1>
          {children && <div className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-navy-100 sm:text-base">{children}</div>}
        </div>
      </div>
    </section>
  );
}
