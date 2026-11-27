import { describe, expect, it, vi } from 'vitest'

const mockExecute = vi.hoisted(() => vi.fn())
const mockGetB2BSessionClaims = vi.hoisted(() => vi.fn())
const mockGetIsB2BBuyer = vi.hoisted(() => vi.fn(() => true))
const mockGetMyAccountRedirect = vi.hoisted(() =>
  vi.fn(() => ({ isFaststoreMyAccountEnabled: true, redirect: undefined }))
)

vi.mock('src/server', () => ({ execute: mockExecute }))
vi.mock('src/server/cms/global', () => ({
  injectGlobalSections: vi.fn(() => ({ sections: [], settings: {} })),
}))
vi.mock('src/server/cms/myAccountDefaultSections', () => ({
  extractAccountNavigationData: vi.fn(() => ({
    pageSections: [],
    navigationData: {},
  })),
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
vi.mock('src/sdk/account/getB2BSessionClaims', () => ({
  getB2BSessionClaims: mockGetB2BSessionClaims,
}))
vi.mock('src/sdk/account/getIsB2BBuyer', () => ({
  getIsB2BBuyer: mockGetIsB2BBuyer,
}))
vi.mock('src/utils/myAccountRedirect', () => ({
  getMyAccountRedirect: mockGetMyAccountRedirect,
}))

import { getServerSideProps } from 'src/pages/pvt/account/cards/index'

function makeContext() {
  return {
    req: { headers: {} },
    query: {},
    previewData: undefined,
    locale: undefined,
  } as any
}

const CARD_PERSONAL = { accountId: 'p1', origin: 'personal' }
const CARD_SHARED = { accountId: 's1', origin: 'shared' }

function mockSuccessfulExecute({
  personal = [CARD_PERSONAL],
  shared = [CARD_SHARED],
  hasAdHocCardAccess = true,
  accountName = 'Jane Buyer',
} = {}) {
  mockExecute.mockResolvedValueOnce({
    data: {
      personalCards: { list: personal },
      sharedCards: { list: shared },
      accountProfile: { name: accountName },
      hasAdHocCardAccess,
    },
    errors: undefined,
  })
}

describe('Cards page getServerSideProps', () => {
  it('redirects when the FastStore My Account experience is disabled', async () => {
    mockGetMyAccountRedirect.mockReturnValueOnce({
      isFaststoreMyAccountEnabled: false,
      redirect: { destination: '/account', permanent: false },
    })
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: false,
      hasCustomerId: false,
    })

    const result = await getServerSideProps(makeContext())

    expect(result).toEqual({
      redirect: { destination: '/account', permanent: false },
    })
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it('redirects to /pvt/account/404 when the buyer has no org association, before querying', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: false,
      hasCustomerId: false,
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.redirect.destination).toBe('/pvt/account/404')
    // Gated ahead of the Saved-cards call: a buyer who cannot reach the page
    // must not cost a round trip to a service that answers 500 for shoppers
    // with no customer record.
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it('redirects to /pvt/account/403 when the query fails with 401/403', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: false,
    })
    mockExecute.mockResolvedValueOnce({
      data: undefined,
      errors: [{ extensions: { status: 401 } }],
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.redirect.destination).toContain('/pvt/account/403')
  })

  it('renders the error state (no redirect) when the query fails with a non-auth status', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: false,
    })
    mockExecute.mockResolvedValueOnce({
      data: undefined,
      errors: [{ extensions: { status: 502 } }],
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.redirect).toBeUndefined()
    expect(result.props.accountPageData.hasError).toBe(true)
    expect(result.props.accountPageData.personalCards).toEqual([])
    expect(result.props.accountPageData.sharedCards).toEqual([])
  })

  it('reads each tab from its own query and computes canViewPersonalCards', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockSuccessfulExecute()

    const result: any = await getServerSideProps(makeContext())

    expect(result.props.accountPageData.personalCards).toEqual([CARD_PERSONAL])
    expect(result.props.accountPageData.sharedCards).toEqual([CARD_SHARED])
    expect(result.props.accountPageData.canViewPersonalCards).toBe(true)
    expect(result.props.accountPageData.hasOrgAssociation).toBe(true)
    expect(result.props.accountName).toBe('Jane Buyer')
    expect(result.props).not.toHaveProperty('hasAdHocCardAccess')
  })

  it('does not gate the route on useAdHocCard: canViewPersonalCards is false but an org member still gets the page', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: false,
    })
    mockSuccessfulExecute({ hasAdHocCardAccess: false })

    const result: any = await getServerSideProps(makeContext())

    expect(result.redirect).toBeUndefined()
    expect(result.props.accountPageData.canViewPersonalCards).toBe(false)
  })

  it('drops personal cards from the SSR payload in the sharedOnly combination (hasOrgAssociation, canViewPersonalCards false)', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: false,
    })
    mockSuccessfulExecute({ hasAdHocCardAccess: false })

    const result: any = await getServerSideProps(makeContext())

    // The UI hides the Personal tab only for this combination (sharedOnly);
    // this asserts the data itself never reaches __NEXT_DATA__ either (PR
    // review, REQ-6's "hide" intent) — not just that the tab is visually
    // hidden.
    expect(result.props.accountPageData.personalCards).toEqual([])
    expect(result.props.accountPageData.sharedCards).toEqual([CARD_SHARED])
  })

  // The previous FR-7 case ("keeps personal cards in the payload when there is
  // no org association") is gone by design: O1 was resolved by gating the
  // route on org membership, so that combination now 404s and never reaches a
  // payload at all. See the no-org-association gate test above.

  it('defaults hasAdHocCardAccess to allowed when the query field is missing', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockExecute.mockResolvedValueOnce({
      data: {
        personalCards: { list: [] },
        sharedCards: { list: [] },
        accountProfile: { name: 'Jane' },
        hasAdHocCardAccess: undefined,
      },
      errors: undefined,
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.props.accountPageData.canViewPersonalCards).toBe(true)
  })

  it('keeps only shared cards in the Shared tab even if the shared route returns a personal one', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockSuccessfulExecute({ shared: [CARD_SHARED, CARD_PERSONAL] })

    const result: any = await getServerSideProps(makeContext())

    expect(result.props.accountPageData.sharedCards).toEqual([CARD_SHARED])
    expect(result.props.accountPageData.personalCards).toEqual([CARD_PERSONAL])
  })

  it('flags only the Personal tab when just the personal query fails', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockExecute.mockResolvedValueOnce({
      data: {
        personalCards: null,
        sharedCards: { list: [CARD_SHARED] },
        accountProfile: { name: 'Jane' },
        hasAdHocCardAccess: true,
      },
      errors: [{ path: ['personalCards'], extensions: { status: 502 } }],
    })

    const result: any = await getServerSideProps(makeContext())

    const data = result.props.accountPageData
    expect(data.hasError).toBe(false)
    expect(data.personalHasError).toBe(true)
    expect(data.sharedHasError).toBe(false)
    expect(data.personalCards).toEqual([])
    expect(data.sharedCards).toEqual([CARD_SHARED])
  })

  it('flags only the Shared tab when just the shared query fails', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockExecute.mockResolvedValueOnce({
      data: {
        personalCards: { list: [CARD_PERSONAL] },
        sharedCards: null,
        accountProfile: { name: 'Jane' },
        hasAdHocCardAccess: true,
      },
      errors: [{ path: ['sharedCards'], extensions: { status: 502 } }],
    })

    const result: any = await getServerSideProps(makeContext())

    const data = result.props.accountPageData
    expect(data.hasError).toBe(false)
    expect(data.sharedHasError).toBe(true)
    expect(data.personalHasError).toBe(false)
    expect(data.sharedCards).toEqual([])
    expect(data.personalCards).toEqual([CARD_PERSONAL])
  })

  it('treats both queries failing as a whole-page error', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockExecute.mockResolvedValueOnce({
      data: { accountProfile: { name: 'Jane' }, hasAdHocCardAccess: true },
      errors: [
        { path: ['personalCards'], extensions: { status: 502 } },
        { path: ['sharedCards'], extensions: { status: 502 } },
      ],
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.props.accountPageData.hasError).toBe(true)
  })
})
