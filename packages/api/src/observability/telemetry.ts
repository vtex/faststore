import { logger, OTELAPI } from '@faststore/diagnostics'
import { name, version } from '../../package.json' with { type: 'json' }

const OTELLogger = logger('@faststore/api')

export const ResolverTrace = <
  TContext extends {
    OTEL_ENABLED: boolean
    account: string
    discoveryConfig: Record<string, any>
  },
  TSource = any,
  TVars = any,
  TReturn = any,
>(
  fn: (source: TSource, vars: TVars, context: TContext, info: any) => TReturn,
  resolverName = 'Unknown Graphql Resolver'
) => {
  return (
    source: TSource,
    vars: TVars,
    graphqlContext: TContext,
    info: any
  ): TReturn => {
    if (!graphqlContext?.OTEL_ENABLED) {
      return fn(source, vars, graphqlContext, info)
    }

    const span = OTELAPI.trace.getTracer('Graphql').startSpan(resolverName, {
      kind: OTELAPI.SpanKind.INTERNAL,
      attributes: {
        timestamp: Date.now(),
        '@faststore_version': version,
        '@faststore_package_name': name,
        '@faststore_account_name': graphqlContext.account,
        '@faststore_environment': process.env.NODE_ENV,
        '@faststore_resolver_args': serializeAttribute(vars),
        '@faststore_resolver_parent_type': info?.parentType?.name,
        '@faststore_resolver_field_name': info?.fieldName,
      },
    })

    const otelContext = OTELAPI.trace.setSpan(OTELAPI.context.active(), span)

    try {
      const result = OTELAPI.context.with(otelContext, () =>
        fn(source, vars, graphqlContext, info)
      )

      if (result instanceof Promise) {
        return result.then(
          (value) => {
            span.end()

            return value
          },
          (error) => recordResolverError(error, span, resolverName)
        ) as TReturn
      }

      span.end()

      return result
    } catch (error) {
      return recordResolverError(error, span, resolverName)
    }
  }
}

/** Span attributes only accept primitives, so structured values are serialized. */
function serializeAttribute(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  try {
    return JSON.stringify(value)
  } catch {
    return undefined
  }
}

/** Marks the span as failed and rethrows, keeping call sites linear. */
function recordResolverError(
  error: unknown,
  span: OTELAPI.Span,
  resolverName: string
): never {
  span.setStatus({ code: OTELAPI.SpanStatusCode.ERROR })
  span.recordException(error as Error)
  span.end()

  console.error(`Error at resolver: ${resolverName}: \n %o`, error)
  OTELLogger('error', 'Error at resolver: %s\n%o', resolverName, error)

  throw error
}
