const postcss = require('postcss')
const postcssScss = require('postcss-scss')
const fs = require('fs')

const plugin = require('.')

postcss([plugin()])
  .process(fs.readFileSync('../styles/themes/soft-blue.scss', 'utf8'), {
    from: '../styles/themes/soft-blue.scss',
    to: './theme.checkout.scss',
    parser: postcssScss.parse,
    stringifier: postcssScss.stringify,
  })
  .then((result) => {
    fs.writeFileSync('./theme.checkout.scss', result.css)
  })
