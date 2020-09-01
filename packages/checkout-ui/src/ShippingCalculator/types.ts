export interface Address {
  addressId: string
  addressQuery?: string
  addressType: string
  city?: string
  complement?: string
  country?: string
  geoCoordinates?: number[]
  neighborhood?: string
  number?: string
  postalCode?: string
  receiverName?: string
  reference?: string
  state?: string
  street?: string
}

export interface NewAddress {
  addressId?: string
  addressQuery?: string
  addressType?: string
  city?: string
  complement?: string
  country?: string
  geoCoordinates?: number[]
  neighborhood?: string
  number?: string
  postalCode?: string
  receiverName?: string
  reference?: string
  state?: string
  street?: string
}

export interface AddressWithValidation {
  addressId: AddressField
  addressQuery?: AddressField
  addressType: AddressField
  city?: AddressField
  complement?: AddressField
  country?: AddressField
  geoCoordinates?: AddressField
  neighborhood?: AddressField
  number?: AddressField
  postalCode?: AddressField
  receiverName?: AddressField
  reference?: AddressField
  state?: AddressField
  street?: AddressField
}

export interface AddressField {
  value: string | number[]
  valid: boolean | null
}

export interface DeliveryOption {
  id: string
  price: number
  estimate: string
  isSelected: boolean
}

export interface CheckoutAddress {
  addressType: string
  receiverName: string
  addressId: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string | null
  geoCoordinates: number[]
}
