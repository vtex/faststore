import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { CheckboxField } from '../../../src/index'

describe('CheckboxField', () => {
  it('renders all examples from the documentation', () => {
    render(<CheckboxField label="Default" id="checkboxfield-default" />)
    render(<CheckboxField label="Checked" id="checkboxfield-checked" checked />)
    render(
      <CheckboxField label="Disabled" id="checkboxfield-disabled" disabled />
    )
    render(
      <CheckboxField
        label="Checked & Partial"
        id="checkboxfield-checked-partial"
        checked
        partial
      />
    )
  })
})

describe('#checked', () => {
  it('should allow the checked property to be passed', () => {
    render(<CheckboxField id="identifier" label="Label" checked />)
    const input = screen.getByLabelText('Label') as HTMLInputElement

    expect(input.checked).toBe(true)
  })

  it('should not be checked if the `checked `prop is not passed', () => {
    render(<CheckboxField id="identifier" label="Label" />)
    const input = screen.getByLabelText('Label') as HTMLInputElement

    expect(input.checked).toBe(false)
  })
})
