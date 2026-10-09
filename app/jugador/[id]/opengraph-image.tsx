import { playerBio, positionEs } from "@/lib/live/player";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Jugador en 126Goals";

// Vista previa al compartir un jugador: su foto, el nombre, el puesto y el club.
export default async function Image({ params }: { params: { id: string } }) {
  const p = /^\d+$/.test(params.id) ? await playerBio(params.id).catch(() => null) : null;
  if (!p) return ogImage({ title: "Jugadores" });
  return ogImage({ eyebrow: p.team?.name ?? "Jugador", title: p.name, subtitle: [positionEs(p.position), p.nationality].filter(Boolean).join(" · "), logos: [p.photo ?? p.team?.logo] });
}
