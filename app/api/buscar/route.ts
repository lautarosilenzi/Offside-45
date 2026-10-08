import { NextResponse } from "next/server";
import { search, searchIndex, type SearchItem } from "@/lib/search";

// Jugadores en actividad, del buscador de ESPN (las leyendas ya están en el índice del sitio). Se guarda un día.
async function players(q: string): Promise<SearchItem[]> {
  const r = await fetch(`https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(q)}&limit=8&type=player&sport=soccer`, { next: { revalidate: 86400 } });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results ?? [])
    .flatMap((g: any) => g.contents ?? [])
    .filter((c: any) => /^s:600~a:\d+$/.test(c.uid ?? ""))
    .slice(0, 6)
    .map((c: any) => ({
      kind: "Jugador" as const,
      title: c.displayName,
      subtitle: c.subtitle ? `Jugador · ${c.subtitle}` : "Jugador",
      href: `/jugador/${String(c.uid).split("~a:")[1]}`,
      logo: c.image?.default ?? undefined,
    }));
}

// Buscador: ?q=texto → competencias, secciones, clubes, equipos, jugadores (leyendas y en actividad) y temporadas.
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 60).trim();
  const [own, live] = await Promise.all([searchIndex().then((i) => search(i, q)), q.length >= 3 ? players(q).catch(() => []) : Promise.resolve([])]);
  // Los jugadores en actividad van después de los equipos y torneos que coinciden. Una leyenda que sigue jugando
  // (Messi) aparece dos veces: su perfil actual y su ficha del comparador de leyendas.
  const results = [...own.slice(0, 18), ...live].slice(0, 24);
  return NextResponse.json({ results }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
}
