"use client";
/* eslint-disable @next/next/no-img-element -- escudos */

import Link from "next/link";
import { useEffect, useState } from "react";
import Flag from "@/components/Flag";
import { hasServer } from "@/lib/account";
import { NATIONS } from "@/lib/data/nations";
import { supabase } from "@/lib/supabase";

type Row = { key: string; name: string; logo?: string; flag?: string; count: number };

const COUNTRY_NAME = Object.fromEntries(Object.values(NATIONS).map((n) => [n.flag, n.name]));
const TOP = 10;

// Censo del Hincha (como las comunidades de El Nine): cómo se reparten los hinchas de 126Goals por club y por país, con
// barras y porcentajes; los diez primeros y "Ver más". Solo totales: nunca quién es quién.
export default function CensusTable() {
  const [view, setView] = useState<"clubes" | "paises">("clubes");
  const [clubs, setClubs] = useState<Row[] | null>(null);
  const [countries, setCountries] = useState<Row[] | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("censo")
      .select("*")
      .limit(500)
      .then(({ data }) => setClubs((data ?? []).map((r: any) => ({ key: r.club_id, name: r.club_name ?? r.club_id, logo: r.club_logo ?? undefined, count: r.hinchas }))));
    supabase
      .from("profiles")
      .select("country")
      .limit(10000)
      .then(({ data }) => {
        const count = new Map<string, number>();
        for (const r of data ?? []) {
          const c = String((r as { country?: string }).country ?? "ar").toLowerCase();
          count.set(c, (count.get(c) ?? 0) + 1);
        }
        setCountries([...count.entries()].map(([k, n]) => ({ key: k, name: COUNTRY_NAME[k] ?? k.toUpperCase(), flag: k, count: n })).sort((a, b) => b.count - a.count));
      });
  }, []);

  if (!hasServer)
    return (
      <p className="panel px-6 py-10 text-center text-navy-500">
        El censo arranca cuando se activen las cuentas. Mientras tanto, podés{" "}
        <Link href="/cuenta" className="text-volt-600 underline">
          crear tu cuenta
        </Link>{" "}
        y elegir tu club.
      </p>
    );

  const rows = view === "clubes" ? clubs : countries;
  const total = rows?.reduce((n, r) => n + r.count, 0) ?? 0;
  const max = rows?.[0]?.count ?? 1;
  const shown = all ? rows : rows?.slice(0, TOP);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-500">{view === "clubes" ? "Así se reparten los colores de la comunidad." : "Así se reparte el mapa de la comunidad."}</p>
        <div className="flex gap-1.5" role="group" aria-label="Ver por">
          {(["clubes", "paises"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => (setView(v), setAll(false))}
              aria-pressed={view === v}
              className={`rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide ring-1 transition ${
                view === v ? "bg-volt-500 text-white ring-volt-500" : "text-navy-600 ring-navy-200 hover:ring-volt-400"
              }`}
            >
              {v === "clubes" ? "Clubes" : "Países"}
            </button>
          ))}
        </div>
      </div>

      {!rows ? (
        <div className="skeleton h-64 rounded-3xl" />
      ) : !rows.length ? (
        <p className="panel px-6 py-10 text-center text-navy-500">Todavía no hay hinchas censados. ¡Sé el primero!</p>
      ) : (
        <div className="panel overflow-hidden">
          <ol className="divide-y divide-navy-100">
            {shown!.map((r, i) => (
              <li key={r.key} className="grid grid-cols-[2rem_2.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 px-4 py-3">
                <span className="font-display text-lg font-bold tabular-nums text-navy-400">{i + 1}</span>
                <span className="flex justify-center">
                  {r.flag ? (
                    <Flag code={r.flag} size={22} />
                  ) : r.logo ? (
                    <img src={r.logo} alt="" className="logo-sm h-8 w-8 object-contain" />
                  ) : (
                    <span className="h-7 w-7 rounded-full bg-navy-200" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold leading-tight text-navy-950">{r.name}</span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-navy-100">
                    <span className="block h-full rounded-full bg-volt-500" style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }} />
                  </span>
                </span>
                <span className="text-right font-display text-xl font-bold tabular-nums text-navy-950">{Math.round((r.count / total) * 100)}%</span>
              </li>
            ))}
          </ol>
          {rows.length > TOP && (
            <button type="button" onClick={() => setAll(!all)} className="w-full border-t border-navy-100 py-3 font-display text-sm font-bold uppercase tracking-widest text-navy-600 hover:bg-navy-50">
              {all ? "Ver menos" : `Ver más (${rows.length - TOP})`}
            </button>
          )}
        </div>
      )}
      {rows && rows.length > 0 && <p className="text-center text-xs text-navy-400">{total.toLocaleString("es-AR")} hinchas censados</p>}
    </div>
  );
}
