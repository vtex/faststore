import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as clients from '../../../../../../src/platforms/vtex/clients'
import { resetAnonymousNewsletterWarnings } from '../../../../../../src/platforms/vtex/clients/commerce'
// This should be imported AFTER the '../../../../../../src/platforms/vtex/clients'
import { NotFoundError } from '../../../../../../src/platforms/errors'
import { GraphqlVtexContextFactory } from '../../../../../../src/platforms/vtex'
import type { Options } from '../../../../../../src/typings/globals'

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

const contextFactory = await GraphqlVtexContextFactory(apiOptions)
const context = contextFactory({})

const fetchAPIMocked = vi.fn()

beforeEach(() => {
  fetchAPIMocked.mockClear()
})

vi.mock('../../../../../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => fetchAPIMocked(info, init, options),
}))

describe('VTEX Commerce', () => {
  describe('Checkout', () => {
    describe('orderForm', () => {
      it('includes sc query param by default', async () => {
        fetchAPIMocked.mockResolvedValueOnce({
          orderFormId: 'of-1',
          salesChannel: '1',
          items: [],
        })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.checkout.orderForm({ id: 'of-1' })

        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/checkout/pub/orderForm/of-1?')
        expect(url).toContain('sc=1')
        expect(url).toContain('refreshOutdatedData=true')
      })

      it('omits sc when preserveSalesChannel is true for an existing cart', async () => {
        fetchAPIMocked.mockResolvedValueOnce({
          orderFormId: 'of-1',
          salesChannel: '4',
          items: [{ id: 'sku-1' }],
        })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.checkout.orderForm({
          id: 'of-1',
          preserveSalesChannel: true,
        })

        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/checkout/pub/orderForm/of-1?')
        expect(url).not.toContain('sc=')
        expect(url).toContain('refreshOutdatedData=true')
      })

      it('still sends sc when preserveSalesChannel is true but creating a new cart', async () => {
        fetchAPIMocked.mockResolvedValueOnce({
          orderFormId: 'of-new',
          salesChannel: '1',
          items: [],
        })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.checkout.orderForm({
          preserveSalesChannel: true,
        })

        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/checkout/pub/orderForm?')
        expect(url).toContain('sc=1')
        expect(url).not.toContain('refreshOutdatedData')
      })
    })
  })

  describe('Order Entry', () => {
    describe('uploadFile', () => {
      it('calls OES upload endpoint with multipart body and returns objectKey', async () => {
        const mockResponse = { objectKey: 's3-key-abc' }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const fileBuffer = Buffer.from('SKU,Qty\n001,5')
        const result = await commerce.orderEntry.uploadFile({
          fileBuffer,
          fileName: 'items.csv',
          mimeType: 'text/csv',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/order-entry/upload')
        expect(url).toContain('storeframework')
        expect(init.method).toBe('POST')
        expect(init.headers['content-type']).toContain('multipart/form-data')
        expect(result).toEqual(mockResponse)
      })

      it('falls back to application/octet-stream for invalid mimeType', async () => {
        fetchAPIMocked.mockResolvedValueOnce({ objectKey: 'key' })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.orderEntry.uploadFile({
          fileBuffer: Buffer.from('data'),
          fileName: 'file.bin',
          mimeType: 'not a valid/mime type!!',
        })

        const [, init] = fetchAPIMocked.mock.calls[0]
        expect(init.headers['content-type']).toContain('multipart/form-data')
        const bodyStr = Buffer.from(init.body).toString()
        expect(bodyStr).toContain('Content-Type: application/octet-stream')
      })

      it('multipart body contains file content between header and footer', async () => {
        fetchAPIMocked.mockResolvedValueOnce({ objectKey: 'key' })

        const { commerce } = clients.getClients(apiOptions, context)
        const content = 'SKU,Qty\n001,1'
        const fileBuffer = Buffer.from(content)
        await commerce.orderEntry.uploadFile({
          fileBuffer,
          fileName: 'items.csv',
          mimeType: 'text/csv',
        })

        const [, init] = fetchAPIMocked.mock.calls[0]
        const bodyStr = Buffer.from(init.body).toString()
        expect(bodyStr).toContain('filename="items.csv"')
        expect(bodyStr).toContain(content)
      })
    })

    describe('startOperation', () => {
      it('calls OES operation endpoint with objectKey, orderFormId, and operation', async () => {
        const mockResponse = { operationId: 'op-123' }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.orderEntry.startOperation({
          objectKey: 's3-key',
          orderFormId: 'of-1',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/order-entry/operation')
        expect(init.method).toBe('POST')
        const body = JSON.parse(init.body)
        expect(body.objectKey).toBe('s3-key')
        expect(body.orderFormId).toBe('of-1')
        expect(body.operation).toBe('CreateCart')
        expect(result).toEqual(mockResponse)
      })

      it('includes sessionToken in body when provided', async () => {
        fetchAPIMocked.mockResolvedValueOnce({ operationId: 'op-456' })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.orderEntry.startOperation({
          objectKey: 'key',
          orderFormId: 'of-1',
          sessionToken: 'tok-abc',
        })

        const [, init] = fetchAPIMocked.mock.calls[0]
        const body = JSON.parse(init.body)
        expect(body.sessionToken).toBe('tok-abc')
      })

      it('omits sessionToken from body when not provided', async () => {
        fetchAPIMocked.mockResolvedValueOnce({ operationId: 'op-789' })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.orderEntry.startOperation({
          objectKey: 'key',
          orderFormId: 'of-1',
        })

        const [, init] = fetchAPIMocked.mock.calls[0]
        const body = JSON.parse(init.body)
        expect(body.sessionToken).toBeUndefined()
      })
    })

    describe('getOperation', () => {
      it('calls OES operation GET endpoint with operationId', async () => {
        const mockResponse = { status: 'SUCCESS', entityId: 'cart-1' }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.orderEntry.getOperation({
          operationId: 'op-abc',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/op-abc')
        expect(init.method).toBe('GET')
        expect(result).toEqual(mockResponse)
      })
    })

    describe('createOrderForm', () => {
      it('calls checkout orderForm endpoint and returns orderFormId', async () => {
        const mockResponse = { orderFormId: 'of-new' }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.orderEntry.createOrderForm()

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/checkout/pub/orderForm')
        expect(init.method).toBe('POST')
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getOrderFormItems', () => {
      it('calls checkout orderForm GET endpoint with orderFormId', async () => {
        const mockResponse = { items: [] }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.orderEntry.getOrderFormItems({
          orderFormId: 'of-123',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/of-123')
        expect(init.method).toBe('GET')
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Recommendation', () => {
    describe('recommendations', () => {
      it('builds the query string with all optional params', async () => {
        const mockResponse = { products: [], correlationId: '', campaign: {} }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.recommendation.recommendations({
          campaignVrn: 'vrn:recommendations:acc:rec-cross-v2:c-1',
          userId: 'user-1',
          products: ['pg-1', 'pg-2'],
          salesChannel: '1',
          locale: 'en-US',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/recommend-bff/v2/recommendations')
        expect(url).toContain('campaignVrn=vrn')
        expect(url).toContain('userId=user-1')
        expect(url).toContain('products=pg-1%2Cpg-2')
        expect(url).toContain('salesChannel=1')
        expect(url).toContain('locale=en-US')
        // Forwards the cookie-storage hook so the BFF's `vtex-rec-*` Set-Cookie
        // headers are persisted through `ctx.storage.cookies`.
        expect(fetchAPIMocked.mock.calls[0][2]).toHaveProperty('storeCookies')
        expect(result).toEqual(mockResponse)
      })

      it('omits optional params when not provided', async () => {
        fetchAPIMocked.mockResolvedValueOnce({})

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.recommendation.recommendations({
          campaignVrn: 'vrn:recommendations:acc:rec-top-items-v2:c-1',
        })

        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).not.toContain('userId=')
        expect(url).not.toContain('products=')
        expect(url).not.toContain('salesChannel=')
        expect(url).not.toContain('locale=')
      })
    })

    describe('startRecommendationSession', () => {
      it('posts to the start-session endpoint', async () => {
        const mockResponse = { recommendationsUserId: 'user-1' }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result =
          await commerce.recommendation.startRecommendationSession()

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/recommend-bff/v2/users/start-session')
        expect(init.method).toBe('POST')
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('Session', () => {
    it('requests shopper contract fields from the sessions API', async () => {
      fetchAPIMocked.mockResolvedValueOnce({ namespaces: {} })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.session('')

      expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toContain('shopper.availableContracts')
      expect(url).toContain('shopper.activeContractId')
    })
  })

  describe('storeFront', () => {
    describe('attachedContracts', () => {
      it('requests the attached contracts with details=true', async () => {
        const mockResponse = { contracts: [{ id: 'c-1', isDefault: true }] }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.storeFront.attachedContracts('unit-1')

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).toBe(
          'https://storeframework.myvtex.com/_v/store-front/units/unit-1/contracts/attached?details=true'
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('subscribeToNewsletter', () => {
    beforeEach(() => {
      resetAnonymousNewsletterWarnings()
    })

    afterEach(() => {
      vi.unstubAllEnvs()
      vi.restoreAllMocks()
    })

    it('creates the document with a POST authenticated by the newsletter app key', async () => {
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', 'newsletter-key')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', 'newsletter-token')
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
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', 'newsletter-key')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', 'newsletter-token')
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-2' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

      const [, init] = fetchAPIMocked.mock.calls[0]
      expect(JSON.parse(init.body)).toEqual({
        email: 'jane@example.com',
        isNewsletterOptIn: true,
      })
    })

    it('falls back to the anonymous PATCH without credentials and warns only once', async () => {
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', '')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', '')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      fetchAPIMocked
        .mockResolvedValueOnce({ Id: 'NL-3' })
        .mockResolvedValueOnce({ Id: 'NL-4' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })
      await commerce.subscribeToNewsletter({ email: 'john@example.com' })

      expect(fetchAPIMocked).toHaveBeenCalledTimes(2)
      for (const [url, init] of fetchAPIMocked.mock.calls) {
        expect(url).toBe(
          'https://storeframework.vtexcommercestable.com.br/api/dataentities/NL/documents/'
        )
        expect(init.method).toBe('PATCH')
        expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
        expect(init.headers['X-VTEX-API-AppToken']).toBeUndefined()
      }
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('warns once for each account that falls back', async () => {
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', '')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', '')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      fetchAPIMocked.mockResolvedValue({ Id: 'NL-6' })

      for (const account of ['storea', 'storeb']) {
        const { commerce } = clients.getClients(
          { ...apiOptions, account } as Options,
          context
        )
        await commerce.subscribeToNewsletter({ email: 'jane@example.com' })
        await commerce.subscribeToNewsletter({ email: 'john@example.com' })
      }

      expect(warn).toHaveBeenCalledTimes(2)
      fetchAPIMocked.mockReset()
    })

    it.each([
      [
        'FS_NEWSLETTER_APP_TOKEN',
        'FS_NEWSLETTER_APP_KEY',
        { key: 'newsletter-key', token: '' },
      ],
      [
        'FS_NEWSLETTER_APP_KEY',
        'FS_NEWSLETTER_APP_TOKEN',
        { key: '', token: 'newsletter-token' },
      ],
    ])(
      'names only %s in the warning when it is the one missing',
      async (missing, present, env) => {
        vi.stubEnv('FS_NEWSLETTER_APP_KEY', env.key)
        vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', env.token)
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-7' })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

        const [, init] = fetchAPIMocked.mock.calls[0]
        expect(init.method).toBe('PATCH')
        expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()

        const [message] = warn.mock.calls[0]
        expect(message).toContain(`${missing} is not set`)
        expect(message).not.toContain(present)
      }
    )

    it('names both variables in the warning when neither is set', async () => {
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', '')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', '')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-8' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

      expect(warn.mock.calls[0][0]).toContain(
        'FS_NEWSLETTER_APP_KEY and FS_NEWSLETTER_APP_TOKEN are not set'
      )
    })

    it('does not send the app key of other features', async () => {
      vi.stubEnv('FS_NEWSLETTER_APP_KEY', '')
      vi.stubEnv('FS_NEWSLETTER_APP_TOKEN', '')
      vi.stubEnv('FS_DISCOVERY_APP_KEY', 'discovery-key')
      vi.stubEnv('FS_DISCOVERY_APP_TOKEN', 'discovery-token')
      fetchAPIMocked.mockResolvedValueOnce({ Id: 'NL-5' })

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.subscribeToNewsletter({ email: 'jane@example.com' })

      const [, init] = fetchAPIMocked.mock.calls[0]
      expect(init.headers['X-VTEX-API-AppKey']).toBeUndefined()
      expect(init.headers['X-VTEX-API-AppToken']).toBeUndefined()
    })
  })

  describe('Quotes', () => {
    describe('listUserQuotes', () => {
      it('calls the quoting endpoint with pagination, status, date range and trimmed label params', async () => {
        const mockResponse = {
          items: [],
          totalItems: 0,
          pageNumber: 1,
          pageSize: 25,
        }
        fetchAPIMocked.mockResolvedValueOnce(mockResponse)

        const { commerce } = clients.getClients(apiOptions, context)
        const result = await commerce.quotes.listUserQuotes({
          page: 1,
          perPage: 25,
          status: ['Draft', 'Requested'],
          createdAtFrom: '2026-01-01',
          createdAtTo: '2026-01-31',
          expiresAtFrom: '2026-02-01',
          expiresAtTo: '2026-02-28',
          label: '  my quote  ',
        })

        expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
        const [url, init] = fetchAPIMocked.mock.calls[0]
        expect(url).toContain('/api/quoting/quotes?')
        expect(url).toContain('pageNumber=1')
        expect(url).toContain('pageSize=25')
        expect(url).toContain('status=Draft')
        expect(url).toContain('status=Requested')
        expect(url).toContain('createdAtFrom=2026-01-01')
        expect(url).toContain('createdAtTo=2026-01-31')
        expect(url).toContain('expiresAtFrom=2026-02-01')
        expect(url).toContain('expiresAtTo=2026-02-28')
        expect(url).toContain('label=my+quote')
        expect(init.method).toBe('GET')
        expect(result).toEqual(mockResponse)
      })

      it('omits an empty/whitespace-only label instead of sending it', async () => {
        fetchAPIMocked.mockResolvedValueOnce({
          items: [],
          totalItems: 0,
          pageNumber: 1,
          pageSize: 25,
        })

        const { commerce } = clients.getClients(apiOptions, context)
        await commerce.quotes.listUserQuotes({ label: '   ' })

        const [url] = fetchAPIMocked.mock.calls[0]
        expect(url).not.toContain('label=')
      })

      it.each([0, -1, 1.5])('throws for an invalid page "%s"', (page) => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() => commerce.quotes.listUserQuotes({ page })).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it.each([0, -1, 1.5])('throws for an invalid perPage "%s"', (perPage) => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() => commerce.quotes.listUserQuotes({ perPage })).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it('throws for an invalid createdAtFrom format', () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() =>
          commerce.quotes.listUserQuotes({ createdAtFrom: '01-01-2026' })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it('throws for an invalid createdAtTo format', () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() =>
          commerce.quotes.listUserQuotes({ createdAtTo: '2026/01/31' })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it('throws for an invalid expiresAtFrom format', () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() =>
          commerce.quotes.listUserQuotes({ expiresAtFrom: 'not-a-date' })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it('throws for an invalid expiresAtTo format', () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() =>
          commerce.quotes.listUserQuotes({ expiresAtTo: '2026-1-1' })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })

      it('throws for an invalid status value', () => {
        const { commerce } = clients.getClients(apiOptions, context)

        expect(() =>
          commerce.quotes.listUserQuotes({ status: ['NotAStatus'] })
        ).toThrow(Error)
        expect(fetchAPIMocked).not.toHaveBeenCalled()
      })
    })
  })
})

describe('Catalog byLinkId', () => {
  describe('category', () => {
    it('calls the correct by-linkid URL and returns the single entity', async () => {
      // The Catalog by-linkid endpoint returns a single entity object, not a list.
      const mockCategory = {
        id: 9281,
        name: 'Apparel',
        linkId: 'Apparel',
        availableLinkIds: { 'en-US': 'Apparel', 'pt-BR': 'Vestuário' },
      }
      fetchAPIMocked.mockResolvedValueOnce(mockCategory)

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.category('apparel')

      expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toContain(
        '/api/catalog_system/pub/category/by-linkid/apparel'
      )
      expect(result).toEqual(mockCategory)
    })

    it('URL-encodes special characters in the linkId', async () => {
      fetchAPIMocked.mockResolvedValueOnce(null)

      const { commerce } = clients.getClients(apiOptions, context)
      // Ampersand is a reserved URL character that encodeURIComponent must encode
      await commerce.catalog.byLinkId.category('Computer&Software')

      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toContain('Computer%26Software')
      expect(url).not.toContain('Computer&Software')
    })

    it('preserves "/" separators in multi-segment paths while encoding each segment', async () => {
      fetchAPIMocked.mockResolvedValueOnce(null)

      const { commerce } = clients.getClients(apiOptions, context)
      await commerce.catalog.byLinkId.category('computer&software/eletronicos')

      const [url] = fetchAPIMocked.mock.calls[0]
      // The path separator must stay literal so the API validates each level,
      // while special characters inside a segment are still encoded.
      expect(url).toContain('/by-linkid/computer%26software/eletronicos')
      expect(url).not.toContain('%2F')
    })

    it('returns null when the API responds with 404', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new NotFoundError())

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.category('nonexistent')

      expect(result).toBeNull()
    })

    it('rethrows non-404 errors', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new Error('Network error'))

      const { commerce } = clients.getClients(apiOptions, context)
      await expect(
        commerce.catalog.byLinkId.category('apparel')
      ).rejects.toThrow('Network error')
    })
  })

  describe('brand', () => {
    it('calls the correct by-linkid URL and returns the single entity', async () => {
      const mockBrand = {
        id: 9280,
        name: 'Brand',
        linkId: 'Brand',
        availableLinkIds: { 'en-US': 'Brand' },
      }
      fetchAPIMocked.mockResolvedValueOnce(mockBrand)

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.brand('brand')

      expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toContain('/api/catalog_system/pub/brand/by-linkid/brand')
      expect(result).toEqual(mockBrand)
    })

    it('returns null when the API responds with 404', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new NotFoundError())

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.brand('unknown-brand')

      expect(result).toBeNull()
    })

    it('rethrows non-404 errors', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new Error('Server error'))

      const { commerce } = clients.getClients(apiOptions, context)
      await expect(commerce.catalog.byLinkId.brand('adidas')).rejects.toThrow(
        'Server error'
      )
    })
  })

  describe('collection', () => {
    it('calls the correct by-linkid URL and returns the single entity', async () => {
      const mockCollection = {
        id: 42,
        name: 'Summer Sale',
        linkId: 'summer-sale',
        availableLinkIds: null,
      }
      fetchAPIMocked.mockResolvedValueOnce(mockCollection)

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.collection('summer-sale')

      expect(fetchAPIMocked).toHaveBeenCalledTimes(1)
      const [url] = fetchAPIMocked.mock.calls[0]
      expect(url).toContain(
        '/api/catalog_system/pub/collection/by-linkid/summer-sale'
      )
      expect(result).toEqual(mockCollection)
    })

    it('returns null when the API responds with 404', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new NotFoundError())

      const { commerce } = clients.getClients(apiOptions, context)
      const result = await commerce.catalog.byLinkId.collection(
        'nonexistent-collection'
      )

      expect(result).toBeNull()
    })

    it('rethrows non-404 errors', async () => {
      fetchAPIMocked.mockRejectedValueOnce(new Error('Timeout'))

      const { commerce } = clients.getClients(apiOptions, context)
      await expect(
        commerce.catalog.byLinkId.collection('summer-sale')
      ).rejects.toThrow('Timeout')
    })
  })

  describe('Accept-Language header', () => {
    it('forwards the given locale for category/brand/collection', async () => {
      const { commerce } = clients.getClients(apiOptions, context)

      fetchAPIMocked.mockResolvedValue(null)

      await commerce.catalog.byLinkId.category('apparel', 'pt-BR')
      await commerce.catalog.byLinkId.brand('brand', 'pt-BR')
      await commerce.catalog.byLinkId.collection('summer-sale', 'pt-BR')

      for (const call of fetchAPIMocked.mock.calls) {
        const [, init] = call
        expect(init?.headers?.['Accept-Language']).toBe('pt-BR')
      }
    })

    it('sends no init (no Accept-Language) when no locale is provided', async () => {
      const { commerce } = clients.getClients(apiOptions, context)

      fetchAPIMocked.mockResolvedValue(null)

      await commerce.catalog.byLinkId.category('apparel')

      const [, init] = fetchAPIMocked.mock.calls[0]
      // No init object at all → the endpoint falls back to the default language.
      expect(init).toBeUndefined()
    })
  })
})
