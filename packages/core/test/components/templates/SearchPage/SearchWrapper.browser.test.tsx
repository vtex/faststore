/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const replace = vi.fn()
const resetInfiniteScroll = vi.fn()
const useProductGalleryQuery = vi.fn()

vi.mock('next/router', () => ({
  useRouter: () => ({ replace }),
}))

vi.mock('@faststore/sdk', () => ({
  useSearch: () => ({
    state: { term: 'refil', sort: 'score_desc', selectedFacets: [] },
    pages: [0],
    resetInfiniteScroll,
  }),
}))

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    experimental: { enableSearchSSR: false },
    seo: { search: { bodyH1: 'Showing results for:' } },
  },
}))

vi.mock('src/sdk/product/useProductGalleryQuery', () => ({
  useProductGalleryQuery: (...args: unknown[]) =>
    useProductGalleryQuery(...args),
}))

vi.mock('src/components/cms/RenderSections', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('src/sdk/overrides/PageProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('src/components/templates/SearchPage/EmptySearch', () => ({
  __esModule: true,
  default: () => <div data-testid="empty-search" />,
}))

vi.mock('src/components/templates/SearchPage/SearchPage', () => ({
  __esModule: true,
  default: () => <div data-testid="search-page" />,
}))

import SearchWrapper from 'src/components/templates/SearchPage/SearchWrapper'

describe('SearchWrapper Intelligent Search redirect', () => {
  beforeEach(() => {
    replace.mockClear()
    resetInfiniteScroll.mockClear()
  })

  it('calls router.replace once from an effect when redirect.url is present', async () => {
    useProductGalleryQuery.mockReturnValue({
      data: { redirect: { url: '/office' }, search: { products: null } },
    })

    await act(async () => {
      render(
        <SearchWrapper
          itemsPerPage={12}
          searchContentType={{} as never}
          serverData={{ searchTerm: 'refil' } as never}
        />
      )
    })

    await waitFor(() => {
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).toHaveBeenCalledWith('/office')
    })
  })

  it('does not call router.replace again for the same redirect url on rerender', async () => {
    useProductGalleryQuery.mockReturnValue({
      data: { redirect: { url: '/office' }, search: { products: null } },
    })

    const { rerender } = render(
      <SearchWrapper
        itemsPerPage={12}
        searchContentType={{} as never}
        serverData={{ searchTerm: 'refil' } as never}
      />
    )

    await waitFor(() => {
      expect(replace).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      rerender(
        <SearchWrapper
          itemsPerPage={12}
          searchContentType={{} as never}
          serverData={{ searchTerm: 'refil' } as never}
        />
      )
    })

    expect(replace).toHaveBeenCalledTimes(1)
  })

  it('does not redirect when there is no redirect url', async () => {
    useProductGalleryQuery.mockReturnValue({
      data: {
        redirect: null,
        search: { products: { pageInfo: { totalCount: 12 } } },
      },
    })

    await act(async () => {
      render(
        <SearchWrapper
          itemsPerPage={12}
          searchContentType={{} as never}
          serverData={{ searchTerm: 'desk' } as never}
        />
      )
    })

    expect(replace).not.toHaveBeenCalled()
  })
})
