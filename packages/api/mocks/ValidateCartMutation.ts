export const ValidateCartMutation = `mutation ValidateCartMutation($cart: IStoreCart!) {
  validateCart(cart: $cart) {
    messages {
      status
      text
    }
    order {
      orderNumber
      acceptedOffer {
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
        }
      }
    }
  }
}
`

export const ValidCart = {
  order: {
    orderNumber: 'edbe3b03c8c94827a37ec5a6a4648fd2',
    acceptedOffer: [
      {
        price: 44.24,
        listPrice: 69.14,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '18643698',
          image: [
            {
              url:
                'http://storeframework.vtexassets.com/arquivos/ids/182417/aut.jpg?v=637755531474870000',
              alternateName: 'ab',
            },
          ],
          name: 'silver',
        },
      },
      {
        price: 531.54,
        listPrice: 764.06,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '97907082',
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
          name: 'ivory',
        },
      },
      {
        price: 200.64,
        listPrice: 297.7,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '64953394',
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
          name: 'fuchsia',
        },
      },
      {
        price: 650.86,
        listPrice: 968.3,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '85095548',
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
          name: 'lime',
        },
      },
      {
        price: 602.78,
        listPrice: 834.97,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '1191988',
          image: [
            {
              url:
                'http://storeframework.vtexassets.com/arquivos/ids/177382/assumenda.jpg?v=637753139967300000',
              alternateName: 'hic',
            },
          ],
          name: 'fuchsia',
        },
      },
    ],
  },
}

export const ValidCartWithAddOns = {
  order: {
    orderNumber: 'edbe3b03c8c94827a37ec5a6a4648fd2',
    acceptedOffer: [
      {
        listPrice: 450.23,
        price: 450.23,
        quantity: 1,
        seller: {
          identifier: '1',
        },
        itemOffered: {
          sku: '2000584',
          image: [],
          name: 'Custom Bell Gold Bell',
        },
      },
      {
        listPrice: 0,
        price: 0,
        quantity: 1,
        seller: {
          identifier: '1',
        },
        itemOffered: {
          sku: '2000591',
          image: [],
          name: 'Bells add-ons Roman',
        },
      },
      {
        listPrice: 75,
        price: 75,
        quantity: 1,
        seller: {
          identifier: '1',
        },
        itemOffered: {
          sku: '2000588',
          image: [],
          name: 'Bells add-ons Logo small',
        },
      },
      {
        listPrice: 10,
        price: 10,
        quantity: 1,
        seller: {
          identifier: '1',
        },
        itemOffered: {
          sku: '2000587',
          image: [],
          name: 'Bells add-ons 4 lines',
        },
      },
    ],
  },
}

export const InvalidCart = {
  order: {
    orderNumber: 'edbe3b03c8c94827a37ec5a6a4648fd2',
    acceptedOffer: [
      {
        price: 44.24,
        listPrice: 24343.1,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '18643698',
          image: [
            {
              url:
                'http://storeframework.vtexassets.com/arquivos/ids/182417/aut.jpg?v=637755531474870000',
              alternateName: 'ab',
            },
          ],
          name: 'silver',
        },
      },
      {
        price: 531.54,
        listPrice: 764.06,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '97907082',
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
          name: 'ivory',
        },
      },
      {
        price: 200.64,
        listPrice: 297.7,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '64953394',
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
          name: 'fuchsia',
        },
      },
      {
        price: 650.86,
        listPrice: 968.3,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '85095548',
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
          name: 'lime',
        },
      },
      {
        price: 602.78,
        listPrice: 834.97,
        seller: { identifier: '1' },
        quantity: 1,
        itemOffered: {
          sku: '1191988',
          image: [
            {
              url:
                'http://storeframework.vtexassets.com/arquivos/ids/177382/assumenda.jpg?v=637753139967300000',
              alternateName: 'hic',
            },
          ],
          name: 'fuchsia',
        },
      },
    ],
  },
}

// Valid Cart

export const checkoutOrderFormValidFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2?refreshOutdatedData=true&sc=1',
  init: { method: 'POST', headers: { 'content-type': 'application/json' } },
  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","salesChannel":"1","loggedIn":false,"isCheckedIn":false,"storeId":null,"checkedInPickupPointId":null,"allowManualPrice":false,"canEditData":true,"userProfileId":null,"userType":null,"ignoreProfileData":false,"value":69824,"messages":[],"items":[{"uniqueId":"90276D2ADB274F12B61A4ADE11874A0A","id":"2737806","productId":"43559243","productRefId":"6327601885574","refId":"6464716212392","ean":null,"name":"Fantastic Soft Cheese plum","skuName":"plum","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:50:01Z","tax":0,"price":34912,"listPrice":55757,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":34912,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Acer","brandId":"2000002","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9285/9294/","productCategories":{"9285":"Kitchen and Home Appliances","9294":"Appliances"},"quantity":2,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/168396-55-55/nihil.jpg?v=637753027573130000","detailUrl":"/fantastic-soft-cheese/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":34912,"total":69824,"sellingPrices":[{"value":34912,"quantity":2}]}}],"selectableGifts":[],"totalizers":[{"id":"Items","name":"Items Total","value":69824}],"shippingData":{"address":null,"logisticsInfo":[{"itemIndex":0,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"2737806","deliveryChannels":[{"id":"delivery"}]}],"selectedAddresses":[],"availableAddresses":[],"pickupPoints":[]},"clientProfileData":null,"paymentData":{"updateStatus":"updated","installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":null,"paymentGroupName":null,"value":69824,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824}]}]},{"paymentSystem":"201","bin":null,"paymentName":null,"paymentGroupName":null,"value":69824,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T14:40:00.2598674Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T14:40:00.2598674Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"marketingData":null,"sellers":[{"id":"1","name":"VTEX","logo":""}],"clientPreferencesData":{"locale":"en-US","optinNewsLetter":null},"commercialConditionData":null,"storePreferencesData":{"countryCode":"USA","saveUserData":true,"timeZone":"Central Standard Time","currencyCode":"USD","currencyLocale":1033,"currencySymbol":"$","currencyFormatInfo":{"currencyDecimalDigits":2,"currencyDecimalSeparator":".","currencyGroupSeparator":",","currencyGroupSize":3,"startsWithCurrencySymbol":true}},"giftRegistryData":null,"openTextField":null,"invoiceData":null,"customData":null,"itemMetadata":{"items":[{"id":"2737806","seller":"1","name":"Fantastic Soft Cheese plum","skuName":"plum","productId":"43559243","refId":"6464716212392","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/168396-55-55/nihil.jpg?v=637753027573130000","detailUrl":"/fantastic-soft-cheese/p","assemblyOptions":[]}]},"hooksData":null,"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"subscriptionData":null,"itemsOrdination":null}'
  ),
}

export const checkoutOrderFormItemsValidFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2/items?allowOutdatedData=paymentData&sc=1',
  init: {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: `{"orderItems":[{"quantity":1,"seller":"1","id":"18643698"},{"quantity":1,"seller":"1","id":"97907082"},{"quantity":1,"seller":"1","id":"64953394"},{"quantity":1,"seller":"1","id":"85095548"},{"quantity":1,"seller":"1","id":"1191988"},{"quantity":0,"seller":"1","id":"2737806","index":0}]}`,
  },

  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","salesChannel":"1","loggedIn":false,"isCheckedIn":false,"storeId":null,"checkedInPickupPointId":null,"allowManualPrice":false,"canEditData":true,"userProfileId":null,"userType":null,"ignoreProfileData":false,"value":203006,"messages":[],"items":[{"uniqueId":"A7E3AD875A0543F4BF52BA9F70CE34FE","id":"18643698","productId":"55127871","productRefId":"1056559252082","refId":"0969910297117","ean":null,"name":"Tasty Granite Towels Tasty silver","skuName":"silver","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:51:11Z","tax":0,"price":4424,"listPrice":6914,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":4424,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Nike","brandId":"2000006","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/182417-55-55/aut.jpg?v=637755531474870000","detailUrl":"/tasty-granite-towels-tasty/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":4424,"total":4424,"sellingPrices":[{"value":4424,"quantity":1}]}},{"uniqueId":"612DEBE9BC834445A33D60F5BAF40AB3","id":"97907082","productId":"42751008","productRefId":"8528464810736","refId":"4454274563902","ean":null,"name":"Licensed Frozen Sausages ivory","skuName":"ivory","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:47:55Z","tax":0,"price":53154,"listPrice":76406,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":53154,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"iRobot","brandId":"2000003","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/166870-55-55/sit.jpg?v=637753013266530000","detailUrl":"/licensed-frozen-sausages/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":53154,"total":53154,"sellingPrices":[{"value":53154,"quantity":1}]}},{"uniqueId":"BF69B3E6BD724181B716350A53BCF4D0","id":"64953394","productId":"29913569","productRefId":"4715709796003","refId":"1346198062637","ean":null,"name":"Unbranded Concrete Table Small fuchsia","skuName":"fuchsia","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:47:55Z","tax":0,"price":20064,"listPrice":29770,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":20064,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/186495-55-55/corporis.jpg?v=637755567185370000","detailUrl":"/unbranded-concrete-table-small/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":20064,"total":20064,"sellingPrices":[{"value":20064,"quantity":1}]}},{"uniqueId":"412B5DD9B47A4986848C55FB8CACBBD7","id":"85095548","productId":"32789477","productRefId":"4785818703589","refId":"8718443313149","ean":null,"name":"Small Concrete Tuna Incredible lime","skuName":"lime","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:47:55Z","tax":0,"price":65086,"listPrice":96830,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":65086,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9296/","productCategories":{"9282":"Office","9296":"Chairs"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/178893-55-55/nam.jpg?v=637755498809500000","detailUrl":"/small-concrete-tuna-incredible/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":65086,"total":65086,"sellingPrices":[{"value":65086,"quantity":1}]}},{"uniqueId":"87392CF7DC3F40B9BBD3750F532D78FC","id":"1191988","productId":"84484858","productRefId":"8905160026336","refId":"5987012953010","ean":null,"name":"Fantastic Soft Bacon fuchsia","skuName":"fuchsia","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:47:55Z","tax":0,"price":60278,"listPrice":83497,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":60278,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9286/9292/","productCategories":{"9286":"Computer and Software","9292":"Gadgets"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/177382-55-55/assumenda.jpg?v=637753139967300000","detailUrl":"/fantastic-soft-bacon/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":60278,"total":60278,"sellingPrices":[{"value":60278,"quantity":1}]}}],"selectableGifts":[],"totalizers":[{"id":"Items","name":"Items Total","value":203006}],"shippingData":{"address":null,"logisticsInfo":[{"itemIndex":0,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"18643698","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":1,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"97907082","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":2,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"64953394","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":3,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"85095548","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":4,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"1191988","deliveryChannels":[{"id":"delivery"}]}],"selectedAddresses":[],"availableAddresses":[],"pickupPoints":[]},"clientProfileData":null,"paymentData":{"updateStatus":"updated","installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":null,"paymentGroupName":null,"value":203006,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006}]}]},{"paymentSystem":"201","bin":null,"paymentName":null,"paymentGroupName":null,"value":203006,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T14:40:00.2598674Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T14:40:00.2598674Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"marketingData":null,"sellers":[{"id":"1","name":"VTEX","logo":""}],"clientPreferencesData":{"locale":"en-US","optinNewsLetter":null},"commercialConditionData":null,"storePreferencesData":{"countryCode":"USA","saveUserData":true,"timeZone":"Central Standard Time","currencyCode":"USD","currencyLocale":1033,"currencySymbol":"$","currencyFormatInfo":{"currencyDecimalDigits":2,"currencyDecimalSeparator":".","currencyGroupSeparator":",","currencyGroupSize":3,"startsWithCurrencySymbol":true}},"giftRegistryData":null,"openTextField":null,"invoiceData":null,"customData":null,"itemMetadata":{"items":[{"id":"18643698","seller":"1","name":"Tasty Granite Towels Tasty silver","skuName":"silver","productId":"55127871","refId":"0969910297117","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/182417-55-55/aut.jpg?v=637755531474870000","detailUrl":"/tasty-granite-towels-tasty/p","assemblyOptions":[]},{"id":"97907082","seller":"1","name":"Licensed Frozen Sausages ivory","skuName":"ivory","productId":"42751008","refId":"4454274563902","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/166870-55-55/sit.jpg?v=637753013266530000","detailUrl":"/licensed-frozen-sausages/p","assemblyOptions":[]},{"id":"64953394","seller":"1","name":"Unbranded Concrete Table Small fuchsia","skuName":"fuchsia","productId":"29913569","refId":"1346198062637","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/186495-55-55/corporis.jpg?v=637755567185370000","detailUrl":"/unbranded-concrete-table-small/p","assemblyOptions":[]},{"id":"85095548","seller":"1","name":"Small Concrete Tuna Incredible lime","skuName":"lime","productId":"32789477","refId":"8718443313149","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/178893-55-55/nam.jpg?v=637755498809500000","detailUrl":"/small-concrete-tuna-incredible/p","assemblyOptions":[]},{"id":"1191988","seller":"1","name":"Fantastic Soft Bacon fuchsia","skuName":"fuchsia","productId":"84484858","refId":"5987012953010","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/177382-55-55/assumenda.jpg?v=637753139967300000","detailUrl":"/fantastic-soft-bacon/p","assemblyOptions":[]}]},"hooksData":null,"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"subscriptionData":null,"itemsOrdination":null}'
  ),
}

// Valid Cart with assembly options

export const checkoutOrderFormValidAssemblyOptionsFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2?refreshOutdatedData=true&sc=1',
  init: { method: 'POST', headers: { 'content-type': 'application/json' } },
  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","items":[{"additionalInfo":{"brandName":"Kawasaki","__typename":"ItemAdditionalInfo"},"attachments":[],"attachmentOfferings":[],"bundleItems":[],"parentAssemblyBinding":null,"parentItemIndex":null,"sellingPriceWithAssemblies":null,"options":null,"availability":"available","detailUrl":"/custom-bell/p","id":"2000584","imageUrls":{"at1x":"//storeframework.vteximg.com.br/arquivos/ids/155545-96-auto","at2x":"//storeframework.vteximg.com.br/arquivos/ids/155545-192-auto","at3x":"//storeframework.vteximg.com.br/arquivos/ids/155545-288-auto","__typename":"ImageUrls"},"listPrice":45023,"manualPrice":null,"measurementUnit":"un","modalType":null,"name":"Custom Bell","offerings":[],"price":45023,"priceTags":[],"productCategories":{"40":"Home & Decor"},"productCategoryIds":"/40/","productRefId":"","productId":"2000032","quantity":1,"seller":"1","sellingPrice":45023,"skuName":"Gold Bell","skuSpecifications":[],"unitMultiplier":1,"uniqueId":"6C21F612EF80436281857C7F1ADC9BA0","refId":"1212121444","isGift":false,"priceDefinition":{"calculatedSellingPrice":45023,"total":45023,"sellingPrices":[{"quantity":1,"value":45023,"__typename":"SellingPrice"}],"__typename":"PriceDefinition"},"__typename":"Item"},{"additionalInfo":{"brandName":"Kawasaki","__typename":"ItemAdditionalInfo"},"attachments":[],"attachmentOfferings":[],"bundleItems":[],"parentAssemblyBinding":"text_style_Text Style","parentItemIndex":0,"sellingPriceWithAssemblies":null,"options":null,"availability":"available","detailUrl":"/bells-add-on/p","id":"2000591","imageUrls":{"at1x":"//storeframework.vteximg.com.br/arquivos/ids/155551-96-auto","at2x":"//storeframework.vteximg.com.br/arquivos/ids/155551-192-auto","at3x":"//storeframework.vteximg.com.br/arquivos/ids/155551-288-auto","__typename":"ImageUrls"},"listPrice":0,"manualPrice":null,"measurementUnit":"un","modalType":null,"name":"Bells add-ons","offerings":[],"price":0,"priceTags":[],"productCategories":{"50":"Hobbies e artes"},"productCategoryIds":"/50/","productRefId":"81089","productId":"2000033","quantity":1,"seller":"1","sellingPrice":0,"skuName":"Roman","skuSpecifications":[],"unitMultiplier":1,"uniqueId":"767D01BACFCD4663B652FBFCE446E0B1","refId":"17212","isGift":false,"priceDefinition":{"calculatedSellingPrice":0,"total":0,"sellingPrices":[{"quantity":1,"value":0,"__typename":"SellingPrice"}],"__typename":"PriceDefinition"},"__typename":"Item"},{"additionalInfo":{"brandName":"Kawasaki","__typename":"ItemAdditionalInfo"},"attachments":[],"attachmentOfferings":[],"bundleItems":[],"parentAssemblyBinding":"add-on_Add-on","parentItemIndex":0,"sellingPriceWithAssemblies":null,"options":null,"availability":"available","detailUrl":"/bells-add-on/p","id":"2000588","imageUrls":{"at1x":"//storeframework.vteximg.com.br/arquivos/ids/155549-96-auto","at2x":"//storeframework.vteximg.com.br/arquivos/ids/155549-192-auto","at3x":"//storeframework.vteximg.com.br/arquivos/ids/155549-288-auto","__typename":"ImageUrls"},"listPrice":7500,"manualPrice":null,"measurementUnit":"un","modalType":null,"name":"Bells add-ons","offerings":[],"price":7500,"priceTags":[],"productCategories":{"50":"Hobbies e artes"},"productCategoryIds":"/50/","productRefId":"81089","productId":"2000033","quantity":1,"seller":"1","sellingPrice":7500,"skuName":"Logo small","skuSpecifications":[],"unitMultiplier":1,"uniqueId":"7786E27AA8D449A893778896AD1AE388","refId":"3214455","isGift":false,"priceDefinition":{"calculatedSellingPrice":7500,"total":7500,"sellingPrices":[{"quantity":1,"value":7500,"__typename":"SellingPrice"}],"__typename":"PriceDefinition"},"__typename":"Item"},{"additionalInfo":{"brandName":"Kawasaki","__typename":"ItemAdditionalInfo"},"attachments":[{"name":"4-lines","content":{"Line 1":"aaaa","Line 2":"","Line 3":"bbbbbb","Line 4":""},"__typename":"Attachment"}],"attachmentOfferings":[{"name":"4-lines","required":true,"schema":{"Line 1":{"maximumNumberOfCharacters":200,"domain":[]},"Line 2":{"maximumNumberOfCharacters":200,"domain":[]},"Line 3":{"maximumNumberOfCharacters":200,"domain":[]},"Line 4":{"maximumNumberOfCharacters":200,"domain":[]}},"__typename":"AttachmentOffering"}],"bundleItems":[],"parentAssemblyBinding":"engraving_Engraving","parentItemIndex":0,"sellingPriceWithAssemblies":null,"options":null,"availability":"available","detailUrl":"/bells-add-on/p","id":"2000587","imageUrls":{"at1x":"//storeframework.vteximg.com.br/arquivos/ids/155548-96-auto","at2x":"//storeframework.vteximg.com.br/arquivos/ids/155548-192-auto","at3x":"//storeframework.vteximg.com.br/arquivos/ids/155548-288-auto","__typename":"ImageUrls"},"listPrice":1000,"manualPrice":null,"measurementUnit":"un","modalType":null,"name":"Bells add-ons","offerings":[],"price":1000,"priceTags":[],"productCategories":{"50":"Hobbies e artes"},"productCategoryIds":"/50/","productRefId":"81089","productId":"2000033","quantity":1,"seller":"1","sellingPrice":1000,"skuName":"4 lines","skuSpecifications":[],"unitMultiplier":1,"uniqueId":"DD5D7FDADDF540C392E82C3EED7F97BC","refId":"555018","isGift":false,"priceDefinition":{"calculatedSellingPrice":1000,"total":1000,"sellingPrices":[{"quantity":1,"value":1000,"__typename":"SellingPrice"}],"__typename":"PriceDefinition"},"__typename":"Item"}],"value":53523,"totalizers":[{"id":"Items","name":"Items Total","value":53523,"__typename":"Totalizer"}],"marketingData":{"coupon":"","utmCampaign":"","utmMedium":"","utmSource":"","utmiCampaign":"","utmiPart":"","utmiPage":"","__typename":"MarketingData"},"canEditData":true,"loggedIn":false,"paymentData":{"paymentSystems":[{"id":"17","name":"Promissory","groupName":"promissoryPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false,"__typename":"Validator"},"stringId":"17","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:27:16.1463198Z","__typename":"PaymentSystem"},{"id":"201","name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false,"__typename":"Validator"},"stringId":"201","requiresDocument":false,"isCustom":true,"description":"","requiresAuthentication":false,"dueDate":"2022-05-13T18:27:16.1463198Z","__typename":"PaymentSystem"},{"id":"6","name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false,"__typename":"Validator"},"stringId":"6","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"64","name":"Customer Credit","groupName":"creditControlPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false,"__typename":"Validator"},"stringId":"64","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"16","name":"Vale","groupName":"giftCardPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false,"__typename":"Validator"},"stringId":"16","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"3","name":"Diners","groupName":"creditCardPaymentGroup","validator":{"regex":"^3(0[0-5]|[68][0-9])[0-9]{11}$","mask":"9999 999999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true,"__typename":"Validator"},"stringId":"3","requiresDocument":true,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"1","name":"American Express","groupName":"creditCardPaymentGroup","validator":{"regex":"^3[47][0-9]{13}$","mask":"9999 999999 99999","cardCodeRegex":"^[0-9]{4}$","cardCodeMask":"9999","weights":[1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true,"__typename":"Validator"},"stringId":"1","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"4","name":"Mastercard","groupName":"creditCardPaymentGroup","validator":{"regex":"^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\\\d{4,10})|((502121)\\\\d{4,10})|((589916)\\\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\\\d{4,10})","mask":"9999 9999 9999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true,"__typename":"Validator"},"stringId":"4","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"},{"id":"2","name":"Visa","groupName":"creditCardPaymentGroup","validator":{"regex":"^4[0-9]{15}$","mask":"9999 9999 9999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true,"__typename":"Validator"},"stringId":"2","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T18:26:16.1463198Z","__typename":"PaymentSystem"}],"payments":[],"installmentOptions":[{"paymentSystem":"17","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"201","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"6","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"64","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"16","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"3","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"1","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"4","installments":[],"__typename":"InstallmentOption"},{"paymentSystem":"2","installments":[],"__typename":"InstallmentOption"}],"availableAccounts":[],"isValid":false,"__typename":"PaymentData"},"messages":{"couponMessages":[],"generalMessages":[],"__typename":"OrderFormMessages"},"shipping":{"countries":["BRA","USA"],"availableAddresses":[],"selectedAddress":null,"deliveryOptions":[],"pickupOptions":[],"isValid":false,"__typename":"Shipping"},"userProfileId":null,"userType":"STORE_USER","clientProfileData":null,"clientPreferencesData":{"locale":"en-US","optInNewsletter":null,"__typename":"ClientPreferencesData"},"allowManualPrice":false,"customData":null,"__typename":"OrderForm"}'
  ),
}

export const checkoutOrderFormItemsValidAssemblyOptionsFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2/items?allowOutdatedData=paymentData&sc=1',
  init: {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: `{"orderItems":[{"quantity":1,"seller":"1","id":"2000584","index":0},{"quantity":1,"seller":"1","id":"2000591","index":1},{"quantity":1,"seller":"1","id":"2000588","index":2},{"quantity":1,"seller":"1","id":"2000587","index":3}]}`,
  },

  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","salesChannel":"1","loggedIn":false,"isCheckedIn":false,"storeId":null,"checkedInPickupPointId":null,"allowManualPrice":false,"canEditData":true,"userProfileId":null,"userType":null,"ignoreProfileData":false,"value":52523,"messages":[],"items":[{"uniqueId":"6C21F612EF80436281857C7F1ADC9BA0","id":"2000584","productId":"2000032","productRefId":"","refId":"1212121444","ean":"222444","name":"Custom Bell Gold Bell","skuName":"Gold Bell","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-05-03T19:56:26Z","tax":0,"price":45023,"listPrice":45023,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":45023,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Kawasaki","brandId":"2000001","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/40/","productCategories":{"40":"Home & Decor"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155545-55-55/gold_bell.jpg?v=637020789145570000","detailUrl":"/custom-bell/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":45023,"total":45023,"sellingPrices":[{"value":45023,"quantity":1}]}},{"uniqueId":"767D01BACFCD4663B652FBFCE446E0B1","id":"2000591","productId":"2000033","productRefId":"81089","refId":"17212","ean":"112321111","name":"Bells add-ons Roman","skuName":"Roman","modalType":null,"parentItemIndex":0,"parentAssemblyBinding":"text_style_Text Style","assemblies":[],"priceValidUntil":"2023-05-03T19:56:26Z","tax":0,"price":0,"listPrice":0,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":0,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Kawasaki","brandId":"2000001","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/50/","productCategories":{"50":"Hobbies e artes"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155551-55-55/roman.png?v=637020804802370000","detailUrl":"/bells-add-on/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":0,"total":0,"sellingPrices":[{"value":0,"quantity":1}]}},{"uniqueId":"7786E27AA8D449A893778896AD1AE388","id":"2000588","productId":"2000033","productRefId":"81089","refId":"3214455","ean":"08484","name":"Bells add-ons Logo small","skuName":"Logo small","modalType":null,"parentItemIndex":0,"parentAssemblyBinding":"add-on_Add-on","assemblies":[],"priceValidUntil":"2023-05-03T19:56:26Z","tax":0,"price":7500,"listPrice":7500,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":7500,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Kawasaki","brandId":"2000001","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/50/","productCategories":{"50":"Hobbies e artes"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155549-55-55/logo-bell.jpg?v=637020801573330000","detailUrl":"/bells-add-on/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":7500,"total":7500,"sellingPrices":[{"value":7500,"quantity":1}]}}],"selectableGifts":[],"totalizers":[{"id":"Items","name":"Items Total","value":52523}],"shippingData":{"address":null,"logisticsInfo":[{"itemIndex":0,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"2000584","deliveryChannels":[]},{"itemIndex":1,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"2000591","deliveryChannels":[]},{"itemIndex":2,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"2000588","deliveryChannels":[]}],"selectedAddresses":[],"availableAddresses":[],"pickupPoints":[]},"clientProfileData":null,"paymentData":{"updateStatus":"updated","installmentOptions":[{"paymentSystem":"17","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"201","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"6","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"64","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"16","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"3","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"1","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"4","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]},{"paymentSystem":"2","bin":null,"paymentName":null,"paymentGroupName":null,"value":52523,"installments":[]}],"paymentSystems":[{"id":17,"name":"Promissory","groupName":"promissoryPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"17","template":"promissoryPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:52:11.0144059Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":true,"description":"","requiresAuthentication":false,"dueDate":"2022-05-13T19:52:11.0144059Z","availablePayments":null},{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":64,"name":"Customer Credit","groupName":"creditControlPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"64","template":"creditControlPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":16,"name":"Vale","groupName":"giftCardPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"16","template":"giftCardPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":3,"name":"Diners","groupName":"creditCardPaymentGroup","validator":{"regex":"^3(0[0-5]|[68][0-9])[0-9]{11}$","mask":"9999 999999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true},"stringId":"3","template":"creditCardPaymentGroup-template","requiresDocument":true,"displayDocument":true,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":1,"name":"American Express","groupName":"creditCardPaymentGroup","validator":{"regex":"^3[47][0-9]{13}$","mask":"9999 999999 99999","cardCodeRegex":"^[0-9]{4}$","cardCodeMask":"9999","weights":[1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true},"stringId":"1","template":"creditCardPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":4,"name":"Mastercard","groupName":"creditCardPaymentGroup","validator":{"regex":"^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\\\d{4,10})|((502121)\\\\d{4,10})|((589916)\\\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\\\d{4,10})","mask":"9999 9999 9999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true},"stringId":"4","template":"creditCardPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null},{"id":2,"name":"Visa","groupName":"creditCardPaymentGroup","validator":{"regex":"^4[0-9]{15}$","mask":"9999 9999 9999 9999","cardCodeRegex":"^[0-9]{3}$","cardCodeMask":"999","weights":[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],"useCvv":true,"useExpirationDate":true,"useCardHolderName":true,"useBillingAddress":true},"stringId":"2","template":"creditCardPaymentGroup-template","requiresDocument":false,"displayDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-05-10T19:51:11.0144059Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"marketingData":null,"sellers":[{"id":"1","name":"VTEX","logo":""}],"clientPreferencesData":{"locale":"en-US","optinNewsLetter":null,"savePersonalData":false,"savePaymentData":false},"commercialConditionData":null,"storePreferencesData":{"countryCode":"USA","saveUserData":true,"timeZone":"Eastern Standard Time","currencyCode":"USD","currencyLocale":1033,"currencySymbol":"$","currencyFormatInfo":{"currencyDecimalDigits":2,"currencyDecimalSeparator":".","currencyGroupSeparator":",","currencyGroupSize":3,"startsWithCurrencySymbol":true}},"giftRegistryData":null,"openTextField":null,"invoiceData":null,"customData":null,"itemMetadata":{"items":[{"id":"2000584","seller":"1","name":"Custom Bell Gold Bell","skuName":"Gold Bell","productId":"2000032","refId":"1212121444","ean":"222444","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155545-55-55/gold_bell.jpg?v=637020789145570000","detailUrl":"/custom-bell/p","assemblyOptions":[{"id":"add-on_Add-on","name":"add-on","required":true,"inputValues":{},"composition":{"minQuantity":0,"maxQuantity":3,"items":[{"id":"2000588","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":"vip"},{"id":"2000589","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":"vip"},{"id":"2000590","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":"vip"}]}},{"id":"text_style_Text Style","name":"text_style","required":true,"inputValues":{},"composition":{"minQuantity":1,"maxQuantity":1,"items":[{"id":"2000591","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":1,"priceTable":"vip"},{"id":"2000592","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":"vip"}]}},{"id":"engraving_Engraving","name":"engraving","required":true,"inputValues":{},"composition":{"minQuantity":0,"maxQuantity":1,"items":[{"id":"2000586","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":"vip"},{"id":"2000587","seller":"1","minQuantity":0,"maxQuantity":1,"initialQuantity":0,"priceTable":""}]}}]},{"id":"2000588","seller":"1","name":"Bells add-ons Logo small","skuName":"Logo small","productId":"2000033","refId":"3214455","ean":"08484","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155549-55-55/logo-bell.jpg?v=637020801573330000","detailUrl":"/bells-add-on/p","assemblyOptions":[]},{"id":"2000589","seller":"1","name":"Bells add-ons Logo big","skuName":"Logo big","productId":"2000033","refId":"0001","ean":"91811","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155549-55-55/logo-bell.jpg?v=637020801573330000","detailUrl":"/bells-add-on/p","assemblyOptions":[]},{"id":"2000590","seller":"1","name":"Bells add-ons Plaque","skuName":"Plaque","productId":"2000033","refId":"5567899","ean":"342355","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155550-55-55/Plaque.jpg?v=637020802611500000","detailUrl":"/bells-add-on/p","assemblyOptions":[]},{"id":"2000591","seller":"1","name":"Bells add-ons Roman","skuName":"Roman","productId":"2000033","refId":"17212","ean":"112321111","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155551-55-55/roman.png?v=637020804802370000","detailUrl":"/bells-add-on/p","assemblyOptions":[]},{"id":"2000592","seller":"1","name":"Bells add-ons Script","skuName":"Script","productId":"2000033","refId":"192281","ean":"0808181","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155551-55-55/roman.png?v=637020804802370000","detailUrl":"/bells-add-on/p","assemblyOptions":[]},{"id":"2000586","seller":"1","name":"Bells add-ons 1-3 lines","skuName":"1-3 lines","productId":"2000033","refId":"7987690","ean":"889000001","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155547-55-55/3-lins.jpg?v=637020796905600000","detailUrl":"/bells-add-on/p","assemblyOptions":[{"id":"1-3-lines","name":"1-3-lines","required":false,"inputValues":{"Line 1":{"maximumNumberOfCharacters":200,"domain":[]},"Line 2":{"maximumNumberOfCharacters":200,"domain":[]},"Line 3":{"maximumNumberOfCharacters":200,"domain":[]}},"composition":null}]},{"id":"2000587","seller":"1","name":"Bells add-ons 4 lines","skuName":"4 lines","productId":"2000033","refId":"555018","ean":"313122","imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/155548-55-55/3-lins.jpg?v=637020800571470000","detailUrl":"/bells-add-on/p","assemblyOptions":[{"id":"4-lines","name":"4-lines","required":true,"inputValues":{"Line 1":{"maximumNumberOfCharacters":200,"domain":[]},"Line 2":{"maximumNumberOfCharacters":200,"domain":[]},"Line 3":{"maximumNumberOfCharacters":200,"domain":[]},"Line 4":{"maximumNumberOfCharacters":200,"domain":[]}},"composition":null}]}]},"hooksData":null,"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"subscriptionData":null,"merchantContextData":null,"itemsOrdination":null}'
  ),
}

// "Invalid" Cart

export const checkoutOrderFormInvalidFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2?refreshOutdatedData=true&sc=1',
  init: { method: 'POST', headers: { 'content-type': 'application/json' } },
  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","salesChannel":"1","loggedIn":false,"isCheckedIn":false,"storeId":null,"checkedInPickupPointId":null,"allowManualPrice":false,"canEditData":true,"userProfileId":null,"userType":null,"ignoreProfileData":false,"value":203006,"messages":[],"items":[{"uniqueId":"A2A029701A484D8480687A3732DDA744","id":"18643698","productId":"55127871","productRefId":"1056559252082","refId":"0969910297117","ean":null,"name":"Tasty Granite Towels Tasty silver","skuName":"silver","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:31:38Z","tax":0,"price":4424,"listPrice":6914,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":4424,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Nike","brandId":"2000006","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/182417-55-55/aut.jpg?v=637755531474870000","detailUrl":"/tasty-granite-towels-tasty/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":4424,"total":4424,"sellingPrices":[{"value":4424,"quantity":1}]}},{"uniqueId":"8C8B1F4BC8FC43A1A434DB0C46806703","id":"97907082","productId":"42751008","productRefId":"8528464810736","refId":"4454274563902","ean":null,"name":"Licensed Frozen Sausages ivory","skuName":"ivory","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:30:03Z","tax":0,"price":53154,"listPrice":76406,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":53154,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"iRobot","brandId":"2000003","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/166870-55-55/sit.jpg?v=637753013266530000","detailUrl":"/licensed-frozen-sausages/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":53154,"total":53154,"sellingPrices":[{"value":53154,"quantity":1}]}},{"uniqueId":"59A65B645EDF4F55AF5C8235716D52B7","id":"64953394","productId":"29913569","productRefId":"4715709796003","refId":"1346198062637","ean":null,"name":"Unbranded Concrete Table Small fuchsia","skuName":"fuchsia","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:30:58Z","tax":0,"price":20064,"listPrice":29770,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":20064,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9295/","productCategories":{"9282":"Office","9295":"Desks"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/186495-55-55/corporis.jpg?v=637755567185370000","detailUrl":"/unbranded-concrete-table-small/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":20064,"total":20064,"sellingPrices":[{"value":20064,"quantity":1}]}},{"uniqueId":"3168E6B8923045EF8E8091009A63EED9","id":"85095548","productId":"32789477","productRefId":"4785818703589","refId":"8718443313149","ean":null,"name":"Small Concrete Tuna Incredible lime","skuName":"lime","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:30:58Z","tax":0,"price":65086,"listPrice":96830,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":65086,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9282/9296/","productCategories":{"9282":"Office","9296":"Chairs"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/178893-55-55/nam.jpg?v=637755498809500000","detailUrl":"/small-concrete-tuna-incredible/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":65086,"total":65086,"sellingPrices":[{"value":65086,"quantity":1}]}},{"uniqueId":"0BF31D8C4CBA42C1A55FAE6BBB83476C","id":"1191988","productId":"84484858","productRefId":"8905160026336","refId":"5987012953010","ean":null,"name":"Fantastic Soft Bacon fuchsia","skuName":"fuchsia","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:30:58Z","tax":0,"price":60278,"listPrice":83497,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":60278,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Brand","brandId":"9280","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9286/9292/","productCategories":{"9286":"Computer and Software","9292":"Gadgets"},"quantity":1,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/177382-55-55/assumenda.jpg?v=637753139967300000","detailUrl":"/fantastic-soft-bacon/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":60278,"total":60278,"sellingPrices":[{"value":60278,"quantity":1}]}}],"selectableGifts":[],"totalizers":[{"id":"Items","name":"Items Total","value":203006}],"shippingData":{"address":null,"logisticsInfo":[{"itemIndex":0,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"18643698","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":1,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"97907082","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":2,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"64953394","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":3,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"85095548","deliveryChannels":[{"id":"delivery"}]},{"itemIndex":4,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"1191988","deliveryChannels":[{"id":"delivery"}]}],"selectedAddresses":[],"availableAddresses":[],"pickupPoints":[]},"clientProfileData":null,"paymentData":{"updateStatus":"updated","installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":null,"paymentGroupName":null,"value":203006,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006}]}]},{"paymentSystem":"201","bin":null,"paymentName":null,"paymentGroupName":null,"value":203006,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":203006,"total":203006}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T14:18:23.1569301Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T14:18:23.1569301Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"marketingData":null,"sellers":[{"id":"1","name":"VTEX","logo":""}],"clientPreferencesData":{"locale":"en-US","optinNewsLetter":null},"commercialConditionData":null,"storePreferencesData":{"countryCode":"USA","saveUserData":true,"timeZone":"Central Standard Time","currencyCode":"USD","currencyLocale":1033,"currencySymbol":"$","currencyFormatInfo":{"currencyDecimalDigits":2,"currencyDecimalSeparator":".","currencyGroupSeparator":",","currencyGroupSize":3,"startsWithCurrencySymbol":true}},"giftRegistryData":null,"openTextField":null,"invoiceData":null,"customData":null,"itemMetadata":{"items":[{"id":"18643698","seller":"1","name":"Tasty Granite Towels Tasty silver","skuName":"silver","productId":"55127871","refId":"0969910297117","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/182417-55-55/aut.jpg?v=637755531474870000","detailUrl":"/tasty-granite-towels-tasty/p","assemblyOptions":[]},{"id":"97907082","seller":"1","name":"Licensed Frozen Sausages ivory","skuName":"ivory","productId":"42751008","refId":"4454274563902","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/166870-55-55/sit.jpg?v=637753013266530000","detailUrl":"/licensed-frozen-sausages/p","assemblyOptions":[]},{"id":"64953394","seller":"1","name":"Unbranded Concrete Table Small fuchsia","skuName":"fuchsia","productId":"29913569","refId":"1346198062637","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/186495-55-55/corporis.jpg?v=637755567185370000","detailUrl":"/unbranded-concrete-table-small/p","assemblyOptions":[]},{"id":"85095548","seller":"1","name":"Small Concrete Tuna Incredible lime","skuName":"lime","productId":"32789477","refId":"8718443313149","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/178893-55-55/nam.jpg?v=637755498809500000","detailUrl":"/small-concrete-tuna-incredible/p","assemblyOptions":[]},{"id":"1191988","seller":"1","name":"Fantastic Soft Bacon fuchsia","skuName":"fuchsia","productId":"84484858","refId":"5987012953010","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/177382-55-55/assumenda.jpg?v=637753139967300000","detailUrl":"/fantastic-soft-bacon/p","assemblyOptions":[]}]},"hooksData":null,"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"subscriptionData":null,"itemsOrdination":null}'
  ),
}

export const checkoutOrderFormItemsInvalidFetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/edbe3b03c8c94827a37ec5a6a4648fd2/items?allowOutdatedData=paymentData&sc=1',
  init: {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body:
      '{"orderItems":[{"quantity":1,"seller":"1","id":"18643698","index":0},{"quantity":1,"seller":"1","id":"97907082","index":1},{"quantity":1,"seller":"1","id":"64953394","index":2},{"quantity":1,"seller":"1","id":"85095548","index":3},{"quantity":1,"seller":"1","id":"1191988","index":4}]}',
  },
  result: JSON.parse(
    '{"orderFormId":"edbe3b03c8c94827a37ec5a6a4648fd2","salesChannel":"1","loggedIn":false,"isCheckedIn":false,"storeId":null,"checkedInPickupPointId":null,"allowManualPrice":false,"canEditData":true,"userProfileId":null,"userType":null,"ignoreProfileData":false,"value":69824,"messages":[],"items":[{"uniqueId":"90276D2ADB274F12B61A4ADE11874A0A","id":"2737806","productId":"43559243","productRefId":"6327601885574","refId":"6464716212392","ean":null,"name":"Fantastic Soft Cheese plum","skuName":"plum","modalType":null,"parentItemIndex":null,"parentAssemblyBinding":null,"assemblies":[],"priceValidUntil":"2023-03-29T14:32:10Z","tax":0,"price":34912,"listPrice":55757,"manualPrice":null,"manualPriceAppliedBy":null,"sellingPrice":34912,"rewardValue":0,"isGift":false,"additionalInfo":{"dimension":null,"brandName":"Acer","brandId":"2000002","offeringInfo":null,"offeringType":null,"offeringTypeId":null},"preSaleDate":null,"productCategoryIds":"/9285/9294/","productCategories":{"9285":"Kitchen and Home Appliances","9294":"Appliances"},"quantity":2,"seller":"1","sellerChain":["1"],"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/168396-55-55/nihil.jpg?v=637753027573130000","detailUrl":"/fantastic-soft-cheese/p","components":[],"bundleItems":[],"attachments":[],"attachmentOfferings":[],"offerings":[],"priceTags":[],"availability":"available","measurementUnit":"un","unitMultiplier":1,"manufacturerCode":null,"priceDefinition":{"calculatedSellingPrice":34912,"total":69824,"sellingPrices":[{"value":34912,"quantity":2}]}}],"selectableGifts":[],"totalizers":[{"id":"Items","name":"Items Total","value":69824}],"shippingData":{"address":null,"logisticsInfo":[{"itemIndex":0,"selectedSla":null,"selectedDeliveryChannel":null,"addressId":null,"slas":[],"shipsTo":["BRA","USA"],"itemId":"2737806","deliveryChannels":[{"id":"delivery"}]}],"selectedAddresses":[],"availableAddresses":[],"pickupPoints":[]},"clientProfileData":null,"paymentData":{"updateStatus":"updated","installmentOptions":[{"paymentSystem":"6","bin":null,"paymentName":null,"paymentGroupName":null,"value":69824,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824}]}]},{"paymentSystem":"201","bin":null,"paymentName":null,"paymentGroupName":null,"value":69824,"installments":[{"count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824,"sellerMerchantInstallments":[{"id":"STOREFRAMEWORK","count":1,"hasInterestRate":false,"interestRate":0,"value":69824,"total":69824}]}]}],"paymentSystems":[{"id":6,"name":"Boleto Bancário","groupName":"bankInvoicePaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"6","template":"bankInvoicePaymentGroup-template","requiresDocument":false,"isCustom":false,"description":null,"requiresAuthentication":false,"dueDate":"2022-04-05T14:18:23.1569301Z","availablePayments":null},{"id":201,"name":"Free","groupName":"custom201PaymentGroupPaymentGroup","validator":{"regex":null,"mask":null,"cardCodeRegex":null,"cardCodeMask":null,"weights":null,"useCvv":false,"useExpirationDate":false,"useCardHolderName":false,"useBillingAddress":false},"stringId":"201","template":"custom201PaymentGroupPaymentGroup-template","requiresDocument":false,"isCustom":true,"description":"Free pay to test checkout payments","requiresAuthentication":false,"dueDate":"2022-04-05T14:18:23.1569301Z","availablePayments":null}],"payments":[],"giftCards":[],"giftCardMessages":[],"availableAccounts":[],"availableTokens":[],"availableAssociations":{}},"marketingData":null,"sellers":[{"id":"1","name":"VTEX","logo":""}],"clientPreferencesData":{"locale":"en-US","optinNewsLetter":null},"commercialConditionData":null,"storePreferencesData":{"countryCode":"USA","saveUserData":true,"timeZone":"Central Standard Time","currencyCode":"USD","currencyLocale":1033,"currencySymbol":"$","currencyFormatInfo":{"currencyDecimalDigits":2,"currencyDecimalSeparator":".","currencyGroupSeparator":",","currencyGroupSize":3,"startsWithCurrencySymbol":true}},"giftRegistryData":null,"openTextField":null,"invoiceData":null,"customData":null,"itemMetadata":{"items":[{"id":"2737806","seller":"1","name":"Fantastic Soft Cheese plum","skuName":"plum","productId":"43559243","refId":"6464716212392","ean":null,"imageUrl":"http://storeframework.vteximg.com.br/arquivos/ids/168396-55-55/nihil.jpg?v=637753027573130000","detailUrl":"/fantastic-soft-cheese/p","assemblyOptions":[]}]},"hooksData":null,"ratesAndBenefitsData":{"rateAndBenefitsIdentifiers":[],"teaser":[]},"subscriptionData":null,"itemsOrdination":null}'
  ),
}

export const productSearchPage1Count1Fetch = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=1&count=1&query=sku%3A2737806&sort=&fuzzy=0&hideUnavailableItems=false',
  init: undefined,
  result: {
    products: [
      {
        cacheId: 'sp-43559243',
        productId: '43559243',
        description: 'Iure eum pariatur provident dolorem et.',
        productName: 'Fantastic Soft Cheese',
        productReference: '6327601885574',
        linkText: 'fantastic-soft-cheese',
        brand: 'Acer',
        brandId: 2000002,
        link: '/fantastic-soft-cheese/p',
        categories: [
          '/Kitchen & Home Appliances/Appliances/',
          '/Kitchen & Home Appliances/',
        ],
        categoryId: '9294',
        categoriesIds: ['/9285/9294/', '/9285/'],
        priceRange: {
          sellingPrice: {
            highPrice: 349.12,
            lowPrice: 349.12,
          },
          listPrice: {
            highPrice: 557.57,
            lowPrice: 557.57,
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
                      Value: 349.12,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 349.12,
                      NumberOfInstallments: 1,
                      Name: 'Boleto Banc�rio � vista',
                      PaymentSystemName: 'Boleto Banc�rio',
                    },
                    {
                      Value: 349.12,
                      InterestRate: 0,
                      TotalValuePlusInterestRate: 349.12,
                      NumberOfInstallments: 1,
                      Name: 'Free � vista',
                      PaymentSystemName: 'Free',
                    },
                  ],
                  Price: 349.12,
                  ListPrice: 557.57,
                  spotPrice: 349.12,
                  taxPercentage: 0,
                  PriceWithoutDiscount: 349.12,
                  Tax: 0,
                  GiftSkuIds: [],
                  BuyTogether: [],
                  ItemMetadataAttachment: [],
                  RewardValue: 0,
                  PriceValidUntil: '2023-04-12T17:35:11Z',
                  GetInfoErrorMessage: null,
                  CacheVersionUsedToCallCheckout: '',
                  teasers: [],
                },
              },
            ],
            images: [
              {
                imageId: '168396',
                cacheId: '168396',
                imageTag: '',
                imageLabel: 'et',
                imageText: 'et',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/168396/nihil.jpg?v=637753027573130000',
              },
              {
                imageId: '168393',
                cacheId: '168393',
                imageTag: '',
                imageLabel: 'similique',
                imageText: 'similique',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/168393/dolore.jpg?v=637753027558270000',
              },
              {
                imageId: '168394',
                cacheId: '168394',
                imageTag: '',
                imageLabel: 'deleniti',
                imageText: 'deleniti',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/168394/delectus.jpg?v=637753027564530000',
              },
              {
                imageId: '168395',
                cacheId: '168395',
                imageTag: '',
                imageLabel: 'sunt',
                imageText: 'sunt',
                imageUrl:
                  'https://storeframework.vtexassets.com/arquivos/ids/168395/qui.jpg?v=637753027568900000',
              },
            ],
            itemId: '2737806',
            name: 'plum',
            nameComplete: 'Fantastic Soft Cheese plum',
            complementName:
              'Explicabo et quibusdam eius excepturi et rem dolorem et. Eligendi ratione et quod error nisi asperiores fugit omnis itaque. Vel officia sapiente autem non. Ut consequatur veniam perspiciatis doloribus nulla saepe.',
            referenceId: [
              {
                Key: 'RefId',
                Value: '6464716212392',
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
          'search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=&fuzzy=0&operator=and',
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

export const productSearchPage1Count1FetchAssemblyOptions = {
  info:
    'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=1&count=3&query=sku%3A2000588%3B2000591%3B2000584&sort=&fuzzy=0&hideUnavailableItems=false',
  init: undefined,
  result: JSON.parse(
    '{"products":[{"cacheId":"sp-2000032","productId":"2000032","description":"","productName":"Custom Bell","linkText":"custom-bell","brand":"Kawasaki","brandId":2000001,"link":"/custom-bell/p","categories":["/Home & Decor/"],"categoryId":"40","categoriesIds":["/40/"],"priceRange":{"sellingPrice":{"highPrice":450.23,"lowPrice":90.05},"listPrice":{"highPrice":450.23,"lowPrice":90.05}},"specificationGroups":[{"originalName":"allSpecifications","name":"allSpecifications","specifications":[{"originalName":"sellerId","name":"sellerId","values":["1"]}]}],"skuSpecifications":[],"productClusters":[],"clusterHighlights":[],"properties":[{"name":"sellerId","originalName":"sellerId","values":["1"]}],"items":[{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":110.46,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":73.64,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":55.23,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":44.18,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":36.82,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":112.11,"InterestRate":100,"TotalValuePlusInterestRate":224.22,"NumberOfInstallments":2,"Name":"Diners 2 vezes com juros","PaymentSystemName":"Diners"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":110.46,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":75.84,"InterestRate":100,"TotalValuePlusInterestRate":227.52,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":130.87,"ListPrice":130.87,"spotPrice":130.87,"taxPercentage":0,"PriceWithoutDiscount":130.87,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}},{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":110.46,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":73.64,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":55.23,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":44.18,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":36.82,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":112.11,"InterestRate":100,"TotalValuePlusInterestRate":224.22,"NumberOfInstallments":2,"Name":"Diners 2 vezes com juros","PaymentSystemName":"Diners"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":110.46,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":75.84,"InterestRate":100,"TotalValuePlusInterestRate":227.52,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":220.92,"InterestRate":0,"TotalValuePlusInterestRate":220.92,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":130.87,"ListPrice":130.87,"spotPrice":130.87,"taxPercentage":0,"PriceWithoutDiscount":130.87,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155629","cacheId":"155629","imageTag":"","imageLabel":"","imageText":"","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155629/PINK.jpg?v=637249131334400000"}],"itemId":"310124174","name":"Pink Bell","nameComplete":"Custom Bell Pink Bell","complementName":"","referenceId":[{"Key":"RefId"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"227000000000","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":225.11,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":150.07,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":112.55,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":90.04,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":75.03,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":228.49,"InterestRate":100,"TotalValuePlusInterestRate":456.98,"NumberOfInstallments":2,"Name":"Diners 2 vezes com juros","PaymentSystemName":"Diners"},{"Value":156.11,"InterestRate":200,"TotalValuePlusInterestRate":468.33,"NumberOfInstallments":3,"Name":"Diners 3 vezes com juros","PaymentSystemName":"Diners"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":225.11,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":154.57,"InterestRate":100,"TotalValuePlusInterestRate":463.71,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":450.23,"InterestRate":0,"TotalValuePlusInterestRate":450.23,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":450.23,"ListPrice":450.23,"spotPrice":450.23,"taxPercentage":0,"PriceWithoutDiscount":450.23,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155545","cacheId":"155545","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155545/gold_bell.jpg?v=637020789145570000"}],"itemId":"2000584","name":"Gold Bell","nameComplete":"Custom Bell Gold Bell","complementName":"","referenceId":[{"Key":"RefId","Value":"1212121444"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"222444","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":135.07,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":90.04,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":67.53,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":54.02,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":45.02,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":137.09,"InterestRate":100,"TotalValuePlusInterestRate":274.18,"NumberOfInstallments":2,"Name":"Diners 2 vezes com juros","PaymentSystemName":"Diners"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":135.07,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":92.74,"InterestRate":100,"TotalValuePlusInterestRate":278.22,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":270.14,"InterestRate":0,"TotalValuePlusInterestRate":270.14,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":270.14,"ListPrice":270.14,"spotPrice":270.14,"taxPercentage":0,"PriceWithoutDiscount":270.14,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155546","cacheId":"155546","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155546/silver_bell.jpg?v=637020789985930000"}],"itemId":"2000585","name":"Silver Bell","nameComplete":"Custom Bell Silver Bell","complementName":"","referenceId":[{"Key":"RefId","Value":"7788909"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"9078655","modalType":"","videos":[],"attachments":[],"isKit":false}],"origin":"intelligent-search"},{"cacheId":"sp-2000033","productId":"2000033","description":"Just an add on to Custom Bell.","productName":"Bells add-ons","productReference":"81089","linkText":"bells-add-on","brand":"Kawasaki","brandId":2000001,"link":"/bells-add-on/p","categories":["/Hobbies e artes/"],"categoryId":"50","categoriesIds":["/50/"],"priceRange":{"sellingPrice":{"highPrice":90.05,"lowPrice":10},"listPrice":{"highPrice":90.05,"lowPrice":10}},"specificationGroups":[{"originalName":"allSpecifications","name":"allSpecifications","specifications":[{"originalName":"sellerId","name":"sellerId","values":["1"]}]}],"skuSpecifications":[],"productClusters":[],"clusterHighlights":[],"properties":[{"name":"sellerId","originalName":"sellerId","values":["1"]}],"items":[{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":5,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":3.43,"InterestRate":100,"TotalValuePlusInterestRate":10.29,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":10,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":10,"ListPrice":10,"spotPrice":10,"taxPercentage":0,"PriceWithoutDiscount":10,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155548","cacheId":"155548","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155548/3-lins.jpg?v=637020800571470000"}],"itemId":"2000587","name":"4 lines","nameComplete":"Bells add-ons 4 lines","complementName":"","referenceId":[{"Key":"RefId","Value":"555018"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"313122","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":12.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":12.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":8.92,"InterestRate":100,"TotalValuePlusInterestRate":26.76,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":25.99,"InterestRate":0,"TotalValuePlusInterestRate":25.99,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":25.99,"ListPrice":25.99,"spotPrice":25.99,"taxPercentage":0,"PriceWithoutDiscount":25.99,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155547","cacheId":"155547","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155547/3-lins.jpg?v=637020796905600000"}],"itemId":"2000586","name":"1-3 lines","nameComplete":"Bells add-ons 1-3 lines","complementName":"","referenceId":[{"Key":"RefId","Value":"7987690"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"889000001","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":37.52,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":25.01,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":18.76,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":15,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":12.5,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":37.52,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":25.76,"InterestRate":100,"TotalValuePlusInterestRate":77.28,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":75.04,"InterestRate":0,"TotalValuePlusInterestRate":75.04,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":75.04,"ListPrice":75.04,"spotPrice":75.04,"taxPercentage":0,"PriceWithoutDiscount":75.04,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155549","cacheId":"155549","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155549/logo-bell.jpg?v=637020801573330000"}],"itemId":"2000588","name":"Logo small","nameComplete":"Bells add-ons Logo small","complementName":"","referenceId":[{"Key":"RefId","Value":"3214455"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"08484","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":45.02,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":30.01,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":22.51,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":18.01,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":15,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":45.02,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":30.91,"InterestRate":100,"TotalValuePlusInterestRate":92.73,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":90.05,"InterestRate":0,"TotalValuePlusInterestRate":90.05,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":90.05,"ListPrice":90.05,"spotPrice":90.05,"taxPercentage":0,"PriceWithoutDiscount":90.05,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155549","cacheId":"155549","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155549/logo-bell.jpg?v=637020801573330000"}],"itemId":"2000589","name":"Logo big","nameComplete":"Bells add-ons Logo big","complementName":"","referenceId":[{"Key":"RefId","Value":"0001"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"91811","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":30.01,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":2,"Name":"Visa 2 vezes sem juros","PaymentSystemName":"Visa"},{"Value":20.01,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":3,"Name":"Visa 3 vezes sem juros","PaymentSystemName":"Visa"},{"Value":15,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":4,"Name":"Visa 4 vezes sem juros","PaymentSystemName":"Visa"},{"Value":12,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":5,"Name":"Visa 5 vezes sem juros","PaymentSystemName":"Visa"},{"Value":10,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":6,"Name":"Visa 6 vezes sem juros","PaymentSystemName":"Visa"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":30.01,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":20.61,"InterestRate":100,"TotalValuePlusInterestRate":61.83,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":60.03,"InterestRate":0,"TotalValuePlusInterestRate":60.03,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":60.03,"ListPrice":60.03,"spotPrice":60.03,"taxPercentage":0,"PriceWithoutDiscount":60.03,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155550","cacheId":"155550","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155550/Plaque.jpg?v=637020802611500000"}],"itemId":"2000590","name":"Plaque","nameComplete":"Bells add-ons Plaque","complementName":"","referenceId":[{"Key":"RefId","Value":"5567899"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"342355","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":0,"discountHighlights":[],"Installments":[],"Price":0,"ListPrice":0,"spotPrice":0,"taxPercentage":null,"PriceWithoutDiscount":0,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155551","cacheId":"155551","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155551/roman.png?v=637020804802370000"}],"itemId":"2000591","name":"Roman","nameComplete":"Bells add-ons Roman","complementName":"","referenceId":[{"Key":"RefId","Value":"17212"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"112321111","modalType":"","videos":[],"attachments":[],"isKit":false},{"sellers":[{"sellerId":"1","sellerName":"VTEX","addToCartLink":"","sellerDefault":true,"commertialOffer":{"DeliverySlaSamplesPerRegion":{},"DeliverySlaSamples":[],"AvailableQuantity":10000,"discountHighlights":[],"Installments":[{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"American Express à vista","PaymentSystemName":"American Express"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Visa à vista","PaymentSystemName":"Visa"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Diners à vista","PaymentSystemName":"Diners"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Mastercard à vista","PaymentSystemName":"Mastercard"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Boleto Bancário à vista","PaymentSystemName":"Boleto Bancário"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Vale à vista","PaymentSystemName":"Vale"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Promissory à vista","PaymentSystemName":"Promissory"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Customer Credit à vista","PaymentSystemName":"Customer Credit"},{"Value":7.49,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":2,"Name":"Customer Credit 2 vezes sem juros","PaymentSystemName":"Customer Credit"},{"Value":5.14,"InterestRate":100,"TotalValuePlusInterestRate":15.42,"NumberOfInstallments":3,"Name":"Customer Credit 3 vezes com juros","PaymentSystemName":"Customer Credit"},{"Value":14.99,"InterestRate":0,"TotalValuePlusInterestRate":14.99,"NumberOfInstallments":1,"Name":"Free à vista","PaymentSystemName":"Free"}],"Price":14.99,"ListPrice":14.99,"spotPrice":14.99,"taxPercentage":0,"PriceWithoutDiscount":14.99,"Tax":0,"GiftSkuIds":[],"BuyTogether":[],"ItemMetadataAttachment":[],"RewardValue":0,"PriceValidUntil":"2023-05-04T13:21:06Z","GetInfoErrorMessage":null,"CacheVersionUsedToCallCheckout":"","teasers":[]}}],"images":[{"imageId":"155551","cacheId":"155551","imageTag":"","imageLabel":"main","imageText":"main","imageUrl":"https://storeframework.vtexassets.com/arquivos/ids/155551/roman.png?v=637020804802370000"}],"itemId":"2000592","name":"Script","nameComplete":"Bells add-ons Script","complementName":"","referenceId":[{"Key":"RefId","Value":"192281"}],"measurementUnit":"un","unitMultiplier":1,"variations":[],"ean":"0808181","modalType":"","videos":[],"attachments":[],"isKit":false}],"origin":"intelligent-search"}],"recordsFiltered":2,"correction":{"misspelled":true},"fuzzy":"0","operator":"and","translated":false,"pagination":{"count":1,"current":{"index":1,"proxyUrl":"search/trade-policy/1?page=1&count=3&query=sku:2000588;2000591;2000584&sort=&fuzzy=0&hide-unavailable-items=false&operator=and"},"before":[],"after":[],"perPage":3,"next":{"index":0},"previous":{"index":0},"first":{"index":0},"last":{"index":0}}}'
  ),
}
