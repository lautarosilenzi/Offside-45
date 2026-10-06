"use client";

import { useEffect, useState } from "react";
import { THEME_KEY as KEY } from "@/lib/theme";

// Modo claro u oscuro. Sin elegir, sigue al del sistema; la elección queda guardada en este navegador.
export default function ThemeToggle({ variant = "header" }: { variant?: "header" | "menu" }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    // Si no eligió, acompaña los cambios del sistema (por ejemplo, el modo oscuro automático de noche).
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      let chosen: string | null = null;
      try {
        chosen = localStorage.getItem(KEY);
      } catch {}
      if (chosen) return;
      document.documentElement.classList.toggle("dark", mq.matches);
      setDark(mq.matches);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {}
  };

  const icon = dark ? (
    // Sol: pasar a claro.
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    // Luna: pasar a oscuro.
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );

  if (variant === "menu")
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={dark}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2 font-display text-base font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
      >
        Modo oscuro
        <span className={`relative h-6 w-11 rounded-full transition ${dark ? "bg-volt-500" : "bg-white/20"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${dark ? "left-[1.4rem]" : "left-0.5"}`} />
        </span>
      </button>
    );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Pasar a modo claro" : "Pasar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/15"
    >
      {icon}
    </button>
  );
}
