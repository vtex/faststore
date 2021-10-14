import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import PriceRange from './PriceRange'

function formatter(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const props = {
  formatter,
  min: 0,
  max: 100,
  ariaLabel: 'My price range',
}

describe('PriceRange', () => {
  it('`data-store-price-range` is present', () => {
    const { getByTestId } = render(<PriceRange {...props} />)

    expect(getByTestId('store-price-range')).toHaveAttribute(
      'data-store-price-range'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { container } = render(<PriceRange {...props} />)

      expect(await axe(container)).toHaveNoViolations()
    })

    it('check aria, role attributes', () => {
      const { getByTestId } = render(<PriceRange {...props} />)

      // check aria-valuemin, aria-valuemax
      expect(
        getByTestId('store-price-range').querySelectorAll('[aria-valuemin="0"]')
      ).toHaveLength(2)
      expect(
        getByTestId('store-price-range').querySelectorAll(
          '[aria-valuemax="100"]'
        )
      ).toHaveLength(2)

      expect(
        getByTestId('store-price-range').querySelector('[aria-valuenow="0"]')
      ).toBeInTheDOM()

      expect(
        getByTestId('store-price-range').querySelector('[aria-valuenow="100"]')
      ).toBeInTheDOM()

      // check role slider. input type=range has implicit role slider
      expect(
        getByTestId('store-price-range').querySelectorAll('input[type="range"]')
      ).toHaveLength(2)
    })
  })
})
