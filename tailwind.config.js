/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'winter',
      {
        mytheme: {
          primary: '#0ea5e9',
          secondary: '#6366f1',
          accent: '#fde047',
          neutral: '#a8a29e',
          'base-100': '#111827',
          info: '#22d3ee',
          success: '#4ade80',
          warning: '#fdba74',
          error: '#f87171',
        },
      },
    ],
  },
};
