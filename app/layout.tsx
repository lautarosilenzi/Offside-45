import type { Metadata, Viewport } from "next";
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
  // Dirección del sitio: con ella, la imagen y los links al compartir salen completos.
  metadataBase: new URL("https://126goals.vercel.app"),
  title: "126Goals · Fútbol en vivo, estadísticas e historia",
  description: "Resultados en vivo, estadísticas de partidos y jugadores, torneos de todo el mundo y la historia del fútbol argentino desde 1891.",
  applicationName: "126Goals",
  // Al compartir un link (WhatsApp, redes): el nombre y el logo (app/opengraph-image.png).
  openGraph: { siteName: "126Goals", locale: "es_AR", type: "website" },
};

// El sitio es solo oscuro: la barra del navegador del celular, del mismo color.
export const viewport: Viewport = { themeColor: "#060a17", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Siempre en modo oscuro (los colores salen de las variables de html.dark, en globals.css).
    <html lang="es" className={`dark ${body.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <LiveTicker />
        <div className="page-enter flex-1">{children}</div>
        <SiteFooter />
        <Effects />
        <AlertsWatcher />
      </body>
    </html>
  );
}
