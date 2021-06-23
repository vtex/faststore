import { inspect } from 'util'

import type { GraphQLResolveInfo } from 'graphql'

import { getDelegateToSchema } from './delegate'
import type { Options } from '../gatsby-node'

export const getResolvers = async (options: Options) => {
  const delegateToSchema = await getDelegateToSchema(options)

  const resolvers = {
    VTEX: {
      product: {
        type: 'StoreProduct!',
        resolve: () => {
          throw new Error('This API should only be used on the client-side')
        },
      },
      products: {
        type: '[StoreProduct!]!',
        resolve: async (
          _: unknown,
          __: any,
          ___: any,
          info: GraphQLResolveInfo
        ) => {
          const response = await delegateToSchema(info)

          console.log(inspect(response, false, 100, true))

          return response?.products || []
        },
      },
    },
    Query: {
      vtex: {
        type: 'VTEX!',
        resolve: () => ({}),
      },
    },
  }

  return resolvers
}
