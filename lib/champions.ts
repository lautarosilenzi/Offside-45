import DATA from "./data/champions.generated.json";

// Campeones de cada competencia con datos en vivo (scripts/champions: listas de Wikipedia verificadas contra la tabla de
// títulos por club de cada artículo). Las competencias con historia propia en el sitio (Liga Profesional, Copa
// Argentina, Libertadores…) no están acá: tienen su sección.
export type ChampionRow = { season: string; champion: string; runnerUp?: string };
type Data = Record<string, { source: string; rows: ChampionRow[] }>;
// Limpieza de las anotaciones que vienen de las tablas originales: "(TA)" o "(PD & CA)" (por qué clasificó), "(II)"
// (división del finalista), "Vicenza/Torino" (subcampeones empatados), "2024–25 / Finals".
const tidyName = (s: string) =>
  s
    .replace(/\s*\((TA|TC|PD|CA|PD & CA)\)$/, "")
    .replace(/\s*\(II\)$/, " (Segunda División)")
    .replace(/\s*\(III\)$/, " (Tercera División)")
    .replace(/\(Not finished\)/i, "(sin terminar)")
    .replace(/\s*\/\s*/g, " y ");
const tidySeason = (s: string) => s.replace(/^.*?(\d{4}(?:[–-]\d{2,4})?).*?\/\s*Finals$/i, "$1").replace(/\s*\/\s*\(/, " (");
const D: Data = Object.fromEntries(
  Object.entries(DATA as Data).map(([id, d]) => [
    id,
    { ...d, rows: d.rows.map((r) => ({ season: tidySeason(r.season), champion: tidyName(r.champion), runnerUp: r.runnerUp ? tidyName(r.runnerUp) : undefined })) },
  ]),
);

export const championsOf = (id: string) => D[id];

// Para comparar nombres de distintas fuentes: sin tildes, sin "FC", "CF", "AC", "Club"…
export const normName = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(fc|cf|ac|sc|cd|ca|afc|club|de|the|f\.c\.|a\.c\.)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

// Nombres de ESPN → nombre en las listas de campeones, cuando no coinciden.
const ESPN_TO_LIST: Record<string, string> = {
  internazionale: "inter",
  intermilan: "inter",
  athletic: "athleticbilbao",
  bayernmunchen: "bayernmunich",
  psg: "parissaintgermain",
};

export type TitleCount = { club: string; titles: number; last: string };

// Ranking de campeones: títulos por club, con la última vez que lo ganó.
export function titlesByClub(id: string): TitleCount[] {
  const rows = D[id]?.rows ?? [];
  const map = new Map<string, TitleCount>();
  for (const r of rows) {
    const k = normName(r.champion);
    const t = map.get(k) ?? { club: r.champion, titles: 0, last: r.season };
    t.titles++;
    map.set(k, t);
  }
  return [...map.values()].sort((a, b) => b.titles - a.titles || b.last.localeCompare(a.last));
}

// Títulos de un equipo (por su nombre en la fuente en vivo).
export function titlesOf(id: string, teamName: string): number {
  const k = normName(teamName);
  const target = ESPN_TO_LIST[k] ?? k;
  return titlesByClub(id).find((t) => normName(t.club) === target)?.titles ?? 0;
}
