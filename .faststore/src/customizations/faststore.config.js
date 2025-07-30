const dotenv = require('dotenv')
dotenv.config({ path: 'dev.env' })

const vtex_account = process.env.VTEX_ACCOUNT || `odpdev`

module.exports = {
  seo: {
    title: 'FastStore Starter',
    description: 'Fast Demo Store',
    titleTemplate: '%s | FastStore',
    author: 'FastStore',
  },
  theme: 'custom-theme',
  platform: 'vtex',
  api: {
    storeId: vtex_account,
    workspace: 'odpp617',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
    globalSeller: '1',
  },
  session: {
    currency: {
      code: 'USD',
      symbol: '$',
    },
    locale: 'en-US',
    channel: '{"salesChannel":"1","regionId":""}',
    country: 'USA',
    deliveryMode: null,
    addressType: null,
    postalCode: '33496',
    geoCoordinates: null,
    person: null,
  },
  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },
  storeUrl: 'https://www.mytestdomain2.com',
  secureSubdomain: 'https://secure.mytestdomain2.com',
  checkoutUrl: 'https://secure.mytestdomain2.com/checkout',
  loginUrl: 'https://secure.mytestdomain2.com/api/io/login',
  accountUrl: 'https://secure.mytestdomain2.com/api/io/account',
  previewRedirects: {
    home: '/',
    plp: '/apparel',
    search: '/s?q=Brand',
    pdp: '/avery®-file-folder-labels-on-4-x-6-sheet-with-easy-peel--5204--rectangle--2-3-x-3-7-16--white-with-purple-color-bar--pack-of-252-labels-112375/p',
  },
  lighthouse: {
    server: 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: '/4k-philips-monitor-99988213/p',
      collection: '/office',
    },
  },
  cypress: {
    pages: {
      home: '/',
      pdp: '/4k-philips-monitor-99988213/p',
      collection: '/s',
      collection_2: '/technology',
      collection_filtered:
        '/office/?category-1=office&marca=acer&facets=category-1%2Cmarca',
      search: '/s?q=orange',
    },
  },
  analytics: {
    gtmContainerId: undefined,
    cgtmContainerId: 'GTM-NMKPZ9P3',
  },
  deliveryPromise: {
    enabled: true,
    mandatory: false,
  },
  experimental: {
    enableFaststoreMyAccount: true,
    nodeVersion: 18,
    cypressVersion: 12,
    enableCypressExtension: true,
    noRobots: false,
    noindex: true,
    nofollow: true,
  },
  account: vtex_account,
  vtexHeadlessCms: {
    webhookUrls: [
      `https://${vtex_account}.myvtex.com/cms-releases/webhook-releases`,
    ],
  },
  webpack(config) {
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },

      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      }
    )

    fileLoaderRule.exclude = /\.svg$/i

    config.resolve.symlinks = false // Prevents duplicate React instances

    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }

    return config
  },
}
