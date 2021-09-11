import { makeExecutableSchema } from '@graphql-tools/schema'

import { getResolvers as getResolversVTEX } from './platforms/vtex'
import { typeDefs } from './typeDefs'
import type { Options as OptionsVTEX } from './platforms/vtex'

export type Options = OptionsVTEX

const getResolversByPlatform = {
  vtex: getResolversVTEX,
}

export const getTypeDefs = () => typeDefs

export const getResolvers = (options: Options) =>
  getResolversByPlatform[options.platform](options)

export const getSchema = async (options: Options) =>
  makeExecutableSchema({
    resolvers: getResolvers(options),
    typeDefs: getTypeDefs(),
  })
