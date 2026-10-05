import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CalendarView, { type CalendarFilter } from "@/components/live/CalendarView";
import { GROUPS, LIVE_CODE } from "@/lib/competitions";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "Calendario · Offside 45" };

const codesOf = (groupIds: string[]) =>
  GROUPS.filter((g) => groupIds.includes(g.id)).flatMap((g) => g.competitions.map((c) => LIVE_CODE[c.id]).filter(Boolean));

// Filtros por región, con las competencias del menú.
const FILTERS: CalendarFilter[] = [
  { id: "todas", label: "Todas", codes: [] },
  { id: "argentina", label: "Argentina", codes: codesOf(["argentina"]) },
  { id: "copas", label: "Copas", codes: codesOf(["internacional"]) },
  { id: "europa", label: "Europa", codes: codesOf(["inglaterra", "espana", "italia", "alemania", "portugal", "francia"]) },
  { id: "america", label: "América", codes: codesOf(["brasil", "uruguay", "paraguay", "colombia", "chile", "mexico", "eeuu"]) },
  { id: "selecciones", label: "Selecciones", codes: codesOf(["selecciones"]) },
];

export default function CalendarPage() {
  return (
    <>
      <PageHero eyebrow="Día por día" title="Calendario">
        Los partidos de todas las competencias, día por día: los resultados de los que ya se jugaron y los horarios de los que vienen (hora de la
        Argentina). Tocá un partido para ver los goles y las tarjetas.
      </PageHero>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <CalendarView leagues={liveLeagues()} filters={FILTERS} />
      </main>
    </>
  );
}
