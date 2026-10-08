// Plantel actual de un club según la Wikipedia (en español; si no, en inglés): números, posiciones, nacionalidades y
// fechas de nacimiento. ESPN publica el plantel con números viejos y con jugadores que ya se fueron (en octubre de 2026
// listaba 49 en Boca, con Javier García con el 30; el plantel tenía 35 y García usaba el 13). Se guarda 6 horas.
import QIDS from "@/lib/data/clubs-wikidata.generated.json";

export type Line = "Arquero" | "Defensor" | "Mediocampista" | "Delantero";
export type SquadPlayer = { name: string; number?: string; line: Line; born?: string; nat?: string; injured?: boolean };

const UA = { "User-Agent": "126Goals/1.0 (https://offside-45.vercel.app)" };
const REVALIDATE = 21600;

async function getJson(url: string) {
  const r = await fetch(url, { headers: UA, next: { revalidate: REVALIDATE } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Plantillas {{Nombre|a=1|b=2}} con otras plantillas adentro: se recorren contando llaves.
function templates(text: string, names: RegExp): string[] {
  const out: string[] = [];
  const re = new RegExp(`\\{\\{\\s*(?:${names.source})\\s*\\|`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let depth = 0;
    let i = m.index;
    for (; i < text.length - 1; i++) {
      if (text[i] === "{" && text[i + 1] === "{") (depth++, i++);
      else if (text[i] === "}" && text[i + 1] === "}") {
        depth--;
        i++;
        if (depth === 0) break;
      }
    }
    out.push(text.slice(m.index + 2, i - 1));
  }
  return out;
}

// Parámetros de una plantilla (separados por "|" fuera de otras plantillas y enlaces).
function params(body: string): Record<string, string> {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === "{{" || two === "[[") (depth++, (cur += two), i++);
    else if (two === "}}" || two === "]]") (depth--, (cur += two), i++);
    else if (body[i] === "|" && depth === 0) (parts.push(cur), (cur = ""));
    else cur += body[i];
  }
  parts.push(cur);
  const out: Record<string, string> = {};
  for (const p of parts.slice(1)) {
    const k = p.indexOf("=");
    if (k > 0) out[p.slice(0, k).trim().toLowerCase()] = p.slice(k + 1).trim();
  }
  return out;
}

const linkText = (s: string) =>
  s
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Siglas de posición que se usan en los artículos (cada club escribe la suya).
const LINE: Record<string, Line> = {
  POR: "Arquero", ARQ: "Arquero", PO: "Arquero", GK: "Arquero",
  DEF: "Defensor", DF: "Defensor", DFC: "Defensor", LD: "Defensor", LI: "Defensor",
  MED: "Mediocampista", MF: "Mediocampista", MC: "Mediocampista", MCD: "Mediocampista", MCO: "Mediocampista", VOL: "Mediocampista",
  DEL: "Delantero", FW: "Delantero", EI: "Delantero", ED: "Delantero", SD: "Delantero",
};

// {{edad|9|3|1995}} → 1995-03-09; {{birth date and age|1995|3|9}} → 1995-03-09.
function born(s?: string) {
  if (!s) return undefined;
  const es = s.match(/\{\{\s*edad\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})\s*\|\s*(\d{4})/i);
  if (es) return `${es[3]}-${es[2].padStart(2, "0")}-${es[1].padStart(2, "0")}`;
  const en = s.match(/(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})/);
  return en ? `${en[1]}-${en[2].padStart(2, "0")}-${en[3].padStart(2, "0")}` : undefined;
}

export function parseSquad(text: string, lang: "es" | "en"): SquadPlayer[] {
  // Solo el bloque del plantel actual (entre "Equipo de fútbol inicio" y "fin", o el primer "Fs start" / "Fs end"):
  // los cedidos, la reserva y las bajas van en otros bloques. Cada artículo usa sus nombres de campo (num/no,
  // nac/nat, nombre/name).
  const block = (start: RegExp, end: RegExp) => {
    const a = text.search(start);
    if (a < 0) return text;
    const b = text.slice(a).search(end);
    return b < 0 ? text.slice(a) : text.slice(a, a + b);
  };
  const rows =
    lang === "es"
      ? templates(block(/Equipo de f[uú]tbol inicio/i, /Equipo de f[uú]tbol fin/i), /Jugador de f[uú]tbol/)
          .map(params)
          .map((p) => ({ num: p.num ?? p.no, nat: p.nac ?? p.nat, pos: p.pos, name: p.nombre ?? p.name, born: born(p.edad) }))
      : templates(block(/\{\{\s*Fs start/i, /\{\{\s*Fs end/i), /Fs player|Football squad player/)
          .map(params)
          .map((p) => ({ num: p.no, nat: p.nat, pos: p.pos, name: p.name, born: undefined }));
  return rows
    .filter((r) => r.name && LINE[(r.pos ?? "").toUpperCase()])
    .map((r) => ({
      name: linkText(r.name!),
      number: r.num && /^\d+$/.test(r.num.trim()) ? r.num.trim() : undefined,
      line: LINE[r.pos!.toUpperCase()],
      born: r.born,
      nat: r.nat?.trim().toUpperCase(),
      injured: /lesionad|injur/i.test(r.name!),
    }));
}

// Plantel del club (por su número de ESPN): primero la Wikipedia en español, si no la inglesa. null si no hay.
export async function wikiSquad(espnTeamId: string): Promise<SquadPlayer[] | null> {
  const qid = (QIDS as Record<string, string>)[espnTeamId];
  if (!qid) return null;
  const e = (await getJson(`https://www.wikidata.org/w/api.php?format=json&action=wbgetentities&props=sitelinks&sitefilter=eswiki|enwiki&ids=${qid}`)).entities?.[qid];
  for (const lang of ["es", "en"] as const) {
    const title = e?.sitelinks?.[`${lang}wiki`]?.title;
    if (!title) continue;
    const j = await getJson(
      `https://${lang}.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=${encodeURIComponent(title)}`,
    );
    const text: string = j.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? "";
    const squad = parseSquad(text, lang);
    if (squad.length >= 15) return squad;
  }
  return null;
}

// ── Plantel para mostrar: el de la Wikipedia, con los datos de ESPN de cada jugador ──────────────────────────────────

// Siglas de país de los artículos (FIFA de 3 letras o ISO de 2) → nombre en castellano.
const NAT: Record<string, string> = {
  ARG: "Argentina", AR: "Argentina", URU: "Uruguay", UY: "Uruguay", PAR: "Paraguay", PY: "Paraguay", CHI: "Chile", CL: "Chile",
  COL: "Colombia", CO: "Colombia", PER: "Perú", PE: "Perú", ECU: "Ecuador", EC: "Ecuador", BOL: "Bolivia", BO: "Bolivia",
  VEN: "Venezuela", VE: "Venezuela", BRA: "Brasil", BR: "Brasil", MEX: "México", MX: "México", USA: "Estados Unidos", US: "Estados Unidos",
  CAN: "Canadá", CA: "Canadá", CRC: "Costa Rica", PAN: "Panamá", HON: "Honduras", JAM: "Jamaica",
  ESP: "España", ES: "España", ITA: "Italia", IT: "Italia", FRA: "Francia", FR: "Francia", GER: "Alemania", DEU: "Alemania", DE: "Alemania",
  ENG: "Inglaterra", SCO: "Escocia", WAL: "Gales", NIR: "Irlanda del Norte", IRL: "Irlanda", IE: "Irlanda", POR: "Portugal", PT: "Portugal",
  NED: "Países Bajos", NL: "Países Bajos", BEL: "Bélgica", BE: "Bélgica", SUI: "Suiza", CH: "Suiza", AUT: "Austria", AT: "Austria",
  DEN: "Dinamarca", DK: "Dinamarca", NOR: "Noruega", NO: "Noruega", SWE: "Suecia", SE: "Suecia", FIN: "Finlandia", ISL: "Islandia",
  POL: "Polonia", PL: "Polonia", CZE: "Chequia", CZ: "Chequia", SVK: "Eslovaquia", SVN: "Eslovenia", HUN: "Hungría", ROU: "Rumania",
  CRO: "Croacia", HR: "Croacia", SRB: "Serbia", RS: "Serbia", BIH: "Bosnia y Herzegovina", MNE: "Montenegro", ALB: "Albania", MKD: "Macedonia del Norte",
  GRE: "Grecia", GR: "Grecia", TUR: "Turquía", TR: "Turquía", UKR: "Ucrania", UA: "Ucrania", GEO: "Georgia", RUS: "Rusia",
  MAR: "Marruecos", MA: "Marruecos", ALG: "Argelia", DZ: "Argelia", TUN: "Túnez", EGY: "Egipto", SEN: "Senegal", SN: "Senegal",
  CIV: "Costa de Marfil", CI: "Costa de Marfil", GHA: "Ghana", NGA: "Nigeria", CMR: "Camerún", MLI: "Malí", COD: "RD del Congo", GUI: "Guinea",
  JPN: "Japón", JP: "Japón", KOR: "Corea del Sur", KR: "Corea del Sur", AUS: "Australia", AU: "Australia", KSA: "Arabia Saudita",
};
export const nationality = (s?: string) => {
  if (!s) return undefined;
  const t = s.replace(/\{\{[^{}|]*\|?([^{}|]*)\}\}/, "$1").trim();
  if (NAT[t.toUpperCase()]) return NAT[t.toUpperCase()];
  // Nombre completo ("ARGENTINA", "argentina"): con mayúscula inicial.
  return t.length > 3 ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : t;
};

export type TeamPlayer = {
  id?: string; // número de ESPN (perfil, estadísticas, foto); sin él, el jugador se muestra sin enlace
  name: string;
  number?: string;
  line: Line;
  age?: number;
  nationality?: string;
  injured?: boolean;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const ageOf = (born?: string) => {
  if (!born) return undefined;
  const b = new Date(born);
  const now = new Date();
  return now.getFullYear() - b.getFullYear() - (now < new Date(now.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
};

type Espn = { id: string; name: string; born?: string; age?: number; nationality?: string };

// Cada jugador de la Wikipedia con su par de ESPN: mismo nombre, o mismo apellido y (misma inicial o mismo año de
// nacimiento). Los de ESPN que no están en la Wikipedia no se muestran (son los que se fueron o juveniles sin ficha).
export function mergeSquad(wiki: SquadPlayer[], espn: Espn[]): TeamPlayer[] {
  const used = new Set<string>();
  return wiki.map((w) => {
    const n = norm(w.name);
    const parts = n.split(" ");
    const last = parts[parts.length - 1];
    const year = w.born?.slice(0, 4);
    // Uno contenido en el otro, con al menos dos palabras: "Camilo Rey Domenech" / "Camilo Rey", "Alberto Campo" /
    // "Driden Alberto Campo Deusa".
    const within = (a: string[], b: string[]) => a.length >= 2 && a.every((x) => b.includes(x));
    const hit =
      espn.find((e) => !used.has(e.id) && norm(e.name) === n) ??
      espn.find((e) => !used.has(e.id) && (within(norm(e.name).split(" "), parts) || within(parts, norm(e.name).split(" ")))) ??
      espn.find((e) => {
        if (used.has(e.id)) return false;
        const en = norm(e.name).split(" ");
        if (!en.includes(last) && en[en.length - 1] !== last) return false;
        return en[0][0] === parts[0][0] || (!!year && e.born?.slice(0, 4) === year);
      });
    if (hit) used.add(hit.id);
    return {
      id: hit?.id,
      name: w.name,
      number: w.number,
      line: w.line,
      age: ageOf(w.born) ?? hit?.age,
      nationality: nationality(w.nat) ?? hit?.nationality,
      injured: w.injured,
    };
  });
}
