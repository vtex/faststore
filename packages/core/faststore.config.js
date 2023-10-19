const defaultConfig = require('./faststore.config.default')
const starterConfig = require('./src/customizations/faststore.config.js')

const deepmerge = require('deepmerge')

const finalConfig = deepmerge(defaultConfig, starterConfig)

module.exports = finalConfig
