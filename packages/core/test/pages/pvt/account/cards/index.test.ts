import { describe, expect, it, vi } from 'vitest'

const mockExecute = vi.hoisted(() => vi.fn())
const mockGetB2BSessionClaims = vi.hoisted(() => vi.fn())
const mockGetIsRepresentative = vi.hoisted(() => vi.fn(() => true))
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
vi.mock('src/sdk/account/getIsRepresentative', () => ({
  getIsRepresentative: mockGetIsRepresentative,
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
  cards = [CARD_PERSONAL, CARD_SHARED],
  hasAdHocCardAccess = true,
  accountName = 'Jane Buyer',
} = {}) {
  mockExecute.mockResolvedValueOnce({
    data: {
      listCreditCards: { list: cards },
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

  it('redirects to /pvt/account/403 when the query fails with 401/403', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: false,
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
      hasOrgAssociation: false,
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

  it('partitions the merged card list by origin and computes canViewPersonalCards', async () => {
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

  it('never gates the route: canViewPersonalCards is false but no redirect happens', async () => {
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

  it('keeps personal cards in the payload when there is no org association, even though canViewPersonalCards is false (FR-7: B2C buyers are never subject to this check)', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: false,
      hasCustomerId: false,
    })
    mockSuccessfulExecute({ hasAdHocCardAccess: false })

    const result: any = await getServerSideProps(makeContext())

    // Without hasOrgAssociation, the component still renders the Personal
    // tab (the "kept as-is" O1 combination) — stripping the data here would
    // silently regress a buyer this gate was never meant to touch, even
    // though canViewPersonalCards itself is false.
    expect(result.props.accountPageData.personalCards).toEqual([CARD_PERSONAL])
  })

  it('defaults hasAdHocCardAccess to allowed when the query field is missing', async () => {
    mockGetB2BSessionClaims.mockReturnValueOnce({
      hasOrgAssociation: true,
      hasCustomerId: true,
    })
    mockExecute.mockResolvedValueOnce({
      data: {
        listCreditCards: { list: [] },
        accountProfile: { name: 'Jane' },
        hasAdHocCardAccess: undefined,
      },
      errors: undefined,
    })

    const result: any = await getServerSideProps(makeContext())

    expect(result.props.accountPageData.canViewPersonalCards).toBe(true)
  })
})
