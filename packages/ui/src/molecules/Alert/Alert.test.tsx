import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

// import type { AlertProps } from '.'
import Alert from './Alert'

const TestAlert = () => <Alert>Testing</Alert>

describe('Alert', () => {
  it('should have `data-store-alert` attribute', () => {
    const { getByTestId } = render(<TestAlert />)

    expect(getByTestId('store-alert')).toHaveAttribute('data-store-alert')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<TestAlert />)

      expect(await axe(getByTestId('store-alert'))).toHaveNoViolations()
    })
  })
})
