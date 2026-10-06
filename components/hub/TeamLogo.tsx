import Crest from "@/components/Crest";
import type { LiveTeam } from "@/lib/live/espn";
import { getTeam } from "@/lib/teams";

// Escudo de un equipo de la fuente en vivo: el del sitio si es un club argentino que tenemos, si no el de ESPN.
export default function TeamLogo({ team, size = 20 }: { team: LiveTeam; size?: number }) {
  const ours = team.teamId ? getTeam(team.teamId) : undefined;
  if (ours) return <Crest team={ours} size={size <= 20 ? "xs" : size <= 28 ? "sm" : size <= 40 ? "md" : "lg"} />;
  if (team.logo)
    // eslint-disable-next-line @next/next/no-img-element -- escudo de la fuente en vivo
    return <img src={team.logo} alt="" loading="lazy" width={size} height={size} className="logo-img shrink-0 object-contain" style={{ width: size, height: size }} />;
  return <span className="inline-block shrink-0 rounded-full bg-navy-100" style={{ width: size, height: size }} />;
}
