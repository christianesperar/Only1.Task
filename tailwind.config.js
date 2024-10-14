/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-react-aria-components')
  ]
}

