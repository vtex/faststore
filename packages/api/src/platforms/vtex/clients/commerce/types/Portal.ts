export interface PortalPagetype {
  id: number
  name: string
  url: string
  title: string
  metaTagDescription: string
  pageType:
    | 'Brand'
    | 'Category'
    | 'Department'
    | 'Subcategory'
    | 'FullText'
    | 'NotFound'
}
