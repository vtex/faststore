const defaultConfig = require('./discovery.config.default')
const starterConfig = require('./src/customizations/discovery.config')

const { mergeDiscoveryConfig } = require('./src/utils/mergeDiscoveryConfig')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = mergeDiscoveryConfig(defaultConfig, starterConfig)

module.exports = finalConfig
