/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: {
    api: { storeId: 'storeframework' },
  },
}))

const mockFetch = vi.hoisted(() => vi.fn())
vi.mock('isomorphic-unfetch', () => ({ __esModule: true, default: mockFetch }))

import { useSetPassword } from '../../../src/sdk/account/useSetPassword'

const okResponse = (body: unknown) => ({
  ok: true,
  statusText: 'OK',
  json: async () => body,
})

const errorResponse = (body: unknown) => ({
  ok: false,
  statusText: 'Bad Request',
  json: async () => body,
})

const validInput = {
  userEmail: 'shopper@example.com',
  currentPassword: 'OldPass123',
  newPassword: 'NewPass123',
}

function getSetPasswordCall() {
  return mockFetch.mock.calls.find((call) =>
    String(call[0]).includes('setpassword')
  )
}

function getStartLoginCall() {
  return mockFetch.mock.calls.find((call) =>
    String(call[0]).includes('/pub/authentication/start')
  )
}

describe('useSetPassword', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('posts to the new authenticator setpassword route with expireSessions and an', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({})) // startLogin
      .mockResolvedValueOnce(okResponse({ authStatus: 'success' }))

    const { result } = renderHook(() => useSetPassword('myaccount'))

    await act(async () => {
      await result.current.setPassword(validInput)
    })

    const call = getSetPasswordCall()
    expect(call).toBeDefined()

    const url = String(call?.[0])
    expect(url).toContain(
      '/api/authenticator/pub/authentication/classic/setpassword'
    )
    expect(url).not.toContain('/api/vtexid/')
    expect(url).toContain('expireSessions=true')
    expect(url).toContain('an=myaccount')
  })

  it('posts to the new authenticator start route with an and credentials', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({})) // startLogin
      .mockResolvedValueOnce(okResponse({ authStatus: 'success' }))

    const { result } = renderHook(() => useSetPassword('myaccount'))

    await act(async () => {
      await result.current.setPassword(validInput)
    })

    const call = getStartLoginCall()
    expect(call).toBeDefined()

    const url = String(call?.[0])
    expect(url).toContain('/api/authenticator/pub/authentication/start')
    expect(url).not.toContain('/api/vtexid/')
    expect(url).toContain('an=myaccount')

    const init = call?.[1] as RequestInit
    expect(init?.method).toBe('POST')
    expect(init?.credentials).toBe('include')

    const body = init?.body as FormData
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('user')).toBe(validInput.userEmail)
    expect(body.get('scope')).toBe('myaccount')
    expect(body.get('accountName')).toBe('myaccount')
    expect(body.get('returnUrl')).toBe('/')
  })

  it('sends a POST with credentials and the expected form-data body', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({ authStatus: 'success' }))

    const { result } = renderHook(() => useSetPassword('myaccount'))

    await act(async () => {
      await result.current.setPassword(validInput)
    })

    const call = getSetPasswordCall()
    const init = call?.[1] as RequestInit

    expect(init?.method).toBe('POST')
    expect(init?.credentials).toBe('include')

    const body = init?.body as FormData
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('login')).toBe(validInput.userEmail)
    expect(body.get('currentPassword')).toBe(validInput.currentPassword)
    expect(body.get('newPassword')).toBe(validInput.newPassword)
  })

  it('returns success when the endpoint reports authStatus success', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({ authStatus: 'success' }))

    const { result } = renderHook(() => useSetPassword('myaccount'))

    let outcome: { success: boolean; message: string } | undefined
    await act(async () => {
      outcome = await result.current.setPassword(validInput)
    })

    expect(outcome).toEqual({
      success: true,
      message: 'Password set successfully',
    })
  })

  it('maps wrongcredentials error responses to the existing message', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(errorResponse({ authStatus: 'wrongcredentials' }))

    const { result } = renderHook(() => useSetPassword('myaccount'))

    let outcome: { success: boolean; message: string } | undefined
    await act(async () => {
      outcome = await result.current.setPassword(validInput)
    })

    expect(outcome).toEqual({ success: false, message: 'Wrong credentials' })
  })

  it('falls back to config.api.storeId when accountName is missing', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({ authStatus: 'success' }))

    const { result } = renderHook(() => useSetPassword())

    await act(async () => {
      await result.current.setPassword(validInput)
    })

    const setPasswordUrl = String(getSetPasswordCall()?.[0])
    expect(setPasswordUrl).toContain('an=storeframework')

    const startLoginCall = getStartLoginCall()
    const startLoginUrl = String(startLoginCall?.[0])
    expect(startLoginUrl).toContain('an=storeframework')

    const startBody = (startLoginCall?.[1] as RequestInit)?.body as FormData
    expect(startBody.get('scope')).toBe('storeframework')
    expect(startBody.get('accountName')).toBe('storeframework')
  })
})
