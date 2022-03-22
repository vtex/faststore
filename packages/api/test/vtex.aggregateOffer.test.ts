import { sortOfferByPrice } from '../src/platforms/vtex/resolvers/aggregateOffer'

describe('AggregateOffer', () => {
  it('Should return best offers first', () => {
    const sorted = sortOfferByPrice([
      {
        sellingPrice: 10,
        availability: 'https://schema.org/InStock',
      },
      {
        sellingPrice: 20,
        availability: 'https://schema.org/OutOfStock',
      },
      {
        sellingPrice: 30,
        availability: 'https://schema.org/InStock',
      },
      {
        sellingPrice: 10,
        availability: 'https://schema.org/OutOfStock',
      },
      {
        sellingPrice: 1,
        availability: 'https://schema.org/InStock',
      },
    ] as any)

    expect(sorted).toEqual([
      {
        sellingPrice: 1,
        availability: 'https://schema.org/InStock',
      },
      {
        sellingPrice: 10,
        availability: 'https://schema.org/InStock',
      },
      {
        sellingPrice: 30,
        availability: 'https://schema.org/InStock',
      },
      {
        sellingPrice: 10,
        availability: 'https://schema.org/OutOfStock',
      },
      {
        sellingPrice: 20,
        availability: 'https://schema.org/OutOfStock',
      },
    ])
  })
})
