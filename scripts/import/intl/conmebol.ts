// Importa los partidos de los clubes argentinos en una copa de la Conmebol a partir de dos fuentes de RSSSF:
//   1. La página "Argentinian Clubs in …": todos los partidos de cada club argentino (fecha, ciudad, resultado).
//   2. La página de cada edición: confirma el resultado y dice quién fue local.
// Uso: npx tsx scripts/import/intl/conmebol.ts libertadores
// Escribe scripts/import/data/<copa>.json (ediciones y partidos) y lib/data/foreign-clubs.generated.json (rivales).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { readClubPage, type ClubPageMatch } from "./club-pages";
import { nameKey, readEditionPage, type EditionLine } from "./edition-pages";
import { wikiChampions, wikiMatches, type WikiFinalist, type WikiMatch } from "./wiki-matches";

// ───────── Clubes argentinos ─────────
// Nombres con que aparecen en RSSSF (encabezado del bloque, línea de partido y páginas de cada edición) y ciudades
// donde fueron locales (para los partidos que la página de la edición no confirma).
export const ARG: { id: string; names: string[]; cities: string[] }[] = [
  { id: "argentinos", names: ["Argentinos Juniors", "Argentinos Jrs.", "Argentinos Jrs", "Argentinos"], cities: ["Buenos Aires"] },
  { id: "arsenal", names: ["Arsenal", "Arsenal de Sarandí"], cities: ["Sarandí", "Avellaneda"] },
  { id: "atletico-tucuman", names: ["Atlético Tucumán"], cities: ["S.M.de Tucumán", "San Miguel de Tucumán", "Tucumán"] },
  { id: "banfield", names: ["Banfield"], cities: ["Banfield"] },
  { id: "belgrano", names: ["Belgrano (Córdoba)", "Belgrano (Cba.)", "Belgrano"], cities: ["Córdoba"] },
  { id: "boca", names: ["Boca Juniors", "Boca"], cities: ["Buenos Aires"] },
  { id: "central-cordoba-sde", names: ["Central Córdoba (Santiago del Estero)", "Central Córdoba", "Córdoba (Santiago del Estero)"], cities: ["Santiago del Estero"] },
  { id: "colon-santa-fe", names: ["Colón (Santa Fe)", "Colón"], cities: ["Santa Fe"] },
  { id: "deportivo-espanol", names: ["Deportivo Español"], cities: ["Buenos Aires"] },
  { id: "defensa-y-justicia", names: ["Defensa y Justicia"], cities: ["Florencio Varela"] },
  { id: "estudiantes", names: ["Estudiantes (La Plata)", "Estudiantes LP", "Estudiantes de La Plata", "Estudiantes"], cities: ["La Plata", "Quilmes"] },
  { id: "union-santa-fe", names: ["Unión (Santa Fe)", "Unión"], cities: ["Santa Fe"] },
  { id: "ferro", names: ["Ferro Carril Oeste", "Ferro Carril O."], cities: ["Buenos Aires"] },
  { id: "gimnasia", names: ["Gimnasia y Esgrima (La Plata)", "Gimnasia y Esgr.LP", "Gimnasia y Esgrima LP", "Gimnasia y Esgrima", "Gimnasia (LP)"], cities: ["La Plata"] },
  { id: "godoy-cruz", names: ["Godoy Cruz Antonio Tomba (Mendoza)", "Godoy Cruz A.T.", "Godoy Cruz AT", "Godoy Cruz"], cities: ["Mendoza"] },
  { id: "huracan", names: ["Huracán"], cities: ["Buenos Aires"] },
  { id: "independiente", names: ["Independiente"], cities: ["Avellaneda"] },
  { id: "lanus", names: ["Lanús"], cities: ["Lanús"] },
  { id: "newells", names: ["Newell's Old Boys", "Newell's"], cities: ["Rosario"] },
  { id: "patronato-parana", names: ["Patronato (Paraná)", "Patronato"], cities: ["Paraná"] },
  { id: "quilmes", names: ["Quilmes"], cities: ["Quilmes"] },
  { id: "racing", names: ["Racing Club", "Racing"], cities: ["Avellaneda"] },
  { id: "river", names: ["River Plate"], cities: ["Buenos Aires"] },
  { id: "central", names: ["Rosario Central"], cities: ["Rosario"] },
  { id: "sanlorenzo", names: ["San Lorenzo de Almagro", "San Lorenzo"], cities: ["Buenos Aires"] },
  { id: "talleres", names: ["Talleres (Córdoba)", "Talleres"], cities: ["Córdoba"] },
  { id: "tigre", names: ["Tigre"], cities: ["Victoria", "Tigre"] },
  { id: "velez", names: ["Vélez Sarsfield", "Vélez"], cities: ["Buenos Aires"] },
];
const ARG_BY_KEY = new Map(ARG.flatMap((c) => c.names.map((n) => [nameKey(n), c] as const)));
const argClub = (name: string) => ARG_BY_KEY.get(nameKey(name));

// ───────── Rivales del exterior ─────────
const CC: Record<string, { code: string; name: string }> = {
  Uru: { code: "uy", name: "Uruguay" },
  Par: { code: "py", name: "Paraguay" },
  Bra: { code: "br", name: "Brasil" },
  Chi: { code: "cl", name: "Chile" },
  Col: { code: "co", name: "Colombia" },
  Ecu: { code: "ec", name: "Ecuador" },
  Per: { code: "pe", name: "Perú" },
  Bol: { code: "bo", name: "Bolivia" },
  Ven: { code: "ve", name: "Venezuela" },
  Mex: { code: "mx", name: "México" },
  Hon: { code: "hn", name: "Honduras" },
  Crc: { code: "cr", name: "Costa Rica" },
  Usa: { code: "us", name: "Estados Unidos" },
};
// Ciudades que deciden el país de los nombres repetidos (Nacional, América, Guaraní, River Plate).
const CITY_COUNTRY: Record<string, string> = {
  Montevideo: "Uru",
  "Asunción": "Par",
  Cali: "Col",
  "Mexico D.F.": "Mex",
  "México D.F.": "Mex",
  "Ciudad de México": "Mex",
  Campinas: "Bra",
  Quito: "Ecu",
  Santiago: "Chi",
};
// Nombres de la línea de partido que no coinciden con los de la tabla de rivales.
const OPP_ALIASES: Record<string, string> = {
  "Liga D.U.Quito": "Liga Deportiva Universitaria",
  "Independiente Sta. Fe": "Independiente Santa Fe",
  "Indep, Santa Fe": "Independiente Santa Fe",
  "Unión Atlético Táchira": "Deportivo Táchira",
  "Cortuluá": "Corporación Tuluá",
  "Athletico Paranaense": "Atlético Paranaense",
  "Indep. José Terán": "Independiente del Valle",
  "América FC-MG": "América Mineiro",
  "CI Santa Fe": "Independiente Santa Fe",
  "DIM": "Independiente Medellín",
  "CA Belgrano": "Belgrano",
  "Delfín SC": "Delfín",
  "CS Luqueño": "Sportivo Luqueño",
  "Fortaleza EC": "Fortaleza",
  "Dep. Antofagasta": "Deportes Antofagasta",
  "LDU Quito": "Liga Deportiva Universitaria",
  "Independ. del Valle": "Independiente del Valle",
  "Tigre UANL": "Tigres UANL",
  "Estudiantes Mérida": "Estudiantes de Mérida",
  "Paulista": "Paulista FC",
  "Coritiba": "Coritiba FC",
  "Goias": "Goiás",
  "Atletico Paranaense": "Atlético Paranaense",
  "Atletico Nacional": "Atlético Nacional",
  "Bolivar": "Bolívar",
};
// Ids que ya existían (copas rioplatenses y Chevallier Boutell) y nombres para mostrar.
const FIXED_IDS: Record<string, string> = {
  "nacional|Uru": "nacional-uy",
  "penarol|Uru": "penarol-uy",
  "montevideo wanderers|Uru": "wanderers-uy",
  "defensor sporting|Uru": "defensor-uy",
  "vasco da gama|Bra": "vasco-br",
  "colo colo|Chi": "colo-colo-cl",
  "emelec|Ecu": "emelec-ec",
  "deportivo municipal|Per": "municipal-pe",
  "river plate|Uru": "river-plate-uy",
};
const DISPLAY: Record<string, string> = {
  "Liga Deportiva Universitaria": "Liga de Quito",
  "Atlético Paranaense": "Athletico Paranaense",
  "Bolivar": "Bolívar",
  "Goias": "Goiás",
  "Tigre UANL": "Tigres UANL",
  "Fenix": "Fénix",
  "Bahía": "Bahia",
  "Sport Boys": "Sport Boys Warnes",
  "Guaraní|Bra": "Guarani",
};

// País aclarado en el nombre del rival: "Nacional (Par.)", "River Plate (Uruguay)", "LDU Quito [Ecu]" (el lector de
// la página ya pasa los corchetes a paréntesis). Devuelve el nombre solo y el código de tres letras.
const COUNTRY_TAG = /\s*\((Uru|Par|Bra|Mex|Méx|Col|Ecu|Chi|Per|Bol|Ven|Hon|Crc|Usa)[a-zé]*\.?\)\s*$/i;
function splitCountry(raw: string): { name: string; country?: string } {
  const m = raw.match(COUNTRY_TAG);
  if (!m) return { name: raw };
  const c = m[1].normalize("NFD").replace(/[̀-ͯ]/g, "");
  return { name: raw.replace(COUNTRY_TAG, "").trim(), country: c[0].toUpperCase() + c.slice(1).toLowerCase() };
}

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Foreign = { id: string; name: string; shortName: string; fullName: string; country: string };

// ───────── Fases ─────────
const STAGES: [RegExp, string][] = [
  [/^Group Stage/i, "Fase de grupos"],
  [/^Qualif\.?\s*Round 2/i, "Fase previa (segunda ronda)"],
  [/^Qualif\.?\s*Round 3/i, "Fase previa (tercera ronda)"],
  [/^Qualif/i, "Fase previa"],
  [/^First Round/i, "Primera ronda"],
  [/^Second Round/i, "Segunda ronda"],
  [/^Pre-Round of 16/i, "Playoffs de octavos"],
  [/^(Round of 16|8º Final)/i, "Octavos de final"],
  [/^Quar/i, "Cuartos de final"],
  [/^Semi-?F\.? Playoff/i, "Semifinal (desempate)"],
  [/^Semi/i, "Semifinal"],
  [/^1st Place Playoff/i, "Desempate por el primer puesto del grupo"],
  [/^RunnerUp ?Playoff/i, "Desempate por el segundo puesto del grupo"],
  [/^Final/i, "Final"],
];
const stageEs = (s: string) => STAGES.find(([re]) => re.test(s))?.[1] ?? s;

export type IntlMatch = {
  id: string;
  date: string;
  stage: string;
  venue: string;
  homeId: string;
  awayId: string;
  homeGoals: number;
  awayGoals: number;
  advancedId?: string;
  awardedTo?: string;
  goalsVoid?: boolean;
  note?: string;
  // Cómo se confirmó el resultado: "edicion" (página de la edición de RSSSF), "wikipedia" (artículo de la edición en
  // Wikipedia) o "ciudad" (sin segunda fuente: la localía sale de la ciudad).
  check: "edicion" | "wikipedia" | "ciudad";
  // Suspendido y no completado: se muestra pero no suma.
  suspended?: boolean;
  scorers?: string;
};
// Campeón y subcampeón (según Wikipedia; se controla contra la final cuando la jugó un club argentino).
export type IntlEdition = { year: number; championId: string; runnerUpId: string; matches: IntlMatch[] };

type Cup = {
  key: string;
  clubPage: string;
  editionFile: (year: number) => string | null;
  wikiTitles: (year: number) => string[];
  // Artículo de Wikipedia con la tabla "Historial" de campeones y subcampeones.
  championsTitle: string;
  // Arreglos de la página por club ("club|fecha" de la página): fecha, resultado (del lado del club argentino),
  // rival o fase mal escritos, resueltos con las otras dos fuentes. La nota explica el arreglo.
  // suspended: no se completó y no cuenta (se muestra); advanced: quién pasó de ronda.
  fixes?: Record<string, { date?: string; goals?: [number, number]; opp?: string; stage?: string; confirmed?: boolean; suspended?: boolean; advanced?: string; awarded?: "club" | "opp"; note: string }>;
  // Partidos que faltan en la página por club y están en la página de la edición y en Wikipedia.
  extra?: (Omit<IntlMatch, "id" | "check"> & { year: number })[];
  ignoreMissing?: RegExp[];
};

const CUPS: Record<string, Cup> = {
  libertadores: {
    key: "libertadores",
    clubPage: "copalibarg.html",
    editionFile: (y) => (y < 2010 ? `copa${String(y).slice(2)}.html` : `copa${y}.html`),
    fixes: {
      "arsenal|2014-08-30": { date: "2014-04-30", note: "La página por club de RSSSF da el 30 de agosto; fue el 30 de abril, según la página de la edición y Wikipedia." },
      "river|1973-03-23": { goals: [7, 1], note: "La página por club de RSSSF da 7-0; la página de la edición y Wikipedia, 7-1." },
      "velez|1994-04-27|Minerven": { date: "1994-07-27", note: "La página por club de RSSSF da el 27 de abril; fue el 27 de julio (los cuartos se jugaron después del Mundial), según Wikipedia." },
      "river|1978-07-26": { stage: "Desempate por el primer puesto del grupo", note: "Desempate por el primer puesto del grupo, en cancha de River (la página por club de RSSSF lo da como partido de grupo del 26 de julio)." },
      "independiente|1978-07-26": { stage: "Desempate por el primer puesto del grupo", note: "Desempate por el primer puesto del grupo, en cancha de River (la página por club de RSSSF lo da como partido de grupo del 26 de julio)." },
      "central|2019-03-13": { opp: "Universidad Católica (Chi.)", note: "La página por club de RSSSF da como rival a Universidad de Chile; fue Universidad Católica, según la página de la edición y Wikipedia." },
      "central|2019-04-24": { opp: "Universidad Católica (Chi.)", note: "La página por club de RSSSF da como rival a Universidad de Chile; fue Universidad Católica, según la página de la edición y Wikipedia." },
      "river|1982-07-27": { confirmed: true, note: "Terminó 1-0 para The Strongest, pero la Conmebol le dio los puntos a River (página de la edición de RSSSF)." },
      "boca|2025-02-18": { confirmed: true, note: "Sin página de la edición en RSSSF: confirmado por Infobae y ESPN." },
      "boca|2025-02-25": { confirmed: true, note: "Sin página de la edición en RSSSF: confirmado por Infobae y ESPN (Alianza ganó 5-4 por penales)." },
      "boca|2015-05-14": {
        suspended: true,
        advanced: "river",
        note: "Se suspendió en el entretiempo (0-0) porque atacaron a los jugadores de River con gas pimienta en la manga. La Conmebol descalificó a Boca y River pasó a cuartos. No se completó: se muestra pero no suma.",
      },
      "river|2015-05-14": {
        suspended: true,
        advanced: "river",
        note: "Se suspendió en el entretiempo (0-0) porque atacaron a los jugadores de River con gas pimienta en la manga. La Conmebol descalificó a Boca y River pasó a cuartos. No se completó: se muestra pero no suma.",
      },
      "independiente|1987-09-23": { note: "La página de la edición de RSSSF da 2-0; las páginas por club de los dos equipos y Wikipedia, 2-1." },
      "river|1987-09-23": { note: "La página de la edición de RSSSF da 2-0; las páginas por club de los dos equipos y Wikipedia, 2-1." },
    },
    // Líneas de las otras fuentes que no son partidos de un club argentino (o ya están explicadas en las notas).
    ignoreMissing: [
      /^2016 .*River Plate.*(Palmeiras|Nacional)|^2016 .*(Palmeiras|Nacional).*River Plate/, // River Plate de Montevideo, en el grupo de Rosario Central
      /^1987 edición: 23 Sep: Independiente - River Plate\s+2-0/, // 2-1 según las demás fuentes (ver la nota del partido)
      // Tablas secundarias del artículo de Wikipedia con fechas o resultados que contradicen su propia tabla principal y
      // las dos páginas de RSSSF (ej. "18/9/1973 Independiente 2-0 Millonarios", que fue el 26/4).
      /^1967 Wikipedia: 27\/2 .*Racing Club 2-2 Nacional/,
      /^1972 Wikipedia: 9\/3 .*Independiente ' 2-0 ' Universitario/,
      /^1973 Wikipedia: (18\/9|20\/9|2\/10) .*(Millonarios|San Lorenzo)/,
      /^1988 Wikipedia: (12|29)\/7 .*Filabanco/,
    ],
    extra: [
      {
        year: 1978,
        date: "1978-07-26",
        stage: "Fase de grupos",
        venue: "Buenos Aires",
        homeId: "river",
        awayId: "independiente",
        homeGoals: 0,
        awayGoals: 0,
        note: "Falta en la página por club de RSSSF; está en la página de la edición y en Wikipedia.",
      },
    ],
    wikiTitles: (y) => [`Copa Libertadores ${y}`, `Anexo:Final de la Copa Libertadores ${y}`, `Anexo:Fase preliminar de la Copa Libertadores ${y}`],
    championsTitle: "Copa Libertadores de América",
  },
  sudamericana: {
    key: "sudamericana",
    clubPage: "sudamcup-arg.html",
    editionFile: (y) => (y < 2010 ? `sudamcup${String(y).slice(2)}.html` : `sudamcup${y}.html`),
    wikiTitles: (y) => [`Copa Sudamericana ${y}`, `Anexo:Final de la Copa Sudamericana ${y}`],
    championsTitle: "Copa Sudamericana",
    fixes: {
      "sanlorenzo|2018-07-26": { goals: [1, 2], awarded: "club", confirmed: true, note: "Terminó 1-2; la Conmebol se lo dio ganado 3-0 a San Lorenzo porque Temuco puso un jugador mal incluido (Jonathan Requena), según la página de la edición de RSSSF." },
      "sanlorenzo|2023-04-20": { confirmed: true, note: "La página de la edición de RSSSF da 3-2; fue 0-2, según la página por club, FIFA y La Nación." },
      "defensa-y-justicia|2023-04-19": { opp: "América Mineiro (Bra.)", note: "La página por club de RSSSF da como rival a Atlético Mineiro; fue América Mineiro, según la página de la edición y Wikipedia." },
      "defensa-y-justicia|2023-05-23": { opp: "América Mineiro (Bra.)", note: "La página por club de RSSSF da como rival a Atlético Mineiro; fue América Mineiro, según la página de la edición y Wikipedia." },
      "belgrano|2024-05-09": { goals: [1, 1], note: "La página por club de RSSSF da 1-0; la página de la edición y Wikipedia, 1-1." },
      "independiente|2025-08-20": {
        goals: [1, 1],
        suspended: true,
        advanced: "universidad-de-chile-cl",
        confirmed: true,
        note: "Suspendido a los 48 minutos (1-1) por los incidentes entre las hinchadas. La Conmebol descalificó a Independiente y pasó Universidad de Chile (Soccerway, beIN Sports). Se muestra pero no suma.",
      },
    },
    ignoreMissing: [
      // River Plate de Montevideo (2009) y Racing de Montevideo (2024): homónimos uruguayos.
      /^2009 Wikipedia: .*River Plate.*(Vitória|Liga de Quito)|^2009 Wikipedia: .*(Vitória|Liga de Quito).*River Plate/,
      /^2024 Wikipedia: .*Racing.*(Huachipato|Corinthians|Nacional)|^2024 Wikipedia: .*(Huachipato|Corinthians|Nacional).*Racing/,
      // La página de la edición da 3-2; fue 0-2 (ver la nota del partido).
      /^2023 edición: Apr 20: San Lorenzo - Fortaleza EC\s+3-2/,
      // Otra fecha en una tabla secundaria del artículo de Wikipedia; las dos páginas de RSSSF coinciden.
      /^2002 Wikipedia: 29\/10 .*Racing Club 2-0 San Lorenzo/,
      /^2003 Wikipedia: 29\/10 .*Libertad 1-0 River Plate/,
      // Wikipedia pone a Liga de Loja; fue Deportivo Quito (página de la edición y página por club de RSSSF).
      /^2012 Wikipedia: 25\/10 .*Tigre 4-0 Liga de Loja/,
    ],
  },
  supercopa: {
    key: "supercopa",
    clubPage: "supcopa-arg.html",
    editionFile: (y) => `supcopa${String(y).slice(2)}.html`,
    wikiTitles: (y) => [`Supercopa Sudamericana ${y}`],
    championsTitle: "Supercopa Sudamericana",
    fixes: {
      "river|1997-12-04": { confirmed: true, note: "Confirmado por la página de la edición de RSSSF (final del 4 y el 17 de diciembre, sin la fecha en cada partido)." },
      "river|1997-12-17": { confirmed: true, note: "Confirmado por la página de la edición de RSSSF (final del 4 y el 17 de diciembre, sin la fecha en cada partido)." },
    },
    ignoreMissing: [
      // Cuartos 1992: Nacional se retiró antes de la ida por una huelga de jugadores y Racing pasó sin jugar (páginas de
      // RSSSF y Wikipedia en inglés); Wikipedia en español da dos partidos 1-0 que no se jugaron.
      /^1992 Wikipedia: .*Racing Club.*Nacional|^1992 Wikipedia: .*Nacional.*Racing Club/,
    ],
  },
  conmebol: {
    key: "conmebol",
    clubPage: "conmebol-arg.html",
    editionFile: (y) => `conmebol${String(y).slice(2)}.html`,
    wikiTitles: (y) => [`Copa Conmebol ${y}`],
    championsTitle: "Copa Conmebol",
  },
  mercosur: {
    key: "mercosur",
    clubPage: "mercosur-arg.html",
    editionFile: (y) => `mercosur${String(y).slice(2)}.html`,
    wikiTitles: (y) => [`Copa Mercosur ${y}`],
    championsTitle: "Copa Mercosur",
  },
};

async function main() {
  const cup = CUPS[process.argv[2]];
  if (!cup) throw new Error(`Copa desconocida: ${process.argv[2]}. Opciones: ${Object.keys(CUPS).join(", ")}`);
  const page = readClubPage(cup.clubPage);
  // Arreglos, antes de todo lo demás (la fase va aparte: ya viene en castellano).
  const fixOf = new Map<ClubPageMatch, NonNullable<Cup["fixes"]>[string]>();
  for (const m of page.matches) {
    const id = argClub(m.club)?.id;
    const fix = cup.fixes?.[`${id}|${m.date}|${m.opp}`] ?? cup.fixes?.[`${id}|${m.date}`];
    if (!fix) continue;
    fixOf.set(m, fix);
    if (fix.date) m.date = fix.date;
    if (fix.goals) [m.goals, m.oppGoals] = fix.goals;
    if (fix.opp) m.opp = fix.opp;
    if (fix.awarded) m.awarded = fix.awarded;
  }
  const unusedFixes = Object.keys(cup.fixes ?? {}).filter((k) => ![...fixOf.values()].includes(cup.fixes![k]));
  const problems = [...page.problems];
  const warnings: string[] = [];

  // País de cada rival (por nombre normalizado): puede haber más de uno.
  const countries = new Map<string, Set<string>>();
  const display = new Map<string, string>();
  for (const r of page.rivals) {
    const k = nameKey(r.name);
    if (!countries.has(k)) countries.set(k, new Set());
    countries.get(k)!.add(r.country);
    if (!display.has(`${k}|${r.country}`)) display.set(`${k}|${r.country}`, r.name);
  }

  // Participaciones: cada bloque de un club entre líneas de guiones es una edición (la del año del primer partido).
  const byPart = new Map<string, ClubPageMatch[]>();
  for (const m of page.matches) {
    const k = `${m.club}|${m.participation}`;
    if (!byPart.has(k)) byPart.set(k, []);
    byPart.get(k)!.push(m);
  }
  const editionOf = new Map<ClubPageMatch, number>();
  for (const [k, list] of byPart) {
    const year = Math.min(...list.map((m) => +m.date.slice(0, 4)));
    const last = Math.max(...list.map((m) => Date.parse(m.date)));
    if (last - Date.parse(`${year}-01-01`) > 400 * 864e5) problems.push(`${k}: la participación abarca más de un año (${list[0].date} a ${list.at(-1)!.date})`);
    for (const m of list) editionOf.set(m, year);
  }

  // Rival de cada partido: club argentino o del exterior (con país).
  const foreign = new Map<string, Foreign>();
  const getForeign = (id: string) => foreign.get(id);
  const oppId = (m: ClubPageMatch): string | null => {
    const { name: bareOpp, country: explicit } = splitCountry(m.opp);
    const arg = argClub(bareOpp);
    const name = OPP_ALIASES[bareOpp] ?? bareOpp;
    const k = nameKey(name);
    const cands = [...(countries.get(k) ?? [])];
    // Nombre de un club argentino sin país aclarado: es el argentino. El River Plate de Montevideo figura como
    // "River Plate [Uru]" o "River Plate (Uruguay)".
    if (arg && !explicit) return arg.id;
    let country = explicit ? explicit[0].toUpperCase() + explicit.slice(1, 3).toLowerCase() : cands.length === 1 ? cands[0] : undefined;
    if (!country) {
      // Nombre repetido en varios países: la ciudad del partido de visitante en la misma serie lo define.
      const same = byPart.get(`${m.club}|${m.participation}`)!.filter((x) => x.opp === m.opp);
      const city = same.map((x) => CITY_COUNTRY[x.place]).find(Boolean);
      if (city && (!cands.length || cands.includes(city))) country = city;
      else if (arg) return arg.id;
    }
    if (!country || !CC[country]) {
      problems.push(`${m.club} ${m.no} (${m.date}): no sé de qué país es ${m.opp} (${cands.join("/") || "sin datos"})`);
      return null;
    }
    const fixed = FIXED_IDS[`${k}|${country}`];
    const base = display.get(`${k}|${country}`) ?? name;
    const shown = DISPLAY[`${base}|${country}`] ?? DISPLAY[base] ?? base;
    const id = fixed ?? `${slug(shown)}-${CC[country].code}`;
    if (!foreign.has(id))
      foreign.set(id, {
        id,
        name: `${shown} (${CC[country].name})`,
        shortName: slug(shown).replace(/-/g, "").slice(0, 3).toUpperCase(),
        fullName: `${base} (${CC[country].name})`,
        country: CC[country].name,
      });
    return id;
  };

  // Páginas de cada edición (cacheadas).
  const editions = new Map<number, EditionLine[]>();
  const editionLines = (year: number) => {
    if (!editions.has(year)) {
      const f = cup.editionFile(year);
      editions.set(year, f && existsSync(join(".cache", "rsssf", "sacups", f)) ? readEditionPage(f) : []);
    }
    return editions.get(year)!;
  };

  // Un nombre de la página de la edición corresponde a un club (por su id) si coincide con alguno de sus nombres.
  // Todos los nombres de un club: los de la lista de argentinos, o el de la línea más sus alias.
  const namesOf = (id: string, raw: string) => {
    const arg = ARG.find((c) => c.id === id);
    const bare = splitCountry(raw).name;
    const canonical = OPP_ALIASES[bare] ?? bare;
    const aliases = Object.keys(OPP_ALIASES).filter((k) => OPP_ALIASES[k] === canonical);
    // También el nombre con que quedó en el sitio (sin el país): "Liga de Quito" para "LDU Quito".
    const shown = getForeign(id)?.name.replace(/\s*\([^)]*\)$/, "");
    return new Set([...(arg ? arg.names : []), bare, canonical, ...aliases, ...(shown ? [shown] : [])].map(nameKey));
  };
  // Dos nombres son el mismo club si coinciden o si las palabras del más corto están todas en el más largo
  // ("Lara" y "Deportivo Lara", "Medellín" e "Independiente Medellín"). El resultado y la fecha evitan confusiones.
  // Qué tan bien coincide: 2 si es el mismo nombre, 1 si coinciden las palabras, 0 si no.
  const fit = (lineName: string, keys: Set<string>) => {
    const k = nameKey(lineName);
    const words = (x: string) => x.split(" ").filter((w) => w.length > 1);
    let best = 0;
    for (const x of keys) {
      if (x === k) return 2;
      const [a, b] = words(x).length <= words(k).length ? [words(x), words(k)] : [words(k), words(x)];
      if (a.length > 0 && a.some((w) => w.length >= 4) && a.every((w) => b.includes(w))) best = 1;
    }
    return best;
  };
  const same = (lineName: string, keys: Set<string>) => fit(lineName, keys) > 0;
  // ¿El club es el primero de la línea (local)? Con los dos órdenes posibles, gana el de nombres más parecidos
  // ("Independiente Santa Fe - Independiente": el primero es el colombiano). null si la línea no es de este cruce.
  const orient = (first: string, second: string, clubKeys: Set<string>, oppKeys: Set<string>) => {
    const asClub = fit(first, clubKeys) && fit(second, oppKeys) ? fit(first, clubKeys) + fit(second, oppKeys) : 0;
    const asOpp = fit(first, oppKeys) && fit(second, clubKeys) ? fit(first, oppKeys) + fit(second, clubKeys) : 0;
    if (!asClub && !asOpp) return null;
    return asClub >= asOpp;
  };

  // Líneas de las fuentes ya usadas (una línea no confirma dos partidos).
  // Guarda qué club la usó: el partido entre dos argentinos figura en los dos bloques y los dos usan la misma línea.
  const used = new Map<EditionLine | WikiMatch, string>();
  // Fechas distintas entre las fuentes y cómo se resolvieron.
  const dateConflicts: string[] = [];
  // Artículos de Wikipedia de cada edición (tercera fuente; la segunda para las ediciones sin página en RSSSF).
  const wiki = new Map<number, WikiMatch[]>();
  for (const year of new Set(editionOf.values())) {
    const all: WikiMatch[] = [];
    for (const t of cup.wikiTitles(year)) all.push(...((await wikiMatches(t)) ?? []));
    // El artículo principal y el de la final pueden repetir un partido.
    const key = (w: WikiMatch) => `${w.month}-${w.day}|${nameKey(w.home)}|${nameKey(w.away)}|${w.hg}-${w.ag}`;
    wiki.set(year, [...new Map(all.map((w) => [key(w), w])).values()]);
  }

  // Partidos entre dos argentinos: figuran en los dos bloques; se cargan una sola vez.
  const seen = new Map<string, IntlMatch>();
  const out = new Map<number, IntlMatch[]>();
  for (const m of page.matches) {
    const club = argClub(m.club);
    if (!club) {
      problems.push(`Club argentino desconocido: ${m.club}`);
      continue;
    }
    const opp = oppId(m);
    if (!opp) continue;
    const year = editionOf.get(m)!;
    const fix = fixOf.get(m);
    if (m.fieldUnknown && !fix?.goals) problems.push(`${m.club} ${m.date}: por escritorio sin el resultado de la cancha y sin arreglo`);
    const lines = editionLines(year);
    const clubKeys = namesOf(club.id, m.team);
    const oppKeys = namesOf(opp, m.opp);
    const clubPageDate = m.date;
    const own = Date.parse(clubPageDate);
    // Fecha de una línea sin año: el año más cercano al del partido (las ediciones que terminan en enero).
    const near = (month: number, day: number) => {
      const y = +clubPageDate.slice(0, 4);
      return [y, y + 1, y - 1].map((yy) => Date.UTC(yy, month - 1, day)).sort((a, b) => Math.abs(a - own) - Math.abs(b - own))[0];
    };
    const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
    // Cruce y resultado iguales, hasta 45 días de diferencia: la línea más cercana y si el club fue local.
    const find = <T extends { home: string; away: string; hg: number; ag: number; month: number; day: number }>(list: T[]) =>
      list
        .filter((l) => !used.has(l as never) || used.get(l as never) === opp)
        .filter((l) => {
          const d = iso(near(l.month, l.day));
          return d === clubPageDate || !page.matches.some((x) => x !== m && x.club === m.club && x.opp === m.opp && x.date === d);
        })
        .map((l) => {
          const o1 = orient(l.home, l.away, clubKeys, oppKeys);
          const clubHome = o1 === true;
          const oppHome = o1 === false;
          const [g, o] = clubHome ? [l.hg, l.ag] : [l.ag, l.hg];
          // Los partidos por escritorio se comparan con el resultado de la cancha (las fuentes que dan otro no sirven).
          const given = m.awardedScore;
          const ok = (clubHome || oppHome) && ((g === m.goals && o === m.oppGoals) || (!!given && g === given[0] && o === given[1]));
          return { l, clubHome, ok, t: near(l.month, l.day) };
        })
        .filter((c) => c.ok && Math.abs(c.t - own) <= 45 * 864e5)
        .sort((a, b) => Math.abs(a.t - own) - Math.abs(b.t - own))[0];

    let home: string | null = null;
    let check: IntlMatch["check"] = "ciudad";
    // 1) Página de la edición, partido de grupo con fecha ("May  6: A - B  2-0").
    const ed = find(lines.filter((l): l is Extract<EditionLine, { kind: "match" }> => l.kind === "match"));
    if (ed) {
      used.set(ed.l, club.id);
      home = ed.clubHome ? club.id : opp;
      check = "edicion";
    }
    // 2) Página de la edición, serie de ida y vuelta: la ida en cancha del primero, la vuelta en la del segundo.
    if (!home) {
      const meetings = page.matches
        .filter((x) => x.club === m.club && editionOf.get(x) === year && x.opp === m.opp && stageEs(x.stage) === stageEs(m.stage))
        .sort((a, b) => a.date.localeCompare(b.date));
      const k = meetings.indexOf(m);
      if (process.env.DEBUG && `${m.club} ${m.opp} ${m.date}`.includes(process.env.DEBUG))
        console.log("DEBUG serie", k, meetings.map((x) => x.date), lines.filter((t) => t.kind === "tie" && (t.a.includes(m.opp) || t.b.includes(m.opp))).map((t) => t.raw));
      for (const t of lines) {
        if (t.kind !== "tie" || k < 0) continue;
        // Tercer partido: el desempate entre corchetes, en cancha neutral (la localía queda por la ciudad).
        // Puede venir entre corchetes en la línea de la serie o en una línea propia con un solo resultado.
        const po = t.playoff ?? (t.legs.length === 1 ? t.legs[0] : undefined);
        if (k === 2 && po) {
          const o2 = orient(t.a, t.b, clubKeys, oppKeys);
          if (o2 === null) continue;
          const [g, o] = o2 ? po : [po[1], po[0]];
          if (g === m.goals && o === m.oppGoals) {
            // En cancha neutral: figura como local el que RSSSF pone primero.
            home = o2 ? club.id : opp;
            check = "edicion";
            break;
          }
          continue;
        }
        if (k > 1 || !t.legs[k]) continue;
        const o1 = orient(t.a, t.b, clubKeys, oppKeys);
        const clubFirst = o1 === true;
        const oppFirst = o1 === false;
        if (!clubFirst && !oppFirst) continue;
        const [x, y] = t.legs[k];
        const [g, o] = clubFirst ? [x, y] : [y, x];
        if (!m.awarded && g === m.goals && o === m.oppGoals) {
          home = (k === 0) === clubFirst ? club.id : opp;
          check = "edicion";
          break;
        }
      }
    }
    // 3) Wikipedia: confirma el resultado si RSSSF no lo hizo y desempata las fechas.
    const wk = find(wiki.get(year) ?? []);
    if (process.env.DEBUG && `${m.club} ${m.opp} ${m.date}`.includes(process.env.DEBUG))
      console.log("DEBUG", m.line, "| edición:", ed?.l.raw, "| wiki:", wk?.l.raw, "|", (wiki.get(year) ?? []).filter((w) => w.home.includes(m.opp) || w.away.includes(m.opp)).map((w) => `${w.day}/${w.month} ${w.home} ${w.hg}-${w.ag} ${w.away} usada:${used.get(w) ?? "-"}`));
    if (wk) {
      used.set(wk.l, club.id);
      if (!home) {
        home = wk.clubHome ? club.id : opp;
        check = "wikipedia";
      }
    }
    // Fecha: si las fuentes no coinciden, la que repiten dos de ellas.
    let date = clubPageDate;
    let dateNote: string | undefined;
    const edDate = ed ? iso(ed.t) : undefined;
    const wkDate = wk ? iso(wk.t) : undefined;
    const what = `${year} ${m.team} ${m.goals}-${m.oppGoals} ${m.opp}`;
    if (edDate && edDate !== clubPageDate) {
      if (wkDate === edDate) date = edDate;
      else if (wkDate === clubPageDate) date = clubPageDate;
      else date = edDate;
      const open = wkDate !== edDate && wkDate !== clubPageDate;
      if (open) dateNote = `Fecha: la página por club de RSSSF da el ${clubPageDate}, la de la edición el ${edDate}${wkDate ? ` y Wikipedia el ${wkDate}` : ""}.`;
      dateConflicts.push(`${what}: club ${clubPageDate}, edición ${edDate}, Wikipedia ${wkDate ?? "—"} → ${date}${open ? " (sin resolver)" : ""}`);
    } else if (wkDate && wkDate !== clubPageDate) {
      dateConflicts.push(`${what}: RSSSF ${clubPageDate}${edDate ? " (las dos páginas)" : " (solo la página del club)"}, Wikipedia ${wkDate} → ${clubPageDate}${edDate ? "" : " (sin resolver)"}`);
      if (!edDate) dateNote = `Fecha: RSSSF da el ${clubPageDate}; Wikipedia, el ${wkDate}.`;
    }
    if (fix?.confirmed && check === "ciudad") check = "edicion";
    // 4) Sin localía confirmada: la da la ciudad (y, si tampoco hay resultado confirmado, queda avisado).
    if (!home) {
      const oppArg = ARG.find((c) => c.id === opp);
      if (club.cities.includes(m.place) && !oppArg?.cities.includes(m.place)) home = club.id;
      else if (oppArg?.cities.includes(m.place) && !club.cities.includes(m.place)) home = opp;
      else if (!oppArg && !club.cities.includes(m.place)) home = opp;
      else home = club.id;

    }
    const pairKey = `${date}|${[club.id, opp].sort().join("|")}`;

    const clubHome = home === club.id;
    const match: IntlMatch = {
      id: "",
      date,
      stage: fix?.stage ?? stageEs(m.stage),
      venue: m.place,
      homeId: clubHome ? club.id : opp,
      awayId: clubHome ? opp : club.id,
      homeGoals: clubHome ? m.goals : m.oppGoals,
      awayGoals: clubHome ? m.oppGoals : m.goals,
      check,
      ...(m.scorers && { scorers: m.scorers }),
    };
    if (m.pens) {
      const clubWon = m.pens[0] > m.pens[1];
      match.advancedId = clubWon ? club.id : opp;
      const [a, b] = clubHome ? m.pens : [m.pens[1], m.pens[0]];
      match.note = `Penales: ${a}-${b}.`;
    }
    if (m.awarded && !fix?.suspended) {
      match.awardedTo = m.awarded === "club" ? club.id : opp;
      match.goalsVoid = true;
    }
    if (fix || dateNote) match.note = [match.note, fix?.note, dateNote].filter(Boolean).join(" ");
    if (fix?.suspended) match.suspended = true;
    if (fix?.advanced) match.advancedId = fix.advanced;

    const prev = seen.get(pairKey);
    if (prev) {
      // El mismo partido desde el otro club: tiene que coincidir.
      const goalsOf = (x: IntlMatch, id: string) => (x.homeId === id ? x.homeGoals : x.awayGoals);
      if (goalsOf(prev, club.id) !== goalsOf(match, club.id) || goalsOf(prev, opp) !== goalsOf(match, opp))
        problems.push(`${date} ${club.id}-${opp}: los dos bloques no coinciden (${prev.homeId} ${prev.homeGoals}-${prev.awayGoals} / ${match.homeId} ${match.homeGoals}-${match.awayGoals})`);
      const rank = { edicion: 2, wikipedia: 1, ciudad: 0 };
      if (rank[check] > rank[prev.check]) Object.assign(prev, { homeId: match.homeId, awayId: match.awayId, homeGoals: match.homeGoals, awayGoals: match.awayGoals, check });
      continue;
    }
    seen.set(pairKey, match);
    if (!out.has(year)) out.set(year, []);
    out.get(year)!.push(match);
  }

  // Partidos agregados a mano (faltan en la página por club).
  for (const x of cup.extra ?? []) {
    const { year, ...rest } = x;
    if (!out.has(year)) out.set(year, []);
    out.get(year)!.push({ id: "", ...rest, check: "edicion" });
    for (const l of editionLines(year)) if (l.kind === "match" && l.hg === x.homeGoals && l.ag === x.awayGoals && +x.date.slice(5, 7) === l.month && +x.date.slice(8, 10) === l.day) used.set(l, "extra");
    for (const w of wiki.get(year) ?? []) if (w.hg === x.homeGoals && w.ag === x.awayGoals && +x.date.slice(5, 7) === w.month && +x.date.slice(8, 10) === w.day) used.set(w, "extra");
  }
  for (const k of unusedFixes) problems.push(`Arreglo que no se usó: ${k}`);

  // Completitud: partidos de clubes argentinos que están en la página de la edición o en Wikipedia y no en la
  // página por club.
  // Solo cuentan los clubes argentinos que jugaron esa edición ("Estudiantes" en 1977 es Estudiantes de Mérida).
  const playedIn = new Map<number, Set<string>>();
  for (const [year, list] of out) playedIn.set(year, new Set(list.flatMap((m) => [m.homeId, m.awayId])));
  const isArg = (year: number, name: string) =>
    ARG.some((c) => playedIn.get(year)?.has(c.id) && c.names.some((n) => nameKey(n) === nameKey(name)));
  const missing: string[] = [];
  // Otra línea de Wikipedia del mismo cruce, hasta 3 días de diferencia, ya usada: es el mismo partido repetido en
  // otra tabla del artículo (a veces con otra fecha o resultado, que ya perdieron contra las dos páginas de RSSSF).
  const twinUsed = (year: number, w: WikiMatch) =>
    (wiki.get(year) ?? []).some((x) => {
      if (x === w || !used.has(x)) return false;
      if (Math.abs(Date.UTC(2000, x.month - 1, x.day) - Date.UTC(2000, w.month - 1, w.day)) > 3 * 864e5) return false;
      const k = (n: string) => new Set([nameKey(n)]);
      return (fit(w.home, k(x.home)) && fit(w.away, k(x.away))) || (fit(w.home, k(x.away)) && fit(w.away, k(x.home)));
    });
  for (const year of [...new Set(editionOf.values())].sort()) {
    for (const l of editionLines(year))
      if (l.kind === "match" && !used.has(l) && (isArg(year, l.home) || isArg(year, l.away))) missing.push(`${year} edición: ${l.raw}`);
    for (const w of wiki.get(year) ?? [])
      if (!used.has(w) && (isArg(year, w.home) || isArg(year, w.away)) && !twinUsed(year, w)) missing.push(`${year} Wikipedia: ${w.day}/${w.month} ${w.city}: ${w.home} ${w.hg}-${w.ag} ${w.away}`);
  }

  // Campeones y subcampeones: argentinos por nombre; del exterior, entre los rivales (o se agregan, con su país).
  const plain = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const COUNTRY_BY_NAME = new Map(Object.entries(CC).map(([k, v]) => [plain(v.name), k]));
  const finalistId = (t: WikiFinalist, year: number): string | null => {
    const keys = new Set([nameKey(OPP_ALIASES[t.name] ?? t.name)]);
    if (/argentina/i.test(t.country)) return ARG.find((c) => c.names.some((n) => fit(n, keys) > 0))?.id ?? null;
    const code = COUNTRY_BY_NAME.get(plain(t.country));
    if (!code) {
      problems.push(`${year}: país desconocido ${t.country} (${t.name})`);
      return null;
    }
    const bare = (n: string) => n.replace(/\s*\([^)]*\)$/, "");
    const hit = [...foreign.values()].find((x) => x.country === CC[code].name && (fit(bare(x.fullName), keys) > 0 || fit(bare(x.name), keys) > 0));
    if (hit) return hit.id;
    const id = FIXED_IDS[`${nameKey(t.name)}|${code}`] ?? `${slug(t.name)}-${CC[code].code}`;
    foreign.set(id, { id, name: `${t.name} (${CC[code].name})`, shortName: slug(t.name).replace(/-/g, "").slice(0, 3).toUpperCase(), fullName: `${t.name} (${CC[code].name})`, country: CC[code].name });
    warnings.push(`${year}: ${t.name} (${CC[code].name}) no jugó con clubes argentinos; se agrega como club del exterior`);
    return id;
  };
  const champions = new Map((await wikiChampions(cup.championsTitle)).map((c) => [c.year, c]));

  const result: IntlEdition[] = [...out.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, matches]) => ({
      year,
      matches: matches
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((m, i) => ({ ...m, id: `${cup.key}-${year}-${String(i + 1).padStart(3, "0")}` })),
    }))
    .map((e) => {
      const c = champions.get(e.year);
      if (!c) problems.push(`${e.year}: sin campeón en Wikipedia`);
      const championId = c ? finalistId(c.champion, e.year) : null;
      const runnerUpId = c ? finalistId(c.runnerUp, e.year) : null;
      if (c && (!championId || !runnerUpId)) problems.push(`${e.year}: no identifiqué a ${championId ? c.runnerUp.name : c.champion.name}`);
      return { year: e.year, championId: championId ?? "", runnerUpId: runnerUpId ?? "", matches: e.matches };
    });
  mkdirSync(join("scripts", "import", "data"), { recursive: true });
  writeFileSync(join("scripts", "import", "data", `${cup.key}.json`), JSON.stringify(result, null, 1) + "\n");

  // Rivales del exterior: se suman a los ya generados por otras copas.
  const genFile = join("lib", "data", "foreign-clubs.generated.json");
  const prevForeign: Foreign[] = existsSync(genFile) ? JSON.parse(readFileSync(genFile, "utf8")) : [];
  const merged = new Map(prevForeign.map((f) => [f.id, f]));
  for (const f of foreign.values()) if (!Object.values(FIXED_IDS).includes(f.id) || f.id === "river-plate-uy") merged.set(f.id, f);
  writeFileSync(genFile, JSON.stringify([...merged.values()].sort((a, b) => a.id.localeCompare(b.id)), null, 1) + "\n");

  const total = result.reduce((n, e) => n + e.matches.length, 0);
  for (const e of result) for (const m of e.matches) if (m.check === "ciudad") warnings.push(`${e.year} ${m.date} ${m.homeId} ${m.homeGoals}-${m.awayGoals} ${m.awayId} (${m.venue}): sin segunda fuente`);
  const by = (c: IntlMatch["check"]) => result.reduce((n, e) => n + e.matches.filter((m) => m.check === c).length, 0);
  console.log(`${cup.key}: ${result.length} ediciones, ${total} partidos (${by("edicion")} confirmados por la página de la edición de RSSSF, ${by("wikipedia")} por Wikipedia, ${by("ciudad")} sin segunda fuente), ${foreign.size} rivales del exterior`);
  for (const w of warnings) console.log(`  · ${w}`);
  for (const c of dateConflicts) console.log(`  ≠ ${c}`);
  for (const x of missing.filter((x) => !cup.ignoreMissing?.some((re) => re.test(x)))) console.log(`  + falta ${x}`);
  for (const p of problems) console.log(`  ✗ ${p}`);
}

// Se ejecuta solo como script (finals.ts importa la lista de clubes argentinos).
if (process.argv[1]?.replace(/\\/g, "/").endsWith("intl/conmebol.ts")) main();
