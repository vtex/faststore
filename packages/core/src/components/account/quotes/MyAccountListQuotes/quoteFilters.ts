import { quoteStatusMap } from 'src/utils/quoteStatus'

export type QuoteFilters = {
  page: number
  status: string[]
  createdAtFrom: string
  createdAtTo: string
  expiresAtFrom: string
  expiresAtTo: string
  label: string
}

export type QuoteSelectedFacet = { key: string; value: string }

export function getSelectedFacets(filters: QuoteFilters): QuoteSelectedFacet[] {
  const facets: QuoteSelectedFacet[] = []
  if (filters.status.length > 0) {
    filters.status.forEach((s) => facets.push({ key: 'status', value: s }))
  }
  return facets
}

export function getAllFacets(filters: QuoteFilters) {
  return [
    {
      __typename: 'StoreFacetBoolean' as const,
      key: 'status',
      label: 'Status',
      values: Object.entries(quoteStatusMap).map(([key, { label }]) => ({
        label,
        quantity: 0,
        selected: false,
        value: key,
      })),
    },
    {
      __typename: 'StoreFacetRange' as const,
      key: 'createdAt',
      label: 'Created Date',
      from: filters.createdAtFrom,
      to: filters.createdAtTo,
    },
    {
      __typename: 'StoreFacetRange' as const,
      key: 'expiresAt',
      label: 'Expiry Date',
      from: filters.expiresAtFrom,
      to: filters.expiresAtTo,
    },
  ]
}

export function hasActiveFilters(filters: QuoteFilters): boolean {
  return (
    filters.status.length > 0 ||
    Boolean(filters.createdAtFrom) ||
    Boolean(filters.createdAtTo) ||
    Boolean(filters.expiresAtFrom) ||
    Boolean(filters.expiresAtTo) ||
    Boolean(filters.label)
  )
}

export function countActiveFilters(filters: QuoteFilters): number {
  let count = 0
  if (filters.status.length > 0) count++
  if (filters.createdAtFrom || filters.createdAtTo) count++
  if (filters.expiresAtFrom || filters.expiresAtTo) count++
  return count
}

export function formatFilterDate(date: string, locale: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return date
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
