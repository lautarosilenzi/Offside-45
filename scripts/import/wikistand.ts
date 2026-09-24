import { fetchWiki, wikiStandings } from "./wiki";
(async () => {
  const t = (await fetchWiki(process.argv[2]))!;
  const tables = t.split(/\n\{\|/).slice(1);
  console.log("tablas:", tables.length);
  for (const tb of tables.slice(0, 3)) console.log("HDR:", JSON.stringify(tb.split(/\n\|-[^\n]*/)[0].slice(0, 300)));
  console.log(JSON.stringify(wikiStandings(t)).slice(0, 800));
})();
