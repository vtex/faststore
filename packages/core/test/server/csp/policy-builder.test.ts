import { baseline } from '../../../src/server/csp/baseline'
import type { Baseline } from '../../../src/server/csp/baseline'
import {
  buildCspHeaders,
  MAX_CSP_HEADER_BYTES,
} from '../../../src/server/csp/policy-builder'
import type { CspSettings } from '../../../src/server/csp/settings-client'

const STORE_ID = 'mystore'
const REPORT_URL = 'https://endpointcsp.vtex.com/api/report?account=mystore'
const REPORTING = `report-uri ${REPORT_URL}; report-to csp-endpoint`
const VTEX_HOSTS =
  'https://mystore.myvtex.com https://mystore.vtexcommercestable.com.br https://mystore.vtexcommercebeta.com.br'

/** Full baseline policy for `mystore`, without frame-ancestors and reporting. */
const BASELINE_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://io2.vtex.com https://activity-flow.vtex.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://mystore.vtexassets.com https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://sp.vtex.com ${VTEX_HOSTS} https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com`,
  `frame-src 'self' ${VTEX_HOSTS}`,
  "worker-src 'self' blob:",
  `form-action 'self' ${VTEX_HOSTS}`,
  "object-src 'none'",
  "base-uri 'self'",
]

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

/** Parses a policy into `{ directive: sources[] }`. */
function directivesOf(policy: string | undefined): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  for (const directive of (policy ?? '').split('; ')) {
    const [name, ...sources] = directive.split(' ')
    result[name] = sources
  }

  return result
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      deepFreeze((value as Record<string, unknown>)[key])
    }

    Object.freeze(value)
  }

  return value
}

describe('buildCspHeaders', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  describe('modes', () => {
    it('returns null when mode is off and frameAncestors is absent', () => {
      expect(
        buildCspHeaders(baseline, settings({ mode: 'off' }), STORE_ID)
      ).toBeNull()
    })

    it('returns null when mode and frameAncestors.mode are both off', () => {
      expect(
        buildCspHeaders(
          baseline,
          settings({
            mode: 'off',
            frameAncestors: { mode: 'off', sources: ["'self'"] },
          }),
          STORE_ID
        )
      ).toBeNull()
    })

    it('report-only: sends the full policy as Report-Only only', () => {
      const headers = buildCspHeaders(baseline, settings(), STORE_ID)

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy-Report-Only': [
          ...BASELINE_DIRECTIVES,
          "frame-ancestors 'self'",
          REPORTING,
        ].join('; '),
      })
    })

    it('enforce: sends one Content-Security-Policy header with the full policy', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({ mode: 'enforce' }),
        STORE_ID
      )

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': [
          ...BASELINE_DIRECTIVES,
          "frame-ancestors 'self'",
          REPORTING,
        ].join('; '),
      })
    })

    it('report-only with enforced framing: frame-ancestors enforced, the rest report-only', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          mode: 'report-only',
          frameAncestors: {
            mode: 'enforce',
            sources: ["'self'", 'https://{account}.myvtex.com'],
          },
        }),
        STORE_ID
      )

      expect(headers?.['Content-Security-Policy']).toBe(
        `frame-ancestors 'self' https://mystore.myvtex.com; ${REPORTING}`
      )
      expect(headers?.['Content-Security-Policy-Report-Only']).toBe(
        [...BASELINE_DIRECTIVES, REPORTING].join('; ')
      )
      expect(headers?.['Reporting-Endpoints']).toBe(
        `csp-endpoint="${REPORT_URL}"`
      )
    })

    it('enforce with report-only framing: splits the headers the other way', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          mode: 'enforce',
          frameAncestors: { mode: 'report-only', sources: ["'self'"] },
        }),
        STORE_ID
      )

      expect(headers?.['Content-Security-Policy']).toBe(
        [...BASELINE_DIRECTIVES, REPORTING].join('; ')
      )
      expect(headers?.['Content-Security-Policy-Report-Only']).toBe(
        `frame-ancestors 'self'; ${REPORTING}`
      )
    })

    it('off with enforced framing: sends only frame-ancestors', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          mode: 'off',
          frameAncestors: { mode: 'enforce', sources: ["'self'"] },
        }),
        STORE_ID
      )

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': `frame-ancestors 'self'; ${REPORTING}`,
      })
    })

    it('enforce with framing off: sends the full policy without frame-ancestors', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          mode: 'enforce',
          frameAncestors: { mode: 'off', sources: ["'self'"] },
        }),
        STORE_ID
      )

      expect(headers).toEqual({
        'Reporting-Endpoints': `csp-endpoint="${REPORT_URL}"`,
        'Content-Security-Policy': [...BASELINE_DIRECTIVES, REPORTING].join(
          '; '
        ),
      })
    })

    it('frameAncestors.mode defaults to mode', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          mode: 'enforce',
          frameAncestors: { sources: ["'self'", 'https://cms.example.com'] },
        }),
        STORE_ID
      )

      expect(headers?.['Content-Security-Policy-Report-Only']).toBeUndefined()
      expect(
        directivesOf(headers?.['Content-Security-Policy'])['frame-ancestors']
      ).toEqual(["'self'", 'https://cms.example.com'])
    })
  })

  describe('sources', () => {
    it('substitutes {account} everywhere', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: { 'connect-src': ['https://{account}.example.com'] },
        }),
        STORE_ID
      )
      const policy = headers?.['Content-Security-Policy-Report-Only'] ?? ''

      expect(policy).not.toContain('{account}')
      expect(directivesOf(policy)['connect-src']).toContain(
        'https://mystore.example.com'
      )
      expect(directivesOf(policy)['img-src']).toContain(
        'https://mystore.vtexassets.com'
      )
    })

    it('appends extra sources after the baseline without duplicates', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: {
            'connect-src': [
              'https://cdn.example.com',
              'https://sp.vtex.com',
              'https://cdn.example.com',
              'https://{account}.myvtex.com',
              'HTTPS://CDN.EXAMPLE.COM/',
            ],
          },
        }),
        STORE_ID
      )
      const connectSrc = directivesOf(
        headers?.['Content-Security-Policy-Report-Only']
      )['connect-src']

      expect(connectSrc).toEqual([
        "'self'",
        'https://sp.vtex.com',
        'https://mystore.myvtex.com',
        'https://mystore.vtexcommercestable.com.br',
        'https://mystore.vtexcommercebeta.com.br',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://www.googletagmanager.com',
        'https://cdn.example.com',
      ])
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('keeps every baseline source when data adds sources', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: {
            'script-src': ['https://cdn.example.com'],
            'img-src': ['https://images.example.com'],
          },
        }),
        STORE_ID
      )
      const directives = directivesOf(
        headers?.['Content-Security-Policy-Report-Only']
      )
      const baselineDirectives = directivesOf(BASELINE_DIRECTIVES.join('; '))

      for (const name of Object.keys(baselineDirectives)) {
        expect(directives[name]).toEqual(
          expect.arrayContaining(baselineDirectives[name])
        )
      }
    })

    it.each([
      ["'unsafe-inline'"],
      ["'unsafe-eval'"],
      ["'unsafe-hashes'"],
      ["'wasm-unsafe-eval'"],
      ["'strict-dynamic'"],
      ["'nonce-abc'"],
      ['http://cdn.example.com'],
      ['http:'],
      ['https:'],
      ['*'],
      ['https://*'],
      ['https://*.com'],
      ['https://*.*.example.com'],
      ['https://cdn.example.com/path'],
      ['https://user:pass@cdn.example.com'],
      ['javascript:'],
      ["https://a.example.com; script-src 'unsafe-inline'"],
      ['https://a.example.com https://b.example.com'],
      [''],
    ])('rejects %p from data', (source) => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: { 'connect-src': [source], 'object-src': [source] },
          frameAncestors: { sources: [source] },
        }),
        STORE_ID
      )
      const directives = directivesOf(
        headers?.['Content-Security-Policy-Report-Only']
      )

      expect(directives['connect-src']).toEqual(
        directivesOf(BASELINE_DIRECTIVES.join('; '))['connect-src']
      )
      expect(directives['object-src']).toEqual(["'none'"])
      expect(directives['frame-ancestors']).toEqual(["'self'"])
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('dropped invalid')
    })

    it('accepts keywords, schemes, wildcard origins and ports from data', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: {
            'connect-src': [
              'https://*.example.com',
              'https://api.example.com:8443',
              'data:',
              'blob:',
            ],
          },
        }),
        STORE_ID
      )
      const connectSrc = directivesOf(
        headers?.['Content-Security-Policy-Report-Only']
      )['connect-src']

      expect(connectSrc).toEqual(
        expect.arrayContaining([
          'https://*.example.com',
          'https://api.example.com:8443',
          'data:',
          'blob:',
        ])
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('drops unknown directives from extraSources', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: {
            'script-src-elem': ['https://cdn.example.com'],
            'frame-ancestors': ['https://evil.example.com'],
          } as unknown as CspSettings['extraSources'],
        }),
        STORE_ID
      )
      const policy = headers?.['Content-Security-Policy-Report-Only'] ?? ''

      expect(policy).not.toContain('script-src-elem')
      expect(policy).not.toContain('evil.example.com')
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('unknown directive')
    })

    it("drops 'none' when data adds a source to a 'none' directive", () => {
      const headers = buildCspHeaders(
        baseline,
        settings({
          extraSources: { 'object-src': ['https://plugins.example.com'] },
        }),
        STORE_ID
      )

      expect(
        directivesOf(headers?.['Content-Security-Policy-Report-Only'])[
          'object-src'
        ]
      ).toEqual(['https://plugins.example.com'])
    })

    it('appends data frame-ancestors sources to the baseline and keeps the baseline when none is valid', () => {
      const custom = buildCspHeaders(
        baseline,
        settings({
          frameAncestors: {
            sources: [
              "'self'",
              'https://{account}.myvtex.com',
              'http://evil.example.com',
            ],
          },
        }),
        STORE_ID
      )
      const fallback = buildCspHeaders(
        baseline,
        settings({ frameAncestors: { sources: ['*'] } }),
        STORE_ID
      )
      const narrowed = buildCspHeaders(
        baseline,
        settings({ frameAncestors: { sources: ["'none'"] } }),
        STORE_ID
      )

      expect(
        directivesOf(custom?.['Content-Security-Policy-Report-Only'])[
          'frame-ancestors'
        ]
      ).toEqual(["'self'", 'https://mystore.myvtex.com'])
      expect(
        directivesOf(fallback?.['Content-Security-Policy-Report-Only'])[
          'frame-ancestors'
        ]
      ).toEqual(["'self'"])
      // 'none' cannot narrow the baseline: it is dropped next to 'self'.
      expect(
        directivesOf(narrowed?.['Content-Security-Policy-Report-Only'])[
          'frame-ancestors'
        ]
      ).toEqual(["'self'"])
    })
  })

  describe('reporting', () => {
    it('always sends report-uri and report-to with the account in the query', () => {
      const headers = buildCspHeaders(baseline, settings(), STORE_ID)
      const directives = directivesOf(
        headers?.['Content-Security-Policy-Report-Only']
      )

      expect(directives['report-uri']).toEqual([REPORT_URL])
      expect(directives['report-to']).toEqual(['csp-endpoint'])
    })

    it('uses a valid https reportEndpoint from data', () => {
      const headers = buildCspHeaders(
        baseline,
        settings({ reportEndpoint: 'https://reports.example.com/csp?x=1' }),
        STORE_ID
      )
      const expected = 'https://reports.example.com/csp?x=1&account=mystore'

      expect(headers?.['Reporting-Endpoints']).toBe(
        `csp-endpoint="${expected}"`
      )
      expect(
        directivesOf(headers?.['Content-Security-Policy-Report-Only'])[
          'report-uri'
        ]
      ).toEqual([expected])
    })

    it.each([
      ['http://reports.example.com/csp'],
      ['https://reports.example.com/a;b'],
      ['https://user:pass@reports.example.com/csp'],
      ['not a url'],
    ])('falls back to the default endpoint for %p', (reportEndpoint) => {
      const headers = buildCspHeaders(
        baseline,
        settings({ reportEndpoint }),
        STORE_ID
      )

      expect(headers?.['Reporting-Endpoints']).toBe(
        `csp-endpoint="${REPORT_URL}"`
      )
      expect(warnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('limits and purity', () => {
    it(`returns null when a header exceeds ${MAX_CSP_HEADER_BYTES} bytes`, () => {
      const manyOrigins = Array.from(
        { length: 400 },
        (_, index) => `https://cdn${index}.example.com`
      )
      const headers = buildCspHeaders(
        baseline,
        settings({ extraSources: { 'connect-src': manyOrigins } }),
        STORE_ID
      )

      expect(headers).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${MAX_CSP_HEADER_BYTES}-byte cap`)
      )
    })

    it('accepts a header of exactly the cap and rejects one byte more', () => {
      const base = buildCspHeaders(baseline, settings(), STORE_ID)
      const baseSize =
        base?.['Content-Security-Policy-Report-Only']?.length ?? 0

      /** A host name of exactly `length` characters, in valid DNS labels. */
      function hostOfLength(length: number): string {
        const labels: string[] = []
        let remaining = length

        while (remaining > 0) {
          // Leave room for a dot and one more character when splitting.
          const size = remaining <= 63 ? remaining : Math.min(63, remaining - 2)
          labels.push('a'.repeat(size))
          remaining -= remaining > size ? size + 1 : size
        }

        return labels.join('.')
      }

      /** An https origin that adds exactly `bytes` to connect-src. */
      function originAdding(bytes: number): string {
        // A separating space, `https://`, the host, then `.com`.
        const hostLength = bytes - ' https://'.length - '.com'.length

        return `https://${hostOfLength(hostLength)}.com`
      }

      const atCap = originAdding(MAX_CSP_HEADER_BYTES - baseSize)
      const overCap = originAdding(MAX_CSP_HEADER_BYTES - baseSize + 1)
      const accepted = buildCspHeaders(
        baseline,
        settings({ extraSources: { 'connect-src': [atCap] } }),
        STORE_ID
      )
      const rejected = buildCspHeaders(
        baseline,
        settings({ extraSources: { 'connect-src': [overCap] } }),
        STORE_ID
      )

      expect(accepted?.['Content-Security-Policy-Report-Only']).toHaveLength(
        MAX_CSP_HEADER_BYTES
      )
      expect(rejected).toBeNull()
    })

    it('returns null for a store id that is not an account name', () => {
      expect(buildCspHeaders(baseline, settings(), 'bad;id')).toBeNull()
      expect(buildCspHeaders(baseline, settings(), '')).toBeNull()
    })

    it('is deterministic and does not mutate its inputs', () => {
      const frozenBaseline = deepFreeze(
        JSON.parse(JSON.stringify(baseline)) as Baseline
      )
      const input = deepFreeze(
        settings({
          mode: 'report-only',
          frameAncestors: { mode: 'enforce', sources: ["'self'"] },
          extraSources: {
            'connect-src': ['https://b.example.com', 'https://a.example.com'],
            'script-src': ["'unsafe-eval'"],
          },
        })
      )

      const first = buildCspHeaders(frozenBaseline, input, STORE_ID)
      const second = buildCspHeaders(frozenBaseline, input, STORE_ID)

      expect(first).toEqual(second)
      expect(first).toEqual(buildCspHeaders(baseline, input, STORE_ID))
      expect(
        directivesOf(first?.['Content-Security-Policy-Report-Only'])[
          'connect-src'
        ].slice(-2)
      ).toEqual(['https://b.example.com', 'https://a.example.com'])
    })
  })
})
