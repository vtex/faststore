import { BadRequestError, UnauthorizedError } from '../platforms/errors'
import { withAuthentication } from './withAuthentication'
import { withConfigContext } from './withConfigContext'
import { withParsedGraphqlContext } from './withGraphqlContext'

export function Handler(config: any, graphqlRunner: Context['graphqlRunner']) {
  const configMiddleware = withConfigContext(config)

  return (request: APIRequest, response: APIResponse) => {
    if (request.method !== 'POST' && request.method !== 'GET') {
      response.status(405).end()

      return
    }

    try {
      // @ts-expect-error Context must be filled during handlers
      const newContext: Context = {
        graphqlRunner,
      }
      configMiddleware(withParsedGraphqlContext(withAuthentication()))(
        request,
        response,
        newContext
      )
      return
    } catch (err) {
      console.error(err)

      if (err instanceof BadRequestError) {
        return response.status(400).end()
      }

      if (err instanceof UnauthorizedError) {
        return response.status(401).end()
      }

      return response.status(500).end()
    }
  }
}
