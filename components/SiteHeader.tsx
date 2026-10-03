"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FEATURED, GROUPS, LIVE_CODE, compHref } from "@/lib/competitions";
import LOGOS from "@/lib/data/comps.generated.json";

const NAV = [
  { href: "/temporadas", label: "Liga Argentina" },
  { href: "/copa-argentina", label: "Copa Argentina" },
  { href: "/libertadores", label: "Libertadores" },
  { href: "/sudamericana", label: "Sudamericana" },
  { href: "/", label: "Historiales" },
];

// Comunidad: el foro, la cuenta y las donaciones van al pie del menú.
const COMMUNITY = [
  { href: "/foro", label: "El foro del hincha" },
  { href: "/cuenta", label: "Mi cuenta" },
  { href: "/colaborar", label: "Colaborá con Offside 45" },
];

const logoOf = (id: string) => (LOGOS as Record<string, { file: string }>)[id]?.file;

// Encabezado flotante: el menú de tres líneas a la izquierda abre un panel lateral con todas las secciones,
// agrupadas por país como en los sitios de resultados; arriba quedan las cinco secciones principales.
export default function SiteHeader({ logo }: { logo?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  // Grupo desplegado en el menú lateral: el de la sección actual, o "destacado".
  const [expanded, setExpanded] = useState<string>("destacado");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const current = GROUPS.find((g) => g.competitions.some((c) => c.href && c.href !== "/" && pathname.startsWith(c.href)));
    setExpanded(pathname.startsWith("/ligas/") ? pathname.split("/")[2] : (current?.id ?? "destacado"));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, pathname]);

  // En el celular la barra no entra entera: se desliza hasta la sección actual.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>("[aria-current=page]");
    if (nav && active) nav.scrollLeft = active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-5xl items-center gap-2 rounded-full bg-[#050b1a]/90 py-2 pl-2 pr-2 text-white shadow-[0_10px_30px_-10px_rgba(5,11,26,0.7)] ring-1 ring-volt-400/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Abrir el menú"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link href="/" className="logo-link flex shrink-0 items-center gap-2.5" aria-label="Offside 45, inicio">
            {logo ? (
              <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full" priority />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-lg font-extrabold leading-none shadow-inner">
                45
              </span>
            )}
            <span className="hidden whitespace-nowrap font-display text-2xl font-bold uppercase italic leading-none tracking-wide lg:block">
              Offside<span className="text-volt-400"> 45</span>
            </span>
          </Link>
          <nav
            ref={navRef}
            className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-white/5 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition sm:px-4 sm:text-base ${
                  isActive(item.href) ? "bg-gradient-to-r from-volt-400 to-volt-600 text-white shadow-[0_0_18px_rgba(31,107,255,0.55)]" : "text-navy-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Menú lateral */}
      <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col bg-navy-950 text-white shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Menú"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="font-display text-xl font-bold uppercase italic tracking-wide">
              Offside<span className="text-volt-400"> 45</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar el menú"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-3 [scrollbar-width:thin]">
            <Group id="destacado" title="Destacado" expanded={expanded} setExpanded={setExpanded}>
              {FEATURED.map((c) => (
                <MenuLink key={c.id} href={c.href!} label={c.name} logo={logoOf(c.id)} active={isActive(c.href!)} />
              ))}
            </Group>
            {GROUPS.map((g) => (
              <Group key={g.id} id={g.id} title={g.name} flag={g.flag} expanded={expanded} setExpanded={setExpanded}>
                {g.competitions.map((c) => {
                  const href = compHref(g, c);
                  return <MenuLink key={c.id} href={href} label={c.name} logo={logoOf(c.id)} active={pathname === href || (!!c.href && c.href !== "/" && pathname.startsWith(c.href))} pending={!c.href && !LIVE_CODE[c.id]} />;
                })}
              </Group>
            ))}
            <div className="mx-2 my-3 border-t border-white/10" />
            {COMMUNITY.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`block rounded-xl px-3 py-2 font-display text-base font-semibold uppercase tracking-wide transition hover:bg-white/10 ${
                  isActive(c.href) ? "text-brand-300" : "text-white"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

function Group({
  id,
  title,
  flag,
  expanded,
  setExpanded,
  children,
}: {
  id: string;
  title: string;
  flag?: string;
  expanded: string;
  setExpanded: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = expanded === id;
  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setExpanded(open ? "" : id)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-display text-base font-bold uppercase tracking-wide transition hover:bg-white/5 ${
          open ? "text-brand-300" : "text-white"
        }`}
      >
        {flag && (
          // eslint-disable-next-line @next/next/no-img-element -- bandera SVG estática
          <img src={`/flags/${flag}.svg`} alt="" loading="lazy" className="h-4 w-4 shrink-0 rounded-full object-cover ring-1 ring-white/20" />
        )}
        <span className="flex-1">{title}</span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-2 pl-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, label, logo, active, pending }: { href: string; label: string; logo?: string; active?: boolean; pending?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[0.95rem] transition hover:bg-white/10 ${active ? "text-brand-300" : "text-navy-100"}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white p-0.5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo chico ya optimizado
          <img src={logo} alt="" loading="lazy" className="h-full w-full object-contain" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-navy-300" />
        )}
      </span>
      <span className="flex-1">{label}</span>
      {pending && <span className="rounded-full bg-white/10 px-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-navy-300">Pronto</span>}
    </Link>
  );
}
