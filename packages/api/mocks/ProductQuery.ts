export const ProductByIdQuery = `query ProductQuery {
  product(locator: [{key: "id", value: "64953394"}]) {
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

export const productSearchFetch = {
  info:
    'http://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=1&count=1&query=sku%3A64953394&sort=&fuzzy=0&workspace=brasileiro&hide-unavailable-items=false',
  init: undefined,
  result: {
    products: [
      {
        cacheId: 'sp-29913569',
        productId: '29913569',
        description: 'Aut omnis nobis tenetur.',
        productName: 'Unbranded Concrete Table Small',
        productReference: '4715709796003',
        linkText: 'unbranded-concrete-table-small',
        brand: 'Brand',
        brandId: 9280,
        link: '/unbranded-concrete-table-small/p',
        categories: ['/Office/Desks/', '/Office/'],
        categoryId: '9295',
        categoriesIds: ['/9282/9295/', '/9282/'],
        priceRange: {
          sellingPrice: {
            highPrice: 200.64,
            lowPrice: 200.64,
          },
          listPrice: {
            highPrice: 297.7,
            lowPrice: 297.7,
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
                      Value: 200.64,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 200.64,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 200.64,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 200.64,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 200.64,
                  ListPrice: 297.7,
                  spotPrice: 200.64,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 200.64,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-07T14:08:58Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '186495',
                cacheId: '186495',
                imageTag: '',
                imageLabel: 'et',
                imageText: 'et',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/186495/corporis.jpg?v=637755567185370000',
              },
              {
                imageId: '186492',
                cacheId: '186492',
                imageTag: '',
                imageLabel: 'in',
                imageText: 'in',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/186492/qui.jpg?v=637755567174570000',
              },
              {
                imageId: '186493',
                cacheId: '186493',
                imageTag: '',
                imageLabel: 'consectetur',
                imageText: 'consectetur',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/186493/possimus.jpg?v=637755567178470000',
              },
              {
                imageId: '186494',
                cacheId: '186494',
                imageTag: '',
                imageLabel: 'ea',
                imageText: 'ea',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/186494/nihil.jpg?v=637755567181900000',
              },
            ],
            itemId: '64953394',
            name: 'fuchsia',
            nameComplete: 'Unbranded Concrete Table Small fuchsia',
            complementName:
              'Repellendus ipsum suscipit. Tempore consectetur illo dicta ducimus qui ut tempore. Consequatur non laboriosam aut deleniti doloribus nostrum ab et. Odio molestias hic dolor sunt ipsam non. Blanditiis rerum aut dolorum ratione eveniet voluptatibus. Laborum incidunt velit est est laudantium eos.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '1346198062637',
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
    recordsFiltered: 1,
    correction: {
      misspelled: true,
    },
    fuzzy: '0',
    operator: 'and',
    translated: false,
    pagination: {
      count: 1,
      current: {
        index: 1,
        proxyUrl:
          'search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=&fuzzy=0&operator=and',
      },
      before: [],
      after: [],
      perPage: 1,
      next: {
        index: 0,
      },
      previous: {
        index: 0,
      },
      first: {
        index: 0,
      },
      last: {
        index: 0,
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
    body: '{"items":[{"quantity":1,"seller":"1","id":"64953394"}]}',
  },
  result: JSON.parse(
    '{"items":[{"id":"64953394","requestIndex":0,"quantity":1,"seller":"1","sellerChain":["1"],"tax":0,"priceValidUntil":"2023-03-29T13:55:09Z","price":20064,"listPrice":29770,"rewardValue":0,"sellingPrice":20064,"offerings":[],"priceTags":[],"measurementUnit":"un","unitMultiplier":1,"parentItemIndex":null,"parentAssemblyBinding":null,"availability":"available","catalogProvider":"vrn:vtex.catalog-api-proxy:-:storeframework:master:/proxy/authenticated/catalog/pvt/sku/stockkeepingunitbyid/64953394","priceDefinition":{"calculatedSellingPrice":20064,"total":20064,"sellingPrices":[{"value":20064,"quantity":1}]}}],"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"paymentData":{"installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":"Boleto Bancário","paymentGroupName":"bankInvoicePaymentGroup","value":20064,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":20064,"total":20064,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":20064,"total":20064}]}]},{"paymentSystem":"201","bin":null,"paymentName":"Free","paymentGroupName":"custom201PaymentGroupPaymentGroup","value":20064,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":20064,"total":20064,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":20064,"total":20064}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":null,"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T13:45:49.1075749Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":null,"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T13:45:49.1075749Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"selectableGifts":[],"marketingData":null,"postalCode":null,"country":null,"logisticsInfo":[{"itemIndex":0,"addressId":null,"selectedSla":null,"selectedDeliveryChannel":null,"quantity":1,"shipsTo":["BRA","USA"],"slas":[],"deliveryChannels":[{"id":"delivery"}]}],"messages":[],"purchaseConditions":{"itemPurchaseConditions":[{"id":"64953394","seller":"1","sellerChain":["1"],"slas":[],"price":20064,"listPrice":29770}]},"pickupPoints":[],"subscriptionData":null,"totals":[{"id":"Items","name":"Items Total","value":20064}],"itemMetadata":null}'
  ),
}
