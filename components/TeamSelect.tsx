import { TEAM_IDS_WITH_MATCHES } from "@/lib/matches";
import { HISTORIC_TEAMS, TEAMS } from "@/lib/teams";

type Props = {
  label: string;
  value: string;
  exclude: string;
  onChange: (id: string) => void;
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "es");
const CURRENT = [...TEAMS].sort(byName);
// Solo los históricos que tienen partidos cargados.
const HISTORIC = HISTORIC_TEAMS.filter((t) => TEAM_IDS_WITH_MATCHES.has(t.id)).sort(byName);

export default function TeamSelect({ label, value, exclude, onChange }: Props) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-base font-medium shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <optgroup label="Clubes actuales">
            {CURRENT.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === exclude}>
                {t.name}
              </option>
            ))}
          </optgroup>
          {HISTORIC.length > 0 && (
            <optgroup label="Clubes históricos">
              {HISTORIC.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === exclude}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          aria-hidden
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </div>
    </label>
  );
}
