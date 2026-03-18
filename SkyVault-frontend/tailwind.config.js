/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f8f8',
          100: '#f1f1f1',
          200: '#e1e1e1',
          600: '#222222', // Deep monotone primary
          700: '#000000',
        }
      }
    },
  },
  plugins: [],
}