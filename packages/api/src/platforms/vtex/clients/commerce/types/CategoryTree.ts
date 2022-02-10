export interface CategoryTree {
  id: number
  level?: number
  name: string
  hasChildren: boolean
  url: string
  children: CategoryTree[]
  Title: string
  MetaTagDescription: string
}
