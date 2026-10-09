import CompLogo from "./CompLogo";
import PageHero from "./PageHero";
import { type FinalRow, RankTable, YearList, countryOf } from "./TitleBoards";

// Página de una copa con todos sus campeones: tabla por club, tabla por país y la lista año por año.
export default function CupHistory({
  eyebrow,
  title,
  intro,
  rows,
  byCountry = true,
  label,
  by,
  logo,
  top,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  rows: FinalRow[];
  byCountry?: boolean;
  label?: string;
  // Para agrupar en la tabla (ej. Alemania Federal con Alemania).
  by?: (id: string) => string;
  footer?: React.ReactNode;
  // Logo de la competencia (lib/data/comps.generated.json).
  logo?: string;
  // Lo que va primero: la edición que se está jugando (partidos en vivo).
  top?: React.ReactNode;
}) {
  const played = rows.filter((r) => r.champion);
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        {intro}
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          {logo && <CompLogo id={logo} size={72} className="" />}
          <Stat value={played.length} label="Ediciones" />
          <Stat value={new Set(played.map((r) => (by ? by(r.champion!) : r.champion))).size} label="Campeones distintos" />
        </div>
      </PageHero>
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        {top}
        <section>
          <h2 className="section-title mb-3">Tabla de campeones</h2>
          <RankTable rows={rows} label={label} by={by} />
        </section>
        {byCountry && (
          <section>
            <h2 className="section-title mb-3">Por país</h2>
            <RankTable rows={rows} label="País" by={countryOf} />
          </section>
        )}
        <section>
          <h2 className="section-title mb-3">Año por año</h2>
          <YearList rows={rows} />
        </section>
        {footer && <div className="text-sm text-navy-400">{footer}</div>}
      </main>
    </>
  );
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="stat-value text-3xl font-bold italic text-white">{value}</div>
      <div className="text-xs font-semibold tracking-widest text-navy-300">{label}</div>
    </div>
  );
}
