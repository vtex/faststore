import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Badge from './Badge'

describe('Badge', () => {
  it('should have `data-store-badge` attribute', () => {
    const { getByText } = render(<Badge>-25%</Badge>)

    const renderedBadge = getByText('-25%')

    expect(renderedBadge).toHaveAttribute('data-store-badge')
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      const { container } = render(<Badge>-25%</Badge>)

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
