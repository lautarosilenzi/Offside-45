// Arma lib/data/champions.generated.json: por competencia, la lista de campeones (temporada, campeón, subcampeón) con su
// fuente. Para las competencias sin lista por temporada se da vuelta la tabla "títulos por club" (club → años).
//
// Uso (los artículos de Wikipedia se guardan en .cache/champions):
//   node scripts/champions/fetch.cjs                  # descarga los artículos de list.txt
//   node scripts/champions/check.cjs                  # compara cada lista con la tabla de títulos por club del artículo
//   node scripts/champions/build.cjs lib/data/champions.generated.json
const fs = require("fs");
const path = require("path");
const { extract, tables, parseTable } = require("./parse.cjs");
const OPTS = require("./opts.cjs");

process.chdir(path.join(__dirname, "../../.cache/champions"));
const OUT = process.argv[2] ? path.resolve(__dirname, "../..", process.argv[2]) : null;

const TITLES = Object.fromEntries(
  fs
    .readFileSync(path.join(__dirname, "list.txt"), "utf8")
    .trim()
    .split("\n")
    .map((l) => l.split("|")),
);

// Competencias armadas desde la tabla por club: tabla, columna del club, de los años ganados y de los años subcampeón.
const FROM_SUMMARY = {
  "copa-america": { file: "copa-america", table: 1, team: 0, years: 1, runner: 2 },
  "ligue-2": { file: "ligue-2", table: 2, team: 0, years: 3, runner: 4 },
};

// Selecciones (códigos de la FIFA) en castellano.
const NATIONS = {
  ARG: "Argentina", URU: "Uruguay", BRA: "Brasil", PAR: "Paraguay", PER: "Perú", COL: "Colombia", CHI: "Chile", BOL: "Bolivia",
  ECU: "Ecuador", VEN: "Venezuela", MEX: "México", USA: "Estados Unidos", ESP: "España", ITA: "Italia", GER: "Alemania",
  FRG: "Alemania Federal", URS: "Unión Soviética", FRA: "Francia", NED: "Países Bajos", DEN: "Dinamarca", GRE: "Grecia",
  POR: "Portugal", TCH: "Checoslovaquia", ENG: "Inglaterra", BEL: "Bélgica", YUG: "Yugoslavia", HUN: "Hungría", CRC: "Costa Rica",
  SLV: "El Salvador", HON: "Honduras", GUA: "Guatemala", HAI: "Haití", TRI: "Trinidad y Tobago", SUR: "Surinam", NGY: "Guayana Neerlandesa",
  EGY: "Egipto", CMR: "Camerún", GHA: "Ghana", CIV: "Costa de Marfil", NGA: "Nigeria", ALG: "Argelia", MAR: "Marruecos", TUN: "Túnez",
  ZAM: "Zambia", SEN: "Senegal", COD: "RD del Congo", ZAI: "Zaire", CGO: "Congo", SUD: "Sudán", ETH: "Etiopía", RSA: "Sudáfrica", KSA: "Arabia Saudita",
  JPN: "Japón", KOR: "Corea del Sur", PRK: "Corea del Norte", IRN: "Irán", IRQ: "Irak", KUW: "Kuwait", ISR: "Israel", AUS: "Australia", QAT: "Catar",
  CHN: "China", UAE: "Emiratos Árabes", CAN: "Canadá", PAN: "Panamá", JAM: "Jamaica", NOR: "Noruega", SWE: "Suecia", GDR: "Alemania Oriental",
  POL: "Polonia", GBR: "Gran Bretaña", SRB: "Serbia", UKR: "Ucrania", RUS: "Rusia", EUN: "Equipo Unificado", SUI: "Suiza", CRO: "Croacia",
  NZL: "Nueva Zelanda", SPA: "España", CSK: "Checoslovaquia", DDR: "Alemania Oriental",
};
// Selecciones escritas en inglés en las tablas por equipo.
const EN = {
  Spain: "España", Germany: "Alemania", "West Germany": "Alemania Federal", Brazil: "Brasil", Italy: "Italia", France: "Francia", England: "Inglaterra",
  Netherlands: "Países Bajos", Mexico: "México", "United States": "Estados Unidos", Nigeria: "Nigeria", Ghana: "Ghana", Cameroon: "Camerún",
  Egypt: "Egipto", Senegal: "Senegal", "Ivory Coast": "Costa de Marfil", Algeria: "Argelia", Morocco: "Marruecos", Tunisia: "Túnez", Japan: "Japón",
  "South Korea": "Corea del Sur", Iran: "Irán", "Saudi Arabia": "Arabia Saudita", Australia: "Australia", Iraq: "Irak", Qatar: "Catar", Kuwait: "Kuwait",
  Israel: "Israel", Uruguay: "Uruguay", Chile: "Chile", Colombia: "Colombia", Norway: "Noruega", Sweden: "Suecia", "Soviet Union": "Unión Soviética",
  Hungary: "Hungría", Poland: "Polonia", Yugoslavia: "Yugoslavia", Belgium: "Bélgica", Canada: "Canadá", Ukraine: "Ucrania", Zambia: "Zambia",
  Congo: "Congo", "DR Congo": "RD del Congo", Zaire: "Zaire", Sudan: "Sudán", Ethiopia: "Etiopía", "Costa Rica": "Costa Rica", Portugal: "Portugal",
  Argentina: "Argentina", Paraguay: "Paraguay", Peru: "Perú", Serbia: "Serbia", "Great Britain": "Gran Bretaña", "East Germany": "Alemania Oriental",
  "Unified Team": "Equipo Unificado", Czechoslovakia: "Checoslovaquia", Denmark: "Dinamarca", "North Korea": "Corea del Norte", "China PR": "China",
  "South Africa": "Sudáfrica", Honduras: "Honduras", "Republic of Ireland": "Irlanda", Scotland: "Escocia", Switzerland: "Suiza", Austria: "Austria",
};
const nation = (s) => (s && s.startsWith("@") ? NATIONS[s.slice(1)] ?? EN[s.slice(1)] ?? s.slice(1) : EN[s] ?? s);

const SKIP = /^TBD$|not (held|awarded|contested|played)|cancel|abandon|suspend|no champion|no championship|disaster|void|declared|^—$|^-$|title declined/i;

function invert(cfg) {
  const w = fs.readFileSync(`${cfg.file}.wiki`, "utf8");
  const rows = parseTable(tables(w)[cfg.table].body).filter((r) => !r.header);
  const champs = new Map();
  const runners = new Map();
  const years = (s) => (s ?? "").match(/\b(?:18|19|20)\d\d(?:[–-]\d{2,4})?/g) ?? [];
  for (const r of rows) {
    const team = r.cells[cfg.team];
    for (const y of years(r.cells[cfg.years])) champs.set(y, [...(champs.get(y) ?? []), team]);
    for (const y of years(r.cells[cfg.runner])) runners.set(y, [...(runners.get(y) ?? []), team]);
  }
  // Años con dos ediciones (Copa América 1959): dos campeones; el subcampeón solo si no hay duda.
  return [...champs.entries()].sort((a, b) => a[0].localeCompare(b[0])).flatMap(([y, cs]) => cs.map((c) => ({ season: y, champion: c, ...(cs.length === 1 && runners.get(y)?.length === 1 ? { runnerUp: runners.get(y)[0] } : {}) })));
}

// Tabla por equipo con los años de cada título ("Team | Winners | Years won…" o "Team | Titles" con los años entre
// paréntesis): se busca sola. Devuelve también los títulos que dice la tabla, para controlar que la cuenta cierre.
function autoInvert(w) {
  const yearsIn = (s) => (s ?? "").match(/\b(?:18|19|20)\d\d(?:[–-]\d{2,4})?/g) ?? [];
  for (const t of tables(w)) {
    const rows = parseTable(t.body);
    const hi = rows.findIndex((r) => r.header);
    if (hi < 0) continue;
    const head = rows[hi].cells;
    const team = head.findIndex((h) => /^(team|club|nation|country|clubs?)$/i.test(h));
    if (team < 0) continue;
    // Las filas pueden empezar con "!" (el club como encabezado de fila): se toman todas menos las que repiten el encabezado.
    const data = rows.slice(hi + 1).filter((r) => r.cells[team] && r.cells.join("|") !== head.join("|"));
    // Columna con años: alcanza con que la tengan dos equipos (en las de selecciones, muchos nunca salieron campeones).
    const withYears = (i) => data.filter((r) => yearsIn(r.cells[i]).length).length >= 2;
    const yCol = head.findIndex((h, i) => /years? won|winning (years|seasons|editions)|seasons won|^titles?$|^winners$|^champions?$/i.test(h) && withYears(i));
    if (yCol < 0) continue;
    const rCol = head.findIndex((h, i) => /runner|years? lost|runner-up (years|seasons)/i.test(h) && withYears(i));
    const nCol = head.findIndex((h) => /^(winners|titles?|champions?)$/i.test(h));
    const champs = new Map();
    const runners = new Map();
    let declared = 0;
    let found = 0;
    for (const r of data) {
      const ys = yearsIn(r.cells[yCol]);
      found += ys.length;
      declared += Number(String(r.cells[nCol] ?? "").match(/^\d+/)?.[0] ?? ys.length);
      for (const y of ys) champs.set(y, [...(champs.get(y) ?? []), r.cells[team]]);
      if (rCol >= 0) for (const y of yearsIn(r.cells[rCol])) runners.set(y, [...(runners.get(y) ?? []), r.cells[team]]);
    }
    if (!found) continue;
    const list = [...champs.entries()].sort((a, b) => a[0].localeCompare(b[0])).flatMap(([y, cs]) => cs.map((c) => ({ season: y, champion: c, ...(cs.length === 1 && runners.get(y)?.length === 1 ? { runnerUp: runners.get(y)[0] } : {}) })));
    return { list, declared, found };
  }
  return null;
}

// Competencias que se arman con la tabla por equipo (las listas por temporada de esos artículos tienen otro formato).
const PREFER_SUMMARY = new Set([
  "league-cup", "supercopa-alemania", "supercopa-italia", "supercopa-espana", "supercopa-europa", "copa-paises-bajos", "liga-1-peru", "liga-futve",
  "trophee-champions", "copa-chile", "champions-femenina", "copa-africana",
]);

const out = {};
for (const id of Object.keys(TITLES)) {
  if (!fs.existsSync(`${id}.wiki`)) continue;
  const w = fs.readFileSync(`${id}.wiki`, "utf8");
  let rows = FROM_SUMMARY[id] ? invert(FROM_SUMMARY[id]) : extract(w, OPTS[id] || {});
  if (PREFER_SUMMARY.has(id) || rows.length < 3) {
    const inv = autoInvert(w);
    if (inv && inv.list.length >= 2) {
      rows = inv.list;
      if (inv.declared !== inv.found) console.log(`  ! ${id}: la tabla dice ${inv.declared} títulos y tiene ${inv.found} años`);
    }
  }
  rows = rows
    // Títulos compartidos ("Dumbarton (1) and / Rangers"): un campeón por club, sin subcampeón.
    .flatMap((r) => (/\s+and\s*\/\s*/.test(r.champion) ? r.champion.split(/\s+and\s*\/\s*/).map((c) => ({ season: r.season, champion: c.replace(/\s*\(\d+\)$/, "") })) : [r]))
    .filter((r) => r.champion && !SKIP.test(r.champion))
    .map((r) => ({ season: r.season, champion: nation(r.champion), ...(r.runnerUp && !SKIP.test(r.runnerUp) ? { runnerUp: nation(r.runnerUp) } : {}) }))
    .map((r, i) => ({ r, i, y: Number((r.season.match(/\d{4}/) ?? ["0"])[0]) }))
    .sort((a, b) => b.y - a.y || b.i - a.i) // del más reciente al más viejo; en el mismo año, el último que se jugó primero
    .map((x) => x.r);
  out[id] = { source: `https://en.wikipedia.org/wiki/${encodeURIComponent(TITLES[id].replace(/ /g, "_"))}`, rows };
}
fs.writeFileSync(OUT ?? "champions.generated.json", JSON.stringify(out));
for (const [id, v] of Object.entries(out)) {
  const t = {};
  v.rows.forEach((r) => (t[r.champion] = (t[r.champion] || 0) + 1));
  const top = Object.entries(t).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} ${n}`).join(", ");
  console.log(id.padEnd(22), String(v.rows.length).padStart(4), "|", v.rows[0]?.season, v.rows[0]?.champion, "|", top);
}
