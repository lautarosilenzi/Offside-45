import type { Team } from "@/lib/types";

const SIZES = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-12 w-12 text-xs",
  lg: "h-16 w-16 text-sm",
};

export default function TeamBadge({ team, size = "md" }: { team: Team; size?: keyof typeof SIZES }) {
  return (
    <div
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full font-bold tracking-wide shadow-sm ring-1 ring-slate-200`}
      style={{
        background: `linear-gradient(135deg, ${team.primary} 0 55%, ${team.secondary} 55% 100%)`,
      }}
      aria-hidden
    >
      <span className="rounded bg-white/90 px-1 text-slate-900">{team.shortName}</span>
    </div>
  );
}
