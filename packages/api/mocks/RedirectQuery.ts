export const RedirectQueryTermTech = `query RedirectSearch {
    redirect(term: "tech") {
        url
    }
  }
  `

export const redirectTermTechFetch = {
    info: 'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=2&count=1&query=tech&sort=&fuzzy=auto&locale=en-US&hideUnavailableItems=false',
    init: undefined,
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
