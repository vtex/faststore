import { render } from '@testing-library/react'
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
}

describe('PriceRange', () => {
  it('`data-store-price-range` is present', () => {
    const { getByTestId } = render(<PriceRange {...props} />)

    expect(getByTestId('store-price-range')).toHaveAttribute(
      'data-store-price-range'
    )
  })
})
