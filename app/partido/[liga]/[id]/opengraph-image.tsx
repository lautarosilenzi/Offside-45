import { matchPage } from "@/lib/live/match";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Partido en 126Goals";

// Vista previa al compartir un partido: los dos escudos y el resultado (o "vs" si no empezó).
export default async function Image({ params }: { params: { liga: string; id: string } }) {
  const m = /^[a-z0-9._]+$/.test(params.liga) && /^\d+$/.test(params.id) ? await matchPage(params.liga, params.id).catch(() => null) : null;
  if (!m) return ogImage({ title: "Partido" });
  const score = m.status.state === "pre" ? "vs" : `${m.home.score ?? 0} - ${m.away.score ?? 0}`;
  return ogImage({ eyebrow: m.competition.name, title: `${m.home.name} vs ${m.away.name}`, logos: [m.home.logo, m.away.logo], score });
}
