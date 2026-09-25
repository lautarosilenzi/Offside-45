// Importa temporadas de RSSSF, las verifica y escribe lib/data/seasons/generated/<slug>.json.
//   npx tsx scripts/import/build.ts 1897 1898   (o sin argumentos para todas las configuradas)
// Frena con error si la tabla calculada no coincide con la publicada o si hay nombres sin identificar.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Match, Season, TableRow } from "../../lib/types";
import { computeTable, rawTableDiffs, verifySeason } from "../../lib/seasons";
import { getTeam } from "../../lib/teams";
import { resolveName, setLocalAliases } from "./aliases";
import { TOURNAMENTS, type TournamentConfig } from "./config";
import { CUP_TOURNAMENTS } from "./config-cups";
import { fetchPage, parseSeason, type RawMatch, type RawSection } from "./rsssf-parse";
import { compareWithWikipedia } from "./wiki";

const OUT = join(process.cwd(), "lib", "data", "seasons", "generated");

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, set: 9, oct: 10, nov: 11, dec: 12,
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
  };
  const parts = note
    .replace(/^\[|\]$/g, "")
    .replace(/\baet( \d+m?)?,\s*/gi, "aet$1; ")
    .replace(/\bwalk ?over,\s*/gi, "walkover; ")
    // Jockey Club 1914–1918: "neutral, originally 1:0, awarded on 23 Apr, 150m, abandoned at HT, 3:0 in Annual Report, <cancha>".
    .replace(/(?<=^|[,;]\s*)(neutral|originally \d+:\d+|awarded on (?:\d{1,2} [A-Z][a-z]{2}|[A-Z][a-z]{2} ?\d{1,2})|\d+m|abandoned at HT|abandoned at \d+:\d+ in \d+m|\d+:\d+ in Annual Report)\s*,\s*/g, "$1; ")
    // "abandoned at 52m, score stood on Dec 26, Independiente, Avellaneda": cada dato por separado, y la cancha al final.
    .replace(/\b(abandoned at \d+m?|abd at \d+:\d+ in \d+m?|score stood on [A-Z][a-z]{2} \d{1,2}|disen?r+olled on [A-Z][a-z]{2} \d{1,2}),\s*/gi, "$1; ")
    // "not continued, Banfield won points" → dos partes; "on Aug 19, Sportsman won points" → sin la fecha.
    .replace(/,\s*([^,\]]+ (?:won|lost) (?:the )?points)/gi, "; $1")
    .replace(/\bon [A-Z][a-z]{2} \d{1,2}(?:, \d{4})?,\s*(?=[^,\]]+ (?:won|lost) (?:the )?points)/g, "")
    // "HT, score stood" va junto (lo traduce una sola regla); "see Jul 17", "remaining 49 on…" e "in extra time…" van aparte.
    // La cancha al final ("…, Racing, Avellaneda, B") también va aparte del texto que la precede.
    .split(
      /\]\s*\[|;\s*|,\s*(?=(?:aet|asdet|lasted|at|annulled|abandoned|suspended|played|awarded|n\/p|see|remaining|in extra time|continue on|to be replayed)\b)|(?<!HT),\s*(?=score stood\b)|,\s*(?=[^,]+,\s*[^,]+,\s*[BCS]$)/i,
    )
    .map((p) => p.replace(/[\[\]]/g, "").trim())
    .filter(Boolean);
  for (const p of parts) {
    let m: RegExpMatchArray | null;
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
    } else if ((m = p.match(/^at (.+)$/i))) {
      const club = resolveName(m[1].replace(/\s*\(.*\)$/, ""), year);
      // "at Rosario", "at Campana" (y "at Palermo" antes de que existiera el club): la ciudad o el barrio.
      if (club) out.venue = `Cancha de ${club.as ?? club.name}`;
      else out.venue = /^(Rosario|Campana|Palermo)$/.test(m[1]) ? m[1] : `Cancha de ${m[1]}`;
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
    } else if ((m = p.match(/^suspended in (\d+)'?$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
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
    else if (/^awarded(?: (?:wp|lp)\s*[:\-]\s*(?:wp|lp))?$/i.test(p)) out.text.push("Resuelto por la liga.");
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
    } else if ((m = p.match(/^(.+?) (?:withdrew championship|withdrew from the championship)$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} se había retirado del torneo.`);
    } else if ((m = p.match(/^(?:later )?(.+?) won (?:the )?points$/i))) {
      const club = resolveName(m[1], year);
      out.wonPointsBy = club?.id;
      out.text.push(`La liga le dio los puntos a ${club ? club.as ?? club.name : m[1]}.`);
    } else if (/^not continued$/i.test(p)) out.text.push("No se completó; quedó el resultado del momento de la suspensión.");
    else if ((m = p.match(/^(.+?) deducted (\d+) points?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`A ${club ? club.as ?? club.name : m[1]} le descontaron ${m[2]} puntos.`);
    }
    else if (/^second half played friendly$/i.test(p)) out.text.push("El segundo tiempo se jugó como amistoso; vale el resultado del primero.");
    else if (/^played again$/i.test(p)) continue;
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
    else if ((m = p.match(/^(.+?) lost points$/i))) {
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
    else if ((m = p.match(/^in (Rosario|Montevideo|La Plata)$/i))) out.venue = m[1];
    else if (/^replayed$/i.test(p)) out.text.push("Partido jugado de nuevo (el primero se anuló).");
    else if (/^to be replayed$/i.test(p)) out.text.push("Se ordenó volver a jugarlo.");
    // "2:0 in 45m" (parcial de un partido suspendido): lo usa el resultado "abandoned".
    else if (/^\d+:\d+ in \d+m?$/.test(p)) continue;
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
  const r = (raw.round ?? "").replace(/:$/, "").trim();
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
  if (/^(Final Phase|Ruedas finales)/i.test(raw.region ?? "")) return stage;
  const region = raw.region?.replace(/^Porteños?$/i, "Buenos Aires").replace(/^Rosarios?$/i, "Rosario").replace(/^National$/i, "Fase nacional");
  if (region && stage && stage !== "Final" && !/nacional/i.test(stage)) return `${region} · ${stage}`;
  return stage ?? region;
}

function stageOf(raw: RawMatch): { stage?: string; phase: Match["phase"] } {
  const r = raw.round ?? "";
  const n = r.match(/(?:Round|Fecha|Matchday)\s*(\d+)/i);
  if (n) return { stage: `Fecha ${n[1]}`, phase: "league" };
  const grp = r.match(/group\s+([a-z])\b/i);
  if (grp && !/playoff|final|winner/i.test(r)) return { stage: `Grupo ${grp[1].toUpperCase()}`, phase: "league" };
  if (/(1st|first) half season/i.test(r)) return { stage: "Primera rueda", phase: "league" };
  if (/(2nd|second) half season/i.test(r)) return { stage: "Segunda rueda", phase: "league" };
  if (/group ([a-z]) winner playoff/i.test(r)) return { stage: `Desempate del Grupo ${r.match(/group ([a-z])/i)![1].toUpperCase()}`, phase: "playoff" };
  if (/championship final/i.test(r)) return { stage: "Final", phase: "playoff" };
  if (/third position|third place/i.test(r)) return { stage: "Tercer puesto", phase: "playoff" };
  if (/first playoff/i.test(r)) return { stage: "Primer desempate", phase: "playoff" };
  if (/third playoff/i.test(r)) return { stage: "Tercer desempate", phase: "playoff" };
  if (/second playoff/i.test(r)) return { stage: "Segundo desempate", phase: "playoff" };
  if (/playoff|play-off|replay/i.test(r)) return { stage: "Desempate", phase: "playoff" };
  if (/final/i.test(r)) return { stage: "Final", phase: "playoff" };
  return { stage: r || undefined, phase: "league" };
}

export async function buildTournament(cfg: TournamentConfig): Promise<{ season: Season; problems: string[]; warnings: string[] }> {
  const problems: string[] = [];
  const warnings: string[] = [];
  const sections = parseSeason(await fetchPage(cfg.file), { cup: cfg.kind === "cup" });
  // Por título: entre las secciones que coinciden, la que tiene más partidos (a veces el título se repite).
  let section: RawSection | undefined =
    typeof cfg.section === "number"
      ? sections[cfg.section]
      : sections
          .filter((s) => (cfg.section as RegExp | undefined)?.test(s.heading) ?? s.matches.length > 0)
          .sort((a, b) => b.matches.length - a.matches.length)[0];
  // Copas con cada zona en su propia sección: se juntan; la sección da la fase si el partido no la tiene.
  if (cfg.allSections) {
    section = {
      heading: sections.map((s) => s.heading).join(" / "),
      tables: sections.flatMap((s) => s.tables),
      text: sections.flatMap((s) => s.text),
      matches: sections.flatMap((s) => s.matches.map((m) => ({ ...m, round: m.round ?? s.heading }))),
    };
  }
  if (!section) throw new Error(`${cfg.slug}: no encontré la sección`);

  const matches: Match[] = [];
  let prevMonth = 0;
  let n = 0;
  const unknownNames = new Set<string>();
  const suspendedParts: { m: Match; continuedOn: string; replayed?: boolean }[] = [];
  const usedOverrides = new Set<string>();
  let notPlayed = 0;

  for (const raw of section.matches) {
    if (cfg.skip?.(raw) || raw.round === "friendly") continue;
    if (cfg.edition && raw.edition && raw.edition !== cfg.edition) continue;
    // Frases de las notas que el parser confundió con partidos ("NB: The abandoned River Plate 1:3 ...").
    const prose = (s: string) =>
      /^NB\b|^\.|^Then\b|[:;]|\(\d+m\)|\bis not included\b|, and,|\blater\b|\bstanding\b|\bor$|\.$/i.test(s) || s.length > 45;
    if (prose(raw.home) || prose(raw.away)) continue;
    const home = resolveName(raw.home, cfg.year);
    const away = resolveName(raw.away, cfg.year);
    if (!home) unknownNames.add(raw.home);
    if (!away) unknownNames.add(raw.away);
    if (!home || !away) continue;

    // Copas viejas sin fecha de partido: queda el año solo (se muestra "fecha sin datos"), nunca una fecha inventada.
    const d = !raw.date.trim() && cfg.kind === "cup" ? { iso: String(cfg.year), month: prevMonth } : parseDate(raw.date, cfg.year, prevMonth);
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
      ...(note.venue && { venue: note.venue }),
      sources: ["rsssf"],
    };
    let s = raw.score.toLowerCase();
    // "awd  [awarded wp:lp]": resultado dado por la liga.
    const awd = raw.note.match(/\b(wp|lp)\s*[:\-]\s*(lp|wp)\b/i);
    if (/^(awd|wo|n\/p)$/.test(s) && awd) s = `${awd[1]}:${awd[2]}`.toLowerCase();
    // "awd  [abandoned at 1-0 in 54'; Tigre lost points]": suspendido y resuelto por escritorio; queda el resultado parcial.
    const abdAwd = raw.note.match(/abandoned at (\d+)\s*[-:]\s*(\d+) in (\d+)'?/i);
    if (s === "awd" && abdAwd && note.lostPointsBy) {
      s = `${abdAwd[1]}:${abdAwd[2]}`;
      note.text = note.text.filter((t) => !/^Suspendido/.test(t));
      note.text.unshift(`Suspendido a los ${abdAwd[3]} minutos con ${abdAwd[1]}-${abdAwd[2]}; la liga resolvió el partido por escritorio.`);
    }
    // "void  [1-0 annulled]": se jugó y después se anuló.
    // También "abandoned at 2:2 in 87m, annulled on May 10": se suspendió y se anuló (se jugó de nuevo).
    const voided = raw.note.match(/(\d+)\s*[:\-]\s*(\d+)(?: in \d+m?)?\]?\s*\[?,?\s*(?:an+ul+ed|to be replayed)/i);
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
      if (orig || abd) {
        const [hg, ag] = orig ? [orig[1], orig[2]] : [abd![1], abd![2]];
        m.homeGoals = +hg;
        m.awayGoals = +ag;
        m.goalsVoid = true;
        note.text = note.text.filter((t) => !/^En la cancha había terminado|^Suspendido a los/.test(t));
        const how = orig ? `Se jugó y terminó ${hg}-${ag}` : `Se suspendió a los ${abd![3]} minutos con ${hg}-${ag}`;
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
    } else if (s === "abd" && (g = raw.note.match(/(?:abandoned|abd) at (\d+)\s*[:\-]\s*(\d+)(?: in (\d+))?/i))) {
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
    if (note.lostPointsBy) m.awardedTo = note.lostPointsBy === home.id ? away.id : home.id;
    if (note.wonPointsBy) m.awardedTo = note.wonPointsBy;
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
    if (raw.scorers && /^(played at|at |suspended|abandoned|finished|\d+-\d+ continued|reprogrammed|.* forfeited$)/i.test(raw.scorers)) {
      const extra = translateNote(raw.scorers.replace(/^played at/i, "at"), cfg.year);
      if (extra.venue) m.venue = extra.venue;
      const txt = [...extra.text, ...extra.unknown.map((u) => (/forfeited$/i.test(u) ? `${u.replace(/ forfeited$/i, "")} no se presentó.` : u))];
      if (txt.length) m.note = [m.note, ...txt].filter(Boolean).join(" ");
    } else if (raw.scorers) m.note = [m.note, `Goles: ${raw.scorers.replace(/;\s*/, " / ")}.`].filter(Boolean).join(" ");
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
  for (const extra of cfg.extraMatches ?? []) matches.push({ sources: ["rsssf"], competition: cfg.competition, ...extra } as Match);
  if (cfg.finalIsLast) {
    const last = [...matches].filter((m) => m.status !== "annulled").sort((a, b) => a.date.localeCompare(b.date)).pop();
    if (last) last.stage = "Final";
  }
  // Copas: cada desempate lleva el nombre de la fase que desempata ("Final (desempate)", "Rosario · Primera ronda (desempate)").
  if (cfg.kind === "cup") {
    let base: string | undefined;
    for (const m of [...matches].sort((a, b) => a.id.localeCompare(b.id))) {
      if (m.stage && /(^|· )Desempate$/.test(m.stage)) {
        if (base) m.stage = `${base} (desempate)`;
      } else if (m.stage && !/\(desempate\)$/.test(m.stage)) base = m.stage;
    }
  }

  if (unknownNames.size) problems.push(`Nombres sin identificar: ${[...unknownNames].join(", ")}`);
  if (notPlayed) warnings.push(`${notPlayed} partidos del fixture figuran como no jugados`);
  const unusedOverrides = Object.keys(cfg.overrides ?? {}).filter((k) => !usedOverrides.has(k));
  if (unusedOverrides.length) problems.push(`Correcciones que no encontraron su partido: ${unusedOverrides.join(", ")}`);

  const tableIdx = Array.isArray(cfg.tableIndex) ? cfg.tableIndex : [cfg.tableIndex ?? 0];
  const publishedTable: TableRow[] = [];
  const groups: { name: string; teamIds: string[] }[] = [];
  tableIdx.forEach((ti, gi) => {
    const ids: string[] = [];
    for (const r of section.tables[ti] ?? []) {
      // Nombres repetidos en la tabla (dos "Club de Gimnasia y Esgrima" en 1916): se identifican por el puesto.
      const byPos = cfg.tableAliases?.[r.pos];
      const t = byPos ? { id: byPos } : resolveName(r.name.replace(/^\.\s*/, ""), cfg.year);
      if (!t) {
        problems.push(`Tabla: nombre sin identificar "${r.name}"`);
        continue;
      }
      ids.push(t.id);
      publishedTable.push({ teamId: t.id, played: r.played, won: r.won, drawn: r.drawn, lost: r.lost, goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst, points: r.points });
    }
    if (cfg.groupNames?.[gi]) groups.push({ name: cfg.groupNames[gi], teamIds: ids });
  });

  const season: Season = {
    slug: cfg.slug,
    ...(cfg.kind && { kind: cfg.kind }),
    ...(cfg.runnerUpIds && { runnerUpIds: cfg.runnerUpIds }),
    year: cfg.year,
    ...(cfg.league && { league: cfg.league }),
    title: cfg.title,
    tournament: cfg.tournament,
    organizer: cfg.organizer,
    championIds: cfg.championIds,
    summary: cfg.summary || cupSummary(cfg, matches),
    pointsPerWin: cfg.pointsPerWin ?? 2,
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
  const stale = (cfg.knownTableDiffs?.keys ?? []).filter((k) => !raw.includes(k));
  if (stale.length) problems.push(`Diferencias explicadas que ya no aparecen (revisar config): ${stale.join(", ")}`);
  return { season, problems, warnings };
}

// Lista "Participating teams:" de las páginas de copa: "Alumni Football Team      Buenos Aires".
// Los nombres completos ambiguos ("Club Atlético Argentino", de Rosario) se identifican con la ciudad.
function participantsOf(text: string[], year: number): { ids: Set<string>; unknown: string[] } | null {
  const start = text.findIndex((l) => /^(Participating teams|Teams):?$/i.test(l));
  if (start < 0) return null;
  const ids = new Set<string>();
  const unknown: string[] = [];
  for (const line of text.slice(start + 1)) {
    if (/^Club\s{2,}(Venue|City)/i.test(line)) continue;
    if (/:$|rounds?$|^(Preliminary|First|1\/\d+|Quarter|Semi|Final|Playoff)\b|^Note/i.test(line)) break;
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
    if (final) problems.push("Copa: está marcada como suspendida pero tiene final");
  } else if (!final) problems.push("Copa: no encontré la final");
  else {
    const w = final.awardedTo ?? (final.homeGoals > final.awayGoals ? final.homeId : final.awayGoals > final.homeGoals ? final.awayId : null);
    const loser = w === final.homeId ? final.awayId : final.homeId;
    if (w !== season.championIds[0]) problems.push(`Copa: la final la ganó ${w ?? "nadie (empate)"}, pero el campeón configurado es ${season.championIds[0]}`);
    if (cfg.runnerUpIds && loser !== cfg.runnerUpIds[0]) problems.push(`Copa: el finalista es ${loser}, no ${cfg.runnerUpIds[0]}`);
    const idx = CUP_INDEX.get(`${cfg.file}|${cfg.year}`);
    if (idx) {
      const sc = final.walkover ? "wp:lp" : `${final.homeGoals}:${final.awayGoals}`;
      const scRev = final.walkover ? "wp:lp" : `${final.awayGoals}:${final.homeGoals}`;
      if (!idx.scores.some((s) => s === sc || s === scRev)) problems.push(`Copa: el índice de RSSSF da la final ${idx.raw}, y la página ${sc}`);
      else warnings.push(`Copa: final confirmada por el índice de RSSSF (${idx.raw})`);
    } else warnings.push("Copa: esta edición no figura en el índice de RSSSF");
  }
  if (!season.groups?.length && !season.publishedTable.length) {
    // En el orden de la fuente (cronológico, y el único disponible cuando falta la fecha).
    const eliminated = new Map<string, string>();
    for (const m of [...counted].sort((a, b) => a.id.localeCompare(b.id))) {
      for (const id of [m.homeId, m.awayId]) {
        const out = eliminated.get(id);
        const allowed = cfg.reentry && (!cfg.reentry.teams || cfg.reentry.teams.includes(id));
        if (out && !allowed && !/desempate/i.test(m.stage ?? "")) problems.push(`Copa: ${id} quedó eliminado en ${out} y vuelve a jugar (${m.date}, ${m.stage ?? "sin fase"})`);
      }
      const w = m.awardedTo ?? (m.homeGoals > m.awayGoals ? m.homeId : m.awayGoals > m.homeGoals ? m.awayId : null);
      if (w && !m.bothLost && !/Grupo|Zona/.test(m.stage ?? "")) eliminated.set(w === m.homeId ? m.awayId : m.homeId, `${m.date} ${m.homeId}-${m.awayId}`);
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
      continue;
    }
    writeFileSync(join(OUT, `${cfg.slug}.json`), JSON.stringify(season, null, 1) + "\n");
    console.log("  ✓ verificada y escrita");
  }
  writeIndex();
  process.exit(failed ? 1 : 0);
}

if (process.argv[1]?.endsWith("build.ts")) main();
