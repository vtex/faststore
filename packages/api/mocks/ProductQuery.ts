export const ProductByIdQuery = `query ProductQuery {
  product(locator: [{key: "id", value: "64953394"}, {key: "channel", value: "1"}]) {
    slug
    name
    productID
    description
    sku
    gtin
    seo {
      title
      titleTemplate
      description
      canonical
    }
    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }
    brand {
      name
    }
    image {
      url
      alternateName
    }
    offers {
      highPrice
      lowPrice
      offerCount
      priceCurrency
    }
    review {
      reviewRating {
        ratingValue
        bestRating
      }
      author {
        name
      }
    }
    aggregateRating {
      ratingValue
      reviewCount
    }
    isVariantOf {
      hasVariant {
        name
        slug
        productID
      }
    }
    additionalProperty {
      value
      name
    }
  }
}
`

export const ProductByIdResponse = {
  data: {
    product: {
      slug: 'unbranded-concrete-table-small-64953394',
      name: 'fuchsia',
      productID: '64953394',
      description: 'Aut omnis nobis tenetur.',
      sku: '64953394',
      gtin: '1346198062637',
      seo: {
        title: 'Unbranded Concrete Table Small',
        titleTemplate: '',
        description: 'Aut omnis nobis tenetur.',
        canonical: '',
      },
      breadcrumbList: {
        itemListElement: [
          {
            item: '/office',
            name: 'Office',
            position: 1,
          },
          {
            item: '/office/desks',
            name: 'Desks',
            position: 2,
          },
          {
            item: '/unbranded-concrete-table-small-64953394/p',
            name: 'Unbranded Concrete Table Small',
            position: 3,
          },
        ],
      },
      brand: {
        name: 'Brand',
      },
      image: [
        {
          url:
            'http://storeframework.vtexassets.com/arquivos/ids/186495/corporis.jpg?v=637755567185370000',
          alternateName: 'et',
        },
        {
          url:
            'http://storeframework.vtexassets.com/arquivos/ids/186492/qui.jpg?v=637755567174570000',
          alternateName: 'in',
        },
        {
          url:
            'http://storeframework.vtexassets.com/arquivos/ids/186493/possimus.jpg?v=637755567178470000',
          alternateName: 'consectetur',
        },
        {
          url:
            'http://storeframework.vtexassets.com/arquivos/ids/186494/nihil.jpg?v=637755567181900000',
          alternateName: 'ea',
        },
      ],
      offers: {
        highPrice: 200.64,
        lowPrice: 200.64,
        offerCount: 1,
        priceCurrency: '',
      },
      review: [],
      aggregateRating: {
        ratingValue: 5,
        reviewCount: 0,
      },
      isVariantOf: {
        hasVariant: [
          {
            name: 'fuchsia',
            slug: 'unbranded-concrete-table-small-64953394',
            productID: '64953394',
          },
        ],
      },
      additionalProperty: [],
    },
  },
}
