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
}

// Operation related types
export type SearchPageQueryQueryVariables = Exact<{
  query: Maybe<Scalars['String']>
  map: Maybe<Scalars['String']>
  staticPath: Scalars['Boolean']
}>

export type SearchPageQueryQuery = {
  vtex: {
    productSearch: Maybe<{
      titleTag: Maybe<string>
      products: Maybe<
        Array<
          Maybe<{
            productId: Maybe<string>
            productName: Maybe<string>
            description: Maybe<string>
            linkText: Maybe<string>
            items: Maybe<
              Array<
                Maybe<{
                  itemId: Maybe<string>
                  images: Maybe<
                    Array<
                      Maybe<{
                        imageUrl: Maybe<string>
                        imageText: Maybe<string>
                      }>
                    >
                  >
                  sellers: Maybe<
                    Array<
                      Maybe<{
                        sellerId: Maybe<string>
                        commertialOffer: Maybe<{
                          AvailableQuantity: Maybe<number>
                          Price: Maybe<number>
                          ListPrice: Maybe<number>
                        }>
                      }>
                    >
                  >
                }>
              >
            >
          }>
        >
      >
      breadcrumb: Maybe<
        Array<Maybe<{ href: Maybe<string>; name: Maybe<string> }>>
      >
    }>
    facets: Maybe<{
      brands: Maybe<
        Array<
          Maybe<{
            value: string
            quantity: number
            selected: boolean
            linkEncoded: string
          }>
        >
      >
      categoriesTrees: Maybe<
        Array<
          Maybe<{
            link: string
            name: Maybe<string>
            quantity: number
            children: Maybe<
              Array<
                Maybe<{ link: string; name: Maybe<string>; quantity: number }>
              >
            >
          }>
        >
      >
    }>
  }
}

// Query Related Code

export const SearchPageQuery = {
  query:
    'query SearchPageQuery($query: String, $map: String, $staticPath: Boolean!) {\n  vtex {\n    productSearch(query: $query, map: $map, from: 0, to: 9) @include(if: $staticPath) {\n      products {\n        productId\n        productName\n        description\n        linkText\n        items {\n          itemId\n          images {\n            imageUrl\n            imageText\n          }\n          sellers {\n            sellerId\n            commertialOffer {\n              AvailableQuantity\n              Price\n              ListPrice\n            }\n          }\n        }\n      }\n      breadcrumb {\n        href\n        name\n      }\n      titleTag\n    }\n    facets(query: $query, map: $map) @include(if: $staticPath) {\n      brands {\n        value\n        quantity\n        selected\n        linkEncoded\n      }\n      categoriesTrees {\n        link\n        name\n        quantity\n        children {\n          link\n          name\n          quantity\n        }\n      }\n    }\n  }\n}\n',
  sha256Hash:
    'c64a8a6e000dc5a2fd15c99c83255701add4eeed59881347f58dd40589b59641',
  operationName: 'SearchPageQuery',
}
