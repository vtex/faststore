import '@testing-library/jest-dom/vitest'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const buyOnClick = vi.hoisted(() => vi.fn())
const useBuyButtonMock = vi.hoisted(() => vi.fn())

vi.mock('src/sdk/cart/useBuyButton', () => ({
  useBuyButton: (...args: unknown[]) => {
    useBuyButtonMock(...args)
    return {
      onClick: buyOnClick,
      'data-testid': 'buy-button',
    }
  },
}))

const productCardProps = vi.hoisted(() => vi.fn())
vi.mock('src/components/product/ProductCard', () => ({
  default: (props: Record<string, unknown>) => {
    productCardProps(props)
    return React.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'product-card',
        onClick: props.onButtonClick as React.MouseEventHandler,
      },
      String(props.buttonLabel ?? '')
    )
  },
}))

import CartRecommendationProductCard from 'src/components/cart/CartRecommendationShelf/CartRecommendationProductCard'

const product = {
  id: 'p-1',
  sku: 'sku-1',
  gtin: 'gtin-1',
  brand: { name: 'Brand' },
  unitMultiplier: 1,
  additionalProperty: [],
  isVariantOf: {
    productGroupID: 'pg-1',
    name: 'Camera',
  },
  image: [{ url: 'https://example.com/cam.jpg', alternateName: 'Camera' }],
  offers: {
    lowPrice: 100,
    lowPriceWithTaxes: 110,
    offers: [
      {
        availability: 'https://schema.org/InStock',
        listPrice: 120,
        listPriceWithTaxes: 130,
        price: 100,
        priceWithTaxes: 110,
        seller: { identifier: '1' },
        priceToken: 'token',
        quantity: 1,
      },
    ],
  },
}

beforeEach(() => {
  buyOnClick.mockClear()
  useBuyButtonMock.mockClear()
  productCardProps.mockClear()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('CartRecommendationProductCard', () => {
  it('wires useBuyButton with the recommended SKU and keeps the drawer closed', () => {
    render(
      <CartRecommendationProductCard product={product as never} index={0} />
    )

    expect(useBuyButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'p-1',
        quantity: 1,
        price: 100,
        itemOffered: expect.objectContaining({
          sku: 'sku-1',
          name: 'Camera',
        }),
      }),
      false
    )
  })

  it('renders an add-to-cart action and forwards clicks to useBuyButton', () => {
    const { getByTestId, getByText } = render(
      <CartRecommendationProductCard product={product as never} index={0} />
    )

    expect(productCardProps).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonLabel: 'Add to cart',
        onButtonClick: expect.any(Function),
      })
    )
    expect(getByText('Add to cart')).toBeTruthy()

    fireEvent.click(getByTestId('product-card'))
    expect(buyOnClick).toHaveBeenCalledTimes(1)
  })

  it('allows overriding the button label', () => {
    const { getByText } = render(
      <CartRecommendationProductCard
        product={product as never}
        index={0}
        buttonLabel="Add"
      />
    )

    expect(getByText('Add')).toBeTruthy()
  })
})
