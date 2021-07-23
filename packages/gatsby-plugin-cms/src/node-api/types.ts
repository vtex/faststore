export interface Block {
  name: string
  props: Record<string, unknown>
}

export interface RemotePageContent {
  remoteId: string
  name: string
  type: string
  builderId: 'faststore'
  author: {
    id: string
    email: string
  }
  lastUpdatedAt: string
  blocks: Block[]
  beforeBlocks: Block[]
  afterBlocks: Block[]
  extraBlocks: Array<{
    name: string
    blocks: Block[]
  }>
}

export type PageContent = {
  id: string
  name: string
  sections: Block[]
} & {
  [name: string]: {
    [name: string]: Block['props']
  }
}
