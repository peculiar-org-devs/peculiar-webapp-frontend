/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        royalpurple: '#3A2256',
        champagne: '#F7E6CA',
        white: '#FFFFFF',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
