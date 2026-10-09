"use client";

// País del visitante: define los torneos destacados (menú y portada). Por ahora la página está pensada para Argentina
// y en castellano; esta es la base para sumar otros países (y, más adelante, otros idiomas: el campo lang).
import { useEffect, useState } from "react";

export type Country = { id: string; name: string; flag: string; lang: "es" | "pt" | "en"; featured: string[] };

// Torneos destacados de cada país, por id de competencia (lib/competitions.ts). "historiales" y "balon-de-oro" son
// secciones del sitio.
export const COUNTRIES: Country[] = [
  { id: "AR", name: "Argentina", flag: "ar", lang: "es", featured: ["historiales", "liga-profesional", "primera-nacional", "libertadores", "sudamericana", "copa-argentina", "champions", "eliminatorias", "mundial", "balon-de-oro", "messi-vs-cristiano"] },
  { id: "UY", name: "Uruguay", flag: "uy", lang: "es", featured: ["primera-uruguay", "libertadores", "sudamericana", "champions", "eliminatorias", "mundial", "balon-de-oro"] },
  { id: "CL", name: "Chile", flag: "cl", lang: "es", featured: ["primera-chile", "copa-chile", "libertadores", "sudamericana", "champions", "eliminatorias", "mundial"] },
  { id: "CO", name: "Colombia", flag: "co", lang: "es", featured: ["primera-colombia", "copa-colombia", "libertadores", "sudamericana", "champions", "eliminatorias", "mundial"] },
  { id: "MX", name: "México", flag: "mx", lang: "es", featured: ["liga-mx", "concacaf-champions", "leagues-cup", "copa-oro", "champions", "mundial"] },
  { id: "ES", name: "España", flag: "es", lang: "es", featured: ["laliga", "segunda-espana", "copa-del-rey", "champions", "europa-league", "mundial", "balon-de-oro"] },
  { id: "US", name: "Estados Unidos", flag: "us", lang: "es", featured: ["mls", "leagues-cup", "concacaf-champions", "liga-mx", "premier-league", "champions", "mundial"] },
];

const KEY = "o45-pais";
const EVENT = "o45-pais";

export function useCountry(): Country {
  const [id, setId] = useState("AR");
  useEffect(() => {
    const read = () => {
      try {
        setId(localStorage.getItem(KEY) ?? "AR");
      } catch {}
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  return COUNTRIES.find((c) => c.id === id) ?? COUNTRIES[0];
}

export function setCountry(id: string) {
  try {
    localStorage.setItem(KEY, id);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
