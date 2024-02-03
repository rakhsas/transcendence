/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    // "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
    screens: {
      'lg': '1700px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    }
  },
  plugins: [
    require('flowbite/plugin'),
    // function({ addUtilities }) {
    //   const newUtilities = {
    //     '.border-gradient': {
    //       'border-image': 'linear-gradient(to bottom, #5C93A7, #E15253)',
    //       'border-image-slice': 1
    //     },
    //   }
    //   addUtilities(newUtilities)
    // }
  ],
}

