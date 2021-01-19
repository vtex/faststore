import type { Sort } from './types'

export const api = {
  catalog: {
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
      search: ({
        sort = '',
        from,
        to,
      }: {
        sort?: Sort
        from: number
        to: number
      }) =>
        `/api/catalog_system/pub/products/search?O=${sort}&_from=${from}&_to=${to}`,
    },
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
