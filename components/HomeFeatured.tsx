"use client";

import Link from "next/link";
import CompLogo from "@/components/CompLogo";
import { featuredList } from "@/lib/competitions";
import { useCountry } from "@/lib/region";

// Torneos destacados de la portada, según el país elegido en el menú (Argentina por defecto).
export default function HomeFeatured() {
  const country = useCountry();
  const tournaments = featuredList(country.featured).filter((c) => c.href?.startsWith("/torneos/"));
  return (
    <nav aria-label="Torneos destacados" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {tournaments.map((c) => (
        <Link
          key={c.id}
          href={c.href!}
          className="flex min-h-[2.75rem] items-center gap-2 rounded-2xl bg-white px-3 py-1.5 text-sm font-semibold leading-tight text-navy-800 ring-1 ring-navy-100 transition hover:ring-volt-400 sm:rounded-full"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <CompLogo id={c.id} size={20} />
          </span>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
