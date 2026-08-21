/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f5f1fb',
          100: '#ebe3f7',
          200: '#d9ccef',
          300: '#c0a9e2',
          400: '#a380d2',
          500: '#8b5fc4',
          600: '#7a4ab3',
          700: '#673c95',
          800: '#54337a',
          900: '#442a63',
        },
      },
    },
  },
  plugins: [],
};
