import { fetchPage, parseSeason } from "./scripts/import/rsssf-parse";
(async () => {
  const secs = parseSeason(await fetchPage("arg88.html"), { headings: [/^Liguilla/i] });
  for (const s of secs) console.log(JSON.stringify(s.heading), s.matches.length, s.tables.length);
})();
