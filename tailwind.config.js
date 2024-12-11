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
        primary: '#2b4162',    // Deep blue for primary elements
        mint: '#ff8811',       // Bright orange for primary accent
        coral: '#f4d06f',      // Muted yellow for secondary accent
        background: '#fff8f0', // Light cream background
        text: '#2b4162',       // Deep blue text
        divider: '#f4d06f',    // Muted yellow for dividers
        dark: {
          background: '#1a2838', // Darker variation of primary blue
          text: '#fff8f0',      // Light cream text for dark mode
          divider: '#f4d06f'    // Keeping muted yellow for dividers
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
