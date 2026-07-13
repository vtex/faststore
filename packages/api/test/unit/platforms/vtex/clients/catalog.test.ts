import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogDataplane } from '../../../../../src/platforms/vtex/clients/catalog'

const catalogOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
} as Options

const fetchAPIMocked = vi.fn()

beforeEach(() => {
  fetchAPIMocked.mockClear()
})

vi.mock('../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit) =>
    fetchAPIMocked(info, init),
}))

describe('Catalog Dataplane', () => {
  describe('getLocalizedProduct', () => {
    it('builds the URL from the configured account and environment', async () => {
      fetchAPIMocked.mockResolvedValueOnce({})

      const catalog = CatalogDataplane(catalogOptions)
      await catalog.getLocalizedProduct('123', 'en-US')

      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toBe(
        'https://storeframework.vtexcommercestable.com.br/api/catalog-dataplane/product/123'
      )
    })

    it('passes the locale in the Accept-Language header', async () => {
      fetchAPIMocked.mockResolvedValueOnce({})

      const catalog = CatalogDataplane(catalogOptions)
      await catalog.getLocalizedProduct('123', 'pt-BR')

      const [, init] = fetchAPIMocked.mock.calls[0]
      expect(init.headers['Accept-Language']).toBe('pt-BR')
    })

    it('propagates errors thrown by fetchAPI', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new Error('Network error'))

      const catalog = CatalogDataplane(catalogOptions)
      await expect(catalog.getLocalizedProduct('123', 'en-US')).rejects.toThrow(
        'Network error'
      )
    })
  })
})
