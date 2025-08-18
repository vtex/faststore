const defaultConfig = require('./discovery.config.default.js')
const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
let finalConfig = deepmerge({}, defaultConfig)

finalConfig.extendsConfig = function (config) {
  finalConfig = deepmerge(finalConfig, config)

  return finalConfig
}


module.exports = finalConfig
