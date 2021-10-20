import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Label from '.'

describe('Label', () => {
  it('`data-store-label` is present', () => {
    const { getByTestId } = render(<Label />)

    expect(getByTestId('store-label')).toHaveAttribute('data-store-label')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { container } = render(<Label>Label</Label>)

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations when using `for` attribute', async () => {
      const { container } = render(
        <>
          <Label htmlFor="subscribe_newsletter">
            Subscribe to our newsletter
          </Label>
          <input id="subscribe_newsletter" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations when wrapping the `input` element and the labeling text', async () => {
      const { container } = render(
        <Label>
          Subscribe to our newsletter
          <input />
        </Label>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
