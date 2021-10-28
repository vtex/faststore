import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Checkbox from './Checkbox'

describe('Checkbox', () => {
  it('data-store-checkbox is present', () => {
    const { getByTestId } = render(<Checkbox testId="store-checkbox" />)

    expect(getByTestId('store-checkbox')).toHaveAttribute('data-store-checkbox')
  })

  it('type checkbox is present', () => {
    const { getByTestId } = render(<Checkbox testId="store-checkbox" />)

    expect(getByTestId('store-checkbox')).toHaveAttribute('type', 'checkbox')
  })

  describe('Accessibility', () => {
    it('should have no violations using aria-label', async () => {
      const { container } = render(
        <Checkbox
          aria-label="label checkbox for test"
          testId="store-checkbox"
        />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">My test label</span>
          <Checkbox aria-labelledby="label" testId="store-checkbox" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using placeholder', async () => {
      const { container } = render(
        <Checkbox
          placeholder="Accessibility placeholder"
          testId="store-checkbox"
        />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using id with explicit label', async () => {
      const { container } = render(
        <>
          <label htmlFor="checkbox">My test label</label>
          <Checkbox id="checkbox" testId="store-checkbox" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
