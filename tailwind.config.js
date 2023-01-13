/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        stability: {
          primary: "#0077B6",
          secondary: "#AF12B5",
          accent: "#B56E12",
          neutral: "#127CB5",
          "base-100": "#3A3A3A",
          info: "#0d9488",
          success: "#65a30d",
          warning: "#a16207",
          error: "#b91c1c",
        },
      },
      {
        success: {
          primary: "#0077B6",
          secondary: "#AF12B5",
          accent: "#B56E12",
          neutral: "#127CB5",
          "base-100": "#f3f4f6",
          info: "#2dd4bf",
          success: "#a3e635",
          warning: "#fcd34d",
          error: "#f87171",
        },
      },
    ],
  },
};
