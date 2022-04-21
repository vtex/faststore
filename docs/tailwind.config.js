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
      background: infima('--ifm-background-color'),
      code: infima('--ifm-code-background'),    
      tag: infima('--ifm-tag-background'),    
      link: infima('--ifm-link-color'),
      secondary: infima('--ifm-color-secondary'),     
      primary: infima('--ifm-color-primary'),
      softPink: infima('--ifm-color-soft-pink'),     
      text: infima('--ifm-font-color-base'),     
      details: '#86868b',     
    }
  },
},
plugins: [],
}