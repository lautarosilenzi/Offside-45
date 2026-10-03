// Busca el escudo de cada club: el artículo en la Wikipedia en español (búsqueda o TITLES) y su imagen principal
// (la del recuadro, que es el escudo); si no tiene, la del artículo en inglés (ahí los escudos suelen ser logos no
// libres). Guarda lo encontrado en scripts/crests/found.json para revisarlo a mano: npx tsx scripts/crests/find.ts [id…]
// Después download.ts baja las imágenes.
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { FOREIGN_TEAMS, HISTORIC_TEAMS, TEAMS } from "../../lib/teams";
import { CRESTS } from "../../lib/crests";
import { TITLES } from "./titles";

const UA = { "User-Agent": "Offside45-crests/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const OUT = join(__dirname, "found.json");
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type Found = {
  id: string;
  name: string;
  query: string;
  wiki?: string; // "es:Título" o "en:Título"
  file?: string; // nombre del archivo
  host?: "commons" | "en"; // commons = libre; en = logo no libre de la Wikipedia en inglés
  thumb?: string;
};

// Todas las consultas pasan por acá: de a una y reintentando cuando Wikimedia pide bajar el ritmo.
async function api(lang: string, params: Record<string, string>): Promise<any> {
  const url = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let i = 0; i < 8; i++) {
    await sleep(250);
    const r = await fetch(url, { headers: UA });
    const text = await r.text();
    if (r.ok && text.startsWith("{")) return JSON.parse(text);
    await sleep(5000 * (i + 1));
  }
  throw new Error("fetch " + url);
}

type PageInfo = { title: string; image?: string; free: boolean; thumb?: string; disambig: boolean; en?: string };

// Datos de hasta 40 artículos por consulta: imagen principal (cualquier licencia) y el artículo en inglés.
async function pages(lang: string, titles: string[]): Promise<Map<string, PageInfo>> {
  const out = new Map<string, PageInfo>();
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const j = await api(lang, {
      action: "query",
      titles: chunk.join("|"),
      redirects: "1",
      prop: "pageimages|pageprops|langlinks",
      piprop: "name|thumbnail",
      pithumbsize: "160",
      pilicense: "any",
      pilimit: "50",
      lllang: "en",
      lllimit: "500",
      ppprop: "disambiguation|page_image_free",
    });
    // Los títulos pedidos pasan por normalización y redirecciones hasta el artículo final.
    const alias = new Map<string, string>();
    for (const n of [...(j.query.normalized ?? []), ...(j.query.redirects ?? [])]) alias.set(n.from, n.to);
    const resolve = (t: string) => {
      for (let k = 0; k < 5 && alias.has(t); k++) t = alias.get(t)!;
      return t;
    };
    const byTitle = new Map<string, any>(j.query.pages.map((p: any) => [p.title, p]));
    for (const t of chunk) {
      const p = byTitle.get(resolve(t));
      if (!p || p.missing) continue;
      out.set(t, {
        title: p.title,
        image: p.pageimage,
        free: p.pageprops?.page_image_free !== undefined,
        thumb: p.thumbnail?.source,
        disambig: p.pageprops?.disambiguation !== undefined,
        en: p.langlinks?.[0]?.title,
      });
    }
  }
  return out;
}

async function search(q: string): Promise<string | undefined> {
  const j = await api("es", { action: "query", list: "search", srsearch: q, srlimit: "1" });
  return j.query.search[0]?.title;
}

const clean = (s: string) => s.replace(/\((antes|hoy|segundo|sin relación|desaparecido)[^)]*\)/gi, "").replace(/[()]/g, " ").replace(/\s+/g, " ").trim();

async function main() {
  const only = process.argv.slice(2);
  const found: Record<string, Found> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const all = [...TEAMS, ...HISTORIC_TEAMS, ...FOREIGN_TEAMS].filter((t) => !CRESTS[t.id]);
  const todo = only.length ? all.filter((t) => only.includes(t.id)) : all.filter((t) => !found[t.id]);

  // 1. El artículo de cada club en español (o en inglés, si TITLES lo dice).
  const target = new Map<string, { lang: "es" | "en"; title: string }>();
  let n = 0;
  for (const t of todo) {
    const query = t.country ? `${t.name.replace(/\s*\([^)]*\)$/, "")} club de fútbol ${t.country}` : clean(t.fullName ?? t.name);
    found[t.id] = { id: t.id, name: t.fullName ?? t.name, query };
    const manual = TITLES[t.id];
    if (manual === null) continue;
    if (manual) target.set(t.id, manual.startsWith("en:") ? { lang: "en", title: manual.slice(3) } : { lang: "es", title: manual.replace(/^es:/, "") });
    else {
      const title = await search(query);
      if (title) target.set(t.id, { lang: "es", title });
    }
    if (++n % 50 === 0) console.log("búsqueda", n, "/", todo.length);
  }

  // 2. La imagen principal de cada artículo.
  const ids = [...target.keys()];
  const es = await pages("es", [...new Set(ids.filter((id) => target.get(id)!.lang === "es").map((id) => target.get(id)!.title))]);
  const needEn = new Map<string, string>();
  for (const id of ids) {
    const { lang, title } = target.get(id)!;
    if (lang === "en") {
      needEn.set(id, title);
      continue;
    }
    const p = es.get(title);
    if (!p || p.disambig) continue;
    found[id].wiki = `es:${p.title}`;
    if (p.image) Object.assign(found[id], { file: p.image, host: p.free ? "commons" : "en", thumb: p.thumb });
    else if (p.en) needEn.set(id, p.en);
  }
  // 3. Sin imagen en español: la del artículo en inglés.
  const en = await pages("en", [...new Set(needEn.values())]);
  for (const [id, title] of needEn) {
    const p = en.get(title);
    if (!p || p.disambig) continue;
    found[id].wiki ??= `en:${p.title}`;
    if (p.image) Object.assign(found[id], { file: p.image, host: p.free ? "commons" : "en", thumb: p.thumb });
  }
  writeFileSync(OUT, JSON.stringify(found, null, 1));
  console.log("listo", Object.keys(found).length, "con escudo", Object.values(found).filter((f) => f.file).length);
}

main();
