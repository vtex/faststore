export interface RegionInput {
  postalCode?: string | null
  geoCoordinates?: GeoCoordinates | null
  country: string
  salesChannel?: string | null
}

export interface Seller {
  id: string // storeframework01
  name: string // My Awsome Seller
  logo: string
}

export interface GeoCoordinates {
  latitude: GLfloat
  longitude: GLfloat
}

export interface Region {
  id: string
  sellers: Seller[]
}
