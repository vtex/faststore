import type { GraphQLSchema } from 'graphql'
import type { Directive } from './directives'
import cacheControlDirective from './directives/cacheControl'
import type { Options } from './platforms/vtex'
import {
  getContextFactory as getContextFactoryVTEX,
  getResolvers as getResolversVTEX,
  getVTEXSchema,
} from './platforms/vtex'

export * from './__generated__/schema'
export { stringify as stringifyCacheControl } from './directives/cacheControl'
export type { CacheControl } from './directives/cacheControl'
export * from './platforms/errors'
export type { Resolver } from './platforms/vtex'
export type {
  CommertialOffer,
  Item,
  ProductSearchResult,
  Seller,
} from './platforms/vtex/clients/search/types/ProductSearchResult'

import * as GraphQLJS from 'graphql'

export const platforms = {
  vtex: {
    getResolvers: getResolversVTEX,
    getContextFactory: getContextFactoryVTEX,
    schema: getVTEXSchema([cacheControlDirective]),
  },
}

export * from './platforms/vtex/resolvers/root'
export const directives: Directive[] = [cacheControlDirective]

export const getTypeDefs = (o: Options) =>
  GraphQLJS.printSchema(platforms[o.platform].schema)

export const getResolvers = (o: Options) => platforms[o.platform].getResolvers()

export const getContextFactory = (o: Options) =>
  platforms[o.platform].getContextFactory(o)

export const getSchema = (mergeSchema?: GraphQLSchema) =>
  getVTEXSchema([cacheControlDirective], mergeSchema)
