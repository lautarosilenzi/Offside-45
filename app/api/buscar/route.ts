import { NextResponse } from "next/server";
import { search, searchIndex } from "@/lib/search";

// Buscador: ?q=texto → hasta 24 resultados (competencias, secciones, clubes, equipos, jugadores y temporadas).
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 60);
  const results = search(await searchIndex(), q);
  return NextResponse.json({ results }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
}
