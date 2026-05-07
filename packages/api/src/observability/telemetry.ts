import { OTELAPI } from '@faststore/diagnostics'
import { name, version } from '../../package.json' with { type: 'json' }
import { getTraceClient } from '@faststore/diagnostics'
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

    // const traceClient = getTraceClient()
    const tracer = OTELAPI.trace.getTracer('Graphql')
    const span = tracer.startSpan(resolverName ?? 'Unknown Graphql Resolver', {
      kind: OTELAPI.SpanKind.INTERNAL,
      attributes: {
        timestamp: Date.now(),
        '@faststore_version': version,
        '@faststore_package_name': name,
        '@faststore_account_name': graphqlContext.account,
        '@faststore_environment': process.env.NODE_ENV,
      },
    })

    OTELAPI.trace.setSpan(
      OTELAPI.propagation.extract(
        OTELAPI.context.active(),
        graphqlContext.OTEL.__otelContext
      ),
      span
    )

    try {
      return fn(source, vars, graphqlContext, info)
    } catch (error: any) {
      span?.setStatus({ code: OTELAPI.SpanStatusCode.ERROR })
      span?.recordException(error)
      console.error(
        `Error when executing resolver: ${resolverName}: \n %o`,
        error
      )
      throw error
    } finally {
      span?.end()
    }
  }
}
