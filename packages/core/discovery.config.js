const defaultConfig = require('./discovery.config.default.js')
const userConfig = require('./discovery.config.user.js')
const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
module.exports = deepmerge(defaultConfig, userConfig)
