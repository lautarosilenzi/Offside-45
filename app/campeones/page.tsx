import type { Metadata } from "next";
import Link from "next/link";
import ChampionsFilter from "@/components/ChampionsFilter";
import Crest from "@/components/Crest";
import PageHero from "@/components/PageHero";
import { positions } from "@/lib/rank";
import { CUP_SEASONS, EXTRA_TITLES, INTL_SEASONS, LEAGUE_TITLES, isAmateurSeason, seasonNameOf, titleLabel } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";
import type { Season } from "@/lib/types";

export const metadata: Metadata = { title: "Campeones · 126Goals" };

// Un título en la lista: liga o copa, con su campeón (o campeones, si fue compartido).
type Title = {
  kind: "league" | "cup" | "intl";
  year: number;
  yearLabel: string;
  label: string;
  championIds: string[];
  href: string;
  season?: Season;
  status?: string;
  note?: string;
};

const fromSeason = (s: Season): Title => ({
  kind: s.international ? "intl" : s.kind === "cup" ? "cup" : "league",
  year: s.year,
  yearLabel: s.yearLabel ?? String(s.year),
  label: titleLabel(s),
  championIds: s.championIds,
  href: `/temporadas/${s.slug}`,
  season: s,
  status: s.championIds.length ? undefined : s.inProgress ? "En juego" : "Sin campeón",
});

const TITLES: Title[] = [
  ...LEAGUE_TITLES.map(fromSeason),
  ...EXTRA_TITLES.map((t) => ({ kind: "league" as const, year: t.year, yearLabel: String(t.year), label: t.label, championIds: [t.championId], href: t.href, note: t.note })),
  ...CUP_SEASONS.map(fromSeason),
  // Copas internacionales: solo las que ganó un club argentino.
  ...INTL_SEASONS.filter((s) => s.championIds.some((id) => getTeam(id) && !getTeam(id)!.country)).map(fromSeason),
];

// Filas de la lista: una por año (o temporada partida, como 1985/86), de la más vieja a la más nueva.
const ROWS = [...new Set(TITLES.map((t) => t.yearLabel))]
  .map((yearLabel) => {
    const titles = TITLES.filter((t) => t.yearLabel === yearLabel);
    return {
      yearLabel,
      year: titles[0].year,
      // Primero las ligas, después las copas; dentro de cada grupo, en el orden en que se cargaron.
      titles: [...titles.filter((t) => t.kind === "league"), ...titles.filter((t) => t.kind === "cup"), ...titles.filter((t) => t.kind === "intl")],
    };
  })
  .sort((a, b) => a.year - b.year || a.yearLabel.length - b.yearLabel.length);

// Las dos eras del fútbol argentino: amateur (1891–1930, y las ligas amateurs que siguieron hasta 1934) y profesional
// (desde 1931). Cada título va a la suya; un año con títulos de las dos eras aparece en las dos.
const isAmateur = (t: Title) => (t.season ? isAmateurSeason(t.season) : t.year < 1931);
const ERAS = [
  { id: "profesional", title: "Era profesional", sub: "Desde 1931", amateur: false },
  { id: "amateur", title: "Era amateur", sub: "1891–1930 (y la liga amateur hasta 1934)", amateur: true },
].map((e) => {
  const rows = ROWS.map((r) => ({ ...r, titles: r.titles.filter((t) => isAmateur(t) === e.amateur) })).filter((r) => r.titles.length);
  return { ...e, rows, decades: [...new Set(rows.map((r) => Math.floor(r.year / 10) * 10))] };
});

// Títulos por club: ligas y copas por separado (un título compartido cuenta para los dos clubes).
function ranking() {
  const count = new Map<string, { league: number; cup: number; intl: number }>();
  for (const t of TITLES) {
    for (const id of t.championIds) {
      const c = count.get(id) ?? { league: 0, cup: 0, intl: 0 };
      c[t.kind]++;
      count.set(id, c);
    }
  }
  return [...count.entries()]
    .map(([id, c]) => ({ id, ...c, total: c.league + c.cup + c.intl }))
    .sort((a, b) => b.total - a.total || b.league - a.league || getTeam(a.id)!.name.localeCompare(getTeam(b.id)!.name));
}

export default function ChampionsPage() {
  const table = ranking();
  const pos = positions(table, (r) => r.total);
  const leagueCount = TITLES.filter((t) => t.kind === "league" && t.championIds.length).length;
  const cupCount = TITLES.filter((t) => t.kind === "cup" && t.championIds.length).length;
  const intlCount = TITLES.filter((t) => t.kind === "intl").length;

  return (
    <>
      <PageHero eyebrow="Año por año" title="Campeones">
        Todos los campeones de Primera División y de las copas nacionales oficiales, desde 1891 hasta hoy. Cada título
        lleva a su torneo, con todos los partidos.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={leagueCount} label="Títulos de liga" />
          <Stat value={cupCount} label="Copas nacionales" />
          <Stat value={intlCount} label="Títulos internacionales" />
          <Stat value={table.length} label="Clubes campeones" />
        </div>
      </PageHero>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <h2 className="section-title mb-3">Máximos ganadores</h2>
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 font-display text-xs uppercase tracking-wider text-navy-500">
                  <th className="w-10 py-2 pl-4 text-left">#</th>
                  <th className="py-2 text-left">Club</th>
                  <th className="w-16 py-2 text-right">Liga</th>
                  <th className="w-16 py-2 text-right">Copas</th>
                  <th className="w-16 py-2 text-right">Intern.</th>
                  <th className="w-16 py-2 pr-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {table.slice(0, 15).map((r, i) => {
                  const team = getTeam(r.id)!;
                  return (
                    <tr key={r.id}>
                      <td className="py-2 pl-4 tabular-nums text-navy-400">{pos[i]}</td>
                      <td className="py-2">
                        <span className="flex items-center gap-2">
                          <Crest team={team} size="xs" />
                          <span className="break-words leading-snug font-semibold text-navy-900">{team.name}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.league}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.cup}</td>
                      <td className="py-2 text-right tabular-nums text-navy-700">{r.intl}</td>
                      <td className="py-2 pr-4 text-right font-display text-base font-bold tabular-nums text-navy-950">{r.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-navy-500">
            Cuenta los títulos de liga de todas las asociaciones reconocidas por la AFA (incluidas las disidentes de 1912–1914 y 1919–1926 y la
            liga amateur de 1931–1934), las copas nacionales de Primera y las copas internacionales oficiales ganadas por clubes argentinos (las ediciones
            1900–1906 de la Copa Chevallier Boutell cuentan como copa nacional). La Copa de Oro 1936, que la AFA suma como título de liga, figura entre las copas.
          </p>
        </section>

        <ChampionsFilter>
          {ERAS.map((era) => (
          <div key={era.id} id={era.id} className="mb-12 scroll-mt-24">
          <div className="mb-4 rounded-3xl bg-navy-950 px-5 py-4 text-white on-dark">
            <h2 className="font-display text-3xl font-black uppercase italic leading-none">{era.title}</h2>
            <p className="mt-1 text-sm text-navy-200">{era.sub}</p>
          </div>
          <nav className="mb-6 flex flex-wrap gap-1.5" aria-label={`Décadas de la ${era.title.toLowerCase()}`}>
            {era.decades.map((d) => (
              <a key={d} href={`#${era.id}-${d}`} className="pill bg-white/70 font-display text-sm font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-white">
                {d}s
              </a>
            ))}
          </nav>

          <div className="space-y-8">
            {era.decades.map((d) => (
              <section
                key={d}
                id={`${era.id}-${d}`}
                data-kinds={[...new Set(era.rows.filter((r) => Math.floor(r.year / 10) * 10 === d).flatMap((r) => r.titles.map((t) => t.kind)))].join(" ")}
                className="scroll-mt-24"
              >
                <h3 className="section-title mb-3">
                  {d}–{d + 9}
                </h3>
                <ul className="panel divide-y divide-navy-100">
                  {era.rows.filter((r) => Math.floor(r.year / 10) * 10 === d).map((r) => (
                    <li
                      key={r.yearLabel}
                      data-kinds={[...new Set(r.titles.map((t) => t.kind))].join(" ")}
                      className="grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[6rem_minmax(0,1fr)]"
                    >
                      <span className="font-display text-2xl font-bold leading-tight text-navy-900">{r.yearLabel}</span>
                      <div className="flex flex-wrap gap-2">
                        {r.titles.map((t) => (
                          <TitleChip key={t.href + t.label} title={t} />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          </div>
          ))}
        </ChampionsFilter>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="stat-value text-3xl font-bold italic text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}

function TitleChip({ title }: { title: Title }) {
  const league = title.kind === "league";
  return (
    <Link
      href={title.href}
      data-kind={title.kind}
      title={title.note}
      className={`flex min-w-0 max-w-full items-center gap-2 rounded-2xl px-3 py-1.5 ring-1 transition sm:max-w-[20rem] ${
        league
          ? "bg-navy-900 text-white ring-navy-900 hover:bg-navy-800"
          : title.kind === "intl"
            ? "bg-gold-400/25 text-navy-950 ring-gold-400 hover:bg-gold-400/40"
            : "bg-white text-navy-900 ring-navy-100 hover:bg-brand-50"
      }`}
    >
      {title.championIds.length ? (
        <span className="flex shrink-0 items-center -space-x-1">
          {title.championIds.map((id) => (
            <Crest key={id} team={getTeam(id)!} size="sm" />
          ))}
        </span>
      ) : null}
      <span className="min-w-0 leading-tight">
        <span className={`block break-words leading-snug font-display text-[0.7rem] font-semibold uppercase tracking-wider ${league ? "text-brand-200" : "text-navy-400"}`}>
          {title.label}
        </span>
        <span className="block break-words leading-snug text-sm font-bold">
          {title.championIds.length
            ? title.championIds.map((id) => (title.season && seasonNameOf(title.season, id)) ?? getTeam(id)!.name).join(" y ")
            : <span className={`font-normal ${league ? "text-navy-300" : "text-navy-500"}`}>{title.status}</span>}
        </span>
      </span>
    </Link>
  );
}
