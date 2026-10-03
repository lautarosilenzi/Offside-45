"use client";

import { useEffect } from "react";

// Efecto chico para toda la página (el de las tarjetas que aparecen al bajar está en globals.css):
// al tocar algo de un campeón (los "Campeón", la tabla de campeones, una copa) saltan papelitos celestes y blancos.
export default function Effects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = (e.target as HTMLElement).closest("[data-confetti]");
      if (!target) return;
      const colors = ["#6cace4", "#ffffff", "#f5b301", "#2563eb"];
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
