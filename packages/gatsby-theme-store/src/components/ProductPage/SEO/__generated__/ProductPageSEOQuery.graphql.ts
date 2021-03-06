/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */

// Base Types
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
type Maybe<T> = T | null | undefined
type Scalars = {
  Boolean: boolean
  String: string
  Float: number
  Int: number
  ID: string
}

// Operation related types
export type ProductPageSeoQueryQueryVariables = Exact<{ [key: string]: never }>

export type ProductPageSeoQueryQuery = {
  site: Maybe<{
    siteMetadata: Maybe<{
      title: Maybe<string>
      titleTemplate: Maybe<string>
      description: Maybe<string>
      author: Maybe<string>
    }>
  }>
}

// Query Related Code

export const ProductPageSEOQuery = {
  query:
    'query ProductPageSEOQuery {\n  site {\n    siteMetadata {\n      title\n      titleTemplate\n      description\n      author\n    }\n  }\n}\n',
  sha256Hash:
    '865faea350c2534c0593687897b71148357ca1a0ba1af5fd3e5a2cbecde7db1d',
  operationName: 'ProductPageSEOQuery',
}
