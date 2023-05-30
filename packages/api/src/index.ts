import { makeExecutableSchema } from '@graphql-tools/schema'

import {
  getContextFactory as getContextFactoryVTEX,
  getResolvers as getResolversVTEX,
} from './platforms/vtex'
import { typeDefs } from './typeDefs'
import cacheControlDirective from './directives/cacheControl'
import type { Directive } from './directives'
import type { Options as OptionsVTEX } from './platforms/vtex'

export * from './__generated__/schema'
export * from './platforms/errors'
export * from './telemetry'
export { stringify as stringifyCacheControl } from './directives/cacheControl'
export type { CacheControl } from './directives/cacheControl'

export type Options = OptionsVTEX

const platforms = {
  vtex: {
    getResolvers: getResolversVTEX,
    getContextFactory: getContextFactoryVTEX,
  },
}

const directives: Directive[] = [
  cacheControlDirective
]

export const getTypeDefs = () => [typeDefs, ...directives.map(d => d.typeDefs)]

export const getResolvers = (options: Options) =>
  platforms[options.platform].getResolvers(options)

export const getContextFactory = (options: Options) =>
  platforms[options.platform].getContextFactory(options)

export const getSchema = async (options: Options) => {
  const schema = makeExecutableSchema({
    resolvers: getResolvers(options),
    typeDefs: getTypeDefs(),
  })

  return directives.reduce((s, d) => d.transformer(s), schema)
}
