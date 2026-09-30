// Partidos de un artículo de Wikipedia en español de una copa (ej. "Copa Libertadores 1965"). Hay dos formatos:
//   Tablas de partidos de grupo: fila con fecha | ciudad | local | resultado | visitante.
//   Plantillas {{Partido |local= |resultado= |visita= |fecha= |ciudad= }} en las series y la final.
import { fetchWiki } from "../wiki";

export type WikiMatch = { day: number; month: number; year?: number; city: string; home: string; away: string; hg: number; ag: number; raw: string };

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

const parseDate = (s: string) => {
  // {{fecha|12|8|}} o {{fecha|12|8|2025}}: día, mes y (a veces) año.
  const t = s.match(/\{\{\s*fecha\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})\s*\|\s*(\d{4})?/i);
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

  // Plantillas {{Partido …}}.
  for (const block of text.matchAll(/\{\{\s*Partido\b([\s\S]*?)\n\}\}/gi)) {
    const params: Record<string, string> = {};
    for (const p of block[1].split(/\n\s*\|/)) {
      const kv = p.match(/^\s*([a-záéíóú_ ]+?)\s*=\s*([\s\S]*)$/i);
      if (kv) params[kv[1].toLowerCase()] = kv[2].trim();
    }
    const d = parseDate(params.fecha ?? "");
    const sc = parseScore(params.resultado ?? "");
    if (!d || !sc || !params.local || !params.visita) continue;
    out.push({ ...d, city: clean(params.ciudad ?? ""), home: clean(params.local), away: clean(params.visita), hg: sc[0], ag: sc[1], raw: block[0].slice(0, 200) });
  }

  // Filas de tablas: fecha | ciudad | local | resultado | visitante (cada celda en su línea o separadas por ||).
  let cells: string[] = [];
  const flush = () => {
    const i = cells.findIndex((c) => parseDate(c));
    if (i >= 0 && cells.length >= i + 5) {
      const d = parseDate(cells[i])!;
      const [city, home, score, away] = cells.slice(i + 1, i + 5);
      const sc = parseScore(score);
      if (sc && clean(home) && clean(away)) out.push({ ...d, city: clean(city), home: clean(home), away: clean(away), hg: sc[0], ag: sc[1], raw: cells.join(" | ").slice(0, 200) });
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
export async function wikiChampions(title: string, section = "Historial"): Promise<{ year: number; champion: WikiFinalist; runnerUp: WikiFinalist }[]> {
  const text = (await wikiText(title)) ?? "";
  const start = text.search(new RegExp(`^==\\s*${section}\\s*==`, "m"));
  if (start < 0) return [];
  const rest = text.slice(start + 3);
  const body = rest.slice(0, rest.search(/^==[^=]/m) >= 0 ? rest.search(/^==[^=]/m) : undefined);
  const firstLink = (s: string) => s.match(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/)?.[1]?.trim() ?? "";
  // El país sale de la bandera de la celda: {{bandera2|Uruguay}}, {{bandera|URU}} o {{URU}}.
  const CODES: Record<string, string> = { ARG: "Argentina", URU: "Uruguay", PAR: "Paraguay", BRA: "Brasil", CHI: "Chile", COL: "Colombia", ECU: "Ecuador", PER: "Perú", BOL: "Bolivia", VEN: "Venezuela", MEX: "México" };
  const country = (s: string) => {
    const f = s.match(/\{\{bandera2?\|([^|}]+)/i)?.[1]?.trim() ?? s.match(/\{\{([A-Z]{3})\}\}/)?.[1] ?? "";
    return CODES[f.toUpperCase()] ?? f;
  };
  const team = (s: string): WikiFinalist => ({ name: firstLink(s), country: country(s) });
  const out: { year: number; champion: WikiFinalist; runnerUp: WikiFinalist }[] = [];
  for (const row of body.split(/\n\|-/)) {
    // Celdas comunes ("|") y de encabezado ("!", el campeón en algunas tablas); no las de la tabla anidada.
    const cells = row
      .split("\n")
      .filter((l) => /^[|!](?![-}+])/.test(l) && !/^!\s*(width|colspan)/i.test(l))
      .map((l) => l.slice(1));
    const y = cells[0]?.match(/\|(\d{4})\]\]/) ?? cells[0]?.match(/^\s*'*(\d{4})'*/);
    if (!y || cells.length < 4) continue;
    out.push({ year: +y[1], champion: team(cells[1]), runnerUp: team(cells[3]) });
  }
  return out;
}
