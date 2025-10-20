// import thirdPartyResolvers from '../customizations/src/graphql/thirdParty/resolvers'
// import vtexExtensionsResolvers from '../customizations/src/graphql/vtex/resolvers'

import { GraphqlExecute, getSchema } from '@vtex/faststore-api'
import type { GraphQLSchema } from 'graphql'
import persistedDocuments from '../../@generated/persisted-documents.json'
import { apiOptions } from './options'
const persistedQueries = new Map(Object.entries(persistedDocuments))

export const ServerExecuteFunction = GraphqlExecute(
  apiOptions,
  getSchema(),
  persistedQueries
)

export const CustomExecutionFunction = (
  schema: GraphQLSchema,
  customContextFactory: (ctx: any) => any
) =>
  GraphqlExecute(
    apiOptions,
    getSchema(schema),
    persistedQueries,
    customContextFactory
  )
