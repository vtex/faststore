import { makeExecutableSchema } from '@graphql-tools/schema'

import { getResolvers as getResolversVTEX } from './platforms/vtex'
import { typeDefs } from './typeDefs'
import type { Options as OptionsVTEX } from './platforms/vtex'

export type Options = OptionsVTEX

const getResolversByPlatform = {
  vtex: getResolversVTEX,
}

const getTypeDefs = async () => typeDefs

const getResolvers = (options: Options) =>
  getResolversByPlatform[options.platform](options)

export const getSchema = async (options: Options) => {
  const [resolvers, defs] = await Promise.all([
    getResolvers(options),
    getTypeDefs(),
  ])

  return makeExecutableSchema({ resolvers, typeDefs: defs })
}
