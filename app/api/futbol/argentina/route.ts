import { NextResponse } from "next/server";
import { countryLeagues, hasApiFootball } from "@/lib/live/apifootball";

// Qué competencias argentinas tiene API-Football (para elegir cuáles sumar al sitio). Se guarda un día: gasta una
// consulta diaria como mucho.
export const revalidate = 86400;

export async function GET() {
  if (!hasApiFootball()) return NextResponse.json({ error: "Falta configurar API_FOOTBALL_KEY" }, { status: 503 });
  try {
    const leagues = await countryLeagues("Argentina");
    return NextResponse.json(
      { leagues: leagues.map((l) => ({ id: l.id, name: l.name, type: l.type, season: l.season, start: l.start, end: l.end, coverage: l.coverage })) },
      { headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400" } },
    );
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 502 });
  }
}
