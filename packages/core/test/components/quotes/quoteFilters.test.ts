import { describe, expect, it } from 'vitest'

import {
  getSelectedFacets,
  getAllFacets,
  hasActiveFilters,
  countActiveFilters,
  formatFilterDate,
} from '../../../src/components/account/quotes/MyAccountListQuotes/quoteFilters'
import {
  quoteStatusMap,
  type QuoteStatusKey,
} from '../../../src/utils/quoteStatus'

const emptyFilters = {
  page: 1,
  status: [],
  createdAtFrom: '',
  createdAtTo: '',
  expiresAtFrom: '',
  expiresAtTo: '',
  label: '',
}

describe('quoteStatusMap', () => {
  it('has entries for all 9 statuses', () => {
    expect(Object.keys(quoteStatusMap)).toHaveLength(9)
  })

  it('all keys are PascalCase', () => {
    Object.keys(quoteStatusMap).forEach((key) => {
      expect(key[0]).toBe(key[0].toUpperCase())
      expect(key).toBe(key[0].toUpperCase() + key.slice(1))
    })
  })

  it('all entries have a non-empty label', () => {
    Object.values(quoteStatusMap).forEach((entry) => {
      expect(entry.label).toBeTruthy()
    })
  })

  it('all entries have a valid variant', () => {
    const validVariants = ['neutral', 'warning', 'info', 'success', 'danger']
    Object.values(quoteStatusMap).forEach((entry) => {
      expect(validVariants).toContain(entry.variant)
    })
  })
})

describe('getSelectedFacets', () => {
  it('returns empty array when no status selected', () => {
    expect(getSelectedFacets(emptyFilters)).toEqual([])
  })

  it('returns one facet per status, preserving PascalCase', () => {
    const filters = { ...emptyFilters, status: ['InReview', 'Approved'] }
    const facets = getSelectedFacets(filters)
    expect(facets).toEqual([
      { key: 'status', value: 'InReview' },
      { key: 'status', value: 'Approved' },
    ])
  })

  it('does NOT lowercase the status values', () => {
    const filters = { ...emptyFilters, status: ['ConvertedToOrder'] }
    const facets = getSelectedFacets(filters)
    expect(facets[0].value).toBe('ConvertedToOrder')
    expect(facets[0].value).not.toBe('convertedtoorder')
  })
})

describe('getAllFacets', () => {
  it('returns 3 facets: status, createdAt, expiresAt', () => {
    const facets = getAllFacets(emptyFilters)
    expect(facets).toHaveLength(3)
    expect(facets[0].key).toBe('status')
    expect(facets[1].key).toBe('createdAt')
    expect(facets[2].key).toBe('expiresAt')
  })

  it('status facet values match quoteStatusMap keys (PascalCase)', () => {
    const facets = getAllFacets(emptyFilters)
    const statusFacet = facets[0]
    if (statusFacet.__typename !== 'StoreFacetBoolean') throw new Error()

    const expectedKeys = Object.keys(quoteStatusMap) as QuoteStatusKey[]
    statusFacet.values.forEach((v, i) => {
      expect(v.value).toBe(expectedKeys[i])
      expect(v.label).toBe(quoteStatusMap[expectedKeys[i]].label)
    })
  })

  it('range facets carry the date filters', () => {
    const filters = {
      ...emptyFilters,
      createdAtFrom: '2024-01-01',
      createdAtTo: '2024-12-31',
    }
    const facets = getAllFacets(filters)
    const createdAt = facets[1]
    if (createdAt.__typename !== 'StoreFacetRange') throw new Error()
    expect(createdAt.from).toBe('2024-01-01')
    expect(createdAt.to).toBe('2024-12-31')
  })
})

describe('hasActiveFilters', () => {
  it('returns false for empty filters', () => {
    expect(hasActiveFilters(emptyFilters)).toBe(false)
  })

  it('returns true when status is selected', () => {
    expect(hasActiveFilters({ ...emptyFilters, status: ['Draft'] })).toBe(true)
  })

  it('returns true when label is set', () => {
    expect(hasActiveFilters({ ...emptyFilters, label: 'quote-123' })).toBe(true)
  })

  it('returns true when any date filter is set', () => {
    expect(
      hasActiveFilters({ ...emptyFilters, createdAtFrom: '2024-01-01' })
    ).toBe(true)
  })
})

describe('countActiveFilters', () => {
  it('returns 0 for empty filters', () => {
    expect(countActiveFilters(emptyFilters)).toBe(0)
  })

  it('counts status as one regardless of how many statuses', () => {
    expect(
      countActiveFilters({ ...emptyFilters, status: ['Draft', 'Approved'] })
    ).toBe(1)
  })

  it('counts createdAt range as one', () => {
    expect(
      countActiveFilters({
        ...emptyFilters,
        createdAtFrom: '2024-01-01',
        createdAtTo: '2024-12-31',
      })
    ).toBe(1)
  })

  it('counts all three groups independently', () => {
    expect(
      countActiveFilters({
        ...emptyFilters,
        status: ['Draft'],
        createdAtFrom: '2024-01-01',
        expiresAtTo: '2025-01-01',
      })
    ).toBe(3)
  })
})

describe('formatFilterDate', () => {
  it('formats a valid YYYY-MM-DD date', () => {
    const result = formatFilterDate('2024-03-15', 'en-US')
    expect(result).toMatch(/03.+15.+2024|2024.+03.+15/)
  })

  it('returns the original string for empty input', () => {
    expect(formatFilterDate('', 'en-US')).toBe('')
  })

  it('returns the original string for invalid format', () => {
    expect(formatFilterDate('not-a-date', 'en-US')).toBe('not-a-date')
    expect(formatFilterDate('2024/03/15', 'en-US')).toBe('2024/03/15')
  })

  it('returns the original string for zero month/day', () => {
    expect(formatFilterDate('2024-00-15', 'en-US')).toBe('2024-00-15')
    expect(formatFilterDate('2024-03-00', 'en-US')).toBe('2024-03-00')
  })

  it('returns the original string for dates that roll over (e.g. Feb 31)', () => {
    expect(formatFilterDate('2024-02-31', 'en-US')).toBe('2024-02-31')
    expect(formatFilterDate('2024-04-31', 'en-US')).toBe('2024-04-31')
  })
})
