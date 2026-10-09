import LOGOS from "@/lib/data/comps.generated.json";
import { findLiveCompetition } from "@/lib/live/competitions";
import { OG_SIZE, ogImage, siteUrl } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Torneo en 126Goals";

// Vista previa al compartir un torneo: su logo o trofeo, el nombre y el país.
export default async function Image({ params }: { params: { id: string } }) {
  const c = findLiveCompetition(params.id);
  if (!c) return ogImage({ title: "Torneos" });
  const logo = (LOGOS as Record<string, { file: string }>)[c.id]?.file;
  return ogImage({ eyebrow: c.country, title: c.name, subtitle: "Fixture, tablas, estadísticas y campeones", logos: [siteUrl(logo)] });
}
