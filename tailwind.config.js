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
      // {
      //   stability: {
      //     primary: "#0077B6",
      //     secondary: "#AF12B5",
      //     accent: "#B56E12",
      //     neutral: "#127CB5",
      //     "base-100": "#3A3A3A",
      //     info: "#0d9488",
      //     success: "#65a30d",
      //     warning: "#a16207",
      //     error: "#b91c1c",
      //   },
      // },
      // {
      //   success: {
      //     primary: "#0077B6",
      //     secondary: "#AF12B5",
      //     accent: "#B56E12",
      //     neutral: "#127CB5",
      //     "base-100": "#f3f4f6",
      //     info: "#2dd4bf",
      //     success: "#a3e635",
      //     warning: "#fcd34d",
      //     error: "#f87171",
      //   },
      // },
      {
        light: {
          primary: "#005ac1",
          secondary: "#535e78",
          accent: "#76517b",
          neutral: "#e1e2ec",
          "base-100": "#fefbff",
          info: "#1ABA92",
          success: "#1ABA37",
          warning: "#BA8A1A",
          error: "#ba1a1a",
        },
      },
      {
        dark: {
          primary: "#adc6ff",
          secondary: "#bbc6e4",
          accent: "#e5b8e8",
          neutral: "#44474f",
          "base-100": "#1b1b1f",
          info: "#ABF4FF",
          success: "#ABFFB3",
          warning: "#EEFFAB",
          error: "#ffb4ab",
        },
      },
    ],
  },
};
