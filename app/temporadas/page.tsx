import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import CurrentTournament from "@/components/live/CurrentTournament";
import PageHero from "@/components/PageHero";
import { positions } from "@/lib/rank";
import { NoteTag } from "@/components/SeasonNotes";
import { YEARS_WITHOUT_TOURNAMENT } from "@/lib/data/seasons";
import { LEAGUE_SEASONS as SEASONS, LEAGUE_TOP3, type TitleCount, computeTable, isAmateurSeason, seasonLabel, seasonNameOf } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { NoteKind, Season } from "@/lib/types";

export const metadata: Metadata = { title: "Liga Argentina · 126Goals" };

// Categorías que conviene ver de un vistazo en la tarjeta.
const HIGHLIGHT_KINDS: NoteKind[] = ["descalificacion", "retiro", "anulado", "walkover", "puntos"];
const MAX_ROWS = 6;

const ERAS = [
  { id: "a", short: "Amateur", title: "Era amateur", about: "De 1891 a 1930, y las ligas amateurs que siguieron en paralelo a la profesional entre 1931 y 1934." },
  { id: "p", short: "Profesional", title: "Era profesional", about: "Desde 1931: la Liga Argentina de Football y, desde 1935, la AFA." },
] as const;

type Entry = { year: number; type: "season"; season: Season } | { year: number; type: "none"; reason: string };

export default function SeasonsPage() {
  const entries: Entry[] = [
    ...SEASONS.map((season) => ({ year: season.year, type: "season" as const, season })),
    ...YEARS_WITHOUT_TOURNAMENT.map((y) => ({ year: y.year, type: "none" as const, reason: y.reason })),
  ].sort((a, b) => a.year - b.year);

  const matchCount = SEASONS.reduce((n, s) => n + s.matches.length, 0);
  // Agrupadas por era y, dentro de cada era, por década, con una barra para saltar de una a otra.
  // Las ligas amateurs de 1931–1934 van con la era amateur.
  const amateur = (e: Entry) => (e.type === "none" ? e.year < 1931 : isAmateurSeason(e.season));
  const eras = ERAS.map((era) => {
    const decades = new Map<number, Entry[]>();
    for (const e of entries.filter((e) => amateur(e) === (era.id === "a"))) {
      const d = Math.floor(e.year / 10) * 10;
      decades.set(d, [...(decades.get(d) ?? []), e]);
    }
    return { ...era, decades };
  });

  return (
    <>
      <PageHero eyebrow="Primera División" title="Liga Argentina">
        Todos los partidos oficiales, año por año, desde el primer campeonato de 1891.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={SEASONS.length} label="Torneos" />
          <Stat value={matchCount.toLocaleString("es-AR")} label="Partidos" />
          <Stat value={`${SEASONS[0].year}–${SEASONS[SEASONS.length - 1].year}`} label="Período" />
        </div>
      </PageHero>

      <nav
        aria-label="Décadas"
        className="sticky top-[4.25rem] z-20 mx-auto mt-4 max-w-5xl px-3 sm:top-[4.75rem] sm:px-6"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-white/70 bg-white/80 p-1.5 shadow-[0_8px_24px_-14px_rgba(12,24,48,0.3)] backdrop-blur-md [scrollbar-width:none]">
          {SEASONS.some((s) => s.inProgress) && (
            <a href="#en-juego" className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-white">
              <span className="live-dot-bare bg-white" /> En juego
            </a>
          )}
          {eras.map((era, i) => (
            <span key={era.id} className="flex shrink-0 items-center gap-1.5">
              {i > 0 && <span className="mx-1 h-5 w-px bg-navy-200" aria-hidden />}
              <a
                href={`#era-${era.id}`}
                className="shrink-0 rounded-full bg-navy-900 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-white"
              >
                {era.short}
              </a>
              {[...era.decades.keys()].map((d) => (
                <a
                  key={d}
                  href={`#${era.id}${d}`}
                  className="shrink-0 rounded-full px-3 py-1 font-display text-sm font-semibold tabular-nums text-navy-600 transition hover:bg-navy-900 hover:text-white"
                >
                  {d}s
                </a>
              ))}
            </span>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        {SEASONS.filter((s) => s.inProgress).map((s) => (
          <CurrentTournament key={s.slug} season={s} />
        ))}
        {eras.map((era) => (
          <div key={era.id} id={`era-${era.id}`} className="scroll-mt-36 space-y-10">
            <div className="rounded-3xl bg-navy-900 px-5 py-4 text-white">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide">{era.title}</h2>
              <p className="mt-1 text-sm text-navy-200">{era.about}</p>
            </div>
        {[...era.decades.entries()].map(([d, list]) => (
          <section key={d} id={`${era.id}${d}`} className="scroll-mt-36">
            <h2 className="section-title mb-4">Década de {d}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((e) =>
                e.type === "none" ? (
                  <div key={e.year} className="rounded-3xl border border-dashed border-navy-300/70 bg-white/40">
                    <div className="flex items-center justify-between border-b border-dashed border-navy-200 px-4 py-2.5">
                      <span className="font-display text-2xl font-bold text-navy-300">{e.year}</span>
                      <span className="font-display text-xs font-semibold uppercase tracking-widest text-navy-400">
                        Sin torneo
                      </span>
                    </div>
                    <p className="px-4 py-3 text-sm leading-relaxed text-navy-500">{e.reason}</p>
                  </div>
                ) : (
                  <SeasonCard key={e.season.slug} season={e.season} />
                ),
              )}
            </div>
          </section>
        ))}
          </div>
        ))}
        <p className="text-sm text-navy-400">
          Cada torneo está verificado: la tabla que sale de los partidos coincide con la publicada por la fuente, y las diferencias
          que no se pueden resolver están explicadas en su página.
        </p>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="stat-value text-3xl font-bold italic text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

function SeasonCard({ season }: { season: Season }) {
  const table = computeTable(season);
  const kinds = [...new Set(season.notes.map((n) => n.kind))].filter((k) => HIGHLIGHT_KINDS.includes(k));
  const top3 = LEAGUE_TOP3.get(season.slug);

  return (
    <Link
      href={`/temporadas/${season.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_8px_24px_-14px_rgba(12,24,48,0.25)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_14px_30px_-12px_rgba(0,71,171,0.30)]"
    >
      <div className="flex items-center justify-between bg-navy-900 px-4 py-2.5 text-white">
        <span className="font-display text-2xl font-bold">{seasonLabel(season)}</span>
        {season.inProgress && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            En juego
          </span>
        )}
      </div>

      <div className="px-4 pb-1 pt-3">
        <p className="text-sm font-semibold leading-snug text-navy-900">{season.tournament}</p>
        <p className="mt-0.5 text-xs text-navy-500">
          {table.length} equipos · {season.matches.length} partidos
        </p>
      </div>

      <table className="mx-4 my-2 text-sm">
        <tbody>
          {table.slice(0, MAX_ROWS).map((r, i) => {
            const team = getTeam(r.teamId);
            const champion = season.championIds.includes(r.teamId);
            return (
              <tr key={r.teamId} className="border-b border-navy-50 last:border-0">
                <td className="w-6 py-1.5 text-xs tabular-nums text-navy-400">{i + 1}</td>
                <td className="py-1.5">
                  <span className="flex items-center gap-2">
                    {team && <Crest team={team} size="xs" />}
                    <span className={`truncate ${champion ? "font-bold text-navy-950" : "text-navy-700"}`}>
                      {seasonNameOf(season, r.teamId) ?? team?.name ?? r.teamId}
                    </span>
                    {champion && (
                      <span data-confetti className="rounded-full bg-gold-500 px-1.5 text-[10px] font-bold uppercase text-white">
                        Campeón
                      </span>
                    )}
                  </span>
                </td>
                <td className="w-12 py-1.5 text-right text-xs tabular-nums text-navy-400">{r.played} PJ</td>
                <td className="w-10 py-1.5 text-right font-display text-base font-bold tabular-nums">{r.points}</td>
              </tr>
            );
          })}
          {table.length > MAX_ROWS && (
            <tr>
              <td colSpan={4} className="py-1.5 text-xs text-navy-400">
                y {table.length - MAX_ROWS} equipos más
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {top3 && (
        <div className="mt-auto space-y-2 border-t border-navy-100 bg-navy-50/70 px-4 py-2.5">
          <Top3 label={top3.pro ? "Ligas en total" : "Más ligas"} list={top3.total} />
          {top3.pro && <Top3 label="Era profesional" list={top3.pro} />}
        </div>
      )}
      <div className={`${top3 ? "" : "mt-auto "}flex items-center justify-between gap-3 border-t border-navy-100 px-4 py-2.5`}>
        <div className="flex flex-wrap gap-1">
          {kinds.map((k) => (
            <NoteTag key={k} kind={k} />
          ))}
        </div>
        <span className="shrink-0 font-display text-sm font-semibold uppercase tracking-wide text-brand-500 group-hover:underline">
          Ver temporada
        </span>
      </div>
    </Link>
  );
}

// Top 3 de clubes con más ligas al terminar el torneo: escudo, nombre y cantidad.
function Top3({ label, list }: { label: string; list: TitleCount[] }) {
  const pos = positions(list, (c) => c.titles);
  return (
    <div>
      <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-widest text-navy-400">{label}</p>
      <ol className="flex flex-wrap gap-1.5">
        {list.map((c, i) => {
          const team = getTeam(c.id);
          return (
            <li key={c.id} className="flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-2.5 text-xs text-navy-700 ring-1 ring-navy-100">
              <span className="font-display font-bold text-navy-400">{pos[i]}.</span>
              {team && <Crest team={team} size="xs" />}
              <span className="font-medium">{team?.name ?? c.id}</span>
              <span className="font-display text-sm font-bold tabular-nums text-navy-950">{c.titles}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
