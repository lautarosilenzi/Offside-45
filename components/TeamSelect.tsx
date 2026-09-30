import type { Team } from "@/lib/types";
import Crest from "./Crest";

type Option = Pick<Team, "id" | "name">;

type Props = {
  label: string;
  team: Team;
  exclude: string;
  current: Option[];
  others: Option[];
  foreign: Option[];
  onChange: (id: string) => void;
};

export default function TeamSelect({ label, team, exclude, current, others, foreign, onChange }: Props) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-navy-500">{label}</span>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3">
          <Crest team={team} size="xs" />
        </span>
        <select
          value={team.id}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-full border border-navy-200 bg-white py-2.5 pl-11 pr-10 text-base font-semibold text-navy-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <optgroup label="Primera División actual">
            {current.map((t) => (
              <option key={t.id} value={t.id} disabled={t.id === exclude}>
                {t.name}
              </option>
            ))}
          </optgroup>
          {others.length > 0 && (
            <optgroup label="Otros clubes (históricos y de otras categorías)">
              {others.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === exclude}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          )}
          {foreign.length > 0 && (
            <optgroup label="Clubes del exterior (copas internacionales)">
              {foreign.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === exclude}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-3 h-5 w-5 text-navy-400" aria-hidden>
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </div>
    </label>
  );
}
