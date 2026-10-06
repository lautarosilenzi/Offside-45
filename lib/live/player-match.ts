// Estadísticas de un jugador en un partido, en castellano y agrupadas como en 365Scores (sin dependencias del servidor:
// la usa la ficha que se abre al tocar un jugador).
type S = Record<string, number>;
export type PlayerStatRow = { label: string; value: string };

const has = (s: S, ...k: string[]) => k.every((x) => s[x] !== undefined);
const int = (k: string, label: string) => (s: S) => (has(s, k) ? { label, value: String(Math.round(s[k])) } : null);
const dec = (k: string, label: string) => (s: S) => (has(s, k) ? { label, value: s[k].toFixed(2) } : null);
const ratio = (ok: string, total: string, label: string) => (s: S) =>
  has(s, total) && s[total] > 0 ? { label, value: `${Math.round(s[ok] ?? 0)}/${Math.round(s[total])} (${Math.round(((s[ok] ?? 0) / s[total]) * 100)}%)` } : null;

const SECTIONS: { title: string; rows: ((s: S) => PlayerStatRow | null)[]; keeper?: boolean }[] = [
  {
    title: "Arquero",
    keeper: true,
    rows: [
      int("saves", "Atajadas"),
      int("goalsConceded", "Goles recibidos"),
      dec("goalsPrevented", "Goles evitados"),
      int("goodHighClaim", "Salidas por arriba"),
      int("accurateKeeperSweeper", "Salidas como líbero"),
      int("penaltyKicksSaved", "Penales atajados"),
    ],
  },
  {
    title: "Ataque",
    rows: [
      dec("expectedGoals", "Goles esperados"),
      int("totalShots", "Total remates"),
      int("shotsOnTarget", "Remates al arco"),
      dec("expectedGoalsOnTarget", "Goles esperados de remates al arco"),
      int("shotsOffTarget", "Remates afuera"),
      int("offsides", "Fueras de juego"),
      int("bigChanceMissed", "Grandes chances falladas"),
      int("touchesInOppBox", "Toques en el área rival"),
    ],
  },
  {
    title: "Pases",
    rows: [
      dec("expectedAssists", "Asistencias esperadas"),
      int("shotAssists", "Pases clave"),
      int("bigChanceCreated", "Grandes chances creadas"),
      int("successfulFinalThirdPasses", "Pases en el último tercio"),
      ratio("accuratePasses", "totalPasses", "Pases completados"),
      ratio("accurateLongBalls", "totalLongBalls", "Pases largos completados"),
      ratio("accurateCrosses", "totalCrosses", "Centros completados"),
      int("touches", "Toques"),
    ],
  },
  {
    title: "Defensa",
    rows: [
      ratio("effectiveTackles", "totalTackles", "Quites"),
      int("interceptions", "Intercepciones"),
      int("totalClearance", "Despejes"),
      int("ballRecovery", "Recuperaciones"),
      int("blockedShots", "Remates bloqueados"),
    ],
  },
  {
    title: "Duelos",
    rows: [
      ratio("duelsWon", "duels", "Duelos ganados"),
      int("aerialsWon", "Duelos aéreos ganados"),
      ratio("wonContest", "totalContest", "Gambetas exitosas"),
      int("foulsSuffered", "Faltas recibidas"),
      int("foulsCommitted", "Faltas cometidas"),
      int("turnover", "Pérdidas de balón"),
    ],
  },
];

export function playerSections(s: S, keeper: boolean) {
  return SECTIONS.filter((sec) => (sec.keeper ? keeper : true))
    .map((sec) => ({ title: sec.title, rows: sec.rows.map((f) => f(s)).filter((r): r is PlayerStatRow => !!r) }))
    .filter((sec) => sec.rows.length);
}
