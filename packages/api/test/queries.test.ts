import type { GraphQLSchema } from 'graphql'
import { execute, parse } from 'graphql'

import type { Options } from '../src'
import { getSchema, getContextFactory } from '../src'
import {
  AllProductsQueryFirst5,
  productSearchPage1Count5Fetch,
  checkoutSimulationFetch as allProductsCheckoutSimulationFetch,
} from '../mocks/AllProductsQuery'
import {
  CollectionDesksQuery,
  pageTypeDesksFetch,
  pageTypeOfficeDesksFetch,
  pageTypeOfficeFetch,
} from '../mocks/CollectionQuery'
import { ProductByIdQuery, productSearchFetch } from '../mocks/ProductQuery'
import {
  AllCollectionsQueryFirst5,
  catalogBrandListFetch,
  catalogCategory3Fetch,
  catalogPageTypeAcer,
  catalogPageTypeAdidas,
  catalogPageTypeBrand,
  catalogPageTypeIRobot,
  catalogPageTypeSkechers,
} from '../mocks/AllCollectionsQuery'
import {
  SearchQueryFirst5Products,
  productSearchCategory1Fetch,
  attributeSearchCategory1Fetch,
  checkoutSimulationFetch as searchCheckoutSimulationFetch,
} from '../mocks/SearchQuery'

let schema: GraphQLSchema
let context: Record<string, any>

const apiOptions = {
  platform: 'vtex',
  account: 'storeframework',
  environment: 'vtexcommercestable',
  channel: '{"salesChannel":"1"}',
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

test('`collection` query', async () => {
  const fetchAPICalls = [
    pageTypeDesksFetch,
    pageTypeOfficeFetch,
    pageTypeOfficeDesksFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(CollectionDesksQuery),
    null,
    context
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

test('`product` query', async () => {
  const fetchAPICalls = [productSearchFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(schema, parse(ProductByIdQuery), null, context)

  expect(mockedFetch).toHaveBeenCalledTimes(1)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})

test('`allCollections` query', async () => {
  const fetchAPICalls = [
    catalogBrandListFetch,
    catalogCategory3Fetch,
    catalogPageTypeSkechers,
    catalogPageTypeAdidas,
    catalogPageTypeAcer,
    catalogPageTypeIRobot,
    catalogPageTypeBrand,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(AllCollectionsQueryFirst5),
    null,
    context
  )

  expect(mockedFetch).toHaveBeenCalledTimes(7)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})

test('`allProducts` query', async () => {
  const fetchAPICalls = [
    productSearchPage1Count5Fetch,
    allProductsCheckoutSimulationFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(AllProductsQueryFirst5),
    null,
    context
  )

  expect(mockedFetch).toHaveBeenCalledTimes(2)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})

test('`search` query', async () => {
  const fetchAPICalls = [
    productSearchCategory1Fetch,
    attributeSearchCategory1Fetch,
    searchCheckoutSimulationFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await execute(
    schema,
    parse(SearchQueryFirst5Products),
    null,
    context
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
