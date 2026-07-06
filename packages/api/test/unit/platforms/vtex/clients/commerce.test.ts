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

const contextFactory = await GraphqlVtexContextFactory(apiOptions)
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
})
