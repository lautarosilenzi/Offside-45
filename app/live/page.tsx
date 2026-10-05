import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LiveMatches from "@/components/live/LiveMatches";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "Live · Partidos en juego · Offside 45" };

const TZ = "America/Argentina/Buenos_Aires";

// Solo los partidos que se están jugando ahora, de todas las competencias. Se actualiza cada 30 segundos.
export default function LivePage() {
  // Hoy, en la hora de la Argentina (la página se vuelve a armar cada minuto).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replace(/-/g, "");
  return (
    <>
      <PageHero
        eyebrow={
          <span className="flex items-center gap-2">
            <span className="live-dot-bare" /> En este momento
          </span>
        }
        title="Live"
      >
        Solo los partidos que se están jugando, de todas las competencias, minuto a minuto. Tocá un partido para ver los goles y las tarjetas.
      </PageHero>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <LiveMatches leagues={liveLeagues()} date={today} liveOnly />
      </main>
    </>
  );
}

// La página se vuelve a armar cada minuto para que "hoy" no quede viejo después de la medianoche.
export const revalidate = 60;
