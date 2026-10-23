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

  it('returns undefined when there are no headers', () => {
    expect(redactHeaders(undefined)).toBeUndefined()
  })
})

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
})
