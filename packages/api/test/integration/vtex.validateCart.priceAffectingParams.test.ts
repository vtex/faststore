import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import type { Options } from '../../src/typings/globals'
import type { OrderForm } from '../../src/platforms/vtex/clients/commerce/types/OrderForm'
import { md5 } from '../../src/platforms/vtex/utils/md5'
import { salesChannelStaleFetch } from '../mocks/salesChannel'
import {
  InvalidCart,
  ValidCart,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormCustomDataValidFetch,
  checkoutOrderFormStaleFetch,
  checkoutOrderFormValidFetch,
  createProductFetchResultForSku,
  productSearchPage1Count1Fetch,
} from '../mocks/ValidateCartMutation'

const text = '{"b":1,"a":2}'

const declaringDocument = `mutation ValidateCartPriceAffectingParams($cart: IStoreCart!, $priceAffectingParams: String) {
  validateCart(cart: $cart, priceAffectingParams: $priceAffectingParams) {
    order {
      acceptedOffer {
        priceState {
          available
          reasonKey
          priceAffectingParams
        }
      }
    }
  }
}`

const omittingDocument = `mutation ValidateCartWithoutPriceAffectingParams($cart: IStoreCart!) {
  validateCart(cart: $cart) {
    order {
      acceptedOffer {
        priceState {
          available
          reasonKey
          priceAffectingParams
        }
      }
    }
  }
}`

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

const createRunner = async (overrides: Partial<Options> = {}) => {
  const schemaPromise = GraphqlVtexSchema()
  const contextFactory = await GraphqlVtexContextFactory({
    ...apiOptions,
    ...overrides,
  })

  return async (query: string, variables?: Record<string, unknown>) => {
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

beforeEach(() => {
  mockedFetch.mockClear()
})

const installStaleFetches = () => {
  const fetchAPICalls = [
    checkoutOrderFormStaleFetch,
    checkoutOrderFormCustomDataStaleFetch,
    productSearchPage1Count1Fetch,
    salesChannelStaleFetch,
  ]

  mockedFetch.mockImplementation((info, init) =>
    pickFetchAPICallResult(info, init, fetchAPICalls)
  )
}

const etagBodyFor = (form: OrderForm) => {
  const items = form.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    seller: item.seller,
    attachments: item.attachments,
  }))

  return JSON.stringify({
    value: md5(JSON.stringify({ sessionId: '', items })),
  })
}

const assertCartUrlsOmitTheString = (etagBody: string) => {
  const urls = mockedFetch.mock.calls.map(([url]) => String(url))

  for (const url of urls) {
    expect(url).not.toContain('priceAffectingParams')
  }

  const put = mockedFetch.mock.calls.find(([url]) =>
    String(url).includes('/customData/faststore/cartEtag')
  )

  expect(put).toBeDefined()
  expect(String(put?.[0])).toContain('/customData/faststore/cartEtag')
  expect(String(put?.[1]?.body)).toBe(etagBody)
  expect(String(put?.[1]?.body)).not.toContain(text)
}

const offersOf = (response: {
  data?: {
    validateCart?: {
      order?: {
        acceptedOffer?: Array<{
          priceState?: { priceAffectingParams?: string | null }
        }>
      } | null
    } | null
  } | null
  errors?: readonly unknown[]
}) => response.data?.validateCart?.order?.acceptedOffer ?? []

describe('validateCart priceAffectingParams', () => {
  it('echoes the string on each stale cart line and leaves the orderForm etag alone', async () => {
    const run = await createRunner()
    installStaleFetches()

    const response = await run(declaringDocument, {
      cart: InvalidCart,
      priceAffectingParams: text,
    })

    expect(response.errors).toBeUndefined()
    const offers = offersOf(response)
    expect(offers.length).toBeGreaterThan(0)

    for (const offer of offers) {
      expect(offer.priceState?.priceAffectingParams).toBe(text)
    }

    assertCartUrlsOmitTheString(
      etagBodyFor(checkoutOrderFormStaleFetch.result as OrderForm)
    )
  })

  it('returns null when the document omits the variable and when the value is null or empty', async () => {
    const run = await createRunner()

    installStaleFetches()
    const omitted = await run(omittingDocument, { cart: InvalidCart })
    expect(omitted.errors).toBeUndefined()
    expect(offersOf(omitted).length).toBeGreaterThan(0)
    for (const offer of offersOf(omitted)) {
      expect(offer.priceState?.priceAffectingParams).toBeNull()
    }
    assertCartUrlsOmitTheString(
      etagBodyFor(checkoutOrderFormStaleFetch.result as OrderForm)
    )

    mockedFetch.mockClear()
    installStaleFetches()
    const asNull = await run(declaringDocument, {
      cart: InvalidCart,
      priceAffectingParams: null,
    })
    expect(asNull.errors).toBeUndefined()
    for (const offer of offersOf(asNull)) {
      expect(offer.priceState?.priceAffectingParams).toBeNull()
    }
    assertCartUrlsOmitTheString(
      etagBodyFor(checkoutOrderFormStaleFetch.result as OrderForm)
    )

    mockedFetch.mockClear()
    installStaleFetches()
    const empty = await run(declaringDocument, {
      cart: InvalidCart,
      priceAffectingParams: '',
    })
    expect(empty.errors).toBeUndefined()
    for (const offer of offersOf(empty)) {
      expect(offer.priceState?.priceAffectingParams).toBeNull()
    }
    assertCartUrlsOmitTheString(
      etagBodyFor(checkoutOrderFormStaleFetch.result as OrderForm)
    )
  })

  it('still returns null for a valid cart when the string is sent', async () => {
    const run = await createRunner()

    mockedFetch.mockImplementation((info, init) => {
      const url = String(info)

      if (url.includes('/items?')) {
        return checkoutOrderFormValidFetch.result
      }

      if (url.includes('/customData/faststore/cartEtag')) {
        return checkoutOrderFormCustomDataValidFetch.result
      }

      return pickFetchAPICallResult(info, init, [checkoutOrderFormValidFetch])
    })

    const response = await run(declaringDocument, {
      cart: ValidCart,
      priceAffectingParams: text,
    })

    expect(response.errors).toBeUndefined()
    expect(response.data?.validateCart).toBeNull()
    assertCartUrlsOmitTheString(checkoutOrderFormCustomDataValidFetch.init.body)
  })
})
