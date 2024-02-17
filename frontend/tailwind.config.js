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
        main : {
          dark: {
            1: '#2C2729',
            2: '#47302E'
          },
          light: {
            SPRUCE: '#1D1E22',
            FERN: '#3DBDA7',
            EGGSHELL: '#00453F',
            PUMPKIN: '#E86931'
          }
        }
      }
    },
    screens: {
      'lg': '1700px',
      'sm': '640px',
      'md': '768px',
      'xs': '320px'
    },
    fontFamily: {
      'poppins': ['Poppins'],
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

