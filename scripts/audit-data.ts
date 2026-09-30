// Auditoría de toda la base: controles que la verificación de tablas no cubre.
//   npx tsx scripts/audit-data.ts
import { SEASONS, computeTable } from "../lib/seasons";
import { getTeam } from "../lib/teams";
import { MATCHES } from "../lib/matches";

const problems: string[] = [];
const warn: string[] = [];
const add = (list: string[], s: string) => list.length < 400 && list.push(s);

// 1. Años sin ninguna temporada de liga (1891–2025).
const leagueYears = new Set<number>();
for (const s of SEASONS) if (s.kind !== "cup") {
  leagueYears.add(s.year);
  // Temporadas de agosto a junio: cubren también el año siguiente.
  if (s.yearLabel?.includes("/")) leagueYears.add(s.year + 1);
}
for (let y = 1891; y <= 2025; y++) if (!leagueYears.has(y)) add(warn, `Año sin liga cargada: ${y}`);

// 2. Ids repetidos y partidos repetidos entre torneos.
const ids = new Map<string, string>();
const keys = new Map<string, string>();
for (const s of SEASONS)
  for (const m of s.matches) {
    if (ids.has(m.id)) add(problems, `Id repetido ${m.id} (${ids.get(m.id)} y ${s.slug})`);
    ids.set(m.id, s.slug);
    const k = `${m.date}|${m.homeId}|${m.awayId}|${m.homeGoals}-${m.awayGoals}`;
    if (keys.has(k) && keys.get(k) !== s.slug) add(problems, `Partido repetido ${k} (${keys.get(k)} y ${s.slug})`);
    keys.set(k, s.slug);
  }

// 3. Cada partido: clubes que existen, local distinto de visitante, fecha válida y dentro del rango del torneo, goles.
for (const s of SEASONS) {
  const years = s.matches.map((m) => Number(m.date.slice(0, 4)));
  for (const m of s.matches) {
    for (const id of [m.homeId, m.awayId]) if (!getTeam(id)) add(problems, `${s.slug} ${m.id}: club inexistente ${id}`);
    if (m.homeId === m.awayId) add(problems, `${s.slug} ${m.id}: el mismo club de local y visitante`);
    if (!/^\d{4}(-\d{2}-\d{2})?$/.test(m.date)) add(problems, `${s.slug} ${m.id}: fecha con formato raro "${m.date}"`);
    else if (m.date.length === 10 && Number.isNaN(Date.parse(m.date))) add(problems, `${s.slug} ${m.id}: fecha inválida ${m.date}`);
    const y = Number(m.date.slice(0, 4));
    // La Copa Ibarguren 1944 se jugó en marzo de 1947: en las copas se admite más margen.
    if (y < s.year - 1 || y > s.year + (s.kind === "cup" ? 3 : 2)) add(problems, `${s.slug} ${m.id}: fecha ${m.date} fuera del año del torneo (${s.year})`);
    if (m.homeGoals < 0 || m.awayGoals < 0 || m.homeGoals > 20 || m.awayGoals > 20) add(warn, `${s.slug} ${m.id}: resultado llamativo ${m.homeGoals}-${m.awayGoals}`);
    if (m.advancedId && m.advancedId !== m.homeId && m.advancedId !== m.awayId) add(problems, `${s.slug} ${m.id}: advancedId ${m.advancedId} no jugó el partido`);
    if (m.awardedTo && m.awardedTo !== m.homeId && m.awardedTo !== m.awayId) add(problems, `${s.slug} ${m.id}: awardedTo ${m.awardedTo} no jugó el partido`);
    // Restos en inglés en notas y canchas.
    const txt = `${m.note ?? ""} ${m.venue ?? ""}`;
    if (/\b(abandoned|awarded|remaining|played at|because|score stood|allowed to stand|postponed|replayed|withdrew|not played|the match|penalty|crowd|rain\b)/i.test(txt))
      add(problems, `${s.slug} ${m.id}: inglés en nota/cancha: ${txt.trim().slice(0, 120)}`);
    if (m.venue && (/\b\d+-\d+\b(?!\d)|\d'|^\(|\bin \d/.test(m.venue.replace(/\d{4}-\d{4}/, "")) || m.venue.length > 90)) add(warn, `${s.slug} ${m.id}: cancha rara "${m.venue}"`);
  }
  // 4. Campeones: tienen que existir y haber jugado el torneo.
  const played = new Set(s.matches.flatMap((m) => [m.homeId, m.awayId]));
  for (const c of s.championIds) {
    if (!getTeam(c)) add(problems, `${s.slug}: campeón inexistente ${c}`);
    // En las copas internacionales solo están los partidos de los clubes argentinos: el campeón puede no figurar.
    else if (s.matches.length && !played.has(c) && !s.international) add(problems, `${s.slug}: el campeón ${c} no jugó ningún partido`);
  }
  // 5. En las ligas, el campeón suele ser el primero de la tabla calculada (salvo finales, desempates y zonas).
  if (s.kind !== "cup" && s.championIds.length === 1 && s.publishedTable.length && !s.groups?.length) {
    const top = computeTable(s)[0];
    const hasFinal = s.matches.some((m) => m.phase === "playoff");
    if (top && top.teamId !== s.championIds[0] && !hasFinal) add(warn, `${s.slug}: el campeón (${s.championIds[0]}) no es el primero de la tabla (${top.teamId})`);
  }
  if (!s.summary) add(warn, `${s.slug}: sin resumen`);
  if (years.length === 0 && s.kind !== "cup") add(warn, `${s.slug}: sin partidos`);
}

// 6. Clubes con un solo partido en toda la base (posible nombre mal identificado).
const count = new Map<string, number>();
for (const m of MATCHES) for (const id of [m.homeId, m.awayId]) count.set(id, (count.get(id) ?? 0) + 1);

console.log(`Temporadas: ${SEASONS.length} · Partidos: ${MATCHES.length} · Clubes con partidos: ${count.size}`);
console.log(`\nProblemas (${problems.length}):`);
for (const p of problems) console.log("  ✗ " + p);
console.log(`\nAvisos (${warn.length}):`);
for (const w of warn) console.log("  · " + w);
process.exit(problems.length ? 1 : 0);
