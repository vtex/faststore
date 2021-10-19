import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import type { SearchInputProps } from './SearchInput'
import SearchInput from './SearchInput'

const Wrapper = (otherProps: Partial<SearchInputProps>) => (
  <SearchInput
    {...otherProps}
    onSubmit={(value) => value}
    testId="search-input"
  />
)

describe('SearchInput', () => {
  it('`data-store-search-input` is present', () => {
    const { getByTestId } = render(<Wrapper />)

    expect(getByTestId('search-input')).toHaveAttribute(
      'data-store-search-input'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Wrapper />)

      expect(await axe(getByTestId('search-input'))).toHaveNoViolations()
    })
  })
})
