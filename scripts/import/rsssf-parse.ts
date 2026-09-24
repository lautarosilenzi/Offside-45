// Parser genérico de las páginas de temporada de RSSSF (tablesa/argYYYY.html).
// Devuelve secciones (torneos) con su tabla publicada y la lista de partidos tal como figura.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type RawTableRow = {
  pos: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  approx: boolean;
  tail: string;
};

export type RawMatch = {
  line: number;
  date: string; // tal cual la fuente, ej. "May 3, Sun"
  round?: string;
  home: string;
  away: string;
  score: string; // "3:1", "wp:lp", "ann", "d:d", ...
  note: string;
  scorers?: string;
};

export type RawSection = { heading: string; tables: RawTableRow[][]; matches: RawMatch[]; text: string[] };

const CACHE = join(process.cwd(), ".cache", "rsssf");

export async function fetchPage(file: string): Promise<string> {
  mkdirSync(CACHE, { recursive: true });
  const path = join(CACHE, file);
  if (!existsSync(path)) {
    const res = await fetch(`https://www.rsssf.org/tablesa/${file}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
    await new Promise((r) => setTimeout(r, 500));
  }
  const buf = readFileSync(path);
  const utf8 = buf.toString("utf8");
  return utf8.includes("�") ? buf.toString("latin1") : utf8;
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const MONTH = "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)";
const DATE_RE = new RegExp(String.raw`^\s*\[\s*(${MONTH}[a-z]*\.?\s*\d{1,2}[^\]]*)\]\s*(.*)$`, "i");
const DATE_PLAIN_RE = new RegExp(String.raw`^\s*(${MONTH}\s+\d{1,2}(?:,\s*\d{4})?)\s*:?\s*$`, "i");
const ROUND_RE = /^\s*((?:Round|Fecha|Matchday)\s*\d+[^\[]*?)\s*:?\s*(?:\[(.+)\])?\s*:?\s*$/i;
const SCORE = String.raw`(\d+\s*[:\-]\s*\d+|wp\s*[:\-]\s*lp|lp\s*[:\-]\s*wp|lp\s*[:\-]\s*lp|w\s*[:\-]\s*l|l\s*[:\-]\s*w|d\s*[:\-]\s*d|wo|ann|void|abd|n/p|awd|:|-)`;
const MATCH_RE = new RegExp(
  String.raw`^\s*(\S.*?)(?:\t+|\s{2,}|\s(?=\d+\s*[:\-]\s*\d)|\s(?=(?:wp|lp)\s*[:\-]\s*(?:wp|lp)\s))\s*${SCORE}(?:\t+|\s+)(\S.*?)\s*$`,
  "i",
);
const TABLE_RE =
  /^\s*(\d+)\s*(?:\.\s*|\s{2,})(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(?:(?:\d+\s+){6})?(~?\s*\d+)\s*[:\-]?\s+(~?\s*\d+)\s+(\d+)(.*)$/;

// Separa "Equipo  [nota]" o "Equipo      nota libre" en nombre y nota.
function splitAway(rest: string): { away: string; note: string } {
  const bracket = rest.match(/^(.*?)\s*(\[.*)$/);
  if (bracket) return { away: bracket[1].trim(), note: bracket[2].trim() };
  const parts = rest.split(/\t+|\s{2,}/);
  return { away: parts[0].trim(), note: parts.slice(1).join(" ").trim() };
}

export function parseSeason(source: string): RawSection[] {
  // Los títulos de sección a veces ocupan varias líneas: se aplanan a una sola.
  const html = source.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, n, attrs, c) => `\n<h${n}${attrs}>${c.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}</h${n}>\n`,
  );
  // Aseguramos saltos de línea en encabezados y bloques, y sacamos solo etiquetas reales.
  const text = decode(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(h[1-6]|p|table|tr|div)[^>]*>/gi, "\n")
      // <pre> no agrega saltos: algunas páginas (1925) abren un <pre> por cada fila de la tabla.
      .replace(/<\/?pre[^>]*>/gi, "")
      .replace(/<(h[1-6])[^>]*>/gi, "\n"),
  );
  const headings = new Set(
    [...html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi)].map((m) => decode(m[1].replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim()),
  );
  const lines = text.replace(/<\/?[a-zA-Z!][^>]*>/g, "").split(/\r?\n/);

  const sections: RawSection[] = [];
  let cur: RawSection = { heading: "", tables: [], matches: [], text: [] };
  let table: RawTableRow[] | null = null;
  let date = "";
  let round: string | undefined;

  lines.forEach((raw, i) => {
    const line = raw.replace(/\s+$/, "");
    const trimmed = line.trim();
    // Los renglones vacíos no cortan la tabla (algunas páginas dejan uno entre cada fila);
    // la corta cualquier otra línea que no sea fila, separador o encabezado.
    if (!trimmed || trimmed === "&nbsp;") return;
    // Algunas páginas (1920, 1923) marcan cada liga con una línea en negrita en lugar de un título.
    const leagueLine = /^(Asociaci[oó]n (Argentina|Amateurs?)( Argentina)? de Football|Federaci[oó]n Argentina de Football)$/i.test(trimmed);
    if ((headings.has(trimmed.replace(/\s+/g, " ")) || leagueLine) && !/^About this document$/i.test(trimmed)) {
      cur = { heading: trimmed.replace(/\s+/g, " "), tables: [], matches: [], text: [] };
      sections.push(cur);
      table = null;
      round = undefined;
      date = "";
      return;
    }
    const t = line.match(TABLE_RE);
    const looksLikeMatch = line.replace(/^\s*\d+\s*\.\s*/, "").match(MATCH_RE);
    if (t && !(looksLikeMatch && !/^\d/.test(looksLikeMatch[3]))) {
      if (!table) {
        // Las líneas separadoras cortan la tabla: si la posición sigue a la última fila, es la misma tabla.
        const last = cur.tables[cur.tables.length - 1];
        const pos = Number(t[1]);
        // Puestos compartidos ("1., 1., 3.") dejan huecos en la numeración.
        const lastPos = last?.[last.length - 1].pos ?? -1;
        if (last && pos >= lastPos && pos <= lastPos + last.length) table = last;
        else {
          table = [];
          cur.tables.push(table);
        }
      }
      table.push({
        pos: Number(t[1]),
        name: t[2].trim(),
        played: +t[3],
        won: +t[4],
        drawn: +t[5],
        lost: +t[6],
        goalsFor: Number(t[7].replace(/[~\s]/g, "")),
        goalsAgainst: Number(t[8].replace(/[~\s]/g, "")),
        points: +t[9],
        approx: /~/.test(t[7] + t[8]),
        tail: t[10].trim(),
      });
      return;
    }
    // Filas de equipos empatados en puesto: sin número adelante ("    San Isidro   24 22 2 0 73 13 46").
    const tie = table
      ? line.match(/^\s{2,}([A-Za-zÀ-ÿ'"().&\- ]+?)\s{2,}(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(~?\s*\d+)\s*[:\-]?\s+(~?\s*\d+)\s+(\d+)(.*)$/)
      : null;
    if (tie && table) {
      const t0 = table as RawTableRow[];
      t0.push({
        pos: t0[t0.length - 1].pos,
        name: tie[1].trim(),
        played: +tie[2],
        won: +tie[3],
        drawn: +tie[4],
        lost: +tie[5],
        goalsFor: Number(tie[6].replace(/[~\s]/g, "")),
        goalsAgainst: Number(tie[7].replace(/[~\s]/g, "")),
        points: +tie[8],
        approx: /~/.test(tie[6] + tie[7]),
        tail: tie[9].trim(),
      });
      return;
    }
    if (!/^[-\s=]+$/.test(trimmed) && !/^(No\.?\s*Team|#\.|Table:?)/i.test(trimmed)) table = null;
    const r = trimmed.match(ROUND_RE);
    if (r) {
      round = r[1].trim();
      if (r[2]) date = r[2].trim();
      return;
    }
    // Subtítulos cortos de fase: "Playoff", "Second playoff", "Championship Final", "Group A"...
    // Listas de partidos que no fueron oficiales ("Originally official matches but played friendly:").
    if (/friendl/i.test(trimmed) && trimmed.endsWith(":") && trimmed.length < 80) {
      round = "friendly";
      cur.text.push(trimmed);
      return;
    }
    const stage = trimmed.match(/^([A-Za-z ]*(?:playoff|play-off|final|replay|group [a-z]|zone|half season)[A-Za-z ]*):?\s*(?:\[(.+)\])?\s*:?$/i);
    if (stage && trimmed.length < 60 && !/table|standings|position/i.test(trimmed)) {
      round = stage[1].trim();
      if (stage[2]) date = stage[2].trim();
      cur.text.push(trimmed);
      return;
    }
    const d = trimmed.match(DATE_RE) ?? trimmed.match(DATE_PLAIN_RE);
    if (d && !d[2]) {
      date = d[1].trim();
      return;
    }
    // Línea de goleadores: "  [Pérez, Gómez; López]"
    if (/^\s*\[.*\]\s*$/.test(line) && cur.matches.length && /^\s/.test(line)) {
      cur.matches[cur.matches.length - 1].scorers = trimmed.slice(1, -1);
      return;
    }
    const m = trimmed.match(MATCH_RE);
    if (m && !/^(No\.|Table|Note|Round)/i.test(m[1])) {
      const { away, note } = splitAway(m[3]);
      if (away && !/^\d/.test(away)) {
        cur.matches.push({ line: i, date, round, home: m[1].trim(), away, score: m[2].replace(/\s/g, ""), note });
        return;
      }
    }
    cur.text.push(trimmed);
  });

  return sections.length ? sections : [cur];
}
