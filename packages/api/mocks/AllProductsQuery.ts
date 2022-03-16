export const AllProductsQueryFirst5 = `query AllProducts {
  allProducts(first: 5) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
      totalCount
    }
    edges {
      cursor
      node {
        description
        gtin
        image {
          alternateName
          url
        }
        isVariantOf {
          name
          productGroupID
          hasVariant {
            name
            sku
          }
        }
        name
        productID
        review {
          author {
            name
          }
          reviewRating {
            bestRating
            ratingValue
          }
        }
        seo {
          canonical
          description
          title
          titleTemplate
        }
        sku
        slug
        offers {
          highPrice
          lowPrice
          offerCount
          priceCurrency
          offers {
            availability
            itemCondition
            listPrice
            price
            priceCurrency
            priceValidUntil
            quantity
            sellingPrice
            seller {
              identifier
            }
            itemOffered {
              name
              sku
            }
          }
        }
      }
    }
  }
}
`

export const AllProductsFirst5Response = {
  data: {
    allProducts: {
      pageInfo: {
        endCursor: '5348',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: '0',
        totalCount: 5348,
      },
      edges: [
        {
          cursor: '0',
          node: {
            description:
              'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
            gtin: '0969910297117',
            image: [
              {
                alternateName: 'ab',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/182417/aut.jpg?v=637755531474870000',
              },
            ],
            isVariantOf: {
              name: 'Tasty Granite Towels Tasty',
              productGroupID: '55127871',
              hasVariant: [
                {
                  name: 'silver',
                  sku: '18643698',
                },
                {
                  name: 'red',
                  sku: '8665813',
                },
              ],
            },
            name: 'silver',
            productID: '18643698',
            review: [],
            seo: {
              canonical: '',
              description:
                'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
              title: 'Tasty Granite Towels Tasty',
              titleTemplate: '',
            },
            sku: '18643698',
            slug: 'tasty-granite-towels-tasty-18643698',
            offers: {
              highPrice: 44.24,
              lowPrice: 44.24,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 69.14,
                  price: 44.24,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 44.24,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'silver',
                    sku: '18643698',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '1',
          node: {
            description:
              'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
            gtin: '1918904587371',
            image: [
              {
                alternateName: 'eligendi',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/182418/et.jpg?v=637755531489400000',
              },
            ],
            isVariantOf: {
              name: 'Tasty Granite Towels Tasty',
              productGroupID: '55127871',
              hasVariant: [
                {
                  name: 'silver',
                  sku: '18643698',
                },
                {
                  name: 'red',
                  sku: '8665813',
                },
              ],
            },
            name: 'red',
            productID: '8665813',
            review: [],
            seo: {
              canonical: '',
              description:
                'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
              title: 'Tasty Granite Towels Tasty',
              titleTemplate: '',
            },
            sku: '8665813',
            slug: 'tasty-granite-towels-tasty-8665813',
            offers: {
              highPrice: 622.79,
              lowPrice: 622.79,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 949.45,
                  price: 622.79,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 622.79,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'red',
                    sku: '8665813',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '2',
          node: {
            description: 'Iure eum pariatur provident dolorem et.',
            gtin: '6464716212392',
            image: [
              {
                alternateName: 'et',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/168396/nihil.jpg?v=637753027573130000',
              },
              {
                alternateName: 'similique',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/168393/dolore.jpg?v=637753027558270000',
              },
              {
                alternateName: 'deleniti',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/168394/delectus.jpg?v=637753027564530000',
              },
              {
                alternateName: 'sunt',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/168395/qui.jpg?v=637753027568900000',
              },
            ],
            isVariantOf: {
              name: 'Fantastic Soft Cheese',
              productGroupID: '43559243',
              hasVariant: [
                {
                  name: 'plum',
                  sku: '2737806',
                },
              ],
            },
            name: 'plum',
            productID: '2737806',
            review: [],
            seo: {
              canonical: '',
              description: 'Iure eum pariatur provident dolorem et.',
              title: 'Fantastic Soft Cheese',
              titleTemplate: '',
            },
            sku: '2737806',
            slug: 'fantastic-soft-cheese-2737806',
            offers: {
              highPrice: 349.12,
              lowPrice: 349.12,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 557.57,
                  price: 349.12,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 349.12,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'plum',
                    sku: '2737806',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '3',
          node: {
            description: 'Magnam qui cumque in dolore.',
            gtin: '9016048553168',
            image: [
              {
                alternateName: 'aspernatur',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/184703/aliquid.jpg?v=637755551301570000',
              },
              {
                alternateName: 'et',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/184700/tempora.jpg?v=637755551290970000',
              },
              {
                alternateName: 'voluptatem',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/184701/dolore.jpg?v=637755551295000000',
              },
              {
                alternateName: 'natus',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/184702/deleniti.jpg?v=637755551298300000',
              },
            ],
            isVariantOf: {
              name: 'Handmade Steel Pants Gorgeous',
              productGroupID: '10833854',
              hasVariant: [
                {
                  name: 'tan',
                  sku: '30742880',
                },
              ],
            },
            name: 'tan',
            productID: '30742880',
            review: [],
            seo: {
              canonical: '',
              description: 'Magnam qui cumque in dolore.',
              title: 'Handmade Steel Pants Gorgeous',
              titleTemplate: '',
            },
            sku: '30742880',
            slug: 'handmade-steel-pants-gorgeous-30742880',
            offers: {
              highPrice: 433.23,
              lowPrice: 433.23,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 687.61,
                  price: 433.23,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 433.23,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'tan',
                    sku: '30742880',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '4',
          node: {
            description:
              'Sed nostrum est nostrum quo ipsum et ut asperiores quasi.',
            gtin: '4454274563902',
            image: [
              {
                alternateName: 'molestiae',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/166870/sit.jpg?v=637753013266530000',
              },
              {
                alternateName: 'occaecati',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/166867/ratione.jpg?v=637753013256670000',
              },
              {
                alternateName: 'labore',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/166868/modi.jpg?v=637753013260600000',
              },
              {
                alternateName: 'qui',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/166869/quaerat.jpg?v=637753013263570000',
              },
            ],
            isVariantOf: {
              name: 'Licensed Frozen Sausages',
              productGroupID: '42751008',
              hasVariant: [
                {
                  name: 'ivory',
                  sku: '97907082',
                },
              ],
            },
            name: 'ivory',
            productID: '97907082',
            review: [],
            seo: {
              canonical: '',
              description:
                'Sed nostrum est nostrum quo ipsum et ut asperiores quasi.',
              title: 'Licensed Frozen Sausages',
              titleTemplate: '',
            },
            sku: '97907082',
            slug: 'licensed-frozen-sausages-97907082',
            offers: {
              highPrice: 531.54,
              lowPrice: 531.54,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 764.06,
                  price: 531.54,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 531.54,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'ivory',
                    sku: '97907082',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '5',
          node: {
            description: 'Laborum non soluta accusamus ut repellat dolorum.',
            gtin: '2084120969524',
            image: [
              {
                alternateName: 'vero',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169429/deleniti.jpg?v=637753037761670000',
              },
              {
                alternateName: 'laborum',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169428/ratione.jpg?v=637753037756200000',
              },
            ],
            isVariantOf: {
              name: 'Awesome Plastic Bacon',
              productGroupID: '35322334',
              hasVariant: [
                {
                  name: 'violet',
                  sku: '9938908',
                },
                {
                  name: 'silver',
                  sku: '49950097',
                },
                {
                  name: 'lime',
                  sku: '60500870',
                },
              ],
            },
            name: 'violet',
            productID: '9938908',
            review: [],
            seo: {
              canonical: '',
              description: 'Laborum non soluta accusamus ut repellat dolorum.',
              title: 'Awesome Plastic Bacon',
              titleTemplate: '',
            },
            sku: '9938908',
            slug: 'awesome-plastic-bacon-9938908',
            offers: {
              highPrice: 399.58,
              lowPrice: 399.58,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 565.29,
                  price: 399.58,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 399.58,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'violet',
                    sku: '9938908',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '6',
          node: {
            description: 'Laborum non soluta accusamus ut repellat dolorum.',
            gtin: '8869428115906',
            image: [
              {
                alternateName: 'vitae',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169433/consequuntur.jpg?v=637753037805300000',
              },
              {
                alternateName: 'repellat',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169432/voluptatibus.jpg?v=637753037800170000',
              },
            ],
            isVariantOf: {
              name: 'Awesome Plastic Bacon',
              productGroupID: '35322334',
              hasVariant: [
                {
                  name: 'violet',
                  sku: '9938908',
                },
                {
                  name: 'silver',
                  sku: '49950097',
                },
                {
                  name: 'lime',
                  sku: '60500870',
                },
              ],
            },
            name: 'silver',
            productID: '49950097',
            review: [],
            seo: {
              canonical: '',
              description: 'Laborum non soluta accusamus ut repellat dolorum.',
              title: 'Awesome Plastic Bacon',
              titleTemplate: '',
            },
            sku: '49950097',
            slug: 'awesome-plastic-bacon-49950097',
            offers: {
              highPrice: 474.77,
              lowPrice: 474.77,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 518.11,
                  price: 474.77,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 474.77,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'silver',
                    sku: '49950097',
                  },
                },
              ],
            },
          },
        },
        {
          cursor: '7',
          node: {
            description: 'Laborum non soluta accusamus ut repellat dolorum.',
            gtin: '2864754656701',
            image: [
              {
                alternateName: 'animi',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169431/commodi.jpg?v=637753037785770000',
              },
              {
                alternateName: 'error',
                url:
                  'http://storeframework.vtexassets.com/arquivos/ids/169430/sit.jpg?v=637753037781870000',
              },
            ],
            isVariantOf: {
              name: 'Awesome Plastic Bacon',
              productGroupID: '35322334',
              hasVariant: [
                {
                  name: 'violet',
                  sku: '9938908',
                },
                {
                  name: 'silver',
                  sku: '49950097',
                },
                {
                  name: 'lime',
                  sku: '60500870',
                },
              ],
            },
            name: 'lime',
            productID: '60500870',
            review: [],
            seo: {
              canonical: '',
              description: 'Laborum non soluta accusamus ut repellat dolorum.',
              title: 'Awesome Plastic Bacon',
              titleTemplate: '',
            },
            sku: '60500870',
            slug: 'awesome-plastic-bacon-60500870',
            offers: {
              highPrice: 593.17,
              lowPrice: 593.17,
              offerCount: 1,
              priceCurrency: '',
              offers: [
                {
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  listPrice: 610.36,
                  price: 593.17,
                  priceCurrency: '',
                  priceValidUntil: '2023-03-16T13:55:46Z',
                  quantity: 1,
                  sellingPrice: 593.17,
                  seller: {
                    identifier: '1',
                  },
                  itemOffered: {
                    name: 'lime',
                    sku: '60500870',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
}
