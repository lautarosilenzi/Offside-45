import { fetchPage, parseSeason } from "./rsssf-parse";
const files = [...Array.from({ length: 13 }, (_, i) => `arg${1897 + i}.html`), ...Array.from({ length: 21 }, (_, i) => `arg${String(1910 + i).slice(2)}.html`)];
(async () => {
  const names = new Map<string, Set<number>>();
  for (const f of files) {
    const y = f.length === 12 ? +f.slice(3, 7) : 1900 + +f.slice(3, 5);
    for (const s of parseSeason(await fetchPage(f))) {
      for (const t of s.tables) for (const r of t) (names.get(r.name) ?? names.set(r.name, new Set()).get(r.name)!).add(y);
      for (const m of s.matches) for (const n of [m.home, m.away]) (names.get(n) ?? names.set(n, new Set()).get(n)!).add(y);
    }
  }
  const sorted = [...names.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [n, ys] of sorted) { const a = [...ys].sort(); console.log(`${n}\t${a[0]}-${a[a.length - 1]}\t${a.length}`); }
  console.error("total", sorted.length);
})();
