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
  STABLE_HITS_REQUIRED,
  RESTORE_MAX_ATTEMPTS,
  destinationPathname,
  findAnchorCard,
  normalizePath,
  pathMatchesAnchor,
  isElementInViewport,
  scrollElementIntoView,
  scrollToSavedPosition,
  trackAnchorInView,
  isAnchorRestoreSettled,
  restoreByAnchor,
  restoreByCoordinates,
  continueOrFinish,
  finishRestore,
  ensureAnchorObserver,
  optimisticRestore,
  scheduleRestore,
  markPendingRestore,
  cancelRestore,
  beginRestoringPaint,
  endRestoringPaint,
  createSession,
  setActiveRestoreKey,
  bumpGeneration,
  reset,
} = scrollRestorationTestUtils

function mockInView(el: HTMLElement, inView: boolean) {
  el.getBoundingClientRect = () =>
    ({
      top: inView ? 100 : -2000,
      bottom: inView ? 300 : -1800,
      height: 200,
      width: 200,
      left: 0,
      right: 200,
      x: 0,
      y: inView ? 100 : -2000,
      toJSON: () => ({}),
    }) as DOMRect
}

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
    // Relative to origin — spaces are percent-encoded by the URL constructor.
    expect(destinationPathname('not a url')).toBe('/not%20a%20url')
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
    // jsdom does not implement History.scrollRestoration — polyfill for the hook.
    Object.defineProperty(window.history, 'scrollRestoration', {
      configurable: true,
      writable: true,
      value: 'auto',
    })
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

  it('does not treat root as same-path for every navigation', () => {
    window.history.replaceState({ key: 'home-key' }, '', '/')
    renderHook(() => useScrollRestoration())

    const onStart = getRouteHandler('routeChangeStart')

    act(() => {
      onStart?.('/office')
    })

    // Old url.includes('/') matched every path; normalized compare must not.
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

  it('ignores non-product clicks and same-path PDP clicks', () => {
    renderHook(() => useScrollRestoration())

    act(() => {
      document.body.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })
    expect(sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}plp-key`)).toBeNull()

    const same = document.createElement('a')
    same.href = '/office'
    same.setAttribute('href', '/office')
    document.body.appendChild(same)
    // Not a /p link
    act(() => {
      same.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })
    expect(sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}plp-key`)).toBeNull()
  })

  it('does not reset on same-path navigations', () => {
    window.history.replaceState({ key: 'plp-key' }, '', '/office')
    renderHook(() => useScrollRestoration())

    const onStart = getRouteHandler('routeChangeStart')
    act(() => {
      onStart?.('/office?page=2')
    })

    expect(resetInfiniteScroll).not.toHaveBeenCalled()
  })

  it('unregisters listeners on unmount', () => {
    const { unmount } = renderHook(() => useScrollRestoration())
    unmount()
    expect(routerEvents.off).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    )
    expect(beforePopState).toHaveBeenCalledWith(expect.any(Function))
  })
})

describe('scroll restore session helpers', () => {
  beforeEach(() => {
    reset()
    sessionStorage.clear()
    document.body.innerHTML = ''
    window.scrollTo = vi.fn()
    window.history.replaceState({ key: 'plp-key' }, '', '/office')
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
      writable: true,
    })
  })

  afterEach(() => {
    reset()
  })

  it('begin/end restoring paint toggles the html class', () => {
    beginRestoringPaint()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(true)
    endRestoringPaint()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('markPendingRestore cloaks only when stored scroll exists', () => {
    markPendingRestore()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)

    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 10 })
    )
    markPendingRestore()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(true)
  })

  it('detects viewport membership and scrolls elements into view', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    mockInView(el, true)
    expect(isElementInViewport(el)).toBe(true)
    mockInView(el, false)
    expect(isElementInViewport(el)).toBe(false)

    mockInView(el, true)
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 500,
    })
    scrollElementIntoView(el)
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('scrollToSavedPosition clamps to document max scroll', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => 1000,
    })
    scrollToSavedPosition({ x: 0, y: 99999 })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 200)
  })

  it('tracks anchor stability until settled', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    mockInView(el, true)

    const session = createSession()
    expect(trackAnchorInView(session, el)).toBe(false)
    expect(session.stableHits).toBe(1)
    expect(session.defenseUntil).toBeGreaterThan(0)

    session.stableHits = STABLE_HITS_REQUIRED
    expect(isAnchorRestoreSettled(session)).toBe(true)

    mockInView(el, false)
    expect(trackAnchorInView(session, el)).toBe(false)
    expect(session.stableHits).toBe(0)
  })

  it('restoreByAnchor finishes when the card is stably in view', () => {
    document.body.innerHTML = `
      <div data-fs-product-card>
        <a data-testid="product-link" href="/cool-product/p">Product</a>
      </div>
    `
    const card = findAnchorCard('/cool-product/p') as HTMLElement
    mockInView(card, true)

    const scheduleNext = vi.fn()
    const tryRestore = vi.fn()
    const session = createSession({
      stored: { x: 0, y: 400, anchor: '/cool-product/p' },
      stableHits: STABLE_HITS_REQUIRED - 1,
    })
    setActiveRestoreKey(session.key)

    expect(restoreByAnchor(session, scheduleNext, tryRestore)).toBe(true)
    expect(scheduleNext).not.toHaveBeenCalled()
  })

  it('restoreByAnchor schedules retry when card is missing', () => {
    const scheduleNext = vi.fn()
    const tryRestore = vi.fn()
    const session = createSession({
      stored: { x: 0, y: 400, anchor: '/missing/p' },
      attempts: 1,
    })

    expect(restoreByAnchor(session, scheduleNext, tryRestore)).toBe(true)
    expect(session.observer).not.toBeNull()
    expect(scheduleNext).toHaveBeenCalled()
  })

  it('restoreByAnchor returns false without an anchor', () => {
    const session = createSession({ stored: { x: 0, y: 10 } })
    expect(restoreByAnchor(session, vi.fn(), vi.fn())).toBe(false)
  })

  it('continueOrFinish finishes after max attempts', () => {
    beginRestoringPaint()
    const session = createSession({ attempts: RESTORE_MAX_ATTEMPTS })
    setActiveRestoreKey(session.key)
    const scheduleNext = vi.fn()
    continueOrFinish(session, scheduleNext)
    expect(scheduleNext).not.toHaveBeenCalled()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('finishRestore no-ops for stale generations', () => {
    beginRestoringPaint()
    const session = createSession({ generation: 1 })
    bumpGeneration()
    bumpGeneration()
    finishRestore(session)
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(true)
    endRestoringPaint()
  })

  it('restoreByCoordinates finishes when already near target', async () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => 2000,
    })
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 500,
    })
    const session = createSession({
      stored: { x: 0, y: 500 },
      attempts: 1,
    })
    setActiveRestoreKey(session.key)
    beginRestoringPaint()

    await act(async () => {
      restoreByCoordinates(session, vi.fn())
      await new Promise((resolve) => setTimeout(resolve, 120))
    })

    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('restoreByCoordinates finishes immediately when y is 0', () => {
    beginRestoringPaint()
    const session = createSession({ stored: { x: 0, y: 0 }, attempts: 1 })
    setActiveRestoreKey(session.key)
    restoreByCoordinates(session, vi.fn())
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('optimisticRestore scrolls to an anchor card when present', () => {
    document.body.innerHTML = `
      <div data-fs-product-card>
        <a data-testid="product-link" href="/cool-product/p">Product</a>
      </div>
    `
    const card = findAnchorCard('/cool-product/p') as HTMLElement
    mockInView(card, true)
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 300, anchor: '/cool-product/p' })
    )

    optimisticRestore()
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('optimisticRestore ends paint when nothing is stored', () => {
    beginRestoringPaint()
    optimisticRestore()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('scheduleRestore is a no-op without stored scroll', () => {
    beginRestoringPaint()
    scheduleRestore()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('scheduleRestore restores by anchor across frames', async () => {
    document.body.innerHTML = `
      <div data-fs-product-card>
        <a data-testid="product-link" href="/cool-product/p">Product</a>
      </div>
    `
    const card = findAnchorCard('/cool-product/p') as HTMLElement
    mockInView(card, true)
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 400, anchor: '/cool-product/p' })
    )

    await act(async () => {
      scheduleRestore()
      // Enough frames for stable hits to accumulate.
      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => requestAnimationFrame(resolve))
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    })

    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('scheduleRestore does not restart for the same active key', () => {
    sessionStorage.setItem(
      `${SCROLL_STORAGE_PREFIX}plp-key`,
      JSON.stringify({ x: 0, y: 100 })
    )
    setActiveRestoreKey('plp-key')
    const callsBefore = (window.scrollTo as ReturnType<typeof vi.fn>).mock.calls
      .length
    scheduleRestore()
    expect(
      (window.scrollTo as ReturnType<typeof vi.fn>).mock.calls.length
    ).toBe(callsBefore)
  })

  it('cancelRestore clears active restore and paint cloak', () => {
    beginRestoringPaint()
    setActiveRestoreKey('plp-key')
    cancelRestore()
    expect(
      document.documentElement.classList.contains(RESTORING_SCROLL_CLASS)
    ).toBe(false)
  })

  it('ensureAnchorObserver only creates one observer', () => {
    const session = createSession({
      stored: { x: 0, y: 1, anchor: '/x/p' },
    })
    const tryRestore = vi.fn()
    ensureAnchorObserver(session, '/x/p', tryRestore)
    const first = session.observer
    ensureAnchorObserver(session, '/x/p', tryRestore)
    expect(session.observer).toBe(first)
  })
})
