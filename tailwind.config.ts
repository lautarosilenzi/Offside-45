import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4fc",
          100: "#d6e4f7",
          200: "#adc8ef",
          300: "#7aa4e2",
          400: "#3f76cc",
          500: "#0047AB",
          600: "#003d93",
          700: "#00327a",
          800: "#00275f",
          900: "#001b43",
        },
        // Azul marino de la identidad: encabezado, marcadores y bloques destacados.
        navy: {
          50: "#f1f4f9",
          100: "#e1e7f0",
          200: "#c3cedf",
          300: "#94a6c3",
          400: "#6079a0",
          500: "#3d5580",
          600: "#2a4068",
          700: "#1c2f52",
          800: "#13223f",
          900: "#0c1830",
          950: "#070f20",
        },
        gold: {
          400: "#d9b45a",
          500: "#c89b3c",
        },
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
