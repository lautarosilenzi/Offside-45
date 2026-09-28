"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CLASICOS } from "@/lib/teams";
import type { Team } from "@/lib/types";
import TeamSelect from "./TeamSelect";

type Option = Pick<Team, "id" | "name">;

// Selectores del historial: cambian la URL (/?a=river&b=boca) y el servidor calcula el cruce.
export default function TeamPicker({
  a,
  b,
  current,
  others,
}: {
  a: Team;
  b: Team;
  current: Option[];
  others: Option[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const go = (na: string, nb: string) => startTransition(() => router.push(`/?a=${na}&b=${nb}`, { scroll: false }));

  return (
    <section className={`panel p-4 transition-opacity sm:p-5 ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
        <TeamSelect label="Equipo 1" team={a} exclude={b.id} current={current} others={others} onChange={(id) => go(id, b.id)} />
        <button
          type="button"
          onClick={() => go(b.id, a.id)}
          aria-label="Invertir equipos"
          title="Invertir equipos"
          className="mx-auto flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition hover:border-brand-500 hover:text-brand-500"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rotate-90 sm:rotate-0" aria-hidden>
            <path d="M13.2 3.3a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-3 3a1 1 0 1 1-1.4-1.4L14.5 8H4a1 1 0 0 1 0-2h10.5l-1.3-1.3a1 1 0 0 1 0-1.4zM6.8 9.3a1 1 0 0 1 0 1.4L5.5 12H16a1 1 0 1 1 0 2H5.5l1.3 1.3a1 1 0 1 1-1.4 1.4l-3-3a1 1 0 0 1 0-1.4l3-3a1 1 0 0 1 1.4 0z" />
          </svg>
        </button>
        <TeamSelect label="Equipo 2" team={b} exclude={a.id} current={current} others={others} onChange={(id) => go(a.id, id)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
        <span className="mr-1 font-display text-xs font-semibold uppercase tracking-[0.15em] text-navy-400">Clásicos</span>
        {CLASICOS.map((c) => {
          const active = (a.id === c.a && b.id === c.b) || (a.id === c.b && b.id === c.a);
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => go(c.a, c.b)}
              className={`rounded-full border px-3.5 py-1 text-sm font-semibold transition ${
                active ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
