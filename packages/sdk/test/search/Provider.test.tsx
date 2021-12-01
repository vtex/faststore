/* eslint-disable react/display-name */
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { initSearchState, SearchProvider, useSearch } from '../../src'
import { SDKError } from '../../src/utils/error'

function Wrapper(
  props: Partial<ComponentPropsWithoutRef<typeof SearchProvider>>
) {
  return (
    <SearchProvider
      itemsPerPage={12}
      onChange={() => {}}
      {...initSearchState()}
      {...props}
    />
  )
}

test('SearchProvider: change sort ordering', async () => {
  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.sort).toBe('score_desc')

  act(() => result.current.setSort('name_asc'))

  expect(result.current.state.sort).toBe('name_asc')

  act(() => result.current.setSort('NotAValidSortValue' as any))

  expect(result.error).toBeInstanceOf(SDKError)
})

test('SearchProvider: Set full text term', async () => {
  const fullTextTerm = 'Full Text Term'
  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.term).toBeNull()

  act(() => result.current.setTerm(fullTextTerm))

  expect(result.current.state.term).toBe(fullTextTerm)

  act(() => result.current.setTerm(null))

  expect(result.current.state.term).toBeNull()
})

test('SearchProvider: Set current page', async () => {
  const page = 10
  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.page).toBe(0)

  act(() => result.current.setPage(page))

  expect(result.current.state.page).toBe(page)
})

test('SearchProvider: Select a facet', async () => {
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.setFacet(facet1))
  expect(result.current.state.selectedFacets).toEqual([facet1])

  act(() => result.current.setFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])

  act(() => result.current.setFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2, facet2])
})

test('SearchProvider: Facet uniqueness', async () => {
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.setFacet(facet1))
  expect(result.current.state.selectedFacets).toEqual([facet1])

  act(() => result.current.setFacet(facet2, true))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])

  act(() => result.current.setFacet(facet2, true))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])
})

test('SearchProvider: Remove facet selection', async () => {
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.setFacet(facet1))
  act(() => result.current.setFacet(facet2))
  act(() => result.current.setFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2, facet2])

  act(() => result.current.removeFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])
})

test('SearchProvider: Remove initial facet', async () => {
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.setFacet(facet1))
  act(() => result.current.setFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])

  /** Cannot remove the first facet */
  act(() => result.current.removeFacet(facet1))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])
})

test('SearchProvider: Toggle Facet', async () => {
  const facet1 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const facet3 = {
    key: 'category',
    value: 'more awesomeness',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.toggleFacet(facet1))
  act(() => result.current.toggleFacet(facet2))
  act(() => result.current.toggleFacet(facet3))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2, facet3])

  /** Cannot remove the first facet */
  act(() => result.current.toggleFacet(facet1))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2, facet3])

  act(() => result.current.toggleFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet3])

  act(() => result.current.toggleFacet(facet2))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet3, facet2])
})

test('SearchProvider: Toggle Facets', async () => {
  const facet1 = {
    key: 'category',
    value: 'awesome',
  }

  const facet2 = {
    key: 'priceRange',
    value: '10-to-100',
  }

  const facet3 = {
    key: 'priceRange',
    value: '50-to-60',
  }

  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.toggleFacets([facet1, facet2]))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])

  act(() => result.current.toggleFacets([facet2, facet3]))
  expect(result.current.state.selectedFacets).toEqual([facet1, facet3])
})

test('SearchProvider: Infinite Scroll Pagination', async () => {
  const { result } = renderHook(useSearch, {
    wrapper: Wrapper,
  })

  expect(result.current.pages).toEqual([0])

  act(() => result.current.addNextPage())
  expect(result.current.pages).toEqual([0, 1])

  act(() => result.current.addPrevPage())
  expect(result.current.pages).toEqual([-1, 0, 1])
})

test('SearchProvider: onChange is called', async () => {
  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => <Wrapper {...props} onChange={mock} />,
  })

  expect(mock).toHaveBeenCalledTimes(1)

  act(() => result.current.setSort('name_asc'))
  act(() => result.current.setFacet({ key: 'size', value: 'xm' }))
  act(() => result.current.setPage(10))
  expect(mock).toHaveBeenCalledTimes(4)
})
