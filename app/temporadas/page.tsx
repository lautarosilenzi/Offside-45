import type { Metadata } from "next";
import Link from "next/link";
import { NoteTag } from "@/components/SeasonNotes";
import SiteHeader from "@/components/SiteHeader";
import { YEARS_WITHOUT_TOURNAMENT } from "@/lib/data/seasons";
import { SEASONS, computeTable, seasonNameOf, verifySeason } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { NoteKind } from "@/lib/types";

export const metadata: Metadata = { title: "Temporadas · Offside 45" };

// Categorías que conviene ver de un vistazo en la tarjeta.
const HIGHLIGHT_KINDS: NoteKind[] = ["descalificacion", "retiro", "anulado", "walkover", "puntos"];
const MAX_ROWS = 6;

type Entry =
  | { year: number; type: "season"; season: (typeof SEASONS)[number] }
  | { year: number; type: "none"; reason: string };

export default function SeasonsPage() {
  const entries: Entry[] = [
    ...SEASONS.map((season) => ({ year: season.year, type: "season" as const, season })),
    ...YEARS_WITHOUT_TOURNAMENT.map((y) => ({ year: y.year, type: "none" as const, reason: y.reason })),
  ].sort((a, b) => a.year - b.year);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Temporadas</h1>
        <p className="mt-2 text-slate-600">
          Todos los partidos oficiales de Primera División, año por año, desde el primer campeonato de 1891.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {entries.map((e) =>
            e.type === "none" ? (
              <div key={e.year} className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl font-extrabold tabular-nums text-slate-300">{e.year}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    Sin torneo
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{e.reason}</p>
              </div>
            ) : (
              <SeasonCard key={e.year} season={e.season} />
            ),
          )}
        </div>

        <p className="mt-8 text-xs text-slate-400">Las próximas temporadas se van cargando de a una, verificadas.</p>
      </main>
    </>
  );
}

function SeasonCard({ season }: { season: (typeof SEASONS)[number] }) {
  const ok = verifySeason(season).length === 0;
  const table = computeTable(season);
  const kinds = [...new Set(season.notes.map((n) => n.kind))].filter((k) => HIGHLIGHT_KINDS.includes(k));

  return (
    <Link
      href={`/temporadas/${season.year}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl font-extrabold tabular-nums text-brand-500">{season.year}</span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {ok ? "Tabla verificada" : "Revisar tabla"}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold leading-snug text-slate-800">{season.tournament}</p>
      <p className="mt-0.5 text-xs text-slate-500">
        {table.length} equipos · {season.matches.length} partidos
      </p>

      <ol className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100 text-sm">
        {table.slice(0, MAX_ROWS).map((r, i) => {
          const champion = season.championIds.includes(r.teamId);
          return (
            <li key={r.teamId} className="flex items-center gap-3 px-3 py-1.5">
              <span className="w-4 text-right text-xs tabular-nums text-slate-400">{i + 1}</span>
              <span className={`flex-1 truncate ${champion ? "font-bold text-slate-900" : "text-slate-600"}`}>
                {seasonNameOf(season, r.teamId) ?? getTeam(r.teamId)?.name ?? r.teamId}
                {champion && <span className="ml-1.5 text-[10px] font-bold uppercase text-brand-500">Campeón</span>}
              </span>
              <span className="text-xs tabular-nums text-slate-400">{r.played} PJ</span>
              <span className="w-10 text-right font-bold tabular-nums">{r.points}</span>
            </li>
          );
        })}
        {table.length > MAX_ROWS && (
          <li className="px-3 py-1.5 text-xs text-slate-400">y {table.length - MAX_ROWS} equipos más…</li>
        )}
      </ol>

      {kinds.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {kinds.map((k) => (
            <NoteTag key={k} kind={k} />
          ))}
        </div>
      )}

      <span className="mt-4 text-xs font-semibold text-brand-500 group-hover:underline">Ver temporada →</span>
    </Link>
  );
}
