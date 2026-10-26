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

// Keeps the real `isB2BSession`, so the route choice is exercised end to end.
vi.mock('../../../src/sdk/account/refreshToken', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../../../src/sdk/account/refreshToken')
  >()),
  refreshTokenRequest: mockRefreshTokenRequest,
}))

import storeConfig from '../../../discovery.config'
import { validateSession } from '../../../src/sdk/session'

// An already expired `refreshAfter` (in seconds) triggers the refresh.
const expiredSession: Session = {
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
  refreshAfter: '1',
}

const withB2b = (b2b: Partial<NonNullable<Session['b2b']>>) =>
  ({ ...expiredSession, b2b }) as Session

// The store validates its initial session when the module loads. Let that
// call settle once, so no test depends on calls left by another one.
beforeAll(async () => {
  mockRequest.mockResolvedValue({ validateSession: null })
  await vi.waitFor(() => expect(mockRequest).toHaveBeenCalled())
})

describe('validateSession refresh route', () => {
  const originalLocation = window.location
  const originalRefreshToken = storeConfig.experimental.refreshToken

  beforeEach(() => {
    // Local hosts skip the refresh, so run on a production host.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, hostname: 'brandless.fast.store' },
    })
    storeConfig.experimental.refreshToken = true
    mockRequest.mockReset()
    mockRequest.mockResolvedValue({ validateSession: null })
    mockRefreshTokenRequest.mockReset()
    mockRefreshTokenRequest.mockResolvedValue({
      authStatus: 'Success',
      refreshAfter: Math.floor(Date.now() / 1000) + 3600,
    })
  })

  afterEach(() => {
    storeConfig.experimental.refreshToken = originalRefreshToken
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('uses the Authenticator route for a buyer with a unit and a contract', async () => {
    await validateSession(
      withB2b({ unitId: 'unit-1', customerId: 'contract-1' })
    )

    expect(mockRefreshTokenRequest).toHaveBeenCalledWith({ isB2B: true })
  })

  it('keeps the legacy route when `b2b` has no unit or contract', async () => {
    // `b2b` exists for every isRepresentative token, which can be true
    // outside B2B.
    await validateSession(withB2b({ unitId: '', customerId: '' }))

    expect(mockRefreshTokenRequest).toHaveBeenCalledWith({ isB2B: false })
  })

  it('keeps the legacy route without a B2B session', async () => {
    await validateSession(expiredSession)

    expect(mockRefreshTokenRequest).toHaveBeenCalledWith({ isB2B: false })
  })
})
