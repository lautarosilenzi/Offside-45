import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  // Los efectos de "pasar el mouse" solo en pantallas con mouse: en el celular, un toque entra directo (sin el primer
  // toque que en el iPhone solo activa el efecto).
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // Blanco, azul marino y azul de la marca salen de variables (app/globals.css): el modo oscuro las cambia.
        white: "rgb(var(--white) / <alpha-value>)",
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
        },
        // Azul marino de la identidad: encabezado, marcadores y bloques destacados.
        navy: {
          50: "rgb(var(--navy-50) / <alpha-value>)",
          100: "rgb(var(--navy-100) / <alpha-value>)",
          200: "rgb(var(--navy-200) / <alpha-value>)",
          300: "rgb(var(--navy-300) / <alpha-value>)",
          400: "rgb(var(--navy-400) / <alpha-value>)",
          500: "rgb(var(--navy-500) / <alpha-value>)",
          600: "rgb(var(--navy-600) / <alpha-value>)",
          700: "rgb(var(--navy-700) / <alpha-value>)",
          800: "rgb(var(--navy-800) / <alpha-value>)",
          900: "rgb(var(--navy-900) / <alpha-value>)",
          950: "rgb(var(--navy-950) / <alpha-value>)",
        },
        // Azul eléctrico del logo: acentos, línea del offside y botones principales.
        volt: {
          300: "#7fb0ff",
          400: "#4d8dff",
          500: "#1f6bff",
          600: "#0f55e0",
          700: "#0b42b0",
        },
        gold: {
          400: "#d9b45a",
          500: "#c89b3c",
        },
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease both",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
