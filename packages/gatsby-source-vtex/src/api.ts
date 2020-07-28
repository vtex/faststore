export const api = {
  catalog: {
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
    },
  },
  checkout: {
    orderForm: '/api/checkout/pub/orderForm',
    addItem: (orderFormId: string) =>
      `/api/checkout/pub/orderForm/${orderFormId}/items`,
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
