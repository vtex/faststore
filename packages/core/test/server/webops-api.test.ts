import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('discovery.config', () => ({
  __esModule: true,
  default: { api: { storeId: 'my-store' } },
}))

describe('webops-api URL builders', () => {
  const originalEnv = process.env.WEBOPS_API_URL

  afterEach(() => {
    process.env.WEBOPS_API_URL = originalEnv
    vi.resetModules()
  })

  async function load() {
    return import('../../src/server/password-protection/webops-api')
  }

  it('uses DEFAULT_WEBOPS_ORIGIN when WEBOPS_API_URL is not set', async () => {
    delete process.env.WEBOPS_API_URL
    const { publicKeyUrl, protectionStatusUrl, sessionUrl, renewUrl } =
      await load()

    expect(publicKeyUrl().origin).toBe('https://faststore.vtex.com')
    expect(protectionStatusUrl().origin).toBe('https://faststore.vtex.com')
    expect(sessionUrl().origin).toBe('https://faststore.vtex.com')
    expect(renewUrl().origin).toBe('https://faststore.vtex.com')
  })

  it('uses WEBOPS_API_URL when set with https scheme', async () => {
    process.env.WEBOPS_API_URL = 'https://my-webops.example.com'
    const { publicKeyUrl } = await load()

    expect(publicKeyUrl().origin).toBe('https://my-webops.example.com')
  })

  it('prepends https:// when WEBOPS_API_URL has no scheme', async () => {
    process.env.WEBOPS_API_URL = 'my-webops.example.com'
    const { publicKeyUrl } = await load()

    expect(publicKeyUrl().href).toContain('https://my-webops.example.com')
  })

  it('strips trailing slashes from WEBOPS_API_URL', async () => {
    process.env.WEBOPS_API_URL = 'https://my-webops.example.com///'
    const { publicKeyUrl } = await load()

    expect(publicKeyUrl().origin).toBe('https://my-webops.example.com')
  })

  it('publicKeyUrl returns correct path', async () => {
    delete process.env.WEBOPS_API_URL
    const { publicKeyUrl } = await load()

    expect(publicKeyUrl().pathname).toBe(
      '/api/v1/password-protection/public-key'
    )
  })

  it('protectionStatusUrl appends storeId query param', async () => {
    delete process.env.WEBOPS_API_URL
    const { protectionStatusUrl } = await load()
    const url = protectionStatusUrl()

    expect(url.pathname).toBe('/api/v1/password-protection/status')
    expect(url.searchParams.get('storeId')).toBe('my-store')
  })

  it('sessionUrl returns correct path', async () => {
    delete process.env.WEBOPS_API_URL
    const { sessionUrl } = await load()

    expect(sessionUrl().pathname).toBe('/api/v1/password-protection/session')
  })

  it('renewUrl returns correct path', async () => {
    delete process.env.WEBOPS_API_URL
    const { renewUrl } = await load()

    expect(renewUrl().pathname).toBe('/api/v1/password-protection/renew')
  })

  it('exports passwordProtectionTimeouts with expected numeric values', async () => {
    const { passwordProtectionTimeouts } = await load()

    expect(typeof passwordProtectionTimeouts.publicKeyMs).toBe('number')
    expect(typeof passwordProtectionTimeouts.defaultMs).toBe('number')
    expect(passwordProtectionTimeouts.publicKeyMs).toBeGreaterThan(0)
    expect(passwordProtectionTimeouts.defaultMs).toBeGreaterThan(0)
  })
})
