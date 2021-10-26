import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Icon from './Icon'

const ShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

describe('Icon', () => {
  it('`data-store-icon` is present', () => {
    const { getByTestId } = render(
      <Icon data-testid="store-icon" component={<ShoppingCart />} />
    )

    expect(getByTestId('store-icon')).toHaveAttribute('data-store-icon')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { container } = render(
        <Icon data-testid="store-icon" component={<ShoppingCart />} />
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
