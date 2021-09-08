export interface Block {
  name: string
  props: Record<string, unknown>
}

export interface RemotePageContent {
  remoteId: string
  id: string
  name: string
  type: string
  builderId: 'faststore'
  author: {
    id: string
    email: string
  }
  lastUpdatedAt: string
  blocks: Block[]
  extraBlocks: Array<{
    name: string
    blocks: Block[]
  }>
}

export type PageContent = {
  id: string
  name: string
  sections: Block[]
} & Record<string, Record<string, Block['props']>>
