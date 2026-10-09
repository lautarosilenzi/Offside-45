import FavoriteButton from "@/components/account/FavoriteButton";
import CompLogo from "@/components/CompLogo";
import LOGOS from "@/lib/data/comps.generated.json";
import HeroBackdrop from "@/components/HeroBackdrop";

// Portada de un torneo, compacta para que lo importante (fixture, tablas) se vea rápido: el logo o el trofeo, sin
// recuadro, con un halo de luz detrás; al lado, el país, el nombre y una línea de descripción.
export default function TournamentHero({
  id,
  name,
  country,
  live,
  follow,
  children,
}: {
  id: string;
  name: string;
  country: string;
  live?: boolean;
  // Botón "Seguir" (en la portada del torneo; no en la de una edición vieja).
  follow?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="hero spotlight relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] text-white">
        <HeroBackdrop />
        <div className="relative flex items-center gap-4 px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
          <div className="trophy-stage relative shrink-0">
            <div aria-hidden className="trophy-halo absolute inset-[-30%] rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
              <CompLogo id={id} size={112} className="trophy-float !h-full !w-full" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400 shadow-[0_0_10px_2px_rgba(77,141,255,0.8)]" />
              {country}
              {live && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[0.65rem] tracking-wider text-white">En juego</span>}
            </div>
            <h1 className="hero-title text-shine font-display text-[1.9rem] font-black uppercase italic leading-[0.95] tracking-wide [overflow-wrap:anywhere] sm:text-5xl">{name}</h1>
            {children && <div className="mt-1.5 max-w-2xl text-sm leading-snug text-navy-100 sm:text-[0.95rem]">{children}</div>}
            {follow && (
              <div className="mt-2.5">
                <FavoriteButton fav={{ kind: "league", ref: id, name, logo: (LOGOS as Record<string, { file: string }>)[id]?.file }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
