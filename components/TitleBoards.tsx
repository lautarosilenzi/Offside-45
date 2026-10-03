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
      <span className={`truncate ${bold ? "font-semibold text-navy-900" : "text-navy-700"}`}>{team ? shortName(team) : id}</span>
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
            <th className="w-16 py-2 text-right">Títulos</th>
            {finals && <th className="hidden w-24 py-2 text-right sm:table-cell">Subcamp.</th>}
            <th className="hidden py-2 pl-6 pr-4 text-left md:table-cell">Años</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {ranking.map((r, i) => (
            <tr key={r.id}>
              <td className="py-2 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
              <td className="max-w-[14rem] py-2">
                <Who id={r.id} bold />
              </td>
              <td data-confetti className="cursor-default py-2 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.titles}</td>
              {finals && <td className="hidden py-2 text-right tabular-nums text-navy-500 sm:table-cell">{r.finals}</td>}
              <td className="hidden py-2 pl-6 pr-4 text-xs tabular-nums text-navy-500 md:table-cell">{r.years.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Campeón y finalista de cada edición, de la más nueva a la más vieja.
export function YearList({ rows }: { rows: FinalRow[] }) {
  return (
    <ul className="panel divide-y divide-navy-100">
      {[...rows].reverse().map((r) => {
        const body = (
          <>
            <span className="font-display text-xl font-bold tabular-nums text-navy-900">{r.yearLabel ?? r.year}</span>
            <span className="min-w-0">
              {r.champion ? (
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Who id={r.champion} size="sm" bold />
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
          <li key={`${r.year}-${r.yearLabel ?? ""}`}>
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
