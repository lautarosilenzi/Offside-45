// Baja los escudos aprobados en found.json (ver find.ts) a public/crests y escribe lib/data/crests.generated.json con el
// archivo, la licencia y la página de cada uno. npx tsx scripts/crests/download.ts [id…]
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Found } from "./find";

const UA = { "User-Agent": "126Goals-crests/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, "lib", "data", "crests.generated.json");
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Entry = { file: string; license: string; page: string };

async function get(url: string): Promise<Response> {
  for (let i = 0; i < 8; i++) {
    await sleep(300);
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r;
    await sleep(5000 * (i + 1));
  }
  throw new Error("fetch " + url);
}

// Licencia de los archivos de Commons, de a 40 por consulta.
async function licenses(files: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  for (let i = 0; i < files.length; i += 40) {
    const chunk = files.slice(i, i + 40);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      titles: chunk.map((f) => "File:" + f).join("|"),
      prop: "imageinfo",
      iiprop: "extmetadata",
      iiextmetadatafilter: "LicenseShortName",
    });
    const j: any = await (await get("https://commons.wikimedia.org/w/api.php?" + params)).json();
    const alias = new Map<string, string>((j.query.normalized ?? []).map((n: any) => [n.to, n.from]));
    for (const p of j.query.pages) {
      const name = (alias.get(p.title) ?? p.title).replace(/^File:/, "");
      out.set(name, p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value ?? "Ver página del archivo");
    }
  }
  return out;
}

async function main() {
  const only = process.argv.slice(2);
  const found: Record<string, Found> = JSON.parse(readFileSync(join(__dirname, "found.json"), "utf8"));
  const result: Record<string, Entry> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const todo = Object.values(found).filter((f) => f.file && f.thumb && (only.length ? only.includes(f.id) : true));
  // Los que ya no tienen escudo aprobado salen de la lista.
  for (const id of Object.keys(result)) if (!found[id]?.file) delete result[id];

  const lic = await licenses(todo.filter((f) => f.host === "commons").map((f) => f.file!.replace(/_/g, " ")));
  let n = 0;
  for (const f of todo) {
    // Tamaño estándar de Wikimedia (250 px): los tamaños a medida tienen un límite de pedidos muy bajo.
    const thumb = f.thumb!.replace(/\?.*$/, "");
    const ext = (thumb.match(/\.(png|jpe?g|gif|webp)$/i)?.[1] ?? "png").toLowerCase().replace("jpeg", "jpg");
    const r = await get(thumb);
    writeFileSync(join(ROOT, "public", "crests", `${f.id}.${ext}`), Buffer.from(await r.arrayBuffer()));
    const commons = f.host === "commons";
    result[f.id] = {
      file: `/crests/${f.id}.${ext}`,
      license: commons ? (lic.get(f.file!.replace(/_/g, " ")) ?? "Ver página del archivo") : "Logo no libre (Wikipedia en inglés, uso identificativo)",
      page: `https://${commons ? "commons.wikimedia.org" : "en.wikipedia.org"}/wiki/File:${encodeURIComponent(f.file!.replace(/ /g, "_"))}`,
    };
    if (++n % 50 === 0) {
      console.log(n, "/", todo.length);
      writeFileSync(OUT, JSON.stringify(result, null, 1));
    }
  }
  writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(result).sort()), null, 1));
  console.log("listo", Object.keys(result).length);
}

main();
