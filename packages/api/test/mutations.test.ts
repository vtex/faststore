import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import type { Options } from '../src'
import { getSchema, getContextFactory } from '../src'
import {
  ValidateCartMutation,
  InvalidCart,
  ValidCart,
  checkoutOrderFormItemsValidFetch,
  checkoutOrderFormValidFetch,
  checkoutOrderFormInvalidFetch,
  checkoutOrderFormItemsInvalidFetch,
  productSearchPage1Count1Fetch,
} from '../mocks/ValidateCartMutation'

let schema: GraphQLSchema
let context: Record<string, any>

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '1',
  hideUnavailableItems: false,
} as Options

const mockedFetch = jest.fn()

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
  fetchAPI: (info: RequestInfo, init?: RequestInit) => mockedFetch(info, init),
}))

beforeAll(async () => {
  schema = await getSchema(apiOptions)

  const contextFactory = getContextFactory(apiOptions)

  context = contextFactory({})
})

// Always clear the mocked fetch before each test so we can count and validate
// the calls performed by each query independently.
beforeEach(() => mockedFetch.mockClear())

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  const fetchAPICalls = [
    checkoutOrderFormValidFetch,
    checkoutOrderFormItemsValidFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: ValidCart }
  )

  expect(mockedFetch).toHaveBeenCalledTimes(2)

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
    productSearchPage1Count1Fetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: InvalidCart }
  )

  expect(mockedFetch).toHaveBeenCalledTimes(3)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})
