import { render } from '@testing-library/react'
import React from 'react'

import Spinner from './Spinner'

describe('Spinner', () => {
  it('`data-fs-spinner` is present', () => {
    const { getByTestId } = render(<Spinner />)

    expect(getByTestId('store-spinner')).toHaveAttribute('data-fs-spinner')
  })
})
