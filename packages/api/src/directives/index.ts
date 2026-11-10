import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { IResolvers, TypeSource } from '@graphql-tools/utils'
import type { GraphQLSchema } from 'graphql'

export { default as AuthDirective } from './auth'
export { default as CacheControlDirective } from './cacheControl'

export type Directive = {
  typeDefs: string
  transformer: (schema: GraphQLSchema) => GraphQLSchema
}

/**
 * Builds an executable schema that knows the directive definitions but does
 * not run their transformers. Call `applyDirectives` afterwards, once, on the
 * schema that will actually be served (after any merge).
 *
 * Transformers visit object fields only. GraphQL does not copy a directive
 * from an interface field to the object fields that implement it, so
 * `interface Secretive { secret: String @auth }` does not protect
 * `type Foo implements Secretive { secret: String }`. Put the directive on
 * the object field.
 */
export function executableSchemaWithDirectiveDefinitions(
  directives: Array<Directive> | undefined,
  resolvers: IResolvers<any, any>,
  typeDef: TypeSource
) {
  return makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      ...(directives ?? []).map(({ typeDefs }) => typeDefs),
      typeDef,
    ]),
    resolvers,
  })
}

export function applyDirectives(
  schema: GraphQLSchema,
  directives?: Array<Directive>
) {
  return (directives ?? []).reduce(
    (current, { transformer }) => transformer?.(current) ?? current,
    schema
  )
}

export const withDirectives =
  (directives?: Array<Directive>) =>
  (resolvers: IResolvers<any, any>, typeDef: TypeSource) =>
    applyDirectives(
      executableSchemaWithDirectiveDefinitions(directives, resolvers, typeDef),
      directives
    )
