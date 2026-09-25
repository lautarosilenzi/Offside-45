// Muestra una sección de una página de Wikipedia (texto plano, sin referencias).
//   npx tsx scripts/import/wikisection.ts "Título" "== Sección =="
import { fetchWiki } from "./wiki";

(async () => {
  const [title, heading] = process.argv.slice(2);
  const t = (await fetchWiki(title)) ?? "";
  const i = heading ? t.indexOf(heading) : 0;
  const j = heading ? t.indexOf("\n== ", i + heading.length) : t.length;
  console.log(
    t
      .slice(Math.max(i, 0), j > 0 ? j : undefined)
      .replace(/<ref[\s\S]*?<\/ref>|<ref[^>]*\/>/g, "")
      .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
      .replace(/\{\{[^{}]*\}\}/g, ""),
  );
})();
