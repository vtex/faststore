import type { JSONSchema6 } from 'json-schema'

interface Schema extends JSONSchema6 {
  title: string
  description: string
}

export type Schemas = Record<string, Schema>

interface ContentType {
  id: string
  name: string
  blocks: Schemas
  extraBlocks: Record<string, Schemas>
  beforeBlocks: Schemas
  afterBlocks: Schemas
  messages: Record<string, string>
}

export type ContentTypes = ContentType[]

export const contentTypes: ContentTypes = []
