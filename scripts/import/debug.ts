import { fetchPage, parseSeason } from "./rsssf-parse";
(async () => {
  const [file, what] = process.argv.slice(2);
  const secs = parseSeason(await fetchPage(file));
  for (const s of secs) {
    console.log("## SECTION:", s.heading, "| tables:", s.tables.map((t) => t.length).join(","));
    if (what === "tables") for (const t of s.tables) console.log(t.map((r) => `${r.pos}.${r.name} ${r.played} ${r.won}-${r.drawn}-${r.lost} ${r.goalsFor}:${r.goalsAgainst} ${r.points} ${r.tail}`).join("\n"), "\n--");
    if (what === "matches") for (const m of s.matches) console.log(`${m.date} | ${m.round ?? ""} | ${m.home} | ${m.score} | ${m.away} | ${m.note}`);
    if (what === "text") console.log(s.text.join("\n"));
  }
})();
