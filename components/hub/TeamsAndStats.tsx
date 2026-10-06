import Link from "next/link";
import type { Leader, LiveTeam } from "@/lib/live/espn";
import TeamLogo from "./TeamLogo";

// Pestaña "Equipos y estadísticas": la grilla de equipos (cada uno lleva a su ficha) y los goleadores y asistidores.
export default function TeamsAndStats({
  teams,
  teamHref,
  goals,
  assists,
  titles,
}: {
  teams: LiveTeam[];
  teamHref: (espnId: string) => string;
  goals: Leader[];
  assists: Leader[];
  titles?: Record<string, number>;
}) {
  return (
    <div className="space-y-6">
      <section className="panel p-4">
        <h2 className="text-center font-display text-lg font-bold uppercase tracking-widest text-navy-950">Equipos</h2>
        <p className="mb-4 text-center text-sm text-navy-500">Tocá un equipo para ver su plantel, sus partidos y su campaña.</p>
        {teams.length === 0 ? (
          <p className="text-center text-sm text-navy-500">Todavía no hay equipos cargados para esta temporada.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-4">
            {teams.map((t) => {
              const n = titles?.[t.espnId ?? ""] ?? titles?.[t.teamId ?? ""];
              return (
                <li key={t.espnId ?? t.name}>
                  <Link href={teamHref(t.espnId ?? "")} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center transition hover:bg-brand-50">
                    <span className="flex items-center gap-1.5">
                      <TeamLogo team={t} size={36} />
                      {n ? <span className="text-xs font-bold text-gold-500">🏆 {n}</span> : null}
                    </span>
                    <span className="text-sm font-semibold text-navy-900">{t.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <LeaderTable title="Goleadores" unit="Goles" rows={goals} />
        <LeaderTable title="Asistidores" unit="Asist." rows={assists} />
      </div>
    </div>
  );
}

function LeaderTable({ title, unit, rows }: { title: string; unit: string; rows: Leader[] }) {
  return (
    <section className="panel overflow-hidden">
      <h3 className="bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">{title}</h3>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-navy-500">Sin datos todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
              <th className="w-8 py-1.5 pl-3 text-left">#</th>
              <th className="py-1.5 text-left">Jugador</th>
              <th className="w-10 py-1.5 text-center">PJ</th>
              <th className="w-14 py-1.5 pr-3 text-right">{unit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {rows.slice(0, 15).map((r, i) => (
              <tr key={r.name + i}>
                <td className="py-1.5 pl-3 tabular-nums text-navy-400">{i > 0 && rows[i - 1].value === r.value ? "" : i + 1}</td>
                <td className="py-1.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <TeamLogo team={r.team} size={18} />
                    {r.id ? (
                      <Link href={`/jugador/${r.id}`} className="truncate font-semibold text-navy-900 hover:text-volt-600 hover:underline">
                        {r.name}
                      </Link>
                    ) : (
                      <span className="truncate font-semibold text-navy-900">{r.name}</span>
                    )}
                    <span className="hidden truncate text-xs text-navy-400 sm:inline">{r.team.name}</span>
                  </span>
                </td>
                <td className="py-1.5 text-center tabular-nums text-navy-500">{r.matches || "—"}</td>
                <td className="py-1.5 pr-3 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
