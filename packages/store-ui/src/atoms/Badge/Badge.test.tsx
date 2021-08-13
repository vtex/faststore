import React from 'react'
import { render } from '@testing-library/react'

import Badge from './Badge'

describe('Badge', () => {
  it('should have `data-store-badge` attribute', () => {
    const { getByText } = render(<Badge>-25%</Badge>)

    const renderedBadge = getByText('-25%')

    expect(renderedBadge).toHaveAttribute('data-store-badge')
  })
})
