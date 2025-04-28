import type { DeliveryOptionsData } from './types'

export const expressMock: DeliveryOptionsData = {
  deliveryOptions: [
    {
      selectedSla: 'Express',
      deliveryChannel: 'delivery',
      deliveryCompany: 'Express Courier',
      shippingEstimate: '0d',
      shippingEstimateDate: '2024-03-21T12:00:00.0000000+00:00',
      friendlyShippingEstimate: 'Tomorrow',
      friendlyDeliveryOptionName: 'Express Delivery - Next Day',
      seller: '1',
      address: {
        addressType: 'residential',
        receiverName: 'Jane Smith',
        addressId: '98765432100',
        city: 'Springfield',
        state: 'FL',
        country: 'USA',
        street: '123 Fast Lane',
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
          name: 'Express Item',
          quantity: 1,
          price: 15000,
          imageUrl: 'https://example.com/express-item.jpg',
          tax: 0,
          total: 15000,
        },
      ],
    },
  ],
  contact: {
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    name: 'Jane Smith',
  },
}
