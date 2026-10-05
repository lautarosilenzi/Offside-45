import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CalendarView, { type CalendarFilter } from "@/components/live/CalendarView";
import { GROUPS, LIVE_CODE } from "@/lib/competitions";
import { liveLeagues } from "@/lib/live/leagues";

export const metadata: Metadata = { title: "Calendario · Offside 45" };

const codesOf = (groups: typeof GROUPS) => groups.flatMap((g) => g.competitions.map((c) => LIVE_CODE[c.id]).filter(Boolean));
const byId = (ids: string[]) => codesOf(GROUPS.filter((g) => ids.includes(g.id)));
const byRegion = (region: string) => codesOf(GROUPS.filter((g) => g.region === region));

// Filtros con los grupos y las regiones del menú.
const FILTERS: CalendarFilter[] = [
  { id: "todas", label: "Todas", codes: [] },
  { id: "argentina", label: "Argentina", codes: byId(["argentina"]) },
  { id: "selecciones", label: "Selecciones", codes: byId(["selecciones"]) },
  { id: "copas", label: "Copas de clubes", codes: byId(["internacional"]) },
  { id: "sudamerica", label: "Sudamérica", codes: byRegion("Sudamérica") },
  { id: "europa", label: "Europa", codes: byRegion("Europa") },
  { id: "resto", label: "Resto del mundo", codes: byRegion("Resto del mundo") },
  { id: "femenino", label: "Femenino", codes: byRegion("Femenino") },
].filter((f) => f.id === "todas" || f.codes.length);

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
