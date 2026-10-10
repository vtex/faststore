/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseSession = vi.hoisted(() => vi.fn())
const mockUseQuery = vi.hoisted(() => vi.fn())
const mockUseLocalizedVariables = vi.hoisted(() => vi.fn())

vi.mock('@generated', () => ({ gql: (query: unknown) => query }))
vi.mock('discovery.config', () => ({
  default: { deliveryPromise: { enabled: true } },
}))
vi.mock('@faststore/sdk', () => ({
  useSearch: () => ({
    state: { sort: 'score_desc', term: '', selectedFacets: [] },
    itemsPerPage: 12,
  }),
}))
vi.mock('src/sdk/session', () => ({ useSession: mockUseSession }))
vi.mock('src/sdk/graphql/useQuery', () => ({ useQuery: mockUseQuery }))
vi.mock('src/sdk/product/useLocalizedVariables', () => ({
  useLocalizedVariables: mockUseLocalizedVariables,
}))

import { useCreateUseGalleryPage } from '../../../src/sdk/product/usePageProductsQuery'

const serverManyProductsVariables = {
  first: 12,
  after: '0',
  sort: 'score_desc' as const,
  term: '',
  selectedFacets: [
    { key: 'category-1', value: 'computers---tablets' },
    { key: 'channel', value: '{"salesChannel":"1"}' },
    { key: 'locale', value: 'en-CA' },
  ],
  sponsoredCount: 3,
}

type GalleryProps = NonNullable<Parameters<typeof useCreateUseGalleryPage>[0]>

const initialPages = {
  search: { products: { pageInfo: { totalCount: 2 }, edges: [] } },
} as unknown as GalleryProps['initialPages']

const renderFirstGalleryPage = () => {
  const { result: created } = renderHook(() =>
    useCreateUseGalleryPage({ initialPages, serverManyProductsVariables })
  )

  return renderHook(() => created.current.useGalleryPage(0))
}

// `isDeliveryPromiseEnabled` is read when the module loads, so this scenario
// needs its own file with the flag mocked on.
describe('useCreateUseGalleryPage with deliveryPromise enabled', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('scopes the page by postal code and contract together for B2B buyers', () => {
    mockUseSession.mockReturnValue({
      postalCode: '01310-100',
      b2b: { customerId: 'contract-137' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      {
        ...serverManyProductsVariables,
        _postalCode: '01310-100',
        _contract: 'contract-137',
      },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('still reuses the SSG page for an anonymous shopper with a postal code', () => {
    mockUseSession.mockReturnValue({
      postalCode: '01310-100',
      b2b: null,
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    const { result } = renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { ...serverManyProductsVariables, _postalCode: '01310-100' },
      expect.objectContaining({ doNotRun: true })
    )
    expect(result.current.data).toBe(initialPages)
  })

  it('re-fetches when the postal code changed after the SSG page was seeded', () => {
    mockUseSession.mockReturnValueOnce({
      postalCode: null,
      b2b: null,
      isValidating: false,
    })
    mockUseSession.mockReturnValue({
      postalCode: '01310-100',
      b2b: null,
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { ...serverManyProductsVariables, _postalCode: '01310-100' },
      expect.objectContaining({ doNotRun: false })
    )
  })
})
