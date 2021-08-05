import { render } from '@testing-library/react'
import React from 'react'

import Select from '.'

const optionsArray = [
  ['great', 'Great'],
  ['ok', 'Ok'],
  ['bad', 'Bad'],
]

describe('Select', () => {
  it('`data-store-select` is present', () => {
    const { getByTestId } = render(<Select options={optionsArray} />)

    expect(getByTestId('store-select')).toHaveAttribute('data-store-select')
  })
  it('Select is disabled', () => {
    const { getByTestId } = render(<Select options={optionsArray} disabled />)

    expect(getByTestId('store-select')).toBeDisabled()
  })
})
