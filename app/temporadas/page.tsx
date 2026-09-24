import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SEASONS, verifySeason } from "@/lib/seasons";
import { getTeam } from "@/lib/teams";

export const metadata: Metadata = { title: "Temporadas · Offside 45" };

export default function SeasonsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Temporadas</h1>
        <p className="mt-2 text-slate-600">
          Todos los partidos oficiales de Primera División, año por año, desde el primer campeonato de 1891.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SEASONS.map((s) => {
            const ok = verifySeason(s).length === 0;
            const champions = s.championIds.map((id) => getTeam(id)?.name ?? id).join(" y ");
            return (
              <Link
                key={s.year}
                href={`/temporadas/${s.year}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl font-extrabold tabular-nums text-brand-500">{s.year}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {ok ? "Tabla verificada" : "Revisar tabla"}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">Campeón: {champions}</p>
                <p className="mt-1 text-xs text-slate-500">{s.matches.length} partidos</p>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-slate-400">Las próximas temporadas se van cargando de a una, verificadas.</p>
      </main>
    </>
  );
}
