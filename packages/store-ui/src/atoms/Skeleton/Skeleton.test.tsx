import { render } from '@testing-library/react'
import React from 'react'

import Skeleton from './Skeleton'

describe('Skeleton', () => {
  const { getByTestId } = render(<Skeleton testId="store-skeleton" />)
  const skeleton = getByTestId('store-skeleton')

  it('`data-store-skeleton-container` is present', () => {
    expect(skeleton).toHaveAttribute('data-store-skeleton-container')
  })

  it('`data-store-skeleton` is present', () => {
    expect(skeleton.firstChild).toHaveAttribute('data-store-skeleton')
  })
})
