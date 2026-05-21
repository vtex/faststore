import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMocked = vi.fn()

vi.mock('isomorphic-unfetch', () => ({
  default: (info: RequestInfo, init?: RequestInit) => fetchMocked(info, init),
}))

// Imported after the mock above so the module under test picks up the stub.
const { fetchAPI } = await import(
  '../../../../../src/platforms/vtex/clients/fetch'
)

describe('fetchAPI error logging', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchMocked.mockReset()
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('redacts CloudFront viewer-location headers from the error log on non-OK responses', async () => {
    fetchMocked.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'boom',
    })

    await expect(
      fetchAPI('https://example.com/api/whatever', {
        headers: {
          'content-type': 'application/json',
          'X-FORWARDED-HOST': 'example.com',
          'CloudFront-Viewer-Country': 'BR',
          'CloudFront-Viewer-Postal-Code': '01000-000',
          'CloudFront-Viewer-Latitude': '-23.55',
          'CloudFront-Viewer-Longitude': '-46.63',
        },
      })
    ).rejects.toThrow()

    expect(errorSpy).toHaveBeenCalledTimes(1)
    const loggedInit = errorSpy.mock.calls[0][1] as RequestInit
    const loggedHeaders = loggedInit.headers as Record<string, string>

    expect(loggedHeaders['cloudfront-viewer-country']).toBe('[REDACTED]')
    expect(loggedHeaders['cloudfront-viewer-postal-code']).toBe('[REDACTED]')
    expect(loggedHeaders['cloudfront-viewer-latitude']).toBe('[REDACTED]')
    expect(loggedHeaders['cloudfront-viewer-longitude']).toBe('[REDACTED]')

    // Non-sensitive headers stay visible for debugging.
    expect(loggedHeaders['content-type']).toBe('application/json')
    expect(loggedHeaders['x-forwarded-host']).toBe('example.com')
  })

  it('does not blow up when init is undefined', async () => {
    fetchMocked.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'boom',
    })

    await expect(fetchAPI('https://example.com/api/whatever')).rejects.toThrow()

    expect(errorSpy).toHaveBeenCalledTimes(1)
    // When init is undefined, fetchAPI logs it as-is (undefined).
    expect(errorSpy.mock.calls[0][1]).toBeUndefined()
  })
})
