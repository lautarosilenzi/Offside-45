// Lector de las páginas de RSSSF de cada edición (sacups/copa60.html … copa2024.html). Hay dos formatos de partido:
//   Fase de grupos:   "May  6: Rosario Central - Independiente         2-0"   (primero el local)
//   Series de ida y vuelta: "River Plate   Arg  Independiente   Arg   2-0  1-1  3-1"   (ida en cancha del primero)
// Se usan como segunda fuente: confirman cada resultado de la página por club y dicen quién fue local.
import { readFileSync } from "fs";
import { join } from "path";

export type EditionLine =
  | { kind: "match"; month: number; day: number; home: string; away: string; hg: number; ag: number; raw: string }
  // playoff: el desempate en cancha neutral, entre corchetes al final ("1-1  0-0  1-1  [2-1]").
  | { kind: "tie"; a: string; b: string; legs: [number, number][]; playoff?: [number, number]; raw: string };

const CACHE = join(process.cwd(), ".cache", "rsssf", "sacups");
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export function readEditionPage(file: string): EditionLine[] {
  const raw = readFileSync(join(CACHE, file));
  const utf8 = raw.toString("utf8");
  const text = (utf8.includes("�") ? raw.toString("latin1") : utf8).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  const out: EditionLine[] = [];
  let month = 0;
  for (const line of text.split(/\r?\n/)) {
    // "May  6: A - B  2-0" (a veces solo "   13: A - B", con el mes de la línea anterior).
    const m = line.match(/^\s*(?:([A-Z][a-z]{2})\s+)?(\d{1,2})\s*:\s*(.+?)\s+[-–\u0096]\s+(.+?)\s+(\d+)\s*-\s*(\d+)/);
    if (m && (m[1] ? MONTHS.includes(m[1].toLowerCase()) : month)) {
      if (m[1]) month = MONTHS.indexOf(m[1].toLowerCase()) + 1;
      out.push({ kind: "match", month, day: +m[2], home: m[3].trim(), away: m[4].trim(), hg: +m[5], ag: +m[6], raw: line.trim() });
      continue;
    }
    // Años con el día antes del mes: "29 Feb: Estudiantes - Independiente  1-1".
    const d = line.match(/^\s*(\d{1,2})\s+([A-Z][a-z]{2})\s*:\s*(.+?)\s+[-–\u0096]\s+(.+?)\s+(\d+)\s*-\s*(\d+)/);
    if (d && MONTHS.includes(d[2].toLowerCase())) {
      month = MONTHS.indexOf(d[2].toLowerCase()) + 1;
      out.push({ kind: "match", month, day: +d[1], home: d[3].trim(), away: d[4].trim(), hg: +d[5], ag: +d[6], raw: line.trim() });
      continue;
    }
    // Serie: dos equipos con su país (código de tres letras) y los resultados de cada partido.
    const t = line.match(/^\s*(.+?)(?:\s{2,}|(?<=\))\s?)([A-Z][a-z]{2})\s+(.+?)(?:\s{2,}|(?<=\))\s?)([A-Z][a-z]{2})\s+(.*)$/);
    if (t) {
      const po = t[5].match(/\[(\d+)\s*-\s*(\d+)\]/);
      const legs = [...t[5].replace(/\[[^\]]*\]/g, " ").matchAll(/(\d+)\s*-\s*(\d+)/g)].map((x) => [+x[1], +x[2]] as [number, number]);
      if (legs.length) out.push({ kind: "tie", a: t[1].trim(), b: t[3].trim(), legs, ...(po && { playoff: [+po[1], +po[2]] as [number, number] }), raw: line.trim() });
    }
  }
  return out;
}

// Forma comparable de un nombre: sin tildes, en minúsculas, sin puntuación ni sufijos societarios.
export const nameKey = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    // Abreviaturas de las páginas de RSSSF: "Univ. Católica", "Indep. Santa Fe", "Atl. Nacional", "Dep. Táchira".
    .replace(/\buniv\b\.?/g, "universidad ")
    .replace(/\b(indep|ind)\b\.?/g, "independiente ")
    .replace(/\batl\b\.?/g, "atletico ")
    .replace(/\bdep\b\.?/g, "deportivo ")
    .replace(/\bsta\b\.?/g, "santa ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(fc|sc|cf|ca|ec|ac|cd|club|de|del)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
