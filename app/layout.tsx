import { existsSync } from "fs";
import type { Metadata } from "next";
import { join } from "path";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Effects from "@/components/Effects";
import LiveTicker from "@/components/live/LiveTicker";
import AlertsWatcher from "@/components/match/AlertsWatcher";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], style: ["normal", "italic"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Offside 45 · Historia del fútbol argentino",
  description: "Historial de partidos, estadísticas y temporadas del fútbol argentino desde 1891.",
};

// Logo de Offside 45: public/logo-circulo.png (el redondo, para el encabezado). Si todavía no está, se ve el "45".
const LOGO = existsSync(join(process.cwd(), "public", "logo-circulo.png")) ? "/logo-circulo.png" : undefined;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
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
