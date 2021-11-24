import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Banner from './Banner'

describe('Banner', () => {
  it('should have `data-store-banner` attribute', () => {
    const { getByTestId } = render(<Banner>Testing</Banner>)

    expect(getByTestId('store-banner')).toHaveAttribute('data-store-banner')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Banner>Testing</Banner>)

      expect(await axe(getByTestId('store-banner'))).toHaveNoViolations()
    })
  })
})
