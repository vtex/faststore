import { api } from '../src/api'

describe('API module url handling', () => {
  it('Generate a simple IS url', () => {
    const url = api.is.search({
      page: 1,
      count: 10,
      sort: 'orders:desc',
      operator: 'or',
    })

    expect(url).toBe(
      '/api/split/product_search/trade-policy/1?page=1&count=10&sort=orders%3Adesc&operator=or'
    )
  })

  it('Generates a simple brand list url', () => {
    const url = api.catalog.brand.list({ page: 10, pageSize: 10 })

    expect(url).toBe('/api/catalog_system/pub/brand/list?page=10&pageSize=10')
  })

  it('Generates a simple portal pageType url', () => {
    const url = api.catalog.portal.pageType('/my-awesome-brand')

    expect(url).toBe('/api/catalog_system/pub/portal/pagetype/my-awesome-brand')
  })

  it('Generates a simple category tree url', () => {
    const url = api.catalog.category.tree(3)

    expect(url).toBe('/api/catalog_system/pub/category/tree/3')
  })

  it('Generates a simple tenant system url', () => {
    const url = api.tenants.tenant('account')

    expect(url).toBe(`/api/tenant/tenants?q=account`)
  })
})
