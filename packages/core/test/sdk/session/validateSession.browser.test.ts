import type { Session } from '@faststore/sdk'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const mockRequest = vi.hoisted(() => vi.fn())
const mockRefreshTokenRequest = vi.hoisted(() => vi.fn())

vi.mock('../../../src/sdk/graphql/request', () => ({
  request: mockRequest,
}))

vi.mock('../../../src/sdk/account/refreshToken', () => ({
  refreshTokenRequest: mockRefreshTokenRequest,
  isRefreshTokenSuccessful: () => true,
  getNextRefreshAfter: () => String(Math.floor(Date.now() / 1000) + 3600),
  isB2BSession: () => false,
}))

import storeConfig from '../../../discovery.config'
import { validateSession } from '../../../src/sdk/session'

const session: Session = {
  locale: 'en-US',
  currency: { code: 'USD', symbol: '$' },
  country: 'USA',
  channel: '{"salesChannel":"1","regionId":""}',
  deliveryMode: null,
  addressType: null,
  city: null,
  postalCode: '10001',
  geoCoordinates: null,
  person: null,
  b2b: null,
  marketingData: null,
  refreshAfter: null,
}

// The store validates its initial session when the module loads. Let that
// call settle once, so no test depends on calls left by another one.
beforeAll(async () => {
  mockRequest.mockResolvedValue({ validateSession: null })
  await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled())
})

describe('validateSession', () => {
  beforeEach(() => {
    mockRequest.mockReset()
    mockRequest.mockResolvedValue({ validateSession: null })
  })

  it('does not send the UI state persisted with the session', async () => {
    await validateSession({
      ...session,
      isValidating: false,
      isSessionReady: true,
      hasValidated: true,
    } as Session)

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest.mock.calls[0][1].session).toStrictEqual(session)
  })
})

describe('validateSession refresh-token bypass', () => {
  const originalLocation = window.location
  const originalRefreshToken = storeConfig.experimental.refreshToken

  // An already expired `refreshAfter` (in seconds) triggers the refresh path.
  const expiredSession: Session = { ...session, refreshAfter: '1' }

  function stubHostname(hostname: string) {
    // jsdom forbids assigning to `window.location` directly, so we redefine the
    // descriptor with a minimal stub that exposes the hostname we want to test.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, hostname },
    })
  }

  beforeEach(() => {
    mockRequest.mockReset()
    mockRequest.mockResolvedValue({ validateSession: null })
    mockRefreshTokenRequest.mockReset()
    mockRefreshTokenRequest.mockResolvedValue({
      status: 'success',
      refreshAfter: new Date(Date.now() + 60_000).toISOString(),
    })
    storeConfig.experimental.refreshToken = true
  })

  afterEach(() => {
    storeConfig.experimental.refreshToken = originalRefreshToken
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it.each(['localhost', 'brandless-abc123.preview.vtex.app'])(
    'skips the refresh when refreshAfter is expired on %s',
    async (hostname) => {
      stubHostname(hostname)

      await validateSession(expiredSession)

      expect(mockRefreshTokenRequest).not.toHaveBeenCalled()
      expect(mockRequest).toHaveBeenCalledTimes(1)
    }
  )

  it.each(['localhost', 'brandless-abc123.preview.vtex.app'])(
    'skips the refresh when ValidateSession answers 401 on %s',
    async (hostname) => {
      stubHostname(hostname)
      mockRequest.mockRejectedValueOnce({ status: 401 })

      await validateSession(session)

      expect(mockRefreshTokenRequest).not.toHaveBeenCalled()
    }
  )

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'refreshes the token when refreshAfter is expired on %s',
    async (hostname) => {
      stubHostname(hostname)

      await validateSession(expiredSession)

      expect(mockRefreshTokenRequest).toHaveBeenCalledTimes(1)
    }
  )

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'refreshes the token when ValidateSession answers 401 on %s',
    async (hostname) => {
      stubHostname(hostname)
      mockRequest.mockRejectedValueOnce({ status: 401 })

      await validateSession(session)

      expect(mockRefreshTokenRequest).toHaveBeenCalledTimes(1)
    }
  )
})
