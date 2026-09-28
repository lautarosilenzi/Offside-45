// Importa temporadas de RSSSF, las verifica y escribe lib/data/seasons/generated/<slug>.json.
//   npx tsx scripts/import/build.ts 1897 1898   (o sin argumentos para todas las configuradas)
// Frena con error si la tabla calculada no coincide con la publicada o si hay nombres sin identificar.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Match, Season, TableRow } from "../../lib/types";
import { computeTable, rawTableDiffs, verifySeason } from "../../lib/seasons";
import { getTeam } from "../../lib/teams";
import { winnerOf } from "../../lib/result";
import { resolveName, setLocalAliases } from "./aliases";
import { TOURNAMENTS, type TournamentConfig } from "./config";
import { CUP_TOURNAMENTS } from "./config-cups";
import { fetchPage, parseSeason, type RawMatch, type RawSection } from "./rsssf-parse";
import { compareWithWikipedia } from "./wiki";

const OUT = join(process.cwd(), "lib", "data", "seasons", "generated");

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, set: 9, oct: 10, nov: 11, dec: 12,
  // Algunas páginas (1944) usan meses en castellano.
  ene: 1, abr: 4, ago: 8, dic: 12,
};

// "May 3, Sun" / "Jan 23, 1927 Sun" / "August 01, 1920" → ISO. Los meses que "vuelven atrás" pasan al año siguiente.
function parseDate(raw: string, year: number, prevMonth: number): { iso: string; month: number } | null {
  const m = raw.match(/([A-Za-z]{3})[a-z]*\.?\s*(\d{1,2})\b/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return null;
  // El año puede venir en cualquier parte: "Jan 23, 1927 Sun" o "Apr 5, Sun 1931".
  const explicit = raw.match(/\b(18|19)\d{2}\b/);
  let y = explicit ? Number(explicit[0]) : year;
  if (!explicit && prevMonth >= 9 && month <= 3) y = year + 1;
  return { iso: `${y}-${String(month).padStart(2, "0")}-${String(Number(m[2])).padStart(2, "0")}`, month };
}

// Goleadores: "5' and 27' González", "Trotta (p)", "Zanetti (o.g)", "Chilavert (3, 3 pen)" → en castellano.
const scorersEs = (s: string) =>
  s
    .replace(/\s+and\s+/g, " y ")
    // Primero las formas entre paréntesis ("(2, 1 pen)"), después las pegadas al minuto ("80pen", "45+pen", "88m og").
    .replace(/\((\d+), (\d+) pens?\)/gi, (_, n: string, p: string) => `(${n}, ${p === "1" ? "uno" : p} de penal)`)
    .replace(/\((\d+), (\d+) o\.g\.?\)/gi, (_, n: string, p: string) => `(${n}, ${p === "1" ? "uno" : p} en contra)`)
    .replace(/\((?:p|pen)\.?\)/gi, "(de penal)")
    .replace(/\(o\.\s?g\.?\)/gi, "(en contra)")
    .replace(/(\d+m?\+?)\s?pen\b/g, "$1 (de penal)") // 2005: "Pisculichi 80pen", "Galván 45+pen"
    .replace(/(\d+m?\+?)\s?og\b/g, "$1 (en contra)"); // 2007: "Sanguinetti 82og", 1960s: "Rossi 88m og"

// Frases de RSSSF que aparecen una sola vez (texto exacto → traducción).
const NOTE_ES: [string, string][] = [
  ["abandoned at 60' due to threats to the referee made by a Barracas Central player", "Suspendido a los 60 minutos por amenazas al árbitro de un jugador de Barracas Central."],
  ["abandoned at 0-0 in the second half as the referee was attacked by home player", "En realidad se empezó a jugar: se suspendió 0-0 en el segundo tiempo porque un jugador local agredió al árbitro."],
  ["suspended at 1-1, Atlanta was awarded the points", "En realidad se empezó a jugar: se suspendió 1-1 y la liga le dio los puntos a Atlanta."],
  ["Goles: Sportivo Almagro could not field a complete team.", "Sportivo Almagro no pudo formar un equipo completo."],
  ["Del Plata abandoned at 75' in protest of the penalty kick that determined the 3-2.", "Del Plata abandonó la cancha a los 75 minutos en protesta por el penal del 3-2."],
];

// "Dec 26" o "26 Dec" → "26/12".
const esDate = (s: string) =>
  s
    .replace(/^([A-Za-z]{3})[a-z]*\.? ?(\d{1,2})$/, (x, mo: string, d: string) => (MONTHS[mo.toLowerCase()] ? `${Number(d)}/${MONTHS[mo.toLowerCase()]}` : x))
    .replace(/^(\d{1,2}) ([A-Za-z]{3})[a-z]*$/, (x, d: string, mo: string) => (MONTHS[mo.toLowerCase()] ? `${Number(d)}/${MONTHS[mo.toLowerCase()]}` : x));

// Traduce las notas habituales de RSSSF. Lo que no se reconoce queda citado en inglés para revisión.
export function translateNote(
  note: string,
  year: number,
): {
  venue?: string;
  text: string[];
  annulled: boolean;
  unknown: string[];
  continuedOn?: string;
  suspended?: boolean;
  replayed?: boolean;
  lostPointsBy?: string;
  wonPointsBy?: string;
  awardedByLeague?: boolean;
  advancedBy?: string;
  awardedScore?: [number, number];
  bothLost?: boolean;
  lostScore?: [number, number];
} {
  const out = {
    venue: undefined as string | undefined,
    text: [] as string[],
    annulled: false,
    unknown: [] as string[],
    continuedOn: undefined as string | undefined,
    suspended: false,
    replayed: false,
    lostPointsBy: undefined as string | undefined,
    wonPointsBy: undefined as string | undefined,
    // La liga dio el partido por escritorio con el resultado que figura en la fila (1975–).
    awardedByLeague: false,
    // Serie de ida y vuelta definida por goles de visitante (1977): quién pasó.
    advancedBy: undefined as string | undefined,
    // "Later, awarded 0-1" (1978): el resultado que fijó la liga, distinto del de la cancha.
    awardedScore: undefined as [number, number] | undefined,
    // "later both teams lost the points (0-1)" (1988/89): partido perdido para los dos.
    bothLost: false,
    // "later Racing Club lost the points (0-1)": el resultado que fijó la liga, visto desde el que perdió.
    lostScore: undefined as [number, number] | undefined,
  };
  const parts = note
    .replace(/^\[|\]$/g, "")
    .replace(/^\{/, "") // "{at Vélez Sarsfield]": errata de la fuente (1998)
    .replace(/\bSocre\b/g, "Score") // errata de la fuente (2003)
    .replace(/,\s*((?:behind )?closed doors)/gi, "; $1") // 2009: "remaining 29', closed doors"
    .replace(/\.\s*(Score allowed to stand|Awarded \d+-\d+)/gi, "; $1") // 2001/02: dos datos en una oración
    .replace(/\babandonded\b/gi, "abandoned") // errata de la fuente (1950)
    .replace(/\babandoned al\b/gi, "abandoned at") // errata de la fuente (1953)
    .replace(/\s+\|\s+/g, "; ")
    .replace(/\baet( \d+m?)?,\s*/gi, "aet$1; ")
    .replace(/\bwalk ?over,\s*/gi, "walkover; ")
    // "0:4 annulled, Sportivo Balcarce" y "Estudiantes (C) (aet)": el dato y la cancha por separado.
    .replace(/(\d+:\d+ annulled),(?!\s*replayed)\s*/gi, "$1; ")
    .replace(/(?:^|\s+)\((aet|[A-Z][^()]* withdrew at [^()]*|[A-Z]{1,3} forfeited on [^()]*)\)\s*/g, "; $1; ")
    // Jockey Club 1914–1918: "neutral, originally 1:0, awarded on 23 Apr, 150m, abandoned at HT, 3:0 in Annual Report, <cancha>".
    .replace(/(?<=^|[,;]\s*)(neutral|originally \d+:\d+|awarded (?:on )?(?:\d{1,2} [A-Z][a-z]{2}|[A-Z][a-z]{2} ?\d{1,2})|lasted \d+m?|\d+m|abandoned at HT|abandoned at \d+:\d+ in \d+m|\d+:\d+ in Annual Report)\s*,\s*/g, "$1; ")
    // "abandoned at 52m, score stood on Dec 26, Independiente, Avellaneda": cada dato por separado, y la cancha al final.
    .replace(/\b(abandoned at \d+m?|abd at \d+:\d+ in \d+m?|score stood on [A-Z][a-z]{2} \d{1,2}|disen?r+olled on [A-Z][a-z]{2} \d{1,2}),\s*/gi, "$1; ")
    // "not continued, Banfield won points" → dos partes; "on Aug 19, Sportsman won points" → sin la fecha.
    .replace(/,\s*([^,\]]+ (?:won|lost) (?:the )?points)/gi, "; $1")
    .replace(/\bon [A-Z][a-z]{2} \d{1,2}(?:, \d{4})?,\s*(?=[^,\]]+ (?:won|lost) (?:the )?points)/g, "")
    // 1949: "remaining 32m on Sep 14, Independiente, Avellaneda": el dato y la cancha van por separado.
    .replace(/((?:remaining \d+m?|annulled|score stood at) (?:on )?[A-Z][a-z]{2} \d{1,2}),\s*(?=[^,]+,\s*(?:Buenos Aires|Rosario|La Plata|Avellaneda|Montevideo)$)/g, "$1; ")
    // "HT, score stood" va junto (lo traduce una sola regla); "see Jul 17", "remaining 49 on…" e "in extra time…" van aparte.
    // La cancha al final ("…, Racing, Avellaneda, B") también va aparte del texto que la precede.
    .split(
      /\]\s*\[|\s+(?=\[)|;\s*|,\s*(?=(?:aet|asdet|lasted|at|annulled|abandoned|suspended|played|awarded|n\/p|see|remaining|remained|in extra time|continue on|to be replayed)\b)|(?<!HT),\s*(?=(?:the )?score stood\b)|,\s*(?=\d+:\d+ corners$)|,\s*(?=[^,]*\b\d+ points? deducted)|,\s*(?=[^,]+,\s*[^,]+,\s*[BCS]$)/i,
    )
    // Sin corchetes ni el punto final ("San Isidro was suspended."); "W.O." conserva sus puntos.
    .map((p) => p.replace(/[\[\]]/g, "").trim().replace(/(?<!\b[A-Z])\.$/, ""))
    // "(aet)", "(Almagro withdrew at 72')": observaciones entre paréntesis.
    .map((p) => p.replace(/^\((.*)\)$/, "$1"))
    // "played at Atlanta" (1995/96): la cancha, igual que "at Atlanta".
    .map((p) => p.replace(/^played at /i, "at "))
    .filter(Boolean);
  for (const p of parts) {
    let m: RegExpMatchArray | null;
    // Copa de Competencia 1933: "Vélez Sarsfield did not play the extra time. On 21 Jun Boca Juniors won points".
    if ((m = p.match(/^(.+?) did not play the extra time\. On (\d{1,2} [A-Z][a-z]{2}) (.+?) won (?:the )?points$/i))) {
      const quit = resolveName(m[1], year);
      const club = resolveName(m[3], year);
      out.wonPointsBy = club?.id;
      out.text.push(`${quit ? quit.as ?? quit.name : m[1]} no jugó el alargue; el ${esDate(m[2])} la liga le dio el partido a ${club ? club.as ?? club.name : m[3]}.`);
      continue;
    }
    if ((m = p.match(/^(\d+):(\d+) corners$/i))) {
      out.text.push(`Córners: ${m[1]}-${m[2]}.`);
      continue;
    }
    // Partidos suspendidos que se completaron otro día: "remaining 15 on Dec 21", "remaining 24m on Jan 6 but Vélez not showed up".
    if ((m = p.match(/^remaining (\d+)m? on ([A-Z][a-z]{2} \d{1,2})(?: but (.+?) not showed up)?(?: at (.+?))?(?:, [BC])?\.?$/))) {
      const club = m[3] ? resolveName(m[3], year) : null;
      out.text.push(
        m[3]
          ? `Para jugar los ${m[1]} minutos restantes (${esDate(m[2])}) ${club ? club.as ?? club.name : m[3]} no se presentó, y quedó el resultado.`
          : `Los ${m[1]} minutos restantes se jugaron el ${esDate(m[2])}${m[4] ? ` (${m[4]})` : ""}.`,
      );
    } else if ((m = p.match(/^abandoned at (\d+):(\d+) in (\d+)m? at (.+)$/i))) {
      const club = resolveName(m[4], year);
      out.text.push(`Suspendido a los ${m[3]} minutos, con ${m[1]}-${m[2]} (en cancha de ${club ? club.as ?? club.name : m[4]}).`);
    } else if (/^incidents$/i.test(p)) out.text.push("Hubo incidentes (ver notas de la temporada).");
    else if ((m = p.match(/^at ([^,]+), ([^,]+)(?:, ([^,]+))?$/i))) {
      // Tie Cup: "at Lomas AC, Lomas de Zamora" (cancha de un club y lugar), "at Belgrano AC, Belgrano, Buenos Aires".
      const club = resolveName(m[1], year, true);
      const name = club ? `Cancha de ${club.as ?? club.name}` : m[1];
      // La letra final es la provincia de RSSSF (C = Capital, B = Buenos Aires, S = Santa Fe): no hace falta mostrarla.
      const place = m[3] && !/^[BCS]$/.test(m[3]) ? `${m[2]}, ${m[3]}` : m[2];
      // "Cancha de Albion (Uruguay), Paso del Molino" en lugar de dos paréntesis seguidos.
      out.venue = name.includes("(") ? `${name}, ${place}` : `${name} (${place})`;
    } else if ((m = p.match(/^([^,]+), ([^,]+), (Buenos Aires|Rosario|La Plata|Avellaneda|Montevideo)$/))) {
      out.venue = `${m[1]} (${m[2]}, ${m[3]})`;
    } else if ((m = p.match(/^annulled on (.+)$/i))) {
      out.annulled = true;
      out.text.push(`Anulado el ${esDate(m[1])}; se volvió a jugar.`);
    } else if ((m = p.match(/^at (.+)$/i)) && !/^\d+\s*[-:]\s*\d+\b/.test(m[1])) {
      // "at 1-2 in 88'" (resto de una nota que siguió en el renglón de abajo, 2007) no es una cancha.
      const club = resolveName(m[1].replace(/\s*\(.*\)$/, ""), year);
      // "at Rosario", "at Campana" (y "at Palermo" antes de que existiera el club): la ciudad o el barrio.
      if (club) out.venue = `Cancha de ${club.as ?? club.name}`;
      else if (/^Estadio /.test(m[1])) out.venue = m[1];
      else out.venue = /^(Rosario|Campana|Palermo|Mar del Plata|Córdoba|Mendoza|Salta|Tucumán|Santa Fe|Jujuy|Resistencia|Bahía Blanca|Posadas|Neuquén|San Juan|La Plata|Santiago del Estero|Paraná|Corrientes)$/.test(m[1]) ? m[1] : `Cancha de ${m[1]}`;
    } else if (/^aet$/i.test(p)) out.text.push("Con alargue.");
    else if (/^asdet$/i.test(p)) out.text.push("Con alargue y gol de oro.");
    else if (/^abandoned$/i.test(p)) out.text.push("Suspendido.");
    else if (/^\d+\s*[:\-]\s*\d+,?\s*an+ul+ed$/i.test(p)) out.annulled = true;
    else if ((m = p.match(/^(?:aet, )?lasted (\d+)m?(?:\s*\+\s*(\d+)m?)?$/i)))
      out.text.push(m[2] ? `Duró ${m[1]} minutos más ${m[2]} de alargue.` : `Duró ${m[1]} minutos.`);
    else if (/^annulled$/i.test(p)) out.annulled = true;
    else if ((m = p.match(/^(?:suspended|abandoned) at (\d+)'?(?:m)?$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
    else if ((m = p.match(/^continued (?:on )?(.+)$/i))) out.continuedOn = m[1];
    else if ((m = p.match(/^(?:played again|replayed) (?:on )?(.+)$/i))) {
      out.continuedOn = m[1];
      out.replayed = true;
    } else if ((m = p.match(/^suspended in (\d+)'?( because the rain| due to crowd trouble)?$/i)))
      out.text.push(`Suspendido a los ${m[1]} minutos${m[2] ? (/rain/.test(m[2]) ? " por lluvia" : " por incidentes en la tribuna") : ""}.`);
    else if (/^suspended$/i.test(p)) out.suspended = true;
    else if ((m = p.match(/^(.+?) withdrew and the match was annulled$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} se retiró del torneo.`);
      out.annulled = true;
    } else if ((m = p.match(/^(.+?) withdrew(?:, see [^,]+)?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no se presentó.`);
    } else if (/^annulled, see .+$/i.test(p)) out.annulled = true;
    else if (/^see .+$/i.test(p)) continue;
    else if (/^awarded(?: (?:wp|lp)\s*[:\-]\s*(?:wp|lp))?$/i.test(p)) {
      // Si antes dice que se suspendió con un resultado, la liga dio el partido (queda el resultado de la tabla).
      if (/^awarded$/i.test(p) && out.text.some((t) => /^Suspendido a los \d+ minutos con/.test(t))) {
        out.text.push("La liga dio el partido por escritorio.");
        out.awardedByLeague = true;
      } else out.text.push("Resuelto por la liga.");
    }
    else if (/^(not played|n\/p)$/i.test(p)) out.text.push("No se jugó.");
    else if (/^awarded by W\.?O\.?$/i.test(p)) continue;
    else if ((m = p.match(/^(?:abandoned|suspended) at (\d+)\s*[:\-]\s*(\d+) in (\d+)'?m?$/i)))
      out.text.push(`Suspendido a los ${m[3]} minutos, con ${m[1]}-${m[2]}.`);
    else if (resolveName(p, year, true)) out.venue = `Cancha de ${resolveName(p, year, true)!.as ?? resolveName(p, year, true)!.name}`;
    else if (/^[A-ZÁÉÍÓÚ][\wáéíóúñ.'-]*(?: (?:de |del |la )?[A-ZÁÉÍÓÚ][\wáéíóúñ.'-]*){0,3}$/.test(p)) out.venue = p;
    else if (/^(neutral|neutral ground)$/i.test(p)) out.text.push("Cancha neutral.");
    else if ((m = p.match(/^([A-ZÁÉÍÓÚa-záéíóúñ .'-]+), ([BCS])$/)))
      out.venue = `${m[1]} (${m[2] === "C" ? "Capital" : m[2] === "S" ? "Santa Fe" : "Bs. As."})`;
    else if ((m = p.match(/^(.+), ([^,]+), ([BCS])$/))) {
      // "Racing, Avellaneda, B": cancha de un club y localidad. Sin sacar la forma jurídica, y con los alias
      // del torneo: en 1918 "Estudiantes, La Plata" es la cancha de Estudiantes de La Plata.
      const club = resolveName(m[1].replace(/^FC Oeste$/, "Ferro Carril Oeste"), year, true);
      const sameCity = !club || !/\((BA|LP|Rosario|La Plata)\)$/.test(club.name) || club.name.includes(m[2]);
      out.venue = club && sameCity ? `Cancha de ${club.as ?? club.name} (${m[2]})` : `${m[1]} (${m[2]})`;
    } else if ((m = p.match(/^(.+?) reported (\d+)\s*:\s*(\d+)$/i))) out.text.push(`${m[1]} publicó ${m[2]}-${m[3]}.`);
    else if ((m = p.match(/^(.+?) (?:did not show up|dont show up|don't show up)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no se presentó.`);
    } else if ((m = p.match(/^(.+?) (?:withdrew champions?hip|withdrew from the championship)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} se había retirado del torneo.`);
    } else if ((m = p.match(/^(?:later,? )?(.+?) won (?:the )?points(?: \((\d+)-(\d+)\))?$/i))) {
      const club = resolveName(m[1], year);
      out.wonPointsBy = club?.id;
      if (m[2]) out.lostScore = [+m[2], +m[3]];
      out.text.push(`La liga le dio los puntos a ${club ? club.as ?? club.name : m[1]}.`);
    } else if ((m = p.match(/^abandoned (?:(\d+)-(\d+) )?at (\d+)'? (?:because of|due to) (rain|incidents|light cut)$/i))) {
      // 2000–2003: "Abandoned 0-4 at 61' because of incidents", "Abandoned at 90' because of incidents", "... because of light cut".
      const why = /rain/i.test(m[4]) ? "lluvia" : /light/i.test(m[4]) ? "un corte de luz" : "incidentes";
      out.text.push(`Suspendido a los ${m[3]} minutos${m[1] ? `, con ${m[1]}-${m[2]},` : ""} por ${why}.`);
    } else if ((m = p.match(/^abandoned at (\d+)-(\d+) in (\d+\+?\d*)'? (?:due to|because of) (rain|crowd trouble|incidents|light failure|a light cut)$/i))) {
      // 2005–2009: "abandoned at 1-0 in 16' due to rain". El marcador y el minuto los toma la fila "abd"; acá va el motivo.
      const why = /rain/i.test(m[4]) ? "la lluvia" : /light/i.test(m[4]) ? "un corte de luz" : "incidentes";
      out.text.push(`La suspensión fue por ${why}.`);
      out.unknown.push(`abandoned at ${m[1]}-${m[2]} in ${m[3]}'`);
    } else if ((m = p.match(/^suspended at (\d+)' due to visibility problems with (.+?) leading (\d+)-(\d+), continued (.+)$/i))) {
      // 1996: "Suspended at 81' due to visibility problems with Platense leading 1-0, continued April 18".
      out.text.push(`Suspendido a los ${m[1]} minutos por falta de visibilidad, con ${m[3]}-${m[4]} para ${resolveName(m[2], year)?.name ?? m[2]}; se completó el ${esDate(m[5].replace(/^(\w{3})\w*\s/, "$1 "))}.`);
    } else if ((m = p.match(/^suspended at (\d+)' due to crowd trouble with a penalty awarded to (.+)$/i)))
      out.text.push(`Suspendido a los ${m[1]} minutos por incidentes en la tribuna, con un penal a favor de ${resolveName(m[2], year)?.name ?? m[2]}.`);
    else if ((m = p.match(/^(?:score|result) allowed to stand(?: on ([A-Z][a-z]{2} \d{1,2}))?$/i)))
      out.text.push(m[1] ? `El ${esDate(m[1])} la liga dio por bueno el resultado.` : "La liga dio por bueno el resultado.");
    else if ((m = p.match(/^abandoned at (\d+)-(\d+) in (\d+)\+(\d+)m?$/i)))
      // 2013: "abandoned at 3-1 in 90+1m".
      out.text.push(`Suspendido a los ${m[3]}+${m[4]} minutos, con ${m[1]}-${m[2]}.`);
    else if (/^(behind )?closed doors$/i.test(p)) out.text.push("A puertas cerradas.");
    else if ((m = p.match(/^remaining (\d+)m? on ([A-Z][a-z]{2} \d{1,2})$/i))) out.text.push(`Los ${m[1]} minutos que faltaban se jugaron el ${esDate(m[2])}.`);
    else if ((m = p.match(/^score stood at ([A-Z][a-z]{2} \d{1,2})$/i)))
      // 1919: "finished at 84m, score stood at Nov 22": si ya se dijo que quedó el resultado, solo falta la fecha.
      out.text.push(out.text.some((t) => /por bueno/.test(t)) ? `La liga lo resolvió el ${esDate(m[1])}.` : `El ${esDate(m[1])} la liga dio por bueno el resultado.`);
    else if (/^agg:? \d+-\d+$/i.test(p)) continue;
    else if ((m = p.match(/^(.+?) (\d+) players left$/i))) {
      // "Banfield 6 players left" (1996): se quedó sin el mínimo de jugadores.
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} se quedó con ${m[2]} jugadores.`);
    } else if (/^not continued$/i.test(p)) out.text.push("No se completó; quedó el resultado del momento de la suspensión.");
    else if ((m = p.match(/^(.+?) deducted (\d+) points?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`A ${club ? club.as ?? club.name : m[1]} le descontaron ${m[2]} puntos.`);
    }
    else if (/^second half played friendly$/i.test(p)) out.text.push("El segundo tiempo se jugó como amistoso; vale el resultado del primero.");
    else if (/^played again$/i.test(p)) continue;
    else if (/^played \d+:\d+$/i.test(p)) continue; // parcial de "lp 1:1 wp", ya usado como resultado
    else if (/^pen \d+[:-]\d+$/i.test(p)) continue; // penales "[6]2-2[7]": los usa el importador (advancedId)
    else if ((m = p.match(/^(.+?) (?:forfeited|wihtdrew|withdrawn)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no se presentó.`);
    } else if ((m = p.match(/^(.+?) was suspended$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} estaba suspendido por la liga.`);
    } else if ((m = p.match(/^(.+?) abandoned in (\d+)'?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} abandonó la cancha a los ${m[2]} minutos.`);
    } else if ((m = p.match(/^abandoned in (\d+)'?m?(?: HT)?$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
    else if ((m = p.match(/^abandoned in (\d+)'?, not defined$/i))) {
      out.text.push(`Suspendido a los ${m[1]} minutos y nunca se definió: no suma.`);
      out.annulled = true;
    } else if (/^incidents, see notes$/i.test(p)) out.text.push("Hubo incidentes (ver notas de la temporada).");
    else if ((m = p.match(/^(?:[A-Z][a-z]{2} \d{1,2} )?abandoned at (\d+)-(\d+) in (\d+)'?$/i)))
      out.text.push(`Suspendido a los ${m[3]} minutos con ${m[1]}-${m[2]}.`);
    else if (/^(?:later,? )?both teams lost the (?:points|match)(?: \(\d+-\d+\))?$|^awarded \d+-\d+ loss against both$/i.test(p)) {
      // "awarded 0-0 loss against both" (1997): lo mismo con otras palabras.
      out.bothLost = true;
      out.text.push("La liga le dio el partido por perdido a los dos equipos.");
    } else if ((m = p.match(/^later,? (.+?) lost the points \((\d+)-(\d+)\)$/i))) {
      const club = resolveName(m[1], year);
      out.lostPointsBy = club?.id;
      out.lostScore = [+m[2], +m[3]];
      out.text.push(`La liga le quitó los puntos a ${club ? club.as ?? club.name : m[1]} y lo dio ${m[2]}-${m[3]}.`);
    } else if ((m = p.match(/^(.+?) lost (?:the )?points$/i))) {
      const club = resolveName(m[1], year);
      out.lostPointsBy = club?.id;
      out.text.push(`La liga le quitó los puntos a ${club ? club.as ?? club.name : m[1]} y se los dio al rival.`);
    } else if (/^annul+ed$/i.test(p)) out.annulled = true;
    else if ((m = p.match(/^(.+?) gave up points(?: on (.+?))?\.?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} cedió los puntos.`);
    } else if ((m = p.match(/^awarded on (.+)$/i))) out.text.push(`Resuelto por la liga (${esDate(m[1])}).`);
    else if ((m = p.match(/^(\d+)m$/))) out.text.push(`Duró ${m[1]} minutos.`);
    else if (/^abandoned at HT$/i.test(p)) out.text.push("Suspendido en el entretiempo.");
    else if ((m = p.match(/^(\d+):(\d+) in Annual Report$/i))) out.text.push(`La memoria anual de la asociación lo registra ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^in (Rosario|Montevideo|La Plata|Avellaneda|Córdoba|Santa Fe|Caseros)$/i))) out.venue = m[1];
    else if (/^replayed$/i.test(p)) out.text.push("Partido jugado de nuevo (el primero se anuló).");
    else if (/^to be replayed$/i.test(p)) out.text.push("Se ordenó volver a jugarlo.");
    else if ((m = p.match(/^(\d+) minutes remaining$/i))) out.text.push(`Faltaban ${m[1]} minutos.`);
    // 1955: "[at Racing Club, remained 87]": la continuación de un partido suspendido.
    else if ((m = p.match(/^(?:remained|remaining) (\d+)(?:m|')?$/i))) out.text.push(`Se jugaron los ${m[1]} minutos que faltaban.`);
    else if (/^the score stood$/i.test(p)) out.text.push("Resuelto por la liga.");
    else if ((m = p.match(/^(?:later,? )?awarded (\d+)\s*-\s*(\d+)$/i))) out.awardedScore = [+m[1], +m[2]];
    else if ((m = p.match(/^(.+?) won on (?:goals? )?away(?: goals?)? rule$/i))) {
      const club = resolveName(m[1], year);
      out.advancedBy = club?.id;
      out.text.push(`Ganó la serie ${club ? club.as ?? club.name : m[1]} por los goles de visitante.`);
    }
    // 1975–: "[awd originally 1-2, …]", "[abd at 1-2 in 78m, awarded]", "[abd at 86m, score stood]".
    else if ((m = p.match(/^awd originally (\d+)\s*-\s*(\d+)$/i))) {
      out.text.push(`En la cancha terminó ${m[1]}-${m[2]}; la liga dio el partido por escritorio.`);
      out.awardedByLeague = true;
    } else if ((m = p.match(/^abd at (\d+)\s*-\s*(\d+) in (\d+)m?$/i))) out.text.push(`Suspendido a los ${m[3]} minutos con ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^abd at (\d+)m?$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
    else if (/^awarded$/i.test(p) && out.text.some((t) => /^Suspendido a los \d+ minutos con/.test(t))) {
      out.text.push("La liga dio el partido por escritorio.");
      out.awardedByLeague = true;
    }
    // Años 50 y 60: más variantes de partidos suspendidos.
    else if ((m = p.match(/^suspended at (\d+)m?, not continued$/i))) out.text.push(`Suspendido a los ${m[1]} minutos; no se completó y quedó el resultado del momento.`);
    else if ((m = p.match(/^abandoned at (\d+)\s*[-:]\s*(\d+) in (\d+)m?(?: HT)?$/i)))
      out.text.push(`Suspendido a los ${m[3]} minutos${/HT$/i.test(p) ? " (en el entretiempo)" : ""} con ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^remaining time (?:on|in) (.+)$/i))) out.text.push(`El resto se jugó el ${esDate(m[1])}.`);
    else if (/^First match in new Atlanta field$/i.test(p)) out.text.push("Primer partido en la nueva cancha de Atlanta.");
    // "12 de Octubre (San Nicolás)" (1985): estadio y ciudad.
    else if ((m = p.match(/^(\d{1,2} de [A-ZÁÉÍÓÚ][a-záéíóú]+) \((.+)\)$/))) out.venue = `Estadio ${m[1]} (${m[2]})`;
    else if ((m = p.match(/^First official match at (.+)$/i))) out.text.push(`Primer partido oficial en el estadio ${m[1]}.`);
    // 1980: notas entre paréntesis debajo del partido.
    else if ((m = p.match(/^Suspended at (\d+)' due to (.+?)\. On (.+?) the score stood$/i)))
      out.text.push(`Suspendido a los ${m[1]} minutos (${/electric/i.test(m[2]) ? "problema eléctrico" : m[2]}); el ${esDate(m[3])} la liga dio por bueno el resultado.`);
    else if ((m = p.match(/^Suspended (?:at (\d+)' (\d+)-(\d+)|(\d+)-(\d+) at (\d+)') and continued (next day|on (.+))$/i))) {
      const [min, hg, ag] = m[1] ? [m[1], m[2], m[3]] : [m[6], m[4], m[5]];
      out.text.push(`Suspendido a los ${min} minutos con ${hg}-${ag}; ${m[8] ? `se completó el ${esDate(m[8])}` : "se completó al día siguiente"} (el resultado es el final).`);
    } else if ((m = p.match(/^(\d{1,2} [A-Z][a-z]{2}): awarded .+ by doping$/i))) out.text.push(`La liga lo resolvió el ${esDate(m[1])} por un caso de doping.`);
    else if ((m = p.match(/^Suspended \S+ (\d+)-(\d+) \S+ at (\d+)'$/i))) out.text.push(`Suspendido a los ${m[3]} minutos con ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^Suspended (\d+)-(\d+) a los (\d+)' due to not warranties to play$/i))) out.text.push(`Suspendido a los ${m[3]} minutos con ${m[1]}-${m[2]} por falta de garantías.`);
    else if ((m = p.match(/^Abandoned at (\d+)'$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
    // 1991/92: "Suspended at 73' for the agression to River's goalkeeper".
    else if ((m = p.match(/^Suspended at (\d+)' for the agg?ression to (.+?)'s goalkeeper$/i))) {
      const club = resolveName(m[2], year);
      out.text.push(`Suspendido a los ${m[1]} minutos por una agresión al arquero de ${club ? club.as ?? club.name : m[2]}.`);
    }
    // 1986/87: "Abandoned at 77'. Continued on Apr 29." y "Centurión (RP) Doping Awd 0-1".
    else if ((m = p.match(/^Abandoned at (\d+)'\. Continued on (.+?)\.?$/i)))
      out.text.push(`Suspendido a los ${m[1]} minutos; se completó el ${esDate(m[2])} (el resultado es el final).`);
    else if ((m = p.match(/^(.+?) Doping Awd (\d+)-(\d+)$/i))) {
      out.awardedScore = [+m[2], +m[3]];
      out.text.push(`Por el doping de ${m[1]}.`);
    }
    else if ((m = p.match(/^Suspended at (\d+)' .*?(\d+)-(\d+).*?, continued later$/i)))
      out.text.push(`Suspendido a los ${m[1]} minutos con ${m[2]}-${m[3]}; se completó después (el resultado es el final).`);
    else if ((m = p.match(/^(.+?): (\d+) points deducted\)?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`A ${club ? club.as ?? club.name : m[1]} le descontaron ${m[2]} puntos (sanción).`);
    } else if ((m = p.match(/^On (.+?) was awarded .+ by doping$/i))) out.text.push(`La liga lo resolvió el ${m[1].replace(/^(\d{1,2}) (\w{3})\w* (\d{4})$/, (_x, d: string, mo: string, y: string) => `${d}/${MONTHS[mo.toLowerCase()] ?? mo}/${y}`)} por un caso de doping.`);
    else if ((m = p.match(/^not played, (.+?) (\d+) points? deducted$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`Además, a ${club ? club.as ?? club.name : m[1]} le descontaron ${m[2]} puntos (sanción).`);
    } else if ((m = p.match(/^(.+?) (\d+) points? deducted\)?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`A ${club ? club.as ?? club.name : m[1]} le descontaron ${m[2]} puntos (sanción).`);
    }
    else if ((m = p.match(/^(.+?) suspended for a month on (.+)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} fue suspendido por un mes el ${esDate(m[2])}.`);
    }
    // "FE forfeited on 4 Sep": iniciales del club que no se presentó (el walkover ya lo dice).
    else if (/^[A-Z]{1,3} forfeited on .+$/.test(p)) continue;
    else if ((m = p.match(/^(.+?) withdrew at (\d+)'?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} abandonó la cancha a los ${m[2]} minutos.`);
    }
    else if (/^the match was void$/i.test(p)) {
      out.annulled = true;
      out.text.push("El partido se anuló y se jugó de nuevo.");
    }
    else if ((m = p.match(/^no agreement on the field between (.+?) and (?:the )?Association$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`No hubo acuerdo sobre la cancha entre ${club ? club.as ?? club.name : m[1]} y la Asociación.`);
    } else if ((m = p.match(/^played friendly on (.+)$/i))) out.text.push(`Se jugó como amistoso el ${esDate(m[1])}.`);
    else if ((m = p.match(/^abandoned at (\d+)\s*[-:]\s*(\d+) in (\d+)m? HT, score stood on (.+)$/i)))
      out.text.push(`Suspendido en el entretiempo con ${m[1]}-${m[2]}; la liga dio por bueno el resultado (${esDate(m[4])}).`);
    else if (/^not pla(?:t)?yed$/i.test(p)) out.text.push("No se jugó.");
    else if ((m = p.match(/^awarded (?!on\b|by\b)(.+)$/i))) out.text.push(`Resuelto por la liga (${esDate(m[1])}).`);
    else if (/^abandoned, not continued$/i.test(p)) out.text.push("Suspendido y no se completó; quedó el resultado del momento.");
    // "2:0 in 45m" (parcial de un partido suspendido): lo usa el resultado "abandoned".
    else if (/^\d+:\d+ in \d+m?$/.test(p)) continue;
    // "[2:2, annulled]": el resultado lo usan las reglas de partidos anulados.
    else if (/^\d+\s*:\s*\d+$/.test(p)) continue;
    else if ((m = p.match(/^continue on (.+)$/i))) out.text.push(`Se continuó el ${esDate(m[1])}.`);
    else if ((m = p.match(/^(.+?) disagreed with the decision to play back the game\.?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no aceptó volver a jugarlo y no se presentó.`);
    }
    else if ((m = p.match(/^originally (\d+)\s*:\s*(\d+)$/i))) out.text.push(`En la cancha había terminado ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^(?:played )?friendly (\d+)\s*:\s*(\d+)$/i))) out.text.push(`Se jugó como amistoso (${m[1]}-${m[2]}); los puntos se definieron por escritorio.`);
    else if ((m = p.match(/^(.+?) forfeited the match$/i))) out.text.push(`${m[1].replace(/^SS /, "Sportiva ")} perdió los puntos.`);
    else if ((m = p.match(/^abandoned (\d+)\s*:\s*(\d+) (\d+)m$/i))) out.text.push(`El primer partido se suspendió a los ${m[3]} minutos con ${m[1]}-${m[2]} y se anuló; este es el resultado del partido jugado de nuevo.`);
    else if ((m = p.match(/^replayed on (.+)$/i))) out.text.push(`Se volvió a jugar el ${m[1]}.`);
    else if ((m = p.match(/^abandoned at (\d+)m? HT, score (?:indirectly )?stood(?: on (.+))?$/i)))
      out.text.push(`Suspendido en el entretiempo; la liga dio por bueno el resultado${m[2] ? ` (${m[2]})` : ""}.`);
    else if ((m = p.match(/^finished at (\d+)m?(?:, score stood(?: at| on)? (.+))?$/i))) out.text.push(`Terminó a los ${m[1]} minutos; se dio por bueno el resultado.`);
    else if ((m = p.match(/^(.+?) not showed up$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no se presentó.`);
    } else if ((m = p.match(/^abandoned in (\d+)(?: HT)?, remaining (\d+)m? on (.+?) but (.+?) not showed up$/i))) {
      const club = resolveName(m[4], year);
      out.text.push(`Suspendido a los ${m[1]} minutos; para jugar los ${m[2]} restantes (${m[3]}) ${club ? club.as ?? club.name : m[4]} no se presentó, y quedó el resultado.`);
    } else if ((m = p.match(/^(\d+)\s*:\s*(\d+) annulled, replayed on (.+?)(?: at .+)?$/i)))
      out.text.push(`Un primer partido (${m[1]}-${m[2]}) se anuló; este es el que se jugó de nuevo el ${m[3]}.`);
    else if ((m = p.match(/^(?:abandoned|suspended) at (\d+)\s*:\s*(\d+) in (\d+)m?, remaining (\d+) on (.+)$/i)))
      out.text.push(`Suspendido a los ${m[3]} minutos con ${m[1]}-${m[2]}; los ${m[4]} minutos restantes se jugaron el ${m[5]}.`);
    // Copas: "aet 135" (alargue largo hasta el gol de oro), "walk over", "Racing, Avellaneda".
    else if ((m = p.match(/^aet (\d+)m?$/i))) out.text.push(`Con alargue; duró ${m[1]} minutos.`);
    else if ((m = p.match(/^in extra time as regular time ended (\d+)-(\d+)$/i)))
      out.text.push(`Se definió en el alargue: los 90 minutos terminaron ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^abd at (\d+):(\d+) in (\d+)m?$/i))) out.text.push(`Suspendido a los ${m[3]} minutos, con ${m[1]}-${m[2]}.`);
    else if ((m = p.match(/^score stood(?: on (.+))?$/i))) out.text.push(`La liga dio por bueno el resultado${m[1] ? ` (${esDate(m[1])})` : ""}.`);
    else if ((m = p.match(/^(.+?) disen?r+olled on (.+)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} se desafilió el ${esDate(m[2])} y perdió el partido.`);
    }
    else if ((m = p.match(/^ended at (\d+)\s*:\s*(\d+) in 90m, extra time not played$/i)))
      out.text.push(`Terminó ${m[1]}-${m[2]} en los 90 minutos y no se jugó el alargue.`);
    // 1949: "Lanús, 4 de Junio" (ciudad y nombre del estadio).
    else if ((m = p.match(/^([^,]+), (\d{1,2} de [A-ZÁÉÍÓÚ][a-záéíóú]+)$/))) out.venue = `Estadio ${m[2]} (${m[1]})`;
    else if (/^walk ?over$/i.test(p)) out.text.push("El rival no se presentó.");
    else if ((m = p.match(/^(not played|n\/p), (.+)$/i))) out.text.push("No se jugó.");
    // Copas: "Racing, Avellaneda" o "GEBA, Palermo" (cancha y lugar, tal como lo da la fuente).
    else if ((m = p.match(/^([^,]+), ([A-ZÁÉÍÓÚ][^,]+?)\)*$/)) && !/\d/.test(p)) out.venue = `${m[1]} (${m[2]})`;
    else out.unknown.push(p);
  }
  return out;
}

// Fases de copa en español, con la región del cuadro cuando la hay ("Rosario · Primera ronda").
function cupStageOf(raw: RawMatch): string | undefined {
  // "1st. round:" → "1st round".
  const r = (raw.round ?? "").replace(/:$/, "").replace(/\./g, "").trim();
  // Copas por grupos: "Grupo A · Fecha 3".
  if (raw.group) {
    // Jockey Club 1933: "Round 1.3" es la fecha 3 del grupo y "Round 2.1 (Playoff)", un desempate.
    if (/playoff/i.test(r)) return `${raw.group} · Desempate`;
    const n = r.match(/^Round\s*1\.(\d+)/i) ?? r.match(/^Round\s*(\d+)/i) ?? r.match(/^(\d+)(?:st|nd|rd|th) round/i);
    return `${raw.group}${n ? ` · Fecha ${n[1]}` : ""}`;
  }
  const table: [RegExp, string][] = [
    [/preliminary/i, "Ronda preliminar"],
    [/1\/\s*64/, "Sesentaicuatroavos de final"],
    [/1\/\s*32/, "Treintaidosavos de final"],
    [/1\/\s*16/, "Dieciseisavos de final"],
    [/1\/\s*8|eighth/i, "Octavos de final"],
    [/first round|round 1\b|1st round/i, "Primera ronda"],
    [/second round|round 2\b|2nd round/i, "Segunda ronda"],
    [/third round|round 3\b|3rd round/i, "Tercera ronda"],
    [/fourth round|round 4\b/i, "Cuarta ronda"],
    [/quarter/i, "Cuartos de final"],
    [/semi/i, "Semifinal"],
    [/third (place|position)/i, "Tercer puesto"],
    [/final/i, "Final"],
    [/replay|playoff|play-off/i, "Desempate"],
    [/group\s+([a-z])\b/i, "Grupo $1"],
    [/zona? (norte|sur)/i, "Zona $1"],
  ];
  let stage: string | undefined;
  for (const [re, label] of table) {
    const m = r.match(re);
    if (m) {
      stage = label.replace("$1", (m[1] ?? "").replace(/^./, (c) => c.toUpperCase()));
      break;
    }
  }
  if (!stage && r) stage = r;
  // "Final Phase" (Tie Cup): semifinales y final entre los ganadores de cada región; no lleva prefijo.
  if (/^(Final Phase|Ruedas finales|Final Round)/i.test(raw.region ?? "")) return stage;
  // La ronda de consuelo lleva siempre el prefijo, también su final (no es la final de la copa).
  if (raw.region === "Consuelo Round") return `Ronda Consuelo · ${stage ?? ""}`.replace(/ · $/, "");
  const region = raw.region?.replace(/^Porteños?$/i, "Buenos Aires").replace(/^Rosarios?$/i, "Rosario").replace(/^National$/i, "Fase nacional");
  if (region && stage && stage !== "Final" && !/nacional/i.test(stage)) return `${region} · ${stage}`;
  return stage ?? region;
}

function stageOf(raw: RawMatch): { stage?: string; phase: Match["phase"] } {
  // Nacionales 1971–1985: el título de la sección da la fase y la línea "1st leg" / "2nd leg", la ida o la vuelta.
  const hint = raw.stageHint ?? "";
  const r0 = raw.round ?? "";
  const leg = /\b(1st|first)\b\.?\s*(leg|match)/i.test(r0) ? " (ida)" : /\b(2nd|second)\b\.?\s*(leg|match)/i.test(r0) ? " (vuelta)" : /^Round\s*\d+\.1$/i.test(r0) ? " (ida)" : /^Round\s*\d+\.2$/i.test(r0) ? " (vuelta)" : "";
  // (Nacional 1980: en los cruces, "Round 3.1" es la ida y "Round 3.2" la vuelta.)
  // Nacional 1983: "Round 2.1.3" es la segunda fase (grupos de 3 más interzonales); no suma en la tabla de la primera.
  const phase2 = r0.match(/^Round\s*(\d+)\.\s*(\d+)\.\s*(\d+)$/);
  if (phase2 && phase2[1] !== "1") {
    const where = raw.group ?? (/\svs\.?\s/i.test(hint) ? "Interzonal" : "");
    return { stage: `Segunda fase · ${where ? `${where} · ` : ""}Fecha ${phase2[2]}.${phase2[3]}`, phase: "playoff" };
  }
  // Si la línea de la fecha ya nombra la fase ("Semifinal [Dec 13]:"), manda sobre el título de la sección.
  if (hint && !/semi|final|quarter|playoff/i.test(r0)) {
    if (/^1\/8|octavos|round of 16/i.test(hint)) return { stage: `Octavos de final${leg}`, phase: "playoff" };
    // Nacional 1985: doble eliminación después de los grupos.
    if (/group winners/i.test(hint)) return { stage: `Llave de ganadores${leg}`, phase: "playoff" };
    if (/group losers/i.test(hint)) return { stage: `Llave de perdedores${leg}`, phase: "playoff" };
    if (/intergroup|interzonal/i.test(hint)) {
      const n = r0.match(/(?:Round|Fecha|Matchday)\s*(\d+)/i);
      return { stage: n ? `Interzonal · Fecha ${n[1]}` : "Interzonal", phase: "league" };
    }
    if (/final (tournament|round|group)/i.test(hint)) return { stage: "Ronda final", phase: "playoff" };
    // Metropolitano 1976: después de las zonas, un grupo por el campeonato y otro por el descenso.
    if (/championship group/i.test(hint)) return { stage: "Grupo campeonato", phase: "playoff" };
    if (/relegation group/i.test(hint)) return { stage: "Grupo descenso", phase: "playoff" };
    if (/quarter/i.test(hint)) return { stage: `Cuartos de final${leg}`, phase: "playoff" };
    if (/semi/i.test(hint)) return { stage: `Semifinal${leg}`, phase: "playoff" };
    // 1988/89: la final entre los ganadores de la Liguilla y de la Clasificación; 1991/92: entre el campeón que perdió la serie y el ganador del Octogonal.
    if (/^final (liguilla|between)/i.test(hint)) return { stage: `Final por el cupo${leg}`, phase: "playoff" };
    // 1988/89: "1st. ROUND:" en la Liguilla Clasificación.
    const ord = hint.match(/^(\d)(?:st|nd|rd|th)\.?\s+round:?$/i);
    if (ord) return { stage: `${["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta"][+ord[1] - 1]} ronda${leg}`, phase: "playoff" };
    if (/^(grand )?final/i.test(hint)) return { stage: `${/^grand/i.test(hint) ? "Gran final" : "Final"}${leg}`, phase: "playoff" };
    if (/playoff|desempate/i.test(hint)) return { stage: `Desempate${leg}`, phase: "playoff" };
    if (/\svs\.?\s/i.test(hint)) {
      const n = r0.match(/(?:Round|Fecha|Matchday)\s*(\d+)/i);
      return { stage: n ? `Interzonal · Fecha ${n[1]}` : "Interzonal", phase: "league" };
    }
  }
  const base = stageOfRound(raw);
  if (raw.group && base.phase === "league") return { stage: base.stage ? `${raw.group} · ${base.stage}` : raw.group, phase: "league" };
  return base;
}

function stageOfRound(raw: RawMatch): { stage?: string; phase: Match["phase"] } {
  const r = raw.round ?? "";
  // "Round 2.3" (Nacional 1980): tercera fecha de la segunda rueda.
  // Y "Round 1.2.7" (Nacional 1981): fase 1, segunda rueda, fecha 7 → "Fecha 2.7".
  const dotted = r.match(/^Round\s*(?:(\d+)\.\s*)?(\d+)\.\s*(\d+)$/i);
  if (dotted) return { stage: `Fecha ${dotted[2]}.${dotted[3]}`, phase: "league" };
  const n = r.match(/(?:Round|Fecha|Matchday)\s*(\d+)/i) ?? r.match(/^(\d+)(?:st|nd|rd|th)\.?\s+Round$/i);
  if (n) return { stage: `Fecha ${n[1]}`, phase: "league" };
  if (/^final round$/i.test(r)) return { stage: "Ronda final", phase: "playoff" };
  const grp = r.match(/group\s+([a-z])\b/i);
  if (grp && !/playoff|final|winner/i.test(r)) return { stage: `Grupo ${grp[1].toUpperCase()}`, phase: "league" };
  if (/(1st|first) half season/i.test(r)) return { stage: "Primera rueda", phase: "league" };
  if (/(2nd|second) half season/i.test(r)) return { stage: "Segunda rueda", phase: "league" };
  if (/group ([a-z]) winner playoff/i.test(r)) return { stage: `Desempate del Grupo ${r.match(/group ([a-z])/i)![1].toUpperCase()}`, phase: "playoff" };
  if (/championship final/i.test(r)) return { stage: "Final", phase: "playoff" };
  // Metropolitanos 1967–1970: semifinales y final entre los primeros de cada zona.
  if (/semi-?finals?/i.test(r)) return { stage: "Semifinal", phase: "playoff" };
  if (/third position|third place/i.test(r)) return { stage: "Tercer puesto", phase: "playoff" };
  if (/first playoff/i.test(r)) return { stage: "Primer desempate", phase: "playoff" };
  if (/third playoff/i.test(r)) return { stage: "Tercer desempate", phase: "playoff" };
  if (/second playoff/i.test(r)) return { stage: "Segundo desempate", phase: "playoff" };
  // En una liga, los partidos de ida y vuelta ("First leg [Dec 3]") son desempates (1950).
  // Y el triangular de 1968: "1st. Match [Dec 19]".
  if (/playoff|play-off|replay|\bleg\b|\d(?:st|nd|rd|th)\.?\s+match\b/i.test(r)) return { stage: "Desempate", phase: "playoff" };
  if (/final/i.test(r)) return { stage: "Final", phase: "playoff" };
  return { stage: r || undefined, phase: "league" };
}

export async function buildTournament(cfg: TournamentConfig): Promise<{ season: Season; problems: string[]; warnings: string[] }> {
  const problems: string[] = [];
  const warnings: string[] = [];
  const allParsed = parseSeason(await fetchPage(cfg.file), { cup: cfg.kind === "cup", headings: cfg.headings, groups: cfg.groupLines });
  // Un torneo repartido en varias secciones seguidas (Nacionales 1971–1985): se toman solo esas y se juntan.
  let sections = allParsed;
  if (cfg.sectionRange) {
    const start = allParsed.findIndex((s) => cfg.sectionRange!.from.test(s.heading));
    const rel = cfg.sectionRange.to ? allParsed.slice(start + 1).findIndex((s) => cfg.sectionRange!.to!.test(s.heading)) : -1;
    sections = start < 0 ? [] : allParsed.slice(start, rel < 0 ? undefined : start + 1 + rel);
    // Secciones de otro torneo metidas en el medio (1979: el torneo por el descenso dentro del Metropolitano).
    if (cfg.sectionRange.exclude) sections = sections.filter((x, i) => i === 0 || !cfg.sectionRange!.exclude!.test(x.heading));
  }
  // Por título: entre las secciones que coinciden, la que tiene más partidos (a veces el título se repite).
  let section: RawSection | undefined =
    typeof cfg.section === "number"
      ? sections[cfg.section]
      : sections
          .filter((s) => (cfg.section as RegExp | undefined)?.test(s.heading) ?? s.matches.length > 0)
          .sort((a, b) => b.matches.length - a.matches.length)[0];
  // Copas con cada zona en su propia sección: se juntan; la sección da la fase si el partido no la tiene.
  if (cfg.sectionRange && cfg.kind !== "cup") {
    // Ligas en varias secciones: "Group A" da el grupo; los demás títulos ("Quarterfinals", "Group A vs. Group B",
    // "Final") quedan como pista de fase en `region` (el primero es el nombre del torneo y no cuenta).
    section = {
      heading: sections.map((s) => s.heading).join(" / "),
      tables: sections.flatMap((s) => s.tables),
      text: sections.flatMap((s) => s.text),
      matches: sections.flatMap((s, i) => {
        const g = s.heading.match(/^(?:Group|Zona|Grupo)\s+"?([A-Z])"?\.?:?$/i);
        return s.matches.map((m) => ({
          ...m,
          ...(g && !m.group && { group: `Grupo ${g[1].toUpperCase()}` }),
          ...(!g && i > 0 && { stageHint: s.heading }),
        }));
      }),
    };
  } else if (cfg.allSections) {
    section = {
      heading: sections.map((s) => s.heading).join(" / "),
      tables: sections.flatMap((s) => s.tables),
      text: sections.flatMap((s) => s.text),
      // Si la sección es un grupo o una zona ("Group A", "Zona Norte"), sus partidos llevan ese grupo.
      matches: sections.flatMap((s) => {
        const g = s.heading.match(/^Group\s+"?([A-Z])"?$|^Zona\s+(Norte|Sur)$|^Group\s+(North|South|East|West)(?:\s+(\d))?$/i);
        const POINTS: Record<string, string> = { north: "Norte", south: "Sur", east: "Este", west: "Oeste" };
        const group = !g
          ? undefined
          : g[1]
            ? `Grupo ${g[1].toUpperCase()}`
            : g[2]
              ? `Zona ${g[2]}`
              : `Grupo ${POINTS[g[3].toLowerCase()]}${g[4] ? ` ${g[4]}` : ""}`;
        // En las ligas el título de la sección no es una fase. En las copas puede traer la fecha: ". Round 2: 29 Jun."
        const round = cfg.kind === "cup" && !group ? s.heading.replace(/^\.\s*/, "").replace(/:\s*\d{1,2}\s+[A-Z][a-z]{2}.*$/, "") : undefined;
        const hd = s.heading.match(/:\s*(\d{1,2})\s+([A-Z][a-z]{2})[a-z]*\.?(?:\s+(\d{4}))?\.?$/);
        const headDate = hd ? `${hd[2]} ${hd[1]}${hd[3] ? `, ${hd[3]}` : ""}` : "";
        return s.matches.map((m) => ({
          ...m,
          round: m.round ?? round,
          date: m.date || headDate,
          ...(group && !m.group && { group }),
        }));
      }),
    };
  }
  if (!section) throw new Error(`${cfg.slug}: no encontré la sección`);

  const matches: Match[] = [];
  let prevMonth = 0;
  let yearShift = 0;
  let lastBracket = "";
  let n = 0;
  const unknownNames = new Set<string>();
  const suspendedParts: { m: Match; continuedOn: string; replayed?: boolean }[] = [];
  const usedOverrides = new Set<string>();
  let notPlayed = 0;

  for (const raw of section.matches) {
    if (cfg.skip?.(raw) || raw.round === "friendly") continue;
    if (cfg.edition && raw.edition !== cfg.edition) continue;
    // Frases de las notas que el parser confundió con partidos ("NB: The abandoned River Plate 1:3 ...").
    // Un nombre abreviado con punto final ("Newell's O.B.", 2000) no es prosa si es un club conocido.
    const prose = (s: string) =>
      /^NB\b|^\.|^\(|^\[|^\d+'|^Then\b|[:;]|\(\d+m\)|\bis not included\b|, and,|\blater\b|\bstanding\b|\bor$|\.$/i.test(s) &&
      !(/\.$/.test(s) && resolveName(s, cfg.year));
    // El visitante puede traer la cancha y una observación pegadas (se separan más abajo): admite nombres más largos.
    if (prose(raw.home) || raw.home.length > 45 || (prose(raw.away) && !/\([A-Z]{1,3} forfeited on [^)]*\)$/.test(raw.away)) || raw.away.length > 80) {
      // Que no se pierda en silencio una fila con resultado ("Newell's O. B.  1-0  Talleres", 2001: el nombre termina en punto).
      if (/^\d+\s*[:\-]\s*\d+$/.test(raw.score) && !prose(raw.home.replace(/\.$/, ""))) warnings.push(`L${raw.line} ${raw.home}-${raw.away}: fila descartada como texto (¿nombre sin alias?)`);
      continue;
    }
    const home = resolveName(raw.home, cfg.year);
    let away = resolveName(raw.away, cfg.year);
    // "Ferrocarriles del Estado Colegiales": la cancha va a un solo espacio del visitante. Se prueba el nombre más
    // largo que sea un club y el resto pasa a la nota.
    if (!away) {
      const words = raw.away.split(" ");
      for (let n = words.length - 1; n > 0 && !away; n--) {
        const hit = resolveName(words.slice(0, n).join(" "), cfg.year);
        if (hit) {
          away = hit;
          raw.note = [words.slice(n).join(" "), raw.note].filter(Boolean).join(", ");
          raw.away = words.slice(0, n).join(" ");
        }
      }
    }
    if (!home) unknownNames.add(raw.home);
    if (!away) unknownNames.add(raw.away);
    if (!home || !away) continue;

    // Copas viejas sin fecha de partido: queda el año solo (se muestra "fecha sin datos"), nunca una fecha inventada.
    // Copas: cuando la lista pasa de diciembre a enero sin escribir el año, los partidos siguientes también son del
    // año nuevo (enero, febrero...). Las fechas con año explícito no cambian eso. En las ligas el orden de la lista no
    // es cronológico (hay partidos postergados al final), así que ahí se mira solo el mes anterior.
    const explicitYear = /\b(18|19)\d{2}\b/.test(raw.date);
    // Cada grupo o región de la página vuelve a empezar desde el principio de la temporada.
    const bracket = `${raw.region ?? ""}|${raw.group ?? ""}`;
    if (bracket !== lastBracket) {
      yearShift = 0;
      lastBracket = bracket;
    }
    const d =
      !raw.date.trim() && cfg.kind === "cup"
        ? { iso: String(cfg.year + yearShift), month: prevMonth }
        : parseDate(raw.date, cfg.year, prevMonth);
    // Una vez que el cuadro pasó al año siguiente, sus partidos de enero a agosto son de ese año (los de septiembre a
    // diciembre, listados por fecha y no por día, siguen siendo del año de la temporada).
    if (cfg.kind === "cup" && d && !explicitYear && d.iso.length === 10) {
      if (Number(d.iso.slice(0, 4)) > cfg.year) yearShift = 1;
      else if (yearShift && d.month <= 8) d.iso = `${cfg.year + 1}${d.iso.slice(4)}`;
    }
    // Torneos que empiezan a mitad de año y terminan en el siguiente (Metropolitano 1982): los meses anteriores al
    // del comienzo son del año siguiente.
    if (cfg.rolloverBefore && d && !explicitYear && d.iso.length === 10 && d.month < cfg.rolloverBefore && Number(d.iso.slice(0, 4)) === cfg.year)
      d.iso = `${cfg.year + 1}${d.iso.slice(4)}`;
    if (!d) {
      problems.push(`L${raw.line}: fecha ilegible "${raw.date}" (${raw.home} - ${raw.away})`);
      continue;
    }
    prevMonth = d.month;
    if (cfg.excludeTeams?.some((t) => t === home.id || t === away.id)) continue;
    const ovKey = `${d.iso} ${home.id} ${away.id}`;
    const ov = cfg.overrides?.[ovKey];
    if (ov) usedOverrides.add(ovKey);
    if (ov === "skip") continue;
    const note = translateNote(raw.note, cfg.year);
    if (note.unknown.length && !ov?.note) warnings.push(`L${raw.line} ${raw.home}-${raw.away}: nota sin traducir: ${note.unknown.join(" | ")}`);

    if (cfg.ignoreRounds?.test(raw.round ?? "")) raw.round = undefined;
    const mapped = Object.entries(cfg.stageMap ?? {}).find(([re]) => new RegExp(re, "i").test(raw.round ?? ""))?.[1];
    const { stage, phase } = cfg.kind === "cup" ? { stage: mapped ?? cupStageOf(raw), phase: "cup" as const } : stageOf(raw);
    const m: Match = {
      id: `${cfg.slug}-${String(++n).padStart(3, "0")}`,
      date: d.iso,
      competition: cfg.competition,
      stage,
      phase,
      homeId: home.id,
      awayId: away.id,
      ...(home.as && { homeAs: home.as }),
      ...(away.as && { awayAs: away.as }),
      homeGoals: 0,
      awayGoals: 0,
      ...(note.venue && { venue: note.venue.replace(/[,;\s]+$/, "") }),
      sources: ["rsssf"],
    };
    let s = raw.score.toLowerCase();
    // "awd  [awarded wp:lp]": resultado dado por la liga.
    const awd = raw.note.match(/\b(wp|lp)\s*[:\-]\s*(lp|wp)\b/i);
    if (/^(awd|wo|n\/p)$/.test(s) && awd) s = `${awd[1]}:${awd[2]}`.toLowerCase();
    // "awd [awarded 2-2]" (1974): la liga fijó el resultado; se usa como marcador del partido.
    const awdScore = s === "awd" ? raw.note.match(/awarded (\d+)\s*[-:]\s*(\d+)/i) : null;
    if (awdScore) {
      s = `${awdScore[1]}:${awdScore[2]}`;
      note.text = note.text.filter((t) => !/^Resuelto por la liga/.test(t));
      note.text.unshift("Resuelto por la liga.");
      note.awardedScore = undefined;
    }
    // "awd  [abandoned at 1-0 in 54'; Tigre lost points]": suspendido y resuelto por escritorio; queda el resultado parcial.
    const abdAwd = raw.note.match(/abandoned at (\d+)\s*[-:]\s*(\d+) in (\d+)'?/i);
    if (s === "awd" && abdAwd && note.lostPointsBy) {
      s = `${abdAwd[1]}:${abdAwd[2]}`;
      note.text = note.text.filter((t) => !/^Suspendido/.test(t));
      note.text.unshift(`Suspendido a los ${abdAwd[3]} minutos con ${abdAwd[1]}-${abdAwd[2]}; la liga resolvió el partido por escritorio.`);
    }
    // "void  [1-0 annulled]": se jugó y después se anuló.
    // También "abandoned at 2:2 in 87m, annulled on May 10": se suspendió y se anuló (se jugó de nuevo).
    // Y "ended at 3:3 in 90m, extra time not played, annulled on Jan 12" (1949): el resultado y la anulación en la misma nota.
    const voided =
      raw.note.match(/(\d+)\s*[:\-]\s*(\d+)(?: in \d+m?)?\]?\s*\[?,?\s*(?:an+ul+ed|to be replayed)/i) ??
      raw.note.match(/ended at (\d+)\s*:\s*(\d+)[^\]\[]*?an+ul+ed/i);
    if (/^(void|ann|anu)$/.test(s) && voided) {
      s = `${voided[1]}:${voided[2]}`;
      note.annulled = true;
      note.unknown = note.unknown.filter((u) => !/annulled/i.test(u));
    }
    // Fechas aproximadas: "[>Jul 3]" o "[Jun 29 < TBD < Aug 30]".
    if (/\?/.test(raw.date)) note.text.push("Fecha dudosa en la fuente.");
    if (/^[<>]|TBD/i.test(raw.date)) note.text.push(`Fecha aproximada (la fuente indica "${raw.date.replace(/TBD/i, "sin fecha")}").`);
    let g: RegExpMatchArray | null;
    if ((g = s.match(/^(\d+)[:\-](\d+)$/))) {
      m.homeGoals = +g[1];
      m.awayGoals = +g[2];
    } else if (/^lp[:\-]lp$/.test(s)) {
      m.walkover = true;
      m.bothLost = true;
      note.text.unshift("No se jugó: la liga se lo dio por perdido a los dos equipos.");
    } else if (/^wp[:\-]lp$|^lp[:\-]wp$/.test(s)) {
      m.awardedTo = s.startsWith("wp") ? home.id : away.id;
      const who = s.startsWith("wp") ? home.as ?? home.name : away.as ?? away.name;
      // "originally 1:0": se jugó y después la liga lo dio por escritorio. Queda el resultado de la cancha, sin sumar goles.
      // "abandoned at 1:1 in 35": se suspendió y la liga lo resolvió; queda el resultado parcial, también sin sumar goles.
      const orig = raw.note.match(/originally (\d+)\s*[:\-]\s*(\d+)/i);
      const abd = raw.note.match(/abandoned at (\d+)\s*[:\-]\s*(\d+) in (\d+)/i);
      // "lp 1:1 wp" (años 50): el parcial va en la fila; los minutos, si los hay, en la nota ("abandoned at 66m").
      const played = raw.note.match(/played (\d+)\s*:\s*(\d+)/i);
      const playedMin = raw.note.match(/abandoned (?:at|in) (\d+)m?\b(?!\s*:)/i);
      if (orig || abd || played) {
        const [hg, ag] = orig ? [orig[1], orig[2]] : abd ? [abd[1], abd[2]] : [played![1], played![2]];
        m.homeGoals = +hg;
        m.awayGoals = +ag;
        // Hasta los años 40 las tablas no cuentan esos goles; desde los 50 sí (lo confirma el control de la tabla).
        if (!cfg.awardedGoalsCount) m.goalsVoid = true;
        note.text = note.text.filter((t) => !/^En la cancha había terminado|^Suspendido a los|^Suspendido\.?$/.test(t));
        const how = orig
          ? `Se jugó y terminó ${hg}-${ag}`
          : abd
            ? `Se suspendió a los ${abd[3]} minutos con ${hg}-${ag}`
            : playedMin
              ? `Se suspendió a los ${playedMin[1]} minutos con ${hg}-${ag}`
              : `Se jugó (${hg}-${ag})`;
        note.text.unshift(cfg.kind === "cup" ? `${how}, pero la liga le dio el partido a ${who}.` : `${how}, pero la liga le dio los puntos a ${who}.`);
      } else {
        m.walkover = true;
        note.text.unshift(cfg.kind === "cup" ? `No se jugó: pasó ${who}.` : `No se jugó: los puntos fueron para ${who}.`);
      }
    } else if (/^[wld][:\-][wld]$/.test(s)) {
      m.scoreUnknown = true;
      if (s[0] === "w") m.winnerId = home.id;
      if (s[0] === "l") m.winnerId = away.id;
      note.text.unshift("Resultado no registrado en los diarios de la época; solo se sabe cómo terminó.");
    } else if (s === "abd" && (g = raw.note.match(/(?:abandon(?:d)?ed|abd) at (\d+)\s*[:\-]\s*(\d+)(?: in (\d+))?/i))) {
      // Suspendido: si la liga dio por bueno el resultado ("score stood") cuenta; si no, se muestra pero no suma.
      m.homeGoals = +g[1];
      m.awayGoals = +g[2];
      const stood = /score (?:indirectly )?stood/i.test(raw.note);
      note.unknown = note.unknown.filter((u) => !/abandoned|abd at|score stood|show up/i.test(u));
      note.text = note.text.filter((t) => !/^Suspendido/.test(t));
      if (stood) note.text.unshift(`Suspendido${g[3] ? ` a los ${g[3]} minutos` : ""} con ${g[1]}-${g[2]}; la liga dio por bueno ese resultado.`);
      else {
        m.status = "annulled";
        note.text.unshift(`Suspendido${g[3] ? ` a los ${g[3]} minutos` : ""} con ${g[1]}-${g[2]} y no se completó: no suma.`);
      }
    } else if (s === "awd" && (g = raw.note.match(/originally (\d+)\s*[-:]\s*(\d+)/i))) {
      // "awd [originally 0-1]" (1976): se jugó y la liga lo resolvió; la fila "[awarded]" que sigue trae el resultado oficial.
      m.homeGoals = +g[1];
      m.awayGoals = +g[2];
      m.status = "annulled";
      note.text = note.text.filter((t) => !/^En la cancha/.test(t));
      note.unknown = note.unknown.filter((u) => !/originally/i.test(u));
      note.text.unshift(`En la cancha terminó ${g[1]}-${g[2]}; la liga lo resolvió por escritorio: no suma.`);
    } else if (s === "abandoned" && (g = raw.note.match(/^\[?(\d+)\s*[:\-]\s*(\d+) in (\d+)m?/i))) {
      // "abandoned  [2:0 in 45m, continue on 28 Oct]": primera parte de un partido que después se anuló o se completó aparte.
      m.homeGoals = +g[1];
      m.awayGoals = +g[2];
      m.status = "annulled";
      note.unknown = note.unknown.filter((u) => !/^\d+:\d+ in \d+m?$/i.test(u));
      note.text.unshift(`Suspendido a los ${g[3]} minutos con ${g[1]}-${g[2]}: no suma.`);
    } else if (/^(ann|void)$/.test(s)) {
      // "ann" sin resultado: anula el partido de ese cruce que ya figuraba antes en la lista.
      const prev = [...matches].reverse().find((x) => x.homeId === home.id && x.awayId === away.id && x.status !== "annulled");
      if (prev) {
        prev.status = "annulled";
        const when = `${Number(d.iso.slice(8))}/${Number(d.iso.slice(5, 7))}`;
        prev.note = [`Anulado el ${when}: no suma en la tabla.`, prev.note].filter(Boolean).join(" ");
      } else warnings.push(`L${raw.line} ${raw.home}-${raw.away}: "${raw.score}" sin partido previo que anular`);
      continue;
    } else if (/^(:|-|n\/p)$/.test(s) && !/friendly/i.test(raw.note)) {
      notPlayed++;
      continue;
    } else {
      // "abd", amistosos, etc.: no es un partido con resultado oficial.
      warnings.push(`L${raw.line} ${raw.home}-${raw.away}: sin resultado ("${raw.score}") ${raw.note} → omitido`);
      continue;
    }
    if (cfg.playoffFrom && m.date >= cfg.playoffFrom.date) {
      m.phase = "playoff";
      m.stage = cfg.playoffFrom.stage;
    }
    if (note.bothLost) m.bothLost = true;
    // El resultado que fijó la liga ("(0-1)"): el que se quedó con los puntos lleva el número mayor.
    if (note.lostScore && (note.lostPointsBy || note.wonPointsBy)) {
      const [lo, hi] = [Math.min(...note.lostScore), Math.max(...note.lostScore)];
      const homeWon = note.wonPointsBy ? note.wonPointsBy === home.id : note.lostPointsBy !== home.id;
      if (m.homeGoals !== (homeWon ? hi : lo) || m.awayGoals !== (homeWon ? lo : hi)) note.text.unshift(`En la cancha terminó ${m.homeGoals}-${m.awayGoals}.`);
      [m.homeGoals, m.awayGoals] = homeWon ? [hi, lo] : [lo, hi];
    }
    if (note.lostPointsBy) m.awardedTo = note.lostPointsBy === home.id ? away.id : home.id;
    if (note.wonPointsBy) m.awardedTo = note.wonPointsBy;
    if (note.advancedBy) m.advancedId = note.advancedBy;
    if (note.awardedScore) {
      const [ah, aa] = note.awardedScore;
      const onField = `${m.homeGoals}-${m.awayGoals}`;
      m.homeGoals = ah;
      m.awayGoals = aa;
      if (ah !== aa) m.awardedTo = ah > aa ? home.id : away.id;
      const who = m.awardedTo === home.id ? home : away;
      note.text.unshift(ah === aa ? `En la cancha terminó ${onField}; la liga lo dio ${ah}-${aa}.` : `En la cancha terminó ${onField}; la liga le dio el partido ${ah}-${aa} a ${who.as ?? who.name}.`);
    }
    if (note.awardedByLeague && m.homeGoals !== m.awayGoals) m.awardedTo = m.homeGoals > m.awayGoals ? home.id : away.id;
    // Algunas tablas oficiales no cuentan los goles de los partidos que la liga le dio a uno de los dos.
    if (cfg.awardedGoalsVoid && (note.wonPointsBy || note.lostPointsBy)) m.goalsVoid = true;
    if (cfg.annulTeams?.some((t) => t.id === home.id || t.id === away.id)) {
      const t = cfg.annulTeams.find((x) => x.id === home.id || x.id === away.id)!;
      note.annulled = true;
      note.text.push(t.note);
    }
    if (cfg.annulBefore && m.date < cfg.annulBefore.date) {
      note.annulled = true;
      note.text.push(cfg.annulBefore.note);
    }
    if (note.annulled) {
      m.status = "annulled";
      note.text.unshift("Anulado: no suma en la tabla.");
    }
    if (note.text.length) m.note = note.text.join(" ");
    // La línea entre corchetes debajo del partido suele ser de goleadores, pero a veces es una aclaración.
    if (raw.scorers && /^(played at|at |suspended|abandoned|finished|remaining |\d+-\d+ continued|reprogrammed|.* forfeited$)/i.test(raw.scorers)) {
      const extra = translateNote(raw.scorers.replace(/^played at/i, "at"), cfg.year);
      if (extra.venue) m.venue = extra.venue;
      const txt = [...extra.text, ...extra.unknown.map((u) => (/forfeited$/i.test(u) ? `${u.replace(/ forfeited$/i, "")} no se presentó.` : u))];
      if (txt.length) m.note = [m.note, ...txt].filter(Boolean).join(" ");
    } else if (raw.scorers)
      // "[Acevedo(2)]   [Rulli, …]" (1965): un corchete por equipo.
      m.note = [m.note, `Goles: ${scorersEs(raw.scorers.replace(/^;\s*/, "—; ").replace(/(\d+'[^;]*?) - (\d+')/, "$1; $2").replace(/;\s*/, " / ").replace(/\]\s*\[/g, " / "))}.`].filter(Boolean).join(" ");
    // Empate definido por penales ("[6]2-2[7]" → "pen 6:7"): quién pasó; para la estadística sigue siendo empate.
    const pen = raw.note.match(/\bpen (\d+)[:-](\d+)\b/);
    // En una vuelta de ida y vuelta (1979) los penales definen la serie aunque el partido no haya terminado empatado.
    if (pen && +pen[1] !== +pen[2]) {
      const winner = +pen[1] > +pen[2] ? home : away;
      m.advancedId = winner.id;
      const how = m.homeGoals === m.awayGoals ? "ganó por penales" : "pasó por penales, tras el empate en el global,";
      m.note = [m.note, `${winner.as ?? winner.name} ${how} (${pen[1]}-${pen[2]}).`].filter(Boolean).join(" ");
    }
    if (ov) Object.assign(m, ov);
    // Suspendido y completado otro día: RSSSF lo lista dos veces; vale la segunda aparición.
    if (note.continuedOn) {
      suspendedParts.push({ m, continuedOn: note.continuedOn, replayed: note.replayed });
      continue;
    }
    matches.push(m);
  }
  for (const { m: part, continuedOn, replayed } of suspendedParts) {
    // La continuación o revancha puede figurar con local y visitante invertidos (ej. jugada en cancha neutral).
    const rest =
      matches.find((x) => x.homeId === part.homeId && x.awayId === part.awayId && x.date > part.date) ??
      (replayed ? matches.find((x) => x.homeId === part.awayId && x.awayId === part.homeId && x.date > part.date) : undefined);
    const partial = `${part.homeGoals}-${part.awayGoals}`;
    const day = part.date.split("-").reverse().slice(0, 2).map(Number).join("/");
    if (rest) {
      const what = replayed
        ? `El partido original (${day}) se suspendió con ${partial} y se volvió a jugar en esta fecha.`
        : `Empezó el ${day} y se suspendió con ${partial}; se completó en esta fecha.`;
      rest.note = [what, rest.note]
        .filter(Boolean)
        .join(" ");
    } else {
      // Sin continuación en la lista: queda el resultado parcial y se avisa.
      warnings.push(`${part.homeId}-${part.awayId} ${part.date}: suspendido (continuado ${continuedOn}) sin continuación en la lista; queda ${partial}`);
      part.note = [`Suspendido con ${partial}; la fuente indica que se completó el ${continuedOn}.`, part.note].filter(Boolean).join(" ");
      matches.push(part);
    }
  }
  // 1977: "[Suspended in 45' because the rain]" con el parcial, y días después la misma fecha con el resultado final
  // (se terminó de jugar): queda un solo partido, el de la segunda fila.
  for (const part of cfg.kind === "cup" ? [] : [...matches]) {
    const g = part.status !== "annulled" ? part.note?.match(/^Suspendido a los (\d+) minutos(?: por lluvia)?[.;]\s*(.*)$/) : null;
    if (!g) continue;
    const rest = matches.find(
      (x) =>
        x !== part && x.homeId === part.homeId && x.awayId === part.awayId && x.stage === part.stage && x.status !== "annulled" &&
        x.date > part.date &&
        // Si una de las dos filas dice que se completó ("Remaining 51'", "Continued on…"), puede ser meses después.
        (Date.parse(x.date) - Date.parse(part.date)) / 86400000 <= (/minutos que faltaban|se completó/.test((x.note ?? "") + (part.note ?? "")) ? 160 : 60),
    );
    if (!rest) continue;
    const day = part.date.split("-").reverse().slice(0, 2).map(Number).join("/");
    rest.note = [`Empezó el ${day} y se suspendió a los ${g[1]} minutos${/lluvia/.test(part.note!) ? " por lluvia" : ""}, con ${part.homeGoals}-${part.awayGoals}; se terminó de jugar en esta fecha.`, rest.note].filter(Boolean).join(" ");
    matches.splice(matches.indexOf(part), 1);
  }
  // Desde los años 50 RSSSF lista un partido suspendido dos veces en la misma fecha: la fila "abd" y después la que
  // quedó (dada por la liga, "awarded", o completada, "remained N"). Es un solo partido: queda la segunda con la historia.
  for (const part of [...matches]) {
    const g1 = part.status === "annulled" ? part.note?.match(/^Suspendido(?: a los (\d+) minutos)? con (\d+)-(\d+) y no se completó: no suma\.\s*(.*)$/) : null;
    // Y "awd [originally X-Y]" (1976): se jugó completo y la liga cambió el resultado.
    const g2 = part.status === "annulled" ? part.note?.match(/^En la cancha terminó (\d+)-(\d+); la liga lo resolvió por escritorio: no suma\.\s*(.*)$/) : null;
    const full = !!g2;
    const g = g1 ?? (g2 ? [g2[0], undefined, g2[1], g2[2], g2[3]] : null);
    if (!g) continue;
    const rest = matches.find(
      (x) => x !== part && x.homeId === part.homeId && x.awayId === part.awayId && x.stage === part.stage && x.status !== "annulled" && x.date >= part.date,
    );
    if (!rest || !(rest.walkover || /Resuelto por la liga|minutos que faltaban/.test(rest.note ?? ""))) continue;
    const at = g[1] ? ` a los ${g[1]} minutos` : "";
    const day = part.date.split("-").reverse().slice(0, 2).map(Number).join("/");
    let what: string;
    if (/minutos que faltaban/.test(rest.note!)) what = `Empezó el ${day} y se suspendió${at} con ${g[2]}-${g[3]}; el resto se jugó en esta fecha.`;
    else if (rest.walkover && rest.awardedTo) {
      // "abd" y después "awd [awarded lp-wp]" (1969, 1970): se jugó, se suspendió y la liga le dio los puntos a uno.
      const who = getTeam(rest.awardedTo);
      rest.walkover = undefined;
      rest.homeGoals = +g[2];
      rest.awayGoals = +g[3];
      if (!cfg.awardedGoalsCount) rest.goalsVoid = true;
      rest.note = rest.note?.replace(/No se jugó: los puntos fueron para [^.]+\.\s*/, "");
      what = `Suspendido${at} con ${g[2]}-${g[3]}; la liga le dio los puntos a ${who?.name ?? rest.awardedTo}.`;
      if (rest.date !== part.date) { what += ` La liga lo resolvió el ${rest.date.split("-").reverse().slice(0, 2).map(Number).join("/")}.`; rest.date = part.date; }
    } else {
      what = full
        ? `En la cancha terminó ${g[2]}-${g[3]}; la liga dio el partido ${rest.homeGoals}-${rest.awayGoals}.`
        : rest.homeGoals === +g[2] && rest.awayGoals === +g[3]
          ? `Suspendido${at} con ${g[2]}-${g[3]}; la liga dio por bueno ese resultado.`
          : `Suspendido${at} con ${g[2]}-${g[3]}; la liga dio el partido ${rest.homeGoals}-${rest.awayGoals}.`;
      const w = rest.homeGoals > rest.awayGoals ? rest.homeId : rest.awayGoals > rest.homeGoals ? rest.awayId : undefined;
      if (w && !(rest.homeGoals === +g[2] && rest.awayGoals === +g[3])) rest.awardedTo = w;
      if (rest.date !== part.date) { what += ` La liga lo resolvió el ${rest.date.split("-").reverse().slice(0, 2).map(Number).join("/")}.`; rest.date = part.date; }
    }
    // "Fecha dudosa" era la de la resolución, que ahora queda en la nota.
    const moved = /La liga lo resolvió el/.test(what);
    if (moved && /Fecha dudosa en la fuente\./.test(rest.note ?? "")) what = what.replace(/\.$/, " (fecha dudosa en la fuente).");
    const drop = moved ? /(Resuelto por la liga\.|Se jugaron los \d+ minutos que faltaban\.|Fecha dudosa en la fuente\.)\s*/g : /(Resuelto por la liga\.|Se jugaron los \d+ minutos que faltaban\.)\s*/g;
    // Lo que traía la fila suspendida (goleadores, cancha) se conserva.
    // Si las dos filas traen los mismos goleadores (2006: Colón-Vélez), van una sola vez.
    const kept = rest.note?.replace(drop, "").trim();
    rest.note = [what, kept, g[4] && !kept?.includes(g[4].trim()) ? g[4] : undefined].filter(Boolean).join(" ");
    if (!rest.venue && part.venue) rest.venue = part.venue;
    matches.splice(matches.indexOf(part), 1);
  }
  for (const extra of cfg.extraMatches ?? []) matches.push({ sources: ["rsssf"], competition: cfg.competition, ...extra } as Match);
  // Notas sueltas de RSSSF que no siguen ninguna fórmula: se traducen tal cual.
  for (const m of matches) if (m.note) for (const [en, es] of NOTE_ES) m.note = m.note.replace(en, es);
  if (cfg.finalIsLast) {
    const last = [...matches].filter((m) => m.status !== "annulled").sort((a, b) => a.date.localeCompare(b.date)).pop();
    if (last) last.stage = "Final";
  }
  // Copas: cada desempate lleva el nombre de la fase que desempata ("Final (desempate)", "Rosario · Primera ronda (desempate)").
  if (cfg.kind === "cup") {
    let base: string | undefined;
    for (const m of [...matches].sort((a, b) => a.id.localeCompare(b.id))) {
      const inGroup = m.stage?.match(/^((?:Grupo|Zona) [^·]+?) · Desempate$/);
      if (inGroup) m.stage = `${inGroup[1]} (desempate)`;
      else if (m.stage && /(^|· )Desempate$/.test(m.stage)) {
        if (base) m.stage = `${base} (desempate)`;
      } else if (m.stage && !/\(desempate\)$/.test(m.stage)) base = m.stage;
    }
  }

  if (unknownNames.size) problems.push(`Nombres sin identificar: ${[...unknownNames].join(", ")}`);
  if (notPlayed) warnings.push(`${notPlayed} partidos del fixture figuran como no jugados`);
  const unusedOverrides = Object.keys(cfg.overrides ?? {}).filter((k) => !usedOverrides.has(k));
  if (unusedOverrides.length) problems.push(`Correcciones que no encontraron su partido: ${unusedOverrides.join(", ")}`);

  // En las copas la tabla resumen es opcional: solo se usa si la configuración la indica (algunas páginas traen tablas históricas).
  // Temporadas cuya página no trae la tabla (1935): se toma del documento de tablas finales de RSSSF, que es otro archivo.
  let tables = section.tables;
  if (cfg.tableFile) {
    const tsec = parseSeason(await fetchPage(cfg.tableFile)).find((s) => cfg.tableSection!.test(s.heading));
    if (!tsec) problems.push(`Tabla: no encontré la sección ${cfg.tableSection} en ${cfg.tableFile}`);
    tables = tsec?.tables ?? [];
  }
  const tableIdx = Array.isArray(cfg.tableIndex)
    ? cfg.tableIndex
    : cfg.kind === "cup" && cfg.tableIndex === undefined
      ? []
      : [cfg.tableIndex ?? 0];
  const publishedTable: TableRow[] = [];
  const groups: { name: string; teamIds: string[] }[] = [];
  const splits = new Map<string, number[]>();
  tableIdx.forEach((ti, gi) => {
    const ids: string[] = [];
    for (const r of tables[ti] ?? []) {
      // Nombres repetidos en la tabla (dos "Club de Gimnasia y Esgrima" en 1916): se identifican por el puesto.
      const byPos = cfg.tableAliases?.[`${gi}:${r.pos}`] ?? cfg.tableAliases?.[r.pos];
      const t = byPos ? { id: byPos } : resolveName(r.name.replace(/^\.\s*/, ""), cfg.year);
      if (!t) {
        problems.push(`Tabla: nombre sin identificar "${r.name}"`);
        continue;
      }
      ids.push(t.id);
      if (r.split) splits.set(t.id, r.split);
      publishedTable.push({ teamId: t.id, played: r.played, won: r.won, drawn: r.drawn, lost: r.lost, goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst, points: r.points });
    }
    if (cfg.groupNames?.[gi]) groups.push({ name: cfg.groupNames[gi], teamIds: ids });
  });

  const season: Season = {
    slug: cfg.slug,
    ...(cfg.kind && { kind: cfg.kind }),
    ...(cfg.runnerUpIds && { runnerUpIds: cfg.runnerUpIds }),
    year: cfg.year,
    ...(cfg.yearLabel && { yearLabel: cfg.yearLabel }),
    ...(cfg.league && { league: cfg.league }),
    title: cfg.title,
    tournament: cfg.tournament,
    organizer: cfg.organizer,
    championIds: cfg.championIds,
    summary: cfg.summary || cupSummary(cfg, matches),
    pointsPerWin: cfg.pointsPerWin ?? 2,
    ...(cfg.drawShootout && { drawShootout: cfg.drawShootout }),
    sources: [{ label: cfg.kind === "cup" ? `RSSSF – ${cfg.title}` : `RSSSF – Argentina ${cfg.year}`, url: cfg.sourceUrl ?? `https://www.rsssf.org/tablesa/${cfg.file}` }, ...(cfg.wiki ? [{ label: `Wikipedia – ${cfg.wiki}`, url: `https://es.wikipedia.org/wiki/${encodeURIComponent(cfg.wiki.replace(/ /g, "_"))}` }] : [])],
    notes: [
      ...cfg.notes,
      ...(cfg.reentry ? [{ kind: "dato" as const, text: cfg.reentry.note }] : []),
      ...Object.values(cfg.listedWithoutMatches ?? {}).map((text) => ({ kind: "retiro" as const, text })),
    ],
    ...(cfg.withdrawn && { withdrawn: cfg.withdrawn }),
    ...(cfg.pointAdjustments && { pointAdjustments: cfg.pointAdjustments }),
    publishedTable: cfg.publishedTable ?? publishedTable,
    ...(cfg.tableIncludesPlayoffs && { tableIncludesPlayoffs: true }),
    ...(groups.length && { groups }),
    ...(cfg.tableNote && { tableNote: cfg.tableNote }),
    ...(cfg.knownTableDiffs && { knownTableDiffs: cfg.knownTableDiffs }),
    matches,
  };

  // Tablas con columnas de local y visitante: controlan que cada partido figure con la localía correcta.
  if (splits.size) {
    const calc = new Map<string, number[]>();
    const add = (id: string, i: number) => {
      if (!calc.has(id)) calc.set(id, [0, 0, 0, 0, 0, 0]);
      calc.get(id)![i]++;
    };
    for (const m of matches) {
      if (m.status === "annulled" || m.phase !== "league") continue;
      const w = m.bothLost ? undefined : winnerOf(m);
      add(m.homeId, m.bothLost ? 2 : w === null ? 1 : w === m.homeId ? 0 : 2);
      add(m.awayId, m.bothLost ? 5 : w === null ? 4 : w === m.awayId ? 3 : 5);
    }
    const known = new Set(cfg.knownTableDiffs?.keys ?? []);
    for (const [id, pub] of splits) {
      const c = calc.get(id) ?? [0, 0, 0, 0, 0, 0];
      if (pub.join() !== c.join() && !known.has(`${id}:local`))
        warnings.push(`Local/visitante distinto para ${id}: publicado ${pub.slice(0, 3).join("-")} / ${pub.slice(3).join("-")}, calculado ${c.slice(0, 3).join("-")} / ${c.slice(3).join("-")}`);
    }
  }

  // Segunda fuente: Wikipedia. Los partidos que coinciden suman la fuente.
  if (cfg.wiki) {
    const cmp = await compareWithWikipedia(cfg, season);
    warnings.push(...cmp.warnings);
    for (const p of cmp.problems) {
      const key = Object.keys(cfg.wikiErrata ?? {}).find((k) => p.includes(k));
      if (key) warnings.push(`Errata de Wikipedia ya revisada: ${p.split(" [")[0]} → ${cfg.wikiErrata![key]}`);
      else problems.push(p);
    }
    const unusedErrata = Object.keys(cfg.wikiErrata ?? {}).filter((k) => !cmp.problems.some((p) => p.includes(k)));
    if (unusedErrata.length) warnings.push(`Erratas configuradas que ya no aparecen: ${unusedErrata.join(", ")}`);
  }

  problems.push(...verifySeason(season).map((p) => `Tabla: ${p}`));
  if (cfg.kind === "cup") {
    const cup = verifyCup(season, cfg);
    problems.push(...cup.problems);
    warnings.push(...cup.warnings);
  }
  // Copas por grupos (y fases aparte de una liga, 1969): la tabla de cada fase, recalculada con sus partidos,
  // contra la que publica la fuente.
  {
    for (const gt of cfg.groupTables ?? []) {
      const rows = tables[gt.table] ?? [];
      if (!rows.length) {
        problems.push(`Grupo ${gt.stage}: no encontré la tabla ${gt.table}`);
        continue;
      }
      const re = new RegExp(gt.stage);
      const sub: Season = { ...season, matches: season.matches.filter((m) => re.test(m.stage ?? "")), publishedTable: [], tableIncludesPlayoffs: true };
      const calc = new Map(computeTable(sub).map((r) => [r.teamId, r]));
      let ok = 0;
      for (const r of rows) {
        const t = resolveName(r.name.replace(/^\.\s*/, ""), cfg.year);
        if (!t) {
          problems.push(`Grupo ${gt.stage}: nombre sin identificar "${r.name}"`);
          continue;
        }
        const c = calc.get(t.id);
        const diffs = (["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"] as const).filter((k) => (c?.[k] ?? 0) !== r[k]);
        const known = gt.knownDiffs?.[t.id];
        if (diffs.length && !known) problems.push(`Grupo ${gt.stage}: ${t.id} ${diffs.map((k) => `${k} calculado ${c?.[k] ?? 0}, publicado ${r[k]}`).join(", ")}`);
        else if (diffs.length) warnings.push(`Grupo ${gt.stage}: diferencia ya revisada en ${t.id}: ${known}`);
        else ok++;
      }
      warnings.push(`Grupo ${gt.stage}: la tabla coincide en ${ok} de ${rows.length} equipos`);
    }
  }
  if (cfg.kind === "cup") {
    // Completitud: la lista de participantes de la página contra los equipos que tienen partidos.
    const listed = participantsOf(section.text, cfg.year);
    if (listed) {
      const played = new Set(season.matches.flatMap((m) => [m.homeId, m.awayId]));
      for (const id of listed.ids)
        if (!played.has(id) && !cfg.listedWithoutMatches?.[id]) problems.push(`Participantes: ${id} figura en la lista y no tiene partidos`);
      for (const id of played) if (!listed.ids.has(id)) warnings.push(`Participantes: ${id} tiene partidos y no figura en la lista`);
      if (listed.unknown.length) warnings.push(`Participantes: nombres sin identificar en la lista: ${listed.unknown.join(", ")}`);
      warnings.push(`Participantes: ${listed.ids.size} en la lista, ${played.size} con partidos`);
    }
  }
  const raw = rawTableDiffs(season).map((p) => p.split(" ")[0].replace(/:$/, "") + ":" + p.split(" ")[1]);
  const stale = (cfg.knownTableDiffs?.keys ?? []).filter((k) => !k.endsWith(":local") && !raw.includes(k));
  if (stale.length) problems.push(`Diferencias explicadas que ya no aparecen (revisar config): ${stale.join(", ")}`);
  return { season, problems, warnings };
}

// Lista "Participating teams:" de las páginas de copa: "Alumni Football Team      Buenos Aires".
// Los nombres completos ambiguos ("Club Atlético Argentino", de Rosario) se identifican con la ciudad.
function participantsOf(text: string[], year: number): { ids: Set<string>; unknown: string[] } | null {
  const start = text.findIndex((l) => /^\.?\s*(Participating (?:teams|clubs)|Teams)[:.]?$/i.test(l));
  if (start < 0) return null;
  const ids = new Set<string>();
  const unknown: string[] = [];
  for (const line of text.slice(start + 1)) {
    if (/^Club\s{2,}(Venue|City)/i.test(line)) continue;
    if (/:$|rounds?$|^\.\s|^(Preliminary|First|1\/\d+|Quarter|Semi|Final|Playoff)\b|^Note/i.test(line)) break;
    const cols = line.split(/\s{2,}/);
    // A veces la ciudad va separada por un solo espacio ("Club Atlético Rosario Central Rosario"): se prueban prefijos.
    const words = cols[0].split(" ");
    const city = cols.slice(1).join(" ") || cols[0];
    const cityHint = /Rosario/.test(city) ? " (Rosario)" : /La Plata/.test(city) ? " (La Plata)" : "";
    let hit: ReturnType<typeof resolveName> = null;
    for (let n = words.length; n > 0 && !hit; n--) {
      const name = words.slice(0, n).join(" ");
      hit = resolveName(name + cityHint, year) ?? resolveName(name, year) ?? resolveName(name.replace(/^Club Atl[eé]t?ico /, ""), year);
    }
    if (hit) ids.add(hit.id);
    else unknown.push(line);
  }
  return { ids, unknown };
}

// Resumen de una copa a partir de su final, cuando la configuración no trae uno propio.
function cupSummary(cfg: TournamentConfig, matches: Match[]): string {
  const name = (id: string) => {
    const r = resolveName(id, cfg.year);
    return r?.name ?? id;
  };
  const final = matches.filter((m) => /^Final\b/.test(m.stage ?? "") && m.status !== "annulled").sort((a, b) => a.id.localeCompare(b.id)).pop();
  const champ = cfg.championIds.map((id) => getTeam(id)?.name ?? name(id)).join(" y ");
  if (!final) return `${champ} ganó la ${cfg.tournament}.`;
  const rival = final.homeId === cfg.championIds[0] ? final.awayId : final.homeId;
  const score = final.walkover
    ? "por no presentación del rival"
    : final.homeId === cfg.championIds[0]
      ? `${final.homeGoals}-${final.awayGoals}`
      : `${final.awayGoals}-${final.homeGoals}`;
  const teams = new Set(matches.flatMap((m) => [m.homeId, m.awayId])).size;
  return `${champ} ganó la ${cfg.tournament}: en la final le ganó ${score} a ${getTeam(rival)?.name ?? rival}. Participaron ${teams} equipos y se jugaron ${matches.length} partidos.`;
}

// Controles propios de las copas (no tienen tabla de liga):
// 1. El ganador de la final es el campeón configurado, y el finalista el subcampeón.
// 2. La final coincide con el índice de copas de RSSSF (argcuphist.html), un documento distinto a la página de la edición.
// 3. En las rondas de eliminación, un equipo que perdió no vuelve a jugar después (salvo desempates y fases de grupos).
function verifyCup(season: Season, cfg: TournamentConfig): { problems: string[]; warnings: string[] } {
  const problems: string[] = [];
  const warnings: string[] = [];
  const counted = season.matches.filter((m) => m.status !== "annulled");
  const finals = counted.filter((m) => /^Final\b/.test(m.stage ?? "")).sort((a, b) => a.id.localeCompare(b.id));
  const final = finals[finals.length - 1];
  if (cfg.abandoned) {
    // Una final de ida y vuelta que quedó en la ida (Copa Argentina 1970) no define campeón.
    if (final && !/\(ida\)$/.test(final.stage ?? "")) problems.push("Copa: está marcada como suspendida pero tiene final");
  } else if (!final && cfg.noFinal) warnings.push("Copa: sin final (explicado en las notas)");
  else if (!final) problems.push("Copa: no encontré la final");
  else {
    const w = final.awardedTo ?? final.advancedId ?? (final.homeGoals > final.awayGoals ? final.homeId : final.awayGoals > final.homeGoals ? final.awayId : null);
    const loser = w === final.homeId ? final.awayId : final.homeId;
    // Título compartido (Ibarguren 1952): final empatada y los dos finalistas como campeones.
    const shared = w === null && season.championIds.length === 2 && season.championIds.includes(final.homeId) && season.championIds.includes(final.awayId);
    if (shared) warnings.push("Copa: final empatada y título compartido (así en la configuración)");
    else if (w !== season.championIds[0]) problems.push(`Copa: la final la ganó ${w ?? "nadie (empate)"}, pero el campeón configurado es ${season.championIds[0]}`);
    if (!shared && cfg.runnerUpIds && loser !== cfg.runnerUpIds[0]) problems.push(`Copa: el finalista es ${loser}, no ${cfg.runnerUpIds[0]}`);
    const idx = CUP_INDEX.get(`${cfg.file}|${cfg.year}`);
    if (idx) {
      const sc = final.walkover ? "wp:lp" : `${final.homeGoals}:${final.awayGoals}`;
      const scRev = final.walkover ? "wp:lp" : `${final.awayGoals}:${final.homeGoals}`;
      // Una final que se jugó y se resolvió por escritorio puede figurar en el índice como wp:lp.
      const awardedOk = final.awardedTo && idx.scores.includes("wp:lp");
      if (!idx.scores.length) warnings.push(`Copa: el índice de RSSSF da el campeón sin resultado (${idx.raw})`);
      else if (!awardedOk && !idx.scores.some((s) => s === sc || s === scRev) && cfg.indexErrata) warnings.push(`Copa: el índice de RSSSF da ${idx.raw}; se mantiene ${sc}: ${cfg.indexErrata}`);
      else if (!awardedOk && !idx.scores.some((s) => s === sc || s === scRev)) problems.push(`Copa: el índice de RSSSF da la final ${idx.raw}, y la página ${sc}`);
      else warnings.push(`Copa: final confirmada por el índice de RSSSF (${idx.raw})`);
    } else warnings.push("Copa: esta edición no figura en el índice de RSSSF");
  }
  if ((!season.groups?.length && !season.publishedTable.length) || cfg.checkEliminations) {
    // En el orden de la fuente (cronológico, y el único disponible cuando falta la fecha).
    const eliminated = new Map<string, string>();
    for (const m of [...counted].sort((a, b) => a.id.localeCompare(b.id))) {
      for (const id of [m.homeId, m.awayId]) {
        const out = eliminated.get(id);
        const allowed = cfg.reentry && (!cfg.reentry.teams || cfg.reentry.teams.includes(id));
        if (out && !allowed && !/desempate/i.test(m.stage ?? "")) problems.push(`Copa: ${id} quedó eliminado en ${out} y vuelve a jugar (${m.date}, ${m.stage ?? "sin fase"})`);
      }
      const w = m.awardedTo ?? m.advancedId ?? (m.homeGoals > m.awayGoals ? m.homeId : m.awayGoals > m.homeGoals ? m.awayId : null);
      // Series de ida y vuelta: la ida no elimina a nadie; en la vuelta, advancedId marca quién pasó en el global.
      if (/\(ida\)$/.test(m.stage ?? "")) continue;
      if (w && !m.bothLost && (cfg.knockoutGroups || !/Grupo|Zona|Ronda final/.test(m.stage ?? ""))) eliminated.set(w === m.homeId ? m.awayId : m.homeId, `${m.date} ${m.homeId}-${m.awayId}`);
    }
  }
  return { problems, warnings };
}

// Índice de copas de RSSSF: "archivo|año" → resultado(s) de la final (una página puede tener varias ediciones).
const CUP_INDEX = (() => {
  const map = new Map<string, { raw: string; scores: string[] }>();
  try {
    const buf = readFileSync(join(process.cwd(), ".cache", "rsssf", "argcuphist.html"));
    const html = buf.toString("utf8").includes("�") ? buf.toString("latin1") : buf.toString("utf8");
    for (const m of html.matchAll(/<a href="(?:[^"#]*\/)?([^"#/]+\.html)[^"]*">(\d{4})<\/a>([^\n]*)/gi)) {
      const line = m[3].replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "x");
      const scores = [...line.matchAll(/\b(\d+:\d+|wp:lp)\b/g)].map((x) => x[1]);
      const key = `${m[1]}|${m[2]}`;
      if (!map.has(key)) map.set(key, { raw: line.replace(/\s+/g, " ").trim(), scores });
    }
  } catch {
    /* sin índice en caché: el control se saltea */
  }
  return map;
})();

// Índice de las temporadas generadas, importadas como JSON.
function writeIndex() {
  const files = readdirSync(OUT)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const ident = (f: string) => `S_${f.replace(".json", "").replace(/-/g, "_")}`;
  const src = [
    "// Generado por scripts/import/build.ts. No editar a mano.",
    'import type { Season } from "../../../types";',
    ...files.map((f) => `import ${ident(f)} from "./${f}";`),
    "",
    `export const GENERATED_SEASONS = [${files.map(ident).join(", ")}] as Season[];`,
    "",
  ].join("\n");
  writeFileSync(join(OUT, "index.ts"), src);
}

async function main() {
  const wanted = process.argv.slice(2);
  // "copas" importa todas las copas; "copa-honor" todas las ediciones de esa copa.
  const list = [...TOURNAMENTS, ...CUP_TOURNAMENTS].filter(
    (t) => !wanted.length || wanted.some((w) => t.slug === w || String(t.year) === w || (w === "copas" && t.kind === "cup") || t.slug.startsWith(`${w}-`)),
  );
  mkdirSync(OUT, { recursive: true });
  let failed = 0;
  for (const cfg of list) {
    setLocalAliases(cfg.aliases);
    const { season, problems, warnings } = await buildTournament(cfg);
    setLocalAliases(undefined);
    const table = computeTable(season);
    console.log(`\n=== ${cfg.slug}: ${season.matches.length} partidos, ${table.length} equipos`);
    for (const w of warnings) console.log(`  · ${w}`);
    if (problems.length) {
      failed++;
      for (const p of problems) console.log(`  ✗ ${p}`);
      if (process.env.DUMP) writeFileSync(join(process.env.DUMP, `${cfg.slug}.json`), JSON.stringify(season, null, 1));
      continue;
    }
    writeFileSync(join(OUT, `${cfg.slug}.json`), JSON.stringify(season, null, 1) + "\n");
    console.log("  ✓ verificada y escrita");
  }
  writeIndex();
  process.exit(failed ? 1 : 0);
}

if (process.argv[1]?.endsWith("build.ts")) main();
