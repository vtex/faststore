import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Gift from './Gift'

describe('Gift', () => {
  it('should have `data-fs-gift` attribute', () => {
    const { getByTestId } = render(<Gift>Testing</Gift>)

    expect(getByTestId('store-gift')).toHaveAttribute('data-fs-gift')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Gift>Testing</Gift>)

      expect(await axe(getByTestId('store-gift'))).toHaveNoViolations()
    })
  })
})
