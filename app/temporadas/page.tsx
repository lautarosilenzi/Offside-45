import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { NoteTag } from "@/components/SeasonNotes";
import { YEARS_WITHOUT_TOURNAMENT } from "@/lib/data/seasons";
import { SEASONS, computeTable, seasonNameOf, verifySeason } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { NoteKind, Season } from "@/lib/types";

export const metadata: Metadata = { title: "Temporadas · Offside 45" };

// Categorías que conviene ver de un vistazo en la tarjeta.
const HIGHLIGHT_KINDS: NoteKind[] = ["descalificacion", "retiro", "anulado", "walkover", "puntos"];
const MAX_ROWS = 6;

type Entry = { year: number; type: "season"; season: Season } | { year: number; type: "none"; reason: string };

export default function SeasonsPage() {
  const entries: Entry[] = [
    ...SEASONS.map((season) => ({ year: season.year, type: "season" as const, season })),
    ...YEARS_WITHOUT_TOURNAMENT.map((y) => ({ year: y.year, type: "none" as const, reason: y.reason })),
  ].sort((a, b) => a.year - b.year);

  const matchCount = SEASONS.reduce((n, s) => n + s.matches.length, 0);

  return (
    <>
      <PageHero eyebrow="Primera División" title="Temporadas">
        Todos los partidos oficiales, año por año, desde el primer campeonato de 1891.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={SEASONS.length} label="Temporadas cargadas" />
          <Stat value={matchCount} label="Partidos" />
          <Stat value={`${SEASONS[0].year}–${SEASONS[SEASONS.length - 1].year}`} label="Período" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((e) =>
            e.type === "none" ? (
              <div key={e.year} className="rounded-md border border-dashed border-navy-200 bg-white/50">
                <div className="flex items-center justify-between border-b border-dashed border-navy-200 px-4 py-2.5">
                  <span className="font-display text-2xl font-bold text-navy-300">{e.year}</span>
                  <span className="font-display text-xs font-semibold uppercase tracking-widest text-navy-400">
                    Sin torneo
                  </span>
                </div>
                <p className="px-4 py-3 text-sm leading-relaxed text-navy-500">{e.reason}</p>
              </div>
            ) : (
              <SeasonCard key={e.year} season={e.season} />
            ),
          )}
        </div>
        <p className="mt-6 text-sm text-navy-400">Las próximas temporadas se cargan de a una, verificadas.</p>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

function SeasonCard({ season }: { season: Season }) {
  const ok = verifySeason(season).length === 0;
  const table = computeTable(season);
  const kinds = [...new Set(season.notes.map((n) => n.kind))].filter((k) => HIGHLIGHT_KINDS.includes(k));

  return (
    <Link
      href={`/temporadas/${season.year}`}
      className="group flex flex-col overflow-hidden rounded-md border border-navy-100 bg-white transition hover:border-navy-300 hover:shadow-[0_2px_12px_rgba(12,24,48,0.08)]"
    >
      <div className="flex items-center justify-between bg-navy-900 px-4 py-2.5 text-white">
        <span className="font-display text-2xl font-bold">{season.year}</span>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
            ok ? "text-emerald-300" : "text-red-300"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
          {ok ? "Tabla verificada" : "Revisar tabla"}
        </span>
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
                      <span className="rounded-sm bg-gold-500 px-1 text-[10px] font-bold uppercase text-white">
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

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-navy-100 px-4 py-2.5">
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
