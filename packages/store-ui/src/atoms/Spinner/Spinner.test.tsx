import { render } from '@testing-library/react'
import React from 'react'

import Spinner from './Spinner'

describe('Spinner', () => {
  it('`data-store-spinner` is present', () => {
    const { getByTestId } = render(<Spinner data-testid="store-spinner" />)

    expect(getByTestId('loading')).toHaveAttribute('data-store-spinner')
  })
})
