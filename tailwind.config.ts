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
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
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
