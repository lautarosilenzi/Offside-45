// Baja el logo de cada competencia del menú (la imagen principal de su artículo de Wikipedia) a public/comps y escribe
// lib/data/comps.generated.json con archivo, licencia y página. npx tsx scripts/comps/logos.ts [id…] — revisar a mano.
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { FEATURED, GROUPS } from "../../lib/competitions";

const UA = { "User-Agent": "126Goals-logos/1.0 (https://github.com/lautarosilenzi/Offside-45)" };
const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, "lib", "data", "comps.generated.json");
// Artículo de donde sale el logo cuando el de la competencia en el menú no tiene uno (o tiene un mapa, una foto…). Las
// eliminatorias y los amistosos llevan el logo del organizador.
const LOGO_PAGE: Record<string, string> = {
  eliminatorias: "en:CONMEBOL",
  "eliminatorias-uefa": "en:UEFA",
  amistosos: "en:FIFA",
  "trofeo-campeones": "es:Trofeo de Campeones de la Liga Profesional de Fútbol",
  "supercopa-argentina": "en:Supercopa Argentina",
  "supercopa-internacional": "es:Supercopa Internacional (Argentina)",
  "primera-b-metro": "en:Primera B Metropolitana",
  "primera-c": "en:Primera C",
  "promocional-amateur": "es:Torneo Promocional Amateur",
  "liga-femenina": "es:Campeonato de Fútbol Femenino de Argentina",
  "mundial-sub20": "en:FIFA U-20 World Cup",
  "copa-africana": "en:Africa Cup of Nations",
  "copa-intercontinental": "en:FIFA Intercontinental Cup",
  "leagues-cup": "en:Leagues Cup",
  "copa-chile": "en:Copa Chile",
  "liga-1-peru": "en:Liga 1 (Peru)",
  "primera-bolivia": "en:Bolivian Primera División",
  "supercopa-italia": "en:Supercoppa Italiana",
  "pro-league-belgica": "en:Belgian Pro League",
  "mundial-femenino": "en:FIFA Women's World Cup",
};
// Archivo exacto (Wikipedia en inglés), cuando el artículo no marca una imagen principal. Las categorías del ascenso
// argentino y el fútbol femenino no tienen logo propio: llevan el de la AFA, que las organiza.
const LOGO_FILE: Record<string, string> = {
  // Logo oficial de la Liga Profesional de Fútbol (el de Commons es solo el nombre en letras).
  "liga-profesional": "Liga Profesional de Fútbol (Argentina) logo.svg",
  "leagues-cup": "Leagues_Cup_logo_white-on-black.svg",
  "pro-league-belgica": "Belgian_Pro_League_logo_(2020,_horizontal).svg",
  "mundial-femenino": "FIFA_Women's_World_Cup_wordmark.svg",
  "copa-chile": "Copa_Chile.png",
  "mundial-sub20": "Fifa_worldcup_u20_trophy.png",
  "primera-b-metro": "Asociación_del_Fútbol_Argentino_(crest).svg",
  "primera-c": "Asociación_del_Fútbol_Argentino_(crest).svg",
  "promocional-amateur": "Asociación_del_Fútbol_Argentino_(crest).svg",
  "liga-femenina": "Asociación_del_Fútbol_Argentino_(crest).svg",
  "supercopa-internacional": "Asociación_del_Fútbol_Argentino_(crest).svg",
};

async function fileImage(file: string): Promise<{ file: string; thumb: string; free: boolean; en?: string } | undefined> {
  const params = new URLSearchParams({ action: "query", format: "json", formatversion: "2", titles: `File:${file}`, prop: "imageinfo", iiprop: "url", iiurlwidth: "250" });
  const j: any = await (await get(`https://en.wikipedia.org/w/api.php?` + params)).json();
  const p = j.query.pages[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) return undefined;
  // Los archivos subidos a la Wikipedia en inglés (no a Commons) son logos no libres.
  return { file: p.title.replace(/^File:/, ""), thumb: ii.thumburl ?? ii.url, free: p.imagerepository === "shared" };
}

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
  const comps = new Map(
    [...FEATURED, ...GROUPS.flatMap((g) => g.competitions)]
      .map((c): [string, { id: string; wiki: string }] => [c.id, { id: c.id, wiki: LOGO_PAGE[c.id] ?? c.wiki }])
      .filter(([, c]) => c.wiki),
  );
  for (const comp of comps.values()) {
    if (only.length ? !only.includes(comp.id) : out[comp.id]) continue;
    const [lang, title] = comp.wiki.startsWith("en:") ? ["en", comp.wiki.slice(3)] : ["es", comp.wiki.replace(/^es:/, "")];
    let img = LOGO_FILE[comp.id] ? await fileImage(LOGO_FILE[comp.id]) : await pageImage(lang, title);
    let host = img && LOGO_FILE[comp.id] && !img.free ? "en" : "commons";
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
