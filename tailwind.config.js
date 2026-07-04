/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        'glass': '20px',
      },
      colors: {
        'roots-green': '#2D5A27',
        'roots-gold': '#C8963E',
        'roots-cream': '#F5F0E8',
      }
    },
  },
  plugins: [],
}