import Link from "next/link";
import type { LiveTable } from "@/lib/live/espn";
import type { Result } from "@/lib/live/season";
import TeamLogo from "./TeamLogo";

// Zonas de la tabla que la fuente no informa (por ejemplo, los que clasifican a octavos en la Argentina).
export type Mark = { from: number; to: number; color: string; label: string };

const RESULT_STYLE: Record<Result, string> = {
  V: "bg-emerald-500 text-white",
  E: "bg-amber-400 text-navy-950",
  D: "bg-red-500 text-white",
};

// Tabla de posiciones al estilo de los sitios de resultados: puesto con el color de su zona, puntos, partidos, goles
// (a favor:en contra), diferencia, ganados, empatados, perdidos y la racha de los últimos cinco partidos.
export default function StandingsTable({
  tables,
  form,
  marks,
  teamHref,
  title,
  highlight,
}: {
  tables: LiveTable[];
  form: Record<string, Result[]>;
  marks?: Mark[];
  teamHref?: (espnId: string) => string;
  title?: string;
  // Equipos resaltados (los del partido, en su página).
  highlight?: string[];
}) {
  const legend = new Map<string, string>();
  for (const t of tables) for (const r of t.rows) if (r.note) legend.set(r.note.description, r.note.color);
  for (const m of marks ?? []) legend.set(m.label, m.color);

  return (
    <div className="space-y-4">
      {tables.map((t) => (
        <div key={t.name} className="panel overflow-x-auto">
          <div className="border-b border-navy-100 bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">
            {tables.length > 1 ? t.name : title ?? "Tabla de posiciones"}
          </div>
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                <th className="w-9 py-2 pl-2 text-center">#</th>
                <th className="py-2 text-left">Equipos</th>
                <th className="w-10 py-2 text-center">Pts</th>
                <th className="w-8 py-2 text-center">J</th>
                <th className="w-14 py-2 text-center">Gol</th>
                <th className="w-10 py-2 text-center">+/-</th>
                <th className="w-8 py-2 text-center">G</th>
                <th className="w-8 py-2 text-center">E</th>
                <th className="w-8 py-2 text-center">P</th>
                <th className="w-32 py-2 pr-2 text-center">Últimas</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => {
                const mark = marks?.find((m) => r.pos >= m.from && r.pos <= m.to);
                const color = r.note?.color ?? mark?.color;
                const diff = r.gf - r.ga;
                const last = r.team.espnId ? form[r.team.espnId] ?? [] : [];
                const name = <span className="truncate font-semibold text-navy-900">{r.team.name}</span>;
                return (
                  <tr
                    key={r.team.espnId ?? r.team.name}
                    className={`border-b border-navy-50 last:border-0 ${r.team.espnId && highlight?.includes(r.team.espnId) ? "bg-volt-500/10 shadow-[inset_3px_0_0_#1f6bff]" : ""}`}
                  >
                    <td className="py-1.5 pl-2 text-center">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded font-display text-xs font-bold tabular-nums"
                        style={color ? { background: color, color: "#0c1830" } : { color: "#6079a0" }}
                      >
                        {r.pos}
                      </span>
                    </td>
                    <td className="py-1.5">
                      {teamHref && r.team.espnId ? (
                        <Link href={teamHref(r.team.espnId)} className="flex min-w-0 items-center gap-2 hover:text-volt-600">
                          <TeamLogo team={r.team} /> {name}
                        </Link>
                      ) : (
                        <span className="flex min-w-0 items-center gap-2">
                          <TeamLogo team={r.team} /> {name}
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 text-center font-display text-base font-bold tabular-nums text-navy-950">{r.points}</td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">{r.played}</td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">
                      {r.gf}:{r.ga}
                    </td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">{diff > 0 ? `+${diff}` : diff}</td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">{r.won}</td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">{r.drawn}</td>
                    <td className="py-1.5 text-center tabular-nums text-navy-600">{r.lost}</td>
                    <td className="py-1.5 pr-2">
                      <span className="flex justify-center gap-0.5">
                        {last.map((x, i) => (
                          <span key={i} className={`inline-flex h-5 w-5 items-center justify-center rounded text-[0.65rem] font-bold ${RESULT_STYLE[x]}`} title={x === "V" ? "Victoria" : x === "E" ? "Empate" : "Derrota"}>
                            {x}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {legend.size > 0 && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-600">
          {[...legend].map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded" style={{ background: color }} /> {translateZone(label)}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

// Las zonas que publica ESPN vienen en inglés.
function translateZone(s: string) {
  return s
    .replace(/^Relegation Playoff$/i, "Promoción por el descenso")
    .replace(/^Relegation$/i, "Descenso")
    .replace(/^Promotion Playoff$/i, "Reducido por el ascenso")
    .replace(/^Promotion$/i, "Ascenso")
    .replace(/Champions League Qualifying/i, "Previa de la Champions League")
    .replace(/Europa League Qualifying/i, "Previa de la Europa League")
    .replace(/Conference League Qualifying/i, "Previa de la Conference League")
    .replace(/^Champions League$/i, "Champions League")
    .replace(/Knockout Round Playoffs?/i, "Playoffs de eliminación")
    .replace(/Round of 16/i, "Octavos de final")
    .replace(/Libertadores Qualifying/i, "Previa de la Libertadores")
    .replace(/Sudamericana/i, "Sudamericana")
    .replace(/Championship Round/i, "Ronda por el título")
    .replace(/Playoffs?/i, "Playoffs");
}
