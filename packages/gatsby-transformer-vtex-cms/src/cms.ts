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

export const isBlock = (b: any): b is Block =>
  !!b &&
  typeof b.name === 'string' &&
  typeof b.props === 'object'

export const isContent = (c: any): c is Content =>
  typeof c.meta?.slug === 'string' &&
  Array.isArray(c.blocks) &&
  (c.blocks.length === 0 || (c.blocks.every(isBlock)))
