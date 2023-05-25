import type { Plugin, OnExecuteHookResult } from '@envelop/core'
import { isAsyncIterable } from '@envelop/core'
import { useOnResolve } from '@envelop/on-resolve'
import { SpanKind, Context, Span } from '@opentelemetry/api'
import {
  trace as openTelTrace,
  context as openTelContext,
} from '@opentelemetry/api'
import type { BasicTracerProvider } from '@opentelemetry/sdk-trace-base'
import type { Path } from 'graphql/jsutils/Path'
import type { LoggerProvider } from '@opentelemetry/sdk-logs'
import type { LogRecord } from '@opentelemetry/api-logs'
import { SeverityNumber } from '@opentelemetry/api-logs'
import { print, Kind, OperationDefinitionNode } from 'graphql'

export enum AttributeName {
  EXECUTION_ERROR = 'graphql.error',
  EXECUTION_RESULT = 'graphql.result',
  RESOLVER_EXECUTION_ERROR = 'graphql.resolver.error',
  RESOLVER_EXCEPTION = 'graphql.resolver.exception',
  RESOLVER_FIELD_NAME = 'graphql.resolver.fieldName',
  RESOLVER_TYPE_NAME = 'graphql.resolver.typeName',
  RESOLVER_RESULT_TYPE = 'graphql.resolver.resultType',
  RESOLVER_ARGS = 'graphql.resolver.args',
  EXECUTION_OPERATION_NAME = 'graphql.operation.name',
  EXECUTION_OPERATION_TYPE = 'graphql.operation.type',
  EXECUTION_OPERATION_DOCUMENT = 'graphql.document',
  EXECUTION_VARIABLES = 'graphql.variables',
}

const tracingSpanSymbol = Symbol('OPEN_TELEMETRY_GRAPHQL')

export type PluginContext = {
  [tracingSpanSymbol]: Span
}

function getResolverSpanKey(path: Path) {
  const nodes = []

  // If the first node (after reversed, it will be the last one) is an integer, that is, identifies a list,
  // we don't want to include it in the key. Note that this will only happen when analysing .prev paths in
  // a list of elements. We just want to remove the initial node that is a integer, not all of them.
  //
  // Nodes with keys 6bc73341b2a183fc::product::image::0::url would not be able to find
  // parents with key 6bc73341b2a183fc::product::image because of the "0" list index -
  // it would search for 6bc73341b2a183fc::product::image::0
  let currentPath: Path | undefined =
    nodes.length === 0 && Number.isInteger(path.key) ? path.prev : path

  while (currentPath) {
    nodes.push(currentPath.key)

    currentPath = currentPath.prev
  }

  return [...nodes].reverse().join('.')
}

export const getFaststoreTelemetryPlugin = (
  tracingProvider: BasicTracerProvider,
  loggerProvider: LoggerProvider,
  serviceName: string,
  experimentalSendLogs: boolean
): (() => Plugin<PluginContext>) => {
  return function useFaststoreTelemetry() {
    const tracer = tracingProvider.getTracer(serviceName)
    const logger = loggerProvider.getLogger(serviceName)

    const resolverContextsByRootSpans: Record<
      string,
      Record<string, Context>
    > = {}

    return {
      onPluginInit({ addPlugin }) {
        addPlugin(
          // eslint-disable-next-line
          useOnResolve(({ info, context }) => {
            if (
              context &&
              typeof context === 'object' &&
              context[tracingSpanSymbol]
            ) {
              tracer.getActiveSpanProcessor()
              const rootContextSpanId =
                context[tracingSpanSymbol].spanContext().spanId

              const { fieldName, returnType, parentType, path } = info

              const previousResolverSpanKey =
                path.prev && getResolverSpanKey(path.prev)

              let ctx: Context | null = null

              if (
                previousResolverSpanKey &&
                resolverContextsByRootSpans[rootContextSpanId][
                  previousResolverSpanKey
                ]
              ) {
                ctx =
                  resolverContextsByRootSpans[rootContextSpanId][
                    previousResolverSpanKey
                  ]
              } else {
                ctx = openTelTrace.setSpan(
                  openTelContext.active(),
                  context[tracingSpanSymbol]
                )

                resolverContextsByRootSpans[rootContextSpanId] =
                  resolverContextsByRootSpans[rootContextSpanId] ?? {}
              }

              const resolverIndexInList = Number.isInteger(path.prev?.key)
                ? `[${path.prev?.key}]`
                : ''

              const resolverSpan = tracer.startSpan(
                `${parentType.toString()}.${fieldName}${resolverIndexInList}`,
                {
                  attributes: {
                    [AttributeName.RESOLVER_FIELD_NAME]: fieldName,
                    [AttributeName.RESOLVER_TYPE_NAME]: parentType.toString(),
                    [AttributeName.RESOLVER_RESULT_TYPE]: returnType.toString(),
                    'meta.span.path': getResolverSpanKey(path),
                  },
                },
                ctx
              )

              const resolverCtx = openTelTrace.setSpan(ctx, resolverSpan)

              resolverContextsByRootSpans[rootContextSpanId][
                getResolverSpanKey(path)
              ] = resolverCtx

              return ({ result }) => {
                if (result instanceof Error) {
                  resolverSpan.setAttributes({
                    error: true,
                    'exception.category':
                      AttributeName.RESOLVER_EXECUTION_ERROR,
                    'exception.message': result.message,
                    'exception.type': result.name,
                  })
                  resolverSpan.recordException(result)
                }

                resolverSpan.end()
              }
            }

            return () => {}
          })
        )
      },
      onExecute({ args, extendContext }) {
        const operationType = args.document.definitions
          .filter((def) => def.kind === Kind.OPERATION_DEFINITION)
          .map((def) => (def as OperationDefinitionNode).operation)?.[0]

        // Span name according to Semantic Conventions
        // https://github.com/open-telemetry/semantic-conventions
        let spanName = 'GraphQL Operation'

        if (operationType && args.operationName) {
          spanName = `${operationType} ${args.operationName}`
        } else if (operationType && !args.operationName) {
          spanName = operationType
        }

        const executionSpan = tracer.startSpan(spanName, {
          kind: SpanKind.SERVER,
          attributes: {
            [AttributeName.EXECUTION_OPERATION_NAME]:
              args.operationName ?? undefined,
            [AttributeName.EXECUTION_OPERATION_TYPE]:
              operationType ?? undefined,
            [AttributeName.EXECUTION_OPERATION_DOCUMENT]: print(args.document),
          },
        })

        const executeContext = openTelContext.active()

        const resultCbs: OnExecuteHookResult<PluginContext> = {
          onExecuteDone({ result }) {
            if (isAsyncIterable(result)) {
              executionSpan.end()
              // eslint-disable-next-line no-console
              console.warn(
                `Plugin "newrelic" encountered a AsyncIterator which is not supported yet, so tracing data is not available for the operation.`
              )

              return
            }

            const logRecord: LogRecord = {
              context: executeContext,
              attributes: {
                'service.name': 'faststore-api',
                'service.version': '1.12.38',
                'service.name_and_version': 'faststore-api@1.12.38',
                'vtex.search_index': 'faststore_beta_api',
                [AttributeName.EXECUTION_OPERATION_NAME]:
                  args.operationName ?? undefined,
                [AttributeName.EXECUTION_OPERATION_DOCUMENT]: print(
                  args.document
                ),
                [AttributeName.EXECUTION_VARIABLES]: JSON.stringify(
                  args.variableValues ?? {}
                ),
              },
            }

            if (
              typeof result.data !== 'undefined' &&
              !(result.errors && result.errors.length > 0)
            ) {
              logRecord.severityNumber = SeverityNumber.INFO
              logRecord.severityText = 'Info'
              logRecord.attributes![AttributeName.EXECUTION_RESULT] =
                JSON.stringify(result)
            }

            if (result.errors && result.errors.length > 0) {
              logRecord.severityNumber = SeverityNumber.ERROR
              logRecord.severityText = 'Error'
              logRecord.attributes![AttributeName.EXECUTION_ERROR] =
                JSON.stringify(result.errors)

              executionSpan.setAttributes({
                error: true,
                'exception.category': AttributeName.EXECUTION_ERROR,
                'exception.message': JSON.stringify(result.errors),
              })
            }

            if (experimentalSendLogs) {
              logger.emit(logRecord)
            }

            executionSpan.end()
          },
        }

        extendContext({
          [tracingSpanSymbol]: executionSpan,
        })

        return resultCbs
      },
    }
  }
}
