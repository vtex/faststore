export interface AddressInput {
  postalCode: string
  country: string
}

export interface Address {
  postalCode: string | null
  city: string | null
  state: string | null
  country: string | null
  street: string | null
  number: string | null
  neighborhood: string | null
  complement: string | null
  reference: string | null
  geoCoordinates: [number, number] | null // [longitude, latitude]
}
