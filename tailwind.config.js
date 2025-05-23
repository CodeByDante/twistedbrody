/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        primary: '#bb86fc',
        surface: '#1e1e1e',
        'surface-light': '#2d2d2d',
      },
    },
  },
  plugins: [],
};