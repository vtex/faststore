import { afterEach, describe, expect, it, vi } from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/graphql/request', () => ({ request: mockRequest }))

import type { Cart } from '../../../src/sdk/cart'
import { validateCart } from '../../../src/sdk/cart'

afterEach(() => {
  vi.clearAllMocks()
})

describe('validateCart', () => {
  it('preserves root-level cart extension fields', async () => {
    mockRequest.mockResolvedValueOnce({
      validateCart: {
        total: 123,
        order: {
          orderNumber: 'cart-123',
          shouldSplitItem: false,
          acceptedOffer: [
            {
              quantity: 1,
              price: 123,
              priceWithTaxes: 123,
              listPrice: 123,
              listPriceWithTaxes: 123,
              isGift: false,
              priceToken: null,
              seller: { identifier: '1' },
              itemOffered: {
                sku: 'sku-123',
                additionalProperty: [],
              },
            },
          ],
        },
        messages: [],
      },
    })

    const cart = await validateCart({
      id: 'cart-123',
      items: [
        {
          id: 'sku-123::1',
          quantity: 1,
          price: 123,
          listPrice: 123,
          priceToken: null,
          seller: { identifier: '1' },
          itemOffered: {
            sku: 'sku-123',
            image: [],
            name: 'Product',
            additionalProperty: [],
          },
        },
      ],
    } as Cart)

    expect(cart).toMatchObject({
      id: 'cart-123',
      total: 123,
    })
    expect(cart).not.toHaveProperty('order')

    const variables = mockRequest.mock.calls[0][1]
    expect(variables.cart).not.toHaveProperty('total')
  })
})
