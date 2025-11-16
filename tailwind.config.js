/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0a84ff",
          dark: "#001f3f",
          light: "#a0cfff",
        },
      },
      backgroundImage: {
        "gradient-tech": "linear-gradient(135deg, #001f3f, #0a84ff)",
      },
    },
  },
  plugins: [],
};

