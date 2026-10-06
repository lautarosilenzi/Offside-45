import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StandingsTable from "@/components/hub/StandingsTable";
import MatchView from "@/components/matchpage/MatchView";
import { standings } from "@/lib/live/espn";
import { matchPage } from "@/lib/live/match";

// Se arma en cada visita (mientras se juega, los datos cambian cada 30 segundos); los datos de ESPN quedan en caché.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const valid = (p: { liga: string; id: string }) => /^[a-z0-9._]+$/.test(p.liga) && /^\d+$/.test(p.id);

export async function generateMetadata({ params }: { params: { liga: string; id: string } }): Promise<Metadata> {
  const m = valid(params) ? await matchPage(params.liga, params.id).catch(() => null) : null;
  if (!m) return { title: "Partido · Offside 45" };
  const score = m.status.state === "pre" ? "vs" : `${m.home.score} - ${m.away.score}`;
  return { title: `${m.home.name} ${score} ${m.away.name} · ${m.competition.name} · Offside 45` };
}

export default async function MatchRoute({ params }: { params: { liga: string; id: string } }) {
  if (!valid(params)) notFound();
  const [m, tables] = await Promise.all([matchPage(params.liga, params.id).catch(() => null), standings(params.liga).catch(() => [])]);
  if (!m) notFound();

  // Posiciones: las zonas donde están los equipos del partido (o toda la tabla si no hay zonas).
  const ids = [m.home.espnId, m.away.espnId].filter(Boolean) as string[];
  const mine = tables.filter((t) => t.rows.some((r) => r.team.espnId && ids.includes(r.team.espnId)));
  const teamHref = m.competition.id ? (espnId: string) => `/torneos/${m.competition.id}/equipo/${espnId}` : undefined;

  return (
    <MatchView
      m={m}
      standings={mine.length ? <StandingsTable tables={mine} form={{}} highlight={ids} teamHref={teamHref} title={m.stage ? `Tabla · ${m.stage}` : undefined} /> : undefined}
    />
  );
}
