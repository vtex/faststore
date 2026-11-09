import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockRefreshTokenRequest = vi.hoisted(() => vi.fn())
const mockLogoutAndClearSession = vi.hoisted(() => vi.fn())

vi.mock('../../../src/sdk/account/refreshToken', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../../../src/sdk/account/refreshToken')
  >()),
  refreshTokenRequest: mockRefreshTokenRequest,
  isRefreshTokenSuccessful: () => false,
}))

vi.mock('../../../src/sdk/session', () => ({
  logoutAndClearSession: mockLogoutAndClearSession,
  sessionStore: { read: () => null, readInitial: () => ({}) },
}))

import { useRefreshToken } from '../../../src/sdk/account/useRefreshToken'

const originalLocation = window.location

function stubHostname(hostname: string) {
  // jsdom forbids assigning to `window.location` directly, so we redefine the
  // descriptor with a minimal stub that exposes the hostname we want to test.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, hostname },
  })
}

describe('useRefreshToken', () => {
  beforeEach(() => {
    mockRefreshTokenRequest.mockResolvedValue({ status: 'error' })
    mockLogoutAndClearSession.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it.each(['localhost', 'brandless-abc123.preview.vtex.app'])(
    'shows the 403 view without refreshing or logging out on %s',
    async (hostname) => {
      stubHostname(hostname)

      const { result } = renderHook(() => useRefreshToken(true))

      await waitFor(() => expect(result.current.shouldShow403).toBe(true))
      expect(mockRefreshTokenRequest).not.toHaveBeenCalled()
      expect(mockLogoutAndClearSession).not.toHaveBeenCalled()
    }
  )

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'refreshes the token and logs out when it fails on %s',
    async (hostname) => {
      stubHostname(hostname)

      const { result } = renderHook(() => useRefreshToken(true))

      await waitFor(() => expect(result.current.shouldShow403).toBe(true))
      expect(mockRefreshTokenRequest).toHaveBeenCalledTimes(1)
      expect(mockLogoutAndClearSession).toHaveBeenCalledTimes(1)
    }
  )
})
