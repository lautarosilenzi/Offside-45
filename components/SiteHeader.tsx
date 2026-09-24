import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-white">
            45
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Offside <span className="text-brand-500">45</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link href="/" className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-brand-50 hover:text-brand-600">
            Historial
          </Link>
          <Link
            href="/temporadas"
            className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-brand-50 hover:text-brand-600"
          >
            Temporadas
          </Link>
        </nav>
      </div>
    </header>
  );
}
