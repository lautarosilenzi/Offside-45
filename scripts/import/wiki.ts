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
      const date = cells.find((c) => /^\d{1,2} de [a-záéíóú]+/i.test(c) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(c));
      rows.push({ home: cells[i - 1], away: cells[i + 1], hg: num(sc[1]), ag: num(sc[2]), raw: cells.join(" | "), date });
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
  // Plantilla {{Tabla de posiciones equipo|pv=2|g=..|e=..|p=..|gf=..|gc=..|desc=..|eq=[[...]]}} (desde ~1948):
  // los puntos se calculan con pv por victoria, 1 por empate y menos los descontados.
  const tpl = [...text.matchAll(/\{\{Tabla de posiciones equipo\|([^\n]*)\}\}/gi)].map((m) => {
    const f: Record<string, string> = {};
    for (const part of m[1].replace(/<ref[^>]*>.*?<\/ref>/g, "").split(/\|(?![^[]*\]\])/)) {
      const kv = part.match(/^\s*(\w+)\s*=\s*(.*?)\s*$/);
      if (kv) f[kv[1]] = kv[2];
    }
    const n = (k: string) => Number(f[k] ?? 0);
    return {
      team: clean(f.eq ?? ""),
      values: {
        played: n("g") + n("e") + n("p"),
        won: n("g"),
        drawn: n("e"),
        lost: n("p"),
        goalsFor: n("gf"),
        goalsAgainst: n("gc"),
        points: n("g") * Number(f.pv ?? 2) + n("e") - n("desc"),
      },
    };
  });
  if (tpl.length) out.push(tpl);
  return out;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// "29 de mayo de 1919" → "1919-05-29".
function isoFromSpanish(s: string): string | null {
  const m = s.match(/(\d{1,2}) de ([a-záéíóú]+) de (\d{4})/i);
  const month = m ? MESES.indexOf(m[2].toLowerCase()) + 1 : 0;
  return m && month ? `${m[3]}-${String(month).padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
}

// Completa con Wikipedia lo que RSSSF no tiene: el día de un partido fechado solo con el año, o los goles de uno
// con "resultado no registrado". Solo cuando los dos listados de ese cruce tienen la misma cantidad de partidos
// (se emparejan en orden) y, para los goles, cuando Wikipedia da el mismo ganador que RSSSF.
function fillFromWikipedia(cfg: TournamentConfig, season: Season, rows: WikiRow[]): string[] {
  const out: string[] = [];
  const key = (a: string, b: string) => [a, b].sort().join(" ");
  const wikiByPair = new Map<string, { r: WikiRow; home: string }[]>();
  for (const r of rows) {
    const h = resolveName(r.home, cfg.year);
    const a = resolveName(r.away, cfg.year);
    if (!h || !a) continue;
    const k = key(h.id, a.id);
    wikiByPair.set(k, [...(wikiByPair.get(k) ?? []), { r, home: h.id }]);
  }
  const ordered = [...season.matches].sort((a, b) => a.id.localeCompare(b.id));
  const pairs = new Set(ordered.map((m) => key(m.homeId, m.awayId)));
  for (const k of pairs) {
    const ours = ordered.filter((m) => key(m.homeId, m.awayId) === k);
    const theirs = wikiByPair.get(k) ?? [];
    if (!theirs.length || theirs.length !== ours.length) continue;
    ours.forEach((m, i) => {
      const { r, home } = theirs[i];
      const flip = home !== m.homeId;
      const hg = flip ? r.ag : r.hg;
      const ag = flip ? r.hg : r.ag;
      const iso = r.date ? isoFromSpanish(r.date) : null;
      const filled: string[] = [];
      if (m.date.length === 4 && iso?.startsWith(String(cfg.year).slice(0, 3))) {
        m.date = iso;
        filled.push("la fecha");
      }
      if (m.scoreUnknown && hg !== null && ag !== null) {
        const w = hg > ag ? m.homeId : ag > hg ? m.awayId : undefined;
        if (w === m.winnerId) {
          m.homeGoals = hg;
          m.awayGoals = ag;
          delete m.scoreUnknown;
          delete m.winnerId;
          m.note = m.note?.replace("Resultado no registrado en los diarios de la época; solo se sabe cómo terminó.", "").trim() || undefined;
          filled.push("el resultado");
        } else out.push(`Wikipedia da ${hg}-${ag} para ${m.homeId}-${m.awayId} pero RSSSF da otro ganador: no se completa`);
      }
      if (filled.length) {
        m.note = [`RSSSF no registra ${filled.join(" ni ")}; ${filled.length > 1 ? "los datos son" : "el dato es"} de Wikipedia.`, m.note].filter(Boolean).join(" ");
        if (!m.sources.includes("wikipedia-es")) m.sources.push("wikipedia-es");
        out.push(`Completado con Wikipedia (${filled.join(" y ")}): ${m.homeId}-${m.awayId} ${m.date} ${m.homeGoals}-${m.awayGoals}`);
      }
    });
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
    // Desempates en cancha neutral: si Wikipedia da el día y ese día RSSSF tiene el cruce al revés, se da vuelta la fila.
    const md = (r.date ?? "").match(/(\d{1,2}) de ([a-záéíóú]+)/i);
    const mdKey = md && MESES.indexOf(md[2].toLowerCase()) >= 0 ? `-${String(MESES.indexOf(md[2].toLowerCase()) + 1).padStart(2, "0")}-${md[1].padStart(2, "0")}` : null;
    if (h && a && mdKey && season.matches.some((m) => m.homeId === a!.id && m.awayId === h!.id && m.date.endsWith(mdKey))) {
      r = { ...r, home: r.away, away: r.home, hg: r.ag, ag: r.hg };
      [h, a] = [a, h];
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
    // Si Wikipedia da el día y ningún partido de ese cruce cae cerca de esa fecha, la fila es de otro torneo
    // listado en la misma página (la Liguilla Pre-Libertadores de 1986), no un resultado distinto.
    const wm = (r.date ?? "").match(/(\d{1,2}) de ([a-záéíóú]+)/i);
    // También "10/05/1987".
    const wn = (r.date ?? "").match(/^(\d{1,2})\/(\d{1,2})\/\d{4}$/);
    const wDay = wm && MESES.indexOf(wm[2].toLowerCase()) >= 0 ? MESES.indexOf(wm[2].toLowerCase()) * 30.5 + Number(wm[1]) : wn ? (Number(wn[2]) - 1) * 30.5 + Number(wn[1]) : null;
    const far =
      wDay !== null &&
      candidates.every((m) => {
        if (m.date.length < 10) return false;
        const d = (Number(m.date.slice(5, 7)) - 1) * 30.5 + Number(m.date.slice(8, 10));
        const diff = Math.abs(d - wDay);
        return Math.min(diff, 366 - diff) > 20;
      });
    if (far) warnings.push(`Fila de Wikipedia con una fecha que no es la de ningún partido de ese cruce (otro torneo): ${msg}`);
    else if (candidates.every((m) => confirmed.has(m.id))) warnings.push(`Fila ambigua de Wikipedia (el partido ya está confirmado): ${msg}`);
    else if (c.scoreUnknown || c.walkover) warnings.push(`Wikipedia da resultado donde RSSSF no lo tiene: ${msg}`);
    else problems.push(`Resultado distinto: ${msg}`);
  }
  if (cfg.wikiFill) warnings.push(...fillFromWikipedia(cfg, season, rows));

  // Tabla de posiciones de Wikipedia contra la calculada con los partidos (control independiente del de RSSSF).
  const computed = new Map(computeTable(season).map((r) => [r.teamId, r]));
  // Las copas no tienen tabla en Wikipedia (lo que aparece suele ser la tabla de la liga de ese año).
  // Con varios torneos en la misma página (Apertura y Clausura, 1990/91–) se toma la tabla que más se parece a la calculada.
  const fits = (t: { team: string; values: Record<string, number> }[]) =>
    t.filter((row) => {
      const c = computed.get(resolveName(row.team, cfg.year)?.id ?? "");
      return c && c.points === row.values.points && c.goalsFor === row.values.goalsFor;
    }).length;
  const standings =
    cfg.kind === "cup"
      ? undefined
      : wikiStandings(text)
          .filter((t) => t.length >= Math.min(3, computed.size))
          .reduce<ReturnType<typeof wikiStandings>[number] | undefined>((best, t) => (!best || fits(t) > fits(best) ? t : best), undefined);
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
