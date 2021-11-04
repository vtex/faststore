import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Radio from './Radio'

describe('Radio', () => {
  it('data-store-radio is present', () => {
    const { getByTestId } = render(<Radio testId="store-radio" />)

    expect(getByTestId('store-radio')).toHaveAttribute('data-store-radio')
  })

  it('type radio is present', () => {
    const { getByTestId } = render(<Radio testId="store-radio" />)

    expect(getByTestId('store-radio')).toHaveAttribute('type', 'radio')
  })

  describe('Accessibility', () => {
    it('should have no violations using aria-label', async () => {
      const { container } = render(
        <Radio aria-label="label radio for test" testId="store-radio" />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">My test label</span>
          <Radio aria-labelledby="label" testId="store-radio" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using placeholder', async () => {
      const { container } = render(
        <Radio placeholder="Accessibility placeholder" testId="store-radio" />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using id with explicit label', async () => {
      const { container } = render(
        <>
          <label htmlFor="radio">My test label</label>
          <Radio id="radio" testId="store-radio" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
