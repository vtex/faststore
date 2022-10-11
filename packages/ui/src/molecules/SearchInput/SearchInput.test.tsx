import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import type { SearchInputProps } from './SearchInput'
import SearchInput from './SearchInput'

const Wrapper = (props: Partial<SearchInputProps>) => (
  <SearchInput testId="search-input" onSubmit={(value) => value} {...props} />
)

describe('SearchInput', () => {
  it('`data-fs-search-input-form` is present', () => {
    const { getByTestId } = render(<Wrapper />)

    expect(getByTestId('search-input')).toHaveAttribute(
      'data-fs-search-input-form'
    )
  })

  it('`data-fs-search-input` is present and applied to `Input`', () => {
    const { getByTestId } = render(<Wrapper data-fs-search-input />)

    expect(getByTestId('store-input')).toHaveAttribute('data-fs-search-input')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Wrapper />)

      expect(await axe(getByTestId('search-input'))).toHaveNoViolations()
    })
  })
})
