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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
