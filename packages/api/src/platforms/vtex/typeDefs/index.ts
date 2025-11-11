/// <reference types="vite/client" />

const modules: Record<string, string> = import.meta.glob('./*.graphql', {
  eager: true,
  query: '?raw',
  import: 'default',
})
import { mergeTypeDefs } from '@graphql-tools/merge'
import { parse, print } from 'graphql'

const ParsedVtexGraphqlSchema = print(
  Object.values(modules)
    .map((s) => parse(s))
    .reduce((finalSchema, schema) =>
      mergeTypeDefs([finalSchema, schema], { sort: true })
    )
)

export const typeDefs = ParsedVtexGraphqlSchema

export default typeDefs
