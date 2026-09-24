// Muestra el texto de las páginas de temporada de Wikipedia (sin tablas) para redactar las notas.
//   npx tsx scripts/import/wikisummary.ts 1903 1904 ...
import { fetchWiki } from "./wiki";

(async () => {
  for (const y of process.argv.slice(2)) {
    const t = (await fetchWiki(/^\d+$/.test(y) ? `Campeonato de Primera División ${y} (Argentina)` : y)) ?? "";
    const prose = t
      .split("\n")
      .filter((l) => !/^[|!{}<*]|^\s*$|^\[\[Categor|^ \|/.test(l))
      .join("\n")
      .replace(/<ref[\s\S]*?<\/ref>|<ref[^>]*\/>/g, "")
      .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
      .replace(/'''/g, "");
    console.log(`######## ${y}\n${prose.slice(0, 1800)}\n`);
  }
})();
