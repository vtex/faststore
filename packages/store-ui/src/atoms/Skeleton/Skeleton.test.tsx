import { render } from '@testing-library/react'
import React from 'react'

import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('`data-store-skeleton` is present', () => {
    const { getByTestId } = render(<Skeleton testId="store-skeleton" />)

    expect(getByTestId('store-skeleton')).toHaveAttribute('data-store-skeleton')
  })
})
