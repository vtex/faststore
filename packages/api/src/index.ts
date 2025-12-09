export * from './__generated__/schema'
export * from './directives'
export {
  stringify as stringifyCacheControl,
  type CacheControl,
} from './directives/cacheControl'
export { GraphqlVtexContextFactory, GraphqlVtexSchema } from './platforms/vtex'
export { typeDefs } from './platforms/vtex/typeDefs'

export * from './platforms/errors'
export type { GraphqlResolver } from './platforms/vtex'
export type {
  CommertialOffer,
  Item,
  ProductSearchResult,
  Seller,
} from './platforms/vtex/clients/search/types/ProductSearchResult'
export * from './platforms/vtex/resolvers/root'

export type APIOptions = Options
