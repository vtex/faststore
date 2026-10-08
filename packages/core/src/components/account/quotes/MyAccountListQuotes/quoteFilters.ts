import { getLocalizedQuoteStatusMap } from 'src/utils/quoteStatus'
import type { QuoteStatusCmsLabels } from 'src/utils/quoteStatus'

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

export type QuoteFacetLabels = {
  statusFacetLabel?: string
  createdAtFacetLabel?: string
  expiresAtFacetLabel?: string
  statusCmsLabels?: QuoteStatusCmsLabels
}

export function getAllFacets(filters: QuoteFilters, labels?: QuoteFacetLabels) {
  const statusMap = getLocalizedQuoteStatusMap(labels?.statusCmsLabels)

  return [
    {
      __typename: 'StoreFacetBoolean' as const,
      key: 'status',
      label: labels?.statusFacetLabel ?? 'Status',
      values: Object.entries(statusMap).map(([key, { label }]) => ({
        label,
        quantity: 0,
        selected: false,
        value: key,
      })),
    },
    {
      __typename: 'StoreFacetRange' as const,
      key: 'createdAt',
      label: labels?.createdAtFacetLabel ?? 'Created Date',
      from: filters.createdAtFrom,
      to: filters.createdAtTo,
    },
    {
      __typename: 'StoreFacetRange' as const,
      key: 'expiresAt',
      label: labels?.expiresAtFacetLabel ?? 'Expiry Date',
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
  const parsed = new Date(year, month - 1, day)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return date
  }
  return parsed.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
