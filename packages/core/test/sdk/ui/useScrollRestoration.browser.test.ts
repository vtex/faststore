/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const resetInfiniteScroll = vi.fn()
const routerEvents = {
  on: vi.fn(),
  off: vi.fn(),
}
const beforePopState = vi.fn()

vi.mock('next/router', () => ({
  useRouter: () => ({
    beforePopState,
    events: routerEvents,
  }),
}))

vi.mock('@faststore/sdk', () => ({
  useSearch: () => ({
    resetInfiniteScroll,
  }),
}))

import useScrollRestoration, {
  scrollRestorationTestUtils,
} from '../../../src/sdk/ui/useScrollRestoration'

const {
  SCROLL_STORAGE_PREFIX,
  PENDING_RESTORE_FLAG,
  RESTORING_SCROLL_CLASS,
  destinationPathname,
  findAnchorCard,
  normalizePath,
  pathMatchesAnchor,
  reset,
} = scrollRestorationTestUtils

function getRouteHandler(event: string) {
  const call = routerEvents.on.mock.calls.find(([name]) => name === event)
  return call?.[1] as ((...args: unknown[]) => void) | undefined
}

describe('scrollRestorationTestUtils (pure helpers)', () => {
  it('normalizes paths by dropping query and trailing slash', () => {
    expect(normalizePath('/office/?x=1')).toBe('/office')
    expect(normalizePath('/office/')).toBe('/office')
  })

  it('matches product hrefs to saved anchors', () => {
    expect(pathMatchesAnchor('/cool-product/p', '/cool-product/p')).toBe(true)
    expect(
      pathMatchesAnchor('https://example.com/cool-product/p', '/cool-product/p')
    ).toBe(true)
    expect(pathMatchesAnchor('/other/p', '/cool-product/p')).toBe(false)
  })

  it('parses destination pathnames from relative and absolute urls', () => {
    expect(destinationPathname('/office')).toBe('/office')
    expect(destinationPathname('https://example.com/s?q=refil')).toBe('/s')
    expect(destinationPathname('not a url')).toBe('not a url')
  })

  it('finds the product card for a PDP anchor', () => {
    document.body.innerHTML = `
      <div data-fs-product-card>
        <a data-testid="product-link" href="/sku-a/p">Product A</a>
      </div>
      <a href="/sku-b/p">Loose link</a>
    `

    const card = findAnchorCard('/sku-a/p')
    expect(card?.getAttribute('data-fs-product-card')).toBe('')

    const loose = findAnchorCard('/sku-b/p')
    expect(loose?.getAttribute('href')).toBe('/sku-b/p')

    expect(findAnchorCard('/missing/p')).toBeNull()
  })
})

describe('useScrollRestoration', () => {
  beforeEach(() => {
    reset()
    resetInfiniteScroll.mockClear()
    routerEvents.on.mockClear()
    routerEvents.off.mockClear()
    beforePopState.mockClear()
    sessionStorage.clear()
    document.body.innerHTML = ''
    document.documentElement.classList.remove(RESTORING_SCROLL_CLASS)

    Object.defineProperty(window, 'scrollX', {
      configurable: true,
      value: 0,
      writable: true,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 1200,
      writable: true,
    })
    window.scrollTo = vi.fn()
    window.history.replaceState({ key: 'plp-key' }, '', '/office')
  })

  afterEach(() => {
    reset()
    vi.clearAllMocks()
  })

  it('sets manual scroll restoration and wires router listeners', () => {
    renderHook(() => useScrollRestoration())

    expect(window.history.scrollRestoration).toBe('manual')
    expect(beforePopState).toHaveBeenCalled()
    expect(routerEvents.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    )
    expect(routerEvents.on).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function)
    )
    expect(routerEvents.on).toHaveBeenCalledWith(
      'routeChangeError',
      expect.any(Function)
    )
  })

  it('saves scroll position and PDP anchor on product link click', () => {
    renderHook(() => useScrollRestoration())

    const link = document.createElement('a')
    link.href = '/cool-product/p'
    link.textContent = 'Product'
    document.body.appendChild(link)

    act(() => {
      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })

    const stored = sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}plp-key`)
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored as string)).toMatchObject({
      y: 1200,
      anchor: '/cool-product/p',
    })
  })

  it('skips resetInfiniteScroll when leaving /s (IS redirect path)', () => {
    window.history.replaceState({ key: 'search-key' }, '', '/s?q=refil')
    renderHook(() => useScrollRestoration())

    const onStart = getRouteHandler('routeChangeStart')
    expect(onStart).toBeTypeOf('function')

    act(() => {
      onStart?.('/office')
    })

    expect(resetInfiniteScroll).not.toHaveBeenCalled()
  })

  it('resets infinite scroll when leaving a PLP to a non-PDP page', () => {
    window.history.replaceState({ key: 'plp-key' }, '', '/office')
    renderHook(() => useScrollRestoration())

    const onStart = getRouteHandler('routeChangeStart')

    act(() => {
      onStart?.('/about')
    })

    expect(resetInfiniteScroll).toHaveBeenCalledWith(0)
  })

  it('does not reset infinite scroll when navigating to a PDP', () => {
    window.history.replaceState({ key: 'plp-key' }, '', '/office')
    renderHook(() => useScrollRestoration())

    const onStart = getRouteHandler('routeChangeStart')

    act(() => {
      onStart?.('/cool-product/p')
    })

    expect(resetInfiniteScroll).not.toHaveBeenCalled()
  })

  it('marks pending restore and cloaks paint on beforePopState when scroll exists', () => {
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 900, anchor: '/cool-product/p' })
    )

    renderHook(() => useScrollRestoration())
    const onBeforePopState = beforePopState.mock.calls[0][0] as () => boolean

    act(() => {
      expect(onBeforePopState()).toBe(true)
    })

    expect(sessionStorage.getItem(PENDING_RESTORE_FLAG)).toBe('plp-key')
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(true)
  })

  it('restores scroll on popstate when a saved position exists', async () => {
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 900 })
    )

    document.body.innerHTML = `<div style="height: 4000px"></div>`
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => 4000,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    })

    renderHook(() => useScrollRestoration())

    await act(async () => {
      window.dispatchEvent(new PopStateEvent('popstate'))
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('clears pending restore flag on routeChangeError', () => {
    renderHook(() => useScrollRestoration())
    sessionStorage.setItem(PENDING_RESTORE_FLAG, 'plp-key')
    document.documentElement.classList.add(RESTORING_SCROLL_CLASS)

    const onError = getRouteHandler('routeChangeError')
    act(() => {
      onError?.()
    })

    expect(sessionStorage.getItem(PENDING_RESTORE_FLAG)).toBeNull()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('restores after routeChangeComplete when pending restore was marked', async () => {
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 500 })
    )
    sessionStorage.setItem(PENDING_RESTORE_FLAG, 'plp-key')

    renderHook(() => useScrollRestoration())

    // Remount path already consumed the flag on mount — set again for complete.
    sessionStorage.setItem(PENDING_RESTORE_FLAG, 'plp-key')
    const onComplete = getRouteHandler('routeChangeComplete')

    await act(async () => {
      onComplete?.()
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    expect(window.scrollTo).toHaveBeenCalled()
  })
})
