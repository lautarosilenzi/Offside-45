// Parser genérico de las páginas de temporada de RSSSF (tablesa/argYYYY.html).
// Devuelve secciones (torneos) con su tabla publicada y la lista de partidos tal como figura.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchRetry } from "./wiki";

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
  // Columnas de local y visitante (1967–): ganados, empatados y perdidos de local, y lo mismo de visitante.
  split?: number[];
};

export type RawMatch = {
  line: number;
  date: string; // tal cual la fuente, ej. "May 3, Sun"
  round?: string;
  // Copas: región del cuadro (Buenos Aires, Rosario, fase nacional).
  region?: string;
  // Páginas con varias ediciones (Copa Ibarguren): "Season 1913".
  edition?: string;
  // Copas por grupos (Asociación Amateurs 1924): "Group A" con sus fechas ("Round 1"...).
  group?: string;
  // Ligas en varias secciones (Nacionales 1971–1985): el título de la sección ("Quarterfinals", "Final").
  stageHint?: string;
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
    const res = await fetchRetry(`https://www.rsssf.org/tablesa/${file}`, { headers: { "User-Agent": "Mozilla/5.0" } });
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
    // Apóstrofo de Windows-1252 (0x92) leído como latin1, y el tipográfico: "Buenos Aires’ rounds".
    .replace(/[\u0092’]/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    // Letras con tilde escritas como entidad (1969: "V&eacute;lez").
    .replace(/&([aeiouAEIOU])acute;/g, (_, c: string) => c.normalize("NFD") + "́")
    .replace(/&([nN])tilde;/g, (_, c: string) => (c === "n" ? "ñ" : "Ñ"))
    .replace(/&([uU])uml;/g, (_, c: string) => (c === "u" ? "ü" : "Ü"))
    .normalize("NFC");

const MONTH = "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)";
const DATE_RE = new RegExp(String.raw`^\s*\[\s*(${MONTH}[a-z]*\.?\s*\d{1,2}[^\]]*)\]\s*(.*)$`, "i");
const DATE_PLAIN_RE = new RegExp(String.raw`^\s*(${MONTH}\s+\d{1,2}(?:,\s*\d{4})?)\s*[:.]?\s*$`, "i");
const ROUND_RE = /^\s*((?:Round|Fecha|Matchday)\s*\d+[^\[]*?)\s*:?\s*(?:\[(.+)\])?\s*:?\s*$/i;
const SCORE = String.raw`(\d+\s*[:\-]\s*\d+|wp\s*[:\-]\s*lp|lp\s*[:\-]\s*wp|lp\s*[:\-]\s*lp|w\s*[:\-]\s*l|l\s*[:\-]\s*w|d\s*[:\-]\s*d|wo|ann|anu|void|abandoned|abd|n/p|awd|:|-)`;
const MATCH_RE = new RegExp(
  // "Ferro Carril Oeste (BA)2-1 Racing Club" (1936): el resultado pegado al paréntesis del local.
  String.raw`^\s*(\S.*?)(?:\t+|\s{2,}|\s(?=\d+\s*[:\-]\s*\d)|(?<=\))(?=\d+\s*[:\-]\s*\d)|\s(?=(?:wp|lp)\s*[:\-]\s*(?:wp|lp)\s))\s*${SCORE}(?:\t+|\s+)(\S.*?)\s*$`,
  "i",
);
const TABLE_RE =
  /^\s*(\d+)\s*(?:\.\s*|\s{2,})(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+((?:\d+\s+){6})?(~?\s*\d+)\s*(?:[:\-]\s*|\s+)(~?\s*\d+)\s+(\d+)(.*)$/;

// Separa "Equipo  [nota]" o "Equipo      nota libre" en nombre y nota.
function splitAway(rest: string): { away: string; note: string; awarded?: string } {
  // Copas: "Eureka  2-1 lp-wp Boca Juniors" (se jugó y la liga lo dio vuelta) o "Boca Juniors 1-0 aet Rosario Central".
  const pre = rest.match(/^(wp\s*[-:]\s*lp|lp\s*[-:]\s*wp|aet|asdet)\s+(.*)$/i);
  if (pre) {
    const inner = splitAway(pre[2]);
    return /p/i.test(pre[1])
      ? { ...inner, awarded: pre[1].replace(/\s/g, "").replace("-", ":").toLowerCase() }
      : { ...inner, note: [pre[1], inner.note].filter(Boolean).join(", ") };
  }
  const bracket = rest.match(/^(.*?)\s*(\[.*)$/);
  if (bracket) {
    // "Los Andes<tab>(aet)<tab>[at Atlanta]" (1986): lo que va después del nombre, separado por tabuladores, es nota.
    const [name, ...extra] = bracket[1].split(/\t+|\s{2,}/);
    return { away: name.trim(), note: [...extra.map((x) => x.trim()).filter(Boolean), bracket[2].trim()].join(" ") };
  }
  const parts = rest.split(/\t+|\s{2,}/);
  // Copas viejas: "Argentino de Quilmes at Sportiva (19 Aug)" con un solo espacio antes de la nota.
  const inline = parts[0].match(/^(.*?)\s+(at\s.+|in\s(?:Rosario|Montevideo|La Plata)|\(\d{1,2}\s+[A-Z][a-z]{2}\))$/);
  if (inline) return { away: inline[1].trim(), note: [inline[2], ...parts.slice(1)].join(" ").trim() };
  return { away: parts[0].trim(), note: parts.slice(1).join(" ").trim() };
}

// "9 Sep" → "Sep 9" (formato que entiende el importador).
const dayFirst = (s: string) => s.replace(/^(\d{1,2})\s+([A-Z][a-z]{2})[a-z]*(?:\s+(\d{4}))?$/, (_, d, m, y) => `${m} ${d}${y ? `, ${y}` : ""}`);

// `cup`: en las copas una fase o región sin fecha propia no hereda la de la anterior (queda sin fecha).
export function parseSeason(source: string, opts: { cup?: boolean; headings?: RegExp[]; groups?: boolean } = {}): RawSection[] {
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
  const lines = text
    .replace(/<\/?[a-zA-Z!][^>]*>/g, "")
    // Títulos cortados en dos renglones (Asociación Amateurs 1926): "Group\nA", "First\nRound:".
    .replace(/^(\s*)(Group|Zona|First|Second|Third|Final)[ \t]*\r?\n[ \t]*([A-Z]|Norte|Sur|Round:?|Phase:?)[ \t]*$/gm, "$1$2 $3")
    .split(/\r?\n/)
    // Notas entre corchetes cortadas en dos renglones (1972: "[at Quilmes,\n   abandoned at 2-1 in 62']"): se unen.
    .reduce<string[]>((acc, l) => {
      const prev = acc[acc.length - 1];
      const open = prev !== undefined && /\S\s+\[[^\]]*$/.test(prev) && (prev.match(/\[/g) ?? []).length > (prev.match(/\]/g) ?? []).length;
      if (open && /^\s+[^\s[]/.test(l) && /\]\s*$/.test(l)) acc[acc.length - 1] = `${prev.trimEnd()} ${l.trim()}`;
      else acc.push(l);
      return acc;
    }, []);

  const sections: RawSection[] = [];
  let cur: RawSection = { heading: "", tables: [], matches: [], text: [] };
  let table: RawTableRow[] | null = null;
  let date = "";
  let round: string | undefined;
  // Una vez que empieza una sección que no son partidos del torneo (discrepancias, la B), se ignora hasta el próximo título.
  let ignoring = false;
  let region: string | undefined;
  let edition: string | undefined;
  let dateFromStage = false;
  let group: string | undefined;
  // Renglón del último partido leído (para pegarle la nota entre paréntesis del renglón de abajo).
  let lastMatchLine = -1;
  let lastScorerLine = -1;

  lines.forEach((raw, i) => {
    let line = raw.replace(/\s+$/, "").replace(/^(\s*\[[^\]]+\])\s+PK\s+PK$/, "$1");
    let trimmed = line.trim();
    // Los renglones vacíos no cortan la tabla (algunas páginas dejan uno entre cada fila);
    // la corta cualquier otra línea que no sea fila, separador o encabezado.
    if (!trimmed || trimmed === "&nbsp;") return;
    // "PK   PK" (1986): rótulos de la columna de penales, sobre el partido.
    if (/^PK\s+PK$/.test(trimmed)) return;
    // Algunas páginas (1920, 1923) marcan cada liga con una línea en negrita en lugar de un título.
    const leagueLine =
      /^(Asociaci[oó]n (Argentina|Amateurs?)( Argentina)? de Football|Federaci[oó]n Argentina de Football)$/i.test(trimmed) ||
      // 1970: cada torneo del año empieza con "Campeonato Metropolitano [Metropolitan Championship]", sin <h2>.
      /^(Campeonato|Torneo|Petit)[^[\]]{3,70}\[[A-Z][^\]]+\]\s*(\d{4})?$/.test(trimmed) ||
      // Títulos que da la configuración de la temporada (1971–: "Campeonato Metropolitano 1983.", "Group A.").
      !!opts.headings?.some((h) => h.test(trimmed));
    if ((headings.has(trimmed.replace(/\s+/g, " ")) || leagueLine) && !/^About this document$/i.test(trimmed)) {
      cur = { heading: trimmed.replace(/\s+/g, " "), tables: [], matches: [], text: [] };
      sections.push(cur);
      table = null;
      round = undefined;
      date = "";
      ignoring = false;
      region = undefined;
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
        goalsFor: Number(t[8].replace(/[~\s]/g, "")),
        goalsAgainst: Number(t[9].replace(/[~\s]/g, "")),
        points: +t[10],
        approx: /~/.test(t[8] + t[9]),
        tail: t[11].trim(),
        ...(t[7] && { split: t[7].trim().split(/\s+/).map(Number) }),
      });
      return;
    }
    // Filas de equipos empatados en puesto: sin número adelante ("    San Isidro   24 22 2 0 73 13 46").
    const tie = table
      ? line.match(/^\s{2,}([A-Za-zÀ-ÿ'"().&\- ]+?)\s{2,}(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(~?\s*\d+)\s*(?:[:\-]\s*|\s+)(~?\s*\d+)\s+(\d+)(.*)$/)
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
    const r = trimmed.replace(/^\.\s*/, "").match(ROUND_RE);
    if (r) {
      round = r[1].trim();
      // "Round 1: 31 May." / "Round 7: 3 Jan 1932." (Copa Jockey Club 1931).
      const rd = round.match(/^(.*?\d+):\s*(\d{1,2})\s+([A-Z][a-z]{2})[a-z]*(?:\s+(\d{4}))?\.?$/);
      if (rd) {
        round = rd[1];
        date = `${rd[3]} ${rd[2]}${rd[4] ? `, ${rd[4]}` : ""}`;
        return;
      }
      if (r[2]) date = r[2].trim();
      // En las copas una fecha sin día propio no hereda el de la anterior.
      else if (opts.cup) date = "";
      return;
    }
    // Copas: "Group A" abre un grupo con fechas propias; cualquier otra fase lo cierra.
    // También "Group "B":" (1925) y "Playoff Group "B":" (desempate dentro del grupo).
    // Y las zonas de la Copa Estímulo 1920 ("Zona Norte").
    // Y los grupos con nombre de la Copa Jockey Club 1931 ("Group North 1", "Group West").
    const grp = opts.cup || opts.groups
      ? trimmed.replace(/^\.\s*/, "").match(/^(Playoff\s+)?(?:Group\s+"?([A-Z])"?|Zona\s+(Norte|Sur)|Group\s+(North|South|East|West)(?:\s+(\d))?)[:.]?$/i)
      : null;
    // Grupos con el nombre de una liga (Beccar Varela 1933): Group "Liga Rosarina de Football" - Torneo Selección...:
    const named = opts.cup ? trimmed.match(/^Group\s+"([^"]+)"(?:\s*-.*)?:?$/) : null;
    if (named) {
      group = `Grupo ${named[1].replace(/ de Football$/, "")}`;
      round = undefined;
      date = "";
      cur.text.push(trimmed);
      return;
    }
    // Nacional 1973: "Inter Group" agrupa los partidos interzonales de cada fecha.
    if (opts.groups && /^Inter\s*Groups?:?$/i.test(trimmed)) {
      group = "Interzonal";
      date = "";
      cur.text.push(trimmed);
      return;
    }
    if (grp) {
      const POINTS: Record<string, string> = { north: "Norte", south: "Sur", east: "Este", west: "Oeste" };
      group = grp[2]
        ? `Grupo ${grp[2].toUpperCase()}`
        : grp[3]
          ? `Zona ${grp[3]}`
          : `Grupo ${POINTS[grp[4].toLowerCase()]}${grp[5] ? ` ${grp[5]}` : ""}`;
      // En las ligas con grupos por fecha (Nacional 1973: "13th Round" y después "Group A") la fecha sigue valiendo.
      round = grp[1] ? "Playoff" : opts.cup ? undefined : round;
      date = "";
      cur.text.push(trimmed);
      return;
    }
    // Subtítulos cortos de fase: "Playoff", "Second playoff", "Championship Final", "Group A"...
    // Secciones que no son partidos del torneo: discrepancias con resultados alternativos, o la tabla de la B.
    if (/^(Discrepancies:?|PRIMERA DIVISION B|Second level|2nd level)$/i.test(trimmed)) {
      ignoring = true;
      cur.text.push(trimmed);
      return;
    }
    // Listas de partidos que no fueron oficiales ("Originally official matches but played friendly:").
    if (/friendl/i.test(trimmed) && trimmed.endsWith(":") && trimmed.length < 80) {
      round = "friendly";
      cur.text.push(trimmed);
      return;
    }
    // Fechas escritas "9th Feb, 1930 at River Plate".
    const ord = trimmed.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Z][a-z]{2})[a-z]*,?\s+(\d{4})\b/);
    if (ord) {
      date = `${ord[2]} ${ord[1]}, ${ord[3]}`;
      cur.text.push(trimmed);
      return;
    }
    // Páginas con varias ediciones: "Season 1913:" o "Season 1914 [Dec 6]:".
    const ed = trimmed.match(/^Season (\d{4})\s*(?:\[(.+)\])?:?$/i);
    if (ed) {
      edition = ed[1];
      round = undefined;
      if (ed[2]) date = ed[2];
      cur.text.push(trimmed);
      return;
    }
    // Copas: la región del cuadro ("Buenos Aires rounds", "Rosarios rounds", "National rounds").
    // Algunas páginas escriben las fases entre puntos: ". 1/64 Final." o ". Playoff.".
    const head = trimmed.replace(/^\.\s*/, "").replace(/\.$/, "");
    const regionMatch =
      head.match(/^(Buenos Aires|Porteños?|Rosarios?|Montevideo|National|Interior|Provincias?|La Plata)(?:'s?)?\s*(?:rounds?|zone)?:?$/i) ??
      head.match(/^(Final Phase|Ruedas finales - Final rounds):?$/i) ??
      // Beccar Varela 1933: la ronda de consuelo y la ronda final son cuadros aparte.
      head.match(/^(Consuelo Round|Final Round):$/);
    if (regionMatch) {
      region = regionMatch[1];
      if (opts.cup) date = "";
      round = undefined;
      cur.text.push(trimmed);
      return;
    }
    const stage = head.match(
      /^([0-9/A-Za-zÀ-ÿ'. -]*(?:playoff|play-off|final|replay|group [a-z]|zone|half season|position|place|round|semi-?finals?|quarter-?finals?|\bleg\b|\d(?:st|nd|rd|th)\.?\s+match\b)[A-Za-zÀ-ÿ' -]*):?\s*(?:\[(.+)\]|(\d{1,2}\s+[A-Z][a-z]{2}(?:\s+\d{4})?)|([A-Z][a-z]{2}\s+\d{1,2}(?:,\s*\d{4})?))?\s*:?$/i,
    );
    if (stage && head.length < 60 && !/table|standings|positions\b/i.test(head)) {
      round = stage[1].trim();
      // Un desempate dentro de un grupo sigue siendo del grupo ("Group North 2" … "Playoff:").
      // Las fechas del grupo ("1st. round:") tampoco lo cierran.
      if (!(group && /^(playoff|\d+(?:st|nd|rd|th)\.? round|round \d+)/i.test(round))) group = undefined;
      const sd = stage[2] ?? (stage[3] && dayFirst(stage[3])) ?? stage[4];
      // Una fecha puesta en el título de una fase vale solo para esa fase.
      if (sd) date = sd.trim();
      else if (dateFromStage || opts.cup) date = "";
      dateFromStage = !!sd;
      cur.text.push(trimmed);
      return;
    }
    // "17.3.1935" (1935): día, mes y año con puntos.
    const dotted = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dotted) {
      const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      date = `${MON[Number(dotted[2]) - 1]} ${Number(dotted[1])}, ${dotted[3]}`;
      return;
    }
    // "[17 Jul, Sun]": día antes del mes.
    const dm = trimmed.match(/^\[\s*(\d{1,2})\s+([A-Z][a-z]{2})[a-z]*,?[^\]\d]*(\d{4})?[^\]]*\]$/);
    if (dm) {
      date = `${dm[2]} ${dm[1]}${dm[3] ? `, ${dm[3]}` : ""}`;
      return;
    }
    const d = trimmed.match(DATE_RE) ?? trimmed.match(DATE_PLAIN_RE);
    if (d && !d[2]) {
      date = d[1].trim();
      return;
    }
    // 1980–: la nota del partido va sola en el renglón de abajo, entre paréntesis: " (Suspended at 10' 0-0 and continued next day)".
    const paren = trimmed.match(/^\((.+)\)\.?$/);
    if (paren && cur.matches.length && lastMatchLine >= 0 && lines.slice(lastMatchLine + 1, i).every((l) => !l.trim())) {
      const last = cur.matches[cur.matches.length - 1];
      // "(aet 2-4 on PK)" (1985): alargue y penales.
      const pk = paren[1].match(/^(aet\s+)?(\d+)-(\d+) on PK$/i);
      const txt = pk ? `${pk[1] ? "[aet] " : ""}[pen ${pk[2]}:${pk[3]}]` : `[${paren[1].replace(/\.\s*$/, "")}]`;
      last.note = [last.note, txt].filter(Boolean).join(" ");
      lastMatchLine = i;
      return;
    }
    // Línea de goleadores: "  [Pérez, Gómez; López]"
    // Con los goles en columnas (1988/89–), la del visitante va muy corrida a la derecha y puede ir sola o en un
    // segundo renglón debajo de la del local: se guarda como "local; visitante".
    // "  [Acuña]      (aet)" (1990/91): el alargue al final del renglón de goleadores.
    if (/^\s+\[.*\]\s+\(aet\)$/i.test(line) && cur.matches.length) {
      const last = cur.matches[cur.matches.length - 1];
      last.note = [last.note, "[aet]"].filter(Boolean).join(" ");
      line = line.replace(/\s+\(aet\)$/i, "");
      trimmed = line.trim();
    }
    // 1995/96: a veces el renglón de goleadores va sin sangría ("[21' Biaggio - 42' Falaschi]"); el minuto lo delata.
    if (/^\s*\[.*\]\s*$/.test(line) && cur.matches.length && (/^\s/.test(line) || /^\[\d+'/.test(line))) {
      const last = cur.matches[cur.matches.length - 1];
      // 1989/90: "[Later, both teams lost the points (0-1)]" en el renglón de abajo es parte de la nota del partido.
      // 1991/92: "[River won the points (0-1)]".
      if (/^\[(later\b|suspended in \d|[^\]]+ won the points\b)/i.test(trimmed)) {
        last.note = [last.note, trimmed].filter(Boolean).join(" ");
        return;
      }
      const indent = line.match(/^\s*/)![0].replace(/\t/g, "        ").length;
      let txt = trimmed.slice(1, -1);
      // "[Pizzi]   (aet)   [Alfaro Moreno(2), Villarreal]" (1989/90): el alargue va entre los goleadores.
      if (/\]\s*\(aet\)\s*\[/i.test(txt)) {
        txt = txt.replace(/\]\s*\(aet\)\s*\[/i, "] [");
        last.note = [last.note, "[aet]"].filter(Boolean).join(" ");
      }
      if (lastScorerLine >= 0 && lines.slice(lastScorerLine + 1, i).every((l) => !l.trim()) && !/^(played at|at |suspended|abandoned|finished)/i.test(txt) && last.scorers !== undefined && !last.scorers.includes(";") && !/\]\s*\[/.test(last.scorers)) last.scorers += `; ${txt}`;
      else last.scorers = indent >= 20 && !/^(played at|at |suspended|abandoned|finished)/i.test(txt) ? `; ${txt}` : txt;
      lastScorerLine = i;
      return;
    }
    // Marcas pegadas al resultado (Copa Jockey Club 1931): "0-4+" anulado; "2-1*", "3-0&" remiten a una nota al pie.
    const marked = trimmed.match(/^(.*?\S)(\s+)(\d+-\d+|w-l|l-w)([+*&])(\s+.*)$/);
    let normalized = marked ? `${marked[1]}${marked[2]}${marked[4] === "+" ? "ann" : marked[3]}${marked[5]}` : trimmed;
    // "Buenos Aires (Monumental):  Racing Club 5-0 Tigre" (Beccar Varela 1932): el lugar va antes del partido.
    // "Independiente  wp 1:1 lp Racing Club [abandoned at 1:1…]" (1936): resuelto por escritorio con el parcial en la nota.
    // Desde los años 50 el parcial no siempre está en la nota ("lp 1:1 wp … [abandoned at 66m, awarded on Nov 26]"):
    // se guarda como "played X:Y" al final.
    // Errata "wp-1p" (1971) y penales pegados al resultado: "Independiente [6]2-2[7] San Lorenzo" → nota "pen 6:7".
    normalized = normalized.replace(/\b(wp|lp)-1p\b/i, "$1-lp").replace(/\b1p-(wp)\b/i, "lp-$1");
    // "San Lorenzo (MdP)  1-2 awd 1-0  Boca Juniors" (1980): el de la cancha y el que dio la liga.
    const awdPair = normalized.match(/\s(\d+)\s*-\s*(\d+),?\s+awd\s+(\d+)\s*-\s*(\d+)(?=\s)/i);
    if (awdPair) normalized = `${normalized.replace(awdPair[0], ` ${awdPair[1]}-${awdPair[2]} `)}  [later awarded ${awdPair[3]}-${awdPair[4]}]`;
    // "Racing (C)   0-0 aet PK 5-3  Talleres (C)" (1983): alargue y penales entre el resultado y el visitante.
    const aetPk = normalized.match(/\s(\d+-\d+)\s+aet\s+PK\s+(\d+)-(\d+)\s/i);
    if (aetPk) normalized = `${normalized.replace(aetPk[0], ` ${aetPk[1]}   `)}  [aet] [pen ${aetPk[2]}:${aetPk[3]}]`;
    const pens = normalized.match(/\s[[(](\d+)[\])]\s*(\d+\s*[-:]\s*\d+)\s*[[(](\d+)[\])](?=\s|\p{L})/u);
    if (pens) normalized = `${normalized.replace(pens[0], ` ${pens[2]}   `)}  [pen ${pens[1]}:${pens[3]}]`;
    const wpScore = normalized.match(/\s(wp|lp)\s+(\d+)\s*:\s*(\d+)\s+(wp|lp)\s/);
    if (wpScore) normalized = `${normalized.replace(wpScore[0], ` ${wpScore[1]}:${wpScore[4]} `)}  [played ${wpScore[2]}:${wpScore[3]}]`;
    const place = normalized.match(/^([A-ZÁÉÍÓÚ][^:\d]{2,40}):\s+(\S.*\s\d+-\d+\s.*)$/);
    if (place) normalized = `${place[2]}  [at ${place[1]}]`;
    const annulledScore = marked?.[4] === "+" ? marked[3].replace("-", ":") : undefined;
    const m = normalized.match(MATCH_RE);
    // "11.Chacarita Juniors   -    -   28   28.00": fila de la tabla de promedios, no un partido.
    if (m && !/^(No\.|Table|Note|Round)/i.test(m[1]) && !/^\d+\.\s?\S/.test(m[1].trim())) {
      const { away, note, awarded } = splitAway(m[3]);
      if (away && !/^\d/.test(away)) {
        // Fecha propia del partido en la nota: "at Rosario  (27 May)".
        const own = note.match(/\((\d{1,2})\s+([A-Z][a-z]{2})(?:\s+(\d{4}))?\)/);
        lastMatchLine = i;
        cur.matches.push({
          line: i,
          date: own ? `${own[2]} ${own[1]}${own[3] ? `, ${own[3]}` : ""}` : date,
          round: ignoring ? "friendly" : round,
          ...(group && { group }),
          region,
          edition,
          home: m[1].trim(),
          away,
          // "2-1 lp-wp": queda como resultado por escritorio con el de la cancha en la nota ("originally 2:1").
          score: awarded ?? m[2].replace(/\s/g, ""),
          note: [
            awarded ? `originally ${m[2].replace(/\s/g, "").replace("-", ":")}` : "",
            annulledScore ? `${annulledScore} annulled` : "",
            own ? note.replace(own[0], "").replace(/\s+/g, " ").trim() : note,
          ]
            .filter(Boolean)
            .join(", "),
        });
        return;
      }
    }
    cur.text.push(trimmed);
  });

  return sections.length ? sections : [cur];
}
