import { fetchWiki } from "./scripts/import/wiki";
(async () => {
  const want = /Huracán|Independiente|San Martín|Alianza|Pringles|Roldán|Gimnasia y Tiro|Argentino|Círculo|Cipolletti|Regina|Santa Rosa|Andino|Loma Negra|Mandiyú|Newbery|Moreno|Cesarini|San Vicente|Pinedo|Ferro|Alvarado|Aldosivi|Estudiantes|Juventud|Concepción/;
  for (let y = 1971; y <= 1985; y++) {
    const x = await fetchWiki(`Campeonato Nacional ${y} (Argentina)`);
    if (!x) { console.log("=====", y, "sin página"); continue; }
    const links = [...new Set([...x.matchAll(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g)].filter((m) => want.test(m[1]) && /Club|Asociación|Atlético|Sportivo|Deportivo|Centro/.test(m[1])).map((m) => m[1]))];
    console.log("=====", y, links.join(" ; "));
    await new Promise((r) => setTimeout(r, 1200));
  }
})();
