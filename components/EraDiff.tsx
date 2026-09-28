import type { HeadToHeadStats, Team } from "@/lib/types";

type Row = { label: string; detail: string; stats: HeadToHeadStats };

// Cuántos partidos le lleva un equipo al otro en el historial: en total, en la era profesional y en la amateur.
export default function EraDiff({ a, b, rows }: { a: Team; b: Team; rows: Row[] }) {
  return (
    <section className="panel overflow-hidden">
      <h2 className="border-b border-navy-100 px-4 py-3 font-display text-sm font-bold uppercase tracking-widest text-navy-900">
        Diferencia en el historial
      </h2>
      <ul className="divide-y divide-navy-100">
        {rows.map((r) => (
          <DiffRow key={r.label} a={a} b={b} row={r} />
        ))}
      </ul>
    </section>
  );
}

function DiffRow({ a, b, row }: { a: Team; b: Team; row: Row }) {
  const { stats } = row;
  const diff = stats.winsA - stats.winsB;
  const leader = diff > 0 ? a : diff < 0 ? b : null;
  const other = diff > 0 ? b : a;
  const n = Math.abs(diff);
  const text = !stats.played
    ? "Sin partidos"
    : leader
      ? `${leader.name} le lleva ${n} ${n === 1 ? "partido" : "partidos"} a ${other.name}`
      : "Historial igualado";

  return (
    <li className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[12rem_1fr_auto] sm:items-center sm:gap-4">
      <div>
        <div className="font-display text-base font-bold uppercase tracking-wide text-navy-900">{row.label}</div>
        <div className="text-xs text-navy-400">{row.detail}</div>
      </div>
      <div className="flex items-center gap-3">
        {stats.played > 0 && (
          <span
            className={`min-w-[3.5rem] rounded-full px-3 py-0.5 text-center font-display text-xl font-bold tabular-nums ${
              leader ? "bg-navy-900 text-white" : "bg-navy-100 text-navy-700"
            }`}
          >
            {leader ? `+${n}` : "0"}
          </span>
        )}
        <span className="text-sm font-semibold text-navy-800">{text}</span>
      </div>
      <div className="text-xs tabular-nums text-navy-500 sm:text-right">
        {stats.played} PJ · {a.shortName} {stats.winsA} · Emp. {stats.draws} · {b.shortName} {stats.winsB}
      </div>
    </li>
  );
}
