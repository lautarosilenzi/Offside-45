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

// "Boca River", "boca vs river", "Racing contra Independiente": si el texto son dos clubes con historial, el
// historial entre los dos va primero.
function headToHead(index: SearchItem[], q: string): SearchItem | null {
  const words = q.toLowerCase().replace(/\s+(vs\.?|v|contra|y|-)\s+/g, " ").split(/\s+/).filter(Boolean);
  if (words.length < 2) return null;
  for (let i = 1; i < words.length; i++) {
    const a = search(index, words.slice(0, i).join(" ")).find((r) => r.clubId);
    const b = search(index, words.slice(i).join(" ")).find((r) => r.clubId && r.clubId !== a?.clubId);
    if (a?.clubId && b?.clubId)
      return { kind: "Historial", title: `${a.title} vs ${b.title}`, subtitle: "Historial: todos los partidos entre los dos", href: `/historiales?a=${a.clubId}&b=${b.clubId}`, logo: a.logo };
  }
  return null;
}

// Buscador: ?q=texto → competencias, secciones, clubes, equipos, jugadores (leyendas y en actividad) y temporadas.
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 60).trim();
  const index = await searchIndex();
  const [own, live] = await Promise.all([Promise.resolve(search(index, q)), q.length >= 3 ? players(q).catch(() => []) : Promise.resolve([])]);
  const h2h = headToHead(index, q);
  // Los jugadores en actividad van después de los equipos y torneos que coinciden. Una leyenda que sigue jugando
  // (Messi) aparece dos veces: su perfil actual y su ficha del comparador de leyendas.
  const results = [...(h2h ? [h2h] : []), ...own.slice(0, 18), ...live].slice(0, 24);
  return NextResponse.json({ results }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
}
