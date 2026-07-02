import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-primary": "#0A0A0B",
        "bg-secondary": "#141416",
        "bg-tertiary": "#1C1C1F",
        // Accents
        "accent-red": "#F26B1F",
        "accent-red-dark": "#B8430E",
        "accent-red-glow": "rgba(242, 107, 31, 0.15)",
        "accent-orange": "#FF8C42",
        "accent-orange-dark": "#CC5414",
        "accent-blue": "#2D7DD2",
        "accent-blue-dark": "#1A5A9E",
        "accent-green": "#34D399",
        "accent-green-dark": "#10B981",
        // Text
        "text-primary": "#F5F5F7",
        "text-secondary": "#9B9BA0",
        "text-muted": "#5C5C63",
        // Borders
        "border-default": "#2A2A2E",
        "border-active": "#F26B1F",
        // Code-name badges
        "badge-crimson": "#DC2626",
        "badge-cobalt": "#2563EB",
        "badge-sanguine": "#B91C1C",
        "badge-genesis": "#059669",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "Oswald", "sans-serif"],
        body: ["var(--font-body)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "4px",
        lg: "6px",
      },
      boxShadow: {
        "glow-red": "0 0 20px rgba(242, 107, 31, 0.15)",
        "glow-red-strong": "0 0 15px rgba(242, 107, 31, 0.3)",
        "glow-green": "0 0 12px rgba(52, 211, 153, 0.2)",
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(242, 107, 31, 0.7)" },
          "50%": { boxShadow: "0 0 0 12px rgba(242, 107, 31, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-red": "pulse-red 2s infinite",
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;