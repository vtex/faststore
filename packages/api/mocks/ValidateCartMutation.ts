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
