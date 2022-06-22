module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js, jsx, ts, tsx}"
  ],

  theme: {
    extend: {
      fontFamily: {
        nunitoSans: ["nunito-sans", "sans-serif"],
        nunitoSansBlack: ["nunito-sans__black", "sans-serif"],
        nunitoSansBold: ["nunito-sans__bold", "sans-serif"],
        nunitoSansExtraBold: ["nunito-sans__extrabold", "sans-serif"],
      },
    },
  },

  plugins: [
    require('tailwindcss-textshadow'),
    
    require('flowbite/plugin'),
    
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}