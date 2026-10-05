import { NextResponse } from "next/server";
import { matchSummary } from "@/lib/live/espn";

// Detalle de un partido (?liga=arg.1&id=401841591): formaciones, incidencias, estadísticas, relato y cuotas.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const liga = url.searchParams.get("liga") ?? "";
  const id = url.searchParams.get("id") ?? "";
  if (!/^[a-z0-9._]+$/.test(liga) || !/^\d+$/.test(id)) return NextResponse.json({ error: "parámetros inválidos" }, { status: 400 });
  try {
    return NextResponse.json(await matchSummary(liga, id), { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=30" } });
  } catch {
    return NextResponse.json({ error: "no disponible" }, { status: 502 });
  }
}
