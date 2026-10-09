import type { HeadToHeadStats, Team } from "@/lib/types";
import Crest from "./Crest";

export default function StatsCard({ a, b, stats }: { a: Team; b: Team; stats: HeadToHeadStats }) {
  const pct = (n: number) => (stats.played ? (n / stats.played) * 100 : 0);
  const diff = stats.winsA - stats.winsB;

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-[0_20px_40px_-20px_rgba(7,15,32,0.55)]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-6 sm:px-8">
        <TeamHead team={a} />
        <div className="text-center">
          <div className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
            {stats.played} {stats.played === 1 ? "partido oficial" : "partidos oficiales"}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-4">
            <Big value={stats.winsA} label={`Gana ${a.shortName}`} />
            <Big value={stats.draws} label="Empates" muted />
            <Big value={stats.winsB} label={`Gana ${b.shortName}`} />
          </div>
        </div>
        <TeamHead team={b} />
      </div>

      <div className="flex h-1.5">
        <div className="bg-brand-400" style={{ width: `${pct(stats.winsA)}%` }} />
        <div className="bg-navy-500" style={{ width: `${pct(stats.draws)}%` }} />
        <div className="bg-white" style={{ width: `${pct(stats.winsB)}%` }} />
      </div>

      {/* Diferencia de partidos ganados: el que va arriba en el historial suma, el otro resta. */}
      <dl className="grid grid-cols-3 divide-x divide-navy-700 bg-navy-950 text-center">
        <Diff label={`Diferencia ${a.shortName}`} value={diff} />
        <Cell label="Empates" value={String(stats.draws)} />
        <Diff label={`Diferencia ${b.shortName}`} value={-diff} />
      </dl>
    </section>
  );
}

function TeamHead({ team }: { team: Team }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <div data-confetti className="flex h-[88px] cursor-pointer items-center justify-center transition hover:scale-105">
        <Crest team={team} size="xl" />
      </div>
      <span className="w-full break-words leading-snug font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
        {team.name}
      </span>
    </div>
  );
}

function Big({ value, label, muted }: { value: number; label: string; muted?: boolean }) {
  return (
    <div>
      <div className={`font-display text-4xl font-bold tabular-nums leading-none sm:text-6xl ${muted ? "text-navy-300" : ""}`}>
        {value}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-300 sm:text-[11px]">{label}</div>
    </div>
  );
}

function Diff({ label, value }: { label: string; value: number }) {
  return <Cell label={label} value={value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0"} tone={value > 0 ? "up" : value < 0 ? "down" : undefined} />;
}

function Cell({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div className="flex flex-col-reverse px-2 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-navy-400 sm:text-[11px]">{label}</dt>
      <dd className={`font-display text-2xl font-bold tabular-nums sm:text-3xl ${tone === "up" ? "text-emerald-300" : tone === "down" ? "text-red-300" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
