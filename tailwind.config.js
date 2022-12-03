// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './classes/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },

      height: {
        124: '31rem',
      },

      width: {
        92: '23rem',
      },

      gridTemplateColumns: {
        field: 'repeat(5, 4rem)',
      },

      gridTemplateRows: {
        column: 'repeat(7, 4rem)',
      },
    },
  },
  plugins: [],
}
