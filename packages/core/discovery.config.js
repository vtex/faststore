const defaultConfig = require('./discovery.config.default')
const starterConfig = require('./src/customizations/discovery.config')

const deepmerge = require('deepmerge')

/**
 * @type {typeof defaultConfig & Record<string, any>}
 * */
let finalConfig = deepmerge(defaultConfig, starterConfig)

try {
  finalConfig = deepmerge(finalConfig, require('./discovery.config.local'))
} catch {
  // Optional local overrides (packages/core/discovery.config.local.js).
}

const { storeId } = finalConfig.api

finalConfig.rewrites = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return { beforeFiles: [] }
  }

  return {
    beforeFiles: [
      {
        source: '/api/authenticator/:path*',
        destination: `https://${storeId}.myvtex.com/api/authenticator/:path*`,
      },
      {
        source: '/api/vtexid/:path*',
        destination: `https://${storeId}.myvtex.com/api/vtexid/:path*`,
      },
    ],
  }
}

module.exports = finalConfig
