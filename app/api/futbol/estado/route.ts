import { NextResponse } from "next/server";
import { hasApiFootball } from "@/lib/live/apifootball";

// Diagnóstico de API-Football: plan, consultas usadas hoy y si la temporada en curso está disponible. Consultas fijas,
// guardadas 1 hora.
export const revalidate = 3600;

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY;
  if (!hasApiFootball() || !key) return NextResponse.json({ error: "Falta configurar API_FOOTBALL_KEY" }, { status: 503 });
  const get = (p: string) =>
    fetch(`https://v3.football.api-sports.io${p}`, { headers: { "x-apisports-key": key }, next: { revalidate: 3600 } }).then((r) => r.json());
  const [status, fixtures] = await Promise.all([get("/status"), get("/fixtures?league=134&season=2026")]);
  const r = status.response ?? {};
  return NextResponse.json({
    plan: r.subscription?.plan,
    requests: r.requests,
    fixtures2026: { errors: fixtures.errors, results: fixtures.results, sample: fixtures.response?.[0]?.fixture?.date, round: fixtures.response?.[0]?.league?.round },
  });
}
