/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nba: {
          blue: '#1d428a',
          red: '#c8102e',
          gold: '#ffc72c',
        }
      },
      backgroundImage: {
        'court-pattern': "url('/court-pattern.svg')",
      },
    },
  },
  plugins: [],
}
