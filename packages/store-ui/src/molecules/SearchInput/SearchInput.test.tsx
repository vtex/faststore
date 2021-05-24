import { render } from '@testing-library/react'
import React from 'react'

import type { SearchInputProps } from './SearchInput'
import SearchInput from './SearchInput'

const Wrapper = (props: Partial<SearchInputProps>) => (
  <SearchInput {...props} onSubmit={(value) => value} testId="search-input" />
)

describe('SearchInput', () => {
  it('`data-store-search-input` is present', () => {
    const { getByTestId } = render(<Wrapper />)

    expect(getByTestId('search-input')).toHaveAttribute(
      'data-store-search-input'
    )
  })
})
