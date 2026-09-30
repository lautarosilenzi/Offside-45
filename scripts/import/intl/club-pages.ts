// Lector de las páginas de RSSSF "Argentinian Clubs in …" (Copa Libertadores, Sudamericana, Supercopa, Conmebol,
// Mercosur): cada club argentino tiene su bloque con todos sus partidos, uno por línea:
//   " 12. Group Stage	21.02.2012	Sarandí		Arsenal		3-0	Zamora			[Ortiz - Carbonero]"
// El resultado está siempre del lado del club argentino (no dice quién fue local: lo da la ciudad). Las líneas
// de guiones separan las participaciones (una por edición). Los penales van pegados al resultado: "[5]0-0[4]".
import { readFileSync } from "fs";
import { join } from "path";

export type ClubPageMatch = {
  club: string; // nombre del club argentino, como encabeza su bloque
  no: number; // número de partido dentro del bloque
  participation: number; // participación del club (0, 1, 2…): cambia en cada línea de guiones
  stage: string;
  date: string; // yyyy-mm-dd
  place: string;
  team: string; // el club argentino, tal como figura en la línea
  goals: number;
  oppGoals: number;
  pens?: [number, number]; // penales, del lado del club argentino
  // Resuelto por escritorio: a quién se le dio el partido. goals/oppGoals son entonces el resultado de la cancha.
  awarded?: "club" | "opp";
  // Resultado que dio la liga ("3-0*"), del lado del club argentino.
  awardedScore?: [number, number];
  // Por escritorio sin el resultado de la cancha en la página.
  fieldUnknown?: boolean;
  opp: string;
  scorers?: string;
  line: string;
};

// rivals: los rivales de cada club con su país, de las tablas "By rivals" (el mismo nombre puede repetirse con otro país).
export type ClubPage = { matches: ClubPageMatch[]; rivals: { club: string; name: string; country: string }[]; problems: string[] };

const CACHE = join(process.cwd(), ".cache", "rsssf", "sacups");

export function readClubPage(file: string): ClubPage {
  const raw = readFileSync(join(CACHE, file));
  const utf8 = raw.toString("utf8");
  const html = utf8.includes("�") ? raw.toString("latin1") : utf8;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, (e) => ({ "&aacute;": "á", "&eacute;": "é", "&iacute;": "í", "&oacute;": "ó", "&uacute;": "ú", "&ntilde;": "ñ" })[e] ?? e);
  const lines = text.split(/\r?\n/);
  const matches: ClubPageMatch[] = [];
  const rivals: ClubPage["rivals"] = [];
  const problems: string[] = [];
  let club: string | null = null;
  let participation = 0;
  let inRivals = false;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Encabezado del bloque: el nombre del club en la línea (o las dos líneas) antes de "N participations".
    if (/^\s*\d+ participations?\s*:/i.test(l)) {
      const prev = lines[i - 1].trim();
      club = (/^\(/.test(prev) ? `${lines[i - 2].trim()} ${prev}` : prev).replace(/\s+/g, " ");
      participation = 0;
      inRivals = false;
      continue;
    }
    if (/^By rivals/i.test(l)) {
      inRivals = true;
      continue;
    }
    if (/^By countries/i.test(l)) inRivals = false;
    if (inRivals) {
      const r = l.match(/^\s*(.+?)\s*[[(]([A-Za-z]{3})\]\s+\d/);
      if (r && club) rivals.push({ club, name: r[1].trim(), country: r[2].slice(0, 1).toUpperCase() + r[2].slice(1).toLowerCase() });
      continue;
    }
    if (!club) continue;
    if (/^-{20,}/.test(l.trim())) {
      participation++;
      continue;
    }
    const head = l.match(/^\s*(\d+)\.\s*(.*?)\s*(\d\d)\.(\d\d)\.(\d{4})\s*(.*)$/);
    if (!head) continue;
    const [, no, stage, dd, mm, yyyy, rest] = head;
    // Por escritorio: "wp-lp" (dado ganado) con el resultado de la cancha entre corchetes al final, o "3-0*" con
    // "[* awarded][0-0]".
    const wp = rest.match(/\b(wp|lp)-(wp|lp)\b/);
    const starred = rest.match(/(\d+)-(\d+)\*/);
    const sc: (string | undefined)[] & { index?: number } | null = wp
      ? Object.assign([wp[0], undefined, "0", "0", undefined], { index: wp.index })
      : rest.match(/(?:\[(\d+)\]\s*)?(\d+)\s*-\s*(\d+)(?:\s*\[(\d+)\])?/);
    if (!sc) {
      problems.push(`${club} ${no}: sin resultado: ${l.trim()}`);
      continue;
    }
    const before = rest.slice(0, sc.index).trim();
    const after = rest.slice(sc.index! + sc[0]!.length).replace(/^\*/, "");
    // Antes del resultado: ciudad y club, separados por tabs o por varios espacios.
    const parts = before.split(/\t+|\s{2,}/).map((s) => s.trim()).filter(Boolean);
    const team = parts.pop() ?? "";
    const place = parts.join(" ");
    // "River Plate [Uru]": el país del rival pegado al nombre; queda como "River Plate (Uru.)".
    const tag = after.match(/^[^[]*?\[(Uru|Par|Bra|Chi|Col|Ecu|Per|Bol|Ven|Mex)\]/i);
    const rest2 = tag ? after.replace(tag[0], tag[0].replace(/\s*\[\w+\]$/, "")) : after;
    const scorers = wp || starred ? undefined : rest2.match(/\[(.*)\]/)?.[1]?.trim();
    const name = rest2.replace(/\[.*$/, "").split(/\t+|\s{2,}/).map((s) => s.trim()).filter(Boolean)[0] ?? "";
    const opp = tag && name ? `${name} (${tag[1]}.)` : name;
    let awarded: "club" | "opp" | undefined;
    let fieldUnknown = false;
    if (wp || starred) {
      awarded = wp ? (wp[1] === "wp" ? "club" : "opp") : +starred![1] > +starred![2] ? "club" : "opp";
      const field = after.match(/\[(\d+)-(\d+)\]\s*$/);
      // Sin el resultado de la cancha (ej. suspendido): queda 0-0 y el importador exige un arreglo con el resultado.
      if (!field) fieldUnknown = true;
      else [sc[2], sc[3]] = [field[1], field[2]];
    }
    if (!place || !team || !opp) problems.push(`${club} ${no}: línea rara: ${l.trim()}`);
    matches.push({
      club,
      no: +no,
      participation,
      stage: stage.trim(),
      date: `${yyyy}-${mm}-${dd}`,
      place,
      team,
      goals: +sc[2]!,
      oppGoals: +sc[3]!,
      ...(sc[1] !== undefined && sc[4] !== undefined && { pens: [+sc[1], +sc[4]] as [number, number] }),
      ...(awarded && { awarded }),
      ...(fieldUnknown && { fieldUnknown }),
      ...(starred && { awardedScore: [+starred[1], +starred[2]] as [number, number] }),
      opp,
      ...(scorers && { scorers }),
      line: l.trim(),
    });
  }
  return { matches, rivals, problems };
}
