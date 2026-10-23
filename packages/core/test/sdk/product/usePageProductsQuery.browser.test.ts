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

import {
  hashContractScope,
  useCreateUseGalleryPage,
} from '../../../src/sdk/product/usePageProductsQuery'

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
      {
        ...serverManyProductsVariables,
        _contract: hashContractScope('contract-137'),
      },
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
      { ...serverManyProductsVariables, _contract: hashContractScope('b2b') },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('hashes the contract scope to a stable value', () => {
    // Golden value: catches a change to the hash itself, which the other
    // tests miss because they derive their expectations from it.
    expect(hashContractScope('contract-137')).toBe('185k3l4sd4t')
  })

  it('keeps the raw contract id out of the query variables', () => {
    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: 'contract-137', unitId: 'unit-42' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: null })

    renderFirstGalleryPage()

    // The variables go in the GET URL, so they must not carry the raw ids.
    const variables = JSON.stringify(mockUseQuery.mock.calls.at(-1)?.[1])
    expect(variables).not.toContain('contract-137')
    expect(variables).not.toContain('unit-42')
    expect(hashContractScope('contract-a')).not.toBe(
      hashContractScope('contract-b')
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
      {
        ...serverManyProductsVariables,
        _contract: hashContractScope('unit-42'),
      },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('re-fetches the first page when the buyer switches contract', () => {
    const contractPage = {
      search: { products: { pageInfo: { totalCount: 1 }, edges: [] } },
    }

    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: 'contract-a' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: contractPage })

    const { result: created } = renderHook(() =>
      useCreateUseGalleryPage({ initialPages, serverManyProductsVariables })
    )
    const { rerender } = renderHook(() => created.current.useGalleryPage(0))

    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: 'contract-b' },
      isValidating: false,
    })
    rerender()

    expect(mockUseQuery).toHaveBeenLastCalledWith(
      expect.anything(),
      {
        ...serverManyProductsVariables,
        _contract: hashContractScope('contract-b'),
      },
      expect.objectContaining({ doNotRun: false })
    )
  })

  it('stops scoping the first page once the B2B session ends', () => {
    const contractPage = {
      search: { products: { pageInfo: { totalCount: 1 }, edges: [] } },
    }

    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: { customerId: 'contract-a' },
      isValidating: false,
    })
    mockUseLocalizedVariables.mockReturnValue(serverManyProductsVariables)
    mockUseQuery.mockReturnValue({ data: contractPage })

    const { result: created } = renderHook(() =>
      useCreateUseGalleryPage({ initialPages, serverManyProductsVariables })
    )
    const { rerender } = renderHook(() => created.current.useGalleryPage(0))

    mockUseSession.mockReturnValue({
      postalCode: null,
      b2b: null,
      isValidating: false,
    })
    rerender()

    expect(mockUseQuery).toHaveBeenLastCalledWith(
      expect.anything(),
      serverManyProductsVariables,
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
