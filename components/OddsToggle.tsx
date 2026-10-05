"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { setOddsEnabled, useOddsEnabled } from "@/lib/prefs";

// Interruptor de cuotas: apagado por defecto. Para prenderlo hay que confirmar ser mayor de 18; queda recordado en
// este navegador.
export default function OddsToggle({ variant = "header" }: { variant?: "header" | "menu" }) {
  const on = useOddsEnabled();
  const [asking, setAsking] = useState(false);

  const click = () => (on ? setOddsEnabled(false) : setAsking(true));

  return (
    <>
      {variant === "header" ? (
        <button
          type="button"
          onClick={click}
          aria-pressed={on}
          title={on ? "Ocultar cuotas" : "Mostrar cuotas"}
          className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 font-display text-sm font-bold uppercase tracking-wide transition ${
            on ? "bg-gold-400 text-navy-950" : "bg-white/5 text-white hover:bg-white/15"
          }`}
        >
          <span aria-hidden>%</span> Cuotas
        </button>
      ) : (
        <button
          type="button"
          onClick={click}
          aria-pressed={on}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 font-display text-base font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
        >
          Cuotas de apuestas
          <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gold-400" : "bg-white/20"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[1.4rem]" : "left-0.5"}`} />
          </span>
        </button>
      )}

      {asking &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 px-4" role="dialog" aria-modal="true" aria-label="Mostrar cuotas" onClick={() => setAsking(false)}>
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 font-display text-xl font-extrabold text-navy-950">+18</div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">Cuotas de apuestas</h2>
              <p className="mt-2 text-sm text-navy-600">
                Vas a ver las cuotas que publican las casas de apuestas para cada partido. Es información, no una recomendación. Solo para mayores de 18
                años. Jugá con responsabilidad.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOddsEnabled(true);
                    setAsking(false);
                  }}
                  className="btn-primary justify-center"
                >
                  Soy mayor de 18, mostrar cuotas
                </button>
                <button type="button" onClick={() => setAsking(false)} className="text-sm font-semibold text-navy-500 hover:text-navy-800">
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
