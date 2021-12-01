import { render, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import ProductCard from './ProductCard'

const TestProductCard = () => {
  return (
    <ProductCard>
      <div role="button">a button</div>
    </ProductCard>
  )
}

describe('ProductCard', () => {
  let productCard: HTMLElement
  let productCardContainer: HTMLElement

  beforeEach(() => {
    const { getByTestId, container } = render(<TestProductCard />)

    productCard = getByTestId('store-product-card')
    productCardContainer = container
  })

  afterEach(cleanup)

  describe('Data attributes', () => {
    it('`ProductCard` component should have `data-store-product-card` attribute', () => {
      expect(productCard).toHaveAttribute('data-store-product-card')
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(productCardContainer)).toHaveNoViolations()
    })
  })
})
