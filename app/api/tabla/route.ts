import { NextResponse } from "next/server";
import { standings } from "@/lib/live/espn";

// Tabla de una competencia (?liga=arg.1). ESPN se consulta como mucho cada 2 minutos.
export async function GET(req: Request) {
  const league = new URL(req.url).searchParams.get("liga") ?? "arg.1";
  if (!/^[a-z0-9._]+$/.test(league)) return NextResponse.json({ error: "liga inválida" }, { status: 400 });
  try {
    return NextResponse.json({ updated: new Date().toISOString(), tables: await standings(league) }, { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ tables: [], error: true }, { status: 502 });
  }
}
