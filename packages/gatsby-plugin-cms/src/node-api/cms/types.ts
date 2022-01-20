export interface Block {
  name: string
  props: Record<string, unknown>
}

export interface RelayPagination<Node> {
  pageInfo: {
    hasNextPage: boolean
  }
  edges: Array<{
    cursor: string
    node: Node
  }>
}

export interface RemotePageContent {
  remoteId: string
  id: string
  name: string
  contentType: {
    id: string
  }
  variants: RelayPagination<{
    status: 'draft' | 'live' | 'publishing' | 'unpublishing'
    sections: Array<{
      name: string
      props: any
    }>
    configurationDataSets: Array<{
      name: string
      configurations: Array<{
        name: string
        props: any
      }>
    }>
  }>
}

export type PageContent = {
  id: string
  name: string
  sections: Block[]
} & Record<string, Record<string, Block['props']>>

export type RemoteRESTPageContent = {
  id: string
  name: string
  status: string
  type: string
  versionId: string
  sections: Section[]
  children?: string[]
  parent?: string
} & Record<string, unknown>

export interface Section {
  name: string
  data: unknown
}
