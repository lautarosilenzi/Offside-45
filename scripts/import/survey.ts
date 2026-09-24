// Recorre las temporadas y compara partidos encontrados contra la tabla publicada.
import { fetchPage, parseSeason } from "./rsssf-parse";

const FILES: Record<number, string> = {};
for (let y = 1897; y <= 1909; y++) FILES[y] = `arg${y}.html`;
for (let y = 1910; y <= 1930; y++) FILES[y] = `arg${String(y).slice(2)}.html`;

(async () => {
  for (const [year, file] of Object.entries(FILES)) {
    let html: string;
    try {
      html = await fetchPage(file);
    } catch (e) {
      console.log(year, "ERROR", (e as Error).message);
      continue;
    }
    const secs = parseSeason(html);
    for (const s of secs) {
      if (!s.tables.length && !s.matches.length) continue;
      const t = s.tables[0] ?? [];
      const games = t.reduce((n, r) => n + r.played, 0) / 2;
      const played = s.matches.filter((m) => /^\d+[:\-]\d+$|^(wp|lp)[:\-](wp|lp)$|^[wld][:\-][wld]$/.test(m.score)).length;
      console.log(
        `${year} | ${s.heading.slice(0, 60).padEnd(60)} | tablas ${s.tables.length} (${t.length} eq, ${games} pj) | partidos ${s.matches.length} (válidos ${played})`,
      );
    }
  }
})();
