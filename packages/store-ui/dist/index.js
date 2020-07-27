
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./store-ui.cjs.production.min.js')
} else {
  module.exports = require('./store-ui.cjs.development.js')
}
