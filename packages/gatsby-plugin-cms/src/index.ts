import { LazyExoticComponent } from 'react'
import { JSONSchema6 } from 'json-schema'

export type Components = Record<string, LazyExoticComponent<any>>

export const components: Components = {}

type Schema = JSONSchema6 & Required<Pick<JSONSchema6, 'title' | 'description'>>

export type Schemas = Record<string, Schema>

export const schemas: Schemas = {}

interface ContentType {
  previewUrl: string
  blocks: Schemas
  extraBlocks: Record<string, Schemas>
  beforeBlocks: Schemas
  afterBlocks: Schemas
  messages: Record<string, string>
}

export type ContentTypes = Record<string, ContentType>

export const contentTypes: ContentTypes = {}
