import Link from "next/link";
import { liveLeagues } from "@/lib/live/leagues";
import { seasonTitle } from "@/lib/seasons";
import type { Season } from "@/lib/types";
import LiveMatches from "./LiveMatches";
import LiveTable from "./LiveTable";
import PlayoffBracket from "./PlayoffBracket";

// El torneo que se está jugando, arriba de todo: partidos del día, tabla en vivo y cuadro de los posibles cruces.
export default function CurrentTournament({ season }: { season: Season }) {
  return (
    <section id="en-juego" className="scroll-mt-24 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="live-dot">En juego</p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-navy-950 sm:text-4xl">{seasonTitle(season)}</h2>
        </div>
        <Link href={`/temporadas/${season.slug}`} className="btn-ghost">
          Todos los partidos del torneo
        </Link>
      </div>
      <LiveMatches leagues={liveLeagues(["liga-profesional"])} />
      <div>
        <h3 className="section-title mb-3">Tabla en vivo</h3>
        <LiveTable code="arg.1" marks={[{ upTo: 8, className: "bg-emerald-500 text-white", label: "Clasifican a octavos de final" }]} />
      </div>
      <div>
        <h3 className="section-title mb-3">Los cruces, si terminara hoy</h3>
        <PlayoffBracket code="arg.1" />
      </div>
    </section>
  );
}
