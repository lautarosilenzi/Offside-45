import { NextResponse } from "next/server";
import { scoreboard } from "@/lib/live/espn";

// Partidos de una o varias competencias (?ligas=arg.1,arg.copa&fecha=20261003). ESPN se consulta como mucho cada 30 s.
// Hasta 100 competencias por pedido: el Calendario y Live piden todas las del menú juntas.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const leagues = [...new Set((url.searchParams.get("ligas") ?? "arg.1").split(",").filter((l) => /^[a-z0-9._]+$/.test(l)))].slice(0, 100);
  const date = url.searchParams.get("fecha") ?? undefined;
  if (date && !/^\d{8}$/.test(date)) return NextResponse.json({ error: "fecha inválida" }, { status: 400 });
  const results = await Promise.all(
    leagues.map(async (league) => {
      try {
        return { league, events: await scoreboard(league, date) };
      } catch {
        return { league, events: [], error: true };
      }
    }),
  );
  return NextResponse.json({ updated: new Date().toISOString(), results }, { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=30" } });
}
