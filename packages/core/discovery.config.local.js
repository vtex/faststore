/**
 * Local overrides for B2B contract switcher development (b2bfaststoredev).
 * Merged by discovery.config.js — safe to customize per developer/account.
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
