// Banda azul marino con el título de cada página.
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
    <section className="bg-navy-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {eyebrow && (
          <div className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-3xl text-navy-200">{children}</div>}
      </div>
    </section>
  );
}
