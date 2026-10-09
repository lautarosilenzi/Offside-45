import Link from "next/link";
import TeamLogo from "@/components/hub/TeamLogo";
import FavoriteButton from "@/components/account/FavoriteButton";
import MyTeamButton from "@/components/myteam/MyTeamButton";
import STADIUMS from "@/lib/data/stadiums.generated.json";
import VENUES from "@/lib/data/venues.generated.json";
import type { Honour } from "@/lib/honours";
import type { LiveTeam } from "@/lib/live/espn";

type Stadium = { team: string; stadium: string; url: string; width: number; height: number; page: string; artist: string; license: string };
const PHOTOS = STADIUMS as Record<string, Stadium>;

// Portada de la página de un equipo, como en las apps de resultados: el escudo grande al centro, el nombre, el año de
// fundación y el estadio, y sus títulos más importantes. De fondo, la foto de su estadio (Wikimedia Commons, con su
// autor y licencia); sin foto, el fondo de las portadas con los colores del club.
export default function TeamHero({
  team,
  compId,
  compName,
  founded,
  honours,
  color,
}: {
  team: LiveTeam & { espnId: string };
  compId: string;
  compName: string;
  founded?: number;
  honours: Honour[];
  color?: string;
}) {
  const photo = PHOTOS[team.espnId];
  const venue = (VENUES as Record<string, { name: string; capacity?: number }>)[team.espnId];
  return (
    <section className="px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="hero relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] text-white">
        {photo ? (
          // La foto ocupa todo el fondo y se recorta desde el centro (object-cover); el degradé deja leer el texto.
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons */}
            <img src={photo.url} alt={`${photo.stadium}`} className="absolute inset-0 h-full w-full object-cover object-center" />
            <div aria-hidden className="absolute inset-0 bg-[#050b1a]/70" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-[#050b1a]/40 to-transparent" />
          </>
        ) : (
          color && <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: color }} />
        )}
        <div className="relative px-5 pb-5 pt-5 text-center sm:px-10 sm:pb-7 sm:pt-7">
          <Link
            href={`/torneos/${compId}#equipos`}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 ring-1 ring-white/15 backdrop-blur-sm transition hover:text-white sm:text-sm"
          >
            ← {compName}
          </Link>
          <div className="flex flex-col items-center gap-2">
            <span className="logo-plate">
              <TeamLogo team={team} size={104} />
            </span>
            <div className="min-w-0">
              <h1 className="hero-title text-shine font-display text-[2.2rem] font-black uppercase italic leading-[0.95] tracking-wide sm:text-5xl">{team.name}</h1>
              {founded && <p className="mt-1 text-base text-navy-100">Fundado en {founded}</p>}
              {/* El estadio con su capacidad (si las fuentes coinciden, scripts/stadiums.cjs). */}
              {venue && (
                <p className="mt-0.5 text-sm text-navy-100">
                  {venue.name}
                  {venue.capacity ? ` · ${venue.capacity.toLocaleString("es-AR")} espectadores` : ""}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <MyTeamButton team={{ comp: compId, id: team.espnId, name: team.name, logo: team.logo }} />
            <FavoriteButton fav={{ kind: "team", ref: `${compId}/${team.espnId}`, name: team.name, logo: team.logo }} />
          </div>

          {honours.length > 0 && (
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
              {honours.map((h) => (
                <li
                  key={h.label}
                  title={h.years?.length ? h.years.join(", ") : undefined}
                  className="flex items-center gap-2 rounded-2xl bg-[#050b1a]/60 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur-sm sm:gap-2.5 sm:px-3.5"
                >
                  <Trophy />
                  <span className="font-display text-2xl font-extrabold leading-none tabular-nums text-gold-400 sm:text-3xl">{h.n}</span>
                  <span className="min-w-0 font-display text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white sm:max-w-[9rem] sm:text-xs">{h.label}</span>
                </li>
              ))}
            </ul>
          )}

          {photo && (
            <a href={photo.page} target="_blank" rel="noreferrer" className="mt-4 block text-right text-[0.65rem] text-white/50 hover:text-white/80">
              Foto: {photo.artist || "Wikimedia Commons"} · {photo.license}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Trophy() {
  return (
    <svg viewBox="0 0 24 24" className="hidden h-6 w-6 shrink-0 text-gold-400 sm:block" fill="currentColor" aria-hidden>
      <path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3zm0 4H6v1a2 2 0 0 0 1.3 1.9A5 5 0 0 1 7 8.5V7zm10 0v1.5a5 5 0 0 1-.3 1.4A2 2 0 0 0 18 8V7h-1zM6 20h12v2H6v-2z" />
    </svg>
  );
}
