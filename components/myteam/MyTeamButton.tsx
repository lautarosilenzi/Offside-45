"use client";

import { useEffect, useState } from "react";
import { setMyTeam, useMyTeam, type MyTeam } from "@/lib/prefs";

// Botón de la página de un equipo: lo guarda como "Mi equipo" (se ve en la portada) o lo quita.
export default function MyTeamButton({ team }: { team: MyTeam }) {
  const mine = useMyTeam();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isMine = mine?.id === team.id;
  return (
    <button
      type="button"
      onClick={() => setMyTeam(isMine ? null : team)}
      aria-pressed={isMine}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide transition ${
        isMine ? "bg-gold-400 text-navy-950 hover:bg-gold-500" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isMine ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
      </svg>
      {isMine ? "Es mi equipo" : "Hacerlo mi equipo"}
    </button>
  );
}
