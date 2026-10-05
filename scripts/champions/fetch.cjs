// Descarga de Wikipedia en inglés los artículos de list.txt (id|título) a .cache/champions/<id>.wiki.
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../../.cache/champions");
fs.mkdirSync(dir, { recursive: true });
// Con ids como argumento, baja solo esos (node scripts/champions/fetch.cjs nations-league eredivisie).
const only = process.argv.slice(2);
const list = fs
  .readFileSync(path.join(__dirname, "list.txt"), "utf8")
  .trim()
  .split(/\r?\n/)
  .map((l) => l.split("|"))
  .filter(([id]) => !only.length || only.includes(id));

(async () => {
  for (let i = 0; i < list.length; i += 20) {
    const chunk = list.slice(i, i + 20);
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=" +
      encodeURIComponent(chunk.map((c) => c[1]).join("|"));
    const j = await (await fetch(url, { headers: { "User-Agent": "Offside45-data-script/1.0" } })).json();
    const map = {};
    for (const n of [...(j.query.normalized ?? []), ...(j.query.redirects ?? [])]) map[n.from] = n.to;
    for (const [id, title] of chunk) {
      let t = title;
      while (map[t]) t = map[t];
      const content = j.query.pages.find((p) => p.title === t)?.revisions?.[0]?.slots?.main?.content;
      if (!content) {
        console.log(id, "NO ENCONTRADO", title);
        continue;
      }
      fs.writeFileSync(path.join(dir, `${id}.wiki`), content);
      console.log(id, t);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
})();
