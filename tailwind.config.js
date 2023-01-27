/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#334EC7",
          secondary: "#C7485F",
          accent: "#C79D20",
          neutral: "#3D4451",
          "base-100": "#f3f4f6",
          info: "#06b6d4",
          success: "#22c55e",
          warning: "#facc15",
          error: "#dc2626",
        },
      },
      {
        dark: {
          primary: "#334EC7",
          secondary: "#C7485F",
          accent: "#C79D20",
          neutral: "#3D4451",
          "base-100": "#111827",
          info: "#a5f3fc",
          success: "#bef264",
          warning: "#fde047",
          error: "#f87171",
        },
      },
    ],
  },
};
