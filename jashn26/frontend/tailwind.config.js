export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { gold: { DEFAULT: "#d4a84b", light: "#f3d78a", deep: "#a87c2a" }, ink: "#070605" },
    fontFamily: { display: ["'Cormorant Garamond'", "serif"], sans: ["Inter", "system-ui", "sans-serif"] },
  } },
  plugins: [],
};
