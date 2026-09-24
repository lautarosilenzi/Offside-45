import { TEAM_IDS_WITH_MATCHES } from "@/lib/matches";
import { HISTORIC_TEAMS, TEAMS, getTeam } from "@/lib/teams";
import Crest from "./Crest";

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
  const team = getTeam(value);
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-navy-500">{label}</span>
      <div className="relative flex items-center">
        {team && (
          <span className="pointer-events-none absolute left-3">
            <Crest team={team} size="xs" />
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-sm border border-navy-200 bg-white py-2.5 pl-11 pr-10 text-base font-semibold text-navy-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <optgroup label="Primera División actual">
            {CURRENT.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === exclude}>
                {t.name}
              </option>
            ))}
          </optgroup>
          {HISTORIC.length > 0 && (
            <optgroup label="Otros clubes (históricos y de otras categorías)">
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
          className="pointer-events-none absolute right-3 h-5 w-5 text-navy-400"
          aria-hidden
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </div>
    </label>
  );
}
