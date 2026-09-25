"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Historial" },
  { href: "/temporadas", label: "Temporadas" },
  { href: "/copas", label: "Copas" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="border-b-4 border-brand-500 bg-navy-950 text-white">
      <div className="mx-auto flex max-w-5xl items-stretch justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-brand-500 font-display text-lg font-extrabold leading-none">
            45
          </span>
          <span className="whitespace-nowrap font-display text-xl font-bold uppercase leading-none tracking-wide sm:text-2xl">
            Offside<span className="text-brand-300"> 45</span>
          </span>
        </Link>
        <nav className="flex items-stretch">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center border-b-2 px-2 font-display text-sm sm:text-base font-semibold uppercase tracking-wide transition sm:px-4 ${
                isActive(item.href)
                  ? "border-white text-white"
                  : "border-transparent text-navy-300 hover:text-white"
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
