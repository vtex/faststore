import { render } from '@testing-library/react'
import React from 'react'

import NumericInput from './NumericInput'

describe('NumericInput', () => {
  it('should have `data-store-numeric-input` attribute', () => {
    const { getByTestId } = render(<NumericInput />)

    expect(getByTestId('store-numeric-input')).toHaveAttribute(
      'data-store-numeric-input'
    )
  })

  it('should have `data-store-button="dec"` and `data-store-button="inc"` attributes', () => {
    const { queryAllByTestId } = render(<NumericInput />)

    const actionButtonElements = queryAllByTestId('store-button')

    expect(actionButtonElements).toHaveLength(2)

    expect(actionButtonElements[0]).toHaveAttribute('data-store-button', 'dec')
    expect(actionButtonElements[1]).toHaveAttribute('data-store-button', 'inc')
  })
})
