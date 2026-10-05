// Tablas propias del fútbol argentino que la fuente en vivo no publica: la tabla anual (Apertura + Clausura, sin playoffs)
// y los promedios del descenso (tres temporadas).
import { PLAYED_2024, PLAYED_2025, PROMEDIOS_BASE } from "../data/promedios";
import type { LiveEvent, LiveTable, LiveTableRow, LiveTeam } from "./espn";
import { isKnockout, teamKey } from "./season";

export function annualTable(events: LiveEvent[]): LiveTable {
  const rows = new Map<string, LiveTableRow>();
  const row = (t: LiveTeam) => {
    const k = teamKey(t);
    if (!rows.has(k)) rows.set(k, { pos: 0, team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 });
    return rows.get(k)!;
  };
  for (const e of events) {
    if (e.state !== "post" || isKnockout(e.round)) continue;
    const hs = Number(e.home.score ?? 0);
    const as = Number(e.away.score ?? 0);
    for (const [t, f, a] of [
      [e.home, hs, as],
      [e.away, as, hs],
    ] as const) {
      const r = row(t);
      r.played++;
      r.gf += f;
      r.ga += a;
      if (f > a) {
        r.won++;
        r.points += 3;
      } else if (f === a) {
        r.drawn++;
        r.points += 1;
      } else r.lost++;
    }
  }
  // Desempate: puntos, diferencia de gol y goles a favor (el fair play y el sorteo no se pueden calcular).
  const sorted = [...rows.values()].sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.team.name.localeCompare(b.team.name, "es"));
  sorted.forEach((r, i) => (r.pos = i + 1));
  return { name: "Tabla anual", rows: sorted };
}

export type PromedioRow = { pos: number; team: LiveTeam; p2024: number | null; p2025: number | null; p2026: number; points: number; played: number; avg: number };

export function promedios(annual: LiveTable): PromedioRow[] {
  const out: PromedioRow[] = [];
  for (const r of annual.rows) {
    const base = PROMEDIOS_BASE.find((b) => b.espnId === r.team.espnId);
    const p2024 = base?.p2024 ?? null;
    const p2025 = base?.p2025 ?? null;
    const points = (p2024 ?? 0) + (p2025 ?? 0) + r.points;
    const played = (p2024 !== null ? PLAYED_2024 : 0) + (p2025 !== null ? PLAYED_2025 : 0) + r.played;
    out.push({ pos: 0, team: r.team, p2024, p2025, p2026: r.points, points, played, avg: played ? points / played : 0 });
  }
  out.sort((a, b) => b.avg - a.avg || b.points - a.points);
  out.forEach((r, i) => (r.pos = i + 1));
  return out;
}
