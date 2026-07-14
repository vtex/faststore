import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockValidateUser = vi.fn()
const mockGetMyAccountRedirect = vi.fn()
const mockGetIsRepresentative = vi.fn()
const mockFetchMyAccountPageContent = vi.fn()
const mockGetGlobalSectionsData = vi.fn()
const mockExecute = vi.fn()
const mockInjectGlobalSections = vi.fn()
const mockLocalizeRedirectDestination = vi.fn(
  (destination: string) => destination
)

vi.mock('src/sdk/account/validateUser', () => ({
  validateUser: (...args: unknown[]) => mockValidateUser(...args),
}))

vi.mock('src/utils/myAccountRedirect', () => ({
  getMyAccountRedirect: (...args: unknown[]) =>
    mockGetMyAccountRedirect(...args),
}))

vi.mock('src/sdk/account/getIsRepresentative', () => ({
  getIsRepresentative: (...args: unknown[]) => mockGetIsRepresentative(...args),
}))

vi.mock('src/server/cms/fetchMyAccountPageContent', () => ({
  fetchMyAccountPageContent: (...args: unknown[]) =>
    mockFetchMyAccountPageContent(...args),
}))

vi.mock('src/components/cms/GlobalSections', () => ({
  getGlobalSectionsData: (...args: unknown[]) =>
    mockGetGlobalSectionsData(...args),
}))

vi.mock('src/server', () => ({
  execute: (...args: unknown[]) => mockExecute(...args),
}))

vi.mock('src/server/cms/global', () => ({
  injectGlobalSections: (...args: unknown[]) =>
    mockInjectGlobalSections(...args),
}))

vi.mock('src/utils/localization/localizeRedirectDestination', () => ({
  localizeRedirectDestination: (...args: unknown[]) =>
    mockLocalizeRedirectDestination(...(args as [string])),
}))

vi.mock('src/utils/localization/withLocaleValidation', () => ({
  withLocaleValidationSSR: <T>(fn: T) => fn,
}))

vi.mock('../../../discovery.config', () => ({
  default: { api: { storeId: 'teststore' } },
}))

vi.mock('@generated/gql', () => ({
  gql: (source: string) => source,
}))

import { myAccountCmsServerSideProps } from '../../../src/experimental/myAccountCmsServerSideProps'

function buildContext(overrides: Record<string, unknown> = {}) {
  return {
    previewData: undefined,
    locale: 'en-US',
    query: {},
    req: {
      url: '/pvt/account/wishlist',
      headers: {},
    },
    ...overrides,
  } as never
}

describe('myAccountCmsServerSideProps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetIsRepresentative.mockReturnValue(false)
    mockGetGlobalSectionsData.mockReturnValue([
      Promise.resolve({ sections: [], settings: {} }),
      Promise.resolve({ sections: [] }),
      Promise.resolve({ sections: [] }),
    ])
    mockInjectGlobalSections.mockReturnValue({
      sections: [{ name: 'Children', data: {} }],
      settings: {},
    })
    mockExecute.mockResolvedValue({
      data: { accountProfile: { name: 'Ada' } },
      errors: undefined,
    })
  })

  it('redirects to login when the user is invalid and does not need refresh', async () => {
    mockValidateUser.mockResolvedValue({
      isValid: false,
      needsRefresh: false,
    })

    const result = await myAccountCmsServerSideProps(
      'myAccountWishlist',
      '/pvt/account/wishlist'
    )(buildContext())

    expect(result).toEqual({
      redirect: { destination: '/login', permanent: false },
    })
  })

  it('redirects to 403 when the user is invalid and needs refresh', async () => {
    mockValidateUser.mockResolvedValue({
      isValid: false,
      needsRefresh: true,
    })

    const result = await myAccountCmsServerSideProps(
      'myAccountWishlist',
      '/pvt/account/wishlist'
    )(buildContext())

    expect(result).toEqual({
      redirect: {
        destination: `/pvt/account/403?from=${encodeURIComponent('/pvt/account/wishlist')}`,
        permanent: false,
      },
    })
  })

  it('returns the My Account disabled redirect', async () => {
    mockValidateUser.mockResolvedValue({ isValid: true })
    mockGetMyAccountRedirect.mockReturnValue({
      isFaststoreMyAccountEnabled: false,
      redirect: { destination: '/login', permanent: false },
    })

    const result = await myAccountCmsServerSideProps(
      'myAccountWishlist',
      '/pvt/account/wishlist'
    )(buildContext())

    expect(result).toEqual({
      redirect: { destination: '/login', permanent: false },
    })
  })

  it('returns pageSections, navigationLabels and accountName on success', async () => {
    mockValidateUser.mockResolvedValue({ isValid: true })
    mockGetMyAccountRedirect.mockReturnValue({
      isFaststoreMyAccountEnabled: true,
      redirect: { destination: '/login', permanent: false },
    })
    mockFetchMyAccountPageContent.mockResolvedValue({
      sections: [
        {
          name: 'AccountNavigation',
          $componentKey: 'AccountNavigation',
          data: { profileLabel: 'Profile' },
        },
        {
          name: 'HelloAccount',
          $componentKey: 'HelloAccount',
          data: { label: 'Hi' },
        },
      ],
      settings: {},
    })

    const result = await myAccountCmsServerSideProps(
      'myAccountWishlist',
      '/pvt/account/wishlist'
    )(buildContext())

    expect(result).toMatchObject({
      props: {
        accountName: 'Ada',
        isRepresentative: false,
        navigationLabels: { profileLabel: 'Profile' },
        pageSections: [
          {
            name: 'HelloAccount',
            $componentKey: 'HelloAccount',
            data: { label: 'Hi' },
          },
        ],
      },
    })
    expect(mockFetchMyAccountPageContent).toHaveBeenCalledWith(
      'myAccountWishlist',
      { previewData: undefined, locale: 'en-US' },
      '/pvt/account/wishlist'
    )
  })

  it('returns empty pageSections when the content-type is unpublished', async () => {
    mockValidateUser.mockResolvedValue({ isValid: true })
    mockGetMyAccountRedirect.mockReturnValue({
      isFaststoreMyAccountEnabled: true,
      redirect: { destination: '/login', permanent: false },
    })
    mockFetchMyAccountPageContent.mockResolvedValue({
      sections: [],
      settings: {},
    })

    const result = await myAccountCmsServerSideProps(
      'myAccountWishlist',
      '/pvt/account/wishlist'
    )(buildContext())

    expect(result).toMatchObject({
      props: {
        pageSections: [],
        navigationLabels: {},
        accountName: 'Ada',
      },
    })
  })
})
