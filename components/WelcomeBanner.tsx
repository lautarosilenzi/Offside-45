"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "o45-bienvenida";

// Cartel de bienvenida de la portada. Se cierra con la cruz y no vuelve a aparecer en ese navegador.
export default function WelcomeBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };
  return (
    <section className="on-dark relative overflow-hidden rounded-3xl bg-gradient-to-br from-volt-600 to-brand-700 px-5 py-4 pr-12 text-white shadow-[0_18px_40px_-20px_rgba(31,107,255,0.8)]">
      <p className="font-display text-xl font-black uppercase italic leading-tight">¡Bienvenido a 126Goals! 👋</p>
      <p className="mt-1 text-[0.95rem] leading-snug text-white/90">Seguimos mejorando la página todos los días. No dejes de apoyarnos.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/colaborar" className="rounded-full bg-white px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-navy-950">
          Apoyar
        </Link>
        <Link href="/cuenta" className="rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-white ring-1 ring-white/60">
          Crear mi cuenta
        </Link>
      </div>
      <button type="button" onClick={close} aria-label="Cerrar el cartel" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none hover:bg-white/25">
        ✕
      </button>
    </section>
  );
}
