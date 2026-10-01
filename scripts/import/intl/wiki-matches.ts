// Partidos de un artículo de Wikipedia en español de una copa (ej. "Copa Libertadores 1965"). Hay dos formatos:
//   Tablas de partidos de grupo: fila con fecha | ciudad | local | resultado | visitante.
//   Plantillas {{Partido |local= |resultado= |visita= |fecha= |ciudad= }} en las series y la final.
import { fetchWiki } from "../wiki";

// pens: la tanda de penales (local, visitante), si la hubo.
// homeCountry/awayCountry: código de país de tres letras de la plantilla o de la bandera de la celda, si lo hay.
export type WikiMatch = { day: number; month: number; year?: number; city: string; home: string; away: string; hg: number; ag: number; pens?: [number, number]; homeCountry?: string; awayCountry?: string; raw: string };

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const clean = (s: string) =>
  s
    .replace(/<ref[^>]*\/>|<ref[\s\S]*?<\/ref>/g, "")
    .replace(/\{\{refn[\s\S]*$/i, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{(?:bandera|band|flagicon)[^{}]*\}\}/gi, "")
    .replace(/\{\{nowrap\|([^{}]*)\}\}/gi, "$1")
    .replace(/\[\[(?:Archivo|File|Imagen):[^\]]*\]\]/gi, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\[https?:\S+\s+([^\]]*)\]/g, "$1")
    .replace(/'''|''/g, "")
    .replace(/^\s*(?:align|style|bgcolor|width)\s*=\s*"?[^|"]*"?\s*\|(?!\|)/i, "")
    .trim();

// Código de país de la bandera de una celda: {{bandera|BRA}} o {{BRA}}.
const flagCode = (s: string) => s.match(/\{\{\s*(?:bandera\|)?([A-Z]{3})\s*[|}]/i)?.[1]?.toUpperCase();

const parseDate = (s: string) => {
  // {{fecha|12|8|}} o {{fecha|12|8|2025}}: día, mes y (a veces) año.
  const t = s.match(/\{\{\s*fecha\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})\s*(?:\|\s*(\d{4})?)?/i);
  if (t) return { day: +t[1], month: +t[2], ...(t[3] && { year: +t[3] }) };
  const m = clean(s).match(/(\d{1,2})\s+de\s+([a-záé]+)(?:\s+de\s+(\d{4}))?/i);
  if (!m || !MESES.includes(m[2].toLowerCase())) return null;
  return { day: +m[1], month: MESES.indexOf(m[2].toLowerCase()) + 1, ...(m[3] && { year: +m[3] }) };
};
const parseScore = (s: string) => {
  const m = clean(s).match(/^(\d+)\s*[:\-–]\s*(\d+)/);
  return m ? [+m[1], +m[2]] : null;
};

// Texto de un artículo, siguiendo las redirecciones ("Copa Libertadores 1960" → "Copa de Campeones de América 1960").
export async function wikiText(title: string): Promise<string | null> {
  let text = await fetchWiki(title);
  for (let i = 0; text && i < 3; i++) {
    const r = text.match(/^#REDIREC(?:CIÓN|T)\s*\[\[([^\]|#]+)/i);
    if (!r) break;
    text = await fetchWiki(r[1].trim());
  }
  return text;
}

export async function wikiMatches(title: string): Promise<WikiMatch[] | null> {
  const text = await wikiText(title);
  if (!text) return null;
  const out: WikiMatch[] = [];

  // Plantillas {{Partido …}} o {{Partidos …}}: se buscan contando llaves (a veces cierran en la misma línea).
  const blocks: string[] = [];
  for (const start of text.matchAll(/\{\{\s*Partidos?\s*(?=[|\n])/gi)) {
    let depth = 0;
    let i = start.index!;
    for (; i < text.length - 1; i++) {
      if (text[i] === "{" && text[i + 1] === "{") (depth++, i++);
      else if (text[i] === "}" && text[i + 1] === "}") {
        depth--;
        i++;
        if (depth === 0) break;
      }
    }
    blocks.push(text.slice(start.index! + start[0].length, i - 1));
  }
  for (const body of blocks) {
    const block = [body, body] as const;
    const params: Record<string, string> = {};
    // Los parámetros van separados por "|" al principio de línea (o en la misma línea, en las plantillas compactas).
    // En las compactas se corta por "|" fuera de enlaces y plantillas ([[A|B]], {{gol|71}}).
    const splitTop = (s: string) => {
      const out2: string[] = [];
      let depth = 0;
      let cur = "";
      for (let j = 0; j < s.length; j++) {
        const two = s.slice(j, j + 2);
        if (two === "[[" || two === "{{") (depth++, (cur += two), j++);
        else if (two === "]]" || two === "}}") (depth--, (cur += two), j++);
        else if (s[j] === "|" && depth === 0) (out2.push(cur), (cur = ""));
        else cur += s[j];
      }
      out2.push(cur);
      return out2;
    };
    const parts = splitTop(block[1]);
    for (const p of parts) {
      const kv = p.replace(/^\s*\|/, "").match(/^\s*([a-záéíóú_ ]+?)\s*=\s*([\s\S]*)$/i);
      if (kv) params[kv[1].toLowerCase()] = kv[2].trim();
    }
    const d = parseDate(params.fecha ?? "");
    const sc = parseScore(params.resultado ?? "");
    if (!d || !sc || !params.local || !params.visita) continue;
    const pens = parseScore(params["resultado penalti"] ?? params["penales"] ?? "");
    const code = (k: string) => params[k]?.match(/^\s*([A-Z]{3})\b/)?.[1];
    out.push({ ...d, city: clean(params.ciudad ?? ""), home: clean(params.local), away: clean(params.visita), hg: sc[0], ag: sc[1], ...(pens && { pens: pens as [number, number] }), homeCountry: code("paíslocal") ?? flagCode(params.local), awayCountry: code("paísvisita") ?? flagCode(params.visita), raw: block[0].slice(0, 200) });
  }

  // Recuadros de final (Copa Intercontinental, Suruga): dos encabezados con el equipo y sus goles
  //   "! {{bandera|ARG}}<br>{{tc|Club|Equipo}}<br>1" y el del rival, y abajo "14 de diciembre de 2003 … {{tc|Ciudad}}".
  const lines = text.split("\n");
  const boxTeam = (l: string) => {
    // Los goles pueden llevar los penales al lado: "<big>1 <small>(3)</small>".
    const m = l.match(/^[!|].*<br\s*\/?>\s*(?:'''|<big>)?\s*(\d+)\s*(?:<small>\s*\(\d+\)\s*<\/small>)?\s*(?:'''|<\/big>)?\s*$/i);
    if (!m) return null;
    const before = l.slice(0, l.lastIndexOf("<br")).replace(/<\/?big>/gi, "");
    const name = before.match(/\{\{tc\|(?:[^|}]*\|)?([^|}]+)\}\}\s*$/)?.[1] ?? before.match(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]\s*$/)?.[1];
    return name ? { name: name.trim(), goals: +m[1] } : null;
  };
  for (let i = 0; i < lines.length - 1; i++) {
    const a = boxTeam(lines[i]);
    const b = a && boxTeam(lines[i + 1]);
    if (!a || !b) continue;
    for (let j = i + 2; j < Math.min(lines.length, i + 8); j++) {
      const d = parseDate(lines[j]);
      if (!d) continue;
      const cities = [...lines[j].matchAll(/\{\{tc\|(?:[^|}]*\|)?([^|}]+)\}\}/g)].map((x) => x[1]);
      out.push({ ...d, city: cities.at(-1) ?? "", home: a.name, away: b.name, hg: a.goals, ag: b.goals, raw: lines[j].slice(0, 200) });
      break;
    }
  }

  // Filas de tablas: fecha | ciudad | local | resultado | visitante (cada celda en su línea o separadas por ||).
  let cells: string[] = [];
  const flush = () => {
    const i = cells.findIndex((c) => parseDate(c));
    if (i >= 0 && cells.length >= i + 5) {
      const d = parseDate(cells[i])!;
      const [city, home, score, away] = cells.slice(i + 1, i + 5);
      const sc = parseScore(score);
      if (sc && clean(home) && clean(away)) out.push({ ...d, city: clean(city), home: clean(home), away: clean(away), hg: sc[0], ag: sc[1], homeCountry: flagCode(home), awayCountry: flagCode(away), raw: cells.join(" | ").slice(0, 200) });
    }
    cells = [];
  };
  for (const line of text.split("\n")) {
    if (/^\|-/.test(line) || /^\|\}/.test(line) || /^\{\|/.test(line)) flush();
    else if (/^\|(?!\+)/.test(line)) cells.push(...line.slice(1).split("||"));
  }
  flush();
  return out;
}

// Campeón y subcampeón de cada edición, de la tabla "Historial" del artículo de la copa:
// fila con año | campeón | resultados de la final | subcampeón | …
export type WikiFinalist = { name: string; country: string };
// results: los resultados de la final que da la tabla (sin los penales).
export type WikiChampion = { year: number; champion: WikiFinalist; runnerUp: WikiFinalist; results: [number, number][] };
export async function wikiChampions(title: string, section = "Historial"): Promise<WikiChampion[]> {
  const text = (await wikiText(title)) ?? "";
  const start = text.search(new RegExp(`^==\\s*${section}\\s*==`, "m"));
  if (start < 0) return [];
  const rest = text.slice(start + 3);
  const body = rest.slice(0, rest.search(/^==[^=]/m) >= 0 ? rest.search(/^==[^=]/m) : undefined);
  const firstLink = (s: string) => s.match(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/)?.[1]?.trim() ?? "";
  // El país sale de la bandera de la celda: {{bandera2|Uruguay}}, {{bandera|URU}} o {{URU}}.
  const CODES: Record<string, string> = { ARG: "Argentina", URU: "Uruguay", PAR: "Paraguay", BRA: "Brasil", CHI: "Chile", COL: "Colombia", ECU: "Ecuador", PER: "Perú", BOL: "Bolivia", VEN: "Venezuela", MEX: "México",
    CHL: "Chile", CRI: "Costa Rica", HON: "Honduras", GTM: "Guatemala", TTO: "Trinidad y Tobago", SLV: "El Salvador", USA: "Estados Unidos",
    ESP: "España", ITA: "Italia", ENG: "Inglaterra", SCO: "Escocia", NED: "Países Bajos", NLD: "Países Bajos", GER: "Alemania", FRG: "Alemania",
    POR: "Portugal", ROM: "Rumania", ROU: "Rumania", FRA: "Francia", GRE: "Grecia", SWE: "Suecia", JPN: "Japón", KOR: "Corea del Sur", EAU: "Emiratos Árabes Unidos" };
  const country = (s: string) => {
    const f = s.match(/\{\{bandera2?\|([^|}]+)/i)?.[1]?.trim() ?? s.match(/\{\{([A-Z]{3})\}\}/)?.[1] ?? "";
    return CODES[f.toUpperCase()] ?? f;
  };
  const team = (s: string): WikiFinalist => ({ name: firstLink(s), country: country(s) });
  const out: WikiChampion[] = [];
  for (const row of body.split(/\n\|-/)) {
    // Celdas comunes ("|") y de encabezado ("!", el campeón en algunas tablas); no las de la tabla anidada.
    const cells = row
      .split("\n")
      .filter((l) => /^[|!](?![-}+])/.test(l) && !/^!\s*(width|colspan)/i.test(l))
      .map((l) => l.slice(1));
    const y = cells[0]?.match(/\|(\d{4})\]\]/) ?? cells[0]?.match(/^\s*'*(\d{4})'*/);
    if (!y || cells.length < 4) continue;
    const results = [...cells[2].replace(/\([^)]*\)/g, " ").replace(/<[^>]*>/g, " ").matchAll(/(\d+)\s*[:\-–]\s*(\d+)/g)].map((x) => [+x[1], +x[2]] as [number, number]);
    out.push({ year: +y[1], champion: team(cells[1]), runnerUp: team(cells[3]), results });
  }
  return out;
}
