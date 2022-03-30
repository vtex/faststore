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

export const productSearchFetch = {
  info:
    'http://portal.vtexcommercestable.com.br/search-api/v1/storeframework/api/split/product_search/trade-policy/1?page=1&count=1&query=sku%3A64953394&sort=&fuzzy=0&hide-unavailable-items=false',
  init: undefined,
  result: JSON.parse(
    '{"total":1,"products":[{"unitMultiplier":1,"year":0,"extraData":[{"value":"1","key":"sellerId"}],"release":1638662400000,"discount":33,"reference":"4715709796003","collections":[{"id":"137","position":1}],"price":200.64,"customSort":0,"stickers":[],"id":"29913569","stock":1,"brand":"Brand","availableTradePolicies":["1"],"categoryTrees":[{"categoryNames":["Office","Desks"],"categoryIds":["9282","9295"]},{"categoryNames":["Office"],"categoryIds":["9282"]}],"images":[{"name":"et","value":"http://storeframework.vteximg.com.br/arquivos/ids/186495/corporis.jpg?v=637755567185370000"},{"name":"in","value":"http://storeframework.vteximg.com.br/arquivos/ids/186492/qui.jpg?v=637755567174570000"},{"name":"consectetur","value":"http://storeframework.vteximg.com.br/arquivos/ids/186493/possimus.jpg?v=637755567178470000"},{"name":"ea","value":"http://storeframework.vteximg.com.br/arquivos/ids/186494/nihil.jpg?v=637755567181900000"}],"locationAttributes":[],"tax":0,"productScore":1,"storeSplitAttribute":"__PLACEHOLDER__","brandId":"9280","installment":{"interest":false,"count":1,"paymentGroupName":"bankInvoicePaymentGroup","value":200.64,"paymentName":"Boleto Bancário","valueText":"$200.64"},"name":"Unbranded Concrete Table Small","boost":{"newness":0.7222222222222222,"image":1,"revenue":1,"discount":0.9879785425636955,"productScore":0,"click":1,"availableSpecsCount":1,"promotion":0,"order":1},"spotPrice":200.64,"skus":[{"images":[{"name":"et","value":"http://storeframework.vteximg.com.br/arquivos/ids/186495/corporis.jpg?v=637755567185370000"},{"name":"in","value":"http://storeframework.vteximg.com.br/arquivos/ids/186492/qui.jpg?v=637755567174570000"},{"name":"consectetur","value":"http://storeframework.vteximg.com.br/arquivos/ids/186493/possimus.jpg?v=637755567178470000"},{"name":"ea","value":"http://storeframework.vteximg.com.br/arquivos/ids/186494/nihil.jpg?v=637755567181900000"}],"nameComplete":"Unbranded Concrete Table Small fuchsia","complementName":"Repellendus ipsum suscipit. Tempore consectetur illo dicta ducimus qui ut tempore. Consequatur non laboriosam aut deleniti doloribus nostrum ab et. Odio molestias hic dolor sunt ipsam non. Blanditiis rerum aut dolorum ratione eveniet voluptatibus. Laborum incidunt velit est est laudantium eos.","policies":[{"id":"1","sellers":[{"default":true,"name":"VTEX","tax":0,"teasers":[],"id":"1"}]}],"videos":[],"reference":"1346198062637","idWithSplit":"64953394","name":"fuchsia","attributes":[],"id":"64953394","stock":1,"sellers":[{"default":true,"name":"VTEX","tax":0,"teasers":[],"id":"1"}]}],"link":"unbranded-concrete-table-small","wear":0,"description":"Aut omnis nobis tenetur.","aclBlockList":[],"showIfNotAvailable":true,"clusterHighlights":{},"categories":["Office","Desks"],"timestamp":1640818300408,"product":"29913569","oldPrice":297.7,"productSpecifications":[],"url":"/unbranded-concrete-table-small/p","measurementUnit":"un","categoryIds":["9282","9295"],"textAttributes":[{"joinedValue":"brand@@@Brand@@@@@@brand@@@Brand","isSku":false,"joinedKey":"text@@@brand@@@Brand@@@brand@@@Brand","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Brand","id":["9280"],"labelKey":"Brand","value":"brand","key":"brand","joinedValueTranslations":{},"originalKey":"brand","originalValue":"brand","originalLabelKey":"Brand","originalLabelValue":"Brand"},{"valueId":"9282","joinedValue":"office@@@Office@@@9282@@@office@@@Office","isSku":false,"joinedKey":"text@@@category-1@@@Category 1@@@category-1@@@Category 1","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Office","id":[],"labelKey":"Category 1","value":"office","key":"category-1","joinedValueTranslations":{},"originalKey":"category-1","originalValue":"office","originalLabelKey":"Category 1","originalLabelValue":"Office"},{"valueId":"9295","joinedValue":"desks@@@Desks@@@9295@@@desks@@@Desks","isSku":false,"joinedKey":"text@@@category-2@@@Category 2@@@category-2@@@Category 2","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Desks","id":[],"labelKey":"Category 2","value":"desks","key":"category-2","joinedValueTranslations":{},"originalKey":"category-2","originalValue":"desks","originalLabelKey":"Category 2","originalLabelValue":"Desks"},{"joinedValue":"yes@@@Yes@@@@@@yes@@@Yes","isSku":false,"joinedKey":"text@@@new-release@@@New Release@@@new-release@@@New Release","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Yes","id":[],"labelKey":"New Release","value":"yes","key":"new-release","joinedValueTranslations":{},"originalKey":"new-release","originalValue":"yes","originalLabelKey":"New Release","originalLabelValue":"Yes"},{"joinedValue":"137@@@137@@@@@@137@@@137","isSku":false,"joinedKey":"text@@@productclusterids@@@productClusterIds@@@productclusterids@@@productClusterIds","joinedKeyTranslations":{},"isFilter":false,"labelValue":"137","id":[],"labelKey":"productClusterIds","value":"137","key":"productclusterids","joinedValueTranslations":{},"originalKey":"productclusterids","originalValue":"137","originalLabelKey":"productClusterIds","originalLabelValue":"137"},{"valueId":"137","joinedValue":"all@@@All@@@137@@@all@@@All","isSku":false,"joinedKey":"text@@@productclusternames@@@productClusterNames@@@productclusternames@@@productClusterNames","joinedKeyTranslations":{},"isFilter":true,"labelValue":"All","id":[],"labelKey":"productClusterNames","value":"all","key":"productclusternames","joinedValueTranslations":{},"originalKey":"productclusternames","originalValue":"all","originalLabelKey":"productClusterNames","originalLabelValue":"All"},{"joinedValue":"false@@@false@@@@@@false@@@false","isSku":false,"joinedKey":"text@@@subscription@@@subscription@@@subscription@@@subscription","joinedKeyTranslations":{},"isFilter":false,"labelValue":"false","id":[],"labelKey":"subscription","value":"false","key":"subscription","joinedValueTranslations":{},"originalKey":"subscription","originalValue":"false","originalLabelKey":"subscription","originalLabelValue":"false"},{"joinedValue":"1@@@1@@@@@@1@@@1","isSku":false,"joinedKey":"text@@@trade-policy@@@Trade Policy@@@trade-policy@@@Trade Policy","joinedKeyTranslations":{},"isFilter":false,"labelValue":"1","id":[],"labelKey":"Trade Policy","value":"1","key":"trade-policy","joinedValueTranslations":{},"originalKey":"trade-policy","originalValue":"1","originalLabelKey":"Trade Policy","originalLabelValue":"1"},{"joinedValue":"1@@@1@@@@@@1@@@1","isSku":false,"joinedKey":"text@@@seller@@@Seller@@@seller@@@Seller","joinedKeyTranslations":{},"isFilter":false,"labelValue":"1","id":[],"labelKey":"Seller","value":"1","key":"seller","joinedValueTranslations":{},"originalKey":"seller","originalValue":"1","originalLabelKey":"Seller","originalLabelValue":"1"},{"valueId":"1","joinedValue":"vtex@@@VTEX@@@1@@@vtex@@@VTEX","isSku":false,"joinedKey":"text@@@sellername@@@sellerName@@@sellername@@@sellerName","joinedKeyTranslations":{},"isFilter":true,"labelValue":"VTEX","id":[],"labelKey":"sellerName","value":"vtex","key":"sellername","joinedValueTranslations":{},"originalKey":"sellername","originalValue":"vtex","originalLabelKey":"sellerName","originalLabelValue":"VTEX"},{"joinedValue":"yes@@@Yes@@@@@@yes@@@Yes","isSku":false,"joinedKey":"text@@@promotion@@@Promotion@@@promotion@@@Promotion","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Yes","id":[],"labelKey":"Promotion","value":"yes","key":"promotion","joinedValueTranslations":{},"originalKey":"promotion","originalValue":"yes","originalLabelKey":"Promotion","originalLabelValue":"Yes"}],"numberAttributes":[{"labelKey":"Price","value":200.64,"key":"price"}],"headSku":"64953394","specificationGroups":"{}","extraInfo":{"sellerId":"1"},"oldPriceText":"$297.70","priceText":"$200.64","spotPriceText":"$200.64"}],"pagination":{"count":1,"current":{"index":1,"proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=&fuzzy=0&operator=and"},"before":[],"after":[],"perPage":1,"next":{"index":0},"previous":{"index":0},"first":{"index":0},"last":{"index":0}},"sampling":false,"options":{"sorts":[{"field":"relevance","order":"desc","active":true,"proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=relevance:desc&fuzzy=0&operator=and"},{"field":"orders","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=orders:desc&fuzzy=0&operator=and"},{"field":"discount","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=discount:desc&fuzzy=0&operator=and"},{"field":"price","order":"asc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=price:asc&fuzzy=0&operator=and"},{"field":"price","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:64953394&sort=price:desc&fuzzy=0&operator=and"}],"counts":[{"count":24,"proxyUrl":"search/trade-policy/1?page=1&count=24&query=sku:64953394&sort=&fuzzy=0&operator=and"},{"count":48,"proxyUrl":"search/trade-policy/1?page=1&count=48&query=sku:64953394&sort=&fuzzy=0&operator=and"},{"count":72,"proxyUrl":"search/trade-policy/1?page=1&count=72&query=sku:64953394&sort=&fuzzy=0&operator=and"},{"count":96,"proxyUrl":"search/trade-policy/1?page=1&count=96&query=sku:64953394&sort=&fuzzy=0&operator=and"}]},"translated":false,"locale":"en-US","query":"sku:64953394","operator":"and","fuzzy":"0","correction":{"misspelled":true}}'
  ),
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
