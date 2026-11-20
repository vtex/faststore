import { describe, expect, it } from 'vitest'
import type { Item } from '../../../../../src/platforms/vtex/clients/search/types/ProductSearchResult'
import { getFormattedVariations } from '../../../../../src/platforms/vtex/utils/skuVariants'

describe('getFormattedVariations', () => {
  it('handles SKUs without images', () => {
    const variants = [
      {
        itemId: '1',
        images: [],
        variations: [{ name: 'Color', values: ['Red'] }],
      },
      {
        itemId: '2',
        images: [],
        variations: [{ name: 'Color', values: ['Blue'] }],
      },
    ] as unknown as Item[]

    expect(getFormattedVariations(variants, 'Color', 'Red')).toEqual({
      Color: [
        { src: '', alt: '', label: 'Color: Red', value: 'Red' },
        { src: '', alt: '', label: 'Color: Blue', value: 'Blue' },
      ],
    })
  })
})
