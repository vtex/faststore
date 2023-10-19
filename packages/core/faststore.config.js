const defaultConfig = require('./faststore.config.default')
const starterConfig = require('./src/customizations/faststore.config')

const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, starterConfig)

module.exports = finalConfig
