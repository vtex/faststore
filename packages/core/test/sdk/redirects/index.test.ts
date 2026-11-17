import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const STORE_ID = 'teststore'
const REWRITER_URL = `https://${STORE_ID}.myvtex.com/_v/public/redirect-evaluate`

const MATCHER_MODULE = 'src/customizations/src/redirects/index'

async function loadGetRedirect(matcherExport?: unknown) {
  vi.resetModules()

  vi.doMock('discovery.config', () => ({
    default: { api: { storeId: STORE_ID } },
  }))

  if (matcherExport === undefined) {
    vi.doUnmock(MATCHER_MODULE)
  } else {
    vi.doMock(MATCHER_MODULE, () => ({ matcher: matcherExport }))
  }

  const { getRedirect } = await import('../../../src/sdk/redirects')

  return getRedirect
}

function mockRewriter({ ok, body }: { ok: boolean; body?: unknown }) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => body })

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

describe('getRedirect', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.doUnmock('discovery.config')
    vi.doUnmock(MATCHER_MODULE)
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('skips asset paths without querying the rewriter', async () => {
    const fetchMock = mockRewriter({ ok: false })
    const getRedirect = await loadGetRedirect()

    await expect(getRedirect({ pathname: '/icons.json' })).resolves.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns a custom matcher result without querying the rewriter', async () => {
    const fetchMock = mockRewriter({ ok: false })
    const getRedirect = await loadGetRedirect(() => ({
      destination: '/promoção',
      permanent: false,
    }))

    await expect(getRedirect({ pathname: '/sale' })).resolves.toEqual({
      destination: encodeURI('/promoção'),
      permanent: false,
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('falls back to the rewriter when the matcher export is not a function', async () => {
    const fetchMock = mockRewriter({
      ok: true,
      body: { location: '/eletrodomesticos', status: 308 },
    })
    // A store shipping `src/redirects.json` can shadow the customization
    // module, which makes the imported `matcher` an array instead of a function.
    const getRedirect = await loadGetRedirect([])

    await expect(getRedirect({ pathname: '/old-page' })).resolves.toEqual({
      destination: '/eletrodomesticos',
      permanent: true,
    })
    expect(fetchMock).toHaveBeenCalledWith(`${REWRITER_URL}/old-page`)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('warns only once about an invalid matcher export', async () => {
    mockRewriter({ ok: false })
    const getRedirect = await loadGetRedirect([])

    await getRedirect({ pathname: '/first' })
    await getRedirect({ pathname: '/second' })

    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('does not leak a mocked matcher into a later default load', async () => {
    mockRewriter({ ok: false })

    const withInvalidMatcher = await loadGetRedirect([])
    await expect(withInvalidMatcher({ pathname: '/first' })).resolves.toBeNull()

    const withStubMatcher = await loadGetRedirect()
    await expect(withStubMatcher({ pathname: '/second' })).resolves.toBeNull()

    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('marks non-permanent rewriter redirects as temporary', async () => {
    mockRewriter({ ok: true, body: { location: '/new', status: 307 } })
    const getRedirect = await loadGetRedirect()

    await expect(getRedirect({ pathname: '/old' })).resolves.toEqual({
      destination: '/new',
      permanent: false,
    })
  })

  it('returns null when the rewriter has no rule for the path', async () => {
    mockRewriter({ ok: false })
    const getRedirect = await loadGetRedirect()

    await expect(getRedirect({ pathname: '/no-rule' })).resolves.toBeNull()
  })
})
