import { afterEach, describe, expect, it, vi } from 'vitest'

import { ForbiddenError } from '../../../../../src/platforms/errors'
import {
  fetchAPI,
  redactHeaders,
} from '../../../../../src/platforms/vtex/clients/fetch'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('isomorphic-unfetch', () => ({
  default: (...args: unknown[]) => mockFetch(...args),
}))

const SECRET_HEADERS = {
  'content-type': 'application/json',
  'X-VTEX-API-AppKey': 'app-key-secret',
  'X-VTEX-API-AppToken': 'app-token-secret',
  cookie: 'VtexIdclientAutCookie_store=cookie-secret',
  VtexIdclientAutCookie_store: 'aut-cookie-secret',
}

describe('redactHeaders', () => {
  it('replaces credential headers and keeps the others', () => {
    expect(redactHeaders(SECRET_HEADERS)).toEqual({
      'content-type': 'application/json',
      'X-VTEX-API-AppKey': '[redacted]',
      'X-VTEX-API-AppToken': '[redacted]',
      cookie: '[redacted]',
      VtexIdclientAutCookie_store: '[redacted]',
    })
  })

  it('returns undefined when there are no headers', () => {
    expect(redactHeaders(undefined)).toBeUndefined()
  })
})

describe('fetchAPI', () => {
  afterEach(() => {
    mockFetch.mockReset()
    vi.restoreAllMocks()
  })

  it('does not log credential headers when the request fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    })

    await expect(
      fetchAPI('https://example.vtexcommercestable.com.br/api/test', {
        method: 'POST',
        headers: SECRET_HEADERS,
        body: '{}',
      })
    ).rejects.toThrow(ForbiddenError)

    // The request itself still carries the credentials.
    const [, init] = mockFetch.mock.calls[0]
    expect(init.headers['X-VTEX-API-AppKey']).toBe('app-key-secret')

    expect(error).toHaveBeenCalledTimes(1)
    const logged = JSON.stringify(error.mock.calls[0])
    expect(logged).not.toContain('secret')
    expect(error.mock.calls[0][1].headers['X-VTEX-API-AppKey']).toBe(
      '[redacted]'
    )
  })

  it('does not log credential headers from the failed response', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: new Headers({
        'content-type': 'text/plain',
        'set-cookie': 'VtexIdclientAutCookie_store=response-secret',
      }),
      text: async () => 'Forbidden',
    })

    await expect(
      fetchAPI('https://example.vtexcommercestable.com.br/api/test')
    ).rejects.toThrow(ForbiddenError)

    const [, , loggedResponse] = error.mock.calls[0]
    expect(loggedResponse).toEqual({
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'content-type': 'text/plain',
        'set-cookie': '[redacted]',
      },
    })
    expect(JSON.stringify(error.mock.calls[0])).not.toContain('secret')
  })
})
