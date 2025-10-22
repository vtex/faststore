import * as z from 'zod'
import { stringify as stringifyCacheControl } from '../directives/cacheControl'
import { BadRequestError, isFastStoreError } from '../platforms/errors'

const VariablesSchema = z
  .object({
    session: z
      .object({
        refreshAfter: z.string().nullish(),
      })
      .loose()
      .optional(),
  })
  .loose()

const DefaultRequestFields = z.object({
  method: z.literal(['DELETE', 'PUT', 'PATCH', 'GET', 'POST']),
  headers: z.object().loose(),
  query: z
    .object({
      operationName: z.string(),
      operationHash: z.string(),
      variables: z.string().default('{}'),
    })
    .loose()
    .optional(),
})

const RequestSchema = z.union([
  DefaultRequestFields.extend({
    method: z.literal('GET'),
    body: z.any(),
  }),
  DefaultRequestFields.extend({
    method: z.literal('POST'),
    body: z
      .object({
        operationName: z.string(),
        operationHash: z.string(),
        variables: z.union([z.string().default('{}'), z.object().loose()]),
        query: z.string().optional(),
      })
      .loose()
      .optional(),
  }),
])

export const parseNextApiRequest = (rawRequest: unknown) => {
  try {
    const request = RequestSchema.parse(rawRequest)
    const { operationName, operationHash, variables, query } =
      request.method === 'POST'
        ? (request.body ?? {})
        : {
            operationName: request.query?.operationName,
            operationHash: request.query?.operationHash,
            variables: JSON.parse(
              typeof request.query?.variables === 'string'
                ? request.query.variables
                : ''
            ),
            query: undefined,
          }

    return {
      operation: {
        __meta__: {
          operationName,
          operationHash,
        },
      },
      variables: VariablesSchema.parse(variables),
      // Do not allow queries in production, only for devMode so we can use graphql tools
      // like introspection etc. In production, we only accept known queries for better
      // security
      query: process.env.NODE_ENV !== 'production' ? query : undefined,
    }
  } catch (error) {
    throw new BadRequestError(
      `Invalid request. Please check the request. ${error}`
    )
  }
}

export function withParsedGraphqlContext(next?: APIHandler): APIHandler {
  return async (request, response, context) => {
    const { operation, variables, query } = parseNextApiRequest(request)

    const operationName = operation.__meta__.operationName
    // if (!operationName) return response.status(500).send('Invalid request')

    // Prevents to call ValidateSession or ValidateCartMutation without session (required) and get GraphQLError
    if (
      operationName &&
      ['ValidateSession', 'ValidateCartMutation'].includes(operationName) &&
      !variables?.session
    ) {
      return
    }

    context.operationName = operationName
    context.variables = variables
    context.query = query

    next?.(request, response, context)

    const { data, errors, extensions } = await context['graphqlRunner']?.(
      {
        operation,
        variables,
        query,
      },
      request
    )

    const hasErrors = Array.isArray(errors) && errors.length > 0
    if (hasErrors) {
      const error = errors.find(isFastStoreError)
      console.error(error)

      response.status(error?.extensions.status ?? 500).end()
      return
    }

    const setCookieValues = Array.from(extensions.cookies?.values() ?? [])

    if (request.method === 'GET') {
      const cacheControl = extensions.cacheControl
        ? stringifyCacheControl(extensions.cacheControl)
        : 'no-cache, no-store'

      response.setHeader('cache-control', cacheControl)
    }

    if (setCookieValues.length > 0) {
      response.setHeader(
        'set-cookie',
        setCookieValues.map(({ setCookie }) =>
          process.env.NODE_ENV !== 'production'
            ? replaceSetCookieDomain(request, setCookie)
            : setCookie
        )
      )
    }

    response.setHeader('content-type', 'application/json')
    response.send(JSON.stringify({ data, errors }))
    return
  }
}

/**
 * This function replaces the setCookie domain so that we can use localhost in dev environment.
 *
 * @param request APIRequest
 * @param setCookie setCookie string that comes from FastStore API
 * @returns setCookie string with it domains replace
 */
function replaceSetCookieDomain(request: APIRequest, setCookie: string) {
  const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i
  const faststoreAPIHostname = new URL(`https://${request.headers.host}`)
    .hostname

  // Replaces original cookie domain for FastStore API's domain hostname
  return setCookie.replace(
    MATCH_DOMAIN_REGEXP,
    `; domain=${faststoreAPIHostname}`
  )
}
