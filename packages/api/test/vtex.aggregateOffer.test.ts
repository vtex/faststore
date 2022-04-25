import type {
  CommertialOffer,
  Item,
} from '../src/platforms/vtex/clients/search/types/ProductSearchResult'
import { sortOfferByPrice } from '../src/platforms/vtex/utils/productStock'

type TestItem = {
  sellers: Array<{
    commertialOffer: Pick<CommertialOffer, 'AvailableQuantity' | 'Price'>
  }>
}

describe('AggregateOffer', () => {
  it('Should return best offers first', () => {
    const testItems: TestItem[] = [
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 10 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 0, Price: 20 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 30 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 0, Price: 10 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 1 } }],
      },
    ]

    const sorted = sortOfferByPrice(testItems as Item[])

    expect(sorted).toEqual([
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 1 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 10 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 1, Price: 30 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 0, Price: 10 } }],
      },
      {
        sellers: [{ commertialOffer: { AvailableQuantity: 0, Price: 20 } }],
      },
    ])
  })
})
