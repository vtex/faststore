export const SearchQueryFirst5Products = `query SearchQuery {
  search(first: 5, selectedFacets: [{key: "category-1", value: "office"}]) {
    products {
      pageInfo {
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          name
          slug
          sku
          productID
          description
          sku
          gtin
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
            offers {
              listPrice
              sellingPrice
              price
              itemCondition
              availability
              quantity
              seller {
                identifier
              }
              itemOffered {
                seo {
                  title
                  titleTemplate
                  description
                  canonical
                }
              }
            }
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
              productID
              slug
              sku
            }
            productGroupID
            name
            additionalProperty {
              value
              name
            }
          }
          additionalProperty {
            name
            value
          }
        }
        cursor
      }
    }
    facets {
      key
      label
      type
      values {
        value
        label
        selected
        quantity
      }
    }
  }
}`

export const Search5FirstProductsResponse = {
  data: {
    search: {
      products: {
        pageInfo: {
          totalCount: 1826,
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: '0',
          endCursor: '1826',
        },
        edges: [
          {
            node: {
              name: 'silver',
              slug: 'tasty-granite-towels-tasty-18643698',
              sku: '18643698',
              productID: '18643698',
              description:
                'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
              gtin: '0969910297117',
              brand: {
                name: 'Nike',
              },
              image: [
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/182417/aut.jpg?v=637755531474870000',
                  alternateName: 'ab',
                },
              ],
              offers: {
                highPrice: 44.24,
                lowPrice: 44.24,
                offerCount: 1,
                priceCurrency: '',
                offers: [
                  {
                    listPrice: 69.14,
                    sellingPrice: 44.24,
                    price: 44.24,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    quantity: 1,
                    seller: {
                      identifier: '1',
                    },
                    itemOffered: {
                      seo: {
                        title: 'Tasty Granite Towels Tasty',
                        titleTemplate: '',
                        description:
                          'Reprehenderit harum qui odio inventore sit incidunt illo facere.',
                        canonical: '',
                      },
                    },
                  },
                ],
              },
              review: [],
              aggregateRating: {
                ratingValue: 5,
                reviewCount: 0,
              },
              isVariantOf: {
                hasVariant: [
                  {
                    name: 'silver',
                    productID: '18643698',
                    slug: 'tasty-granite-towels-tasty-18643698',
                    sku: '18643698',
                  },
                  {
                    name: 'red',
                    productID: '8665813',
                    slug: 'tasty-granite-towels-tasty-8665813',
                    sku: '8665813',
                  },
                ],
                productGroupID: '55127871',
                name: 'Tasty Granite Towels Tasty',
                additionalProperty: [],
              },
              additionalProperty: [],
            },
            cursor: '0',
          },
          {
            node: {
              name: 'ivory',
              slug: 'licensed-frozen-sausages-97907082',
              sku: '97907082',
              productID: '97907082',
              description:
                'Sed nostrum est nostrum quo ipsum et ut asperiores quasi.',
              gtin: '4454274563902',
              brand: {
                name: 'iRobot',
              },
              image: [
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/166870/sit.jpg?v=637753013266530000',
                  alternateName: 'molestiae',
                },
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/166867/ratione.jpg?v=637753013256670000',
                  alternateName: 'occaecati',
                },
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/166868/modi.jpg?v=637753013260600000',
                  alternateName: 'labore',
                },
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/166869/quaerat.jpg?v=637753013263570000',
                  alternateName: 'qui',
                },
              ],
              offers: {
                highPrice: 531.54,
                lowPrice: 531.54,
                offerCount: 1,
                priceCurrency: '',
                offers: [
                  {
                    listPrice: 764.06,
                    sellingPrice: 531.54,
                    price: 531.54,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    quantity: 1,
                    seller: {
                      identifier: '1',
                    },
                    itemOffered: {
                      seo: {
                        title: 'Licensed Frozen Sausages',
                        titleTemplate: '',
                        description:
                          'Sed nostrum est nostrum quo ipsum et ut asperiores quasi.',
                        canonical: '',
                      },
                    },
                  },
                ],
              },
              review: [],
              aggregateRating: {
                ratingValue: 5,
                reviewCount: 0,
              },
              isVariantOf: {
                hasVariant: [
                  {
                    name: 'ivory',
                    productID: '97907082',
                    slug: 'licensed-frozen-sausages-97907082',
                    sku: '97907082',
                  },
                ],
                productGroupID: '42751008',
                name: 'Licensed Frozen Sausages',
                additionalProperty: [],
              },
              additionalProperty: [],
            },
            cursor: '1',
          },
          {
            node: {
              name: 'fuchsia',
              slug: 'unbranded-concrete-table-small-64953394',
              sku: '64953394',
              productID: '64953394',
              description: 'Aut omnis nobis tenetur.',
              gtin: '1346198062637',
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
                offers: [
                  {
                    listPrice: 297.7,
                    sellingPrice: 200.64,
                    price: 200.64,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    quantity: 1,
                    seller: {
                      identifier: '1',
                    },
                    itemOffered: {
                      seo: {
                        title: 'Unbranded Concrete Table Small',
                        titleTemplate: '',
                        description: 'Aut omnis nobis tenetur.',
                        canonical: '',
                      },
                    },
                  },
                ],
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
                    productID: '64953394',
                    slug: 'unbranded-concrete-table-small-64953394',
                    sku: '64953394',
                  },
                ],
                productGroupID: '29913569',
                name: 'Unbranded Concrete Table Small',
                additionalProperty: [],
              },
              additionalProperty: [],
            },
            cursor: '2',
          },
          {
            node: {
              name: 'lime',
              slug: 'small-concrete-tuna-incredible-85095548',
              sku: '85095548',
              productID: '85095548',
              description: 'Aliquam rerum dignissimos ex soluta est cumque.',
              gtin: '8718443313149',
              brand: {
                name: 'Brand',
              },
              image: [
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/178893/nam.jpg?v=637755498809500000',
                  alternateName: 'itaque',
                },
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/178892/quae.jpg?v=637755498804330000',
                  alternateName: 'voluptatem',
                },
              ],
              offers: {
                highPrice: 650.86,
                lowPrice: 650.86,
                offerCount: 1,
                priceCurrency: '',
                offers: [
                  {
                    listPrice: 968.3,
                    sellingPrice: 650.86,
                    price: 650.86,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    quantity: 1,
                    seller: {
                      identifier: '1',
                    },
                    itemOffered: {
                      seo: {
                        title: 'Small Concrete Tuna Incredible',
                        titleTemplate: '',
                        description:
                          'Aliquam rerum dignissimos ex soluta est cumque.',
                        canonical: '',
                      },
                    },
                  },
                ],
              },
              review: [],
              aggregateRating: {
                ratingValue: 5,
                reviewCount: 0,
              },
              isVariantOf: {
                hasVariant: [
                  {
                    name: 'lime',
                    productID: '85095548',
                    slug: 'small-concrete-tuna-incredible-85095548',
                    sku: '85095548',
                  },
                ],
                productGroupID: '32789477',
                name: 'Small Concrete Tuna Incredible',
                additionalProperty: [],
              },
              additionalProperty: [],
            },
            cursor: '3',
          },
          {
            node: {
              name: 'sky blue',
              slug: 'refined-metal-computer-68237302',
              sku: '68237302',
              productID: '68237302',
              description: 'In aut dolor perferendis voluptatibus hic dolores.',
              gtin: '8985861454535',
              brand: {
                name: 'Acer',
              },
              image: [
                {
                  url:
                    'http://storeframework.vtexassets.com/arquivos/ids/170491/vero.jpg?v=637753049086730000',
                  alternateName: 'labore',
                },
              ],
              offers: {
                highPrice: 253.07,
                lowPrice: 253.07,
                offerCount: 1,
                priceCurrency: '',
                offers: [
                  {
                    listPrice: 388.35,
                    sellingPrice: 253.07,
                    price: 253.07,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    quantity: 1,
                    seller: {
                      identifier: '1',
                    },
                    itemOffered: {
                      seo: {
                        title: 'Refined Metal Computer',
                        titleTemplate: '',
                        description:
                          'In aut dolor perferendis voluptatibus hic dolores.',
                        canonical: '',
                      },
                    },
                  },
                ],
              },
              review: [],
              aggregateRating: {
                ratingValue: 5,
                reviewCount: 0,
              },
              isVariantOf: {
                hasVariant: [
                  {
                    name: 'sky blue',
                    productID: '68237302',
                    slug: 'refined-metal-computer-68237302',
                    sku: '68237302',
                  },
                  {
                    name: 'cyan',
                    productID: '35445133',
                    slug: 'refined-metal-computer-35445133',
                    sku: '35445133',
                  },
                ],
                productGroupID: '70710833',
                name: 'Refined Metal Computer',
                additionalProperty: [],
              },
              additionalProperty: [],
            },
            cursor: '4',
          },
        ],
      },
      facets: [
        {
          key: 'preco',
          label: 'Preço',
          type: 'RANGE',
          values: [
            {
              value: '*-to-150',
              label: 'unknown',
              selected: false,
              quantity: 646,
            },
            {
              value: '360-to-*',
              label: 'unknown',
              selected: false,
              quantity: 601,
            },
            {
              value: '150-to-360',
              label: 'unknown',
              selected: false,
              quantity: 579,
            },
          ],
        },
        {
          key: 'categoria',
          label: 'Categoria',
          type: 'BOOLEAN',
          values: [
            {
              value: 'chairs',
              label: 'Chairs',
              selected: false,
              quantity: 951,
            },
            {
              value: 'desks',
              label: 'Desks',
              selected: false,
              quantity: 875,
            },
          ],
        },
        {
          key: 'marca',
          label: 'Marca',
          type: 'BOOLEAN',
          values: [
            {
              value: 'acer',
              label: 'Acer',
              selected: false,
              quantity: 263,
            },
            {
              value: 'adidas',
              label: 'adidas',
              selected: false,
              quantity: 231,
            },
            {
              value: 'black-decker',
              label: 'BLACK+DECKER',
              selected: false,
              quantity: 254,
            },
            {
              value: 'brand',
              label: 'Brand',
              selected: false,
              quantity: 239,
            },
            {
              value: 'irobot',
              label: 'iRobot',
              selected: false,
              quantity: 284,
            },
            {
              value: 'nike',
              label: 'Nike',
              selected: false,
              quantity: 285,
            },
            {
              value: 'skechers',
              label: 'Skechers',
              selected: false,
              quantity: 270,
            },
          ],
        },
      ],
    },
  },
}
