export interface Profile {
  id: string
  document: Document
  meta: Meta
}

export interface Document {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  documentType?: string | null
  homePhone?: string | null
  isPJ?: string | null
  userId?: string | null
  id?: string | null
  name?: string | null
  document?: string | null
  title?: string | null
  phoneNumber?: string | null
  birthDate?: string | null
}

export interface Meta {
  version: string | null
  author: string | null
  creationDate: string | null
  lastUpdateDate: string | null
  expirationDate: string | null
}
