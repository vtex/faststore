import type { GraphQLSchema } from 'graphql'

export { createSchemaCustomization } from './customizeSchema'
export { sourceProducts } from './sourceProducts'
export { sourceCollections } from './sourceCollections'

export interface Options {
  maxNumItems?: number
  getSchema: () => Promise<GraphQLSchema>
  getContextFactory: () => Promise<any>
}
