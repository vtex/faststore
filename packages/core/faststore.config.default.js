module.exports = {
  seo: {
    title: 'FastStore Starter',
    description: 'Fast Demo Store',
    titleTemplate: '%s | FastStore',
    author: 'Store Framework',
  },

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'hearstqa',
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: false,
    incrementAddress: true,
  },

  // Default session
  session: {
    currency: {
      code: 'USD',
      symbol: '$',
    },
    locale: 'en-US',
    channel: '{"salesChannel":"2","regionId":""}',
    country: 'USA',
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  // Default cart
  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  storeUrl: 'https://marketplace.qa.ecmapps.net',
  secureSubdomain: 'https://secure.marketplace.qa.ecmapps.net',
  checkoutUrl: 'https://secure.marketplace.qa.ecmapps.net/checkout',
  loginUrl: 'https://secure.marketplace.qa.ecmapps.net/login',
  accountUrl: 'https://secure.marketplace.qa.ecmapps.net/api/io/account',

  // Preview redirects
  previewRedirects: {
    home: '/',
    plp: '/office',
    search: '/s?q=headphone',
    pdp: '/apple-magic-mouse/p',
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: '/fitbit-blaze-1700672404789/p',
      collection: '/fitness---nutrition',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/mens-ultra-soft-valtech-hoodie/p',
      collection: '/apparel---home',
      collection_filtered:
        '/apparel---home?category-1=apparel---home&category-2=t-shirts---merch&facets=category-1%2Ccategory-2',
      search: '/s?q=Hearst',
    },
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-PGHZ95N',
  },

  cms: {
    data: process.env.CMS_DATA,
  },

  experimental: {
    cypressVersion: 12,
    enableCypressExtension: false,
    noRobots: false,
  },
}
