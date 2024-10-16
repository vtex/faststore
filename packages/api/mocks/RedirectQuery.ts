export const RedirectQueryTermTech = `query RedirectSearch {
    redirect(term: "tech") {
        url
    }
  }
  `

export const redirectTermTechFetch = {
  path: '/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=2&count=1&query=tech&sort=&fuzzy=auto&locale=en-US&hideUnavailableItems=false&simulationBehavior=skip&showSponsored=false',
  init: undefined,
  options: {
    account: 'storeframework',
    environment: 'vtexcommercestable',
    storeCookies: expect.any(Function),
    vtexApi: 'io',
  },
  result: {
    products: [],
    recordsFiltered: 0,
    fuzzy: 'auto',
    operator: 'and',
    redirect: '/technology',
    translated: false,
    pagination: {
      count: 1,
      current: {
        index: 0,
      },
      before: [],
      after: [],
      perPage: 0,
      next: {
        index: 0,
      },
      previous: {
        index: 0,
      },
      first: {
        index: 0,
      },
      last: {
        index: 0,
      },
    },
  },
}
