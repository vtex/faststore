import { execute, parse } from 'graphql'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { GraphqlVtexContextFactory, GraphqlVtexSchema } from '../../src'
import { NotFoundError } from '../../src/platforms/errors'
import type { OrderFormItem } from '../../src/platforms/vtex/clients/commerce/types/OrderForm'
import type { Options } from '../../src/typings/globals'
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

/** A service SKU sold as an assembly option and hidden from the storefront. */
const SERVICE_SKU = '290'

const ValidateCartMutation = `mutation ValidateCartMutation($cart: IStoreCart!) {
  validateCart(cart: $cart) {
    order {
      acceptedOffer {
        quantity
        price
        listPrice
        seller { identifier }
        itemOffered {
          sku
          name
          gtin
          unitMultiplier
          image { url alternateName }
          brand { name }
          isVariantOf {
            productGroupID
            name
            skuVariants { activeVariations slugsMap availableVariations }
          }
          additionalProperty { propertyID name value valueReference }
        }
      }
    }
  }
}`

const createRunner = async () => {
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
    flags: { enableOrderFormSync: true },
  } as Options)

  return async (variables: Record<string, unknown>) =>
    execute({
      schema: await schemaPromise,
      document: parse(ValidateCartMutation),
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

/**
 * Mocks Checkout and Intelligent Search. Search answers 404 (as the real
 * `fetchAPI` throws) for every SKU in `missingSkus`.
 */
const mockPlatform = (
  initial: ReturnType<typeof orderForm>,
  missingSkus: string[] = [SERVICE_SKU]
) => {
  const searchedSkus: string[] = []
  const etagWrites = { count: 0 }

  mockedFetch.mockImplementation((info) => {
    const url = String(info)

    if (url === ORDER_FORM_URL) {
      return initial
    }

    if (url === CART_ETAG_URL) {
      etagWrites.count += 1
      return initial
    }

    if (url === ITEMS_URL) {
      return initial
    }

    if (url.includes('/api/intelligent-search/v1/products?')) {
      const skuId = new URL(url).searchParams.get('value') ?? ''
      searchedSkus.push(skuId)

      if (missingSkus.includes(skuId)) {
        throw new NotFoundError(`Not Found: ${url}`)
      }

      return createProductFetchResultForSku(skuId)
    }

    throw new Error(`Unexpected fetch: ${url}`)
  })

  return { searchedSkus, etagWrites }
}

/** Appliance at index 0 with an assembly-option service as its child. */
const applianceWithService = (): OrderFormItem[] => [
  orderFormItem({ uniqueId: 'appliance' }),
  orderFormItem({
    uniqueId: 'service',
    id: SERVICE_SKU,
    productId: '224',
    name: '1 Year Extended Service Plan EW13IW1Y',
    skuName: 'EW13IW1Y',
    ean: '0000290',
    imageUrl:
      'http://storeframework.vteximg.com.br/arquivos/ids/155-55-55/esp.png?v=1',
    detailUrl: '/1-year-extended-service-plan/p',
    parentItemIndex: 0,
    parentAssemblyBinding: 'ESP_optional_ESP',
    additionalInfo: {
      brandName: 'Service Brand',
      brandId: '7',
      offeringInfo: null,
      offeringType: null,
      offeringTypeId: null,
    },
  } as Partial<OrderFormItem>),
]

const acceptedOffer = (response: Awaited<ReturnType<typeof execute>>) =>
  (response.data?.validateCart as any)?.order?.acceptedOffer as any[]

describe('`validateCart` with a cart SKU Intelligent Search does not return', () => {
  test('returns the cart, with the missing SKU built from the orderForm line', async () => {
    const run = await createRunner()
    const { searchedSkus } = mockPlatform(orderForm(applianceWithService(), ''))

    const response = await run({ cart: browserCart([]) })

    expect(response.errors).toBeUndefined()
    expect(searchedSkus.sort()).toEqual([SERVICE_SKU, SKU].sort())

    const [appliance, service] = acceptedOffer(response)

    // The SKU Search returns still uses Search data.
    expect(appliance.itemOffered.sku).toBe(SKU)
    expect(appliance.itemOffered.isVariantOf.productGroupID).toBe(
      `${SKU}-product`
    )

    // The missing SKU comes from the orderForm line Checkout returned.
    expect(service.quantity).toBe(1)
    expect(service.itemOffered).toEqual({
      sku: SERVICE_SKU,
      name: '1 Year Extended Service Plan EW13IW1Y',
      gtin: '0000290',
      unitMultiplier: 1,
      image: [
        {
          url: 'http://storeframework.vtexassets.com/arquivos/ids/155-55-55/esp.png?v=1',
          alternateName: '1 Year Extended Service Plan EW13IW1Y',
        },
      ],
      brand: { name: 'Service Brand' },
      isVariantOf: {
        productGroupID: '224',
        name: '1 Year Extended Service Plan EW13IW1Y',
        skuVariants: {
          activeVariations: {},
          slugsMap: {},
          availableVariations: {},
        },
      },
      additionalProperty: [],
    })
  })

  test('a browser cart in sync with Checkout validates to null', async () => {
    const run = await createRunner()
    const items = applianceWithService()
    mockPlatform(freshOrderForm(items))

    const response = await run({
      cart: browserCart([
        browserLine(),
        {
          ...browserLine(),
          itemOffered: { ...browserLine().itemOffered, sku: SERVICE_SKU },
        },
      ]),
    })

    expect(response.errors).toBeUndefined()
    expect(response.data?.validateCart).toBeNull()
  })

  test('a line without an image falls back to the default image', async () => {
    const run = await createRunner()
    const [appliance, service] = applianceWithService()
    mockPlatform(orderForm([appliance, { ...service, imageUrl: '' }], ''))

    const response = await run({ cart: browserCart([]) })

    expect(response.errors).toBeUndefined()
    const [, offer] = acceptedOffer(response)
    expect(offer.itemOffered.image).toHaveLength(1)
    expect(offer.itemOffered.image[0].url).toContain('storecomponents')
  })

  test('a missing SKU that is not an assembly child still fails, so Search outages stay visible', async () => {
    const run = await createRunner()
    // The Search client reports any failure (timeout, 5xx) as a missing SKU.
    mockPlatform(orderForm(applianceWithService(), ''), [SKU, SERVICE_SKU])

    const response = await run({ cart: browserCart([]) })

    expect(response.errors?.map(({ message }) => message)).toEqual([
      `Search API did not found the following skus: ${SKU}`,
    ])
  })

  test('a stale cart whose lines fail to load keeps its etag stale', async () => {
    const run = await createRunner()
    const { etagWrites } = mockPlatform(orderForm(applianceWithService(), ''), [
      SKU,
      SERVICE_SKU,
    ])

    const response = await run({ cart: browserCart([]) })

    expect(response.errors).toBeDefined()
    // A written etag would let the next validation apply the (empty) browser
    // cart over Checkout and wipe it.
    expect(etagWrites.count).toBe(0)
  })

  test('the SKUs Search returns keep working when several are missing', async () => {
    const run = await createRunner()
    const [appliance, service] = applianceWithService()
    const second = { ...service, uniqueId: 'service-2', id: '3600' }
    mockPlatform(orderForm([appliance, service, second], ''), [
      SERVICE_SKU,
      '3600',
    ])

    const response = await run({ cart: browserCart([]) })

    expect(response.errors).toBeUndefined()
    expect(
      acceptedOffer(response).map(({ itemOffered }) => itemOffered.sku)
    ).toEqual([SKU, SERVICE_SKU, '3600'])
  })
})
