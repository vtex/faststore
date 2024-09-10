import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

import React from 'react'

import { CheckboxField } from '../../../src/index'

expect.extend(toHaveNoViolations)

describe('CheckboxField', () => {
  it('renders the default state', () => {
    render(<CheckboxField label="Default" id="checkboxfield-default" />)

    const input = screen.getByLabelText('Default') as HTMLInputElement

    expect(input.checked).toBe(false)
  })

  it('renders the checked state', () => {
    render(<CheckboxField label="Checked" id="checkboxfield-checked" checked />)

    const input = screen.getByLabelText('Checked') as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it('renders the disabled state', () => {
    render(
      <CheckboxField label="Disabled" id="checkboxfield-disabled" disabled />
    )

    const input = screen.getByLabelText('Disabled') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('renders the checked/partial state', () => {
    render(
      <CheckboxField
        label="Checked & Partial"
        id="checkboxfield-checked-partial"
        checked
        partial
      />
    )

    const input = screen.getByLabelText('Checked & Partial') as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  describe('#checked', () => {
    it('should allow the checked property to be passed', () => {
      render(<CheckboxField id="identifier" label="Label" checked />)

      const input = screen.getByLabelText('Label') as HTMLInputElement
      expect(input.checked).toBe(true)
    })

    it('should not be checked if the `checked` prop is not passed', () => {
      render(<CheckboxField id="identifier" label="Label" />)

      const input = screen.getByLabelText('Label') as HTMLInputElement
      expect(input.checked).toBe(false)
    })
  })

  it('should not fail any accessibility tests', async () => {
    const { container } = render(
      <CheckboxField id="identifier" label="Label" />
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
