// Busca en Wikimedia Commons, para cada Balón de Oro, una foto del ganador sacada el año en que lo ganó (o el más
// cercano). Deja los candidatos en scripts/ballon/candidates.json para elegir a mano: npx tsx scripts/ballon/photos.ts [año…]
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { BALLON_DOR } from "../../lib/data/ballon-dor";

const UA = { "User-Agent": "126Goals-photos/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const OUT = join(__dirname, "candidates.json");
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function commons(params: Record<string, string>): Promise<any> {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let i = 0; i < 8; i++) {
    await sleep(300);
    const r = await fetch(url, { headers: UA });
    const text = await r.text();
    if (r.ok && text.startsWith("{")) return JSON.parse(text);
    await sleep(5000 * (i + 1));
  }
  throw new Error("fetch " + url);
}

export type Candidate = { file: string; year?: number; width: number; height: number; thumb: string; author: string; license: string };

const strip = (html = "") => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
// Año de la foto: el de la fecha de toma; si no hay, el que figure en el nombre del archivo.
function photoYear(date: string, file: string): number | undefined {
  const m = strip(date).match(/\b(19[3-9]\d|20[0-2]\d)\b/) ?? file.match(/\b(19[3-9]\d|20[0-2]\d)\b/);
  return m ? Number(m[1]) : undefined;
}

async function candidates(name: string, year: number): Promise<Candidate[]> {
  const files = new Set<string>();
  for (const q of [`${name} ${year}`, `${name} ${year - 1}`, `${name} ${year + 1}`, name]) {
    const j = await commons({ action: "query", list: "search", srnamespace: "6", srsearch: `${q} filetype:bitmap`, srlimit: "25" });
    for (const s of j.query.search) files.add(s.title);
  }
  const out: Candidate[] = [];
  const list = [...files];
  for (let i = 0; i < list.length; i += 40) {
    const j = await commons({
      action: "query",
      titles: list.slice(i, i + 40).join("|"),
      prop: "imageinfo",
      iiprop: "url|size|extmetadata",
      iiurlwidth: "300",
      iiextmetadatafilter: "DateTimeOriginal|LicenseShortName|Artist",
    });
    for (const p of j.query.pages) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const file = p.title.replace(/^File:/, "");
      const meta = ii.extmetadata ?? {};
      out.push({
        file,
        year: photoYear(meta.DateTimeOriginal?.value ?? "", file),
        width: ii.width,
        height: ii.height,
        thumb: ii.thumburl,
        author: strip(meta.Artist?.value) || "Autor desconocido",
        license: strip(meta.LicenseShortName?.value),
      });
    }
  }
  // Primero las del año exacto, después las más cercanas; las que tienen el apellido en el nombre del archivo, antes.
  const surname = name.split(" ").pop()!.normalize("NFD").replace(/[^A-Za-z]/g, "").toLowerCase();
  const has = (c: Candidate) => c.file.normalize("NFD").replace(/[^A-Za-z]/g, "").toLowerCase().includes(surname);
  return out
    .filter((c) => c.year !== undefined && Math.abs(c.year - year) <= 3 && has(c))
    .sort((a, b) => Math.abs(a.year! - year) - Math.abs(b.year! - year))
    .slice(0, 8);
}

async function main() {
  const only = process.argv.slice(2).map(Number);
  const found: Record<string, Candidate[]> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  for (const b of BALLON_DOR) {
    if (only.length ? !only.includes(b.year) : found[b.year]) continue;
    found[b.year] = await candidates(b.name, b.year);
    console.log(b.year, b.name, found[b.year].length, found[b.year].map((c) => c.year).join(","));
    writeFileSync(OUT, JSON.stringify(found, null, 1));
  }
}

main();
