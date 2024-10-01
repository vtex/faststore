const fs = require('fs')
const path = require('path')
const deepmerge = require('deepmerge')

const defaultConfig = require('./discovery.config.default')

const starterLegacyConfigPath = path.resolve(
  __dirname,
  './src/customizations/faststore.config'
)
const starterConfigPath = path.resolve(
  __dirname,
  './src/customizations/discovery.config'
)

const starterLegacyConfig = fs.existsSync(starterLegacyConfigPath)
  ? require(starterLegacyConfigPath)
  : {}
const starterConfig = fs.existsSync(starterConfigPath)
  ? require(starterConfigPath)
  : {}

// TODO: Remove starterLegacyConfig in the future when migration to starterConfig is complete
/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge.all([
  defaultConfig,
  starterLegacyConfig,
  starterConfig,
])

module.exports = finalConfig
