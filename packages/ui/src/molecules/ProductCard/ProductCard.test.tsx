import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import ProductCard from './ProductCard'
import ProductCardImage from './ProductCardImage'
import ProductCardContent from './ProductCardContent'
import ProductCardActions from './ProductCardActions'

const TestProductCard = () => {
  return (
    <ProductCard>
      <ProductCardImage>
        <div>An image</div>
      </ProductCardImage>
      <ProductCardContent>
        <h3>A title</h3>
        <p>A little text here: The quick brown fox jumps over the lazy dog.</p>
      </ProductCardContent>
      <ProductCardActions>
        <button>A button</button>
      </ProductCardActions>
    </ProductCard>
  )
}

describe('ProductCard', () => {
  let productCard: HTMLElement
  let productCardImage: HTMLElement
  let productCardContent: HTMLElement
  let productCardActions: HTMLElement
  let productCardContainer: HTMLElement

  beforeEach(() => {
    const { getByTestId, container } = render(<TestProductCard />)

    productCardContainer = container
    productCard = getByTestId('store-product-card')
    productCardImage = getByTestId('store-product-card-image')
    productCardContent = getByTestId('store-product-card-content')
    productCardActions = getByTestId('store-product-card-actions')
  })

  describe('Data attributes', () => {
    it('`ProductCard` component should have `data-store-product-card` attribute', () => {
      expect(productCard).toHaveAttribute('data-store-product-card')
    })

    it('`ProductCardContent` component should have `data-product-card-content` attribute', () => {
      expect(productCardContent).toHaveAttribute('data-product-card-content')
    })

    it('`ProductCardImage` component should have `data-product-card-image` attribute', () => {
      expect(productCardImage).toHaveAttribute('data-product-card-image')
    })

    it('`ProductCardActions` component should have `data-product-card-actions` attribute', () => {
      expect(productCardActions).toHaveAttribute('data-product-card-actions')
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(productCardContainer)).toHaveNoViolations()
    })
  })
})
