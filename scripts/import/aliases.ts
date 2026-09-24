// Nombres de equipos tal como aparecen en RSSSF y en Wikipedia → club.
// `as` es el nombre de época que se muestra en los partidos cuando no coincide con el actual.
// Las identidades dudosas se confirmaron con los enlaces de las páginas de temporada de Wikipedia.
import { getTeam } from "../../lib/teams";

type Alias = { id: string; names: string[]; as?: string; from?: number; to?: number };

const ALIASES: Alias[] = [
  { id: "lomas-athletic", names: ["Lomas Athletic Club", "Lomas Athletic", "Lomas AC", "Lomas"] },
  { id: "lanus-athletic", names: ["Lanús Athletic Club", "Lanús Athletic", "Lanus Athletic", "Lanús"], to: 1899 },
  { id: "belgrano-athletic", names: ["Belgrano Athletic Club", "Belgrano Athletic", "Belgrano AC", "Belgrano"], to: 1930 },
  { id: "belgrano-athletic-b", names: ['Belgrano "B"', 'Belgrano Athletic "B"'] },
  { id: "flores-athletic", names: ["Flores Athletic Club", "Flores Athletic", "Flores AC", "Flores"] },
  { id: "palermo-athletic", names: ["Palermo Athletic Club", "Palermo Athletic"] },
  { id: "banfield", names: ["Banfield Athletic Club", "Banfield Athletic"], as: "Banfield Athletic Club", to: 1912 },
  { id: "banfield", names: ["Banfield", "CA Banfield", "Club Atlético Banfield"] },
  { id: "lobos-athletic", names: ["Lobos Athletic Club", "Lobos Athletic", "Lobos"] },
  { id: "united-banks", names: ["United Banks"] },
  { id: "alumni", names: ["English High School AC", "English High School Athletic Club", "English High School"], as: "English High School", to: 1900 },
  { id: "alumni", names: ["Alumni", "Alumni FT", "Alumni Football Team", "Alumni AC", "Alumni Athletic Club"], from: 1901 },
  { id: "quilmes", names: ["Quilmes", "Quilmes AC", "Quilmes Athletic Club"], from: 1900 },
  { id: "barracas-athletic", names: ["Barracas Athletic", "Barracas Athletic Club", "Barracas AC", "Barracas"], to: 1910 },
  {
    id: "belgrano-athletic-b",
    names: ["Belgrano Extra", "Belgrano AC Extra", "Belgrano Athletic Club Extra", "CA Belgrano Extra"],
    as: "Belgrano Extra",
  },
  // Estudiantes de Buenos Aires (Club Atlético Estudiantes, hoy en Caseros). Wikipedia: "Estudiantes (BA)".
  {
    id: "estudiantes-ba",
    names: ["Club de Estudiantes", "Estudiantes", "CA Estudiantes", "Club Atlético Estudiantes", "Atlético Estudiantes", "Estudiantes (BA)", "Estudiantes BA"],
    to: 1911,
  },
  { id: "reformer", names: ["Reformer", "Reformer AC", "Reformer Athletic Club"] },
  { id: "san-martin-athletic", names: ["San Martín Athletic", "San Martín Athletic Club", "San Martín AC", "San Martín"], to: 1912 },
  { id: "san-isidro", names: ["San Isidro", "CA San Isidro", "Club Atlético de San Isidro", "Club Atlético San Isidro"] },
  { id: "argentino-quilmes", names: ["Argentino de Quilmes", "CA Argentino de Quilmes", "Club Atlético Argentino de Quilmes"] },
  { id: "porteno", names: ["Porteño", "CA Porteño", "Club Atlético Porteño"] },
  { id: "nacional-floresta", names: ["Nacional"], to: 1912 },
  { id: "gimnasia-ba", names: ["Gimnasia y Esgrima BA", "Gimnasia y Esgrima BUE", "Gimnasia y Esgrima (BA)", "Gimnasia y Esgrima de Buenos Aires", "Club de Gimnasia y Esgrima"] },
  { id: "river", names: ["River Plate", "CA River Plate", "Club Atlético River Plate", "River"] },
  { id: "racing", names: ["Racing Club", "Racing FC", "Racing Football Club", "Racing"] },
];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export function resolveName(raw: string, year: number): { id: string; name: string; as?: string } | null {
  const n = norm(raw);
  const hit = ALIASES.find(
    (a) => (a.from === undefined || year >= a.from) && (a.to === undefined || year <= a.to) && a.names.some((x) => norm(x) === n),
  );
  if (!hit) return null;
  const team = getTeam(hit.id);
  if (!team) throw new Error(`Alias apunta a un club que no existe en lib/teams.ts: ${hit.id}`);
  return { id: hit.id, name: team.name, ...(hit.as && hit.as !== team.name && { as: hit.as }) };
}
