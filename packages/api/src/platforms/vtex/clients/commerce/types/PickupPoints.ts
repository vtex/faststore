interface GeoCoordinatesInput {
  latitude: number
  longitude: number
}

export interface PickupPointsInput {
  country?: string
  geoCoordinates?: GeoCoordinatesInput
  postalCode?: string
}

interface Address {
  addressId: string | null
  addressType: string
  city: string
  complement: string | null
  country: string
  geoCoordinates: [number, number] // [longitude, latitude]
  isDisposable: boolean
  neighborhood: string
  number: string
  postalCode: string
  receiverName: string
  reference: string
  state: string
  street: string
}

interface BusinessHour {
  DayOfWeek: number
  OpeningTime: string
  ClosingTime: string
}

interface PickupPoint {
  additionalInfo: string
  address: Address
  businessHours: BusinessHour
  friendlyName: string
  id: string
}

interface Item {
  distance: number
  pickupPoint: PickupPoint
}

interface Paging {
  page: number
  pages: number
  pageSize: number
  total: number
}

export interface PickupPoints {
  items: Item[]
  paging: Paging
}
