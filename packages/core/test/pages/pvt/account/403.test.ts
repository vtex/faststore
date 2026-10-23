import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockExecute = vi.hoisted(() => vi.fn())

vi.mock('src/server', () => ({ execute: mockExecute }))
vi.mock('src/server/cms/global', () => ({
  injectGlobalSections: vi.fn(() => ({ sections: [], settings: {} })),
}))
vi.mock('src/server/cms/fetchMyAccountPageContent', () => ({
  fetchMyAccountPageContent: vi.fn(async () => ({ sections: [] })),
}))
vi.mock('src/components/cms/GlobalSections', () => ({
  getGlobalSectionsData: vi.fn(() => [
    Promise.resolve(null),
    Promise.resolve(null),
    Promise.resolve(null),
  ]),
}))

import storeConfig from 'discovery.config'
import { getServerSideProps } from 'src/pages/pvt/account/403'

function makeContext(host: string) {
  return {
    req: { headers: { host } },
    query: {},
    previewData: undefined,
    locale: undefined,
  } as any
}

describe('/pvt/account/403 getServerSideProps refresh-token bypass', () => {
  const originalRefreshToken = storeConfig.experimental.refreshToken

  beforeEach(() => {
    storeConfig.experimental.refreshToken = true
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockExecute.mockResolvedValue({
      data: null,
      errors: [{ extensions: { status: 401 } }],
    })
  })

  afterEach(() => {
    storeConfig.experimental.refreshToken = originalRefreshToken
    vi.restoreAllMocks()
  })

  it.each([
    'localhost:3000',
    '127.0.0.1:3000',
    'brandless-abc123.preview.vtex.app',
  ])('does not ask for a token refresh on %s', async (host) => {
    const result: any = await getServerSideProps(makeContext(host))

    expect(result.props.needsRefreshToken).toBe(false)
  })

  it.each(['brandless.vtex.app', 'brandless.fast.store'])(
    'asks for a token refresh on the production host %s',
    async (host) => {
      const result: any = await getServerSideProps(makeContext(host))

      expect(result.props.needsRefreshToken).toBe(true)
    }
  )
})
