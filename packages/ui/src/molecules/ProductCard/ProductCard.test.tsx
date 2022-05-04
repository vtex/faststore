import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import ProductCard from './ProductCard'

describe('ProductCard', () => {
  it('should have `data-store-product-card` attribute', () => {
    const { getByTestId } = render(<ProductCard>Testing</ProductCard>)

    expect(getByTestId('store-product-card')).toHaveAttribute(
      'data-store-product-card'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<ProductCard>Testing</ProductCard>)

      expect(await axe(getByTestId('store-product-card'))).toHaveNoViolations()
    })
  })
})
