/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    // "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        main: {
          1: '#2C2729',
          2: '#47302E'
        },
        Pandora: "#b61282",
        Freax: "#f5bc39",
        Commodore: "#235a16",
        Bios: "#02cdd1"
      }
    },
    screens: {
      'lg': '1700px',
      'sm': '640px',
      'md': '768px',
      'xs': '320px'
    },
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

