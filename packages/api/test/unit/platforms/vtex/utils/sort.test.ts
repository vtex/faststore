import { describe, expect, it } from 'vitest'

import { resolveSort } from '../../../../../src/platforms/vtex/utils/sort'

describe('resolveSort', () => {
  it('resolves a built-in StoreSort value', () => {
    expect(resolveSort('price_desc', {})).toBe('price:desc')
  })

  it('resolves score_desc to an empty (default relevance) sort', () => {
    expect(resolveSort('score_desc', {})).toBe('')
  })

  it('resolves a custom sort value registered in customSortMap', () => {
    expect(resolveSort('rating_desc', { rating_desc: 'Rating:desc' })).toBe(
      'Rating:desc'
    )
  })

  it('prefers customSortMap over the built-in map for the same key', () => {
    expect(resolveSort('price_desc', { price_desc: 'Price:desc' })).toBe(
      'Price:desc'
    )
  })

  it('throws instead of silently falling back to the default sort for an unresolved value', () => {
    expect(() => resolveSort('rating_desc', {})).toThrow(/rating_desc/)
  })
})
