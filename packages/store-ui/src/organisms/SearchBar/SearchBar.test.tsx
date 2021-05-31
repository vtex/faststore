import { render } from '@testing-library/react'
import React from 'react'

import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('`data-store-search-bar` is present', () => {
    const { getByTestId } = render(
      <SearchBar onSubmit={() => null}>Sugestions</SearchBar>
    )

    expect(getByTestId('store-search-bar')).toHaveAttribute(
      'data-store-search-bar'
    )
  })
})
