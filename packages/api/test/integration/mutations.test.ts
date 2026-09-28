import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import type { Options } from '../../src/typings/globals'
import type { OrderFormItem } from '../../src/platforms/vtex/clients/commerce/types/OrderForm'
import { serviceToPropertyValue } from '../../src/platforms/vtex/utils/propertyValue'
import {
  browserCart,
  browserLine,
  browserLineFor,
  CART_ETAG_URL,
  freshOrderForm,
  INSTALLATION_KEY,
  installationService,
  ITEMS_URL,
  legacyEtag,
  ORDER_FORM_URL,
  orderForm,
  orderFormItem,
  serviceAwareEtag,
  serviceKey,
  SERVICE_ID,
  SERVICE_NAME,
  SERVICE_PRICE,
  servicePropertyInput,
  SKU,
  ValidateCartServicesMutation,
} from '../mocks/ValidateCartServices'
import {
  InvalidCart,
  ValidCart,
  ValidateCartMutation,
  checkoutOrderFormCustomDataInvalidFetch,
  checkoutOrderFormCustomDataStaleFetch,
  checkoutOrderFormCustomDataValidFetch,
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
  const etagBodies: string[] = []

  mockedFetch.mockImplementation((info, init) => {
    const url = String(info)

    if (url.includes('/items?')) {
      return checkoutOrderFormValidFetch.result
    }

    if (url.includes('/customData/faststore/cartEtag')) {
      etagBodies.push(String(init?.body))
      return checkoutOrderFormCustomDataValidFetch.result
    }

    return pickFetchAPICallResult(info, init, [checkoutOrderFormValidFetch])
  })

  const response = await run(ValidateCartMutation, { cart: ValidCart })

  // When cart is valid and etag is up to date:
  // 1. GET orderForm (checkoutOrderFormValidFetch)
  // 2. PATCH items with the unchanged quantities
  // 3. PUT customData (refresh etag)
  expect(mockedFetch).toHaveBeenCalledTimes(3)

  // Carts without services must produce the exact same etag as before the
  // service-aware etag was introduced (value recorded from a live orderForm),
  // so deploying it causes no stale cycle for existing carts.
  expect(etagBodies).toEqual([checkoutOrderFormCustomDataValidFetch.init.body])

  expect(response.errors).toBeUndefined()
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

describe('`validateCart` with VTEX Services (orderForm `bundleItems`)', () => {
  type OrderFormFixture = ReturnType<typeof orderForm>
  type PatchBody = {
    orderItems: Array<{
      quantity: number
      seller: string
      id: string
      index?: number
      attachments: unknown[]
    }>
  }

  /**
   * Mocks Checkout for one `validateCart` run and records what was written.
   * `afterItems` is what Checkout returns from `PATCH /items` (defaults to the
   * initial orderForm, i.e. nothing changed).
   */
  const mockCheckout = (
    initial: OrderFormFixture,
    afterItems: OrderFormFixture = initial
  ) => {
    const patches: PatchBody[] = []
    const etags: string[] = []

    mockedFetch.mockImplementation((info, init) => {
      const url = String(info)

      if (url === ORDER_FORM_URL) {
        return initial
      }

      if (url === ITEMS_URL) {
        patches.push(JSON.parse(String(init?.body)))
        return afterItems
      }

      if (url === CART_ETAG_URL) {
        etags.push(JSON.parse(String(init?.body)).value)
        return afterItems
      }

      return pickFetchAPICallResult(info, init, [])
    })

    return { patches, etags }
  }

  type ResponseOffer = {
    price: number
    listPrice: number
    quantity: number
    seller: { identifier: string }
    itemOffered: {
      sku: string
      additionalProperty: Array<{
        propertyID: string
        name: string
        value: string
        valueReference: string
      }>
    }
  }

  const acceptedOffers = (response: Awaited<ReturnType<typeof execute>>) =>
    (response.data?.validateCart as any)?.order?.acceptedOffer as
      | ResponseOffer[]
      | undefined

  const serviceProperties = (offer: ResponseOffer) =>
    offer.itemOffered.additionalProperty.filter(
      (property) => property.valueReference === 'SERVICE'
    )

  const quantitiesByIndex = (patch: PatchBody) =>
    patch.orderItems.map(({ index, quantity }) => ({ index, quantity }))

  const unserviced = () => orderFormItem()
  const serviced = () => orderFormItem({ bundleItems: [installationService()] })

  describe('US-1: services survive cart validation', () => {
    test.each([
      ['service on the second line', [unserviced(), serviced()]],
      ['service on the first line', [serviced(), unserviced()]],
    ])(
      'unchanged cart, %s: keeps both lines at their quantity and returns null',
      async (_, items) => {
        const run = await createRunner()
        const { patches, etags } = mockCheckout(freshOrderForm(items))

        const response = await run(ValidateCartServicesMutation, {
          cart: browserCart(items.map(browserLineFor)),
        })

        expect(response.errors).toBeUndefined()
        // GET orderForm, PATCH items, PUT customData
        expect(mockedFetch).toHaveBeenCalledTimes(3)
        expect(patches).toHaveLength(1)
        expect(quantitiesByIndex(patches[0])).toEqual([
          { index: 0, quantity: 1 },
          { index: 1, quantity: 1 },
        ])
        expect(
          patches[0].orderItems.some(({ quantity }) => quantity === 0)
        ).toBe(false)
        expect(etags).toEqual([serviceAwareEtag(items)])
        expect(response.data?.validateCart).toBeNull()
      }
    )

    test('never sends services or offerings to Checkout', async () => {
      const run = await createRunner()
      const items = [unserviced(), serviced()]
      const { patches } = mockCheckout(freshOrderForm(items))

      await run(ValidateCartServicesMutation, {
        cart: browserCart(items.map(browserLineFor)),
      })

      expect(patches).toHaveLength(1)
      const body = JSON.stringify(patches[0])
      expect(body).not.toContain('bundleItems')
      expect(body).not.toContain('offerings')
      expect(body).not.toContain(SERVICE_NAME)
      expect(body).not.toContain(INSTALLATION_KEY)
      expect(
        patches[0].orderItems.every(
          ({ attachments }) => attachments.length === 0
        )
      ).toBe(true)
    })
  })

  describe('US-2: serviced and unserviced units are distinct cart lines', () => {
    test('exposes each service as a SERVICE property and round-trips the returned cart', async () => {
      const run = await createRunner()
      const items = [unserviced(), serviced()]
      // Stale path (etag missing) so the orderForm cart is returned as-is.
      const { patches } = mockCheckout(orderForm(items, ''))

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([]),
      })

      expect(response.errors).toBeUndefined()
      expect(patches).toHaveLength(0)

      const offers = acceptedOffers(response)
      expect(offers).toHaveLength(2)

      const [plain, withService] = offers!
      expect(plain.itemOffered.sku).toBe(SKU)
      expect(serviceProperties(plain)).toEqual([])

      expect(withService.itemOffered.sku).toBe(SKU)
      const [property, ...rest] = serviceProperties(withService)
      expect(rest).toEqual([])
      expect(property.propertyID).toBe(INSTALLATION_KEY)
      expect(property.name).toBe(SERVICE_NAME)
      expect(property.valueReference).toBe('SERVICE')
      expect(JSON.parse(property.value)).toEqual({
        id: SERVICE_ID,
        price: SERVICE_PRICE / 100,
        attachments: [],
      })

      // The line's own price excludes the service (as in Checkout).
      expect(withService.price).toBe(plain.price)

      // The browser builds CartItem.id from additionalProperty[].propertyID,
      // so the two lines get different ids without client changes (FR-10).
      const propertyIds = (offer: ResponseOffer) =>
        offer.itemOffered.additionalProperty.map((p) => p.propertyID).join('-')
      expect(propertyIds(plain)).not.toBe(propertyIds(withService))

      // Round trip: echo the returned cart back unchanged. Each browser line
      // must map to exactly one orderForm group and the cart must be in sync.
      mockedFetch.mockClear()
      const echoed = mockCheckout(freshOrderForm(items))

      const second = await run(ValidateCartServicesMutation, {
        cart: browserCart(
          offers!.map((offer) => ({
            price: offer.price,
            listPrice: offer.listPrice,
            seller: offer.seller,
            quantity: offer.quantity,
            itemOffered: {
              sku: offer.itemOffered.sku,
              image: [],
              name: SKU,
              additionalProperty: offer.itemOffered.additionalProperty,
            },
          }))
        ),
      })

      expect(second.errors).toBeUndefined()
      expect(echoed.patches).toHaveLength(1)
      expect(quantitiesByIndex(echoed.patches[0])).toEqual([
        { index: 0, quantity: 1 },
        { index: 1, quantity: 1 },
      ])
      expect(second.data?.validateCart).toBeNull()
    })
  })

  describe('US-3: quantity edits keep working', () => {
    const items = () => [unserviced(), serviced()]

    test('increasing the unserviced line only changes that index', async () => {
      const run = await createRunner()
      const initial = items()
      const updated = [orderFormItem({ quantity: 3 }), serviced()]
      const { patches } = mockCheckout(
        freshOrderForm(initial),
        freshOrderForm(updated)
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([
          browserLine({ quantity: 3 }),
          browserLineFor(initial[1]),
        ]),
      })

      expect(response.errors).toBeUndefined()
      expect(quantitiesByIndex(patches[0])).toEqual([
        { index: 0, quantity: 3 },
        { index: 1, quantity: 1 },
      ])
      // Checkout (mocked) applied exactly what was asked: cart is in sync.
      expect(response.data?.validateCart).toBeNull()
    })

    test('increasing the serviced line only changes that index', async () => {
      const run = await createRunner()
      const initial = items()
      const updated = [
        unserviced(),
        orderFormItem({ quantity: 2, bundleItems: [installationService()] }),
      ]
      const { patches } = mockCheckout(
        freshOrderForm(initial),
        freshOrderForm(updated)
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([
          browserLineFor(initial[0]),
          browserLine({ quantity: 2, services: [installationService()] }),
        ]),
      })

      expect(response.errors).toBeUndefined()
      expect(quantitiesByIndex(patches[0])).toEqual([
        { index: 0, quantity: 1 },
        { index: 1, quantity: 2 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('removing the serviced line sets only that index to 0', async () => {
      const run = await createRunner()
      const initial = items()
      const { patches } = mockCheckout(
        freshOrderForm(initial),
        freshOrderForm([unserviced()])
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([browserLineFor(initial[0])]),
      })

      expect(response.errors).toBeUndefined()
      expect(quantitiesByIndex(patches[0])).toEqual([
        { index: 0, quantity: 1 },
        { index: 1, quantity: 0 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })
  })

  describe('US-4: services changed outside FastStore are adopted, not overwritten', () => {
    test('legacy browser cart (pre-deploy) hits the stale path and gets the split cart', async () => {
      const run = await createRunner()
      const items = [unserviced(), serviced()]
      // Stored etag was computed by the previous algorithm (no services field).
      const { patches, etags } = mockCheckout(
        orderForm(items, legacyEtag(items))
      )

      const response = await run(ValidateCartServicesMutation, {
        // Old browser cart: one merged line, no SERVICE properties.
        cart: browserCart([browserLine({ quantity: 2 })]),
      })

      expect(response.errors).toBeUndefined()
      expect(patches).toHaveLength(0)
      expect(etags).toEqual([serviceAwareEtag(items)])

      const offers = acceptedOffers(response)
      expect(offers).toHaveLength(2)
      expect(offers!.map((offer) => serviceProperties(offer).length)).toEqual([
        0, 1,
      ])
    })

    test('service attached in Checkout without a split is adopted without an item update', async () => {
      const run = await createRunner()
      const before = [unserviced()]
      const after = [serviced()]
      // FastStore last wrote the etag when the line had no service.
      const { patches } = mockCheckout(
        orderForm(after, serviceAwareEtag(before))
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart(before.map(browserLineFor)),
      })

      expect(response.errors).toBeUndefined()
      expect(patches).toHaveLength(0)

      const offers = acceptedOffers(response)
      expect(offers).toHaveLength(1)
      expect(serviceProperties(offers![0]).map((p) => p.propertyID)).toEqual([
        INSTALLATION_KEY,
      ])
    })
  })

  describe('edge cases', () => {
    test('same SKU on two sellers: only the changed seller line is updated', async () => {
      const run = await createRunner()
      const initial = [
        orderFormItem({ seller: '1', bundleItems: [installationService()] }),
        orderFormItem({ seller: '2' }),
      ]
      const updated = [initial[0], orderFormItem({ seller: '2', quantity: 2 })]
      const { patches } = mockCheckout(
        freshOrderForm(initial),
        freshOrderForm(updated)
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([
          browserLineFor(initial[0]),
          browserLine({ seller: '2', quantity: 2 }),
        ]),
      })

      expect(response.errors).toBeUndefined()
      expect(
        patches[0].orderItems.map(({ index, seller, quantity }) => ({
          index,
          seller,
          quantity,
        }))
      ).toEqual([
        { index: 0, seller: '1', quantity: 1 },
        { index: 1, seller: '2', quantity: 2 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('same service with different service attachments stays as separate lines', async () => {
      const run = await createRunner()
      const giftMessage = (text: string) =>
        installationService({
          id: 'gift',
          name: 'Gift message',
          attachments: [{ name: 'message', content: { text } }],
        })
      const items = [
        orderFormItem({ bundleItems: [giftMessage('Feliz cumpleaños')] }),
        orderFormItem({ bundleItems: [giftMessage('Gracias')] }),
      ]
      const { patches } = mockCheckout(freshOrderForm(items))

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart(items.map(browserLineFor)),
      })

      expect(response.errors).toBeUndefined()
      expect(quantitiesByIndex(patches[0])).toEqual([
        { index: 0, quantity: 1 },
        { index: 1, quantity: 1 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('service key ignores the order of service attachments', () => {
      const a = { name: 'a', content: { v: '1' } }
      const b = { name: 'b', content: { v: '2' } }
      const productionKey = (
        id: string,
        attachments: Array<{ name: string; content: Record<string, string> }>
      ) =>
        serviceToPropertyValue({
          id,
          name: 'Sample service',
          quantity: 1,
          sellingPrice: 1,
          attachments,
        }).propertyID

      expect(serviceKey('gift', [a, b])).toBe(serviceKey('gift', [b, a]))
      expect(serviceKey('gift', [a])).not.toBe(serviceKey('gift', [b]))
      expect(serviceKey('gift')).not.toBe(serviceKey('other'))
      expect(serviceKey('gift', [a, b])).toBe(productionKey('gift', [a, b]))
      expect(serviceKey('gift', [b, a])).toBe(productionKey('gift', [b, a]))

      const textFirst = {
        name: 'message',
        content: { text: 'hi', from: 'a' },
      }
      const fromFirst = {
        name: 'message',
        content: { from: 'a', text: 'hi' },
      }

      expect(serviceKey('gift', [textFirst])).toBe(
        serviceKey('gift', [fromFirst])
      )
      expect(serviceKey('gift', [textFirst])).toBe(
        productionKey('gift', [fromFirst])
      )
    })

    test('browser line with a SERVICE property Checkout does not have is added without it', async () => {
      const run = await createRunner()
      const afterAdd = [unserviced()]
      const { patches } = mockCheckout(
        freshOrderForm([]),
        freshOrderForm(afterAdd)
      )

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([browserLine({ services: [installationService()] })]),
      })

      expect(response.errors).toBeUndefined()
      expect(patches).toHaveLength(1)
      expect(patches[0].orderItems).toEqual([
        { quantity: 1, seller: '1', id: SKU, attachments: [] },
      ])

      // The service segment differs, so the cart is NOT reported as in sync;
      // the browser receives the orderForm cart, which has no SERVICE property.
      const offers = acceptedOffers(response)
      expect(offers).toHaveLength(1)
      expect(serviceProperties(offers![0])).toEqual([])

      // The next validation, with the converged browser cart, returns null.
      mockedFetch.mockClear()
      const next = mockCheckout(freshOrderForm(afterAdd))
      const second = await run(ValidateCartServicesMutation, {
        cart: browserCart(afterAdd.map(browserLineFor)),
      })

      expect(second.errors).toBeUndefined()
      expect(quantitiesByIndex(next.patches[0])).toEqual([
        { index: 0, quantity: 1 },
      ])
      expect(second.data?.validateCart).toBeNull()
    })

    test('unreadable SERVICE value matches no orderForm service', async () => {
      const run = await createRunner()
      const items = [serviced()]
      const { patches } = mockCheckout(freshOrderForm(items))

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([
          browserLine({
            additionalProperty: [
              { ...servicePropertyInput(), value: 'not-json' },
            ],
          }),
        ]),
      })

      expect(response.errors).toBeUndefined()
      // Browser group is unknown → added; orderForm serviced group is absent
      // from the browser → deleted. Nothing is merged across service sets.
      expect(patches[0].orderItems).toEqual([
        { quantity: 1, seller: '1', id: SKU, attachments: [] },
        { quantity: 0, seller: '1', id: SKU, index: 0, attachments: [] },
      ])
    })

    test.each([
      ['null', { bundleItems: null }],
      ['missing', { bundleItems: undefined }],
    ])('`bundleItems` %s is treated as no services', async (_, overrides) => {
      const run = await createRunner()
      const item = orderFormItem(overrides as Partial<OrderFormItem>)
      if (overrides.bundleItems === undefined) {
        delete (item as Partial<OrderFormItem>).bundleItems
      }
      const items = [item]
      const { patches, etags } = mockCheckout(freshOrderForm(items))

      const response = await run(ValidateCartServicesMutation, {
        cart: browserCart([browserLine()]),
      })

      expect(response.errors).toBeUndefined()
      expect(quantitiesByIndex(patches[0])).toEqual([{ index: 0, quantity: 1 }])
      expect(etags).toEqual([legacyEtag(items)])
      expect(response.data?.validateCart).toBeNull()
    })
  })
})
