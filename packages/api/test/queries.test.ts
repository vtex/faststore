import { execute, parse } from 'graphql'

import type { Options } from '../src'
import { getSchema, getContextFactory } from '../src'
import {
  AllProductsQueryFirst5,
  productSearchPage1Count5Fetch,
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
} from '../mocks/SearchQuery'
import { salesChannelStaleFetch } from '../mocks/salesChannel'
import {
  shippingSimulationFetch,
  addressFetch,
  ShippingSimulationQueryResult,
} from '../mocks/ShippingQuery'
import {
  RedirectQueryTermTech,
  redirectTermTechFetch,
} from '../mocks/RedirectQuery'
import { SellersQueryResult, regionFetch } from '../mocks/SellersQuery'

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
  fetchAPI: (info: RequestInfo, init?: RequestInit) => mockedFetch(info, init),
}))

const run = createRunner()

// Always clear the mocked fetch before each test so we can count and validate
// the calls performed by each query independently.
beforeEach(() => {
  mockedFetch.mockClear()
})

test('`collection` query', async () => {
  const fetchAPICalls = [
    pageTypeDesksFetch,
    pageTypeOfficeFetch,
    pageTypeOfficeDesksFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(CollectionDesksQuery)

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
  const fetchAPICalls = [productSearchFetch, salesChannelStaleFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(ProductByIdQuery)

  expect(mockedFetch).toHaveBeenCalledTimes(2)

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

  const response = await run(AllCollectionsQueryFirst5)

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
  const fetchAPICalls = [productSearchPage1Count5Fetch, salesChannelStaleFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(AllProductsQueryFirst5)

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
    salesChannelStaleFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(SearchQueryFirst5Products)

  expect(mockedFetch).toHaveBeenCalledTimes(3)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})

test('`shipping` query', async () => {
  const fetchAPICalls = [addressFetch, shippingSimulationFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(ShippingSimulationQueryResult)

  expect(mockedFetch).toHaveBeenCalledTimes(2)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })

  expect(response).toMatchSnapshot()
})

test('`redirect` query', async () => {
  const fetchAPICalls = [redirectTermTechFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(RedirectQueryTermTech)

  expect(mockedFetch).toHaveBeenCalledTimes(1)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })
  expect(response).toMatchSnapshot()
})


test('`sellers` query', async () => {
  const fetchAPICalls = [regionFetch]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )

  const response = await run(SellersQueryResult)

  expect(mockedFetch).toHaveBeenCalledTimes(1)

  fetchAPICalls.forEach((fetchAPICall) => {
    expect(mockedFetch).toHaveBeenCalledWith(
      fetchAPICall.info,
      fetchAPICall.init
    )
  })
  expect(response).toMatchSnapshot()
})
