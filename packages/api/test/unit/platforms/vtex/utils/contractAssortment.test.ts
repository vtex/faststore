import { describe, expect, it } from 'vitest'

import { isNotFoundError } from '../../../../../src/platforms/errors'
import {
  assertProductInContractAssortment,
  getProductClusterRestriction,
  isProductInAssortment,
} from '../../../../../src/platforms/vtex/utils/contractAssortment'

const segmentCookie = (segment: Record<string, unknown>) =>
  `vtex_segment=${Buffer.from(JSON.stringify(segment)).toString('base64')}`

const makeCtx = (cookie?: string) => ({ headers: { cookie } }) as any

const makeSku = (productClusters?: Array<{ id: string; name: string }>) =>
  ({
    itemId: '100',
    isVariantOf: { productId: 'prod1', productClusters },
  }) as any

const clusters = (...ids: string[]) =>
  ids.map((id) => ({ id, name: `Collection ${id}` }))

describe('getProductClusterRestriction', () => {
  it('returns null when the segment has no facets', () => {
    expect(getProductClusterRestriction({})).toBeNull()
  })

  it('returns null when the segment facets carry no productClusterIds', () => {
    expect(
      getProductClusterRestriction({ facets: 'zip-code=12345;brandId=7;' })
    ).toBeNull()
  })

  it('collects allowed and excluded collections', () => {
    const restriction = getProductClusterRestriction({
      facets:
        'productClusterIds=137;productClusterIds=138,139;productClusterIds=not:200;',
    })

    expect(restriction).toEqual({
      allowed: new Set(['137', '138', '139']),
      excluded: new Set(['200']),
    })
  })
})

describe('isProductInAssortment', () => {
  const restriction = {
    allowed: new Set(['137']),
    excluded: new Set<string>(),
  }

  it('accepts a product in an allowed collection', () => {
    expect(isProductInAssortment(clusters('10', '137'), restriction)).toBe(true)
  })

  it('rejects a product outside every allowed collection', () => {
    expect(isProductInAssortment(clusters('10'), restriction)).toBe(false)
  })

  it('rejects a product without collections', () => {
    expect(isProductInAssortment(undefined, restriction)).toBe(false)
  })

  it('rejects a product in an excluded collection even if also allowed', () => {
    expect(
      isProductInAssortment(clusters('137', '200'), {
        allowed: new Set(['137']),
        excluded: new Set(['200']),
      })
    ).toBe(false)
  })

  it('accepts any product outside the excluded collections when nothing is explicitly allowed', () => {
    const excludedOnly = {
      allowed: new Set<string>(),
      excluded: new Set(['200']),
    }

    expect(isProductInAssortment(clusters('10'), excludedOnly)).toBe(true)
    expect(isProductInAssortment(undefined, excludedOnly)).toBe(true)
  })
})

describe('assertProductInContractAssortment', () => {
  it('does nothing without a segment cookie', () => {
    expect(() =>
      assertProductInContractAssortment(makeCtx(), makeSku(clusters('10')))
    ).not.toThrow()
  })

  it('does nothing when the segment has no assortment restriction', () => {
    const ctx = makeCtx(segmentCookie({ channel: '1', facets: '' }))

    expect(() =>
      assertProductInContractAssortment(ctx, makeSku(clusters('10')))
    ).not.toThrow()
  })

  it('does nothing when the product is in the assortment', () => {
    const ctx = makeCtx(segmentCookie({ facets: 'productClusterIds=137;' }))

    expect(() =>
      assertProductInContractAssortment(ctx, makeSku(clusters('137')))
    ).not.toThrow()
  })

  it('throws NotFoundError when the product is outside the assortment', () => {
    const ctx = makeCtx(segmentCookie({ facets: 'productClusterIds=137;' }))

    let error: unknown
    try {
      assertProductInContractAssortment(ctx, makeSku(clusters('10')))
    } catch (err) {
      error = err
    }

    expect(isNotFoundError(error)).toBe(true)
  })
})
