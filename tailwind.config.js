/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "wicket-light": {
          primary: "#3b82f6",
          secondary: "#4f46e5",
          accent: "#0d9488",
          neutral: "#4b5563",
          "base-100": "#f3f4f6",
          info: "#0891b2",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#f43f5e",
        },
      },
      {
        "wicket-dark": {
          primary: "#3b82f6",
          secondary: "#4f46e5",
          accent: "#0d9488",
          neutral: "#4b5563",
          "base-100": "#1f2937",
          info: "#0891b2",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#f43f5e",
        },
      },
    ],
  },
};
