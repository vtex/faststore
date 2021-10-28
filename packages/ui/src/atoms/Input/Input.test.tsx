import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Input from '.'

describe('Input', () => {
  it('`data-store-input` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute(
      'data-store-input'
    )
  })

  it('`data-error` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" variant="error" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute('data-error')
  })

  it('`data-success` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" variant="success" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute('data-success')
  })

  describe('Accessibility', () => {
    it('should have no violations using aria-label', async () => {
      const { container } = render(
        <Input aria-label="label input for test" testId="store-input" />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">My test label</span>
          <Input aria-labelledby="label" testId="store-input" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using placeholder', async () => {
      const { container } = render(
        <Input placeholder="Accessibility placeholder" testId="store-input" />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using id with explicit label', async () => {
      const { container } = render(
        <>
          <label htmlFor="input">My test label</label>
          <Input id="input" testId="store-input" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
