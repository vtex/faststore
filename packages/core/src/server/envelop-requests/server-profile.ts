import { ServerExecuteFunction } from '..'
import { gql } from '../../../@generated/gql'
import type {
  ServerProfileQueryQuery,
  ServerProfileQueryQueryVariables,
} from '../../../@generated/graphql'

const query = gql(`
  query ServerProfileQuery {
    accountName
    accountProfile {
      name
      email
      id
    }
  }
`)

export function serverProfileRequest(context: {
  req: { headers: Record<string, unknown> }
}) {
  return ServerExecuteFunction<
    ServerProfileQueryQueryVariables,
    ServerProfileQueryQuery
  >(
    {
      variables: {},
      operation: query,
    },
    { headers: { ...context.req.headers } }
  )
}
