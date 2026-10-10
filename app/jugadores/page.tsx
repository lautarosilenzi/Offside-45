import type { Metadata } from "next";
import Duel from "@/components/compare/Duel";
import LegendPicker from "@/components/compare/LegendPicker";
import LegendsTable from "@/components/compare/LegendsTable";
import Flag from "@/components/Flag";
import PageHero from "@/components/PageHero";
import {
  CATS,
  LEGENDS,
  careerApps,
  careerGoals,
  es,
  getLegend,
  lifespan,
  nationalApps,
  nationalGoals,
  titlesIn,
  totalTitles,
  type Legend,
} from "@/lib/legends";

export const metadata: Metadata = {
  title: "Comparador de leyendas · 126Goals",
  description: "Compará a las mayores leyendas del fútbol mundial, sudamericano y argentino: carrera en clubes y selección, goles, títulos y premios individuales.",
};

const A = "#3b8fd9";
const B = "#d7263d";

export default function LegendsPage({ searchParams }: { searchParams: { a?: string; b?: string } }) {
  const a = getLegend(searchParams.a ?? "") ?? getLegend("messi")!;
  let b = getLegend(searchParams.b ?? "") ?? getLegend("maradona")!;
  if (b.id === a.id) b = getLegend(a.id === "maradona" ? "messi" : "maradona")!;
  const d = (label: string, fa: (l: Legend) => number | null, opts: { decimals?: number; note?: string; lower?: boolean } = {}) => (
    <Duel label={label} a={fa(a)} b={fa(b)} colorA={A} colorB={B} {...opts} />
  );
  const hasAssists = !!a.assists && !!b.assists;

  return (
    <>
      <PageHero eyebrow="Cara a cara entre leyendas" title="Comparador de jugadores">
        Elegí dos de las mayores leyendas del fútbol (las 25 mejores de la historia y otras grandes figuras sudamericanas y argentinas) y comparalas: carrera en clubes y en la selección, goles, títulos y premios
        individuales.
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <LegendPicker a={a.id} b={b.id} options={LEGENDS.map((l) => ({ id: l.id, name: l.name, rank: l.rank }))} />

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <PlayerCard l={a} color={A} />
          <PlayerCard l={b} color={B} />
        </div>

        <Block title="Goles y partidos" a={a} b={b}>
          {d("Partidos en clubes", (l) => l.clubTotal.apps)}
          {d("Goles en clubes", (l) => l.clubTotal.goals)}
          {d("Goles por partido en clubes", (l) => l.clubTotal.goals / l.clubTotal.apps, { decimals: 2 })}
          {d("Partidos en la selección", nationalApps)}
          {d("Goles en la selección", nationalGoals)}
          {d("Goles por partido en la selección", (l) => nationalGoals(l) / nationalApps(l), { decimals: 2 })}
          {d("Partidos en total", careerApps)}
          {d("Goles en total", careerGoals)}
          {d("Asistencias", (l) => (hasAssists && l.assists ? l.assists.club + l.assists.intl : null), {
            note: hasAssists ? "clubes y selección" : "sin registro oficial para los dos",
          })}
        </Block>

        <Block title="Títulos" a={a} b={b}>
          {d("Títulos como jugador", totalTitles)}
          {CATS.map((c) => (
            <Duel key={c.id} label={c.label} a={titlesIn(a, [c.id])} b={titlesIn(b, [c.id])} colorA={A} colorB={B} />
          ))}
        </Block>

        <Block title="Premios individuales" a={a} b={b}>
          {d("Balón de Oro", (l) => l.awards.ballonDor.length, { note: "hasta 1994, solo para europeos" })}
          {d("Mejor jugador FIFA", (l) => l.awards.fifa, { note: "desde 1991; incluye el FIFA Balón de Oro 2010–2015" })}
          {d("Balón de Oro del Mundial", (l) => l.awards.wcBall, { note: "oficial desde 1982" })}
          {d("Goleador de un Mundial", (l) => l.awards.wcBoot)}
          {d("Bota de Oro europea", (l) => l.awards.shoe, { note: "desde 1968" })}
        </Block>

        <section>
          <h2 className="section-title mb-3">Carrera</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Career l={a} color={A} />
            <Career l={b} color={B} />
          </div>
          <p className="mt-2 text-xs text-navy-400">
            Por club: partidos y goles de liga, como figuran en la ficha de cada jugador. Los totales de arriba suman todas las competencias oficiales.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3">Títulos, uno por uno</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TitleList l={a} color={A} />
            <TitleList l={b} color={B} />
          </div>
        </section>

        <section>
          <h2 className="section-title mb-1">Las {LEGENDS.length} leyendas</h2>
          <p className="mb-3 text-sm text-navy-500">Ordená por cualquier columna. Tocá un jugador para compararlo con {a.name}.</p>
          <LegendsTable
            compareWith={a.id}
            rows={LEGENDS.map((l) => ({
              id: l.id,
              rank: l.rank,
              name: l.name,
              flag: l.flag,
              country: l.country,
              apps: careerApps(l),
              goals: careerGoals(l),
              intlApps: nationalApps(l),
              intlGoals: nationalGoals(l),
              titles: totalTitles(l),
              worldCups: titlesIn(l, ["mundial"]),
              ballons: l.awards.ballonDor.length,
            }))}
          />
        </section>

        <p className="rounded-2xl border-l-4 border-brand-500 bg-white/80 px-4 py-3 text-sm leading-relaxed text-navy-600">
          Datos revisados uno por uno; Messi y Cristiano, con los datos verificados de <a href="/messi-vs-cristiano" className="text-brand-500 hover:underline">Messi vs Cristiano</a>. Solo partidos oficiales. Los
          títulos son los ganados como jugador (sin amistosos ni los ganados como técnico). Las asistencias recién se registran de forma confiable en las
          últimas décadas, así que solo se comparan cuando hay datos para los dos. En las épocas viejas los registros no siempre coinciden en partidos y goles.
        </p>
      </main>
    </>
  );
}

// Miniatura de Commons de 500 px en vez de 330: la tarjeta llega a medir 480 px de ancho.
const sharper = (src: string) => src.replace("/330px-", "/500px-");

function PlayerCard({ l, color }: { l: Legend; color: string }) {
  return (
    <div className="panel overflow-hidden">
      {/* 4:3 y la foto centrada a la altura de la cara: en una tarjeta ancha y baja, las caras quedaban cortadas. */}
      <div className="relative aspect-[4/3] bg-navy-900">
        {l.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- foto de Wikimedia Commons
          <img src={sharper(l.photo.src)} alt={l.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-[50%_25%]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: color }} />
        {/* El puesto es el del ranking de las 25 mejores; las leyendas sudamericanas y argentinas que se sumaron después van sin puesto. */}
        {l.rank <= 25 && <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-2.5 py-1 font-display text-sm font-bold text-white">#{l.rank}</span>}
      </div>
      <div className="p-3 sm:p-4">
        <h2 className="font-display text-xl font-extrabold uppercase italic leading-none tracking-wide text-navy-950 sm:text-3xl">{l.name}</h2>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-navy-500">
          <span className="inline-flex items-center gap-1.5">
            <Flag code={l.flag} size={11} /> {l.country}
          </span>
          <span>· {l.position}</span>
          <span>· {lifespan(l)}</span>
        </p>
        {l.note && <p className="mt-2 rounded-xl bg-navy-50 px-2.5 py-1.5 text-[0.7rem] text-navy-600">{l.note}</p>}
        {l.photo && (
          <p className="mt-2 text-[0.65rem] text-navy-400">
            Foto{l.photo.year ? ` (${l.photo.year})` : ""}:{" "}
            <a href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(l.photo.file)}`} target="_blank" rel="noreferrer" className="hover:underline">
              {l.photo.author}
            </a>{" "}
            · {l.photo.license}
          </p>
        )}
      </div>
    </div>
  );
}

function Block({ title, a, b, children }: { title: string; a: Legend; b: Legend; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="section-title mb-3">{title}</h2>
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-2 border-b border-navy-100 px-4 py-2 font-display text-sm font-bold uppercase tracking-wide">
          <span style={{ color: A }}>{a.name}</span>
          <span className="text-right" style={{ color: B }}>
            {b.name}
          </span>
        </div>
        <div className="divide-y divide-navy-50">{children}</div>
      </div>
    </section>
  );
}

function Career({ l, color }: { l: Legend; color: string }) {
  const max = Math.max(...l.clubs.map((c) => c.goals ?? 0), 1);
  return (
    <div className="panel overflow-hidden">
      <h3 className="border-b border-navy-100 px-4 py-2 font-display text-base font-bold uppercase tracking-wide" style={{ color }}>
        {l.name}
      </h3>
      <ul className="divide-y divide-navy-50 text-sm">
        {l.clubs.map((c, i) => (
          <li key={i} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2 px-4 py-1.5">
            <span className="text-xs tabular-nums text-navy-400">{c.years}</span>
            <span className="min-w-0">
              <span className="font-medium text-navy-900">
                {es(c.club)}
                {c.loan && <span className="ml-1 text-xs text-navy-400">(cedido)</span>}
              </span>
              <span className="mt-0.5 block h-1.5 rounded-full bg-navy-50">
                <span className="block h-1.5 rounded-full" style={{ width: `${((c.goals ?? 0) / max) * 100}%`, background: color }} />
              </span>
            </span>
            <span className="text-right text-xs tabular-nums text-navy-600">
              {c.apps} PJ · <b className="text-navy-950">{c.goals ?? "—"}</b>
            </span>
          </li>
        ))}
        {l.national.map((n) => (
          <li key={n.team} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2 bg-navy-50/60 px-4 py-1.5">
            <span className="text-xs tabular-nums text-navy-400">{n.years}</span>
            <span className="font-semibold text-navy-900">Selección de {es(n.team)}</span>
            <span className="text-right text-xs tabular-nums text-navy-600">
              {n.apps} PJ · <b className="text-navy-950">{n.goals}</b>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TitleList({ l, color }: { l: Legend; color: string }) {
  return (
    <div className="panel p-4">
      <h3 className="mb-2 font-display text-base font-bold uppercase tracking-wide" style={{ color }}>
        {l.name} · {totalTitles(l)} títulos
      </h3>
      <div className="space-y-3">
        {CATS.map((c) => {
          const items = l.titles.filter((t) => t.cat === c.id);
          if (!items.length) return null;
          return (
            <div key={c.id}>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-navy-400">{c.label}</div>
              <ul className="mt-0.5 space-y-0.5 text-sm">
                {items.map((t) => (
                  <li key={t.name} className="flex justify-between gap-2">
                    <span className="text-navy-800">{t.name}</span>
                    <span className="font-display font-bold tabular-nums text-navy-950">×{t.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {l.awards.ballonDor.length > 0 && (
          <div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-navy-400">Balones de Oro</div>
            <p className="text-sm text-navy-800">{l.awards.ballonDor.join(" · ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
