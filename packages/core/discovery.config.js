const defaultConfig = require('./discovery.config.default')
const starterConfig = require('./src/customizations/discovery.config')

const { mergeDiscoveryConfig } = require('./src/utils/mergeDiscoveryConfig')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
let finalConfig = mergeDiscoveryConfig(defaultConfig, starterConfig)

try {
  finalConfig = mergeDiscoveryConfig(
    finalConfig,
    require('./discovery.config.local')
  )
} catch (error) {
  if (error?.code !== 'MODULE_NOT_FOUND') {
    throw error
  }
  // Optional local overrides (packages/core/discovery.config.local.js).
}

module.exports = finalConfig
