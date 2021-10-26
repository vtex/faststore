import { render } from '@testing-library/react'
import React from 'react'

import LoadingButton from './LoadingButton'

describe('Loading Button', () => {
  it('`data-store-loading-button` is present', () => {
    const { getByTestId } = render(<LoadingButton loading />)

    expect(getByTestId('store-loading-button')).toHaveAttribute(
      'data-store-loading-button'
    )
  })
})
