// Portada de cada página: una tarjeta grande y redondeada con degradé azul y círculos decorativos.
export default function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="px-3 pt-5 sm:px-6 sm:pt-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white shadow-[0_20px_50px_-20px_rgba(7,15,32,0.55)]">
        {/* Círculos decorativos */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-400/25 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-brand-300/15 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full border-[10px] border-white/5 sm:block" />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          {eyebrow && (
            <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 ring-1 ring-white/10 sm:text-sm">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-5xl">{title}</h1>
          {children && <div className="mt-4 max-w-3xl text-navy-100">{children}</div>}
        </div>
      </div>
    </section>
  );
}
