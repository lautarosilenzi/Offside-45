// Baja el logo de cada competencia del menú (la imagen principal de su artículo de Wikipedia) a public/comps y escribe
// lib/data/comps.generated.json con archivo, licencia y página. npx tsx scripts/comps/logos.ts [id…] — revisar a mano.
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { FEATURED, GROUPS } from "../../lib/competitions";

const UA = { "User-Agent": "Offside45-logos/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, "lib", "data", "comps.generated.json");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string) {
  for (let i = 0; i < 8; i++) {
    await sleep(400);
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r;
    await sleep(5000 * (i + 1));
  }
  throw new Error("fetch " + url);
}

async function pageImage(lang: string, title: string): Promise<{ file: string; thumb: string; free: boolean; en?: string } | undefined> {
  const params = new URLSearchParams({ action: "query", format: "json", formatversion: "2", titles: title, redirects: "1", prop: "pageimages|pageprops|langlinks", piprop: "name|thumbnail", pithumbsize: "250", pilicense: "any", lllang: "en", ppprop: "page_image_free" });
  const j: any = await (await get(`https://${lang}.wikipedia.org/w/api.php?` + params)).json();
  const p = j.query.pages[0];
  if (p.missing) return undefined;
  return { file: p.pageimage, thumb: p.thumbnail?.source, free: p.pageprops?.page_image_free !== undefined, en: p.langlinks?.[0]?.title };
}

async function main() {
  const only = process.argv.slice(2);
  const out: Record<string, { file: string; license: string; page: string }> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const comps = new Map([...FEATURED, ...GROUPS.flatMap((g) => g.competitions)].filter((c) => c.wiki).map((c) => [c.id, c]));
  for (const comp of comps.values()) {
    if (only.length ? !only.includes(comp.id) : out[comp.id]) continue;
    const [lang, title] = comp.wiki.startsWith("en:") ? ["en", comp.wiki.slice(3)] : ["es", comp.wiki.replace(/^es:/, "")];
    let img = await pageImage(lang, title);
    let host = "commons";
    // La Wikipedia en español no tiene logos no libres: si no hay imagen, la del artículo en inglés.
    if ((!img?.thumb || !img.free) && img?.en) {
      const en = await pageImage("en", img.en);
      if (en?.thumb) {
        img = en;
        host = en.free ? "commons" : "en";
      }
    }
    if (!img?.thumb) {
      console.log("sin logo:", comp.id);
      continue;
    }
    const url = img.thumb.replace(/\?.*$/, "");
    const ext = (url.match(/\.(png|jpe?g|gif|webp)$/i)?.[1] ?? "png").toLowerCase().replace("jpeg", "jpg");
    writeFileSync(join(ROOT, "public", "comps", `${comp.id}.${ext}`), Buffer.from(await (await get(url)).arrayBuffer()));
    out[comp.id] = {
      file: `/comps/${comp.id}.${ext}`,
      license: host === "commons" ? "Wikimedia Commons" : "Logo no libre (Wikipedia en inglés, uso identificativo)",
      page: `https://${host === "commons" ? "commons.wikimedia.org" : "en.wikipedia.org"}/wiki/File:${encodeURIComponent(img.file.replace(/ /g, "_"))}`,
    };
    console.log(comp.id, img.file);
    writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}

main();
