export const ShippingSimulationQueryResult = `query ShippingSimulationQuery {
  shipping(
    items: [{ id: "99988211", quantity: 1, seller: "1" }]
    postalCode: "32808"
    country: "USA"
  ) {
    items {
      id
      requestIndex
      quantity
      seller
      sellerChain
      tax
      priceValidUntil
      price
      listPrice
      rewardValue
      sellingPrice
      measurementUnit
      unitMultiplier
      availability
    }
    logisticsInfo {
      itemIndex
      selectedSla
      slas {
        id
        name
        price
        availableDeliveryWindows{
          startDateUtc
          endDateUtc
          price
          listPrice
        }
        shippingEstimate
        shippingEstimateDate
        deliveryIds {
          courierId
          warehouseId
          dockId
          courierName
          quantity
        } 
        deliveryChannel
        friendlyName
        pickupPointId
        pickupStoreInfo {
          friendlyName
          address {
            addressType
            receiverName
            addressId
            postalCode
            city
            state
            country
            street
            number
            neighborhood
            complement
            reference
            geoCoordinates
          }
          additionalInfo
          dockId
          isPickupStore
        } 
        pickupDistance
      }
    }
    messages {
      code
      text
      status
      fields {
        itemIndex
        ean
        skuName
      }
    }
    address {
      postalCode
      city
      state
      country
      street
      number
      neighborhood
      complement
      reference
      geoCoordinates
    }
  }
}`

export const addressFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/postal-code/USA/32808',
  init: undefined,
  result: {
    address: {
      postalCode: '32808',
      city: 'ORLANDO',
      state: 'FL',
      country: 'USA',
      street: null,
      number: '',
      neighborhood: null,
      complement: '',
      reference: '',
      geoCoordinates: [-81.37, 28.5],
    },
  },
}

export const shippingSimulationFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForms/simulation?sc=1',
  init: {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      country: 'USA',
      postalCode: '32808',
      items: [{ id: '99988211', quantity: 1, seller: '1' }],
    }),
  },
  result: {
    items: [
      {
        id: '99988211',
        requestIndex: 0,
        quantity: 1,
        seller: '1',
        sellerChain: ['1'],
        tax: 0,
        priceValidUntil: '2023-08-22T18:22:43Z',
        price: 13000,
        listPrice: 15000,
        rewardValue: 0,
        sellingPrice: 13000,
        measurementUnit: 'un',
        unitMultiplier: 1,
        availability: 'available',
      },
    ],
    logisticsInfo: [
      {
        itemIndex: '0',
        selectedSla: null,
        slas: [
          {
            id: 'Normal',
            name: 'Normal',
            price: 0,
            shippingEstimate: '3bd',
            shippingEstimateDate: null,
            deliveryIds: [
              {
                courierId: '1',
                warehouseId: '1_1',
                dockId: '1',
                courierName: 'Transportadora',
                quantity: 1,
              },
            ],
            deliveryChannel: 'delivery',
            friendlyName: null,
            pickupPointId: null,
            pickupStoreInfo: {
              friendlyName: null,
              address: null,
              additionalInfo: null,
              dockId: null,
              isPickupStore: false,
            },
            pickupDistance: 0,
          },
        ],
      },
    ],
    messages: [],
  },
}
