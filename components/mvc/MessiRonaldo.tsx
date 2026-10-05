"use client";

import { useMemo, useState } from "react";
import SeriesChart from "@/components/charts/SeriesChart";
import BaseDuel from "@/components/compare/Duel";
import Flag from "@/components/Flag";
import {
  ADVANCED,
  ALL_GOALS_WITH_YOUTH,
  AWARDS,
  BALLON_VOTES,
  BY_COMPETITION,
  CAREER,
  CAREER_EUROPE,
  CLUBS,
  CLUB_SEASONS,
  CONTINENTAL,
  FINALS,
  H2H_ASSISTS,
  H2H_MATCHES,
  H2H_SUMMARY,
  INTL_BY_COMPETITION,
  INTL_YEARS,
  PROFILES,
  TITLES,
  TITLES_CONTESTED,
  WORLD_CUPS,
  YOUTH,
  type PlayerKey,
  type Tournament,
} from "@/lib/data/messi-ronaldo";

const M = PROFILES.messi;
const R = PROFILES.ronaldo;
const KEYS: PlayerKey[] = ["messi", "ronaldo"];
const fmt = (v: number, decimals = 0) => v.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);

export const SECTIONS = [
  { id: "numeros", label: "Números" },
  { id: "porcentajes", label: "Porcentajes" },
  { id: "evolucion", label: "Evolución" },
  { id: "equipos", label: "Por equipo" },
  { id: "torneos", label: "Torneos" },
  { id: "cara-a-cara", label: "Cara a cara" },
  { id: "titulos", label: "Títulos" },
  { id: "goles", label: "Sus goles" },
  { id: "juego", label: "Datos de juego" },
];

export default function MessiRonaldo() {
  return (
    <div className="space-y-12">
      <nav className="sticky top-[4.6rem] z-20 -mx-1 flex gap-1 overflow-x-auto rounded-full bg-white/95 p-1 shadow ring-1 ring-navy-100 [scrollbar-width:none] sm:top-20 [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide text-navy-700 transition hover:bg-brand-50 hover:text-brand-600">
            {s.label}
          </a>
        ))}
      </nav>
      <Numbers />
      <Percentages />
      <Evolution />
      <Teams />
      <Tournaments />
      <HeadToHead />
      <Titles />
      <Goals />
      <Advanced />
    </div>
  );
}

/* ── Piezas comunes ─────────────────────────────────────────────────────────────────────────────────────────── */

function Section({ id, title, intro, children }: { id: string; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36">
      <h2 className="section-title mb-1">{title}</h2>
      {intro && <p className="mb-4 max-w-3xl text-sm text-navy-500">{intro}</p>}
      {!intro && <div className="mb-3" />}
      {children}
    </section>
  );
}

function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`btn-press rounded-full px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-wide ring-1 transition ${
            value === o.id ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-navy-700 ring-navy-200 hover:ring-brand-400"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PlayersHeader() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-navy-100 px-4 py-2 font-display text-sm font-bold uppercase tracking-wide">
      <span className="flex items-center gap-2" style={{ color: M.color }}>
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: M.color }} /> {M.short}
      </span>
      <span />
      <span className="flex items-center justify-end gap-2" style={{ color: R.color }}>
        {R.short} <span className="h-2.5 w-2.5 rounded-sm" style={{ background: R.color }} />
      </span>
    </div>
  );
}

// Fila enfrentada con los colores de cada uno.
function Duel(props: Omit<React.ComponentProps<typeof BaseDuel>, "colorA" | "colorB">) {
  return <BaseDuel {...props} colorA={M.color} colorB={R.color} />;
}

function Ring({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 80 80" className="h-24 w-24" role="img" aria-label={`${label}: ${fmt(value, 1)}%`}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e1e7f0" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 40 40)" className="transition-[stroke-dasharray] duration-700" />
        <text x="40" y="45" textAnchor="middle" className="fill-navy-950 font-display" fontSize="17" fontWeight="800">
          {fmt(value, 1)}%
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

/* ── 1. Números ─────────────────────────────────────────────────────────────────────────────────────────────── */

type Scope = "carrera" | "europa" | "clubes" | "seleccion" | "ligas" | "champions" | "mundial" | "continental";
const SCOPES: { id: Scope; label: string }[] = [
  { id: "carrera", label: "Toda la carrera" },
  { id: "europa", label: "Solo Europa" },
  { id: "clubes", label: "Clubes" },
  { id: "seleccion", label: "Selección" },
  { id: "ligas", label: "Ligas" },
  { id: "champions", label: "Champions" },
  { id: "mundial", label: "Mundiales" },
  { id: "continental", label: "Copa América / Euro" },
];

function Numbers() {
  const [scope, setScope] = useState<Scope>("carrera");
  const stat = (p: PlayerKey) => {
    if (scope === "carrera") return { ...CAREER[p], note: undefined };
    if (scope === "europa") return { ...CAREER_EUROPE[p], hatTricks: null, minutes: null, note: "Sin la MLS ni la liga saudí (clubes y selección)." };
    const c = BY_COMPETITION.find((x) => x.id === scope)!;
    return { ...c[p], minutes: null, note: c.note };
  };
  const a = stat("messi");
  const b = stat("ronaldo");
  return (
    <Section id="numeros" title="Los números" intro="Partidos oficiales con clubes y selección mayor. Elegí qué parte de la carrera comparar.">
      <Tabs value={scope} onChange={setScope} options={SCOPES} />
      <div className="panel overflow-hidden">
        <PlayersHeader />
        <div className="divide-y divide-navy-50">
          <Duel label="Partidos" a={a.apps} b={b.apps} />
          <Duel label="Goles" a={a.goals} b={b.goals} />
          <Duel label="Asistencias" a={a.assists} b={b.assists} />
          <Duel label="Goles + asistencias" a={a.goals + a.assists} b={b.goals + b.assists} />
          <Duel label="Goles por partido" a={a.goals / a.apps} b={b.goals / b.apps} decimals={2} />
          <Duel label="Gol o asistencia por partido" a={(a.goals + a.assists) / a.apps} b={(b.goals + b.assists) / b.apps} decimals={2} />
          {a.hatTricks !== null && b.hatTricks !== null && <Duel label="Tripletes" a={a.hatTricks} b={b.hatTricks} />}
          {a.minutes && b.minutes && <Duel label="Minutos por gol" note="menos es mejor" a={a.minutes / a.goals} b={b.minutes / b.goals} lower />}
        </div>
        {a.note && <p className="border-t border-navy-50 px-4 py-2 text-xs text-navy-400">{a.note}</p>}
      </div>
      <p className="mt-2 text-xs text-navy-400">
        Con los juveniles (Sub-15 a Sub-23, Barcelona B y C, Sporting B): Messi {fmt(ALL_GOALS_WITH_YOUTH.messi.goals)} goles en {fmt(ALL_GOALS_WITH_YOUTH.messi.apps)} partidos;
        Cristiano {fmt(ALL_GOALS_WITH_YOUTH.ronaldo.goals)} en {fmt(ALL_GOALS_WITH_YOUTH.ronaldo.apps)}.
      </p>
    </Section>
  );
}

/* ── 2. Porcentajes ─────────────────────────────────────────────────────────────────────────────────────────── */

function Percentages() {
  const h2hWins = { messi: H2H_MATCHES.filter((m) => m.winner === "messi").length, ronaldo: H2H_MATCHES.filter((m) => m.winner === "ronaldo").length };
  const cards = [
    { title: "Finales ganadas", get: (p: PlayerKey) => pct(FINALS[p].won, FINALS[p].played), sub: (p: PlayerKey) => `${FINALS[p].won} de ${FINALS[p].played}` },
    { title: "Títulos sobre torneos jugados", get: (p: PlayerKey) => pct(TITLES_CONTESTED[p].won, TITLES_CONTESTED[p].contested), sub: (p: PlayerKey) => `${TITLES_CONTESTED[p].won} de ${TITLES_CONTESTED[p].contested}` },
    { title: "Penales convertidos", get: (p: PlayerKey) => pct(CAREER[p].penaltyGoals, CAREER[p].penaltyAttempts), sub: (p: PlayerKey) => `${CAREER[p].penaltyGoals} de ${CAREER[p].penaltyAttempts}` },
    { title: "Goles sin penal", get: (p: PlayerKey) => pct(CAREER[p].goals - CAREER[p].penaltyGoals, CAREER[p].goals), sub: (p: PlayerKey) => `${fmt(CAREER[p].goals - CAREER[p].penaltyGoals)} de ${fmt(CAREER[p].goals)}` },
    { title: "Partidos ganados en el cara a cara", get: (p: PlayerKey) => pct(h2hWins[p], H2H_MATCHES.length), sub: (p: PlayerKey) => `${h2hWins[p]} de ${H2H_MATCHES.length}` },
    { title: "Podios del Balón de Oro por nominación", get: (p: PlayerKey) => pct(BALLON_VOTES[p].top3, BALLON_VOTES[p].nominations), sub: (p: PlayerKey) => `${BALLON_VOTES[p].top3} de ${BALLON_VOTES[p].nominations}` },
  ];
  return (
    <Section id="porcentajes" title="Porcentajes" intro="Las finales cuentan como una sola aunque sean de ida y vuelta. En el cara a cara, el resto de los partidos terminaron empatados.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="panel p-4">
            <h3 className="mb-3 text-center font-display text-base font-bold uppercase tracking-wide text-navy-900">{c.title}</h3>
            <div className="flex justify-around">
              {KEYS.map((p) => (
                <div key={p} className="flex flex-col items-center">
                  <Ring value={c.get(p)} color={PROFILES[p].color} label={PROFILES[p].short} />
                  <span className="text-[0.7rem] text-navy-400">{c.sub(p)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="panel mt-3 overflow-hidden">
        <PlayersHeader />
        <div className="divide-y divide-navy-50">
          <Duel label="Finales jugadas" a={FINALS.messi.played} b={FINALS.ronaldo.played} />
          <Duel label="Goles en finales" a={FINALS.messi.goals} b={FINALS.ronaldo.goals} />
          <Duel label="Asistencias en finales" a={FINALS.messi.assists} b={FINALS.ronaldo.assists} />
        </div>
      </div>
    </Section>
  );
}

/* ── 3. Evolución ───────────────────────────────────────────────────────────────────────────────────────────── */

type EvoMode = "temporadas" | "acumulado" | "seleccion";

// Temporadas de club agrupadas (en 2021–22 y 2022–23 Cristiano jugó en dos clubes).
function careerSeasons(p: PlayerKey) {
  const out: { season: string; clubs: string[]; apps: number; goals: number }[] = [];
  for (const s of CLUB_SEASONS.filter((x) => x.p === p)) {
    const last = out[out.length - 1];
    if (last && last.season === s.season) {
      last.clubs.push(s.club);
      last.apps += s.total[0] ?? 0;
      last.goals += s.total[1] ?? 0;
    } else out.push({ season: s.season, clubs: [s.club], apps: s.total[0] ?? 0, goals: s.total[1] ?? 0 });
  }
  return out;
}

function Evolution() {
  const [mode, setMode] = useState<EvoMode>("temporadas");
  const [metric, setMetric] = useState<"goals" | "apps">("goals");
  const chart = useMemo(() => {
    if (mode === "seleccion") {
      const years = Array.from({ length: 2026 - 2003 + 1 }, (_, i) => 2003 + i);
      return {
        labels: years.map(String),
        series: KEYS.map((p) => ({
          name: PROFILES[p].short,
          color: PROFILES[p].color,
          values: years.map((y) => {
            const r = INTL_YEARS.find((x) => x.p === p && x.year === y);
            return r ? (metric === "goals" ? r.total[1] : r.total[0]) : null;
          }),
          details: years.map((y) => {
            const r = INTL_YEARS.find((x) => x.p === p && x.year === y);
            return r ? `${r.total[0]} PJ · ${r.total[1]} goles (${r.friendly[1]} en amistosos)` : undefined;
          }),
        })),
      };
    }
    const seasons = KEYS.map(careerSeasons);
    const n = Math.max(...seasons.map((s) => s.length));
    return {
      labels: Array.from({ length: n }, (_, i) => `${i + 1}.ª`),
      series: KEYS.map((p, k) => {
        let acc = 0;
        return {
          name: PROFILES[p].short,
          color: PROFILES[p].color,
          values: Array.from({ length: n }, (_, i) => {
            const s = seasons[k][i];
            if (!s) return null;
            const v = metric === "goals" ? s.goals : s.apps;
            acc += v;
            return mode === "acumulado" ? acc : v;
          }),
          details: Array.from({ length: n }, (_, i) => {
            const s = seasons[k][i];
            return s ? `${s.season} · ${s.clubs.join(" y ")} · ${s.apps} PJ, ${s.goals} goles` : undefined;
          }),
        };
      }),
    };
  }, [mode, metric]);

  return (
    <Section
      id="evolucion"
      title="Temporada a temporada"
      intro="Pasá el mouse (o tocá) cada columna para ver la temporada, el club y los números. En clubes se comparan por número de temporada de su carrera, para ver a los dos en el mismo momento."
    >
      <div className="flex flex-wrap items-start gap-x-4">
        <Tabs
          value={mode}
          onChange={setMode}
          options={[
            { id: "temporadas", label: "Clubes por temporada" },
            { id: "acumulado", label: "Clubes acumulado" },
            { id: "seleccion", label: "Selección por año" },
          ]}
        />
        <Tabs value={metric} onChange={setMetric} options={[{ id: "goals", label: "Goles" }, { id: "apps", label: "Partidos" }]} />
      </div>
      <div className="panel p-4">
        <SeriesChart
          labels={chart.labels}
          series={chart.series}
          type={mode === "acumulado" ? "line" : "bar"}
          unit={metric === "goals" ? "goles" : "partidos"}
          ariaLabel={`${metric === "goals" ? "Goles" : "Partidos"} de Messi y Cristiano Ronaldo ${mode === "seleccion" ? "con la selección por año" : "en clubes por temporada"}`}
        />
        <p className="mt-1 text-xs text-navy-400">
          {mode === "seleccion" ? "Años calendario; Messi debutó en 2005 y Cristiano en 2003." : "Messi: 23 temporadas desde 2004–05 (las de la MLS son años calendario). Cristiano: 25 desde 2002–03; la temporada en curso está incompleta."}
        </p>
      </div>
    </Section>
  );
}

/* ── 4. Por equipo ──────────────────────────────────────────────────────────────────────────────────────────── */

function Teams() {
  return (
    <Section id="equipos" title="Por equipo" intro="Partidos, goles, asistencias y títulos con cada club y con su selección.">
      <div className="grid gap-4 lg:grid-cols-2">
        {KEYS.map((p) => {
          const prof = PROFILES[p];
          const maxGoals = Math.max(...CLUBS[p].map((c) => c.goals));
          const intl = BY_COMPETITION.find((c) => c.id === "seleccion")![p];
          return (
            <div key={p} className="panel overflow-hidden">
              <h3 className="flex items-center gap-2 border-b border-navy-100 px-4 py-2.5 font-display text-lg font-bold uppercase tracking-wide" style={{ color: prof.color }}>
                <span className="h-3 w-3 rounded-sm" style={{ background: prof.color }} />
                {prof.name}
              </h3>
              <ul className="divide-y divide-navy-50">
                {CLUBS[p].map((c) => (
                  <li key={c.club} className="px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-navy-950">{c.club}</span>
                      <span className="text-xs text-navy-400">{c.years}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-navy-50">
                      <div className="h-2 rounded-full" style={{ width: `${(c.goals / maxGoals) * 100}%`, background: prof.color }} />
                    </div>
                    <div className="mt-1.5 grid grid-cols-5 gap-1 text-center text-xs text-navy-500">
                      <Mini v={c.apps} l="PJ" />
                      <Mini v={c.goals} l="Goles" />
                      <Mini v={c.assists} l="Asist." />
                      <Mini v={fmt(c.goals / c.apps, 2)} l="Gol/PJ" />
                      <Mini v={c.titles} l="Títulos" />
                    </div>
                  </li>
                ))}
                <li className="bg-navy-50/60 px-4 py-3">
                  <div className="flex items-center gap-2 font-semibold text-navy-950">
                    <Flag code={prof.flag} size={14} /> Selección de {prof.country}
                  </div>
                  <div className="mt-1.5 grid grid-cols-4 gap-1 text-center text-xs text-navy-500">
                    <Mini v={intl.apps} l="PJ" />
                    <Mini v={intl.goals} l="Goles" />
                    <Mini v={intl.assists} l="Asist." />
                    <Mini v={fmt(intl.goals / intl.apps, 2)} l="Gol/PJ" />
                  </div>
                  <ul className="mt-2 space-y-0.5 text-xs text-navy-600">
                    {INTL_BY_COMPETITION[p].map((c) => (
                      <li key={c.label} className="flex justify-between gap-2">
                        <span>{c.label}</span>
                        <span className="tabular-nums">
                          {c.apps} PJ · <b className="text-navy-900">{c.goals}</b> goles
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Mini({ v, l }: { v: React.ReactNode; l: string }) {
  return (
    <div>
      <div className="font-display text-base font-bold tabular-nums text-navy-900">{v}</div>
      <div className="text-[0.65rem] uppercase tracking-wider">{l}</div>
    </div>
  );
}

/* ── 5. Torneos ─────────────────────────────────────────────────────────────────────────────────────────────── */

type TournamentTab = "mundial" | "continental" | "champions" | "ligas" | "juveniles";

function Tournaments() {
  const [tab, setTab] = useState<TournamentTab>("mundial");
  const comp = (id: string) => BY_COMPETITION.find((c) => c.id === id)!;
  return (
    <Section id="torneos" title="Torneo por torneo">
      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { id: "mundial", label: "Mundiales" },
          { id: "continental", label: "Copa América y Eurocopa" },
          { id: "champions", label: "Champions" },
          { id: "ligas", label: "Ligas" },
          { id: "juveniles", label: "Sub-20 y Juegos Olímpicos" },
        ]}
      />
      {tab === "mundial" && (
        <div className="space-y-3">
          <CompDuel id="mundial" />
          <div className="grid gap-3 md:grid-cols-2">
            {KEYS.map((p) => (
              <Editions key={p} p={p} title="Mundiales" rows={WORLD_CUPS[p]} />
            ))}
          </div>
          <p className="text-xs text-navy-400">
            Messi es el jugador con más partidos en la historia de los Mundiales y ganó dos veces el Balón de Oro del torneo (2014 y 2022). Los dos jugaron seis
            Mundiales (2006–2026); en 2026 Argentina perdió la final con España (1–0 en el alargue) y Portugal quedó afuera en octavos, también con España.
          </p>
        </div>
      )}
      {tab === "continental" && (
        <div className="space-y-3">
          <CompDuel id="continental" />
          <div className="grid gap-3 md:grid-cols-2">
            {KEYS.map((p) => (
              <Editions key={p} p={p} title={CONTINENTAL[p].name} rows={CONTINENTAL[p].editions} />
            ))}
          </div>
          <p className="text-xs text-navy-400">
            No es el mismo torneo: Messi jugó siete Copas América (campeón en 2021 y 2024) y Cristiano seis Eurocopas (campeón en 2016, goleador en 2020). Cristiano
            además ganó dos Nations League y Messi la Finalissima 2022.
          </p>
        </div>
      )}
      {tab === "champions" && (
        <div className="space-y-3">
          <CompDuel id="champions" />
          <TitleRow names={["Champions League"]} />
          <p className="text-xs text-navy-400">
            Goleadores de la Champions: Messi {AWARDS.find((a) => a.name === "Goleador de la Champions")!.count!.messi} veces, Cristiano{" "}
            {AWARDS.find((a) => a.name === "Goleador de la Champions")!.count!.ronaldo}. {comp("champions").note}
          </p>
        </div>
      )}
      {tab === "ligas" && (
        <div className="space-y-3">
          <CompDuel id="ligas" />
          <TitleRow names={["LaLiga", "Ligue 1", "MLS Supporters' Shield", "Premier League", "Serie A", "Liga Profesional Saudí"]} />
          <p className="text-xs text-navy-400">
            Messi jugó en LaLiga, la Ligue 1 y la MLS; Cristiano en la liga portuguesa, la Premier League, LaLiga, la Serie A y la liga saudí. Pichichi de LaLiga:
            Messi 8 veces, Cristiano 3. Bota de Oro europea: Messi 6, Cristiano 4.
          </p>
        </div>
      )}
      {tab === "juveniles" && (
        <div className="grid gap-3 md:grid-cols-2">
          {KEYS.map((p) => (
            <div key={p} className="panel overflow-hidden">
              <h3 className="border-b border-navy-100 px-4 py-2 font-display text-base font-bold uppercase tracking-wide" style={{ color: PROFILES[p].color }}>
                {PROFILES[p].name}
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-navy-400">
                    <th className="py-1.5 pl-4 text-left font-semibold">Equipo</th>
                    <th className="py-1.5 text-right font-semibold">PJ</th>
                    <th className="py-1.5 pr-4 text-right font-semibold">Goles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {YOUTH[p].map((y) => (
                    <tr key={y.team}>
                      <td className="py-1.5 pl-4">
                        <span className="font-medium text-navy-900">{y.team}</span>
                        {y.note && <span className="block text-xs text-navy-500">{y.note}</span>}
                      </td>
                      <td className="py-1.5 text-right tabular-nums">{y.apps}</td>
                      <td className="py-1.5 pr-4 text-right font-bold tabular-nums">{y.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function CompDuel({ id }: { id: string }) {
  const c = BY_COMPETITION.find((x) => x.id === id)!;
  return (
    <div className="panel overflow-hidden">
      <PlayersHeader />
      <div className="grid divide-navy-50 sm:grid-cols-2 sm:divide-x">
        <Duel label="Partidos" a={c.messi.apps} b={c.ronaldo.apps} />
        <Duel label="Goles" a={c.messi.goals} b={c.ronaldo.goals} />
        <Duel label="Asistencias" a={c.messi.assists} b={c.ronaldo.assists} />
        <Duel label="Goles por partido" a={c.messi.goals / c.messi.apps} b={c.ronaldo.goals / c.ronaldo.apps} decimals={2} />
      </div>
    </div>
  );
}

function Editions({ p, title, rows }: { p: PlayerKey; title: string; rows: Tournament[] }) {
  const prof = PROFILES[p];
  const max = Math.max(...rows.map((r) => r.goals), 1);
  return (
    <div className="panel overflow-hidden">
      <h3 className="flex items-center gap-2 border-b border-navy-100 px-4 py-2 font-display text-base font-bold uppercase tracking-wide" style={{ color: prof.color }}>
        <Flag code={prof.flag} size={13} /> {prof.short} · {title}
      </h3>
      <ul className="divide-y divide-navy-50">
        {rows.map((r) => (
          <li key={r.year} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-2">
            <span className="font-display text-lg font-bold tabular-nums text-navy-900">{r.year}</span>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-navy-50">
                  <div className="h-2 rounded-full" style={{ width: `${(r.goals / max) * 100}%`, background: prof.color }} />
                </div>
                <span className="w-16 text-right text-xs tabular-nums text-navy-600">
                  <b className="text-navy-950">{r.goals}</b> en {r.apps} PJ
                </span>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${r.champion ? "bg-gold-400 text-navy-950" : "bg-navy-100 text-navy-700"}`}>
              {r.champion ? "🏆 " : ""}
              {r.result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TitleRow({ names }: { names: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {KEYS.map((p) => {
        const items = TITLES[p].flatMap((g) => g.items).filter((i) => names.includes(i.name));
        return (
          <div key={p} className="panel p-4">
            <h3 className="mb-2 font-display text-base font-bold uppercase tracking-wide" style={{ color: PROFILES[p].color }}>
              Títulos de {PROFILES[p].short}
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-navy-500">Ninguno.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {items.map((i) => (
                  <li key={i.name}>
                    <span className="font-semibold text-navy-900">
                      {i.name} <span className="font-display text-brand-500">×{i.years.length}</span>
                    </span>
                    <span className="block text-xs text-navy-500">{i.years.join(" · ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 6. Cara a cara ─────────────────────────────────────────────────────────────────────────────────────────── */

type H2HFilter = "todos" | "LaLiga" | "Champions League" | "Copa del Rey" | "Supercopa de España" | "Amistoso" | "finales";

function HeadToHead() {
  const [filter, setFilter] = useState<H2HFilter>("todos");
  const total = H2H_SUMMARY.reduce(
    (a, r) => ({ played: a.played + r.played, m: a.m + r.messiWins, d: a.d + r.draws, r: a.r + r.ronaldoWins, mg: a.mg + r.messiGoals, rg: a.rg + r.ronaldoGoals }),
    { played: 0, m: 0, d: 0, r: 0, mg: 0, rg: 0 },
  );
  const matches = H2H_MATCHES.filter((m) => (filter === "todos" ? true : filter === "finales" ? m.stage === "Final" : m.comp === filter)).slice().reverse();
  const finals = H2H_MATCHES.filter((m) => m.stage === "Final");
  const finalsWins = { messi: finals.filter((m) => m.winner === "messi").length, ronaldo: finals.filter((m) => m.winner === "ronaldo").length };
  return (
    <Section id="cara-a-cara" title="Cara a cara" intro={`Los ${total.played} partidos oficiales en que se enfrentaron, de 2008 a 2020. Gana el equipo, no el jugador.`}>
      <div className="panel p-5">
        <div className="grid grid-cols-3 text-center">
          <Big v={total.m} l={`Ganó ${M.short}`} color={M.color} />
          <Big v={total.d} l="Empates" color="#6079a0" />
          <Big v={total.r} l={`Ganó ${R.short}`} color={R.color} />
        </div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full" role="img" aria-label={`${total.m} victorias de Messi, ${total.d} empates, ${total.r} de Cristiano`}>
          <div style={{ width: `${pct(total.m, total.played)}%`, background: M.color }} />
          <div className="mx-0.5 bg-navy-300" style={{ width: `${pct(total.d, total.played)}%` }} />
          <div style={{ width: `${pct(total.r, total.played)}%`, background: R.color }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-4">
          <MiniBox l={`Goles de ${M.short}`} v={total.mg} />
          <MiniBox l={`Goles de ${R.short}`} v={total.rg} />
          <MiniBox l={`Asistencias de ${M.short}`} v={H2H_ASSISTS.messi} />
          <MiniBox l={`Asistencias de ${R.short}`} v={H2H_ASSISTS.ronaldo} />
        </div>
        <p className="mt-3 text-center text-xs text-navy-500">
          En finales se cruzaron {finals.length} veces (partidos): {finalsWins.messi} victorias del equipo de Messi, {finalsWins.ronaldo} del de Cristiano y{" "}
          {finals.length - finalsWins.messi - finalsWins.ronaldo} empate.
        </p>
      </div>

      <div className="panel mt-3 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
              <th className="py-2 pl-4 text-left">Competencia</th>
              <th className="py-2 text-right">PJ</th>
              <th className="py-2 text-right" style={{ color: M.color }}>
                G {M.short}
              </th>
              <th className="py-2 text-right">E</th>
              <th className="py-2 text-right" style={{ color: R.color }}>
                G {R.short}
              </th>
              <th className="py-2 pr-4 text-right">Goles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {H2H_SUMMARY.map((r) => (
              <tr key={r.comp}>
                <td className="py-1.5 pl-4 font-medium text-navy-900">{r.comp}</td>
                <td className="py-1.5 text-right tabular-nums">{r.played}</td>
                <td className="py-1.5 text-right font-bold tabular-nums">{r.messiWins}</td>
                <td className="py-1.5 text-right tabular-nums">{r.draws}</td>
                <td className="py-1.5 text-right font-bold tabular-nums">{r.ronaldoWins}</td>
                <td className="py-1.5 pr-4 text-right tabular-nums">
                  {r.messiGoals}–{r.ronaldoGoals}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-2 mt-6 font-display text-lg font-bold uppercase tracking-wide text-navy-900">Partido por partido</h3>
      <Tabs
        value={filter}
        onChange={setFilter}
        options={[
          { id: "todos", label: "Todos" },
          { id: "finales", label: "Finales" },
          { id: "LaLiga", label: "LaLiga" },
          { id: "Champions League", label: "Champions" },
          { id: "Copa del Rey", label: "Copa del Rey" },
          { id: "Supercopa de España", label: "Supercopa" },
          { id: "Amistoso", label: "Selecciones" },
        ]}
      />
      {/* Una sola tarjeta con separadores: decenas de .panel (con desenfoque de fondo) juntos rompen el dibujado en Chrome. */}
      <ul className="panel divide-y divide-navy-50 overflow-hidden">
        {matches.map((m) => (
          <li key={m.date} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5">
            <span className="w-24 shrink-0 text-xs tabular-nums text-navy-500">{new Date(`${m.date}T12:00:00Z`).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</span>
            <span className="w-40 shrink-0 text-xs font-semibold text-navy-600">
              {m.comp}
              {m.stage && <span className={`ml-1 rounded-full px-1.5 py-px text-[0.65rem] ${m.stage === "Final" ? "bg-gold-400 text-navy-950" : "bg-navy-100"}`}>{m.stage}</span>}
            </span>
            <span className="flex flex-1 items-center gap-2 text-sm">
              <span className="font-medium text-navy-900">{m.home}</span>
              <b className="rounded-md bg-navy-900 px-1.5 py-0.5 font-display tabular-nums text-white">{m.score}</b>
              <span className="font-medium text-navy-900">{m.away}</span>
              {m.note && <span className="text-xs text-navy-400">({m.note})</span>}
            </span>
            <span className="flex flex-wrap gap-1 text-xs">
              {m.goals.map((g, i) => (
                <span key={i} className="rounded-full px-2 py-0.5 font-semibold text-white" style={{ background: PROFILES[g.p].color }}>
                  ⚽ {PROFILES[g.p].short} {g.min}&apos;{g.pen ? " (p)" : ""}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Big({ v, l, color }: { v: number; l: string; color: string }) {
  return (
    <div>
      <div className="font-display text-5xl font-extrabold tabular-nums" style={{ color }}>
        {v}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-navy-500">{l}</div>
    </div>
  );
}

function MiniBox({ v, l }: { v: number; l: string }) {
  return (
    <div className="rounded-2xl bg-navy-50 px-3 py-2">
      <div className="font-display text-2xl font-bold tabular-nums text-navy-950">{v}</div>
      <div className="text-[0.7rem] text-navy-500">{l}</div>
    </div>
  );
}

/* ── 7. Títulos ─────────────────────────────────────────────────────────────────────────────────────────────── */

function Titles() {
  const [open, setOpen] = useState<string | null>(null);
  const groups = TITLES.messi.map((g) => g.label);
  const count = (p: PlayerKey, label: string) => TITLES[p].find((g) => g.label === label)!.items.reduce((n, i) => n + i.years.length, 0);
  return (
    <Section id="titulos" title="Títulos" intro="Tocá cada categoría para ver el detalle, año por año.">
      <div className="panel overflow-hidden">
        <PlayersHeader />
        <Duel label="Títulos oficiales" a={TITLES_CONTESTED.messi.won} b={TITLES_CONTESTED.ronaldo.won} />
        {groups.map((label) => (
          <div key={label} className="border-t border-navy-50">
            <button type="button" onClick={() => setOpen(open === label ? null : label)} aria-expanded={open === label} className="block w-full text-left transition hover:bg-brand-50/50">
              <Duel label={`${label} ${open === label ? "▴" : "▾"}`} a={count("messi", label)} b={count("ronaldo", label)} />
            </button>
            {open === label && (
              <div className="grid gap-4 bg-navy-50/50 px-4 py-3 sm:grid-cols-2">
                {KEYS.map((p) => (
                  <ul key={p} className="space-y-1.5 text-sm">
                    {TITLES[p]
                      .find((g) => g.label === label)!
                      .items.map((i) => (
                        <li key={i.name}>
                          <span className="font-semibold text-navy-900">
                            {i.name} <span className="font-display" style={{ color: PROFILES[p].color }}>×{i.years.length}</span>
                          </span>
                          <span className="block text-xs text-navy-500">{i.years.join(" · ")}</span>
                        </li>
                      ))}
                  </ul>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="mb-2 mt-6 font-display text-lg font-bold uppercase tracking-wide text-navy-900">Premios individuales</h3>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
              <th className="py-2 pl-4 text-left">Premio</th>
              <th className="py-2 text-left" style={{ color: M.color }}>
                {M.short}
              </th>
              <th className="py-2 pr-4 text-left" style={{ color: R.color }}>
                {R.short}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {AWARDS.map((a) => {
              const n = (p: PlayerKey) => a.count?.[p] ?? a[p].length;
              return (
                <tr key={a.name} className="align-top">
                  <td className="py-2 pl-4">
                    <span className="font-semibold text-navy-900">{a.name}</span>
                    {a.note && <span className="block text-xs text-navy-400">{a.note}</span>}
                  </td>
                  {KEYS.map((p) => (
                    <td key={p} className={`py-2 ${p === "ronaldo" ? "pr-4" : ""}`}>
                      <span className={`font-display text-xl tabular-nums ${n(p) > n(p === "messi" ? "ronaldo" : "messi") ? "font-extrabold text-navy-950" : "font-semibold text-navy-400"}`}>{n(p)}</span>
                      {a[p].length > 0 && <span className="block text-xs text-navy-500">{a[p].join(" · ")}</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="panel mt-3 overflow-hidden">
        <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wider text-navy-500">En las votaciones del Balón de Oro</p>
        <Duel label="Ganados" a={BALLON_VOTES.messi.wins} b={BALLON_VOTES.ronaldo.wins} />
        <Duel label="Entre los dos primeros" a={BALLON_VOTES.messi.top2} b={BALLON_VOTES.ronaldo.top2} />
        <Duel label="En el podio" a={BALLON_VOTES.messi.top3} b={BALLON_VOTES.ronaldo.top3} />
        <Duel label="Nominaciones" a={BALLON_VOTES.messi.nominations} b={BALLON_VOTES.ronaldo.nominations} />
      </div>
    </Section>
  );
}

/* ── 8. Sus goles ───────────────────────────────────────────────────────────────────────────────────────────── */

function Goals() {
  const [asPct, setAsPct] = useState(false);
  const rows: { label: string; k: "leftFoot" | "rightFoot" | "headers" | "penaltyGoals" | "freeKicks" | "outsideBox" }[] = [
    { label: "Pie izquierdo", k: "leftFoot" },
    { label: "Pie derecho", k: "rightFoot" },
    { label: "De cabeza", k: "headers" },
    { label: "De penal", k: "penaltyGoals" },
    { label: "De tiro libre", k: "freeKicks" },
    { label: "De afuera del área", k: "outsideBox" },
  ];
  return (
    <Section id="goles" title="Cómo hacen los goles" intro="Todos los goles oficiales de la carrera. Afuera del área no cuenta los tiros libres.">
      <Tabs value={asPct ? "pct" : "abs"} onChange={(v) => setAsPct(v === "pct")} options={[{ id: "abs", label: "Cantidad" }, { id: "pct", label: "% de sus goles" }]} />
      <div className="panel overflow-hidden">
        <PlayersHeader />
        <div className="divide-y divide-navy-50">
          {rows.map((r) =>
            asPct ? (
              <Duel key={r.k} label={r.label} a={pct(CAREER.messi[r.k], CAREER.messi.goals)} b={pct(CAREER.ronaldo[r.k], CAREER.ronaldo.goals)} decimals={1} suffix="%" />
            ) : (
              <Duel key={r.k} label={r.label} a={CAREER.messi[r.k]} b={CAREER.ronaldo[r.k]} />
            ),
          )}
        </div>
      </div>
    </Section>
  );
}

/* ── 9. Datos de juego ──────────────────────────────────────────────────────────────────────────────────────── */

function Advanced() {
  return (
    <Section
      id="juego"
      title="Datos de juego"
      intro="Estadísticas de Opta y WhoScored. Solo existen para los partidos con registro detallado (no cubren toda la carrera), así que sirven para comparar estilos más que totales."
    >
      <div className="panel overflow-hidden">
        <PlayersHeader />
        <div className="grid divide-navy-50 sm:grid-cols-2 sm:divide-x">
          {ADVANCED.map((a) => (
            <Duel key={a.label} label={a.label} a={a.messi} b={a.ronaldo} decimals={a.decimals} suffix={a.suffix} />
          ))}
        </div>
      </div>
    </Section>
  );
}
