const defaultConfig = require('./discovery.config.default')
const deepmerge = require('deepmerge')

let starterConfig

try {
  console.log("Attempting to load './src/customizations/discovery.config'")
  starterConfig = require('./src/customizations/discovery.config')
} catch (e) {
  console.log(
    "Failed to load './src/customizations/discovery.config', attempting to load './src/customizations/faststore.config'"
  )
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
