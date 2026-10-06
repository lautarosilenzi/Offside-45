"use client";

import { useEffect, useState } from "react";
import type { LiveTable as Table } from "@/lib/live/espn";
import { getTeam } from "@/lib/teams";
import Crest from "../Crest";

// Tabla de posiciones en vivo de una competencia (se actualiza cada 2 minutos). `marks`: puestos a destacar
// (ej. los que clasifican a octavos) con su color.
export default function LiveTable({
  code,
  marks,
  onLoad,
}: {
  code: string;
  marks?: { upTo: number; className: string; label: string }[];
  onLoad?: (tables: Table[]) => void;
}) {
  const [tables, setTables] = useState<Table[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/tabla?liga=${code}`);
        const j = await r.json();
        if (!alive) return;
        setTables(j.tables ?? []);
        setFailed(!!j.error);
        onLoad?.(j.tables ?? []);
      } catch {
        if (alive) setFailed(true);
      }
    };
    load();
    const t = setInterval(load, 120000);
    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onLoad se pasa una sola vez
  }, [code]);

  if (tables === null) return <div className="skeleton h-80 rounded-3xl" />;
  if (failed || !tables.length) return <p className="panel px-6 py-8 text-center text-navy-500">La tabla en vivo no está disponible en este momento.</p>;

  return (
    <div className={`grid gap-4 ${tables.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {tables.map((t) => (
        <div key={t.name} className="panel overflow-x-auto">
          {tables.length > 1 && (
            <div className="border-b border-navy-100 bg-navy-950 px-4 py-2 font-display text-sm font-bold uppercase tracking-widest text-white">{t.name}</div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                <th className="w-8 py-2 pl-3 text-left">#</th>
                <th className="py-2 text-left">Equipo</th>
                <th className="w-10 py-2 text-right">Pts</th>
                <th className="w-8 py-2 text-right">PJ</th>
                <th className="hidden w-8 py-2 text-right sm:table-cell">G</th>
                <th className="hidden w-8 py-2 text-right sm:table-cell">E</th>
                <th className="hidden w-8 py-2 text-right sm:table-cell">P</th>
                <th className="w-14 py-2 pr-3 text-right">Dif</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => {
                const mark = marks?.find((m) => r.pos <= m.upTo);
                const ours = r.team.teamId ? getTeam(r.team.teamId) : undefined;
                const diff = r.gf - r.ga;
                return (
                  <tr key={r.team.name} className="table-row border-b border-navy-50 last:border-0">
                    <td className="py-2.5 pl-3">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md font-display text-xs font-bold tabular-nums ${mark ? mark.className : "text-navy-400"}`}>
                        {r.pos}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="flex min-w-0 items-center gap-2">
                        {ours ? (
                          <Crest team={ours} size="xs" />
                        ) : r.team.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element -- escudo de la fuente en vivo
                          <img src={r.team.logo} alt="" loading="lazy" className="logo-img h-5 w-5 object-contain" />
                        ) : null}
                        <span className="truncate font-semibold text-navy-900">{r.team.name}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.points}</td>
                    <td className="py-2.5 text-right tabular-nums text-navy-600">{r.played}</td>
                    <td className="hidden py-2.5 text-right tabular-nums text-navy-600 sm:table-cell">{r.won}</td>
                    <td className="hidden py-2.5 text-right tabular-nums text-navy-600 sm:table-cell">{r.drawn}</td>
                    <td className="hidden py-2.5 text-right tabular-nums text-navy-600 sm:table-cell">{r.lost}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-navy-500">{diff > 0 ? `+${diff}` : diff}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {marks && (
        <p className="flex flex-wrap gap-3 text-xs text-navy-500 lg:col-span-2">
          {marks.map((m) => (
            <span key={m.label} className="flex items-center gap-1.5">
              <span className={`inline-block h-3 w-3 rounded ${m.className}`} /> {m.label}
            </span>
          ))}
          <span className="ml-auto">Tabla en vivo: ESPN</span>
        </p>
      )}
    </div>
  );
}
