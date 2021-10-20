import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Form from './Form'

describe('Form', () => {
  it('should have `data-store-form` attribute', () => {
    const { getByTestId } = render(<Form />)

    expect(getByTestId('store-form')).toHaveAttribute('data-store-form')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Form />)

      expect(await axe(getByTestId('store-form'))).toHaveNoViolations()
    })
  })
})
