export interface CategoryTree {
  id: number
  level?: number
  name: string
  hasChildren: boolean
  url: string
  children: CategoryTree[]
  parentId?: number | null
  Title: string
  MetaTagDescription: string
}
