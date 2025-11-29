/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#F6F1EB',
        gold: '#B5894C',
        deep: '#1F3B5B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
