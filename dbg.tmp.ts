import { fetchPage, parseSeason } from "C:/Users/Pablo/Desktop/o45/scripts/import/rsssf-parse";
(async () => {
  const secs = parseSeason(await fetchPage(process.argv[2]), { cup: process.env.CUP === "1" });
  for (const s of secs) {
    console.log("## SECTION", s.heading, "tables:", s.tables.map((t, i) => `${i}:[${t.map((r) => r.name).slice(0, 3).join(",")}…](${t.length})`).join(" "));
    for (const m of s.matches) console.log(`${m.date} | ${m.group ?? ""} | ${m.round ?? ""} | ${m.home} | ${m.score} | ${m.away} | ${m.note}`);
  }
})();
