import CompLogo from "@/components/CompLogo";

// Portada de un torneo: el logo (o el trofeo) es el protagonista, grande, sobre una placa con un halo de luz que late
// y un brillo que lo cruza; al lado, el nombre, el país y la etapa. En el celular, todo centrado.
export default function TournamentHero({
  id,
  name,
  country,
  live,
  children,
}: {
  id: string;
  name: string;
  country: string;
  live?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="hero spotlight relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] text-white">
        <div aria-hidden className="offside-line pointer-events-none absolute -top-6 bottom-0 right-[18%] w-[3px] rotate-[8deg]" />
        <div aria-hidden className="checker pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-12 rounded-xl opacity-20 sm:h-36 sm:w-36" />
        <div className="relative flex flex-col items-center gap-6 px-6 py-9 text-center sm:flex-row sm:gap-10 sm:px-10 sm:py-12 sm:text-left">
          <div className="trophy-stage relative shrink-0">
            <div aria-hidden className="trophy-halo absolute inset-[-28%] rounded-full" />
            <div className="trophy-plate relative flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white sm:h-44 sm:w-44">
              <CompLogo id={id} size={120} className="trophy-float drop-shadow-[0_8px_16px_rgba(5,11,26,0.25)]" />
              <span aria-hidden className="trophy-sweep pointer-events-none absolute inset-0 rounded-[2rem]" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 ring-1 ring-volt-400/30 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400 shadow-[0_0_10px_2px_rgba(77,141,255,0.8)]" />
              {country}
              {live && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[0.65rem] tracking-wider text-white">En juego</span>}
            </div>
            <h1 className="hero-title text-shine font-display text-[2.7rem] font-black uppercase italic leading-[0.92] tracking-wide sm:text-7xl">{name}</h1>
            {children && <div className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-navy-100">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
