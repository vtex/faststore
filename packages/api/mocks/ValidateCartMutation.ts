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
    'http://portal.vtexcommercestable.com.br/search-api/v1/storeframework/api/split/product_search/trade-policy/1?page=1&count=1&query=sku%3A2737806&sort=&fuzzy=0&hide-unavailable-items=false',
  init: undefined,
  result: JSON.parse(
    '{"total":1,"products":[{"unitMultiplier":1,"year":0,"extraData":[{"value":"1","key":"sellerId"}],"release":1638576000000,"discount":37,"reference":"6327601885574","collections":[],"price":349.12,"customSort":0,"stickers":[],"id":"43559243","stock":1,"brand":"Acer","availableTradePolicies":["1"],"categoryTrees":[{"categoryNames":["Kitchen and Home Appliances","Appliances"],"categoryIds":["9285","9294"]},{"categoryNames":["Kitchen and Home Appliances"],"categoryIds":["9285"]}],"images":[{"name":"et","value":"http://storeframework.vteximg.com.br/arquivos/ids/168396/nihil.jpg?v=637753027573130000"},{"name":"similique","value":"http://storeframework.vteximg.com.br/arquivos/ids/168393/dolore.jpg?v=637753027558270000"},{"name":"deleniti","value":"http://storeframework.vteximg.com.br/arquivos/ids/168394/delectus.jpg?v=637753027564530000"},{"name":"sunt","value":"http://storeframework.vteximg.com.br/arquivos/ids/168395/qui.jpg?v=637753027568900000"}],"locationAttributes":[],"tax":0,"productScore":1,"storeSplitAttribute":"__PLACEHOLDER__","brandId":"2000002","installment":{"interest":false,"count":1,"paymentGroupName":"bankInvoicePaymentGroup","value":349.12,"paymentName":"Boleto Bancário","valueText":"$349.12"},"name":"Fantastic Soft Cheese","boost":{"newness":0.7111111111111111,"image":1,"revenue":1,"discount":1,"productScore":0,"click":1,"availableSpecsCount":1,"promotion":0,"order":1},"spotPrice":349.12,"skus":[{"images":[{"name":"et","value":"http://storeframework.vteximg.com.br/arquivos/ids/168396/nihil.jpg?v=637753027573130000"},{"name":"similique","value":"http://storeframework.vteximg.com.br/arquivos/ids/168393/dolore.jpg?v=637753027558270000"},{"name":"deleniti","value":"http://storeframework.vteximg.com.br/arquivos/ids/168394/delectus.jpg?v=637753027564530000"},{"name":"sunt","value":"http://storeframework.vteximg.com.br/arquivos/ids/168395/qui.jpg?v=637753027568900000"}],"nameComplete":"Fantastic Soft Cheese plum","complementName":"Explicabo et quibusdam eius excepturi et rem dolorem et. Eligendi ratione et quod error nisi asperiores fugit omnis itaque. Vel officia sapiente autem non. Ut consequatur veniam perspiciatis doloribus nulla saepe.","policies":[{"id":"1","sellers":[{"default":true,"name":"VTEX","tax":0,"teasers":[],"id":"1"}]}],"videos":[],"reference":"6464716212392","idWithSplit":"2737806","name":"plum","attributes":[],"id":"2737806","stock":1,"sellers":[{"default":true,"name":"VTEX","tax":0,"teasers":[],"id":"1"}]}],"link":"fantastic-soft-cheese","wear":0,"description":"Iure eum pariatur provident dolorem et.","aclBlockList":[],"showIfNotAvailable":true,"clusterHighlights":{},"categories":["Kitchen and Home Appliances","Appliances"],"timestamp":1640818293024,"product":"43559243","oldPrice":557.57,"productSpecifications":[],"url":"/fantastic-soft-cheese/p","measurementUnit":"un","categoryIds":["9285","9294"],"textAttributes":[{"joinedValue":"acer@@@Acer@@@@@@acer@@@Acer","isSku":false,"joinedKey":"text@@@brand@@@Brand@@@brand@@@Brand","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Acer","id":["2000002"],"labelKey":"Brand","value":"acer","key":"brand","joinedValueTranslations":{},"originalKey":"brand","originalValue":"acer","originalLabelKey":"Brand","originalLabelValue":"Acer"},{"valueId":"9285","joinedValue":"kitchen-and-home-appliances@@@Kitchen and Home Appliances@@@9285@@@kitchen-and-home-appliances@@@Kitchen and Home Appliances","isSku":false,"joinedKey":"text@@@category-1@@@Category 1@@@category-1@@@Category 1","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Kitchen and Home Appliances","id":[],"labelKey":"Category 1","value":"kitchen-and-home-appliances","key":"category-1","joinedValueTranslations":{},"originalKey":"category-1","originalValue":"kitchen-and-home-appliances","originalLabelKey":"Category 1","originalLabelValue":"Kitchen and Home Appliances"},{"valueId":"9294","joinedValue":"appliances@@@Appliances@@@9294@@@appliances@@@Appliances","isSku":false,"joinedKey":"text@@@category-2@@@Category 2@@@category-2@@@Category 2","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Appliances","id":[],"labelKey":"Category 2","value":"appliances","key":"category-2","joinedValueTranslations":{},"originalKey":"category-2","originalValue":"appliances","originalLabelKey":"Category 2","originalLabelValue":"Appliances"},{"joinedValue":"yes@@@Yes@@@@@@yes@@@Yes","isSku":false,"joinedKey":"text@@@new-release@@@New Release@@@new-release@@@New Release","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Yes","id":[],"labelKey":"New Release","value":"yes","key":"new-release","joinedValueTranslations":{},"originalKey":"new-release","originalValue":"yes","originalLabelKey":"New Release","originalLabelValue":"Yes"},{"joinedValue":"@@@@@@@@@@@@","isSku":false,"joinedKey":"text@@@productclusterids@@@productClusterIds@@@productclusterids@@@productClusterIds","joinedKeyTranslations":{},"isFilter":false,"labelValue":"","id":[],"labelKey":"productClusterIds","value":"","key":"productclusterids","joinedValueTranslations":{},"originalKey":"productclusterids","originalValue":"","originalLabelKey":"productClusterIds","originalLabelValue":""},{"valueId":"","joinedValue":"@@@@@@@@@@@@","isSku":false,"joinedKey":"text@@@productclusternames@@@productClusterNames@@@productclusternames@@@productClusterNames","joinedKeyTranslations":{},"isFilter":true,"labelValue":"","id":[],"labelKey":"productClusterNames","value":"","key":"productclusternames","joinedValueTranslations":{},"originalKey":"productclusternames","originalValue":"","originalLabelKey":"productClusterNames","originalLabelValue":""},{"joinedValue":"false@@@false@@@@@@false@@@false","isSku":false,"joinedKey":"text@@@subscription@@@subscription@@@subscription@@@subscription","joinedKeyTranslations":{},"isFilter":false,"labelValue":"false","id":[],"labelKey":"subscription","value":"false","key":"subscription","joinedValueTranslations":{},"originalKey":"subscription","originalValue":"false","originalLabelKey":"subscription","originalLabelValue":"false"},{"joinedValue":"1@@@1@@@@@@1@@@1","isSku":false,"joinedKey":"text@@@trade-policy@@@Trade Policy@@@trade-policy@@@Trade Policy","joinedKeyTranslations":{},"isFilter":false,"labelValue":"1","id":[],"labelKey":"Trade Policy","value":"1","key":"trade-policy","joinedValueTranslations":{},"originalKey":"trade-policy","originalValue":"1","originalLabelKey":"Trade Policy","originalLabelValue":"1"},{"joinedValue":"1@@@1@@@@@@1@@@1","isSku":false,"joinedKey":"text@@@seller@@@Seller@@@seller@@@Seller","joinedKeyTranslations":{},"isFilter":false,"labelValue":"1","id":[],"labelKey":"Seller","value":"1","key":"seller","joinedValueTranslations":{},"originalKey":"seller","originalValue":"1","originalLabelKey":"Seller","originalLabelValue":"1"},{"valueId":"1","joinedValue":"vtex@@@VTEX@@@1@@@vtex@@@VTEX","isSku":false,"joinedKey":"text@@@sellername@@@sellerName@@@sellername@@@sellerName","joinedKeyTranslations":{},"isFilter":true,"labelValue":"VTEX","id":[],"labelKey":"sellerName","value":"vtex","key":"sellername","joinedValueTranslations":{},"originalKey":"sellername","originalValue":"vtex","originalLabelKey":"sellerName","originalLabelValue":"VTEX"},{"joinedValue":"yes@@@Yes@@@@@@yes@@@Yes","isSku":false,"joinedKey":"text@@@promotion@@@Promotion@@@promotion@@@Promotion","joinedKeyTranslations":{},"isFilter":true,"labelValue":"Yes","id":[],"labelKey":"Promotion","value":"yes","key":"promotion","joinedValueTranslations":{},"originalKey":"promotion","originalValue":"yes","originalLabelKey":"Promotion","originalLabelValue":"Yes"}],"numberAttributes":[{"labelKey":"Price","value":349.12,"key":"price"}],"headSku":"2737806","specificationGroups":"{}","extraInfo":{"sellerId":"1"},"oldPriceText":"$557.57","priceText":"$349.12","spotPriceText":"$349.12"}],"pagination":{"count":1,"current":{"index":1,"proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=&fuzzy=0&operator=and"},"before":[],"after":[],"perPage":1,"next":{"index":0},"previous":{"index":0},"first":{"index":0},"last":{"index":0}},"sampling":false,"options":{"sorts":[{"field":"relevance","order":"desc","active":true,"proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=relevance:desc&fuzzy=0&operator=and"},{"field":"orders","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=orders:desc&fuzzy=0&operator=and"},{"field":"discount","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=discount:desc&fuzzy=0&operator=and"},{"field":"price","order":"asc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=price:asc&fuzzy=0&operator=and"},{"field":"price","order":"desc","proxyUrl":"search/trade-policy/1?page=1&count=1&query=sku:2737806&sort=price:desc&fuzzy=0&operator=and"}],"counts":[{"count":24,"proxyUrl":"search/trade-policy/1?page=1&count=24&query=sku:2737806&sort=&fuzzy=0&operator=and"},{"count":48,"proxyUrl":"search/trade-policy/1?page=1&count=48&query=sku:2737806&sort=&fuzzy=0&operator=and"},{"count":72,"proxyUrl":"search/trade-policy/1?page=1&count=72&query=sku:2737806&sort=&fuzzy=0&operator=and"},{"count":96,"proxyUrl":"search/trade-policy/1?page=1&count=96&query=sku:2737806&sort=&fuzzy=0&operator=and"}]},"translated":false,"locale":"en-US","query":"sku:2737806","operator":"and","fuzzy":"0","correction":{"misspelled":true}}'
  ),
}
