import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Select from './Select'

const optionsArray = [
  ['great', 'Great'],
  ['ok', 'Ok'],
  ['bad', 'Bad'],
]

const mapPairToOption = (value: string, label: string) => {
  return (
    <option key={value} value={value}>
      {label}
    </option>
  )
}

describe('Select', () => {
  it('`data-store-select` is present', () => {
    const { getByTestId } = render(
      <Select testId="store-select">
        {optionsArray.map(([value, label]) => {
          return mapPairToOption(value, label)
        })}
      </Select>
    )

    expect(getByTestId('store-select')).toHaveAttribute('data-store-select')
  })

  it('select is empty when no options are given', () => {
    const { getByTestId } = render(<Select testId="store-select" />)

    expect(getByTestId('store-select')).toBeEmptyDOMElement()
  })

  describe('Accessibility', () => {
    it('should have no violations using aria-label', async () => {
      const { container } = render(
        <Select aria-label="label select for test" testId="store-select" />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">My test label</span>
          <Select aria-labelledby="label" testId="store-select" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using id with explicit label', async () => {
      const { container } = render(
        <>
          <label htmlFor="select">My test label</label>
          <Select id="select" testId="store-select" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
