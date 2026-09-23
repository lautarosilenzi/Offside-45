import type { HeadToHeadStats, Team } from "@/lib/types";
import TeamBadge from "./TeamBadge";

export default function StatsCard({ a, b, stats }: { a: Team; b: Team; stats: HeadToHeadStats }) {
  const pct = (n: number) => (stats.played ? (n / stats.played) * 100 : 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-6 text-white sm:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamBadge team={a} size="lg" />
            <span className="w-full truncate text-sm font-semibold sm:text-base">{a.name}</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold tabular-nums sm:text-5xl">
              {stats.winsA}
              <span className="mx-2 text-white/40">·</span>
              {stats.draws}
              <span className="mx-2 text-white/40">·</span>
              {stats.winsB}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-white/70">
              G · E · G — {stats.played} {stats.played === 1 ? "partido" : "partidos"}
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamBadge team={b} size="lg" />
            <span className="w-full truncate text-sm font-semibold sm:text-base">{b.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-8">
        <div>
          <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
            <span>Victorias {a.shortName}</span>
            <span>Empates</span>
            <span>Victorias {b.shortName}</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-brand-500 transition-all" style={{ width: `${pct(stats.winsA)}%` }} />
            <div className="bg-slate-300 transition-all" style={{ width: `${pct(stats.draws)}%` }} />
            <div className="bg-brand-200 transition-all" style={{ width: `${pct(stats.winsB)}%` }} />
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 text-center">
          <Stat label={`Goles ${a.shortName}`} value={stats.goalsA} />
          <Stat label="Goles totales" value={stats.goalsA + stats.goalsB} muted />
          <Stat label={`Goles ${b.shortName}`} value={stats.goalsB} />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className={`flex flex-col-reverse rounded-xl px-3 py-4 ${muted ? "bg-slate-50" : "bg-brand-50"}`}>
      <dt className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={`text-2xl font-bold tabular-nums ${muted ? "text-slate-700" : "text-brand-600"}`}>{value}</dd>
    </div>
  );
}
