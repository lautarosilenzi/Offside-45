// Muestra las líneas tal como las ve el parser (para depurar formatos raros).
import { fetchPage } from "./rsssf-parse";
(async () => {
  const [file, from, to] = process.argv.slice(2);
  const html = await fetchPage(file);
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(h[1-6]|p|table|tr|div)[^>]*>/gi, "\n")
    .replace(/<\/?pre[^>]*>/gi, "")
    .replace(/<\/?[a-zA-Z!][^>]*>/g, "");
  text.split(/\r?\n/).slice(+from, +to).forEach((l, i) => console.log(+from + i, JSON.stringify(l)));
})();
