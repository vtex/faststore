function infima(variable) {
    return `var(${variable})`
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
        code: infima('--ifm-code-background'),    
        tag: infima('--ifm-tag-background'),    
        link: infima('--ifm-link-color'),
        secondary: infima('--ifm-color-secondary'),     
        primary: infima('--ifm-color-primary'),
        softPink: infima('--ifm-color-soft-pink'),     
        text: infima('--ifm-font-color-base'),     
        details: '#A1A8B3',     
      }
    },
  },
  plugins: [],
}