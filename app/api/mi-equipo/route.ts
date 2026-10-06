import { NextResponse } from "next/server";
import { findLiveCompetition } from "@/lib/live/competitions";
import { standings, teamSchedule } from "@/lib/live/espn";

// "Mi equipo": ?comp=liga-profesional&id=5 → partido en juego, próximo partido, últimos cinco resultados y posición en
// la tabla. Se renueva cada minuto.
export const revalidate = 60;

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const comp = findLiveCompetition(params.get("comp") ?? "");
  const id = params.get("id") ?? "";
  if (!comp || !/^\d+$/.test(id)) return NextResponse.json({ error: "Equipo desconocido" }, { status: 400 });

  const [schedule, tables] = await Promise.all([
    teamSchedule(comp.code, id).catch(() => ({ played: [], upcoming: [] })),
    standings(comp.code).catch(() => []),
  ]);
  const table = tables.find((t) => t.rows.some((r) => r.team.espnId === id));
  const row = table?.rows.find((r) => r.team.espnId === id);
  const live = schedule.upcoming.find((e) => e.state === "in") ?? null;
  const next = schedule.upcoming.find((e) => e.state === "pre") ?? null;

  return NextResponse.json(
    {
      comp: { id: comp.id, name: comp.name },
      live,
      next,
      last: schedule.played.slice(0, 5),
      standing: row ? { pos: row.pos, points: row.points, played: row.played, table: table?.name ?? "", size: table?.rows.length ?? 0 } : null,
    },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } },
  );
}
