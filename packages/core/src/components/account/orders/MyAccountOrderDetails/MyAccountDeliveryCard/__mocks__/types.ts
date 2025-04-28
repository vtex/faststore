export interface SimpleAddress {
  street: string
  city: string
  state: string
  country: string
}

export interface FullAddress extends SimpleAddress {
  addressType: string
  receiverName: string
  addressId: string
}

export interface PickupStoreInfo {
  additionalInfo: string | null
  address: SimpleAddress | null
  dockId: string | null
  friendlyName: string | null
  isPickupStore: boolean
}

export interface DeliveryItem {
  name: string
  quantity: number
  price: number
  imageUrl: string
  tax: number
  total: number
}

export interface DeliveryOption {
  selectedSla: string
  deliveryChannel: string
  deliveryCompany: string
  shippingEstimate: string
  shippingEstimateDate: string
  friendlyShippingEstimate: string
  friendlyDeliveryOptionName: string
  seller: string
  address: FullAddress
  pickupStoreInfo: PickupStoreInfo
  items: DeliveryItem[]
}

export interface Contact {
  email: string
  phone: string
  name: string
}

export interface DeliveryOptionsData {
  deliveryOptions: DeliveryOption[]
  contact: Contact
}
