module.exports = {
  seo: {
    title: 'FastStore',
    description: 'A fast and performant store framework',
    titleTemplate: '%s | FastStore',
    author: 'FastStore',
  },

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'newstore',
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: 'BRL',
      symbol: 'R$',
    },
    locale: 'pt-BR',
    channel: '{"salesChannel":"1","regionId":""}',
    country: 'BRA',
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  storeUrl: 'https://www.fast.store',
  secureSubdomain: 'https://www.fast.store/',
  checkoutUrl: 'https://www.fast.store/checkout',
  loginUrl: 'https://www.fast.store/api/io/login',
  accountUrl: 'https://www.fast.store/api/io/account',

  previewRedirects: {
    home: '/',
    plp: '/headphones',
    search: '/s?q=Newstore',
    pdp: '/headphone-white-10000006/p',
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: '/headphone-white-10000006/p',
      collection: '/headphones',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/headphone-white-10000006/p',
      collection: '/headphones',
      collection_filtered:
        '/headphones?category-1=headphones&fuzzy=0&operator=and&facets=category-1%2Cfuzzy%2Coperator&sort=score_desc&page=0',
      search: '/s?q=Newstore',
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-1234567',
  },

  experimental: {
    nodeVersion: 18,
    cypressVersion: 12,
  },

  vtexHeadlessCms: {
    webhookUrls: ['https://newstore.myvtex.com/cms-releases/webhook-releases'],
  },
}
