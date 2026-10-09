// Vuelve a bajar los logos de public/comps en alta calidad (500 px) desde el mismo archivo de Wikimedia que figura en
// lib/data/comps.generated.json. Con REPLACE se cambia el archivo de algunas competencias.
// node scripts/comps/hires.cjs [id…]
const { readFileSync, writeFileSync, unlinkSync, existsSync } = require("fs");
const { join } = require("path");

const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, "lib", "data", "comps.generated.json");
const UA = { "User-Agent": "126Goals-logos/1.0 (https://126goals.vercel.app)" };
const WIDTH = 500;

// Imágenes elegidas a mano (octubre de 2026): trofeos con fondo transparente en lugar de fotos o logos pobres.
const REPLACE = {
  "copa-america": "Copa tr icon.png",
  "trofeo-campeones": "Troféu do Trofeo de Campeones da Argentina.png",
  finalissima: "Finalissima.png",
  "balon-de-oro": "Ballon d Or logo.png",
  "champions-femenina": "UEFA Women's Champions League logo.svg",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  for (let i = 0; i < 6; i++) {
    await sleep(300);
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r;
    await sleep(4000 * (i + 1));
  }
  throw new Error("fetch " + url);
}

async function info(host, file) {
  const api = host === "en" ? "https://en.wikipedia.org/w/api.php" : "https://commons.wikimedia.org/w/api.php";
  const p = new URLSearchParams({ action: "query", format: "json", formatversion: "2", titles: `File:${file}`, prop: "imageinfo", iiprop: "url|size", iiurlwidth: String(WIDTH) });
  const j = await (await get(`${api}?${p}`)).json();
  const ii = j.query.pages[0]?.imageinfo?.[0];
  if (!ii) return undefined;
  // Si el original es más chico que 500 px, la miniatura es el original.
  return ii.width <= WIDTH && !/\.svg$/i.test(file) ? ii.url : ii.thumburl;
}

async function main() {
  const only = process.argv.slice(2);
  const data = JSON.parse(readFileSync(OUT, "utf8"));
  for (const [id, entry] of Object.entries(data)) {
    if (only.length && !only.includes(id)) continue;
    const replaced = REPLACE[id];
    const host = !replaced && entry.page.includes("en.wikipedia.org") ? "en" : "commons";
    const file = replaced ?? decodeURIComponent(entry.page.split("File:")[1]).replace(/_/g, " ");
    const url = (await info(host, file).catch(() => undefined)) ?? (await info(host === "en" ? "commons" : "en", file).catch(() => undefined));
    if (!url) {
      console.log("sin imagen:", id, file);
      continue;
    }
    const clean = url.replace(/\?.*$/, "");
    const ext = (clean.match(/\.(png|jpe?g|gif|webp)$/i)?.[1] ?? "png").toLowerCase().replace("jpeg", "jpg");
    const target = `/comps/${id}.${ext}`;
    writeFileSync(join(ROOT, "public", target), Buffer.from(await (await get(clean)).arrayBuffer()));
    if (target !== entry.file && existsSync(join(ROOT, "public", entry.file))) unlinkSync(join(ROOT, "public", entry.file));
    data[id] = replaced
      ? { file: target, license: "Wikimedia Commons", page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}` }
      : { ...entry, file: target };
    console.log(id, file);
    writeFileSync(OUT, JSON.stringify(data, null, 1));
  }
}

main();
