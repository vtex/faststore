import { ForbiddenError } from '../../../../../src/platforms/errors'
import {
  fetchAPI,
  redactHeaders,
} from '../../../../../src/platforms/vtex/clients/fetch'

const mockFetch = jest.fn()

jest.mock('isomorphic-unfetch', () => ({
  __esModule: true,
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

  it('reads headers from any object with forEach, such as fetch polyfills', () => {
    expect(redactHeaders(polyfillHeaders('secret'))).toEqual({
      'content-type': 'text/plain',
      'set-cookie': '[redacted]',
    })
  })

  it('returns undefined when there are no headers', () => {
    expect(redactHeaders(undefined)).toBeUndefined()
  })
})

// Shaped like the Headers polyfill returned by isomorphic-unfetch on Node.
function polyfillHeaders(cookieValue: string) {
  return {
    forEach: (callback: (value: string, name: string) => void) => {
      callback('text/plain', 'content-type')
      callback(`VtexIdclientAutCookie_store=${cookieValue}`, 'set-cookie')
    },
  } as unknown as Headers
}

describe('fetchAPI', () => {
  afterEach(() => {
    mockFetch.mockReset()
    jest.restoreAllMocks()
  })

  it('does not log credential headers when the request fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
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
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      headers: polyfillHeaders('response-secret'),
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
