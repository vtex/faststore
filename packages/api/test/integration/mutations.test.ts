import { execute, parse } from 'graphql'
import { beforeEach, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import {
  CartWithServiceOnOneUnit,
  InvalidCart,
  ValidCart,
  ValidateCartMutation,
  checkoutOrderFormCustomDataInvalidFetch,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormCustomDataValidFetch,
  checkoutOrderFormCustomDataWithServiceFetch,
  checkoutOrderFormInvalidFetch,
  checkoutOrderFormItemsInvalidFetch,
  checkoutOrderFormItemsWithServiceFetch,
  checkoutOrderFormStaleFetch,
  checkoutOrderFormValidFetch,
  checkoutOrderFormWithServiceFetch,
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
  showSponsored: false,
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

  // When cart is valid and etag is up to date:
  // 1. GET orderForm (checkoutOrderFormValidFetch)
  // 2. GET product data via v1/products (handled dynamically)
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

const withOrderFormSalesChannel = <
  T extends { result: { salesChannel?: string } },
>(
  fetchMock: T,
  salesChannel: string
) => ({
  ...fetchMock,
  result: {
    ...fetchMock.result,
    salesChannel,
  },
})

const salesChannelFetch = (salesChannel: string) => ({
  ...salesChannelStaleFetch,
  info: salesChannelStaleFetch.info.replace(
    '/saleschannel/1',
    `/saleschannel/${salesChannel}`
  ),
  result: {
    ...salesChannelStaleFetch.result,
    Id: Number(salesChannel),
  },
})

/**
 * Non-stale orderForm (valid etag) + divergent browser cart → item update path.
 * Session channel remains SC1 via apiOptions; orderForm is on SC2.
 */
test('`validateCart` updates items with orderForm SC when session SC diverges', async () => {
  const run = await createRunner()
  const orderFormOnSc2 = withOrderFormSalesChannel(
    checkoutOrderFormValidFetch,
    '2'
  )
  const customDataOnSc2 = withOrderFormSalesChannel(
    checkoutOrderFormCustomDataValidFetch,
    '2'
  )

  mockedFetch.mockImplementation((info, init, options) => {
    const url = String(info)

    if (url.includes('/items?')) {
      expect(url).toContain('sc=2')
      expect(url).not.toContain('sc=1')
      return {
        ...checkoutOrderFormItemsInvalidFetch.result,
        salesChannel: '2',
      }
    }

    if (url.includes('/customData/faststore/cartEtag')) {
      return customDataOnSc2.result
    }

    return pickFetchAPICallResult(info, init, [
      orderFormOnSc2,
      productSearchPage1Count1Fetch,
      salesChannelFetch('2'),
    ])
  })

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  const getOrderFormUrl = mockedFetch.mock.calls
    .map(([info]) => String(info))
    .find(
      (url) =>
        /\/orderForm\/[^/?]+(\?|$)/.test(url) &&
        !url.includes('/items') &&
        !url.includes('/customData')
    )
  const itemsUrl = mockedFetch.mock.calls
    .map(([info]) => String(info))
    .find((url) => url.includes('/items?'))

  expect(getOrderFormUrl).toBeDefined()
  expect(getOrderFormUrl).not.toContain('sc=')
  expect(itemsUrl).toBeDefined()
  expect(itemsUrl).toContain('sc=2')
  expect(
    mockedFetch.mock.calls.some(([info]) => String(info).includes('sc=1'))
  ).toBe(false)
  expect(response.errors).toBeUndefined()
  expect(response.data?.validateCart).not.toBeNull()
  expect(response.data?.validateCart?.order?.salesChannel).toBe('2')
})

test('`validateCart` adopts orderForm SC on stale etag without refetching session SC', async () => {
  const run = await createRunner()
  const staleOnSc2 = withOrderFormSalesChannel(checkoutOrderFormStaleFetch, '2')
  const customDataOnSc2 = withOrderFormSalesChannel(
    checkoutOrderFormCustomDataStaleFetch,
    '2'
  )

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [
      staleOnSc2,
      customDataOnSc2,
      productSearchPage1Count1Fetch,
      salesChannelFetch('2'),
    ])
  )

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  const checkoutUrls = mockedFetch.mock.calls
    .map(([info]) => String(info))
    .filter((url) => url.includes('/api/checkout/pub/orderForm'))
  const getOrderFormUrl = checkoutUrls.find(
    (url) =>
      /\/orderForm\/[^/?]+(\?|$)/.test(url) &&
      !url.includes('/items') &&
      !url.includes('/customData')
  )

  expect(getOrderFormUrl).toBeDefined()
  expect(getOrderFormUrl).not.toContain('sc=')
  expect(checkoutUrls.some((url) => url.includes('sc=1'))).toBe(false)
  expect(
    mockedFetch.mock.calls.some(([info]) =>
      String(info).includes('/saleschannel/2')
    )
  ).toBe(true)
  expect(response.errors).toBeUndefined()
  expect(response.data?.validateCart).not.toBeNull()
  expect(response.data?.validateCart?.order?.salesChannel).toBe('2')
})

test('`validateCart` keeps services attached when only some units carry them', async () => {
  const run = await createRunner()

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [
      checkoutOrderFormWithServiceFetch,
      checkoutOrderFormItemsWithServiceFetch,
      checkoutOrderFormCustomDataWithServiceFetch,
    ])
  )

  await run(ValidateCartMutation, { cart: CartWithServiceOnOneUnit })

  const updateCall = mockedFetch.mock.calls.find(
    ([info, init]) =>
      String(info).includes('/items?') && init?.method === 'PATCH'
  )

  const orderItems = updateCall
    ? JSON.parse(String(updateCall[1].body)).orderItems
    : []

  // Collapsing the group onto `head` sets the whole quantity on the first line
  // and zeroes the rest. The line being zeroed is the one carrying the service,
  // so the shopper silently loses it.
  expect(
    orderItems.some((item: { quantity: number }) => item.quantity === 0)
  ).toBe(false)
})
