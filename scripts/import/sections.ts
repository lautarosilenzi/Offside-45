// Resumen de secciones de una página de RSSSF: tablas y partidos leídos en cada una.
import { fetchPage, parseSeason } from "./rsssf-parse";
(async () => {
  for (const f of process.argv.slice(2)) {
    for (const s of parseSeason(await fetchPage(f))) {
      if (!s.tables.length && !s.matches.length) continue;
      const t = s.tables.map((x) => `${x.length}eq/${x.reduce((n, r) => n + r.played, 0) / 2}pj`).join(" ");
      console.log(`${f} | ${s.heading.slice(0, 50).padEnd(50)} | tablas: ${t || "-"} | partidos: ${s.matches.length}`);
    }
  }
})();
