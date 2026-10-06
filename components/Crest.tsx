import Image from "next/image";
import { CRESTS } from "@/lib/crests";
import type { Team } from "@/lib/types";

const SIZES = { xs: 20, sm: 28, md: 40, lg: 64, xl: 88 };

// Escudo del club; si no hay uno documentado, un escudo neutro con las iniciales.
export default function Crest({ team, size = "sm" }: { team: Team; size?: keyof typeof SIZES }) {
  const px = SIZES[size];
  const crest = CRESTS[team.id];

  if (crest) {
    return (
      <Image
        src={crest.file}
        alt={`Escudo de ${team.name}`}
        width={px}
        height={px}
        className="logo-img shrink-0 object-contain"
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-b-[40%] rounded-t-sm border border-navy-300 bg-navy-50 font-display font-bold text-navy-600"
      style={{ width: px * 0.82, height: px, fontSize: Math.max(9, px * 0.28) }}
      title={team.fullName ?? team.name}
      aria-hidden
    >
      {team.shortName}
    </span>
  );
}
