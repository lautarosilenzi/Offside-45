// Foto del estadio de cada club (para la portada de su página), con Wikidata: equipo de ESPN → ficha del club (club de
// fútbol del país de su liga; no el equipo femenino ni el de reserva) → su estadio ("home venue", P115) → la foto del
// estadio (P18) en Wikimedia Commons, con su autor y su licencia.
// Uso: node scripts/stadiums.cjs   → lib/data/stadiums.generated.json y .cache/stadiums-report.txt (para revisar a mano)
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Liga de ESPN → país en Wikidata (Inglaterra y Escocia también figuran como Reino Unido; la MLS tiene clubes de Canadá).
const LEAGUES = {
  "arg.1": ["Q414"], "arg.2": ["Q414"], "eng.1": ["Q21", "Q145"], "eng.2": ["Q21", "Q145", "Q25"], "esp.1": ["Q29"], "ita.1": ["Q38"],
  "ger.1": ["Q183"], "fra.1": ["Q142"], "por.1": ["Q45"], "ned.1": ["Q55"], "sco.1": ["Q22", "Q145"], "bel.1": ["Q31"], "tur.1": ["Q43"],
  "bra.1": ["Q155"], "uru.1": ["Q77"], "par.1": ["Q733"], "col.1": ["Q739"], "chi.1": ["Q298"], "per.1": ["Q419"], "ecu.1": ["Q736"],
  "bol.1": ["Q750"], "ven.1": ["Q717"], "mex.1": ["Q96"], "usa.1": ["Q30", "Q16"], "ksa.1": ["Q851"],
};
const FOOTBALL_CLUB = new Set(["Q476028", "Q103229495", "Q17270000", "Q15944511"]);
const SPORTS_CLUB = "Q847017";
const NOT_FIRST_TEAM = /women|femen|feminin|ladies|\bII\b|\bB\b|reserve|youth|academy|under-?\d|U-?\d\d|sub-?\d\d|futsal|basket|rugby/i;

const OUT = path.join(__dirname, "../lib/data/stadiums.generated.json");
const CACHE = path.join(__dirname, "../.cache/stadiums-wd");
fs.mkdirSync(CACHE, { recursive: true });
const UA = { "User-Agent": "Offside45-data-script/1.0 (https://offside-45.vercel.app)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(url) {
  const file = path.join(CACHE, crypto.createHash("sha1").update(url).digest("hex") + ".json");
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  for (let i = 0; i < 6; i++) {
    // ESPN rechaza los User-Agent de scripts; Wikimedia pide uno que identifique al sitio.
    const r = await fetch(url, url.includes("espn.com") ? {} : { headers: UA });
    if (r.ok) {
      const j = await r.json();
      fs.writeFileSync(file, JSON.stringify(j));
      await sleep(300);
      return j;
    }
    console.log("reintento", r.status);
    await sleep(20000 * (i + 1));
  }
  throw new Error(`Falló ${url}`);
}

const WD = "https://www.wikidata.org/w/api.php?format=json&";
async function entities(ids) {
  const out = {};
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const j = await json(`${WD}action=wbgetentities&props=claims|labels|descriptions&languages=en|es&ids=${chunk.join("|")}`);
    Object.assign(out, j.entities ?? {});
  }
  return out;
}
const claimIds = (e, p) =>
  (e?.claims?.[p] ?? [])
    .filter((c) => c.rank !== "deprecated" && !c.qualifiers?.P582) // sin fecha de fin: el actual
    .sort((a, b) => (b.rank === "preferred") - (a.rank === "preferred"))
    .map((c) => c.mainsnak?.datavalue?.value?.id ?? c.mainsnak?.datavalue?.value)
    .filter(Boolean);
const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ");
// Equipos que quedan sin foto: Wikidata los confunde con otro club o les asigna un estadio viejo (revisado a mano).
const SKIP = new Set(["146", "337", "3457", "21446", "21843"]);
const label = (e) => e?.labels?.es?.value ?? e?.labels?.en?.value ?? "";

(async () => {
  // 1. Equipos de cada liga.
  const teams = [];
  for (const lg of Object.keys(LEAGUES)) {
    const j = await json(`https://site.api.espn.com/apis/site/v2/sports/soccer/${lg}/teams`);
    for (const t of j.sports?.[0]?.leagues?.[0]?.teams ?? []) if (!teams.some((x) => x.id === String(t.team.id))) teams.push({ id: String(t.team.id), name: t.team.displayName, league: lg });
  }
  console.log(teams.length, "equipos");

  // 2 y 3. Candidatos de Wikidata para cada uno (el nombre sin la aclaración entre paréntesis) y el primero que sea un
  // club de fútbol (o un club deportivo con estadio, como Boca) del país de su liga y su primer equipo. Si con el nombre
  // de ESPN no aparece ("San Lorenzo" trae ciudades), se prueba con el nombre completo.
  const search = async (q) => (await json(`${WD}action=wbsearchentities&type=item&limit=10&language=en&uselang=en&search=${encodeURIComponent(q)}`)).search?.map((s) => s.id) ?? [];
  const ent = {};
  const pick = (t, cands) =>
    cands.find((c) => {
      const e = ent[c];
      if (!e) return false;
      const kinds = claimIds(e, "P31");
      const text = norm([label(e), e.labels?.en?.value, e.descriptions?.en?.value, e.descriptions?.es?.value].join(" "));
      const words = (x) => norm(x).split(" ").filter((w) => w.length >= 4);
      // Club polideportivo (como Boca): solo si el nombre coincide.
      if (!kinds.some((x) => FOOTBALL_CLUB.has(x)) && !(kinds.includes(SPORTS_CLUB) && e.claims?.P115 && words(t.name.replace(/\(.*\)/, "")).some((w) => text.includes(w)))) return false;
      // "Gimnasia (Mendoza)", "San Martín (Tucumán)": la ciudad tiene que figurar en el nombre o en la descripción.
      const city = t.name.match(/\(([^)]+)\)/)?.[1];
      if (city && !words(city).some((w) => text.includes(w))) return false;
      if (!(e.claims?.P17 ?? []).some((c2) => LEAGUES[t.league].includes(c2.mainsnak?.datavalue?.value?.id))) return false;
      return !NOT_FIRST_TEAM.test(label(e)) && !NOT_FIRST_TEAM.test(e.labels?.en?.value ?? "");
    });
  const club = {};
  for (const variants of [(q) => [q], (q, city) => [`${q} football club`, `Club Atlético ${q}`, `${q} FC`, ...(city ? [`${q} ${city}`, `${q} de ${city}`] : [])]]) {
    const cands = {};
    for (const t of teams) {
      if (club[t.id] || SKIP.has(t.id)) continue;
      const q = t.name.replace(/\s*\([^)]*\)/, "").trim();
      cands[t.id] = (await Promise.all(variants(q, t.name.match(/\(([^)]+)\)/)?.[1]).map(search))).flat();
    }
    Object.assign(ent, await entities([...new Set(Object.values(cands).flat())].filter((id) => !ent[id])));
    for (const t of teams) {
      const id = cands[t.id] && pick(t, cands[t.id]);
      if (id) club[t.id] = { qid: id, label: label(ent[id]), venue: claimIds(ent[id], "P115")[0] };
    }
  }

  // 4. Estadio y su foto.
  const venues = await entities([...new Set(Object.values(club).map((c) => c.venue).filter(Boolean))]);
  const files = {};
  for (const c of Object.values(club)) if (c.venue) files[c.venue] = claimIds(venues[c.venue], "P18")[0];
  const info = {};
  const names = [...new Set(Object.values(files).filter(Boolean))];
  for (let i = 0; i < names.length; i += 40) {
    const chunk = names.slice(i, i + 40);
    const j = await json(
      `https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&action=query&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&titles=${encodeURIComponent(chunk.map((f) => "File:" + f).join("|"))}`,
    );
    const map = {};
    for (const n of j.query.normalized ?? []) map[n.from] = n.to;
    for (const f of chunk) {
      const p = j.query.pages.find((x) => x.title === (map["File:" + f] ?? "File:" + f));
      const ii = p?.imageinfo?.[0];
      if (!ii) continue;
      const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      info[f] = {
        url: ii.thumburl ?? ii.url,
        width: ii.thumbwidth ?? ii.width,
        height: ii.thumbheight ?? ii.height,
        page: ii.descriptionurl,
        artist: strip(ii.extmetadata?.Artist?.value).slice(0, 80),
        license: strip(ii.extmetadata?.LicenseShortName?.value),
      };
    }
  }

  // 5. Solo fotos horizontales (las verticales se ven mal de fondo).
  const out = {};
  const report = [];
  for (const t of teams) {
    const c = club[t.id];
    const file = c?.venue && files[c.venue];
    const ii = file && info[file];
    const ok = ii && ii.width >= ii.height * 1.2;
    report.push(`${ok ? "OK " : "-- "}${t.id}\t${t.name}\t→ ${c ? `${c.label} (${c.qid})` : "?"}\t→ ${c?.venue ? label(venues[c.venue]) : "?"}\t${file ?? ""}`);
    if (ok) out[t.id] = { team: t.name, stadium: label(venues[c.venue]), ...ii };
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  // Ficha de Wikidata de cada club (también de los que no tienen foto): de ahí sale el DT (lib/live/coach.ts).
  const qids = Object.fromEntries(Object.entries(club).map(([id, c]) => [id, c.qid]));
  fs.writeFileSync(path.join(__dirname, "../lib/data/clubs-wikidata.generated.json"), JSON.stringify(qids, null, 1));

  // Estadio y su capacidad (P1083) de cada club, tenga o no foto. Con varias cifras: la marcada como preferida o la más
  // reciente (P585, fecha); sin cifra, solo el nombre.
  const capacityOf = (v) => {
    const cl = (v?.claims?.P1083 ?? []).filter((c) => c.rank !== "deprecated" && c.mainsnak?.datavalue);
    if (!cl.length) return undefined;
    const date = (c) => c.qualifiers?.P585?.[0]?.datavalue?.value?.time ?? "";
    const best = cl.find((c) => c.rank === "preferred") ?? [...cl].sort((a, b) => date(b).localeCompare(date(a)))[0];
    return Math.round(Number(best.mainsnak.datavalue.value.amount));
  };
  // Las fuentes no siempre coinciden (el Camp Nou: 105.000 en Wikidata, 99.354 en la Wikipedia en español y 62.652 en
  // la inglesa, por la obra). Se compara con el infobox de las dos Wikipedias y se guarda la capacidad solo si al menos
  // dos fuentes coinciden (hasta un 5% de diferencia), redondeada al millar.
  const venueIds = [...new Set(Object.values(club).map((c) => c.venue).filter(Boolean))];
  const links = {};
  for (let i = 0; i < venueIds.length; i += 50) {
    const j = await json(`${WD}action=wbgetentities&props=sitelinks&sitefilter=eswiki|enwiki&ids=${venueIds.slice(i, i + 50).join("|")}`);
    for (const [id, e] of Object.entries(j.entities ?? {})) links[id] = { es: e.sitelinks?.eswiki?.title, en: e.sitelinks?.enwiki?.title };
  }
  const infoboxCapacity = async (lang) => {
    const titles = [...new Set(Object.values(links).map((l) => l[lang]).filter(Boolean))];
    const out = {};
    for (let i = 0; i < titles.length; i += 20) {
      const chunk = titles.slice(i, i + 20);
      const j = await json(`https://${lang}.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=revisions&rvprop=content&rvslots=main&titles=${encodeURIComponent(chunk.join("|"))}`);
      const map = {};
      for (const n of j.query?.normalized ?? []) map[n.to] = n.from;
      for (const p of j.query?.pages ?? []) {
        const text = p.revisions?.[0]?.slots?.main?.content ?? "";
        const raw = text.match(/\|\s*(?:capacidad|capacity)\s*=([^\n]*)/i)?.[1] ?? "";
        const clean = raw.replace(/<ref[\s\S]*?(<\/ref>|\/>)/g, "").replace(/\{\{(?:formatnum|nts|nowrap)\s*:?\|?([^{}|]*)[^{}]*\}\}/gi, "$1");
        const m = clean.match(/(\d{1,3}(?:[.,\s ]\d{3})+|\d{4,6})/);
        if (m) out[map[p.title] ?? p.title] = Number(m[1].replace(/[.,\s ]/g, ""));
      }
    }
    return out;
  };
  const [capEs, capEn] = [await infoboxCapacity("es"), await infoboxCapacity("en")];
  const agreed = (vals) => {
    const v = vals.filter((x) => x > 1000);
    // El par que más coincide (el Kempes: 60.000 en Wikidata, 57.000 en las dos Wikipedias → 57.000), y su promedio.
    let best;
    for (let i = 0; i < v.length; i++)
      for (let k = i + 1; k < v.length; k++) {
        const d = Math.abs(v[i] - v[k]) / Math.max(v[i], v[k]);
        if (d <= 0.05 && (!best || d < best.d)) best = { d, avg: (v[i] + v[k]) / 2 };
      }
    return best ? Math.round(best.avg / 1000) * 1000 : undefined;
  };
  const venueOut = {};
  for (const t of teams) {
    const c = club[t.id];
    if (!c?.venue || !venues[c.venue]) continue;
    const l = links[c.venue] ?? {};
    venueOut[t.id] = { name: label(venues[c.venue]), capacity: agreed([capacityOf(venues[c.venue]), capEs[l.es], capEn[l.en]]) };
  }
  fs.writeFileSync(path.join(__dirname, "../lib/data/venues.generated.json"), JSON.stringify(venueOut, null, 1));
  fs.writeFileSync(path.join(CACHE, "..", "stadiums-report.txt"), report.join("\n"));
  console.log(Object.keys(out).length, "con foto · revisar .cache/stadiums-report.txt");
})();
