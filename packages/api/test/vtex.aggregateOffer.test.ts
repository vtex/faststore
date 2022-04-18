import { sortOfferByPrice } from '../src/platforms/vtex/resolvers/aggregateOffer'

describe('AggregateOffer', () => {
  it('Should return best offers first', () => {
    const sorted = sortOfferByPrice([
      {
        sellingPrice: 10,
        availability: 'available',
      },
      {
        sellingPrice: 20,
        availability: 'unavailable',
      },
      {
        sellingPrice: 30,
        availability: 'available',
      },
      {
        sellingPrice: 10,
        availability: 'unavailable',
      },
      {
        sellingPrice: 1,
        availability: 'available',
      },
    ] as any)

    expect(sorted).toEqual([
      {
        sellingPrice: 1,
        availability: 'available',
      },
      {
        sellingPrice: 10,
        availability: 'available',
      },
      {
        sellingPrice: 30,
        availability: 'available',
      },
      {
        sellingPrice: 10,
        availability: 'unavailable',
      },
      {
        sellingPrice: 20,
        availability: 'unavailable',
      },
    ])
  })
})
