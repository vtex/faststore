export interface Session {
  id: string
  namespaces: Namespaces
}

export interface Namespaces {
  profile?: Profile
  store?: Store
  checkout?: Checkout
  public?: Public
  authentication?: Authentication
}

export interface Authentication {
  customerId: Value
}

export interface Value {
  value: string
}

export interface Store {
  channel: Value
  countryCode: Value
  cultureInfo: Value
  currencyCode: Value
  currencySymbol: Value
}

export interface Profile {
  id?: Value
  email?: Value
  firstName?: Value
  lastName?: Value
}

export interface Checkout {
  orderFormId?: Value
}

export interface Public {
  orderFormId?: Value
  items?: Value
  postalCode?: Value
  geoCoordinates?: Value
  country?: Value
}
