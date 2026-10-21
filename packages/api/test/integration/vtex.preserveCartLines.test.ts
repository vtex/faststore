import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import type { Options } from '../../src/typings/globals'
import type { OrderFormItem } from '../../src/platforms/vtex/clients/commerce/types/OrderForm'
import {
  browserCart,
  browserLine,
  CART_ETAG_URL,
  freshOrderForm,
  ITEMS_URL,
  ORDER_FORM_URL,
  orderForm,
  orderFormItem,
  SKU,
  ValidateCartServicesMutation,
} from '../mocks/ValidateCartServices'
import { createProductFetchResultForSku } from '../mocks/ValidateCartMutation'

const mockedFetch = vi.fn()

vi.mock('../../src/platforms/vtex/clients/fetch.ts', () => ({
  fetchAPI: async (info: RequestInfo, init?: RequestInit) =>
    mockedFetch(info, init),
}))

beforeEach(() => {
  mockedFetch.mockReset()
})

const createRunner = async (preserveCartLines: boolean) => {
  const schemaPromise = GraphqlVtexSchema()
  const contextFactory = await GraphqlVtexContextFactory({
    platform: 'vtex',
    account: 'storeframework',
    environment: 'vtexcommercestable',
    channel: '{"salesChannel":"1"}',
    locale: 'en-US',
    subDomainPrefix: ['www'],
    hideUnavailableItems: false,
    showSponsored: false,
    incrementAddress: false,
    flags: { enableOrderFormSync: true, preserveCartLines },
  } as Options)

  return async (variables: Record<string, unknown>) =>
    execute({
      schema: await schemaPromise,
      document: parse(ValidateCartServicesMutation),
      rootValue: null,
      contextValue: {
        ...contextFactory({}),
        headers: {
          'content-type': 'application/json',
          cookie: 'checkout.vtex.com=__ofid=edbe3b03c8c94827a37ec5a6a4648fd2',
        },
      },
      variableValues: variables,
    })
}

type Patch = {
  orderItems: Array<{ id: string; index?: number; quantity: number }>
}

/** Mocks Checkout for one run; `afterItems` is what PATCH /items returns. */
const mockCheckout = (
  initial: ReturnType<typeof orderForm>,
  afterItems = initial
) => {
  const patches: Patch[] = []

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
      return afterItems
    }

    if (url.includes('/api/intelligent-search/v1/products?')) {
      return createProductFetchResultForSku(
        new URL(url).searchParams.get('value') ?? ''
      )
    }

    throw new Error(`Unexpected fetch: ${url}`)
  })

  return patches
}

const changes = (patch: Patch) =>
  patch.orderItems.map(({ id, index, quantity }) => ({ id, index, quantity }))

/** One unit of the SKU; `uniqueId` is what tells Checkout lines apart. */
const unit = (uniqueId: string, overrides: Partial<OrderFormItem> = {}) =>
  orderFormItem({ uniqueId, ...overrides })

/** Units split with Checkout's `/items/{uniqueId}/split`: no attachments yet. */
const manualSplit = () => [unit('u1'), unit('u2')]

/** qty 2 plus a service on one unit: Checkout splits off the serviced unit. */
const assemblySplit = () => [
  unit('u1'),
  unit('u2'),
  orderFormItem({
    uniqueId: 'u3',
    id: '290',
    parentItemIndex: 1,
    parentAssemblyBinding: 'ESP_optional_ESP',
  }),
]

const lineProperty = (uniqueId: string) => ({
  propertyID: `LINE:${uniqueId}`,
  name: 'line',
  value: uniqueId,
  valueReference: 'LINE',
})

/** Browser copy of a Checkout line, as FastStore returned it with the flag on. */
const browserUnit = (item: OrderFormItem, quantity = item.quantity) => ({
  ...browserLine({
    quantity,
    additionalProperty: [lineProperty(item.uniqueId)] as any,
  }),
  itemOffered: {
    ...browserLine().itemOffered,
    sku: item.id,
    additionalProperty: [lineProperty(item.uniqueId)],
  },
})

const acceptedOffer = (response: Awaited<ReturnType<typeof execute>>) =>
  (response.data?.validateCart as any)?.order?.acceptedOffer as any[]

describe('`validateCart` without `preserveCartLines` (default)', () => {
  test('still merges units of one SKU into a single line', async () => {
    const run = await createRunner(false)
    mockCheckout(orderForm(manualSplit(), ''))

    const response = await run({ cart: browserCart([]) })

    expect(response.errors).toBeUndefined()
    const offers = acceptedOffer(response)
    expect(offers).toHaveLength(1)
    expect(offers[0].quantity).toBe(2)
    expect(
      offers[0].itemOffered.additionalProperty.some(
        ({ valueReference }: any) => valueReference === 'LINE'
      )
    ).toBe(false)
  })

  test('collapses a manual split when the browser echoes it', async () => {
    const run = await createRunner(false)
    const patches = mockCheckout(freshOrderForm(manualSplit()))

    await run({ cart: browserCart([browserLine(), browserLine()]) })

    expect(changes(patches[0])).toEqual([
      { id: SKU, index: 0, quantity: 2 },
      { id: SKU, index: 1, quantity: 0 },
    ])
  })
})

describe('`validateCart` with `preserveCartLines`', () => {
  describe('manually split units without attachments', () => {
    test('returns each Checkout line as its own cart line', async () => {
      const run = await createRunner(true)
      mockCheckout(orderForm(manualSplit(), ''))

      const response = await run({ cart: browserCart([]) })

      expect(response.errors).toBeUndefined()
      const offers = acceptedOffer(response)
      expect(offers.map(({ quantity }) => quantity)).toEqual([1, 1])

      // The browser builds CartItem.id from additionalProperty[].propertyID,
      // so the units get different ids without client changes.
      const lineIds = offers.map(
        ({ itemOffered }) =>
          itemOffered.additionalProperty.find(
            ({ valueReference }: any) => valueReference === 'LINE'
          )?.propertyID
      )
      expect(lineIds).toEqual(['LINE:u1', 'LINE:u2'])
    })

    test('echoing the cart keeps both lines and reports it in sync', async () => {
      const run = await createRunner(true)
      const items = manualSplit()
      const patches = mockCheckout(freshOrderForm(items))

      const response = await run({
        cart: browserCart(items.map((item) => browserUnit(item))),
      })

      expect(response.errors).toBeUndefined()
      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 0, quantity: 1 },
        { id: SKU, index: 1, quantity: 1 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('a quantity edit changes only that unit', async () => {
      const run = await createRunner(true)
      const items = manualSplit()
      const patches = mockCheckout(
        freshOrderForm(items),
        freshOrderForm([items[0], unit('u2', { quantity: 3 })])
      )

      const response = await run({
        cart: browserCart([browserUnit(items[0]), browserUnit(items[1], 3)]),
      })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 0, quantity: 1 },
        { id: SKU, index: 1, quantity: 3 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('removing a unit removes only that line', async () => {
      const run = await createRunner(true)
      const items = manualSplit()
      const patches = mockCheckout(
        freshOrderForm(items),
        freshOrderForm([items[1]])
      )

      const response = await run({ cart: browserCart([browserUnit(items[1])]) })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 1, quantity: 1 },
        { id: SKU, index: 0, quantity: 0 },
      ])
      expect(response.data?.validateCart).toBeNull()
    })

    test('adding the SKU again from the PDP adds to the first unit, as without the flag', async () => {
      const run = await createRunner(true)
      const items = manualSplit()
      const patches = mockCheckout(freshOrderForm(items))

      await run({
        cart: browserCart([
          browserUnit(items[0]),
          browserUnit(items[1]),
          browserLine(),
        ]),
      })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 0, quantity: 2 },
        { id: SKU, index: 1, quantity: 1 },
      ])
    })

    test('never sends the line identity to Checkout', async () => {
      const run = await createRunner(true)
      const items = manualSplit()
      const patches = mockCheckout(freshOrderForm(items))

      await run({ cart: browserCart(items.map((item) => browserUnit(item))) })

      const body = JSON.stringify(patches[0])
      expect(body).not.toContain('LINE')
      expect(body).not.toContain('u1')
    })
  })

  describe('units split by assembly options', () => {
    test('the unit without services accepts quantity edits', async () => {
      const run = await createRunner(true)
      const items = assemblySplit()
      const patches = mockCheckout(freshOrderForm(items))

      await run({
        cart: browserCart([
          browserUnit(items[0], 2),
          browserUnit(items[1]),
          browserUnit(items[2]),
        ]),
      })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 0, quantity: 2 },
        { id: SKU, index: 1, quantity: 1 },
        { id: '290', index: 2, quantity: 1 },
      ])
    })

    test('removing the unit without services keeps the serviced unit and its service', async () => {
      const run = await createRunner(true)
      const items = assemblySplit()
      const patches = mockCheckout(freshOrderForm(items))

      await run({
        cart: browserCart([browserUnit(items[1]), browserUnit(items[2])]),
      })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: 1, quantity: 1 },
        { id: '290', index: 2, quantity: 1 },
        { id: SKU, index: 0, quantity: 0 },
      ])
    })

    test('a new unit is not folded into a serviced unit', async () => {
      const run = await createRunner(true)
      const items = [
        unit('u2'),
        orderFormItem({
          uniqueId: 'u3',
          id: '290',
          parentItemIndex: 0,
          parentAssemblyBinding: 'ESP_optional_ESP',
        }),
      ]
      const patches = mockCheckout(freshOrderForm(items))

      await run({
        cart: browserCart([
          browserUnit(items[0]),
          browserUnit(items[1]),
          browserLine(),
        ]),
      })

      expect(changes(patches[0])).toEqual([
        { id: SKU, index: undefined, quantity: 1 },
        { id: SKU, index: 0, quantity: 1 },
        { id: '290', index: 1, quantity: 1 },
      ])
    })
  })
})
