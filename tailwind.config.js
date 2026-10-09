/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7FA',
          100: '#FCE7F0',
          200: '#F8C2D8',
          300: '#F4A6C1',
          400: '#EE88AF',
          500: '#E879A9',
          600: '#C95388',
          700: '#342536',
        }
      }
    },
  },
  plugins: [],
}