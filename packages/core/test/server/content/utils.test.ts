import { describe, expect, it } from 'vitest'

import { getVariantBranchId } from '../../../src/server/content/utils'

describe('getVariantBranchId', () => {
  it('returns the branchId when present', () => {
    expect(getVariantBranchId({ branchId: 'campaign-x' })).toBe('campaign-x')
  })

  it('treats an empty branchId as absent', () => {
    expect(getVariantBranchId({ branchId: '' })).toBeUndefined()
  })

  it('returns undefined when branchId is missing', () => {
    expect(getVariantBranchId({})).toBeUndefined()
  })
})
