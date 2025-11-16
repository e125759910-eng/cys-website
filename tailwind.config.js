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
        },
      },
      backgroundImage: {
        "gradient-tech": "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
      },
    },
  },
  plugins: [],
};

