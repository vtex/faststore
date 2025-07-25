interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface PickupPointsInput {
  country?: string | null
  geoCoordinates?: GeoCoordinates | null
  postalCode?: string | null
}

interface Address {
  city: string
  geoCoordinates: [number, number] // [longitude, latitude]
  neighborhood: string
  number: string
  postalCode: string
  street: string
  state: string
}

interface BusinessHour {
  dayOfWeek: number
  openingTime: string
  closingTime: string
}

interface PickupPointDistance {
  pickupId: string
  distance: number
  pickupName: string
  isActive: boolean
  address: Address
  businessHours: BusinessHour[]
}

export interface PickupPoints {
  pickupPointDistances: PickupPointDistance[]
  pickupPointsHash: string
}
