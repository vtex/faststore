module.exports = {
  seo: {
    title: 'FastStore Starter',
    description: 'Fast Demo Store',
    titleTemplate: '%s | FastStore',
    author: 'Store Framework',
    name: 'FastStore',
    publisherId: '',
    plp: {
      titleTemplate: '%s | FastStore PLP',
      descriptionTemplate: '%s products on FastStore Product Listing Page',
    },
    pdp: {
      titleTemplate: '%s | FastStore PDP',
      descriptionTemplate: '%s products on FastStore Product Detail Page',
    },
    search: {
      titleTemplate: '%s: Search results title',
      descriptionTemplate: '%s: Search results description',
      noIndex: true,
      noFollow: true,
      bodyH1: 'Showing results for:',
    },
  },

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'storeframework',
    workspace: 'master',
    subDomainPrefix: ['www'],
    environment: 'vtexcommercestable',
    hideUnavailableItems: false,
    showSponsored: false,
    incrementAddress: true,
  },

  // Default session
  session: {
    currency: {
      code: 'USD',
      symbol: '$',
    },
    locale: 'en-US',
    channel:
      '{"salesChannel":"1","regionId":"","hasOnlyDefaultSalesChannel":"true"}',
    country: 'USA',
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    b2b: null,
    person: null,
    marketingData: {
      utmCampaign: '',
      utmMedium: '',
      utmSource: '',
      utmiCampaign: '',
      utmiPart: '',
      utmiPage: '',
    },
  },

  // Default cart
  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  // secureSubdomain is the same as storeUrl because we are using single domain approach for this account
  storeUrl: 'https://homebrewqa.fast.store',
  secureSubdomain: 'https://homebrewqa.fast.store',
  checkoutUrl: 'https://homebrewqa.fast.store/checkout',
  loginUrl: 'https://homebrewqa.fast.store/api/io/login',
  accountUrl: 'https://homebrewqa.fast.store/api/io/account',

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
      pdp: '/4k-philips-monitor-99988213/p',
      collection: '/office',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/4k-philips-monitor-99988213/p',
      collection: '/office',
      collection_2: '/technology',
      collection_filtered:
        '/office/?category-1=office&marca=acer&facets=category-1%2Cmarca',
      search: '/s?q=orange',
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
    noindex: false,
    nofollow: false,
    preact: false,
    enableRedirects: false,
    enableSearchSSR: false,
    enableFaststoreMyAccount: false,
    enableVtexAssetsLoader: false,
    graphqlCacheControl: {
      maxAge: 0, // 0 disables cache, 5 * 60 enable cache control maxAge 5 minutes
      staleWhileRevalidate: 60,
    },
  },
}
