import { CONVENTIONS, OTELAPI, getTraceClient } from '@faststore/diagnostics'
import { name, version } from '../../package.json' with { type: 'json' }

const { ATTR_CODE_FUNCTION_NAME, ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } =
  CONVENTIONS

export const ResolverTrace = <
  TContext extends { OTEL: Record<string, any> },
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
    const activeContext =
      getTraceClient()?.extract(graphqlContext.OTEL) ?? OTELAPI.context.active()

    return OTELAPI.context.with(activeContext, () => {
      const span = getTraceClient()?.startSpan(
        resolverName ?? 'Unknown Graphql Resolver',
        {
          timestamp: Date.now(),
          kind: OTELAPI.SpanKind.INTERNAL,
          attributes: {
            [ATTR_CODE_FUNCTION_NAME]: resolverName,
            [ATTR_SERVICE_NAME]: name,
            [ATTR_SERVICE_VERSION]: version,
          },
        }
      )

      const returnedValue = fn(source, vars, graphqlContext, info)

      if (!span) return returnedValue

      if (!(returnedValue instanceof Promise)) {
        span.end()
        return returnedValue
      }

      return returnedValue.then((value) => {
        span.end()
        return value
      }) as TReturn
    })
  }
}
