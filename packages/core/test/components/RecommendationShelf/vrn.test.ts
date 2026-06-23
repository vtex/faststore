import { describe, expect, it } from 'vitest'

import {
  getTypeFromVrn,
  isValidVrn,
} from 'src/components/RecommendationShelf/vrn'

const vrn = (type: string) => `vrn:recommendations:account:${type}:campaign-1`

describe('isValidVrn', () => {
  it('accepts every supported campaign type', () => {
    const types = [
      'rec-cross-v2',
      'rec-similar-v2',
      'rec-persona-v2',
      'rec-last-v2',
      'rec-top-items-v2',
      'rec-search-v2',
      'rec-next-v2',
      'rec-visual-v2',
    ]

    for (const type of types) {
      expect(isValidVrn(vrn(type))).toBe(true)
    }
  })

  it('rejects malformed or unknown vrns', () => {
    expect(isValidVrn('not-a-vrn')).toBe(false)
    expect(isValidVrn('vrn:recommendations:account:rec-unknown:campaign')).toBe(
      false
    )
    expect(isValidVrn('vrn:recommendations:account:rec-cross-v2')).toBe(false)
  })
})

describe('getTypeFromVrn', () => {
  it('maps each vrn type to its recommendation type', () => {
    expect(getTypeFromVrn(vrn('rec-cross-v2'))).toBe('CROSS_SELL')
    expect(getTypeFromVrn(vrn('rec-similar-v2'))).toBe('SIMILAR_ITEMS')
    expect(getTypeFromVrn(vrn('rec-persona-v2'))).toBe('PERSONALIZED')
    expect(getTypeFromVrn(vrn('rec-last-v2'))).toBe('LAST_SEEN')
    expect(getTypeFromVrn(vrn('rec-top-items-v2'))).toBe('TOP_ITEMS')
    expect(getTypeFromVrn(vrn('rec-search-v2'))).toBe('SEARCH_BASED')
    expect(getTypeFromVrn(vrn('rec-next-v2'))).toBe('NEXT_INTERACTION')
    expect(getTypeFromVrn(vrn('rec-visual-v2'))).toBe('VISUAL_SIMILARITY')
  })

  it('throws on an unknown campaign type', () => {
    expect(() => getTypeFromVrn(vrn('rec-bogus'))).toThrow(
      /Unknown campaign type/
    )
  })
})
