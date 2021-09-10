import { render } from '@testing-library/react'
import React from 'react'

import NumberInput from './NumberInput'

describe('NumberInput', () => {
  it('should have `data-store-number-input` attribute', () => {
    const { getByTestId } = render(<NumberInput />)

    expect(getByTestId('store-number-input')).toHaveAttribute(
      'data-store-number-input'
    )
  })

  it('should have `data-store-button="dec"` and `data-store-button="inc"` attributes', () => {
    const { queryAllByTestId } = render(<NumberInput />)

    const actionButtonElements = queryAllByTestId('store-button')

    expect(actionButtonElements).toHaveLength(2)

    expect(actionButtonElements[0]).toHaveAttribute('data-store-button', 'dec')
    expect(actionButtonElements[1]).toHaveAttribute('data-store-button', 'inc')
  })
})
