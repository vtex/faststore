const defaultConfig = require('./discovery.config.default')
const deepmerge = require('deepmerge')

let starterConfig

try {
  starterConfig = require('./src/customizations/discovery.config')
} catch (e) {
  starterConfig = require('./src/customizations/faststore.config')
}

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, starterConfig)

module.exports = finalConfig
