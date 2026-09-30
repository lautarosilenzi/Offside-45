"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const NAV = [
  { href: "/", label: "Historial" },
  { href: "/temporadas", label: "Temporadas" },
  { href: "/copas", label: "Copas" },
  { href: "/campeones", label: "Campeones" },
  { href: "/balon-de-oro", label: "Balón de Oro" },
];

// Encabezado flotante: una píldora azul marino translúcida que queda fija arriba al bajar.
export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const navRef = useRef<HTMLElement>(null);

  // En el celular el menú no entra entero: se desliza hasta la sección actual.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>("[aria-current=page]");
    if (nav && active) nav.scrollLeft = active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full bg-navy-950/90 py-2 pl-2 pr-2 text-white shadow-[0_10px_30px_-10px_rgba(7,15,32,0.6)] ring-1 ring-white/10 backdrop-blur-md sm:pl-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-lg font-extrabold leading-none shadow-inner">
            45
          </span>
          <span className="hidden whitespace-nowrap font-display text-2xl font-bold uppercase leading-none tracking-wide lg:block">
            Offside<span className="text-brand-300"> 45</span>
          </span>
        </Link>
        {/* En pantallas chicas el menú se desliza de costado. */}
        <nav ref={navRef} className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-white/5 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition sm:px-4 sm:text-base ${
                isActive(item.href) ? "bg-white text-navy-950 shadow" : "text-navy-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
