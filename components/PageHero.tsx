// Portada de cada página, con la estética del logo: azul marino profundo, brillo azul eléctrico, la línea del offside
// (punteada y luminosa), las líneas de la cancha y la bandera a cuadros. El brillo sigue al mouse (Effects.tsx).
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
        {/* Cancha: círculo central y línea de medio campo en perspectiva */}
        <svg aria-hidden viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]">
          <path d="M-40 300 L240 120 L560 120 L840 300" fill="none" stroke="#7fb0ff" strokeWidth="1.5" />
          <ellipse cx="400" cy="205" rx="120" ry="34" fill="none" stroke="#7fb0ff" strokeWidth="1.5" />
          <path d="M400 120 V300" stroke="#7fb0ff" strokeWidth="1" />
        </svg>
        {/* Línea del offside */}
        <div aria-hidden className="offside-line pointer-events-none absolute -top-6 bottom-0 right-[22%] w-[3px] rotate-[8deg]" />
        {/* Bandera a cuadros */}
        <div aria-hidden className="checker pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-12 rounded-xl opacity-25 sm:h-36 sm:w-36" />
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-volt-500/25 blur-3xl" />
        <div className="relative px-6 py-8 sm:px-10 sm:py-11">
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 ring-1 ring-volt-400/30 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400 shadow-[0_0_10px_2px_rgba(77,141,255,0.8)]" />
              {eyebrow}
            </div>
          )}
          <h1 className="hero-title text-shine font-display text-[2.6rem] font-black uppercase italic leading-[0.95] tracking-wide sm:text-6xl">{title}</h1>
          {children && <div className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-navy-100 sm:text-base">{children}</div>}
        </div>
      </div>
    </section>
  );
}
