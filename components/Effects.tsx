"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Efectos para toda la página (las animaciones que son solo CSS están en globals.css):
// - los números de las portadas (.stat-value) se cuentan hacia arriba al cargar;
// - el brillo azul de las portadas (.spotlight) sigue al mouse;
// - al tocar algo de un campeón ([data-confetti]) saltan papelitos celestes y blancos.
export default function Effects() {
  const pathname = usePathname();

  // Conteo de los números de la portada: "52.643" sube de 0 a 52.643 en menos de un segundo.
  useEffect(() => {
    if (reduced()) return;
    const els = [...document.querySelectorAll<HTMLElement>(".stat-value")];
    const frames: number[] = [];
    for (const el of els) {
      const text = el.textContent ?? "";
      if (!/^\d[\d.]*$/.test(text.trim())) continue; // "1891–2026" y similares quedan como están
      const target = Number(text.replace(/\./g, ""));
      if (!target) continue;
      const start = performance.now();
      const dur = 900;
      const fmt = (n: number) => (text.includes(".") ? n.toLocaleString("es-AR") : String(n));
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frames.push(requestAnimationFrame(step));
      };
      frames.push(requestAnimationFrame(step));
    }
    return () => frames.forEach(cancelAnimationFrame);
  }, [pathname]);

  // Brillo de la portada que sigue al mouse.
  useEffect(() => {
    if (reduced()) return;
    const onMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  // Papelitos.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (reduced()) return;
      const target = (e.target as HTMLElement).closest("[data-confetti]");
      if (!target) return;
      const colors = ["#6cace4", "#ffffff", "#f5b301", "#1f6bff"];
      for (let i = 0; i < 26; i++) {
        const p = document.createElement("span");
        p.className = "confetti-piece";
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 110;
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        p.style.setProperty("--dy", `${Math.sin(angle) * dist - 40}px`);
        p.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
