import { RenameTypes, wrapSchema } from '@graphql-tools/wrap'
import { execute, parse, print } from 'graphql'
import type { GraphQLResolveInfo } from 'graphql'

import { removeAliasFields } from './transforms/removeAlias'
import { getExecutor, getGatewaySchema } from './schema'
import type { Options } from '../gatsby-node'

export const getResolvers = async (options: Options) => {
  const schema = wrapSchema({
    schema: await getGatewaySchema(options),
    executor: getExecutor(options),
    transforms: [
      new RenameTypes((typeName) => typeName.replace('VTEX_', 'Store')),
    ],
  })

  const resolvers = {
    Query: {
      vtex: {
        type: 'VTEX!',
        resolve: async (
          _: any,
          __: any,
          ___: any,
          info: GraphQLResolveInfo
        ) => {
          const query = `${print(info.operation)}\n${Object.values(
            info.fragments
          ).map(print)}`

          const document = removeAliasFields(parse(query))
          const response = await execute({
            schema,
            document,
            variableValues: info.variableValues,
          })

          return response.data?.vtex || {}
        },
      },
    },
  }

  return resolvers
}
