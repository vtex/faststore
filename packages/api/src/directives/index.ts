import { GraphQLSchema } from "graphql"

export type Directive = {
  typeDefs: string
  transformer: (schema: GraphQLSchema) => GraphQLSchema
}