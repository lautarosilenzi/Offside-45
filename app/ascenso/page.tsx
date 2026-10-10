import type { Metadata } from "next";
import { Stat } from "@/components/CupHistory";
import PageHero from "@/components/PageHero";
import AscensoHistory from "@/components/hub/AscensoHistory";
import { ASCENSO_SEASONS } from "@/lib/seasons";

export const metadata: Metadata = { title: "Ascenso · 126Goals" };

// Historia de la segunda división: Primera B, Primera B Nacional y Primera Nacional.
export default function AscensoPage() {
  const matches = ASCENSO_SEASONS.reduce((n, s) => n + s.matches.length, 0);
  const clubs = new Set(ASCENSO_SEASONS.flatMap((s) => s.matches.flatMap((m) => [m.homeId, m.awayId]))).size;
  return (
    <>
      <PageHero eyebrow="Segunda división" title="Ascenso">
        La segunda categoría del fútbol argentino: la Primera B y, desde 1986, la Primera B Nacional (hoy Primera Nacional).
        Todos los partidos, temporada por temporada.
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display uppercase tracking-wide">
          <Stat value={ASCENSO_SEASONS.length} label="Torneos" />
          <Stat value={matches.toLocaleString("es-AR")} label="Partidos" />
          <Stat value={clubs} label="Clubes" />
        </div>
      </PageHero>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <AscensoHistory />
      </main>
    </>
  );
}
