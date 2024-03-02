/** @type {import('tailwindcss').Config} */

const { plugin } = require('twrnc');

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './CapThat/components/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        clash_bold: ['clash-display-bold', 'sans-serif'],
        clash_semi_bold: ['clash-grotesk-semibold', 'sans-serif'],
        clash_medium: ['clash-grotesk-medium', 'sans-serif'],
        clash_regular: ['clash-grotesk-regular', 'sans-serif'],
      },
      colors: {
        background: '#1F2128',
        primary: '#7737FF',
        warning: '#FFAC30',
        success: '#34D357',
        'modal-background': '#4A445EB2',
        'text-default': '#6F83E9',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        'ft-global': {
          fontFamily: 'clash-grotesk-regular',
          color: 'white',
          fontSize: 14,
        },
        'ft-global-inactive': {
          fontFamily: 'clash-grotesk-regular',
          color: '#828796',
          fontSize: 14,
        },
      });
    }),
  ],
};
