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
  default: { deliveryPromise: { enabled: false } },
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

describe('useCreateUseGalleryPage', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('reuses the SSG first page for anonymous shoppers', () => {
    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: null,
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    const { result } = renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      serverManyProductsVariables,
      expect.objectContaining({ doNotRun: true })
    )
    expect(result.current.data).toBe(initialPages)
  })

  it('re-fetches the first page for B2B buyers so the contract assortment applies', () => {
    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: 'contract-137' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { ...serverManyProductsVariables, _contract: 'contract-137' },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('still re-fetches for B2B buyers whose customerId resolves to an empty string', () => {
    // `buildB2bSession` in @faststore/api can resolve `customerId` to `''`
    // (see validateSessionHelpers.ts) even for a representative with an
    // active contract. The fix must not depend on the value being truthy —
    // only on the `b2b` session existing — or it silently falls back to the
    // anonymous behavior (reusing the unfiltered SSG page).
    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: '' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { ...serverManyProductsVariables, _contract: 'b2b' },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('tells B2B buyers apart by organizational unit when customerId is empty', () => {
    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: '', unitId: 'unit-42' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      { ...serverManyProductsVariables, _contract: 'unit-42' },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('ignores the postal code while deliveryPromise is disabled', () => {
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
      serverManyProductsVariables,
      expect.objectContaining({ doNotRun: true })
    )
    expect(result.current.data).toBe(initialPages)
  })
})
