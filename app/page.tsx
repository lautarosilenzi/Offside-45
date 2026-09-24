import HeadToHead from "@/components/HeadToHead";

export default function Home() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-white">
              45
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Offside <span className="text-brand-500">45</span>
            </span>
          </div>
          <span className="hidden text-xs font-medium text-slate-500 sm:block">Fútbol argentino · Primera División</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Historial entre equipos</h1>
          <p className="mt-2 text-slate-600">
            Elegí dos equipos y mirá todos sus enfrentamientos, resultados y estadísticas.
          </p>
        </div>
        <HeadToHead />
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6">
        Datos: RSSSF (rsssf.org) y Wikipedia · Offside 45
      </footer>
    </>
  );
}
