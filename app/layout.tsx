import { existsSync } from "fs";
import type { Metadata, Viewport } from "next";
import { join } from "path";
import { Barlow_Condensed, Inter } from "next/font/google";
import Effects from "@/components/Effects";
import LiveTicker from "@/components/live/LiveTicker";
import AlertsWatcher from "@/components/match/AlertsWatcher";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

// Texto: Inter, hecha para pantallas (números de ancho fijo en las tablas). Títulos, marcadores y etiquetas: Barlow
// Condensed, la condensada deportiva, hasta el peso más fuerte.
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800", "900"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Offside 45 · Fútbol en vivo, estadísticas e historia",
  description: "Resultados en vivo, estadísticas de partidos y jugadores, torneos de todo el mundo y la historia del fútbol argentino desde 1891.",
};

// El sitio es solo oscuro: la barra del navegador del celular, del mismo color.
export const viewport: Viewport = { themeColor: "#060c19", colorScheme: "dark" };

// Logo de Offside 45: public/logo-circulo.png (el redondo, para el encabezado). Si todavía no está, se ve el "45".
const LOGO = existsSync(join(process.cwd(), "public", "logo-circulo.png")) ? "/logo-circulo.png" : undefined;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Siempre en modo oscuro (los colores salen de las variables de html.dark, en globals.css).
    <html lang="es" className={`dark ${body.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader logo={LOGO} />
        <LiveTicker />
        <div className="page-enter flex-1">{children}</div>
        <SiteFooter />
        <Effects />
        <AlertsWatcher />
      </body>
    </html>
  );
}
