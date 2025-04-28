import type { DeliveryOptionsData } from './types'

export const deliveryMock: DeliveryOptionsData = {
  deliveryOptions: [
    {
      selectedSla: 'Normal',
      deliveryChannel: 'delivery',
      deliveryCompany: 'Transportadora',
      shippingEstimate: '3bd',
      shippingEstimateDate: '2025-04-29T12:00:00.0000000+00:00',
      friendlyShippingEstimate: 'Up to 3 business days',
      friendlyDeliveryOptionName: 'Normal Delivery Up to 3 business days',
      seller: '1',
      address: {
        addressType: 'residential',
        receiverName: 'John Doe',
        addressId: '23984897234798',
        city: 'Springfield',
        state: 'FL',
        country: 'USA',
        street: '742 Evergreen Terrace',
      },
      pickupStoreInfo: {
        additionalInfo: null,
        address: null,
        dockId: null,
        friendlyName: null,
        isPickupStore: false,
      },
      items: [
        {
          name: 'Product 1',
          quantity: 2,
          price: 5000,
          imageUrl: 'https://example.com/product1.jpg',
          tax: 0,
          total: 10000,
        },
      ],
    },
  ],
  contact: {
    email: 'john.doe@example.com',
    phone: '(780) 824-6723',
    name: 'John Doe',
  },
}
