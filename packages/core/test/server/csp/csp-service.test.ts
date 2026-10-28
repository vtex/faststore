import { NextResponse } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CspService } from '../../../src/server/csp/csp-service'
import type { CspSettings } from '../../../src/server/csp/data-plane-api'
import type { SettingsClient } from '../../../src/server/csp/settings-client'

const STORE_ID = 'test-store'

function record(overrides: Partial<CspSettings> = {}): CspSettings {
  return {
    schemaVersion: 1,
    storeId: STORE_ID,
    mode: 'report-only',
    updatedAt: '2026-10-26T00:00:00.000Z',
    version: 1,
    ...overrides,
  }
}

function stubClient(settings: CspSettings | null) {
  const get = vi.fn<SettingsClient['get']>().mockResolvedValue(settings)
  return { client: { get } satisfies SettingsClient, get }
}

const CSP_HEADER_NAMES = [
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'Reporting-Endpoints',
]

function cspHeaders(response: NextResponse) {
  return CSP_HEADER_NAMES.map((name) => response.headers.get(name))
}

describe('CspService', () => {
  const originalDataPlaneUrl = process.env.DATA_PLANE_API_URL

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()

    if (originalDataPlaneUrl == null) {
      delete process.env.DATA_PLANE_API_URL
    } else {
      process.env.DATA_PLANE_API_URL = originalDataPlaneUrl
    }
  })

  it('sets the headers on NextResponse.next() and returns the same response', async () => {
    const { client, get } = stubClient(record())
    const response = NextResponse.next()

    const result = await new CspService(client).apply(response, STORE_ID)

    expect(result).toBe(response)
    expect(get).toHaveBeenCalledWith(STORE_ID)
    expect(response.headers.get('Content-Security-Policy-Report-Only')).toMatch(
      /^default-src 'self'; .*; report-to csp-endpoint$/
    )
    expect(response.headers.get('Reporting-Endpoints')).toBe(
      'csp-endpoint="https://endpointcsp.vtex.com/api/report?account=test-store"'
    )
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
  })

  it('sets both headers when framing is enforced and the policy is report-only', async () => {
    const { client } = stubClient(
      record({
        mode: 'report-only',
        frameAncestors: { mode: 'enforce', sources: ["'self'"] },
      })
    )
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('Content-Security-Policy')).toMatch(
      /^frame-ancestors 'self'; report-uri /
    )
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).not.toContain('frame-ancestors')
  })

  it('sets the headers on a rewrite response and keeps the rewrite', async () => {
    const { client } = stubClient(record({ mode: 'enforce' }))
    const response = NextResponse.rewrite(
      new URL('/en-US/products', 'https://store.example.com')
    )

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('x-middleware-rewrite')).toContain(
      '/en-US/products'
    )
    expect(response.headers.get('Content-Security-Policy')).toContain(
      "frame-ancestors 'self'"
    )
  })

  it('keeps cookies already set on the response', async () => {
    const { client } = stubClient(record())
    const response = NextResponse.next()
    response.cookies.set('__fs_password_protection', 'jwt-abc')

    await new CspService(client).apply(response, STORE_ID)

    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'jwt-abc'
    )
  })

  it('never decorates a redirect', async () => {
    const { client, get } = stubClient(record({ mode: 'enforce' }))
    const response = NextResponse.redirect(
      new URL('/password-protection', 'https://store.example.com')
    )

    const result = await new CspService(client).apply(response, STORE_ID)

    expect(result).toBe(response)
    expect(get).not.toHaveBeenCalled()
    expect(cspHeaders(response)).toEqual([null, null, null])
  })

  it('never decorates NextResponse.error()', async () => {
    const { client, get } = stubClient(record({ mode: 'enforce' }))
    const response = NextResponse.error() as NextResponse

    await new CspService(client).apply(response, STORE_ID)

    expect(get).not.toHaveBeenCalled()
    expect(cspHeaders(response)).toEqual([null, null, null])
  })

  it('leaves the response unchanged when there are no settings', async () => {
    const { client } = stubClient(null)
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(cspHeaders(response)).toEqual([null, null, null])
  })

  it('leaves the response unchanged when mode is off', async () => {
    const { client } = stubClient(record({ mode: 'off' }))
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(cspHeaders(response)).toEqual([null, null, null])
  })

  it('fails open when the settings client rejects', async () => {
    const get = vi.fn<SettingsClient['get']>().mockRejectedValue(new Error('x'))
    const response = NextResponse.next()

    await expect(
      new CspService({ get }).apply(response, STORE_ID)
    ).resolves.toBe(response)
    expect(cspHeaders(response)).toEqual([null, null, null])
  })

  it('builds once per settings record, so invalid entries are logged once', async () => {
    const settings = record({
      extraSources: {
        'script-src': ["'unsafe-eval'", 'https://a.example.com'],
      },
    })
    const { client } = stubClient(settings)
    const service = new CspService(client)

    await service.apply(NextResponse.next(), STORE_ID)
    const second = await service.apply(NextResponse.next(), STORE_ID)

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(second.headers.get('Content-Security-Policy-Report-Only')).toContain(
      'https://a.example.com'
    )

    client.get.mockResolvedValue({ ...settings, version: 2 })
    await service.apply(NextResponse.next(), STORE_ID)

    expect(console.warn).toHaveBeenCalledTimes(2)
  })

  it('uses the default data-plane client when none is given', async () => {
    delete process.env.DATA_PLANE_API_URL
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 404 }))
    const response = NextResponse.next()

    await new CspService().apply(response, STORE_ID)

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(String(fetchSpy.mock.calls[0][0])).toBe(
      `https://faststore.vtex.com/api/v1/csp/settings?storeId=${STORE_ID}`
    )
    expect(cspHeaders(response)).toEqual([null, null, null])
  })
})
