// Corre el lector sobre todos los artículos y compara la cantidad de títulos por club de la lista temporada por temporada
// con la tabla "títulos por club" del mismo artículo (si la tiene). Imprime las diferencias.
const fs = require("fs");
const { extract, tables, parseTable } = require("./parse.cjs");
const OPTS = require("./opts.cjs");

process.chdir(require("path").join(__dirname, "../../.cache/champions"));

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(fc|cf|ac|sc|cd|ca|club|de|the|f\.c\.|a\.c\.)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

function summary(w) {
  for (const t of tables(w)) {
    const rows = parseTable(t.body);
    const hi = rows.findIndex((r) => r.header);
    if (hi < 0) continue;
    const head = rows[hi].cells;
    const club = head.findIndex((h) => /^(club|team|clubs?|nation)$/i.test(h));
    const wins = head.findIndex((h) => /^(winners?|titles|champions|wins|championships|titles won)$/i.test(h));
    if (club < 0 || wins < 0) continue;
    const out = {};
    for (const r of rows.slice(hi + 1)) {
      const n = Number(r.cells[wins]);
      if (r.cells[club] && Number.isFinite(n) && n > 0) out[norm(r.cells[club])] = { name: r.cells[club], n };
    }
    if (Object.keys(out).length >= 2) return out;
  }
  return null;
}

const only = process.argv[2];
for (const f of fs.readdirSync(".").filter((f) => f.endsWith(".wiki"))) {
  const id = f.slice(0, -5);
  if (only && id !== only) continue;
  const w = fs.readFileSync(f, "utf8");
  const rows = extract(w, OPTS[id] || {}).filter((r) => !/not (held|awarded|contested)|cancel|abandon|suspend|no champion|^—$|^-$/i.test(r.champion));
  const tally = {};
  for (const r of rows) {
    const k = norm(r.champion);
    tally[k] = tally[k] || { name: r.champion, n: 0 };
    tally[k].n++;
  }
  const sum = summary(w);
  let diffs = [];
  if (sum) {
    for (const [k, v] of Object.entries(sum)) {
      const mine = tally[k]?.n ?? 0;
      if (mine !== v.n) diffs.push(`${v.name}: tabla ${v.n} / lista ${mine}`);
    }
  }
  const top = Object.values(tally).sort((a, b) => b.n - a.n).slice(0, 3).map((x) => `${x.name} ${x.n}`).join(", ");
  console.log(`${id.padEnd(22)} ${String(rows.length).padStart(4)} | ${rows[0]?.season} → ${rows[rows.length - 1]?.season}: ${rows[rows.length - 1]?.champion} | ${top} | ${sum ? (diffs.length ? "DIF " + diffs.slice(0, 4).join("; ") : "OK con tabla por club") : "sin tabla por club"}`);
}
