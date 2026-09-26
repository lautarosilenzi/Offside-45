import { fetchPage, parseSeason } from "./scripts/import/rsssf-parse";
import { resolveName } from "./scripts/import/aliases";
(async () => {
  const unknown = new Map<string, string>();
  for (const y of process.argv.slice(2)) {
    for (const s of parseSeason(await fetchPage(`arg${y}.html`))) {
      for (const m of s.matches) for (const n of [m.home, m.away]) if (!resolveName(n, 1900 + Number(y) - 1)) unknown.set(n, `${y} ${s.heading.slice(0, 40)}`);
    }
  }
  for (const [n, w] of [...unknown].sort()) console.log(JSON.stringify(n), "·", w);
})();
