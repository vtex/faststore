import type { LazyExoticComponent } from 'react'
import type { JSONSchema6 } from 'json-schema'

interface Schema extends JSONSchema6 {
  title: string
  description: string
  component?: LazyExoticComponent<any>
}

export type Schemas = Record<string, Schema>

interface ContentType {
  blocks: Schemas
  extraBlocks: Record<string, Schemas>
  beforeBlocks: Schemas
  afterBlocks: Schemas
  messages: Record<string, string>
}

export type ContentTypes = Record<string, ContentType>

export const contentTypes: ContentTypes = {}
