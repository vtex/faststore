import { NextResponse } from 'next/server'

import { CspService } from '../../../src/server/csp/csp-service'
import * as policyBuilder from '../../../src/server/csp/policy-builder'
import type {
  CspSettings,
  SettingsClient,
} from '../../../src/server/csp/settings-client'

const STORE_ID = 'mystore'
const REPORT_URL = 'https://endpointcsp.vtex.com/api/report?account=mystore'

function settings(overrides: Partial<CspSettings> = {}): CspSettings {
  return {
    schemaVersion: 1,
    storeId: STORE_ID,
    mode: 'report-only',
    updatedAt: '2026-10-26T00:00:00.000Z',
    version: 1,
    ...overrides,
  }
}

function clientReturning(value: CspSettings | null) {
  const get = jest.fn<Promise<CspSettings | null>, [string]>()
  get.mockResolvedValue(value)
  const client: SettingsClient = { get }

  return { client, get }
}

describe('CspService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('sets the headers on NextResponse.next() and returns the same response', async () => {
    const { client, get } = clientReturning(settings())
    const response = NextResponse.next()

    const result = await new CspService(client).apply(response, STORE_ID)

    expect(result).toBe(response)
    expect(get).toHaveBeenCalledWith(STORE_ID)
    expect(response.headers.get('Reporting-Endpoints')).toBe(
      `csp-endpoint="${REPORT_URL}"`
    )
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).toContain("default-src 'self'")
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it('sets the headers on a rewrite response', async () => {
    const { client } = clientReturning(settings({ mode: 'enforce' }))
    const response = NextResponse.rewrite(
      new URL('https://mystore.example.com/pt-BR/office')
    )

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('Content-Security-Policy')).toContain(
      "frame-ancestors 'self'"
    )
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://mystore.example.com/pt-BR/office'
    )
  })

  it('keeps existing headers and cookies on the response', async () => {
    const { client } = clientReturning(settings())
    const response = NextResponse.next()
    response.cookies.set('__fs_password_protection', 'token')
    response.headers.set('Cache-Control', 'no-store')

    await new CspService(client).apply(response, STORE_ID)

    expect(response.cookies.get('__fs_password_protection')?.value).toBe(
      'token'
    )
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('Reporting-Endpoints')).not.toBeNull()
  })

  it('sends both headers for report-only with enforced framing', async () => {
    const { client } = clientReturning(
      settings({ frameAncestors: { mode: 'enforce', sources: ["'self'"] } })
    )
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('Content-Security-Policy')).toBe(
      `frame-ancestors 'self'; report-uri ${REPORT_URL}; report-to csp-endpoint`
    )
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).not.toContain('frame-ancestors')
  })

  it.each([
    [
      'a 307 redirect',
      () =>
        NextResponse.redirect(
          'https://mystore.example.com/password-protection'
        ),
    ],
    [
      'a 301 redirect',
      () => NextResponse.redirect('https://mystore.example.com/new', 301),
    ],
    [
      'a 302 redirect',
      () => NextResponse.redirect('https://mystore.example.com/new', 302),
    ],
  ])('never decorates %s', async (_label, makeResponse) => {
    const { client, get } = clientReturning(settings({ mode: 'enforce' }))
    const response = makeResponse()

    const result = await new CspService(client).apply(response, STORE_ID)

    expect(result).toBe(response)
    expect(get).not.toHaveBeenCalled()
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).toBeNull()
    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
  })

  it('never decorates NextResponse.error()', async () => {
    const { client, get } = clientReturning(settings({ mode: 'enforce' }))
    const response = NextResponse.error() as NextResponse

    const result = await new CspService(client).apply(response, STORE_ID)

    expect(result).toBe(response)
    expect(get).not.toHaveBeenCalled()
    expect(response.headers.get('Content-Security-Policy')).toBeNull()
  })

  it('leaves the response unchanged when there are no settings', async () => {
    const { client } = clientReturning(null)
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
    expect(
      response.headers.get('Content-Security-Policy-Report-Only')
    ).toBeNull()
  })

  it('leaves the response unchanged when mode is off', async () => {
    const { client } = clientReturning(settings({ mode: 'off' }))
    const response = NextResponse.next()

    await new CspService(client).apply(response, STORE_ID)

    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
  })

  it('fails open when the client breaks its contract and throws', async () => {
    const client: SettingsClient = {
      get: jest.fn().mockRejectedValue(new Error('boom')),
    }
    const response = NextResponse.next()

    await expect(
      new CspService(client).apply(response, STORE_ID)
    ).resolves.toBe(response)
    expect(response.headers.get('Reporting-Endpoints')).toBeNull()
  })

  it('builds the headers once per settings record', async () => {
    const record = settings()
    const { client } = clientReturning(record)
    const buildSpy = jest.spyOn(policyBuilder, 'buildCspHeaders')
    const service = new CspService(client)

    await service.apply(NextResponse.next(), STORE_ID)
    await service.apply(NextResponse.next(), STORE_ID)

    expect(buildSpy).toHaveBeenCalledTimes(1)
    ;(client.get as jest.Mock).mockResolvedValue(settings({ version: 2 }))
    await service.apply(NextResponse.next(), STORE_ID)

    expect(buildSpy).toHaveBeenCalledTimes(2)
  })
})
