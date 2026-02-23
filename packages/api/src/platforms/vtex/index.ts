import { getTelemetryClient } from '@faststore/diagnostics'
import { mergeSchemas } from '@graphql-tools/schema'
import { type GraphQLSchema, isSchema } from 'graphql'
import crypto from 'node:crypto'
import { name, version } from '../../../package.json' with { type: 'json' }
import { withDirectives } from '../../directives'
import authDirective from '../../directives/auth'
import cacheControlDirective from '../../directives/cacheControl'
import { ResolverTrace } from '../../observability/telemetry'
import type { Clients } from './clients'
import { getClients } from './clients'
import type { SearchArgs } from './clients/search'
import type { Loaders } from './loaders'
import { getLoaders } from './loaders'
import { getResolvers as nativeGetResolvers } from './resolvers'
import typeDefs from './typeDefs'
import type { Channel } from './utils/channel'
import ChannelMarshal from './utils/channel'

export interface GraphqlContext {
  /** Request scope ID */
  id: string
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
  OTEL: Record<string, unknown>
}

export const GraphqlVtexContextFactory = async (options: Options) => {
  const id = crypto.randomBytes(32).toString('hex')

  if (options.OTEL?.enabled) {
    try {
      await getTelemetryClient({
        name,
        version,
        account: options.account,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (ctx: any): GraphqlContext => {
    ctx.id = id
    ctx.storage = {
      channel: ChannelMarshal.parse(options.channel),
      flags: options.flags ?? {},
      locale: options.locale,
      cookies: new Map<string, Record<string, string>>(),
    }
    ctx.clients = getClients(options, ctx)
    ctx.loaders = getLoaders(options, ctx)
    ctx.account = options.account
    ctx.OTEL = options.OTEL
    ctx.discoveryConfig = options.discoveryConfig

    return ctx
  }
}

export type GraphqlResolver<S = any, V = any, R = any> = Resolver<
  GraphqlContext,
  S,
  V,
  R
>

export function getResolvers() {
  const resolvers = nativeGetResolvers()

  const finalResolvers: any = {}
  for (const [key, resolver] of Object.entries(resolvers)) {
    finalResolvers[key] = Object.fromEntries(
      Object.entries(resolver).map(([name, resolverFunction]) => {
        if (typeof resolverFunction !== 'function')
          return [name, resolverFunction]

        return [name, ResolverTrace(resolverFunction, `${key}(${name})`)]
      })
    )
  }

  return finalResolvers as typeof resolvers
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
