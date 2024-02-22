// All mocks are simplified versions, with less fields than proper sections
// and content types. They contain just the necessary fields for our tests to
// be useful.

export const coreSections = [
  {
    name: 'Alert',
    schema: {
      title: 'Alert',
      description: 'Add an alert',
      properties: {},
    },
  },
  {
    name: 'BannerNewsletter',
    schema: {
      title: 'Banner Newsletter',
      description: 'Add newsletter with a banner',
      properties: {},
    },
  },
  {
    name: 'Hero',
    schema: {
      title: 'Hero',
      description: 'Add a quick promotion with an image/action pair',
      properties: {},
    },
  },
  {
    name: 'Navbar',
    schema: {
      title: 'Navbar',
      description: 'Navbar configuration',
      properties: {},
    },
  },
  {
    name: 'ProductShelf',
    schema: {
      title: 'Product Shelf',
      description: 'Add custom shelves to your store',
      properties: {},
    },
  },
  {
    name: 'Search',
    schema: {
      title: 'Search Bar',
      description: 'Search Bar Configuration',
      properties: {},
    },
  },
]

export const allNewCustomSections = [
  {
    name: 'MembershipsAccordion',
    schema: {
      title: 'Memberships - Accordion',
      description: 'Why should people give us money every month.',
      properties: {},
    },
  },
  {
    name: 'ProductShelfCustom',
    schema: {
      title: 'Wayne Industries Shelf',
      description: 'Some products we sell... nothing bat related.',
      properties: {},
    },
  },
]

export const sectionDuplicates = [
  {
    name: 'BannerNewsletter',
    schema: {
      title: 'Newsletter + Cool Banner',
      description: 'Totally not spam.',
      properties: {},
    },
  },
  {
    name: 'Hero',
    schema: {
      title: 'Hero',
      description:
        'Very careful with the image you choose here... not that we have anything to hide ;)',
      properties: {},
    },
  },
]

export const customSectionsWithDuplicates = [
  ...allNewCustomSections,
  ...sectionDuplicates,
]

export const coreContentTypes = [
  {
    id: '404',
    name: 'Error 404',
    configurationSchemaSets: [],
    isSingleton: true,
  },
  {
    id: '500',
    name: 'Error 500',
    configurationSchemaSets: [],
    isSingleton: true,
  },
  {
    id: 'globalSections',
    name: 'Global Sections',
    configurationSchemaSets: [],
    isSingleton: true,
  },
  {
    id: 'home',
    name: 'Home',
    isSingleton: true,
    configurationSchemaSets: [],
  },
  {
    id: 'landingPage',
    name: 'Landing Page',
    configurationSchemaSets: [],
  },
  {
    id: 'login',
    name: 'Login',
    configurationSchemaSets: [],
    isSingleton: true,
  },
  {
    id: 'pdp',
    name: 'Product Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
  {
    id: 'plp',
    name: 'Product List Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
  {
    id: 'search',
    name: 'Search Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
]

export const allNewCustomContentTypes = [
  {
    id: 'customPage',
    name: 'Custom Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
  {
    id: 'errorPage',
    name: 'Custom Error Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
]

export const contentTypeDuplicates = [
  {
    id: 'login',
    name: 'Custom Login. Why not...',
    configurationSchemaSets: [],
    isSingleton: true,
  },
  {
    id: 'search',
    name: 'Custom Search Page',
    isSingleton: true,
    configurationSchemaSets: [],
  },
]

export const customContentTypesWithDuplicates = [
  ...allNewCustomContentTypes,
  ...contentTypeDuplicates,
]
