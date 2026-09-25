// Segunda fuente: compara los partidos importados con las tablas de resultados de Wikipedia en español.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { computeTable } from "../../lib/seasons";
import type { Season } from "../../lib/types";
import { resolveName } from "./aliases";
import type { TournamentConfig } from "./config";

const CACHE = join(process.cwd(), ".cache", "wiki");

// Algunas páginas escriben las tablas con sangría ("  |- ", "    ||1.º||"): se normaliza.
const unindent = (t: string) => t.replace(/^[ \t]+(?=[|!{])/gm, "");

export async function fetchWiki(title: string): Promise<string | null> {
  const raw = await fetchWikiRaw(title);
  return raw === null ? null : unindent(raw);
}

async function fetchWikiRaw(title: string): Promise<string | null> {
  mkdirSync(CACHE, { recursive: true });
  const path = join(CACHE, `${title.replace(/[^\w()-]+/g, "_")}.txt`);
  if (!existsSync(path)) {
    const url = `https://es.wikipedia.org/w/index.php?title=${encodeURIComponent(title)}&action=raw`;
    const res = await fetch(url, { headers: { "User-Agent": "Offside45-research/1.0 (datos historicos)" } });
    if (!res.ok) return null;
    writeFileSync(path, await res.text());
    await new Promise((r) => setTimeout(r, 300));
  }
  return readFileSync(path, "utf8");
}

const clean = (s: string) =>
  s
    .replace(/<ref[^>]*\/>|<ref[\s\S]*?<\/ref>/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/'''|''/g, "")
    .replace(/^[^|]*\|(?=[^|]*$)/, "")
    .trim();

export type WikiRow = { home: string; away: string; hg: number | null; ag: number | null; raw: string; date?: string };

// Filas de tablas de partidos: "Local | 3 - 1 | Visitante".
export function wikiRows(text: string): WikiRow[] {
  const rows: WikiRow[] = [];
  for (const block of text.split(/\n\|-/)) {
    const cells = block
      .split("\n")
      .filter((l) => /^[|!]/.test(l) && !/^\|[-}]/.test(l))
      .flatMap((l) => l.replace(/^[|!]/, "").split(/\|\||!!/))
      .map(clean)
      .filter(Boolean);
    for (let i = 1; i < cells.length - 1; i++) {
      const sc = cells[i].match(/^(\d+|PG|PP|PE|\?)\s*[-–:]\s*(\d+|PG|PP|PE|\?)$/);
      if (!sc) continue;
      const num = (x: string) => (/^\d+$/.test(x) ? Number(x) : null);
      rows.push({ home: cells[i - 1], away: cells[i + 1], hg: num(sc[1]), ag: num(sc[2]), raw: cells.join(" | ") });
    }
  }
  // Copas: plantillas {{Partido |local = … |resultado = 2:0 |visita = … |fecha = …}}.
  for (const t of text.matchAll(/\{\{\s*Partido\b([\s\S]*?)\n\}\}/gi)) {
    const field = (k: string) => clean(t[1].match(new RegExp(String.raw`\|\s*${k}\s*=([^\n]*)`, "i"))?.[1] ?? "");
    const sc = field("resultado").match(/(\d+)\s*[-–:]\s*(\d+)/);
    const home = field("local").replace(/^\|/, "").trim();
    const away = field("visita").replace(/^\|/, "").trim();
    if (!home || !away) continue;
    rows.push({ home, away, hg: sc ? Number(sc[1]) : null, ag: sc ? Number(sc[2]) : null, date: field("fecha") || undefined, raw: `${home} ${field("resultado")} ${away} (${field("fecha")})` });
  }
  return rows;
}

// Tablas de posiciones: filas con Equipo / PJ / G / E / P / GF / GC / Pts, en el orden de columnas que tenga la tabla.
export function wikiStandings(text: string): { team: string; values: Record<string, number> }[][] {
  const out: { team: string; values: Record<string, number> }[][] = [];
  for (const table of text.split(/\n\{\|/).slice(1)) {
    const body = table.split(/\n\|\}/)[0];
    const allRows = body.split(/\n\|-[^\n]*/);
    const hIdx = allRows.findIndex((r) => r.split("\n").some((l) => l.startsWith("!")));
    if (hIdx < 0) continue;
    const rows = allRows.slice(hIdx);
    const header = rows[0]
      .split("\n")
      .filter((l) => l.startsWith("!"))
      .flatMap((l) => l.slice(1).split("!!"))
      .map((h) => clean(h).replace(/\.$/, "").toUpperCase());
    const idx = (names: string[]) => header.findIndex((h) => names.includes(h));
    const cols = {
      team: idx(["EQUIPO", "EQUIPOS", "CLUB"]),
      played: idx(["PJ", "J"]),
      won: idx(["G", "PG"]),
      drawn: idx(["E", "PE"]),
      lost: idx(["P", "PP"]),
      goalsFor: idx(["GF"]),
      goalsAgainst: idx(["GC", "GE"]),
      points: idx(["PTS", "PUNTOS"]),
    };
    if (cols.team < 0 || cols.played < 0 || cols.goalsFor < 0) continue;
    const parsed: { team: string; values: Record<string, number> }[] = [];
    for (const r of rows.slice(1)) {
      const cells = r
        .split("\n")
        .filter((l) => /^[|!]/.test(l))
        .flatMap((l) => l.replace(/^[|!]/, "").split(/\|\||!!/))
        .map(clean);
      if (cells.length < header.length) continue;
      const values: Record<string, number> = {};
      for (const [k, i] of Object.entries(cols)) if (k !== "team" && i >= 0) values[k] = Number(cells[i]?.replace(/[^\d-]/g, ""));
      parsed.push({ team: cells[cols.team], values });
    }
    if (parsed.length) out.push(parsed);
  }
  return out;
}

export async function compareWithWikipedia(cfg: TournamentConfig, season: Season) {
  const warnings: string[] = [];
  const problems: string[] = [];
  const text = await fetchWiki(cfg.wiki!);
  if (!text) {
    warnings.push(`Wikipedia: no encontré la página "${cfg.wiki}"`);
    return { warnings, problems };
  }
  const rows = wikiRows(text);
  let matched = 0;
  const unknown = new Set<string>();
  const confirmed = new Set<string>();
  const pending: { r: WikiRow; ids: [string, string] }[] = [];
  for (const r0 of rows) {
    let r = r0;
    let h = resolveName(r.home, cfg.year);
    let a = resolveName(r.away, cfg.year);
    // En las copas Wikipedia a veces invierte local y visitante: se da vuelta la fila si así coincide.
    if (cfg.kind === "cup" && h && a && !season.matches.some((m) => m.homeId === h!.id && m.awayId === a!.id)) {
      if (season.matches.some((m) => m.homeId === a!.id && m.awayId === h!.id)) {
        r = { ...r, home: r.away, away: r.home, hg: r.ag, ag: r.hg };
        [h, a] = [a, h];
      }
    }
    if (!h || !a) {
      if (!h) unknown.add(r.home);
      if (!a) unknown.add(r.away);
      continue;
    }
    const candidates = season.matches.filter((m) => m.homeId === h.id && m.awayId === a.id);
    for (const m of candidates)
      if (r.date && /\d/.test(r.date) && m.date.length < 10) warnings.push(`Wikipedia da fecha "${r.date}" para ${m.homeId}-${m.awayId}, sin fecha completa en RSSSF (${m.date})`);
    if (!candidates.length) {
      warnings.push(`Wikipedia tiene ${r.home} ${r.hg ?? "?"}-${r.ag ?? "?"} ${r.away}, que no está en RSSSF`);
      continue;
    }
    if (r.hg === null || r.ag === null) {
      candidates.forEach((m) => m.sources.includes("wikipedia-es") || m.sources.push("wikipedia-es"));
      matched++;
      continue;
    }
    const same = candidates.find((m) => !m.scoreUnknown && !m.walkover && m.homeGoals === r.hg && m.awayGoals === r.ag);
    if (same) {
      if (!same.sources.includes("wikipedia-es")) same.sources.push("wikipedia-es");
      confirmed.add(same.id);
      matched++;
    } else pending.push({ r, ids: [h.id, a.id] });
  }
  // Una fila que no coincide pero cuyo partido ya confirmó otra fila es un nombre ambiguo en Wikipedia
  // (ej. "Belgrano Athletic" por su segundo equipo), no un resultado distinto.
  for (const { r, ids } of pending) {
    const candidates = season.matches.filter((m) => m.homeId === ids[0] && m.awayId === ids[1]);
    const c = candidates[0];
    const msg = `RSSSF ${ids[0]} ${c.homeGoals}-${c.awayGoals} ${ids[1]} (${c.date}) / Wikipedia ${r.hg}-${r.ag} [${r.raw}]`;
    if (candidates.every((m) => confirmed.has(m.id))) warnings.push(`Fila ambigua de Wikipedia (el partido ya está confirmado): ${msg}`);
    else if (c.scoreUnknown || c.walkover) warnings.push(`Wikipedia da resultado donde RSSSF no lo tiene: ${msg}`);
    else problems.push(`Resultado distinto: ${msg}`);
  }
  // Tabla de posiciones de Wikipedia contra la calculada con los partidos (control independiente del de RSSSF).
  const computed = new Map(computeTable(season).map((r) => [r.teamId, r]));
  const standings = wikiStandings(text).find((t) => t.length >= Math.min(3, computed.size));
  if (standings) {
    let ok = 0;
    for (const row of standings) {
      const t = resolveName(row.team, cfg.year);
      if (!t) {
        unknown.add(row.team);
        continue;
      }
      const calc = computed.get(t.id);
      if (!calc) continue;
      const diffs = (["played", "won", "drawn", "lost", "goalsFor", "goalsAgainst", "points"] as const).filter(
        (k) => Number.isFinite(row.values[k]) && row.values[k] !== calc[k],
      );
      if (diffs.length) warnings.push(`Tabla de Wikipedia distinta para ${t.id}: ${diffs.map((k) => `${k} ${row.values[k]} (calc ${calc[k]})`).join(", ")}`);
      else ok++;
    }
    warnings.push(`Wikipedia: tabla de posiciones coincide en ${ok} de ${standings.length} equipos`);
  } else warnings.push("Wikipedia: no encontré tabla de posiciones");

  if (unknown.size) warnings.push(`Wikipedia: nombres sin identificar: ${[...unknown].join(", ")}`);
  warnings.push(`Wikipedia: ${matched} de ${season.matches.length} partidos confirmados (${rows.length} filas leídas)`);
  return { warnings, problems };
}
