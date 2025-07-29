import {
  type Options,
  getContextFactory,
} from '../../../../../src/platforms/vtex'
import * as clients from '../../../../../src/platforms/vtex/clients'

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

const contextFactory = getContextFactory(apiOptions)
const context = contextFactory({})

const fetchAPIMocked = jest.fn()

jest.mock('../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => fetchAPIMocked(info, init, options),
}))

beforeEach(() => {
  fetchAPIMocked.mockClear()
})

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
