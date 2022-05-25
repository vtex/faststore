import { bestOfferFirst } from '../src/platforms/vtex/utils/productStock'
import type { CommertialOffer } from '../src/platforms/vtex/clients/search/types/ProductSearchResult'

type TestItem = Pick<CommertialOffer, 'AvailableQuantity' | 'spotPrice'>

describe('AggregateOffer', () => {
  it('Should return best offers first', () => {
    const testItems: TestItem[] = [
      { AvailableQuantity: 1, spotPrice: 10 },
      { AvailableQuantity: 0, spotPrice: 20 },
      { AvailableQuantity: 1, spotPrice: 30 },
      { AvailableQuantity: 0, spotPrice: 10 },
      { AvailableQuantity: 1, spotPrice: 1 },
    ]

    const sorted = testItems.sort(bestOfferFirst)

    expect(sorted).toEqual([
      { AvailableQuantity: 1, spotPrice: 1 },
      { AvailableQuantity: 1, spotPrice: 10 },
      { AvailableQuantity: 1, spotPrice: 30 },
      { AvailableQuantity: 0, spotPrice: 10 },
      { AvailableQuantity: 0, spotPrice: 20 },
    ])
  })
})
