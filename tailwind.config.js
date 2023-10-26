/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./views/**/*.{html,js,ejs}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      'sea-blue': '#00A9FF',
      'reid-peach': '#FE5068',
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
