import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import CartItem, {
  CartItemActions,
  CartItemContent,
  CartItemImage,
  CartItemPrices,
  CartItemSummary,
  CartItemTitle,
} from './'

const product = {
  name: 'Apple Magic Mouse',
  imageUrl:
    'https://assets.vtex.app/unsafe/216x216/center/middle/https%3A%2F%2Fstoreframework.vtexassets.com%2Farquivos%2Fids%2F190902%2Funsplash-magic-mouse.jpg%3Fv%3D637800136963870000',
  price: {
    listing: 999,
    spot: 950,
  },
}

const CartItemTest = () => {
  return (
    <CartItem>
      <CartItemContent>
        <CartItemImage>
          <img alt={product.name} src={product.imageUrl} />
        </CartItemImage>

        <CartItemSummary>
          <CartItemTitle>{product.name}</CartItemTitle>

          <CartItemPrices>
            <span>{product.price.listing}</span>
            <span>{product.price.spot}</span>
          </CartItemPrices>
        </CartItemSummary>
      </CartItemContent>

      <CartItemActions>
        <button>Remove</button>

        <span>Quantity Selector</span>
      </CartItemActions>
    </CartItem>
  )
}

describe('`CartItem`', () => {
  describe('Data attributes', () => {
    it(`should have the correct format`, () => {
      const testIdToDataAttributeMap = {
        'store-cart-item': 'data-fs-cart-item',
        'store-cart-item-content': 'data-fs-cart-item-content',
        'store-cart-item-image': 'data-fs-cart-item-image',
        'store-cart-item-summary': 'data-fs-cart-item-summary',
        'store-cart-item-title': 'data-fs-cart-item-title',
        'store-cart-item-prices': 'data-fs-cart-item-prices',
        'store-cart-item-actions': 'data-fs-cart-item-actions',
      }
      const { getByTestId } = render(<CartItemTest />)

      for (const [testId, dataAttribute] of Object.entries(testIdToDataAttributeMap)) {
        expect(getByTestId(testId)).toHaveAttribute(dataAttribute)
      }
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<CartItemTest />)

      expect(await axe(getByTestId('store-cart-item'))).toHaveNoViolations()
      expect(await axe(getByTestId('store-cart-item'))).toHaveNoIncompletes()
    })
  })
})
