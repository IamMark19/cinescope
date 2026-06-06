/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        condensed: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Barlow'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },
      colors: {
        red: { DEFAULT: "#E8212A", dark: "#b81920" },
        gold: "#d4a853",
        dark: {
          DEFAULT: "#141414",
          2: "#1e1e1e",
          3: "#2a2a2a",
          4: "#333333",
        },
        cs: {
          black: "#0a0a0a",
          white: "#f5f5f5",
          cream: "#f0ede8",
        },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite",
        "pulse-dot": "pulse-dot 2s infinite",
        "fade-in": "fade-in 0.3s ease",
        "slide-up": "slide-up 0.4s ease",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
