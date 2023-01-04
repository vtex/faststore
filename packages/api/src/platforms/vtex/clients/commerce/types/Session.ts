export interface Session {
  id: string
  namespaces: Namespaces
}

export interface Namespaces {
  profile?: Profile
  store?: Store
  public?: Public | null
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

export interface Public {
  [key: string]: {
    value: string
  }
}

export interface Profile {
  id?: Value
  email?: Value
  firstName?: Value
  lastName?: Value
}
