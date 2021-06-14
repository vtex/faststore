interface SearchOptions {
  query?: string
  page: number
  count: number
  sort: 'orders:desc'
  operator: 'and' | 'or'
  fuzzy?: string
  locale?: string
  bgy_leap?: boolean
  'hide-unavailable-items'?: boolean
}

export const api = {
  is: {
    search: (params: SearchOptions) => {
      const searchParams = new URLSearchParams()

      Object.keys(params).forEach((key) => {
        const value = params[key as keyof SearchOptions]

        if (value) {
          searchParams.set(key, `${value}`)
        }
      })

      return `/api/split/product_search/trade-policy/1?${searchParams}`
    },
  },
  catalog: {
    brand: {
      list: ({ page, pageSize }: { page: number; pageSize: number }) =>
        `/api/catalog_system/pub/brand/list?page=${page}&pageSize=${pageSize}`,
    },
    portal: {
      pageType: (path: string) =>
        `/api/catalog_system/pub/portal/pagetype${path}`,
    },
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
    },
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
