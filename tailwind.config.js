// tailwind.config.js
module.exports = {
  content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx}"], // include all relevant paths
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      screens: {
        // Custom screen for mobile & tablet (below 1024px)
      },
    },
  },
  plugins: [],
};
