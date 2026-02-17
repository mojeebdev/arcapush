import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#09090b", 50: "#0c0c0f", 100: "#111114", 200: "#18181b", 300: "#1f1f23", 400: "#27272a" },
        accent: { DEFAULT: "#a78bfa", light: "#c4b5fd", dark: "#7c3aed", glow: "rgba(167, 139, 250, 0.15)" },
        gold: { DEFAULT: "#f59e0b", light: "#fbbf24", glow: "rgba(245, 158, 11, 0.2)" },
        emerald: { DEFAULT: "#10b981", glow: "rgba(16, 185, 129, 0.15)" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;