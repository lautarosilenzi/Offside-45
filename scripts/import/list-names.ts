// Herramienta para dar de alta clubes: lista los nombres de una sección de RSSSF que no se identifican.
// Uso: npx tsx scripts/import/list-names.ts <archivo> <año> <regex del título> <regex del título siguiente>
// Muestra también la tabla de nombres completos con la sede, si la página la trae.
import { parseSeason, fetchPage } from "./rsssf-parse";
import { resolveName, setLocalAliases } from "./aliases";
import { TOURNAMENTS, A_COPA_2020 } from "./config";
import { CUP_TOURNAMENTS } from "./config-cups";

const [file, yearArg, from, to, slug] = process.argv.slice(2);
const year = Number(yearArg);
const cfg = slug ? [...TOURNAMENTS, ...CUP_TOURNAMENTS].find((t) => t.slug === slug) : undefined;
setLocalAliases(cfg?.aliases ?? A_COPA_2020);
async function main() {
const sections = parseSeason(await fetchPage(file), { cup: true, contextPath: true, headings: [new RegExp(from), new RegExp(to)] });
const sec = sections.filter((s) => new RegExp(from).test(s.heading)).sort((a, b) => b.matches.length - a.matches.length)[0];
if (!sec) throw new Error("no encontré la sección");
const counts = new Map<string, number>();
for (const m of sec.matches) for (const n of [m.home, m.away]) counts.set(n, (counts.get(n) ?? 0) + 1);
console.log(`${sec.matches.length} partidos, ${counts.size} nombres`);
for (const [n, c] of [...counts].sort()) {
  const r = resolveName(n, year);
  if (!r) console.log(`  ? ${n} (${c})`);
  else if (process.env.ALL) console.log(`    ${n} → ${r.id}`);
}
const heads = sec.text.filter((l) => /^\s*\d+\.\S.*\(\s*[^)]*,\s*[A-Z]\)\s*$/.test(l));
if (heads.length) {
  console.log("Tabla con sede:");
  for (const l of heads) {
    const m = l.match(/^\s*\d+\.(.+?)\s{2,}.*\(([^)]*)\)\s*$/);
    if (m && (!resolveName(m[1].trim(), year) || process.env.ALL)) console.log(`  ${m[1].trim()} | ${m[2]} → ${resolveName(m[1].trim(), year)?.id ?? "?"}`);
  }
}
}
main();
