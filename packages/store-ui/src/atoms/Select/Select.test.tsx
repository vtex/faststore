import { render } from '@testing-library/react'
import React from 'react'

import Select from '.'

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
})
