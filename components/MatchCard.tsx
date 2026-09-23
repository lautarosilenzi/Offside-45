import { getTeam } from "@/lib/teams";
import type { Match } from "@/lib/types";
import TeamBadge from "./TeamBadge";

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

  const homeWon = match.homeGoals > match.awayGoals;
  const awayWon = match.awayGoals > match.homeGoals;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
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

      <footer className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{match.venue}</span>
        {match.note && <span className="italic">{match.note}</span>}
      </footer>
    </article>
  );
}
