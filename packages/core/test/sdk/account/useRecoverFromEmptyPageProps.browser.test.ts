import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockRouter = vi.hoisted(() => ({
  pathname: '/pvt/account/profile',
  isFallback: false,
}))

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

import {
  EMPTY_PAGE_PROPS_RELOAD_MESSAGE,
  EMPTY_PAGE_PROPS_SKIPPED_MESSAGE,
  RECOVERY_GUARD_WINDOW_MS,
  RECOVERY_STORAGE_KEY,
  useRecoverFromEmptyPageProps,
} from '../../../src/sdk/account/useRecoverFromEmptyPageProps'

const originalLocation = window.location
const reload = vi.fn()

function stubLocation(pathname: string) {
  // jsdom does not allow spying on or reassigning `location.reload`, so the
  // whole descriptor is replaced with a minimal stub.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, pathname, reload },
  })
}

describe('useRecoverFromEmptyPageProps', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockRouter.pathname = '/pvt/account/profile'
    mockRouter.isFallback = false
    stubLocation('/pvt/account/profile')
    window.sessionStorage.clear()
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    reload.mockReset()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['an empty object', {}],
  ])('reloads once when page props are %s on an account route', (_, props) => {
    renderHook(() => useRecoverFromEmptyPageProps(props))

    expect(reload).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(EMPTY_PAGE_PROPS_RELOAD_MESSAGE)
  })

  it('does not reload again when the hook re-renders with the same props', () => {
    const { rerender } = renderHook(() => useRecoverFromEmptyPageProps({}))

    rerender()
    rerender()

    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload when page props have content', () => {
    renderHook(() =>
      useRecoverFromEmptyPageProps({ globalSections: { sections: [] } })
    )

    expect(reload).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })

  it.each(['/', '/[slug]/p', '/pvt/accounting', '/login'])(
    'does not reload on the non-account route %s',
    (pathname) => {
      mockRouter.pathname = pathname

      renderHook(() => useRecoverFromEmptyPageProps({}))

      expect(reload).not.toHaveBeenCalled()
    }
  )

  it('also covers the account root and dynamic account routes', () => {
    mockRouter.pathname = '/pvt/account'
    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).toHaveBeenCalledTimes(1)

    window.sessionStorage.clear()
    reload.mockReset()
    mockRouter.pathname = '/pvt/account/orders/[id]'
    stubLocation('/pvt/account/orders/123')
    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('does nothing while the router is on a fallback page', () => {
    mockRouter.isFallback = true

    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).not.toHaveBeenCalled()
  })

  it('does not reload a second time for the same path within the guard window', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    const first = renderHook(() => useRecoverFromEmptyPageProps({}))
    first.unmount()

    vi.advanceTimersByTime(RECOVERY_GUARD_WINDOW_MS - 1)
    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(EMPTY_PAGE_PROPS_SKIPPED_MESSAGE)
  })

  it('reloads again once the guard window has passed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    renderHook(() => useRecoverFromEmptyPageProps({})).unmount()

    vi.advanceTimersByTime(RECOVERY_GUARD_WINDOW_MS + 1)
    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).toHaveBeenCalledTimes(2)
  })

  it('reloads for a different path inside the guard window', () => {
    renderHook(() => useRecoverFromEmptyPageProps({})).unmount()

    stubLocation('/pvt/account/security')
    mockRouter.pathname = '/pvt/account/security'
    renderHook(() => useRecoverFromEmptyPageProps({}))

    expect(reload).toHaveBeenCalledTimes(2)
  })

  it('stores the pathname and a timestamp as the guard', () => {
    renderHook(() => useRecoverFromEmptyPageProps({}))

    const stored = JSON.parse(
      window.sessionStorage.getItem(RECOVERY_STORAGE_KEY) ?? 'null'
    )

    expect(stored.path).toBe('/pvt/account/profile')
    expect(typeof stored.timestamp).toBe('number')
  })

  it('ignores a corrupted guard entry', () => {
    window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, '{not json')

    expect(() =>
      renderHook(() => useRecoverFromEmptyPageProps({}))
    ).not.toThrow()
    expect(reload).not.toHaveBeenCalled()
  })

  it('does not throw nor reload when sessionStorage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })

    expect(() =>
      renderHook(() => useRecoverFromEmptyPageProps({}))
    ).not.toThrow()
    expect(reload).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(EMPTY_PAGE_PROPS_SKIPPED_MESSAGE)
  })
})
