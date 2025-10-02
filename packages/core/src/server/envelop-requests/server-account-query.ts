import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerAccountPageQueryQuery,
  ServerAccountPageQueryQueryVariables,
} from '../../../@generated/graphql'

export function serverAccountRequest(context: {
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerAccountPageQueryQueryVariables,
    ServerAccountPageQueryQuery
  >(
    {
      variables: {},
      operation: query,
    },
    { headers: { ...context.req.headers } }
  )
}

const query = gql(`
  query ServerAccountPageQuery {
    accountProfile {
      name
    }
  }
`)
