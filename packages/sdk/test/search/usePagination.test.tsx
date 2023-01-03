import { renderHook } from '@testing-library/react-hooks'
import React, { PropsWithChildren } from 'react'

import { initSearchState, SearchProvider, usePagination } from '../../src'

test('usePagination: paginates forwards', async () => {
  const totalItems = 20
  const { result } = renderHook(usePagination, {
    wrapper: ({ children }: PropsWithChildren<any>) => (
      <SearchProvider
        itemsPerPage={10}
        onChange={() => {}}
        {...initSearchState()}
      >
        {children}
      </SearchProvider>
    ),
    initialProps: totalItems,
  })

  expect(result.current.prev).toBe(false)
  expect(result.current.next).toEqual({
    cursor: 1,
    link: '/?sort=score_desc&page=1',
  })
})

test('usePagination: paginates backwards', async () => {
  const totalItems = 20
  const { result } = renderHook(usePagination, {
    wrapper: ({ children }: PropsWithChildren<any>) => (
      <SearchProvider
        itemsPerPage={10}
        onChange={() => {}}
        {...initSearchState()}
        page={1}
      >
        {children}
      </SearchProvider>
    ),
    initialProps: totalItems,
  })

  expect(result.current.next).toBe(false)
  expect(result.current.prev).toEqual({
    cursor: 0,
    link: '/?sort=score_desc&page=0',
  })
})
