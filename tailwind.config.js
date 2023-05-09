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
        dark: {
          primary: "#334EC7",
          secondary: "#C7485F",
          accent: "#C79D20",
          neutral: "#3D4451",
          "base-100": "#101019",
          info: "#a5f3fc",
          success: "#bef264",
          warning: "#fde047",
          error: "#f87171",
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "300ms",
          "--animation-input": "200ms",
          "--btn-text-case": "normal-case",
          "--navbar-padding": "0.5rem",
          "--border-btn": "1px",
        },
      },
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
          "--rounded-box": "1rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "300ms",
          "--animation-input": "200ms",
          "--btn-text-case": "normal-case",
          "--navbar-padding": "0.5rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
