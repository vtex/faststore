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
  info:
    'http://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=0&workspace=brasileiro&hide-unavailable-items=false',
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
    fuzzy: '0',
    operator: 'and',
    translated: false,
    pagination: {
      count: 50,
      current: {
        index: 1,
        proxyUrl:
          'search/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=0&operator=and',
      },
      before: [],
      after: [
        {
          index: 2,
          proxyUrl:
            'search/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=0&operator=and',
        },
        {
          index: 3,
          proxyUrl:
            'search/trade-policy/1?page=3&count=5&query=&sort=&fuzzy=0&operator=and',
        },
        {
          index: 4,
          proxyUrl:
            'search/trade-policy/1?page=4&count=5&query=&sort=&fuzzy=0&operator=and',
        },
        {
          index: 5,
          proxyUrl:
            'search/trade-policy/1?page=5&count=5&query=&sort=&fuzzy=0&operator=and',
        },
      ],
      perPage: 5,
      next: {
        index: 2,
        proxyUrl:
          'search/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=0&operator=and',
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
          'search/trade-policy/1?page=50&count=5&query=&sort=&fuzzy=0&operator=and',
      },
    },
  },
}

export const checkoutSimulationFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForms/simulation?sc=1',
  init: {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        { quantity: 1, seller: '1', id: '2737806' },
        { quantity: 1, seller: '1', id: '97907082' },
        { quantity: 1, seller: '1', id: '9938908' },
        { quantity: 1, seller: '1', id: '49950097' },
        { quantity: 1, seller: '1', id: '60500870' },
        { quantity: 1, seller: '1', id: '64953394' },
        { quantity: 1, seller: '1', id: '63114505' },
      ],
    }),
  },
  result: JSON.parse(
    '{"items":[{"id":"2737806","requestIndex":0,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:44:09Z","price":34912,"listPrice":55757,"rewardValue":0,"sellingPrice":34912,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/2737806","priceDefinition":{"calculatedSellingPrice":34912,"total":34912,"sellingPrices":[{"value":34912,"quantity":1}]}},{"id":"97907082","requestIndex":1,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:44:09Z","price":53154,"listPrice":76406,"rewardValue":0,"sellingPrice":53154,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/97907082","priceDefinition":{"calculatedSellingPrice":53154,"total":53154,"sellingPrices":[{"value":53154,"quantity":1}]}},{"id":"9938908","requestIndex":2,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:40:02Z","price":39958,"listPrice":56529,"rewardValue":0,"sellingPrice":39958,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/9938908","priceDefinition":{"calculatedSellingPrice":39958,"total":39958,"sellingPrices":[{"value":39958,"quantity":1}]}},{"id":"49950097","requestIndex":3,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:40:02Z","price":47477,"listPrice":51811,"rewardValue":0,"sellingPrice":47477,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/49950097","priceDefinition":{"calculatedSellingPrice":47477,"total":47477,"sellingPrices":[{"value":47477,"quantity":1}]}},{"id":"60500870","requestIndex":4,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:40:02Z","price":59317,"listPrice":61036,"rewardValue":0,"sellingPrice":59317,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/60500870","priceDefinition":{"calculatedSellingPrice":59317,"total":59317,"sellingPrices":[{"value":59317,"quantity":1}]}},{"id":"64953394","requestIndex":5,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:44:09Z","price":20064,"listPrice":29770,"rewardValue":0,"sellingPrice":20064,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/64953394","priceDefinition":{"calculatedSellingPrice":20064,"total":20064,"sellingPrices":[{"value":20064,"quantity":1}]}},{"id":"63114505","requestIndex":6,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:40:02Z","price":21767,"listPrice":31390,"rewardValue":0,"sellingPrice":21767,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/63114505","priceDefinition":{"calculatedSellingPrice":21767,"total":21767,"sellingPrices":[{"value":21767,"quantity":1}]}}],"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"paymentData":{"installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":"Boleto Bancário","paymentGroupName":"bankInvoicePaymentGroup","value":276649,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":276649,"total":276649,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":276649,"total":276649}]}]},{"paymentSystem":"201","bin":null,"paymentName":"Free","paymentGroupName":"custom201PaymentGroupPaymentGroup","value":276649,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":276649,"total":276649,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":276649,"total":276649}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":null,"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T13:23:16.4976709Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":null,"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T13:23:16.4976709Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"selectableGifts":[],"marketingData":null,"postalCode":null,"country":null,"logisticsInfo":[{"itemIndex":0,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":1,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":2,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":3,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":4,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":5,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]},{"itemIndex":6,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]}],"messages":[],"purchaseConditions":{"itemPurchaseConditions":[{"id":"2737806","seller":"1","sellerChain":["1"],"slas":[],"price":34912,"listPrice":55757},{"id":"97907082","seller":"1","sellerChain":["1"],"slas":[],"price":53154,"listPrice":76406},{"id":"9938908","seller":"1","sellerChain":["1"],"slas":[],"price":39958,"listPrice":56529},{"id":"49950097","seller":"1","sellerChain":["1"],"slas":[],"price":47477,"listPrice":51811},{"id":"60500870","seller":"1","sellerChain":["1"],"slas":[],"price":59317,"listPrice":61036},{"id":"64953394","seller":"1","sellerChain":["1"],"slas":[],"price":20064,"listPrice":29770},{"id":"63114505","seller":"1","sellerChain":["1"],"slas":[],"price":21767,"listPrice":31390}]},"pickupPoints":[],"subscriptionData":null,"totals":[{"id":"Items","name":"Items Total","value":276649}],"itemMetadata":null}'
  ),
}
