const Color = require('color')

const COLORS = {
  REBELPINK: '#F71963',
  SOFTPINK: '#FFF3F6',
  WHITEICE: '#F8F7FC',
  SERIOUSBLACK: '#142032',
  YOGURTPINK: '#FFE0EF',
  TEXT: '#4A4A4A'
}

function generateColors(color) {
  return {
    light: Color(color).lighten(0.2).hex(),
    DEFAULT: color,
    dark: Color(color).darken(0.2).hex(),
  }
}



module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rebelPink: generateColors(COLORS.REBELPINK),
        softPink: generateColors(COLORS.SOFTPINK),     
        whiteIce: generateColors(COLORS.WHITEICE),     
        seriousBlack: generateColors(COLORS.SERIOUSBLACK),     
        yogurtPink: generateColors(COLORS.YOGURTPINK),     
        text: generateColors(COLORS.TEXT),     
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}