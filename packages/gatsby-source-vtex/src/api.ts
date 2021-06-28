export const api = {
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
