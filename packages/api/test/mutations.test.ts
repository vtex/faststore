import { execute, parse } from 'graphql'

import { salesChannelStaleFetch } from '../mocks/salesChannel'
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
import type { Options } from '../src'
import { getContextFactory, getSchema } from '../src'
import type { FetchAPI } from '../src/platforms/vtex/clients/fetch'

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
      {
        ...context,
        headers: { 'content-type': 'application/json', cookie: '' },
      },
      variables
    )
  }
}

function pickFetchAPICallResult(
  path: string,
  _: RequestInit | undefined,
  expectedFetchAPICalls: Array<
    Record<'path' | 'init' | 'options' | 'result', unknown>
  >
) {
  for (const call of expectedFetchAPICalls) {
    if (path === call.path) {
      return call.result
    }
  }

  throw new Error(
    `fetchAPI was called with an unexpected 'path' argument.\npath: ${path}`
  )
}

jest.mock('../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async ({ path, init, options }: FetchAPI) =>
    mockedFetch(path, init, options),
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

  mockedFetch.mockImplementation((path, init) =>
    pickFetchAPICallResult(path, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: ValidCart })

  expect(mockedFetch).toHaveBeenCalledTimes(3)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.path,
      fetchAPICall.init,
      fetchAPICall.options
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

  mockedFetch.mockImplementation((path, init) =>
    pickFetchAPICallResult(path, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  expect(mockedFetch).toHaveBeenCalledTimes(5)

  fetchAPICalls.forEach((fetchAPICall, index) => {
    expect(mockedFetch).toHaveBeenNthCalledWith(
      index + 1,
      fetchAPICall.path,
      fetchAPICall.init,
      fetchAPICall.options
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

  mockedFetch.mockImplementation((path, init) =>
    pickFetchAPICallResult(path, init, fetchAPICalls)
  )

  const response = await run(ValidateCartMutation, { cart: InvalidCart })

  expect(mockedFetch).toHaveBeenCalledTimes(4)

  fetchAPICalls.forEach((fetchAPICall, index) => {
    expect(mockedFetch).toHaveBeenNthCalledWith(
      index + 1,
      fetchAPICall.path,
      fetchAPICall.init,
      fetchAPICall.options
    )
  })

  expect(response).toMatchSnapshot()
})
