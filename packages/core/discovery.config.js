const defaultConfig = require('./discovery.config.default')
const starterConfig = require('./src/customizations/discovery.config')

const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, starterConfig)

module.exports = finalConfig
