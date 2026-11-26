import { describe, expect, it, vi } from 'vitest'

import { baseline } from '../../../src/server/csp/baseline'
import type { CspSettings } from '../../../src/server/csp/data-plane-api'
import {
  buildCspHeaders,
  MAX_CSP_HEADER_BYTES,
  normalizeDataSource,
} from '../../../src/server/csp/policy-builder'

const STORE_ID = 'test-store'
const REPORT_URL = 'https://endpointcsp.vtex.com/api/report?account=test-store'
const REPORTING = `report-uri ${REPORT_URL}; report-to csp-endpoint`

const VTEX_HOSTS =
  'https://test-store.myvtex.com https://test-store.vtexcommercestable.com.br https://test-store.vtexcommercebeta.com.br'

const BASELINE_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://io2.vtex.com https://activity-flow.vtex.com https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  `connect-src 'self' https://sp.vtex.com ${VTEX_HOSTS} https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
  "img-src 'self' data: blob: https://test-store.vtexassets.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `frame-src 'self' ${VTEX_HOSTS}`,
  `form-action 'self' ${VTEX_HOSTS}`,
  "object-src 'none'",
  "base-uri 'self'",
].join('; ')

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

function build(overrides: Partial<CspSettings> = {}) {
  const warn = vi.fn()
  const headers = buildCspHeaders(baseline, settings(overrides), STORE_ID, {
    warn,
  })

  return { headers, warn }
}

function directive(header: string | undefined, name: string): string {
  const found = (header ?? '')
    .split('; ')
    .find((part) => part.startsWith(`${name} `))

  if (!found) {
    throw new Error(`directive ${name} not found in ${header}`)
  }

  return found
}

describe('buildCspHeaders', () => {
  describe('modes', () => {
    it('returns null when mode is off and frameAncestors is absent', () => {
      const { headers, warn } = build({ mode: 'off' })

      expect(headers).toBeNull()
      expect(warn).not.toHaveBeenCalled()
    })

    it('returns null when mode and frameAncestors.mode are both off', () => {
      const { headers } = build({
        mode: 'off',
        frameAncestors: { mode: 'off', sources: ["'self'"] },
      })

      expect(headers).toBeNull()
    })

    it('report-only: one Report-Only header with the full policy', () => {
      const { headers, warn } = build({ mode: 'report-only' })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy-Report-Only': `${BASELINE_POLICY}; frame-ancestors 'self'; ${REPORTING}`,
      })
      expect(warn).not.toHaveBeenCalled()
    })

    it('enforce: one enforced header with the full policy including frame-ancestors', () => {
      const { headers } = build({
        mode: 'enforce',
        frameAncestors: {
          sources: ["'self'", 'https://{account}.myvtex.com'],
        },
      })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': `${BASELINE_POLICY}; frame-ancestors 'self' https://test-store.myvtex.com; ${REPORTING}`,
      })
    })

    it('report-only with enforced framing: two headers (Scenario 2)', () => {
      const { headers } = build({
        mode: 'report-only',
        frameAncestors: {
          mode: 'enforce',
          sources: ["'self'", 'https://{account}.myvtex.com'],
        },
      })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': `frame-ancestors 'self' https://test-store.myvtex.com; ${REPORTING}`,
        'Content-Security-Policy-Report-Only': `${BASELINE_POLICY}; ${REPORTING}`,
      })
    })

    it('enforce with report-only framing: two headers', () => {
      const { headers } = build({
        mode: 'enforce',
        frameAncestors: {
          mode: 'report-only',
          sources: ['https://admin.example.com'],
        },
      })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': `${BASELINE_POLICY}; ${REPORTING}`,
        'Content-Security-Policy-Report-Only': `frame-ancestors 'self' https://admin.example.com; ${REPORTING}`,
      })
    })

    it('off with enforced framing: only frame-ancestors is enforced', () => {
      const { headers } = build({
        mode: 'off',
        frameAncestors: { mode: 'enforce', sources: [] },
      })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': `frame-ancestors 'self'; ${REPORTING}`,
      })
    })

    it('report-only with framing off: full policy without frame-ancestors', () => {
      const { headers } = build({
        mode: 'report-only',
        frameAncestors: { mode: 'off', sources: ["'self'"] },
      })

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy-Report-Only': `${BASELINE_POLICY}; ${REPORTING}`,
      })
    })

    it('always carries both report-uri and report-to in every CSP header', () => {
      const { headers } = build({
        mode: 'report-only',
        frameAncestors: { mode: 'enforce', sources: ["'self'"] },
      })

      for (const value of [
        headers?.['Content-Security-Policy'],
        headers?.['Content-Security-Policy-Report-Only'],
      ]) {
        expect(value).toContain(`report-uri ${REPORT_URL}`)
        expect(value).toContain('report-to csp-endpoint')
      }
    })
  })

  describe('baseline and additions', () => {
    it('substitutes {account} in the baseline with the store id', () => {
      const { headers } = build()
      const value = headers?.['Content-Security-Policy-Report-Only'] ?? ''

      expect(value).not.toContain('{account}')
      expect(value).toContain('https://test-store.vtexassets.com')
    })

    it('appends extra sources after the baseline sources of the same directive', () => {
      const { headers } = build({
        extraSources: {
          'connect-src': ['https://cdn.example.com', 'https://*.example.org'],
          'script-src': ['https://cdn.cloud.weni.ai'],
        },
      })
      const value = headers?.['Content-Security-Policy-Report-Only']

      expect(directive(value, 'connect-src')).toBe(
        `connect-src 'self' https://sp.vtex.com ${VTEX_HOSTS} https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://cdn.example.com https://*.example.org`
      )
      expect(directive(value, 'script-src')).toMatch(
        / https:\/\/www\.googletagmanager\.com https:\/\/cdn\.cloud\.weni\.ai$/
      )
    })

    it('substitutes {account} in data sources', () => {
      const { headers } = build({
        extraSources: { 'img-src': ['https://{account}.vteximg.com.br'] },
      })

      expect(
        directive(headers?.['Content-Security-Policy-Report-Only'], 'img-src')
      ).toContain('https://test-store.vteximg.com.br')
    })

    it('deduplicates sources against the baseline and within data, ignoring case', () => {
      const { headers } = build({
        extraSources: {
          'connect-src': [
            'https://cdn.example.com',
            'https://SP.vtex.com',
            "'SELF'",
            'https://cdn.example.com',
            'https://{account}.myvtex.com',
          ],
        },
      })
      const connectSrc = directive(
        headers?.['Content-Security-Policy-Report-Only'],
        'connect-src'
      ).split(' ')

      expect(connectSrc.length).toBe(new Set(connectSrc).size)
      expect(connectSrc.filter((s) => s === 'https://cdn.example.com')).toEqual(
        ['https://cdn.example.com']
      )
      expect(connectSrc[connectSrc.length - 1]).toBe('https://cdn.example.com')
    })

    it('appends the record frame-ancestors to the default, deduplicated', () => {
      const { headers } = build({
        mode: 'enforce',
        frameAncestors: {
          sources: [
            'https://admin.example.com',
            'https://admin.example.com',
            "'self'",
          ],
        },
      })

      expect(
        directive(headers?.['Content-Security-Policy'], 'frame-ancestors')
      ).toBe("frame-ancestors 'self' https://admin.example.com")
    })

    it("cannot narrow frame-ancestors: 'none' from data is dropped", () => {
      const { headers } = build({
        mode: 'enforce',
        frameAncestors: { sources: ["'none'"] },
      })

      expect(
        directive(headers?.['Content-Security-Policy'], 'frame-ancestors')
      ).toBe("frame-ancestors 'self'")
    })

    it("adds data sources to a 'none' directive and drops the redundant 'none'", () => {
      const { headers } = build({
        extraSources: { 'object-src': ['https://plugins.example.com'] },
      })

      expect(
        directive(
          headers?.['Content-Security-Policy-Report-Only'],
          'object-src'
        )
      ).toBe('object-src https://plugins.example.com')
    })
  })

  describe('validation', () => {
    const unsafe = [
      "'unsafe-inline'",
      "'unsafe-eval'",
      "'unsafe-hashes'",
      "'UNSAFE-INLINE'",
      "'wasm-unsafe-eval'",
      "'strict-dynamic'",
      "'nonce-abc123'",
      "'sha256-abc123='",
      '*',
      'http:',
      'https:',
      'http://cdn.example.com',
      'cdn.example.com',
      'https://*',
      'https://*.com',
      'https://*.*.example.com',
      'https://cdn.example.com/path',
      'https://cdn.example.com?x=1',
      'https://cdn.example.com:99999',
      'https://user@cdn.example.com',
      'https://cdn.example.com; script-src *',
      'https://cdn.example.com report-uri https://evil.example.com',
      'javascript:',
      '',
    ]

    it.each(unsafe)('rejects %j from data', (source) => {
      expect(normalizeDataSource(source, STORE_ID)).toBeNull()
    })

    it.each([
      ["'self'", "'self'"],
      ["'none'", "'none'"],
      ['data:', 'data:'],
      ['blob:', 'blob:'],
      ['https://cdn.example.com', 'https://cdn.example.com'],
      ['https://*.example.com', 'https://*.example.com'],
      ['https://cdn.example.com:8443', 'https://cdn.example.com:8443'],
      ['  https://CDN.Example.com  ', 'https://cdn.example.com'],
      ['https://{account}.myvtex.com', 'https://test-store.myvtex.com'],
    ])('accepts %j as %j', (source, expected) => {
      expect(normalizeDataSource(source, STORE_ID)).toBe(expected)
    })

    it('drops unsafe entries from extraSources and logs them once', () => {
      const { headers, warn } = build({
        extraSources: {
          'img-src': ["'unsafe-inline'", 'https://img.example.com'],
          'connect-src': ['http://insecure.example.com', '*'],
          'script-src': ["'unsafe-eval'", "'unsafe-hashes'"],
        },
      })
      const value = headers?.['Content-Security-Policy-Report-Only']

      expect(directive(value, 'img-src')).toBe(
        "img-src 'self' data: blob: https://test-store.vtexassets.com https://www.googletagmanager.com https://www.google-analytics.com https://img.example.com"
      )
      expect(directive(value, 'connect-src')).not.toContain('insecure')
      expect(directive(value, 'connect-src')).not.toMatch(/ \*( |$)/)
      expect(directive(value, 'script-src')).not.toContain("'unsafe-hashes'")
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][0]).toContain("'unsafe-inline'")
      expect(warn.mock.calls[0][0]).toContain('http://insecure.example.com')
    })

    it('drops unknown directives from extraSources', () => {
      const { headers, warn } = build({
        extraSources: {
          'frame-ancestors': ['https://evil.example.com'],
          'report-uri': ['https://evil.example.com'],
        } as CspSettings['extraSources'],
      })

      expect(headers?.['Content-Security-Policy-Report-Only']).not.toContain(
        'evil.example.com'
      )
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][0]).toContain('frame-ancestors: unknown')
    })

    it('falls back to the default frame-ancestors when every record source is invalid', () => {
      const { headers, warn } = build({
        mode: 'enforce',
        frameAncestors: { sources: ['*', 'http://example.com'] },
      })

      expect(
        directive(headers?.['Content-Security-Policy'], 'frame-ancestors')
      ).toBe("frame-ancestors 'self'")
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('uses a valid custom report endpoint with the account in the query string', () => {
      const { headers } = build({
        reportEndpoint: 'https://reports.example.com/csp?source=fs',
      })
      const url = 'https://reports.example.com/csp?source=fs&account=test-store'

      expect(headers?.['Reporting-Endpoints']).toBe(`csp-endpoint="${url}"`)
      expect(headers?.['Content-Security-Policy-Report-Only']).toContain(
        `report-uri ${url}; report-to csp-endpoint`
      )
    })

    it.each([
      'http://reports.example.com/csp',
      'https://reports.example.com/a;script-src *',
      'https://reports.example.com/a,b',
      'https://user:pass@reports.example.com/csp',
      'not a url',
    ])(
      'ignores invalid report endpoint %j and uses the default',
      (endpoint) => {
        const { headers, warn } = build({ reportEndpoint: endpoint })

        expect(headers?.['Reporting-Endpoints']).toBe(
          `csp-endpoint="${REPORT_URL}"`
        )
        expect(warn).toHaveBeenCalledTimes(1)
      }
    )

    it('returns null for a store id that is not a host label', () => {
      const warn = vi.fn()

      expect(
        buildCspHeaders(baseline, settings(), 'bad store;', { warn })
      ).toBeNull()
      expect(warn).toHaveBeenCalledTimes(1)
    })
  })

  describe('size cap', () => {
    it(`returns null and logs when a header exceeds ${MAX_CSP_HEADER_BYTES} bytes`, () => {
      const many = Array.from(
        { length: 400 },
        (_, i) => `https://cdn-${i}.example.com`
      )
      const { headers, warn } = build({
        extraSources: { 'connect-src': many },
      })

      expect(headers).toBeNull()
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('8192-byte'))
    })

    it('keeps headers under the cap', () => {
      const some = Array.from(
        { length: 20 },
        (_, i) => `https://cdn-${i}.example.com`
      )
      const { headers } = build({
        mode: 'enforce',
        extraSources: { 'connect-src': some, 'img-src': some },
      })
      const value = headers?.['Content-Security-Policy'] ?? ''

      expect(value.length).toBeGreaterThan(0)
      expect(value.length).toBeLessThanOrEqual(MAX_CSP_HEADER_BYTES)
    })
  })

  describe('determinism', () => {
    it('returns the same headers for the same inputs', () => {
      const input = settings({
        mode: 'report-only',
        frameAncestors: { mode: 'enforce', sources: ["'self'"] },
        extraSources: {
          'connect-src': ['https://b.example.com', 'https://a.example.com'],
        },
      })

      const first = buildCspHeaders(baseline, input, STORE_ID, {
        warn: vi.fn(),
      })
      const second = buildCspHeaders(baseline, input, STORE_ID, {
        warn: vi.fn(),
      })

      expect(second).toEqual(first)
    })

    it('does not mutate the baseline or the settings', () => {
      const input = settings({
        extraSources: { 'connect-src': ['https://cdn.example.com'] },
      })
      const inputCopy = JSON.parse(JSON.stringify(input))
      const baselineCopy = JSON.parse(JSON.stringify(baseline))

      buildCspHeaders(baseline, input, STORE_ID, { warn: vi.fn() })

      expect(input).toEqual(inputCopy)
      expect(baseline).toEqual(baselineCopy)
    })
  })
})
