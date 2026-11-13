import { execute, parse } from 'graphql'

import type { Options } from '../../src'
import { getContextFactory, getSchema } from '../../src'
import { salesChannelStaleFetch } from '../mocks/salesChannel'
import {
  checkoutOrderFormCustomDataInvalidFetch,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormCustomDataValidFetch,
  checkoutOrderFormCustomDataWithoutAddressFetch,
  checkoutOrderFormInvalidFetch,
  checkoutOrderFormItemsInvalidFetch,
  checkoutOrderFormItemsWithoutAddressFetch,
  checkoutOrderFormShippingDataFetch,
  checkoutOrderFormStaleFetch,
  checkoutOrderFormValidFetch,
  checkoutOrderFormWithoutAddressFetch,
  checkoutOrderFormItemsWithAvailableAddressFetch,
  checkoutOrderFormWithAvailableAddressFetch,
  checkoutPostalCodeFetch,
  addressWithSessionPostalCode,
  InvalidCart,
  productSearchPage1Count1Fetch,
  SessionWithPostalCode,
  ValidateCartMutation,
  ValidateCartWithSessionMutation,
  ValidCart,
} from '../mocks/ValidateCartMutation'

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

const mockedFetch = jest.fn()

const createRunner = () => {
  const schemaPromise = getSchema(apiOptions)
  const contextFactory = getContextFactory(apiOptions)

  return async (query: string, variables?: any) => {
    const schema = await schemaPromise
    const context = contextFactory({})
    const orderFormCookie =
      'checkout.vtex.com=__ofid=edbe3b03c8c94827a37ec5a6a4648fd2'

    return execute(
      schema,
      parse(query),
      null,
      {
        ...context,
        headers: {
          'content-type': 'application/json',
          cookie: orderFormCookie,
        },
      },
      variables
    )
  }
}

function pickFetchAPICallResult(
  info: RequestInfo,
  _: RequestInit | undefined,
  expectedFetchAPICalls: Array<Record<'info' | 'init' | 'result', unknown>>
) {
  for (const call of expectedFetchAPICalls) {
    if (info === call.info) {
      return call.result
    }
  }

  throw new Error(
    `fetchAPI was called with an unexpected 'info' argument.\ninfo: ${info}`
  )
}

jest.mock('../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (
    info: RequestInfo,
    init?: RequestInit,
    options?: { storeCookies?: (headers: Headers) => void }
  ) => mockedFetch(info, init, options),
}))

const run = createRunner()

// Always clear the mocked fetch before each test so we can count and validate
// the calls performed by each query independently.
beforeEach(() => {
  mockedFetch.mockClear()
})

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [
      checkoutOrderFormValidFetch,
      checkoutOrderFormCustomDataValidFetch,
      salesChannelStaleFetch,
    ])
  )

  const response = await run(ValidateCartMutation, { cart: ValidCart })

  // When cart is valid, the system will:
  // 1. GET orderForm
  // 2. PUT customData (update/set etag because cart might have been modified elsewhere)
  // 3. GET saleschannel (to get currency info)
  // Since the cart matches and etag is now correct, it returns null (no changes needed)
  expect(mockedFetch).toHaveBeenCalledTimes(3)

  expect(response.data?.validateCart).toEqual(null)
})

test('`validateCart` mutation should return the full order when an invalid cart is passed', async () => {
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

const fetchCallsTo = (url: string) =>
  mockedFetch.mock.calls.filter(([info]) => info === url)

const getSelectedAddress = () => {
  const [call] = fetchCallsTo(checkoutOrderFormShippingDataFetch.info)

  expect(call).toBeDefined()

  return JSON.parse(call[1].body).selectedAddresses[0]
}

test('`validateCart` mutation should send the postal code coordinates when the session has none', async () => {
  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [
      checkoutOrderFormWithoutAddressFetch,
      checkoutOrderFormItemsWithoutAddressFetch,
      checkoutPostalCodeFetch,
      checkoutOrderFormShippingDataFetch,
      checkoutOrderFormCustomDataWithoutAddressFetch,
      salesChannelStaleFetch,
    ])
  )

  const response = await run(ValidateCartWithSessionMutation, {
    cart: ValidCart,
    session: SessionWithPostalCode,
  })

  expect(response.errors).toBeUndefined()
  expect(response.data?.validateCart).toEqual(null)
  expect(fetchCallsTo(checkoutPostalCodeFetch.info)).toHaveLength(1)
  expect(fetchCallsTo(checkoutOrderFormShippingDataFetch.info)).toHaveLength(1)
  expect(getSelectedAddress()).toMatchObject({
    postalCode: '05001100',
    country: 'BRA',
    geoCoordinates: [-46.675491333, -23.526170731],
  })
})

test('`validateCart` mutation should reuse an orderForm address with the session postal code without a lookup', async () => {
  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, [
      checkoutOrderFormWithAvailableAddressFetch,
      checkoutOrderFormItemsWithAvailableAddressFetch,
      checkoutOrderFormShippingDataFetch,
      checkoutOrderFormCustomDataWithoutAddressFetch,
      salesChannelStaleFetch,
    ])
  )

  const response = await run(ValidateCartWithSessionMutation, {
    cart: ValidCart,
    session: SessionWithPostalCode,
  })

  expect(response.errors).toBeUndefined()
  expect(fetchCallsTo(checkoutPostalCodeFetch.info)).toHaveLength(0)
  expect(fetchCallsTo(checkoutOrderFormShippingDataFetch.info)).toHaveLength(1)
  expect(getSelectedAddress()).toEqual(addressWithSessionPostalCode)
})

test('`validateCart` mutation should still send the address when the postal code lookup fails', async () => {
  mockedFetch.mockImplementation((info, init) => {
    if (info === checkoutPostalCodeFetch.info) {
      return Promise.reject(new Error('Service Unavailable'))
    }

    return pickFetchAPICallResult(info, init, [
      checkoutOrderFormWithoutAddressFetch,
      checkoutOrderFormItemsWithoutAddressFetch,
      checkoutOrderFormShippingDataFetch,
      checkoutOrderFormCustomDataWithoutAddressFetch,
      salesChannelStaleFetch,
    ])
  })
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  const response = await run(ValidateCartWithSessionMutation, {
    cart: ValidCart,
    session: SessionWithPostalCode,
  })

  warn.mockRestore()
  expect(response.errors).toBeUndefined()
  expect(response.data?.validateCart).toEqual(null)
  expect(fetchCallsTo(checkoutPostalCodeFetch.info)).toHaveLength(1)
  expect(fetchCallsTo(checkoutOrderFormShippingDataFetch.info)).toHaveLength(1)
  expect(getSelectedAddress()).toMatchObject({
    postalCode: '05001100',
    country: 'BRA',
    geoCoordinates: [],
  })
})
