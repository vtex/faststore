import { createStore } from './../store/composed'

export interface Currency {
  code: string // Ex: USD
  symbol: string // Ex: $
}

export interface GeoCoordinates {
  latitude: GLfloat
  longitude: GLfloat
}

export interface DeliveryMode {
  deliveryChannel: string
  deliveryMethod: string
}

export interface Person {
  id: string
  email: string
  givenName: string
  familyName: string
}

export interface Session {
  locale: string // en-US
  currency: Currency
  country: string // BRA
  channel: string | null
  deliveryMode: DeliveryMode | null
  addressType: string | null
  postalCode: string | null
  geoCoordinates: GeoCoordinates | null
  person: Person | null
}

export const createSessionStore = (
  defaultSession: Session,
  onValidate?: (value: Session) => Promise<Session | null>,
  namespace = 'fs::session'
) => createStore(defaultSession, namespace, onValidate)
