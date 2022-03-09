const Color = require('color')

const COLORS = {
  REBELPINK: '#F71963',
  SOFTPINK: '#FFF3F6',
  WHITEICE: '#F8F7FC',
  SERIOUSBLACK: '#142032',
  YOGURTPINK: '#FFE0EF',
  TEXT: '#4A4A4A',
  DETAILS: '#A1A8B3'
}

function generateColors(color) {
  return {
    light: Color(color).lighten(0.2).hex(),
    DEFAULT: color,
    dark: Color(color).darken(0.2).hex(),
  }
}

module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        VTEXTrust: ['VTEX Trust', 'sans-serif'],
        VTEXRegular: ['VTEX Trust Regular', 'sans-serif'],
        VTEXMedium: ['VTEX Trust Medium', 'sans-serif']
      },
      colors: {
        rebelPink: generateColors(COLORS.REBELPINK),
        softPink: generateColors(COLORS.SOFTPINK),     
        whiteIce: generateColors(COLORS.WHITEICE),     
        seriousBlack: generateColors(COLORS.SERIOUSBLACK),     
        yogurtPink: generateColors(COLORS.YOGURTPINK),     
        text: generateColors(COLORS.TEXT),     
        details: generateColors(COLORS.DETAILS),     
      }
    },
  },
  plugins: [],
}