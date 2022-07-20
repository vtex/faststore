export type PortalPagetype = CollectionPageType | FallbackPageType

export interface CollectionPageType {
  id: number
  name: string
  url: string
  title: string
  metaTagDescription: string
  pageType:
    | 'Brand'
    | 'Category'
    | 'Department'
    | 'SubCategory'
    | 'Product'
    | 'Collection'
    | 'Cluster'
}

export interface FallbackPageType {
  id: null
  name: null | string
  url: null | string
  title: null
  metaTagDescription: null
  pageType: 'NotFound' | 'FullText'
}
