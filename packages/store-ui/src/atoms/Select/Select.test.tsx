import { render } from '@testing-library/react'
import React from 'react'

import Select from '.'

describe('Select', () => {
  it('`data-store-select` is present', () => {
    const { getByTestId } = render(
      <Select>
        <option value="helloWorld"> Hello, World!</option>
      </Select>
    )

    expect(getByTestId('store-select')).toHaveAttribute('data-store-select')
  })
})
