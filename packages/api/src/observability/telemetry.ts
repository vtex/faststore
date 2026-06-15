import { OTELAPI } from '@faststore/diagnostics'
import { name, version } from '../../package.json' with { type: 'json' }
import { getOTELLogger, logger } from '@faststore/diagnostics'
import { format } from 'node:util'

const OTELLogger = logger(getOTELLogger('@faststore/api'))

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

    resolverName ??= 'Unknown Graphql Resolver'
    const tracer = OTELAPI.trace.getTracer('Graphql')

    const span = tracer.startSpan(resolverName, {
      kind: OTELAPI.SpanKind.INTERNAL,
      attributes: {
        timestamp: Date.now(),
        '@faststore_version': version,
        '@faststore_package_name': name,
        '@faststore_account_name': graphqlContext.account,
        '@faststore_environment': process.env.NODE_ENV,
      },
    })

    const context = OTELAPI.trace.setSpan(OTELAPI.context.active(), span)

    try {
      const returnedValue = OTELAPI.context.with(context, () =>
        fn(source, vars, graphqlContext, info)
      )

      if (returnedValue instanceof Promise) {
        return returnedValue
          .then((promisedResult) => {
            span?.end()

            return promisedResult
          })
          .catch((err) => {
            throw catchError(
              err,
              span,
              resolverName ?? 'Unknown Graphql Resolver'
            )
          }) as TReturn
      }

      span?.end()
      return returnedValue
    } catch (error: any) {
      throw catchError(error, span, resolverName)
    }
  }
}

function catchError(error: Error, span: OTELAPI.Span, resolverName: string) {
  span?.setStatus({ code: OTELAPI.SpanStatusCode.ERROR })
  span?.recordException(error)
  span?.end()
  console.error(`Error at resolver: ${resolverName}: \n %o`, error)
  OTELLogger('error', format(`Error at resolver: ${resolverName}\n%o`, error))
  return error
}
