import { makeExecutableSchema } from '@graphql-tools/schema'

import {
  getContextFactory as getContextFactoryVTEX,
  getResolvers as getResolversVTEX,
} from './platforms/vtex'
import { typeDefs } from './typeDefs'
import type { Options as OptionsVTEX } from './platforms/vtex'

export type Options = OptionsVTEX

const platforms = {
  vtex: {
    getResolvers: getResolversVTEX,
    getContextFactory: getContextFactoryVTEX,
  },
}

export const getTypeDefs = () => typeDefs

export const getResolvers = (options: Options) =>
  platforms[options.platform].getResolvers(options)

export const getContextFactory = (options: Options) =>
  platforms[options.platform].getContextFactory(options)

export const getSchema = async (options: Options) =>
  makeExecutableSchema({
    resolvers: getResolvers(options),
    typeDefs: getTypeDefs(),
  })
