import { RenameTypes, wrapSchema } from '@graphql-tools/wrap'
import { execute, parse, print } from 'graphql'
import type { GraphQLResolveInfo } from 'graphql'

import { getExecutor, getGatewaySchema } from './schema'
import type { Options } from '../gatsby-node'

export const getDelegateToSchema = async (options: Options) => {
  const gatewaySchema = await getGatewaySchema(options)

  const schema = wrapSchema({
    schema: gatewaySchema,
    executor: getExecutor(options),
    transforms: [
      new RenameTypes((typename) => typename.replace('VTEX_', 'Store')),
    ],
  })

  const delegateToSchema = async (info: GraphQLResolveInfo) => {
    const operationName = info.operation.name?.value
    const varDefs =
      info.operation.variableDefinitions &&
      info.operation.variableDefinitions.length > 0
        ? `(${info.operation.variableDefinitions?.map(print).join(',')})`
        : ''

    const query = `
      query ${operationName} ${varDefs} {
        vtex {
          ${print(info.fieldNodes[0])}
        }
      }
      # Fragment definitions
      ${Object.values(info.fragments).map(print)}
    `.trim()

    console.log(query)

    const response = await execute({
      schema,
      operationName,
      document: parse(query),
      variableValues: info.variableValues,
    })

    return response.data?.vtex
  }

  return delegateToSchema
}
