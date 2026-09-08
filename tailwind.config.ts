import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neo: {
          coral: "#ff6b6b",
          coralLight: "#ff8787",
          coralBg: "#ffe3e3",
          yellow: "#fcd34d",
          yellowLight: "#fef08a",
          yellowBg: "#fffbeb",
          purple: "#c084fc",
          purpleLight: "#ddd6fe",
          purpleBg: "#f5f3ff",
          mint: "#6ee7b7",
          mintLight: "#a7f3d0",
          mintBg: "#ecfdf5",
          blue: "#38bdf8",
          blueLight: "#7dd3fc",
          blueBg: "#f0f9ff",
          card: "#ffffff",
          cardDark: "#131826",
          darkBg: "#0b0f19",
          slate: "#1e293b",
        },
        brand: {
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
          950: "var(--brand-950)",
        },
      },
      boxShadow: {
        neo: "3px 3px 0px rgba(0, 0, 0, 0.95)",
        "neo-sm": "2px 2px 0px rgba(0, 0, 0, 0.95)",
        "neo-lg": "4px 4px 0px rgba(0, 0, 0, 0.95)",
        "neo-hover": "5px 5px 0px rgba(0, 0, 0, 0.95)",
        "neo-dark": "3px 3px 0px rgba(255, 255, 255, 0.2)",
        "neo-dark-sm": "2px 2px 0px rgba(255, 255, 255, 0.2)",
      },
      borderWidth: {
        "1.5": "1.5px",
        "2": "2px",
      },
    },
  },
  plugins: [],
};

export default config;
