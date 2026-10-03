// Aplica las fotos elegidas a mano (de candidates.json y extra.json) a lib/data/ballon-dor.ts y completa el año de las
// fotos que quedan como estaban. npx tsx scripts/ballon/apply.ts
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const UA = { "User-Agent": "Offside45-photos/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const DATA = join(__dirname, "..", "..", "lib", "data", "ballon-dor.ts");
const cand = JSON.parse(readFileSync(join(__dirname, "candidates.json"), "utf8"));
const extra = JSON.parse(readFileSync(join(__dirname, "extra.json"), "utf8"));

// Año del premio → [lista, año de la lista, índice, encuadre]. Elegidas mirando cada foto.
const CHOICE: Record<number, [any, number, number, string?]> = {
  1956: [cand, 1956, 1], 1957: [cand, 1957, 0], 1958: [cand, 1958, 0], 1959: [cand, 1959, 4], 1960: [cand, 1960, 0],
  1962: [cand, 1962, 0], 1963: [cand, 1963, 3], 1965: [cand, 1965, 7], 1966: [cand, 1966, 3], 1967: [cand, 1967, 3],
  1969: [cand, 1969, 6], 1970: [cand, 1970, 0], 1971: [cand, 1971, 3], 1972: [cand, 1972, 0], 1973: [cand, 1973, 0],
  1974: [cand, 1974, 0], 1975: [extra, 1975, 1], 1976: [cand, 1976, 2], 1977: [cand, 1977, 0], 1978: [cand, 1978, 1],
  1979: [cand, 1979, 2], 1980: [cand, 1980, 1], 1981: [cand, 1981, 1], 1982: [cand, 1982, 3], 1983: [cand, 1985, 6],
  1984: [cand, 1985, 2], 1985: [cand, 1985, 0], 1987: [cand, 1987, 7, "left top"], 1988: [cand, 1988, 2],
  1989: [cand, 1989, 0], 1992: [cand, 1992, 0], 1993: [cand, 1993, 0], 1995: [cand, 1995, 0], 1998: [cand, 1998, 0],
  2002: [cand, 2002, 1], 2004: [cand, 2004, 2], 2005: [cand, 2005, 0], 2006: [cand, 2006, 1, "right top"],
  2007: [cand, 2007, 4], 2008: [cand, 2008, 3], 2009: [cand, 2009, 1], 2010: [cand, 2010, 3], 2011: [cand, 2011, 7],
  2012: [cand, 2012, 0], 2013: [cand, 2013, 4], 2014: [cand, 2014, 5], 2015: [cand, 2015, 4], 2016: [cand, 2016, 2],
  2017: [cand, 2017, 2], 2018: [cand, 2018, 1], 2019: [cand, 2019, 4], 2021: [cand, 2021, 6], 2022: [cand, 2022, 0],
  2023: [cand, 2023, 2], 2024: [extra, 2024, 11],
};

const strip = (s: string) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function yearOf(file: string): Promise<number | undefined> {
  const params = new URLSearchParams({ action: "query", format: "json", formatversion: "2", titles: "File:" + file, prop: "imageinfo", iiprop: "extmetadata", iiextmetadatafilter: "DateTimeOriginal" });
  const j: any = await (await fetch("https://commons.wikimedia.org/w/api.php?" + params, { headers: UA })).json();
  const d = strip(j.query.pages[0].imageinfo?.[0]?.extmetadata?.DateTimeOriginal?.value ?? "");
  const m = d.match(/(19[3-9]\d|20[0-2]\d)/) ?? file.match(/(19[3-9]\d|20[0-2]\d)/);
  return m ? Number(m[1]) : undefined;
}

async function main() {
  let src = readFileSync(DATA, "utf8");
  const start = src.indexOf("export const BALLON_DOR");
  const head = src.slice(0, start);
  const json = src.slice(src.indexOf("= [", start) + 2, src.lastIndexOf("]") + 1);
  const list = JSON.parse(json);
  for (const b of list) {
    const choice = CHOICE[b.year];
    if (choice) {
      const [from, y, i, position] = choice;
      const c = from[y][i];
      b.photo = { src: c.thumb, file: c.file, author: strip(c.author) || "Autor desconocido", license: strip(c.license) || "Ver página del archivo", year: c.year, ...(position ? { position } : {}) };
    } else {
      b.photo.year ??= await yearOf(b.photo.file);
    }
  }
  const dup = list.map((b: any) => b.photo.file).filter((f: string, i: number, a: string[]) => a.indexOf(f) !== i);
  console.log("fotos repetidas:", dup.join(", ") || "ninguna");
  writeFileSync(DATA, head + "export const BALLON_DOR: BallonDor[] = " + JSON.stringify(list, null, 2) + ";\n");
  for (const b of list) console.log(b.year, b.name, "→ foto de", b.photo.year ?? "?");
}

main();
