import { findLiveCompetition } from "@/lib/live/competitions";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Club en 126Goals";

// Vista previa al compartir un club: su escudo, el nombre y el torneo.
export default async function Image({ params }: { params: { id: string; team: string } }) {
  const c = findLiveCompetition(params.id);
  const t = /^\d+$/.test(params.team)
    ? await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${params.team}`, { next: { revalidate: 86400 } })
        .then((r) => r.json())
        .then((j) => j.team)
        .catch(() => null)
    : null;
  if (!t?.displayName) return ogImage({ title: c?.name ?? "Equipos" });
  return ogImage({ eyebrow: c?.name ?? "Club", title: t.displayName, subtitle: "Plantel, partidos, estadísticas y títulos", logos: [t.logos?.[0]?.href] });
}
