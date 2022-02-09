export type PortalPagetype = ValidPortalPagetype | NotFoundPortalPagetype

export interface ValidPortalPagetype {
  id: number
  name: string
  url: string
  title: string
  metaTagDescription: string
  pageType: 'Brand' | 'Category' | 'Department' | 'Subcategory' | 'FullText'
}

export interface NotFoundPortalPagetype {
  id: null
  name: null
  url: null
  title: null
  metaTagDescription: null
  pageType: 'NotFound'
}
