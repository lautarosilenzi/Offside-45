// Baja las banderas de las selecciones (lib/data/nations.ts) y del menú a public/flags: las actuales de flagcdn.com
// y las históricas de Wikimedia Commons (dominio público). npx tsx scripts/flags.ts
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { GROUPS } from "../lib/competitions";
import { HISTORIC_FLAGS, NATIONS } from "../lib/data/nations";

const UA = { "User-Agent": "Offside45-flags/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const DIR = join(__dirname, "..", "public", "flags");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const codes = new Set([...Object.values(NATIONS).map((n) => n.flag), ...GROUPS.map((g) => g.flag), "es", "cz"]);
  for (const code of codes) {
    const out = join(DIR, `${code}.svg`);
    if (existsSync(out)) continue;
    const url = HISTORIC_FLAGS[code]
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(HISTORIC_FLAGS[code])}`
      : `https://flagcdn.com/${code}.svg`;
    const r = await fetch(url, { headers: UA, redirect: "follow" });
    if (!r.ok) {
      console.log("falta", code, r.status);
      continue;
    }
    writeFileSync(out, Buffer.from(await r.arrayBuffer()));
    await sleep(200);
  }
  console.log("listo", codes.size);
}

main();
