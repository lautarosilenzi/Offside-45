// npx tsx scripts/ballon/extra.ts → scripts/ballon/extra.json (candidatos que después elige apply.ts).
// Búsqueda extra para los ganadores sin candidatos: nombres en inglés y categorías de Commons.
import { writeFileSync, readFileSync } from "fs";
const UA = { "User-Agent": "126Goals-photos/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function c(p: Record<string, string>): Promise<any> {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ format: "json", formatversion: "2", ...p });
  for (let i = 0; i < 6; i++) { await sleep(300); const r = await fetch(url, { headers: UA }); const t = await r.text(); if (t.startsWith("{")) return JSON.parse(t); await sleep(4000 * (i + 1)); }
}
const JOBS: [number, string, string[]][] = [
  [1964, "Denis Law", ["Category:Denis Law", "Denis Law 1960s", "Denis Law Manchester United"]],
  [1968, "George Best", ["Category:George Best", "George Best 1968", "George Best 1970", "George Best Manchester United"]],
  [1975, "Oleg Blokhin", ["Category:Oleh Blokhin", "Oleg Blokhin 1975", "Blokhin Dynamo Kyiv"]],
  [1986, "Igor Belanov", ["Category:Ihor Belanov", "Igor Belanov", "Belanov 1986"]],
  [1990, "Lothar Matthäus", ["Category:Lothar Matthäus", "Lothar Matthäus 1990", "Matthäus Inter"]],
  [1991, "Jean-Pierre Papin", ["Category:Jean-Pierre Papin", "Jean-Pierre Papin 1991", "Papin Marseille"]],
  [1996, "Matthias Sammer", ["Category:Matthias Sammer", "Matthias Sammer 1996", "Sammer Dortmund"]],
  [1997, "Ronaldo", ["Category:Ronaldo (Brazilian footballer)", "Ronaldo Nazário 1997", "Ronaldo Inter 1998", "Ronaldo 1998 World Cup"]],
  [1999, "Rivaldo", ["Category:Rivaldo", "Rivaldo 1999", "Rivaldo Barcelona"]],
  [2000, "Luís Figo", ["Category:Luís Figo", "Luís Figo 2000", "Figo Real Madrid"]],
  [2001, "Michael Owen", ["Category:Michael Owen", "Michael Owen 2001", "Michael Owen Liverpool"]],
  [1994, "Hristo Stoichkov", ["Category:Hristo Stoichkov", "Stoichkov 1994", "Stoichkov Barcelona"]],
  [2003, "Pavel Nedvěd", ["Category:Pavel Nedvěd", "Nedvěd Juventus", "Nedved 2003"]],
  [2025, "Ousmane Dembélé", ["Category:Ousmane Dembélé", "Ousmane Dembélé 2025", "Dembélé PSG 2025"]],
  [2024, "Rodri", ["Category:Rodri (footballer, born 1996)", "Rodri 2024 Spain", "Rodrigo Hernández Cascante 2024"]],
];
(async () => {
  const out: Record<number, any[]> = {};
  for (const [year, name, qs] of JOBS) {
    const files = new Set<string>();
    for (const q of qs) {
      if (q.startsWith("Category:")) {
        const j = await c({ action: "query", list: "categorymembers", cmtitle: q, cmtype: "file", cmlimit: "200" });
        for (const m of j?.query?.categorymembers ?? []) files.add(m.title);
        const sub = await c({ action: "query", list: "categorymembers", cmtitle: q, cmtype: "subcat", cmlimit: "50" });
        for (const s of sub?.query?.categorymembers ?? []) {
          const y = s.title.match(/(19|20)\d\d/);
          if (y && Math.abs(Number(y[0]) - year) <= 3) {
            const k = await c({ action: "query", list: "categorymembers", cmtitle: s.title, cmtype: "file", cmlimit: "100" });
            for (const m of k?.query?.categorymembers ?? []) files.add(m.title);
          }
        }
      } else {
        const j = await c({ action: "query", list: "search", srnamespace: "6", srsearch: q + " filetype:bitmap", srlimit: "30" });
        for (const s of j?.query?.search ?? []) files.add(s.title);
      }
    }
    const list = [...files];
    const cands: any[] = [];
    for (let i = 0; i < list.length; i += 40) {
      const j = await c({ action: "query", titles: list.slice(i, i + 40).join("|"), prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "300", iiextmetadatafilter: "DateTimeOriginal|LicenseShortName|Artist" });
      for (const p of j?.query?.pages ?? []) {
        const ii = p.imageinfo?.[0]; if (!ii) continue;
        const d = String(ii.extmetadata?.DateTimeOriginal?.value ?? "").replace(/<[^>]*>/g, "");
        const file = p.title.replace(/^File:/, "");
        const m = d.match(/(19[4-9]\d|20[0-2]\d)/) ?? file.match(/(19[4-9]\d|20[0-2]\d)/);
        const y = m ? Number(m[1]) : undefined;
        if (y && Math.abs(y - year) <= 4) cands.push({ file, year: y, thumb: ii.thumburl, width: ii.width, height: ii.height, author: String(ii.extmetadata?.Artist?.value ?? "").replace(/<[^>]*>/g, "").trim() || "Autor desconocido", license: String(ii.extmetadata?.LicenseShortName?.value ?? "") });
      }
    }
    cands.sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year));
    out[year] = cands.slice(0, 14);
    console.log(year, name, cands.length, cands.slice(0, 14).map((x) => x.year).join(","));
  }
  writeFileSync(require("path").join(__dirname, "extra.json"), JSON.stringify(out, null, 1));
})();
