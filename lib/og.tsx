import { ImageResponse } from "next/og";

// Imagen de vista previa al compartir un link (WhatsApp, redes): 1200×630, con el estilo de 126Goals: azul marino, el
// brillo azul, el 126 gigante de fondo y la marca abajo. Arriba, una etiqueta (torneo, país); en el medio, el título
// grande y, si hay, logos o escudos y un subtítulo.
export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage({ eyebrow, title, subtitle, logos = [], score }: { eyebrow?: string; title: string; subtitle?: string; logos?: (string | undefined)[]; score?: string }) {
  const [a, b] = logos;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          color: "#fff",
          background: "radial-gradient(900px 500px at 75% 0%, rgba(31,107,255,0.45), transparent 60%), linear-gradient(135deg, #050b1a 0%, #0a1834 55%, #0b2a6b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -20, bottom: -120, fontSize: 520, fontWeight: 900, fontStyle: "italic", color: "rgba(116,172,223,0.10)", letterSpacing: -20, display: "flex" }}>126</div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase", color: "#9fc2ff" }}>{eyebrow ?? "126Goals"}</div>
        {score !== undefined && a && b ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada */}
            <img src={a} width={190} height={190} style={{ objectFit: "contain" }} alt="" />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 120, fontWeight: 900, display: "flex" }}>{score}</div>
              <div style={{ fontSize: 34, color: "#cfe0ff", display: "flex", maxWidth: 640, textAlign: "center" }}>{title}</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada */}
            <img src={b} width={190} height={190} style={{ objectFit: "contain" }} alt="" />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada */}
            {a && <img src={a} width={200} height={200} style={{ objectFit: "contain", borderRadius: a.includes("headshots") ? 100 : 0 }} alt="" />}
            <div style={{ display: "flex", flexDirection: "column", maxWidth: a ? 820 : 1060 }}>
              <div style={{ fontSize: title.length > 28 ? 68 : 88, fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", lineHeight: 1, display: "flex" }}>{title}</div>
              {subtitle && <div style={{ marginTop: 18, fontSize: 34, color: "#cfe0ff", display: "flex" }}>{subtitle}</div>}
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <div style={{ display: "flex", fontWeight: 900, fontSize: 44 }}>
            126<span style={{ color: "#74acdf" }}>Goals</span>
          </div>
          <div style={{ display: "flex", color: "#9fc2ff" }}>Fútbol en vivo · estadísticas · historia</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

// Dirección completa de una imagen del sitio (las de public/), para usarla dentro de la imagen generada.
// Siempre la dirección pública: las versiones de prueba de Vercel piden iniciar sesión y la imagen no podría leerlas.
const BASE = "https://126goals.vercel.app";
export const siteUrl = (path?: string) => (path ? (path.startsWith("http") ? path : `${BASE}${path}`) : undefined);
