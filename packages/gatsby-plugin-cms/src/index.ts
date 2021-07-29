import type { JSONSchema6 } from 'json-schema'

export { PLP } from './native-types/contentTypes/plp'

export { Seo } from './native-types/blocks/seo'
export type { ISeo } from './native-types/blocks/seo'

export { Sort } from './native-types/blocks/sort'
export type { ISort } from './native-types/blocks/sort'

export { Carousel } from './native-types/blocks/carousel'
export type { ICarousel } from './native-types/blocks/carousel'

export interface Schema extends JSONSchema6 {
  title: string
  description?: string
}

export type Schemas = Record<string, Schema>

export interface ContentType {
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
