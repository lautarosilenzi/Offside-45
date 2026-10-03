import type { Metadata } from "next";
import LiveMatches from "@/components/live/LiveMatches";
import PageHero from "@/components/PageHero";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "En vivo · Offside 45" };

export default function LivePage() {
  return (
    <>
      <PageHero eyebrow="Resultados al instante" title="En vivo">
        Todos los partidos del día, minuto a minuto: el fútbol argentino primero y después las copas y las ligas del mundo. Tocá un
        partido para ver los goles y las tarjetas.
      </PageHero>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <LiveMatches leagues={liveLeagues()} />
      </main>
    </>
  );
}
