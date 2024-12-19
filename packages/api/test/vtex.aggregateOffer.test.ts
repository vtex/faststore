import { bestOfferFirst } from '../src/platforms/vtex/utils/productStock'
import type { CommertialOffer } from '../src/platforms/vtex/clients/search/types/ProductSearchResult'

type TestItem = Pick<CommertialOffer, 'AvailableQuantity' | 'Price'>

describe('AggregateOffer', () => {
  it('Should return best offers first', () => {
    const testItems: TestItem[] = [
      { AvailableQuantity: 1, Price: 10 },
      { AvailableQuantity: 0, Price: 20 },
      { AvailableQuantity: 1, Price: 30 },
      { AvailableQuantity: 0, Price: 10 },
      { AvailableQuantity: 1, Price: 1 },
    ]

    const sorted = testItems.sort(bestOfferFirst)

    expect(sorted).toEqual([
      { AvailableQuantity: 1, Price: 1 },
      { AvailableQuantity: 1, Price: 10 },
      { AvailableQuantity: 1, Price: 30 },
      { AvailableQuantity: 0, Price: 10 },
      { AvailableQuantity: 0, Price: 20 },
    ])
  })
})
