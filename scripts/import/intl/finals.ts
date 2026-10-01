// Copas internacionales cortas (finales o torneos de pocos partidos). Hay dos caminos:
//   - Recopa Sudamericana y Mundial de Clubes: los partidos salen del artículo de Wikipedia de cada edición y se
//     confirman contra la página de RSSSF (mismos equipos y resultado).
//   - Copa Intercontinental e Interamericana: salen de la página de RSSSF y se confirman contra Wikipedia (el
//     artículo de la edición o los resultados de la tabla de finales). Las copas de una o dos ediciones con clubes
//     argentinos (Suruga, Máster, Oro, Iberoamericana, Recopa de Clubes) van escritas acá, tomadas de RSSSF.
// Uso: npx tsx scripts/import/intl/finals.ts [copa…]  → scripts/import/data/<copa>.json
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { FOREIGN_TEAMS } from "../../../lib/teams";
import { ARG, type IntlEdition, type IntlMatch } from "./conmebol";
import { nameKey } from "./edition-pages";
import { wikiChampions, wikiMatches, type WikiChampion, type WikiMatch } from "./wiki-matches";

// Clubes argentinos que jugaron estas copas y no están en la lista de las copas de la Conmebol.
const ARGS = [...ARG, { id: "atlanta", names: ["Atlanta"], cities: ["Buenos Aires"] }];

// Rivales de otros continentes (y alguno de América que no jugó las copas de la Conmebol): [id, nombre, país, alias].
const EXTRA_FOREIGN: [string, string, string, string[]][] = [
  // Europa
  ["internazionale-it", "Internazionale", "Italia", ["Internazionale", "Inter", "F. C. Internazionale", "Inter de Milán", "Internazionale Milano"]],
  ["milan-it", "Milan", "Italia", ["Milan", "Milán", "Milan A. C.", "A. C. Milan", "AC Milan"]],
  ["juventus-it", "Juventus", "Italia", ["Juventus", "Juventus F. C."]],
  ["celtic-sc", "Celtic", "Escocia", ["Celtic", "Celtic F. C."]],
  ["manchester-united-en", "Manchester United", "Inglaterra", ["Manchester United", "Manchester United F. C.", "Manchester Utd"]],
  ["liverpool-en", "Liverpool", "Inglaterra", ["Liverpool", "Liverpool F. C."]],
  ["feyenoord-nl", "Feyenoord", "Países Bajos", ["Feyenoord", "Feijenoord", "S. C. Feijenoord"]],
  ["ajax-nl", "Ajax", "Países Bajos", ["Ajax", "A. F. C. Ajax"]],
  ["atletico-madrid-es", "Atlético de Madrid", "España", ["Atlético de Madrid", "Atlético Madrid", "Atl. Madrid", "Atletico Madrid"]],
  ["real-madrid-es", "Real Madrid", "España", ["Real Madrid", "Real Madrid C. F.", "Real Madrid C.F."]],
  ["barcelona-es", "Barcelona", "España", ["F. C. Barcelona", "FC Barcelona"]],
  ["borussia-monchengladbach-de", "Borussia Mönchengladbach", "Alemania", ["Borussia Mönchengladbach", "Borussia M'gladbach", "Mönchengladbach"]],
  ["bayern-de", "Bayern Múnich", "Alemania", ["Bayern München", "Bayern de Múnich", "Bayern Munich", "F. C. Bayern", "Bayern"]],
  ["steaua-ro", "Steaua Bucarest", "Rumania", ["Steaua Bucuresti", "Steaua Bucarest", "F. C. Steaua Bucarest", "Steaua"]],
  ["benfica-pt", "Benfica", "Portugal", ["Benfica", "S. L. Benfica"]],
  ["chelsea-en", "Chelsea", "Inglaterra", ["Chelsea", "Chelsea F. C."]],
  ["psg-fr", "Paris Saint-Germain", "Francia", ["Paris Saint-Germain", "Paris Saint-Germain F. C.", "PSG"]],
  // Asia, África y Oceanía
  ["etoile-du-sahel-tn", "Étoile du Sahel", "Túnez", ["Étoile du Sahel", "Etoile du Sahel", "Étoile Sportive du Sahel"]],
  ["urawa-jp", "Urawa Red Diamonds", "Japón", ["Urawa Red Diamonds", "Urawa Reds"]],
  ["pohang-kr", "Pohang Steelers", "Corea del Sur", ["Pohang Steelers"]],
  ["auckland-city-nz", "Auckland City", "Nueva Zelanda", ["Auckland City"]],
  ["sanfrecce-jp", "Sanfrecce Hiroshima", "Japón", ["Sanfrecce Hiroshima"]],
  ["al-ain-ae", "Al-Ain", "Emiratos Árabes Unidos", ["Al-Ain", "Al Ain", "Al-Ain F. C."]],
  ["kashima-jp", "Kashima Antlers", "Japón", ["Kashima Antlers"]],
  ["gamba-osaka-jp", "Gamba Osaka", "Japón", ["Gamba Osaka"]],
  ["jubilo-iwata-jp", "Júbilo Iwata", "Japón", ["Júbilo Iwata", "Jubilo Iwata"]],
  ["kashiwa-reysol-jp", "Kashiwa Reysol", "Japón", ["Kashiwa Reysol", "Hitachi Kashiwa Reysol"]],
  ["cerezo-osaka-jp", "Cerezo Osaka", "Japón", ["Cerezo Osaka"]],
  // Concacaf
  ["toluca-mx", "Toluca", "México", ["Toluca"]],
  ["olimpia-hn", "Olimpia", "Honduras", ["Olimpia (Hond)"]],
  ["municipal-gt", "Municipal", "Guatemala", ["Municipal"]],
  ["atletico-espanol-mx", "Atlético Español", "México", ["Atlético Español", "Atl. Español"]],
  ["america-mx", "América", "México", ["América"]],
  ["defence-force-tt", "Defence Force", "Trinidad y Tobago", ["Defence Force"]],
  ["alajuelense-cr", "Alajuelense", "Costa Rica", ["Alajuelense", "LD Alajuelense", "Liga Deportiva Alajuelense"]],
  ["cartagines-cr", "Cartaginés", "Costa Rica", ["Cartaginés"]],
  ["monterrey-mx", "Monterrey", "México", ["Monterrey"]],
  // Sudamérica (Recopa Sudamericana de Clubes 1970)
  ["mariscal-santa-cruz-bo", "Mariscal Santa Cruz", "Bolivia", ["Mariscal Santa Cruz", "Mariscal"]],
];

const plainLower = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Nombre → id. Los argentinos, por las palabras del nombre ("C. A. San Lorenzo" es San Lorenzo).
const words = (s: string) => nameKey(s).split(" ").filter((w) => w.length > 1);
// Las palabras que sobran solo pueden ser de la forma societaria ("Club Atlético", "C. A."): "Unión Española" no es Unión.
const LEGAL = new Set(["club", "atletico", "ca", "cs", "sc", "ac", "fc", "cd"]);
const argOf = (n: string) => {
  const w = words(n);
  return ARGS.find((c) =>
    c.names.some((x) => nameKey(x) === nameKey(n) || (words(x).length > 0 && words(x).every((y) => w.includes(y)) && w.every((y) => words(x).includes(y) || LEGAL.has(y)))),
  )?.id;
};
// Nombres con que aparecen clubes ya conocidos (de las copas de la Conmebol).
// Con el país (tablas de campeones de Wikipedia): "Olimpia" de Honduras, "Deportivo Municipal" de Guatemala.
const KNOWN_ALIASES: Record<string, string> = {
  "santa fe": "independiente-santa-fe-co",
  "olimpia|Honduras": "olimpia-hn",
  "deportivo municipal|Guatemala": "municipal-gt",
};
const foreignOf = (n: string, country?: string) => {
  const lower = plainLower(n);
  if (country && KNOWN_ALIASES[`${lower}|${country}`]) return KNOWN_ALIASES[`${lower}|${country}`];
  if (KNOWN_ALIASES[lower]) return KNOWN_ALIASES[lower];
  const exact = EXTRA_FOREIGN.find(([, , , aliases]) => aliases.some((a) => a.includes("(") && plainLower(a) === lower));
  if (exact) return exact[0];
  const k = nameKey(n);
  const extra = EXTRA_FOREIGN.filter(([, , c]) => !country || c === country).find(([, , , aliases]) => aliases.some((a) => !a.includes("(") && nameKey(a) === k));
  if (extra) return extra[0];
  const bare = (s: string) => nameKey(s.replace(/\s*\([^)]*\)$/, ""));
  // Los de otros continentes ya se buscaron por sus alias (así "Olimpia" no es el de Honduras).
  const list = FOREIGN_TEAMS.filter((t) => !EXTRA_FOREIGN.some(([id]) => id === t.id));
  return list.find((t) => (!country || t.country === country) && (bare(t.name) === k || bare(t.fullName ?? "") === k))?.id;
};
const aliasesOf = (id: string) => {
  const arg = ARGS.find((c) => c.id === id);
  if (arg) return arg.names;
  const extra = EXTRA_FOREIGN.find(([x]) => x === id);
  if (extra) return [extra[1], ...extra[3]];
  const t = FOREIGN_TEAMS.find((x) => x.id === id);
  return t ? [t.name.replace(/\s*\([^)]*\)$/, ""), (t.fullName ?? "").replace(/\s*\([^)]*\)$/, "")] : [];
};

type Row = [date: string, stage: string, home: string, hg: number, ag: number, away: string, venue: string, extra?: Partial<IntlMatch>];
type Edition = { year: number; champion: string; runnerUp: string; rows: Row[] };

type Cup = {
  key: string;
  championsTitle?: string;
  championsSection?: string;
  // Wikipedia como fuente principal: ediciones con un argentino en la final, más estas.
  extraYears?: number[];
  editionTitles: (year: number) => string[];
  rsssf: string[];
  stages?: Record<string, string>;
  // RSSSF como fuente principal: lector de la página (partidos con clubes argentinos, con el año de la edición).
  parse?: (lines: string[]) => { year: number; row: Row }[];
  // Ediciones escritas a mano (desde RSSSF).
  editions?: Edition[];
  // Ediciones cuyos partidos son de otra copa (se cargan allá): año → nota.
  sharedYears?: Record<number, string>;
  // Edición en juego, solo de Wikipedia: año y fases por fecha ("mm-dd" hasta el que va cada fase).
  current?: { year: number; stages: [string, string][]; countries?: Record<string, string> };
};

// ───────── Lectores de RSSSF ─────────
// Copa Intercontinental (tablest/toyota.html): "1964     9/ 9/64 Avellaneda" y abajo "  Independiente   1-0 Internazionale  [aet]".
function parseToyota(lines: string[]) {
  const out: { year: number; row: Row }[] = [];
  let edition = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    const d = lines[i].match(/^(?:(\d{4}))?\s+(\d{1,2})\/\s*(\d{1,2})\/(\d{2})\s+(.+?)\s*$/);
    if (!d) continue;
    if (d[1]) edition = +d[1];
    // A veces hay un solo espacio antes del resultado ("Borussia M'gladbach 0-3 Boca Juniors").
    const m = lines[i + 1].match(/^\s+(.+?)\s+(\d+)-(\d+)\s+(.+?)(?:\s+\[(.+)\])?\s*$/);
    if (!m || !edition) continue;
    const home = argOf(m[1]) ?? foreignOf(m[1]) ?? `?${m[1]}`;
    const away = argOf(m[4]) ?? foreignOf(m[4]) ?? `?${m[4]}`;
    if (!argOf(m[1]) && !argOf(m[4])) continue;
    const yy = +d[4];
    const date = `${yy < 50 ? 2000 + yy : 1900 + yy}-${d[3].padStart(2, "0")}-${d[2].padStart(2, "0")}`;
    const pen = m[5]?.match(/(\d+)-(\d+) pen/);
    const extra: Partial<IntlMatch> = {};
    if (m[5] && /aet/.test(m[5])) extra.note = "Con alargue.";
    if (pen) {
      extra.advancedId = +pen[1] > +pen[2] ? home : away;
      extra.note = `Con alargue. Penales: ${pen[1]}-${pen[2]}.`;
    }
    out.push({ year: edition, row: [date, "Final", home, +m[2], +m[3], away, d[5], extra] });
  }
  return out;
}
// Copa Interamericana (tablesi/intam.html): "13/ 2/69 Toluca     Toluca - Estudiantes    1-2     3-4 pen".
function parseIntam(lines: string[]) {
  const out: { year: number; row: Row }[] = [];
  for (const l of lines) {
    const m = l.match(/^(\d{1,2})\/\s*(\d{1,2})\/(\d{2})\s+(.+?)\s{2,}(.+?) - (.+?)\s{2,}(\d+)-(\d+)(.*)$/);
    if (!m || /group match/.test(m[9])) continue;
    if (!argOf(m[5]) && !argOf(m[6])) continue;
    // El único Olimpia que jugó la Interamericana con un club argentino es el de Honduras (1973).
    const intam = (n: string) => (/^Olimpia\b/.test(n) ? "olimpia-hn" : undefined);
    const home = argOf(m[5]) ?? intam(m[5]) ?? foreignOf(m[5]) ?? `?${m[5]}`;
    const away = argOf(m[6]) ?? intam(m[6]) ?? foreignOf(m[6]) ?? `?${m[6]}`;
    const yy = +m[3];
    const date = `${yy < 50 ? 2000 + yy : 1900 + yy}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    const pen = m[9].match(/(\d+)-(\d+) pen/);
    const extra: Partial<IntlMatch> = {};
    if (/aet/.test(m[9])) extra.note = "Con alargue.";
    if (pen) {
      extra.advancedId = +pen[1] > +pen[2] ? home : away;
      extra.note = `Penales: ${pen[1]}-${pen[2]}.`;
    }
    // La edición se asigna después, por el cruce (las páginas numeran distinto que Wikipedia).
    out.push({ year: 0, row: [date, "Final", home, +m[7], +m[8], away, m[4], extra] });
  }
  return out;
}

const CUPS: Record<string, Cup> = {
  // Copa Libertadores 2026, en juego (el resto de la Libertadores lo importa conmebol.ts).
  "libertadores-actual": {
    key: "libertadores-actual",
    editionTitles: (y) => [`Copa Libertadores ${y}`, ...[1, 2, 3].map((n) => `Anexo:Fase ${n} de la Copa Libertadores ${y}`)],
    rsssf: [],
    current: {
      year: 2026,
      // Rivales nuevos sin bandera en las tablas de grupos.
      countries: { Cusco: "PER", Mirassol: "BRA", "Universidad Central": "VEN" },
      stages: [
        ["03-20", "Fase previa"],
        ["06-30", "Fase de grupos"],
        ["08-31", "Octavos de final"],
        ["09-30", "Cuartos de final"],
        ["10-31", "Semifinal"],
      ],
    },
  },
  recopa: {
    key: "recopa",
    championsTitle: "Recopa Sudamericana",
    editionTitles: (y) => [`Recopa Sudamericana ${y}`],
    rsssf: ["sacups/recopa.html", "sacups/recopa88.html", "sacups/recopa89.html"],
    sharedYears: {
      1998: "Se definió con los dos partidos entre Cruzeiro y River de la fase de grupos de la Copa Mercosur 1999 (Cruzeiro 2-0 en Belo Horizonte y 3-0 en Buenos Aires), que están cargados en esa copa para no contarlos dos veces.",
    },
    editions: [
      // Todavía sin artículo en Wikipedia: de RSSSF.
      {
        year: 2026,
        champion: "lanus",
        runnerUp: "flamengo-br",
        rows: [
          ["2026-02-19", "Final", "lanus", 1, 0, "flamengo-br", "Lanús"],
          ["2026-02-26", "Final", "flamengo-br", 2, 3, "lanus", "Río de Janeiro", { note: "Con alargue." }],
        ],
      },
    ],
  },
  intercontinental: {
    key: "intercontinental",
    championsTitle: "Copa Intercontinental",
    editionTitles: (y) => [`Copa Intercontinental ${y}`],
    rsssf: ["misc/toyota.html"],
    parse: parseToyota,
  },
  interamericana: {
    key: "interamericana",
    championsTitle: "Copa Interamericana",
    editionTitles: (y) => [`Copa Interamericana ${y}`],
    rsssf: ["misc/intam.html"],
    parse: parseIntam,
  },
  mundial: {
    key: "mundial",
    championsTitle: "Copa Mundial de Clubes de la FIFA",
    championsSection: "Ediciones",
    extraYears: [2018, 2025],
    editionTitles: (y) => [`Copa Mundial de Clubes de la FIFA ${y}`],
    rsssf: ["misc/fifawcc.html", "misc/fifa-wcc2007.html", "misc/fifa-wcc2009.html", "misc/fifa-wcc2014.html", "misc/fifa-wcc2015.html", "misc/fifa-wcc2018.html", "misc/fifa-wcc2025.html"],
    stages: {
      "2007-12-12": "Semifinal",
      "2009-12-16": "Semifinal",
      "2014-12-17": "Semifinal",
      "2015-12-16": "Semifinal",
      "2018-12-18": "Semifinal",
      "2018-12-22": "Tercer puesto",
      "2025-06-16": "Fase de grupos",
      "2025-06-17": "Fase de grupos",
      "2025-06-20": "Fase de grupos",
      "2025-06-21": "Fase de grupos",
      "2025-06-24": "Fase de grupos",
      "2025-06-25": "Fase de grupos",
    },
  },
  suruga: {
    key: "suruga",
    championsTitle: "Copa Suruga Bank",
    championsSection: "Ediciones",
    editionTitles: (y) => [`Copa Suruga Bank ${y}`],
    rsssf: ["misc/suruga08.html"],
    editions: [
      { year: 2008, champion: "arsenal", runnerUp: "gamba-osaka-jp", rows: [["2008-07-30", "Final", "gamba-osaka-jp", 0, 1, "arsenal", "Osaka"]] },
      {
        year: 2011,
        champion: "jubilo-iwata-jp",
        runnerUp: "independiente",
        rows: [["2011-08-03", "Final", "jubilo-iwata-jp", 2, 2, "independiente", "Shizuoka", { advancedId: "jubilo-iwata-jp", note: "Penales: 4-2." }]],
      },
      { year: 2014, champion: "kashiwa-reysol-jp", runnerUp: "lanus", rows: [["2014-08-06", "Final", "kashiwa-reysol-jp", 2, 1, "lanus", "Kashiwa"]] },
      { year: 2015, champion: "river", runnerUp: "gamba-osaka-jp", rows: [["2015-08-11", "Final", "gamba-osaka-jp", 0, 3, "river", "Suita (Osaka)"]] },
      { year: 2018, champion: "independiente", runnerUp: "cerezo-osaka-jp", rows: [["2018-08-08", "Final", "cerezo-osaka-jp", 0, 1, "independiente", "Osaka"]] },
    ],
  },
  "master-supercopa": {
    key: "master-supercopa",
    editionTitles: (y) => [`Copa Máster de Supercopa ${y}`],
    rsssf: ["misc/sasupmas92.html"],
    editions: [
      {
        year: 1992,
        champion: "boca",
        runnerUp: "cruzeiro-br",
        rows: [
          ["1992-05-27", "Semifinal", "boca", 1, 0, "olimpia-py", "Buenos Aires (cancha de Vélez)"],
          ["1992-05-29", "Semifinal", "racing", 1, 1, "cruzeiro-br", "Buenos Aires (cancha de Vélez)", { advancedId: "cruzeiro-br", note: "Penales: 1-3." }],
          ["1992-05-31", "Tercer puesto", "olimpia-py", 2, 1, "racing", "Buenos Aires (cancha de Vélez)"],
          ["1992-05-31", "Final", "boca", 2, 1, "cruzeiro-br", "Buenos Aires (cancha de Vélez)"],
        ],
      },
    ],
  },
  oro: {
    key: "oro",
    editionTitles: (y) => [`Copa de Oro Nicolás Leoz ${y}`],
    rsssf: ["misc/oro93.html", "misc/oro96.html", "misc/samisc.html"],
    editions: [
      {
        year: 1993,
        champion: "boca",
        runnerUp: "atletico-mineiro-br",
        rows: [
          ["1993-07-07", "Semifinal", "boca", 1, 0, "sao-paulo-br", "Buenos Aires"],
          ["1993-07-10", "Semifinal", "sao-paulo-br", 1, 1, "boca", "São Paulo", { note: "Con alargue (gol de oro de Boca al minuto 91 para el 1-1)." }],
          ["1993-07-14", "Final", "atletico-mineiro-br", 0, 0, "boca", "Belo Horizonte"],
          ["1993-07-22", "Final", "boca", 1, 0, "atletico-mineiro-br", "Buenos Aires"],
        ],
      },
      { year: 1996, champion: "flamengo-br", runnerUp: "sao-paulo-br", rows: [["1996-08-13", "Semifinal", "flamengo-br", 2, 1, "central", "Manaos"]] },
    ],
  },
  "master-conmebol": {
    key: "master-conmebol",
    editionTitles: () => ["Copa Máster de Conmebol"],
    rsssf: ["misc/mastconmebol96.html"],
    editions: [
      {
        year: 1996,
        champion: "sao-paulo-br",
        runnerUp: "atletico-mineiro-br",
        rows: [["1996-02-09", "Semifinal", "atletico-mineiro-br", 0, 0, "central", "Cuiabá", { advancedId: "atletico-mineiro-br", note: "Penales: 10-9." }]],
      },
    ],
  },
  iberoamericana: {
    key: "iberoamericana",
    editionTitles: (y) => [`Copa Iberoamericana ${y}`],
    rsssf: ["misc/ibero.html"],
    editions: [
      {
        year: 1994,
        champion: "real-madrid-es",
        runnerUp: "boca",
        rows: [
          ["1994-05-19", "Final", "real-madrid-es", 3, 1, "boca", "Madrid", { check: "wikipedia", note: "Confirmado por el texto del artículo de Wikipedia." }],
          ["1994-05-25", "Final", "boca", 2, 1, "real-madrid-es", "Buenos Aires", { check: "wikipedia", note: "Confirmado por el texto del artículo de Wikipedia (Real Madrid campeón 4-3 en el global)." }],
        ],
      },
    ],
  },
  "recopa-clubes": {
    key: "recopa-clubes",
    editionTitles: (y) => [`Recopa Sudamericana de Clubes ${y}`],
    rsssf: ["misc/recopa70.html"],
    editions: [
      {
        year: 1970,
        champion: "mariscal-santa-cruz-bo",
        runnerUp: "el-nacional-ec",
        rows: [
          ["1970-03-22", "Fase de grupos", "mariscal-santa-cruz-bo", 1, 0, "atlanta", "La Paz"],
          ["1970-03-26", "Fase de grupos", "atlanta", 4, 3, "municipal-pe", "La Paz"],
          ["1970-03-28", "Fase de grupos", "atlanta", 3, 3, "union-espanola-cl", "La Paz"],
          ["1970-04-04", "Fase de grupos", "atlanta", 2, 0, "rampla-uy", "Cochabamba"],
        ],
      },
    ],
  },
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

// País de las banderas de Wikipedia (tres letras) → [código del id, nombre].
const WIKI_COUNTRY: Record<string, [string, string]> = {
  BRA: ["br", "Brasil"], CHI: ["cl", "Chile"], PER: ["pe", "Perú"], ECU: ["ec", "Ecuador"], VEN: ["ve", "Venezuela"],
  COL: ["co", "Colombia"], PAR: ["py", "Paraguay"], URU: ["uy", "Uruguay"], BOL: ["bo", "Bolivia"], MEX: ["mx", "México"],
};
const slugOf = (s: string) => plainLower(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Edición en juego, solo de Wikipedia: los partidos de los clubes argentinos, con la fase por la fecha.
async function runCurrent(cup: Cup) {
  const cur = cup.current!;
  const problems: string[] = [];
  const all: WikiMatch[] = [];
  for (const t of cup.editionTitles(cur.year)) all.push(...((await wikiMatches(t)) ?? []));
  const genFile = join("lib", "data", "foreign-clubs.generated.json");
  const gen: { id: string; name: string; shortName: string; fullName: string; country: string }[] = JSON.parse(readFileSync(genFile, "utf8"));
  const idFor = (name: string, code?: string) => {
    const arg = argOf(name);
    if (arg) return arg;
    const cc = code ?? cur.countries?.[name];
    const c = cc ? WIKI_COUNTRY[cc] : undefined;
    // Sin país, primero los rivales de las copas de la Conmebol ("Barcelona" es el de Ecuador, no el de España).
    const bare = (s: string) => nameKey(s.replace(/\s*\([^)]*\)$/, ""));
    const conmebol = FOREIGN_TEAMS.filter((t) => !EXTRA_FOREIGN.some(([id]) => id === t.id)).find((t) => bare(t.name) === nameKey(name) || bare(t.fullName ?? "") === nameKey(name))?.id;
    const known = c ? foreignOf(name, c[1]) : (conmebol ?? foreignOf(name));
    if (known) return known;
    if (!c) {
      problems.push(`No sé de qué país es ${name}`);
      return null;
    }
    // Rival nuevo: se da de alta con su país.
    const id = `${slugOf(name)}-${c[0]}`;
    if (!gen.some((g) => g.id === id)) gen.push({ id, name: `${name} (${c[1]})`, shortName: slugOf(name).replace(/-/g, "").slice(0, 3).toUpperCase(), fullName: `${name} (${c[1]})`, country: c[1] });
    return id;
  };
  const seen = new Set<string>();
  const matches: IntlMatch[] = [];
  for (const w of all) {
    if (!argOf(w.home) && !argOf(w.away)) continue;
    const h = idFor(w.home, w.homeCountry);
    const a = idFor(w.away, w.awayCountry);
    if (!h || !a) continue;
    const date = `${w.year ?? cur.year}-${String(w.month).padStart(2, "0")}-${String(w.day).padStart(2, "0")}`;
    const key = `${date}|${[h, a].sort().join("|")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const stage = cur.stages.find(([until]) => date.slice(5) <= until)?.[1] ?? "Final";
    const m: IntlMatch = { id: "", date, stage, venue: w.city, homeId: h, awayId: a, homeGoals: w.hg, awayGoals: w.ag, check: "wikipedia" };
    if (w.pens) Object.assign(m, { advancedId: w.pens[0] > w.pens[1] ? h : a, note: `Penales: ${w.pens[0]}-${w.pens[1]}.` });
    matches.push(m);
  }
  const edition: IntlEdition = {
    year: cur.year,
    championId: "",
    runnerUpId: "",
    inProgress: true,
    matches: matches.sort((x, y) => x.date.localeCompare(y.date)).map((m, i) => ({ ...m, id: `${cup.key}-${cur.year}-${String(i + 1).padStart(3, "0")}` })),
  };
  writeFileSync(join("scripts", "import", "data", `${cup.key}.json`), JSON.stringify([edition], null, 1) + "\n");
  writeFileSync(genFile, JSON.stringify(gen.sort((x, y) => x.id.localeCompare(y.id)), null, 1) + "\n");
  console.log(`${cup.key}: ${cur.year} en juego, ${matches.length} partidos de clubes argentinos (Wikipedia)`);
  for (const p of problems) console.log(`  ✗ ${p}`);
}

async function run(cup: Cup) {
  if (cup.current) return runCurrent(cup);
  const problems: string[] = [];
  const warnings: string[] = [];

  // Páginas de RSSSF: líneas (crudas y normalizadas).
  const rsssfRaw: string[] = [];
  for (const f of cup.rsssf) {
    const p = join(".cache", "rsssf", f);
    if (!existsSync(p)) {
      problems.push(`Falta la página de RSSSF ${f}`);
      continue;
    }
    const raw = readFileSync(p);
    const utf8 = raw.toString("utf8");
    const html = utf8.includes("�") ? raw.toString("latin1") : utf8;
    rsssfRaw.push(
      ...html
        .replace(/<[^>]*>/g, "")
        .replace(/&[a-z]+;/g, (e) => ({ "&aacute;": "á", "&eacute;": "é", "&iacute;": "í", "&oacute;": "ó", "&uacute;": "ú", "&ntilde;": "ñ", "&atilde;": "ã", "&ecirc;": "ê", "&nbsp;": " " })[e] ?? " ")
        .split(/\r?\n/),
    );
  }
  const rsssfKeys = rsssfRaw.map((l) => ` ${plain(l).toLowerCase().replace(/[^a-z0-9-]+/g, " ")} `);
  const mentions = (key0: string, id: string) =>
    aliasesOf(id).some((a) => {
      const key = key0.replace(/-/g, " ");
      const k = plain(a).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      return k.length > 2 && key.includes(` ${k} `);
    });
  const inRsssf = (m: IntlMatch) =>
    rsssfKeys.some(
      (k) => mentions(k, m.homeId) && mentions(k, m.awayId) && (k.includes(`${m.homeGoals}-${m.awayGoals}`) || k.includes(`${m.awayGoals}-${m.homeGoals}`)),
    );

  // Campeones de Wikipedia (edición, finalistas y resultados de la final).
  const champs: WikiChampion[] = cup.championsTitle ? await wikiChampions(cup.championsTitle, cup.championsSection) : [];
  const idOf = (t: { name: string; country: string }) => (/argentina/i.test(t.country) ? argOf(t.name) : (foreignOf(t.name, t.country) ?? foreignOf(t.name)));

  // Partidos de Wikipedia de una edición.
  const wikiOf = async (year: number) => {
    const all: WikiMatch[] = [];
    for (const t of cup.editionTitles(year)) all.push(...((await wikiMatches(t)) ?? []));
    return all;
  };
  const sameMatch = (w: WikiMatch, m: IntlMatch) => {
    const h = argOf(w.home) ?? foreignOf(w.home);
    const a = argOf(w.away) ?? foreignOf(w.away);
    const sameTeams = (h === m.homeId && a === m.awayId) || (h === m.awayId && a === m.homeId);
    const score = h === m.homeId ? [w.hg, w.ag] : [w.ag, w.hg];
    const t = Date.UTC(w.year ?? +m.date.slice(0, 4), w.month - 1, w.day);
    return sameTeams && score[0] === m.homeGoals && score[1] === m.awayGoals && Math.abs(t - Date.parse(m.date)) <= 2 * 864e5;
  };

  const out: IntlEdition[] = [];
  const toMatch = (r: Row): IntlMatch => {
    const [date, stage, homeId, homeGoals, awayGoals, awayId, venue, extra] = r;
    return { id: "", date, stage, venue, homeId, awayId, homeGoals, awayGoals, check: "ciudad", ...extra };
  };

  // 1) Ediciones escritas a mano y las del lector de RSSSF: se confirman con Wikipedia.
  const manual: Edition[] = [...(cup.editions ?? [])];
  if (cup.parse) {
    const parsed = cup.parse(rsssfRaw);
    for (const p of parsed) for (const id of [p.row[2], p.row[5]]) if (id.startsWith("?")) problems.push(`No identifiqué a ${id.slice(1)} (${p.row[0]})`);
    // Edición de Wikipedia: la del cruce (los mismos dos clubes en la final) más cercana en el tiempo.
    for (const p of parsed) {
      const pair = [p.row[2], p.row[5]].sort().join("|");
      const cands = champs.filter((c) => [idOf(c.champion), idOf(c.runnerUp)].sort().join("|") === pair);
      const best = cands.sort((a, b) => Math.abs(a.year - +p.row[0].slice(0, 4)) - Math.abs(b.year - +p.row[0].slice(0, 4)))[0];
      const year = p.year && cands.some((c) => c.year === p.year) ? p.year : best?.year;
      if (!year) {
        problems.push(`Sin edición en Wikipedia para ${p.row.slice(0, 6).join(" ")}`);
        continue;
      }
      let ed = manual.find((e) => e.year === year);
      if (!ed) manual.push((ed = { year, champion: idOf(best?.year === year ? best.champion : cands.find((c) => c.year === year)!.champion) ?? "", runnerUp: "", rows: [] }));
      const c = champs.find((x) => x.year === year)!;
      ed.champion = idOf(c.champion) ?? "";
      ed.runnerUp = idOf(c.runnerUp) ?? "";
      ed.rows.push(p.row);
    }
  }
  for (const e of manual.sort((a, b) => a.year - b.year)) {
    const wiki = await wikiOf(e.year);
    const c = champs.find((x) => x.year === e.year);
    const matches = e.rows.map(toMatch);
    for (const m of matches) {
      if (m.check !== "ciudad") continue;
      const w = wiki.find((x) => sameMatch(x, m));
      // La final, también contra los resultados de la tabla de campeones de Wikipedia.
      const inTable = /^Final/.test(m.stage) && c?.results.some(([x, y]) => (x === m.homeGoals && y === m.awayGoals) || (x === m.awayGoals && y === m.homeGoals));
      if (w || inTable) m.check = "wikipedia";
      else if (inRsssf(m)) {
        m.check = "edicion";
        warnings.push(`${e.year} ${m.date} ${m.homeId} ${m.homeGoals}-${m.awayGoals} ${m.awayId}: solo RSSSF`);
      } else problems.push(`${e.year} ${m.date} ${m.homeId} ${m.homeGoals}-${m.awayGoals} ${m.awayId}: no está en RSSSF ni en Wikipedia`);
    }
    if (c && (idOf(c.champion) !== e.champion || idOf(c.runnerUp) !== e.runnerUp))
      problems.push(`${e.year}: Wikipedia da ${c.champion.name}/${c.runnerUp.name}, acá ${e.champion}/${e.runnerUp}`);
    out.push({ year: e.year, championId: e.champion, runnerUpId: e.runnerUp, matches });
  }

  // 2) Ediciones de Wikipedia (Recopa, Mundial de Clubes): partidos del artículo, confirmados con RSSSF.
  if (!cup.parse) {
    for (const c of champs) {
      if (out.some((e) => e.year === c.year)) continue;
      const hasArg = /argentina/i.test(c.champion.country) || /argentina/i.test(c.runnerUp.country) || cup.extraYears?.includes(c.year);
      if (!hasArg) continue;
      const champion = idOf(c.champion);
      const runnerUp = idOf(c.runnerUp);
      if (!champion || !runnerUp) problems.push(`${c.year}: no identifiqué a ${champion ? c.runnerUp.name : c.champion.name}`);
      const seen = new Set<string>();
      const matches: IntlMatch[] = [];
      for (const w of await wikiOf(c.year)) {
        if (!argOf(w.home) && !argOf(w.away)) continue;
        const h = argOf(w.home) ?? foreignOf(w.home);
        const a = argOf(w.away) ?? foreignOf(w.away);
        if (!h || !a) {
          problems.push(`${c.year}: no identifiqué a ${h ? w.away : w.home} (${w.day}/${w.month})`);
          continue;
        }
        const date = `${w.year ?? c.year}-${String(w.month).padStart(2, "0")}-${String(w.day).padStart(2, "0")}`;
        const key = `${date}|${[h, a].sort().join("|")}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const m: IntlMatch = { id: "", date, stage: cup.stages?.[date] ?? "Final", venue: w.city, homeId: h, awayId: a, homeGoals: w.hg, awayGoals: w.ag, check: "edicion" };
        if (w.pens) Object.assign(m, { advancedId: w.pens[0] > w.pens[1] ? h : a, note: `Penales: ${w.pens[0]}-${w.pens[1]}.` });
        if (!inRsssf(m)) {
          const inTable = m.stage === "Final" && c.results.some(([x, y]) => (x === m.homeGoals && y === m.awayGoals) || (x === m.awayGoals && y === m.homeGoals));
          m.check = inTable ? "wikipedia" : "ciudad";
          if (!inTable) warnings.push(`${c.year} ${date} ${h} ${w.hg}-${w.ag} ${a}: no lo encontré en RSSSF`);
        }
        matches.push(m);
      }
      if (!matches.length) problems.push(`${c.year}: sin partidos de clubes argentinos en Wikipedia`);
      out.push({ year: c.year, championId: champion ?? "", runnerUpId: runnerUp ?? "", matches });
    }
  }

  const sorted = out
    .sort((a, b) => a.year - b.year)
    .map((e) => (cup.sharedYears?.[e.year] ? { ...e, matches: [], note: cup.sharedYears[e.year] } : e))
    .map((e) => ({ ...e, matches: e.matches.sort((x, y) => x.date.localeCompare(y.date)).map((m, i) => ({ ...m, id: `${cup.key}-${e.year}-${String(i + 1).padStart(3, "0")}` })) }));
  writeFileSync(join("scripts", "import", "data", `${cup.key}.json`), JSON.stringify(sorted, null, 1) + "\n");

  // Rivales de otros continentes usados: al archivo de clubes del exterior generados.
  const genFile = join("lib", "data", "foreign-clubs.generated.json");
  const gen: { id: string; name: string; shortName: string; fullName: string; country: string }[] = JSON.parse(readFileSync(genFile, "utf8"));
  const used = new Set(sorted.flatMap((e) => [e.championId, e.runnerUpId, ...e.matches.flatMap((m) => [m.homeId, m.awayId])]));
  for (const [id, name, country] of EXTRA_FOREIGN)
    if (used.has(id) && !gen.some((g) => g.id === id))
      gen.push({ id, name: `${name} (${country})`, shortName: plain(name).replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase(), fullName: `${name} (${country})`, country });
  writeFileSync(genFile, JSON.stringify(gen.sort((a, b) => a.id.localeCompare(b.id)), null, 1) + "\n");
  for (const id of used) if (id && !ARGS.some((c) => c.id === id) && !gen.some((g) => g.id === id) && !FOREIGN_TEAMS.some((t) => t.id === id)) problems.push(`Club sin alta: ${id}`);

  const n = sorted.reduce((s, e) => s + e.matches.length, 0);
  const by = (k: IntlMatch["check"]) => sorted.reduce((s, e) => s + e.matches.filter((m) => m.check === k).length, 0);
  console.log(`${cup.key}: ${sorted.length} ediciones, ${n} partidos (${by("edicion")} RSSSF, ${by("wikipedia")} Wikipedia, ${by("ciudad")} sin segunda fuente)`);
  for (const w of warnings) console.log(`  · ${w}`);
  for (const p of problems) console.log(`  ✗ ${p}`);
}

async function main() {
  const wanted = process.argv.slice(2);
  for (const k of wanted.length ? wanted : Object.keys(CUPS)) {
    if (!CUPS[k]) throw new Error(`Copa desconocida: ${k}`);
    await run(CUPS[k]);
  }
}
main();
