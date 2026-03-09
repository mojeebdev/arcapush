import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        
        brand: {
          DEFAULT: "#4E24CF",
          light:   "#6B3FE0",
          dark:    "#3A1A9E",
          glow:    "rgba(78, 36, 207, 0.15)",
          subtle:  "rgba(78, 36, 207, 0.08)",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light:   "#E2C55A",
          dark:    "#A88A1E",
          glow:    "rgba(212, 175, 55, 0.15)",
          subtle:  "rgba(212, 175, 55, 0.08)",
        },
        
        canvas: {
          DEFAULT: "#F5F0E8",   
          card:    "#EDEADF",   
          surface: "#E8E3D8",  
          inset:   "#E0DBD0",   
        },
        
        surface: {
          DEFAULT: "#09090b",
          50:  "#0c0c0f",
          100: "#111114",
          200: "#18181b",
          300: "#1f1f23",
          400: "#27272a",
        },
      },

      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
        serif:   ["Playfair Display", "Georgia", "serif"],
      },

      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":        "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(78,36,207,0.12), transparent)",
        "hero-glow-gold":   "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(212,175,55,0.10), transparent)",
        "card-shine":       "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
        "brand-gradient":   "linear-gradient(135deg, #4E24CF 0%, #D4AF37 100%)",
      },

      boxShadow: {
        "brand":    "0 0 40px rgba(78, 36, 207, 0.18)",
        "brand-sm": "0 0 16px rgba(78, 36, 207, 0.14)",
        "gold":     "0 0 40px rgba(212, 175, 55, 0.16)",
        "gold-sm":  "0 0 16px rgba(212, 175, 55, 0.12)",
        "card":     "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "card-lg":  "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },

  plugins: [],
};

export default config;