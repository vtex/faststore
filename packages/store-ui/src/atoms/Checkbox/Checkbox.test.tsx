import React from 'react'
import { render } from '@testing-library/react'

import Checkbox from './Checkbox'

describe('Checkbox', () => {
  it('data-store-checkbox is present', () => {
    const { getByTestId } = render(<Checkbox testId="checkbox" />)

    expect(getByTestId('checkbox')).toHaveAttribute('data-store-checkbox')
  })

  it('type checkbox is present', () => {
    const { getByTestId } = render(<Checkbox testId="checkbox" />)

    expect(getByTestId('checkbox')).toHaveAttribute('type', 'checkbox')
  })
})
