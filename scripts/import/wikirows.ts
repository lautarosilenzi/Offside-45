import { fetchWiki, wikiRows } from "./wiki";
(async () => {
  const [title, filter] = process.argv.slice(2);
  for (const r of wikiRows((await fetchWiki(title))!)) if (!filter || new RegExp(filter, "i").test(r.raw)) console.log(`${r.home} | ${r.hg}-${r.ag} | ${r.away}    <= ${r.raw}`);
})();
