/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0a84ff",
          dark: "#0a0a0a",
          light: "#d1d5db",
          silver: "#e5e7eb",       // 明亮銀
          steel: "#9ca3af",        // 鋼灰
          titanium: "#cbd5e1",     // 鈦銀藍
          ice: "#a5f3fc",          // 冰藍高光
        },
      },
      backgroundImage: {
        "gradient-tech": "linear-gradient(135deg, #0a0a0a, #141414 40%, #1b1b1b)",
        "sheen-silver": "linear-gradient(120deg, rgba(229,231,235,0.10), rgba(156,163,175,0.05) 35%, rgba(255,255,255,0.04) 50%, rgba(156,163,175,0.05) 65%, rgba(229,231,235,0.10))",
      },
      boxShadow: {
        "silver-glow": "0 0 0 1px rgba(229,231,235,0.35), 0 8px 30px rgba(148,163,184,0.15)",
      }
    },
  },
  plugins: [],
};

