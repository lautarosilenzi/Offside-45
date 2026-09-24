// Lista los clubes enlazados en las páginas de temporada de Wikipedia: "Nombre mostrado → Artículo".
// Sirve para confirmar a qué club corresponde cada nombre de época.
import { fetchWiki } from "./wiki";

(async () => {
  for (const y of process.argv.slice(2)) {
    const t = (await fetchWiki(/^\d+$/.test(y) ? `Campeonato de Primera División ${y} (Argentina)` : y)) ?? "";
    const links = new Map<string, string>();
    for (const m of t.matchAll(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g)) {
      const article = m[1].trim();
      if (!/club|athletic|atl[ée]tico|sociedad|asociaci|sportivo|juniors|plate|estudiant|gimnasia|racing|independiente|quilmes|porteño|alumni|san |hurac|tigre|platense|ferro|banfield|lan[uú]s|atlanta|kimberley|comercio|hispano|floresta|reformer|nacional|chacarita|v[ée]lez|almagro|columbian/i.test(article)) continue;
      if (/Categor|Campeonato|Copa |Asociación del Fútbol|Primera División|Liga|Federación|Anexo|Segunda/i.test(article)) continue;
      links.set(`${m[2] ?? article}`.trim(), article);
    }
    console.log(`## ${y}: ` + [...links].map(([d, a]) => (d === a ? a : `${d} → ${a}`)).join(" | "));
  }
})();
