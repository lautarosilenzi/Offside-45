import { fetchPage, parseSeason } from "./rsssf-parse";
(async () => {
  const re = new RegExp(process.argv[3]);
  for (const s of parseSeason(await fetchPage(process.argv[2]))) {
    if (!re.test(s.heading)) continue;
    console.log("##", s.heading, s.matches.length);
    for (const t of s.tables.slice(0, 1)) for (const r of t.slice(0, 6)) console.log("  ", r.pos, r.name, r.played, r.points);
    const st = new Map<string, number>();
    for (const m of s.matches) st.set(m.round ?? "-", (st.get(m.round ?? "-") ?? 0) + 1);
    console.log("  rondas:", [...st.entries()].filter(([k]) => !/^Round \d+$/i.test(k)).map(([k, v]) => `${k}=${v}`).join(" | ").slice(0, 600));
  }
})();
