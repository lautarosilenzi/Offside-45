// Lee las tablas de campeones de los artículos de Wikipedia descargados (*.wiki) y deja, por competencia, la lista
// temporada → campeón (y subcampeón cuando la tabla lo tiene).
const fs = require("fs");

function clean(s) {
  return (s || "")
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Selecciones: {{fb|ESP}} → "@ESP" (el código se traduce después). Va antes que el resto porque a veces viene adentro
    // de otra plantilla ({{nowrap|{{fbw|NOR}}}}). {{fb|ARG}}, {{fbw|USA}}, {{fbu|20|ARG}}, {{fbu-big|20|URS}}…; los íconos
    // solos ({{fbicon}}) se sacan abajo.
    .replace(/\{\{(?!fbicon|fbaicon)fb[a-z-]*\|(?:\d+\|)?([^|{}]+)[^{}]*\}\}/g, (_, x) => `@${x.trim()}`) // código ("ARG") o nombre ("Norway")
    .replace(/\{\{(?:nowrap|nobr|small|big|sortname)\|([^{}]*)\}\}/gi, (m, x) => x.split("|").slice(0, 2).join(" "))
    .replace(/\{\{(?:fbaicon|fbicon|flagicon|flag|flagcountry|flagu)\|[^{}]*\}\}/gi, "")
    .replace(/\{\{(?:sort|sortname)\|[^|{}]*\|([^{}]*)\}\}/gi, "$1")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\[https?:[^\s\]]+\s?([^\]]*)\]/g, "$1")
    .replace(/'''?/g, "")
    .replace(/<br\s*\/?>/gi, " / ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/[\s ]+/g, " ")
    .replace(/^\s*\|+\s*/, "")
    .trim();
}

// Lo que sobra al final de un nombre: "(36)" (cantidad de títulos), "(a)" (nota), "†", "*"… en cualquier orden.
function tail(s) {
  let prev;
  do {
    prev = s;
    s = s
      .replace(/\s*\{\{.*$/, "") // plantilla que quedó abierta
      .replace(/\s*\((?:PD|CA|TC|CLP|CL|SC|CdL|LP|C)\)\s*$/, "") // por qué torneo clasificó (Supercopa, Trofeo de Campeones)
      .replace(/\s*\(Level \d\)\s*$/i, "") // "(Level 2)": categoría del club
      .replace(/\s*\((?:\d+|[a-z]|\d+ titles?)\)\s*$/i, "")
      .replace(/\s*[*†‡§#^]+\s*$/g, "")
      .trim();
  } while (s !== prev);
  return s;
}

// Separa una celda "atributos | contenido"; devuelve {attrs, text}.
function splitCell(c) {
  // Un "|" que no está dentro de [[ ]] ni {{ }} separa atributos de contenido.
  let depth = 0;
  for (let i = 0; i < c.length; i++) {
    if (c.startsWith("[[", i) || c.startsWith("{{", i)) {
      depth++;
      i++;
    } else if (c.startsWith("]]", i) || c.startsWith("}}", i)) {
      depth--;
      i++;
    } else if (c[i] === "|" && depth === 0) {
      const attrs = c.slice(0, i);
      if (/=/.test(attrs) && !/\[\[|\{\{/.test(attrs)) return { attrs, text: c.slice(i + 1) };
      break;
    }
  }
  return { attrs: "", text: c };
}

function splitTop(line, sep) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    if (line.startsWith("[[", i) || line.startsWith("{{", i)) {
      depth++;
      cur += line.slice(i, i + 2);
      i++;
      continue;
    }
    if (line.startsWith("]]", i) || line.startsWith("}}", i)) {
      depth--;
      cur += line.slice(i, i + 2);
      i++;
      continue;
    }
    if (depth === 0 && line.startsWith(sep, i)) {
      out.push(cur);
      cur = "";
      i += sep.length - 1;
      continue;
    }
    cur += line[i];
  }
  out.push(cur);
  return out;
}

function tables(w) {
  const out = [];
  const re = /\{\|[^\n]*wikitable[^\n]*\n([\s\S]*?)\n\|\}/g;
  let m;
  while ((m = re.exec(w))) out.push({ body: m[1], at: m.index });
  return out;
}

function parseTable(body) {
  const rows = [];
  const carry = []; // rowspans pendientes: {col, left, cell}
  for (const raw of ("\n" + body).split(/\n\|-[^\n]*/)) {
    const lines = raw.split("\n").filter((l) => /^[|!]/.test(l) && !/^\|\+/.test(l));
    if (!lines.length) continue;
    const cells = [];
    let header = false;
    for (const l of lines) {
      const isH = l.startsWith("!");
      header = header || isH;
      const parts = splitTop(l.slice(1), isH ? "!!" : "||").flatMap((p) => (isH ? splitTop(p, "||") : [p]));
      for (const p of parts) {
        const { attrs, text } = splitCell(p);
        const rs = Number((attrs.match(/rowspan\s*=\s*"?(\d+)/) || [])[1] || 1);
        const cs = Number((attrs.match(/colspan\s*=\s*"?(\d+)/) || [])[1] || 1);
        for (let k = 0; k < cs; k++) cells.push({ text: tail(clean(text)), rs, isH });
      }
    }
    // Insertar las celdas que vienen de rowspans de filas anteriores.
    const full = [];
    let ci = 0;
    for (let col = 0; ci < cells.length || carry.some((c) => c && c.col >= col && c.left > 0); col++) {
      const c = carry[col];
      if (c && c.left > 0) {
        full.push(c.cell);
        c.left--;
      } else if (ci < cells.length) {
        const cell = cells[ci++];
        full.push(cell);
        if (cell.rs > 1) carry[col] = { col, left: cell.rs - 1, cell };
      } else break;
      if (col > 40) break;
    }
    rows.push({ header, cells: full.map((c) => c.text) });
  }
  return rows;
}

const SEASON = /^(season|year|edition|years?|seasons|campaign|tournament|temporada|date)$/i;
const CHAMP = /^(champions?|winners?|winning (club|team)|champion club|title winners?|league champions|gold( medal(s|ists?)?)?)(\s*\(.*\))?$/i;
const RUNNER = /^(runners?-?up|runner-up|runners up|second place|second|finalist|losing (club|team)|silver( medal(s|ists?)?)?)(\s*\(.*\))?$/i;

function extract(w, opts = {}) {
  const res = [];
  let ts = tables(w);
  if (opts.after) {
    const i = w.search(opts.after);
    if (i >= 0) ts = ts.filter((t) => t.at > i);
  }
  if (opts.before) {
    const i = w.search(opts.before);
    if (i >= 0) ts = ts.filter((t) => t.at < i);
  }
  if (opts.only) ts = ts.filter((_, i) => opts.only.includes(i));
  for (const t of ts) {
    const rows = parseTable(t.body);
    const hi = rows.findIndex((r) => r.header);
    if (hi < 0) continue;
    // Puede haber dos filas de encabezado; se usa la que tiene las columnas buscadas.
    let head = rows[hi].cells;
    let start = hi + 1;
    if (!head.some((h) => SEASON.test(h)) && rows[hi + 1]?.header) {
      head = rows[hi + 1].cells;
      start = hi + 2;
    }
    // Temporada: primero "Season"/"Year", después "Date" (la columna "Ed." es el número de edición).
    let s = opts.seasonCol ?? head.findIndex((h) => /^(season|year|seasons|years|temporada)$/i.test(h));
    if (s < 0) s = head.findIndex((h) => SEASON.test(h));
    let c = opts.champCol !== undefined ? opts.champCol : head.findIndex((h) => CHAMP.test(h));
    let r = head.findIndex((h) => RUNNER.test(h));
    // "Winners" abarca dos columnas (país y club): el club está en la segunda fila del encabezado.
    const sub = rows[start]?.header ? rows[start].cells : null;
    if (sub && c >= 0 && head[c + 1] === head[c]) {
      const k = [c, c + 1].find((i) => /^(team|club)$/i.test(sub[i] ?? ""));
      if (k !== undefined) c = k;
      if (r >= 0 && head[r + 1] === head[r]) {
        const kr = [r, r + 1].find((i) => /^(team|club)$/i.test(sub[i] ?? ""));
        if (kr !== undefined) r = kr;
      }
      start++;
    } else if (sub && c < 0) {
      // "Final" arriba y "Winners | Score | Runners-up" abajo (torneos de selecciones).
      c = sub.findIndex((h) => CHAMP.test(h));
      r = sub.findIndex((h) => RUNNER.test(h));
      if (s < 0) s = sub.findIndex((h) => /^(season|year|seasons|years|edition)$/i.test(h));
      start++;
    }
    if (s < 0 || c < 0) continue;
    for (const row of rows.slice(start)) {
      if (row.header && !row.cells[s]) continue;
      let season = row.cells[s];
      let champ = row.cells[c];
      if (opts.yearFromDate) season = (season?.match(/\d{4}/) ?? [])[0]; // "5 May 1918" → "1918"
      // La temporada empieza con el año ("1931–32", "2026 Apertura") o con el torneo corto ("Ape–2002"); las filas de título
      // ("Amateur era (1893–1929)") no.
      if (!season || !champ) continue;
      const short = season.match(/^(Ape|Cla|Inv|Ver|Pri|Bic|Apertura|Clausura|Invierno|Verano|Primavera|Bicentenario|México|Prode)[\s.–-]*(\d{2,4})$/i);
      if (short) {
        const NAMES = { ape: "Apertura", cla: "Clausura", inv: "Invierno", ver: "Verano", pri: "Primavera", bic: "Bicentenario" };
        const y = short[2].length === 2 ? `19${short[2]}` : short[2];
        season = `${NAMES[short[1].toLowerCase()] ?? short[1]} ${y}`;
      } else if (!/^\d{4}/.test(season)) continue;
      // Finales de ida y vuelta: "Juventus won 5–2 on aggregate." / "2–2 on aggregate; Roma won 4–2 on penalties."
      const won = champ.match(/(?:^|;\s*)([^;]+?) won\b/);
      if (won) champ = won[1].trim();
      champ = champ.replace(/\s*\((?:I{1,3}|IV)\)$/, "").trim(); // "(II)": categoría del club
      if (/^\d+\s*[–-]\s*\d+/.test(champ)) continue; // quedó un resultado en lugar del campeón
      res.push({ season, champion: alias(champ, opts.alias), runnerUp: r >= 0 && row.cells[r] ? alias(row.cells[r], opts.alias) : undefined });
    }
  }
  // Duplicados: la misma temporada y el mismo campeón (rowspans); en las finales de ida y vuelta, una sola fila por temporada.
  const seen = new Map();
  for (const x of res) {
    // dedupe: 'season' (finales de ida y vuelta), 'champion' (desempates con el mismo campeón), o nada (ligas con dos torneos por año).
    const mode = opts.twoLegs ? 'season' : opts.dedupe;
    const k = mode === 'season' ? x.season : mode === 'champion' ? x.season + '|' + x.champion : seen.size + '|' + Math.random();
    if (!seen.has(k)) seen.set(k, x);
  }
  let out = [...seen.values()];
  if (opts.exclude) out = out.filter((x) => !opts.exclude.includes(x.season));
  if (opts.from) out = out.filter((x) => Number(x.season.slice(0, 4)) >= opts.from);
  return out;
}

// Nombres viejos o alternativos → el nombre con el que se lo conoce hoy (los títulos se suman al club).
const ALIAS = {
  "Madrid FC": "Real Madrid",
  "Madrid CF": "Real Madrid",
  Madrid: "Real Madrid",
  "Atlético Aviación": "Atlético Madrid",
  "Atlético Bilbao": "Athletic Bilbao",
  "Athletic Club": "Athletic Bilbao",
  "RCD Español": "Espanyol",
  Español: "Espanyol",
  "The Wednesday": "Sheffield Wednesday",
  "Small Heath": "Birmingham City",
  "Wolverhampton Wanderers F.C. Wolverhampton Wanderers": "Wolverhampton Wanderers",
  "Newton Heath": "Manchester United",
  "Ambrosiana-Inter": "Inter",
  Ambrosiana: "Inter",
  Internazionale: "Inter",
  "Inter Milan": "Inter",
  Genova: "Genoa",
  "Kansas City Wizards": "Sporting Kansas City",
  "Los Angeles Galaxy": "LA Galaxy",
  "TSV 1860 Munich": "1860 Munich",
  "Atlético Paranaense": "Athletico Paranaense",
  "Red Star Saint-Ouen": "Red Star",
  "CS Metz": "Metz",
  "@FRG": "@GER",
  "Sport": "Sport Recife",
};
function alias(name, extra = {}) {
  const rep = name.match(/^(.+?) (?:A.)?F.?C.? (.+)$/);
  if (rep && rep[1] === rep[2]) name = rep[1];
  return extra[name] ?? ALIAS[name] ?? name;
}

module.exports = { extract, tables, parseTable, clean, tail };

if (require.main === module) {
  const id = process.argv[2];
  const w = fs.readFileSync(`${id}.wiki`, "utf8");
  const rows = extract(w);
  console.log(id, rows.length);
  console.log(rows.slice(0, 3), rows.slice(-3));
}
