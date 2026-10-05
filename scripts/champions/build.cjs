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
};
const nation = (s) => (s && s.startsWith("@") ? NATIONS[s.slice(1)] ?? s.slice(1) : s);

const SKIP = /not (held|awarded|contested|played)|cancel|abandon|suspend|no champion|no championship|disaster|void|declared|^—$|^-$|title declined/i;

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

const out = {};
for (const id of Object.keys(TITLES)) {
  if (!fs.existsSync(`${id}.wiki`)) continue;
  let rows = FROM_SUMMARY[id] ? invert(FROM_SUMMARY[id]) : extract(fs.readFileSync(`${id}.wiki`, "utf8"), OPTS[id] || {});
  rows = rows
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
