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
  // Desde 1912 "Estudiantes" a secas es el de Buenos Aires en la Asociación; en la Federación (La Plata) se usa un alias local.
  { id: "estudiantes-ba", names: ["Atlético Estudiantes", "Estudiantes (BA)", "Estudiantes BA", "Club de Estudiantes", "Estudiantes"], from: 1912 },
  // Estudiantes de La Plata.
  { id: "estudiantes", names: ["Estudiantes LPG", "Estudiantes LP", "Estudiantes de La Plata", "Estudiantes (LP)", "Club Estudiantes de La Plata"] },
  { id: "independiente", names: ["Independiente", "Independiente (Ave)", "Independiente (A)", "CA Independiente", "Club Atlético Independiente", "Indpendiente"] },
  { id: "atlanta", names: ["Atlanta", "Atlanta AC", "Atlanta Athletic Club", "Club Atlético Atlanta"] },
  { id: "kimberley", names: ["Kimberley", "Kimberley AC", "Kimberley Athletic Club", "Kimberley Atlético Club"] },
  { id: "sportiva-argentina", names: ["Sportiva Argentina", "Sociedad Sportiva Argentina"] },
  { id: "boca", names: ["Boca Juniors", "CA Boca Juniors", "Club Atlético Boca Juniors", "Boca"] },
  { id: "platense", names: ["Platense", "CA Platense", "Club Atlético Platense", "Platense (VL)"] },
  // Platense (Retiro): se separó de Platense, jugó en la Asociación Argentina desde 1921 y después se llamó Universal.
  { id: "platense-retiro", names: ["Platense II", "Platense (BA)", "Platense (Retiro)"], as: "Platense (Retiro)" },
  { id: "platense-retiro", names: ["Universal"], as: "Universal" },
  { id: "estudiantil-porteno", names: ["Estudiantil Porteño", "CA Estudiantil Porteño", "Club Atlético Estudiantil Porteño"] },
  { id: "comercio", names: ["Comercio", "Comercio FBC", "Comercio Foot Ball Club", "Club Atlético Comercio"] },
  { id: "ferro", names: ["Ferro Carril Oeste", "CA Ferro Carril Oeste", "Club Atlético Ferro Carril Oeste", "Club Ferro Carril Oeste", "Ferro Carril Oeste (BA)", "FC Oeste"] },
  { id: "ferrocarril-sud", names: ["Ferrocarril Sud", "CA Ferrocarril Sud", "Club Atlético del Ferrocarril Sud", "Ferrocarril Gran Sud"] },
  { id: "olivos", names: ["Olivos", "CA Olivos", "Club Atlético Olivos"] },
  { id: "riachuelo", names: ["Riachuelo", "CA Riachuelo", "Club Atlético Riachuelo"] },
  { id: "tigre", names: ["Tigre", "CA Tigre", "Club Atlético del Tigre", "Club Atlético Tigre"] },
  { id: "columbian", names: ["Hispano Argentino", "Club Hispano Argentino"], as: "Hispano Argentino" },
  { id: "columbian", names: ["Columbian", "Club Columbian"] },
  { id: "huracan", names: ["Huracán", "Huracán (BA)", "CA Huracán", "Club Atlético Huracán"] },
  { id: "floresta", names: ["Floresta", "Sportivo Floresta", "Club Sportivo Floresta", "Club Floresta", "Club Atlético Floresta"] },
  { id: "sanlorenzo", names: ["San Lorenzo", "San Lorenzo de Almagro", "CA San Lorenzo de Almagro", "Club Atlético San Lorenzo de Almagro"] },
  { id: "defensores-belgrano", names: ["Defensores de Belgrano", "Club Atlético Defensores de Belgrano"] },
  { id: "sportivo-barracas", names: ["Sportivo Barracas", "Club Sportivo Barracas", "Club Sportivo Barracas Bolívar"] },
  {
    id: "gimnasia",
    names: [
      "Gimnasia y Esgrima LP",
      "Gimnasia y Esgrima La Plata",
      "Gimnasia y Esgrima (LP)",
      "Gimnasia y Esgrima(LP)",
      "Gimansia y Esgrima LP",
      "Gimnsasia y Esgrima LP",
      "Club de Gimnasia y Esgrima La Plata",
    ],
  },
  { id: "central", names: ["Rosario Central", "Club Atlético Rosario Central"] },
  // Segundo cisma (1919–1926).
  { id: "eureka", names: ["Eureka"] },
  // Wikipedia: Sportivo Almagro es el actual Club Almagro (no Columbian).
  { id: "almagro", names: ["Sportivo Almagro", "Sportivo de Almagro", "Spotivo de Almagro"], as: "Sportivo Almagro" },
  { id: "almagro", names: ["Almagro", "Club Almagro"] },
  { id: "velez", names: ["Vélez Sarsfield", "Velez Sarsfield", "Club Atlético Vélez Sarsfield"] },
  { id: "lanus", names: ["Lanús", "Club Atlético Lanús"], from: 1915 },
  { id: "del-plata", names: ["Del Plata", "Club Del Plata", "Club Atlético Del Plata"] },
  { id: "nueva-chicago", names: ["Nueva Chicago", "Club Atlético Nueva Chicago"] },
  { id: "palermo", names: ["Palermo", "Club Atlético Palermo"], from: 1915 },
  { id: "sportivo-palermo", names: ["Sportivo Palermo", "Club Sportivo Palermo"] },
  // Wikipedia: Sportivo del Norte es el actual Colegiales (Munro).
  { id: "colegiales", names: ["Sportivo del Norte"], as: "Sportivo del Norte" },
  { id: "colegiales", names: ["Colegiales", "Club Atlético Colegiales"] },
  { id: "barracas-central", names: ["Barracas Central", "Club Atlético Barracas Central"] },
  { id: "sportivo-buenos-aires", names: ["Sportivo Buenos Aires", "Club Social y Sportivo Buenos Aires"] },
  { id: "general-mitre", names: ["General Mitre", "Club General Mitre"] },
  { id: "argentinos", names: ["Argentinos Juniors", "Argentinos", "Asociación Atlética Argentinos Juniors"] },
  { id: "alvear", names: ["Alvear", "Club Alvear", "Club Atlético Alvear"] },
  { id: "boca-alumni", names: ["Boca Alumni", "Club Boca Alumni"] },
  { id: "el-porvenir", names: ["El Porvenir", "Club El Porvenir"] },
  { id: "progresista", names: ["Progresista", "Club Progresista"] },
  { id: "san-fernando", names: ["San Fernando", "Club San Fernando"] },
  { id: "sportivo-dock-sud", names: ["Sportivo Dock Sud", "Dock Sud", "Club Sportivo Dock Sud"] },
  { id: "argentino-banfield", names: ["Argentino de Banfield", "Club Argentino de Banfield"] },
  { id: "argentino-del-sud", names: ["Argentino del Sud", "Argentinos del Sud", "Club Argentino del Sud", "Club Atlético Argentino del Sud"] },
  { id: "temperley", names: ["Temperley", "Club Atlético Temperley"] },
  // Wikipedia 1924: "Urquiza" es el Club Villa Urquiza.
  { id: "villa-urquiza", names: ["Villa Urquiza", "Club Villa Urquiza", "Urquiza"] },
  { id: "all-boys", names: ["All Boys", "Club Atlético All Boys"] },
  { id: "liberal-argentino", names: ["Liberal Argentino", "Club Liberal Argentino"] },
  { id: "sportsman", names: ["Sportsman", "Club Atlético Sportsman"] },
  { id: "chacarita", names: ["Chacarita Juniors", "Club Atlético Chacarita Juniors"] },
  { id: "excursionistas", names: ["Excursionistas", "Club Atlético Excursionistas"] },
  { id: "general-san-martin", names: ["General San Martín", "Gral. San Martín", "Club Atlético General San Martín"] },
  { id: "sportivo-balcarce", names: ["Sportivo Balcarce", "Club Sportivo Balcarce"] },
  { id: "talleres-re", names: ["Talleres RE", "Talleres (RdE)", "Club Atlético Talleres (Remedios de Escalada)"] },
  { id: "estudiantes-ba", names: ["Estudiantes (C)"] },
  { id: "honor-y-patria", names: ["Honor y Patria"] },
  { id: "newells", names: ["Newell's Old Boys", "Newells Old Boys", "Club Atlético Newell's Old Boys"] },
  { id: "remedios-escalada", names: ["Remedios de Escalada"] },
  { id: "reformer", names: ["Reformer", "Reformer AC", "Reformer Athletic Club"] },
  { id: "san-martin-athletic", names: ["San Martín Athletic", "San Martín Athletic Club", "San Martín AC", "San Martín"], to: 1912 },
  { id: "san-isidro", names: ["San Isidro", "CA San Isidro", "Club Atlético de San Isidro", "Club Atlético San Isidro"] },
  { id: "argentino-quilmes", names: ["Argentino de Quilmes", "CA Argentino de Quilmes", "Club Atlético Argentino de Quilmes"] },
  { id: "porteno", names: ["Porteño", "CA Porteño", "Club Atlético Porteño"] },
  { id: "nacional-floresta", names: ["Nacional"], to: 1912 },
  { id: "gimnasia-ba", names: ["Gimnasia y Esgrima BA", "Gimnasia y Esgrima BUE", "Gimnasia y Esgrima (BA)", "Gimnasia y Esgrima de Buenos Aires", "Club de Gimnasia y Esgrima"] },
  { id: "river", names: ["River Plate", "CA River Plate", "Club Atlético River Plate", "River"] },
  { id: "racing", names: ["Racing Club", "Racing FC", "Racing Football Club", "Racing"] },
  // Copas nacionales: equipos de La Plata con el nombre completo, y de Rosario y Santa Fe.
  { id: "estudiantes", names: ["Estudiantes (La Plata)"] },
  { id: "gimnasia", names: ["Gimnasia y Esgrima (La Plata)"] },
  { id: "ferro", names: ["Ferro Carril Oeste de BA", "FCO"] },
  { id: "columbian", names: ["Columbian FC", "Columbian Football Club", "Columbian Footbal Club"] },
  { id: "sportivo-barracas", names: ["CS Barracas"] },
  // Solo aparecen como canchas: "GEBA, Palermo", "CASI, San Isidro".
  { id: "gimnasia-ba", names: ["GEBA"] },
  { id: "san-isidro", names: ["CASI", "CAd San Isidro"] },
  { id: "rosario-athletic", names: ["Rosario AC", "Rosario Athletic", "Rosario Athletic Club"] },
  // "Argentino (R)" es el Club Atlético Argentino de Rosario, que en 1914 pasó a llamarse Gimnasia y Esgrima de Rosario.
  { id: "gimnasia-rosario", names: ["Argentino (R)", "Argentino (Rosario)"], as: "Argentino (Rosario)", to: 1914 },
  {
    id: "gimnasia-rosario",
    names: ["Gimnasia y Esgrima Rosario", "Gimnasia y Esgrima dR", "Gimnasia y Esgrima de Rosario", "Gimnasia y Esgrima (R)", "Club Gimnasia y Esgrima dR", "Club Gimnasia y Esgrima Rosario"],
  },
  { id: "provincial-rosario", names: ["Provincial", "Provincial (Rosario)"] },
  { id: "tiro-federal-rosario", names: ["Tiro Federal", "Tiro Federal Argentino", "Tiro Fedreral Argentino", "Tiro Federal (Rosario)"] },
  { id: "belgrano-rosario", names: ["Belgrano (Rosario)", "Belgrano de Rosario", "Belgrano (R)"] },
  { id: "central-cordoba-rosario", names: ["Central Córdoba", "Central Córdoba (Rosario)", "Central Córdoba (R)"] },
  { id: "sparta-rosario", names: ["Sparta", "Sparta (Rosario)"] },
  // El actual Argentino de Rosario se llamó Club Atlético Nacional hasta 1934.
  { id: "argentino-rosario", names: ["Nacional", "Nacional (Rosario)", "Nacional (R)"], as: "Nacional (Rosario)", from: 1913, to: 1933 },
  { id: "rosario-puerto-belgrano", names: ["Rosario a Puerto Belgrano", "Rosario Puerto Belgrano"] },
  { id: "union-santa-fe", names: ["Unión", "Unión (Santa Fe)", "Unión Santa Fe"] },
  // Uruguayos (Copa Chevallier Boutell). "Nacional" a secas se resuelve con un alias local.
  { id: "albion-uy", names: ["Albion FC", "Albion", "Albion Football Club"] },
  { id: "curcc-uy", names: ["CURCC", "Central Uruguay Railway Cricket Club"] },
  { id: "nacional-uy", names: ["Club Nacional de Football", "Nacional (Montevideo)"] },
  { id: "deutscher-uy", names: ["Deutscher FK", "Deustcher FK", "Deutscher", "Deustcher"] },
  { id: "wanderers-uy", names: ["Montevideo Wanderers", "Montevideo Wanderers FC", "Montevideo Wanderers Football Club", "Wanderers"] },
];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[“”]/g, '"')
    // Apóstrofos de Windows-1252 (0x92) y tipográficos: "Newell’s".
    .replace(/[\u0092’`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// Alias propios de un torneo (tienen prioridad): el mismo nombre puede ser otro club en otra liga del mismo año.
let local: Record<string, string> = {};
export function setLocalAliases(aliases: Record<string, string> | undefined) {
  local = Object.fromEntries(Object.entries(aliases ?? {}).map(([k, v]) => [norm(k), v]));
}

// `exact`: sin sacar la forma jurídica (las canchas: "Club Atlético de Flores" no es Flores Athletic).
export function resolveName(raw: string, year: number, exact = false): { id: string; name: string; as?: string } | null {
  const direct = resolveExact(raw, year);
  if (direct || exact) return direct;
  // Las páginas de copas anteponen la forma jurídica ("CA Boca Juniors", "CAd San Isidro", "Cd Gimnasia...").
  const stripped = raw.replace(/^(CAd|CA|Cd|CS|CSD|SC|AA|AC|Club Atlético de|Club Atlético|Club de|Club)\s+/, "");
  return stripped !== raw ? resolveExact(stripped, year) : null;
}

function resolveExact(raw: string, year: number): { id: string; name: string; as?: string } | null {
  const n = norm(raw);
  if (local[n]) {
    const team = getTeam(local[n]);
    if (!team) throw new Error(`Alias local apunta a un club que no existe: ${local[n]}`);
    return { id: team.id, name: team.name };
  }
  const hit = ALIASES.find(
    (a) => (a.from === undefined || year >= a.from) && (a.to === undefined || year <= a.to) && a.names.some((x) => norm(x) === n),
  );
  if (!hit) return null;
  const team = getTeam(hit.id);
  if (!team) throw new Error(`Alias apunta a un club que no existe en lib/teams.ts: ${hit.id}`);
  return { id: hit.id, name: team.name, ...(hit.as && hit.as !== team.name && { as: hit.as }) };
}
