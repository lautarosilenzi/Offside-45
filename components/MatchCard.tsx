import { getTeam } from "@/lib/teams";
import { winnerOf } from "@/lib/matches";
import type { Match, Source } from "@/lib/types";
import TeamBadge from "./TeamBadge";

const SOURCE_LABELS: Record<Source, string> = {
  rsssf: "RSSSF",
  "wikipedia-es": "Wikipedia ES",
  "wikipedia-en": "Wikipedia EN",
};

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default function MatchCard({ match }: { match: Match }) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  if (!home || !away) return null;

  const winner = winnerOf(match);
  const homeWon = winner === home.id;
  const awayWon = winner === away.id;
  const annulled = match.status === "annulled";
  const awarded = match.awardedTo ? getTeam(match.awardedTo) : undefined;

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
        annulled ? "border-dashed border-amber-300 opacity-80" : "border-slate-200"
      }`}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-600">
          {match.competition}
          {match.stage ? ` · ${match.stage}` : ""}
        </span>
        <time dateTime={match.date} className="font-medium text-slate-500">
          {dateFmt.format(new Date(match.date))}
        </time>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <TeamBadge team={home} size="sm" />
          <span className={`truncate text-sm sm:text-base ${homeWon ? "font-bold" : "font-medium text-slate-600"}`}>
            {home.name}
          </span>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-1.5 text-lg font-extrabold tabular-nums text-white">
          {match.homeGoals} <span className="text-slate-400">-</span> {match.awayGoals}
        </div>
        <div className="flex min-w-0 flex-row-reverse items-center gap-2.5 text-right">
          <TeamBadge team={away} size="sm" />
          <span className={`truncate text-sm sm:text-base ${awayWon ? "font-bold" : "font-medium text-slate-600"}`}>
            {away.name}
          </span>
        </div>
      </div>

      {(annulled || awarded) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {annulled && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
              Torneo anulado · no suma
            </span>
          )}
          {awarded && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
              Ganado por escritorio: {awarded.name}
            </span>
          )}
        </div>
      )}

      {match.note && <p className="mt-3 text-xs leading-relaxed text-slate-600">{match.note}</p>}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span>{match.venue}</span>
        <span>Fuentes: {match.sources.map((s) => SOURCE_LABELS[s]).join(" · ")}</span>
      </footer>
    </article>
  );
}
