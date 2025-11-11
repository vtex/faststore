import { mergeSchemas } from '@graphql-tools/schema'
import { isSchema, type GraphQLSchema } from 'graphql'
import { withDirectives } from '../../directives'
import authDirective from '../../directives/auth'
import cacheControlDirective from '../../directives/cacheControl'
import type { Clients } from './clients'
import { getClients } from './clients'
import type { SearchArgs } from './clients/search'
import type { Loaders } from './loaders'
import { getLoaders } from './loaders'
import { getResolvers } from './resolvers'
import typeDefs from './typeDefs'
import type { Channel } from './utils/channel'
import ChannelMarshal from './utils/channel'

export { getResolvers } from './resolvers'

export interface GraphqlContext {
  clients: Clients
  loaders: Loaders
  /**
   * @description Storage updated at each request.
   *
   * Use this datastructure to store and share small values in the context.
   * Use it with caution since dependecy injection leads to a more complex code
   * */
  storage: {
    channel: Required<Channel>
    locale: string
    flags: FeatureFlags
    searchArgs?: Omit<SearchArgs, 'type'>
    cookies: Map<string, Record<string, string>>
  }
  headers: Record<string, string>
  account: string
}

export type GraphqlResolver<R = unknown, A = unknown, Return = any> = (
  root: R,
  args: A,
  ctx: GraphqlContext,
  info: any
) => Return

export const GraphqlVtexContextFactory =
  (options: Options) =>
  (ctx: any): GraphqlContext => {
    ctx.storage = {
      channel: ChannelMarshal.parse(options.channel),
      flags: options.flags ?? {},
      locale: options.locale,
      cookies: new Map<string, Record<string, string>>(),
    }
    ctx.clients = getClients(options, ctx)
    ctx.loaders = getLoaders(options, ctx)
    ctx.account = options.account

    return ctx
  }

export function GraphqlVtexSchema(mergeSchema?: GraphQLSchema) {
  const withCacheControl = withDirectives([
    cacheControlDirective,
    authDirective,
  ])

  const platformSchema = withCacheControl(getResolvers(), typeDefs)

  if (mergeSchema && isSchema(mergeSchema)) {
    return mergeSchemas({
      schemas: [platformSchema, mergeSchema],
    })
  }

  return platformSchema
}
