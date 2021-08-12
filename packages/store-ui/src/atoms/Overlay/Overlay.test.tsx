import React from 'react'
import { render } from '@testing-library/react'

import Overlay from './Overlay'

describe('Overlay', () => {
  const testId = 'store-overlay'

  it('data-store-overlay is present', () => {
    const { getByTestId } = render(<Overlay testId={testId} />)

    expect(getByTestId(testId)).toHaveAttribute('data-store-overlay')
  })
})
