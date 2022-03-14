export interface Session {
  id: string
  namespaces: Namespaces
}

export interface Namespaces {
  profile?: Profile
}

export interface Value {
  value: string
}

export interface Profile {
  id?: Value
  email?: Value
  firstName?: Value
  lastName?: Value
}
