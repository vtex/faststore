/**
 * @jest-environment jsdom
 */

import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import SearchWrapper from 'src/components/templates/SearchPage/SearchWrapper'
import EmptySearch from 'src/components/templates/SearchPage/EmptySearch'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('@faststore/sdk', () => ({ useSearch: jest.fn() }), { virtual: true })
jest.mock('src/sdk/product/useProductGalleryQuery', () => ({
  useProductGalleryQuery: jest.fn(),
}))
jest.mock('discovery.config', () => ({
  experimental: { enableSearchSSR: false },
}))
jest.mock('src/components/cms/RenderSections', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('src/sdk/overrides/PageProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('src/components/templates/SearchPage/EmptySearch', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}))
jest.mock('src/components/templates/SearchPage/SearchPage', () => ({
  __esModule: true,
  default: () => null,
}))

const replace = jest.fn<Promise<boolean>, [string]>()
const router = { replace } as unknown as ReturnType<typeof useRouter>
const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean
}
const originalActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT

function setRedirect(url?: string) {
  jest.mocked(useProductGalleryQuery).mockReturnValue({
    data: {
      redirect: url ? { url } : null,
      search: { products: { pageInfo: { totalCount: 12 } } },
    },
  } as ReturnType<typeof useProductGalleryQuery>)
}

function pendingNavigation() {
  let resolve: (completed: boolean) => void
  let reject: (error: Error) => void
  const promise = new Promise<boolean>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve: resolve!, reject: reject! }
}

describe('SearchWrapper Intelligent Search redirect', () => {
  let root: Root
  let container: HTMLDivElement

  async function render() {
    await act(async () => {
      root.render(
        <SearchWrapper
          itemsPerPage={12}
          searchContentType={{} as never}
          serverData={{ searchTerm: 'tv' } as never}
        />
      )
    })
  }

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true
  })

  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
  })

  beforeEach(() => {
    jest.clearAllMocks()
    replace.mockReset().mockResolvedValue(true)
    jest.mocked(useRouter).mockReturnValue(router)
    jest.mocked(useSearch).mockReturnValue({
      state: { term: 'tv', sort: 'score_desc', selectedFacets: [] },
      pages: [0],
      resetInfiniteScroll: jest.fn(),
    } as unknown as ReturnType<typeof useSearch>)
    setRedirect('/s?q=televisao')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('redirects once after rendering, without shallow routing', async () => {
    jest.mocked(EmptySearch).mockImplementationOnce(() => {
      expect(replace).not.toHaveBeenCalled()
      return null
    })

    await render()

    expect(EmptySearch).toHaveBeenCalled()
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/s?q=televisao')
  })

  it('does not repeat a redirect on rerender, even if the router object changes', async () => {
    await render()
    await render()
    jest.mocked(useRouter).mockReturnValue({ ...router })
    await render()

    expect(replace).toHaveBeenCalledTimes(1)
  })

  it('does not redirect when results have no redirect', async () => {
    setRedirect()
    await render()

    expect(replace).not.toHaveBeenCalled()
  })

  it('does not redirect while gallery data is unavailable', async () => {
    jest.mocked(useProductGalleryQuery).mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useProductGalleryQuery>)
    await render()

    expect(replace).not.toHaveBeenCalled()
    expect(EmptySearch).toHaveBeenCalled()
  })

  it('redirects to the same URL again after a search without a redirect', async () => {
    await render()
    setRedirect()
    await render()
    setRedirect('/s?q=televisao')
    await render()

    expect(replace).toHaveBeenCalledTimes(2)
    expect(replace).toHaveBeenLastCalledWith('/s?q=televisao')
  })

  it('redirects when the destination changes', async () => {
    await render()
    setRedirect('/office')
    await render()

    expect(replace).toHaveBeenCalledTimes(2)
    expect(replace).toHaveBeenLastCalledWith('/office')
  })

  it.each(['rejected', 'cancelled'])(
    'releases a %s navigation for a later effect without an automatic retry',
    async (outcome) => {
      const navigation = pendingNavigation()
      replace.mockReturnValueOnce(navigation.promise)
      await render()

      await act(async () => {
        if (outcome === 'rejected') {
          navigation.reject(new Error('Failed to load target chunk'))
        } else {
          navigation.resolve(false)
        }
      })

      await render()
      expect(replace).toHaveBeenCalledTimes(1)

      // A changed dependency runs the effect again after the failed attempt.
      jest.mocked(useRouter).mockReturnValue({ ...router })
      await render()
      expect(replace).toHaveBeenCalledTimes(2)
    }
  )

  it.each(['/office', '/s?q=televisao'])(
    'does not let an older rejection clear a newer attempt to %s',
    async (destination) => {
      const oldNavigation = pendingNavigation()
      replace.mockReturnValueOnce(oldNavigation.promise)
      await render()
      setRedirect()
      await render()
      setRedirect(destination)
      await render()

      await act(async () => {
        oldNavigation.reject(new Error('Old navigation failed'))
      })
      jest.mocked(useRouter).mockReturnValue({ ...router })
      await render()

      expect(replace).toHaveBeenCalledTimes(2)
      expect(replace).toHaveBeenLastCalledWith(destination)
    }
  )
})
