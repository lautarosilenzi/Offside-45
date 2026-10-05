import Link from "next/link";
import type { PromedioRow } from "@/lib/live/argentina";
import TeamLogo from "./TeamLogo";

const fmt = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

// Promedios del descenso: puntos de las tres temporadas sobre los partidos jugados. El último desciende.
export default function PromediosTable({ rows, teamHref }: { rows: PromedioRow[]; teamHref: (espnId: string) => string }) {
  return (
    <div className="space-y-2">
      <div className="panel overflow-x-auto">
        <div className="border-b border-navy-100 bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">Promedios</div>
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
              <th className="w-9 py-2 pl-2 text-center">#</th>
              <th className="py-2 text-left">Equipos</th>
              <th className="w-12 py-2 text-center">2024</th>
              <th className="w-12 py-2 text-center">2025</th>
              <th className="w-12 py-2 text-center">2026</th>
              <th className="w-12 py-2 text-center">Pts</th>
              <th className="w-10 py-2 text-center">PJ</th>
              <th className="w-16 py-2 pr-3 text-right">Prom.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const last = i === rows.length - 1;
              return (
                <tr key={r.team.espnId ?? r.team.name} className="border-b border-navy-50 last:border-0">
                  <td className="py-1.5 pl-2 text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded font-display text-xs font-bold tabular-nums" style={last ? { background: "#FF7F84", color: "#0c1830" } : { color: "#6079a0" }}>
                      {r.pos}
                    </span>
                  </td>
                  <td className="py-1.5">
                    <Link href={teamHref(r.team.espnId ?? "")} className="flex min-w-0 items-center gap-2 hover:text-volt-600">
                      <TeamLogo team={r.team} />
                      <span className="truncate font-semibold text-navy-900">{r.team.name}</span>
                    </Link>
                  </td>
                  <td className="py-1.5 text-center tabular-nums text-navy-600">{r.p2024 ?? "—"}</td>
                  <td className="py-1.5 text-center tabular-nums text-navy-600">{r.p2025 ?? "—"}</td>
                  <td className="py-1.5 text-center tabular-nums text-navy-600">{r.p2026}</td>
                  <td className="py-1.5 text-center tabular-nums text-navy-600">{r.points}</td>
                  <td className="py-1.5 text-center tabular-nums text-navy-600">{r.played}</td>
                  <td className="py-1.5 pr-3 text-right font-display text-base font-bold tabular-nums text-navy-950">{fmt(r.avg)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-navy-600">
        <span className="inline-block h-3 w-3 rounded" style={{ background: "#FF7F84" }} /> Desciende por promedio. Se cuentan las temporadas 2024, 2025 y 2026 en
        Primera (los que ascendieron, solo las que jugaron), sin los playoffs.
      </p>
    </div>
  );
}
