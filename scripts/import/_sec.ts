import { fetchPage, parseSeason } from "./rsssf-parse";
import { ASCENSO_TOURNAMENTS } from "./config-ascenso";
(async () => {
  const cfg = ASCENSO_TOURNAMENTS.find((t) => t.slug === process.argv[2])!;
  const page = await fetchPage(cfg.file);
  for (const s of parseSeason(cfg.preprocess ? cfg.preprocess(page) : page, { headings: cfg.headings })) console.log(JSON.stringify(s.heading).slice(0, 80), s.matches.length, s.tables.length);
})();
