"use client";

import { useEffect, useState } from "react";

// Pestañas de la página de un torneo (Fixture y tablas · Equipos y estadísticas · Campeones). El contenido de las tres
// viene armado del servidor; acá solo se elige cuál se ve. La pestaña queda en la dirección (#equipos) para compartirla.
export default function HubTabs({ tabs }: { tabs: { id: string; label: string; short?: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  return (
    <div>
      {/* Con una sola pestaña (los amistosos), no hace falta elegir. */}
      <div role="tablist" className={`mb-5 grid border-b border-navy-200 ${tabs.length < 2 ? "hidden" : ""}`} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => {
              setActive(t.id);
              history.replaceState(null, "", `#${t.id}`);
            }}
            className={`-mb-px border-b-2 px-1.5 py-3 text-center font-display text-[0.95rem] font-bold uppercase leading-tight tracking-wide transition sm:text-lg ${
              active === t.id ? "border-volt-500 text-volt-600" : "border-transparent text-navy-700 hover:text-navy-950"
            }`}
          >
            {/* En el celular, el nombre corto (si tiene) para que entren todas en una línea. */}
            {t.short ? (
              <>
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </>
            ) : (
              t.label
            )}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
