import Link from "next/link";
import TeamLogo from "@/components/hub/TeamLogo";
import MyTeamButton from "@/components/myteam/MyTeamButton";
import STADIUMS from "@/lib/data/stadiums.generated.json";
import type { Honour } from "@/lib/honours";
import type { LiveTeam } from "@/lib/live/espn";

type Stadium = { team: string; stadium: string; url: string; width: number; height: number; page: string; artist: string; license: string };
const PHOTOS = STADIUMS as Record<string, Stadium>;

// Portada de la página de un equipo: la foto de su estadio de fondo (Wikimedia Commons, con su autor y licencia), el
// escudo, el nombre y sus títulos más importantes. Sin foto, el fondo de las portadas con los colores del club.
export default function TeamHero({
  team,
  compId,
  compName,
  coach,
  honours,
  color,
}: {
  team: LiveTeam & { espnId: string };
  compId: string;
  compName: string;
  coach?: string;
  honours: Honour[];
  color?: string;
}) {
  const photo = PHOTOS[team.espnId];
  return (
    <section className="px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="hero relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] text-white">
        {photo ? (
          // La foto ocupa todo el fondo y se recorta desde el centro (object-cover); el degradé deja leer el texto.
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons */}
            <img src={photo.url} alt={`${photo.stadium}`} className="absolute inset-0 h-full w-full object-cover object-center" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#050b1a]/95 via-[#050b1a]/70 to-[#050b1a]/20" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/90 via-transparent to-transparent" />
          </>
        ) : (
          color && <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: color }} />
        )}
        <div className="relative px-6 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-11">
          <Link
            href={`/torneos/${compId}#equipos`}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-volt-300 ring-1 ring-white/15 backdrop-blur-sm transition hover:text-white sm:text-sm"
          >
            ← {compName}
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <span className="logo-plate">
              <TeamLogo team={team} size={72} />
            </span>
            <div className="min-w-0">
              <h1 className="hero-title font-display text-[2.4rem] font-extrabold uppercase italic leading-[0.95] tracking-wide sm:text-6xl">{team.name}</h1>
              <p className="mt-1.5 text-sm text-navy-100 sm:text-base">
                {photo ? photo.stadium : ""}
                {photo && coach ? " · " : ""}
                {coach ? `DT: ${coach}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <MyTeamButton team={{ comp: compId, id: team.espnId, name: team.name, logo: team.logo }} />
          </div>

          {honours.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
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
