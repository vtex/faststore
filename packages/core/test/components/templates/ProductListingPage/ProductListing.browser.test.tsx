/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const contexts: unknown[] = []
const pages = [{ search: {} }]
const useProductGalleryQuery = vi.fn()

vi.mock('next/router', () => ({
  useRouter: () => ({ isPreview: false }),
}))

vi.mock('@faststore/sdk', () => ({
  useSearch: () => ({
    state: { sort: 'score_desc', term: null, selectedFacets: [] },
    serializedState: () => ({}),
  }),
}))

vi.mock('src/components/cms/RenderSections', () => ({
  __esModule: true,
  default: () => null,
  LazyLoadingSection: () => null,
}))

vi.mock('src/components/cms/plp/Components', () => ({
  __esModule: true,
  default: {},
}))

vi.mock('src/sdk/overrides/PageProvider', () => ({
  __esModule: true,
  default: ({
    children,
    context,
  }: {
    children: React.ReactNode
    context: unknown
  }) => {
    contexts.push(context)
    return <>{children}</>
  },
}))

vi.mock('src/sdk/product/usePageProductsQuery', () => ({
  UseGalleryPageContext: React.createContext(null),
  useCreateUseGalleryPage: () => ({ pages, useGalleryPage: vi.fn() }),
}))

vi.mock('src/sdk/product/useProductGalleryQuery', () => ({
  useProductGalleryQuery: (...args: unknown[]) =>
    useProductGalleryQuery(...args),
}))

vi.mock('src/sdk/search/state', () => ({
  useApplySearchState: () => vi.fn(),
}))

vi.mock('src/server/content/utils', () => ({
  isContentPlatformSource: () => false,
}))

import ProductListing from 'src/components/templates/ProductListingPage/ProductListing'

const page = { sections: [], settings: {} } as never
const server = {
  collection: { seo: { title: 'Office' } },
  search: { products: { edges: [] } },
} as never
const globalSettings = { foo: 'bar' }

const renderListing = () => (
  <ProductListing
    page={page}
    data={server}
    serverManyProductsVariables={{} as never}
    globalSettings={globalSettings}
  />
)

describe('ProductListing page context', () => {
  beforeEach(() => {
    contexts.length = 0
    useProductGalleryQuery.mockReset()
  })

  it('keeps the context reference when the gallery data flips between undefined and null', async () => {
    useProductGalleryQuery.mockReturnValue({ data: undefined })
    const { rerender } = render(renderListing())

    useProductGalleryQuery.mockReturnValue({ data: null })
    await act(async () => {
      rerender(renderListing())
    })

    expect(contexts.length).toBeGreaterThan(1)
    expect(contexts.at(-1)).toBe(contexts[0])
    expect(contexts[0]).toMatchObject({
      data: { collection: { seo: { title: 'Office' } }, pages },
      globalSettings,
    })
  })

  it('merges new gallery data into a new context', async () => {
    useProductGalleryQuery.mockReturnValue({ data: undefined })
    const { rerender } = render(renderListing())

    const galleryData = { search: { products: { edges: [{ node: {} }] } } }
    useProductGalleryQuery.mockReturnValue({ data: galleryData })
    await act(async () => {
      rerender(renderListing())
    })

    expect(contexts.at(-1)).not.toBe(contexts[0])
    expect(contexts.at(-1)).toMatchObject({
      data: { search: { products: { edges: [{ node: {} }] } } },
    })
  })
})
