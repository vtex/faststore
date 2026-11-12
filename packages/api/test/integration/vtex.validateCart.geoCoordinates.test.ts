import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import type { Options } from '../../src/typings/globals'
import { createProductFetchResultForSku } from '../mocks/ValidateCartMutation'
import {
  browserCart,
  browserLine,
  CART_ETAG_URL,
  freshOrderForm,
  ITEMS_URL,
  ORDER_FORM_ID,
  ORDER_FORM_URL,
  orderFormItem,
} from '../mocks/ValidateCartServices'

const mockedFetch = vi.fn()

vi.mock('../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit) =>
    mockedFetch(info, init),
}))

beforeEach(() => {
  mockedFetch.mockReset()
})

const POSTAL_CODE_URL =
  'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/postal-code/BRA/05001100'
const SHIPPING_DATA_URL = `https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/${ORDER_FORM_ID}/attachments/shippingData`

const ValidateCartMutation = `mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {
  validateCart(cart: $cart, session: $session) {
    order {
      orderNumber
    }
  }
}`

const session = {
  locale: 'en-US',
  currency: { code: 'BRL', symbol: 'R$' },
  country: 'BRA',
  postalCode: '05001100',
  geoCoordinates: null,
}

const createRunner = async () => {
  const schemaPromise = GraphqlVtexSchema()
  const contextFactory = await GraphqlVtexContextFactory({
    platform: 'vtex',
    account: 'storeframework',
    environment: 'vtexcommercestable',
    channel: '{"salesChannel":"1"}',
    locale: 'en-US',
    subDomainPrefix: ['www'],
    hideUnavailableItems: false,
    showSponsored: false,
    incrementAddress: false,
    flags: { enableOrderFormSync: true },
  } as Options)

  return async (variables: Record<string, unknown>) =>
    execute({
      schema: await schemaPromise,
      document: parse(ValidateCartMutation),
      rootValue: null,
      contextValue: {
        ...contextFactory({}),
        headers: {
          'content-type': 'application/json',
          cookie: `checkout.vtex.com=__ofid=${ORDER_FORM_ID}`,
        },
      },
      variableValues: variables,
    })
}

/**
 * Mocks Checkout and Intelligent Search for a cart with one item and no
 * address. `postalCodeLookup` answers the postal code request.
 */
const mockPlatform = (postalCodeLookup: () => unknown) => {
  const initial = freshOrderForm([orderFormItem()])
  const shippingDataBodies: any[] = []

  mockedFetch.mockImplementation((info, init) => {
    const url = String(info)

    if (url === ORDER_FORM_URL || url === ITEMS_URL || url === CART_ETAG_URL) {
      return initial
    }

    if (url === POSTAL_CODE_URL) {
      return postalCodeLookup()
    }

    if (url === SHIPPING_DATA_URL) {
      shippingDataBodies.push(JSON.parse(init?.body as string))
      return initial
    }

    if (url.includes('/api/intelligent-search/v1/products?')) {
      const skuId = new URL(url).searchParams.get('value') ?? ''
      return createProductFetchResultForSku(skuId)
    }

    throw new Error(`Unexpected fetch: ${url}`)
  })

  return { shippingDataBodies }
}

describe('`validateCart` with a session that has a postal code and no coordinates', () => {
  test('sends the postal code coordinates in the new address', async () => {
    const run = await createRunner()
    const { shippingDataBodies } = mockPlatform(() => ({
      postalCode: '05001100',
      city: 'São Paulo',
      state: 'SP',
      country: 'BRA',
      geoCoordinates: [-46.675491333, -23.526170731],
    }))

    const response = await run({ cart: browserCart([browserLine()]), session })

    expect(response.errors).toBeUndefined()
    expect(shippingDataBodies).toHaveLength(1)
    expect(shippingDataBodies[0].selectedAddresses[0]).toMatchObject({
      postalCode: '05001100',
      country: 'BRA',
      geoCoordinates: [-46.675491333, -23.526170731],
    })
  })

  test('still sends the address when the postal code lookup fails', async () => {
    const run = await createRunner()
    const { shippingDataBodies } = mockPlatform(() => {
      throw new Error('Service Unavailable')
    })

    const response = await run({ cart: browserCart([browserLine()]), session })

    expect(response.errors).toBeUndefined()
    expect(shippingDataBodies).toHaveLength(1)
    expect(shippingDataBodies[0].selectedAddresses[0]).toMatchObject({
      postalCode: '05001100',
      country: 'BRA',
      geoCoordinates: [],
    })
  })
})
