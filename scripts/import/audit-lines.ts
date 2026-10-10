// Control de líneas perdidas: en cada página de RSSSF, las líneas con forma de partido ("Equipo  2-1  Equipo")
// que el lector no tomó como partido. Uso: npx tsx scripts/import/audit-lines.ts arg2-97.html arg2-98.html …
import { fetchPage, parseSeason } from "./rsssf-parse";

const squash = (s: string) => s.normalize("NFC").replace(/&nbsp;/g, " ").replace(/\s+/g, "");

(async () => {
  for (const f of process.argv.slice(2)) {
    const html = await fetchPage(f);
    const lines = html.replace(/<[^>]*>/g, "").split(/\r?\n/);
    // Cada partido leído: local + visitante sin espacios, para buscarlo en la línea.
    const read = parseSeason(html).flatMap((s) => s.matches.map((m) => [squash(m.home), squash(m.away)] as const));
    const missed = lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => /\p{L}.*?[\s)\]]\s*[[(]?\d*[\])]?\d{1,2}\s*-\s*\d{1,2}\s*[[(]?\d*[\])]?\s+\p{L}/u.test(l))
      // Tablas, goles, formaciones y notas.
      .filter(({ l }) => !/^\s*\d+\.\s|^\s|;|'|Goals|Note|Referee|Coach|\bon PK\b/i.test(l))
      .filter(({ l }) => {
        const s = squash(l);
        return !read.some(([h, a]) => s.includes(h) && s.includes(a));
      });
    console.log(`${f}: ${missed.length} líneas con forma de partido sin leer`);
    for (const { l, i } of missed.slice(0, 15)) console.log(`  L${i + 1}: ${l.trim().slice(0, 110)}`);
  }
})();
