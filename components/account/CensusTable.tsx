"use client";
/* eslint-disable @next/next/no-img-element -- escudos */

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasServer } from "@/lib/account";
import { supabase } from "@/lib/supabase";

type Row = { club_id: string; club_name: string; club_logo?: string; hinchas: number };

// Resultado del Censo del Hincha: cuántos hinchas tiene cada club entre las cuentas de 126Goals (solo totales).
export default function CensusTable() {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    if (!supabase) return setRows([]);
    supabase
      .from("censo")
      .select("*")
      .limit(100)
      .then(({ data }) => setRows((data ?? []) as Row[]));
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
  if (!rows) return <div className="skeleton h-64 rounded-3xl" />;
  if (!rows.length) return <p className="panel px-6 py-10 text-center text-navy-500">Todavía no hay hinchas censados. ¡Sé el primero!</p>;
  const total = rows.reduce((n, r) => n + r.hinchas, 0);
  return (
    <ol className="panel divide-y divide-navy-100">
      {rows.map((r, i) => (
        <li key={r.club_id} className="flex items-center gap-3 px-4 py-3">
          <span className="w-7 tabular-nums text-navy-400">{i + 1}</span>
          {r.club_logo ? <img src={r.club_logo} alt="" className="logo-img h-8 w-8 object-contain" /> : <span className="h-8 w-8 rounded-full bg-navy-200" />}
          <span className="min-w-0 flex-1 font-semibold text-navy-950">{r.club_name}</span>
          <span className="text-right">
            <span className="block font-display text-xl font-bold tabular-nums text-navy-950">{r.hinchas.toLocaleString("es-AR")}</span>
            <span className="block text-xs text-navy-400">{((r.hinchas / total) * 100).toFixed(1).replace(".", ",")}%</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
