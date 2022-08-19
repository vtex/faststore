export interface AddressInput {
  postalCode: string
  country: string
}

export interface Address {
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string
  geoCoordinates: [number]
}
