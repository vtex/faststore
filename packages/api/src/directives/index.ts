import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { IResolvers, TypeSource } from '@graphql-tools/utils'
import type { GraphQLSchema } from 'graphql'

export type Directive = {
  typeDefs: string
  transformer: (schema: GraphQLSchema) => GraphQLSchema
}

export const withDirectives =
  (directives?: Array<Directive>) =>
  (resolvers: IResolvers<any, any>, typeDef: TypeSource) => {
    const finalTypeDef = mergeTypeDefs([
      ...(directives ?? []).map(({ typeDefs }) => typeDefs),
      typeDef,
    ])

    return (directives ?? []).reduce(
      (schema, { transformer }) => transformer?.(schema) ?? schema,
      makeExecutableSchema({
        typeDefs: finalTypeDef,
        resolvers,
      })
    )
  }
