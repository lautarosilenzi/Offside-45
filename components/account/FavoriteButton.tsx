"use client";

import { useEffect, useState } from "react";
import { type Favorite, toggleFavorite, useFavorites } from "@/lib/account";

// "Seguir" un club o un torneo: queda en Mi cuenta, con sus resultados (en la cuenta si hay sesión; si no, en el
// navegador).
export default function FavoriteButton({ fav }: { fav: Favorite }) {
  const favs = useFavorites();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const on = favs.some((f) => f.kind === fav.kind && f.ref === fav.ref);
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(fav, !on)}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide transition ${
        on ? "bg-volt-500 text-white hover:bg-volt-600" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
      }`}
    >
      <span aria-hidden>{on ? "★" : "☆"}</span>
      {on ? "Siguiendo" : "Seguir"}
    </button>
  );
}
