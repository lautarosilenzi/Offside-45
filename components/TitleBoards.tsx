import Link from "next/link";
import { positions } from "@/lib/rank";
import { getTeam } from "@/lib/teams";
import type { Team } from "@/lib/types";
import Crest from "./Crest";

// Una edición de una copa: campeón y finalista (clubes por id o selecciones por nombre).
export type FinalRow = {
  year: number;
  yearLabel?: string;
  champion?: string;
  runnerUp?: string;
  href?: string;
  // Resultado de la final, sede, aclaraciones.
  detail?: string;
  status?: string;
};

// Nombre y escudo: los clubes salen de lib/teams; las selecciones van solo con el nombre.
function Who({ id, size = "xs", bold }: { id: string; size?: "xs" | "sm"; bold?: boolean }) {
  const team = getTeam(id);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {team && <Crest team={team} size={size} />}
      <span className={`min-w-0 leading-tight ${bold ? "font-semibold text-navy-900" : "text-navy-700"}`}>{team ? shortName(team) : id}</span>
    </span>
  );
}

// "Peñarol (Uruguay)" → "Peñarol": el país va en su propia columna.
const shortName = (t: Team) => (t.country ? t.name.replace(/\s*\([^)]*\)$/, "") : t.name);
export const countryOf = (id: string) => {
  const t = getTeam(id);
  return t ? (t.country ?? "Argentina") : id;
};

type Rank = { id: string; titles: number; finals: number; years: number[] };

// Títulos y finales perdidas de cada campeón. Con igual cantidad de títulos, primero el que llegó antes.
export function rankFinals(rows: FinalRow[], key: (id: string) => string = (id) => id): Rank[] {
  const map = new Map<string, Rank>();
  const get = (id: string) => map.get(id) ?? (map.set(id, { id, titles: 0, finals: 0, years: [] }), map.get(id)!);
  for (const r of [...rows].sort((a, b) => a.year - b.year)) {
    if (r.champion) {
      const c = get(key(r.champion));
      c.titles++;
      c.years.push(r.year);
    }
    if (r.runnerUp) get(key(r.runnerUp)).finals++;
  }
  return [...map.values()]
    .filter((r) => r.titles > 0)
    .sort((a, b) => b.titles - a.titles || b.finals - a.finals || a.years[a.titles - 1] - b.years[b.titles - 1]);
}

// Tabla de campeones: títulos, finales perdidas y los años de cada título.
export function RankTable({ rows, label = "Club", finals = true, by }: { rows: FinalRow[]; label?: string; finals?: boolean; by?: (id: string) => string }) {
  const ranking = rankFinals(rows, by);
  const pos = positions(ranking, (r) => r.titles);
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
            <th className="w-10 py-2 pl-4 text-left">#</th>
            <th className="py-2 text-left">{label}</th>
            <th className="w-20 py-2.5 pr-4 text-right sm:pr-3">Títulos</th>
            {finals && <th className="hidden w-24 py-2.5 pr-4 text-right sm:table-cell md:pr-3">Subcamp.</th>}
            <th className="hidden py-2 pl-6 pr-4 text-left md:table-cell">Años</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {ranking.map((r, i) => (
            <tr key={r.id}>
              <td className="py-2.5 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
              <td className="max-w-[14rem] py-2.5 pr-2">
                <Who id={r.id} bold />
              </td>
              <td data-confetti className="cursor-default py-2.5 pr-4 text-right font-display text-base font-bold tabular-nums text-navy-950 sm:pr-3">{r.titles}</td>
              {finals && <td className="hidden py-2.5 pr-4 text-right tabular-nums text-navy-500 sm:table-cell md:pr-3">{r.finals}</td>}
              <td className="hidden py-2.5 pl-6 pr-4 text-xs tabular-nums text-navy-500 md:table-cell">{r.years.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Campeón y finalista de cada edición, de la más nueva a la más vieja. Al lado del campeón, el número de título que
// ganó ese año (contando los anteriores de la misma lista). Con era, la lista se separa por etapas (amateur y
// profesional) con un título en cada una.
export function YearList({ rows, era }: { rows: FinalRow[]; era?: (r: FinalRow) => string }) {
  const nth = new Map<FinalRow, number>();
  const seen = new Map<string, number>();
  for (const r of [...rows].sort((a, b) => a.year - b.year)) {
    if (!r.champion) continue;
    seen.set(r.champion, (seen.get(r.champion) ?? 0) + 1);
    nth.set(r, seen.get(r.champion)!);
  }
  const list = [...rows].reverse();
  return (
    <ul className="panel divide-y divide-navy-100 overflow-hidden">
      {list.map((r, i) => {
        const header = era && (i === 0 || era(list[i - 1]) !== era(r)) ? era(r) : undefined;
        const body = (
          <>
            <span className="font-display text-xl font-bold tabular-nums text-navy-900">{r.yearLabel ?? r.year}</span>
            <span className="min-w-0">
              {r.champion ? (
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Who id={r.champion} size="sm" bold />
                  {nth.get(r) && (
                    <span className="shrink-0 rounded-full bg-gold-400/15 px-2 py-0.5 text-[0.7rem] font-semibold text-gold-500 ring-1 ring-gold-400/30" title="Títulos que llevaba hasta ese año">
                      {nth.get(r)}.º título
                    </span>
                  )}
                  {r.runnerUp && (
                    <span className="flex min-w-0 items-center gap-1.5 text-xs text-navy-500">
                      <span className="shrink-0">vs.</span>
                      <Who id={r.runnerUp} />
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm text-navy-500">{r.status ?? "Sin campeón"}</span>
              )}
              {r.detail && <span className="mt-0.5 block text-xs text-navy-400">{r.detail}</span>}
            </span>
          </>
        );
        const cls = "grid grid-cols-[4.5rem_1fr] items-center gap-3 px-4 py-2.5";
        return (
          <li key={`${r.year}-${r.yearLabel ?? ""}-${r.champion ?? ""}`}>
            {header && <div className="bg-navy-950 px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest text-white">{header}</div>}
            {r.href ? (
              <Link href={r.href} className={`${cls} transition hover:bg-brand-50/60`}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Tarjeta chica con los campeones de una copa (para las listas de /copas y /internacionales).
export function MiniTable({ title, rows, href }: { title: string; rows: { id: string; titles: number; years: number[] }[]; href?: string }) {
  return (
    <div className="panel flex flex-col overflow-hidden">
      <h3 className="border-b border-navy-100 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-navy-900">
        {href ? (
          <a href={href} className="hover:text-brand-500">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <ol className="divide-y divide-navy-50 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-2 px-4 py-1.5" title={r.years.join(", ")}>
            <span className="min-w-0 flex-1">
              <Who id={r.id} />
            </span>
            <span className="font-display text-base font-bold tabular-nums text-navy-950">{r.titles}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Ancla de cada copa: "Copa de Oro Nicolás Leoz" → "copa-de-oro-nicolas-leoz".
export const slugify = (s: string) =>
  [...s.normalize("NFD")]
    .filter((c) => c.charCodeAt(0) < 0x300 || c.charCodeAt(0) > 0x36f)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
