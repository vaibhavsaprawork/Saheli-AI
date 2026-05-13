import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: "#E8564A",
        surface: "#F2F2F2",
        ink: "#1A1A1A",
        muted: "#666666",
        navInactive: "#999999",
        stamp: "#999999",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans)",
          "system-ui",
          "sans-serif",
        ],
        /** Prefer Noto for Indic text; keeps Latin readable when UI is Hindi. */
        hindi: [
          "var(--font-noto-sans)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
