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

export const productSearchPage1Count5Fetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=auto&locale=en-US&hideUnavailableItems=false',
  init: undefined,
  result: {
    products: [
      {
        cacheId: 'sp-99995946',
        productId: '99995946',
        description: '4k Philips Monitor 27"',
        productName: '4k Philips Monitor 27"',
        linkText: '4k-philips-monitor',
        brand: 'adidas',
        brandId: 2000004,
        link: '/4k-philips-monitor/p',
        categories: ['/Technology/'],
        categoryId: '9297',
        categoriesIds: ['/9297/'],
        priceRange: {
          sellingPrice: {
            highPrice: 420,
            lowPrice: 420,
          },
          listPrice: {
            highPrice: 490,
            lowPrice: 490,
          },
        },
        specificationGroups: [
          {
            originalName: 'Specifications',
            name: 'Specifications',
            specifications: [],
          },
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'Specification 01',
                name: 'Specification 01',
                values: ['Monitor 27'],
              },
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [
          {
            id: '140',
            name: 'Most Wanted',
          },
        ],
        clusterHighlights: [],
        properties: [
          {
            name: 'Specification 01',
            originalName: 'Specification 01',
            values: ['Monitor 27'],
          },
          {
            name: 'sellerId',
            originalName: 'sellerId',
            values: ['1'],
          },
        ],
        items: [
          {
            sellers: [
              {
                sellerId: '1',
                sellerName: 'VTEX',
                addToCartLink: '',
                sellerDefault: true,
                commertialOffer: {
                  DeliverySlaSamplesPerRegion: {},
                  DeliverySlaSamples: [],
                  AvailableQuantity: 10000,
                  discountHighlights: [],
                  Installments: [
                    {
                      Value: 420,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 420,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 420,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 420,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 420,
                  ListPrice: 490,
                  spotPrice: 420,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 420,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:40:12Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190903',
                cacheId: '190903',
                imageTag: '',
                imageLabel: 'Monitor27',
                imageText: 'Monitor27',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190903/unsplash-monitor.jpg?v=637800152494200000',
              },
            ],
            itemId: '99988213',
            name: 'Monitor 27',
            nameComplete: '4k Philips Monitor 27� Monitor 27',
            complementName: '',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1504',
              },
            ],
            measurementUnit: 'un',
            unitMultiplier: 1,
            variations: [],
            ean: '',
            modalType: '',
            videos: [],
            attachments: [],
            isKit: false,
          },
        ],
        origin: 'intelligent-search',
      },
      {
        cacheId: 'sp-99995944',
        productId: '99995944',
        description: 'Aedle VK-1 L Headphone',
        productName: 'Aedle VK-1 L Headphone',
        linkText: 'aedle-vk1-headphone',
        brand: 'adidas',
        brandId: 2000004,
        link: '/aedle-vk1-headphone/p',
        categories: ['/Technology/'],
        categoryId: '9297',
        categoriesIds: ['/9297/'],
        priceRange: {
          sellingPrice: {
            highPrice: 130,
            lowPrice: 130,
          },
          listPrice: {
            highPrice: 150,
            lowPrice: 150,
          },
        },
        specificationGroups: [
          {
            originalName: 'Specifications',
            name: 'Specifications',
            specifications: [],
          },
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'Specification 01',
                name: 'Specification 01',
                values: ['Leather version'],
              },
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [
          {
            id: '140',
            name: 'Most Wanted',
          },
        ],
        clusterHighlights: [],
        properties: [
          {
            name: 'Specification 01',
            originalName: 'Specification 01',
            values: ['Leather version'],
          },
          {
            name: 'sellerId',
            originalName: 'sellerId',
            values: ['1'],
          },
        ],
        items: [
          {
            sellers: [
              {
                sellerId: '1',
                sellerName: 'VTEX',
                addToCartLink: '',
                sellerDefault: true,
                commertialOffer: {
                  DeliverySlaSamplesPerRegion: {},
                  DeliverySlaSamples: [],
                  AvailableQuantity: 10000,
                  discountHighlights: [],
                  Installments: [
                    {
                      Value: 130,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 130,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 130,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 130,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 130,
                  ListPrice: 150,
                  spotPrice: 130,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 130,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:40:12Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190901',
                cacheId: '190901',
                imageTag: '',
                imageLabel: 'aedleheadphone',
                imageText: 'aedleheadphone',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190901/unsplash-headphone.jpg?v=637800115948430000',
              },
            ],
            itemId: '99988211',
            name: 'Leather',
            nameComplete: 'Aedle VK-1 L Headphone Leather',
            complementName: '',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1502',
              },
            ],
            measurementUnit: 'un',
            unitMultiplier: 1,
            variations: [],
            ean: '',
            modalType: '',
            videos: [],
            attachments: [],
            isKit: false,
          },
        ],
        origin: 'intelligent-search',
      },
      {
        cacheId: 'sp-99995947',
        productId: '99995947',
        description: 'Echo Dot Smart Speaker',
        productName: 'Echo Dot Smart Speaker',
        linkText: 'echo-dot-smart-speaker',
        brand: 'adidas',
        brandId: 2000004,
        link: '/echo-dot-smart-speaker/p',
        categories: ['/Technology/'],
        categoryId: '9297',
        categoriesIds: ['/9297/'],
        priceRange: {
          sellingPrice: {
            highPrice: 280,
            lowPrice: 280,
          },
          listPrice: {
            highPrice: 310,
            lowPrice: 310,
          },
        },
        specificationGroups: [
          {
            originalName: 'Specifications',
            name: 'Specifications',
            specifications: [],
          },
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'Specification 01',
                name: 'Specification 01',
                values: ['Echo dot white'],
              },
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [
          {
            id: '140',
            name: 'Most Wanted',
          },
        ],
        clusterHighlights: [],
        properties: [
          {
            name: 'Specification 01',
            originalName: 'Specification 01',
            values: ['Echo dot white'],
          },
          {
            name: 'sellerId',
            originalName: 'sellerId',
            values: ['1'],
          },
        ],
        items: [
          {
            sellers: [
              {
                sellerId: '1',
                sellerName: 'VTEX',
                addToCartLink: '',
                sellerDefault: true,
                commertialOffer: {
                  DeliverySlaSamplesPerRegion: {},
                  DeliverySlaSamples: [],
                  AvailableQuantity: 10000,
                  discountHighlights: [],
                  Installments: [
                    {
                      Value: 280,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 280,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 280,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 280,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 280,
                  ListPrice: 310,
                  spotPrice: 280,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 280,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:40:12Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190904',
                cacheId: '190904',
                imageTag: '',
                imageLabel: 'echodotwhite',
                imageText: 'echodotwhite',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190904/unsplash-smart-speaker.jpg?v=637800166577500000',
              },
            ],
            itemId: '99988214',
            name: 'Echo dot white',
            nameComplete: 'Echo Dot Smart Speaker Echo dot white',
            complementName: '',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1505',
              },
            ],
            measurementUnit: 'un',
            unitMultiplier: 1,
            variations: [],
            ean: '',
            modalType: '',
            videos: [],
            attachments: [],
            isKit: false,
          },
        ],
        origin: 'intelligent-search',
      },
      {
        cacheId: 'sp-99995943',
        productId: '99995943',
        description: 'Virtual reality kit',
        productName: 'Oculus VR Headset',
        linkText: 'oculus-vr-headset',
        brand: 'adidas',
        brandId: 2000004,
        link: '/oculus-vr-headset/p',
        categories: ['/Technology/'],
        categoryId: '9297',
        categoriesIds: ['/9297/'],
        priceRange: {
          sellingPrice: {
            highPrice: 315,
            lowPrice: 315,
          },
          listPrice: {
            highPrice: 344,
            lowPrice: 344,
          },
        },
        specificationGroups: [
          {
            originalName: 'Specifications',
            name: 'Specifications',
            specifications: [],
          },
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'Specification 01',
                name: 'Specification 01',
                values: ['Spec 01 filled'],
              },
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [
          {
            id: '140',
            name: 'Most Wanted',
          },
        ],
        clusterHighlights: [],
        properties: [
          {
            name: 'Specification 01',
            originalName: 'Specification 01',
            values: ['Spec 01 filled'],
          },
          {
            name: 'sellerId',
            originalName: 'sellerId',
            values: ['1'],
          },
        ],
        items: [
          {
            sellers: [
              {
                sellerId: '1',
                sellerName: 'VTEX',
                addToCartLink: '',
                sellerDefault: true,
                commertialOffer: {
                  DeliverySlaSamplesPerRegion: {},
                  DeliverySlaSamples: [],
                  AvailableQuantity: 10000,
                  discountHighlights: [],
                  Installments: [
                    {
                      Value: 315,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 315,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 315,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 315,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 315,
                  ListPrice: 344,
                  spotPrice: 315,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 315,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:40:12Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190900',
                cacheId: '190900',
                imageTag: '',
                imageLabel: 'oculus',
                imageText: 'oculus',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190900/unsplash-vr-glasses.jpg?v=637799586135300000',
              },
            ],
            itemId: '99988210',
            name: 'Oculus VR Headset',
            nameComplete: 'Oculus VR Headset',
            complementName: '',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1501',
              },
            ],
            measurementUnit: 'un',
            unitMultiplier: 1,
            variations: [],
            ean: '',
            modalType: '',
            videos: [],
            attachments: [],
            isKit: false,
          },
        ],
        origin: 'intelligent-search',
      },
      {
        cacheId: 'sp-99995945',
        productId: '99995945',
        description: 'Apple Magic Mouse',
        productName: 'Apple Magic Mouse',
        linkText: 'apple-magic-mouse',
        brand: 'adidas',
        brandId: 2000004,
        link: '/apple-magic-mouse/p',
        categories: ['/Technology/'],
        categoryId: '9297',
        categoriesIds: ['/9297/'],
        priceRange: {
          sellingPrice: {
            highPrice: 950,
            lowPrice: 950,
          },
          listPrice: {
            highPrice: 999,
            lowPrice: 999,
          },
        },
        specificationGroups: [
          {
            originalName: 'Specifications',
            name: 'Specifications',
            specifications: [],
          },
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'Specification 01',
                name: 'Specification 01',
                values: ['Magic mouse'],
              },
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [
          {
            id: '140',
            name: 'Most Wanted',
          },
        ],
        clusterHighlights: [],
        properties: [
          {
            name: 'Specification 01',
            originalName: 'Specification 01',
            values: ['Magic mouse'],
          },
          {
            name: 'sellerId',
            originalName: 'sellerId',
            values: ['1'],
          },
        ],
        items: [
          {
            sellers: [
              {
                sellerId: '1',
                sellerName: 'VTEX',
                addToCartLink: '',
                sellerDefault: true,
                commertialOffer: {
                  DeliverySlaSamplesPerRegion: {},
                  DeliverySlaSamples: [],
                  AvailableQuantity: 10000,
                  discountHighlights: [],
                  Installments: [
                    {
                      Value: 950,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 950,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 950,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 950,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 950,
                  ListPrice: 999,
                  spotPrice: 950,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 950,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:40:12Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190902',
                cacheId: '190902',
                imageTag: '',
                imageLabel: 'Magicwhite',
                imageText: 'Magicwhite',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190902/unsplash-magic-mouse.jpg?v=637800136963870000',
              },
            ],
            itemId: '99988212',
            name: 'Magic white',
            nameComplete: 'Apple Magic Mouse Magic white',
            complementName: '',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1503',
              },
            ],
            measurementUnit: 'un',
            unitMultiplier: 1,
            variations: [],
            ean: '',
            modalType: '',
            videos: [],
            attachments: [],
            isKit: false,
          },
        ],
        origin: 'intelligent-search',
      },
    ],
    recordsFiltered: 5347,
    correction: {
      misspelled: true,
    },
    fuzzy: 'auto',
    operator: 'and',
    translated: false,
    pagination: {
      count: 50,
      current: {
        index: 1,
        proxyUrl:
          'search/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=auto&operator=and',
      },
      before: [],
      after: [
        {
          index: 2,
          proxyUrl:
            'search/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 3,
          proxyUrl:
            'search/trade-policy/1?page=3&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 4,
          proxyUrl:
            'search/trade-policy/1?page=4&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 5,
          proxyUrl:
            'search/trade-policy/1?page=5&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
      ],
      perPage: 5,
      next: {
        index: 2,
        proxyUrl:
          'search/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=auto&operator=and',
      },
      previous: {
        index: 0,
      },
      first: {
        index: 0,
      },
      last: {
        index: 50,
        proxyUrl:
          'search/trade-policy/1?page=50&count=5&query=&sort=&fuzzy=auto&operator=and',
      },
    },
  },
}
