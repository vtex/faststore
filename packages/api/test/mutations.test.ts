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

const mockedFetch = jest.fn((..._) =>
  // eslint-disable-next-line no-console
  console.log(
    'fetch was called without a mocked implementation.\nThis could be caused by an extra fetch call being fired when a certain mutation was executed.'
  )
)

jest.mock('../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: (info: any, init?: any) => mockedFetch(info, init),
}))

beforeAll(async () => {
  schema = await getSchema(apiOptions)

  const contextFactory = getContextFactory(apiOptions)

  context = contextFactory({})
})

beforeEach(() => mockedFetch.mockClear())

test('`validateCart` mutation should return `null` when a valid cart is passed', async () => {
  mockedFetch
    .mockImplementationOnce(() => checkoutOrderFormValidFetch.result)
    .mockImplementationOnce(() => checkoutOrderFormItemsValidFetch.result)

  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: ValidCart }
  )

  expect(mockedFetch).toHaveBeenCalledTimes(2)
  expect(mockedFetch).toHaveBeenCalledWith(
    checkoutOrderFormValidFetch.info,
    checkoutOrderFormValidFetch.init
  )
  expect(mockedFetch).toHaveBeenCalledWith(
    checkoutOrderFormItemsValidFetch.info,
    checkoutOrderFormItemsValidFetch.init
  )

  expect(response).toEqual({ data: { validateCart: null } })
})

test('`validateCart` mutation should return the full order when an invalid cart is passed', async () => {
  mockedFetch
    .mockImplementationOnce(() => checkoutOrderFormInvalidFetch.result)
    .mockImplementationOnce(() => checkoutOrderFormItemsInvalidFetch.result)
    .mockImplementationOnce(() => productSearchPage1Count1Fetch.result)

  const response = await execute(
    schema,
    parse(ValidateCartMutation),
    null,
    context,
    { cart: InvalidCart }
  )

  expect(mockedFetch).toHaveBeenCalledTimes(3)
  expect(mockedFetch).toHaveBeenCalledWith(
    checkoutOrderFormInvalidFetch.info,
    checkoutOrderFormInvalidFetch.init
  )
  expect(mockedFetch).toHaveBeenCalledWith(
    checkoutOrderFormItemsInvalidFetch.info,
    checkoutOrderFormItemsInvalidFetch.init
  )
  expect(mockedFetch).toHaveBeenCalledWith(
    productSearchPage1Count1Fetch.info,
    productSearchPage1Count1Fetch.init
  )

  expect(response).toMatchSnapshot()
})
