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

export const productSearchCategory1Fetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/category-1/office/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=auto&locale=en-US&hideUnavailableItems=false',
  init: undefined,
  result: {
    products: [
      {
        cacheId: 'sp-6049813',
        productId: '6049813',
        description:
          'Consequatur placeat optio adipisci aut voluptate excepturi.',
        productName: 'Licensed Cotton Hat Licensed',
        productReference: '3794642025652',
        linkText: 'licensed-cotton-hat-licensed',
        brand: 'Skechers',
        brandId: 2000001,
        link: '/licensed-cotton-hat-licensed/p',
        categories: ['/Office/Desks/', '/Office/'],
        categoryId: '9295',
        categoriesIds: ['/9282/9295/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 264.63,
            lowPrice: 129.09,
          },
          listPrice: {
            highPrice: 325.77,
            lowPrice: 185.97,
          },
        },
        specificationGroups: [
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [],
        clusterHighlights: [],
        properties: [
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
                      Value: 129.09,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 129.09,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 129.09,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 129.09,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 129.09,
                  ListPrice: 185.97,
                  spotPrice: 129.09,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 129.09,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '181666',
                cacheId: '181666',
                imageTag: '',
                imageLabel: 'repellat',
                imageText: 'repellat',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181666/ut.jpg?v=637755525053770000',
              },
              {
                imageId: '181664',
                cacheId: '181664',
                imageTag: '',
                imageLabel: 'ut',
                imageText: 'ut',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181664/qui.jpg?v=637755525048170000',
              },
              {
                imageId: '181665',
                cacheId: '181665',
                imageTag: '',
                imageLabel: 'omnis',
                imageText: 'omnis',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181665/explicabo.jpg?v=637755525050970000',
              },
            ],
            itemId: '2791588',
            name: 'green',
            nameComplete: 'Licensed Cotton Hat Licensed green',
            complementName:
              'Occaecati omnis laboriosam perspiciatis voluptatem aut vel saepe. Eius sint tempora voluptatum qui nulla quae cumque alias. Velit quo nihil modi officia omnis.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '8463905750603',
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
                      Value: 264.63,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 264.63,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 264.63,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 264.63,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 264.63,
                  ListPrice: 325.77,
                  spotPrice: 264.63,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 264.63,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '181663',
                cacheId: '181663',
                imageTag: '',
                imageLabel: 'esse',
                imageText: 'esse',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181663/maiores.jpg?v=637755525037500000',
              },
              {
                imageId: '181661',
                cacheId: '181661',
                imageTag: '',
                imageLabel: 'necessitatibus',
                imageText: 'necessitatibus',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181661/fugit.jpg?v=637755525031270000',
              },
              {
                imageId: '181662',
                cacheId: '181662',
                imageTag: '',
                imageLabel: 'et',
                imageText: 'et',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/181662/perspiciatis.jpg?v=637755525034530000',
              },
            ],
            itemId: '93344885',
            name: 'red',
            nameComplete: 'Licensed Cotton Hat Licensed red',
            complementName:
              'Occaecati omnis laboriosam perspiciatis voluptatem aut vel saepe. Eius sint tempora voluptatum qui nulla quae cumque alias. Velit quo nihil modi officia omnis.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1747997762678',
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
        cacheId: 'sp-48182547',
        productId: '48182547',
        description: 'Ipsa in sequi incidunt dolores.',
        productName: 'Handmade Granite Computer Unbranded',
        productReference: '3167600753541',
        linkText: 'handmade-granite-computer-unbranded',
        brand: 'adidas',
        brandId: 2000004,
        link: '/handmade-granite-computer-unbranded/p',
        categories: ['/Office/Desks/', '/Office/'],
        categoryId: '9295',
        categoriesIds: ['/9282/9295/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 770,
            lowPrice: 362.36,
          },
          listPrice: {
            highPrice: 881.98,
            lowPrice: 537.5,
          },
        },
        specificationGroups: [
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [],
        clusterHighlights: [],
        properties: [
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
                      Value: 362.36,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 362.36,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 362.36,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 362.36,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 362.36,
                  ListPrice: 537.5,
                  spotPrice: 362.36,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 362.36,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '184304',
                cacheId: '184304',
                imageTag: '',
                imageLabel: 'impedit',
                imageText: 'impedit',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/184304/a.jpg?v=637755547736000000',
              },
            ],
            itemId: '44903104',
            name: 'red',
            nameComplete: 'Handmade Granite Computer Unbranded red',
            complementName:
              'Voluptatem quia in maiores. Est aut delectus et odit molestiae occaecati sit architecto. Cum nostrum minima.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '8169125134781',
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
                      Value: 770,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 770,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 770,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 770,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 770,
                  ListPrice: 881.98,
                  spotPrice: 770,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 770,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '184305',
                cacheId: '184305',
                imageTag: '',
                imageLabel: 'tempora',
                imageText: 'tempora',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/184305/nisi.jpg?v=637755547747730000',
              },
            ],
            itemId: '80744096',
            name: 'magenta',
            nameComplete: 'Handmade Granite Computer Unbranded magenta',
            complementName:
              'Voluptatem quia in maiores. Est aut delectus et odit molestiae occaecati sit architecto. Cum nostrum minima.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '5151004785840',
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
        cacheId: 'sp-8172115',
        productId: '8172115',
        description:
          'Dolor harum perferendis voluptatem tempora voluptatum ut et sapiente iure.',
        productName: 'Small Cotton Cheese',
        productReference: '3325400227651',
        linkText: 'small-cotton-cheese-3325400227651',
        brand: 'Acer',
        brandId: 2000002,
        link: '/small-cotton-cheese-3325400227651/p',
        categories: ['/Office/Chairs/', '/Office/'],
        categoryId: '9296',
        categoriesIds: ['/9282/9296/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 642.91,
            lowPrice: 247.01,
          },
          listPrice: {
            highPrice: 955.48,
            lowPrice: 339.21,
          },
        },
        specificationGroups: [
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [],
        clusterHighlights: [],
        properties: [
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
                      Value: 247.01,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 247.01,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 247.01,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 247.01,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 247.01,
                  ListPrice: 339.21,
                  spotPrice: 247.01,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 247.01,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '178292',
                cacheId: '178292',
                imageTag: '',
                imageLabel: 'debitis',
                imageText: 'debitis',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178292/ea.jpg?v=637755492251130000',
              },
              {
                imageId: '178290',
                cacheId: '178290',
                imageTag: '',
                imageLabel: 'et',
                imageText: 'et',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178290/voluptatum.jpg?v=637755492245200000',
              },
              {
                imageId: '178291',
                cacheId: '178291',
                imageTag: '',
                imageLabel: 'itaque',
                imageText: 'itaque',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178291/non.jpg?v=637755492248300000',
              },
            ],
            itemId: '96175310',
            name: 'olive',
            nameComplete: 'Small Cotton Cheese olive',
            complementName:
              'Reiciendis quo architecto. Totam est porro. Explicabo sed omnis adipisci consequuntur. Aut beatae qui quaerat et incidunt cumque. Velit eum sapiente eum tempore odit. Ab pariatur sunt.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '8277738323492',
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
                      Value: 333.67,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 333.67,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 333.67,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 333.67,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 333.67,
                  ListPrice: 504.39,
                  spotPrice: 333.67,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 333.67,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '178298',
                cacheId: '178298',
                imageTag: '',
                imageLabel: 'numquam',
                imageText: 'numquam',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178298/enim.jpg?v=637755492291330000',
              },
              {
                imageId: '178296',
                cacheId: '178296',
                imageTag: '',
                imageLabel: 'explicabo',
                imageText: 'explicabo',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178296/id.jpg?v=637755492284630000',
              },
              {
                imageId: '178297',
                cacheId: '178297',
                imageTag: '',
                imageLabel: 'numquam',
                imageText: 'numquam',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178297/autem.jpg?v=637755492288370000',
              },
            ],
            itemId: '47744496',
            name: 'grey',
            nameComplete: 'Small Cotton Cheese grey',
            complementName:
              'Reiciendis quo architecto. Totam est porro. Explicabo sed omnis adipisci consequuntur. Aut beatae qui quaerat et incidunt cumque. Velit eum sapiente eum tempore odit. Ab pariatur sunt.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '7345804070257',
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
                      Value: 642.91,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 642.91,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 642.91,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 642.91,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 642.91,
                  ListPrice: 955.48,
                  spotPrice: 642.91,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 642.91,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '178295',
                cacheId: '178295',
                imageTag: '',
                imageLabel: 'totam',
                imageText: 'totam',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178295/non.jpg?v=637755492271000000',
              },
              {
                imageId: '178293',
                cacheId: '178293',
                imageTag: '',
                imageLabel: 'sit',
                imageText: 'sit',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178293/voluptatibus.jpg?v=637755492264430000',
              },
              {
                imageId: '178294',
                cacheId: '178294',
                imageTag: '',
                imageLabel: 'ad',
                imageText: 'ad',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/178294/natus.jpg?v=637755492268200000',
              },
            ],
            itemId: '51309679',
            name: 'indigo',
            nameComplete: 'Small Cotton Cheese indigo',
            complementName:
              'Reiciendis quo architecto. Totam est porro. Explicabo sed omnis adipisci consequuntur. Aut beatae qui quaerat et incidunt cumque. Velit eum sapiente eum tempore odit. Ab pariatur sunt.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '5040304227270',
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
        cacheId: 'sp-31264637',
        productId: '31264637',
        description: 'Recusandae dolores alias.',
        productName: 'Tasty Frozen Tuna Handmade',
        productReference: '2063346997441',
        linkText: 'tasty-frozen-tuna-handmade',
        brand: 'adidas',
        brandId: 2000004,
        link: '/tasty-frozen-tuna-handmade/p',
        categories: ['/Office/Chairs/', '/Office/'],
        categoryId: '9296',
        categoriesIds: ['/9282/9296/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 582.1,
            lowPrice: 1.37,
          },
          listPrice: {
            highPrice: 638.97,
            lowPrice: 2.01,
          },
        },
        specificationGroups: [
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [],
        clusterHighlights: [],
        properties: [
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
                      Value: 1.37,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 1.37,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 1.37,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 1.37,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 1.37,
                  ListPrice: 2.01,
                  spotPrice: 1.37,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 1.37,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190604',
                cacheId: '190604',
                imageTag: '',
                imageLabel: 'ipsam',
                imageText: 'ipsam',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190604/vel.jpg?v=637755602570270000',
              },
            ],
            itemId: '12405783',
            name: 'fuchsia',
            nameComplete: 'Tasty Frozen Tuna Handmade fuchsia',
            complementName:
              'Ex dolores quibusdam omnis. Quis corporis perferendis aliquid labore amet quod. Repudiandae vel architecto ducimus consequatur in totam facilis saepe.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '6486061707855',
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
                      Value: 582.1,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 582.1,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 582.1,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 582.1,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 582.1,
                  ListPrice: 638.97,
                  spotPrice: 582.1,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 582.1,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '190605',
                cacheId: '190605',
                imageTag: '',
                imageLabel: 'ipsum',
                imageText: 'ipsum',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/190605/dolorem.jpg?v=637755602585600000',
              },
            ],
            itemId: '68456079',
            name: 'azure',
            nameComplete: 'Tasty Frozen Tuna Handmade azure',
            complementName:
              'Ex dolores quibusdam omnis. Quis corporis perferendis aliquid labore amet quod. Repudiandae vel architecto ducimus consequatur in totam facilis saepe.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '8573002454805',
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
        cacheId: 'sp-52016072',
        productId: '52016072',
        description: 'Aliquam a cumque ratione voluptatem in.',
        productName: 'Sleek Metal Pizza',
        productReference: '5751052565691',
        linkText: 'sleek-metal-pizza',
        brand: 'Acer',
        brandId: 2000002,
        link: '/sleek-metal-pizza/p',
        categories: ['/Office/Chairs/', '/Office/'],
        categoryId: '9296',
        categoriesIds: ['/9282/9296/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 517.54,
            lowPrice: 175.38,
          },
          listPrice: {
            highPrice: 666.42,
            lowPrice: 249.14,
          },
        },
        specificationGroups: [
          {
            originalName: 'allSpecifications',
            name: 'allSpecifications',
            specifications: [
              {
                originalName: 'sellerId',
                name: 'sellerId',
                values: ['1'],
              },
            ],
          },
        ],
        skuSpecifications: [],
        productClusters: [],
        clusterHighlights: [],
        properties: [
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
                      Value: 175.38,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 175.38,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 175.38,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 175.38,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 175.38,
                  ListPrice: 249.14,
                  spotPrice: 175.38,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 175.38,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '155949',
                cacheId: '155949',
                imageTag: '',
                imageLabel: 'ea',
                imageText: 'ea',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/155949/voluptas.jpg?v=637752878341070000',
              },
              {
                imageId: '155948',
                cacheId: '155948',
                imageTag: '',
                imageLabel: 'dolores',
                imageText: 'dolores',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/155948/molestiae.jpg?v=637752878337300000',
              },
            ],
            itemId: '24041857',
            name: 'olive',
            nameComplete: 'Sleek Metal Pizza olive',
            complementName:
              'Cum eum ut inventore aut quisquam. Accusamus odio laborum et id libero quia. Tenetur sint molestiae excepturi accusantium. Est porro occaecati quod. Nisi maiores deserunt laudantium perferendis rerum explicabo tenetur itaque amet. Temporibus beatae minus perferendis animi ut qui ullam veritatis.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '2231710663034',
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
                      Value: 517.54,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 517.54,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 517.54,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 517.54,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 517.54,
                  ListPrice: 666.42,
                  spotPrice: 517.54,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 517.54,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-13T11:41:21Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '155951',
                cacheId: '155951',
                imageTag: '',
                imageLabel: 'quam',
                imageText: 'quam',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/155951/molestiae.jpg?v=637752878358630000',
              },
              {
                imageId: '155950',
                cacheId: '155950',
                imageTag: '',
                imageLabel: 'iure',
                imageText: 'iure',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/155950/et.jpg?v=637752878353500000',
              },
            ],
            itemId: '94486378',
            name: 'green',
            nameComplete: 'Sleek Metal Pizza green',
            complementName:
              'Cum eum ut inventore aut quisquam. Accusamus odio laborum et id libero quia. Tenetur sint molestiae excepturi accusantium. Est porro occaecati quod. Nisi maiores deserunt laudantium perferendis rerum explicabo tenetur itaque amet. Temporibus beatae minus perferendis animi ut qui ullam veritatis.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '5117662847505',
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
    recordsFiltered: 1826,
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
          'search/category-1/office/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=auto&operator=and',
      },
      before: [],
      after: [
        {
          index: 2,
          proxyUrl:
            'search/category-1/office/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 3,
          proxyUrl:
            'search/category-1/office/trade-policy/1?page=3&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 4,
          proxyUrl:
            'search/category-1/office/trade-policy/1?page=4&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
        {
          index: 5,
          proxyUrl:
            'search/category-1/office/trade-policy/1?page=5&count=5&query=&sort=&fuzzy=auto&operator=and',
        },
      ],
      perPage: 5,
      next: {
        index: 2,
        proxyUrl:
          'search/category-1/office/trade-policy/1?page=2&count=5&query=&sort=&fuzzy=auto&operator=and',
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
          'search/category-1/office/trade-policy/1?page=50&count=5&query=&sort=&fuzzy=auto&operator=and',
      },
    },
  },
}

export const attributeSearchCategory1Fetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/facets/category-1/office/trade-policy/1?page=1&count=5&query=&sort=&fuzzy=auto&locale=en-US&hideUnavailableItems=false',
  init: undefined,
  result: {
    facets: [
      {
        values: [
          {
            quantity: 646,
            name: '',
            key: 'price',
            selected: false,
            range: { from: 0.23, to: 150 },
          },
          {
            quantity: 601,
            name: '',
            key: 'price',
            selected: false,
            range: { from: 360, to: 995.92 },
          },
          {
            quantity: 579,
            name: '',
            key: 'price',
            selected: false,
            range: { from: 150, to: 360 },
          },
        ],
        type: 'PRICERANGE',
        name: 'Pre�o',
        hidden: false,
        key: 'price',
        quantity: 3,
      },
      {
        values: [
          {
            id: '9296',
            quantity: 951,
            name: 'Chairs',
            key: 'category-2',
            value: 'chairs',
            selected: false,
            href: 'office/chairs?map=categoria',
          },
          {
            id: '9295',
            quantity: 875,
            name: 'Desks',
            key: 'category-2',
            value: 'desks',
            selected: false,
            href: 'office/desks?map=categoria',
          },
        ],
        type: 'TEXT',
        name: 'Categoria',
        hidden: false,
        key: 'category-2',
        quantity: 2,
      },
      {
        values: [
          {
            id: '9282',
            quantity: 1,
            name: 'Office',
            key: 'category-1',
            value: 'office',
            selected: true,
            href: 'office/office?map=departamento',
          },
        ],
        type: 'TEXT',
        name: 'Departamento',
        hidden: true,
        key: 'category-1',
        quantity: 1,
      },
      {
        values: [
          {
            id: '',
            quantity: 285,
            name: 'Nike',
            key: 'brand',
            value: 'nike',
            selected: false,
            href: 'office/nike?map=marca',
          },
          {
            id: '',
            quantity: 284,
            name: 'iRobot',
            key: 'brand',
            value: 'irobot',
            selected: false,
            href: 'office/irobot?map=marca',
          },
          {
            id: '',
            quantity: 270,
            name: 'Skechers',
            key: 'brand',
            value: 'skechers',
            selected: false,
            href: 'office/skechers?map=marca',
          },
          {
            id: '',
            quantity: 263,
            name: 'Acer',
            key: 'brand',
            value: 'acer',
            selected: false,
            href: 'office/acer?map=marca',
          },
          {
            id: '',
            quantity: 254,
            name: 'BLACK+DECKER',
            key: 'brand',
            value: 'black-decker',
            selected: false,
            href: 'office/black-decker?map=marca',
          },
          {
            id: '',
            quantity: 239,
            name: 'Brand',
            key: 'brand',
            value: 'brand',
            selected: false,
            href: 'office/brand?map=marca',
          },
          {
            id: '',
            quantity: 231,
            name: 'adidas',
            key: 'brand',
            value: 'adidas',
            selected: false,
            href: 'office/adidas?map=marca',
          },
        ],
        type: 'TEXT',
        name: 'Marca',
        hidden: false,
        key: 'brand',
        quantity: 7,
      },
    ],
    sampling: false,
    breadcrumb: [{ name: 'Office', href: '/office' }],
    queryArgs: {
      query: '',
      selectedFacets: [
        { key: 'category-1', value: 'office' },
        { key: 'trade-policy', value: '1' },
      ],
    },
    translated: false,
  },
}
