/* eslint-disable react/display-name */
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import {
  formatSearchState,
  initSearchState,
  SearchProvider,
  useSearch,
} from '../../src'

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
  const state = initSearchState()
  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  expect(result.current.state.sort).toBe('score_desc')

  act(() => result.current.setSort('name_asc'))

  expect(mock).toBeCalledWith(formatSearchState({ ...state, sort: 'name_asc' }))
})

test('SearchProvider: Set full text term', async () => {
  const fullTextTerm = 'Full Text Term'
  const state = initSearchState()
  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  expect(result.current.state.term).toBeNull()

  act(() => result.current.setTerm(null))
  expect(mock).not.toHaveBeenCalled()

  act(() => result.current.setTerm(fullTextTerm))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, term: fullTextTerm })
  )
})

test('SearchProvider: Set current page', async () => {
  const page = 10
  const state = initSearchState()
  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  expect(result.current.state.page).toBe(0)

  act(() => result.current.setPage(page))
  expect(mock).toBeCalledWith(formatSearchState({ ...state, page }))
})

test('SearchProvider: selects a simple faect', async () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const mock = jest.fn(() => {})
  const state = initSearchState()
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  expect(result.current.state.selectedFacets).toHaveLength(0)

  act(() => result.current.setFacet(facet1))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1] })
  )
})

test('SearchProvider: selects a simple facet when more facets are inside the state', () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const mock = jest.fn(() => {})
  const state = initSearchState({
    selectedFacets: [facet1],
  })

  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  act(() => result.current.setFacet(facet2))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1, facet2] })
  )
})

test('SearchProvider: Facet uniqueness', async () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const state = initSearchState({
    selectedFacets: [facet2],
  })

  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  act(() => result.current.setFacet(facet2, true))
  expect(mock).not.toHaveBeenCalled()

  act(() => result.current.setFacet(facet1))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet2, facet1] })
  )
})

test('SearchProvider: Remove facet selection', async () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const state = initSearchState({
    selectedFacets: [facet1, facet2, facet2],
  })

  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  act(() => result.current.removeFacet(facet2))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1, facet2] })
  )
})

test('SearchProvider: Remove initial facet', async () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const state = initSearchState({
    selectedFacets: [facet1, facet2],
  })

  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  /** Cannot remove the first facet */
  act(() => result.current.removeFacet(facet1))
  expect(mock).not.toHaveBeenCalled()
})

test('SearchProvider: Toggle Facet', async () => {
  const facet1 = {
    key: 'price',
    value: '10:100',
  }

  const facet2 = {
    key: 'category',
    value: 'awesome',
  }

  const facet3 = {
    key: 'category',
    value: 'more awesomeness',
  }

  const state = initSearchState({
    selectedFacets: [facet1, facet2],
  })

  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  expect(result.current.state.selectedFacets).toEqual([facet1, facet2])

  /** Cannot remove the first facet */
  act(() => result.current.toggleFacet(facet1))
  expect(mock).not.toHaveBeenCalled()

  act(() => result.current.toggleFacet(facet2))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1] })
  )

  act(() => result.current.toggleFacet(facet3))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1, facet2, facet3] })
  )
})

test('SearchProvider: Toggle Facets', async () => {
  const facet1 = {
    key: 'category',
    value: 'awesome',
  }

  const facet2 = {
    key: 'price',
    value: '10:100',
  }

  const facet3 = {
    key: 'price',
    value: '50:60',
  }

  const state = initSearchState({
    selectedFacets: [facet1, facet2, facet3],
  })

  const mock = jest.fn(() => {})
  const { result } = renderHook(useSearch, {
    wrapper: ({ ...props }) => (
      <Wrapper {...props} onChange={mock} {...state} />
    ),
  })

  act(() => result.current.toggleFacets([facet2, facet3]))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1] })
  )

  act(() => result.current.toggleFacets([facet1, facet2]))
  expect(mock).toBeCalledWith(
    formatSearchState({ ...state, selectedFacets: [facet1] })
  )
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

  expect(mock).toHaveBeenCalledTimes(0)

  act(() => result.current.setSort('name_asc'))
  act(() => result.current.setFacet({ key: 'size', value: 'xm' }))
  act(() => result.current.setPage(10))
  expect(mock).toHaveBeenCalledTimes(3)
})
