const defaultConfig = require('./discovery.config.default.js')
const userConfig = require('./discovery.config.user.js')
const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, userConfig)

const {
  seo,
  accountUrl,
  analytics,
  api,
  cart,
  checkoutUrl,
  cms,
  contentSource,
  deliveryPromise,
  experimental,
  lighthouse,
  loginUrl,
  platform,
  previewRedirects,
  secureSubdomain,
  session,
  storeUrl,
  theme,
  rewrites,
} = finalConfig

module.exports = {
  seo,
  accountUrl,
  analytics,
  api,
  cart,
  checkoutUrl,
  cms,
  contentSource,
  deliveryPromise,
  experimental,
  lighthouse,
  loginUrl,
  platform,
  previewRedirects,
  secureSubdomain,
  session,
  storeUrl,
  theme,
  rewrites,
}
