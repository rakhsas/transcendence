/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    // "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main : {
          dark: {
            SIDEMESSAGE: '#969eaa',
            MSGDATE: '#c0c7d2',
            SPRUCE: '#1D1E22',
          },
          light: {
            CLOUDWISP: '#E7F6FF',
            COLDSTEEL: '#E3EDF8',
            WHITE: '#FFFFFF',
            WHITEBLUE: '#F5F6FA',
            FERN: '#3DBDA7',
            EGGSHELL: '#00453F',
            PUMPKIN: '#E86931',
          }
        },
        GREEN: '#BFFF3C',
      }
    },
    screens: {
      '2xl': '2560px',
      'xl': '1920px',
      'lg': '1700px',
      'new': '1200px',
      'md': '768px',
      'sm': '640px',
      'xs': '320px'
    },
    fontFamily: {
      'poppins': ['Poppins'],
      'onest': ['Onest'],
      'kenia': ['Kenia'],
   }
  },
  plugins: [
    require('flowbite/plugin'),
    function({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::--webkit-scrollbar" :{
          display: "none",
        },
        ".no-scrollbar" : {
          "-ms-overflow-style": "none",
          "scrollbar-with": "none",
        },
      };
      addUtilities(newUtilities)
    }
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

