import { NextResponse } from "next/server";
import { LIVE_CODE, LIVE_ORDER } from "@/lib/competitions";
import { scoreboard } from "@/lib/live/espn";

// Cuántos partidos se están jugando ahora en todas las competencias (para el botón Live del encabezado). La respuesta
// se comparte en el CDN durante 30 segundos, así ESPN no recibe una consulta por cada visitante.
export async function GET() {
  // Las mismas competencias que muestra la página Live, para que el número coincida con la lista.
  const codes = [...new Set(LIVE_ORDER.map((id) => LIVE_CODE[id]).filter(Boolean))];
  const counts = await Promise.all(codes.map((c) => scoreboard(c).then((ev) => ev.filter((e) => e.state === "in").length).catch(() => 0)));
  return NextResponse.json({ live: counts.reduce((a, b) => a + b, 0), updated: new Date().toISOString() }, { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=30" } });
}

// Se recalcula como mucho cada 30 segundos (sin esto, Next la guardaría fija en el build).
export const revalidate = 30;
