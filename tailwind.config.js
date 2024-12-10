/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0c1618',    // Very dark cyan/black for primary elements
        mint: '#49111c',       // Deep red for hover/accent
        coral: '#49111c',      // Deep red for hover/accent
        background: '#f2f4f3', // Light gray/white background
        text: '#0c1618',       // Very dark text
        divider: '#f2e9e4',    // Light pink/white for dividers
        dark: {
          background: '#0c1618',
          text: '#f2f4f3',
          divider: '#49111c'
        }
      },
    },
  },
  plugins: [],
}
