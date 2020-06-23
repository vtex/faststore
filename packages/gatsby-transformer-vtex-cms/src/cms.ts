export interface Meta {
  slug: string
  title?: string
}

export interface Block {
  name: string
  props: Record<string, unknown | undefined>
}

export interface Content {
  meta: Meta
  blocks: Block[]
  lastUpdatedAt: string
}
