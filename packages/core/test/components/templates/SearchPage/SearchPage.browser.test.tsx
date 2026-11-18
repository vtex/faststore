/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const contexts: unknown[] = []
const pages = [{ search: {} }]

vi.mock('src/components/cms/RenderSections', () => ({
  __esModule: true,
  default: () => null,
}))

vi.mock('src/components/cms/search/Components', () => ({
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

import SearchPage from 'src/components/templates/SearchPage/SearchPage'

const page = { sections: [] } as never
const globalSettings = { foo: 'bar' }

describe('SearchPage page context', () => {
  beforeEach(() => {
    contexts.length = 0
  })

  it('keeps the context reference while its inputs are the same', async () => {
    const data = { title: 'Search', searchTerm: 'desk' } as never
    const { rerender } = render(
      <SearchPage page={page} data={data} globalSettings={globalSettings} />
    )

    await act(async () => {
      rerender(
        <SearchPage page={page} data={data} globalSettings={globalSettings} />
      )
    })

    expect(contexts).toHaveLength(2)
    expect(contexts[1]).toBe(contexts[0])
    expect(contexts[0]).toEqual({
      data: { title: 'Search', searchTerm: 'desk', pages },
      globalSettings,
    })
  })

  it('builds a new context when the data changes', async () => {
    const { rerender } = render(
      <SearchPage
        page={page}
        data={{ title: 'Search', searchTerm: 'desk' } as never}
        globalSettings={globalSettings}
      />
    )

    await act(async () => {
      rerender(
        <SearchPage
          page={page}
          data={{ title: 'Search', searchTerm: 'chair' } as never}
          globalSettings={globalSettings}
        />
      )
    })

    expect(contexts[1]).not.toBe(contexts[0])
    expect(contexts[1]).toMatchObject({ data: { searchTerm: 'chair' } })
  })
})
