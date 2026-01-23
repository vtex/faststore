import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as clients from '../../../../../src/platforms/vtex/clients'
// This should be imported AFTER the '../../../../../src/platforms/vtex/clients'
import { GraphqlVtexContextFactory } from '../../../../../src/platforms/vtex'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  subDomainPrefix: ['www'],
  hideUnavailableItems: false,
  incrementAddress: false,
  flags: {
    enableOrderFormSync: true,
  },
} as Options

const contextFactory = GraphqlVtexContextFactory(apiOptions)
const context = contextFactory({})

const fetchAPIMocked = vi.fn()

beforeEach(() => {
  fetchAPIMocked.mockClear()
})

vi.mock('../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => fetchAPIMocked(info, init, options),
}))

describe('VTEX Commerce', () => {
  describe('Checkout', () => {
    describe('Pickup points', () => {
      it('should succeed with valid geo coordinates', async () => {
        const validResponse = {
          pickupPointDistances: [],
          pickupPointsHash: '',
        }
        const geoCoordinates = {
          latitude: 123,
          longitude: 456,
        }

        fetchAPIMocked.mockResolvedValueOnce(validResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.checkout.pickupPoints({
          geoCoordinates,
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        expect(result).toEqual(validResponse)
      })

      it('should throw an error when no params', async () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() => commerce.checkout.pickupPoints({})).toThrow(Error)
        expect(() =>
          commerce.checkout.pickupPoints({
            geoCoordinates: undefined,
          })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })
    })
  })
})
