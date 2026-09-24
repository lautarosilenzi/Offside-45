import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy-950 text-navy-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display font-bold uppercase tracking-wide text-white">Offside 45</span> · Historia del
          fútbol argentino desde 1891
        </p>
        <p>
          Datos: RSSSF y Wikipedia ·{" "}
          <Link href="/creditos" className="text-white underline-offset-2 hover:underline">
            Fuentes y créditos
          </Link>
        </p>
      </div>
    </footer>
  );
}
