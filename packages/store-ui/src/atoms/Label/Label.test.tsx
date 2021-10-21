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
      const { container: inputContainer } = render(
        <>
          <Label htmlFor="input_newsletter">Subscribe to our newsletter</Label>
          <input id="input_newsletter" />
        </>
      )

      expect(await axe(inputContainer)).toHaveNoViolations()

      const { container: selectContainer } = render(
        <>
          <Label htmlFor="interest">Select your main interest</Label>
          <select id="interest">
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="sale">Sale</option>
          </select>
        </>
      )

      expect(await axe(selectContainer)).toHaveNoViolations()
    })

    it('should have no violations when wrapping a control element and the labeling text', async () => {
      // Using input element
      const { container: inputContainer } = render(
        <Label>
          Subscribe to our newsletter
          <input />
        </Label>
      )

      expect(await axe(inputContainer)).toHaveNoViolations()

      // Using select element
      const { container: selectContainer } = render(
        <Label>
          Select your main interest
          <select id="interest">
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="sale">Sale</option>
          </select>
        </Label>
      )

      expect(await axe(selectContainer)).toHaveNoViolations()
    })
  })
})
