/**
 * Example local overrides for B2B contract switcher development.
 *
 * Copy to discovery.config.local.js (gitignored) before running locally.
 * Run from `packages/core`:
 *
 *   cp discovery.config.local.example.js discovery.config.local.js
 *
 * Or from the repo root:
 *
 *   cp packages/core/discovery.config.local.example.js packages/core/discovery.config.local.js
 */
module.exports = {
  plugins: ['@vtex/faststore-plugin-buyer-portal'],

  api: {
    storeId: 'b2bfaststoredev',
    hideUnavailableItems: true,
  },

  storeUrl: 'https://b2bfaststore.vtexfaststore.com',
  secureSubdomain: 'https://b2bfaststore.vtexfaststore.com',
  checkoutUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/checkout/cart'
      : 'https://b2bfaststore.vtexfaststore.com/checkout',
  loginUrl: 'https://b2bfaststore.vtexfaststore.com/api/io/login',
  accountUrl: 'https://b2bfaststore.vtexfaststore.com/api/io/account',

  experimental: {
    enableFaststoreMyAccount: true,
    refreshToken: true,
  },

  vtexHeadlessCms: {
    webhookUrls: [
      'https://b2bfaststoredev.myvtex.com/cms-releases/webhook-releases',
    ],
  },
}

// Dev-only: proxy VTEX Identity routes (WebOps handles this in production).
const { storeId } = module.exports.api

module.exports.rewrites = async () => {
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
