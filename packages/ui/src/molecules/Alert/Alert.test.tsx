import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Alert from './Alert'

describe('Alert', () => {
  describe('Data attributes', () => {
    it('should have `data-store-alert` attribute', () => {
      const { getByTestId } = render(<Alert>Testing</Alert>)

      expect(getByTestId('store-alert')).toHaveAttribute('data-store-alert')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Alert />)

      expect(await axe(getByTestId('store-alert'))).toHaveNoViolations()
    })
  })
})
