import { render } from '@testing-library/react'
import React from 'react'

import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('`data-fs-skeleton` is present', () => {
    const { getByTestId } = render(<Skeleton testId="store-skeleton" />)
    const skeleton = getByTestId('store-skeleton')

    expect(skeleton).toHaveAttribute('data-fs-skeleton')
  })
})
