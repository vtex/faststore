const defaultConfig = require('./discovery.config.default')
const starterConfig = require('./src/customizations/discovery.config')

const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
let finalConfig = deepmerge(defaultConfig, starterConfig)

try {
  finalConfig = deepmerge(finalConfig, require('./discovery.config.local'))
} catch (error) {
  if (error?.code !== 'MODULE_NOT_FOUND') {
    throw error
  }
  // Optional local overrides (packages/core/discovery.config.local.js).
}

module.exports = finalConfig
