/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slateLite: "#f8fafc",
        accent: "#2563eb"
      },
      borderRadius: {
        xl2: "1rem"
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
}
