import {
  context as OTELContext,
  propagation as OTELPropagation,
  SpanKind,
  type Tracer,
} from '@opentelemetry/api'
import {
  ATTR_CODE_FUNCTION_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import { name, version } from '../../package.json' with { type: 'json' }

export const ResolverTrace = <
  TContext extends {
    OTEL: {
      tracer: Tracer
      traceparent: string
      tracestate: string
    }
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
    const activeContext = OTELPropagation.extract(
      OTELContext.active(),
      graphqlContext.OTEL
    )
    return OTELContext.with(activeContext, () =>
      graphqlContext.OTEL.tracer.startActiveSpan(
        resolverName ?? 'Unknown Graphql Resolver',
        {
          startTime: Date.now(),
          kind: SpanKind.INTERNAL,
          attributes: {
            [ATTR_CODE_FUNCTION_NAME]: resolverName,
            [ATTR_SERVICE_NAME]: name,
            [ATTR_SERVICE_VERSION]: version,
          },
        },
        (span) => {
          const returnedValue = fn(source, vars, graphqlContext, info)
          if (!(returnedValue instanceof Promise)) {
            span.end()
            return returnedValue
          }

          return returnedValue.then((value) => {
            span.end()
            return value
          }) as TReturn
        }
      )
    )
  }
}
