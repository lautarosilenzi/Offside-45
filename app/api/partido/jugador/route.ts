import { NextResponse } from "next/server";
import { headshot, playerMatchStats } from "@/lib/live/match";

// Estadísticas de un jugador en un partido (?liga=arg.1&id=401841594&equipo=5&jugador=153115) y su foto, si ESPN la tiene.
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const liga = p.get("liga") ?? "";
  const [id, equipo, jugador] = ["id", "equipo", "jugador"].map((k) => p.get(k) ?? "");
  if (!/^[a-z0-9._]+$/.test(liga) || ![id, equipo, jugador].every((x) => /^\d+$/.test(x))) return NextResponse.json({ error: "parámetros inválidos" }, { status: 400 });
  // Mientras se juega, cada 30 segundos; terminado, ya no cambia.
  const vivo = p.get("vivo") === "1";
  try {
    const [stats, photo] = await Promise.all([playerMatchStats(liga, id, equipo, jugador, vivo ? 30 : 86400), headshot(jugador)]);
    return NextResponse.json({ stats, photo }, { headers: { "Cache-Control": vivo ? "s-maxage=30" : "s-maxage=86400, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "no disponible" }, { status: 502 });
  }
}
