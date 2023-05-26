import { execute, parse } from 'graphql'

import {
  checkoutOrderFormCustomDataInvalidFetch,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormCustomDataValidFetch,
  checkoutOrderFormInvalidFetch,
  checkoutOrderFormItemsInvalidFetch,
  checkoutOrderFormItemsValidFetch,
  checkoutOrderFormStaleFetch,
  checkoutOrderFormValidFetch,
  InvalidCart,
  productSearchPage1Count1Fetch,
  ValidateCartMutation,
  ValidCart,
} from '../mocks/ValidateCartMutation'
import { getContextFactory, getSchema } from '../src'
import { salesChannelStaleFetch } from '../mocks/salesChannel'
import type { Options } from '../src'

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
  locale: 'en-US',
  hideUnavailableItems: false,
  incrementAddress: false,
  flags: {
    enableOrderFormSync: true,
  },
} as Options

const mockedFetch = jest.fn()

const createRunner = () => {
  const schemaPromise = getSchema(apiOptions)
  const contextFactory = getContextFactory(apiOptions)

  return async (query: string, variables?: any) => {
    const schema = await schemaPromise
    const context = contextFactory({})

    return execute(
      schema,
      parse(query),
      null,
      { ...context, headers: { cookie: '' } },
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

jest.mock('../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit) =>
    mockedFetch(info, init),
}))

const run = createRunner()

// Always clear the mocked fetch before each test so we can count and validate
// the calls performed by each query independently.
beforeEach(() => {
  mockedFetch.mockClear()
})

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  const fetchAPICalls = [
    checkoutOrderFormValidFetch,
    checkoutOrderFormItemsValidFetch,
    checkoutOrderFormCustomDataValidFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: ValidCart })

  expect(mockedFetch).toHaveBeenCalledTimes(3)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toEqual({ data: { validateCart: null } })
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

  expect(mockedFetch).toHaveBeenCalledTimes(5)

  fetchAPICalls.forEach((fetchAPICall, index) => {
    expect(mockedFetch).toHaveBeenNthCalledWith(
      index + 1,
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

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

  expect(mockedFetch).toHaveBeenCalledTimes(4)

  fetchAPICalls.forEach((fetchAPICall, index) => {
    expect(mockedFetch).toHaveBeenNthCalledWith(
      index + 1,
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})
