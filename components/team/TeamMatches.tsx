import Link from "next/link";
import CompLogo from "@/components/CompLogo";
import TeamLogo from "@/components/hub/TeamLogo";
import { LIVE_CODE } from "@/lib/competitions";
import { findLiveCompetition } from "@/lib/live/competitions";
import type { LiveEvent } from "@/lib/live/espn";
import { OFF_LABELS } from "@/lib/live/status";
import { isKnockout, phaseLabel } from "@/lib/live/season";

const TZ = "America/Argentina/Buenos_Aires";
const date = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(new Date(iso)).replace(/\./g, "");
const hour = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

// Competencia de un partido, por su código de ESPN: nombre y logo como en el menú del sitio.
const BY_CODE = Object.fromEntries(Object.entries(LIVE_CODE).map(([id, code]) => [code, id]));
export function competitionOfCode(code: string): { id?: string; name: string } {
  if (code === "club.friendly") return { name: "Amistoso" };
  const id = BY_CODE[code];
  return { id, name: (id && findLiveCompetition(id)?.name) || code };
}

type Ev = LiveEvent & { league: string };

// Partidos de un club en todas las competencias, como en las apps de resultados: cada uno con su competencia arriba,
// la fecha y la fase, los dos equipos y el resultado (o la hora) al medio. Cada partido lleva a su página.
export default function TeamMatches({ matches, team, empty = "No hay partidos." }: { matches: Ev[]; team: string; empty?: string }) {
  if (!matches.length) return <p className="panel px-6 py-8 text-center text-navy-500">{empty}</p>;
  return (
    <ul className="space-y-3">
      {matches.map((m) => (
        <li key={m.id}>
          <MatchCard m={m} team={team} />
        </li>
      ))}
    </ul>
  );
}

export function MatchCard({ m, team }: { m: Ev; team: string }) {
  const comp = competitionOfCode(m.league);
  const mineHome = m.home.espnId === team;
  const mine = Number((mineHome ? m.home : m.away).score ?? 0);
  const theirs = Number((mineHome ? m.away : m.home).score ?? 0);
  const off = OFF_LABELS.includes(m.detail);
  const res = m.state === "post" && !off ? (mine > theirs ? "V" : mine < theirs ? "D" : "E") : undefined;
  const stage = isKnockout(m.round) ? phaseLabel(m.round) : m.group ?? "";
  return (
    <Link href={`/partido/${m.league}/${m.id}`} className="panel block overflow-hidden transition hover:ring-1 hover:ring-volt-400/50">
      <div className="flex items-center gap-2 border-b border-navy-100 px-4 py-2">
        {comp.id ? <CompLogo id={comp.id} size={20} /> : <span className="h-5 w-5 shrink-0 rounded-full bg-navy-200" aria-hidden />}
        <span className="min-w-0 flex-1 font-semibold leading-tight text-navy-900">{comp.name}</span>
      </div>
      <div className="flex items-center justify-between gap-2 px-4 pt-2 text-xs text-navy-500">
        <span className="first-letter:uppercase">{date(m.date)}</span>
        {stage && <span className="text-right">{stage}</span>}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 pb-3 pt-2 sm:px-4">
        <span className="flex min-w-0 items-center justify-end gap-2 text-right">
          <span className={`min-w-0 leading-tight ${m.home.espnId === team ? "font-bold text-navy-950" : "text-navy-800"}`}>{m.home.name}</span>
          <TeamLogo team={m.home} size={30} />
        </span>
        <span className="flex min-w-[4.5rem] flex-col items-center">
          {off ? (
            <span className="rounded-lg bg-navy-100 px-2 py-1 text-xs font-semibold text-navy-600">{m.detail}</span>
          ) : m.state === "pre" ? (
            <span className="font-display text-2xl font-bold tabular-nums text-navy-950">{hour(m.date)}</span>
          ) : (
            <span
              className={`rounded-lg px-2.5 py-0.5 font-display text-2xl font-bold tabular-nums ${
                m.state === "in" ? "bg-red-600 text-white" : res === "V" ? "bg-emerald-500 text-white" : res === "D" ? "bg-red-500 text-white" : "bg-amber-400 text-navy-950"
              }`}
            >
              {m.home.score ?? 0} - {m.away.score ?? 0}
            </span>
          )}
          {m.state === "in" && <span className="mt-0.5 text-[0.7rem] font-semibold text-red-500">En vivo {m.clock}</span>}
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <TeamLogo team={m.away} size={30} />
          <span className={`min-w-0 leading-tight ${m.away.espnId === team ? "font-bold text-navy-950" : "text-navy-800"}`}>{m.away.name}</span>
        </span>
      </div>
    </Link>
  );
}
