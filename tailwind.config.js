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
          gold: "#FFD700",          // 純金色
          goldLight: "#FFE44D",     // 亮金色
          goldDark: "#FFA500",      // 深金色/琥珀
          amber: "#FFC107",         // 琥珀色
          black: "#000000",         // 純黑
          blackLight: "#1a1a1a",    // 淺黑
        },
      },
      backgroundImage: {
        "gradient-tech": "linear-gradient(135deg, #000000, #0a0a0a 40%, #1a1a1a)",
        "gradient-gold": "linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)",
        "sheen-gold": "linear-gradient(120deg, rgba(255,215,0,0.15), rgba(255,200,0,0.10) 35%, rgba(255,180,0,0.08) 50%, rgba(255,200,0,0.10) 65%, rgba(255,215,0,0.15))",
      },
      boxShadow: {
        "gold-glow": "0 0 0 1px rgba(255,215,0,0.3), 0 8px 30px rgba(255,215,0,0.15), 0 0 40px rgba(255,200,0,0.1)",
        "gold-glow-strong": "0 0 0 1px rgba(255,215,0,0.5), 0 12px 40px rgba(255,215,0,0.25), 0 0 60px rgba(255,200,0,0.15)",
      }
    },
  },
  plugins: [],
};

