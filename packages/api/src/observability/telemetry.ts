import { OTELAPI } from '@faststore/diagnostics'
import { name, version } from '../../package.json' with { type: 'json' }

export const ResolverTrace = <
  TContext extends {
    OTEL: Record<string, any>
    account: string
    discoveryConfig: Record<string, any>
  },
  TSource = any,
  TVars = any,
  TReturn = any,
>(
  fn: (source: TSource, vars: TVars, context: TContext, info: any) => TReturn,
  resolverName?: string
) => {
  return (
    source: TSource,
    vars: TVars,
    graphqlContext: TContext,
    info: any
  ): TReturn => {
    if ((graphqlContext?.OTEL?.enabled ?? false) === false) {
      return fn(source, vars, graphqlContext, info)
    }

    const trace = OTELAPI.trace.getTracer(name, version)
    const activeContext = OTELAPI.propagation.extract(
      OTELAPI.context.active(),
      graphqlContext.OTEL
    )

    return OTELAPI.context.with(activeContext, () => {
      const span = trace.startSpan(resolverName ?? 'Unknown Graphql Resolver', {
        startTime: Date.now(),
        kind: OTELAPI.SpanKind.INTERNAL,
        attributes: {
          timestamp: Date.now(),
          '@faststore_version': version,
          '@faststore_package_name': name,
          '@faststore_account_name': graphqlContext.account,
          '@faststore_environment': process.env.NODE_ENV,
        },
      })

      if (!span) return fn(source, vars, graphqlContext, info)
      try {
        const returnedValue = fn(source, vars, graphqlContext, info)

        if (!(returnedValue instanceof Promise)) {
          span.end()
          return returnedValue
        }

        return returnedValue.then((value) => {
          span.end()
          return value
        }) as TReturn
      } catch (error) {
        span.end()
        console.error(`Error when executing resolver: ${resolverName}`, error)
        throw error
      }
    })
  }
}
