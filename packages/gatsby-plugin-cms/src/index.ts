import type { JSONSchema6 } from 'json-schema'

export interface Schema extends JSONSchema6 {
  title: string
  description: string
}

export type Schemas = Record<string, Schema>

interface ContentType {
  name: string
  extraBlocks: Record<string, Schemas>
  beforeBlocks: Schemas
  afterBlocks: Schemas
}

export type ContentTypes = Record<string, ContentType>

export interface BuilderConfig {
  contentTypes: ContentTypes
  blocks: Schemas
  messages: Record<string, string>
}

export const builderConfig: BuilderConfig = {
  contentTypes: {},
  blocks: {},
  messages: {},
}
