/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        garnet: {
          50:  "#fdf2f2",
          100: "#fce4e4",
          200: "#f9cccc",
          300: "#f4a4a4",
          400: "#ec6d6d",
          500: "#df4444",
          600: "#c0392b",
          700: "#8B1A1A",
          800: "#721515",
          900: "#5c1010",
          950: "#3d0a0a",
        },
        forest: {
          50:  "#f0faf4",
          100: "#dcf4e6",
          200: "#bce8ce",
          300: "#8dd4ad",
          400: "#57b886",
          500: "#339966",
          600: "#2D6A4F",
          700: "#1A3A2A",
          800: "#162f22",
          900: "#12251b",
          950: "#0a1610",
        },
        dust: {
          50:  "#fdfaf6",
          100: "#f8f0e3",
          200: "#f0dfc4",
          300: "#E8D5B7",
          400: "#d4b896",
          500: "#C4A882",
          600: "#a8865e",
          700: "#8a6a44",
          800: "#6e5234",
          900: "#523d27",
          950: "#2e2014",
        },
        ink: {
          400: "#4a3a2e",
          500: "#3a2d22",
          600: "#2e231a",
          700: "#251c15",
          800: "#1c1510",
          900: "#141009",
          950: "#0e0a08",
        }
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(192,57,43,0.3)",
        card: "0 2px 12px rgba(0,0,0,0.5)",
        modal: "0 8px 48px rgba(0,0,0,0.7)",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        spin: {
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "fade-in": "fadeIn 0.15s ease forwards",
        shimmer: "shimmer 1.5s infinite",
        spin: "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
}