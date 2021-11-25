import { render, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Alert from './Alert'

describe('Alert', () => {
  describe('Data attributes', () => {
    it('should have `data-store-alert` attribute', () => {
      const { getByTestId } = render(<Alert>Testing</Alert>)

      expect(getByTestId('store-alert')).toHaveAttribute('data-store-alert')
    })

    it('should have `data-alert-button` attribute when dismissible', () => {
      const { getByTestId } = render(<Alert dismissible>Testing</Alert>)

      expect(getByTestId('store-alert-button')).toHaveAttribute(
        'data-alert-button'
      )
    })
  })

  it('should render icon when the icon prop is present', () => {
    const { getByTestId } = render(
      <Alert icon={<div data-testid="icon">foo</div>}>Testing</Alert>
    )

    expect(getByTestId('icon')).toBeInTheDocument()
  })

  describe('User actions', () => {
    it('clicking close button should trigger `onClose` function', () => {
      const mockOnClose = jest.fn()
      const { getByTestId } = render(
        <Alert dismissible onClose={mockOnClose}>
          Testing
        </Alert>
      )

      const button = getByTestId('store-alert-button')

      fireEvent.click(button)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Alert dismissible />)

      expect(await axe(getByTestId('store-alert'))).toHaveNoViolations()
    })
  })
})
