export interface Meta {
  slug: string
  title?: string
}

export interface Block {
  name: string
  props: Record<string, unknown | undefined>
}

export interface BlockGroup {
  name: string
  blocks?: Block[]
}

export interface Content {
  afterBlocks?: Block[]
  beforeBlocks?: Block[]
  extraBlocks?: BlockGroup[]
  blocks: Block[]
  lastUpdatedAt: string
}

export const getMeta = (c: Content) => {
  if (!c?.extraBlocks) {
    return {}
  }

  const visibilityExtraBlock = c?.extraBlocks?.find(
    (block) => block?.name === 'admin/visibilityTitle'
  )

  if (!visibilityExtraBlock || !visibilityExtraBlock?.blocks) {
    return {}
  }

  const meta = visibilityExtraBlock?.blocks?.find(
    (block) => block.name === 'informations'
  )

  return meta?.props
}

export const isBlock = (b: any): b is Block =>
  !!b && typeof b.name === 'string' && typeof b.props === 'object'

export const isContent = (c: any): c is Content =>
  !!c &&
  typeof getMeta(c)?.slug === 'string' &&
  Array.isArray(c.blocks) &&
  (c.blocks.length === 0 || c.blocks.every(isBlock))
