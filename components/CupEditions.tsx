import Link from "next/link";
import Crest from "@/components/Crest";
import { seasonNameOf, sourceOrder } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Season } from "@/lib/types";

// Piezas compartidas por las páginas de copas nacionales e internacionales.

export function HeroStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

// Una edición de una copa: año, campeón, resultado de la final y finalista.
export function EditionRow({ season }: { season: Season }) {
  const champion = season.championIds[0] ? getTeam(season.championIds[0]) : undefined;
  // Título compartido (Ibarguren 1952): el segundo campeón va en el lugar del finalista.
  const shared = season.championIds.length > 1;
  const runnerUpId = shared ? season.championIds[1] : season.runnerUpIds?.[0];
  const runnerUp = runnerUpId ? getTeam(runnerUpId) : undefined;
  const final = season.matches
    .filter((m) => /^Final\b/.test(m.stage ?? "") && m.status !== "annulled")
    .sort(sourceOrder)
    .pop();
  // Resultado de la final visto desde el campeón; en las finales de ida y vuelta, el global.
  const legs = /\((ida|vuelta)\)$/.test(final?.stage ?? "")
    ? season.matches.filter((m) => /^Final \((ida|vuelta)\)$/.test(m.stage ?? "") && m.status !== "annulled")
    : final
      ? [final]
      : [];
  const side = champion?.id ?? final?.homeId;
  const goals = (own: boolean) => legs.reduce((n, m) => n + ((m.homeId === side) === own ? m.homeGoals : m.awayGoals), 0);
  // Sin campeón (copa suspendida) no se muestra resultado: no hay a quién atribuírselo.
  const score = !final || !champion ? null : final.walkover ? "W.O." : `${goals(true)}-${goals(false)}`;
  const teams = new Set(season.matches.flatMap((m) => [m.homeId, m.awayId])).size;

  return (
    <li>
      <Link
        href={`/temporadas/${season.slug}`}
        className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 transition hover:bg-navy-50 sm:grid-cols-[5rem_1fr_auto_1fr_7rem]"
      >
        <span className="row-span-2 font-display text-2xl font-bold text-navy-900 sm:row-span-1">
          {season.yearLabel?.includes("/") ? <span className="text-lg">{season.yearLabel}</span> : season.year}
        </span>
        {champion ? (
          <span className="flex min-w-0 items-center gap-2">
            <Crest team={champion} size="sm" />
            <span className="truncate font-bold text-navy-950">{seasonNameOf(season, champion.id) ?? champion.name}</span>
          </span>
        ) : (
          <span className="text-sm text-navy-500">{season.inProgress ? "En juego" : "Sin campeón · suspendida"}</span>
        )}
        {score ? (
          <span className="rounded-full bg-navy-900 px-3 py-0.5 text-center font-display text-base font-bold tabular-nums text-white">
            {score}
          </span>
        ) : (
          <span />
        )}
        {runnerUp ? (
          <span className="col-start-2 flex min-w-0 items-center gap-2 text-sm text-navy-600 sm:col-start-auto">
            <span className="text-xs uppercase tracking-wider text-navy-400 sm:hidden">{shared ? "Compartido con" : "Final vs."}</span>
            <Crest team={runnerUp} size="xs" />
            <span className="truncate">{seasonNameOf(season, runnerUp.id) ?? runnerUp.name}</span>
          </span>
        ) : (
          <span className="hidden sm:block" />
        )}
        <span className="col-start-3 row-start-2 text-right text-xs text-navy-400 sm:col-start-auto sm:row-start-auto">
          {teams} equipos · {season.matches.length} partidos
        </span>
      </Link>
    </li>
  );
}
