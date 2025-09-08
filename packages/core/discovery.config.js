import defaultConfig from './discovery.config.default.js'
import userConfig from './discovery.config.user.js'
import deepmerge from 'deepmerge'

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
const finalConfig = deepmerge(defaultConfig, userConfig)

export default finalConfig

export const {
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
} = finalConfig
