"use client";

import Link from "next/link";
import { useState } from "react";
import Flag from "@/components/Flag";

export type LegendRow = {
  id: string;
  rank: number;
  name: string;
  flag?: string;
  country: string;
  apps: number;
  goals: number;
  intlApps: number;
  intlGoals: number;
  titles: number;
  worldCups: number;
  ballons: number;
};

const COLS: { key: keyof LegendRow | "ratio"; label: string; title: string }[] = [
  { key: "rank", label: "#", title: "Puesto en la lista" },
  { key: "apps", label: "PJ", title: "Partidos oficiales (clubes y selección)" },
  { key: "goals", label: "Goles", title: "Goles oficiales (clubes y selección)" },
  { key: "ratio", label: "G/PJ", title: "Goles por partido" },
  { key: "intlGoals", label: "Gol sel.", title: "Goles con la selección mayor" },
  { key: "titles", label: "Títulos", title: "Títulos ganados como jugador" },
  { key: "worldCups", label: "Mund.", title: "Mundiales ganados" },
  { key: "ballons", label: "BdO", title: "Balones de Oro" },
];

// Las 25 leyendas en una tabla: tocá una columna para ordenar; tocá un jugador para compararlo con el elegido.
export default function LegendsTable({ rows, compareWith }: { rows: LegendRow[]; compareWith: string }) {
  const [sort, setSort] = useState<(typeof COLS)[number]["key"]>("rank");
  const val = (r: LegendRow, k: (typeof COLS)[number]["key"]) => (k === "ratio" ? r.goals / r.apps : r[k]);
  const sorted = [...rows].sort((x, y) => {
    if (sort === "rank") return x.rank - y.rank;
    return (val(y, sort) as number) - (val(x, sort) as number) || x.rank - y.rank;
  });
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[40rem] text-sm">
        <thead>
          <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
            <th className="py-2 pl-4 text-left">
              <SortButton active={sort === "rank"} onClick={() => setSort("rank")} title="Puesto en la lista">
                #
              </SortButton>
            </th>
            <th className="py-2 text-left">Jugador</th>
            {COLS.slice(1).map((c) => (
              <th key={c.key} className="py-2 pr-3 text-right">
                <SortButton active={sort === c.key} onClick={() => setSort(c.key)} title={c.title}>
                  {c.label}
                </SortButton>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-50">
          {sorted.map((r) => (
            <tr key={r.id}>
              <td className="py-1.5 pl-4 tabular-nums text-navy-400">{r.rank}</td>
              <td className="py-1.5">
                <Link href={`/jugadores?a=${compareWith === r.id ? "messi" : compareWith}&b=${r.id}`} scroll={false} className="flex items-center gap-2 font-semibold text-navy-900 hover:text-volt-600">
                  <Flag code={r.flag} size={12} title={r.country} /> {r.name}
                </Link>
              </td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{r.apps.toLocaleString("es-AR")}</td>
              <td className="py-1.5 pr-3 text-right font-bold tabular-nums">{r.goals.toLocaleString("es-AR")}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{(r.goals / r.apps).toLocaleString("es-AR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{r.intlGoals}</td>
              <td className="py-1.5 pr-3 text-right font-bold tabular-nums">{r.titles}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{r.worldCups || "—"}</td>
              <td className="py-1.5 pr-3 text-right tabular-nums">{r.ballons || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortButton({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title} aria-pressed={active} className={`uppercase tracking-wider transition hover:text-volt-600 ${active ? "text-volt-600 underline underline-offset-4" : ""}`}>
      {children}
      {active && " ↓"}
    </button>
  );
}
