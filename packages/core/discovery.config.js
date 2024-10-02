const defaultConfig = require('./discovery.config.default')
const deepmerge = require('deepmerge')

let starterConfig

try {
  starterConfig = require('./src/customizations/discovery.config')
} catch (e) {
  try {
    starterConfig = require('./src/customizations/faststore.config')
  } catch (e) {
    console.error(
      "Failed to load './src/customizations/faststore.config'. Please ensure the file exists."
    )
    throw e // Re-throw the error after logging
  }
}

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, starterConfig)

module.exports = finalConfig
