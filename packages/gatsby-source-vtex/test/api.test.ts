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

  it('Generate a simple brand list', () => {
    const url = api.catalog.brand.list({ page: 10, pageSize: 10 })

    expect(url).toBe('')
  })
})
