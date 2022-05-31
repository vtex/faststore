export interface Session {
  id: string
  namespaces: Namespaces
}

export interface Namespaces {
  profile?: Profile
  store?: Store
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
