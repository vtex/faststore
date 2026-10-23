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

  describe('subscribeToNewsletter', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
      jest.restoreAllMocks()
    })

    it('creates the document with a POST authenticated by the newsletter app key', async () => {
      process.env.FS_NEWSLETTER_APP_KEY = 'newsletter-key'
      process.env.FS_NEWSLETTER_APP_TOKEN = 'newsletter-token'
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-1' })

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.subscribeToNewsletter({
        name: 'Jane',
        email: 'jane@example.com',
      })

      expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
      const [url, init, options] = fetchAPIMocked.mock.calls[0]
      expect(url).toBe(
        'https://storeframework.vtexcommercestable.com.br/api/dataentities/NL/documents'
      )
      expect(init.method).toBe('POST')
      expect(init.headers['X-VTEX-API-AppKey']).toBe('newsletter-key')
      expect(init.headers['X-VTEX-API-AppToken']).toBe('newsletter-token')
      expect(init.headers.cookie).toBeUndefined()
      expect(JSON.parse(init.body)).toEqual({
        name: 'Jane',
        email: 'jane@example.com',
        isNewsletterOptIn: true,
      })
      expect(options).toBeUndefined()
      expect(result).toEqual({ Id: 'NL-1' })
    })

    it('omits the name from the body when it is not provided', async () => {
      process.env.FS_NEWSLETTER_APP_KEY = 'newsletter-key'
      process.env.FS_NEWSLETTER_APP_TOKEN = 'newsletter-token'
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-2' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

      const [, init] = fetchAPIMocked.mock.calls[0]
      expect(JSON.parse(init.body)).toEqual({
        email: 'jane@example.com',
        isNewsletterOptIn: true,
      })
    })

    // Keep this as the first fallback test: the warning is emitted once per
    // process.
    it('falls back to the anonymous PATCH without credentials and warns only once', async () => {
      delete process.env.FS_NEWSLETTER_APP_KEY
      delete process.env.FS_NEWSLETTER_APP_TOKEN
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
      fetchAPIMocked
        .mockResolvedValueOnce({ Id: 'NL-3' })
        .mockResolvedValueOnce({ Id: 'NL-4' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })
      await commerce.subscribeToNewsletter({ email: 'john@example.com' })

      const [url, init] = fetchAPIMocked.mock.calls[0]
      expect(url).toBe(
        'https://storeframework.vtexcommercestable.com.br/api/dataentities/NL/documents/'
      )
      expect(init.method).toBe('PATCH')
      expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('does not send the app key of other features', async () => {
      delete process.env.FS_NEWSLETTER_APP_KEY
      delete process.env.FS_NEWSLETTER_APP_TOKEN
      process.env.FS_DISCOVERY_APP_KEY = 'discovery-key'
      process.env.FS_DISCOVERY_APP_TOKEN = 'discovery-token'
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-5' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

      const [, init] = fetchAPIMocked.mock.calls[0]
      expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
      expect(init.headers['X-VTEX-API-AppToken']).toBeUndefined()
    })
  })
})
