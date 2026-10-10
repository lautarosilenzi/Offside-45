import { fetchPage, parseSeason } from "./rsssf-parse";
(async () => {
  const c = new Map<string, number>();
  for (const s of parseSeason(await fetchPage(process.argv[2]))) for (const m of s.matches) for (const n of [m.home, m.away]) c.set(n, (c.get(n) ?? 0) + 1);
  console.log([...c.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([n, k]) => `${n}(${k})`).join(" | "));
})();
