/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0A0F",
          900: "#101018",
          850: "#14141C",
          800: "#1C1C26",
          700: "#262631",
          600: "#3A3A47",
        },
        mist: {
          50: "#F4F4F6",
          200: "#C7C7D1",
          400: "#9797A8",
          500: "#7A7A8C",
        },
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        gold: {
          400: "#F5C451",
          500: "#F0B429",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.15), 0 8px 30px rgba(139,92,246,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
