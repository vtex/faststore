import React from 'react'
import { render } from '@testing-library/react'

import Radio from './Radio'

describe('Radio', () => {
  it('data-store-radio is present', () => {
    const { getByTestId } = render(<Radio testId="store-radio" />)

    expect(getByTestId('store-radio')).toHaveAttribute('data-store-radio')
  })

  it('type radio is present', () => {
    const { getByTestId } = render(<Radio testId="store-radio" />)

    expect(getByTestId('store-radio')).toHaveAttribute('type', 'radio')
  })
})
