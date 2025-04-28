import type { DeliveryOptionsData } from './types'

export const pickupMock: DeliveryOptionsData = {
  deliveryOptions: [
    {
      selectedSla: 'Pickup',
      deliveryChannel: 'pickup-in-point',
      deliveryCompany: 'Store',
      shippingEstimate: '0d',
      shippingEstimateDate: '2024-03-20T12:00:00.0000000+00:00',
      friendlyShippingEstimate: 'Available Today',
      friendlyDeliveryOptionName: 'Store Pickup - Available Today',
      seller: '1',
      address: {
        addressType: 'commercial',
        receiverName: 'Store Springfield',
        addressId: 'store123',
        city: 'Springfield',
        state: 'FL',
        country: 'USA',
        street: '456 Mall Avenue',
      },
      pickupStoreInfo: {
        additionalInfo: 'Store hours: 9 AM - 9 PM',
        address: {
          street: '456 Mall Avenue',
          city: 'Springfield',
          state: 'FL',
          country: 'USA',
        },
        dockId: 'DOCK001',
        friendlyName: 'Springfield Mall Store',
        isPickupStore: true,
      },
      items: [
        {
          name: 'Pickup Item',
          quantity: 1,
          price: 8000,
          imageUrl: 'https://example.com/pickup-item.jpg',
          tax: 0,
          total: 8000,
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
