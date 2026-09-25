import Link from "next/link";
import { winnerOf } from "@/lib/matches";
import { SEASON_OF_MATCH } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Match, Source } from "@/lib/types";
import Crest from "./Crest";

const SOURCE_LABELS: Record<Source, string> = {
  rsssf: "RSSSF",
  "wikipedia-es": "Wikipedia ES",
  "wikipedia-en": "Wikipedia EN",
};

const dayFmt = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", timeZone: "UTC" });

// Lista de partidos en formato de marcador, agrupada por año (historial), por fase (copas) o sin agrupar.
// En el historial cada partido enlaza a su temporada o copa.
export default function MatchList({
  matches,
  groupBy = "year",
  linkSeason = groupBy === "year",
}: {
  matches: Match[];
  groupBy?: "year" | "stage" | "none";
  linkSeason?: boolean;
}) {
  // Grupos consecutivos: en una copa la misma fase puede volver a aparecer más adelante (ej. un desempate por ronda).
  const groups: { key: string; list: Match[] }[] = [];
  for (const m of matches) {
    const key = groupBy === "year" ? m.date.slice(0, 4) : groupBy === "stage" ? (m.stage ?? "Partidos") : "";
    const last = groups[groups.length - 1];
    if (last?.key === key) last.list.push(m);
    else groups.push({ key, list: [m] });
  }

  return (
    <div className="panel overflow-hidden">
      {groups.map(({ key, list }, gi) => (
        <div key={`${gi}-${key}`}>
          {groupBy !== "none" && (
            <div className="border-b border-navy-100 bg-navy-50 px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider text-navy-600">
              {key}
            </div>
          )}
          <ul className="divide-y divide-navy-100">
            {list.map((m) => (
              <MatchRow key={m.id} match={m} linkSeason={linkSeason} showStage={groupBy !== "stage"} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MatchRow({ match, linkSeason, showStage }: { match: Match; linkSeason: boolean; showStage: boolean }) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  if (!home || !away) return null;

  const winner = winnerOf(match);
  const annulled = match.status === "annulled";
  const awarded = match.awardedTo ? getTeam(match.awardedTo) : undefined;
  const homeName = match.homeAs ?? home.name;
  const awayName = match.awayAs ?? away.name;
  // Algunas copas viejas no tienen el día del partido: solo el año.
  const dayKnown = match.date.length === 10;
  const season = linkSeason ? SEASON_OF_MATCH.get(match.id) : undefined;
  const head = season
    ? season.kind === "cup"
      ? season.title
      : `Campeonato ${season.year}${season.league ? ` · ${season.league}` : ""}`
    : linkSeason
      ? match.competition
      : null;
  const context = [head, showStage ? match.stage : null]
    .filter(Boolean)
    .join(" · ");

  const tags: { label: string; tone: "amber" | "slate" }[] = [];
  if (annulled) tags.push({ label: "Anulado · no suma", tone: "amber" });
  if (match.bothLost) tags.push({ label: "No se jugó · perdido por ambos", tone: "amber" });
  if (match.walkover && awarded)
    tags.push({ label: match.phase === "cup" ? `No se jugó · pasó ${awarded.name}` : `No se jugó · puntos para ${awarded.name}`, tone: "amber" });
  else if (awarded) tags.push({ label: `Ganado por escritorio: ${awarded.name}`, tone: "slate" });
  const advanced = match.advancedId ? getTeam(match.advancedId) : undefined;
  if (advanced) tags.push({ label: `Empate · pasó ${match.advancedId === home.id ? homeName : match.advancedId === away.id ? awayName : advanced.name}`, tone: "slate" });
  if (match.scoreUnknown) {
    const w = winner === home.id ? homeName : winner === away.id ? awayName : null;
    tags.push({ label: `Resultado no registrado · ${w ? `ganó ${w}` : "empate"}`, tone: "slate" });
  }

  return (
    <li className={`px-3 py-3 sm:px-4 ${annulled ? "bg-amber-50/40" : ""}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 gap-y-2 sm:gap-x-3 sm:grid-cols-[7.5rem_1fr_auto_1fr]">
        <div className="col-span-3 flex items-baseline gap-2 text-xs text-navy-500 sm:col-span-1 sm:block">
          <time dateTime={match.date} className="font-display text-sm font-semibold uppercase text-navy-800">
            {dayKnown ? dayFmt.format(new Date(match.date)).replace(".", "") : "Sin fecha"} {match.date.slice(0, 4)}
          </time>
          {season ? (
            <Link href={`/temporadas/${season.slug}`} className="line-clamp-2 hover:text-brand-500 hover:underline sm:mt-0.5" title={match.competition}>
              {context}
            </Link>
          ) : (
            context && (
              <div className="line-clamp-2 sm:mt-0.5" title={match.competition}>
                {context}
              </div>
            )
          )}
        </div>

        <TeamSide name={homeName} today={match.homeAs ? home.name : undefined} team={home} won={winner === home.id} align="right" />

        <div
          className={`min-w-[3.5rem] rounded-sm px-2 py-1 text-center font-display text-lg font-bold sm:min-w-[4.25rem] sm:px-2.5 sm:text-xl tabular-nums leading-tight ${
            annulled ? "bg-navy-200 text-navy-600 line-through decoration-1" : "bg-navy-900 text-white"
          }`}
        >
          {match.walkover ? "W.O." : match.scoreUnknown ? "? – ?" : `${match.homeGoals} – ${match.awayGoals}`}
        </div>

        <TeamSide name={awayName} today={match.awayAs ? away.name : undefined} team={away} won={winner === away.id} align="left" />
      </div>

      {(tags.length > 0 || match.note) && (
        <div className="mt-2 space-y-1.5 sm:pl-[8.25rem]">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t.label}
                  className={`rounded-sm px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                    t.tone === "amber" ? "bg-amber-100 text-amber-800" : "bg-navy-100 text-navy-700"
                  }`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}
          {match.note && <p className="text-[13px] leading-snug text-navy-600">{match.note}</p>}
        </div>
      )}

      <div className="mt-1.5 flex flex-wrap gap-x-4 text-[11px] text-navy-400 sm:pl-[8.25rem]">
        {match.venue && <span>{match.venue}</span>}
        <span>Fuente: {match.sources.map((s) => SOURCE_LABELS[s]).join(", ")}</span>
      </div>
    </li>
  );
}

function TeamSide({
  team,
  name,
  today,
  won,
  align,
}: {
  team: NonNullable<ReturnType<typeof getTeam>>;
  name: string;
  today?: string;
  won: boolean;
  align: "left" | "right";
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 sm:gap-2.5 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <Crest team={team} size="sm" />
      <div className="min-w-0">
        <div
          className={`line-clamp-2 text-sm leading-tight sm:truncate sm:text-[15px] ${won ? "font-bold text-navy-950" : "font-medium text-navy-600"}`}
        >
          {name}
        </div>
        {today && <div className="truncate text-[11px] text-navy-400">hoy {today}</div>}
      </div>
    </div>
  );
}
