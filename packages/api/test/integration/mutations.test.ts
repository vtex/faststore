import { execute, parse } from 'graphql'
import { beforeEach, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import {
  InvalidCart,
  ValidCart,
  ValidateCartMutation,
  checkoutOrderFormCustomDataInvalidFetch,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormInvalidFetch,
  checkoutOrderFormItemsInvalidFetch,
  checkoutOrderFormStaleFetch,
  checkoutOrderFormValidFetch,
  createProductFetchResultForSku,
  productSearchPage1Count1Fetch,
} from '../mocks/ValidateCartMutation'
import { salesChannelStaleFetch } from '../mocks/salesChannel'

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
    enableUnavailableItemsOnCart: false,
  },
} as Options

vi.useFakeTimers({ shouldAdvanceTime: true })
const mockedFetch = vi.fn()

const createRunner = async () => {
  const schemaPromise = GraphqlVtexSchema()
  const contextFactory = await GraphqlVtexContextFactory(apiOptions)

  return async (query: string, variables?: any) => {
    const schema = await schemaPromise
    const context = contextFactory({})
    const orderFormCookie =
      'checkout.vtex.com=__ofid=edbe3b03c8c94827a37ec5a6a4648fd2'

    return execute({
      schema,
      document: parse(query),
      rootValue: null,
      contextValue: {
        ...context,
        headers: {
          'content-type': 'application/json',
          cookie: orderFormCookie,
        },
      },
      variableValues: variables,
    })
  }
}

function pickFetchAPICallResult(
  info: RequestInfo,
  _: RequestInit | undefined,
  expectedFetchAPICalls: Array<Record<'info' | 'init' | 'result', unknown>>
) {
  const url = String(info)

  if (url.includes('/api/intelligent-search/v1/products?')) {
    const skuId = new URL(url).searchParams.get('value') ?? ''

    return createProductFetchResultForSku(skuId)
  }

  for (const call of expectedFetchAPICalls) {
    if (info === call.info) {
      return call.result
    }
  }

  throw new Error(
    `fetchAPI was called with an unexpected 'info' argument.\ninfo: ${info}`
  )
}

vi.mock('../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => mockedFetch(info, init, options),
}))

// Always clear the mocked fetch before each test so we can count and validate
// the calls performed by each query independently.
beforeEach(() => {
  mockedFetch.mockClear()
})

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  const run = await createRunner()
  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [checkoutOrderFormValidFetch])
  )

  const response = await run(ValidateCartMutation, { cart: ValidCart })

  // When cart is valid and etag is up to date, only checkout calls are made.
  expect(mockedFetch).toHaveBeenCalledTimes(2)

  expect(response.data?.validateCart).toEqual(null)
})

test('`validateCart` mutation should return the full order when an invalid cart is passed', async () => {
  const run = await createRunner()
  const fetchAPICalls = [
    checkoutOrderFormInvalidFetch,
    checkoutOrderFormItemsInvalidFetch,
    checkoutOrderFormCustomDataInvalidFetch,
    productSearchPage1Count1Fetch,
    salesChannelStaleFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  // When cart is invalid:
  // 1. GET orderForm
  // 2. PATCH items (update cart items)
  // 3. PUT customData (set etag after update)
  // 4. GET product_search (load SKUs)
  expect(mockedFetch).toHaveBeenCalledTimes(4)

  expect(response).toMatchSnapshot()
})

test('`validateCart` mutation should return new cart when etag is stale', async () => {
  const run = await createRunner()
  const fetchAPICalls = [
    checkoutOrderFormStaleFetch,
    checkoutOrderFormCustomDataStaleFetch,
    productSearchPage1Count1Fetch,
    salesChannelStaleFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  // When the cart is stale:
  // 1. GET orderForm
  // 2. PUT customData (setOrderFormEtag when detecting stale)
  // 3. GET product_search (to load SKUs for the cart)
  // 4. GET saleschannel (to get currency info for product loading)
  expect(mockedFetch).toHaveBeenCalledTimes(4)

  expect(response).toMatchSnapshot()
})
