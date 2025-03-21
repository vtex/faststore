export interface Profile {
  addresses: ProfileAddress[]
}

export interface ProfileAddress {
  addressName: string
  addressType: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string
  receiverName: string
  geoCoordinate: [number][number]
}
