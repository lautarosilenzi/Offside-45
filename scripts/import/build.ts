// Importa temporadas de RSSSF, las verifica y escribe lib/data/seasons/generated/<slug>.json.
//   npx tsx scripts/import/build.ts 1897 1898   (o sin argumentos para todas las configuradas)
// Frena con error si la tabla calculada no coincide con la publicada o si hay nombres sin identificar.
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Match, Season, TableRow } from "../../lib/types";
import { computeTable, rawTableDiffs, verifySeason } from "../../lib/seasons";
import { resolveName } from "./aliases";
import { TOURNAMENTS, type TournamentConfig } from "./config";
import { fetchPage, parseSeason, type RawMatch, type RawSection } from "./rsssf-parse";
import { compareWithWikipedia } from "./wiki";

const OUT = join(process.cwd(), "lib", "data", "seasons", "generated");

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// "May 3, Sun" / "Jan 23, 1927 Sun" / "August 01, 1920" → ISO. Los meses que "vuelven atrás" pasan al año siguiente.
function parseDate(raw: string, year: number, prevMonth: number): { iso: string; month: number } | null {
  const m = raw.match(/([A-Za-z]{3})[a-z]*\.?\s*(\d{1,2})(?:,?\s*(\d{4}))?/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return null;
  let y = m[3] ? Number(m[3]) : year;
  if (!m[3] && prevMonth >= 9 && month <= 3) y = year + 1;
  return { iso: `${y}-${String(month).padStart(2, "0")}-${String(Number(m[2])).padStart(2, "0")}`, month };
}

// Traduce las notas habituales de RSSSF. Lo que no se reconoce queda citado en inglés para revisión.
export function translateNote(
  note: string,
  year: number,
): { venue?: string; text: string[]; annulled: boolean; unknown: string[]; continuedOn?: string; suspended?: boolean } {
  const out = {
    venue: undefined as string | undefined,
    text: [] as string[],
    annulled: false,
    unknown: [] as string[],
    continuedOn: undefined as string | undefined,
    suspended: false,
  };
  const parts = note
    .replace(/^\[|\]$/g, "")
    .split(/\]\s*\[|;\s*|,\s*(?=(?:aet|lasted|at|annulled|abandoned|suspended|played|awarded|n\/p)\b)/i)
    .map((p) => p.replace(/[\[\]]/g, "").trim())
    .filter(Boolean);
  for (const p of parts) {
    let m: RegExpMatchArray | null;
    if ((m = p.match(/^at (.+)$/i))) {
      const club = resolveName(m[1].replace(/\s*\(.*\)$/, ""), year);
      out.venue = club ? `Cancha de ${club.as ?? club.name}` : `Cancha de ${m[1]}`;
    } else if (/^aet$/i.test(p)) out.text.push("Con alargue.");
    else if (/^\d+\s*[:\-]\s*\d+,?\s*annulled$/i.test(p)) out.annulled = true;
    else if ((m = p.match(/^(?:aet, )?lasted (\d+)m?(?:\s*\+\s*(\d+)m?)?$/i)))
      out.text.push(m[2] ? `Duró ${m[1]} minutos más ${m[2]} de alargue.` : `Duró ${m[1]} minutos.`);
    else if (/^annulled$/i.test(p)) out.annulled = true;
    else if ((m = p.match(/^(?:suspended|abandoned) at (\d+)'?(?:m)?$/i))) out.text.push(`Suspendido a los ${m[1]} minutos.`);
    else if ((m = p.match(/^continued (?:on )?(.+)$/i))) out.continuedOn = m[1];
    else if (/^suspended$/i.test(p)) out.suspended = true;
    else if ((m = p.match(/^(.+?) withdrew(?:, see .+)?$/i))) {
      const club = resolveName(m[1], year);
      out.text.push(`${club ? club.as ?? club.name : m[1]} no se presentó.`);
    } else if (/^annulled, see .+$/i.test(p)) out.annulled = true;
    else if (/^see .+$/i.test(p)) continue;
    else if (/^awarded(?: (?:wp|lp)\s*[:\-]\s*(?:wp|lp))?$/i.test(p)) out.text.push("Resuelto por la liga.");
    else if (/^(not played|n\/p)$/i.test(p)) out.text.push("No se jugó.");
    else if (/^awarded by W\.?O\.?$/i.test(p)) continue;
    else if ((m = p.match(/^(?:abandoned|suspended) at (\d+)\s*[:\-]\s*(\d+) in (\d+)'?m?$/i)))
      out.text.push(`Suspendido a los ${m[3]} minutos, con ${m[1]}-${m[2]}.`);
    else if (resolveName(p, year)) out.venue = `Cancha de ${resolveName(p, year)!.as ?? resolveName(p, year)!.name}`;
    else if (/^[A-ZÁÉÍÓÚ][\wáéíóúñ.'-]*(?: (?:de |del |la )?[A-ZÁÉÍÓÚ][\wáéíóúñ.'-]*){0,3}$/.test(p)) out.venue = p;
    else if (/^(neutral|neutral ground)$/i.test(p)) out.text.push("Cancha neutral.");
    else if ((m = p.match(/^([A-ZÁÉÍÓÚa-záéíóúñ .'-]+), ([BC])$/))) out.venue = `${m[1]} (${m[2] === "C" ? "Capital" : "Bs. As."})`;
    else out.unknown.push(p);
  }
  return out;
}

function stageOf(raw: RawMatch): { stage?: string; phase: Match["phase"] } {
  const r = raw.round ?? "";
  const n = r.match(/(?:Round|Fecha|Matchday)\s*(\d+)/i);
  if (n) return { stage: `Fecha ${n[1]}`, phase: "league" };
  const grp = r.match(/group\s+([a-z])\b/i);
  if (grp && !/playoff|final|winner/i.test(r)) return { stage: `Grupo ${grp[1].toUpperCase()}`, phase: "league" };
  if (/third playoff/i.test(r)) return { stage: "Tercer desempate", phase: "playoff" };
  if (/second playoff/i.test(r)) return { stage: "Segundo desempate", phase: "playoff" };
  if (/playoff|play-off|replay/i.test(r)) return { stage: "Desempate", phase: "playoff" };
  if (/final/i.test(r)) return { stage: "Final", phase: "playoff" };
  return { stage: r || undefined, phase: "league" };
}

export async function buildTournament(cfg: TournamentConfig): Promise<{ season: Season; problems: string[]; warnings: string[] }> {
  const problems: string[] = [];
  const warnings: string[] = [];
  const sections = parseSeason(await fetchPage(cfg.file));
  const section: RawSection | undefined =
    typeof cfg.section === "number" ? sections[cfg.section] : sections.find((s) => (cfg.section as RegExp | undefined)?.test(s.heading) ?? s.matches.length > 0);
  if (!section) throw new Error(`${cfg.slug}: no encontré la sección`);

  const matches: Match[] = [];
  let prevMonth = 0;
  let n = 0;
  const unknownNames = new Set<string>();
  const suspendedParts: { m: Match; continuedOn: string }[] = [];

  for (const raw of section.matches) {
    const ov = cfg.overrides?.[raw.line];
    if (ov === "skip" || cfg.skip?.(raw)) continue;
    const home = resolveName(raw.home, cfg.year);
    const away = resolveName(raw.away, cfg.year);
    if (!home) unknownNames.add(raw.home);
    if (!away) unknownNames.add(raw.away);
    if (!home || !away) continue;

    const d = parseDate(raw.date, cfg.year, prevMonth);
    if (!d) {
      problems.push(`L${raw.line}: fecha ilegible "${raw.date}" (${raw.home} - ${raw.away})`);
      continue;
    }
    prevMonth = d.month;
    const note = translateNote(raw.note, cfg.year);
    if (note.unknown.length && !ov?.note) warnings.push(`L${raw.line} ${raw.home}-${raw.away}: nota sin traducir: ${note.unknown.join(" | ")}`);

    const { stage, phase } = stageOf(raw);
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
    // "void  [1-0 annulled]": se jugó y después se anuló.
    const voided = raw.note.match(/(\d+)\s*[:\-]\s*(\d+)\]?\s*\[?,?\s*annulled/i);
    if (/^(void|ann)$/.test(s) && voided) {
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
    } else if (/^wp[:\-]lp$|^lp[:\-]wp$/.test(s)) {
      m.walkover = true;
      m.awardedTo = s.startsWith("wp") ? home.id : away.id;
      note.text.unshift(`No se jugó: los puntos fueron para ${s.startsWith("wp") ? home.as ?? home.name : away.as ?? away.name}.`);
    } else if (/^[wld][:\-][wld]$/.test(s)) {
      m.scoreUnknown = true;
      if (s[0] === "w") m.winnerId = home.id;
      if (s[0] === "l") m.winnerId = away.id;
      note.text.unshift("Resultado no registrado en los diarios de la época; solo se sabe cómo terminó.");
    } else {
      // "ann", "void", "abd", ":"… no es un partido con resultado: lo decide la configuración.
      warnings.push(`L${raw.line} ${raw.home}-${raw.away}: sin resultado ("${raw.score}") ${raw.note} → omitido`);
      continue;
    }
    if (note.annulled) {
      m.status = "annulled";
      note.text.unshift("Anulado: no suma en la tabla.");
    }
    if (note.text.length) m.note = note.text.join(" ");
    if (raw.scorers) m.note = [m.note, `Goles: ${raw.scorers.replace(/;\s*/, " / ")}.`].filter(Boolean).join(" ");
    if (ov) Object.assign(m, ov);
    // Suspendido y completado otro día: RSSSF lo lista dos veces; vale la segunda aparición.
    if (note.continuedOn) {
      suspendedParts.push({ m, continuedOn: note.continuedOn });
      continue;
    }
    matches.push(m);
  }
  for (const { m: part, continuedOn } of suspendedParts) {
    const rest = matches.find((x) => x.homeId === part.homeId && x.awayId === part.awayId && x.date > part.date);
    const partial = `${part.homeGoals}-${part.awayGoals}`;
    if (rest) {
      rest.note = [`Empezó el ${part.date.split("-").reverse().slice(0, 2).join("/")} y se suspendió con ${partial}; se completó en esta fecha.`, rest.note]
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

  if (unknownNames.size) problems.push(`Nombres sin identificar: ${[...unknownNames].join(", ")}`);

  const rawTable = section.tables[cfg.tableIndex ?? 0] ?? [];
  const publishedTable: TableRow[] = [];
  for (const r of rawTable) {
    const t = resolveName(r.name, cfg.year);
    if (!t) {
      problems.push(`Tabla: nombre sin identificar "${r.name}"`);
      continue;
    }
    publishedTable.push({ teamId: t.id, played: r.played, won: r.won, drawn: r.drawn, lost: r.lost, goalsFor: r.goalsFor, goalsAgainst: r.goalsAgainst, points: r.points });
  }

  const season: Season = {
    slug: cfg.slug,
    year: cfg.year,
    ...(cfg.league && { league: cfg.league }),
    title: cfg.title,
    tournament: cfg.tournament,
    organizer: cfg.organizer,
    championIds: cfg.championIds,
    summary: cfg.summary,
    pointsPerWin: cfg.pointsPerWin ?? 2,
    sources: [{ label: `RSSSF – Argentina ${cfg.year}`, url: `https://www.rsssf.org/tablesa/${cfg.file}` }, ...(cfg.wiki ? [{ label: `Wikipedia – ${cfg.wiki}`, url: `https://es.wikipedia.org/wiki/${encodeURIComponent(cfg.wiki.replace(/ /g, "_"))}` }] : [])],
    notes: cfg.notes,
    ...(cfg.withdrawn && { withdrawn: cfg.withdrawn }),
    ...(cfg.pointAdjustments && { pointAdjustments: cfg.pointAdjustments }),
    publishedTable: cfg.publishedTable ?? publishedTable,
    ...(cfg.tableIncludesPlayoffs && { tableIncludesPlayoffs: true }),
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
  const raw = rawTableDiffs(season).map((p) => p.split(" ")[0].replace(/:$/, "") + ":" + p.split(" ")[1]);
  const stale = (cfg.knownTableDiffs?.keys ?? []).filter((k) => !raw.includes(k));
  if (stale.length) problems.push(`Diferencias explicadas que ya no aparecen (revisar config): ${stale.join(", ")}`);
  return { season, problems, warnings };
}

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
  const list = TOURNAMENTS.filter((t) => !wanted.length || wanted.some((w) => t.slug === w || String(t.year) === w));
  mkdirSync(OUT, { recursive: true });
  let failed = 0;
  for (const cfg of list) {
    const { season, problems, warnings } = await buildTournament(cfg);
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
