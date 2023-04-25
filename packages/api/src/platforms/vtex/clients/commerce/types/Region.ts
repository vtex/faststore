export interface RegionInput {
  postalCode: string
  geoCoordinates: GeoCoordinates | null
  country: string
  salesChannel?: string | null
}

export interface Seller {
  id: string // storeframework01
  name: string // My Awsome Seller
  logo: string
}

export interface Region {
  id: string
  sellers: Seller[]
}

export interface GeoCoordinates {
  latitude: GLfloat
  longitude: GLfloat
}
