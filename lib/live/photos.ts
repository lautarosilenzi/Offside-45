// Fotos de los jugadores de un club. Primero la de ESPN (recortada, de frente); si no tiene, una foto libre de Wikimedia
// Commons, de la ficha del jugador en Wikidata. Para no equivocar la persona ni la foto:
// - el jugador de Wikidata tiene que haber jugado en el club y coincidir en nombre Y año de nacimiento con el plantel
//   de ESPN (hay homónimos de otras épocas);
// - el archivo tiene que llevar el apellido del jugador (no una foto del equipo) y ser vertical o estar recortado (para
//   que la cara quede bien en el círculo).
// Todo se guarda un día.
import QIDS from "@/lib/data/clubs-wikidata.generated.json";

export type Photo = { url: string; credit?: string };

const UA = { "User-Agent": "Offside45/1.0 (https://offside-45.vercel.app)" };
const DAY = 86400;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const surname = (name: string) => norm(name).split(" ").pop() ?? "";

async function getJson(url: string, init?: RequestInit) {
  // ESPN rechaza los User-Agent de programas; Wikimedia pide uno que identifique al sitio.
  const ua = url.includes("espn.com") ? {} : UA;
  const r = await fetch(url, { ...init, headers: { ...ua, ...(init?.headers ?? {}) }, next: { revalidate: DAY } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

// Plantel de ESPN: número, nombre y fecha de nacimiento de cada jugador.
async function roster(league: string, teamId: string) {
  const j = await getJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${teamId}/roster`);
  return (j.athletes ?? []).map((a: any) => ({ id: String(a.id), name: String(a.displayName ?? ""), born: String(a.dateOfBirth ?? "").slice(0, 4) })) as {
    id: string;
    name: string;
    born: string;
  }[];
}

async function espnHeadshot(id: string) {
  const url = `https://a.espncdn.com/i/headshots/soccer/players/full/${id}.png`;
  return fetch(url, { method: "HEAD", next: { revalidate: DAY } })
    .then((r) => (r.ok ? url : undefined))
    .catch(() => undefined);
}

// Jugadores del club en Wikidata con foto y fecha de nacimiento.
async function wikidataPlayers(qid: string) {
  const query = `SELECT ?p ?label ?en ?img ?born WHERE {
    ?p p:P54/ps:P54 wd:${qid} ; wdt:P18 ?img ; wdt:P569 ?born .
    OPTIONAL { ?p rdfs:label ?label FILTER(LANG(?label) = "es") }
    OPTIONAL { ?p rdfs:label ?en FILTER(LANG(?en) = "en") }
  }`;
  const j = await getJson(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`, { headers: { Accept: "application/sparql-results+json" } });
  return (j.results?.bindings ?? []).map((b: any) => ({
    names: [b.label?.value, b.en?.value].filter(Boolean).map(norm),
    born: String(b.born?.value ?? "").slice(0, 4),
    file: decodeURIComponent(String(b.img?.value ?? "").split("/").pop() ?? ""),
  })) as { names: string[]; born: string; file: string }[];
}

// Futbolistas (P106 = futbolista) con alguno de estos nombres exactos, con foto y fecha de nacimiento.
async function wikidataByName(names: string[]) {
  const values = names.flatMap((n) => [`"${n.replace(/"/g, "")}"@es`, `"${n.replace(/"/g, "")}"@en`]).join(" ");
  const query = `SELECT ?p ?name ?img ?born WHERE {
    VALUES ?name { ${values} }
    ?p rdfs:label ?name ; wdt:P106 wd:Q937857 ; wdt:P18 ?img ; wdt:P569 ?born .
  }`;
  const j = await getJson(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`, { headers: { Accept: "application/sparql-results+json" } });
  return (j.results?.bindings ?? []).map((b: any) => ({
    names: [norm(b.name?.value ?? "")],
    born: String(b.born?.value ?? "").slice(0, 4),
    file: decodeURIComponent(String(b.img?.value ?? "").split("/").pop() ?? ""),
  })) as { names: string[]; born: string; file: string }[];
}

// Tamaño, autor y licencia de las fotos (Commons), con una miniatura de 240 px.
async function commonsInfo(files: string[]) {
  const out: Record<string, { url: string; w: number; h: number; credit: string }> = {};
  for (let i = 0; i < files.length; i += 40) {
    const chunk = files.slice(i, i + 40);
    const j = await getJson(
      `https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&action=query&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=240&titles=${encodeURIComponent(chunk.map((f) => `File:${f}`).join("|"))}`,
    );
    const map: Record<string, string> = {};
    for (const n of j.query?.normalized ?? []) map[n.to] = n.from;
    for (const p of j.query?.pages ?? []) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const file = (map[p.title] ?? p.title).replace(/^File:/, "");
      const strip = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      out[file] = {
        url: ii.thumburl ?? ii.url,
        w: ii.width,
        h: ii.height,
        credit: [strip(ii.extmetadata?.Artist?.value).slice(0, 60), strip(ii.extmetadata?.LicenseShortName?.value)].filter(Boolean).join(" · "),
      };
    }
  }
  return out;
}

// Fotos de los jugadores del plantel de un club: { idDeESPN: foto }.
export async function teamPhotos(league: string, teamId: string): Promise<Record<string, Photo>> {
  const players = await roster(league, teamId).catch(() => []);
  const out: Record<string, Photo> = {};
  const heads = await Promise.all(players.map((p) => espnHeadshot(p.id)));
  players.forEach((p, i) => heads[i] && (out[p.id] = { url: heads[i]! }));

  const qid = (QIDS as Record<string, string>)[teamId];
  const missing = players.filter((p) => !out[p.id] && p.born);
  if (!missing.length) return out;
  // Los del club en Wikidata y, para los que falten (el club actual a veces no está cargado), los futbolistas con el
  // mismo nombre exacto.
  const fromClub = qid ? await wikidataPlayers(qid).catch(() => []) : [];
  const unmatched = missing.filter((p) => !fromClub.some((w) => w.born === p.born && w.names.includes(norm(p.name))));
  const byName = unmatched.length ? await wikidataByName(unmatched.map((p) => p.name)).catch(() => []) : [];
  const wd = [...fromClub, ...byName];
  const picks: Record<string, string> = {};
  for (const p of missing) {
    const n = norm(p.name);
    const last = surname(p.name);
    const hit = wd.find(
      (w) =>
        w.born === p.born &&
        w.names.some((x) => x === n || (x.endsWith(` ${last}`) && x.split(" ")[0] === n.split(" ")[0])) &&
        norm(w.file).includes(last),
    );
    if (hit) picks[p.id] = hit.file;
  }
  const info = await commonsInfo([...new Set(Object.values(picks))]).catch(() => ({}) as Awaited<ReturnType<typeof commonsInfo>>);
  for (const [id, file] of Object.entries(picks)) {
    const ii = info[file];
    // Recortada, o vertical sin ser de cuerpo entero: en una foto apaisada o de cuerpo entero la cara queda chica en el
    // círculo. Nunca fotos de equipo ("Team Brazil at 2026 FIFA World Cup (Endrick)").
    if (!ii || /\bteam\b|squad|plantel|equipo|selecci/i.test(file)) continue;
    const ratio = ii.h / ii.w;
    if (/crop/i.test(file) ? ratio >= 0.7 : ratio >= 0.95 && ratio <= 1.6) out[id] = { url: ii.url, credit: ii.credit };
  }
  return out;
}
